// Police CAD / MDT Terminal Module
window.PoliceMDT = {
  open() {
    document.getElementById('modal-mdt')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-mdt')?.classList.add('hidden');
  },

  issueCitation() {
    const suspectId = document.getElementById('mdt-suspect-id')?.value.trim();
    const code = document.getElementById('mdt-penal-code')?.value;
    const fine = parseInt(document.getElementById('mdt-fine-amt')?.value || 250);

    if (suspectId && window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Police_IssueCitation', {
        suspectCharId: suspectId,
        code,
        fine
      });
      alert(`Citation issued to ${suspectId} for $${fine}.`);
    }
  },

  showDispatchAlert(msg) {
    const banner = document.getElementById('police-dispatch-banner');
    const textEl = document.getElementById('police-dispatch-text');
    if (!banner || !textEl) return;

    textEl.textContent = msg;
    banner.classList.remove('hidden');

    setTimeout(() => {
      banner.classList.add('hidden');
    }, 6000);
  }
};
