// Spatial Voice & Tactical Radio Module
window.VoiceRadio = {
  currentMode: 1, // 0: Whisper, 1: Normal, 2: Shout
  modes: [
    { label: "Whisper (4m)", color: "#94a3b8" },
    { label: "Normal (15m)", color: "#00f2fe" },
    { label: "Shout (35m)", color: "#f59e0b" }
  ],
  radioFreq: "101.5",
  isRadioActive: false,

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'z' && !e.repeat && document.activeElement.tagName !== 'INPUT') {
        this.cycleVoiceMode();
      }
    });
    this.updateHUD();
  },

  cycleVoiceMode() {
    this.currentMode = (this.currentMode + 1) % this.modes.length;
    this.updateHUD();
  },

  updateHUD() {
    const mode = this.modes[this.currentMode];
    const textEl = document.getElementById('voice-mode-label');
    const dotEl = document.getElementById('voice-indicator-dot');

    if (textEl) {
      textEl.textContent = mode.label;
      textEl.style.color = mode.color;
    }
    if (dotEl) {
      dotEl.style.backgroundColor = mode.color;
      dotEl.style.boxShadow = `0 0 10px ${mode.color}`;
    }
  },

  toggleRadio() {
    this.isRadioActive = !this.isRadioActive;
    alert(this.isRadioActive ? `Connected to Tactical Radio Channel: ${this.radioFreq} MHz` : "Radio disconnected.");
  }
};
