/* ==========================================================================
   9. SLIDE 10: RELATIVISTIC WORMHOLE TRANSIT & TEMPORAL RESET ENGINE
   ========================================================================== */
let isWormholeTransiting = false;
let transitStartTime = 0;
let wormholeTransitTimer = null;
let wormholeCountdownInterval = null;
if (typeof window !== 'undefined') {
  window.isWormholeTransiting = false;
  window.transitStartTime = 0;
}

function triggerWormholeTransit() {
  if (isWormholeTransiting) return;
  isWormholeTransiting = true;
  transitStartTime = performance.now();
  if (typeof window !== 'undefined') {
    window.isWormholeTransiting = true;
    window.transitStartTime = transitStartTime;
  }

  // Screen vibration
  document.body.classList.add('screen-shake');

  // Play hyperspace audio surge immediately on page load
  playHyperspaceSurgeAudio();

  // Disable orbit controls during hyper-acceleration
  if (controls) controls.enabled = false;
}

function updateWormholeTransit() {
  const curStart = (typeof window !== 'undefined' && typeof window.transitStartTime === 'number' && window.transitStartTime > 0) ? window.transitStartTime : transitStartTime;
  const elapsed = (performance.now() - curStart) / 1000.0;
  // Exactly 3 seconds after loading the page, send user to page 1
  const transitFlightDuration = 3.0;
  const p = Math.min(1.0, elapsed / transitFlightDuration);

  // Invariant Void Geometry: Camera position and FOV remain anchored so the empty center circle never changes size
  camera.position.set(0, 0, 85);
  camera.fov = 45;
  camera.updateProjectionMatrix();

  // Subtle relativistic tremor without perspective dilation
  camera.rotation.z = Math.sin(elapsed * 48.0) * (0.003 + 0.007 * Math.pow(p, 2.0));

  // Blinding whiteout flash overlay ramps up smoothly
  const flashEl = document.getElementById('wormhole-flash-overlay');
  if (flashEl) {
    if (p >= 0.50) {
      const flashT = Math.min(1.0, (p - 0.50) / 0.48);
      flashEl.style.transition = 'opacity 0.05s ease';
      flashEl.style.opacity = flashT.toFixed(3);
    }
  }

  // Singularity threshold reached at 3 seconds: Full Temporal Reset -> Send user to Page 1
  if (p >= 1.0) {
    isWormholeTransiting = false;
    if (typeof window !== 'undefined') window.isWormholeTransiting = false;
    document.body.classList.remove('screen-shake');

    // Execute Full Temporal Reset & Transport to Slide 1
    try {
      executeTemporalReset();
    } catch (err) {
      console.warn("Temporal reset caught error, enforcing fallback to Slide 1:", err);
      if (typeof goToSlide === 'function') goToSlide(1);
    }

    // Restore camera orientation & FOV for Slide 1
    camera.position.set(0, 0, 180);
    camera.rotation.set(0, 0, 0);
    camera.fov = 45;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.enabled = true;
      controls.target.set(0, 0, 0);
      controls.update();
    }

    // Dissolve incandescent flash smoothly over 1.4s revealing Slide 1 clean and locked
    if (flashEl) {
      flashEl.style.transition = 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
      flashEl.style.opacity = '0';
    }
  }
}

function executeTemporalReset() {
  // 1. Wipe Authentication Flags
  try { isUnlocked = false; } catch (e) {}
  try { isVipUnlocked = false; } catch (e) {}
  if (typeof window !== 'undefined') {
    window.isUnlocked = false;
    window.isVipUnlocked = false;
  }

  // 2. Reset Header Security Badge
  const authDotEl = document.getElementById('auth-status-dot');
  const authTextEl = document.getElementById('auth-status-text');
  if (authDotEl) authDotEl.classList.remove('unlocked');
  if (authTextEl) {
    authTextEl.textContent = "SECURITY: RESTRICTED // CLEARANCE REQUIRED";
    authTextEl.style.color = "";
  }

  // 3. Reset & Lock Footer Slide Pills (Lock slides > 1)
  document.querySelectorAll('.slide-pill').forEach(pill => {
    const sNum = parseInt(pill.dataset.slide);
    if (sNum > 1) {
      pill.classList.add('locked');
    }
    pill.classList.remove('unlocked', 'active');
    if (sNum === 1) pill.classList.add('active');
  });

  // 4. Strictly Lock VIP Button
  const footerVip = document.getElementById('footer-vip-btn');
  if (footerVip) {
    footerVip.classList.remove('unlocked');
    footerVip.classList.add('locked');
  }

  // 5. Reset VIP Suite default tab to Suite 1
  if (typeof window.resetVipSuiteTabs === 'function') {
    window.resetVipSuiteTabs();
  }

  // 6. Clear Credentials on Slide 1
  const consoleInputEl = document.getElementById('console-pass-input');
  if (consoleInputEl) {
    consoleInputEl.value = "";
    consoleInputEl.placeholder = "ENTER ACCESS CODE...";
    consoleInputEl.style.boxShadow = "";
  }
  const cardInputEl = document.getElementById('card-pass-input');
  if (cardInputEl) {
    cardInputEl.value = "";
    cardInputEl.style.borderColor = "";
  }
  const denialBannerEl = document.getElementById('denial-banner');
  if (denialBannerEl) denialBannerEl.style.display = "none";

  // 7. Transport to Slide 1
  if (typeof goToSlide === 'function') {
    goToSlide(1);
  } else if (typeof window.goToSlide === 'function') {
    window.goToSlide(1);
  }

  if (typeof playAccessDenied === 'function') {
    playAccessDenied();
  }
}

function playHyperspaceSurgeAudio() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Sub-bass rumble (45Hz down to 18Hz over 3.5s)
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(45, now);
    subOsc.frequency.exponentialRampToValueAtTime(18, now + 3.4);
    subGain.gain.setValueAtTime(0.40, now);
    subGain.gain.linearRampToValueAtTime(0.01, now + 3.5);
    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start(now);
    subOsc.stop(now + 3.5);

    // High-frequency relativistic Doppler warp sweep (90Hz to 1200Hz over 3.3s)
    const sweepOsc = audioCtx.createOscillator();
    const sweepGain = audioCtx.createGain();
    sweepOsc.type = 'sine';
    sweepOsc.frequency.setValueAtTime(90, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(1200, now + 3.2);
    sweepGain.gain.setValueAtTime(0.12, now);
    sweepGain.gain.linearRampToValueAtTime(0.35, now + 2.7);
    sweepGain.gain.linearRampToValueAtTime(0.0, now + 3.3);
    sweepOsc.connect(sweepGain);
    sweepGain.connect(masterGain);
    sweepOsc.start(now);
    sweepOsc.stop(now + 3.4);
  } catch (e) {}
}
