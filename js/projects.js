// Shared project loading and rendering, used by the desktop and the standalone project page.

const ID_PATTERN = /^[a-z0-9_-]+$/i;

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

// Turns plain text with line breaks into <p> blocks.
export function paragraphs(text) {
  return String(text ?? '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHTML(line)}</p>`)
    .join('');
}

export async function loadProject(id) {
  if (!ID_PATTERN.test(id || '')) throw new Error(`Invalid project id: ${id}`);
  const base = `projects/${id}`;
  const res = await fetch(`${base}/meta.json`);
  if (!res.ok) throw new Error(`${base}/meta.json returned ${res.status}`);
  const meta = await res.json();
  return {
    tags: [],
    images: [],
    videos: [],
    ...meta,
    id,
    base,
    thumbnailUrl: `${base}/${meta.thumbnail || 'thumbnail.png'}`,
    pageUrl: `project.html?p=${encodeURIComponent(id)}`,
  };
}

// Loads every project listed in projects.json in parallel, keeping the listed order.
export async function loadProjects() {
  const res = await fetch('projects/projects.json');
  if (!res.ok) throw new Error(`projects/projects.json returned ${res.status}`);
  const ids = await res.json();
  const results = await Promise.all(ids.map((id) => loadProject(id).catch((err) => {
    console.error(`Skipping project "${id}":`, err);
    return null;
  })));
  return results.filter(Boolean);
}

function tagsHTML(tags) {
  return tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join('');
}

// A whole-card link. Featured cards get a wide layout with an autoplaying preview.
export function renderCard(project) {
  const card = document.createElement('a');
  card.className = 'project-card' + (project.featured ? ' featured' : '');
  card.href = project.pageUrl;
  card.dataset.id = project.id;
  card.dataset.tags = project.tags.join('|');

  const video = project.hasHoverVideo
    ? `<video class="hover-video" src="${project.base}/hover.mp4" loop muted playsinline preload="none" aria-hidden="true"></video>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <span>${escapeHTML(project.id.toUpperCase())}.DAT</span>
      ${project.featured ? '<span class="featured-badge">&#9733; FEATURED</span>' : ''}
    </div>
    <div class="img-wrapper">
      <div class="tags-overlay">${tagsHTML(project.tags)}</div>
      <img src="${project.thumbnailUrl}" alt="" loading="lazy" decoding="async">
      ${video}
    </div>
    <div class="card-content">
      <h3>${escapeHTML(project.title)}</h3>
      <div class="card-desc">${paragraphs(project.description)}</div>
      <span class="retro-btn card-cta">[ OPEN PROJECT ]</span>
    </div>
  `;
  return card;
}

// Hover previews: play on hover with a mouse; on touch screens (or for the featured
// card) play while the card is on screen instead.
export function wireCardVideos(root) {
  const canHover = window.matchMedia('(hover: hover)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target.querySelector('.hover-video');
      if (entry.isIntersecting) playPreview(entry.target, video);
      else stopPreview(entry.target, video);
    }
  }, { threshold: 0.6 });

  for (const card of root.querySelectorAll('.project-card')) {
    const video = card.querySelector('.hover-video');
    if (!video) continue;
    if (reduceMotion) continue;
    if (!canHover || card.classList.contains('featured')) {
      observer.observe(card);
    } else {
      card.addEventListener('mouseenter', () => playPreview(card, video));
      card.addEventListener('mouseleave', () => stopPreview(card, video));
      card.addEventListener('focus', () => playPreview(card, video));
      card.addEventListener('blur', () => stopPreview(card, video));
    }
  }
}

function playPreview(card, video) {
  card.classList.add('previewing');
  video.play().catch(() => {});
}

function stopPreview(card, video) {
  card.classList.remove('previewing');
  video.pause();
}

// Builds the tag filter bar. Tags are ordered by how many projects use them.
export function renderFilters(bar, grid, projects) {
  const counts = new Map();
  for (const p of projects) for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);

  bar.innerHTML = ['ALL', ...tags].map((t) => `
    <button type="button" class="filter-btn" data-tag="${escapeHTML(t)}" aria-pressed="${t === 'ALL'}">${escapeHTML(t)}</button>
  `).join('');

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const tag = btn.dataset.tag;
    for (const b of bar.querySelectorAll('.filter-btn')) b.setAttribute('aria-pressed', String(b === btn));
    let shown = 0;
    for (const card of grid.querySelectorAll('.project-card')) {
      const match = tag === 'ALL' || card.dataset.tags.split('|').includes(tag);
      card.hidden = !match;
      if (match) shown++;
    }
    grid.dataset.filtered = tag === 'ALL' ? '' : 'true';
    const status = bar.parentElement.querySelector('.filter-status');
    if (status) status.textContent = `${shown} FILE(S) FOUND`;
  });
}

function section(title, body) {
  return body ? `<section class="detail-section"><h2>${title}</h2>${body}</section>` : '';
}

// Full project write-up. Returns HTML; call wireDetail() on the container afterwards.
export function renderDetail(project) {
  const { base } = project;
  const images = project.images.map((img) => `${base}/images/${img}`);
  const videos = project.videos.map((vid) => `${base}/videos/${vid}`);

  // Lead with motion when there is any: the first video, else the hover clip, else the first image.
  let hero = '';
  let galleryVideos = videos;
  let galleryImages = images;
  if (videos.length) {
    hero = `<video class="detail-hero" src="${videos[0]}" controls playsinline preload="metadata" poster="${project.thumbnailUrl}"></video>`;
    galleryVideos = videos.slice(1);
  } else if (project.hasHoverVideo) {
    hero = `<video class="detail-hero" src="${base}/hover.mp4" autoplay loop muted playsinline poster="${project.thumbnailUrl}"></video>`;
  } else if (images.length) {
    hero = `<button type="button" class="detail-hero media-open" data-index="0"><img src="${images[0]}" alt="${escapeHTML(project.title)} screenshot 1"></button>`;
    galleryImages = images.slice(1);
  } else {
    hero = `<img class="detail-hero" src="${project.thumbnailUrl}" alt="${escapeHTML(project.title)}">`;
  }

  const offset = images.length - galleryImages.length;
  const gallery = [
    ...galleryImages.map((src, i) => `
      <button type="button" class="media-card media-open" data-index="${i + offset}" aria-label="Enlarge screenshot ${i + offset + 1}">
        <img src="${src}" alt="${escapeHTML(project.title)} screenshot ${i + offset + 1}" loading="lazy" decoding="async">
      </button>`),
    ...galleryVideos.map((src) => `
      <div class="media-card"><video src="${src}" controls playsinline preload="metadata"></video></div>`),
    ...(project.youtube || []).map((id) => `
      <div class="media-card"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}" title="${escapeHTML(project.title)} video" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`),
  ].join('');

  const buttons = [
    project.hasDownload
      ? `<a href="${base}/download/download.zip" download="${escapeHTML(project.id)}.zip" class="retro-btn primary">[ DOWNLOAD ${escapeHTML(project.id.toUpperCase())}.ZIP ]</a>`
      : '',
    project.liveUrl
      ? `<a href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener" class="retro-btn">[ VISIT SITE ]</a>`
      : '',
    project.githubUrl
      ? `<a href="${escapeHTML(project.githubUrl)}" target="_blank" rel="noopener" class="retro-btn">[ VIEW SOURCE ]</a>`
      : '',
  ].join('');

  return `
    <header class="detail-header">
      <h1>&gt; ${escapeHTML(project.title)}</h1>
      <div class="tag-row">${tagsHTML(project.tags)}</div>
    </header>
    <div class="detail-hero-wrap">${hero}</div>
    ${buttons ? `<div class="btn-row">${buttons}</div>` : ''}
    ${section('ABOUT', paragraphs(project.description))}
    ${section('HOW IT WORKS', paragraphs(project.howItWorks))}
    ${section('RUN IT', paragraphs(project.run))}
    ${section('REQUIREMENTS', paragraphs(project.requirements))}
    ${gallery ? section('MEDIA', `<div class="media-grid">${gallery}</div>`) : ''}
  `;
}

export function wireDetail(container, project) {
  const images = project.images.map((img) => `${project.base}/images/${img}`);
  container.addEventListener('click', (e) => {
    const opener = e.target.closest('.media-open');
    if (opener) openLightbox(images, Number(opener.dataset.index), project.title);
  });
}

// Full-screen image viewer with arrow-key / swipe navigation.
export function openLightbox(images, start, title) {
  let index = start;
  const previousFocus = document.activeElement;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', `${title} screenshots`);
  box.innerHTML = `
    <div class="lightbox-bar">
      <span class="lightbox-count"></span>
      <button type="button" class="lightbox-close" aria-label="Close">X</button>
    </div>
    <div class="lightbox-stage">
      <button type="button" class="lightbox-nav prev" aria-label="Previous">&lt;</button>
      <img alt="">
      <button type="button" class="lightbox-nav next" aria-label="Next">&gt;</button>
    </div>
  `;
  const img = box.querySelector('img');
  const count = box.querySelector('.lightbox-count');
  const multiple = images.length > 1;
  box.querySelectorAll('.lightbox-nav').forEach((b) => { b.hidden = !multiple; });

  function show(i) {
    index = (i + images.length) % images.length;
    img.src = images[index];
    img.alt = `${title} screenshot ${index + 1}`;
    count.textContent = `IMAGE ${index + 1} / ${images.length}`;
  }

  function close() {
    document.removeEventListener('keydown', onKey);
    box.remove();
    document.body.classList.remove('no-scroll');
    previousFocus?.focus?.();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && multiple) show(index - 1);
    else if (e.key === 'ArrowRight' && multiple) show(index + 1);
  }

  box.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox-close') || e.target === box || e.target.classList.contains('lightbox-stage')) close();
    else if (e.target.closest('.prev')) show(index - 1);
    else if (e.target.closest('.next')) show(index + 1);
  });

  let touchX = null;
  box.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (touchX === null || !multiple) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  document.addEventListener('keydown', onKey);
  document.body.appendChild(box);
  document.body.classList.add('no-scroll');
  show(index);
  box.querySelector('.lightbox-close').focus();
}
