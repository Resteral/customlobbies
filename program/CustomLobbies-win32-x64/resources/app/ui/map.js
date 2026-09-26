/**
 * HELIX Platform Map Radar WebUI Controller
 */

function toggleMapModal() {
  const modal = document.getElementById('map-radar-modal');
  if (modal) {
    modal.classList.toggle('hidden');
  }
}

if (window.Helix && Helix.on) {
  Helix.on('toggleMapModal', toggleMapModal);
}
