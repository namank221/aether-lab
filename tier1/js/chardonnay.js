/* ==========================================================================
   AETHER LAB VIP LOUNGE: CHARDONNAY SECURITY TRAP (STATE MACHINE)
   ========================================================================== */

(function initChardonnayModule() {
  // State Enum
  const ChardonnayState = {
    AVAILABLE: 'AVAILABLE',       // State A: Bottle & glass ready, drink option available
    POURING: 'POURING',           // State B: Tilting bottle, golden liquid stream flowing
    FILLED: 'FILLED',             // State C: Wine served, contact is strictly forbidden
    ALARM: 'ALARM',               // State C Trigger: "DRUNKIE DETECTED" overlay
    ACCESS_REVOKED: 'ACCESS_REVOKED', // State D: "ACCESS REVOKED" message transition
    EJECTION: 'EJECTION',         // State E: Comedic slapstick kick animation
    RESET: 'RESET'                // State F: Reset session, return to gate (Slide 1)
  };

  let currentState = ChardonnayState.AVAILABLE;
  let stateTimers = [];

  function clearAllTimers() {
    stateTimers.forEach(t => clearTimeout(t));
    stateTimers = [];
  }

  function setup() {
    // DOM Elements
    const container = document.getElementById('suite-2');
    const drinkBtn = document.getElementById('btn-drink-chardonnay');
    const bottleTarget = document.getElementById('chardonnay-bottle-target');
    const glassTarget = document.getElementById('chardonnay-glass-target');
    const bottleElement = document.getElementById('chardonnay-bottle-assembly');
    const glassLiquidElement = document.getElementById('chardonnay-glass-liquid');
    const pourStream = document.getElementById('chardonnay-pour-stream');
    const sommelierStatus = document.getElementById('chardonnay-sommelier-status');

    // Security Overlay Elements
    const overlay = document.getElementById('chardonnay-security-overlay');
    const securityTitle = document.getElementById('chardonnay-sec-title');
    const securitySub = document.getElementById('chardonnay-sec-sub');
    const ejectionStage = document.getElementById('chardonnay-ejection-stage');
    const bouncerFig = document.getElementById('ejection-bouncer');
    const drunkieFig = document.getElementById('ejection-drunkie');

    let threeEngine = null;

    // --------------------------------------------------------------------------
    // STATE A — AVAILABLE
    // --------------------------------------------------------------------------
    function resetToAvailable() {
      clearAllTimers();
      currentState = ChardonnayState.AVAILABLE;

      if (threeEngine) {
        threeEngine.reset();
      }

      // Reset bottle & glass visual state
      if (bottleElement) {
        bottleElement.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        bottleElement.style.transform = 'rotate(0deg) translate(0px, 0px)';
      }
      if (pourStream) {
        pourStream.style.opacity = '0';
        pourStream.classList.remove('flowing');
      }
      if (glassLiquidElement) {
        glassLiquidElement.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        glassLiquidElement.style.transform = 'scaleY(0)';
        glassLiquidElement.style.opacity = '0';
      }

      // Reset targets & classes
      if (bottleTarget) bottleTarget.classList.remove('armed');
      if (glassTarget) glassTarget.classList.remove('armed');

      // Reset Button
      if (drinkBtn) {
        drinkBtn.disabled = false;
        drinkBtn.classList.remove('disabled');
        drinkBtn.textContent = 'Drink the fine Chardonnay';
        drinkBtn.style.borderColor = 'var(--accent-gold)';
        drinkBtn.style.color = 'var(--accent-gold)';
      }

      if (sommelierStatus) {
        sommelierStatus.textContent = 'CHARDONNAY GRAND CRU // READY FOR DEGUSTATION';
        sommelierStatus.style.color = 'var(--accent-gold)';
      }

      // Hide Overlay
      if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
      }
      if (ejectionStage) {
        ejectionStage.style.display = 'none';
        ejectionStage.classList.remove('animating');
      }
      if (bouncerFig) bouncerFig.classList.remove('kick');
      if (drunkieFig) drunkieFig.classList.remove('fly');
    }

    // --------------------------------------------------------------------------
    // STATE B — POURING
    // --------------------------------------------------------------------------
    function startPouring() {
      if (currentState !== ChardonnayState.AVAILABLE) return;
      currentState = ChardonnayState.POURING;

      if (drinkBtn) {
        drinkBtn.disabled = true;
        drinkBtn.classList.add('disabled');
        drinkBtn.textContent = 'Pouring Grand Cru...';
        drinkBtn.style.borderColor = 'rgba(255, 215, 0, 0.4)';
        drinkBtn.style.color = 'var(--text-muted)';
      }
      if (sommelierStatus) {
        sommelierStatus.textContent = 'POURING // DECANTING PALE GOLDEN VINTAGE';
        sommelierStatus.style.color = 'var(--accent-cyan)';
      }

      // Sound: Procedural gentle liquid pour
      if (typeof playChardonnayPour === 'function') {
        playChardonnayPour();
      }

      // 3D Physics Pour in Three.js
      if (threeEngine) {
        threeEngine.startPour();
      }

      // 1. Tilt the bottle naturally towards the glass (pivot near top-left of base)
      if (bottleElement) {
        bottleElement.style.transition = 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1)';
        bottleElement.style.transform = 'translate(-62px, -36px) rotate(-46deg)';
      }

      // 2. Liquid stream starts after bottle reaches tilt angle
      const tStream = setTimeout(() => {
        if (currentState !== ChardonnayState.POURING) return;
        if (pourStream) {
          pourStream.style.opacity = '1';
          pourStream.classList.add('flowing');
        }

        // 3. Liquid inside glass rises from 0% to fill level
        if (glassLiquidElement) {
          glassLiquidElement.style.transition = 'transform 1.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
          glassLiquidElement.style.opacity = '0.9';
          glassLiquidElement.style.transform = 'scaleY(1)';
        }
      }, 700);
      stateTimers.push(tStream);

      // 4. Finish pouring, stop stream, return bottle to resting position
      const tStopStream = setTimeout(() => {
        if (currentState !== ChardonnayState.POURING) return;
        if (pourStream) {
          pourStream.style.opacity = '0';
          pourStream.classList.remove('flowing');
        }
        if (bottleElement) {
          bottleElement.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
          bottleElement.style.transform = 'translate(0px, 0px) rotate(0deg)';
        }
      }, 2400);
      stateTimers.push(tStopStream);

      // 5. Transition to State C (Filled & Armed)
      const tFinish = setTimeout(() => {
        if (currentState !== ChardonnayState.POURING) return;
        transitionToFilled();
      }, 3300);
      stateTimers.push(tFinish);
    }

    // --------------------------------------------------------------------------
    // STATE C — FORBIDDEN CONTACT (FILLED & ARMED)
    // --------------------------------------------------------------------------
    function transitionToFilled() {
      currentState = ChardonnayState.FILLED;

      if (bottleTarget) bottleTarget.classList.add('armed');
      if (glassTarget) glassTarget.classList.add('armed');

      if (drinkBtn) {
        drinkBtn.disabled = true;
        drinkBtn.textContent = 'Chardonnay Poured — Please Enjoy';
        drinkBtn.style.borderColor = 'rgba(255, 215, 0, 0.6)';
        drinkBtn.style.color = '#fff';
      }
      if (sommelierStatus) {
        sommelierStatus.textContent = 'WINE SERVED // READY FOR TASTING';
        sommelierStatus.style.color = 'var(--accent-gold)';
      }

      if (threeEngine) {
        threeEngine.setArmed(true);
      }
    }

    // Trigger security sequence when touching bottle OR glass in State C
    function handleForbiddenContact(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (currentState !== ChardonnayState.FILLED) return;

      // Interrupt current interaction & prevent duplicate triggers
      clearAllTimers();
      currentState = ChardonnayState.ALARM;

      if (threeEngine) {
        threeEngine.setArmed(false);
      }

      // Play sharp short warning alarm
      if (typeof playChardonnayAlarm === 'function') {
        playChardonnayAlarm();
      } else if (typeof playAccessDenied === 'function') {
        playAccessDenied();
      }

      // Display Fullscreen Red Warning Overlay
      if (overlay) {
        overlay.style.display = 'flex';
        void overlay.offsetWidth; // Force reflow
        overlay.classList.add('active');
      }

      if (securityTitle) {
        securityTitle.textContent = 'DRUNKIE DETECTED';
        securityTitle.style.color = '#ffffff';
        securityTitle.style.opacity = '1';
      }
      if (securitySub) {
        securitySub.textContent = 'SECURITY INFRACTION // UNLAWFUL INEBRIATION IN VIP SECTOR';
        securitySub.style.opacity = '1';
      }
      if (ejectionStage) {
        ejectionStage.style.display = 'none';
        ejectionStage.classList.remove('animating');
      }

      // Transition to State D (Access Revoked) after ~2.0 seconds
      const tRevoke = setTimeout(() => {
        transitionToAccessRevoked();
      }, 2000);
      stateTimers.push(tRevoke);
    }

    // --------------------------------------------------------------------------
    // STATE D — ACCESS REVOKED
    // --------------------------------------------------------------------------
    function transitionToAccessRevoked() {
      if (currentState !== ChardonnayState.ALARM) return;
      currentState = ChardonnayState.ACCESS_REVOKED;

      // Smoothly fade text to ACCESS REVOKED while keeping red overlay visible
      if (securityTitle) {
        securityTitle.style.opacity = '0';
        const tFadeTitle = setTimeout(() => {
          securityTitle.textContent = 'ACCESS REVOKED';
          securityTitle.style.color = '#ff003c';
          securityTitle.style.opacity = '1';
        }, 150);
        stateTimers.push(tFadeTitle);
      }
      if (securitySub) {
        securitySub.style.opacity = '0';
        const tFadeSub = setTimeout(() => {
          securitySub.textContent = 'EXECUTIVE VIP CLEARANCE TERMINATED // CODE RED PROTOCOL';
          securitySub.style.opacity = '1';
        }, 150);
        stateTimers.push(tFadeSub);
      }

      // Transition to State E (Comedic Ejection) after another ~2.0 seconds
      const tEject = setTimeout(() => {
        transitionToComedicEjection();
      }, 2000);
      stateTimers.push(tEject);
    }

    // --------------------------------------------------------------------------
    // STATE E — COMEDIC EJECTION (SLAPSTICK KICK)
    // --------------------------------------------------------------------------
    function transitionToComedicEjection() {
      if (currentState !== ChardonnayState.ACCESS_REVOKED) return;
      currentState = ChardonnayState.EJECTION;

      // Reveal Ejection Stage
      if (ejectionStage) {
        ejectionStage.style.display = 'flex';
        void ejectionStage.offsetWidth;
        ejectionStage.classList.add('animating');
      }

      // Choreograph kick and exaggerated bounce
      // Step 1: Bouncer winds up (0.2s)
      const tKick = setTimeout(() => {
        if (bouncerFig) bouncerFig.classList.add('kick');
        
        // Step 2: Impact sound
        if (typeof playComedicKick === 'function') {
          playComedicKick();
        }

        // Step 3: Drunkie reacts with ridiculous bounce and flies off-screen
        if (drunkieFig) drunkieFig.classList.add('fly');
      }, 200);
      stateTimers.push(tKick);

      // Transition to State F (Reset & Return to Gate) after ejection finishes (~2.3s)
      const tReset = setTimeout(() => {
        executeResetAndReentry();
      }, 2300);
      stateTimers.push(tReset);
    }

    // --------------------------------------------------------------------------
    // STATE F — RESET AND RE-ENTRY (SESSION REVOCATION)
    // --------------------------------------------------------------------------
    function executeResetAndReentry() {
      // 1. Reset visual interaction state
      resetToAvailable();

      // Reset VIP Suite tabs to Suite 1 (default)
      if (typeof window.resetVipSuiteTabs === 'function') {
        window.resetVipSuiteTabs();
      }

      // 2. Revoke VIP Lounge and Lab clearance using existing project access mechanism
      try { isUnlocked = false; } catch (e) {}
      try { isVipUnlocked = false; } catch (e) {}
      if (typeof window !== 'undefined') {
        window.isUnlocked = false;
        window.isVipUnlocked = false;
      }

      // 3. Re-lock all slide navigation pills (except Slide 1)
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

      // 4. Reset Gate security indicators on Slide 1 & Header
      const authDotEl = document.getElementById('auth-status-dot');
      const authTextEl = document.getElementById('auth-status-text');
      if (authDotEl) authDotEl.classList.remove('unlocked');
      if (authTextEl) {
        authTextEl.textContent = 'SECURITY LEVEL: 0 // RESTRICTED ORBITAL ACCESS';
        authTextEl.style.color = 'var(--accent-crimson)';
      }

      // 5. Reset inputs on Slide 1
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

      // 6. Return user directly to Slide 1 (The Ordinary Gate)
      if (typeof window.goToSlide === 'function') {
        window.goToSlide(1);
      } else if (typeof goToSlide === 'function') {
        goToSlide(1);
      }
    }

    // --------------------------------------------------------------------------
    // EVENT LISTENERS & INITIALIZATION
    // --------------------------------------------------------------------------
    if (drinkBtn) {
      drinkBtn.addEventListener('click', startPouring);
    }

    // Contact triggers on BOTH bottle and glass
    if (bottleTarget) {
      bottleTarget.addEventListener('click', handleForbiddenContact);
      bottleTarget.addEventListener('touchend', handleForbiddenContact);
    }
    if (glassTarget) {
      glassTarget.addEventListener('click', handleForbiddenContact);
      glassTarget.addEventListener('touchend', handleForbiddenContact);
    }

    // --------------------------------------------------------------------------
    // THREE.JS 4K PHOTOREALISTIC CHARDONNAY 3D ENGINE
    // --------------------------------------------------------------------------
    function initThreeJsEngine(stageViewport, onTriggerContact) {
      if (typeof THREE === 'undefined' || typeof document === 'undefined') return null;
      const canvas = document.getElementById('chardonnay-3d-canvas');
      if (!canvas || !stageViewport) return null;

      try {
        const width = stageViewport.clientWidth || 800;
        const height = stageViewport.clientHeight || 420;

        // 1. WebGL Renderer with Native 4K High-DPI Scaling
        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
        renderer.setSize(width, height, false);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 2. Scene & Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
        camera.position.set(0, 0.95, 3.8);
        const lookTarget = new THREE.Vector3(0, 0.75, 0);
        camera.lookAt(lookTarget);

        // 3. Cinematic Lighting
        const ambientLight = new THREE.AmbientLight(0x0e1824, 1.3);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5);
        keyLight.position.set(2.5, 3.8, 2.2);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
        rimLight.position.set(-3.2, 2.6, -1.8);
        scene.add(rimLight);

        const causticLight = new THREE.PointLight(0xf59e0b, 2.4, 3.5);
        causticLight.position.set(0.65, 0.45, -0.15);
        scene.add(causticLight);

        // 4. Procedural Nero Marquina Marble Surface
        const marbleCanvas = document.createElement('canvas');
        marbleCanvas.width = 1024;
        marbleCanvas.height = 512;
        const mctx = marbleCanvas.getContext('2d');
        if (mctx) {
          mctx.fillStyle = '#080d12';
          mctx.fillRect(0, 0, 1024, 512);

          // Calcite Veins
          mctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
          mctx.lineWidth = 1.8;
          mctx.beginPath();
          mctx.moveTo(100, 0); mctx.bezierCurveTo(300, 180, 500, 320, 850, 512);
          mctx.moveTo(0, 200); mctx.bezierCurveTo(250, 280, 450, 400, 700, 512);
          mctx.stroke();

          // Amber Caustic Puddle under bottle
          const bottleGrad = mctx.createRadialGradient(720, 280, 10, 720, 280, 240);
          bottleGrad.addColorStop(0, 'rgba(245, 185, 35, 0.36)');
          bottleGrad.addColorStop(0.5, 'rgba(215, 140, 20, 0.16)');
          bottleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          mctx.fillStyle = bottleGrad;
          mctx.fillRect(480, 40, 480, 480);

          // Soft glow under glass
          const glassGrad = mctx.createRadialGradient(280, 280, 5, 280, 280, 180);
          glassGrad.addColorStop(0, 'rgba(245, 205, 65, 0.24)');
          glassGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          mctx.fillStyle = glassGrad;
          mctx.fillRect(100, 100, 360, 360);
        }
        const marbleTexture = new THREE.CanvasTexture(marbleCanvas);
        marbleTexture.generateMipmaps = true;

        const tableGeo = new THREE.PlaneGeometry(10, 6);
        const tableMat = new THREE.MeshStandardMaterial({
          map: marbleTexture,
          roughness: 0.15,
          metalness: 0.22
        });
        const tableMesh = new THREE.Mesh(tableGeo, tableMat);
        tableMesh.rotation.x = -Math.PI / 2;
        tableMesh.receiveShadow = true;
        scene.add(tableMesh);

        // 5. Stemmed Crystal Wine Glass (Left)
        const glassGroup = new THREE.Group();
        glassGroup.position.set(-0.75, 0.0, 0.0);

        // Glass Outer/Inner Shell Lathe
        const glassPoints = [];
        glassPoints.push(new THREE.Vector2(0, 0.002));
        glassPoints.push(new THREE.Vector2(0.35, 0.005));
        glassPoints.push(new THREE.Vector2(0.34, 0.025));
        glassPoints.push(new THREE.Vector2(0.026, 0.025));
        glassPoints.push(new THREE.Vector2(0.025, 0.72));
        glassPoints.push(new THREE.Vector2(0.12, 0.80));
        glassPoints.push(new THREE.Vector2(0.42, 1.05));
        glassPoints.push(new THREE.Vector2(0.32, 1.58));
        glassPoints.push(new THREE.Vector2(0.315, 1.58));
        glassPoints.push(new THREE.Vector2(0.41, 1.05));
        glassPoints.push(new THREE.Vector2(0.11, 0.81));
        glassPoints.push(new THREE.Vector2(0.015, 0.73));
        glassPoints.push(new THREE.Vector2(0, 0.73));

        const glassGeo = new THREE.LatheGeometry(glassPoints, 32);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.96,
          opacity: 1.0,
          transparent: true,
          roughness: 0.03,
          ior: 1.52,
          thickness: 0.8,
          specularIntensity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.castShadow = true;
        glassGroup.add(glassMesh);

        // 3D Liquid Volume inside bowl
        const liquidGroup = new THREE.Group();
        liquidGroup.position.set(0, 0.73, 0);

        const liquidPoints = [];
        liquidPoints.push(new THREE.Vector2(0, 0.002));
        liquidPoints.push(new THREE.Vector2(0.10, 0.08));
        liquidPoints.push(new THREE.Vector2(0.40, 0.32));
        liquidPoints.push(new THREE.Vector2(0.37, 0.46));
        liquidPoints.push(new THREE.Vector2(0, 0.46));

        const liquidGeo = new THREE.LatheGeometry(liquidPoints, 32);
        const liquidMat = new THREE.MeshPhysicalMaterial({
          color: 0xf5d061,
          transmission: 0.82,
          transparent: true,
          roughness: 0.05,
          ior: 1.34,
          attenuationColor: 0xd4af37,
          attenuationDistance: 0.45
        });
        const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
        liquidGroup.add(liquidMesh);

        // Liquid Meniscus Top Cap
        const meniscusGeo = new THREE.CircleGeometry(0.37, 32);
        const meniscusMesh = new THREE.Mesh(meniscusGeo, liquidMat);
        meniscusMesh.position.y = 0.46;
        meniscusMesh.rotation.x = -Math.PI / 2;
        liquidGroup.add(meniscusMesh);

        // Starts completely EMPTY (scaleY = 0.001, visible = false)
        liquidGroup.scale.set(1, 0.001, 1);
        liquidGroup.visible = false;
        glassGroup.add(liquidGroup);

        scene.add(glassGroup);

        // 6. Faceted Hexagonal Decanter Bottle (Right)
        const bottleGroup = new THREE.Group();
        bottleGroup.position.set(0.65, 0.0, 0.0);

        // Faceted Hexagonal Crystal Body
        const bottleBodyGeo = new THREE.CylinderGeometry(0.28, 0.62, 1.15, 6, 4);
        const bottleGlassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.88,
          transparent: true,
          opacity: 1.0,
          roughness: 0.04,
          ior: 1.52,
          thickness: 1.8,
          flatShading: true
        });
        const bottleBodyMesh = new THREE.Mesh(bottleBodyGeo, bottleGlassMat);
        bottleBodyMesh.position.y = 0.575;
        bottleBodyMesh.castShadow = true;
        bottleGroup.add(bottleBodyMesh);

        // Inner Amber Wine Volume
        const bottleWineGeo = new THREE.CylinderGeometry(0.26, 0.58, 1.08, 6, 2);
        const bottleWineMat = new THREE.MeshPhysicalMaterial({
          color: 0xe6b800,
          transmission: 0.70,
          transparent: true,
          attenuationColor: 0xb45309,
          roughness: 0.06
        });
        const bottleWineMesh = new THREE.Mesh(bottleWineGeo, bottleWineMat);
        bottleWineMesh.position.y = 0.575;
        bottleGroup.add(bottleWineMesh);

        // Crystal Neck
        const bottleNeckGeo = new THREE.CylinderGeometry(0.10, 0.28, 0.9, 16);
        const bottleNeckMesh = new THREE.Mesh(bottleNeckGeo, bottleGlassMat);
        bottleNeckMesh.position.y = 1.6;
        bottleGroup.add(bottleNeckMesh);

        // 24k Gold Collar
        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          metalness: 0.95,
          roughness: 0.16
        });
        const goldCollarGeo = new THREE.CylinderGeometry(0.108, 0.108, 0.28, 24);
        const goldCollarMesh = new THREE.Mesh(goldCollarGeo, goldMat);
        goldCollarMesh.position.y = 1.48;
        bottleGroup.add(goldCollarMesh);

        // 24k Gold Stopper / Cap
        const goldCapGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.22, 24);
        const goldCapMesh = new THREE.Mesh(goldCapGeo, goldMat);
        goldCapMesh.position.y = 2.08;
        bottleGroup.add(goldCapMesh);

        // Spout World Position Tracker
        const spoutMarker = new THREE.Object3D();
        spoutMarker.position.set(0, 2.15, 0);
        bottleGroup.add(spoutMarker);

        // Procedural Napa Valley Grand Cru Label
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 512;
        labelCanvas.height = 512;
        const lctx = labelCanvas.getContext('2d');
        if (lctx) {
          lctx.fillStyle = '#0c141d';
          lctx.fillRect(0, 0, 512, 512);

          // Gold Hexagonal Border
          lctx.strokeStyle = '#ffd700';
          lctx.lineWidth = 6;
          lctx.beginPath();
          lctx.moveTo(256, 30); lctx.lineTo(470, 150); lctx.lineTo(470, 360);
          lctx.lineTo(256, 480); lctx.lineTo(42, 360); lctx.lineTo(42, 150);
          lctx.closePath();
          lctx.stroke();

          // Bee Crest
          lctx.fillStyle = '#ffd700';
          lctx.beginPath();
          lctx.arc(256, 170, 18, 0, Math.PI * 2);
          lctx.fill();

          // Typography
          lctx.fillStyle = '#ffd700';
          lctx.font = 'bold 36px "Space Grotesk", serif';
          lctx.textAlign = 'center';
          lctx.fillText('CHARDONNAY', 256, 250);

          lctx.fillStyle = '#cbd5e1';
          lctx.font = '600 20px monospace';
          lctx.fillText('GRAND CRU', 256, 290);

          lctx.fillStyle = '#fbbf24';
          lctx.font = '700 18px monospace';
          lctx.fillText('NAPA VALLEY RESERVE', 256, 330);
        }
        const labelTex = new THREE.CanvasTexture(labelCanvas);
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.38), labelMat);
        labelMesh.position.set(0, 0.58, 0.54);
        bottleGroup.add(labelMesh);

        scene.add(bottleGroup);

        // 7. Physics Stream Container
        let streamMesh = null;
        let isPouring = false;
        let pourProgress = 0;
        let isArmed = false;

        const glassTargetPos = new THREE.Vector3(-0.75, 1.12, 0.0);

        function updateStreamGeometry() {
          if (!isPouring) return;
          const currentSpoutPos = new THREE.Vector3();
          spoutMarker.getWorldPosition(currentSpoutPos);

          const points = [];
          const segments = 16;
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = currentSpoutPos.x + (glassTargetPos.x - currentSpoutPos.x) * t;
            const z = currentSpoutPos.z + (glassTargetPos.z - currentSpoutPos.z) * t;
            // Gravitational arc drop
            const gravityDrop = 0.30 * Math.sin(t * Math.PI) * (1 - 0.4 * t);
            const y = currentSpoutPos.y + (glassTargetPos.y - currentSpoutPos.y) * Math.pow(t, 0.85) - gravityDrop;
            points.push(new THREE.Vector3(x, y, z));
          }

          const curve = new THREE.CatmullRomCurve3(points);
          if (streamMesh) scene.remove(streamMesh);

          const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.024, 8, false);
          const streamMat = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.92
          });
          streamMesh = new THREE.Mesh(tubeGeo, streamMat);
          scene.add(streamMesh);
        }

        function removeStreamGeometry() {
          if (streamMesh) {
            scene.remove(streamMesh);
            streamMesh = null;
          }
        }

        // 8. Mouse Parallax & Raycasting
        let mouseX = 0.5;
        let mouseY = 0.5;
        const raycaster = new THREE.Raycaster();
        const mouseVec = new THREE.Vector2();

        function onMouseMove(e) {
          const rect = canvas.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          mouseX = (e.clientX - rect.left) / rect.width;
          mouseY = (e.clientY - rect.top) / rect.height;

          mouseVec.x = (mouseX * 2) - 1;
          mouseVec.y = -(mouseY * 2) + 1;

          if (isArmed) {
            raycaster.setFromCamera(mouseVec, camera);
            const intersects = raycaster.intersectObjects([bottleGroup, glassGroup], true);
            if (intersects.length > 0) {
              canvas.style.cursor = 'pointer';
              causticLight.intensity = 3.6;
            } else {
              canvas.style.cursor = 'default';
              causticLight.intensity = 2.4;
            }
          } else {
            canvas.style.cursor = 'default';
          }
        }

        function onClick(e) {
          if (!isArmed) return;
          const rect = canvas.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          mouseVec.x = (((e.clientX - rect.left) / rect.width) * 2) - 1;
          mouseVec.y = -(((e.clientY - rect.top) / rect.height) * 2) + 1;

          raycaster.setFromCamera(mouseVec, camera);
          const intersects = raycaster.intersectObjects([bottleGroup, glassGroup], true);
          if (intersects.length > 0) {
            if (typeof onTriggerContact === 'function') {
              onTriggerContact();
            }
          }
        }

        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('click', onClick);

        // 9. Animation Render Loop (60 FPS)
        function animate() {
          requestAnimationFrame(animate);

          // Camera Smooth Parallax Lerp
          const targetCamX = (mouseX - 0.5) * 0.45;
          const targetCamY = 0.95 + (mouseY - 0.5) * 0.25;
          camera.position.x += (targetCamX - camera.position.x) * 0.05;
          camera.position.y += (targetCamY - camera.position.y) * 0.05;
          camera.lookAt(lookTarget);

          // Stream update if pouring
          if (isPouring) {
            updateStreamGeometry();
          }

          renderer.render(scene, camera);
        }
        animate();

        // Handle Resize & Visibility
        function updateViewportSize() {
          const rw = stageViewport.clientWidth || 800;
          const rh = stageViewport.clientHeight || 420;
          if (rw > 0 && rh > 0) {
            camera.aspect = rw / rh;
            camera.updateProjectionMatrix();
            renderer.setSize(rw, rh, false);
          }
        }
        window.addEventListener('resize', updateViewportSize);

        return {
          onTabVisible: updateViewportSize,
          reset: () => {
            isPouring = false;
            isArmed = false;
            removeStreamGeometry();
            bottleGroup.position.set(0.65, 0.0, 0.0);
            bottleGroup.rotation.set(0, 0, 0);
            liquidGroup.scale.set(1, 0.001, 1);
            liquidGroup.visible = false;
            canvas.style.cursor = 'default';
          },
          startPour: (onComplete) => {
            isPouring = false;
            pourProgress = 0;
            removeStreamGeometry();

            const startTime = performance.now();
            const tiltDuration = 1000;
            const pourDuration = 1700;
            const returnDuration = 800;

            function stepPour(now) {
              const elapsed = now - startTime;

              if (elapsed < tiltDuration) {
                const p = elapsed / tiltDuration;
                const ease = p * p * (3 - 2 * p);
                bottleGroup.rotation.z = -0.80 * ease;
                bottleGroup.position.x = 0.65 - 0.35 * ease;
                bottleGroup.position.y = 0.18 * ease;
                requestAnimationFrame(stepPour);
              } else if (elapsed < tiltDuration + pourDuration) {
                isPouring = true;
                const pourElapsed = elapsed - tiltDuration;
                pourProgress = Math.min(1.0, pourElapsed / (pourDuration * 0.85));

                liquidGroup.visible = true;
                liquidGroup.scale.y = Math.max(0.001, pourProgress);

                requestAnimationFrame(stepPour);
              } else if (elapsed < tiltDuration + pourDuration + returnDuration) {
                isPouring = false;
                removeStreamGeometry();
                const returnElapsed = elapsed - tiltDuration - pourDuration;
                const p = 1.0 - (returnElapsed / returnDuration);
                const ease = p * p * (3 - 2 * p);
                bottleGroup.rotation.z = -0.80 * ease;
                bottleGroup.position.x = 0.65 - 0.35 * ease;
                bottleGroup.position.y = 0.18 * ease;

                liquidGroup.visible = true;
                liquidGroup.scale.y = 1.0;

                requestAnimationFrame(stepPour);
              } else {
                isPouring = false;
                removeStreamGeometry();
                bottleGroup.rotation.set(0, 0, 0);
                bottleGroup.position.set(0.65, 0.0, 0.0);
                liquidGroup.visible = true;
                liquidGroup.scale.y = 1.0;
                if (typeof onComplete === 'function') onComplete();
              }
            }
            requestAnimationFrame(stepPour);
          },
          setArmed: (val) => {
            isArmed = !!val;
          }
        };
      } catch (err) {
        console.warn('Three.js 3D Chardonnay initialization fallback:', err);
        return null;
      }
    }

    // Initialize 3D Engine
    const stageViewport = document.getElementById('chardonnay-viewport');
    if (stageViewport) {
      threeEngine = initThreeJsEngine(stageViewport, () => handleForbiddenContact());

      stageViewport.addEventListener('mousemove', (e) => {
        if (bottleTarget) {
          const bRect = bottleTarget.getBoundingClientRect();
          if (bRect && bRect.width > 0 && bRect.height > 0) {
            const bx = Math.max(0, Math.min(100, ((e.clientX - bRect.left) / bRect.width) * 100));
            const by = Math.max(0, Math.min(100, ((e.clientY - bRect.top) / bRect.height) * 100));
            bottleTarget.style.setProperty('--mouse-x', `${bx.toFixed(1)}%`);
            bottleTarget.style.setProperty('--mouse-y', `${by.toFixed(1)}%`);
          }
        }
      });
    }

    // Tab switch listener: reset cleanly and update 3D viewport if user switches suites
    const chardonnayTab = document.querySelector('.vip-tab[data-suite="suite-2"]');
    if (chardonnayTab) {
      chardonnayTab.addEventListener('click', () => {
        if (chardonnayTab.classList.contains('active')) return;
        if (currentState !== ChardonnayState.FILLED && currentState !== ChardonnayState.POURING) {
          resetToAvailable();
        }
        if (threeEngine && typeof threeEngine.onTabVisible === 'function') {
          setTimeout(() => threeEngine.onTabVisible(), 60);
        }
      });
    }

    // Initialize State A on load
    resetToAvailable();

    // Expose reset globally for clean session teardown
    window.resetChardonnayTrap = resetToAvailable;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
