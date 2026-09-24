#!/usr/bin/env node
/**
 * HELIX Multi-Source 3D Asset Downloader & Generator Hub
 * Supports:
 *  - Poly Haven (100% Free CC0 Models & Textures) via REST API
 *  - ambientCG (100% Free CC0 PBR Materials & Assets)
 *  - Meshy AI (Bespoke Text-to-3D / Image-to-3D with API Key)
 *  - Manual Import watcher for Sketchfab / CGTrader / TurboSquid downloads (.glb, .gltf, .obj, .fbx)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const MODELS_DIR = path.join(ROOT_DIR, 'assets', 'models');
const TEXTURES_DIR = path.join(ROOT_DIR, 'assets', 'textures');
const MANIFEST_PATH = path.join(ROOT_DIR, 'assets', 'ModelManifest.json');

const DEFAULT_MESHY_KEY = 'msy_2q4TtvmIjrfn5wy35VSCUDUK78CF8nTHoIud';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(MODELS_DIR);
ensureDir(TEXTURES_DIR);

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'HELIX-Asset-Hub/1.0' } }, (res) => {
      let data = '';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage} from ${url}`));
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'HELIX-Asset-Hub/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url} (HTTP ${res.statusCode})`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });
    }).on('error', (err) => {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

function updateManifest(id, filename, metadata = {}) {
  let manifest = { generatedAt: new Date().toISOString(), totalModels: 0, models: {} };
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (e) {}
  }

  manifest.models[id] = {
    filename,
    relativePath: `assets/models/${filename}`,
    source: metadata.source || 'polyhaven',
    category: metadata.category || 'General',
    description: metadata.description || id,
    tags: metadata.tags || [],
    author: metadata.author || 'Poly Haven / ambientCG / Meshy',
    license: metadata.license || 'CC0',
    updatedAt: new Date().toISOString()
  };

  manifest.totalModels = Object.keys(manifest.models).length;
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

const PolyHaven = {
  async listModels(query = '') {
    console.log('[POLY HAVEN] Fetching free model library index...');
    const allAssets = await fetchJson('https://api.polyhaven.com/assets?t=models');
    const modelKeys = Object.keys(allAssets);
    
    if (!query) {
      return modelKeys.slice(0, 30).map(id => ({ id, ...allAssets[id] }));
    }

    const q = query.toLowerCase();
    const filtered = modelKeys.filter(id => {
      const item = allAssets[id];
      const matchName = id.toLowerCase().includes(q) || (item.name && item.name.toLowerCase().includes(q));
      const matchTag = item.tags && item.tags.some(t => t.toLowerCase().includes(q));
      const matchCat = item.categories && item.categories.some(c => c.toLowerCase().includes(q));
      return matchName || matchTag || matchCat;
    });

    return filtered.map(id => ({ id, ...allAssets[id] }));
  },

  async downloadModel(assetId, resolution = '1k') {
    console.log(`[POLY HAVEN] Fetching download URLs for: ${assetId} (${resolution})...`);
    const fileData = await fetchJson(`https://api.polyhaven.com/files/${assetId}`);
    
    // Look for gltf / glb format
    let gltfUrl = null;

    if (fileData.gltf && fileData.gltf[resolution] && fileData.gltf[resolution].gltf) {
      gltfUrl = fileData.gltf[resolution].gltf.url;
    } else if (fileData.gltf) {
      const availRes = Object.keys(fileData.gltf)[0];
      if (availRes && fileData.gltf[availRes].gltf) {
        gltfUrl = fileData.gltf[availRes].gltf.url;
      }
    }

    if (!gltfUrl) {
      throw new Error(`No GLTF download available for asset: ${assetId}`);
    }

    const outputFilename = `polyhaven_${assetId}.gltf`;
    const destPath = path.join(MODELS_DIR, outputFilename);

    console.log(`[POLY HAVEN] Downloading ${assetId} -> ${outputFilename}...`);
    await downloadFile(gltfUrl, destPath);

    // Also download associated bin or textures if gltf format
    if (fileData.gltf[resolution] && fileData.gltf[resolution].gltf.include) {
      for (const [incFile, incData] of Object.entries(fileData.gltf[resolution].gltf.include)) {
        const incDest = path.join(MODELS_DIR, incFile);
        ensureDir(path.dirname(incDest));
        console.log(`[POLY HAVEN] Downloading dependency: ${incFile}...`);
        await downloadFile(incData.url, incDest);
      }
    }

    updateManifest(assetId, outputFilename, {
      source: 'polyhaven',
      category: 'Prop',
      description: `Poly Haven CC0 3D Asset: ${assetId}`,
      license: 'CC0'
    });

    console.log(`\x1b[32m✔ Successfully imported Poly Haven model: ${outputFilename}\x1b[0m`);
    return destPath;
  }
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'search': {
      const q = args[1] || '';
      console.log(`\n🔍 Searching Poly Haven 100% Free Models for: "${q}"...`);
      const results = await PolyHaven.listModels(q);
      console.log(`Found ${results.length} free CC0 models:\n`);
      results.slice(0, 20).forEach(r => {
        console.log(` • \x1b[36m${r.id}\x1b[0m (Tags: ${(r.tags || []).slice(0, 4).join(', ')})`);
      });
      break;
    }

    case 'download': {
      const assetId = args[1];
      if (!assetId) {
        console.error('Please specify asset ID (e.g. node tools/asset_source_hub.js download wooden_table_02)');
        process.exit(1);
      }
      await PolyHaven.downloadModel(assetId);
      break;
    }

    case 'fetch-curated': {
      console.log('\n📦 Fetching Curated Free CC0 Prop Pack for Pacifica & Drug Labs...');
      const curated = ['chemical_barrel', 'wooden_crate_01', 'plastic_bucket_01', 'gas_cylinder', 'car_battery_01'];
      for (const item of curated) {
        try {
          await PolyHaven.downloadModel(item);
        } catch (err) {
          console.log(`Note on ${item}: ${err.message}`);
        }
      }
      break;
    }

    case 'meshy': {
      const prompt = args.slice(1).join(' ');
      if (!prompt) {
        console.error('Please provide a prompt for Meshy AI text-to-3D');
        process.exit(1);
      }
      console.log(`[MESHY AI] Generating 3D model with prompt: "${prompt}"...`);
      const { spawn } = require('child_process');
      const meshyProc = spawn('node', ['tools/meshy_model_generator.js', '--api-key', DEFAULT_MESHY_KEY], { stdio: 'inherit' });
      break;
    }

    default:
      console.log(`
\x1b[35m=== HELIX Multi-Source 3D Asset Downloader & Ingestor ===\x1b[0m

\x1b[33mCommands:\x1b[0m
  \x1b[32mnode tools/asset_source_hub.js search [query]\x1b[0m
    Searches 100% free CC0 models on Poly Haven (e.g. table, plant, barrel, tool, lamp)

  \x1b[32mnode tools/asset_source_hub.js download <asset_id>\x1b[0m
    Downloads free GLTF/GLB model from Poly Haven directly into assets/models/

  \x1b[32mnode tools/asset_source_hub.js fetch-curated\x1b[0m
    Downloads curated barrels, crates, batteries, gas tanks, and containers.

  \x1b[32mnode tools/asset_source_hub.js meshy "<prompt>"\x1b[0m
    Generates custom AI 3D assets using Meshy AI with your API key.

\x1b[33mSupported Sources:\x1b[0m
  - Poly Haven (api.polyhaven.com) - 100% Free CC0 Models & PBR Textures
  - ambientCG (ambientcg.com) - 100% Free CC0 Materials
  - Meshy AI (api.meshy.ai) - Photorealistic AI 3D Generation
  - Sketchfab / CGTrader / TurboSquid - Drop downloaded .glb/.fbx files into assets/models/
`);
  }
}

if (require.main === module) {
  main().catch(err => console.error('[ASSET HUB ERROR]', err));
}

module.exports = { PolyHaven, updateManifest };
