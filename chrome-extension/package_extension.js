const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

console.log('📦 Packaging CustomLobbies Manifest V3 Chrome Extension...');

const extDir = __dirname;
const filesToPackage = [
  'manifest.json',
  'popup.html',
  'popup.js',
  'content.js',
  'background.js',
  'side_panel.html',
  'side_panel.js',
  'options.html',
  'options.js',
  'icon16.png',
  'icon48.png',
  'icon128.png',
  'icon.png'
];

let totalBytes = 0;
filesToPackage.forEach(f => {
  const p = path.join(extDir, f);
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    totalBytes += stat.size;
    console.log(`  ✔ [OK] ${f} (${stat.size} bytes)`);
  } else {
    console.warn(`  ⚠ [MISSING] ${f}`);
  }
});

console.log(`\n🎉 Chrome Extension Package ready! (${filesToPackage.length} files, ${(totalBytes / 1024).toFixed(2)} KB)`);
console.log('👉 To load in Chrome: Go to chrome://extensions -> Enable Developer mode -> Click Load unpacked -> Select folder:');
console.log(`   ${extDir}`);
