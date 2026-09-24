/**
 * HELIX Platform - Universal Workspace Sync Tool
 * Injects all server scripts, Lua modules, JS engines, WebUIs, 3D assets, and maps
 * into ALL HELIX Workspaces (including any new world created in-game).
 */

const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = path.resolve(__dirname, '..');
const WORKSPACES_DIR = 'C:\\Users\\Sean\\AppData\\Local\\Helix\\Workspaces';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(WORKSPACES_DIR)) {
  console.error(`[!] Workspaces directory not found: ${WORKSPACES_DIR}`);
  process.exit(1);
}

const workspaces = fs.readdirSync(WORKSPACES_DIR).filter(item => {
  const full = path.join(WORKSPACES_DIR, item);
  return fs.statSync(full).isDirectory();
});

console.log(`=====================================================================`);
console.log(`[*] HELIX UNIVERSAL WORLD SYNC: Ingesting server content into ${workspaces.length} World(s)`);
console.log(`=====================================================================`);

workspaces.forEach(wsId => {
  const wsPath = path.join(WORKSPACES_DIR, wsId);
  const targetScripts = path.join(wsPath, 'scripts');
  const targetMain = path.join(targetScripts, 'main');
  const targetContent = path.join(wsPath, 'content');

  console.log(`\n[+] Syncing World: ${wsId}`);

  // Ensure directories
  ['shared', 'server', 'client', 'ui', 'js', 'assets', 'maps', 'items'].forEach(dir => {
    const dirPath = path.join(targetMain, dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  });

  // Copy Lua Scripts
  const sourceFiles = fs.readdirSync(SOURCE_ROOT);
  sourceFiles.forEach(file => {
    const fullPath = path.join(SOURCE_ROOT, file);
    if (fs.statSync(fullPath).isFile() && file.endsWith('.lua')) {
      fs.copyFileSync(fullPath, path.join(targetMain, file));

      if (file.startsWith('sh_')) {
        fs.copyFileSync(fullPath, path.join(targetMain, 'shared', file));
      } else if (file.startsWith('sv_') || file.startsWith('ox_')) {
        fs.copyFileSync(fullPath, path.join(targetMain, 'server', file));
      } else if (file.startsWith('cl_')) {
        fs.copyFileSync(fullPath, path.join(targetMain, 'client', file));
      }
    }
  });

  // Copy Folders: js, ui, assets, maps, items
  ['js', 'ui', 'assets', 'maps', 'items'].forEach(folder => {
    const srcFolder = path.join(SOURCE_ROOT, folder);
    if (fs.existsSync(srcFolder)) {
      copyRecursiveSync(srcFolder, path.join(targetMain, folder));
    }
  });

  // Copy Configs
  ['Config.json', 'Server.json', 'package.json'].forEach(cfg => {
    const srcCfg = path.join(SOURCE_ROOT, cfg);
    if (fs.existsSync(srcCfg)) {
      fs.copyFileSync(srcCfg, path.join(targetMain, cfg));
    }
  });

  // Write Workspace Package Manifest for HELIX Engine
  const packageManifest = {
    name: "HelixGame-Pacifica",
    version: "1.0.0",
    main: "js/index.js",
    shared: [
      "shared/*.lua",
      "sh_*.lua"
    ],
    server: [
      "server/*.lua",
      "sv_*.lua",
      "ox_*.lua",
      "js/server/*.js",
      "js/index.js"
    ],
    client: [
      "client/*.lua",
      "cl_*.lua",
      "js/client/*.js"
    ],
    ui: [
      "ui/*.*",
      "ui/**/*.*"
    ],
    map: "maps/pacifica_crime_map.json"
  };

  fs.writeFileSync(
    path.join(targetMain, 'package.json'),
    JSON.stringify(packageManifest, null, 2),
    'utf8'
  );

  // Ensure scripts/config.json lists "main"
  fs.writeFileSync(
    path.join(targetScripts, 'config.json'),
    JSON.stringify({ packages: ["main"] }, null, 2),
    'utf8'
  );

  console.log(`  ✔ Successfully injected all server scripts & UI into ${wsId}`);
});

console.log(`\n=====================================================================`);
console.log(`[✓] ALL HELIX WORLDS ARE FULLY SYNCED WITH SERVER CONTENT!`);
console.log(`=====================================================================`);
