export function initVenueSection(config) {
  const container = document.getElementById('venue-section-mount');
  if (!container) return;

  if (!config.venue || config.venue.show !== true) {
    container.innerHTML = '';
    return;
  }

  const title = config.venue.title || 'Hẹn gặp hai bạn tại tiệc cưới';
  const name = config.venue.name || '[TÊN ĐỊA ĐIỂM TIỆC CƯỚI]';
  const address = config.venue.address || '[ĐỊA CHỈ TRANG TRỌNG]';
  const time = config.venue.time || '[GIỜ, NGÀY TỔ CHỨC]';
  const mapLink = config.venue.mapLink || 'https://maps.google.com';
  const buttonLabel = config.venue.buttonLabel || 'Xem bản đồ chỉ đường';

  container.innerHTML = `
    <section class="section venue-section" id="venue-section">
      <span class="section-kicker">ĐỊA ĐIỂM • TIỆC CƯỚI</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-subtitle">Thông tin chi tiết về không gian tổ chức ngày chung đôi</p>

      <div class="venue-editorial-card glass-panel" style="max-width: 680px; margin: 0 auto; padding: 3rem 2rem; text-align: center; border-radius: 12px;">
        <div style="font-family: var(--font-display); font-size: 1.6rem; color: var(--champagne); font-style: italic; margin-bottom: 0.5rem;">
          ✦
        </div>
        <h3 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 500; color: var(--ink); margin-bottom: 1.25rem;">
          ${name}
        </h3>

        <div style="font-family: var(--font-body); font-size: 0.95rem; color: var(--ink-muted); line-height: 1.8; margin-bottom: 2rem;">
          <p>${address}</p>
          <p style="font-weight: 500; color: var(--ink); margin-top: 0.5rem;">${time}</p>
        </div>

        <a 
          href="${mapLink}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-pill btn-magnetic"
          id="venue-map-btn"
        >
          <span>${buttonLabel}</span>
          <span>➔</span>
        </a>
      </div>
    </section>
  `;
}
