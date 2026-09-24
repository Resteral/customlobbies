// City Underground - Physical Strength & Gym Workout Training Module
window.Workout = {
  activeMode: 'bench', // 'bench', 'punching_bag', 'treadmill'
  repsCompleted: 0,
  targetReps: 8,
  barbellHeight: 20, // 0 to 100%
  barbellTilt: 0, // -45 to 45 deg
  sweetSpot: { min: 40, max: 60 },
  audioCtx: null,

  open(mode = 'bench') {
    this.activeMode = mode;
    this.repsCompleted = 0;
    this.barbellHeight = 20;
    this.barbellTilt = 0;

    document.getElementById('modal-workout')?.classList.remove('hidden');
    this.initMode(mode);
    if (mode === 'bench') {
      this.renderBenchCanvas();
    }
  },

  close() {
    document.getElementById('modal-workout')?.classList.add('hidden');
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
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

      if (type === 'rep_up') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'punch') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'success') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    } catch (e) {
      console.warn("Workout audio unavailable", e);
    }
  },

  initMode(mode) {
    document.querySelectorAll('.workout-mode-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(`workout-panel-${mode}`)?.classList.remove('hidden');

    const titleEl = document.getElementById('workout-title');
    if (titleEl) {
      const titles = {
        bench: '🏋️ 225-LB OLYMPIC BENCH PRESS',
        punching_bag: '🥊 HEAVY BOXING BAG PUNCH COMBOS',
        treadmill: '🏃 HIGH-INCLINE CARDIO TREADMILL'
      };
      titleEl.textContent = titles[mode] || '🏋️ PHYSICAL FITNESS WORKOUT';
    }

    if (mode === 'bench') {
      this.startBenchPressLoop();
    }
  },

  // ================= BENCH PRESS MINIGAME =================
  pushBarbell() {
    this.barbellHeight = Math.min(100, this.barbellHeight + 14);
    this.playAudioFx('rep_up');

    // Add random tilt imbalance
    this.barbellTilt += (Math.random() - 0.5) * 12;

    if (this.barbellHeight >= 95) {
      // Rep complete
      this.repsCompleted++;
      this.barbellHeight = 20;
      this.playAudioFx('success');

      if (this.repsCompleted >= this.targetReps) {
        this.grantStrengthXP(120);
        alert(`🏆 WORKOUT SET COMPLETE!\n\nCompleted ${this.targetReps} reps of 225-lb Bench Press!\n\n• Gained: +120 Physical Strength XP 💪\n• Increased Max Carry Weight!`);
        this.close();
        return;
      }
    }
  },

  balanceBarbell(dir) {
    if (dir === 'left') {
      this.barbellTilt = Math.max(-45, this.barbellTilt - 8);
    } else {
      this.barbellTilt = Math.min(45, this.barbellTilt + 8);
    }
  },

  startBenchPressLoop() {
    const loop = () => {
      // Gravity decay
      this.barbellHeight = Math.max(10, this.barbellHeight - 0.6);
      this.barbellTilt *= 0.98;

      this.renderBenchCanvas();
      this.gameLoop = requestAnimationFrame(loop);
    };
    this.gameLoop = requestAnimationFrame(loop);
  },

  renderBenchCanvas() {
    const canvas = document.getElementById('workout-bench-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background Gym Aesthetic
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Green Sweet Spot Target Bar
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.fillRect(40, 30, w - 80, 50);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 30, w - 80, 50);

    ctx.fillStyle = '#10b981';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOCKOUT ZONE (TOP REPETITION)', w / 2, 60);

    // Bench Press Uprights
    ctx.fillStyle = '#334155';
    ctx.fillRect(70, 80, 16, h - 90);
    ctx.fillRect(w - 86, 80, 16, h - 90);

    // Barbell Weight Bar
    const barY = (h - 60) - (this.barbellHeight / 100) * (h - 100);

    ctx.save();
    ctx.translate(w / 2, barY);
    ctx.rotate((this.barbellTilt * Math.PI) / 180);

    // Steel Shaft
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-170, -6, 340, 12);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(-170, -6, 340, 12);

    // Left Olympic 45-lb Iron Plates
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-190, -32, 22, 64);
    ctx.fillRect(-210, -32, 18, 64);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(-190, -32, 22, 64);
    ctx.strokeRect(-210, -32, 18, 64);

    // Right Olympic 45-lb Iron Plates
    ctx.fillRect(168, -32, 22, 64);
    ctx.fillRect(192, -32, 18, 64);
    ctx.strokeRect(168, -32, 22, 64);
    ctx.strokeRect(192, -32, 18, 64);

    // Grip Knurling
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-60, -7, 24, 14);
    ctx.fillRect(36, -7, 24, 14);

    ctx.restore();

    // Rep Counter HUD
    ctx.fillStyle = '#fff';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`REPS: ${this.repsCompleted} / ${this.targetReps}`, 20, 30);
  },

  // ================= BOXING PUNCH COMBO =================
  throwPunch(comboType) {
    this.playAudioFx('punch');
    this.repsCompleted++;
    const comboEl = document.getElementById('punch-combo-counter');
    if (comboEl) comboEl.textContent = `${this.repsCompleted} / 12 Hits`;

    if (this.repsCompleted >= 12) {
      this.grantStrengthXP(90);
      alert("🥊 BOXING COMBO COMPLETE!\n\nDelivered 12 heavy leather punching bag strikes!\n\n• Gained: +90 Strength XP 💪");
      this.close();
    }
  },

  // ================= TREADMILL SPRINT =================
  treadmillSprint() {
    this.playAudioFx('rep_up');
    this.repsCompleted++;
    const distEl = document.getElementById('treadmill-distance-counter');
    if (distEl) distEl.textContent = `${(this.repsCompleted * 0.1).toFixed(1)} km / 1.0 km`;

    const progBar = document.getElementById('treadmill-progress-fill');
    if (progBar) progBar.style.width = `${Math.min(100, this.repsCompleted * 10)}%`;

    if (this.repsCompleted >= 10) {
      this.grantStrengthXP(100);
      alert("🏃 CARDIO SPRINT COMPLETE!\n\nCompleted 1.0 km high-incline sprint!\n\n• Gained: +100 Strength & Athletics XP 💪\n• Increased Sprint Stamina & Carry Capacity!");
      this.close();
    }
  },

  // ================= REWARD ENGINE =================
  grantStrengthXP(amount) {
    if (window.SkillsUI) {
      window.SkillsUI.skills.strength = (window.SkillsUI.skills.strength || 0) + amount;
      window.SkillsUI.render();
    }

    // Dynamic Carry Weight Calculation based on Strength level
    if (window.Inventory) {
      const strXP = window.SkillsUI ? window.SkillsUI.skills.strength : 500;
      let strLvl = 1;
      if (strXP >= 5000) strLvl = 5;
      else if (strXP >= 2500) strLvl = 4;
      else if (strXP >= 1000) strLvl = 3;
      else if (strXP >= 350) strLvl = 2;

      window.Inventory.maxWeight = 30.0 + (strLvl * 5.0); // 35kg to 55kg!
      window.Inventory.renderSlots();
    }
  }
};

// Keyboard listener for interactive workout controls
window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('modal-workout');
  if (!modal || modal.classList.contains('hidden')) return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (window.Workout.activeMode === 'bench') {
      window.Workout.pushBarbell();
    } else if (window.Workout.activeMode === 'treadmill') {
      window.Workout.treadmillSprint();
    }
  } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
    if (window.Workout.activeMode === 'bench') {
      window.Workout.balanceBarbell('left');
    }
  } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
    if (window.Workout.activeMode === 'bench') {
      window.Workout.balanceBarbell('right');
    }
  } else if (e.code === 'Escape') {
    window.Workout.close();
  }
});
