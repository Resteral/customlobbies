// Seed Data for CustomLobbies.com - Global Game Roster, Servers & Databases
const DEFAULT_USER = {
    id: 'user_me',
    username: 'GhostRider_99',
    tag: '#4092',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    status: 'online',
    customStatus: 'Looking for 5v5 sweaty scrims 🔥',
    rank: 'Diamond III',
    mmr: 2180,
    stats: {
        kd: '1.84',
        winRate: '68.5%',
        matchesPlayed: 342,
        mvpCount: 89
    },
    favoriteGames: ['Valorant', 'CS2', 'GTA V / RP', 'Marvel Rivals'],
    introVideo: null,
    introQuote: 'Clutch king or team mascot, either way we win! Let me in!',
    squadId: 'squad_1',
    friends: ['user_2', 'user_3', 'user_5', 'user_4']
};

const INITIAL_GAMES = [
    { 
        id: 'all', 
        name: 'All Games', 
        category: 'All',
        icon: '🎮',
        activeQueues: 1420,
        activeLobbies: 85,
        serverNodes: 'Global Fleet'
    },
    { 
        id: 'valorant', 
        name: 'Valorant', 
        category: 'Tactical FPS',
        icon: '🎯', 
        banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        protocol: 'riotgames://valorant/party/join',
        defaultPort: 7777,
        avgQueueSec: 12,
        activeQueues: 340,
        activeLobbies: 24,
        tickrate: '128-Tick Riot Direct'
    },
    { 
        id: 'cs2', 
        name: 'Counter-Strike 2', 
        category: 'Tactical FPS',
        icon: '💣', 
        banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
        protocol: 'steam://connect/144.76.12.89:27015',
        defaultPort: 27015,
        avgQueueSec: 8,
        activeQueues: 410,
        activeLobbies: 32,
        tickrate: '128-Tick Sub-Tick Pro'
    },
    { 
        id: 'gtav', 
        name: 'GTA V / FiveM RP', 
        category: 'Roleplay & Sandbox',
        icon: '🚗', 
        banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
        protocol: 'fivem://connect/cfx.re/join/customlobbies-na1',
        defaultPort: 30120,
        avgQueueSec: 18,
        activeQueues: 210,
        activeLobbies: 18,
        tickrate: '64-Tick TokoVOIP'
    },
    { 
        id: 'marvel_rivals', 
        name: 'Marvel Rivals', 
        category: 'Hero Shooter',
        icon: '🦸', 
        banner: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
        protocol: 'steam://run/2767030',
        defaultPort: 9000,
        avgQueueSec: 6,
        activeQueues: 520,
        activeLobbies: 45,
        tickrate: '60-Tick Dedicated'
    },
    { 
        id: 'fortnite', 
        name: 'Fortnite', 
        category: 'Battle Royale',
        icon: '🪂', 
        banner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&auto=format&fit=crop&q=80',
        protocol: 'com.epicgames.launcher://apps/Fortnite?action=launch',
        defaultPort: 7777,
        avgQueueSec: 10,
        activeQueues: 290,
        activeLobbies: 19,
        tickrate: '30-Tick Netcode'
    },
    { 
        id: 'apex', 
        name: 'Apex Legends', 
        category: 'Battle Royale',
        icon: '⚡', 
        banner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
        protocol: 'origin://launchgame/Origin.OFR.50.0002694',
        defaultPort: 8080,
        avgQueueSec: 14,
        activeQueues: 180,
        activeLobbies: 14,
        tickrate: '60-Tick Respawn Node'
    },
    { 
        id: 'league', 
        name: 'League of Legends', 
        category: 'MOBA',
        icon: '⚔️', 
        banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        protocol: 'riotclient://league-of-legends/custom/join',
        defaultPort: 5119,
        avgQueueSec: 15,
        activeQueues: 260,
        activeLobbies: 16,
        tickrate: '30-Tick Riot Core'
    },
    { 
        id: 'rocketleague', 
        name: 'Rocket League', 
        category: 'Sports & Sim',
        icon: '⚽', 
        banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        protocol: 'com.epicgames.launcher://apps/RocketLeague?action=launch',
        defaultPort: 7778,
        avgQueueSec: 7,
        activeQueues: 190,
        activeLobbies: 12,
        tickrate: '120-Tick Physics'
    },
    { 
        id: 'overwatch', 
        name: 'Overwatch 2', 
        category: 'Hero Shooter',
        icon: '🛡️', 
        banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        protocol: 'battlenet://Pro',
        defaultPort: 1119,
        avgQueueSec: 11,
        activeQueues: 145,
        activeLobbies: 10,
        tickrate: '64-Tick Blizzard Net'
    },
    { 
        id: 'r6siege', 
        name: 'Rainbow Six Siege', 
        category: 'Tactical FPS',
        icon: '🧱', 
        banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
        protocol: 'uplay://launch/3599/0',
        defaultPort: 3074,
        avgQueueSec: 16,
        activeQueues: 110,
        activeLobbies: 8,
        tickrate: '60-Tick Ubisoft'
    },
    { 
        id: 'cod_warzone', 
        name: 'Call of Duty: Warzone', 
        category: 'Battle Royale',
        icon: '🪖', 
        banner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
        protocol: 'battlenet://VIPR',
        defaultPort: 3074,
        avgQueueSec: 10,
        activeQueues: 320,
        activeLobbies: 22,
        tickrate: '60-Tick Demonware'
    },
    { 
        id: 'rust', 
        name: 'Rust', 
        category: 'Survival & Sandbox',
        icon: '🏕️', 
        banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
        protocol: 'steam://connect/168.119.54.12:28015',
        defaultPort: 28015,
        avgQueueSec: 20,
        activeQueues: 95,
        activeLobbies: 11,
        tickrate: '30-Tick Facepunch'
    },
    { 
        id: 'dota2', 
        name: 'Dota 2', 
        category: 'MOBA',
        icon: '🐉', 
        banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        protocol: 'steam://run/570',
        defaultPort: 27015,
        avgQueueSec: 14,
        activeQueues: 210,
        activeLobbies: 15,
        tickrate: '40-Tick Source 2'
    },
    { 
        id: 'smashbros', 
        name: 'Super Smash Bros', 
        category: 'Fighting',
        icon: '🥊', 
        banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
        protocol: 'customlobbies://arena/smash/na-east-1',
        defaultPort: 8888,
        avgQueueSec: 9,
        activeQueues: 130,
        activeLobbies: 14,
        tickrate: '60-Tick Rollback P2P'
    },
    { 
        id: 'sf6', 
        name: 'Street Fighter 6', 
        category: 'Fighting',
        icon: '🔥', 
        banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        protocol: 'steam://run/1364780',
        defaultPort: 7000,
        avgQueueSec: 6,
        activeQueues: 140,
        activeLobbies: 12,
        tickrate: '60-Tick Capcom Rollback'
    },
    { 
        id: 'helldivers2', 
        name: 'Helldivers 2', 
        category: 'Co-op Shooter',
        icon: '🚀', 
        banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        protocol: 'steam://run/553850',
        defaultPort: 9999,
        avgQueueSec: 8,
        activeQueues: 310,
        activeLobbies: 28,
        tickrate: '60-Tick Arrowhead Network'
    },
    { 
        id: 'tf2', 
        name: 'Team Fortress 2', 
        category: 'Hero Shooter',
        icon: '🎩', 
        banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
        protocol: 'steam://connect/45.136.205.10:27015',
        defaultPort: 27015,
        avgQueueSec: 12,
        activeQueues: 160,
        activeLobbies: 16,
        tickrate: '66-Tick Source Engine'
    },
    { 
        id: 'minecraft', 
        name: 'Minecraft (PvP / Custom)', 
        category: 'Sandbox & PvP',
        icon: '⛏️', 
        banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
        protocol: 'minecraft://play.customlobbies.net:25565',
        defaultPort: 25565,
        avgQueueSec: 5,
        activeQueues: 380,
        activeLobbies: 35,
        tickrate: '20-TPS PaperSpigot'
    },
    { 
        id: 'custom', 
        name: 'Custom / Indie Games', 
        category: 'Indie & Party',
        icon: '🕹️', 
        banner: 'https://images.unsplash.com/photo-1612287233215-6e062637a89e?w=600&auto=format&fit=crop&q=80',
        protocol: 'customlobbies://direct-connect',
        defaultPort: 8000,
        avgQueueSec: 15,
        activeQueues: 80,
        activeLobbies: 8,
        tickrate: 'Dynamic Node Cluster'
    }
];

// Live Database Cluster & Server Telemetry
const DATABASE_CLUSTER = {
    status: 'ONLINE_HEALTHY',
    activeConnections: 18492,
    nodes: [
        {
            id: 'db_node_1',
            name: 'PostgreSQL Primary Cluster (Match Telemetry)',
            location: 'US-East (Virginia)',
            ip: '10.0.4.12',
            port: 5432,
            ping: 14,
            uptime: '99.99%',
            queriesPerSec: 3420,
            status: 'HEALTHY'
        },
        {
            id: 'db_node_2',
            name: 'Redis In-Memory Auto-Queue Matchmaker',
            location: 'US-East (Virginia)',
            ip: '10.0.4.18',
            port: 6379,
            ping: 4,
            uptime: '100%',
            queriesPerSec: 18900,
            status: 'HEALTHY'
        },
        {
            id: 'db_node_3',
            name: 'PostgreSQL EU Replica (Frankfurt)',
            location: 'EU-Central (Germany)',
            ip: '10.0.12.8',
            port: 5432,
            ping: 78,
            uptime: '99.98%',
            queriesPerSec: 2150,
            status: 'HEALTHY'
        },
        {
            id: 'db_node_4',
            name: 'MongoDB Global Profile & 5s Video Blob Store',
            location: 'Global Multi-Region AWS S3 + Mongo',
            ip: '10.0.8.50',
            port: 27017,
            ping: 22,
            uptime: '99.99%',
            queriesPerSec: 5800,
            status: 'HEALTHY'
        }
    ],
    recentQueries: [
        'SELECT * FROM matchmaking_queues WHERE game_id = "valorant" AND status = "SEARCHING" FOR UPDATE;',
        'INSERT INTO match_sessions (lobby_id, server_node, tickrate, created_at) VALUES ("lob_992", "us-east-1a", 128, NOW());',
        'UPDATE player_ratings SET mmr = mmr + 24 WHERE player_id = "user_me";',
        'REDIS: ZADD queue_priority:cs2 2180 "user_me";'
    ]
};

const INITIAL_LOBBIES = [
    {
        id: 'lobby_debate_prime',
        title: '🏛️ Federal Healthcare & Social Security Policy Clash (128-Tick Scrim)',
        game: 'custom',
        gameName: 'Policy Townhall & Debate',
        host: { id: 'user_gov', username: 'SenatorClash', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
        mode: '128-Tick Voice Townhall',
        region: 'Global Node Cluster',
        serverIp: '185.190.140.22:27015',
        connectLink: 'steam://connect/185.190.140.22:27015',
        consoleCommand: 'connect 185.190.140.22:27015; debate_mode 1',
        tier: 'All Welcome / High Trust',
        ping: 14,
        maxSlots: 16,
        currentPlayers: [
            { id: 'user_gov', username: 'SenatorClash', team: 'Single-Payer (Blue)', ready: true, role: 'Host', ping: 14, mmr: 2500 },
            { id: 'user_econ', username: 'MarketHawk', team: 'Free Market (Red)', ready: true, role: 'Member', ping: 18, mmr: 2480 },
            { id: 'user_actuary', username: 'TrustFundMath', team: 'Single-Payer (Blue)', ready: true, role: 'Member', ping: 22, mmr: 2310 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Built-in 128-Tick WebRTC VoIP',
        rules: 'Civil debate, 3-minute timed arguments, no ad hominem, evidence-based policy.',
        createdAt: '2m ago',
        tags: ['Debate', 'Gov-Finance', 'Insurance', 'Voice-VoIP']
    },
    {
        id: 'lobby_1',
        title: '🔥 High Elo 5v5 Scrims - Ascent / Bind Only',
        game: 'valorant',
        gameName: 'Valorant',
        host: { id: 'user_2', username: 'ViperMain_00', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
        mode: 'Competitive / Scrim',
        region: 'NA East (Virginia)',
        serverIp: '104.28.19.42:7777',
        connectLink: 'riotgames://valorant/party/join/CL-VAL-8821',
        consoleCommand: 'connect 104.28.19.42:7777; password scrims',
        tier: 'Immortal+',
        ping: 18,
        maxSlots: 10,
        currentPlayers: [
            { id: 'user_2', username: 'ViperMain_00', team: 'Alpha', ready: true, role: 'Host', ping: 16, mmr: 2450 },
            { id: 'user_4', username: 'JettDashX', team: 'Alpha', ready: true, role: 'Member', ping: 22, mmr: 2510 },
            { id: 'user_6', username: 'OmenSmokes', team: 'Alpha', ready: false, role: 'Member', ping: 28, mmr: 2390 },
            { id: 'user_7', username: 'SovaDarts', team: 'Omega', ready: true, role: 'Member', ping: 19, mmr: 2420 },
            { id: 'user_8', username: 'ReynaGod', team: 'Omega', ready: true, role: 'Member', ping: 31, mmr: 2600 },
            { id: 'user_9', username: 'KilljoyTurret', team: 'Omega', ready: false, role: 'Member', ping: 24, mmr: 2380 },
            { id: 'user_10', username: 'SageHeals', team: 'Omega', ready: true, role: 'Member', ping: 18, mmr: 2410 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Discord #scrim-room-4',
        rules: 'No toxicity. Microphone required. 128 tick server ready.',
        createdAt: '5m ago',
        tags: ['Scrims', '128Tick', 'MicReq', '5sVote']
    },
    {
        id: 'lobby_2',
        title: '💣 CS2 Premier 20k+ Grind [Need Entry Fragger & IGL]',
        game: 'cs2',
        gameName: 'Counter-Strike 2',
        host: { id: 'user_3', username: 'AWP_Sn1per', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
        mode: 'Premier Ranked',
        region: 'EU Central (Frankfurt)',
        serverIp: '144.76.12.89:27015',
        connectLink: 'steam://connect/144.76.12.89:27015',
        consoleCommand: 'connect 144.76.12.89:27015; password customlobbies',
        tier: '20,000+ Rating',
        ping: 24,
        maxSlots: 5,
        currentPlayers: [
            { id: 'user_3', username: 'AWP_Sn1per', team: 'Alpha', ready: true, role: 'Host', ping: 20, mmr: 2120 },
            { id: 'user_11', username: 'B-RushMaster', team: 'Alpha', ready: true, role: 'Member', ping: 24, mmr: 2090 },
            { id: 'user_12', username: 'FlashbangArt', team: 'Alpha', ready: true, role: 'Member', ping: 28, mmr: 2180 },
            { id: 'user_13', username: 'ClutchMinister', team: 'Alpha', ready: true, role: 'Member', ping: 19, mmr: 2240 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'In-Game VoIP',
        rules: 'English callouts only. Know standard smokes for Mirage and Inferno.',
        createdAt: '12m ago',
        tags: ['Premier', 'EU', 'VoiceOn', 'DirectSteam']
    },
    {
        id: 'lobby_3',
        title: '🚓 NoPixel Style Serious Police & Heist RP',
        game: 'gtav',
        gameName: 'GTA V / FiveM RP',
        host: { id: 'user_5', username: 'Chief_Miller', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80' },
        mode: 'Custom Roleplay',
        region: 'US West (Los Angeles)',
        serverIp: '198.51.100.24:30120',
        connectLink: 'fivem://connect/cfx.re/join/customlobbies-la1',
        consoleCommand: 'fivem://connect/198.51.100.24:30120',
        tier: 'Serious RP',
        ping: 32,
        maxSlots: 16,
        currentPlayers: [
            { id: 'user_5', username: 'Chief_Miller', team: 'Alpha', ready: true, role: 'Host', ping: 30, mmr: 1900 },
            { id: 'user_14', username: 'Officer_Dan', team: 'Alpha', ready: true, role: 'Member', ping: 34, mmr: 1850 },
            { id: 'user_15', username: 'BankRobber_X', team: 'Omega', ready: true, role: 'Member', ping: 28, mmr: 2010 },
            { id: 'user_16', username: 'Getaway_Sam', team: 'Omega', ready: true, role: 'Member', ping: 31, mmr: 1950 },
            { id: 'user_17', username: 'EMS_Sarah', team: 'Spectator', ready: true, role: 'Member', ping: 26, mmr: 1800 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'TeamSpeak TokoVOIP',
        rules: '5-second intro audition mandatory to verify microphone & character voice.',
        createdAt: '18m ago',
        tags: ['Roleplay', 'VoiceReq', 'Audition', 'FiveMLink']
    },
    {
        id: 'lobby_marvel',
        title: '⚡ Marvel Rivals 6v6 High Elo Tournament Customs',
        game: 'marvel_rivals',
        gameName: 'Marvel Rivals',
        host: { id: 'user_28', username: 'IronMan_Main', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
        mode: 'Competitive 6v6',
        region: 'NA East (Virginia)',
        serverIp: '209.182.23.10:9000',
        connectLink: 'steam://run/2767030',
        consoleCommand: 'connect 209.182.23.10:9000; lobby MR-881',
        tier: 'Grandmaster / Top 500',
        ping: 15,
        maxSlots: 12,
        currentPlayers: [
            { id: 'user_28', username: 'IronMan_Main', team: 'Alpha', ready: true, role: 'Host', ping: 14, mmr: 2750 },
            { id: 'user_29', username: 'VenomSurge', team: 'Alpha', ready: true, role: 'Member', ping: 18, mmr: 2680 },
            { id: 'user_30', username: 'SpiderCombo', team: 'Alpha', ready: true, role: 'Member', ping: 21, mmr: 2710 },
            { id: 'user_31', username: 'ScarletHex', team: 'Omega', ready: true, role: 'Member', ping: 16, mmr: 2790 },
            { id: 'user_32', username: 'HulkSmash_00', team: 'Omega', ready: true, role: 'Member', ping: 25, mmr: 2650 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Discord Tournament Alpha',
        rules: 'No double vanguard comps. Fast ult coordination required.',
        createdAt: '4m ago',
        tags: ['MarvelRivals', '6v6', 'HighElo', 'DirectLink']
    },
    {
        id: 'lobby_tf2',
        title: '🎩 TF2 6s UGC / RGL Invite Scrims [Badlands / Granary]',
        game: 'tf2',
        gameName: 'Team Fortress 2',
        host: { id: 'user_33', username: 'RocketJumperPro', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
        mode: '6v6 Standard',
        region: 'NA Central (Dallas)',
        serverIp: '45.136.205.10:27015',
        connectLink: 'steam://connect/45.136.205.10:27015',
        consoleCommand: 'connect 45.136.205.10:27015; password comp',
        tier: 'Invite Tier',
        ping: 22,
        maxSlots: 12,
        currentPlayers: [
            { id: 'user_33', username: 'RocketJumperPro', team: 'Alpha', ready: true, role: 'Host', ping: 20, mmr: 2350 },
            { id: 'user_34', username: 'MedicCrossbow', team: 'Alpha', ready: true, role: 'Member', ping: 18, mmr: 2400 },
            { id: 'user_35', username: 'DemoPipes', team: 'Omega', ready: true, role: 'Member', ping: 24, mmr: 2380 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Mumble Server tf2.customlobbies.net:64738',
        rules: 'Class limits: 2 Scout, 2 Soldier, 1 Demo, 1 Medic.',
        createdAt: '8m ago',
        tags: ['TF2', '6v6', 'DirectSteam', 'LowPing']
    },
    {
        id: 'lobby_mc',
        title: '⛏️ Minecraft 1.8.9 Ranked Bedwars & Nodebuff Duels',
        game: 'minecraft',
        gameName: 'Minecraft (PvP / Custom)',
        host: { id: 'user_36', username: 'W-TapGod', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
        mode: 'Bedwars 4v4v4v4',
        region: 'NA East (New York)',
        serverIp: 'play.customlobbies.net:25565',
        connectLink: 'minecraft://play.customlobbies.net:25565',
        consoleCommand: '/server bedwars-custom-01',
        tier: 'Master Division',
        ping: 11,
        maxSlots: 16,
        currentPlayers: [
            { id: 'user_36', username: 'W-TapGod', team: 'Alpha', ready: true, role: 'Host', ping: 9, mmr: 2200 },
            { id: 'user_37', username: 'SpeedBridge_X', team: 'Alpha', ready: true, role: 'Member', ping: 14, mmr: 2150 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Discord Voice Node 1',
        rules: 'Zero auto-clicker tolerance. Fast bridging required.',
        createdAt: '15m ago',
        tags: ['Minecraft', 'Bedwars', 'FastBridge', 'DirectServer']
    },
    {
        id: 'lobby_fortnite',
        title: '🪂 FNCS Chapter 5 Zone Wars & Box Fights [NA East]',
        game: 'fortnite',
        gameName: 'Fortnite',
        host: { id: 'user_40', username: 'CrankBuilder_01', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80' },
        mode: 'Zone Wars 16-Player',
        region: 'NA East (Virginia)',
        serverIp: 'custom.epicgames.net:7777',
        connectLink: 'com.epicgames.launcher://apps/Fortnite?action=launch',
        consoleCommand: 'island_code: 8492-1029-4481',
        tier: 'Champion Division',
        ping: 15,
        maxSlots: 16,
        currentPlayers: [
            { id: 'user_40', username: 'CrankBuilder_01', team: 'Alpha', ready: true, role: 'Host', ping: 12, mmr: 2320 },
            { id: 'user_41', username: 'PieceControlGod', team: 'Alpha', ready: true, role: 'Member', ping: 16, mmr: 2450 },
            { id: 'user_42', username: 'TripleEdits', team: 'Omega', ready: true, role: 'Member', ping: 18, mmr: 2280 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Fortnite Party Chat',
        rules: 'No teaming in solo zone wars. Fast resets allowed.',
        createdAt: '3m ago',
        tags: ['Fortnite', 'FNCS', 'ZoneWars', '16Slots']
    },
    {
        id: 'lobby_apex',
        title: '⚡ Apex Legends 3v3 Predator Customs & Scrims',
        game: 'apex',
        gameName: 'Apex Legends',
        host: { id: 'user_43', username: 'Wraith_TTV', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
        mode: '3v3 Custom Tournament',
        region: 'NA Central (Dallas)',
        serverIp: 'apex.ea.com:8080',
        connectLink: 'origin://launchgame/Origin.OFR.50.0002694',
        consoleCommand: 'tournament_code: APEX-SCRIM-99',
        tier: 'Apex Predator',
        ping: 20,
        maxSlots: 6,
        currentPlayers: [
            { id: 'user_43', username: 'Wraith_TTV', team: 'Alpha', ready: true, role: 'Host', ping: 18, mmr: 2600 },
            { id: 'user_44', username: 'PathfinderGrapple', team: 'Alpha', ready: true, role: 'Member', ping: 22, mmr: 2540 },
            { id: 'user_45', username: 'HorizonLift', team: 'Omega', ready: true, role: 'Member', ping: 19, mmr: 2490 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Apex Discord #pred-hub',
        rules: 'Apex Predator or Master MMR badge required. No heat shield exploits.',
        createdAt: '7m ago',
        tags: ['Apex', 'Predator', '3v3', 'Scrims']
    },
    {
        id: 'lobby_league',
        title: '⚔️ League of Legends 5v5 Challenger Tournament Draft',
        game: 'league',
        gameName: 'League of Legends',
        host: { id: 'user_46', username: 'MidOrFeed_KR', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
        mode: 'Tournament Draft 5v5',
        region: 'NA East (Chicago)',
        serverIp: 'riotclient://league-of-legends/custom/join/CL-LOL-902',
        connectLink: 'riotclient://league-of-legends/custom/join/CL-LOL-902',
        consoleCommand: 'custom_room: CL-LOL-902; pass: scrims',
        tier: 'Grandmaster / Challenger',
        ping: 16,
        maxSlots: 10,
        currentPlayers: [
            { id: 'user_46', username: 'MidOrFeed_KR', team: 'Alpha', ready: true, role: 'Host', ping: 14, mmr: 2650 },
            { id: 'user_47', username: 'JungleDiff', team: 'Alpha', ready: true, role: 'Member', ping: 17, mmr: 2580 },
            { id: 'user_48', username: 'TopGankInvade', team: 'Alpha', ready: true, role: 'Member', ping: 15, mmr: 2520 },
            { id: 'user_49', username: 'AdcHyperCarry', team: 'Omega', ready: true, role: 'Member', ping: 16, mmr: 2610 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Discord #lol-inhouse-1',
        rules: 'Full tournament draft format with 5 bans per team.',
        createdAt: '9m ago',
        tags: ['LeagueOfLegends', '5v5', 'TournamentDraft', 'Challenger']
    },
    {
        id: 'lobby_rocketleague',
        title: '⚽ Rocket League 3v3 Supersonic Legend Scrimmage',
        game: 'rocketleague',
        gameName: 'Rocket League',
        host: { id: 'user_50', username: 'FlipResetGod', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80' },
        mode: '3v3 Standard Scrim',
        region: 'US East',
        serverIp: 'rl.epicgames.com:7778',
        connectLink: 'com.epicgames.launcher://apps/RocketLeague?action=launch',
        consoleCommand: 'name: CL-RL-33; pass: sslscrim',
        tier: 'SSL (1900+ MMR)',
        ping: 18,
        maxSlots: 6,
        currentPlayers: [
            { id: 'user_50', username: 'FlipResetGod', team: 'Alpha', ready: true, role: 'Host', ping: 16, mmr: 2450 },
            { id: 'user_51', username: 'SpeedyAerial', team: 'Alpha', ready: true, role: 'Member', ping: 19, mmr: 2380 },
            { id: 'user_52', username: 'GoaliePinch', team: 'Omega', ready: true, role: 'Member', ping: 21, mmr: 2410 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Discord #rl-comms-1',
        rules: 'DFH Stadium (Day). 5-minute competitive overtime.',
        createdAt: '6m ago',
        tags: ['RocketLeague', '3v3', 'SSL', 'DirectMatch']
    },
    {
        id: 'lobby_overwatch',
        title: '🛡️ Overwatch 2 5v5 Top 500 Role Lock Scrims',
        game: 'overwatch',
        gameName: 'Overwatch 2',
        host: { id: 'user_53', username: 'AnaSleepDart', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
        mode: '5v5 Competitive Role Lock',
        region: 'NA Central (Chicago)',
        serverIp: 'battlenet://ow2/custom/CL-OW-104',
        connectLink: 'battlenet://Pro',
        consoleCommand: 'custom_game_code: OW-PRO-77',
        tier: 'Grandmaster / Top 500',
        ping: 14,
        maxSlots: 10,
        currentPlayers: [
            { id: 'user_53', username: 'AnaSleepDart', team: 'Alpha', ready: true, role: 'Host', ping: 12, mmr: 2540 },
            { id: 'user_54', username: 'ReinHammer', team: 'Alpha', ready: true, role: 'Member', ping: 15, mmr: 2480 },
            { id: 'user_55', username: 'TracerBlink', team: 'Omega', ready: true, role: 'Member', ping: 14, mmr: 2590 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Team 1 Discord Voice',
        rules: '1 Tank, 2 Damage, 2 Support standard competitive ruleset.',
        createdAt: '11m ago',
        tags: ['Overwatch2', '5v5', 'RoleLock', 'Top500']
    },
    {
        id: 'lobby_r6siege',
        title: '🧱 Rainbow Six Siege 5v5 High Champ Tactical Scrims',
        game: 'r6siege',
        gameName: 'Rainbow Six Siege',
        host: { id: 'user_56', username: 'SmokeAnchorPro', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80' },
        mode: '5v5 Bomb Tactical',
        region: 'US East (Virginia)',
        serverIp: 'uplay://launch/3599/0/CL-R6-55',
        connectLink: 'uplay://launch/3599/0',
        consoleCommand: 'custom_match_id: R6-TAC-99',
        tier: 'Champion Rank',
        ping: 19,
        maxSlots: 10,
        currentPlayers: [
            { id: 'user_56', username: 'SmokeAnchorPro', team: 'Alpha', ready: true, role: 'Host', ping: 17, mmr: 2490 },
            { id: 'user_57', username: 'AshMain_Entry', team: 'Alpha', ready: true, role: 'Member', ping: 21, mmr: 2420 },
            { id: 'user_58', username: 'ValkCamSpot', team: 'Omega', ready: true, role: 'Member', ping: 18, mmr: 2510 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'R6 Discord Voice',
        rules: 'Pro League Map Pool. 7 rounds to win, overtime with 2-round lead.',
        createdAt: '14m ago',
        tags: ['R6Siege', '5v5', 'Bomb', 'Champion']
    },
    {
        id: 'lobby_warzone',
        title: '🪖 Call of Duty: Warzone Custom Rebirth Island Scrims',
        game: 'cod_warzone',
        gameName: 'Call of Duty: Warzone',
        host: { id: 'user_59', username: 'SlideCancelKing', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
        mode: 'Quads Rebirth Scrim',
        region: 'NA East (Atlanta)',
        serverIp: 'battlenet://VIPR/custom/CL-WZ-88',
        connectLink: 'battlenet://VIPR',
        consoleCommand: 'lobby_code: WZ-REBIRTH-44',
        tier: '2.5+ KD Verified',
        ping: 21,
        maxSlots: 20,
        currentPlayers: [
            { id: 'user_59', username: 'SlideCancelKing', team: 'Alpha', ready: true, role: 'Host', ping: 19, mmr: 2380 },
            { id: 'user_60', username: 'SniperKar98', team: 'Alpha', ready: true, role: 'Member', ping: 22, mmr: 2410 }
        ],
        entryType: 'publicity_vote',
        hasVoice: true,
        voiceChannel: 'Warzone Discord Squad 1',
        rules: 'Strict anti-cheat verification. 5-second intro vote enabled.',
        createdAt: '5m ago',
        tags: ['Warzone', 'Rebirth', 'Quads', '5sVote']
    },
    {
        id: 'lobby_rust',
        title: '🏕️ Rust 5v5 Clan Monument Scrim & Raid Arena',
        game: 'rust',
        gameName: 'Rust',
        host: { id: 'user_61', username: 'AK_SprayMaster', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
        mode: '5v5 Clan Scrim',
        region: 'US Central (Chicago)',
        serverIp: '168.119.54.12:28015',
        connectLink: 'steam://connect/168.119.54.12:28015',
        consoleCommand: 'connect 168.119.54.12:28015; password clanscrim',
        tier: 'Competitive Clan',
        ping: 23,
        maxSlots: 10,
        currentPlayers: [
            { id: 'user_61', username: 'AK_SprayMaster', team: 'Alpha', ready: true, role: 'Host', ping: 20, mmr: 2350 },
            { id: 'user_62', username: 'RocketRaid_X', team: 'Alpha', ready: true, role: 'Member', ping: 24, mmr: 2290 },
            { id: 'user_63', username: 'BoltSniperTower', team: 'Omega', ready: true, role: 'Member', ping: 22, mmr: 2310 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'TeamSpeak Rust Node',
        rules: 'AK recoil training verified. Monument control objectives.',
        createdAt: '16m ago',
        tags: ['Rust', '5v5', 'ClanScrim', 'DirectSteam']
    },
    {
        id: 'lobby_dota2',
        title: '🐉 Dota 2 5v5 High Immortal Captains Mode Scrims',
        game: 'dota2',
        gameName: 'Dota 2',
        host: { id: 'user_64', username: 'Invoker_God', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80' },
        mode: '5v5 Captains Mode',
        region: 'US East (Luxembourg / US)',
        serverIp: 'steam://run/570',
        connectLink: 'steam://run/570',
        consoleCommand: 'dota_lobby_join 194829104; pass: dota2immortal',
        tier: 'Immortal (7,000+ MMR)',
        ping: 17,
        maxSlots: 10,
        currentPlayers: [
            { id: 'user_64', username: 'Invoker_God', team: 'Alpha', ready: true, role: 'Host', ping: 15, mmr: 2780 },
            { id: 'user_65', username: 'PudgeHookPro', team: 'Alpha', ready: true, role: 'Member', ping: 18, mmr: 2690 },
            { id: 'user_66', username: 'CarryJuggernaut', team: 'Omega', ready: true, role: 'Member', ping: 16, mmr: 2740 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Discord #dota-inhouse',
        rules: 'Captains Mode standard tournament rules with coin toss first pick.',
        createdAt: '8m ago',
        tags: ['Dota2', '5v5', 'CaptainsMode', 'Immortal']
    },
    {
        id: 'lobby_custom',
        title: '🕹️ Community Custom Arcade & Modded Minigames',
        game: 'custom',
        gameName: 'Custom / Indie Games',
        host: { id: 'user_67', username: 'ArcadeAdmin', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
        mode: 'Party & Arcade',
        region: 'Global Distributed',
        serverIp: 'customlobbies.net:8000',
        connectLink: 'customlobbies://direct-connect',
        consoleCommand: 'connect party.customlobbies.net:8000',
        tier: 'All Welcome',
        ping: 10,
        maxSlots: 16,
        currentPlayers: [
            { id: 'user_67', username: 'ArcadeAdmin', team: 'Alpha', ready: true, role: 'Host', ping: 10, mmr: 2000 },
            { id: 'user_68', username: 'PartyPlayer_1', team: 'Alpha', ready: true, role: 'Member', ping: 15, mmr: 2050 }
        ],
        entryType: 'open',
        hasVoice: true,
        voiceChannel: 'Open Party Voice',
        rules: 'Friendly casual custom games. Automatic rotation.',
        createdAt: '2m ago',
        tags: ['Indie', 'Arcade', 'Community', 'AllAges']
    }
];

const INITIAL_STREAMS = [
    {
        id: 'stream_1',
        title: '🔴 ROAD TO RADIANT - CLUTCH HIGHLIGHTS & SQUAD CUSTOMS',
        streamer: {
            id: 'user_4',
            username: 'JettDashX',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            followers: '42.8K'
        },
        game: 'Valorant',
        viewers: 1420,
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80',
        isLive: true,
        tags: ['Radiant', 'DropsEnabled', 'Scrims'],
        uptime: '2h 14m'
    },
    {
        id: 'stream_2',
        title: '🏆 $10,000 COMMUNITY CS2 SHOWDOWN [LIVE CASTING]',
        streamer: {
            id: 'user_26',
            username: 'StreamCaster_1',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            followers: '115K'
        },
        game: 'Counter-Strike 2',
        viewers: 3890,
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700&auto=format&fit=crop&q=80',
        isLive: true,
        tags: ['Tournament', 'English', 'Esports'],
        uptime: '4h 05m'
    },
    {
        id: 'stream_3',
        title: '🚨 HIGH SPEED CHASE & VAULT HEIST - LOS SANTOS RP',
        streamer: {
            id: 'user_15',
            username: 'BankRobber_X',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
            followers: '19.4K'
        },
        game: 'GTA V / FiveM RP',
        viewers: 854,
        thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=700&auto=format&fit=crop&q=80',
        isLive: true,
        tags: ['FiveM', 'CriminalRP', 'Getaway'],
        uptime: '1h 48m'
    },
    {
        id: 'stream_4',
        title: '🦸 MARVEL RIVALS PRO 6v6 SCRIM HIGHLIGHTS',
        streamer: {
            id: 'user_31',
            username: 'ScarletHex',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
            followers: '28.2K'
        },
        game: 'Marvel Rivals',
        viewers: 1120,
        thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=80',
        isLive: true,
        tags: ['MarvelRivals', 'Top500', 'LiveTourney'],
        uptime: '1h 12m'
    }
];

const INITIAL_SQUADS = [
    {
        id: 'squad_1',
        name: 'CYBER VORTEX',
        tag: '[VRTX]',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        description: 'Elite competitive scrim squad. High win rate & non-stop energy.',
        leader: { id: 'user_me', username: 'GhostRider_99' },
        members: [
            { id: 'user_me', username: 'GhostRider_99', role: 'Captain', rank: 'Diamond III' },
            { id: 'user_2', username: 'ViperMain_00', role: 'Co-Leader', rank: 'Immortal I' },
            { id: 'user_3', username: 'AWP_Sn1per', role: 'Sniper', rank: '21k CS2' },
            { id: 'user_5', username: 'Chief_Miller', role: 'Strategist', rank: 'Veteran' }
        ],
        publicityVoteRequired: true,
        minApprovalPercent: 66,
        activeVotes: [],
        primaryGame: 'Valorant / CS2',
        level: 14,
        memberCount: 4,
        maxMembers: 8
    },
    {
        id: 'squad_2',
        name: 'SHADOW SYNDICATE',
        tag: '[SYND]',
        avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        description: 'Late night grinders, tournament warriors & content creators.',
        leader: { id: 'user_4', username: 'JettDashX' },
        members: [
            { id: 'user_4', username: 'JettDashX', role: 'Leader', rank: 'Radiant' },
            { id: 'user_7', username: 'SovaDarts', role: 'Member', rank: 'Ascendant II' },
            { id: 'user_8', username: 'ReynaGod', role: 'Member', rank: 'Immortal II' }
        ],
        publicityVoteRequired: true,
        minApprovalPercent: 75,
        activeVotes: [],
        primaryGame: 'Multi-FPS',
        level: 22,
        memberCount: 3,
        maxMembers: 6
    }
];

const INITIAL_FRIENDS = [
    {
        id: 'user_2',
        username: 'ViperMain_00',
        tag: '#1337',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        status: 'online',
        gameActivity: 'Valorant - In Lobby (7/10)',
        lastSeen: 'Now',
        unreadMessages: 1
    },
    {
        id: 'user_3',
        username: 'AWP_Sn1per',
        tag: '#8821',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        status: 'in-game',
        gameActivity: 'CS2 - Premier (Score: 11-9)',
        lastSeen: '12m ago',
        unreadMessages: 0
    },
    {
        id: 'user_5',
        username: 'Chief_Miller',
        tag: '#9901',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80',
        status: 'away',
        gameActivity: 'GTA V RP - In Discord',
        lastSeen: '24m ago',
        unreadMessages: 0
    },
    {
        id: 'user_4',
        username: 'JettDashX',
        tag: '#7777',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        status: 'streaming',
        gameActivity: 'Streaming on CustomLobbies (1.4k viewers)',
        lastSeen: 'Live Now',
        unreadMessages: 2
    }
];

const INITIAL_MESSAGES = {
    'user_2': [
        { id: 'm1', senderId: 'user_2', text: 'Yo Ghost! We need 1 more for the 5v5 custom Ascent match!', timestamp: '2:10 PM' },
        { id: 'm2', senderId: 'user_me', text: 'I am hopping on right now! Is the lobby publicity-vote locked?', timestamp: '2:11 PM' },
        { id: 'm3', senderId: 'user_2', text: 'Yeah, got that 5-second intro gate on so we keep the vibes clean! Drop in!', timestamp: '2:12 PM' }
    ],
    'user_4': [
        { id: 'm4', senderId: 'user_4', text: 'Hey bro, thanks for hosting the squad lobby on stream earlier!', timestamp: '1:45 PM' },
        { id: 'm5', senderId: 'user_4', text: 'Clip of that 5-second intro vote was hilarious 😂', timestamp: '1:46 PM' }
    ]
};

const SAMPLE_APPLICANTS = [
    {
        id: 'applicant_1',
        username: 'NeonFlash_Speed',
        tag: '#3030',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
        rank: 'Immortal II',
        favoriteGame: 'Valorant',
        pitchType: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        pitchText: '"3.2 K/D duelist, callouts on point, zero tilt, and I can flash site on command. Let me in!"',
        appliedSquad: 'CYBER VORTEX',
        votesFor: 3,
        votesAgainst: 1,
        totalRequired: 4
    }
];
