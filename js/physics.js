// Background cube physics. Cubes fall, stack on each other, land on any collider
// elements (e.g. windows), get shoved when those elements move, and fade out over time.

const PALETTE = ['#22d3c5', '#22d3c5', '#f5b942', '#e6edf3', '#5b6778', '#ff5f7a'];
const GRAVITY = 1100;
const RESTITUTION = 0.25;
const FRICTION = 8;
const MAX_BODIES = 120;
const LIFETIME = [14, 24];
const FADE = 1.2;

class Cube {
  constructor(x, y, vx, vy) {
    this.size = Math.random() * 14 + 14;
    this.half = this.size / 2;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 6;
    this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    this.age = 0;
    this.life = LIFETIME[0] + Math.random() * (LIFETIME[1] - LIFETIME[0]);
    this.grounded = false;
  }

  get alpha() {
    const fadeIn = Math.min(this.age / 0.25, 1);
    const fadeOut = Math.min(Math.max((this.life - this.age) / FADE, 0), 1);
    return fadeIn * fadeOut;
  }
}

// Pushes the cube out of rect r along the shallowest axis. `rv` is the rect's velocity.
function collideRect(c, r, rv) {
  const dx = c.x - (r.left + r.right) / 2;
  const dy = c.y - (r.top + r.bottom) / 2;
  const px = c.half + (r.right - r.left) / 2 - Math.abs(dx);
  const py = c.half + (r.bottom - r.top) / 2 - Math.abs(dy);
  if (px <= 0 || py <= 0) return;

  // Fully swallowed (a window opened or slid over it): it's hidden anyway, so retire it.
  if (px > c.size && py > c.size) {
    c.life = Math.min(c.life, c.age + 0.01);
    return;
  }

  if (py < px) {
    if (dy < 0) {
      c.y -= py;
      if (c.vy > rv.y) c.vy = rv.y - (c.vy - rv.y) * RESTITUTION;
      if (Math.abs(c.vy - rv.y) < 60) c.vy = rv.y;
      c.grounded = true;
      c.groundVx = rv.x;
    } else {
      c.y += py;
      if (c.vy < rv.y) c.vy = rv.y - (c.vy - rv.y) * RESTITUTION;
    }
  } else {
    c.x += dx < 0 ? -px : px;
    if ((dx < 0 && c.vx > rv.x) || (dx > 0 && c.vx < rv.x)) c.vx = rv.x - (c.vx - rv.x) * RESTITUTION;
  }
}

function collideCubes(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const px = a.half + b.half - Math.abs(dx);
  if (px <= 0) return;
  const py = a.half + b.half - Math.abs(dy);
  if (py <= 0) return;

  if (py < px) {
    const s = dy < 0 ? -1 : 1; // +1: b is below a
    a.y -= (py / 2) * s;
    b.y += (py / 2) * s;
    const rel = b.vy - a.vy;
    if (rel * s < 0) {
      // Approaching vertically: settle to a shared velocity so stacks rest instead of jittering.
      const avg = (a.vy + b.vy) / 2;
      a.vy = avg;
      b.vy = avg;
    }
    const top = s > 0 ? a : b;
    const bottom = s > 0 ? b : a;
    top.grounded = true;
    top.groundVx = bottom.vx;
  } else {
    const s = dx < 0 ? -1 : 1;
    a.x -= (px / 2) * s;
    b.x += (px / 2) * s;
    const rel = b.vx - a.vx;
    if (rel * s < 0) {
      const avg = (a.vx + b.vx) / 2;
      a.vx = avg - (rel * RESTITUTION) / 2;
      b.vx = avg + (rel * RESTITUTION) / 2;
    }
  }
}

/**
 * Starts the simulation on a full-screen canvas.
 * options.colliders: () => Element[]  elements cubes should land on / be pushed by
 * options.floor:     () => number     y of the floor in CSS px (default: bottom of the screen)
 * options.autoSpawn: seconds between cubes dropped from the top (0 disables)
 * Returns { spawn(x, y), burst(x, y, n), clear() }.
 */
export function startPhysics(canvas, options = {}) {
  const ctx = canvas.getContext('2d');
  const colliders = options.colliders || (() => []);
  const floorY = options.floor || (() => window.innerHeight);
  const autoSpawn = options.autoSpawn ?? 0.45;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const bodies = [];
  const lastRects = new WeakMap();
  let width = 0;
  let height = 0;
  let spawnTimer = 0;
  let time = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn(x, y, vx = (Math.random() - 0.5) * 300, vy = (Math.random() - 0.5) * 300) {
    if (reduceMotion.matches) return;
    if (bodies.length >= MAX_BODIES) {
      // Recycle the oldest cube instead of refusing, so clicks always feel responsive.
      const oldest = bodies.reduce((a, b) => (a.age > b.age ? a : b));
      oldest.life = Math.min(oldest.life, oldest.age + 0.3);
      if (bodies.length >= MAX_BODIES + 20) return;
    }
    bodies.push(new Cube(x, y, vx, vy));
  }

  function burst(x, y, n = 12) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 200 + Math.random() * 400;
      spawn(x, y, Math.cos(a) * speed, Math.sin(a) * speed - 200);
    }
  }

  function readColliders(dt) {
    const list = [];
    for (const el of colliders()) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const prev = lastRects.get(el);
      const v = prev && dt > 0
        ? { x: (r.left - prev.left) / dt, y: (r.top - prev.top) / dt }
        : { x: 0, y: 0 };
      // Clamp so a teleporting element (opened, maximized) doesn't fling cubes off-screen.
      v.x = Math.max(-1500, Math.min(1500, v.x));
      v.y = Math.max(-1500, Math.min(1500, v.y));
      lastRects.set(el, { left: r.left, top: r.top });
      list.push({ rect: r, v });
    }
    return list;
  }

  function step(dt) {
    time += dt;
    const rects = readColliders(dt);
    const floor = floorY();
    const wind = Math.sin(time * 0.35) * 60;

    spawnTimer += dt;
    if (autoSpawn > 0 && spawnTimer >= autoSpawn && bodies.length < MAX_BODIES * 0.6) {
      spawnTimer = 0;
      spawn(Math.random() * (width - 60) + 30, -30, (Math.random() - 0.5) * 120, Math.random() * 80 + 40);
    }

    for (const c of bodies) {
      c.age += dt;
      c.vy += GRAVITY * dt;
      c.vx += wind * dt;
      if (c.grounded) {
        // Ground friction pulls toward whatever it's standing on; spin settles flat.
        const target = c.groundVx || 0;
        c.vx += (target - c.vx) * Math.min(FRICTION * dt, 1);
        const flat = Math.round(c.rotation / (Math.PI / 2)) * (Math.PI / 2);
        c.rotation += (flat - c.rotation) * Math.min(10 * dt, 1);
        c.vRot *= 0.8;
      }
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rotation += c.vRot * dt;
      c.grounded = false;
      c.groundVx = 0;
    }

    // A few relaxation passes keep stacks from sinking into each other.
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i];
        for (let j = i + 1; j < bodies.length; j++) collideCubes(a, bodies[j]);
        for (const { rect, v } of rects) collideRect(a, rect, v);

        if (a.y + a.half > floor) {
          a.y = floor - a.half;
          if (a.vy > 0) a.vy = Math.abs(a.vy) > 120 ? -a.vy * RESTITUTION : 0;
          a.grounded = true;
        }
        if (a.x - a.half < 0) { a.x = a.half; a.vx = Math.abs(a.vx) * RESTITUTION; }
        if (a.x + a.half > width) { a.x = width - a.half; a.vx = -Math.abs(a.vx) * RESTITUTION; }
      }
    }

    for (let i = bodies.length - 1; i >= 0; i--) {
      const c = bodies[i];
      if (c.age >= c.life || c.y - c.half > height + 50) bodies.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const c of bodies) {
      const alpha = c.alpha;
      if (alpha <= 0) continue;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = 0.18 * alpha;
      ctx.fillRect(-c.half - 3, -c.half - 3, c.size + 6, c.size + 6);
      ctx.globalAlpha = alpha;
      ctx.fillRect(-c.half, -c.half, c.size, c.size);
      ctx.restore();
    }
  }

  let enabled = true;
  let last = performance.now();
  function loop(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (enabled && !reduceMotion.matches) {
      step(dt);
      draw();
    } else if (bodies.length) {
      bodies.length = 0;
      draw();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    spawn: (x, y) => enabled && spawn(x, y),
    burst: (x, y, n) => enabled && burst(x, y, n),
    clear() { bodies.length = 0; },
    get enabled() { return enabled && !reduceMotion.matches; },
    setEnabled(on) { enabled = on; },
  };
}
