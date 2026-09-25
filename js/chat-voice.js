/* CustomLobbies.com - Community Chat & WebRTC Voice Channels Manager */
class ChatVoiceManager {
  constructor() {
    this.activeGuild = 'hotgirl';
    this.currentTextChannel = 'general';
    this.currentVoiceRoom = null;
    this.isMicMuted = false;
    this.isDeafened = false;
    this.creatingChannelType = 'text';

    // In-Chat Customization & Theme State
    this.currentChatTheme = 'cyber';

    // Playable In-Chat Mini-Games State
    this.inChatGameStageActive = false;
    this.activeGameType = 'aim';

    // Aim Trainer State
    this.aimScore = 0;
    this.aimHits = 0;
    this.aimClicks = 0;
    this.aimTimer = null;
    this.aimTimeLeft = 15;

    // Tic-Tac-Toe State
    this.ticBoard = Array(9).fill(null);
    this.ticTurn = 'X';
    this.ticGameActive = false;

    // Trivia State
    this.triviaQuestions = [
      { q: "What is the tickrate of CustomLobbies Premier scrim servers?", options: ["64-tick", "128-tick", "32-tick", "256-tick"], correct: 1 },
      { q: "Which game features WARDOG 33v33v33 Tri-Faction conquest?", options: ["CS2", "Empulse / CustomLobbies Engine", "Valorant", "Slapshot"], correct: 1 },
      { q: "In CS2, what is the default length of competitive regulation rounds?", options: ["MR12", "MR15", "MR30", "MR10"], correct: 0 },
      { q: "Which rank tier grants the Electro Crest in CustomLobbies MMR?", options: ["Gold", "Platinum", "Diamond+", "Unranked"], correct: 2 }
    ];
    this.currentTriviaIdx = 0;
    this.triviaScore = 0;

    const defaultGuilds = {
      'hotgirl': { name: 'Hot Girl Central', icon: '🔥' },
      'cs2scrims': { name: 'CS2 Scrims & LFG', icon: '🎯' },
      'wardogs': { name: 'WARDOG HQ', icon: '🐕' },
      'debate': { name: 'Debate Arena', icon: '🗣️' }
    };
    
    // Load from admin settings if present
    const savedGuilds = localStorage.getItem('cl_admin_servers');
    this.guilds = savedGuilds ? JSON.parse(savedGuilds) : defaultGuilds;

    this.availableStickers = [
      { id: 'fire', emoji: '🔥', name: 'Fire Play' },
      { id: 'crown', emoji: '👑', name: 'Crown MVP' },
      { id: 'hilarious', emoji: '😂', name: 'Hilarious' },
      { id: 'electro', emoji: '⚡', name: 'Electro GG' },
      { id: 'rip', emoji: '💀', name: 'R.I.P.' },
      { id: 'bullseye', emoji: '🎯', name: 'Bullseye' },
      { id: 'moon', emoji: '🚀', name: 'To The Moon' },
      { id: 'diamond', emoji: '💎', name: 'Diamond Rank' },
      { id: 'trophy', emoji: '🏆', name: 'Champion' },
      { id: 'ghost', emoji: '👻', name: 'Ghosted' },
      { id: 'cyber', emoji: '👾', name: 'Cyber Boss' },
      { id: 'shield', emoji: '🛡️', name: 'Anti-Cheat' }
    ];

    this.pinnedStickers = [];

    // Dedicated Team & Clan Channels
    this.teamChannels = [];
    this.loadTeamChannels();

    // Per-Channel Match Lobby & Team Pool Engine
    this.channelLobbies = {};

    this.channelGameMap = {
      'wardogs': {
        game: 'WARDOGS',
        icon: '🐕',
        topic: 'WARDOGS 7v7 Frontline Scrims, LFG & Battalion Matchmaking Pool',
        maxPerTeam: 7,
        map: 'Amber Strike Frontline'
      },
      'cs2-scrims': {
        game: 'Counter-Strike 2',
        icon: '🎯',
        topic: 'Counter-Strike 2 5v5 Premier Scrims, FaceIt Rules & Team Pools',
        maxPerTeam: 5,
        map: 'Mirage'
      },
      'valorant': {
        game: 'Valorant',
        icon: '⚡',
        topic: 'Valorant 5v5 Competitive, Radiant LFG & Agent Veto Drafts',
        maxPerTeam: 5,
        map: 'Ascent'
      },
      'marvel-rivals': {
        game: 'Marvel Rivals',
        icon: '💥',
        topic: 'Marvel Rivals 6v6 Vanguard & Duelist Team Pools & Scrims',
        maxPerTeam: 6,
        map: 'Tokyo 2099'
      },
      'rocket-league': {
        game: 'Rocket League',
        icon: '🏎️',
        topic: 'Rocket League 3v3 High-Octane Aerials & Ranked Scrims',
        maxPerTeam: 3,
        map: 'Champions Field'
      },
      'deadlock': {
        game: 'Deadlock',
        icon: '🔮',
        topic: 'Deadlock 6v6 Lane Coordination, Hero Picks & Team Scrims',
        maxPerTeam: 6,
        map: 'Midtown Lanes'
      },
      'the-finals': {
        game: 'The Finals',
        icon: '🏆',
        topic: 'The Finals 3v3 Cashout Arena & Destruction Scrims',
        maxPerTeam: 3,
        map: 'Monaco'
      },
      'slapshot': {
        game: 'Slapshot: Rebound',
        icon: '🏒',
        topic: 'Slapshot: Rebound 3v3 Ranked Puck Matches & Custom Rinks',
        maxPerTeam: 3,
        map: 'Puck Arena Stadium'
      },
      'empulse': {
        game: 'Empulse',
        icon: '🚀',
        topic: 'Empulse 5v5 Fast-Paced Arena Scrims & Match Lobbies',
        maxPerTeam: 5,
        map: 'Neo District'
      },
      'rematch': {
        game: 'REMATCH',
        icon: '⚽',
        topic: 'REMATCH 5v5 Street Ball, Striker Pools & Scrims',
        maxPerTeam: 5,
        map: 'San Siro Arena'
      },
      'r6-siege': {
        game: 'Rainbow Six Siege',
        icon: '🛡️',
        topic: 'Rainbow Six Siege 5v5 Tactical Bomb Defusal & Scrims',
        maxPerTeam: 5,
        map: 'Clubhouse'
      },
      'dota2': {
        game: 'Dota 2',
        icon: '⚔️',
        topic: 'Dota 2 5v5 Ranked Captains Mode & Scrim Matchmaking',
        maxPerTeam: 5,
        map: 'The Ancient Battlefield'
      },
      'overwatch2': {
        game: 'Overwatch 2',
        icon: '🤖',
        topic: 'Overwatch 2 5v5 Competitive Role Queue & Team Scrims',
        maxPerTeam: 5,
        map: "King's Row"
      },
      'arkheron': {
        game: 'Arkheron',
        icon: '🏰',
        topic: 'Arkheron 5v5 Dark Fantasy Conquest & Match Pools',
        maxPerTeam: 5,
        map: 'Eldritch Ruins'
      }
    };

    this.textMessages = {
      'general': [
        {
          id: 1,
          author: 'CustomLobbiesBot',
          text: '🤖 Welcome to CustomLobbies Community Hub! Type <b>-help</b> to view commands or <b>-j</b> to join matchmaking pools. Ranked 128-tick scrimmage servers are online!',
          time: '11:58 AM',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80'
        },
        {
          id: 2,
          author: 'S1mple_Fragger',
          text: 'Anyone down for 5v5 Mirage scrim? Need an IGL and support player 🎯',
          time: '12:02 PM',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
        },
        {
          id: 3,
          author: 'Valkyrie_CS',
          text: 'I can AWP or anchor B site! Joining queue now.',
          time: '12:04 PM',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80',
          sticker: { emoji: '🔥', name: 'Fire Play' }
        },
        {
          id: 4,
          author: 'ApexGod99',
          text: 'Lobby match draft just finished, our squad is ready for the tournament bracket! 🏆',
          time: '12:08 PM',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80'
        }
      ],
      'welcome': [
        { id: 10, author: 'CustomLobbiesBot', text: '👋 Welcome to CustomLobbies Community Hub! Select a game channel from the sidebar to chat and join queues with players!', time: '12:00 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'rules': [
        { id: 11, author: 'Admin', text: '📜 1. Be respectful to players & captains.\n2. No cheating, scripting, or unauthorized exploits.\n3. GL & HF in all matches!', time: '12:01 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'pics': [
        { id: 12, author: 'TenZ_Duelist', text: 'Clean 1v4 clutch on Ascent A site yesterday! GG!', time: '11:45 AM', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '🎯', name: 'Bullseye' } }
      ],
      'commands': [
        { id: 13, author: 'CustomLobbiesBot', text: '⚡ Supported Quick Commands: <b>-j</b> (auto-join pool), <b>-l</b> (leave pool), <b>-b</b> (view bracket), <b>-status</b> (view MMR rating), <b>-scrim</b> (launch scrim dispatcher).', time: '12:00 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'promo': [
        { id: 14, author: 'TournamentDesk', text: '📢 $2,500 Premier Summer Championship qualifiers start this weekend! Assemble your squads!', time: '10:30 AM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '🏆', name: 'Champion' } }
      ],
      'tournaments': [
        { id: 16, author: 'CustomLobbiesBot', text: '🏆 Live Tournament Bracket synchronized. Check the #tournaments tab or type <b>-b</b> in chat to inspect live matches.', time: '12:10 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      // --- DEDICATED GAME CHANNELS ---
      'wardogs': [
        { id: 101, author: 'CommanderVance', text: '🔥 WARDOG 7v7 squad recruiting! Need 2 assault and 1 heavy anchor for Amber Strike Frontline!', time: '11:40 AM', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=80&auto=format&fit=crop&q=80' },
        { id: 102, author: 'IronClad_77', text: 'Signing in with Battalion Alpha. Tank armor buffed on current patch 🐕', time: '11:55 AM', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '🔥', name: 'Fire Play' } },
        { id: 103, author: 'CustomLobbiesBot', text: '🐕 WARDOGS 7v7 lobby match engine ready. Click <b>"Join Pool (-j)"</b> above to queue into the frontline battalion pool!', time: '12:00 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'cs2-scrims': [
        { id: 104, author: 'S1mple_Fragger', text: 'Looking for 5v5 Premier scrim on Mirage or Inferno. 2800+ MMR, join pool!', time: '11:50 AM', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80' },
        { id: 105, author: 'Device_CS', text: 'Ready to AWP. Join Team Bravo! 🎯', time: '12:01 PM', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
        { id: 106, author: 'CustomLobbiesBot', text: '🎯 Dedicated 128-tick CS2 scrim server is primed. Use <b>-j 1</b> or <b>-j 2</b> to pick a side!', time: '12:05 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'valorant': [
        { id: 107, author: 'TenZ_Duelist', text: 'Need a Controller and Initiator for Ascent 5v5 scrim. Let\'s run it!', time: '11:48 AM', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '⚡', name: 'Electro GG' } },
        { id: 108, author: 'Valkyrie_CS', text: 'Omen main locked in. Ready to queue!', time: '12:03 PM', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80' },
        { id: 109, author: 'CustomLobbiesBot', text: '⚡ Valorant 1-2-2-1 Snake Draft available. Click <b>"Snake Draft"</b> above to draft your roster!', time: '12:10 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'marvel-rivals': [
        { id: 110, author: 'CyberBoss', text: '6v6 Marvel Rivals lobby forming! Need Vanguard tank & support!', time: '11:35 AM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '👾', name: 'Cyber Boss' } },
        { id: 111, author: 'StormCaller', text: 'Magneto / Doctor Strange ready to tank. Let\'s go!', time: '11:58 AM', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' }
      ],
      'rocket-league': [
        { id: 112, author: 'AerialGod', text: '3v3 Champions Field lobby open! High speed aerials only 🏎️', time: '11:42 AM', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '🚀', name: 'To The Moon' } },
        { id: 113, author: 'BoostMonster', text: 'Need 1 solid third man for ranked scrims. Fast rotations!', time: '12:02 PM', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80' }
      ],
      'deadlock': [
        { id: 114, author: 'SevenMain', text: '6v6 Deadlock mid-lane draft starting. Type -j to join! 🔮', time: '11:30 AM', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80' },
        { id: 115, author: 'WraithCarry', text: 'Soul farm speedrun ready. Joining lane 2.', time: '11:52 AM', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80' }
      ],
      'the-finals': [
        { id: 116, author: 'CashoutKing', text: '3v3 The Finals destruction lobby ready! Running Heavy sledge + Medium heal 🏆', time: '11:25 AM', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=80&auto=format&fit=crop&q=80' },
        { id: 117, author: 'LightSniper', text: 'Seoul arena selected. Let\'s get the vault!', time: '11:49 AM', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80' }
      ],
      'slapshot': [
        { id: 118, author: 'PuckMaster', text: '3v3 Slapshot: Rebound open for scrimmage. Pass-first mentality! 🏒', time: '11:15 AM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
        { id: 119, author: 'SlapShotGoalie', text: 'In net and warmed up. Join rink!', time: '11:38 AM', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' }
      ],
      'empulse': [
        { id: 120, author: 'NeonDrifter', text: '5v5 Empulse speed arena scrimmage open. High mobility required! 🚀', time: '11:20 AM', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' }
      ],
      'rematch': [
        { id: 121, author: 'StrikerPro', text: '5v5 REMATCH street ball tournament qualifier forming! ⚽', time: '11:10 AM', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' }
      ],
      'r6-siege': [
        { id: 122, author: 'MiraAnchor', text: '5v5 Clubhouse bomb defense scrim. Need thermite & thatcher on attack! 🛡️', time: '11:32 AM', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80' }
      ],
      'dota2': [
        { id: 123, author: 'MidOrFeed', text: '5v5 Captains Mode scrim, Ancient 5 / Divine lobby. Drafting now! ⚔️', time: '11:05 AM', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80' }
      ],
      'overwatch2': [
        { id: 124, author: 'MainTankSigma', text: '5v5 King\'s Row competitive scrim. Looking for hitscan DPS and flex support! 🤖', time: '11:28 AM', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80' }
      ],
      'arkheron': [
        { id: 125, author: 'VoidKnight', text: '5v5 Eldritch Ruins dark fantasy conquest match recruiting! 🏰', time: '11:18 AM', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=80&auto=format&fit=crop&q=80' }
      ]
    };

    this.onlineUsers = [
      { name: 'S1mple_Fragger', mmr: 2850, teamTag: 'NAVI', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80' },
      { name: 'ZywOo_Master', mmr: 2810, teamTag: 'VIT', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' },
      { name: 'ApexGod99', mmr: 2450, teamTag: 'APEX', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80' },
      { name: 'Valkyrie_CS', mmr: 2380, teamTag: 'VALK', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80' },
      { name: 'Marshal_Vanguard', mmr: 2320, teamTag: 'VANG', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=80&auto=format&fit=crop&q=80' },
      { name: 'TenZ_Duelist', mmr: 2720, teamTag: 'SEN', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80' },
      { name: 'NiKo_Rifler', mmr: 2690, teamTag: 'FALC', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
      { name: 'Shroud_Echo', mmr: 2540, teamTag: 'OG', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' },
      { name: 'Faker_Mid', mmr: 2900, teamTag: 'T1', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' },
      { name: 'Device_CS', mmr: 2480, teamTag: 'ASTR', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' }
    ];
  }

  init() {
    this.renderGuildRail();
    this.renderTeamChannels();
    this.loadPinnedStickers();
    this.loadChatTheme();
    this.renderMessages();
    this.renderOnlineUsers();
    this.renderStickerPalette();
    this.renderDashboardStickers();
    this.setupEventListeners();
  }

  renderGuildRail() {
    const rail = document.getElementById('discordServerRailContainer');
    if (!rail) return;
    
    // Clear existing servers (keep the boost badge container and purchase button)
    Array.from(rail.children).forEach(child => {
        if (child.id !== 'serverBoostBadgeContainer' && child.id !== 'serverPurchaseBtnContainer') {
            child.remove();
        }
    });

    const purchaseBtn = document.getElementById('serverPurchaseBtnContainer');
    const boostBadge = document.getElementById('serverBoostBadgeContainer');

    for (const [key, guild] of Object.entries(this.guilds)) {
      const el = document.createElement('div');
      el.className = `server-icon ${this.activeGuild === key ? 'active' : ''}`;
      el.setAttribute('data-guild', key);
      el.title = guild.name;
      el.innerHTML = `<span>${guild.icon}</span>`;
      
      if (purchaseBtn) {
          rail.insertBefore(el, purchaseBtn);
      } else if (boostBadge) {
          rail.insertBefore(el, boostBadge);
      } else {
          rail.appendChild(el);
      }
    }
    // Delegated click handler on document handles .server-icon clicks
  }

  loadChatTheme() {
    try {
      const savedTheme = localStorage.getItem('cl_chat_theme_v1') || 'cyber';
      this.setChatTheme(savedTheme, false);
    } catch (e) {
      this.setChatTheme('cyber', false);
    }
  }

  setChatTheme(themeId, save = true) {
    this.currentChatTheme = themeId;
    const container = document.getElementById('chatMainPanelContainer');
    if (container) {
      container.className = `chat-main-panel theme-${themeId}`;
    }

    document.querySelectorAll('.chat-theme-select-btn').forEach(btn => {
      const themeAttr = btn.getAttribute('data-theme-btn');
      btn.classList.toggle('active', themeAttr === themeId);
    });

    if (save) {
      try {
        localStorage.setItem('cl_chat_theme_v1', themeId);
      } catch (e) {}
    }
  }

  toggleChatCustomizerModal() {
    const modal = document.getElementById('chatCustomizerModal');
    if (modal) {
      modal.classList.toggle('active');
    }
  }

  // Playable In-Chat Mini-Games Suite
  toggleChatMiniGameStage() {
    const stage = document.getElementById('chatMiniGameStage');
    if (!stage) return;

    this.inChatGameStageActive = !this.inChatGameStageActive;
    stage.style.display = this.inChatGameStageActive ? 'block' : 'none';

    if (this.inChatGameStageActive) {
      this.selectMiniGame('aim');
    } else {
      if (this.aimTimer) clearInterval(this.aimTimer);
    }
  }

  selectMiniGame(gameType) {
    this.activeGameType = gameType;
    if (this.aimTimer) clearInterval(this.aimTimer);

    if (gameType === 'aim') {
      this.startAimTrainerGame();
    } else if (gameType === 'tictactoe') {
      this.startTicTacToeGame();
    } else if (gameType === 'trivia') {
      this.startEsportsTriviaGame();
    }
  }

  renderGameHeader(activeType) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.6rem; margin-bottom: 0.8rem;">
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn btn-secondary btn-sm ${activeType === 'aim' ? 'active' : ''}" onclick="window.chatVoiceManager.selectMiniGame('aim')">🎯 Aim Trainer</button>
          <button class="btn btn-secondary btn-sm ${activeType === 'tictactoe' ? 'active' : ''}" onclick="window.chatVoiceManager.selectMiniGame('tictactoe')">❌⭕ Tic-Tac-Toe</button>
          <button class="btn btn-secondary btn-sm ${activeType === 'trivia' ? 'active' : ''}" onclick="window.chatVoiceManager.selectMiniGame('trivia')">🧠 Esports Trivia</button>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.chatVoiceManager.toggleChatMiniGameStage()">❌ Close Game</button>
      </div>
    `;
  }

  // 1. Aim Trainer Game
  startAimTrainerGame() {
    if (this.aimTimer) clearInterval(this.aimTimer);

    this.aimScore = 0;
    this.aimHits = 0;
    this.aimClicks = 0;
    this.aimTimeLeft = 15;

    const stage = document.getElementById('chatMiniGameStage');
    if (!stage) return;

    stage.innerHTML = `
      ${this.renderGameHeader('aim')}
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <span style="font-weight: 800; color: var(--accent-cyan);">🎯 128-Tick Aim & Reflex Speed Trainer</span>
        <div style="display: flex; gap: 1rem; font-size: 0.88rem; font-weight: 700;">
          <span>⏱️ Time: <span id="aimTimerDisplay" style="color: var(--accent-gold);">15s</span></span>
          <span>💥 Score: <span id="aimScoreDisplay" style="color: var(--accent-green);">0</span></span>
        </div>
      </div>
      <div id="aimPlayArea" style="position: relative; width: 100%; height: 180px; background: rgba(0,0,0,0.5); border: 1px dashed var(--border-color); border-radius: 8px; cursor: crosshair; overflow: hidden;" onclick="window.chatVoiceManager.registerAimMiss()">
      </div>
    `;

    this.spawnAimTarget();

    this.aimTimer = setInterval(() => {
      this.aimTimeLeft--;
      const timerElem = document.getElementById('aimTimerDisplay');
      if (timerElem) timerElem.textContent = `${this.aimTimeLeft}s`;

      if (this.aimTimeLeft <= 0) {
        clearInterval(this.aimTimer);
        this.finishAimTrainerGame();
      }
    }, 1000);
  }

  registerAimMiss() {
    this.aimClicks++;
  }

  spawnAimTarget() {
    const playArea = document.getElementById('aimPlayArea');
    if (!playArea) return;

    const oldTarget = playArea.querySelector('.aim-target-circle');
    if (oldTarget) oldTarget.remove();

    const target = document.createElement('div');
    target.className = 'aim-target-circle';

    const maxX = Math.max(20, playArea.clientWidth - 50);
    const maxY = Math.max(20, playArea.clientHeight - 50);
    const posX = Math.max(10, Math.floor(Math.random() * maxX));
    const posY = Math.max(10, Math.floor(Math.random() * maxY));

    target.style.left = `${posX}px`;
    target.style.top = `${posY}px`;

    const spawnTime = Date.now();
    target.onclick = (e) => {
      e.stopPropagation();
      const reactionMs = Date.now() - spawnTime;
      this.aimHits++;
      this.aimClicks++;
      this.aimScore += Math.max(10, 200 - reactionMs);

      const scoreElem = document.getElementById('aimScoreDisplay');
      if (scoreElem) scoreElem.textContent = `${this.aimScore} pts (${this.aimHits} hits)`;

      this.spawnAimTarget();
    };

    playArea.appendChild(target);
  }

  finishAimTrainerGame() {
    const playArea = document.getElementById('aimPlayArea');
    if (!playArea) return;

    const accuracy = this.aimClicks > 0 ? Math.round((this.aimHits / this.aimClicks) * 100) : 0;
    let rank = 'C';
    if (this.aimScore > 1200 && accuracy >= 80) rank = 'S+';
    else if (this.aimScore > 800) rank = 'A';
    else if (this.aimScore > 400) rank = 'B';

    playArea.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 0.6rem;">
        <h3 style="font-size: 1.3rem; color: var(--accent-gold); margin: 0;">🎉 Session Complete!</h3>
        <div style="font-size: 0.95rem; font-weight: 800; color: #fff;">
          Score: <span style="color: var(--accent-cyan);">${this.aimScore} pts</span> | Hits: ${this.aimHits} | Accuracy: ${accuracy}% | Rank: <span style="color: var(--accent-gold);">${rank}</span>
        </div>
        <div style="display: flex; gap: 0.6rem; margin-top: 0.4rem;">
          <button class="btn btn-primary btn-sm" onclick="window.chatVoiceManager.startAimTrainerGame()">🔄 Play Again</button>
          <button class="btn btn-purple btn-sm" onclick="window.chatVoiceManager.shareScoreToChat('🎯 128-Tick Aim Trainer', '${this.aimScore} pts (Rank: ${rank})', 'Hits: ${this.aimHits} | Accuracy: ${accuracy}%')">📢 Share Score to Chat</button>
        </div>
      </div>
    `;
  }

  // 2. Tic-Tac-Toe Game
  startTicTacToeGame() {
    this.ticBoard = Array(9).fill(null);
    this.ticTurn = 'X';
    this.ticGameActive = true;

    this.renderTicTacToeUI();
  }

  renderTicTacToeUI(statusMsg = 'Your turn! Click a tile to play (X vs Bot O)') {
    const stage = document.getElementById('chatMiniGameStage');
    if (!stage) return;

    stage.innerHTML = `
      ${this.renderGameHeader('tictactoe')}
      <div style="text-align: center;">
        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 0.3rem;">❌⭕ In-Chat Tic-Tac-Toe Duel</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">${statusMsg}</p>
        <div class="tic-tac-grid">
          ${this.ticBoard.map((val, idx) => `
            <div class="tic-cell" onclick="window.chatVoiceManager.playTicTacToeMove(${idx})">
              ${val ? (val === 'X' ? '<span style="color: var(--accent-cyan);">❌</span>' : '<span style="color: var(--accent-red);">⭕</span>') : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  playTicTacToeMove(idx) {
    if (!this.ticGameActive || this.ticBoard[idx]) return;

    this.ticBoard[idx] = 'X';
    const winner = this.checkTicTacToeWinner();
    if (winner) {
      this.endTicTacToeGame(winner);
      return;
    }

    // AI Bot Move
    const emptyIndices = this.ticBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (emptyIndices.length > 0) {
      const aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      this.ticBoard[aiChoice] = 'O';
      const aiWinner = this.checkTicTacToeWinner();
      if (aiWinner) {
        this.endTicTacToeGame(aiWinner);
        return;
      }
    }

    this.renderTicTacToeUI();
  }

  checkTicTacToeWinner() {
    const wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    for (let combo of wins) {
      const [a, b, c] = combo;
      if (this.ticBoard[a] && this.ticBoard[a] === this.ticBoard[b] && this.ticBoard[a] === this.ticBoard[c]) {
        return this.ticBoard[a];
      }
    }

    if (this.ticBoard.every(v => v !== null)) return 'TIE';
    return null;
  }

  endTicTacToeGame(result) {
    this.ticGameActive = false;
    let msg = '';
    let detail = '';

    if (result === 'X') {
      msg = '🎉 Victory! You defeated the Bot!';
      detail = 'Result: WINNER (+25 CL-Points)';
    } else if (result === 'O') {
      msg = '💀 Defeat! Bot won the match.';
      detail = 'Result: DEFEAT';
    } else {
      msg = '🤝 Stalemate! Tie game.';
      detail = 'Result: DRAW';
    }

    const stage = document.getElementById('chatMiniGameStage');
    if (!stage) return;

    stage.innerHTML = `
      ${this.renderGameHeader('tictactoe')}
      <div style="text-align: center; padding: 0.5rem 0;">
        <h3 style="font-size: 1.2rem; color: var(--accent-gold); margin-bottom: 0.4rem;">${msg}</h3>
        <div class="tic-tac-grid" style="pointer-events: none; opacity: 0.8;">
          ${this.ticBoard.map(val => `
            <div class="tic-cell">
              ${val ? (val === 'X' ? '<span style="color: var(--accent-cyan);">❌</span>' : '<span style="color: var(--accent-red);">⭕</span>') : ''}
            </div>
          `).join('')}
        </div>
        <div style="display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.6rem;">
          <button class="btn btn-primary btn-sm" onclick="window.chatVoiceManager.startTicTacToeGame()">🔄 Rematch</button>
          <button class="btn btn-purple btn-sm" onclick="window.chatVoiceManager.shareScoreToChat('❌⭕ Tic-Tac-Toe Duel', '${msg}', '${detail}')">📢 Share Victory to Chat</button>
        </div>
      </div>
    `;
  }

  // 3. Esports Trivia Game
  startEsportsTriviaGame() {
    this.currentTriviaIdx = 0;
    this.triviaScore = 0;
    this.renderTriviaQuestion();
  }

  renderTriviaQuestion() {
    const stage = document.getElementById('chatMiniGameStage');
    if (!stage) return;

    const qObj = this.triviaQuestions[this.currentTriviaIdx];
    if (!qObj) {
      this.finishTriviaGame();
      return;
    }

    stage.innerHTML = `
      ${this.renderGameHeader('trivia')}
      <div style="max-width: 480px; margin: 0 auto; text-align: center;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.5rem;">
          <span>🧠 Esports Trivia Challenge</span>
          <span>Question ${this.currentTriviaIdx + 1}/${this.triviaQuestions.length}</span>
        </div>
        <h4 style="font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 0.8rem;">${qObj.q}</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
          ${qObj.options.map((opt, idx) => `
            <button class="btn btn-secondary btn-sm" style="padding: 0.5rem; text-align: left;" onclick="window.chatVoiceManager.answerTriviaQuestion(${idx})">
              ${idx + 1}. ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  answerTriviaQuestion(selectedIdx) {
    const qObj = this.triviaQuestions[this.currentTriviaIdx];
    if (selectedIdx === qObj.correct) {
      this.triviaScore += 25;
    }

    this.currentTriviaIdx++;
    this.renderTriviaQuestion();
  }

  finishTriviaGame() {
    const stage = document.getElementById('chatMiniGameStage');
    if (!stage) return;

    const maxPoints = this.triviaQuestions.length * 25;
    stage.innerHTML = `
      ${this.renderGameHeader('trivia')}
      <div style="text-align: center; padding: 1rem 0;">
        <h3 style="font-size: 1.3rem; color: var(--accent-gold); margin-bottom: 0.5rem;">🧠 Trivia Quiz Finished!</h3>
        <p style="font-size: 1.05rem; font-weight: 800; color: #fff; margin-bottom: 1rem;">
          Score: <span style="color: var(--accent-cyan);">${this.triviaScore} / ${maxPoints} CL-Points</span>
        </p>
        <div style="display: flex; gap: 0.6rem; justify-content: center;">
          <button class="btn btn-primary btn-sm" onclick="window.chatVoiceManager.startEsportsTriviaGame()">🔄 Play Again</button>
          <button class="btn btn-purple btn-sm" onclick="window.chatVoiceManager.shareScoreToChat('🧠 Esports Trivia Quiz', '${this.triviaScore} / ${maxPoints} CL-Points', 'Mastered CustomLobbies & Esports Trivia')">📢 Share Score to Chat</button>
        </div>
      </div>
    `;
  }

  shareScoreToChat(gameTitle, scoreText, detailText) {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
    }

    const newMsg = {
      id: Date.now(),
      author: 'You (Host)',
      text: '',
      gameScoreCard: {
        title: gameTitle,
        score: scoreText,
        detail: detailText
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
    };

    this.textMessages[this.currentTextChannel].push(newMsg);
    this.renderMessages();
    this.notifyToast(`📢 High Score Card posted to #${this.currentTextChannel}!`, 'success');
  }

  notifyToast(msg, type = 'info') {
    if (window.widgetBuilderEngine && typeof window.widgetBuilderEngine.showToast === 'function') {
      window.widgetBuilderEngine.showToast(msg, type);
    } else {
      console.log(`[Toast ${type}]: ${msg}`);
    }
  }

  loadPinnedStickers() {
    try {
      const saved = localStorage.getItem('cl_dashboard_pinned_stickers_v1');
      if (saved) {
        this.pinnedStickers = JSON.parse(saved);
      } else {
        this.pinnedStickers = [
          { emoji: '🔥', name: 'Fire Play' },
          { emoji: '👑', name: 'Crown MVP' },
          { emoji: '⚡', name: 'Electro GG' }
        ];
      }
    } catch (e) {
      this.pinnedStickers = [
        { emoji: '🔥', name: 'Fire Play' },
        { emoji: '👑', name: 'Crown MVP' }
      ];
    }
  }

  savePinnedStickers() {
    try {
      localStorage.setItem('cl_dashboard_pinned_stickers_v1', JSON.stringify(this.pinnedStickers));
    } catch (e) {
      console.warn('Unable to save pinned stickers', e);
    }
  }

  setupEventListeners() {
    if (this._listenersAttached) return;
    this._listenersAttached = true;

    // Server Rail Clicks & Channel Selection Clicks
    document.addEventListener('click', (e) => {
      const serverIcon = e.target.closest('.server-icon[data-guild]');
      if (serverIcon) {
        const guildId = serverIcon.getAttribute('data-guild');
        this.switchGuild(guildId, serverIcon);
      }

      // Channel Selection Clicks
      const textItem = e.target.closest('[data-channel]');
      if (textItem) {
        const chan = textItem.getAttribute('data-channel');
        this.switchTextChannel(chan, textItem);
      }

      const voiceItem = e.target.closest('[data-voice]');
      if (voiceItem) {
        const vroom = voiceItem.getAttribute('data-voice');
        this.selectVoiceRoom(vroom);
      }
    });

    // Sticker drawer modal close button
    const btnCloseStickers = document.getElementById('btnCloseStickerDrawer');
    if (btnCloseStickers) {
      btnCloseStickers.addEventListener('click', () => {
        const modal = document.getElementById('stickerDrawerModal');
        if (modal) modal.classList.remove('active');
      });
    }

    // User status card mic/deafen buttons & Voice panel mic/deafen buttons
    const btnUserMic = document.getElementById('btnUserMicToggle');
    const btnUserDeafen = document.getElementById('btnUserDeafenToggle');
    const btnMic = document.getElementById('btnToggleMic');
    const btnDeafen = document.getElementById('btnToggleDeafen');

    if (btnUserMic) {
      btnUserMic.addEventListener('click', () => this.toggleMic());
    }
    if (btnMic) {
      btnMic.addEventListener('click', () => this.toggleMic());
    }

    if (btnUserDeafen) {
      btnUserDeafen.addEventListener('click', () => this.toggleDeafen());
    }
    if (btnDeafen) {
      btnDeafen.addEventListener('click', () => this.toggleDeafen());
    }

    // Chat form submit
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chatInputText');
        if (!input) return;
        const text = input.value.trim();
        if (text) {
          this.sendMessage(text);
          input.value = '';
        }
      });
    }

    // Modal Create Channel Buttons
    const btnAddText = document.getElementById('btnAddTextChannel');
    const btnAddVoice = document.getElementById('btnAddVoiceChannel');
    const modal = document.getElementById('createChannelModal');
    const btnCloseModal = document.getElementById('btnCloseChannelModal');
    const btnSubmitModal = document.getElementById('btnSubmitNewChannel');

    if (btnAddText) {
      btnAddText.addEventListener('click', () => {
        this.creatingChannelType = 'text';
        if (document.getElementById('channelModalTitle')) {
          document.getElementById('channelModalTitle').textContent = 'Create Text Channel';
        }
        if (modal) modal.classList.add('active');
      });
    }

    if (btnAddVoice) {
      btnAddVoice.addEventListener('click', () => {
        this.creatingChannelType = 'voice';
        if (document.getElementById('channelModalTitle')) {
          document.getElementById('channelModalTitle').textContent = 'Create Voice Channel Room';
        }
        if (modal) modal.classList.add('active');
      });
    }

    if (btnCloseModal && modal) {
      btnCloseModal.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (btnSubmitModal) {
      btnSubmitModal.addEventListener('click', () => this.handleCreateChannel());
    }

    // Voice Control Buttons
    const btnConnect = document.getElementById('btnConnectVoice');
    if (btnConnect) {
      btnConnect.addEventListener('click', () => this.toggleVoiceConnection());
    }
  }

  toggleMic() {
    this.isMicMuted = !this.isMicMuted;
    const btnUserMic = document.getElementById('btnUserMicToggle');
    const btnMic = document.getElementById('btnToggleMic');
    const micIcon = document.getElementById('micIcon');
    if (btnUserMic) btnUserMic.textContent = this.isMicMuted ? '🔇' : '🎙️';
    if (micIcon) micIcon.textContent = this.isMicMuted ? '🔇' : '🎙️';
    if (btnMic) btnMic.classList.toggle('btn-danger', this.isMicMuted);
    this.notifyToast(this.isMicMuted ? '🔇 Microphone Muted' : '🎙️ Microphone Live', 'info');
  }

  toggleDeafen() {
    this.isDeafened = !this.isDeafened;
    const btnUserDeafen = document.getElementById('btnUserDeafenToggle');
    const btnDeafen = document.getElementById('btnToggleDeafen');
    const deafenIcon = document.getElementById('deafenIcon');
    if (btnUserDeafen) btnUserDeafen.textContent = this.isDeafened ? '🔇' : '🎧';
    if (deafenIcon) deafenIcon.textContent = this.isDeafened ? '🔇' : '🎧';
    if (btnDeafen) btnDeafen.classList.toggle('btn-danger', this.isDeafened);
    this.notifyToast(this.isDeafened ? '🔇 Audio Output Deafened' : '🎧 Audio Output Active', 'info');
  }

  switchGuild(guildId, element) {
    this.activeGuild = guildId;
    document.querySelectorAll('.server-icon').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');

    const guildInfo = this.guilds[guildId] || { name: 'Community Hub', icon: '🌐' };
    const header = document.getElementById('guildTitleHeader');
    if (header) {
      header.innerHTML = `<span>${guildInfo.icon}</span> ${guildInfo.name} <span style="font-size: 0.75rem; color: var(--text-muted);">▼</span>`;
    }
  }

  switchTextChannel(channelName, element) {
    this.currentTextChannel = channelName;
    document.querySelectorAll('[data-channel]').forEach(el => el.classList.remove('active'));
    if (element) {
      element.classList.add('active');
    } else {
      const el = document.querySelector(`[data-channel="${channelName}"]`);
      if (el) el.classList.add('active');
    }

    const gInfo = this.channelGameMap ? this.channelGameMap[channelName] : null;
    const teamChan = this.teamChannels ? this.teamChannels.find(t => t.channelName === channelName || t.id === channelName) : null;
    const header = document.getElementById('currentChannelHeader');
    const topic = document.getElementById('currentChannelTopic');
    const input = document.getElementById('chatInputText');
    const actionBar = document.getElementById('channelGameActionBar');
    const teamActionBar = document.getElementById('channelTeamActionBar');

    if (teamChan) {
      if (actionBar) actionBar.style.display = 'none';
      if (teamActionBar) {
        teamActionBar.style.display = 'flex';
        const teamEmblem = document.getElementById('channelTeamEmblem');
        const teamTitle = document.getElementById('channelTeamTitle');
        const teamGameTag = document.getElementById('channelTeamGameTag');
        const teamDetail = document.getElementById('channelTeamDetail');
        if (teamEmblem) teamEmblem.textContent = teamChan.emblem || '🛡️';
        if (teamTitle) teamTitle.textContent = `${teamChan.tag ? teamChan.tag + ' ' : ''}${teamChan.name}`;
        if (teamGameTag) teamGameTag.textContent = `${teamChan.game} Squad Channel`;
        const count = teamChan.membersCount || (teamChan.members ? teamChan.members.length : 5);
        if (teamDetail) teamDetail.textContent = `${count} Members • Captain: ${teamChan.captain || 'Sean'} • ${teamChan.motto || 'Competitive Scrims'}`;
      }
      if (header) header.innerHTML = `<span style="margin-right: 0.35rem;">${teamChan.emblem || '🛡️'}</span> #${channelName}`;
      if (topic) topic.textContent = `${teamChan.name} (${teamChan.tag || ''}) — ${teamChan.game} • ${teamChan.motto || 'Official Team Hub'}`;
      if (input) input.placeholder = `Message ${teamChan.tag || ''} squad members, type strats, or type -j to queue...`;
    } else if (gInfo) {
      if (teamActionBar) teamActionBar.style.display = 'none';
      if (header) header.innerHTML = `<span style="margin-right: 0.35rem;">${gInfo.icon}</span> #${channelName}`;
      if (topic) topic.textContent = gInfo.topic;
      if (input) input.placeholder = `Message #${channelName} or type -j (join match pool), -help...`;

      if (actionBar) {
        actionBar.style.display = 'flex';
        const gameIcon = document.getElementById('channelGameIcon');
        const gameTitle = document.getElementById('channelGameTitle');
        const gameDetail = document.getElementById('channelGameDetail');
        const btnHost = document.getElementById('btnChannelHostLobby');
        const btnBrowse = document.getElementById('btnChannelBrowseLobbies');
        const btnDraft = document.getElementById('btnChannelSnakeDraft');
        const btnJoin = document.getElementById('btnChannelJoinPool');

        if (gameIcon) gameIcon.textContent = gInfo.icon;
        if (gameTitle) gameTitle.textContent = gInfo.game;
        if (gameDetail) gameDetail.textContent = `${gInfo.maxPerTeam * 2}p Matchmaking Hub (${gInfo.maxPerTeam}v${gInfo.maxPerTeam}) • Map: ${gInfo.map}`;
        if (btnHost) btnHost.innerHTML = `<span>➕</span> Host ${gInfo.game} Lobby`;
        if (btnBrowse) btnBrowse.innerHTML = `<span>🔥</span> Browse ${gInfo.game} Lobbies`;
        if (btnDraft) btnDraft.innerHTML = `<span>🐍</span> Snake Draft (${gInfo.game})`;
        if (btnJoin) btnJoin.innerHTML = `<span>⚡</span> Join ${gInfo.game} Pool (-j)`;
      }
    } else {
      if (teamActionBar) teamActionBar.style.display = 'none';
      if (header) header.textContent = `# ${channelName}`;
      if (topic) topic.textContent = `Discussion and chat for #${channelName}`;
      if (input) input.placeholder = `Send a message to #${channelName}...`;
      if (actionBar) actionBar.style.display = 'none';
    }

    this.renderMessages();
  }

  toggleStickerDrawer() {
    const modal = document.getElementById('stickerDrawerModal');
    if (modal) {
      modal.classList.toggle('active');
    }
  }

  renderStickerPalette() {
    const grid = document.getElementById('stickerPaletteGrid');
    if (!grid) return;

    grid.innerHTML = this.availableStickers.map(s => `
      <div class="sticker-grid-card">
        <div class="sticker-card-emoji">${s.emoji}</div>
        <div class="sticker-card-title">${s.name}</div>
        <div style="display: flex; gap: 0.3rem; margin-top: 0.3rem; width: 100%;">
          <button class="btn btn-secondary btn-sm" style="flex: 1; padding: 0.25rem 0.3rem; font-size: 0.72rem;" onclick="window.chatVoiceManager.postStickerToChat('${s.emoji}', '${s.name}')" title="Post in Chat">💬 Chat</button>
          <button class="btn btn-purple btn-sm" style="flex: 1; padding: 0.25rem 0.3rem; font-size: 0.72rem;" onclick="window.chatVoiceManager.pinStickerToDashboard('${s.emoji}', '${s.name}')" title="Pin to Dashboard">📌 Pin</button>
        </div>
      </div>
    `).join('');
  }

  postStickerToChat(stickerEmoji, stickerName) {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
    }

    const newMsg = {
      id: Date.now(),
      author: 'You (Host)',
      text: '',
      sticker: { emoji: stickerEmoji, name: stickerName },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
    };

    this.textMessages[this.currentTextChannel].push(newMsg);
    this.renderMessages();
    this.toggleStickerDrawer();
  }

  postTournamentBracketToChat() {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
    }

    const newMsg = {
      id: Date.now(),
      author: 'You (Host)',
      text: '-bracket',
      bracketCard: true,
      commandBadge: {
        title: `🏆 Live Tournament Bracket Shared`,
        text: `Shared active esports visual bracket tree directly in #${this.currentTextChannel}`
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
    };

    this.textMessages[this.currentTextChannel].push(newMsg);
    this.renderMessages();
  }

  // --- PER-CHANNEL LOBBY & TEAM POOL ENGINE (-j SYSTEM) ---
  getChannelLobby(channelKey = this.currentTextChannel) {
    if (!this.channelLobbies[channelKey]) {
      const gInfo = this.channelGameMap ? this.channelGameMap[channelKey] : null;
      if (gInfo) {
        this.channelLobbies[channelKey] = {
          game: gInfo.game,
          maxPerTeam: gInfo.maxPerTeam,
          team1Name: `${gInfo.game} Alpha 🔵`,
          team2Name: `${gInfo.game} Bravo 🔴`,
          team1: [
            { name: 'ApexGod99', mmr: 2450, role: 'Team Captain', isCaptain: true }
          ],
          team2: [
            { name: 'Valkyrie_CS', mmr: 2380, role: 'Team Captain', isCaptain: true }
          ],
          map: gInfo.map,
          status: `RECRUITING (2/${gInfo.maxPerTeam * 2} Players)`
        };
      } else {
        this.channelLobbies[channelKey] = {
          game: `Channel #${channelKey.toUpperCase()} Match`,
          maxPerTeam: 5,
          team1Name: 'Team Alpha 🔵',
          team2Name: 'Team Bravo 🔴',
          team1: [
            { name: 'ApexGod99', mmr: 2150, role: 'Entry Fragger', isCaptain: true }
          ],
          team2: [
            { name: 'Valkyrie_CS', mmr: 1840, role: 'AWPer', isCaptain: true }
          ],
          map: 'Mirage',
          status: 'RECRUITING (2/10 Players)'
        };
      }
    }
    return this.channelLobbies[channelKey];
  }

  joinChannelTeamPool(targetTeam = null, channelKey = this.currentTextChannel) {
    const lobby = this.getChannelLobby(channelKey);
    const userName = (window.app && window.app.user) ? window.app.user.displayName : 'You (Host)';
    const userMmr = 2580;

    // Filter out existing entries for user
    lobby.team1 = lobby.team1.filter(p => !p.name.includes('You') && p.name !== userName);
    lobby.team2 = lobby.team2.filter(p => !p.name.includes('You') && p.name !== userName);

    let assignedTeam = 1;
    const teamArg = String(targetTeam || '').toLowerCase();
    if (teamArg.includes('2') || teamArg.includes('bravo') || teamArg.includes('blue') || teamArg.includes('con')) {
      assignedTeam = 2;
    } else if (teamArg.includes('1') || teamArg.includes('alpha') || teamArg.includes('red') || teamArg.includes('pro')) {
      assignedTeam = 1;
    } else {
      assignedTeam = lobby.team1.length <= lobby.team2.length ? 1 : 2;
    }

    const playerObj = {
      name: `${userName}`,
      mmr: userMmr,
      role: 'Flex Specialist',
      isCaptain: (assignedTeam === 1 && lobby.team1.length === 0) || (assignedTeam === 2 && lobby.team2.length === 0)
    };

    if (assignedTeam === 1) {
      if (lobby.team1.length >= lobby.maxPerTeam) {
        assignedTeam = 2;
        lobby.team2.push(playerObj);
      } else {
        lobby.team1.push(playerObj);
      }
    } else {
      if (lobby.team2.length >= lobby.maxPerTeam) {
        assignedTeam = 1;
        lobby.team1.push(playerObj);
      } else {
        lobby.team2.push(playerObj);
      }
    }

    const totalCount = lobby.team1.length + lobby.team2.length;
    const maxTotal = lobby.maxPerTeam * 2;
    const isFull = totalCount >= maxTotal;
    const serverDispatchCmd = isFull ? `connect 144.76.12.89:27015; password scrim${Math.floor(Math.random() * 900 + 100)}` : null;

    lobby.status = isFull ? '🚀 MATCH STARTED - SERVER LIVE' : `RECRUITING (${totalCount}/${maxTotal} Players)`;

    if (isFull) {
      setTimeout(() => {
        this.fillAndStartChannelMatch(channelKey);
      }, 300);
    }

    return {
      assignedTeam,
      teamName: assignedTeam === 1 ? lobby.team1Name : lobby.team2Name,
      totalCount,
      maxTotal,
      isFull,
      serverDispatchCmd
    };
  }

  fillAndStartChannelMatch(channelKey = this.currentTextChannel) {
    const lobby = this.getChannelLobby(channelKey);
    const bots = [
      { name: 'S1mple_Fragger', mmr: 2650, role: 'AWPer / Sniper' },
      { name: 'ZywOo_Master', mmr: 2620, role: 'Entry Fragger' },
      { name: 'NiKo_OneTap', mmr: 2590, role: 'Rifler' },
      { name: 'B1t_Headshot', mmr: 2480, role: 'Flex Specialist' },
      { name: 'Dev1ce_Tactician', mmr: 2510, role: 'Support' },
      { name: 'Rain_EntryGod', mmr: 2420, role: 'Entry Fragger' },
      { name: 'Broky_Clutcher', mmr: 2550, role: 'AWPer' },
      { name: 'Ropz_Lurker', mmr: 2590, role: 'Lurker / Anchor' }
    ];

    let botIdx = 0;
    while (lobby.team1.length < lobby.maxPerTeam && botIdx < bots.length) {
      lobby.team1.push({ ...bots[botIdx], isCaptain: lobby.team1.length === 0 });
      botIdx++;
    }

    while (lobby.team2.length < lobby.maxPerTeam && botIdx < bots.length) {
      lobby.team2.push({ ...bots[botIdx], isCaptain: lobby.team2.length === 0 });
      botIdx++;
    }

    const totalCount = lobby.team1.length + lobby.team2.length;
    const maxTotal = lobby.maxPerTeam * 2;
    const helixIp = window.helixServerNodeIp || '127.0.0.1:7777';
    const serverDispatchCmd = `connect ${helixIp}; password helix_comp_scrim`;
    lobby.status = '🚀 MATCH STARTED - HELIX SERVER LIVE';

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('match_found');
      window.widgetBuilderEngine.showToast('🚀 MATCH POPPED! All roster slots filled & server node dispatched!', 'success');
    }

    if (window.app) {
      window.app.launchFaceitMatchRoom(lobby.game, `Channel #${channelKey.toUpperCase()}`);
    }

    const matchMsg = {
      id: Date.now(),
      author: 'CustomLobbiesBot',
      text: `🎉 LOBBY MATCH STARTED IN #${channelKey.toUpperCase()}! Server Node Dispatched: ${serverDispatchCmd}`,
      channelLobbyCard: true,
      commandBadge: {
        title: `🚀 MATCH STARTED & LIVE SERVER DISPATCHED!`,
        text: `Match popped! All ${maxTotal} roster slots filled.<br><b>1-Click Server Command:</b> <code>${serverDispatchCmd}</code>`
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80'
    };

    if (!this.textMessages[channelKey]) this.textMessages[channelKey] = [];
    this.textMessages[channelKey].push(matchMsg);
    this.renderMessages();
  }

  leaveChannelTeamPool(channelKey = this.currentTextChannel) {
    const lobby = this.getChannelLobby(channelKey);
    const userName = (window.app && window.app.user) ? window.app.user.displayName : 'You (Host)';

    lobby.team1 = lobby.team1.filter(p => !p.name.includes('You') && p.name !== userName);
    lobby.team2 = lobby.team2.filter(p => !p.name.includes('You') && p.name !== userName);

    const totalCount = lobby.team1.length + lobby.team2.length;
    const maxTotal = lobby.maxPerTeam * 2;
    lobby.status = `RECRUITING (${totalCount}/${maxTotal} Players)`;
  }

  postChannelLobbyToChat() {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
    }

    const newMsg = {
      id: Date.now(),
      author: 'You (Host)',
      text: '-pool',
      channelLobbyCard: true,
      commandBadge: {
        title: `🎮 #${this.currentTextChannel.toUpperCase()} Active Team Roster Pool`,
        text: `Live Team 1 vs Team 2 player pool in #${this.currentTextChannel}`
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
    };

    this.textMessages[this.currentTextChannel].push(newMsg);
    this.renderMessages();
  }

  executeInChatJoin(teamNum) {
    const cmdStr = teamNum ? `-j ${teamNum}` : `-j`;
    this.sendMessage(cmdStr);
  }

  executeInChatLeave() {
    this.sendMessage('-l');
  }

  hostLobbyForCurrentGame() {
    const gInfo = this.channelGameMap ? this.channelGameMap[this.currentTextChannel] : null;
    const gameName = gInfo ? gInfo.game : 'Counter-Strike 2';
    const maxPlayers = gInfo ? gInfo.maxPerTeam * 2 : 10;
    
    const modal = document.getElementById('createLobbyModal');
    if (modal) {
      modal.classList.add('active');
      const gameSelect = document.getElementById('newLobbyGame');
      if (gameSelect) {
        for (let opt of gameSelect.options) {
          if (opt.value.toLowerCase().includes(gameName.toLowerCase()) || gameName.toLowerCase().includes(opt.value.toLowerCase())) {
            gameSelect.value = opt.value;
            break;
          }
        }
      }
      const titleInput = document.getElementById('newLobbyTitle');
      if (titleInput) titleInput.value = `Competitive ${gameName} Scrim / Lobby`;
      const maxInput = document.getElementById('newLobbyMax');
      if (maxInput) maxInput.value = maxPlayers;
    }
  }

  browseLobbiesForCurrentGame() {
    const gInfo = this.channelGameMap ? this.channelGameMap[this.currentTextChannel] : null;
    const gameName = gInfo ? gInfo.game : 'all';
    if (window.app) {
      window.app.setGameFilter(gameName);
    }
  }

  launchDraftForCurrentGame() {
    const gInfo = this.channelGameMap ? this.channelGameMap[this.currentTextChannel] : null;
    const gameName = gInfo ? gInfo.game : 'Counter-Strike 2';
    if (window.eloDraftEngine) {
      window.eloDraftEngine.startSnakeDraft(gameName);
    }
  }

  // --- DEDICATED TEAM & CLAN CHANNELS SYSTEM ---
  loadTeamChannels() {
    try {
      const saved = localStorage.getItem('cl_custom_team_channels_v1');
      if (saved) {
        this.teamChannels = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Unable to load team channels', e);
    }

    if (!this.teamChannels || this.teamChannels.length === 0) {
      this.teamChannels = [
        {
          id: 'team-vanguard',
          teamId: 'TEAM-101',
          name: 'Vanguard Cyber Squad',
          tag: '[VANGUARD]',
          channelName: 'team-vanguard',
          voiceRoom: 'voice-team-vanguard',
          game: 'Counter-Strike 2',
          emblem: '🛡️',
          captain: 'Sean',
          membersCount: 5,
          members: ['Sean (👑 IGL)', 'Ghost_Dog_99 (🎯 Entry)', 'Sargeant_Iron (🛡️ Anchor)', 'Valkyrie_Merc (🔭 AWPer)', 'Shadow_K9 (⚡ Flex)'],
          motto: 'Official Vanguard scrim roster & tactical coordination comms.',
          privacy: 'public',
          hasText: true,
          hasVoice: true
        }
      ];
      this.saveTeamChannels();
    }

    // Seed default message for team-vanguard if not present
    if (!this.textMessages['team-vanguard']) {
      this.textMessages['team-vanguard'] = [
        {
          id: 201,
          author: 'CustomLobbiesBot',
          text: '🛡️ Welcome to the dedicated squad channel for <b>[VANGUARD] Vanguard Cyber Squad</b>! Coordinate strats, launch team scrims, or start a snake draft below.',
          time: '12:00 PM',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80'
        },
        {
          id: 202,
          author: 'Sean',
          text: 'Roster check! Scrim dispatch starts tonight at 8 PM EST on Counter-Strike 2 Mirage.',
          time: '12:05 PM',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
          sticker: { emoji: '🛡️', name: 'Anti-Cheat' }
        }
      ];
    }
  }

  saveTeamChannels() {
    try {
      localStorage.setItem('cl_custom_team_channels_v1', JSON.stringify(this.teamChannels));
    } catch (e) {
      console.warn('Unable to save team channels', e);
    }
  }

  renderTeamChannels() {
    const textContainer = document.getElementById('textChannelsTeams');
    const voiceContainer = document.getElementById('voiceChannelsTeams');

    if (textContainer) {
      if (!this.teamChannels || this.teamChannels.length === 0) {
        textContainer.innerHTML = `
          <div style="padding: 0.4rem 0.6rem; font-size: 0.72rem; color: var(--text-dim); font-style: italic;">
            No squad channels yet. Click + to add your team channel!
          </div>
        `;
      } else {
        textContainer.innerHTML = this.teamChannels
          .filter(t => t.hasText !== false)
          .map(t => {
            const isActive = this.currentTextChannel === t.channelName ? 'active' : '';
            return `
              <div class="channel-item ${isActive}" data-channel="${t.channelName}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.6rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <span style="font-size: 0.95rem;">${t.emblem || '🛡️'}</span>
                  <span style="font-weight: 600; color: ${isActive ? '#fff' : 'var(--text-normal)'};">#${t.channelName}</span>
                </div>
                <span style="font-size: 0.65rem; background: rgba(168, 85, 247, 0.2); color: var(--accent-purple); padding: 0.1rem 0.35rem; border-radius: 4px; font-weight: 700; border: 1px solid rgba(168, 85, 247, 0.3);">
                  ${t.tag || 'TEAM'}
                </span>
              </div>
            `;
          }).join('');
      }
    }

    if (voiceContainer) {
      if (!this.teamChannels || this.teamChannels.length === 0) {
        voiceContainer.innerHTML = '';
      } else {
        voiceContainer.innerHTML = this.teamChannels
          .filter(t => t.hasVoice !== false)
          .map(t => {
            const isActive = this.currentVoiceRoom === t.voiceRoom ? 'active' : '';
            return `
              <div class="channel-item ${isActive}" data-voice="${t.voiceRoom}" style="border-left: 2px solid var(--accent-purple); padding: 0.35rem 0.6rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                  <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span>🔊</span>
                    <span style="font-weight: 600;">${t.tag || ''} ${t.name} Comms</span>
                  </div>
                  <span style="font-size: 0.62rem; color: var(--accent-cyan); background: rgba(0, 242, 254, 0.1); padding: 0.05rem 0.3rem; border-radius: 3px;">
                    ${t.game ? t.game.split(' ')[0] : 'Squad'}
                  </span>
                </div>
              </div>
            `;
          }).join('');
      }
    }
  }

  openTeamChannelModal() {
    const select = document.getElementById('teamChannelSelectExisting');
    if (select) {
      let teams = [];
      if (window.app && Array.isArray(window.app.myCreatedTeams) && window.app.myCreatedTeams.length > 0) {
        teams = window.app.myCreatedTeams;
      } else {
        try {
          const raw = localStorage.getItem('cl_user_custom_teams_v1');
          if (raw) teams = JSON.parse(raw);
        } catch (e) {}
      }

      if (teams.length === 0) {
        teams = [
          {
            id: 'TEAM-101',
            name: 'Vanguard Cyber Squad',
            tag: '[VANGUARD]',
            emblem: '🛡️',
            game: 'Counter-Strike 2',
            focus: 'Competitive Scrims'
          }
        ];
      }

      let optionsHtml = '';
      teams.forEach(t => {
        optionsHtml += `<option value="${t.id}">${t.emblem || '🛡️'} ${t.tag || ''} ${t.name} (${t.game})</option>`;
      });
      optionsHtml += `<option value="new">➕ Type Brand New Squad / Clan Name</option>`;
      select.innerHTML = optionsHtml;

      if (teams.length > 0) {
        select.value = teams[0].id;
        this.onTeamSelectChange(teams[0].id);
      } else {
        select.value = 'new';
        this.onTeamSelectChange('new');
      }
    }

    const modal = document.getElementById('createTeamChannelModal');
    if (modal) modal.classList.add('active');
  }

  closeTeamChannelModal() {
    const modal = document.getElementById('createTeamChannelModal');
    if (modal) modal.classList.remove('active');
  }

  toggleNewTeamInput() {
    const newTeamWrapper = document.getElementById('newTeamFieldsWrapper');
    const select = document.getElementById('teamChannelSelectExisting');
    if (!newTeamWrapper) return;
    const isHidden = newTeamWrapper.style.display === 'none';
    newTeamWrapper.style.display = isHidden ? 'block' : 'none';
    if (select) {
      select.value = isHidden ? 'new' : (select.options[0]?.value || 'new');
    }
  }

  onTeamSelectChange(selectedId) {
    const newTeamWrapper = document.getElementById('newTeamFieldsWrapper');
    const gameSelect = document.getElementById('teamChannelGame');
    const emblemSelect = document.getElementById('teamChannelEmblem');
    const mottoInput = document.getElementById('teamChannelMotto');

    if (selectedId === 'new') {
      if (newTeamWrapper) newTeamWrapper.style.display = 'block';
      return;
    }

    if (newTeamWrapper) newTeamWrapper.style.display = 'none';

    let teams = [];
    if (window.app && Array.isArray(window.app.myCreatedTeams)) {
      teams = window.app.myCreatedTeams;
    } else {
      try {
        const raw = localStorage.getItem('cl_user_custom_teams_v1');
        if (raw) teams = JSON.parse(raw);
      } catch (e) {}
    }

    const team = teams.find(t => t.id === selectedId);
    if (team) {
      if (gameSelect && team.game) gameSelect.value = team.game;
      if (emblemSelect && team.emblem) emblemSelect.value = team.emblem;
      if (mottoInput) mottoInput.value = team.focus || `${team.name} Official Scrim Roster`;
    }
  }

  submitCreateTeamChannel() {
    const select = document.getElementById('teamChannelSelectExisting');
    const selectedId = select ? select.value : 'new';
    const gameSelect = document.getElementById('teamChannelGame');
    const emblemSelect = document.getElementById('teamChannelEmblem');
    const typeSelect = document.getElementById('teamChannelTypeSelect');
    const privacySelect = document.getElementById('teamChannelPrivacy');
    const mottoInput = document.getElementById('teamChannelMotto');

    let teamName = '';
    let teamTag = '';
    let teamGame = gameSelect ? gameSelect.value : 'Counter-Strike 2';
    let teamEmblem = emblemSelect ? emblemSelect.value : '🛡️';
    let motto = mottoInput ? mottoInput.value.trim() : '';
    let teamId = selectedId;
    let members = ['Sean (👑 Captain)', 'Roster Member 2', 'Roster Member 3', 'Roster Member 4', 'Roster Member 5'];

    if (selectedId === 'new') {
      const nameInput = document.getElementById('newTeamChannelName');
      const tagInput = document.getElementById('newTeamChannelTag');
      teamName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Alpha Squad';
      teamTag = tagInput && tagInput.value.trim() ? tagInput.value.trim() : '[ALPHA]';
      if (!teamTag.startsWith('[')) teamTag = `[${teamTag}]`;
      teamId = `TEAM-${Date.now()}`;

      // Synchronize with window.app.myCreatedTeams so the new squad appears platform-wide
      const brandNewTeam = {
        id: teamId,
        name: teamName,
        tag: teamTag,
        emblem: teamEmblem,
        focus: motto || 'Competitive Scrims',
        synergy: '98% (High)',
        captain: 'Sean',
        game: teamGame,
        size: 5,
        members: members,
        record: '0W - 0L',
        elo: 1500,
        kd: '1.00',
        bountyEarned: '0 CL-Points',
        createdDate: 'Just Now'
      };

      try {
        let existingTeams = [];
        const raw = localStorage.getItem('cl_user_custom_teams_v1');
        if (raw) existingTeams = JSON.parse(raw);
        existingTeams.unshift(brandNewTeam);
        localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(existingTeams));
        if (window.app) {
          window.app.myCreatedTeams = existingTeams;
          if (typeof window.app.renderMyCreatedTeams === 'function') {
            window.app.renderMyCreatedTeams();
          }
        }
      } catch (e) {}
    } else {
      let teams = [];
      if (window.app && Array.isArray(window.app.myCreatedTeams)) {
        teams = window.app.myCreatedTeams;
      } else {
        try {
          const raw = localStorage.getItem('cl_user_custom_teams_v1');
          if (raw) teams = JSON.parse(raw);
        } catch (e) {}
      }
      const existing = teams.find(t => t.id === selectedId);
      if (existing) {
        teamName = existing.name;
        teamTag = existing.tag || `[${existing.name.substring(0, 4).toUpperCase()}]`;
        teamGame = teamGame || existing.game || 'Counter-Strike 2';
        teamEmblem = teamEmblem || existing.emblem || '🛡️';
        if (!motto && existing.focus) motto = existing.focus;
        if (existing.members && existing.members.length > 0) members = existing.members;
      } else {
        teamName = 'Team ' + selectedId;
        teamTag = '[TEAM]';
      }
    }

    const channelType = typeSelect ? typeSelect.value : 'both';
    const privacy = privacySelect ? privacySelect.value : 'public';
    const cleanTag = teamTag.replace(/[[\]]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = teamName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const slug = cleanTag || cleanName || `team-${Date.now().toString().slice(-4)}`;
    const channelName = `team-${slug}`;
    const voiceRoom = `voice-team-${slug}`;

    const existingIdx = this.teamChannels.findIndex(t => t.channelName === channelName || t.id === channelName);
    const teamChanObj = {
      id: channelName,
      teamId: teamId,
      name: teamName,
      tag: teamTag,
      channelName: channelName,
      voiceRoom: voiceRoom,
      game: teamGame,
      emblem: teamEmblem,
      captain: 'Sean',
      membersCount: members.length,
      members: members,
      motto: motto || `Official ${teamName} Scrim & Comms Hub`,
      privacy: privacy,
      hasText: channelType === 'both' || channelType === 'text',
      hasVoice: channelType === 'both' || channelType === 'voice'
    };

    if (existingIdx >= 0) {
      this.teamChannels[existingIdx] = teamChanObj;
    } else {
      this.teamChannels.unshift(teamChanObj);
    }

    this.saveTeamChannels();

    if (!this.textMessages[channelName]) {
      this.textMessages[channelName] = [
        {
          id: Date.now(),
          author: 'CustomLobbiesBot',
          text: `🛡️ Welcome to the dedicated squad channel for <b>${teamTag} ${teamName}</b>! Dedicated to <b>${teamGame}</b>. Use the Team Action Bar above to host scrims, start a snake draft, or copy invite links for your squad!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80'
        }
      ];
    }

    this.renderTeamChannels();

    if (teamChanObj.hasText) {
      this.switchTextChannel(channelName);
    } else if (teamChanObj.hasVoice) {
      this.selectVoiceRoom(voiceRoom);
    }

    this.closeTeamChannelModal();
    this.notifyToast(`🛡️ Team Channel #${channelName} is live!`, 'success');
  }

  hostLobbyForCurrentTeam() {
    const team = this.teamChannels ? this.teamChannels.find(t => t.channelName === this.currentTextChannel || t.id === this.currentTextChannel) : null;
    const teamName = team ? team.name : 'Squad';
    const game = team ? team.game : 'Counter-Strike 2';
    const tag = team && team.tag ? team.tag : '[TEAM]';

    const modal = document.getElementById('createLobbyModal');
    if (modal) {
      modal.classList.add('active');
      const titleInput = document.getElementById('newLobbyTitle');
      const gameSelect = document.getElementById('newLobbyGame');
      if (titleInput) titleInput.value = `${tag} 5v5 Scrim Match (${teamName})`;
      if (gameSelect) {
        for (let opt of gameSelect.options) {
          if (opt.value.toLowerCase().includes(game.toLowerCase()) || game.toLowerCase().includes(opt.value.toLowerCase())) {
            gameSelect.value = opt.value;
            break;
          }
        }
      }
      this.notifyToast(`🎮 Pre-filled scrim match lobby for ${teamName} (${game})!`, 'success');
    } else {
      this.notifyToast(`🎮 Team Lobby hosted for ${teamName}!`, 'success');
    }

    this.postBotNotice(`🎮 <b>Squad Match Lobby:</b> ${teamName} is hosting a competitive scrim lobby for <b>${game}</b>! Queue up or check the Lobbies tab.`);
  }

  challengeScrimForCurrentTeam() {
    const team = this.teamChannels ? this.teamChannels.find(t => t.channelName === this.currentTextChannel || t.id === this.currentTextChannel) : null;
    const teamName = team ? team.name : 'Squad';
    const game = team ? team.game : 'Counter-Strike 2';

    const teamsTabBtn = document.querySelector('.nav-btn[data-tab="teams-view"]');
    if (teamsTabBtn) {
      teamsTabBtn.click();
      this.notifyToast(`⚔️ Scrim Dispatch opened for ${teamName}! Navigating to Teams & Scrims...`, 'info');
    } else {
      this.notifyToast(`⚔️ Scrim Dispatch: Squad is searching for opponents in ${game}!`, 'success');
    }

    this.postBotNotice(`⚔️ <b>Scrim Challenge Dispatched:</b> <b>${team ? team.tag : ''} ${teamName}</b> has issued an open scrim challenge for <b>${game}</b>! Opposing captains can accept via Teams Hub.`);
  }

  draftForCurrentTeam() {
    const team = this.teamChannels ? this.teamChannels.find(t => t.channelName === this.currentTextChannel || t.id === this.currentTextChannel) : null;
    const game = team ? team.game : 'Counter-Strike 2';
    const teamName = team ? team.name : 'Squad';

    if (window.eloDraftEngine) {
      window.eloDraftEngine.startSnakeDraft(game);
      this.notifyToast(`🐍 1-2-2-1 Snake Draft initiated for ${teamName} in ${game}!`, 'success');
    } else if (window.app && typeof window.app.triggerAutoDraftModal === 'function') {
      window.app.triggerAutoDraftModal(game);
      this.notifyToast(`🐍 Snake Draft opened for ${game}!`, 'success');
    } else {
      this.notifyToast(`🐍 Starting Snake Draft for ${teamName} (${game})...`, 'info');
    }

    this.postBotNotice(`🐍 <b>Snake Draft Started:</b> Captains are picking players for ${teamName} lineup in <b>${game}</b>!`);
  }

  inviteTeammateToChannel() {
    const team = this.teamChannels ? this.teamChannels.find(t => t.channelName === this.currentTextChannel || t.id === this.currentTextChannel) : null;
    const teamName = team ? team.name : 'Squad';
    const chan = team ? team.channelName : this.currentTextChannel;
    const inviteLink = `https://customlobbies.com/hub/team/${chan}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteLink).catch(() => {});
    }

    this.notifyToast(`📋 Squad invite link copied: ${inviteLink}`, 'success');
    this.postBotNotice(`🔗 <b>Squad Channel Invite:</b> Share this direct invite link with your teammates: <code>${inviteLink}</code>`);
  }

  postBotNotice(text) {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
    }
    this.textMessages[this.currentTextChannel].push({
      id: Date.now(),
      author: 'CustomLobbiesBot',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80'
    });
    this.renderMessages();
  }

  pinStickerToDashboard(stickerEmoji, stickerName) {
    const exists = this.pinnedStickers.some(s => s.emoji === stickerEmoji && s.name === stickerName);
    if (exists) {
      this.notifyToast(`"${stickerEmoji} ${stickerName}" is already pinned to your Dashboard Showcase!`, 'warning');
      return;
    }

    if (this.pinnedStickers.length >= 10) {
      this.notifyToast('Maximum 10 stickers pinned to Dashboard Showcase. Remove one to add more!', 'warning');
      return;
    }

    this.pinnedStickers.push({ emoji: stickerEmoji, name: stickerName });
    this.savePinnedStickers();
    this.renderDashboardStickers();
    this.notifyToast(`📌 Successfully pinned "${stickerEmoji} ${stickerName}" to your Dashboard Showcase!`, 'success');
  }

  removePinnedSticker(index) {
    this.pinnedStickers.splice(index, 1);
    this.savePinnedStickers();
    this.renderDashboardStickers();
  }

  renderDashboardStickers() {
    const grid = document.getElementById('dashboardStickerShowcaseGrid');
    if (!grid) return;

    if (this.pinnedStickers.length === 0) {
      grid.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">No pinned stickers yet. Click "✨ Open Sticker Drawer" to pin stickers here!</span>`;
      return;
    }

    grid.innerHTML = this.pinnedStickers.map((s, idx) => `
      <div class="pinned-sticker-badge">
        <span style="font-size: 1.2rem;">${s.emoji}</span>
        <span>${s.name}</span>
        <button class="pinned-sticker-remove" onclick="window.chatVoiceManager.removePinnedSticker(${idx})" title="Unpin Sticker">✕</button>
      </div>
    `).join('');
  }

  handleChatCommand(text) {
    const raw = text.trim();
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    if (cmd === '-j' || cmd === '-join') {
      const joinRes = this.joinChannelTeamPool(arg, this.currentTextChannel);

      if (window.app) {
        window.app.clPoints += 25;
        window.app.updatePointsWidget();
      }

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('queue_join');
      }

      return {
        isCommand: true,
        text: raw,
        channelLobbyCard: true,
        commandBadge: {
          title: `⚡ Joined ${joinRes.teamName} (#${this.currentTextChannel})`,
          text: `Registered in #${this.currentTextChannel} team pool! Pool Status: <b>${joinRes.totalCount}/${joinRes.maxTotal} Players</b> (+25 🪙 CL-Points Bonus)${joinRes.isFull ? `<br>🚀 <b>MATCH FULL! Dedicated 128-Tick Server Command:</b> <code>${joinRes.serverDispatchCmd}</code>` : ''}`
        }
      };
    } else if (cmd === '-l' || cmd === '-leave') {
      this.leaveChannelTeamPool(this.currentTextChannel);

      if (window.app) {
        window.app.leaveQueue();
      }

      return {
        isCommand: true,
        text: raw,
        channelLobbyCard: true,
        commandBadge: {
          title: `❌ Left #${this.currentTextChannel} Team Pool`,
          text: `Successfully exited #${this.currentTextChannel} match team pool.`
        }
      };
    } else if (cmd === '-pool' || cmd === '-roster' || cmd === '-lobby') {
      return {
        isCommand: true,
        text: raw,
        channelLobbyCard: true,
        commandBadge: {
          title: `🎮 #${this.currentTextChannel.toUpperCase()} Active Team Roster Pool`,
          text: `Fetched active Team 1 vs Team 2 player pool for #${this.currentTextChannel}.`
        }
      };
    } else if (cmd === '-createlobby' || cmd === '-create' || cmd === '-host') {
      const title = arg || `Custom 5v5 Lobby (#${this.currentTextChannel.toUpperCase()})`;
      if (window.app) {
        window.app.lobbies.unshift({
          id: Date.now(),
          title,
          game: 'Counter-Strike 2',
          host: 'You (Host)',
          players: 1,
          max: 10,
          region: 'NA East',
          draftType: 'FACEIT Competitive',
          serverIp: '127.0.0.1:7777',
          matchStatus: '🔥 RECRUITING (1/10)'
        });
        window.app.addCoins(50);
        window.app.renderLobbies();
        window.app.renderActiveGamesBar();
      }

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('lobby_start');
        window.widgetBuilderEngine.showToast(`🎮 Custom Lobby "${title}" Created! +50 🪙 Host Reward Added!`, 'success');
      }

      return {
        isCommand: true,
        text: raw,
        channelLobbyCard: true,
        commandBadge: {
          title: `🎮 Custom Lobby Created: "${title}"`,
          text: `Host: <b>You (Host)</b> | Region: <b>NA East</b> | Format: <b>5v5 FACEIT Competitive</b> (+50 🪙 CL-Points Awarded)`
        }
      };
    } else if (cmd === '-b' || cmd === '-bracket' || cmd === '-tourney' || cmd === '-tournament' || cmd === '-tournaments') {
      return {
        isCommand: true,
        text: raw,
        bracketCard: true,
        commandBadge: {
          title: `🏆 Tournament Bracket Requested`,
          text: `Fetched active 8-team esports visual bracket tree directly into chat.`
        }
      };
    } else if (cmd === '-configtourney' || cmd === '-create-bracket' || cmd === '-newtourney' || cmd === '-config-tournament') {
      if (window.tournamentsStoreEngine) {
        window.tournamentsStoreEngine.openConfiguratorModal();
      }
      return {
        isCommand: true,
        text: raw,
        commandBadge: {
          title: `⚡ Configurator Modal Launched`,
          text: `Opened 1-Click Tournament Configurator & Bracket Builder!`
        }
      };
    } else if (cmd === '-help' || cmd === '-cmd' || cmd === '-cmds') {
      return {
        isCommand: true,
        text: raw,
        commandBadge: {
          title: `⌨️ CustomLobbies Chat Commands`,
          text: `• <b>-j</b> or <b>-join [1|2]</b> : Join channel team pool (e.g. <i>-j</i>, <i>-j 1</i>, <i>-j 2</i>)<br>• <b>-l</b> or <b>-leave</b> : Leave channel team pool<br>• <b>-pool</b> or <b>-roster</b> : Display channel team pool roster card<br>• <b>-b</b> or <b>-bracket</b> : Display live visual bracket tree in chat<br>• <b>-configtourney</b> : Open 1-click Tournament Configurator modal<br>• <b>-status</b> : Telemetry & MMR rating<br>• <b>-scrim</b> : Team Scrim Dispatcher`
        }
      };
    } else if (cmd === '-status') {
      const activeQ = (window.app && window.app.activeQueue) ? 'SEARCHING FOR MATCH' : 'IDLE / NOT IN QUEUE';
      return {
        isCommand: true,
        text: raw,
        commandBadge: {
          title: `📊 Player Telemetry Status`,
          text: `Handle: BDroplE | Base ELO: 2,580 MMR (+200 Performance Bonus) | Queue Status: ${activeQ}`
        }
      };
    } else if (cmd === '-scrim') {
      if (window.app) {
        window.app.openTeamScrimDispatchModal();
      }
      return {
        isCommand: true,
        text: raw,
        commandBadge: {
          title: `⚔️ Scrim Dispatch Launcher`,
          text: `Opened Interactive Team Scrim Dispatcher!`
        }
      };
    }

    return { isCommand: false };
  }

  sendMessage(text) {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
    }

    const trimmed = text.trim();
    if (trimmed.startsWith('-')) {
      const cmdResult = this.handleChatCommand(trimmed);
      if (cmdResult.isCommand) {
        const cmdMsg = {
          id: Date.now(),
          author: 'You (Host)',
          text: cmdResult.text,
          commandBadge: cmdResult.commandBadge,
          bracketCard: cmdResult.bracketCard,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
        };
        this.textMessages[this.currentTextChannel].push(cmdMsg);
        this.renderMessages();
        return;
      }
    }

    const newMsg = {
      id: Date.now(),
      author: 'You (Host)',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
    };

    this.textMessages[this.currentTextChannel].push(newMsg);
    this.renderMessages();
  }

  renderMessages() {
    const container = document.getElementById('chatMessagesBox');
    if (!container) return;

    const msgs = this.textMessages[this.currentTextChannel] || [];
    if (msgs.length === 0) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 250px; color: var(--text-dim); text-align: center; padding: 2rem;">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">💬</div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #fff;">Welcome to #${this.currentTextChannel}!</div>
          <div style="font-size: 0.85rem; margin-top: 0.3rem; max-width: 420px; color: var(--text-muted);">This is the start of the #${this.currentTextChannel} channel. Drop a message or type <code>-help</code> for instant match commands!</div>
        </div>
      `;
      container.scrollTop = container.scrollHeight;
      return;
    }

    container.innerHTML = msgs.map(m => `
      <div class="chat-message-row">
        <img src="${m.avatar}" class="chat-msg-avatar" alt="${m.author}">
        <div class="chat-msg-content">
          <div>
            <span class="chat-msg-author">${m.author}</span>
            <span class="chat-msg-time">${m.time}</span>
          </div>
          ${m.text ? `<div class="chat-msg-text">${m.text}</div>` : ''}
          ${m.sticker ? `
            <div class="chat-sticker-badge">
              <span class="chat-sticker-emoji">${m.sticker.emoji}</span>
              <span class="chat-sticker-label">${m.sticker.name}</span>
            </div>
          ` : ''}
          ${m.gameScoreCard ? `
            <div class="chat-game-score-card">
              <div style="font-size: 0.78rem; font-weight: 800; color: var(--accent-purple); text-transform: uppercase;">🎮 In-Chat Game Result</div>
              <div style="font-weight: 900; font-size: 0.95rem; color: #fff;">${m.gameScoreCard.title}: <span style="color: var(--accent-cyan);">${m.gameScoreCard.score}</span></div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${m.gameScoreCard.detail}</div>
            </div>
          ` : ''}
          ${m.commandBadge ? `
            <div class="chat-command-badge">
              <div style="font-size: 0.78rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase;">${m.commandBadge.title}</div>
              <div style="font-size: 0.85rem; color: #fff; margin-top: 0.2rem;">${m.commandBadge.text}</div>
            </div>
          ` : ''}
          ${m.bracketCard ? `
            <div class="chat-command-badge" style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 242, 254, 0.15)); border: 1px solid var(--accent-purple); padding: 0.8rem; border-radius: 10px; margin-top: 0.4rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
                <span style="font-size: 0.85rem; font-weight: 900; color: var(--accent-gold);">🏆 Live Esports Tournament Bracket</span>
                <span class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.2); color: var(--accent-cyan); font-size: 0.68rem;">CS2 $1,500 Summer Scrim</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; font-size: 0.72rem; background: rgba(0,0,0,0.4); padding: 0.5rem; border-radius: 6px;">
                <div>
                  <div style="color: var(--text-dim); font-weight: 800; font-size: 0.65rem; margin-bottom: 0.2rem;">QUARTERFINALS</div>
                  <div style="background: rgba(255,255,255,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; margin-bottom: 0.2rem;">⚡ FaZe Clan <span style="color: var(--accent-green); float: right;">16</span></div>
                  <div style="background: rgba(255,255,255,0.05); padding: 0.2rem 0.4rem; border-radius: 4px;">🎯 NAVI <span style="color: var(--accent-red); float: right;">14</span></div>
                </div>
                <div>
                  <div style="color: var(--text-dim); font-weight: 800; font-size: 0.65rem; margin-bottom: 0.2rem;">SEMIFINALS</div>
                  <div style="background: rgba(255,255,255,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; margin-bottom: 0.2rem;">⚡ FaZe Clan <span style="color: var(--accent-green); float: right;">16</span></div>
                  <div style="background: rgba(255,255,255,0.05); padding: 0.2rem 0.4rem; border-radius: 4px;">🐺 Vitality <span style="color: var(--accent-gold); float: right;">12</span></div>
                </div>
                <div style="text-align: center;">
                  <div style="color: var(--accent-gold); font-weight: 800; font-size: 0.65rem; margin-bottom: 0.2rem;">👑 GRAND FINALS</div>
                  <div style="background: rgba(255,215,0,0.15); border: 1px solid var(--accent-gold); padding: 0.3rem; border-radius: 6px; font-weight: 900; color: var(--accent-gold); font-size: 0.75rem;">
                    ⚡ FaZe vs 🐉 G2
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 0.4rem; margin-top: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.68rem;" onclick="window.tournamentsStoreEngine.autoSimulateRound(101)">⚡ Auto-Simulate Match</button>
                <button class="btn btn-purple btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.68rem;" onclick="window.tournamentsStoreEngine.openConfiguratorModal()">⚡ Easy Configurator</button>
              </div>
            </div>
          ` : ''}
          ${m.channelLobbyCard ? (() => {
            const l = this.getChannelLobby(this.currentTextChannel);
            const total = l.team1.length + l.team2.length;
            const maxT = l.maxPerTeam * 2;
            return `
              <div class="chat-command-badge" style="background: linear-gradient(135deg, rgba(0, 242, 254, 0.12), rgba(168, 85, 247, 0.12)); border: 1px solid var(--accent-cyan); padding: 0.8rem; border-radius: 10px; margin-top: 0.4rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.4rem;">
                  <div>
                    <span style="font-size: 0.9rem; font-weight: 900; color: var(--accent-cyan);">🎮 #${this.currentTextChannel.toUpperCase()} MATCH LOBBY POOL</span>
                    <span style="font-size: 0.75rem; color: var(--text-dim); margin-left: 0.5rem;">(${l.game})</span>
                  </div>
                  <span class="lobby-game-tag" style="background: ${total >= maxT ? 'rgba(0,230,118,0.2)' : 'rgba(255,215,0,0.2)'}; color: ${total >= maxT ? 'var(--accent-green)' : 'var(--accent-gold)'}; font-size: 0.72rem;">
                    ${l.status}
                  </span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; font-size: 0.78rem;">
                  <!-- Team 1 -->
                  <div style="background: rgba(0, 242, 254, 0.08); padding: 0.6rem; border-radius: 8px; border: 1px solid rgba(0, 242, 254, 0.3);">
                    <div style="display: flex; justify-content: space-between; font-weight: 900; color: var(--accent-cyan); margin-bottom: 0.4rem;">
                      <span>${l.team1Name}</span>
                      <span>${l.team1.length}/${l.maxPerTeam}</span>
                    </div>
                    ${l.team1.map(p => `
                      <div style="display: flex; justify-content: space-between; padding: 0.2rem 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
                        <span>${p.isCaptain ? '👑 ' : ''}<b>${p.name}</b> <span style="font-size: 0.68rem; color: var(--text-dim);">(${p.role})</span></span>
                        <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.72rem;">${p.mmr}</span>
                      </div>
                    `).join('')}
                    <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 0.5rem; font-size: 0.7rem; padding: 0.2rem;" onclick="window.chatVoiceManager.executeInChatJoin(1)">➕ Join ${l.team1Name} (-j 1)</button>
                  </div>

                  <!-- Team 2 -->
                  <div style="background: rgba(255, 82, 82, 0.08); padding: 0.6rem; border-radius: 8px; border: 1px solid rgba(255, 82, 82, 0.3);">
                    <div style="display: flex; justify-content: space-between; font-weight: 900; color: var(--accent-red); margin-bottom: 0.4rem;">
                      <span>${l.team2Name}</span>
                      <span>${l.team2.length}/${l.maxPerTeam}</span>
                    </div>
                    ${l.team2.map(p => `
                      <div style="display: flex; justify-content: space-between; padding: 0.2rem 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
                        <span>${p.isCaptain ? '👑 ' : ''}<b>${p.name}</b> <span style="font-size: 0.68rem; color: var(--text-dim);">(${p.role})</span></span>
                        <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.72rem;">${p.mmr}</span>
                      </div>
                    `).join('')}
                    <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 0.5rem; font-size: 0.7rem; padding: 0.2rem;" onclick="window.chatVoiceManager.executeInChatJoin(2)">➕ Join ${l.team2Name} (-j 2)</button>
                  </div>
                </div>

                <div style="display: flex; gap: 0.4rem; margin-top: 0.6rem; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                  <span style="font-size: 0.72rem; color: var(--text-dim);">Map Veto: <b>${l.map}</b></span>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-success btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; background: rgba(0, 230, 118, 0.2); border: 1px solid var(--accent-green); color: var(--accent-green);" onclick="window.chatVoiceManager.fillAndStartChannelMatch()">⚡ Fill AI & Auto-Start</button>
                    <button class="btn btn-primary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="window.chatVoiceManager.executeInChatJoin(null)">⚡ Auto-Join (-j)</button>
                    <button class="btn btn-danger btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="window.chatVoiceManager.executeInChatLeave()">❌ Leave (-l)</button>
                  </div>
                </div>
              </div>
            `;
          })() : ''}
        </div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }

  invitePlayerToTeam(playerName) {
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('queue_join');
    }
    this.notifyToast(`📨 Team Invite sent to ${playerName} from the Community Hub!`, 'success');
  }

  renderOnlineUsers() {
    const container = document.getElementById('onlineUsersList');
    if (!container) return;

    const defaultRoles = [
      { name: 'Staff / Admin', color: '#ff5252' },
      { name: 'Team Captains', color: '#00f2fe' },
      { name: 'VIP Champions', color: '#ffd700' }
    ];
    let rolesMap = JSON.parse(localStorage.getItem('cl_server_roles') || 'null');
    if (!rolesMap || rolesMap.length === 0) {
      rolesMap = defaultRoles;
      localStorage.setItem('cl_server_roles', JSON.stringify(rolesMap));
    }

    const defaultUserRoles = {
      'Marshal_Vanguard': 'Staff / Admin',
      'ApexGod99': 'Team Captains',
      'S1mple_Fragger': 'VIP Champions',
      'Faker_Mid': 'VIP Champions'
    };
    let userRoleAssignments = JSON.parse(localStorage.getItem('cl_server_user_roles') || 'null');
    if (!userRoleAssignments || Object.keys(userRoleAssignments).length === 0) {
      userRoleAssignments = defaultUserRoles;
      localStorage.setItem('cl_server_user_roles', JSON.stringify(userRoleAssignments));
    }

    // Sort online users into their highest role category
    const categorized = { 'Online': [] };
    rolesMap.forEach(r => categorized[r.name] = { color: r.color, users: [] });

    this.onlineUsers.forEach(u => {
      const roleName = userRoleAssignments[u.name];
      if (roleName && categorized[roleName]) {
        categorized[roleName].users.push(u);
      } else {
        categorized['Online'].push(u);
      }
    });

    let html = '';
    
    // Render custom roles first
    rolesMap.forEach(r => {
      if (categorized[r.name] && categorized[r.name].users.length > 0) {
        html += `<div style="font-size: 0.7rem; font-weight: 800; color: ${r.color}; text-transform: uppercase; margin-bottom: 0.4rem; margin-top: 0.8rem;">${r.name} - ${categorized[r.name].users.length}</div>`;
        categorized[r.name].users.forEach(u => {
          const badge = u.teamTag ? `<span style="background: rgba(255, 171, 0, 0.15); border: 1px solid rgba(255,171,0,0.5); color: #ffab00; font-size: 0.6rem; padding: 0.1rem 0.3rem; border-radius: 4px; font-weight: 900;">${u.teamTag}</span>` : '';
          html += `
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${r.color}; box-shadow: 0 0 5px ${r.color};"></span>
                ${badge}
                <span style="font-weight: 600; color: ${r.color};">${u.name}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.75rem;">${u.mmr}</span>
                <button onclick="window.chatVoiceManager.invitePlayerToTeam('${u.name}')" style="background: rgba(0, 242, 254, 0.15); border: 1px solid var(--accent-cyan); color: var(--accent-cyan); cursor: pointer; font-size: 0.65rem; padding: 0.1rem 0.3rem; border-radius: 4px; font-weight: 800;" title="Invite to Team">➕</button>
              </div>
            </div>
          `;
        });
      }
    });

    // Render default online category
    if (categorized['Online'].length > 0) {
      html += `<div style="font-size: 0.7rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.4rem; margin-top: 0.8rem;">Online - ${categorized['Online'].length}</div>`;
      categorized['Online'].forEach(u => {
        const badge = u.teamTag ? `<span style="background: rgba(255, 171, 0, 0.15); border: 1px solid rgba(255,171,0,0.5); color: #ffab00; font-size: 0.6rem; padding: 0.1rem 0.3rem; border-radius: 4px; font-weight: 900;">${u.teamTag}</span>` : '';
        html += `
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-green);"></span>
              ${badge}
              <span style="font-weight: 600;">${u.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.75rem;">${u.mmr}</span>
              <button onclick="window.chatVoiceManager.invitePlayerToTeam('${u.name}')" style="background: rgba(0, 242, 254, 0.15); border: 1px solid var(--accent-cyan); color: var(--accent-cyan); cursor: pointer; font-size: 0.65rem; padding: 0.1rem 0.3rem; border-radius: 4px; font-weight: 800;" title="Invite to Team">➕</button>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  }

  openRolesModal() {
    const modal = document.getElementById('serverRolesModal');
    if (modal) modal.classList.add('active');
    this.renderRolesModal();
  }

  closeRolesModal() {
    const modal = document.getElementById('serverRolesModal');
    if (modal) modal.classList.remove('active');
  }

  renderRolesModal() {
    const list = document.getElementById('customRolesListContainer');
    const playerSelect = document.getElementById('assignRolePlayerSelect');
    const roleSelect = document.getElementById('assignRoleRoleSelect');
    if (!list || !playerSelect || !roleSelect) return;

    const rolesMap = JSON.parse(localStorage.getItem('cl_server_roles') || '[]');
    
    list.innerHTML = rolesMap.map((r, idx) => `
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 0.6rem 0.8rem; border-radius: 6px; border-left: 4px solid ${r.color};">
        <span style="font-weight: 700; color: ${r.color};">${r.name}</span>
        <button class="icon-btn-sm" onclick="window.chatVoiceManager.deleteCustomRole(${idx})" title="Delete Role">🗑️</button>
      </div>
    `).join('');

    if (rolesMap.length === 0) {
      list.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">No custom roles created yet.</div>';
    }

    playerSelect.innerHTML = this.onlineUsers.map(u => `<option value="${u.name}">${u.name}</option>`).join('');
    roleSelect.innerHTML = `<option value="none">-- Remove Role --</option>` + rolesMap.map(r => `<option value="${r.name}">${r.name}</option>`).join('');
  }

  createCustomRole() {
    const nameInput = document.getElementById('newRoleNameInput');
    const colorInput = document.getElementById('newRoleColorInput');
    if (!nameInput || !colorInput) return;

    const name = nameInput.value.trim();
    if (!name) return;

    const rolesMap = JSON.parse(localStorage.getItem('cl_server_roles') || '[]');
    if (rolesMap.find(r => r.name.toLowerCase() === name.toLowerCase())) {
        this.notifyToast("A role with this name already exists.", 'warning');
        return;
    }

    rolesMap.push({ name, color: colorInput.value });
    localStorage.setItem('cl_server_roles', JSON.stringify(rolesMap));

    nameInput.value = '';
    this.renderRolesModal();
    this.renderOnlineUsers();
  }

  deleteCustomRole(index) {
    const rolesMap = JSON.parse(localStorage.getItem('cl_server_roles') || '[]');
    const roleToDelete = rolesMap[index];
    
    if (roleToDelete) {
        rolesMap.splice(index, 1);
        localStorage.setItem('cl_server_roles', JSON.stringify(rolesMap));

        // Remove role from users
        const userRoleAssignments = JSON.parse(localStorage.getItem('cl_server_user_roles') || '{}');
        for (let user in userRoleAssignments) {
            if (userRoleAssignments[user] === roleToDelete.name) {
                delete userRoleAssignments[user];
            }
        }
        localStorage.setItem('cl_server_user_roles', JSON.stringify(userRoleAssignments));

        this.renderRolesModal();
        this.renderOnlineUsers();
    }
  }

  assignRoleToPlayer() {
    const playerSelect = document.getElementById('assignRolePlayerSelect');
    const roleSelect = document.getElementById('assignRoleRoleSelect');
    if (!playerSelect || !roleSelect) return;

    const playerName = playerSelect.value;
    const roleName = roleSelect.value;

    const userRoleAssignments = JSON.parse(localStorage.getItem('cl_server_user_roles') || '{}');
    
    if (roleName === 'none') {
        delete userRoleAssignments[playerName];
    } else {
        userRoleAssignments[playerName] = roleName;
    }

    localStorage.setItem('cl_server_user_roles', JSON.stringify(userRoleAssignments));
    
    this.renderRolesModal();
    this.renderOnlineUsers();
  }

  selectVoiceRoom(roomKey, element) {
    this.currentVoiceRoom = roomKey;
    document.querySelectorAll('[data-voice]').forEach(el => el.classList.remove('active'));
    if (element) {
      element.classList.add('active');
    } else {
      const el = document.querySelector(`[data-voice="${roomKey}"]`);
      if (el) el.classList.add('active');
    }
    const voiceRoomElem = document.getElementById('voiceRoomName');
    if (voiceRoomElem) voiceRoomElem.textContent = roomKey.replace('voice-', '').replace('-', ' ').toUpperCase();
  }

  syncVoiceToCurrentChannel() {
    if (!this.currentTextChannel) return;
    this.selectVoiceRoom(this.currentTextChannel);
    
    const badge = document.getElementById('voiceStatusBadge');
    if (badge && badge.textContent !== 'Connected') {
      this.toggleVoiceConnection();
    }
    
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }
    
    this.notifyToast(`🎙️ Voice Synced! Joined [${this.currentTextChannel.toUpperCase()}] voice room.`, 'success');
  }

  toggleVoiceConnection() {
    const badge = document.getElementById('voiceStatusBadge');
    const roomName = document.getElementById('voiceRoomName');
    const btnConnect = document.getElementById('btnConnectVoice');
    const btnMic = document.getElementById('btnToggleMic');
    const btnDeafen = document.getElementById('btnToggleDeafen');

    if (!badge) return;

    if (badge.textContent === 'Connected') {
      badge.textContent = 'Disconnected';
      badge.style.background = 'rgba(255, 82, 82, 0.2)';
      badge.style.color = 'var(--accent-red)';
      if (btnConnect) {
        btnConnect.textContent = 'Join Voice Channel';
        btnConnect.classList.remove('btn-danger');
        btnConnect.classList.add('btn-primary');
      }
      if (btnMic) btnMic.disabled = true;
      if (btnDeafen) btnDeafen.disabled = true;
    } else {
      if (!this.currentVoiceRoom) this.currentVoiceRoom = 'lounge-1';
      badge.textContent = 'Connected';
      badge.style.background = 'rgba(0, 230, 118, 0.2)';
      badge.style.color = 'var(--accent-green)';
      if (roomName) roomName.textContent = this.currentVoiceRoom.replace('-', ' ').toUpperCase();
      if (btnConnect) {
        btnConnect.textContent = 'Disconnect Voice';
        btnConnect.classList.remove('btn-primary');
        btnConnect.classList.add('btn-danger');
      }
      if (btnMic) btnMic.disabled = false;
      if (btnDeafen) btnDeafen.disabled = false;
    }
  }

  handleCreateChannel() {
    const input = document.getElementById('newChannelNameInput');
    if (!input) return;
    const name = input.value.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name) return;

    if (this.creatingChannelType === 'text') {
      const list = document.getElementById('textChannelsList');
      if (list) {
        const div = document.createElement('div');
        div.className = 'channel-item';
        div.setAttribute('data-channel', name);
        div.textContent = `# ${name}`;
        list.appendChild(div);
      }
      this.textMessages[name] = [
        { id: Date.now(), author: 'System', text: `Welcome to #${name}!`, time: 'Just now', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ];
      this.switchTextChannel(name);
    } else {
      const list = document.getElementById('voiceChannelsList');
      if (list) {
        const div = document.createElement('div');
        div.className = 'channel-item';
        div.setAttribute('data-voice', name);
        div.innerHTML = `<span>🔊</span> ${name.replace('-', ' ')}`;
        list.appendChild(div);
      }
      this.selectVoiceRoom(name);
    }

    input.value = '';
    const modal = document.getElementById('createChannelModal');
    if (modal) modal.classList.remove('active');
  }
}

window.chatVoiceManager = new ChatVoiceManager();
document.addEventListener('DOMContentLoaded', () => window.chatVoiceManager.init());

