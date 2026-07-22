import * as THREE from 'three';

/**
 * Creates Light Oak texture matching the user's wood swatch image with BOLD, HIGH-CONTRAST grain:
 * - Base warm pale blonde oak tone (#dfc3a1)
 * - Dark brown (#7a4e28 & #5c391b) horizontal grain lines and cathedral arches
 * - Crisp, visible parabolic V-shaped flame loops and oval wood grain eyes
 */
function createLightOakTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Base warm pale blonde wood tone
  ctx.fillStyle = '#dfc3a1';
  ctx.fillRect(0, 0, 2048, 2048);

  // Gradient shifts across boards
  const grad = ctx.createLinearGradient(0, 0, 0, 2048);
  grad.addColorStop(0.0, '#dec09d');
  grad.addColorStop(0.35, '#ebd1b2');
  grad.addColorStop(0.7, '#dcb892');
  grad.addColorStop(1.0, '#e3c6a6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 2048);

  // Pseudo-noise function for natural wave distortion
  function noise(x, y) {
    return Math.sin(x * 0.01 + Math.cos(y * 0.01)) * 
           Math.sin(y * 0.015 + Math.cos(x * 0.007)) + 
           0.5 * Math.sin(x * 0.03 + y * 0.03);
  }

  // 1. Primary horizontal grain lines
  for (let y = 0; y < 2048; y += 5 + Math.random() * 6) {
    ctx.lineWidth = 1.0 + Math.random() * 2.0;
    ctx.strokeStyle = y % 15 < 5 ? '#7a4e28' : '#6b421f';
    ctx.globalAlpha = 0.4 + Math.random() * 0.4;
    ctx.beginPath();
    
    for (let x = 0; x <= 2048; x += 20) {
      const n = noise(x, y);
      const waveY = y + n * 30 + Math.sin(x * 0.002) * 40;
      if (x === 0) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }

  // 2. Parabolic Cathedral Arches
  const cathedralCenters = [];
  for(let i=0; i<8; i++) {
    cathedralCenters.push({
      cx: Math.random() * 2048,
      cy: Math.random() * 2048,
      rx: 300 + Math.random() * 500,
      ry: 100 + Math.random() * 200
    });
  }

  cathedralCenters.forEach(c => {
    for (let ring = 0; ring < 35; ring++) {
      ctx.lineWidth = 1.5 + Math.random() * 1.5;
      ctx.strokeStyle = ring % 3 === 0 ? '#6e4420' : '#8f623a';
      ctx.globalAlpha = 0.4 + Math.random() * 0.3;
      ctx.beginPath();
      const rX = c.rx - ring * 12;
      const rY = c.ry - ring * 4;
      if (rX > 10 && rY > 3) {
        for (let angle = Math.PI * 0.05; angle < Math.PI * 0.95; angle += 0.05) {
          const nx = c.cx + Math.cos(angle) * rX;
          const ny = c.cy + Math.sin(angle) * rY;
          const distY = ny + noise(nx, ny) * 12;
          if (angle === Math.PI * 0.05) ctx.moveTo(nx, distY);
          else ctx.lineTo(nx, distY);
        }
        ctx.stroke();
      }
    }
  });

  // 3. Oval wood grain eyes (knots)
  ctx.globalAlpha = 0.6;
  for (let k = 0; k < 6; k++) {
    const kx = Math.random() * 2048;
    const ky = Math.random() * 2048;
    for (let eye = 0; eye < 10; eye++) {
      ctx.lineWidth = 1.5 + Math.random();
      ctx.strokeStyle = '#5c391b';
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const rX = 60 - eye * 6;
        const rY = 15 - eye * 1.5;
        if (rX <= 0 || rY <= 0) continue;
        const nx = kx + Math.cos(angle) * rX;
        const ny = ky + Math.sin(angle) * rY;
        const distY = ny + noise(nx, ny) * 4;
        if (angle === 0) ctx.moveTo(nx, distY);
        else ctx.lineTo(nx, distY);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // 4. Dark Wood Pores
  ctx.fillStyle = '#4a2c13';
  ctx.globalAlpha = 0.25;
  for (let p = 0; p < 25000; p++) {
    const px = Math.random() * 2048;
    const py = Math.random() * 2048;
    ctx.fillRect(px, py, 6 + Math.random() * 12, 1.0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.0, 1.0);
  return texture;
}

function createMixerSurfaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1c1f26';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.fillStyle = '#12141a';
  ctx.fillRect(0, 0, 1024, 180);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px sans-serif';
  ctx.fillText('ALLEN & HEATH', 40, 65);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('Qu-24', 40, 110);

  ctx.fillStyle = '#090b10';
  ctx.fillRect(520, 25, 450, 250);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(520, 25, 450, 250);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(530, 35, 430, 190);
  const colors = ['#10b981', '#10b981', '#10b981', '#fbbf24', '#f43f5e'];
  for (let b = 0; b < 30; b++) {
    const barHeight = Math.random() * 140 + 20;
    const x = 540 + b * 14;
    const y = 220 - barHeight;
    ctx.fillStyle = colors[Math.floor((barHeight / 160) * colors.length)];
    ctx.fillRect(x, y, 10, barHeight);
  }

  for (let f = 0; f < 24; f++) {
    const fx = 35 + f * 40;
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(fx + 15, 380, 6, 540);

    ctx.fillStyle = f % 4 === 0 ? '#f43f5e' : '#38bdf8';
    ctx.fillRect(fx + 6, 310, 24, 14);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(fx + 6, 340, 24, 14);

    ctx.fillStyle = f === 23 ? '#f43f5e' : (f > 20 ? '#fbbf24' : '#e2e8f0');
    const faderY = 440 + Math.sin(f * 0.75) * 140;
    ctx.fillRect(fx + 2, faderY, 32, 26);
    ctx.fillStyle = '#000000';
    ctx.fillRect(fx + 4, faderY + 11, 28, 4);
  }

  return new THREE.CanvasTexture(canvas);
}

function createDAWScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f141d';
  ctx.fillRect(0, 0, 1024, 576);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 1024, 40);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('PRO SOUND & VIDEO WORKSTATION • MULTITRACK DAW', 20, 26);

  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(420, 40, 3, 536);

  const trackColors = ['#38bdf8', '#fbbf24', '#10b981', '#a855f7', '#ec4899', '#f97316'];
  for (let i = 0; i < 6; i++) {
    const y = 50 + i * 84;
    ctx.fillStyle = '#161e2e';
    ctx.fillRect(0, y, 1024, 78);
    ctx.fillStyle = trackColors[i];
    ctx.fillRect(0, y, 8, 78);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`CH ${i + 1} - ${['MAIN PODIUM MIC', 'VIDEO AUX IN', 'SYNTH L/R', 'BGM BED', 'PRESENTER WIRELESS', 'MASTER FEED'][i]}`, 18, y + 28);
    
    for (let c = 0; c < 3; c++) {
      const cx = 200 + c * 260 + (i % 2) * 40;
      const cw = 190 + Math.random() * 50;
      ctx.fillStyle = trackColors[i];
      ctx.globalAlpha = 0.3;
      ctx.fillRect(cx, y + 8, cw, 62);
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = trackColors[i];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let w = 0; w < cw; w += 4) {
        const wy = y + 39 + (Math.random() - 0.5) * 44;
        if (w === 0) ctx.moveTo(cx + w, wy);
        else ctx.lineTo(cx + w, wy);
      }
      ctx.stroke();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

function createSecondaryScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a0e17';
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('SYSTEM & NETWORK', 25, 45);

  ctx.fillStyle = '#161e2e';
  ctx.fillRect(25, 65, 462, 190);
  ctx.fillStyle = '#10b981';
  ctx.font = '14px monospace';
  ctx.fillText('DANTE AUDIO NETWORK: ONLINE', 40, 100);
  ctx.fillText('SAMPLING RATE: 48kHz / 24-bit', 40, 130);
  ctx.fillText('SYSTEM LATENCY: 1.0 ms', 40, 160);

  ctx.fillStyle = '#161e2e';
  ctx.fillRect(25, 275, 462, 200);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('TOWER PC TEMP: 37°C (FAN 1200 RPM)', 40, 310);
  ctx.fillText('INDUCTION LOOP AMP: 100% READY', 40, 345);
  ctx.fillText('HOUSE SPEAKER AMP: OPTIMAL', 40, 380);

  return new THREE.CanvasTexture(canvas);
}

export function buildDeskScene() {
  const rootGroup = new THREE.Group();
  
  const textureLoader = new THREE.TextureLoader();
  const lightOakTexture = textureLoader.load('/wood_texture.png');
  lightOakTexture.wrapS = THREE.RepeatWrapping;
  lightOakTexture.wrapT = THREE.RepeatWrapping;
  lightOakTexture.repeat.set(1.0, 1.0);
  lightOakTexture.colorSpace = THREE.SRGBColorSpace;

  const oakMaterial = new THREE.MeshStandardMaterial({
    map: lightOakTexture,
    roughness: 0.45,
    metalness: 0.02
  });
  
  const darkMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f232d,
    roughness: 0.3,
    metalness: 0.8
  });

  const blackPlasticMaterial = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.6,
    metalness: 0.1
  });

  const darkHandleMaterial = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.2,
    metalness: 0.9
  });

  const animatedGroups = {
    pcSlideGroup: new THREE.Group(),
    leftDrawersGroup: new THREE.Group(),
    rightDrawersGroup: new THREE.Group(),
    cablesGroup: new THREE.Group()
  };

  const interactiveEquipment = [];
  const equipmentPins = [];

  const W_TOTAL = 3.10;
  const D_TOTAL = 0.90;
  const H_DESK = 0.76;
  const THICKNESS = 0.03;

  // 1. SCULPTED LIGHT OAK DESKTOP WITH REAR CABLE TRENCH
  const desktopShape = new THREE.Shape();
  const halfW = W_TOTAL / 2;
  const halfD = D_TOTAL / 2;

  desktopShape.moveTo(-1.51, -halfD);
  desktopShape.lineTo(1.51, -halfD);
  desktopShape.quadraticCurveTo(halfW, -halfD, halfW, -halfD + 0.04);
  
  desktopShape.lineTo(halfW, halfD - 0.04);
  desktopShape.quadraticCurveTo(halfW, halfD, 1.51, halfD);

  // Sculpted Ergonomic Front Edge Profile
  desktopShape.bezierCurveTo(1.20, halfD, 0.90, halfD - 0.09, 0.55, halfD - 0.08);
  desktopShape.bezierCurveTo(0.25, halfD - 0.07, 0.10, halfD - 0.01, 0.0, halfD - 0.01);
  desktopShape.bezierCurveTo(-0.10, halfD - 0.01, -0.25, halfD - 0.07, -0.55, halfD - 0.08);
  desktopShape.bezierCurveTo(-0.90, halfD - 0.09, -1.20, halfD, -1.51, halfD);

  desktopShape.quadraticCurveTo(-halfW, halfD, -halfW, halfD - 0.04);
  desktopShape.lineTo(-halfW, -halfD + 0.04);
  desktopShape.quadraticCurveTo(-halfW, -halfD, -1.51, -halfD);

  // Rear Cable Tidy Trench Cutout
  const trenchHole = new THREE.Path();
  trenchHole.moveTo(-1.27, -0.41);
  trenchHole.lineTo(1.27, -0.41);
  trenchHole.quadraticCurveTo(1.30, -0.41, 1.30, -0.38);
  trenchHole.lineTo(1.30, -0.34);
  trenchHole.quadraticCurveTo(1.30, -0.31, 1.27, -0.31);
  trenchHole.lineTo(-1.27, -0.31);
  trenchHole.quadraticCurveTo(-1.30, -0.31, -1.30, -0.34);
  trenchHole.lineTo(-1.30, -0.38);
  trenchHole.quadraticCurveTo(-1.30, -0.41, -1.27, -0.41);

  desktopShape.holes.push(trenchHole);

  const extrudeSettings = {
    steps: 1,
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 3
  };

  const desktopGeo = new THREE.ExtrudeGeometry(desktopShape, extrudeSettings);
  desktopGeo.rotateX(Math.PI / 2);

  // Assign UVs to ExtrudeGeometry to ensure wood grain renders crisp and un-stretched
  const posAttr = desktopGeo.attributes.position;
  const uvAttr = desktopGeo.attributes.uv;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    // Map world X, Z to UV (scale down to stretch texture and reduce tiling)
    uvAttr.setXY(i, (x + 1.55) * 0.7, (z + 0.45) * 0.7);
  }
  uvAttr.needsUpdate = true;

  const desktopMesh = new THREE.Mesh(desktopGeo, oakMaterial);
  desktopMesh.position.set(0, H_DESK, 0);
  desktopMesh.castShadow = true;
  desktopMesh.receiveShadow = true;
  rootGroup.add(desktopMesh);

  // Recessed Floor Base for Cable Tidy Trench
  const trenchFloorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.62, 0.015, 0.12),
    darkMetalMaterial
  );
  trenchFloorMesh.position.set(0, H_DESK - THICKNESS - 0.04, -0.36);
  rootGroup.add(trenchFloorMesh);

  const trenchBackWall = new THREE.Mesh(
    new THREE.BoxGeometry(2.62, 0.05, 0.01),
    darkMetalMaterial
  );
  trenchBackWall.position.set(0, H_DESK - 0.02, -0.415);
  rootGroup.add(trenchBackWall);

  [-1.0, 0, 1.0].forEach(gx => {
    const grommet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.02, 32),
      blackPlasticMaterial
    );
    grommet.position.set(gx, H_DESK - THICKNESS - 0.03, -0.36);
    rootGroup.add(grommet);
  });

  const plinthMesh = new THREE.Mesh(
    new THREE.BoxGeometry(W_TOTAL, 0.035, D_TOTAL - 0.04),
    oakMaterial
  );
  plinthMesh.position.set(0, 0.0175, 0);
  rootGroup.add(plinthMesh);

  const verticalDivs = [-1.55, -1.10, -0.45, -0.15, 0.45, 1.10, 1.55];
  verticalDivs.forEach(x => {
    const vMesh = new THREE.Mesh(
      new THREE.BoxGeometry(THICKNESS, H_DESK - 0.035 - THICKNESS, D_TOTAL - 0.04),
      oakMaterial
    );
    vMesh.position.set(x, (H_DESK + 0.035) / 2, 0);
    vMesh.castShadow = true;
    vMesh.receiveShadow = true;
    rootGroup.add(vMesh);
  });

  const backLeft = new THREE.Mesh(new THREE.BoxGeometry(0.45, H_DESK - 0.035, THICKNESS), oakMaterial);
  backLeft.position.set(-1.325, H_DESK / 2, -D_TOTAL / 2 + THICKNESS / 2);
  rootGroup.add(backLeft);

  const backRight = new THREE.Mesh(new THREE.BoxGeometry(0.45, H_DESK - 0.035, THICKNESS), oakMaterial);
  backRight.position.set(1.325, H_DESK / 2, -D_TOTAL / 2 + THICKNESS / 2);
  rootGroup.add(backRight);

  // 2. DRAWER UNITS
  const buildPedestalDrawers = (centerX, groupRef) => {
    const drawerH = (H_DESK - 0.05 - THICKNESS) / 3;
    for (let i = 0; i < 3; i++) {
      const drawerY = 0.035 + drawerH * i + drawerH / 2;
      const frontMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.44 - THICKNESS * 2, drawerH - 0.008, THICKNESS),
        oakMaterial
      );
      frontMesh.position.set(centerX, drawerY, D_TOTAL / 2 - THICKNESS / 2);
      frontMesh.castShadow = true;
      groupRef.add(frontMesh);

      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.014, 0.02),
        darkHandleMaterial
      );
      handle.position.set(centerX, drawerY, D_TOTAL / 2 + 0.012);
      groupRef.add(handle);

      if (i === 2) {
        const lock = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.005, 16),
          darkMetalMaterial
        );
        lock.rotation.x = Math.PI / 2;
        lock.position.set(centerX + 0.14, drawerY + 0.05, D_TOTAL / 2 + 0.002);
        groupRef.add(lock);
      }
    }
  };

  buildPedestalDrawers(-1.325, animatedGroups.leftDrawersGroup);
  buildPedestalDrawers(1.325, animatedGroups.rightDrawersGroup);
  rootGroup.add(animatedGroups.leftDrawersGroup);
  rootGroup.add(animatedGroups.rightDrawersGroup);

  // 3. UNDERDESK CENTER-LEFT: SLIDING TOWER PC
  const railL = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.02, D_TOTAL - 0.1), darkMetalMaterial);
  railL.position.set(-0.43, 0.06, 0);
  const railR = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.02, D_TOTAL - 0.1), darkMetalMaterial);
  railR.position.set(-0.17, 0.06, 0);
  rootGroup.add(railL);
  rootGroup.add(railR);

  const pcTray = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.018, D_TOTAL - 0.12),
    darkMetalMaterial
  );
  pcTray.position.set(-0.30, 0.06, 0);
  animatedGroups.pcSlideGroup.add(pcTray);

  const pcChassis = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.48, 0.46),
    blackPlasticMaterial
  );
  pcChassis.position.set(-0.30, 0.07 + 0.24, 0);
  pcChassis.castShadow = true;
  animatedGroups.pcSlideGroup.add(pcChassis);

  const pcMeshFront = new THREE.Mesh(
    new THREE.BoxGeometry(0.21, 0.46, 0.008),
    darkMetalMaterial
  );
  pcMeshFront.position.set(-0.30, 0.07 + 0.24, 0.231);
  animatedGroups.pcSlideGroup.add(pcMeshFront);

  [-0.30].forEach(px => {
    [0.22, 0.38].forEach(py => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.065, 0.006, 16, 32),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      ring.position.set(px, py, 0.235);
      animatedGroups.pcSlideGroup.add(ring);
    });
  });

  pcChassis.userData = {
    id: 'pc_tower',
    name: 'Workstation Tower PC',
    category: 'COMPUTING',
    dims: '220mm (W) x 460mm (D) x 480mm (H)',
    location: 'Sliding Pull-out Bay (-0.30m Center-Left)',
    specs: [
      'Heavy-duty ball-bearing slide rails (slides forwards and backwards)',
      'Front cool air intake & rear warm air exhaust clearance',
      'Intel i9 Workstation, 64GB RAM, Dual Dante Audio PCIe interfaces'
    ],
    note: 'Unit slides smoothly forward and backward for quick rear maintenance.'
  };
  interactiveEquipment.push(pcChassis);
  equipmentPins.push({ userData: pcChassis.userData, worldPos: new THREE.Vector3(-0.30, 0.45, 0.20) });
  rootGroup.add(animatedGroups.pcSlideGroup);

  // 4. UNDERDESK CENTER-RIGHT: RACK EQUIPMENT BAY
  const rackRailL = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.62, 0.02), darkMetalMaterial);
  rackRailL.position.set(-0.13, 0.36, D_TOTAL / 2 - 0.08);
  const rackRailR = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.62, 0.02), darkMetalMaterial);
  rackRailR.position.set(0.43, 0.36, D_TOTAL / 2 - 0.08);
  rootGroup.add(rackRailL);
  rootGroup.add(rackRailR);

  const rackShelf = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, THICKNESS, D_TOTAL - 0.12),
    oakMaterial
  );
  rackShelf.position.set(0.15, 0.22, 0);
  rootGroup.add(rackShelf);

  const indAmpMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.088, 0.36), darkMetalMaterial);
  indAmpMesh.position.set(0.15, 0.54, 0.08);
  indAmpMesh.castShadow = true;

  const indAmpFace = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.088, 0.008), blackPlasticMaterial);
  indAmpFace.position.set(0.15, 0.54, 0.261);

  const indDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.022, 0.004), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
  indDisplay.position.set(0.04, 0.54, 0.266);

  indAmpMesh.userData = {
    id: 'induction_amp',
    name: 'Induction Loop Amplifier',
    category: 'ASSISTIVE AUDIO',
    dims: '19" Rack Mount (2U) • 482mm x 360mm x 88mm',
    location: 'Underdesk Central Rack Bay (Upper Slot)',
    specs: ['Drives perimeter hearing loop wire for hearing aid compatibility', 'Convection cooled with front ventilation grills'],
    note: 'Ensures accessibility compliance for hearing-impaired attendees.'
  };
  interactiveEquipment.push(indAmpMesh);
  equipmentPins.push({ userData: indAmpMesh.userData, worldPos: new THREE.Vector3(0.15, 0.54, 0.28) });
  rootGroup.add(indAmpMesh);
  rootGroup.add(indAmpFace);
  rootGroup.add(indDisplay);

  const houseAmpMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.088, 0.38), darkMetalMaterial);
  houseAmpMesh.position.set(0.15, 0.42, 0.08);
  houseAmpMesh.castShadow = true;

  const houseAmpFace = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.088, 0.008), blackPlasticMaterial);
  houseAmpFace.position.set(0.15, 0.42, 0.261);

  const houseMeters = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.026, 0.004), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  houseMeters.position.set(0.24, 0.42, 0.266);

  houseAmpMesh.userData = {
    id: 'house_amp',
    name: 'House Loudspeaker Amplifier',
    category: 'AUDIO POWER',
    dims: '19" Rack Mount (2U) • 482mm x 380mm x 88mm',
    location: 'Underdesk Central Rack Bay (Middle Slot)',
    specs: ['2x 1200W Class-D Power Amplifier for main speakers', 'Forced-air front-to-back cooling system'],
    note: 'Powers main studio and house loudspeakers.'
  };
  interactiveEquipment.push(houseAmpMesh);
  equipmentPins.push({ userData: houseAmpMesh.userData, worldPos: new THREE.Vector3(0.15, 0.42, 0.28) });
  rootGroup.add(houseAmpMesh);
  rootGroup.add(houseAmpFace);
  rootGroup.add(houseMeters);

  const pduMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.044, 0.08), blackPlasticMaterial);
  pduMesh.position.set(0.15, 0.28, 0.20);
  const pduSwitch = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.022, 0.006), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
  pduSwitch.position.set(-0.06, 0.28, 0.244);

  pduMesh.userData = {
    id: 'power_strip',
    name: 'Rack Power Distribution Unit (PDU)',
    category: 'POWER MANAGEMENT',
    dims: '1U Rack Strip • 8 AC Outlets with Surge Protection',
    location: 'Mounted under central rack shelf',
    specs: ['Illuminated master power rocker switch', 'Isolated surge protection feeding main power cables'],
    note: 'Keeps high-voltage power distribution isolated from audio lines.'
  };
  interactiveEquipment.push(pduMesh);
  equipmentPins.push({ userData: pduMesh.userData, worldPos: new THREE.Vector3(0.15, 0.28, 0.24) });
  rootGroup.add(pduMesh);
  rootGroup.add(pduSwitch);

  // 5. TOP DESK EQUIPMENT
  const mixerMat = new THREE.MeshStandardMaterial({
    map: createMixerSurfaceTexture(),
    roughness: 0.4,
    metalness: 0.3
  });

  const mixerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.632, 0.11, 0.50), mixerMat);
  mixerMesh.position.set(0.82, H_DESK + 0.055, 0.02);
  mixerMesh.rotation.x = -0.12;
  mixerMesh.castShadow = true;

  mixerMesh.userData = {
    id: 'qu24_mixer',
    name: 'Allen & Heath Qu-24 Digital Mixer',
    category: 'AUDIO CONSOLE',
    dims: '632 mm (W) x 500 mm (D) x 186 mm (H)',
    location: 'Flat Desktop Surface (Right Operator)',
    specs: [
      '24 AnalogueIQ™ motorized faders across 3 layers',
      '800x480 High-contrast touchscreen display with real-time RTA',
      'USB multitrack recording & Dante network integration'
    ],
    note: 'Primary console for live sound, broadcast feed, and audio multitrack mixing.'
  };
  interactiveEquipment.push(mixerMesh);
  equipmentPins.push({ userData: mixerMesh.userData, worldPos: new THREE.Vector3(0.82, H_DESK + 0.16, 0.02) });
  rootGroup.add(mixerMesh);

  const mainMonitor = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.41, 0.02), blackPlasticMaterial);
  mainMonitor.position.set(-0.85, H_DESK + 0.24, -0.15);
  mainMonitor.castShadow = true;

  const mainDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(0.70, 0.39),
    new THREE.MeshBasicMaterial({ map: createDAWScreenTexture() })
  );
  mainDisplay.position.set(-0.85, H_DESK + 0.24, -0.139);

  const mainStand = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 16), darkMetalMaterial);
  mainStand.position.set(-0.85, H_DESK + 0.09, -0.15);

  const mainStandBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.008, 32), darkMetalMaterial);
  mainStandBase.position.set(-0.85, H_DESK + 0.004, -0.15);

  mainMonitor.userData = {
    id: 'main_monitor',
    name: '32" Primary Widescreen Display',
    category: 'VIDEO / DAW MONITOR',
    dims: '32-inch Widescreen (16:9 Ratio)',
    location: 'Flat Desktop Surface (Left Workstation)',
    specs: ['Displays DAW multitrack audio waveform timeline & video UI', 'Mounted on desktop stand'],
    note: 'Positioned at ergonomic eye-level for primary video/DAW operator.'
  };
  interactiveEquipment.push(mainMonitor);
  equipmentPins.push({ userData: mainMonitor.userData, worldPos: new THREE.Vector3(-0.85, H_DESK + 0.38, -0.15) });
  rootGroup.add(mainMonitor);
  rootGroup.add(mainDisplay);
  rootGroup.add(mainStand);
  rootGroup.add(mainStandBase);

  const secMonitor = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.15, 0.015), blackPlasticMaterial);
  secMonitor.position.set(-0.34, H_DESK + 0.14, -0.12);
  secMonitor.rotation.y = -0.22;

  const secDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.14),
    new THREE.MeshBasicMaterial({ map: createSecondaryScreenTexture() })
  );
  secDisplay.position.set(-0.34, H_DESK + 0.14, -0.111);
  secDisplay.rotation.y = -0.22;

  secMonitor.userData = {
    id: 'secondary_monitor',
    name: '10" Auxiliary Status Monitor',
    category: 'TELEMETRY',
    dims: '10.1-inch IPS Display',
    location: 'Mounted directly right of main monitor',
    specs: ['Dedicated Dante network clocking & amplifier telemetry', 'Compact auxiliary touchscreen display'],
    note: 'Provides real-time system monitoring without taking main screen space.'
  };
  interactiveEquipment.push(secMonitor);
  equipmentPins.push({ userData: secMonitor.userData, worldPos: new THREE.Vector3(-0.34, H_DESK + 0.22, -0.12) });
  rootGroup.add(secMonitor);
  rootGroup.add(secDisplay);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.012, 0.13), blackPlasticMaterial);
  keyboard.position.set(-0.85, H_DESK + 0.008, 0.18);

  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.024, 0.10), blackPlasticMaterial);
  mouse.position.set(-0.52, H_DESK + 0.014, 0.18);

  keyboard.userData = {
    id: 'peripherals',
    name: 'Wireless Keyboard & Mouse',
    category: 'PERIPHERALS',
    dims: 'Full-size Wireless Keyboard & Precision Mouse',
    location: 'Flat Desktop Surface in front of 32" Primary Monitor',
    specs: ['2.4GHz low-latency wireless connection with rechargeable batteries'],
    note: 'Positioned comfortably for operator 1 desk control.'
  };
  interactiveEquipment.push(keyboard);
  equipmentPins.push({ userData: keyboard.userData, worldPos: new THREE.Vector3(-0.85, H_DESK + 0.05, 0.18) });
  rootGroup.add(keyboard);
  rootGroup.add(mouse);

  const micRx = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.044, 0.18), darkMetalMaterial);
  micRx.position.set(-0.04, H_DESK + 0.022, -0.18);

  const rxLed = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.004), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  rxLed.position.set(-0.07, H_DESK + 0.022, -0.088);

  [-0.11, 0.03].forEach(ax => {
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.16, 12), blackPlasticMaterial);
    ant.position.set(ax, H_DESK + 0.10, -0.24);
    ant.rotation.x = -0.2;
    rootGroup.add(ant);
  });

  micRx.userData = {
    id: 'mic_receiver',
    name: 'Wireless Microphone Receiver',
    category: 'WIRELESS AUDIO',
    dims: 'Half-Rack Desktop Chassis • 210mm x 180mm x 44mm',
    location: 'Flat Desktop Surface (Center Rear)',
    specs: ['Digital 24-bit / 48kHz wireless receiver with dual whip antennas'],
    note: 'Receives clean wireless mic audio from presenters.'
  };
  interactiveEquipment.push(micRx);
  equipmentPins.push({ userData: micRx.userData, worldPos: new THREE.Vector3(-0.04, H_DESK + 0.10, -0.18) });
  rootGroup.add(micRx);
  rootGroup.add(rxLed);

  const router = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.038, 0.16), blackPlasticMaterial);
  router.position.set(0.22, H_DESK + 0.019, -0.18);

  const routerLeds = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.008, 0.004), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
  routerLeds.position.set(0.22, H_DESK + 0.02, -0.098);

  [-0.08, -0.02, 0.02, 0.08].forEach((rx, idx) => {
    const rAnt = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.14, 12), blackPlasticMaterial);
    rAnt.position.set(0.22 + rx, H_DESK + 0.08, -0.25);
    rAnt.rotation.x = -0.15;
    rAnt.rotation.z = (idx - 1.5) * 0.1;
    rootGroup.add(rAnt);
  });

  router.userData = {
    id: 'network_router',
    name: 'Gigabit Managed Network Router',
    category: 'NETWORKING',
    dims: '220mm (W) x 160mm (D) x 38mm (H)',
    location: 'Flat Desktop Surface (Center Rear)',
    specs: ['Gigabit Ethernet switch with Dante VLAN network routing & Wi-Fi 6'],
    note: 'Hub connecting PC, Mixer, Dante matrix, and remote controllers.'
  };
  interactiveEquipment.push(router);
  equipmentPins.push({ userData: router.userData, worldPos: new THREE.Vector3(0.22, H_DESK + 0.10, -0.18) });
  rootGroup.add(router);
  rootGroup.add(routerLeds);

  const powerTray = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.04, 0.08), darkMetalMaterial);
  powerTray.position.set(-0.65, H_DESK - THICKNESS - 0.02, -0.36);

  const netTray = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.04, 0.08), darkMetalMaterial);
  netTray.position.set(0.65, H_DESK - THICKNESS - 0.02, -0.36);

  const powerMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const dataMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  for (let c = 0; c < 4; c++) {
    const curveP = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.20 + c * 0.1, H_DESK - 0.04, -0.36),
      new THREE.Vector3(-0.70, H_DESK - 0.04, -0.36),
      new THREE.Vector3(-0.30, 0.28, -0.20)
    ]);
    animatedGroups.cablesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curveP, 24, 0.005, 8, false), powerMat));

    const curveD = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.20 - c * 0.1, H_DESK - 0.04, -0.36),
      new THREE.Vector3(0.50, H_DESK - 0.04, -0.36),
      new THREE.Vector3(0.22, H_DESK + 0.01, -0.18)
    ]);
    animatedGroups.cablesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curveD, 24, 0.005, 8, false), dataMat));
  }

  powerTray.userData = {
    id: 'cable_trays',
    name: 'Recessed Cable Tidy Trench & Trays',
    category: 'INFRASTRUCTURE',
    dims: 'Recessed top trench (Power Tray Left, Data Tray Right)',
    location: 'Cutout channel running along rear edge of desktop',
    specs: ['Separates AC Power lines (red) from Network/Data lines (blue)', 'Allows cables to drop cleanly through grommets under desk'],
    note: 'Maintains flat, clutter-free desktop work surface.'
  };
  interactiveEquipment.push(powerTray);
  equipmentPins.push({ userData: powerTray.userData, worldPos: new THREE.Vector3(0, H_DESK, -0.36) });

  rootGroup.add(powerTray);
  rootGroup.add(netTray);
  rootGroup.add(animatedGroups.cablesGroup);

  return {
    rootGroup,
    pcSlideGroup: animatedGroups.pcSlideGroup,
    leftDrawersGroup: animatedGroups.leftDrawersGroup,
    rightDrawersGroup: animatedGroups.rightDrawersGroup,
    cablesGroup: animatedGroups.cablesGroup,
    interactiveEquipment,
    equipmentPins
  };
}
