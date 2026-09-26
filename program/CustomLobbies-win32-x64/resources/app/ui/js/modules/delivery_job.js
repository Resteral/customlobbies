// Delivery Driver Logistics Module
window.DeliveryJob = {
  open() {
    document.getElementById('modal-delivery')?.classList.remove('hidden');
  },

  close() {
    document.getElementById('modal-delivery')?.classList.add('hidden');
  },

  startRoute() {
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Job_StartDelivery');
    }
    this.close();
  },

  completeRoute() {
    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Job_CompleteDelivery');
    }
  }
};
