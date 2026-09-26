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
    try {
      const savedHistory = localStorage.getItem('cl_mm_match_history');
      this.matchHistory = savedHistory ? JSON.parse(savedHistory) : [];
    } catch(e) {
      this.matchHistory = [];
    }
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
    try {
      localStorage.setItem('cl_mm_match_history', JSON.stringify(this.matchHistory));
    } catch(e) {}
  }
}

// Global Export
window.matchmakingHubEngine = new MatchmakingHubEngine();
