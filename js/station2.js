// ============================================================================
// 6. DUAL-BAR NAVIGATION & PLANETARY SLIDER CONTROLLER
// ============================================================================
const domainTitle = document.getElementById('cosmic-domain-title');
const domainSub = document.getElementById('cosmic-domain-sub');
const distDisplay = document.getElementById('telemetry-distance');
const scaleDisplay = document.getElementById('telemetry-scale');
const redshiftDisplay = document.getElementById('telemetry-redshift');

const zoomSlider = document.getElementById('zoom-slider');
const planetSlider = document.getElementById('planet-slider');
const cosmicMacroPanel = document.getElementById('cosmic-macro-panel');
const solarExplorerPanel = document.getElementById('solar-explorer-panel');

// Planetary Navigation Waypoints & Telemetry
const planetaryData = {
  0: {
    name: "THE SUN // SOL (G2V YELLOW DWARF)",
    dist: "0.000 AU (0 KM)",
    vel: "220 KM/S (ORBIT AROUND SAG A*)",
    diam: "1,392,700 KM (109 × EARTH)",
    atmos: "H 73.5% · He 24.8% (5,778 K)"
  },
  250: {
    name: "PLANET MERCURY // SOL-1",
    dist: "0.387 AU (57.9M KM)",
    vel: "47.36 KM/S",
    diam: "4,879 KM (0.38 × EARTH)",
    atmos: "TRACE O₂, Na, H₂ (-180°C TO +430°C)"
  },
  500: {
    name: "PLANET VENUS // SOL-2",
    dist: "0.723 AU (108.2M KM)",
    vel: "35.02 KM/S",
    diam: "12,104 KM (0.95 × EARTH)",
    atmos: "CO₂ 96.5% · N₂ 3.5% (465°C RUNAWAY GREENHOUSE)"
  },
  750: {
    name: "PLANET EARTH // SOL-3 (TERRA)",
    dist: "1.000 AU (149.6M KM)",
    vel: "29.78 KM/S",
    diam: "12,742 KM (CRADLE OF HUMANITY)",
    atmos: "N₂ 78.1% · O₂ 20.9% · Ar 0.9% (+15°C)"
  },
  1000: {
    name: "PLANET MARS // SOL-4 (THE RED PLANET)",
    dist: "1.524 AU (227.9M KM)",
    vel: "24.07 KM/S",
    diam: "6,779 KM (0.53 × EARTH)",
    atmos: "CO₂ 95.3% · N₂ 2.6% · Ar 1.9% (-63°C)"
  },
  1250: {
    name: "PLANET JUPITER // SOL-5 (JOVIAN GIANT)",
    dist: "5.204 AU (778.5M KM)",
    vel: "13.07 KM/S",
    diam: "139,820 KM (11 × EARTH)",
    atmos: "H₂ 89.8% · He 10.2% (GREAT RED SPOT)"
  },
  1500: {
    name: "PLANET SATURN // SOL-6 (RINGED JEWEL)",
    dist: "9.582 AU (1.43B KM)",
    vel: "9.68 KM/S",
    diam: "116,460 KM (RING SPAN: 282,000 KM)",
    atmos: "H₂ 96.3% · He 3.25% (SPECTACULAR RINGS)"
  },
  1750: {
    name: "PLANET URANUS // SOL-7 (ICE GIANT)",
    dist: "19.20 AU (2.87B KM)",
    vel: "6.80 KM/S",
    diam: "50,724 KM (97.8° AXIAL TILT)",
    atmos: "H₂ 82.5% · He 15.2% · CH₄ 2.3% (-197°C)"
  },
  2000: {
    name: "PLANET NEPTUNE // SOL-8 (DEEP VOYAGER)",
    dist: "30.05 AU (4.50B KM)",
    vel: "5.43 KM/S",
    diam: "49,244 KM (SUPERSONIC WINDS)",
    atmos: "H₂ 80% · He 19% · CH₄ 1.5% (-201°C)"
  }
};

const planetStations = [
  { pVal: 0, target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 4.0, 18.5) },
  { pVal: 250, target: new THREE.Vector3(16, 0, 0), cam: new THREE.Vector3(16, 1.2, 4.0) },
  { pVal: 500, target: new THREE.Vector3(28, 0, 0), cam: new THREE.Vector3(28, 1.8, 5.5) },
  { pVal: 750, target: new THREE.Vector3(44, 0, 0), cam: new THREE.Vector3(44, 1.8, 6.0) }, // Earth & Moon
  { pVal: 1000, target: new THREE.Vector3(60, 0, 0), cam: new THREE.Vector3(60, 1.5, 4.8) },
  { pVal: 1250, target: new THREE.Vector3(82, 0, 0), cam: new THREE.Vector3(82, 4.0, 14.0) },
  { pVal: 1500, target: new THREE.Vector3(110, 0, 0), cam: new THREE.Vector3(110, 5.0, 16.0) },
  { pVal: 1750, target: new THREE.Vector3(138, 0, 0), cam: new THREE.Vector3(138, 2.2, 7.5) },
  { pVal: 2000, target: new THREE.Vector3(166, 0, 0), cam: new THREE.Vector3(166, 3.0, 9.5) }
];

let isPlanetaryMode = false;

// BAR 1: COSMIC MACRO ZOOM (10^26 m -> 10^11 m)
// Smooth continuous voyage across full slider track (0 to 1000)
function updateCosmicZoom(val) {
  if (isPlanetaryMode) return;
  const numVal = parseFloat(val);
  const t = numVal / 1000;

  // Render Solar System / Sol upon completion of cosmic journey (val >= 995 / 1000)
  if (numVal >= 995 || t >= 0.995) {
    switchToSolarExplorer(0); // Full completion handoff to Sol (There must just be Sun)
    return;
  }

  const targetZ = 360 * Math.pow(0.015, t);
  camera.position.set(0, 0, Math.max(targetZ, 12.0));
  controls.target.set(0, 0, 0);

  document.querySelectorAll('.jump-pill[data-zoom]').forEach(p => {
    p.classList.toggle('active', Math.abs(parseInt(p.dataset.zoom) - val) < 110);
  });

  // Stage 1: Universe Bubble
  if (t < 0.26) {
    stageBubbleGroup.visible = true;
    const fade = Math.max(0, 1 - (t / 0.22));
    if (typeof bubbleMat !== 'undefined' && bubbleMat) bubbleMat.opacity = fade * 0.85;
    if (typeof bubbleAtmosMat !== 'undefined' && bubbleAtmosMat && bubbleAtmosMat.uniforms && bubbleAtmosMat.uniforms.uOpacity) {
      bubbleAtmosMat.uniforms.uOpacity.value = fade * 0.9;
    }
    if (typeof bubbleHalo !== 'undefined' && bubbleHalo && bubbleHalo.material) bubbleHalo.material.opacity = fade * 0.5;
  } else {
    stageBubbleGroup.visible = false;
  }

  // Stage 2: Cosmic Web
  if (t >= 0.10 && t < 0.50) {
    stageWebGroup.visible = true;
    let webAlpha = 1.0;
    if (t < 0.24) webAlpha = (t - 0.10) / 0.14;
    else if (t > 0.40) webAlpha = 1 - (t - 0.40) / 0.10;
    webLineMat.opacity = Math.max(0, Math.min(1, webAlpha)) * 0.75;
  } else {
    stageWebGroup.visible = false;
  }

  // Stage 3: Laniakea
  if (t >= 0.36 && t < 0.72) {
    stageLaniakeaGroup.visible = true;
    let lanAlpha = 1.0;
    if (t < 0.48) lanAlpha = (t - 0.36) / 0.12;
    else if (t > 0.62) lanAlpha = 1 - (t - 0.62) / 0.10;
    laniakeaMat.opacity = Math.max(0, Math.min(1, lanAlpha)) * 0.85;
  } else {
    stageLaniakeaGroup.visible = false;
  }

  // Stage 4: Milky Way Spiral Galaxy (0.58 <= t < 0.995)
  if (t >= 0.58 && t < 0.995) {
    stageGalaxyGroup.visible = true;
    let mwAlpha = 1.0;
    if (t < 0.68) mwAlpha = (t - 0.58) / 0.10;
    else if (t > 0.88) mwAlpha = 1 - (t - 0.88) / 0.11;
    const clampedMw = Math.max(0, Math.min(1, mwAlpha));
    mwMat.opacity = clampedMw * 0.95;
    emMat.opacity = clampedMw * 0.85;
    dustMat.opacity = clampedMw * 0.82;
    gasSpriteMat.opacity = clampedMw * 0.26;
    if (typeof bulgeMat !== 'undefined' && bulgeMat) bulgeMat.opacity = clampedMw * 0.95;
    if (typeof coreGlowMat !== 'undefined' && coreGlowMat) coreGlowMat.opacity = clampedMw * 1.0;
    if (typeof coreGlowMidMat !== 'undefined' && coreGlowMidMat) coreGlowMidMat.opacity = clampedMw * 0.75;
    if (typeof coreGlowOuterMat !== 'undefined' && coreGlowOuterMat) coreGlowOuterMat.opacity = clampedMw * 0.35;
    solPinMat.opacity = clampedMw;
    solOuterRingMat.opacity = clampedMw * 0.75;
  } else {
    stageGalaxyGroup.visible = false;
  }

  // Solar system preview is strictly hidden during Milky Way to eliminate yellow spot
  stageSolarGroup.visible = false;

  // HUD Readouts across full 0 -> 1000 range
  if (t < 0.20) {
    domainTitle.textContent = "THE OBSERVABLE UNIVERSE";
    domainSub.textContent = "COSMIC MICROWAVE HORIZON // 10^26 METERS";
    distDisplay.textContent = "93.0 BILLION LY";
    scaleDisplay.textContent = "10^26 m";
    redshiftDisplay.textContent = "z = 1100";
  } else if (t < 0.45) {
    domainTitle.textContent = "THE COSMIC WEB";
    domainSub.textContent = "DARK MATTER FILAMENTARY NETWORK // 10^24 METERS";
    distDisplay.textContent = "1.2 BILLION LY";
    scaleDisplay.textContent = "10^24 m";
    redshiftDisplay.textContent = "z = 4.5";
  } else if (t < 0.68) {
    domainTitle.textContent = "LANIAKEA SUPERCLUSTER";
    domainSub.textContent = "GREAT ATTRACTOR VELOCITY STREAM // 10^22 METERS";
    distDisplay.textContent = "250 MILLION LY";
    scaleDisplay.textContent = "10^22 m";
    redshiftDisplay.textContent = "z = 0.07";
  } else if (t < 0.88) {
    domainTitle.textContent = "THE MILKY WAY GALAXY";
    domainSub.textContent = "ORION-CYGNUS SPUR [SOL-3] // 10^18 METERS";
    distDisplay.textContent = "100,000 LY";
    scaleDisplay.textContent = "10^18 m";
    redshiftDisplay.textContent = "z = 0.00";
  } else {
    domainTitle.textContent = "ORION SPUR // SOLAR NEIGHBORHOOD";
    domainSub.textContent = "APPROACHING SOLAR SYSTEM // HELIOPAUSE (10^12 METERS)";
    distDisplay.textContent = "120 AU";
    scaleDisplay.textContent = "10^12 m";
    redshiftDisplay.textContent = "z = 0.00";
  }
}

// BAR 2: EXTENDED SOLAR SYSTEM PLANETARY EXPLORER (0 to 2000)
// User slides directly towards Earth and between all 8 planets
function updatePlanetaryZoom(val) {
  const pVal = Math.max(0, Math.min(2000, parseFloat(val)));

  // Find surrounding planetary waypoints (pVal = 0 focuses seamlessly on Sol)
  let idx = 0;
  for (let i = 0; i < planetStations.length - 1; i++) {
    if (pVal >= planetStations[i].pVal && pVal <= planetStations[i + 1].pVal) {
      idx = i;
      break;
    }
  }
  const sA = planetStations[idx];
  const sB = planetStations[idx + 1];
  const u = (pVal - sA.pVal) / (sB.pVal - sA.pVal);
  const s = u * u * (3 - 2 * u); // smoothstep

  // Smoothly interpolate Camera and LookAt Target
  const curTarget = new THREE.Vector3().lerpVectors(sA.target, sB.target, s);
  const curCam = new THREE.Vector3().lerpVectors(sA.cam, sB.cam, s);

  camera.position.copy(curCam);
  controls.target.copy(curTarget);
  if (controls && controls.update) controls.update();

  // When focused on Sol (pVal < 80), isolate the Sun so "there must just be sun"
  const isSolFocus = (pVal < 80);
  orbitRings.forEach(ring => { ring.visible = !isSolFocus; });
  if (typeof mercuryMesh !== 'undefined' && mercuryMesh) mercuryMesh.visible = !isSolFocus;
  if (typeof venusMesh !== 'undefined' && venusMesh) venusMesh.visible = !isSolFocus;
  if (typeof earthGroup !== 'undefined' && earthGroup) earthGroup.visible = !isSolFocus;
  if (typeof marsMesh !== 'undefined' && marsMesh) marsMesh.visible = !isSolFocus;
  if (typeof jupiterMesh !== 'undefined' && jupiterMesh) jupiterMesh.visible = !isSolFocus;
  if (typeof saturnGroup !== 'undefined' && saturnGroup) saturnGroup.visible = !isSolFocus;
  if (typeof uranusGroup !== 'undefined' && uranusGroup) uranusGroup.visible = !isSolFocus;
  if (typeof neptuneMesh !== 'undefined' && neptuneMesh) neptuneMesh.visible = !isSolFocus;

  // Update active pill
  let closestStation = 0;
  let minDiff = Infinity;
  document.querySelectorAll('.planet-jump-pill[data-pzoom]').forEach(pill => {
    const pz = parseInt(pill.dataset.pzoom);
    const diff = Math.abs(pz - pVal);
    if (diff < minDiff) {
      minDiff = diff;
      closestStation = pz;
    }
    pill.classList.toggle('active', diff < 120);
  });

  // Update Telemetry Row
  const data = planetaryData[closestStation] || planetaryData[0];
  document.getElementById('planet-name').textContent = data.name;
  document.getElementById('planet-dist').textContent = data.dist;
  document.getElementById('planet-vel').textContent = data.vel;
  document.getElementById('planet-diam').textContent = data.diam;
  document.getElementById('planet-atmos').textContent = data.atmos;

  if (closestStation === 0 || pVal < 80) {
    domainTitle.textContent = "THE SUN // SOL";
    domainSub.textContent = "SOLAR SYSTEM EXPLORER // CENTRAL STELLAR ENGINE [0 / 2000]";
  } else {
    domainTitle.textContent = data.name.split('//')[0].trim();
    domainSub.textContent = `SOLAR SYSTEM EXPLORER // ORBITAL STATION ${closestStation} / 2000`;
  }
}

// HANDOFF CONTROLS: DUAL-BAR SWITCHING (Bidirectional transition from each end)
function switchToSolarExplorer(initialPVal = 0) {
  isPlanetaryMode = true;
  if (cosmicMacroPanel) cosmicMacroPanel.style.display = 'none';
  if (solarExplorerPanel) {
    solarExplorerPanel.style.display = 'flex';
  }

  // Ensure Solar group is visible and macro groups hidden
  stageBubbleGroup.visible = false;
  stageWebGroup.visible = false;
  stageLaniakeaGroup.visible = false;
  stageGalaxyGroup.visible = false;
  stageSolarGroup.visible = true;

  // Set Sol camera perspective
  camera.position.set(0, 4.0, 18.5);
  controls.target.set(0, 0, 0);
  if (controls && controls.update) controls.update();

  // Enforce Sol macro telemetry headers
  domainTitle.textContent = "THE SUN // SOL";
  domainSub.textContent = "SOLAR SYSTEM EXPLORER // CENTRAL STELLAR ENGINE [0 / 2000]";
  distDisplay.textContent = "0.000 AU";
  scaleDisplay.textContent = "10^11 m";
  redshiftDisplay.textContent = "z = 0.00";

  playAccessGrantedSound();
  if (planetSlider) {
    planetSlider.value = initialPVal;
  }
  updatePlanetaryZoom(initialPVal);
}

function switchToCosmicMacro() {
  isPlanetaryMode = false;
  if (solarExplorerPanel) solarExplorerPanel.style.display = 'none';
  if (cosmicMacroPanel) cosmicMacroPanel.style.display = 'flex';

  controls.target.set(0, 0, 0);
  if (zoomSlider) {
    zoomSlider.value = 750; // Milky Way Orion Spur waypoint (750)
    updateCosmicZoom(750);
  }
  playKeyClick();
}

// Event Listeners
zoomSlider.addEventListener('input', e => updateCosmicZoom(e.target.value));
planetSlider.addEventListener('input', e => updatePlanetaryZoom(e.target.value));

document.getElementById('btn-return-cosmic').addEventListener('click', () => switchToCosmicMacro());

const btnFocusSol = document.getElementById('btn-focus-sol');
if (btnFocusSol) {
  btnFocusSol.addEventListener('click', () => {
    if (planetSlider) {
      planetSlider.value = 0;
      updatePlanetaryZoom(0);
    }
    playKeyClick();
  });
}

document.querySelectorAll('.jump-pill[data-zoom]').forEach(pill => {
  pill.addEventListener('click', () => {
    const targetVal = parseInt(pill.dataset.zoom);
    if (targetVal >= 990) {
      if (zoomSlider) zoomSlider.value = 1000;
      switchToSolarExplorer(0);
    } else {
      zoomSlider.value = targetVal;
      updateCosmicZoom(targetVal);
    }
    playKeyClick();
  });
});

document.querySelectorAll('.planet-jump-pill[data-pzoom]').forEach(pill => {
  pill.addEventListener('click', () => {
    const pVal = parseInt(pill.dataset.pzoom);
    planetSlider.value = pVal;
    updatePlanetaryZoom(pVal);
    playKeyClick();
  });
});

// ============================================================================
// CELESTIAL ATLAS & COSMIC ARCHITECTURE MODAL CONTROLLER
// Bulletproof multi-trigger close (ESC key, backdrop click, header & footer buttons)
// ============================================================================
function closeDiagramModal() {
  const modal = document.getElementById('orbital-diagram-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  if (typeof playKeyClick === 'function') playKeyClick();
}
window.closeDiagramModal = closeDiagramModal;

function openDiagramModal() {
  const modal = document.getElementById('orbital-diagram-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
  if (typeof playKeyClick === 'function') playKeyClick();
}
window.openDiagramModal = openDiagramModal;

function switchAtlasTab(tab) {
  const solarView = document.getElementById('atlas-view-solar');
  const universeView = document.getElementById('atlas-view-universe');
  const btnSolar = document.getElementById('tab-btn-solar');
  const btnUniverse = document.getElementById('tab-btn-universe');

  if (tab === 'solar') {
    if (solarView) solarView.style.display = 'block';
    if (universeView) universeView.style.display = 'none';
    if (btnSolar) btnSolar.classList.add('active');
    if (btnUniverse) btnUniverse.classList.remove('active');
  } else {
    if (solarView) solarView.style.display = 'none';
    if (universeView) universeView.style.display = 'block';
    if (btnSolar) btnSolar.classList.remove('active');
    if (btnUniverse) btnUniverse.classList.add('active');
  }
  if (typeof playKeyClick === 'function') playKeyClick();
}
window.switchAtlasTab = switchAtlasTab;

// Wire up event listeners
const btnToggleDiagram = document.getElementById('btn-toggle-diagram');
if (btnToggleDiagram) {
  btnToggleDiagram.addEventListener('click', () => {
    const modal = document.getElementById('orbital-diagram-modal');
    if (modal && modal.style.display === 'flex') {
      closeDiagramModal();
    } else {
      openDiagramModal();
    }
  });
}

const btnCloseDiagram = document.getElementById('btn-close-diagram');
if (btnCloseDiagram) {
  btnCloseDiagram.addEventListener('click', closeDiagramModal);
}

// Backdrop click closes modal
const modalOverlay = document.getElementById('orbital-diagram-modal');
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) {
      closeDiagramModal();
    }
  });
}

// Global ESC key closes modal
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('orbital-diagram-modal');
    if (modal && modal.style.display === 'flex') {
      closeDiagramModal();
    }
  }
});


// CLEAN VIEW & REMOVABLE HUD CONTROLLER (Hotkey: H)
let isHudCleanView = false;
function toggleCleanHud() {
  isHudCleanView = !isHudCleanView;
  const macro = document.getElementById('cosmic-macro-panel');
  const solar = document.getElementById('solar-explorer-panel');
  const header = document.querySelector('.cosmic-header-telemetry');
  const icon = document.getElementById('hud-toggle-icon');
  const text = document.getElementById('hud-toggle-text');
  const btn = document.getElementById('btn-toggle-hud');

  if (isHudCleanView) {
    if (macro) macro.classList.add('hud-hidden');
    if (solar) solar.classList.add('hud-hidden');
    if (header) header.classList.add('hud-hidden');
    if (icon) icon.textContent = '👁️';
    if (text) text.textContent = 'RESTORE HUD [H]';
    if (btn) {
      btn.style.borderColor = 'var(--accent-gold)';
      btn.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
    }
  } else {
    if (macro) macro.classList.remove('hud-hidden');
    if (solar) solar.classList.remove('hud-hidden');
    if (header) header.classList.remove('hud-hidden');
    if (icon) icon.textContent = '👁️';
    if (text) text.textContent = 'CLEAN VIEW [H]';
    if (btn) {
      btn.style.borderColor = 'var(--accent-cyan)';
      btn.style.boxShadow = '0 4px 20px rgba(0, 240, 255, 0.25)';
    }
  }
  playKeyClick();
}

const toggleHudBtn = document.getElementById('btn-toggle-hud');
if (toggleHudBtn) toggleHudBtn.addEventListener('click', toggleCleanHud);
const minMacroBtn = document.getElementById('btn-min-macro');
if (minMacroBtn) minMacroBtn.addEventListener('click', toggleCleanHud);
const minSolarBtn = document.getElementById('btn-min-solar');
if (minSolarBtn) minSolarBtn.addEventListener('click', toggleCleanHud);

window.addEventListener('keydown', e => {
  if ((e.key === 'h' || e.key === 'H') && currentSlide === 2) {
    toggleCleanHud();
  }
});
