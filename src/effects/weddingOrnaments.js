/**
 * =============================================================================
 * WEDDING ORNAMENTS & CEREMONIAL FLOURISHES
 * Chữ Hỷ (囍), Cặp Thiên Nga Trái Tim, Nhẫn Cưới, Dây Đèn LED, Cánh Hoa Rơi
 * =============================================================================
 */

import { isReducedMotion } from '../utils/motion.js';

/**
 * Returns crisp SVG for Double Happiness Chữ Hỷ (囍)
 */
export function getXiSvg(size = 48, color = 'currentColor') {
  return `
    <svg class="xi-icon-svg" viewBox="0 0 100 100" width="${size}" height="${size}" fill="${color}" xmlns="http://www.w3.org/2000/svg" aria-label="Chữ Hỷ">
      <defs>
        <linearGradient id="xiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F0C75E"/>
          <stop offset="50%" stop-color="#FFE8A3"/>
          <stop offset="100%" stop-color="#D4AF7A"/>
        </linearGradient>
      </defs>
      <text x="50%" y="60%" dominant-baseline="central" text-anchor="middle" 
            font-size="82" font-family="'Cormorant Garamond', 'SimSun', serif" 
            font-weight="900" fill="url(#xiGoldGrad)" letter-spacing="0">囍</text>
    </svg>
  `;
}

/**
 * Returns pair of white & gold swans forming a heart with their curved necks
 */
export function getSwansHeartSvg({ isWhite = false } = {}) {
  const imgSrc = isWhite ? '/photos/swans-pair-white.png' : '/photos/swans-pair.png';
  return `
    <svg class="swans-heart-vector ${isWhite ? 'is-white-swan' : ''}" viewBox="0 0 1006 495" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-label="Cặp thiên nga tạo hình trái tim">
      <image href="${imgSrc}" xlink:href="${imgSrc}" x="0" y="0" width="1006" height="495" preserveAspectRatio="xMidYMid meet" />
    </svg>
  `;
}

/**
 * Returns interlocking gold wedding rings with diamond sparkle
 */
export function getWeddingRingsSvg() {
  return `
    <svg class="wedding-rings-svg" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg" aria-label="Cặp nhẫn cưới vàng">
      <defs>
        <linearGradient id="ringGold1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE599"/>
          <stop offset="40%" stop-color="#F0C75E"/>
          <stop offset="80%" stop-color="#D4AF7A"/>
          <stop offset="100%" stop-color="#A67C43"/>
        </linearGradient>
        <linearGradient id="ringGold2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F0C75E"/>
          <stop offset="50%" stop-color="#FFF3C4"/>
          <stop offset="100%" stop-color="#C98B8B"/>
        </linearGradient>
      </defs>

      <!-- Left Ring (Groom's classic band) -->
      <ellipse cx="40" cy="40" rx="22" ry="17" fill="none" stroke="url(#ringGold1)" stroke-width="5" 
               transform="rotate(-15 40 40)"/>

      <!-- Right Ring (Bride's diamond ring, interlocking) -->
      <ellipse cx="60" cy="38" rx="20" ry="16" fill="none" stroke="url(#ringGold2)" stroke-width="4.5"
               transform="rotate(18 60 38)"/>

      <!-- Diamond Gemstone on Right Ring -->
      <g transform="translate(68, 17)">
        <polygon points="0,5 -6,0 0,-7 6,0" fill="#FFFFFF" stroke="#F0C75E" stroke-width="1"/>
        <polygon points="0,5 -3,0 0,-7 3,0" fill="#E8F4FD" opacity="0.8"/>
      </g>
    </svg>
  `;
}

/**
 * Generates delicate hanging string lights garland
 */
export function getStringLightsHtml() {
  const points = [
    { x: 3, y: 14 },
    { x: 12, y: 26 },
    { x: 22, y: 16 },
    { x: 32, y: 30 },
    { x: 42, y: 18 },
    { x: 50, y: 32 },
    { x: 58, y: 18 },
    { x: 68, y: 30 },
    { x: 78, y: 16 },
    { x: 88, y: 26 },
    { x: 97, y: 14 },
  ];

  const bulbs = points.map((p, idx) => `
    <g class="string-bulb" transform="translate(${p.x * 10}, ${p.y})">
      <line x1="0" y1="-8" x2="0" y2="0" stroke="rgba(212, 175, 122, 0.6)" stroke-width="1"/>
      <circle cx="0" cy="2" r="2.5" fill="#5A4A32"/>
      <circle cx="0" cy="7" r="5" class="string-bulb-glow"/>
      <circle cx="-1" cy="5.5" r="1.5" fill="#FFFFFF" opacity="0.9"/>
    </g>
  `).join('');

  return `
    <div class="string-lights-garland" aria-hidden="true">
      <svg viewBox="0 0 1000 54" width="100%" height="54" preserveAspectRatio="none">
        <path d="M 0 10 Q 250 48 500 12 Q 750 48 1000 10" class="string-wire"/>
        ${bulbs}
      </svg>
    </div>
  `;
}

/**
 * Generates festive hanging lanterns row
 */
export function getLanternsHtml() {
  return `
    <div class="wedding-lanterns-row" aria-hidden="true">
      <div class="wedding-lantern">
        <div class="lantern-cord"></div>
        <div class="lantern-body"><span class="lantern-xi">囍</span></div>
        <div class="lantern-tassel"></div>
      </div>
      <div class="wedding-lantern">
        <div class="lantern-cord" style="height: 48px;"></div>
        <div class="lantern-body"><span class="lantern-xi">囍</span></div>
        <div class="lantern-tassel"></div>
      </div>
      <div class="wedding-lantern">
        <div class="lantern-cord"></div>
        <div class="lantern-body"><span class="lantern-xi">囍</span></div>
        <div class="lantern-tassel"></div>
      </div>
    </div>
  `;
}

/**
 * Creates rich ceremonial section dividers
 */
export function createSectionDivider({ type = 'swans', title = 'Trăm năm hảo hợp', isDark = false } = {}) {
  const divider = document.createElement('div');

  if (type === 'swans') {
    divider.className = 'swans-heart-divider';
    divider.innerHTML = `
      <div class="divider-row">
        <div class="divider-line-left"></div>
        <div class="swans-svg-wrap">
          ${getSwansHeartSvg()}
        </div>
        <div class="divider-line-right"></div>
      </div>
      <div class="swans-tag">${title}</div>
    `;
  } else if (type === 'xi') {
    divider.className = 'ceremony-divider';
    divider.innerHTML = `
      <div class="ceremony-divider-line"></div>
      <div class="ceremony-divider-center ${isDark ? 'dark-theme' : ''}">
        <span class="ceremony-divider-xi">囍</span>
        <span class="ceremony-divider-text">${title}</span>
      </div>
      <div class="ceremony-divider-line"></div>
    `;
  } else if (type === 'rings') {
    divider.className = 'ceremony-divider';
    divider.innerHTML = `
      <div class="ceremony-divider-line"></div>
      <div class="ceremony-divider-center ${isDark ? 'dark-theme' : ''}">
        <span style="display:inline-flex; width: 32px; height: 22px;">${getWeddingRingsSvg()}</span>
        <span class="ceremony-divider-text">${title}</span>
      </div>
      <div class="ceremony-divider-line"></div>
    `;
  } else {
    divider.className = 'ceremony-divider';
    divider.innerHTML = `
      <div class="ceremony-divider-line"></div>
      <div class="ceremony-divider-center ${isDark ? 'dark-theme' : ''}">
        <span style="color: var(--gold-bright);">✦</span>
        <span class="ceremony-divider-text">${title}</span>
        <span style="color: var(--gold-bright);">✦</span>
      </div>
      <div class="ceremony-divider-line"></div>
    `;
  }

  return divider;
}

/**
 * Falling Rose Petals Shower (Continuous lightweight CSS animation)
 */
export function initFallingPetals() {
  if (isReducedMotion()) return null;

  // Check if already created
  let container = document.getElementById('petals-shower-container');
  if (container) return container;

  container = document.createElement('div');
  container.id = 'petals-shower-container';
  container.className = 'petals-shower-container';
  container.setAttribute('aria-hidden', 'true');

  const petalCount = 18;
  const types = ['petal-blush', 'petal-crimson', 'petal-white'];

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    const type = types[i % types.length];
    petal.className = `shower-petal ${type}`;

    const size = Math.floor(14 + Math.random() * 18);
    const left = (Math.random() * 98).toFixed(1);
    const duration = (8 + Math.random() * 7).toFixed(1);
    const delay = (Math.random() * 12).toFixed(1);
    const drift = (Math.random() * 120 - 60).toFixed(0);
    const rot = (Math.random() * 720 - 360).toFixed(0);

    petal.style.width = `${size}px`;
    petal.style.height = `${Math.round(size * 1.35)}px`;
    petal.style.left = `${left}%`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.setProperty('--drift', `${drift}px`);
    petal.style.setProperty('--rot', `${rot}deg`);

    container.appendChild(petal);
  }

  document.body.appendChild(container);
  return container;
}

/**
 * Spawns a floating golden/ruby heart at coordinate (x, y)
 */
export function spawnHeartAt(x, y) {
  if (isReducedMotion()) return;
  const heart = document.createElement('div');
  heart.className = 'floating-heart-particle';
  const symbols = ['❤️', '💖', '💍', '✨', '囍'];
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty('--x-shift', `${(Math.random() * 60 - 30).toFixed(0)}px`);
  heart.style.setProperty('--rot-shift', `${(Math.random() * 50 - 25).toFixed(0)}deg`);

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 2800);
}
