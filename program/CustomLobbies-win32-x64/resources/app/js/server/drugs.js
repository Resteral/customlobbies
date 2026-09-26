/**
 * HELIX Platform - Drugs Cultivation & Meth Synthesis Server Module
 */

Helix.server(async () => {
  const pots = new Map();
  const methLabs = new Map();

  // Weed Pot Growth Loop
  setInterval(() => {
    pots.forEach((pot, id) => {
      if (pot.hasSeed && pot.growth < 100) {
        if (pot.water > 0) {
          pot.water = Math.max(0, pot.water - 2);
          pot.growth = Math.min(100, pot.growth + 5);
        }
      }
    });
  }, 3000);

  // Meth Cooking Loop
  setInterval(() => {
    methLabs.forEach((lab, id) => {
      if (lab.isCooking) {
        // Temperature Drift
        if (lab.temperature < 85) {
          lab.temperature += Math.floor(Math.random() * 3) + 1;
        } else {
          lab.temperature += Math.floor(Math.random() * 5) + 2;
        }

        // Overheat Explosion Hazard
        if (lab.temperature >= 130) {
          lab.isCooking = false;
          Helix.emit('ExplosionAtLocation', lab.location);
          console.log(`[METH LAB EXPLOSION] Lab ${id} exploded due to high heat!`);
          return;
        }

        // Purity Penalty outside safe window (75 - 95 C)
        if (lab.temperature < 70 || lab.temperature > 100) {
          lab.purity = Math.max(30, lab.purity - 2);
        }

        lab.progress = Math.min(100, lab.progress + 4);
        if (lab.progress >= 100) {
          lab.isCooking = false;
          console.log(`[METH LAB READY] Batch completed with ${lab.purity}% purity!`);
        }
      }
    });
  }, 1000);

  Helix.endpoint('cookMethAction', async (labId, action) => {
    const lab = methLabs.get(labId) || { temperature: 25, progress: 0, purity: 99, isCooking: false };
    if (action === 'start') {
      lab.isCooking = true;
      lab.progress = 0;
      lab.purity = 99;
    } else if (action === 'heat') {
      lab.temperature = Math.min(150, lab.temperature + 15);
    } else if (action === 'cool') {
      lab.temperature = Math.max(10, lab.temperature - 15);
    }
    methLabs.set(labId, lab);
    return lab;
  });
});
