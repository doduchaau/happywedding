import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qualityManager } from '../utils/quality.js';
import { sfx } from '../utils/sfx.js';
import { randomFloat, randomInt, randomChoice } from '../utils/random.js';
import { isReducedMotion } from '../utils/motion.js';

export function initNightSkySection(config) {
  const container = document.getElementById('night-sky-section-mount');
  const footerMount = document.getElementById('footer-mount');
  if (!container) return { destroy: () => {} };

  const lines = config.finale?.lines || [
    'Chúc mừng hạnh phúc',
    'Thúy Hiền & Trung Kiên',
    'Từ [TÊN CỦA BẠN] với tất cả yêu thương',
  ];
  const lanternWishes = config.finale?.lanternWishes || [
    'Bình an', 'Hạnh phúc', 'Sớm có tin vui', 'Tài lộc đong đầy', 'Bên nhau trọn đời',
  ];
  const buttonLabel = config.outro?.buttonLabel || 'Chúc mừng!';
  const counterLabel = config.outro?.counterLabel || 'lượt chúc mừng';
  const senderMessage = config.outro?.message || `Từ ${config.sender || '[TÊN CỦA BẠN]'} với tất cả yêu thương`;
  const monogram = config.monogram || 'H & K';

  container.innerHTML = `
    <div class="night-sky-section" id="night-sky-section">
      <div class="night-sky-viewport" id="night-sky-viewport">
        <!-- Twinkling Stars Canvas -->
        <canvas class="night-stars-canvas" id="night-stars-canvas"></canvas>

        <!-- Drifting Soft Clouds -->
        <div class="night-cloud night-cloud-1" id="night-cloud-1"></div>
        <div class="night-cloud night-cloud-2" id="night-cloud-2"></div>

        <!-- Rising Golden Moon -->
        <div class="night-moon" id="night-moon"></div>

        <!-- Floating Golden Wish Lanterns -->
        <div class="night-lanterns-container" id="night-lanterns-container"></div>

        <!-- Canvas Fireworks Engine -->
        <canvas class="night-fireworks-canvas" id="night-fireworks-canvas"></canvas>

        <!-- Centered Finale Message & Controls -->
        <div class="night-finale-content">
          ${lines
            .map((line, i) => `<p class="night-finale-line" id="finale-line-${i}">${line}</p>`)
            .join('')}

          <div class="night-congrats-panel" id="night-congrats-panel">
            <button type="button" class="btn-pill night-congrats-btn btn-magnetic" id="night-congrats-btn">
              <span>🎆</span>
              <span>${buttonLabel}</span>
            </button>
            <div class="night-counter-pill">
              <span id="night-counter-num">1</span>
              <span>${counterLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render Editorial Footer into footer mount
  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="editorial-footer">
        <div class="footer-monogram">${monogram}</div>
        <p class="footer-credit">${senderMessage}</p>
        <button type="button" class="footer-back-to-top" id="footer-back-top">
          <span>↑</span>
          <span>Về đầu trang</span>
        </button>
      </footer>
    `;

    document.getElementById('footer-back-top')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const viewport = document.getElementById('night-sky-viewport');
  const starsCanvas = document.getElementById('night-stars-canvas');
  const cloud1 = document.getElementById('night-cloud-1');
  const cloud2 = document.getElementById('night-cloud-2');
  const moon = document.getElementById('night-moon');
  const lanternsBox = document.getElementById('night-lanterns-container');
  const fireworksCanvas = document.getElementById('night-fireworks-canvas');
  const congratsPanel = document.getElementById('night-congrats-panel');
  const congratsBtn = document.getElementById('night-congrats-btn');
  const counterNum = document.getElementById('night-counter-num');

  // Setup Stars
  setupStars(starsCanvas);

  // Setup Floating Lanterns
  setupLanterns(lanternsBox, lanternWishes);

  // Setup Fireworks Engine
  const fireworksEngine = new FireworksEngine(fireworksCanvas);

  // Celebration counter
  let congratsCount = 1;
  congratsBtn?.addEventListener('click', () => {
    congratsCount++;
    if (counterNum) {
      counterNum.textContent = congratsCount.toLocaleString('vi-VN');
    }
    sfx.fireworkBoom();
    fireworksEngine.launchRandomPresets();
  });

  // ScrollTrigger Scrub: Interpolate blush dusk -> deep night
  let isFireworksActive = false;

  const trigger = ScrollTrigger.create({
    trigger: '#night-sky-section',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;

      if (!isReducedMotion()) {
        // Interpolate background from blush dusk to deep night
        if (viewport) {
          if (p < 0.45) {
            const factor = p / 0.45;
            viewport.style.background = `linear-gradient(180deg, #F3D9D4 0%, #3A1F26 ${Math.round(factor * 100)}%, #1E1218 100%)`;
          } else {
            viewport.style.background = 'linear-gradient(180deg, #1E1218 0%, #140A10 100%)';
          }
        }

        // Stars & Clouds fade in
        if (starsCanvas) starsCanvas.style.opacity = `${Math.min(1, Math.max(0, (p - 0.25) * 2.2))}`;
        if (cloud1) cloud1.style.opacity = `${Math.min(0.2, p * 0.3)}`;
        if (cloud2) cloud2.style.opacity = `${Math.min(0.2, p * 0.3)}`;

        // Moon rises
        if (moon) {
          moon.style.opacity = `${Math.min(1, Math.max(0, (p - 0.3) * 2.5))}`;
          moon.style.transform = `translateY(${Math.max(0, (1 - p) * 120)}px)`;
        }

        // Lanterns float upwards with scroll
        const lanternEls = lanternsBox.querySelectorAll('.sky-lantern-item');
        lanternEls.forEach((lantern, idx) => {
          const speed = 1 + (idx % 3) * 0.4;
          const y = (1 - p * speed) * (window.innerHeight + 150) - 100;
          lantern.style.transform = `translate3d(0, ${y}px, 0)`;
          lantern.style.opacity = `${p > 0.15 ? (p > 0.95 ? (1 - p) * 10 : 1) : p * 6}`;
        });
      }

      // Finale text lines reveal sequentially
      lines.forEach((_, idx) => {
        const lineEl = document.getElementById(`finale-line-${idx}`);
        const threshold = 0.55 + idx * 0.1;
        if (p > threshold) lineEl?.classList.add('is-visible');
        else lineEl?.classList.remove('is-visible');
      });

      // Congrats panel reveals near bottom
      if (p > 0.85) congratsPanel?.classList.add('is-visible');
      else congratsPanel?.classList.remove('is-visible');

      // Start / stop fireworks auto loop
      if (p > 0.65 && !isFireworksActive) {
        isFireworksActive = true;
        fireworksEngine.start();
      } else if (p <= 0.65 && isFireworksActive) {
        isFireworksActive = false;
        fireworksEngine.stop();
      }
    },
  });

  return {
    destroy() {
      trigger.kill();
      fireworksEngine.stop();
    },
  };
}

/**
 * Twinkling Stars Background Canvas
 */
function setupStars(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const starCount = window.innerWidth < 600 ? 70 : 160;
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: randomFloat(0.8, 2.2),
      alpha: randomFloat(0.3, 0.95),
      speed: randomFloat(0.015, 0.04),
      phase: Math.random() * Math.PI * 2,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((s) => {
      s.phase += s.speed;
      const currentAlpha = Math.max(0.2, Math.min(1, s.alpha + Math.sin(s.phase) * 0.35));

      ctx.fillStyle = `rgba(244, 232, 209, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/**
 * Setup Floating Lanterns with Tap Flare & Wish Tooltip
 */
function setupLanterns(container, wishes) {
  if (!container) return;

  const count = window.innerWidth < 600 ? 6 : 9;

  for (let i = 0; i < count; i++) {
    const wish = wishes[i % wishes.length];
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern-item';
    lantern.setAttribute('data-cursor-label', 'Ngắm');

    // Horizontal spread
    const leftPercent = 8 + (i * 85) / count + randomFloat(-4, 4);
    lantern.style.left = `${leftPercent}%`;
    lantern.style.bottom = `-120px`;

    lantern.innerHTML = `
      <div class="lantern-glow-body"></div>
      <div class="lantern-wish-tag">${wish}</div>
    `;

    // Tap to flare
    lantern.addEventListener('click', () => {
      sfx.sparkleShimmer();
      lantern.classList.add('flaring');
      setTimeout(() => lantern.classList.remove('flaring'), 1200);
    });

    container.appendChild(lantern);
  }
}

/**
 * High-End Fireworks Engine (Rockets, Gravity, Sparks, Additive Blending)
 */
class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = (canvas.width = window.innerWidth);
    this.height = (canvas.height = window.innerHeight);
    this.particles = [];
    this.rockets = [];
    this.isRunning = false;
    this.autoTimer = null;

    // Blush Couture Luxury Palette
    this.colors = [
      '#D4AF7A', // Champagne gold
      '#F4E8D1', // Pale gold
      '#E8B4B8', // Soft pink
      '#C98B8B', // Rose gold
      '#FFFDFB', // Pure ivory
    ];

    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();

    // Auto launch periodic fireworks
    const launchNext = () => {
      if (!this.isRunning) return;
      this.launchRocket(
        randomFloat(this.width * 0.2, this.width * 0.8),
        randomFloat(this.height * 0.2, this.height * 0.45)
      );
      this.autoTimer = setTimeout(launchNext, randomFloat(1400, 2600));
    };

    this.autoTimer = setTimeout(launchNext, 800);
  }

  stop() {
    this.isRunning = false;
    clearTimeout(this.autoTimer);
    this.particles = [];
    this.rockets = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  launchRocket(targetX, targetY) {
    const startX = targetX + randomFloat(-50, 50);
    const startY = this.height + 20;

    this.rockets.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      color: randomChoice(this.colors),
      speed: randomFloat(10, 14),
    });
  }

  explode(x, y, color) {
    sfx.fireworkBoom();
    const count = qualityManager.getLimits().fireworksCount * 14;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + randomFloat(-0.1, 0.1);
      const speed = randomFloat(2, 9);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: Math.random() > 0.3 ? color : randomChoice(this.colors),
        decay: randomFloat(0.012, 0.024),
        size: randomFloat(1.5, 3),
      });
    }
  }

  launchRandomPresets() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.launchRocket(
          randomFloat(this.width * 0.2, this.width * 0.8),
          randomFloat(this.height * 0.18, this.height * 0.42)
        );
      }, i * 220);
    }
  }

  loop() {
    if (!this.isRunning) return;

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.globalCompositeOperation = 'lighter';

    // Update & draw rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      const dx = r.targetX - r.x;
      const dy = r.targetY - r.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 15 || r.y <= r.targetY) {
        this.explode(r.targetX, r.targetY, r.color);
        this.rockets.splice(i, 1);
      } else {
        r.x += (dx / dist) * r.speed;
        r.y += (dy / dist) * r.speed;

        this.ctx.fillStyle = r.color;
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Update & draw particles with gravity
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.09; // Gravity
      p.vx *= 0.98; // Friction
      p.vy *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}
