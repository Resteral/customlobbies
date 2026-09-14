/**
 * MLO Room Manager
 * Manages Room 0 (limbo exterior) and interior room definitions, bounding boxes, and timecycle presets.
 */

class RoomManager {
    constructor() {
        this.rooms = [];
        this.roomColors = [
            '#64748b', // Room 0 - limbo (slate)
            '#3b82f6', // Room 1 (blue)
            '#10b981', // Room 2 (green)
            '#f59e0b', // Room 3 (amber)
            '#8b5cf6', // Room 4 (purple)
            '#ec4899', // Room 5 (pink)
            '#06b6d4', // Room 6 (cyan)
            '#f97316'  // Room 7 (orange)
        ];
        this.initDefaultRooms();
    }

    initDefaultRooms() {
        this.rooms = [
            {
                id: 0,
                name: 'limbo',
                bbMin: [-20, -20, -5],
                bbMax: [20, 20, 10],
                timecycle: 'default',
                blend: 0.0,
                flags: 0,
                floorId: 0
            },
            {
                id: 1,
                name: 'main_room',
                bbMin: [-6, -6, 0],
                bbMax: [6, 6, 4],
                timecycle: 'int_hospital',
                blend: 1.0,
                flags: 0,
                floorId: 0
            }
        ];
    }

    getRooms() {
        return this.rooms;
    }

    getRoom(index) {
        return this.rooms[index] || null;
    }

    getRoomColor(index) {
        return this.roomColors[index % this.roomColors.length];
    }

    addRoom(name = '', timecycle = 'default') {
        const id = this.rooms.length;
        const roomName = name || `room_${id}`;
        const newRoom = {
            id: id,
            name: roomName,
            bbMin: [-4, -4, 0],
            bbMax: [4, 4, 3.5],
            timecycle: timecycle,
            blend: 1.0,
            flags: 0,
            floorId: 0
        };
        this.rooms.push(newRoom);
        return newRoom;
    }

    updateRoom(index, data) {
        if (this.rooms[index]) {
            this.rooms[index] = { ...this.rooms[index], ...data };
            return this.rooms[index];
        }
        return null;
    }

    deleteRoom(index) {
        if (index === 0) {
            console.warn('Cannot delete room 0 (limbo exterior)');
            return false;
        }
        this.rooms.splice(index, 1);
        // Re-index
        this.rooms.forEach((r, idx) => {
            r.id = idx;
        });
        return true;
    }

    /**
     * Auto calculates room bounding box based on its member entities
     */
    autoCalculateBounds(roomIndex, entities) {
        const roomEntities = entities.filter(e => e.room === roomIndex);
        if (roomEntities.length === 0) return;

        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        roomEntities.forEach(e => {
            const p = e.pos;
            minX = Math.min(minX, p.x - 2);
            minY = Math.min(minY, p.y - 2);
            minZ = Math.min(minZ, p.z);
            maxX = Math.max(maxX, p.x + 2);
            maxY = Math.max(maxY, p.y + 2);
            maxZ = Math.max(maxZ, p.z + 3.5);
        });

        if (this.rooms[roomIndex]) {
            this.rooms[roomIndex].bbMin = [
                Number(minX.toFixed(2)),
                Number(minY.toFixed(2)),
                Number(minZ.toFixed(2))
            ];
            this.rooms[roomIndex].bbMax = [
                Number(maxX.toFixed(2)),
                Number(maxY.toFixed(2)),
                Number(maxZ.toFixed(2))
            ];
        }
    }

    setRooms(newRooms) {
        this.rooms = newRooms;
    }
}

if (typeof module !== 'undefined') {
    module.exports = RoomManager;
}
