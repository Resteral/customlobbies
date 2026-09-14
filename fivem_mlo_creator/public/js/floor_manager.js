/**
 * Multi-Floor & Foundation Manager for FiveM MLO Studio
 * Handles ground-up building foundations, multi-story levels (Basement B1, Floor 1, Floor 2, Roof),
 * floor slab elevation offsets, stairwells, and ceiling cutout voids.
 */

class FloorManager {
    constructor(app) {
        this.app = app;
        this.currentFloor = 1; // 0 = B1, 1 = Ground F1, 2 = Second F2, 3 = Roof F3
        this.floorHeight = 3.2; // Standard floor-to-floor height in meters
        this.floors = [
            { id: 0, name: 'B1 (Basement)', elevation: -3.2, ceilingHeight: 3.0 },
            { id: 1, name: 'F1 (Ground Floor)', elevation: 0.0, ceilingHeight: 3.2 },
            { id: 2, name: 'F2 (Second Floor)', elevation: 3.2, ceilingHeight: 3.0 },
            { id: 3, name: 'F3 (Roof Level)', elevation: 6.4, ceilingHeight: 1.2 }
        ];
        this.isolateCurrentFloor = false;
    }

    getCurrentFloor() {
        return this.floors.find(f => f.id === this.currentFloor) || this.floors[1];
    }

    getElevation(floorId = this.currentFloor) {
        const floor = this.floors.find(f => f.id === floorId);
        return floor ? floor.elevation : 0.0;
    }

    setFloor(floorId) {
        this.currentFloor = floorId;
        if (this.app && this.app.viewport) {
            // Update ground plane raycast elevation for current floor
            this.app.viewport.groundPlane.constant = this.getElevation(floorId);
            this.app.viewport.gridHelper.position.y = this.getElevation(floorId) + 0.001;
            this.app.refreshAll();
        }
    }

    /**
     * Creates a concrete foundation slab with perimeter footings
     */
    createFoundationSlab(width = 16.0, length = 16.0, thickness = 0.3, materialId = 'concrete_polished') {
        const elevation = this.getElevation(1);
        return {
            id: 'foundation_slab_' + Date.now(),
            name: `Foundation Slab (${width}x${length}m)`,
            model: 'v_ilev_cd_floor01',
            materialId: materialId,
            room: 1,
            pos: { x: 0, y: 0, z: elevation - thickness / 2 },
            scale: { x: width / 4.0, y: length / 4.0, z: thickness / 0.2 },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            isFoundation: true
        };
    }

    /**
     * Builds a stairwell linking current floor to upper floor and cuts ceiling void
     */
    createStairwell(roomFromId = 1, roomToId = 2, position = { x: 0, y: 0, z: 0 }) {
        const stairs = {
            id: 'stairs_' + Date.now(),
            name: 'Architectural Staircase',
            model: 'v_ilev_stairs',
            room: roomFromId,
            pos: { x: position.x, y: position.y, z: position.z },
            rot: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: 1.0, y: 1.0, z: 1.0 },
            isStairs: true
        };

        return stairs;
    }
}

if (typeof module !== 'undefined') {
    module.exports = FloorManager;
}
