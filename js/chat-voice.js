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

    this.guilds = {
      'hotgirl': { name: 'Hot Girl Central', icon: '🔥' },
      'cs2scrims': { name: 'CS2 Scrims & LFG', icon: '🎯' },
      'wardogs': { name: 'WARDOG HQ', icon: '🐕' },
      'debate': { name: 'Debate Arena', icon: '🗣️' }
    };

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

    this.textMessages = {
      'general': [
        { id: 1, author: 'ApexGod99', text: 'Anyone hosting 5v5 CS2 scrims tonight?', time: '7:42 PM', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' },
        { id: 2, author: 'ShadowNinja', text: 'Queue up on quick queue! Need 2 more high Diamond players.', time: '7:44 PM', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '⚡', name: 'Electro GG' } }
      ],
      'welcome': [
        { id: 3, author: 'CustomLobbiesBot', text: '👋 Welcome to CustomLobbies Community Discord Hub! Read the rules and join voice channels!', time: '12:00 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'rules': [
        { id: 4, author: 'Admin', text: '📜 1. Be respectful. 2. No cheating or unauthorized exploits. 3. GL HF!', time: '12:01 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'pics': [
        { id: 5, author: 'Valkyrie_CS', text: 'Check out this sick AWP 1v4 clutch on Inferno!', time: '6:15 PM', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '🔥', name: 'Fire Play' } }
      ],
      'commands': [
        { id: 6, author: 'ApexGod99', text: '!stats BDroplE', time: '5:00 PM', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' }
      ],
      'promo': [
        { id: 7, author: 'ProStreamer', text: 'Live testing new tournament widgets at twitch.tv/CustomLobbiesHost', time: '4:30 PM', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80' }
      ],
      'lfg-cs2': [
        { id: 8, author: 'Valkyrie_CS', text: 'LFG 5v5 Mirage/Inferno. 1900+ MMR only.', time: '7:30 PM', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' }
      ],
      'tournaments': [
        { id: 9, author: 'CustomLobbiesBot', text: '🏆 Weekly $500 5v5 Tournament registrations open tomorrow at 12:00 PM EST!', time: '6:00 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80', sticker: { emoji: '🏆', name: 'Champion' } }
      ]
    };

    this.onlineUsers = [
      { name: 'ApexGod99', mmr: 2150, status: 'Online' },
      { name: 'ShadowNinja', mmr: 1920, status: 'In Game' },
      { name: 'Valkyrie_CS', mmr: 1840, status: 'Streaming' },
      { name: 'RadiantReaper', mmr: 2540, status: 'Online' },
      { name: 'ProSniper_2026', mmr: 1450, status: 'In Queue' }
    ];
  }

  init() {
    this.loadPinnedStickers();
    this.loadChatTheme();
    this.renderMessages();
    this.renderOnlineUsers();
    this.renderStickerPalette();
    this.renderDashboardStickers();
    this.setupEventListeners();
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
    alert(`📢 High Score Card posted to #${this.currentTextChannel}!`);
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
    // Server Rail Clicks
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

    // User status card mic/deafen buttons
    const btnUserMic = document.getElementById('btnUserMicToggle');
    const btnUserDeafen = document.getElementById('btnUserDeafenToggle');

    if (btnUserMic) {
      btnUserMic.addEventListener('click', () => {
        this.isMicMuted = !this.isMicMuted;
        btnUserMic.textContent = this.isMicMuted ? '🔇' : '🎙️';
        const mainMicBtn = document.getElementById('btnToggleMic');
        if (mainMicBtn) {
          mainMicBtn.click();
        }
      });
    }

    if (btnUserDeafen) {
      btnUserDeafen.addEventListener('click', () => {
        this.isDeafened = !this.isDeafened;
        btnUserDeafen.textContent = this.isDeafened ? '🔇' : '🎧';
        const mainDeafenBtn = document.getElementById('btnToggleDeafen');
        if (mainDeafenBtn) {
          mainDeafenBtn.click();
        }
      });
    }

    // Chat form submit
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chatInputText');
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
    const btnMic = document.getElementById('btnToggleMic');
    const btnDeafen = document.getElementById('btnToggleDeafen');

    if (btnConnect) {
      btnConnect.addEventListener('click', () => this.toggleVoiceConnection());
    }

    if (btnMic) {
      btnMic.addEventListener('click', () => {
        this.isMicMuted = !this.isMicMuted;
        document.getElementById('micIcon').textContent = this.isMicMuted ? '🔇' : '🎙️';
        btnMic.classList.toggle('btn-danger', this.isMicMuted);
      });
    }

    if (btnDeafen) {
      btnDeafen.addEventListener('click', () => {
        this.isDeafened = !this.isDeafened;
        document.getElementById('deafenIcon').textContent = this.isDeafened ? '🔇' : '🎧';
        btnDeafen.classList.toggle('btn-danger', this.isDeafened);
      });
    }
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

  pinStickerToDashboard(stickerEmoji, stickerName) {
    const exists = this.pinnedStickers.some(s => s.emoji === stickerEmoji && s.name === stickerName);
    if (exists) {
      alert(`"${stickerEmoji} ${stickerName}" is already pinned to your Dashboard Showcase!`);
      return;
    }

    if (this.pinnedStickers.length >= 10) {
      alert('Maximum 10 stickers pinned to Dashboard Showcase. Remove one to add more!');
      return;
    }

    this.pinnedStickers.push({ emoji: stickerEmoji, name: stickerName });
    this.savePinnedStickers();
    this.renderDashboardStickers();
    alert(`📌 Successfully pinned "${stickerEmoji} ${stickerName}" to your Dashboard Showcase!`);
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

  sendMessage(text) {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
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
        </div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }

  renderOnlineUsers() {
    const container = document.getElementById('onlineUsersList');
    if (!container) return;

    container.innerHTML = this.onlineUsers.map(u => `
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-green);"></span>
          <span style="font-weight: 600;">${u.name}</span>
        </div>
        <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.78rem;">${u.mmr} MMR</span>
      </div>
    `).join('');
  }

  selectVoiceRoom(roomKey) {
    this.currentVoiceRoom = roomKey;
    const voiceRoomElem = document.getElementById('voiceRoomName');
    if (voiceRoomElem) voiceRoomElem.textContent = roomKey.replace('-', ' ').toUpperCase();
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

