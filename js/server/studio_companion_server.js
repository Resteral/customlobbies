/**
 * HELIX Platform - In-Game AI Studio Companion & World Architect Engine
 * Allows players to generate, build, and spawn structures, prefabs, props, and lighting on the spot in real-time.
 */

Helix.server(async () => {
  console.log('[STUDIO COMPANION] Initializing In-Game World Architect & AI Companion Engine...');

  // Track all dynamically created world entities
  // entityId -> { id, name, type, model, position, rotation, scale, properties, createdBy, createdAt }
  const DynamicWorldEntities = new Map();

  // Comprehensive Prefab Templates
  const PREFAB_LIBRARY = {
    prefab_fortified_outpost: {
      id: 'prefab_fortified_outpost',
      name: 'Fortified Security Checkpoint & Outpost',
      category: 'Defense',
      icon: '🏰',
      description: 'Reinforced steel barrier perimeter, dual high-lumen floodlights, and a keypad-secured gate.',
      elements: [
        { model: 'assets/models/drillable_safe.glb', offset: { x: -2.5, y: 0, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Left Heavy Steel Wall' },
        { model: 'assets/models/drillable_safe.glb', offset: { x: 2.5, y: 0, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Right Heavy Steel Wall' },
        { model: 'assets/models/bank_vault.glb', offset: { x: 0, y: 0, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Keypad Fortified Gate' },
        { model: 'assets/models/hack_terminal.glb', offset: { x: -1.2, y: -0.8, z: 0 }, rot: { pitch: 0, yaw: 45, roll: 0 }, name: 'Access Control Terminal' },
        { model: 'assets/models/metal_toolbox.bin', offset: { x: 1.5, y: -0.5, z: 0 }, rot: { pitch: 0, yaw: 180, roll: 0 }, name: 'Security Equipment Crate' }
      ]
    },
    prefab_underground_lab: {
      id: 'prefab_underground_lab',
      name: 'Clandestine Chemical Synthesis Lab',
      category: 'Narcotics & Industry',
      icon: '🧪',
      description: 'Complete distillation assembly with reaction flask mantle, digital temp probes, and chemical barrels.',
      elements: [
        { model: 'assets/models/meth_lab.glb', offset: { x: 0, y: 0, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Dual-Flask Chemistry Station' },
        { model: 'assets/models/propane_tank.bin', offset: { x: -1.8, y: -0.5, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'High-Pressure Gas Cylinder' },
        { model: 'assets/models/Barrel_01.bin', offset: { x: 1.8, y: -0.4, z: 0 }, rot: { pitch: 0, yaw: 30, roll: 0 }, name: 'P2P Chemical Drum' },
        { model: 'assets/models/plastic_crate_01.bin', offset: { x: 1.2, y: 0.8, z: 0 }, rot: { pitch: 0, yaw: 90, roll: 0 }, name: 'Finished Contraband Crate' }
      ]
    },
    prefab_hydroponic_greenhouse: {
      id: 'prefab_hydroponic_greenhouse',
      name: 'Automated Hydroponic Botany Rig',
      category: 'Botany',
      icon: '🌿',
      description: 'Dual high-yield planting pots with full-spectrum quantum lighting and soil fertilizer bags.',
      elements: [
        { model: 'assets/models/weed_box.glb', offset: { x: 0, y: 0, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Reflective Hydroponic Grow Tent' },
        { model: 'assets/models/weed_pot.glb', offset: { x: -0.6, y: 0, z: 0.2 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Pot Alpha (Gelato 41 Clone)' },
        { model: 'assets/models/weed_pot.glb', offset: { x: 0.6, y: 0, z: 0.2 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Pot Beta (OG Kush Mother)' },
        { model: 'assets/models/compost_bags.bin', offset: { x: -1.6, y: 0.2, z: 0 }, rot: { pitch: 0, yaw: 45, roll: 0 }, name: 'Organic Humus Nutrient Bag' }
      ]
    },
    prefab_mineral_quarry: {
      id: 'prefab_mineral_quarry',
      name: 'Geological Mineral Quarry & Blast Forge',
      category: 'Mining',
      icon: '⛏️',
      description: 'Raw mineral ore outcrop with pneumatic rock crusher and high-temperature smelter crucible.',
      elements: [
        { model: 'assets/models/drillable_safe.glb', offset: { x: -1.5, y: 0, z: 0 }, rot: { pitch: 0, yaw: 20, roll: 0 }, name: 'Tungsten Heavy Ore Rock' },
        { model: 'assets/models/bank_vault.glb', offset: { x: 1.8, y: 0, z: 0 }, rot: { pitch: 0, yaw: -15, roll: 0 }, name: 'Blast Furnace Smelting Crucible' },
        { model: 'assets/models/thermal_drill.glb', offset: { x: 0, y: 0.5, z: 0 }, rot: { pitch: 0, yaw: 90, roll: 0 }, name: 'Pneumatic Drill Rig' }
      ]
    },
    prefab_smuggler_chopshop: {
      id: 'prefab_smuggler_chopshop',
      name: 'Smuggler Chop Shop & Towing Depot',
      category: 'Vehicles',
      icon: '🚛',
      description: 'Vehicle recovery workshop equipped with toolboxes, hydraulic jacks, and parts crates.',
      elements: [
        { model: 'assets/models/metal_toolbox.bin', offset: { x: -1.2, y: 0, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Heavy Duty Tool Chest' },
        { model: 'assets/models/Barrel_01.bin', offset: { x: -1.2, y: 1.2, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Hydraulic Fluid Drum' },
        { model: 'assets/models/plastic_crate_01.bin', offset: { x: 1.5, y: 0, z: 0 }, rot: { pitch: 0, yaw: 45, roll: 0 }, name: 'Spare Tow Cable Rig' }
      ]
    },
    prefab_bank_heist_vault: {
      id: 'prefab_bank_heist_vault',
      name: 'First National Bank Vault & Heist Target',
      category: 'Heists',
      icon: '💰',
      description: 'Heavy armored bank vault with dual hacking security terminals and thermal drill mounting points.',
      elements: [
        { model: 'assets/models/bank_vault.glb', offset: { x: 0, y: 0, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Reinforced 12-Ton Vault Door' },
        { model: 'assets/models/hack_terminal.glb', offset: { x: -1.8, y: -0.5, z: 0 }, rot: { pitch: 0, yaw: 35, roll: 0 }, name: 'Laser Bypass Terminal' },
        { model: 'assets/models/thermal_drill.glb', offset: { x: 0, y: 0.6, z: 0 }, rot: { pitch: 0, yaw: 180, roll: 0 }, name: 'Mounted Plasma Drill' },
        { model: 'assets/models/loot_bag.glb', offset: { x: 1.5, y: -0.5, z: 0 }, rot: { pitch: 0, yaw: 0, roll: 0 }, name: 'Bundled Dirty Cash Bag' }
      ]
    }
  };

  // Helper to compute world spawn coordinates given player position and heading
  function calculateSpawnLocation(playerPos, playerHeading, offset) {
    const rad = ((playerHeading || 0) * Math.PI) / 180.0;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Forward vector is roughly 3 meters in front
    const baseForward = 3.5;
    const localX = (offset ? offset.x : 0);
    const localY = baseForward + (offset ? offset.y : 0);

    const worldX = playerPos.x + (localX * cos - localY * sin);
    const worldY = playerPos.y + (localX * sin + localY * cos);
    const worldZ = playerPos.z + (offset ? offset.z : 0);

    return { x: Math.round(worldX * 100) / 100, y: Math.round(worldY * 100) / 100, z: Math.round(worldZ * 100) / 100 };
  }

  // --- Natural Language AI Prompt Parser ---
  function parseAIPrompt(prompt) {
    const text = (prompt || '').toLowerCase();
    
    // Check if prompt matches prefabs
    if (text.includes('checkpoint') || text.includes('fortified') || text.includes('barricade') || text.includes('defense') || text.includes('wall') || text.includes('outpost')) {
      return { type: 'prefab', prefabId: 'prefab_fortified_outpost', explanation: 'Generating Fortified Security Checkpoint with armored walls, access terminal, and gate.' };
    }
    if (text.includes('meth') || text.includes('cook') || text.includes('chemistry') || text.includes('lab') || text.includes('drug') || text.includes('flask')) {
      return { type: 'prefab', prefabId: 'prefab_underground_lab', explanation: 'Generating Clandestine Chemical Synthesis Lab with dual flasks and pressure cylinders.' };
    }
    if (text.includes('weed') || text.includes('grow') || text.includes('pot') || text.includes('plant') || text.includes('hydroponic') || text.includes('farm')) {
      return { type: 'prefab', prefabId: 'prefab_hydroponic_greenhouse', explanation: 'Generating Automated Hydroponic Botany Rig with UV lamps and cloning pots.' };
    }
    if (text.includes('mine') || text.includes('quarry') || text.includes('ore') || text.includes('tungsten') || text.includes('titanium') || text.includes('smelter') || text.includes('forge')) {
      return { type: 'prefab', prefabId: 'prefab_mineral_quarry', explanation: 'Generating Geological Mineral Quarry Outcrop with blast furnace and drill rig.' };
    }
    if (text.includes('tow') || text.includes('truck') || text.includes('chop') || text.includes('garage') || text.includes('mechanic') || text.includes('salvage') || text.includes('car')) {
      return { type: 'prefab', prefabId: 'prefab_smuggler_chopshop', explanation: 'Generating Smuggler Chop Shop & Vehicle Recovery Depot with toolboxes and cables.' };
    }
    if (text.includes('bank') || text.includes('vault') || text.includes('heist') || text.includes('safe') || text.includes('cash') || text.includes('money')) {
      return { type: 'prefab', prefabId: 'prefab_bank_heist_vault', explanation: 'Generating Bank Vault Target with plasma drill and hack terminal.' };
    }

    // Default Single Prop Spawn
    if (text.includes('barrel')) {
      return { type: 'single', model: 'assets/models/Barrel_01.bin', name: 'Industrial Barrel', explanation: 'Spawning Industrial Chemical Barrel.' };
    }
    if (text.includes('crate') || text.includes('box')) {
      return { type: 'single', model: 'assets/models/plastic_crate_01.bin', name: 'Storage Crate', explanation: 'Spawning Heavy Duty Crate.' };
    }
    if (text.includes('terminal') || text.includes('computer')) {
      return { type: 'single', model: 'assets/models/hack_terminal.glb', name: 'Cyber Terminal', explanation: 'Spawning Hackable Security Terminal.' };
    }

    // Generic fallback
    return { type: 'prefab', prefabId: 'prefab_fortified_outpost', explanation: 'Interpreting prompt as Fortified Outpost Construction.' };
  }

  // --- Endpoints ---

  Helix.endpoint('studioGetState', async (playerId) => {
    return {
      success: true,
      prefabs: PREFAB_LIBRARY,
      activeEntities: Array.from(DynamicWorldEntities.values()).filter(e => e.createdBy === playerId)
    };
  });

  Helix.endpoint('studioCreateFromPrompt', async (playerId, data) => {
    const { prompt, playerTransform } = data || {};
    const pos = (playerTransform && playerTransform.position) || { x: 0, y: 0, z: 0 };
    const heading = (playerTransform && playerTransform.heading) || 0;

    const parsed = parseAIPrompt(prompt);
    const spawnedList = [];

    if (parsed.type === 'prefab') {
      const prefab = PREFAB_LIBRARY[parsed.prefabId];
      if (prefab) {
        prefab.elements.forEach(elem => {
          const spawnLoc = calculateSpawnLocation(pos, heading, elem.offset);
          const entityId = `ent_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

          const entity = {
            id: entityId,
            name: elem.name,
            model: elem.model,
            position: spawnLoc,
            rotation: elem.rot,
            scale: { x: 1, y: 1, z: 1 },
            prefabGroup: prefab.name,
            createdBy: playerId,
            createdAt: Date.now()
          };

          DynamicWorldEntities.set(entityId, entity);
          spawnedList.push(entity);

          if (typeof Helix.spawnEntity !== 'undefined') {
            Helix.spawnEntity(elem.model, spawnLoc, elem.rot);
          }
        });
      }
    } else {
      const spawnLoc = calculateSpawnLocation(pos, heading, { x: 0, y: 0, z: 0 });
      const entityId = `ent_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const entity = {
        id: entityId,
        name: parsed.name,
        model: parsed.model,
        position: spawnLoc,
        rotation: { pitch: 0, yaw: heading, roll: 0 },
        scale: { x: 1, y: 1, z: 1 },
        createdBy: playerId,
        createdAt: Date.now()
      };
      DynamicWorldEntities.set(entityId, entity);
      spawnedList.push(entity);
      if (typeof Helix.spawnEntity !== 'undefined') {
        Helix.spawnEntity(parsed.model, spawnLoc, { pitch: 0, yaw: heading, roll: 0 });
      }
    }

    console.log(`[STUDIO COMPANION] Player ${playerId} AI prompt: "${prompt}" -> Created ${spawnedList.length} entities!`);

    return {
      success: true,
      message: `✨ AI Architect: ${parsed.explanation}`,
      spawnedCount: spawnedList.length,
      spawnedEntities: spawnedList
    };
  });

  Helix.endpoint('studioSpawnPrefab', async (playerId, data) => {
    const { prefabId, playerTransform } = data || {};
    const prefab = PREFAB_LIBRARY[prefabId];
    if (!prefab) return { success: false, message: 'Invalid prefab ID' };

    const pos = (playerTransform && playerTransform.position) || { x: 0, y: 0, z: 0 };
    const heading = (playerTransform && playerTransform.heading) || 0;
    const spawnedList = [];

    prefab.elements.forEach(elem => {
      const spawnLoc = calculateSpawnLocation(pos, heading, elem.offset);
      const entityId = `ent_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

      const entity = {
        id: entityId,
        name: elem.name,
        model: elem.model,
        position: spawnLoc,
        rotation: elem.rot,
        scale: { x: 1, y: 1, z: 1 },
        prefabGroup: prefab.name,
        createdBy: playerId,
        createdAt: Date.now()
      };

      DynamicWorldEntities.set(entityId, entity);
      spawnedList.push(entity);

      if (typeof Helix.spawnEntity !== 'undefined') {
        Helix.spawnEntity(elem.model, spawnLoc, elem.rot);
      }
    });

    console.log(`[STUDIO COMPANION] Player ${playerId} deployed prefab [${prefab.name}] with ${spawnedList.length} items`);
    return {
      success: true,
      message: `🏗️ Successfully built [${prefab.name}] in world!`,
      spawnedEntities: spawnedList
    };
  });

  Helix.endpoint('studioDeleteEntity', async (playerId, data) => {
    const { entityId } = data || {};
    if (!DynamicWorldEntities.has(entityId)) {
      return { success: false, message: 'Entity not found' };
    }
    const ent = DynamicWorldEntities.get(entityId);
    DynamicWorldEntities.delete(entityId);

    console.log(`[STUDIO COMPANION] Player ${playerId} removed [${ent.name}] (ID: ${entityId})`);
    return {
      success: true,
      message: `🗑️ Removed [${ent.name}] from world.`
    };
  });

  Helix.endpoint('studioClearAll', async (playerId) => {
    let count = 0;
    for (const [id, ent] of DynamicWorldEntities.entries()) {
      if (ent.createdBy === playerId) {
        DynamicWorldEntities.delete(id);
        count++;
      }
    }
    console.log(`[STUDIO COMPANION] Player ${playerId} cleared all ${count} dynamic entities.`);
    return {
      success: true,
      message: `🧹 Cleared all ${count} spawned entities.`
    };
  });

  Helix.endpoint('studioExportMapJSON', async (playerId) => {
    const playerEntities = Array.from(DynamicWorldEntities.values()).filter(e => e.createdBy === playerId);
    return {
      success: true,
      mapData: {
        exportedAt: new Date().toISOString(),
        author: playerId,
        totalEntities: playerEntities.length,
        entities: playerEntities
      }
    };
  });

  global.StudioCompanionEngine = {
    PREFAB_LIBRARY,
    DynamicWorldEntities
  };
});
