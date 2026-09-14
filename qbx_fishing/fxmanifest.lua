fx_version 'cerulean'
game 'gta5'

name 'qbx_fishing'
author 'v0'
description 'In-depth tiered fishing script for Qbox (qbx_core)'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
}

client_scripts {
    'client/main.lua',
}

server_scripts {
    'server/main.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/app.js',
}

dependencies {
    'qbx_core',
    'ox_lib',
    'ox_inventory',
    'ox_target',
}

lua54 'yes'
