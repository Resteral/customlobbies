// Interactive Lockpicking Minigame Module
window.LockpickMinigame = {
  pickAngle: 0,
  sweetSpot: 45,
  cylinderAngle: 0,
  pickHealth: 100,
  isUnlocked: false,
  onSuccessCallback: null,

  open(onSuccess) {
    this.onSuccessCallback = onSuccess;
    this.sweetSpot = Math.floor(Math.random() * 160) - 80;
    this.pickAngle = 0;
    this.cylinderAngle = 0;
    this.pickHealth = 100;
    this.isUnlocked = false;

    document.getElementById('modal-lockpick')?.classList.remove('hidden');
    this.bindEvents();
    this.render();
  },

  close() {
    document.getElementById('modal-lockpick')?.classList.add('hidden');
    this.unbindEvents();
  },

  bindEvents() {
    this.mouseMoveHandler = (e) => {
      const rect = document.getElementById('lock-cylinder-canvas')?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = rad * (180 / Math.PI) + 90;
      if (deg > 180) deg -= 360;
      this.pickAngle = Math.max(-85, Math.min(85, deg));
      this.render();
    };

    this.keyDownHandler = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        this.applyTension();
      }
    };

    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('keydown', this.keyDownHandler);
  },

  unbindEvents() {
    if (this.mouseMoveHandler) window.removeEventListener('mousemove', this.mouseMoveHandler);
    if (this.keyDownHandler) window.removeEventListener('keydown', this.keyDownHandler);
  },

  applyTension() {
    if (this.isUnlocked) return;

    const diff = Math.abs(this.pickAngle - this.sweetSpot);
    if (diff < 12) {
      // Success! Lock turns fully 90 deg
      this.cylinderAngle = 90;
      this.isUnlocked = true;
      this.render();
      setTimeout(() => {
        alert("🔓 Lock successfully picked!");
        if (this.onSuccessCallback) this.onSuccessCallback();
        this.close();
      }, 400);
    } else {
      // Resistance / Jiggle and damage pick
      this.cylinderAngle = Math.max(0, 30 - diff * 0.4);
      this.pickHealth = Math.max(0, this.pickHealth - 15);
      this.render();

      if (this.pickHealth <= 0) {
        alert("💥 Your lockpick snapped!");
        this.close();
      }
    }
  },

  render() {
    const canvas = document.getElementById('lock-cylinder-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Lock Outer Ring
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Rotating Cylinder
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((this.cylinderAngle * Math.PI) / 180);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Keyhole Slot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -30, 12, 60);

    ctx.restore();

    // Draw Lockpick Needle
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((this.pickAngle * Math.PI) / 180);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -75);
    ctx.stroke();

    ctx.restore();

    // Pick Durability HUD
    const durEl = document.getElementById('lockpick-durability-fill');
    if (durEl) {
      durEl.style.width = `${this.pickHealth}%`;
      durEl.style.background = this.pickHealth > 35 ? '#10b981' : '#ef4444';
    }
  }
};
