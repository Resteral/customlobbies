// Dual-Grid Stash & Vehicle Trunk Storage Container UI
window.StorageContainer = {
  containerTitle: "Apartment 101 Personal Stash",
  containerCapacityKg: 60.0,
  containerItems: [
    { id: 'stash_1', itemType: 'food_sandwich', count: 4, slot: 1 },
    { id: 'stash_2', itemType: 'medkit', count: 2, slot: 2 },
    { id: 'stash_3', itemType: 'repair_kit', count: 1, slot: 3 }
  ],

  open(title = "Apartment 101 Personal Stash", capacityKg = 60.0) {
    this.containerTitle = title;
    this.containerCapacityKg = capacityKg;
    document.getElementById('modal-storage')?.classList.remove('hidden');
    this.render();
  },

  close() {
    document.getElementById('modal-storage')?.classList.add('hidden');
  },

  render() {
    document.getElementById('storage-title-text').textContent = this.containerTitle;
    this.renderPlayerGrid();
    this.renderContainerGrid();
  },

  renderPlayerGrid() {
    const grid = document.getElementById('storage-player-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const pItems = window.CityUndergroundCore?.activeState.inventory || [];
    for (let slot = 1; slot <= 24; slot++) {
      const item = pItems.find(i => i.slot === slot);
      const slotEl = document.createElement('div');
      slotEl.className = `inv-slot ${item ? 'occupied' : ''}`;

      if (item) {
        slotEl.innerHTML = `
          <div class="slot-icon">${window.Inventory.getItemIcon(item.itemType)}</div>
          <div class="slot-name">${window.Inventory.getItemName(item.itemType)}</div>
          ${item.count > 1 ? `<div class="slot-count">${item.count}</div>` : ''}
        `;
        slotEl.addEventListener('click', () => {
          this.transferToContainer(item);
        });
      }
      grid.appendChild(slotEl);
    }
  },

  renderContainerGrid() {
    const grid = document.getElementById('storage-container-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let slot = 1; slot <= 24; slot++) {
      const item = this.containerItems.find(i => i.slot === slot);
      const slotEl = document.createElement('div');
      slotEl.className = `inv-slot ${item ? 'occupied' : ''}`;

      if (item) {
        slotEl.innerHTML = `
          <div class="slot-icon">${window.Inventory.getItemIcon(item.itemType)}</div>
          <div class="slot-name">${window.Inventory.getItemName(item.itemType)}</div>
          ${item.count > 1 ? `<div class="slot-count">${item.count}</div>` : ''}
        `;
        slotEl.addEventListener('click', () => {
          this.transferToPlayer(item);
        });
      }
      grid.appendChild(slotEl);
    }
  },

  transferToContainer(item) {
    const pInv = window.CityUndergroundCore.activeState.inventory;
    const idx = pInv.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      pInv.splice(idx, 1);
      this.containerItems.push({
        id: 'stash_' + Date.now(),
        itemType: item.itemType,
        count: item.count,
        slot: this.containerItems.length + 1
      });
      this.render();
      window.Inventory.updateData(pInv, 2.0, 35.0);
    }
  },

  transferToPlayer(item) {
    const idx = this.containerItems.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      this.containerItems.splice(idx, 1);
      window.CityUndergroundCore.activeState.inventory.push({
        id: 'item_' + Date.now(),
        itemType: item.itemType,
        count: item.count,
        slot: window.CityUndergroundCore.activeState.inventory.length + 1
      });
      this.render();
      window.Inventory.updateData(window.CityUndergroundCore.activeState.inventory, 3.5, 35.0);
    }
  }
};
