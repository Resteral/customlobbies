/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Pacifica Map Client Controller
 * Renders district entry popups, POI GPS waypoints, and dynamic Pacifica event notifications.
 */

Helix.client(() => {
  console.log('[HELIX CLIENT] Initializing Pacifica Map Client Controller...');

  const hudUI = new Helix.WebUI('PacificaHUD', 'file://ui/index.html');

  // When player crosses district boundaries in Pacifica
  Helix.on('PacificaDistrictEntered', (district) => {
    console.log(`[PACIFICA HUD] Entered district: ${district.name}`);
    if (hudUI) {
      hudUI.CallEvent('showDistrictBanner', {
        title: district.name,
        color: district.color || '#38bdf8'
      });
    }
  });

  // When a dynamic Pacifica world event is broadcasted
  Helix.on('PacificaWorldBroadcast', (eventData) => {
    console.log(`[PACIFICA EVENT] ${eventData.title}: ${eventData.message}`);
    if (hudUI) {
      hudUI.CallEvent('showWorldEventNotification', {
        title: eventData.title,
        message: eventData.message,
        location: eventData.location,
        color: eventData.color
      });
    }
  });

  // Set GPS Waypoint command / trigger
  Helix.on('SetPacificaWaypoint', (coords) => {
    if (typeof Helix.SetWaypoint !== 'undefined') {
      Helix.SetWaypoint(coords.x, coords.y, coords.z || 0.0);
      console.log(`[PACIFICA GPS] Waypoint set to X: ${coords.x}, Y: ${coords.y}`);
    }
  });
});
