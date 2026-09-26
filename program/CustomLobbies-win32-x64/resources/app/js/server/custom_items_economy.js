/**
 * HELIX Platform - Expanded Chemical Precursors, Botanical Supplies & Contraband Economy
 * Master item definitions, synthesis recipes, crafting stations, and wholesale values.
 */

Helix.server(async () => {
  console.log('[ITEMS ECONOMY] Initializing Master Contraband & Precursor Catalog...');

  const ITEM_DATABASE = {
    // Chemical Precursors
    precursor_p2p: {
      id: 'precursor_p2p',
      name: 'Phenyl-2-Propanone (P2P) Drum (25L)',
      category: 'Chemical Precursor',
      tier: 'Class A Controlled',
      baseCost: 2800,
      description: 'Essential primary organic ketone catalyst for Heisenberg Blue methamphetamine synthesis.'
    },
    precursor_methylamine: {
      id: 'precursor_methylamine',
      name: 'Industrial Methylamine Gas Cylinder',
      category: 'Chemical Precursor',
      tier: 'Class A Controlled',
      baseCost: 1950,
      description: 'Pressurized amine gas required for high-yield reductive amination.'
    },
    acid_sulfuric: {
      id: 'acid_sulfuric',
      name: 'Reagent-Grade Sulfuric Acid (98%)',
      category: 'Chemical Reagent',
      tier: 'Industrial',
      baseCost: 450,
      description: 'Highly corrosive mineral acid used in coca paste maceration and crystallization.'
    },
    solvent_acetone: {
      id: 'solvent_acetone',
      name: 'High-Purity Anhydrous Acetone (20L)',
      category: 'Chemical Solvent',
      tier: 'Industrial',
      baseCost: 320,
      description: 'Used in final crystal wash recrystallization for 99%+ purity clarity.'
    },

    // Botanical Supplies
    nutrient_super_bloom: {
      id: 'nutrient_super_bloom',
      name: 'NPK Super Bloom Formula (10-30-20)',
      category: 'Botany Supply',
      tier: 'Commercial',
      baseCost: 180,
      description: 'High-phosphorus mineral blend that doubles trichome resin density during flowering.'
    },
    co2_canister: {
      id: 'co2_canister',
      name: 'Compressed CO2 Grow Enrichment Tank',
      category: 'Botany Supply',
      tier: 'Commercial',
      baseCost: 240,
      description: 'Elevates ambient grow room CO2 to 1500ppm, accelerating growth rate by +30%.'
    },

    // Finished Manufactured Contraband
    contraband_blue_meth_tray: {
      id: 'contraband_blue_meth_tray',
      name: '500g Heisenberg Blue Crystal Tray (99.1%)',
      category: 'Manufactured Drug',
      tier: 'Pure Grade',
      wholesaleValue: 38000,
      description: 'Ultra-pure sapphire crystal shards. Highest market value in Pacifica.'
    },
    contraband_coke_brick_1kg: {
      id: 'contraband_coke_brick_1kg',
      name: '1kg Stamped Hydraulic Cocaine Brick',
      category: 'Manufactured Drug',
      tier: 'Cartel Grade',
      wholesaleValue: 65000,
      description: 'Vacuum-sealed 1-kilogram brick stamped with cartel scorpion seal.'
    },
    contraband_top_shelf_ounce: {
      id: 'contraband_top_shelf_ounce',
      name: '1oz Diamond-Cured Top Shelf Cannabis Bag',
      category: 'Manufactured Drug',
      tier: 'Connoisseur',
      wholesaleValue: 650,
      description: 'Heat-sealed Mylar bag containing dense 32% THC frosted flower.'
    },
    contraband_shatter_cartridge: {
      id: 'contraband_shatter_cartridge',
      name: 'Pure Hash Rosin Shatter Cartridge (0.5g)',
      category: 'Manufactured Drug',
      tier: 'Extract',
      wholesaleValue: 120,
      description: 'Solventless ice-water hash extract with 88% concentrated cannabinoids.'
    }
  };

  // --- Endpoints ---

  Helix.endpoint('getItemCatalog', async () => {
    return { success: true, items: Object.values(ITEM_DATABASE) };
  });

  Helix.endpoint('purchasePrecursor', async (playerId, data) => {
    const { itemId, quantity } = data || {};
    const item = ITEM_DATABASE[itemId];
    if (!item) return { success: false, message: 'Invalid item ID' };

    const qty = parseInt(quantity || 1, 10);
    const totalCost = item.baseCost * qty;

    console.log(`[BLACK MARKET] Player ${playerId} purchased ${qty}x ${item.name} for $${totalCost.toLocaleString()}`);
    return {
      success: true,
      message: `Purchased ${qty}x ${item.name} for $${totalCost.toLocaleString()}! Delivered to nearest drop locker.`,
      item,
      quantity: qty,
      totalCost
    };
  });

  global.ItemCatalogEngine = {
    ITEM_DATABASE
  };
});
