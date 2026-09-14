/**
 * 3D WebGL Viewport Engine for FiveM MLO Creator - Photorealistic Sims Edition
 * Built with Three.js: PBR Materials with Normal & Roughness Maps, Realistic Furniture Meshes,
 * Environment Lighting, Animated Door Swings, Architectural Baseboards/Moldings, and Real-time Metric Dimensions.
 */

class Viewport3D {
    constructor(containerId, onSelectCallback, onTransformChangeCallback) {
        this.container = document.getElementById(containerId);
        this.onSelectCallback = onSelectCallback;
        this.onTransformChangeCallback = onTransformChangeCallback;

        this.scene = null;
        this.camera = null;
        this.orthoCamera = null;
        this.activeCamera = null;
        this.renderer = null;
        this.orbitControls = null;
        this.transformControls = null;
        this.raycaster = new THREE.Raycaster();
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        this.mouse = new THREE.Vector2();

        // PBR & Environment Engines
        this.pbrEngine = new PBRMaterialEngine();
        this.envLighting = null;

        // Scene Groups
        this.roomBoxesGroup = new THREE.Group();
        this.roomTrimsGroup = new THREE.Group();
        this.portalsGroup = new THREE.Group();
        this.entitiesGroup = new THREE.Group();
        this.shellGroup = new THREE.Group();
        this.helpersGroup = new THREE.Group();
        this.simsOverlayGroup = new THREE.Group();
        this.dimensionsGroup = new THREE.Group();

        // Sims Drag & Ghost Preview
        this.dragPreviewMesh = null;
        this.ghostPlacementMesh = null;
        this.plumbobMesh = null;

        // Options
        this.showTrims = true;
        this.showDimensions = true;

        // Selected State
        this.selectedObject = null;
        this.selectedType = null;
        this.selectedIndex = -1;

        // Snapping & Transform Mode
        this.snapGrid = 0.5;
        this.snapRotate = (15 * Math.PI) / 180;
        this.transformMode = 'translate';

        // Camera Modes
        this.cameraViewMode = 'perspective';
        this.walkState = {
            forward: false, backward: false, left: false, right: false,
            speed: 6.0, velocity: new THREE.Vector3(), direction: new THREE.Vector3()
        };
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0c1322);
        this.scene.fog = new THREE.FogExp2(0x0c1322, 0.01);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
        this.camera.position.set(16, 18, 20);

        const aspect = width / height;
        const frustumSize = 28;
        this.orthoCamera = new THREE.OrthographicCamera(
            (frustumSize * aspect) / -2, (frustumSize * aspect) / 2,
            frustumSize / 2, frustumSize / -2, 0.1, 1000
        );
        this.orthoCamera.position.set(0, 35, 0);
        this.orthoCamera.lookAt(0, 0, 0);

        this.activeCamera = this.camera;

        // 3. Renderer with High-Fidelity Tone Mapping & PCF Soft Shadows
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);

        // 4. Realistic Environmental Lighting Engine
        this.envLighting = new EnvironmentLighting(this.scene, this.renderer);

        // 5. Orbit Controls
        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.08;
        this.orbitControls.target.set(0, 1.2, 0);
        this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
        this.orbitControls.update();

        // 6. Transform Controls
        this.transformControls = new THREE.TransformControls(this.activeCamera, this.renderer.domElement);
        this.transformControls.setTranslationSnap(this.snapGrid);
        this.transformControls.setRotationSnap(this.snapRotate);
        this.transformControls.size = 0.75;
        this.scene.add(this.transformControls);

        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
        });

        this.transformControls.addEventListener('objectChange', () => {
            if (this.selectedObject && this.onTransformChangeCallback) {
                this.onTransformChangeCallback(this.selectedType, this.selectedIndex, this.selectedObject);
                this.updatePlumbobPosition();
            }
        });

        // 7. Grid & Helpers
        const gridHelper = new THREE.GridHelper(60, 60, 0x06b6d4, 0x1e293b);
        gridHelper.position.y = 0.001;
        this.helpersGroup.add(gridHelper);

        this.createPlumbob();

        this.scene.add(this.helpersGroup);
        this.scene.add(this.roomBoxesGroup);
        this.scene.add(this.roomTrimsGroup);
        this.scene.add(this.portalsGroup);
        this.scene.add(this.entitiesGroup);
        this.scene.add(this.shellGroup);
        this.scene.add(this.simsOverlayGroup);
        this.scene.add(this.dimensionsGroup);

        // 8. Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.renderer.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.renderer.domElement.addEventListener('pointerup', (e) => this.onPointerUp(e));
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    createPlumbob() {
        const geom = new THREE.ConeGeometry(0.25, 0.5, 6);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x22c55e,
            emissive: 0x15803d,
            emissiveIntensity: 0.7,
            roughness: 0.15,
            metalness: 0.6
        });

        const topCone = new THREE.Mesh(geom, mat);
        const bottomCone = new THREE.Mesh(geom, mat);
        bottomCone.rotation.x = Math.PI;

        this.plumbobMesh = new THREE.Group();
        this.plumbobMesh.add(topCone);
        this.plumbobMesh.add(bottomCone);
        this.plumbobMesh.visible = false;
        this.scene.add(this.plumbobMesh);
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        const aspect = width / height;
        const frustumSize = 28;
        this.orthoCamera.left = (frustumSize * aspect) / -2;
        this.orthoCamera.right = (frustumSize * aspect) / 2;
        this.orthoCamera.top = frustumSize / 2;
        this.orthoCamera.bottom = frustumSize / -2;
        this.orthoCamera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    getGroundIntersection(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.activeCamera);
        const intersectPoint = new THREE.Vector3();
        const hit = this.raycaster.ray.intersectPlane(this.groundPlane, intersectPoint);

        if (hit) {
            const snap = this.snapGrid > 0 ? this.snapGrid : 0.5;
            return {
                x: Math.round(intersectPoint.x / snap) * snap,
                y: -Math.round(intersectPoint.z / snap) * snap,
                z: 0
            };
        }
        return null;
    }

    onPointerDown(event) {
        if (event.button !== 0) return;

        const buildTools = window.app ? window.app.simsBuildTools : null;

        if (buildTools && (buildTools.activeTool === 'drag_wall' || buildTools.activeTool === 'drag_room')) {
            const gridPoint = this.getGroundIntersection(event);
            if (gridPoint) {
                this.orbitControls.enabled = false;
                buildTools.startDrag(gridPoint);
                return;
            }
        }

        if (buildTools && buildTools.activeTool === 'stamp_prop') {
            const gridPoint = this.getGroundIntersection(event);
            if (gridPoint) {
                buildTools.commitStampPlacement(gridPoint);
                return;
            }
        }

        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.activeCamera);

        const entityIntersects = this.raycaster.intersectObjects(this.entitiesGroup.children, true);
        if (entityIntersects.length > 0) {
            let rootMesh = entityIntersects[0].object;
            while (rootMesh.parent && rootMesh.parent !== this.entitiesGroup) {
                rootMesh = rootMesh.parent;
            }
            if (rootMesh.userData && rootMesh.userData.type === 'entity') {
                const idx = rootMesh.userData.index;

                if (rootMesh.userData.isDoor && event.detail === 2) {
                    RealisticFixtures.toggleDoor(rootMesh);
                    return;
                }

                if (buildTools && buildTools.activeTool === 'sledgehammer') {
                    buildTools.handleSledgehammer('entity', idx);
                } else if (buildTools && buildTools.activeTool === 'eyedropper') {
                    buildTools.handleEyedropper('entity', idx);
                } else {
                    this.selectObject('entity', idx, rootMesh);
                }
                return;
            }
        }

        const portalIntersects = this.raycaster.intersectObjects(this.portalsGroup.children, true);
        if (portalIntersects.length > 0) {
            let rootMesh = portalIntersects[0].object;
            while (rootMesh.parent && rootMesh.parent !== this.portalsGroup) {
                rootMesh = rootMesh.parent;
            }
            if (rootMesh.userData && rootMesh.userData.type === 'portal') {
                const idx = rootMesh.userData.index;
                if (buildTools && buildTools.activeTool === 'sledgehammer') {
                    buildTools.handleSledgehammer('portal', idx);
                } else {
                    this.selectObject('portal', idx, rootMesh);
                }
                return;
            }
        }
    }

    onPointerMove(event) {
        const buildTools = window.app ? window.app.simsBuildTools : null;
        if (!buildTools) return;

        const gridPoint = this.getGroundIntersection(event);
        if (!gridPoint) return;

        if (buildTools.isDragging) {
            buildTools.updateDrag(gridPoint);
            this.renderDragPreview(buildTools.activeTool, buildTools.dragStart, buildTools.dragCurrent);
        } else if (buildTools.activeTool === 'stamp_prop') {
            this.renderGhostPlacement(buildTools.stampModel, gridPoint, buildTools.stampRotationDeg);
        }
    }

    onPointerUp(event) {
        const buildTools = window.app ? window.app.simsBuildTools : null;
        if (buildTools && buildTools.isDragging) {
            buildTools.endDrag();
            this.clearDragPreview();
            this.orbitControls.enabled = true;
        }
    }

    renderDragPreview(tool, p1, p2) {
        this.clearDragPreview();

        if (tool === 'drag_wall') {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 0.2) return;

            const angleRad = Math.atan2(dy, dx);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            const geo = new THREE.BoxGeometry(len, 3.0, 0.2);
            const mat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.6 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(midX, 1.5, -midY);
            mesh.rotation.y = -angleRad;

            this.dragPreviewMesh = mesh;
            this.simsOverlayGroup.add(mesh);
        } else if (tool === 'drag_room') {
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);
            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);

            const w = maxX - minX;
            const l = maxY - minY;
            if (w < 0.5 || l < 0.5) return;

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            const geo = new THREE.BoxGeometry(w, 3.0, l);
            const mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.7 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(centerX, 1.5, -centerY);

            this.dragPreviewMesh = mesh;
            this.simsOverlayGroup.add(mesh);
        }
    }

    clearDragPreview() {
        if (this.dragPreviewMesh) {
            this.simsOverlayGroup.remove(this.dragPreviewMesh);
            this.dragPreviewMesh = null;
        }
    }

    renderGhostPlacement(modelName, gridPoint, rotationDeg) {
        if (!this.ghostPlacementMesh) {
            const meta = GTA_PROP_LIBRARY.find(p => p.model === modelName) || { size: [1, 1, 1] };
            const [sx, sy, sz] = meta.size || [1, 1, 1];

            const geo = new THREE.BoxGeometry(sx, sz, sy);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x22c55e,
                transparent: true,
                opacity: 0.6,
                roughness: 0.2
            });
            this.ghostPlacementMesh = new THREE.Mesh(geo, mat);
            this.simsOverlayGroup.add(this.ghostPlacementMesh);
        }

        this.ghostPlacementMesh.position.set(gridPoint.x, 0.5, -gridPoint.y);
        this.ghostPlacementMesh.rotation.y = (-rotationDeg * Math.PI) / 180;
    }

    clearGhostPlacement() {
        if (this.ghostPlacementMesh) {
            this.simsOverlayGroup.remove(this.ghostPlacementMesh);
            this.ghostPlacementMesh = null;
        }
    }

    updatePlumbobPosition() {
        if (!this.plumbobMesh || !this.selectedObject) {
            if (this.plumbobMesh) this.plumbobMesh.visible = false;
            return;
        }

        const p = this.selectedObject.position;
        this.plumbobMesh.position.set(p.x, p.y + 2.5, p.z);
        this.plumbobMesh.visible = true;
    }

    selectObject(type, index, threeObject = null) {
        this.selectedType = type;
        this.selectedIndex = index;

        if (threeObject) {
            this.selectedObject = threeObject;
        } else {
            if (type === 'entity') {
                this.selectedObject = this.entitiesGroup.children.find(c => c.userData.index === index) || null;
            } else if (type === 'portal') {
                this.selectedObject = this.portalsGroup.children.find(c => c.userData.index === index) || null;
            } else {
                this.selectedObject = null;
            }
        }

        if (this.selectedObject) {
            this.transformControls.attach(this.selectedObject);
            this.updatePlumbobPosition();
            SimsAudio.playClick();
        } else {
            this.transformControls.detach();
            if (this.plumbobMesh) this.plumbobMesh.visible = false;
        }

        if (this.onSelectCallback) {
            this.onSelectCallback(type, index);
        }
    }

    deselect() {
        this.selectedType = null;
        this.selectedIndex = -1;
        this.selectedObject = null;
        this.transformControls.detach();
        if (this.plumbobMesh) this.plumbobMesh.visible = false;
        this.clearGhostPlacement();
        if (this.onSelectCallback) {
            this.onSelectCallback(null, -1);
        }
    }

    setCameraView(mode) {
        this.cameraViewMode = mode;
        const target = this.orbitControls.target;

        if (mode === 'perspective') {
            this.activeCamera = this.camera;
            this.transformControls.camera = this.camera;
            this.camera.position.set(16, 18, 20);
            this.orbitControls.object = this.camera;
            this.orbitControls.enabled = true;
        } else if (mode === 'top') {
            this.activeCamera = this.orthoCamera;
            this.transformControls.camera = this.orthoCamera;
            this.orthoCamera.position.set(target.x, 35, target.z);
            this.orthoCamera.lookAt(target.x, target.y, target.z);
            this.orbitControls.object = this.orthoCamera;
            this.orbitControls.enabled = true;
        } else if (mode === 'front') {
            this.activeCamera = this.orthoCamera;
            this.transformControls.camera = this.orthoCamera;
            this.orthoCamera.position.set(target.x, target.y, target.z + 35);
            this.orthoCamera.lookAt(target.x, target.y, target.z);
            this.orbitControls.object = this.orthoCamera;
            this.orbitControls.enabled = true;
        } else if (mode === 'walk') {
            this.activeCamera = this.camera;
            this.transformControls.camera = this.camera;
            this.camera.position.set(0, 1.7, 0);
            this.orbitControls.enabled = false;
        }

        this.orbitControls.update();
    }

    setTransformMode(mode) {
        this.transformMode = mode;
        this.transformControls.setMode(mode);
    }

    setSnapGrid(grid) {
        this.snapGrid = grid;
        this.transformControls.setTranslationSnap(grid > 0 ? grid : null);
    }

    setSnapRotate(deg) {
        this.snapRotate = (deg * Math.PI) / 180;
        this.transformControls.setRotationSnap(deg > 0 ? this.snapRotate : null);
    }

    renderRooms(rooms) {
        while (this.roomBoxesGroup.children.length > 0) {
            this.roomBoxesGroup.remove(this.roomBoxesGroup.children[0]);
        }
        while (this.roomTrimsGroup.children.length > 0) {
            this.roomTrimsGroup.remove(this.roomTrimsGroup.children[0]);
        }

        rooms.forEach((room, idx) => {
            if (idx === 0) return;

            const min = room.bbMin || [-4, -4, 0];
            const max = room.bbMax || [4, 4, 3.5];
            const sx = Math.max(max[0] - min[0], 0.1);
            const sy = Math.max(max[1] - min[1], 0.1);
            const sz = Math.max(max[2] - min[2], 0.1);

            const px = (min[0] + max[0]) / 2;
            const py = (min[1] + max[1]) / 2;
            const pz = (min[2] + max[2]) / 2;

            const geo = new THREE.BoxGeometry(sx, sz, sy);
            const mat = new THREE.MeshBasicMaterial({
                color: room.name.includes('bath') ? 0x06b6d4 : 0x3b82f6,
                wireframe: true,
                transparent: true,
                opacity: 0.35
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(px, pz, -py);

            const group = new THREE.Group();
            group.add(mesh);
            group.userData = { type: 'room', index: idx };
            this.roomBoxesGroup.add(group);

            if (this.showTrims) {
                const baseboards = EnvironmentLighting.createBaseboards(room);
                const crown = EnvironmentLighting.createCrownMolding(room);
                this.roomTrimsGroup.add(baseboards);
                this.roomTrimsGroup.add(crown);
            }
        });
    }

    renderPortals(portals) {
        while (this.portalsGroup.children.length > 0) {
            this.portalsGroup.remove(this.portalsGroup.children[0]);
        }

        portals.forEach((p, idx) => {
            const v = p.vertices;
            if (!v || v.length < 4) return;

            const group = new THREE.Group();
            group.userData = { type: 'portal', index: idx };

            const p0 = new THREE.Vector3(v[0].x, v[0].z, -v[0].y);
            const p1 = new THREE.Vector3(v[1].x, v[1].z, -v[1].y);
            const p2 = new THREE.Vector3(v[2].x, v[2].z, -v[2].y);
            const p3 = new THREE.Vector3(v[3].x, v[3].z, -v[3].y);

            const geo = new THREE.BufferGeometry();
            const verts = new Float32Array([
                p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z,
                p0.x, p0.y, p0.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z
            ]);
            geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
            geo.computeVertexNormals();

            const mat = new THREE.MeshStandardMaterial({
                color: 0x06b6d4, transparent: true, opacity: 0.45,
                side: THREE.DoubleSide, roughness: 0.2, metalness: 0.5
            });
            group.add(new THREE.Mesh(geo, mat));

            const lineGeo = new THREE.BufferGeometry().setFromPoints([p0, p1, p2, p3, p0]);
            group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })));

            const center = new THREE.Vector3(
                (p0.x + p1.x + p2.x + p3.x) / 4,
                (p0.y + p1.y + p2.y + p3.y) / 4,
                (p0.z + p1.z + p2.z + p3.z) / 4
            );
            const normal = new THREE.Vector3();
            normal.crossVectors(new THREE.Vector3().subVectors(p1, p0), new THREE.Vector3().subVectors(p2, p0)).normalize();
            group.add(new THREE.ArrowHelper(normal, center, 1.2, 0x10b981, 0.3, 0.15));

            this.portalsGroup.add(group);
        });
    }

    renderEntities(entities, propDatabase = GTA_PROP_LIBRARY) {
        while (this.entitiesGroup.children.length > 0) {
            this.entitiesGroup.remove(this.entitiesGroup.children[0]);
        }

        entities.forEach((ent, idx) => {
            const meta = propDatabase.find(p => p.model.toLowerCase() === (ent.model || '').toLowerCase()) || {
                size: [1.0, 1.0, 1.0], category: 'props', name: ent.model
            };

            const size = meta.size || [1.0, 1.0, 1.0];
            const scale = ent.scale || { x: 1, y: 1, z: 1 };
            const sx = size[0] * scale.x;
            const sy = size[1] * scale.y;
            const sz = size[2] * scale.z;

            let entGroup = new THREE.Group();
            entGroup.userData = { type: 'entity', index: idx, model: ent.model, isCurtain: ent.isCurtain, isDoor: ent.model.includes('door') };

            // 1. High-Fidelity PBR Textured Walls & Floors
            if (ent.materialId) {
                const pbrMat = this.pbrEngine.getMaterial(ent.materialId, { repeatX: Math.max(sx / 2, 1), repeatY: Math.max(sz / 2, 1) });
                const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), pbrMat);
                wallMesh.castShadow = true;
                wallMesh.receiveShadow = true;
                wallMesh.position.y = sz / 2;
                entGroup.add(wallMesh);
            }
            // 2. Realistic Architectural Doors with Working Swing
            else if (ent.model.includes('door') && !ent.model.includes('roller')) {
                const doorMesh = RealisticFixtures.createDoor({ width: sx, height: sz });
                doorMesh.position.y = 0;
                entGroup.add(doorMesh);
                entGroup.userData.pivot = doorMesh.userData.pivot;
                entGroup.userData.isDoor = true;
            }
            // 3. Realistic Double-Hung Windows with Glass
            else if (ent.isWindowGlass || (meta.category === 'windows' && ent.model.includes('window'))) {
                const winMesh = RealisticFixtures.createWindow({ width: sx, height: sz });
                entGroup.add(winMesh);
            }
            // 4. Curtains with Physical Cloth Folds
            else if (ent.isCurtain || (meta.category === 'windows' && (ent.model.includes('curtain') || ent.model.includes('blind')))) {
                const isOpen = ent.curtainState !== 'closed';
                if (ent.model.includes('curtain')) {
                    const drapeWidth = isOpen ? sx * 0.25 : sx * 0.48;
                    const curtainMat = new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.9, metalness: 0.05 });
                    const left = new THREE.Mesh(new THREE.BoxGeometry(drapeWidth, sz, sy), curtainMat);
                    left.position.set(-sx / 2 + drapeWidth / 2, sz / 2, 0);
                    const right = new THREE.Mesh(new THREE.BoxGeometry(drapeWidth, sz, sy), curtainMat);
                    right.position.set(sx / 2 - drapeWidth / 2, sz / 2, 0);
                    entGroup.add(left); entGroup.add(right);

                    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, sx * 1.1, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85 }));
                    rod.rotation.z = Math.PI / 2;
                    rod.position.set(0, sz, 0);
                    entGroup.add(rod);
                } else {
                    const blindHeight = isOpen ? sz * 0.2 : sz;
                    const blind = new THREE.Mesh(new THREE.BoxGeometry(sx, blindHeight, sy), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
                    blind.position.set(0, sz - blindHeight / 2, 0);
                    entGroup.add(blind);
                }
            }
            // 5. BEDROOM FURNITURE (Bed, Nightstand, Wardrobe)
            else if (meta.category === 'bedroom') {
                if (ent.model.includes('bed') && !ent.model.includes('side')) {
                    // King Platform Bed with Pillows & Duvet
                    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.35, sy), frameMat);
                    frame.position.set(0, 0.175, 0);
                    entGroup.add(frame);

                    const headboard = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, 0.15), frameMat);
                    headboard.position.set(0, sz / 2, sy / 2 - 0.075);
                    entGroup.add(headboard);

                    // Mattress & Duvet
                    const duvetMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 }); // Navy Duvet
                    const mattress = new THREE.Mesh(new THREE.BoxGeometry(sx * 0.94, 0.25, sy * 0.88), duvetMat);
                    mattress.position.set(0, 0.45, -sy * 0.04);
                    entGroup.add(mattress);

                    // Pillows
                    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
                    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), pillowMat);
                    pillow1.position.set(-0.5, 0.65, sy * 0.3);
                    pillow1.rotation.x = -0.2;
                    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), pillowMat);
                    pillow2.position.set(0.5, 0.65, sy * 0.3);
                    pillow2.rotation.x = -0.2;
                    entGroup.add(pillow1); entGroup.add(pillow2);
                } else if (ent.model.includes('bedside')) {
                    // Bedside Nightstand
                    const woodMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
                    const table = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), woodMat);
                    table.position.y = sz / 2;
                    entGroup.add(table);

                    const lampMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 });
                    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.08, 0.35, 16), lampMat);
                    lamp.position.set(0, sz + 0.18, 0);
                    entGroup.add(lamp);
                } else if (ent.model.includes('wardrobe')) {
                    // Wardrobe Closet
                    const closetMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
                    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), closetMat);
                    wardrobe.position.y = sz / 2;
                    entGroup.add(wardrobe);

                    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
                    const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8), handleMat);
                    h1.position.set(-0.05, sz / 2, -sy / 2 - 0.02);
                    const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8), handleMat);
                    h2.position.set(0.05, sz / 2, -sy / 2 - 0.02);
                    entGroup.add(h1); entGroup.add(h2);
                }
            }
            // 6. LIVING ROOM FURNITURE (Sofa, Armchair, TV, Table, Rug, Plant)
            else if (meta.category === 'living') {
                if (ent.model.includes('sofa')) {
                    // Luxury Leather Sectional Couch
                    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.35 });
                    const base = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.45, sy), leatherMat);
                    base.position.set(0, 0.225, 0);
                    const back = new THREE.Mesh(new THREE.BoxGeometry(sx, sz * 0.6, 0.25), leatherMat);
                    back.position.set(0, sz * 0.6, sy / 2 - 0.125);
                    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, sz * 0.5, sy), leatherMat);
                    armL.position.set(-sx / 2 + 0.125, sz * 0.45, 0);
                    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, sz * 0.5, sy), leatherMat);
                    armR.position.set(sx / 2 - 0.125, sz * 0.45, 0);

                    entGroup.add(base); entGroup.add(back); entGroup.add(armL); entGroup.add(armR);
                } else if (ent.model.includes('armchair')) {
                    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.8 });
                    const chairBase = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.4, sy), velvetMat);
                    chairBase.position.y = 0.2;
                    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(sx, sz * 0.6, 0.2), velvetMat);
                    chairBack.position.set(0, sz * 0.6, sy / 2 - 0.1);
                    entGroup.add(chairBase); entGroup.add(chairBack);
                } else if (ent.model.includes('tv_flat')) {
                    // 65-inch Flat Screen TV
                    const tvMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.8 });
                    const tv = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), tvMat);
                    tv.position.y = sz / 2;
                    entGroup.add(tv);

                    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
                    const screen = new THREE.Mesh(new THREE.PlaneGeometry(sx * 0.95, sz * 0.92), screenMat);
                    screen.position.set(0, sz / 2, -sy / 2 - 0.01);
                    screen.rotation.y = Math.PI;
                    entGroup.add(screen);
                } else if (ent.model.includes('rug')) {
                    const rugMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
                    const rug = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.02, sy), rugMat);
                    rug.position.y = 0.01;
                    entGroup.add(rug);
                } else if (ent.model.includes('plant')) {
                    const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
                    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.5, 20), potMat);
                    pot.position.y = 0.25;
                    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
                    const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), foliageMat);
                    foliage.position.y = 1.2;
                    entGroup.add(pot); entGroup.add(foliage);
                } else {
                    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 }));
                    mesh.position.y = sz / 2;
                    entGroup.add(mesh);
                }
            }
            // 7. KITCHEN & DINING FURNITURE
            else if (meta.category === 'kitchen') {
                if (ent.model.includes('counter') || ent.model.includes('bar')) {
                    const marbleTop = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.08, sy), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.1 }));
                    marbleTop.position.set(0, sz, 0);
                    const islandBase = new THREE.Mesh(new THREE.BoxGeometry(sx * 0.96, sz - 0.08, sy * 0.92), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }));
                    islandBase.position.set(0, (sz - 0.08) / 2, 0);
                    entGroup.add(marbleTop); entGroup.add(islandBase);
                } else if (ent.model.includes('fridge')) {
                    const steelMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.15 });
                    const fridge = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), steelMat);
                    fridge.position.y = sz / 2;
                    entGroup.add(fridge);
                } else if (ent.model.includes('barstool')) {
                    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 });
                    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, sz, 16), chromeMat);
                    pole.position.y = sz / 2;
                    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 20), new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4 }));
                    seat.position.y = sz;
                    entGroup.add(pole); entGroup.add(seat);
                } else {
                    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.3 }));
                    mesh.position.y = sz / 2;
                    entGroup.add(mesh);
                }
            }
            // 8. BATHROOM FIXTURES
            else if (meta.category === 'bathroom') {
                if (ent.model.includes('vanity')) {
                    const vanity = RealisticFixtures.createLuxuryVanity();
                    entGroup.add(vanity);
                } else if (ent.model.includes('toilet')) {
                    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
                    const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.6), whiteMat);
                    base.position.set(0, 0.22, -0.1);
                    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.25), whiteMat);
                    tank.position.set(0, 0.6, 0.18);
                    entGroup.add(base); entGroup.add(tank);
                } else if (ent.model.includes('tub') || ent.model.includes('jacuzzi')) {
                    const tub = new THREE.Mesh(new THREE.CylinderGeometry(sx / 2, sx / 2.2, sz, 24), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15 }));
                    tub.position.y = sz / 2;
                    entGroup.add(tub);
                } else if (ent.model.includes('shower')) {
                    const pan = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.1, sy), new THREE.MeshStandardMaterial({ color: 0x334155 }));
                    pan.position.y = 0.05;
                    const glass = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, 0.04), new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, transmission: 0.9 }));
                    glass.position.set(0, sz / 2, sy / 2);
                    entGroup.add(pan); entGroup.add(glass);
                } else {
                    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 }));
                    mesh.position.y = sz / 2;
                    entGroup.add(mesh);
                }
            }
            // 9. OFFICE / TECH / CRIME / INDUSTRIAL
            else {
                let color = 0x94a3b8;
                if (meta.category === 'office') color = 0x475569;
                else if (meta.category === 'lighting') color = 0xfef08a;
                else if (meta.category === 'crime') color = 0x15803d;
                else if (meta.category === 'tech') color = 0x0284c7;
                else if (meta.category === 'industrial') color = 0xea580c;

                const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sz, sy), new THREE.MeshStandardMaterial({ color: color, roughness: 0.5, metalness: 0.2 }));
                mesh.castShadow = true; mesh.receiveShadow = true; mesh.position.y = sz / 2;
                entGroup.add(mesh);

                const dirMesh = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
                dirMesh.rotation.x = Math.PI / 2;
                dirMesh.position.set(0, sz + 0.1, -sy / 2 - 0.2);
                entGroup.add(dirMesh);
            }

            const pos = ent.pos || { x: 0, y: 0, z: 0 };
            entGroup.position.set(pos.x, pos.z, -pos.y);

            if (ent.rot) {
                const q = ent.rot;
                entGroup.quaternion.set(q.x, q.z, -q.y, q.w);
            }

            this.entitiesGroup.add(entGroup);
        });

        if (this.selectedType === 'entity' && this.selectedIndex >= 0) {
            this.selectObject('entity', this.selectedIndex);
        }
    }

    onKeyDown(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        const buildTools = window.app ? window.app.simsBuildTools : null;

        switch (event.code) {
            case 'KeyG': this.setTransformMode('translate'); break;
            case 'KeyR':
                if (buildTools && buildTools.activeTool === 'stamp_prop') {
                    buildTools.rotateStampProp(45);
                } else {
                    this.setTransformMode('rotate');
                }
                break;
            case 'KeyS': if (!event.ctrlKey) this.setTransformMode('scale'); break;
            case 'KeyK': if (buildTools) buildTools.setTool('sledgehammer'); break;
            case 'KeyE': if (buildTools && buildTools.activeTool === 'stamp_prop') buildTools.rotateStampProp(45); break;
            case 'KeyQ': if (buildTools && buildTools.activeTool === 'stamp_prop') buildTools.rotateStampProp(-45); break;
            case 'KeyW': this.walkState.forward = true; break;
            case 'KeyA': this.walkState.left = true; break;
            case 'KeyD': this.walkState.right = true; break;
            case 'Escape':
                if (buildTools && buildTools.activeTool !== 'select') {
                    buildTools.setTool('select');
                    this.clearGhostPlacement();
                } else {
                    this.deselect();
                }
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.walkState.forward = false; break;
            case 'KeyA': this.walkState.left = false; break;
            case 'KeyD': this.walkState.right = false; break;
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();

        if (this.plumbobMesh && this.plumbobMesh.visible) {
            this.plumbobMesh.rotation.y += delta * 2.0;
        }

        if (this.cameraViewMode === 'walk') {
            this.walkState.velocity.x = 0;
            this.walkState.velocity.z = 0;
            if (this.walkState.forward) this.walkState.velocity.z -= this.walkState.speed * delta;
            if (this.walkState.left) this.walkState.velocity.x -= this.walkState.speed * delta;
            if (this.walkState.right) this.walkState.velocity.x += this.walkState.speed * delta;

            this.camera.translateZ(this.walkState.velocity.z);
            this.camera.translateX(this.walkState.velocity.x);
            this.camera.position.y = 1.7;
        } else {
            this.orbitControls.update();
        }

        this.renderer.render(this.scene, this.activeCamera);
    }
}

if (typeof module !== 'undefined') {
    module.exports = Viewport3D;
}
