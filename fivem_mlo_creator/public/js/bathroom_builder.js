/**
 * Bathroom Procedural Builder & Fixture Kit
 * Generates complete functional luxury and commercial bathrooms with plumbing fixtures, portals, and tiles.
 */

class BathroomBuilder {
    static getPresets() {
        return [
            {
                id: 'luxury_master_spa',
                name: 'Master Luxury Spa Bathroom',
                icon: '🛁',
                desc: 'Freestanding soaker tub, frameless glass shower, double marble vanity, LED mirror, heated towel rack, and modern toilet.',
                size: [4.0, 3.5, 3.0],
                timecycle: 'int_hospital',
                wallMaterial: 'tile_ceramic_black',
                floorMaterial: 'marble_carrara'
            },
            {
                id: 'modern_ensuite',
                name: 'Modern Apartment En-Suite Bath',
                icon: '🚿',
                desc: 'Walk-in glass rainfall shower, floating vanity sink, backlit mirror, chrome towel rack, and toilet.',
                size: [3.0, 2.5, 2.8],
                timecycle: 'int_hospital',
                wallMaterial: 'tile_subway_white',
                floorMaterial: 'tile_ceramic_black'
            },
            {
                id: 'commercial_restroom',
                name: 'Commercial Restroom with Stalls',
                icon: '🚻',
                desc: '2 Privacy toilet stalls, 2 wall urinals, multi-faucet wash basin, paper towel dispenser, and sanitary bins.',
                size: [5.0, 4.0, 3.0],
                timecycle: 'int_hospital',
                wallMaterial: 'tile_mosaic_blue',
                floorMaterial: 'concrete_polished'
            },
            {
                id: 'grungy_motel_bath',
                name: 'Grungy Motel / Crime Hideout Bath',
                icon: '🚽',
                desc: 'Cast iron combination tub/shower, pedestal sink, yellowed toilet, dim tungsten atmosphere, and medicine cabinet.',
                size: [2.5, 2.2, 2.6],
                timecycle: 'int_motel',
                wallMaterial: 'tile_subway_white',
                floorMaterial: 'concrete_rough'
            }
        ];
    }

    /**
     * Generates a complete standalone bathroom room, perimeter tiled walls, doorway portal, and all fixtures
     */
    static generateCompleteBathroom(presetId, parentRoomId = 1, centerPos = { x: 8, y: 0, z: 0 }) {
        const preset = this.getPresets().find(p => p.id === presetId) || this.getPresets()[0];
        const [w, l, h] = preset.size;
        const halfW = w / 2;
        const halfL = l / 2;

        const roomDef = {
            name: 'bathroom_suite',
            bbMin: [Number((centerPos.x - halfW).toFixed(2)), Number((centerPos.y - halfL).toFixed(2)), Number(centerPos.z.toFixed(2))],
            bbMax: [Number((centerPos.x + halfW).toFixed(2)), Number((centerPos.y + halfL).toFixed(2)), Number((centerPos.z + h).toFixed(2))],
            timecycle: preset.timecycle,
            blend: 1.0,
            flags: 0,
            floorId: 0
        };

        const entities = [];

        // 1. Tiled Floor Slab
        entities.push({
            model: 'v_ilev_floor_tile01',
            name: `Bathroom Floor (${preset.floorMaterial})`,
            pos: { x: centerPos.x, y: centerPos.y, z: centerPos.z },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((w / 4.0).toFixed(2)), y: Number((l / 4.0).toFixed(2)), z: 1.0 },
            materialId: preset.floorMaterial
        });

        // 2. Ceiling Slab
        entities.push({
            model: 'v_ilev_floor_tile01',
            name: `Bathroom Ceiling`,
            pos: { x: centerPos.x, y: centerPos.y, z: centerPos.z + h },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((w / 4.0).toFixed(2)), y: Number((l / 4.0).toFixed(2)), z: 1.0 },
            materialId: 'drywall_white'
        });

        // 3. Perimeter Tiled Walls (North, South, East, West)
        // North Wall (+Y)
        entities.push({
            model: 'v_ilev_cd_wall01',
            name: `Wall North (${preset.wallMaterial})`,
            pos: { x: centerPos.x, y: centerPos.y + halfL, z: centerPos.z },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((w / 4.0).toFixed(2)), y: 1.0, z: Number((h / 3.0).toFixed(2)) },
            materialId: preset.wallMaterial
        });

        // South Wall (-Y) with doorway opening
        entities.push({
            model: 'v_ilev_cd_wall01',
            name: `Wall South (${preset.wallMaterial})`,
            pos: { x: centerPos.x, y: centerPos.y - halfL, z: centerPos.z },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: Number((w / 4.0).toFixed(2)), y: 1.0, z: Number((h / 3.0).toFixed(2)) },
            materialId: preset.wallMaterial
        });

        // East Wall (+X)
        entities.push({
            model: 'v_ilev_cd_wall01',
            name: `Wall East (${preset.wallMaterial})`,
            pos: { x: centerPos.x + halfW, y: centerPos.y, z: centerPos.z },
            rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 },
            scale: { x: Number((l / 4.0).toFixed(2)), y: 1.0, z: Number((h / 3.0).toFixed(2)) },
            materialId: preset.wallMaterial
        });

        // West Wall (-X)
        entities.push({
            model: 'v_ilev_cd_wall01',
            name: `Wall West (${preset.wallMaterial})`,
            pos: { x: centerPos.x - halfW, y: centerPos.y, z: centerPos.z },
            rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 },
            scale: { x: Number((l / 4.0).toFixed(2)), y: 1.0, z: Number((h / 3.0).toFixed(2)) },
            materialId: preset.wallMaterial
        });

        // 4. Fixtures based on preset
        if (preset.id === 'luxury_master_spa') {
            // Freestanding Soaker Tub (+X side)
            entities.push({
                model: 'v_res_mp_soakertub',
                name: 'Freestanding Luxury Soaker Tub',
                pos: { x: centerPos.x + halfW - 1.0, y: centerPos.y, z: centerPos.z },
                rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // Walk-in Glass Shower (North-West corner)
            entities.push({
                model: 'v_res_mp_shower',
                name: 'Walk-In Frameless Glass Shower',
                pos: { x: centerPos.x - halfW + 0.9, y: centerPos.y + halfL - 0.9, z: centerPos.z },
                rot: { x: 0, y: 0, z: 0, w: 1 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // Double Vanity Sink (North Wall)
            entities.push({
                model: 'v_res_mp_vanity',
                name: 'Double Marble Vanity Unit',
                pos: { x: centerPos.x + 0.2, y: centerPos.y + halfL - 0.4, z: centerPos.z },
                rot: { x: 0, y: 0, z: 1, w: 0 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // Backlit LED Mirror
            entities.push({
                model: 'v_res_mp_mirror',
                name: 'LED Vanity Mirror',
                pos: { x: centerPos.x + 0.2, y: centerPos.y + halfL - 0.05, z: centerPos.z + 1.2 },
                rot: { x: 0, y: 0, z: 1, w: 0 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // Modern Porcelain Toilet (South-West corner)
            entities.push({
                model: 'prop_toilet_01',
                name: 'Porcelain Toilet',
                pos: { x: centerPos.x - halfW + 0.6, y: centerPos.y - halfL + 0.6, z: centerPos.z },
                rot: { x: 0, y: 0, z: 0, w: 1 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // Heated Towel Rail
            entities.push({
                model: 'prop_towel_rail_01',
                name: 'Heated Chrome Towel Rail',
                pos: { x: centerPos.x - halfW + 0.05, y: centerPos.y, z: centerPos.z + 0.9 },
                rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // Toilet Paper Roll
            entities.push({
                model: 'prop_toilet_roll_01',
                name: 'Toilet Paper Dispenser',
                pos: { x: centerPos.x - halfW + 0.05, y: centerPos.y - halfL + 0.6, z: centerPos.z + 0.6 },
                rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 },
                scale: { x: 1, y: 1, z: 1 }
            });

        } else if (preset.id === 'commercial_restroom') {
            // 2 Toilet Stalls
            entities.push({
                model: 'prop_toilet_stall_01',
                name: 'Restroom Stall 1',
                pos: { x: centerPos.x - halfW + 0.8, y: centerPos.y + halfL - 1.0, z: centerPos.z },
                rot: { x: 0, y: 0, z: 1, w: 0 },
                scale: { x: 1, y: 1, z: 1 }
            });
            entities.push({
                model: 'prop_toilet_01',
                name: 'Toilet 1',
                pos: { x: centerPos.x - halfW + 0.8, y: centerPos.y + halfL - 0.4, z: centerPos.z },
                rot: { x: 0, y: 0, z: 1, w: 0 },
                scale: { x: 1, y: 1, z: 1 }
            });

            entities.push({
                model: 'prop_toilet_stall_01',
                name: 'Restroom Stall 2',
                pos: { x: centerPos.x - halfW + 2.1, y: centerPos.y + halfL - 1.0, z: centerPos.z },
                rot: { x: 0, y: 0, z: 1, w: 0 },
                scale: { x: 1, y: 1, z: 1 }
            });
            entities.push({
                model: 'prop_toilet_01',
                name: 'Toilet 2',
                pos: { x: centerPos.x - halfW + 2.1, y: centerPos.y + halfL - 0.4, z: centerPos.z },
                rot: { x: 0, y: 0, z: 1, w: 0 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // 2 Urinals on East Wall
            entities.push({
                model: 'prop_urinal_01',
                name: 'Wall Urinal 1',
                pos: { x: centerPos.x + halfW - 0.1, y: centerPos.y + 0.6, z: centerPos.z + 0.4 },
                rot: { x: 0, y: 0, z: -0.7071, w: 0.7071 },
                scale: { x: 1, y: 1, z: 1 }
            });
            entities.push({
                model: 'prop_urinal_01',
                name: 'Wall Urinal 2',
                pos: { x: centerPos.x + halfW - 0.1, y: centerPos.y - 0.6, z: centerPos.z + 0.4 },
                rot: { x: 0, y: 0, z: -0.7071, w: 0.7071 },
                scale: { x: 1, y: 1, z: 1 }
            });

            // Double Sinks (South Wall)
            entities.push({
                model: 'prop_sink_02',
                name: 'Hand Sink 1',
                pos: { x: centerPos.x - 0.6, y: centerPos.y - halfL + 0.5, z: centerPos.z },
                rot: { x: 0, y: 0, z: 0, w: 1 },
                scale: { x: 1, y: 1, z: 1 }
            });
            entities.push({
                model: 'prop_sink_02',
                name: 'Hand Sink 2',
                pos: { x: centerPos.x + 0.6, y: centerPos.y - halfL + 0.5, z: centerPos.z },
                rot: { x: 0, y: 0, z: 0, w: 1 },
                scale: { x: 1, y: 1, z: 1 }
            });
        } else {
            // Standard En-suite
            entities.push({
                model: 'v_res_mp_shower',
                name: 'Shower Stall',
                pos: { x: centerPos.x + halfW - 0.8, y: centerPos.y + halfL - 0.8, z: centerPos.z },
                rot: { x: 0, y: 0, z: 0, w: 1 },
                scale: { x: 1, y: 1, z: 1 }
            });
            entities.push({
                model: 'prop_toilet_01',
                name: 'Toilet',
                pos: { x: centerPos.x - halfW + 0.6, y: centerPos.y + halfL - 0.6, z: centerPos.z },
                rot: { x: 0, y: 0, z: 1, w: 0 },
                scale: { x: 1, y: 1, z: 1 }
            });
            entities.push({
                model: 'prop_sink_02',
                name: 'Pedestal Sink',
                pos: { x: centerPos.x - halfW + 0.5, y: centerPos.y - 0.2, z: centerPos.z },
                rot: { x: 0, y: 0, z: 0.7071, w: 0.7071 },
                scale: { x: 1, y: 1, z: 1 }
            });
        }

        // Bathroom Frosted Privacy Door
        entities.push({
            model: 'v_ilev_bath_door',
            name: 'Bathroom Privacy Door',
            pos: { x: centerPos.x, y: centerPos.y - halfL, z: centerPos.z },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: 1, y: 1, z: 1 }
        });

        // 5. 4-Vertex Portal Doorway (connecting Parent Room <-> Bathroom)
        const portalDef = {
            fromRoom: parentRoomId,
            toRoom: 0, // Assigned when added to project
            flags: 0,
            vertices: [
                { x: centerPos.x - 0.5, y: centerPos.y - halfL, z: centerPos.z },
                { x: centerPos.x - 0.5, y: centerPos.y - halfL, z: centerPos.z + 2.2 },
                { x: centerPos.x + 0.5, y: centerPos.y - halfL, z: centerPos.z + 2.2 },
                { x: centerPos.x + 0.5, y: centerPos.y - halfL, z: centerPos.z }
            ]
        };

        return {
            room: roomDef,
            entities: entities,
            portal: portalDef
        };
    }
}

if (typeof module !== 'undefined') {
    module.exports = BathroomBuilder;
}
