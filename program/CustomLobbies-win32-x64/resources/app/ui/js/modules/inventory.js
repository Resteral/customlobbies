// Slot-Based Inventory Module
window.Inventory = {
  items: [],
  weight: 0,
  maxWeight: 35.0,
  selectedSlot: null,

  init() {
    this.renderSlots();
  },

  renderSlots() {
    const grid = document.getElementById('player-inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let slot = 1; slot <= 24; slot++) {
      const item = this.items.find(i => i.slot === slot);
      const slotEl = document.createElement('div');
      slotEl.className = `inv-slot ${item ? 'occupied' : ''}`;
      slotEl.dataset.slot = slot;

      if (item) {
        const icon = this.getItemIcon(item.itemType);
        const name = this.getItemName(item.itemType);
        slotEl.innerHTML = `
          <div class="slot-icon">${icon}</div>
          <div class="slot-name">${name}</div>
          ${item.count > 1 ? `<div class="slot-count">${item.count}</div>` : ''}
        `;

        slotEl.addEventListener('click', () => {
          this.openItemContextMenu(item);
        });
      }

      grid.appendChild(slotEl);
    }

    // Weight
    const weightEl = document.getElementById('inv-weight-text');
    if (weightEl) {
      weightEl.textContent = `${(this.weight || 0).toFixed(1)} / ${this.maxWeight.toFixed(1)} kg`;
    }
  },

  updateData(items, weight, maxWeight) {
    this.items = items || [];
    this.weight = weight || 0;
    this.maxWeight = maxWeight || 35.0;
    this.renderSlots();
  },

  openItemContextMenu(item) {
    const name = this.getItemName(item.itemType);
    const useAction = confirm(`Item: ${name} (x${item.count})\n\nClick [OK] to USE item, or [Cancel] for more actions.`);
    if (useAction) {
      this.useItem(item.id);
    } else {
      const dropAction = confirm(`Would you like to DROP ${name} onto the ground?`);
      if (dropAction) {
        this.dropItem(item.id);
      }
    }
  },

  useItem(itemId) {
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Inv_Use', itemId);
    }
  },

  dropItem(itemId) {
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Inv_Drop', itemId);
    }
  },

  getItemIcon(itemType) {
    const icons = {
      food_sandwich: '🥪',
      food_apple: '🍎',
      drink_water: '💧',
      drink_coffee: '☕',
      medkit: '🩹',
      phone: '📱',
      repair_kit: '🔧',
      contraband_reagents: '🧪',
      contraband_crystals: '💎',
      handcuffs: '⛓️',
      delivery_parcel: '📦'
    };
    return icons[itemType] || '📦';
  },

  getItemName(itemType) {
    const names = {
      food_sandwich: 'Deli Sandwich',
      food_apple: 'Crisp Apple',
      drink_water: 'Bottled Water',
      drink_coffee: 'Espresso Roast',
      medkit: 'Trauma Medkit',
      phone: 'CityLink Smartphone',
      repair_kit: 'Vehicle Repair Kit',
      contraband_reagents: 'Chemical Reagents',
      contraband_crystals: 'Starlight Crystals',
      handcuffs: 'Steel Handcuffs',
      delivery_parcel: 'Express Parcel'
    };
    return names[itemType] || itemType;
  }
};
