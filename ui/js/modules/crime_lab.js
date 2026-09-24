// Chemical Synthesis Lab & Street Dealer Module
window.CrimeLab = {
  currentBuyerId: null,

  openSynth() {
    document.getElementById('modal-synth')?.classList.remove('hidden');
  },

  closeSynth() {
    document.getElementById('modal-synth')?.classList.add('hidden');
  },

  startSynthesis() {
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Crime_StartSynthesis');
    }
  },

  updateProgress(isCooking, duration) {
    const bar = document.getElementById('synth-progress-bar');
    const statusText = document.getElementById('synth-status-text');

    if (!isCooking) {
      if (bar) bar.style.width = '0%';
      if (statusText) statusText.textContent = "Synthesis chamber ready. Insert reagents to begin.";
      return;
    }

    if (statusText) statusText.textContent = `Reaction in progress (${duration}s remaining)...`;
    if (bar) {
      bar.style.transition = `width ${duration}s linear`;
      bar.style.width = '100%';
    }
  },

  openStreetBuyer(buyerId) {
    this.currentBuyerId = buyerId;
    document.getElementById('modal-buyer')?.classList.remove('hidden');
  },

  closeBuyer() {
    document.getElementById('modal-buyer')?.classList.add('hidden');
  },

  sellContraband() {
    if (this.currentBuyerId && window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Crime_SellToBuyer', {
        buyerId: this.currentBuyerId,
        count: 1
      });
    }
    this.closeBuyer();
  }
};
