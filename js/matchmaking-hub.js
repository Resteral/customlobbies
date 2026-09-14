/* CustomLobbies.com - Dedicated Ranked Competitive Matchmaking Engine */
class MatchmakingHubEngine {
  constructor() {
    this.inQueue = false;
    this.queueTimer = null;
    this.queueSeconds = 0;
    this.selectedGame = 'Counter-Strike 2';
    this.selectedMode = '5v5 Premier Scrim';
    this.selectedRegion = 'US East (12ms)';
    this.playersFound = 0;
    this.targetPlayers = 10;
    this.partyMembers = ['You (Host)'];

    // Recent Match History Scorecards
    this.matchHistory = [
      { id: 'MM-9042', game: 'Counter-Strike 2', mode: '5v5 Premier', map: 'de_mirage', result: 'VICTORY 13 - 9', eloChange: '+25 ELO', mvp: 'RadiantReaper', date: '20 mins ago' },
      { id: 'MM-9039', game: 'Slapshot: Rebound', mode: '3v3 Arcade', map: 'Puck Arena Stadium', result: 'VICTORY 5 - 2', eloChange: '+20 ELO', mvp: 'PuckMaster99', date: '2 hours ago' },
      { id: 'MM-9031', game: 'Empulse', mode: '5v5 Premier', map: 'Empulse Facility', result: 'DEFEAT 11 - 13', eloChange: '-15 ELO', mvp: 'Empulse_Overlord', date: '5 hours ago' },
      { id: 'MM-9025', game: 'REMATCH', mode: '5v5 Premier', map: 'Nexus Arena', result: 'VICTORY 13 - 7', eloChange: '+28 ELO', mvp: 'Rematch_God', date: '1 day ago' }
    ];
  }

  // Start Searching for Match
  startMatchmakingQueue(gameName, modeName, regionName) {
    if (this.inQueue) return;

    this.selectedGame = gameName || this.selectedGame;
    this.selectedMode = modeName || this.selectedMode;
    this.selectedRegion = regionName || this.selectedRegion;
    this.targetPlayers = (this.selectedMode.includes('2v2') ? 4 : this.selectedMode.includes('1v1') ? 2 : this.selectedMode.includes('3v3') ? 6 : 10);

    this.inQueue = true;
    this.queueSeconds = 0;
    this.playersFound = 1;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('hitmarker');
    }

    this.queueTimer = setInterval(() => {
      this.queueSeconds++;

      // Simulate player discovery
      if (this.queueSeconds % 2 === 0 && this.playersFound < this.targetPlayers) {
        this.playersFound += Math.floor(Math.random() * 2) + 1;
        if (this.playersFound > this.targetPlayers) this.playersFound = this.targetPlayers;
      }

      this.updateRadarUI();

      // Trigger Match Found when full
      if (this.playersFound >= this.targetPlayers) {
        this.stopMatchmakingQueue(false);
        if (window.app && window.app.triggerMatchFoundModal) {
          window.app.triggerMatchFoundModal(`${this.selectedGame} • ${this.selectedMode} (${this.selectedRegion})`);
        }
      }
    }, 1000);

    this.updateRadarUI();
  }

  // Stop / Cancel Queue
  stopMatchmakingQueue(manualCancel = true) {
    this.inQueue = false;
    if (this.queueTimer) clearInterval(this.queueTimer);
    this.queueSeconds = 0;
    this.playersFound = 0;

    if (manualCancel && window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('button_click');
    }

    this.updateRadarUI();
  }

  // Update Radar UI Display
  updateRadarUI() {
    const banner = document.getElementById('matchmakingRadarBanner');
    const timerDisplay = document.getElementById('mmSearchTimerDisplay');
    const countDisplay = document.getElementById('mmPlayerCountDisplay');
    const btnFind = document.getElementById('btnStartMatchmakingAction');
    const btnCancel = document.getElementById('btnCancelMatchmakingAction');

    const mins = Math.floor(this.queueSeconds / 60).toString().padStart(2, '0');
    const secs = (this.queueSeconds % 60).toString().padStart(2, '0');

    if (timerDisplay) timerDisplay.textContent = `⏱️ ${mins}:${secs}`;
    if (countDisplay) countDisplay.textContent = `${this.playersFound} / ${this.targetPlayers} Players Found`;

    if (banner) {
      if (this.inQueue) {
        banner.style.display = 'flex';
      } else {
        banner.style.display = 'none';
      }
    }

    if (btnFind && btnCancel) {
      if (this.inQueue) {
        btnFind.style.display = 'none';
        btnCancel.style.display = 'flex';
      } else {
        btnFind.style.display = 'flex';
        btnCancel.style.display = 'none';
      }
    }
  }

  // Add Completed Match to History
  addCompletedMatch(game, mode, result, eloChange) {
    const newMatch = {
      id: `MM-${Math.floor(Math.random() * 9000 + 1000)}`,
      game: game || 'Counter-Strike 2',
      mode: mode || '5v5 Premier',
      map: 'de_mirage',
      result: result || 'VICTORY 13 - 11',
      eloChange: eloChange || '+25 ELO',
      mvp: 'You (Host)',
      date: 'Just Now'
    };

    this.matchHistory.unshift(newMatch);
  }
}

// Global Export
window.matchmakingHubEngine = new MatchmakingHubEngine();
