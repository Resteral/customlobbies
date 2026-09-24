// City Underground - Grid-Locked Commercial Cooking Stove & Culinary Module
window.CookingStoveUI = {
  isCooking: false,
  cookingTimer: null,
  activeRecipeId: null,
  audioCtx: null,

  recipes: [
    {
      id: 'cook_ribeye_steak',
      name: 'Prime Pan-Seared Ribeye Steak',
      icon: '🥩',
      category: 'Gourmet Entrees',
      desc: 'Prime marbled ribeye basted with garlic rosemary butter in a smoking cast-iron skillet.',
      cost: 45,
      cookTime: 3500,
      restores: { hunger: 80, thirst: 10, health: 40 },
      buff: '🥩 +15% Sprint Stamina for 15 mins',
      xp: { skill: 'cooking', amount: 65, strengthAmount: 10 }
    },
    {
      id: 'cook_bacon_eggs',
      name: 'Crispy Bacon & Farm Egg Scramble',
      icon: '🍳',
      category: 'Hearty Breakfast',
      desc: 'Thick applewood bacon strips with fluffy cheddar scrambled eggs and buttered toast.',
      cost: 20,
      cookTime: 2000,
      restores: { hunger: 50, thirst: 25, health: 25 },
      buff: '🍳 +10% Health Regen Buff',
      xp: { skill: 'cooking', amount: 35 }
    },
    {
      id: 'cook_bolognese_pasta',
      name: 'Slow-Simmered Meatball Bolognese',
      icon: '🍝',
      category: 'Gourmet Entrees',
      desc: 'Rich San Marzano tomato red wine ragu with braised beef over al dente rigatoni.',
      cost: 35,
      cookTime: 4000,
      restores: { hunger: 75, thirst: 15, health: 35 },
      buff: '🍝 +5kg Carry Capacity Energy Buff',
      xp: { skill: 'cooking', amount: 55 }
    },
    {
      id: 'cook_spicy_ramen',
      name: 'Spicy Tokyo Tonkotsu Ramen',
      icon: '🍲',
      category: 'Soups & Bowls',
      desc: 'Rich pork marrow broth, chili oil, soft-boiled ajitsuke egg, and braised pork belly.',
      cost: 30,
      cookTime: 3000,
      restores: { hunger: 65, thirst: 55, health: 30 },
      buff: '🍲 Cold & Damage Resistance Buff',
      xp: { skill: 'cooking', amount: 45 }
    },
    {
      id: 'cook_espresso_cinnamon',
      name: 'Double Shot Espresso & Cinnamon Roll',
      icon: '☕',
      category: 'Bakery & Cafe',
      desc: 'Freshly pulled Italian espresso roast with a warm vanilla glaze pastry. Restores 100% stamina!',
      cost: 15,
      cookTime: 1800,
      restores: { hunger: 30, thirst: 60, health: 20 },
      buff: '⚡ Instant 100% Stamina Recovery',
      xp: { skill: 'cooking', amount: 25 }
    }
  ],

  open() {
    this.isCooking = false;
    this.activeRecipeId = null;

    const modal = document.getElementById('modal-cooking-stove');
    if (modal) modal.classList.remove('hidden');

    this.renderRecipes();
  },

  close() {
    if (this.cookingTimer) {
      clearInterval(this.cookingTimer);
      this.cookingTimer = null;
    }
    this.isCooking = false;
    document.getElementById('modal-cooking-stove')?.classList.add('hidden');
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

      if (type === 'sizzle') {
        // Procedural sizzling noise
        const bufferSize = this.audioCtx.sampleRate * 0.25;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2500, now);
        filter.Q.setValueAtTime(3.0, now);
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start(now);
      } else if (type === 'bell') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'success') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.5, now + 0.24);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      }
    } catch (e) {
      console.warn("Cooking audio unavailable", e);
    }
  },

  renderRecipes() {
    const container = document.getElementById('cooking-recipe-grid');
    if (!container) return;
    container.innerHTML = '';

    this.recipes.forEach(r => {
      const card = document.createElement('div');
      card.className = 'cook-recipe-card';
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
              <span style="font-size: 26px;">${r.icon}</span>
              <div>
                <div style="font-size: 14px; font-weight: 700; color: #fff;">${r.name}</div>
                <div style="font-size: 10px; color: #f59e0b; font-weight: 600;">${r.category}</div>
              </div>
            </div>
            <div style="font-size: 13px; font-weight: 800; color: var(--accent-emerald);">$${r.cost}</div>
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin: 0 0 6px 0;">${r.desc}</p>
          <div style="font-size: 10px; color: var(--accent-cyan); font-weight: 600;">✨ ${r.buff}</div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
            <span>🍖 +${r.restores.hunger} H | 💧 +${r.restores.thirst} T | ❤️ +${r.restores.health} HP</span>
            <span style="color: #f59e0b;">+${r.xp.amount} Cooking XP</span>
          </div>
          <button 
            id="btn-cook-${r.id}" 
            class="btn-primary btn-success" 
            style="width: 100%; font-weight: 700; font-size: 12px; background: linear-gradient(135deg, #d97706, #b45309);" 
            onclick="CookingStoveUI.startCooking('${r.id}')"
            ${this.isCooking ? 'disabled' : ''}
          >
            🍳 Cook & Sizzle Meal
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  },

  startCooking(recipeId) {
    if (this.isCooking) return;

    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const char = window.CityUndergroundCore?.activeState.character;
    if (char && char.bank < recipe.cost) {
      alert(`⚠️ Insufficient funds!\n\nYou need $${recipe.cost.toLocaleString()} for recipe ingredients.`);
      return;
    }

    this.isCooking = true;
    this.activeRecipeId = recipeId;
    this.renderRecipes();

    // Deduct cost
    if (char) {
      char.bank -= recipe.cost;
      window.HUD?.updateStats(char);
    }

    const progressBox = document.getElementById('cooking-progress-container');
    const progressBar = document.getElementById('cooking-progress-bar');
    const progressLabel = document.getElementById('cooking-progress-label');

    if (progressBox) progressBox.classList.remove('hidden');
    if (progressLabel) progressLabel.textContent = `Sizzling ${recipe.name} on 6-burner gas range... 🔥`;
    if (progressBar) progressBar.style.width = '0%';

    const startTime = Date.now();
    const duration = recipe.cookTime || 3000;

    this.playAudioFx('sizzle');

    this.cookingTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

      if (progressBar) progressBar.style.width = `${pct}%`;

      if (pct % 25 === 0) {
        this.playAudioFx('sizzle');
      }

      if (elapsed >= duration) {
        clearInterval(this.cookingTimer);
        this.cookingTimer = null;
        this.completeCooking(recipe);
      }
    }, 50);
  },

  completeCooking(recipe) {
    this.isCooking = false;
    this.activeRecipeId = null;
    this.playAudioFx('bell');
    this.playAudioFx('success');

    const progressBox = document.getElementById('cooking-progress-container');
    if (progressBox) progressBox.classList.add('hidden');

    // Replenish character needs
    const char = window.CityUndergroundCore?.activeState.character;
    if (char) {
      char.hunger = Math.min(100, (char.hunger || 50) + recipe.restores.hunger);
      char.thirst = Math.min(100, (char.thirst || 50) + recipe.restores.thirst);
      char.health = Math.min(100, (char.health || 100) + recipe.restores.health);
      window.HUD?.updateStats(char);
    }

    // Award Cooking XP
    if (window.SkillsUI) {
      window.SkillsUI.skills.cooking = (window.SkillsUI.skills.cooking || 0) + recipe.xp.amount;
      if (recipe.xp.strengthAmount) {
        window.SkillsUI.skills.strength = (window.SkillsUI.skills.strength || 0) + recipe.xp.strengthAmount;
      }
      window.SkillsUI.render();
    }

    // Add hot meal item to inventory
    if (window.Inventory) {
      window.Inventory.addItem(recipe.id, 1);
    }

    this.renderRecipes();

    alert(`🍽️ MEAL READY!\n\nCooked: ${recipe.name} ${recipe.icon}\n\n• Hunger: +${recipe.restores.hunger}%\n• Thirst: +${recipe.restores.thirst}%\n• Health: +${recipe.restores.health} HP\n• Buff: ${recipe.buff}\n• Gained: +${recipe.xp.amount} Cooking XP!`);
  }
};
