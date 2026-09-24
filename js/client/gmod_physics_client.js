/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Garry's Mod Style Client Physics & Snap Preview Controller
 * Handles visual green ghost previews when holding a prop near an open socket.
 */

Helix.client(() => {
  console.log('[HELIX CLIENT] Initializing Garry\'s Mod Physics Snap & Ghost Preview Controller...');

  let heldEntity = null;
  let activeSnapTarget = null;

  // When player picks up a physical prop (hands / physics gun)
  Helix.on('PlayerPickupProp', (entity) => {
    heldEntity = entity;
    console.log(`[GMOD PHYS] Picked up prop: ${entity.id}`);
  });

  // When player drops or freezes prop
  Helix.on('PlayerDropProp', async (entity) => {
    if (activeSnapTarget && activeSnapTarget.canSnap) {
      // Trigger magnetic snap & weld
      await Helix.callEndpoint('physicsWeldProp', {
        parentEntityId: activeSnapTarget.parentEntityId,
        childEntityId: entity.id,
        socketName: activeSnapTarget.targetSocket
      });
      console.log('[GMOD PHYS] Snapped and welded into position!');
    }
    heldEntity = null;
    activeSnapTarget = null;
  });

  // Proximity Tick check while holding prop
  setInterval(async () => {
    if (!heldEntity) return;

    // Check closest station within 1 meter
    if (typeof Helix.findClosestEntity !== 'undefined') {
      const nearbyStation = Helix.findClosestEntity(heldEntity.position, 1.2);
      if (nearbyStation && nearbyStation.hasSockets) {
        const snapCheck = await Helix.callEndpoint('physicsCheckSnap', {
          heldProp: heldEntity,
          targetStation: nearbyStation
        });

        if (snapCheck && snapCheck.canSnap) {
          activeSnapTarget = {
            canSnap: true,
            parentEntityId: nearbyStation.id,
            targetSocket: snapCheck.targetSocket,
            snapPosition: snapCheck.snapPosition
          };

          // Render green holographic ghost in 3D world
          if (typeof Helix.drawGhostHologram !== 'undefined') {
            Helix.drawGhostHologram(heldEntity.model, snapCheck.snapPosition, { r: 0, g: 255, b: 200, a: 0.5 });
          }
        } else {
          activeSnapTarget = null;
        }
      }
    }
  }, 100);
});
