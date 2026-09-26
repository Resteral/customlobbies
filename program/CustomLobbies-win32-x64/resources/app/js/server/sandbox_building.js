/**
 * HELIX Platform - Sandbox Physical Construction & Fortification Engine
 * Handles in-world structure placement, blast doors, barricades, keypads, and repair mechanics.
 */

Helix.server(async () => {
  console.log('[BUILDING ENGINE] Initializing Physical Sandbox World Construction...');

  const BUILDABLE_OBJECTS = {
    steel_wall: {
      id: 'steel_wall',
      name: 'Reinforced Steel Blast Wall',
      category: 'Structural',
      health: 2500,
      maxHealth: 2500,
      cost: 350,
      model: 'assets/models/polyhaven_cardboard_box_01.gltf', // Default physical box collider
      dimensions: { width: 3.0, height: 3.0, depth: 0.2 }
    },
    wood_wall: {
      id: 'wood_wall',
      name: 'Plywood Interior Partition',
      category: 'Structural',
      health: 800,
      maxHealth: 800,
      cost: 120,
      model: 'assets/models/polyhaven_planter_box_01.gltf',
      dimensions: { width: 3.0, height: 3.0, depth: 0.1 }
    },
    security_door: {
      id: 'security_door',
      name: 'Heavy Vault Security Door (Keypad PIN)',
      category: 'Access',
      health: 3500,
      maxHealth: 3500,
      cost: 750,
      hasKeypad: true,
      model: 'assets/models/bank_vault.glb',
      dimensions: { width: 1.5, height: 2.5, depth: 0.3 }
    },
    floodlight: {
      id: 'floodlight',
      name: 'High-Output Halogen Floodlight Tower',
      category: 'Utility',
      health: 400,
      maxHealth: 400,
      cost: 220,
      powerDrawKW: 0.5,
      model: 'assets/models/polyhaven_propane_tank.gltf',
      dimensions: { width: 1.0, height: 3.5, depth: 1.0 }
    },
    barbed_barricade: {
      id: 'barbed_barricade',
      name: 'Barbed Wire Steel Barricade',
      category: 'Defense',
      health: 1200,
      maxHealth: 1200,
      cost: 180,
      damageOnTouch: 25,
      model: 'assets/models/polyhaven_Barrel_01.gltf',
      dimensions: { width: 2.5, height: 1.2, depth: 1.0 }
    },
    storage_shelf: {
      id: 'storage_shelf',
      name: 'Industrial Metal Storage Rack (30 Slots)',
      category: 'Storage',
      health: 900,
      maxHealth: 900,
      cost: 290,
      slots: 30,
      model: 'assets/models/polyhaven_metal_toolbox.gltf',
      dimensions: { width: 2.0, height: 2.2, depth: 0.8 }
    }
  };

  // World Spawned Structures Map
  const WorldStructures = new Map();

  // --- Endpoints ---

  Helix.endpoint('getBuildableCatalog', async () => {
    return { success: true, catalog: Object.values(BUILDABLE_OBJECTS) };
  });

  Helix.endpoint('placeStructure', async (playerId, data) => {
    const { objectId, x, y, z, yaw, pinCode } = data || {};
    const def = BUILDABLE_OBJECTS[objectId];
    if (!def) return { success: false, message: 'Invalid structure ID' };

    const structureId = `struct_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newStruct = {
      structureId,
      objectId,
      name: def.name,
      health: def.health,
      maxHealth: def.maxHealth,
      position: { x: parseFloat(x || 0), y: parseFloat(y || 0), z: parseFloat(z || 0) },
      rotation: { yaw: parseFloat(yaw || 0) },
      placedBy: playerId,
      placedAt: new Date().toISOString(),
      locked: !!def.hasKeypad,
      pinCode: pinCode || '1234',
      storageItems: def.slots ? [] : null
    };

    WorldStructures.set(structureId, newStruct);
    console.log(`[BUILDING] Player ${playerId} built [${def.name}] at [X: ${x}, Y: ${y}, Z: ${z}]`);
    Helix.emit('structurePlaced', newStruct);

    return {
      success: true,
      message: `Successfully constructed ${def.name}!`,
      structure: newStruct
    };
  });

  Helix.endpoint('repairStructure', async (playerId, data) => {
    const { structureId, repairAmount } = data || {};
    const struct = WorldStructures.get(structureId);
    if (!struct) return { success: false, message: 'Structure not found' };

    const def = BUILDABLE_OBJECTS[struct.objectId];
    const amount = repairAmount || 250;
    struct.health = Math.min(def.maxHealth, struct.health + amount);

    console.log(`[BUILDING] Player ${playerId} repaired ${struct.name} (${struct.health}/${def.maxHealth} HP)`);
    Helix.emit('structureRepaired', { structureId, health: struct.health });

    return { success: true, health: struct.health, maxHealth: def.maxHealth, message: `Repaired to ${struct.health} HP.` };
  });

  Helix.endpoint('dismantleStructure', async (playerId, data) => {
    const { structureId } = data || {};
    const struct = WorldStructures.get(structureId);
    if (!struct) return { success: false, message: 'Structure not found' };

    if (struct.placedBy !== playerId) {
      return { success: false, message: 'Only the builder can dismantle this structure!' };
    }

    WorldStructures.delete(structureId);
    console.log(`[BUILDING] Player ${playerId} dismantled ${struct.name}`);
    Helix.emit('structureDismantled', { structureId });

    return { success: true, message: `Dismantled ${struct.name}. Materials reclaimed.` };
  });

  global.SandboxBuilding = {
    BUILDABLE_OBJECTS,
    WorldStructures
  };
});
