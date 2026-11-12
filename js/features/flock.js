/**
 * Hero flock: a boids simulation adapted from SimLab's boids experiment.
 *
 * Same model as the original: a spatial hash grid for neighbour search,
 * Reynolds steering forces, a fixed timestep and cursor fleeing. The controls,
 * presets and telemetry are left out, and the loop pauses whenever the hero is
 * off screen or the tab is hidden. A click adds a short-lived burst of boids.
 */

const CONFIG = {
  visionRadius: 60, // px: alignment + cohesion range
  separationRadius: 24, // px: personal space
  maxSpeed: 95, // px/s
  minSpeedFactor: 0.5, // fraction of maxSpeed a boid must keep
  maxForce: 160, // px/s^2: how hard a boid can steer
  separation: 1.6,
  alignment: 1.3,
  cohesion: 0.9,
  fleeRadius: 130, // px: cursor avoidance range
  fleeStrength: 420, // px/s^2 near the cursor
  dt: 1 / 60, // fixed simulation step (seconds)
  maxSubSteps: 5, // clamp catch-up work after a stall
  density: 1 / 9000, // boids per px^2 of canvas
  maxBoids: 180,
  size: 8, // px: boid length from centre to nose
  colors: ["#8ea2ff", "#8ea2ff", "#8ea2ff", "#8ea2ff", "#ffb454"],
  burstCount: 14, // boids added per click
  burstColor: "#ffb454",
  burstBoost: 2.4, // starting speed, as a multiple of maxSpeed
  burstLife: 12, // seconds a burst boid lives
  burstFade: 2, // seconds it takes to fade out at the end
  maxBurst: 70, // older burst boids fade early beyond this
};

export function initFlock(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const host = canvas.parentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let W = 0;
  let H = 0;
  let boids = [];
  const mouse = { x: 0, y: 0, active: false };

  // -------------------------------------------------------------------------
  // Sizing
  // -------------------------------------------------------------------------
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setCount(Math.min(CONFIG.maxBoids, Math.round(W * H * CONFIG.density)));
  }

  function makeBoid() {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * CONFIG.maxSpeed,
      vy: Math.sin(angle) * CONFIG.maxSpeed,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
    };
  }

  function setCount(n) {
    boids = boids.filter((b) => b.life === undefined); // drop click bursts
    while (boids.length < n) boids.push(makeBoid());
    if (boids.length > n) boids.length = n;
  }

  /** Add a ring of boids flying outward from a point. They fade out later. */
  function burst(x, y) {
    const offset = Math.random() * Math.PI * 2;
    for (let i = 0; i < CONFIG.burstCount; i++) {
      const angle = offset + (i / CONFIG.burstCount) * Math.PI * 2;
      const speed = CONFIG.maxSpeed * CONFIG.burstBoost;
      boids.push({
        x: x + Math.cos(angle) * 6,
        y: y + Math.sin(angle) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: CONFIG.burstColor,
        life: CONFIG.burstLife,
        boost: CONFIG.burstBoost,
      });
    }
    // Keep the total bounded: the oldest burst boids start fading now.
    const extras = boids.filter((b) => b.life !== undefined);
    for (let i = 0; i < extras.length - CONFIG.maxBurst; i++) {
      extras[i].life = Math.min(extras[i].life, CONFIG.burstFade);
    }
  }

  // -------------------------------------------------------------------------
  // Spatial hash grid
  // -------------------------------------------------------------------------
  function buildGrid(cellSize) {
    const cols = Math.max(1, Math.ceil(W / cellSize));
    const rows = Math.max(1, Math.ceil(H / cellSize));
    const cells = Array.from({ length: cols * rows }, () => []);
    for (const b of boids) {
      const cx = Math.min(cols - 1, Math.max(0, Math.floor(b.x / cellSize)));
      const cy = Math.min(rows - 1, Math.max(0, Math.floor(b.y / cellSize)));
      cells[cy * cols + cx].push(b);
    }
    return { cells, cols, rows, cellSize };
  }

  /** Collect neighbours from the 3x3 block of cells around a boid. */
  function neighbours(grid, b, out) {
    out.length = 0;
    const { cells, cols, rows, cellSize } = grid;
    const cx = Math.min(cols - 1, Math.max(0, Math.floor(b.x / cellSize)));
    const cy = Math.min(rows - 1, Math.max(0, Math.floor(b.y / cellSize)));
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const gx = (cx + ox + cols) % cols;
        const gy = (cy + oy + rows) % rows;
        const bucket = cells[gy * cols + gx];
        for (let i = 0; i < bucket.length; i++) out.push(bucket[i]);
      }
    }
    return out;
  }

  // -------------------------------------------------------------------------
  // Simulation step (fixed dt seconds)
  // -------------------------------------------------------------------------
  const near = [];

  function step(dt) {
    const { maxSpeed, maxForce } = CONFIG;
    const minSpeed = maxSpeed * CONFIG.minSpeedFactor;
    const visionR2 = CONFIG.visionRadius ** 2;
    const sepR2 = CONFIG.separationRadius ** 2;
    const fleeR = CONFIG.fleeRadius;
    const grid = buildGrid(CONFIG.visionRadius);
    let expired = false;

    for (const b of boids) {
      let sepX = 0,
        sepY = 0,
        aliX = 0,
        aliY = 0,
        cohX = 0,
        cohY = 0;
      let sepN = 0,
        flockN = 0;

      neighbours(grid, b, near);
      for (let i = 0; i < near.length; i++) {
        const o = near[i];
        if (o === b) continue;

        let dx = o.x - b.x;
        let dy = o.y - b.y;
        if (dx > W * 0.5) dx -= W;
        else if (dx < -W * 0.5) dx += W;
        if (dy > H * 0.5) dy -= H;
        else if (dy < -H * 0.5) dy += H;

        const d2 = dx * dx + dy * dy;
        if (d2 > visionR2 || d2 === 0) continue;

        if (d2 < sepR2) {
          const inv = 1 / Math.sqrt(d2);
          sepX -= dx * inv;
          sepY -= dy * inv;
          sepN++;
        }
        aliX += o.vx;
        aliY += o.vy;
        cohX += dx;
        cohY += dy;
        flockN++;
      }

      let ax = 0;
      let ay = 0;

      // Separation: steer away from crowded neighbours.
      if (sepN > 0) {
        const [fx, fy] = steer(sepX, sepY, b);
        ax += fx * CONFIG.separation;
        ay += fy * CONFIG.separation;
      }
      if (flockN > 0) {
        // Alignment: match the average heading.
        const [alx, aly] = steer(aliX / flockN, aliY / flockN, b);
        ax += alx * CONFIG.alignment;
        ay += aly * CONFIG.alignment;
        // Cohesion: steer toward the local centre of mass.
        const [cx, cy] = steer(cohX / flockN, cohY / flockN, b);
        ax += cx * CONFIG.cohesion;
        ay += cy * CONFIG.cohesion;
      }

      // Cursor avoidance.
      if (mouse.active) {
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < fleeR * fleeR && d2 > 0) {
          const d = Math.sqrt(d2);
          const strength = CONFIG.fleeStrength * (1 - d / fleeR);
          ax += (dx / d) * strength;
          ay += (dy / d) * strength;
        }
      }

      // Integrate, keep speed in range, wrap around the edges.
      b.vx += ax * dt;
      b.vy += ay * dt;
      const s = Math.hypot(b.vx, b.vy) || 1;
      let topSpeed = maxSpeed;
      if (b.life !== undefined) {
        // Burst boids start fast, settle to flock speed, then expire.
        topSpeed *= b.boost;
        b.boost = Math.max(1, b.boost - dt * 1.4);
        b.life -= dt;
        if (b.life <= 0) expired = true;
      }
      const clamped = Math.min(topSpeed, Math.max(minSpeed, s));
      b.vx = (b.vx / s) * clamped;
      b.vy = (b.vy / s) * clamped;
      b.x = (b.x + b.vx * dt + W) % W;
      b.y = (b.y + b.vy * dt + H) % H;
    }
    if (expired) boids = boids.filter((b) => !(b.life <= 0));

    /** Reynolds steering: desired direction at maxSpeed, minus velocity, clamped. */
    function steer(dirX, dirY, b) {
      const m = Math.hypot(dirX, dirY);
      if (m === 0) return [0, 0];
      let fx = (dirX / m) * maxSpeed - b.vx;
      let fy = (dirY / m) * maxSpeed - b.vy;
      const fm = Math.hypot(fx, fy);
      if (fm > maxForce) {
        fx = (fx / fm) * maxForce;
        fy = (fy / fm) * maxForce;
      }
      return [fx, fy];
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const sz = CONFIG.size;
    for (const b of boids) {
      const fade =
        b.life === undefined ? 1 : Math.min(1, b.life / CONFIG.burstFade);
      ctx.globalAlpha = 0.85 * fade;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.atan2(b.vy, b.vx));
      ctx.beginPath();
      ctx.moveTo(sz, 0);
      ctx.lineTo(-sz * 0.55, -sz * 0.45);
      ctx.lineTo(-sz * 0.3, 0);
      ctx.lineTo(-sz * 0.55, sz * 0.45);
      ctx.closePath();
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // -------------------------------------------------------------------------
  // Main loop: fixed-timestep accumulator, paused when not visible
  // -------------------------------------------------------------------------
  let rafId = 0;
  let lastTime = 0;
  let accumulator = 0;
  let onScreen = true;

  function loop(now) {
    const frameMs = Math.min(now - lastTime, 250); // clamp huge gaps
    lastTime = now;
    accumulator += frameMs / 1000;
    let steps = 0;
    while (accumulator >= CONFIG.dt && steps < CONFIG.maxSubSteps) {
      step(CONFIG.dt);
      accumulator -= CONFIG.dt;
      steps++;
    }
    if (steps === CONFIG.maxSubSteps) accumulator = 0; // give up on backlog
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function updateRunning() {
    const shouldRun = onScreen && !document.hidden && !reducedMotion.matches;
    if (shouldRun && !rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(loop);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  /** For reduced motion: let the flock form, then show a single still frame. */
  function drawStill() {
    for (let i = 0; i < 240; i++) step(CONFIG.dt);
    draw();
  }

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------
  host.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  host.addEventListener("pointerleave", () => {
    mouse.active = false;
  });

  host.addEventListener("pointerdown", (e) => {
    // Not while the loop is stopped, and not for clicks meant for a link.
    if (!rafId || e.button !== 0 || e.target.closest("a, button")) return;
    const rect = canvas.getBoundingClientRect();
    burst(e.clientX - rect.left, e.clientY - rect.top);
  });

  let resizeRaf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      resize();
      if (reducedMotion.matches) draw();
    });
  });

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    updateRunning();
  }).observe(canvas);
  document.addEventListener("visibilitychange", updateRunning);
  reducedMotion.addEventListener("change", updateRunning);

  // -------------------------------------------------------------------------
  // Boot
  // -------------------------------------------------------------------------
  resize();
  if (reducedMotion.matches) drawStill();
  else updateRunning();
}
