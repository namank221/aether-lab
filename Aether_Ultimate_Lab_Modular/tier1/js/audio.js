/* ==========================================================================
   1. PROCEDURAL SOUND SYNTHESIZER ENGINE (WEB AUDIO API)
   ========================================================================== */
let audioCtx = null;
let masterGain = null;
let analyserNode = null;
let soundEnabled = true;
let droneOsc = null;
let droneGain = null;
let synthWaveType = 'sine';

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.28, audioCtx.currentTime);

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 64;
    masterGain.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Keystroke Mechanical Click Sound
function playKeyClick() {
  if (!soundEnabled) return;
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const randFreq = 950 + Math.random() * 400;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(randFreq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.02);
}

// Access Granted Pneumatic Chime
function playAccessGranted() {
  if (!soundEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  [369.99, 466.16, 554.37, 739.99].forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.07);
    gain.gain.setValueAtTime(0.15, now + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.7);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now + idx * 0.07);
    osc.stop(now + idx * 0.07 + 0.7);
  });
}

// Access Denied Lockout Buzzer
function playAccessDenied() {
  if (!soundEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(85, now);
  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.32);
}

// VIP Access Deep Harmonic Pulse
function playVipGranted() {
  if (!soundEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;

  // Sub-bass impact
  const sub = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(55, now);
  subGain.gain.setValueAtTime(0.4, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  sub.connect(subGain);
  subGain.connect(masterGain);
  sub.start(now);
  sub.stop(now + 0.9);

  // Solfeggio shimmer
  [528, 660, 792].forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now + 0.08 * i);
    g.gain.setValueAtTime(0.15, now + 0.08 * i);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08 * i + 1.2);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(now + 0.08 * i);
    osc.stop(now + 0.08 * i + 1.2);
  });
}

// Playable Synth Note
function playSynthNote(freq, dur = 1.2) {
  if (!soundEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = synthWaveType;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + dur);
}

// Continuous 40Hz Drone
function toggleVipDrone() {
  initAudio();
  const droneBtn = document.getElementById('btn-vip-drone');
  if (droneOsc) {
    droneOsc.stop();
    droneOsc.disconnect();
    droneOsc = null;
    if (droneBtn) {
      droneBtn.textContent = "TOGGLE 40HZ BINAURAL DRONE";
      droneBtn.style.background = "";
    }
  } else {
    droneOsc = audioCtx.createOscillator();
    droneGain = audioCtx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(40, audioCtx.currentTime);
    droneGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    droneOsc.connect(droneGain);
    droneGain.connect(masterGain);
    droneOsc.start();
    if (droneBtn) {
      droneBtn.textContent = "40HZ DRONE ACTIVE (STOP)";
      droneBtn.style.background = "var(--accent-gold)";
      droneBtn.style.color = "#020408";
    }
  }
}

const vipDroneBtn = document.getElementById('btn-vip-drone');
if (vipDroneBtn) {
  vipDroneBtn.addEventListener('click', toggleVipDrone);
}

// Audio Mute Toggle
document.getElementById('audio-toggle-btn').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  document.getElementById('audio-toggle-btn').textContent = soundEnabled ? "SOUND: ON" : "SOUND: MUTED";
  document.getElementById('audio-toggle-btn').style.color = soundEnabled ? "var(--accent-cyan)" : "var(--text-muted)";
  if (masterGain) {
    masterGain.gain.setValueAtTime(soundEnabled ? 0.28 : 0, audioCtx.currentTime);
  }
});

/* ==========================================================================
   2. CHARDONNAY LUXURY & SECURITY SFX
   ========================================================================== */
function playChardonnayPour() {
  if (!soundEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  try {
    const bufferSize = Math.floor(audioCtx.sampleRate * 2.0);
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, now);
    bandpass.frequency.exponentialRampToValueAtTime(1800, now + 1.8);
    bandpass.Q.setValueAtTime(6.0, now);

    const pourGain = audioCtx.createGain();
    pourGain.gain.setValueAtTime(0.01, now);
    pourGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
    pourGain.gain.setValueAtTime(0.12, now + 1.4);
    pourGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

    whiteNoise.connect(bandpass);
    bandpass.connect(pourGain);
    pourGain.connect(masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 2.0);

    [587.33, 659.25, 880.00].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.4 + idx * 0.2);
      g.gain.setValueAtTime(0.03, now + 0.4 + idx * 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.2 + 0.4);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now + 0.4 + idx * 0.2);
      osc.stop(now + 0.4 + idx * 0.2 + 0.4);
    });
  } catch (e) {
    console.warn("Audio pour synth fallback:", e);
  }
}

function playChardonnayAlarm() {
  if (!soundEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  [0, 0.16].forEach(offset => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now + offset);
    osc.frequency.linearRampToValueAtTime(440, now + offset + 0.14);
    gain.gain.setValueAtTime(0.32, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now + offset);
    osc.stop(now + offset + 0.15);
  });
}

function playComedicKick() {
  if (!soundEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;

  // Punch impact thud
  const thud = audioCtx.createOscillator();
  const thudGain = audioCtx.createGain();
  thud.type = 'triangle';
  thud.frequency.setValueAtTime(140, now);
  thud.frequency.exponentialRampToValueAtTime(35, now + 0.18);
  thudGain.gain.setValueAtTime(0.5, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  thud.connect(thudGain);
  thudGain.connect(masterGain);
  thud.start(now);
  thud.stop(now + 0.2);

  // Cartoon slide-whistle bounce upward
  const whistle = audioCtx.createOscillator();
  const whistleGain = audioCtx.createGain();
  whistle.type = 'sine';
  whistle.frequency.setValueAtTime(260, now + 0.08);
  whistle.frequency.exponentialRampToValueAtTime(950, now + 0.55);
  whistleGain.gain.setValueAtTime(0.01, now + 0.08);
  whistleGain.gain.linearRampToValueAtTime(0.25, now + 0.18);
  whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
  whistle.connect(whistleGain);
  whistleGain.connect(masterGain);
  whistle.start(now + 0.08);
  whistle.stop(now + 0.75);
}
