// Botany & Hydroponic Growth UI Module
window.BotanyUI = {
  plantData: {
    id: 'plant_101',
    progress: 45,
    water: 75,
    health: 100,
    stage: 2
  },

  open() {
    this.render();
    document.getElementById('modal-botany')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-botany')?.classList.add('hidden');
  },

  render() {
    const stageNames = ["Germinated Seedling 🌱", "Vegetative Foliage 🌿", "Budding Flowering 🪴", "Ready for Harvest 🌾"];
    const stageName = stageNames[this.plantData.stage - 1] || "Seedling 🌱";

    document.getElementById('botany-stage-text').textContent = stageName;
    document.getElementById('botany-water-text').textContent = `${Math.round(this.plantData.water)}% Hydration`;
    document.getElementById('botany-water-bar').style.width = `${this.plantData.water}%`;

    document.getElementById('botany-growth-text').textContent = `${Math.round(this.plantData.progress)}% Matured`;
    document.getElementById('botany-growth-bar').style.width = `${this.plantData.progress}%`;

    const btnHarvest = document.getElementById('btn-botany-harvest');
    if (btnHarvest) {
      btnHarvest.disabled = this.plantData.progress < 100;
      btnHarvest.style.opacity = this.plantData.progress < 100 ? '0.5' : '1';
    }
  },

  water() {
    this.plantData.water = Math.min(100, this.plantData.water + 35);
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Botany_Water', this.plantData.id);
    }
    this.render();
    alert("Watered botanical plant (+35% Hydration).");
  },

  harvest() {
    if (this.plantData.progress >= 100) {
      if (window.CityUndergroundCore) {
        window.CityUndergroundCore.sendEvent('CU_Botany_Harvest', this.plantData.id);
      }
      this.plantData.progress = 0;
      this.plantData.stage = 1;
      this.render();
      alert("Harvested botanical crop! Yielded Chemical Reagents x3.");
    }
  }
};
