import { gsap } from 'gsap';
import { confettiPresets } from '../effects/confettiPresets.js';
import { randomFloat, randomInt, randomChoice } from '../utils/random.js';
import { isReducedMotion } from '../utils/motion.js';

const BALLOON_COLORS = [
  { main: '#FF758F', top: '#FFAAA6', string: '#8E656E' },
  { main: '#F28B9B', top: '#FFDDE0', string: '#8E656E' },
  { main: '#FFB8B8', top: '#FFE5EC', string: '#8E656E' },
  { main: '#E27386', top: '#FFCAD4', string: '#8E656E' },
  { main: '#E5989B', top: '#FFB4A2', string: '#8E656E' },
  { main: '#DDA0DD', top: '#F8E8F8', string: '#8E656E' },
];

export function initBalloonsSection(config) {
  const container = document.getElementById('balloons-section-mount');
  if (!container) return { destroy: () => {} };

  const words = config.balloons || [
    'Hạnh phúc', 'Bình yên', 'Tiếng cười', 'Sức khỏe', 'Tiền về đầy ví',
    'Ăn ngon ngủ khỏe', 'Sớm có tin vui', 'Bên nhau trọn đời', 'Wifi mạnh',
  ];

  container.innerHTML = `
    <section class="section balloons-section" id="balloons-section">
      <h2 class="section-title">Thả bóng chúc phúc 🎈</h2>
      <p class="section-subtitle">Chạm vào từng quả bóng để nổ quà và đón nhận lời chúc</p>

      <div class="balloons-panel">
        <div class="balloons-preview-graphic">
          <span style="font-size: 2.8rem;">🎈</span>
          <span style="font-size: 3.2rem; transform: translateY(-8px);">🎈</span>
          <span style="font-size: 2.8rem;">🎈</span>
        </div>

        <p style="font-size: 1.1rem; color: var(--text-muted); font-weight: 500;">
          Gửi gắm những điều ước ngọt ngào nhất bay lên bầu trời tình yêu
        </p>

        <button type="button" class="btn-pill" id="launch-balloons-btn">
          <span>🎈</span>
          <span>Thả bóng bay</span>
        </button>
      </div>

      <div class="balloons-sky-container" id="balloons-sky"></div>
    </section>
  `;

  const sky = document.getElementById('balloons-sky');
  const launchBtn = document.getElementById('launch-balloons-btn');

  let activeBalloons = new Set();
  const maxBalloons = window.innerWidth < 768 ? 12 : 20;

  const createBalloon = (word) => {
    if (activeBalloons.size >= maxBalloons) return;

    const balloonEl = document.createElement('div');
    balloonEl.className = 'balloon-item';

    const colorScheme = randomChoice(BALLOON_COLORS);
    const scale = randomFloat(0.85, 1.25);
    const startX = randomFloat(window.innerWidth * 0.08, window.innerWidth * 0.92);
    const duration = randomFloat(6.5, 9.5);
    const swayAmp = randomFloat(30, 60);

    const balloonWidth = 90 * scale;
    const balloonHeight = 120 * scale;

    balloonEl.innerHTML = `
      <svg class="balloon-svg" width="${balloonWidth}" height="${balloonHeight + 50}" viewBox="0 0 100 150" fill="none">
        <defs>
          <radialGradient id="balloonGrad-${Math.random().toString(36).substr(2, 6)}" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="${colorScheme.top}" />
            <stop offset="100%" stop-color="${colorScheme.main}" />
          </radialGradient>
        </defs>

        <!-- Balloon Shape -->
        <path d="M50 10 C20 10, 5 35, 5 65 C5 95, 30 115, 47 118 L45 124 L55 124 L53 118 C70 115, 95 95, 95 65 C95 35, 80 10, 50 10 Z" 
              fill="${colorScheme.main}" />
        
        <!-- Inner Highlight -->
        <ellipse cx="32" cy="38" rx="14" ry="24" fill="#FFFFFF" opacity="0.32" transform="rotate(-20 32 38)" />

        <!-- Balloon Word Text -->
        <text x="50" y="70" text-anchor="middle" class="balloon-word">${word}</text>

        <!-- Swaying String -->
        <path class="balloon-string" d="M50 124 Q45 135 52 145 T48 160" />
      </svg>
    `;

    balloonEl.style.left = `${startX}px`;
    balloonEl.style.bottom = '-140px';
    sky.appendChild(balloonEl);
    activeBalloons.add(balloonEl);

    // Popping logic
    const popBalloon = (e) => {
      e.stopPropagation();
      activeBalloons.delete(balloonEl);

      // Pop origin
      const rect = balloonEl.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      // Confetti burst
      confettiPresets.balloonPop(originX, originY, colorScheme.main);

      // Pop sound / text badge
      const popText = document.createElement('div');
      popText.className = 'balloon-pop-text';
      popText.textContent = `+1 ${word}! 💖`;
      popText.style.left = `${rect.left + rect.width / 2}px`;
      popText.style.top = `${rect.top + rect.height / 3}px`;
      document.body.appendChild(popText);
      setTimeout(() => popText.remove(), 800);

      // Animate balloon burst
      balloonEl.classList.add('popping');
      tween.kill();
      setTimeout(() => balloonEl.remove(), 200);
    };

    balloonEl.addEventListener('click', popBalloon);

    // Animate rising and swaying using GSAP
    const tween = gsap.to(balloonEl, {
      y: -(window.innerHeight + 250),
      duration: isReducedMotion() ? duration * 0.7 : duration,
      ease: 'none',
      onUpdate: function () {
        if (!isReducedMotion()) {
          const progress = this.progress();
          const sway = Math.sin(progress * Math.PI * 4) * swayAmp;
          gsap.set(balloonEl, { x: sway, rotation: Math.sin(progress * Math.PI * 3) * 6 });
        }
      },
      onComplete: () => {
        activeBalloons.delete(balloonEl);
        balloonEl.remove();
      },
    });
  };

  const releaseBalloonsWave = () => {
    const waveCount = window.innerWidth < 768 ? 6 : 10;
    for (let i = 0; i < waveCount; i++) {
      setTimeout(() => {
        const word = randomChoice(words);
        createBalloon(word);
      }, i * 320);
    }
  };

  launchBtn?.addEventListener('click', releaseBalloonsWave);

  return {
    destroy() {
      activeBalloons.forEach((b) => b.remove());
      activeBalloons.clear();
    },
  };
}
