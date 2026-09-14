// LOGITECH TRACKBALL DIRECTION TRACKER & 3D DEVICE HUD ENGINE

// --- Global Application State ---
const state = {
  dx: 0,
  dy: 0,
  speed: 0,
  angle: 0,
  cardinal: 'NORTH',
  clickCount: 0,
  lastButton: 'READY',
  velX: 0,
  velY: 0,
  damping: 0.92,
  sensitivity: 1.0,
  theme: 'theme-logitech',
  ballTexture: 'ergo-red',
  bgMode: 'normal',
  buttons: {
    left: false,
    right: false,
    middle: false,
    back: false,
    forward: false,
    dpi: false,
    wheel: false
  }
};

// Trail history for radar particle trail
const aimHistory = [];
const MAX_TRAIL_POINTS = 30;

// Action feed history tags
const feedHistory = [];
const MAX_FEED_TAGS = 6;

// --- 3D Scene & Logitech Trackball Device Model Variables ---
let scene, camera, renderer, controls;
let trackballGroup, sphereMesh, sphereMaterial;
let btnMeshes = {};
const canvas3d = document.getElementById('canvas3d');

// Preset View Camera Positions
const cameraPresets = {
  iso: { pos: [3.2, 3.8, 4.2], target: [0, -0.2, 0] },
  top: { pos: [0, 6.0, 0.1], target: [0, 0, 0] },
  side: { pos: [-4.5, 1.8, 1.5], target: [-0.5, 0, 0] },
  front: { pos: [0, 2.2, 5.0], target: [0, 0, 0] }
};

function init3D() {
  scene = new THREE.Scene();
  const width = canvas3d.parentElement.clientWidth;
  const height = canvas3d.parentElement.clientHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(...cameraPresets.iso.pos);

  renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add Interactive OrbitControls
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 10;
    controls.minDistance = 2;
    controls.target.set(...cameraPresets.iso.target);
  }

  // --- Lighting & Studio Environment ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.6);
  rimLight.position.set(-5, 2, -5);
  scene.add(rimLight);

  const bottomFillLight = new THREE.DirectionalLight(0x7000ff, 0.3);
  bottomFillLight.position.set(0, -5, 2);
  scene.add(bottomFillLight);

  // --- Build 3D Logitech MX Ergo Trackball Device Model ---
  trackballGroup = new THREE.Group();
  trackballGroup.rotation.z = THREE.MathUtils.degToRad(-12);
  trackballGroup.rotation.x = THREE.MathUtils.degToRad(5);
  scene.add(trackballGroup);

  buildTrackballDeviceModel();

  window.addEventListener('resize', onWindowResize);
}

function buildTrackballDeviceModel() {
  // 1. Main Ergonomic Body Chassis
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-1.2, -1.8);
  bodyShape.bezierCurveTo(-1.8, -0.5, -1.8, 1.2, -0.6, 2.0);
  bodyShape.bezierCurveTo(0.4, 2.2, 1.6, 1.8, 1.8, 0.8);
  bodyShape.bezierCurveTo(2.0, -0.5, 1.2, -2.0, -0.2, -2.2);
  bodyShape.bezierCurveTo(-0.8, -2.2, -1.0, -2.0, -1.2, -1.8);

  const extrudeSettings = {
    depth: 0.8,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: 0.35,
    bevelThickness: 0.4
  };

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  bodyGeo.center();
  bodyGeo.rotateX(Math.PI / 2);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x161d2b,
    roughness: 0.4,
    metalness: 0.3
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  trackballGroup.add(bodyMesh);

  // 2. Rubberized Thumb & Palm Grip Mesh
  const gripGeo = new THREE.CylinderGeometry(1.2, 1.4, 1.8, 32, 1, false, 0, Math.PI);
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x0e131d,
    roughness: 0.85,
    metalness: 0.1
  });
  const gripMesh = new THREE.Mesh(gripGeo, gripMat);
  gripMesh.position.set(0.1, -0.2, -0.2);
  gripMesh.rotation.z = Math.PI / 2;
  trackballGroup.add(gripMesh);

  // 3. Trackball Socket (Thumb Socket Well)
  const socketGeo = new THREE.SphereGeometry(1.05, 32, 32);
  const socketMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e17,
    roughness: 0.9,
    metalness: 0.1
  });
  const socketMesh = new THREE.Mesh(socketGeo, socketMat);
  socketMesh.position.set(-0.95, 0.4, 0.4);
  trackballGroup.add(socketMesh);

  // Socket Metallic Accent Rim Ring
  const ringGeo = new THREE.TorusGeometry(1.06, 0.05, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.3
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.set(-0.95, 0.4, 0.4);
  ringMesh.rotation.x = Math.PI / 4;
  trackballGroup.add(ringMesh);

  // 4. 3D Rolling Trackball Sphere
  const ballGeo = new THREE.SphereGeometry(1.0, 64, 64);
  sphereMaterial = new THREE.MeshStandardMaterial({
    map: createProceduralBallTexture(state.ballTexture),
    roughness: 0.2,
    metalness: 0.7
  });
  sphereMesh = new THREE.Mesh(ballGeo, sphereMaterial);
  sphereMesh.position.set(-0.95, 0.4, 0.4);
  sphereMesh.castShadow = true;
  trackballGroup.add(sphereMesh);

  // 5. Interactive 3D Buttons & Scroll Wheel
  build3DButtons();
}

function build3DButtons() {
  const btnDefaultMat = () => new THREE.MeshStandardMaterial({
    color: 0x222c3d,
    roughness: 0.3,
    metalness: 0.4
  });

  const lmbGeo = new THREE.BoxGeometry(0.65, 0.22, 1.4);
  const lmbMesh = new THREE.Mesh(lmbGeo, btnDefaultMat());
  lmbMesh.position.set(0.15, 0.72, 0.7);
  lmbMesh.rotation.x = -0.15;
  trackballGroup.add(lmbMesh);
  btnMeshes.left = lmbMesh;

  const rmbGeo = new THREE.BoxGeometry(0.65, 0.22, 1.4);
  const rmbMesh = new THREE.Mesh(rmbGeo, btnDefaultMat());
  rmbMesh.position.set(0.85, 0.72, 0.6);
  rmbMesh.rotation.x = -0.15;
  rmbMesh.rotation.z = -0.05;
  trackballGroup.add(rmbMesh);
  btnMeshes.right = rmbMesh;

  const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 32);
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x111622,
    roughness: 0.8,
    metalness: 0.2
  });
  const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
  wheelMesh.position.set(0.5, 0.78, 1.0);
  wheelMesh.rotation.z = Math.PI / 2;
  trackballGroup.add(wheelMesh);
  btnMeshes.middle = wheelMesh;
  btnMeshes.wheel = wheelMesh;

  const b1Geo = new THREE.BoxGeometry(0.15, 0.12, 0.35);
  const b1Mesh = new THREE.Mesh(b1Geo, btnDefaultMat());
  b1Mesh.position.set(-0.25, 0.75, 1.1);
  trackballGroup.add(b1Mesh);
  btnMeshes.back = b1Mesh;

  const b2Geo = new THREE.BoxGeometry(0.15, 0.12, 0.35);
  const b2Mesh = new THREE.Mesh(b2Geo, btnDefaultMat());
  b2Mesh.position.set(-0.25, 0.75, 0.65);
  trackballGroup.add(b2Mesh);
  btnMeshes.forward = b2Mesh;

  const dpiGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
  const dpiMesh = new THREE.Mesh(dpiGeo, btnDefaultMat());
  dpiMesh.position.set(-0.95, 1.42, 0.4);
  trackballGroup.add(dpiMesh);
  btnMeshes.dpi = dpiMesh;

  Object.keys(btnMeshes).forEach(key => {
    btnMeshes[key].userData.initY = btnMeshes[key].position.y;
  });
}

function onWindowResize() {
  if (!canvas3d || !canvas3d.parentElement) return;
  const width = canvas3d.parentElement.clientWidth;
  const height = canvas3d.parentElement.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function createProceduralBallTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (type === 'ergo-red') {
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#b80d28');
    grad.addColorStop(0.5, '#e61c3b');
    grad.addColorStop(1, '#780517');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'ergo-blue') {
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#005f73');
    grad.addColorStop(0.5, '#0a9396');
    grad.addColorStop(1, '#001219');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'trackman-ruby') {
    ctx.fillStyle = '#6b0000';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 8 + 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'stealth-black') {
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
  } else if (type === 'cyber-mesh') {
    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    for (let i = 0; i < 1024; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
    for (let j = 0; j < 512; j += 32) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(1024, j);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function updateBallTexture(type) {
  state.ballTexture = type;
  if (sphereMaterial) {
    sphereMaterial.map = createProceduralBallTexture(type);
    sphereMaterial.needsUpdate = true;
  }
}

function setCameraAngle(presetKey) {
  const preset = cameraPresets[presetKey];
  if (!preset) return;

  document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
  const targetBtn = Array.from(document.querySelectorAll('.view-btn')).find(b => b.getAttribute('onclick').includes(presetKey));
  if (targetBtn) targetBtn.classList.add('active');

  const startPos = camera.position.clone();
  const endPos = new THREE.Vector3(...preset.pos);
  const duration = 500;
  const startTime = performance.now();

  function animateCam(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPos, endPos, ease);
    if (controls) {
      controls.target.set(...preset.target);
      controls.update();
    }

    if (progress < 1) {
      requestAnimationFrame(animateCam);
    }
  }
  requestAnimationFrame(animateCam);
}

// --- Initialize 2D Aim Vector Radar Canvas ---
const radarCanvas = document.getElementById('radarCanvas');
const rCtx = radarCanvas ? radarCanvas.getContext('2d') : null;

function drawRadar() {
  if (!rCtx || !radarCanvas) return;
  const width = radarCanvas.parentElement.clientWidth;
  const height = radarCanvas.parentElement.clientHeight;
  radarCanvas.width = width;
  radarCanvas.height = height;

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) / 2 - 20;

  rCtx.clearRect(0, 0, width, height);

  rCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  rCtx.lineWidth = 1;
  [0.25, 0.5, 0.75, 1.0].forEach(ratio => {
    rCtx.beginPath();
    rCtx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
    rCtx.stroke();
  });

  rCtx.beginPath();
  rCtx.moveTo(cx - maxR, cy); rCtx.lineTo(cx + maxR, cy);
  rCtx.moveTo(cx, cy - maxR); rCtx.lineTo(cx, cy + maxR);
  rCtx.stroke();

  rCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  rCtx.font = '700 12px "JetBrains Mono"';
  rCtx.textAlign = 'center';
  rCtx.textBaseline = 'middle';
  rCtx.fillText('N', cx, cy - maxR + 10);
  rCtx.fillText('S', cx, cy + maxR - 10);
  rCtx.fillText('E', cx + maxR - 10, cy);
  rCtx.fillText('W', cx - maxR + 10, cy);

  if (aimHistory.length > 1) {
    rCtx.beginPath();
    for (let i = 0; i < aimHistory.length; i++) {
      const pt = aimHistory[i];
      const px = cx + (pt.dx / 100) * maxR;
      const py = cy + (pt.dy / 100) * maxR;
      if (i === 0) rCtx.moveTo(px, py);
      else rCtx.lineTo(px, py);
    }
    rCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent-color') || '#00f0ff';
    rCtx.lineWidth = 3;
    rCtx.shadowBlur = 10;
    rCtx.shadowColor = rCtx.strokeStyle;
    rCtx.stroke();
    rCtx.shadowBlur = 0;
  }

  if (state.speed > 1) {
    const rad = (state.angle * Math.PI) / 180;
    const arrowLen = Math.min(maxR, (state.speed / 500) * maxR + 20);
    const targetX = cx + Math.cos(rad) * arrowLen;
    const targetY = cy + Math.sin(rad) * arrowLen;

    rCtx.beginPath();
    rCtx.moveTo(cx, cy);
    rCtx.lineTo(targetX, targetY);
    rCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent-color') || '#00f0ff';
    rCtx.lineWidth = 4;
    rCtx.shadowBlur = 12;
    rCtx.shadowColor = rCtx.strokeStyle;
    rCtx.stroke();

    rCtx.beginPath();
    rCtx.arc(targetX, targetY, 6, 0, Math.PI * 2);
    rCtx.fillStyle = '#ffffff';
    rCtx.fill();
    rCtx.shadowBlur = 0;
  }
}

// --- Main Render & Physics Loop ---
function animate() {
  requestAnimationFrame(animate);

  state.velX *= state.damping;
  state.velY *= state.damping;

  if (sphereMesh) {
    sphereMesh.rotation.y += state.velX * 0.02;
    sphereMesh.rotation.x += state.velY * 0.02;
  }

  if (controls) {
    controls.update();
  }

  state.speed = Math.sqrt(state.velX * state.velX + state.velY * state.velY) * 60;

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  drawRadar();
}

// --- Mouse Movement & Vector Math Handler ---
function handleMotion(dx, dy) {
  const scaledDx = dx * state.sensitivity;
  const scaledDy = dy * state.sensitivity;

  state.dx = scaledDx;
  state.dy = scaledDy;
  state.velX = scaledDx;
  state.velY = scaledDy;

  let rad = Math.atan2(scaledDy, scaledDx);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  state.angle = deg;

  const cardinals = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];
  const index = Math.round(deg / 45) % 8;
  state.cardinal = cardinals[index];

  aimHistory.push({ dx: scaledDx, dy: scaledDy });
  if (aimHistory.length > MAX_TRAIL_POINTS) {
    aimHistory.shift();
  }

  const telAngle = document.getElementById('telAngle');
  if (telAngle) telAngle.innerText = `${state.angle.toFixed(1)}° ${state.cardinal}`;
  const telSpeed = document.getElementById('telSpeed');
  if (telSpeed) telSpeed.innerText = `${Math.round(state.speed)} px/s`;
  const telVector = document.getElementById('telVector');
  if (telVector) telVector.innerText = `${Math.round(scaledDx)}, ${Math.round(scaledDy)}`;
  const cardinalBadge = document.getElementById('cardinalBadge');
  if (cardinalBadge) cardinalBadge.innerText = state.cardinal;
}

// --- Button Click & 3D Button Animation Handler ---
function handleButton(buttonName, isPressed) {
  state.buttons[buttonName] = isPressed;

  if (isPressed) {
    state.clickCount++;
    state.lastButton = buttonName.toUpperCase();
    const telClicks = document.getElementById('telClicks');
    if (telClicks) telClicks.innerText = state.clickCount;
    const lastButtonBadge = document.getElementById('lastButtonBadge');
    if (lastButtonBadge) lastButtonBadge.innerText = state.lastButton;
    triggerClickRipple(buttonName);
    pushActionFeedTag(state.lastButton);
  }

  const mesh = btnMeshes[buttonName];
  if (mesh) {
    const targetY = isPressed ? mesh.userData.initY - 0.08 : mesh.userData.initY;
    mesh.position.y = targetY;
    
    if (isPressed) {
      mesh.material.emissive = new THREE.Color(0x00f0ff);
      mesh.material.emissiveIntensity = 0.6;
    } else {
      mesh.material.emissive = new THREE.Color(0x000000);
      mesh.material.emissiveIntensity = 0;
    }
  }

  let svgId = null;
  if (buttonName === 'left') svgId = 'btn-left';
  else if (buttonName === 'right') svgId = 'btn-right';
  else if (buttonName === 'middle') svgId = 'btn-wheel';
  else if (buttonName === 'back') svgId = 'btn-back';
  else if (buttonName === 'forward') svgId = 'btn-forward';
  else if (buttonName === 'dpi') svgId = 'btn-dpi';

  if (svgId) {
    const el = document.getElementById(svgId);
    if (el) {
      if (isPressed) el.classList.add('active');
      else el.classList.remove('active');
    }
  }
}

function handleWheel(delta) {
  if (btnMeshes.wheel) {
    btnMeshes.wheel.rotation.x += delta > 0 ? 0.3 : -0.3;
    btnMeshes.wheel.material.emissive = new THREE.Color(0x00f0ff);
    btnMeshes.wheel.material.emissiveIntensity = 0.8;
    setTimeout(() => {
      if (btnMeshes.wheel) {
        btnMeshes.wheel.material.emissive = new THREE.Color(0x000000);
        btnMeshes.wheel.material.emissiveIntensity = 0;
      }
    }, 150);
  }

  const wheelEl = document.getElementById('btn-wheel');
  if (wheelEl) {
    wheelEl.classList.add('active');
    setTimeout(() => wheelEl.classList.remove('active'), 150);
  }

  const arrowId = delta > 0 ? 'scrollUpArrow' : 'scrollDownArrow';
  const pulseClass = delta > 0 ? 'pulse-up' : 'pulse-down';
  const arrowEl = document.getElementById(arrowId);
  if (arrowEl) {
    arrowEl.classList.add(pulseClass);
    setTimeout(() => arrowEl.classList.remove(pulseClass), 200);
  }

  pushActionFeedTag(delta > 0 ? 'WHEEL UP' : 'WHEEL DOWN');
}

function pushActionFeedTag(label) {
  feedHistory.push(label);
  if (feedHistory.length > MAX_FEED_TAGS) {
    feedHistory.shift();
  }

  const feedContainer = document.getElementById('actionFeedTags');
  if (feedContainer) {
    feedContainer.innerHTML = feedHistory.map(tag => `<span class="feed-tag">${tag}</span>`).join('');
  }
}

function triggerClickRipple(buttonName) {
  const container = document.getElementById('rippleContainer');
  if (!container) return;

  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = '50%';
  ripple.style.top = '50%';
  container.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// --- WebSocket Connection Manager ---
function connectWebSocket() {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  // Detect current server port dynamically
  const port = window.location.port || 8765;
  const host = window.location.hostname || '127.0.0.1';
  const wsUrl = `ws://${host}:${port}`;

  console.log(`Connecting to WebSocket server at: ${wsUrl}`);
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    if (statusDot) statusDot.classList.add('connected');
    if (statusText) statusText.innerText = `CONNECTED TO WIN32 TRACKER SERVER (120 Hz, PORT ${port})`;
    const banner = document.getElementById('fallbackBanner');
    if (banner) banner.style.display = 'none';
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'motion') {
        handleMotion(data.dx, data.dy);
      } else if (data.type === 'button') {
        handleButton(data.button, data.state === 'down');
      } else if (data.type === 'wheel') {
        handleWheel(data.delta);
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  };

  ws.onclose = () => {
    if (statusDot) statusDot.classList.remove('connected');
    if (statusText) statusText.innerText = 'OFFLINE (BROWSER POINTER LOCK TEST MODE ACTIVE)';
    const banner = document.getElementById('fallbackBanner');
    if (banner) banner.style.display = 'flex';
    setTimeout(connectWebSocket, 3000);
  };

  ws.onerror = () => {
    ws.close();
  };
}

// --- Browser Pointer Lock & Event Listener Fallback Mode ---
function setupFallbackListeners() {
  const testBtn = document.getElementById('testModeBtn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      document.body.requestPointerLock();
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
      handleMotion(e.movementX, e.movementY);
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (document.pointerLockElement === document.body) {
      if (e.button === 0) handleButton('left', true);
      else if (e.button === 1) handleButton('middle', true);
      else if (e.button === 2) handleButton('right', true);
      else if (e.button === 3) handleButton('back', true);
      else if (e.button === 4) handleButton('forward', true);
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (document.pointerLockElement === document.body) {
      if (e.button === 0) handleButton('left', false);
      else if (e.button === 1) handleButton('middle', false);
      else if (e.button === 2) handleButton('right', false);
      else if (e.button === 3) handleButton('back', false);
      else if (e.button === 4) handleButton('forward', false);
    }
  });

  document.addEventListener('wheel', (e) => {
    if (document.pointerLockElement === document.body) {
      handleWheel(-e.deltaY);
    }
  });
}

// --- Controls & Settings Event Handlers ---
function setupSettingsControls() {
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      document.body.className = e.target.value;
      state.theme = e.target.value;
      updateObsUrl();
    });
  }

  const ballSelect = document.getElementById('ballTextureSelect');
  if (ballSelect) {
    ballSelect.addEventListener('change', (e) => {
      updateBallTexture(e.target.value);
      const badge = document.getElementById('ballTextureBadge');
      if (badge) badge.innerText = e.target.options[e.target.selectedIndex].text.toUpperCase();
    });
  }

  const dampingRange = document.getElementById('dampingRange');
  if (dampingRange) {
    dampingRange.addEventListener('input', (e) => {
      state.damping = parseFloat(e.target.value);
      const val = document.getElementById('dampingVal');
      if (val) val.innerText = state.damping.toFixed(2);
    });
  }

  const sensRange = document.getElementById('sensRange');
  if (sensRange) {
    sensRange.addEventListener('input', (e) => {
      state.sensitivity = parseFloat(e.target.value);
      const val = document.getElementById('sensVal');
      if (val) val.innerText = `${state.sensitivity.toFixed(1)}x`;
    });
  }

  const copyBtn = document.getElementById('copyObsUrlBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const obsUrlInput = document.getElementById('obsUrlInput');
      obsUrlInput.select();
      navigator.clipboard.writeText(obsUrlInput.value);
      copyBtn.innerHTML = '<i data-feather="check"></i> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '<i data-feather="copy"></i> Copy OBS URL';
        feather.replace();
      }, 2000);
    });
  }
}

function setBgMode(mode) {
  state.bgMode = mode;
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  
  if (mode === 'normal') {
    document.body.classList.remove('transparent-mode');
    document.body.style.backgroundColor = '';
    const btn = document.getElementById('bgModeNormal');
    if (btn) btn.classList.add('active');
  } else if (mode === 'transparent') {
    document.body.classList.add('transparent-mode');
    const btn = document.getElementById('bgModeTransparent');
    if (btn) btn.classList.add('active');
  } else if (mode === 'green') {
    document.body.classList.remove('transparent-mode');
    document.body.style.backgroundColor = '#00ff00';
    const btn = document.getElementById('bgModeGreen');
    if (btn) btn.classList.add('active');
  } else if (mode === 'blue') {
    document.body.classList.remove('transparent-mode');
    document.body.style.backgroundColor = '#0000ff';
    const btn = document.getElementById('bgModeBlue');
    if (btn) btn.classList.add('active');
  }
  updateObsUrl();
}

function updateObsUrl() {
  const host = window.location.hostname || '127.0.0.1';
  const port = window.location.port ? `:${window.location.port}` : ':8765';
  const baseUrl = `http://${host}${port}/overlay.html`;
  const obsUrlInput = document.getElementById('obsUrlInput');
  if (obsUrlInput) {
    obsUrlInput.value = baseUrl;
  }
}

function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'overlay') {
    document.body.classList.add('overlay-only-mode');
  }
  if (params.get('bg') === 'transparent') {
    setBgMode('transparent');
  }
  if (params.get('theme')) {
    document.body.className = params.get('theme');
  }
}

// --- App Initialization ---
window.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  init3D();
  animate();
  connectWebSocket();
  setupFallbackListeners();
  setupSettingsControls();
  updateObsUrl();
});
