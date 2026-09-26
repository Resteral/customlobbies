/**
 * HELIX Platform - Player Businesses & Money Laundering Server Module
 * Allows players to buy/own businesses, hire staff, launder illegal CL-Points, and collect legal revenue.
 */

Helix.server(async () => {
  console.log('[HELIX BUSINESS SYSTEM] Initializing Player Business Module...');

  const businesses = new Map([
    ['nightclub_1', { id: 'nightclub_1', name: 'Velvet Lounge Nightclub', type: 'Nightclub', price: 25000, owner: null, employees: [], vaultDirty: 0, vaultClean: 5000, launderFee: 0.15, suspicion: 0 }],
    ['pawn_1', { id: 'pawn_1', name: 'Downtown Pawn & Vault', type: 'Pawn Shop', price: 15000, owner: null, employees: [], vaultDirty: 0, vaultClean: 2500, launderFee: 0.20, suspicion: 0 }],
    ['chopshop_1', { id: 'chopshop_1', name: 'Apex Auto Chop & Repair', type: 'Chop Shop', price: 20000, owner: null, employees: [], vaultDirty: 0, vaultClean: 3500, launderFee: 0.18, suspicion: 0 }],
    ['arcade_1', { id: 'arcade_1', name: 'Neon Cyber Arcade', type: 'Arcade', price: 30000, owner: null, employees: [], vaultDirty: 0, vaultClean: 8000, launderFee: 0.12, suspicion: 0 }]
  ]);

  // Passive Legal Revenue & Money Laundering Cycle
  setInterval(() => {
    businesses.forEach((biz) => {
      if (biz.owner) {
        // Legal passive income tick
        const legalRevenue = Math.floor(Math.random() * 150) + 50;
        biz.vaultClean += legalRevenue;

        // Launder Black Market Rep tick if present
        if (biz.vaultDirty > 0) {
          const launderAmount = Math.min(biz.vaultDirty, 500);
          const fee = Math.floor(launderAmount * biz.launderFee);
          const cleaned = launderAmount - fee;

          biz.vaultDirty -= launderAmount;
          biz.vaultClean += cleaned;
          biz.suspicion = Math.min(100, biz.suspicion + 5);

          // Trigger police audit if suspicion gets dangerously high (>80%)
          if (biz.suspicion >= 80) {
            console.log(`[POLICE AUDIT WARNING] High laundering suspicion at ${biz.name}!`);
            Helix.emit('PoliceAlertBroadcast', { message: `FINANCIAL AUDIT: High laundering activity detected at ${biz.name}!` });
          }
        } else {
          biz.suspicion = Math.max(0, biz.suspicion - 2);
        }
      }
    });
  }, 4000);

  // RPC Endpoints
  Helix.endpoint('getBusinesses', async () => {
    return Array.from(businesses.values());
  });

  Helix.endpoint('buyBusiness', async (playerId, bizId) => {
    const biz = businesses.get(bizId);
    if (!biz) return { success: false, message: 'Business not found' };
    if (biz.owner) return { success: false, message: 'Business already owned' };

    biz.owner = playerId;
    businesses.set(bizId, biz);
    return { success: true, business: biz };
  });

  Helix.endpoint('depositDirtyMoney', async (playerId, bizId, amount) => {
    const biz = businesses.get(bizId);
    if (!biz || (biz.owner !== playerId && !biz.employees.includes(playerId))) {
      return { success: false, message: 'Unauthorized' };
    }

    biz.vaultDirty += amount;
    businesses.set(bizId, biz);
    return { success: true, vaultDirty: biz.vaultDirty };
  });

  Helix.endpoint('withdrawCleanMoney', async (playerId, bizId) => {
    const biz = businesses.get(bizId);
    if (!biz || biz.owner !== playerId) {
      return { success: false, message: 'Unauthorized' };
    }

    const payout = biz.vaultClean;
    biz.vaultClean = 0;
    businesses.set(bizId, biz);
    return { success: true, payout };
  });
});
