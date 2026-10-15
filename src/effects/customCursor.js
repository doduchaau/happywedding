/**
 * Blush Couture Editorial Custom Cursor
 * Small dot + trailing gold ring (mix-blend-mode / soft glow).
 * Contextual labels: "Mở", "Kéo", "Cào", "Ký", etc.
 * Squeezes on click. Hidden on touch devices.
 */

import { isReducedMotion } from '../utils/motion.js';

export function initCustomCursor() {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer || isReducedMotion()) return () => {};

  // Remove existing cursor elements if any
  const existing = document.getElementById('editorial-cursor-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'editorial-cursor-container';
  container.className = 'editorial-cursor-container';
  container.setAttribute('aria-hidden', 'true');
  container.innerHTML = `
    <div class="cursor-dot" id="cursor-dot"></div>
    <div class="cursor-ring" id="cursor-ring">
      <span class="cursor-label" id="cursor-label"></span>
    </div>
  `;
  document.body.appendChild(container);

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMouseDown = false;
  let isVisible = false;
  let currentLabel = '';
  let animId = null;

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      container.style.opacity = '1';
    }

    // Direct transform on the small dot for zero lag
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    // Detect contextual targets for cursor text
    const target = e.target;

    // Check specific custom label attributes or classes
    const explicitLabel = target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label');
    const isScratch = target.closest('.scratch-card-item, .scratch-foil-canvas, [data-cursor="scratch"]');
    const isSign = target.closest('.signature-canvas-box, .signature-canvas, [data-cursor="sign"]');
    const isOpen = target.closest('.wax-seal, .capsule-body, .gallery-item-card, .lightbox-trigger, .envelope-box, [data-cursor="open"]');
    const isDrag = target.closest('#intro-canvas-container, #wish-pit-container, .wish-pit-canvas, .gallery-track-wrapper, [data-cursor="drag"]');
    const isInteractive = target.closest('button, a, input, [role="button"], .interactive, .btn-pill, .btn-magnetic');

    if (explicitLabel) {
      setLabel(explicitLabel);
    } else if (isScratch) {
      setLabel('Cào');
    } else if (isSign) {
      setLabel('Ký');
    } else if (isOpen) {
      setLabel('Mở');
    } else if (isDrag) {
      setLabel('Kéo');
    } else if (isInteractive) {
      setLabel('');
      ring.classList.add('is-hovering');
    } else {
      setLabel('');
      ring.classList.remove('is-hovering');
    }
  };

  const setLabel = (text) => {
    if (currentLabel === text) return;
    currentLabel = text;
    if (text) {
      label.textContent = text;
      ring.classList.add('has-label');
      ring.classList.add('is-hovering');
    } else {
      label.textContent = '';
      ring.classList.remove('has-label');
    }
  };

  const onMouseDown = () => {
    isMouseDown = true;
    ring.classList.add('is-down');
    dot.classList.add('is-down');
  };

  const onMouseUp = () => {
    isMouseDown = false;
    ring.classList.remove('is-down');
    dot.classList.remove('is-down');
  };

  const onMouseLeave = () => {
    isVisible = false;
    container.style.opacity = '0';
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mousedown', onMouseDown, { passive: true });
  window.addEventListener('mouseup', onMouseUp, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);

  // Smooth lerp loop for the trailing ring
  const render = () => {
    const ease = 0.18;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    animId = requestAnimationFrame(render);
  };

  animId = requestAnimationFrame(render);

  // Magnetic button behavior
  initMagneticElements();

  return () => {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mouseleave', onMouseLeave);
    container.remove();
  };
}

/**
 * Magnetic button interaction: gently pulls buttons toward cursor within radius
 */
export function initMagneticElements() {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer || isReducedMotion()) return;

  const magnetics = document.querySelectorAll('.btn-magnetic, .btn-pill, .music-toggle-btn');

  magnetics.forEach((btn) => {
    let boundRect = null;
    let isHovered = false;

    btn.addEventListener('mouseenter', () => {
      boundRect = btn.getBoundingClientRect();
      isHovered = true;
    });

    btn.addEventListener('mousemove', (e) => {
      if (!isHovered || !boundRect) return;
      const x = e.clientX - boundRect.left - boundRect.width / 2;
      const y = e.clientY - boundRect.top - boundRect.height / 2;

      // Soft dampening pull
      btn.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      isHovered = false;
      btn.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
      btn.style.transform = 'translate3d(0, 0, 0)';
      setTimeout(() => {
        btn.style.transition = '';
      }, 450);
    });
  });
}
