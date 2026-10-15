import { gsap } from 'gsap';
import { confettiPresets } from '../effects/confettiPresets.js';
import { audioManager } from '../utils/audio.js';
import { isReducedMotion } from '../utils/motion.js';

export function initGiftSection(config, onGiftOpened) {
  const container = document.getElementById('gift-screen-mount');
  if (!container) return;

  const giftTitle = config.giftScreen?.title || 'Có quà dành cho hai bạn!';
  const giftHint = config.giftScreen?.hint || 'Chạm vào hộp quà để mở nhé';

  container.innerHTML = `
    <div class="gift-screen" id="gift-screen">
      <div class="gift-floating-ambient" id="gift-ambient"></div>

      <div class="gift-box-wrapper" id="gift-box" role="button" tabindex="0" aria-label="Mở hộp quà cưới">
        <svg class="gift-box-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Shadow base -->
          <ellipse cx="100" cy="180" rx="75" ry="12" fill="rgba(242, 139, 155, 0.25)" />

          <!-- Box Body -->
          <g id="gift-body">
            <!-- Main box rounded rect -->
            <rect x="35" y="85" width="130" height="95" rx="18" fill="url(#giftBodyGrad)" />
            <!-- Vertical Ribbon -->
            <rect x="86" y="85" width="28" height="95" fill="url(#giftRibbonGrad)" />
            <!-- Inner ribbon shine -->
            <rect x="98" y="85" width="4" height="95" fill="rgba(255, 255, 255, 0.4)" />
            <!-- Decorative dots/sparkles on box -->
            <circle cx="60" cy="120" r="3" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="140" cy="140" r="3" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="55" cy="155" r="2.5" fill="#FFFFFF" opacity="0.5"/>
          </g>

          <!-- Box Lid Group (Animated) -->
          <g class="gift-lid-group" id="gift-lid">
            <!-- Ribbon Bow Loops -->
            <!-- Left loop -->
            <path d="M100 52 C70 20 40 40 75 58 C85 64 96 60 100 58 Z" fill="url(#giftRibbonGrad)" />
            <!-- Right loop -->
            <path d="M100 52 C130 20 160 40 125 58 C115 64 104 60 100 58 Z" fill="url(#giftRibbonGrad)" />
            <!-- Center knot -->
            <circle cx="100" cy="56" r="10" fill="#F28B9B" stroke="#FFFFFF" stroke-width="2"/>
            <!-- Hanging ribbon tails -->
            <path d="M95 62 C85 75 75 88 80 96 C82 98 86 95 88 90 C92 82 96 70 98 64 Z" fill="#F28B9B" opacity="0.9"/>
            <path d="M105 62 C115 75 125 88 120 96 C118 98 114 95 112 90 C108 82 104 70 102 64 Z" fill="#F28B9B" opacity="0.9"/>

            <!-- Lid rim -->
            <rect x="25" y="65" width="150" height="26" rx="10" fill="url(#giftLidGrad)" />
            <!-- Lid ribbon band -->
            <rect x="86" y="65" width="28" height="26" fill="url(#giftRibbonGrad)" />
            <rect x="98" y="65" width="4" height="26" fill="rgba(255, 255, 255, 0.4)" />
          </g>

          <!-- Gradients -->
          <defs>
            <linearGradient id="giftBodyGrad" x1="35" y1="85" x2="165" y2="180" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FFDDE0" />
              <stop offset="1" stop-color="#FFB8B8" />
            </linearGradient>
            <linearGradient id="giftLidGrad" x1="25" y1="65" x2="175" y2="90" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FFE8EC" />
              <stop offset="1" stop-color="#FFCCD5" />
            </linearGradient>
            <linearGradient id="giftRibbonGrad" x1="86" y1="40" x2="114" y2="180" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FF758F" />
              <stop offset="0.5" stop-color="#F28B9B" />
              <stop offset="1" stop-color="#E27386" />
            </linearGradient>
          </defs>
        </svg>
        <div class="gift-shadow-glow"></div>
      </div>

      <h1 class="gift-title">${giftTitle}</h1>
      <div class="gift-hint-pill">
        <span>✨</span>
        <span>${giftHint}</span>
      </div>
    </div>
  `;

  // Spawn ambient floating dots
  const ambientContainer = document.getElementById('gift-ambient');
  if (ambientContainer) {
    for (let i = 0; i < 15; i++) {
      const dot = document.createElement('div');
      dot.className = 'ambient-dot';
      const size = Math.random() * 20 + 8;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      dot.style.animationDuration = `${Math.random() * 4 + 4}s`;
      ambientContainer.appendChild(dot);
    }
  }

  const screenEl = document.getElementById('gift-screen');
  const boxEl = document.getElementById('gift-box');
  const lidEl = document.getElementById('gift-lid');

  // Periodic gentle wiggle
  const wiggleInterval = setInterval(() => {
    if (!boxEl || isReducedMotion()) return;
    boxEl.classList.add('wiggling');
    setTimeout(() => boxEl?.classList.remove('wiggling'), 800);
  }, 4000);

  let opened = false;

  const openGift = () => {
    if (opened) return;
    opened = true;
    clearInterval(wiggleInterval);

    screenEl.classList.add('is-opening');

    // Get origin coordinates for confetti
    const rect = boxEl.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 3) / window.innerHeight;

    // Pop lid animation
    if (lidEl && !isReducedMotion()) {
      gsap.to(lidEl, {
        y: -110,
        rotation: -28,
        scale: 1.15,
        opacity: 0,
        duration: 0.65,
        ease: 'back.out(2)',
      });
      gsap.to('#gift-body', {
        y: 8,
        scaleY: 0.92,
        yoyo: true,
        repeat: 1,
        duration: 0.2,
      });
    }

    // Fire confetti burst
    confettiPresets.giftBurst(originX, originY);

    // Play music on this user gesture
    audioManager.play();

    // Transition away screen after brief anticipation
    setTimeout(() => {
      if (isReducedMotion()) {
        screenEl.style.display = 'none';
        document.body.classList.remove('scroll-locked');
        if (onGiftOpened) onGiftOpened();
        return;
      }

      gsap.to(screenEl, {
        opacity: 0,
        scale: 1.15,
        duration: 0.85,
        ease: 'power2.inOut',
        onComplete: () => {
          screenEl.classList.add('is-hidden');
          document.body.classList.remove('scroll-locked');
          if (onGiftOpened) onGiftOpened();
        },
      });
    }, 450);
  };

  boxEl.addEventListener('click', openGift);
  boxEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGift();
    }
  });
}
