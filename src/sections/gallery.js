import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '../utils/motion.js';
import { sfx } from '../utils/sfx.js';
import { getStringLightsHtml } from '../effects/weddingOrnaments.js';

export function initGallerySection(config) {
  const container = document.getElementById('gallery-section-mount');
  if (!container) return;

  const photos = config.photos || [];
  const monogram = config.monogram || 'H & K';

  // Frame type assignments for varied editorial aesthetic
  const frameTypes = ['frame-arch frame-size-portrait', 'frame-oval frame-size-oval', 'frame-rect frame-size-landscape'];

  container.innerHTML = `
    <section class="gallery-section" id="gallery-section">
      <!-- Dây đèn LED vàng ấm lung linh -->
      ${getStringLightsHtml()}

      <!-- Chữ Hỷ 囍 Watermark Nền Hồng Phấn -->
      <div class="xi-watermark xi-hero" style="top: 40%; opacity: 0.05;" aria-hidden="true">囍</div>

      <header class="gallery-header">
        <span class="gallery-kicker">📸 KHOẢNH KHẮC NGỌT NGÀO • TÌNH YÊU NỞ HOA</span>
        <h2 class="gallery-title">Bộ Sưu Tập Ký Ức Đám Cưới</h2>
        <p class="gallery-subtitle">Từng khung hình lưu giữ những nụ cười, ánh mắt và giây phút hạnh phúc đong đầy</p>
      </header>

      <div class="gallery-track-wrapper" id="gallery-track-wrapper">
        <div class="gallery-track" id="gallery-track">
          ${photos
            .map((photo, idx) => {
              const frameClass = frameTypes[idx % frameTypes.length];
              const numeral = String(idx + 1).padStart(2, '0');

              return `
                <div 
                  class="gallery-item-card" 
                  data-index="${idx}" 
                  role="button" 
                  tabindex="0"
                  aria-label="Xem ảnh ${idx + 1}: ${photo.caption || ''}"
                  data-cursor="open"
                >
                  <span class="gallery-card-numeral" aria-hidden="true">${numeral}</span>

                  <div class="gallery-frame-box ${frameClass}">
                    <img 
                      src="${photo.src}" 
                      alt="${photo.caption || ''}" 
                      class="gallery-photo-img" 
                      loading="lazy" 
                    />
                    <div class="gallery-placeholder" style="display: none;">
                      <span class="gallery-placeholder-monogram">${monogram}</span>
                      <span style="font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 6px;">Khoảnh khắc</span>
                    </div>
                  </div>

                  <div class="gallery-caption-wrapper">
                    <p class="gallery-caption">${photo.caption || ''}</p>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <!-- Cinematic Lightbox Modal -->
      <div class="gallery-lightbox" id="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh phóng to">
        <div class="lightbox-content" id="lightbox-content">
          <button type="button" class="lightbox-close-btn" id="lightbox-close" aria-label="Đóng">&times;</button>
          <button type="button" class="lightbox-nav-btn lightbox-prev-btn" id="lightbox-prev" aria-label="Ảnh trước">&#8249;</button>
          <button type="button" class="lightbox-nav-btn lightbox-next-btn" id="lightbox-next" aria-label="Ảnh sau">&#8250;</button>
          
          <div class="lightbox-img-wrapper">
            <img src="" alt="" class="lightbox-img" id="lightbox-img" />
          </div>
          <p class="lightbox-caption" id="lightbox-caption"></p>
        </div>
      </div>
    </section>
  `;

  // Attach image error handlers for graceful duotone placeholder
  const cards = document.querySelectorAll('.gallery-item-card');
  cards.forEach((card) => {
    const img = card.querySelector('.gallery-photo-img');
    const placeholder = card.querySelector('.gallery-placeholder');
    if (img && placeholder) {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        placeholder.style.display = 'flex';
      });
    }
  });

  // Setup Pinned Horizontal Scroll on Desktop
  const trackWrapper = document.getElementById('gallery-track-wrapper');
  const track = document.getElementById('gallery-track');
  const section = document.getElementById('gallery-section');

  const isDesktop = window.innerWidth > 768;

  if (isDesktop && !isReducedMotion() && track) {
    const scrollDistance = track.scrollWidth - window.innerWidth + 120;

    if (scrollDistance > 0) {
      gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 8%',
          end: () => `+=${scrollDistance * 1.25}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  // Setup Cinematic Lightbox
  const lightbox = document.getElementById('gallery-lightbox');
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
    lightboxImg.alt = photo.caption || '';
    lightboxCaption.textContent = photo.caption || '';
    sfx.paperRustle();
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox?.classList.add('is-open');
    document.body.classList.add('scroll-locked');
    closeBtn?.focus();
    window.addEventListener('keydown', onKeyDown);
  }

  function closeLightbox() {
    lightbox?.classList.remove('is-open');
    document.body.classList.remove('scroll-locked');
    window.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      openLightbox(idx);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(card.dataset.index, 10);
        openLightbox(idx);
      }
    });
  });

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

  // Touch Swipe in Lightbox
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
      if (touchEndX - touchStartX > 50) showPhoto(currentIndex - 1);
      else if (touchStartX - touchEndX > 50) showPhoto(currentIndex + 1);
    },
    { passive: true }
  );
}
