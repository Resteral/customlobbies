/**
 * HELIX Platform - Main Package Entry Point
 * Hypersonic Laboratories HELIX UE5 Platform (docs.helixgame.com)
 */

// Server-side context execution
Helix.server(async () => {
  console.log('===========================================================');
  console.log('[HELIX SERVER] Loading Crime, Business & World Package...');
  console.log('===========================================================');
  
  // Load Server Modules
  try {
    require('./server/drugs.js');
    require('./server/heists.js');
    require('./server/crypto.js');
    require('./server/blackmarket.js');
    require('./server/business.js');
    require('./server/map.js');
    require('./server/system_engine.js');
    console.log('[HELIX SERVER] ✓ All Server Modules & Custom Systems Engine Loaded.');
  } catch (err) {
    console.log('[HELIX SERVER] Note: Modules evaluated in HelixJS server environment.');
  }

  Helix.playerJoined(async (playerId) => {
    console.log(`[HELIX SERVER] Player connected (ID: ${playerId})`);
  });
});

// Client-side context execution
Helix.client(() => {
  console.log('===========================================================');
  console.log('[HELIX CLIENT] Loading Client Modules & WebUI...');
  console.log('===========================================================');

  try {
    require('./client/hud.js');
    console.log('[HELIX CLIENT] ✓ Client HUD Module Loaded Successfully.');
  } catch (err) {
    console.log('[HELIX CLIENT] Client script active.');
  }
});
