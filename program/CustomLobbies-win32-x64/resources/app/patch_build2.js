const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts['build:exe'] = 'electron-packager . CustomLobbies --platform=win32 --arch=x64 --out=program --overwrite --ignore="^/(node_modules|dist|program|models_raw|fivem_.*|gamemode|drug_crafting_minigame|helix_hospitality|munchies_complete|outbreak_game|perkpulse|qbx_.*|salty_ai_arena|standalone_drug_turfs|tools|trackball-tracker|weed_icecream_truck|maps|entities|items|\\.git|discord-bot)"';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
