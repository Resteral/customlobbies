fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'standalone_business_empire'
author 'FiveM Standalone Script Factory'
description 'Commercial Business Empire - 100% Standalone Multi-Framework Resource'
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
