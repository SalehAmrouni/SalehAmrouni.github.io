// The retro desktop: floating windows on wide screens with a mouse, stacked windows on phones.
import {
  escapeHTML, loadProject, loadProjects, renderCard, renderDetail, renderFilters, wireCardVideos, wireDetail,
} from './projects.js';
import { startPhysics } from './physics.js';
import { WindowManager } from './wm.js';

const osQuery = window.matchMedia('(min-width: 900px) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isOS = () => osQuery.matches;

const canvas = document.getElementById('physics-canvas');
const desktop = document.getElementById('desktop');
const taskbar = document.querySelector('.taskbar');
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
const projectsById = new Map();

function storage(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch { /* private mode etc. */ }
  return null;
}

// ---------- Physics ----------
const physics = startPhysics(canvas, {
  colliders: () => (isOS() ? desktop.querySelectorAll('.window:not([hidden]):not(.minimized)') : []),
  floor: () => window.innerHeight - taskbar.offsetHeight,
});

const cubesToggle = document.getElementById('cubes-toggle');
function setCubes(on) {
  physics.setEnabled(on);
  cubesToggle.setAttribute('aria-pressed', String(on));
  storage('cubes', on ? 'on' : 'off');
}
setCubes(storage('cubes') !== 'off');
cubesToggle.addEventListener('click', () => setCubes(cubesToggle.getAttribute('aria-pressed') !== 'true'));

// Hold the mouse on empty desktop space to pour cubes.
let pouring = null;
window.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  if (e.target !== canvas && e.target !== desktop) return;
  for (const icon of document.querySelectorAll('.desk-icon.selected')) icon.classList.remove('selected');
  const pos = { x: e.clientX, y: e.clientY };
  physics.spawn(pos.x, pos.y);
  const move = (ev) => { pos.x = ev.clientX; pos.y = ev.clientY; };
  window.addEventListener('pointermove', move);
  pouring = { timer: setInterval(() => physics.spawn(pos.x, pos.y), 40), move };
});
window.addEventListener('pointerup', () => {
  if (!pouring) return;
  clearInterval(pouring.timer);
  window.removeEventListener('pointermove', pouring.move);
  pouring = null;
});

// ---------- Windows ----------
const wm = new WindowManager({
  desktop,
  taskButtons: document.getElementById('task-buttons'),
  isOS,
  onClose(key, rect) {
    if (key.startsWith('project:')) {
      if (location.hash === `#project=${key.slice(8)}`) history.replaceState(null, '', location.pathname + location.search);
      if (!desktop.querySelector('.window.mobile-full:not([hidden])')) document.body.classList.remove('no-scroll');
    }
    // A little puff of cubes where the window was.
    if (isOS()) physics.burst(rect.left + rect.width / 2, rect.top + 12, 10);
  },
});

for (const el of desktop.querySelectorAll('.window[data-win]')) wm.register(el);

function windowShell({ key, label, title }) {
  const el = document.createElement('section');
  el.className = 'window';
  el.dataset.win = key;
  el.dataset.label = label;
  el.dataset.dynamic = 'true';
  el.setAttribute('aria-label', label);
  el.innerHTML = `
    <div class="title-bar">
      <span class="title">${escapeHTML(title)}</span>
      <div class="window-controls">
        <button type="button" data-action="minimize" aria-label="Minimize" aria-expanded="true">_</button>
        <button type="button" data-action="maximize" aria-label="Maximize" class="os-only">&#9633;</button>
        <button type="button" data-action="close" aria-label="Close" class="close">X</button>
      </div>
    </div>
    <div class="window-body"></div>
  `;
  desktop.append(el);
  wm.register(el);
  return el;
}

// New windows cascade down-right from the top-left so they never stack exactly.
let cascade = 0;
function placeNew(key, width, height) {
  const bw = desktop.clientWidth;
  const bh = desktop.clientHeight;
  const w = Math.min(width, bw - 140);
  const h = Math.min(height, bh - 40);
  const step = (cascade++ % 6) * 28;
  wm.place(key, {
    x: Math.min(150 + step, bw - w - 10),
    y: Math.min(20 + step, bh - h - 10),
    w,
    h,
  });
}

async function openProject(id, { push = true } = {}) {
  const key = `project:${id}`;
  if (push && location.hash !== `#project=${id}`) history.pushState(null, '', `#project=${id}`);

  if (!wm.has(key)) {
    const el = windowShell({ key, label: `${id.toUpperCase()}.EXE`, title: `C:\\PORTFOLIO\\${id.toUpperCase()}.EXE` });
    const body = el.querySelector('.window-body');
    body.classList.add('detail');
    body.innerHTML = '<p class="loading-text">LOADING PROJECT FILES...</p>';
    placeNew(key, 880, 760);

    try {
      const project = projectsById.get(id) || await loadProject(id);
      body.innerHTML = renderDetail(project);
      wireDetail(body, project);
      body.insertAdjacentHTML('beforeend', `<p class="detail-permalink"><a href="${project.pageUrl}" target="_blank" rel="noopener">Open as a standalone page &#8599;</a></p>`);
    } catch (err) {
      console.error(err);
      body.innerHTML = `<p class="error-text">File not found: ${escapeHTML(id.toUpperCase())}.EXE</p>`;
    }
  }

  const el = wm.element(key);
  el.classList.toggle('mobile-full', !isOS());
  if (!isOS()) document.body.classList.add('no-scroll');
  wm.open(key);
  if (!isOS()) el.querySelector('.window-body').scrollTop = 0;
}

function openRecycleBin() {
  const key = 'bin';
  if (!wm.has(key)) {
    const el = windowShell({ key, label: 'RECYCLE BIN', title: 'C:\\RECYCLED' });
    el.querySelector('.window-body').innerHTML = `
      <p><b>0 FILE(S)</b> &nbsp;0 BYTES FREE TO RECLAIM</p>
      <p class="hint">All the bugs were fixed before they got here. Probably.</p>
    `;
    placeNew(key, 420, 200);
    el.style.height = 'auto';
  }
  wm.open(key);
}

function openTarget(target) {
  if (target === 'bin') openRecycleBin();
  else if (target.startsWith('project:')) openProject(target.slice(8));
  else wm.open(target);
}

// ---------- Desktop icons ----------
const icons = document.getElementById('desktop-icons');
icons.addEventListener('click', (e) => {
  const icon = e.target.closest('.desk-icon');
  if (!icon) return;
  for (const other of icons.querySelectorAll('.desk-icon')) other.classList.toggle('selected', other === icon);
  // Keyboard activation (detail 0) opens right away; mouse needs a double-click, like the real thing.
  if (e.detail === 0) activateIcon(icon);
});
icons.addEventListener('dblclick', (e) => {
  const icon = e.target.closest('.desk-icon');
  if (icon) activateIcon(icon);
});

function activateIcon(icon) {
  if (icon.dataset.href) window.open(icon.dataset.href, '_blank', 'noopener');
  else openTarget(icon.dataset.open);
}

// ---------- Start menu ----------
function setStartMenu(open) {
  startMenu.hidden = !open;
  startBtn.setAttribute('aria-expanded', String(open));
  if (open) startMenu.querySelector('[role="menuitem"]')?.focus();
}

startBtn.addEventListener('click', () => setStartMenu(startMenu.hidden));
startMenu.addEventListener('click', (e) => {
  const item = e.target.closest('[role="menuitem"]');
  if (!item) return;
  setStartMenu(false);
  if (item.dataset.open) openTarget(item.dataset.open);
  else if (item.dataset.action === 'shutdown') shutDown();
});
document.addEventListener('pointerdown', (e) => {
  if (!startMenu.hidden && !startMenu.contains(e.target) && !startBtn.contains(e.target)) setStartMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || document.querySelector('.lightbox')) return;
  if (!startMenu.hidden) {
    setStartMenu(false);
    startBtn.focus();
  }
});

// ---------- Clock ----------
const clock = document.getElementById('clock');
function tick() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  clock.dateTime = now.toISOString();
}
tick();
setInterval(tick, 15000);

// ---------- Layout ----------
let laidOut = false;
function initialLayout() {
  const bw = desktop.clientWidth;
  const bh = desktop.clientHeight;
  const pw = Math.min(1000, bw - 180);
  const px = Math.max(140, bw - pw - 40);
  const py = Math.min(170, bh * 0.22);
  wm.place('projects', { x: px, y: py, w: pw, h: bh - py - 20 });
  wm.place('about', { x: 130, y: 24, w: Math.min(620, bw - 170) });
  laidOut = true;
}

function applyMode() {
  const os = isOS();
  document.body.classList.toggle('os', os);
  if (os && !laidOut) initialLayout();
  if (os) wm.clampAll();
  for (const el of desktop.querySelectorAll('.window[data-dynamic]')) {
    el.classList.toggle('mobile-full', !os && el.dataset.win.startsWith('project:'));
  }
  if (os) document.body.classList.remove('no-scroll');
  else if (desktop.querySelector('.window.mobile-full:not([hidden]):not(.minimized)')) document.body.classList.add('no-scroll');
}

// Until the visitor moves or resizes something, keep the starting layout fitted to the screen.
let arranged = false;
desktop.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.title-bar') || e.target.classList.contains('window')) arranged = true;
});

osQuery.addEventListener('change', applyMode);
window.addEventListener('resize', () => {
  if (!isOS()) return;
  if (!arranged) initialLayout();
  wm.clampAll();
});
applyMode();
wm.focus('projects');

// ---------- Projects ----------
const grid = document.getElementById('projects-container');
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.project-card');
  if (!card || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openProject(card.dataset.id);
});

async function showProjects() {
  const filters = document.getElementById('project-filters');
  try {
    const projects = await loadProjects();
    if (!projects.length) throw new Error('No projects listed');
    for (const p of projects) projectsById.set(p.id, p);
    grid.replaceChildren(...projects.map(renderCard));
    renderFilters(filters, grid, projects);
    wireCardVideos(grid);
    document.querySelector('.filter-status').textContent = `${projects.length} FILE(S) FOUND`;

    document.getElementById('start-programs').innerHTML = projects.map((p) => `
      <li role="none"><button type="button" role="menuitem" data-open="project:${escapeHTML(p.id)}">
        <svg><use href="#icon-exe"/></svg>${escapeHTML(p.title)}
      </button></li>`).join('');

    const featured = projects.find((p) => p.featured);
    if (featured) {
      icons.querySelector('li:last-child').insertAdjacentHTML('beforebegin', `
        <li><button type="button" class="desk-icon" data-open="project:${escapeHTML(featured.id)}">
          <svg><use href="#icon-exe"/></svg><span>${escapeHTML(featured.id.toUpperCase())}<wbr>.EXE</span>
        </button></li>`);
    }
    return projects;
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="error-text">ERROR: could not read C:\\PORTFOLIO\\PROJECTS. Try refreshing.</p>';
    return [];
  } finally {
    grid.setAttribute('aria-busy', 'false');
  }
}

// ---------- Deep links ----------
function routeFromHash() {
  const match = location.hash.match(/^#project=([a-z0-9_-]+)$/i);
  if (match) {
    openProject(match[1], { push: false });
    return true;
  }
  // Back button on a phone closes the full-screen project instead of leaving the site.
  for (const el of desktop.querySelectorAll('.window.mobile-full:not([hidden])')) wm.close(el.dataset.win);
  const plain = location.hash.slice(1);
  if (plain === 'about' || plain === 'projects' || plain === 'contact') {
    wm.open(plain === 'contact' ? 'about' : plain);
    return true;
  }
  return false;
}
window.addEventListener('popstate', routeFromHash);

// ---------- Boot + shut down ----------
const bootScreen = document.getElementById('boot-screen');
const bootLog = document.getElementById('boot-log');

// `projectCount` may be a promise; the boot log waits on it at the PROJECTS line.
function boot(projectCount) {
  return new Promise((resolve) => {
    const lines = [
      'SALEH-OS BIOS v2.6   (C) 2026 SALEH AMROUNI',
      '',
      'CPU ............ C/C++ @ 60 FPS     OK',
      'MEMORY TEST .... 640K               OK',
      'LOADING PHYSICS.SYS ...             OK',
      async () => `LOADING PROJECTS.DAT ...            ${await projectCount} FOUND`,
      '',
      'STARTING DESKTOP...',
    ];
    const pause = (ms) => new Promise((r) => { setTimeout(r, ms); });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('keydown', finish);
      bootScreen.removeEventListener('pointerdown', finish);
      bootScreen.classList.add('fading');
      setTimeout(() => {
        bootScreen.hidden = true;
        bootScreen.classList.remove('fading');
        resolve();
      }, 250);
    };

    bootScreen.hidden = false;
    bootLog.textContent = '';
    window.addEventListener('keydown', finish);
    bootScreen.addEventListener('pointerdown', finish);
    (async () => {
      for (const line of lines) {
        await pause(140);
        if (done) return;
        bootLog.textContent += `${typeof line === 'function' ? await line() : line}\n`;
      }
      await pause(450);
      finish();
    })();
  });
}

function shutDown() {
  const screen = document.getElementById('shutdown-screen');
  physics.clear();
  screen.hidden = false;
  document.getElementById('reboot-btn').focus();
}

document.getElementById('reboot-btn').addEventListener('click', async () => {
  document.getElementById('shutdown-screen').hidden = true;
  for (const el of [...desktop.querySelectorAll('.window[data-dynamic]')]) wm.close(el.dataset.win);
  await boot(projectsById.size);
  wm.open('about');
  wm.open('projects');
});

// ---------- Start up ----------
const projectsReady = showProjects();
let shouldBoot = false;
try { shouldBoot = !sessionStorage.getItem('booted'); sessionStorage.setItem('booted', '1'); } catch { /* ignore */ }
if (shouldBoot && !reduceMotion.matches && !location.hash) {
  boot(projectsReady.then((projects) => projects.length));
}
routeFromHash();
