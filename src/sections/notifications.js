import { sfx } from '../utils/sfx.js';
import { isReducedMotion } from '../utils/motion.js';

export function startNotificationBanners(config) {
  const notifications = config.notifications || [];
  if (notifications.length === 0 || isReducedMotion()) return;

  let dock = document.getElementById('notifications-dock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'notifications-dock';
    dock.className = 'notifications-dock';
    document.body.appendChild(dock);
  }

  notifications.forEach((item, index) => {
    setTimeout(() => {
      spawnBanner(dock, item);
    }, 1500 + index * 3200);
  });
}

function spawnBanner(dock, item) {
  const banner = document.createElement('div');
  banner.className = 'notification-banner';
  banner.setAttribute('role', 'status');

  banner.innerHTML = `
    <div class="notif-header">
      <span class="notif-app-name">${item.app.toUpperCase()}</span>
      <span class="notif-time">vừa xong</span>
    </div>
    <div class="notif-text">${item.text}</div>
  `;

  dock.appendChild(banner);
  sfx.glassChime();

  // Tapping banner triggers elegant gold shimmer sweep and sound
  banner.addEventListener('click', () => {
    sfx.sparkleShimmer();
    banner.classList.remove('is-shimmering');
    void banner.offsetWidth; // Trigger reflow
    banner.classList.add('is-shimmering');
  });

  // Auto fade and clean up after 6s
  setTimeout(() => {
    banner.classList.add('fade-out');
    setTimeout(() => banner.remove(), 450);
  }, 6200);
}
