// Character Selection & Creation Module
window.CharCreator = {
  selectedCharId: null,

  init() {
    document.getElementById('btn-create-char')?.addEventListener('click', () => {
      this.submitCreation();
    });
  },

  renderCharacterList(chars) {
    const listEl = document.getElementById('char-list-items');
    if (!listEl) return;
    listEl.innerHTML = '';

    const charEntries = Object.values(chars || {});
    if (charEntries.length === 0) {
      listEl.innerHTML = '<div style="color:var(--text-muted); padding:10px;">No characters created yet. Create one on the right!</div>';
      return;
    }

    charEntries.forEach(char => {
      const card = document.createElement('div');
      card.className = `char-card ${this.selectedCharId === char.id ? 'selected' : ''}`;
      card.innerHTML = `
        <div>
          <div style="font-weight:700; font-size:15px; color:#fff;">${char.firstName} ${char.lastName}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:3px;">
            Job: <strong style="color:var(--accent-blue)">${(char.job || 'Citizen').toUpperCase()}</strong> | 
            Cash: <strong style="color:var(--accent-emerald)">$${char.cash || 0}</strong> | 
            Bank: <strong style="color:var(--accent-cyan)">$${char.bank || 0}</strong>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-primary" style="padding:6px 12px; font-size:12px;" onclick="CharCreator.selectChar('${char.id}')">Play</button>
          <button class="btn-primary btn-danger" style="padding:6px 10px; font-size:12px;" onclick="CharCreator.deleteChar('${char.id}')">✕</button>
        </div>
      `;
      listEl.appendChild(card);
    });
  },

  selectChar(charId) {
    this.selectedCharId = charId;
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Char_Select', charId);
    }
    document.getElementById('char-screen')?.classList.add('hidden');
  },

  deleteChar(charId) {
    if (confirm("Are you sure you want to delete this character?")) {
      if (window.CityUndergroundCore) {
        window.CityUndergroundCore.sendEvent('CU_Char_Delete', charId);
      }
    }
  },

  submitCreation() {
    const firstName = document.getElementById('char-firstname')?.value.trim();
    const lastName = document.getElementById('char-lastname')?.value.trim();
    const gender = document.getElementById('char-gender')?.value;
    const clothingStyle = document.getElementById('char-clothing')?.value;

    if (!firstName || !lastName) {
      alert("Please enter both First and Last Name.");
      return;
    }

    const data = {
      firstName,
      lastName,
      gender,
      clothingStyle,
      model: gender === 'female' ? 'models/player/female_01.mdl' : 'models/player/male_01.mdl'
    };

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Char_Create', data);
    }

    document.getElementById('char-screen')?.classList.add('hidden');
  }
};
