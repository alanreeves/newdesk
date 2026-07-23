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
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
container.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.15;
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
  addDim(-1.45, 0.02, 0.6, 1.45, 0.02, 0.6, "Total Width: 290 cm");
  addDim(-1.6, 0.76, -0.45, -1.6, 0.76, 0.45, "Depth: 90 cm");
  addDim(1.6, 0, 0, 1.6, 0.76, 0, "Height: 76 cm");

  // Compartment Widths along the front
  addDim(-1.45, 0.02, 0.48, -1.00, 0.02, 0.48, "45cm"); // Left Pedestal
  addDim(-1.00, 0.02, 0.48, -0.40, 0.02, 0.48, "60cm"); // Op 1
  addDim(-0.40, 0.02, 0.48, -0.10, 0.02, 0.48, "30cm"); // PC
  addDim(-0.10, 0.02, 0.48, 0.40, 0.02, 0.48, "50cm");  // Amps
  addDim(0.40, 0.02, 0.48, 1.00, 0.02, 0.48, "60cm");   // Op 2
  addDim(1.00, 0.02, 0.48, 1.45, 0.02, 0.48, "45cm");   // Right Pedestal
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

slidePcBtn.addEventListener('click', () => {
  isPcSlidOut = !isPcSlidOut;
  const targetZ = isPcSlidOut ? 0.45 : 0;
  
  gsap.to(deskData.pcSlideGroup.position, {
    z: targetZ,
    duration: 1.0,
    ease: 'power2.inOut'
  });

  slidePcBtn.classList.toggle('active', isPcSlidOut);
  if (slidePcBtn) slidePcBtn.title = isPcSlidOut ? 'Retract PC Tower' : 'Slide Out PC Tower';
});

let isDrawersOpen = false;
const toggleDrawersBtn = document.getElementById('toggle-drawers-btn');

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
  if (toggleDrawersBtn) toggleDrawersBtn.title = isDrawersOpen ? 'Close Drawers' : 'Open Drawers';
});

let isCablesHighlighted = false;
const toggleCablesBtn = document.getElementById('toggle-cables-btn');

toggleCablesBtn.addEventListener('click', () => {
  isCablesHighlighted = !isCablesHighlighted;
  toggleCablesBtn.classList.toggle('active', isCablesHighlighted);
  deskData.cablesGroup.visible = isCablesHighlighted;
  if (toggleCablesBtn) toggleCablesBtn.title = isCablesHighlighted ? 'Hide Cables' : 'Show Cables';
});

let isLidOpen = false;
const toggleLidBtn = document.getElementById('toggle-lid-btn');

toggleLidBtn.addEventListener('click', () => {
  if (!deskData.trenchLidGroup) return;
  isLidOpen = !isLidOpen;
  
  // Rotate lid around X axis (hinge is at z = -0.41, lid moves backwards when opening)
  // An opening of -Math.PI / 2 radians (90 degrees backwards)
  const targetRotX = isLidOpen ? -Math.PI * 0.45 : 0; 
  
  gsap.to(deskData.trenchLidGroup.rotation, {
    x: targetRotX,
    duration: 1.2,
    ease: 'power3.inOut'
  });

  toggleLidBtn.classList.toggle('active', isLidOpen);
  if (toggleLidBtn) toggleLidBtn.title = isLidOpen ? 'Close Cable Trench' : 'Open Cable Trench';
});

let isDimsVisible = false;
const toggleDimsBtn = document.getElementById('toggle-dims-btn');

toggleDimsBtn.addEventListener('click', () => {
  isDimsVisible = !isDimsVisible;
  dimsGroup.visible = isDimsVisible;
  toggleDimsBtn.classList.toggle('active', isDimsVisible);
});

// toggleTagsBtn removed

let isKeyboardStored = false;
const toggleKeyboardBtn = document.getElementById('toggle-keyboard-btn');

if (toggleKeyboardBtn) {
  toggleKeyboardBtn.addEventListener('click', () => {
    if (!deskData.keyboardGroup || !deskData.keyboardShelfGroup) return;
    
    toggleKeyboardBtn.disabled = true; // disable during animation
    isKeyboardStored = !isKeyboardStored;
    
    const tl = gsap.timeline({
      onComplete: () => {
        toggleKeyboardBtn.disabled = false;
        toggleKeyboardBtn.classList.toggle('active', isKeyboardStored);
        if (toggleKeyboardBtn) toggleKeyboardBtn.title = isKeyboardStored ? 'Retrieve Keyboard' : 'Store Keyboard';
      }
    });

    if (isKeyboardStored) {
      // 1. Shelf slides out
      tl.to(deskData.keyboardShelfGroup.position, { z: 0.45, duration: 0.6, ease: 'power2.out' });
      // 2. Keyboard lifts, moves forward and drops onto shelf
      tl.to(deskData.keyboardGroup.position, { y: 0.05, duration: 0.2, ease: 'power1.out' }, '+=0.1')
        .to(deskData.keyboardGroup.position, { z: 0.37, duration: 0.5, ease: 'power2.inOut' }, '<')
        .to(deskData.keyboardGroup.position, { y: -0.06, duration: 0.3, ease: 'power2.in' });
      // 3. Both slide back under desk
      tl.to(deskData.keyboardShelfGroup.position, { z: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.2')
        .to(deskData.keyboardGroup.position, { z: -0.08, duration: 0.6, ease: 'power2.inOut' }, '<');
    } else {
      // 1. Both slide out
      tl.to(deskData.keyboardShelfGroup.position, { z: 0.45, duration: 0.6, ease: 'power2.out' })
        .to(deskData.keyboardGroup.position, { z: 0.37, duration: 0.6, ease: 'power2.out' }, '<');
      // 2. Keyboard lifts and moves back to desk
      tl.to(deskData.keyboardGroup.position, { y: 0.05, duration: 0.3, ease: 'power1.out' }, '+=0.2')
        .to(deskData.keyboardGroup.position, { z: 0, duration: 0.5, ease: 'power2.inOut' }, '<')
        .to(deskData.keyboardGroup.position, { y: 0, duration: 0.2, ease: 'power2.in' });
      // 3. Shelf slides back under desk
      tl.to(deskData.keyboardShelfGroup.position, { z: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.1');
    }
  });
}

// Lighting Presets
let lightingMode = 0;
const lightingModeLabel = document.getElementById('lighting-mode-label');
const toggleLightBtn = document.getElementById('toggle-light-btn');

let isLightMode = false;
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIconSun = document.getElementById('theme-icon-sun');
const themeIconMoon = document.getElementById('theme-icon-moon');

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    isLightMode = !isLightMode;
    if (isLightMode) {
      themeIconSun.style.display = 'block';
      themeIconMoon.style.display = 'none';
      themeToggleBtn.style.background = 'rgba(255, 255, 255, 0.8)';
      themeToggleBtn.style.color = '#000';
    } else {
      themeIconSun.style.display = 'none';
      themeIconMoon.style.display = 'block';
      themeToggleBtn.style.background = 'rgba(15, 23, 42, 0.6)';
      themeToggleBtn.style.color = '#fff';
    }
    updateLightingAndBackground();
  });
}

function updateLightingAndBackground() {
  let baseBgColor;
  if (isLightMode) {
    baseBgColor = new THREE.Color(0xf1f5f9); // slate-100
    // Adjust keyLight for light mode if needed, but we can keep it as is
  } else {
    if (lightingMode === 0) {
      baseBgColor = new THREE.Color(0x07090e);
      keyLight.color.setHex(0xfff7ed);
      keyLight.intensity = 2.2;
      lightingModeLabel.textContent = 'Studio Dark Lighting';
    } else if (lightingMode === 1) {
      baseBgColor = new THREE.Color(0x1a1510);
      keyLight.color.setHex(0xfde68a);
      keyLight.intensity = 2.6;
      lightingModeLabel.textContent = 'Warm Workshop';
    } else {
      baseBgColor = new THREE.Color(0x040a14);
      keyLight.color.setHex(0x38bdf8);
      keyLight.intensity = 2.0;
      lightingModeLabel.textContent = 'Cyber Blueprint';
    }
  }

  const slider = document.getElementById('wood-shade-slider');
  const shadeVal = slider ? parseFloat(slider.value) : 1.0;
  
  // As shadeVal goes down (towards Mahogany at 0.0), darknessFactor goes up to 1.0
  const darknessFactor = 1.0 - shadeVal; 
  
  // Lerp the background towards a lighter neutral grey to maintain contrast with dark woods
  // If in light mode, no need to lighten it further since it's already white
  const lightBgColor = isLightMode ? new THREE.Color(0xf1f5f9) : new THREE.Color(0x6b7280); 
  const finalBgColor = new THREE.Color().copy(baseBgColor).lerp(lightBgColor, darknessFactor * 0.5); // Max 50% blend
  
  scene.background = finalBgColor;
  scene.fog.color = finalBgColor;
  
  if (isLightMode) {
    floorMat.color.setHex(0xe2e8f0);
    if (gridHelper) {
      gridHelper.material.opacity = 0.3;
      gridHelper.material.transparent = true;
    }
  } else {
    floorMat.color.setHex(0x090b10);
    if (gridHelper) {
      gridHelper.material.opacity = 1.0;
    }
  }
}

toggleLightBtn.addEventListener('click', () => {
  lightingMode = (lightingMode + 1) % 3;
  updateLightingAndBackground();
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Fix for iOS Safari initial layout bug
setTimeout(onWindowResize, 100);
setTimeout(onWindowResize, 500);

const woodShadeSlider = document.getElementById('wood-shade-slider');
const woodTypeLabel = document.getElementById('wood-type-label');
const timberBanner = document.getElementById('timber-banner');
const timberBannerText = document.getElementById('timber-banner-text');
const timberColorSwatch = document.getElementById('timber-color-swatch');
let timberBannerTimeout;

if (woodShadeSlider && woodTypeLabel) {
  const timberTypes = [
    { val: 0.00, color: new THREE.Color(0x4a1c15), name: "Deep Mahogany" },
    { val: 0.33, color: new THREE.Color(0x6b3e2e), name: "Dark Walnut" },
    { val: 0.66, color: new THREE.Color(0xba7c54), name: "Warm Teak" },
    { val: 1.00, color: new THREE.Color(0xffffff), name: "Light Oak" }
  ];

  woodShadeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    
    // Find the two stops to interpolate between
    let lower = timberTypes[0];
    let upper = timberTypes[timberTypes.length - 1];
    
    for (let i = 0; i < timberTypes.length - 1; i++) {
      if (val >= timberTypes[i].val && val <= timberTypes[i+1].val) {
        lower = timberTypes[i];
        upper = timberTypes[i+1];
        break;
      }
    }
    
    const range = upper.val - lower.val;
    const t = range === 0 ? 0 : (val - lower.val) / range;
    
    // Interpolate color
    const blendedColor = new THREE.Color().copy(lower.color).lerp(upper.color, t);
    deskData.oakMaterial.color.copy(blendedColor);
    
    // Update label (use closest stop for the name)
    const closest = (val - lower.val) < (upper.val - val) ? lower : upper;
    woodTypeLabel.textContent = closest.name;
    
    // Update and show floating banner
    if (timberBanner && timberBannerText && timberColorSwatch) {
      timberBannerText.textContent = closest.name;
      timberColorSwatch.style.backgroundColor = '#' + blendedColor.getHexString();
      timberBanner.style.opacity = '1';
      
      clearTimeout(timberBannerTimeout);
      timberBannerTimeout = setTimeout(() => {
        timberBanner.style.opacity = '0';
      }, 1500);
    }
    
    // Update lighting contrast
    updateLightingAndBackground();
  });
}

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
