/**
 * MLO Portal Manager
 * Manages 4-vertex portals connecting rooms, normal calculation, and occlusion flags.
 */

class PortalManager {
    constructor() {
        this.portals = [];
        this.initDefaultPortals();
    }

    initDefaultPortals() {
        this.portals = [
            {
                id: 0,
                fromRoom: 0, // Limbo exterior
                toRoom: 1,   // Main room
                flags: 0,
                mirrorPriority: 0,
                opacity: 0,
                vertices: [
                    { x: -1.0, y: -6.0, z: 0.0 },
                    { x: -1.0, y: -6.0, z: 2.8 },
                    { x: 1.0, y: -6.0, z: 2.8 },
                    { x: 1.0, y: -6.0, z: 0.0 }
                ],
                attachedObjects: []
            }
        ];
    }

    getPortals() {
        return this.portals;
    }

    getPortal(index) {
        return this.portals[index] || null;
    }

    addPortal(fromRoom = 0, toRoom = 1, centerPos = { x: 0, y: 0, z: 0 }, width = 2.0, height = 2.8, axis = 'x') {
        const id = this.portals.length;
        let verts = [];

        if (axis === 'x') {
            // Doorway aligned along X-axis (facing Y)
            const halfW = width / 2;
            verts = [
                { x: centerPos.x - halfW, y: centerPos.y, z: centerPos.z },
                { x: centerPos.x - halfW, y: centerPos.y, z: centerPos.z + height },
                { x: centerPos.x + halfW, y: centerPos.y, z: centerPos.z + height },
                { x: centerPos.x + halfW, y: centerPos.y, z: centerPos.z }
            ];
        } else {
            // Doorway aligned along Y-axis (facing X)
            const halfW = width / 2;
            verts = [
                { x: centerPos.x, y: centerPos.y - halfW, z: centerPos.z },
                { x: centerPos.x, y: centerPos.y - halfW, z: centerPos.z + height },
                { x: centerPos.x, y: centerPos.y + halfW, z: centerPos.z + height },
                { x: centerPos.x, y: centerPos.y + halfW, z: centerPos.z }
            ];
        }

        const newPortal = {
            id: id,
            fromRoom: fromRoom,
            toRoom: toRoom,
            flags: 0,
            mirrorPriority: 0,
            opacity: 0,
            vertices: verts,
            attachedObjects: []
        };

        this.portals.push(newPortal);
        return newPortal;
    }

    updatePortal(index, data) {
        if (this.portals[index]) {
            this.portals[index] = { ...this.portals[index], ...data };
            return this.portals[index];
        }
        return null;
    }

    deletePortal(index) {
        if (this.portals[index]) {
            this.portals.splice(index, 1);
            this.portals.forEach((p, idx) => {
                p.id = idx;
            });
            return true;
        }
        return false;
    }

    /**
     * Calculates normal vector for portal plane
     */
    calculateNormal(portal) {
        const v = portal.vertices;
        if (!v || v.length < 3) return { x: 0, y: 1, z: 0 };

        // Vector A = v1 - v0
        const ax = v[1].x - v[0].x;
        const ay = v[1].y - v[0].y;
        const az = v[1].z - v[0].z;

        // Vector B = v2 - v0
        const bx = v[2].x - v[0].x;
        const by = v[2].y - v[0].y;
        const bz = v[2].z - v[0].z;

        // Cross product A x B
        let nx = ay * bz - az * by;
        let ny = az * bx - ax * bz;
        let nz = ax * by - ay * bx;

        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        return {
            x: Number((nx / len).toFixed(4)),
            y: Number((ny / len).toFixed(4)),
            z: Number((nz / len).toFixed(4))
        };
    }

    /**
     * Calculates center point of portal
     */
    calculateCenter(portal) {
        const v = portal.vertices;
        if (!v || v.length === 0) return { x: 0, y: 0, z: 0 };

        let cx = 0, cy = 0, cz = 0;
        v.forEach(pt => {
            cx += pt.x;
            cy += pt.y;
            cz += pt.z;
        });

        return {
            x: Number((cx / v.length).toFixed(3)),
            y: Number((cy / v.length).toFixed(3)),
            z: Number((cz / v.length).toFixed(3))
        };
    }

    setPortals(newPortals) {
        this.portals = newPortals;
    }
}

if (typeof module !== 'undefined') {
    module.exports = PortalManager;
}
