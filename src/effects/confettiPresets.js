import confetti from 'canvas-confetti';
import { isReducedMotion } from '../utils/motion.js';

// Pastel palette tailored to the wedding theme
const PASTEL_COLORS = ['#FFDDE0', '#FFB8B8', '#F28B9B', '#FF758F', '#FFE5EC', '#FED9B7'];

export const confettiPresets = {
  /**
   * Burst when the gift box lid pops open
   */
  giftBurst(originX = 0.5, originY = 0.5) {
    if (isReducedMotion()) return;

    confetti({
      particleCount: 75,
      spread: 80,
      startVelocity: 45,
      origin: { x: originX, y: originY },
      colors: PASTEL_COLORS,
      disableForReducedMotion: true,
    });

    // Heart shapes
    confetti({
      particleCount: 25,
      spread: 90,
      startVelocity: 35,
      origin: { x: originX, y: originY },
      shapes: ['circle'],
      colors: ['#F28B9B', '#FF758F', '#FFCAD4'],
      scalar: 1.2,
      disableForReducedMotion: true,
    });
  },

  /**
   * Grand celebration for wedding day reached
   */
  weddingCelebration() {
    if (isReducedMotion()) return;

    const end = Date.now() + 3000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: PASTEL_COLORS,
        disableForReducedMotion: true,
      });
    }, 250);
  },

  /**
   * Small sparkle for card flips & micro-interactions
   */
  miniSparkle(originX = 0.5, originY = 0.5) {
    if (isReducedMotion()) return;

    confetti({
      particleCount: 25,
      spread: 50,
      startVelocity: 20,
      origin: { x: originX, y: originY },
      colors: PASTEL_COLORS,
      scalar: 0.8,
      disableForReducedMotion: true,
    });
  },

  /**
   * Confetti burst when a balloon pops, matching balloon color
   */
  balloonPop(originX, originY, color = '#F28B9B') {
    if (isReducedMotion()) return;

    confetti({
      particleCount: 30,
      spread: 60,
      startVelocity: 25,
      origin: { x: originX, y: originY },
      colors: [color, '#FFFFFF', '#FFF0F3'],
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  },

  /**
   * Alternating presets for outro congratulations button
   */
  outroIndex: 0,
  triggerOutroBurst(btnElement) {
    if (isReducedMotion()) return;

    let originX = 0.5;
    let originY = 0.7;

    if (btnElement) {
      const rect = btnElement.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }

    const presetIdx = this.outroIndex % 3;
    this.outroIndex++;

    if (presetIdx === 0) {
      // Cannon burst
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { x: originX, y: originY },
        colors: PASTEL_COLORS,
        startVelocity: 45,
      });
    } else if (presetIdx === 1) {
      // Dual side fireworks
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.8 },
        colors: PASTEL_COLORS,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.8 },
        colors: PASTEL_COLORS,
      });
    } else {
      // Gentle rainfall
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.5, y: 0.2 },
        colors: PASTEL_COLORS,
        gravity: 0.8,
        scalar: 1.1,
      });
    }
  },
};
