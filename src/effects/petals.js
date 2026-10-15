import { isReducedMotion } from '../utils/motion.js';
import { randomFloat, randomInt, randomChoice } from '../utils/random.js';

/**
 * Custom Canvas-based floating petals, hearts & tiny stars with depth layers and parallax
 */
export function initPetals(canvas) {
  if (!canvas) return { destroy: () => {} };

  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy: () => {} };

  let animationFrameId = null;
  let isRunning = true;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Parallax offsets
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 22 : 48;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  // Parallax listeners
  const onMouseMove = (e) => {
    if (isReducedMotion()) return;
    const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetParallaxX = nx * 35;
    targetParallaxY = ny * 35;
  };

  const onOrientation = (e) => {
    if (isReducedMotion() || e.gamma === null) return;
    // gamma is left-to-right (-90 to 90), beta is front-to-back (-180 to 180)
    targetParallaxX = (e.gamma / 45) * 25;
    targetParallaxY = ((e.beta - 45) / 45) * 25;
  };

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  } else if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
  }

  // Create particles
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = randomFloat(0, width);
      this.y = initial ? randomFloat(0, height) : -30;
      this.layer = randomChoice([1, 2, 3]); // 1 = far, 2 = mid, 3 = close

      // Scale and speed by layer
      const layerScale = this.layer === 1 ? 0.6 : this.layer === 2 ? 0.9 : 1.3;
      this.size = randomFloat(8, 16) * layerScale;
      this.speedY = randomFloat(0.6, 1.4) * layerScale;
      this.speedX = randomFloat(-0.3, 0.5) * layerScale;
      this.wobbleSpeed = randomFloat(0.015, 0.035);
      this.wobble = randomFloat(0, Math.PI * 2);
      this.rotation = randomFloat(0, Math.PI * 2);
      this.rotationSpeed = randomFloat(-0.02, 0.02);
      this.opacity = randomFloat(0.4, 0.85);

      // Type: 60% petal, 25% heart, 15% star/sparkle
      const r = Math.random();
      if (r < 0.6) {
        this.type = 'petal';
        this.color = randomChoice(['#FFDDE0', '#FFB8B8', '#FFAAA6', '#FFCCD5']);
      } else if (r < 0.85) {
        this.type = 'heart';
        this.color = randomChoice(['#F28B9B', '#FF758F', '#FF8FA3']);
      } else {
        this.type = 'star';
        this.color = randomChoice(['#FFE5EC', '#FFF0F3', '#FED9B7']);
      }
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.rotation += this.rotationSpeed;
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw(ctx, parallaxX, parallaxY) {
      const pFactor = this.layer === 1 ? 0.2 : this.layer === 2 ? 0.5 : 1.0;
      const drawX = this.x + parallaxX * pFactor;
      const drawY = this.y + parallaxY * pFactor;

      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        // Draw delicate sakura petal
        const flip = Math.cos(this.wobble);
        ctx.scale(1, flip);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.7, this.size * 0.7, this.size * 0.7, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.7, -this.size * 0.7, -this.size * 0.7, 0, -this.size);
        ctx.fill();
      } else if (this.type === 'heart') {
        // Draw mini heart
        ctx.fillStyle = this.color;
        const s = this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s * 0.6, -s * 0.6, -s * 1.2, s * 0.4, 0, s * 1.2);
        ctx.bezierCurveTo(s * 1.2, s * 0.4, s * 0.6, -s * 0.6, 0, s * 0.3);
        ctx.fill();
      } else {
        // Draw tiny sparkle star
        ctx.fillStyle = this.color;
        const s = this.size * 0.4;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * s, Math.sin((i * Math.PI) / 2) * s);
          ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (s * 0.3), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (s * 0.3));
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  const particles = Array.from({ length: particleCount }, () => new Particle());

  function loop() {
    if (!isRunning) return;

    if (!isReducedMotion()) {
      // Lerp parallax
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw(ctx, currentParallaxX, currentParallaxY);
      }
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  animationFrameId = requestAnimationFrame(loop);

  return {
    destroy() {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('deviceorientation', onOrientation);
    },
  };
}
