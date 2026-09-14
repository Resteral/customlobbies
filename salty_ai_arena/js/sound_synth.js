/**
 * SoundSynthesizer - Realistic Multi-Layered Foley Audio & Announcer
 * Generates realistic physical impact sounds, bone-crunching Foley layers,
 * resonant metallic parry pings, and dynamic spatial combat audio using Web Audio API.
 */
class SoundSynthesizer {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.announcerEnabled = true;
        this.volume = 0.45;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported or blocked", e);
        }
    }

    ensureContext() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Realistic Multi-Layered Flesh & Bone Impact
     * Layer 1: Sub-bass chest thump (40-80 Hz punch through body)
     * Layer 2: Mid-frequency flesh smack (300-600 Hz)
     * Layer 3: High-frequency transient snap / bone crunch (filtered noise)
     */
    playHit(heavy = false, isHeadshot = false) {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const vol = this.volume * (heavy ? 1.0 : 0.65) * (isHeadshot ? 1.25 : 1.0);

        // --- Layer 1: Sub-Bass Thump ---
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(isHeadshot ? 140 : (heavy ? 95 : 130), now);
        subOsc.frequency.exponentialRampToValueAtTime(32, now + (heavy ? 0.28 : 0.14));

        subGain.gain.setValueAtTime(vol * 0.9, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.28 : 0.14));

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.3);

        // --- Layer 2: Mid Flesh Impact ---
        const midOsc = this.ctx.createOscillator();
        const midGain = this.ctx.createGain();
        midOsc.type = heavy ? 'sawtooth' : 'triangle';
        midOsc.frequency.setValueAtTime(heavy ? 220 : 380, now);
        midOsc.frequency.exponentialRampToValueAtTime(60, now + (heavy ? 0.18 : 0.1));

        midGain.gain.setValueAtTime(vol * 0.6, now);
        midGain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.18 : 0.1));

        midOsc.connect(midGain);
        midGain.connect(this.ctx.destination);
        midOsc.start(now);
        midOsc.stop(now + 0.2);

        // --- Layer 3: High Transient Snap / Bone Crack ---
        const bufferSize = Math.floor(this.ctx.sampleRate * (heavy ? 0.18 : 0.08));
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = isHeadshot ? 'highpass' : 'bandpass';
        noiseFilter.frequency.setValueAtTime(isHeadshot ? 2200 : 1200, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(vol * (heavy ? 1.1 : 0.6), now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.18 : 0.08));

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.2);
    }

    /**
     * Resonant Metallic Parry (Just-Defend) Sound
     * High resonant bell-like harmonic ping with shimmer decay
     */
    playParry() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [1860, 2480, 3720]; // Harmonic metallic overtones

        freqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);

            const duration = 0.45 - idx * 0.08;
            gain.gain.setValueAtTime(this.volume * (0.5 / (idx + 1)), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + duration);
        });
    }

    /**
     * Guard Block / Armor Deflect
     */
    playBlock() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.1);

        gain.gain.setValueAtTime(this.volume * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        // Dull thud filter
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    /**
     * Guard Crush / Poise Break
     * Loud shattering explosion & glass/metal fracture
     */
    playPoiseBreak() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Shatter noise
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1600, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 1.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.4);
    }

    /**
     * Realistic Swing Whiff / Air Swoosh
     */
    playWhiff() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(900, now + 0.06);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.12);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.15);
    }

    playLaser() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    playSuperCharge() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.6);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.85, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.75);
    }

    playSuperExplosion() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.28));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now);
        filter.frequency.exponentialRampToValueAtTime(45, now + 0.8);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 1.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.95);
    }

    playCrowdHype() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 1.3);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(i * 0.012));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(550, now);
        filter.Q.value = 1.6;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.45, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 1.35);
    }

    playCoin() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now);
        osc2.frequency.setValueAtTime(1318.51, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.setValueAtTime(this.volume * 0.5, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.08);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.35);
    }

    playKO() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 1.3);

        gain.gain.setValueAtTime(this.volume * 1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
    }

    announce(text, pitch = 1.0, rate = 1.05) {
        if (!this.announcerEnabled) return;
        if (!('speechSynthesis' in window)) return;

        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = pitch;
            utterance.rate = rate;
            utterance.volume = this.volume * 1.6;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira')));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("Speech synthesis error", e);
        }
    }
}

window.soundSynth = new SoundSynthesizer();
