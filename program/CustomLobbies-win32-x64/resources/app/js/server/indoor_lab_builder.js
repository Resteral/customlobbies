/**
 * HELIX Platform - Indoor Modular Grow-Op & Clandestine Chemistry Lab Builder
 * Allows players to install hardware fixtures inside rented/owned houses & warehouses:
 *  - Mylar Hydroponic Reflective Tents (+25% Growth & Thermal Masking)
 *  - High-Airflow Activated Carbon Filter Scrubbers (-85% Odor Leaks)
 *  - Industrial Laboratory Fume Hood Canopy (-90% Toxic Gas & Chemical Vapors)
 *  - Heavy Duty 50-Amp Circuit Breaker Panels (+30kW Power Capacity)
 *  - Commercial Digital Dehumidifiers (0% Mold Rot Risk)
 *  - Hidden False-Wall Stash Safes (Concealed Contraband Storage)
 */

Helix.server(async () => {
  console.log('[INDOOR LAB] Initializing In-House Modular Lab Fixture Engineering...');

  const FIXTURE_TYPES = {
    mylar_tent: {
      id: 'mylar_tent',
      name: 'Mylar Reflective Hydro Grow Tent (4x4m)',
      category: 'Botany',
      powerDrawKW: 0.2,
      thermalShielding: 0.80, // Blocks 80% of heat from infrared scans
      yieldMultiplier: 1.25,  // +25% weed yield
      cost: 450,
      model: 'assets/models/mylar_tent.glb'
    },
    carbon_filter: {
      id: 'carbon_filter',
      name: 'Inline 8-Inch Carbon Scrubber & Exhaust Duct',
      category: 'Ventilation',
      powerDrawKW: 0.35,
      efficiency: 0.88, // 88% smell reduction
      cost: 650,
      model: 'assets/models/carbon_filter.glb'
    },
    fume_hood: {
      id: 'fume_hood',
      name: 'Laboratory Bio-Chemical Fume Extraction Hood',
      category: 'Chemistry',
      powerDrawKW: 1.2,
      chemicalGasMitigation: 0.95,
      cost: 2400,
      model: 'assets/models/fume_hood.glb'
    },
    circuit_breaker: {
      id: 'circuit_breaker',
      name: 'Heavy-Duty 50-Amp Dual Power Sub-Panel',
      category: 'Electrical',
      powerCapacityBoostKW: 25.0, // Increases house capacity by 25kW
      powerDrawKW: 0,
      cost: 1800,
      model: 'assets/models/circuit_breaker.glb'
    },
    dehumidifier: {
      id: 'dehumidifier',
      name: 'Commercial Digital Condensate Dehumidifier',
      category: 'Climate',
      powerDrawKW: 0.8,
      moldProtection: 1.0, // 100% mold prevention
      cost: 750,
      model: 'assets/models/dehumidifier.glb'
    },
    stash_safe: {
      id: 'stash_safe',
      name: 'Concealed False-Wall Stash Safe',
      category: 'Security',
      capacitySlots: 24,
      cost: 3200,
      model: 'assets/models/stash_safe.glb'
    }
  };

  // --- Endpoints ---

  Helix.endpoint('getAvailableFixtures', async () => {
    return { success: true, catalog: Object.values(FIXTURE_TYPES) };
  });

  Helix.endpoint('installFixtureInProperty', async (playerId, data) => {
    const { propertyId, fixtureType, posX, posY, posZ, rotZ } = data || {};
    const fixtureDef = FIXTURE_TYPES[fixtureType];
    if (!fixtureDef) return { success: false, message: 'Invalid fixture type' };

    const housing = global.PacificaHousing;
    if (!housing) return { success: false, message: 'Housing engine offline' };

    const prop = housing.Properties.get(propertyId);
    if (!prop) return { success: false, message: 'Property not found' };

    if (prop.ownerId !== playerId && prop.renterId !== playerId) {
      return { success: false, message: 'You must own or rent this property to install fixtures!' };
    }

    // Create persistent fixture instance
    const fixtureInstance = {
      instanceId: `fix_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: fixtureType,
      name: fixtureDef.name,
      powerDrawKW: fixtureDef.powerDrawKW,
      installedBy: playerId,
      installedAt: new Date().toISOString(),
      position: { x: posX || 0, y: posY || 0, z: posZ || 0 },
      rotation: { yaw: rotZ || 0 }
    };

    // Apply capacity upgrades
    if (fixtureDef.powerCapacityBoostKW) {
      prop.maxPowerKW += fixtureDef.powerCapacityBoostKW;
      console.log(`[INDOOR LAB] Upgraded ${prop.name} power grid limit to ${prop.maxPowerKW} kW`);
    }

    prop.fixtures.push(fixtureInstance);

    console.log(`[INDOOR LAB] Player ${playerId} installed [${fixtureDef.name}] in ${prop.name}`);
    Helix.emit('fixtureInstalled', { propertyId, fixture: fixtureInstance });

    return {
      success: true,
      message: `Successfully installed ${fixtureDef.name}!`,
      fixture: fixtureInstance,
      currentPowerKW: prop.currentPowerKW,
      maxPowerKW: prop.maxPowerKW
    };
  });

  Helix.endpoint('removeFixtureFromProperty', async (playerId, data) => {
    const { propertyId, instanceId } = data || {};
    const prop = global.PacificaHousing?.Properties.get(propertyId);
    if (!prop) return { success: false, message: 'Property not found' };

    const idx = prop.fixtures.findIndex(f => f.instanceId === instanceId);
    if (idx === -1) return { success: false, message: 'Fixture not found' };

    const removed = prop.fixtures.splice(idx, 1)[0];
    const def = FIXTURE_TYPES[removed.type];
    if (def && def.powerCapacityBoostKW) {
      prop.maxPowerKW = Math.max(5.0, prop.maxPowerKW - def.powerCapacityBoostKW);
    }

    console.log(`[INDOOR LAB] Removed fixture ${removed.name} from ${prop.name}`);
    Helix.emit('fixtureRemoved', { propertyId, instanceId });
    return { success: true, message: `Dismantled ${removed.name}.` };
  });

  global.IndoorLabBuilder = {
    FIXTURE_TYPES
  };
});
