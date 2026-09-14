/**
 * FiveM MLO Creator - Master Application Controller (Ground-Up Architectural Studio)
 * Coordinates Sims Drag Build Tools, Multi-Floor Levels (B1, F1, F2, F3), Wall Framing Engine,
 * PBR Materials, Environment Lighting, Door Swings, Trims, and CodeWalker Exporter.
 */

class MloApp {
    constructor() {
        this.project = {
            name: 'mlo_custom_interior',
            displayName: 'Custom High-End Interior',
            archetype: 'hei_dlc_mlo_custom',
            position: { x: 970.2, y: -100.5, z: 74.0 },
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            rooms: [],
            portals: [],
            entities: [],
            entitySets: []
        };

        // Core Managers
        this.roomManager = new RoomManager();
        this.portalManager = new PortalManager();
        this.entitySetsManager = new EntitySetsManager();
        this.floorManager = new FloorManager(this);
        this.simsBuildTools = new SimsBuildTools(this);

        this.viewport = null;
        this.selectedType = null;
        this.selectedIndex = -1;
        this.serverDeployPath = '';

        // Mode State
        this.simsMode = 'build';
        this.activeCatalogCategory = 'walls_rooms';

        this.init();
    }

    async init() {
        this.project.rooms = this.roomManager.getRooms();
        this.project.portals = this.portalManager.getPortals();

        this.viewport = new Viewport3D(
            'viewport-canvas-container',
            (type, index) => this.onViewportSelection(type, index),
            (type, index, obj) => this.onViewportTransform(type, index, obj)
        );

        await this.checkServerStatus();

        this.renderPropCatalog();
        this.renderModularTools();
        this.renderWallMaterials();
        this.renderBathroomPresets();
        this.renderSimsBottomCatalog();

        this.bindEvents();
        this.refreshAll();
    }

    async checkServerStatus() {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            if (data.detectedDeployRoot) {
                this.serverDeployPath = data.detectedDeployRoot;
                const deployInput = document.getElementById('export-deploy-path');
                if (deployInput) deployInput.value = data.detectedDeployRoot;
            }
        } catch (e) {
            console.log('Running in standalone mode.');
        }
    }

    setFloorLevel(floorId) {
        this.floorManager.setFloor(floorId);
        document.querySelectorAll('.floor-pill-btn').forEach(b => {
            if (parseInt(b.getAttribute('data-floor')) === floorId) b.classList.add('active');
            else b.classList.remove('active');
        });
        SimsAudio.playClick();
    }

    toggleTrims() {
        if (this.viewport) {
            this.viewport.showTrims = !this.viewport.showTrims;
            const btn = document.getElementById('btn-toggle-trims');
            if (btn) {
                if (this.viewport.showTrims) btn.classList.add('active');
                else btn.classList.remove('active');
            }
            this.viewport.renderRooms(this.project.rooms);
            SimsAudio.playClick();
        }
    }

    toggleSelectedDoor() {
        if (this.selectedType === 'entity' && this.viewport.selectedObject) {
            RealisticFixtures.toggleDoor(this.viewport.selectedObject);
        }
    }

    spawnFoundationSlab() {
        const slab = this.floorManager.createFoundationSlab(16.0, 16.0, 0.3, 'concrete_polished');
        this.project.entities.push(slab);
        SimsAudio.playWallBuild();
        this.refreshAll();
        alert('🏗️ Placed 16x16m Concrete Foundation Slab on Ground Floor (Z=0)!');
    }

    bindEvents() {
        // Floor Level Buttons
        document.querySelectorAll('.floor-pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fId = parseInt(e.currentTarget.getAttribute('data-floor'));
                this.setFloorLevel(fId);
            });
        });

        // Sims Mode Switcher
        document.querySelectorAll('.mode-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.getAttribute('data-mode');
                this.setSimsMode(mode);
            });
        });

        // Sims Tool Buttons
        document.querySelectorAll('.sims-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.getAttribute('data-sims-tool');
                this.simsBuildTools.setTool(tool);
            });
        });

        // Sidebar Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabId);
                SimsAudio.playClick();
            });
        });

        // Camera Views
        document.querySelectorAll('[data-camera-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.getAttribute('data-camera-view');
                document.querySelectorAll('[data-camera-view]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.viewport.setCameraView(mode);
                SimsAudio.playClick();
            });
        });

        // Transform Gizmo Mode
        document.querySelectorAll('[data-transform-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.getAttribute('data-transform-mode');
                document.querySelectorAll('[data-transform-mode]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.viewport.setTransformMode(mode);
                SimsAudio.playClick();
            });
        });

        // Snapping Controls
        const snapGridSelect = document.getElementById('snap-grid-select');
        if (snapGridSelect) {
            snapGridSelect.addEventListener('change', (e) => {
                this.viewport.setSnapGrid(parseFloat(e.target.value));
            });
        }

        const snapRotateSelect = document.getElementById('snap-rotate-select');
        if (snapRotateSelect) {
            snapRotateSelect.addEventListener('change', (e) => {
                this.viewport.setSnapRotate(parseFloat(e.target.value));
            });
        }

        // Prop Search
        const propSearch = document.getElementById('prop-search-input');
        if (propSearch) {
            propSearch.addEventListener('input', (e) => {
                this.renderPropCatalog(e.target.value);
            });
        }

        // Spawn Custom Wall
        const btnSpawnWall = document.getElementById('btn-spawn-custom-wall');
        if (btnSpawnWall) {
            btnSpawnWall.addEventListener('click', () => {
                const len = parseFloat(document.getElementById('wall-dim-length').value) || 4.0;
                const hgt = parseFloat(document.getElementById('wall-dim-height').value) || 3.0;
                const thk = parseFloat(document.getElementById('wall-dim-thickness').value) || 0.2;
                const mat = document.getElementById('wall-material-select').value || 'drywall_white';
                const activeRoom = (this.selectedType === 'room' && this.selectedIndex > 0) ? this.selectedIndex : 1;
                const elevation = this.floorManager.getElevation();

                const target = this.viewport.orbitControls.target;
                const wall = WallEditor.createCustomWall(activeRoom, {
                    length: len, height: hgt, thickness: thk, materialId: mat,
                    position: { x: Number(target.x.toFixed(2)), y: Number((-target.z).toFixed(2)), z: Number(elevation.toFixed(2)) }
                });

                this.project.entities.push(wall);
                SimsAudio.playWallBuild();
                this.refreshAll();
                this.selectItem('entity', this.project.entities.length - 1);
            });
        }

        // Punch Window & Curtains
        const btnPunchWindow = document.getElementById('btn-punch-window');
        if (btnPunchWindow) {
            btnPunchWindow.addEventListener('click', () => {
                const winW = parseFloat(document.getElementById('window-cutout-width').value) || 2.0;
                const winH = parseFloat(document.getElementById('window-cutout-height').value) || 1.6;
                const sillH = parseFloat(document.getElementById('window-cutout-sill').value) || 0.9;
                const curtainStyle = document.getElementById('window-curtain-style').value || 'fabric_curtains';
                const mat = document.getElementById('wall-material-select').value || 'drywall_white';
                const activeRoom = (this.selectedType === 'room' && this.selectedIndex > 0) ? this.selectedIndex : 1;
                const elevation = this.floorManager.getElevation();

                const target = this.viewport.orbitControls.target;
                const windowEntities = WallEditor.punchWindowOpening(
                    activeRoom,
                    { x: Number(target.x.toFixed(2)), y: Number((-target.z).toFixed(2)), z: Number(elevation.toFixed(2)) },
                    { x: 0, y: 0, z: 0, w: 1 },
                    {
                        wallLength: 4.0, wallHeight: 3.0, wallThickness: 0.2,
                        windowWidth: winW, windowHeight: winH, sillHeight: sillH,
                        materialId: mat, curtainStyle: curtainStyle
                    }
                );

                windowEntities.forEach(ent => { this.project.entities.push(ent); });

                if (curtainStyle !== 'none') {
                    if (!this.project.entitySets.some(s => s.name === 'curtains_open')) {
                        this.entitySetsManager.addEntitySet('curtains_open');
                    }
                    if (!this.project.entitySets.some(s => s.name === 'curtains_closed')) {
                        this.entitySetsManager.addEntitySet('curtains_closed');
                    }
                }

                SimsAudio.playPlace();
                this.refreshAll();
                alert(`✨ Successfully punched window cutout with attached ${curtainStyle.replace('_', ' ')}!`);
            });
        }

        // Add Room Button
        const btnAddRoom = document.getElementById('btn-add-room');
        if (btnAddRoom) {
            btnAddRoom.addEventListener('click', () => {
                const room = this.roomManager.addRoom();
                SimsAudio.playChime();
                this.refreshAll();
                this.selectItem('room', room.id);
            });
        }

        // Add Portal Button
        const btnAddPortal = document.getElementById('btn-add-portal');
        if (btnAddPortal) {
            btnAddPortal.addEventListener('click', () => {
                const portal = this.portalManager.addPortal(0, 1, { x: 0, y: 0, z: this.floorManager.getElevation() });
                SimsAudio.playPlace();
                this.refreshAll();
                this.selectItem('portal', portal.id);
            });
        }

        // Add Entity Set Button
        const btnAddEntitySet = document.getElementById('btn-add-entity-set');
        if (btnAddEntitySet) {
            btnAddEntitySet.addEventListener('click', () => {
                this.entitySetsManager.addEntitySet();
                this.refreshEntitySetsList();
            });
        }

        this.bindInspectorInputs();
        this.bindModals();

        // Hotkeys
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                this.deleteSelected();
            } else if (e.key === 'w' || e.key === 'W') {
                this.simsBuildTools.setTool('drag_wall');
            } else if (e.key === 'b' || e.key === 'B') {
                this.simsBuildTools.setTool('drag_room');
            } else if (e.key === 'k' || e.key === 'K') {
                this.simsBuildTools.setTool('sledgehammer');
            } else if (e.key === 'v' || e.key === 'V') {
                this.simsBuildTools.setTool('select');
            } else if (e.key === '1') {
                this.setFloorLevel(1);
            } else if (e.key === '2') {
                this.setFloorLevel(2);
            } else if (e.key === '0') {
                this.setFloorLevel(0);
            } else if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveProject();
            }
        });
    }

    setSimsMode(mode) {
        this.simsMode = mode;
        SimsAudio.playClick();

        document.querySelectorAll('.mode-tab-btn').forEach(b => {
            if (b.getAttribute('data-mode') === mode) b.classList.add('active');
            else b.classList.remove('active');
        });

        const categories = SIMS_CATALOG[mode] || [];
        if (categories.length > 0) {
            this.activeCatalogCategory = categories[0].id;
        }

        this.renderSimsBottomCatalog();
    }

    renderSimsBottomCatalog() {
        const pillsContainer = document.getElementById('sims-category-pills');
        const stripContainer = document.getElementById('sims-catalog-strip');
        if (!pillsContainer || !stripContainer) return;

        const categories = SIMS_CATALOG[this.simsMode] || [];
        pillsContainer.innerHTML = '';

        categories.forEach(cat => {
            const pill = document.createElement('div');
            pill.className = `sims-pill-btn ${cat.id === this.activeCatalogCategory ? 'active' : ''}`;
            pill.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
            pill.addEventListener('click', () => {
                this.activeCatalogCategory = cat.id;
                SimsAudio.playClick();
                this.renderSimsBottomCatalog();
            });
            pillsContainer.appendChild(pill);
        });

        stripContainer.innerHTML = '';
        const currentCat = categories.find(c => c.id === this.activeCatalogCategory);
        if (!currentCat) return;

        if (currentCat.subcategories) {
            currentCat.subcategories.forEach(sub => {
                const card = document.createElement('div');
                card.className = 'sims-item-card';
                card.title = sub.desc || sub.name;
                card.innerHTML = `
                    <div class="sims-item-icon">${sub.icon}</div>
                    <div class="sims-item-name">${sub.name}</div>
                `;
                card.addEventListener('click', () => {
                    if (sub.isTool) {
                        this.simsBuildTools.setTool(sub.isTool);
                    }
                });
                stripContainer.appendChild(card);
            });
        } else if (currentCat.materials) {
            currentCat.materials.forEach(mat => {
                const card = document.createElement('div');
                card.className = 'sims-item-card';
                card.title = mat.name;
                card.innerHTML = `
                    <div style="width:28px;height:28px;border-radius:4px;background:${mat.color};border:1px solid #fff;"></div>
                    <div class="sims-item-name">${mat.name.split(' ')[0]}</div>
                `;
                card.addEventListener('click', () => {
                    this.simsBuildTools.wallMaterial = mat.id;
                    SimsAudio.playClick();
                    alert(`Selected wall pattern: ${mat.name}`);
                });
                stripContainer.appendChild(card);
            });
        } else if (currentCat.models) {
            currentCat.models.forEach(modelName => {
                const prop = GTA_PROP_LIBRARY.find(p => p.model === modelName) || { name: modelName, icon: '📦' };
                const card = document.createElement('div');
                card.className = 'sims-item-card';
                card.title = `${prop.name} (${modelName})`;
                card.innerHTML = `
                    <div class="sims-item-icon">${prop.icon}</div>
                    <div class="sims-item-name">${prop.name}</div>
                `;
                card.addEventListener('click', () => {
                    this.simsBuildTools.setStampProp(modelName);
                });
                stripContainer.appendChild(card);
            });
        }
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(`tab-content-${tabId}`);

        if (targetBtn) targetBtn.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
    }

    renderPropCatalog(searchQuery = '') {
        const grid = document.getElementById('prop-catalog-grid');
        if (!grid) return;

        const q = searchQuery.toLowerCase().trim();
        const filtered = GTA_PROP_LIBRARY.filter(p => {
            return p.name.toLowerCase().includes(q) ||
                   p.model.toLowerCase().includes(q) ||
                   p.category.toLowerCase().includes(q) ||
                   (p.desc && p.desc.toLowerCase().includes(q));
        });

        grid.innerHTML = '';
        filtered.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'prop-card';
            card.innerHTML = `
                <div class="prop-card-preview">${prop.icon}</div>
                <div class="prop-card-name" title="${prop.name}">${prop.name}</div>
                <div class="prop-card-tag">${prop.model}</div>
            `;
            card.addEventListener('click', () => {
                this.simsBuildTools.setStampProp(prop.model);
            });
            grid.appendChild(card);
        });
    }

    renderModularTools() {
        const grid = document.getElementById('modular-tools-grid');
        if (!grid) return;

        const blocks = ModularBuilder.getBuildingBlocks();
        grid.innerHTML = '';

        blocks.forEach(block => {
            const btn = document.createElement('div');
            btn.className = 'mod-btn';
            btn.innerHTML = `
                <div class="mod-btn-icon">${block.icon}</div>
                <div class="mod-btn-title">${block.name}</div>
                <div class="mod-btn-desc">${block.size.join('x')}m</div>
            `;
            btn.addEventListener('click', () => {
                this.simsBuildTools.setStampProp(block.model);
            });
            grid.appendChild(btn);
        });

        const autoShellBtn = document.getElementById('btn-auto-room-shell');
        if (autoShellBtn) {
            autoShellBtn.addEventListener('click', () => {
                const activeRoomId = this.selectedType === 'room' ? this.selectedIndex : 1;
                const room = this.roomManager.getRoom(activeRoomId);
                if (room) {
                    const shellEntities = ModularBuilder.generateRoomShell(room);
                    shellEntities.forEach(ent => { this.project.entities.push(ent); });
                    SimsAudio.playChime();
                    this.refreshAll();
                    alert(`✅ Generated full modular walls, floor and ceiling for ${room.name}!`);
                }
            });
        }
    }

    renderWallMaterials() {
        const select = document.getElementById('wall-material-select');
        if (!select) return;

        select.innerHTML = '';
        WALL_MATERIALS.forEach(mat => {
            const opt = document.createElement('option');
            opt.value = mat.id;
            opt.textContent = mat.name;
            select.appendChild(opt);
        });
    }

    renderBathroomPresets() {
        const container = document.getElementById('bathroom-presets-grid');
        if (!container) return;

        const presets = BathroomBuilder.getPresets();
        container.innerHTML = '';

        presets.forEach(p => {
            const card = document.createElement('div');
            card.className = 'prop-card';
            card.style.height = 'auto';
            card.style.padding = '12px';
            card.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:24px;">${p.icon}</span>
                    <div>
                        <strong style="font-size:12px;color:var(--text-primary);">${p.name}</strong>
                        <div style="font-size:10px;color:var(--accent-cyan);font-family:var(--font-mono);">${p.size.join('x')}m</div>
                    </div>
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:6px;line-height:1.4;">${p.desc}</div>
                <button class="btn btn-primary btn-sm" style="margin-top:8px;width:100%;">
                    <span>🚽</span> Build ${p.name.split(' ')[0]} Bathroom
                </button>
            `;
            card.querySelector('button').addEventListener('click', () => {
                this.buildCompleteBathroom(p.id);
            });
            container.appendChild(card);
        });
    }

    buildCompleteBathroom(presetId) {
        const parentRoom = (this.selectedType === 'room' && this.selectedIndex > 0) ? this.selectedIndex : 1;
        const target = this.viewport.orbitControls.target;
        const elevation = this.floorManager.getElevation();

        const bathData = BathroomBuilder.generateCompleteBathroom(
            presetId, parentRoom,
            { x: Number(target.x.toFixed(2)), y: Number((-target.z).toFixed(2)), z: Number(elevation.toFixed(2)) }
        );

        const newRoom = this.roomManager.addRoom(bathData.room.name, bathData.room.timecycle);
        newRoom.bbMin = bathData.room.bbMin;
        newRoom.bbMax = bathData.room.bbMax;
        const newRoomId = newRoom.id;

        bathData.entities.forEach(ent => {
            ent.room = newRoomId;
            this.project.entities.push(ent);
        });

        bathData.portal.toRoom = newRoomId;
        this.portalManager.portals.push({
            id: this.portalManager.portals.length,
            ...bathData.portal
        });

        SimsAudio.playChime();
        this.refreshAll();
        alert(`🛁 Built complete ${bathData.room.name} with ${bathData.entities.length} fixtures and doorway portal!`);
    }

    refreshAll() {
        this.project.rooms = this.roomManager.getRooms();
        this.project.portals = this.portalManager.getPortals();
        this.project.entitySets = this.entitySetsManager.getEntitySets();

        this.viewport.renderRooms(this.project.rooms);
        this.viewport.renderPortals(this.project.portals);
        this.viewport.renderEntities(this.project.entities);

        const cost = (this.project.entities.length * 450) + (this.project.rooms.length * 3200);
        const budgetBadge = document.getElementById('sims-budget-display');
        if (budgetBadge) {
            budgetBadge.textContent = `§ ${cost.toLocaleString()} | ${this.project.entities.length} Props | ${this.project.rooms.length} Rooms`;
        }

        this.refreshHierarchyTree();
        this.refreshRoomsList();
        this.refreshPortalsList();
        this.refreshEntitySetsList();
        this.updateInspector();
    }

    refreshHierarchyTree() {
        const list = document.getElementById('hierarchy-tree-list');
        if (!list) return;
        list.innerHTML = '';

        const rootItem = document.createElement('div');
        rootItem.className = `tree-item ${this.selectedType === 'project' ? 'selected' : ''}`;
        rootItem.innerHTML = `<span>🏛️ <strong>${this.project.name}</strong></span><span class="tree-item-meta">MLO Root</span>`;
        rootItem.addEventListener('click', () => this.selectItem('project', 0));
        list.appendChild(rootItem);

        this.project.rooms.forEach((room, rIdx) => {
            const roomEl = document.createElement('div');
            roomEl.className = `tree-item ${this.selectedType === 'room' && this.selectedIndex === rIdx ? 'selected' : ''}`;
            roomEl.innerHTML = `
                <span>${room.name.includes('bath') ? '🛁' : '📦'} [Room ${rIdx}] <strong>${room.name}</strong></span>
                <span class="tree-item-meta">${room.timecycle}</span>
            `;
            roomEl.addEventListener('click', () => this.selectItem('room', rIdx));
            list.appendChild(roomEl);

            this.project.entities.forEach((ent, eIdx) => {
                if (ent.room === rIdx) {
                    const entEl = document.createElement('div');
                    entEl.className = `tree-item ${this.selectedType === 'entity' && this.selectedIndex === eIdx ? 'selected' : ''}`;
                    entEl.style.paddingLeft = '24px';
                    let icon = '🔹';
                    if (ent.isCurtain) icon = '🪟';
                    else if (ent.isFloor) icon = '🪵';
                    else if (ent.isCeiling) icon = '☁️';
                    else if (ent.materialId) icon = '🧱';
                    else if (ent.model.includes('door')) icon = '🚪';
                    else if (ent.model.includes('toilet') || ent.model.includes('tub') || ent.model.includes('shower')) icon = '🚽';

                    entEl.innerHTML = `
                        <span>${icon} ${ent.name || ent.model}</span>
                        <span class="tree-item-meta">#${eIdx + 1}</span>
                    `;
                    entEl.addEventListener('click', () => this.selectItem('entity', eIdx));
                    list.appendChild(entEl);
                }
            });
        });

        this.project.portals.forEach((p, pIdx) => {
            const pEl = document.createElement('div');
            pEl.className = `tree-item ${this.selectedType === 'portal' && this.selectedIndex === pIdx ? 'selected' : ''}`;
            pEl.innerHTML = `
                <span>🚪 [Portal ${pIdx}] R${p.fromRoom} ➔ R${p.toRoom}</span>
                <span class="tree-item-meta">4 Verts</span>
            `;
            pEl.addEventListener('click', () => this.selectItem('portal', pIdx));
            list.appendChild(pEl);
        });
    }

    refreshRoomsList() {
        const list = document.getElementById('rooms-list-container');
        if (!list) return;
        list.innerHTML = '';

        this.project.rooms.forEach((room, idx) => {
            const item = document.createElement('div');
            item.className = `tree-item ${this.selectedType === 'room' && this.selectedIndex === idx ? 'selected' : ''}`;
            item.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:10px;height:10px;border-radius:2px;background:${this.roomManager.getRoomColor(idx)}"></div>
                    <strong>${room.name}</strong> (ID: ${idx})
                </div>
                <div style="display:flex;gap:4px;">
                    ${idx > 0 ? `<button class="btn btn-default btn-sm" onclick="app.autoCalcRoomBounds(${idx})">Fit Bounds</button>` : ''}
                    ${idx > 0 ? `<button class="btn btn-default btn-sm" style="color:#ef4444;" onclick="app.deleteRoom(${idx})">✕</button>` : ''}
                </div>
            `;
            item.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') this.selectItem('room', idx);
            });
            list.appendChild(item);
        });
    }

    refreshPortalsList() {
        const list = document.getElementById('portals-list-container');
        if (!list) return;
        list.innerHTML = '';

        this.project.portals.forEach((portal, idx) => {
            const item = document.createElement('div');
            item.className = `tree-item ${this.selectedType === 'portal' && this.selectedIndex === idx ? 'selected' : ''}`;
            item.innerHTML = `
                <div>
                    🚪 <strong>Portal ${idx}</strong>: Room ${portal.fromRoom} ➔ Room ${portal.toRoom}
                </div>
                <button class="btn btn-default btn-sm" style="color:#ef4444;" onclick="app.deletePortal(${idx})">✕</button>
            `;
            item.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') this.selectItem('portal', idx);
            });
            list.appendChild(item);
        });
    }

    refreshEntitySetsList() {
        const list = document.getElementById('entity-sets-list-container');
        if (!list) return;
        list.innerHTML = '';

        this.project.entitySets.forEach((set, sIdx) => {
            const item = document.createElement('div');
            item.className = 'tree-item';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'stretch';
            item.style.gap = '8px';
            item.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:var(--accent-purple)">🏷️ ${set.name}</strong>
                    <button class="btn btn-default btn-sm" style="color:#ef4444;" onclick="app.deleteEntitySet(${sIdx})">✕</button>
                </div>
                <div style="font-size:11px;color:var(--text-muted)">
                    Attached Props: ${set.entities.length}
                </div>
            `;
            list.appendChild(item);
        });
    }

    selectItem(type, index) {
        this.selectedType = type;
        this.selectedIndex = index;

        if (type === 'entity') {
            this.viewport.selectObject('entity', index);
        } else if (type === 'portal') {
            this.viewport.selectObject('portal', index);
        } else {
            this.viewport.deselect();
        }

        this.refreshHierarchyTree();
        this.updateInspector();
    }

    onViewportSelection(type, index) {
        this.selectedType = type;
        this.selectedIndex = index;
        this.refreshHierarchyTree();
        this.updateInspector();
    }

    onViewportTransform(type, index, obj) {
        if (type === 'entity' && this.project.entities[index]) {
            const ent = this.project.entities[index];
            ent.pos.x = Number(obj.position.x.toFixed(4));
            ent.pos.y = Number((-obj.position.z).toFixed(4));
            ent.pos.z = Number(obj.position.y.toFixed(4));

            const q = obj.quaternion;
            ent.rot = {
                x: Number(q.x.toFixed(6)),
                y: Number((-q.z).toFixed(6)),
                z: Number(q.y.toFixed(6)),
                w: Number(q.w.toFixed(6))
            };

            this.updateInspectorValues();
        }
    }

    bindInspectorInputs() {
        const projName = document.getElementById('prop-project-name');
        if (projName) projName.addEventListener('input', (e) => { this.project.name = e.target.value; });

        const projArch = document.getElementById('prop-project-arch');
        if (projArch) projArch.addEventListener('input', (e) => { this.project.archetype = e.target.value; });

        ['x', 'y', 'z'].forEach(axis => {
            const inp = document.getElementById(`inspect-pos-${axis}`);
            if (inp) {
                inp.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (this.selectedType === 'entity' && this.project.entities[this.selectedIndex]) {
                        this.project.entities[this.selectedIndex].pos[axis] = val;
                        this.viewport.renderEntities(this.project.entities);
                    }
                });
            }
        });

        const roomSelect = document.getElementById('inspect-entity-room');
        if (roomSelect) {
            roomSelect.addEventListener('change', (e) => {
                if (this.selectedType === 'entity' && this.project.entities[this.selectedIndex]) {
                    this.project.entities[this.selectedIndex].room = parseInt(e.target.value);
                    this.refreshHierarchyTree();
                }
            });
        }

        const btnToggleCurtain = document.getElementById('btn-inspect-toggle-curtain');
        if (btnToggleCurtain) {
            btnToggleCurtain.addEventListener('click', () => {
                if (this.selectedType === 'entity' && this.project.entities[this.selectedIndex]) {
                    const ent = this.project.entities[this.selectedIndex];
                    CurtainManager.toggleCurtainState(ent);
                    SimsAudio.playPlace();
                    this.refreshAll();
                }
            });
        }
    }

    updateInspector() {
        const emptyState = document.getElementById('inspector-empty');
        const entityProps = document.getElementById('inspector-entity');
        const roomProps = document.getElementById('inspector-room');
        const portalProps = document.getElementById('inspector-portal');

        [emptyState, entityProps, roomProps, portalProps].forEach(el => {
            if (el) el.style.display = 'none';
        });

        if (this.selectedType === 'entity' && this.project.entities[this.selectedIndex]) {
            if (entityProps) entityProps.style.display = 'flex';
            const ent = this.project.entities[this.selectedIndex];

            const modelInput = document.getElementById('inspect-entity-model');
            if (modelInput) modelInput.value = ent.name || ent.model;

            const roomSelect = document.getElementById('inspect-entity-room');
            if (roomSelect) {
                roomSelect.innerHTML = '';
                this.project.rooms.forEach(r => {
                    const opt = document.createElement('option');
                    opt.value = r.id;
                    opt.textContent = `[Room ${r.id}] ${r.name}`;
                    if (r.id === ent.room) opt.selected = true;
                    roomSelect.appendChild(opt);
                });
            }

            const curtainControls = document.getElementById('inspector-curtain-controls');
            if (curtainControls) {
                if (ent.isCurtain || ent.model.includes('curtain') || ent.model.includes('blind')) {
                    curtainControls.style.display = 'flex';
                    const stateLabel = document.getElementById('inspect-curtain-state-label');
                    if (stateLabel) stateLabel.textContent = `State: ${ent.curtainState || 'open'}`;
                } else {
                    curtainControls.style.display = 'none';
                }
            }

            const doorControls = document.getElementById('inspector-door-controls');
            if (doorControls) {
                if (ent.model.includes('door') && !ent.model.includes('roller')) {
                    doorControls.style.display = 'flex';
                } else {
                    doorControls.style.display = 'none';
                }
            }

            this.updateInspectorValues();
        } else if (this.selectedType === 'room' && this.project.rooms[this.selectedIndex]) {
            if (roomProps) roomProps.style.display = 'flex';
            const room = this.project.rooms[this.selectedIndex];

            const nameInput = document.getElementById('inspect-room-name');
            if (nameInput) nameInput.value = room.name;

            const tcSelect = document.getElementById('inspect-room-timecycle');
            if (tcSelect) {
                tcSelect.innerHTML = '';
                TIMECYCLE_MODIFIERS.forEach(tc => {
                    const opt = document.createElement('option');
                    opt.value = tc.name;
                    opt.textContent = tc.label;
                    if (tc.name === room.timecycle) opt.selected = true;
                    tcSelect.appendChild(opt);
                });
            }
        } else if (this.selectedType === 'portal' && this.project.portals[this.selectedIndex]) {
            if (portalProps) portalProps.style.display = 'flex';
            const p = this.project.portals[this.selectedIndex];

            const fromSelect = document.getElementById('inspect-portal-from');
            const toSelect = document.getElementById('inspect-portal-to');

            [fromSelect, toSelect].forEach(sel => {
                if (sel) {
                    sel.innerHTML = '';
                    this.project.rooms.forEach(r => {
                        const opt = document.createElement('option');
                        opt.value = r.id;
                        opt.textContent = `Room ${r.id}: ${r.name}`;
                        sel.appendChild(opt);
                    });
                }
            });

            if (fromSelect) fromSelect.value = p.fromRoom;
            if (toSelect) toSelect.value = p.toRoom;
        } else {
            if (emptyState) emptyState.style.display = 'block';
        }
    }

    updateInspectorValues() {
        if (this.selectedType === 'entity' && this.project.entities[this.selectedIndex]) {
            const ent = this.project.entities[this.selectedIndex];
            const posX = document.getElementById('inspect-pos-x');
            const posY = document.getElementById('inspect-pos-y');
            const posZ = document.getElementById('inspect-pos-z');

            if (posX) posX.value = ent.pos.x.toFixed(2);
            if (posY) posY.value = ent.pos.y.toFixed(2);
            if (posZ) posZ.value = ent.pos.z.toFixed(2);

            const euler = CodeWalkerXML.quaternionToEuler(ent.rot || { x: 0, y: 0, z: 0, w: 1 });
            const rotX = document.getElementById('inspect-rot-x');
            const rotY = document.getElementById('inspect-rot-y');
            const rotZ = document.getElementById('inspect-rot-z');

            if (rotX) rotX.value = euler.pitch;
            if (rotY) rotY.value = euler.roll;
            if (rotZ) rotZ.value = euler.yaw;
        }
    }

    autoCalcRoomBounds(roomIndex) {
        this.roomManager.autoCalculateBounds(roomIndex, this.project.entities);
        SimsAudio.playClick();
        this.refreshAll();
    }

    deleteRoom(index) {
        if (confirm(`Are you sure you want to delete Room ${index}?`)) {
            this.roomManager.deleteRoom(index);
            SimsAudio.playDemolish();
            this.refreshAll();
        }
    }

    deletePortal(index) {
        this.portalManager.deletePortal(index);
        SimsAudio.playDemolish();
        this.refreshAll();
    }

    deleteEntitySet(index) {
        this.entitySetsManager.removeEntitySet(index);
        this.refreshEntitySetsList();
    }

    deleteSelected() {
        if (this.selectedType === 'entity' && this.selectedIndex >= 0) {
            this.project.entities.splice(this.selectedIndex, 1);
            this.selectItem(null, -1);
            SimsAudio.playDemolish();
            this.refreshAll();
        } else if (this.selectedType === 'portal' && this.selectedIndex >= 0) {
            this.deletePortal(this.selectedIndex);
            this.selectItem(null, -1);
        }
    }

    bindModals() {
        const btnOpenAi = document.getElementById('btn-open-ai-architect');
        const modalAi = document.getElementById('modal-ai-architect');
        if (btnOpenAi && modalAi) {
            btnOpenAi.addEventListener('click', () => {
                this.renderAiPresets();
                modalAi.classList.add('open');
                SimsAudio.playClick();
            });
        }

        const btnOpenXml = document.getElementById('btn-open-codewalker-xml');
        const modalXml = document.getElementById('modal-codewalker-xml');
        if (btnOpenXml && modalXml) {
            btnOpenXml.addEventListener('click', () => {
                this.previewCodeWalkerXml();
                modalXml.classList.add('open');
                SimsAudio.playClick();
            });
        }

        const btnOpenExport = document.getElementById('btn-open-export');
        const modalExport = document.getElementById('modal-export');
        if (btnOpenExport && modalExport) {
            btnOpenExport.addEventListener('click', () => {
                const nameInp = document.getElementById('export-resource-name');
                if (nameInp) nameInp.value = this.project.name;
                modalExport.classList.add('open');
                SimsAudio.playClick();
            });
        }

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.currentTarget.closest('.modal-backdrop');
                if (modal) modal.classList.remove('open');
                SimsAudio.playClick();
            });
        });

        const btnAiSubmit = document.getElementById('btn-ai-generate-submit');
        if (btnAiSubmit) {
            btnAiSubmit.addEventListener('click', async () => {
                const promptInp = document.getElementById('ai-prompt-input');
                if (!promptInp || !promptInp.value.trim()) return;

                btnAiSubmit.textContent = 'Generating 3D Interior...';
                btnAiSubmit.disabled = true;

                try {
                    const result = await AIArchitect.generate(promptInp.value.trim());
                    if (result) {
                        this.loadProjectData(result);
                        modalAi.classList.remove('open');
                        SimsAudio.playChime();
                        alert(`✨ AI successfully built "${result.displayName || result.name}" with ${result.rooms.length} rooms and ${result.entities.length} props!`);
                    }
                } catch (err) {
                    alert('Error generating interior: ' + err.message);
                } finally {
                    btnAiSubmit.textContent = 'Generate Full MLO';
                    btnAiSubmit.disabled = false;
                }
            });
        }

        const btnPerformExport = document.getElementById('btn-perform-export');
        if (btnPerformExport) {
            btnPerformExport.addEventListener('click', async () => {
                await this.exportFiveMResource();
            });
        }
    }

    renderAiPresets() {
        const container = document.getElementById('ai-presets-container');
        if (!container) return;

        const presets = AIArchitect.getPresetBlueprints();
        container.innerHTML = '';

        presets.forEach(p => {
            const card = document.createElement('div');
            card.className = 'tree-item';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:22px">${p.icon}</span>
                    <div>
                        <strong>${p.title}</strong>
                        <div style="font-size:11px;color:var(--text-muted)">${p.prompt}</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm">Select</button>
            `;
            card.addEventListener('click', () => {
                const inp = document.getElementById('ai-prompt-input');
                if (inp) inp.value = p.prompt;
                SimsAudio.playClick();
            });
            container.appendChild(card);
        });
    }

    previewCodeWalkerXml() {
        const ytypPreview = document.getElementById('preview-ytyp-xml');
        const ymapPreview = document.getElementById('preview-ymap-xml');

        if (ytypPreview) {
            ytypPreview.textContent = CodeWalkerXML.generateYtypXml(this.project);
        }
        if (ymapPreview) {
            ymapPreview.textContent = CodeWalkerXML.generateYmapXml(this.project);
        }
    }

    async exportFiveMResource() {
        const nameInp = document.getElementById('export-resource-name');
        const deployInp = document.getElementById('export-deploy-path');

        const resName = (nameInp && nameInp.value) ? nameInp.value.trim() : this.project.name;
        const deployPath = (deployInp && deployInp.value) ? deployInp.value.trim() : '';

        const ytypXml = CodeWalkerXML.generateYtypXml(this.project);
        const ymapXml = CodeWalkerXML.generateYmapXml(this.project);
        const fxmanifest = ResourceExporter.generateFxManifest(resName);
        const clientLua = ResourceExporter.generateClientLua(this.project);
        const configLua = ResourceExporter.generateConfigLua(this.project);
        const doorlocks = ResourceExporter.generateDoorlockConfig(this.project);

        const payload = {
            name: resName,
            deployPath: deployPath,
            ytypXml: ytypXml,
            ymapXml: ymapXml,
            fxmanifest: fxmanifest,
            clientLua: clientLua,
            configLua: configLua,
            doorlockConfig: doorlocks,
            projectJson: this.project
        };

        try {
            const res = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                SimsAudio.playChime();
                alert(`🚀 FiveM Resource Exported Successfully!\n\nLocation:\n${data.exportPath}\n\nFiles Generated:\n- fxmanifest.lua\n- client.lua (includes interactive curtains, doors & acoustic room reverbs)\n- config.lua\n- doorlocks.lua\n- stream/${resName}.ytyp.xml\n- stream/${resName}.ymap.xml\n- ${resName}.mlo.json`);
                const modal = document.getElementById('modal-export');
                if (modal) modal.classList.remove('open');
            } else {
                alert('Export failed: ' + data.error);
            }
        } catch (e) {
            alert('Export request error: ' + e.message);
        }
    }

    async saveProject() {
        try {
            const res = await fetch('/api/projects/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.project)
            });
            const data = await res.json();
            if (data.success) {
                SimsAudio.playChime();
                alert(`💾 Project saved successfully as "${data.filename}"!`);
            }
        } catch (e) {
            alert('Save error: ' + e.message);
        }
    }

    loadProjectData(data) {
        this.project = data;
        this.roomManager.setRooms(data.rooms || []);
        this.portalManager.setPortals(data.portals || []);
        this.entitySetsManager.setEntitySets(data.entitySets || []);
        this.refreshAll();
    }
}

let app = null;
window.addEventListener('DOMContentLoaded', () => {
    app = new MloApp();
});
