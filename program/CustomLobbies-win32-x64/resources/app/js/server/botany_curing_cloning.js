/**
 * HELIX Platform - Botany Phenotype Cloning, Mother Plants & Trichome Curing Jars
 * Adds deep botanical progression:
 *  - Cloning Shears & Mother Plant propagation (perpetual genetic clones)
 *  - Cross-Breeding Strains to create custom Pacifica Hybrids (e.g. 'Purple OG #1')
 *  - Wooden Mesh Drying Racks (48-hour moisture extraction)
 *  - Sealed Glass Curing Jars (Terpene aging from Fresh -> Cured -> Top Shelf Connoisseur 35%+ THC)
 */

Helix.server(async () => {
  console.log('[BOTANY EXTENSION] Initializing Plant Cloning, Genetic Cross-Breeding & Terpene Curing...');

  const CuringJars = new Map();
  const MotherPlants = new Map();

  const CURING_STAGES = [
    { days: 0, grade: 'Fresh Wet Harvest', valueMultiplier: 0.6, thcModifier: 0 },
    { days: 3, grade: 'Rack Dried', valueMultiplier: 1.0, thcModifier: 1.0 },
    { days: 7, grade: 'Jar Cured (Silver)', valueMultiplier: 1.4, thcModifier: 1.05 },
    { days: 14, grade: 'Aged Trichome (Gold)', valueMultiplier: 1.8, thcModifier: 1.12 },
    { days: 28, grade: 'Top Shelf Connoisseur (Diamond)', valueMultiplier: 2.5, thcModifier: 1.25 }
  ];

  // --- Endpoints ---

  Helix.endpoint('takePlantCutting', async (playerId, data) => {
    const { plantId, strain } = data || {};
    const cuttingId = `clone_${Date.now()}`;

    const cloneData = {
      id: cuttingId,
      motherStrain: strain || 'OG Kush',
      rootHealth: 100,
      geneticsQuality: (Math.random() * 0.2 + 0.9).toFixed(2), // 0.90x to 1.10x genetic bonus
      clonedBy: playerId,
      readyToPlant: true
    };

    MotherPlants.set(cuttingId, cloneData);
    console.log(`[BOTANY] Player ${playerId} took genetic clone cutting from ${strain} (Quality: ${cloneData.geneticsQuality}x)`);

    return {
      success: true,
      message: `Took 1x High-Viability Rooted Clone Cutting of ${strain}!`,
      clone: cloneData
    };
  });

  Helix.endpoint('crossBreedStrains', async (playerId, data) => {
    const { femaleStrain, maleStrain } = data || {};
    if (!femaleStrain || !maleStrain) return { success: false, message: 'Select two parent strains' };

    const hybridName = `${femaleStrain.split(' ')[0]} x ${maleStrain.split(' ')[0]} Hybrid`;
    const hybridThc = (Math.random() * 6.0 + 26.0).toFixed(1); // 26% to 32% THC potential

    const newSeed = {
      seedId: `hybrid_${Date.now()}`,
      name: hybridName,
      thcPotential: parseFloat(hybridThc),
      floweringTimeDays: 7,
      breeder: playerId
    };

    console.log(`[BOTANY] Player ${playerId} created new hybrid cross: ${hybridName} (${hybridThc}% THC)`);
    return {
      success: true,
      message: `Cross-breeding successful! Created new hybrid seed: "${hybridName}" (${hybridThc}% THC)`,
      seed: newSeed
    };
  });

  Helix.endpoint('startJarCuring', async (playerId, data) => {
    const { harvestId, strain, wetGrams, baseThc } = data || {};
    const jarId = `jar_${Date.now()}`;

    const jarData = {
      jarId,
      strain: strain || 'OG Kush',
      grams: wetGrams || 250,
      baseThc: baseThc || 22.0,
      currentStageIndex: 0,
      curingDays: 0,
      ownerId: playerId,
      startedAt: Date.now()
    };

    CuringJars.set(jarId, jarData);
    console.log(`[BOTANY] Player ${playerId} placed ${wetGrams}g of ${strain} into sealed glass curing jar.`);

    return {
      success: true,
      message: `Harvest sealed in glass curing jar. Terpenes are aging...`,
      jar: jarData
    };
  });

  Helix.endpoint('inspectCuringJars', async (playerId) => {
    const playerJars = [];
    CuringJars.forEach(jar => {
      if (jar.ownerId === playerId) {
        const stage = CURING_STAGES[jar.currentStageIndex];
        playerJars.push({
          ...jar,
          currentGrade: stage.grade,
          estimatedValuePerGram: (20 * stage.valueMultiplier).toFixed(2),
          totalValue: (jar.grams * 20 * stage.valueMultiplier).toFixed(0),
          currentThc: (jar.baseThc * stage.thcModifier).toFixed(1)
        });
      }
    });

    return { success: true, jars: playerJars };
  });

  // Background aging loop (Simulated fast time for sandbox)
  setInterval(() => {
    CuringJars.forEach(jar => {
      if (jar.currentStageIndex < CURING_STAGES.length - 1) {
        jar.curingDays += 1;
        if (jar.curingDays >= CURING_STAGES[jar.currentStageIndex + 1].days) {
          jar.currentStageIndex += 1;
          const stage = CURING_STAGES[jar.currentStageIndex];
          console.log(`[BOTANY AGING] Jar ${jar.jarId} (${jar.strain}) evolved to: [${stage.grade}]!`);
          Helix.emit('jarCuredToNextGrade', { jarId: jar.jarId, grade: stage.grade });
        }
      }
    });
  }, 10000);

  global.BotanyGenetics = {
    CuringJars,
    MotherPlants,
    CURING_STAGES
  };
});
