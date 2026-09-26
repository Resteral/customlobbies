// PERP Skills & Progression UI Module
window.SkillsUI = {
  skills: {
    synthesis: 450,
    lockpicking: 120,
    botany: 380,
    driving: 1200,
    medical: 200,
    strength: 780
  },

  open() {
    this.render();
    document.getElementById('modal-skills')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-skills')?.classList.add('hidden');
  },

  render() {
    const listEl = document.getElementById('skills-list-container');
    if (!listEl) return;
    listEl.innerHTML = '';

    const skillDefs = {
      strength: { name: 'Physical Strength & Athletics', icon: '💪', desc: '+5kg to +25kg carry capacity, barricade shoving speed, and melee impact.' },
      synthesis: { name: 'Chemical Synthesis', icon: '⚗️', desc: 'Reaction speeds, higher crystal purity, and less police suspicion.' },
      lockpicking: { name: 'Lockpicking & Burglary', icon: '🗝️', desc: 'Bypass vehicle locks, apartments, and safes.' },
      botany: { name: 'Botany & Hydroponics', icon: '🌱', desc: 'Accelerate indoor botanical growth and increase harvest yield.' },
      driving: { name: 'Vehicle Driving', icon: '🏎️', desc: 'Fuel efficiency, top speed acceleration, and collision resistance.' },
      medical: { name: 'Emergency Medicine', icon: '🩹', desc: 'Bandage potency, faster medical application, and citizen revival.' }
    };

    for (const [key, def] of Object.entries(skillDefs)) {
      const xp = this.skills[key] || 0;
      let level = 1;
      let nextXP = 350;
      if (xp >= 5000) { level = 5; nextXP = 5000; }
      else if (xp >= 2500) { level = 4; nextXP = 5000; }
      else if (xp >= 1000) { level = 3; nextXP = 2500; }
      else if (xp >= 350) { level = 2; nextXP = 1000; }

      const pct = Math.min(100, Math.round((xp / nextXP) * 100));

      const card = document.createElement('div');
      card.className = 'char-card';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'stretch';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:700; font-size:15px; color:#fff; display:flex; align-items:center; gap:8px;">
            <span>${def.icon}</span> <span>${def.name}</span>
          </div>
          <div style="font-size:13px; font-weight:800; color:var(--accent-cyan)">LEVEL ${level} / 5</div>
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${def.desc}</div>
        <div style="margin-top:10px;">
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-weight:600;">
            <span style="color:var(--text-muted)">Progress: ${xp} / ${nextXP} XP</span>
            <span style="color:var(--accent-emerald)">${pct}%</span>
          </div>
          <div class="bar-bg" style="height:8px;">
            <div class="bar-fill" style="width:${pct}%; background:linear-gradient(90deg, #00f2fe, #10b981);"></div>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    }
  },

  updateSkills(data) {
    this.skills = data || this.skills;
    this.render();
  }
};
