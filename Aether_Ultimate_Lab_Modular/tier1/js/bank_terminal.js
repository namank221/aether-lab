/* ==========================================================================
   AETHER LAB VIP LOUNGE: SUITE 03 BANK ACCOUNT MACHINE (BANK TERMINAL)
   Interactive Comedic Incident: $0.00 Balance -> Insult -> Ejection -> Reset
   ========================================================================== */

(function initBankTerminalModule() {
  // State Enum
  const BankTerminalState = {
    STANDBY: 'STANDBY',             // Ready for client interaction
    VERIFYING: 'VERIFYING',         // Loading / cryptographic ledger query
    BALANCE_REVEAL: 'BALANCE_REVEAL', // $0.00 balance display
    PUNCHLINE: 'PUNCHLINE',         // "INTERESTING. YOU'RE POOR."
    SECURITY_ALARM: 'SECURITY_ALARM', // "IMPERSONATOR DETECTED"
    ACCESS_REVOKED: 'ACCESS_REVOKED', // "ACCESS REVOKED"
    EJECTION: 'EJECTION',           // Comedic slapstick bouncer kick
    RESET: 'RESET'                  // Return to Slide 1, reset VIP to Suite 1
  };

  let currentState = BankTerminalState.STANDBY;
  let isBankIncidentActive = false;
  let bankTimers = [];
  let incidentEpoch = 0;

  function clearAllTimers() {
    bankTimers.forEach(t => clearTimeout(t));
    bankTimers = [];
  }

  function addTimer(fn, delay) {
    const epochAtSchedule = incidentEpoch;
    const timer = setTimeout(() => {
      if (epochAtSchedule === incidentEpoch) {
        fn();
      }
    }, delay);
    bankTimers.push(timer);
    return timer;
  }

  // DOM Elements Cache
  function getElements() {
    return {
      interactBtn: document.getElementById('btn-bank-interact'),
      phaseStandby: document.getElementById('bank-phase-standby'),
      phaseVerifying: document.getElementById('bank-phase-verifying'),
      phaseBalance: document.getElementById('bank-phase-balance'),
      phasePunchline: document.getElementById('bank-phase-punchline'),
      progressFill: document.getElementById('bank-verify-progress-fill'),
      log2: document.getElementById('bank-log-2'),
      log3: document.getElementById('bank-log-3'),
      overlay: document.getElementById('chardonnay-security-overlay'),
      securityTitle: document.getElementById('chardonnay-sec-title'),
      securitySub: document.getElementById('chardonnay-sec-sub'),
      ejectionStage: document.getElementById('chardonnay-ejection-stage'),
      bouncerFig: document.getElementById('ejection-bouncer'),
      drunkieFig: document.getElementById('ejection-drunkie')
    };
  }

  // --------------------------------------------------------------------------
  // RESET BANK TERMINAL DOM
  // --------------------------------------------------------------------------
  function resetBankTerminalUi() {
    const el = getElements();

    currentState = BankTerminalState.STANDBY;
    isBankIncidentActive = false;

    if (el.interactBtn) {
      el.interactBtn.disabled = false;
      el.interactBtn.classList.remove('disabled');
    }

    if (el.phaseStandby) el.phaseStandby.style.display = 'flex';
    if (el.phaseVerifying) el.phaseVerifying.style.display = 'none';
    if (el.phaseBalance) el.phaseBalance.style.display = 'none';
    if (el.phasePunchline) el.phasePunchline.style.display = 'none';

    if (el.progressFill) el.progressFill.style.width = '0%';
    if (el.log2) el.log2.classList.remove('active');
    if (el.log3) el.log3.classList.remove('active');
  }

  function resetBankTerminal() {
    clearAllTimers();
    incidentEpoch++;
    resetBankTerminalUi();

    // Reset overlay elements if they were active
    const el = getElements();
    if (el.overlay && isBankIncidentActive) {
      el.overlay.style.display = 'none';
      el.overlay.classList.remove('active');
    }
    if (el.ejectionStage) {
      el.ejectionStage.style.display = 'none';
      el.ejectionStage.classList.remove('animating');
    }
    if (el.bouncerFig) el.bouncerFig.classList.remove('kick');
    if (el.drunkieFig) el.drunkieFig.classList.remove('fly');
  }
  window.resetBankTerminal = resetBankTerminal;

  // --------------------------------------------------------------------------
  // INTERACTION TRIGGER (START INCIDENT)
  // --------------------------------------------------------------------------
  function startBankingIncident() {
    if (isBankIncidentActive || currentState !== BankTerminalState.STANDBY) {
      return;
    }

    isBankIncidentActive = true;
    currentState = BankTerminalState.VERIFYING;
    incidentEpoch++;

    const el = getElements();
    if (el.interactBtn) {
      el.interactBtn.disabled = true;
      el.interactBtn.classList.add('disabled');
    }

    // Play subtle mechanical key click
    if (typeof playKeyClick === 'function') {
      playKeyClick();
    }

    // Transition: Phase 1 -> Phase 2 (Verifying)
    if (el.phaseStandby) el.phaseStandby.style.display = 'none';
    if (el.phaseVerifying) el.phaseVerifying.style.display = 'flex';
    if (el.progressFill) {
      el.progressFill.style.width = '0%';
      void el.progressFill.offsetWidth;
      el.progressFill.style.width = '100%';
    }

    // Telemetry log animations
    addTimer(() => {
      if (el.log2) el.log2.classList.add('active');
      if (typeof playKeyClick === 'function') playKeyClick();
    }, 600);

    addTimer(() => {
      if (el.log3) el.log3.classList.add('active');
      if (typeof playKeyClick === 'function') playKeyClick();
    }, 1200);

    // Transition: Phase 2 -> Phase 3 (Balance Reveal: $0.00)
    addTimer(() => {
      revealZeroBalance();
    }, 2000);
  }

  // --------------------------------------------------------------------------
  // STEP 3: REVEAL $0.00 BALANCE
  // --------------------------------------------------------------------------
  function revealZeroBalance() {
    currentState = BankTerminalState.BALANCE_REVEAL;
    const el = getElements();

    if (el.phaseVerifying) el.phaseVerifying.style.display = 'none';
    if (el.phaseBalance) el.phaseBalance.style.display = 'flex';

    if (typeof playKeyClick === 'function') playKeyClick();

    // Pause ~2.2s for the $0.00 balance to sink in
    addTimer(() => {
      revealPunchline();
    }, 2200);
  }

  // --------------------------------------------------------------------------
  // STEP 4: REVEAL PUNCHLINE ("INTERESTING. YOU'RE POOR.")
  // --------------------------------------------------------------------------
  function revealPunchline() {
    currentState = BankTerminalState.PUNCHLINE;
    const el = getElements();

    if (el.phaseBalance) el.phaseBalance.style.display = 'none';
    if (el.phasePunchline) el.phasePunchline.style.display = 'flex';

    if (typeof playKeyClick === 'function') playKeyClick();

    // Pause ~2.0s before security alarm triggers
    addTimer(() => {
      triggerSecurityAlarm();
    }, 2000);
  }

  // --------------------------------------------------------------------------
  // STAGE A — SECURITY WARNING ("IMPERSONATOR DETECTED")
  // --------------------------------------------------------------------------
  function triggerSecurityAlarm() {
    currentState = BankTerminalState.SECURITY_ALARM;
    const el = getElements();

    // Play sharp warning alarm sound
    if (typeof playChardonnayAlarm === 'function') {
      playChardonnayAlarm();
    } else if (typeof playAccessDenied === 'function') {
      playAccessDenied();
    }

    // Display Fullscreen Red Warning Overlay
    if (el.overlay) {
      el.overlay.style.display = 'flex';
      void el.overlay.offsetWidth;
      el.overlay.classList.add('active');
    }

    if (el.securityTitle) {
      el.securityTitle.textContent = 'IMPERSONATOR DETECTED';
      el.securityTitle.style.color = '#ffffff';
      el.securityTitle.style.opacity = '1';
    }
    if (el.securitySub) {
      el.securitySub.textContent = 'UNAUTHORIZED ACCESS TO WEALTH DETECTED';
      el.securitySub.style.opacity = '1';
    }
    if (el.ejectionStage) {
      el.ejectionStage.style.display = 'none';
      el.ejectionStage.classList.remove('animating');
    }

    // Transition to Stage B (Access Revoked) after ~2.0s
    addTimer(() => {
      triggerAccessRevoked();
    }, 2000);
  }

  // --------------------------------------------------------------------------
  // STAGE B — ACCESS REVOKED
  // --------------------------------------------------------------------------
  function triggerAccessRevoked() {
    if (currentState !== BankTerminalState.SECURITY_ALARM) return;
    currentState = BankTerminalState.ACCESS_REVOKED;

    const el = getElements();

    if (typeof playAccessDenied === 'function') {
      playAccessDenied();
    }

    // Smoothly fade title to ACCESS REVOKED
    if (el.securityTitle) {
      el.securityTitle.style.opacity = '0';
      addTimer(() => {
        el.securityTitle.textContent = 'ACCESS REVOKED';
        el.securityTitle.style.color = '#ff003c';
        el.securityTitle.style.opacity = '1';
      }, 150);
    }
    if (el.securitySub) {
      el.securitySub.style.opacity = '0';
      addTimer(() => {
        el.securitySub.textContent = 'EXECUTIVE VIP CLEARANCE TERMINATED // CODE RED PROTOCOL';
        el.securitySub.style.opacity = '1';
      }, 150);
    }

    // Transition to Stage C (Avatar Ejection) after ~2.0s
    addTimer(() => {
      triggerAvatarEjection();
    }, 2000);
  }

  // --------------------------------------------------------------------------
  // STAGE C — AVATAR EJECTION (SLAPSTICK KICK)
  // --------------------------------------------------------------------------
  function triggerAvatarEjection() {
    if (currentState !== BankTerminalState.ACCESS_REVOKED) return;
    currentState = BankTerminalState.EJECTION;

    const el = getElements();

    // Reveal Ejection Stage
    if (el.ejectionStage) {
      el.ejectionStage.style.display = 'flex';
      void el.ejectionStage.offsetWidth;
      el.ejectionStage.classList.add('animating');
    }

    // Step 1: Bouncer winds up (0.2s)
    addTimer(() => {
      if (el.bouncerFig) el.bouncerFig.classList.add('kick');

      // Step 2: Impact sound
      if (typeof playComedicKick === 'function') {
        playComedicKick();
      }

      // Step 3: Avatar flies off-screen
      if (el.drunkieFig) el.drunkieFig.classList.add('fly');
    }, 200);

    // Transition to Reset after ejection finishes (~2.3s)
    addTimer(() => {
      executeBankReset();
    }, 2300);
  }

  // --------------------------------------------------------------------------
  // STAGE 4 — COMPLETE RESET & RE-ENTRY
  // --------------------------------------------------------------------------
  function executeBankReset() {
    clearAllTimers();
    incidentEpoch++;

    // 1. Reset visual interaction state
    resetBankTerminalUi();

    // Reset overlay elements
    const el = getElements();
    if (el.overlay) {
      el.overlay.style.display = 'none';
      el.overlay.classList.remove('active');
    }
    if (el.ejectionStage) {
      el.ejectionStage.style.display = 'none';
      el.ejectionStage.classList.remove('animating');
    }
    if (el.bouncerFig) el.bouncerFig.classList.remove('kick');
    if (el.drunkieFig) el.drunkieFig.classList.remove('fly');

    // 2. Reset VIP Suite tabs to Suite 1 (Quantum Material Forge)
    if (typeof window.resetVipSuiteTabs === 'function') {
      window.resetVipSuiteTabs();
    }

    // 3. Revoke VIP Lounge and Lab clearance
    try { isUnlocked = false; } catch (e) {}
    try { isVipUnlocked = false; } catch (e) {}
    if (typeof window !== 'undefined') {
      window.isUnlocked = false;
      window.isVipUnlocked = false;
    }

    // 4. Re-lock all slide navigation pills (except Slide 1)
    document.querySelectorAll('.slide-pill').forEach(pill => {
      if (pill.dataset.slide !== '1') {
        pill.classList.add('locked');
      }
      pill.classList.remove('active');
      if (pill.dataset.slide === '1') {
        pill.classList.add('active');
      }
    });

    const footerVip = document.getElementById('footer-vip-btn');
    if (footerVip) {
      footerVip.classList.remove('unlocked');
      footerVip.classList.add('locked');
    }

    // 5. Reset Gate security indicators on Slide 1 & Header
    const authDotEl = document.getElementById('auth-status-dot');
    const authTextEl = document.getElementById('auth-status-text');
    if (authDotEl) authDotEl.classList.remove('unlocked');
    if (authTextEl) {
      authTextEl.textContent = 'SECURITY LEVEL: 0 // RESTRICTED ORBITAL ACCESS';
      authTextEl.style.color = 'var(--accent-crimson)';
    }

    // 6. Reset inputs on Slide 1
    const cardInputEl = document.getElementById('card-pass-input');
    if (cardInputEl) {
      cardInputEl.value = '';
      cardInputEl.style.borderColor = '';
    }
    const consoleInputEl = document.getElementById('console-pass-input') || document.getElementById('quantum-console-input');
    if (consoleInputEl) {
      consoleInputEl.value = '';
      consoleInputEl.placeholder = 'ENTER ACCESS CODE...';
      consoleInputEl.style.boxShadow = '';
    }
    const entropyFillEl = document.getElementById('entropy-bar-fill');
    if (entropyFillEl) {
      entropyFillEl.style.width = '0%';
      entropyFillEl.style.background = 'var(--accent-crimson)';
    }
    const entropyStatusEl = document.getElementById('entropy-status-text');
    if (entropyStatusEl) {
      entropyStatusEl.textContent = '>> ENTER CRYPTOGRAPHIC PASSPHRASE <<';
      entropyStatusEl.style.color = 'var(--text-muted)';
    }

    // 7. Return user directly to Slide 1
    if (typeof window.goToSlide === 'function') {
      window.goToSlide(1);
    } else if (typeof goToSlide === 'function') {
      goToSlide(1);
    }
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS INITIALIZATION
  // --------------------------------------------------------------------------
  function setupListeners() {
    const interactBtn = document.getElementById('btn-bank-interact');
    if (interactBtn) {
      interactBtn.addEventListener('click', startBankingIncident);
    }

    // Expose programmatic trigger for verification tests
    window.triggerBankIncident = startBankingIncident;
    window.executeBankReset = executeBankReset;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupListeners);
  } else {
    setupListeners();
  }
})();
