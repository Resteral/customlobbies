/**
 * HELIX Platform (helixgame.com UE5 Sandbox) - Universal System & Station Engine
 * Allows rapid creation of data-driven interactive stations, crafting desks,
 * processors, crypto nodes, and world devices with automatic server loop handling.
 */

const HelixSystems = {
  stations: new Map(),
  activeSessions: new Map(),

  /**
   * Register a new interactive system / station type
   * @param {string} id - Unique identifier (e.g., 'weed_trimmer', 'ammo_press')
   * @param {object} config - Configuration object
   */
  registerStation(id, config) {
    const stationData = {
      id,
      name: config.name || id,
      category: config.category || 'General',
      model: config.model || 'assets/models/workbench.glb',
      processTime: config.processTime || 5, // in seconds
      inputs: config.inputs || {},
      outputs: config.outputs || {},
      rewardCash: config.rewardCash || 0,
      rewardXP: config.rewardXP || 25,
      soundEffect: config.soundEffect || 'audio/process_complete.wav',
      onStart: config.onStart || null,
      onComplete: config.onComplete || null
    };

    this.stations.set(id, stationData);
    console.log(`[HELIX SYSTEMS] Registered Station: ${stationData.name} (${id})`);
  },

  getStation(id) {
    return this.stations.get(id);
  },

  getAllStations() {
    return Array.from(this.stations.values());
  }
};

// Initialize Server Endpoints & Background Processing Loop
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[HELIX SYSTEMS] Initializing Universal Station Processing Loop...');

    // Background session monitor
    setInterval(() => {
      const now = Date.now();
      HelixSystems.activeSessions.forEach((session, sessionKey) => {
        if (session.status === 'processing') {
          const elapsed = (now - session.startTime) / 1000;
          session.progress = Math.min(100, Math.floor((elapsed / session.duration) * 100));

          if (elapsed >= session.duration) {
            session.status = 'completed';
            session.progress = 100;

            const station = HelixSystems.getStation(session.stationId);
            if (station && station.onComplete) {
              station.onComplete(session.playerId, station);
            }

            // Emit completion event to player & world
            if (typeof Helix.emit !== 'undefined') {
              Helix.emit('StationProcessFinished', {
                playerId: session.playerId,
                stationId: session.stationId,
                outputs: station ? station.outputs : {},
                rewardCash: station ? station.rewardCash : 0
              });
            }

            console.log(`[HELIX SYSTEMS] Station ${session.stationId} completed for Player ${session.playerId}`);
            HelixSystems.activeSessions.delete(sessionKey);
          }
        }
      });
    }, 500);

    // Endpoint: Request all registered systems
    Helix.endpoint('getRegisteredSystems', async () => {
      return { success: true, systems: HelixSystems.getAllStations() };
    });

    // Endpoint: Start processing at a station
    Helix.endpoint('startStationProcessing', async (playerId, data) => {
      const { stationId, location } = data || {};
      const station = HelixSystems.getStation(stationId);
      if (!station) {
        return { success: false, error: 'Station type not found.' };
      }

      const sessionKey = `${playerId}_${stationId}`;
      if (HelixSystems.activeSessions.has(sessionKey)) {
        return { success: false, error: 'Station is already processing.' };
      }

      const session = {
        playerId,
        stationId,
        location: location || { x: 0, y: 0, z: 0 },
        startTime: Date.now(),
        duration: station.processTime,
        progress: 0,
        status: 'processing'
      };

      HelixSystems.activeSessions.set(sessionKey, session);

      if (station.onStart) {
        station.onStart(playerId, station);
      }

      return {
        success: true,
        message: `Started ${station.name}`,
        duration: station.processTime
      };
    });
  });
}

// Built-in Default Systems
HelixSystems.registerStation('weed_processor', {
  name: 'Hydroponic Weed Packaging Rig',
  category: 'Drug Processing',
  model: 'assets/models/weed_bench.glb',
  processTime: 4,
  inputs: { weed_buds: 3 },
  outputs: { packaged_weed: 1 },
  rewardCash: 120,
  rewardXP: 30
});

HelixSystems.registerStation('ammo_press', {
  name: 'Industrial Ammo Reloading Station',
  category: 'Armory',
  model: 'assets/models/ammo_bench.glb',
  processTime: 6,
  inputs: { scrap_metal: 2, gunpowder: 1 },
  outputs: { pistol_ammo: 2 },
  rewardCash: 0,
  rewardXP: 45
});

HelixSystems.registerStation('crypto_decryptor', {
  name: 'Quantum Crypto Siphon Node',
  category: 'Cyber Hacking',
  model: 'assets/models/crypto_rack.glb',
  processTime: 8,
  inputs: { crypto_usb: 1 },
  outputs: { encrypted_key: 1 },
  rewardCash: 450,
  rewardXP: 75
});

if (typeof module !== 'undefined') {
  module.exports = HelixSystems;
}
