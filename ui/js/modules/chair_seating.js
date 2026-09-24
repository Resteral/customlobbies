// City Underground - Realistic Chair Pull-Out, Tabletop Seating & Dining Engine
window.ChairSystem = {
  isSeated: false,
  seatedChairId: null,
  seatedChairObj: null,
  slideState: 'idle', // 'idle', 'pulling_out', 'stepping_in', 'sitting_down', 'tucking_in', 'seated', 'pushing_back', 'standing_up', 'tucking_under'
  slideOffset: 0, // In pixels / world units
  maxSlideDist: 32, // Max clearance distance when pulled out from under table
  slideSpeed: 2.4,
  regenInterval: null,
  audioCtx: null,

  toggleSit(chairId, chairObj) {
    if (this.isSeated) {
      this.standUp();
    } else {
      this.pullOutAndSit(chairId, chairObj);
    }
  },

  // 1. Pull chair out from under table and sit down
  pullOutAndSit(chairId, chairObj) {
    if (this.isSeated || this.slideState !== 'idle') return;

    this.seatedChairId = chairId;
    this.seatedChairObj = chairObj;
    this.slideState = 'pulling_out';
    this.slideOffset = 0;

    // Play dragging friction sound of pulling chair out
    this.playAudioFx('pull_out_scrape');

    const animatePullOut = () => {
      if (this.slideState !== 'pulling_out') return;

      this.slideOffset += this.slideSpeed;
      if (window.BaseBuilder) window.BaseBuilder.renderGrid();
      if (window.CitySimulator) window.CitySimulator.render();

      if (this.slideOffset >= this.maxSlideDist) {
        this.slideOffset = this.maxSlideDist;
        this.slideState = 'sitting_down';
        this.isSeated = true;
        this.playAudioFx('sit_cushion');

        // After sitting down, pull chair and body forward into the table
        setTimeout(() => {
          this.tuckIntoTable();
        }, 150);
      } else {
        requestAnimationFrame(animatePullOut);
      }
    };
    requestAnimationFrame(animatePullOut);
  },

  // 2. Slide chair and character forward snugly against table edge
  tuckIntoTable() {
    this.slideState = 'tucking_in';
    this.playAudioFx('tuck_in_slide');

    const animateTuckIn = () => {
      if (this.slideState !== 'tucking_in') return;

      this.slideOffset = Math.max(10, this.slideOffset - (this.slideSpeed * 0.8));
      if (window.BaseBuilder) window.BaseBuilder.renderGrid();
      if (window.CitySimulator) window.CitySimulator.render();

      if (this.slideOffset <= 10) {
        this.slideOffset = 10;
        this.slideState = 'seated';
        this.onSeatedAtTable();
      } else {
        requestAnimationFrame(animateTuckIn);
      }
    };
    requestAnimationFrame(animateTuckIn);
  },

  onSeatedAtTable() {
    // Show Tabletop Seated HUD
    const hud = document.getElementById('tabletop-seated-hud');
    if (hud) hud.classList.remove('hidden');

    // Passive Resting Regen Ticker (+100% bonus health & stamina recovery)
    if (this.regenInterval) clearInterval(this.regenInterval);
    this.regenInterval = setInterval(() => {
      if (!this.isSeated) {
        clearInterval(this.regenInterval);
        return;
      }
      const char = window.CityUndergroundCore?.activeState.character;
      if (char) {
        char.health = Math.min(100, (char.health || 100) + 5);
        window.HUD?.updateStats(char);
      }
    }, 1200);

    alert("🪑 *SCREEECH-SLIDE* You pulled the chair out from under the table and sat down!\n\n• Pulled snugly into table edge\n• Resting Health & Stamina Recovery Active (+100%)\n• You can dine on cooked meals or study blueprints\n• Press [SPACE] or [E] to push back and stand up.");
  },

  // 3. Push back from table, stand up, and slide chair under table
  standUp() {
    if (!this.isSeated && this.slideState !== 'seated') return;

    this.slideState = 'pushing_back';
    this.playAudioFx('pull_out_scrape');

    const animatePushBack = () => {
      if (this.slideState !== 'pushing_back') return;

      this.slideOffset += this.slideSpeed;
      if (window.BaseBuilder) window.BaseBuilder.renderGrid();
      if (window.CitySimulator) window.CitySimulator.render();

      if (this.slideOffset >= this.maxSlideDist) {
        this.slideOffset = this.maxSlideDist;
        this.isSeated = false;
        this.slideState = 'standing_up';
        this.playAudioFx('stand_rustle');

        // Hide seated HUD
        const hud = document.getElementById('tabletop-seated-hud');
        if (hud) hud.classList.add('hidden');

        // Clear regen
        if (this.regenInterval) {
          clearInterval(this.regenInterval);
          this.regenInterval = null;
        }

        // Push empty chair smoothly back under the table
        setTimeout(() => {
          this.tuckChairUnderTable();
        }, 120);
      } else {
        requestAnimationFrame(animatePushBack);
      }
    };
    requestAnimationFrame(animatePushBack);
  },

  // 4. Slide empty chair completely under the table rim
  tuckChairUnderTable() {
    this.slideState = 'tucking_under';
    this.playAudioFx('tuck_in_slide');

    const animateTuckUnder = () => {
      if (this.slideState !== 'tucking_under') return;

      this.slideOffset = Math.max(0, this.slideOffset - (this.slideSpeed * 1.1));
      if (window.BaseBuilder) window.BaseBuilder.renderGrid();
      if (window.CitySimulator) window.CitySimulator.render();

      if (this.slideOffset <= 0) {
        this.slideOffset = 0;
        this.slideState = 'idle';
        this.seatedChairId = null;
        this.seatedChairObj = null;
        if (window.BaseBuilder) window.BaseBuilder.renderGrid();
      } else {
        requestAnimationFrame(animateTuckUnder);
      }
    };
    requestAnimationFrame(animateTuckUnder);
  },

  // Tabletop interactive action: Dine on meal
  dineAtTable() {
    if (!this.isSeated) return;
    this.playAudioFx('dine');
    const char = window.CityUndergroundCore?.activeState.character;
    if (char) {
      char.hunger = Math.min(100, (char.hunger || 50) + 40);
      char.thirst = Math.min(100, (char.thirst || 50) + 30);
      char.health = Math.min(100, (char.health || 100) + 20);
      window.HUD?.updateStats(char);
    }
    alert("🍽️ *Clink-Clatter* Dined comfortably at the table!\n\n• Hunger: +40%\n• Thirst: +30%\n• Health: +20 HP");
  },

  // Tabletop interactive action: Sip coffee
  sipCoffeeAtTable() {
    if (!this.isSeated) return;
    this.playAudioFx('sip');
    const char = window.CityUndergroundCore?.activeState.character;
    if (char) {
      char.thirst = Math.min(100, (char.thirst || 50) + 40);
      window.HUD?.updateStats(char);
    }
    alert("☕ *Sip-Gulp* Sipped freshly brewed roast coffee at the table!\n\n• Full Sprint Stamina Buff Active!");
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

      if (type === 'pull_out_scrape' || type === 'tuck_in_slide') {
        // Wooden/metal leg friction scrape on hardwood/tile floor
        const bufferSize = this.audioCtx.sampleRate * 0.38;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(type === 'pull_out_scrape' ? 620 : 880, now);
        filter.Q.setValueAtTime(3.5, now);
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start(now);
      } else if (type === 'sit_cushion') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'stand_rustle') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.14);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'dine') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'sip') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      }
    } catch (e) {
      console.warn("Seating audio unavailable", e);
    }
  }
};

// Key listener for standing up
window.addEventListener('keydown', (e) => {
  if (!window.ChairSystem?.isSeated) return;
  if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Escape') {
    e.preventDefault();
    window.ChairSystem.standUp();
  }
});
