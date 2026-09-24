/**
 * HELIX Platform - Pacifica Real Estate & Residential Housing System
 * Manages Property Rentals, Purchases, Sandbox Construction, Power Grid Loads & Police Heat
 */

Helix.server(async () => {
  console.log('[HOUSING] Initializing Pacifica Real Estate & Stashhouse System...');

  // Database of Residential & Industrial Properties in Pacifica
  const Properties = new Map([
    ['prop_motel_104', {
      id: 'prop_motel_104',
      name: 'Skidrow Motel Room #104',
      district: 'industrial_docks',
      type: 'motel',
      rentPricePerHour: 75,
      buyPrice: null, // Rent only
      maxPowerKW: 4.5,
      currentPowerKW: 0,
      smellInsulation: 0.25, // 25% base odor trapping
      doorLocked: true,
      ownerId: null,
      renterId: null,
      pinCode: '1040',
      keys: new Set(),
      fixtures: [],
      position: { x: 820.0, y: -450.0, z: 5.0 }
    }],
    ['prop_suburb_stash', {
      id: 'prop_suburb_stash',
      name: 'Vinewood Suburb Stash House',
      district: 'outskirts_hills',
      type: 'house',
      rentPricePerHour: 350,
      buyPrice: 280000,
      maxPowerKW: 18.0,
      currentPowerKW: 0,
      smellInsulation: 0.60,
      doorLocked: true,
      ownerId: null,
      renterId: null,
      pinCode: '7721',
      keys: new Set(),
      fixtures: [],
      position: { x: -650.0, y: 780.0, z: 45.0 }
    }],
    ['prop_downtown_penthouse', {
      id: 'prop_downtown_penthouse',
      name: 'Skyline Heights Penthouse 42B',
      district: 'downtown_finance',
      type: 'penthouse',
      rentPricePerHour: 950,
      buyPrice: 1250000,
      maxPowerKW: 35.0,
      currentPowerKW: 0,
      smellInsulation: 0.85,
      doorLocked: true,
      ownerId: null,
      renterId: null,
      pinCode: '9901',
      keys: new Set(),
      fixtures: [],
      position: { x: 180.0, y: 320.0, z: 120.0 }
    }],
    ['prop_docks_warehouse_c', {
      id: 'prop_docks_warehouse_c',
      name: 'Pier 14 Industrial Warehouse C',
      district: 'industrial_docks',
      type: 'warehouse',
      rentPricePerHour: 600,
      buyPrice: 650000,
      maxPowerKW: 75.0,
      currentPowerKW: 0,
      smellInsulation: 0.40,
      doorLocked: true,
      ownerId: null,
      renterId: null,
      pinCode: '4412',
      keys: new Set(),
      fixtures: [],
      position: { x: 1200.0, y: -600.0, z: 4.0 }
    }]
  ]);

  // Player Housing State
  const PlayerHousing = new Map();

  function getPlayerHousingState(playerId) {
    if (!PlayerHousing.has(playerId)) {
      PlayerHousing.set(playerId, {
        ownedProperties: [],
        rentedProperties: [],
        activePropertyId: null,
        powerBillDebt: 0
      });
    }
    return PlayerHousing.get(playerId);
  }

  // --- Real Estate Endpoints ---

  Helix.endpoint('getPropertiesList', async (playerId) => {
    const list = Array.from(Properties.values()).map(p => ({
      id: p.id,
      name: p.name,
      district: p.district,
      type: p.type,
      rentPrice: p.rentPricePerHour,
      buyPrice: p.buyPrice,
      maxPowerKW: p.maxPowerKW,
      currentPowerKW: p.currentPowerKW,
      smellInsulation: p.smellInsulation,
      isRented: !!p.renterId,
      isOwned: !!p.ownerId,
      isMyProperty: p.ownerId === playerId || p.renterId === playerId,
      position: p.position
    }));
    return { success: true, properties: list };
  });

  Helix.endpoint('rentProperty', async (playerId, data) => {
    const { propertyId } = data || {};
    const prop = Properties.get(propertyId);
    if (!prop) return { success: false, message: 'Property not found' };
    if (prop.ownerId || prop.renterId) return { success: false, message: 'Property already occupied' };

    prop.renterId = playerId;
    prop.keys.add(playerId);

    const userState = getPlayerHousingState(playerId);
    userState.rentedProperties.push(propertyId);

    console.log(`[HOUSING] Player ${playerId} rented ${prop.name} ($${prop.rentPricePerHour}/hr)`);
    Helix.emit('propertyStateChanged', { propertyId, status: 'rented', occupantId: playerId });
    return { success: true, message: `Successfully rented ${prop.name}! Keys issued.` };
  });

  Helix.endpoint('buyProperty', async (playerId, data) => {
    const { propertyId } = data || {};
    const prop = Properties.get(propertyId);
    if (!prop) return { success: false, message: 'Property not found' };
    if (!prop.buyPrice) return { success: false, message: 'This property is for rent only' };
    if (prop.ownerId) return { success: false, message: 'Property already owned' };

    prop.ownerId = playerId;
    prop.keys.add(playerId);

    const userState = getPlayerHousingState(playerId);
    userState.ownedProperties.push(propertyId);

    console.log(`[HOUSING] Player ${playerId} purchased deed to ${prop.name} for $${prop.buyPrice.toLocaleString()}`);
    Helix.emit('propertyStateChanged', { propertyId, status: 'owned', occupantId: playerId });
    return { success: true, message: `Congratulations! You now own the deed to ${prop.name}.` };
  });

  Helix.endpoint('togglePropertyDoor', async (playerId, data) => {
    const { propertyId, pinAttempt } = data || {};
    const prop = Properties.get(propertyId);
    if (!prop) return { success: false, message: 'Property not found' };

    const hasKey = prop.keys.has(playerId) || prop.ownerId === playerId || prop.renterId === playerId;
    const pinMatch = pinAttempt && pinAttempt === prop.pinCode;

    if (!hasKey && !pinMatch) {
      return { success: false, message: 'Door is locked! Key or PIN required.' };
    }

    prop.doorLocked = !prop.doorLocked;
    console.log(`[HOUSING] Door for ${prop.name} is now ${prop.doorLocked ? 'LOCKED' : 'UNLOCKED'}`);
    Helix.emit('doorStateChanged', { propertyId, locked: prop.doorLocked });
    return { success: true, locked: prop.doorLocked, message: prop.doorLocked ? 'Door locked.' : 'Door unlocked.' };
  });

  // --- Real-time Grid & Thermal Simulation Loop (Every 5 seconds) ---
  setInterval(() => {
    Properties.forEach((prop, propId) => {
      if (!prop.ownerId && !prop.renterId) return;

      // Calculate total electrical load from inside fixtures
      let totalKW = 0;
      let rawSmellUnits = 0;
      let carbonFilterMitigation = 0;

      prop.fixtures.forEach(fixture => {
        totalKW += (fixture.powerDrawKW || 0);
        if (fixture.type === 'weed_planter' || fixture.type === 'meth_station') {
          rawSmellUnits += (fixture.smellEmission || 15);
        }
        if (fixture.type === 'carbon_filter') {
          carbonFilterMitigation += (fixture.efficiency || 0.85);
        }
        if (fixture.type === 'fume_hood') {
          carbonFilterMitigation += 0.90;
        }
      });

      prop.currentPowerKW = totalKW;

      // Net Odor Leaking Outside
      const netSmell = Math.max(0, rawSmellUnits * (1 - prop.smellInsulation) * (1 - Math.min(0.95, carbonFilterMitigation)));

      // Power Grid Check (Overload danger)
      if (totalKW > prop.maxPowerKW) {
        console.warn(`[HOUSING ALARM] ⚡ Breaker Overloaded at ${prop.name}! (${totalKW.toFixed(1)}kW / ${prop.maxPowerKW}kW max)`);
        Helix.emit('powerOutage', { propertyId: propId, reason: 'Circuit Breaker Tripped - Overload' });
      }

      // Police Thermal / Sniff Heat Check
      if (netSmell > 25.0 || totalKW > (prop.maxPowerKW * 0.90)) {
        const suspiciousLevel = Math.min(100, Math.floor(netSmell * 2 + (totalKW * 1.5)));
        Helix.emit('suspiciousUtilityAlert', {
          propertyId: propId,
          district: prop.district,
          suspiciousLevel,
          thermalSignature: totalKW > 10.0 ? 'HIGH' : 'NORMAL',
          odorIntensity: netSmell > 20.0 ? 'STRONG TERPENES/CHEMICAL' : 'FAINT'
        });
      }
    });
  }, 5000);

  // Expose global manager
  global.PacificaHousing = {
    Properties,
    getPlayerHousingState
  };
});
