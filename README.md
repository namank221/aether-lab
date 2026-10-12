# Aether Ultimate Lab v4.0 — Substrate-Separated Functional Architecture

## The Four-Tier Paradigm

This project is separated strictly by **computing substrate and operational function**, ensuring zero domain pollution across layers:

---

### Tier 0: The Compiler & Master Linker Chassis
* **Substrate:** Project Root & Host Build Pipeline
* **`index.html`:** The master integration chassis. Compiles and mounts all Tier 1 Presentation and Graphics modules into the browser. Located at project root to guarantee zero-CORS execution under `file:///` and HTTP.
* **`start.bat`:** Windows 1-click launcher for port 8000.
* **`tier0/manifest.json`:** Formal system architecture manifest.

---

### Tier 1: Presentation & Graphics Canvas
* **Substrate:** Browser Runtime (V8 Engine, WebGL, DOM, Canvas)
* **`tier1/css/` (Visual Styling & Layout Ergonomics):**
  * `theme.css`: Cybernetic color tokens, typography, root variables, header/footer styling.
  * `station1.css`: 12-column White Paper layout, authentication terminal, quantum nexus bracket, 3D Centurion card, dossier.
  * `station2.css`: Upper telemetry bridge, docked dual-slider deck, Celestial Atlas modal.
  * `stations_3_10.css`: Laboratories 3–7, telemetry charts 8 & 9, wormhole transit 10, VIP modal.
  * `chardonnay.css`: Styling for the VIP lounge chardonnay screen.
  * `bank_terminal.css`: Styling for the private client bank terminal screen.
* **`tier1/js/` (Browser Graphics, Audio & UI Controllers):**
  * `audio.js`: Web Audio API procedural sound synthesizer.
  * `core.js`: Three.js scene, camera, lighting, 120,000 particle mathematical coordinates, Fibonacci geodesic sphere math.
  * `station1.js`: Passcode authentication, 3D sphere canvas animation, 360° card inertia & flip.
  * `station2.js`: Zoom slider, celestial body selector, Celestial Atlas blueprint modal.
  * `stations_3_9.js`: Stations 3–7 interactive lab controls, Stations 8 & 9 Chart.js configurations.
  * `station10.js`: Hyperspace wormhole transit trigger, warp acceleration timing, 2.0s observation baseline.
  * `chardonnay.js`: Behavior for the VIP lounge chardonnay screen.
  * `bank_terminal.js`: Behavior for the private client bank terminal screen.
  * `app.js`: Master navigation controller (`goToSlide`), 60 FPS global render loop, hotkeys, resize.

---

### Tier 2: Agents & Operating System Automation
* **Substrate:** Windows Host & Agent Runtime
* **`tier2/batch/start.bat`:** Windows automation script to spawn local servers and launch browsers.
* **`tier2/python/`:** Reserved for Python automation agents, local system scripts, data loggers, and workflow runners.

---

### Tier 3: Silicon & Bare Metal Compute
* **Substrate:** Native CPU/GPU Hardware (Registers, Cache, Memory Alignment)
* **`tier3/cpp/`:** Reserved for native C++ high-throughput particle & simulation engines.
* **`tier3/wasm/`:** Reserved for compiled WebAssembly binaries.
* *(Currently empty and unpolluted by browser code, waiting for native metal).*
