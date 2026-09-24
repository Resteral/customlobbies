/**
 * HELIX Platform - Modular Weapon Gunsmith & Mineral Crafting Engine
 * Manages 6-socket modular attachment crafting, stat recalculation, and mineral foundry integration.
 */

Helix.server(async () => {
  console.log('[GUNSMITH] Initializing Modular Gunsmithing & Mineral Forge Engine...');

  const BASE_WEAPONS = {
    rifle_ar15: {
      id: 'rifle_ar15',
      name: 'M4A1 Pacifica Carbine',
      category: 'Assault Rifle',
      caliber: '5.56x45mm NATO',
      baseStats: { damage: 34, fireRate: 800, recoilControl: 65, range: 65, mobility: 70, adsSpeed: 60, armorPiercing: 25 },
      icon: '🔫'
    },
    smg_vector: {
      id: 'smg_vector',
      name: 'Vector .45 Shredder',
      category: 'Submachine Gun',
      caliber: '.45 ACP Super-V',
      baseStats: { damage: 24, fireRate: 1100, recoilControl: 55, range: 35, mobility: 90, adsSpeed: 85, armorPiercing: 15 },
      icon: '⚡'
    },
    sniper_awp: {
      id: 'sniper_awp',
      name: 'AWP .338 Heavy Precision',
      category: 'Sniper Rifle',
      caliber: '.338 Lapua Magnum',
      baseStats: { damage: 125, fireRate: 45, recoilControl: 20, range: 100, mobility: 35, adsSpeed: 30, armorPiercing: 85 },
      icon: '🎯'
    },
    shotgun_spas12: {
      id: 'shotgun_spas12',
      name: 'SPAS-12 Tactical Breacher',
      category: 'Shotgun',
      caliber: '12-Gauge Flechette',
      baseStats: { damage: 95, fireRate: 220, recoilControl: 35, range: 25, mobility: 60, adsSpeed: 50, armorPiercing: 45 },
      icon: '💥'
    },
    pistol_glock18: {
      id: 'pistol_glock18',
      name: 'Glock 18 Auto Enforcer',
      category: 'Sidearm',
      caliber: '9x19mm Parabellum',
      baseStats: { damage: 22, fireRate: 950, recoilControl: 50, range: 30, mobility: 95, adsSpeed: 90, armorPiercing: 10 },
      icon: '🔥'
    }
  };

  const ATTACHMENT_CATALOG = {
    // 1. BARREL SOCKET
    barrel_tungsten_fluted: {
      id: 'barrel_tungsten_fluted',
      slot: 'barrel',
      name: 'Tungsten Carbide Fluted Heavy Barrel',
      rarity: 'Legendary',
      description: 'Ultra-dense rifling drilled from raw tungsten ore. Drastically boosts kinetic damage and armor penetration.',
      requiredMinerals: { ingot_tungsten_carbide: 2, bar_chromium_polish: 1 },
      statModifiers: { damage: +18, range: +20, armorPiercing: +30, recoilControl: +10, mobility: -5 }
    },
    barrel_titanium_suppressor: {
      id: 'barrel_titanium_suppressor',
      slot: 'barrel',
      name: 'Grade 5 Titanium Monolithic Suppressor',
      rarity: 'Epic',
      description: 'Aerospace-grade titanium baffle stack. Complete sound/flash suppression with increased muzzle velocity.',
      requiredMinerals: { ingot_titanium_grade5: 2 },
      statModifiers: { recoilControl: +15, range: +12, mobility: +5 }
    },
    barrel_comp_chromium: {
      id: 'barrel_comp_chromium',
      slot: 'barrel',
      name: 'Chromium High-Velocity Linear Compensator',
      rarity: 'Rare',
      description: 'Mirror-polished chromium ports direct gas upward, eliminating vertical muzzle climb.',
      requiredMinerals: { bar_chromium_polish: 2 },
      statModifiers: { recoilControl: +25, adsSpeed: +5 }
    },

    // 2. OPTICS SOCKET
    optics_lithium_thermal: {
      id: 'optics_lithium_thermal',
      slot: 'optics',
      name: 'Lithium Thermal Quartz Prism Scope (3.0x)',
      rarity: 'Legendary',
      description: 'Infrared refractive crystal lens harvested from lithium geodes. Highlights heat signatures through smoke.',
      requiredMinerals: { prism_lithium_quartz: 2, ingot_titanium_grade5: 1 },
      statModifiers: { range: +20, adsSpeed: -5, armorPiercing: +5 }
    },
    optics_titanium_reflex: {
      id: 'optics_titanium_reflex',
      slot: 'optics',
      name: 'Grade 5 Titanium Micro Reflex Holo',
      rarity: 'Rare',
      description: 'Lightweight titanium housing with a crisp 1.5 MOA illuminated reticle.',
      requiredMinerals: { ingot_titanium_grade5: 1, prism_lithium_quartz: 1 },
      statModifiers: { adsSpeed: +15, mobility: +5 }
    },
    optics_lithium_ballistic_8x: {
      id: 'optics_lithium_ballistic_8x',
      slot: 'optics',
      name: 'Lithium Ballistic Precision 8x High-Power Scope',
      rarity: 'Epic',
      description: 'Multi-coated quartz optical array calibrated for extreme distance ballistic targeting.',
      requiredMinerals: { prism_lithium_quartz: 3 },
      statModifiers: { range: +35, adsSpeed: -15, armorPiercing: +10 }
    },

    // 3. RECEIVER SOCKET
    receiver_titanium_skeleton: {
      id: 'receiver_titanium_skeleton',
      slot: 'receiver',
      name: 'Grade 5 Titanium Skeletonized Upper/Lower',
      rarity: 'Legendary',
      description: 'Lightweight machined titanium frame offering lightning-fast weapon handling and draw speed.',
      requiredMinerals: { ingot_titanium_grade5: 3 },
      statModifiers: { adsSpeed: +25, mobility: +20, recoilControl: -5 }
    },
    receiver_tungsten_heavy: {
      id: 'receiver_tungsten_heavy',
      slot: 'receiver',
      name: 'Tungsten Heavy Reinforced Receiver',
      rarity: 'Epic',
      description: 'Heavy tungsten ballast upper that absorbs recoil vibrations for laser-flat automatic fire.',
      requiredMinerals: { ingot_tungsten_carbide: 3 },
      statModifiers: { recoilControl: +30, damage: +5, mobility: -10 }
    },

    // 4. MAGAZINE SOCKET
    mag_tungsten_drum: {
      id: 'mag_tungsten_drum',
      slot: 'magazine',
      name: 'Tungsten 60-Round Quad-Stack AP Drum',
      rarity: 'Legendary',
      description: 'Extended drum feeding tungsten core armor-piercing rounds. Pierces heavy body armor and SWAT shields.',
      requiredMinerals: { ingot_tungsten_carbide: 2, bar_chromium_polish: 1 },
      statModifiers: { armorPiercing: +35, damage: +10, adsSpeed: -10, mobility: -8 }
    },
    mag_titanium_light: {
      id: 'mag_titanium_light',
      slot: 'magazine',
      name: 'Titanium Fast-Mag 45-Round Extended',
      rarity: 'Rare',
      description: 'Beveled titanium feed lips for ultra-fast magazine swaps and increased bullet reserve.',
      requiredMinerals: { ingot_titanium_grade5: 2 },
      statModifiers: { adsSpeed: +10, mobility: +8 }
    },

    // 5. UNDERBARREL SOCKET
    underbarrel_cobalt_gauss: {
      id: 'underbarrel_cobalt_gauss',
      slot: 'underbarrel',
      name: 'Cobalt Magnetite Gauss Velocity Rail',
      rarity: 'Legendary',
      description: 'Electromagnetic rail channel forged from cobalt magnetite core. Accelerates bullets to hyper-sonic speeds.',
      requiredMinerals: { core_cobalt_magnetite: 2, ingot_tungsten_carbide: 1 },
      statModifiers: { damage: +25, range: +30, armorPiercing: +20, recoilControl: -5 }
    },
    underbarrel_titanium_grip: {
      id: 'underbarrel_titanium_grip',
      slot: 'underbarrel',
      name: 'Titanium Billet Ergonomic Angled Grip',
      rarity: 'Uncommon',
      description: 'CNC-milled angled foregrip that optimizes wrist angle and reduces weapon kick.',
      requiredMinerals: { ingot_titanium_grade5: 1 },
      statModifiers: { recoilControl: +20, adsSpeed: +8 }
    },

    // 6. STOCK SOCKET
    stock_chromium_rapid_buffer: {
      id: 'stock_chromium_rapid_buffer',
      slot: 'stock',
      name: 'Polished Chromium High-RPM Buffer Assembly',
      rarity: 'Epic',
      description: 'Zero-friction chromium spring tube that unlocks hyper-fast cyclic firing rate.',
      requiredMinerals: { bar_chromium_polish: 2 },
      statModifiers: { fireRate: +220, recoilControl: -10, adsSpeed: +5 }
    },
    stock_titanium_tactical: {
      id: 'stock_titanium_tactical',
      slot: 'stock',
      name: 'Grade 5 Titanium CQB Folding Stock',
      rarity: 'Rare',
      description: 'Ultra-compact folding stock tailored for rapid urban engagements and sprint-to-fire speed.',
      requiredMinerals: { ingot_titanium_grade5: 2 },
      statModifiers: { mobility: +22, adsSpeed: +18, recoilControl: -5 }
    }
  };

  // Player Weapon Loadouts (playerId -> { selectedWeaponId, weapons: { [weaponId]: { attachments: { [slot]: attachmentId } } }, craftedAttachments: [attachmentId] })
  const PlayerWeaponLoadouts = new Map();

  function getPlayerLoadout(playerId) {
    if (!PlayerWeaponLoadouts.has(playerId)) {
      PlayerWeaponLoadouts.set(playerId, {
        selectedWeaponId: 'rifle_ar15',
        weapons: {
          rifle_ar15: { attachments: { barrel: 'barrel_titanium_suppressor', optics: 'optics_titanium_reflex' } },
          smg_vector: { attachments: {} },
          sniper_awp: { attachments: { optics: 'optics_lithium_ballistic_8x' } },
          shotgun_spas12: { attachments: {} },
          pistol_glock18: { attachments: {} }
        },
        craftedAttachments: [
          'barrel_titanium_suppressor',
          'optics_titanium_reflex',
          'optics_lithium_ballistic_8x'
        ]
      });
    }
    return PlayerWeaponLoadouts.get(playerId);
  }

  function calculateWeaponStats(weaponId, attachments) {
    const base = BASE_WEAPONS[weaponId];
    if (!base) return null;

    const stats = { ...base.baseStats };

    Object.values(attachments).forEach(attId => {
      const att = ATTACHMENT_CATALOG[attId];
      if (att && att.statModifiers) {
        Object.entries(att.statModifiers).forEach(([key, val]) => {
          if (typeof stats[key] !== 'undefined') {
            stats[key] = Math.max(5, stats[key] + val);
          }
        });
      }
    });

    return stats;
  }

  // --- Endpoints ---

  Helix.endpoint('getGunsmithData', async (playerId) => {
    const loadout = getPlayerLoadout(playerId);
    const minerals = global.MiningSmeltingEngine ? global.MiningSmeltingEngine.getPlayerMinerals(playerId) : { rawOres: {}, refinedIngots: {} };
    
    // Calculate stats for each weapon
    const weaponData = {};
    Object.keys(BASE_WEAPONS).forEach(wId => {
      const wLoadout = loadout.weapons[wId] || { attachments: {} };
      weaponData[wId] = {
        ...BASE_WEAPONS[wId],
        equippedAttachments: wLoadout.attachments,
        currentStats: calculateWeaponStats(wId, wLoadout.attachments)
      };
    });

    return {
      success: true,
      selectedWeaponId: loadout.selectedWeaponId,
      weapons: weaponData,
      attachmentCatalog: ATTACHMENT_CATALOG,
      craftedAttachments: loadout.craftedAttachments,
      playerMinerals: minerals
    };
  });

  Helix.endpoint('craftGunsmithAttachment', async (playerId, data) => {
    const { attachmentId } = data || {};
    const att = ATTACHMENT_CATALOG[attachmentId];
    if (!att) return { success: false, message: 'Invalid attachment ID' };

    const loadout = getPlayerLoadout(playerId);
    const minerals = global.MiningSmeltingEngine ? global.MiningSmeltingEngine.getPlayerMinerals(playerId) : null;

    if (!minerals) return { success: false, message: 'Mineral engine not initialized' };

    // Check mineral costs
    for (const [mineralId, qty] of Object.entries(att.requiredMinerals)) {
      const available = minerals.refinedIngots[mineralId] || 0;
      if (available < qty) {
        return {
          success: false,
          message: `Insufficient refined mineral! Need ${qty}x ${mineralId} (You have: ${available})`
        };
      }
    }

    // Deduct minerals
    for (const [mineralId, qty] of Object.entries(att.requiredMinerals)) {
      minerals.refinedIngots[mineralId] -= qty;
    }

    loadout.craftedAttachments.push(att.id);

    console.log(`[GUNSMITH] Player ${playerId} forged custom attachment '${att.name}'!`);
    return {
      success: true,
      message: `🔨 Successfully forged '${att.name}' at the Gunsmith Foundry!`,
      attachment: att,
      remainingMinerals: minerals.refinedIngots
    };
  });

  Helix.endpoint('equipGunsmithAttachment', async (playerId, data) => {
    const { weaponId, attachmentId } = data || {};
    const att = ATTACHMENT_CATALOG[attachmentId];
    const baseW = BASE_WEAPONS[weaponId];
    if (!att || !baseW) return { success: false, message: 'Invalid weapon or attachment' };

    const loadout = getPlayerLoadout(playerId);
    if (!loadout.craftedAttachments.includes(attachmentId)) {
      return { success: false, message: 'You must craft this attachment first!' };
    }

    if (!loadout.weapons[weaponId]) {
      loadout.weapons[weaponId] = { attachments: {} };
    }

    loadout.weapons[weaponId].attachments[att.slot] = att.id;
    const newStats = calculateWeaponStats(weaponId, loadout.weapons[weaponId].attachments);

    console.log(`[GUNSMITH] Player ${playerId} mounted '${att.name}' onto [${baseW.name}]`);
    return {
      success: true,
      message: `⚙️ Mounted ${att.name} onto ${baseW.name}!`,
      equippedAttachments: loadout.weapons[weaponId].attachments,
      newStats
    };
  });

  Helix.endpoint('unequipGunsmithAttachment', async (playerId, data) => {
    const { weaponId, slot } = data || {};
    const baseW = BASE_WEAPONS[weaponId];
    if (!baseW) return { success: false, message: 'Invalid weapon' };

    const loadout = getPlayerLoadout(playerId);
    if (loadout.weapons[weaponId] && loadout.weapons[weaponId].attachments[slot]) {
      delete loadout.weapons[weaponId].attachments[slot];
    }

    const newStats = calculateWeaponStats(weaponId, (loadout.weapons[weaponId] || {}).attachments || {});

    return {
      success: true,
      message: `Removed ${slot} attachment from ${baseW.name}`,
      equippedAttachments: (loadout.weapons[weaponId] || {}).attachments || {},
      newStats
    };
  });

  global.WeaponGunsmithEngine = {
    BASE_WEAPONS,
    ATTACHMENT_CATALOG,
    calculateWeaponStats,
    getPlayerLoadout
  };
});
