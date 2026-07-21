// ==========================================
// CUSTOM LOBBIES MATCHMAKER PORTAL
// ==========================================

const GAMES = ['arkheron', 'hockey', 'zealot'];

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
  { username: 'TofuShark', avatar: '🦊', games: { arkheron: { elo: 1050, wins: 5, losses: 3, kd: "1.25", eloHistory: [1000, 1020, 1050] }, hockey: { elo: 1000, wins: 2, losses: 2, kd: "1.00", eloHistory: [1000] }, zealot: { elo: 980, wins: 1, losses: 3, kd: "0.50", eloHistory: [1000, 980] } } },
  { username: 'TowerGod', avatar: '👑', games: { arkheron: { elo: 1200, wins: 12, losses: 4, kd: "2.10", eloHistory: [1000, 1050, 1120, 1200] }, hockey: { elo: 1100, wins: 6, losses: 2, kd: "1.80", eloHistory: [1000, 1100] }, zealot: { elo: 1150, wins: 8, losses: 3, kd: "1.90", eloHistory: [1000, 1150] } } },
  { username: 'Rynshi', avatar: '🥷', games: { arkheron: { elo: 950, wins: 2, losses: 6, kd: "0.60", eloHistory: [1000, 950] }, hockey: { elo: 1020, wins: 3, losses: 2, kd: "1.10", eloHistory: [1000, 1020] }, zealot: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] } } },
  { username: 'Dahla', avatar: '🧛', games: { arkheron: { elo: 1120, wins: 9, losses: 5, kd: "1.45", eloHistory: [1000, 1060, 1120] }, hockey: { elo: 980, wins: 1, losses: 4, kd: "0.40", eloHistory: [1000, 980] }, zealot: { elo: 1080, wins: 5, losses: 2, kd: "1.35", eloHistory: [1000, 1080] } } },
  { username: 'Grimwold', avatar: '❄️', games: { arkheron: { elo: 1010, wins: 4, losses: 4, kd: "1.05", eloHistory: [1000, 1010] }, hockey: { elo: 1040, wins: 5, losses: 3, kd: "1.20", eloHistory: [1000, 1040] }, zealot: { elo: 1030, wins: 4, losses: 3, kd: "1.15", eloHistory: [1000, 1030] } } }
];

// Clean starting database of competitive players (Current user only)
let players = [
  {
    username: 'Resteral.TV',
    avatar: '🛡️',
    games: {
      arkheron: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] },
      hockey: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] },
      zealot: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] }
    }
  }
];

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
  activeChannel: 'arkheron', // active channel state inside portal: 'arkheron', 'zealot', 'hockey'
  queues: {
    arkheron: [],
    hockey: [],
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
  forumPosts: [],
  advertisedStreams: [
    {
      id: 'STREAM-SEED',
      author: 'Resteral.TV',
      platform: 'twitch',
      url: 'https://twitch.tv/resteraltv',
      title: '🎥 Scrimming live on Arkheron custom lobbies! Join in.',
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
      const limit = game === 'hockey' ? 8 : 6;
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
      const limit = game === 'hockey' ? 8 : 6;
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

    const requiredPlayers = game === 'hockey' ? 8 : 6;
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
    
    const requiredPlayers = game === 'hockey' ? 8 : 6;
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
            `🏒 **Zealot Hockey:** MMR: **${p.games.hockey?.elo || 1000}** (W/L: ${p.games.hockey?.wins}-${p.games.hockey?.losses})\n` +
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

  const requiredPlayers = game === 'hockey' ? 8 : 6;
  const lobbyNames = appState.queues[game].slice(0, requiredPlayers);
  appState.queues[game] = appState.queues[game].slice(requiredPlayers);
  
  const lobbyPlayers = lobbyNames.map(name => players.find(p => p.username === name));
  lobbyPlayers.sort((a, b) => b.games[game].elo - a.games[game].elo);
  
  const capA = lobbyPlayers[0]; 
  const capB = lobbyPlayers[1]; 
  const restPlayers = lobbyPlayers.slice(2).map(p => p.username);

  const pickSequence = game === 'hockey' ? ['B', 'A', 'A', 'B', 'B', 'A'] : ['B', 'A', 'A', 'B'];

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

  renderLeaderboard();

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
  const limit = game === 'hockey' ? 8 : 6;
  
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

const GAMES = ['arkheron', 'hockey', 'zealot'];

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
  hockey: [],
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
  else if (channelName.includes('hockey')) channelGame = 'hockey';
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

    return `
      <div class="db-card" style="padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1.5px solid ${p.color || '#7c3aed'}; background: var(--dc-bg-chat); border-radius: 6px; position: relative; box-shadow: 0 0 10px ${p.color || '#7c3aed'}22;">
        ${wBadge}
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.5rem;">${p.avatar || '👤'}</span>
          <div>
            <div style="font-weight: bold; font-size: 0.9rem; color: white;">
              ${p.username}
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
          <span>🏒 Hock: <strong>${p.games.hockey?.elo || 1000}</strong></span>
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
  const playersPerTeam = t.game === 'hockey' ? 4 : 3;
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
  const playersPerTeam = t.game === 'hockey' ? 4 : 3;
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

  const targetSize = t.game === 'hockey' ? 4 : 3;
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

  const targetSize = t.game === 'hockey' ? 4 : 3;
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
            const targetSize = t.game === 'hockey' ? 4 : 3;
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
      games: { arkheron: { elo: 1000 }, hockey: { elo: 1000 }, zealot: { elo: 1000 } }
    };

    const dateStr = new Date(post.createdAt).toLocaleDateString() + ' ' + new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const arkElo = author.games.arkheron?.elo || 1000;
    const hockElo = author.games.hockey?.elo || 1000;
    const zealElo = author.games.zealot?.elo || 1000;
    const avgElo = Math.round((arkElo + hockElo + zealElo) / 3);

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
    document.getElementById('stream-url-input').value = 'https://twitch.tv/' + appState.currentUser.toLowerCase().replace('.', '');
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
  
  const newAd = {
    id: 'STREAM-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    author,
    platform,
    url,
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
        <a href="${s.url}" target="_blank" class="btn btn-secondary" style="font-size:0.75rem; padding:4px 8px; margin:0; display:flex; align-items:center; gap:4px; text-decoration:none; color:white;">
          ${platformEmoji} Watch
        </a>
      </div>
    `;
  }).join('');
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
        ${p.avatar || '👤'} ${p.username} (Avg ELO: ${Math.round(((p.games.arkheron?.elo || 1000) + (p.games.hockey?.elo || 1000) + (p.games.zealot?.elo || 1000)) / 3)})
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
          hockey: { elo: 1000, wins: 0, losses: 0, kd: "1.00", eloHistory: [1000] },
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
      GAMES.forEach(g => {
        if (referrer.games[g]) {
          referrer.games[g].elo += 15;
          if (referrer.games[g].eloHistory) {
            referrer.games[g].eloHistory.push(referrer.games[g].elo);
          }
        }
      });
      showToast(`Referral code applied! Partner ${referrer.username} received +15 ELO!`, "success");
      
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
