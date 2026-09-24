/**
 * HELIX Platform - Stashhouse Security, CCTV Feeds & Contraband Incineration Burn Traps
 * Features:
 *  - High-Definition Security CCTV Cameras (View live feeds on Phone/Tablet)
 *  - Laser Motion Intrusion Sensors (Sends instant phone push notifications if police/rivals enter)
 *  - Remote Contraband Thermite Burn Trap (Triggered via phone to turn all weed & meth into ash before police raid)
 *  - Silent Police Panic Alarm
 */

Helix.server(async () => {
  console.log('[SECURITY TRAPS] Initializing Stashhouse CCTV, Intrusion Lasers & Burn Traps...');

  const SecuritySystems = new Map();

  function getPropertySecurity(propertyId) {
    if (!SecuritySystems.has(propertyId)) {
      SecuritySystems.set(propertyId, {
        propertyId,
        cameras: [
          { camId: 'cam_front_door', label: 'Front Entrance Porch', status: 'ONLINE', angle: 0 },
          { camId: 'cam_grow_room', label: 'Basement Hydroponic Room', status: 'ONLINE', angle: 45 },
          { camId: 'cam_meth_lab', label: 'Chemical Synthesis Kitchen', status: 'ONLINE', angle: 90 },
          { camId: 'cam_vault_room', label: 'Concealed Stash Wall', status: 'ONLINE', angle: 0 }
        ],
        motionAlarmArmed: true,
        burnTrapArmed: false,
        thermiteCharges: 2,
        alarmHistory: []
      });
    }
    return SecuritySystems.get(propertyId);
  }

  // --- Endpoints ---

  Helix.endpoint('getPropertySecurityState', async (playerId, data) => {
    const { propertyId } = data || {};
    const sec = getPropertySecurity(propertyId || 'prop_suburb_stash');
    return { success: true, security: sec };
  });

  Helix.endpoint('armMotionSensors', async (playerId, data) => {
    const { propertyId, armed } = data || {};
    const sec = getPropertySecurity(propertyId);
    sec.motionAlarmArmed = armed;
    console.log(`[SECURITY] Player ${playerId} set motion sensors on ${propertyId} to: ${armed ? 'ARMED' : 'DISARMED'}`);
    return { success: true, message: `Motion sensors ${armed ? 'ARMED' : 'DISARMED'}` };
  });

  Helix.endpoint('armBurnTrap', async (playerId, data) => {
    const { propertyId, armed } = data || {};
    const sec = getPropertySecurity(propertyId);
    if (sec.thermiteCharges <= 0) return { success: false, message: 'No thermite charges installed' };

    sec.burnTrapArmed = armed;
    console.warn(`[SECURITY] ⚠️ Player ${playerId} set Emergency Incineration Burn Trap on ${propertyId} to: ${armed ? 'ARMED' : 'DISARMED'}`);
    return { success: true, message: `Emergency Contraband Burn Trap ${armed ? 'ARMED (DANGER)' : 'DISARMED'}` };
  });

  Helix.endpoint('detonateBurnTrap', async (playerId, data) => {
    const { propertyId, confirmationCode } = data || {};
    const sec = getPropertySecurity(propertyId);
    if (!sec.burnTrapArmed) return { success: false, message: 'Burn trap is not armed' };
    if (confirmationCode !== 'BURN99') return { success: false, message: 'Invalid confirmation code (Enter BURN99)' };

    sec.thermiteCharges = Math.max(0, sec.thermiteCharges - 1);
    sec.burnTrapArmed = false;

    // Incinerate all contraband in property
    const prop = global.PacificaHousing?.Properties.get(propertyId);
    let itemsDestroyed = 0;
    if (prop) {
      itemsDestroyed = prop.fixtures.length;
      prop.fixtures = []; // All fixtures destroyed into ash
    }

    console.warn(`[SECURITY EMERGENCY] 🔥 THERMITE BURN TRAP DETONATED at ${propertyId}! Destroyed ${itemsDestroyed} fixtures.`);
    Helix.emit('propertyIncinerated', { propertyId, timestamp: Date.now() });

    return {
      success: true,
      message: `🔥 THERMITE ACTIVATED! All contraband, grow boxes, and chemical apparatus vaporized into sterile ash. 0 Evidence remaining.`
    };
  });

  global.StashSecurity = {
    getPropertySecurity
  };
});
