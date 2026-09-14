fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Helix Development Studio'
description 'In-Depth Hospitality, Mixology & Nightlife Tycoon for FiveM (Standalone + Universal Bridge)'
version '1.0.0'

shared_scripts {
    'config.lua',
    'bridge/sh_bridge.lua'
}

client_scripts {
    'bridge/cl_bridge.lua',
    'client/cl_main.lua',
    'client/cl_bartender.lua',
    'client/cl_alcohol.lua',
    'client/cl_vip.lua',
    'client/cl_venue.lua',
    'client/cl_items.lua',
    'client/cl_nui.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'bridge/sv_bridge.lua',
    'server/sv_storage.lua',
    'server/sv_main.lua',
    'server/sv_bartender.lua',
    'server/sv_alcohol.lua',
    'server/sv_vip.lua',
    'server/sv_venue.lua',
    'server/sv_items.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/css/style.css',
    'html/js/audio_synth.js',
    'html/js/app.js',
    'html/js/mixology.js',
    'html/js/tablet.js',
    'html/js/pos.js',
    'html/js/breathalyzer.js',
    'data/*.json',
    'data/*.lua'
}
