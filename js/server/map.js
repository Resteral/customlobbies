/**
 * HELIX Platform - Map & World Server Module
 * Hypersonic Laboratories HELIX UE5 Platform
 */

const fs = require('fs');
const path = require('path');

Helix.server(async () => {
  console.log('[HELIX MAP SYSTEM] Initializing Map & District Module...');

  let mapConfig = null;
  const configPath = path.join(__dirname, '..', '..', 'maps', 'pacifica_crime_map.json');

  if (fs.existsSync(configPath)) {
    try {
      mapConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`[HELIX MAP SYSTEM] Loaded Map: ${mapConfig.name} (${mapConfig.districts.length} Districts)`);
    } catch (e) {
      console.error('[-] Failed loading map configuration:', e.message);
    }
  }

  // Map RPC Endpoints
  Helix.endpoint('getMapConfig', async () => {
    return mapConfig;
  });

  Helix.endpoint('getDistricts', async () => {
    return mapConfig ? mapConfig.districts : [];
  });

  Helix.endpoint('getWaypoints', async () => {
    if (!mapConfig) return [];
    const waypoints = [];
    mapConfig.districts.forEach(d => {
      d.poi.forEach(p => {
        waypoints.push({ ...p, district: d.name, color: d.color });
      });
    });
    return waypoints;
  });
});
