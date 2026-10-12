/* ==========================================================================
   3. AUTHENTICATION & SLIDE STATE MACHINE
   ========================================================================== */
let isUnlocked = false;
let isVipUnlocked = false;
let currentSlide = 1;
if (typeof window !== 'undefined') {
  window.isUnlocked = false;
  window.isVipUnlocked = false;
  window.currentSlide = 1;
}

// Typing sound on inputs
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => playKeyClick());
});

// ============================================================================
// 1. SLIDE 1: QUANTUM GATEWAY INTERFACE & CRYPTOGRAPHIC PASSCODE VERIFICATION
// ============================================================================
const consoleInput = document.getElementById('console-pass-input');
const consoleBtn = document.getElementById('console-submit-btn');
const denialBanner = document.getElementById('denial-banner');
const authDot = document.getElementById('auth-status-dot');
const authText = document.getElementById('auth-status-text');
const entropyFill = document.getElementById('entropy-fill');
const entropyStatusText = document.getElementById('entropy-status-text');
const entropyHashText = document.getElementById('entropy-hash-text');
const compoundHintBtn = document.getElementById('btn-compound-hint');
const gwLatencyVal = document.getElementById('gw-latency-val');

function updateEntropyMeter() {
  if (!consoleInput) return;
  const len = consoleInput.value.length;
  if (len > 0) {
    const pct = Math.min(100, Math.max(12, len * 5.2));
    if (entropyFill) {
      entropyFill.style.width = pct + '%';
      entropyFill.style.background = 'linear-gradient(90deg, #00f0ff, #00ff88)';
    }
    if (entropyStatusText) {
      entropyStatusText.textContent = `BUFFER: ${len} CHARS CAPTURED`;
      entropyStatusText.style.color = '#00f0ff';
    }
    if (entropyHashText) {
      const hash = ((len * 2654435761) >>> 0).toString(16).toUpperCase().padStart(8, '0');
      entropyHashText.textContent = `0x${hash.slice(0, 4)}_LOCKED`;
    }
  } else {
    if (entropyFill) {
      entropyFill.style.width = '12%';
      entropyFill.style.background = 'linear-gradient(90deg, #00f0ff, #00ff88)';
    }
    if (entropyStatusText) {
      entropyStatusText.textContent = 'KEY BUFFER: WAITING INPUT';
      entropyStatusText.style.color = '#64748b';
    }
    if (entropyHashText) {
      entropyHashText.textContent = '0x0000_LOCKED';
    }
  }
}

if (consoleInput) {
  consoleInput.addEventListener('input', updateEntropyMeter);
}

if (compoundHintBtn && consoleInput) {
  compoundHintBtn.addEventListener('click', () => {
    consoleInput.value = "HEXAVALENT CHROMIUM";
    updateEntropyMeter();
    consoleInput.focus();
    playKeyClick();
  });
}

// Latency Ping Telemetry Heartbeat
if (gwLatencyVal) {
  setInterval(() => {
    if (currentSlide === 1) {
      const ping = (0.12 + Math.random() * 0.08).toFixed(2);
      gwLatencyVal.textContent = ping + ' ms';
    }
  }, 1200);
}

function verifyConsole() {
  const val = consoleInput.value.trim().toLowerCase();
  // Valid pass: "hexavalent chromium"
  if (val === "hexavalent chromium" || val === "hexavalentchromium") {
    isUnlocked = true;
    if (typeof window !== 'undefined') window.isUnlocked = true;
    playAccessGranted();
    authDot.classList.add('unlocked');
    authText.textContent = "SECURITY: LEVEL 5 CLEARED // RESEARCH CLUSTERS UNLOCKED";
    authText.style.color = "var(--accent-emerald)";
    if (denialBanner) denialBanner.style.display = "none";

    if (entropyStatusText) {
      entropyStatusText.textContent = ">> ACCESS GRANTED: QUANTUM CIPHER ACCEPTED <<";
      entropyStatusText.style.color = "var(--accent-emerald)";
    }
    if (entropyFill) {
      entropyFill.style.width = "100%";
      entropyFill.style.background = "var(--accent-emerald)";
    }

    // Unlock footer pills
    document.querySelectorAll('.slide-pill').forEach(pill => {
      pill.classList.remove('locked');
    });

    // Auto transition to Slide 2
    setTimeout(() => goToSlide(2), 650);
  } else {
    playAccessDenied();
    if (denialBanner) {
      denialBanner.style.display = "block";
      denialBanner.innerHTML = '<div class="denial-inner-content"><span class="denial-icon">⚠️</span><span class="denial-text">&gt;&gt; ACCESS DENIED: INVALID CRYPTOGRAPHIC COMPOUND // RETRY WITH LEVEL 5 KEY &lt;&lt;</span></div>';
    }
    if (entropyStatusText) {
      entropyStatusText.textContent = ">> CIPHER REJECTED: HASH MISMATCH <<";
      entropyStatusText.style.color = "var(--accent-crimson)";
    }
    if (entropyFill) {
      entropyFill.style.background = "var(--accent-crimson)";
    }
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 450);
  }
}

consoleBtn.addEventListener('click', verifyConsole);
consoleInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') verifyConsole();
});

// VIP Card Passcode Verification (PIN: "839 in" or "839")
const cardInput = document.getElementById('card-pass-input');
const cardSubmitBtn = document.getElementById('card-submit-btn');
const footerVipBtn = document.getElementById('footer-vip-btn');

function verifyCard() {
  const val = cardInput.value.trim().toLowerCase();
  // Valid pass: "839 in" or "839" or "839in"
  if (val === "839 in" || val === "839" || val === "839in") {
    isVipUnlocked = true;
    isUnlocked = true; // Executive VIP clearance grants access to all slides
    if (typeof window !== 'undefined') {
      window.isVipUnlocked = true;
      window.isUnlocked = true;
    }
    playVipGranted();
    if (typeof window.resetVipSuiteTabs === 'function') window.resetVipSuiteTabs();
    if (footerVipBtn) footerVipBtn.classList.add('unlocked');
    document.querySelectorAll('.slide-pill').forEach(pill => {
      pill.classList.remove('locked');
    });
    authDot.classList.add('unlocked');
    authText.textContent = "EXECUTIVE CLEARANCE Ω // VIP SUITE UNLOCKED";
    authText.style.color = "var(--accent-gold)";
    cardInput.style.borderColor = "var(--accent-gold)";
    cardInput.value = "VIP AUTHORIZED";
    setTimeout(() => goToSlide(11), 600);
  } else {
    playAccessDenied();
    cardInput.style.borderColor = "var(--accent-crimson)";
    cardInput.value = "INVALID PIN";
    setTimeout(() => { cardInput.value = ""; cardInput.style.borderColor = ""; }, 1200);
  }
}

cardSubmitBtn.addEventListener('click', verifyCard);
cardInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') verifyCard();
});

if (footerVipBtn) {
  footerVipBtn.addEventListener('click', () => {
    if (isVipUnlocked) goToSlide(11);
  });
}

/* ==========================================================================
   
// ============================================================================
// HOLOGRAPHIC 3D QUANTUM LATTICE SPHERE (CENTER VISUAL - WHITE PAPER v1.0)
// ============================================================================
(function initQuantumSphere() {
  const canvas = document.getElementById('quantum-sphere-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const numPoints = 54;
  const sphereRadius = 78;
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    points.push({
      x: sphereRadius * Math.sin(phi) * Math.cos(theta),
      y: sphereRadius * Math.sin(phi) * Math.sin(theta),
      z: sphereRadius * Math.cos(phi),
      pulse: Math.random() * Math.PI * 2
    });
  }

  let angleX = 0.2;
  let angleY = 0;
  let mouseInfluenceX = 0;
  let mouseInfluenceY = 0;

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseInfluenceX = ((e.clientX - rect.left) / canvas.width - 0.5) * 0.04;
    mouseInfluenceY = ((e.clientY - rect.top) / canvas.height - 0.5) * 0.04;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseInfluenceX = 0;
    mouseInfluenceY = 0;
  });

  function renderSphere() {
    if (typeof currentSlide !== 'undefined' && currentSlide !== 1) {
      requestAnimationFrame(renderSphere);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    angleY += 0.012 + mouseInfluenceX;
    angleX += 0.006 + mouseInfluenceY;

    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);

    const projected = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const fov = 220;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.pulse += 0.05;

      let x1 = p.x * cosY + p.z * sinY;
      let z1 = -p.x * sinY + p.z * cosY;

      let y2 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      const scale = fov / (fov + z2 + 100);
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;
      const alpha = Math.max(0.12, Math.min(1, (z2 + sphereRadius) / (2 * sphereRadius)));

      projected.push({ x: px, y: py, z: z2, alpha: alpha, pulse: p.pulse });
    }

    const maxDist = 48;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const edgeAlpha = (1 - dist / maxDist) * Math.min(projected[i].alpha, projected[j].alpha) * 0.65;
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.strokeStyle = `rgba(0, 238, 255, ${edgeAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const r = (1.5 + Math.sin(p.pulse) * 0.8) * (p.alpha > 0.5 ? 1.2 : 0.8);

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.alpha > 0.5 ? '#00EEFF' : '#3A75FF';
      ctx.shadowColor = '#00EEFF';
      ctx.shadowBlur = p.alpha > 0.6 ? 8 : 0;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    const ringAngle = angleY * 1.5;
    const ringRadius = 94;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.35);
    ctx.scale(1, 0.38);

    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 238, 255, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    const beadX = Math.cos(ringAngle) * ringRadius;
    const beadY = Math.sin(ringAngle) * ringRadius;
    ctx.beginPath();
    ctx.arc(beadX, beadY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00EEFF';
    ctx.shadowColor = '#00EEFF';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    requestAnimationFrame(renderSphere);
  }

  requestAnimationFrame(renderSphere);
})();


/* 4. 360° FREE ROTATABLE 3D VIP CARD (PHYSICS & INERTIA)
   ========================================================================== */
const cardScene = document.getElementById('card-scene');
const cardRotor = document.getElementById('card-rotor');
let isDraggingCard = false;
let startPointerX = 0;
let startPointerY = 0;
let rotX = 0;
let rotY = 0;
let velX = 0;
let velY = 0;
let autoRotateActive = false;

cardScene.addEventListener('mousedown', e => {
  isDraggingCard = true;
  autoRotateActive = false;
  startPointerX = e.clientX;
  startPointerY = e.clientY;
});

window.addEventListener('mousemove', e => {
  if (!isDraggingCard) return;
  const deltaX = e.clientX - startPointerX;
  const deltaY = e.clientY - startPointerY;
  startPointerX = e.clientX;
  startPointerY = e.clientY;

  velY = deltaX * 0.6;
  velX = -deltaY * 0.6;
  rotY += velY;
  rotX += velX;
  cardRotor.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});

window.addEventListener('mouseup', () => {
  isDraggingCard = false;
});

// Flip Button
document.getElementById('btn-flip-card').addEventListener('click', () => {
  rotY += 180;
  cardRotor.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  cardRotor.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  playKeyClick();
  setTimeout(() => { cardRotor.style.transition = 'transform 0.05s linear'; }, 600);
});

// Auto-Rotate Toggle
document.getElementById('btn-auto-rotate').addEventListener('click', () => {
  autoRotateActive = !autoRotateActive;
  document.getElementById('btn-auto-rotate').style.background = autoRotateActive ? 'var(--accent-gold)' : '';
  document.getElementById('btn-auto-rotate').style.color = autoRotateActive ? '#020408' : '';
  playKeyClick();
});

// Reset View
document.getElementById('btn-reset-card').addEventListener('click', () => {
  rotX = 0;
  rotY = 0;
  velX = 0;
  velY = 0;
  autoRotateActive = false;
  cardRotor.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  cardRotor.style.transform = `rotateX(0deg) rotateY(0deg)`;
  playKeyClick();
  setTimeout(() => { cardRotor.style.transition = 'transform 0.05s linear'; }, 600);
});
