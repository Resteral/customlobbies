/**
 * The Sims Interactive Building Tools Engine (Ground-Up Edition)
 * Drag-to-build continuous walls, drag-to-build multi-story enclosed rooms, sledgehammer demolish,
 * pipette eyedropper, and ground-up architectural structural assembly.
 */

class SimsBuildTools {
    constructor(app) {
        this.app = app;
        this.activeTool = 'select'; // 'select' | 'drag_wall' | 'drag_room' | 'sledgehammer' | 'eyedropper' | 'stamp_prop'
        this.wallMaterial = 'drywall_white';
        this.floorMaterial = 'wood_oak_panel';
        this.ceilingMaterial = 'drywall_white';
        this.wallHeight = 3.2;
        this.wallThickness = 0.2;

        // Drag State
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0, z: 0 };
        this.dragCurrent = { x: 0, y: 0, z: 0 };

        // Stamp Placement State (Buy Mode)
        this.stampModel = null;
        this.stampRotationDeg = 0; // 0, 45, 90, 135, 180, 225, 270, 315

        // Wall Cutaway Mode ('full' | 'cutaway' | 'floor_only')
        this.wallCutawayMode = 'full';
    }

    setTool(toolName) {
        this.activeTool = toolName;
        SimsAudio.playClick();

        document.querySelectorAll('.sims-tool-btn').forEach(btn => {
            if (btn.getAttribute('data-sims-tool') === toolName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (toolName !== 'select' && this.app.viewport) {
            this.app.viewport.deselect();
        }
    }

    setStampProp(modelName) {
        this.stampModel = modelName;
        this.stampRotationDeg = 0;
        this.setTool('stamp_prop');
    }

    rotateStampProp(delta = 45) {
        this.stampRotationDeg = (this.stampRotationDeg + delta) % 360;
        SimsAudio.playClick();
    }

    startDrag(gridPoint) {
        if (this.activeTool === 'drag_wall' || this.activeTool === 'drag_room') {
            this.isDragging = true;
            this.dragStart = { ...gridPoint };
            this.dragCurrent = { ...gridPoint };
        }
    }

    updateDrag(gridPoint) {
        if (this.isDragging) {
            this.dragCurrent = { ...gridPoint };
        }
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;

        const p1 = this.dragStart;
        const p2 = this.dragCurrent;

        if (this.activeTool === 'drag_wall') {
            this.commitWall(p1, p2);
        } else if (this.activeTool === 'drag_room') {
            this.commitRoom(p1, p2);
        }
    }

    commitWall(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length < 0.4) return;

        const angleRad = Math.atan2(dy, dx);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const yawDeg = (angleRad * 180) / Math.PI;

        const quat = CodeWalkerXML.eulerToQuaternion(0, 0, yawDeg);
        const activeRoom = (this.app.selectedType === 'room' && this.app.selectedIndex > 0) ? this.app.selectedIndex : 1;
        const elevation = this.app.floorManager ? this.app.floorManager.getElevation() : 0.0;

        const wall = WallEditor.createCustomWall(activeRoom, {
            length: Number(length.toFixed(2)),
            height: this.wallHeight,
            thickness: this.wallThickness,
            materialId: this.wallMaterial,
            position: { x: Number(midX.toFixed(2)), y: Number(midY.toFixed(2)), z: Number(elevation.toFixed(2)) },
            rotation: quat
        });

        this.app.project.entities.push(wall);
        SimsAudio.playWallBuild();
        this.app.refreshAll();
    }

    commitRoom(p1, p2) {
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);

        const width = maxX - minX;
        const length = maxY - minY;

        if (width < 0.8 || length < 0.8) return;

        const elevation = this.app.floorManager ? this.app.floorManager.getElevation() : 0.0;
        const currentFloor = this.app.floorManager ? this.app.floorManager.currentFloor : 1;
        const roomName = `Room_${currentFloor}_${this.app.project.rooms.length}`;

        // 1. Register new MLO Room Def
        const newRoom = this.app.roomManager.addRoom(roomName, 'int_clothes_high');
        const newRoomId = newRoom.id;

        // 2. Build Ground-Up Room Structure via WallFramingEngine
        const roomBuild = WallFramingEngine.buildGroundUpRoom(minX, maxX, minY, maxY, {
            elevation: elevation,
            height: this.wallHeight,
            thickness: this.wallThickness,
            wallMaterial: this.wallMaterial,
            floorMaterial: this.floorMaterial,
            ceilingMaterial: this.ceilingMaterial,
            roomId: newRoomId
        });

        // Set bounds
        newRoom.bbMin = roomBuild.bounds.bbMin;
        newRoom.bbMax = roomBuild.bounds.bbMax;

        // Push entities
        roomBuild.entities.forEach(ent => {
            this.app.project.entities.push(ent);
        });

        // 3. Connect Portal from Limbo (Room 0) or adjacent room if this is first room
        if (this.app.project.rooms.length > 1) {
            const portal = WallFramingEngine.createDoorwayPortal(0, newRoomId, {
                x: (minX + maxX) / 2,
                y: minY,
                z: elevation
            });
            this.app.portalManager.portals.push({
                id: this.app.portalManager.portals.length,
                ...portal
            });
        }

        SimsAudio.playChime();
        this.app.refreshAll();
        this.app.selectItem('room', newRoomId);
    }

    commitStampPlacement(gridPoint) {
        if (!this.stampModel) return;

        const activeRoom = (this.app.selectedType === 'room' && this.app.selectedIndex > 0) ? this.app.selectedIndex : 1;
        const quat = CodeWalkerXML.eulerToQuaternion(0, 0, this.stampRotationDeg);
        const meta = GTA_PROP_LIBRARY.find(p => p.model === this.stampModel) || { name: this.stampModel };
        const elevation = this.app.floorManager ? this.app.floorManager.getElevation() : 0.0;

        const entity = {
            id: 'prop_' + Date.now(),
            name: meta.name || this.stampModel,
            model: this.stampModel,
            room: activeRoom,
            pos: { x: Number(gridPoint.x.toFixed(2)), y: Number(gridPoint.y.toFixed(2)), z: Number(elevation.toFixed(2)) },
            rot: quat,
            scale: { x: 1, y: 1, z: 1 }
        };

        if (this.stampModel.includes('curtain') || this.stampModel.includes('blind')) {
            entity.isCurtain = true;
            entity.curtainState = this.stampModel.includes('closed') ? 'closed' : 'open';
        }

        this.app.project.entities.push(entity);
        SimsAudio.playPlace();
        this.app.refreshAll();
    }

    handleSledgehammer(type, index) {
        if (type === 'entity' && this.app.project.entities[index]) {
            this.app.project.entities.splice(index, 1);
            SimsAudio.playDemolish();
            this.app.refreshAll();
        } else if (type === 'portal' && this.app.project.portals[index]) {
            this.app.portalManager.deletePortal(index);
            SimsAudio.playDemolish();
            this.app.refreshAll();
        }
    }

    handleEyedropper(type, index) {
        if (type === 'entity' && this.app.project.entities[index]) {
            const source = this.app.project.entities[index];
            this.setStampProp(source.model);
            SimsAudio.playClick();
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = SimsBuildTools;
}
