/**
 * HELIX Platform - Mobile Drug RV & Clandestine Grow Van System
 * Allows players to convert recreational vehicles into mobile clandestine labs:
 *  - Disconnects from Pacifica city electrical grid (Uses diesel generator)
 *  - 0 Fixed Property utility bill trail
 *  - Drive to isolated desert outskirts (Mount Chiliad / Desert Badlands) for undetectable cooks
 *  - Vehicle engine vibration & motion hazard during active chemical synthesis
 */

Helix.server(async () => {
  console.log('[MOBILE LAB] Initializing Mobile Drug RV & Clandestine Grow Van Module...');

  const MobileLabs = new Map();

  function getOrCreateMobileLab(vehicleId, ownerId) {
    if (!MobileLabs.has(vehicleId)) {
      MobileLabs.set(vehicleId, {
        vehicleId,
        vehicleName: 'Fleetwood Bounder RV (Mobile Lab Edition)',
        ownerId,
        generatorFuelLitres: 45.0,
        maxFuelLitres: 60.0,
        generatorRunning: false,
        activeCookType: null, // 'meth' or 'weed'
        cookProgress: 0,
        currentLocation: { x: -800.0, y: 1200.0, z: 25.0, zone: 'Outskirts Badlands' },
        exhaustVentilationOpen: true,
        installedApparatus: ['micro_reflux_condenser', 'mini_grow_rack', 'compact_fume_filter']
      });
    }
    return MobileLabs.get(vehicleId);
  }

  // --- Endpoints ---

  Helix.endpoint('getMobileLabState', async (playerId, data) => {
    const { vehicleId } = data || {};
    const lab = getOrCreateMobileLab(vehicleId || `rv_${playerId}`, playerId);
    return { success: true, lab };
  });

  Helix.endpoint('toggleRVGenerator', async (playerId, data) => {
    const { vehicleId } = data || {};
    const lab = getOrCreateMobileLab(vehicleId || `rv_${playerId}`, playerId);

    if (!lab.generatorRunning && lab.generatorFuelLitres <= 0) {
      return { success: false, message: 'Diesel generator is out of fuel!' };
    }

    lab.generatorRunning = !lab.generatorRunning;
    console.log(`[MOBILE LAB] RV Generator for ${lab.vehicleName} is now ${lab.generatorRunning ? 'RUNNING' : 'STOPPED'}`);
    return {
      success: true,
      running: lab.generatorRunning,
      fuel: lab.generatorFuelLitres,
      message: lab.generatorRunning ? 'Diesel generator started. Power online.' : 'Generator shut down.'
    };
  });

  Helix.endpoint('startMobileCook', async (playerId, data) => {
    const { vehicleId, cookType } = data || {};
    const lab = getOrCreateMobileLab(vehicleId || `rv_${playerId}`, playerId);

    if (!lab.generatorRunning) {
      return { success: false, message: 'Start the RV generator first to power the apparatus!' };
    }

    lab.activeCookType = cookType || 'meth';
    lab.cookProgress = 10;
    console.log(`[MOBILE LAB] Player ${playerId} initiated ${lab.activeCookType} production inside RV at ${lab.currentLocation.zone}`);

    return {
      success: true,
      message: `Clandestine mobile ${lab.activeCookType} production underway!`,
      lab
    };
  });

  // Generator fuel consumption loop
  setInterval(() => {
    MobileLabs.forEach(lab => {
      if (lab.generatorRunning) {
        lab.generatorFuelLitres = Math.max(0, lab.generatorFuelLitres - 0.25);
        if (lab.generatorFuelLitres === 0) {
          lab.generatorRunning = false;
          console.warn(`[MOBILE LAB] RV ${lab.vehicleId} ran out of generator fuel!`);
          Helix.emit('rvPowerFailure', { vehicleId: lab.vehicleId });
        }
        if (lab.activeCookType && lab.cookProgress < 100) {
          lab.cookProgress = Math.min(100, lab.cookProgress + 5);
        }
      }
    });
  }, 3000);

  global.MobileLabEngine = {
    MobileLabs,
    getOrCreateMobileLab
  };
});
