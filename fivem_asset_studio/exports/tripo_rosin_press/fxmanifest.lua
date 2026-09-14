fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'tripo_rosin_press'
author 'FiveM 3D Asset Studio • Tripo Pipeline'
description 'Custom 3D Model System Generated with FiveM Asset Studio'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/cl_main.lua'
}

server_scripts {
    'server/sv_main.lua'
}

data_file 'DLC_ITYP_REQUEST' 'stream/prop_weed_press_01.ytyp'
