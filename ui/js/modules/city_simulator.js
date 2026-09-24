// Real-Time 2D City District Simulation Engine for City Underground
window.CitySimulator = {
  canvas: null,
  ctx: null,
  player: {
    x: 500,
    y: 500,
    vx: 0,
    vy: 0,
    speed: 3.2,
    angle: 0,
    inVehicle: false,
    vehicleType: null,
    vehicleHealth: 100,
    vehicleFuel: 50
  },
  keys: {},
  buildings: [
    { id: 'bank', name: 'First Trust City Bank', type: 'BANK_ATM', x: 380, y: 620, w: 90, h: 80, color: '#1e3a8a', icon: '🏦' },
    { id: 'store', name: 'Corner QuickMart', type: 'STORE_CASHIER', x: 620, y: 620, w: 80, h: 70, color: '#047857', icon: '🛒' },
    { id: 'police', name: '3rd Precinct Police HQ', type: 'POLICE_DUTY', x: 180, y: 820, w: 120, h: 90, color: '#0369a1', icon: '👮' },
    { id: 'hospital', name: 'Mercy General Hospital', type: 'HOSPITAL', x: 820, y: 820, w: 130, h: 100, color: '#be123c', icon: '🏥' },
    { id: 'depot', name: 'Harbor Express Logistics', type: 'DELIVERY_DISPATCH', x: 820, y: 180, w: 120, h: 90, color: '#b45309', icon: '📦' },
    { id: 'dealership', name: 'Metro Auto Dealership', type: 'DEALERSHIP_SALES', x: 620, y: 380, w: 100, h: 90, color: '#4f46e5', icon: '🚗' },
    { id: 'gas', name: 'Sunoco Gas & Fuel', type: 'GAS_PUMP', x: 380, y: 380, w: 80, h: 70, color: '#c2410c', icon: '⛽' },
    { id: 'apartments', name: 'Harborview Apartments', type: 'APARTMENT_DOOR', x: 180, y: 380, w: 110, h: 110, color: '#475569', icon: '🏢' },
    { id: 'warehouse', name: 'Pier 9 Chemical Synth Lab', type: 'SYNTH_LAB', x: 180, y: 180, w: 110, h: 90, color: '#581c87', icon: '⚗️' },
    { id: 'dealer', name: 'Shady Alley Contact', type: 'STREET_BUYER', x: 260, y: 260, w: 40, h: 40, color: '#831843', icon: '🕶️' },
    { id: 'casino_spot', name: 'Velvet Lounge Casino Dealer', type: 'CASINO_DEALER', x: 500, y: 680, w: 70, h: 60, color: '#d97706', icon: '🎲' },
    { id: 'pier_fisherman', name: 'Pier Master Fisherman', type: 'FISHERMAN', x: 850, y: 250, w: 60, h: 50, color: '#0284c7', icon: '🎣' }
  ],
  ambientVehicles: [
    { x: 500, y: 250, vx: 2.0, vy: 0, color: '#38bdf8', label: 'Sedan' },
    { x: 700, y: 750, vx: -1.8, vy: 0, color: '#f59e0b', label: 'Taxi' }
  ],

  init() {
    this.canvas = document.getElementById('city-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    window.addEventListener('resize', () => this.resize());
    this.resize();

    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' && document.activeElement.tagName !== 'INPUT') {
        this.checkInteract();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    requestAnimationFrame(() => this.loop());
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  },

  update() {
    // Movement
    let dx = 0;
    let dy = 0;
    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
      const speed = this.player.inVehicle ? 6.5 : this.player.speed;
      this.player.x += dx * speed;
      this.player.y += dy * speed;
      this.player.angle = Math.atan2(dy, dx);
    }

    // Keep within world bounds (0-1000)
    this.player.x = Math.max(30, Math.min(970, this.player.x));
    this.player.y = Math.max(30, Math.min(970, this.player.y));

    // Ambient vehicle traffic
    this.ambientVehicles.forEach(veh => {
      veh.x += veh.vx;
      if (veh.x > 950) veh.x = 50;
      if (veh.x < 50) veh.x = 950;
    });

    // Proximity target check
    let nearestTarget = null;
    let minDistance = 85;

    for (const b of this.buildings) {
      const dist = Math.sqrt((this.player.x - b.x) ** 2 + (this.player.y - b.y) ** 2);
      if (dist < minDistance) {
        nearestTarget = b;
        break;
      }
    }

    if (nearestTarget && window.HUD) {
      window.HUD.showPrompt(`${nearestTarget.icon} ${nearestTarget.name} - [E] Interact`, 'E');
    } else if (window.HUD) {
      window.HUD.hidePrompt();
    }
  },

  checkInteract() {
    for (const b of this.buildings) {
      const dist = Math.sqrt((this.player.x - b.x) ** 2 + (this.player.y - b.y) ** 2);
      if (dist < 85) {
        this.triggerInteraction(b);
        break;
      }
    }
  },

  triggerInteraction(b) {
    if (b.type === 'BANK_ATM') {
      window.Banking?.open();
    } else if (b.type === 'STORE_CASHIER') {
      window.Store?.open();
    } else if (b.type === 'POLICE_DUTY') {
      window.CityUndergroundCore?.sendEvent('CU_Police_ToggleDuty');
    } else if (b.type === 'DELIVERY_DISPATCH') {
      window.DeliveryJob?.open();
    } else if (b.type === 'DEALERSHIP_SALES') {
      window.Dealership?.open();
    } else if (b.type === 'APARTMENT_DOOR') {
      window.Property?.open('apt_101');
    } else if (b.type === 'SYNTH_LAB') {
      window.CrimeLab?.openSynth();
    } else if (b.type === 'STREET_BUYER') {
      window.CrimeLab?.openStreetBuyer('npc_buyer_1');
    } else if (b.type === 'CASINO_DEALER') {
      window.Casino?.open();
    } else if (b.type === 'FISHERMAN') {
      window.Fishing?.open();
    } else if (b.type === 'BOTANY_POT') {
      window.BotanyUI?.open();
    } else if (b.type === 'GAS_PUMP') {
      alert("Refueled vehicle at Sunoco Gas Station ($45).");
    }
  },

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Camera offset centered on player
    const cx = width / 2 - this.player.x;
    const cy = height / 2 - this.player.y;

    ctx.save();
    ctx.translate(cx, cy);

    // Map Ground / District Grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1000, 1000);

    // Roads & Crossings
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 470, 1000, 60); // Horizontal Main St
    ctx.fillRect(470, 0, 60, 1000); // Vertical Harborway
    ctx.fillRect(0, 230, 1000, 40); // 2nd Ave
    ctx.fillRect(0, 730, 1000, 40); // 3rd Ave
    ctx.fillRect(230, 0, 40, 1000); // West St
    ctx.fillRect(730, 0, 40, 1000); // East St

    // Road markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.setLineDash([12, 12]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 500); ctx.lineTo(1000, 500);
    ctx.moveTo(500, 0); ctx.lineTo(500, 1000);
    ctx.stroke();
    ctx.setLineDash([]);

    // Buildings & Facilities
    this.buildings.forEach(b => {
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);

      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);

      ctx.fillStyle = '#fff';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.icon, b.x, b.y - 4);
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(b.name, b.x, b.y + 16);
    });

    // Ambient traffic
    this.ambientVehicles.forEach(veh => {
      ctx.fillStyle = veh.color;
      ctx.fillRect(veh.x - 14, veh.y - 8, 28, 16);
    });

    // Player Avatar
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.angle);

    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 16;
    ctx.fillStyle = this.player.inVehicle ? '#38bdf8' : '#00f2fe';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(2, -6);
    ctx.lineTo(2, 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }
};
