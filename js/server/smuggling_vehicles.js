/**
 * HELIX Platform - Custom Smuggling Vehicles, False Compartments & Fleet Management
 * Features:
 *  - Smuggler Offshore Speedboat (High-speed Docks maritime cargo exporter)
 *  - Clandestine Cook RV (Fleetwood Bounder with onboard distillation lab)
 *  - Armored Muscle Stash Car (Hidden sub-floor stash bypassing K9 canine searches)
 *  - Undercover Police Interceptor (Pursuit cruiser with plate reader & thermal sniffer)
 */

Helix.server(async () => {
  console.log('[VEHICLES] Initializing Smuggling Fleet & Stash Compartment System...');

  const VEHICLE_CATALOG = {
    car_stash_muscle: {
      id: 'car_stash_muscle',
      name: 'Vapid Dominator GT (Stash Edition)',
      category: 'Land',
      topSpeedKmH: 240,
      armorRating: 65,
      stashCapacityKg: 85,
      canineDetectionResistancePct: 95, // 95% chance to fool police K9s
      price: 95000,
      model: 'assets/models/car_stash_muscle.glb'
    },
    boat_smuggler: {
      id: 'boat_smuggler',
      name: 'Tropic Offshore Twin-Turbo Smuggler Speedboat',
      category: 'Maritime',
      topSpeedKmH: 180,
      armorRating: 40,
      stashCapacityKg: 500,
      canineDetectionResistancePct: 100, // Deep water isolation
      price: 145000,
      model: 'assets/models/boat_smuggler.glb'
    },
    rv_cooker: {
      id: 'rv_cooker',
      name: 'Fleetwood Bounder RV (Mobile Lab Edition)',
      category: 'Mobile Lab',
      topSpeedKmH: 130,
      armorRating: 50,
      stashCapacityKg: 250,
      canineDetectionResistancePct: 40,
      price: 65000,
      model: 'assets/models/rv_cooker.glb'
    },
    police_interceptor: {
      id: 'police_interceptor',
      name: 'Pacifica Police Interceptor Cruiser',
      category: 'Law Enforcement',
      topSpeedKmH: 260,
      armorRating: 85,
      hasPlateScanner: true,
      hasThermalRadar: true,
      price: 110000,
      model: 'assets/models/police_interceptor.glb'
    },
    truck_heavy_tow: {
      id: 'truck_heavy_tow',
      name: 'Brute Flatbed Heavy Hydraulic Tow Truck',
      category: 'Heavy Recovery & Impound Hauler',
      topSpeedKmH: 160,
      armorRating: 90,
      stashCapacityKg: 650,
      canineDetectionResistancePct: 80,
      hasHydraulicWinch: true,
      canTowVehicles: true,
      price: 125000,
      model: 'assets/models/car_stash_muscle.glb'
    }
  };

  const SpawnedVehicles = new Map();

  // --- Endpoints ---

  Helix.endpoint('getVehicleCatalog', async () => {
    return { success: true, catalog: Object.values(VEHICLE_CATALOG) };
  });

  Helix.endpoint('spawnSmugglingVehicle', async (playerId, data) => {
    const { vehicleId, x, y, z } = data || {};
    const def = VEHICLE_CATALOG[vehicleId];
    if (!def) return { success: false, message: 'Invalid vehicle type' };

    const instanceId = `veh_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newVeh = {
      instanceId,
      vehicleId,
      name: def.name,
      ownerId: playerId,
      position: { x: parseFloat(x || 0), y: parseFloat(y || 0), z: parseFloat(z || 0) },
      stashInventory: [],
      currentStashWeightKg: 0,
      maxStashWeightKg: def.stashCapacityKg || 50,
      health: 1000,
      engineRunning: false
    };

    SpawnedVehicles.set(instanceId, newVeh);
    console.log(`[VEHICLES] Player ${playerId} spawned [${def.name}] (ID: ${instanceId})`);
    Helix.emit('vehicleSpawned', newVeh);

    return {
      success: true,
      message: `Delivered ${def.name}! Stash compartments unlocked.`,
      vehicle: newVeh
    };
  });

  Helix.endpoint('storeInVehicleStash', async (playerId, data) => {
    const { instanceId, itemType, quantity, weightKg } = data || {};
    const veh = SpawnedVehicles.get(instanceId);
    if (!veh) return { success: false, message: 'Vehicle not found' };

    if (veh.currentStashWeightKg + weightKg > veh.maxStashWeightKg) {
      return { success: false, message: 'Hidden compartment is full!' };
    }

    veh.stashInventory.push({ itemType, quantity, weightKg, storedAt: Date.now() });
    veh.currentStashWeightKg += weightKg;

    console.log(`[VEHICLES] Concealed ${quantity}x ${itemType} inside hidden stash of ${veh.name} (${veh.currentStashWeightKg}/${veh.maxStashWeightKg} kg)`);
    return {
      success: true,
      message: `Concealed ${quantity}x ${itemType} in underbody false floor.`,
      currentWeight: veh.currentStashWeightKg,
      maxWeight: veh.maxStashWeightKg
    };
  });

  global.SmugglingVehiclesEngine = {
    VEHICLE_CATALOG,
    SpawnedVehicles
  };
});
