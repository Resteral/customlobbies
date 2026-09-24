// Banking & ATM Interface Module
window.Banking = {
  init() {
    document.getElementById('btn-bank-deposit')?.addEventListener('click', () => {
      const amt = parseInt(document.getElementById('bank-amount-input')?.value || 0);
      if (amt > 0 && window.CityUndergroundCore) {
        window.CityUndergroundCore.sendEvent('CU_Econ_Deposit', amt);
      }
    });

    document.getElementById('btn-bank-withdraw')?.addEventListener('click', () => {
      const amt = parseInt(document.getElementById('bank-amount-input')?.value || 0);
      if (amt > 0 && window.CityUndergroundCore) {
        window.CityUndergroundCore.sendEvent('CU_Econ_Withdraw', amt);
      }
    });

    document.getElementById('btn-bank-transfer')?.addEventListener('click', () => {
      const targetId = document.getElementById('bank-target-id')?.value.trim();
      const amt = parseInt(document.getElementById('bank-transfer-amt')?.value || 0);
      if (targetId && amt > 0 && window.CityUndergroundCore) {
        window.CityUndergroundCore.sendEvent('CU_Econ_Transfer', { targetCharId: targetId, amount: amt });
      }
    });
  },

  open() {
    document.getElementById('modal-banking')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-banking')?.classList.add('hidden');
  }
};
