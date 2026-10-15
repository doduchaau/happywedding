import { sfx } from '../utils/sfx.js';
import { confettiPresets } from '../effects/confettiPresets.js';

export function initScratchCardsSection(config) {
  const container = document.getElementById('scratch-cards-section-mount');
  if (!container) return;

  const title = config.scratch?.title || 'Khai mở khoảnh khắc dát vàng';
  const subtitle = config.scratch?.subtitle || 'Dùng ngón tay hoặc chuột cào nhẹ lớp nhũ vàng champagne để mở từng ký ức';
  const items = config.scratch?.items || [];
  const finale = config.scratch?.finale || null;

  container.innerHTML = `
    <section class="scratch-section" id="scratch-section">
      <!-- Watermark Chữ Hỷ 囍 -->
      <div class="xi-watermark xi-hero" style="top: 35%; opacity: 0.045;" aria-hidden="true">囍</div>

      <div class="scratch-container">
        <header class="scratch-header">
          <span class="scratch-kicker">✨ KHAI MỞ KÝ ỨC • DÁT VÀNG KỶ NIỆM</span>
          <h2 class="scratch-title">${title}</h2>
          <p class="scratch-subtitle">${subtitle}</p>
        </header>

        <div class="scratch-grid" id="scratch-grid">
          ${items
            .map(
              (item, idx) => `
            <div class="scratch-card-item" id="scratch-card-${idx}" data-index="${idx}">
              <div class="scratch-media-box">
                <img 
                  src="${item.photo}" 
                  alt="${item.caption}" 
                  class="scratch-underlying-photo"
                  loading="lazy"
                />
                <canvas class="scratch-foil-canvas" id="foil-canvas-${idx}" data-cursor="scratch"></canvas>
              </div>
              <p class="scratch-caption">${item.caption}</p>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="scratch-progress-box">
          <div class="scratch-progress-pill" id="scratch-progress">
            <span>✨</span>
            <span id="scratch-progress-text">Đã mở: 0 / ${items.length} khoảnh khắc</span>
          </div>
        </div>

        <!-- Finale Surprise Card (Moving Script Font) -->
        <div class="scratch-finale-box" id="scratch-finale-box" style="display: none;">
          <span class="scratch-finale-kicker">LỜI NHẮN TẬN ĐÁY LÒNG DÀNH CHO HAI BẠN</span>
          ${
            finale?.photo
              ? `<img src="${finale.photo}" alt="Finale Keepsake" class="scratch-finale-photo" />`
              : ''
          }
          <p class="scratch-finale-msg">${finale?.message || ''}</p>
        </div>
      </div>
    </section>
  `;

  let revealedCount = 0;
  const progressText = document.getElementById('scratch-progress-text');
  const finaleBox = document.getElementById('scratch-finale-box');

  items.forEach((item, idx) => {
    setupGoldFoilCard(idx, () => {
      revealedCount++;
      if (progressText) {
        progressText.textContent = `Đã mở: ${revealedCount} / ${items.length} khoảnh khắc`;
      }
      if (revealedCount === items.length && finale) {
        setTimeout(() => {
          if (finaleBox) finaleBox.style.display = 'block';
          confettiPresets.weddingCelebration();
          sfx.sparkleShimmer();
        }, 600);
      }
    });
  });
}

function setupGoldFoilCard(index, onRevealed) {
  const canvas = document.getElementById(`foil-canvas-${index}`);
  const card = document.getElementById(`scratch-card-${index}`);
  if (!canvas || !card) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let isScratching = false;
  let isCleared = false;
  let totalPixels = 0;
  let checkThrottle = 0;

  function paintFoil() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    totalPixels = rect.width * rect.height;

    // Shimmering Gold & Champagne Gradient Foil
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#D4AF7A');
    grad.addColorStop(0.35, '#F4E8D1');
    grad.addColorStop(0.65, '#E8B4B8');
    grad.addColorStop(1, '#C98B8B');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle metallic glitter noise
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * rect.width;
      const ry = Math.random() * rect.height;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Monogram watermark on foil
    ctx.fillStyle = 'rgba(58, 31, 38, 0.18)';
    ctx.font = "italic 28px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H & K', rect.width / 2, rect.height / 2);
  }

  paintFoil();

  // Scratching with soft feathered destination-out brush
  function scratchAt(x, y) {
    if (isCleared) return;

    ctx.globalCompositeOperation = 'destination-out';
    const radius = 24;

    const brushGrad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
    brushGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    brushGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.85)');
    brushGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = brushGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    checkThrottle++;
    if (checkThrottle % 14 === 0) {
      checkScratchedRatio();
    }
  }

  function checkScratchedRatio() {
    if (isCleared) return;
    try {
      const rect = canvas.getBoundingClientRect();
      const sampleW = Math.floor(rect.width * 0.4);
      const sampleH = Math.floor(rect.height * 0.4);
      const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
      const data = imgData.data;

      let transparentCount = 0;
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) transparentCount++;
      }

      const ratio = transparentCount / (data.length / 16);

      // Auto reveal threshold at ~55%
      if (ratio > 0.52) {
        isCleared = true;
        canvas.classList.add('is-revealed');
        sfx.sparkleShimmer();

        const cardRect = card.getBoundingClientRect();
        confettiPresets.miniSparkle(
          (cardRect.left + cardRect.width / 2) / window.innerWidth,
          (cardRect.top + cardRect.height / 2) / window.innerHeight
        );

        onRevealed();
      }
    } catch (_) {}
  }

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onPointerDown = (e) => {
    isScratching = true;
    canvas.setPointerCapture(e.pointerId);
    const pos = getPos(e);
    scratchAt(pos.x, pos.y);
  };

  const onPointerMove = (e) => {
    if (!isScratching) return;
    const pos = getPos(e);
    scratchAt(pos.x, pos.y);
  };

  const onPointerUp = (e) => {
    isScratching = false;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
}
