fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Resteral / Antigravity'
description 'Realistic Industrial Smelting & Metal Refining System for QBox / ox_inventory'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
    'shared/*.lua'
}

client_scripts {
    'client/cl_main.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/sv_main.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}

dependencies {
    'ox_lib',
    'ox_target',
    'ox_inventory'
}
