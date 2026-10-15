import { qualityManager } from '../utils/quality.js';
import { sfx } from '../utils/sfx.js';
import { audioManager } from '../utils/audio.js';
import { ParticleTextMorpher } from './particleText.js';
import { isReducedMotion } from '../utils/motion.js';

export async function initIntro3D(config, onIntroFinished) {
  const mount = document.getElementById('intro-mount');
  if (!mount) return;

  const title = config.intro?.title || 'Món quà độc bản gửi hai bạn';
  const hint = config.intro?.hint || 'Chạm để phá dấu sáp';
  const particleWords = config.intro?.particleText || ['Thúy Hiền', '&', 'Trung Kiên'];
  const skipText = config.intro?.skipText || 'Bỏ qua';
  const monogram = config.monogram || 'H & K';

  mount.innerHTML = `
    <div class="intro-3d-screen" id="intro-screen">
      <!-- Ambient light leaks -->
      <div class="intro-light-leak intro-light-leak-1" aria-hidden="true"></div>
      <div class="intro-light-leak intro-light-leak-2" aria-hidden="true"></div>

      <!-- 3D Scene / Canvas Container -->
      <div class="intro-canvas-container" id="intro-canvas-container" data-cursor="drag"></div>

      <!-- High-performance Particle Canvas -->
      <canvas class="particle-morph-canvas" id="particle-morph-canvas"></canvas>

      <!-- UI Layer -->
      <div class="intro-ui-layer" id="intro-ui-layer">
        <h1 class="intro-title">${title}</h1>
        <div class="intro-hint-pill" id="intro-hint-pill" data-cursor="open">
          <span>💌</span>
          <span>${hint}</span>
        </div>
      </div>

      <!-- Discreet Skip Link -->
      <button type="button" class="intro-skip-btn" id="intro-skip-btn">
        ${skipText} ➔
      </button>
    </div>
  `;

  const screenEl = document.getElementById('intro-screen');
  const container = document.getElementById('intro-canvas-container');
  const particleCanvas = document.getElementById('particle-morph-canvas');
  const uiLayer = document.getElementById('intro-ui-layer');
  const skipBtn = document.getElementById('intro-skip-btn');
  const hintPill = document.getElementById('intro-hint-pill');

  const morpher = new ParticleTextMorpher(particleCanvas);
  let isOpened = false;

  const finishIntro = () => {
    if (screenEl?.classList.contains('is-hidden')) return;
    screenEl?.classList.add('is-hidden');
    document.body.classList.remove('scroll-locked');
    setTimeout(() => {
      screenEl?.remove();
      if (onIntroFinished) onIntroFinished();
    }, 850);
  };

  skipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    sfx.unlock();
    audioManager.play();
    morpher.skip();
    finishIntro();
  });

  hintPill?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerOpen();
  });

  const canUseWebGL = qualityManager.getLimits().useWebGLIntro && !isReducedMotion();
  let threeLoaded = false;

  // Immediately render CSS fallback so envelope is visible & responsive with zero latency
  initCssEnvelopeFallback(container, monogram, triggerOpen);

  if (canUseWebGL) {
    try {
      const THREE = await import('three');
      if (!isOpened) {
        container.innerHTML = '';
        initThreeEnvelope(THREE, container, monogram, triggerOpen);
        threeLoaded = true;
      }
    } catch (err) {
      console.warn('WebGL / Three.js fallback:', err);
    }
  }

  function triggerOpen() {
    if (isOpened) return;
    isOpened = true;

    sfx.unlock();
    sfx.waxPressThud();
    sfx.glassChime();
    audioManager.play();

    uiLayer?.style.setProperty('display', 'none');

    // Softly fade envelope to the background so the wine red particle text is crystal clear
    if (container) {
      container.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      container.style.opacity = '0.12';
      container.style.transform = 'scale(0.92)';
    }

    // Origin point for gold & ruby dust explosion (center of viewport)
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2 - 15;

    morpher.start(originX, originY, particleWords, () => {
      finishIntro();
    });
  }
}

/**
 * Three.js 3D Ivory Sealed Envelope with Rose Wax Seal & Inertial Drag
 */
function initThreeEnvelope(THREE, container, monogramText, onOpen) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lighting with specular highlights
  const ambientLight = new THREE.AmbientLight(0xfff5f0, 0.95);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffeedd, 1.4);
  dirLight.position.set(4, 6, 6);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xd4af7a, 1.2, 12);
  pointLight.position.set(-3, 2, 4);
  scene.add(pointLight);

  // Group containing the whole envelope
  const envelopeGroup = new THREE.Group();
  scene.add(envelopeGroup);

  // 1. Envelope Body (Ivory Paper)
  const bodyGeo = new THREE.BoxGeometry(3.6, 2.4, 0.08);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xfbf4ee,
    roughness: 0.65,
    metalness: 0.05,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  envelopeGroup.add(bodyMesh);

  // Gold hairline outline on envelope body
  const edgesGeo = new THREE.EdgesGeometry(bodyGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xd4af7a, linewidth: 1.5 });
  const edgesLine = new THREE.LineSegments(edgesGeo, edgesMat);
  envelopeGroup.add(edgesLine);

  // 2. Flap Pivot Group (Folds open on X-axis)
  const flapGroup = new THREE.Group();
  flapGroup.position.set(0, 1.2, 0.045);
  envelopeGroup.add(flapGroup);

  // Triangular Flap Shape
  const flapShape = new THREE.Shape();
  flapShape.moveTo(-1.8, 0);
  flapShape.lineTo(1.8, 0);
  flapShape.lineTo(0, -1.3);
  flapShape.closePath();

  const flapGeo = new THREE.ShapeGeometry(flapShape);
  const flapMat = new THREE.MeshStandardMaterial({
    color: 0xf8efe9,
    roughness: 0.65,
    side: THREE.DoubleSide,
  });
  const flapMesh = new THREE.Mesh(flapGeo, flapMat);
  flapGroup.add(flapMesh);

  // 3. Wax Seal with Monogram
  // Create circular canvas texture for the seal face
  const sealCanvas = document.createElement('canvas');
  sealCanvas.width = 256;
  sealCanvas.height = 256;
  const sCtx = sealCanvas.getContext('2d');
  sCtx.fillStyle = '#8B263E';
  sCtx.beginPath();
  sCtx.arc(128, 128, 124, 0, Math.PI * 2);
  sCtx.fill();

  // Thin gold ring
  sCtx.strokeStyle = '#D4AF7A';
  sCtx.lineWidth = 6;
  sCtx.beginPath();
  sCtx.arc(128, 128, 114, 0, Math.PI * 2);
  sCtx.stroke();

  // Embossed monogram text
  sCtx.fillStyle = '#F4E8D1';
  sCtx.font = "italic bold 64px 'Cormorant Garamond', serif";
  sCtx.textAlign = 'center';
  sCtx.textBaseline = 'middle';
  sCtx.fillText(monogramText, 128, 128);

  const sealTex = new THREE.CanvasTexture(sealCanvas);

  const sealGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32);
  const sealMat = new THREE.MeshStandardMaterial({
    color: 0x8b263e,
    map: sealTex,
    roughness: 0.3,
    metalness: 0.25,
  });
  const sealMesh = new THREE.Mesh(sealGeo, sealMat);
  sealMesh.rotation.x = Math.PI / 2;
  sealMesh.position.set(0, -0.15, 0.08);
  envelopeGroup.add(sealMesh);

  // 4. Inside Keepsake Card (Slides out upon opening)
  const cardGeo = new THREE.BoxGeometry(3.3, 2.1, 0.02);
  const cardMat = new THREE.MeshStandardMaterial({
    color: 0xfffdfb,
    roughness: 0.5,
  });
  const cardMesh = new THREE.Mesh(cardGeo, cardMat);
  cardMesh.position.set(0, 0, -0.01);
  envelopeGroup.add(cardMesh);

  // Interaction: Drag to rotate with inertia & catch specular highlight
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function isClickOnEnvelope(clientX, clientY) {
    if (clientX === undefined || clientY === undefined) return false;
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects([envelopeGroup, sealMesh], true);
    return hits.length > 0;
  }

  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let downX = 0;
  let downY = 0;
  let downTime = 0;
  let targetRotY = 0;
  let targetRotX = 0;
  let hasMoved = false;

  const onPointerDown = (e) => {
    isPointerDown = true;
    hasMoved = false;
    const cx = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
    startX = cx;
    startY = cy;
    downX = cx;
    downY = cy;
    downTime = performance.now();
  };

  const onPointerMove = (e) => {
    const cx = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    // Specular light follow cursor gently
    const normX = (cx / window.innerWidth) * 2 - 1;
    const normY = -(cy / window.innerHeight) * 2 + 1;
    dirLight.position.x = 4 + normX * 3;
    dirLight.position.y = 6 + normY * 3;

    if (!isPointerDown) return;
    const dx = cx - startX;
    const dy = cy - startY;

    if (Math.hypot(cx - downX, cy - downY) > 12) {
      hasMoved = true;
    }

    targetRotY += dx * 0.0035;
    targetRotX += dy * 0.0035;
    targetRotX = Math.max(-0.45, Math.min(0.45, targetRotX));

    startX = cx;
    startY = cy;
  };

  const onPointerUp = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    const upX = e?.clientX ?? (e?.changedTouches && e?.changedTouches[0]?.clientX) ?? startX;
    const upY = e?.clientY ?? (e?.changedTouches && e?.changedTouches[0]?.clientY) ?? startY;
    const totalDist = Math.hypot(upX - downX, upY - downY);
    const duration = performance.now() - downTime;

    if (!hasMoved || totalDist < 14 || duration < 350 || isClickOnEnvelope(upX, upY)) {
      triggerEnvelopeOpen();
    }
  };

  const el = renderer.domElement;
  el.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);
  el.addEventListener('click', () => {
    if (!hasMoved) {
      triggerEnvelopeOpen();
    }
  });

  let isOpeningAnim = false;
  let openProgress = 0;

  function triggerEnvelopeOpen() {
    if (isOpeningAnim) return;
    isOpeningAnim = true;

    // Disperse wax seal fragments
    sealMesh.visible = false;
    if (sealMesh.parent) {
      sealMesh.parent.remove(sealMesh);
    }
    onOpen();
  }

  // Render loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Gentle floating motion
    if (!isOpeningAnim) {
      envelopeGroup.position.y = Math.sin(time * 1.2) * 0.08;
      envelopeGroup.rotation.z = Math.sin(time * 0.8) * 0.02;
    }

    // Inertia rotation damping
    envelopeGroup.rotation.y += (targetRotY - envelopeGroup.rotation.y) * 0.08;
    envelopeGroup.rotation.x += (targetRotX - envelopeGroup.rotation.x) * 0.08;

    // Opening animation
    if (isOpeningAnim && openProgress < 1) {
      openProgress += 0.035;
      const ease = 1 - Math.pow(1 - openProgress, 3);

      // Flap swings up
      flapGroup.rotation.x = ease * Math.PI * 0.95;
      // Card slides up
      cardMesh.position.y = ease * 1.5;
      cardMesh.position.z = 0.06;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/**
 * CSS / SVG Fallback Envelope for low tier or WebGL disabled
 */
function initCssEnvelopeFallback(container, monogramText, onOpen) {
  container.innerHTML = `
    <div class="envelope-fallback-wrapper" id="css-envelope-wrapper" data-cursor="open">
      <div class="envelope-body" id="css-envelope-body">
        <div class="envelope-card">
          <div style="font-family: var(--font-display); font-size: 1.35rem; color: var(--champagne); font-style: italic;">
            Thúy Hiền & Trung Kiên
          </div>
          <div style="font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-muted); margin-top: 6px;">
            Món quà cưới độc bản
          </div>
        </div>

        <div class="envelope-flap"></div>

        <div class="wax-seal" id="css-wax-seal" data-cursor="open">
          <span class="wax-seal-monogram">${monogramText}</span>
        </div>
      </div>
    </div>
  `;

  const wrapper = document.getElementById('css-envelope-wrapper');
  const body = document.getElementById('css-envelope-body');
  const seal = document.getElementById('css-wax-seal');

  // Parallax tilt on mouse move
  window.addEventListener(
    'mousemove',
    (e) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -16;
      const ry = (e.clientX / window.innerWidth - 0.5) * 16;
      if (body) {
        body.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    },
    { passive: true }
  );

  let isTriggered = false;
  const handleClick = (e) => {
    if (e) e.stopPropagation();
    if (isTriggered) return;
    isTriggered = true;

    body?.classList.add('is-open');
    if (seal) {
      seal.style.transform = 'translate(-50%, -50%) scale(1.4)';
      seal.style.opacity = '0';
    }
    setTimeout(() => {
      onOpen();
    }, 200);
  };

  seal?.addEventListener('click', handleClick);
  wrapper?.addEventListener('click', handleClick);
  container?.addEventListener('click', handleClick);
}
