/**
 * HELIX Platform - Client HUD & Input Controller
 * Handles WebUI instances with lazy initialization to prevent CEF RHI crashes.
 */

Helix.client(() => {
  console.log('[HELIX CLIENT] Initializing NUI Interfaces & Keybindings...');

  const uiCache = new Map();

  function getUI(name, path) {
    if (!uiCache.has(name)) {
      try {
        if (typeof Helix.WebUI !== 'undefined') {
          uiCache.set(name, new Helix.WebUI(name, path));
        }
      } catch (e) {
        console.warn(`[WEBUI WARN] Deferred WebUI creation for ${name}:`, e.message);
      }
    }
    return uiCache.get(name);
  }

  let isUIOpen = false;

  function setUIFocus(enable) {
    isUIOpen = enable;
    if (typeof Helix.Input !== 'undefined') {
      if (Helix.Input.SetMouseEnabled) Helix.Input.SetMouseEnabled(enable);
      if (Helix.Input.SetInputEnabled) Helix.Input.SetInputEnabled(!enable);
    }
  }

  // Keybind Listeners for HELIX Client
  if (typeof Helix.Input !== 'undefined' && Helix.Input.OnKeyDown) {
    // Key 'M' or 'F2' -> Toggle Map Radar
    Helix.Input.OnKeyDown('M', () => {
      const mapUI = getUI('HelixMapUI', 'file://ui/map.html');
      if (mapUI && mapUI.CallEvent) {
        mapUI.CallEvent('toggleMapModal');
        setUIFocus(true);
      }
    });

    Helix.Input.OnKeyDown('F2', () => {
      const mapUI = getUI('HelixMapUI', 'file://ui/map.html');
      if (mapUI && mapUI.CallEvent) {
        mapUI.CallEvent('toggleMapModal');
        setUIFocus(true);
      }
    });

    // Key 'F3' -> Planter Builder
    Helix.Input.OnKeyDown('F3', () => {
      const pUI = getUI('PlanterUI', 'file://ui/planter_builder.html');
      if (pUI && pUI.CallEvent) {
        pUI.CallEvent('toggleUI');
        setUIFocus(true);
      }
    });

    // Key 'F4' -> Lab Console
    Helix.Input.OnKeyDown('F4', () => {
      const labUI = getUI('LabUI', 'file://ui/lab.html');
      if (labUI && labUI.CallEvent) {
        labUI.CallEvent('toggleUI');
        setUIFocus(true);
      }
    });

    // Key 'TAB' -> Inventory HUD
    Helix.Input.OnKeyDown('Tab', () => {
      const mainUI = getUI('HelixMainUI', 'file://ui/hud.html');
      if (mainUI && mainUI.CallEvent) {
        mainUI.CallEvent('toggleInventoryHUD');
        setUIFocus(true);
      }
    });
  }

  // Server Events
  Helix.on('PoliceAlertBroadcast', (data) => {
    const mainUI = getUI('HelixMainUI', 'file://ui/hud.html');
    if (mainUI && mainUI.CallEvent) {
      mainUI.CallEvent('showPoliceAlert', data.message || 'SILENT ALARM TRIGGERED!');
    }
  });

  Helix.on('CloseNUIModal', () => {
    setUIFocus(false);
  });
});
