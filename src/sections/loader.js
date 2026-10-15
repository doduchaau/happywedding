import { qualityManager } from '../utils/quality.js';
import { isReducedMotion } from '../utils/motion.js';

export function runPreloader(config, onComplete) {
  const mount = document.getElementById('loader-mount');
  if (!mount) {
    if (onComplete) onComplete();
    return;
  }

  const messages = config.loader?.messages || [
    'ĐANG THIẾT KẾ THIỆP MỜI ĐỘC BẢN...',
    'ĐANG ĐO NI ĐÓNG GIÀY BỘ VEST TRUNG KIÊN...',
    'ĐANG ĐÍNH TỪNG VIÊN PHA LÊ LÊN VÁY CƯỚI...',
    'BẢN TIN ĐẶC BIỆT CHUẨN BỊ LÊN SÓNG...',
    'SẮP HOÀN TẤT, XIN ĐỪNG RƠI LỆ SỚM...',
  ];

  mount.innerHTML = `
    <div class="preloader-screen" id="preloader-screen" role="progressbar" aria-label="Đang chuẩn bị trang web">
      <div class="preloader-curtain preloader-curtain-top" id="curtain-top"></div>
      <div class="preloader-curtain preloader-curtain-bottom" id="curtain-bottom"></div>

      <div class="preloader-center-content">
        <!-- SVG Monogram Draw: H & K in elegant serif strokes -->
        <div class="loader-monogram-box">
          <svg class="loader-monogram-svg" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <!-- Letter H -->
            <path class="loader-monogram-path" d="M 30,20 L 30,100 M 30,58 L 75,58 M 75,20 L 75,100" />
            <!-- Ampersand & in calligraphic curve -->
            <path class="loader-monogram-path" d="M 112,85 C 102,96 88,94 88,80 C 88,68 100,58 106,46 C 111,36 106,24 96,24 C 88,24 84,32 86,40 C 90,56 122,86 126,98 C 128,103 124,106 116,104" />
            <!-- Letter K -->
            <path class="loader-monogram-path" d="M 145,20 L 145,100 M 178,25 L 147,60 L 182,100" />
          </svg>
        </div>

        <!-- Serif Percentage Counter & Hairline -->
        <div class="loader-counter-wrapper">
          <div class="loader-pct-number" id="loader-pct-number">
            0<span>%</span>
          </div>
          <div class="loader-hairline-track">
            <div class="loader-hairline-fill" id="loader-hairline-fill"></div>
          </div>
        </div>

        <!-- Small Caps Editorial Message -->
        <div class="loader-msg-box">
          <p class="loader-msg-text" id="loader-msg-text">${messages[0]}</p>
        </div>
      </div>
    </div>
  `;

  const screenEl = document.getElementById('preloader-screen');
  const fillEl = document.getElementById('loader-hairline-fill');
  const pctEl = document.getElementById('loader-pct-number');
  const msgEl = document.getElementById('loader-msg-text');

  let currentMsgIdx = 0;
  const msgInterval = setInterval(() => {
    currentMsgIdx = (currentMsgIdx + 1) % messages.length;
    if (msgEl) {
      msgEl.classList.add('fading');
      setTimeout(() => {
        msgEl.textContent = messages[currentMsgIdx];
        msgEl.classList.remove('fading');
      }, 300);
    }
  }, 1300);

  // Smooth numeric counter progress
  let currentPct = 12;
  let targetPct = 12;

  const updateDisplay = () => {
    if (fillEl) fillEl.style.width = `${currentPct}%`;
    if (pctEl) {
      pctEl.innerHTML = `${Math.round(currentPct)}<span>%</span>`;
    }
  };

  updateDisplay();

  const animCounter = () => {
    if (currentPct < targetPct) {
      currentPct += (targetPct - currentPct) * 0.15 + 0.5;
      if (currentPct > targetPct) currentPct = targetPct;
      updateDisplay();
    }
    if (currentPct < 100) {
      requestAnimationFrame(animCounter);
    }
  };
  requestAnimationFrame(animCounter);

  const setProgress = (pct) => {
    targetPct = Math.max(targetPct, pct);
  };

  // Real progress tasks
  const runTasks = async () => {
    try {
      setProgress(35);
      if (document.fonts) await document.fonts.ready;
      setProgress(60);

      // Probe device FPS (~500ms)
      await qualityManager.runFpsProbe();
      setProgress(88);

      // Brief finish delay for visual elegance
      await new Promise((r) => setTimeout(r, isReducedMotion() ? 100 : 350));
      setProgress(100);
      await new Promise((r) => setTimeout(r, 200));
    } catch (_) {
      setProgress(100);
    }
  };

  runTasks().then(() => {
    clearInterval(msgInterval);
    qualityManager.startFpsMonitor();

    // Trigger split curtain exit
    screenEl?.classList.add('is-exiting');
    setTimeout(() => {
      screenEl?.remove();
      if (onComplete) onComplete();
    }, 1100);
  });
}
