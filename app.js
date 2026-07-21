// ==========================================
// CUSTOM LOBBIES MATCHMAKER PORTAL
// ==========================================

const GAMES = ['arkheron', 'cs', 'zealot'];

// Web Audio API Sound Synthesizer for Lobby Notifications
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  try {
    initAudio();
    if (!audioCtx) return;
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    switch(type) {
      case 'join': {
        // Player joins queue: short gentle blip
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'match_found': {
        // Match found / Draft starts: sonar chime (double pulse)
        const playPing = (time, freq) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.4, time + 0.3);
          
          gain.gain.setValueAtTime(0.1, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
          
          osc.start(time);
          osc.stop(time + 0.4);
        };
        playPing(now, 523.25); // C5
        playPing(now + 0.18, 659.25); // E5
        break;
      }
      case 'your_turn': {
        // Your turn to pick: clean double alert chime
        const playTone = (time, freq, duration) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          
          gain.gain.setValueAtTime(0.08, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
          
          osc.start(time);
          osc.stop(time + duration);
        };
        playTone(now, 587.33, 0.22); // D5
        playTone(now + 0.14, 880, 0.45); // A5
        break;
      }
      case 'pick': {
        // Draft pick locked in: mechanical tick/thud
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'message': {
        // Discord message sound: gentle pop
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
    }
  } catch (e) {
    console.warn("AudioContext failed to play:", e);
  }
}

// Playable Eternals Database (for Arkheron)
const ETERNALS = [
  { id: 'leodin', name: 'Leodin', emoji: '🧝', role: 'Fighter', set: 'Tempest', lore: 'A swift, wind-bending swordsman who utilizes gale forces to reposition and outmaneuver adversaries.', stats: { hp: 'A', speed: 'S', damage: 'A' }, ability: { name: 'Gale Slash', desc: 'Leaps forward in a whirlwind, dealing damage and knocking up enemies for 1.5 seconds.' } },
  { id: 'rynshi', name: 'Rynshi', emoji: '🥷', role: 'Assassin', set: 'Tempest', lore: 'An aero-adept rogue who slips through shadows carried by draft winds.', stats: { hp: 'C', speed: 'S', damage: 'S' }, ability: { name: 'Aero Decoy', desc: 'Vanish into thin air, leaving an explosive decoy that explodes and blinds.' } },
  { id: 'dahla', name: 'Dahla', emoji: '🧛', role: 'Bruiser', set: 'Bloodthorn', lore: 'A savage arena veteran who infuses physical blades with life-stealing magic.', stats: { hp: 'A', speed: 'B', damage: 'S' }, ability: { name: 'Sanguine Fury', desc: 'Increase lifesteal by 25% and attack speed by 40% for 6 seconds.' } },
  { id: 'karriv', name: 'Karriv', emoji: '🛡️', role: 'Tank', set: 'Solar Flare', lore: 'A holy crusader who channels solar heat into his heavy shield and broadsword.', stats: { hp: 'S', speed: 'C', damage: 'A' }, ability: { name: 'Sol Crest', desc: 'Absorb all frontal attacks, releasing a blast dealing 150% of stored damage.' } },
  { id: 'edani', name: 'Edani', emoji: '🔮', role: 'Mage', set: 'Voidbringer', lore: 'An academic wizard who unlocked void equations and gravitational singularities.', stats: { hp: 'B', speed: 'B', damage: 'S' }, ability: { name: 'Void Collapse', desc: 'Summon a gravity anomaly that pulls in all entities and deals massive AP damage.' } }
];

const RELICS = [
  { id: 'tempest_crown', name: 'Crown of Hurricanes', slot: 'crown', set: 'Tempest', stats: { hp: 100, ap: 15, speed: 15 } },
  { id: 'bloodthorn_weapon1', name: 'Bloodthorn Daggers', slot: 'weapon1', set: 'Bloodthorn', stats: { ap: 25, lifesteal: 8 } },
  { id: 'voidbringer_weapon1', name: 'Rift Scepter', slot: 'weapon1', set: 'Voidbringer', stats: { ap: 45, cdr: 5 } }
];

const SETS_METADATA = {
  'Tempest': '+12% Speed bonus, wind speed trails.',
  'Bloodthorn': '+8% Lifesteal, bleed wounds.',
  'Voidbringer': '+15% Cooldown Reduction (CDR).',
  'Solar Flare': '+25 Armor, +100 Max HP.'
};

// Static pool of mock players for testing and matchmaking simulation
const MOCK_PLAYERS_POOL = [
  { username: 'TofuShark', avatar: '🦊', games: { arkheron: { elo: 1050, wins: 5, losses: 3, kd: "1.25", eloHistory: [1000, 1020, 1050] }, cs: { elo: 1000, wins: 2, losses: 2, kd: "1.00", eloHistory: [1000] }, zealot: { elo: 980, wins: 1, losses: 3, kd: "0.50", eloHistory: [1000, 980] } } },
  { username: 'TowerGod', avatar: '👑', games: { arkheron: { elo: 1200, wins: 12, losses: 4, kd: "2.10", eloHistory: [1000, 1050, 1120, 1200] }, cs: { elo: 1100, wins: 6, losses: 2, kd: "1.80", eloHistory: [1000, 1100] }, zealot: { elo: 1150, wins: 8, losses: 3, kd: "1.90", eloHistory: [1000, 1150] } } },
  { username: 'Rynshi', avatar: '🥷', games: { arkheron: { elo: 950, wins: 2, losses: 6, kd: "0.60", eloHistory: [1000, 950] }, cs: { elo: 1020, wins: 3, losses: 2, kd: "1.10", eloHistory: [1000, 1020] }, zealot: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] } } },
  { username: 'Dahla', avatar: '🧛', games: { arkheron: { elo: 1120, wins: 9, losses: 5, kd: "1.45", eloHistory: [1000, 1060, 1120] }, cs: { elo: 980, wins: 1, losses: 4, kd: "0.40", eloHistory: [1000, 980] }, zealot: { elo: 1080, wins: 5, losses: 2, kd: "1.35", eloHistory: [1000, 1080] } } },
  { username: 'Grimwold', avatar: '❄️', games: { arkheron: { elo: 1010, wins: 4, losses: 4, kd: "1.05", eloHistory: [1000, 1010] }, cs: { elo: 1040, wins: 5, losses: 3, kd: "1.20", eloHistory: [1000, 1040] }, zealot: { elo: 1030, wins: 4, losses: 3, kd: "1.15", eloHistory: [1000, 1030] } } }
];

// Clean starting database of competitive players (Current user only)
let players = JSON.parse(localStorage.getItem('custom_lobbies_players')) || [
  {
    username: 'Resteral.TV',
    avatar: '🛡️',
    coins: 500,
    unlockedRewards: [],
    games: {
      arkheron: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] },
      cs: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] },
      zealot: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] }
    }
  }
];

function savePlayersToStorage() {
  localStorage.setItem('custom_lobbies_players', JSON.stringify(players));
}

let activeLobbies = {};
let currentSelectedGame = 'arkheron'; // default selected game for UI display

let supabaseClient = null;
function initSupabase() {
  const url = localStorage.getItem('supabase_url') || '';
  const key = localStorage.getItem('supabase_key') || '';
  if (url && key && typeof supabase !== 'undefined') {
    try {
      supabaseClient = supabase.createClient(url, key);
      console.log("Supabase Client initialized successfully.");
    } catch (e) {
      console.warn("Could not load Supabase client details:", e);
    }
  }
}

// App States
let appState = {
  currentTab: 'simulator',
  currentUser: 'Resteral.TV',
  activeChannel: 'arkheron', // active channel state inside portal: 'arkheron', 'zealot', 'cs'
  queues: {
    arkheron: [],
    cs: [],
    zealot: []
  },
  draft: {
    active: false,
    pool: [],      
    captains: [],  
    teams: {
      teamA: { captain: '', players: [], eternals: [] },
      teamB: { captain: '', players: [], eternals: [] }
    },
    turn: 'B',     
    pickSequence: ['B', 'A', 'A', 'B'],
    pickIdx: 0,
    game: 'arkheron'
  },
  match: {
    active: false,
    scores: { teamA: 0, teamB: 0 },
    map: 'Lobby Scrim',
    roundCount: 0,
    timer: null,
    game: 'arkheron'
  },
  tournaments: [],
  activeTournamentId: null,
  forumFilter: 'all',
  forumPosts: JSON.parse(localStorage.getItem('custom_lobbies_forum_posts')) || [
    {
      id: 'POST-WELCOME',
      author: 'Resteral.TV',
      title: '👋 Welcome to the Custom Lobbies Club Forums!',
      content: 'Hey guys, welcome to the official competitive hub! Set up your Discord, queue up for scrims, and check out the Monthly Cup schedules. Post any feedback or match requests here!',
      category: 'general',
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
      id: 'POST-CS',
      author: 'TowerGod',
      title: '🔫 CS 5v5 Matchmaking Guidelines & Strategy',
      content: 'With the transition from Hockey to CS 5v5, remember that CS queues now require 10 players to start drafting. Make sure captains are designated by high MMR. Good luck in the arena!',
      category: 'cs',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ],
  advertisedStreams: [
    {
      id: 'STREAM-SEED-RESTER',
      author: 'Resteral.TV',
      platform: 'twitch',
      url: 'https://twitch.tv/resteral',
      title: '🎥 Scrimming live on Arkheron custom lobbies! Join in.',
      isLive: true
    },
    {
      id: 'STREAM-TW-1',
      author: 'Ninja',
      platform: 'twitch',
      url: 'https://twitch.tv/ninja',
      title: '🎮 Arena Matchmaking Scrims & Battle Royale customs!',
      isLive: true
    },
    {
      id: 'STREAM-TW-2',
      author: 'Shroud',
      platform: 'twitch',
      url: 'https://twitch.tv/shroud',
      title: '🔫 Global Elite CS2 lobbies with viewers & pros!',
      isLive: true
    },
    {
      id: 'STREAM-TW-3',
      author: 'xQc',
      platform: 'twitch',
      url: 'https://twitch.tv/xqc',
      title: '🔥 Reacting to crazy CS draft highlights and scrim matches!',
      isLive: true
    },
    {
      id: 'STREAM-KK-1',
      author: 'WestCOL',
      platform: 'kick',
      url: 'https://kick.com/westcol',
      title: '🟢 5v5 Arena Showmatch and Coins Gamble matches!',
      isLive: true
    },
    {
      id: 'STREAM-KK-2',
      author: 'AdinRoss',
      platform: 'kick',
      url: 'https://kick.com/adinross',
      title: '🚀 Hosting 10,000 Coin CS matchmaking lobbies!',
      isLive: true
    },
    {
      id: 'STREAM-KK-3',
      author: 'Amouranth',
      platform: 'kick',
      url: 'https://kick.com/amouranth',
      title: '💬 Chatting and gaming with Custom Lobbies teams!',
      isLive: true
    }
  ],
  discordConnected: false,
  connectedDiscordUser: null
};

window.addEventListener('DOMContentLoaded', () => {
  players.forEach(p => {
    if (!p.bio) p.bio = "Competitive Custom Lobbies player.";
    if (!p.avatar) p.avatar = (p.username === 'Resteral.TV') ? '🦊' : '👤';
    if (!p.ingameName) p.ingameName = p.username;
    if (!p.registeredAt) p.registeredAt = new Date().toLocaleDateString();
    if (!p.color) p.color = '#7c3aed';
    if (!p.role) p.role = 'Flex';
    if (p.coins === undefined) p.coins = 500;
    if (!p.unlockedRewards) p.unlockedRewards = [];

    if (!p.steamHex) {
      let hashStr = p.username.toLowerCase();
      let hash = 0;
      for (let i = 0; i < hashStr.length; i++) hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
      let hexEnd = Math.abs(hash).toString(16).padEnd(8, 'a').slice(0, 8);
      p.steamHex = '1100001' + hexEnd;
    }

    GAMES.forEach(g => {
      if (!p.games[g]) p.games[g] = { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] };
      const pg = p.games[g];
      if (pg.streak === undefined) pg.streak = 0;
      if (pg.peakStreak === undefined) pg.peakStreak = 0;
      if (pg.lossStreak === undefined) pg.lossStreak = 0;
      if (pg.peakLossStreak === undefined) pg.peakLossStreak = 0;
      if (!pg.teammates) pg.teammates = {};
    });
  });

  // Load custom Supabase credentials if saved
  const savedUrl = localStorage.getItem('supabase_url') || '';
  const savedKey = localStorage.getItem('supabase_key') || '';
  if (savedUrl && document.getElementById('setup-supabase-url')) {
    document.getElementById('setup-supabase-url').value = savedUrl;
  }
  if (savedKey && document.getElementById('setup-supabase-key')) {
    document.getElementById('setup-supabase-key').value = savedKey;
  }
  initSupabase();

  // Check login state
  const isSignedIn = localStorage.getItem('custom_lobbies_signed_in') === 'true';
  const loginScr = document.getElementById('login-screen');
  if (isSignedIn) {
    if (loginScr) loginScr.style.display = 'none';
    const savedUser = localStorage.getItem('custom_lobbies_user') || 'Resteral.TV';
    appState.currentUser = savedUser;
    
    // If it was a Discord OAuth link, update header badges
    const isDiscordLink = localStorage.getItem('custom_lobbies_discord_linked') === 'true';
    if (isDiscordLink) {
      appState.discordConnected = true;
      appState.connectedDiscordUser = savedUser;
      const connBtn = document.getElementById('connect-discord-btn');
      const profBadge = document.getElementById('discord-profile-badge');
      const avatarBadge = document.getElementById('connected-avatar-badge');
      const nameBadge = document.getElementById('connected-username-badge');
      const pl = players.find(p => p.username === savedUser);
      if (connBtn && profBadge && avatarBadge && nameBadge && pl) {
        connBtn.style.display = 'none';
        profBadge.style.display = 'inline-flex';
        avatarBadge.innerText = pl.avatar || '👤';
        nameBadge.innerText = savedUser;
      }
    }
  } else {
    if (loginScr) loginScr.style.display = 'flex';
  }

  renderLeaderboard();
  updateVoiceChannelsUI();
  viewCodeFile('bot');
  renderStreamsList();
  updateCoinsUI();
  renderCalendar();
});

// Switch Tab
function switchTab(tabId) {
  document.querySelectorAll('header .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-btn-${tabId}`).classList.add('active');

  document.querySelectorAll('main .tab-pane').forEach(pane => pane.classList.remove('active'));
  document.getElementById(`pane-${tabId}`).classList.add('active');

  appState.currentTab = tabId;
  if (tabId === 'profiles') {
    renderProfilesTab();
  } else if (tabId === 'tournaments') {
    renderTournamentsTab();
  } else if (tabId === 'forums') {
    renderForumsTab();
  } else if (tabId === 'calendar') {
    renderCalendar();
  } else if (tabId === 'casino') {
    updateCoinsUI();
  } else if (tabId === 'clicker') {
    renderClickerUI();
  } else if (tabId === 'arkheron') {
    renderArkheronTab();
  }
}

// Select active game for leaderboard HUD
function selectActiveGame(game) {
  if (GAMES.includes(game)) {
    currentSelectedGame = game;
    renderLeaderboard();
    showToast(`Leaderboard switched to ${game.toUpperCase()}`, 'info');
  }
}

// Switch Simulated Channels inside Sidebar
function selectSimulatedChannel(game) {
  if (!GAMES.includes(game)) return;
  appState.activeChannel = game;

  document.querySelectorAll('.dc-channels-list .dc-channel-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`channel-btn-${game}`).classList.add('active');

  const titleHeader = document.querySelector('.dc-chat-header .dc-channel-title');
  if (titleHeader) {
    titleHeader.textContent = `# ${game}-lobby`;
  }
  updateQueueUI();
  showToast(`Switched channel context to #${game}-lobby`, 'info');
}

// Render Leaderboard
function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sortedPlayers = [...players].sort((a, b) => {
    const eloA = a.games[currentSelectedGame]?.elo || 1000;
    const eloB = b.games[currentSelectedGame]?.elo || 1000;
    return eloB - eloA;
  });

  const titleSpan = document.querySelector('.tab-pane#pane-leaderboard .card-title span');
  if (titleSpan) {
    titleSpan.innerHTML = `🏆 Custom Lobbies Leaderboard: <strong>${currentSelectedGame.toUpperCase()}</strong>`;
  }

  sortedPlayers.forEach((p, idx) => {
    const pg = p.games[currentSelectedGame] || { elo: 1000, wins: 0, losses: 0, kd: "1.00" };
    const ratio = pg.losses > 0 ? (pg.wins / pg.losses).toFixed(2) : pg.wins.toFixed(2);
    
    let tier = 'Silver';
    let tierClass = 'badge-danger';
    if (pg.elo >= 1500) { tier = 'Challenger'; tierClass = 'badge-warning'; }
    else if (pg.elo >= 1350) { tier = 'Elite'; tierClass = 'badge-primary'; }
    else if (pg.elo >= 1200) { tier = 'Diamond'; tierClass = 'badge-success'; }
    else if (pg.elo >= 1050) { tier = 'Gold'; tierClass = 'badge-secondary'; }

    const rowHtml = `
      <tr style="border-bottom:1px solid var(--db-border); height:52px;">
        <td style="padding:8px; font-weight:800; font-family:var(--font-display); color:${idx === 0 ? 'var(--dc-yellow)' : '#d1d5db'}">${idx + 1}</td>
        <td style="padding:8px; font-weight:600; display:flex; align-items:center; gap:8px; height:52px;">
          <span>${p.avatar}</span>
          <span>${p.username}</span>
        </td>
        <td style="padding:8px;"><span class="badge ${tierClass}">${tier}</span></td>
        <td style="padding:8px; font-weight:700; color:white;">${pg.elo}</td>
        <td style="padding:8px; text-align:center;">${pg.wins} W / ${pg.losses} L (K/D: ${pg.kd})</td>
        <td style="padding:8px; text-align:right; font-weight:700; color:var(--dc-text-link);">${ratio}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', rowHtml);
  });
}

// Chat Parser
function simulateCommand(cmdText) {
  const input = document.getElementById('chat-input-field');
  input.value = cmdText;
  document.getElementById('chat-form').dispatchEvent(new Event('submit'));
}

function handleSendChat(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input-field');
  const messageText = input.value.trim();
  
  if (!messageText) return;
  input.value = '';

  writeMessage(appState.currentUser, false, messageText);

  let prefix = '';
  if (messageText.startsWith('-')) prefix = '-';
  else if (messageText.startsWith('!')) prefix = '!';
  else if (messageText.startsWith('/')) prefix = '/';

  if (prefix) {
    const parts = messageText.substring(prefix.length).trim().split(/ +/);
    const command = parts.shift().toLowerCase();
    const argument = parts.join(' ');
    
    setTimeout(() => {
      parseChatCommand(command, argument, appState.currentUser);
    }, 350);
  }
}

function parseChatCommand(command, argument, senderUser) {
  const game = appState.activeChannel; // Lock commands to active channel game context!

  // HELP
  if (command === 'help') {
    const embed = {
      title: '🔮 Custom Lobbies Bot Help',
      desc: `Commands only execute contextually for the channel game type (Active: **${game.toUpperCase()}**).`,
      fields: [
        { title: '-j [code] / -join', val: `Join queue or custom lobby for ${game.toUpperCase()}.` },
        { title: '-l / -leave', val: `Exit matchmaking queue.` },
        { title: `-lobby [size]`, val: `Create custom lobby (sizes: 3, 6, 9) for ${game.toUpperCase()}.` },
        { title: `-lobby [code]`, val: 'List players inside that lobby and their MMRs.' },
        { title: '-lobbies', val: 'List active game lobbies.' },
        { title: '-draft', val: 'Start player draft (requires 6 queue players).' },
        { title: '-pick [index/name]', val: 'Draft a player (Captains turn).' },
        { title: '-stats [player]', val: `View player MMR and records for ${game.toUpperCase()}.` },
        { title: '-compare [player]', val: 'Compare ELO and expected win odds.' },
        { title: '-elochart [player]', val: 'Plot ELO history curves.' },
        { title: '-leaderboard / -leaderboards', val: 'Show standings.' }
      ]
    };
    writeMessage('TheBot', true, '', embed);
  }
  
  const pl = players.find(x => x.username === senderUser);
  if (pl && pl.warnings && pl.warnings.length >= 3 && ['j', 'join', 'lobby'].includes(command)) {
    writeMessage('TheBot', true, `❌ **Error:** Cannot participate. You are currently suspended from matchmaking due to **${pl.warnings.length} warnings** for being late / no-show.`);
    return;
  }

  // JOIN
  else if (command === 'j' || command === 'join') {
    if (argument) {
      const code = argument.trim().toUpperCase();
      if (!activeLobbies[code]) {
        writeMessage('TheBot', true, `❌ Custom lobby **${code}** does not exist or has expired.`);
        return;
      }
      
      const lobby = activeLobbies[code];
      if (lobby.game !== game) {
        writeMessage('TheBot', true, `❌ Lobby **${code}** is for **${lobby.game.toUpperCase()}**. Please switch channel to join.`);
        return;
      }

      if (lobby.players.includes(senderUser)) {
        writeMessage('TheBot', true, `⚠️ You are already in lobby **${code}**.`);
        return;
      }
      
      lobby.players.push(senderUser);
      playSound('join'); // Play join blip
      const playerElo = players.find(p => p.username === senderUser)?.games[game]?.elo || 1000;
      
      if (lobby.players.length === lobby.targetSize) {
        playSound('match_found'); // Play sonar chime
        const lobbyPlayers = lobby.players.map(p => players.find(pl => pl.username === p));
        let description = `Lobby **${code}** for **${game.toUpperCase()}** is full! balanced by MMR:\n\n`;
        
        lobbyPlayers.sort((a, b) => b.games[game].elo - a.games[game].elo);
        const t1 = [lobbyPlayers[0], lobbyPlayers[3], lobbyPlayers[4]];
        const t2 = [lobbyPlayers[1], lobbyPlayers[2], lobbyPlayers[5]];
        
        description += `🟢 **Team Alpha (Avg MMR: ${Math.round((t1[0].games[game].elo + t1[1].games[game].elo + t1[2].games[game].elo)/3)}):**\n` + t1.map(p => `• ${p.username} (${p.games[game].elo})`).join('\n') + '\n\n';
        description += `🔵 **Team Beta (Avg MMR: ${Math.round((t2[0].games[game].elo + t2[1].games[game].elo + t2[2].games[game].elo)/3)}):**\n` + t2.map(p => `• ${p.username} (${p.games[game].elo})`).join('\n');

        const embed = {
          title: `🎮 Custom Lobby ${code} Ready!`,
          desc: description,
          fields: [{ title: '🔑 Custom Game Join Code', val: `\`${code}\`` }]
        };
        writeMessage('TheBot', true, '', embed);
        delete activeLobbies[code];
      } else {
        const embed = {
          title: `👥 Joined Custom Lobby ${code}`,
          desc: `Player **${senderUser}** (MMR: **${playerElo}**) joined the lobby.\n\n**Players (${lobby.players.length}/${lobby.targetSize}):**\n` + lobby.players.map((p, idx) => `${idx+1}. ${p} (MMR: ${players.find(pl=>pl.username===p)?.games[game]?.elo || 1000})`).join('\n')
        };
        writeMessage('TheBot', true, '', embed);
      }
    } else {
      if (appState.draft.active || appState.match.active) {
        writeMessage('TheBot', true, '⚠️ **Error:** Cannot join queue. A match or draft is in progress.');
        return;
      }
      if (appState.queues[game].includes(senderUser)) {
        writeMessage('TheBot', true, `⚠️ **${senderUser}**, you are already in the queue.`);
        return;
      }

      appState.queues[game].push(senderUser);
      playSound('join'); // Play join blip
      const playerElo = players.find(p => p.username === senderUser)?.games[game]?.elo || 1000;
      const limit = game === 'cs' ? 10 : 6;
      writeMessage('TheBot', true, `✅ **${senderUser}** (MMR: **${playerElo}**) joined the **${game.toUpperCase()}** queue! (${appState.queues[game].length}/${limit})`);
      updateQueueUI();
    }
  }

  // LEAVE
  else if (command === 'l' || command === 'leave') {
    if (argument) {
      const code = argument.trim().toUpperCase();
      if (!activeLobbies[code]) return writeMessage('TheBot', true, `❌ Custom lobby **${code}** does not exist.`);
      const lobby = activeLobbies[code];
      if (!lobby.players.includes(senderUser)) return writeMessage('TheBot', true, `⚠️ You are not in lobby **${code}**.`);
      lobby.players = lobby.players.filter(p => p !== senderUser);
      writeMessage('TheBot', true, `🏃 **${senderUser}** left custom lobby **${code}**. (${lobby.players.length}/${lobby.targetSize})`);
    } else {
      if (!appState.queues[game].includes(senderUser)) return writeMessage('TheBot', true, `⚠️ **${senderUser}**, you are not in the queue.`);
      appState.queues[game] = appState.queues[game].filter(p => p !== senderUser);
      const limit = game === 'cs' ? 10 : 6;
      writeMessage('TheBot', true, `🏃 **${senderUser}** left the ${game.toUpperCase()} queue. (${appState.queues[game].length}/${limit})`);
      updateQueueUI();
    }
  }

  // LOBBY
  else if (command === 'lobby') {
    const parts = argument.trim().split(/ +/);
    const firstArg = parts[0]?.toUpperCase();

    // Check if the argument is an existing lobby code
    if (firstArg && activeLobbies[firstArg]) {
      const code = firstArg;
      const lobby = activeLobbies[code];
      const lobbyGame = lobby.game;
      const playerList = lobby.players.map((p, idx) => `${idx+1}. **${p}** (MMR: ${players.find(pl=>pl.username===p)?.games[lobbyGame]?.elo || 1000})`).join('\n');
      
      const embed = {
        title: `🎮 Custom Lobby: ${code} (${lobbyGame.toUpperCase()})`,
        desc: `**Host:** ${lobby.host}\n**Size:** \`${lobby.players.length}/${lobby.targetSize}\`\n\n**Current Players:**\n${playerList}`,
        footer: `Join command: -j ${code}`
      };
      writeMessage('TheBot', true, '', embed);
      return;
    }

    let size = 6;

    if (parts[0]) {
      const parsedSize = parseInt(parts[0]);
      if ([3, 6, 9].includes(parsedSize)) size = parsedSize;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'LOB-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    activeLobbies[code] = { host: senderUser, players: [senderUser], targetSize: size, game };
    const userElo = players.find(p => p.username === senderUser)?.games[game]?.elo || 1000;

    const embed = {
      title: `🎮 ${game.toUpperCase()} Custom Lobby Created!`,
      desc: `Host **${senderUser}** created a custom lobby for **${size}** players.\n\n**Lobby Code:** \`${code}\`\n**Join command:** \`-j ${code}\`\n\n**Current Players (1/${size}):**\n1. ${senderUser} (MMR: ${userElo})`
    };
    writeMessage('TheBot', true, '', embed);
  }

  // DRAFT
  else if (command === 'draft') {
    if (appState.draft.active || appState.match.active) {
      writeMessage('TheBot', true, '⚠️ **Error:** A match/draft is already active.');
      return;
    }

    const requiredPlayers = game === 'cs' ? 10 : 6;
    if (appState.queues[game].length < requiredPlayers) {
      writeMessage('TheBot', true, `⚠️ Cannot start draft. Need at least ${requiredPlayers} players in queue for a ${requiredPlayers/2}v${requiredPlayers/2} scrim. Type \`!addbots\` to fill.`);
      return;
    }

    triggerDraftStart(game);
  }

  // ADDBOTS
  else if (command === 'addbots') {
    if (appState.draft.active || appState.match.active) return writeMessage('TheBot', true, '⚠️ **Error:** A match or draft is active.');

    if (!appState.queues[game].includes(appState.currentUser)) {
      appState.queues[game].push(appState.currentUser);
      playSound('join');
    }

    // Since players list might be empty, ensure we check the MOCK_PLAYERS_POOL
    // and copy them into players if needed to fill the queue
    const othersPool = MOCK_PLAYERS_POOL.filter(p => p.username !== appState.currentUser);
    othersPool.forEach(mp => {
      if (!players.find(p => p.username === mp.username)) {
        players.push(JSON.parse(JSON.stringify(mp)));
      }
    });

    const others = players.filter(p => p.username !== appState.currentUser);
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    
    const requiredPlayers = game === 'cs' ? 10 : 6;
    while (appState.queues[game].length < requiredPlayers && shuffled.length > 0) {
      const candidate = shuffled.pop().username;
      if (!appState.queues[game].includes(candidate)) {
        appState.queues[game].push(candidate);
        playSound('join');
      }
    }

    writeMessage('TheBot', true, `🤖 Queue filled with test players for ${game.toUpperCase()}!`);
    appState.queues[game].forEach(p => {
      if (p !== appState.currentUser) writeMessage('TheBot', true, `✅ **${p}** joined the queue!`);
    });
    updateQueueUI();
  }

  // PICK
  else if (command === 'pick' || command === 'p') {
    if (!appState.draft.active) return writeMessage('TheBot', true, '⚠️ **Error:** No active drafting phase.');

    const activeDraft = appState.draft;
    const currentTurn = activeDraft.pickSequence[activeDraft.pickIdx];
    const currentCap = currentTurn === 'A' ? activeDraft.teams.teamA.captain : activeDraft.teams.teamB.captain;
    
    if (senderUser !== currentCap) {
      writeMessage('TheBot', true, `⚠️ It is not your turn. Captain **${currentCap}** is picking.`);
      return;
    }

    if (!argument) {
      writeMessage('TheBot', true, '⚠️ Specify player index/name.');
      return;
    }

    let selectedPlayer = null;
    const numVal = parseInt(argument);

    if (!isNaN(numVal) && numVal >= 1 && numVal <= activeDraft.pool.length) {
      selectedPlayer = activeDraft.pool[numVal - 1];
    } else {
      selectedPlayer = activeDraft.pool.find(p => p.toLowerCase() === argument.toLowerCase());
    }

    if (!selectedPlayer) {
      writeMessage('TheBot', true, `⚠️ Player not found in draft pool.`);
      return;
    }

    executeDraftPick(selectedPlayer);
  }

  // STATS
  else if (command === 'stats') {
    const parts = argument.trim().split(/ +/);
    const targetName = parts[0] ? parts[0] : senderUser;

    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** not found.`);

    const pg = p.games[game];
    const winrate = pg.wins + pg.losses > 0 ? ((pg.wins / (pg.wins + pg.losses)) * 100).toFixed(1) + "%" : "0%";
    
    const embed = {
      title: `📊 ${game.toUpperCase()} Profile: ${p.username}`,
      fields: [
        { title: 'MMR Rating', val: `\`${pg.elo}\`` },
        { title: 'W/L Record', val: `${pg.wins} Wins / ${pg.losses} Losses (${winrate})` }
      ]
    };
    writeMessage('TheBot', true, '', embed);
  }

  // COMPARE
  else if (command === 'compare') {
    const parts = argument.trim().split(/ +/);
    if (!parts[0]) return writeMessage('TheBot', true, '⚠️ Specify player username (e.g. `-compare TofuShark`).');

    const nameA = senderUser;
    const nameB = parts[0];

    const pA = players.find(p => p.username.toLowerCase() === nameA.toLowerCase());
    const pB = players.find(p => p.username.toLowerCase() === nameB.toLowerCase());

    if (!pA || !pB) return writeMessage('TheBot', true, `❌ Player compare failed.`);

    const pgA = pA.games[game];
    const pgB = pB.games[game];

    const probA = 1 / (1 + Math.pow(10, (pgB.elo - pgA.elo) / 400));
    const probB = 1 - probA;

    const embed = {
      title: `⚔️ Compare: ${pA.username} vs ${pB.username} (${game.toUpperCase()})`,
      fields: [
        { title: `👤 ${pA.username}`, val: `**MMR:** \`${pgA.elo}\` (W/L: ${pgA.wins}-${pgA.losses})` },
        { title: `👤 ${pB.username}`, val: `**MMR:** \`${pgB.elo}\` (W/L: ${pgB.wins}-${pgB.losses})` },
        { title: '🔮 Victory Probability', val: `**${pA.username}:** \`${(probA*100).toFixed(1)}%\` vs **${pB.username}:** \`${(probB*100).toFixed(1)}%\``, fullwidth: true }
      ]
    };
    writeMessage('TheBot', true, '', embed);
  }

  // ELOCHART
  else if (command === 'elochart') {
    const parts = argument.trim().split(/ +/);
    const targetName = parts[0] ? parts[0] : senderUser;

    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player not found.`);

    const pg = p.games[game];
    const width = 450, height = 150, padding = 25;
    const chartWidth = width - padding * 2, chartHeight = height - padding * 2;

    const minVal = Math.min(...pg.eloHistory) - 20;
    const maxVal = Math.max(...pg.eloHistory) + 20;
    const range = maxVal - minVal || 10;

    const points = pg.eloHistory.map((val, idx) => {
      const x = padding + (idx / Math.max(1, pg.eloHistory.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((val - minVal) / range) * chartHeight;
      return { x, y, val };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) pathD += ` L ${points[i].x} ${points[i].y}`;

    let dotsHtml = '';
    points.forEach(pt => {
      dotsHtml += `
        <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="var(--dc-text-link)" stroke="white" stroke-width="1.5" />
        <text x="${pt.x}" y="${pt.y - 8}" font-size="9" fill="white" font-weight="700" text-anchor="middle">${pt.val}</text>
      `;
    });

    const svgHtml = `
      <div style="background:#1e1f22; border-radius:6px; padding:12px; margin-top:8px; border:1px solid #2b2d31;">
        <div style="font-weight:700; color:white; font-size:0.9rem; margin-bottom:8px;">📈 ELO Trend Chart: ${p.username} (${game.toUpperCase()})</div>
        <svg width="100%" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
          <path d="${pathD}" fill="none" stroke="var(--dc-text-link)" stroke-width="2.5" />
          ${dotsHtml}
        </svg>
      </div>
    `;

    const embed = {
      title: `📈 ${game.toUpperCase()} MMR History: ${p.username}`,
      desc: svgHtml
    };
    writeMessage('TheBot', true, '', embed);
  }

  // LEADERBOARD / LEADERBOARDS
  else if (command === 'leaderboard' || command === 'leaderboards' || command === 'rank') {
    const list = [...players]
      .filter(p => p.games && p.games[game])
      .sort((a,b) => b.games[game].elo - a.games[game].elo)
      .slice(0, 10)
      .map((p, idx) => {
        const pg = p.games[game];
        return `${idx+1}. **${p.username}** - MMR: \`${pg.elo}\` (W/L: ${pg.wins}/${pg.losses})`;
      })
      .join('\n');

    const embed = {
      title: `🏆 ${game.toUpperCase()} Competitive MMR Leaderboard`,
      desc: list || 'No players recorded.'
    };
    writeMessage('TheBot', true, '', embed);
  }

  // BEST TEAMMATES
  else if (command === 'best') {
    const targetName = argument.trim() ? argument.trim() : senderUser;
    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** is not registered.`);

    const pg = p.games[game];
    if (!pg.teammates || Object.keys(pg.teammates).length === 0) {
      return writeMessage('TheBot', true, `⚠️ **${p.username}** hasn't completed any 3v3 scrims with teammates in **${game.toUpperCase()}**.`);
    }

    const sorted = Object.entries(pg.teammates)
      .map(([name, stats]) => {
        const total = stats.wins + stats.losses;
        const rate = total > 0 ? ((stats.wins / total) * 100).toFixed(1) : "0.0";
        return { name, wins: stats.wins, losses: stats.losses, total, rate: parseFloat(rate) };
      })
      .sort((a, b) => b.rate - a.rate || b.total - a.total);

    const list = sorted.slice(0, 5).map((t, idx) => `${idx+1}. **${t.name}** - Winrate: \`${t.rate}%\` (${t.wins} W / ${t.losses} L)`).join('\n');

    const embed = {
      title: `🌟 Best Teammates for ${p.username} (${game.toUpperCase()})`,
      desc: list || 'No teammates recorded.'
    };
    writeMessage('TheBot', true, '', embed);
  }

  // WORST TEAMMATES
  else if (command === 'worst') {
    const targetName = argument.trim() ? argument.trim() : senderUser;
    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** is not registered.`);

    const pg = p.games[game];
    if (!pg.teammates || Object.keys(pg.teammates).length === 0) {
      return writeMessage('TheBot', true, `⚠️ **${p.username}** hasn't completed any 3v3 scrims with teammates in **${game.toUpperCase()}**.`);
    }

    const sorted = Object.entries(pg.teammates)
      .map(([name, stats]) => {
        const total = stats.wins + stats.losses;
        const rate = total > 0 ? ((stats.wins / total) * 100).toFixed(1) : "0.0";
        return { name, wins: stats.wins, losses: stats.losses, total, rate: parseFloat(rate) };
      })
      .sort((a, b) => a.rate - b.rate || b.losses - a.losses);

    const list = sorted.slice(0, 5).map((t, idx) => `${idx+1}. **${t.name}** - Winrate: \`${t.rate}%\` (${t.wins} W / ${t.losses} L)`).join('\n');

    const embed = {
      title: `💀 Worst teammates for ${p.username} (${game.toUpperCase()})`,
      desc: list || 'No teammates recorded.'
    };
    writeMessage('TheBot', true, '', embed);
  }

  // PEAK STREAK
  else if (command === 'peak') {
    const targetName = argument.trim() ? argument.trim() : senderUser;
    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** is not registered.`);

    const pg = p.games[game];
    const embed = {
      title: `🔥 Peak Winstreak: ${p.username} (${game.toUpperCase()})`,
      desc: `**Current Winstreak:** \`${pg.streak || 0}\` matches\n**Peak (Highest) Winstreak:** \`${pg.peakStreak || 0}\` matches`
    };
    writeMessage('TheBot', true, '', embed);
  }

  // LOWEST STREAK
  else if (command === 'lowest') {
    const targetName = argument.trim() ? argument.trim() : senderUser;
    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** is not registered.`);

    const pg = p.games[game];
    const embed = {
      title: `📉 Peak Losing Streak: ${p.username} (${game.toUpperCase()})`,
      desc: `**Current Losing Streak:** \`${pg.lossStreak || 0}\` matches\n**Peak (Worst) Losing Streak:** \`${pg.peakLossStreak || 0}\` matches`
    };
    writeMessage('TheBot', true, '', embed);
  }

  // REGISTER
  else if (command === 'register') {
    const ingameName = argument.trim();
    if (!ingameName) return writeMessage('TheBot', true, "⚠️ Specify your in-game name (e.g. `-register Resteral.TV`).");

    const me = players.find(pl => pl.username.toLowerCase() === senderUser.toLowerCase());
    if (me) {
      me.ingameName = ingameName;
      if (appState.currentUser === me.username) {
        document.getElementById('prof-edit-ingame').value = ingameName;
      }
      writeMessage('TheBot', true, `✅ **Profile Registered!** Welcome to Custom Lobbies. Linked in-game handle: **${ingameName}**.`);
      renderProfilesTab();
    }
  }

  // PROFILE
  else if (command === 'profile') {
    const targetName = argument.trim() ? argument.trim() : senderUser;
    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** is not registered.`);

    const embed = {
      title: `${p.avatar || '👤'} Player Profile: ${p.username}`,
      desc: `*${p.bio || 'Competitive Custom Lobbies player.'}*\n\n` +
            `🔗 **Linked In-Game Handle:** \`${p.ingameName || 'Not linked. Use -register'}\`\n` +
            `📅 **Joined Club:** \`${p.registeredAt || 'Today'}\`\n\n` +
            `🧜 **Arkheron:** MMR: **${p.games.arkheron?.elo || 1000}** (W/L: ${p.games.arkheron?.wins}-${p.games.arkheron?.losses})\n` +
            `🔫 **Counter-Strike (CS):** MMR: **${p.games.cs?.elo || 1000}** (W/L: ${p.games.cs?.wins}-${p.games.cs?.losses})\n` +
            `🛡️ **Zealot Mod:** MMR: **${p.games.zealot?.elo || 1000}** (W/L: ${p.games.zealot?.wins}-${p.games.zealot?.losses})`
    };
    writeMessage('TheBot', true, '', embed);
  }

  // SETBIO
  else if (command === 'setbio') {
    const bioText = argument.trim();
    if (!bioText) return writeMessage('TheBot', true, "⚠️ Specify your new profile motto/bio (e.g. `-setbio Midlaner looking for a team`).");

    const me = players.find(pl => pl.username.toLowerCase() === senderUser.toLowerCase());
    if (me) {
      me.bio = bioText;
      if (appState.currentUser === me.username) {
        document.getElementById('prof-edit-bio').value = bioText;
      }
      writeMessage('TheBot', true, "✅ Profile bio updated successfully!");
      renderProfilesTab();
    }
  }

  // SETAVATAR
  else if (command === 'setavatar') {
    const emoji = argument.trim();
    if (!emoji) return writeMessage('TheBot', true, "⚠️ Specify an emoji to set as your profile avatar (e.g. `-setavatar 🦊`).");

    const me = players.find(pl => pl.username.toLowerCase() === senderUser.toLowerCase());
    if (me) {
      me.avatar = emoji;
      if (appState.currentUser === me.username) {
        document.getElementById('prof-edit-avatar').value = emoji;
      }
      writeMessage('TheBot', true, `✅ Profile avatar updated to: ${emoji}`);
      renderProfilesTab();
      updateVoiceChannelsUI();
    }
  }

  // WARN
  else if (command === 'warn') {
    const parts = argument.trim().split(' ');
    const targetName = parts[0];
    const reason = parts.slice(1).join(' ').trim() || 'Late / No-show to custom lobby match.';

    if (!targetName) return writeMessage('TheBot', true, "⚠️ Please specify a player username to warn (e.g. `-warn Resteral.TV Late for hockey game`).");

    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** not found.`);

    p.warnings = p.warnings || [];
    p.warnings.push({
      id: 'WARN-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      reason,
      issuedAt: new Date().toISOString()
    });

    const wCount = p.warnings.length;
    let replyMsg = `🚨 **${p.username}** has been warned by **${senderUser}** for: *${reason}*. (Warnings: ${wCount}/3)`;
    if (wCount >= 3) {
      replyMsg += `\n❌ **SUSPENDED:** Player has reached 3 warnings and is now suspended from matchmaking!`;
      
      Object.keys(appState.queues).forEach(g => {
        appState.queues[g] = appState.queues[g].filter(u => u !== p.username);
      });
      updateLobbyQueueUI(game);
    }
    writeMessage('TheBot', true, replyMsg);
    renderProfilesTab();
  }

  // CLEAR WARNS
  else if (command === 'clearwarns') {
    const targetName = argument.trim();
    if (!targetName) return writeMessage('TheBot', true, "⚠️ Please specify a player username to clear warnings (e.g. `-clearwarns Resteral.TV`).");

    const p = players.find(pl => pl.username.toLowerCase() === targetName.toLowerCase());
    if (!p) return writeMessage('TheBot', true, `❌ Player **${targetName}** not found.`);

    p.warnings = [];
    writeMessage('TheBot', true, `✅ Clean slate! Warnings cleared for **${p.username}**. Suspension lifted.`);
    renderProfilesTab();
  }
}

// Drafting Logic (Simulator)
function triggerDraftStart(game) {
  appState.draft.active = true;
  appState.draft.game = game;
  playSound('match_found'); // Play sonar chime for match found

  if (appState.currentTab === 'casino') {
    updateCoinsUI();
  }

  const requiredPlayers = game === 'cs' ? 10 : 6;
  const lobbyNames = appState.queues[game].slice(0, requiredPlayers);
  appState.queues[game] = appState.queues[game].slice(requiredPlayers);
  
  const lobbyPlayers = lobbyNames.map(name => players.find(p => p.username === name));
  lobbyPlayers.sort((a, b) => b.games[game].elo - a.games[game].elo);
  
  const capA = lobbyPlayers[0]; 
  const capB = lobbyPlayers[1]; 
  const restPlayers = lobbyPlayers.slice(2).map(p => p.username);

  const pickSequence = game === 'cs' ? ['B', 'A', 'A', 'B', 'B', 'A', 'A', 'B'] : ['B', 'A', 'A', 'B'];

  appState.draft.captains = [capA, capB];
  appState.draft.pool = restPlayers;
  appState.draft.teams.teamA = { captain: capA.username, players: [capA.username], eternals: [] };
  appState.draft.teams.teamB = { captain: capB.username, players: [capB.username], eternals: [] };
  appState.draft.turn = 'B';
  appState.draft.pickIdx = 0;
  appState.draft.pickSequence = pickSequence;

  updateVoiceChannelsUI();

  const embed = {
    title: `⚔️ ${requiredPlayers/2}v${requiredPlayers/2} ${game.toUpperCase()} Serpentine Player Draft Starting`,
    desc: `Captains selected: **${capA.username}** and **${capB.username}**. Drafting in dedicated channel #draft-${game}.`,
    fields: [
      { title: '🟢 Team Alpha Captain', val: `${capA.username} (MMR: ${capA.games[game].elo})` },
      { title: '🔵 Team Beta Captain', val: `${capB.username} (MMR: ${capB.games[game].elo})` },
      { title: '👥 Selection Pool', val: appState.draft.pool.map((p, idx) => `${idx+1}. **${p}** (MMR: ${players.find(pl=>pl.username===p)?.games[game].elo} - Role: ${players.find(pl=>pl.username===p)?.role || 'Flex'})`).join('\n'), fullwidth: true }
    ]
  };
  
  writeMessage('TheBot', true, '', embed);
  showToast(`Draft started for ${game.toUpperCase()}`, 'success');

  document.getElementById('draft-arena-card').style.display = 'block';
  updateQueueUI();
  updateDraftArenaUI();

  if (capB.username === appState.currentUser) {
    setTimeout(() => playSound('your_turn'), 800); // Alert user that it is their turn to select
  }

  checkBotPickSchedule();
}

function checkBotPickSchedule() {
  if (!appState.draft.active) return;
  const currentTurn = appState.draft.pickSequence[appState.draft.pickIdx];
  const activeCapName = currentTurn === 'A' ? appState.draft.captains[0].username : appState.draft.captains[1].username;
  
  if (activeCapName !== appState.currentUser) {
    setTimeout(() => {
      const pool = appState.draft.pool;
      if (pool.length > 0) {
        const pickIndex = Math.floor(Math.random() * pool.length);
        const selected = pool[pickIndex];
        writeMessage(activeCapName, false, `-pick ${selected}`);
        setTimeout(() => executeDraftPick(selected), 300);
      }
    }, 1800);
  }
}

function executeDraftPick(playerUsername) {
  const activeDraft = appState.draft;
  const currentTurn = activeDraft.pickSequence[activeDraft.pickIdx];
  const capName = currentTurn === 'A' ? activeDraft.teams.teamA.captain : activeDraft.teams.teamB.captain;

  activeDraft.pool = activeDraft.pool.filter(p => p !== playerUsername);
  const activeTeam = currentTurn === 'A' ? activeDraft.teams.teamA : activeDraft.teams.teamB;
  activeTeam.players.push(playerUsername);
  
  playSound('pick'); // Play draft pick thud
  writeMessage('TheBot', true, `✨ Captain **${capName}** drafted **${playerUsername}** for **${currentTurn === 'A' ? 'Team Alpha' : 'Team Beta'}**!`);
  activeDraft.pickIdx++;

  if (activeDraft.pickIdx < activeDraft.pickSequence.length) {
    activeDraft.turn = activeDraft.pickSequence[activeDraft.pickIdx];
    updateDraftArenaUI();
    
    // Check if the next turn is the current user's turn
    const nextTurn = activeDraft.pickSequence[activeDraft.pickIdx];
    const nextCap = nextTurn === 'A' ? activeDraft.captains[0].username : activeDraft.captains[1].username;
    if (nextCap === appState.currentUser) {
      setTimeout(() => playSound('your_turn'), 400); // Alert user that it is their turn to select
    }

    checkBotPickSchedule();
  } else {
    concludeDrafting();
  }
}

function concludeDrafting() {
  const game = appState.draft.game;
  appState.draft.active = false;
  document.getElementById('draft-arena-card').style.display = 'none';

  appState.match.active = true;
  appState.match.game = game;
  appState.match.scores = { teamA: 0, teamB: 0 };
  appState.match.roundCount = 0;

  const tA = appState.draft.teams.teamA;
  const tB = appState.draft.teams.teamB;
  tA.eternals = [];
  tB.eternals = [];
  tA.players.forEach((pName, idx) => { tA.eternals[idx] = ETERNALS[idx % ETERNALS.length]; });
  tB.players.forEach((pName, idx) => { tB.eternals[idx] = ETERNALS[(idx + 2) % ETERNALS.length]; });

  const embed = {
    title: `🎮 Match Starting: ${game.toUpperCase()}`,
    desc: `Teams locked. Temporary team voice channels are active.`,
    fields: [
      { title: '🟢 Team Alpha', val: `**Players:** ${tA.players.join(', ')}` },
      { title: '🔵 Team Beta', val: `**Players:** ${tB.players.join(', ')}` }
    ]
  };

  writeMessage('TheBot', true, '', embed);
  showToast(`Match starting!`, 'success');

  document.getElementById('match-simulator-card').style.display = 'block';
  document.getElementById('ms-ct-name').textContent = `Team ${tA.captain} (Alpha)`;
  document.getElementById('ms-t-name').textContent = `Team ${tB.captain} (Beta)`;
  document.getElementById('ms-ct-score').textContent = '0';
  document.getElementById('ms-t-score').textContent = '0';
  
  const logsBox = document.getElementById('match-logs-box');
  logsBox.innerHTML = `<div class="match-log-line system">Match initialized for ${game.toUpperCase()}...</div>`;

  setTimeout(runSimulatedMatchTick, 2000);
}

function runSimulatedMatchTick() {
  if (!appState.match.active) return;
  appState.match.roundCount++;

  const teamAWins = Math.random() < 0.5;
  if (teamAWins) appState.match.scores.teamA++;
  else appState.match.scores.teamB++;

  document.getElementById('ms-ct-score').textContent = appState.match.scores.teamA;
  document.getElementById('ms-t-score').textContent = appState.match.scores.teamB;

  const logsBox = document.getElementById('match-logs-box');
  const tA = appState.draft.teams.teamA;
  const tB = appState.draft.teams.teamB;
  const winner = teamAWins ? tA : tB;
  const loser = teamAWins ? tB : tA;

  const wPlayer = winner.players[Math.floor(Math.random() * winner.players.length)];
  const lPlayer = loser.players[Math.floor(Math.random() * loser.players.length)];

  logsBox.innerHTML += `<div class="match-log-line kill">Round ${appState.match.roundCount}: **${wPlayer}** cleared **${lPlayer}**!</div>`;
  logsBox.scrollTop = logsBox.scrollHeight;

  if (appState.match.scores.teamA === 5 || appState.match.scores.teamB === 5) {
    concludeMatch(appState.match.scores.teamA === 5);
  } else {
    setTimeout(runSimulatedMatchTick, 2000);
  }
}

function concludeMatch(alphaWon) {
  const game = appState.match.game;
  appState.match.active = false;

  const winTeam = alphaWon ? appState.draft.teams.teamA : appState.draft.teams.teamB;
  const loseTeam = alphaWon ? appState.draft.teams.teamB : appState.draft.teams.teamA;

  winTeam.players.forEach(name => {
    const p = players.find(pl => pl.username === name);
    if (p) {
      const pg = p.games[game];
      pg.wins++;
      pg.elo += 25;
      pg.eloHistory.push(pg.elo);

      // Streaks
      pg.streak = (pg.streak || 0) + 1;
      if (pg.streak > (pg.peakStreak || 0)) {
        pg.peakStreak = pg.streak;
      }
      pg.lossStreak = 0;

      // Teammates
      if (!pg.teammates) pg.teammates = {};
      const allies = winTeam.players.filter(plName => plName !== name);
      allies.forEach(ally => {
        if (!pg.teammates[ally]) pg.teammates[ally] = { wins: 0, losses: 0 };
        pg.teammates[ally].wins++;
      });
    }
  });

  loseTeam.players.forEach(name => {
    const p = players.find(pl => pl.username === name);
    if (p) {
      const pg = p.games[game];
      pg.losses++;
      pg.elo = Math.max(800, pg.elo - 15);
      pg.eloHistory.push(pg.elo);

      // Streaks
      pg.streak = 0;
      pg.lossStreak = (pg.lossStreak || 0) + 1;
      if (pg.lossStreak > (pg.peakLossStreak || 0)) {
        pg.peakLossStreak = pg.lossStreak;
      }

      // Teammates
      if (!pg.teammates) pg.teammates = {};
      const allies = loseTeam.players.filter(plName => plName !== name);
      allies.forEach(ally => {
        if (!pg.teammates[ally]) pg.teammates[ally] = { wins: 0, losses: 0 };
        pg.teammates[ally].losses++;
      });
    }
  });

  savePlayersToStorage();
  renderLeaderboard();

  // Process live wagers
  if (typeof activeMatchBet !== 'undefined' && activeMatchBet) {
    const me = players.find(p => p.username === appState.currentUser);
    if (me) {
      const won = (activeMatchBet.betOn === 'alpha' && alphaWon) || (activeMatchBet.betOn === 'beta' && !alphaWon);
      if (won) {
        const payout = activeMatchBet.amount * 2;
        me.coins = (me.coins || 500) + payout;
        savePlayersToStorage();
        showToast(`🎰 Casino Pay Out: You won +${payout} Coins!`, "success");
        writeMessage('TheBot', true, `🎰 **Casino Pay Out:** **${me.username}** won **${payout} Coins** by betting on the winning team!`);
      } else {
        showToast(`🎰 Casino Loss: Lost ${activeMatchBet.amount} Coins.`, "warning");
      }
    }
    activeMatchBet = null;
    if (appState.currentTab === 'casino') {
      updateCoinsUI();
    }
  }

  const embed = {
    title: `🏆 Match Complete - Team ${winTeam.captain} Wins!`,
    desc: `Temporary team voice channels have been deleted automatically.`,
    fields: [
      { title: '📈 Winners (+25 MMR)', val: winTeam.players.join(', ') },
      { title: '📉 Losers (-15 MMR)', val: loseTeam.players.join(', ') }
    ]
  };
  writeMessage('TheBot', true, '', embed);
  
  setTimeout(() => {
    document.getElementById('match-simulator-card').style.display = 'none';
  }, 5000);
}

function updateQueueUI() {
  const game = appState.activeChannel;
  const countBadge = document.getElementById('queue-count-badge');
  const ratioText = document.getElementById('queue-ratio-text');
  const progressBar = document.getElementById('queue-progress-bar');
  const count = appState.queues[game].length;
  const limit = game === 'cs' ? 10 : 6;
  
  const indicatorHtml = count > 0 ? `<span class="queue-scanning-indicator" style="margin-right: 6px;"></span>` : '';
  countBadge.innerHTML = `${indicatorHtml}${count}/${limit} Players`;
  
  const pct = Math.min(100, (count / limit) * 100);
  ratioText.textContent = `${Math.round(pct)}%`;
  progressBar.style.width = `${pct}%`;
}

function updateDraftArenaUI() {
  const activeDraft = appState.draft;
  const indicator = document.getElementById('draft-instructions');
  const currentTurn = activeDraft.pickSequence[activeDraft.pickIdx];
  const activeCapName = currentTurn === 'A' ? activeDraft.captains[0].username : activeDraft.captains[1].username;
  const capColor = currentTurn === 'A' ? 'var(--dc-text-link)' : 'var(--dc-yellow)';
  
  document.getElementById('draft-turn-badge').textContent = `Captain ${activeCapName}'s Turn`;
  indicator.innerHTML = `CAPTAIN <span style="color:${capColor};">${activeCapName.toUpperCase()}</span>'s TURN TO DRAFT`;

  const ctList = document.getElementById('team-ct-list');
  const tList = document.getElementById('team-t-list');

  ctList.innerHTML = '';
  activeDraft.teams.teamA.players.forEach(pName => {
    const p = players.find(pl => pl.username === pName) || { avatar: '👤', elo: 1000, role: 'Flex' };
    ctList.innerHTML += `<div class="drafted-player-card"><span>${p.avatar}</span><strong>${p.username} (${p.role || 'Flex'})</strong></div>`;
  });

  tList.innerHTML = '';
  activeDraft.teams.teamB.players.forEach(pName => {
    const p = players.find(pl => pl.username === pName) || { avatar: '👤', elo: 1000, role: 'Flex' };
    tList.innerHTML += `<div class="drafted-player-card"><span>${p.avatar}</span><strong>${p.username} (${p.role || 'Flex'})</strong></div>`;
  });

  const poolGrid = document.getElementById('draft-pool-grid');
  poolGrid.innerHTML = '';

  activeDraft.pool.forEach((pName, idx) => {
    const p = players.find(pl => pl.username === pName) || { avatar: '👤', elo: 1000, role: 'Flex' };
    const isOurTurn = (activeCapName === appState.currentUser);
    const cardClass = isOurTurn ? 'pool-player-card' : 'pool-player-card disabled';
    const clickHandler = isOurTurn ? `onclick="simulateCommand('-pick ${idx+1}')"` : '';

    poolGrid.innerHTML += `
      <div class="${cardClass}" ${clickHandler}>
        <div style="font-size:0.65rem; position:absolute; top:4px; left:6px; color:var(--dc-text-muted); font-weight:800;">#${idx+1}</div>
        <div class="pool-player-avatar">${p.avatar}</div>
        <span class="pool-player-name">${p.username}</span>
        <span class="pool-player-elo" style="font-size:0.65rem;">MMR: ${p.games[activeDraft.game].elo} • Role: ${p.role || 'Flex'}</span>
      </div>
    `;
  });
}

function updateVoiceChannelsUI() {
  const waitingBox = document.getElementById('vc-waiting-users');
  const ctBox = document.getElementById('vc-ct-users');
  const tBox = document.getElementById('vc-t-users');

  waitingBox.innerHTML = '';
  ctBox.innerHTML = '';
  tBox.innerHTML = '';

  let countWaiting = 0, countCt = 0, countT = 0;

  if (appState.draft.active || appState.match.active) {
    appState.draft.teams.teamA.players.forEach(pName => {
      const p = players.find(pl => pl.username === pName) || { avatar: '👤' };
      ctBox.innerHTML += `<div class="dc-voice-user"><div class="dc-voice-avatar">${p.avatar}</div><span>${pName}</span></div>`;
      countCt++;
    });
    appState.draft.teams.teamB.players.forEach(pName => {
      const p = players.find(pl => pl.username === pName) || { avatar: '👤' };
      tBox.innerHTML += `<div class="dc-voice-user"><div class="dc-voice-avatar">${p.avatar}</div><span>${pName}</span></div>`;
      countT++;
    });
  } else {
    players.forEach(p => {
      waitingBox.innerHTML += `<div class="dc-voice-user"><div class="dc-voice-avatar">${p.avatar}</div><span>${p.username}</span></div>`;
      countWaiting++;
    });
  }

  document.getElementById('vc-waiting-count').textContent = countWaiting;
  document.getElementById('vc-ct-count').textContent = countCt;
  document.getElementById('vc-t-count').textContent = countT;
}

// Render Discord Message Chat item
function writeMessage(sender, isBot, text, embedObj) {
  const container = document.getElementById('chat-messages');
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let avatar = '👤';
  if (isBot) avatar = '🔮';
  else {
    const p = players.find(pl => pl.username === sender);
    if (p) avatar = p.avatar;
  }

  let embedHtml = '';
  if (embedObj) {
    let fieldsHtml = '';
    if (embedObj.fields) {
      embedObj.fields.forEach(f => {
        fieldsHtml += `
          <div class="dc-embed-field ${f.fullwidth ? 'fullwidth' : ''}">
            <span class="dc-embed-field-title">${f.title}</span>
            <span class="dc-embed-field-val">${f.val}</span>
          </div>
        `;
      });
    }

    embedHtml = `
      <div class="dc-embed" style="border-left-color: #7c3aed">
        <div class="dc-embed-title">${embedObj.title}</div>
        ${embedObj.desc ? `<div class="dc-embed-desc">${embedObj.desc}</div>` : ''}
        ${fieldsHtml ? `<div class="dc-embed-fields">${fieldsHtml}</div>` : ''}
      </div>
    `;
  }

  const msgHtml = `
    <div class="dc-msg">
      <div class="dc-msg-avatar" style="background:${isBot ? '#7c3aed' : '#2b2d31'};">${avatar}</div>
      <div class="dc-msg-content">
        <div class="dc-msg-header">
          <span class="dc-msg-username" style="color:${isBot ? '#8b5cf6' : '#fff'};">${sender}</span>
          ${isBot ? '<span class="dc-msg-botbadge">BOT</span>' : ''}
          <span class="dc-msg-time">Today at ${timeStr}</span>
        </div>
        ${text ? `<div class="dc-msg-text">${text}</div>` : ''}
        ${embedHtml}
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', msgHtml);
  container.scrollTop = container.scrollHeight;
  if (sender !== appState.currentUser) {
    playSound('message');
  }
}

function viewCodeFile(fileKey) {
  document.querySelectorAll('.code-sidebar .code-file-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`code-btn-${fileKey}`).classList.add('active');
  let filename = 'bot.js';
  if (fileKey === 'pkg') filename = 'package.json';
  if (fileKey === 'readme') filename = 'README.md';

  document.getElementById('code-display-filename').textContent = filename;
  
  fetch(filename)
    .then(res => res.text())
    .then(text => {
      document.getElementById('code-display-block').textContent = text;
      CODE_SOURCES[fileKey] = text;
    })
    .catch(() => {
      document.getElementById('code-display-block').textContent = CODE_SOURCES[fileKey];
    });

  appState.activeCodeFile = fileKey;
}

function copySourceCode() {
  const code = CODE_SOURCES[appState.activeCodeFile || 'bot'];
  navigator.clipboard.writeText(code)
    .then(() => showToast('Source file copied to clipboard!', 'success'))
    .catch(() => showToast('Could not copy code automatically.', 'warning'));
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let emoji = 'ℹ️';
  if (type === 'success') emoji = '✅';
  if (type === 'warning') emoji = '⚠️';
  if (type === 'error') emoji = '❌';

  toast.innerHTML = `<span>${emoji}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Code Exporter Sources
const CODE_SOURCES = {
  pkg: `{
  "name": "custom-lobbies",
  "version": "1.0.0",
  "description": "Discord MMR lobby queue and serpentine team drafting bot for multiple game configurations",
  "main": "bot.js",
  "dependencies": {
    "discord.js": "^14.15.2",
    "dotenv": "^16.4.5"
  },
  "scripts": {
    "start": "node server.js"
  },
  "author": "Antigravity Pair",
  "license": "MIT"
}`,
  readme: `# Custom Lobbies Multi-Game Discord Bot

This folder contains a ready-to-deploy Discord bot for custom game rooms, serpentine drafts, ELO/MMR progression tracking, and statistics.

## Setup
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Configure your bot token in \`.env\`.
3. Enable **Message Content Intent** in the Discord Developer Portal under the Bot tab.
4. Run the bot:
   \`\`\`bash
   npm start
   \`\`\`
`,
  bot: `/**
 * Custom Lobbies Multi-Game MMR Matchmaker & Serpentine Draft Bot
 * Supports independent ELO databases for: Arkheron, Zealot, and Hockey (Zealot Hockey).
 * Channel-locked: Commands only work for the game specified by the channel name.
 * Uses Discord.js v14
 */

const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const DATABASE_FILE = './players_db.json';
let playersDb = {};

const GAMES = ['arkheron', 'cs', 'zealot'];

if (fs.existsSync(DATABASE_FILE)) {
  playersDb = JSON.parse(fs.readFileSync(DATABASE_FILE, 'utf-8'));
} else {
  playersDb = {};
  saveDb();
}

function saveDb() {
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(playersDb, null, 2));
}

let queues = {
  arkheron: [],
  cs: [],
  zealot: []
};
let activeDrafts = {};
let activeLobbies = {};

client.once('ready', () => {
  console.log("Custom Lobbies Bot is online!");
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.trim();
  const username = message.author.username;

  let command = '';
  let argument = '';
  if (content.startsWith('-') || content.startsWith('!') || content.startsWith('/')) {
    const parts = content.substring(1).split(/ +/);
    command = parts.shift().toLowerCase();
    argument = parts.join(' ');
  } else {
    return;
  }

  let channelGame = null;
  const channelName = message.channel.name?.toLowerCase() || '';

  if (channelName.includes('arkheron')) channelGame = 'arkheron';
  else if (channelName.includes('cs')) channelGame = 'cs';
  else if (channelName.includes('zealot')) channelGame = 'zealot';

  if (command === 'help') {
    // prints help card...
  }

  if (!channelGame) return message.reply("⚠️ Please run commands in game channels.");
});`
};

// Render Profiles Tab content
function renderProfilesTab() {
  const container = document.getElementById('profiles-list-container');
  if (!container) return;

  // Render current user profile input fields
  const me = players.find(p => p.username === appState.currentUser);
  if (me) {
    document.getElementById('prof-edit-avatar').value = me.avatar || '👤';
    document.getElementById('prof-edit-ingame').value = me.ingameName || me.username;
    document.getElementById('prof-edit-steamhex').value = me.steamHex || '';
    document.getElementById('prof-edit-bio').value = me.bio || 'Competitive Custom Lobbies player.';
    document.getElementById('prof-edit-color').value = me.color || '#7c3aed';
    document.getElementById('prof-edit-color-hex').value = me.color || '#7c3aed';
    document.getElementById('prof-edit-role').value = me.role || 'Flex';

    // Update referrals widget values
    const refCodeEl = document.getElementById('sponsorship-ref-code');
    const refLinkEl = document.getElementById('sponsorship-ref-link');
    const refCountEl = document.getElementById('sponsorship-ref-count');
    const refEloEl = document.getElementById('sponsorship-ref-elo');

    if (refCodeEl) refCodeEl.innerText = `customlobbies.${me.username}`;
    if (refLinkEl) refLinkEl.value = `${window.location.origin}/?ref=customlobbies.${me.username}`;
    if (refCountEl) refCountEl.innerText = me.referralsCount || 0;
    if (refEloEl) refEloEl.innerText = `+${(me.referralsCount || 0) * 15} ELO`;
  }

  // Render profiles list of all players
  container.innerHTML = players.map(p => {
    const wCount = p.warnings ? p.warnings.length : 0;
    const wBadge = wCount >= 3 
      ? `<span style="font-size: 0.65rem; background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; position: absolute; top: 8px; right: 8px;">⚠️ SUSPENDED (${wCount} Warns)</span>`
      : wCount > 0
        ? `<span style="font-size: 0.65rem; background: #eab308; color: black; padding: 2px 6px; border-radius: 4px; font-weight: bold; position: absolute; top: 8px; right: 8px;">⚠️ WARNED (${wCount}/3)</span>`
        : '';
        
    let wReasonsHtml = '';
    if (wCount > 0) {
      wReasonsHtml = `
        <div style="font-size: 0.7rem; color: #f87171; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 4px; margin-top: 4px;">
          <strong>Warns:</strong> ${p.warnings.map(w => w.reason).join(', ')}
        </div>
      `;
    }

    const hasGoldTheme = p.unlockedRewards && p.unlockedRewards.includes('theme-gold');
    const hasGreenTheme = p.unlockedRewards && p.unlockedRewards.includes('theme-green');
    
    let cardStyle = `border: 1.5px solid ${p.color || '#7c3aed'}; background: var(--dc-bg-chat); box-shadow: 0 0 10px ${p.color || '#7c3aed'}22;`;
    if (hasGoldTheme) {
      cardStyle = `border: 1.5px solid #fbbf24; background: #0f1015; box-shadow: 0 0 15px rgba(251,191,36,0.35);`;
    } else if (hasGreenTheme) {
      cardStyle = `border: 1.5px solid #10b981; background: var(--dc-bg-chat); box-shadow: 0 0 15px rgba(16,185,129,0.35);`;
    }

    const hasVip = p.unlockedRewards && p.unlockedRewards.includes('badge-vip') ? '👑 ' : '';
    const hasChal = p.unlockedRewards && p.unlockedRewards.includes('badge-chal') ? '🚀 ' : '';

    return `
      <div class="db-card" style="padding: 12px; display: flex; flex-direction: column; gap: 8px; border-radius: 6px; position: relative; ${cardStyle}">
        ${wBadge}
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.5rem;">${p.avatar || '👤'}</span>
          <div>
            <div style="font-weight: bold; font-size: 0.9rem; color: white;">
              ${hasVip}${hasChal}${p.username}
              <span style="font-size: 0.65rem; background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 12px; margin-left: 6px; border: 1.5px solid var(--db-border); color: #c084fc;">
                ${p.role || 'Flex'}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--dc-text-muted);">In-game: <span style="color: #a78bfa;">${p.ingameName || p.username}</span></div>
            <div style="font-size: 0.65rem; color: var(--dc-text-muted); font-family: monospace;">Hex: <span style="color: #e9d5ff;">${p.steamHex || 'Not set'}</span></div>
          </div>
        </div>
        <div style="font-style: italic; font-size: 0.8rem; color: var(--dc-text-muted); border-top: 1px solid var(--db-border); padding-top: 6px; min-height: 38px;">
          "${p.bio || 'Competitive Custom Lobbies player.'}"
          ${wReasonsHtml}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: white; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px;">
          <span>🧜 Ark: <strong>${p.games.arkheron?.elo || 1000}</strong></span>
          <span>🔫 CS: <strong>${p.games.cs?.elo || 1000}</strong></span>
          <span>🛡️ Zea: <strong>${p.games.zealot?.elo || 1000}</strong></span>
        </div>
      </div>
    `;
  }).join('');
}

function saveUserProfile() {
  const avatarInput = document.getElementById('prof-edit-avatar').value.trim();
  const bioInput = document.getElementById('prof-edit-bio').value.trim();
  const ingameInput = document.getElementById('prof-edit-ingame').value.trim();
  const steamHexInput = document.getElementById('prof-edit-steamhex').value.trim();
  const colorInput = document.getElementById('prof-edit-color').value.trim();
  const roleInput = document.getElementById('prof-edit-role').value;

  const me = players.find(p => p.username === appState.currentUser);
  if (me) {
    if (steamHexInput) {
      const cleanHex = steamHexInput.replace(/^steam:/i, '').toLowerCase();
      if (!/^1100001[0-9a-f]{8}$/i.test(cleanHex)) {
        showToast("Invalid Steam Hex format! Must be a 15-char hex starting with 1100001.", "warning");
        return;
      }
      me.steamHex = cleanHex;
    } else {
      me.steamHex = '';
    }

    me.avatar = avatarInput || '👤';
    me.bio = bioInput || 'Competitive Custom Lobbies player.';
    me.ingameName = ingameInput || me.username;
    me.color = colorInput || '#7c3aed';
    me.role = roleInput || 'Flex';
    
    // Sync current user's profile inside client
    renderProfilesTab();
    updateVoiceChannelsUI();
    showToast("Profile changes saved!", "success");
  }
}

// ==========================================
// TOURNAMENTS SECTION LOGIC
// ==========================================

function getActiveTournament() {
  if (!appState.activeTournamentId && appState.tournaments.length > 0) {
    appState.activeTournamentId = appState.tournaments[appState.tournaments.length - 1].id;
  }
  return appState.tournaments.find(t => t.id === appState.activeTournamentId);
}

function selectTournament(id) {
  appState.activeTournamentId = id;
  renderTournamentsTab();
}

function getPlayerSalary(username, game) {
  const pl = players.find(p => p.username === username);
  const elo = pl?.games[game]?.elo || 1000;
  // 1000 ELO -> 30 credits, 1200 ELO -> 50 credits, 800 ELO -> 10 credits
  return Math.round(10 + Math.max(0, (elo - 800) / 10));
}

function initCustomTournament() {
  const game = document.getElementById('tourney-select-game').value;
  const type = document.getElementById('tourney-select-type').value;
  const numTeams = parseInt(document.getElementById('tourney-select-teams').value, 10) || 2;
  const useSalaries = document.getElementById('tourney-use-salaries').checked;

  const newTourn = {
    id: 'TOURN-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    name: 'Community Open Cup',
    game,
    type,
    numTeams,
    useSalaries,
    status: 'signup',
    pool: [],
    checkedIn: [],
    captains: [],
    budgets: {},
    teams: {},
    nominationTurn: '',
    currentBidding: { player: null, highestBidder: null, highestBid: 0 },
    matches: []
  };

  appState.tournaments.push(newTourn);
  appState.activeTournamentId = newTourn.id;

  if (typeof calendarEvents !== 'undefined') {
    calendarEvents.push({
      id: 'EV-TOUR-' + newTourn.id,
      name: `🏆 Tournament: ${newTourn.name}`,
      game: newTourn.game,
      isTournament: true,
      date: new Date().toISOString().split('T')[0]
    });
    saveCalendarEvents();
    if (appState.currentTab === 'calendar') {
      renderCalendar();
    }
  }

  showToast(`Tournament created for ${game.toUpperCase()}!`, 'success');
  renderTournamentsTab();
}

function registerTourneyUser(username) {
  const t = getActiveTournament();
  if (!t || t.status !== 'signup') return;
  if (t.pool.includes(username)) {
    showToast("Player already registered!", "warning");
    return;
  }
  t.pool.push(username);
  // Auto check-in if not monthly, or if user is registering themselves
  if (!t.isMonthly || username === appState.currentUser) {
    t.checkedIn = t.checkedIn || [];
    t.checkedIn.push(username);
  }
  showToast(`${username} registered for the cup!`, "success");
  renderTournamentsTab();
}

function checkInTourneyUser(username) {
  const t = getActiveTournament();
  if (!t || t.status !== 'signup') return;
  if (!t.pool.includes(username)) {
    showToast("Must be registered in the tournament first!", "warning");
    return;
  }
  t.checkedIn = t.checkedIn || [];
  if (t.checkedIn.includes(username)) {
    showToast("Already checked in!", "warning");
    return;
  }
  t.checkedIn.push(username);
  playSound('join'); // Play feedback chime
  showToast(`${username} checked in successfully!`, "success");
  renderTournamentsTab();
}

function addMockSignups() {
  const t = getActiveTournament();
  if (!t) return;

  // Make sure mock players exist in the main database
  MOCK_PLAYERS_POOL.forEach(mp => {
    if (!players.find(p => p.username === mp.username)) {
      players.push(JSON.parse(JSON.stringify(mp))); // clone it
    }
  });

  const numTeams = t.numTeams || 2;
  const playersPerTeam = t.game === 'cs' ? 5 : 3;
  const requiredPlayers = numTeams * playersPerTeam;

  players.forEach(p => {
    if (t.pool.length < requiredPlayers && !t.pool.includes(p.username)) {
      t.pool.push(p.username);
      
      // If monthly cup, auto check-in some mock players (80% chance) to simulate check-in requirements
      if (t.isMonthly) {
        t.checkedIn = t.checkedIn || [];
        if (Math.random() > 0.20) {
          t.checkedIn.push(p.username);
        }
      } else {
        t.checkedIn = t.checkedIn || [];
        t.checkedIn.push(p.username);
      }
    }
  });
  showToast("Mock players added to signup pool!", "info");
  renderTournamentsTab();
}

function startTourneyDraft() {
  const t = getActiveTournament();
  if (!t) return;

  if (t.isMonthly) {
    t.checkedIn = t.checkedIn || [];
    const removedCount = t.pool.length - t.pool.filter(pName => t.checkedIn.includes(pName)).length;
    t.pool = t.pool.filter(pName => t.checkedIn.includes(pName));
    if (removedCount > 0) {
      showToast(`Removed ${removedCount} unchecked players from the draft pool!`, "warning");
    }
  }

  const numTeams = t.numTeams || 2;
  const playersPerTeam = t.game === 'cs' ? 5 : 3;
  const requiredPlayers = numTeams * playersPerTeam;

  if (t.pool.length < requiredPlayers) {
    showToast(`Need at least ${requiredPlayers} checked-in players to start draft!`, "warning");
    return;
  }

  const game = t.game;
  const sorted = [...t.pool].map(pName => {
    const pl = players.find(p => p.username === pName);
    return { name: pName, elo: pl?.games[game]?.elo || 1000 };
  }).sort((a, b) => b.elo - a.elo);

  const captains = sorted.slice(0, numTeams).map(p => p.name);
  t.captains = captains;

  t.teams = {};
  t.budgets = {};
  captains.forEach(capName => {
    t.teams[capName] = [capName];
    t.budgets[capName] = 100;
  });

  t.pool = sorted.slice(numTeams).map(p => p.name);
  t.status = 'draft';

  if (t.type === 'snake') {
    const seq = [];
    const rounds = playersPerTeam - 1;
    for (let r = 0; r < rounds; r++) {
      if (r % 2 === 0) {
        for (let i = numTeams - 1; i >= 0; i--) {
          seq.push(captains[i]);
        }
      } else {
        for (let i = 0; i < numTeams; i++) {
          seq.push(captains[i]);
        }
      }
    }
    t.pickSequence = seq;
    t.pickIdx = 0;
    t.turn = seq[0];
  } else {
    t.nominationTurn = captains[0];
    t.currentBidding = { player: null, highestBidder: null, highestBid: 0 };
  }

  playSound('match_found'); // Play sonar start chime
  showToast(`Tournament draft with ${numTeams} teams has begun!`, "success");
  renderTournamentsTab();

  checkBotTourneyPick();
}

function pickTourneySnakePlayer(player) {
  const t = getActiveTournament();
  if (!t || t.status !== 'draft' || t.type !== 'snake') return;

  const currentCap = t.turn;
  t.teams[currentCap].push(player);
  t.pool = t.pool.filter(p => p !== player);

  playSound('pick');

  t.pickIdx++;
  if (t.pickIdx < t.pickSequence.length) {
    t.turn = t.pickSequence[t.pickIdx];
    checkBotTourneyPick();
  } else {
    resolveTourneyMatches();
  }
  renderTournamentsTab();
}

function buyTourneySalaryPlayer(player) {
  const t = getActiveTournament();
  if (!t || t.status !== 'draft' || t.type !== 'auction' || !t.useSalaries) return;

  const buyer = t.nominationTurn;
  const salary = getPlayerSalary(player, t.game);

  if (t.budgets[buyer] < salary) {
    showToast(`Insufficient budget! Cost: ${salary}, Budget: ${t.budgets[buyer]}`, "warning");
    return;
  }

  t.teams[buyer].push(player);
  t.budgets[buyer] -= salary;
  t.pool = t.pool.filter(p => p !== player);

  playSound('pick');
  showToast(`Purchased ${player} for ${salary} credits!`, "success");

  const targetSize = t.game === 'cs' ? 5 : 3;
  const allTeamsFilled = t.captains.every(cap => t.teams[cap].length === targetSize);

  if (allTeamsFilled) {
    resolveTourneyMatches();
  } else {
    const currentIdx = t.captains.indexOf(t.nominationTurn);
    let nextCap = null;
    for (let i = 1; i <= t.captains.length; i++) {
      const candidate = t.captains[(currentIdx + i) % t.captains.length];
      if (t.teams[candidate].length < targetSize) {
        nextCap = candidate;
        break;
      }
    }
    t.nominationTurn = nextCap || t.captains[0];
    checkBotTourneyPick();
  }
  renderTournamentsTab();
}

function nominateTourneyPlayer(player) {
  const t = getActiveTournament();
  if (!t || t.status !== 'draft' || t.type !== 'auction') return;
  if (t.currentBidding.player) return;

  t.currentBidding = {
    player,
    highestBidder: t.nominationTurn,
    highestBid: 1
  };
  showToast(`${player} nominated onto the block!`, "info");
  renderTournamentsTab();
  
  checkBotTourneyPick();
}

function bidTourneyPlayer(cap, amount) {
  const t = getActiveTournament();
  if (!t || !t.currentBidding.player) return;

  if (amount <= t.currentBidding.highestBid) {
    showToast("Bid must exceed the current highest bid!", "warning");
    return;
  }
  if (amount > t.budgets[cap]) {
    showToast(`Insufficient budget! Remainder: ${t.budgets[cap]}`, "warning");
    return;
  }

  t.currentBidding.highestBid = amount;
  t.currentBidding.highestBidder = cap;
  showToast(`${cap} bid ${amount} credits!`, "success");
  renderTournamentsTab();

  checkBotTourneyPick();
}

function sellTourneyPlayer() {
  const t = getActiveTournament();
  if (!t || !t.currentBidding.player) return;

  const player = t.currentBidding.player;
  const winner = t.currentBidding.highestBidder;
  const cost = t.currentBidding.highestBid;

  t.teams[winner].push(player);
  t.budgets[winner] -= cost;
  t.pool = t.pool.filter(p => p !== player);

  playSound('pick');
  showToast(`SOLD! ${player} goes to Team ${winner} for ${cost} pts!`, "success");
  t.currentBidding = { player: null, highestBidder: null, highestBid: 0 };

  const targetSize = t.game === 'cs' ? 5 : 3;
  const allTeamsFilled = t.captains.every(cap => t.teams[cap].length === targetSize);

  if (allTeamsFilled) {
    resolveTourneyMatches();
  } else {
    const currentIdx = t.captains.indexOf(t.nominationTurn);
    let nextCap = null;
    for (let i = 1; i <= t.captains.length; i++) {
      const candidate = t.captains[(currentIdx + i) % t.captains.length];
      if (t.teams[candidate].length < targetSize) {
        nextCap = candidate;
        break;
      }
    }
    t.nominationTurn = nextCap || t.captains[0];
    checkBotTourneyPick();
  }
  renderTournamentsTab();
}

function checkBotTourneyPick() {
  const t = getActiveTournament();
  if (!t || t.status !== 'draft') return;
  
  let activeCapName = '';
  if (t.type === 'snake') {
    activeCapName = t.turn;
  } else {
    activeCapName = t.nominationTurn;
  }
  
  if (activeCapName && activeCapName !== appState.currentUser) {
    setTimeout(() => {
      const t = getActiveTournament();
      if (!t || t.status !== 'draft') return;
      
      if (t.type === 'snake') {
        const pool = t.pool;
        if (pool.length > 0) {
          const randomPlayer = pool[Math.floor(Math.random() * pool.length)];
          pickTourneySnakePlayer(randomPlayer);
        }
      } else if (t.type === 'auction') {
        if (t.useSalaries) {
          const buyer = t.nominationTurn;
          const affordable = t.pool.filter(p => getPlayerSalary(p, t.game) <= t.budgets[buyer]);
          if (affordable.length > 0) {
            affordable.sort((a, b) => getPlayerSalary(b, t.game) - getPlayerSalary(a, t.game));
            buyTourneySalaryPlayer(affordable[0]);
          } else {
            const sortedPool = [...t.pool].sort((a, b) => getPlayerSalary(a, t.game) - getPlayerSalary(b, t.game));
            if (sortedPool.length > 0) {
              buyTourneySalaryPlayer(sortedPool[0]);
            }
          }
        } else {
          if (!t.currentBidding.player) {
            const randomPlayer = t.pool[Math.floor(Math.random() * t.pool.length)];
            if (randomPlayer) nominateTourneyPlayer(randomPlayer);
          } else {
            const block = t.currentBidding;
            const targetSize = t.game === 'cs' ? 5 : 3;
            const potentialBidders = t.captains.filter(c => 
              c !== block.highestBidder && 
              c !== appState.currentUser && 
              t.teams[c].length < targetSize &&
              t.budgets[c] > block.highestBid
            );
            
            if (potentialBidders.length > 0 && Math.random() > 0.40) {
              const bidder = potentialBidders[Math.floor(Math.random() * potentialBidders.length)];
              const nextBid = block.highestBid + Math.floor(Math.random() * 6) + 1;
              if (nextBid <= t.budgets[bidder]) {
                bidTourneyPlayer(bidder, nextBid);
                return;
              }
            }
            setTimeout(sellTourneyPlayer, 800);
          }
        }
      }
    }, 1500);
  }
}

function resolveTourneyMatches() {
  const t = getActiveTournament();
  if (!t) return;
  t.status = 'progress';
  showToast("Running simulated brackets...", "info");

  setTimeout(() => {
    const matches = [];
    let currentTeams = [...t.captains];
    
    while (currentTeams.length > 1) {
      const nextRoundTeams = [];
      const numMatches = Math.floor(currentTeams.length / 2);
      let roundLabel = currentTeams.length <= 2 ? 'Finals' : (currentTeams.length <= 4 ? 'Semifinals' : (currentTeams.length <= 8 ? 'Quarterfinals' : 'Round of 16'));
      
      for (let i = 0; i < numMatches; i++) {
        const teamA = currentTeams[i * 2];
        const teamB = currentTeams[i * 2 + 1];
        const scoreA = Math.floor(Math.random() * 3) + 3; // 3 to 5
        const scoreB = scoreA === 5 ? Math.floor(Math.random() * 4) + 1 : 5; // 5 vs random
        
        matches.push({
          round: roundLabel,
          teamA: `Team ${teamA}`,
          teamB: `Team ${teamB}`,
          scoreA,
          scoreB
        });
        
        const winner = scoreA > scoreB ? teamA : teamB;
        const loser = scoreA > scoreB ? teamB : teamA;
        
        t.teams[winner].forEach(name => {
          const pl = players.find(p => p.username === name);
          if (pl?.games[t.game]) {
            pl.games[t.game].elo += 25; // Win increment
            pl.games[t.game].wins++;
          }
        });
        
        t.teams[loser].forEach(name => {
          const pl = players.find(p => p.username === name);
          if (pl?.games[t.game]) {
            pl.games[t.game].elo = Math.max(800, pl.games[t.game].elo - 15);
            pl.games[t.game].losses++;
          }
        });
        
        nextRoundTeams.push(winner);
      }
      
      if (currentTeams.length % 2 !== 0) {
        const byeTeam = currentTeams[currentTeams.length - 1];
        nextRoundTeams.push(byeTeam);
        matches.push({
          round: roundLabel,
          teamA: `Team ${byeTeam}`,
          teamB: 'BYE',
          scoreA: 1,
          scoreB: 0
        });
      }
      
      currentTeams = nextRoundTeams;
    }
    
    const champion = currentTeams[0];
    t.teams[champion].forEach(name => {
      const pl = players.find(p => p.username === name);
      if (pl?.games[t.game]) {
        pl.games[t.game].elo += 25; // Extra champ reward
      }
    });

    t.matches = matches;
    t.status = 'complete';
    showToast(`Tournament Complete! Team ${champion} wins the Cup!`, "success");
    renderLeaderboard();
    renderTournamentsTab();
  }, 2500);
}

function scheduleMonthlyCup() {
  const game = document.getElementById('tourney-select-game').value;
  const type = document.getElementById('tourney-select-type').value;
  const numTeams = parseInt(document.getElementById('tourney-select-teams').value, 10) || 8;
  const useSalaries = document.getElementById('tourney-use-salaries').checked;

  // Set the tournament time to next Saturday at 8:00 PM EST
  const today = new Date();
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
  nextSaturday.setHours(20, 0, 0, 0); // 8:00 PM
  
  const dateOptions = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
  const startTimeStr = nextSaturday.toLocaleDateString('en-US', dateOptions) + ' at 8:00 PM EST';

  const newTourn = {
    id: 'TOURN-MONTHLY',
    name: '🏆 Monthly League Championship 🏆',
    game,
    type,
    numTeams,
    useSalaries,
    status: 'signup',
    isMonthly: true,
    startTime: startTimeStr,
    checkInStartTime: '7:50 PM EST',
    pool: [appState.currentUser], // User starts in the pool
    checkedIn: [appState.currentUser], // User starts checked in
    captains: [],
    budgets: {},
    teams: {},
    nominationTurn: '',
    currentBidding: { player: null, highestBidder: null, highestBid: 0 },
    matches: []
  };

  // Remove existing monthly tournament if any, so only one is active at a time
  appState.tournaments = appState.tournaments.filter(t => t.id !== 'TOURN-MONTHLY');

  appState.tournaments.push(newTourn);
  appState.activeTournamentId = newTourn.id;

  playSound('match_found');
  showToast("Monthly League Championship scheduled!", "success");
  renderTournamentsTab();
}

function renderTournamentsTab() {
  const t = getActiveTournament();
  const listContainer = document.getElementById('tourney-list-cards');
  const content = document.getElementById('tourney-panel-content');
  const displayName = document.getElementById('tourney-display-name');
  const displayStatus = document.getElementById('tourney-display-status');
  const signupActions = document.getElementById('tourney-signup-actions');

  if (listContainer) {
    if (appState.tournaments.length === 0) {
      listContainer.innerHTML = `<div style="color:var(--dc-text-muted); font-size:0.75rem; text-align:center; padding: 16px 0;">No active tournaments. Create one on the left!</div>`;
    } else {
      listContainer.innerHTML = appState.tournaments.map(tourn => {
        const isActive = (t && t.id === tourn.id) ? 'border: 1.5px solid var(--dc-text-link); background: rgba(124,58,237,0.1);' : 'border: 1px solid var(--db-border);';
        const statusColor = tourn.status === 'signup' ? '#10b981' : (tourn.status === 'draft' ? '#8b5cf6' : '#94a3b8');
        return `
          <div onclick="selectTournament('${tourn.id}')" style="padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; ${isActive}">
            <div style="font-size: 0.85rem; font-weight: bold; color: white; display: flex; justify-content: space-between;">
              <span>${tourn.name}</span>
              <span style="font-size: 0.7rem; color: ${statusColor};">${tourn.status.toUpperCase()}</span>
            </div>
            <div style="font-size: 0.7rem; color: var(--dc-text-muted);">Game: ${tourn.game.toUpperCase()} • Type: ${tourn.type.toUpperCase()}</div>
          </div>
        `;
      }).join('');
    }
  }

  if (!t) {
    displayName.textContent = 'No Active Tournament';
    displayStatus.textContent = 'INACTIVE';
    displayStatus.style.background = 'var(--dc-bg-sidebar)';
    displayStatus.style.color = 'var(--dc-text-muted)';
    signupActions.innerHTML = '';
    content.innerHTML = `
      <div style="text-align: center; color: var(--dc-text-muted); padding: 60px 0;">
        <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🏆</span>
        Select a tournament from the hub, or configure a custom brackets cup / schedule a Monthly Cup on the left.
      </div>
    `;
    return;
  }

  displayName.textContent = t.name;
  displayStatus.textContent = t.status.toUpperCase();
  displayStatus.style.color = 'white';

  if (t.status === 'signup') {
    displayStatus.style.background = '#10b981';
    
    const isUserRegistered = t.pool.includes(appState.currentUser);
    const isUserCheckedIn = t.checkedIn && t.checkedIn.includes(appState.currentUser);
    
    let checkInBtn = '';
    if (t.isMonthly && isUserRegistered && !isUserCheckedIn) {
      checkInBtn = `<button class="btn btn-secondary" onclick="checkInTourneyUser('${appState.currentUser}')" style="background:#23a55a; border-color:#23a55a; color:white;">✅ Check In</button>`;
    }

    signupActions.innerHTML = `
      <button class="btn btn-secondary" onclick="registerTourneyUser('${appState.currentUser}')" ${isUserRegistered ? 'disabled' : ''}>Join Pool</button>
      ${checkInBtn}
      <button class="btn btn-secondary" onclick="addMockSignups()">Add Mock Players</button>
      <button class="btn btn-primary" onclick="startTourneyDraft()">Start Draft</button>
    `;

    const listHtml = t.pool.map((p, idx) => {
      const isChecked = t.checkedIn && t.checkedIn.includes(p);
      const statusBadge = t.isMonthly 
        ? isChecked 
          ? `<span style="font-size:0.65rem; color:#10b981; font-weight:bold; background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:4px; display:inline-block; width:fit-content;">🟢 Checked In</span>`
          : `<span style="font-size:0.65rem; color:#ef4444; font-weight:bold; background:rgba(239,68,68,0.1); padding:2px 6px; border-radius:4px; display:inline-block; width:fit-content;">🔴 Pending</span>`
        : '';

      return `
        <div style="padding: 10px; border-radius: 4px; background: rgba(255,255,255,0.03); border: 1px solid var(--db-border); display: flex; justify-content: space-between; align-items: center;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <span style="font-weight: bold; color: white;">${idx+1}. ${p}</span>
            ${statusBadge}
          </div>
          <span style="font-size: 0.8rem; color: var(--dc-text-muted);">MMR: ${players.find(pl => pl.username === p)?.games[t.game]?.elo || 1000}</span>
        </div>
      `;
    }).join('') || '<div style="color:var(--dc-text-muted); font-size:0.9rem; text-align:center;">No players registered. Click Join Pool or Add Mock Players!</div>';

    let monthlyNoticeHtml = '';
    if (t.isMonthly) {
      monthlyNoticeHtml = `
        <div class="db-card" style="padding: 14px; background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.12); border-left: 4px solid #ef4444; margin-bottom: 20px; display:flex; flex-direction:column; gap:6px;">
          <div style="font-weight:bold; color:white; font-size:0.9rem; display:flex; align-items:center; gap:6px;">
            <span>📅 Scheduled Start:</span> <span style="color:#f43f5e;">${t.startTime}</span>
          </div>
          <p style="font-size:0.75rem; color:var(--dc-text-muted); line-height:1.45;">
            <strong>⚠️ CHECK-IN REQUIREMENT:</strong> All players must check in at least <strong>10 minutes before the draft starts</strong> (by <strong>7:50 PM EST</strong>). Players who have not checked in will be removed from the selection pool once drafting commences.
          </p>
        </div>
      `;
    }

    content.innerHTML = `
      <div>
        ${monthlyNoticeHtml}
        <div style="font-weight: bold; color: white; margin-bottom: 8px; font-size: 1rem;">👥 Registered Entrants (${t.pool.length})</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; margin-top: 12px;">
          ${listHtml}
        </div>
      </div>
    `;
  } 
  else if (t.status === 'draft') {
    displayStatus.style.background = '#8b5cf6';
    signupActions.innerHTML = '';

    if (t.type === 'snake') {
      const activeCap = t.turn;
      const listHtml = t.pool.map(pName => {
        const pl = players.find(p => p.username === pName);
        const elo = pl?.games[t.game]?.elo || 1000;
        return `
          <div style="padding: 10px; border-radius: 6px; background: var(--dc-bg-chat); border: 1px solid var(--db-border); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; color: white; font-size: 0.9rem;">${pName}</div>
              <div style="font-size: 0.75rem; color: var(--dc-text-muted);">MMR: ${elo}</div>
            </div>
            <button class="btn btn-primary" onclick="pickTourneySnakePlayer('${pName}')" ${appState.currentUser === activeCap ? '' : 'disabled'} style="font-size: 0.75rem; padding: 4px 8px;">Pick</button>
          </div>
        `;
      }).join('');

      const teamsHtml = t.captains.map((cap, cIdx) => {
        const teamColor = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f43f5e', '#6366f1', '#06b6d4', '#84cc16', '#eab308', '#a855f7', '#d946ef', '#0ea5e9'][cIdx % 15];
        return `
          <div class="db-card" style="padding: 10px; background: rgba(0,0,0,0.15); border-top: 3px solid ${teamColor};">
            <div style="font-weight: bold; color: ${teamColor}; font-size: 0.85rem; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Team ${cap}</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${t.teams[cap].map(p => `<div style="font-size:0.75rem; font-weight:bold; color:white;">• ${p}</div>`).join('')}
            </div>
          </div>
        `;
      }).join('');

      content.innerHTML = `
        <div style="text-align: center; font-weight: bold; color: #a78bfa; margin-bottom: 12px; font-size: 1.05rem;">
          🎯 Turn: Captain **${activeCap}** is picking!
        </div>
        <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start;">
          <!-- Teams Grid -->
          <div>
            <div style="font-weight: bold; color: white; margin-bottom: 8px; font-size: 0.9rem;">Rosters</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
              ${teamsHtml}
            </div>
          </div>
          <!-- Selection Pool -->
          <div>
            <div style="font-weight: bold; color: white; margin-bottom: 8px; font-size: 0.9rem;">👥 Players Selection Pool (${t.pool.length})</div>
            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto;">
              ${listHtml}
            </div>
          </div>
        </div>
      `;
    } 
    else if (t.type === 'auction') {
      const activeBid = t.currentBidding;
      let mainWorkspaceHtml = '';
      let poolHtml = '';
      
      if (t.useSalaries) {
        poolHtml = t.pool.map(pName => {
          const pl = players.find(p => p.username === pName);
          const elo = pl?.games[t.game]?.elo || 1000;
          const salary = getPlayerSalary(pName, t.game);
          return `
            <div style="padding: 8px 12px; border-radius: 4px; background: var(--dc-bg-chat); border: 1px solid var(--db-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold; color: white; font-size: 0.85rem;">${pName}</div>
                <div style="font-size: 0.75rem; color: var(--dc-text-muted);">MMR: ${elo} • Salary: <strong style="color:#fbbf24;">${salary}</strong> pts</div>
              </div>
              <button class="btn btn-primary" onclick="buyTourneySalaryPlayer('${pName}')" ${appState.currentUser === t.nominationTurn ? '' : 'disabled'} style="font-size: 0.75rem; padding: 4px 8px;">Buy [${salary} pts]</button>
            </div>
          `;
        }).join('');

        mainWorkspaceHtml = `
          <div class="db-card" style="padding: 16px; background: rgba(16,185,129,0.04); border: 1.5px solid #10b981; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 0.75rem; color: #10b981; font-weight: bold; margin-bottom: 4px;">SALARY CAP DRAFT ACTIVE</div>
            <div style="font-size: 1.25rem; font-weight: bold; color: white; margin-bottom: 4px;">
              Captain <span style="color:#a78bfa;">${t.nominationTurn}</span>'s Turn to Buy
            </div>
            <div style="font-size: 0.75rem; color: var(--dc-text-muted);">Select any player from the pool below to purchase them at their MMR salary price.</div>
          </div>
          <div>
            <div style="font-weight: bold; color: white; margin-bottom: 6px; font-size: 0.9rem;">👥 Players Selection Pool (${t.pool.length})</div>
            <div style="display: flex; flex-direction: column; gap: 6px; max-height: 360px; overflow-y: auto;">
              ${poolHtml}
            </div>
          </div>
        `;
      } else {
        const onBlockHtml = activeBid.player ? `
          <div class="db-card" style="padding: 16px; background: rgba(245,158,11,0.05); border: 1.5px solid #f59e0b; text-align: center;">
            <div style="font-size: 0.75rem; color: #f59e0b; font-weight: bold; margin-bottom: 4px;">ON THE BIDDING BLOCK</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 4px;">${activeBid.player}</div>
            <div style="font-size: 0.8rem; color: var(--dc-text-muted); margin-bottom: 12px;">MMR: ${players.find(pl => pl.username === activeBid.player)?.games[t.game]?.elo || 1000}</div>
            
            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 12px;">
              <div>
                <span style="display: block; font-size: 0.7rem; color: var(--dc-text-muted);">CURRENT BID</span>
                <strong style="font-size: 1.2rem; color: #fbbf24;">${activeBid.highestBid} Credits</strong>
              </div>
              <div>
                <span style="display: block; font-size: 0.7rem; color: var(--dc-text-muted);">HIGHEST BIDDER</span>
                <strong style="font-size: 1.2rem; color: white;">${activeBid.highestBidder}</strong>
              </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 8px;">
              <input type="number" id="tourney-bid-input" value="${activeBid.highestBid + 5}" style="width: 80px; padding: 6px; border-radius: 4px; border: 1px solid var(--db-border); background: var(--db-bg); color: white; text-align: center;">
              <button class="btn btn-primary" onclick="bidTourneyPlayer('${appState.currentUser}', parseInt(document.getElementById('tourney-bid-input').value))" ${t.captains.includes(appState.currentUser) ? '' : 'disabled'}>Place Bid</button>
              <button class="btn btn-secondary" onclick="sellTourneyPlayer()">Hammer Sold</button>
            </div>
          </div>
        ` : `
          <div style="border: 1px dashed var(--db-border); border-radius: 6px; padding: 30px; text-align: center; color: var(--dc-text-muted);">
            Waiting for Captain <strong>${t.nominationTurn}</strong> to nominate a player.
          </div>
        `;

        poolHtml = t.pool.map(pName => {
          const pl = players.find(p => p.username === pName);
          const elo = pl?.games[t.game]?.elo || 1000;
          return `
            <div style="padding: 8px 12px; border-radius: 4px; background: var(--dc-bg-chat); border: 1px solid var(--db-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold; color: white; font-size: 0.85rem;">${pName}</div>
                <div style="font-size: 0.75rem; color: var(--dc-text-muted);">MMR: ${elo}</div>
              </div>
              <button class="btn btn-secondary" onclick="nominateTourneyPlayer('${pName}')" ${appState.currentUser === t.nominationTurn && !activeBid.player ? '' : 'disabled'} style="font-size: 0.75rem; padding: 4px 8px;">Nominate</button>
            </div>
          `;
        }).join('');

        mainWorkspaceHtml = `
          ${onBlockHtml}
          <div>
            <div style="font-weight: bold; color: white; margin-bottom: 6px; font-size: 0.9rem;">👥 Players Selection Pool (${t.pool.length})</div>
            <div style="display: flex; flex-direction: column; gap: 6px; max-height: 250px; overflow-y: auto;">
              ${poolHtml}
            </div>
          </div>
        `;
      }

      const teamsHtml = t.captains.map((cap, cIdx) => {
        const teamColor = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f43f5e', '#6366f1', '#06b6d4', '#84cc16', '#eab308', '#a855f7', '#d946ef', '#0ea5e9'][cIdx % 15];
        return `
          <div class="db-card" style="padding: 10px; background: rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 8px; border-top: 3px solid ${teamColor};">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--db-border); padding-bottom: 4px;">
              <span style="font-weight: bold; color: ${teamColor}; font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px;">Team ${cap}</span>
              <strong style="color: white; font-size: 0.8rem;">${t.budgets[cap]}</strong>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${t.teams[cap].map(p => `<div style="font-size:0.75rem; font-weight:bold; color:white;">• ${p}</div>`).join('')}
            </div>
          </div>
        `;
      }).join('');

      content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start;">
          <!-- Bidding or Purchasing block -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${mainWorkspaceHtml}
          </div>

          <!-- Rosters & Budgets -->
          <div>
            <div style="font-weight: bold; color: white; margin-bottom: 8px; font-size: 0.9rem;">Budgets & Rosters</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
              ${teamsHtml}
            </div>
          </div>
        </div>
      `;
    }
  }
}

// ==========================================
// COMMUNITY FORUMS LOGIC
// ==========================================

function submitForumPost() {
  const titleInput = document.getElementById('forum-title-input');
  const catSelect = document.getElementById('forum-category-input');
  const contentInput = document.getElementById('forum-content-input');

  const title = titleInput.value.trim();
  const category = catSelect.value;
  const content = contentInput.value.trim();

  if (!title || !content) {
    showToast("Please fill in both the title and message!", "warning");
    return;
  }

  const newPost = {
    id: 'POST-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    author: appState.currentUser,
    title,
    content,
    category,
    createdAt: new Date().toISOString()
  };

  appState.forumPosts.push(newPost);
  localStorage.setItem('custom_lobbies_forum_posts', JSON.stringify(appState.forumPosts));
  
  titleInput.value = '';
  contentInput.value = '';

  showToast("Forum post published!", "success");
  renderForumsTab();
}

function filterForumCategory(category) {
  appState.forumFilter = category;
  renderForumsTab();
}

function navigateToAuthorProfile(authorName) {
  const user = players.find(p => p.username === authorName);
  if (user) {
    switchTab('profiles');
    
    setTimeout(() => {
      const cards = document.getElementById('profiles-list-container').children;
      for (let card of cards) {
        if (card.innerHTML.includes(authorName)) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.transform = 'scale(1.05)';
          card.style.transition = 'all 0.3s ease';
          setTimeout(() => { card.style.transform = 'scale(1)'; }, 1500);
          break;
        }
      }
    }, 150);
  }
}

function renderForumsTab() {
  const feedContainer = document.getElementById('forum-posts-feed-container');
  if (!feedContainer) return;

  const filter = appState.forumFilter;
  const filteredPosts = appState.forumPosts.filter(p => filter === 'all' || p.category === filter);

  const sorted = [...filteredPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (sorted.length === 0) {
    feedContainer.innerHTML = `
      <div style="text-align: center; color: var(--dc-text-muted); padding: 40px 0;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">📡</span>
        No posts inside this category. Be the first to start a discussion!
      </div>
    `;
    return;
  }

  feedContainer.innerHTML = sorted.map(post => {
    const author = players.find(p => p.username === post.author) || {
      username: post.author,
      avatar: '👤',
      color: '#7c3aed',
      games: { arkheron: { elo: 1000 }, cs: { elo: 1000 }, zealot: { elo: 1000 } }
    };

    const dateStr = new Date(post.createdAt).toLocaleDateString() + ' ' + new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const arkElo = author.games.arkheron?.elo || 1000;
    const csElo = author.games.cs?.elo || 1000;
    const zealElo = author.games.zealot?.elo || 1000;
    const avgElo = Math.round((arkElo + csElo + zealElo) / 3);

    return `
      <div class="db-card" style="padding: 16px; border-left: 4px solid ${author.color || '#7c3aed'}; background: var(--dc-bg-sidebar); display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.5rem;">${author.avatar || '👤'}</span>
            <div>
              <div onclick="navigateToAuthorProfile('${author.username}')" style="font-weight: bold; color: white; cursor: pointer; text-decoration: underline; font-size: 0.95rem;">
                ${author.username}
              </div>
              <div style="font-size: 0.75rem; color: var(--dc-text-muted);">Avg MMR: <strong style="color: #a78bfa;">${avgElo}</strong> • Posted on ${dateStr}</div>
            </div>
          </div>
          <span style="font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 12px; border: 1px solid var(--db-border); color: white;">
            #${post.category.toUpperCase()}
          </span>
        </div>
        <div style="font-weight: bold; font-size: 1.1rem; color: white; margin-top: 4px;">
          ${post.title}
        </div>
        <div style="font-size: 0.85rem; color: var(--dc-text-muted); line-height: 1.5; white-space: pre-wrap;">
          ${post.content}
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// LIVE STREAM ADVERTISEMENT LOGIC
// ==========================================

function toggleAdvertiseForm() {
  const form = document.getElementById('advertise-stream-form');
  if (!form) return;
  const isHidden = form.style.display === 'none';
  form.style.display = isHidden ? 'block' : 'none';
  
  if (isHidden) {
    document.getElementById('stream-author-input').value = appState.currentUser;
    document.getElementById('stream-platform-input').value = 'twitch';
    let defaultUrl = 'https://twitch.tv/' + appState.currentUser.toLowerCase().replace('.', '');
    if (appState.currentUser.toLowerCase().includes('rester')) {
      defaultUrl = 'https://twitch.tv/resteral';
    }
    document.getElementById('stream-url-input').value = defaultUrl;
    document.getElementById('stream-title-input').value = '🔴 Playing custom lobbies matchmaking scrims! Join in!';
  }
}

function submitStreamAd() {
  const author = document.getElementById('stream-author-input').value.trim();
  const platform = document.getElementById('stream-platform-input').value;
  const url = document.getElementById('stream-url-input').value.trim();
  const title = document.getElementById('stream-title-input').value.trim() || 'Live Match Playroom Scrims!';
  
  if (!author || !url) {
    showToast("Please fill in the streamer name and URL!", "warning");
    return;
  }

  let finalUrl = url;
  if (author.toLowerCase().includes('rester') || url.toLowerCase().includes('resteraltv')) {
    finalUrl = 'https://twitch.tv/resteral';
  }
  
  const newAd = {
    id: 'STREAM-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    author,
    platform,
    url: finalUrl,
    title,
    isLive: true
  };
  
  appState.advertisedStreams = appState.advertisedStreams || [];
  // Keep only unique streamers
  appState.advertisedStreams = appState.advertisedStreams.filter(s => s.author.toLowerCase() !== author.toLowerCase());
  appState.advertisedStreams.push(newAd);
  
  playSound('match_found');
  showToast("Your livestream advertisement is now LIVE!", "success");
  
  toggleAdvertiseForm();
  renderStreamsList();
}

function renderStreamsList() {
  const container = document.getElementById('streams-list-container');
  if (!container) return;
  
  const list = appState.advertisedStreams || [];
  if (list.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--dc-text-muted); font-size:0.75rem; padding:12px 0;">No active streams promoted right now. Be the first to promote yours!</div>`;
    return;
  }
  
  container.innerHTML = list.map(s => {
    const platformEmoji = s.platform === 'twitch' ? '🎮' : (s.platform === 'youtube' ? '🎥' : '🟢');
    return `
      <div class="stream-card" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); border: 1px solid var(--db-border); border-radius:6px; padding:10px 14px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="live-badge" style="background:#ef4444; color:white; font-size:0.65rem; font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-flex; align-items:center; gap:4px; font-style:normal; line-height:1;">
              <span class="queue-scanning-indicator" style="width:6px; height:6px; background-color:white; margin:0;"></span> LIVE
            </span>
            <strong style="color:white; font-size:0.85rem;">${s.author}</strong>
            <span style="font-size:0.7rem; color:var(--dc-text-muted); font-weight:normal; text-transform:uppercase;">#${s.platform}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--dc-text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width: 260px;">${s.title}</div>
        </div>
        <button onclick="watchStreamEmbedded('${s.id}')" class="btn btn-secondary" style="font-size:0.75rem; padding:4px 8px; margin:0; display:flex; align-items:center; gap:4px; color:white; cursor:pointer;">
          ${platformEmoji} Watch Live
        </button>
      </div>
    `;
  }).join('');
}

function watchStreamEmbedded(streamId) {
  const list = appState.advertisedStreams || [];
  const stream = list.find(s => s.id === streamId);
  if (!stream) return;

  const playerContainer = document.getElementById('live-stream-player-container');
  const iframe = document.getElementById('live-stream-player-iframe');
  if (!playerContainer || !iframe) return;

  let embedUrl = '';
  if (stream.platform === 'twitch') {
    const channel = stream.url.substring(stream.url.lastIndexOf('/') + 1);
    const parentDomain = window.location.hostname || 'localhost';
    embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}&autoplay=true&muted=false`;
  } else if (stream.platform === 'kick') {
    const channel = stream.url.substring(stream.url.lastIndexOf('/') + 1);
    embedUrl = `https://player.kick.com/${channel}`;
  } else {
    embedUrl = stream.url;
  }

  iframe.src = embedUrl;
  playerContainer.style.display = 'block';
  playerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast(`Loading ${stream.author}'s live stream player...`, "success");
}

function closeEmbeddedStream() {
  const playerContainer = document.getElementById('live-stream-player-container');
  const iframe = document.getElementById('live-stream-player-iframe');
  if (playerContainer && iframe) {
    iframe.src = '';
    playerContainer.style.display = 'none';
    showToast("Embedded player closed.", "info");
  }
}

// ==========================================
// DISCORD ACCOUNT CONNECT / SYNC LOGIC
// ==========================================

function openDiscordOAuthModal() {
  const modal = document.getElementById('discord-oauth-modal');
  if (!modal) return;
  
  modal.style.display = 'flex';
  
  const select = document.getElementById('discord-oauth-player-select');
  if (select) {
    select.innerHTML = players.map(p => `
      <option value="${p.username}" ${appState.currentUser === p.username ? 'selected' : ''}>
        ${p.avatar || '👤'} ${p.username} (Avg ELO: ${Math.round(((p.games.arkheron?.elo || 1000) + (p.games.cs?.elo || 1000) + (p.games.zealot?.elo || 1000)) / 3)})
      </option>
    `).join('');
  }
  
  const unlinkSec = document.getElementById('discord-unlink-section');
  if (unlinkSec) {
    unlinkSec.style.display = appState.discordConnected ? 'block' : 'none';
  }
}

function closeDiscordOAuthModal() {
  const modal = document.getElementById('discord-oauth-modal');
  if (modal) modal.style.display = 'none';
}

function authorizeDiscordAccount() {
  const select = document.getElementById('discord-oauth-player-select');
  if (!select) return;
  
  const selectedUser = select.value;
  const pl = players.find(p => p.username === selectedUser);
  if (!pl) return;
  
  appState.currentUser = selectedUser;
  appState.discordConnected = true;
  appState.connectedDiscordUser = selectedUser;
  
  localStorage.setItem('custom_lobbies_signed_in', 'true');
  localStorage.setItem('custom_lobbies_user', selectedUser);
  localStorage.setItem('custom_lobbies_discord_linked', 'true');
  
  const loginScr = document.getElementById('login-screen');
  if (loginScr) loginScr.style.display = 'none';
  
  const connBtn = document.getElementById('connect-discord-btn');
  const profBadge = document.getElementById('discord-profile-badge');
  const avatarBadge = document.getElementById('connected-avatar-badge');
  const nameBadge = document.getElementById('connected-username-badge');
  
  if (connBtn && profBadge && avatarBadge && nameBadge) {
    connBtn.style.display = 'none';
    profBadge.style.display = 'inline-flex';
    avatarBadge.innerText = pl.avatar || '👤';
    nameBadge.innerText = selectedUser;
  }
  
  playSound('match_found');
  showToast(`Successfully connected to Discord as ${selectedUser}!`, "success");
  
  renderLeaderboard();
  
  if (appState.currentTab === 'profiles') {
    renderProfilesTab();
  } else if (appState.currentTab === 'tournaments') {
    renderTournamentsTab();
  } else if (appState.currentTab === 'forums') {
    renderForumsTab();
  }
  
  closeDiscordOAuthModal();
}

function disconnectDiscordAccount() {
  appState.currentUser = 'Resteral.TV';
  appState.discordConnected = false;
  appState.connectedDiscordUser = null;
  
  localStorage.removeItem('custom_lobbies_signed_in');
  localStorage.removeItem('custom_lobbies_user');
  localStorage.removeItem('custom_lobbies_discord_linked');
  
  const loginScr = document.getElementById('login-screen');
  if (loginScr) loginScr.style.display = 'flex';
  
  const connBtn = document.getElementById('connect-discord-btn');
  const profBadge = document.getElementById('discord-profile-badge');
  
  if (connBtn && profBadge) {
    connBtn.style.display = 'inline-flex';
    profBadge.style.display = 'none';
  }
  
  playSound('pick');
  showToast("Session signed out and Discord disconnected.", "info");
  
  renderLeaderboard();
  
  if (appState.currentTab === 'profiles') {
    renderProfilesTab();
  } else if (appState.currentTab === 'tournaments') {
    renderTournamentsTab();
  } else if (appState.currentTab === 'forums') {
    renderForumsTab();
  }
  
  closeDiscordOAuthModal();
}

// ==========================================
// SUPABASE AUTH LOGIC
// ==========================================

function saveCustomSupabaseConfig() {
  const url = document.getElementById('setup-supabase-url').value.trim();
  const key = document.getElementById('setup-supabase-key').value.trim();
  
  if (!url || !key) {
    showToast("Please enter both the Supabase URL and Anon Key!", "warning");
    return;
  }
  
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_key', key);
  
  initSupabase();
  
  if (supabaseClient) {
    showToast("Supabase credentials saved & initialized!", "success");
  } else {
    showToast("Supabase SDK is missing or invalid config. Demo Mode fallback active.", "warning");
  }
}

async function signInWithSupabaseEmail() {
  const email = document.getElementById('supabase-email-input').value.trim();
  const password = document.getElementById('supabase-password-input').value;
  
  if (!email || !password) {
    showToast("Please enter both email and password!", "warning");
    return;
  }
  
  if (supabaseClient) {
    try {
      showToast("Signing in with Supabase...", "info");
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      const userEmail = data.user.email;
      const username = userEmail.split('@')[0];
      
      appState.currentUser = username;
      localStorage.setItem('custom_lobbies_signed_in', 'true');
      localStorage.setItem('custom_lobbies_user', username);
      
      const loginScr = document.getElementById('login-screen');
      if (loginScr) loginScr.style.display = 'none';
      
      playSound('match_found');
      showToast(`Welcome back, ${username}!`, "success");
      renderLeaderboard();
    } catch (e) {
      showToast(`Supabase Auth Error: ${e.message}`, "danger");
    }
  } else {
    // Simulated auth (Demo mode)
    const username = email.split('@')[0];
    
    let pl = players.find(p => p.username === username);
    const isNewUser = !pl;
    if (isNewUser) {
      pl = {
        username,
        avatar: '👤',
        bio: 'Competitive player authenticated via demo Supabase.',
        referralsCount: 0,
        games: {
          arkheron: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] },
          cs: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] },
          zealot: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] }
        }
      };
      players.push(pl);
    }
    
    appState.currentUser = username;
    localStorage.setItem('custom_lobbies_signed_in', 'true');
    localStorage.setItem('custom_lobbies_user', username);
    
    const loginScr = document.getElementById('login-screen');
    if (loginScr) loginScr.style.display = 'none';
    
    playSound('match_found');
    showToast(`[Demo Mode] Signed in successfully as ${username}!`, "success");
    
    if (isNewUser) {
      const referralCode = document.getElementById('supabase-referral-input').value.trim();
      if (referralCode) {
        applyReferralCode(username, referralCode);
      }
    }
    
    renderLeaderboard();
  }
}

async function signUpWithSupabaseEmail() {
  const email = document.getElementById('supabase-email-input').value.trim();
  const password = document.getElementById('supabase-password-input').value;
  
  if (!email || !password) {
    showToast("Please enter both email and password to sign up!", "warning");
    return;
  }
  
  if (supabaseClient) {
    try {
      showToast("Registering via Supabase...", "info");
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      
      if (error) throw error;
      
      const referralCode = document.getElementById('supabase-referral-input').value.trim();
      const username = email.split('@')[0];
      if (referralCode) {
        applyReferralCode(username, referralCode);
      }
      
      showToast("Sign up successful! Please check your email inbox to confirm.", "success");
    } catch (e) {
      showToast(`Supabase Sign Up Error: ${e.message}`, "danger");
    }
  } else {
    const username = email.split('@')[0];
    showToast(`[Demo Mode] Created profile for ${username}! Signing in...`, "success");
    
    setTimeout(() => {
      signInWithSupabaseEmail();
    }, 1000);
  }
}

function signInAsGuest() {
  appState.currentUser = 'Resteral.TV';
  localStorage.setItem('custom_lobbies_signed_in', 'true');
  localStorage.setItem('custom_lobbies_user', 'Resteral.TV');
  
  const loginScr = document.getElementById('login-screen');
  if (loginScr) loginScr.style.display = 'none';
  
  playSound('join');
  showToast("Signed in as Guest.", "info");
  renderLeaderboard();
}

function applyReferralCode(newUsername, code) {
  if (!code) return;
  if (code.startsWith('customlobbies.')) {
    const referrerName = code.replace('customlobbies.', '');
    const referrer = players.find(p => p.username.toLowerCase() === referrerName.toLowerCase());
    if (referrer) {
      referrer.referralsCount = (referrer.referralsCount || 0) + 1;
      referrer.coins = (referrer.coins || 500) + 150;
      GAMES.forEach(g => {
        if (referrer.games[g]) {
          referrer.games[g].elo += 15;
          if (referrer.games[g].eloHistory) {
            referrer.games[g].eloHistory.push(referrer.games[g].elo);
          }
        }
      });
      savePlayersToStorage();
      showToast(`Referral code applied! Partner ${referrer.username} received +15 ELO & +150 Coins!`, "success");
      
      setTimeout(() => {
        const chatMsgContainer = document.getElementById('chat-messages');
        if (chatMsgContainer) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const botMessageHtml = `
            <div class="dc-msg font-slide-in">
              <div class="dc-msg-avatar" style="background-color:#8b5cf6;">🤝</div>
              <div class="dc-msg-content">
                <div class="dc-msg-header">
                  <span class="dc-msg-username" style="color:#a78bfa;">Sponsor Bot</span>
                  <span class="dc-msg-botbadge" style="background:#7c3aed;">PARTNER</span>
                  <span class="dc-msg-time">${timeStr}</span>
                </div>
                <div class="dc-msg-text">
                  🎉 Streamer Referral! <strong>${newUsername}</strong> registered using sponsor code <code style="color:#fbbf24; font-weight:bold;">${code}</code>! 
                  Partner <strong>${referrer.username}</strong> has been credited with +15 ELO points in all ladders!
                </div>
              </div>
            </div>
          `;
          chatMsgContainer.insertAdjacentHTML('beforeend', botMessageHtml);
          chatMsgContainer.scrollTop = chatMsgContainer.scrollHeight;
          playSound('message');
        }
      }, 1500);
    } else {
      showToast(`Referral partner "${referrerName}" not found.`, "warning");
    }
  } else {
    showToast("Invalid referral format. Use customlobbies.(username)", "warning");
  }
}

function signInWithDiscordOAuth() {
  if (supabaseClient) {
    try {
      showToast("Redirecting to Discord Auth...", "info");
      supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (e) {
      showToast(`Supabase OAuth Error: ${e.message}`, "danger");
    }
  } else {
    // Fallback to local dev simulated consent popup modal
    openDiscordOAuthModal();
  }
}

// ==========================================
// 📅 EVENT CALENDAR & TOURNAMENT INTERACTION
// ==========================================
let calendarDate = new Date();
let calendarSelectedDate = new Date();

// Load or seed events list
let calendarEvents = JSON.parse(localStorage.getItem('custom_lobbies_calendar_events')) || [
  {
    id: 'EV-ARK-WEEKLY',
    name: '🏆 Arkheron Weekly Tournament',
    game: 'arkheron',
    isTournament: true,
    date: new Date().toISOString().split('T')[0] // today
  },
  {
    id: 'EV-1',
    name: '🏆 Counter-Strike 5v5 Monthly Cup Draft',
    game: 'cs',
    isTournament: true,
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] // 4 days from now
  },
  {
    id: 'EV-2',
    name: '🧜 Arkheron Team Practice Scrim',
    game: 'arkheron',
    isTournament: false,
    date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0] // tomorrow
  },
  {
    id: 'EV-3',
    name: '🛡️ Zealot Mod Arena Matches',
    game: 'zealot',
    isTournament: false,
    date: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0] // 6 days from now
  }
];

function saveCalendarEvents() {
  localStorage.setItem('custom_lobbies_calendar_events', JSON.stringify(calendarEvents));
}

function renderCalendar() {
  const monthYearEl = document.getElementById('calendar-month-year');
  const gridEl = document.getElementById('calendar-grid');
  if (!monthYearEl || !gridEl) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  gridEl.innerHTML = '';

  // First day of month
  const firstDay = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.style.height = '64px';
    gridEl.appendChild(emptyCell);
  }

  // Populate days
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day-cell';
    dayCell.style.cssText = `
      height: 64px;
      border: 1px solid var(--db-border);
      border-radius: 4px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      cursor: pointer;
      background: var(--db-bg);
      position: relative;
      transition: all 0.2s ease;
    `;

    const dayNum = document.createElement('span');
    dayNum.textContent = day;
    dayNum.style.fontWeight = 'bold';
    dayNum.style.fontSize = '0.85rem';
    dayNum.style.color = 'white';
    dayCell.appendChild(dayNum);

    // Is this day selected?
    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const selectedDateStr = calendarSelectedDate.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    if (cellDateStr === selectedDateStr) {
      dayCell.style.border = '2px solid #ca8a04';
      dayCell.style.background = 'rgba(202, 138, 4, 0.1)';
    } else if (cellDateStr === todayStr) {
      dayCell.style.border = '2px solid var(--db-primary)';
      dayCell.style.background = 'rgba(124, 58, 237, 0.1)';
    }

    // Check events on this day
    const dayEvents = calendarEvents.filter(e => e.date === cellDateStr);
    if (dayEvents.length > 0) {
      const dotsContainer = document.createElement('div');
      dotsContainer.style.display = 'flex';
      dotsContainer.style.gap = '3px';
      dotsContainer.style.marginTop = '4px';
      
      dayEvents.forEach(e => {
        const dot = document.createElement('span');
        dot.style.cssText = `
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        `;
        if (e.game === 'cs') dot.style.background = '#10b981'; // Green for CS
        else if (e.game === 'arkheron') dot.style.background = '#a78bfa'; // Purple for Arkheron
        else dot.style.background = '#fbbf24'; // Yellow for Zealot
        dotsContainer.appendChild(dot);
      });
      dayCell.appendChild(dotsContainer);
    }

    dayCell.onclick = () => {
      calendarSelectedDate = new Date(year, month, day);
      renderCalendar();
      renderSelectedDayEvents();
    };

    gridEl.appendChild(dayCell);
  }

  renderSelectedDayEvents();
}

function prevMonth() {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
}

function renderSelectedDayEvents() {
  const badgeEl = document.getElementById('calendar-selected-day-badge');
  const containerEl = document.getElementById('calendar-day-events');
  if (!badgeEl || !containerEl) return;

  const dateStr = calendarSelectedDate.toISOString().split('T')[0];
  badgeEl.textContent = dateStr;

  const dayEvents = calendarEvents.filter(e => e.date === dateStr);
  if (dayEvents.length === 0) {
    containerEl.innerHTML = `
      <div style="text-align: center; color: var(--dc-text-muted); font-size: 0.75rem; padding: 20px 0;">
        No events scheduled for this date.
      </div>
    `;
    return;
  }

  containerEl.innerHTML = dayEvents.map(e => {
    let gameBadge = `<span class="badge" style="background:#ca8a04; font-size:0.6rem; padding:2px 4px; margin:0;">Zealot</span>`;
    if (e.game === 'cs') gameBadge = `<span class="badge" style="background:#10b981; font-size:0.6rem; padding:2px 4px; margin:0;">CS 5v5</span>`;
    else if (e.game === 'arkheron') gameBadge = `<span class="badge" style="background:#8b5cf6; font-size:0.6rem; padding:2px 4px; margin:0;">Arkheron</span>`;

    const actionButton = e.isTournament 
      ? `<button onclick="joinTournamentFromCalendar('${e.game}')" class="btn btn-primary" style="margin-top:8px; font-size:0.75rem; padding:6px 10px; width:100%; height:auto; background:linear-gradient(135deg, #8b5cf6, #7c3aed); border-color:#8b5cf6;">🏆 Join Tournament Pool & Play</button>`
      : '';

    return `
      <div style="padding: 10px; border-radius: 4px; border: 1px solid var(--db-border); background: var(--db-bg); display: flex; flex-direction: column; gap: 4px; position: relative;">
        <div style="font-weight: bold; font-size: 0.8rem; color: white; padding-right: 20px;">${e.name}</div>
        <div style="display: flex; gap: 6px; align-items: center;">
          ${gameBadge}
          <span style="font-size:0.65rem; color: var(--dc-text-muted);">${e.isTournament ? 'Official Tournament' : 'Scrim Match'}</span>
        </div>
        ${actionButton}
        <button onclick="deleteCalendarEvent('${e.id}')" style="position: absolute; top: 6px; right: 6px; background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;" title="Cancel Event">🗑️</button>
      </div>
    `;
  }).join('');
}

function addNewCalendarEvent() {
  const nameInput = document.getElementById('event-name-input');
  const gameSelect = document.getElementById('event-game-select');
  const dateInput = document.getElementById('event-date-input');

  const name = nameInput.value.trim();
  const game = gameSelect.value;
  const date = dateInput.value;

  if (!name || !date) {
    showToast("Please fill in event name and date!", "warning");
    return;
  }

  const newEvent = {
    id: 'EV-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    name,
    game,
    isTournament: name.toLowerCase().includes('tournament') || name.toLowerCase().includes('cup'),
    date
  };

  calendarEvents.push(newEvent);
  saveCalendarEvents();
  nameInput.value = '';
  dateInput.value = '';

  showToast("Custom event scheduled!", "success");
  renderCalendar();
}

function deleteCalendarEvent(id) {
  calendarEvents = calendarEvents.filter(e => e.id !== id);
  saveCalendarEvents();
  showToast("Event cancelled successfully.", "info");
  renderCalendar();
}

function joinTournamentFromCalendar(game) {
  let t = appState.tournaments.find(tour => tour.game === game && tour.status !== 'complete');
  if (!t) {
    t = {
      id: 'TOUR-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      name: game === 'arkheron' ? 'Weekly Arkheron Championship' : 'Counter-Strike Open Cup',
      game: game,
      type: 'snake',
      numTeams: 2,
      isMonthly: false,
      status: 'signup',
      pool: [],
      checkedIn: [],
      captains: [],
      teams: {},
      budgets: {},
      nominationTurn: null,
      pickSequence: [],
      pickIdx: 0,
      currentBidding: { player: null, highestBidder: null, highestBid: 0, timer: null }
    };
    appState.tournaments.push(t);
  }
  appState.activeTournamentId = t.id;

  if (!t.pool.includes(appState.currentUser)) {
    t.pool.push(appState.currentUser);
  }

  showToast(`Joined the pool for ${t.name}!`, "success");
  switchTab('tournaments');
}

// ==========================================
// 🎰 COIN CASINO & PROFILE REWARDS SYSTEM
// ==========================================
let activeMatchBet = null;

function updateCoinsUI() {
  const me = players.find(p => p.username === appState.currentUser);
  if (!me) return;

  me.coins = me.coins || 500;
  me.unlockedRewards = me.unlockedRewards || [];

  const coinEl = document.getElementById('header-coins-amount');
  if (coinEl) coinEl.textContent = me.coins;

  // Update Shop Reward Buttons
  const rewards = [
    { id: 'theme-gold', btnId: 'shop-btn-theme-gold', cost: 500 },
    { id: 'theme-green', btnId: 'shop-btn-theme-green', cost: 1000 },
    { id: 'badge-vip', btnId: 'shop-btn-badge-vip', cost: 1200 },
    { id: 'badge-chal', btnId: 'shop-btn-badge-chal', cost: 1800 }
  ];

  rewards.forEach(r => {
    const btn = document.getElementById(r.btnId);
    if (btn) {
      if (me.unlockedRewards.includes(r.id)) {
        btn.textContent = '✅ Unlocked';
        btn.disabled = true;
        btn.style.cssText = 'background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981; font-size: 0.7rem; padding: 4px 8px; cursor: default;';
      } else {
        btn.textContent = `🪙 ${r.cost}`;
        btn.disabled = false;
        if (me.coins < r.cost) {
          btn.style.cssText = 'background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; font-size: 0.7rem; padding: 4px 8px; cursor: pointer;';
        } else {
          btn.style.cssText = 'background: rgba(251, 191, 36, 0.15); border-color: #fbbf24; color: #fbbf24; font-size: 0.7rem; padding: 4px 8px; cursor: pointer;';
        }
      }
    }
  });

  // Render live match betting widget
  renderMatchBettingWidget();
}

function claimHourlyCoins() {
  const me = players.find(p => p.username === appState.currentUser);
  if (!me) return;

  const now = Date.now();
  const lastClaimed = parseInt(localStorage.getItem('coins_last_claimed') || '0');
  const cooldown = 3600 * 1000; // 1 hour

  if (now - lastClaimed < cooldown) {
    const minLeft = Math.ceil((cooldown - (now - lastClaimed)) / 60000);
    showToast(`Claim cooling down! Please wait ${minLeft} minutes.`, "warning");
    return;
  }

  me.coins = (me.coins || 500) + 50;
  localStorage.setItem('coins_last_claimed', String(now));
  savePlayersToStorage();
  showToast("Claimed +50 Free Scrim Coins! 🪙", "success");
  updateCoinsUI();
}

function buyShopReward(rewardId, cost) {
  const me = players.find(p => p.username === appState.currentUser);
  if (!me) return;

  me.coins = me.coins || 500;
  me.unlockedRewards = me.unlockedRewards || [];

  if (me.unlockedRewards.includes(rewardId)) return;

  if (me.coins < cost) {
    showToast("Insufficient Scrim Coins! Play matchmaking or Casino games.", "warning");
    return;
  }

  me.coins -= cost;
  me.unlockedRewards.push(rewardId);
  
  // Set theme colors directly if theme unlocked
  if (rewardId === 'theme-gold') me.color = '#fbbf24';
  if (rewardId === 'theme-green') me.color = '#10b981';

  savePlayersToStorage();
  showToast("Reward successfully unlocked!", "success");
  updateCoinsUI();
  renderProfilesTab();
}

function playCoinFlip() {
  const choice = document.getElementById('coin-choice-select').value;
  const betInput = document.getElementById('coin-bet-input');
  const bet = parseInt(betInput.value);

  const me = players.find(p => p.username === appState.currentUser);
  if (!me) return;

  me.coins = me.coins || 500;

  if (isNaN(bet) || bet < 10) {
    showToast("Minimum casino bet is 10 Coins!", "warning");
    return;
  }
  if (bet > me.coins) {
    showToast("Insufficient coins for this wager!", "warning");
    return;
  }

  const coinVisual = document.getElementById('coin-visual');
  coinVisual.style.transform = 'rotateY(1080deg)';
  
  setTimeout(() => {
    const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
    coinVisual.textContent = outcome === 'heads' ? '👑' : '🛡️';
    coinVisual.style.transform = 'rotateY(0deg)';

    if (outcome === choice) {
      me.coins += bet;
      showToast(`🎉 You Won +${bet} Coins! Coin landed on ${outcome.toUpperCase()}!`, "success");
    } else {
      me.coins -= bet;
      showToast(`😢 You Lost -${bet} Coins. Coin landed on ${outcome.toUpperCase()}.`, "warning");
    }

    savePlayersToStorage();
    updateCoinsUI();
  }, 800);
}

function spinSlots() {
  const me = players.find(p => p.username === appState.currentUser);
  if (!me) return;

  me.coins = me.coins || 500;
  const spinCost = 50;

  if (me.coins < spinCost) {
    showToast("Slot spins cost 50 Coins! Claim daily wagers.", "warning");
    return;
  }

  me.coins -= spinCost;

  const symbols = ['🍒', '🍊', '🔔', '💎', '🍇', '⭐'];
  const r1 = symbols[Math.floor(Math.random() * symbols.length)];
  const r2 = symbols[Math.floor(Math.random() * symbols.length)];
  const r3 = symbols[Math.floor(Math.random() * symbols.length)];

  const reel1 = document.getElementById('slot-reel-1');
  const reel2 = document.getElementById('slot-reel-2');
  const reel3 = document.getElementById('slot-reel-3');

  // Spinning rotation illusion
  reel1.textContent = '🌀';
  reel2.textContent = '🌀';
  reel3.textContent = '🌀';

  setTimeout(() => {
    reel1.textContent = r1;
    reel2.textContent = r2;
    reel3.textContent = r3;

    if (r1 === r2 && r2 === r3) {
      // Jackpot match 3
      me.coins += 500;
      showToast(`🎰 JACKPOT! Match 3: Won +500 Coins!`, "success");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      // Match 2
      me.coins += 100;
      showToast(`🎉 Lucky Spin! Match 2: Won +100 Coins!`, "success");
    } else {
      showToast("No matches. Better luck next spin!", "info");
    }

    savePlayersToStorage();
    updateCoinsUI();
  }, 600);
}

// ==========================================
// ⚔️ LIVE MATCH BETTING
// ==========================================
function placeMatchBet(betOn, amount) {
  const me = players.find(p => p.username === appState.currentUser);
  if (!me) return showToast("Log in to place match wagers!", "warning");

  me.coins = me.coins || 500;
  if (activeMatchBet) return showToast("You already placed a bet on this scrim!", "warning");
  if (isNaN(amount) || amount < 10) return showToast("Minimum bet is 10 Coins!", "warning");
  if (amount > me.coins) return showToast("Insufficient balance for this bet!", "warning");

  me.coins -= amount;
  activeMatchBet = { betOn, amount };
  
  savePlayersToStorage();
  showToast(`Bet of ${amount} coins successfully placed!`, "success");
  updateCoinsUI();
}

function renderMatchBettingWidget() {
  const container = document.getElementById('betting-scrim-container');
  const badge = document.getElementById('betting-status-badge');
  if (!container || !badge) return;

  const isDraft = appState.draft && appState.draft.active;
  const isMatch = appState.match && appState.match.active;

  if (!isDraft && !isMatch) {
    badge.textContent = 'NO MATCH';
    badge.style.background = 'var(--dc-bg-sidebar)';
    container.innerHTML = `
      <div style="text-align: center; color: var(--dc-text-muted); font-size: 0.8rem; padding: 24px 0;">
        📡 No active matchmaking drafts or scrims to bet on.<br>
        <span style="font-size:0.7rem; color: #a78bfa;">Wagers become open once a queue fills and teams start drafting!</span>
      </div>
    `;
    return;
  }

  badge.textContent = 'LIVE SCRIM';
  badge.style.background = '#ca8a04';

  const capA = appState.draft.captains[0];
  const capB = appState.draft.captains[1];
  const teamAPlayers = appState.draft.teams.teamA.players || [capA];
  const teamBPlayers = appState.draft.teams.teamB.players || [capB];

  if (activeMatchBet) {
    const sideText = activeMatchBet.betOn === 'alpha' ? `Team ${capA} (Alpha)` : `Team ${capB} (Beta)`;
    container.innerHTML = `
      <div style="background: rgba(202,138,4,0.1); border: 1.5px dashed #ca8a04; border-radius: 6px; padding: 12px; text-align: center;">
        <span style="font-size: 1.5rem; display:block; margin-bottom:4px;">🔒</span>
        <strong>Bet Confirmed:</strong> Wagered <code style="color:#fbbf24; font-weight:bold;">${activeMatchBet.amount} Coins</code> on <strong>${sideText}</strong>.
        <div style="font-size: 0.7rem; color: var(--dc-text-muted); margin-top: 6px;">Odds: 2.0x. Payout will resolve automatically when the simulation completes.</div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
        <div style="padding: 10px; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--db-border);">
          <div style="font-weight:bold; color: #a78bfa; margin-bottom:4px;">Team Alpha</div>
          <div style="font-size:0.7rem; color: var(--dc-text-muted); line-height: 1.4;">
            Captain: <strong>${capA}</strong><br>
            Roster: ${teamAPlayers.join(', ')}
          </div>
          <button class="btn btn-primary" onclick="placeMatchBet('alpha', parseInt(document.getElementById('bet-scrim-amount-input').value))" style="width:100%; margin-top:8px; font-size:0.7rem; padding:4px; height:auto;">Bet Alpha</button>
        </div>
        <div style="padding: 10px; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--db-border);">
          <div style="font-weight:bold; color: #10b981; margin-bottom:4px;">Team Beta</div>
          <div style="font-size:0.7rem; color: var(--dc-text-muted); line-height: 1.4;">
            Captain: <strong>${capB}</strong><br>
            Roster: ${teamBPlayers.join(', ')}
          </div>
          <button class="btn btn-primary" onclick="placeMatchBet('beta', parseInt(document.getElementById('bet-scrim-amount-input').value))" style="width:100%; margin-top:8px; font-size:0.7rem; padding:4px; height:auto; background:#10b981; border-color:#10b981;">Bet Beta</button>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px; justify-content:center;">
        <label style="font-size:0.75rem; font-weight:bold; color: white;">WAGER COINS:</label>
        <input type="number" id="bet-scrim-amount-input" value="100" min="10" max="5000" style="width: 100px; padding: 4px 8px; border-radius: 4px; border:1px solid var(--db-border); background: var(--db-bg); color:white; font-size:0.8rem; font-weight:bold; text-align:center;">
      </div>
    `;
  }
}

// ==========================================
// 🔍 MULTI-GAME STATS SEARCH DESK
// ==========================================
function hashStringToInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function searchPlayerMultiStats() {
  const inputEl = document.getElementById('stats-lookup-search-input');
  const gameSelect = document.getElementById('stats-lookup-game-select');
  const resultEl = document.getElementById('stats-lookup-result');
  if (!inputEl || !gameSelect || !resultEl) return;

  const searchQuery = inputEl.value.trim();
  const selectedGame = gameSelect.value;

  if (!searchQuery) {
    showToast("Please enter a player handle to search!", "warning");
    return;
  }

  // Find local user or mock user details
  let dbPlayer = players.find(p => p.username.toLowerCase() === searchQuery.toLowerCase()) || 
                 MOCK_PLAYERS_POOL.find(p => p.username.toLowerCase() === searchQuery.toLowerCase());

  const username = dbPlayer ? dbPlayer.username : searchQuery;
  const avatar = dbPlayer ? (dbPlayer.avatar || '👤') : '👤';
  const seed = hashStringToInt(username);

  resultEl.style.display = 'block';

  let htmlContent = '';

  if (selectedGame === 'arkheron') {
    const elo = dbPlayer ? (dbPlayer.games.arkheron?.elo || 1000) : (1000 + (seed % 350) - 100);
    const wins = dbPlayer ? (dbPlayer.games.arkheron?.wins || 0) : (5 + (seed % 25));
    const losses = dbPlayer ? (dbPlayer.games.arkheron?.losses || 0) : (5 + (seed % 20));
    const winrate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 50;
    const characters = ['Leodin', 'Valkyrie', 'Zealot Warrior', 'Tofu Defender', 'Ascended Mage'];
    const favChar = characters[seed % characters.length];

    htmlContent = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.8rem;">${avatar}</span>
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:white; text-align:left;">${username}</h4>
            <span style="font-size:0.7rem; color:var(--dc-text-muted); display:block; text-align:left;">Arkheron Mod Desk</span>
          </div>
        </div>
        <span class="badge" style="background:#8b5cf6; margin:0;">🧜 Arkheron Mod</span>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; align-items:center;">
        <div style="text-align:center; padding:12px; background:rgba(0,0,0,0.2); border-radius:6px; border:1px solid rgba(255,255,255,0.04);">
          <div style="font-size:0.7rem; color:var(--dc-text-muted); text-transform:uppercase; font-weight:bold;">Matchmaking ELO</div>
          <div style="font-size:2rem; font-weight:800; color:#fbbf24; margin:4px 0;">${elo}</div>
          <div style="font-size:0.7rem; color:var(--dc-text-muted);">Wins: ${wins} / Losses: ${losses}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem; text-align:left;">
          <div>📊 **Win Rate:** <strong style="color:white;">${winrate}%</strong></div>
          <div>🧝 **Main Hero:** <strong style="color:white;">${favChar}</strong></div>
          <div>📈 **League Tier:** <strong style="color:#a78bfa;">${elo >= 1200 ? 'Ascended Gold' : (elo >= 1050 ? 'Elite Challenger' : 'Acolyte Arena')}</strong></div>
        </div>
      </div>
    `;
  }

  else if (selectedGame === 'cs') {
    const elo = dbPlayer ? (dbPlayer.games.cs?.elo || 1000) : (1000 + (seed % 450) - 150);
    const wins = dbPlayer ? (dbPlayer.games.cs?.wins || 0) : (12 + (seed % 40));
    const losses = dbPlayer ? (dbPlayer.games.cs?.losses || 0) : (10 + (seed % 35));
    const winrate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 50;
    
    let rank = 'Gold Nova Master';
    if (elo < 900) rank = 'Silver IV';
    else if (elo >= 1050 && elo < 1200) rank = 'Legendary Eagle';
    else if (elo >= 1200 && elo < 1350) rank = 'Supreme Master First Class';
    else if (elo >= 1350) rank = '👑 Global Elite';

    const weapons = ['AK-47', 'M4A4', 'AWP', 'Desert Eagle'];
    const favWeapon = weapons[seed % weapons.length];
    const kd = (1.0 + (seed % 80) / 100).toFixed(2);

    htmlContent = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.8rem;">${avatar}</span>
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:white; text-align:left;">${username}</h4>
            <span style="font-size:0.7rem; color:var(--dc-text-muted); display:block; text-align:left;">CS:GO / CS2 Portal</span>
          </div>
        </div>
        <span class="badge" style="background:#10b981; margin:0;">🔫 CS 5v5 Scrims</span>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; align-items:center;">
        <div style="text-align:center; padding:12px; background:rgba(0,0,0,0.2); border-radius:6px; border:1px solid rgba(255,255,255,0.04);">
          <div style="font-size:0.7rem; color:var(--dc-text-muted); text-transform:uppercase; font-weight:bold;">CS ELO Rating</div>
          <div style="font-size:2rem; font-weight:800; color:#10b981; margin:4px 0;">${elo}</div>
          <div style="font-size:0.75rem; color:white; font-weight:bold;">${rank}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem; text-align:left;">
          <div>📊 **Win Rate:** <strong style="color:white;">${winrate}%</strong> (W: ${wins} / L: ${losses})</div>
          <div>🎯 **K/D Ratio:** <strong style="color:#10b981;">${kd}</strong></div>
          <div>🔫 **Fav Weapon:** <strong style="color:white;">${favWeapon}</strong></div>
        </div>
      </div>
    `;
  }

  else if (selectedGame === 'lol') {
    const ranks = ['Gold III', 'Platinum II', 'Diamond IV', 'Master', 'Grandmaster', 'Challenger'];
    const rank = ranks[seed % ranks.length];
    const lp = (seed % 800) + 12;
    const wins = (seed % 150) + 50;
    const losses = (seed % 130) + 45;
    const winrate = Math.round((wins / (wins + losses)) * 100);
    const champs = ['Yasuo', 'Lee Sin', 'Jinx', 'Thresh', 'Ahri', 'Lux', 'Zed'];
    const favChamp = champs[seed % champs.length];
    const k = (2 + (seed % 8)).toFixed(1);
    const d = (1 + (seed % 5)).toFixed(1);
    const a = (4 + (seed % 10)).toFixed(1);

    htmlContent = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.8rem;">${avatar}</span>
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:white; text-align:left;">${username}</h4>
            <span style="font-size:0.7rem; color:var(--dc-text-muted); display:block; text-align:left;">Riot Games LoL API Desk</span>
          </div>
        </div>
        <span class="badge" style="background:#3b82f6; margin:0;">🏆 League of Legends</span>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; align-items:center;">
        <div style="text-align:center; padding:12px; background:rgba(0,0,0,0.2); border-radius:6px; border:1px solid rgba(255,255,255,0.04);">
          <div style="font-size:0.7rem; color:var(--dc-text-muted); text-transform:uppercase; font-weight:bold;">Tier / LP</div>
          <div style="font-size:1.3rem; font-weight:800; color:#3b82f6; margin:4px 0;">${rank}</div>
          <div style="font-size:0.75rem; color:white; font-weight:bold;">${lp} LP</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem; text-align:left;">
          <div>📊 **Win Rate:** <strong style="color:white;">${winrate}%</strong> (${wins}W / ${losses}L)</div>
          <div>⚔️ **KDA Ratio:** <strong style="color:#60a5fa;">${k} / ${d} / ${a}</strong></div>
          <div>🌸 **Fav Champ:** <strong style="color:white;">${favChamp}</strong></div>
        </div>
      </div>
    `;
  }

  else if (selectedGame === 'dota') {
    const ranks = ['Archon II', 'Legend IV', 'Ancient III', 'Divine V', 'Immortal #542', 'Immortal #82'];
    const rank = ranks[seed % ranks.length];
    const mmr = 3000 + (seed % 5000);
    const winrate = 48 + (seed % 14);
    const heroes = ['Pudge', 'Invoker', 'Shadow Fiend', 'Crystal Maiden', 'Rubick', 'Anti-Mage'];
    const favHero = heroes[seed % heroes.length];

    htmlContent = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.8rem;">${avatar}</span>
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:white; text-align:left;">${username}</h4>
            <span style="font-size:0.7rem; color:var(--dc-text-muted); display:block; text-align:left;">Valve Steam Dota2 API desk</span>
          </div>
        </div>
        <span class="badge" style="background:#f43f5e; margin:0;">⭐ Dota 2</span>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; align-items:center;">
        <div style="text-align:center; padding:12px; background:rgba(0,0,0,0.2); border-radius:6px; border:1px solid rgba(255,255,255,0.04);">
          <div style="font-size:0.7rem; color:var(--dc-text-muted); text-transform:uppercase; font-weight:bold;">Competitive Medal</div>
          <div style="font-size:1.35rem; font-weight:800; color:#ef4444; margin:4px 0;">${rank}</div>
          <div style="font-size:0.75rem; color:white; font-weight:bold;">${mmr} MMR</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem; text-align:left;">
          <div>📊 **Win Rate:** <strong style="color:white;">${winrate}%</strong></div>
          <div>🧙 **Most Picked Hero:** <strong style="color:white;">${favHero}</strong></div>
          <div>🎮 **Match Quality:** <strong style="color:#f43f5e;">Ranked Roles</strong></div>
        </div>
      </div>
    `;
  }

  else if (selectedGame === 'r6') {
    const ranks = ['Silver I', 'Gold III', 'Platinum II', 'Diamond IV', 'Champion #89'];
    const rank = ranks[seed % ranks.length];
    const rp = (seed % 400) + 1200;
    const kd = (0.8 + (seed % 90) / 100).toFixed(2);
    const winrate = 47 + (seed % 16);
    const attackers = ['Ash', 'Ace', 'Thermite', 'Buck'];
    const defenders = ['Jäger', 'Lesion', 'Smoke', 'Wamai'];
    const favAtk = attackers[seed % attackers.length];
    const favDef = defenders[seed % defenders.length];

    htmlContent = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.8rem;">${avatar}</span>
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:white; text-align:left;">${username}</h4>
            <span style="font-size:0.7rem; color:var(--dc-text-muted); display:block; text-align:left;">Ubisoft Connect R6 Stats</span>
          </div>
        </div>
        <span class="badge" style="background:#fbbf24; color:black; margin:0;">🛡️ R6 Siege</span>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; align-items:center;">
        <div style="text-align:center; padding:12px; background:rgba(0,0,0,0.2); border-radius:6px; border:1px solid rgba(255,255,255,0.04);">
          <div style="font-size:0.7rem; color:var(--dc-text-muted); text-transform:uppercase; font-weight:bold;">Rank Points</div>
          <div style="font-size:1.4rem; font-weight:800; color:#fbbf24; margin:4px 0;">${rank}</div>
          <div style="font-size:0.75rem; color:white; font-weight:bold;">${rp} RP</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem; text-align:left;">
          <div>📊 **Win Rate:** <strong style="color:white;">${winrate}%</strong></div>
          <div>🎯 **K/D Ratio:** <strong style="color:#fbbf24;">${kd}</strong></div>
          <div>🔫 **Fav Ops:** <strong style="color:white;">${favAtk} / ${favDef}</strong></div>
        </div>
      </div>
    `;
  }

}

// ==========================================
// 🏃 RUNNER CLICKER GAME ENGINE
// ==========================================

const RUNNER_SHOP = [
  { id: 'runner-default', name: 'Default Sprinter', emoji: '🏃', multiplier: 1, cost: 0 },
  { id: 'runner-ninja', name: 'Cybernetic Ninja', emoji: '🥷', multiplier: 2, cost: 200 },
  { id: 'runner-gladiator', name: 'Golden Gladiator', emoji: '🛡️', multiplier: 5, cost: 600 },
  { id: 'runner-astronaut', name: 'Cosmic Astronaut', emoji: '🚀', multiplier: 10, cost: 1500 },
  { id: 'runner-hockey', name: 'Zealot Hockey Player', emoji: '🏒', multiplier: 25, cost: 4000 }
];

const LOOT_ITEMS = [
  // Common (60% weight)
  { id: 'item-water', name: 'Water Bottle', rarity: 'common', color: '#9ca3af', baseValue: 50 },
  { id: 'item-band', name: 'Sweatband', rarity: 'common', color: '#9ca3af', baseValue: 50 },
  { id: 'item-socks', name: 'Compression Socks', rarity: 'common', color: '#9ca3af', baseValue: 60 },
  // Rare (25% weight)
  { id: 'item-cleats', name: 'Track Cleats', rarity: 'rare', color: '#3b82f6', baseValue: 150 },
  { id: 'item-gel', name: 'Energy Gel Pack', rarity: 'rare', color: '#3b82f6', baseValue: 150 },
  { id: 'item-insoles', name: 'Carbon Insoles', rarity: 'rare', color: '#3b82f6', baseValue: 180 },
  // Epic (12% weight)
  { id: 'item-boots', name: 'Rocket Boots', rarity: 'epic', color: '#a78bfa', baseValue: 400 },
  { id: 'item-jacket', name: 'Track Jacket', rarity: 'epic', color: '#a78bfa', baseValue: 400 },
  // Legendary (3% weight)
  { id: 'item-golden', name: 'Golden Shoes', rarity: 'legendary', color: '#fbbf24', baseValue: 1200 },
  { id: 'item-chronos', name: 'Winged Sandals', rarity: 'legendary', color: '#fbbf24', baseValue: 1500 }
];

function getClickerState() {
  let state = null;
  try {
    const raw = localStorage.getItem('custom_lobbies_clicker_state');
    if (raw) state = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  if (!state) {
    state = {
      clicks: 0,
      clicksToDrop: 50,
      activeRunner: 'runner-default',
      unlockedRunners: ['runner-default'],
      inventory: []
    };
  }
  return state;
}

function saveClickerState(state) {
  localStorage.setItem('custom_lobbies_clicker_state', JSON.stringify(state));
}

function clickRunnerCharacter() {
  const state = getClickerState();
  const runner = RUNNER_SHOP.find(r => r.id === state.activeRunner) || RUNNER_SHOP[0];
  
  // 1. Trigger Animation
  const wrapper = document.getElementById('runner-sprite-wrapper');
  if (wrapper) {
    wrapper.style.transform = 'scale(0.8) rotate(-8deg)';
    setTimeout(() => {
      wrapper.style.transform = 'scale(1) rotate(0deg)';
    }, 70);
  }

  // 2. Play synthesizer sound effect for running step
  if (audioCtx) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150 + Math.random() * 80, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.08);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  // 3. Earn Coins
  const coinsEarned = 1 * runner.multiplier;
  const pl = players.find(p => p.username === appState.currentUser);
  if (pl) {
    pl.coins = (pl.coins || 0) + coinsEarned;
    savePlayersToStorage();
    updateCoinsUI();
  }

  // 4. Progress towards drop
  state.clicks += runner.multiplier;
  if (state.clicks >= state.clicksToDrop) {
    state.clicks = 0;
    
    // Weighted drop
    const roll = Math.random() * 100;
    let selectedRarity = 'common';
    if (roll < 3) selectedRarity = 'legendary';
    else if (roll < 15) selectedRarity = 'epic';
    else if (roll < 40) selectedRarity = 'rare';

    const possible = LOOT_ITEMS.filter(item => item.rarity === selectedRarity);
    const rolledItem = possible[Math.floor(Math.random() * possible.length)];
    const dropped = {
      ...rolledItem,
      instanceId: 'DROP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toLocaleDateString()
    };

    state.inventory.push(dropped);
    playSound('milestone');
    
    const rarityLabel = dropped.rarity.toUpperCase();
    showToast(`🎉 LOOT DROP! Unlocked: [${rarityLabel}] ${dropped.name}!`, "success");
    
    // Send a message in Discord chat sidebar to make it feel alive!
    writeMessage("LootBot", true, `🏃 **${appState.currentUser}** completed a clicker loop and dropped a **[${rarityLabel}] ${dropped.name}**!`, null);
  }

  saveClickerState(state);
  renderClickerUI();
}

function renderClickerUI() {
  const state = getClickerState();
  const currentRunner = RUNNER_SHOP.find(r => r.id === state.activeRunner) || RUNNER_SHOP[0];

  // Update target emoji
  const emojiEl = document.getElementById('runner-sprite-emoji');
  if (emojiEl) emojiEl.innerText = currentRunner.emoji;

  // Update ratios
  const ratioEl = document.getElementById('clicker-count-ratio');
  if (ratioEl) ratioEl.innerText = `${state.clicks} / ${state.clicksToDrop}`;

  const pctEl = document.getElementById('clicker-ratio-pct');
  if (pctEl) {
    const pct = Math.min(100, Math.round((state.clicks / state.clicksToDrop) * 100));
    pctEl.innerText = `${pct}%`;
    const bar = document.getElementById('clicker-drop-progress-bar');
    if (bar) bar.style.width = `${pct}%`;
  }

  // Multiplier text
  const multEl = document.getElementById('clicker-multiplier-text');
  if (multEl) multEl.innerText = `${currentRunner.multiplier.toFixed(1)}x`;

  const coinsTxt = document.getElementById('clicker-coins-text');
  if (coinsTxt) coinsTxt.innerText = `+${currentRunner.multiplier}`;

  // Render Runner Unlock Shop
  const shopContainer = document.getElementById('clicker-shop-container');
  const pl = players.find(p => p.username === appState.currentUser);
  const userCoins = pl ? (pl.coins || 0) : 0;

  if (shopContainer) {
    shopContainer.innerHTML = RUNNER_SHOP.map(r => {
      const isUnlocked = state.unlockedRunners.includes(r.id);
      const isActive = state.activeRunner === r.id;
      
      let buttonHtml = '';
      if (isActive) {
        buttonHtml = `<button class="btn btn-secondary" style="font-size:0.75rem; padding:4px 8px; margin:0; cursor:default; background:rgba(16,185,129,0.1); border-color:#10b981; color:#10b981;">Equipped</button>`;
      } else if (isUnlocked) {
        buttonHtml = `<button class="btn btn-success" onclick="equipClickerRunner('${r.id}')" style="font-size:0.75rem; padding:4px 8px; margin:0;">Equip</button>`;
      } else {
        const canBuy = userCoins >= r.cost;
        buttonHtml = `<button class="btn ${canBuy ? 'btn-primary' : 'btn-secondary'}" ${canBuy ? '' : 'disabled'} onclick="buyClickerRunner('${r.id}', ${r.cost})" style="font-size:0.75rem; padding:4px 8px; margin:0;">🪙 ${r.cost}</button>`;
      }

      return `
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); border:1px solid var(--db-border); border-radius:6px; padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.8rem;">${r.emoji}</span>
            <div>
              <strong style="color:white; font-size:0.8rem;">${r.name}</strong>
              <div style="font-size:0.65rem; color:var(--dc-text-muted);">Multiplier: ${r.multiplier}x Earning Boost</div>
            </div>
          </div>
          ${buttonHtml}
        </div>
      `;
    }).join('');
  }

  // Render Inventory Drops Grid
  const invGrid = document.getElementById('clicker-inventory-grid');
  if (invGrid) {
    if (state.inventory.length === 0) {
      invGrid.style.display = 'block';
      invGrid.innerHTML = `
        <div style="text-align:center; color:var(--dc-text-muted); font-size:0.8rem; padding:40px 0;">
          <span style="font-size:2rem; display:block; margin-bottom:8px;">🎒</span>
          No drop cards collected yet. Click the running guy to fill the progress meter!
        </div>
      `;
    } else {
      invGrid.style.display = 'grid';
      invGrid.innerHTML = state.inventory.map(item => {
        return `
          <div style="padding:10px; border-radius:6px; background:rgba(0,0,0,0.2); border:1.5px solid ${item.color}; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; gap:6px;">
            <div style="font-weight:bold; font-size:0.75rem; color:white;">${item.name}</div>
            <span style="font-size:0.55rem; padding:1px 4px; border-radius:3px; font-weight:bold; background:${item.color}; color:black; text-transform:uppercase;">${item.rarity}</span>
            <button class="btn btn-primary" onclick="initiateClickerTrade('${item.instanceId}')" style="width:100%; font-size:0.65rem; padding:3px; margin:0; height:auto; background:#fbbf24; border-color:#fbbf24; color:black; font-weight:bold;">🤝 Trade</button>
          </div>
        `;
      }).join('');
    }
  }
}

function equipClickerRunner(runnerId) {
  const state = getClickerState();
  if (state.unlockedRunners.includes(runnerId)) {
    state.activeRunner = runnerId;
    saveClickerState(state);
    playSound('click');
    showToast("Runner equipped!", "success");
    renderClickerUI();
  }
}

function buyClickerRunner(runnerId, cost) {
  const pl = players.find(p => p.username === appState.currentUser);
  if (!pl || (pl.coins || 0) < cost) {
    showToast("Not enough Scrim Coins!", "warning");
    return;
  }

  const state = getClickerState();
  if (!state.unlockedRunners.includes(runnerId)) {
    pl.coins -= cost;
    state.unlockedRunners.push(runnerId);
    state.activeRunner = runnerId;
    
    savePlayersToStorage();
    saveClickerState(state);
    
    playSound('milestone');
    showToast("Successfully unlocked and equipped new runner!", "success");
    updateCoinsUI();
    renderClickerUI();
  }
}

function initiateClickerTrade(instanceId) {
  const state = getClickerState();
  const item = state.inventory.find(i => i.instanceId === instanceId);
  if (!item) return;

  const tradeCard = document.getElementById('clicker-trade-card');
  const detailsEl = document.getElementById('clicker-trade-details');
  if (!tradeCard || !detailsEl) return;

  // Select a random bot name to trade with
  const botNames = ['Shroud', 'Ninja', 'Resteral.TV', 'Faker', 'Summit1g', 'LootGoblin', 'TowerGod'];
  const activeBot = botNames[Math.floor(Math.random() * botNames.length)];
  
  // Calculate randomized bot coin offer (close to base value)
  const multiplier = 0.85 + Math.random() * 0.35;
  const offerCoins = Math.round(item.baseValue * multiplier);

  appState.clickerTrade = {
    instanceId: instanceId,
    botName: activeBot,
    offerAmount: offerCoins,
    itemName: item.name
  };

  tradeCard.style.display = 'block';
  detailsEl.innerHTML = `
    🤖 <strong>${activeBot}</strong> wants to buy your <strong>${item.name}</strong>.<br>
    Offer Amount: <strong style="color:#fbbf24;">🪙 ${offerCoins} Scrim Coins</strong>.<br>
    Rarity: <span style="font-weight:bold; color:${item.color}; text-transform:uppercase;">${item.rarity}</span>
  `;
  playSound('match_found');
}

function acceptClickerTrade() {
  const activeTrade = appState.clickerTrade;
  if (!activeTrade) return;

  const state = getClickerState();
  const itemIndex = state.inventory.findIndex(i => i.instanceId === activeTrade.instanceId);
  
  if (itemIndex > -1) {
    const item = state.inventory[itemIndex];
    state.inventory.splice(itemIndex, 1);
    
    const pl = players.find(p => p.username === appState.currentUser);
    if (pl) {
      pl.coins = (pl.coins || 0) + activeTrade.offerAmount;
      savePlayersToStorage();
      updateCoinsUI();
    }
    
    saveClickerState(state);
    
    // Hide Card
    document.getElementById('clicker-trade-card').style.display = 'none';
    appState.clickerTrade = null;
    
    playSound('milestone');
    showToast(`Trade completed! Earned +${activeTrade.offerAmount} Coins.`, "success");
    
    // Post to persistent global Discord client sidebar!
    writeMessage(activeTrade.botName, false, `🤝 Trade complete! Thanks for the **${activeTrade.itemName}**, ${appState.currentUser}. Clean transaction.`, null);
    
    renderClickerUI();
  }
}

function declineClickerTrade() {
  const activeTrade = appState.clickerTrade;
  if (!activeTrade) return;

  document.getElementById('clicker-trade-card').style.display = 'none';
  appState.clickerTrade = null;
  
  playSound('click');
  showToast("Trade proposal declined.", "info");

  // Post to persistent Discord client sidebar!
  writeMessage(activeTrade.botName, false, `Aw, maybe next time, ${appState.currentUser}! Let me know if you change your mind.`, null);
}

// ==========================================
// 🔱 ARKHERON DEDICATED PAGE ENGINE
// ==========================================

let selectedArkheronHeroId = 'leodin';

function renderArkheronTab() {
  // 1. Hero Selection Grid
  const gridContainer = document.getElementById('arkheron-hero-selection-grid');
  if (gridContainer) {
    gridContainer.innerHTML = ETERNALS.map(hero => {
      const isSelected = hero.id === selectedArkheronHeroId;
      return `
        <button class="btn btn-secondary" onclick="selectArkheronCodexHero('${hero.id}')" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:12px 8px; gap:4px; height:auto; margin:0; background:${isSelected ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.02)'}; border: 1.5px solid ${isSelected ? '#8b5cf6' : 'var(--db-border)'}; box-shadow: ${isSelected ? '0 0 12px rgba(139,92,246,0.3)' : 'none'};">
          <span style="font-size:1.8rem;">${hero.emoji}</span>
          <strong style="color:white; font-size:0.8rem;">${hero.name}</strong>
          <span style="font-size:0.65rem; color:var(--dc-text-muted);">${hero.role}</span>
        </button>
      `;
    }).join('');
  }

  // 2. Inspect Selected Hero Card
  renderArkheronHeroInspectCard();

  // 3. Relics List
  const relicsContainer = document.getElementById('arkheron-relics-list');
  if (relicsContainer) {
    let relicsHtml = RELICS.map(r => {
      return `
        <div style="padding:10px; border-radius:6px; background:rgba(0,0,0,0.2); border:1px solid var(--db-border); text-align:left;">
          <div style="font-weight:bold; color:#a78bfa; font-size:0.85rem; margin-bottom:2px;">${r.name}</div>
          <div style="font-size:0.7rem; color:var(--dc-text-muted); margin-bottom:4px;">Set: <strong>${r.set}</strong> | Slot: ${r.slot}</div>
          <div style="font-size:0.7rem; color:white;">Stats: HP +${r.stats.hp || 0}, AP +${r.stats.ap || 0}, Speed +${r.stats.speed || 0}</div>
        </div>
      `;
    }).join('');

    Object.entries(SETS_METADATA).forEach(([setName, bonus]) => {
      relicsHtml += `
        <div style="padding:10px; border-radius:6px; background:rgba(139,92,246,0.08); border:1.5px dashed #8b5cf6; text-align:left;">
          <div style="font-weight:bold; color:#fbbf24; font-size:0.85rem; margin-bottom:2px;">🔮 ${setName} Set Bonus</div>
          <div style="font-size:0.75rem; color:white;">${bonus}</div>
        </div>
      `;
    });

    relicsContainer.innerHTML = relicsHtml;
  }

  // 4. Update Tournament Pool Roster
  renderArkheronPoolStatus();

  // 5. Update Strategy & Builds Hub
  updateArkheronStrategyView();
}

function selectArkheronCodexHero(heroId) {
  selectedArkheronHeroId = heroId;
  playSound('click');
  renderArkheronTab();
}

function renderArkheronHeroInspectCard() {
  const cardContainer = document.getElementById('arkheron-hero-inspect-card');
  if (!cardContainer) return;

  const hero = ETERNALS.find(h => h.id === selectedArkheronHeroId) || ETERNALS[0];
  const setBonus = SETS_METADATA[hero.set] || 'Standard affinity.';

  cardContainer.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; text-align:left;">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:3rem; background:rgba(255,255,255,0.05); padding:8px 14px; border-radius:8px; border:1px solid var(--db-border);">${hero.emoji}</span>
        <div>
          <h3 style="margin:0; color:white; font-size:1.4rem;">${hero.name}</h3>
          <div style="display:flex; gap:6px; margin-top:4px;">
            <span class="badge" style="background:#8b5cf6; font-size:0.65rem; margin:0;">${hero.role}</span>
            <span class="badge" style="background:#3b82f6; font-size:0.65rem; margin:0;">Set: ${hero.set}</span>
          </div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.7rem; color:var(--dc-text-muted); text-transform:uppercase; font-weight:bold;">Combat Ratings</div>
        <div style="font-size:0.75rem; color:white; margin-top:2px;">
          HP: <strong style="color:#10b981;">${hero.stats.hp}</strong> | 
          SPD: <strong style="color:#fbbf24;">${hero.stats.speed}</strong> | 
          DMG: <strong style="color:#f43f5e;">${hero.stats.damage}</strong>
        </div>
      </div>
    </div>
    <p style="font-size:0.8rem; color:var(--dc-text-muted); line-height:1.5; margin-bottom:14px; text-align:left;">
      ${hero.lore}
    </p>
    <div style="background:rgba(0,0,0,0.3); border-radius:6px; padding:12px; border:1px solid rgba(255,255,255,0.05); text-align:left; margin-bottom:10px;">
      <div style="font-weight:bold; color:#a78bfa; font-size:0.85rem; margin-bottom:4px;">⚡ Signature Ability: ${hero.ability.name}</div>
      <div style="font-size:0.75rem; color:white; line-height:1.4;">${hero.ability.desc}</div>
    </div>
    <div style="font-size:0.75rem; color:var(--dc-text-muted); text-align:left;">
      🔮 <strong>Recommended Set Bonus:</strong> <span style="color:#a78bfa;">${setBonus}</span>
    </div>
  `;
}

function renderArkheronPoolStatus() {
  const statusEl = document.getElementById('arkheron-signup-pool-status');
  const rosterEl = document.getElementById('arkheron-signup-pool-roster');
  if (!statusEl || !rosterEl) return;

  // Find active Arkheron tournament or pool
  let t = appState.tournaments.find(tourney => tourney.game === 'arkheron' && tourney.status === 'signup');
  
  if (!t) {
    statusEl.innerHTML = `No active Arkheron tournament pool open. Click below to initiate the <strong>Arkheron Weekly Tournament</strong>!`;
    rosterEl.innerHTML = `<span style="font-size:0.75rem; color:var(--dc-text-muted);">Pool is empty.</span>`;
    return;
  }

  const registeredCount = t.pool.length;
  const checkedInCount = (t.checkedIn || []).length;
  statusEl.innerHTML = `Active Signup Pool: <strong style="color:white;">${registeredCount} registered</strong> (<strong style="color:#10b981;">${checkedInCount} checked in</strong>).`;

  if (t.pool.length === 0) {
    rosterEl.innerHTML = `<span style="font-size:0.75rem; color:var(--dc-text-muted);">Pool is empty.</span>`;
  } else {
    rosterEl.innerHTML = t.pool.map(username => {
      const pl = players.find(p => p.username === username) || MOCK_PLAYERS_POOL.find(p => p.username === username);
      const avatar = pl ? (pl.avatar || '👤') : '👤';
      const isCheckedIn = (t.checkedIn || []).includes(username);
      return `
        <span style="font-size:0.7rem; padding:2px 8px; border-radius:12px; background:${isCheckedIn ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}; border:1px solid ${isCheckedIn ? '#10b981' : 'var(--db-border)'}; color:white; display:inline-flex; align-items:center; gap:4px;">
          ${avatar} ${username} ${isCheckedIn ? '✅' : ''}
        </span>
      `;
    }).join('');
  }
}

function joinArkheronTournamentPool() {
  // Ensure an Arkheron tournament exists
  let t = appState.tournaments.find(tourney => tourney.game === 'arkheron' && tourney.status === 'signup');
  
  if (!t) {
    // Create one
    t = {
      id: 'TOURNEY-ARKHERON-WEEKLY',
      name: '🏆 Arkheron Weekly Tournament',
      game: 'arkheron',
      type: 'serpentine',
      numTeams: 4,
      status: 'signup',
      pool: ['Resteral.TV', 'TofuShark', 'TowerGod', 'Dahla', 'Rynshi'],
      checkedIn: ['Resteral.TV', 'TofuShark', 'TowerGod'],
      teams: [],
      matches: [],
      createdAt: new Date().toISOString()
    };
    appState.tournaments.push(t);
  }

  if (!t.pool.includes(appState.currentUser)) {
    t.pool.push(appState.currentUser);
  }

  t.checkedIn = t.checkedIn || [];
  if (!t.checkedIn.includes(appState.currentUser)) {
    t.checkedIn.push(appState.currentUser);
  }

  playSound('milestone');
  showToast(`Successfully registered & checked into the Arkheron Tournament Pool!`, "success");
  
  // Post to persistent Discord sidebar chat
  writeMessage("ArkheronBot", true, `🏆 **${appState.currentUser}** has joined the **Arkheron Weekly Tournament** signup pool!`, null);

  renderArkheronTab();
}

// ==========================================
// 🎯 ARKHERON BUILDS & STRATEGY ENGINE
// ==========================================

const ARKHERON_STRATEGIES = {
  leodin: {
    burst: {
      name: "⚡ Gale-Blade Assassin",
      relics: ["Crown of Hurricanes", "Tempest Edge", "Wind-Walker Boots"],
      setAffinity: "Tempest (+12% Speed, Wind Trails)",
      skillMax: "Max Q (Gale Slash) > E (Aero Reposition) > W (Wind Wall)",
      statsTarget: "Speed: S+ | Attack Damage: 240 | CDR: 20%",
      combos: "Q (Whirlwind Knockup) ➔ Auto Attack ➔ E (Dash behind) ➔ R (Windstorm Execution)",
      scrimStrategy: "Role as split-pusher and backline diver. Wait for enemy Tank to engage before flanking squishy Mages.",
      counters: "Strong against Edani & squishies. Weak against Karriv frontline CC."
    },
    sustain: {
      name: "🩸 Sanguine Wind Duelist",
      relics: ["Bloodthorn Daggers", "Vampiric Ring", "Tempest Crown"],
      setAffinity: "Bloodthorn (+8% Lifesteal, Bleed)",
      skillMax: "Max W (Sanguine Strike) > Q (Gale Slash) > E (Parry)",
      statsTarget: "Lifesteal: 28% | Max HP: 2,800 | Attack Speed: 1.85/s",
      combos: "W (Sanguine buff) ➔ Q (Engage) ➔ Sustained Auto Attacks ➔ E (Dodge heavy CC)",
      scrimStrategy: "Excel in 1v2 skirmishes around Relic Shrines. Trade HP aggressively to out-sustain enemy bruisers.",
      counters: "Strong against Dahla & Tanks. Weak against burst Mages like Edani."
    },
    tank: {
      name: "🛡️ Hurricane Juggernaut",
      relics: ["Solar Crest Shield", "Crown of Hurricanes", "Titan Cuirass"],
      setAffinity: "Solar Flare (+25 Armor, +100 Max HP)",
      skillMax: "Max E (Wind Shield) > Q (Whirlwind Knockup) > W (Taunt)",
      statsTarget: "Max HP: 3,900 | Armor: 160 | Speed: A-",
      combos: "E (Shield up) ➔ Flash In ➔ Q (AoE Knockup 3 enemies) ➔ Team cleans up",
      scrimStrategy: "Primary engage initiator for 5v5 teamfights. Hold chokepoints and force enemy focus on you.",
      counters: "Strong against physical assassins. Weak against armor-shredding relics."
    }
  },
  rynshi: {
    burst: {
      name: "🥷 Shadow-Decoy One-Shot",
      relics: ["Rift Scepter", "Crown of Hurricanes", "Void Dagger"],
      setAffinity: "Voidbringer (+15% CDR) & Tempest",
      skillMax: "Max Q (Aero Decoy) > W (Shadow Step) > E (Poison Blade)",
      statsTarget: "AP: 310 | CDR: 35% | Movement Speed: S+",
      combos: "W (Stealth behind target) ➔ Q (Place Decoy) ➔ Auto-Explode ➔ W (Recast to escape)",
      scrimStrategy: "Infiltrate enemy backline during Objective fights. Eliminate high-value targets in < 1.5s.",
      counters: "Strong against Edani & low-mobility ADCs. Weak against True Sight & Karriv CC."
    },
    sustain: {
      name: "🩸 Venomous Shadow Stalker",
      relics: ["Bloodthorn Daggers", "Shadow Cloak", "Agility Band"],
      setAffinity: "Bloodthorn (+8% Lifesteal)",
      skillMax: "Max E (Poison Blade) > Q (Decoy) > W (Shadow Step)",
      statsTarget: "Attack Speed: 2.1/s | Lifesteal: 22% | Speed: S",
      combos: "E (Apply Poison) ➔ Auto x3 ➔ Q (Decoy) ➔ Re-engage for execute",
      scrimStrategy: "Kite enemies through narrow corridors. Use poison stack damage over time.",
      counters: "Strong against single-target tanks. Weak against AoE burst spells."
    },
    tank: {
      name: "🛡️ Illusory Tank Decoy",
      relics: ["Solar Crest Shield", "Vessel of Souls", "Shadow Ward"],
      setAffinity: "Solar Flare (+25 Armor)",
      skillMax: "Max Q (Aero Decoy) > E (Disarm) > W (Shadow Step)",
      statsTarget: "Max HP: 3,400 | Dodge Rate: 35% | CDR: 25%",
      combos: "W (Stealth into choke) ➔ Q (Spawn Decoy) ➔ Force enemy ultimate spells on decoy",
      scrimStrategy: "Bait enemy ultimate cooldowns using stealth and decoys before team fights begin.",
      counters: "Strong against skill-shot reliant teams. Weak against point-and-click spells."
    }
  },
  dahla: {
    burst: {
      name: "⚡ Blood-Burst Reaper",
      relics: ["Bloodthorn Daggers", "Rift Scepter", "Executioner Ring"],
      setAffinity: "Bloodthorn (+8% Lifesteal, Bleed)",
      skillMax: "Max Q (Sanguine Fury) > E (Vampiric Bite) > W (Blood Dash)",
      statsTarget: "Attack Damage: 270 | Lifesteal: 32% | Burst: S",
      combos: "W (Blood Dash in) ➔ Q (Sanguine Fury) ➔ E (Vampiric Bite Execute)",
      scrimStrategy: "Target low HP targets in team fights to reset Sanguine Fury duration endlessly.",
      counters: "Strong against isolated targets. Weak against hard CC chains."
    },
    sustain: {
      name: "🩸 Immortal Blood Lord",
      relics: ["Bloodthorn Daggers", "Vessel of Souls", "Titan Cuirass"],
      setAffinity: "Bloodthorn & Solar Flare Hybrid",
      skillMax: "Max E (Vampiric Bite) > Q (Sanguine Fury) > W (Blood Shield)",
      statsTarget: "Max HP: 4,100 | Lifesteal: 40% | Armor: 120",
      combos: "Sustained auto-attacks in center of enemy team. Cast E on lowest HP enemy.",
      scrimStrategy: "Become unkillable frontline bruiser. Stand in choke points and drain enemy team.",
      counters: "Strong against teams without Anti-heal. Weak against Executioner debuffs."
    },
    tank: {
      name: "🛡️ Crimson Fortress",
      relics: ["Solar Crest Shield", "Titan Cuirass", "Bloodthorn Ring"],
      setAffinity: "Solar Flare (+25 Armor, +100 Max HP)",
      skillMax: "Max W (Blood Shield) > E (Bite) > Q (Fury)",
      statsTarget: "Max HP: 4,500 | Armor: 180 | Magic Resist: 140",
      combos: "W (Shield) ➔ Soak damage ➔ E (Heal back chunk) ➔ Body block skill shots",
      scrimStrategy: "Peel for your team's carry. Eat enemy ultimate abilities.",
      counters: "Strong against physical burst. Weak against percentage HP damage."
    }
  },
  karriv: {
    burst: {
      name: "⚡ Sol-Blast Paladin",
      relics: ["Crown of Hurricanes", "Sol Crest Shield", "Radiant Sword"],
      setAffinity: "Solar Flare & Tempest",
      skillMax: "Max Q (Sol Blast) > W (Shield Charge) > E (Holy Aura)",
      statsTarget: "AP: 220 | Max HP: 3,200 | Burst: A+",
      combos: "W (Charge in) ➔ Hold Shield ➔ Q (Release 150% Sol Blast) ➔ E (Holy Aura pulse)",
      scrimStrategy: "Soak initial burst, then reflect massive AoE damage back into clustered enemies.",
      counters: "Strong against predictable burst combos. Weak against ranged kiting."
    },
    sustain: {
      name: "🩸 Radiant Redeemer",
      relics: ["Solar Crest Shield", "Bloodthorn Ring", "Holy Chalice"],
      setAffinity: "Solar Flare & Bloodthorn",
      skillMax: "Max E (Holy Aura Heal) > Q (Sol Blast) > W (Charge)",
      statsTarget: "Max HP: 3,800 | Team Healing: High | Armor: 140",
      combos: "E (Maintain Aura) ➔ Body block for carries ➔ W (Knockback assassins)",
      scrimStrategy: "Provide continuous aura healing to teammates while frontline tanking.",
      counters: "Strong against poke compositions. Weak against heavy crowd control."
    },
    tank: {
      name: "🛡️ Unyielding Bastion",
      relics: ["Solar Crest Shield", "Titan Cuirass", "Vessel of Souls"],
      setAffinity: "Solar Flare (+25 Armor, +100 Max HP)",
      skillMax: "Max W (Shield Charge) > E (Holy Guard) > Q (Blast)",
      statsTarget: "Max HP: 4,800 | Armor: 210 | Magic Resist: 160",
      combos: "W (Charge in) ➔ E (Absorb) ➔ Body-block chokepoints ➔ Protect objectives",
      scrimStrategy: "The ultimate frontline tank in Arkheron. Hold the Relic Shrine objective against all odds.",
      counters: "Strong against all physical compositions. Weak against true damage."
    }
  },
  edani: {
    burst: {
      name: "⚡ Singularity Nuke Wizard",
      relics: ["Rift Scepter", "Voidbringer Crown", "Orb of Oblivion"],
      setAffinity: "Voidbringer (+15% CDR, Gravity Anomaly)",
      skillMax: "Max Q (Void Collapse) > W (Singularity Ray) > E (Phase Shift)",
      statsTarget: "AP: 380 | CDR: 40% | Mana: 2,400",
      combos: "Q (Void Collapse pull) ➔ W (Singularity Ray beam through pulled enemies) ➔ E (Phase out)",
      scrimStrategy: "Wipe entire teams in objective chokepoints. Wait for Karriv/Leodin to clump enemies.",
      counters: "Strong against clumped teams & low mobility tanks. Weak against Rynshi stealth."
    },
    sustain: {
      name: "🩸 Rift Siphon Archmage",
      relics: ["Rift Scepter", "Bloodthorn Ring", "Voidbringer Crown"],
      setAffinity: "Voidbringer & Bloodthorn",
      skillMax: "Max W (Singularity Ray) > Q (Void Collapse) > E (Shift)",
      statsTarget: "AP: 290 | Spell Vamp: 20% | CDR: 30%",
      combos: "Keep W ray active on enemy tanks ➔ Siphon health continuous beam",
      scrimStrategy: "Provide constant DPS and spell vamp sustain during prolonged teamfights.",
      counters: "Strong against low-range bruisers. Weak against long-range snipers."
    },
    tank: {
      name: "🛡️ Void Barrier Controller",
      relics: ["Rift Scepter", "Titan Cuirass", "Void Guard"],
      setAffinity: "Voidbringer & Solar Flare",
      skillMax: "Max E (Phase Shield) > Q (Void Collapse) > W (Ray)",
      statsTarget: "Max HP: 3,500 | AP: 180 | Armor: 110",
      combos: "Q (Zone control pull) ➔ E (Shield & Phase shift) ➔ Disrupt enemy backline",
      scrimStrategy: "Zone denial. Prevent enemy carries from entering the Relic Shrine area.",
      counters: "Strong against melee engage comps. Weak against hyper-carries with cleanse."
    }
  }
};

function updateArkheronStrategyView() {
  const heroSelect = document.getElementById('arkheron-strategy-hero-select');
  const presetSelect = document.getElementById('arkheron-strategy-preset-select');
  const outputBox = document.getElementById('arkheron-strategy-output-box');
  if (!heroSelect || !presetSelect || !outputBox) return;

  const heroKey = heroSelect.value || 'leodin';
  const presetKey = presetSelect.value || 'burst';

  const heroData = ARKHERON_STRATEGIES[heroKey] || ARKHERON_STRATEGIES.leodin;
  const strat = heroData[presetKey] || heroData.burst;

  outputBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:12px;">
      <h4 style="margin:0; font-size:1.1rem; color:#fbbf24; text-align:left;">${strat.name}</h4>
      <span class="badge" style="background:#8b5cf6; margin:0;">${strat.setAffinity}</span>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px; text-align:left; font-size:0.75rem;">
      <div style="background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid var(--db-border);">
        <strong style="color:white; display:block; margin-bottom:2px;">📦 CORE RELIC PATH:</strong>
        <span style="color:#a78bfa;">${strat.relics.join(' ➔ ')}</span>
      </div>
      <div style="background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid var(--db-border);">
        <strong style="color:white; display:block; margin-bottom:2px;">🎯 TARGET STAT BENCHMARKS:</strong>
        <span style="color:#10b981;">${strat.statsTarget}</span>
      </div>
    </div>

    <div style="font-size:0.75rem; text-align:left; margin-bottom:10px;">
      <strong style="color:white; display:block; margin-bottom:2px;">⚡ SKILL MAXING PRIORITY:</strong>
      <span style="color:#fbbf24; font-weight:bold;">${strat.skillMax}</span>
    </div>

    <div style="background:rgba(139,92,246,0.08); border-left:3px solid #8b5cf6; padding:10px; border-radius:4px; text-align:left; margin-bottom:10px; font-size:0.75rem;">
      <strong style="color:white; display:block; margin-bottom:2px;">⚔️ SCRIM TEAMFIGHT & COMBO EXECUTION:</strong>
      <div style="color:#e2e8f0; margin-bottom:4px;"><strong>Combo:</strong> <code>${strat.combos}</code></div>
      <div style="color:var(--dc-text-muted); line-height:1.4;">${strat.scrimStrategy}</div>
    </div>

    <div style="font-size:0.7rem; color:var(--dc-text-muted); text-align:left;">
      🔄 <strong>Matchup Dynamics:</strong> <span style="color:white;">${strat.counters}</span>
    </div>
  `;
}


