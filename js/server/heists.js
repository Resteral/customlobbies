/**
 * HELIX Platform - Bank Vault & Thermal Drill Heist Server Module
 */

Helix.server(async () => {
  const vaults = new Map();
  const safes = new Map();

  Helix.endpoint('submitVaultPIN', async (vaultId, code) => {
    const vault = vaults.get(vaultId) || { passcode: "1337", isOpen: false };
    if (code === vault.passcode) {
      vault.isOpen = !vault.isOpen;
      vaults.set(vaultId, vault);
      return { success: true, isOpen: vault.isOpen };
    }
    return { success: false, message: "Invalid PIN Entered" };
  });

  Helix.endpoint('submitHackResult', async (terminalId, success) => {
    if (success) {
      console.log(`[HACK SUCCESS] Terminal ${terminalId} breached.`);
      return { success: true };
    } else {
      console.log(`[HACK FAILED] Silent Alarm triggered on Terminal ${terminalId}!`);
      Helix.emit('PoliceAlertBroadcast', { message: "SECURITY BREACH: Hacking attempt failed!" });
      return { success: false };
    }
  });
});
