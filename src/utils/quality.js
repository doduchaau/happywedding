/**
 * Quality Tier Manager
 * Determines "high" | "medium" | "low" tier based on hardware, screen,
 * a loading-time FPS probe, and dynamic fallback monitoring.
 */

import { isReducedMotion } from './motion.js';

class QualityManager {
  constructor() {
    this.tier = 'high';
    this.forcedLow = false;
    this.listeners = new Set();
    this.lowFpsDuration = 0;
    this.lastFrameTime = performance.now();
    this.fpsMonitoring = false;
    this.initialHardwareAssessment();
  }

  initialHardwareAssessment() {
    if (isReducedMotion()) {
      this.tier = 'low';
      return;
    }

    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const isMobile = window.innerWidth < 768;
    const dpr = window.devicePixelRatio || 1;

    let score = 0;
    if (cores >= 8) score += 3;
    else if (cores >= 4) score += 2;
    else score += 1;

    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;

    if (isMobile) score -= 1;
    if (dpr > 2.5) score -= 0.5;

    if (score >= 4.5) this.tier = 'high';
    else if (score >= 3) this.tier = 'medium';
    else this.tier = 'low';
  }

  /**
   * Run a quick ~600ms FPS probe during loading
   */
  async runFpsProbe() {
    if (this.tier === 'low') return this.tier;

    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      let lastTime = startTime;

      const step = (now) => {
        frames++;
        if (now - startTime >= 600) {
          const elapsed = (now - startTime) / 1000;
          const fps = frames / elapsed;

          if (fps < 38) {
            this.setTier('low');
          } else if (fps < 52 && this.tier === 'high') {
            this.setTier('medium');
          }
          resolve(this.tier);
        } else {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    });
  }

  /**
   * Start background FPS monitoring to drop tier if FPS stays < 40 for 2s
   */
  startFpsMonitor() {
    if (this.fpsMonitoring) return;
    this.fpsMonitoring = true;
    let frames = 0;
    let secondStart = performance.now();

    const monitor = (now) => {
      if (!this.fpsMonitoring) return;
      frames++;
      if (now - secondStart >= 1000) {
        const fps = frames / ((now - secondStart) / 1000);
        frames = 0;
        secondStart = now;

        if (fps < 40 && !document.hidden) {
          this.lowFpsDuration += 1;
          if (this.lowFpsDuration >= 2) {
            // Drop one tier
            if (this.tier === 'high') this.setTier('medium');
            else if (this.tier === 'medium') this.setTier('low');
            this.lowFpsDuration = 0;
          }
        } else {
          this.lowFpsDuration = 0;
        }
      }
      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }

  stopFpsMonitor() {
    this.fpsMonitoring = false;
  }

  getTier() {
    if (this.forcedLow || isReducedMotion()) return 'low';
    return this.tier;
  }

  setTier(newTier) {
    if (this.tier !== newTier) {
      this.tier = newTier;
      this.notifyListeners();
    }
  }

  toggleReduceEffects() {
    this.forcedLow = !this.forcedLow;
    this.notifyListeners();
    return this.forcedLow;
  }

  isEffectsReduced() {
    return this.forcedLow || isReducedMotion();
  }

  onTierChange(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notifyListeners() {
    const current = this.getTier();
    for (const cb of this.listeners) {
      cb(current);
    }
  }

  // Helper caps for heavy sections
  getLimits() {
    const tier = this.getTier();
    return {
      particleTextCount: tier === 'high' ? 7000 : tier === 'medium' ? 3500 : 1400,
      physicsBodiesCount: tier === 'high' ? 60 : tier === 'medium' ? 40 : 25,
      fireworksCount: tier === 'high' ? 8 : tier === 'medium' ? 5 : 3,
      useWebGLIntro: tier !== 'low',
    };
  }
}

export const qualityManager = new QualityManager();
