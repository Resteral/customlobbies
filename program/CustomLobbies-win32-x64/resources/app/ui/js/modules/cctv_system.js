// City Underground - Manual CCTV Security Camera Installation & Surveillance Hub Module
window.CCTVSystem = {
  activePropertyId: 'apt_101',
  activeCameraIndex: 0,
  isNightVision: false,
  isRecording: true,
  motionDetected: false,
  ptzAngle: { pan: 0, tilt: 0, zoom: 1.0 },
  audioCtx: null,

  // Camera Registry per MLO Property
  cameras: {
    apt_101: [
      { id: 'cam_apt_1', label: 'CAM 01 - FRONT PORCH & ENTRANCE', loc: 'Front Door', status: 'ONLINE', angle: 0, tilt: 15, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 2, y: 0 },
      { id: 'cam_apt_2', label: 'CAM 02 - LIVING ROOM & CORRIDOR', loc: 'Living Hall', status: 'ONLINE', angle: 45, tilt: 10, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 5, y: 3 },
      { id: 'cam_apt_3', label: 'CAM 03 - SAFE VAULT & STASH ROOM', loc: 'Vault Stash', status: 'ONLINE', angle: -30, tilt: 20, zoom: 1.2, hasNightVision: true, motionAlert: false, x: 3, y: 6 },
      { id: 'cam_apt_4', label: 'CAM 04 - CHEMICAL SYNTHESIS LAB', loc: 'Lab Station', status: 'ONLINE', angle: 90, tilt: 15, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 2, y: 8 }
    ],
    mlo_industrial_warehouse: [
      { id: 'cam_wh_1', label: 'CAM 01 - MAIN DRIVEWAY & ROLLING GATE', loc: 'Driveway Gate', status: 'ONLINE', angle: 0, tilt: 20, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 6, y: 0 },
      { id: 'cam_wh_2', label: 'CAM 02 - WAREHOUSE FLOOR & KILLZONE', loc: 'Open Floor', status: 'ONLINE', angle: 30, tilt: 25, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 8, y: 6 },
      { id: 'cam_wh_3', label: 'CAM 03 - HIGH-TIER WEAPON ARMORY', loc: 'Armory Vault', status: 'ONLINE', angle: -45, tilt: 15, zoom: 1.4, hasNightVision: true, motionAlert: false, x: 2, y: 4 }
    ],
    mlo_suburban_ranch: [
      { id: 'cam_sub_1', label: 'CAM 01 - FRONT LAWN & GNOME CLAYMORE ZONE', loc: 'Front Lawn', status: 'ONLINE', angle: 0, tilt: 10, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 6, y: 0 },
      { id: 'cam_sub_2', label: 'CAM 02 - PERIMETER ELECTRIC FENCE GATE', loc: 'Side Gate', status: 'ONLINE', angle: -60, tilt: 15, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 0, y: 4 },
      { id: 'cam_sub_3', label: 'CAM 03 - BACK PATIO & PEPPER SPRINKLERS', loc: 'Back Patio', status: 'ONLINE', angle: 120, tilt: 15, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 10, y: 8 }
    ],
    mlo_downtown_storefront: [
      { id: 'cam_str_1', label: 'CAM 01 - MAIN CASH REGISTER & DISPLAY', loc: 'Counter Area', status: 'ONLINE', angle: 0, tilt: 15, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 2, y: 2 },
      { id: 'cam_str_2', label: 'CAM 02 - BACK ALLEYWAY LOADING BAY', loc: 'Back Alley', status: 'ONLINE', angle: -90, tilt: 25, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 8, y: 1 }
    ],
    mlo_dockside_garage: [
      { id: 'cam_gar_1', label: 'CAM 01 - HYDRAULIC VEHICLE LIFT & BENCH', loc: 'Workshop Bay', status: 'ONLINE', angle: 15, tilt: 20, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 4, y: 4 },
      { id: 'cam_gar_2', label: 'CAM 02 - DOCKSIDE HARBOR ALLEY', loc: 'Dock Entrance', status: 'ONLINE', angle: -45, tilt: 15, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 6, y: 0 }
    ],
    mlo_underground_bunker: [
      { id: 'cam_bnk_1', label: 'CAM 01 - BLAST HATCH ENTRY CORRIDOR', loc: 'Blast Corridor', status: 'ONLINE', angle: 0, tilt: 25, zoom: 1.0, hasNightVision: true, motionAlert: false, x: 6, y: 1 },
      { id: 'cam_bnk_2', label: 'CAM 02 - DEEP CONTRA-BAND STASH VAULT', loc: 'Underground Vault', status: 'ONLINE', angle: 45, tilt: 15, zoom: 1.2, hasNightVision: true, motionAlert: false, x: 3, y: 6 }
    ]
  },

  // Manual Installation State
  installState: {
    step: 1, // 1: Bracket Mount, 2: Drill Screws, 3: Wire Power/BNC, 4: Lens & IR Calibration
    screwsTightened: [false, false, false, false],
    wiresConnected: { power: false, ground: false, videoBnc: false, networkRj45: false },
    bracketAligned: false,
    selectedPropertyId: 'apt_101',
    camLabel: 'CAM 05 - NEW PERIMETER DEFENSE',
    gridX: 4,
    gridY: 2,
    angle: 0,
    nightVisionEnabled: true,
    targetObjId: null
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

      if (type === 'drill') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.linearRampToValueAtTime(520, now + 0.15);
        osc.frequency.linearRampToValueAtTime(420, now + 0.35);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'wire_click' || type === 'click') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'nv_beep') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.setValueAtTime(1800, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'alarm_trip') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.setValueAtTime(650, now + 0.12);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      }
    } catch (e) {
      console.warn("CCTV audio synthesis unavailable", e);
    }
  },

  // Open Live CCTV Surveillance Terminal
  openTerminal(propertyId = 'apt_101') {
    this.activePropertyId = propertyId;
    this.activeCameraIndex = 0;
    this.ptzAngle = { pan: 0, tilt: 0, zoom: 1.0 };
    document.getElementById('modal-cctv-terminal')?.classList.remove('hidden');
    this.renderCameraList();
    this.startFeedLoop();
    this.playAudioFx('click');
  },

  closeTerminal() {
    document.getElementById('modal-cctv-terminal')?.classList.add('hidden');
    if (this.feedInterval) {
      clearInterval(this.feedInterval);
      this.feedInterval = null;
    }
  },

  // Switch Active Camera Feed
  selectCamera(index) {
    const list = this.cameras[this.activePropertyId] || [];
    if (index >= 0 && index < list.length) {
      this.activeCameraIndex = index;
      this.ptzAngle = { pan: 0, tilt: 0, zoom: 1.0 };
      this.playAudioFx('click');
      this.renderCameraList();
      this.renderFeed();
    }
  },

  nextCamera() {
    const list = this.cameras[this.activePropertyId] || [];
    if (list.length > 0) {
      this.selectCamera((this.activeCameraIndex + 1) % list.length);
    }
  },

  prevCamera() {
    const list = this.cameras[this.activePropertyId] || [];
    if (list.length > 0) {
      this.selectCamera((this.activeCameraIndex - 1 + list.length) % list.length);
    }
  },

  toggleNightVision() {
    this.isNightVision = !this.isNightVision;
    this.playAudioFx('nv_beep');
    const btn = document.getElementById('cctv-btn-nv');
    if (btn) {
      btn.textContent = this.isNightVision ? '🟢 NV: ON (IR Phosphor)' : '🌙 NV: OFF';
      btn.style.color = this.isNightVision ? '#10b981' : 'var(--text-muted)';
    }
    this.renderFeed();
  },

  // Pan / Tilt / Zoom Controls
  panCamera(delta) {
    this.ptzAngle.pan = Math.max(-45, Math.min(45, this.ptzAngle.pan + delta));
    this.playAudioFx('click');
    this.renderFeed();
  },

  tiltCamera(delta) {
    this.ptzAngle.tilt = Math.max(-30, Math.min(30, this.ptzAngle.tilt + delta));
    this.playAudioFx('click');
    this.renderFeed();
  },

  zoomCamera(delta) {
    this.ptzAngle.zoom = Math.max(1.0, Math.min(3.5, Number((this.ptzAngle.zoom + delta).toFixed(1))));
    this.playAudioFx('click');
    this.renderFeed();
  },

  resetPTZ() {
    this.ptzAngle = { pan: 0, tilt: 0, zoom: 1.0 };
    this.playAudioFx('click');
    this.renderFeed();
  },

  triggerMotionTest() {
    this.motionDetected = true;
    this.playAudioFx('alarm_trip');
    const alertEl = document.getElementById('cctv-motion-banner');
    if (alertEl) {
      alertEl.classList.remove('hidden');
      alertEl.textContent = '🚨 MOTION DETECTED IN CAMERA CONE (TRESPASSER SPOTTED)';
    }
    setTimeout(() => {
      this.motionDetected = false;
      if (alertEl) alertEl.classList.add('hidden');
    }, 4000);
    this.renderFeed();
  },

  speakIntercom() {
    const msg = prompt("Enter announcement to broadcast through CCTV camera loudspeaker:");
    if (msg) {
      this.playAudioFx('alarm_trip');
      alert(`📢 CCTV CAMERA LOUDSPEAKER BLASTS:\n\n"${msg.toUpperCase()}"\n\n[Warning broadcasted across property perimeter!]`);
    }
  },

  startFeedLoop() {
    if (this.feedInterval) clearInterval(this.feedInterval);
    this.feedInterval = setInterval(() => {
      this.renderFeed();
    }, 100);
  },

  renderCameraList() {
    const container = document.getElementById('cctv-camera-tree');
    if (!container) return;
    container.innerHTML = '';

    const list = this.cameras[this.activePropertyId] || [];
    list.forEach((cam, idx) => {
      const item = document.createElement('div');
      item.className = `cctv-cam-item ${idx === this.activeCameraIndex ? 'active' : ''}`;
      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:${idx === this.activeCameraIndex ? 'var(--accent-cyan)' : '#fff'}; font-size:12px;">${cam.label}</strong>
          <span style="font-size:10px; color:${cam.status === 'ONLINE' ? 'var(--accent-emerald)' : 'var(--accent-danger)'}; font-weight:700;">● ${cam.status}</span>
        </div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">📍 Location: ${cam.loc} | PTZ: ${cam.angle}°</div>
      `;
      item.onclick = () => this.selectCamera(idx);
      container.appendChild(item);
    });
  },

  renderFeed() {
    const canvas = document.getElementById('cctv-feed-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const list = this.cameras[this.activePropertyId] || [];
    const cam = list[this.activeCameraIndex];

    ctx.clearRect(0, 0, w, h);

    // Surveillance Room Wireframe / Simulated 3D CCTV View
    ctx.save();
    
    // Background Fill (CRT / Night Vision tinted)
    if (this.isNightVision) {
      ctx.fillStyle = '#062817';
    } else {
      ctx.fillStyle = '#0a101d';
    }
    ctx.fillRect(0, 0, w, h);

    // Camera Perspective Transform
    ctx.translate(w / 2, h / 2);
    ctx.scale(this.ptzAngle.zoom, this.ptzAngle.zoom);
    ctx.rotate((this.ptzAngle.pan * Math.PI) / 180);
    ctx.translate(-w / 2 + this.ptzAngle.pan * 2, -h / 2 + this.ptzAngle.tilt * 2);

    // Room Geometry & Architectural Grid Lines
    const gridColor = this.isNightVision ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.2)';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1.5;

    // Floor Perspective
    for (let x = 40; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, h - 80);
      ctx.lineTo(w / 2 + (x - w / 2) * 1.8, h);
      ctx.stroke();
    }
    for (let y = h - 80; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 30, y);
      ctx.stroke();
    }

    // Walls & Corridor Framing
    ctx.strokeStyle = this.isNightVision ? 'rgba(52, 211, 153, 0.6)' : 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 40, w - 120, h - 140);
    ctx.strokeRect(120, 70, w - 240, h - 190);

    // Connecting Perspective Vectors
    ctx.beginPath();
    ctx.moveTo(60, 40); ctx.lineTo(120, 70);
    ctx.moveTo(w - 60, 40); ctx.lineTo(w - 120, 70);
    ctx.moveTo(60, h - 100); ctx.lineTo(120, h - 120);
    ctx.moveTo(w - 60, h - 100); ctx.lineTo(w - 120, h - 120);
    ctx.stroke();

    // Placed Base Objects in Camera FOV
    if (window.BaseBuilder && window.BaseBuilder.placedObjects) {
      window.BaseBuilder.placedObjects.slice(0, 8).forEach((obj, idx) => {
        const def = window.BaseBuilder.catalog[obj.catalogId];
        if (!def) return;
        const ox = 140 + (idx % 4) * 75;
        const oy = 160 + Math.floor(idx / 4) * 60;
        
        ctx.fillStyle = this.isNightVision ? '#10b981' : (def.color || '#38bdf8');
        ctx.fillRect(ox, oy, 32, 28);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(ox, oy, 32, 28);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(def.icon || '📦', ox + 16, oy + 19);
      });
    }

    // Motion Detection Laser Tripwire Overlay
    if (this.motionDetected) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(60, 180);
      ctx.lineTo(w - 60, 180);
      ctx.stroke();
      ctx.setLineDash([]);

      // Raider Bounding Box & Tracker
      const rx = w / 2 - 25;
      const ry = h / 2 - 30;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, 50, 70);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(rx, ry, 50, 70);

      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TARGET: INTRUDER [LOCKED]', rx + 25, ry - 6);
    }

    ctx.restore();

    // ================= CRT SCANLINES & SURVEILLANCE HUD OVERLAY =================
    // Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Vignette / Lens Distortion Corners
    const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.7);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Crosshair Targeting Grid
    ctx.strokeStyle = this.isNightVision ? 'rgba(52, 211, 153, 0.5)' : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 20, h / 2); ctx.lineTo(w / 2 + 20, h / 2);
    ctx.moveTo(w / 2, h / 2 - 20); ctx.lineTo(w / 2 + 20, h / 2);
    ctx.stroke();

    // Surveillance OSD Text
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(Math.floor(now.getMilliseconds() / 100));
    const dateStr = now.toISOString().split('T')[0];

    ctx.fillStyle = this.isNightVision ? '#34d399' : '#00f2fe';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`● REC [${cam ? cam.label : 'CAM 01'}]`, 16, 24);
    ctx.fillText(`${dateStr} ${timeStr}`, 16, 42);

    ctx.textAlign = 'right';
    ctx.fillText(`FPS: 60.0 | ISO: ${this.isNightVision ? '12800' : '800'}`, w - 16, 24);
    ctx.fillText(`PTZ: [PAN: ${this.ptzAngle.pan}° | TILT: ${this.ptzAngle.tilt}° | ZOOM: ${this.ptzAngle.zoom}x]`, w - 16, 42);

    if (this.isNightVision) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('[IR NIGHT-VISION ACTIVE]', w - 16, 60);
    }
  },

  // ================= 4-STEP MANUAL CAMERA INSTALLATION WIZARD =================
  openInstaller(propertyId = 'apt_101', gridX = 4, gridY = 2) {
    this.installState = {
      step: 1,
      screwsTightened: [false, false, false, false],
      wiresConnected: { power: false, ground: false, videoBnc: false, networkRj45: false },
      bracketAligned: true,
      selectedPropertyId: propertyId,
      camLabel: `CAM 0${(this.cameras[propertyId]?.length || 0) + 1} - PERIMETER CAMERA`,
      gridX: gridX,
      gridY: gridY,
      angle: 0,
      nightVisionEnabled: true,
      targetObjId: null
    };

    document.getElementById('modal-camera-installer')?.classList.remove('hidden');
    this.goToStep(1);
    this.playAudioFx('click');
  },

  closeInstaller() {
    document.getElementById('modal-camera-installer')?.classList.add('hidden');
  },

  goToStep(stepNum) {
    this.installState.step = stepNum;
    document.querySelectorAll('.cam-install-step').forEach(s => s.classList.add('hidden'));
    document.getElementById(`cam-step-${stepNum}`)?.classList.remove('hidden');

    document.querySelectorAll('.cam-step-pill').forEach((p, idx) => {
      p.classList.toggle('active', idx + 1 === stepNum);
      p.classList.toggle('completed', idx + 1 < stepNum);
    });

    if (stepNum === 2) {
      this.refreshDrillScrewsUI();
    } else if (stepNum === 3) {
      this.refreshWiringUI();
    } else if (stepNum === 4) {
      this.renderCalibrationPreview();
    }
  },

  // Step 1: Mounting Bracket Alignment
  alignBracket(orientation) {
    this.installState.angle = orientation;
    this.playAudioFx('click');
    document.querySelectorAll('.btn-bracket-align').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-align-${orientation}`)?.classList.add('active');
  },

  // Step 2: Power Drill Screws
  tightenScrew(idx) {
    this.installState.screwsTightened[idx] = true;
    this.playAudioFx('drill');
    this.refreshDrillScrewsUI();

    const allDone = this.installState.screwsTightened.every(Boolean);
    const nextBtn = document.getElementById('btn-cam-step2-next');
    if (nextBtn) nextBtn.disabled = !allDone;
  },

  refreshDrillScrewsUI() {
    for (let i = 0; i < 4; i++) {
      const screwEl = document.getElementById(`cam-screw-${i}`);
      if (screwEl) {
        if (this.installState.screwsTightened[i]) {
          screwEl.classList.add('tightened');
          screwEl.textContent = '🔩 Tightened (100%)';
          screwEl.style.borderColor = 'var(--accent-emerald)';
          screwEl.style.color = 'var(--accent-emerald)';
        } else {
          screwEl.classList.remove('tightened');
          screwEl.textContent = `🔩 Bolt ${i + 1}: Click to Drill`;
          screwEl.style.borderColor = 'rgba(255,255,255,0.2)';
          screwEl.style.color = '#fff';
        }
      }
    }
  },

  // Step 3: Wire Stripping & Cabling
  connectWire(wireType) {
    this.installState.wiresConnected[wireType] = !this.installState.wiresConnected[wireType];
    this.playAudioFx('wire_click');
    this.refreshWiringUI();

    const allWires = Object.values(this.installState.wiresConnected).every(Boolean);
    const nextBtn = document.getElementById('btn-cam-step3-next');
    if (nextBtn) nextBtn.disabled = !allWires;
  },

  refreshWiringUI() {
    const keys = ['power', 'ground', 'videoBnc', 'networkRj45'];
    keys.forEach(k => {
      const btn = document.getElementById(`cam-wire-${k}`);
      if (btn) {
        const isConn = this.installState.wiresConnected[k];
        btn.classList.toggle('connected', isConn);
        btn.style.background = isConn ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.6)';
        btn.style.borderColor = isConn ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.15)';
      }
    });
  },

  // Step 4: Calibration Preview & Finalize
  renderCalibrationPreview() {
    const preview = document.getElementById('cam-install-preview-canvas');
    if (!preview) return;
    const ctx = preview.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, preview.width, preview.height);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, preview.width - 20, preview.height - 20);

    ctx.fillStyle = '#fff';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📹 CAMERA SENSOR TEST: 1080P 60FPS ONLINE', preview.width / 2, preview.height / 2 - 10);
    ctx.fillStyle = 'var(--accent-emerald)';
    ctx.fillText('SIGNAL SYNC: 100% | BNC IMPEDANCE: 75Ω OK', preview.width / 2, preview.height / 2 + 14);
  },

  finalizeInstallation() {
    const labelInput = document.getElementById('cam-label-input');
    const label = labelInput ? labelInput.value.trim() : this.installState.camLabel;

    const newCam = {
      id: 'cam_' + Date.now(),
      label: label || 'NEW SECURITY CAMERA',
      loc: `Grid [${this.installState.gridX}, ${this.installState.gridY}]`,
      status: 'ONLINE',
      angle: this.installState.angle,
      tilt: 15,
      zoom: 1.0,
      hasNightVision: true,
      motionAlert: false,
      x: this.installState.gridX,
      y: this.installState.gridY
    };

    if (!this.cameras[this.installState.selectedPropertyId]) {
      this.cameras[this.installState.selectedPropertyId] = [];
    }
    this.cameras[this.installState.selectedPropertyId].push(newCam);

    this.playAudioFx('nv_beep');
    alert(`🎉 SECURITY CAMERA INSTALLED SUCCESSFULLY!\n\n• Device: ${newCam.label}\n• Location: ${newCam.loc}\n• Night Vision: ENABLED\n• Motion Sensor: ACTIVE\n\nYou can now view and control this camera from any CCTV Security Terminal!`);
    this.closeInstaller();

    if (window.BaseBuilder) {
      window.BaseBuilder.renderGrid();
    }
  }
};
