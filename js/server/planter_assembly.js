/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Manual Hydroponic Planter Box Assembly, Soil Filling & Cannabis Cultivation Engine
 * Features:
 * 1. Chassis, Radiator, Water Tank, Quantum LED Fixture, Drip Lines, Dual Pots Assembly
 * 2. Manual Soil Substrate Pouring (Coco Coir + Perlite Substrate)
 * 3. Seed Inoculation & Sowing (OG Kush, Purple Haze, Gelato #41, Blue Dream)
 * 4. Live Plant Growth with Visible Trichome-Covered Weed Buds
 */

const PlanterBoxAssembly = {
  PARTS_REQUIRED: {
    base_frame: {
      name: 'Extruded Aluminum Planter Frame',
      slot: 'chassis',
      model: 'assets/models/weed_box_frame.glb',
      installed: true,
      audio: 'audio/metal_clank_heavy.wav'
    },
    radiator_unit: {
      name: 'Hydroponic Heat Radiator & Exhaust Fan',
      slot: 'side_cooling_mount',
      model: 'assets/models/radiator_fan.glb',
      localOffset: { x: -0.55, y: 0.0, z: 0.45 },
      installed: false,
      audio: 'audio/bolt_wrench_tighten.wav',
      feature: 'Thermal Regulation (Prevents Heat Wilt)'
    },
    water_tank: {
      name: 'Submersible Pump Water Reservoir Tank (50L)',
      slot: 'rear_tank_bay',
      model: 'assets/models/water_reservoir.glb',
      localOffset: { x: 0.0, y: -0.45, z: 0.15 },
      installed: false,
      audio: 'audio/tank_latch_snap.wav',
      feature: '50-Liter Automated Hydration Supply'
    },
    light_fixture: {
      name: 'Overhead Quantum LED Grow Light Bar',
      slot: 'top_rail_fixture',
      model: 'assets/models/uv_quantum_lamp.glb',
      localOffset: { x: 0.0, y: 0.0, z: 1.15 },
      installed: false,
      audio: 'audio/light_rail_snap.wav',
      feature: 'Full Spectrum UV Photosynthesis (+40% Speed)'
    },
    irrigation_lines: {
      name: 'Dual Drip Emitter Hose Lines',
      slot: 'drip_manifold',
      model: 'assets/models/irrigation_hose.glb',
      localOffset: { x: 0.0, y: -0.20, z: 0.32 },
      installed: false,
      audio: 'audio/tube_click.wav',
      feature: 'Direct Root Hydration Distribution'
    },
    planting_pot_left: {
      name: 'Aeration Soil Pot (Left Bay)',
      slot: 'pot_bay_left',
      model: 'assets/models/weed_pot.glb',
      localOffset: { x: -0.32, y: 0.0, z: 0.22 },
      installed: false,
      soilFilled: false,
      soilSubstrate: 'Organic Coco Coir & Aerated Perlite',
      plant: null, // Holds active cannabis plant
      audio: 'audio/pot_place_heavy.wav',
      feature: 'Root Space for Plant A'
    },
    planting_pot_right: {
      name: 'Aeration Soil Pot (Right Bay)',
      slot: 'pot_bay_right',
      model: 'assets/models/weed_pot.glb',
      localOffset: { x: 0.32, y: 0.0, z: 0.22 },
      installed: false,
      soilFilled: false,
      soilSubstrate: 'Organic Coco Coir & Aerated Perlite',
      plant: null, // Holds active cannabis plant
      audio: 'audio/pot_place_heavy.wav',
      feature: 'Root Space for Plant B'
    }
  },

  activeAssemblies: new Map(),

  /**
   * Start a new planter assembly workstation
   */
  startAssembly(planterId, playerId) {
    const partsState = {};
    for (const [key, part] of Object.entries(this.PARTS_REQUIRED)) {
      partsState[key] = {
        ...part,
        installed: key === 'base_frame',
        soilFilled: false,
        plant: null
      };
    }

    const assembly = {
      planterId,
      ownerId: playerId,
      parts: partsState,
      completionPercentage: 15,
      isFullyOperational: false,
      createdAt: Date.now()
    };

    this.activeAssemblies.set(planterId, assembly);
    console.log(`[PLANTER ASSEMBLY] Initialized assembly session for Planter #${planterId}`);
    return assembly;
  },

  /**
   * Attach / Meld a component onto the planter box
   */
  meldComponent(planterId, partKey, playerId) {
    let assembly = this.activeAssemblies.get(planterId);
    if (!assembly) assembly = this.startAssembly(planterId, playerId);

    const part = assembly.parts[partKey];
    if (!part) return { success: false, error: 'Unknown part key.' };
    if (part.installed) return { success: false, error: `${part.name} is already installed!` };

    part.installed = true;

    const totalParts = Object.keys(assembly.parts).length;
    const installedCount = Object.values(assembly.parts).filter(p => p.installed).length;
    assembly.completionPercentage = Math.floor((installedCount / totalParts) * 100);

    if (installedCount === totalParts) {
      assembly.isFullyOperational = true;
      console.log(`[PLANTER ASSEMBLY] ★ Planter #${planterId} is FULLY ASSEMBLED! Ready for soil & seeds.`);
    }

    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('GModPhysicsSound', { sound: part.audio });
    }

    return { success: true, message: `Melded ${part.name}`, part, assembly };
  },

  /**
   * Pour Organic Soil Substrate into an installed pot
   */
  pourSoil(planterId, potKey, playerId) {
    const assembly = this.activeAssemblies.get(planterId);
    if (!assembly) return { success: false, error: 'Planter not found' };

    const pot = assembly.parts[potKey];
    if (!pot || !pot.installed) {
      return { success: false, error: 'Pot must be installed into planter bay before adding soil!' };
    }

    pot.soilFilled = true;

    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('GModPhysicsSound', { sound: 'audio/soil_pour.wav' });
    }

    console.log(`[PLANTER SOIL] Player ${playerId} poured Organic Coco Coir Substrate into ${pot.name}`);
    return { success: true, message: `Poured rich organic soil into ${pot.name}`, pot, assembly };
  },

  /**
   * Sow Cannabis Seed and initiate plant growth in the soil bed
   */
  sowWeedSeed(planterId, potKey, strainId = 'purple_haze', playerId) {
    const assembly = this.activeAssemblies.get(planterId);
    if (!assembly) return { success: false, error: 'Planter not found' };

    const pot = assembly.parts[potKey];
    if (!pot || !pot.installed || !pot.soilFilled) {
      return { success: false, error: 'Requires an installed pot filled with moist soil to sow seeds!' };
    }

    const strainNames = {
      purple_haze: 'Purple Haze (Exotic Sativa)',
      og_kush: 'OG Kush (Heavy Indica)',
      gelato_41: 'Gelato #41 (Top-Shelf Hybrid)',
      blue_dream: 'Blue Dream (Commercial Yield)'
    };

    pot.plant = {
      strainId,
      strainName: strainNames[strainId] || 'Purple Haze',
      stage: 'Seedling Sprout',
      growth: 20, // Initial sprout
      thc: 26.5,
      budsVisible: false,
      trichomeCoverage: 'Emerging',
      plantedAt: Date.now()
    };

    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('GModPhysicsSound', { sound: 'audio/seed_planted.wav' });
    }

    console.log(`[PLANTER BOTANY] Sowed ${pot.plant.strainName} into ${pot.name}`);
    return { success: true, message: `Sowed ${pot.plant.strainName} into ${pot.name}!`, plant: pot.plant, assembly };
  },

  /**
   * Advance plant growth to mature flowering buds
   */
  growToFlowering(planterId, potKey) {
    const assembly = this.activeAssemblies.get(planterId);
    if (!assembly || !assembly.parts[potKey] || !assembly.parts[potKey].plant) {
      return { success: false, error: 'No plant in this pot.' };
    }

    const plant = assembly.parts[potKey].plant;
    plant.stage = 'Mature Flowering Buds (Trichome Crystal Heavy)';
    plant.growth = 100;
    plant.budsVisible = true;
    plant.trichomeCoverage = 'Dense Sparkling Crystals (100% Ready)';

    return { success: true, plant, assembly };
  }
};

// Server Endpoints
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[PLANTER ASSEMBLY] Initializing Soil & Cannabis Botany Assembly Module...');

    Helix.endpoint('getPlanterAssembly', async (playerId, data) => {
      const { planterId } = data || {};
      const id = planterId || `planter_${playerId}`;
      const assembly = PlanterBoxAssembly.activeAssemblies.get(id) || PlanterBoxAssembly.startAssembly(id, playerId);
      return { success: true, assembly };
    });

    Helix.endpoint('meldPlanterPart', async (playerId, data) => {
      const { planterId, partKey } = data || {};
      const id = planterId || `planter_${playerId}`;
      return PlanterBoxAssembly.meldComponent(id, partKey, playerId);
    });

    Helix.endpoint('pourPlanterSoil', async (playerId, data) => {
      const { planterId, potKey } = data || {};
      const id = planterId || `planter_${playerId}`;
      return PlanterBoxAssembly.pourSoil(id, potKey, playerId);
    });

    Helix.endpoint('sowPlanterSeed', async (playerId, data) => {
      const { planterId, potKey, strainId } = data || {};
      const id = planterId || `planter_${playerId}`;
      return PlanterBoxAssembly.sowWeedSeed(id, potKey, strainId, playerId);
    });

    Helix.endpoint('bloomPlanterWeed', async (playerId, data) => {
      const { planterId, potKey } = data || {};
      const id = planterId || `planter_${playerId}`;
      return PlanterBoxAssembly.growToFlowering(id, potKey);
    });
  });
}

if (typeof module !== 'undefined') module.exports = PlanterBoxAssembly;
