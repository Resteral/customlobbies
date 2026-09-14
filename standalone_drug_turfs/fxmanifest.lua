fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Resteral / Antigravity'
description 'Standalone Drug Turf Capture, Block Protection & Corner Selling System'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/cl_turfs.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/sv_turfs.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}
