// Mock Data Master Engine for CustomLobbies.com
const INITIAL_GAMES = [
    { id: 'all', name: 'All Games', icon: '🎮', category: 'All', activeQueues: 18450, avgQueueSec: 4, tickrate: '128-Tick', defaultPort: 27015 },
    { id: 'cs2', name: 'Counter-Strike 2', icon: '🎯', category: 'FPS', activeQueues: 6420, avgQueueSec: 6, tickrate: '128-Tick Sub-Tick', defaultPort: 27015, protocol: 'steam://connect/127.0.0.1:7777' },
    { id: 'valorant', name: 'Valorant', icon: '🛡️', category: 'Tactical FPS', activeQueues: 5120, avgQueueSec: 5, tickrate: '128-Tick Riot Direct', defaultPort: 27015 },
    { id: 'pacifica', name: 'Pacifica Crime 5v5', icon: '🔫', category: 'UE5 Sandbox', activeQueues: 2840, avgQueueSec: 4, tickrate: '128-Tick Helix Server', defaultPort: 7777, protocol: 'steam://connect/127.0.0.1:7777' },
    { id: 'wardogs', name: 'WARDOG 33v33', icon: '🐕', category: 'Battalion FPS', activeQueues: 3410, avgQueueSec: 8, tickrate: '64-Tick Server Fleet', defaultPort: 7777, protocol: 'steam://connect/127.0.0.1:7777' },
    { id: 'dota2', name: 'Dota 2', icon: '⚔️', category: 'MOBA', activeQueues: 1950, avgQueueSec: 12, tickrate: '64-Tick Valve Dedicated', defaultPort: 27015 },
    { id: 'slapshot', name: 'Slapshot: Rebound', icon: '🏒', category: 'Sports Arcade', activeQueues: 980, avgQueueSec: 4, tickrate: '128-Tick Physics', defaultPort: 27015 },
    { id: 'rocketleague', name: 'Rocket League', icon: '🏎️', category: 'Sports', activeQueues: 1720, avgQueueSec: 5, tickrate: '128-Tick Direct', defaultPort: 27015 }
];

const INITIAL_LOBBIES = [
    {
        id: 'lobby_101',
        title: '🔥 5v5 CS2 High MMR Scrims (128-Tick Dedicated Server)',
        game: 'cs2',
        gameName: 'Counter-Strike 2',
        host: { id: 'host_1', username: 'ApexGod99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
        mode: 'Ranked Scrim',
        region: 'NA East (Virginia)',
        serverIp: '127.0.0.1:7777',
        connectLink: 'steam://connect/127.0.0.1:7777',
        consoleCommand: 'connect 127.0.0.1:7777; password helix_comp_scrim',
        tier: 'Radiant Tier',
        ping: 14,
        maxSlots: 10,
        currentPlayers: [
            { id: 'host_1', username: 'ApexGod99', team: 'Alpha', ready: true, role: 'Host', ping: 14, mmr: 2450 },
            { id: 'p2', username: 'S1mple_Fragger', team: 'Alpha', ready: true, role: 'Member', ping: 18, mmr: 2650 },
            { id: 'p3', username: 'ZywOo_Master', team: 'Omega', ready: true, role: 'Member', ping: 16, mmr: 2620 },
            { id: 'p4', username: 'NiKo_OneTap', team: 'Omega', ready: true, role: 'Member', ping: 19, mmr: 2590 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Built-in Spatial VoIP',
        rules: 'Standard 5v5 FACEIT Rules. 128-tick server node.',
        createdAt: '2 mins ago',
        tags: ['CS2', '5v5', 'HighMMR', 'HelixServer']
    },
    {
        id: 'lobby_102',
        title: '🛡️ Valorant Radiant 5v5 Customs & Draft',
        game: 'valorant',
        gameName: 'Valorant',
        host: { id: 'host_2', username: 'Valkyrie_CS', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
        mode: 'Custom Competitive',
        region: 'NA East (Virginia)',
        serverIp: '192.168.1.85:27015',
        connectLink: 'customlobbies://direct-connect',
        consoleCommand: 'connect 192.168.1.85:27015; password customlobbies',
        tier: 'Radiant Tier',
        ping: 18,
        maxSlots: 10,
        currentPlayers: [
            { id: 'host_2', username: 'Valkyrie_CS', team: 'Alpha', ready: true, role: 'Host', ping: 18, mmr: 2380 },
            { id: 'p5', username: 'GhostRider', team: 'Omega', ready: true, role: 'Member', ping: 22, mmr: 2210 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Discord Voice Channel',
        rules: 'Must be Diamond III or higher.',
        createdAt: '5 mins ago',
        tags: ['Valorant', 'Radiant', '5v5']
    },
    {
        id: 'lobby_103',
        title: '🔫 Pacifica Metro 5v5 Scrim & Gunsmith Duel',
        game: 'pacifica',
        gameName: 'Pacifica Crime 5v5',
        host: { id: 'host_3', username: 'ShadowBlade', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
        mode: 'Pacifica Metro Scrim',
        region: 'Helix Dedicated (127.0.0.1:7777)',
        serverIp: '127.0.0.1:7777',
        connectLink: 'steam://connect/127.0.0.1:7777',
        consoleCommand: 'connect 127.0.0.1:7777; password helix_comp_scrim',
        tier: 'Open Tier',
        ping: 12,
        maxSlots: 10,
        currentPlayers: [
            { id: 'host_3', username: 'ShadowBlade', team: 'Alpha', ready: true, role: 'Host', ping: 12, mmr: 1980 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Helix Server Proximity VoIP',
        rules: 'Unreal Engine 5 Pacifica Crime Rules.',
        createdAt: 'Just now',
        tags: ['Pacifica', '5v5', 'HelixServer', 'UE5']
    }
];

const INITIAL_STREAMS = [
    { id: 'str_1', title: '🔴 CS2 GRAND FINALS scrims ($1,500 Prize Pool)', streamer: 'ApexGod99', viewers: 1840, game: 'Counter-Strike 2', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80' },
    { id: 'str_2', title: '🛡️ VALORANT RADIANT LOBBY SWEEP', streamer: 'Valkyrie_CS', viewers: 1210, game: 'Valorant', thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80' }
];

const INITIAL_GROUPS = [
    { id: 'grp_1', name: 'FaZe Clan Esports Squad', membersCount: 1280, icon: '⚡', description: 'Official FaZe Clan Competitive CustomLobbies Squad' },
    { id: 'grp_2', name: 'WARDOG Battalion Command', membersCount: 840, icon: '🐕', description: '33v33 WARDOG Faction Alpha & Bravo Operational Unit' }
];

const INITIAL_FRIENDS = [
    { id: 'fr_1', username: 'S1mple_Fragger', rank: 'Radiant', status: 'Online', game: 'Counter-Strike 2', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' },
    { id: 'fr_2', username: 'Valkyrie_CS', rank: 'Grandmaster', status: 'In Match', game: 'Valorant', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' }
];
