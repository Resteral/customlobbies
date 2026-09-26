/**
 * HELIX Platform - Sandbox Building Toolgun & Turf Wars Client Controller
 * Hotkeys:
 *  - B: Open Sandbox Building & Fortification Menu
 *  - F8: Open Pacifica Gang Turf War Radar
 *  - F9: Open Smuggling Vehicle Garage & Hidden Stash Manager
 */

Helix.client(() => {
  console.log('[BUILDING TOOLGUN] Initializing Sandbox Building & Turf Wars Controller...');

  const uiCache = new Map();

  function getUI(name, path) {
    if (!uiCache.has(name)) {
      try {
        if (typeof Helix.WebUI !== 'undefined') {
          uiCache.set(name, new Helix.WebUI(name, path));
        }
      } catch (e) {
        console.warn(`[WEBUI WARN] Deferred creation for ${name}`);
      }
    }
    return uiCache.get(name);
  }

  let buildMenuOpen = false;
  let turfMenuOpen = false;
  let garageMenuOpen = false;

  function toggleBuildMenu() {
    buildMenuOpen = !buildMenuOpen;
    const ui = getUI('BuildingMenuUI', 'file://ui/building_menu.html');
    if (ui && ui.CallEvent) ui.CallEvent(buildMenuOpen ? 'openMenu' : 'closeMenu');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(buildMenuOpen || turfMenuOpen || garageMenuOpen);
    }
  }

  function toggleTurfWars() {
    turfMenuOpen = !turfMenuOpen;
    const ui = getUI('TurfWarsUI', 'file://ui/turf_wars.html');
    if (ui && ui.CallEvent) ui.CallEvent(turfMenuOpen ? 'openTurf' : 'closeTurf');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(buildMenuOpen || turfMenuOpen || garageMenuOpen);
    }
  }

  function toggleGarage() {
    garageMenuOpen = !garageMenuOpen;
    const ui = getUI('GarageUI', 'file://ui/vehicle_garage.html');
    if (ui && ui.CallEvent) ui.CallEvent(garageMenuOpen ? 'openGarage' : 'closeGarage');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(buildMenuOpen || turfMenuOpen || garageMenuOpen);
    }
  }

  if (typeof Helix.Input !== 'undefined' && Helix.Input.OnKeyDown) {
    Helix.Input.OnKeyDown('B', () => toggleBuildMenu());
    Helix.Input.OnKeyDown('F8', () => toggleTurfWars());
    Helix.Input.OnKeyDown('F9', () => toggleGarage());
  }

  Helix.on('CloseCustomUI', () => {
    buildMenuOpen = false;
    turfMenuOpen = false;
    garageMenuOpen = false;
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(false);
    }
  });

  Helix.on('turfCapturedBroadcast', (data) => {
    console.log(`[HUD NOTIFICATION] 🚩 TERRITORY CAPTURED: ${data.newGang} took control of ${data.districtName}!`);
  });
});
