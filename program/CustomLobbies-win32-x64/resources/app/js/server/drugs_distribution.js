/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Street Dealing & Pacifica Turf Economy Engine
 * Features: Corner dealing AI, district demand multipliers, undercover cop risks, bulk cargo exports.
 */

const DrugDistribution = {
  // District Multipliers across Pacifica
  DISTRICT_DEMAND: {
    downtown_finance: {
      name: 'Downtown Financial District',
      preferredDrugs: ['cocaine_powder', 'brick', 'purple_haze', 'gelato_41'],
      priceMultiplier: 1.50, // +50% luxury markup
      policeRisk: 0.18 // High patrol presence
    },
    industrial_docks: {
      name: 'Industrial Docks & Warehouses',
      preferredDrugs: ['meth_lab', 'pure_meth', 'blue_dream', 'bulk_brick'],
      priceMultiplier: 1.40,
      policeRisk: 0.08 // Low patrol presence, high rival turf
    },
    nightlife_strip: {
      name: 'Neon Strip Commercial District',
      preferredDrugs: ['og_kush', 'party_pills', 'cocaine_powder'],
      priceMultiplier: 1.35,
      policeRisk: 0.12
    }
  },

  /**
   * Conduct a corner street deal with an NPC buyer
   */
  sellStreetDrug(playerId, drugType, quantity, districtId = 'downtown_finance') {
    const district = this.DISTRICT_DEMAND[districtId] || this.DISTRICT_DEMAND.downtown_finance;

    // Base Price Table (per unit / bag / gram)
    const basePrices = {
      og_kush: 25,
      purple_haze: 35,
      gelato_41: 45,
      blue_dream: 20,
      pure_meth: 160,
      cocaine_powder: 90,
      brick: 65000
    };

    const basePrice = basePrices[drugType] || 30;
    const isPreferred = district.preferredDrugs.includes(drugType);
    const multiplier = district.priceMultiplier * (isPreferred ? 1.2 : 1.0);
    const totalPayout = Math.floor(basePrice * quantity * multiplier);

    // Roll for Undercover Cop / Police Alert
    const copRoll = Math.random();
    if (copRoll < district.policeRisk) {
      console.warn(`[DISTRIBUTION ALERT] Undercover bust on Player ${playerId} in ${district.name}!`);
      if (typeof Helix.emit !== 'undefined') {
        Helix.emit('PoliceAlertBroadcast', {
          message: `NARCOTICS DEAL IN PROGRESS reported in ${district.name}!`,
          district: district.name,
          suspectId: playerId
        });
      }
      return {
        success: false,
        bust: true,
        message: 'Undercover Officer! The buyer pulled a badge. Flee the area!'
      };
    }

    console.log(`[DISTRIBUTION] Player ${playerId} sold ${quantity}x ${drugType} in ${district.name} for $${totalPayout}`);
    return {
      success: true,
      payout: totalPayout,
      district: district.name,
      message: `Sold ${quantity}x ${drugType} for $${totalPayout} in ${district.name}.`
    };
  },

  /**
   * Export wholesale container at Pacifica Docks
   */
  exportWholesaleCargo(playerId, cargoType, quantity = 1) {
    const wholesalePrices = {
      cocaine_brick: 65000,
      meth_crate: 45000,
      cannabis_bale: 28000
    };

    const pricePerUnit = wholesalePrices[cargoType] || 25000;
    const totalPayout = pricePerUnit * quantity;

    console.log(`[EXPORT DOCKS] Player ${playerId} loaded ${quantity}x ${cargoType} onto Pacifica Cargo Freighter -> $${totalPayout}`);
    return {
      success: true,
      payout: totalPayout,
      message: `Exported ${quantity}x ${cargoType} via Pacifica Docks. Payout: $${totalPayout.toLocaleString()}`
    };
  }
};

// Server RPC Endpoints
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[DISTRIBUTION] Initializing Street Dealing & Pacifica Turf Economy Endpoints...');

    Helix.endpoint('sellStreetCorner', async (playerId, data) => {
      const { drugType, quantity, districtId } = data || {};
      return DrugDistribution.sellStreetDrug(playerId, drugType || 'og_kush', quantity || 1, districtId || 'downtown_finance');
    });

    Helix.endpoint('exportDocksCargo', async (playerId, data) => {
      const { cargoType, quantity } = data || {};
      return DrugDistribution.exportWholesaleCargo(playerId, cargoType || 'cocaine_brick', quantity || 1);
    });

    Helix.endpoint('getDistrictDrugDemand', async () => {
      return { success: true, districts: DrugDistribution.DISTRICT_DEMAND };
    });
  });
}

if (typeof module !== 'undefined') module.exports = DrugDistribution;
