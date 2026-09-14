fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'fivem_pockets'
author 'Antigravity'
description 'Native Qbox Pocket Inventory, Dual Holster, Paperdoll & Backpack System'
version '1.0.0'

ui_page 'nui/index.html'

dependencies {
    'qbx_core',
    'ox_lib',
    'oxmysql'
}

shared_scripts {
    '@ox_lib/init.lua',
    'sh_config.lua'
}

client_scripts {
    'cl_pockets.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'sv_pockets.lua'
}

files {
    'nui/index.html',
    'nui/style.css',
    'nui/script.js'
}
