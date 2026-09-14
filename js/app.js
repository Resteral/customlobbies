/* CustomLobbies.com - Main Hub Controller, FACEIT-Style Competitive Match Room & Guardian AC */
class CustomLobbiesApp {
  constructor() {
    this.activeQueue = false;
    this.queueTimerInterval = null;
    this.queueSeconds = 0;
    this.currentDraftGame = 'Counter-Strike 2';
    this.activeFilter = 'all';
    this.captainSelectionMode = 'highest_mmr';
    this.bannedMaps = new Set();
    this.selectedMatchMap = null;
    this.passedFirstPick = false;
    this.acStatus = 'ACTIVE_RING0';

    // Live Matchmaking Pool Feed
    this.poolFeed = [
      { id: 1, name: 'RadiantReaper', elo: 2540, time: 'Just Now', isCaptain: true, votes: 5, level: 11, acVerified: true },
      { id: 2, name: 'ApexGod99', elo: 2150, time: '1m ago', isCaptain: true, votes: 4, level: 10, acVerified: true },
      { id: 3, name: 'ShadowNinja', elo: 1920, time: '2m ago', isCaptain: false, votes: 2, level: 9, acVerified: true },
      { id: 4, name: 'You (Host)', elo: 1840, time: '2m ago', isCaptain: false, votes: 3, level: 8, acVerified: true },
      { id: 5, name: 'Valkyrie_CS', elo: 1790, time: '3m ago', isCaptain: false, votes: 1, level: 8, acVerified: true },
      { id: 6, name: 'ViperQueen', elo: 1720, time: '3m ago', isCaptain: false, votes: 0, level: 7, acVerified: true }
    ];

    // Expanded Game Roster
    this.allGames = [
      'Counter-Strike 2',
      'CS2 Bhop (Auto & Scroll)',
      'CS2 Danger Zone (BR)',
      'CS2 Retake (Bomb Defusal)',
      'CS2 Execute (Tactical Scrims)',
      'CS2 1v1 Arena (Aim Map)',
      'CS2 Gun Game (Arms Race)',
      'CS2 Deathmatch (FFA DM)',
      'CS2 HNS (Hide & Seek)',
      'CS2 Surf (Tier 1-6)',
      'CS2 KZ / Climb (Bhop)',
      'CS2 Zombie Escape',
      'Valorant',
      'Dota 2',
      'StarCraft II',
      'PUBG',
      'Arkheron',
      'Empulse',
      'Rainbow Six Siege',
      'FiveM GTA RP',
      'Rocket League',
      'Apex Legends'
    ];

    this.favoriteGames = new Set(['Counter-Strike 2', 'CS2 Bhop (Auto & Scroll)', 'CS2 Retake (Bomb Defusal)', 'Valorant', 'Dota 2', 'FiveM GTA RP']);
    this.loadFavorites();

    this.sponsoredServers = [
      { id: 314, name: 'CS2 128-Tick Auto-Bhop Speedrun Server', game: 'CS2 Bhop (Auto & Scroll)', host: 'Bhop_God', players: 18, max: 24, connectURL: 'steam://connect/192.168.1.100:27015', sponsoredBadge: '🐰 BHOP SPONSOR' },
      { id: 315, name: 'CS2 Danger Zone Solos & Duos Arena', game: 'CS2 Danger Zone (BR)', host: 'DZ_Survivor', players: 16, max: 18, connectURL: 'steam://connect/192.168.1.105:27015', sponsoredBadge: '🪂 DZ SPONSOR' },
      { id: 311, name: 'CS2 128-Tick Retake Server #1', game: 'CS2 Retake (Bomb Defusal)', host: 'Retake_Leader', players: 7, max: 9, connectURL: 'steam://connect/192.168.1.85:27015', sponsoredBadge: '💣 RETAKE SPONSOR' },
      { id: 309, name: 'CS2 Gun Game Arms Race Shoots Server', game: 'CS2 Gun Game (Arms Race)', host: 'GunGame_Master', players: 12, max: 16, connectURL: 'steam://connect/192.168.1.75:27015', sponsoredBadge: '🔫 GUN GAME SPONSOR' }
    ];

    this.lobbies = [
      { id: 9, title: 'CS2 FACEIT Level 8-10 Premier Scrims', game: 'Counter-Strike 2', host: 'ApexGod99', players: 9, max: 10, region: 'NA East', draftType: 'FACEIT Pro League' },
      { id: 8, title: 'CS2 3v4 Retake Mirage A/B Site Scrims', game: 'CS2 Retake (Bomb Defusal)', host: 'Retake_Leader', players: 7, max: 9, region: 'NA East', draftType: 'Retakers vs Defenders' },
      { id: 6, title: 'CS2 Surf Utopia v3 Tier 2 Speedrun Scrims', game: 'CS2 Surf (Tier 1-6)', host: 'SurfGod', players: 16, max: 32, region: 'NA East', draftType: 'Surf Timer Race' }
    ];

    this.leaderboardData = [
      { rank: 1, name: 'RadiantReaper', elo: 2540, wins: 142, losses: 28, streak: '🔥 W8' },
      { rank: 2, name: 'ApexGod99', elo: 2150, wins: 98, losses: 31, streak: '🔥 W4' },
      { rank: 3, name: 'ShadowNinja', elo: 1920, wins: 85, losses: 42, streak: '❌ L1' },
      { rank: 4, name: 'You (Host)', elo: 1840, wins: 76, losses: 34, streak: '🔥 W2' },
      { rank: 5, name: 'Valkyrie_CS', elo: 1790, wins: 64, losses: 40, streak: '❌ L2' },
      { rank: 6, name: 'ProSniper_2026', elo: 1450, wins: 41, losses: 45, streak: '🔥 W1' }
    ];
  }

  init() {
    this.setupTabNavigation();
    this.renderFavoriteStarTags();
    this.renderActiveGamesBar();
    this.renderSponsoredServers();
    this.renderPoolFeed();
    this.renderLobbies();
    this.renderLeaderboard();
    this.setupQueueButtons();
    this.setupModalHandlers();
    this.setupAutoDraftHandlers();
    this.setupFilterHandlers();
    this.setupRandomPickerHandler();
    this.setupCaptainModeToggle();
    this.setupGameDraftPoolButton();
  }

  loadFavorites() {
    const saved = localStorage.getItem('cl_fav_games');
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        this.favoriteGames = new Set(arr);
      } catch (err) {
        console.warn('Error loading favorite games:', err);
      }
    }
  }

  saveFavorites() {
    localStorage.setItem('cl_fav_games', JSON.stringify(Array.from(this.favoriteGames)));
  }

  toggleFavorite(gameName) {
    if (this.favoriteGames.has(gameName)) {
      this.favoriteGames.delete(gameName);
    } else {
      this.favoriteGames.add(gameName);
    }
    this.saveFavorites();
    this.renderFavoriteStarTags();
    this.renderActiveGamesBar();
    this.renderLobbies();
  }

  // FACEIT-Style Match Room & Ready Check
  launchFaceitMatchRoom(lobbyTitle, gameTitle) {
    const serverIP = '192.168.1.50:27015';
    const serverPass = 'cl_scrim_2026';
    const connectCmd = `connect ${serverIP}; password ${serverPass}`;

    alert(`🏆 FACEIT-STYLE COMPETITIVE MATCH ROOM DISPATCHED!\n\nMatch: "${lobbyTitle}" (${gameTitle})\n\n🛡️ Anti-Cheat Status: Guardian AC Verified (Active Ring 0 Driver)\n🎮 Server IP: ${serverIP}\n🔑 Password: ${serverPass}\n\n1-Click Launch Command:\n${connectCmd}`);
  }

  // Social Media Post Handler
  postToGamersWall() {
    const input = document.getElementById('socialComposerInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) {
      alert('⚠️ Please enter a message, clip link, or LFG request to post!');
      return;
    }

    const container = document.getElementById('gamersWallFeedContainer');
    if (!container) return;

    const postElement = document.createElement('div');
    postElement.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid var(--accent-gold); border-radius: 10px; padding: 1.2rem; box-shadow: 0 0 15px rgba(255, 215, 0, 0.1); margin-bottom: 1.2rem;';

    postElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00f2fe, #ff007f); display: flex; align-items: center; justify-content: center; font-weight: 900; border: 2px solid var(--accent-gold);">👑</div>
          <div>
            <h4 style="font-weight: 800; margin: 0;">You (Host) <span class="mmr-badge">1840 MMR</span></h4>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Posted Just Now • Social Media Update</p>
          </div>
        </div>
        <span class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan);">🛡️ Guardian AC Verified</span>
      </div>

      <p style="font-size: 0.95rem; margin-bottom: 1rem;">${text}</p>

      <div style="display: flex; gap: 1rem; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem;">
        <button class="btn btn-secondary btn-sm" onclick="alert('🔥 UPVOTED! Post Hype +1')">🔥 Hype Upvote (1)</button>
        <button class="btn btn-purple btn-sm" onclick="alert('🔁 REPOSTED to your profile!')">🔁 Repost</button>
        <button class="btn btn-primary btn-sm" onclick="alert('💬 Opening Reply Thread...')">💬 Reply (0)</button>
      </div>
    `;

    container.insertBefore(postElement, container.firstChild);
    input.value = '';
    alert('🚀 POST PUBLISHED!\n\nYour post was published live to The Gamers Wall Social Media feed!');
  }

  setupGameDraftPoolButton() {
    const btnDraftPool = document.getElementById('btnJoinGameDraftPool');
    if (!btnDraftPool) return;

    btnDraftPool.addEventListener('click', () => {
      const selectedGame = this.activeFilter !== 'all' && this.activeFilter !== 'favorites' ? this.activeFilter : 'Counter-Strike 2';
      const maxCap = window.eloEngine.getGameCapacity(selectedGame);

      this.activeQueue = true;
      const statusCard = document.getElementById('queueStatusCard');
      if (statusCard) statusCard.style.display = 'block';
      btnDraftPool.disabled = true;

      this.poolFeed.unshift({
        id: Date.now(),
        name: 'You (Queued for Draft)',
        elo: 1840,
        time: 'Just Now',
        isCaptain: false,
        votes: 1
      });

      this.renderPoolFeed();

      this.queueSeconds = 0;
      clearInterval(this.queueTimerInterval);

      this.queueTimerInterval = setInterval(() => {
        this.queueSeconds++;
        const mins = String(Math.floor(this.queueSeconds / 60)).padStart(2, '0');
        const secs = String(this.queueSeconds % 60).padStart(2, '0');
        
        document.getElementById('queueTimer').textContent = `Queueing for ${selectedGame} FACEIT Draft Pool: ${mins}:${secs} | Pool Players: ${maxCap - 1}/${maxCap}`;

        if (this.queueSeconds >= 6) {
          clearInterval(this.queueTimerInterval);
          if (statusCard) statusCard.style.display = 'none';
          btnDraftPool.disabled = false;

          alert(`🎉 FACEIT DRAFT POOL FULL (${maxCap}/${maxCap} Players)!\n\nLaunching Captain Snake Draft for ${selectedGame}...`);
          this.triggerAutoDraftModal(selectedGame);
        }
      }, 1000);
    });
  }

  setupCaptainModeToggle() {
    const btnHighestMMR = document.getElementById('btnModeHighestMMR');
    const btnSelectedCap = document.getElementById('btnModeSelectedCap');

    if (btnHighestMMR) {
      btnHighestMMR.addEventListener('click', () => {
        this.captainSelectionMode = 'highest_mmr';
        btnHighestMMR.classList.add('btn-primary');
        btnHighestMMR.classList.remove('btn-secondary');
        if (btnSelectedCap) {
          btnSelectedCap.classList.remove('btn-primary');
          btnSelectedCap.classList.add('btn-secondary');
        }
        this.renderPoolFeed();
      });
    }

    if (btnSelectedCap) {
      btnSelectedCap.addEventListener('click', () => {
        this.captainSelectionMode = 'selected';
        btnSelectedCap.classList.add('btn-primary');
        btnSelectedCap.classList.remove('btn-secondary');
        if (btnHighestMMR) {
          btnHighestMMR.classList.remove('btn-primary');
          btnHighestMMR.classList.add('btn-secondary');
        }
        this.renderPoolFeed();
      });
    }
  }

  voteSelectCaptain(playerName) {
    const p = this.poolFeed.find(user => user.name === playerName);
    if (p) {
      p.votes = (p.votes || 0) + 1;
      this.renderPoolFeed();
      alert(`🗳️ VOTE CAST!\n\nYou voted for ${p.name} as Captain! Total Votes: ${p.votes}`);
    }
  }

  banMap(mapName) {
    if (this.bannedMaps.has(mapName)) {
      this.bannedMaps.delete(mapName);
    } else {
      this.bannedMaps.add(mapName);
      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('hitmarker');
      }
    }
    this.renderMapVetoGrid();
  }

  selectMatchMap(mapName) {
    this.selectedMatchMap = mapName;
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }
    this.renderMapVetoGrid();
    alert(`🎮 DECIDED MATCH MAP!\n\nMap "${mapName}" selected for ${this.currentDraftGame}!`);
  }

  renderMapVetoGrid() {
    const container = document.getElementById('mapVetoGridContainer');
    if (!container) return;

    const maps = window.eloEngine.mapPools[this.currentDraftGame] || window.eloEngine.mapPools['Counter-Strike 2'];

    container.innerHTML = maps.map(m => {
      const isBanned = this.bannedMaps.has(m);
      const isPick = this.selectedMatchMap === m;

      return `
        <div style="background: ${isPick ? 'rgba(0, 230, 118, 0.15)' : isBanned ? 'rgba(255, 82, 82, 0.1)' : 'rgba(255, 255, 255, 0.05)'}; border: 1px solid ${isPick ? 'var(--accent-green)' : isBanned ? '#ff5252' : 'var(--border-color)'}; border-radius: 8px; padding: 0.6rem; text-align: center;">
          <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 0.4rem; color: ${isBanned ? '#ff5252' : isPick ? 'var(--accent-green)' : 'inherit'};">
            ${isBanned ? '🚫 BAN: ' : isPick ? '🎮 MATCH MAP: ' : ''}${m}
          </div>
          <div style="display: flex; gap: 0.3rem; justify-content: center;">
            <button class="btn ${isBanned ? 'btn-secondary' : 'btn-danger'} btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.app.banMap('${m}')">
              ${isBanned ? 'Unban' : 'Ban Map'}
            </button>
            ${!isBanned ? `
              <button class="btn btn-primary btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.app.selectMatchMap('${m}')">
                Pick Map
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  renderPoolFeed() {
    const container = document.getElementById('livePoolFeedContainer');
    if (!container) return;

    let captain1, captain2;

    if (this.captainSelectionMode === 'highest_mmr') {
      const sorted = [...this.poolFeed].sort((a, b) => b.elo - a.elo);
      captain1 = sorted[0];
      captain2 = sorted[1];
    } else {
      const sorted = [...this.poolFeed].sort((a, b) => (b.votes || 0) - (a.votes || 0));
      captain1 = sorted[0];
      captain2 = sorted[1];
    }

    const displayList = [...this.poolFeed];
    displayList.sort((a, b) => {
      if (this.captainSelectionMode === 'highest_mmr') return b.elo - a.elo;
      return (b.votes || 0) - (a.votes || 0);
    });

    container.innerHTML = displayList.map((p, idx) => {
      const isCaptain = (p.name === captain1?.name || p.name === captain2?.name);
      const tier = window.eloEngine.getRankTier(p.elo);

      return `
        <div style="display: flex; align-items: center; justify-content: space-between; background: ${isCaptain ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.04)'}; border: 1px solid ${isCaptain ? 'var(--accent-cyan)' : 'var(--border-color)'}; border-radius: 8px; padding: 0.6rem 0.8rem; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="speaking-indicator" style="background: ${isCaptain ? 'var(--accent-gold)' : 'var(--accent-green)'};"></div>
            <span style="font-weight: 700; font-size: 0.9rem;">${p.name}</span>
            <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green);">🛡️ AC Verified</span>
            ${isCaptain ? `<span class="lobby-game-tag" style="background: rgba(255, 215, 0, 0.2); color: var(--accent-gold);">👑 CAPTAIN ${idx + 1}</span>` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 0.82rem; color: ${tier.color}; font-weight: 800;">${tier.badge} (${p.elo} MMR)</span>
            ${this.captainSelectionMode === 'selected' ? `
              <button class="btn btn-purple btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="window.app.voteSelectCaptain('${p.name}')">
                🗳️ Vote (${p.votes || 0})
              </button>
            ` : `
              ${!isCaptain ? `<button class="btn btn-purple btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="window.app.voteSelectCaptain('${p.name}')">👑 Claim Captain</button>` : ''}
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  setupFilterHandlers() {
    const filterAll = document.getElementById('filterAllGames');
    const filterFavs = document.getElementById('filterFavsOnly');

    if (filterAll) {
      filterAll.addEventListener('click', () => {
        this.activeFilter = 'all';
        filterAll.classList.add('btn-primary');
        filterAll.classList.remove('btn-secondary');
        if (filterFavs) {
          filterFavs.classList.remove('btn-primary');
          filterFavs.classList.add('btn-secondary');
        }
        this.renderLobbies();
      });
    }

    if (filterFavs) {
      filterFavs.addEventListener('click', () => {
        this.activeFilter = 'favorites';
        filterFavs.classList.add('btn-primary');
        filterFavs.classList.remove('btn-secondary');
        if (filterAll) {
          filterAll.classList.remove('btn-primary');
          filterAll.classList.add('btn-secondary');
        }
        this.renderLobbies();
      });
    }
  }

  renderFavoriteStarTags() {
    const container = document.getElementById('favoriteGamesTagsContainer');
    if (!container) return;

    container.innerHTML = this.allGames.map(game => {
      const isFav = this.favoriteGames.has(game);
      return `
        <button class="btn btn-sm ${isFav ? 'btn-purple' : 'btn-secondary'}" onclick="window.app.toggleFavorite('${game}')">
          <span>${isFav ? '⭐' : '☆'}</span> ${game}
        </button>
      `;
    }).join('');
  }

  renderActiveGamesBar() {
    const bar = document.getElementById('activeGamesBarContainer');
    if (!bar) return;

    const counts = this.getActiveLobbyCounts();

    bar.innerHTML = this.allGames.map(game => {
      const cnt = counts[game] || 0;
      const isFav = this.favoriteGames.has(game);
      const isSelected = this.activeFilter === game;

      return `
        <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setGameFilter('${game}')" style="display: flex; align-items: center; gap: 0.4rem;">
          <span>${isFav ? '⭐' : '🎮'}</span>
          <span>${game}</span>
          <span class="lobby-game-tag" style="${cnt > 0 ? 'background: rgba(0, 230, 118, 0.2); color: var(--accent-green);' : 'background: rgba(255,255,255,0.05); color: var(--text-dim);'}">
            ${cnt > 0 ? '🔥 ' + cnt + ' Active' : '0 Lobbies'}
          </span>
        </button>
      `;
    }).join('');
  }

  setGameFilter(gameName) {
    if (this.activeFilter === gameName) {
      this.activeFilter = 'all';
    } else {
      this.activeFilter = gameName;
    }
    this.renderActiveGamesBar();
    this.renderLobbies();
  }

  renderSponsoredServers() {
    const grid = document.getElementById('sponsoredServersGrid');
    if (!grid) return;

    grid.innerHTML = this.sponsoredServers.map(s => `
      <div class="card" style="border-color: var(--accent-gold); position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
          <span class="lobby-game-tag" style="background: rgba(255, 215, 0, 0.15); color: var(--accent-gold);">${s.sponsoredBadge}</span>
          <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700;">${s.game}</span>
        </div>

        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 0.4rem;">${s.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Owner: <strong style="color: var(--text-main);">${s.host}</strong> | Players: <strong style="color: var(--accent-green);">${s.players}/${s.max} Live</strong></p>

        <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="window.app.connectToServer('${s.name}', '${s.connectURL}')">
          🔌 1-Click Connect Server
        </button>
      </div>
    `).join('');
  }

  connectToServer(name, url) {
    alert(`⚡ CONNECTING TO SPONSORED SERVER:\n\n"${name}"\n\nConnection URL: ${url}\nLaunching game client...`);
  }

  connectLobbyVoice(lobbyTitle) {
    const communityTabBtn = document.querySelector('[data-tab="community-view"]');
    if (communityTabBtn) communityTabBtn.click();

    if (window.chatVoiceEngine) {
      window.chatVoiceEngine.connectVoiceRoom(101, '🔊 Team 1 - Alpha');
    }

    alert(`🎙️ CONNECTED TO VOICE!\n\nJoined Team 1 Voice Room for custom lobby "${lobbyTitle}". Mic active!`);
  }

  setupRandomPickerHandler() {
    const btnRandom = document.getElementById('btnRandomPicker');
    if (!btnRandom) return;

    btnRandom.addEventListener('click', () => {
      let count = 0;
      btnRandom.disabled = true;

      const interval = setInterval(() => {
        count++;
        const randGame = this.allGames[Math.floor(Math.random() * this.allGames.length)];
        btnRandom.textContent = `🎲 Picking... ${randGame}`;

        if (count >= 15) {
          clearInterval(interval);
          const chosenGame = this.allGames[Math.floor(Math.random() * this.allGames.length)];
          btnRandom.textContent = `🎉 Chosen Game: ${chosenGame}!`;
          btnRandom.disabled = false;
          this.setGameFilter(chosenGame);
          setTimeout(() => {
            btnRandom.textContent = '🎲 Pick Random Game';
          }, 3000);
        }
      }, 100);
    });
  }

  setupTabNavigation() {
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.view-section').forEach(sec => {
          sec.classList.remove('active');
        });

        const targetSection = document.getElementById(tabId);
        if (targetSection) targetSection.classList.add('active');
      });
    });
  }

  renderLobbies() {
    const grid = document.getElementById('lobbiesGrid');
    if (!grid) return;

    const counts = this.getActiveLobbyCounts();

    let list = [...this.lobbies];
    if (this.activeFilter === 'favorites') {
      list = list.filter(l => this.favoriteGames.has(l.game));
    } else if (this.activeFilter !== 'all') {
      list = list.filter(l => l.game === this.activeFilter);
    }

    list.sort((a, b) => {
      const favA = this.favoriteGames.has(a.game) ? 100 : 0;
      const favB = this.favoriteGames.has(b.game) ? 100 : 0;

      const activeCntA = counts[a.game] || 0;
      const activeCntB = counts[b.game] || 0;

      const scoreA = favA + (activeCntA * 10) + a.players;
      const scoreB = favB + (activeCntB * 10) + b.players;

      return scoreB - scoreA;
    });

    if (list.length === 0) {
      grid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">No active lobbies match your current filter. Host a custom lobby above!</div>`;
      return;
    }

    grid.innerHTML = list.map(l => {
      const fillPct = Math.round((l.players / l.max) * 100);
      const isFav = this.favoriteGames.has(l.game);

      return `
        <div class="lobby-card" style="${isFav ? 'border-color: var(--accent-gold); box-shadow: 0 0 15px rgba(255, 215, 0, 0.15);' : ''}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span class="lobby-game-tag" style="${isFav ? 'background: rgba(255, 215, 0, 0.15); color: var(--accent-gold);' : ''}">
                ${isFav ? '⭐ ' : ''}${l.game}
              </span>
              <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green);">🛡️ Guardian AC Verified</span>
            </div>
            <button style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: ${isFav ? 'var(--accent-gold)' : 'var(--text-dim)'};" onclick="window.app.toggleFavorite('${l.game}')" title="Pin / Favorite Game">
              ${isFav ? '⭐' : '☆'}
            </button>
          </div>

          <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0.5rem 0;">${l.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Host: <strong style="color: var(--accent-cyan);">${l.host}</strong> | Type: <strong style="color: var(--accent-gold);">${l.draftType}</strong></p>

          <div class="lobby-players-bar">
            <div class="lobby-players-fill" style="width: ${fillPct}%;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">${l.players} / ${l.max} Players</span>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn btn-secondary btn-sm" onclick="window.app.connectLobbyVoice('${l.title}')" title="Connect WebRTC Voice Room">🎙️ Voice</button>
              <button class="btn btn-purple btn-sm" onclick="window.app.triggerAutoDraftModal('${l.game}')">👑 Captain Draft</button>
              <button class="btn btn-primary btn-sm" onclick="window.app.launchFaceitMatchRoom('${l.title}', '${l.game}')">🏆 Match Room</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  joinLobby(id) {
    const lobby = this.lobbies.find(l => l.id === id);
    if (lobby && lobby.players < lobby.max) {
      lobby.players++;

      this.poolFeed.unshift({
        id: Date.now(),
        name: 'You (Host)',
        elo: 1840,
        time: 'Just Now',
        isCaptain: false,
        votes: 1
      });

      this.renderPoolFeed();
      this.renderActiveGamesBar();
      this.renderLobbies();
      alert(`✅ Joined custom lobby "${lobby.title}"! Pushed into Live Matchmaking Pool Feed.`);
    }
  }

  triggerAutoDraftModal(gameTitle) {
    this.currentDraftGame = gameTitle;
    this.bannedMaps.clear();
    this.selectedMatchMap = null;
    this.passedFirstPick = false;

    const modal = document.getElementById('autoDraftModal');
    document.getElementById('draftGameTitle').textContent = `${gameTitle} FACEIT Captain Snake Draft Board`;
    modal.classList.add('active');
    this.runDraftSimulation();
    this.renderMapVetoGrid();
  }

  passTurnToCaptain1() {
    this.passedFirstPick = true;
    this.runDraftSimulation();
    alert('⏩ TURN PASSED!\n\nCaptain #2 passed First Pick turn to Captain #1 (Highest MMR)! Captain #1 now has the first pick.');
  }

  runDraftSimulation() {
    const maxCap = window.eloEngine.getGameCapacity(this.currentDraftGame);
    const result = window.eloEngine.performCustomSnakeDraft(this.leaderboardData, this.passedFirstPick);

    document.getElementById('captainAName').textContent = `👑 Captain #1 (Highest MMR): ${result.captain1.name} (${result.captain1.elo} MMR)`;
    document.getElementById('captainBName').textContent = `👑 Captain #2 (2nd Highest MMR): ${result.captain2.name} (${result.captain2.elo} MMR)`;

    document.getElementById('teamAList').innerHTML = result.team1.map(p => `
      <div style="display: flex; justify-content: space-between; background: rgba(0,242,254,0.08); padding: 0.5rem 0.8rem; border-radius: 6px; margin-bottom: 0.4rem; font-size: 0.88rem;">
        <span style="font-weight: 700;">${p.name}</span>
        <span style="color: var(--accent-gold);">${p.elo} MMR</span>
      </div>
    `).join('');

    document.getElementById('teamBList').innerHTML = result.team2.map(p => `
      <div style="display: flex; justify-content: space-between; background: rgba(157,78,221,0.08); padding: 0.5rem 0.8rem; border-radius: 6px; margin-bottom: 0.4rem; font-size: 0.88rem;">
        <span style="font-weight: 700;">${p.name}</span>
        <span style="color: var(--accent-gold);">${p.elo} MMR</span>
      </div>
    `).join('');

    document.getElementById('draftMMRSummary').textContent = `Capacity: ${maxCap} Players | First Pick: ${result.firstPickOwner} | Team 1 Avg: ${result.avgMMR1} MMR | Team 2 Avg: ${result.avgMMR2} MMR | Delta: ${result.mmrDelta} MMR`;
  }

  setupAutoDraftHandlers() {
    const btnClose = document.getElementById('btnCloseAutoDraftModal');
    const btnReDraft = document.getElementById('btnReDraftTeams');
    const btnConfirmDraft = document.getElementById('btnConfirmDraftTeams');
    const modal = document.getElementById('autoDraftModal');

    if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('active'));
    if (btnReDraft) btnReDraft.addEventListener('click', () => this.runDraftSimulation());

    if (btnConfirmDraft) {
      btnConfirmDraft.addEventListener('click', () => {
        modal.classList.remove('active');
        this.launchFaceitMatchRoom(this.currentDraftGame, this.currentDraftGame);
      });
    }
  }

  setupQueueButtons() {
    const btnJoin = document.getElementById('btnJoinQueue');
    const btnLeave = document.getElementById('btnLeaveQueue');
    const statusCard = document.getElementById('queueStatusCard');

    if (btnJoin) {
      btnJoin.addEventListener('click', () => {
        this.activeQueue = true;
        statusCard.style.display = 'block';
        btnJoin.disabled = true;

        this.poolFeed.unshift({
          id: Date.now(),
          name: 'You (Queued)',
          elo: 1840,
          time: 'Just Now',
          isCaptain: false,
          votes: 1
        });

        this.renderPoolFeed();

        this.queueSeconds = 0;
        clearInterval(this.queueTimerInterval);
        this.queueTimerInterval = setInterval(() => {
          this.queueSeconds++;
          const mins = String(Math.floor(this.queueSeconds / 60)).padStart(2, '0');
          const secs = String(this.queueSeconds % 60).padStart(2, '0');
          document.getElementById('queueTimer').textContent = `Time in queue: ${mins}:${secs} | Players in Pool: 9/10`;

          if (this.queueSeconds >= 8) {
            clearInterval(this.queueTimerInterval);
            statusCard.style.display = 'none';
            btnJoin.disabled = false;

            const balanced = window.eloEngine.autoBalanceTeams(this.leaderboardData);
            alert(`🎉 MATCH POPPED!\n\nTeam 1 Captain: ${balanced.team1[0].name} (${balanced.team1[0].elo} MMR)\nTeam 2 Captain: ${balanced.team2[0].name} (${balanced.team2[0].elo} MMR)\nMMR Delta: ${balanced.mmrDiff} (Fair Match)`);
          }
        }, 1000);
      });
    }

    if (btnLeave) {
      btnLeave.addEventListener('click', () => {
        this.activeQueue = false;
        clearInterval(this.queueTimerInterval);
        statusCard.style.display = 'none';
        if (btnJoin) btnJoin.disabled = false;
      });
    }
  }

  renderLeaderboard() {
    const tbody = document.getElementById('leaderboardTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.leaderboardData.map((p, idx) => {
      const tier = window.eloEngine.getRankTier(p.elo);
      const total = p.wins + p.losses;
      const winPct = Math.round((p.wins / total) * 100);
      const rankClass = idx < 3 ? `rank-${idx + 1}` : '';

      return `
        <tr>
          <td><div class="rank-pill ${rankClass}">${idx + 1}</div></td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 700;">${p.name}</span>
              <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green); font-size: 0.72rem;">🛡️ AC Active</span>
            </div>
          </td>
          <td><span style="color: var(--accent-gold); font-weight: 800;">${p.elo} ELO</span></td>
          <td>
            <span style="display: flex; align-items: center; gap: 0.3rem; color: ${tier.color}; font-weight: 700;">
              ${tier.badge}
            </span>
          </td>
          <td>${p.wins}W / ${p.losses}L</td>
          <td><strong style="color: var(--accent-green);">${winPct}%</strong></td>
          <td><span style="font-weight: 700;">${p.streak}</span></td>
        </tr>
      `;
    }).join('');
  }

  setupModalHandlers() {
    const btnHost = document.getElementById('btnCreateLobby');
    const modal = document.getElementById('createLobbyModal');
    const btnClose = document.getElementById('btnCloseLobbyModal');
    const btnSubmit = document.getElementById('btnSubmitNewLobby');

    if (btnHost) btnHost.addEventListener('click', () => modal.classList.add('active'));
    if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('active'));

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const title = document.getElementById('newLobbyTitle').value.trim() || '5v5 Custom Lobby';
        const game = document.getElementById('newLobbyGame').value;
        const max = parseInt(document.getElementById('newLobbyMax').value);

        this.lobbies.unshift({
          id: Date.now(),
          title,
          game,
          host: 'You (Host)',
          players: 1,
          max,
          region: 'NA East',
          draftType: 'FACEIT Competitive'
        });

        this.renderActiveGamesBar();
        this.renderLobbies();
        modal.classList.remove('active');
        alert(`🔥 Active FACEIT-Style Custom Lobby created for ${game}! Protected by Guardian Anti-Cheat Engine.`);
      });
    }
  }
}

window.app = new CustomLobbiesApp();
document.addEventListener('DOMContentLoaded', () => window.app.init());
