// City Underground - Grid-Locked Work Bench & Crafting Bench Module
window.CraftingBenchUI = {
  activeMode: 'workbench', // 'workbench' or 'crafting_bench'
  isCrafting: false,
  craftingTimer: null,
  activeRecipeId: null,
  audioCtx: null,

  recipes: {
    // === WORKBENCH: PRECISION ENGINEERING & UPGRADES ===
    workbench: [
      {
        id: 'upgrade_lock_medeco',
        name: 'Medeco High-Security Cylinder',
        icon: '🔐',
        category: 'Lock Upgrades',
        desc: 'Precision mortise cylinder with dual-locking biaxial pins and anti-drill pins.',
        cost: 120,
        reqSkill: { name: 'electronics', level: 2 },
        reward: { itemId: 'lock_medeco', name: 'Medeco High-Security Cylinder', icon: '🔐', xp: 60, skill: 'electronics' },
        time: 3000
      },
      {
        id: 'upgrade_lock_keypad',
        name: 'Digital Solenoid Keypad Lock',
        icon: '🔢',
        category: 'Lock Upgrades',
        desc: 'Electronic keypad actuator with 12V deadbolt solenoid and anti-tamper sensor.',
        cost: 280,
        reqSkill: { name: 'electronics', level: 3 },
        reward: { itemId: 'lock_keypad', name: 'Digital Keypad Lock Kit', icon: '🔢', xp: 100, skill: 'electronics' },
        time: 4000
      },
      {
        id: 'upgrade_lock_biometric',
        name: 'Biometric Thermal Scanner Lock',
        icon: '🧬',
        category: 'Lock Upgrades',
        desc: 'Thermal heat-residue keypad with biometric fingerprint capacitive sensor.',
        cost: 450,
        reqSkill: { name: 'electronics', level: 4 },
        reward: { itemId: 'lock_biometric', name: 'Biometric Lock Assembly', icon: '🧬', xp: 160, skill: 'electronics' },
        time: 5000
      },
      {
        id: 'upgrade_lock_maglock',
        name: 'Industrial 1200-lb Maglock Rig',
        icon: '⚡',
        category: 'Lock Upgrades',
        desc: 'Heavy electromagnet armature plate with auxiliary battery backup.',
        cost: 700,
        reqSkill: { name: 'electronics', level: 5 },
        reward: { itemId: 'lock_maglock', name: 'Heavy Maglock Rig', icon: '⚡', xp: 220, skill: 'electronics' },
        time: 6000
      },
      {
        id: 'calibrate_multimeter',
        name: 'Digital Multimeter Calibration',
        icon: '🔌',
        category: 'Tool Tuning',
        desc: 'Calibrate precision probe sensitivity to detect wire voltages without triggering sirens.',
        cost: 80,
        reqSkill: { name: 'electronics', level: 1 },
        reward: { itemId: 'multimeter_bypass', name: 'Calibrated Multimeter & Jumper Kit', icon: '🔌', xp: 45, skill: 'electronics' },
        time: 2500
      },
      {
        id: 'tune_cordless_drill',
        name: '20V Brushless Drill Motor Tuning',
        icon: '🔩',
        category: 'Tool Tuning',
        desc: 'Overclocks cordless drill torque for 50% faster camera & lockplate installation.',
        cost: 110,
        reqSkill: { name: 'crafting', level: 2 },
        reward: { itemId: 'drill_kit', name: 'High-Torque Cordless Drill', icon: '🔩', xp: 50, skill: 'crafting' },
        time: 3000
      },
      {
        id: 'harden_lockpicks',
        name: 'Titanium-Alloy Lockpick Hardening',
        icon: '🗡️',
        category: 'Tool Tuning',
        desc: 'Heat-treats lockpick steel blades to reduce snap probability on high-tension pins by 50%.',
        cost: 95,
        reqSkill: { name: 'lockpicking', level: 2 },
        reward: { itemId: 'lockpick', name: 'Hardened Titanium Lockpick Set', icon: '🗡️', xp: 70, skill: 'lockpicking' },
        time: 3500
      }
    ],

    // === CRAFTING BENCH: HEAVY FABRICATION & PROP DEFENSES ===
    crafting_bench: [
      {
        id: 'craft_barricade_bookshelf',
        name: 'Oak Stand-Up Bookshelf Barricade',
        icon: '📚',
        category: 'Base Defenses',
        desc: 'Heavy 1,500 HP barricade that can be stood upright to seal doorways.',
        cost: 220,
        reqSkill: { name: 'crafting', level: 2 },
        reward: { itemId: 'barricade_bookshelf', name: 'Oak Stand-Up Bookshelf Barricade', icon: '📚', xp: 90, skill: 'crafting' },
        time: 4000
      },
      {
        id: 'craft_barricade_table',
        name: 'Steel Flip-Table Shield Bunker',
        icon: '🪑',
        category: 'Base Defenses',
        desc: '1,100 HP ballistic cover table with peep-holes for firing positions.',
        cost: 190,
        reqSkill: { name: 'crafting', level: 2 },
        reward: { itemId: 'barricade_table', name: 'Steel Flip-Table Shield', icon: '🪑', xp: 85, skill: 'crafting' },
        time: 3500
      },
      {
        id: 'craft_door_wedge',
        name: 'Titanium Door Jammer Wedge',
        icon: '🛑',
        category: 'Base Defenses',
        desc: '1,200 HP alloy wedge that stops lockpicked doors from opening.',
        cost: 85,
        reqSkill: { name: 'crafting', level: 1 },
        reward: { itemId: 'door_wedge', name: 'Titanium Door Wedge', icon: '🛑', xp: 40, skill: 'crafting' },
        time: 2000
      },
      {
        id: 'craft_handle_stun_rig',
        name: 'Anti-Lockpick Handle Stun Rig',
        icon: '⚡',
        category: 'Base Defenses',
        desc: '10,000V capacitor shock rig that zaps lockpickers and snaps their picks.',
        cost: 280,
        reqSkill: { name: 'electronics', level: 3 },
        reward: { itemId: 'stun_rig', name: 'Anti-Lockpick Stun Rig', icon: '⚡', xp: 120, skill: 'electronics' },
        time: 4500
      },
      {
        id: 'craft_cctv_kit',
        name: 'CCTV Camera Kit (PTZ + Night Vision)',
        icon: '📹',
        category: 'Surveillance & Hardware',
        desc: 'High-res surveillance camera with optical zoom, night-vision, and tripwire sensor.',
        cost: 320,
        reqSkill: { name: 'electronics', level: 2 },
        reward: { itemId: 'security_camera', name: 'CCTV Security Camera Kit', icon: '📹', xp: 130, skill: 'electronics' },
        time: 4000
      },
      {
        id: 'craft_lockpick_set',
        name: 'Professional 5-Piece Lockpick Kit',
        icon: '🗝️',
        category: 'Surveillance & Hardware',
        desc: 'Hardened steel tension wrenches, hook picks, and diamond rakes.',
        cost: 140,
        reqSkill: { name: 'crafting', level: 1 },
        reward: { itemId: 'lockpick', name: '5-Piece Lockpick Kit', icon: '🗝️', xp: 65, skill: 'crafting' },
        time: 2500
      },
      {
        id: 'craft_olympic_plates',
        name: '225-lb Olympic Cast Iron Plates',
        icon: '🏋️',
        category: 'Fitness & Athletics',
        desc: 'Full set of 45-lb Olympic barbell plates. Trains physical strength & carry capacity.',
        cost: 350,
        reqSkill: { name: 'strength', level: 2 },
        reward: { itemId: 'olympic_plates', name: '225-lb Olympic Plates Set', icon: '🏋️', xp: 150, skill: 'strength' },
        time: 4500
      },
      {
        id: 'craft_punching_bag',
        name: 'Heavy Leather Boxing Bag (100-lb)',
        icon: '🥊',
        category: 'Fitness & Athletics',
        desc: 'Triple-stitched buffalo leather punching bag for punch combo workouts.',
        cost: 180,
        reqSkill: { name: 'crafting', level: 2 },
        reward: { itemId: 'punching_bag', name: 'Heavy Leather Boxing Bag', icon: '🥊', xp: 75, skill: 'crafting' },
        time: 3000
      },
      {
        id: 'craft_protein_shake',
        name: 'Whey Isolate Protein Shake',
        icon: '🥤',
        category: 'Fitness & Athletics',
        desc: 'Nutrient-rich shake granting +20% Strength XP buff for 10 minutes.',
        cost: 45,
        reqSkill: { name: 'crafting', level: 1 },
        reward: { itemId: 'protein_shake', name: 'Whey Isolate Protein Shake', icon: '🥤', xp: 35, skill: 'crafting' },
        time: 1500
      }
    ]
  },

  open(mode = 'workbench') {
    this.activeMode = mode;
    this.isCrafting = false;
    this.activeRecipeId = null;

    const modal = document.getElementById('modal-crafting-bench');
    if (modal) modal.classList.remove('hidden');

    this.renderHeader();
    this.renderRecipes();
  },

  close() {
    if (this.craftingTimer) {
      clearInterval(this.craftingTimer);
      this.craftingTimer = null;
    }
    this.isCrafting = false;
    document.getElementById('modal-crafting-bench')?.classList.add('hidden');
  },

  setMode(mode) {
    if (this.isCrafting) return;
    this.activeMode = mode;
    this.renderHeader();
    this.renderRecipes();
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

      if (type === 'hammer') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'solder') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
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
      console.warn("Audio unavailable", e);
    }
  },

  renderHeader() {
    const titleEl = document.getElementById('crafting-bench-title');
    const badgeEl = document.getElementById('crafting-bench-badge');
    const descEl = document.getElementById('crafting-bench-desc');

    if (this.activeMode === 'workbench') {
      if (titleEl) titleEl.textContent = '🔧 PRECISION ENGINEERING WORK BENCH';
      if (badgeEl) badgeEl.textContent = '[1 PER HOUSE]';
      if (descEl) descEl.textContent = 'Upgrade high-security lock cylinders, calibrate multimeters, overclock cordless drill motors, and harden lockpicks.';
    } else {
      if (titleEl) titleEl.textContent = '🔨 HEAVY FABRICATION CRAFTING BENCH';
      if (badgeEl) badgeEl.textContent = '[1 PER HOUSE]';
      if (descEl) descEl.textContent = 'Assemble flippable prop barricades, laser tripwires, stun rigs, CCTV camera kits, and Olympic gym weights.';
    }

    document.querySelectorAll('.craft-bench-mode-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-bench-${this.activeMode}`)?.classList.add('active');
  },

  renderRecipes() {
    const container = document.getElementById('crafting-recipe-grid');
    if (!container) return;
    container.innerHTML = '';

    const list = this.recipes[this.activeMode] || [];

    list.forEach(r => {
      const card = document.createElement('div');
      card.className = 'craft-recipe-card';
      card.style = `
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        transition: all 0.2s ease;
      `;

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">${r.icon}</span>
              <div>
                <div style="font-size: 14px; font-weight: 700; color: #fff;">${r.name}</div>
                <div style="font-size: 10px; color: var(--accent-cyan); font-weight: 600;">${r.category}</div>
              </div>
            </div>
            <div style="font-size: 13px; font-weight: 800; color: var(--accent-emerald);">$${r.cost}</div>
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin: 0;">${r.desc}</p>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
            <span>⏱️ ${r.time / 1000}s</span>
            <span style="color: #f59e0b;">+${r.reward.xp} ${r.reward.skill.toUpperCase()} XP</span>
          </div>
          <button 
            id="btn-craft-${r.id}" 
            class="btn-primary" 
            style="width: 100%; font-weight: 700; font-size: 12px;" 
            onclick="CraftingBenchUI.startCraft('${r.id}')"
            ${this.isCrafting ? 'disabled' : ''}
          >
            ${this.activeMode === 'workbench' ? '🔧 Tune / Upgrade' : '🔨 Fabricate & Assemble'}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  },

  startCraft(recipeId) {
    if (this.isCrafting) return;

    const list = this.recipes[this.activeMode] || [];
    const recipe = list.find(r => r.id === recipeId);
    if (!recipe) return;

    const char = window.CityUndergroundCore?.activeState.character;
    if (char && char.bank < recipe.cost) {
      alert(`⚠️ Insufficient bank balance!\n\nYou need $${recipe.cost.toLocaleString()} to fabricate ${recipe.name}.`);
      return;
    }

    this.isCrafting = true;
    this.activeRecipeId = recipeId;
    this.renderRecipes();

    // Deduct cost
    if (char) {
      char.bank -= recipe.cost;
      window.HUD?.updateStats(char);
    }

    const progressBox = document.getElementById('crafting-progress-container');
    const progressBar = document.getElementById('crafting-progress-bar');
    const progressLabel = document.getElementById('crafting-progress-label');

    if (progressBox) progressBox.classList.remove('hidden');
    if (progressLabel) progressLabel.textContent = `Crafting ${recipe.name}...`;
    if (progressBar) progressBar.style.width = '0%';

    const startTime = Date.now();
    const duration = recipe.time || 3000;

    // Sound loop
    this.playAudioFx(this.activeMode === 'workbench' ? 'solder' : 'hammer');

    this.craftingTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

      if (progressBar) progressBar.style.width = `${pct}%`;

      if (pct % 30 === 0) {
        this.playAudioFx(this.activeMode === 'workbench' ? 'solder' : 'hammer');
      }

      if (elapsed >= duration) {
        clearInterval(this.craftingTimer);
        this.craftingTimer = null;
        this.completeCraft(recipe);
      }
    }, 50);
  },

  completeCraft(recipe) {
    this.isCrafting = false;
    this.activeRecipeId = null;
    this.playAudioFx('success');

    const progressBox = document.getElementById('crafting-progress-container');
    if (progressBox) progressBox.classList.add('hidden');

    // Award Skill XP
    if (window.SkillsUI && recipe.reward.skill) {
      window.SkillsUI.skills[recipe.reward.skill] = (window.SkillsUI.skills[recipe.reward.skill] || 0) + recipe.reward.xp;
      window.SkillsUI.render();
    }

    // Add item to inventory
    if (window.Inventory) {
      window.Inventory.addItem(recipe.reward.itemId, 1);
    }

    this.renderRecipes();

    alert(`🎉 CRAFTING COMPLETE!\n\nFabricated: ${recipe.reward.name} ${recipe.reward.icon}\n\n• Added to 24-slot inventory\n• Gained +${recipe.reward.xp} ${recipe.reward.skill.toUpperCase()} XP!`);
  }
};
