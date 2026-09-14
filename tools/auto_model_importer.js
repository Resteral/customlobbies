const fs = require('fs');
const path = require('path');

/**
 * Auto Model Importer for HELIX Project
 * Monitors 'models_raw/' and automatically imports 3D GLB/OBJ models into 'assets/models/'
 * Supports both Meshy AI and Tripo 3D models.
 * Generates and updates 'assets/ModelManifest.json' for HELIX runtime.
 */

const RAW_DIR = path.join(__dirname, '..', 'models_raw');
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'models');
const MANIFEST_PATH = path.join(__dirname, '..', 'assets', 'ModelManifest.json');

// Asset Key Mapping Rules (Supports Meshy & Tripo filename conventions)
const MODEL_MAPPINGS = {
  // Meshy Mappings
  'meshy_weed_pot': 'weed_pot',
  'meshy_weed_box': 'weed_box',
  'meshy_crypto_farm': 'crypto_farm',
  'meshy_crypto_usb': 'crypto_usb',
  'meshy_meth_lab': 'meth_lab',
  'meshy_bank_vault': 'bank_vault',
  'meshy_drillable_safe': 'drillable_safe',
  'meshy_thermal_drill': 'thermal_drill',
  'meshy_hack_terminal': 'hack_terminal',
  'meshy_blackmarket_dealer': 'blackmarket_dealer',
  'meshy_loot_bag': 'loot_bag',

  // Tripo 3D Mappings
  'tripo_weed_pot': 'weed_pot',
  'tripo_weed_box': 'weed_box',
  'tripo_crypto_farm': 'crypto_farm',
  'tripo_crypto_usb': 'crypto_usb',
  'tripo_meth_lab': 'meth_lab',
  'tripo_bank_vault': 'bank_vault',
  'tripo_drillable_safe': 'drillable_safe',
  'tripo_thermal_drill': 'thermal_drill',
  'tripo_hack_terminal': 'hack_terminal',
  'tripo_blackmarket_dealer': 'blackmarket_dealer',
  'tripo_loot_bag': 'loot_bag'
};

function ensureDirectories() {
  if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (e) {
      console.error('[-] Failed reading manifest, creating new manifest.');
    }
  }
  return { version: '1.0.0', lastUpdated: new Date().toISOString(), models: {} };
}

function saveManifest(manifest) {
  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[✓] Updated ModelManifest.json with ${Object.keys(manifest.models).length} assets.`);
}

function importModelFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (!['.glb', '.gltf', '.obj', '.fbx', '.mdl'].includes(ext)) return;

  const baseName = path.basename(filename, ext);
  const targetKey = MODEL_MAPPINGS[baseName] || baseName;
  const sourcePath = path.join(RAW_DIR, filename);
  const targetFilename = `${targetKey}${ext}`;
  const targetPath = path.join(ASSETS_DIR, targetFilename);

  console.log(`[*] Importing 3D Model: ${filename} -> assets/models/${targetFilename}`);

  fs.copyFileSync(sourcePath, targetPath);

  const manifest = loadManifest();
  manifest.models[targetKey] = {
    key: targetKey,
    filename: targetFilename,
    path: `assets/models/${targetFilename}`,
    format: ext.replace('.', ''),
    provider: filename.startsWith('tripo_') ? 'tripo3d' : filename.startsWith('meshy_') ? 'meshy' : 'custom',
    importedAt: new Date().toISOString()
  };

  saveManifest(manifest);
  console.log(`[✓] Successfully imported '${targetKey}' model into HELIX project!`);
}

function scanAndImportAll() {
  ensureDirectories();
  console.log('===================================================');
  console.log(' HELIX Project - Auto 3D Model Importer ');
  console.log('===================================================');
  console.log(`[*] Scanning '${RAW_DIR}' for new models...`);

  const files = fs.readdirSync(RAW_DIR);
  let count = 0;
  files.forEach(file => {
    importModelFile(file);
    count++;
  });

  if (count === 0) {
    console.log('[!] No model files found in models_raw/. Add .glb files to import!');
  }
}

function startFileWatcher() {
  ensureDirectories();
  scanAndImportAll();

  console.log(`\n[📡] File Watcher ACTIVE. Monitoring '${RAW_DIR}' for new 3D models...`);
  fs.watch(RAW_DIR, (eventType, filename) => {
    if (filename && eventType === 'rename') {
      const fullPath = path.join(RAW_DIR, filename);
      if (fs.existsSync(fullPath)) {
        setTimeout(() => importModelFile(filename), 500);
      }
    }
  });
}

if (process.argv.includes('--watch')) {
  startFileWatcher();
} else {
  scanAndImportAll();
}
