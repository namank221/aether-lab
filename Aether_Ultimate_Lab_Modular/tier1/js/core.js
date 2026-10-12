/* ==========================================================================
   2. THREE.JS UNIFIED SCENE & HIGH-FIDELITY ASSETS
   ========================================================================== */
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020408, 0.0012);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.set(0, 0, 180);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxDistance = 1200;
controls.minDistance = 2;

// Lights
const ambientLight = new THREE.AmbientLight(0x0a1428, 1.8);
scene.add(ambientLight);

const mainSpot = new THREE.SpotLight(0x00f0ff, 4, 800, Math.PI / 4, 0.4);
mainSpot.position.set(120, 160, 140);
scene.add(mainSpot);

const rimLight = new THREE.PointLight(0xff003c, 2.5, 500);
rimLight.position.set(-120, -100, -100);
scene.add(rimLight);

const goldLight = new THREE.PointLight(0xffd700, 2.2, 400);
goldLight.position.set(0, 120, -80);
scene.add(goldLight);

// Universal Deep Nebula Starfield
const bgStarCount = 4000;
const bgStarGeo = new THREE.BufferGeometry();
const bgStarPos = new Float32Array(bgStarCount * 3);
for (let i = 0; i < bgStarCount * 3; i++) {
  bgStarPos[i] = (Math.random() - 0.5) * 3500;
}
bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgStarPos, 3));
const bgStarMat = new THREE.PointsMaterial({ color: 0x88bbff, size: 1.2, transparent: true, opacity: 0.7 });
const bgStars = new THREE.Points(bgStarGeo, bgStarMat);
scene.add(bgStars);

// Slide Scene Groups
const groups = {};
for (let i = 1; i <= 10; i++) {
  groups[i] = new THREE.Group();
  scene.add(groups[i]);
  groups[i].visible = (i === 1);
}

// CFTD Precision Calibration: Lab Scale Factors (Slides 3-7)
// Slide 3: -30% reduction => scale 0.70
// Slide 4: 0% reduction => scale 1.00 (sphere and particles shifted together)
// Slide 5: -10% reduction => scale 0.90
// Slide 6: 0% reduction => scale 1.00
// Slide 7: -15% reduction => scale 0.85
groups[3].scale.set(0.70, 0.70, 0.70);
groups[4].scale.set(1.00, 1.00, 1.00);
groups[5].scale.set(0.90, 0.90, 0.90);
groups[6].scale.set(1.00, 1.00, 1.00);
groups[7].scale.set(0.85, 0.85, 0.85);
// Slide 8: -20% reduction => scale 0.80
groups[8].scale.set(0.80, 0.80, 0.80);
// Slide 9: +10% increase from 0.80 => scale 0.88
groups[9].scale.set(0.88, 0.88, 0.88);

// SLIDE 1: Quantum Geometric Core
const s1Geo = new THREE.IcosahedronGeometry(28, 2);
const s1Mat = new THREE.MeshStandardMaterial({
  color: 0x0a1628,
  wireframe: true,
  roughness: 0.1,
  metalness: 0.9,
  emissive: 0x003355
});
const s1Mesh = new THREE.Mesh(s1Geo, s1Mat);
groups[1].add(s1Mesh);

// SLIDE 2: HIERARCHICAL SCALE-GATED COSMIC ZOOM STAGES
// Parent groups under Slide 2
const stageBubbleGroup = new THREE.Group();
const stageWebGroup = new THREE.Group();
const stageLaniakeaGroup = new THREE.Group();
const stageGalaxyGroup = new THREE.Group();
const stageSolarGroup = new THREE.Group();
const stageEarthGroup = new THREE.Group();

groups[2].add(stageBubbleGroup);
groups[2].add(stageWebGroup);
groups[2].add(stageLaniakeaGroup);
groups[2].add(stageGalaxyGroup);
groups[2].add(stageSolarGroup);
groups[2].add(stageEarthGroup);

// Initially hide all interior cosmic structures
stageWebGroup.visible = false;
stageLaniakeaGroup.visible = false;
stageGalaxyGroup.visible = false;
stageSolarGroup.visible = false;
stageEarthGroup.visible = false;

// -------------------------------------------------------------
// STAGE 1: THE GLOWING OBSERVABLE UNIVERSE BUBBLE (10^26 m)
// Authentic Planck Cosmic Microwave Background (CMB) Thermal Map & Iridescent Horizon
// -------------------------------------------------------------
function createPlanckCMBTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');

  // Baseline cosmic gradient background
  const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
  baseGrad.addColorStop(0, '#03122c');
  baseGrad.addColorStop(0.5, '#062046');
  baseGrad.addColorStop(1, '#03122c');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 512);

  const imgData = ctx.getImageData(0, 0, 1024, 512);
  const data = imgData.data;

  // Authentic Planck/WMAP thermal fluctuation palette (micro-Kelvin ripples)
  const palette = [
    [4, 30, 85],     // -200 uK: Deep Navy Cold Spot
    [0, 130, 200],   // -100 uK: Electric Cyan
    [0, 175, 150],   //  -30 uK: Turquoise
    [50, 185, 110],  //    0 uK: Emerald Mean
    [230, 160, 40],  // +100 uK: Amber Gold
    [240, 80, 30],   // +200 uK: Hot Red-Orange
    [200, 20, 20]    // +300 uK: Deep Crimson Hot Spot
  ];

  function pnoise(u, v) {
    let val = 0;
    val += Math.sin(u * 18.0 + 1.2) * Math.cos(v * 14.0 + 0.8) * 0.45;
    val += Math.sin(u * 38.0 + 2.5) * Math.cos(v * 30.0 + 1.9) * 0.28;
    val += Math.sin(u * 76.0 + 0.3) * Math.cos(v * 62.0 + 2.1) * 0.16;
    val += Math.sin(u * 140.0 + 4.1) * Math.cos(v * 115.0 + 3.2) * 0.08;
    val += Math.sin(u * 260.0 + 1.7) * Math.cos(v * 210.0 + 0.5) * 0.03;
    return (val + 1.0) * 0.5;
  }

  for (let y = 0; y < 512; y++) {
    const ny = (y / 512) * Math.PI;
    for (let x = 0; x < 1024; x++) {
      const nx = (x / 1024) * Math.PI * 2;
      const raw = pnoise(nx, ny);
      const clamped = Math.max(0, Math.min(1, raw));
      const pIdx = clamped * (palette.length - 1);
      const i0 = Math.floor(pIdx);
      const i1 = Math.min(palette.length - 1, i0 + 1);
      const frac = pIdx - i0;

      const r = Math.round(palette[i0][0] * (1 - frac) + palette[i1][0] * frac);
      const g = Math.round(palette[i0][1] * (1 - frac) + palette[i1][1] * frac);
      const b = Math.round(palette[i0][2] * (1 - frac) + palette[i1][2] * frac);

      const pPos = (y * 1024 + x) * 4;
      data[pPos] = r;
      data[pPos + 1] = g;
      data[pPos + 2] = b;
      data[pPos + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle coordinate grid overlay
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let lat = 64; lat < 512; lat += 64) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(1024, lat);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

const cmbTexture = createPlanckCMBTexture();

// 1. Glowing Celestial Bubble Shell (Planck CMB Thermal Map)
const bubbleGeo = new THREE.SphereGeometry(180, 64, 64);
const bubbleMat = new THREE.MeshStandardMaterial({
  map: cmbTexture,
  roughness: 0.75,
  metalness: 0.15,
  transparent: true,
  opacity: 0.88,
  side: THREE.FrontSide
});
const bubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
stageBubbleGroup.add(bubbleMesh);

// 2. Custom GLSL Iridescent Glowing Horizon Limb Shader
const bubbleAtmosVertex = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const bubbleAtmosFrag = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform float uTime;
uniform float uOpacity;
void main() {
  vec3 viewDir = normalize(-vPosition);
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.2);
  vec3 rimColor = mix(vec3(0.0, 0.85, 1.0), vec3(0.75, 0.2, 1.0), sin(uTime * 0.5 + fresnel * 3.14) * 0.5 + 0.5);
  rimColor = mix(rimColor, vec3(1.0, 0.85, 0.3), fresnel * 0.5);
  gl_FragColor = vec4(rimColor, fresnel * uOpacity);
}
`;

const bubbleAtmosMat = new THREE.ShaderMaterial({
  vertexShader: bubbleAtmosVertex,
  fragmentShader: bubbleAtmosFrag,
  uniforms: {
    uTime: { value: 0.0 },
    uOpacity: { value: 0.9 }
  },
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false
});
const bubbleAtmosMesh = new THREE.Mesh(new THREE.SphereGeometry(184, 64, 64), bubbleAtmosMat);
stageBubbleGroup.add(bubbleAtmosMesh);

// 3. Thermal Horizon Luminous Halo Rings
const haloGeo = new THREE.RingGeometry(182, 198, 96);
const haloMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
const bubbleHalo = new THREE.Mesh(haloGeo, haloMat);
stageBubbleGroup.add(bubbleHalo);

// -------------------------------------------------------------
// STAGE 2: THE COSMIC WEB FILAMENTS (10^24 m)
// -------------------------------------------------------------
const webPointCount = 450;
const webCoords = [];
for (let i = 0; i < webPointCount; i++) {
  webCoords.push(new THREE.Vector3(
    (Math.random() - 0.5) * 450,
    (Math.random() - 0.5) * 450,
    (Math.random() - 0.5) * 450
  ));
}
const webLinePositions = [];
for (let i = 0; i < webPointCount; i++) {
  for (let j = i + 1; j < webPointCount; j++) {
    if (webCoords[i].distanceTo(webCoords[j]) < 85) {
      webLinePositions.push(webCoords[i].x, webCoords[i].y, webCoords[i].z);
      webLinePositions.push(webCoords[j].x, webCoords[j].y, webCoords[j].z);
    }
  }
}
const webLineGeo = new THREE.BufferGeometry();
webLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(webLinePositions, 3));
const webLineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
const cosmicWebLines = new THREE.LineSegments(webLineGeo, webLineMat);
stageWebGroup.add(cosmicWebLines);

// -------------------------------------------------------------
// STAGE 3: LANIAKEA SUPERCLUSTER VELOCITY STREAMS (10^22 m)
// -------------------------------------------------------------
const lanCount = 14000;
const lanGeo = new THREE.BufferGeometry();
const lanPos = new Float32Array(lanCount * 3);
const lanCol = new Float32Array(lanCount * 3);

for (let i = 0; i < lanCount; i++) {
  const i3 = i * 3;
  const curve = Math.pow(Math.random(), 1.4) * 120;
  const streamAngle = Math.random() * Math.PI * 2;
  lanPos[i3] = Math.cos(streamAngle) * curve + (Math.random() - 0.5) * 20;
  lanPos[i3 + 1] = (Math.random() - 0.5) * (curve * 0.3);
  lanPos[i3 + 2] = Math.sin(streamAngle) * curve + (Math.random() - 0.5) * 20;

  lanCol[i3] = 0.5 + Math.random() * 0.5;
  lanCol[i3 + 1] = 0.2 + Math.random() * 0.3;
  lanCol[i3 + 2] = 1.0;
}
lanGeo.setAttribute('position', new THREE.BufferAttribute(lanPos, 3));
lanGeo.setAttribute('color', new THREE.BufferAttribute(lanCol, 3));
const laniakeaMat = new THREE.PointsMaterial({ size: 1.2, vertexColors: true, transparent: true, opacity: 0.85 });
const laniakeaCloud = new THREE.Points(lanGeo, laniakeaMat);
stageLaniakeaGroup.add(laniakeaCloud);

// ============================================================================
// STAGE 4 & 5: PHOTOREALISTIC MILKY WAY GALAXY & FULL SOLAR SYSTEM (ALL 8 PLANETS)
// ============================================================================

// -------------------------------------------------------------
// TEXTURE GENERATORS & PROCEDURAL FALLBACKS
// -------------------------------------------------------------
function createStarTexture() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.12, 'rgba(235, 245, 255, 0.95)');
  grad.addColorStop(0.35, 'rgba(110, 195, 255, 0.45)');
  grad.addColorStop(0.7, 'rgba(25, 90, 240, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function createNebulaGasTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
  grad.addColorStop(0.2, 'rgba(120, 210, 255, 0.4)');
  grad.addColorStop(0.5, 'rgba(40, 110, 230, 0.16)');
  grad.addColorStop(0.8, 'rgba(15, 35, 120, 0.04)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function createGalaxyCoreTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.18, 'rgba(255, 230, 160, 0.92)');
  grad.addColorStop(0.42, 'rgba(255, 175, 60, 0.48)');
  grad.addColorStop(0.75, 'rgba(255, 100, 20, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Procedural World Continent Outlines
const earthContinentPolys = [
  { pts: [[120,70],[150,60],[220,75],[270,90],[310,120],[300,160],[260,180],[240,210],[210,230],[195,260],[180,250],[165,220],[135,170],[110,130],[95,95]], type: 'na' },
  { pts: [[60,80],[115,70],[115,110],[75,115]], type: 'tundra' },
  { pts: [[330,50],[380,45],[410,70],[390,110],[340,105]], type: 'ice' },
  { pts: [[210,250],[250,255],[290,270],[350,300],[370,340],[340,400],[300,450],[275,480],[260,450],[250,390],[230,320],[210,280]], type: 'sa' },
  { pts: [[480,130],[530,95],[600,75],[700,65],[820,70],[920,95],[950,130],[900,170],[840,210],[780,240],[740,280],[700,260],[650,220],[600,200],[550,180],[490,180],[460,160]], type: 'eurasia' },
  { pts: [[470,110],[510,95],[520,130],[480,140]], type: 'forest' },
  { pts: [[440,140],[465,130],[460,160],[445,165]], type: 'forest' },
  { pts: [[460,200],[520,190],[580,210],[600,260],[590,320],[560,380],[530,420],[500,430],[470,360],[450,290],[440,230]], type: 'africa' },
  { pts: [[615,360],[630,355],[625,410],[610,405]], type: 'forest' },
  { pts: [[670,230],[710,230],[735,270],[710,310],[680,280]], type: 'tropical' },
  { pts: [[740,250],[790,250],[800,300],[770,320],[750,280]], type: 'tropical' },
  { pts: [[880,180],[905,170],[910,210],[885,220]], type: 'forest' },
  { pts: [[760,330],[840,330],[850,360],[770,360]], type: 'tropical' },
  { pts: [[790,360],[850,340],[900,360],[920,410],[890,445],[820,440],[780,400]], type: 'aus' },
  { pts: [[950,420],[970,415],[965,460],[945,455]], type: 'forest' },
  { pts: [[0,475],[1024,475],[1024,512],[0,512]], type: 'ice' }
];

function createProceduralEarthDayMap() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#031024');
  oceanGrad.addColorStop(0.2, '#051833');
  oceanGrad.addColorStop(0.5, '#0a2f5c');
  oceanGrad.addColorStop(0.8, '#051833');
  oceanGrad.addColorStop(1, '#031024');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.save();
  ctx.filter = 'blur(6px)';
  ctx.strokeStyle = '#1286a5';
  ctx.lineWidth = 12;
  earthContinentPolys.forEach(cItem => {
    ctx.beginPath();
    cItem.pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
    ctx.closePath();
    ctx.stroke();
  });
  ctx.restore();

  earthContinentPolys.forEach(cont => {
    ctx.beginPath();
    cont.pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
    ctx.closePath();
    if (cont.type === 'ice') ctx.fillStyle = '#f0f8ff';
    else if (cont.type === 'africa') {
      const aGrad = ctx.createLinearGradient(0, 190, 0, 430);
      aGrad.addColorStop(0, '#c79b4a');
      aGrad.addColorStop(0.35, '#b98c3d');
      aGrad.addColorStop(0.55, '#1b5624');
      aGrad.addColorStop(0.85, '#416328');
      ctx.fillStyle = aGrad;
    } else if (cont.type === 'aus') {
      const ausGrad = ctx.createRadialGradient(850, 395, 10, 850, 395, 80);
      ausGrad.addColorStop(0, '#bd6328');
      ausGrad.addColorStop(0.65, '#a87836');
      ausGrad.addColorStop(1, '#345e2c');
      ctx.fillStyle = ausGrad;
    } else ctx.fillStyle = '#266233';
    ctx.fill();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

function createProceduralEarthSpecularMap() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 512);
  ctx.fillStyle = '#000000';
  earthContinentPolys.forEach(cont => {
    ctx.beginPath();
    cont.pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
    ctx.closePath();
    ctx.fill();
  });
  return new THREE.CanvasTexture(c);
}

function createProceduralEarthCloudsMap() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 1024, 512);
  for (let i = 0; i < 48; i++) {
    const x = Math.random() * 1024;
    const y = 245 + (Math.random() - 0.5) * 45;
    const rad = 25 + Math.random() * 45;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.32)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  const stormCenters = [[260, 160], [430, 140], [800, 150], [930, 170], [320, 360], [580, 380], [880, 390]];
  stormCenters.forEach(([cx, cy]) => {
    ctx.save();
    ctx.translate(cx, cy);
    for (let arm = 0; arm < 2; arm++) {
      ctx.beginPath();
      for (let theta = 0; theta < Math.PI * 2.8; theta += 0.12) {
        const r = 4 + theta * 9;
        const a = theta + arm * Math.PI;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r * 0.7;
        if (theta === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.restore();
  });
  return new THREE.CanvasTexture(c);
}

// -------------------------------------------------------------
// STAGE 4: REAL MILKY WAY SPIRAL GALAXY WITH FULL GRAPHICS (10^18 m)
// Photorealistic 4-Arm Barred Spiral · 80,000 Stars · Dark Molecular Dust Lanes · Nuclear Bulge
// -------------------------------------------------------------
stageGalaxyGroup.rotation.x = 0.98;

const starTex = createStarTexture();
const nebulaGasTex = createNebulaGasTexture();
const coreGlowTex = createGalaxyCoreTexture();

// 1. Logarithmic 4-Arm Barred Spiral Stars (72,000 Stars)
const mwCount = 72000;
const mwGeo = new THREE.BufferGeometry();
const mwPos = new Float32Array(mwCount * 3);
const mwColors = new Float32Array(mwCount * 3);

const barAngle = 28 * (Math.PI / 180);
const cosBar = Math.cos(barAngle);
const sinBar = Math.sin(barAngle);

for (let i = 0; i < mwCount; i++) {
  const i3 = i * 3;
  if (i < 18000) {
    // Central Triaxial Bar (Ancient Warm Stellar Population)
    const barU = (Math.random() - 0.5) * 2;
    const barV = (Math.random() - 0.5) * 2;
    const u = barU * Math.abs(barU) * 17.5;
    const v = barV * Math.abs(barV) * 6.8;
    mwPos[i3] = u * cosBar - v * sinBar;
    mwPos[i3 + 1] = (Math.random() - 0.5) * (7.5 - Math.sqrt(u * u + v * v) * 0.32);
    mwPos[i3 + 2] = u * sinBar + v * cosBar;

    const blend = Math.random();
    if (blend < 0.55) {
      mwColors[i3] = 1.0; mwColors[i3 + 1] = 0.84; mwColors[i3 + 2] = 0.46; // Warm Gold
    } else if (blend < 0.82) {
      mwColors[i3] = 1.0; mwColors[i3 + 1] = 0.65; mwColors[i3 + 2] = 0.28; // Amber
    } else {
      mwColors[i3] = 1.0; mwColors[i3 + 1] = 0.96; mwColors[i3 + 2] = 0.90; // Pale Yellow-White
    }
  } else {
    // 4 Grand-Design Logarithmic Spiral Arms
    // Perseus, Scutum-Centaurus, Sagittarius-Carina, Norma/Outer
    const armIdx = i % 4;
    const theta0 = armIdx * (Math.PI / 2);
    const radius = 9.5 + Math.pow(Math.random(), 1.42) * 78;
    const spiralAngle = theta0 + Math.log(radius / 7.5) / 0.215;
    const armSpread = (Math.random() - 0.5) * (1.6 + radius * 0.048);
    const totalAngle = spiralAngle + armSpread / radius;
    const r = radius + (Math.random() - 0.5) * 2.2;

    mwPos[i3] = Math.cos(totalAngle) * r;
    mwPos[i3 + 1] = (Math.random() - 0.5) * (2.8 * Math.exp(-radius / 60) + 0.42);
    mwPos[i3 + 2] = Math.sin(totalAngle) * r;

    if (radius > 40) {
      // Outer Spiral Arms: Hot Young Massive OB Stars (Cyan / Blue / White)
      const bProb = Math.random();
      if (bProb < 0.52) {
        mwColors[i3] = 0.05; mwColors[i3 + 1] = 0.92; mwColors[i3 + 2] = 1.0; // Electric Cyan
      } else if (bProb < 0.82) {
        mwColors[i3] = 0.55; mwColors[i3 + 1] = 0.80; mwColors[i3 + 2] = 1.0; // Sky Blue
      } else {
        mwColors[i3] = 1.0; mwColors[i3 + 1] = 1.0; mwColors[i3 + 2] = 1.0; // Pure White
      }
    } else {
      // Transition Disk Zone: Intermediate F/G Solar Type Stars
      mwColors[i3] = 0.82 + Math.random() * 0.18;
      mwColors[i3 + 1] = 0.88 + Math.random() * 0.12;
      mwColors[i3 + 2] = 1.0;
    }
  }
}

mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
mwGeo.setAttribute('color', new THREE.BufferAttribute(mwColors, 3));
const mwMat = new THREE.PointsMaterial({
  size: 1.55,
  vertexColors: true,
  map: starTex,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
  opacity: 0.95
});
const milkyWayStars = new THREE.Points(mwGeo, mwMat);
stageGalaxyGroup.add(milkyWayStars);

// 2. H II Emission Nebulae (2,000 Starburst Nurseries along Spiral Arms)
const emCount = 2000;
const emGeo = new THREE.BufferGeometry();
const emPos = new Float32Array(emCount * 3);
const emColors = new Float32Array(emCount * 3);
for (let i = 0; i < emCount; i++) {
  const i3 = i * 3;
  const armIdx = i % 4;
  const radius = 16 + Math.pow(Math.random(), 1.35) * 68;
  const spiralAngle = (armIdx * Math.PI / 2) + Math.log(radius / 7.5) / 0.215 + (Math.random() - 0.5) * 0.16;
  emPos[i3] = Math.cos(spiralAngle) * radius;
  emPos[i3 + 1] = (Math.random() - 0.5) * 1.6;
  emPos[i3 + 2] = Math.sin(spiralAngle) * radius;
  if (i % 3 === 0) {
    emColors[i3] = 1.0; emColors[i3 + 1] = 0.12; emColors[i3 + 2] = 0.58; // Vibrant H-alpha Magenta
  } else if (i % 3 === 1) {
    emColors[i3] = 0.1; emColors[i3 + 1] = 0.90; emColors[i3 + 2] = 0.95; // Ionized Teal
  } else {
    emColors[i3] = 0.75; emColors[i3 + 1] = 0.25; emColors[i3 + 2] = 1.0; // Deep Violet
  }
}
emGeo.setAttribute('position', new THREE.BufferAttribute(emPos, 3));
emGeo.setAttribute('color', new THREE.BufferAttribute(emColors, 3));
const emMat = new THREE.PointsMaterial({
  size: 3.4,
  vertexColors: true,
  map: starTex,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
  opacity: 0.88
});
stageGalaxyGroup.add(new THREE.Points(emGeo, emMat));

// 3. Dark Molecular Dust Lanes (10,000 Extinction Particles)
// Silhouette absorption tracing inner arm shock fronts (Great Rift feature)
const dustCount = 10000;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
  const i3 = i * 3;
  const armIdx = i % 4;
  const radius = 14 + Math.pow(Math.random(), 1.38) * 70;
  const spiralAngle = (armIdx * Math.PI / 2) + Math.log(radius / 7.5) / 0.215 - 0.11 + (Math.random() - 0.5) * 0.07;
  dustPos[i3] = Math.cos(spiralAngle) * radius;
  dustPos[i3 + 1] = (Math.random() - 0.5) * 1.1;
  dustPos[i3 + 2] = Math.sin(spiralAngle) * radius;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dustMat = new THREE.PointsMaterial({
  size: 2.4,
  color: 0x040306,
  map: starTex,
  blending: THREE.NormalBlending,
  transparent: true,
  opacity: 0.85
});
stageGalaxyGroup.add(new THREE.Points(dustGeo, dustMat));

// 4. Volumetric Interstellar Gas Clouds (140 Smooth Dispersed Sprites)
const gasSpriteMat = new THREE.SpriteMaterial({ map: nebulaGasTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.26 });
for (let i = 0; i < 140; i++) {
  const sp = new THREE.Sprite(gasSpriteMat);
  const armIdx = i % 4;
  const radius = 10 + Math.random() * 68;
  const spiralAngle = (armIdx * Math.PI / 2) + Math.log(radius / 7.5) / 0.215;
  sp.position.set(Math.cos(spiralAngle) * radius, (Math.random() - 0.5) * 2.2, Math.sin(spiralAngle) * radius);
  const sc = 9 + Math.random() * 16;
  sp.scale.set(sc, sc, 1);
  stageGalaxyGroup.add(sp);
}

// 5. Sagittarius A* Galactic Center & Nuclear Star Cluster (Pure Volumetric Radiant Bulge - No Flat Ring Artifacts)
const coreGroup = new THREE.Group();

// Dense 3D Nuclear Star Bulge (8,000 tightly clustered ancient stars)
const bulgeCount = 8000;
const bulgeGeo = new THREE.BufferGeometry();
const bulgePos = new Float32Array(bulgeCount * 3);
const bulgeColors = new Float32Array(bulgeCount * 3);

for (let i = 0; i < bulgeCount; i++) {
  const i3 = i * 3;
  const u1 = Math.random(), u2 = Math.random();
  const radius = Math.sqrt(-2.0 * Math.log(Math.max(1e-6, u1))) * 2.5;
  const theta = u2 * Math.PI * 2;
  const phi = (Math.random() - 0.5) * Math.PI;

  bulgePos[i3] = radius * Math.cos(phi) * Math.cos(theta) * 1.5;
  bulgePos[i3 + 1] = radius * Math.sin(phi) * 0.75;
  bulgePos[i3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

  const blend = Math.random();
  if (blend < 0.45) {
    bulgeColors[i3] = 1.0; bulgeColors[i3 + 1] = 0.98; bulgeColors[i3 + 2] = 0.92;
  } else if (blend < 0.8) {
    bulgeColors[i3] = 1.0; bulgeColors[i3 + 1] = 0.85; bulgeColors[i3 + 2] = 0.55;
  } else {
    bulgeColors[i3] = 1.0; bulgeColors[i3 + 1] = 0.70; bulgeColors[i3 + 2] = 0.35;
  }
}
bulgeGeo.setAttribute('position', new THREE.BufferAttribute(bulgePos, 3));
bulgeGeo.setAttribute('color', new THREE.BufferAttribute(bulgeColors, 3));
const bulgeMat = new THREE.PointsMaterial({
  size: 1.8,
  vertexColors: true,
  map: starTex,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
  opacity: 0.95
});
const bulgeStars = new THREE.Points(bulgeGeo, bulgeMat);
coreGroup.add(bulgeStars);

// Multi-tier Volumetric Radiant Glow Sprites (Pure smooth illumination, ZERO geometric polygons)
const coreGlowMat = new THREE.SpriteMaterial({ map: coreGlowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 1.0 });
const coreGlowSprite = new THREE.Sprite(coreGlowMat);
coreGlowSprite.scale.set(22, 22, 1);
coreGroup.add(coreGlowSprite);

const coreGlowMidMat = new THREE.SpriteMaterial({ map: coreGlowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.75 });
const coreGlowMidSprite = new THREE.Sprite(coreGlowMidMat);
coreGlowMidSprite.scale.set(42, 42, 1);
coreGroup.add(coreGlowMidSprite);

const coreGlowOuterMat = new THREE.SpriteMaterial({ map: coreGlowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.35 });
const coreGlowOuterSprite = new THREE.Sprite(coreGlowOuterMat);
coreGlowOuterSprite.scale.set(70, 70, 1);
coreGroup.add(coreGlowOuterSprite);

stageGalaxyGroup.add(coreGroup);

// 6. Sol-3 Orion Spur Tactical Indicator
const solPinGroup = new THREE.Group();
solPinGroup.position.set(26.5, 0.6, 14.2);
const solPinMat = new THREE.MeshBasicMaterial({ color: 0xff0044, side: THREE.DoubleSide, transparent: true, opacity: 1.0 });
const solPin = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.8, 32), solPinMat);
solPin.rotation.x = Math.PI / 2;
solPinGroup.add(solPin);

const solOuterRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
const solOuterRing = new THREE.Mesh(new THREE.RingGeometry(2.4, 2.6, 32), solOuterRingMat);
solOuterRing.rotation.x = Math.PI / 2;
solPinGroup.add(solOuterRing);
stageGalaxyGroup.add(solPinGroup);

// -------------------------------------------------------------
// STAGE 5: THE COMPLETE SOLAR SYSTEM (ALL 8 PLANETS + SUN + MOON)
// -------------------------------------------------------------
// Dedicated Central Solar Point Light & Space Ambient Lighting
const sunPointLight = new THREE.PointLight(0xffffff, 2.5, 1200);
stageSolarGroup.add(sunPointLight);
stageSolarGroup.add(new THREE.AmbientLight(0x0a1c38, 0.8));

const planetMeshes = {};
const orbitRings = [];

// Helper to create Keplerian Orbit Ring
function createOrbitRing(radius, isHighlighted = false) {
  const ringGeo = new THREE.RingGeometry(radius - 0.15, radius + 0.15, 96);
  const ringMat = new THREE.MeshBasicMaterial({
    color: isHighlighted ? 0x00ff88 : 0x226699,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: isHighlighted ? 0.85 : 0.45
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  stageSolarGroup.add(ring);
  orbitRings.push(ring);
  return ring;
}

// 0. THE SUN (Sol) - PHOTOREALISTIC DYNAMIC THERMONUCLEAR STAR (GLSL SHADERS)
// Real-time boiling plasma, Eddington limb darkening, chromosphere, coronal loop prominences & volumetric aura
const sunVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sunFragmentShader = `
uniform float uTime;
uniform sampler2D uTex;
uniform int uHasTex;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

// WebGL Simplex 3D Noise for boiling plasma turbulence
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// 3-Octave Fractional Brownian Motion for boiling plasma convection
float fbm(vec3 p) {
  float f = 0.0;
  f += 0.5000 * snoise(p); p = p * 2.02 + vec3(0.0, uTime * 0.03, 0.0);
  f += 0.2500 * snoise(p); p = p * 2.03 - vec3(uTime * 0.04, 0.0, 0.0);
  f += 0.1250 * snoise(p);
  return f;
}

void main() {
  vec3 viewDir = normalize(-vPosition);
  float cosTheta = clamp(dot(vNormal, viewDir), 0.0, 1.0);

  // Astrophysical Eddington Limb Darkening
  // Center of disk is incandescent white; limb is deep fiery chromospheric red-orange
  float limbFactor = pow(cosTheta, 0.50);

  // Dynamic boiling plasma & convection granulation
  vec3 posCoords = vWorldPosition * 0.52;
  float t = uTime * 0.16;
  vec3 flow = vec3(sin(t * 0.3) * 0.08, t * 0.22, cos(t * 0.2) * 0.08);
  float nPlasma = fbm(posCoords + flow);
  float nGranules = snoise(posCoords * 3.6 - flow * 1.4) * 0.24;
  float plasma = clamp(0.5 + 0.5 * (nPlasma + nGranules), 0.0, 1.0);

  // Authentic Solar Spectral Palette
  vec3 colLimb = vec3(0.92, 0.18, 0.01);       // Chromospheric H-alpha edge
  vec3 colOrange = vec3(1.0, 0.48, 0.03);     // Convection cell borders
  vec3 colGold = vec3(1.0, 0.82, 0.22);       // Photosphere plasma
  vec3 colWhiteHot = vec3(1.0, 0.98, 0.92);   // Incandescent core radiance

  // Modulate with optional NASA satellite texture if loaded
  if (uHasTex == 1) {
    vec3 texSample = texture2D(uTex, vUv).rgb;
    colGold = mix(colGold, texSample * 1.3, 0.5);
  }

  vec3 plasmaCol = mix(colOrange, colGold, plasma);
  vec3 finalColor = mix(colLimb, plasmaCol, limbFactor);

  // Core solar incandescent brilliance at disk center
  finalColor = mix(finalColor, colWhiteHot, pow(cosTheta, 2.0) * (0.6 + 0.4 * plasma));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Inner Chromospheric Rim Glow Shader
const sunAtmosVertex = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sunAtmosFrag = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - clamp(dot(vNormal, viewDir), 0.0, 1.0);
  float intensity = pow(rim, 2.4) * 1.5;
  vec3 atmosCol = vec3(1.0, 0.50, 0.04); // Fiery solar amber
  gl_FragColor = vec4(atmosCol, intensity);
}
`;

// 1. Photosphere Sphere (Radius 6.5, 96x96 smooth tessellation)
const dummySunTexCanvas = document.createElement('canvas');
dummySunTexCanvas.width = 2;
dummySunTexCanvas.height = 2;
const dummySunTex = new THREE.CanvasTexture(dummySunTexCanvas);

const sunMat = new THREE.ShaderMaterial({
  vertexShader: sunVertexShader,
  fragmentShader: sunFragmentShader,
  uniforms: {
    uTime: { value: 0.0 },
    uTex: { value: dummySunTex },
    uHasTex: { value: 0 }
  }
});
const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(6.5, 96, 96), sunMat);
sunMesh.position.set(0, 0, 0);
stageSolarGroup.add(sunMesh);
planetMeshes.sun = sunMesh;

// 2. Chromosphere Atmospheric Shell (Radius 6.74)
const sunAtmosMat = new THREE.ShaderMaterial({
  vertexShader: sunAtmosVertex,
  fragmentShader: sunAtmosFrag,
  uniforms: { uTime: { value: 0.0 } },
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false
});
const sunAtmosphereMesh = new THREE.Mesh(new THREE.SphereGeometry(6.74, 64, 64), sunAtmosMat);
stageSolarGroup.add(sunAtmosphereMesh);

// 3. Magnetic Coronal Loop Prominences (3D Plasma Arches on the Limb)
const prominenceGroup = new THREE.Group();
const loopConfigs = [
  { lat: 0.15, lon: 0.35, rOut: 8.4, h: 2.1 },
  { lat: -0.32, lon: 1.55, rOut: 8.6, h: 2.3 },
  { lat: 0.52, lon: 2.80, rOut: 8.9, h: 2.6 },
  { lat: -0.18, lon: 3.95, rOut: 8.3, h: 1.9 },
  { lat: 0.44, lon: 4.85, rOut: 8.7, h: 2.4 },
  { lat: -0.58, lon: 5.85, rOut: 8.5, h: 2.0 }
];

loopConfigs.forEach(lc => {
  const p1 = new THREE.Vector3(
    6.48 * Math.cos(lc.lat) * Math.cos(lc.lon),
    6.48 * Math.sin(lc.lat),
    6.48 * Math.cos(lc.lat) * Math.sin(lc.lon)
  );
  const p2 = new THREE.Vector3(
    lc.rOut * Math.cos(lc.lat) * Math.cos(lc.lon + 0.10),
    lc.rOut * Math.sin(lc.lat) + lc.h * 0.25,
    lc.rOut * Math.cos(lc.lat) * Math.sin(lc.lon + 0.10)
  );
  const p3 = new THREE.Vector3(
    6.48 * Math.cos(lc.lat) * Math.cos(lc.lon + 0.20),
    6.48 * Math.sin(lc.lat),
    6.48 * Math.cos(lc.lat) * Math.sin(lc.lon + 0.20)
  );
  const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
  const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.12, 8, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: 0xff3b00,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  prominenceGroup.add(new THREE.Mesh(tubeGeo, tubeMat));
});
stageSolarGroup.add(prominenceGroup);

// 4. Volumetric Coronal Billboard Glow Sprite (Soft exponential falloff & streamers)
function createPhotorealisticCoronaTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const cx = 256, cy = 256;

  // Soft multi-stop radial gradient
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 256);
  grad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.12, 'rgba(255, 248, 220, 0.95)');
  grad.addColorStop(0.24, 'rgba(255, 205, 80, 0.80)');
  grad.addColorStop(0.40, 'rgba(255, 130, 20, 0.45)');
  grad.addColorStop(0.65, 'rgba(255, 60, 0, 0.14)');
  grad.addColorStop(1.00, 'rgba(180, 20, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // 32 Ethereal radial coronal streamers / Alfvén magnetic wave rays
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2 + (Math.sin(i * 3.7) * 0.08);
    const len = 150 + Math.abs(Math.sin(i * 2.1)) * 95;
    const w = 0.04 + Math.abs(Math.cos(i * 1.5)) * 0.04;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, len, angle - w, angle + w);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 230, 150, 0.06)';
    ctx.fill();
  }

  return new THREE.CanvasTexture(c);
}

const sunCoronaTex = createPhotorealisticCoronaTexture();
const sunCoronaSpriteMat = new THREE.SpriteMaterial({
  map: sunCoronaTex,
  color: 0xffffff,
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.90,
  depthWrite: false
});
const sunCoronaSprite = new THREE.Sprite(sunCoronaSpriteMat);
sunCoronaSprite.scale.set(42, 42, 1);
stageSolarGroup.add(sunCoronaSprite);

// Rotating Equatorial Prominence Ring (preserves sunCorona compatibility)
const sunCorona = new THREE.Mesh(
  new THREE.RingGeometry(6.6, 14.5, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff6600,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.30,
    blending: THREE.AdditiveBlending
  })
);
stageSolarGroup.add(sunCorona);

// 1. MERCURY (0.39 AU - Orbital Distance 16)
createOrbitRing(16);
const mercuryMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.75, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.85, metalness: 0.1 })
);
mercuryMesh.position.set(16, 0, 0);
stageSolarGroup.add(mercuryMesh);
planetMeshes.mercury = mercuryMesh;

// 2. VENUS (0.72 AU - Orbital Distance 28)
createOrbitRing(28);
const venusMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.25, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4, metalness: 0.1 })
);
venusMesh.position.set(28, 0, 0);
stageSolarGroup.add(venusMesh);
planetMeshes.venus = venusMesh;

// 3. PLANET EARTH & MOON & SATELLITE (1.00 AU - Orbital Distance 44)
createOrbitRing(44, true); // Highlighted in emerald cyan
const earthGroup = new THREE.Group();
earthGroup.position.set(44, 0, 0);
stageSolarGroup.add(earthGroup);

const pDayTex = createProceduralEarthDayMap();
const pSpecTex = createProceduralEarthSpecularMap();
const pCloudTex = createProceduralEarthCloudsMap();

// Earth Globe
const earthMat = new THREE.MeshStandardMaterial({
  map: pDayTex,
  roughnessMap: pSpecTex,
  roughness: 0.35,
  metalness: 0.05
});
const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), earthMat);
earthGroup.add(earthMesh);
planetMeshes.earth = earthMesh;

// Rotating Clouds
const earthCloudsMat = new THREE.MeshStandardMaterial({
  map: pCloudTex,
  transparent: true,
  opacity: 0.85,
  blending: THREE.NormalBlending,
  depthWrite: false
});
const earthCloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(1.52, 64, 64), earthCloudsMat);
earthGroup.add(earthCloudsMesh);

// Rayleigh Scattering Atmosphere Glow
const atmosVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const atmosFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 viewDir = normalize(-vPosition);
  float intensity = pow(1.0 - abs(dot(vNormal, viewDir)), 2.8);
  gl_FragColor = vec4(0.0, 0.85, 1.0, intensity * 0.9);
}
`;
const earthAtmosMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.58, 64, 64),
  new THREE.ShaderMaterial({
    vertexShader: atmosVertexShader,
    fragmentShader: atmosFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  })
);
earthGroup.add(earthAtmosMesh);

// 3D Moon in Orbit
const moonOrbitGroup = new THREE.Group();
earthGroup.add(moonOrbitGroup);
const moonMat = new THREE.MeshStandardMaterial({ color: 0xadb3bc, roughness: 0.9, metalness: 0.05 });
const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), moonMat);
moonMesh.position.set(4.2, 0.6, 0);
moonOrbitGroup.add(moonMesh);

// 3D Low Earth Orbit Satellite (400 km LEO)
const satOrbitGroup = new THREE.Group();
earthGroup.add(satOrbitGroup);

const satCraft = new THREE.Group();
satCraft.position.set(2.0, 0, 0);
const satBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0xd0d5dd, metalness: 0.85 }));
satBody.rotation.z = Math.PI / 2;
satCraft.add(satBody);

const satPanelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.22, 0.7), new THREE.MeshStandardMaterial({ color: 0x0a2540, metalness: 0.6 }));
satPanelLeft.position.set(0, 0, 0.55);
const satPanelRight = satPanelLeft.clone();
satPanelRight.position.set(0, 0, -0.55);
satCraft.add(satPanelLeft);
satCraft.add(satPanelRight);

const satStrobe = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
satStrobe.position.set(0.2, 0.08, 0);
satCraft.add(satStrobe);
satOrbitGroup.add(satCraft);

// 4. MARS (1.52 AU - Orbital Distance 60)
createOrbitRing(60);
const marsMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.95, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.75, metalness: 0.1 })
);
marsMesh.position.set(60, 0, 0);
stageSolarGroup.add(marsMesh);
planetMeshes.mars = marsMesh;

// 5. JUPITER (5.20 AU - Orbital Distance 82)
createOrbitRing(82);
const jupiterMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3.4, 48, 48),
  new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.55, metalness: 0.05 })
);
jupiterMesh.position.set(82, 0, 0);
stageSolarGroup.add(jupiterMesh);
planetMeshes.jupiter = jupiterMesh;

// 6. SATURN (9.58 AU - Orbital Distance 110)
createOrbitRing(110);
const saturnGroup = new THREE.Group();
saturnGroup.position.set(110, 0, 0);
stageSolarGroup.add(saturnGroup);

const saturnMesh = new THREE.Mesh(
  new THREE.SphereGeometry(2.8, 36, 36),
  new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.6, metalness: 0.05 })
);
saturnGroup.add(saturnMesh);
planetMeshes.saturn = saturnMesh;

const saturnRings = new THREE.Mesh(
  new THREE.RingGeometry(3.4, 6.8, 64),
  new THREE.MeshBasicMaterial({ color: 0xd4b886, side: THREE.DoubleSide, transparent: true, opacity: 0.88 })
);
saturnRings.rotation.x = Math.PI / 2.4;
saturnGroup.add(saturnRings);

// 7. URANUS (19.2 AU - Orbital Distance 138)
createOrbitRing(138);
const uranusGroup = new THREE.Group();
uranusGroup.position.set(138, 0, 0);
stageSolarGroup.add(uranusGroup);

const uranusMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.9, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.45, metalness: 0.05 })
);
uranusGroup.add(uranusMesh);
planetMeshes.uranus = uranusMesh;

// Delicate thin vertical rings (Uranus has extreme 97.8° axial tilt!)
// Inner faint ring and outer distinct epsilon ring
const uranusRingGeo = new THREE.RingGeometry(2.35, 2.95, 64);
const uranusRingMat = new THREE.MeshBasicMaterial({
  color: 0xbae6fd,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.55
});
const uranusRings = new THREE.Mesh(uranusRingGeo, uranusRingMat);
uranusRings.rotation.x = Math.PI / 2.05; // 87.8° tilt relative to orbit plane (near vertical)
uranusRings.rotation.y = 0.15;
uranusGroup.add(uranusRings);

// Secondary faint outer ring
const uranusOuterRing = new THREE.Mesh(
  new THREE.RingGeometry(3.1, 3.4, 64),
  new THREE.MeshBasicMaterial({ color: 0x7dd3fc, side: THREE.DoubleSide, transparent: true, opacity: 0.28 })
);
uranusOuterRing.rotation.x = Math.PI / 2.05;
uranusOuterRing.rotation.y = 0.15;
uranusGroup.add(uranusOuterRing);

// 8. NEPTUNE (30.1 AU - Orbital Distance 166)
createOrbitRing(166);
const neptuneMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.9, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45, metalness: 0.05 })
);
neptuneMesh.position.set(166, 0, 0);
stageSolarGroup.add(neptuneMesh);
planetMeshes.neptune = neptuneMesh;

// -------------------------------------------------------------
// ASYNCHRONOUS NASA / JPL PLANETARY TEXTURE STREAMER
// -------------------------------------------------------------
const texLoader = new THREE.TextureLoader();
texLoader.setCrossOrigin('anonymous');

const rawTexBase = 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/';
const jsdPlanets = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/';

texLoader.load(rawTexBase + 'sunmap.jpg', t => {
  if (sunMat && sunMat.uniforms) {
    sunMat.uniforms.uTex.value = t;
    sunMat.uniforms.uHasTex.value = 1;
  }
  if (sunMesh && sunMesh.material) sunMesh.material.needsUpdate = true;
});
texLoader.load(rawTexBase + 'mercurymap.jpg', t => { mercuryMesh.material.map = t; mercuryMesh.material.needsUpdate = true; });
texLoader.load(rawTexBase + 'venusmap.jpg', t => { venusMesh.material.map = t; venusMesh.material.needsUpdate = true; });
texLoader.load(jsdPlanets + 'earth_atmos_2048.jpg', t => { earthMat.map = t; earthMat.needsUpdate = true; });
texLoader.load(jsdPlanets + 'earth_normal_2048.jpg', t => { earthMat.normalMap = t; earthMat.normalScale.set(0.8, 0.8); earthMat.needsUpdate = true; });
texLoader.load(jsdPlanets + 'earth_specular_2048.jpg', t => { earthMat.roughnessMap = t; earthMat.needsUpdate = true; });
texLoader.load(jsdPlanets + 'earth_clouds_1024.png', t => { earthCloudsMat.map = t; earthCloudsMat.needsUpdate = true; });
texLoader.load(jsdPlanets + 'moon_1024.jpg', t => { moonMat.map = t; moonMat.needsUpdate = true; });
texLoader.load(rawTexBase + 'marsmap1k.jpg', t => { marsMesh.material.map = t; marsMesh.material.needsUpdate = true; });
texLoader.load(rawTexBase + 'jupitermap.jpg', t => { jupiterMesh.material.map = t; jupiterMesh.material.needsUpdate = true; });
texLoader.load(rawTexBase + 'saturnmap.jpg', t => { saturnMesh.material.map = t; saturnMesh.material.needsUpdate = true; });
texLoader.load(rawTexBase + 'saturnringcolor.jpg', t => { saturnRings.material.map = t; saturnRings.material.needsUpdate = true; });
texLoader.load(rawTexBase + 'uranusmap.jpg', t => { uranusMesh.material.map = t; uranusMesh.material.needsUpdate = true; });
texLoader.load(rawTexBase + 'neptunemap.jpg', t => { neptuneMesh.material.map = t; neptuneMesh.material.needsUpdate = true; });

// SLIDE 3: LAB 1 - SHADERS (PBR Torus Knot with Studio HDR Reflection & Front Key Lights)
function createStudioEnvMap() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  
  // Studio dark gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.0, '#122238');
  grad.addColorStop(0.5, '#07101e');
  grad.addColorStop(1.0, '#02060d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Softbox 1: Overhead primary studio reflector
  const sb1 = ctx.createRadialGradient(256, 45, 0, 256, 45, 110);
  sb1.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  sb1.addColorStop(0.35, 'rgba(200, 235, 255, 0.55)');
  sb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sb1;
  ctx.fillRect(0, 0, 512, 140);

  // Softbox 2: Left studio rim panel
  const sb2 = ctx.createRadialGradient(70, 128, 0, 70, 128, 85);
  sb2.addColorStop(0, 'rgba(0, 240, 255, 0.75)');
  sb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sb2;
  ctx.fillRect(0, 50, 160, 155);

  // Softbox 3: Right studio rim panel
  const sb3 = ctx.createRadialGradient(440, 128, 0, 440, 128, 85);
  sb3.addColorStop(0, 'rgba(255, 170, 0, 0.70)');
  sb3.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sb3;
  ctx.fillRect(350, 50, 162, 155);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

const studioEnvMap = createStudioEnvMap();

const pbrGeo = new THREE.TorusKnotGeometry(15, 4.2, 160, 36);
const pbrMat = new THREE.MeshPhysicalMaterial({
  color: 0x1a3556, // Luminous titanium deep sapphire
  roughness: 0.20,
  metalness: 0.85,
  clearcoat: 0.85,
  clearcoatRoughness: 0.08,
  reflectivity: 1.0,
  envMap: studioEnvMap,
  envMapIntensity: 1.5
});
const pbrMesh = new THREE.Mesh(pbrGeo, pbrMat);
groups[3].add(pbrMesh);

// Dedicated Studio Key Light & Fill Light inside groups[3] for Slide 3
// Bathes the front-facing curves of the torus knot in dramatic key light tint
const pbrKeyLight = new THREE.DirectionalLight(0x00f0ff, 4.5);
pbrKeyLight.position.set(30, 40, 50);
groups[3].add(pbrKeyLight);

const pbrFillLight = new THREE.PointLight(0x00f0ff, 2.2, 180);
pbrFillLight.position.set(-35, -25, 45);
groups[3].add(pbrFillLight);

const pbrRimLight = new THREE.PointLight(0xffffff, 2.0, 140);
pbrRimLight.position.set(0, 35, -35);
groups[3].add(pbrRimLight);

// SLIDE 4: LAB 2 - 50,000 GPU PARTICLES WITH DYNAMIC FORCES (REDONE & VISIBLE ON ALL GPUS)
function createGlowPointTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.95)');
  grad.addColorStop(0.5, 'rgba(0, 140, 255, 0.4)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(c);
  return texture;
}

const pMax = 50000;
let activeParticleCount = 30000;
const pPos = new Float32Array(pMax * 3);
const pVel = new Float32Array(pMax * 3);
const pCol = new Float32Array(pMax * 3);

for (let i = 0; i < pMax; i++) {
  const i3 = i * 3;
  const rad = 8 + Math.random() * 65;
  const th = Math.random() * Math.PI * 2;
  const ph = (Math.random() - 0.5) * Math.PI * 0.7;

  pPos[i3] = Math.cos(th) * Math.cos(ph) * rad;
  pPos[i3 + 1] = Math.sin(ph) * rad;
  pPos[i3 + 2] = Math.sin(th) * Math.cos(ph) * rad;

  pVel[i3] = (Math.random() - 0.5) * 0.3;
  pVel[i3 + 1] = (Math.random() - 0.5) * 0.3;
  pVel[i3 + 2] = (Math.random() - 0.5) * 0.3;

  if (i % 3 === 0) {
    pCol[i3] = 0.0; pCol[i3 + 1] = 0.95; pCol[i3 + 2] = 1.0; // Cyan
  } else if (i % 3 === 1) {
    pCol[i3] = 0.9; pCol[i3 + 1] = 0.2; pCol[i3 + 2] = 1.0; // Violet
  } else {
    pCol[i3] = 1.0; pCol[i3 + 1] = 0.85; pCol[i3 + 2] = 0.3; // Gold
  }
}

const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
particleGeo.setDrawRange(0, activeParticleCount);

const particleMat = new THREE.PointsMaterial({
  size: 3.5,
  map: createGlowPointTexture(),
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
  vertexColors: true,
  sizeAttenuation: true
});
const particleCloud = new THREE.Points(particleGeo, particleMat);
groups[4].add(particleCloud);

// Visual Gravity Anchor Core
const coreAnchorGeo = new THREE.SphereGeometry(3.5, 24, 24);
const coreAnchorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
const coreAnchor = new THREE.Mesh(coreAnchorGeo, coreAnchorMat);
groups[4].add(coreAnchor);

let particleForceMode = 'vortex';
let particleSimSpeed = 1.0;

// SLIDE 5: LAB 3 - AUDIO REACTIVE CORE (PROCEDURAL GEOMETRIC WAVEFORM MORPHING)
const audioCoreGeo = new THREE.IcosahedronGeometry(18, 4); // Subdivided for responsive waveform topology
const audioCorePosOrig = audioCoreGeo.attributes.position.clone();
const audioCoreMat = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  wireframe: true,
  emissive: 0x002244,
  roughness: 0.2
});
const audioCoreMesh = new THREE.Mesh(audioCoreGeo, audioCoreMat);
groups[5].add(audioCoreMesh);

const audioInnerGeo = new THREE.SphereGeometry(10, 32, 32);
const audioInnerMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
const audioInnerMesh = new THREE.Mesh(audioInnerGeo, audioInnerMat);
groups[5].add(audioInnerMesh);

// SLIDE 6: LAB 4 - 3D KINETIC PRISMATIC GYROSCOPE & REFRACTION CRYSTAL
const stageGlassGroup = new THREE.Group();
stageGlassGroup.position.set(0, 0, 0);
groups[6].add(stageGlassGroup);

// Dedicated Slide 6 Lighting Array
const glassKeyLight = new THREE.PointLight(0x00f0ff, 4.0, 140);
glassKeyLight.position.set(25, 25, 30);
groups[6].add(glassKeyLight);

const glassFillLight = new THREE.PointLight(0xffd700, 3.0, 140);
glassFillLight.position.set(-25, -20, 25);
groups[6].add(glassFillLight);

// Outer Gimbal Ring 1 (Gold Specular Metallic)
const gyroRingGeo1 = new THREE.TorusGeometry(18, 0.65, 24, 64);
const gyroRingMat1 = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  metalness: 0.92,
  roughness: 0.12,
  emissive: 0x332200
});
const gyroRing1 = new THREE.Mesh(gyroRingGeo1, gyroRingMat1);
stageGlassGroup.add(gyroRing1);

// Inner Gimbal Ring 2 (Cyan Luminous Specular)
const gyroRingGeo2 = new THREE.TorusGeometry(14, 0.5, 24, 64);
const gyroRingMat2 = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  metalness: 0.88,
  roughness: 0.15,
  emissive: 0x002233
});
const gyroRing2 = new THREE.Mesh(gyroRingGeo2, gyroRingMat2);
gyroRing2.rotation.x = Math.PI / 3;
stageGlassGroup.add(gyroRing2);

// Perpendicular Gimbal Ring 3 (Violet Refractive Accent)
const gyroRingGeo3 = new THREE.TorusGeometry(10.5, 0.4, 20, 48);
const gyroRingMat3 = new THREE.MeshStandardMaterial({
  color: 0xb026ff,
  metalness: 0.85,
  roughness: 0.18,
  emissive: 0x220033
});
const gyroRing3 = new THREE.Mesh(gyroRingGeo3, gyroRingMat3);
gyroRing3.rotation.y = Math.PI / 2;
stageGlassGroup.add(gyroRing3);

// Central Faceted Refractive Crystal Core
const crystalGeo = new THREE.IcosahedronGeometry(7.0, 0);
const crystalMat = new THREE.MeshPhysicalMaterial({
  color: 0x00f0ff,
  roughness: 0.05,
  metalness: 0.15,
  transmission: 0.88,
  ior: 1.52,
  thickness: 4.5,
  reflectivity: 0.9,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  emissive: 0x002233,
  emissiveIntensity: 0.45
});
const glassCoreMesh = new THREE.Mesh(crystalGeo, crystalMat);
stageGlassGroup.add(glassCoreMesh);

// Faceted Crystal Wireframe Accent
const crystalWireGeo = new THREE.IcosahedronGeometry(7.05, 0);
const crystalWireMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.65
});
const crystalWireMesh = new THREE.Mesh(crystalWireGeo, crystalWireMat);
stageGlassGroup.add(crystalWireMesh);

// Prismatic Ambient Caustic Sparkles
const sparkleCount = 240;
const sparklePos = new Float32Array(sparkleCount * 3);
for (let i = 0; i < sparkleCount; i++) {
  const i3 = i * 3;
  const r = 10 + Math.random() * 14;
  const theta = Math.random() * Math.PI * 2;
  const phi = (Math.random() - 0.5) * Math.PI;
  sparklePos[i3] = r * Math.cos(theta) * Math.cos(phi);
  sparklePos[i3 + 1] = r * Math.sin(phi);
  sparklePos[i3 + 2] = r * Math.sin(theta) * Math.cos(phi);
}
const sparkleGeo = new THREE.BufferGeometry();
sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
const sparkleMat = new THREE.PointsMaterial({
  color: 0x00f0ff,
  size: 1.8,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending
});
const glassSparkles = new THREE.Points(sparkleGeo, sparkleMat);
stageGlassGroup.add(glassSparkles);

// SLIDE 7: LAB 5 - TOPOLOGY MORPHING MESH
let morphGeo = new THREE.SphereGeometry(18, 64, 64);
const morphMat = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  wireframe: true,
  roughness: 0.2,
  metalness: 0.8
});
let morphMesh = new THREE.Mesh(morphGeo, morphMat);
let morphPosOrig = morphGeo.attributes.position.clone();
groups[7].add(morphMesh);

// ============================================================================
// SLIDE 8: 3D COSMIC CHRONOLOGY EXPANDING SPACETIME FUNNEL (BIG BANG TO FUTURE)
// ============================================================================
const stageFunnelGroup = new THREE.Group();
stageFunnelGroup.position.set(0, -6, -20);
stageFunnelGroup.rotation.x = 0.38;
stageFunnelGroup.rotation.y = -0.42;
groups[8].add(stageFunnelGroup);

// Relativistic Metric Funnel Geometry: Open conical trumpet expanding from Big Bang to Accelerating Horizon
const funnelLength = 110;
const funnelSegmentsRadial = 48;
const funnelSegmentsLength = 32;
const funnelGeo = new THREE.CylinderGeometry(34, 3.2, funnelLength, funnelSegmentsRadial, funnelSegmentsLength, true);
const fPos = funnelGeo.attributes.position;
for (let i = 0; i < fPos.count; i++) {
  const y = fPos.getY(i); // -55 to +55
  const normT = (y + 55) / 110.0;
  const radiusScale = Math.pow(normT, 0.62) * 1.05 + 0.08;
  fPos.setX(i, fPos.getX(i) * radiusScale);
  fPos.setZ(i, fPos.getZ(i) * radiusScale);
}
funnelGeo.computeVertexNormals();

const funnelMat = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  wireframe: true,
  transparent: true,
  opacity: 0.38,
  emissive: 0x002244,
  roughness: 0.2
});
const spacetimeFunnel = new THREE.Mesh(funnelGeo, funnelMat);
stageFunnelGroup.add(spacetimeFunnel);

// 10 Concentric Holographic Epoch Rings
const epochRings = [];
const epochColors = [
  0xffffff, // 1. Planck Era (pure hot quantum white)
  0xff3b00, // 2. GUT (intense thermal orange-red)
  0xff8800, // 3. Electroweak (amber)
  0xffcc00, // 4. Inflation (bright gold)
  0xffdd44, // 5. Nucleosynthesis (nuclear yellow)
  0x00f0ff, // 6. Recombination / CMB (cyan horizon)
  0x38bdf8, // 7. Cosmic Dawn / First Stars (sky blue)
  0x818cf8, // 8. Peak Starburst (indigo)
  0x00ff88, // 9. Present Day (emerald life / modern cosmos)
  0xb026ff  // 10. Accelerating Future (dark energy violet)
];

for (let i = 0; i < 10; i++) {
  const normT = i / 9.0;
  const yPos = -55 + normT * 110;
  const ringRadius = (34 * Math.pow(normT, 0.62) * 1.05 + 0.08 * 34) * 0.98;
  const ringGeo = new THREE.TorusGeometry(Math.max(3.2, ringRadius), 0.4, 12, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: epochColors[i],
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = yPos;
  stageFunnelGroup.add(ringMesh);
  epochRings.push(ringMesh);
}

// Swirling Primordial Matter Particles along the Funnel
const funnelPartCount = 800;
const funnelPartPos = new Float32Array(funnelPartCount * 3);
for (let i = 0; i < funnelPartCount; i++) {
  const i3 = i * 3;
  const normT = Math.random();
  const y = -55 + normT * 110;
  const maxR = (34 * Math.pow(normT, 0.62) * 1.05 + 2.5);
  const r = Math.random() * maxR;
  const theta = Math.random() * Math.PI * 2;
  funnelPartPos[i3] = r * Math.cos(theta);
  funnelPartPos[i3 + 1] = y;
  funnelPartPos[i3 + 2] = r * Math.sin(theta);
}
const funnelPartGeo = new THREE.BufferGeometry();
funnelPartGeo.setAttribute('position', new THREE.BufferAttribute(funnelPartPos, 3));
const funnelPartMat = new THREE.PointsMaterial({
  color: 0xffd700,
  size: 1.3,
  transparent: true,
  opacity: 0.75,
  blending: THREE.AdditiveBlending
});
const epochParticles = new THREE.Points(funnelPartGeo, funnelPartMat);
stageFunnelGroup.add(epochParticles);

// ============================================================================
// SLIDE 9: 3D HOLOGRAPHIC SILICON GPU COMPUTE DIE & MEMORY BUS ARRAY
// ============================================================================
const stageGpuGroup = new THREE.Group();
stageGpuGroup.position.set(0, -5, -18);
stageGpuGroup.rotation.x = 0.52;
stageGpuGroup.rotation.y = 0.35;
groups[9].add(stageGpuGroup);

// Central Monolithic Silicon Die
const dieGeo = new THREE.BoxGeometry(26, 3, 26);
const dieMat = new THREE.MeshStandardMaterial({
  color: 0x081220,
  metalness: 0.92,
  roughness: 0.18
});
const gpuDieMesh = new THREE.Mesh(dieGeo, dieMat);
stageGpuGroup.add(gpuDieMesh);

// Die Edge Bevel & Glowing Circuit Logic Lattice
const dieWireGeo = new THREE.BoxGeometry(26.2, 3.2, 26.2);
const dieWireMat = new THREE.MeshBasicMaterial({
  color: 0x00f0ff,
  wireframe: true,
  transparent: true,
  opacity: 0.75
});
const gpuWireMesh = new THREE.Mesh(dieWireGeo, dieWireMat);
stageGpuGroup.add(gpuWireMesh);

// 4 Orbiting Accelerator Clusters (Shaders, Physics, Audio, Compositing)
const clusterGroup = new THREE.Group();
stageGpuGroup.add(clusterGroup);

const clusterMeshes = [];
const clusterGeos = [
  new THREE.IcosahedronGeometry(3.5, 1),
  new THREE.OctahedronGeometry(3.2, 0),
  new THREE.DodecahedronGeometry(3.2, 0),
  new THREE.TorusGeometry(3.0, 1.0, 12, 24)
];
const clusterColors = [0x00f0ff, 0xffd700, 0xec4899, 0x00ff88];

for (let i = 0; i < 4; i++) {
  const cMat = new THREE.MeshStandardMaterial({
    color: clusterColors[i],
    wireframe: true,
    emissive: clusterColors[i],
    emissiveIntensity: 0.45
  });
  const cMesh = new THREE.Mesh(clusterGeos[i], cMat);
  const angle = (i / 4) * Math.PI * 2;
  cMesh.position.set(28 * Math.cos(angle), 0, 28 * Math.sin(angle));
  clusterGroup.add(cMesh);
  clusterMeshes.push(cMesh);
}

// Circular Memory Bus Interconnect
const busGeo = new THREE.RingGeometry(25, 31, 64);
const busMat = new THREE.MeshBasicMaterial({
  color: 0x00f0ff,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.25,
  wireframe: true
});
const memoryBusMesh = new THREE.Mesh(busGeo, busMat);
memoryBusMesh.rotation.x = Math.PI / 2;
stageGpuGroup.add(memoryBusMesh);

// Dynamic Bus Traffic Particles
const busPartCount = 220;
const busPartPos = new Float32Array(busPartCount * 3);
for (let i = 0; i < busPartCount; i++) {
  const i3 = i * 3;
  const angle = Math.random() * Math.PI * 2;
  const r = 26 + Math.random() * 4;
  busPartPos[i3] = r * Math.cos(angle);
  busPartPos[i3 + 1] = (Math.random() - 0.5) * 1.5;
  busPartPos[i3 + 2] = r * Math.sin(angle);
}
const busPartGeo = new THREE.BufferGeometry();
busPartGeo.setAttribute('position', new THREE.BufferAttribute(busPartPos, 3));
const busPartMat = new THREE.PointsMaterial({
  color: 0x00f0ff,
  size: 1.4,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending
});
const busParticles = new THREE.Points(busPartGeo, busPartMat);
stageGpuGroup.add(busParticles);

// ============================================================================
// SLIDE 10: PURE CYLINDRICAL LUMINOUS WORMHOLE (REVOLVING INCANDESCENT LIGHT)
// ============================================================================
/* ==========================================================================
   SLIDE 10: RELATIVISTIC WARP & SINGULARITY (AETHER LABORATORY SLIDE 8 INTERFACE)
   Zero elements from old Slide 10. Only Slide 8 streaming white light & singularity.
   ========================================================================== */
const stageWormholeGroup = new THREE.Group();
groups[10].add(stageWormholeGroup);

// Legacy references for test-suite / API compatibility
const wormholeParticles = null;
const wormholeRings = [];

// 1. Relativistic Warp Lines (Aether Laboratory Slide 8 Interface - Fast White Light)
let s8WarpLines, s8SingularityMesh;
const s8LineCount = 2000;
const s8LinePos = new Float32Array(s8LineCount * 6);
for (let i = 0; i < s8LineCount; i++) {
  const i6 = i * 6;
  const rad = 6.0 + Math.random() * 55.0;
  const angle = Math.random() * Math.PI * 2.0;
  const z = (Math.random() - 0.5) * 400.0;
  const len = 25.0 + Math.random() * 80.0;
  s8LinePos[i6] = Math.cos(angle) * rad;
  s8LinePos[i6 + 1] = Math.sin(angle) * rad;
  s8LinePos[i6 + 2] = z;
  s8LinePos[i6 + 3] = Math.cos(angle) * rad;
  s8LinePos[i6 + 4] = Math.sin(angle) * rad;
  s8LinePos[i6 + 5] = z - len;
}
const s8LineGeo = new THREE.BufferGeometry();
s8LineGeo.setAttribute('position', new THREE.BufferAttribute(s8LinePos, 3));
const s8LineMat = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.95,
  blending: THREE.AdditiveBlending
});
s8WarpLines = new THREE.LineSegments(s8LineGeo, s8LineMat);
stageWormholeGroup.add(s8WarpLines);

// 2. Central Singularity Black Sphere (Aether Laboratory Slide 8 Mesh)
const s8SingGeo = new THREE.SphereGeometry(6, 32, 32);
const s8SingMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
s8SingularityMesh = new THREE.Mesh(s8SingGeo, s8SingMat);
s8SingularityMesh.position.set(0, 0, 0);
stageWormholeGroup.add(s8SingularityMesh);
