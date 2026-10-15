import { isReducedMotion } from '../utils/motion.js';
import { randomFloat, randomInt } from '../utils/random.js';

const SPARKLE_SHAPES = ['✦', '★', '✧', '•'];
const SPARKLE_COLORS = ['#F28B9B', '#FFB8B8', '#FFCAD4', '#FED9B7', '#FF99A8'];

/**
 * Initializes sparkling cursor trail for desktop (pointer: fine)
 */
export function initSparkleCursor() {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) return () => {};

  let container = document.getElementById('sparkle-cursor-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'sparkle-cursor-container';
    container.className = 'sparkle-cursor-container';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
  }

  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;

  const handleMouseMove = (e) => {
    if (isReducedMotion()) return;

    const now = performance.now();
    // Throttle: minimum 45ms and 8px movement
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (now - lastTime < 40 || dist < 10) return;

    lastTime = now;
    lastX = e.clientX;
    lastY = e.clientY;

    createSparkle(e.clientX, e.clientY, container);
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
}

function createSparkle(x, y, container) {
  const sparkle = document.createElement('span');
  sparkle.className = 'cursor-sparkle-dot';
  sparkle.textContent = SPARKLE_SHAPES[randomInt(0, SPARKLE_SHAPES.length - 1)];

  const color = SPARKLE_COLORS[randomInt(0, SPARKLE_COLORS.length - 1)];
  const size = randomInt(11, 18);
  const offsetX = randomFloat(-8, 8);
  const offsetY = randomFloat(-8, 8);
  const rot = randomFloat(-40, 40);

  sparkle.style.color = color;
  sparkle.style.fontSize = `${size}px`;
  sparkle.style.left = `${x + offsetX}px`;
  sparkle.style.top = `${y + offsetY}px`;
  sparkle.style.transform = `translate(-50%, -50%) scale(1) rotate(${rot}deg)`;
  sparkle.style.opacity = '0.9';

  container.appendChild(sparkle);

  requestAnimationFrame(() => {
    sparkle.style.transform = `translate(-50%, calc(-50% + 14px)) scale(0.2) rotate(${rot + 45}deg)`;
    sparkle.style.opacity = '0';
  });

  setTimeout(() => {
    sparkle.remove();
  }, 500);
}
