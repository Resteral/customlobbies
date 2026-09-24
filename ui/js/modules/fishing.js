// Pier Fisherman NPC & Angler Trading Module
window.Fishing = {
  isFishing: false,
  fishTypes: [
    { id: 'fish_bass', name: 'Fresh Harbor Bass', price: 45, icon: '🐟' },
    { id: 'fish_tuna', name: 'Atlantic Bluefin Tuna', price: 95, icon: '🐟' },
    { id: 'fish_crab', name: 'New Harbor Blue Crab', price: 30, icon: '🦀' }
  ],

  open() {
    this.render();
    document.getElementById('modal-fishing')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-fishing')?.classList.add('hidden');
  },

  render() {
    const listEl = document.getElementById('fish-market-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.fishTypes.forEach(fish => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:24px;">${fish.icon}</span>
          <div>
            <div style="font-weight:700; font-size:14px; color:#fff;">${fish.name}</div>
            <div style="font-size:12px; color:var(--text-muted);">Current Market Payout: $${fish.price}</div>
          </div>
        </div>
        <button class="btn-primary btn-success" style="padding:6px 14px; font-size:13px;" onclick="Fishing.sellFish('${fish.id}', ${fish.price})">
          Sell ($${fish.price})
        </button>
      `;
      listEl.appendChild(card);
    });
  },

  buyGear(itemType, price) {
    const char = window.CityUndergroundCore.activeState.character;
    if (char.cash < price) {
      alert("You don't have enough cash for fishing gear!");
      return;
    }

    char.cash -= price;
    window.CityUndergroundCore.activeState.inventory.push({
      id: 'gear_' + Date.now(),
      itemType: itemType,
      count: 1,
      slot: window.CityUndergroundCore.activeState.inventory.length + 1
    });

    window.HUD?.updateStats(char);
    window.Inventory?.updateData(window.CityUndergroundCore.activeState.inventory, 2.8, 35.0);
    alert(`Purchased ${itemType.replace('_', ' ')} from the pier master!`);
  },

  castLine() {
    if (this.isFishing) return;
    this.isFishing = true;

    const statusEl = document.getElementById('fishing-cast-status');
    if (statusEl) statusEl.textContent = "🎣 Line cast into harbor waters... Waiting for a bite...";

    setTimeout(() => {
      this.isFishing = false;
      const caught = this.fishTypes[Math.floor(Math.random() * this.fishTypes.length)];
      if (statusEl) statusEl.textContent = `🎉 Reel in! You caught a ${caught.name}!`;

      window.CityUndergroundCore.activeState.inventory.push({
        id: 'fish_' + Date.now(),
        itemType: caught.id,
        count: 1,
        slot: window.CityUndergroundCore.activeState.inventory.length + 1
      });
      window.Inventory?.updateData(window.CityUndergroundCore.activeState.inventory, 3.1, 35.0);
      window.Chat?.addMessage('LOCAL', 'Old Salty Fisherman', `Nice haul, angler! Bring that ${caught.name} over and I'll pay top dollar.`);
    }, 4000);
  },

  sellFish(fishId, price) {
    const inv = window.CityUndergroundCore.activeState.inventory;
    const idx = inv.findIndex(i => i.itemType === fishId);
    if (idx === -1) {
      alert("You do not have any of this catch in your inventory!");
      return;
    }

    inv.splice(idx, 1);
    window.CityUndergroundCore.activeState.character.cash += price;
    window.HUD?.updateStats(window.CityUndergroundCore.activeState.character);
    window.Inventory?.updateData(inv, 2.5, 35.0);
    window.Chat?.addMessage('LOCAL', 'Old Salty Fisherman', `Paid $${price} cash for your catch.`);
  }
};
