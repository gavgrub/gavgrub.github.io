window.addEventListener("load", () => {

  // Create canvas automatically
  const canvas = document.createElement("canvas");
  canvas.id = "starCanvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // Style it
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "-1";

  let stars = [];
  const STAR_COUNT = 250;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.01 + 0.003,
        dir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
      star.alpha += star.speed * star.dir;

      if (star.alpha <= 0.3 || star.alpha >= 1) {
        star.dir *= -1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "white";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  createStars();
  animate();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createStars();
  });

});
