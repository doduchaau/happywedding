/**
 * Motion utilities & reduced-motion accessibility
 */

const reducedMotionQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

/**
 * Checks if user prefers reduced motion
 */
export function isReducedMotion() {
  return reducedMotionQuery ? reducedMotionQuery.matches : false;
}

/**
 * Register callback on reduced motion preference change
 */
export function onReducedMotionChange(callback) {
  if (!reducedMotionQuery) return () => {};
  const handler = (e) => callback(e.matches);
  reducedMotionQuery.addEventListener('change', handler);
  return () => reducedMotionQuery.removeEventListener('change', handler);
}
