/**
 * HELIX Platform - Modular Weapon Gunsmith & Mining Smelter Client Controller
 * Hotkeys:
 *  - F10: Modular Weapon Gunsmith & 6-Socket Attachment Workbench
 *  - F11: Subterranean Mining & Blast Furnace Foundry Hub
 */

Helix.client(() => {
  console.log('[GUNSMITH CLIENT] Initializing Weapon Gunsmith & Mining Smelter Controller...');

  const uiCache = new Map();

  function getUI(name, path) {
    if (!uiCache.has(name)) {
      try {
        if (typeof Helix.WebUI !== 'undefined') {
          uiCache.set(name, new Helix.WebUI(name, path));
        }
      } catch (e) {
        console.warn(`[WEBUI WARN] Deferred creation for ${name}:`, e.message);
      }
    }
    return uiCache.get(name);
  }

  let gunsmithOpen = false;
  let foundryOpen = false;

  function toggleGunsmith() {
    gunsmithOpen = !gunsmithOpen;
    const ui = getUI('GunsmithUI', 'file://ui/gunsmith.html');
    if (ui && ui.CallEvent) ui.CallEvent(gunsmithOpen ? 'openGunsmith' : 'closeGunsmith');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(gunsmithOpen || foundryOpen);
    }
  }

  function toggleFoundry() {
    foundryOpen = !foundryOpen;
    const ui = getUI('FoundryUI', 'file://ui/mining_forge.html');
    if (ui && ui.CallEvent) ui.CallEvent(foundryOpen ? 'openFoundry' : 'closeFoundry');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(gunsmithOpen || foundryOpen);
    }
  }

  if (typeof Helix.Input !== 'undefined' && Helix.Input.OnKeyDown) {
    Helix.Input.OnKeyDown('F10', () => toggleGunsmith());
    Helix.Input.OnKeyDown('F11', () => toggleFoundry());
  }

  Helix.on('CloseGunsmithUI', () => {
    gunsmithOpen = false;
    foundryOpen = false;
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(false);
    }
  });
});
