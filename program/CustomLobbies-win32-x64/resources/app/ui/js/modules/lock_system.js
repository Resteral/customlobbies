// City Underground - Advanced Base Defense Lock System & Interactive Lockpicking Engine
window.LockSystem = {
  activePropertyId: 'apt_101',
  targetDoorId: 'door_wood_main',
  activeLockTier: 'tier2_medeco', // 'tier1_brass', 'tier2_medeco', 'tier3_keypad', 'tier4_biometric', 'tier5_maglock'
  activeMinigameMode: 'tumbler', // 'tumbler', 'electronic', 'biometric', 'installer'
  onSuccessCallback: null,
  audioCtx: null,

  // Lock Tiers Registry
  lockTiers: {
    tier1_brass: {
      name: 'Standard 5-Pin Brass Tumbler',
      tier: 1,
      icon: '🔒',
      color: '#d97706',
      pins: 5,
      pickDifficulty: 'Easy',
      breakChance: 0.1,
      desc: 'Standard residential lock cylinder with smooth brass pins.'
    },
    tier2_medeco: {
      name: 'Medeco Biaxial Anti-Pick Lock',
      tier: 2,
      icon: '🛡️',
      color: '#0284c7',
      pins: 6,
      pickDifficulty: 'Hard (Spool & Serrated Pins)',
      breakChance: 0.25,
      desc: 'High-security cylinder with angled pin chisel tips and dual sidebars.'
    },
    tier3_keypad: {
      name: 'Digital Keypad Solenoid Deadbolt',
      tier: 3,
      icon: '🔢',
      color: '#a855f7',
      pickDifficulty: 'Electronic Bypass (Multimeter)',
      requiresCircuitBypass: true,
      desc: 'Microprocessor controlled motorized deadbolt with anti-tamper alarm.'
    },
    tier4_biometric: {
      name: 'Capacitive Biometric Fingerprint Scanner',
      tier: 4,
      icon: '🧬',
      color: '#10b981',
      pickDifficulty: 'Thermal Residue Hacking',
      desc: 'Sub-dermal fingerprint node sensor with laser verification.'
    },
    tier5_maglock: {
      name: '1200-lb Heavy Industrial Maglock',
      tier: 5,
      icon: '⚡',
      color: '#ef4444',
      pickDifficulty: 'EMP / Relay Bridge',
      desc: 'Fail-secure electromagnetic holding coil rated at 1,200 lbs holding force.'
    }
  },

  // 5-Pin Mechanical Tumbler State
  tumblerState: {
    pins: [
      { height: 0, target: 50, isSet: false, isBinding: true, type: 'standard' },
      { height: 0, target: 75, isSet: false, isBinding: false, type: 'spool' },
      { height: 0, target: 35, isSet: false, isBinding: false, type: 'serrated' },
      { height: 0, target: 60, isSet: false, isBinding: false, type: 'standard' },
      { height: 0, target: 80, isSet: false, isBinding: false, type: 'spool' }
    ],
    selectedPinIdx: 0,
    tensionTorque: 0, // 0 to 100%
    plugRotation: 0, // 0 to 90 degrees
    pickIntegrity: 100,
    bindingOrder: [0, 2, 1, 3, 4]
  },

  // Electronic Bypass Circuit State
  circuitState: {
    wires: [
      { id: 'red', name: 'Power Line (+12V DC)', color: '#ef4444', voltage: 12.0, isCut: false, isBridged: false, targetAction: 'bridge' },
      { id: 'blue', name: 'Solenoid Trigger Pulse', color: '#38bdf8', voltage: 5.0, isCut: false, isBridged: false, targetAction: 'bridge' },
      { id: 'yellow', name: 'Anti-Tamper Siren Ground', color: '#eab308', voltage: 0.0, isCut: false, isBridged: false, targetAction: 'cut' },
      { id: 'green', name: 'LED Status Relay', color: '#10b981', voltage: 3.3, isCut: false, isBridged: false, targetAction: 'leave' }
    ],
    multimeterProbe: null,
    alarmTriggered: false,
    solenoidBypassed: false
  },

  // Biometric Thermal State
  biometricState: {
    codeSequence: [7, 2, 9, 4],
    scannedHeatNodes: [
      { digit: 7, temp: '36.8°C (Fresh)', intensity: 0.95 },
      { digit: 2, temp: '34.2°C (Recent)', intensity: 0.75 },
      { digit: 9, temp: '31.5°C (Warm)', intensity: 0.55 },
      { digit: 4, temp: '29.1°C (Fading)', intensity: 0.35 }
    ],
    enteredDigits: []
  },

  // Manual Installation State
  lockInstallState: {
    step: 1, // 1: Core Cylinder, 2: Stack Pins & Springs, 3: Set-Screw & Plate
    cylinderInserted: false,
    pinsLoaded: [false, false, false, false, false],
    faceplateScrewed: false,
    chosenTier: 'tier2_medeco'
  },

  playAudioFx(type) {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;

      if (type === 'pin_click') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'false_gate') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'unlock_pop') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'wire_snip') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'alarm_blast') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    } catch (e) {
      console.warn("Lock audio synthesis unavailable", e);
    }
  },

  // Open Lockpicking & Hacking Minigame
  openMinigame(lockTier = 'tier1_brass', targetId = 'door_1', onSuccess = null) {
    this.activeLockTier = lockTier;
    this.targetDoorId = targetId;
    this.onSuccessCallback = onSuccess;

    const def = this.lockTiers[lockTier] || this.lockTiers.tier1_brass;

    if (def.tier === 3 || def.tier === 5) {
      this.activeMinigameMode = 'electronic';
      this.initElectronicBypass();
    } else if (def.tier === 4) {
      this.activeMinigameMode = 'biometric';
      this.initBiometricBypass();
    } else {
      this.activeMinigameMode = 'tumbler';
      this.initTumblerLockpick();
    }

    document.getElementById('modal-advanced-lock')?.classList.remove('hidden');
    this.switchModeUI(this.activeMinigameMode);
  },

  close() {
    document.getElementById('modal-advanced-lock')?.classList.add('hidden');
  },

  switchModeUI(mode) {
    document.querySelectorAll('.lock-mode-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`lock-section-${mode}`)?.classList.remove('hidden');

    const titleEl = document.getElementById('lock-modal-title');
    const badgeEl = document.getElementById('lock-modal-tier-badge');
    const def = this.lockTiers[this.activeLockTier] || this.lockTiers.tier1_brass;

    if (titleEl) titleEl.textContent = `🔐 ${def.name}`;
    if (badgeEl) {
      badgeEl.textContent = `[TIER ${def.tier} DEFENSE]`;
      badgeEl.style.color = def.color;
    }
  },

  // ================= 1. 5-PIN MECHANICAL TUMBLER LOCKPICKING =================
  initTumblerLockpick() {
    const isMedeco = this.activeLockTier === 'tier2_medeco';
    this.tumblerState = {
      pins: [
        { height: 0, target: 45, isSet: false, isBinding: true, type: 'standard' },
        { height: 0, target: 70, isSet: false, isBinding: false, type: isMedeco ? 'spool' : 'standard' },
        { height: 0, target: 30, isSet: false, isBinding: false, type: isMedeco ? 'serrated' : 'standard' },
        { height: 0, target: 60, isSet: false, isBinding: false, type: 'standard' },
        { height: 0, target: 80, isSet: false, isBinding: false, type: isMedeco ? 'spool' : 'standard' }
      ],
      selectedPinIdx: 0,
      tensionTorque: 40,
      plugRotation: 0,
      pickIntegrity: 100,
      bindingOrder: [0, 2, 1, 3, 4]
    };
    this.renderTumblerCanvas();
  },

  selectTumblerPin(pinIdx) {
    this.tumblerState.selectedPinIdx = pinIdx;
    this.playAudioFx('pin_click');
    this.renderTumblerCanvas();
  },

  liftSelectedPin(amount = 10) {
    const p = this.tumblerState.pins[this.tumblerState.selectedPinIdx];
    if (!p || p.isSet) return;

    p.height = Math.min(100, p.height + amount);

    // Check shear line alignment
    const diff = Math.abs(p.height - p.target);
    if (diff < 8) {
      p.isSet = true;
      p.height = p.target;
      this.playAudioFx('pin_click');

      // Find next binding pin in sequence
      this.updateBindingSequence();

      // Check if all pins are set
      const allSet = this.tumblerState.pins.every(pin => pin.isSet);
      if (allSet) {
        this.tumblerState.plugRotation = 90;
        this.playAudioFx('unlock_pop');
        this.renderTumblerCanvas();
        setTimeout(() => {
          alert("🎉 CLICK-TURN! All 5 pins aligned to the shear line! Lock successfully picked!");
          if (this.onSuccessCallback) this.onSuccessCallback();
          this.close();
        }, 500);
        return;
      }
    } else if (p.type === 'spool' && p.height > 40 && p.height < 65) {
      this.playAudioFx('false_gate');
    }

    this.renderTumblerCanvas();
  },

  updateBindingSequence() {
    for (let i = 0; i < this.tumblerState.pins.length; i++) {
      this.tumblerState.pins[i].isBinding = false;
    }
    for (let idx of this.tumblerState.bindingOrder) {
      if (!this.tumblerState.pins[idx].isSet) {
        this.tumblerState.pins[idx].isBinding = true;
        break;
      }
    }
  },

  setTension(torqueVal) {
    this.tumblerState.tensionTorque = Number(torqueVal);
    const badge = document.getElementById('lock-tension-value');
    if (badge) badge.textContent = `${torqueVal}% Torque`;

    if (torqueVal > 85) {
      this.tumblerState.pickIntegrity = Math.max(0, this.tumblerState.pickIntegrity - 15);
      if (this.tumblerState.pickIntegrity <= 0) {
        this.playAudioFx('false_gate');
        alert("💥 SNAP! Excessive tension wrench torque snapped your lockpick!");
        this.close();
        return;
      }
    }
    this.renderTumblerCanvas();
  },

  renderTumblerCanvas() {
    const canvas = document.getElementById('lock-tumbler-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Lock Body Housing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Shear Line (Dashed Cyan Indicator)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(30, 90);
    ctx.lineTo(w - 30, 90);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.font = '10px monospace';
    ctx.fillText('SHEAR LINE ───', w - 100, 85);

    // Draw 5 Pin Stacks
    const startX = 60;
    const spacing = 70;

    this.tumblerState.pins.forEach((pin, idx) => {
      const px = startX + idx * spacing;
      const isSelected = idx === this.tumblerState.selectedPinIdx;

      // Pin Chamber Well
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px - 14, 20, 28, 140);
      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.strokeRect(px - 14, 20, 28, 140);

      // Top Driver Pin (Blue Steel)
      const driverY = 30 + (pin.height * 0.45);
      ctx.fillStyle = pin.isSet ? '#10b981' : (pin.type === 'spool' ? '#a855f7' : '#0284c7');
      ctx.fillRect(px - 10, driverY, 20, 35);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(px - 10, driverY, 20, 35);

      // Bottom Key Pin (Brass)
      const keyPinY = 90 + (pin.height * 0.45);
      ctx.fillStyle = pin.isSet ? '#10b981' : '#d97706';
      ctx.fillRect(px - 10, keyPinY, 20, 45);
      ctx.strokeRect(px - 10, keyPinY, 20, 45);

      // Pin Number & State Label
      ctx.fillStyle = pin.isSet ? '#10b981' : (pin.isBinding ? '#f59e0b' : '#64748b');
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`P${idx + 1}`, px, 180);

      if (pin.isSet) {
        ctx.fillText('SET ✓', px, 195);
      } else if (pin.isBinding) {
        ctx.fillText('BIND ⚠️', px, 195);
      }
    });

    // Lockpick Blade Probe Visual
    const selX = startX + this.tumblerState.selectedPinIdx * spacing;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10, 155);
    ctx.lineTo(selX, 150);
    ctx.lineTo(selX, 135 - this.tumblerState.pins[this.tumblerState.selectedPinIdx].height * 0.45);
    ctx.stroke();

    // Tension Wrench Bottom Indicator
    ctx.fillStyle = '#64748b';
    ctx.fillRect(20, h - 25, w - 40, 12);
    ctx.fillStyle = 'var(--accent-cyan)';
    ctx.fillRect(20, h - 25, (w - 40) * (this.tumblerState.tensionTorque / 100), 12);
  },

  // ================= 2. ELECTRONIC CIRCUIT & MULTIMETER BYPASS =================
  initElectronicBypass() {
    this.circuitState = {
      wires: [
        { id: 'red', name: 'Power Line (+12V DC)', color: '#ef4444', voltage: 12.0, isCut: false, isBridged: false, targetAction: 'bridge' },
        { id: 'blue', name: 'Solenoid Trigger Pulse', color: '#38bdf8', voltage: 5.0, isCut: false, isBridged: false, targetAction: 'bridge' },
        { id: 'yellow', name: 'Anti-Tamper Siren Ground', color: '#eab308', voltage: 0.0, isCut: false, isBridged: false, targetAction: 'cut' },
        { id: 'green', name: 'LED Status Relay', color: '#10b981', voltage: 3.3, isCut: false, isBridged: false, targetAction: 'leave' }
      ],
      multimeterProbe: null,
      alarmTriggered: false,
      solenoidBypassed: false
    };
    this.renderCircuitUI();
  },

  testWireMultimeter(wireId) {
    const w = this.circuitState.wires.find(x => x.id === wireId);
    if (!w) return;

    this.playAudioFx('pin_click');
    const readEl = document.getElementById('circuit-multimeter-reading');
    if (readEl) {
      readEl.textContent = `${w.voltage.toFixed(1)}V DC (${w.name})`;
      readEl.style.color = 'var(--accent-cyan)';
    }
  },

  cutWire(wireId) {
    const w = this.circuitState.wires.find(x => x.id === wireId);
    if (!w || w.isCut) return;

    w.isCut = true;
    this.playAudioFx('wire_snip');

    if (w.id === 'red') {
      // Cutting main power alarms the system
      this.playAudioFx('alarm_blast');
      alert("🚨 ALARM TRIGGERED! Tamper circuit detected voltage drop on +12V power line!");
      this.close();
      return;
    }

    this.renderCircuitUI();
    this.checkCircuitVictory();
  },

  bridgeWire(wireId) {
    const w = this.circuitState.wires.find(x => x.id === wireId);
    if (!w || w.isBridged) return;

    w.isBridged = true;
    this.playAudioFx('pin_click');
    this.renderCircuitUI();
    this.checkCircuitVictory();
  },

  checkCircuitVictory() {
    const redBridged = this.circuitState.wires.find(x => x.id === 'red')?.isBridged;
    const blueBridged = this.circuitState.wires.find(x => x.id === 'blue')?.isBridged;
    const yellowCut = this.circuitState.wires.find(x => x.id === 'yellow')?.isCut;

    if (redBridged && blueBridged && yellowCut) {
      this.playAudioFx('unlock_pop');
      setTimeout(() => {
        alert("🎉 SOLENOID BYPASSED! Digital keypad lock powered down and deadbolt retracted!");
        if (this.onSuccessCallback) this.onSuccessCallback();
        this.close();
      }, 400);
    }
  },

  renderCircuitUI() {
    const container = document.getElementById('circuit-wires-list');
    if (!container) return;
    container.innerHTML = '';

    this.circuitState.wires.forEach(w => {
      const card = document.createElement('div');
      card.className = 'circuit-wire-card';
      card.style.borderLeft = `5px solid ${w.color}`;
      card.innerHTML = `
        <div style="flex: 1;">
          <div style="font-weight: 700; color: #fff; font-size: 13px;">${w.name}</div>
          <div style="font-size: 11px; color: var(--text-muted);">
            Status: ${w.isCut ? '✂️ CUT' : (w.isBridged ? '⚡ BRIDGED (Jumper Wire)' : 'Normal')}
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn-builder-sm" onclick="LockSystem.testWireMultimeter('${w.id}')">📟 Probe</button>
          <button class="btn-builder-sm" onclick="LockSystem.bridgeWire('${w.id}')" ${w.isBridged ? 'disabled' : ''}>⚡ Bridge</button>
          <button class="btn-builder-sm" style="color: var(--accent-danger);" onclick="LockSystem.cutWire('${w.id}')" ${w.isCut ? 'disabled' : ''}>✂️ Cut</button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  // ================= 3. BIOMETRIC THERMAL RESIDUE SCANNER =================
  initBiometricBypass() {
    this.biometricState.enteredDigits = [];
    this.renderBiometricUI();
  },

  pressBiometricDigit(digit) {
    if (this.biometricState.enteredDigits.length < 4) {
      this.biometricState.enteredDigits.push(digit);
      this.playAudioFx('pin_click');
      this.renderBiometricUI();

      if (this.biometricState.enteredDigits.length === 4) {
        const isMatch = this.biometricState.enteredDigits.every((d, i) => d === this.biometricState.codeSequence[i]);
        if (isMatch) {
          this.playAudioFx('unlock_pop');
          setTimeout(() => {
            alert("🎉 THERMAL MATCH! Heat residue code matched active sequence! Biometric scanner bypassed!");
            if (this.onSuccessCallback) this.onSuccessCallback();
            this.close();
          }, 400);
        } else {
          this.playAudioFx('false_gate');
          alert("❌ INVALID SEQUENCE! Thermal heat signature order mismatched.");
          this.biometricState.enteredDigits = [];
          this.renderBiometricUI();
        }
      }
    }
  },

  renderBiometricUI() {
    const disp = document.getElementById('biometric-code-display');
    if (disp) {
      disp.textContent = this.biometricState.enteredDigits.join(' ') || '_ _ _ _';
    }
  },

  // ================= 4. MANUAL LOCK INSTALLATION & UPGRADING =================
  openInstaller(targetObjId = 'door_1') {
    this.targetDoorId = targetObjId;
    this.lockInstallState = {
      step: 1,
      cylinderInserted: false,
      pinsLoaded: [false, false, false, false, false],
      faceplateScrewed: false,
      chosenTier: 'tier2_medeco'
    };

    document.getElementById('modal-advanced-lock')?.classList.remove('hidden');
    this.switchModeUI('installer');
    this.goToInstallStep(1);
  },

  selectInstallLockTier(tierId) {
    this.lockInstallState.chosenTier = tierId;
    document.querySelectorAll('.btn-lock-tier-choice').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-tier-choice-${tierId}`)?.classList.add('active');
    this.playAudioFx('pin_click');
  },

  goToInstallStep(stepNum) {
    this.lockInstallState.step = stepNum;
    document.querySelectorAll('.lock-install-step-pane').forEach(p => p.classList.add('hidden'));
    document.getElementById(`lock-install-step-${stepNum}`)?.classList.remove('hidden');

    if (stepNum === 2) {
      this.renderPinDropUI();
    }
  },

  insertCylinderCore() {
    this.lockInstallState.cylinderInserted = true;
    this.playAudioFx('pin_click');
    const btn = document.getElementById('btn-insert-core');
    if (btn) {
      btn.textContent = '✅ Cylinder Core Locked in Mortise Pocket';
      btn.disabled = true;
    }
    const next = document.getElementById('btn-lock-step1-next');
    if (next) next.disabled = false;
  },

  dropPinInChamber(idx) {
    this.lockInstallState.pinsLoaded[idx] = true;
    this.playAudioFx('pin_click');
    this.renderPinDropUI();

    const allLoaded = this.lockInstallState.pinsLoaded.every(Boolean);
    const next = document.getElementById('btn-lock-step2-next');
    if (next) next.disabled = !allLoaded;
  },

  renderPinDropUI() {
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById(`install-pin-chamber-${i}`);
      if (el) {
        if (this.lockInstallState.pinsLoaded[i]) {
          el.textContent = `Chamber ${i + 1}: Loaded ✓`;
          el.classList.add('loaded');
          el.style.borderColor = 'var(--accent-emerald)';
          el.style.color = 'var(--accent-emerald)';
        } else {
          el.textContent = `Chamber ${i + 1}: Drop Pin & Spring`;
          el.classList.remove('loaded');
          el.style.borderColor = 'rgba(255,255,255,0.2)';
          el.style.color = '#fff';
        }
      }
    }
  },

  tightenFaceplateScrew() {
    this.lockInstallState.faceplateScrewed = true;
    this.playAudioFx('pin_click');
    const btn = document.getElementById('btn-tighten-faceplate');
    if (btn) {
      btn.textContent = '🔩 Heavy Faceplate Bolts Torqued (100%)';
      btn.disabled = true;
    }
    const finalizeBtn = document.getElementById('btn-finalize-lock-install');
    if (finalizeBtn) finalizeBtn.disabled = false;
  },

  finalizeLockUpgrade() {
    const chosen = this.lockTiers[this.lockInstallState.chosenTier] || this.lockTiers.tier2_medeco;
    this.playAudioFx('unlock_pop');
    alert(`🎉 HIGH-SECURITY LOCK INSTALLED!\n\n• Installed: ${chosen.name} [Tier ${chosen.tier}]\n• Defense Rating: ${chosen.pickDifficulty}\n• Door/Safe: ${this.targetDoorId}\n\nIntruders must now pass this security tier to pick or breach this door!`);
    this.close();
  }
};
