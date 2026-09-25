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

    // Per-Channel Match Lobby & Team Pool Engine
    this.channelLobbies = {};

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
        { id: 10, author: 'CustomLobbiesBot', text: '👋 Welcome to CustomLobbies Community Hub! Read the rules and join voice channels!', time: '12:00 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
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
      'lfg-cs2': [
        { id: 15, author: 'ZywOo_Master', text: 'LFG 5v5 Premier Scrims, 2800+ MMR lobby. Looking for aggressive entry rifler.', time: '12:15 PM', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' }
      ],
      'tournaments': [
        { id: 16, author: 'CustomLobbiesBot', text: '🏆 Live Tournament Bracket synchronized. Check the #tournaments tab or type <b>-b</b> in chat to inspect live matches.', time: '12:10 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
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
    if (element) element.classList.add('active');

    const header = document.getElementById('currentChannelHeader');
    if (header) header.textContent = `# ${channelName}`;
    
    const topic = document.getElementById('currentChannelTopic');
    if (topic) topic.textContent = `Discussion and chat for #${channelName}`;
    
    const input = document.getElementById('chatInputText');
    if (input) input.placeholder = `Send a message to #${channelName}...`;

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

  selectVoiceRoom(roomKey) {
    this.currentVoiceRoom = roomKey;
    const voiceRoomElem = document.getElementById('voiceRoomName');
    if (voiceRoomElem) voiceRoomElem.textContent = roomKey.replace('-', ' ').toUpperCase();
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

