const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.main = 'main-desktop.js';
pkg.scripts['build:exe'] = 'electron-packager . CustomLobbies --platform=win32 --arch=x64 --out=program --overwrite --ignore="^/(node_modules/electron-packager|node_modules/electron/dist)"';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
