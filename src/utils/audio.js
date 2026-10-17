/**
 * Audio manager with graceful fallbacks, volume fading,
 * localStorage persistence, and tab visibility handling.
 */

class AudioManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.targetVolume = 0.5;
    this.isMuted = false;
    this.fadeInterval = null;
    this.wasPlayingBeforeHidden = false;
    this.hasNotifiedMissing = false;
    this.listeners = new Set();
  }

  init(config = {}) {
    const src = config.src || './music/nhac.mp3';
    this.targetVolume = typeof config.volume === 'number' ? config.volume : 0.5;
    const loop = config.loop !== false;

    // Read stored user preference if any
    const storedPref = localStorage.getItem('wedding_music_enabled');
    if (storedPref !== null) {
      this.isMuted = storedPref === 'false';
    }

    try {
      this.audio = new Audio();
      this.audio.src = src;
      this.audio.loop = loop;
      this.audio.preload = 'auto';
      this.audio.volume = this.isMuted ? 0 : this.targetVolume;

      this.audio.addEventListener('error', (e) => {
        // Handle missing file or network error without throwing
        if (!this.hasNotifiedMissing) {
          this.hasNotifiedMissing = true;
          this.showToast('Chưa có nhạc, nhưng quà vẫn đáng yêu mà!');
        }
        this.isPlaying = false;
        this.notifyState();
      });

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notifyState();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyState();
      });
    } catch (err) {
      console.warn('Audio initialization warning:', err);
    }

    // Tab visibility handling: pause when hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.isPlaying) {
          this.wasPlayingBeforeHidden = true;
          this.audio?.pause();
        }
      } else {
        if (this.wasPlayingBeforeHidden && !this.isMuted) {
          this.wasPlayingBeforeHidden = false;
          this.play().catch(() => {});
        }
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback({ isPlaying: this.isPlaying, isMuted: this.isMuted });
    return () => this.listeners.delete(callback);
  }

  notifyState() {
    for (const cb of this.listeners) {
      cb({ isPlaying: this.isPlaying, isMuted: this.isMuted });
    }
  }

  async play() {
    if (!this.audio || this.isMuted) return;
    try {
      this.fadeVolume(this.targetVolume, 800);
      await this.audio.play();
      this.isPlaying = true;
      this.notifyState();
    } catch (err) {
      // Autoplay or missing file fallback
      if (!this.hasNotifiedMissing && (err.name === 'NotSupportedError' || err.name === 'NotFoundError')) {
        this.hasNotifiedMissing = true;
        this.showToast('Chưa có nhạc, nhưng quà vẫn đáng yêu mà!');
      }
      this.isPlaying = false;
      this.notifyState();
    }
  }

  pause() {
    if (!this.audio) return;
    this.fadeVolume(0, 400, () => {
      this.audio.pause();
      this.isPlaying = false;
      this.notifyState();
    });
  }

  toggle() {
    if (this.isPlaying && !this.isMuted) {
      this.isMuted = true;
      localStorage.setItem('wedding_music_enabled', 'false');
      this.pause();
    } else {
      this.isMuted = false;
      localStorage.setItem('wedding_music_enabled', 'true');
      this.play();
    }
  }

  fadeVolume(toVol, durationMs = 600, onComplete) {
    if (!this.audio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVol = this.audio.volume;
    const startTime = performance.now();

    this.fadeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      this.audio.volume = Math.max(0, Math.min(1, startVol + (toVol - startVol) * progress));

      if (progress >= 1) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (onComplete) onComplete();
      }
    }, 25);
  }

  showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span class="toast-icon">🎵</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

export const audioManager = new AudioManager();
