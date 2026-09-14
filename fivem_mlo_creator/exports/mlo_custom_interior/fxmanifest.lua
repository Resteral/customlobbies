fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'FiveM MLO Studio'
description 'Photorealistic Ground-Up MLO Studio & In-Game Builder Menu'
version '2.0.0'

this_is_a_map 'yes'

data_file 'DLC_ITYP_REQUEST' 'stream/mlo_custom_interior.ytyp'

ui_page 'nui/index.html'

files {
    'nui/index.html',
    'nui/style.css',
    'nui/script.js'
}

client_scripts {
    'config.lua',
    'client.lua'
}

server_scripts {
    'server.lua'
}
