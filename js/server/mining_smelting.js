/**
 * HELIX Platform - Subterranean Mining & Foundry Smelting Engine
 * Handles ore node harvesting, pneumatic jackhammer mechanics, and blast furnace smelting.
 */

Helix.server(async () => {
  console.log('[MINING & SMELTING] Initializing Ore Extraction & Mineral Foundry Engine...');

  const ORE_TYPES = {
    ore_tungsten: {
      id: 'ore_tungsten',
      name: 'Raw Tungsten Heavy Ore',
      rarity: 'Rare',
      miningDifficulty: 4,
      refinesInto: 'ingot_tungsten_carbide',
      refinedName: 'Tungsten Carbide Ingot',
      furnaceTempRequired: 1650, // Celsius
      smeltRatio: 3, // 3 Ore -> 1 Ingot
      description: 'Dense metallic mineral used for ultra-high penetration barrels and armor piercing drums.'
    },
    ore_titanium: {
      id: 'ore_titanium',
      name: 'Titanium Bauxite Crystal Ore',
      rarity: 'Uncommon',
      miningDifficulty: 3,
      refinesInto: 'ingot_titanium_grade5',
      refinedName: 'Grade 5 Titanium Plate',
      furnaceTempRequired: 1400,
      smeltRatio: 2,
      description: 'Aerospace-grade lightweight metal used for skeletonized receivers and monolithic suppressors.'
    },
    ore_cobalt: {
      id: 'ore_cobalt',
      name: 'Cobalt Magnetite Cluster',
      rarity: 'Very Rare',
      miningDifficulty: 5,
      refinesInto: 'core_cobalt_magnetite',
      refinedName: 'Cobalt Magnetite Core',
      furnaceTempRequired: 1550,
      smeltRatio: 3,
      description: 'Ferromagnetic mineral with electromagnetic properties used for gauss velocity accelerators.'
    },
    ore_lithium: {
      id: 'ore_lithium',
      name: 'Lithium Quartz Geode',
      rarity: 'Rare',
      miningDifficulty: 3,
      refinesInto: 'prism_lithium_quartz',
      refinedName: 'Lithium Quartz Prism Optical Lens',
      furnaceTempRequired: 1100,
      smeltRatio: 2,
      description: 'Optically clear reactive crystal used for thermal infrared scopes and holographic reticles.'
    },
    ore_chromium: {
      id: 'ore_chromium',
      name: 'Raw Chromium Vein Ore',
      rarity: 'Common',
      miningDifficulty: 2,
      refinesInto: 'bar_chromium_polish',
      refinedName: 'Polished Chromium Bar',
      furnaceTempRequired: 1250,
      smeltRatio: 2,
      description: 'Low-friction corrosion-proof alloy used for rapid-cycling bolt carriers and slides.'
    }
  };

  // Player Mining Inventories & Smelting Queues
  const PlayerMinerals = new Map();
  const ActiveSmelters = new Map();

  function getPlayerMinerals(playerId) {
    if (!PlayerMinerals.has(playerId)) {
      PlayerMinerals.set(playerId, {
        rawOres: { ore_tungsten: 6, ore_titanium: 8, ore_cobalt: 4, ore_lithium: 6, ore_chromium: 10 },
        refinedIngots: { ingot_tungsten_carbide: 2, ingot_titanium_grade5: 3, core_cobalt_magnetite: 1, prism_lithium_quartz: 2, bar_chromium_polish: 4 },
        pickaxeLevel: 2
      });
    }
    return PlayerMinerals.get(playerId);
  }

  // --- Endpoints ---

  Helix.endpoint('getMiningState', async (playerId) => {
    const inv = getPlayerMinerals(playerId);
    return { success: true, minerals: inv, oreCatalog: Object.values(ORE_TYPES) };
  });

  Helix.endpoint('mineOreDeposit', async (playerId, data) => {
    const { oreType } = data || {};
    const oreDef = ORE_TYPES[oreType || 'ore_tungsten'];
    if (!oreDef) return { success: false, message: 'Invalid ore type' };

    const inv = getPlayerMinerals(playerId);
    const yieldAmount = Math.floor(Math.random() * 3) + 2; // 2 to 4 ores per strike

    inv.rawOres[oreDef.id] = (inv.rawOres[oreDef.id] || 0) + yieldAmount;

    console.log(`[MINING] Player ${playerId} struck vein and mined ${yieldAmount}x ${oreDef.name}!`);
    return {
      success: true,
      message: `⛏️ Successfully extracted ${yieldAmount}x ${oreDef.name}!`,
      yieldAmount,
      currentTotal: inv.rawOres[oreDef.id]
    };
  });

  Helix.endpoint('smeltIngot', async (playerId, data) => {
    const { oreType } = data || {};
    const oreDef = ORE_TYPES[oreType];
    if (!oreDef) return { success: false, message: 'Invalid ore type' };

    const inv = getPlayerMinerals(playerId);
    const currentOre = inv.rawOres[oreDef.id] || 0;

    if (currentOre < oreDef.smeltRatio) {
      return { success: false, message: `Need at least ${oreDef.smeltRatio}x ${oreDef.name} to smelt 1x ${oreDef.refinedName}!` };
    }

    inv.rawOres[oreDef.id] -= oreDef.smeltRatio;
    inv.refinedIngots[oreDef.refinesInto] = (inv.refinedIngots[oreDef.refinesInto] || 0) + 1;

    console.log(`[FOUNDRY] Player ${playerId} smelted 1x ${oreDef.refinedName} at ${oreDef.furnaceTempRequired}°C!`);
    return {
      success: true,
      message: `🔥 Foundry Smelt Complete: 1x ${oreDef.refinedName} forged!`,
      refinedId: oreDef.refinesInto,
      refinedName: oreDef.refinedName,
      totalRefined: inv.refinedIngots[oreDef.refinesInto]
    };
  });

  global.MiningSmeltingEngine = {
    ORE_TYPES,
    getPlayerMinerals
  };
});
