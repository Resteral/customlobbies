const fs = require('fs');

const files = [
  './js/wardogs-engine.js',
  './js/app.js',
  './discord-bot/bot.js',
  './entities/entities/ix_drillable_safe/init.lua',
  './entities/entities/ix_drillable_safe/cl_init.lua',
  './wiki/js/wiki-data.js',
  './js/server/tow_truck_mechanics.js',
  './js/server/business.js',
  './entities/entities/ix_crypto_farm/init.lua'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace $1,000 Cash with 1,000 CL-Points
    content = content.replace(/\$([\d,]+)\s*Cash/gi, '$1 CL-Points');
    // Replace just Cash with Rep
    content = content.replace(/Dirty Cash/gi, 'Black Market Rep');
    content = content.replace(/Cash/gi, 'CL-Points');
    content = content.replace(/\$([\d,]+)/g, '$1 CL-Points');
    content = content.replace(/cashVal/g, 'pointVal');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
