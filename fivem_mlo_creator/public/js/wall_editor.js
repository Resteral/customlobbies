/**
 * Wall Editor & Window/Curtain Puncher
 * Modifies wall dimensions, materials, and dynamically punches window & doorway cutouts with attached curtains.
 */

class WallEditor {
    static getMaterials() {
        return WALL_MATERIALS;
    }

    /**
     * Creates a custom wall segment with specific dimensions and material
     */
    static createCustomWall(roomId, options = {}) {
        const length = options.length || 4.0;
        const height = options.height || 3.0;
        const thickness = options.thickness || 0.2;
        const materialId = options.materialId || 'drywall_white';
        const position = options.position || { x: 0, y: 0, z: 0 };
        const rotation = options.rotation || { x: 0, y: 0, z: 0, w: 1 };

        return {
            model: 'v_ilev_cd_wall01',
            name: `Wall (${materialId})`,
            room: roomId,
            pos: { ...position },
            rot: { ...rotation },
            scale: {
                x: Number((length / 4.0).toFixed(3)),
                y: Number((thickness / 0.2).toFixed(3)),
                z: Number((height / 3.0).toFixed(3))
            },
            materialId: materialId,
            customWall: true,
            dimensions: { length, height, thickness }
        };
    }

    /**
     * Punches a window opening into a wall and attaches glass and curtains
     */
    static punchWindowOpening(roomId, wallPos, wallRot, options = {}) {
        const wallLength = options.wallLength || 4.0;
        const wallHeight = options.wallHeight || 3.0;
        const wallThickness = options.wallThickness || 0.2;
        const windowWidth = options.windowWidth || 1.8;
        const windowHeight = options.windowHeight || 1.6;
        const sillHeight = options.sillHeight || 0.9;
        const materialId = options.materialId || 'drywall_white';
        const curtainStyle = options.curtainStyle || 'fabric_curtains'; // 'fabric_curtains' | 'venetian_blinds' | 'roller_blinds' | 'none'

        const entities = [];

        // 1. Sill Wall (Bottom piece below window)
        if (sillHeight > 0.05) {
            entities.push({
                model: 'v_ilev_cd_wall01',
                name: `Wall Sill (${materialId})`,
                room: roomId,
                pos: { x: wallPos.x, y: wallPos.y, z: wallPos.z },
                rot: { ...wallRot },
                scale: {
                    x: Number((wallLength / 4.0).toFixed(3)),
                    y: Number((wallThickness / 0.2).toFixed(3)),
                    z: Number((sillHeight / 3.0).toFixed(3))
                },
                materialId: materialId,
                customWall: true
            });
        }

        // 2. Header Wall (Top piece above window)
        const headerHeight = wallHeight - (sillHeight + windowHeight);
        if (headerHeight > 0.05) {
            entities.push({
                model: 'v_ilev_cd_wall01',
                name: `Wall Header (${materialId})`,
                room: roomId,
                pos: { x: wallPos.x, y: wallPos.y, z: wallPos.z + sillHeight + windowHeight },
                rot: { ...wallRot },
                scale: {
                    x: Number((wallLength / 4.0).toFixed(3)),
                    y: Number((wallThickness / 0.2).toFixed(3)),
                    z: Number((headerHeight / 3.0).toFixed(3))
                },
                materialId: materialId,
                customWall: true
            });
        }

        // 3. Left Wall Flank
        const flankWidth = (wallLength - windowWidth) / 2;
        if (flankWidth > 0.05) {
            entities.push({
                model: 'v_ilev_cd_wall01',
                name: `Wall Left Flank (${materialId})`,
                room: roomId,
                pos: { x: wallPos.x - (wallLength / 2 - flankWidth / 2), y: wallPos.y, z: wallPos.z + sillHeight },
                rot: { ...wallRot },
                scale: {
                    x: Number((flankWidth / 4.0).toFixed(3)),
                    y: Number((wallThickness / 0.2).toFixed(3)),
                    z: Number((windowHeight / 3.0).toFixed(3))
                },
                materialId: materialId,
                customWall: true
            });

            // 4. Right Wall Flank
            entities.push({
                model: 'v_ilev_cd_wall01',
                name: `Wall Right Flank (${materialId})`,
                room: roomId,
                pos: { x: wallPos.x + (wallLength / 2 - flankWidth / 2), y: wallPos.y, z: wallPos.z + sillHeight },
                rot: { ...wallRot },
                scale: {
                    x: Number((flankWidth / 4.0).toFixed(3)),
                    y: Number((wallThickness / 0.2).toFixed(3)),
                    z: Number((windowHeight / 3.0).toFixed(3))
                },
                materialId: materialId,
                customWall: true
            });
        }

        // 5. Window Glass Pane
        entities.push({
            model: 'v_ilev_bank_glass01',
            name: 'Window Glass Pane',
            room: roomId,
            pos: { x: wallPos.x, y: wallPos.y, z: wallPos.z + sillHeight },
            rot: { ...wallRot },
            scale: {
                x: Number((windowWidth / 2.0).toFixed(3)),
                y: 1.0,
                z: Number((windowHeight / 1.5).toFixed(3))
            },
            isWindowGlass: true
        });

        // 6. Interactive Curtains / Blinds
        if (curtainStyle === 'fabric_curtains') {
            // Open Curtains (Entity set 1)
            entities.push({
                model: 'prop_curtain_open_01',
                name: 'Luxury Velvet Curtains (Open)',
                room: roomId,
                pos: { x: wallPos.x, y: wallPos.y + 0.08, z: wallPos.z + sillHeight - 0.2 },
                rot: { ...wallRot },
                scale: { x: Number((windowWidth / 2.0).toFixed(3)), y: 1.0, z: Number((windowHeight / 2.2).toFixed(3)) },
                isCurtain: true,
                curtainState: 'open',
                curtainGroup: `curtain_win_${Date.now()}`
            });
        } else if (curtainStyle === 'venetian_blinds') {
            entities.push({
                model: 'prop_blinds_open_01',
                name: 'Venetian Blinds (Open)',
                room: roomId,
                pos: { x: wallPos.x, y: wallPos.y + 0.05, z: wallPos.z + sillHeight },
                rot: { ...wallRot },
                scale: { x: Number((windowWidth / 1.8).toFixed(3)), y: 1.0, z: Number((windowHeight / 2.0).toFixed(3)) },
                isCurtain: true,
                curtainState: 'open',
                curtainGroup: `curtain_win_${Date.now()}`
            });
        } else if (curtainStyle === 'roller_blinds') {
            entities.push({
                model: 'prop_roller_blind_up',
                name: 'Motorized Roller Blind (Up)',
                room: roomId,
                pos: { x: wallPos.x, y: wallPos.y + 0.05, z: wallPos.z + sillHeight + windowHeight - 0.1 },
                rot: { ...wallRot },
                scale: { x: Number((windowWidth / 2.0).toFixed(3)), y: 1.0, z: 1.0 },
                isCurtain: true,
                curtainState: 'open',
                curtainGroup: `curtain_win_${Date.now()}`
            });
        }

        return entities;
    }
}

if (typeof module !== 'undefined') {
    module.exports = WallEditor;
}
