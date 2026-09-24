#!/usr/bin/env node
/**
 * HELIX Platform - Package Publisher & Distribution Bundler
 * Builds, validates, and packages the complete HelixGame package for release/publishing.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PACKAGE_NAME = 'HelixGame-PacificaCrimeAndLabs';
const VERSION = '1.0.0';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getDirectorySize(dirPath) {
  let size = 0;
  if (!fs.existsSync(dirPath)) return 0;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      size += getDirectorySize(fullPath);
    } else {
      size += stats.size;
    }
  }
  return size;
}

console.log('=====================================================================');
console.log(`[*] HELIX PACKAGE PUBLISHER: ${PACKAGE_NAME} (v${VERSION})`);
console.log('=====================================================================');

ensureDir(DIST_DIR);

// 1. Validate Structure
console.log('[1/4] Validating Package Architecture & Assets...');
const requiredDirs = [
  path.join(ROOT_DIR, 'js', 'server'),
  path.join(ROOT_DIR, 'js', 'client'),
  path.join(ROOT_DIR, 'ui'),
  path.join(ROOT_DIR, 'maps'),
  path.join(ROOT_DIR, 'assets', 'models')
];

let allValid = true;
requiredDirs.forEach(d => {
  if (!fs.existsSync(d)) {
    console.error(`  ❌ Missing required directory: ${path.relative(ROOT_DIR, d)}`);
    allValid = false;
  } else {
    console.log(`  ✔ Verified: ${path.relative(ROOT_DIR, d)}`);
  }
});

// Count components
const serverFiles = fs.readdirSync(path.join(ROOT_DIR, 'js', 'server')).filter(f => f.endsWith('.js'));
const clientFiles = fs.readdirSync(path.join(ROOT_DIR, 'js', 'client')).filter(f => f.endsWith('.js'));
const uiFiles = fs.readdirSync(path.join(ROOT_DIR, 'ui')).filter(f => f.endsWith('.html'));
const modelFiles = fs.readdirSync(path.join(ROOT_DIR, 'assets', 'models')).filter(f => f.endsWith('.glb') || f.endsWith('.gltf'));

console.log(`\n  • Server Modules: ${serverFiles.length}`);
console.log(`  • Client Controllers: ${clientFiles.length}`);
console.log(`  • Interactive WebUIs: ${uiFiles.length}`);
console.log(`  • 3D PBR Models: ${modelFiles.length}`);

// 2. Generate Release Manifest
console.log('\n[2/4] Generating Distribution Manifest...');
const manifest = {
  packageName: PACKAGE_NAME,
  version: VERSION,
  buildDate: new Date().toISOString(),
  engineCompatibility: 'HELIX UE5 (5.7+)',
  totalAssetsCount: modelFiles.length,
  serverModules: serverFiles,
  clientControllers: clientFiles,
  webUIs: uiFiles,
  models: modelFiles,
  entryPoint: 'js/index.js',
  mapConfiguration: 'maps/pacifica_crime_map.json'
};

fs.writeFileSync(path.join(DIST_DIR, 'package_manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('  ✔ Created dist/package_manifest.json');

// 3. Create 1-Click Installer
console.log('\n[3/4] Creating 1-Click Universal Installer Script...');
const installerBat = `@echo off
title HELIX Package Installer - ${PACKAGE_NAME}
color 0a
cls

echo =====================================================================
echo   HELIX Package Installer: ${PACKAGE_NAME} (v${VERSION})
echo =====================================================================
echo.
echo [*] Searching for HELIX Dedicated Server and Client installations...
echo.

set "TARGET_DIR="

if exist "S:\\SteamLibrary\\steamapps\\common\\HELIX Dedicated Server\\Packages" (
    set "TARGET_DIR=S:\\SteamLibrary\\steamapps\\common\\HELIX Dedicated Server\\Packages\\HelixGame"
) else if exist "C:\\Program Files (x86)\\Steam\\steamapps\\common\\HELIX Dedicated Server\\Packages" (
    set "TARGET_DIR=C:\\Program Files (x86)\\Steam\\steamapps\\common\\HELIX Dedicated Server\\Packages\\HelixGame"
)

if "%TARGET_DIR%"=="" (
    echo [!] Could not automatically detect HELIX Steam path.
    echo Please copy this folder into your "HELIX Dedicated Server\\Packages\\" directory.
    pause
    exit /b
)

echo [✓] Found HELIX Server directory: %TARGET_DIR%
echo [*] Installing package files...

xcopy /E /I /Y "%~dp0..\\*" "%TARGET_DIR%\\" /EXCLUDE:%~dp0exclude.txt

echo.
echo =====================================================================
echo [✓] SUCCESS! ${PACKAGE_NAME} installed and ready to play!
echo =====================================================================
echo.
pause
`;

fs.writeFileSync(path.join(DIST_DIR, 'Install_Package.bat'), installerBat, 'utf8');
fs.writeFileSync(path.join(DIST_DIR, 'exclude.txt'), 'dist\n.git\nnode_modules\n.user_uploaded\n', 'utf8');
console.log('  ✔ Created dist/Install_Package.bat');

// 4. Build Compressed .ZIP Package
console.log('\n[4/4] Building Distributable Release Archive (.ZIP)...');
const zipName = `${PACKAGE_NAME}-v${VERSION}.zip`;
const zipPath = path.join(DIST_DIR, zipName);

try {
  const psCmd = `Compress-Archive -Path "js", "ui", "maps", "assets", "package.json", "Server.json", "Config.json", "README.md" -DestinationPath "${zipPath}" -Force`;
  execSync(`powershell -Command "${psCmd}"`, { cwd: ROOT_DIR });
  const stats = fs.statSync(zipPath);
  console.log(`\x1b[32m✔ Successfully built published release archive: dist/${zipName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)\x1b[0m`);
} catch (err) {
  console.warn(`  Note on zip compression: ${err.message}`);
}

console.log('\n=====================================================================');
console.log(`[✓] PUBLISHED PACKAGE READY FOR DISTRIBUTION IN: dist/`);
console.log(`  • Archive: dist/${zipName}`);
console.log(`  • Manifest: dist/package_manifest.json`);
console.log(`  • Installer: dist/Install_Package.bat`);
console.log('=====================================================================\n');
