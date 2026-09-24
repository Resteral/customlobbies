// Minimal HUD Module
window.HUD = {
  updateStats(stats) {
    if (!stats) return;

    // Health
    const hp = Math.max(0, Math.min(100, stats.health || 100));
    const fillHealth = document.getElementById('hud-fill-health');
    if (fillHealth) fillHealth.style.width = `${hp}%`;

    // Hunger
    const hunger = Math.max(0, Math.min(100, stats.hunger || 100));
    const fillHunger = document.getElementById('hud-fill-hunger');
    if (fillHunger) fillHunger.style.width = `${hunger}%`;

    // Thirst
    const thirst = Math.max(0, Math.min(100, stats.thirst || 100));
    const fillThirst = document.getElementById('hud-fill-thirst');
    if (fillThirst) fillThirst.style.width = `${thirst}%`;

    // Cash & Bank
    const cashEl = document.getElementById('hud-cash-val');
    if (cashEl) cashEl.textContent = `$${(stats.cash || 0).toLocaleString()}`;

    const bankEl = document.getElementById('hud-bank-val');
    if (bankEl) bankEl.textContent = `$${(stats.bank || 0).toLocaleString()}`;

    // Job
    const jobEl = document.getElementById('hud-job-val');
    if (jobEl) jobEl.textContent = (stats.job || 'Citizen').toUpperCase();
  },

  setObjective(mission) {
    const objHud = document.getElementById('objective-hud');
    if (!objHud) return;

    if (!mission || !mission.destinationName) {
      objHud.classList.add('hidden');
      return;
    }

    objHud.classList.remove('hidden');
    document.getElementById('obj-dest-text').textContent = mission.destinationName;
    document.getElementById('obj-payout-text').textContent = `Expected Payout: $${mission.basePayout + (mission.bonus || 0)}`;
  },

  showPrompt(promptText, key = 'E') {
    const promptEl = document.getElementById('interaction-prompt');
    if (!promptEl) return;

    if (!promptText) {
      promptEl.classList.add('hidden');
      return;
    }

    promptEl.classList.remove('hidden');
    document.getElementById('prompt-key').textContent = key;
    document.getElementById('prompt-text').textContent = promptText;
  },

  hidePrompt() {
    document.getElementById('interaction-prompt')?.classList.add('hidden');
  }
};
