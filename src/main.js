import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { buildDeskScene } from './deskModel.js';

// ==========================================
// 1. SCENE, CAMERA & RENDERER SETUP
// ==========================================

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090e);
scene.fog = new THREE.FogExp2(0x07090e, 0.08);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2.8, 2.2, 2.8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
container.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.58, 0);
controls.maxPolarAngle = Math.PI / 2 + 0.05;
controls.minDistance = 0.8;
controls.maxDistance = 8.0;

// ==========================================
// 2. LIGHTING SYSTEM (OPTIMIZED FOR LIGHT OAK DESK SURFACE)
// ==========================================

const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.95);
scene.add(ambientLight);

// Key Directional Light
const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
keyLight.position.set(3.5, 5, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);

// Underdesk Front Fill Light (Illuminating open rack amps & PC)
const underdeskLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
underdeskLight.position.set(0, 0.4, 3.5);
scene.add(underdeskLight);

// Rear Top Light (Illuminating cable trench & rear connectors)
const rearLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
rearLight.position.set(0, 3, -3);
scene.add(rearLight);

// Studio Floor Grid
const floorGeo = new THREE.PlaneGeometry(20, 20);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x090b10,
  roughness: 0.2,
  metalness: 0.8
});
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = 0;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const gridHelper = new THREE.GridHelper(12, 24, 0x38bdf8, 0x1e293b);
gridHelper.position.y = 0.001;
scene.add(gridHelper);

// ==========================================
// 3. BUILD 3D DESK SCENE
// ==========================================

const deskData = buildDeskScene();
scene.add(deskData.rootGroup);

// 3D Dimension Overlay Group
const dimsGroup = new THREE.Group();
dimsGroup.visible = false;
scene.add(dimsGroup);

function createTextSprite(message) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.fillText(message, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.6, 0.15, 1);
  return sprite;
}

function addDim(x1, y1, z1, x2, y2, z2, label) {
  const p1 = new THREE.Vector3(x1, y1, z1);
  const p2 = new THREE.Vector3(x2, y2, z2);
  
  const lineMat = new THREE.LineDashedMaterial({
    color: 0xfbbf24, dashSize: 0.04, gapSize: 0.02, linewidth: 2, depthTest: false
  });
  
  const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
  const line = new THREE.Line(geo, lineMat);
  line.computeLineDistances();
  line.renderOrder = 999;
  dimsGroup.add(line);

  if (label) {
    const sprite = createTextSprite(label);
    const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    // Offset slightly so line doesn't strike through text
    midPoint.y += 0.04;
    sprite.position.copy(midPoint);
    sprite.renderOrder = 1000;
    dimsGroup.add(sprite);
  }
}

function create3DDimensions() {
  // Overall Dimensions
  addDim(-1.55, 0.02, 0.6, 1.55, 0.02, 0.6, "Total Width: 310 cm");
  addDim(-1.7, 0.76, -0.45, -1.7, 0.76, 0.45, "Depth: 90 cm");
  addDim(1.7, 0, 0, 1.7, 0.76, 0, "Height: 76 cm");

  // Compartment Widths along the front
  addDim(-1.55, 0.02, 0.48, -1.10, 0.02, 0.48, "45cm"); // Left Pedestal
  addDim(-1.10, 0.02, 0.48, -0.45, 0.02, 0.48, "65cm"); // Op 1
  addDim(-0.45, 0.02, 0.48, -0.15, 0.02, 0.48, "30cm"); // PC
  addDim(-0.15, 0.02, 0.48, 0.45, 0.02, 0.48, "60cm");  // Amps
  addDim(0.45, 0.02, 0.48, 1.10, 0.02, 0.48, "65cm");   // Op 2
  addDim(1.10, 0.02, 0.48, 1.55, 0.02, 0.48, "45cm");   // Right Pedestal
}
create3DDimensions();

// ==========================================
// 4. PERIMETER BADGES & SVG LEADER LINES
// ==========================================

const svgOverlay = document.getElementById('svg-leader-lines');
const badgesLayer = document.getElementById('badges-layer');
const pinsOverlay = document.getElementById('pins-overlay');
const badgePointers = [];

function initPerimeterBadges() {
  badgesLayer.innerHTML = '';
  svgOverlay.innerHTML = `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
      </marker>
    </defs>
  `;

  deskData.equipmentPins.forEach((pinData, idx) => {
    const badge = document.createElement('div');
    badge.className = 'perimeter-badge';
    badge.innerHTML = `<span class="badge-dot"></span><span>${pinData.userData.name}</span>`;
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      openSpecCard(pinData.userData);
    });

    badgesLayer.appendChild(badge);

    const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svgLine.setAttribute('stroke', '#38bdf8');
    svgLine.setAttribute('stroke-width', '1.5');
    svgLine.setAttribute('stroke-dasharray', '4,3');
    svgLine.setAttribute('marker-end', 'url(#arrow)');
    svgOverlay.appendChild(svgLine);

    badgePointers.push({
      badge,
      svgLine,
      worldPos: pinData.worldPos,
      index: idx
    });
  });
}
// initPerimeterBadges(); // REMOVED

function updatePerimeterBadges() {
  if (pinsOverlay.style.display === 'none') return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const total = badgePointers.length;
  const tempV = new THREE.Vector3();

  badgePointers.forEach((item, idx) => {
    tempV.copy(item.worldPos);
    tempV.project(camera);

    if (tempV.z > 1) {
      item.badge.style.display = 'none';
      item.svgLine.style.display = 'none';
      return;
    }

    item.badge.style.display = 'flex';
    item.svgLine.style.display = 'block';

    const targetX = (tempV.x * 0.5 + 0.5) * width;
    const targetY = (tempV.y * -0.5 + 0.5) * height;

    const isLeft = idx % 2 === 0;
    const stackIndex = Math.floor(idx / 2);
    const perimeterX = isLeft ? 270 : width - 280;
    const startY = 110;
    const spacingY = Math.min(50, (height - 240) / Math.ceil(total / 2));
    const perimeterY = startY + stackIndex * spacingY;

    item.badge.style.left = `${perimeterX}px`;
    item.badge.style.top = `${perimeterY}px`;

    const anchorX = isLeft ? perimeterX + item.badge.offsetWidth : perimeterX;
    const anchorY = perimeterY + item.badge.offsetHeight / 2;

    item.svgLine.setAttribute('x1', anchorX);
    item.svgLine.setAttribute('y1', anchorY);
    item.svgLine.setAttribute('x2', targetX);
    item.svgLine.setAttribute('y2', targetY);
  });
}

// ==========================================
// 5. CAMERA PRESETS & ZOOM CONTROLS
// ==========================================

const cameraPresets = {
  iso: { pos: { x: 2.8, y: 2.2, z: 2.8 }, target: { x: 0, y: 0.58, z: 0 } },
  front: { pos: { x: 0, y: 0.70, z: 3.7 }, target: { x: 0, y: 0.58, z: 0 } },
  top: { pos: { x: 0, y: 4.2, z: 0.01 }, target: { x: 0, y: 0.58, z: 0 } },
  left: { pos: { x: -3.7, y: 0.70, z: 0 }, target: { x: 0, y: 0.58, z: 0 } },
  right: { pos: { x: 3.7, y: 0.70, z: 0 }, target: { x: 0, y: 0.58, z: 0 } },
  back: { pos: { x: 0, y: 0.9, z: -3.5 }, target: { x: 0, y: 0.58, z: 0 } },
  op1: { pos: { x: -0.85, y: 1.15, z: 1.4 }, target: { x: -0.85, y: 0.76, z: 0 } },
  op2: { pos: { x: 0.85, y: 1.15, z: 1.4 }, target: { x: 0.82, y: 0.76, z: 0 } }
};

function goToPreset(presetKey) {
  const p = cameraPresets[presetKey];
  if (!p) return;

  gsap.to(camera.position, {
    x: p.pos.x,
    y: p.pos.y,
    z: p.pos.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });

  gsap.to(controls.target, {
    x: p.target.x,
    y: p.target.y,
    z: p.target.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === presetKey);
  });
}

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    goToPreset(btn.dataset.preset);
  });
});

// Zoom Slider Logic
const zoomSlider = document.getElementById('zoom-slider');
const zoomValueDisplay = document.getElementById('zoom-value');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const resetCamBtn = document.getElementById('reset-cam-btn');

function updateZoomFromSlider() {
  const val = parseFloat(zoomSlider.value);
  const baseDist = 3.6;
  const targetDist = baseDist / val;
  
  const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  
  gsap.to(camera.position, {
    x: controls.target.x + dir.x * targetDist,
    y: controls.target.y + dir.y * targetDist,
    z: controls.target.z + dir.z * targetDist,
    duration: 0.3,
    ease: 'power1.out',
    onUpdate: () => controls.update()
  });

  zoomValueDisplay.textContent = `${Math.round(val * 100)}%`;
}

zoomSlider.addEventListener('input', updateZoomFromSlider);

zoomInBtn.addEventListener('click', () => {
  zoomSlider.value = Math.min(2.5, parseFloat(zoomSlider.value) + 0.15).toFixed(2);
  updateZoomFromSlider();
});

zoomOutBtn.addEventListener('click', () => {
  zoomSlider.value = Math.max(0.4, parseFloat(zoomSlider.value) - 0.15).toFixed(2);
  updateZoomFromSlider();
});

resetCamBtn.addEventListener('click', () => {
  zoomSlider.value = '1.0';
  zoomValueDisplay.textContent = '100%';
  goToPreset('iso');
});

controls.addEventListener('change', () => {
  const dist = camera.position.distanceTo(controls.target);
  const baseDist = 3.6;
  const zoomFactor = Math.min(2.5, Math.max(0.4, baseDist / dist));
  zoomSlider.value = zoomFactor.toFixed(2);
  zoomValueDisplay.textContent = `${Math.round(zoomFactor * 100)}%`;
});

// ==========================================
// 6. INTERACTIVE TOGGLES & ANIMATIONS
// ==========================================

let isPcSlidOut = false;
const slidePcBtn = document.getElementById('slide-pc-btn');
const pcSlideText = document.getElementById('pc-slide-text');

slidePcBtn.addEventListener('click', () => {
  isPcSlidOut = !isPcSlidOut;
  const targetZ = isPcSlidOut ? 0.45 : 0;
  
  gsap.to(deskData.pcSlideGroup.position, {
    z: targetZ,
    duration: 1.0,
    ease: 'power2.inOut'
  });

  slidePcBtn.classList.toggle('active', isPcSlidOut);
  pcSlideText.textContent = isPcSlidOut ? 'Retract PC Tower' : 'Slide Out PC Tower';
});

let isDrawersOpen = false;
const toggleDrawersBtn = document.getElementById('toggle-drawers-btn');
const drawerToggleText = document.getElementById('drawer-toggle-text');

toggleDrawersBtn.addEventListener('click', () => {
  isDrawersOpen = !isDrawersOpen;
  const targetZ = isDrawersOpen ? 0.22 : 0;

  gsap.to(deskData.leftDrawersGroup.position, {
    z: targetZ,
    duration: 0.8,
    ease: 'power2.inOut'
  });

  gsap.to(deskData.rightDrawersGroup.position, {
    z: targetZ,
    duration: 0.8,
    ease: 'power2.inOut'
  });

  toggleDrawersBtn.classList.toggle('active', isDrawersOpen);
  drawerToggleText.textContent = isDrawersOpen ? 'Close Drawers' : 'Open Drawers';
});

let isCablesHighlighted = false;
const toggleCablesBtn = document.getElementById('toggle-cables-btn');

toggleCablesBtn.addEventListener('click', () => {
  isCablesHighlighted = !isCablesHighlighted;
  toggleCablesBtn.classList.toggle('active', isCablesHighlighted);
  deskData.cablesGroup.visible = isCablesHighlighted;
});

let isDimsVisible = false;
const toggleDimsBtn = document.getElementById('toggle-dims-btn');

toggleDimsBtn.addEventListener('click', () => {
  isDimsVisible = !isDimsVisible;
  dimsGroup.visible = isDimsVisible;
  toggleDimsBtn.classList.toggle('active', isDimsVisible);
});

// toggleTagsBtn removed

// Lighting Presets
let lightingMode = 0;
const lightingModeLabel = document.getElementById('lighting-mode-label');
const toggleLightBtn = document.getElementById('toggle-light-btn');

toggleLightBtn.addEventListener('click', () => {
  lightingMode = (lightingMode + 1) % 3;
  if (lightingMode === 0) {
    scene.background = new THREE.Color(0x07090e);
    scene.fog.color = new THREE.Color(0x07090e);
    keyLight.color = new THREE.Color(0xfff7ed);
    keyLight.intensity = 2.2;
    lightingModeLabel.textContent = 'Studio Dark Lighting';
  } else if (lightingMode === 1) {
    scene.background = new THREE.Color(0x1a1510);
    scene.fog.color = new THREE.Color(0x1a1510);
    keyLight.color = new THREE.Color(0xfde68a);
    keyLight.intensity = 2.6;
    lightingModeLabel.textContent = 'Warm Workshop';
  } else {
    scene.background = new THREE.Color(0x040a14);
    scene.fog.color = new THREE.Color(0x040a14);
    keyLight.color = new THREE.Color(0x38bdf8);
    keyLight.intensity = 2.0;
    lightingModeLabel.textContent = 'Cyber Blueprint';
  }
});

// ==========================================
// 7. RAYCASTING, TOOLTIPS & SPEC MODAL
// ==========================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const specCard = document.getElementById('spec-card');
const hoverTooltip = document.getElementById('hover-tooltip');

const specBadge = document.getElementById('spec-badge');
const specTitle = document.getElementById('spec-title');
const specSubtitle = document.getElementById('spec-subtitle');
const specDims = document.getElementById('spec-dims');
const specLocation = document.getElementById('spec-location');
const specFeatures = document.getElementById('spec-features');
const specNote = document.getElementById('spec-note');
const closeSpecBtn = document.getElementById('close-spec-btn');

function openSpecCard(data) {
  specBadge.textContent = data.category || 'EQUIPMENT';
  specTitle.textContent = data.name;
  specSubtitle.textContent = data.category;
  specDims.textContent = data.dims;
  specLocation.textContent = data.location;
  
  specFeatures.innerHTML = '';
  data.specs.forEach(spec => {
    const li = document.createElement('li');
    li.textContent = spec;
    specFeatures.appendChild(li);
  });

  specNote.textContent = data.note;
  specCard.classList.remove('hidden');
}

closeSpecBtn.addEventListener('click', () => {
  specCard.classList.add('hidden');
});

let hoveredObject = null;

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(deskData.interactiveEquipment, true);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (obj.userData && obj.userData.name) {
      container.style.cursor = 'pointer';
      hoveredObject = obj;
      
      hoverTooltip.querySelector('.tooltip-title').textContent = obj.userData.name;
      hoverTooltip.querySelector('.tooltip-sub').textContent = obj.userData.category;
      hoverTooltip.style.left = `${e.clientX}px`;
      hoverTooltip.style.top = `${e.clientY}px`;
      hoverTooltip.classList.remove('hidden');
      return;
    }
  }

  container.style.cursor = 'default';
  hoveredObject = null;
  hoverTooltip.classList.add('hidden');
});

window.addEventListener('click', () => {
  if (hoveredObject && hoveredObject.userData && hoveredObject.userData.name) {
    openSpecCard(hoveredObject.userData);
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 8. ANIMATION LOOP
// ==========================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // updatePerimeterBadges(); // REMOVED
  renderer.render(scene, camera);
}

animate();
