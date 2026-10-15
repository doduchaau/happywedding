import { parseWeddingDate, calculateTimeRemaining, padZero } from '../utils/countdown.js';
import { confettiPresets } from '../effects/confettiPresets.js';
import { sfx } from '../utils/sfx.js';
import { isReducedMotion } from '../utils/motion.js';
import { getStringLightsHtml, getWeddingRingsSvg } from '../effects/weddingOrnaments.js';

export function initCountdownSection(config) {
  const container = document.getElementById('countdown-section-mount');
  if (!container) return { destroy: () => {} };

  const title = config.countdown?.title || 'Đếm ngược đến ngày chung đôi';
  const subtitle = config.countdown?.subtitle || 'Từng khoảnh khắc trôi qua đều hướng về ngày hai bạn nắm chặt tay nhau';
  const labels = config.countdown?.labels || {
    days: 'NGÀY',
    hours: 'GIỜ',
    minutes: 'PHÚT',
    seconds: 'GIÂY',
  };
  const doneTitle = config.countdown?.doneTitle || 'HÔM NAY LÀ NGÀY CỦA HAI BẠN!';
  const doneSubtitle = config.countdown?.doneSubtitle || 'Về chung một nhà thôi, hành trình tuyệt đẹp chính thức bắt đầu!';

  const parsed = parseWeddingDate(config.weddingDate);
  let targetTimestamp = parsed.valid ? parsed.timestamp : null;
  let isDemoDate = false;

  if (!parsed.valid) {
    // Demonstration fallback target: 30 days ahead so UI remains fully interactive
    targetTimestamp = Date.now() + 30 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000;
    isDemoDate = true;
  }

  // Ring circumference for r = 44
  const circumference = 2 * Math.PI * 44;

  container.innerHTML = `
    <section class="countdown-section" id="countdown-section">
      <!-- Dây đèn trang trí fairy lights ấm áp -->
      ${getStringLightsHtml()}

      <!-- Chữ Hỷ 囍 Watermark Hoàng Gia Nền Rượu Vang -->
      <div class="xi-watermark xi-countdown" aria-hidden="true">囍</div>

      <div class="countdown-container">
        <!-- Biểu tượng cặp nhẫn cưới vàng lồng nhau -->
        <div class="wedding-rings-badge" aria-hidden="true">
          ${getWeddingRingsSvg()}
          <span class="rings-sparkle">✦</span>
        </div>

        <span class="countdown-kicker">💍 THỜI KHẮC THIÊNG LIÊNG • ĐẾM NGƯỢC</span>
        <h2 class="countdown-title">${title}</h2>
        <p class="countdown-subtitle">${subtitle}</p>

        <div id="countdown-content-area">
          <div class="countdown-grid" id="countdown-grid">
            <!-- Days Unit -->
            <div class="countdown-card" id="card-days">
              <div class="countdown-ring-wrapper">
                <svg class="countdown-ring-svg" viewBox="0 0 100 100">
                  <circle class="countdown-ring-bg" cx="50" cy="50" r="44" />
                  <circle 
                    class="countdown-ring-fill" 
                    id="ring-days" 
                    cx="50" 
                    cy="50" 
                    r="44" 
                    stroke-dasharray="${circumference}" 
                    stroke-dashoffset="${circumference}" 
                  />
                </svg>
                <div class="odometer-digit-box">
                  <div class="odometer-digit-track" id="odometer-days">
                    <span class="odometer-digit-value" id="digit-days">00</span>
                  </div>
                </div>
              </div>
              <span class="countdown-label">${labels.days}</span>
            </div>

            <!-- Hours Unit -->
            <div class="countdown-card" id="card-hours">
              <div class="countdown-ring-wrapper">
                <svg class="countdown-ring-svg" viewBox="0 0 100 100">
                  <circle class="countdown-ring-bg" cx="50" cy="50" r="44" />
                  <circle 
                    class="countdown-ring-fill" 
                    id="ring-hours" 
                    cx="50" 
                    cy="50" 
                    r="44" 
                    stroke-dasharray="${circumference}" 
                    stroke-dashoffset="${circumference}" 
                  />
                </svg>
                <div class="odometer-digit-box">
                  <div class="odometer-digit-track" id="odometer-hours">
                    <span class="odometer-digit-value" id="digit-hours">00</span>
                  </div>
                </div>
              </div>
              <span class="countdown-label">${labels.hours}</span>
            </div>

            <!-- Minutes Unit -->
            <div class="countdown-card" id="card-minutes">
              <div class="countdown-ring-wrapper">
                <svg class="countdown-ring-svg" viewBox="0 0 100 100">
                  <circle class="countdown-ring-bg" cx="50" cy="50" r="44" />
                  <circle 
                    class="countdown-ring-fill" 
                    id="ring-minutes" 
                    cx="50" 
                    cy="50" 
                    r="44" 
                    stroke-dasharray="${circumference}" 
                    stroke-dashoffset="${circumference}" 
                  />
                </svg>
                <div class="odometer-digit-box">
                  <div class="odometer-digit-track" id="odometer-minutes">
                    <span class="odometer-digit-value" id="digit-minutes">00</span>
                  </div>
                </div>
              </div>
              <span class="countdown-label">${labels.minutes}</span>
            </div>

            <!-- Seconds Unit -->
            <div class="countdown-card" id="card-seconds">
              <div class="countdown-ring-wrapper">
                <svg class="countdown-ring-svg" viewBox="0 0 100 100">
                  <circle class="countdown-ring-bg" cx="50" cy="50" r="44" />
                  <circle 
                    class="countdown-ring-fill" 
                    id="ring-seconds" 
                    cx="50" 
                    cy="50" 
                    r="44" 
                    stroke-dasharray="${circumference}" 
                    stroke-dashoffset="${circumference}" 
                  />
                </svg>
                <div class="odometer-digit-box">
                  <div class="odometer-digit-track" id="odometer-seconds">
                    <span class="odometer-digit-value" id="digit-seconds">00</span>
                  </div>
                </div>
              </div>
              <span class="countdown-label">${labels.seconds}</span>
            </div>
          </div>

          ${
            isDemoDate
              ? `
            <div class="countdown-notice">
              ✦ <span>Gợi ý: Cập nhật ngày cưới chính thức trong <code>src/config.js</code> để đếm ngược chính xác nhé!</span>
            </div>
          `
              : ''
          }
        </div>
      </div>
    </section>
  `;

  let lastValues = { days: null, hours: null, minutes: null, seconds: null };
  let hasTriggeredCelebration = false;

  const updateUnit = (type, val, fraction) => {
    const el = document.getElementById(`digit-${type}`);
    const track = document.getElementById(`odometer-${type}`);
    const ring = document.getElementById(`ring-${type}`);

    const formatted = padZero(val);

    // Update progress ring offset
    if (ring) {
      const offset = circumference * (1 - Math.min(1, Math.max(0, fraction)));
      ring.style.strokeDashoffset = `${offset}`;
    }

    if (!el || el.textContent === formatted) return;

    if (isReducedMotion() || lastValues[type] === null) {
      el.textContent = formatted;
      lastValues[type] = formatted;
      return;
    }

    // Vertical roll animation
    if (track) {
      const nextEl = document.createElement('span');
      nextEl.className = 'odometer-digit-value';
      nextEl.textContent = formatted;
      track.appendChild(nextEl);

      track.style.transform = 'translateY(-50%)';
      setTimeout(() => {
        el.textContent = formatted;
        track.style.transition = 'none';
        track.style.transform = 'translateY(0)';
        nextEl.remove();
        void track.offsetWidth;
        track.style.transition = '';
      }, 650);
    } else {
      el.textContent = formatted;
    }

    lastValues[type] = formatted;
  };

  const renderCelebration = () => {
    const area = document.getElementById('countdown-content-area');
    if (!area) return;

    area.innerHTML = `
      <div class="countdown-celebration">
        <div style="font-size: 2rem; color: var(--champagne); margin-bottom: 0.5rem;">✦ ✦ ✦</div>
        <h3 class="celebration-title">${doneTitle}</h3>
        <p class="celebration-subtitle">${doneSubtitle}</p>
      </div>
    `;

    if (!hasTriggeredCelebration) {
      hasTriggeredCelebration = true;
      sfx.sparkleShimmer();
      confettiPresets.weddingCelebration();
    }
  };

  const tick = () => {
    const remaining = calculateTimeRemaining(targetTimestamp);

    if (remaining.isDone && !isDemoDate) {
      renderCelebration();
      return true;
    }

    // Fractions for gold rings
    const secFraction = remaining.seconds / 60;
    const minFraction = remaining.minutes / 60;
    const hrFraction = remaining.hours / 24;
    const dayFraction = Math.min(1, remaining.days / 100);

    updateUnit('days', remaining.days, dayFraction);
    updateUnit('hours', remaining.hours, hrFraction);
    updateUnit('minutes', remaining.minutes, minFraction);
    updateUnit('seconds', remaining.seconds, secFraction);

    return false;
  };

  const isFinished = tick();

  let interval = null;
  if (!isFinished) {
    interval = setInterval(() => {
      const done = tick();
      if (done && interval) {
        clearInterval(interval);
      }
    }, 1000);
  }

  return {
    destroy() {
      if (interval) clearInterval(interval);
    },
  };
}
