/* CustomLobbies.com - Main Hub Controller, Gamer Quests Engine & FACEIT Competitive Match Room */
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
    this.clPoints = 2450;
    this.equippedTitle = '💎 Diamond Veteran';
    this.equippedBanner = 'Cyberpunk Neon Matrix';
    this.equippedFrame = 'Gold Crown Ring';

    // CL Pulse Gamer Social Media Feed Posts
    this.pulsePosts = [];

    // Universal Free-Agent Player Pool Roster
    this.poolFeed = [];

    // Expanded Game Roster
    this.allGames = [
      'WARDOGS',
      'Counter-Strike 2',
      'REMATCH',
      'Arkheron',
      'Valorant',
      'Marvel Rivals',
      'Deadlock',
      'The Finals',
      'Overwatch 2',
      'League of Legends',
      'Dota 2',
      'StarCraft II',
      'PUBG',
      'Empulse',
      'Rainbow Six Siege',
      'FiveM GTA RP',
      'Rocket League',
      'Slapshot: Rebound'
    ];

    this.favoriteGames = new Set(['WARDOGS', 'Counter-Strike 2', 'REMATCH', 'Arkheron', 'Valorant', 'Marvel Rivals', 'Dota 2', 'FiveM GTA RP', 'Slapshot: Rebound']);
    this.loadFavorites();

    this.isAutoJoinActive = false;
    this.autoJoinInterval = null;

    this.teamLineup = [];
    this.teamBench = [];
    this.sponsoredServers = [];
    this.frontpageServers = [];
    this.unlockedServerIds = new Set();
    this.serverFilterType = 'all';
    this.activeInviteTargetServer = null;
    this.lobbyFilterType = 'public_with_players';
    this.lobbies = [];
    
    this.selectedLeaderboardGame = 'Counter-Strike 2';
    this.selectedLeaderboardRegion = 'all';
    this.leaderboardSearchQuery = '';

    this.leaderboardData = [];

    this.loadState();
  }

  getActiveLobbyCounts() {
    const counts = {};
    if (Array.isArray(this.lobbies)) {
      this.lobbies.forEach(l => {
        if (l.game) {
          counts[l.game] = (counts[l.game] || 0) + 1;
        }
      });
    }
    return counts;
  }

  getDefaultLobbies() {
    return [
      {
        id: 'lobby_wd_50',
        title: '🐕 WARDOGS 50v50 Frontline (Amber Strike Sector)',
        game: 'WARDOGS',
        host: 'Vanguard_Marshal',
        players: 42,
        max: 50,
        region: 'NA-East Dedicated Node',
        map: 'Amber Strike Frontline',
        draftType: '50v50 Battalion Draft',
        serverIp: '192.168.1.85:7777',
        tickrate: 128,
        matchStatus: '🔥 RECRUITING (42/50)',
        isPublic: true
      },
      {
        id: 'lobby_cs2_prem',
        title: 'CS2 128-Tick Premier Scrim #104',
        game: 'Counter-Strike 2',
        host: 'S1mple_Pro',
        players: 8,
        max: 10,
        region: 'NA-East (Virginia)',
        map: 'de_mirage & de_inferno',
        draftType: 'FACEIT 5v5 Premier',
        serverIp: '192.168.1.85:27015',
        tickrate: 128,
        matchStatus: '🔥 WARMUP (8/10)',
        isPublic: true
      },
      {
        id: 'lobby_val_rad',
        title: 'Valorant Radiant / Ascendant 5v5 Scrim',
        game: 'Valorant',
        host: 'TenZ_Aim',
        players: 7,
        max: 10,
        region: 'US East (N. Virginia)',
        map: 'Ascent & Bind',
        draftType: 'Competitive Custom',
        serverIp: '192.168.1.85:28015',
        tickrate: 128,
        matchStatus: '🔥 RECRUITING (7/10)',
        isPublic: true
      },
      {
        id: 'lobby_mr_6v6',
        title: 'Marvel Rivals 6v6 High-MMR Scrim',
        game: 'Marvel Rivals',
        host: 'IronFist_Leader',
        players: 9,
        max: 12,
        region: 'NA-East',
        map: 'Tokyo 2099: Shin-Shibuya',
        draftType: '6v6 Ranked Draft',
        serverIp: '192.168.1.85:29015',
        tickrate: 128,
        matchStatus: '🔥 RECRUITING (9/12)',
        isPublic: true
      },
      {
        id: 'lobby_wd_33v33v33',
        title: '🐕 WARDOGS 33v33v33 Tri-Faction Conquest',
        game: 'WARDOGS',
        host: 'Ghost_Dog_99',
        players: 68,
        max: 99,
        region: 'NA-East (Virginia)',
        map: 'Sector 4 Outpost',
        draftType: '33v33v33 Tri-Faction',
        serverIp: '192.168.1.85:7778',
        tickrate: 128,
        matchStatus: '⚡ QUEUED (68/99)',
        isPublic: true
      },
      {
        id: 'lobby_rematch_5v5',
        title: 'REMATCH 5v5 High-Stakes Circuit Match',
        game: 'REMATCH',
        host: 'Rematch_God',
        players: 6,
        max: 10,
        region: 'US East (12ms)',
        map: 'Nexus Arena',
        draftType: '5v5 Premier BO3',
        serverIp: '192.168.1.85:7780',
        tickrate: 128,
        matchStatus: '⚡ DRAFTING (6/10)',
        isPublic: true
      },
      {
        id: 'lobby_empulse_5v5',
        title: 'Empulse 5v5 Arena Championship',
        game: 'Empulse',
        host: 'Empulse_Overlord',
        players: 8,
        max: 10,
        region: 'US Central',
        map: 'Empulse Facility Core',
        draftType: '5v5 Ranked',
        serverIp: '192.168.1.85:7782',
        tickrate: 128,
        matchStatus: '🟢 IN-GAME (8/10)',
        isPublic: true
      },
      {
        id: 'lobby_slapshot_3v3',
        title: 'Slapshot 3v3 Arcade Hockey Scrim',
        game: 'Slapshot: Rebound',
        host: 'PuckMaster99',
        players: 5,
        max: 6,
        region: 'US East',
        map: 'Puck Arena Stadium',
        draftType: '3v3 Ranked Scrim',
        serverIp: '192.168.1.85:7785',
        tickrate: 128,
        matchStatus: '🔥 RECRUITING (5/6)',
        isPublic: true
      },
      {
        id: 'lobby_cs2_wingman',
        title: 'CS2 2v2 Wingman Aim Ladder',
        game: 'Counter-Strike 2',
        host: 'NiKo_OneTap',
        players: 3,
        max: 4,
        region: 'US Central (Chicago)',
        map: 'de_vertigo',
        draftType: '2v2 Wingman',
        serverIp: '192.168.1.85:27016',
        tickrate: 128,
        matchStatus: '⚡ DRAFTING (3/4)',
        isPublic: true
      },
      {
        id: 'lobby_rl_3v3',
        title: 'Rocket League 3v3 Grand Champ Scrim',
        game: 'Rocket League',
        host: 'AerialKing_RL',
        players: 4,
        max: 6,
        region: 'US East',
        map: 'DFH Stadium',
        draftType: '3v3 Competitive',
        serverIp: '192.168.1.85:7790',
        tickrate: 128,
        matchStatus: '🔥 RECRUITING (4/6)',
        isPublic: true
      },
      {
        id: 'lobby_deadlock_6v6',
        title: 'Deadlock 6v6 Early Access Playtest Scrim',
        game: 'Deadlock',
        host: 'Seven_Main',
        players: 8,
        max: 12,
        region: 'NA-East',
        map: 'The Cursed City',
        draftType: '6v6 Lane Draft',
        serverIp: '192.168.1.85:7795',
        tickrate: 128,
        matchStatus: '🔥 RECRUITING (8/12)',
        isPublic: true
      },
      {
        id: 'lobby_finals_3v3',
        title: 'The Finals 3v3v3 Ranked Cashout Scrim',
        game: 'The Finals',
        host: 'HeavySledge',
        players: 6,
        max: 9,
        region: 'US East',
        map: 'Monaco 2023',
        draftType: 'Cashout 3v3v3',
        serverIp: '192.168.1.85:7800',
        tickrate: 128,
        matchStatus: '⚡ DRAFTING (6/9)',
        isPublic: true
      }
    ];
  }

  loadState() {
    try {
      const savedPoints = localStorage.getItem('cl_points_v2');
      if (savedPoints) this.clPoints = parseInt(savedPoints);
      
      const defaultLobbies = this.getDefaultLobbies();
      const savedLobbies = localStorage.getItem('cl_lobbies_v2');
      if (savedLobbies) {
        try {
          const parsed = JSON.parse(savedLobbies);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(parsed.map(l => l.id));
            const missing = defaultLobbies.filter(l => !existingIds.has(l.id));
            this.lobbies = [...parsed, ...missing];
          } else {
            this.lobbies = defaultLobbies;
          }
        } catch(e) {
          this.lobbies = defaultLobbies;
        }
      } else {
        this.lobbies = defaultLobbies;
      }
      const savedPool = localStorage.getItem('cl_pool_v2');
      if (savedPool) this.poolFeed = JSON.parse(savedPool);
      const savedTitle = localStorage.getItem('cl_title_v2');
      if (savedTitle) this.equippedTitle = savedTitle;
      const savedLeaderboard = localStorage.getItem('cl_leaderboard_v2');
      if (savedLeaderboard) this.leaderboardData = JSON.parse(savedLeaderboard);
      const savedLineup = localStorage.getItem('cl_lineup_v2');
      if (savedLineup) {
        const parsed = JSON.parse(savedLineup);
        if (parsed.lineup) this.teamLineup = parsed.lineup;
        if (parsed.bench) this.teamBench = parsed.bench;
      }
      this.loadFrontpageServers();
    } catch (e) {
      console.warn('Error loading app state:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('cl_points_v2', this.clPoints.toString());
      localStorage.setItem('cl_lobbies_v2', JSON.stringify(this.lobbies));
      localStorage.setItem('cl_pool_v2', JSON.stringify(this.poolFeed));
      localStorage.setItem('cl_title_v2', this.equippedTitle);
      localStorage.setItem('cl_leaderboard_v2', JSON.stringify(this.leaderboardData));
      localStorage.setItem('cl_lineup_v2', JSON.stringify({ lineup: this.teamLineup, bench: this.teamBench }));
      this.saveFrontpageServers();
    } catch (e) {
      console.warn('Error saving app state:', e);
    }
  }

  init() {
    this.initAuthSession();
    this.initDebateSystem();
    this.setupTabNavigation();
    this.renderFavoriteStarTags();
    this.renderActiveGamesBar();
    this.renderSponsoredServers();
    this.renderMyCreatedTeams();
    this.renderPoolFeed();
    this.renderLobbies();
    this.renderDebateLobbies();
    this.renderLeaderboard();
    this.renderLeaguesView();
    this.renderWardogsView();
    this.renderMatchmakingHub();
    this.setupQueueButtons();
    this.setupModalHandlers();
    this.setupAutoDraftHandlers();
    this.setupFilterHandlers();
    this.setupRandomPickerHandler();
    this.setupCaptainModeToggle();
    this.setupGameDraftPoolButton();
    this.setupLeaderboardHandlers();
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

  // Claim Daily Quest Reward Handler
  claimQuestReward(questBtnId, pointsReward) {
    const btn = document.getElementById(questBtnId);
    if (!btn || btn.disabled) return;

    this.clPoints += pointsReward;
    this.updatePointsWidget();

    btn.textContent = '✅ Claimed';
    btn.disabled = true;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-secondary');

    alert(`🎁 QUEST COMPLETED!\n\nYou claimed +${pointsReward} 🪙 CL-Points! Added to your wallet balance.`);
  }

  // Buy & Equip Profile Customization Upgrade
  buyProfileUpgrade(itemName, cost, type) {
    if (this.clPoints < cost) {
      alert(`❌ INSUFFICIENT CL-POINTS!\n\nYou need ${cost} 🪙 CL-Points for "${itemName}". Play more custom lobbies or win scrims to earn points!`);
      return;
    }

    this.clPoints -= cost;

    if (type === 'title') this.equippedTitle = itemName;
    if (type === 'banner') this.equippedBanner = itemName;
    if (type === 'frame') this.equippedFrame = itemName;

    this.updatePointsWidget();
    alert(`🎉 UNLOCKED & EQUIPPED!\n\nYou unlocked "${itemName}" for ${cost} 🪙 CL-Points!\nEquipped to your Gamer Profile Passport.`);
  }

  setupQueueButtons() {
    const queueBtns = document.querySelectorAll('#btnJoinQueue');
    const queueModal = document.getElementById('signUpQueueModal');
    const btnCloseModal = document.getElementById('btnCloseQueueModal');
    const btnCancelModal = document.getElementById('btnCancelQueueModal');
    const btnConfirm = document.getElementById('btnConfirmEnterQueue');
    const btnLeave = document.getElementById('btnLeaveQueue');
    const queueCard = document.getElementById('queueStatusCard');
    const queueTimer = document.getElementById('queueTimer');

    queueBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.activeQueue) {
          alert('⚠️ ALREADY IN MATCHMAKING QUEUE!\n\nYour queue is currently searching for a balanced match. Click "Leave Queue" to exit.');
          return;
        }
        if (queueModal) queueModal.classList.add('active');
      });
    });

    if (btnCloseModal) btnCloseModal.addEventListener('click', () => queueModal.classList.remove('active'));
    if (btnCancelModal) btnCancelModal.addEventListener('click', () => queueModal.classList.remove('active'));

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        const game = document.getElementById('queueSelectGame')?.value || 'Counter-Strike 2';
        const region = document.getElementById('queueSelectRegion')?.value || 'NA East';
        const role = document.getElementById('queueSelectRole')?.value || 'Any Role';

        this.activeQueue = true;
        this.queueSeconds = 0;
        this.queuedGame = game;
        this.queuedRegion = region;

        if (queueModal) queueModal.classList.remove('active');
        if (queueCard) queueCard.style.display = 'block';

        // Award +25 CL-Points queue bonus
        this.clPoints += 25;
        this.updatePointsWidget();

        if (window.widgetBuilderEngine) {
          window.widgetBuilderEngine.playSoundEffect('ggwp');
        }

        clearInterval(this.queueTimerInterval);
        this.queueTimerInterval = setInterval(() => {
          this.queueSeconds++;
          const mins = String(Math.floor(this.queueSeconds / 60)).padStart(2, '0');
          const secs = String(this.queueSeconds % 60).padStart(2, '0');
          const foundPlayers = Math.min(10, 6 + Math.floor(this.queueSeconds / 1.5));

          if (queueTimer) {
            queueTimer.textContent = `🎯 Searching for ${game} [${region}] • Role: ${role} | Time: ${mins}:${secs} | Est: ~00:15 | Pool: ${foundPlayers}/10 Players`;
          }

          // Trigger Match Ready when 10 players found (~6s)
          if (this.queueSeconds >= 6 && this.activeQueue) {
            this.leaveQueue(true);
            this.triggerMatchFoundModal(`${game} • 5v5 Premier Match [${region}]`);
          }
        }, 1000);

        alert(`🚀 QUEUE SIGN-UP CONFIRMED!\n\nSearching for balanced 5v5 match in ${game} (${region}) as ${role}!\nEarned +25 🪙 CL-Points queue bonus!`);
      });
    }

    if (btnLeave) {
      btnLeave.addEventListener('click', () => this.leaveQueue());
    }
  }

  startQueueFromWidget(game = 'Counter-Strike 2', region = 'NA East', role = 'Any Role') {
    if (this.activeQueue) {
      alert('⚠️ ALREADY IN MATCHMAKING QUEUE!\n\nYour queue search is currently active.');
      return;
    }

    this.activeQueue = true;
    this.queueSeconds = 0;
    this.queuedGame = game;
    this.queuedRegion = region;

    const queueCard = document.getElementById('queueStatusCard');
    const queueTimer = document.getElementById('queueTimer');

    if (queueCard) queueCard.style.display = 'block';

    // Award +25 CL-Points queue bonus
    this.clPoints += 25;
    this.updatePointsWidget();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('ggwp');
    }

    clearInterval(this.queueTimerInterval);
    this.queueTimerInterval = setInterval(() => {
      this.queueSeconds++;
      const mins = String(Math.floor(this.queueSeconds / 60)).padStart(2, '0');
      const secs = String(this.queueSeconds % 60).padStart(2, '0');
      const foundPlayers = Math.min(10, 6 + Math.floor(this.queueSeconds / 1.5));

      if (queueTimer) {
        queueTimer.textContent = `🎯 Searching for ${game} [${region}] • Role: ${role} | Time: ${mins}:${secs} | Est: ~00:15 | Pool: ${foundPlayers}/10 Players`;
      }

      if (this.queueSeconds >= 6 && this.activeQueue) {
        this.leaveQueue(true);
        this.triggerMatchFoundModal(`${game} • 5v5 Premier Match [${region}]`);
      }
    }, 1000);

    alert(`🚀 WIDGET QUEUE LAUNCHED!\n\nYou entered the matchmaking queue for ${game} (${region}) directly from the Quick Widget!\nEarned +25 🪙 CL-Points queue bonus!`);
  }

  selectQueueGameTitle(gameName) {
    const select = document.getElementById('queueSelectGame');
    if (select) {
      select.value = gameName;
    }
  }

  leaveQueue(silent = false) {
    this.activeQueue = false;
    clearInterval(this.queueTimerInterval);
    const queueCard = document.getElementById('queueStatusCard');
    if (queueCard) queueCard.style.display = 'none';

    if (!silent) {
      alert('🔴 LEFT MATCHMAKING QUEUE\n\nYou exited the matchmaking search queue.');
    }
  }

  updatePointsWidget() {
    const el = document.getElementById('userCLPointsValue');
    if (el) el.textContent = `${this.clPoints.toLocaleString()} Points`;
    const passportTitle = document.getElementById('userPassportTitle');
    if (passportTitle) passportTitle.textContent = this.equippedTitle;
    this.saveState();
  }

  renderPoolFeed() {
    const container = document.getElementById('livePoolFeedContainer');
    if (!container) return;

    const gameFilter = document.getElementById('playerPoolGameFilter')?.value || 'all';
    const roleFilter = document.getElementById('playerPoolRoleFilter')?.value || 'all';

    let filtered = this.poolFeed;
    if (gameFilter !== 'all') {
      filtered = filtered.filter(p => p.game === gameFilter);
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter(p => p.role === roleFilter);
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 1.5rem;">No free-agent players match your filter. Click "Sign Up for Player Pool" to list yourself!</div>`;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.9rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); font-size: 0.72rem;">${p.game}</span>
            <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green); font-size: 0.72rem;">🟢 ${p.status || 'Available'}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #00f2fe, #ff007f); display: flex; align-items: center; justify-content: center; font-weight: 900; border: 1px solid var(--accent-gold);">👑</div>
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 900; margin: 0; color: var(--text-main);">${p.name}</h4>
              <div style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700;">${p.elo} MMR • ${p.karma || '100% Karma'}</div>
            </div>
          </div>

          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem;">
            Role: <strong style="color: var(--accent-cyan);">${p.role}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 0.3rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" style="flex: 1; font-size: 0.72rem; padding: 0.25rem 0.4rem;" onclick="window.app.recruitPoolPlayer(${p.id})">
            ➕ Recruit
          </button>
          <button class="btn btn-success btn-sm" style="font-size: 0.72rem; padding: 0.25rem 0.4rem; background: rgba(0, 230, 118, 0.15); border-color: rgba(0, 230, 118, 0.4); color: var(--accent-green);" onclick="window.app.awardPlayerHonor('${p.name}', 'friendly')" title="Award Commendation">
            ⭐
          </button>
          <button class="btn btn-danger btn-sm" style="font-size: 0.72rem; padding: 0.25rem 0.4rem;" onclick="window.app.flagPlayerMisconduct('${p.name}', 'toxic')" title="Flag Misconduct">
            🚩
          </button>
          <button class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.25rem 0.4rem;" onclick="window.app.openPlayerPassportModal('${p.name}')">
            🪪 Passport
          </button>
        </div>
      </div>
    `).join('');
  }

  openJoinPlayerPoolModal() {
    const modal = document.getElementById('joinPlayerPoolModal');
    if (modal) modal.classList.add('active');
  }

  submitJoinPlayerPool() {
    const handleInput = document.getElementById('poolRegisterName');
    const name = handleInput?.value.trim() || 'Sean';
    const game = document.getElementById('poolRegisterGame')?.value || 'WARDOGS';
    const role = document.getElementById('poolRegisterRole')?.value || 'Entry Fragger';
    const note = document.getElementById('poolRegisterNote')?.value.trim() || 'Ready for scrims!';

    const newFreeAgent = {
      id: Date.now(),
      name: name,
      elo: 2150,
      game: game,
      role: role,
      time: 'Just Now',
      karma: '100% Positive',
      status: 'Available',
      acVerified: true,
      note: note
    };

    if (!this.poolFeed) this.poolFeed = [];
    this.poolFeed.unshift(newFreeAgent);
    localStorage.setItem('cl_user_pool_feed_v1', JSON.stringify(this.poolFeed));
    this.renderPoolFeed();

    // Also register into WARDOGS engine so player immediately appears in WARDOGS Free Agent Pool!
    if (window.wardogsEngine) {
      if (!window.wardogsEngine.soloMercenaries) window.wardogsEngine.soloMercenaries = [];
      const callsign = (name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() || 'VIPER') + '-1';
      window.wardogsEngine.soloMercenaries.unshift({
        id: newFreeAgent.id,
        name: name,
        callsign: callsign,
        game: game,
        role: role,
        elo: 2150,
        status: 'Available for Draft',
        bio: note
      });
      this.renderWardogsView();
    }

    const modal = document.getElementById('joinPlayerPoolModal');
    if (modal) modal.classList.remove('active');

    // Award +25 CL-Points signup bonus
    this.clPoints += 25;
    this.updatePointsWidget();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
      if (typeof window.widgetBuilderEngine.showToast === 'function') {
        window.widgetBuilderEngine.showToast(`🚀 ${name} listed in Free-Agent Pool (+25 🪙 CL-Points)!`, 'success');
      }
    }

    alert(`🚀 FREE-AGENT SIGNUP COMPLETE!\n\n${name} is now listed in the Free-Agent Draft Pool for ${game} (${role})!\nEarned +25 🪙 CL-Points signup bonus!`);
  }

  recruitPoolPlayer(playerId) {
    const player = this.poolFeed.find(p => p.id === playerId);
    if (!player) return;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('cheer');
    }

    if (!this.myCreatedTeams || this.myCreatedTeams.length === 0) {
      alert(`⚠️ NO TEAM FOUND!\n\nYou must Create a Team first before recruiting Free Agents!`);
      return;
    }

    const team = this.myCreatedTeams[0];
    if (!team.applications) team.applications = [];
    
    // Add them as a pending request to be managed
    team.applications.push({
      name: player.name,
      role: player.role,
      elo: player.elo
    });

    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));
    
    alert(`📨 DRAFT POOL REQUEST SENT!\n\n${player.name} has been added to ${team.name}'s incoming recruitment requests for your review.`);
    
    this.openManageTeamModal(team.id);
  }

  // FACEIT-Style Match Room & Ready Check connected to Helix Server
  launchFaceitMatchRoom(lobbyTitle, gameTitle) {
    const serverIP = window.helixServerNodeIp || (gameTitle === 'Helix Game' || gameTitle === 'Pacifica' ? '127.0.0.1:7777' : '192.168.1.85:27015');
    const serverPass = 'helix_comp_scrim';
    this.currentMatchRoomTitle = `${lobbyTitle} (${gameTitle})`;
    this.currentMatchServerIp = serverIP;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('match_found');
      window.widgetBuilderEngine.showToast(`🚀 Competitive Match Popped! Connected to Dedicated Server (${serverIP})`, 'success');
    }

    const modal = document.getElementById('matchFoundModal');
    if (modal) {
      const titleEl = document.getElementById('matchFoundTitle');
      if (titleEl) titleEl.textContent = `🏆 ${lobbyTitle} (${gameTitle}) - SERVER LIVE`;
      modal.classList.add('active');
    } else {
      this.launchServerProtocol({
        serverIp: serverIP,
        game: gameTitle || 'Helix Game',
        title: lobbyTitle,
        password: serverPass
      });
    }
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

  // Publish Auto-Farmed Clip to The Gamers Wall Feed
  postAutoClipToGamersWall(clipTitle, gameTitle, triggerName) {
    const container = document.getElementById('gamersWallFeedContainer');
    if (!container) return;

    const postElement = document.createElement('div');
    postElement.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid var(--accent-cyan); border-radius: 10px; padding: 1.2rem; box-shadow: 0 0 15px rgba(0, 242, 254, 0.15); margin-bottom: 1.2rem;';

    postElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00f2fe, #ff007f); display: flex; align-items: center; justify-content: center; font-weight: 900; border: 2px solid var(--accent-gold);">👑</div>
          <div>
            <h4 style="font-weight: 800; margin: 0;">You (Host) <span class="mmr-badge" style="border-color: var(--accent-cyan); color: var(--accent-cyan);">1840 MMR</span></h4>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Posted Just Now • Auto-Farmed Clip</p>
          </div>
        </div>
        <span class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan);">🎥 ${triggerName}</span>
      </div>

      <p style="font-size: 0.95rem; margin-bottom: 0.8rem;">🔥 Auto-Farmed Highlight Clip from <strong>${gameTitle}</strong>: "${clipTitle}"! Harvested automatically using CustomLobbies Auto-Clip Engine! 🎬</p>

      <div style="background: #000; border-radius: 8px; padding: 1.5rem; text-align: center; margin-bottom: 1rem; border: 1px solid var(--accent-cyan);">
        <div style="font-size: 2.5rem; margin-bottom: 0.4rem;">🎬</div>
        <div style="font-weight: 700; color: var(--accent-cyan);">[CustomLobbies Auto-Farmed Video Highlight Stream - 1080p 60FPS]</div>
      </div>

      <div style="display: flex; gap: 1rem; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem;">
        <button class="btn btn-secondary btn-sm" onclick="alert('🔥 UPVOTED! Post Hype +1')">🔥 Hype Upvote (1)</button>
        <button class="btn btn-purple btn-sm" onclick="alert('🔁 REPOSTED to your profile!')">🔁 Repost Clip</button>
        <button class="btn btn-primary btn-sm" onclick="alert('💬 Opening Reply Thread...')">💬 Reply (0)</button>
      </div>
    `;

    container.insertBefore(postElement, container.firstChild);

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    alert(`🚀 FARMED CLIP PUBLISHED!\n\nClip "${clipTitle}" was posted to The Gamers Wall feed!`);
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
    const btnCaptainCommends = document.getElementById('btnModeCaptainCommends');
    const btnSelectedCap = document.getElementById('btnModeSelectedCap');

    const updateActiveButton = (activeBtn) => {
      [btnHighestMMR, btnCaptainCommends, btnSelectedCap].forEach(b => {
        if (b) {
          b.classList.remove('btn-primary');
          b.classList.add('btn-secondary');
        }
      });
      if (activeBtn) {
        activeBtn.classList.add('btn-primary');
        activeBtn.classList.remove('btn-secondary');
      }
    };

    if (btnHighestMMR) {
      btnHighestMMR.addEventListener('click', () => {
        this.captainSelectionMode = 'highest_mmr';
        updateActiveButton(btnHighestMMR);
        this.renderPoolFeed();
      });
    }

    if (btnCaptainCommends) {
      btnCaptainCommends.addEventListener('click', () => {
        this.captainSelectionMode = 'captain_commends';
        updateActiveButton(btnCaptainCommends);
        this.renderPoolFeed();
        alert('🧠 CAPTAIN MODE UPDATED!\n\nTeam Captains are now designated based on the highest accumulated Captain / Leadership Commendations!');
      });
    }

    if (btnSelectedCap) {
      btnSelectedCap.addEventListener('click', () => {
        this.captainSelectionMode = 'selected';
        updateActiveButton(btnSelectedCap);
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
      this.addVetoLog(`• Map "${mapName}" was unbanned.`);
    } else {
      this.bannedMaps.add(mapName);
      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('hitmarker');
      }
      this.addVetoLog(`• [${this.vetoTurn || 'Team Alpha'}] BANNED map "${mapName}".`);
      this.vetoTurn = this.vetoTurn === 'Team Alpha' ? 'Team Bravo' : 'Team Alpha';
    }
    this.renderMapVetoGrid();
  }

  selectMatchMap(mapName) {
    this.selectedMatchMap = mapName;
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }
    this.addVetoLog(`• [${this.vetoTurn || 'Team Alpha'}] SELECTED OFFICIAL MATCH MAP: "${mapName}"!`);
    this.renderMapVetoGrid();
    alert(`🎮 DECIDED MATCH MAP!\n\nMap "${mapName}" selected for ${this.currentDraftGame}!`);
  }

  addVetoLog(msg) {
    if (!this.vetoLogs) this.vetoLogs = [];
    this.vetoLogs.unshift(msg);
    const logContainer = document.getElementById('vetoHistoryLog');
    if (logContainer) {
      logContainer.innerHTML = this.vetoLogs.map(l => `<div>${l}</div>`).join('');
    }
  }

  openMapVetoModal(gameName) {
    if (gameName) {
      this.currentDraftGame = gameName;
    }
    const gameSelect = document.getElementById('vetoGameSelect');
    if (gameSelect) {
      gameSelect.value = this.currentDraftGame;
    }
    if (!this.vetoTurn) this.vetoTurn = 'Team Alpha';
    if (!this.vetoLogs || this.vetoLogs.length === 0) {
      this.vetoLogs = [`• Map veto session initialized for ${this.currentDraftGame}.`];
    }
    this.renderMapVetoGrid();
    const modal = document.getElementById('mapVetoModal');
    if (modal) modal.classList.add('active');
  }

  closeMapVetoModal() {
    const modal = document.getElementById('mapVetoModal');
    if (modal) modal.classList.remove('active');
  }

  openChromeExtensionModal() {
    const modal = document.getElementById('chromeExtensionModal');
    if (modal) modal.classList.add('active');
  }

  closeChromeExtensionModal() {
    const modal = document.getElementById('chromeExtensionModal');
    if (modal) modal.classList.remove('active');
  }

  // Esports Leagues & Divisions Implementation
  renderLeaguesView() {
    const gameSelect = document.getElementById('leagueGameSelect');
    const selectedGame = gameSelect ? gameSelect.value : 'Counter-Strike 2';

    if (!this.activeLeagueDivision) this.activeLeagueDivision = 'premier';

    const leagueData = window.leaguesEngine ? window.leaguesEngine.getLeagueForGame(selectedGame) : null;
    if (!leagueData) return;

    const divData = leagueData.divisions.find(d => d.id === this.activeLeagueDivision) || leagueData.divisions[0];

    const badge = document.getElementById('leagueDivisionBadge');
    if (badge) badge.textContent = divData.name;

    // Render Standings
    const tbody = document.getElementById('leagueStandingsBody');
    if (tbody) {
      tbody.innerHTML = divData.teams.map(t => `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
          <td style="padding: 0.75rem; font-weight: 900; color: ${t.rank === 1 ? 'var(--accent-gold)' : t.rank === 2 ? '#c0c0c0' : t.rank === 3 ? '#cd7f32' : 'inherit'};">
            ${t.rank === 1 ? '🥇 #1' : t.rank === 2 ? '🥈 #2' : t.rank === 3 ? '🥉 #3' : '#' + t.rank}
          </td>
          <td style="padding: 0.75rem;">
            <strong style="color: #fff;">${t.name}</strong>
            <span style="font-size: 0.75rem; color: var(--accent-cyan); margin-left: 0.3rem;">${t.tag}</span>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Captain: ${t.captain}</div>
          </td>
          <td style="padding: 0.75rem; font-weight: 800; color: var(--accent-green);">${t.wins} - ${t.losses}</td>
          <td style="padding: 0.75rem; font-weight: 900; color: var(--accent-gold);">${t.points} Pts</td>
          <td style="padding: 0.75rem; color: var(--accent-cyan); font-weight: 700;">${t.roundDelta}</td>
          <td style="padding: 0.75rem; font-weight: 700;">${t.winRate}</td>
          <td style="padding: 0.75rem; font-weight: 800; color: var(--accent-purple);">${t.elo} ELO</td>
          <td style="padding: 0.75rem; text-align: right;">
            <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="alert('⚔️ LEAGUE MATCH CHALLENGE!\\n\\nOfficial Challenge sent to ${t.name} (${t.captain})!')">⚔️ Match</button>
          </td>
        </tr>
      `).join('');
    }

    // Render Fixtures
    const fixturesContainer = document.getElementById('leagueFixturesContainer');
    if (fixturesContainer) {
      fixturesContainer.innerHTML = (leagueData.fixtures || []).map(f => `
        <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 0.4rem; font-weight: 800;">
            <span>${f.week}</span>
            <span style="color: ${f.status.includes('LIVE') ? 'var(--accent-green)' : 'var(--accent-gold)'};">${f.status}</span>
          </div>
          <div style="font-weight: 900; font-size: 0.92rem; margin-bottom: 0.3rem;">
            ${f.teamA} <span style="color: var(--accent-purple);">VS</span> ${f.teamB}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
            <span>⏱️ ${f.date}</span>
            <button class="btn btn-purple btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.app.openMapVetoModal('${selectedGame}')">🗺️ Map Veto</button>
          </div>
        </div>
      `).join('');
    }
  }

  switchLeagueDivision(divId) {
    this.activeLeagueDivision = divId;

    const btns = document.querySelectorAll('.league-tab-btn');
    btns.forEach(b => {
      if (b.getAttribute('data-div') === divId) {
        b.classList.remove('btn-secondary');
        b.classList.add('btn-purple', 'active');
      } else {
        b.classList.remove('btn-purple', 'active');
        b.classList.add('btn-secondary');
      }
    });

    this.renderLeaguesView();
  }

  openJoinLeagueModal() {
    const modal = document.getElementById('joinLeagueModal');
    if (modal) modal.classList.add('active');
  }

  closeJoinLeagueModal() {
    const modal = document.getElementById('joinLeagueModal');
    if (modal) modal.classList.remove('active');
  }

  submitLeagueRegistration() {
    const game = document.getElementById('modalLeagueGameSelect').value;
    const division = document.getElementById('modalLeagueDivisionSelect').value;
    const teamName = document.getElementById('modalLeagueTeamName').value.trim() || 'Custom Squad';
    const teamTag = document.getElementById('modalLeagueTeamTag').value.trim() || 'TAG';

    if (window.leaguesEngine) {
      window.leaguesEngine.registerTeamForLeague(game, division, teamName, teamTag);
    }

    this.clPoints += 100;
    const clDisplay = document.getElementById('userCLPointsValue');
    if (clDisplay) clDisplay.textContent = `${this.clPoints.toLocaleString()} Points`;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    this.closeJoinLeagueModal();

    const gameSelect = document.getElementById('leagueGameSelect');
    if (gameSelect) gameSelect.value = game;
    this.switchLeagueDivision(division);

    alert(`🎉 LEAGUE TEAM REGISTERED!\n\nTeam "${teamName} [${teamTag.toUpperCase()}]" registered into the ${game} Official League!\n\nEarned +100 🪙 CL-Points into your wallet!`);
  }

  // WARDOGS Tactical Arena & Mercenary League Implementation
  renderWardogsView() {
    const gameSelect = document.getElementById('wardogsGameSelect');
    const selectedGame = gameSelect ? gameSelect.value : 'Counter-Strike 2';
    const container = document.getElementById('wardogsMainContent');
    if (!container) return;

    if (!this.activeWardogsMode) this.activeWardogsMode = 'solos';

    if (!window.wardogsEngine) return;

    // Render Scraped Live Telemetry Stats
    const telemetry = window.wardogsEngine.scrapeLiveWardogsTelemetry();
    const telemetryElem = document.getElementById('wardogsTelemetryContainer');
    if (telemetryElem) {
      telemetryElem.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-weight: 900; color: #ffab00; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
              <span class="live-dot" style="display: inline-block; width: 10px; height: 10px; background: #00e676; border-radius: 50%; box-shadow: 0 0 10px #00e676;"></span>
              <span>LIVE WARDOGS TELEMETRY & STEAM STATS</span>
              <span class="lobby-game-tag" style="background: rgba(255, 111, 0, 0.2); color: #ffab00; border: 1px solid #ff6f00;">${telemetry.developer}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
              Official Early Access Data • ${telemetry.releaseDate} • ${telemetry.activeMatchFormat}
            </div>
          </div>
          <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; text-align: center;">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Active Concurrent</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: var(--accent-green);">${telemetry.activeConcurrentPlayers.toLocaleString()} 🟢</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Steam Peak</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: var(--accent-cyan);">${telemetry.peakConcurrentPlayers.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Twitch Viewers</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: #b9a3e3;">💜 ${telemetry.twitchConcurrentViewers.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Steam Rating</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: var(--accent-gold);">${telemetry.steamApprovalRating}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Persistent Economy</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: #ff6f00;">${telemetry.persistentEconomyBalance}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Gather all teams (System Mock + User Created)
    const systemSquads = window.wardogsEngine.registeredSquads.filter(s => s.game === selectedGame || s.game === 'WARDOGS');
    const userTeams = this.myCreatedTeams.filter(t => t.game === selectedGame || t.game === 'WARDOGS');
    const allTeams = [...userTeams, ...systemSquads];

    // Gather free agents
    const solos = window.wardogsEngine.soloMercenaries.filter(m => m.game === selectedGame || m.game === 'WARDOGS');

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; align-items: start;">
        
        <!-- TEAMS COLUMN -->
        <div>
          <h2 style="color: #ffab00; font-size: 1.3rem; margin-bottom: 1rem; font-weight: 900; text-transform: uppercase;">🛡️ Registered Teams & Rosters</h2>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${allTeams.map(t => {
              // Extract members array if it exists (user teams), otherwise generate mock members for system squads
              let membersHtml = '';
              if (t.members && Array.isArray(t.members)) {
                membersHtml = t.members.map(m => `
                  <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.85rem; margin-bottom: 0.25rem;">
                    <span><strong style="color: #fff;">${m.name}</strong> <span style="color: var(--text-muted); font-size: 0.75rem;">(${m.role || 'Operative'})</span></span>
                    <span style="color: var(--accent-purple); font-weight: 800;">${m.elo || 1800} MMR</span>
                  </div>
                `).join('');
              } else {
                // Mock system squad members based on captain
                membersHtml = `
                  <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.85rem; margin-bottom: 0.25rem;">
                    <span><strong style="color: #fff;">${t.captain || 'Ghost_Dog_99'}</strong> <span style="color: var(--text-muted); font-size: 0.75rem;">(Captain)</span></span>
                    <span style="color: var(--accent-purple); font-weight: 800;">2400 MMR</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.2rem 0.4rem;">
                    + ${(t.membersCount || 50) - 1} Other Enlisted Operatives...
                  </div>
                `;
              }

              return `
                <div class="card" style="border-color: rgba(255, 111, 0, 0.5); background: rgba(0,0,0,0.4);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div>
                      <h3 style="font-size: 1.2rem; font-weight: 900; margin: 0; color: #fff;">${t.name} <span style="color: var(--accent-gold); font-size: 0.85rem;">${t.tag || ''}</span></h3>
                      <div style="font-size: 0.78rem; color: var(--accent-cyan); font-weight: 700; margin-top: 0.2rem;">Allegiance: ${t.faction || '🔵 Vanguard Command'}</div>
                    </div>
                    <span class="lobby-game-tag" style="background: rgba(0, 229, 255, 0.15); color: var(--accent-cyan);">Team Roster</span>
                  </div>
                  <div style="margin-top: 0.8rem;">
                    ${membersHtml}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- FREE AGENTS COLUMN -->
        <div>
          <h2 style="color: var(--accent-cyan); font-size: 1.3rem; margin-bottom: 1rem; font-weight: 900; text-transform: uppercase;">🐕 Free Agent Pool</h2>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            ${solos.map(m => {
              const rolePreset = window.wardogsEngine.rolePresets ? (window.wardogsEngine.rolePresets[m.role] || window.wardogsEngine.rolePresets['⚡ Breacher / Assault']) : { primary: 'Standard Rifle', gadget: 'Frag Grenade' };
              return `
              <div class="card" style="border-left: 3px solid var(--accent-cyan); padding: 0.8rem; background: rgba(0,0,0,0.4);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <strong style="color: #fff; font-size: 1.05rem;">${m.name}</strong>
                  <span style="font-size: 0.7rem; color: var(--accent-gold);">${m.callsign}</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                  Role: <span style="color: #fff;">${m.role}</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.6rem;">
                  Loadout: <span style="color: var(--accent-cyan);">${rolePreset.primary}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 0.3rem 0.5rem; border-radius: 4px;">
                  <strong style="color: var(--accent-purple); font-size: 0.8rem;">${m.elo} MMR</strong>
                  <button class="btn btn-purple btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.app.recruitPlayerToTeam('${m.id}', '${m.name}', '${m.callsign}')">➕ Recruit</button>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }

  challengeWardogsSquad(squadName) {
    if (!window.wardogsEngine) return;
    const fixture = window.wardogsEngine.challengeSquadUnit(squadName);
    this.renderWardogsView();
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }
    alert(`⚔️ COMPETITIVE SCRIM DISPATCHED!\n\nOfficial Scrim fixture scheduled against "${squadName}"!\nAdded to WARDOGS Operations Calendar.`);
  }

  triggerTacticalStrike(strikeType) {
    if (!window.wardogsEngine) return;
    const msg = window.wardogsEngine.triggerTacticalStrike(strikeType);
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }
    alert(msg);
  }

  claimWardogsBounty(bountyId) {
    if (!window.wardogsEngine) return;
    const b = window.wardogsEngine.claimBounty(bountyId);
    if (b) {
      this.clPoints += 250;
      const clDisplay = document.getElementById('userCLPointsValue');
      if (clDisplay) clDisplay.textContent = `${this.clPoints.toLocaleString()} Points`;

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
      }

      this.renderWardogsView();
      alert(`🎉 BOUNTY CLAIMED!\n\nCompleted objective: "${b.title}"!\n\nEarned +250 🪙 CL-Points!`);
    }
  }

  switchWardogsMode(mode) {
    this.activeWardogsMode = mode;

    const btns = document.querySelectorAll('.wardogs-tab-btn');
    btns.forEach(b => {
      if (b.getAttribute('data-mode') === mode) {
        b.classList.remove('btn-secondary');
        b.classList.add('btn-purple', 'active');
      } else {
        b.classList.remove('btn-purple', 'active');
        b.classList.add('btn-secondary');
      }
    });

    this.renderWardogsView();
  }

  openWardogsSoloModal() {
    const modal = document.getElementById('wardogsJoinSoloModal');
    if (modal) modal.classList.add('active');
  }

  closeWardogsSoloModal() {
    const modal = document.getElementById('wardogsJoinSoloModal');
    if (modal) modal.classList.remove('active');
  }

  submitWardogsSolo() {
    const handle = document.getElementById('modalWardogsHandle').value.trim() || 'Ghost_Dog_99';
    const callsign = document.getElementById('modalWardogsCallsign').value.trim() || 'VIPER-1';
    const game = document.getElementById('modalWardogsGame').value;
    const role = document.getElementById('modalWardogsRole').value;
    const bio = document.getElementById('modalWardogsBio') ? document.getElementById('modalWardogsBio').value.trim() : '';

    if (window.wardogsEngine) {
      window.wardogsEngine.registerSoloMercenary(handle, callsign, game, role, 2150);
    }

    this.clPoints += 100;
    const clDisplay = document.getElementById('userCLPointsValue');
    if (clDisplay) clDisplay.textContent = `${this.clPoints.toLocaleString()} Points`;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    this.closeWardogsSoloModal();

    const gameSelect = document.getElementById('wardogsGameSelect');
    if (gameSelect) gameSelect.value = game;
    this.switchWardogsMode('solos');

    alert(`🎉 MERCENARY ENLISTED!\n\nOperative ${handle} (${callsign}) registered into WARDOGS Mercenary Pool for ${game}!\nYour Pitch: ${bio ? bio : 'No pitch provided.'}\n\nYou are now in the Draft Queue. Earned +100 🪙 CL-Points!`);
  }

  openWardogsTeamModal() {
    const modal = document.getElementById('wardogsJoinTeamModal');
    if (modal) modal.classList.add('active');
  }

  closeWardogsTeamModal() {
    const modal = document.getElementById('wardogsJoinTeamModal');
    if (modal) modal.classList.remove('active');
  }

  toggleMobileNavDrawer(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    if (drawer && backdrop) {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        backdrop.classList.remove('active');
      } else {
        drawer.classList.add('open');
        backdrop.classList.add('active');
      }
    }
  }

  openMatchTelemetryModal(lobbyId) {
    const modal = document.getElementById('matchTelemetryModal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.classList.add('active');

    const lobby = (this.lobbies || []).find(l => l.id === lobbyId) || {
      title: 'CS2 128-Tick Premier Scrim #104',
      game: 'Counter-Strike 2',
      map: 'de_inferno',
      region: 'NA-East (Virginia Dedicated Node)',
      team1: ['S1mple_Pro', 'ZywOo_Clutch', 'Niko_CS', 'Dev1ce_AWP', 'B1t_Headshot'],
      team2: ['Ropz_Lurk', 'Shroud_God', 'Tarik_King', 'TenZ_Aim', 'Hiko_Inhuman']
    };

    const modalTitle = document.getElementById('telemetryModalTitle');
    const modalSubtitle = document.getElementById('telemetryModalSubtitle');
    if (modalTitle) modalTitle.textContent = `📊 Telemetry: ${lobby.title || '128-Tick Competitive Node'}`;
    if (modalSubtitle) modalSubtitle.textContent = `Live server metrics • Map: ${lobby.map || 'de_dust2'} • Region: ${lobby.region || 'NA-East'}`;

    const tickrateEl = document.getElementById('telemTickrate');
    const pingEl = document.getElementById('telemPing');
    const scoreEl = document.getElementById('telemScore');
    const roundEl = document.getElementById('telemRound');
    const tableBody = document.getElementById('telemKdaTableBody');

    if (tickrateEl) tickrateEl.textContent = `${(127.8 + Math.random() * 0.4).toFixed(1)} Hz`;
    if (pingEl) pingEl.textContent = `${Math.floor(12 + Math.random() * 6)} ms`;
    if (scoreEl) scoreEl.textContent = `${7 + Math.floor(Math.random() * 4)} - ${5 + Math.floor(Math.random() * 4)}`;
    if (roundEl) roundEl.textContent = `Round ${12 + Math.floor(Math.random() * 5)} / 24`;

    if (tableBody) {
      const team1 = lobby.team1 || ['Player_1', 'Player_2', 'Player_3', 'Player_4', 'Player_5'];
      const team2 = lobby.team2 || ['Rival_1', 'Rival_2', 'Rival_3', 'Rival_4', 'Rival_5'];

      let rowsHtml = '';
      team1.forEach((p, idx) => {
        const k = 14 - idx * 2 + Math.floor(Math.random() * 3);
        const d = 6 + idx + Math.floor(Math.random() * 2);
        const a = 3 + Math.floor(Math.random() * 4);
        const adr = Math.floor(110 - idx * 12 + Math.random() * 15);
        const ping = Math.floor(10 + Math.random() * 12);
        const pName = typeof p === 'string' ? p : (p.name || `Player_${idx+1}`);

        rowsHtml += `
          <tr class="telem-kda-row" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 0.4rem 0.6rem; font-weight: 700; color: #00f2fe;">${pName}</td>
            <td style="padding: 0.4rem 0.6rem; color: #00e676; font-size: 0.75rem;">Team Alpha</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; font-weight: 800; color: #ffd700;">${k}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; color: #ff5252;">${d}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; color: #aaa;">${a}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; font-weight: 700; color: #fff;">${adr}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: right; color: #00e676;">${ping}ms</td>
          </tr>
        `;
      });

      team2.forEach((p, idx) => {
        const k = 12 - idx * 2 + Math.floor(Math.random() * 3);
        const d = 7 + idx + Math.floor(Math.random() * 2);
        const a = 2 + Math.floor(Math.random() * 4);
        const adr = Math.floor(95 - idx * 10 + Math.random() * 12);
        const ping = Math.floor(12 + Math.random() * 14);
        const pName = typeof p === 'string' ? p : (p.name || `Rival_${idx+1}`);

        rowsHtml += `
          <tr class="telem-kda-row" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 0.4rem 0.6rem; font-weight: 700; color: #ff007f;">${pName}</td>
            <td style="padding: 0.4rem 0.6rem; color: #ff007f; font-size: 0.75rem;">Team Bravo</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; font-weight: 800; color: #ffd700;">${k}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; color: #ff5252;">${d}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; color: #aaa;">${a}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: center; font-weight: 700; color: #fff;">${adr}</td>
            <td style="padding: 0.4rem 0.6rem; text-align: right; color: #00e676;">${ping}ms</td>
          </tr>
        `;
      });

      tableBody.innerHTML = rowsHtml;
    }
  }

  closeMatchTelemetryModal() {
    const modal = document.getElementById('matchTelemetryModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  launchHelixServerDirect() {
    this.launchServerProtocol({
      serverIp: '127.0.0.1:7777',
      game: 'Helix Game',
      title: 'Pacifica Helix Dedicated Server (Local)',
      map: 'Pacifica World'
    });
  }

  // Unified Dedicated Server Launch & Protocol Dispatch Engine
  launchServerProtocol(options = {}) {
    const defaultGame = this.currentDraftGame || 'Counter-Strike 2';
    const game = options.game || defaultGame;
    const serverIp = options.serverIp || (game === 'Helix Game' || game === 'Pacifica' ? '127.0.0.1:7777' : (options.matchCode && options.matchCode.includes('.') ? options.matchCode : '192.168.1.85:27015'));
    const password = options.password || (options.serverIp && options.serverIp.includes('7777') ? 'helix_comp_scrim' : '');
    const title = options.title || `${game} Dedicated Match Node`;
    const map = options.map || this.selectedMatchMap || 'Competitive';
    const matchCode = options.matchCode || null;

    // Build canonical protocol URL
    let protocolUrl = options.protocolUrl || null;
    if (!protocolUrl) {
      if (matchCode && !matchCode.includes('.')) {
        protocolUrl = `steam://run/730`;
      } else {
        protocolUrl = `steam://connect/${serverIp}`;
      }
    }

    // Direct in-game console command
    const consoleCmd = (matchCode && !matchCode.includes('.')) 
      ? matchCode 
      : (password ? `connect ${serverIp}; password ${password}` : `connect ${serverIp}`);

    // Auto-copy console command to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(consoleCmd).catch(() => {});
      }
    } catch(e) {}

    // Audio effect
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('match_found');
    }

    // Cache current launch details for HUD modal controls
    this.currentActiveServerLaunch = {
      serverIp,
      game,
      title,
      map,
      password,
      matchCode,
      protocolUrl,
      consoleCmd
    };

    // 1. Electron IPC dispatch (native desktop app)
    let dispatchedViaElectron = false;
    try {
      if (typeof window.require === 'function') {
        const electron = window.require('electron');
        if (electron && electron.ipcRenderer) {
          electron.ipcRenderer.send('launch-server-protocol', { url: protocolUrl, serverIp, game });
          dispatchedViaElectron = true;
          console.log('[ServerLaunch] Dispatched protocol via Electron IPC:', protocolUrl);
        }
      }
    } catch(e) {}

    // 2. HTTP Server API bridge dispatch (for browser clients connected to main-desktop.js on port 3300)
    if (!dispatchedViaElectron) {
      fetch('/api/launch-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: protocolUrl })
      }).then(res => res.json()).then(data => {
        if (data && data.success) {
          console.log('[ServerLaunch] Dispatched via local server API bridge:', protocolUrl);
        }
      }).catch(() => {
        // 3. Fallback for standard browsers: use hidden iframe so current page does not unload or error
        try {
          let iframe = document.getElementById('protocolDispatchFrame');
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'protocolDispatchFrame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
          }
          iframe.src = protocolUrl;
        } catch(err) {
          console.warn('[ServerLaunch] Iframe protocol dispatch fallback caught:', err);
        }
      });
    }

    // 4. Update and display Server Launch HUD Modal
    this.openServerLaunchModal({
      game,
      title,
      serverIp,
      map,
      consoleCmd,
      protocolUrl
    });

    if (typeof this.showToast === 'function') {
      this.showToast(`🚀 Server Launching! Connect command copied: ${consoleCmd}`, 'success');
    }
  }

  openServerLaunchModal(details = {}) {
    const modal = document.getElementById('serverLaunchModal');
    if (!modal) return;

    const gameName = details.game || 'Counter-Strike 2';
    const serverIp = details.serverIp || '192.168.1.85:27015';
    const mapName = details.map || 'Competitive';
    const consoleCmd = details.consoleCmd || `connect ${serverIp}`;

    const iconEl = document.getElementById('srvLaunchGameIcon');
    if (iconEl) {
      if (gameName.includes('CS') || gameName.includes('Counter')) iconEl.textContent = '🎯';
      else if (gameName.includes('WARDOGS')) iconEl.textContent = '🐕';
      else if (gameName.includes('Slapshot')) iconEl.textContent = '🏒';
      else if (gameName.includes('Helix') || gameName.includes('Pacifica')) iconEl.textContent = '🌀';
      else iconEl.textContent = '🚀';
    }

    const titleEl = document.getElementById('srvLaunchTitle');
    if (titleEl) titleEl.textContent = `${gameName} Live Server`;

    const subEl = document.getElementById('srvLaunchSubtitle');
    if (subEl) subEl.textContent = `${details.title || gameName} • Dedicated 128-Tick Node`;

    const gameEl = document.getElementById('srvLaunchGameName');
    if (gameEl) gameEl.textContent = gameName;

    const ipEl = document.getElementById('srvLaunchIpPort');
    if (ipEl) ipEl.textContent = serverIp;

    const mapEl = document.getElementById('srvLaunchMapName');
    if (mapEl) mapEl.textContent = mapName;

    const cmdInput = document.getElementById('srvConsoleCmdInput');
    if (cmdInput) cmdInput.value = consoleCmd;

    const copyNotice = document.getElementById('srvCopyNotice');
    if (copyNotice) copyNotice.textContent = 'Copied to Clipboard!';

    const btnLocal = document.getElementById('btnLocalServerToggle');
    if (btnLocal) {
      btnLocal.innerHTML = (serverIp.includes('127.0.0.1') || this.isLocalServerActive) 
        ? (this.isLocalServerActive ? '<span>🔴</span> Stop Local Server' : '<span>🖥️</span> Start Local Server Node')
        : '<span>🖥️</span> Host Local Node (127.0.0.1)';
    }

    modal.style.display = 'flex';
    modal.classList.add('active');
  }

  closeServerLaunchModal() {
    const modal = document.getElementById('serverLaunchModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  copyServerConsoleCmd() {
    const cmdInput = document.getElementById('srvConsoleCmdInput');
    if (cmdInput) {
      try {
        navigator.clipboard.writeText(cmdInput.value);
        const copyNotice = document.getElementById('srvCopyNotice');
        if (copyNotice) {
          copyNotice.textContent = '✔ Copied to Clipboard!';
          setTimeout(() => { if (copyNotice) copyNotice.textContent = 'Copied to Clipboard!'; }, 2000);
        }
        if (typeof this.showToast === 'function') {
          this.showToast('📋 Console command copied to clipboard!', 'success');
        }
      } catch(e) {}
    }
  }

  triggerCurrentServerProtocol() {
    if (this.currentActiveServerLaunch && this.currentActiveServerLaunch.protocolUrl) {
      const url = this.currentActiveServerLaunch.protocolUrl;
      try {
        if (typeof window.require === 'function') {
          const electron = window.require('electron');
          if (electron && electron.ipcRenderer) {
            electron.ipcRenderer.send('launch-server-protocol', { url });
            return;
          }
        }
      } catch(e) {}

      fetch('/api/launch-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      }).catch(() => {
        let iframe = document.getElementById('protocolDispatchFrame');
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.id = 'protocolDispatchFrame';
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
        }
        iframe.src = url;
      });

      if (typeof this.showToast === 'function') {
        this.showToast(`🚀 Steam protocol re-dispatched: ${url}`, 'info');
      }
    }
  }

  toggleLocalDedicatedServerNode() {
    if (this.isLocalServerActive) {
      this.stopLocalDedicatedServer();
    } else {
      this.startLocalDedicatedServer();
    }
  }

  startLocalDedicatedServer() {
    const btn = document.getElementById('btnLocalServerToggle');
    if (btn) btn.innerHTML = '<span>⏳</span> Starting Node...';

    let triedIPC = false;
    try {
      if (typeof window.require === 'function') {
        const electron = window.require('electron');
        if (electron && electron.ipcRenderer) {
          electron.ipcRenderer.send('start-local-dedicated-server');
          triedIPC = true;
        }
      }
    } catch(e) {}

    if (!triedIPC) {
      fetch('/api/start-server', { method: 'POST' })
        .then(r => r.json())
        .then(res => this.handleLocalServerResponse(res))
        .catch(() => {
          this.handleLocalServerResponse({ success: true, running: true, message: 'Dedicated Server running simulated on 127.0.0.1:7777' });
        });
    }
  }

  stopLocalDedicatedServer() {
    const btn = document.getElementById('btnLocalServerToggle');
    if (btn) btn.innerHTML = '<span>⏳</span> Halting Node...';

    let triedIPC = false;
    try {
      if (typeof window.require === 'function') {
        const electron = window.require('electron');
        if (electron && electron.ipcRenderer) {
          electron.ipcRenderer.send('stop-local-dedicated-server');
          triedIPC = true;
        }
      }
    } catch(e) {}

    if (!triedIPC) {
      fetch('/api/stop-server', { method: 'POST' })
        .then(r => r.json())
        .then(res => this.handleLocalServerResponse(res))
        .catch(() => {
          this.handleLocalServerResponse({ success: true, running: false, message: 'Local dedicated server stopped.' });
        });
    }
  }

  handleLocalServerResponse(res) {
    this.isLocalServerActive = res && res.running;
    const btn = document.getElementById('btnLocalServerToggle');
    if (btn) {
      btn.innerHTML = this.isLocalServerActive 
        ? '<span>🔴</span> Stop Local Server' 
        : '<span>🖥️</span> Start Local Server Node';
    }
    if (typeof this.showToast === 'function') {
      this.showToast(res.message || (this.isLocalServerActive ? '🟢 Dedicated Server Node Online (127.0.0.1:7777)' : '🔴 Dedicated Server Node Stopped'), this.isLocalServerActive ? 'success' : 'info');
    }
  }

  launchWardogsServerMatch() {
    const modal = document.getElementById('wardogsRankedDraftModal');
    if (modal) modal.classList.remove('active');

    const serverIp = '192.168.1.99:27015';
    this.launchServerProtocol({
      serverIp: serverIp,
      game: 'WARDOGS',
      title: 'WARDOGS 33v33v33 Ranked Match (99 Players)',
      map: 'Sector 33 - Quantum Citadel',
      password: 'wardogs_tri_conquest'
    });
  }

  // 1. PLAY TONIGHT BOARD HANDLERS
  openPlayTonightModal() {
    const modal = document.getElementById('playTonightBoardModal');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
    this.renderPlayTonightListings();
  }

  closePlayTonightModal() {
    const modal = document.getElementById('playTonightBoardModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  renderPlayTonightListings() {
    const container = document.getElementById('playTonightListingsContainer');
    if (!container || !window.leaguesEngine) return;

    const posts = window.leaguesEngine.playTonightPosts || [];
    container.innerHTML = posts.map(p => `
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(0,242,254,0.2); padding: 0.75rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 0.8rem;">
        <div>
          <div style="font-size: 0.88rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
            <span>${p.gameIcon || '🎮'}</span> <span>${p.game}</span>
            <span style="font-size: 0.7rem; color: var(--accent-cyan); font-weight: normal;">• ${p.timeSlot} (${p.region})</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${p.note}</div>
          <div style="font-size: 0.7rem; color: #00e676; margin-top: 0.2rem;">Roster: ${p.participants.join(', ')}</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 800; display: block; margin-bottom: 0.3rem;">${p.openSlots} / ${p.totalSlots} Slots Open</span>
          <button class="btn btn-primary btn-xs" onclick="window.app.joinPlayTonightPost('${p.id}')" ${p.openSlots === 0 ? 'disabled' : ''}>
            ${p.openSlots === 0 ? 'Full' : '⚡ Express Join'}
          </button>
        </div>
      </div>
    `).join('');
  }

  submitPlayTonightPost() {
    const game = document.getElementById('ptGameSelect').value;
    const timeSlot = document.getElementById('ptTimeInput').value.trim() || 'Tonight 20:00 EST';
    const region = document.getElementById('ptRegionSelect').value;
    const slots = document.getElementById('ptSlotsSelect').value;
    const note = document.getElementById('ptNoteInput').value.trim() || 'Looking for squad mates tonight!';

    if (window.leaguesEngine) {
      window.leaguesEngine.createPlayTonightPost({
        host: 'RadiantReaper',
        game,
        timeSlot,
        region,
        totalSlots: slots,
        note
      });
    }

    if (typeof this.showToast === 'function') {
      this.showToast('🎉 Availability Posted to "Play Tonight" Board!', 'success');
    }
    this.renderPlayTonightListings();
  }

  joinPlayTonightPost(postId) {
    if (window.leaguesEngine) {
      const updated = window.leaguesEngine.joinPlayTonightSpot(postId, 'RadiantReaper');
      if (updated) {
        if (typeof this.showToast === 'function') {
          this.showToast(`✅ Joined ${updated.game} Squad!`, 'success');
        }
        this.renderPlayTonightListings();
      }
    }
  }

  // 2. READY CHECK & SUBSTITUTE BEACON HANDLERS
  triggerReadyCheckModal() {
    const modal = document.getElementById('matchReadyCheckModal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.classList.add('active');

    let timeLeft = 15.0;
    const countdownEl = document.getElementById('readyCheckCountdown');
    const beaconEl = document.getElementById('substituteBeaconStatus');

    if (window.readyCheckTimer) clearInterval(window.readyCheckTimer);

    window.readyCheckTimer = setInterval(() => {
      timeLeft -= 0.1;
      if (countdownEl) countdownEl.textContent = `${Math.max(0, timeLeft).toFixed(1)}s`;

      if (timeLeft <= 0) {
        clearInterval(window.readyCheckTimer);
        if (beaconEl) beaconEl.innerHTML = '🚨 <strong style="color:#ff5252;">SUB BEACON ACTIVE:</strong> Player dropped! Dispatching substitute from queue...';
        if (typeof this.showToast === 'function') {
          this.showToast('📢 Substitute Beacon Dispatched! Finding replacement player...', 'warning');
        }
      }
    }, 100);
  }

  acceptReadyCheck() {
    if (window.readyCheckTimer) clearInterval(window.readyCheckTimer);
    const modal = document.getElementById('matchReadyCheckModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
    if (typeof this.showToast === 'function') {
      this.showToast('✅ Match Accepted! Server Node Allocated.', 'success');
    }
  }

  declineReadyCheck() {
    if (window.readyCheckTimer) clearInterval(window.readyCheckTimer);
    const modal = document.getElementById('matchReadyCheckModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
    if (typeof this.showToast === 'function') {
      this.showToast('❌ Match Declined. Returned to queue.', 'warning');
    }
  }

  // 3. CUSTOM RULES PRESETS HANDLERS
  openRulesPresetModal() {
    const modal = document.getElementById('rulesPresetModal');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
    this.renderPresetCards();
  }

  closeRulesPresetModal() {
    const modal = document.getElementById('rulesPresetModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  renderPresetCards() {
    const container = document.getElementById('presetGridContainer');
    if (!container || !window.leaguesEngine) return;

    const presets = window.leaguesEngine.rulesPresets || [];
    container.innerHTML = presets.map(p => `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(157, 78, 221, 0.3); padding: 0.8rem; border-radius: 8px;">
        <div style="font-size: 0.88rem; font-weight: 800; color: #fff;">${p.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin: 0.3rem 0;">${p.description}</div>
        <div style="font-size: 0.7rem; color: var(--accent-cyan); margin-bottom: 0.6rem;">${p.game} • ${p.map}</div>
        <button class="btn btn-purple btn-xs" onclick="window.app.applyPresetToLobby('${p.id}')">
          ⚡ Apply Preset
        </button>
      </div>
    `).join('');
  }

  saveNewLobbyPreset() {
    const name = document.getElementById('newPresetName').value.trim();
    if (!name) return;

    if (window.leaguesEngine) {
      window.leaguesEngine.saveRulesPreset({
        name,
        description: 'Custom saved user ruleset',
        game: 'Counter-Strike 2',
        map: 'de_inferno',
        draftType: 'Competitive 5v5',
        maxSlots: 10
      });
    }

    document.getElementById('newPresetName').value = '';
    if (typeof this.showToast === 'function') {
      this.showToast('💾 Custom Rules Preset Saved!', 'success');
    }
    this.renderPresetCards();
  }

  applyPresetToLobby(presetId) {
    this.closeRulesPresetModal();
    if (typeof this.showToast === 'function') {
      this.showToast(`⚡ Preset Applied to Host Lobby Settings!`, 'success');
    }
  }

  // 4. PLAYER RELIABILITY HANDLERS
  openReliabilityModal(userHandle = 'DEFAULT_USER') {
    const modal = document.getElementById('reliabilityProfileModal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.classList.add('active');

    if (window.leaguesEngine) {
      const p = window.leaguesEngine.getReliabilityProfile(userHandle);
      const title = document.getElementById('relUserTitle');
      const rate = document.getElementById('relRate');
      const count = document.getElementById('relCount');
      const badge = document.getElementById('relBadge');
      const noShows = document.getElementById('relNoShows');

      if (title) title.textContent = `Reliability Rating: ${userHandle}`;
      if (rate) rate.textContent = p.completionRate;
      if (count) count.textContent = `${p.completedMatches} Matches`;
      if (badge) badge.textContent = p.trustBadge;
      if (noShows) noShows.textContent = `${p.noShows} No-Shows`;
    }
  }

  closeReliabilityModal() {
    const modal = document.getElementById('reliabilityProfileModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  submitDisputeAppeal() {
    if (typeof this.showToast === 'function') {
      this.showToast('⚠️ No-Show Report Appeal Submitted to Platform Moderation.', 'info');
    }
  }

  // 5. MATCH DISPUTES HANDLERS
  openDisputeModal() {
    const modal = document.getElementById('matchDisputeModal');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
  }

  closeDisputeModal() {
    const modal = document.getElementById('matchDisputeModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  submitScoreConfirmation() {
    const scoreA = document.getElementById('disputeScoreA').value;
    const scoreB = document.getElementById('disputeScoreB').value;

    if (window.leaguesEngine) {
      const res = window.leaguesEngine.recordMatchResult('lobby_99', 'Captain Alpha', scoreA, 'Captain Bravo', scoreB);
      if (res.status === 'CONFIRMED') {
        if (typeof this.showToast === 'function') {
          this.showToast(`✅ Match Score Confirmed: ${res.score}! ELO Ratings updated.`, 'success');
        }
      } else {
        if (typeof this.showToast === 'function') {
          this.showToast(`⚠️ Score Discrepancy (${scoreA} vs ${scoreB})! Dispute ticket opened.`, 'warning');
        }
      }
    }
    this.closeDisputeModal();
  }

  // 6. SQUAD RIVALRIES HANDLERS
  openRivalryModal(squadA = 'Valkyrie Esports', squadB = 'Cyber Titans') {
    const modal = document.getElementById('rivalryStatsModal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.classList.add('active');

    if (window.leaguesEngine) {
      const r = window.leaguesEngine.getRivalryRecord(squadA, squadB);
      const title = document.getElementById('rivalryModalTitle');
      const elA = document.getElementById('rivalSquadA');
      const elB = document.getElementById('rivalSquadB');
      const winsA = document.getElementById('rivalWinsA');
      const winsB = document.getElementById('rivalWinsB');
      const lastText = document.getElementById('rivalLastMatchText');

      if (title) title.textContent = `Squad Rivalry: ${squadA} vs ${squadB}`;
      if (elA) elA.textContent = squadA;
      if (elB) elB.textContent = squadB;
      if (winsA) winsA.textContent = r.winsA;
      if (winsB) winsB.textContent = r.winsB;
      if (lastText) lastText.textContent = `Last Match: ${r.lastMatch}`;
    }
  }

  closeRivalryModal() {
    const modal = document.getElementById('rivalryStatsModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  challengeRivalRematch() {
    this.closeRivalryModal();
    if (typeof this.showToast === 'function') {
      this.showToast('⚔️ REMATCH CHALLENGE DISPATCHED! Waiting for rival captain to accept...', 'success');
    }
  }


  submitWardogsTeam() {
    const squadName = document.getElementById('modalWardogsTeamName').value.trim() || 'WARDOG Alpha';
    const tag = document.getElementById('modalWardogsTeamTag').value.trim() || 'WD-ALPHA';
    const captain = document.getElementById('modalWardogsCaptain').value.trim() || 'Ghost_Dog_99';
    const game = document.getElementById('modalWardogsTeamGame').value;
    const size = document.getElementById('modalWardogsTeamSize').value;
    const bio = document.getElementById('modalWardogsTeamBio') ? document.getElementById('modalWardogsTeamBio').value.trim() : '';

    const newTeam = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: squadName,
      tag: tag.startsWith('[') ? tag.toUpperCase() : `[${tag.toUpperCase()}]`,
      emblem: '🛡️',
      focus: 'Ranked Ladder',
      synergy: '100% (Role-Balanced)',
      captain: captain,
      game: game,
      members: [
        { name: captain, role: 'Captain', elo: 2400 }
      ],
      applications: [],
      record: '0W - 0L',
      elo: 2400,
      kd: '0.0',
      bountyEarned: '0 CL-Points',
      createdDate: new Date().toLocaleDateString()
    };

    if (!this.myCreatedTeams) this.myCreatedTeams = [];
    this.myCreatedTeams.unshift(newTeam);
    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));

    if (window.wardogsEngine) {
      window.wardogsEngine.registerSquadUnit(squadName, tag, captain, game, size);
    }

    this.clPoints += 100;
    const clDisplay = document.getElementById('userCLPointsValue');
    if (clDisplay) clDisplay.textContent = `${this.clPoints.toLocaleString()} Points`;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    this.closeWardogsTeamModal();

    const gameSelect = document.getElementById('wardogsGameSelect');
    if (gameSelect) gameSelect.value = game;
    this.switchWardogsMode('squads');

    alert(`🛡️ TEAM REGISTERED!\n\n${squadName} [${tag}] is now active in the ${game} League.\nCaptain: ${captain}\nDescription: ${bio ? bio : 'No description provided.'}\n\nYou can now browse the Draft Queue and recruit members freely!`);

    if (this.clPoints >= 500) {
        const wantsServer = confirm(`Would you like to purchase a dedicated Community Hub Chat Server for your team '${squadName}' for 500 CL-Points?`);
        if (wantsServer) {
            this.clPoints -= 500;
            const clDisplay = document.getElementById('userCLPointsValue');
            if (clDisplay) clDisplay.textContent = `${this.clPoints.toLocaleString()} Points`;

            const key = squadName.toLowerCase().replace(/[^a-z0-9_]/g, '') + Date.now().toString().slice(-4);
            
            if (window.chatVoiceManager) {
                window.chatVoiceManager.guilds[key] = { name: squadName, icon: '🛡️' };
                localStorage.setItem('cl_admin_servers', JSON.stringify(window.chatVoiceManager.guilds));
                window.chatVoiceManager.renderGuildRail();
            }

            alert(`✅ PURCHASE SUCCESSFUL!\n\nYour dedicated team chat server '${squadName}' has been deployed to the Community Hub!`);
        }
    }
  }

  recruitPlayerToTeam(playerId, playerName, callsign) {
    if (typeof this.showToast === 'function') {
      this.showToast(`📥 Invite sent! You offered ${playerName} a spot on your team.`, 'success');
    }
    
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }
    
    if (!this.myCreatedTeams || this.myCreatedTeams.length === 0) {
      alert(`⚠️ NO TEAM FOUND!\n\nYou must Create a Team first before recruiting Free Agents!`);
      return;
    }

    const team = this.myCreatedTeams[0];
    if (!team.applications) team.applications = [];
    
    // Find player role
    let pRole = 'Flex';
    let pElo = 2150;
    if (window.wardogsEngine) {
        const player = window.wardogsEngine.soloMercenaries.find(p => p.id == playerId);
        if (player) {
            pRole = player.role || 'Flex';
            pElo = player.elo || 2150;
            player.status = 'Drafted to Team';
            this.renderWardogsView();
        }
    }

    team.applications.push({
      name: `${playerName} (${callsign})`,
      role: pRole,
      elo: pElo
    });

    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));
    
    alert(`📨 DRAFT POOL REQUEST SENT!\n\n${playerName} has been added to ${team.name}'s incoming recruitment requests for your review.`);
    
    this.openManageTeamModal(team.id);
  }

  openCreateTeamModal() {
    const modal = document.getElementById('createUniversalTeamModal');
    if (modal) modal.classList.add('active');
  }

  purchaseTeamServer() {
      if (this.clPoints < 500) {
          alert(`❌ INSUFFICIENT FUNDS\n\nYou need 500 CL-Points to purchase a dedicated Community Hub Server. You currently have ${this.clPoints}.`);
          return;
      }
      
      const serverName = prompt("Enter a name for your new Team Chat Server:");
      if (!serverName) return;
      
      const serverEmoji = prompt("Enter an emoji icon for your server (e.g., 🛡️, 🔥, 💀):") || '💬';
      
      const confirmPurchase = confirm(`Are you sure you want to purchase the server "${serverName}" for 500 CL-Points?`);
      if (confirmPurchase) {
          this.clPoints -= 500;
          
          const clDisplay = document.getElementById('userCLPointsValue');
          if (clDisplay) clDisplay.textContent = `${this.clPoints.toLocaleString()} Points`;

          const key = serverName.toLowerCase().replace(/[^a-z0-9_]/g, '') + Date.now().toString().slice(-4);
          
          if (window.chatVoiceManager) {
              window.chatVoiceManager.guilds[key] = { name: serverName, icon: serverEmoji };
              localStorage.setItem('cl_admin_servers', JSON.stringify(window.chatVoiceManager.guilds));
              window.chatVoiceManager.renderGuildRail();
          }

          if (window.widgetBuilderEngine) {
              window.widgetBuilderEngine.playSoundEffect('fanfare');
          }

          alert(`✅ SERVER PURCHASED!\n\nYour dedicated team chat server '${serverName}' has been deployed to the Community Hub!`);
          
          // Switch to community view to see it
          const tab = document.querySelector('[data-tab=community-view]');
          if (tab) tab.click();
      }
  }

  closeCreateTeamModal() {
    const modal = document.getElementById('createUniversalTeamModal');
    if (modal) modal.classList.remove('active');
  }

  renderEmblemHTML(emblem, size = '1.3rem', extraStyle = '') {
    if (!emblem) emblem = '🛡️';
    if (emblem.startsWith('http://') || emblem.startsWith('https://') || emblem.startsWith('data:image/') || emblem.startsWith('/') || emblem.includes('.png') || emblem.includes('.svg') || emblem.includes('.jpg') || emblem.includes('.webp')) {
      return `<img src="${emblem}" alt="Emblem" style="width: ${size}; height: ${size}; border-radius: 6px; object-fit: cover; vertical-align: middle; display: inline-block; border: 1px solid var(--accent-purple); box-shadow: 0 0 10px rgba(168,85,247,0.4); ${extraStyle}">`;
    }
    return `<span style="font-size: ${size}; vertical-align: middle; display: inline-block; line-height: 1; ${extraStyle}">${emblem}</span>`;
  }

  selectClanEmblem(emblem, btnEl) {
    this.selectedClanEmblem = emblem;
    const preview = document.getElementById('selectedTeamEmblemPreview');
    if (preview) preview.innerHTML = this.renderEmblemHTML(emblem, '2.2rem');

    const emojiInput = document.getElementById('customEmojiEmblemInput');
    if (emojiInput) emojiInput.value = '';
    const urlInput = document.getElementById('customEmblemUrlInput');
    if (urlInput) urlInput.value = '';

    const container = document.getElementById('emblemPickerContainer');
    if (container) {
      container.querySelectorAll('.emblem-option').forEach(b => {
        b.classList.remove('btn-purple', 'active');
        b.classList.add('btn-secondary');
      });
    }
    if (btnEl) {
      btnEl.classList.remove('btn-secondary');
      btnEl.classList.add('btn-purple', 'active');
    }
  }

  setCustomEmojiEmblem(emoji) {
    if (!emoji || !emoji.trim()) return;
    this.selectedClanEmblem = emoji.trim();
    const preview = document.getElementById('selectedTeamEmblemPreview');
    if (preview) preview.innerHTML = this.renderEmblemHTML(this.selectedClanEmblem, '2.2rem');

    const container = document.getElementById('emblemPickerContainer');
    if (container) {
      container.querySelectorAll('.emblem-option').forEach(b => {
        b.classList.remove('btn-purple', 'active');
        b.classList.add('btn-secondary');
      });
    }
  }

  setRandomEmojiEmblem() {
    const list = ['🔥', '🦁', '⭐', '💎', '🦾', '☣️', '🩸', '👾', '🚀', '🏆', '🥇', '⚡', '💀', '🦅', '🛡️', '⚔️', '🐺', '🐉', '👑', '🎯', '🐍', '🦈', '🦊', '👹', '🌌', '⚓', '🏎️', '🌪️', '🗡️', '🛸'];
    const chosen = list[Math.floor(Math.random() * list.length)];
    const input = document.getElementById('customEmojiEmblemInput');
    if (input) input.value = chosen;
    this.setCustomEmojiEmblem(chosen);
  }

  handleCustomEmblemUpload(fileInput) {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this.selectedClanEmblem = dataUrl;
      const preview = document.getElementById('selectedTeamEmblemPreview');
      if (preview) preview.innerHTML = this.renderEmblemHTML(dataUrl, '2.2rem');
      const urlInput = document.getElementById('customEmblemUrlInput');
      if (urlInput) urlInput.value = `[Uploaded Image: ${file.name}]`;
      const emojiInput = document.getElementById('customEmojiEmblemInput');
      if (emojiInput) emojiInput.value = '';

      const container = document.getElementById('emblemPickerContainer');
      if (container) {
        container.querySelectorAll('.emblem-option').forEach(b => {
          b.classList.remove('btn-purple', 'active');
          b.classList.add('btn-secondary');
        });
      }
    };
    reader.readAsDataURL(file);
  }

  setCustomEmblemUrl(url) {
    if (!url || !url.trim()) return;
    this.selectedClanEmblem = url.trim();
    const preview = document.getElementById('selectedTeamEmblemPreview');
    if (preview) preview.innerHTML = this.renderEmblemHTML(this.selectedClanEmblem, '2.2rem');
    const emojiInput = document.getElementById('customEmojiEmblemInput');
    if (emojiInput) emojiInput.value = '';

    const container = document.getElementById('emblemPickerContainer');
    if (container) {
      container.querySelectorAll('.emblem-option').forEach(b => {
        b.classList.remove('btn-purple', 'active');
        b.classList.add('btn-secondary');
      });
    }
  }

  autoRecruitFreeAgents() {
    const input = document.getElementById('modalTeamMembers');
    if (!input) return;

    const freeAgentPool = [
      'Ghost_Dog_99 (🎯 Entry)',
      'Sargeant_Iron (🛡️ Anchor)',
      'Valkyrie_Merc (🔭 AWPer)',
      'Shadow_K9 (⚡ Flex)',
      'Cyber_Ninja (🎯 Entry)',
      'Vortex_IGL (👑 Commander)',
      'Apex_Hunter (🔭 AWPer)',
      'Echo_Pulse (🛡️ Support)'
    ];

    const shuffled = freeAgentPool.sort(() => 0.5 - Math.random()).slice(0, 4);
    input.value = shuffled.join(', ');

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }
  }

  loadMyCreatedTeams() {
    try {
      const saved = localStorage.getItem('cl_user_custom_teams_v1');
      if (saved) {
        this.myCreatedTeams = JSON.parse(saved);
      } else {
        this.myCreatedTeams = [
          {
            id: 'TEAM-101',
            name: 'Vanguard Cyber Squad',
            tag: '[VANGUARD]',
            emblem: '🛡️',
            focus: 'Competitive Scrims',
            synergy: '100% (Role-Balanced)',
            captain: 'Sean',
            game: 'Counter-Strike 2',
            size: 5,
            members: ['Sean (👑 IGL)', 'Ghost_Dog_99 (🎯 Entry)', 'Sargeant_Iron (🛡️ Anchor)', 'Valkyrie_Merc (🔭 AWPer)', 'Shadow_K9 (⚡ Flex)'],
            record: '12W - 2L',
            elo: 2380,
            kd: '2.35',
            bountyEarned: '4,500 CL-Points',
            createdDate: 'Live Active'
          }
        ];
      }
    } catch (e) {
      this.myCreatedTeams = [];
    }
  }

  renderMyCreatedTeams() {
    const grid = document.getElementById('myCreatedTeamsGrid');
    if (!grid) return;

    if (!this.myCreatedTeams) this.loadMyCreatedTeams();

    if (!this.myCreatedTeams || this.myCreatedTeams.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center; color: var(--text-muted); border: 1px dashed var(--border-color);">
          🛡️ No custom teams created yet. Click "Create New Team" to build your 5v5 fireteam or WARDOG battalion!
        </div>
      `;
      return;
    }

    grid.innerHTML = this.myCreatedTeams.map(t => {
      const emblemHTML = this.renderEmblemHTML(t.emblem || '🛡️', '1.4rem');
      const synergy = t.synergy || '100% Synergy';

      return `
        <div class="card" style="border-color: var(--accent-purple); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                ${emblemHTML}
                <span class="lobby-game-tag" style="background: rgba(168, 85, 247, 0.2); color: #d8b4fe; font-weight: 900; border: 1px solid var(--accent-purple);">${t.tag}</span>
                <span class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan);">${t.game}</span>
              </div>
              <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 800;">${t.record || '0W - 0L'}</span>
            </div>

            <h3 style="font-size: 1.2rem; font-weight: 900; margin-bottom: 0.25rem; color: #fff;">${t.name}</h3>
            <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 800; margin-bottom: 0.6rem;">
              👑 Captain: ${t.captain} • <span style="color: var(--accent-green);">⚡ ${synergy}</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem; background: rgba(0,0,0,0.4); padding: 0.5rem; border-radius: 6px; font-size: 0.75rem; margin-bottom: 0.8rem; text-align: center;">
              <div><div style="color: var(--text-muted);">Team MMR</div><strong style="color: var(--accent-gold);">${t.elo || 2200} ELO</strong></div>
              <div><div style="color: var(--text-muted);">Team K/D</div><strong style="color: var(--accent-green);">${t.kd || '2.10'}</strong></div>
              <div><div style="color: var(--text-muted);">Earnings</div><strong style="color: #ffab00;">${t.bountyEarned || '1k CL-Points'}</strong></div>
            </div>

            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.8rem; max-height: 55px; overflow-y: auto; background: rgba(255,255,255,0.03); padding: 0.4rem; border-radius: 4px;">
              <strong style="color: var(--text-main);">Roster (${t.members ? t.members.length : 0}):</strong> ${t.members ? t.members.join(', ') : 'Active Roster'}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem;">
            <button class="btn btn-purple btn-sm" style="flex: 1; padding: 0.3rem 0.5rem; font-size: 0.78rem;" onclick="window.app.openManageTeamModal('${t.id}')">
              📋 Roster Hub
            </button>
            <button class="btn btn-cyan btn-sm" style="padding: 0.3rem 0.5rem; font-size: 0.78rem;" onclick="window.app.openTeamScrimModal('${t.id}')">
              ⚔️ Scrim
            </button>
            <button class="btn btn-danger btn-sm" style="padding: 0.3rem 0.45rem; font-size: 0.75rem;" onclick="window.app.disbandTeam('${t.id}')" title="Disband Team">
              ❌
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  submitCreateTeam() {
    const name = document.getElementById('modalTeamName').value.trim() || 'Vanguard Esports';
    const tagRaw = document.getElementById('modalTeamTag').value.trim() || 'VANGUARD';
    const tag = tagRaw.startsWith('[') ? tagRaw.toUpperCase() : `[${tagRaw.toUpperCase()}]`;
    const captain = document.getElementById('modalTeamCaptain').value.trim() || (this.user ? this.user.displayName : 'Sean');
    const focus = document.getElementById('modalTeamFocus') ? document.getElementById('modalTeamFocus').value : 'Competitive Scrims';
    const game = document.getElementById('modalTeamGame').value;
    const emblem = this.selectedClanEmblem || '🛡️';
    const membersRaw = document.getElementById('modalTeamMembers').value.trim();

    const rawList = membersRaw ? membersRaw.split(',').map(m => m.trim()).filter(Boolean) : ['Ghost_Dog_99', 'Sargeant_Iron', 'Valkyrie_Merc', 'Shadow_K9'];
    const members = [`${captain} (👑 Captain/IGL)`, ...rawList];

    const newTeam = {
      id: `TEAM-${Date.now().toString().slice(-4)}`,
      name,
      tag,
      emblem,
      focus,
      synergy: '100% (Role-Balanced)',
      captain,
      game,
      members,
      applications: [
        { name: 'Valkyrie_Merc', role: '🎯 Sniper', elo: 2150 },
        { name: 'Shadow_K9', role: '⚡ Entry Fragger', elo: 1980 }
      ],
      record: '0W - 0L',
      elo: Math.floor(2150 + Math.random() * 350),
      kd: '2.30',
      bountyEarned: '2,500 CL-Points',
      createdDate: new Date().toLocaleDateString()
    };

    if (!this.myCreatedTeams) this.myCreatedTeams = [];
    this.myCreatedTeams.unshift(newTeam);
    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));

    if (window.wardogsEngine) {
      window.wardogsEngine.registerSquadUnit(name, tag, captain, game);
    }
    if (window.leaguesEngine) {
      window.leaguesEngine.registerLeagueTeam(name, tag, captain, game, 'Premier Division');
    }

    this.clPoints += 150;
    this.updatePointsWidget();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    this.closeCreateTeamModal();
    this.renderMyCreatedTeams();

    alert(`🎉 TEAM CREATED SUCCESSFULLY!\n\n${name} ${tag} created for ${game}!\nCustom Emblem Saved & Team Chemistry Synergy Active (+150 🪙 CL-Points)!`);
  }

  openManageTeamModal(teamId) {
    if (!this.myCreatedTeams) this.loadMyCreatedTeams();
    const team = this.myCreatedTeams.find(t => t.id === teamId);
    if (!team) return;

    const modal = document.getElementById('manageTeamRosterModal');
    const emblemEl = document.getElementById('manageTeamEmblem');
    const title = document.getElementById('manageTeamTitle');
    const sub = document.getElementById('manageTeamSub');
    const body = document.getElementById('manageTeamBody');

    if (emblemEl) emblemEl.innerHTML = this.renderEmblemHTML(team.emblem || '🛡️', '2rem');
    if (title) title.textContent = `${team.name} ${team.tag}`;
    if (sub) sub.textContent = `${team.game} • ${team.focus || 'Competitive Scrims'} • ${team.members ? team.members.length : 0} Members`;

    if (body) {
      const roles = ['👑 IGL / Commander', '🎯 Entry Fragger', '🔭 Marksman / AWPer', '🛡️ Support / Anchor', '⚡ Flex Specialist'];
      const memberList = team.members || [
        { name: team.captain || 'Sean', role: 'Captain', elo: 2400 },
        { name: 'Ghost_Dog_99', role: 'Operative', elo: 2100 },
        { name: 'Sargeant_Iron', role: 'Operative', elo: 2150 }
      ];

      body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem; background: rgba(0,0,0,0.4); padding: 0.8rem; border-radius: 8px; margin-bottom: 1.25rem; text-align: center;">
          <div><div style="font-size: 0.75rem; color: var(--text-muted);">Team Rating</div><strong style="color: var(--accent-gold); font-size: 1.1rem;">${team.elo || 2350} ELO</strong></div>
          <div><div style="font-size: 0.75rem; color: var(--text-muted);">Chemistry Synergy</div><strong style="color: var(--accent-green); font-size: 1.1rem;">${team.synergy || '100%'}</strong></div>
          <div><div style="font-size: 0.75rem; color: var(--text-muted);">Bounty Earned</div><strong style="color: #ffab00; font-size: 1.1rem;">${team.bountyEarned || '4,500 CL-Points'}</strong></div>
        </div>

        <!-- Interactive Emblem Customizer for this Team -->
        <div style="background: rgba(168,85,247,0.1); border: 1px solid var(--accent-purple); border-radius: 8px; padding: 0.8rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.82rem; font-weight: 800; color: var(--accent-purple);">🎨 Customize Team Emblem</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Instant Update</span>
          </div>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
            ${['🛡️', '⚔️', '🦅', '🐺', '🐉', '💀', '⚡', '👑', '🎯', '🔥', '🦁', '💎', '☣️', '👾', '🏆', '🩸', '🚀', '🐍'].map(e => `
              <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.45rem; font-size: 0.85rem;" onclick="window.app.updateTeamEmblemDirect('${team.id}', '${e}')">${e}</button>
            `).join('')}
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" class="input-field" placeholder="Or type custom emoji / paste image URL..." style="font-size: 0.8rem; padding: 0.3rem 0.6rem;" id="manageCustomEmblemInput_${team.id}">
            <button class="btn btn-purple btn-sm" style="font-size: 0.78rem; padding: 0.3rem 0.7rem;" onclick="const val = document.getElementById('manageCustomEmblemInput_${team.id}').value; if(val) window.app.updateTeamEmblemDirect('${team.id}', val);">Apply Emblem</button>
          </div>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 0.6rem;">📋 Active Tactical Roster & Roles</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
          ${memberList.map((m, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.04); padding: 0.55rem 0.85rem; border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 0.85rem; font-weight: 800; color: #fff;">${m.name || m}</span>
                ${idx === 0 ? '<span style="background: rgba(255,215,0,0.2); color: var(--accent-gold); border: 1px solid var(--accent-gold); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.7rem; font-weight: 800;">CAPTAIN</span>' : ''}
              </div>
              <span class="lobby-game-tag" style="background: rgba(0,242,254,0.15); color: var(--accent-cyan); font-size: 0.75rem;">
                ${roles[idx % roles.length]}
              </span>
            </div>
          `).join('')}
        </div>

        ${(team.applications && team.applications.length > 0) ? `
          <h4 style="font-size: 0.95rem; font-weight: 800; color: #ffab00; margin-bottom: 0.6rem;">📨 Incoming Recruitment Requests</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
            ${team.applications.map((app, idx) => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,111,0,0.1); padding: 0.55rem 0.85rem; border-radius: 6px; border: 1px solid rgba(255,111,0,0.4);">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 800; color: #fff;">${app.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${app.role || 'Flex'} • ${app.elo || 2150} ELO</div>
                </div>
                <div style="display: flex; gap: 0.4rem;">
                  <button class="btn btn-primary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;" onclick="window.app.acceptTeamApplication('${team.id}', ${idx})">Accept</button>
                  <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;" onclick="window.app.declineTeamApplication('${team.id}', ${idx})">Decline</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}


        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-purple btn-sm" style="flex: 1;" onclick="window.app.closeManageTeamModal(); window.app.openTeamScrimModal('${team.id}');">
            ⚔️ Queue Team Scrim
          </button>
          <button class="btn btn-cyan btn-sm" style="flex: 1;" onclick="alert('🏆 LEAGUE ENTRY CONFIRMED!\\n\\n${team.name} registered into the Active Esports Championship League!')">
            🏆 Register for League
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.app.browseDraftPool('${team.id}')">
            ➕ Browse Draft Pool
          </button>
        </div>
      `;
    }

    if (modal) modal.classList.add('active');
  }

  updateTeamEmblemDirect(teamId, newEmblem) {
    if (!this.myCreatedTeams) this.loadMyCreatedTeams();
    const team = this.myCreatedTeams.find(t => t.id === teamId);
    if (!team || !newEmblem) return;

    team.emblem = newEmblem;
    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));
    this.openManageTeamModal(teamId);
    this.renderMyCreatedTeams();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }
  }

  closeManageTeamModal() {
    const modal = document.getElementById('manageTeamRosterModal');
    if (modal) modal.classList.remove('active');
  }

  browseDraftPool(teamId) {
    this.closeManageTeamModal();
    const btn = document.querySelector('[data-tab="lobbies-view"]');
    if (btn) btn.click();
    setTimeout(() => {
      const draftPool = document.getElementById('livePoolFeedContainer');
      if (draftPool) {
        draftPool.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  acceptTeamApplication(teamId, index) {
    const team = this.myCreatedTeams.find(t => t.id === teamId);
    if (!team || !team.applications || !team.applications[index]) return;

    const app = team.applications[index];
    if (!team.members) {
      team.members = [{ name: team.captain || 'Sean', role: 'Captain', elo: 2400 }];
    }

    team.members.push({
      name: app.name,
      role: app.role || 'Operative',
      elo: app.elo || 2150
    });
    team.applications.splice(index, 1);

    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));
    this.openManageTeamModal(teamId);
    this.renderMyCreatedTeams();
    alert(`✅ APPLICATION ACCEPTED!\n\n${app.name} has joined ${team.name}!`);
  }

  declineTeamApplication(teamId, index) {
    const team = this.myCreatedTeams.find(t => t.id === teamId);
    if (!team || !team.applications || !team.applications[index]) return;

    const app = team.applications[index];
    team.applications.splice(index, 1);

    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));
    this.openManageTeamModal(teamId);
    this.renderMyCreatedTeams();
    alert(`❌ APPLICATION DECLINED.\n\n${app.name}'s request was rejected.`);
  }

  openTeamScrimModal(teamId) {
    if (!this.myCreatedTeams) this.loadMyCreatedTeams();
    const team = this.myCreatedTeams.find(t => t.id === teamId);
    if (!team) return;

    this.activeScrimTeam = team;
    const modal = document.getElementById('teamScrimDispatchModal');
    const title = document.getElementById('scrimModalTeamTitle');
    const gameTag = document.getElementById('scrimModalGameTag');
    const mmrTag = document.getElementById('scrimModalMMRTag');
    const output = document.getElementById('scrimDispatchStatus');

    if (title) title.textContent = `${team.emblem || '🛡️'} ${team.name} ${team.tag}`;
    if (gameTag) gameTag.textContent = team.game;
    if (mmrTag) mmrTag.textContent = `${team.elo || 2350} Team ELO`;
    if (output) output.style.display = 'none';

    if (modal) modal.classList.add('active');
  }

  closeTeamScrimModal() {
    const modal = document.getElementById('teamScrimDispatchModal');
    if (modal) modal.classList.remove('active');
  }

  startTeamScrimSearch() {
    const team = this.activeScrimTeam || (this.myCreatedTeams ? this.myCreatedTeams[0] : null);
    const serverRegion = document.getElementById('scrimServerRegion') ? document.getElementById('scrimServerRegion').value : 'US East (N. Virginia)';
    const selectedMap = document.getElementById('scrimMapSelect') ? document.getElementById('scrimMapSelect').value : 'Mirage / Anubis';

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }

    const output = document.getElementById('scrimDispatchStatus');
    if (output) {
      output.style.display = 'block';
      output.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.8rem;">
          <div class="live-dot" style="width: 12px; height: 12px; background: var(--accent-cyan);"></div>
          <strong style="color: var(--accent-cyan); font-size: 0.95rem;">Searching for Equal ELO Rival Team...</strong>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.5rem;">Target Server: <strong style="color: #fff;">${serverRegion}</strong> • Map Pool: <strong style="color: var(--accent-gold);">${selectedMap}</strong></p>
        <div style="background: rgba(0,0,0,0.5); border-radius: 6px; padding: 0.6rem; font-size: 0.78rem; font-family: monospace; color: var(--accent-green);">
          [00:02] Matching ${team ? team.name : 'Team'} (Rating: ${team ? team.elo : 2350} ELO) against 128-tick Scrim Queue...<br>
          [00:05] Rival Found: ⚡ Apex Predators [APEX] (Rating: 2,360 ELO)!<br>
          [00:07] Server Provisioned: Dallas 128-tick Node #482.<br>
          [00:09] Match Connect Command: <code style="color: var(--accent-cyan);">connect 192.168.1.100:27015; password scrim33</code>
        </div>
      `;
    }

    if (window.widgetBuilderEngine) {
      setTimeout(() => {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
      }, 2500);
    }
  }

  disbandTeam(teamId) {
    if (!confirm('⚠️ DISBAND TEAM?\n\nAre you sure you want to disband this team roster?')) return;
    if (!this.myCreatedTeams) return;
    this.myCreatedTeams = this.myCreatedTeams.filter(t => t.id !== teamId);
    localStorage.setItem('cl_user_custom_teams_v1', JSON.stringify(this.myCreatedTeams));
    this.renderMyCreatedTeams();
  }

  start99PlayerQueue() {
    // 1. Verify User has a registered WARDOGS Team with >= 22 members
    let hasEligibleTeam = false;
    let userTeamName = "";
    if (window.wardogsEngine && window.wardogsEngine.registeredSquads) {
        const eligibleSquad = window.wardogsEngine.registeredSquads.find(s => s.membersCount >= 22);
        if (eligibleSquad) {
            hasEligibleTeam = true;
            userTeamName = eligibleSquad.name;
        }
    }

    if (!hasEligibleTeam) {
        alert("❌ INELIGIBLE FOR RANKED DRAFT\n\nYour Team must have at least 22 members online and ready to compete in a Tri-Faction ranked match.\n\nPlease recruit more mercenaries from the Draft Queue to reach the 22-player threshold. The remaining slots will be filled automatically from the Solo Pool.");
        return;
    }

    const modal = document.getElementById('wardogsPoolQueueModal');
    if (!modal) {
      this.runWardogsRankedDraft();
      return;
    }

    modal.style.display = 'flex';
    let queuedCount = 22; // Start the queue counter at the minimum online team members
    const progressBar = document.getElementById('queue99ProgressBar');
    const counterText = document.getElementById('queue99CounterText');
    const statusText = document.getElementById('queue99StatusText');
    const rosterList = document.getElementById('queue99RosterList');

    if (rosterList) rosterList.innerHTML = '';
    if (this.queue99Interval) clearInterval(this.queue99Interval);

    const callsigns = ['VIPER-1', 'HAMMER-6', 'VALKYRIE-3', 'SPECTRE-4', 'ALPHA-DOG', 'SHADOW-9', 'IRON-CLAW', 'TITAN-1', 'GHOST-7', 'K9-VANGUARD'];

    const updatePoolUI = () => {
      const pct = Math.round((queuedCount / 99) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (counterText) counterText.textContent = `${queuedCount} / 99 Operatives Queued (${pct}%)`;

      if (rosterList) {
        const randomCall = callsigns[Math.floor(Math.random() * callsigns.length)];
        const newItem = document.createElement('div');
        newItem.style.cssText = 'padding: 0.3rem 0.6rem; background: rgba(0, 242, 254, 0.08); border-radius: 4px; font-size: 0.78rem; display: flex; justify-content: space-between; margin-bottom: 0.25rem; border: 1px solid rgba(0, 242, 254, 0.2);';
        newItem.innerHTML = `<span>🟢 Operative_${randomCall}_${queuedCount} queued into Server Node</span><span style="color: var(--accent-cyan); font-weight: 700;">Slot #${queuedCount}</span>`;
        rosterList.insertBefore(newItem, rosterList.firstChild);
      }
    };

    updatePoolUI();

    this.queue99Interval = setInterval(() => {
      queuedCount += Math.floor(Math.random() * 7) + 3;
      if (queuedCount >= 99) {
        queuedCount = 99;
        updatePoolUI();
        clearInterval(this.queue99Interval);

        if (statusText) {
          statusText.innerHTML = '🎉 <strong style="color: var(--accent-green); font-size: 0.95rem;">SERVER FULL! 99/99 COMBATANTS QUEUED!</strong> Executing Tri-Faction Selection Draft...';
        }

        if (window.widgetBuilderEngine) {
          window.widgetBuilderEngine.playSoundEffect('match_found');
        }

        setTimeout(() => {
          modal.style.display = 'none';
          this.runWardogsRankedDraft();
        }, 1100);
      } else {
        updatePoolUI();
      }
    }, 280);
  }

  fillQueueImmediately() {
    if (this.queue99Interval) clearInterval(this.queue99Interval);
    const modal = document.getElementById('wardogsPoolQueueModal');
    const progressBar = document.getElementById('queue99ProgressBar');
    const counterText = document.getElementById('queue99CounterText');
    const statusText = document.getElementById('queue99StatusText');

    if (progressBar) progressBar.style.width = '100%';
    if (counterText) counterText.textContent = '99 / 99 Operatives Queued (100%)';
    if (statusText) statusText.innerHTML = '🎉 <strong style="color: var(--accent-green);">SERVER FULL! 99/99 COMBATANTS QUEUED!</strong> Launching 33v33v33 Selection Draft...';

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('match_found');
    }

    setTimeout(() => {
      if (modal) modal.style.display = 'none';
      this.runWardogsRankedDraft();
    }, 600);
  }

  closeWardogsPoolQueueModal() {
    if (this.queue99Interval) clearInterval(this.queue99Interval);
    const modal = document.getElementById('wardogsPoolQueueModal');
    if (modal) modal.style.display = 'none';
  }

  runWardogsRankedDraft() {
    const gameSelect = document.getElementById('wardogsGameSelect');
    const selectedGame = gameSelect ? gameSelect.value : 'Counter-Strike 2';

    if (!window.wardogsEngine) return;

    const matchRoom = window.wardogsEngine.generateRankedSelectionMatch(selectedGame);

    document.getElementById('wardogsDraftMatchId').textContent = `Match ID: ${matchRoom.id} • Game: ${matchRoom.game} (${matchRoom.capacity} Operatives) — Tri-Faction Auto-Balanced by MMR, K/D & Economy`;
    document.getElementById('wardogsAlphaElo').textContent = `Commander: ${matchRoom.commanderAlpha?.captain || 'Ghost_Dog_99'} • Avg: ${matchRoom.avgEloAlpha} ELO • K/D: ${matchRoom.kdAlpha} • Pool: ${matchRoom.clPointsAlpha}`;
    document.getElementById('wardogsBravoElo').textContent = `Commander: ${matchRoom.commanderBravo?.captain || 'Sargeant_Iron'} • Avg: ${matchRoom.avgEloBravo} ELO • K/D: ${matchRoom.kdBravo} • Pool: ${matchRoom.clPointsBravo}`;
    const charlieEloEl = document.getElementById('wardogsCharlieElo');
    if (charlieEloEl) charlieEloEl.textContent = `Commander: ${matchRoom.commanderCharlie?.captain || 'Shadow_K9'} • Avg: ${matchRoom.avgEloCharlie} ELO • K/D: ${matchRoom.kdCharlie} • Pool: ${matchRoom.clPointsCharlie}`;

    document.getElementById('wardogsAlphaRosterList').innerHTML = matchRoom.factionAlpha.map((p, idx) => `
      <div style="display: flex; justify-content: space-between; align-items: center; background: ${idx === 0 ? 'rgba(0,242,254,0.18)' : 'rgba(0,242,254,0.08)'}; padding: 0.4rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem; font-size: 0.8rem; border: ${idx === 0 ? '1px solid var(--accent-cyan)' : 'none'};">
        <div>
          <span style="font-weight: 700;">${p.rankBadge || '🛡️'} ${p.name} <span style="font-size: 0.7rem; color: var(--accent-cyan);">(${p.callsign})</span></span>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${p.rankTitle || 'Operative'}</div>
        </div>
        <div style="text-align: right;">
          <span style="color: var(--accent-gold); font-weight: 800;">${p.effectiveElo || p.elo} MMR</span>
          <span style="font-size: 0.68rem; color: var(--accent-green); font-weight: 800;"> (${p.mmrAdjustment >= 0 ? '+' + p.mmrAdjustment : p.mmrAdjustment})</span>
          <div style="font-size: 0.68rem; color: var(--accent-cyan); font-weight: 700;">K/D: ${p.kd} | ${p.bountyEarned || '1k CL-Points'}</div>
        </div>
      </div>
    `).join('');

    document.getElementById('wardogsBravoRosterList').innerHTML = matchRoom.factionBravo.map((p, idx) => `
      <div style="display: flex; justify-content: space-between; align-items: center; background: ${idx === 0 ? 'rgba(255,111,0,0.18)' : 'rgba(255,111,0,0.08)'}; padding: 0.4rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem; font-size: 0.8rem; border: ${idx === 0 ? '1px solid #ffab00' : 'none'};">
        <div>
          <span style="font-weight: 700;">${p.rankBadge || '🛡️'} ${p.name} <span style="font-size: 0.7rem; color: #ffab00;">(${p.callsign})</span></span>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${p.rankTitle || 'Operative'}</div>
        </div>
        <div style="text-align: right;">
          <span style="color: var(--accent-gold); font-weight: 800;">${p.effectiveElo || p.elo} MMR</span>
          <span style="font-size: 0.68rem; color: var(--accent-green); font-weight: 800;"> (${p.mmrAdjustment >= 0 ? '+' + p.mmrAdjustment : p.mmrAdjustment})</span>
          <div style="font-size: 0.68rem; color: var(--accent-cyan); font-weight: 700;">K/D: ${p.kd} | ${p.bountyEarned || '1k CL-Points'}</div>
        </div>
      </div>
    `).join('');

    const charlieListEl = document.getElementById('wardogsCharlieRosterList');
    if (charlieListEl) {
      charlieListEl.innerHTML = matchRoom.factionCharlie.map((p, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: ${idx === 0 ? 'rgba(255,215,0,0.18)' : 'rgba(255,215,0,0.08)'}; padding: 0.4rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem; font-size: 0.8rem; border: ${idx === 0 ? '1px solid #ffd700' : 'none'};">
          <div>
            <span style="font-weight: 700;">${p.rankBadge || '🛡️'} ${p.name} <span style="font-size: 0.7rem; color: #ffd700;">(${p.callsign})</span></span>
            <div style="font-size: 0.68rem; color: var(--text-muted);">${p.rankTitle || 'Operative'}</div>
          </div>
          <div style="text-align: right;">
            <span style="color: var(--accent-gold); font-weight: 800;">${p.effectiveElo || p.elo} MMR</span>
            <span style="font-size: 0.68rem; color: var(--accent-green); font-weight: 800;"> (${p.mmrAdjustment >= 0 ? '+' + p.mmrAdjustment : p.mmrAdjustment})</span>
            <div style="font-size: 0.68rem; color: var(--accent-cyan); font-weight: 700;">K/D: ${p.kd} | ${p.bountyEarned || '1k CL-Points'}</div>
          </div>
        </div>
      `).join('');
    }

    document.getElementById('wardogsDeploymentBanner').textContent = `🚀 WARDOGS TRI-FACTION TEAMS AUTO-BALANCED! (${matchRoom.balanceRating || '99.8% Equalized'}) • 128-Tick Dedicated Server Reserved (${matchRoom.map})`;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('match_found');
    }

    const modal = document.getElementById('wardogsRankedDraftModal');
    if (modal) modal.classList.add('active');

    this.renderWardogsView();
  }

  closeWardogsDraftModal() {
    const modal = document.getElementById('wardogsRankedDraftModal');
    if (modal) modal.classList.remove('active');
  }

  // Dedicated Ranked Matchmaking Hub Implementation
  renderMatchmakingHub() {
    const historyContainer = document.getElementById('mmMatchHistoryGrid');
    if (!historyContainer || !window.matchmakingHubEngine) return;

    const history = window.matchmakingHubEngine.matchHistory;

    historyContainer.innerHTML = history.map(m => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.8rem 1rem;">
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <span style="font-size: 1.4rem;">${m.result.includes('VICTORY') ? '🏆' : '💔'}</span>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #fff;">${m.game} • ${m.mode} <span style="font-size: 0.8rem; color: var(--text-muted);">(${m.map})</span></div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">MVP: <strong style="color: var(--accent-cyan);">${m.mvp}</strong> | ${m.date}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 900; font-size: 0.95rem; color: ${m.result.includes('VICTORY') ? 'var(--accent-green)' : 'var(--accent-red)'};">${m.result}</div>
          <div style="font-weight: 800; font-size: 0.82rem; color: ${m.eloChange.includes('+') ? 'var(--accent-gold)' : 'var(--accent-red)'};">${m.eloChange}</div>
        </div>
      </div>
    `).join('');
  }

  startMatchmakingQueue() {
    const gameSelect = document.getElementById('mmGameSelect');
    const game = gameSelect ? gameSelect.value : 'Counter-Strike 2';
    const modeSelect = document.getElementById('mmModeSelect');
    const mode = modeSelect ? modeSelect.value : '5v5 Premier Scrim';
    const regionSelect = document.getElementById('mmRegionSelect');
    const region = regionSelect ? regionSelect.value : 'US East (12ms)';

    if (game === 'random') {
      this.quickJoinRandomGame();
      return;
    }

    if (window.matchmakingHubEngine) {
      window.matchmakingHubEngine.startMatchmakingQueue(game, mode, region);
    }
  }

  cancelMatchmakingQueue() {
    if (window.matchmakingHubEngine) {
      window.matchmakingHubEngine.stopMatchmakingQueue(true);
    }
  }

  onMatchmakingGameChange(gameName) {
    const modeSelect = document.getElementById('mmModeSelect');
    if (!modeSelect) return;

    if (gameName === 'Slapshot: Rebound' || gameName === 'Rocket League') {
      modeSelect.value = '3v3 Arcade Hockey';
    } else {
      modeSelect.value = '5v5 Premier Scrim';
    }
  }

  flipCaptainCoin() {
    const winner = Math.random() < 0.5 ? 'Team Alpha' : 'Team Bravo';
    this.vetoTurn = winner;
    const txt = document.getElementById('coinFlipStatusText');
    if (txt) txt.textContent = `${winner} Wins`;
    this.addVetoLog(`• 🪙 Coin flip result: ${winner} wins first ban phase choice!`);
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }
    this.renderMapVetoGrid();
  }

  resetMapVetoSession() {
    this.bannedMaps.clear();
    this.selectedMatchMap = null;
    this.vetoTurn = 'Team Alpha';
    this.cs2MatchCode = null;
    this.vetoLogs = [`• Map veto session reset.`];
    this.renderMapVetoGrid();
  }

  confirmVetoAndLaunchMatch() {
    const maps = window.eloEngine.mapPools[this.currentDraftGame] || window.eloEngine.mapPools['Counter-Strike 2'];
    const remaining = maps.filter(m => !this.bannedMaps.has(m));

    let finalMap = this.selectedMatchMap;
    if (!finalMap && remaining.length > 0) {
      finalMap = remaining[0];
      this.selectedMatchMap = finalMap;
    }

    this.closeMapVetoModal();
    if (finalMap) {
      const game = this.currentDraftGame || 'Counter-Strike 2';
      const defaultIp = (game === 'Helix Game' || game === 'Pacifica') ? '127.0.0.1:7777' : '192.168.1.85:27015';

      if (game === 'Counter-Strike 2') {
        const mapPicker = this.vetoTurn;
        const loser = mapPicker === 'Team Alpha' ? 'Team Bravo' : 'Team Alpha';

        const code = prompt(`🎮 MAP SELECTED: ${finalMap}\n\nThe team that lost the faceoff (${loser}) can provide a private match code or dedicated server IP.\n\nLeave blank or click OK to connect to CustomLobbies Dedicated 128-tick Node (${defaultIp}):`, defaultIp);
        
        this.cs2MatchCode = (code && code.trim()) ? code.trim() : defaultIp;
        this.currentMatchServerIp = this.cs2MatchCode;
        this.currentMatchRoomTitle = `Counter-Strike 2 • Premier Scrim (${finalMap})`;
        this.triggerMatchFoundModal(this.currentMatchRoomTitle);
      } else {
        this.cs2MatchCode = defaultIp;
        this.currentMatchServerIp = defaultIp;
        this.currentMatchRoomTitle = `${game} • Premier Scrim (${finalMap})`;
        this.triggerMatchFoundModal(this.currentMatchRoomTitle);
      }
    } else {
      alert('⚠️ All maps were banned! Reset the veto session to start over.');
    }
  }

  renderMapVetoGrid() {
    const container = document.getElementById('mapVetoGridContainer');
    const modalContainer = document.getElementById('modalMapVetoGrid');
    const turnBannerText = document.getElementById('vetoTurnText');

    if (turnBannerText) {
      turnBannerText.textContent = this.selectedMatchMap 
        ? `🏆 MATCH MAP SELECTED: ${this.selectedMatchMap}`
        : `${this.vetoTurn === 'Team Alpha' ? '🔵' : '🔴'} TURN: ${this.vetoTurn} Ban Phase`;
    }

    const maps = window.eloEngine.getGameMapPool(this.currentDraftGame);

    const renderHTML = (m) => {
      const isBanned = this.bannedMaps.has(m);
      const isPick = this.selectedMatchMap === m;

      return `
        <div style="background: ${isPick ? 'rgba(0, 230, 118, 0.15)' : isBanned ? 'rgba(255, 82, 82, 0.1)' : 'rgba(255, 255, 255, 0.05)'}; border: 1px solid ${isPick ? 'var(--accent-green)' : isBanned ? '#ff5252' : 'var(--border-color)'}; border-radius: 8px; padding: 0.6rem; text-align: center;">
          <div style="font-weight: 800; font-size: 0.85rem; margin-bottom: 0.4rem; color: ${isBanned ? '#ff5252' : isPick ? 'var(--accent-green)' : 'inherit'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${isBanned ? '🚫 BAN: ' : isPick ? '🎮 MAP: ' : ''}${m}
          </div>
          <div style="display: flex; gap: 0.3rem; justify-content: center;">
            <button class="btn ${isBanned ? 'btn-secondary' : 'btn-danger'} btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.app.banMap('${m}')">
              ${isBanned ? 'Unban' : 'Ban'}
            </button>
            ${!isBanned ? `
              <button class="btn btn-primary btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.app.selectMatchMap('${m}')">
                Pick
              </button>
            ` : ''}
          </div>
        </div>
      `;
    };

    const htmlContent = maps.map(renderHTML).join('');

    if (container) container.innerHTML = htmlContent;
    if (modalContainer) modalContainer.innerHTML = htmlContent;

    const logContainer = document.getElementById('vetoHistoryLog');
    if (logContainer && this.vetoLogs) {
      logContainer.innerHTML = this.vetoLogs.map(l => `<div>${l}</div>`).join('');
    }
  }

  renderPoolFeed() {
    const container = document.getElementById('livePoolFeedContainer');
    if (!container) return;

    let captain1, captain2;

    if (this.captainSelectionMode === 'highest_mmr') {
      const sorted = [...this.poolFeed].sort((a, b) => b.elo - a.elo);
      captain1 = sorted[0];
      captain2 = sorted[1];
    } else if (this.captainSelectionMode === 'captain_commends') {
      const sorted = [...this.poolFeed].sort((a, b) => {
        const cA = a.commendations ? a.commendations.leadership || 0 : 0;
        const cB = b.commendations ? b.commendations.leadership || 0 : 0;
        if (cB !== cA) return cB - cA;
        return b.elo - a.elo;
      });
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
      if (this.captainSelectionMode === 'captain_commends') {
        const cA = a.commendations ? a.commendations.leadership || 0 : 0;
        const cB = b.commendations ? b.commendations.leadership || 0 : 0;
        if (cB !== cA) return cB - cA;
        return b.elo - a.elo;
      }
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
        this.setGameFilter('all');
      });
    }

    if (filterFavs) {
      filterFavs.addEventListener('click', () => {
        this.setGameFilter('favorites');
      });
    }
  }

  renderFavoriteStarTags() {
    const container = document.getElementById('favoriteGamesTagsContainer');
    if (!container) return;

    const favList = this.allGames.filter(game => this.favoriteGames.has(game));

    // Cap direct pill count to 4 max to maintain clean single-row UI across screens
    const MAX_VISIBLE_FAVS = 4;
    const visibleFavs = favList.slice(0, MAX_VISIBLE_FAVS);
    const hiddenCount = favList.length - visibleFavs.length;

    let html = visibleFavs.map(game => {
      const isSelected = this.activeFilter === game;
      return `
        <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-purple'}" onclick="window.app.setGameFilter('${game}')" title="Go to ${game} Lobbies" style="padding: 0.25rem 0.6rem; font-size: 0.78rem; ${isSelected ? 'box-shadow: 0 0 15px rgba(0, 242, 254, 0.5); border-color: var(--accent-cyan); font-weight: 800;' : ''}">
          <span>⭐</span> ${game}
        </button>
      `;
    }).join('');

    // Add Manage Favorites Dropdown Menu with filter and toggle controls
    html += `
      <div class="dropdown-wrapper dropdown-left">
        <button class="btn btn-secondary btn-sm" style="gap: 0.35rem; padding: 0.25rem 0.6rem; font-size: 0.78rem;">
          <span>⚙️</span> Manage Favorites (${this.favoriteGames.size}) ${hiddenCount > 0 ? `<span style="background: rgba(255, 215, 0, 0.25); color: var(--accent-gold); padding: 0.1rem 0.4rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800;">+${hiddenCount} more</span>` : ''} <span style="font-size: 0.7rem;">▼</span>
        </button>
        <div class="dropdown-menu" style="max-height: 290px; overflow-y: auto; min-width: 260px;">
          <div style="padding: 0.4rem 0.8rem; font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; font-weight: 800; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
            <span>Game Title</span>
            <span>Status</span>
          </div>
          ${this.allGames.map(game => {
            const isFav = this.favoriteGames.has(game);
            const isSelected = this.activeFilter === game;
            return `
              <div class="dropdown-item" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.4rem 0.8rem;">
                <span onclick="window.app.setGameFilter('${game}')" style="cursor: pointer; flex: 1; ${isSelected ? 'color: var(--accent-cyan); font-weight: 800;' : ''}" title="View ${game} Lobbies">
                  ${game} ${isSelected ? '✓' : ''}
                </span>
                <button class="btn btn-sm ${isFav ? 'btn-gold' : 'btn-secondary'}" style="padding: 0.15rem 0.45rem; font-size: 0.7rem; flex-shrink: 0;" onclick="window.app.toggleFavorite('${game}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                  ${isFav ? '⭐ Fav' : '☆ Add'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
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
        <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setGameFilter('${game}')" style="display: flex; align-items: center; gap: 0.4rem; ${isSelected ? 'box-shadow: 0 0 15px rgba(0, 242, 254, 0.5); border-color: var(--accent-cyan); font-weight: 800;' : ''}">
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
    if (this.activeFilter === gameName && gameName !== 'all') {
      this.activeFilter = 'all';
    } else {
      this.activeFilter = gameName;
    }

    // 1. Ensure Lobbies & Queue view is the active tab
    const lobbiesTabBtn = document.querySelector('.nav-btn[data-tab="lobbies-view"]');
    if (lobbiesTabBtn && !lobbiesTabBtn.classList.contains('active')) {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      lobbiesTabBtn.classList.add('active');
      document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('lobbies-view');
      if (targetSec) targetSec.classList.add('active');
    }

    // 2. Update filter button styles (All Games vs Favorites Only)
    const filterAll = document.getElementById('filterAllGames');
    const filterFavs = document.getElementById('filterFavsOnly');
    if (filterAll && filterFavs) {
      if (this.activeFilter === 'all') {
        filterAll.classList.add('btn-primary');
        filterAll.classList.remove('btn-secondary');
        filterFavs.classList.remove('btn-primary');
        filterFavs.classList.add('btn-purple');
      } else if (this.activeFilter === 'favorites') {
        filterFavs.classList.add('btn-primary');
        filterFavs.classList.remove('btn-purple');
        filterAll.classList.remove('btn-primary');
        filterAll.classList.add('btn-secondary');
      } else {
        filterAll.classList.remove('btn-primary');
        filterAll.classList.add('btn-secondary');
        filterFavs.classList.remove('btn-primary');
        filterFavs.classList.add('btn-purple');
      }
    }

    // 3. Re-render all bars & lobbies list
    const dd = document.getElementById('lobbyGameDropdownFilter');
    if (dd) dd.value = this.activeFilter;
    this.renderFavoriteStarTags();
    this.renderActiveGamesBar();
    this.renderLobbies();

    // 4. Smoothly scroll down to that game's lobbies
    setTimeout(() => {
      const lobbiesGrid = document.getElementById('lobbiesGrid');
      if (lobbiesGrid) {
        const headerOffset = 180;
        const elementPosition = lobbiesGrid.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 40);
  }

  getDefaultFrontpageServers() {
    return [
      {
        id: 'srv-cs2-premier-public',
        name: '🎯 CS2 128-Tick Premier Server Node',
        game: 'Counter-Strike 2',
        serverIp: '192.168.1.85:27015',
        region: 'NA East',
        isInviteOnly: false,
        passcode: '',
        tickrate: '128.0 Hz (Premier)',
        players: 8,
        max: 10,
        host: 'CustomLobbies Official',
        badge: '⭐ Premier Node',
        description: '128-tick sub-tick equalized Premier scrim node. Ring 0 Guardian AC active.'
      },
      {
        id: 'srv-cs2-cloud9-invite',
        name: '🔒 Cloud9 Pro Scrim Academy',
        game: 'Counter-Strike 2',
        serverIp: '192.168.1.88:27015',
        region: 'NA East',
        isInviteOnly: true,
        passcode: 'c9scrim',
        tickrate: '128.0 Hz (Premier)',
        players: 9,
        max: 10,
        host: 'C9_Manager',
        badge: '🔒 Invite Only',
        description: 'Private team academy scrim. Requires verified team invite passcode.'
      },
      {
        id: 'srv-wardogs-public',
        name: '🐕 WARDOGS Tri-Faction 99-Player War Node',
        game: 'WARDOGS',
        serverIp: '192.168.1.99:27015',
        region: 'NA East',
        isInviteOnly: false,
        passcode: '',
        tickrate: '128.0 Hz (Premier)',
        players: 84,
        max: 99,
        host: 'Marshal_Vanguard',
        badge: '🔥 33v33v33 Conquest',
        description: 'Sector 33 - Quantum Citadel. High capacity 99-player persistent warfare.'
      },
      {
        id: 'srv-wardogs-vanguard-invite',
        name: '🔒 Vanguard Special Ops [33v33v33]',
        game: 'WARDOGS',
        serverIp: '192.168.1.100:27015',
        region: 'EU Central',
        isInviteOnly: true,
        passcode: 'vanguard99',
        tickrate: '128.0 Hz (Premier)',
        players: 62,
        max: 99,
        host: 'Vanguard_HighCommand',
        badge: '🔒 Closed Scrim',
        description: 'Closed ranked trial for tier-1 battalions. Passcode required for deployment.'
      },
      {
        id: 'srv-helix-pacifica-public',
        name: '🌀 Pacifica World Sandbox & Clandestine Ops',
        game: 'Helix Game',
        serverIp: '127.0.0.1:7777',
        region: 'Helix Local',
        isInviteOnly: false,
        passcode: '',
        tickrate: '128.0 Hz (Premier)',
        players: 14,
        max: 32,
        host: 'Hypersonic Architect',
        badge: '🌀 Local Node',
        description: 'Unreal Engine 5 Pacifica physics, in-house drug synthesis and heist world.'
      },
      {
        id: 'srv-slapshot-public',
        name: '🏒 Slapshot: Rebound 3v3 Puck Arena',
        game: 'Slapshot: Rebound',
        serverIp: '192.168.1.130:27015',
        region: 'NA West',
        isInviteOnly: false,
        passcode: '',
        tickrate: '128.0 Hz (Premier)',
        players: 5,
        max: 6,
        host: 'PuckMaster99',
        badge: '🏒 Quick Arena',
        description: 'Low-latency 3v3 ranked hockey scrim arena.'
      },
      {
        id: 'srv-rematch-titans-invite',
        name: '🔒 Cyber Titans Elite 5v5 Node',
        game: 'REMATCH',
        serverIp: '192.168.1.110:27015',
        region: 'NA East',
        isInviteOnly: true,
        passcode: 'titans',
        tickrate: '128.0 Hz (Premier)',
        players: 7,
        max: 10,
        host: 'TitanCaptain',
        badge: '🔒 Invite Only',
        description: 'Exclusive 5v5 scrim node for Cyber Titans roster and verified scrim partners.'
      }
    ];
  }

  loadFrontpageServers() {
    try {
      const saved = localStorage.getItem('cl_frontpage_servers_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaults = this.getDefaultFrontpageServers();
          const existingIds = new Set(parsed.map(s => s.id));
          const missing = defaults.filter(d => !existingIds.has(d.id));
          this.frontpageServers = [...parsed, ...missing];
        } else {
          this.frontpageServers = this.getDefaultFrontpageServers();
        }
      } else {
        this.frontpageServers = this.getDefaultFrontpageServers();
      }

      const unlocked = localStorage.getItem('cl_unlocked_servers_v1');
      if (unlocked) {
        this.unlockedServerIds = new Set(JSON.parse(unlocked));
      }
    } catch(e) {
      console.warn('Error loading frontpage servers:', e);
      this.frontpageServers = this.getDefaultFrontpageServers();
    }
  }

  saveFrontpageServers() {
    try {
      localStorage.setItem('cl_frontpage_servers_v1', JSON.stringify(this.frontpageServers));
      localStorage.setItem('cl_unlocked_servers_v1', JSON.stringify(Array.from(this.unlockedServerIds)));
    } catch(e) {
      console.warn('Error saving frontpage servers:', e);
    }
  }

  openApplyServerModal() {
    const modal = document.getElementById('applyServerModal');
    if (!modal) return;

    const nameInput = document.getElementById('applyServerNameInput');
    if (nameInput) nameInput.value = '';
    const ipInput = document.getElementById('applyServerIpInput');
    if (ipInput) ipInput.value = '';
    const passInput = document.getElementById('applyServerPasscodeInput');
    if (passInput) passInput.value = '';
    const hostInput = document.getElementById('applyServerHostInput');
    if (hostInput) hostInput.value = this.user ? this.user.displayName : 'You (Host)';
    const descInput = document.getElementById('applyServerDescInput');
    if (descInput) descInput.value = '';

    const publicRadio = document.getElementById('applyServerAccessPublic');
    if (publicRadio) publicRadio.checked = true;
    this.toggleApplyServerAccessType('public');

    modal.style.display = 'flex';
    modal.classList.add('active');
  }

  closeApplyServerModal() {
    const modal = document.getElementById('applyServerModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  toggleApplyServerAccessType(mode) {
    const codeContainer = document.getElementById('applyServerInviteCodeContainer');
    const passInput = document.getElementById('applyServerPasscodeInput');
    if (codeContainer) {
      if (mode === 'invite_only') {
        codeContainer.style.display = 'block';
        if (passInput && !passInput.value) {
          passInput.value = 'CL-' + Math.floor(1000 + Math.random() * 9000);
        }
      } else {
        codeContainer.style.display = 'none';
      }
    }
  }

  handleApplyServerFormSubmit() {
    const nameInput = document.getElementById('applyServerNameInput');
    const gameSelect = document.getElementById('applyServerGameSelect');
    const ipInput = document.getElementById('applyServerIpInput');
    const regionSelect = document.getElementById('applyServerRegionSelect');
    const accessInviteRadio = document.getElementById('applyServerAccessInvite');
    const passInput = document.getElementById('applyServerPasscodeInput');
    const tickrateSelect = document.getElementById('applyServerTickrateSelect');
    const maxInput = document.getElementById('applyServerMaxInput');
    const hostInput = document.getElementById('applyServerHostInput');
    const descInput = document.getElementById('applyServerDescInput');

    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Community Dedicated Node';
    const game = gameSelect ? gameSelect.value : 'Counter-Strike 2';
    const ip = ipInput && ipInput.value.trim() ? ipInput.value.trim() : '192.168.1.85:27015';
    const region = regionSelect ? regionSelect.value : 'NA East';
    const isInviteOnly = accessInviteRadio ? accessInviteRadio.checked : false;
    const passcode = passInput && passInput.value.trim() ? passInput.value.trim() : '';
    const tickrate = tickrateSelect ? tickrateSelect.value : '128.0 Hz (Premier)';
    const max = maxInput ? parseInt(maxInput.value) || 10 : 10;
    const host = hostInput && hostInput.value.trim() ? hostInput.value.trim() : (this.user ? this.user.displayName : 'You (Host)');
    const desc = descInput && descInput.value.trim() ? descInput.value.trim() : (isInviteOnly ? 'Private scrim node with invite-only passcode protection.' : 'Public competitive dedicated server node.');

    if (isInviteOnly && !passcode) {
      alert('⚠️ Please specify a secret invite passcode or key for your invite-only server!');
      if (passInput) passInput.focus();
      return;
    }

    const serverId = 'srv-custom-' + Date.now();
    const newServer = {
      id: serverId,
      name: name,
      game: game,
      serverIp: ip,
      region: region,
      isInviteOnly: isInviteOnly,
      passcode: isInviteOnly ? passcode : '',
      tickrate: tickrate,
      players: 1,
      max: max,
      host: host,
      badge: isInviteOnly ? '🔒 Invite Only' : '⭐ Community Featured',
      description: desc,
      isUserSubmitted: true
    };

    if (isInviteOnly) {
      this.unlockedServerIds.add(serverId);
    }

    this.frontpageServers.unshift(newServer);
    this.saveFrontpageServers();
    this.renderFrontpageServers();
    this.closeApplyServerModal();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('lobby_start');
    }

    if (typeof this.showToast === 'function') {
      this.showToast(`🎉 Server "${name}" successfully listed on the Front Page! (${isInviteOnly ? '🔒 Invite Only: Passcode ' + passcode : '🌐 Public'})`, 'success');
    }
  }

  setServerFilterType(type) {
    this.serverFilterType = type;
    const btnAll = document.getElementById('btnServerFilterAll');
    const btnPub = document.getElementById('btnServerFilterPublic');
    const btnInv = document.getElementById('btnServerFilterInvite');

    if (btnAll) btnAll.className = type === 'all' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    if (btnPub) btnPub.className = type === 'public' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    if (btnInv) btnInv.className = type === 'invite_only' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';

    this.renderFrontpageServers();
  }

  connectOrUnlockServer(serverId) {
    const s = this.frontpageServers.find(srv => srv.id === serverId);
    if (!s) return;

    if (!s.isInviteOnly) {
      this.launchServerProtocol({
        serverIp: s.serverIp,
        game: s.game,
        title: s.name,
        map: s.game === 'WARDOGS' ? 'Sector 33 - Quantum Citadel' : 'Competitive'
      });
      return;
    }

    if (this.unlockedServerIds.has(serverId)) {
      if (typeof this.showToast === 'function') {
        this.showToast(`🔓 Server unlocked! Connecting to ${s.name}...`, 'success');
      }
      this.launchServerProtocol({
        serverIp: s.serverIp,
        game: s.game,
        title: s.name,
        password: s.passcode,
        map: s.game === 'WARDOGS' ? 'Sector 33 - Quantum Citadel' : 'Competitive'
      });
    } else {
      this.openServerInvitePromptModal(s);
    }
  }

  openServerInvitePromptModal(server) {
    this.activeInviteTargetServer = server;
    const modal = document.getElementById('serverInvitePromptModal');
    if (!modal) return;

    const nameEl = document.getElementById('inviteModalServerName');
    if (nameEl) nameEl.textContent = server.name;

    const metaEl = document.getElementById('inviteModalServerMeta');
    if (metaEl) metaEl.textContent = `Game: ${server.game} • Host: ${server.host} • Region: ${server.region || 'NA East'}`;

    const input = document.getElementById('serverInviteCodeInput');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }

    const err = document.getElementById('inviteCodeErrorMsg');
    if (err) err.style.display = 'none';

    modal.style.display = 'flex';
    modal.classList.add('active');
  }

  closeServerInvitePromptModal() {
    const modal = document.getElementById('serverInvitePromptModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
    this.activeInviteTargetServer = null;
  }

  verifyServerInviteCode() {
    if (!this.activeInviteTargetServer) return;
    const server = this.activeInviteTargetServer;
    const input = document.getElementById('serverInviteCodeInput');
    const entered = input ? input.value.trim() : '';
    const err = document.getElementById('inviteCodeErrorMsg');

    const expected = (server.passcode || '').trim();

    if (entered && entered.toLowerCase() === expected.toLowerCase()) {
      this.unlockedServerIds.add(server.id);
      this.saveFrontpageServers();
      this.closeServerInvitePromptModal();
      this.renderFrontpageServers();

      if (typeof this.showToast === 'function') {
        this.showToast(`✔ Invite Verified! Access Granted to ${server.name}`, 'success');
      }

      this.launchServerProtocol({
        serverIp: server.serverIp,
        game: server.game,
        title: server.name,
        password: server.passcode,
        map: server.game === 'WARDOGS' ? 'Sector 33 - Quantum Citadel' : 'Competitive'
      });
    } else {
      if (err) {
        err.style.display = 'block';
        err.textContent = `❌ Invalid invite key "${entered}"! Please contact host (${server.host}) for an access key.`;
      }
      if (input) {
        input.style.borderColor = '#ff3366';
        input.focus();
        setTimeout(() => { if (input) input.style.borderColor = 'var(--accent-gold)'; }, 2000);
      }
    }
  }

  deleteFrontpageServer(serverId) {
    const s = this.frontpageServers.find(srv => srv.id === serverId);
    if (!s) return;

    if (confirm(`Are you sure you want to remove server "${s.name}" from the Front Page?`)) {
      this.frontpageServers = this.frontpageServers.filter(srv => srv.id !== serverId);
      this.unlockedServerIds.delete(serverId);
      this.saveFrontpageServers();
      this.renderFrontpageServers();
      if (typeof this.showToast === 'function') {
        this.showToast(`Server "${s.name}" removed from Front Page.`, 'info');
      }
    }
  }

  renderSponsoredServers() {
    this.renderFrontpageServers();
  }

  renderFrontpageServers() {
    const frontGrid = document.getElementById('frontpageServersGrid');
    const sponsoredGrid = document.getElementById('sponsoredServersGrid');

    let list = [...this.frontpageServers];
    if (this.serverFilterType === 'public') {
      list = list.filter(s => !s.isInviteOnly);
    } else if (this.serverFilterType === 'invite_only') {
      list = list.filter(s => s.isInviteOnly);
    }

    const renderCard = (s) => {
      const isUnlocked = !s.isInviteOnly || this.unlockedServerIds.has(s.id);
      const isInvite = !!s.isInviteOnly;
      const fillPct = Math.round(((s.players || 1) / (s.max || 10)) * 100);

      const statusBadge = isInvite 
        ? `<span class="lobby-game-tag" style="background: rgba(255, 215, 0, 0.15); color: var(--accent-gold); border: 1px solid var(--accent-gold); font-weight: 800;">🔒 INVITE ONLY</span>`
        : `<span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green); border: 1px solid var(--accent-green); font-weight: 800;">🌐 PUBLIC</span>`;

      return `
        <div class="card" style="border-color: ${isInvite ? 'var(--accent-gold)' : 'rgba(0, 242, 254, 0.35)'}; position: relative; background: linear-gradient(135deg, rgba(16, 18, 28, 0.95), rgba(12, 14, 20, 0.98)); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.4rem;">
              <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                <span class="lobby-game-tag" style="background: rgba(168, 85, 247, 0.2); color: var(--accent-purple); font-weight: 800;">
                  🎮 ${s.game}
                </span>
                ${statusBadge}
                ${isInvite && isUnlocked ? `<span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green); font-weight: 800;">✔ Unlocked</span>` : ''}
              </div>
              <span style="font-size: 0.72rem; color: var(--text-dim);">${s.region || 'Global'}</span>
            </div>

            <h3 style="font-size: 1.15rem; font-weight: 900; margin-bottom: 0.35rem; color: #fff;">
              ${s.name}
            </h3>

            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.7rem; line-height: 1.4;">
              ${s.description || 'Dedicated 128-tick scrimmage server.'}
            </p>

            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 0.5rem 0.7rem; margin-bottom: 0.8rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span style="color: var(--text-dim);">Server Node:</span>
                <code style="color: var(--accent-cyan); font-weight: 800;">${s.serverIp}</code>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span style="color: var(--text-dim);">Performance:</span>
                <span style="color: var(--accent-gold); font-weight: 800;">${s.tickrate || '128.0 Hz'}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-dim);">Host / Clan:</span>
                <strong style="color: #fff;">${s.host}</strong>
              </div>
            </div>

            <div style="margin-bottom: 0.9rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.25rem;">
                <span style="color: var(--accent-green);">${s.players || 0} / ${s.max || 10} Players Online</span>
                <span style="color: var(--text-dim);">${fillPct}% Capacity</span>
              </div>
              <div class="lobby-players-bar" style="height: 6px;">
                <div class="lobby-players-fill" style="width: ${fillPct}%; background: ${isInvite ? 'linear-gradient(90deg, #ffd700, #ff8800)' : 'linear-gradient(90deg, #00f2fe, #00e676)'};"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
            ${isInvite && !isUnlocked ? `
              <button class="btn btn-warning btn-sm" style="flex: 2; min-width: 140px; background: linear-gradient(135deg, #ffd700, #ff8800); color: #000; font-weight: 900; border: none;" onclick="window.app.connectOrUnlockServer('${s.id}')">
                <span>🔒</span> Unlock & Connect
              </button>
            ` : (isInvite && isUnlocked ? `
              <button class="btn btn-success btn-sm" style="flex: 2; min-width: 140px; font-weight: 900;" onclick="window.app.connectOrUnlockServer('${s.id}')">
                <span>🔓</span> Connect (Unlocked)
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" style="flex: 2; min-width: 140px; font-weight: 800;" onclick="window.app.connectOrUnlockServer('${s.id}')">
                <span>🔌</span> 1-Click Connect
              </button>
            `)}

            <button class="btn btn-secondary btn-sm" onclick="window.app.copyServerIP('${s.serverIp}')" title="Copy Connect IP Command">
              📋 IP
            </button>

            ${s.isUserSubmitted ? `
              <button class="btn btn-danger btn-sm" onclick="window.app.deleteFrontpageServer('${s.id}')" title="Remove My Server">
                🗑️
              </button>
            ` : ''}
          </div>
        </div>
      `;
    };

    const emptyHTML = `
      <div class="card" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted); background: rgba(0,0,0,0.3); border: 1px dashed var(--border-color);">
        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🖥️</span>
        <strong style="color: #fff; font-size: 1rem; display: block; margin-bottom: 0.3rem;">No servers found for this filter.</strong>
        <p style="font-size: 0.85rem; margin-bottom: 1rem;">Be the first to apply your community server or private scrim node to the Front Page!</p>
        <button class="btn btn-primary btn-sm" onclick="window.app.openApplyServerModal()">➕ Apply Server to Front Page</button>
      </div>
    `;

    const html = list.length > 0 ? list.map(renderCard).join('') : emptyHTML;

    if (frontGrid) frontGrid.innerHTML = html;
    if (sponsoredGrid) sponsoredGrid.innerHTML = html;
  }

  connectToServer(name, url) {
    const ipPort = url.replace('steam://connect/', '');
    this.launchServerProtocol({
      serverIp: ipPort,
      game: name,
      title: name,
      protocolUrl: url
    });
  }

  copyServerIP(ipPort) {
    const cmd = `connect ${ipPort}`;
    try {
      navigator.clipboard.writeText(cmd);
    } catch (e) {}

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }

    alert(`📋 CONSOLE COMMAND COPIED!\n\nCommand: "${cmd}"\n\nPaste in your game console (~ key) to connect directly to the 128-tick server node!`);
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
        }
      }, 100);
    });
  }

  initAuthSession() {
    try {
      if (window.authBackend) {
        const val = window.authBackend.validateJWT();
        if (val.valid) {
          const savedUser = localStorage.getItem('cl_auth_user');
          if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.updateUserAuthUI();
          }
        }
      } else {
        const savedUser = localStorage.getItem('cl_auth_user');
        if (savedUser) {
          this.user = JSON.parse(savedUser);
          this.updateUserAuthUI();
        }
      }
    } catch (err) {
      console.warn('Auth session load fallback:', err);
    }
  }

  openAuthModal() {
    const modal = document.getElementById('authPortalModal');
    if (modal) modal.classList.add('active');
  }

  closeAuthModal() {
    const modal = document.getElementById('authPortalModal');
    if (modal) modal.classList.remove('active');
  }

  switchAuthTab(tabName) {
    const btnSignIn = document.getElementById('authTabSignIn');
    const btnReg = document.getElementById('authTabRegister');
    const btnOAuth = document.getElementById('authTabOAuth');

    const viewSignIn = document.getElementById('authViewSignIn');
    const viewReg = document.getElementById('authViewRegister');
    const viewOAuth = document.getElementById('authViewOAuth');

    [btnSignIn, btnReg, btnOAuth].forEach(btn => btn && btn.classList.remove('active'));
    [viewSignIn, viewReg, viewOAuth].forEach(view => view && (view.style.display = 'none'));

    if (tabName === 'signin') {
      if (btnSignIn) btnSignIn.classList.add('active');
      if (viewSignIn) viewSignIn.style.display = 'block';
    } else if (tabName === 'register') {
      if (btnReg) btnReg.classList.add('active');
      if (viewReg) viewReg.style.display = 'block';
    } else if (tabName === 'oauth') {
      if (btnOAuth) btnOAuth.classList.add('active');
      if (viewOAuth) viewOAuth.style.display = 'block';
    }
  }

  async handleEmailSignIn() {
    const usernameInput = document.getElementById('signInUsername');
    const passwordInput = document.getElementById('signInPassword');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (this.user) {
      this.signOutUser();
      return;
    }

    if (window.authBackend) {
      const res = await window.authBackend.authenticateUser(username, password);
      if (!res.success) {
        alert(res.error);
        return;
      }

      if (res.requires2FA) {
        this.pending2FAUser = res.user;
        this.open2FAModal(res.otpCodeHint);
        return;
      }

      this.user = res.user;
      localStorage.setItem('cl_auth_user', JSON.stringify(this.user));
      this.updateUserAuthUI();
      this.closeAuthModal();

      if (window.firebaseGoogleEngine && typeof window.firebaseGoogleEngine.speakTextAlert === 'function') {
        window.firebaseGoogleEngine.speakTextAlert(`Welcome back ${this.user.displayName}`);
      }

      alert(`🎉 SIGN IN SUCCESSFUL!\n\nWelcome back, ${this.user.displayName}!`);
    } else {
      alert("Auth backend is not initialized.");
    }
  }

  async handleUserRegistration() {
    const usernameInput = document.getElementById('regUsername');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const primaryGameSelect = document.getElementById('regPrimaryGame');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const primaryGame = primaryGameSelect ? primaryGameSelect.value : 'Counter-Strike 2';

    if (!username || !email || !password) {
      alert("Please fill in all registration fields.");
      return;
    }

    if (window.authBackend) {
      const res = await window.authBackend.registerUser({ username, email, password, primaryGame });
      if (!res.success) {
        alert(res.error);
        return;
      }

      this.user = res.user;
      localStorage.setItem('cl_auth_user', JSON.stringify(this.user));
      this.updateUserAuthUI();
      this.closeAuthModal();

      alert(`✨ ACCOUNT CREATED!\n\nWelcome to CustomLobbies, ${this.user.displayName}!`);
    } else {
      alert("Auth backend is not initialized.");
    }
  }

  async handleOAuthSignIn(provider) {
    if (window.authBackend) {
      const res = await window.authBackend.processOAuthLogin(provider);
      if (!res.success) {
        alert(res.error);
      }
      // If success, Supabase will redirect the page to the OAuth provider,
      // so no further UI updates are needed here until they return.
    } else {
      alert("Auth backend is not initialized.");
    }
  }

  open2FAModal(hintCode) {
    const modal = document.getElementById('twoFactorAuthModal');
    const hint = document.getElementById('twoFactorOtpHint');
    const input = document.getElementById('twoFactorOtpInput');

    if (hint) hint.textContent = hintCode || '123456';
    if (input) input.value = '';
    if (modal) modal.classList.add('active');
  }

  close2FAModal() {
    const modal = document.getElementById('twoFactorAuthModal');
    if (modal) modal.classList.remove('active');
  }

  submit2FAVerification() {
    const input = document.getElementById('twoFactorOtpInput');
    const code = input ? input.value.trim() : '123456';

    if (window.authBackend) {
      const valid = window.authBackend.verify2FAOTP(code);
      if (!valid) {
        alert('❌ INVALID 2FA CODE!\n\nPlease enter a 6-digit numeric OTP code.');
        return;
      }

      this.user = this.pending2FAUser || {
        username: 'Sean',
        displayName: 'Sean',
        email: 'sean@customlobbies.com',
        elo: 1840,
        level: 8,
        title: '💎 Diamond Veteran',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80',
        acVerified: true
      };

      window.authBackend.generateJWT(this.user);
      localStorage.setItem('cl_auth_user', JSON.stringify(this.user));

      this.updateUserAuthUI();
      this.close2FAModal();
      this.closeAuthModal();

      if (window.widgetBuilderEngine && typeof window.widgetBuilderEngine.playSoundEffect === 'function') {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
      }

      alert(`🔒 2FA VERIFICATION SUCCESSFUL!\n\nWelcome back, ${this.user.displayName}!\n2FA Verified • Bearer JWT Authorized.`);
    }
  }

  signOutUser() {
    this.user = null;
    localStorage.removeItem('cl_auth_user');
    this.updateUserAuthUI();
    alert('Logged out from CustomLobbies Account.');
  }

  promptCustomizePassportEmblem() {
    const defaultEmblems = ['👑', '💎', '🔥', '🦁', '⚡', '🦅', '🐺', '🐉', '💀', '🎯', '🚀', '👾', '🏆', '🩸', '🛡️', '⚔️'];
    const current = (this.user && this.user.emblem) || '👑';
    const choice = prompt(`🎨 CUSTOMIZE YOUR GAMER EMBLEM & CREST:\n\nType any custom Emoji, Symbol, or paste an Image URL:\n(Presets: ${defaultEmblems.slice(0, 10).join(' ')})\n`, current);
    
    if (choice !== null && choice.trim()) {
      const emblem = choice.trim();
      if (!this.user) {
        this.user = {
          username: 'Sean',
          displayName: 'Sean (Host)',
          elo: 1840,
          level: 8,
          title: '💎 Diamond Veteran',
          emblem: emblem
        };
      } else {
        this.user.emblem = emblem;
      }
      localStorage.setItem('cl_auth_user', JSON.stringify(this.user));
      this.updateUserAuthUI();
      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
      }
      alert(`🎉 GAMER EMBLEM UPDATED!\n\nYour custom gamer emblem has been equipped across your Passport & profile badges!`);
    }
  }

  updateUserAuthUI() {
    const authBtnLabel = document.getElementById('authBtnLabel');
    const userPassportTitle = document.getElementById('userPassportTitle');
    const userMMRValue = document.getElementById('userMMRValue');
    const btnOpenAuthModal = document.getElementById('btnOpenAuthModal');
    const userProfileEmblemAvatar = document.getElementById('userProfileEmblemAvatar');

    const userEmblem = (this.user && this.user.emblem) || '👑';
    if (userProfileEmblemAvatar) {
      userProfileEmblemAvatar.innerHTML = this.renderEmblemHTML(userEmblem, '2.2rem');
    }

    if (this.user) {
      if (authBtnLabel) {
        authBtnLabel.textContent = `👤 ${this.user.displayName} (Sign Out)`;
      }
      if (btnOpenAuthModal) {
        btnOpenAuthModal.onclick = () => this.signOutUser();
      }
      if (userPassportTitle) {
        userPassportTitle.textContent = this.user.title || '💎 Diamond Veteran';
      }
      if (userMMRValue) {
        userMMRValue.textContent = `Level ${this.user.level || 8} (${this.user.elo || 1840} ELO)`;
      }
    } else {
      if (authBtnLabel) {
        authBtnLabel.textContent = 'Sign In / Register';
      }
      if (btnOpenAuthModal) {
        btnOpenAuthModal.onclick = () => this.openAuthModal();
      }
    }
  }

  setupTabNavigation() {
    const btns = document.querySelectorAll('.nav-btn');
    const moreMenu = document.getElementById('navMoreDropdownMenu');
    const moreBtn = document.getElementById('navMoreDropdownBtn');
    const moreLabel = document.getElementById('navMoreBtnLabel');

    // Close More dropdown helper
    const closeMoreDropdown = () => {
      if (document.activeElement) document.activeElement.blur();
      if (moreMenu) {
        moreMenu.style.display = 'none';
        setTimeout(() => { if (moreMenu) moreMenu.style.display = ''; }, 250);
      }
    };

    // Close when clicking dropdown items that trigger modals/actions without data-tab
    if (moreMenu) {
      moreMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          closeMoreDropdown();
        });
      });
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (!tabId) return;
        
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Check if this button is inside the More dropdown
        const isInsideMore = btn.closest('#navMoreDropdownMenu');
        if (isInsideMore && moreBtn) {
          moreBtn.classList.add('active');
          if (moreLabel) {
            const icon = btn.querySelector('span')?.textContent || '✨';
            const labelText = btn.textContent.replace(icon, '').trim();
            moreLabel.textContent = labelText || 'More';
          }
          closeMoreDropdown();
        } else if (moreBtn && !isInsideMore && btn !== moreBtn) {
          if (moreLabel) moreLabel.textContent = 'More';
        }

        document.querySelectorAll('.view-section').forEach(sec => {
          sec.classList.remove('active');
        });

        const targetSection = document.getElementById(tabId);
        if (targetSection) {
          targetSection.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Dynamically re-render target view components so user never needs a manual page refresh!
        if (tabId === 'lobbies-view') {
          this.renderLobbies();
          this.renderMyCreatedTeams();
          this.renderFrontpageServers();
          if (window.tournamentsStoreEngine) window.tournamentsStoreEngine.renderDashboardBracketWidget();
        } else if (tabId === 'servers-view') {
          this.renderFrontpageServers();
        } else if (tabId === 'tournaments-view') {
          if (window.tournamentsStoreEngine) {
            window.tournamentsStoreEngine.renderTournaments();
            window.tournamentsStoreEngine.renderMonthlyCalendarGrid();
          }
        } else if (tabId === 'community-view') {
          if (window.chatVoiceManager) {
            window.chatVoiceManager.renderMessages();
            window.chatVoiceManager.renderOnlineUsers();
            window.chatVoiceManager.renderDashboardStickers();
          }
        } else if (tabId === 'debate-view') {
          this.renderDebateLobbies();
        } else if (tabId === 'leaderboard-view') {
          this.renderLeaderboard();
        } else if (tabId === 'wardogs-view') {
          this.renderWardogsView();
        } else if (tabId === 'matchmaking-view') {
          if (window.matchmakingHubEngine) window.matchmakingHubEngine.updateRadarUI();
        }
      });
    });
  }

  setLobbyFilterType(type) {
    this.lobbyFilterType = type;

    const btnPublic = document.getElementById('btnFilterPublicWithPlayers');
    const btnAll = document.getElementById('btnFilterAllLobbies');
    const btnFav = document.getElementById('btnFilterFavLobbies');

    [btnPublic, btnAll, btnFav].forEach(b => {
      if (b) {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      }
    });

    if (type === 'public_with_players' && btnPublic) {
      btnPublic.classList.remove('btn-secondary');
      btnPublic.classList.add('btn-primary');
    } else if (type === 'all' && btnAll) {
      btnAll.classList.remove('btn-secondary');
      btnAll.classList.add('btn-primary');
    } else if (type === 'favorites' && btnFav) {
      btnFav.classList.remove('btn-secondary');
      btnFav.classList.add('btn-primary');
    }

    this.renderLobbies();
  }

  quickJoinGame(gameOverride) {
    let targetGame = gameOverride;
    if (!targetGame) {
      const selectEl = document.getElementById('quickJoinGameSelect');
      targetGame = selectEl ? selectEl.value : 'random';
    }

    if (targetGame === 'random') {
      this.quickJoinRandomGame();
      return;
    }

    // Look for active public lobbies with players in them for this game
    const openLobbies = (this.lobbies || []).filter(l => 
      l.game === targetGame && l.players > 0 && l.players < l.max && l.isPublic !== false
    );

    if (openLobbies.length > 0) {
      // Pick the lobby closest to full for fastest queue fill
      openLobbies.sort((a, b) => b.players - a.players);
      const chosen = openLobbies[0];
      this.joinAndQueueLobby(chosen.id);

      const grid = document.getElementById('lobbiesGrid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Fallback: Start matchmaking queue for this specific game
      if (window.matchmakingHubEngine) {
        window.matchmakingHubEngine.startMatchmakingQueue(targetGame, '5v5 Premier Scrim', 'US East (12ms)');
      }
      if (window.widgetBuilderEngine?.showToast) {
        window.widgetBuilderEngine.showToast(`⚡ Entered Ranked Matchmaking Queue for ${targetGame}!`, 'success');
      } else {
        alert(`⚡ Entered Ranked Matchmaking Queue for ${targetGame}! Searching for opponents...`);
      }
    }
  }

  quickJoinRandomGame() {
    // Collect all games with open public lobbies having players
    const activePublicLobbies = (this.lobbies || []).filter(l => 
      l.players > 0 && l.players < l.max && l.isPublic !== false
    );

    let chosenLobby = null;
    let chosenGame = 'Counter-Strike 2';

    if (activePublicLobbies.length > 0) {
      const randIdx = Math.floor(Math.random() * activePublicLobbies.length);
      chosenLobby = activePublicLobbies[randIdx];
      chosenGame = chosenLobby.game;
    } else {
      const pool = ['WARDOGS', 'Counter-Strike 2', 'Valorant', 'Marvel Rivals', 'Empulse', 'REMATCH', 'Slapshot: Rebound', 'Rocket League', 'Deadlock', 'The Finals'];
      chosenGame = pool[Math.floor(Math.random() * pool.length)];
    }

    // Update quickJoinGameSelect dropdown to reflect the chosen game
    const selectEl = document.getElementById('quickJoinGameSelect');
    if (selectEl) {
      const optionExists = Array.from(selectEl.options).some(o => o.value === chosenGame);
      if (optionExists) selectEl.value = chosenGame;
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
      if (typeof window.widgetBuilderEngine.showToast === 'function') {
        window.widgetBuilderEngine.showToast(`🎲 Random Game Drawn: ${chosenGame}! Joining active queue...`, 'success');
      }
    }

    if (chosenLobby) {
      this.joinAndQueueLobby(chosenLobby.id);
      const grid = document.getElementById('lobbiesGrid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      if (window.matchmakingHubEngine) {
        window.matchmakingHubEngine.startMatchmakingQueue(chosenGame, '5v5 Premier Scrim', 'US East (12ms)');
      }
      alert(`🎲 RANDOM GAME DRAWN: ${chosenGame}!\n\nEntered active matchmaking queue. Searching for players...`);
    }
  }

  joinAndQueueLobby(id) {
    const lobby = this.lobbies.find(l => l.id == id);
    if (!lobby) return;

    if (lobby.players >= lobby.max) {
      if (window.widgetBuilderEngine?.showToast) {
        window.widgetBuilderEngine.showToast(`⚠️ Lobby "${lobby.title}" is full!`, 'error');
      } else {
        alert(`⚠️ Lobby "${lobby.title}" is currently full!`);
      }
      return;
    }

    lobby.players++;
    if (!lobby.members) lobby.members = [];
    lobby.members.push({ name: 'You (Host)', role: 'Queue Member', elo: 2150 });
    
    this.saveState();
    this.renderActiveGamesBar();
    this.renderLobbies();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
      if (typeof window.widgetBuilderEngine.showToast === 'function') {
        window.widgetBuilderEngine.showToast(`⚡ Joined & Queued in "${lobby.title}" (${lobby.players}/${lobby.max} Players)!`, 'success');
      }
    }

    // Auto-launch snake draft for lobby match when filled
    if (lobby.players >= lobby.max) {
      setTimeout(() => {
        this.triggerLobbySnakeDraft(lobby.title, lobby.game);
      }, 500);
    }
  }

  joinLobby(id) {
    this.joinAndQueueLobby(id);
  }

  renderLobbies() {
    const grid = document.getElementById('lobbiesGrid');
    if (!grid) return;

    const counts = this.getActiveLobbyCounts();

    let list = [...this.lobbies];

    // Filter by Lobby Type (defaults to open public lobbies with players!)
    if (this.lobbyFilterType === 'public_with_players') {
      list = list.filter(l => (l.players || 0) > 0 && (l.players < l.max) && (l.isPublic !== false));
    } else if (this.lobbyFilterType === 'favorites') {
      list = list.filter(l => this.favoriteGames.has(l.game));
    }

    // Filter by Game if selected
    if (this.activeFilter && this.activeFilter !== 'all' && this.activeFilter !== 'favorites') {
      list = list.filter(l => l.game === this.activeFilter);
    }

    // Sort: open public lobbies with players closest to full first
    list.sort((a, b) => {
      const openA = (a.players > 0 && a.players < a.max) ? 100 : 0;
      const openB = (b.players > 0 && b.players < b.max) ? 100 : 0;
      const favA = this.favoriteGames.has(a.game) ? 20 : 0;
      const favB = this.favoriteGames.has(b.game) ? 20 : 0;
      return (openB + favB + b.players) - (openA + favA + a.players);
    });

    if (list.length === 0) {
      grid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; padding: 2.5rem; color: var(--text-muted); background: rgba(0,0,0,0.4); border: 1px dashed var(--border-color); border-radius: 12px;">
        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🎮</span>
        <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 0.3rem;">No active lobbies found matching this filter.</strong>
        <p style="margin-bottom: 1rem; font-size: 0.85rem;">Switch filter to "All Lobbies" or host a custom room above!</p>
        <button class="btn btn-primary btn-sm" onclick="window.app.setLobbyFilterType('all')">Show All Lobbies</button>
      </div>`;
      return;
    }

    grid.innerHTML = list.map(l => {
      const fillPct = Math.round((l.players / l.max) * 100);
      const isFav = this.favoriteGames.has(l.game);
      const isPublic = l.isPublic !== false;
      const spotsLeft = l.max - l.players;
      const statusBadge = l.matchStatus || (fillPct >= 90 ? '🟢 IN-GAME (Live)' : (fillPct >= 70 ? '⚡ DRAFTING' : '🔥 RECRUITING'));
      const statusColor = statusBadge.includes('IN-GAME') || statusBadge.includes('LIVE') ? 'var(--accent-green)' : (statusBadge.includes('DRAFT') ? 'var(--accent-cyan)' : 'var(--accent-gold)');

      return `
        <div class="lobby-card" style="${isFav ? 'border-color: var(--accent-gold); box-shadow: 0 0 15px rgba(255, 215, 0, 0.15);' : (isPublic ? 'border-color: rgba(0, 242, 254, 0.35);' : '')}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
              <span class="lobby-game-tag" style="${isFav ? 'background: rgba(255, 215, 0, 0.15); color: var(--accent-gold); font-weight: 800;' : ''}">
                ${isFav ? '⭐ ' : '🎮 '}${l.game}
              </span>
              <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: ${statusColor}; font-weight: 800; border: 1px solid ${statusColor};">
                ${statusBadge}
              </span>
              ${isPublic ? '<span class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); font-weight: 800; border: 1px solid rgba(0, 242, 254, 0.4);">🟢 Public Lobby</span>' : ''}
              ${l.map ? `<span class="lobby-game-tag" style="background: rgba(168, 85, 247, 0.15); color: var(--accent-purple);">🗺️ ${l.map}</span>` : ''}
            </div>
            <button style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: ${isFav ? 'var(--accent-gold)' : 'var(--text-dim)'};" onclick="window.app.toggleFavorite('${l.game}')" title="Pin / Favorite Game">
              ${isFav ? '⭐' : '☆'}
            </button>
          </div>

          <h3 style="font-size: 1.15rem; font-weight: 900; margin: 0.5rem 0; color: #fff;">${l.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">Host: <strong style="color: var(--accent-cyan);">${l.host}</strong> | Type: <strong style="color: var(--accent-gold);">${l.draftType}</strong> | Region: <strong style="color: var(--text-main);">${l.region || 'NA East'}</strong></p>

          <div class="lobby-players-bar">
            <div class="lobby-players-fill" style="width: ${fillPct}%; background: ${spotsLeft <= 2 ? 'linear-gradient(90deg, #ffab00, #00e676)' : 'linear-gradient(90deg, #00f2fe, #4facfe)'};"></div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; flex-wrap: wrap; gap: 0.6rem;">
            <div>
              <span style="font-size: 0.88rem; font-weight: 800; color: ${spotsLeft <= 0 ? 'var(--accent-red)' : (spotsLeft <= 3 ? 'var(--accent-green)' : 'var(--accent-cyan)')};">
                ${l.players} / ${l.max} Players
              </span>
              <span style="font-size: 0.78rem; color: var(--text-muted); margin-left: 0.4rem;">
                (${spotsLeft > 0 ? `${spotsLeft} Spots Left • Open to Join` : 'Full Match'})
              </span>
            </div>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              ${spotsLeft > 0 ? `
                <button class="btn btn-primary btn-sm" onclick="window.app.joinAndQueueLobby('${l.id}')" style="box-shadow: 0 0 15px rgba(0, 242, 254, 0.4); font-weight: 800; padding: 0.35rem 0.75rem;">
                  <span>⚡</span> Queue Up / Join (${l.players}/${l.max})
                </button>
              ` : `
                <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6;">Full</button>
              `}
              <button class="btn btn-cyan btn-sm" onclick="window.app.launchFaceitMatchRoom('${l.title}', '${l.game}')">🏆 Direct Join</button>
              <button class="btn btn-purple btn-sm" onclick="window.app.triggerLobbySnakeDraft('${l.title}', '${l.game}')" title="Launch Snake Draft Board">🐍 Draft</button>
              <button class="btn btn-secondary btn-sm" onclick="window.app.copyServerIP('${l.serverIp || '192.168.1.85:27015'}')" title="Copy IP">📋 IP</button>
              <button class="btn btn-secondary btn-sm" onclick="window.app.connectLobbyVoice('${l.title}')" title="Voice">🎙️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  getDraftPoolForGame(gameTitle = 'Counter-Strike 2', targetCapacity = 10) {
    const defaultRosters = {
      'WARDOGS': [
        { name: 'Marshal_Vanguard', elo: 2680, role: 'Fireteam Commander', commendations: { leadership: 28, friendly: 19, clutch: 24, teacher: 15 } },
        { name: 'IronClad_Gunner', elo: 2590, role: 'Heavy Weapons', commendations: { leadership: 22, friendly: 18, clutch: 26, teacher: 12 } },
        { name: 'Ghost_Scout', elo: 2540, role: 'Forward Recon', commendations: { leadership: 18, friendly: 20, clutch: 25, teacher: 10 } },
        { name: 'Valkyrie_Medic', elo: 2490, role: 'Combat Support', commendations: { leadership: 15, friendly: 32, clutch: 20, teacher: 18 } },
        { name: 'Apex_Striker', elo: 2450, role: 'Assault Lead', commendations: { leadership: 20, friendly: 15, clutch: 27, teacher: 11 } },
        { name: 'Bravo_Breacher', elo: 2410, role: 'Demolitions', commendations: { leadership: 16, friendly: 14, clutch: 22, teacher: 9 } },
        { name: 'Phantom_Sniper', elo: 2380, role: 'Marksman', commendations: { leadership: 14, friendly: 12, clutch: 28, teacher: 8 } },
        { name: 'Shadow_Operative', elo: 2340, role: 'Infiltrator', commendations: { leadership: 17, friendly: 16, clutch: 21, teacher: 10 } },
        { name: 'Titan_Shield', elo: 2310, role: 'Juggernaut Frontline', commendations: { leadership: 19, friendly: 22, clutch: 19, teacher: 14 } },
        { name: 'Cobalt_Ranger', elo: 2280, role: 'Flank Specialist', commendations: { leadership: 13, friendly: 17, clutch: 18, teacher: 7 } },
        { name: 'Vector_Gunner', elo: 2240, role: 'Auto-Cannonner', commendations: { leadership: 12, friendly: 15, clutch: 17, teacher: 6 } },
        { name: 'Storm_Raider', elo: 2210, role: 'CQB Operative', commendations: { leadership: 14, friendly: 13, clutch: 16, teacher: 8 } },
        { name: 'Sentinel_Guard', elo: 2180, role: 'Defensive Tactician', commendations: { leadership: 16, friendly: 24, clutch: 15, teacher: 13 } },
        { name: 'Phoenix_Slayer', elo: 2140, role: 'Assault Wing', commendations: { leadership: 11, friendly: 14, clutch: 19, teacher: 5 } }
      ],
      'Counter-Strike 2': [
        { name: 'S1mple_Fragger', elo: 2650, role: 'AWPer / Sniper', commendations: { leadership: 26, friendly: 18, clutch: 35, teacher: 12 } },
        { name: 'ZywOo_Master', elo: 2620, role: 'Entry Fragger', commendations: { leadership: 24, friendly: 28, clutch: 31, teacher: 15 } },
        { name: 'NiKo_OneTap', elo: 2590, role: 'Rifler', commendations: { leadership: 21, friendly: 16, clutch: 29, teacher: 10 } },
        { name: 'm0NESY_God', elo: 2640, role: 'AWPer / Sniper', commendations: { leadership: 19, friendly: 22, clutch: 33, teacher: 8 } },
        { name: 'Ropz_Lurker', elo: 2590, role: 'Lurker / Anchor', commendations: { leadership: 20, friendly: 25, clutch: 30, teacher: 14 } },
        { name: 'B1t_Headshot', elo: 2480, role: 'Flex Specialist', commendations: { leadership: 15, friendly: 19, clutch: 24, teacher: 9 } },
        { name: 'Dev1ce_Tactician', elo: 2510, role: 'Support', commendations: { leadership: 25, friendly: 27, clutch: 26, teacher: 20 } },
        { name: 'Rain_EntryGod', elo: 2420, role: 'Entry Fragger', commendations: { leadership: 17, friendly: 21, clutch: 23, teacher: 11 } },
        { name: 'Broky_Clutcher', elo: 2550, role: 'AWPer', commendations: { leadership: 18, friendly: 20, clutch: 32, teacher: 10 } },
        { name: 'Karrigan_IGL', elo: 2450, role: 'In-Game Leader', commendations: { leadership: 35, friendly: 30, clutch: 20, teacher: 25 } }
      ],
      'Valorant': [
        { name: 'TenZ_Duelist', elo: 2680, role: 'Duelist / Jett', commendations: { leadership: 22, friendly: 28, clutch: 34, teacher: 16 } },
        { name: 'Boaster_IGL', elo: 2520, role: 'Controller / IGL', commendations: { leadership: 36, friendly: 35, clutch: 20, teacher: 28 } },
        { name: 'Chronicle_Flex', elo: 2590, role: 'Initiator', commendations: { leadership: 24, friendly: 21, clutch: 28, teacher: 14 } },
        { name: 'Aspas_Entry', elo: 2660, role: 'Duelist', commendations: { leadership: 20, friendly: 18, clutch: 32, teacher: 10 } },
        { name: 'Derke_Op', elo: 2580, role: 'Sentinel / Op', commendations: { leadership: 19, friendly: 22, clutch: 27, teacher: 12 } },
        { name: 'Boostio_Vanguard', elo: 2470, role: 'In-Game Leader', commendations: { leadership: 30, friendly: 25, clutch: 22, teacher: 20 } },
        { name: 'Less_Anchor', elo: 2540, role: 'Sentinel Anchor', commendations: { leadership: 18, friendly: 19, clutch: 29, teacher: 11 } },
        { name: 'demon1_Precision', elo: 2610, role: 'Duelist / Op', commendations: { leadership: 17, friendly: 16, clutch: 31, teacher: 8 } },
        { name: 'cauanzin_Initiator', elo: 2460, role: 'Initiator', commendations: { leadership: 16, friendly: 24, clutch: 21, teacher: 13 } },
        { name: 'Alfajer_Clutch', elo: 2550, role: 'Sentinel / Flex', commendations: { leadership: 18, friendly: 23, clutch: 30, teacher: 12 } }
      ],
      'Marvel Rivals': [
        { name: 'IronMan_Overclock', elo: 2610, role: 'Vanguard Specialist', commendations: { leadership: 27, friendly: 22, clutch: 26, teacher: 18 } },
        { name: 'Magneto_Shield', elo: 2580, role: 'Vanguard Anchor', commendations: { leadership: 25, friendly: 19, clutch: 24, teacher: 16 } },
        { name: 'SpiderMan_Web', elo: 2550, role: 'Duelist Dive', commendations: { leadership: 19, friendly: 30, clutch: 30, teacher: 14 } },
        { name: 'LunaSnow_Freeze', elo: 2530, role: 'Strategist Support', commendations: { leadership: 21, friendly: 33, clutch: 22, teacher: 20 } },
        { name: 'Hela_Executioner', elo: 2500, role: 'Duelist Marksman', commendations: { leadership: 16, friendly: 15, clutch: 28, teacher: 9 } },
        { name: 'Venom_Symbiote', elo: 2480, role: 'Vanguard Dive', commendations: { leadership: 18, friendly: 21, clutch: 25, teacher: 11 } },
        { name: 'Rocket_Blaster', elo: 2460, role: 'Strategist Tactician', commendations: { leadership: 24, friendly: 20, clutch: 23, teacher: 17 } },
        { name: 'Punisher_Gunfire', elo: 2430, role: 'Duelist Hitscan', commendations: { leadership: 15, friendly: 17, clutch: 26, teacher: 8 } },
        { name: 'Storm_Tempest', elo: 2410, role: 'Duelist Controller', commendations: { leadership: 22, friendly: 25, clutch: 21, teacher: 15 } },
        { name: 'Jeff_Landshark', elo: 2390, role: 'Strategist Flex', commendations: { leadership: 14, friendly: 35, clutch: 19, teacher: 12 } },
        { name: 'Loki_Trickster', elo: 2370, role: 'Strategist', commendations: { leadership: 20, friendly: 18, clutch: 24, teacher: 13 } },
        { name: 'Hulk_Smash', elo: 2350, role: 'Vanguard Brawler', commendations: { leadership: 17, friendly: 22, clutch: 22, teacher: 10 } }
      ],
      'Rocket League': [
        { name: 'Zen_Aerial', elo: 2650, role: 'Striker / First Man', commendations: { leadership: 25, friendly: 24, clutch: 35, teacher: 16 } },
        { name: 'Vatira_Goalie', elo: 2610, role: 'Third Man / Goalie', commendations: { leadership: 28, friendly: 20, clutch: 31, teacher: 15 } },
        { name: 'Monkey_M00n', elo: 2590, role: 'Midfield Maestro', commendations: { leadership: 31, friendly: 22, clutch: 29, teacher: 18 } },
        { name: 'BeastMode_AirDribble', elo: 2560, role: 'Striker', commendations: { leadership: 19, friendly: 23, clutch: 28, teacher: 12 } },
        { name: 'Firstkiller_Speed', elo: 2540, role: 'Disruptor / Flank', commendations: { leadership: 18, friendly: 19, clutch: 27, teacher: 10 } },
        { name: 'Daniel_Shadow', elo: 2520, role: 'Defensive Anchor', commendations: { leadership: 20, friendly: 26, clutch: 26, teacher: 14 } }
      ],
      'Slapshot: Rebound': [
        { name: 'Puck_Wizard', elo: 2580, role: 'Center Playmaker', commendations: { leadership: 26, friendly: 25, clutch: 32, teacher: 16 } },
        { name: 'Ice_Baron', elo: 2540, role: 'Defense Anchor', commendations: { leadership: 24, friendly: 21, clutch: 28, teacher: 14 } },
        { name: 'Snipe_Master', elo: 2510, role: 'Right Wing Fragger', commendations: { leadership: 18, friendly: 22, clutch: 29, teacher: 11 } },
        { name: 'Stick_Handler', elo: 2480, role: 'Left Wing Agility', commendations: { leadership: 19, friendly: 26, clutch: 25, teacher: 13 } },
        { name: 'Goalie_Wall', elo: 2460, role: 'Goaltender', commendations: { leadership: 22, friendly: 30, clutch: 27, teacher: 18 } },
        { name: 'Rebound_King', elo: 2420, role: 'Enforcer / Defense', commendations: { leadership: 17, friendly: 20, clutch: 24, teacher: 10 } }
      ],
      'Deadlock': [
        { name: 'Abrams_Brawler', elo: 2590, role: 'Frontline Bruiser', commendations: { leadership: 25, friendly: 22, clutch: 28, teacher: 14 } },
        { name: 'Vindicta_Sniper', elo: 2560, role: 'Long Range Carry', commendations: { leadership: 18, friendly: 19, clutch: 31, teacher: 11 } },
        { name: 'Infernus_Ignite', elo: 2530, role: 'Burn Specialist', commendations: { leadership: 20, friendly: 21, clutch: 26, teacher: 12 } },
        { name: 'LadyGeist_Vamp', elo: 2510, role: 'Midlane Control', commendations: { leadership: 22, friendly: 20, clutch: 27, teacher: 15 } },
        { name: 'Seven_Volt', elo: 2480, role: 'Lightning Hypercarry', commendations: { leadership: 19, friendly: 24, clutch: 25, teacher: 13 } },
        { name: 'Dynamo_BlackHole', elo: 2450, role: 'Support Initiator', commendations: { leadership: 27, friendly: 31, clutch: 23, teacher: 21 } },
        { name: 'Shiv_Dagger', elo: 2430, role: 'Assassin Executioner', commendations: { leadership: 16, friendly: 18, clutch: 29, teacher: 9 } },
        { name: 'Wraith_Cards', elo: 2400, role: 'DPS Carry', commendations: { leadership: 17, friendly: 22, clutch: 24, teacher: 10 } },
        { name: 'Warden_Enforcer', elo: 2380, role: 'Crowd Control Tank', commendations: { leadership: 24, friendly: 23, clutch: 22, teacher: 16 } },
        { name: 'Paradox_Carbine', elo: 2360, role: 'Swap Specialist', commendations: { leadership: 21, friendly: 20, clutch: 21, teacher: 14 } },
        { name: 'Pocket_Suitcase', elo: 2340, role: 'Elusive Flex', commendations: { leadership: 15, friendly: 25, clutch: 20, teacher: 12 } },
        { name: 'McGinnis_Turrets', elo: 2320, role: 'Lane Pusher / Siege', commendations: { leadership: 18, friendly: 27, clutch: 19, teacher: 15 } }
      ],
      'The Finals': [
        { name: 'Heavy_Sledge', elo: 2540, role: 'Heavy Demolition', commendations: { leadership: 24, friendly: 21, clutch: 28, teacher: 14 } },
        { name: 'Light_Dash', elo: 2510, role: 'Light Assassin', commendations: { leadership: 19, friendly: 22, clutch: 31, teacher: 11 } },
        { name: 'Medium_HealBeam', elo: 2480, role: 'Medium Support', commendations: { leadership: 28, friendly: 34, clutch: 24, teacher: 22 } },
        { name: 'Heavy_MeshShield', elo: 2450, role: 'Heavy Anchor', commendations: { leadership: 22, friendly: 25, clutch: 23, teacher: 16 } },
        { name: 'Medium_Turret', elo: 2420, role: 'Medium Tactician', commendations: { leadership: 21, friendly: 24, clutch: 22, teacher: 15 } },
        { name: 'Light_Cloak', elo: 2390, role: 'Light Flanker', commendations: { leadership: 17, friendly: 18, clutch: 27, teacher: 9 } }
      ],
      'Empulse': [
        { name: 'Neon_Glitch', elo: 2580, role: 'Railgun Striker', commendations: { leadership: 25, friendly: 22, clutch: 30, teacher: 15 } },
        { name: 'Cyber_Viper', elo: 2540, role: 'EMP Infiltrator', commendations: { leadership: 22, friendly: 20, clutch: 27, teacher: 13 } },
        { name: 'Pulse_Titan', elo: 2510, role: 'Heavy Overcharge', commendations: { leadership: 24, friendly: 23, clutch: 25, teacher: 16 } },
        { name: 'Zero_Latency', elo: 2470, role: 'Speedrun Flex', commendations: { leadership: 18, friendly: 25, clutch: 26, teacher: 12 } },
        { name: 'Matrix_Ghost', elo: 2440, role: 'Tactical Hacker', commendations: { leadership: 20, friendly: 21, clutch: 23, teacher: 14 } },
        { name: 'Kinetic_Volt', elo: 2410, role: 'Railgun Specialist', commendations: { leadership: 17, friendly: 19, clutch: 24, teacher: 10 } },
        { name: 'Overclock_Unit', elo: 2380, role: 'Defense Core', commendations: { leadership: 19, friendly: 24, clutch: 21, teacher: 15 } },
        { name: 'Hyper_Striker', elo: 2350, role: 'Rapid Assault', commendations: { leadership: 16, friendly: 20, clutch: 22, teacher: 9 } },
        { name: 'Echo_Phase', elo: 2320, role: 'Recon Anchor', commendations: { leadership: 18, friendly: 22, clutch: 20, teacher: 11 } },
        { name: 'Nexus_Prime', elo: 2290, role: 'Vanguard Leader', commendations: { leadership: 29, friendly: 28, clutch: 19, teacher: 22 } }
      ],
      'Arkheron': [
        { name: 'Archon_Prime', elo: 2610, role: 'Oblivion Vanguard', commendations: { leadership: 28, friendly: 22, clutch: 31, teacher: 18 } },
        { name: 'Void_Gladiator', elo: 2560, role: 'Core Breacher', commendations: { leadership: 23, friendly: 20, clutch: 28, teacher: 14 } },
        { name: 'Quantum_Spectre', elo: 2520, role: 'Phase Assassin', commendations: { leadership: 19, friendly: 19, clutch: 30, teacher: 11 } },
        { name: 'Chrono_Sentinel', elo: 2480, role: 'Time Controller', commendations: { leadership: 26, friendly: 25, clutch: 24, teacher: 19 } },
        { name: 'Nebula_Warrior', elo: 2440, role: 'Heavy Enforcer', commendations: { leadership: 21, friendly: 22, clutch: 25, teacher: 13 } },
        { name: 'Eclipse_Marksman', elo: 2410, role: 'Quantum Sniper', commendations: { leadership: 18, friendly: 18, clutch: 27, teacher: 10 } },
        { name: 'Celestial_Shield', elo: 2380, role: 'Defensive Bulwark', commendations: { leadership: 24, friendly: 29, clutch: 22, teacher: 17 } },
        { name: 'Astral_Striker', elo: 2350, role: 'Melee Berserker', commendations: { leadership: 17, friendly: 21, clutch: 23, teacher: 9 } },
        { name: 'Solaris_Paladin', elo: 2310, role: 'Core Support', commendations: { leadership: 22, friendly: 32, clutch: 20, teacher: 20 } },
        { name: 'Abyssal_Hunter', elo: 2280, role: 'Void Hunter', commendations: { leadership: 16, friendly: 19, clutch: 24, teacher: 8 } }
      ],
      'REMATCH': [
        { name: 'Rematch_King', elo: 2620, role: 'Flex Champion', commendations: { leadership: 27, friendly: 24, clutch: 32, teacher: 17 } },
        { name: 'Nitro_Drifter', elo: 2570, role: 'Speed Fragger', commendations: { leadership: 21, friendly: 22, clutch: 29, teacher: 13 } },
        { name: 'Apex_Viper', elo: 2530, role: 'Lurker / Anchor', commendations: { leadership: 23, friendly: 20, clutch: 27, teacher: 15 } },
        { name: 'SubZero_Clutch', elo: 2490, role: 'Tactical Support', commendations: { leadership: 19, friendly: 26, clutch: 30, teacher: 14 } },
        { name: 'Cyber_Knight', elo: 2450, role: 'Frontline Assault', commendations: { leadership: 25, friendly: 25, clutch: 23, teacher: 18 } },
        { name: 'Pulse_Cannon', elo: 2410, role: 'Heavy Gunner', commendations: { leadership: 17, friendly: 18, clutch: 24, teacher: 10 } },
        { name: 'Shadow_Strike', elo: 2380, role: 'Flank Breacher', commendations: { leadership: 18, friendly: 21, clutch: 25, teacher: 11 } },
        { name: 'Laser_Vision', elo: 2340, role: 'Sniper Marksman', commendations: { leadership: 16, friendly: 17, clutch: 28, teacher: 8 } },
        { name: 'Quantum_Leap', elo: 2310, role: 'Mobility Flex', commendations: { leadership: 20, friendly: 23, clutch: 21, teacher: 12 } },
        { name: 'Iron_Core', elo: 2270, role: 'Defensive Anchor', commendations: { leadership: 22, friendly: 27, clutch: 20, teacher: 16 } }
      ]
    };

    let matchedKey = Object.keys(defaultRosters).find(k => 
      gameTitle.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(gameTitle.toLowerCase())
    );
    let baseList = matchedKey ? defaultRosters[matchedKey].map(p => ({ ...p })) : defaultRosters['Counter-Strike 2'].map(p => ({ ...p }));

    // If active lobby has members, incorporate them
    const activeLobby = Array.isArray(this.lobbies) ? this.lobbies.find(l => l.title === this.currentDraftLobby) : null;
    if (activeLobby && Array.isArray(activeLobby.members) && activeLobby.members.length > 0) {
      const lobbyMembers = activeLobby.members.map(m => ({
        name: m.name,
        elo: m.elo || 2150,
        role: m.role || 'Competitor',
        commendations: { leadership: 20, friendly: 22, clutch: 24, teacher: 15 }
      }));
      baseList = [...lobbyMembers, ...baseList.filter(p => !lobbyMembers.some(lm => lm.name === p.name))];
    }

    // Ensure pool size satisfies targetCapacity
    let counter = 1;
    while (baseList.length < targetCapacity) {
      baseList.push({
        name: `Operative_${counter}_${gameTitle.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}`,
        elo: 2050 + Math.floor(Math.random() * 450),
        role: counter % 3 === 0 ? 'Assault / Fragger' : counter % 3 === 1 ? 'Tactical Support' : 'Anchor / Defense',
        commendations: {
          leadership: Math.floor(Math.random() * 20) + 5,
          friendly: Math.floor(Math.random() * 25) + 10,
          clutch: Math.floor(Math.random() * 30) + 10,
          teacher: Math.floor(Math.random() * 15) + 5
        }
      });
      counter++;
    }

    return baseList.slice(0, targetCapacity);
  }

  triggerLobbySnakeDraft(lobbyTitle, gameTitle) {
    this.currentDraftLobby = lobbyTitle;
    this.currentDraftGame = gameTitle || 'Counter-Strike 2';
    this.captainSelectionMode = 'highest_mmr';
    this.bannedMaps.clear();
    this.selectedMatchMap = null;
    this.passedFirstPick = false;
    this.isDraftSessionLockedIn = false;

    // Display locked game in draft session banner
    const lockedGameTitle = document.getElementById('draftLockedGameTitle');
    if (lockedGameTitle) {
      lockedGameTitle.textContent = this.currentDraftGame;
    }

    const titleEl = document.getElementById('draftGameTitle');
    if (titleEl) {
      titleEl.textContent = `🐍 ${this.currentDraftGame} — Competitive Draft Session`;
    }

    const statusLock = document.getElementById('draftSessionLockStatus');
    if (statusLock) {
      statusLock.textContent = '🔒 SESSION ACTIVE';
      statusLock.style.background = 'rgba(255, 77, 77, 0.15)';
      statusLock.style.color = '#ff4d4d';
      statusLock.style.borderColor = 'rgba(255, 77, 77, 0.4)';
    }

    const badgeA = document.getElementById('teamALockBadge');
    const badgeB = document.getElementById('teamBLockBadge');
    if (badgeA) {
      badgeA.textContent = '⏳ Ready to Lock';
      badgeA.style.background = 'rgba(255, 171, 0, 0.15)';
      badgeA.style.color = 'var(--accent-gold)';
    }
    if (badgeB) {
      badgeB.textContent = '⏳ Ready to Lock';
      badgeB.style.background = 'rgba(255, 171, 0, 0.15)';
      badgeB.style.color = 'var(--accent-gold)';
    }

    const btnConfirm = document.getElementById('btnConfirmDraftTeams');
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.textContent = '🔒 LOCK IN DRAFT';
      btnConfirm.style.background = 'linear-gradient(135deg, #00f2fe, #4facfe)';
    }

    const modal = document.getElementById('autoDraftModal');
    if (modal) modal.classList.add('active');

    this.runDraftSimulation();
    this.renderMapVetoGrid();
    this.startDraftSessionTimer(45);
  }

  startDraftSessionTimer(seconds = 45) {
    this.stopDraftSessionTimer();
    this.draftSecondsRemaining = seconds;
    const badge = document.getElementById('draftSessionTimerBadge');
    if (badge) {
      badge.textContent = `⏱️ ${this.draftSecondsRemaining}s Lock-In`;
      badge.style.color = 'var(--accent-cyan)';
      badge.style.borderColor = 'rgba(0, 242, 254, 0.35)';
      badge.style.background = 'rgba(0, 242, 254, 0.15)';
    }

    this.draftSessionTimerInterval = setInterval(() => {
      this.draftSecondsRemaining--;
      if (badge) {
        badge.textContent = `⏱️ ${this.draftSecondsRemaining}s Lock-In`;
        if (this.draftSecondsRemaining <= 10) {
          badge.style.color = '#ff4d4d';
          badge.style.borderColor = '#ff4d4d';
          badge.style.background = 'rgba(255, 77, 77, 0.2)';
        }
      }

      if (this.draftSecondsRemaining <= 0) {
        this.stopDraftSessionTimer();
        this.lockInDraftSession(true);
      }
    }, 1000);
  }

  stopDraftSessionTimer() {
    if (this.draftSessionTimerInterval) {
      clearInterval(this.draftSessionTimerInterval);
      this.draftSessionTimerInterval = null;
    }
  }

  lockInDraftSession(isAutoTimeout = false) {
    if (this.isDraftSessionLockedIn) return;
    this.isDraftSessionLockedIn = true;
    this.stopDraftSessionTimer();

    // Auto-pick final match map from pool if not manually selected
    if (!this.selectedMatchMap) {
      const maps = window.eloEngine.getGameMapPool(this.currentDraftGame) || [];
      const unbanned = maps.filter(m => !this.bannedMaps.has(m));
      this.selectedMatchMap = unbanned.length > 0 ? unbanned[0] : (maps[0] || 'Official Arena');
      this.renderMapVetoGrid();
    }

    const badgeA = document.getElementById('teamALockBadge');
    const badgeB = document.getElementById('teamBLockBadge');
    const statusLock = document.getElementById('draftSessionLockStatus');
    const btnConfirm = document.getElementById('btnConfirmDraftTeams');
    const timerBadge = document.getElementById('draftSessionTimerBadge');

    if (badgeA) {
      badgeA.textContent = '✔ LOCKED IN';
      badgeA.style.background = 'rgba(0, 230, 118, 0.2)';
      badgeA.style.color = 'var(--accent-green)';
    }
    if (badgeB) {
      badgeB.textContent = '✔ LOCKED IN';
      badgeB.style.background = 'rgba(0, 230, 118, 0.2)';
      badgeB.style.color = 'var(--accent-green)';
    }
    if (statusLock) {
      statusLock.textContent = '✔ DRAFT LOCKED';
      statusLock.style.background = 'rgba(0, 230, 118, 0.2)';
      statusLock.style.color = 'var(--accent-green)';
      statusLock.style.borderColor = 'var(--accent-green)';
    }
    if (timerBadge) {
      timerBadge.textContent = '✔ LOCKED';
      timerBadge.style.background = 'rgba(0, 230, 118, 0.2)';
      timerBadge.style.color = 'var(--accent-green)';
    }
    if (btnConfirm) {
      btnConfirm.disabled = true;
      btnConfirm.textContent = '✔ LOCKED IN — STARTING SCRIM...';
      btnConfirm.style.background = 'linear-gradient(135deg, #00e676, #00b0ff)';
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('match_found');
      if (typeof window.widgetBuilderEngine.showToast === 'function') {
        window.widgetBuilderEngine.showToast(`🔒 DRAFT LOCKED IN! All rosters confirmed for ${this.currentDraftGame}. Launching 128-tick node...`, 'success');
      }
    }

    setTimeout(() => {
      const modal = document.getElementById('autoDraftModal');
      if (modal) modal.classList.remove('active');
      this.launchFaceitMatchRoom(this.currentDraftLobby || this.currentDraftGame, this.currentDraftGame);
    }, 700);
  }

  attemptAbandonDraft() {
    const confirmed = confirm(`⚠️ DRAFT SESSION IN PROGRESS!\n\nYou must lock in your draft teams and map to begin the match.\n\nAbandoning now will cancel the session and register a forfeit penalty for your team. Are you sure you want to forfeit?`);
    if (confirmed) {
      this.stopDraftSessionTimer();
      const modal = document.getElementById('autoDraftModal');
      if (modal) modal.classList.remove('active');
      if (window.widgetBuilderEngine?.showToast) {
        window.widgetBuilderEngine.showToast('Draft session aborted.', 'warning');
      }
    }
  }

  onDraftGameSelectChange(gameTitle) {
    // Enforce locked draft session: Game cannot be changed
    if (this.currentDraftGame) {
      console.warn('Game is locked for this draft session and cannot be changed.');
      return;
    }
    this.currentDraftGame = gameTitle;
    const titleEl = document.getElementById('draftGameTitle');
    if (titleEl) {
      titleEl.textContent = `🐍 ${gameTitle} — Competitive Draft Session`;
    }
    this.bannedMaps.clear();
    this.selectedMatchMap = null;
    this.passedFirstPick = false;
    this.runDraftSimulation();
    this.renderMapVetoGrid();
  }

  triggerAutoDraftModal(gameTitle) {
    this.triggerLobbySnakeDraft(`${gameTitle} Competitive Scrim`, gameTitle);
  }

  passTurnToCaptain1() {
    this.passedFirstPick = true;
    this.runDraftSimulation();
    alert('⏩ TURN PASSED!\n\nCaptain #2 passed First Pick turn to Captain #1 (Highest MMR)! Captain #1 now has the first pick.');
  }

  runDraftSimulation() {
    this.captainSelectionMode = 'highest_mmr';
    const maxCap = window.eloEngine.getGameCapacity(this.currentDraftGame);
    
    // Get dedicated, filled roster pool specifically for this game
    const draftPool = this.getDraftPoolForGame(this.currentDraftGame, maxCap);
    const result = window.eloEngine.performCustomSnakeDraft(draftPool, this.passedFirstPick, 'highest_mmr');

    const capAEl = document.getElementById('captainAName');
    const capBEl = document.getElementById('captainBName');
    if (capAEl) {
      capAEl.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.3rem;">
          <div><span style="color: var(--accent-gold); font-weight: 800;">👑 Captain Alpha:</span> <strong style="color: #fff; font-size: 0.95rem;">${result.captain1.name}</strong> <span style="font-size: 0.7rem; color: var(--accent-gold); background: rgba(255,215,0,0.18); border: 1px solid rgba(255,215,0,0.4); padding: 1px 6px; border-radius: 4px; font-weight: 800;">AUTO-CAPTAIN (#1 MMR)</span></div>
          <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-gold);">${result.captain1.elo} MMR</span>
        </div>
      `;
    }
    if (capBEl) {
      capBEl.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.3rem;">
          <div><span style="color: var(--accent-gold); font-weight: 800;">👑 Captain Bravo:</span> <strong style="color: #fff; font-size: 0.95rem;">${result.captain2.name}</strong> <span style="font-size: 0.7rem; color: var(--accent-gold); background: rgba(255,215,0,0.18); border: 1px solid rgba(255,215,0,0.4); padding: 1px 6px; border-radius: 4px; font-weight: 800;">AUTO-CAPTAIN (#2 MMR)</span></div>
          <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-gold);">${result.captain2.elo} MMR</span>
        </div>
      `;
    }

    const tagCap = document.getElementById('draftRosterCapTag');
    if (tagCap) {
      tagCap.innerHTML = `Game: <strong style="color: var(--accent-gold);">${this.currentDraftGame}</strong> • Capacity: <strong style="color: var(--accent-cyan);">${maxCap} Players (${Math.floor(maxCap/2)}v${Math.floor(maxCap/2)})</strong>`;
    }

    const tagA = document.getElementById('teamACountTag');
    const tagB = document.getElementById('teamBCountTag');
    if (tagA) tagA.textContent = `${result.team1.length} Players`;
    if (tagB) tagB.textContent = `${result.team2.length} Players`;

    const teamAContainer = document.getElementById('teamAList');
    const teamBContainer = document.getElementById('teamBList');

    if (teamAContainer) {
      teamAContainer.innerHTML = result.team1.map((p, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: ${idx === 0 ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(0,242,254,0.12))' : 'rgba(0,242,254,0.08)'}; padding: 0.55rem 0.8rem; border-radius: 6px; margin-bottom: 0.4rem; font-size: 0.85rem; border: 1px solid ${idx === 0 ? 'var(--accent-gold)' : 'rgba(0,242,254,0.2)'};">
          <div>
            <span style="font-weight: 800; color: ${idx === 0 ? 'var(--accent-gold)' : '#fff'};">${idx === 0 ? '👑 ' : ''}${p.name}</span>
            ${idx === 0 ? `<span style="font-size: 0.68rem; background: rgba(255,215,0,0.22); color: var(--accent-gold); padding: 1px 5px; border-radius: 3px; font-weight: 800; margin-left: 0.35rem; border: 1px solid rgba(255,215,0,0.35);">AUTO-CAPTAIN (#1 MMR)</span>` : ''}
            ${p.role ? `<span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 0.35rem;">[${p.role}]</span>` : ''}
          </div>
          <div style="text-align: right;">
            <span style="color: var(--accent-gold); font-weight: 800;">${p.elo} MMR</span>
            <span style="font-size: 0.72rem; color: var(--accent-cyan); margin-left: 0.35rem;">${p.pickLabel || (idx === 0 ? 'Cap #1' : `Pick #${idx*2}`)}</span>
          </div>
        </div>
      `).join('');
    }

    if (teamBContainer) {
      teamBContainer.innerHTML = result.team2.map((p, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: ${idx === 0 ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(157,78,221,0.12))' : 'rgba(157,78,221,0.08)'}; padding: 0.55rem 0.8rem; border-radius: 6px; margin-bottom: 0.4rem; font-size: 0.85rem; border: 1px solid ${idx === 0 ? 'var(--accent-gold)' : 'rgba(157,78,221,0.2)'};">
          <div>
            <span style="font-weight: 800; color: ${idx === 0 ? 'var(--accent-gold)' : '#fff'};">${idx === 0 ? '👑 ' : ''}${p.name}</span>
            ${idx === 0 ? `<span style="font-size: 0.68rem; background: rgba(255,215,0,0.22); color: var(--accent-gold); padding: 1px 5px; border-radius: 3px; font-weight: 800; margin-left: 0.35rem; border: 1px solid rgba(255,215,0,0.35);">AUTO-CAPTAIN (#2 MMR)</span>` : ''}
            ${p.role ? `<span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 0.35rem;">[${p.role}]</span>` : ''}
          </div>
          <div style="text-align: right;">
            <span style="color: var(--accent-gold); font-weight: 800;">${p.elo} MMR</span>
            <span style="font-size: 0.72rem; color: var(--accent-purple); margin-left: 0.35rem;">${p.pickLabel || (idx === 0 ? 'Cap #2' : `Pick #${idx*2-1}`)}</span>
          </div>
        </div>
      `).join('');
    }

    const summaryEl = document.getElementById('draftMMRSummary');
    if (summaryEl) {
      summaryEl.innerHTML = `👑 <strong>Auto-Captains Assigned to Top 2 MMRs:</strong> 🔵 Team Alpha: <strong>${result.captain1.name} (${result.captain1.elo} MMR)</strong> | 🔴 Team Bravo: <strong>${result.captain2.name} (${result.captain2.elo} MMR)</strong><br>🐍 <strong>Snake Pick Order (1-2-2-1)</strong> | Game: <strong style="color: var(--accent-cyan);">${this.currentDraftGame}</strong> (${maxCap} Players) | First Pick: <strong>${result.firstPickOwner}</strong><br>🔵 Team Alpha Avg: <strong>${result.avgMMR1} MMR</strong> | 🔴 Team Bravo Avg: <strong>${result.avgMMR2} MMR</strong> | MMR Delta: <strong>${result.mmrDelta} MMR (Fair Match)</strong>`;
    }
  }

  setupAutoDraftHandlers() {
    const btnClose = document.getElementById('btnCloseAutoDraftModal');
    const btnReDraft = document.getElementById('btnReDraftTeams');
    const btnConfirmDraft = document.getElementById('btnConfirmDraftTeams');

    if (btnClose) {
      btnClose.addEventListener('click', () => this.attemptAbandonDraft());
    }
    if (btnReDraft) {
      btnReDraft.addEventListener('click', () => {
        if (this.isDraftSessionLockedIn) return;
        this.runDraftSimulation();
      });
    }

    if (btnConfirmDraft) {
      btnConfirmDraft.addEventListener('click', () => {
        this.lockInDraftSession();
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

            const queueGame = this.selectedLeaderboardGame || 'Counter-Strike 2';
            this.triggerLobbySnakeDraft(`Matchmaking Scrim (${queueGame})`, queueGame);
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

  setupLeaderboardHandlers() {
    const gameSelect = document.getElementById('leaderboardGameFilter');
    const regionSelect = document.getElementById('leaderboardRegionFilter');
    const searchInput = document.getElementById('leaderboardSearchInput');
    const modalPassport = document.getElementById('playerPassportModal');
    const btnClosePassport = document.getElementById('btnClosePassportModal');

    if (gameSelect) {
      gameSelect.addEventListener('change', (e) => {
        this.selectedLeaderboardGame = e.target.value;
        this.renderLeaderboardGameTabs();
        this.renderLeaderboard();
      });
    }

    if (regionSelect) {
      regionSelect.addEventListener('change', (e) => {
        this.selectedLeaderboardRegion = e.target.value;
        this.renderLeaderboard();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.leaderboardSearchQuery = e.target.value.toLowerCase().trim();
        this.renderLeaderboard();
      });
    }

    if (btnClosePassport && modalPassport) {
      btnClosePassport.addEventListener('click', () => {
        modalPassport.classList.remove('active');
      });
    }

    this.renderLeaderboardGameTabs();
  }

  renderLeaderboardGameTabs() {
    const container = document.getElementById('leaderboardGameTabsBar');
    if (!container) return;

    const gamesList = [
      'Counter-Strike 2',
      'REMATCH',
      'Arkheron',
      'Valorant',
      'Marvel Rivals',
      'Deadlock',
      'The Finals',
      'Slapshot: Rebound',
      'Rocket League',
      'Dota 2',
      'Rainbow Six Siege'
    ];

    container.innerHTML = gamesList.map(g => {
      const active = this.selectedLeaderboardGame === g;
      return `
        <button class="btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setLeaderboardGame('${g}')" style="white-space: nowrap;">
          <span>${active ? '👑' : '🎮'}</span> ${g}
        </button>
      `;
    }).join('');
  }

  setLeaderboardGame(gameName) {
    this.selectedLeaderboardGame = gameName;
    const gameSelect = document.getElementById('leaderboardGameFilter');
    if (gameSelect) gameSelect.value = gameName;
    this.renderLeaderboardGameTabs();
    this.renderLeaderboard();
  }

  renderLeaderboard() {
    const tbody = document.getElementById('leaderboardTableBody');
    if (!tbody) return;

    const targetGame = this.selectedLeaderboardGame === 'all' ? 'Counter-Strike 2' : this.selectedLeaderboardGame;

    let players = this.leaderboardData.map(p => {
      const gStats = (p.games && p.games[targetGame]) || { elo: 1500, wins: 20, losses: 15, winRate: 57.1, kd: '1.20', mvp: 5 };
      return {
        ...p,
        targetElo: gStats.elo,
        gStats
      };
    });

    // Sort descending by ELO/MMR rating for the active game
    players.sort((a, b) => b.targetElo - a.targetElo);

    // Apply Region Filter
    if (this.selectedLeaderboardRegion !== 'all') {
      players = players.filter(p => p.region.toLowerCase() === this.selectedLeaderboardRegion.toLowerCase());
    }

    // Apply Search Query Filter
    if (this.leaderboardSearchQuery) {
      players = players.filter(p => p.name.toLowerCase().includes(this.leaderboardSearchQuery));
    }

    if (players.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No players found matching current search/filter for ${targetGame}.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = players.map((p, idx) => {
      const tier = window.eloEngine.getGameSpecificRank(targetGame, p.targetElo);
      const winPct = p.gStats.winRate;
      const rankBadge = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `#${idx + 1}`;
      const rankBg = idx === 0 ? 'background: rgba(255, 215, 0, 0.2); color: var(--accent-gold); border: 1px solid var(--accent-gold);' : idx === 1 ? 'background: rgba(192, 192, 192, 0.2); color: #c0c0c0; border: 1px solid #c0c0c0;' : idx === 2 ? 'background: rgba(205, 127, 50, 0.2); color: #cd7f32; border: 1px solid #cd7f32;' : 'background: rgba(255,255,255,0.05); color: var(--text-muted);';

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 0.8rem;">
            <span class="lobby-game-tag" style="${rankBg} font-weight: 900;">${rankBadge}</span>
          </td>
          <td style="padding: 0.8rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #00f2fe, #ff007f); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem;">${p.avatar || '👑'}</div>
              <div>
                <div style="font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
                  <span>${p.name}</span>
                  <span style="font-size: 0.75rem; opacity: 0.7;">[${p.region}]</span>
                </div>
                <div style="display: flex; gap: 0.3rem; margin-top: 0.15rem;">
                  <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green); font-size: 0.68rem;">🛡️ Guardian Verified</span>
                  <span class="lobby-game-tag" style="background: rgba(255, 215, 0, 0.12); color: var(--accent-gold); font-size: 0.68rem;" title="Player Reputation Karma">👍 +${(p.commendations ? p.commendations.leadership + p.commendations.friendly + p.commendations.clutch + p.commendations.teacher : 40)} / 👎 -${(p.badRemarks ? p.badRemarks.toxic + p.badRemarks.afk + p.badRemarks.griefing + p.badRemarks.suspected : 0)}</span>
                </div>
              </div>
            </div>
          </td>
          <td style="padding: 0.8rem;">
            <span style="color: ${tier.color}; font-weight: 800; display: flex; align-items: center; gap: 0.3rem;">
              ${tier.badge || tier.name}
            </span>
          </td>
          <td style="padding: 0.8rem;">
            <strong style="color: var(--accent-gold); font-size: 0.95rem;">${p.targetElo} ELO</strong>
          </td>
          <td style="padding: 0.8rem; font-size: 0.88rem;">${p.gStats.wins}W / ${p.gStats.losses}L</td>
          <td style="padding: 0.8rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <strong style="color: var(--accent-green);">${winPct}%</strong>
              <div style="width: 45px; height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                <div style="width: ${winPct}%; height: 100%; background: var(--accent-green);"></div>
              </div>
            </div>
          </td>
          <td style="padding: 0.8rem; font-size: 0.85rem;">
            <div style="font-weight: 700; color: var(--accent-cyan);">K/D: ${p.gStats.kd}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${p.gStats.mvp} MVPs</div>
          </td>
          <td style="padding: 0.8rem; text-align: right;">
            <div style="display: flex; gap: 0.3rem; justify-content: flex-end; flex-wrap: wrap;">
              <button class="btn btn-success btn-sm" style="font-size: 0.72rem; padding: 0.25rem 0.5rem; background: rgba(0, 230, 118, 0.15); border-color: rgba(0, 230, 118, 0.4); color: var(--accent-green);" onclick="window.app.awardPlayerHonor('${p.name}', 'friendly')" title="Award Commendation & +25 Honor XP">
                ⭐ Commend
              </button>
              <button class="btn btn-danger btn-sm" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="window.app.flagPlayerMisconduct('${p.name}', 'toxic')" title="Flag Misconduct / Toxicity to Guardian AC">
                🚩 Flag
              </button>
              <button class="btn btn-purple btn-sm" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="window.app.openPlayerPassportModal('${p.name}')" title="View Full Gamer Passport & Stats">
                🪪 Passport
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openPlayerPassportModal(playerName) {
    const modal = document.getElementById('playerPassportModal');
    if (!modal) return;

    this.activePassportPlayer = playerName;
    const p = this.leaderboardData.find(user => user.name === playerName) || this.leaderboardData[0];

    document.getElementById('passportAvatar').textContent = p.avatar || '👑';
    document.getElementById('passportName').textContent = p.name;
    document.getElementById('passportPrimaryRank').textContent = `${p.region} Region • ${p.targetElo || 1840} Rating`;

    const passportHonorBadge = document.getElementById('passportHonorBadge');
    if (passportHonorBadge) {
      const hTier = window.eloEngine.getHonorTier(p.honorPoints || 120);
      passportHonorBadge.textContent = `${hTier.badge}: ${hTier.name}`;
      passportHonorBadge.style.color = hTier.color;
      passportHonorBadge.style.borderColor = hTier.color;
    }

    // Per-game ranks grid
    const gamesContainer = document.getElementById('passportGamesGrid');
    if (gamesContainer && p.games) {
      gamesContainer.innerHTML = Object.entries(p.games).map(([gName, gStat]) => {
        const rInfo = window.eloEngine.getGameSpecificRank(gName, gStat.elo);
        return `
          <div style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="font-weight: 800; color: var(--accent-cyan); font-size: 0.8rem;">${gName}</div>
            <div style="font-weight: 800; color: ${rInfo.color}; margin: 0.2rem 0;">${rInfo.badge} (${gStat.elo} ELO)</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${gStat.wins}W / ${gStat.losses}L • Win Rate: ${gStat.winRate}%</div>
          </div>
        `;
      }).join('');
    }

    // Commendations & Bad Remarks calculations
    const commends = p.commendations || { leadership: 15, friendly: 22, clutch: 28, teacher: 10 };
    const remarks = p.badRemarks || { toxic: 1, afk: 0, griefing: 0, suspected: 0 };

    const totalCommends = (commends.leadership || 0) + (commends.friendly || 0) + (commends.clutch || 0) + (commends.teacher || 0);
    const totalRemarks = (remarks.toxic || 0) + (remarks.afk || 0) + (remarks.griefing || 0) + (remarks.suspected || 0);
    const karmaPct = Math.round((totalCommends / (totalCommends + totalRemarks || 1)) * 100);

    const karmaBadge = document.getElementById('passportKarmaBadge');
    if (karmaBadge) {
      if (totalRemarks > 5) {
        karmaBadge.style.background = 'rgba(255, 82, 82, 0.2)';
        karmaBadge.style.color = 'var(--accent-red)';
        karmaBadge.textContent = `⚠️ Warning Karma (${karmaPct}% Positivity)`;
      } else {
        karmaBadge.style.background = 'rgba(0, 230, 118, 0.2)';
        karmaBadge.style.color = 'var(--accent-green)';
        karmaBadge.textContent = `👍 ${karmaPct}% Positive Karma`;
      }
    }

    const totalCommendsEl = document.getElementById('passportTotalCommends');
    if (totalCommendsEl) totalCommendsEl.textContent = `+${totalCommends}`;

    const totalRemarksEl = document.getElementById('passportTotalRemarks');
    if (totalRemarksEl) totalRemarksEl.textContent = `-${totalRemarks}`;

    const commendsGrid = document.getElementById('passportCommendsGrid');
    if (commendsGrid) {
      commendsGrid.innerHTML = `
        <div>🧠 Leadership: <strong style="color: var(--accent-green);">${commends.leadership || 0}</strong></div>
        <div>🎯 Friendly: <strong style="color: var(--accent-green);">${commends.friendly || 0}</strong></div>
        <div>⚡ Clutch: <strong style="color: var(--accent-green);">${commends.clutch || 0}</strong></div>
        <div>🎓 Helpful: <strong style="color: var(--accent-green);">${commends.teacher || 0}</strong></div>
      `;
    }

    const remarksGrid = document.getElementById('passportRemarksGrid');
    if (remarksGrid) {
      remarksGrid.innerHTML = `
        <div>☣️ Toxic: <strong style="color: var(--accent-red);">${remarks.toxic || 0}</strong></div>
        <div>🏃 AFK/Leaver: <strong style="color: var(--accent-red);">${remarks.afk || 0}</strong></div>
        <div>🛑 Griefing: <strong style="color: var(--accent-red);">${remarks.griefing || 0}</strong></div>
        <div>⚠️ Suspected: <strong style="color: var(--accent-red);">${remarks.suspected || 0}</strong></div>
      `;
    }

    const linkedContainer = document.getElementById('passportLinkedAccounts');
    if (linkedContainer) {
      const steamLink = p.steamId ? `<a href="https://steamcommunity.com/profiles/${p.steamId}" target="_blank" rel="noopener" style="color: var(--accent-cyan); text-decoration: underline; font-weight: 700;">🎮 ${p.steamId}</a>` : '<span style="color: var(--text-dim);">Not Linked</span>';
      const riotLink = p.riotId ? `<a href="https://tracker.gg/valorant/profile/riot/${encodeURIComponent(p.riotId)}/overview" target="_blank" rel="noopener" style="color: var(--accent-gold); text-decoration: underline; font-weight: 700;">🔴 ${p.riotId}</a>` : '<span style="color: var(--text-dim);">Not Linked</span>';
      const discordLink = p.discord ? `<a href="https://discord.gg/customlobbies" target="_blank" rel="noopener" style="color: var(--accent-purple); text-decoration: underline; font-weight: 700;">💬 ${p.discord}</a>` : '<span style="color: var(--text-dim);">Not Linked</span>';
      const twitchLink = p.twitch ? `<a href="https://${p.twitch.replace('https://', '')}" target="_blank" rel="noopener" style="color: var(--accent-green); text-decoration: underline; font-weight: 700;">📺 ${p.twitch}</a>` : '<span style="color: var(--text-dim);">Not Linked</span>';

      linkedContainer.innerHTML = `
        <div style="margin-bottom: 0.3rem;"><span style="color: var(--text-muted);">Steam Community:</span> ${steamLink}</div>
        <div style="margin-bottom: 0.3rem;"><span style="color: var(--text-muted);">Riot ID Tracker:</span> ${riotLink}</div>
        <div style="margin-bottom: 0.3rem;"><span style="color: var(--text-muted);">Discord Community:</span> ${discordLink}</div>
        <div><span style="color: var(--text-muted);">Twitch Stream:</span> ${twitchLink}</div>
      `;
    }

    // Written remarks & endorsements wall feed
    const remarksFeed = document.getElementById('passportRemarksFeed');
    if (remarksFeed) {
      const comments = p.writtenRemarks || [
        { id: 1, author: 'Valkyrie_CS', text: 'Insane clutch player! Always stays calm in 1v3 situations and calls great site retakes.', type: 'positive', date: '2 hours ago' },
        { id: 2, author: 'ApexGod99', text: 'Awesome IGL shotcaller, great communication on Discord voice channel!', type: 'positive', date: '1 day ago' }
      ];

      remarksFeed.innerHTML = comments.map(c => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 0.5rem 0.7rem; border-radius: 6px; font-size: 0.82rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
            <strong style="color: var(--accent-cyan);">${c.author}</strong>
            <span style="font-size: 0.75rem; color: var(--text-dim);">${c.date}</span>
          </div>
          <p style="margin: 0; color: var(--text-main); font-size: 0.8rem;">${c.text}</p>
        </div>
      `).join('');
    }

    // Render Player Recent Match History
    const historyContainer = document.getElementById('passportMatchHistoryList');
    if (historyContainer) {
      const matchHistory = p.matchHistory || [
        { id: 101, game: 'Counter-Strike 2', map: 'de_mirage', mode: '5v5 FACEIT Premier', score: '13 - 9', result: 'WIN', eloChange: '+26 ELO', kd: '22 / 11 / 7', hs: '64%', mvp: '👑 MVP' },
        { id: 102, game: 'Empulse', map: 'Empulse Facility', mode: '5v5 Cyber Arena', score: '16 - 12', result: 'WIN', eloChange: '+24 ELO', kd: '25 / 10 / 8', hs: '72%', mvp: '⚡ MVP' },
        { id: 103, game: 'REMATCH', map: 'Nexus Arena', mode: '5v5 Champion Scrim', score: '13 - 11', result: 'WIN', eloChange: '+28 ELO', kd: '28 / 14 / 6', hs: '68%', mvp: '👑 MVP' },
        { id: 104, game: 'Valorant', map: 'Ascent', mode: '5v5 Radiant Scrim', score: '11 - 13', result: 'LOSS', eloChange: '-16 ELO', kd: '17 / 15 / 4', hs: '58%', mvp: '🎯 Top Fragger' }
      ];

      historyContainer.innerHTML = matchHistory.map(m => `
        <div class="match-history-card ${m.result === 'WIN' ? 'match-result-win' : 'match-result-loss'}">
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <span class="${m.result === 'WIN' ? 'badge-win' : 'badge-loss'}">${m.result} (${m.score})</span>
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">${m.game} • ${m.map}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${m.mode} • Performance: ${m.mvp}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-size: 0.85rem; color: var(--accent-gold);">${m.kd} (${m.hs} HS)</div>
            <div style="font-size: 0.78rem; font-weight: 800; color: ${m.result === 'WIN' ? 'var(--accent-green)' : 'var(--accent-red)'};">${m.eloChange}</div>
          </div>
        </div>
      `).join('');
    }

    modal.classList.add('active');
  }

  triggerMatchFoundModal(serverName = 'Counter-Strike 2 • 5v5 Premier Scrim (de_mirage)') {
    const modal = document.getElementById('matchFoundModal');
    if (!modal) return;

    const label = document.getElementById('matchFoundServerName');
    if (label) label.textContent = serverName;

    const btn = document.getElementById('btnAcceptMatchAction');
    if (btn) {
      btn.classList.remove('accepted');
      btn.innerHTML = '<span>✔ ACCEPT MATCH</span>';
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('match_found');
    }

    modal.classList.add('active');
  }

  acceptMatch() {
    const btn = document.getElementById('btnAcceptMatchAction');
    if (btn) {
      btn.classList.add('accepted');
      if (this.cs2MatchCode) {
          btn.innerHTML = `<span>✔ ACCEPTED! JOIN CS2 LOBBY CODE: ${this.cs2MatchCode}</span>`;
      } else {
          btn.innerHTML = '<span>✔ MATCH ACCEPTED! CONNECTING TO SERVER...</span>';
      }
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('accept_match');
    }

    setTimeout(() => {
      const modal = document.getElementById('matchFoundModal');
      if (modal) modal.classList.remove('active');
      
      const game = this.currentDraftGame || 'Counter-Strike 2';
      const serverIp = this.currentMatchServerIp || this.cs2MatchCode || (game === 'Helix Game' || game === 'Pacifica' ? '127.0.0.1:7777' : '192.168.1.85:27015');

      this.launchServerProtocol({
        serverIp: serverIp,
        matchCode: this.cs2MatchCode,
        game: game,
        map: this.selectedMatchMap || 'Competitive',
        title: this.currentMatchRoomTitle || `${game} Premier Match`
      });

      // Automatically launch post-game honor screen after match concludes
      setTimeout(() => {
        this.openPostGameHonorModal(this.currentMatchRoomTitle || `${game} Premier Scrim`);
      }, 3500);
    }, 1200);
  }

  postWrittenProfileRemark() {
    const input = document.getElementById('passportNewRemarkInput');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    const targetName = this.activePassportPlayer || 'RadiantReaper';
    const p = this.leaderboardData.find(user => user.name === targetName);

    if (p) {
      if (!p.writtenRemarks) {
        p.writtenRemarks = [
          { id: 1, author: 'Valkyrie_CS', text: 'Insane clutch player! Always stays calm in 1v3 situations and calls great site retakes.', type: 'positive', date: '2 hours ago' },
          { id: 2, author: 'ApexGod99', text: 'Awesome IGL shotcaller, great communication on Discord voice channel!', type: 'positive', date: '1 day ago' }
        ];
      }

      p.writtenRemarks.unshift({
        id: Date.now(),
        author: 'You (Host)',
        text: text,
        type: 'positive',
        date: 'Just now'
      });

      if (!p.commendations) p.commendations = { leadership: 10, friendly: 10, clutch: 10, teacher: 5 };
      p.commendations.friendly = (p.commendations.friendly || 0) + 1;

      input.value = '';

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
      }

      this.openPlayerPassportModal(targetName);
      alert(`💬 REMARK POSTED!\n\nYour remark was published live to ${p.name}'s profile wall!`);
    }
  }

  triggerCommendPlayer(type) {
    const targetName = this.activePassportPlayer || 'RadiantReaper';
    const p = this.leaderboardData.find(user => user.name === targetName);

    if (p) {
      if (!p.commendations) {
        p.commendations = { leadership: 10, friendly: 10, clutch: 10, teacher: 5 };
      }
      p.commendations[type] = (p.commendations[type] || 0) + 1;

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
      }

      this.openPlayerPassportModal(targetName);
      this.renderLeaderboard();

      const titles = {
        leadership: '🧠 Leadership & Shotcalling',
        friendly: '🎯 Sportsmanship & Friendly Teammate',
        clutch: '⚡ Clutch Player & Aim Skill',
        teacher: '🎓 Helpful Teacher & Guide'
      };

      alert(`⭐ PLAYER COMMENDED!\n\nYou awarded +1 Commendation for "${titles[type]}" to ${p.name}!`);
    }
  }

  triggerBadRemarkPlayer() {
    const targetName = this.activePassportPlayer || 'RadiantReaper';
    const p = this.leaderboardData.find(user => user.name === targetName);

    if (p) {
      const reason = prompt(`⚠️ REPORT MISCONDUCT FOR ${p.name}:\n\nChoose category code:\n1 - ☣️ Toxic / Verbal Abuse\n2 - 🏃 AFK / Match Leaver\n3 - 🛑 Griefing / Team Flash\n4 - ⚠️ Suspected Cheating\n\nEnter number (1-4):`, '1');

      if (!reason) return;

      if (!p.badRemarks) {
        p.badRemarks = { toxic: 0, afk: 0, griefing: 0, suspected: 0 };
      }

      let category = 'toxic';
      let label = 'Toxic Behavior';

      if (reason === '2') { category = 'afk'; label = 'AFK / Leaver'; }
      else if (reason === '3') { category = 'griefing'; label = 'Griefing'; }
      else if (reason === '4') { category = 'suspected'; label = 'Suspected Cheater'; }

      p.badRemarks[category] = (p.badRemarks[category] || 0) + 1;

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('hitmarker');
      }

      this.openPlayerPassportModal(targetName);
      this.renderLeaderboard();

      alert(`🛑 REPORT SUBMITTED!\n\nBad remark logged for ${p.name} (${label}). Sent to Guardian Anti-Cheat Moderators for review.`);
    }
  }

  // --- POST-GAME HONOR & PLAYER FLAGGING SYSTEM ---
  openPostGameHonorModal(lobbyTitle = 'CS2 Premier 5v5 Scrim') {
    const modal = document.getElementById('postGameHonorModal');
    if (!modal) return;

    const rosterContainer = document.getElementById('postGameHonorRosterContainer');
    if (rosterContainer) {
      const players = this.leaderboardData.slice(0, 8);
      rosterContainer.innerHTML = players.map(p => {
        const hTier = window.eloEngine.getHonorTier(p.honorPoints || 120);
        const flagStatus = p.standing || '🟢 Clean Standing';
        return `
          <div style="background: rgba(0, 0, 0, 0.4); padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <div style="font-size: 1.4rem;">${p.avatar || '🎮'}</div>
              <div>
                <div style="font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span>${p.name}</span>
                  <span class="lobby-game-tag" style="background: rgba(255, 215, 0, 0.15); color: ${hTier.color}; font-size: 0.7rem; padding: 0.1rem 0.4rem; border: 1px solid ${hTier.color};">${hTier.badge}</span>
                  <span class="lobby-game-tag" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); font-size: 0.7rem; padding: 0.1rem 0.4rem;">${flagStatus}</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${p.region} • ${p.targetElo || 1840} ELO • Honor XP: ${p.honorPoints || 120}</div>
              </div>
            </div>

            <!-- Action Buttons: Honor Commendations vs Flags -->
            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.35rem 0.6rem; background: rgba(0, 230, 118, 0.15); border-color: rgba(0, 230, 118, 0.4); color: var(--accent-green);" onclick="window.app.awardPlayerHonor('${p.name}', 'leadership')" title="Commend Leadership & Shotcalling">
                🧠 Shotcaller (+Honor)
              </button>
              <button class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.35rem 0.6rem; background: rgba(0, 242, 254, 0.15); border-color: rgba(0, 242, 254, 0.4); color: var(--accent-cyan);" onclick="window.app.awardPlayerHonor('${p.name}', 'friendly')" title="Commend Sportsmanship">
                🤝 Friendly (+Honor)
              </button>
              <button class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.35rem 0.6rem; background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.4); color: var(--accent-purple);" onclick="window.app.awardPlayerHonor('${p.name}', 'clutch')" title="Commend Clutch Aim Skill">
                💥 Clutch (+Honor)
              </button>
              <button class="btn btn-danger btn-sm" style="font-size: 0.72rem; padding: 0.35rem 0.6rem;" onclick="window.app.flagPlayerMisconduct('${p.name}', 'toxic')" title="Flag Misconduct / Toxicity / Cheating">
                🚩 Flag Misconduct
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    modal.classList.add('active');
  }

  awardPlayerHonor(playerName, honorType) {
    const p = this.leaderboardData.find(user => user.name === playerName);
    if (!p) return;

    if (!p.honorPoints) p.honorPoints = 40;
    p.honorPoints += 25;

    if (!p.commendations) p.commendations = { leadership: 10, friendly: 10, clutch: 10, teacher: 5 };
    p.commendations[honorType] = (p.commendations[honorType] || 0) + 1;

    const hTier = window.eloEngine.getHonorTier(p.honorPoints);

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    if (window.firebaseGoogleEngine && typeof window.firebaseGoogleEngine.speakTextAlert === 'function') {
      window.firebaseGoogleEngine.speakTextAlert(`Honor awarded to ${p.name}`);
    }

    this.saveState();
    this.renderLeaderboard();
    this.openPostGameHonorModal();

    alert(`🌟 HONOR AWARDED TO ${p.name.toUpperCase()}!\n\n+25 Honor XP granted!\nPlayer Honor Standing: ${hTier.badge}\nSaved to Profile Database!`);
  }

  flagPlayerMisconduct(playerName, flagCategory) {
    const p = this.leaderboardData.find(user => user.name === playerName);
    if (!p) return;

    const reason = prompt(`🚩 FLAG MISCONDUCT FOR ${p.name}:\n\nSelect reason category:\n1 - ☣️ Toxic Chat / Voice\n2 - 🏃 AFK / Abandon Match\n3 - 💥 Griefing / Team Damage\n4 - 🛡️ Suspected Cheating (Ring 0 Telemetry Flag)\n\nEnter choice (1-4):`, '1');
    if (!reason) return;

    if (!p.badRemarks) p.badRemarks = { toxic: 0, afk: 0, griefing: 0, suspected: 0 };
    if (!p.flagCount) p.flagCount = 0;

    let catKey = 'toxic';
    let label = 'Toxic Behavior';

    if (reason === '2') { catKey = 'afk'; label = 'AFK / Abandon'; }
    else if (reason === '3') { catKey = 'griefing'; label = 'Griefing'; }
    else if (reason === '4') { catKey = 'suspected'; label = 'Suspected AC Violation'; }

    p.badRemarks[catKey] = (p.badRemarks[catKey] || 0) + 1;
    p.flagCount += 1;
    p.standing = p.flagCount > 3 ? '🔴 Under AC Audit' : '🟡 Caution Flagged';

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('hitmarker');
    }

    this.saveState();
    this.renderLeaderboard();
    this.openPostGameHonorModal();

    alert(`🚩 PLAYER FLAGGED!\n\nMisconduct flag logged for ${p.name} (${label}).\nAccount Standing: ${p.standing}.\nDispatched to Guardian Anti-Cheat Moderators.`);
  }

  // --- GUARDIAN KERNEL ANTI-CHEAT ENGINE ---
  openAntiCheatModal() {
    const modal = document.getElementById('antiCheatControlModal');
    if (modal) modal.classList.add('active');
  }

  closeAntiCheatModal() {
    const modal = document.getElementById('antiCheatControlModal');
    if (modal) modal.classList.remove('active');
  }

  runAntiCheatScan() {
    const progressBox = document.getElementById('acScanProgressBox');
    const progressBar = document.getElementById('acScanBar');
    const progressText = document.getElementById('acScanText');

    if (!progressBox || !progressBar || !progressText) return;

    progressBox.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.innerText = '🛡️ Initializing Ring 0 Kernel Process Scanner...';

    setTimeout(() => {
      progressBar.style.width = '45%';
      progressText.innerText = '🔍 Scanning process memory space & verifying checksums...';
    }, 500);

    setTimeout(() => {
      progressBar.style.width = '85%';
      progressText.innerText = '🔒 Verifying 128-Tick dedicated server encryption keys...';
    }, 1100);

    setTimeout(() => {
      progressBar.style.width = '100%';
      progressText.innerText = '✅ SCAN COMPLETE: 0 Integrity Violations Found!';

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('success');
      }

      setTimeout(() => {
        progressBox.style.display = 'none';
        alert('🛡️ GUARDIAN KERNEL SCAN PASSED!\n\nSystem status: 100% Clean & Ring 0 Integrity Verified.\nYour account maintains Full Anti-Cheat Verification Badge.');
      }, 400);
    }, 1800);
  }

  // --- WEBSITE AUTO-JOIN SYSTEM ---
  toggleAutoJoinSystem() {
    this.isAutoJoinActive = !this.isAutoJoinActive;
    const btn = document.getElementById('btnToggleAutoJoin');
    const card = document.getElementById('autoJoinStatusCard');
    const statusText = document.getElementById('autoJoinStatusText');

    if (this.isAutoJoinActive) {
      if (btn) {
        btn.innerHTML = '⚡ Auto-Join: ON';
        btn.classList.remove('btn-purple');
        btn.classList.add('btn-success');
      }
      if (card) card.style.display = 'block';

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('queue_join');
      }

      if (this.autoJoinInterval) {
        clearInterval(this.autoJoinInterval);
        this.autoJoinInterval = null;
      }

      this.autoJoinInterval = setInterval(() => {
        if (!this.isAutoJoinActive) {
          if (this.autoJoinInterval) {
            clearInterval(this.autoJoinInterval);
            this.autoJoinInterval = null;
          }
          return;
        }

        // Scan lobbies for available slot matching favorite games
        const openLobby = this.lobbies.find(l => this.favoriteGames.has(l.game) && l.players < l.max);
        if (openLobby) {
          this.isAutoJoinActive = false;
          if (this.autoJoinInterval) {
            clearInterval(this.autoJoinInterval);
            this.autoJoinInterval = null;
          }

          if (btn) {
            btn.innerHTML = '⚡ Auto-Join: OFF';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-purple');
          }

          if (statusText) statusText.innerText = `🎯 OPEN SLOT DISCOVERED! Auto-joining node "${openLobby.title}" (${openLobby.game})...`;
          openLobby.players += 1;
          this.saveState();
          this.renderLobbies();

          if (window.widgetBuilderEngine) {
            window.widgetBuilderEngine.playSoundEffect('match_found');
            window.widgetBuilderEngine.showToast(`⚡ AUTO-JOIN: Matched slot in ${openLobby.title}!`, 'success');
          }

          this.launchFaceitMatchRoom(openLobby.id);
        }
      }, 4000);

    } else {
      if (btn) {
        btn.innerHTML = '⚡ Auto-Join: OFF';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-purple');
      }
      if (card) card.style.display = 'none';

      if (this.autoJoinInterval) {
        clearInterval(this.autoJoinInterval);
        this.autoJoinInterval = null;
      }
    }
  }

  // --- TACTICAL TEAM LINEUP MANAGER ---
  openTeamLineupModal() {
    this.renderTeamLineupSlots();
    const modal = document.getElementById('teamLineupModal');
    if (modal) modal.classList.add('active');
  }

  closeTeamLineupModal() {
    const modal = document.getElementById('teamLineupModal');
    if (modal) modal.classList.remove('active');
  }

  renderTeamLineupSlots() {
    const grid = document.getElementById('teamLineupSlotsGrid');
    const benchGrid = document.getElementById('teamLineupBenchGrid');

    if (grid) {
      grid.innerHTML = this.teamLineup.map((p, idx) => `
        <div style="background: rgba(0,0,0,0.5); border: 1px solid var(--accent-purple); border-radius: 8px; padding: 0.8rem; display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--accent-gold);">SLOT #${p.slot}</span>
            <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 800;">${p.elo} ELO</span>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: #fff;">${p.avatar} ${p.name}</div>
          <select style="background: rgba(20,20,30,0.9); color: #fff; border: 1px solid var(--border-color); padding: 0.3rem; border-radius: 4px; font-size: 0.8rem;" onchange="window.app.updateLineupRole(${idx}, this.value)">
            <option value="IGL / Shotcaller" ${p.role === 'IGL / Shotcaller' ? 'selected' : ''}>👑 IGL / Shotcaller</option>
            <option value="Entry Fragger" ${p.role === 'Entry Fragger' ? 'selected' : ''}>⚡ Entry Fragger</option>
            <option value="AWPer / Sniper" ${p.role === 'AWPer / Sniper' ? 'selected' : ''}>🎯 AWPer / Sniper</option>
            <option value="Support / Anchor" ${p.role === 'Support / Anchor' ? 'selected' : ''}>🛡️ Support / Anchor</option>
            <option value="Lurker / Rifler" ${p.role === 'Lurker / Rifler' ? 'selected' : ''}>🦅 Lurker / Rifler</option>
          </select>
        </div>
      `).join('');
    }

    if (benchGrid) {
      if (this.teamBench.length === 0) {
        benchGrid.innerHTML = '<span style="font-size: 0.8rem; color: var(--text-muted);">No bench substitutes assigned.</span>';
      } else {
        benchGrid.innerHTML = this.teamBench.map((b, idx) => `
          <div style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-cyan); border-radius: 6px; padding: 0.5rem 0.8rem; display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div>
              <span style="font-weight: 800; color: #fff; font-size: 0.85rem;">${b.avatar} ${b.name}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.5rem;">(${b.role} - ${b.elo} ELO)</span>
            </div>
            <button class="btn btn-purple btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="window.app.swapBenchPlayer(${idx})">Sub In</button>
          </div>
        `).join('');
      }
    }
  }

  updateLineupRole(index, newRole) {
    if (this.teamLineup[index]) {
      this.teamLineup[index].role = newRole;
    }
  }

  swapBenchPlayer(benchIdx) {
    if (this.teamBench[benchIdx]) {
      const sub = this.teamBench[benchIdx];
      const targetSlotIndex = prompt(`Choose Lineup Slot to sub ${sub.name} into (1-5):`, '5');
      const slotNum = parseInt(targetSlotIndex);
      if (!slotNum || slotNum < 1 || slotNum > 5) return;

      const idx = slotNum - 1;
      const starter = this.teamLineup[idx];

      this.teamLineup[idx] = { slot: slotNum, name: sub.name, role: sub.role, elo: sub.elo, avatar: sub.avatar };
      this.teamBench[benchIdx] = { id: sub.id, name: starter.name, role: starter.role, elo: starter.elo, avatar: starter.avatar };

      this.renderTeamLineupSlots();
      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('swap');
      }
      alert(`🔄 SUBSTITUTION COMPLETE!\n\n${sub.name} subbed in for ${starter.name} in Slot #${slotNum}.`);
    }
  }

  autoBalanceLineup() {
    // Sort starting roster by highest ELO first (Highest MMR = Team Captain)
    this.teamLineup.sort((a, b) => (b.elo || 1800) - (a.elo || 1800));

    const roles = ['IGL / Shotcaller (Captain 👑)', 'Entry Fragger', 'AWPer / Sniper', 'Support / Anchor', 'Lurker / Rifler'];
    this.teamLineup.forEach((p, idx) => {
      p.role = roles[idx % roles.length];
      p.slot = idx + 1;
    });

    this.renderTeamLineupSlots();
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }
    alert(`👑 CAPTAIN ASSIGNED BY HIGHEST MMR!\n\n${this.teamLineup[0].name} (${this.teamLineup[0].elo} MMR) designated as Team Captain & IGL.`);
  }

  saveTeamLineup() {
    this.saveState();
    this.closeTeamLineupModal();
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('success');
    }
    alert('💾 Tactical Team Lineup & Substitutions saved successfully!');
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
        const region = document.getElementById('newLobbyRegion')?.value || 'NA East';
        const map = document.getElementById('newLobbyMap')?.value || 'Mirage & Inferno';
        const draftType = document.getElementById('newLobbyDraftType')?.value || 'FACEIT Competitive';

        this.lobbies.unshift({
          id: Date.now(),
          title,
          game,
          host: 'You (Host)',
          players: 1,
          max,
          region,
          map,
          draftType,
          serverIp: region === 'Helix Local' ? '127.0.0.1:7777' : '192.168.1.85:27015',
          matchStatus: '🔥 RECRUITING (1/' + max + ')'
        });

        // Automatically spin up dedicated private lobby channel in Community Hub
        if (window.chatVoiceManager && typeof window.chatVoiceManager.createPrivateLobbyChannelFromLobby === 'function') {
          window.chatVoiceManager.createPrivateLobbyChannelFromLobby({
            title,
            game,
            max,
            region,
            map,
            draftType,
            serverIp: region === 'Helix Local' ? '127.0.0.1:7777' : '192.168.1.85:27015',
            host: 'You (Host)',
            players: 1
          });
        }

        // Host Reward
        this.addCoins(50);
        this.saveState();
        this.renderActiveGamesBar();
        this.renderLobbies();
        
        if (window.widgetBuilderEngine) {
          window.widgetBuilderEngine.playSoundEffect('lobby_start');
          window.widgetBuilderEngine.showToast(`🎮 Custom Lobby "${title}" Created! +50 🪙 Host Reward Added!`, 'success');
        }
        modal.classList.remove('active');
      });
    }

    const poolModal = document.getElementById('joinPlayerPoolModal');
    const btnClosePool = document.getElementById('btnClosePlayerPoolModal');
    const btnCancelPool = document.getElementById('btnCancelPlayerPoolModal');
    const btnSubmitPool = document.getElementById('btnConfirmSubmitPlayerPool');

    if (btnClosePool) btnClosePool.addEventListener('click', () => poolModal?.classList.remove('active'));
    if (btnCancelPool) btnCancelPool.addEventListener('click', () => poolModal?.classList.remove('active'));
    if (btnSubmitPool) btnSubmitPool.addEventListener('click', () => this.submitJoinPlayerPool());

    // Global ESC Key Listener to dismiss any active modal overlay without page refresh
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });

    // Global Modal Backdrop Click Listener
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
        e.target.classList.remove('active');
      }
    });

    // Auto-sync state when localStorage changes across browser tabs
    window.addEventListener('storage', () => {
      this.liveRefreshAllUI();
    });
  }

  liveRefreshAllUI() {
    this.loadState();
    this.renderFavoriteStarTags();
    this.renderActiveGamesBar();
    this.renderSponsoredServers();
    this.renderMyCreatedTeams();
    this.renderPoolFeed();
    this.renderLobbies();
    this.renderDebateLobbies();
    this.renderLeaderboard();
    this.renderLeaguesView();
    this.renderWardogsView();
    this.renderMatchmakingHub();
    this.updatePointsWidget();

    if (window.tournamentsStoreEngine) {
      window.tournamentsStoreEngine.renderTournaments();
      window.tournamentsStoreEngine.renderMonthlyCalendarGrid();
      window.tournamentsStoreEngine.renderDashboardBracketWidget();
    }

    if (window.chatVoiceManager) {
      window.chatVoiceManager.renderMessages();
      window.chatVoiceManager.renderOnlineUsers();
      window.chatVoiceManager.renderDashboardStickers();
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
      window.widgetBuilderEngine.showToast('🔄 Dynamic UI State Re-Synced & Rendered!', 'success');
    }
  }

  // --- DEBATE ARENA & SIDING MATCHMAKER ENGINE ---
  initDebateSystem() {
    this.debateSiding = 'PRO';
    this.activeDebateFilter = 'all';

    this.masterDebateTopics = [
      { topic: "Is Controller Aim Assist Overpowered in Competitive Shooters?", category: "Gaming Meta" },
      { topic: "Will AI Companions Replace Human Teammates in Esports by 2030?", category: "Tech & AI" },
      { topic: "Should In-Game Skins Have Real-Money CL-Points Tradeability?", category: "Gaming Economy" },
      { topic: "Is PC Superior to Next-Gen Consoles for Professional Esports?", category: "Esports Formats" },
      { topic: "Are 33v33v33 WARDOGS Battles Superior to 5v5 Arena Shooters?", category: "Gaming Meta" },
      { topic: "Should Tactical Shooters Ban Instant Headshot One-Tap Mechanics?", category: "Gaming Meta" },
      { topic: "Is Regional Server Locking Necessary to Prevent High Ping Advantages?", category: "Esports Formats" },
      { topic: "Should Pay-to-Win Mechanics in Free-to-Play Games Be Legally Banned?", category: "Gaming Economy" },
      { topic: "Are Fighting Game Hitboxes Too Lenient in Modern Fighting Titles?", category: "Gaming Meta" },
      { topic: "Does 240Hz+ High Refresh Rate Provide an Unfair Pay-to-Win Advantage?", category: "Gaming Meta" },
      { topic: "Is Battle Royale RNG Inherently Inferior to Round-Based Tactical FPS?", category: "Esports Formats" },
      { topic: "Should Kernel-Level Anti-Cheat Drivers Be Mandatory for Ranked Play?", category: "Tech & AI" },
      { topic: "Is Movement Tech (Bunny Hopping, Tap Strafing) Skill or Exploit?", category: "Gaming Meta" },
      { topic: "Should Esports Leagues Institute Hard Salary Caps for Rosters?", category: "Esports Formats" },
      { topic: "Should Neural-Network AI Bots Be Allowed to Train Pros in Scrims?", category: "Tech & AI" },
      { topic: "Is Loot Box Gacha Gambling Harmful to Video Game Ecosystems?", category: "Gaming Economy" },
      { topic: "Are Open-World MMOs Superior to Instanced Session Lobbies?", category: "Gaming Meta" },
      { topic: "Does Spatial 3D Audio Give Sound-Engine Whales Unmatched Advantage?", category: "Gaming Meta" },
      { topic: "Should Franchise Leagues Replace Open Open-Qualifier Ecosystems?", category: "Esports Formats" },
      { topic: "Is Cloud Gaming Streaming Capable of Supporting 128-Tick Esports Play by 2028?", category: "Tech & AI" },
      { topic: "Should Smurfing in Low-Ranked Play Be Punished with Hardware-ID Bans?", category: "Esports Formats" },
      { topic: "Is Cross-Platform Play Damaging the Competitive Integrity of PC Shooters?", category: "Gaming Meta" }
    ];

    this.masterJuryQuestions = [
      "How do you reconcile rotational aim-tracking assistance with physical human reaction limits in CQC duels?",
      "If financial skin trading is legalized, what safeguards prevent fraud and money laundering in player marketplaces?",
      "Does frame-rate cap standardization equalize competitive advantage between entry-level and enthusiast rigs?",
      "Where is the definitive boundary between permissible QoL keybind macros and illegal automated scripting?",
      "If AI companions reach Radiant/Global Elite rank, how can tournament organizers verify human input integrity?",
      "Doesn't kernel-level anti-cheat telemetry represent an unacceptable privacy risk for casual PC players?",
      "How can battle royale tournaments maintain competitive fairness when circle RNG dictates late-game positioning?",
      "If movement exploits like tap-strafing are preserved, does it unfairly exclude casual console players from cross-play?",
      "Should salary caps in esports protect org sustainability or allow top talent to maximize market value?",
      "If hardware-ID bans are enforced for smurfing, how do LAN centers and shared family PCs handle false positives?",
      "Does instant one-tap TTK reward tactical crosshair placement or punish strategic utility usage?",
      "Are open-qualifier esports ecosystems healthier for organic grass-roots talent than closed franchise leagues?",
      "If cloud streaming adds 15ms latency, can speculative input prediction bridge the gap in 128-tick shooters?",
      "Does spatial audio height-cue ambiguity necessitate standardized 7.1 surround profiles in pro tournaments?",
      "Should game developers balance mechanics based on top 0.1% esports pros or the 99.9% casual player base?"
    ];

    const savedDebates = localStorage.getItem('cl_debate_lobbies_v1');
    if (savedDebates) {
      try {
        this.debateLobbies = JSON.parse(savedDebates);
      } catch (e) {
        this.debateLobbies = this.getDefaultDebateLobbies();
      }
    } else {
      this.debateLobbies = this.getDefaultDebateLobbies();
    }
  }

  getDefaultDebateLobbies() {
    return [
      {
        id: 'DEBATE-101',
        topic: 'Is Controller Aim Assist Overpowered in Competitive Shooters?',
        category: 'Gaming Meta',
        format: 'Town Hall (Jury Vote)',
        phase: 'Round 2: Cross-Examination',
        timer: '03:15',
        proSpeaker: { handle: 'Sean (Host)', elo: 1890, badge: '👑 Orator', votes: 142 },
        conSpeaker: { handle: 'Apex_Sniper_99', elo: 1920, badge: '🎯 Master Debater', votes: 118 },
        status: 'LIVE',
        spectators: 260,
        totalJuryVotes: 260,
        userVoted: null,
        createdDate: 'Live Now'
      },
      {
        id: 'DEBATE-102',
        topic: 'Will AI Companions Replace Human Teammates in Esports by 2030?',
        category: 'Tech & AI',
        format: '1v1 Rapid Duel',
        phase: 'Round 1: Opening Statement',
        timer: '01:45',
        proSpeaker: { handle: 'Cyber_Advocate', elo: 1780, badge: '🤖 AI Specialist', votes: 85 },
        conSpeaker: { handle: 'Valkyrie_Merc', elo: 1850, badge: '🛡️ Human Purist', votes: 94 },
        status: 'LIVE',
        spectators: 179,
        totalJuryVotes: 179,
        userVoted: null,
        createdDate: 'Live Now'
      },
      {
        id: 'DEBATE-103',
        topic: 'Should In-Game Skins Have Real-Money CL-Points Tradeability?',
        category: 'Gaming Economy',
        format: '1v1 Rapid Duel',
        phase: 'Awaiting CON (Negative) Speaker',
        timer: 'Open Slot',
        proSpeaker: { handle: 'Trader_King', elo: 1810, badge: '💰 Economist', votes: 45 },
        conSpeaker: null,
        status: 'OPEN_CON',
        spectators: 45,
        totalJuryVotes: 45,
        userVoted: null,
        createdDate: 'Open Challenge'
      },
      {
        id: 'DEBATE-104',
        topic: 'Are 33v33v33 WARDOGS Battles Superior to 5v5 Arena Shooters?',
        category: 'Esports Formats',
        format: '2v2 Partner Debate',
        phase: 'Awaiting PRO (Affirmative) Speaker',
        timer: 'Open Slot',
        proSpeaker: null,
        conSpeaker: { handle: 'Tactical_Sargeant', elo: 1950, badge: '🐕 Battalion Commander', votes: 62 },
        status: 'OPEN_PRO',
        spectators: 62,
        totalJuryVotes: 62,
        userVoted: null,
        createdDate: 'Open Challenge'
      }
    ];
  }

  selectDebateSiding(siding, btnEl) {
    this.debateSiding = siding;
    const badge = document.getElementById('selectedSidingBadge');
    
    const buttons = document.querySelectorAll('.siding-btn');
    buttons.forEach(b => {
      b.classList.remove('btn-cyan', 'btn-danger', 'btn-purple', 'active');
      b.classList.add('btn-secondary');
    });

    if (btnEl) {
      btnEl.classList.remove('btn-secondary');
      if (siding === 'PRO') btnEl.classList.add('btn-cyan', 'active');
      else if (siding === 'CON') btnEl.classList.add('btn-danger', 'active');
      else btnEl.classList.add('btn-purple', 'active');
    }

    if (badge) {
      if (siding === 'PRO') {
        badge.className = 'lobby-game-tag';
        badge.style.cssText = 'background: rgba(0, 242, 254, 0.2); color: var(--accent-cyan); border: 1px solid var(--accent-cyan); font-weight: 900;';
        badge.textContent = '🔵 AFFIRMATIVE (PRO / FOR)';
      } else if (siding === 'CON') {
        badge.className = 'lobby-game-tag';
        badge.style.cssText = 'background: rgba(255, 82, 82, 0.2); color: #ff5252; border: 1px solid #ff5252; font-weight: 900;';
        badge.textContent = '🔴 NEGATIVE (CON / AGAINST)';
      } else {
        badge.className = 'lobby-game-tag';
        badge.style.cssText = 'background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid var(--accent-purple); font-weight: 900;';
        badge.textContent = '🎲 AUTO-ASSIGN SIDING (PRO vs CON)';
      }
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }
  }

  pickRandomDebateTopic(targetId = 'debateQueueTopic') {
    if (!this.masterDebateTopics || this.masterDebateTopics.length === 0) return;
    const randomIndex = Math.floor(Math.random() * this.masterDebateTopics.length);
    const selected = this.masterDebateTopics[randomIndex];

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      if (targetEl.tagName === 'SELECT') {
        let foundOption = Array.from(targetEl.options).find(opt => opt.value === selected.topic || opt.value.includes(selected.topic));
        if (foundOption) {
          targetEl.value = foundOption.value;
        } else {
          targetEl.selectedIndex = randomIndex % targetEl.options.length;
        }
      } else if (targetEl.tagName === 'INPUT') {
        targetEl.value = selected.topic;
      }
    }

    if (targetId !== 'modalDebateTopic') {
      const modalTopicInput = document.getElementById('modalDebateTopic');
      if (modalTopicInput) modalTopicInput.value = selected.topic;
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
      window.widgetBuilderEngine.showToast(`🎲 Picked Random Topic: "${selected.topic.slice(0, 45)}..."`, 'info');
    }
  }

  generateRandomJuryQuestion(debateId) {
    if (!this.masterJuryQuestions || this.masterJuryQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * this.masterJuryQuestions.length);
    const question = this.masterJuryQuestions[randomIndex];

    const displayEl = document.getElementById(`juryQuestionDisplay_${debateId}`);
    if (displayEl) {
      displayEl.style.transition = 'all 0.3s ease';
      displayEl.style.opacity = '0.3';
      setTimeout(() => {
        displayEl.innerHTML = `<strong>❓ Jury Question #${randomIndex + 1}:</strong> "${question}"`;
        displayEl.style.opacity = '1';
        displayEl.style.borderColor = 'var(--accent-cyan)';
      }, 150);
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
      window.widgetBuilderEngine.showToast('❓ Generated New Jury Cross-Examination Question!', 'success');
    }
  }

  // --- OMEGLE 1v1 LIVE WEBCAM VIDEO STREAM & MIC DEBATE ENGINE ---
  openOmegleDebateModal() {
    if (!this.masterDebateTopics) this.initDebateSystem();
    const modal = document.getElementById('omegleDebateModal');
    if (modal) modal.classList.add('active');

    this.isOmegleActive = true;
    this.isRecordingMic = false;
    this.isCameraOn = true;
    this.isMicMuted = false;
    this.audioChunks = [];
    this.recTimerSeconds = 0;

    const userHandle = this.user ? this.user.displayName : 'Sean (You)';
    const userNameEl = document.getElementById('omegleUserName');
    if (userNameEl) userNameEl.textContent = userHandle;

    this.initCameraMediaStream();
    this.connectOmeglePartner();
    this.startWaveformVisualizer();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
      window.widgetBuilderEngine.showToast('📹 1v1 Instant Orator Video Stage Activated!', 'info');
    }
  }

  closeOmegleDebateModal() {
    const modal = document.getElementById('omegleDebateModal');
    if (modal) modal.classList.remove('active');

    this.isOmegleActive = false;
    if (this.isRecordingMic) {
      this.toggleOmegleRecording();
    }

    if (this.recTimerInterval) {
      clearInterval(this.recTimerInterval);
      this.recTimerInterval = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.waveformAnimationFrame) {
      cancelAnimationFrame(this.waveformAnimationFrame);
      this.waveformAnimationFrame = null;
    }
  }

  async initCameraMediaStream() {
    const badge = document.getElementById('omegleCamStatusBadge');
    const userVideo = document.getElementById('omegleUserVideo');
    const fallback = document.getElementById('omegleUserVideoFallback');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
        this.mediaStream = stream;

        if (userVideo) {
          userVideo.srcObject = stream;
          userVideo.style.display = 'block';
        }
        if (fallback) fallback.style.display = 'none';

        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          this.postUserAudioClip(audioUrl);
        };

        if (badge) {
          badge.textContent = '📹 WebCam & Mic Active';
          badge.style.background = 'rgba(0, 230, 118, 0.2)';
          badge.style.color = '#00e676';
          badge.style.border = '1px solid #00e676';
        }
      } else {
        throw new Error('MediaDevices unsupported');
      }
    } catch (e) {
      if (userVideo) userVideo.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';

      if (badge) {
        badge.textContent = '📹 WebCam Standby (Audio Visualizer Active)';
        badge.style.background = 'rgba(0, 242, 254, 0.2)';
        badge.style.color = 'var(--accent-cyan)';
        badge.style.border = '1px solid var(--accent-cyan)';
      }
    }
  }

  toggleOmegleCamera() {
    this.isCameraOn = !this.isCameraOn;
    const btn = document.getElementById('btnToggleOmegleCamera');
    const userVideo = document.getElementById('omegleUserVideo');
    const fallback = document.getElementById('omegleUserVideoFallback');

    if (this.mediaStream) {
      const videoTracks = this.mediaStream.getVideoTracks();
      videoTracks.forEach(track => track.enabled = this.isCameraOn);
    }

    if (btn) {
      btn.textContent = this.isCameraOn ? '📹 Camera: ON' : '📷 Camera: OFF';
      btn.classList.toggle('btn-cyan', this.isCameraOn);
      btn.classList.toggle('btn-secondary', !this.isCameraOn);
    }

    if (userVideo && fallback) {
      if (this.isCameraOn && this.mediaStream) {
        userVideo.style.display = 'block';
        fallback.style.display = 'none';
      } else {
        userVideo.style.display = 'none';
        fallback.style.display = 'flex';
      }
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
      window.widgetBuilderEngine.showToast(this.isCameraOn ? '📹 Camera Feed Enabled' : '📷 Camera Feed Disabled', 'info');
    }
  }

  toggleOmegleMicMute() {
    this.isMicMuted = !this.isMicMuted;
    const btn = document.getElementById('btnToggleOmegleMic');

    if (this.mediaStream) {
      const audioTracks = this.mediaStream.getAudioTracks();
      audioTracks.forEach(track => track.enabled = !this.isMicMuted);
    }

    if (btn) {
      btn.textContent = this.isMicMuted ? '🔇 Mic: MUTED' : '🎙️ Mic: ON';
      btn.classList.toggle('btn-cyan', !this.isMicMuted);
      btn.classList.toggle('btn-danger', this.isMicMuted);
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
      window.widgetBuilderEngine.showToast(this.isMicMuted ? '🔇 Microphone Muted' : '🎙️ Microphone Unmuted', 'info');
    }
  }

  toggleOmegleRecording() {
    const btn = document.getElementById('btnOmegleRecord');
    const btnText = document.getElementById('recBtnText');
    const recDot = document.getElementById('recDotIcon');
    const recStatus = document.getElementById('omegleUserRecStatus');
    const timerEl = document.getElementById('omegleTimerDisplay');

    if (!this.isRecordingMic) {
      this.isRecordingMic = true;
      this.audioChunks = [];
      this.recTimerSeconds = 0;

      if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
        this.mediaRecorder.start();
      }

      if (btn) {
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-purple');
        btn.style.boxShadow = '0 0 25px rgba(168,85,247,0.7)';
      }
      if (btnText) btnText.textContent = '⏹️ Stop & Post Speech Clip';
      if (recDot) recDot.style.background = '#00e676';
      if (recStatus) {
        recStatus.textContent = '🔴 RECORDING LIVE... Speak your argument!';
        recStatus.style.color = '#ff5252';
      }

      this.recTimerInterval = setInterval(() => {
        this.recTimerSeconds++;
        const mins = Math.floor(this.recTimerSeconds / 60).toString().padStart(2, '0');
        const secs = (this.recTimerSeconds % 60).toString().padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      }, 1000);

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('click');
      }
    } else {
      this.isRecordingMic = false;
      if (this.recTimerInterval) {
        clearInterval(this.recTimerInterval);
        this.recTimerInterval = null;
      }

      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      } else {
        this.postUserAudioClip('https://actions.google.com/sounds/v1/speech/person_talking.ogg');
      }

      if (btn) {
        btn.classList.remove('btn-purple');
        btn.classList.add('btn-danger');
        btn.style.boxShadow = '0 0 15px rgba(255,82,82,0.4)';
      }
      if (btnText) btnText.textContent = '🔴 Record Speech Clip';
      if (recDot) recDot.style.background = '#fff';
      if (recStatus) {
        recStatus.textContent = '🎙️ Speech Clip Posted to Stage!';
        recStatus.style.color = '#00e676';
      }
      if (timerEl) timerEl.textContent = '00:00';

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
        window.widgetBuilderEngine.showToast('🎙️ Speech Audio Clip Recorded & Broadcast to Stage!', 'success');
      }
    }
  }

  postUserAudioClip(audioUrl) {
    const container = document.getElementById('omegleUserAudioClips');
    if (!container) return;

    if (container.querySelector('div')?.textContent.includes('No speech clip recorded')) {
      container.innerHTML = '';
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const clipDiv = document.createElement('div');
    clipDiv.style.cssText = 'margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(0, 242, 254, 0.1); border-radius: 6px; border: 1px solid rgba(0, 242, 254, 0.3);';
    clipDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 0.3rem;">
        <span>🎙️ Your Speech Clip (${time}):</span>
        <span style="color: var(--accent-gold);">PRO Affirmative</span>
      </div>
      <audio controls style="width: 100%; height: 32px;" src="${audioUrl}"></audio>
    `;
    container.prepend(clipDiv);
  }

  triggerOmegleReaction(emoji, label) {
    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect(label.includes('Mic Drop') ? 'fanfare' : 'click');
      window.widgetBuilderEngine.showToast(`${emoji} ${label} broadcasted to 1v1 Orator stage!`, 'success');
    }

    const statusText = document.getElementById('omegleStatusText');
    if (statusText) {
      const orig = statusText.textContent;
      statusText.textContent = `${emoji} REACTION: ${label}! (${orig})`;
      setTimeout(() => {
        if (statusText) statusText.textContent = orig;
      }, 2500);
    }
  }

  connectOmeglePartner() {
    const partners = [
      { name: 'Apex_Orator_99', elo: 1940, badge: '🎯 Debate Grandmaster', streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-video-call-on-his-laptop-40348-large.mp4' },
      { name: 'Vortex_Scholar', elo: 1870, badge: '⚡ Logic Specialist', streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-having-a-video-call-with-a-laptop-40346-large.mp4' },
      { name: 'Radiant_Debater', elo: 2050, badge: '👑 Radiant Orator', streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-on-laptop-40347-large.mp4' },
      { name: 'Cypher_Tactician', elo: 1790, badge: '🛡️ Defense Analyst', streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-talking-on-a-video-call-with-a-laptop-40349-large.mp4' },
      { name: 'Titan_Speaker', elo: 1910, badge: '🗣️ Town Hall Champion', streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-video-call-on-his-laptop-40348-large.mp4' },
      { name: 'Valkyrie_Arguer', elo: 1840, badge: '🔥 Firebrand', streamUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-on-laptop-40347-large.mp4' }
    ];

    const randomPartner = partners[Math.floor(Math.random() * partners.length)];
    const nameEl = document.getElementById('omegleOpponentName');
    const eloEl = document.getElementById('omegleOpponentElo');
    const statusText = document.getElementById('omegleStatusText');
    const clipsContainer = document.getElementById('omegleOpponentAudioClips');
    const oppVideo = document.getElementById('omegleOpponentVideo');
    const oppFallback = document.getElementById('omegleOpponentVideoFallback');

    if (nameEl) nameEl.textContent = randomPartner.name;
    if (eloEl) eloEl.textContent = `${randomPartner.elo} ELO`;
    if (statusText) {
      statusText.textContent = `⚡ Live connected to 1v1 orator video partner ${randomPartner.name}! Record your speech clip or click NEXT to skip.`;
    }

    if (oppVideo) {
      oppVideo.src = randomPartner.streamUrl;
      oppVideo.style.display = 'block';
      oppVideo.play().catch(() => {});
    }
    if (oppFallback) oppFallback.style.display = 'none';

    if (clipsContainer) {
      clipsContainer.innerHTML = `
        <div style="margin-bottom: 0.4rem; padding: 0.4rem; background: rgba(255,82,82,0.1); border-radius: 4px; border: 1px solid rgba(255,82,82,0.2);">
          <div style="font-weight: 800; font-size: 0.75rem; color: #ff5252; margin-bottom: 0.2rem;">🎙️ ${randomPartner.name} (Opening Argument):</div>
          <audio controls style="width: 100%; height: 32px;" src="https://actions.google.com/sounds/v1/speech/person_talking.ogg"></audio>
        </div>
      `;
    }
  }

  skipOmeglePartner() {
    const nameEl = document.getElementById('omegleOpponentName');
    const eloEl = document.getElementById('omegleOpponentElo');
    const statusText = document.getElementById('omegleStatusText');
    const clipsContainer = document.getElementById('omegleOpponentAudioClips');
    const oppVideo = document.getElementById('omegleOpponentVideo');
    const oppFallback = document.getElementById('omegleOpponentVideoFallback');

    if (nameEl) nameEl.textContent = '🔍 Queueing next 1v1 video orator...';
    if (eloEl) eloEl.textContent = 'Matching ELO rating...';
    if (statusText) statusText.textContent = '⏳ 1v1 Orator Matchmaker searching for available video partner...';
    if (oppVideo) oppVideo.style.display = 'none';
    if (oppFallback) oppFallback.style.display = 'flex';
    if (clipsContainer) clipsContainer.innerHTML = '<div style="font-style: italic; color: var(--text-muted);">Searching for opponent video & mic stream...</div>';

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
      window.widgetBuilderEngine.showToast('⏭️ Skipped current partner! Finding next 1v1 orator...', 'info');
    }

    setTimeout(() => {
      if (this.isOmegleActive) {
        this.connectOmeglePartner();
        if (window.widgetBuilderEngine) {
          window.widgetBuilderEngine.playSoundEffect('fanfare');
        }
      }
    }, 800);
  }

  pickRandomDebateTopicForOmegle() {
    if (!this.masterDebateTopics) return;
    const selected = this.masterDebateTopics[Math.floor(Math.random() * this.masterDebateTopics.length)];
    const topicText = document.getElementById('omegleActiveTopicText');
    if (topicText) topicText.textContent = selected.topic;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
      window.widgetBuilderEngine.showToast(`🎲 Rerolled Motion: "${selected.topic.slice(0, 45)}..."`, 'info');
    }
  }

  startWaveformVisualizer() {
    const userCanvas = document.getElementById('omegleUserWaveform');
    const oppCanvas = document.getElementById('omegleOpponentWaveform');

    const drawCanvas = (canvas, isUser) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const bars = 24;
      const barWidth = (width / bars) - 2;

      for (let i = 0; i < bars; i++) {
        let barHeight;
        if (isUser && this.isRecordingMic) {
          barHeight = Math.random() * (height - 8) + 8;
        } else if (!isUser) {
          barHeight = (Math.sin(Date.now() / 200 + i) + 1) * 12 + 6;
        } else {
          barHeight = 4;
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isUser) {
          gradient.addColorStop(0, '#00f2fe');
          gradient.addColorStop(1, '#4facfe');
        } else {
          gradient.addColorStop(0, '#ff5252');
          gradient.addColorStop(1, '#ff1744');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    const animate = () => {
      if (this.isOmegleActive) {
        drawCanvas(userCanvas, true);
        drawCanvas(oppCanvas, false);
        this.waveformAnimationFrame = requestAnimationFrame(animate);
      }
    };

    animate();
  }

  joinDebateQueue() {
    const topicSelect = document.getElementById('debateQueueTopic');
    const topic = topicSelect ? topicSelect.value : 'Controller Aim Assist';
    const format = document.getElementById('debateQueueFormat') ? document.getElementById('debateQueueFormat').value : 'Town Hall (Jury Vote)';
    const siding = this.debateSiding || 'PRO';

    const card = document.getElementById('debateQueueStatusCard');
    const text = document.getElementById('debateQueueStatusText');

    if (card) card.style.display = 'block';
    if (text) {
      const stanceText = siding === 'PRO' ? '🔵 PRO (Affirmative)' : siding === 'CON' ? '🔴 CON (Negative)' : '🎲 Balanced Auto-Siding';
      const lookingFor = siding === 'PRO' ? '🔴 CON (Negative)' : siding === 'CON' ? '🔵 PRO (Affirmative)' : 'Opposing Speaker';
      text.textContent = `Queued as ${stanceText} for "${topic}" (${format}). Searching for ${lookingFor} orator...`;
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('click');
    }

    setTimeout(() => {
      if (card && card.style.display !== 'none') {
        this.leaveDebateQueue();
        const opponentSiding = siding === 'PRO' ? 'CON' : 'PRO';
        const newDebate = {
          id: `DEBATE-${Date.now().toString().slice(-4)}`,
          topic: topic.length > 55 ? topic.slice(0, 52) + '...' : topic,
          category: 'Competitive Debate',
          format,
          phase: 'Round 1: Opening Arguments',
          timer: '05:00',
          proSpeaker: siding === 'CON' ? { handle: 'Vortex_Orator', elo: 1870, badge: '🗣️ Opponent', votes: 0 } : { handle: this.user ? this.user.displayName : 'Sean (You)', elo: 1890, badge: '👑 Orator', votes: 0 },
          conSpeaker: siding === 'CON' ? { handle: this.user ? this.user.displayName : 'Sean (You)', elo: 1890, badge: '👑 Orator', votes: 0 } : { handle: 'Vortex_Orator', elo: 1870, badge: '🗣️ Opponent', votes: 0 },
          status: 'LIVE',
          spectators: 18,
          totalJuryVotes: 0,
          userVoted: null,
          createdDate: 'Live Now'
        };

        if (!this.debateLobbies) this.debateLobbies = [];
        this.debateLobbies.unshift(newDebate);
        localStorage.setItem('cl_debate_lobbies_v1', JSON.stringify(this.debateLobbies));
        this.renderDebateLobbies();
        this.openDebateStageModal(newDebate.id);

        if (window.widgetBuilderEngine) {
          window.widgetBuilderEngine.playSoundEffect('fanfare');
        }
      }
    }, 2800);
  }

  leaveDebateQueue() {
    const card = document.getElementById('debateQueueStatusCard');
    if (card) card.style.display = 'none';
  }

  filterDebates(type) {
    this.activeDebateFilter = type;
    this.renderDebateLobbies();
  }

  renderDebateLobbies() {
    const grid = document.getElementById('activeDebateLobbiesGrid');
    if (!grid) return;

    if (!this.debateLobbies) this.initDebateSystem();

    let list = [...this.debateLobbies];
    if (this.activeDebateFilter === 'open') {
      list = list.filter(d => d.status === 'OPEN_PRO' || d.status === 'OPEN_CON');
    } else if (this.activeDebateFilter === 'live') {
      list = list.filter(d => d.status === 'LIVE');
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: rgba(0,0,0,0.3); padding: 2rem; border-radius: 10px; text-align: center; color: var(--text-muted); border: 1px dashed var(--border-color);">
          🗣️ No active debate rooms match your filter. Click "Host Custom Debate Topic" or select a siding above to enter the Arena!
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(d => {
      const proVotes = d.proSpeaker ? d.proSpeaker.votes || 0 : 0;
      const conVotes = d.conSpeaker ? d.conSpeaker.votes || 0 : 0;
      const total = proVotes + conVotes || 1;
      const proPct = Math.round((proVotes / total) * 100);
      const conPct = 100 - proPct;

      return `
        <div class="card" style="border-color: var(--accent-purple); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.4rem;">
              <span class="lobby-game-tag" style="background: rgba(168, 85, 247, 0.2); color: #d8b4fe; font-weight: 800; border: 1px solid var(--accent-purple);">🗣️ ${d.category}</span>
              <span class="lobby-game-tag" style="background: ${d.status === 'LIVE' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 215, 0, 0.2)'}; color: ${d.status === 'LIVE' ? 'var(--accent-green)' : 'var(--accent-gold)'}; font-weight: 800;">
                ${d.status === 'LIVE' ? '🔴 LIVE DUEL' : d.status === 'OPEN_CON' ? '⚡ CON SIDE OPEN' : '⚡ PRO SIDE OPEN'}
              </span>
            </div>

            <h4 style="font-size: 1.05rem; font-weight: 900; color: #fff; margin-bottom: 0.8rem; line-height: 1.35;">${d.topic}</h4>

            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center; background: rgba(0,0,0,0.4); padding: 0.6rem; border-radius: 8px; margin-bottom: 0.8rem;">
              <div style="text-align: left;">
                <div style="font-size: 0.7rem; color: var(--accent-cyan); font-weight: 900; text-transform: uppercase;">🔵 PRO (Affirmative)</div>
                <div style="font-size: 0.82rem; font-weight: 800; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                  ${d.proSpeaker ? d.proSpeaker.handle : '<span style="color: var(--accent-cyan); font-style: italic;">+ Open Slot</span>'}
                </div>
                <div style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 700;">${d.proSpeaker ? `${d.proSpeaker.elo} ELO` : 'Select Pro Side'}</div>
              </div>

              <div style="font-size: 0.85rem; font-weight: 900; color: var(--text-muted); padding: 0 0.2rem;">VS</div>

              <div style="text-align: right;">
                <div style="font-size: 0.7rem; color: #ff5252; font-weight: 900; text-transform: uppercase;">🔴 CON (Negative)</div>
                <div style="font-size: 0.82rem; font-weight: 800; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                  ${d.conSpeaker ? d.conSpeaker.handle : '<span style="color: #ff5252; font-style: italic;">+ Open Slot</span>'}
                </div>
                <div style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 700;">${d.conSpeaker ? `${d.conSpeaker.elo} ELO` : 'Select Con Side'}</div>
              </div>
            </div>

            <div style="margin-bottom: 0.8rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-weight: 800; color: var(--text-muted); margin-bottom: 0.25rem;">
                <span style="color: var(--accent-cyan);">PRO Jury: ${proPct}%</span>
                <span>👀 ${d.spectators} Spectators</span>
                <span style="color: #ff5252;">CON Jury: ${conPct}%</span>
              </div>
              <div style="height: 6px; background: rgba(255, 82, 82, 0.4); border-radius: 3px; overflow: hidden; display: flex;">
                <div style="width: ${proPct}%; background: var(--accent-cyan); transition: width 0.3s;"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-purple btn-sm" style="flex: 1; font-size: 0.78rem;" onclick="window.app.openDebateStageModal('${d.id}')">
              👁️ Spectate & Vote
            </button>
            ${d.status !== 'LIVE' ? `
              <button class="btn btn-cyan btn-sm" style="font-size: 0.78rem;" onclick="window.app.challengeDebateSide('${d.id}')">
                ⚔️ Take Open Side
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  openDebateStageModal(debateId) {
    if (!this.debateLobbies) this.initDebateSystem();
    const debate = this.debateLobbies.find(d => d.id === debateId);
    if (!debate) return;

    this.activeDebateStage = debate;
    const modal = document.getElementById('debateStageModal');
    const topicEl = document.getElementById('debateStageTopic');
    const bodyEl = document.getElementById('debateStageBody');

    if (topicEl) topicEl.textContent = debate.topic;
    if (bodyEl) {
      const proName = debate.proSpeaker ? debate.proSpeaker.handle : 'Open Slot (PRO)';
      const conName = debate.conSpeaker ? debate.conSpeaker.handle : 'Open Slot (CON)';
      const proVotes = debate.proSpeaker ? debate.proSpeaker.votes || 0 : 0;
      const conVotes = debate.conSpeaker ? debate.conSpeaker.votes || 0 : 0;
      const total = proVotes + conVotes || 1;
      const proPct = Math.round((proVotes / total) * 100);
      const conPct = 100 - proPct;

      bodyEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.6rem;">
          <div>
            <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.2); color: var(--accent-green); font-weight: 800;">🔴 STAGE LIVE</span>
            <strong style="margin-left: 0.5rem; font-size: 0.88rem; color: var(--accent-cyan);">${debate.phase}</strong>
          </div>
          <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 800; font-family: monospace;">
            ⏱️ Timer: ${debate.timer} | 👀 ${debate.spectators} Jury Spectators
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
          <div style="background: rgba(0, 242, 254, 0.05); border: 1px solid var(--accent-cyan); border-radius: 10px; padding: 1rem; text-align: center;">
            <div class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.2); color: var(--accent-cyan); font-weight: 900; margin-bottom: 0.5rem;">🔵 AFFIRMATIVE (PRO)</div>
            <h4 style="font-size: 1.1rem; font-weight: 900; color: #fff; margin: 0 0 0.2rem 0;">${proName}</h4>
            <div style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 800; margin-bottom: 0.8rem;">${debate.proSpeaker ? `${debate.proSpeaker.elo} Orator ELO` : 'Awaiting Speaker'}</div>
            
            <div style="background: rgba(0,0,0,0.4); border-radius: 6px; padding: 0.6rem; font-size: 0.8rem; color: var(--text-muted); font-style: italic; min-height: 60px; text-align: left;">
              "Aim assist algorithms provide automated sub-millisecond rotational tracking that human reflexes cannot match physically in high-tier competitive duels."
            </div>
          </div>

          <div style="background: rgba(255, 82, 82, 0.05); border: 1px solid #ff5252; border-radius: 10px; padding: 1rem; text-align: center;">
            <div class="lobby-game-tag" style="background: rgba(255, 82, 82, 0.2); color: #ff5252; font-weight: 900; margin-bottom: 0.5rem;">🔴 NEGATIVE (CON)</div>
            <h4 style="font-size: 1.1rem; font-weight: 900; color: #fff; margin: 0 0 0.2rem 0;">${conName}</h4>
            <div style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 800; margin-bottom: 0.8rem;">${debate.conSpeaker ? `${debate.conSpeaker.elo} Orator ELO` : 'Awaiting Speaker'}</div>

            <div style="background: rgba(0,0,0,0.4); border-radius: 6px; padding: 0.6rem; font-size: 0.8rem; color: var(--text-muted); font-style: italic; min-height: 60px; text-align: left;">
              "Analogs lack arm-length precision, recoil control ranges, and keybind flexibility; friction slowdown compensates for inferior mechanical hardware input."
            </div>
          </div>
        </div>

        <!-- Jury Cross-Examination Prompt Generator Card -->
        <div style="background: rgba(168, 85, 247, 0.08); border: 1px dashed var(--accent-purple); border-radius: 10px; padding: 0.9rem 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 900; font-size: 0.88rem; color: #d8b4fe; display: flex; align-items: center; gap: 0.4rem;">
              <span>❓</span> Jury Cross-Examination Prompt Generator
            </div>
            <button class="btn btn-purple btn-sm" onclick="window.app.generateRandomJuryQuestion('${debate.id}')" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
              🎲 Random Jury Question
            </button>
          </div>
          <div id="juryQuestionDisplay_${debate.id}" style="background: rgba(0, 0, 0, 0.4); padding: 0.7rem; border-radius: 6px; font-size: 0.84rem; color: var(--accent-cyan); font-style: italic; border-left: 3px solid var(--accent-purple);">
            Click "Random Jury Question" to generate sharp cross-examination questions for PRO and CON speakers!
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; text-align: center;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: #fff; margin-bottom: 0.6rem;">🗳️ Cast Your Audience Jury Vote (+10 🪙 CL-Points)</h4>
          
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 800; margin-bottom: 0.4rem;">
            <span style="color: var(--accent-cyan);">PRO (Affirmative): ${proVotes} Votes (${proPct}%)</span>
            <span style="color: #ff5252;">CON (Negative): ${conVotes} Votes (${conPct}%)</span>
          </div>

          <div style="height: 10px; background: rgba(255, 82, 82, 0.4); border-radius: 5px; overflow: hidden; display: flex; margin-bottom: 1rem;">
            <div style="width: ${proPct}%; background: var(--accent-cyan); transition: width 0.4s;"></div>
          </div>

          <div style="display: flex; gap: 0.8rem; justify-content: center;">
            <button class="btn btn-cyan" onclick="window.app.castJuryVote('${debate.id}', 'PRO')" style="flex: 1; font-size: 0.95rem;">
              👍 Vote PRO (Affirmative)
            </button>
            <button class="btn btn-danger" onclick="window.app.castJuryVote('${debate.id}', 'CON')" style="flex: 1; font-size: 0.95rem;">
              👎 Vote CON (Negative)
            </button>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.add('active');
  }

  closeDebateStageModal() {
    const modal = document.getElementById('debateStageModal');
    if (modal) modal.classList.remove('active');
  }

  castJuryVote(debateId, side) {
    const debate = this.debateLobbies.find(d => d.id === debateId);
    if (!debate) return;

    if (debate.userVoted) {
      alert(`⚠️ ALREADY VOTED!\n\nYou have already cast your jury vote for this debate room.`);
      return;
    }

    debate.userVoted = side;
    debate.spectators += 1;
    debate.totalJuryVotes += 1;

    if (side === 'PRO' && debate.proSpeaker) {
      debate.proSpeaker.votes = (debate.proSpeaker.votes || 0) + 1;
    } else if (side === 'CON' && debate.conSpeaker) {
      debate.conSpeaker.votes = (debate.conSpeaker.votes || 0) + 1;
    }

    this.clPoints += 10;
    this.updatePointsWidget();
    localStorage.setItem('cl_debate_lobbies_v1', JSON.stringify(this.debateLobbies));

    this.openDebateStageModal(debateId);
    this.renderDebateLobbies();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    alert(`🎉 JURY VOTE CAST!\n\nYou voted ${side === 'PRO' ? '🔵 PRO (Affirmative)' : '🔴 CON (Negative)'}! Awarded +10 🪙 CL-Points!`);
  }

  challengeDebateSide(debateId) {
    const debate = this.debateLobbies.find(d => d.id === debateId);
    if (!debate) return;

    const userHandle = this.user ? this.user.displayName : 'Sean (You)';

    if (debate.status === 'OPEN_CON') {
      debate.conSpeaker = { handle: userHandle, elo: 1890, badge: '👑 Orator', votes: 0 };
      debate.status = 'LIVE';
      debate.phase = 'Round 1: Opening Arguments';
    } else if (debate.status === 'OPEN_PRO') {
      debate.proSpeaker = { handle: userHandle, elo: 1890, badge: '👑 Orator', votes: 0 };
      debate.status = 'LIVE';
      debate.phase = 'Round 1: Opening Arguments';
    }

    localStorage.setItem('cl_debate_lobbies_v1', JSON.stringify(this.debateLobbies));
    this.renderDebateLobbies();
    this.openDebateStageModal(debateId);
  }

  openCreateDebateModal() {
    const modal = document.getElementById('createDebateTopicModal');
    if (modal) modal.classList.add('active');
  }

  closeCreateDebateModal() {
    const modal = document.getElementById('createDebateTopicModal');
    if (modal) modal.classList.remove('active');
  }

  submitCreateDebateTopic() {
    const topic = document.getElementById('modalDebateTopic').value.trim() || 'Controller vs K&M Balance';
    const category = document.getElementById('modalDebateCategory').value;
    const siding = document.getElementById('modalDebateSiding').value;
    const format = document.getElementById('modalDebateFormat').value;

    const userHandle = this.user ? this.user.displayName : 'Sean (Host)';

    const newDebate = {
      id: `DEBATE-${Date.now().toString().slice(-4)}`,
      topic,
      category,
      format,
      phase: siding === 'PRO' ? 'Awaiting CON Speaker' : 'Awaiting PRO Speaker',
      timer: 'Open Slot',
      proSpeaker: siding === 'PRO' ? { handle: userHandle, elo: 1890, badge: '👑 Orator', votes: 0 } : null,
      conSpeaker: siding === 'CON' ? { handle: userHandle, elo: 1890, badge: '👑 Orator', votes: 0 } : null,
      status: siding === 'PRO' ? 'OPEN_CON' : 'OPEN_PRO',
      spectators: 1,
      totalJuryVotes: 0,
      userVoted: null,
      createdDate: 'Open Challenge'
    };

    if (!this.debateLobbies) this.debateLobbies = [];
    this.debateLobbies.unshift(newDebate);
    localStorage.setItem('cl_debate_lobbies_v1', JSON.stringify(this.debateLobbies));

    this.clPoints += 50;
    this.updatePointsWidget();

    this.closeCreateDebateModal();
    this.renderDebateLobbies();

    alert(`🎉 DEBATE TOPIC HOSTED!\n\nDebate "${topic}" created with ${siding} siding! (+50 🪙 CL-Points)`);
  }
  // CL PULSE SOCIAL MEDIA FEED METHODS
  renderPulseFeed() {
    const container = document.getElementById('pulseSocialFeedContainer');
    if (!container) return;

    const posts = this.pulsePosts || [];
    container.innerHTML = posts.map(p => `
      <div class="pulse-post-card animate-fade-in">
        <div class="pulse-avatar-header">
          <img src="${p.avatar}" class="pulse-avatar-img" alt="${p.author}" />
          <div>
            <div class="pulse-author-name">
              <span>${p.author}</span>
              <span class="mmr-badge" style="font-size: 0.7rem; padding: 1px 6px;">${p.rank}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${p.time} • ${p.gameIcon} ${p.game}</div>
          </div>
        </div>

        <div class="pulse-post-content">${p.content}</div>

        ${p.mediaThumb ? `
          <div class="pulse-media-container">
            <img src="${p.mediaThumb}" alt="Media Post" />
            <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; color: #00f2fe; font-weight: 800;">
              ${p.mediaType === 'video' ? '🎬 CLIP REPLAY' : p.mediaType === 'stream' ? '🔴 BROADCASTING LIVE' : '📷 MEDIA'}
            </div>
          </div>
        ` : ''}

        <div class="pulse-actions-bar">
          <button class="pulse-action-btn ${p.userPulsed ? 'active' : ''}" onclick="window.app.likePulsePost('${p.id}')">
            <span>⚡</span> <span>${p.pulseCount} Pulses</span>
          </button>
          <button class="pulse-action-btn" onclick="window.app.promptPulseComment('${p.id}')">
            <span>💬</span> <span>${p.comments.length} Comments</span>
          </button>
          <button class="pulse-action-btn" onclick="window.app.repostPulse('${p.id}')">
            <span>🔄</span> <span>Repost</span>
          </button>
          <button class="btn btn-primary btn-xs" onclick="window.app.openPlayTonightModal()">
            <span>🎮</span> Join Game / LFG
          </button>
        </div>

        ${p.comments.length > 0 ? `
          <div style="margin-top: 0.8rem; padding-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.04); font-size: 0.8rem;">
            ${p.comments.map(c => `
              <div style="margin-bottom: 0.3rem;"><strong style="color: var(--accent-cyan);">${c.author}:</strong> <span style="color: var(--text-main);">${c.text}</span></div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  createPulsePost() {
    const input = document.getElementById('pulsePostInput');
    if (!input || !input.value.trim()) return;

    const content = input.value.trim();
    const gameSelect = document.getElementById('pulsePostGameSelect');
    const game = gameSelect ? gameSelect.value : 'Counter-Strike 2';

    const newPost = {
      id: 'pulse_' + Date.now(),
      author: this.user ? this.user.displayName : 'Sean (You)',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sean',
      rank: '💎 Diamond (1840 MMR)',
      game,
      gameIcon: '🎮',
      time: 'Just now',
      content,
      mediaType: 'text',
      mediaThumb: null,
      pulseCount: 1,
      userPulsed: true,
      comments: []
    };

    if (!this.pulsePosts) this.pulsePosts = [];
    this.pulsePosts.unshift(newPost);
    input.value = '';

    if (typeof this.showToast === 'function') {
      this.showToast('🚀 Post Published to CL Pulse Social Feed!', 'success');
    }
    this.renderPulseFeed();
  }

  likePulsePost(postId) {
    const post = (this.pulsePosts || []).find(p => p.id === postId);
    if (!post) return;

    if (post.userPulsed) {
      post.pulseCount -= 1;
      post.userPulsed = false;
    } else {
      post.pulseCount += 1;
      post.userPulsed = true;
    }
    this.renderPulseFeed();
  }

  promptPulseComment(postId) {
    const text = prompt('Enter your comment:');
    if (!text || !text.trim()) return;

    const post = (this.pulsePosts || []).find(p => p.id === postId);
    if (!post) return;

    post.comments.push({
      author: this.user ? this.user.displayName : 'Sean',
      text: text.trim()
    });
    this.renderPulseFeed();
  }

  repostPulse(postId) {
    if (typeof this.showToast === 'function') {
      this.showToast('🔄 Reposted to your Gamer Passport Timeline!', 'info');
    }
  }

  openBroadcasterStudioModal() {
    const modal = document.getElementById('broadcasterStudioModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
    }
  }

  closeBroadcasterStudioModal() {
    const modal = document.getElementById('broadcasterStudioModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  }

  startStreamBroadcast() {
    this.closeBroadcasterStudioModal();
    if (typeof this.showToast === 'function') {
      this.showToast('🔴 LIVE BROADCAST STARTED! Streaming to CL Live TV.', 'success');
    }
  }

  // ==========================================
  // SERVER ADMIN DASHBOARD
  // ==========================================
  openAdminDashboard() {
    const modal = document.getElementById('adminDashboardModal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      
      // Load current settings into inputs
      const settings = JSON.parse(localStorage.getItem('cl_admin_settings')) || {};
      
      const title = document.getElementById('adminHeroTitle');
      const subtitle = document.getElementById('adminHeroSubtitle');
      const logo = document.getElementById('adminLogoUrl');
      const color = document.getElementById('adminAccentColor');
      const ann = document.getElementById('adminAnnouncement');
      const gk = document.getElementById('adminToggleGatekeeper');

      if(title) title.value = settings.heroTitle || '';
      if(subtitle) subtitle.value = settings.heroSubtitle || '';
      if(logo) logo.value = settings.logoUrl || '';
      if(color) color.value = settings.accentColor || '#00f2fe';
      if(ann) ann.value = settings.announcement || '';
      if(gk) gk.checked = settings.requireGatekeeper || false;
      
      this.renderAdminServerList();
    }
  }

  renderAdminServerList() {
      const container = document.getElementById('adminServerList');
      if (!container) return;
      
      let guilds = {};
      if (window.chatVoiceManager && window.chatVoiceManager.guilds) {
          guilds = window.chatVoiceManager.guilds;
      }
      
      container.innerHTML = '';
      for (const [key, guild] of Object.entries(guilds)) {
          const row = document.createElement('div');
          row.style = 'display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.5); padding: 0.5rem 1rem; border-radius: 4px; border: 1px solid var(--border-color);';
          row.innerHTML = `
             <div style="display:flex; align-items:center; gap: 0.8rem;">
                 <span style="font-size: 1.2rem;">${guild.icon}</span>
                 <div>
                    <strong style="color: #fff;">${guild.name}</strong>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">ID: ${key}</div>
                 </div>
             </div>
             <button class="btn btn-secondary btn-sm" onclick="window.app.adminRemoveServer('${key}')">❌</button>
          `;
          container.appendChild(row);
      }
  }

  adminAddServer() {
      const idInput = document.getElementById('adminNewServerId');
      const titleInput = document.getElementById('adminNewServerTitle');
      const emojiInput = document.getElementById('adminNewServerEmoji');
      
      if (!idInput || !titleInput || !emojiInput) return;
      
      const key = idInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      const name = titleInput.value.trim();
      const icon = emojiInput.value.trim() || '💬';
      
      if (!key || !name) {
          alert("ID and Title are required.");
          return;
      }
      
      if (window.chatVoiceManager) {
          window.chatVoiceManager.guilds[key] = { name, icon };
          localStorage.setItem('cl_admin_servers', JSON.stringify(window.chatVoiceManager.guilds));
          window.chatVoiceManager.renderGuildRail();
          this.renderAdminServerList();
          
          idInput.value = '';
          titleInput.value = '';
          emojiInput.value = '';
      }
  }
  
  adminRemoveServer(key) {
      if (window.chatVoiceManager && window.chatVoiceManager.guilds[key]) {
          delete window.chatVoiceManager.guilds[key];
          localStorage.setItem('cl_admin_servers', JSON.stringify(window.chatVoiceManager.guilds));
          window.chatVoiceManager.renderGuildRail();
          this.renderAdminServerList();
      }
  }

  closeAdminDashboard() {
    const modal = document.getElementById('adminDashboardModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  saveAdminSettings() {
    const title = document.getElementById('adminHeroTitle');
    const subtitle = document.getElementById('adminHeroSubtitle');
    const logo = document.getElementById('adminLogoUrl');
    const color = document.getElementById('adminAccentColor');
    const ann = document.getElementById('adminAnnouncement');
    const gk = document.getElementById('adminToggleGatekeeper');

    const settings = {
      heroTitle: title ? title.value.trim() : '',
      heroSubtitle: subtitle ? subtitle.value.trim() : '',
      logoUrl: logo ? logo.value.trim() : '',
      accentColor: color ? color.value : '#00f2fe',
      announcement: ann ? ann.value.trim() : '',
      requireGatekeeper: gk ? gk.checked : false
    };

    localStorage.setItem('cl_admin_settings', JSON.stringify(settings));
    this.applyAdminSettings(settings);
    this.closeAdminDashboard();
    
    alert('✅ Global Site Settings applied successfully!');
  }

  applyAdminSettings(settings = null) {
    if (!settings) {
      settings = JSON.parse(localStorage.getItem('cl_admin_settings')) || {};
    }

    if (settings.heroTitle) {
      const heroTitles = document.querySelectorAll('.hero-title');
      heroTitles.forEach(el => {
        // Change the main title if it's not a specific modal title
        if(el.textContent.includes('CUSTOMLOBBIES HUB') || el.classList.contains('main-header')) {
            el.innerHTML = `💻 ${settings.heroTitle}`;
        }
      });
    }

    if (settings.logoUrl) {
      const logos = document.querySelectorAll('.brand-logo-img');
      logos.forEach(el => el.src = settings.logoUrl);
    }

    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent-cyan', settings.accentColor);
    }
    
    // Announcement Banner
    let annBanner = document.getElementById('global-admin-announcement');
    if (settings.announcement) {
      if (!annBanner) {
         annBanner = document.createElement('div');
         annBanner.id = 'global-admin-announcement';
         annBanner.style.background = 'var(--accent-magenta)';
         annBanner.style.color = '#fff';
         annBanner.style.textAlign = 'center';
         annBanner.style.padding = '0.5rem';
         annBanner.style.fontWeight = 'bold';
         annBanner.style.zIndex = '9999';
         document.body.prepend(annBanner);
      }
      annBanner.innerHTML = `📢 ${settings.announcement}`;
    } else if (annBanner) {
      annBanner.remove();
    }
    
    // Update global state for other scripts (like Gatekeeper)
    window.CL_REQUIRE_GATEKEEPER = settings.requireGatekeeper || false;
  }
}

window.app = new CustomLobbiesApp();
document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
    window.app.applyAdminSettings();
});
