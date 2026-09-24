/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Advanced 4-Stage Chemical Meth Synthesis Laboratory Engine
 * Features: Thermal drift, pressure balances, pH titration, hazardous fumes, explosion triggers, purity grading.
 */

const MethLabEngine = {
  activeLabs: new Map(), // labId -> labData

  STAGES: {
    1: 'Precursor Reagent Dissolution',
    2: 'Reflux Distillation & Reaction',
    3: 'Acid-Base pH Crystallization',
    4: 'Acetone Wash & Vacuum Packaging'
  },

  /**
   * Start a new synthesis cook cycle
   */
  startSynthesis(labId, playerId) {
    const lab = {
      labId,
      ownerId: playerId,
      isCooking: true,
      stage: 1, // 1 to 4
      temperature: 24.0, // Ambient Celsius
      targetTempMin: 78.0,
      targetTempMax: 92.0,
      pressurePSI: 14.7, // Atmospheric PSI
      pH: 4.2, // Acidic precursor
      targetPHMin: 6.8,
      targetPHMax: 7.4,
      stirrerRPM: 0,
      condenserWaterOn: true,
      ventilationActive: true,
      toxicGasPPM: 0,
      purity: 100.0, // Degrades if handled improperly
      progress: 0.0,
      startedAt: Date.now()
    };

    this.activeLabs.set(labId, lab);
    console.log(`[METH LAB] Initialized 4-Stage Synthesis on Lab #${labId} for Player ${playerId}`);
    return lab;
  },

  /**
   * Adjust lab controls (heat, cool, stirrer, pH buffer, condenser)
   */
  controlAction(labId, action, value) {
    const lab = this.activeLabs.get(labId);
    if (!lab || !lab.isCooking) return { success: false, error: 'No active synthesis.' };

    switch (action) {
      case 'heat':
        lab.temperature = Math.min(160, lab.temperature + 12);
        lab.pressurePSI = Math.min(60, lab.pressurePSI + 2.5);
        break;
      case 'cool':
        lab.temperature = Math.max(15, lab.temperature - 12);
        lab.pressurePSI = Math.max(14.7, lab.pressurePSI - 2.0);
        break;
      case 'toggle_stirrer':
        lab.stirrerRPM = lab.stirrerRPM > 0 ? 0 : 450;
        break;
      case 'add_base_buffer': // Raises pH
        lab.pH = Math.min(14.0, parseFloat((lab.pH + 0.6).toFixed(1)));
        break;
      case 'add_acid_buffer': // Lowers pH
        lab.pH = Math.max(1.0, parseFloat((lab.pH - 0.6).toFixed(1)));
        break;
      case 'toggle_ventilation':
        lab.ventilationActive = !lab.ventilationActive;
        break;
    }

    return { success: true, lab };
  },

  /**
   * Finish and package final product
   */
  packageBatch(labId) {
    const lab = this.activeLabs.get(labId);
    if (!lab) return { success: false, error: 'Lab not found' };
    if (lab.stage < 4 || lab.progress < 100) {
      return { success: false, error: 'Synthesis batch is not ready for packaging!' };
    }

    const finalPurity = Math.max(30, Math.min(100, Math.floor(lab.purity)));
    const baggiesCount = Math.floor(20 * (finalPurity / 100));
    const pricePerBag = Math.floor(150 * (finalPurity / 80));

    const batchData = {
      batchId: `meth_${Date.now()}`,
      purity: finalPurity,
      grade: finalPurity >= 98 ? '99.1% Pure Blue Crystal' : finalPurity >= 85 ? 'High Grade Glass' : finalPurity >= 65 ? 'Street Grade Crystal' : 'Cloudy Low Grade',
      bags: baggiesCount,
      grams: baggiesCount * 3.5, // 3.5g per baggie
      totalValue: baggiesCount * pricePerBag
    };

    lab.isCooking = false;
    this.activeLabs.delete(labId);
    console.log(`[METH LAB] Completed batch on Lab #${labId}: ${batchData.bags}x Bags (${batchData.purity}% Purity - ${batchData.grade}) -> $${batchData.totalValue}`);
    return { success: true, batch: batchData };
  }
};

// Chemical Synthesis Tick Simulation Loop
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[METH LAB] Initializing Chemical Thermodynamic & Purity Simulation Loop...');

    setInterval(() => {
      MethLabEngine.activeLabs.forEach((lab, labId) => {
        if (!lab.isCooking) return;

        // Natural Temperature Drift (Toward 30C if unheated)
        if (lab.temperature > 30) {
          lab.temperature = Math.max(30, lab.temperature - 0.5);
        }

        // Pressure Dynamics based on Temperature
        if (lab.temperature > 85) {
          lab.pressurePSI = Math.min(65, lab.pressurePSI + 0.3);
        } else if (lab.pressurePSI > 14.7) {
          lab.pressurePSI = Math.max(14.7, lab.pressurePSI - 0.2);
        }

        // Toxic Gas Buildup if ventilation off
        if (!lab.ventilationActive) {
          lab.toxicGasPPM = Math.min(500, lab.toxicGasPPM + 5);
        } else {
          lab.toxicGasPPM = Math.max(0, lab.toxicGasPPM - 10);
        }

        // CATASTROPHIC THERMAL RUNAWAY EXPLOSION (>135 C or >50 PSI)
        if (lab.temperature >= 135.0 || lab.pressurePSI >= 50.0) {
          lab.isCooking = false;
          console.error(`[METH LAB EXPLOSION] Lab #${labId} blew up from thermal runaway! (${lab.temperature.toFixed(1)}°C, ${lab.pressurePSI.toFixed(1)} PSI)`);
          
          if (typeof Helix.emit !== 'undefined') {
            Helix.emit('ExplosionAtLocation', { labId, temperature: lab.temperature });
            Helix.emit('PoliceAlertBroadcast', { message: `HAZMAT EXPLOSION detected at clandestine lab #${labId}!` });
          }
          MethLabEngine.activeLabs.delete(labId);
          return;
        }

        // Purity Calculation & Stage Progression
        const inSafeTempWindow = lab.temperature >= lab.targetTempMin && lab.temperature <= lab.targetTempMax;
        const inSafePHWindow = lab.pH >= lab.targetPHMin && lab.pH <= lab.targetPHMax;

        if (lab.stage === 2) { // Reflux stage requires safe temp
          if (!inSafeTempWindow) {
            lab.purity = Math.max(25, lab.purity - 0.4); // Burn / undercook degradation
          }
        } else if (lab.stage === 3) { // Crystallization requires pH balance
          if (!inSafePHWindow) {
            lab.purity = Math.max(25, lab.purity - 0.5);
          }
        }

        // Advance Progress
        lab.progress = Math.min(100, lab.progress + (inSafeTempWindow ? 2.5 : 1.0));

        // Auto Advance Stages
        if (lab.progress >= 100) {
          if (lab.stage < 4) {
            lab.stage += 1;
            lab.progress = 0;
            console.log(`[METH LAB] Lab #${labId} advanced to Stage ${lab.stage}: ${MethLabEngine.STAGES[lab.stage]}`);
          }
        }
      });
    }, 1000);

    // RPC Endpoints
    Helix.endpoint('methStartCook', async (playerId, data) => {
      const { labId } = data || {};
      const lab = MethLabEngine.startSynthesis(labId || `lab_${playerId}`, playerId);
      return { success: true, lab };
    });

    Helix.endpoint('methControl', async (playerId, data) => {
      const { labId, action, value } = data || {};
      return MethLabEngine.controlAction(labId || `lab_${playerId}`, action, value);
    });

    Helix.endpoint('methPackage', async (playerId, data) => {
      const { labId } = data || {};
      return MethLabEngine.packageBatch(labId || `lab_${playerId}`);
    });

    Helix.endpoint('methGetStatus', async (playerId, data) => {
      const { labId } = data || {};
      const lab = MethLabEngine.activeLabs.get(labId || `lab_${playerId}`);
      return { success: true, lab: lab || null };
    });
  });
}

if (typeof module !== 'undefined') module.exports = MethLabEngine;
