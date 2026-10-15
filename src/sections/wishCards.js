import { gsap } from 'gsap';
import { shuffleArray } from '../utils/random.js';
import { confettiPresets } from '../effects/confettiPresets.js';
import { isReducedMotion } from '../utils/motion.js';

export function initWishCardsSection(config) {
  const container = document.getElementById('wish-cards-section-mount');
  if (!container) return;

  const originalWishes = config.wishCards || [
    'Chúc hai bạn trăm năm hạnh phúc!',
    'Chúc tình yêu của hai bạn luôn ngọt ngào như ngày đầu!',
  ];

  container.innerHTML = `
    <section class="section wish-cards-section" id="wish-cards-section">
      <h2 class="section-title">Hộp lời chúc may mắn 🎁</h2>
      <p class="section-subtitle">Mỗi lần bốc là một lời chúc độc quyền (và siêu thực tế)</p>

      <div class="wish-deck-wrapper" id="wish-deck">
        <div class="wish-card-shadow-layer layer-1" aria-hidden="true"></div>
        <div class="wish-card-shadow-layer layer-2" aria-hidden="true"></div>

        <div class="wish-flip-card" id="wish-flip-card">
          <!-- Front Face: Card Back Motif -->
          <div class="wish-card-face wish-card-front">
            <div class="wish-card-back-pattern">
              <div class="wish-front-crest">♥</div>
              <div class="wish-front-title">LỜI CHÚC TRĂM NĂM</div>
              <div class="wish-front-hint">Chạm nút bên dưới để bốc thẻ</div>
            </div>
          </div>

          <!-- Back Face: Revealed Wish -->
          <div class="wish-card-face wish-card-back">
            <div class="wish-quote-deco">“</div>
            <p class="wish-revealed-text" id="wish-text-content"></p>
            <div class="wish-quote-deco">”</div>
          </div>
        </div>
      </div>

      <div class="wish-controls">
        <div class="wish-counter-badge" id="wish-counter">
          <span>✨</span>
          <span id="wish-counter-text">Chưa bốc thẻ nào (0/${originalWishes.length})</span>
        </div>

        <div id="wish-buttons-area">
          <button type="button" class="btn-pill" id="wish-draw-btn">
            <span>🎴</span>
            <span>Bốc một lời chúc</span>
          </button>
        </div>

        <div id="wish-finished-area" style="display: none;"></div>
      </div>
    </section>
  `;

  // State management: Shuffle bag
  let deck = shuffleArray(originalWishes);
  let drawnCount = 0;
  let isFlipped = false;
  let isAnimating = false;

  const flipCard = document.getElementById('wish-flip-card');
  const wishText = document.getElementById('wish-text-content');
  const counterText = document.getElementById('wish-counter-text');
  const drawBtn = document.getElementById('wish-draw-btn');
  const buttonsArea = document.getElementById('wish-buttons-area');
  const finishedArea = document.getElementById('wish-finished-area');

  const updateCounter = () => {
    counterText.textContent = `Đã bốc ${drawnCount}/${originalWishes.length} lời chúc`;
  };

  const drawWish = () => {
    if (isAnimating) return;

    if (deck.length === 0) {
      showFinishedState();
      return;
    }

    isAnimating = true;
    const wish = deck.pop();
    drawnCount++;

    // Fire mini confetti
    const deckRect = flipCard.getBoundingClientRect();
    const originX = (deckRect.left + deckRect.width / 2) / window.innerWidth;
    const originY = (deckRect.top + deckRect.height / 2) / window.innerHeight;
    confettiPresets.miniSparkle(originX, originY);

    if (isFlipped) {
      // Flip back to front briefly, then reveal new card
      flipCard.classList.remove('is-flipped');
      setTimeout(() => {
        wishText.textContent = wish;
        flipCard.classList.add('is-flipped');
        updateCounter();
        isAnimating = false;
        checkDeckEnd();
      }, 350);
    } else {
      wishText.textContent = wish;
      flipCard.classList.add('is-flipped');
      isFlipped = true;
      updateCounter();
      setTimeout(() => {
        isAnimating = false;
        checkDeckEnd();
      }, 700);
    }
  };

  const checkDeckEnd = () => {
    if (deck.length === 0) {
      showFinishedState();
    }
  };

  const showFinishedState = () => {
    buttonsArea.innerHTML = `
      <button type="button" class="btn-pill btn-pill-secondary" id="wish-reset-btn">
        <span>🔄</span>
        <span>Bốc lại từ đầu</span>
      </button>
    `;

    finishedArea.style.display = 'block';
    finishedArea.innerHTML = `
      <p class="wish-finished-msg">Hết lời chúc rồi, tớ yêu hai cậu thế là đủ! 💕</p>
    `;

    document.getElementById('wish-reset-btn')?.addEventListener('click', resetDeck);
  };

  const resetDeck = () => {
    deck = shuffleArray(originalWishes);
    drawnCount = 0;
    isFlipped = false;
    flipCard.classList.remove('is-flipped');
    finishedArea.style.display = 'none';
    counterText.textContent = `Chưa bốc thẻ nào (0/${originalWishes.length})`;

    buttonsArea.innerHTML = `
      <button type="button" class="btn-pill" id="wish-draw-btn">
        <span>🎴</span>
        <span>Bốc một lời chúc</span>
      </button>
    `;
    document.getElementById('wish-draw-btn')?.addEventListener('click', drawWish);
  };

  drawBtn?.addEventListener('click', drawWish);
}
