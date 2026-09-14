fx_version 'cerulean'
game 'gta5'

name 'drug_crafting_minigame'
author 'Antigravity'
description 'In-Depth Chemical Synthesizer & Drug Crafting Minigame with QBox & ox_lib Support'
version '1.1.0'

ui_page 'ui/index.html'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

files {
    'ui/index.html',
    'ui/style.css',
    'ui/script.js'
}

exports {
    'StartCrafting'
}
