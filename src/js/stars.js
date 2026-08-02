document.addEventListener("componentsLoaded", () => {
  const field = document.querySelector('.star-field');
  if (!field) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'star-canvas';
  field.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const STAR_COUNT = 200;
  const MIN_SPEED = 0.1;
  const MAX_SPEED = 0.6;

  let dpr = Math.min(window.devicePixelRatio || 1, 2); // cap for perf on high-DPI screens
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();

  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      baseY: Math.random() * height,
      speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
      radius: 1 + Math.random() * 0.8,
      twinkleSpeed: 0.5 + Math.random() * 1.5,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }

  let scrollY = window.scrollY;
  let rafId = null;
  let startTime = performance.now();

  function draw(now) {
    const t = (now - startTime) / 1000;
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      let y = (star.baseY - scrollY * star.speed) % height;
      if (y < 0) y += height;

      const opacity = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinklePhase));

      ctx.beginPath();
      ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 150);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      startTime = performance.now() - startTime; // rough continuity, avoids jump
      rafId = requestAnimationFrame(draw);
    }
  });

  rafId = requestAnimationFrame(draw);
});