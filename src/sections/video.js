import { audioManager } from '../utils/audio.js';

export function initVideoSection(config) {
  const container = document.getElementById('video-section-mount');
  if (!container) return;

  if (!config.video || config.video.show !== true) {
    container.innerHTML = '';
    return;
  }

  const title = config.video.title || 'Thước phim kỷ niệm gửi tặng hai bạn';
  const src = config.video.src || './video/loi-chuc.mp4';
  const poster = config.video.poster || './photos/photo-1.jpg';

  container.innerHTML = `
    <section class="video-section" id="video-section">
      <div class="video-cinema-container">
        <header style="text-align: center; margin-bottom: 3.5rem;">
          <span style="font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: var(--tracking-widest); text-transform: uppercase; color: var(--champagne); display: block; margin-bottom: 0.75rem;">
            ĐIỆN ẢNH • THƯỚC PHIM
          </span>
          <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 400; color: var(--ivory);">
            ${title}
          </h2>
        </header>

        <div class="video-frame-card">
          <div class="video-player-wrapper">
            <video 
              class="video-element" 
              id="gift-video-player"
              playsinline
              preload="metadata"
              poster="${poster}"
            >
              <source src="${src}" type="video/mp4" />
              Trình duyệt không hỗ trợ phát video.
            </video>

            <div class="video-custom-overlay" id="video-overlay" data-cursor="open">
              <div class="video-play-btn">▶</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const video = document.getElementById('gift-video-player');
  const overlay = document.getElementById('video-overlay');

  if (video && overlay) {
    overlay.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        overlay.classList.add('is-playing');
        audioManager.pause();
      } else {
        video.pause();
        overlay.classList.remove('is-playing');
        audioManager.play();
      }
    });

    video.addEventListener('ended', () => {
      overlay.classList.remove('is-playing');
      audioManager.play();
    });

    video.addEventListener('pause', () => {
      overlay.classList.remove('is-playing');
      audioManager.play();
    });
  }
}
