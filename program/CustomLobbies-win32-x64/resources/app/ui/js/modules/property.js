// Real Estate & Open MLO Property Management Module
window.Property = {
  currentPropId: 'apt_101',
  ownedProperties: {
    apt_101: true // Default starting apartment deed
  },

  registry: {
    apt_101: { name: 'Harborview Apartment 101', buyPrice: 12000, rentPrice: 150, type: 'Apartment' },
    mlo_industrial_warehouse: { name: 'Pier 9 Open Industrial Warehouse MLO', buyPrice: 85000, rentPrice: 850, type: 'Industrial MLO' },
    mlo_suburban_ranch: { name: 'Harborview Suburban Ranch House MLO', buyPrice: 65000, rentPrice: 600, type: 'Residential MLO' },
    mlo_downtown_storefront: { name: 'Downtown Storefront & Loft MLO', buyPrice: 75000, rentPrice: 700, type: 'Commercial MLO' },
    mlo_dockside_garage: { name: 'Harbor Customs Chop Shop Garage MLO', buyPrice: 90000, rentPrice: 900, type: 'Garage MLO' },
    mlo_underground_bunker: { name: 'Old City Underground Bunker MLO', buyPrice: 120000, rentPrice: 1200, type: 'Bunker MLO' }
  },

  isOwned(propId) {
    return !!this.ownedProperties[propId];
  },

  open(propId = 'apt_101') {
    this.currentPropId = propId;
    document.getElementById('modal-property')?.classList.remove('hidden');
    this.renderDetails();
  },

  close() {
    document.getElementById('modal-property')?.classList.add('hidden');
  },

  buy(propId = this.currentPropId) {
    const def = this.registry[propId];
    if (!def) return;

    const char = window.CityUndergroundCore?.activeState.character;
    if (char && char.bank < def.buyPrice) {
      alert(`❌ Insufficient funds! You need $${def.buyPrice.toLocaleString()} in your bank account to purchase the deed for ${def.name}.`);
      return;
    }

    if (char) {
      char.bank -= def.buyPrice;
      window.HUD?.updateStats(char);
    }

    this.ownedProperties[propId] = true;
    alert(`🎉 Real Estate Deed Purchased! You now officially own "${def.name}". Base Building permissions are UNLOCKED!`);

    if (window.BaseBuilder) {
      window.BaseBuilder.switchProperty(propId);
    }

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Prop_Buy', propId);
    }
  },

  rent(propId = this.currentPropId) {
    const def = this.registry[propId];
    if (!def) return;

    const char = window.CityUndergroundCore?.activeState.character;
    if (char && char.bank < def.rentPrice) {
      alert(`❌ Insufficient funds! You need $${def.rentPrice.toLocaleString()} for the first month's lease.`);
      return;
    }

    if (char) {
      char.bank -= def.rentPrice;
      window.HUD?.updateStats(char);
    }

    this.ownedProperties[propId] = true;
    alert(`🔑 Property Leased! You have rented "${def.name}". Base Building permissions are UNLOCKED!`);

    if (window.BaseBuilder) {
      window.BaseBuilder.switchProperty(propId);
    }

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Prop_Rent', propId);
    }
  },

  sellDeed(propId = this.currentPropId) {
    const def = this.registry[propId];
    if (!def || !this.isOwned(propId)) {
      alert("You do not hold the deed for this property.");
      return;
    }

    const refund = Math.floor(def.buyPrice * 0.8);
    const char = window.CityUndergroundCore?.activeState.character;
    if (char) {
      char.bank += refund;
      window.HUD?.updateStats(char);
    }

    this.ownedProperties[propId] = false;
    alert(`🏷️ Deed Sold! Received +$${refund.toLocaleString()} (80% equity). Property is now unowned.`);

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Prop_SellDeed', propId);
    }
  },

  toggleLock(propId = this.currentPropId) {
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Prop_ToggleLock', propId);
      alert("🔐 Property entrance deadbolt lock toggled.");
    }
  },

  renderDetails() {
    // Optional modal dynamic update if property modal is opened
  }
};
