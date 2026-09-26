// Quick Contextual Radial Wheel Menu (Key: C)
window.RadialMenu = {
  isOpen: false,
  actions: [
    { id: 'veh_lock', label: 'Lock/Unlock', icon: '🔒', action: () => window.CityUndergroundCore.sendEvent('CU_Veh_ToggleLock') },
    { id: 'veh_engine', label: 'Toggle Engine', icon: '🔑', action: () => alert("Toggled vehicle engine.") },
    { id: 'veh_trunk', label: 'Open Trunk', icon: '🚙', action: () => window.StorageContainer.open("Vehicle Trunk Storage", 40.0) },
    { id: 'char_intro', label: 'Introduce Self', icon: '🤝', action: () => window.CityUndergroundCore.sendChatMessage('/introduce') },
    { id: 'char_cuff', label: 'Handcuff Target', icon: '⛓️', action: () => alert("Applied steel restraints to target.") },
    { id: 'emote_wave', label: 'Wave Emote', icon: '👋', action: () => window.CityUndergroundCore.sendChatMessage('/me waves at nearby citizens.') },
    { id: 'emote_surrender', label: 'Surrender', icon: '🙌', action: () => window.CityUndergroundCore.sendChatMessage('/me raises hands in the air.') },
    { id: 'open_skills', label: 'Skills & Perks', icon: '⚡', action: () => window.SkillsUI.open() }
  ],

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'c' && !e.repeat && document.activeElement.tagName !== 'INPUT') {
        this.toggle();
      }
    });
    this.render();
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const el = document.getElementById('radial-menu-container');
    if (el) {
      el.classList.toggle('hidden', !this.isOpen);
    }
  },

  render() {
    const container = document.getElementById('radial-menu-wheel');
    if (!container) return;
    container.innerHTML = '';

    const total = this.actions.length;
    const radius = 130;

    this.actions.forEach((act, idx) => {
      const angle = (idx / total) * (2 * Math.PI) - Math.PI / 2;
      const x = Math.round(Math.cos(angle) * radius);
      const y = Math.round(Math.sin(angle) * radius);

      const slice = document.createElement('div');
      slice.className = 'radial-slice';
      slice.style.transform = `translate(${x}px, ${y}px)`;
      slice.innerHTML = `
        <div class="radial-icon">${act.icon}</div>
        <div class="radial-label">${act.label}</div>
      `;

      slice.addEventListener('click', () => {
        act.action();
        this.toggle();
      });

      container.appendChild(slice);
    });
  }
};
