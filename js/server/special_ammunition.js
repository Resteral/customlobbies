/**
 * HELIX Platform - Exotic Ammunition & Ballistic Penetration Engine
 * Handles mineral-crafted calibers, sandbox wall penetration, and special status effects.
 */

Helix.server(async () => {
  console.log('[AMMO FORGE] Initializing Special Ammunition & Ballistic Penetration Engine...');

  const AMMO_RECIPES = {
    ammo_tungsten_ap_556: {
      id: 'ammo_tungsten_ap_556',
      name: 'Tungsten AP 5.56x45mm NATO (30 Rnds)',
      caliber: '5.56x45mm NATO',
      roundsPerBox: 30,
      rarity: 'Legendary',
      description: 'Solid tungsten carbide sub-caliber penetrator. Slices through reinforced steel walls and armored SWAT plating.',
      requiredMinerals: { ingot_tungsten_carbide: 1, bar_chromium_polish: 1 },
      ballisticEffects: {
        armorPiercingMultiplier: 2.5,
        wallPenetrationLayers: 3, // Penetrates up to 3 sandbox walls
        extraDamage: +15,
        tracerColor: '#38bdf8'
      }
    },
    ammo_tungsten_ap_50bmg: {
      id: 'ammo_tungsten_ap_50bmg',
      name: 'Tungsten Sabot .50 BMG Heavy Anti-Materiel (10 Rnds)',
      caliber: '.338 Lapua Magnum',
      roundsPerBox: 10,
      rarity: 'Legendary',
      description: 'Massive tungsten penetrator that instant-breaches bank safe doors and destroys vehicle engine blocks.',
      requiredMinerals: { ingot_tungsten_carbide: 2, ingot_titanium_grade5: 1 },
      ballisticEffects: {
        armorPiercingMultiplier: 4.0,
        wallPenetrationLayers: 5,
        vehicleEngineBreaker: true,
        extraDamage: +60,
        tracerColor: '#0284c7'
      }
    },
    ammo_cobalt_emp_45: {
      id: 'ammo_cobalt_emp_45',
      name: 'Cobalt Magnetite EMP Shock .45 ACP (25 Rnds)',
      caliber: '.45 ACP Super-V',
      roundsPerBox: 25,
      rarity: 'Epic',
      description: 'Electromagnetic core cartridges that deliver high-voltage EMP arcs, disabling vehicle ignitions and CCTV cameras.',
      requiredMinerals: { core_cobalt_magnetite: 1, bar_chromium_polish: 1 },
      ballisticEffects: {
        empStunDurationSeconds: 8,
        disablesCCTV: true,
        disablesVehicleIgnition: true,
        extraDamage: +10,
        tracerColor: '#3b82f6'
      }
    },
    ammo_lithium_incendiary_12g: {
      id: 'ammo_lithium_incendiary_12g',
      name: "Lithium Dragon's Breath 12-Gauge (20 Shells)",
      caliber: '12-Gauge Flechette',
      roundsPerBox: 20,
      rarity: 'Epic',
      description: 'Pyrotechnic lithium crystal flechettes that explode into white-hot chemical fire on impact.',
      requiredMinerals: { prism_lithium_quartz: 1, bar_chromium_polish: 1 },
      ballisticEffects: {
        ignitesWoodenStructures: true,
        fireDamagePerSecond: 12,
        fireBurnDurationSeconds: 6,
        tracerColor: '#f97316'
      }
    },
    ammo_chromium_match_9mm: {
      id: 'ammo_chromium_match_9mm',
      name: 'Chromium Polished Match 9x19mm (50 Rnds)',
      caliber: '9x19mm Parabellum',
      roundsPerBox: 50,
      rarity: 'Rare',
      description: 'Low-drag precision match rounds with frictionless chromium jacket for pinpoint zero-recoil accuracy.',
      requiredMinerals: { bar_chromium_polish: 2 },
      ballisticEffects: {
        headshotMultiplier: 2.2,
        recoilReduction: 0.35,
        extraDamage: +8,
        tracerColor: '#a855f7'
      }
    }
  };

  // Player Ammo Inventory
  const PlayerAmmoStock = new Map();

  function getPlayerAmmo(playerId) {
    if (!PlayerAmmoStock.has(playerId)) {
      PlayerAmmoStock.set(playerId, {
        ammo_tungsten_ap_556: 60,
        ammo_tungsten_ap_50bmg: 20,
        ammo_cobalt_emp_45: 50,
        ammo_lithium_incendiary_12g: 40,
        ammo_chromium_match_9mm: 100
      });
    }
    return PlayerAmmoStock.get(playerId);
  }

  // --- Endpoints ---

  Helix.endpoint('getAmmoForgeData', async (playerId) => {
    const ammoStock = getPlayerAmmo(playerId);
    const minerals = global.MiningSmeltingEngine ? global.MiningSmeltingEngine.getPlayerMinerals(playerId) : null;
    return {
      success: true,
      ammoCatalog: AMMO_RECIPES,
      playerAmmo: ammoStock,
      playerMinerals: minerals ? minerals.refinedIngots : {}
    };
  });

  Helix.endpoint('craftSpecialAmmo', async (playerId, data) => {
    const { ammoId } = data || {};
    const recipe = AMMO_RECIPES[ammoId];
    if (!recipe) return { success: false, message: 'Invalid ammo recipe' };

    const minerals = global.MiningSmeltingEngine ? global.MiningSmeltingEngine.getPlayerMinerals(playerId) : null;
    if (!minerals) return { success: false, message: 'Mineral system unavailable' };

    // Check mineral requirements
    for (const [mineralId, qty] of Object.entries(recipe.requiredMinerals)) {
      const available = minerals.refinedIngots[mineralId] || 0;
      if (available < qty) {
        return { success: false, message: `Need ${qty}x ${mineralId} (You have: ${available})` };
      }
    }

    // Deduct minerals
    for (const [mineralId, qty] of Object.entries(recipe.requiredMinerals)) {
      minerals.refinedIngots[mineralId] -= qty;
    }

    const playerAmmo = getPlayerAmmo(playerId);
    playerAmmo[ammoId] = (playerAmmo[ammoId] || 0) + recipe.roundsPerBox;

    console.log(`[AMMO FORGE] Player ${playerId} crafted a box of ${recipe.roundsPerBox}x ${recipe.name}!`);
    return {
      success: true,
      message: `📦 Crafted ${recipe.roundsPerBox}x ${recipe.name}!`,
      totalRounds: playerAmmo[ammoId],
      remainingMinerals: minerals.refinedIngots
    };
  });

  Helix.endpoint('fireBallisticBullet', async (playerId, data) => {
    const { weaponId, ammoId, targetEntityId, hitLocation } = data || {};
    const ammo = AMMO_RECIPES[ammoId];

    if (!ammo) {
      return { success: true, damageDealt: 25, effect: 'Standard Ballistic Impact' };
    }

    const effects = ammo.ballisticEffects;
    let hitResult = `Hit ${targetEntityId || 'target'} with ${ammo.name}!`;

    if (effects.vehicleEngineBreaker) {
      hitResult += ' 💥 VEHICLE ENGINE CRITICALLY BREACHED!';
    }
    if (effects.empStunDurationSeconds) {
      hitResult += ` ⚡ EMP SHOCK ACTIVE: Electronics disabled for ${effects.empStunDurationSeconds}s!`;
    }
    if (effects.ignitesWoodenStructures) {
      hitResult += ' 🔥 STRUCTURE ENGULFED IN LITHIUM CHEMICAL FIRE!';
    }

    console.log(`[BALLISTICS] Player ${playerId} fired ${ammo.name} -> ${hitResult}`);
    return {
      success: true,
      damage: 40 + (effects.extraDamage || 0),
      effects,
      message: hitResult
    };
  });

  global.SpecialAmmunitionEngine = {
    AMMO_RECIPES,
    getPlayerAmmo
  };
});
