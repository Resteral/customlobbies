// High-Fidelity Procedural WebAudio Synthesizer for Mixology
// Generates realistic fluid streams, ice rattles, shaker turbulence, and glass clinks dynamically
class MixologyAudioEngine {
  constructor() {
    this.ctx = null;
    this.pourGain = null;
    this.pourSource = null;
    this.isPouring = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic liquid pouring stream sound with low-pass resonance
  startPourSound() {
    this.init();
    if (this.isPouring) return;
    this.isPouring = true;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate liquid stream frequency
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // Subtle resonance filter
    const highFilter = this.ctx.createBiquadFilter();
    highFilter.type = 'lowpass';
    highFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    this.pourGain = this.ctx.createGain();
    this.pourGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.pourGain.gain.exponentialRampToValueAtTime(0.28, this.ctx.currentTime + 0.15);

    whiteNoise.connect(filter);
    filter.connect(highFilter);
    highFilter.connect(this.pourGain);
    this.pourGain.connect(this.ctx.destination);

    whiteNoise.start(0);
    this.pourSource = whiteNoise;
  }

  stopPourSound() {
    if (!this.isPouring || !this.pourGain) return;
    this.isPouring = false;

    this.pourGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    setTimeout(() => {
      if (this.pourSource) {
        try { this.pourSource.stop(); } catch(e) {}
        this.pourSource.disconnect();
      }
    }, 150);
  }

  // Ice cube clink sound against heavy glass
  playIceClink() {
    this.init();
    const now = this.ctx.currentTime;
    
    // High-pitched crystal glass resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    const freq = 2200 + Math.random() * 800;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.18);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Metal Cobbler Shaker rattling beat sound
  playShakerRattle() {
    this.init();
    const now = this.ctx.currentTime;

    // Metal thud + ice impact noise burst
    const bufferSize = this.ctx.sampleRate * 0.15;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(5.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.15);
  }

  // Cork pop / Bottle uncork sound
  playCorkPop() {
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Sparkling garnish / Success chime
  playSuccessChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + (idx * 0.06);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }
}

window.mixologyAudio = new MixologyAudioEngine();
