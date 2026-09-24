// Admin Moderation & Audit Panel Module
window.AdminPanel = {
  open() {
    document.getElementById('modal-admin')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-admin')?.classList.add('hidden');
  },

  execute(cmd) {
    const target = document.getElementById('admin-target-id')?.value.trim();
    const arg1 = document.getElementById('admin-arg1')?.value.trim();

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Admin_Action', {
        cmd,
        targetSteamId: target,
        arg1
      });
      alert(`Admin executed: ${cmd} on target ${target || 'self'}`);
    }
  }
};
