fx_version 'cerulean'
game 'gta5'

name 'weed_icecream_truck'
author 'HelixGame'
description 'Interactive Weed Selling Ice Cream Truck resource supporting QBCore, ESX, and Standalone with NPC Buyers, 3D Jingle Audio, NUI, and Police Alerts.'
version '1.0.0'

ui_page 'html/ui.html'

shared_scripts {
    'config.lua',
    'shared/items.lua'
}

client_scripts {
    'client/cl_main.lua'
}

server_scripts {
    'server/sv_main.lua'
}

files {
    'html/ui.html',
    'html/style.css',
    'html/script.js',
    'html/img/*',
    'stream/**/*.meta'
}

data_file 'VEHICLE_METADATA_FILE' 'stream/vehicles.meta'
data_file 'VEHICLE_VARIATION_FILE' 'stream/carvariations.meta'
