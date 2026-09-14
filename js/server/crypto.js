/**
 * HELIX Platform - Crypto Mining & USB Siphoning Server Module
 */

Helix.server(async () => {
  const miningRigs = new Map();

  // Passive Mining Earnings Tick
  setInterval(() => {
    miningRigs.forEach((rig, id) => {
      if (rig.isMining) {
        rig.balance = Math.min(10000, (rig.balance || 0) + Math.floor(Math.random() * 70) + 30);
        rig.temperature = Math.min(95, (rig.temperature || 45) + Math.floor(Math.random() * 2));
      }
    });
  }, 5000);

  // Withdraw Crypto Earnings Endpoint
  Helix.endpoint('withdrawCrypto', async (rigId) => {
    const rig = miningRigs.get(rigId) || { balance: 0, temperature: 45 };
    const amount = rig.balance;
    rig.balance = 0;
    miningRigs.set(rigId, rig);
    return { amount };
  });

  // Siphon Crypto via USB Endpoint
  Helix.endpoint('siphonCryptoUSB', async (rigId) => {
    const rig = miningRigs.get(rigId) || { balance: 0 };
    if (rig.balance <= 0) {
      return { success: false, message: 'Rig has no accumulated crypto funds!' };
    }
    const stolenAmount = rig.balance;
    rig.balance = 0;
    miningRigs.set(rigId, rig);
    return { success: true, siphonedAmount: stolenAmount };
  });
});
