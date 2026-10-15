import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '../utils/motion.js';

export function initLetterSection(config) {
  const container = document.getElementById('letter-section-mount');
  if (!container) return;

  const greeting = config.letter?.greeting || 'Gửi Thúy Hiền và Trung Kiên,';
  const paragraphs = config.letter?.paragraphs || [];
  const closing = config.letter?.closing || 'Với tất cả sự yêu thương và trân quý,';
  const signature = config.letter?.signature || config.sender || '[TÊN CỦA BẠN]';
  const photos = config.photos || [];

  // Helper to wrap each word in a span so words can scrub while remaining selectable
  const wrapWords = (text) => {
    return text
      .split(' ')
      .map((word) => {
        const isEmphasized =
          word.includes('chốt') ||
          word.includes('đúng') ||
          word.includes('yêu') ||
          word.includes('lẩu') ||
          word.includes('nhau');
        return `<span class="letter-word ${isEmphasized ? 'emphasized' : ''}">${word} </span>`;
      })
      .join('');
  };

  container.innerHTML = `
    <section class="letter-section" id="letter-section">
      <!-- Watermark Chữ Hỷ 囍 Hoàng Gia Nền Thư -->
      <div class="xi-watermark xi-hero" style="top: 30%; opacity: 0.04;" aria-hidden="true">囍</div>

      <div class="letter-container">
        <header class="letter-header">
          <span class="letter-kicker">💌 TÂM TÌNH GỬI ĐÔI UYÊN ƯƠNG</span>
          <h2 class="letter-title">Những Lời Chúc Chân Thành Từ Trái Tim</h2>
        </header>

        <div class="letter-columns-grid">
          <!-- Left Column: Sticky Arch Photo Frame -->
          <div class="letter-sticky-visual">
            <div class="letter-arch-container frame-arch" id="letter-arch-container">
              <div class="letter-arch-ornament-badge">H &amp; K</div>
              ${photos
                .slice(0, 4)
                .map(
                  (photo, idx) => `
                <img 
                  src="${photo.src}" 
                  alt="${photo.caption || ''}" 
                  class="letter-arch-img ${idx === 0 ? 'is-active' : ''}" 
                  id="letter-photo-${idx}"
                  loading="lazy"
                />
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Right Column: Parchment Editorial Letter Sheet -->
          <div class="letter-text-column" id="letter-text-col">
            <div class="letter-parchment-sheet">
              <!-- Traditional Floral Corners -->
              <div class="letter-floral-corner tl">❧</div>
              <div class="letter-floral-corner tr">☙</div>
              <div class="letter-floral-corner bl">❧</div>
              <div class="letter-floral-corner br">☙</div>
              <div class="letter-sheet-xi-stamp">囍</div>

              <div class="letter-greeting">${greeting}</div>

              <div class="letter-paragraphs-wrapper" id="letter-paragraphs-box">
                ${paragraphs
                  .map(
                    (p, i) => `
                  <p class="letter-paragraph" id="letter-paragraph-${i}">
                    ${wrapWords(p)}
                  </p>
                `
                  )
                  .join('')}
              </div>

              <!-- Closing & Handwritten Signature -->
              <div class="letter-closing-box" id="letter-closing-box">
                <span class="letter-closing-text">${closing}</span>
                
                <div class="letter-signature-svg-wrapper" id="letter-sig-wrapper">
                  <svg class="letter-signature-svg" viewBox="0 0 240 70" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      class="letter-signature-path" 
                      d="M 20,45 Q 40,15 65,35 T 110,40 Q 130,20 150,48 T 195,30 Q 215,22 230,45" 
                    />
                    <text x="35" y="48" font-family="'Pinyon Script', 'Great Vibes', cursive" font-size="34" fill="var(--ink)" opacity="0.9">
                      ${signature}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  if (isReducedMotion()) {
    document.querySelectorAll('.letter-word').forEach((w) => w.classList.add('is-lit'));
    document.getElementById('letter-sig-wrapper')?.classList.add('is-signed');
    return;
  }

  // ScrollTrigger scrub for lighting up words & switching sticky photos
  const words = document.querySelectorAll('.letter-word');
  const photoEls = document.querySelectorAll('.letter-arch-img');
  const sigWrapper = document.getElementById('letter-sig-wrapper');

  ScrollTrigger.create({
    trigger: '#letter-section',
    start: 'top 75%',
    end: 'bottom 85%',
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalWords = words.length;
      const activeWordIndex = Math.floor(progress * totalWords);

      words.forEach((w, idx) => {
        if (idx <= activeWordIndex) {
          w.classList.add('is-lit');
        } else {
          w.classList.remove('is-lit');
        }
      });

      // Photo cross-dissolve based on progress
      if (photoEls.length > 0) {
        const photoIdx = Math.min(
          photoEls.length - 1,
          Math.floor(progress * photoEls.length)
        );
        photoEls.forEach((p, idx) => {
          if (idx === photoIdx) p.classList.add('is-active');
          else p.classList.remove('is-active');
        });
      }

      // Trigger signature draw near the end of letter
      if (progress > 0.88 && sigWrapper) {
        sigWrapper.classList.add('is-signed');
      }
    },
  });
}
