/**
 * HELIX Platform - Housing & Stashhouse Client Controller
 * Uses safe lazy WebUI instantiation to prevent Unreal Engine CEF RHI crashes.
 */

Helix.client(() => {
  console.log('[HOUSING CLIENT] Initializing Pacifica Housing & Lab Designer Controller...');

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

  let tabletOpen = false;
  let designerOpen = false;

  function togglePropertyTablet() {
    tabletOpen = !tabletOpen;
    const ui = getUI('PropertyTabletUI', 'file://ui/property_tablet.html');
    if (ui && ui.CallEvent) ui.CallEvent(tabletOpen ? 'openTablet' : 'closeTablet');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(tabletOpen || designerOpen);
    }
  }

  function toggleRoomDesigner() {
    designerOpen = !designerOpen;
    const ui = getUI('RoomDesignerUI', 'file://ui/room_designer.html');
    if (ui && ui.CallEvent) ui.CallEvent(designerOpen ? 'openDesigner' : 'closeDesigner');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(tabletOpen || designerOpen);
    }
  }

  if (typeof Helix.Input !== 'undefined' && Helix.Input.OnKeyDown) {
    Helix.Input.OnKeyDown('F6', () => togglePropertyTablet());
    Helix.Input.OnKeyDown('F7', () => toggleRoomDesigner());
  }

  Helix.on('CloseHousingUI', () => {
    tabletOpen = false;
    designerOpen = false;
    const pUI = getUI('PropertyTabletUI', 'file://ui/property_tablet.html');
    const rUI = getUI('RoomDesignerUI', 'file://ui/room_designer.html');
    if (pUI && pUI.CallEvent) pUI.CallEvent('closeTablet');
    if (rUI && rUI.CallEvent) rUI.CallEvent('closeDesigner');
    if (typeof Helix.Input !== 'undefined' && Helix.Input.SetMouseEnabled) {
      Helix.Input.SetMouseEnabled(false);
    }
  });
});
