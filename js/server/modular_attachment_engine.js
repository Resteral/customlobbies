/**
 * HELIX Platform (helixgame.com UE5 Sandbox)
 * Modular Socketing & Nested Model Attachment Engine
 * Handles physical prop nesting, socket snapping, and functional state activation
 * (e.g., Flask onto Heating Mantle, Seed in Soil Pot, Lamp snapped on Grow Box, GPU in Server Rack, Mold in Press).
 */

const ModularAttachmentEngine = {
  // Assembly Configurations: Defines sockets, relative offsets, and assembly rules
  SOCKET_DEFINITIONS: {
    // 1. Chemistry Synthesis Lab Assembly
    meth_lab_station: {
      parentModel: 'assets/models/meth_lab.glb',
      sockets: {
        heating_mantle: {
          name: 'Boiling Flask Well',
          acceptedModels: ['assets/models/flask_round_bottom.glb', 'assets/models/beaker_chemical.glb'],
          localOffset: { x: 0.0, y: 0.15, z: 0.42 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/glass_clink.wav',
          enablesFeature: 'heating_reaction'
        },
        condenser_column: {
          name: 'Distillation Reflux Tube',
          acceptedModels: ['assets/models/condenser_coil.glb'],
          localOffset: { x: 0.0, y: 0.15, z: 0.78 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/glass_slide_lock.wav',
          enablesFeature: 'vapor_cooling'
        },
        thermometer_probe: {
          name: 'Digital Temp Probe Jack',
          acceptedModels: ['assets/models/digital_temp_probe.glb'],
          localOffset: { x: -0.05, y: 0.12, z: 0.65 },
          localRot: { pitch: 15, yaw: 45, roll: 0 },
          snapAudio: 'audio/probe_insert.wav',
          enablesFeature: 'precise_thermodynamics'
        }
      }
    },

    // 2. Hydroponic Grow Box Assembly
    hydroponic_grow_box: {
      parentModel: 'assets/models/weed_box.glb',
      sockets: {
        grow_lamp_rail: {
          name: 'Overhead Quantum LED Rig',
          acceptedModels: ['assets/models/uv_quantum_lamp.glb'],
          localOffset: { x: 0.0, y: 0.0, z: 1.10 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/light_rail_snap.wav',
          enablesFeature: 'full_spectrum_uv'
        },
        soil_pot_slot_1: {
          name: 'Planting Well A',
          acceptedModels: ['assets/models/weed_pot.glb'],
          localOffset: { x: -0.35, y: 0.0, z: 0.25 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/pot_place_heavy.wav',
          enablesFeature: 'plant_growth_slot_1'
        },
        soil_pot_slot_2: {
          name: 'Planting Well B',
          acceptedModels: ['assets/models/weed_pot.glb'],
          localOffset: { x: 0.35, y: 0.0, z: 0.25 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/pot_place_heavy.wav',
          enablesFeature: 'plant_growth_slot_2'
        },
        irrigation_tube: {
          name: 'Water Drip Line Manifold',
          acceptedModels: ['assets/models/irrigation_hose.glb'],
          localOffset: { x: 0.0, y: -0.28, z: 0.35 },
          localRot: { pitch: 0, yaw: 90, roll: 0 },
          snapAudio: 'audio/tube_click.wav',
          enablesFeature: 'auto_watering'
        }
      }
    },

    // 3. Hydraulic Brick Press Assembly
    hydraulic_brick_press: {
      parentModel: 'assets/models/drillable_safe.glb', // Base Heavy Frame
      sockets: {
        die_mold_bed: {
          name: 'Hardened Steel 1kg Mold Die',
          acceptedModels: ['assets/models/steel_mold_die.glb'],
          localOffset: { x: 0.0, y: 0.0, z: 0.35 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/metal_clank_heavy.wav',
          enablesFeature: 'powder_containment'
        },
        cartel_stamp_insert: {
          name: 'Custom Engraved Stamping Plate',
          acceptedModels: ['assets/models/cartel_stamp_die.glb'],
          localOffset: { x: 0.0, y: 0.0, z: 0.48 },
          localRot: { pitch: 180, yaw: 0, roll: 0 },
          snapAudio: 'audio/stamp_lock.wav',
          enablesFeature: 'brick_stamping'
        }
      }
    },

    // 4. Crypto Server Rack & Cyber Hardware
    crypto_server_rack: {
      parentModel: 'assets/models/crypto_farm.glb',
      sockets: {
        gpu_slot_1: {
          name: 'PCI-e GPU Bay 1',
          acceptedModels: ['assets/models/gpu_module.glb'],
          localOffset: { x: 0.0, y: 0.08, z: 0.60 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/pcie_latch_click.wav',
          enablesFeature: 'gpu_hashrate_1'
        },
        gpu_slot_2: {
          name: 'PCI-e GPU Bay 2',
          acceptedModels: ['assets/models/gpu_module.glb'],
          localOffset: { x: 0.0, y: 0.08, z: 0.95 },
          localRot: { pitch: 0, yaw: 0, roll: 0 },
          snapAudio: 'audio/pcie_latch_click.wav',
          enablesFeature: 'gpu_hashrate_2'
        },
        crypto_usb_port: {
          name: 'Hardware Cold Storage USB Port',
          acceptedModels: ['assets/models/crypto_usb.glb'],
          localOffset: { x: 0.22, y: 0.18, z: 1.35 },
          localRot: { pitch: 0, yaw: 90, roll: 0 },
          snapAudio: 'audio/usb_plug.wav',
          enablesFeature: 'usb_siphon_channel'
        }
      }
    }
  },

  // Active Assembled Station Instances (stationId -> { parentEntityId, attachedProps: { socketKey -> propData } })
  assemblies: new Map(),

  /**
   * Insert/Attach a model prop into a parent station's socket
   */
  attachModelToSocket(stationId, parentEntityId, socketKey, childModelPath, playerId) {
    let assembly = this.assemblies.get(stationId);
    if (!assembly) {
      assembly = { stationId, parentEntityId, attachedProps: {} };
      this.assemblies.set(stationId, assembly);
    }

    // Find socket rule
    const config = Object.values(this.SOCKET_DEFINITIONS).find(def => def.sockets[socketKey]);
    if (!config) return { success: false, error: 'Invalid socket key.' };

    const socket = config.sockets[socketKey];
    if (assembly.attachedProps[socketKey]) {
      return { success: false, error: `Socket '${socket.name}' is already occupied!` };
    }

    const attachedItem = {
      socketKey,
      name: socket.name,
      model: childModelPath,
      offset: socket.localOffset,
      rotation: socket.localRot,
      attachedAt: Date.now(),
      attachedBy: playerId
    };

    assembly.attachedProps[socketKey] = attachedItem;

    // Attach in Unreal Engine 5 native hierarchy if available
    if (typeof Helix.attachEntityToParent !== 'undefined') {
      Helix.attachEntityToParent(parentEntityId, childModelPath, socket.localOffset, socket.localRot);
    }

    // Emit 3D Attachment event & play realistic sound effect
    if (typeof Helix.emit !== 'undefined') {
      Helix.emit('ModelSocketAttached', {
        stationId,
        parentEntityId,
        socketKey,
        sound: socket.snapAudio,
        enabledFeature: socket.enablesFeature
      });
    }

    console.log(`[ASSEMBLY] Player ${playerId} inserted '${childModelPath}' into [${socket.name}] on Station #${stationId}`);
    return {
      success: true,
      message: `Attached into ${socket.name}`,
      enabledFeature: socket.enablesFeature,
      assembly
    };
  },

  /**
   * Detach/Remove a model prop from a socket
   */
  detachModelFromSocket(stationId, socketKey, playerId) {
    const assembly = this.assemblies.get(stationId);
    if (!assembly || !assembly.attachedProps[socketKey]) {
      return { success: false, error: 'No model attached in this socket.' };
    }

    const removedItem = assembly.attachedProps[socketKey];
    delete assembly.attachedProps[socketKey];

    if (typeof Helix.detachEntityFromParent !== 'undefined') {
      Helix.detachEntityFromParent(assembly.parentEntityId, socketKey);
    }

    console.log(`[ASSEMBLY] Player ${playerId} removed '${removedItem.name}' from Station #${stationId}`);
    return { success: true, removedItem, assembly };
  },

  /**
   * Check which features are unlocked by the attached parts
   */
  getUnlockedFeatures(stationId) {
    const assembly = this.assemblies.get(stationId);
    if (!assembly) return [];

    const features = [];
    Object.values(this.SOCKET_DEFINITIONS).forEach(def => {
      Object.keys(def.sockets).forEach(socketKey => {
        if (assembly.attachedProps[socketKey]) {
          features.push(def.sockets[socketKey].enablesFeature);
        }
      });
    });
    return features;
  }
};

// Server Endpoints
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[ASSEMBLY] Initializing Modular Model Socketing & Attachment Engine...');

    Helix.endpoint('attachModelProp', async (playerId, data) => {
      const { stationId, parentEntityId, socketKey, childModel } = data || {};
      return ModularAttachmentEngine.attachModelToSocket(
        stationId || `station_${playerId}`,
        parentEntityId || `ent_${stationId}`,
        socketKey,
        childModel,
        playerId
      );
    });

    Helix.endpoint('detachModelProp', async (playerId, data) => {
      const { stationId, socketKey } = data || {};
      return ModularAttachmentEngine.detachModelFromSocket(stationId || `station_${playerId}`, socketKey, playerId);
    });

    Helix.endpoint('getStationAssembly', async (playerId, data) => {
      const { stationId } = data || {};
      const assembly = ModularAttachmentEngine.assemblies.get(stationId || `station_${playerId}`);
      return {
        success: true,
        assembly: assembly || null,
        definitions: ModularAttachmentEngine.SOCKET_DEFINITIONS
      };
    });
  });
}

if (typeof module !== 'undefined') module.exports = ModularAttachmentEngine;
