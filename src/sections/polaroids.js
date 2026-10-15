import { gsap } from 'gsap';
import { applyTilt } from '../effects/tilt.js';
import { randomFloat } from '../utils/random.js';

const TAPE_COLORS = [
  'rgba(255, 184, 184, 0.85)',
  'rgba(255, 221, 224, 0.9)',
  'rgba(254, 217, 183, 0.85)',
  'rgba(242, 139, 155, 0.75)',
  'rgba(226, 240, 217, 0.85)',
];

export function initPolaroidsSection(config) {
  const container = document.getElementById('polaroids-section-mount');
  if (!container) return;

  const photos = config.photos || [];

  container.innerHTML = `
    <section class="section polaroids-section" id="polaroids-section">
      <h2 class="section-title">Khoảnh khắc đáng yêu 📸</h2>
      <p class="section-subtitle">Chụp lén nhưng đẹp, bằng chứng không thể chối cãi</p>

      <div class="polaroids-container" id="polaroids-container">
        ${photos
          .map((photo, idx) => {
            const rot = randomFloat(-6, 6).toFixed(1);
            const tapeColor = TAPE_COLORS[idx % TAPE_COLORS.length];
            const tapeRot = randomFloat(-3, 3).toFixed(1);

            return `
              <div 
                class="polaroid-card" 
                id="polaroid-${idx}" 
                data-index="${idx}"
                style="--init-rot: ${rot}deg; transform: rotate(${rot}deg);"
                tabindex="0"
                role="button"
                aria-label="Xem ảnh: ${photo.caption}"
              >
                <div class="polaroid-tape" style="--tape-color: ${tapeColor}; --tape-rot: ${tapeRot}deg;"></div>
                
                <div class="polaroid-img-wrapper">
                  <img 
                    src="${photo.src}" 
                    alt="${photo.caption}" 
                    class="polaroid-img"
                    loading="lazy"
                  />
                  <div class="polaroid-fallback" style="display: none;">
                    <span class="polaroid-fallback-heart">💖</span>
                    <span class="polaroid-fallback-text">Khoảnh khắc ngọt ngào</span>
                  </div>
                </div>

                <div class="polaroid-caption">${photo.caption}</div>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="polaroid-hint">
        <span>✨</span>
        <span>Có thể kéo thả các tấm ảnh hoặc chạm vào để phóng to nhé!</span>
      </div>

      <!-- Lightbox Modal -->
      <div class="polaroid-lightbox" id="polaroid-lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh phóng to">
        <div class="lightbox-content" id="lightbox-content">
          <button type="button" class="lightbox-close-btn" id="lightbox-close" aria-label="Đóng">&times;</button>
          <button type="button" class="lightbox-nav-btn lightbox-prev-btn" id="lightbox-prev" aria-label="Ảnh trước">&#8249;</button>
          <button type="button" class="lightbox-nav-btn lightbox-next-btn" id="lightbox-next" aria-label="Ảnh sau">&#8250;</button>
          
          <div class="lightbox-img-wrapper">
            <img src="" alt="" class="lightbox-img" id="lightbox-img" />
          </div>
          <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
      </div>
    </section>
  `;

  // Attach fallback handlers for images
  const cards = document.querySelectorAll('.polaroid-card');
  cards.forEach((card) => {
    const img = card.querySelector('.polaroid-img');
    const fallback = card.querySelector('.polaroid-fallback');
    if (img && fallback) {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        fallback.style.display = 'flex';
      });
    }

    // Apply desktop 3D tilt
    applyTilt(card, { maxTilt: 8, scale: 1.04 });
  });

  // Dragging & Click to open Lightbox logic
  let highestZ = 10;
  const polaroidsContainer = document.getElementById('polaroids-container');

  cards.forEach((card) => {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isPointerDown = false;
    let hasDragged = false;
    const baseRot = parseFloat(card.style.getPropertyValue('--init-rot')) || 0;

    const onPointerDown = (e) => {
      // Allow only primary pointer
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      isPointerDown = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;

      highestZ++;
      card.style.zIndex = highestZ;
      card.classList.add('is-dragging');
      card.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isPointerDown) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasDragged && Math.hypot(dx, dy) > 6) {
        hasDragged = true;
      }

      if (hasDragged) {
        currentX = dx;
        currentY = dy;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${baseRot}deg) scale(1.05)`;
      }
    };

    const onPointerUp = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      card.classList.remove('is-dragging');
      try {
        card.releasePointerCapture(e.pointerId);
      } catch (_) {}

      if (!hasDragged) {
        // Simple click / tap -> open lightbox
        const idx = parseInt(card.dataset.index, 10);
        openLightbox(idx);
      } else {
        // Spring back gently to container bounds
        gsap.to(card, {
          x: currentX * 0.4,
          y: currentY * 0.4,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
          onComplete: () => {
            currentX = currentX * 0.4;
            currentY = currentY * 0.4;
          },
        });
      }
    };

    card.addEventListener('pointerdown', onPointerDown);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', onPointerUp);

    // Keyboard support for opening
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(card.dataset.index, 10);
        openLightbox(idx);
      }
    });
  });

  // Lightbox Implementation
  const lightbox = document.getElementById('polaroid-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  let currentIndex = 0;

  function showPhoto(index) {
    if (photos.length === 0) return;
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];

    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption;
    lightboxCaption.textContent = photo.caption;
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.classList.add('is-open');
    document.body.classList.add('scroll-locked');
    closeBtn.focus();
    window.addEventListener('keydown', onKeyDown);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('scroll-locked');
    window.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  }

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhoto(currentIndex - 1);
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhoto(currentIndex + 1);
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch swipe in lightbox
  let touchStartX = 0;
  lightbox?.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  lightbox?.addEventListener(
    'touchend',
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX - touchStartX > 50) {
        showPhoto(currentIndex - 1); // Swipe right -> prev
      } else if (touchStartX - touchEndX > 50) {
        showPhoto(currentIndex + 1); // Swipe left -> next
      }
    },
    { passive: true }
  );
}
