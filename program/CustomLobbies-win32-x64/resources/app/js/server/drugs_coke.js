/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Cocaine Extraction & Hydraulic Brick Pressing System
 * Features: Raw leaf maceration, solvent reduction, hydrochloric crystallization, and 1kg stamped brick pressing.
 */

const CocaineRefinery = {
  activePresses: new Map(),

  STAMPS: ['Golden Scorpion', 'Crown Diamond', 'Black Pegasus', 'Pacifica Eagle'],

  /**
   * Process raw coca leaves into paste
   */
  processLeaves(playerId, leavesCount = 20) {
    if (leavesCount < 10) return { success: false, error: 'Requires at least 10x Coca Leaf Bundles' };

    const pasteGrams = Math.floor(leavesCount * 12.5); // 10 bundles = 125g base paste
    console.log(`[COCAINE REFINERY] Player ${playerId} extracted ${pasteGrams}g of coca paste.`);
    return {
      success: true,
      product: 'coca_paste',
      grams: pasteGrams,
      message: `Extracted ${pasteGrams}g of Coca Base Paste.`
    };
  },

  /**
   * Refine paste into pure Cocaine HCl Powder
   */
  refineToPowder(playerId, pasteGrams) {
    if (pasteGrams < 50) return { success: false, error: 'Requires at least 50g Coca Base Paste' };

    const powderGrams = Math.floor(pasteGrams * 0.82); // 82% refinement yield
    const purity = Math.floor(Math.random() * 15) + 85; // 85% - 99% pure

    console.log(`[COCAINE REFINERY] Player ${playerId} crystallized ${powderGrams}g of Cocaine Powder (${purity}% purity).`);
    return {
      success: true,
      product: 'cocaine_powder',
      grams: powderGrams,
      purity,
      estimatedValue: powderGrams * 80
    };
  },

  /**
   * Compress powder into a 1kg Stamped Wholesale Brick
   */
  stampBrick(playerId, powderGrams, stampName) {
    if (powderGrams < 1000) {
      return { success: false, error: 'Requires 1,000g (1kg) of pure powder to press a wholesale brick!' };
    }

    const selectedStamp = stampName || this.STAMPS[Math.floor(Math.random() * this.STAMPS.length)];
    const brick = {
      brickId: `brick_${Date.now()}`,
      weightKg: 1.0,
      stamp: selectedStamp,
      quality: 'Export Grade 99%',
      wholesaleValue: 65000, // $65,000 per 1kg brick
      pressedBy: playerId,
      createdAt: new Date().toISOString()
    };

    console.log(`[COCAINE REFINERY] Player ${playerId} pressed a 1kg '${selectedStamp}' Cocaine Brick -> Value: $${brick.wholesaleValue}`);
    return { success: true, brick };
  }
};

// Server RPC Endpoints
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[COCAINE REFINERY] Initializing Extraction & Hydraulic Press Endpoints...');

    Helix.endpoint('cokeProcessLeaves', async (playerId, data) => {
      const { count } = data || {};
      return CocaineRefinery.processLeaves(playerId, count || 20);
    });

    Helix.endpoint('cokeRefinePowder', async (playerId, data) => {
      const { grams } = data || {};
      return CocaineRefinery.refineToPowder(playerId, grams || 100);
    });

    Helix.endpoint('cokePressBrick', async (playerId, data) => {
      const { grams, stamp } = data || {};
      return CocaineRefinery.stampBrick(playerId, grams || 1000, stamp);
    });
  });
}

if (typeof module !== 'undefined') module.exports = CocaineRefinery;
