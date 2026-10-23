// Tiny window manager: focus/z-order, dragging, minimize/maximize/close and taskbar buttons.
// Windows are any element with [data-win] (a unique key) and [data-label] (taskbar text).

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export class WindowManager {
  /**
   * desktop:     element the windows live in (their positioning parent in OS mode)
   * taskButtons: container for one button per open window
   * isOS:        () => boolean, true when windows float and can be dragged
   * onClose:     (key, rect) => void
   */
  constructor({ desktop, taskButtons, isOS, onClose }) {
    this.desktop = desktop;
    this.taskButtons = taskButtons;
    this.isOS = isOS;
    this.onClose = onClose;
    this.z = 10;
    this.windows = new Map();
  }

  has(key) {
    return this.windows.has(key);
  }

  element(key) {
    return this.windows.get(key)?.el;
  }

  register(el) {
    const key = el.dataset.win;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'task-btn';
    btn.textContent = el.dataset.label || key;
    btn.addEventListener('click', () => {
      const active = el.classList.contains('active') && !this.isHidden(el);
      if (active) this.minimize(key);
      else this.open(key);
    });
    this.windows.set(key, { el, btn });

    el.addEventListener('pointerdown', () => this.focus(key), true);
    el.addEventListener('focusin', () => this.focus(key));

    for (const control of el.querySelectorAll('.window-controls [data-action]')) {
      control.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = control.dataset.action;
        if (action === 'minimize') this.minimize(key);
        else if (action === 'maximize') this.toggleMaximize(key);
        else if (action === 'close') this.close(key);
      });
    }

    const bar = el.querySelector('.title-bar');
    bar.addEventListener('pointerdown', (e) => this.startDrag(e, el, bar));
    bar.addEventListener('dblclick', (e) => {
      if (this.isOS() && !e.target.closest('button, a')) this.toggleMaximize(key);
    });

    if (!el.hidden) this.taskButtons.append(btn);
    return key;
  }

  isHidden(el) {
    return el.hidden || el.classList.contains('minimized') || el.classList.contains('collapsed');
  }

  open(key) {
    const entry = this.windows.get(key);
    if (!entry) return;
    const { el, btn } = entry;
    el.hidden = false;
    el.classList.remove('minimized', 'collapsed');
    el.querySelector('[data-action="minimize"]')?.setAttribute('aria-expanded', 'true');
    if (!btn.isConnected) this.taskButtons.append(btn);
    this.focus(key);
    if (!this.isOS() && !el.classList.contains('mobile-full')) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  focus(key) {
    const entry = this.windows.get(key);
    if (!entry || entry.el.classList.contains('active')) return;
    for (const { el, btn } of this.windows.values()) {
      el.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
    entry.el.classList.add('active');
    entry.el.style.zIndex = String(++this.z);
    entry.btn.setAttribute('aria-pressed', 'true');
  }

  focusTopmost() {
    let best = null;
    for (const [key, { el }] of this.windows) {
      if (this.isHidden(el)) continue;
      if (!best || Number(el.style.zIndex || 0) > Number(this.windows.get(best).el.style.zIndex || 0)) best = key;
    }
    if (best) this.focus(best);
  }

  minimize(key) {
    const { el, btn } = this.windows.get(key);
    // Floating windows drop to the taskbar; stacked (mobile) windows fold up to their title bar.
    el.classList.add(this.isOS() || el.classList.contains('mobile-full') ? 'minimized' : 'collapsed');
    el.querySelector('[data-action="minimize"]')?.setAttribute('aria-expanded', 'false');
    el.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
    this.focusTopmost();
  }

  toggleMaximize(key) {
    const { el } = this.windows.get(key);
    const maximized = el.classList.toggle('maximized');
    el.querySelector('[data-action="maximize"]')?.setAttribute('aria-label', maximized ? 'Restore' : 'Maximize');
    this.focus(key);
  }

  close(key) {
    const entry = this.windows.get(key);
    if (!entry) return;
    const { el, btn } = entry;
    const rect = el.getBoundingClientRect();
    el.hidden = true;
    el.classList.remove('active', 'maximized', 'minimized', 'collapsed');
    btn.remove();
    if (el.dataset.dynamic) {
      el.remove();
      this.windows.delete(key);
    }
    this.onClose?.(key, rect);
    this.focusTopmost();
  }

  place(key, { x, y, w, h }) {
    const { el } = this.windows.get(key);
    if (x !== undefined) el.style.left = `${Math.round(x)}px`;
    if (y !== undefined) el.style.top = `${Math.round(y)}px`;
    if (w !== undefined) el.style.width = `${Math.round(w)}px`;
    if (h !== undefined) el.style.height = `${Math.round(h)}px`;
  }

  // Keeps every title bar reachable after the browser window shrinks.
  clampAll() {
    const bw = this.desktop.clientWidth;
    const bh = this.desktop.clientHeight;
    for (const { el } of this.windows.values()) {
      if (el.hidden || !el.style.left) continue;
      const w = Math.min(el.offsetWidth, bw);
      const h = Math.min(el.offsetHeight, bh);
      if (el.offsetWidth > bw) el.style.width = `${w}px`;
      if (el.offsetHeight > bh) el.style.height = `${h}px`;
      el.style.left = `${clamp(el.offsetLeft, 0, Math.max(0, bw - w))}px`;
      el.style.top = `${clamp(el.offsetTop, 0, Math.max(0, bh - 32))}px`;
    }
  }

  startDrag(e, el, bar) {
    if (!this.isOS() || e.button !== 0 || e.target.closest('button, a') || el.classList.contains('maximized')) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const ox = el.offsetLeft;
    const oy = el.offsetTop;
    try { bar.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    el.classList.add('dragging');

    const move = (ev) => {
      const bw = this.desktop.clientWidth;
      const bh = this.desktop.clientHeight;
      el.style.left = `${clamp(ox + ev.clientX - startX, 80 - el.offsetWidth, bw - 80)}px`;
      el.style.top = `${clamp(oy + ev.clientY - startY, 0, bh - 32)}px`;
    };
    const end = () => {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', end);
      bar.removeEventListener('pointercancel', end);
      el.classList.remove('dragging');
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }
}
