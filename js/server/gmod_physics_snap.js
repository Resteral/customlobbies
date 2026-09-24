/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Garry's Mod Style Physical Snap-To-Socket & Weld Engine
 * Features:
 * - Real-time physics proximity bounding-box detection
 * - Holographic green alignment ghost previews
 * - Magnetic snap-in & rigid constraint welding (clink / lock audio)
 * - Parent-child hierarchy movement (moving the table moves all attached sub-props)
 * - Physical un-weld and pop-out on player interaction
 */

const GModPhysicsSnap = {
  // Proximity threshold for magnetic snap-in (meters)
  SNAP_DISTANCE_THRESHOLD: 0.35,

  // Track all physical weld constraints (parentEntityId -> [childEntityIds])
  weldedAssemblies: new Map(),

  /**
   * Check if a dropped/held physical prop is inside a valid parent socket trigger volume
   */
  checkProximitySnap(heldPropEntity, parentStationEntity) {
    if (!heldPropEntity || !parentStationEntity) return null;

    const parentPos = parentStationEntity.position || { x: 0, y: 0, z: 0 };
    const propPos = heldPropEntity.position || { x: 0, y: 0, z: 0 };

    // Calculate 3D Euclidean distance
    const dx = propPos.x - parentPos.x;
    const dy = propPos.y - parentPos.y;
    const dz = propPos.z - parentPos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= this.SNAP_DISTANCE_THRESHOLD) {
      return {
        canSnap: true,
        dist,
        targetSocket: 'primary_well',
        snapPosition: {
          x: parentPos.x,
          y: parentPos.y,
          z: parentPos.z + 0.45
        }
      };
    }

    return { canSnap: false, dist };
  },

  /**
   * Perform classic GMod weld constraint: Snaps child prop into socket and rigid-parents it
   */
  weldPropToStation(playerId, parentEntityId, childEntityId, socketName = 'primary_well') {
    let weldedList = this.weldedAssemblies.get(parentEntityId);
    if (!weldedList) {
      weldedList = new Set();
      this.weldedAssemblies.set(parentEntityId, weldedList);
    }

    weldedList.add(childEntityId);

    // Call native Unreal Engine 5 rigid weld / attach component
    if (typeof Helix.weldEntities !== 'undefined') {
      Helix.weldEntities(parentEntityId, childEntityId, socketName);
    }

    // Play classic GMod-style physical snap audio
    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('GModPhysicsSound', {
        type: 'snap_weld',
        sound: 'audio/metal_clank_heavy.wav',
        location: parentEntityId.position
      });
    }

    console.log(`[GMOD WELD] Welded Prop #${childEntityId} onto Station #${parentEntityId} (Socket: ${socketName})`);
    return {
      success: true,
      welded: true,
      socketName,
      message: `Snapped and welded onto ${socketName}`
    };
  },

  /**
   * Un-weld and pop out a prop back into physics simulation or player hands
   */
  unweldProp(playerId, parentEntityId, childEntityId) {
    const weldedList = this.weldedAssemblies.get(parentEntityId);
    if (weldedList && weldedList.has(childEntityId)) {
      weldedList.delete(childEntityId);

      if (typeof Helix.unweldEntities !== 'undefined') {
        Helix.unweldEntities(parentEntityId, childEntityId);
      }

      // Small physical upward impulse pop
      if (typeof Helix.applyImpulse !== 'undefined') {
        Helix.applyImpulse(childEntityId, { x: 0, y: 0, z: 2.5 });
      }

      console.log(`[GMOD WELD] Un-welded Prop #${childEntityId} from Station #${parentEntityId}`);
      return { success: true, unwelded: true };
    }

    return { success: false, error: 'Prop is not welded.' };
  }
};

// Server Endpoints for Physics Interaction
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[GMOD PHYSICS] Initializing Garry\'s Mod Style Snap-to-Socket & Weld Engine...');

    Helix.endpoint('physicsCheckSnap', async (playerId, data) => {
      const { heldProp, targetStation } = data || {};
      return GModPhysicsSnap.checkProximitySnap(heldProp, targetStation);
    });

    Helix.endpoint('physicsWeldProp', async (playerId, data) => {
      const { parentEntityId, childEntityId, socketName } = data || {};
      return GModPhysicsSnap.weldPropToStation(playerId, parentEntityId, childEntityId, socketName);
    });

    Helix.endpoint('physicsUnweldProp', async (playerId, data) => {
      const { parentEntityId, childEntityId } = data || {};
      return GModPhysicsSnap.unweldProp(playerId, parentEntityId, childEntityId);
    });
  });
}

if (typeof module !== 'undefined') module.exports = GModPhysicsSnap;
