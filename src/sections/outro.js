import { confettiPresets } from '../effects/confettiPresets.js';

export function initOutroSection(config) {
  const container = document.getElementById('outro-section-mount');
  if (!container) return;

  const sender = config.sender || '[TÊN CỦA BẠN]';
  const defaultMsg = `Gửi hai bạn, từ ${sender}, với tất cả yêu thương (và một chút đùa dai).`;
  const message = config.outro?.message || defaultMsg;
  const buttonLabel = config.outro?.buttonLabel || 'Chúc mừng!';
  const counterLabel = config.outro?.counterLabel || 'lượt chúc mừng';

  container.innerHTML = `
    <footer class="section outro-section" id="outro-section">
      <div class="outro-card">
        <div class="outro-heart-icon" aria-hidden="true">💌</div>

        <p class="outro-message">${message}</p>

        <button type="button" class="btn-pill outro-congrats-btn" id="outro-congrats-btn">
          <span>🎉</span>
          <span>${buttonLabel}</span>
        </button>

        <div class="outro-counter-wrapper">
          <span class="outro-counter-num" id="outro-counter-num">1</span>
          <span>${counterLabel}</span>
        </div>
      </div>

      <p class="outro-footer-note">
        Được gửi tặng với tất cả niềm hạnh phúc dành cho Thúy Hiền & Trung Kiên ✨
      </p>
    </footer>
  `;

  let count = 1;
  const btn = document.getElementById('outro-congrats-btn');
  const countEl = document.getElementById('outro-counter-num');

  btn?.addEventListener('click', () => {
    count++;
    if (countEl) {
      countEl.textContent = count.toLocaleString('vi-VN');
      countEl.classList.remove('bump');
      // Force reflow
      void countEl.offsetWidth;
      countEl.classList.add('bump');
    }

    confettiPresets.triggerOutroBurst(btn);
  });
}
