/**
 * HELIX Platform - Client HUD & Input Controller
 * Handles WebUI instances, keybindings, camera post-processing, and NUI focus.
 */

Helix.client(() => {
  console.log('[HELIX CLIENT] Initializing NUI Interfaces & Keybindings...');

  // Initialize WebUI Windows
  const mainUI = new Helix.WebUI('HelixMainUI', 'file://ui/index.html');
  const mapUI = new Helix.WebUI('HelixMapUI', 'file://ui/map.html');

  let isUIOpen = false;

  // Toggle NUI Mouse & Input Focus
  function setUIFocus(enable) {
    isUIOpen = enable;
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(enable);
      Helix.Input.SetInputEnabled(!enable);
    }
  }

  // Keybind Listeners for HELIX Client
  if (typeof Helix.Input !== 'undefined' && Helix.Input.OnKeyDown) {
    // Key 'M' -> Toggle Map Radar
    Helix.Input.OnKeyDown('M', () => {
      if (mapUI) {
        mapUI.CallEvent('toggleMapModal');
        setUIFocus(true);
      }
    });

    // Key 'B' -> Toggle Business Management
    Helix.Input.OnKeyDown('B', () => {
      if (mainUI) {
        mainUI.CallEvent('openBusinessUI');
        setUIFocus(true);
      }
    });
  }

  // Event Listeners from Server or WebUI
  Helix.on('PoliceAlertBroadcast', (data) => {
    if (mainUI) {
      mainUI.CallEvent('showPoliceAlert', data.message || 'SILENT ALARM TRIGGERED!');
    }
  });

  Helix.on('OpenBlackMarket', () => {
    if (mainUI) {
      mainUI.CallEvent('openBlackMarketUI');
      setUIFocus(true);
    }
  });

  Helix.on('OpenHackingMinigame', (difficulty) => {
    if (mainUI) {
      mainUI.CallEvent('openHackingUI', difficulty || 4);
      setUIFocus(true);
    }
  });

  Helix.on('OpenMethLab', (labData) => {
    if (mainUI) {
      mainUI.CallEvent('openMethLabUI', labData);
      setUIFocus(true);
    }
  });

  Helix.on('OpenVaultKeypad', (vaultData) => {
    if (mainUI) {
      mainUI.CallEvent('openVaultKeypadUI', vaultData);
      setUIFocus(true);
    }
  });

  Helix.on('CloseNUIModal', () => {
    setUIFocus(false);
  });
});
