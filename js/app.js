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

    // Universal Free-Agent Player Pool Roster
    this.poolFeed = [
      { id: 1, name: 'RadiantReaper', elo: 2540, game: 'Counter-Strike 2', role: 'IGL / Shotcaller', time: 'Just Now', karma: '100% Positive', status: 'Available', acVerified: true },
      { id: 2, name: 'ApexGod99', elo: 2150, game: 'Counter-Strike 2', role: 'Entry Fragger', time: '1m ago', karma: '98% Positive', status: 'Available', acVerified: true },
      { id: 3, name: 'Empulse_Overlord', elo: 2450, game: 'Empulse', role: 'AWPer / Sniper', time: '2m ago', karma: '100% Positive', status: 'Available', acVerified: true },
      { id: 4, name: 'Rematch_God', elo: 2480, game: 'REMATCH', role: 'Entry Fragger', time: '3m ago', karma: '100% Positive', status: 'Available', acVerified: true },
      { id: 5, name: 'Valkyrie_CS', elo: 1790, game: 'Valorant', role: 'AWPer / Sniper', time: '3m ago', karma: '100% Positive', status: 'Available', acVerified: true },
      { id: 6, name: 'ShadowNinja', elo: 1920, game: 'Arkheron', role: 'Support / Controller', time: '5m ago', karma: '95% Positive', status: 'Available', acVerified: true }
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
      'Apex Legends'
    ];

    this.favoriteGames = new Set(['Counter-Strike 2', 'REMATCH', 'Arkheron', 'Valorant', 'Marvel Rivals', 'Dota 2', 'FiveM GTA RP']);
    this.loadFavorites();

    this.sponsoredServers = [
      { id: 318, name: 'Empulse 5v5 Cyber Arena Server Node #1', game: 'Empulse', host: 'Empulse_Overlord', players: 9, max: 10, connectURL: 'steam://connect/192.168.1.120:27015', sponsoredBadge: '⚡ EMPULSE SPONSOR' },
      { id: 316, name: 'REMATCH 5v5 Competitive Arena Node #1', game: 'REMATCH', host: 'Rematch_God', players: 8, max: 10, connectURL: 'steam://connect/192.168.1.110:27015', sponsoredBadge: '🔥 REMATCH SPONSOR' },
      { id: 317, name: 'Arkheron 12-Player Cyber Scrim Spire', game: 'Arkheron', host: 'Archon_Master', players: 10, max: 12, connectURL: 'steam://connect/192.168.1.115:27015', sponsoredBadge: '⚔️ ARKHERON SPONSOR' },
      { id: 314, name: 'CS2 128-Tick Auto-Bhop Speedrun Server', game: 'CS2 Bhop (Auto & Scroll)', host: 'Bhop_God', players: 18, max: 24, connectURL: 'steam://connect/192.168.1.100:27015', sponsoredBadge: '🐰 BHOP SPONSOR' },
      { id: 315, name: 'CS2 Danger Zone Solos & Duos Arena', game: 'CS2 Danger Zone (BR)', host: 'DZ_Survivor', players: 16, max: 18, connectURL: 'steam://connect/192.168.1.105:27015', sponsoredBadge: '🪂 DZ SPONSOR' },
      { id: 311, name: 'CS2 128-Tick Retake Server #1', game: 'CS2 Retake (Bomb Defusal)', host: 'Retake_Leader', players: 7, max: 9, connectURL: 'steam://connect/192.168.1.85:27015', sponsoredBadge: '💣 RETAKE SPONSOR' }
    ];

    this.lobbies = [
      { id: 13, title: 'Empulse 5v5 Apex Striker Cyber Arena Scrims', game: 'Empulse', host: 'Empulse_Overlord', players: 9, max: 10, region: 'NA East', draftType: 'Captain Snake Draft' },
      { id: 12, title: 'REMATCH 5v5 High ELO Champion Scrims', game: 'REMATCH', host: 'Rematch_God', players: 8, max: 10, region: 'NA East', draftType: 'Captain Draft' },
      { id: 11, title: 'Arkheron Cyber Spire Battle Scrims', game: 'Arkheron', host: 'Archon_Master', players: 10, max: 12, region: 'NA East', draftType: 'Battle Draft' },
      { id: 9, title: 'CS2 FACEIT Level 8-10 Premier Scrims', game: 'Counter-Strike 2', host: 'ApexGod99', players: 9, max: 10, region: 'NA East', draftType: 'FACEIT Pro League' },
      { id: 8, title: 'CS2 3v4 Retake Mirage A/B Site Scrims', game: 'CS2 Retake (Bomb Defusal)', host: 'Retake_Leader', players: 7, max: 9, region: 'NA East', draftType: 'Retakers vs Defenders' }
    ];

    this.selectedLeaderboardGame = 'Counter-Strike 2';
    this.selectedLeaderboardRegion = 'all';
    this.leaderboardSearchQuery = '';

    this.leaderboardData = [
      {
        rank: 1,
        name: 'RadiantReaper',
        region: 'NA',
        avatar: '👑',
        acVerified: true,
        steamId: '76561198099887766',
        riotId: 'Reaper#NA1',
        discord: 'RadiantReaper#0001',
        twitch: 'twitch.tv/RadiantReaper',
        commendations: { leadership: 24, friendly: 35, clutch: 42, teacher: 18 },
        badRemarks: { toxic: 1, afk: 0, griefing: 0, suspected: 0 },
        games: {
          'Counter-Strike 2': { elo: 2540, wins: 142, losses: 28, winRate: 83.5, kd: '2.14', mvp: 48 },
          'REMATCH': { elo: 2480, wins: 115, losses: 20, winRate: 85.1, kd: '2.30', mvp: 40 },
          'Arkheron': { elo: 2200, wins: 95, losses: 18, winRate: 84.0, kd: '2.45', mvp: 35 },
          'Empulse': { elo: 2450, wins: 105, losses: 15, winRate: 87.5, kd: '2.55', mvp: 38 },
          'Valorant': { elo: 2350, wins: 110, losses: 22, winRate: 83.3, kd: '1.98', mvp: 35 },
          'Marvel Rivals': { elo: 2400, wins: 88, losses: 15, winRate: 85.4, kd: '3.10', mvp: 30 },
          'Apex Legends': { elo: 2650, wins: 95, losses: 18, winRate: 84.0, kd: '3.45', mvp: 42 },
          'Rocket League': { elo: 2450, wins: 88, losses: 20, winRate: 81.4, kd: 'N/A', mvp: 30 },
          'Dota 2': { elo: 4200, wins: 130, losses: 40, winRate: 76.4, kd: '3.10', mvp: 29 },
          'Rainbow Six Siege': { elo: 3100, wins: 75, losses: 15, winRate: 83.3, kd: '2.05', mvp: 22 }
        }
      },
      {
        rank: 2,
        name: 'ApexGod99',
        region: 'EU',
        avatar: '⚡',
        acVerified: true,
        steamId: '76561198011223344',
        riotId: 'ApexGod#EUW',
        discord: 'ApexGod#1337',
        twitch: 'twitch.tv/ApexGod99',
        commendations: { leadership: 18, friendly: 20, clutch: 31, teacher: 9 },
        badRemarks: { toxic: 2, afk: 1, griefing: 0, suspected: 0 },
        games: {
          'Counter-Strike 2': { elo: 2150, wins: 98, losses: 31, winRate: 76.0, kd: '1.75', mvp: 32 },
          'REMATCH': { elo: 1950, wins: 70, losses: 28, winRate: 71.4, kd: '1.85', mvp: 25 },
          'Arkheron': { elo: 1750, wins: 62, losses: 25, winRate: 71.2, kd: '1.90', mvp: 22 },
          'Empulse': { elo: 2150, wins: 85, losses: 20, winRate: 81.0, kd: '2.10', mvp: 28 },
          'Valorant': { elo: 2100, wins: 82, losses: 24, winRate: 77.3, kd: '1.68', mvp: 24 },
          'Apex Legends': { elo: 2580, wins: 112, losses: 20, winRate: 84.8, kd: '3.20', mvp: 50 },
          'Rocket League': { elo: 1850, wins: 64, losses: 30, winRate: 68.1, kd: 'N/A', mvp: 18 },
          'Dota 2': { elo: 2800, wins: 55, losses: 35, winRate: 61.1, kd: '2.40', mvp: 12 },
          'Rainbow Six Siege': { elo: 2400, wins: 60, losses: 25, winRate: 70.5, kd: '1.55', mvp: 15 }
        }
      },
      {
        rank: 3,
        name: 'Valkyrie_CS',
        region: 'EU',
        avatar: '🎯',
        acVerified: true,
        steamId: '76561198055443322',
        riotId: 'Valkyrie#EU1',
        discord: 'Valkyrie#2026',
        twitch: 'twitch.tv/Valkyrie_CS',
        commendations: { leadership: 15, friendly: 40, clutch: 28, teacher: 22 },
        badRemarks: { toxic: 0, afk: 0, griefing: 0, suspected: 0 },
        games: {
          'Counter-Strike 2': { elo: 1920, wins: 85, losses: 42, winRate: 66.9, kd: '1.45', mvp: 28 },
          'REMATCH': { elo: 1820, wins: 65, losses: 30, winRate: 68.4, kd: '1.60', mvp: 20 },
          'Arkheron': { elo: 1650, wins: 54, losses: 28, winRate: 65.8, kd: '1.72', mvp: 18 },
          'Valorant': { elo: 1950, wins: 90, losses: 38, winRate: 70.3, kd: '1.52', mvp: 26 },
          'Apex Legends': { elo: 1900, wins: 70, losses: 35, winRate: 66.7, kd: '2.10', mvp: 20 },
          'Rocket League': { elo: 1600, wins: 50, losses: 32, winRate: 60.9, kd: 'N/A', mvp: 12 },
          'Dota 2': { elo: 3300, wins: 78, losses: 45, winRate: 63.4, kd: '2.70', mvp: 18 },
          'Rainbow Six Siege': { elo: 2850, wins: 88, losses: 30, winRate: 74.5, kd: '1.85', mvp: 25 }
        }
      },
      {
        rank: 4,
        name: 'You (Host)',
        region: 'NA',
        avatar: '👑',
        acVerified: true,
        steamId: '76561198012345678',
        riotId: 'ProGamer#1337',
        discord: 'GamerHost#0001',
        twitch: 'twitch.tv/CustomLobbiesHost',
        commendations: { leadership: 19, friendly: 28, clutch: 34, teacher: 15 },
        badRemarks: { toxic: 0, afk: 0, griefing: 0, suspected: 0 },
        games: {
          'Counter-Strike 2': { elo: 1840, wins: 76, losses: 34, winRate: 69.1, kd: '1.40', mvp: 22 },
          'REMATCH': { elo: 1900, wins: 72, losses: 28, winRate: 72.0, kd: '1.70', mvp: 24 },
          'Arkheron': { elo: 1850, wins: 68, losses: 24, winRate: 73.9, kd: '1.80', mvp: 21 },
          'Valorant': { elo: 1350, wins: 62, losses: 30, winRate: 67.4, kd: '1.38', mvp: 19 },
          'Apex Legends': { elo: 2510, wins: 104, losses: 26, winRate: 80.0, kd: '3.10', mvp: 38 },
          'Rocket League': { elo: 2100, wins: 80, losses: 32, winRate: 71.4, kd: 'N/A', mvp: 21 },
          'Dota 2': { elo: 2500, wins: 60, losses: 35, winRate: 63.1, kd: '2.25', mvp: 14 },
          'Rainbow Six Siege': { elo: 2250, wins: 54, losses: 28, winRate: 65.8, kd: '1.42', mvp: 16 }
        }
      },
      {
        rank: 5,
        name: 'ShadowNinja',
        region: 'SA',
        avatar: '🥷',
        acVerified: true,
        steamId: '76561198088776655',
        riotId: 'ShadowNinja#BR1',
        discord: 'ShadowNinja#9999',
        twitch: 'twitch.tv/ShadowNinja',
        commendations: { leadership: 12, friendly: 18, clutch: 22, teacher: 8 },
        badRemarks: { toxic: 1, afk: 0, griefing: 1, suspected: 0 },
        games: {
          'Counter-Strike 2': { elo: 1790, wins: 64, losses: 40, winRate: 61.5, kd: '1.32', mvp: 18 },
          'Valorant': { elo: 1750, wins: 72, losses: 45, winRate: 61.5, kd: '1.35', mvp: 17 },
          'Apex Legends': { elo: 1800, wins: 65, losses: 42, winRate: 60.7, kd: '1.95', mvp: 15 },
          'Rocket League': { elo: 1500, wins: 45, losses: 35, winRate: 56.2, kd: 'N/A', mvp: 10 },
          'Dota 2': { elo: 3100, wins: 70, losses: 50, winRate: 58.3, kd: '2.50', mvp: 16 },
          'Rainbow Six Siege': { elo: 1950, wins: 48, losses: 38, winRate: 55.8, kd: '1.25', mvp: 11 }
        }
      },
      {
        rank: 6,
        name: 'GhostOperator',
        region: 'APAC',
        avatar: '👻',
        acVerified: true,
        steamId: '76561198033445566',
        riotId: 'GhostOp#JP1',
        discord: 'GhostOperator#7777',
        twitch: 'twitch.tv/GhostOperator',
        commendations: { leadership: 10, friendly: 15, clutch: 19, teacher: 6 },
        badRemarks: { toxic: 0, afk: 0, griefing: 0, suspected: 0 },
        games: {
          'Counter-Strike 2': { elo: 1680, wins: 52, losses: 38, winRate: 57.8, kd: '1.22', mvp: 14 },
          'Valorant': { elo: 1820, wins: 80, losses: 39, winRate: 67.2, kd: '1.48', mvp: 21 },
          'Apex Legends': { elo: 1650, wins: 50, losses: 38, winRate: 56.8, kd: '1.75', mvp: 12 },
          'Rocket League': { elo: 1420, wins: 38, losses: 30, winRate: 55.9, kd: 'N/A', mvp: 8 },
          'Dota 2': { elo: 1900, wins: 42, losses: 38, winRate: 52.5, kd: '2.05', mvp: 9 },
          'Rainbow Six Siege': { elo: 3050, wins: 95, losses: 22, winRate: 81.2, kd: '2.10', mvp: 28 }
        }
      }
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

        <div style="display: flex; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem;">
          <button class="btn btn-primary btn-sm" style="flex: 1; font-size: 0.75rem;" onclick="window.app.recruitPoolPlayer(${p.id})">
            ➕ Recruit Player
          </button>
          <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem;" onclick="window.app.openPlayerPassportModal('${p.name}')">
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
    const game = document.getElementById('poolRegisterGame')?.value || 'Counter-Strike 2';
    const role = document.getElementById('poolRegisterRole')?.value || 'Entry Fragger';
    const note = document.getElementById('poolRegisterNote')?.value.trim() || 'Ready for scrims!';

    const newFreeAgent = {
      id: Date.now(),
      name: 'You (Host)',
      elo: 1840,
      game: game,
      role: role,
      time: 'Just Now',
      karma: '100% Positive',
      status: 'Available',
      acVerified: true,
      note: note
    };

    this.poolFeed.unshift(newFreeAgent);
    this.renderPoolFeed();

    const modal = document.getElementById('joinPlayerPoolModal');
    if (modal) modal.classList.remove('active');

    // Award +25 CL-Points signup bonus
    this.clPoints += 25;
    this.updatePointsWidget();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    alert(`🚀 FREE-AGENT SIGNUP COMPLETE!\n\nYou listed yourself in the Universal Player Pool for ${game} as ${role}!\nEarned +25 🪙 CL-Points signup bonus!`);
  }

  recruitPoolPlayer(playerId) {
    const player = this.poolFeed.find(p => p.id === playerId);
    if (!player) return;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('cheer');
    }

    alert(`➕ PLAYER RECRUITED!\n\nYou invited ${player.name} (${player.game} - ${player.role}) to join your Custom Lobby or Tournament Squad! Notification dispatched!`);
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
      'Apex Legends',
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
            <button class="btn btn-purple btn-sm" onclick="window.app.openPlayerPassportModal('${p.name}')">
              🪪 View Passport
            </button>
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
      linkedContainer.innerHTML = `
        <div><span style="color: var(--text-muted);">Steam:</span> <strong>${p.steamId || 'Not Linked'}</strong></div>
        <div><span style="color: var(--text-muted);">Riot ID:</span> <strong>${p.riotId || 'Not Linked'}</strong></div>
        <div><span style="color: var(--text-muted);">Discord:</span> <strong>${p.discord || 'Not Linked'}</strong></div>
        <div><span style="color: var(--text-muted);">Twitch:</span> <strong>${p.twitch || 'Not Linked'}</strong></div>
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
      btn.innerHTML = '<span>✔ MATCH ACCEPTED! CONNECTING TO SERVER...</span>';
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('accept_match');
    }

    setTimeout(() => {
      const modal = document.getElementById('matchFoundModal');
      if (modal) modal.classList.remove('active');
      alert('🚀 MATCH READY & ACCEPTED!\n\nLaunching Guardian Anti-Cheat Protected Dedicated Server Node (128-tick)...');
    }, 1500);
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

    const poolModal = document.getElementById('joinPlayerPoolModal');
    const btnClosePool = document.getElementById('btnClosePlayerPoolModal');
    const btnCancelPool = document.getElementById('btnCancelPlayerPoolModal');
    const btnSubmitPool = document.getElementById('btnConfirmSubmitPlayerPool');

    if (btnClosePool) btnClosePool.addEventListener('click', () => poolModal?.classList.remove('active'));
    if (btnCancelPool) btnCancelPool.addEventListener('click', () => poolModal?.classList.remove('active'));
    if (btnSubmitPool) btnSubmitPool.addEventListener('click', () => this.submitJoinPlayerPool());
  }
}

window.app = new CustomLobbiesApp();
document.addEventListener('DOMContentLoaded', () => window.app.init());
