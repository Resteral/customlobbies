/**
 * Realistic Environment Lighting & Architectural Trim Engine
 * Provides Day/Sunset/Night/Studio HDRI lighting, Kelvin color temperatures, and auto-generated Baseboards & Crown Molding.
 */

class EnvironmentLighting {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;

        this.currentPreset = 'daylight';
        this.sunLight = null;
        this.hemiLight = null;
        this.ambientLight = null;
        this.envSkyMesh = null;
        this.showTrims = true;
        this.showDimensions = true;

        this.init();
    }

    init() {
        // Sky dome / background gradient mesh
        const skyGeo = new THREE.SphereGeometry(150, 32, 16);
        const skyMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x0f172a });
        this.envSkyMesh = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(this.envSkyMesh);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.position.set(25, 40, 25);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.bias = -0.0001;
        this.sunLight.shadow.normalBias = 0.02;
        const d = 35;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;
        this.scene.add(this.sunLight);

        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.4);
        this.scene.add(this.hemiLight);

        this.setPreset('daylight');
    }

    setPreset(presetId) {
        this.currentPreset = presetId;

        if (presetId === 'daylight') {
            this.scene.background = new THREE.Color(0x0c1322);
            this.scene.fog.color = new THREE.Color(0x0c1322);
            this.envSkyMesh.material.color.setHex(0x1e293b);

            this.sunLight.color.setHex(0xfffaed); // 6000K crisp sunlight
            this.sunLight.intensity = 1.1;
            this.sunLight.position.set(25, 45, 25);

            this.hemiLight.color.setHex(0x93c5fd);
            this.hemiLight.groundColor.setHex(0x1e293b);
            this.hemiLight.intensity = 0.45;

            this.ambientLight.intensity = 0.55;
            this.renderer.toneMappingExposure = 1.15;
        } else if (presetId === 'sunset') {
            this.scene.background = new THREE.Color(0x1a0f1c);
            this.scene.fog.color = new THREE.Color(0x1a0f1c);
            this.envSkyMesh.material.color.setHex(0x3b1828);

            this.sunLight.color.setHex(0xf97316); // 2800K warm golden hour
            this.sunLight.intensity = 1.4;
            this.sunLight.position.set(40, 15, 30); // Low sun angle

            this.hemiLight.color.setHex(0xf43f5e);
            this.hemiLight.groundColor.setHex(0x1e1b4b);
            this.hemiLight.intensity = 0.5;

            this.ambientLight.intensity = 0.4;
            this.renderer.toneMappingExposure = 1.25;
        } else if (presetId === 'night') {
            this.scene.background = new THREE.Color(0x05070e);
            this.scene.fog.color = new THREE.Color(0x05070e);
            this.envSkyMesh.material.color.setHex(0x05070e);

            this.sunLight.color.setHex(0x38bdf8); // Moonlight
            this.sunLight.intensity = 0.25;
            this.sunLight.position.set(-20, 35, -20);

            this.hemiLight.color.setHex(0x1e293b);
            this.hemiLight.groundColor.setHex(0x020617);
            this.hemiLight.intensity = 0.2;

            this.ambientLight.intensity = 0.25;
            this.renderer.toneMappingExposure = 1.0;
        } else if (presetId === 'studio') {
            this.scene.background = new THREE.Color(0x111622);
            this.scene.fog.color = new THREE.Color(0x111622);
            this.envSkyMesh.material.color.setHex(0x1e293b);

            this.sunLight.color.setHex(0xffffff);
            this.sunLight.intensity = 0.8;
            this.sunLight.position.set(0, 50, 0);

            this.hemiLight.color.setHex(0xffffff);
            this.hemiLight.groundColor.setHex(0x334155);
            this.hemiLight.intensity = 0.6;

            this.ambientLight.intensity = 0.7;
            this.renderer.toneMappingExposure = 1.2;
        }
    }

    /**
     * Generates realistic 3D Baseboard molding around a room floor perimeter
     */
    static createBaseboards(room, height = 0.12, depth = 0.02) {
        const min = room.bbMin || [-4, -4, 0];
        const max = room.bbMax || [4, 4, 3.5];
        const w = max[0] - min[0];
        const l = max[1] - min[1];
        const cx = (min[0] + max[0]) / 2;
        const cy = (min[1] + max[1]) / 2;
        const bz = min[2];

        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.05 });

        // North Baseboard
        const nGeo = new THREE.BoxGeometry(w, height, depth);
        const nMesh = new THREE.Mesh(nGeo, mat);
        nMesh.position.set(cx, bz + height / 2, -max[1] + depth / 2);
        group.add(nMesh);

        // South Baseboard
        const sGeo = new THREE.BoxGeometry(w, height, depth);
        const sMesh = new THREE.Mesh(sGeo, mat);
        sMesh.position.set(cx, bz + height / 2, -min[1] - depth / 2);
        group.add(sMesh);

        // East Baseboard
        const eGeo = new THREE.BoxGeometry(depth, height, l);
        const eMesh = new THREE.Mesh(eGeo, mat);
        eMesh.position.set(max[0] - depth / 2, bz + height / 2, -cy);
        group.add(eMesh);

        // West Baseboard
        const wGeo = new THREE.BoxGeometry(depth, height, l);
        const wMesh = new THREE.Mesh(wGeo, mat);
        wMesh.position.set(min[0] + depth / 2, bz + height / 2, -cy);
        group.add(wMesh);

        return group;
    }

    /**
     * Generates realistic 3D Crown Molding along room ceiling perimeter
     */
    static createCrownMolding(room, height = 0.15, depth = 0.08) {
        const min = room.bbMin || [-4, -4, 0];
        const max = room.bbMax || [4, 4, 3.5];
        const w = max[0] - min[0];
        const l = max[1] - min[1];
        const cx = (min[0] + max[0]) / 2;
        const cy = (min[1] + max[1]) / 2;
        const cz = max[2];

        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });

        const nGeo = new THREE.BoxGeometry(w, height, depth);
        const nMesh = new THREE.Mesh(nGeo, mat);
        nMesh.position.set(cx, cz - height / 2, -max[1] + depth / 2);
        group.add(nMesh);

        const sGeo = new THREE.BoxGeometry(w, height, depth);
        const sMesh = new THREE.Mesh(sGeo, mat);
        sMesh.position.set(cx, cz - height / 2, -min[1] - depth / 2);
        group.add(sMesh);

        const eGeo = new THREE.BoxGeometry(depth, height, l);
        const eMesh = new THREE.Mesh(eGeo, mat);
        eMesh.position.set(max[0] - depth / 2, cz - height / 2, -cy);
        group.add(eMesh);

        const wGeo = new THREE.BoxGeometry(depth, height, l);
        const wMesh = new THREE.Mesh(wGeo, mat);
        wMesh.position.set(min[0] + depth / 2, cz - height / 2, -cy);
        group.add(wMesh);

        return group;
    }
}

if (typeof module !== 'undefined') {
    module.exports = EnvironmentLighting;
}
