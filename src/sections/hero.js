import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '../utils/motion.js';
import { sfx } from '../utils/sfx.js';
import { confettiPresets } from '../effects/confettiPresets.js';
import { getSwansHeartSvg } from '../effects/weddingOrnaments.js';

export function initHeroSection(config) {
  const container = document.getElementById('hero-section-mount');
  if (!container) return { playEntrance: () => {} };

  const kicker = config.hero?.kicker || 'Bản tin đặc biệt: Hai người này sắp về chung một nhà.';
  const headline = config.hero?.headline || 'Chính thức chốt đơn trọn đời.';
  const subtitle = config.hero?.subtitle || 'Một đám cưới được mong chờ nhất mùa thu này.';
  const bride = config.couple?.bride || 'Thúy Hiền';
  const groom = config.couple?.groom || 'Trung Kiên';
  const marqueeItems = config.marquee || ['THÚY HIỀN', 'TRUNG KIÊN', 'CHÚC MỪNG HẠNH PHÚC', 'TRĂM NĂM HẢO HỢP'];
  const photos = config.photos || [];

  const photo1 = photos[0]?.src || './photos/photo-1.jpg';
  const photo2 = photos[1]?.src || './photos/photo-2.jpg';
  const photo3 = photos[2]?.src || './photos/photo-3.jpg';

  container.innerHTML = `
    <section class="hero-section" id="hero-section">
      <!-- Watermark Chữ Hỷ 囍 Hoàng Gia Lớn -->
      <div class="xi-watermark xi-hero" aria-hidden="true">囍</div>

      <!-- WebGL / Canvas Fluid Gradient Backdrop -->
      <canvas class="hero-webgl-canvas" id="hero-gradient-canvas"></canvas>

      <!-- Ambient Glow Orbs Fallback -->
      <div class="hero-gradient-orb hero-orb-1" aria-hidden="true"></div>
      <div class="hero-gradient-orb hero-orb-2" aria-hidden="true"></div>

      <!-- Floating Arch Frames with Parallax -->
      <div class="hero-floating-frames" id="hero-floating-frames" aria-hidden="true">
        <div class="hero-float-frame hero-float-frame-1 frame-arch" id="float-frame-1">
          <img src="${photo1}" alt="Hoa cưới" class="hero-float-img" loading="eager" />
        </div>
        <div class="hero-float-frame hero-float-frame-2 frame-arch" id="float-frame-2">
          <img src="${photo2}" alt="Thiên nga tình yêu" class="hero-float-img" loading="eager" />
        </div>
        <div class="hero-float-frame hero-float-frame-3 frame-arch" id="float-frame-3">
          <img src="${photo3}" alt="Nhẫn cưới vĩnh cửu" class="hero-float-img" loading="eager" />
        </div>
      </div>

      <!-- Hero Main Editorial Content -->
      <div class="hero-content">
        <!-- Ceremonial Wedding Ribbon Tag -->
        <div class="hero-wedding-tag">
          <span class="wedding-tag-ornament">✦</span>
          <span class="wedding-tag-label">LỄ THÀNH HÔN • CHÚC MỪNG HẠNH PHÚC</span>
          <span class="wedding-tag-ornament">✦</span>
        </div>

        <!-- Kicker -->
        <div class="hero-kicker-wrapper">
          <span class="hero-kicker" id="hero-kicker">${kicker}</span>
        </div>

        <!-- Headline -->
        <div class="hero-headline-wrapper">
          <h2 class="hero-headline" id="hero-headline">${headline}</h2>
        </div>

        <!-- Masked Line-by-Line Names -->
        <div class="hero-names-container" id="hero-names-container">
          <div class="hero-name-line-mask">
            <span class="hero-name-line hero-name-bride" id="hero-bride" data-cursor-label="Hiền" title="Chạm nhiều lần để mở bất ngờ">
              ${bride}
            </span>
          </div>

          <div class="hero-center-flourish">
            <div class="hero-swans-heart-accent" aria-hidden="true">
              ${getSwansHeartSvg()}
            </div>
            <div class="hero-ampersand-mask">
              <span class="hero-ampersand gold-foil" id="hero-ampersand">&amp;</span>
            </div>
          </div>

          <div class="hero-name-line-mask">
            <span class="hero-name-line italic" id="hero-groom">${groom}</span>
          </div>
        </div>

        <!-- Subtitle -->
        <div class="hero-subtitle-wrapper">
          <p class="hero-subtitle" id="hero-subtitle">${subtitle}</p>
        </div>

      </div>

      <!-- Easter Egg Secret Modal -->
      <div class="easter-egg-modal" id="easter-egg-modal" role="dialog" aria-modal="true" aria-label="Lời nhắn bí mật">
        <div class="easter-egg-card">
          <div style="font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--champagne);">✦ ✦ ✦</div>
          <h3 class="easter-egg-title">Bản tin mật</h3>
          <p class="easter-egg-message" id="easter-egg-msg"></p>
          <button type="button" class="btn-pill" id="easter-egg-close-btn">
            Tớ đã hiểu rồi
          </button>
        </div>
      </div>
    </section>

    <!-- Infinite Scrolling Marquee Band -->
    <div class="marquee-band-container" id="marquee-band" aria-hidden="true">
      <div class="marquee-track" id="marquee-track">
        ${[...marqueeItems, ...marqueeItems, ...marqueeItems]
          .map((item, idx) => `
            <div class="marquee-item ${idx % 2 === 1 ? 'outlined' : ''}">
              <span>${item}</span>
              <span class="marquee-separator">✦</span>
            </div>
          `)
          .join('')}
      </div>
    </div>
  `;

  // 1. Fluid Shader Gradient Simulation on Canvas
  const canvas = document.getElementById('hero-gradient-canvas');
  initHeroFluidCanvas(canvas);

  // 2. Parallax on Floating Arch Frames
  if (!isReducedMotion()) {
    const f1 = document.getElementById('float-frame-1');
    const f2 = document.getElementById('float-frame-2');
    const f3 = document.getElementById('float-frame-3');

    window.addEventListener(
      'mousemove',
      (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;

        if (f1) f1.style.transform = `translate3d(${nx * 18}px, ${ny * 22}px, 0)`;
        if (f2) f2.style.transform = `translate3d(${-nx * 24}px, ${-ny * 18}px, 0)`;
        if (f3) f3.style.transform = `translate3d(${nx * 12}px, ${-ny * 16}px, 0)`;
      },
      { passive: true }
    );
  }

  // 3. Scroll Badge Click Navigation
  const badge = document.getElementById('hero-scroll-badge');
  badge?.addEventListener('click', () => {
    const nextSection = document.getElementById('countdown-section') || document.querySelector('.countdown-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // 4. Easter Egg: Tap Bride Name N times
  const brideEl = document.getElementById('hero-bride');
  const modalEl = document.getElementById('easter-egg-modal');
  const modalMsg = document.getElementById('easter-egg-msg');
  const modalClose = document.getElementById('easter-egg-close-btn');

  let tapCount = 0;
  let tapTimer = null;
  const targetTaps = config.easterEgg?.taps || 5;
  const secretMessage = config.easterEgg?.message || 'Bí mật nho nhỏ: Chúc hai cậu trăm năm hạnh phúc!';

  brideEl?.addEventListener('click', () => {
    tapCount++;
    sfx.harpPluck();
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 3000);

    if (tapCount >= targetTaps) {
      tapCount = 0;
      modalMsg.textContent = secretMessage;
      modalEl.classList.add('is-open');
      sfx.sparkleShimmer();
      confettiPresets.weddingCelebration();
    }
  });

  modalClose?.addEventListener('click', () => {
    modalEl.classList.remove('is-open');
  });

  // 5. Infinite Marquee Animation with Scroll Velocity Response
  setupInfiniteMarquee();

  // 6. Masked Line Entrance Reveal Timeline
  const kickerEl = document.getElementById('hero-kicker');
  const headlineEl = document.getElementById('hero-headline');
  const brideLine = document.getElementById('hero-bride');
  const ampersandLine = document.getElementById('hero-ampersand');
  const groomLine = document.getElementById('hero-groom');
  const subtitleEl = document.getElementById('hero-subtitle');
  const frames = document.querySelectorAll('.hero-float-frame');
  const swansEl = document.querySelector('.hero-swans-heart-accent');

  if (!isReducedMotion()) {
    gsap.set([kickerEl, headlineEl, subtitleEl], { y: 25, opacity: 0 });
    gsap.set([brideLine, ampersandLine, groomLine], { yPercent: 110 });
    if (swansEl) gsap.set(swansEl, { opacity: 0, scale: 0.8, y: 15 });
    gsap.set(frames, { opacity: 0, scale: 0.92 });
  }

  const playEntrance = () => {
    if (isReducedMotion()) {
      gsap.set([kickerEl, headlineEl, subtitleEl, brideLine, ampersandLine, groomLine, frames, swansEl], {
        opacity: 1,
        y: 0,
        yPercent: 0,
        scale: 1,
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to(kickerEl, { opacity: 1, y: 0, duration: 0.9 })
      .to(headlineEl, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to(brideLine, { yPercent: 0, duration: 1.2 }, '-=0.5')
      .to(swansEl, { opacity: 1, scale: 1, y: 0, duration: 1.0 }, '-=0.8')
      .to(ampersandLine, { yPercent: 0, duration: 1.1 }, '-=0.9')
      .to(groomLine, { yPercent: 0, duration: 1.2 }, '-=0.9')
      .to(subtitleEl, { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to(frames, { opacity: 1, scale: 1, duration: 1.4, stagger: 0.18, ease: 'expo.out' }, '-=1.0');
  };

  return { playEntrance };
}

/**
 * Animated Fluid Canvas Gradient Mesh (Blush, Pink, Champagne)
 */
function initHeroFluidCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetX = mouseX;
  let targetY = mouseY;

  const onMove = (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let time = 0;
  let animId = null;

  function render() {
    time += 0.008;
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // Warm blush gradient background
    const grad1 = ctx.createRadialGradient(
      width * 0.35 + Math.sin(time) * 120 + (mouseX - width / 2) * 0.08,
      height * 0.4 + Math.cos(time * 0.8) * 90 + (mouseY - height / 2) * 0.08,
      50,
      width * 0.35,
      height * 0.4,
      width * 0.6
    );
    grad1.addColorStop(0, 'rgba(243, 217, 212, 0.7)'); // Blush
    grad1.addColorStop(1, 'rgba(251, 244, 238, 0)');

    // Champagne gold warmth
    const grad2 = ctx.createRadialGradient(
      width * 0.7 - Math.cos(time * 0.9) * 100,
      height * 0.65 + Math.sin(time * 0.7) * 80,
      60,
      width * 0.7,
      height * 0.65,
      width * 0.55
    );
    grad2.addColorStop(0, 'rgba(212, 175, 122, 0.35)'); // Champagne
    grad2.addColorStop(1, 'rgba(251, 244, 238, 0)');

    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    animId = requestAnimationFrame(render);
  }

  render();
}

/**
 * Infinite Marquee Band with Scroll Velocity Reaction
 */
function setupInfiniteMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  let x = 0;
  let speed = 0.85;
  let lastScrollY = window.scrollY;

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // React smoothly to scroll velocity
    speed = delta > 0 ? 2.5 : -2.5;
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  const loop = () => {
    // Normal return towards base speed
    speed += (0.85 - speed) * 0.04;
    x -= speed;

    const trackWidth = track.scrollWidth / 3;
    if (x <= -trackWidth) x = 0;
    if (x > 0) x = -trackWidth;

    track.style.transform = `translate3d(${x}px, 0, 0)`;
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}
