// Visual Map Entity & NPC Spawner Placement Tool (Key: F9 or Admin Menu)
window.MapSpawner = {
  archetypes: [
    { id: 'fisherman', name: 'Old Salty Fisherman', icon: '🎣', cat: 'Civic & Jobs', desc: 'Sells fishing rods/bait and buys fresh catch.' },
    { id: 'gas_attendant', name: 'Sunoco Service Clerk', icon: '⛽', cat: 'Commercial', desc: 'Gas station employee with repair kits, coffee, sandwiches, and water.' },
    { id: 'drug_dealer', name: 'Alleyway Contraband Dealer', icon: '🕶️', cat: 'Criminal', desc: 'Buys Starlight Crystals & sells chemical precursors.' },
    { id: 'car_dealer', name: 'Metro Motors Sales Agent', icon: '🚗', cat: 'Commercial', desc: 'Car dealership representative with showroom & garage.' },
    { id: 'casino_dealer', name: 'Velvet Lounge Pit Boss', icon: '🎲', cat: 'Nightlife', desc: 'High-stakes Blackjack & casino gambling.' },
    { id: 'doctor', name: 'Mercy Hospital ER Doctor', icon: '🏥', cat: 'Civic & Jobs', desc: 'Provides trauma kits, CPR, and medical treatment.' },
    { id: 'courier_dispatch', name: 'Logistics Dispatcher', icon: '📦', cat: 'Civic & Jobs', desc: 'Harbor Express delivery job route coordinator.' },
    { id: 'atm_terminal', name: 'First Trust Automated ATM', icon: '💳', cat: 'Props', desc: '24/7 banking machine for deposits and withdrawals.' },
    { id: 'hydro_pot', name: 'Hydroponic Crop Planter', icon: '🪴', cat: 'Props', desc: 'Indoor agricultural pot for botanical synthesis.' },
    { id: 'synth_station', name: 'Chemical Synthesis Lab', icon: '⚗️', cat: 'Props', desc: 'Molecular contraband synthesis station.' }
  ],

  placedEntities: {},

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F9' || (e.altKey && e.key.toLowerCase() === 'p')) {
        this.toggle();
      }
    });
  },

  open() {
    this.renderArchetypeSelect();
    this.renderEntityList();
    this.updatePlayerCoords();
    document.getElementById('modal-spawner')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-spawner')?.classList.add('hidden');
  },

  toggle() {
    const el = document.getElementById('modal-spawner');
    if (el) {
      if (el.classList.contains('hidden')) {
        this.open();
      } else {
        this.close();
      }
    }
  },

  renderArchetypeSelect() {
    const sel = document.getElementById('spawner-archetype-select');
    if (!sel) return;
    sel.innerHTML = '';

    this.archetypes.forEach(arch => {
      const opt = document.createElement('option');
      opt.value = arch.id;
      opt.textContent = `${arch.icon} ${arch.name} (${arch.cat})`;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', () => {
      const selected = this.archetypes.find(a => a.id === sel.value);
      const descEl = document.getElementById('spawner-arch-desc');
      if (descEl && selected) {
        descEl.textContent = selected.desc;
      }
    });

    // Trigger initial desc
    sel.dispatchEvent(new Event('change'));
  },

  updatePlayerCoords() {
    const ply = window.CitySimulator?.player || { x: 500, y: 500 };
    const xInput = document.getElementById('spawner-pos-x');
    const yInput = document.getElementById('spawner-pos-y');
    if (xInput) xInput.value = Math.round(ply.x);
    if (yInput) yInput.value = Math.round(ply.y);
  },

  useCurrentPosition() {
    this.updatePlayerCoords();
    alert("Updated placement coordinates to your current position!");
  },

  placeSelected() {
    const archId = document.getElementById('spawner-archetype-select')?.value;
    const customName = document.getElementById('spawner-custom-name')?.value.trim();
    const x = parseFloat(document.getElementById('spawner-pos-x')?.value || 500);
    const y = parseFloat(document.getElementById('spawner-pos-y')?.value || 500);
    const heading = parseFloat(document.getElementById('spawner-heading')?.value || 0);

    const arch = this.archetypes.find(a => a.id === archId);
    if (!arch) return;

    const entId = 'ent_' + archId + '_' + Date.now();
    const newEnt = {
      id: entId,
      archetypeId: archId,
      name: customName || arch.name,
      icon: arch.icon,
      type: this.mapArchetypeToTargetType(archId),
      pos: { x, y, z: 10 },
      x: x,
      y: y,
      w: 60,
      h: 60,
      color: this.getArchetypeColor(archId),
      heading: heading
    };

    // Add to CitySimulator buildings & placed list
    if (window.CitySimulator) {
      window.CitySimulator.buildings.push(newEnt);
    }
    this.placedEntities[entId] = newEnt;

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Spawner_Place', {
        archetypeId: archId,
        pos: { x, y, z: 10 },
        heading,
        customName: customName || arch.name
      });
    }

    this.renderEntityList();
    alert(`Successfully placed ${newEnt.name} at (${x}, ${y})!`);
  },

  renderEntityList() {
    const listEl = document.getElementById('spawner-placed-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const entries = Object.values(this.placedEntities);
    if (entries.length === 0) {
      listEl.innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:8px;">No custom placed entities yet.</div>';
      return;
    }

    entries.forEach(ent => {
      const row = document.createElement('div');
      row.className = 'char-card';
      row.style.padding = '8px 12px';
      row.innerHTML = `
        <div>
          <div style="font-weight:700; font-size:13px; color:#fff;">${ent.icon || '📍'} ${ent.name}</div>
          <div style="font-size:11px; color:var(--text-muted);">Pos: (${Math.round(ent.pos.x)}, ${Math.round(ent.pos.y)})</div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn-primary" style="padding:4px 8px; font-size:11px;" onclick="MapSpawner.teleportTo('${ent.id}')">Teleport</button>
          <button class="btn-primary btn-danger" style="padding:4px 8px; font-size:11px;" onclick="MapSpawner.removeEntity('${ent.id}')">✕</button>
        </div>
      `;
      listEl.appendChild(row);
    });
  },

  teleportTo(entId) {
    const ent = this.placedEntities[entId];
    if (ent && window.CitySimulator) {
      window.CitySimulator.player.x = ent.pos.x;
      window.CitySimulator.player.y = ent.pos.y;
      alert(`Teleported to ${ent.name}!`);
    }
  },

  removeEntity(entId) {
    if (confirm("Remove this placed entity from the world?")) {
      delete this.placedEntities[entId];
      if (window.CitySimulator) {
        window.CitySimulator.buildings = window.CitySimulator.buildings.filter(b => b.id !== entId);
      }
      if (window.CityUndergroundCore) {
        window.CityUndergroundCore.sendEvent('CU_Spawner_Remove', entId);
      }
      this.renderEntityList();
    }
  },

  mapArchetypeToTargetType(archId) {
    const map = {
      fisherman: 'FISHERMAN',
      gas_attendant: 'STORE_CASHIER',
      drug_dealer: 'STREET_BUYER',
      car_dealer: 'DEALERSHIP_SALES',
      casino_dealer: 'CASINO_DEALER',
      doctor: 'HOSPITAL',
      courier_dispatch: 'DELIVERY_DISPATCH',
      atm_terminal: 'BANK_ATM',
      hydro_pot: 'BOTANY_POT',
      synth_station: 'SYNTH_LAB'
    };
    return map[archId] || 'NPC';
  },

  getArchetypeColor(archId) {
    const colors = {
      fisherman: '#0284c7',
      gas_attendant: '#c2410c',
      drug_dealer: '#831843',
      car_dealer: '#4f46e5',
      casino_dealer: '#d97706',
      doctor: '#be123c',
      courier_dispatch: '#b45309',
      atm_terminal: '#1e3a8a',
      hydro_pot: '#15803d',
      synth_station: '#581c87'
    };
    return colors[archId] || '#334155';
  }
};
