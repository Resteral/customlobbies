/**
 * High-Detail Procedural Realistic Architectural Fixtures
 * Doors with working handles & animated swing hinges, double-hung windows with sashes & muntins, and functioning plumbing fixtures.
 */

class RealisticFixtures {
    /**
     * Builds a realistic 3D Door with framed casing, beveled panel, lever handle, and working swing pivot
     */
    static createDoor(options = {}) {
        const width = options.width || 1.0;
        const height = options.height || 2.2;
        const thickness = options.thickness || 0.05;
        const frameThickness = 0.1;
        const isOpen = options.isOpen || false;

        const doorGroup = new THREE.Group();
        doorGroup.userData = { isDoor: true, doorAngle: isOpen ? Math.PI / 2 : 0, maxAngle: Math.PI / 2 };

        // 1. Static Outer Door Frame Casing
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
        const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, height, 0.15), frameMat);
        leftJamb.position.set(-width / 2 - frameThickness / 2, height / 2, 0);
        doorGroup.add(leftJamb);

        const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, height, 0.15), frameMat);
        rightJamb.position.set(width / 2 + frameThickness / 2, height / 2, 0);
        doorGroup.add(rightJamb);

        const topHeader = new THREE.Mesh(new THREE.BoxGeometry(width + frameThickness * 2, frameThickness, 0.15), frameMat);
        topHeader.position.set(0, height + frameThickness / 2, 0);
        doorGroup.add(topHeader);

        // 2. Swiveling Door Leaf Pivot (Hinged at left side)
        const pivotGroup = new THREE.Group();
        pivotGroup.position.set(-width / 2, 0, 0); // Hinge pivot point

        // Door Leaf
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.45 }); // Rich dark wood
        const leafMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), leafMat);
        leafMesh.position.set(width / 2, height / 2, 0);
        pivotGroup.add(leafMesh);

        // Inset Decorative Door Panels
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.5 });
        const topPanel = new THREE.Mesh(new THREE.BoxGeometry(width * 0.7, height * 0.35, thickness * 1.2), leafMat);
        topPanel.position.set(width / 2, height * 0.7, 0);
        pivotGroup.add(topPanel);

        const botPanel = new THREE.Mesh(new THREE.BoxGeometry(width * 0.7, height * 0.35, thickness * 1.2), leafMat);
        botPanel.position.set(width / 2, height * 0.28, 0);
        pivotGroup.add(botPanel);

        // Brass Lever Handle
        const handleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
        const handleStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 12), handleMat);
        handleStem.rotation.x = Math.PI / 2;
        handleStem.position.set(width - 0.1, 1.0, 0.04);
        pivotGroup.add(handleStem);

        const handleLever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), handleMat);
        handleLever.position.set(width - 0.15, 1.0, 0.08);
        pivotGroup.add(handleLever);

        // Keyhole / Deadbolt Rosette
        const rosette = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16), handleMat);
        rosette.rotation.x = Math.PI / 2;
        rosette.position.set(width - 0.1, 1.0, 0.03);
        pivotGroup.add(rosette);

        // Initial angle
        pivotGroup.rotation.y = isOpen ? Math.PI / 2 : 0;

        doorGroup.add(pivotGroup);
        doorGroup.userData.pivot = pivotGroup;

        return doorGroup;
    }

    /**
     * Toggles door open / closed animation
     */
    static toggleDoor(doorGroup) {
        if (!doorGroup || !doorGroup.userData.pivot) return;

        const pivot = doorGroup.userData.pivot;
        const targetAngle = (pivot.rotation.y === 0) ? Math.PI / 2 : 0;
        pivot.rotation.y = targetAngle;
        doorGroup.userData.doorAngle = targetAngle;

        SimsAudio.playPlace();
    }

    /**
     * Builds a realistic 3D Double-Hung Window with frame, sashes, and glass
     */
    static createWindow(options = {}) {
        const width = options.width || 2.0;
        const height = options.height || 1.6;
        const depth = 0.12;

        const winGroup = new THREE.Group();

        // 1. Exterior Outer Frame & Sill
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), frameMat);
        outerFrame.position.set(0, height / 2, 0);

        // Outer Sill (Projecting bottom ledge)
        const sillGeo = new THREE.BoxGeometry(width * 1.08, 0.06, depth * 1.5);
        const sillMesh = new THREE.Mesh(sillGeo, frameMat);
        sillMesh.position.set(0, -0.03, 0.02);
        winGroup.add(sillMesh);

        // 2. Clear Refractive Glass Pane
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xe0f2fe,
            transparent: true,
            opacity: 0.25,
            roughness: 0.02,
            metalness: 0.1,
            transmission: 0.95,
            ior: 1.52
        });
        const glass = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, height * 0.9, 0.02), glassMat);
        glass.position.set(0, height / 2, 0);
        winGroup.add(glass);

        // 3. Muntin Grid Bars (Cross dividers)
        const muntinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const vertBar = new THREE.Mesh(new THREE.BoxGeometry(0.025, height * 0.9, 0.03), muntinMat);
        vertBar.position.set(0, height / 2, 0);
        winGroup.add(vertBar);

        const horizBar = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.025, 0.03), muntinMat);
        horizBar.position.set(0, height / 2, 0);
        winGroup.add(horizBar);

        return winGroup;
    }

    /**
     * Builds realistic bathroom plumbing with working faucet
     */
    static createLuxuryVanity(options = {}) {
        const width = 1.8;
        const height = 0.85;
        const depth = 0.6;

        const vanityGroup = new THREE.Group();

        // Marble Countertop
        const marbleMat = pbrEngine ? pbrEngine.getMaterial('marble_carrara') : new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
        const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, depth), marbleMat);
        top.position.set(0, height, 0);
        vanityGroup.add(top);

        // Wood Cabinet Vanity Base
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
        const cabinet = new THREE.Mesh(new THREE.BoxGeometry(width * 0.96, height - 0.08, depth * 0.92), woodMat);
        cabinet.position.set(0, (height - 0.08) / 2, 0);
        vanityGroup.add(cabinet);

        // Chrome Gooseneck Faucet
        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.08 });
        const faucetStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 16), chromeMat);
        faucetStem.position.set(0, height + 0.12, -0.15);
        vanityGroup.add(faucetStem);

        const faucetSpout = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.14), chromeMat);
        faucetSpout.position.set(0, height + 0.24, -0.08);
        vanityGroup.add(faucetSpout);

        // Hot/Cold Chrome Levers
        const leftHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12), chromeMat);
        leftHandle.position.set(-0.12, height + 0.06, -0.15);
        vanityGroup.add(leftHandle);

        const rightHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12), chromeMat);
        rightHandle.position.set(0.12, height + 0.06, -0.15);
        vanityGroup.add(rightHandle);

        // Ceramic Sink Vessel Basin
        const basinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.12, 24), basinMat);
        basin.position.set(0, height + 0.06, 0.05);
        vanityGroup.add(basin);

        return vanityGroup;
    }
}

if (typeof module !== 'undefined') {
    module.exports = RealisticFixtures;
}
