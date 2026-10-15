import { qualityManager } from '../utils/quality.js';
import { sfx } from '../utils/sfx.js';
import { randomFloat, randomInt } from '../utils/random.js';

export class ParticleTextMorpher {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isRunning = false;
    this.animId = null;

    // Pointer repel coordinates
    this.pointerX = -9999;
    this.pointerY = -9999;
    this.isPointerActive = false;

    // Sequence state
    this.step = 0;
    this.stepTimer = null;
    this.isSkipped = false;
    this.onCompleteCallback = null;

    this.resize();
    this.setupListeners();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  setupListeners() {
    const onMove = (e) => {
      this.pointerX = e.clientX || (e.touches && e.touches[0].clientX);
      this.pointerY = e.clientY || (e.touches && e.touches[0].clientY);
      this.isPointerActive = true;
    };
    const onEnd = () => {
      this.isPointerActive = false;
      this.pointerX = -9999;
      this.pointerY = -9999;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }

  /**
   * Sample pixels from text rendered to an offscreen canvas using Cormorant Garamond
   */
  sampleTextPoints(text, targetCount) {
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    const isMobile = this.width < 600;
    const fontSize = isMobile ? Math.min(80, this.width / 5.0) : Math.min(138, this.width / 7.0);

    off.width = this.width;
    off.height = this.height;

    offCtx.fillStyle = '#000000';
    offCtx.font = `italic 700 ${fontSize}px 'Cormorant Garamond', 'Playfair Display', Georgia, serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(text, this.width / 2, this.height / 2);

    const imgData = offCtx.getImageData(0, 0, this.width, this.height);
    const data = imgData.data;
    const points = [];

    // Sample step based on density
    const step = isMobile ? 3 : 4;
    for (let y = 0; y < this.height; y += step) {
      for (let x = 0; x < this.width; x += step) {
        const alpha = data[(y * this.width + x) * 4 + 3];
        if (alpha > 100) {
          points.push({ x, y });
        }
      }
    }

    if (points.length === 0) {
      for (let i = 0; i < targetCount; i++) {
        points.push({
          x: this.width / 2 + randomFloat(-150, 150),
          y: this.height / 2 + randomFloat(-50, 50),
        });
      }
    }

    return points;
  }

  /**
   * Sample points in the shape of a heart outline
   */
  sampleHeartPoints(targetCount) {
    const points = [];
    const scale = Math.min(this.width, this.height) * 0.016;
    const cx = this.width / 2;
    const cy = this.height / 2 - 10;

    for (let i = 0; i < targetCount; i++) {
      const t = (i / targetCount) * Math.PI * 2;
      // Parametric heart formula
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const r = Math.sqrt(Math.random());
      points.push({
        x: cx + hx * scale * (0.8 + 0.2 * r),
        y: cy + hy * scale * (0.8 + 0.2 * r),
      });
    }
    return points;
  }

  start(originX, originY, words, onComplete) {
    this.onCompleteCallback = onComplete;
    this.isRunning = true;
    this.isSkipped = false;

    const limits = qualityManager.getLimits();
    const count = limits.particleTextCount;
    this.count = count;

    // High performance TypedArrays
    this.posX = new Float32Array(count);
    this.posY = new Float32Array(count);
    this.velX = new Float32Array(count);
    this.velY = new Float32Array(count);
    this.targetX = new Float32Array(count);
    this.targetY = new Float32Array(count);
    this.colors = new Uint8Array(count); // Palette index
    this.sizes = new Float32Array(count);
    this.alphas = new Float32Array(count);

    // Luxurious Wedding Celebration Palette: Deep Wine Red (đỏ rượu vang), Royal Ruby (đỏ ruby hỷ sự), Velvet Crimson & Champagne Gold sparks
    this.colorPalette = [
      'rgba(139, 34, 62,',  // 0: Deep Wine Red (Đỏ rượu vang Bordeaux - quý phái)
      'rgba(176, 30, 58,',  // 1: Royal Wedding Ruby (Đỏ ruby hỷ sự truyền thống)
      'rgba(196, 40, 71,',  // 2: Velvet Crimson (Đỏ nhung rực rỡ nổi bật)
      'rgba(122, 22, 45,',  // 3: Deep Burgundy Wine (Đỏ vang đậm tạo chiều sâu)
      'rgba(218, 54, 84,',  // 4: Rose Ruby (Đỏ hồng ngọc tươi tắn)
      'rgba(212, 175, 122,', // 5: Champagne Gold (Điểm xuyết ánh vàng kim lấp lánh)
    ];

    // Initial radial explosion from wax seal point
    for (let i = 0; i < count; i++) {
      this.posX[i] = originX;
      this.posY[i] = originY;

      const angle = Math.random() * Math.PI * 2;
      const speed = randomFloat(4, 18);
      this.velX[i] = Math.cos(angle) * speed;
      this.velY[i] = Math.sin(angle) * speed;

      this.targetX[i] = originX + this.velX[i] * 12;
      this.targetY[i] = originY + this.velY[i] * 12;

      // 88% shades of wedding red/wine, 12% golden sparkle accents
      this.colors[i] = Math.random() < 0.12 ? 5 : randomInt(0, 4);
      this.sizes[i] = randomFloat(1.4, 3.2);
      this.alphas[i] = randomFloat(0.82, 0.98);
    }

    this.wordsSequence = [...words, '__HEART__'];
    this.currentWordIdx = 0;

    // Sequence schedule: Initial burst -> morph step 1
    setTimeout(() => {
      if (!this.isRunning || this.isSkipped) return;
      this.morphToWord(this.wordsSequence[0]);
    }, 700);

    this.loop();
  }

  morphToWord(word) {
    if (!this.isRunning || this.isSkipped) return;

    let points = [];
    if (word === '__HEART__') {
      points = this.sampleHeartPoints(this.count);
      sfx.sparkleShimmer();
    } else {
      points = this.sampleTextPoints(word, this.count);
      sfx.harpPluck();
    }

    const pLen = points.length;
    for (let i = 0; i < this.count; i++) {
      const pt = points[i % pLen];
      // Slight jitter for organic luxury gold dust feel
      this.targetX[i] = pt.x + randomFloat(-1.8, 1.8);
      this.targetY[i] = pt.y + randomFloat(-1.8, 1.8);
    }

    // Hold word for ~1.4s then advance
    this.stepTimer = setTimeout(() => {
      if (!this.isRunning || this.isSkipped) return;
      this.currentWordIdx++;

      if (this.currentWordIdx < this.wordsSequence.length) {
        this.morphToWord(this.wordsSequence[this.currentWordIdx]);
      } else {
        // Heart morph finished -> dissolve into hero
        this.dissolveAndFinish();
      }
    }, 1450);
  }

  dissolveAndFinish() {
    // Particles drift outwards and fade
    for (let i = 0; i < this.count; i++) {
      this.targetX[i] = this.posX[i] + randomFloat(-250, 250);
      this.targetY[i] = this.posY[i] + randomFloat(-200, 200);
    }

    setTimeout(() => {
      this.isRunning = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      this.ctx.clearRect(0, 0, this.width, this.height);
      if (this.onCompleteCallback) this.onCompleteCallback();
    }, 900);
  }

  skip() {
    this.isSkipped = true;
    this.isRunning = false;
    clearTimeout(this.stepTimer);
    if (this.animId) cancelAnimationFrame(this.animId);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  loop() {
    if (!this.isRunning) return;

    // Clear canvas so background stays clean and red particles pop with rich contrast
    this.ctx.clearRect(0, 0, this.width, this.height);

    const pX = this.pointerX;
    const pY = this.pointerY;
    const hasPointer = this.isPointerActive;
    const repelRadiusSq = 90 * 90;

    for (let i = 0; i < this.count; i++) {
      // Spring attraction to target position
      const dx = this.targetX[i] - this.posX[i];
      const dy = this.targetY[i] - this.posY[i];

      const springForce = 0.055;
      const friction = 0.88;

      this.velX[i] = (this.velX[i] + dx * springForce) * friction;
      this.velY[i] = (this.velY[i] + dy * springForce) * friction;

      // Pointer repel interaction
      if (hasPointer) {
        const pdx = this.posX[i] - pX;
        const pdy = this.posY[i] - pY;
        const distSq = pdx * pdx + pdy * pdy;

        if (distSq < repelRadiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 90) * 12;
          this.velX[i] += (pdx / dist) * force;
          this.velY[i] += (pdy / dist) * force;
        }
      }

      this.posX[i] += this.velX[i];
      this.posY[i] += this.velY[i];

      // Render glowing dot
      const size = this.sizes[i];
      const colorPrefix = this.colorPalette[this.colors[i]];
      const alpha = this.alphas[i];

      this.ctx.fillStyle = `${colorPrefix} ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(this.posX[i], this.posY[i], size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Reset composite operation
    this.ctx.globalCompositeOperation = 'source-over';

    this.animId = requestAnimationFrame(() => this.loop());
  }
}
