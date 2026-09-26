/**
 * HELIX Platform - In-Game AI Studio Companion Client Controller
 * Hotkey: F6 (or /studio chat command)
 */

Helix.client(() => {
  console.log('[STUDIO CLIENT] Initializing In-Game Studio Companion & AI Architect Client Controller...');

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

  let isStudioOpen = false;

  function toggleStudio() {
    isStudioOpen = !isStudioOpen;
    const ui = getUI('StudioCompanionUI', 'file://ui/studio_companion.html');
    if (ui && ui.CallEvent) {
      ui.CallEvent(isStudioOpen ? 'openStudio' : 'closeStudio');
    }
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(isStudioOpen);
    }
  }

  // Keybind 'F6' for AI Studio Companion
  if (typeof Helix.Input !== 'undefined' && Helix.Input.OnKeyDown) {
    Helix.Input.OnKeyDown('F6', () => toggleStudio());
  }

  Helix.on('CloseStudioUI', () => {
    isStudioOpen = false;
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(false);
    }
  });
});
