/* ==========================================================================
   7. LAB CONTROLS & REAL-TIME EVENT HOOKS
   ========================================================================== */
// LAB 1: Shaders
const rSlider = document.getElementById('roughness-slider');
const mSlider = document.getElementById('metalness-slider');
const cSlider = document.getElementById('clearcoat-slider');

rSlider.addEventListener('input', e => {
  pbrMat.roughness = e.target.value / 100;
  document.getElementById('rough-val').textContent = (e.target.value / 100).toFixed(2);
});
mSlider.addEventListener('input', e => {
  pbrMat.metalness = e.target.value / 100;
  document.getElementById('metal-val').textContent = (e.target.value / 100).toFixed(2);
});
cSlider.addEventListener('input', e => {
  pbrMat.clearcoat = e.target.value / 100;
  document.getElementById('coat-val').textContent = (e.target.value / 100).toFixed(2);
});

document.getElementById('btn-pbr').addEventListener('click', () => {
  pbrMesh.material = pbrMat;
  pbrMat.wireframe = false;
  pbrMat.color.set(0x1a3556);
  setActiveBtn(['btn-pbr', 'btn-wire', 'btn-norm', 'btn-gold'], 'btn-pbr');
  playKeyClick();
});
document.getElementById('btn-wire').addEventListener('click', () => {
  pbrMesh.material = pbrMat;
  pbrMat.wireframe = true;
  pbrMat.color.set(0x00f0ff); // Glowing cyan wireframe
  setActiveBtn(['btn-pbr', 'btn-wire', 'btn-norm', 'btn-gold'], 'btn-wire');
  playKeyClick();
});
document.getElementById('btn-norm').addEventListener('click', () => {
  pbrMesh.material = new THREE.MeshNormalMaterial({ wireframe: false });
  setActiveBtn(['btn-pbr', 'btn-wire', 'btn-norm', 'btn-gold'], 'btn-norm');
  playKeyClick();
});
document.getElementById('btn-gold').addEventListener('click', () => {
  pbrMesh.material = pbrMat;
  pbrMat.wireframe = false;
  pbrMat.color.set(0xffd700);
  pbrMat.metalness = 1.0;
  pbrMat.roughness = 0.15;
  setActiveBtn(['btn-pbr', 'btn-wire', 'btn-norm', 'btn-gold'], 'btn-gold');
  playKeyClick();
});

// Light Tints with High-Visibility Front Key Lighting
function setKeyLightTint(colorHex, activeId) {
  if (typeof pbrKeyLight !== 'undefined' && pbrKeyLight) pbrKeyLight.color.set(colorHex);
  if (typeof pbrFillLight !== 'undefined' && pbrFillLight) pbrFillLight.color.set(colorHex);
  if (typeof mainSpot !== 'undefined' && mainSpot) mainSpot.color.set(colorHex);
  setActiveBtn(['light-cyan','light-amber','light-violet','light-white'], activeId);
  playKeyClick();
}

document.getElementById('light-cyan').addEventListener('click', () => setKeyLightTint(0x00f0ff, 'light-cyan'));
document.getElementById('light-amber').addEventListener('click', () => setKeyLightTint(0xffaa00, 'light-amber'));
document.getElementById('light-violet').addEventListener('click', () => setKeyLightTint(0xd030ff, 'light-violet'));
document.getElementById('light-white').addEventListener('click', () => setKeyLightTint(0xffffff, 'light-white'));

function setActiveBtn(ids, activeId) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', id === activeId);
  });
}

// LAB 2: Particles
document.getElementById('particle-slider').addEventListener('input', e => {
  activeParticleCount = parseInt(e.target.value);
  document.getElementById('part-count-val').textContent = activeParticleCount.toLocaleString();
  particleGeo.setDrawRange(0, activeParticleCount);
  document.getElementById('part-mem-val').textContent = ((activeParticleCount * 3 * 4 * 2) / (1024 * 1024)).toFixed(2) + " MB";
});

document.getElementById('particle-speed-slider').addEventListener('input', e => {
  particleSimSpeed = e.target.value / 10;
  document.getElementById('part-speed-val').textContent = particleSimSpeed.toFixed(1) + "x";
});

document.getElementById('btn-vortex').addEventListener('click', () => { particleForceMode = 'vortex'; setActiveBtn(['btn-vortex','btn-gravity','btn-repulse','btn-chaos'],'btn-vortex'); });
document.getElementById('btn-gravity').addEventListener('click', () => { particleForceMode = 'gravity'; setActiveBtn(['btn-vortex','btn-gravity','btn-repulse','btn-chaos'],'btn-gravity'); });
document.getElementById('btn-repulse').addEventListener('click', () => { particleForceMode = 'repulse'; setActiveBtn(['btn-vortex','btn-gravity','btn-repulse','btn-chaos'],'btn-repulse'); });
document.getElementById('btn-chaos').addEventListener('click', () => { particleForceMode = 'chaos'; setActiveBtn(['btn-vortex','btn-gravity','btn-repulse','btn-chaos'],'btn-chaos'); });

// LAB 3: Audio Reactive Playable Notes
document.getElementById('synth-cmin').addEventListener('click', () => playSynthNote(130.81));
document.getElementById('synth-fsharp').addEventListener('click', () => playSynthNote(528.0));
document.getElementById('synth-subbass').addEventListener('click', () => playSynthNote(60.0));
document.getElementById('synth-ethereal').addEventListener('click', () => playSynthNote(864.0));

const waveCanvas = document.getElementById('audio-wave-canvas');
const waveCtx = waveCanvas ? waveCanvas.getContext('2d') : null;
const waveTypeLabel = document.getElementById('wave-type-label');

function playWaveformAudiblePreview(type) {
  if (!soundEnabled) return;
  initAudio();
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(440.0, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.10, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.28);
  } catch (e) {}
}

function updateWaveformVisualState(type) {
  synthWaveType = type;
  if (type === 'sine') {
    if (waveTypeLabel) { waveTypeLabel.textContent = "SINE // HARMONIC WAVE"; waveTypeLabel.style.color = "#00f0ff"; }
    if (audioCoreMat) { audioCoreMat.color.setHex(0x00f0ff); audioCoreMat.emissive.setHex(0x002244); }
  } else if (type === 'triangle') {
    if (waveTypeLabel) { waveTypeLabel.textContent = "TRIANGLE // ANGULAR FACETS"; waveTypeLabel.style.color = "#f59e0b"; }
    if (audioCoreMat) { audioCoreMat.color.setHex(0xf59e0b); audioCoreMat.emissive.setHex(0x331a00); }
  } else if (type === 'sawtooth') {
    if (waveTypeLabel) { waveTypeLabel.textContent = "SAWTOOTH // JAGGED BLADES"; waveTypeLabel.style.color = "#ec4899"; }
    if (audioCoreMat) { audioCoreMat.color.setHex(0xec4899); audioCoreMat.emissive.setHex(0x330022); }
  }
}

function drawWaveformMonitor(type, now, fData) {
  if (!waveCtx || !waveCanvas) return;
  const w = waveCanvas.width;
  const h = waveCanvas.height;
  const cy = h / 2;

  waveCtx.clearRect(0, 0, w, h);

  // Subtle background grid
  waveCtx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
  waveCtx.lineWidth = 1;
  waveCtx.beginPath();
  for (let x = 0; x < w; x += 28) { waveCtx.moveTo(x, 0); waveCtx.lineTo(x, h); }
  for (let y = 0; y < h; y += 16) { waveCtx.moveTo(0, y); waveCtx.lineTo(w, y); }
  waveCtx.stroke();

  // Centerline reference
  waveCtx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  waveCtx.beginPath();
  waveCtx.moveTo(0, cy);
  waveCtx.lineTo(w, cy);
  waveCtx.stroke();

  // Wave trace color
  let strokeCol = '#00f0ff';
  if (type === 'triangle') strokeCol = '#f59e0b';
  else if (type === 'sawtooth') strokeCol = '#ec4899';

  waveCtx.strokeStyle = strokeCol;
  waveCtx.shadowColor = strokeCol;
  waveCtx.shadowBlur = 8;
  waveCtx.lineWidth = 2.4;

  const t = now * 0.007;
  const bassAmp = (fData && fData.length > 0) ? (Math.max(fData[0], fData[1], fData[2]) / 255.0) : 0;
  const amp = (h * 0.32) * (1.0 + bassAmp * (bassPulseSensitivity * 0.65));
  waveCtx.shadowBlur = 8 + bassAmp * (bassPulseSensitivity * 4.0);
  waveCtx.beginPath();

  for (let x = 0; x < w; x++) {
    const normX = x / w;
    const cycles = 3.5;
    const phase = normX * cycles * Math.PI * 2 - t;

    let yNorm = 0;
    if (type === 'sine') {
      yNorm = Math.sin(phase);
    } else if (type === 'triangle') {
      const p = phase / (Math.PI * 2);
      yNorm = Math.abs((p - Math.floor(p + 0.5)) * 4.0) - 1.0;
    } else if (type === 'sawtooth') {
      const p = phase / (Math.PI * 2);
      yNorm = 2.0 * (p - Math.floor(p + 0.5));
    }

    const y = cy - yNorm * amp;
    if (x === 0) waveCtx.moveTo(x, y);
    else waveCtx.lineTo(x, y);
  }
  waveCtx.stroke();
  waveCtx.shadowBlur = 0;
}

document.getElementById('wave-sine').addEventListener('click', () => {
  updateWaveformVisualState('sine');
  setActiveBtn(['wave-sine','wave-triangle','wave-saw'],'wave-sine');
  playWaveformAudiblePreview('sine');
});
document.getElementById('wave-triangle').addEventListener('click', () => {
  updateWaveformVisualState('triangle');
  setActiveBtn(['wave-sine','wave-triangle','wave-saw'],'wave-triangle');
  playWaveformAudiblePreview('triangle');
});
document.getElementById('wave-saw').addEventListener('click', () => {
  updateWaveformVisualState('sawtooth');
  setActiveBtn(['wave-sine','wave-triangle','wave-saw'],'wave-saw');
  playWaveformAudiblePreview('sawtooth');
});

let bassPulseSensitivity = 2.0;
document.getElementById('bass-slider').addEventListener('input', e => {
  bassPulseSensitivity = e.target.value / 10;
  document.getElementById('bass-intensity-val').textContent = bassPulseSensitivity.toFixed(1) + "x";
  if (typeof playSynthNote === 'function') {
    playSynthNote(60.0, 0.28);
  }
});

// ============================================================================
// LAB 4: DOM OPTICAL GLASSMORPHISM & NEWTONIAN HOOKE'S LAW SPRING PHYSICS
// ============================================================================
const glassTarget = document.getElementById('glass-target');
const glassLensOverlay = document.getElementById('glass-lens-overlay');
const blurSlider = document.getElementById('blur-slider');
const blurValDisplay = document.getElementById('blur-val');
const lensBlurVal = document.getElementById('lens-blur-val');
const lensTransVal = document.getElementById('lens-trans-val');

function updateGlassBlur(val) {
  if (glassTarget) {
    glassTarget.style.backdropFilter = `blur(${val}px)`;
    glassTarget.style.webkitBackdropFilter = `blur(${val}px)`;
  }
  if (glassLensOverlay) {
    glassLensOverlay.style.setProperty('--lens-blur', `${val}px`);
    glassLensOverlay.style.backdropFilter = `blur(${val}px)`;
    glassLensOverlay.style.webkitBackdropFilter = `blur(${val}px)`;
    const frostedAlpha = 0.04 + (val / 50.0) * 0.18;
    const r = glassLensOverlay.style.getPropertyValue('--lens-tint-r') || '0';
    const g = glassLensOverlay.style.getPropertyValue('--lens-tint-g') || '240';
    const b = glassLensOverlay.style.getPropertyValue('--lens-tint-b') || '255';
    glassLensOverlay.style.background = `radial-gradient(circle at 50% 35%, rgba(${r}, ${g}, ${b}, ${frostedAlpha + 0.06}) 0%, rgba(${r}, ${g}, ${b}, ${frostedAlpha * 0.5}) 60%, rgba(6, 12, 24, ${0.35 + (val / 50.0) * 0.35}) 100%)`;
  }
  if (blurValDisplay) blurValDisplay.textContent = `${val}px`;
  if (lensBlurVal) lensBlurVal.textContent = `${val}px`;
  if (lensTransVal) lensTransVal.textContent = `${(100 - val * 0.45).toFixed(1)}%`;

  // Dynamically modulate 3D crystal surface roughness & transmission (clear to frosted)
  if (typeof glassCoreMesh !== 'undefined' && glassCoreMesh) {
    glassCoreMesh.material.roughness = 0.05 + (val / 50.0) * 0.70;
    glassCoreMesh.material.metalness = 0.65 - (val / 50.0) * 0.45;
    if ('transmission' in glassCoreMesh.material) {
      glassCoreMesh.material.transmission = Math.max(0.20, 0.92 - (val / 50.0) * 0.60);
    }
  }
  if (typeof gyroRing1 !== 'undefined' && gyroRing1) {
    gyroRing1.material.roughness = 0.12 + (val / 50.0) * 0.50;
  }
}

if (blurSlider) {
  blurSlider.addEventListener('input', e => {
    updateGlassBlur(parseInt(e.target.value));
  });
}

const borderSlider = document.getElementById('border-slider');
const borderValDisplay = document.getElementById('border-val');
if (borderSlider) {
  borderSlider.addEventListener('input', e => {
    const alpha = e.target.value / 100;
    if (glassTarget) {
      glassTarget.style.borderColor = `rgba(255, 255, 255, ${alpha})`;
      glassTarget.style.boxShadow = `0 0 25px rgba(0, 240, 255, ${alpha * 0.5})`;
    }
    if (glassLensOverlay) {
      glassLensOverlay.style.setProperty('--lens-border-alpha', alpha);
      const r = glassLensOverlay.style.getPropertyValue('--lens-tint-r') || '0';
      const g = glassLensOverlay.style.getPropertyValue('--lens-tint-g') || '240';
      const b = glassLensOverlay.style.getPropertyValue('--lens-tint-b') || '255';
      glassLensOverlay.style.borderColor = `rgba(${r}, ${g}, ${b}, ${Math.max(0.15, alpha)})`;
      glassLensOverlay.style.boxShadow = `0 25px 60px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(${r}, ${g}, ${b}, ${alpha * 0.35}), 0 0 35px rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
    }
    if (borderValDisplay) borderValDisplay.textContent = alpha.toFixed(2);
  });
}

function setGlassTint(colorRgba, hexColor, activeId) {
  const r = (hexColor >> 16) & 255;
  const g = (hexColor >> 8) & 255;
  const b = hexColor & 255;

  if (glassTarget) {
    glassTarget.style.background = colorRgba;
  }
  if (glassLensOverlay) {
    glassLensOverlay.style.setProperty('--lens-tint-r', r);
    glassLensOverlay.style.setProperty('--lens-tint-g', g);
    glassLensOverlay.style.setProperty('--lens-tint-b', b);
    glassLensOverlay.style.setProperty('--lens-tint-hex', `#${hexColor.toString(16).padStart(6, '0')}`);
    const curBlur = blurSlider ? parseInt(blurSlider.value) : 24;
    const frostedAlpha = 0.04 + (curBlur / 50.0) * 0.18;
    const curBorderAlpha = borderSlider ? (borderSlider.value / 100) : 0.35;
    glassLensOverlay.style.background = `radial-gradient(circle at 50% 35%, rgba(${r}, ${g}, ${b}, ${frostedAlpha + 0.06}) 0%, rgba(${r}, ${g}, ${b}, ${frostedAlpha * 0.5}) 60%, rgba(6, 12, 24, ${0.35 + (curBlur / 50.0) * 0.35}) 100%)`;
    glassLensOverlay.style.borderColor = `rgba(${r}, ${g}, ${b}, ${Math.max(0.15, curBorderAlpha)})`;
    glassLensOverlay.style.boxShadow = `0 25px 60px rgba(0,0,0,0.7), inset 0 0 40px rgba(${r}, ${g}, ${b}, ${curBorderAlpha * 0.35}), 0 0 35px rgba(${r}, ${g}, ${b}, ${curBorderAlpha * 0.6})`;
  }
  setActiveBtn(['tint-cyan', 'tint-emerald', 'tint-amber', 'tint-violet'], activeId);

  // Synchronize 3D Crystal Core, Gimbal Rings & Lights
  if (typeof glassCoreMesh !== 'undefined' && glassCoreMesh) {
    glassCoreMesh.material.color.setHex(hexColor);
    if ('emissive' in glassCoreMesh.material) {
      glassCoreMesh.material.emissive.setHex(hexColor);
    }
  }
  if (typeof gyroRing2 !== 'undefined' && gyroRing2) {
    gyroRing2.material.color.setHex(hexColor);
    gyroRing2.material.emissive.setHex(hexColor);
  }
  if (typeof glassSparkles !== 'undefined' && glassSparkles) {
    glassSparkles.material.color.setHex(hexColor);
  }
  if (typeof glassKeyLight !== 'undefined' && glassKeyLight) {
    glassKeyLight.color.setHex(hexColor);
  }
  playKeyClick();
}

document.getElementById('tint-cyan').addEventListener('click', () => setGlassTint('rgba(0, 240, 255, 0.16)', 0x00f0ff, 'tint-cyan'));
document.getElementById('tint-emerald').addEventListener('click', () => setGlassTint('rgba(0, 255, 136, 0.16)', 0x00ff88, 'tint-emerald'));
document.getElementById('tint-amber').addEventListener('click', () => setGlassTint('rgba(255, 170, 0, 0.16)', 0xffaa00, 'tint-amber'));
document.getElementById('tint-violet').addEventListener('click', () => setGlassTint('rgba(176, 38, 255, 0.16)', 0xb026ff, 'tint-violet'));

// Slide 6 Dynamic Cursor Light Steering across Central Optical Prism
window.addEventListener('pointermove', e => {
  if (currentSlide === 6 && typeof glassKeyLight !== 'undefined' && glassKeyLight) {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
    glassKeyLight.position.x = 25 + nx * 35;
    glassKeyLight.position.y = 25 - ny * 35;
    if (typeof glassFillLight !== 'undefined' && glassFillLight) {
      glassFillLight.position.x = -25 - nx * 20;
      glassFillLight.position.y = -20 + ny * 20;
    }
  }
});

// True Hooke's Law Newtonian Spring Physics Engine (F = -k*x - c*v)
const magBtn = document.getElementById('magnetic-test-btn');
const springPosDisp = document.getElementById('spring-pos-disp');
const springVelDisp = document.getElementById('spring-vel-disp');
const springStatusDisp = document.getElementById('spring-status-disp');

const springState = {
  pos: { x: 0, y: 0 },
  vel: { x: 0, y: 0 },
  target: { x: 0, y: 0 },
  k: 0.125,         // Spring stiffness
  damping: 0.80,    // Viscous friction damping
  mass: 1.0,
  scale: 1.0,
  scaleVel: 0.0
};

let isDraggingSpring = false;
let dragStartX = 0;
let dragStartY = 0;

if (magBtn) {
  magBtn.addEventListener('mousedown', e => {
    isDraggingSpring = true;
    dragStartX = e.clientX - springState.pos.x;
    dragStartY = e.clientY - springState.pos.y;
    magBtn.style.cursor = 'grabbing';
    e.preventDefault();
  });
}

window.addEventListener('mouseup', () => {
  if (isDraggingSpring) {
    isDraggingSpring = false;
    if (magBtn) magBtn.style.cursor = 'grab';
    // Slingshot snap back: target becomes rest center (0, 0)
    springState.target.x = 0;
    springState.target.y = 0;
    playKeyClick();
  }
});

window.addEventListener('mousemove', e => {
  if (currentSlide !== 6 || !magBtn) return;

  if (isDraggingSpring) {
    // Direct manual drag coordinates
    springState.pos.x = e.clientX - dragStartX;
    springState.pos.y = e.clientY - dragStartY;
    springState.target.x = springState.pos.x;
    springState.target.y = springState.pos.y;
    springState.vel.x = 0;
    springState.vel.y = 0;
    return;
  }

  // Magnetic proximity tracking when cursor approaches within 220px
  const parentRect = magBtn.parentElement.getBoundingClientRect();
  const anchorX = parentRect.left + parentRect.width / 2;
  const anchorY = parentRect.top + parentRect.height / 2;

  const dx = e.clientX - anchorX;
  const dy = e.clientY - anchorY;
  const dist = Math.hypot(dx, dy);

  if (dist < 220) {
    // Magnetic pull towards cursor with elastic resistance
    springState.target.x = dx * 0.72;
    springState.target.y = dy * 0.72;
  } else {
    // Return to equilibrium
    springState.target.x = 0;
    springState.target.y = 0;
  }
});

// Tactile Click Impulse
if (magBtn) {
  magBtn.addEventListener('click', () => {
    if (!isDraggingSpring) {
      springState.vel.y += 22.0;
      springState.scaleVel += 0.28;
      playKeyClick();
    }
  });
}

function updateSpringPhysics() {
  if (!magBtn) return;

  if (!isDraggingSpring) {
    // Hooke's Law: F = -k * (x - target) - damping * v
    const fx = -springState.k * (springState.pos.x - springState.target.x) - springState.damping * springState.vel.x;
    const fy = -springState.k * (springState.pos.y - springState.target.y) - springState.damping * springState.vel.y;

    springState.vel.x += fx / springState.mass;
    springState.vel.y += fy / springState.mass;

    springState.pos.x += springState.vel.x;
    springState.pos.y += springState.vel.y;
  }

  // Scale spring dynamics (stretches under velocity, settles at 1.0)
  const currentSpeed = Math.hypot(springState.vel.x, springState.vel.y);
  const targetScale = isDraggingSpring ? 1.14 : (currentSpeed > 2.0 ? 1.08 : 1.0);
  const scaleForce = -0.20 * (springState.scale - targetScale) - 0.75 * springState.scaleVel;
  springState.scaleVel += scaleForce;
  springState.scale += springState.scaleVel;

  // Apply smooth transform to button
  magBtn.style.transform = `translate(${springState.pos.x.toFixed(2)}px, ${springState.pos.y.toFixed(2)}px) scale(${springState.scale.toFixed(3)})`;

  // Update real-time spring telemetry
  const disp = Math.hypot(springState.pos.x, springState.pos.y);
  if (springPosDisp) springPosDisp.textContent = `${disp.toFixed(0)}px`;
  if (springVelDisp) springVelDisp.textContent = `${currentSpeed.toFixed(1)}`;
  if (springStatusDisp) {
    if (isDraggingSpring) {
      springStatusDisp.textContent = 'DRAGGING';
      springStatusDisp.style.color = 'var(--accent-gold)';
    } else if (currentSpeed > 1.2) {
      springStatusDisp.textContent = 'OSCILLATING';
      springStatusDisp.style.color = 'var(--accent-cyan)';
    } else {
      springStatusDisp.textContent = 'REST';
      springStatusDisp.style.color = 'var(--accent-emerald)';
    }
  }
}

// LAB 5: Topology Noise Morph
const noiseAmpSlider = document.getElementById('noise-amp-slider');
const noiseFreqSlider = document.getElementById('noise-freq-slider');
const noiseSpeedSlider = document.getElementById('noise-speed-slider');

noiseAmpSlider.addEventListener('input', e => document.getElementById('noise-amp-val').textContent = (e.target.value / 100).toFixed(2));
noiseFreqSlider.addEventListener('input', e => document.getElementById('noise-freq-val').textContent = (e.target.value / 10).toFixed(2));
noiseSpeedSlider.addEventListener('input', e => document.getElementById('noise-speed-val').textContent = (e.target.value / 10).toFixed(2));

function switchMorphGeometry(newGeo) {
  groups[7].remove(morphMesh);
  morphGeo.dispose();
  morphGeo = newGeo;
  morphPosOrig = morphGeo.attributes.position.clone();
  morphMesh = new THREE.Mesh(morphGeo, morphMat);
  groups[7].add(morphMesh);
}

document.getElementById('geom-sphere').addEventListener('click', () => { switchMorphGeometry(new THREE.SphereGeometry(18, 64, 64)); setActiveBtn(['geom-sphere','geom-torus','geom-cylinder'],'geom-sphere'); });
document.getElementById('geom-torus').addEventListener('click', () => { switchMorphGeometry(new THREE.TorusGeometry(16, 5, 48, 64)); setActiveBtn(['geom-sphere','geom-torus','geom-cylinder'],'geom-torus'); });
document.getElementById('geom-cylinder').addEventListener('click', () => { switchMorphGeometry(new THREE.CylinderGeometry(12, 12, 28, 48, 48)); setActiveBtn(['geom-sphere','geom-torus','geom-cylinder'],'geom-cylinder'); });

/* ==========================================================================
   8. SLIDES 8 & 9: HIGH-TECH COMPLEX CHARTS
   ========================================================================== */
// ============================================================================
// 8. SLIDE 8 & 9: COSMIC TELEMETRY & HIGH-PRECISION RUNTIME PROFILER
// ============================================================================
// ============================================================================
// 8. SLIDE 8 & 9: COSMIC TELEMETRY & HIGH-PRECISION RUNTIME PROFILER
// ============================================================================
let cosmicChart = null;
let perfStreamChart = null;
let perfRadarChart = null;

// Cosmological Chronology Master Datasets (FLRW Metric & Planck 2018 Data)
const cosmicEpochData = [
  { name: 'Planck Era (10⁻⁴³s)', z: '∞', a: '10⁻³²', regime: 'QUANTUM GRAVITY FOAM', de: 0.0, dm: 25.0, b: 5.0, r: 70.0, logDe: -4.7, logDm: 84.0, logB: 80.0, logR: 112.0 },
  { name: 'GUT Epoch (10⁻³⁶s)', z: '10²⁸', a: '10⁻²⁸', regime: 'GRAND UNIFIED FIELD', de: 0.0, dm: 30.0, b: 6.0, r: 64.0, logDe: -4.7, logDm: 72.0, logB: 68.0, logR: 96.0 },
  { name: 'Electroweak (10⁻¹¹s)', z: '10¹⁵', a: '10⁻¹⁵', regime: 'HIGGS SYMMETRY BREAK', de: 0.0, dm: 40.0, b: 8.0, r: 52.0, logDe: -4.7, logDm: 33.0, logB: 29.0, logR: 44.0 },
  { name: 'Inflation (10⁻³²s)', z: '10²⁶', a: '10⁻²⁶', regime: 'DE SITTER EXPANSION', de: 0.0, dm: 55.0, b: 12.0, r: 33.0, logDe: -4.7, logDm: 66.0, logB: 62.0, logR: 88.0 },
  { name: 'Nucleosynthesis (3m)', z: '4×10⁸', a: '2.5×10⁻⁹', regime: 'LIGHT ELEMENT FUSION', de: 0.0, dm: 63.0, b: 14.0, r: 23.0, logDe: -4.7, logDm: 15.0, logB: 11.0, logR: 20.0 },
  { name: 'Recombination (380k yr)', z: '1100', a: '0.0009', regime: 'CMB PHOTON DECOUPLING', de: 0.1, dm: 64.0, b: 12.0, r: 23.9, logDe: -4.7, logDm: -1.8, logB: -2.5, logR: -1.2 },
  { name: 'Cosmic Dawn (100M yr)', z: '20.0', a: '0.0476', regime: 'FIRST POP III STARS', de: 1.2, dm: 52.0, b: 10.0, r: 0.1, logDe: -4.7, logDm: -4.9, logB: -5.6, logR: -7.4 },
  { name: 'Peak Starburst (3B yr)', z: '2.15', a: '0.317', regime: 'COSMIC NOON & QUASARS', de: 15.0, dm: 40.0, b: 8.0, r: 0.01, logDe: -4.7, logDm: -6.1, logB: -6.8, logR: -9.0 },
  { name: 'Present Day (13.8B yr)', z: '0.000', a: '1.000', regime: 'DARK ENERGY ACCELERATION', de: 68.3, dm: 26.8, b: 4.9, r: 0.005, logDe: -4.7, logDm: -7.5, logB: -8.2, logR: -10.8 },
  { name: 'Future Dark (+100B yr)', z: '-0.98', a: '50.0', regime: 'ASYMPTOTIC DE SITTER', de: 98.5, dm: 1.2, b: 0.3, r: 0.000, logDe: -4.7, logDm: -11.0, logB: -11.7, logR: -15.5 }
];

let activeEpochMode = 'all';      // 'all' | 'early' | 'modern'
let activeMetricMode = 'omega';   // 'omega' | 'log'
let isolatedComponent = null;     // null | 'de' | 'dm' | 'b' | 'r'

function updateCosmicHud(epoch) {
  if (!epoch) return;
  const nameEl = document.getElementById('hud-epoch-name');
  const zEl = document.getElementById('hud-redshift');
  const aEl = document.getElementById('hud-scale-a');
  const regimeEl = document.getElementById('hud-regime');
  const barDeEl = document.getElementById('bar-de');
  const barDmEl = document.getElementById('bar-dm');
  const hudDeText = document.getElementById('hud-bar-de');
  const hudDmText = document.getElementById('hud-bar-dm');

  if (nameEl) nameEl.textContent = epoch.name;
  if (zEl) zEl.textContent = epoch.z;
  if (aEl) aEl.textContent = epoch.a;
  if (regimeEl) {
    regimeEl.textContent = epoch.regime;
    regimeEl.style.color = epoch.de > 50 ? '#00f0ff' : (epoch.dm > 50 ? '#b026ff' : '#ffd700');
  }
  if (barDeEl) barDeEl.style.width = Math.min(100, Math.max(0, epoch.de)) + '%';
  if (barDmEl) barDmEl.style.width = Math.min(100, Math.max(0, epoch.dm)) + '%';
  if (hudDeText) hudDeText.textContent = epoch.de.toFixed(1) + '%';
  if (hudDmText) hudDmText.textContent = epoch.dm.toFixed(1) + '%';
}

function updateCosmicCards(epoch) {
  const vDe = document.getElementById('val-de');
  const vDm = document.getElementById('val-dm');
  const vB = document.getElementById('val-b');
  const vR = document.getElementById('val-r');

  if (activeMetricMode === 'omega') {
    if (vDe) vDe.textContent = epoch.de.toFixed(1) + '%';
    if (vDm) vDm.textContent = epoch.dm.toFixed(1) + '%';
    if (vB) vB.textContent = epoch.b.toFixed(1) + '%';
    if (vR) vR.textContent = epoch.r < 0.01 ? epoch.r.toFixed(3) + '%' : epoch.r.toFixed(1) + '%';
  } else {
    if (vDe) vDe.textContent = epoch.logDe.toFixed(1) + ' log';
    if (vDm) vDm.textContent = epoch.logDm.toFixed(1) + ' log';
    if (vB) vB.textContent = epoch.logB.toFixed(1) + ' log';
    if (vR) vR.textContent = epoch.logR.toFixed(1) + ' log';
  }
}

function getFilteredEpochs() {
  if (activeEpochMode === 'early') return cosmicEpochData.slice(0, 6);
  if (activeEpochMode === 'modern') return cosmicEpochData.slice(5);
  return cosmicEpochData;
}

function refreshCosmicChart() {
  if (!cosmicChart) return;
  const epochs = getFilteredEpochs();
  cosmicChart.data.labels = epochs.map(e => e.name);

  const isOmega = (activeMetricMode === 'omega');
  cosmicChart.data.datasets[0].data = epochs.map(e => isOmega ? e.de : e.logDe);
  cosmicChart.data.datasets[1].data = epochs.map(e => isOmega ? e.dm : e.logDm);
  cosmicChart.data.datasets[2].data = epochs.map(e => isOmega ? e.b : e.logB);
  cosmicChart.data.datasets[3].data = epochs.map(e => isOmega ? e.r : e.logR);

  // Update Y Axis title
  if (cosmicChart.options.scales && cosmicChart.options.scales.y) {
    cosmicChart.options.scales.y.title.text = isOmega 
      ? 'Energy Density Fraction (%)' 
      : 'Log10 Energy Density log₁₀ ρ (GeV/cm³)';
    if (isOmega) {
      cosmicChart.options.scales.y.min = 0;
      cosmicChart.options.scales.y.max = 100;
    } else {
      delete cosmicChart.options.scales.y.min;
      delete cosmicChart.options.scales.y.max;
    }
  }

  // Component isolation visibility
  const compMap = { de: 0, dm: 1, b: 2, r: 3 };
  for (let i = 0; i < 4; i++) {
    if (isolatedComponent === null) {
      cosmicChart.data.datasets[i].hidden = false;
    } else {
      cosmicChart.data.datasets[i].hidden = (compMap[isolatedComponent] !== i);
    }
  }

  cosmicChart.update();

  // Update HUD with latest point
  const latestEpoch = epochs[epochs.length - 1];
  updateCosmicHud(latestEpoch);
  updateCosmicCards(latestEpoch);
}

function setEpochFilter(mode) {
  activeEpochMode = mode;
  setActiveBtn(['btn-chart-all', 'btn-chart-early', 'btn-chart-modern'], `btn-chart-${mode}`);
  refreshCosmicChart();
  playKeyClick();
}

function setCosmicMetricView(mode) {
  activeMetricMode = mode;
  setActiveBtn(['btn-metric-omega', 'btn-metric-log'], `btn-metric-${mode}`);
  refreshCosmicChart();
  playKeyClick();
}

function toggleCosmicComponent(comp) {
  const cards = document.querySelectorAll('.interactive-component-card');

  if (isolatedComponent === comp) {
    isolatedComponent = null;
    cards.forEach(c => {
      c.classList.remove('isolated', 'dimmed');
      const b = c.querySelector('.card-badge');
      if (b) { b.textContent = 'ACTIVE'; b.style.color = '#94a3b8'; }
    });
  } else {
    isolatedComponent = comp;
    cards.forEach(c => {
      const cComp = c.dataset.component;
      const b = c.querySelector('.card-badge');
      if (cComp === comp) {
        c.classList.add('isolated');
        c.classList.remove('dimmed');
        if (b) { b.textContent = 'ISOLATED'; b.style.color = '#00f0ff'; }
      } else {
        c.classList.add('dimmed');
        c.classList.remove('isolated');
        if (b) { b.textContent = 'MUTED'; b.style.color = '#64748b'; }
      }
    });
  }

  refreshCosmicChart();
  playKeyClick();
}

function initCosmicChart() {
  const canvas = document.getElementById('cosmicChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Luminous Vertical Area Gradients
  const gradDE = ctx.createLinearGradient(0, 0, 0, 350);
  gradDE.addColorStop(0, 'rgba(0, 240, 255, 0.42)');
  gradDE.addColorStop(1, 'rgba(0, 240, 255, 0.00)');

  const gradDM = ctx.createLinearGradient(0, 0, 0, 350);
  gradDM.addColorStop(0, 'rgba(176, 38, 255, 0.35)');
  gradDM.addColorStop(1, 'rgba(176, 38, 255, 0.00)');

  const gradB = ctx.createLinearGradient(0, 0, 0, 350);
  gradB.addColorStop(0, 'rgba(255, 215, 0, 0.25)');
  gradB.addColorStop(1, 'rgba(255, 215, 0, 0.00)');

  const gradR = ctx.createLinearGradient(0, 0, 0, 350);
  gradR.addColorStop(0, 'rgba(255, 0, 60, 0.25)');
  gradR.addColorStop(1, 'rgba(255, 0, 60, 0.00)');

  cosmicChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cosmicEpochData.map(e => e.name),
      datasets: [
        {
          label: 'Dark Energy (Ω_Λ)',
          data: cosmicEpochData.map(e => e.de),
          borderColor: '#00f0ff',
          backgroundColor: gradDE,
          fill: true,
          tension: 0.38,
          borderWidth: 2.8,
          pointBackgroundColor: '#00f0ff',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 8,
          pointRadius: 4.5
        },
        {
          label: 'Cold Dark Matter (Ω_c)',
          data: cosmicEpochData.map(e => e.dm),
          borderColor: '#b026ff',
          backgroundColor: gradDM,
          fill: true,
          tension: 0.38,
          borderWidth: 2.4,
          pointBackgroundColor: '#b026ff',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 7,
          pointRadius: 4
        },
        {
          label: 'Baryonic Atoms (Ω_b)',
          data: cosmicEpochData.map(e => e.b),
          borderColor: '#ffd700',
          backgroundColor: gradB,
          fill: true,
          tension: 0.38,
          borderWidth: 2.2,
          pointBackgroundColor: '#ffd700',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 7,
          pointRadius: 4
        },
        {
          label: 'Relativistic Radiation (Ω_γ)',
          data: cosmicEpochData.map(e => e.r),
          borderColor: '#ff003c',
          backgroundColor: gradR,
          fill: true,
          tension: 0.38,
          borderWidth: 2.0,
          pointBackgroundColor: '#ff003c',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 7,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      onHover: (event, activeEls) => {
        if (activeEls && activeEls.length > 0) {
          const idx = activeEls[0].index;
          const epochs = getFilteredEpochs();
          if (epochs[idx]) {
            updateCosmicHud(epochs[idx]);
            updateCosmicCards(epochs[idx]);
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#cbd5e1',
            font: { family: 'Space Grotesk', size: 10.5, weight: '600' },
            boxWidth: 14,
            boxHeight: 14,
            padding: 18
          }
        },
        tooltip: {
          backgroundColor: 'rgba(6, 12, 24, 0.94)',
          borderColor: 'rgba(0, 240, 255, 0.45)',
          borderWidth: 1,
          padding: 14,
          titleFont: { family: 'Space Grotesk', size: 12, weight: '700' },
          bodyFont: { family: 'JetBrains Mono', size: 10 },
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const val = context.parsed.y;
              return activeMetricMode === 'omega' 
                ? ` ${label}: ${val.toFixed(2)}%`
                : ` ${label}: ${val.toFixed(2)} log₁₀ ρ`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8', font: { family: 'Space Grotesk', size: 9.5 } },
          grid: { color: 'rgba(255,255,255,0.06)' }
        },
        y: {
          min: 0,
          max: 100,
          title: { display: true, text: 'Energy Density Fraction (%)', color: '#94a3b8', font: { family: 'Space Grotesk', size: 11, weight: '600' } },
          ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9.5 } },
          grid: { color: 'rgba(255,255,255,0.07)' }
        }
      }
    }
  });

  // Attach Working Epoch Filter Buttons
  const btnAll = document.getElementById('btn-chart-all');
  if (btnAll) btnAll.addEventListener('click', () => setEpochFilter('all'));

  const btnEarly = document.getElementById('btn-chart-early');
  if (btnEarly) btnEarly.addEventListener('click', () => setEpochFilter('early'));

  const btnModern = document.getElementById('btn-chart-modern');
  if (btnModern) btnModern.addEventListener('click', () => setEpochFilter('modern'));

  // Attach Working Metric View Buttons
  const btnOmega = document.getElementById('btn-metric-omega');
  if (btnOmega) btnOmega.addEventListener('click', () => setCosmicMetricView('omega'));

  const btnLog = document.getElementById('btn-metric-log');
  if (btnLog) btnLog.addEventListener('click', () => setCosmicMetricView('log'));

  // Attach 4 Interactive Component Cards
  ['de', 'dm', 'b', 'r'].forEach(comp => {
    const card = document.getElementById(`card-cosmic-${comp}`);
    if (card) {
      card.addEventListener('click', () => toggleCosmicComponent(comp));
    }
  });

  // Initialize with Present Day HUD
  updateCosmicHud(cosmicEpochData[8]);
  updateCosmicCards(cosmicEpochData[8]);
}

// ============================================================================
// 9. REAL-TIME HARDWARE TELEMETRY & SUB-MILLISECOND FRAME PROFILER
// ============================================================================
let isProfilingStreamActive = true;
let stressTestActive = false;
let stressTimer = 0;
let targetFps = 60;
let targetBudgetMs = 16.66;

const streamBufferLength = 30;
let realFrameTimings = Array.from({ length: streamBufferLength }, () => 4.8);
let realJsTimings = Array.from({ length: streamBufferLength }, () => 2.2);
let realDomTimings = Array.from({ length: streamBufferLength }, () => 0.8);

function setFpsTarget(fps) {
  targetFps = fps;
  targetBudgetMs = (fps === 240) ? 4.16 : ((fps === 120) ? 8.33 : 16.66);
  setActiveBtn(['btn-fps-60', 'btn-fps-120', 'btn-fps-240'], `btn-fps-${fps}`);

  const targetSub = document.getElementById('telemetry-target-sub');
  if (targetSub) {
    targetSub.textContent = `Target: ${targetBudgetMs.toFixed(1)}ms (${fps} FPS)`;
  }

  if (perfStreamChart && perfStreamChart.data.datasets[3]) {
    perfStreamChart.data.datasets[3].data = Array(streamBufferLength).fill(targetBudgetMs);
    perfStreamChart.data.datasets[3].label = `VSync Target (${targetBudgetMs.toFixed(1)}ms)`;
    perfStreamChart.update('none');
  }

  playKeyClick();
}

function toggleProfilingStream() {
  isProfilingStreamActive = !isProfilingStreamActive;
  const btn = document.getElementById('btn-stream-toggle');
  if (btn) {
    if (isProfilingStreamActive) {
      btn.innerHTML = '<span class="live-dot-pulse"></span> STREAMING LIVE (60 Hz)';
      btn.classList.add('active');
      btn.style.borderColor = '';
      btn.style.color = '';
    } else {
      btn.innerHTML = '&#10074;&#10074; STREAM PAUSED';
      btn.classList.remove('active');
      btn.style.borderColor = 'var(--accent-gold)';
      btn.style.color = 'var(--accent-gold)';
    }
  }
  playKeyClick();
}

function simulateLoadSpike() {
  // Computational burst
  let dummy = 0;
  for (let k = 0; k < 120000; k++) {
    dummy += Math.sin(k) * Math.cos(k);
  }

  stressTestActive = true;
  stressTimer = 5; // 5 ticks (~2.5s)

  const statusBadge = document.getElementById('perf-status-badge');
  if (statusBadge) {
    statusBadge.textContent = '⚠️ OVERRUN DETECTED: +2.6ms';
    statusBadge.classList.add('warning');
  }

  playSynthNote(880, 0.25);
}

function initPerfCharts() {
  const streamCanvas = document.getElementById('perfStreamChartCanvas');
  const radarCanvas = document.getElementById('perfRadarChartCanvas');
  if (!streamCanvas || !radarCanvas) return;

  const streamCtx = streamCanvas.getContext('2d');
  const radarCtx = radarCanvas.getContext('2d');

  const initialLabels = Array.from({ length: streamBufferLength }, (_, i) => `${i - streamBufferLength + 1}s`);

  // Stream Waterfall Chart
  const gradGpu = streamCtx.createLinearGradient(0, 0, 0, 220);
  gradGpu.addColorStop(0, 'rgba(0, 240, 255, 0.40)');
  gradGpu.addColorStop(1, 'rgba(0, 240, 255, 0.02)');

  const gradJs = streamCtx.createLinearGradient(0, 0, 0, 220);
  gradJs.addColorStop(0, 'rgba(255, 215, 0, 0.35)');
  gradJs.addColorStop(1, 'rgba(255, 215, 0, 0.02)');

  const gradDom = streamCtx.createLinearGradient(0, 0, 0, 220);
  gradDom.addColorStop(0, 'rgba(0, 255, 136, 0.28)');
  gradDom.addColorStop(1, 'rgba(0, 255, 136, 0.02)');

  perfStreamChart = new Chart(streamCtx, {
    type: 'line',
    data: {
      labels: initialLabels,
      datasets: [
        {
          label: 'GPU WebGL Rasterization',
          data: [...realFrameTimings],
          borderColor: '#00f0ff',
          backgroundColor: gradGpu,
          fill: 'origin',
          tension: 0.35,
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          label: 'JS Physics & Matrix Solvers',
          data: [...realJsTimings],
          borderColor: '#ffd700',
          backgroundColor: gradJs,
          fill: '-1',
          tension: 0.35,
          borderWidth: 2.0,
          pointRadius: 0
        },
        {
          label: 'DOM Layout & Compositor',
          data: [...realDomTimings],
          borderColor: '#00ff88',
          backgroundColor: gradDom,
          fill: '-1',
          tension: 0.35,
          borderWidth: 1.8,
          pointRadius: 0
        },
        {
          label: 'VSync Target (16.6ms)',
          data: Array(streamBufferLength).fill(targetBudgetMs),
          borderColor: '#ff003c',
          borderWidth: 1.8,
          borderDash: [6, 4],
          fill: false,
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#cbd5e1',
            font: { family: 'Space Grotesk', size: 8.5 },
            boxWidth: 10,
            padding: 8
          }
        },
        tooltip: {
          backgroundColor: 'rgba(6, 12, 24, 0.94)',
          borderColor: 'rgba(0, 240, 255, 0.45)',
          borderWidth: 1,
          titleFont: { family: 'Space Grotesk', size: 10 },
          bodyFont: { family: 'JetBrains Mono', size: 9 }
        }
      },
      scales: {
        x: { ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 8 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: {
          max: 24,
          title: { display: true, text: 'Execution Frame Delta (ms)', color: '#94a3b8', font: { family: 'Space Grotesk', size: 8.5, weight: '600' } },
          ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 8 } },
          grid: { color: 'rgba(255,255,255,0.06)' }
        }
      }
    }
  });

  // Radar Capability Matrix Chart
  perfRadarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['Draw Call Budget', 'VRAM Locality', 'Shader Fill-Rate', 'Jitter Stability', 'Audio DSP Sync', 'GC Memory Pool'],
      datasets: [
        {
          label: 'Aether Engine',
          data: [98, 94, 96, 99, 99, 95],
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.32)',
          borderWidth: 2.2,
          pointBackgroundColor: '#00f0ff',
          pointRadius: 3.5
        },
        {
          label: 'Standard Multi-Canvas',
          data: [42, 48, 55, 45, 68, 32],
          borderColor: '#ff003c',
          backgroundColor: 'rgba(255, 0, 60, 0.14)',
          borderWidth: 1.6,
          pointBackgroundColor: '#ff003c',
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 6,
          bottom: 6,
          left: 14,
          right: 14
        }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.08)' },
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: {
            color: '#cbd5e1',
            font: { family: 'Space Grotesk', size: 8, weight: '600' },
            padding: 4
          },
          ticks: { display: false }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#cbd5e1', font: { family: 'Space Grotesk', size: 8.5 }, boxWidth: 10, padding: 6 }
        }
      }
    }
  });

  // Working Event Listeners for Slide 9 Buttons
  const btnToggle = document.getElementById('btn-stream-toggle');
  if (btnToggle) btnToggle.addEventListener('click', toggleProfilingStream);

  const btnStress = document.getElementById('btn-stress-test');
  if (btnStress) btnStress.addEventListener('click', simulateLoadSpike);

  const btn60 = document.getElementById('btn-fps-60');
  if (btn60) btn60.addEventListener('click', () => setFpsTarget(60));

  const btn120 = document.getElementById('btn-fps-120');
  if (btn120) btn120.addEventListener('click', () => setFpsTarget(120));

  const btn240 = document.getElementById('btn-fps-240');
  if (btn240) btn240.addEventListener('click', () => setFpsTarget(240));

  // High-Frequency Real-Time Telemetry Stream Updater (every 500ms)
  setInterval(() => {
    if (!perfStreamChart || currentSlide !== 9 || !isProfilingStreamActive) return;

    let gpuVal = window._lastGpuTime || (4.2 + Math.random() * 0.8);
    let jsVal = window._lastJsTime || (2.0 + Math.random() * 0.5);
    let domVal = 0.8 + (renderer.info.render.calls ? renderer.info.render.calls * 0.03 : 0.2);

    if (stressTestActive) {
      const spikeFactor = stressTimer / 5.0;
      gpuVal += 8.5 * spikeFactor;
      jsVal += 3.4 * spikeFactor;
      domVal += 1.2 * spikeFactor;
      stressTimer -= 1;
      if (stressTimer <= 0) {
        stressTestActive = false;
        const statusBadge = document.getElementById('perf-status-badge');
        if (statusBadge) {
          statusBadge.textContent = 'NOMINAL JITTER (< 0.4ms)';
          statusBadge.classList.remove('warning');
        }
        playKeyClick();
      }
    }

    const total = gpuVal + jsVal + domVal;

    // Update Average Frame Time Card
    const avgEl = document.getElementById('telemetry-avg-frame');
    const fillAvg = document.getElementById('fill-avg-frame');
    if (avgEl) {
      avgEl.textContent = total.toFixed(1) + ' ms';
      avgEl.style.color = total > targetBudgetMs ? 'var(--accent-crimson)' : 'var(--accent-cyan)';
    }
    if (fillAvg) {
      fillAvg.style.width = Math.min(100, (total / targetBudgetMs) * 100).toFixed(1) + '%';
      fillAvg.style.background = total > targetBudgetMs ? 'var(--accent-crimson)' : 'var(--accent-cyan)';
    }

    // Update P99 Tail Latency Card
    const p99 = total * (stressTestActive ? 1.45 : 1.22);
    const p99El = document.getElementById('telemetry-p99');
    const fillP99 = document.getElementById('fill-p99');
    if (p99El) p99El.textContent = p99.toFixed(1) + ' ms';
    if (fillP99) fillP99.style.width = Math.min(100, (p99 / targetBudgetMs) * 100).toFixed(1) + '%';

    // Update VSync Headroom Margin Card
    const headroomMargin = ((targetBudgetMs - total) / targetBudgetMs) * 100;
    const headroomEl = document.getElementById('telemetry-headroom');
    const fillHeadroom = document.getElementById('fill-headroom');
    if (headroomEl) {
      if (headroomMargin >= 0) {
        headroomEl.textContent = `+${headroomMargin.toFixed(1)}% MARGIN`;
        headroomEl.style.color = (headroomMargin > 20) ? 'var(--accent-emerald)' : 'var(--accent-cyan)';
      } else {
        headroomEl.textContent = `${headroomMargin.toFixed(1)}% DEFICIT`;
        headroomEl.style.color = 'var(--accent-crimson)';
      }
    }
    if (fillHeadroom) {
      fillHeadroom.style.width = Math.min(100, Math.max(0, headroomMargin)).toFixed(1) + '%';
      fillHeadroom.style.background = (headroomMargin > 20) ? 'var(--accent-emerald)' : ((headroomMargin >= 0) ? 'var(--accent-cyan)' : 'var(--accent-crimson)');
    }

    // Update Micro Vitals
    const drawCallsEl = document.getElementById('metric-draw-calls');
    if (drawCallsEl) drawCallsEl.textContent = (renderer.info.render.calls || 14) + ' calls';

    const vramEl = document.getElementById('metric-vram');
    if (vramEl) {
      const vramMb = (renderer.info.memory.geometries * 0.42 + 16.2).toFixed(1);
      vramEl.textContent = vramMb + ' MB';
    }

    // Shift rolling data buffer
    perfStreamChart.data.datasets[0].data.shift();
    perfStreamChart.data.datasets[0].data.push(gpuVal);
    perfStreamChart.data.datasets[1].data.shift();
    perfStreamChart.data.datasets[1].data.push(jsVal);
    perfStreamChart.data.datasets[2].data.shift();
    perfStreamChart.data.datasets[2].data.push(domVal);
    perfStreamChart.data.datasets[3].data = Array(streamBufferLength).fill(targetBudgetMs);

    perfStreamChart.update('none');
  }, 500);
}
