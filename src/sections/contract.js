import { sfx } from '../utils/sfx.js';
import { confettiPresets } from '../effects/confettiPresets.js';
import { audioManager } from '../utils/audio.js';
import { getSwansHeartSvg } from '../effects/weddingOrnaments.js';

export function initContractSection(config) {
  const container = document.getElementById('contract-section-mount');
  if (!container) return;

  const title = config.contract?.title || 'HỢP ĐỒNG HÔN NHÂN TRỌN ĐỜI';
  const subtitle = config.contract?.subtitle || 'SỐ HIỆU: 001/BLUSH-COUTURE/THÚYHIỀN-TRUNGKIÊN';
  const clauses = config.contract?.clauses || [];
  const signHint = config.contract?.signHint || 'Ký tên bằng ngón tay hoặc chuột vào khung tương ứng';
  const brideLabel = config.contract?.signLabels?.bride || 'BÊN A: THÚY HIỀN';
  const groomLabel = config.contract?.signLabels?.groom || 'BÊN B: TRUNG KIÊN';
  const stampText = config.contract?.stampText || 'CHỨNG NHẬN';
  const doneMsg = config.contract?.doneMessage || 'Hợp đồng đã được niêm phong bằng dấu sáp chính thức. Hiệu lực trọn đời, ngập tràn hạnh phúc!';
  const monogram = config.monogram || 'H & K';

  container.innerHTML = `
    <section class="contract-section" id="contract-section">
      <!-- Watermark Chữ Hỷ 囍 Nền Rượu Vang -->
      <div class="xi-watermark xi-contract" aria-hidden="true">囍</div>

      <div class="contract-container">
        <!-- Biểu tượng thiên nga uyên ương trên đầu hợp đồng (màu trắng nổi bật trên nền vang) -->
        <div class="contract-swans-crest" aria-hidden="true">
          ${getSwansHeartSvg({ isWhite: true })}
        </div>

        <header class="contract-header-editorial">
          <span class="contract-kicker">💍 GIAO ƯỚC TRĂM NĂM • HỢP ĐỒNG HÔN NHÂN</span>
          <h2 class="contract-main-title">Bản Giao Ước Tình Yêu Vĩnh Cửu</h2>
          <p class="contract-subtitle-text">Nghi thức ký kết trang trọng với chữ ký tươi và dấu sáp niêm phong vĩnh cửu</p>
        </header>

        <!-- Artisanal Parchment Document -->
        <article class="contract-parchment" id="contract-parchment">
          <!-- Chữ Hỷ Nền Hợp Đồng -->
          <div class="contract-inner-xi" aria-hidden="true">囍</div>

          <div class="contract-doc-header">
            <div class="contract-embossed-monogram">${monogram}</div>
            <h3 class="contract-doc-title">${title}</h3>
            <p class="contract-doc-subtitle">${subtitle}</p>
          </div>

          <div class="contract-clauses-box" id="contract-clauses-box">
            ${clauses
              .map(
                (clause, idx) => `
              <div class="contract-clause-line" id="clause-item-${idx}">
                <span class="clause-bullet">✦</span>
                <span class="clause-text">${clause}</span>
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Dual Signature Pads -->
          <div class="contract-signatures-area">
            <p class="contract-signing-status" id="contract-signing-status" style="font-size: 0.82rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--champagne); text-align: center; margin-bottom: 2rem; font-weight: 600; transition: all 0.3s ease;">
              ✍️ ${signHint}
            </p>

            <div class="signature-pads-grid">
              <!-- Bride Signature Pad -->
              <div class="signature-card">
                <span class="signature-party-label">${brideLabel}</span>
                <div class="signature-canvas-box" data-cursor="sign">
                  <canvas class="signature-canvas" id="bride-sig-canvas"></canvas>
                  <div class="signature-watermark" id="bride-sig-watermark">Ký tại đây...</div>
                </div>
                <button type="button" class="signature-clear-btn" id="bride-sig-clear">Xóa ký lại</button>
              </div>

              <!-- Groom Signature Pad -->
              <div class="signature-card">
                <span class="signature-party-label">${groomLabel}</span>
                <div class="signature-canvas-box" data-cursor="sign">
                  <canvas class="signature-canvas" id="groom-sig-canvas"></canvas>
                  <div class="signature-watermark" id="groom-sig-watermark">Ký tại đây...</div>
                </div>
                <button type="button" class="signature-clear-btn" id="groom-sig-clear">Xóa ký lại</button>
              </div>
            </div>
          </div>

          <!-- 3D Wax Seal Stamp Container (Properly Flowed Above Done Actions) -->
          <div class="contract-wax-seal-wrapper">
            <div class="contract-wax-seal" id="contract-wax-seal" aria-hidden="true">
              <span class="wax-seal-text-title">${stampText}</span>
              <span class="wax-seal-text-monogram">${monogram}</span>
            </div>
            <button type="button" class="btn-pill" id="contract-manual-seal-btn" style="display: none; margin-top: 1rem;">
              <span>💍</span>
              <span>Đóng dấu niêm phong ngay</span>
            </button>
          </div>

          <!-- Done State Message -->
          <div class="contract-done-box" id="contract-done-box" style="display: none;">
            <p class="contract-done-message">${doneMsg}</p>
          </div>
        </article>
      </div>
    </section>
  `;

  // Setup High-End Quadratic Signature Pads
  const bridePad = setupFountainPenPad('bride-sig-canvas', 'bride-sig-watermark', 'bride-sig-clear', updateSealStatus);
  const groomPad = setupFountainPenPad('groom-sig-canvas', 'groom-sig-watermark', 'groom-sig-clear', updateSealStatus);

  let isSealed = false;
  const waxSeal = document.getElementById('contract-wax-seal');
  const doneBox = document.getElementById('contract-done-box');
  const downloadBtn = document.getElementById('contract-download-btn');
  const resignBtn = document.getElementById('contract-resign-btn');
  const manualSealBtn = document.getElementById('contract-manual-seal-btn');
  const statusEl = document.getElementById('contract-signing-status');
  const parchment = document.getElementById('contract-parchment');

  function updateSealStatus() {
    if (isSealed) return;
    const hasBride = bridePad.hasSignature();
    const hasGroom = groomPad.hasSignature();

    if (hasBride && hasGroom) {
      if (statusEl) {
        statusEl.innerHTML = '✨ Cả hai bên đã hoàn tất chữ ký! Đang niêm phong...';
        statusEl.style.color = '#B01E3A';
      }
      if (manualSealBtn) manualSealBtn.style.display = 'none';
      setTimeout(() => {
        if (!isSealed) triggerWaxSealPress();
      }, 350);
    } else if (hasBride) {
      if (statusEl) {
        statusEl.innerHTML = '✍️ Bên A (Cô dâu) đã ký • Mời Bên B (Chú rể) ký tiếp...';
        statusEl.style.color = '#B01E3A';
      }
      if (manualSealBtn) {
        manualSealBtn.style.display = 'inline-flex';
        manualSealBtn.querySelector('span:last-child').textContent = 'Đóng dấu niêm phong ngay';
      }
    } else if (hasGroom) {
      if (statusEl) {
        statusEl.innerHTML = '✍️ Bên B (Chú rể) đã ký • Mời Bên A (Cô dâu) ký tiếp...';
        statusEl.style.color = '#B01E3A';
      }
      if (manualSealBtn) {
        manualSealBtn.style.display = 'inline-flex';
        manualSealBtn.querySelector('span:last-child').textContent = 'Đóng dấu niêm phong ngay';
      }
    } else {
      if (statusEl) {
        statusEl.innerHTML = `✍️ ${signHint}`;
        statusEl.style.color = 'var(--champagne)';
      }
      if (manualSealBtn) manualSealBtn.style.display = 'none';
    }
  }

  // Manual seal button click handler
  manualSealBtn?.addEventListener('click', () => {
    if (!isSealed) triggerWaxSealPress();
  });

  function triggerWaxSealPress() {
    if (isSealed) return;
    isSealed = true;
    if (manualSealBtn) manualSealBtn.style.display = 'none';
    if (statusEl) {
      statusEl.innerHTML = '💍 HỢP ĐỒNG ĐÃ ĐƯỢC NIÊM PHONG VĨNH VIỄN';
      statusEl.style.color = '#B01E3A';
    }

    // Wax stamp thud SFX
    sfx.waxPressThud();

    // Brief screen shake
    parchment?.classList.add('screen-shake');
    setTimeout(() => parchment?.classList.remove('screen-shake'), 450);

    // Mobile haptic vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate([40, 80, 50]);
    }

    // Seal press animation
    waxSeal?.classList.add('is-pressed');

    // Dual-side gold celebration confetti
    confettiPresets.weddingCelebration();
    confettiPresets.giftBurst(0.2, 0.6);
    confettiPresets.giftBurst(0.8, 0.6);

    // Fade in completion box
    setTimeout(() => {
      if (doneBox) {
        doneBox.style.display = 'block';
        sfx.sparkleShimmer();
      }
    }, 700);
  }

  // Re-sign button
  resignBtn?.addEventListener('click', () => {
    isSealed = false;
    bridePad.clear();
    groomPad.clear();
    waxSeal?.classList.remove('is-pressed');
    if (doneBox) doneBox.style.display = 'none';
    updateSealStatus();
    audioManager.showToast('Bạn có thể ký lại hợp đồng');
  });

  // Export Signed Contract as PNG Keepsake
  downloadBtn?.addEventListener('click', () => {
    exportContractPng(config, bridePad.getCanvas(), groomPad.getCanvas(), () => {
      audioManager.showToast('Đã lưu hợp đồng hôn nhân thành công! ✨');
    });
  });
}

/**
 * Fountain Pen Signature Canvas with Smooth Quadratic Curves & Velocity Dynamics
 */
function setupFountainPenPad(canvasId, watermarkId, clearBtnId, onUpdateCallback) {
  const canvas = document.getElementById(canvasId);
  const watermark = document.getElementById(watermarkId);
  const clearBtn = document.getElementById(clearBtnId);
  if (!canvas) return { hasSignature: () => false, clear: () => {}, onStrokeEnd: () => {}, getCanvas: () => null };

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  let isDrawing = false;
  let points = [];
  let strokesCount = 0;
  let totalDrawnPoints = 0;
  const strokeEndCallbacks = [];

  const getPos = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      time: performance.now(),
    };
  };

  const onPointerDown = (e) => {
    isDrawing = true;
    points = [getPos(e)];
    totalDrawnPoints++;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {}
    if (watermark) watermark.style.opacity = '0';
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;
    const current = getPos(e);
    points.push(current);
    totalDrawnPoints++;

    if (points.length < 3) return;

    // Smooth quadratic curve through midpoints
    const p0 = points[points.length - 3];
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];

    const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
    const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    // Velocity-based pen thickness
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const dt = Math.max(1, p2.time - p1.time);
    const speed = dist / dt;
    const lineWidth = Math.max(1.4, Math.min(3.2, 3.2 - speed * 0.45));

    ctx.strokeStyle = '#8B263E'; // Deep rose ink
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(mid1.x, mid1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
    ctx.stroke();
  };

  const onPointerUp = (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    strokesCount++;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}

    strokeEndCallbacks.forEach((cb) => cb());
    if (onUpdateCallback) onUpdateCallback();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    strokesCount = 0;
    totalDrawnPoints = 0;
    points = [];
    if (watermark) watermark.style.opacity = '0.35';
    if (onUpdateCallback) onUpdateCallback();
  };

  clearBtn?.addEventListener('click', clear);

  return {
    hasSignature: () => strokesCount >= 1 && totalDrawnPoints >= 4,
    clear,
    onStrokeEnd: (cb) => strokeEndCallbacks.push(cb),
    getCanvas: () => canvas,
  };
}

/**
 * Offscreen Canvas PNG Keepsake Generator
 */
function exportContractPng(config, brideCanvas, groomCanvas, onSuccess) {
  try {
    const exportWidth = 1200;
    const exportHeight = 1600;
    const canvas = document.createElement('canvas');
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext('2d');

    // Parchment Ivory Background
    ctx.fillStyle = '#FFFDFB';
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // Double Gold Hairline Border
    ctx.strokeStyle = '#D4AF7A';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, exportWidth - 60, exportHeight - 60);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, exportWidth - 84, exportHeight - 84);

    // Monogram & Title
    ctx.fillStyle = '#D4AF7A';
    ctx.font = "italic 44px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = 'center';
    ctx.fillText(config.monogram || 'H & K', exportWidth / 2, 130);

    ctx.fillStyle = '#2B1A1E';
    ctx.font = "600 42px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText(config.contract?.title || 'HỢP ĐỒNG HÔN NHÂN TRỌN ĐỜI', exportWidth / 2, 195);

    ctx.font = "500 20px 'Be Vietnam Pro', sans-serif";
    ctx.fillStyle = 'rgba(43, 26, 30, 0.65)';
    ctx.fillText(config.contract?.subtitle || 'SỐ HIỆU: 001/BLUSH-COUTURE', exportWidth / 2, 235);

    // Divider
    ctx.strokeStyle = 'rgba(212, 175, 122, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 265);
    ctx.lineTo(exportWidth - 120, 265);
    ctx.stroke();

    // Clauses
    ctx.font = "28px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = '#2B1A1E';
    ctx.textAlign = 'left';
    let y = 340;
    (config.contract?.clauses || []).forEach((c) => {
      ctx.fillText(`✦  ${c}`, 120, y);
      y += 65;
    });

    // Signature Area
    const sigY = 960;
    ctx.strokeStyle = 'rgba(212, 175, 122, 0.4)';
    ctx.beginPath();
    ctx.moveTo(120, sigY - 40);
    ctx.lineTo(exportWidth - 120, sigY - 40);
    ctx.stroke();

    ctx.font = "600 22px 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(config.contract?.signLabels?.bride || 'BÊN A: THÚY HIỀN', 360, sigY);
    ctx.fillText(config.contract?.signLabels?.groom || 'BÊN B: TRUNG KIÊN', exportWidth - 360, sigY);

    if (brideCanvas) {
      ctx.drawImage(brideCanvas, 180, sigY + 20, 360, 160);
    }
    if (groomCanvas) {
      ctx.drawImage(groomCanvas, exportWidth - 540, sigY + 20, 360, 160);
    }

    // Wax Seal Stamp in Center Bottom
    const sealCx = exportWidth / 2;
    const sealCy = 1350;
    ctx.fillStyle = '#8B263E';
    ctx.beginPath();
    ctx.arc(sealCx, sealCy, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#D4AF7A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(sealCx, sealCy, 68, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#F4E8D1';
    ctx.font = "italic bold 48px 'Cormorant Garamond', serif";
    ctx.textAlign = 'center';
    ctx.fillText(config.monogram || 'H & K', sealCx, sealCy + 15);

    // Download trigger
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Hop-dong-hon-nhan-Thuy-Hien-Trung-Kien.png`;
      a.click();
      URL.revokeObjectURL(url);
      if (onSuccess) onSuccess();
    }, 'image/png');
  } catch (err) {
    console.warn('Export contract PNG failed:', err);
    audioManager.showToast('Không thể tạo ảnh, vui lòng thử lại');
  }
}
