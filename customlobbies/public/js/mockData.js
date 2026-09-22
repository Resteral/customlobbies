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

const INITIAL_LOBBIES = [];
const INITIAL_STREAMS = [];
const INITIAL_GROUPS = [];
const INITIAL_FRIENDS = [];
