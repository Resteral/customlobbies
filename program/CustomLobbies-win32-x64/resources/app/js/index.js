/**
 * HELIX Platform - Main Package Entry Point
 * Hypersonic Laboratories HELIX UE5 Platform (docs.helixgame.com)
 */

// Local Development Simulator Bridge (Allows running & testing in standalone Node.js)
if (typeof global !== 'undefined' && typeof global.Helix === 'undefined') {
  const eventListeners = new Map();
  const endpoints = new Map();

  global.Helix = {
    server: (callback) => callback(),
    client: (callback) => callback(),
    endpoint: (name, handler) => {
      endpoints.set(name, handler);
    },
    emit: (event, data) => {
      const handlers = eventListeners.get(event) || [];
      handlers.forEach(fn => fn(data));
    },
    on: (event, handler) => {
      if (!eventListeners.has(event)) eventListeners.set(event, []);
      eventListeners.get(event).push(handler);
    },
    playerJoined: (callback) => {
      // Simulate demo player connection in standalone mode
      setTimeout(() => callback('Player_1'), 1000);
    },
    getPlayers: () => [
      { id: 'Player_1', name: 'Developer', position: { x: 120.0, y: 450.0, z: 15.0 } }
    ],
    spawnEntity: (type, pos, rot) => {
      // Virtual entity spawn
    },
    WebUI: class {
      constructor(name, uri) {
        this.name = name;
        this.uri = uri;
      }
      CallEvent(event, data) {}
    }
  };
}

// Server-side context execution
Helix.server(async () => {
  console.log('===========================================================');
  console.log('[HELIX SERVER] Loading Pacifica Crime & Systems Package...');
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
    require('./server/pacifica_world.js');
    require('./server/drugs_botany.js');
    require('./server/drugs_meth.js');
    require('./server/drugs_coke.js');
    require('./server/drugs_distribution.js');
    require('./server/modular_attachment_engine.js');
    require('./server/gmod_physics_snap.js');
    require('./server/planter_assembly.js');
    require('./server/housing_properties.js');
    require('./server/indoor_lab_builder.js');
    require('./server/botany_curing_cloning.js');
    require('./server/property_security_traps.js');
    require('./server/mobile_lab_rv.js');
    require('./server/sandbox_building.js');
    require('./server/territory_turf_wars.js');
    require('./server/smuggling_vehicles.js');
    require('./server/tow_truck_mechanics.js');
    require('./server/custom_items_economy.js');
    require('./server/mining_smelting.js');
    require('./server/weapon_gunsmith.js');
    require('./server/special_ammunition.js');
    require('./server/studio_companion_server.js');
    require('./server/helix_matchmaking_bridge.js');
    console.log('[HELIX SERVER] ✓ All Server Modules, Studio AI Architect (F6), Tow Truck, Gunsmith, Mining Loaded.');
  } catch (err) {
    console.error('[HELIX SERVER] Error loading modules:', err);
  }

  Helix.playerJoined(async (playerId) => {
    console.log(`[HELIX SERVER] Player connected to Pacifica (ID: ${playerId})`);
  });
});

// Client-side context execution
Helix.client(() => {
  console.log('===========================================================');
  console.log('[HELIX CLIENT] Loading Client Modules & WebUI...');
  console.log('===========================================================');

  try {
    require('./client/hud.js');
    require('./client/pacifica_client.js');
    require('./client/gmod_physics_client.js');
    require('./client/housing_client.js');
    require('./client/building_toolgun.js');
    require('./client/gunsmith_client.js');
    require('./client/studio_companion_client.js');
    console.log('[HELIX CLIENT] ✓ Client HUD, AI Studio Companion (F6), Gunsmith (F10), Foundry (F11), Toolgun (B) Loaded.');
  } catch (err) {
    console.log('[HELIX CLIENT] Client script active.');
  }
});
