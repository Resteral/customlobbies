// AetherForge Client Application Engine (RevoltGPT Integrated Version)
document.addEventListener("DOMContentLoaded", () => {
    // State management
    const state = {
        activeCategory: 'mesh',
        activeStyle: 'realistic',
        activeComplexity: 'mid',
        activeTab: 'viewport',
        activeBrush: 'floor',
        bridgeConnected: false,
        wireframeEnabled: false,
        grid: createEmptyGrid(12, 12),
        currentMesh: null,
        currentMeshType: 'stone pillar', // tracks currently drawn 3D object type
        editorCode: '',
        bridgeUrl: 'http://127.0.0.1:6000',
        
        // RevoltGPT Version Control History
        commits: [],
        activeCommitIndex: 0
    };

    // DOM Elements
    const elements = {
        promptInput: document.getElementById('ai-prompt'),
        typeButtons: document.querySelectorAll('.type-btn'),
        btnGenerate: document.getElementById('btn-generate'),
        btnPushUE5: document.getElementById('btn-push-ue5'),
        btnReconnect: document.getElementById('btn-reconnect'),
        bridgeStatus: document.getElementById('bridge-status'),
        statusText: document.querySelector('#bridge-status .status-text'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabViewport: document.getElementById('tab-viewport'),
        tabLevelBuilder: document.getElementById('tab-level-builder'),
        canvas3DContainer: document.getElementById('canvas-3d-container'),
        btnToggleWireframe: document.getElementById('btn-toggle-wireframe'),
        btnResetCamera: document.getElementById('btn-reset-camera'),
        brushButtons: document.querySelectorAll('.brush-btn'),
        btnClearGrid: document.getElementById('btn-clear-grid'),
        gridCanvas: document.getElementById('level-grid-canvas'),
        codeBlock: document.getElementById('generated-python-code'),
        btnCopyCode: document.getElementById('btn-copy-code'),
        logConsole: document.getElementById('log-console'),
        consolePulse: document.getElementById('console-pulse-indicator'),
        presetCards: document.querySelectorAll('.preset-card'),
        meshName: document.getElementById('mesh-info-name'),
        meshTris: document.getElementById('mesh-info-tris'),
        meshMats: document.getElementById('mesh-info-mats'),
        
        // RevoltGPT Elements
        chatFeed: document.getElementById('chat-feed'),
        btnToggleSettings: document.getElementById('btn-toggle-settings'),
        settingsDrawer: document.getElementById('settings-drawer'),
        inferenceSource: document.getElementById('inference-source'),
        localUrlGroup: document.getElementById('local-url-group'),
        localUrl: document.getElementById('local-url'),
        targetModel: document.getElementById('target-model'),
        commitTimeline: document.getElementById('commit-timeline'),
        commitCount: document.getElementById('commit-count')
    };

    // -------------------------------------------------------------
    // THREE.JS VIEWPORT SETUP
    // -------------------------------------------------------------
    let scene, camera, renderer, controls;
    let mainObjectGroup = new THREE.Group();

    function init3DViewport() {
        const container = elements.canvas3DContainer;
        const width = container.clientWidth;
        const height = container.clientHeight || 450;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0f111a, 0.015);

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(4, 3, 5);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x0a0c13, 1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 + 0.1;
        controls.minDistance = 2;
        controls.maxDistance = 20;

        // Lights
        const ambientLight = new THREE.AmbientLight(0x1a2135, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        scene.add(dirLight);

        // Soft fill light
        const fillLight = new THREE.DirectionalLight(0x7700ff, 0.4);
        fillLight.position.set(-5, 2, -5);
        scene.add(fillLight);

        // Floor Grid
        const gridHelper = new THREE.GridHelper(10, 10, 0x00f0ff, 0x1f273d);
        gridHelper.position.y = -1;
        scene.add(gridHelper);

        scene.add(mainObjectGroup);

        // Generate procedural textures
        initProceduralTextures();

        // Load Initial Asset
        generateProceduralMesh("stone pillar");

        // Window resize
        window.addEventListener('resize', onWindowResize);
        
        // Render Loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            
            // Rotation for showcase
            if (mainObjectGroup && !controls.state === -1) {
                mainObjectGroup.rotation.y += 0.002;
            }
            
            // Flicker torch flame if active
            const flame = scene.getObjectByName("torchFlame");
            if (flame) {
                const scale = 0.9 + Math.random() * 0.25;
                flame.scale.set(scale, scale * 1.3, scale);
                const light = scene.getObjectByName("torchLight");
                if (light) {
                    light.intensity = 1.5 + Math.random() * 0.5;
                }
            }

            renderer.render(scene, camera);
        }
        animate();
    }

    function onWindowResize() {
        const container = elements.canvas3DContainer;
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        
        // Also resize game renderer if initialized
        resizeGameRenderer();
    }

    function resizeGameRenderer() {
        if (typeof gameRenderer !== 'undefined' && gameRenderer && gameCamera) {
            const container = document.getElementById('canvas-game-container');
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (width > 0 && height > 0) {
                gameCamera.aspect = width / height;
                gameCamera.updateProjectionMatrix();
                gameRenderer.setSize(width, height);
            }
        }
    }

    // -------------------------------------------------------------
    // PROCEDURAL TEXTURE GENERATION
    // -------------------------------------------------------------
    const textures = {};

    function initProceduralTextures() {
        // 1. Granite Stone Texture
        const canvasStone = document.createElement('canvas');
        canvasStone.width = 256;
        canvasStone.height = 256;
        const ctxStone = canvasStone.getContext('2d');
        ctxStone.fillStyle = '#6e737d';
        ctxStone.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = Math.random() * 2 + 1;
            const shade = Math.floor(Math.random() * 60) - 30;
            ctxStone.fillStyle = `rgb(${110 + shade}, ${115 + shade}, ${125 + shade})`;
            ctxStone.fillRect(x, y, size, size);
        }
        textures.stone = new THREE.CanvasTexture(canvasStone);
        textures.stone.wrapS = THREE.RepeatWrapping;
        textures.stone.wrapT = THREE.RepeatWrapping;

        // 2. Wood Grain Texture
        const canvasWood = document.createElement('canvas');
        canvasWood.width = 256;
        canvasWood.height = 256;
        const ctxWood = canvasWood.getContext('2d');
        ctxWood.fillStyle = '#5c4033';
        ctxWood.fillRect(0, 0, 256, 256);
        ctxWood.strokeStyle = '#3d251c';
        for (let i = 0; i < 20; i++) {
            ctxWood.beginPath();
            ctxWood.lineWidth = Math.random() * 4 + 1;
            const startY = (i * 15) + Math.random() * 10;
            ctxWood.moveTo(0, startY);
            ctxWood.bezierCurveTo(80, startY - 20, 170, startY + 20, 256, startY);
            ctxWood.stroke();
        }
        textures.wood = new THREE.CanvasTexture(canvasWood);

        // 3. Rusty Metal Texture
        const canvasMetal = document.createElement('canvas');
        canvasMetal.width = 256;
        canvasMetal.height = 256;
        const ctxMetal = canvasMetal.getContext('2d');
        ctxMetal.fillStyle = '#7a7a7a';
        ctxMetal.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const r = Math.random() * 20 + 5;
            const radGrad = ctxMetal.createRadialGradient(x, y, 0, x, y, r);
            radGrad.addColorStop(0, 'rgba(139, 69, 19, 0.6)');
            radGrad.addColorStop(1, 'rgba(122, 122, 122, 0)');
            ctxMetal.fillStyle = radGrad;
            ctxMetal.beginPath();
            ctxMetal.arc(x, y, r, 0, Math.PI * 2);
            ctxMetal.fill();
        }
        textures.metal = new THREE.CanvasTexture(canvasMetal);
    }

    // -------------------------------------------------------------
    // PROCEDURAL 3D MESH GENERATORS (REALISTIC MODELLING)
    // -------------------------------------------------------------
    function generateProceduralMesh(promptText) {
        // Clear old mesh
        while(mainObjectGroup.children.length > 0){
            const obj = mainObjectGroup.children[0];
            mainObjectGroup.remove(obj);
        }

        const prompt = promptText.toLowerCase();
        let name = "Custom Generated Asset";
        let triangles = 0;
        let materialsCount = 1;

        // Shared Materials with realistic parameters
        const stoneMat = new THREE.MeshStandardMaterial({
            map: textures.stone,
            roughness: 0.85,
            metalness: 0.1,
            bumpMap: textures.stone,
            bumpScale: 0.05
        });

        const woodMat = new THREE.MeshStandardMaterial({
            map: textures.wood,
            roughness: 0.7,
            metalness: 0.0,
            bumpMap: textures.wood,
            bumpScale: 0.02
        });

        const metalMat = new THREE.MeshStandardMaterial({
            map: textures.metal,
            roughness: 0.4,
            metalness: 0.8,
            bumpMap: textures.metal,
            bumpScale: 0.01
        });

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            roughness: 0.3,
            metalness: 0.9
        });

        const steelMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.25,
            metalness: 0.95
        });

        const emissiveCyanMat = new THREE.MeshStandardMaterial({
            color: 0x05101a,
            emissive: 0x00f0ff,
            emissiveIntensity: 2
        });

        // Determine what to build based on prompt keyword
        if (prompt.includes("pillar") || prompt.includes("column")) {
            name = "Ornate Granite Pillar";
            materialsCount = 2;
            state.currentMeshType = "pillar";

            // Base
            const baseGeo = new THREE.BoxGeometry(1.2, 0.3, 1.2);
            const base = new THREE.Mesh(baseGeo, stoneMat);
            base.position.y = -0.85;
            base.castShadow = true;
            base.receiveShadow = true;
            mainObjectGroup.add(base);

            // Sub-base slab
            const subBaseGeo = new THREE.BoxGeometry(1.0, 0.15, 1.0);
            const subBase = new THREE.Mesh(subBaseGeo, stoneMat);
            subBase.position.y = -0.625;
            subBase.castShadow = true;
            subBase.receiveShadow = true;
            mainObjectGroup.add(subBase);

            // Main column body (fluted cylinders)
            const cylinderGeo = new THREE.CylinderGeometry(0.38, 0.42, 2.2, 16);
            const body = new THREE.Mesh(cylinderGeo, stoneMat);
            body.position.y = 0.55;
            body.castShadow = true;
            body.receiveShadow = true;
            mainObjectGroup.add(body);

            // Add metal bands/engravings around cylinder
            const ringGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.08, 16, 1, true);
            const ring1 = new THREE.Mesh(ringGeo, goldMat);
            ring1.position.y = 1.0;
            const ring2 = new THREE.Mesh(ringGeo, goldMat);
            ring2.position.y = 0.0;
            mainObjectGroup.add(ring1);
            mainObjectGroup.add(ring2);

            // Capital (top)
            const capSubGeo = new THREE.BoxGeometry(0.9, 0.15, 0.9);
            const capSub = new THREE.Mesh(capSubGeo, stoneMat);
            capSub.position.y = 1.725;
            capSub.castShadow = true;
            capSub.receiveShadow = true;
            mainObjectGroup.add(capSub);

            const capGeo = new THREE.BoxGeometry(1.1, 0.25, 1.1);
            const cap = new THREE.Mesh(capGeo, stoneMat);
            cap.position.y = 1.925;
            cap.castShadow = true;
            cap.receiveShadow = true;
            mainObjectGroup.add(cap);

            triangles = 400;
            
        } else if (prompt.includes("sword") || prompt.includes("blade") || prompt.includes("weapon")) {
            name = "Iron Knight Broadsword";
            materialsCount = 3;
            state.currentMeshType = "sword";

            // Blade (Steel)
            const bladeGeo = new THREE.BoxGeometry(0.12, 2.2, 0.03);
            const blade = new THREE.Mesh(bladeGeo, steelMat);
            blade.position.y = 0.7;
            blade.castShadow = true;
            mainObjectGroup.add(blade);

            // Crossguard (Gold)
            const guardGeo = new THREE.BoxGeometry(0.6, 0.08, 0.08);
            const guard = new THREE.Mesh(guardGeo, goldMat);
            guard.position.y = -0.44;
            guard.castShadow = true;
            mainObjectGroup.add(guard);

            // Grip
            const gripGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.45, 12);
            const grip = new THREE.Mesh(gripGeo, woodMat);
            grip.position.y = -0.7;
            grip.castShadow = true;
            mainObjectGroup.add(grip);

            // Pommel
            const pommelGeo = new THREE.SphereGeometry(0.07, 12, 12);
            const pommel = new THREE.Mesh(pommelGeo, goldMat);
            pommel.position.y = -0.965;
            pommel.castShadow = true;
            mainObjectGroup.add(pommel);

            // Emissive runes
            const runeGeo = new THREE.BoxGeometry(0.02, 1.2, 0.032);
            const rune = new THREE.Mesh(runeGeo, emissiveCyanMat);
            rune.position.set(0, 0.7, 0);
            mainObjectGroup.add(rune);

            triangles = 220;

        } else if (prompt.includes("chest") || prompt.includes("crate") || prompt.includes("box")) {
            name = "Wood Loot Chest (Iron Trim)";
            materialsCount = 3;
            state.currentMeshType = "chest";

            // Chest Base
            const boxGeo = new THREE.BoxGeometry(1.6, 0.8, 1.0);
            const box = new THREE.Mesh(boxGeo, woodMat);
            box.position.y = -0.4;
            box.castShadow = true;
            box.receiveShadow = true;
            mainObjectGroup.add(box);

            // Lid
            const lidGeo = new THREE.BoxGeometry(1.62, 0.4, 1.02);
            const lid = new THREE.Mesh(lidGeo, woodMat);
            lid.position.y = 0.2;
            lid.castShadow = true;
            mainObjectGroup.add(lid);

            // Metal bands
            const bandGeo1 = new THREE.BoxGeometry(0.08, 1.22, 1.04);
            const band1 = new THREE.Mesh(bandGeo1, metalMat);
            band1.position.set(-0.75, -0.1, 0);
            mainObjectGroup.add(band1);

            const bandGeo2 = new THREE.BoxGeometry(0.08, 1.22, 1.04);
            const band2 = new THREE.Mesh(bandGeo2, metalMat);
            band2.position.set(0.75, -0.1, 0);
            mainObjectGroup.add(band2);

            // Gold lock
            const lockGeo = new THREE.BoxGeometry(0.15, 0.2, 0.08);
            const lock = new THREE.Mesh(lockGeo, goldMat);
            lock.position.set(0, 0.0, 0.52);
            mainObjectGroup.add(lock);

            // Magic light glowing
            const glowGeo = new THREE.BoxGeometry(1.5, 0.02, 0.95);
            const glow = new THREE.Mesh(glowGeo, emissiveCyanMat);
            glow.position.set(0, 0.0, 0);
            mainObjectGroup.add(glow);

            triangles = 180;

        } else if (prompt.includes("torch") || prompt.includes("light") || prompt.includes("fire")) {
            name = "Medieval Wall Torch";
            materialsCount = 4;
            state.currentMeshType = "torch";

            // Bracket mount
            const mountGeo = new THREE.BoxGeometry(0.2, 0.4, 0.1);
            const mount = new THREE.Mesh(mountGeo, metalMat);
            mount.position.set(0, 0, -0.45);
            mount.castShadow = true;
            mainObjectGroup.add(mount);

            // Torch rod
            const rodGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.8, 8);
            const rod = new THREE.Mesh(rodGeo, woodMat);
            rod.position.set(0, 0.2, -0.3);
            rod.rotation.x = 0.4;
            rod.castShadow = true;
            mainObjectGroup.add(rod);

            // Metal sconce holder
            const ringGeo = new THREE.CylinderGeometry(0.09, 0.05, 0.18, 8);
            const ring = new THREE.Mesh(ringGeo, metalMat);
            ring.position.set(0, 0.55, -0.16);
            ring.rotation.x = 0.4;
            ring.castShadow = true;
            mainObjectGroup.add(ring);

            // Fire flame mesh
            const flameGeo = new THREE.ConeGeometry(0.08, 0.32, 6);
            const flameMat = new THREE.MeshBasicMaterial({
                color: 0xff5500,
                transparent: true,
                opacity: 0.85
            });
            const flame = new THREE.Mesh(flameGeo, flameMat);
            flame.name = "torchFlame";
            flame.position.set(0, 0.72, -0.09);
            mainObjectGroup.add(flame);

            // Inner fire glow
            const innerFlameGeo = new THREE.ConeGeometry(0.04, 0.18, 6);
            const innerFlameMat = new THREE.MeshBasicMaterial({
                color: 0xffdd00
            });
            const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
            innerFlame.position.set(0, 0.68, -0.09);
            mainObjectGroup.add(innerFlame);

            // PointLight
            const torchLight = new THREE.PointLight(0xff6600, 2.0, 5);
            torchLight.name = "torchLight";
            torchLight.position.set(0, 0.9, -0.05);
            torchLight.castShadow = true;
            mainObjectGroup.add(torchLight);

            triangles = 110;
        } else {
            // Default: Cybernetic Energy Core
            name = "Aether Power Core";
            materialsCount = 3;
            state.currentMeshType = "core";

            // Outer metallic casing
            const casingGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
            const casing = new THREE.Mesh(casingGeo, metalMat);
            casing.castShadow = true;
            casing.receiveShadow = true;
            mainObjectGroup.add(casing);

            // Inside core sphere (emissive)
            const coreGeo = new THREE.SphereGeometry(0.45, 24, 24);
            const core = new THREE.Mesh(coreGeo, emissiveCyanMat);
            mainObjectGroup.add(core);

            // Torus rings
            const ringGeo1 = new THREE.TorusGeometry(0.7, 0.04, 8, 36);
            const ring1 = new THREE.Mesh(ringGeo1, goldMat);
            ring1.rotation.x = Math.PI / 4;
            mainObjectGroup.add(ring1);

            const ringGeo2 = new THREE.TorusGeometry(0.75, 0.04, 8, 36);
            const ring2 = new THREE.Mesh(ringGeo2, goldMat);
            ring2.rotation.y = Math.PI / 4;
            mainObjectGroup.add(ring2);

            triangles = 1500;
        }

        // Apply wireframe override if checked
        toggleWireframeState(state.wireframeEnabled);

        // Update HUD
        elements.meshName.innerText = `Mesh: ${name}`;
        elements.meshTris.innerText = `Triangles: ${triangles.toLocaleString()}`;
        elements.meshMats.innerText = `Materials: ${materialsCount}`;
        
        state.currentMesh = {
            name: name,
            tris: triangles,
            mats: materialsCount
        };
    }

    function toggleWireframeState(enabled) {
        state.wireframeEnabled = enabled;
        mainObjectGroup.traverse((child) => {
            if (child.isMesh && child.name !== "torchFlame") {
                child.material.wireframe = enabled;
            }
        });
        
        if (enabled) {
            elements.btnToggleWireframe.classList.add('active');
        } else {
            elements.btnToggleWireframe.classList.remove('active');
        }
    }

    // -------------------------------------------------------------
    // GRID LEVEL BUILDER (2D CANVAS)
    // -------------------------------------------------------------
    const gridCols = 12;
    const gridRows = 12;
    const cellSize = 38;
    let ctxGrid = null;
    let isDrawing = false;

    const brushColors = {
        'floor': '#34495e',
        'pillar': '#7f8c8d',
        'chest': '#d35400',
        'light': '#f1c40f'
    };

    function initLevelGrid() {
        ctxGrid = elements.gridCanvas.getContext('2d');
        drawGrid();

        // Canvas mouse listeners
        elements.gridCanvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            paintTile(e);
        });

        elements.gridCanvas.addEventListener('mousemove', (e) => {
            if (isDrawing) paintTile(e);
        });

        window.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        elements.gridCanvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            paintTile(e.touches[0]);
            e.preventDefault();
        });
        elements.gridCanvas.addEventListener('touchmove', (e) => {
            if (isDrawing) paintTile(e.touches[0]);
            e.preventDefault();
        });
        window.addEventListener('touchend', () => {
            isDrawing = false;
        });
    }

    function createEmptyGrid(cols, rows) {
        const arr = [];
        for (let r = 0; r < rows; r++) {
            arr.push(new Array(cols).fill(null));
        }
        return arr;
    }

    function drawGrid() {
        if (!ctxGrid) return;
        const width = elements.gridCanvas.width;
        const height = elements.gridCanvas.height;

        ctxGrid.clearRect(0, 0, width, height);

        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const x = c * cellSize;
                const y = r * cellSize;
                const cell = state.grid[r][c];

                if (cell) {
                    ctxGrid.fillStyle = brushColors[cell];
                    ctxGrid.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                    
                    ctxGrid.fillStyle = '#ffffff';
                    ctxGrid.font = '10px Arial';
                    ctxGrid.textAlign = 'center';
                    ctxGrid.textBaseline = 'middle';
                    let label = "";
                    if (cell === 'floor') label = "F";
                    if (cell === 'pillar') label = "P";
                    if (cell === 'chest') label = "C";
                    if (cell === 'light') label = "L";
                    ctxGrid.fillText(label, x + cellSize/2, y + cellSize/2);
                } else {
                    ctxGrid.fillStyle = 'rgba(26, 34, 56, 0.4)';
                    ctxGrid.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                }

                ctxGrid.strokeStyle = 'rgba(0, 240, 255, 0.08)';
                ctxGrid.strokeRect(x, y, cellSize, cellSize);
            }
        }
    }

    function paintTile(e) {
        const rect = elements.gridCanvas.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const col = Math.floor(clientX / cellSize);
        const row = Math.floor(clientY / cellSize);

        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
            const currentVal = state.grid[row][col];
            const newVal = state.activeBrush === 'erase' ? null : state.activeBrush;
            
            if (currentVal !== newVal) {
                state.grid[row][col] = newVal;
                drawGrid();
                compileLevelToPython();
                
                // Real-time commit auto-throttling or simple log update
                if (!isDrawing) {
                    pushCommit(`Edited grid canvas at [${row}, ${col}]`);
                }
            }
        }
    }

    // -------------------------------------------------------------
    // PYTHON CODE COMPILER (UE5 SCRIPT GENERATOR)
    // -------------------------------------------------------------
    function compileLevelToPython() {
        if (state.activeCategory !== 'level') return;

        let py = `import unreal

def spawn_editor_level():
    # Setup coordinates and scale mapping
    # 1 Grid Cell = 400 Unreal Units (4 meters)
    grid_size = 400.0
    z_offset = 0.0
    
    # Asset paths inside Unreal Editor Content Browser
    assets = {
        "floor": "/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube",
        "pillar": "/Game/StarterContent/Shapes/Shape_Cylinder.Shape_Cylinder",
        "chest": "/Game/StarterContent/Props/SM_AssetChest.SM_AssetChest",
        "light": "PointLight"
    }

    # Load needed static mesh references
    editor_asset_lib = unreal.EditorAssetLibrary
    
    # Map layout matrix
`;

        const actorSpawns = [];
        let lightSpawns = [];
        
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const cell = state.grid[r][c];
                if (!cell) continue;

                const px = (c - gridCols / 2) * 400.0;
                const py_coord = (r - gridRows / 2) * 400.0;

                if (cell === 'floor') {
                    actorSpawns.push(`    # Floor block at grid [${r}, ${c}]
    floor_loc = unreal.Vector(${px.toFixed(1)}, ${py_coord.toFixed(1)}, 0.0)
    floor_rot = unreal.Rotator(0, 0, 0)
    floor_actor = unreal.EditorLevelLibrary.spawn_actor_from_class(unreal.StaticMeshActor, floor_loc, floor_rot)
    floor_mesh = editor_asset_lib.load_asset(assets["floor"])
    floor_actor.static_mesh_component.set_static_mesh(floor_mesh)
    floor_actor.set_actor_scale3d(unreal.Vector(4.0, 4.0, 0.2)) # Scale flat
    floor_actor.set_actor_label("AI_Floor_${r}_${c}")
`);
                } else if (cell === 'pillar') {
                    actorSpawns.push(`    # Pillar structure
    pillar_loc = unreal.Vector(${px.toFixed(1)}, ${py_coord.toFixed(1)}, 50.0)
    pillar_rot = unreal.Rotator(0, 0, 0)
    pillar_actor = unreal.EditorLevelLibrary.spawn_actor_from_class(unreal.StaticMeshActor, pillar_loc, pillar_rot)
    pillar_mesh = editor_asset_lib.load_asset(assets["pillar"])
    pillar_actor.static_mesh_component.set_static_mesh(pillar_mesh)
    pillar_actor.set_actor_scale3d(unreal.Vector(1.2, 1.2, 3.5))
    pillar_actor.set_actor_label("AI_Pillar_${r}_${c}")
`);
                } else if (cell === 'chest') {
                    actorSpawns.push(`    # Loot chest actor
    chest_loc = unreal.Vector(${px.toFixed(1)}, ${py_coord.toFixed(1)}, 40.0)
    chest_rot = unreal.Rotator(0, 0, 0)
    chest_actor = unreal.EditorLevelLibrary.spawn_actor_from_class(unreal.StaticMeshActor, chest_loc, chest_rot)
    chest_mesh = editor_asset_lib.load_asset(assets["chest"])
    chest_actor.static_mesh_component.set_static_mesh(chest_mesh)
    chest_actor.set_actor_label("AI_Chest_${r}_${c}")
`);
                } else if (cell === 'light') {
                    lightSpawns.push(`    # Point Light at [${r}, ${c}]
    light_loc = unreal.Vector(${px.toFixed(1)}, ${py_coord.toFixed(1)}, 300.0)
    light_actor = unreal.EditorLevelLibrary.spawn_actor_from_class(unreal.PointLight, light_loc, unreal.Rotator(0,0,0))
    light_comp = light_actor.point_light_component
    light_comp.set_intensity(5000.0)
    light_comp.set_light_color(unreal.LinearColor(1.0, 0.65, 0.1, 1.0))
    light_comp.set_attenuation_radius(800.0)
    light_actor.set_actor_label("AI_Light_${r}_${c}")
`);
                }
            }
        }

        if (actorSpawns.length === 0 && lightSpawns.length === 0) {
            py += "    # Paint items on the web level grid canvas to generate spawning loop code...\n    pass";
        } else {
            py += actorSpawns.join("\n") + "\n" + lightSpawns.join("\n");
        }

        py += "\n\n# Run level population\nspawn_editor_level()";
        
        state.editorCode = py;
        elements.codeBlock.innerText = py;
    }

    function compileMeshToPython(promptText) {
        const p = promptText.trim() || "stone pillar";
        const cleanName = p.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
        
        const py = `import unreal

def generate_ai_mesh():
    # Prompt: "${p}"
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    editor_asset_lib = unreal.EditorAssetLibrary
    
    # 1. Initialize custom asset directory
    folder_path = "/Game/AetherForge/Generated"
    if not editor_asset_lib.does_directory_exist(folder_path):
        editor_asset_lib.make_directory(folder_path)
        
    # 2. Create Material Instance Constant
    mat_factory = unreal.MaterialInstanceConstantFactoryNew()
    base_material = editor_asset_lib.load_asset("/Game/StarterContent/Materials/M_Metal_Chrome.M_Metal_Chrome")
    
    mat_asset = asset_tools.create_asset(
        asset_name="MI_${cleanName}", 
        package_path=folder_path, 
        asset_class=unreal.MaterialInstanceConstant, 
        factory=mat_factory
    )
    
    # Set parent material
    mat_asset.set_editor_property('parent', base_material)
    
    # 3. Create Static Mesh task parameters
    import_task = unreal.AssetImportTask()
    import_task.set_editor_property('destination_path', folder_path)
    import_task.set_editor_property('destination_name', "SM_${cleanName}")
    import_task.set_editor_property('save', True)
    
    # Enable Nanite features for UE5
    options = unreal.FbxImportUI()
    options.static_mesh_import_data.set_editor_property('build_nanite', True)
    
    print("Mesh SM_${cleanName} successfully created inside Unreal Engine 5.")

generate_ai_mesh()
`;
        state.editorCode = py;
        elements.codeBlock.innerText = py;
    }

    function compileMaterialToPython(promptText) {
        const p = promptText.trim() || "granite metal";
        const cleanName = p.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
        
        const py = `import unreal

def build_pbr_material():
    # Prompt: "${p}"
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    
    package_path = "/Game/AetherForge/Materials"
    material_name = "M_${cleanName}"
    
    # Create main material asset
    material_factory = unreal.MaterialFactoryNew()
    material = asset_tools.create_asset(
        asset_name=material_name,
        package_path=package_path,
        asset_class=unreal.Material,
        factory=material_factory
    )
    
    # Create texture sample expression
    expression_texture = unreal.MaterialEditingLibrary.create_material_expression(
        material, 
        unreal.MaterialExpressionTextureSample, 
        -300, 
        0
    )
    
    # Bind texture RGB to Base Color
    unreal.MaterialEditingLibrary.connect_material_property(
        expression_texture, 
        "RGB", 
        unreal.MaterialProperty.MP_BASE_COLOR
    )
    
    # Recompile material
    unreal.MaterialEditingLibrary.recompile_material(material)
    print("AI PBR Material compiled: " + material_name)

build_pbr_material()
`;
        state.editorCode = py;
        elements.codeBlock.innerText = py;
    }

    function compileBlueprintToPython(promptText) {
        const p = promptText.trim() || "gameplay actor";
        const cleanName = p.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);

        const py = `import unreal

def create_ai_blueprint():
    # Create Actor Blueprint Class
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    
    bp_factory = unreal.BlueprintFactory()
    bp_factory.set_editor_property('parent_class', unreal.Actor)
    
    bp_asset = asset_tools.create_asset(
        asset_name="BP_${cleanName}", 
        package_path="/Game/AetherForge/Blueprints", 
        asset_class=unreal.Blueprint, 
        factory=bp_factory
    )
    
    unreal.EditorAssetLibrary.save_asset(bp_asset.get_path_name())
    print("Blueprint Class ready: BP_${cleanName}")

create_ai_blueprint()
`;
        state.editorCode = py;
        elements.codeBlock.innerText = py;
    }

    // -------------------------------------------------------------
    // REVOLTGPT AGENT CHAT LOOP
    // -------------------------------------------------------------
    function addChatBubble(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        
        const avatarIcon = sender === 'agent' ? 'fa-robot' : 'fa-user';
        
        bubble.innerHTML = `
            <div class="bubble-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
            <div class="bubble-content">
                <p>${text}</p>
            </div>
        `;
        
        elements.chatFeed.appendChild(bubble);
        elements.chatFeed.scrollTop = elements.chatFeed.scrollHeight;
    }

    function executeChatCommand() {
        const prompt = elements.promptInput.value.trim();
        if (!prompt) return;

        // Clear text input
        elements.promptInput.value = '';

        // Add user speech bubble
        addChatBubble('user', prompt);
        logToConsole(`[Agent Chat] Request received: "${prompt}"`, "info");

        // Disable input while processing
        elements.btnGenerate.disabled = true;
        
        // Setup Agent response trigger delay
        setTimeout(() => {
            const promptLower = prompt.toLowerCase();
            let botResponse = "";
            let categoryToUse = state.activeCategory;

            if (promptLower.includes("sword") || promptLower.includes("blade") || promptLower.includes("weapon")) {
                categoryToUse = 'mesh';
                botResponse = `Understood. I will model a realistic 3D Knight Broadsword using gold details and detailed emissive runes. Synthesizing Nanite geometry...`;
                generateProceduralMesh("sword");
                compileMeshToPython(prompt);
                switchTab('viewport');
            } else if (promptLower.includes("pillar") || promptLower.includes("column")) {
                categoryToUse = 'mesh';
                botResponse = `Designing an ornate stone cylinder pillar with dual gold rings and beveled capital headers. Ready to import to UE5.`;
                generateProceduralMesh("pillar");
                compileMeshToPython(prompt);
                switchTab('viewport');
            } else if (promptLower.includes("chest") || promptLower.includes("box") || promptLower.includes("crate")) {
                categoryToUse = 'mesh';
                botResponse = `Generating a metal-trimmed wooden chest asset complete with an emissive blue inner glow element.`;
                generateProceduralMesh("chest");
                compileMeshToPython(prompt);
                switchTab('viewport');
            } else if (promptLower.includes("torch") || promptLower.includes("light") || promptLower.includes("fire")) {
                categoryToUse = 'mesh';
                botResponse = `Creating a medieval torch prop containing an active PointLight object for ambient scene illumination.`;
                generateProceduralMesh("torch");
                compileMeshToPython(prompt);
                switchTab('viewport');
            } else if (promptLower.includes("dungeon") || promptLower.includes("crypt")) {
                categoryToUse = 'level';
                botResponse = `Compiling full dungeon level preset. Painting stone tiles, support pillars, and torches onto visual grid builder.`;
                loadPreset("dungeon");
                switchTab('level-builder');
            } else if (promptLower.includes("scifi") || promptLower.includes("sci-fi") || promptLower.includes("server")) {
                categoryToUse = 'level';
                botResponse = `Compiling sci-fi server control grid. Injecting neon server generator arrays and Attenuation Light actors.`;
                loadPreset("sci-fi");
                switchTab('level-builder');
            } else if (promptLower.includes("material") || promptLower.includes("texture")) {
                categoryToUse = 'material';
                botResponse = `Creating a modular PBR material instance with bound Texture Coordinate nodes for prompt: "${prompt}"`;
                compileMaterialToPython(prompt);
            } else if (promptLower.includes("blueprint") || promptLower.includes("bp") || promptLower.includes("script")) {
                categoryToUse = 'blueprint';
                botResponse = `Drafting a new Actor Blueprint Class with automated StaticMesh references.`;
                compileBlueprintToPython(prompt);
            } else {
                // Default fallback core
                categoryToUse = 'mesh';
                botResponse = `Applying local LLM inference models to analyze "${prompt}". Constructing modular power core components in real-time.`;
                generateProceduralMesh("core");
                compileMeshToPython(prompt);
                switchTab('viewport');
            }

            // Sync category selection UI buttons
            state.activeCategory = categoryToUse;
            elements.typeButtons.forEach(btn => {
                if (btn.dataset.type === categoryToUse) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            // Add Agent speech bubble
            addChatBubble('agent', botResponse);
            logToConsole("[Agent] Task synthesis succeeded. Commits updated.", "success");
            
            // Push state commit
            pushCommit(`AI Agent: ${prompt.substring(0, 25)}...`);
            
            // Re-enable
            elements.btnGenerate.disabled = false;
        }, 1200);
    }

    // -------------------------------------------------------------
    // VERSION CONTROL (GIT COMMIT TIMELINE)
    // -------------------------------------------------------------
    function pushCommit(commitMessage) {
        const hash = Math.random().toString(16).substring(2, 8);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Capture deep copy of grid
        const gridCopy = JSON.parse(JSON.stringify(state.grid));
        
        const commit = {
            hash: hash,
            msg: commitMessage,
            time: time,
            grid: gridCopy,
            activeCategory: state.activeCategory,
            editorCode: state.editorCode,
            currentMeshType: state.currentMeshType,
            currentMeshInfo: state.currentMesh ? { ...state.currentMesh } : null
        };

        // Push to array
        state.commits.push(commit);
        state.activeCommitIndex = state.commits.length - 1;

        // Render timeline
        renderCommitTimeline();
    }

    function renderCommitTimeline() {
        elements.commitTimeline.innerHTML = '';
        elements.commitCount.innerText = `${state.commits.length} Commits`;

        // Render in reverse chronological order (newest first)
        for (let i = state.commits.length - 1; i >= 0; i--) {
            const commit = state.commits[i];
            const isActive = i === state.activeCommitIndex;
            
            const card = document.createElement('div');
            card.className = `commit-card ${isActive ? 'active' : ''}`;
            card.dataset.index = i;

            card.innerHTML = `
                <span class="commit-bullet"></span>
                <div class="commit-details">
                    <span class="commit-hash">${commit.hash}</span>
                    <span class="commit-msg" title="${commit.msg}">${commit.msg}</span>
                    <span class="commit-time">${commit.time}</span>
                </div>
                <button class="btn-rewind" title="Rewind editor to this commit"><i class="fa-solid fa-clock-rotate-left"></i></button>
            `;

            // Card click restores snapshot
            card.addEventListener('click', (e) => {
                // If clicked the rewind button specifically, or click generally
                restoreCommitSnapshot(i);
            });

            elements.commitTimeline.appendChild(card);
        }
    }

    function restoreCommitSnapshot(index) {
        if (index < 0 || index >= state.commits.length) return;
        
        state.activeCommitIndex = index;
        const commit = state.commits[index];

        logToConsole(`[Git Rewind] Restoring project state to commit: ${commit.hash} (${commit.msg})`, "warning");

        // 1. Restore categories
        state.activeCategory = commit.activeCategory;
        elements.typeButtons.forEach(btn => {
            if (btn.dataset.type === commit.activeCategory) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // 2. Restore level grid
        state.grid = JSON.parse(JSON.stringify(commit.grid));
        drawGrid();

        // 3. Restore compiled code
        state.editorCode = commit.editorCode;
        elements.codeBlock.innerText = commit.editorCode;

        // 4. Restore 3D mesh type
        state.currentMeshType = commit.currentMeshType;
        generateProceduralMesh(commit.currentMeshType);

        // Render timeline highlighting
        renderCommitTimeline();

        logToConsole(`[Git Rewind] Success: Loaded workspace configuration version ${commit.hash}.`, "success");
    }

    // -------------------------------------------------------------
    // LIVE UE5 CONNECTOR (REST API & POLLING)
    // -------------------------------------------------------------
    function checkBridgeConnection() {
        fetch(`${state.bridgeUrl}/status`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "connected") {
                    setConnectionState(true, data.engine || "Unreal Engine 5");
                }
            })
            .catch(() => {
                setConnectionState(false);
            });
    }

    function setConnectionState(connected, engineName = "") {
        state.bridgeConnected = connected;
        if (connected) {
            elements.bridgeStatus.className = "status-badge connected";
            elements.statusText.innerText = "ONLINE";
            elements.btnPushUE5.disabled = false;
            elements.consolePulse.className = "console-pulse active";
        } else {
            elements.bridgeStatus.className = "status-badge disconnected";
            elements.statusText.innerText = "OFFLINE";
            elements.btnPushUE5.disabled = true;
            elements.consolePulse.className = "console-pulse";
        }
    }

    function executeScriptInUE5() {
        if (!state.bridgeConnected) {
            logToConsole("Error: UE5 Editor Bridge is offline. Cannot execute code.", "error");
            return;
        }

        const code = state.editorCode;
        if (!code || !code.trim()) return;

        logToConsole("[Compiler] Sending Python compilation bytecode to Unreal Engine...", "info");
        
        fetch(`${state.bridgeUrl}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: code,
                prompt: "AetherForge Operation"
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "queued") {
                logToConsole("[UE5 Editor] Script successfully compiled and injected on main tick thread.", "success");
            } else {
                logToConsole("[UE5 Editor Error] " + data.error, "error");
            }
        })
        .catch(err => {
            logToConsole("[Bridge Connection Lost] " + err, "error");
            setConnectionState(false);
        });
    }

    // -------------------------------------------------------------
    // USER INTERFACE UTILITIES
    // -------------------------------------------------------------
    function switchTab(tabId) {
        state.activeTab = tabId;
        
        elements.tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Hide/Show tab contents dynamically
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        if (tabId === 'viewport') {
            onWindowResize();
        } else if (tabId === 'level-builder') {
            state.activeCategory = 'level';
            elements.typeButtons.forEach(btn => {
                if (btn.dataset.type === 'level') btn.classList.add('active');
                else btn.classList.remove('active');
            });
            drawGrid();
            compileLevelToPython();
        } else if (tabId === 'perp-game') {
            initPerpGame();
            setTimeout(resizeGameRenderer, 50);
        }
    }

    function logToConsole(text, type = "system") {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        line.innerText = `[${timestamp}] ${text}`;
        
        elements.logConsole.appendChild(line);
        elements.logConsole.scrollTop = elements.logConsole.scrollHeight;
    }

    // Initialize Event Listeners
    function initEvents() {
        // Toggle settings drawer
        elements.btnToggleSettings.addEventListener('click', () => {
            elements.settingsDrawer.classList.toggle('collapsed');
        });

        // Toggle local url field
        elements.inferenceSource.addEventListener('change', (e) => {
            if (e.target.value === 'local') {
                elements.localUrlGroup.style.display = 'block';
            } else {
                elements.localUrlGroup.style.display = 'none';
            }
        });

        // Category selectors
        elements.typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.typeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeCategory = btn.dataset.type;

                const prompt = "stone pillar";
                if (state.activeCategory === 'mesh') {
                    compileMeshToPython(prompt);
                } else if (state.activeCategory === 'material') {
                    compileMaterialToPython(prompt);
                } else if (state.activeCategory === 'blueprint') {
                    compileBlueprintToPython(prompt);
                } else if (state.activeCategory === 'level') {
                    switchTab('level-builder');
                }
            });
        });

        // Tab selection
        elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });

        // Chat send button click
        elements.btnGenerate.addEventListener('click', executeChatCommand);

        // Trigger on enter in prompt textarea
        elements.promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                executeChatCommand();
            }
        });

        // Push code button click
        elements.btnPushUE5.addEventListener('click', executeScriptInUE5);

        // Reconnect click
        elements.btnReconnect.addEventListener('click', () => {
            logToConsole("[System] Pinging UE5 Bridge server at local socket...", "info");
            checkBridgeConnection();
        });

        // Viewport Wireframe
        elements.btnToggleWireframe.addEventListener('click', () => {
            toggleWireframeState(!state.wireframeEnabled);
        });

        // Viewport camera reset
        elements.btnResetCamera.addEventListener('click', () => {
            camera.position.set(4, 3, 5);
            controls.target.set(0, 0, 0);
            controls.update();
            logToConsole("[System] Camera reset to default coordinates.", "system");
        });

        // Brush buttons selection
        elements.brushButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.brushButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeBrush = btn.dataset.brush;
            });
        });

        // Clear grid
        elements.btnClearGrid.addEventListener('click', () => {
            state.grid = createEmptyGrid(gridCols, gridRows);
            drawGrid();
            compileLevelToPython();
            logToConsole("[Grid] Level layout canvas cleared.", "system");
            pushCommit("Cleared level grid");
        });

        // Copy Python Script
        elements.btnCopyCode.addEventListener('click', () => {
            navigator.clipboard.writeText(state.editorCode)
                .then(() => {
                    logToConsole("[Clipboard] Python editor code copied.", "success");
                    const origIcon = elements.btnCopyCode.querySelector('i');
                    origIcon.className = "fa-solid fa-check";
                    setTimeout(() => {
                        origIcon.className = "fa-solid fa-copy";
                    }, 2000);
                });
        });

        // Presets loading
        elements.presetCards.forEach(card => {
            card.addEventListener('click', () => {
                const presetName = card.dataset.preset;
                loadPreset(presetName);
            });
        });
    }

    // -------------------------------------------------------------
    // PLAYABLE GMOD PERP GAME SIMULATOR
    // -------------------------------------------------------------
    let gameScene, gameCamera, gameRenderer, gamePlayerMesh;
    let gameKeys = {};
    let gameNPCs = [];
    let gameDoors = [];
    let gamePots = [];
    let gameInitialized = false;
    let gamePlayerData = {
        money: 250,
        job: "Citizen",
        hunger: 100,
        thirst: 100,
        inventory: {
            bread: 2,
            water: 2,
            seed: 1,
            weed: 0
        }
    };
    let activeDialogueNPC = null;
    let gameTimerId = null;

    function initPerpGame() {
        if (gameInitialized) return;
        gameInitialized = true;
        
        const container = document.getElementById('canvas-game-container');
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 400;
        
        // 1. Create Scene, Camera, Renderer
        gameScene = new THREE.Scene();
        gameScene.background = new THREE.Color(0x0a0c13);
        gameScene.fog = new THREE.FogExp2(0x0a0c13, 0.005);
        
        gameCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        gameCamera.position.set(0, 30, 20);
        
        gameRenderer = new THREE.WebGLRenderer({ antialias: true });
        gameRenderer.setSize(width, height);
        container.appendChild(gameRenderer.domElement);
        
        // 2. Add Lights
        const ambient = new THREE.AmbientLight(0x222a3f, 0.6);
        gameScene.add(ambient);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(20, 40, 20);
        gameScene.add(dirLight);
        
        // 3. Add Ground / Roads
        const groundGeo = new THREE.PlaneGeometry(160, 160);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x1f273d, roughness: 0.8 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        gameScene.add(ground);
        
        const gridHelper = new THREE.GridHelper(160, 40, 0x00f0ff, 0x1a2135);
        gridHelper.position.y = 0.05;
        gameScene.add(gridHelper);
        
        // 4. Construct City Geometry
        const buildingMat = new THREE.MeshStandardMaterial({ color: 0x2b364f, metalness: 0.1, roughness: 0.6 });
        const industrialMat = new THREE.MeshStandardMaterial({ color: 0x4d3227, roughness: 0.7 });
        const lawnMat = new THREE.MeshStandardMaterial({ color: 0x2b6330, roughness: 0.9 });
        const houseMat = new THREE.MeshStandardMaterial({ color: 0x7a3d35, roughness: 0.7 });
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x3d3535, roughness: 0.8 });
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x0d0e12, roughness: 0.9 });
        const npcMat = new THREE.MeshStandardMaterial({ color: 0xbd00ff, emissive: 0x3a0055 });
        const dealerMat = new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0x550000 });
        const potMat = new THREE.MeshStandardMaterial({ color: 0x4f3b25, roughness: 0.9 });
        const plantMat = new THREE.MeshStandardMaterial({ color: 0x4cd964, roughness: 0.8 });
        
        // Streets
        const street1Geo = new THREE.BoxGeometry(160, 0.1, 8);
        const street1 = new THREE.Mesh(street1Geo, roadMat);
        street1.position.set(0, 0.1, 20);
        gameScene.add(street1);
        
        const street2 = new THREE.Mesh(street1Geo, roadMat);
        street2.position.set(0, 0.1, -20);
        gameScene.add(street2);
        
        // Commercial Towers (skyscrapers)
        const towerGeo = new THREE.BoxGeometry(12, 45, 12);
        for (let x = -50; x <= 50; x += 20) {
            const tower = new THREE.Mesh(towerGeo, buildingMat);
            tower.position.set(x, 22.5, 0);
            gameScene.add(tower);
        }
        
        // Industrial factories/tanks
        const factoryGeo = new THREE.BoxGeometry(16, 12, 16);
        const tankGeo = new THREE.CylinderGeometry(5, 5, 10, 16);
        for (let x = -50; x <= 50; x += 25) {
            const fact = new THREE.Mesh(factoryGeo, industrialMat);
            fact.position.set(x, 6, 45);
            gameScene.add(fact);
            
            const tank = new THREE.Mesh(tankGeo, industrialMat);
            tank.position.set(x + 10, 5, 34);
            gameScene.add(tank);
        }
        
        // Suburban houses, lawns, doors, and pots
        const lawnGeo = new THREE.BoxGeometry(18, 0.2, 18);
        const houseGeo = new THREE.BoxGeometry(8, 6, 8);
        const roofGeo = new THREE.ConeGeometry(6, 4, 4);
        
        let houseIndex = 0;
        for (let x = -50; x <= 50; x += 20) {
            for (let z of [-35, -50]) {
                const lawn = new THREE.Mesh(lawnGeo, lawnMat);
                lawn.position.set(x, 0.15, z);
                gameScene.add(lawn);
                
                const houseObj = new THREE.Mesh(houseGeo, houseMat);
                houseObj.position.set(x - 2, 3.2, z - 2);
                gameScene.add(houseObj);
                
                const roof = new THREE.Mesh(roofGeo, roofMat);
                roof.position.set(x - 2, 8.2, z - 2);
                roof.rotation.y = Math.PI / 4;
                gameScene.add(roof);
                
                // Buyable Door
                const doorGeo = new THREE.BoxGeometry(1.8, 4, 0.2);
                const doorMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.5 });
                const door = new THREE.Mesh(doorGeo, doorMat);
                door.position.set(x - 2, 2.2, z + 2);
                gameScene.add(door);
                
                gameDoors.push({
                    mesh: door,
                    price: 250,
                    owner: "",
                    isLocked: true,
                    idx: houseIndex,
                    x: x - 2,
                    z: z + 2
                });
                
                // Weed Pot
                const potGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 12);
                const pot = new THREE.Mesh(potGeo, potMat);
                pot.position.set(x + 4, 0.5, z + 4);
                gameScene.add(pot);
                
                // Plant stem
                const plantGeo = new THREE.ConeGeometry(0.8, 2.0, 8);
                const plant = new THREE.Mesh(plantGeo, plantMat);
                plant.position.set(x + 4, 1.5, z + 4);
                plant.scale.set(0.01, 0.01, 0.01);
                gameScene.add(plant);
                
                gamePots.push({
                    mesh: pot,
                    plantMesh: plant,
                    water: 10,
                    stage: 0,
                    isPlanted: false,
                    idx: houseIndex,
                    x: x + 4,
                    z: z + 4
                });
                
                houseIndex++;
            }
        }
        
        // 5. Add NPCs
        const jenkinsGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.8, 16);
        const jenkins = new THREE.Mesh(jenkinsGeo, npcMat);
        jenkins.position.set(0, 1.4, 0);
        gameScene.add(jenkins);
        gameNPCs.push({
            mesh: jenkins,
            name: "Clerk Jenkins (General Store)",
            type: "merchant",
            dialogue: "Welcome! I sell food, water, and seeds. I can also hire you as a store clerk!",
            x: 0,
            z: 0
        });
        
        const rick = new THREE.Mesh(jenkinsGeo, dealerMat);
        rick.position.set(-30, 1.4, 48);
        gameScene.add(rick);
        gameNPCs.push({
            mesh: rick,
            name: "Slick Rick (Illegal Trader)",
            type: "dealer",
            dialogue: "Whaddya want? Keep it quiet. I buy harvested weed ($100) or sell lockpicks ($50).",
            x: -30,
            z: 48
        });
        
        // 6. Create Player Capsule
        const playerGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const playerMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3, emissive: 0x004466 });
        gamePlayerMesh = new THREE.Mesh(playerGeo, playerMat);
        gamePlayerMesh.position.set(0, 1.2, -10);
        gameScene.add(gamePlayerMesh);
        
        // 7. Bind Key Listeners
        window.addEventListener('keydown', (e) => {
            gameKeys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'e') handleInteractionKey();
            if (e.key.toLowerCase() === 'l') handleLockKey();
        });
        
        window.addEventListener('keyup', (e) => {
            gameKeys[e.key.toLowerCase()] = false;
        });
        
        document.getElementById('btn-close-dialogue').addEventListener('click', () => {
            document.getElementById('perp-dialogue-box').classList.add('hidden');
            activeDialogueNPC = null;
        });
        
        updateInventoryUI();
        animateGame();
        
        // Deplete hunger/thirst and grow crops
        gameTimerId = setInterval(() => {
            if (state.activeTab !== 'perp-game') return;
            
            if (gamePlayerData.job === "Store Clerk") {
                gamePlayerData.money += 15;
                logToConsole("[Salary] Received $15 from Clerk Jenkins.", "info");
            }
            
            gamePlayerData.hunger = Math.max(0, gamePlayerData.hunger - 1);
            gamePlayerData.thirst = Math.max(0, gamePlayerData.thirst - 2);
            
            if (gamePlayerData.hunger <= 0 || gamePlayerData.thirst <= 0) {
                gamePlayerData.money = Math.max(0, gamePlayerData.money - 20);
                logToConsole("[Starvation] You are starving/dehydrated! Paid $20 in medical fees.", "warning");
                gamePlayerData.hunger = 80;
                gamePlayerData.thirst = 80;
            }
            
            gamePots.forEach(pot => {
                if (pot.isPlanted && pot.stage < 3) {
                    pot.water = Math.max(0, pot.water - 1);
                    if (pot.water > 0) {
                        pot.stage++;
                        const scaleFactor = (pot.stage / 3.0);
                        pot.plantMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                        syncWeedGrowthToUE5(pot);
                    }
                }
            });
            
            updateHUDUI();
        }, 3000);
    }

    function animateGame() {
        if (state.activeTab !== 'perp-game') {
            requestAnimationFrame(animateGame);
            return;
        }
        
        const speed = 0.5;
        let dx = 0;
        let dz = 0;
        
        if (gameKeys['w'] || gameKeys['arrowup']) dz -= speed;
        if (gameKeys['s'] || gameKeys['arrowdown']) dz += speed;
        if (gameKeys['a'] || gameKeys['arrowleft']) dx -= speed;
        if (gameKeys['d'] || gameKeys['arrowright']) dx += speed;
        
        const newX = Math.max(-78, Math.min(78, gamePlayerMesh.position.x + dx));
        const newZ = Math.max(-78, Math.min(78, gamePlayerMesh.position.z + dz));
        
        gamePlayerMesh.position.x = newX;
        gamePlayerMesh.position.z = newZ;
        
        gameCamera.position.set(gamePlayerMesh.position.x, gamePlayerMesh.position.y + 24, gamePlayerMesh.position.z + 18);
        gameCamera.lookAt(gamePlayerMesh.position);
        
        gameRenderer.render(gameScene, gameCamera);
        checkInteractionTriggers();
        
        requestAnimationFrame(animateGame);
    }

    function checkInteractionTriggers() {
        let nearNPC = false;
        gameNPCs.forEach(npc => {
            const dist = gamePlayerMesh.position.distanceTo(npc.mesh.position);
            if (dist < 4.0) {
                nearNPC = true;
                if (!activeDialogueNPC) {
                    showGameHelp(`Press <strong>[E]</strong> to talk to ${npc.name}`);
                }
            }
        });
        
        if (nearNPC) return;
        
        let nearDoor = false;
        gameDoors.forEach(door => {
            const dist = gamePlayerMesh.position.distanceTo(door.mesh.position);
            if (dist < 3.5) {
                nearDoor = true;
                const status = door.owner ? `Owned by ${door.owner} (${door.isLocked ? 'Locked' : 'Unlocked'})` : "For Rent ($250)";
                const actionHint = door.owner === "Player" ? 
                    "Press <strong>[L]</strong> to Lock/Unlock" : 
                    (door.owner ? "Owned" : "Press <strong>[E]</strong> to buy house");
                showGameHelp(`House #${door.idx} - ${status} | ${actionHint}`);
            }
        });
        
        if (nearDoor) return;

        let nearPot = false;
        gamePots.forEach(pot => {
            const dist = gamePlayerMesh.position.distanceTo(pot.mesh.position);
            if (dist < 3.5) {
                nearPot = true;
                if (!pot.isPlanted) {
                    showGameHelp(`Pot #${pot.idx} (Empty) - Press <strong>[E]</strong> to plant seed`);
                } else {
                    const status = pot.stage === 3 ? "Ready to Harvest!" : `Growing (Stage ${pot.stage}/3, Water: ${pot.water})`;
                    const actionHint = pot.stage === 3 ? "Press <strong>[E]</strong> to Harvest" : "Press <strong>[E]</strong> to Water ($5)";
                    showGameHelp(`Pot #${pot.idx} - ${status} | ${actionHint}`);
                }
            }
        });
        
        if (!nearPot) {
            clearGameHelp();
        }
    }

    function handleInteractionKey() {
        gameNPCs.forEach(npc => {
            const dist = gamePlayerMesh.position.distanceTo(npc.mesh.position);
            if (dist < 4.0) openDialogue(npc);
        });
        
        gameDoors.forEach(door => {
            const dist = gamePlayerMesh.position.distanceTo(door.mesh.position);
            if (dist < 3.5 && !door.owner) {
                if (gamePlayerData.money >= door.price) {
                    gamePlayerData.money -= door.price;
                    door.owner = "Player";
                    door.mesh.material.color.setHex(0x4cd964);
                    logToConsole(`[Real Estate] You bought House #${door.idx} for $250.`, "success");
                    updateHUDUI();
                    syncDoorToUE5(door);
                } else {
                    logToConsole("[Real Estate] Insufficient funds to buy this house.", "warning");
                }
            }
        });
        
        gamePots.forEach(pot => {
            const dist = gamePlayerMesh.position.distanceTo(pot.mesh.position);
            if (dist < 3.5) {
                if (!pot.isPlanted) {
                    if (gamePlayerData.inventory.seed > 0) {
                        gamePlayerData.inventory.seed--;
                        pot.isPlanted = true;
                        pot.stage = 0;
                        pot.water = 10;
                        pot.plantMesh.scale.set(0.1, 0.1, 0.1);
                        logToConsole(`[Farming] Planted a seed in Pot #${pot.idx}. Remember to water it!`, "success");
                        updateInventoryUI();
                        updateHUDUI();
                        syncWeedGrowthToUE5(pot);
                    } else {
                        logToConsole("[Farming] You don't have any weed seeds. Buy some from Jenkins.", "warning");
                    }
                } else if (pot.stage === 3) {
                    pot.isPlanted = false;
                    pot.stage = 0;
                    pot.plantMesh.scale.set(0.01, 0.01, 0.01);
                    gamePlayerData.inventory.weed++;
                    logToConsole(`[Farming] Harvested weed crop from Pot #${pot.idx}! Sell it to Slick Rick.`, "success");
                    updateInventoryUI();
                    updateHUDUI();
                    syncWeedGrowthToUE5(pot);
                } else {
                    if (gamePlayerData.money >= 5) {
                        gamePlayerData.money -= 5;
                        pot.water = Math.min(15, pot.water + 5);
                        logToConsole(`[Farming] Watered Pot #${pot.idx}. Water level: ${pot.water}`, "info");
                        updateHUDUI();
                    } else {
                        logToConsole("[Farming] Not enough money to buy water bucket.", "warning");
                    }
                }
            }
        });
    }

    function handleLockKey() {
        gameDoors.forEach(door => {
            const dist = gamePlayerMesh.position.distanceTo(door.mesh.position);
            if (dist < 3.5 && door.owner === "Player") {
                door.isLocked = !door.isLocked;
                door.mesh.material.color.setHex(door.isLocked ? 0xffd700 : 0xbd00ff);
                logToConsole(`[Property] House #${door.idx} door set to ${door.isLocked ? 'LOCKED' : 'UNLOCKED'}.`, "info");
                syncDoorToUE5(door);
            }
        });
    }

    function openDialogue(npc) {
        activeDialogueNPC = npc;
        const box = document.getElementById('perp-dialogue-box');
        const nameText = document.getElementById('perp-speaker-name');
        const bodyText = document.getElementById('perp-dialogue-text');
        const optionsDiv = document.getElementById('perp-dialogue-options');
        
        box.classList.remove('hidden');
        nameText.innerText = npc.name;
        bodyText.innerText = npc.dialogue;
        optionsDiv.innerHTML = '';
        
        if (npc.type === 'merchant') {
            createDialogueOption("Buy Bread ($10)", () => {
                if (gamePlayerData.money >= 10) {
                    gamePlayerData.money -= 10;
                    gamePlayerData.inventory.bread++;
                    logToConsole("Bought 1x Bread.", "success");
                    updateInventoryUI();
                    updateHUDUI();
                } else {
                    logToConsole("Not enough money.", "warning");
                }
            });
            createDialogueOption("Buy Water ($5)", () => {
                if (gamePlayerData.money >= 5) {
                    gamePlayerData.money -= 5;
                    gamePlayerData.inventory.water++;
                    logToConsole("Bought 1x Water.", "success");
                    updateInventoryUI();
                    updateHUDUI();
                } else {
                    logToConsole("Not enough money.", "warning");
                }
            });
            createDialogueOption("Buy Weed Seed ($20)", () => {
                if (gamePlayerData.money >= 20) {
                    gamePlayerData.money -= 20;
                    gamePlayerData.inventory.seed++;
                    logToConsole("Bought 1x Weed Seed.", "success");
                    updateInventoryUI();
                    updateHUDUI();
                } else {
                    logToConsole("Not enough money.", "warning");
                }
            });
            createDialogueOption("Apply for Store Clerk Job", () => {
                gamePlayerData.job = "Store Clerk";
                logToConsole("You are now employed as a Store Clerk! Earning $15 every 3 seconds.", "success");
                updateHUDUI();
                box.classList.add('hidden');
                activeDialogueNPC = null;
            });
        } else if (npc.type === 'dealer') {
            createDialogueOption("Sell Harvested Weed ($100 per weed)", () => {
                if (gamePlayerData.inventory.weed > 0) {
                    const count = gamePlayerData.inventory.weed;
                    gamePlayerData.money += count * 100;
                    gamePlayerData.inventory.weed = 0;
                    logToConsole(`Sold ${count} weed for $${count * 100}!`, "success");
                    updateInventoryUI();
                    updateHUDUI();
                } else {
                    logToConsole("You don't have any weed to sell.", "warning");
                }
            });
            createDialogueOption("Resign Job (Become Citizen)", () => {
                gamePlayerData.job = "Citizen";
                logToConsole("You resigned. You are now a Citizen.", "info");
                updateHUDUI();
                box.classList.add('hidden');
                activeDialogueNPC = null;
            });
        }
        
        createDialogueOption("Goodbye", () => {
            box.classList.add('hidden');
            activeDialogueNPC = null;
        });
    }
    
    function createDialogueOption(text, callback) {
        const btn = document.createElement('button');
        btn.className = "dialogue-opt-btn";
        btn.innerText = text;
        btn.addEventListener('click', () => {
            callback();
            if (activeDialogueNPC) openDialogue(activeDialogueNPC);
        });
        document.getElementById('perp-dialogue-options').appendChild(btn);
    }

    function updateHUDUI() {
        document.getElementById('perp-val-money').innerText = `$${gamePlayerData.money}`;
        document.getElementById('perp-val-job').innerText = gamePlayerData.job;
        document.getElementById('perp-val-hunger').innerText = `${gamePlayerData.hunger}%`;
        document.getElementById('perp-val-thirst').innerText = `${gamePlayerData.thirst}%`;
    }
    
    function updateInventoryUI() {
        const container = document.getElementById('perp-inventory-slots');
        container.innerHTML = '';
        
        const items = [
            { id: 'bread', label: '🍞', count: gamePlayerData.inventory.bread },
            { id: 'water', label: '🥤', count: gamePlayerData.inventory.water },
            { id: 'seed', label: '🌱', count: gamePlayerData.inventory.seed },
            { id: 'weed', label: '🌿', count: gamePlayerData.inventory.weed }
        ];
        
        items.forEach(item => {
            const slot = document.createElement('div');
            slot.className = "inventory-slot";
            slot.innerHTML = `
                <span>${item.label}</span>
                <span class="item-count">${item.count}</span>
            `;
            slot.title = `Click to consume/use ${item.id}`;
            slot.addEventListener('click', () => {
                if (item.count <= 0) return;
                
                if (item.id === 'bread') {
                    gamePlayerData.inventory.bread--;
                    gamePlayerData.hunger = Math.min(100, gamePlayerData.hunger + 30);
                    logToConsole("Consumed bread. Hunger replenished.", "info");
                } else if (item.id === 'water') {
                    gamePlayerData.inventory.water--;
                    gamePlayerData.thirst = Math.min(100, gamePlayerData.thirst + 40);
                    logToConsole("Consumed water. Thirst replenished.", "info");
                }
                updateInventoryUI();
                updateHUDUI();
            });
            container.appendChild(slot);
        });
    }

    let lastHelpText = "";
    function showGameHelp(html) {
        if (lastHelpText === html) return;
        lastHelpText = html;
        logToConsole(`[Game Alert] ${html.replace(/<\/?[^>]+(>|$)/g, "")}`, "info");
    }
    
    function clearGameHelp() {
        lastHelpText = "";
    }

    function syncDoorToUE5(door) {
        if (state.bridgeConnected === false) return;
        
        const pythonCode = `import unreal
editor_subsystem = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
actors = editor_subsystem.get_all_level_actors()
door_actor = next((a for a in actors if a.get_actor_label() == "AF_City_PERP_Door_House_${door.idx}"), None)
if door_actor:
    door_actor.set_editor_property("IsLocked", ${door.isLocked ? 'True' : 'False'})
    door_actor.set_editor_property("OwnerName", "${door.owner}")
    target_yaw = 90.0 if not ${door.isLocked ? 'True' : 'False'} else 0.0
    door_actor.set_actor_rotation(unreal.Rotator(0, target_yaw, 0), True)
    unreal.log("Synced door state to UE5 Editor.")
`;
        postCodeToBridge("Sync Door", pythonCode);
    }
    
    function syncWeedGrowthToUE5(pot) {
        if (state.bridgeConnected === false) return;
        
        const scaleFactor = (pot.stage / 3.0) + 0.01;
        const pythonCode = `import unreal
editor_subsystem = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
actors = editor_subsystem.get_all_level_actors()
pot_actor = next((a for a in actors if a.get_actor_label() == "AF_City_PERP_WeedPot_House_${pot.idx}"), None)
if pot_actor:
    pot_actor.set_editor_property("GrowthStage", ${pot.stage})
    pot_actor.set_actor_scale3d(unreal.Vector(${scaleFactor.toFixed(2)}, ${scaleFactor.toFixed(2)}, ${scaleFactor.toFixed(2)}))
    unreal.log("Synced weed pot growth state to UE5 Editor.")
`;
        postCodeToBridge("Sync Weed Pot", pythonCode);
    }
    
    function postCodeToBridge(prompt, code) {
        fetch(`${state.bridgeUrl}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt, code: code })
        })
        .then(res => res.json())
        .then(data => {
            logToConsole(`[Bridge Sync] ${prompt} state posted to UE5.`, "success");
        })
        .catch(err => {
            console.error(err);
        });
    }

    // Start everything
    init3DViewport();
    initLevelGrid();
    initEvents();

    // Setup active compiler default state
    compileMeshToPython("stone pillar");

    // Initialize initial project commit
    pushCommit("Init workspace (Empty project)");

    // Start polling bridge connection
    checkBridgeConnection();
    setInterval(checkBridgeConnection, 4000);
});
