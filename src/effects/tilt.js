import { isReducedMotion } from '../utils/motion.js';

/**
 * Attaches subtle 3D tilt effect on hover for desktop fine-pointers
 */
export function applyTilt(element, options = {}) {
  if (!element) return () => {};

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) return () => {};

  const maxTilt = options.maxTilt || 10;
  const perspective = options.perspective || 700;
  const scale = options.scale || 1.03;

  let bounds = null;

  const onMouseEnter = () => {
    if (isReducedMotion()) return;
    bounds = element.getBoundingClientRect();
    element.style.transition = 'transform 0.15s ease-out';
  };

  const onMouseMove = (e) => {
    if (isReducedMotion() || !bounds) return;
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const xPct = (x / bounds.width - 0.5) * 2; // -1 to 1
    const yPct = (y / bounds.height - 0.5) * 2; // -1 to 1

    const tiltX = -yPct * maxTilt;
    const tiltY = xPct * maxTilt;

    element.style.transform = `perspective(${perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;
  };

  const onMouseLeave = () => {
    bounds = null;
    element.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    element.style.transform = '';
  };

  element.addEventListener('mouseenter', onMouseEnter);
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', onMouseEnter);
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
}
