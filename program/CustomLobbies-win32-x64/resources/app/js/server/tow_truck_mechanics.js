/**
 * HELIX Platform - Heavy Tow Truck, Hydraulic Flatbed & Vehicle Salvage Engine
 * Handles vehicle towing, winch cable snapping, and scrapyard mineral crushing.
 */

Helix.server(async () => {
  console.log('[TOW TRUCK] Initializing Tow Truck, Hydraulic Winch & Vehicle Salvage Engine...');

  const TOW_CONFIG = {
    model: 'assets/models/car_stash_muscle.glb',
    winchRangeMeters: 15.0,
    winchCableMaterial: 'BraidedSteelCore',
    maxTowingWeightKg: 8500,
    flatbedSocketOffset: { x: 0.0, y: -2.8, z: 0.65 },
    flatbedSocketRot: { pitch: 0, yaw: 0, roll: 0 }
  };

  // Active Towing Connections: (towTruckInstanceId -> { towedVehicleInstanceId, isFlatbedSecured, hookedAt })
  const ActiveTows = new Map();

  // --- Endpoints ---

  Helix.endpoint('getTowTruckStatus', async (playerId, data) => {
    const { towTruckId } = data || {};
    const towData = ActiveTows.get(towTruckId);
    return {
      success: true,
      hasTowedVehicle: !!towData,
      towedVehicle: towData || null
    };
  });

  Helix.endpoint('hookVehicleToTowTruck', async (playerId, data) => {
    const { towTruckId, targetVehicleName } = data || {};
    
    if (ActiveTows.has(towTruckId)) {
      return { success: false, message: 'Tow truck is already hauling a vehicle!' };
    }

    const towRecord = {
      towedVehicleName: targetVehicleName || 'Rival Cartel Stash Cruiser',
      hookedBy: playerId,
      hookedAt: Date.now(),
      isHydraulicsRaised: true,
      winchSecured: true
    };

    ActiveTows.set(towTruckId || `tow_${playerId}`, towRecord);

    // Call UE5 native attachment if available
    if (typeof Helix.attachEntityToParent !== 'undefined') {
      Helix.attachEntityToParent(towTruckId, targetVehicleName, TOW_CONFIG.flatbedSocketOffset, TOW_CONFIG.flatbedSocketRot);
    }

    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('VehicleTowed', { towTruckId, targetVehicleName, sound: 'audio/hydraulic_unlock.wav' });
    }

    console.log(`[TOW TRUCK] Player ${playerId} winched and secured [${towRecord.towedVehicleName}] onto Tow Truck Flatbed #${towTruckId}`);
    return {
      success: true,
      message: `🪝 Winch connected! Successfully loaded [${towRecord.towedVehicleName}] onto the flatbed bed.`,
      towRecord
    };
  });

  Helix.endpoint('releaseVehicleFromTowTruck', async (playerId, data) => {
    const { towTruckId } = data || {};
    const key = towTruckId || `tow_${playerId}`;

    if (!ActiveTows.has(key)) {
      return { success: false, message: 'No vehicle currently hooked to flatbed.' };
    }

    const released = ActiveTows.get(key);
    ActiveTows.delete(key);

    console.log(`[TOW TRUCK] Player ${playerId} detached and unloaded [${released.towedVehicleName}] from Tow Truck #${key}`);
    return {
      success: true,
      message: `🔓 Winch cable detached. [${released.towedVehicleName}] unloaded onto pavement.`,
      releasedVehicle: released
    };
  });

  Helix.endpoint('salvageScrapTowedVehicle', async (playerId, data) => {
    const { towTruckId } = data || {};
    const key = towTruckId || `tow_${playerId}`;

    if (!ActiveTows.has(key)) {
      return { success: false, message: 'You must tow a vehicle to the Pacifica Scrapyard / Foundry first!' };
    }

    const scrapped = ActiveTows.get(key);
    ActiveTows.delete(key);

    // Payout refined minerals & Black Market Rep to player
    const minerals = global.MiningSmeltingEngine ? global.MiningSmeltingEngine.getPlayerMinerals(playerId) : null;
    const clPointsReward = 14500;
    const scrapIngots = {
      bar_chromium_polish: 3,
      ingot_titanium_grade5: 2,
      ingot_tungsten_carbide: 1
    };

    if (minerals) {
      Object.entries(scrapIngots).forEach(([ingotId, qty]) => {
        minerals.refinedIngots[ingotId] = (minerals.refinedIngots[ingotId] || 0) + qty;
      });
    }

    console.log(`[SCRAPYARD] Player ${playerId} crushed & scrapped [${scrapped.towedVehicleName}] -> +$${clPointsReward} and 3x Chromium, 2x Titanium, 1x Tungsten ingots!`);
    return {
      success: true,
      message: `💥 Scrapyard Hydraulic Crusher Complete: Scrapped [${scrapped.towedVehicleName}]! Received +$${clPointsReward.toLocaleString()} CL-Points & 6x refined mineral ingots!`,
      clPointsReward,
      scrapIngots,
      currentMinerals: minerals ? minerals.refinedIngots : {}
    };
  });

  global.TowTruckEngine = {
    TOW_CONFIG,
    ActiveTows
  };
});
