/**
 * Modular Architectural Shell Builder
 * Provides pre-calibrated modular walls, floors, ceilings, door openings, and auto-room shell generators.
 */

class ModularBuilder {
    static getBuildingBlocks() {
        return [
            {
                id: 'wall_4m',
                name: 'Straight Wall (4m)',
                model: 'v_ilev_cd_wall01',
                size: [4.0, 0.2, 3.0],
                icon: '🧱',
                category: 'walls'
            },
            {
                id: 'wall_2m',
                name: 'Partition Wall (2m)',
                model: 'v_ilev_cd_wall02',
                size: [2.0, 0.2, 3.0],
                icon: '🧱',
                category: 'walls'
            },
            {
                id: 'wall_doorway',
                name: 'Doorway Arch Frame',
                model: 'v_ilev_bk_doorframe',
                size: [2.0, 0.2, 3.0],
                icon: '🚪',
                category: 'doors'
            },
            {
                id: 'wall_glass',
                name: 'Glass Panel Wall',
                model: 'v_ilev_bank_glass01',
                size: [3.0, 0.1, 2.8],
                icon: '🪟',
                category: 'walls'
            },
            {
                id: 'floor_4x4',
                name: 'Floor Slab (4x4m)',
                model: 'v_ilev_floor_tile01',
                size: [4.0, 4.0, 0.1],
                icon: '⬛',
                category: 'floors'
            },
            {
                id: 'ceiling_4x4',
                name: 'Ceiling Slab (4x4m)',
                model: 'v_ilev_floor_tile01',
                size: [4.0, 4.0, 0.1],
                icon: '⬜',
                category: 'ceilings'
            },
            {
                id: 'pillar_concrete',
                name: 'Support Pillar (0.8m)',
                model: 'v_ilev_fib_column01',
                size: [0.8, 0.8, 3.5],
                icon: '🏛️',
                category: 'pillars'
            },
            {
                id: 'stairs_straight',
                name: 'Metal Staircase',
                model: 'prop_stairs_01',
                size: [1.5, 3.5, 3.0],
                icon: '🪜',
                category: 'stairs'
            }
        ];
    }

    /**
     * Automatically constructs modular walls, floor, and ceiling for a room's bounding box
     */
    static generateRoomShell(room) {
        const min = room.bbMin || [-4, -4, 0];
        const max = room.bbMax || [4, 4, 3.5];
        const width = max[0] - min[0];  // X
        const length = max[1] - min[1]; // Y
        const height = max[2] - min[2]; // Z
        const centerX = (min[0] + max[0]) / 2;
        const centerY = (min[1] + max[1]) / 2;
        const baseZ = min[2];

        const entities = [];

        // 1. Floor Platform
        entities.push({
            model: 'v_ilev_floor_tile01',
            room: room.id,
            pos: { x: centerX, y: centerY, z: baseZ },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((width / 4).toFixed(2)), y: Number((length / 4).toFixed(2)), z: 1.0 },
            name: `Floor (${room.name})`
        });

        // 2. Ceiling Slab
        entities.push({
            model: 'v_ilev_floor_tile01',
            room: room.id,
            pos: { x: centerX, y: centerY, z: baseZ + height },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((width / 4).toFixed(2)), y: Number((length / 4).toFixed(2)), z: 1.0 },
            name: `Ceiling (${room.name})`
        });

        // 3. North Wall (+Y)
        entities.push({
            model: 'v_ilev_cd_wall01',
            room: room.id,
            pos: { x: centerX, y: max[1], z: baseZ },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((width / 4).toFixed(2)), y: 1.0, z: Number((height / 3).toFixed(2)) },
            name: `Wall North (${room.name})`
        });

        // 4. South Wall (-Y)
        entities.push({
            model: 'v_ilev_cd_wall01',
            room: room.id,
            pos: { x: centerX, y: min[1], z: baseZ },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((width / 4).toFixed(2)), y: 1.0, z: Number((height / 3).toFixed(2)) },
            name: `Wall South (${room.name})`
        });

        // 5. East Wall (+X)
        entities.push({
            model: 'v_ilev_cd_wall01',
            room: room.id,
            pos: { x: max[0], y: centerY, z: baseZ },
            rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 }, // 90 deg yaw
            scale: { x: Number((length / 4).toFixed(2)), y: 1.0, z: Number((height / 3).toFixed(2)) },
            name: `Wall East (${room.name})`
        });

        // 6. West Wall (-X)
        entities.push({
            model: 'v_ilev_cd_wall01',
            room: room.id,
            pos: { x: min[0], y: centerY, z: baseZ },
            rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 }, // 90 deg yaw
            scale: { x: Number((length / 4).toFixed(2)), y: 1.0, z: Number((height / 3).toFixed(2)) },
            name: `Wall West (${room.name})`
        });

        return entities;
    }
}

if (typeof module !== 'undefined') {
    module.exports = ModularBuilder;
}
