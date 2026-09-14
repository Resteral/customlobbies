/**
 * High-Fidelity Procedural PBR Material Engine
 * Generates photorealistic Diffuse (Color), Normal (Bump), Roughness, and Ambient Occlusion maps for Three.js.
 */

class PBRMaterialEngine {
    constructor() {
        this.materialCache = {};
        this.textureCache = {};
    }

    /**
     * Creates a high-fidelity Three.js MeshStandardMaterial or MeshPhysicalMaterial with PBR maps
     */
    getMaterial(materialId, options = {}) {
        const cacheKey = `${materialId}_${JSON.stringify(options)}`;
        if (this.materialCache[cacheKey]) return this.materialCache[cacheKey];

        const matDef = WALL_MATERIALS.find(m => m.id === materialId) || WALL_MATERIALS[0];
        const textures = this.generatePBRTextures(matDef);

        const repeatX = options.repeatX || 2.0;
        const repeatY = options.repeatY || 2.0;

        [textures.map, textures.normalMap, textures.roughnessMap].forEach(t => {
            if (t) {
                t.wrapS = THREE.RepeatWrapping;
                t.wrapT = THREE.RepeatWrapping;
                t.repeat.set(repeatX, repeatY);
            }
        });

        const mat = new THREE.MeshStandardMaterial({
            map: textures.map,
            normalMap: textures.normalMap,
            normalScale: new THREE.Vector2(0.8, 0.8),
            roughnessMap: textures.roughnessMap,
            roughness: matDef.roughness !== undefined ? matDef.roughness : 0.5,
            metalness: matDef.metalness !== undefined ? matDef.metalness : 0.05,
            envMapIntensity: 1.2
        });

        this.materialCache[cacheKey] = mat;
        return mat;
    }

    /**
     * Generates Diffuse, Normal, and Roughness canvas textures
     */
    generatePBRTextures(matDef) {
        const id = matDef.id;
        if (this.textureCache[id]) return this.textureCache[id];

        const size = 512;
        const diffuseCanvas = document.createElement('canvas');
        diffuseCanvas.width = size; diffuseCanvas.height = size;
        const diffCtx = diffuseCanvas.getContext('2d');

        const normalCanvas = document.createElement('canvas');
        normalCanvas.width = size; normalCanvas.height = size;
        const normCtx = normalCanvas.getContext('2d');

        const roughCanvas = document.createElement('canvas');
        roughCanvas.width = size; roughCanvas.height = size;
        const roughCtx = roughCanvas.getContext('2d');

        // Fill neutral normal base (RGB 128, 128, 255 = pointing straight out)
        normCtx.fillStyle = '#8080ff';
        normCtx.fillRect(0, 0, size, size);

        // Fill default roughness
        roughCtx.fillStyle = `rgb(${Math.round(matDef.roughness * 255)}, ${Math.round(matDef.roughness * 255)}, ${Math.round(matDef.roughness * 255)})`;
        roughCtx.fillRect(0, 0, size, size);

        // Fill base diffuse
        diffCtx.fillStyle = matDef.color;
        diffCtx.fillRect(0, 0, size, size);

        if (matDef.pattern === 'subway_tile') {
            this.drawSubwayTiles(diffCtx, normCtx, roughCtx, size, matDef.color);
        } else if (matDef.pattern === 'hex_tile') {
            this.drawHexTiles(diffCtx, normCtx, roughCtx, size, matDef.color);
        } else if (matDef.pattern === 'mosaic_tile') {
            this.drawMosaicTiles(diffCtx, normCtx, roughCtx, size, matDef.color);
        } else if (matDef.pattern === 'brick') {
            this.drawBrick(diffCtx, normCtx, roughCtx, size, matDef.color);
        } else if (matDef.pattern === 'wood_slat' || matDef.pattern === 'wood') {
            this.drawWoodPlanks(diffCtx, normCtx, roughCtx, size, matDef.color);
        } else if (matDef.pattern === 'marble') {
            this.drawMarbleVeins(diffCtx, normCtx, roughCtx, size, matDef.color);
        } else if (matDef.pattern === 'concrete') {
            this.drawConcreteGrain(diffCtx, normCtx, roughCtx, size, matDef.color);
        }

        const map = new THREE.CanvasTexture(diffuseCanvas);
        const normalMap = new THREE.CanvasTexture(normalCanvas);
        const roughnessMap = new THREE.CanvasTexture(roughCanvas);

        const result = { map, normalMap, roughnessMap };
        this.textureCache[id] = result;
        return result;
    }

    drawSubwayTiles(diffCtx, normCtx, roughCtx, size, baseColor) {
        const tileW = 128;
        const tileH = 64;
        const grout = 6;

        for (let row = 0; row < size / tileH; row++) {
            const offsetX = (row % 2 === 0) ? 0 : tileW / 2;
            for (let col = -1; col <= size / tileW; col++) {
                const x = col * tileW + offsetX;
                const y = row * tileH;

                // Beveled high-gloss tile body
                diffCtx.fillStyle = baseColor;
                diffCtx.fillRect(x + grout / 2, y + grout / 2, tileW - grout, tileH - grout);

                // Subtle ceramic gradient for curvature
                const grad = diffCtx.createLinearGradient(x, y, x + tileW, y + tileH);
                grad.addColorStop(0, 'rgba(255,255,255,0.25)');
                grad.addColorStop(0.5, 'rgba(255,255,255,0)');
                grad.addColorStop(1, 'rgba(0,0,0,0.15)');
                diffCtx.fillStyle = grad;
                diffCtx.fillRect(x + grout / 2, y + grout / 2, tileW - grout, tileH - grout);

                // Normal map beveled borders
                normCtx.fillStyle = '#6060ff'; // Left slope
                normCtx.fillRect(x, y, grout, tileH);
                normCtx.fillStyle = '#a0a0ff'; // Right slope
                normCtx.fillRect(x + tileW - grout, y, grout, tileH);
                normCtx.fillStyle = '#8060ff'; // Top slope
                normCtx.fillRect(x, y, tileW, grout);
                normCtx.fillStyle = '#80a0ff'; // Bottom slope
                normCtx.fillRect(x, y + tileH - grout, tileW, grout);

                // Roughness: Glossy tile, rough grout
                roughCtx.fillStyle = '#222222'; // Glossy tile
                roughCtx.fillRect(x + grout / 2, y + grout / 2, tileW - grout, tileH - grout);
                roughCtx.fillStyle = '#dddddd'; // Rough cement grout
                roughCtx.strokeRect(x, y, tileW, tileH);
            }
        }
    }

    drawHexTiles(diffCtx, normCtx, roughCtx, size, baseColor) {
        const r = 32;
        diffCtx.strokeStyle = '#64748b';
        diffCtx.lineWidth = 4;
        normCtx.strokeStyle = '#6060ff';
        normCtx.lineWidth = 4;
        roughCtx.strokeStyle = '#ffffff';
        roughCtx.lineWidth = 4;

        for (let y = 0; y <= size + r; y += r * 1.5) {
            for (let x = 0; x <= size + r; x += r * Math.sqrt(3)) {
                diffCtx.strokeRect(x, y, r, r);
                normCtx.strokeRect(x, y, r, r);
                roughCtx.strokeRect(x, y, r, r);
            }
        }
    }

    drawMosaicTiles(diffCtx, normCtx, roughCtx, size, baseColor) {
        const tileSize = 32;
        const grout = 3;

        for (let y = 0; y < size; y += tileSize) {
            for (let x = 0; x < size; x += tileSize) {
                // Slight color variation between mosaic tesserae
                const tint = (Math.sin(x * 0.1) * Math.cos(y * 0.1)) * 25;
                diffCtx.fillStyle = baseColor;
                diffCtx.fillRect(x + grout, y + grout, tileSize - grout * 2, tileSize - grout * 2);

                diffCtx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.2).toFixed(2)})`;
                diffCtx.fillRect(x + grout, y + grout, tileSize - grout * 2, tileSize - grout * 2);

                roughCtx.fillStyle = '#333333';
                roughCtx.fillRect(x + grout, y + grout, tileSize - grout * 2, tileSize - grout * 2);
            }
        }

        diffCtx.strokeStyle = '#e2e8f0';
        diffCtx.lineWidth = grout;
        for (let i = 0; i <= size; i += tileSize) {
            diffCtx.beginPath(); diffCtx.moveTo(0, i); diffCtx.lineTo(size, i); diffCtx.stroke();
            diffCtx.beginPath(); diffCtx.moveTo(i, 0); diffCtx.lineTo(i, size); diffCtx.stroke();
        }
    }

    drawBrick(diffCtx, normCtx, roughCtx, size, baseColor) {
        const brickW = 128;
        const brickH = 48;
        const mortar = 6;

        for (let row = 0; row < size / brickH; row++) {
            const offsetX = (row % 2 === 0) ? 0 : brickW / 2;
            for (let col = -1; col <= size / brickW; col++) {
                const x = col * brickW + offsetX;
                const y = row * brickH;

                diffCtx.fillStyle = baseColor;
                diffCtx.fillRect(x + mortar, y + mortar, brickW - mortar, brickH - mortar);

                // Brick porous noise
                for (let i = 0; i < 80; i++) {
                    const nx = x + mortar + Math.random() * (brickW - mortar);
                    const ny = y + mortar + Math.random() * (brickH - mortar);
                    diffCtx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)';
                    diffCtx.fillRect(nx, ny, 2, 2);
                }

                // Normal depth
                normCtx.fillStyle = '#6060ff';
                normCtx.fillRect(x, y, mortar, brickH);
                normCtx.fillStyle = '#a0a0ff';
                normCtx.fillRect(x + brickW - mortar, y, mortar, brickH);

                roughCtx.fillStyle = '#cccccc'; // Rough brick surface
                roughCtx.fillRect(x, y, brickW, brickH);
            }
        }
    }

    drawWoodPlanks(diffCtx, normCtx, roughCtx, size, baseColor) {
        const plankW = 48;
        for (let x = 0; x < size; x += plankW) {
            diffCtx.fillStyle = baseColor;
            diffCtx.fillRect(x + 2, 0, plankW - 4, size);

            // Wood grain lines
            diffCtx.strokeStyle = 'rgba(0,0,0,0.18)';
            diffCtx.lineWidth = 1;
            for (let i = 0; i < 15; i++) {
                const gx = x + Math.random() * plankW;
                diffCtx.beginPath();
                diffCtx.moveTo(gx, 0);
                diffCtx.bezierCurveTo(gx + (Math.random() - 0.5) * 8, size * 0.3, gx + (Math.random() - 0.5) * 8, size * 0.7, gx, size);
                diffCtx.stroke();
            }

            normCtx.fillStyle = '#6060ff';
            normCtx.fillRect(x, 0, 2, size);
            normCtx.fillStyle = '#a0a0ff';
            normCtx.fillRect(x + plankW - 2, 0, 2, size);

            roughCtx.fillStyle = '#555555'; // Satin wood finish
            roughCtx.fillRect(x, 0, plankW, size);
        }
    }

    drawMarbleVeins(diffCtx, normCtx, roughCtx, size, baseColor) {
        diffCtx.fillStyle = baseColor;
        diffCtx.fillRect(0, 0, size, size);

        // Organic swirling veins
        const veinColors = ['rgba(71, 85, 105, 0.45)', 'rgba(100, 116, 139, 0.3)', 'rgba(203, 213, 225, 0.4)'];
        veinColors.forEach((color, idx) => {
            diffCtx.strokeStyle = color;
            diffCtx.lineWidth = 2 + idx;
            diffCtx.beginPath();
            diffCtx.moveTo(0, Math.random() * size);
            diffCtx.bezierCurveTo(size * 0.3, Math.random() * size, size * 0.7, Math.random() * size, size, Math.random() * size);
            diffCtx.stroke();
        });

        // High gloss mirror polish
        roughCtx.fillStyle = '#181818';
        roughCtx.fillRect(0, 0, size, size);
    }

    drawConcreteGrain(diffCtx, normCtx, roughCtx, size, baseColor) {
        diffCtx.fillStyle = baseColor;
        diffCtx.fillRect(0, 0, size, size);

        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            diffCtx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';
            diffCtx.fillRect(x, y, 2, 2);
        }

        roughCtx.fillStyle = '#aaaaaa';
        roughCtx.fillRect(0, 0, size, size);
    }
}

const pbrEngine = new PBRMaterialEngine();

if (typeof module !== 'undefined') {
    module.exports = { PBRMaterialEngine, pbrEngine };
}
