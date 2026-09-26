/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Pacifica Map World Controller & Dynamic Spawner
 * Manages district detection, world POI spawners, territory control, and dynamic map events.
 */

const fs = require('fs');
const path = require('path');

Helix.server(async () => {
  console.log('===========================================================');
  console.log('[PACIFICA WORLD] Initializing Pacifica Map Script Engine...');
  console.log('===========================================================');

  const mapConfigPath = path.join(__dirname, '..', '..', 'maps', 'pacifica_crime_map.json');
  let mapData = null;

  if (fs.existsSync(mapConfigPath)) {
    try {
      mapData = JSON.parse(fs.readFileSync(mapConfigPath, 'utf8'));
      console.log(`[PACIFICA WORLD] Loaded ${mapData.name} - ${mapData.districts.length} Districts.`);
    } catch (err) {
      console.error('[PACIFICA WORLD] Error parsing map JSON:', err.message);
    }
  }

  // Player District Tracking State
  const playerDistricts = new Map(); // playerId -> districtId
  const spawnedWorldEntities = new Map();

  /**
   * Calculate which Pacifica district a coordinate is inside
   */
  function getDistrictAtCoord(x, y) {
    if (!mapData || !mapData.districts) return null;
    for (const district of mapData.districts) {
      const b = district.bounds;
      if (b && x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY) {
        return district;
      }
    }
    return null;
  }

  /**
   * Spawn all interactive stations and world entities defined in Pacifica POIs
   */
  function spawnPacificaWorldPOIs() {
    if (!mapData || !mapData.districts) return;

    let totalSpawned = 0;
    mapData.districts.forEach(district => {
      district.poi.forEach(poi => {
        const entityId = `pacifica_poi_${poi.type}_${Math.floor(poi.x)}_${Math.floor(poi.y)}`;
        
        const worldObject = {
          id: entityId,
          name: poi.name,
          type: poi.type,
          model: poi.model || 'assets/models/workbench.glb',
          district: district.name,
          color: district.color,
          position: { x: poi.x, y: poi.y, z: poi.z || 0.0 },
          heading: poi.heading || 0.0,
          physics: poi.physics || { mass: 100.0, material: 'DefaultSolid' },
          pbr: poi.pbr || { roughness: 0.5, metallic: 0.5 },
          audio: poi.audio || {},
          vfx: poi.vfx || {}
        };

        spawnedWorldEntities.set(entityId, worldObject);
        totalSpawned++;

        // If Helix entity spawner is available in runtime
        if (typeof Helix.spawnEntity !== 'undefined') {
          Helix.spawnEntity(worldObject.model || worldObject.type, worldObject.position, {
            yaw: worldObject.heading,
            mass: worldObject.physics.mass,
            material: worldObject.physics.material,
            collision: worldObject.physics.collision,
            pbr: worldObject.pbr,
            ambientAudio: worldObject.audio.ambientLoop
          });
        }
      });
    });

    console.log(`[PACIFICA WORLD] Spawned ${totalSpawned} Realistic PBR POI entities across Pacifica.`);
  }

  // Initial Spawn on Boot
  spawnPacificaWorldPOIs();

  /**
   * Player Position Tick Loop (Track district entry/exit & proximity triggers)
   */
  setInterval(() => {
    if (typeof Helix.getPlayers === 'undefined') return;

    const players = Helix.getPlayers();
    players.forEach(player => {
      const pos = player.position || { x: 0, y: 0, z: 0 };
      const currentDistrict = getDistrictAtCoord(pos.x, pos.y);
      const prevDistrictId = playerDistricts.get(player.id);

      if (currentDistrict && currentDistrict.id !== prevDistrictId) {
        playerDistricts.set(player.id, currentDistrict.id);
        
        // Notify player of new district
        if (typeof Helix.emitToPlayer !== 'undefined') {
          Helix.emitToPlayer(player.id, 'PacificaDistrictEntered', {
            id: currentDistrict.id,
            name: currentDistrict.name,
            color: currentDistrict.color
          });
        }
        console.log(`[PACIFICA WORLD] Player ${player.id} entered ${currentDistrict.name}`);
      }
    });
  }, 1000);

  /**
   * Dynamic Pacifica World Event: Cargo Drop at Industrial Docks
   */
  function triggerDocksCargoDrop() {
    const dropLocation = { x: 1050.0, y: -600.0, z: 5.0 };
    console.log('[PACIFICA EVENT] Cargo Supply Shipment arriving at Industrial Docks!');

    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('PacificaWorldBroadcast', {
        title: 'CARGO SHIPMENT INCOMING',
        message: 'A contraband shipping container has arrived at Pacifica Industrial Docks.',
        location: dropLocation,
        color: '#ff6432'
      });
    }
  }

  /**
   * Dynamic Pacifica World Event: Armored Bank Convoy in Downtown
   */
  function triggerBankConvoy() {
    const startLocation = { x: 0.0, y: 750.0, z: 10.0 };
    console.log('[PACIFICA EVENT] Armored Bank Convoy departing First National Bank!');

    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('PacificaWorldBroadcast', {
        title: 'ARMORED CONVOY ACTIVE',
        message: 'First National Bank security transit convoy is moving through Downtown Pacifica.',
        location: startLocation,
        color: '#00ffc8'
      });
    }
  }

  // Pacifica RPC Endpoints
  Helix.endpoint('getPacificaPOIs', async () => {
    return Array.from(spawnedWorldEntities.values());
  });

  Helix.endpoint('getPacificaDistrictInfo', async (playerId, coords) => {
    const { x, y } = coords || {};
    const district = getDistrictAtCoord(x, y);
    return { success: true, district };
  });

  Helix.endpoint('triggerPacificaEvent', async (playerId, eventType) => {
    if (eventType === 'cargo_drop') {
      triggerDocksCargoDrop();
      return { success: true, event: 'cargo_drop' };
    } else if (eventType === 'bank_convoy') {
      triggerBankConvoy();
      return { success: true, event: 'bank_convoy' };
    }
    return { success: false, error: 'Unknown event type.' };
  });
});
