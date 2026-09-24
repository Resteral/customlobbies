// 24/7 Corner QuickMart Convenience Store Module
window.Store = {
  catalog: [
    { id: 'food_sandwich', name: 'Deli Roast Sandwich', price: 15, icon: '🥪', desc: 'Restores 40 Hunger' },
    { id: 'drink_water', name: 'Bottled Spring Water', price: 10, icon: '💧', desc: 'Restores 45 Thirst' },
    { id: 'drink_coffee', name: 'Hot Espresso Roast', price: 12, icon: '☕', desc: 'Restores 30 Thirst & Stamina' },
    { id: 'medkit', name: 'First Aid Trauma Kit', price: 85, icon: '🩹', desc: 'Restores 50 Health' },
    { id: 'repair_kit', name: 'Auto Repair Tool Kit', price: 150, icon: '🔧', desc: 'Fixes vehicle engine & body' },
    { id: 'botany_seed', name: 'Botanical Seed Pack', price: 35, icon: '🌱', desc: 'Indoor agricultural seed' },
    { id: 'contraband_reagents', name: 'Industrial Solvent Reagent', price: 120, icon: '🧪', desc: 'Chemical precursor flask' }
  ],

  open() {
    this.render();
    document.getElementById('modal-store')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-store')?.classList.add('hidden');
  },

  render() {
    const listEl = document.getElementById('store-item-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.catalog.forEach(item => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:24px;">${item.icon}</span>
          <div>
            <div style="font-weight:700; font-size:14px; color:#fff;">${item.name}</div>
            <div style="font-size:12px; color:var(--text-muted);">${item.desc}</div>
          </div>
        </div>
        <button class="btn-primary btn-success" style="padding:6px 14px; font-size:13px;" onclick="Store.buyItem('${item.id}', ${item.price})">
          Buy ($${item.price})
        </button>
      `;
      listEl.appendChild(card);
    });
  },

  buyItem(itemId, price) {
    const char = window.CityUndergroundCore.activeState.character;
    if (char.cash < price) {
      alert("You do not have enough cash on hand!");
      return;
    }

    char.cash -= price;
    window.CityUndergroundCore.activeState.inventory.push({
      id: 'item_' + Date.now(),
      itemType: itemId,
      count: 1,
      slot: window.CityUndergroundCore.activeState.inventory.length + 1
    });

    window.HUD?.updateStats(char);
    window.Inventory?.updateData(window.CityUndergroundCore.activeState.inventory, 3.2, 35.0);
    window.Chat?.addMessage('LOCAL', 'QuickMart Cashier', `Purchased item for $${price}. Have a great day!`);
  }
};
