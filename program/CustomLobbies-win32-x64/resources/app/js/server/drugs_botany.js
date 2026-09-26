/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Advanced Botany & Cannabis Cultivation Engine
 * Features: Strain genetics, soil moisture, NPK nutrient balancing, grow stages, drying & curing.
 */

const CannabisBotany = {
  // Available Strains
  STRAINS: {
    og_kush: {
      id: 'og_kush',
      name: 'OG Kush (Indica Dominant)',
      growthTime: 120, // seconds in-game (scaled)
      yieldCount: 4,
      baseTHC: 22.5,
      waterUsageRate: 1.5,
      idealNPK: { n: 40, p: 30, k: 30 },
      marketValuePerGram: 25,
      color: '#22c55e'
    },
    purple_haze: {
      id: 'purple_haze',
      name: 'Purple Haze (Sativa Exotic)',
      growthTime: 180,
      yieldCount: 6,
      baseTHC: 26.0,
      waterUsageRate: 2.0,
      idealNPK: { n: 30, p: 45, k: 25 },
      marketValuePerGram: 35,
      color: '#a855f7'
    },
    gelato_41: {
      id: 'gelato_41',
      name: 'Gelato #41 (Hybrid Premium)',
      growthTime: 150,
      yieldCount: 5,
      baseTHC: 28.5,
      waterUsageRate: 1.8,
      idealNPK: { n: 35, p: 35, k: 30 },
      marketValuePerGram: 45,
      color: '#ec4899'
    },
    blue_dream: {
      id: 'blue_dream',
      name: 'Blue Dream (High-Yield Commercial)',
      growthTime: 90,
      yieldCount: 8,
      baseTHC: 19.0,
      waterUsageRate: 1.2,
      idealNPK: { n: 50, p: 25, k: 25 },
      marketValuePerGram: 20,
      color: '#38bdf8'
    }
  },

  // Active Planter Pots & Hydroponic Racks (potId -> data)
  activePlants: new Map(),
  dryingRacks: new Map(),

  /**
   * Plant a seed into a pot or hydroponic box
   */
  plantSeed(potId, strainId, playerId) {
    const strain = this.STRAINS[strainId] || this.STRAINS.og_kush;
    const plant = {
      potId,
      ownerId: playerId,
      strainId: strain.id,
      strainName: strain.name,
      stage: 'Seedling', // Seedling -> Vegetative -> Flowering -> ReadyToHarvest
      growthProgress: 0.0, // 0 to 100%
      moisture: 100.0, // 0 to 100%
      nutrients: { n: 50, p: 50, k: 50 },
      health: 100.0,
      hasLampUV: true,
      thcModifier: 1.0,
      plantedAt: Date.now()
    };

    this.activePlants.set(potId, plant);
    console.log(`[BOTANY] Player ${playerId} planted ${strain.name} in Pot #${potId}`);
    return plant;
  },

  /**
   * Water a plant pot
   */
  waterPlant(potId, amount = 40) {
    const plant = this.activePlants.get(potId);
    if (!plant) return { success: false, error: 'Plant not found' };

    plant.moisture = Math.min(100, plant.moisture + amount);
    if (plant.moisture > 95) {
      plant.health = Math.max(20, plant.health - 5); // Overwatering penalty
    }
    return { success: true, moisture: plant.moisture, health: plant.health };
  },

  /**
   * Add NPK Fertilizer to pot
   */
  fertilizePlant(potId, n = 15, p = 15, k = 15) {
    const plant = this.activePlants.get(potId);
    if (!plant) return { success: false, error: 'Plant not found' };

    plant.nutrients.n = Math.min(100, plant.nutrients.n + n);
    plant.nutrients.p = Math.min(100, plant.nutrients.p + p);
    plant.nutrients.k = Math.min(100, plant.nutrients.k + k);
    return { success: true, nutrients: plant.nutrients };
  },

  /**
   * Harvest mature plant
   */
  harvestPlant(potId) {
    const plant = this.activePlants.get(potId);
    if (!plant) return { success: false, error: 'Plant not found' };
    if (plant.growthProgress < 100) return { success: false, error: 'Plant is not ready for harvest!' };

    const strain = this.STRAINS[plant.strainId] || this.STRAINS.og_kush;
    const finalTHC = (strain.baseTHC * (plant.health / 100) * plant.thcModifier).toFixed(1);
    const harvestGrams = Math.floor(strain.yieldCount * 28 * (plant.health / 100)); // in grams (oz = 28g)

    const harvestedBatch = {
      batchId: `batch_${Date.now()}`,
      strainId: strain.id,
      strainName: strain.name,
      grams: harvestGrams,
      thc: parseFloat(finalTHC),
      quality: finalTHC >= 25 ? 'Top Shelf Exotic' : finalTHC >= 20 ? 'Premium Indoor' : 'Standard Commercial',
      isDried: false,
      curedWeeks: 0,
      estimatedValue: Math.floor(harvestGrams * strain.marketValuePerGram * (finalTHC / 20))
    };

    this.activePlants.delete(potId);
    console.log(`[BOTANY] Harvested ${harvestGrams}g of ${strain.name} (${finalTHC}% THC) - Grade: ${harvestedBatch.quality}`);
    return { success: true, batch: harvestedBatch };
  }
};

// Growth and Water Depletion Simulation Loop
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[BOTANY] Initializing Cannabis Growth & Nutrient Simulation Loop...');

    setInterval(() => {
      CannabisBotany.activePlants.forEach((plant, potId) => {
        const strain = CannabisBotany.STRAINS[plant.strainId] || CannabisBotany.STRAINS.og_kush;

        // Moisture Depletion
        plant.moisture = Math.max(0, plant.moisture - strain.waterUsageRate);

        // Nutrient Uptake
        plant.nutrients.n = Math.max(0, plant.nutrients.n - 0.5);
        plant.nutrients.p = Math.max(0, plant.nutrients.p - 0.4);
        plant.nutrients.k = Math.max(0, plant.nutrients.k - 0.4);

        // Health penalties for drought
        if (plant.moisture <= 0) {
          plant.health = Math.max(10, plant.health - 3);
        } else if (plant.moisture >= 30 && plant.moisture <= 80) {
          plant.health = Math.min(100, plant.health + 1);
        }

        // Growth Progress
        if (plant.growthProgress < 100 && plant.health > 15 && plant.moisture > 0) {
          const step = (100 / strain.growthTime) * (plant.hasLampUV ? 1.25 : 0.85);
          plant.growthProgress = Math.min(100, plant.growthProgress + step);

          // Update Growth Stage
          if (plant.growthProgress < 25) plant.stage = 'Seedling';
          else if (plant.growthProgress < 65) plant.stage = 'Vegetative Growth';
          else if (plant.growthProgress < 100) plant.stage = 'Flowering & Trichome Development';
          else plant.stage = 'Ready For Harvest';
        }
      });
    }, 1000);

    // RPC Endpoints
    Helix.endpoint('botanyPlantSeed', async (playerId, data) => {
      const { potId, strainId } = data || {};
      const plant = CannabisBotany.plantSeed(potId || `pot_${playerId}`, strainId || 'og_kush', playerId);
      return { success: true, plant };
    });

    Helix.endpoint('botanyWaterPlant', async (playerId, data) => {
      const { potId } = data || {};
      return CannabisBotany.waterPlant(potId || `pot_${playerId}`);
    });

    Helix.endpoint('botanyHarvest', async (playerId, data) => {
      const { potId } = data || {};
      return CannabisBotany.harvestPlant(potId || `pot_${playerId}`);
    });

    Helix.endpoint('botanyGetPlant', async (playerId, data) => {
      const { potId } = data || {};
      const plant = CannabisBotany.activePlants.get(potId || `pot_${playerId}`);
      return { success: true, plant: plant || null };
    });
  });
}

if (typeof module !== 'undefined') module.exports = CannabisBotany;
