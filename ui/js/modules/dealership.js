// Vehicle Dealership & Garage Module
window.Dealership = {
  vehicles: [
    { id: 'compact_coupe', name: 'Harbor City Compact', price: 3500, desc: 'Nimble 4-cylinder urban coupe with low fuel consumption.' },
    { id: 'executive_sedan', name: 'East Coast Executive Sedan', price: 8500, desc: 'Luxury turbocharged commuter with comfortable interior.' },
    { id: 'muscle_cruiser', name: 'Metro V8 Street Muscle', price: 15000, desc: 'High-torque rear wheel drive street racer.' },
    { id: 'delivery_van', name: 'Harbor Express Cargo Van', price: 6000, desc: 'Spacious heavy freight van with max cargo storage.' }
  ],

  open() {
    this.renderCatalog();
    document.getElementById('modal-dealership')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-dealership')?.classList.add('hidden');
  },

  renderCatalog() {
    const listEl = document.getElementById('dealership-catalog-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.vehicles.forEach(veh => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.innerHTML = `
        <div>
          <div style="font-weight:700; font-size:15px; color:#fff;">🚗 ${veh.name}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${veh.desc}</div>
          <div style="font-size:13px; font-weight:700; color:var(--accent-emerald); margin-top:6px;">$${veh.price.toLocaleString()}</div>
        </div>
        <button class="btn-primary btn-success" style="padding:8px 16px; font-size:13px;" onclick="Dealership.buyVehicle('${veh.id}')">Purchase</button>
      `;
      listEl.appendChild(card);
    });
  },

  buyVehicle(vehicleId) {
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Veh_Buy', vehicleId);
    }
    this.close();
  }
};
