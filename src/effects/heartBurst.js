import { isReducedMotion } from '../utils/motion.js';
import { randomFloat, randomInt } from '../utils/random.js';

const HEART_COLORS = ['#F28B9B', '#FF758F', '#FFB8B8', '#FF99A8', '#E27386'];

/**
 * Initializes global click/tap heart burst listener
 */
export function initHeartBurst() {
  let burstContainer = document.getElementById('heart-burst-container');
  if (!burstContainer) {
    burstContainer = document.createElement('div');
    burstContainer.id = 'heart-burst-container';
    burstContainer.className = 'heart-burst-container';
    burstContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(burstContainer);
  }

  const handlePointerDown = (e) => {
    if (isReducedMotion()) return;

    // Ignore interactive elements
    const target = e.target;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('.interactive') ||
      target.closest('.polaroid-item') ||
      target.closest('.wish-card-flip-container') ||
      target.closest('.gift-box-wrapper') ||
      target.closest('.balloon-item') ||
      target.closest('.lightbox-content')
    ) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    spawnHearts(x, y, burstContainer);
  };

  window.addEventListener('pointerdown', handlePointerDown, { passive: true });

  return () => {
    window.removeEventListener('pointerdown', handlePointerDown);
  };
}

function spawnHearts(x, y, container) {
  const count = randomInt(3, 6);

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-burst';

    const color = HEART_COLORS[i % HEART_COLORS.length];
    const size = randomInt(14, 22);
    const angle = randomFloat(-Math.PI * 0.8, -Math.PI * 0.2);
    const distance = randomFloat(40, 90);
    const destX = Math.cos(angle) * distance + randomFloat(-15, 15);
    const destY = Math.sin(angle) * distance - randomFloat(20, 50);
    const rot = randomFloat(-35, 35);
    const duration = randomFloat(700, 1100);

    heart.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.transform = `translate(-50%, -50%) translate(0px, 0px) scale(0.6)`;
    heart.style.transition = `all ${duration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28)`;
    heart.style.opacity = '1';

    container.appendChild(heart);

    // Trigger animation
    requestAnimationFrame(() => {
      heart.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.1) rotate(${rot}deg)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, duration + 50);
  }
}
