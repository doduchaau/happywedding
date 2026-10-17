import './styles/theme.css';
import './styles/base.css';
import './styles/responsive.css';
import './styles/loader.css';
import './styles/intro3d.css';
import './styles/hero.css';
import './styles/notifications.css';
import './styles/countdown.css';
import './styles/letter.css';
import './styles/gallery.css';
import './styles/contract.css';
import './styles/wishPit.css';
import './styles/scratchCards.css';
import './styles/video.css';
import './styles/nightSky.css';
import './styles/weddingOrnaments.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { CONFIG } from './config.js';
import { qualityManager } from './utils/quality.js';
import { sfx } from './utils/sfx.js';
import { audioManager } from './utils/audio.js';
import { isReducedMotion } from './utils/motion.js';

import { initCustomCursor, initMagneticElements } from './effects/customCursor.js';
import { initFallingPetals, createSectionDivider, spawnHeartAt } from './effects/weddingOrnaments.js';

import { runPreloader } from './sections/loader.js';
import { initIntro3D } from './sections/intro3d.js';
import { initHeroSection } from './sections/hero.js';
import { startNotificationBanners } from './sections/notifications.js';
import { initCountdownSection } from './sections/countdown.js';
import { initLetterSection } from './sections/letter.js';
import { initGallerySection } from './sections/gallery.js';
import { initContractSection } from './sections/contract.js';
import { initWishPitSection } from './sections/wishPit.js';
import { initScratchCardsSection } from './sections/scratchCards.js';
import { initVideoSection } from './sections/video.js';
import { initNightSkySection } from './sections/nightSky.js';

gsap.registerPlugin(ScrollTrigger);

// 1. Direct route check for Style Tile
if (
  window.location.pathname === '/style-tile' ||
  window.location.search.includes('style-tile') ||
  window.location.hash === '#style-tile'
) {
  window.location.replace('/style-tile.html');
}

// 2. Apply theme CSS variables from CONFIG if provided
if (CONFIG.theme) {
  const root = document.documentElement;
  if (CONFIG.theme.ivory) root.style.setProperty('--ivory', CONFIG.theme.ivory);
  if (CONFIG.theme.blush) root.style.setProperty('--blush', CONFIG.theme.blush);
  if (CONFIG.theme.pink) root.style.setProperty('--pink', CONFIG.theme.pink);
  if (CONFIG.theme.roseGold) root.style.setProperty('--rose-gold', CONFIG.theme.roseGold);
  if (CONFIG.theme.champagne) root.style.setProperty('--champagne', CONFIG.theme.champagne);
  if (CONFIG.theme.wine) root.style.setProperty('--wine', CONFIG.theme.wine);
  if (CONFIG.theme.night) root.style.setProperty('--night', CONFIG.theme.night);
  if (CONFIG.theme.ink) root.style.setProperty('--ink', CONFIG.theme.ink);
  if (CONFIG.theme.paper) root.style.setProperty('--paper', CONFIG.theme.paper);
}

// 3. Initialize smooth scrolling with Lenis + ScrollTrigger integration
let lenis = null;
if (!isReducedMotion()) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Keep scroll locked while preloader & 3D intro are active
  lenis.stop();
}

// 3b. Đồng bộ Lenis với trạng thái modal (lightbox / capsule)
window.addEventListener('app:modal-open', () => lenis?.stop());
window.addEventListener('app:modal-close', () => {
  if (!document.body.classList.contains('scroll-locked')) lenis?.start();
});

// 3c. Debounced refresh khi resize / xoay máy / đổi hướng
let refreshTimer = null;
const scheduleRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
    updateScrollProgress();
  }, 200);
};
window.addEventListener('resize', scheduleRefresh);
window.addEventListener('orientationchange', scheduleRefresh);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', scheduleRefresh);
}

// 4. Gold scroll progress bar indicator
const progressBar = document.getElementById('scroll-progress');
const updateScrollProgress = () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// 5. Audio manager & sound effects
const musicToggleBtn = document.getElementById('music-toggle-btn');
if (CONFIG.music) {
  audioManager.init(CONFIG.music);

  audioManager.subscribe(({ isPlaying, isMuted }) => {
    sfx.setMuted(isMuted || !isPlaying);
    if (!musicToggleBtn) return;
    if (isPlaying && !isMuted) {
      musicToggleBtn.classList.remove('is-muted');
      musicToggleBtn.setAttribute('aria-label', 'Tắt âm thanh');
    } else {
      musicToggleBtn.classList.add('is-muted');
      musicToggleBtn.setAttribute('aria-label', 'Bật âm thanh');
    }
  });

  musicToggleBtn?.addEventListener('click', () => {
    sfx.unlock();
    audioManager.toggle();
  });
}

// 6. "Tiết kiệm hiệu ứng" (Reduce effects) accessibility toggle
const effectsToggleBtn = document.getElementById('effects-toggle-btn');
effectsToggleBtn?.addEventListener('click', () => {
  const isReduced = qualityManager.toggleReduceEffects();
  if (isReduced) {
    effectsToggleBtn.classList.add('active');
    effectsToggleBtn.textContent = 'Bật lại hiệu ứng';
    audioManager.showToast('Đã kích hoạt chế độ tiết kiệm hiệu ứng nhẹ nhàng');
  } else {
    effectsToggleBtn.classList.remove('active');
    effectsToggleBtn.textContent = 'Tiết kiệm hiệu ứng';
    audioManager.showToast('Đã bật lại đầy đủ hiệu ứng điện ảnh');
  }
});

// 7. Global editorial custom cursor & magnetic buttons
initCustomCursor();

// 8. Initialize all chapters in architectural order
const hero = initHeroSection(CONFIG);
initCountdownSection(CONFIG);
initLetterSection(CONFIG);
initGallerySection(CONFIG);
initContractSection(CONFIG);
initWishPitSection(CONFIG);
initScratchCardsSection(CONFIG);
initVideoSection(CONFIG);
initNightSkySection(CONFIG);

// 8b. Setup Ceremonial Wedding Dividers & Falling Rose Petals
setupCeremonialDividers();
initFallingPetals();

// Interactive Floating Heart on subtle click/tap anywhere on page
window.addEventListener('click', (e) => {
  // Avoid interfering if clicked inside inputs or buttons
  if (e.target.closest('button, input, textarea, a, canvas')) return;
  spawnHeartAt(e.clientX, e.clientY);
});

// 9. Chapter Navigation Tracker & Page Background Color Transition on Scroll
setupChapterTracker();

// 10. Launch Preloader -> 3D Sealed Envelope Intro -> Hero Flow
runPreloader(CONFIG, () => {
  // Preloader finished -> Start Chapter I: 3D Sealed Envelope
  initIntro3D(CONFIG, () => {
    // 3D Intro opened or skipped -> Unlock scroll & play hero entrance
    if (lenis) lenis.start();
    hero.playEntrance();
    startNotificationBanners(CONFIG);
    initMagneticElements();
    ScrollTrigger.refresh();
  });
});

/**
 * Inserts ceremonial wedding dividers between editorial chapters
 */
function setupCeremonialDividers() {
  const pairs = [
    { targetId: 'countdown-section-mount', type: 'swans', title: 'TRĂM NĂM HẢO HỢP • VĨNH KẾT ĐỒNG TÂM', isDark: false },
    { targetId: 'letter-section-mount', type: 'xi', title: 'HỶ SỰ LƯU NIÊN • LỜI CHÚC PHÚC', isDark: true },
    { targetId: 'gallery-section-mount', type: 'rings', title: 'KHOẢNH KHẮC VĨNH CỬU • TÌNH YÊU NỞ HOA', isDark: false },
    { targetId: 'contract-section-mount', type: 'xi', title: 'GIAO ƯỚC TRĂM NĂM • SẮC SON VẸN TOÀN', isDark: false },
    { targetId: 'wish-pit-section-mount', type: 'rings', title: 'BỂ ƯỚC NGUYỆN • NGÀN LỜI CHÚC PHÚC', isDark: true },
    { targetId: 'scratch-cards-section-mount', type: 'xi', title: 'KHAI MỞ KÝ ỨC DÁT VÀNG', isDark: false },
  ];

  pairs.forEach(({ targetId, type, title, isDark }) => {
    const el = document.getElementById(targetId);
    if (el && el.parentNode) {
      const divider = createSectionDivider({ type, title, isDark });
      el.parentNode.insertBefore(divider, el);
    }
  });
}

/**
 * Chapter Indicator & Background Color Transitions
 * Transitions background ivory -> wine -> ivory -> blush -> wine -> ivory -> night
 */
function setupChapterTracker() {
  const numEl = document.getElementById('chapter-nav-num');
  const titleEl = document.getElementById('chapter-nav-title');
  const root = document.documentElement;

  const chapterConfigs = [
    {
      id: '#hero-section',
      num: 'II',
      title: 'Đếm ngược',
      bg: 'var(--ivory)',
      text: 'var(--ink)',
      muted: 'var(--ink-muted)',
    },
    {
      id: '#countdown-section',
      num: 'II',
      title: 'Đếm ngược',
      bg: 'var(--wine)',
      text: 'var(--ivory)',
      muted: 'rgba(251, 244, 238, 0.65)',
    },
    {
      id: '#letter-section',
      num: 'III',
      title: 'Lá thư',
      bg: 'var(--ivory)',
      text: 'var(--ink)',
      muted: 'var(--ink-muted)',
    },
    {
      id: '#gallery-section',
      num: 'IV',
      title: 'Khoảnh khắc',
      bg: 'var(--blush)',
      text: 'var(--ink)',
      muted: 'var(--ink-muted)',
    },
    {
      id: '#contract-section',
      num: 'V',
      title: 'Hợp đồng',
      bg: 'var(--wine)',
      text: 'var(--ivory)',
      muted: 'rgba(251, 244, 238, 0.65)',
    },
    {
      id: '#wish-pit-section',
      num: 'VI',
      title: 'Lời chúc',
      bg: 'var(--ivory)',
      text: 'var(--ink)',
      muted: 'var(--ink-muted)',
    },
    {
      id: '#scratch-section',
      num: 'VII',
      title: 'Đêm pháo hoa',
      bg: 'var(--ivory)',
      text: 'var(--ink)',
      muted: 'var(--ink-muted)',
    },
    {
      id: '#night-sky-section',
      num: 'VII',
      title: 'Đêm pháo hoa',
      bg: 'var(--night)',
      text: 'var(--ivory)',
      muted: 'rgba(251, 244, 238, 0.65)',
    },
  ];

  chapterConfigs.forEach((chap) => {
    const el = document.querySelector(chap.id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => updateActiveChapter(chap),
      onEnterBack: () => updateActiveChapter(chap),
    });
  });

  function updateActiveChapter(chap) {
    if (numEl) numEl.textContent = chap.num;
    if (titleEl) titleEl.textContent = chap.title;

    root.style.setProperty('--chapter-bg', chap.bg);
    root.style.setProperty('--chapter-text', chap.text);
    root.style.setProperty('--chapter-muted', chap.muted);
  }
}
