import { qualityManager } from '../utils/quality.js';
import { sfx } from '../utils/sfx.js';
import { randomFloat, randomChoice } from '../utils/random.js';
import { isReducedMotion } from '../utils/motion.js';

export async function initWishPitSection(config) {
  const container = document.getElementById('wish-pit-section-mount');
  if (!container) return;

  const fullWishes = config.wishes || [
    "Chúc hai bạn trăm năm hạnh phúc, và trăm năm không ai giành remote TV.",
    "Chúc Kiên luôn nhớ ngày kỷ niệm. Chúc Hiền luôn nhớ rằng Kiên đã cố gắng nhớ.",
    "Chúc hai bạn ăn gì cũng ngon, ngủ đâu cũng say, cãi nhau năm phút là làm lành.",
    "Chúc nhà mình luôn có tiếng cười, và hóa đơn điện nước luôn thấp hơn dự kiến.",
    "Chúc Hiền mãi xinh đẹp, chúc Kiên mãi nhớ rằng câu trả lời an toàn nhất là 'em đúng'.",
    "Chúc hai bạn mãi như lúc mới yêu, nhưng bớt xem điện thoại trên bàn ăn.",
    "Chúc tình yêu của hai bạn bền như pin điện thoại hồi mới mua, chứ đừng như pin hiện tại.",
    "Chúc hai bạn ngày nào cũng có lý do để cười, kể cả khi không ai nhớ lý do là gì.",
    "Chúc Kiên rửa chén giỏi, chúc Hiền nấu ăn ngon, và chúc cả hai đều biết gọi đồ ăn ngoài.",
    "Chúc hai bạn đi đâu cũng có nhau, trừ lúc đi vệ sinh.",
    "Chúc cuộc hôn nhân này ngọt như kẹo, bền như keo, và vui như đi Tết.",
    "Chúc hai bạn sớm có tin vui.",
  ];

  const words = config.decorWords || [
    'Hạnh phúc', 'Bình yên', 'Tiếng cười', 'Sức khỏe', 'Tiền về đầy ví',
    'Ăn ngon ngủ khỏe', 'Bên nhau trọn đời', 'Wifi mạnh', 'Không giận quá 5 phút',
  ];
  const title = config.wishPit?.title || 'Bể Ước Nguyện Ngọc Trai & Lời Chúc Cưới';
  const subtitle = config.wishPit?.subtitle || 'Những lời chúc lành kết tinh thành những viên ngọc sáng và nang thủy tinh viền vàng';
  const shakeHint = config.wishPit?.shakeHint || 'Thử kéo thả các viên ngọc hoặc chạm nút "Lắc bể ngọc" để cảm nhận tương tác';

  container.innerHTML = `
    <section class="wish-pit-section" id="wish-pit-section">
      <!-- Watermark Chữ Hỷ 囍 Bể Ước Nguyện -->
      <div class="xi-watermark xi-hero" style="top: 45%; opacity: 0.045;" aria-hidden="true">囍</div>

      <div class="wish-pit-wrapper">
        <header class="wish-pit-header">
          <span class="wish-pit-kicker">✨ BỂ ƯỚC NGUYỆN • NGÀN LỜI CHÚC PHÚC</span>
          <h2 class="wish-pit-title">${title}</h2>
          <p class="wish-pit-subtitle">${subtitle}</p>
        </header>

        <!-- Glass Vessel Stage -->
        <div class="wish-pit-glass-stage" id="wish-pit-stage" data-cursor="drag">
          <canvas class="wish-pit-canvas" id="wish-pit-canvas"></canvas>
          <div class="wish-pit-hint-overlay">${shakeHint}</div>
        </div>

        <div class="wish-pit-controls">
          <button type="button" class="btn-pill" id="wish-pit-drop-btn">
            <span>✦</span>
            <span>Thêm ước nguyện</span>
          </button>
          <button type="button" class="btn-pill btn-pill-secondary" id="wish-pit-shake-btn">
            <span>✨</span>
            <span>Lắc bể ngọc</span>
          </button>
        </div>
      </div>

      <!-- Capsule Modal for Full Wish View -->
      <div class="capsule-modal" id="capsule-modal" role="dialog" aria-modal="true" aria-label="Lời chúc phúc">
        <div class="capsule-modal-card">
          <button type="button" class="capsule-modal-close-btn" id="capsule-modal-close" aria-label="Đóng">&times;</button>
          <span class="capsule-modal-kicker">LỜI CHÚC PHÚC Ý NGHĨA</span>
          <p class="capsule-modal-wish" id="capsule-modal-text"></p>
          <button type="button" class="btn-pill" id="capsule-modal-confirm-btn">
            Gửi trọn yêu thương
          </button>
        </div>
      </div>
    </section>
  `;

  const canvas = document.getElementById('wish-pit-canvas');
  const stage = document.getElementById('wish-pit-stage');
  const dropBtn = document.getElementById('wish-pit-drop-btn');
  const shakeBtn = document.getElementById('wish-pit-shake-btn');
  const modal = document.getElementById('capsule-modal');
  const modalText = document.getElementById('capsule-modal-text');
  const modalClose = document.getElementById('capsule-modal-close');
  const modalConfirm = document.getElementById('capsule-modal-confirm-btn');

  // Lazy-load Matter.js
  let Matter;
  try {
    Matter = await import('matter-js');
  } catch (err) {
    console.warn('Matter.js load error:', err);
    return;
  }

  const { Engine, Bodies, Body, Composite, Runner, Mouse, MouseConstraint, Events } = Matter.default || Matter;

  let width = stage.clientWidth || 900;
  let height = stage.clientHeight || 480;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const engine = Engine.create({
    gravity: { x: 0, y: 1.05 },
  });
  const world = engine.world;

  // Static walls enclosing the glass stage
  const wallOpts = { isStatic: true, restitution: 0.35, friction: 0.25 };
  const ground = Bodies.rectangle(width / 2, height + 25, width * 2, 50, wallOpts);
  const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 2, wallOpts);
  const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 2, wallOpts);
  const ceiling = Bodies.rectangle(width / 2, -120, width * 2, 50, wallOpts);
  Composite.add(world, [ground, leftWall, rightWall, ceiling]);

  // Mouse Constraint (confined to canvas)
  const mouse = Mouse.create(canvas);
  mouse.pixelRatio = dpr;
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.25,
      render: { visible: false },
    },
  });
  Composite.add(world, mouseConstraint);

  // Active items tracking
  const activeItems = [];
  const maxBodies = qualityManager.getLimits().physicsBodiesCount;

  // Collision SFX listener (glass clink)
  Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const speed = Math.hypot(pairs[i].collision.tangent.x, pairs[i].collision.tangent.y);
      if (speed > 1.2) {
        sfx.glassClink(speed);
        break;
      }
    }
  });

  // Spawn a Pearl Sphere or Glass Capsule
  function spawnItem(isPearl = false, customX = null, customY = null) {
    if (activeItems.length >= maxBodies) {
      const old = activeItems.shift();
      Composite.remove(world, old.body);
    }

    const startX = customX !== null ? customX : randomFloat(width * 0.2, width * 0.8);
    const startY = customY !== null ? customY : randomFloat(-40, -10);

    if (isPearl) {
      // Glossy Pearl Sphere
      const radius = randomFloat(18, 26);
      const body = Bodies.circle(startX, startY, radius, {
        restitution: 0.35,
        friction: 0.2,
        density: 0.002,
      });

      Body.setVelocity(body, { x: randomFloat(-1.5, 1.5), y: randomFloat(1, 3) });
      Body.setAngularVelocity(body, randomFloat(-0.04, 0.04));

      Composite.add(world, body);
      activeItems.push({
        type: 'pearl',
        body,
        radius,
      });
    } else {
      // Slim Gold-Rimmed Glass Capsule carrying wish word
      const word = randomChoice(words);
      const fullWish = randomChoice(fullWishes);
      const capWidth = Math.max(90, word.length * 11 + 32);
      const capHeight = 36;

      const body = Bodies.rectangle(startX, startY, capWidth, capHeight, {
        chamfer: { radius: 18 },
        restitution: 0.35,
        friction: 0.25,
        density: 0.0018,
      });

      Body.setVelocity(body, { x: randomFloat(-1.5, 1.5), y: randomFloat(1, 3) });
      Body.setAngularVelocity(body, randomFloat(-0.05, 0.05));

      Composite.add(world, body);
      activeItems.push({
        type: 'capsule',
        body,
        width: capWidth,
        height: capHeight,
        word,
        fullWish,
      });
    }
  }

  // Initial burst of pearls & capsules distributed inside the vessel
  const initialCount = Math.min(18, maxBodies);
  for (let i = 0; i < initialCount; i++) {
    const isPearl = i % 3 === 0;
    const startX = randomFloat(width * 0.15, width * 0.85);
    const startY = randomFloat(height * 0.15, height * 0.85);
    spawnItem(isPearl, startX, startY);
  }

  // Button actions
  dropBtn?.addEventListener('click', () => {
    sfx.harpPluck();
    spawnItem(false, randomFloat(width * 0.25, width * 0.75), -30);
    spawnItem(true, randomFloat(width * 0.25, width * 0.75), -50);
  });

  const triggerShake = () => {
    sfx.glassClink(3);
    activeItems.forEach(({ body }) => {
      Body.applyForce(body, body.position, {
        x: randomFloat(-0.02, 0.02),
        y: randomFloat(-0.05, -0.015),
      });
    });
  };

  shakeBtn?.addEventListener('click', triggerShake);

  // Mobile device orientation shake
  if (typeof window.DeviceMotionEvent !== 'undefined') {
    let lastX = 0, lastY = 0, lastZ = 0;
    window.addEventListener(
      'devicemotion',
      (e) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;
        const delta = Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ);
        if (delta > 22) {
          triggerShake();
        }
        lastX = acc.x; lastY = acc.y; lastZ = acc.z;
      },
      { passive: true }
    );
  }

  // Click on a Capsule -> Expand Modal
  let pointerDownPos = null;
  canvas.addEventListener('pointerdown', (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!pointerDownPos) return;
    const dx = Math.abs(e.clientX - pointerDownPos.x);
    const dy = Math.abs(e.clientY - pointerDownPos.y);

    if (dx < 6 && dy < 6) {
      // Tap detected -> find clicked body
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (let i = activeItems.length - 1; i >= 0; i--) {
        const item = activeItems[i];
        if (item.type === 'capsule') {
          const b = item.body;
          if (Math.hypot(clickX - b.position.x, clickY - b.position.y) < item.width / 2) {
            // Open modal
            sfx.sparkleShimmer();
            modalText.textContent = `“${item.fullWish || item.word}”`;
            modal?.classList.add('is-open');
            document.body.classList.add('modal-open');
            window.dispatchEvent(new CustomEvent('app:modal-open'));
            modalClose?.focus();
            break;
          }
        }
      }
    }
  });

  const closeModal = () => {
    if (!modal?.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    window.dispatchEvent(new CustomEvent('app:modal-close'));
  };

  // Đóng bằng phím Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  modalClose?.addEventListener('click', closeModal);
  modalConfirm?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Resize smoothly
  const handleResize = () => {
    const newWidth = stage.clientWidth;
    const newHeight = stage.clientHeight;
    if (!newWidth || !newHeight) return;

    width = newWidth;
    height = newHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    Body.setPosition(ground, { x: width / 2, y: height + 25 });
    Body.setPosition(leftWall, { x: -25, y: height / 2 });
    Body.setPosition(rightWall, { x: width + 25, y: height / 2 });
    Body.setPosition(ceiling, { x: width / 2, y: -120 });

    activeItems.forEach(({ body }) => {
      if (body.position.x > width - 30) {
        Body.setPosition(body, { x: width - 50, y: Math.min(body.position.y, height - 40) });
      }
      if (body.position.x < 30) {
        Body.setPosition(body, { x: 50, y: Math.min(body.position.y, height - 40) });
      }
      if (body.position.y > height) {
        Body.setPosition(body, { x: body.position.x, y: height - 40 });
      }
    });
  };

  window.addEventListener('resize', handleResize);

  // Custom Rendering Loop for Pearls & Glass Capsules
  let isVisible = true;
  let isRunning = true;
  const runner = Runner.create();
  Runner.run(runner, engine);

  function draw() {
    if (!isVisible) {
      requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    activeItems.forEach((item) => {
      const { body, type } = item;
      const { x, y } = body.position;
      const angle = body.angle;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      if (type === 'pearl') {
        const r = item.radius;

        // Pearl drop shadow
        ctx.shadowColor = 'rgba(43, 26, 30, 0.12)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        // Luminous radial gradient
        const pGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
        pGrad.addColorStop(0, '#FFFFFF');
        pGrad.addColorStop(0.45, '#FFF7F2');
        pGrad.addColorStop(0.8, '#F3D9D4');
        pGrad.addColorStop(1, '#D4AF7A');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Delicate specular reflection dot
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.35, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'capsule') {
        const w = item.width;
        const h = item.height;
        const radius = h / 2;

        // Soft glass capsule shadow
        ctx.shadowColor = 'rgba(43, 26, 30, 0.08)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        // Frosted glass background
        ctx.fillStyle = 'rgba(255, 253, 251, 0.88)';
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, radius);
        ctx.fill();

        // 1px Champagne gold rim
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#D4AF7A';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, radius);
        ctx.stroke();

        // Wish text
        ctx.fillStyle = '#2B1A1E';
        ctx.font = "500 13px 'Be Vietnam Pro', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.word, 0, 1);
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  // Pause physics loop when off-screen to preserve 60fps performance
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const nextVisible = entry.isIntersecting && !document.hidden;
        if (nextVisible === isVisible) return;
        isVisible = nextVisible;
        if (isVisible) {
          if (!isRunning) {
            Runner.run(runner, engine);
            isRunning = true;
          }
        } else {
          if (isRunning) {
            Runner.stop(runner);
            isRunning = false;
          }
        }
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(stage);
  document.addEventListener('visibilitychange', () => {
    const nextVisible = !document.hidden;
    if (nextVisible === isVisible) return;
    isVisible = nextVisible;
    if (isVisible) {
      if (!isRunning) {
        Runner.run(runner, engine);
        isRunning = true;
      }
    } else {
      if (isRunning) {
        Runner.stop(runner);
        isRunning = false;
      }
    }
  });
}
