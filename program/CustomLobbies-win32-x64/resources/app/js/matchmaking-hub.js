/* CustomLobbies.com - Dedicated Ranked Competitive Matchmaking Engine
 * Formations are directly in teams: Team Blue (Your Squad) vs Team Red (Opponents)
 * Automatically groups all party members together onto the same team.
 */
class MatchmakingHubEngine {
  constructor() {
    this.inQueue = false;
    this.queueTimer = null;
    this.queueSeconds = 0;
    this.selectedGame = 'Counter-Strike 2';
    this.selectedMode = '5v5 Premier Scrim';
    this.selectedRegion = 'US East (12ms)';
    this.targetPlayers = 10;
    this.teamCapacity = 5;

    // Team queues: Directly organized in teams
    this.teamBlue = []; // Your Team (Blue / Alpha) - Contains your party
    this.teamRed = [];  // Opponent Team (Red / Omega)

    // Opponent names pool for realistic team matchmaking fill
    this.opponentPool = [
      { name: 'S1mple_Fragger', avatar: '🎯', elo: 2850, role: 'AWP / Sniper' },
      { name: 'ZywOo_Master', avatar: '⚡', elo: 2810, role: 'Rifler / Carry' },
      { name: 'TenZ_Duelist', avatar: '🔥', elo: 2720, role: 'Entry Duelist' },
      { name: 'NiKo_Rifler', avatar: '💀', elo: 2690, role: 'IGL Captain' },
      { name: 'Faker_Mid', avatar: '👑', elo: 2900, role: 'Playmaker' },
      { name: 'Device_CS', avatar: '🏹', elo: 2480, role: 'Support Anchor' },
      { name: 'Shroud_Echo', avatar: '🕶️', elo: 2540, role: 'Flex Fragger' },
      { name: 'Valkyrie_CS', avatar: '🛡️', elo: 2380, role: 'Site Anchor' },
      { name: 'Ghost_Scout', avatar: '👻', elo: 2540, role: 'Recon Lead' },
      { name: 'IronClad_Gunner', avatar: '🤖', elo: 2590, role: 'Heavy Support' }
    ];

    // Recent Match History Scorecards
    try {
      const savedHistory = localStorage.getItem('cl_mm_match_history');
      this.matchHistory = savedHistory ? JSON.parse(savedHistory) : [];
    } catch(e) {
      this.matchHistory = [];
    }
  }

  // Start Searching for Match - Directly in Teams
  startMatchmakingQueue(gameName, modeName, regionName) {
    if (this.inQueue) return;

    this.selectedGame = gameName || this.selectedGame;
    this.selectedMode = modeName || this.selectedMode;
    this.selectedRegion = regionName || this.selectedRegion;
    
    // Determine capacity per team
    if (this.selectedMode.includes('2v2')) {
      this.targetPlayers = 4;
      this.teamCapacity = 2;
    } else if (this.selectedMode.includes('1v1')) {
      this.targetPlayers = 2;
      this.teamCapacity = 1;
    } else if (this.selectedMode.includes('3v3')) {
      this.targetPlayers = 6;
      this.teamCapacity = 3;
    } else {
      this.targetPlayers = 10;
      this.teamCapacity = 5;
    }

    this.inQueue = true;
    this.queueSeconds = 0;

    // 1. Initialize Team Blue directly with YOUR PARTY
    this.teamBlue = [];
    this.teamRed = [];

    const partyMembers = (window.partyEngine && typeof window.partyEngine.getMembers === 'function')
      ? window.partyEngine.getMembers()
      : [{ name: 'You (Host)', avatar: '👑', elo: 2150, role: 'Party Leader', isParty: true }];

    // Add all party members to Team Blue (up to team capacity)
    partyMembers.forEach(m => {
      if (this.teamBlue.length < this.teamCapacity) {
        this.teamBlue.push({
          name: m.name,
          avatar: m.avatar || '🎮',
          elo: m.elo || 2150,
          role: m.role || 'Party Member',
          isParty: true,
          isLeader: m.isLeader || false
        });
      }
    });

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('queue_join');
    }

    if (window.partyEngine && typeof window.partyEngine.showToast === 'function') {
      window.partyEngine.showToast(`⚡ Entire Party Queued into Team Blue (${this.teamBlue.length}/${this.teamCapacity}) for ${this.selectedGame}!`, 'success');
    }

    // Set Discord Rich Presence
    if (window.discordActivityEngine) {
      window.discordActivityEngine.setActivity({
        details: `Queueing ${this.selectedGame} (${this.selectedMode})`,
        state: `Direct Teams: Blue vs Red • Party of ${this.teamBlue.length}`,
        party: { size: [this.teamBlue.length + this.teamRed.length, this.targetPlayers] }
      });
    }

    // Shuffle opponent candidates
    const shuffledOpponents = [...this.opponentPool].sort(() => 0.5 - Math.random());
    let oppIdx = 0;

    this.queueTimer = setInterval(() => {
      this.queueSeconds++;

      // Simulate team filling every 1-2 seconds
      if (this.queueSeconds % 2 === 0) {
        // Fill Team Red first (opponents)
        if (this.teamRed.length < this.teamCapacity && oppIdx < shuffledOpponents.length) {
          const candidate = shuffledOpponents[oppIdx++];
          this.teamRed.push({
            name: candidate.name,
            avatar: candidate.avatar,
            elo: candidate.elo,
            role: candidate.role,
            isParty: false
          });
        }
        // Fill any open spots on Team Blue with solo queued teammates
        else if (this.teamBlue.length < this.teamCapacity && oppIdx < shuffledOpponents.length) {
          const candidate = shuffledOpponents[oppIdx++];
          this.teamBlue.push({
            name: candidate.name,
            avatar: candidate.avatar,
            elo: candidate.elo,
            role: candidate.role,
            isParty: false
          });
        }
      }

      this.updateRadarUI();

      // Trigger Match Found when both teams are full
      if (this.teamBlue.length >= this.teamCapacity && this.teamRed.length >= this.teamCapacity) {
        this.stopMatchmakingQueue(false);
        if (window.widgetBuilderEngine) {
          window.widgetBuilderEngine.playSoundEffect('lobby_start');
        }
        if (window.app && window.app.triggerMatchFoundModal) {
          window.app.triggerMatchFoundModal(`${this.selectedGame} • ${this.selectedMode} [Team Blue vs Team Red]`);
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

    if (manualCancel && window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('button_click');
    }

    if (window.discordActivityEngine) {
      window.discordActivityEngine.setActivity({
        details: 'CustomLobbies Community Hub',
        state: 'Ready to Scrim'
      });
    }

    this.updateRadarUI();
  }

  // Update Radar UI Display with direct Team Blue vs Team Red formation
  updateRadarUI() {
    const banner = document.getElementById('matchmakingRadarBanner');
    const timerDisplay = document.getElementById('mmSearchTimerDisplay');
    const countDisplay = document.getElementById('mmPlayerCountDisplay');
    const btnFind = document.getElementById('btnStartMatchmakingAction');
    const btnCancel = document.getElementById('btnCancelMatchmakingAction');
    const teamsContainer = document.getElementById('mmTeamsQueueContainer');

    const totalFound = this.teamBlue.length + this.teamRed.length;
    const mins = Math.floor(this.queueSeconds / 60).toString().padStart(2, '0');
    const secs = (this.queueSeconds % 60).toString().padStart(2, '0');

    if (timerDisplay) timerDisplay.textContent = `⏱️ ${mins}:${secs}`;
    if (countDisplay) {
      countDisplay.textContent = `${totalFound} / ${this.targetPlayers} Players Found • Blue: ${this.teamBlue.length}/${this.teamCapacity} | Red: ${this.teamRed.length}/${this.teamCapacity}`;
    }

    if (banner) {
      banner.style.display = this.inQueue ? 'block' : 'none';
    }

    if (teamsContainer) {
      teamsContainer.innerHTML = this.renderQueueTeamsHTML();
    }

    if (btnFind && btnCancel) {
      btnFind.style.display = this.inQueue ? 'none' : 'flex';
      btnCancel.style.display = this.inQueue ? 'flex' : 'none';
    }
  }

  // Render direct Team Blue and Team Red side-by-side inside the queue radar banner
  renderQueueTeamsHTML() {
    const cap = this.teamCapacity;

    const renderTeamSlots = (teamList, isBlue) => {
      let slots = [];
      for (let i = 0; i < cap; i++) {
        if (i < teamList.length) {
          const p = teamList[i];
          const isParty = p.isParty;
          slots.push(`
            <div style="display: flex; align-items: center; justify-content: space-between; background: ${isBlue ? (isParty ? 'rgba(0, 242, 254, 0.18)' : 'rgba(0, 242, 254, 0.08)') : 'rgba(255, 82, 82, 0.1)'}; border: 1px solid ${isBlue ? (isParty ? 'var(--accent-cyan)' : 'rgba(0, 242, 254, 0.3)') : 'rgba(255, 82, 82, 0.3)'}; padding: 0.4rem 0.6rem; border-radius: 6px;">
              <div style="display: flex; align-items: center; gap: 0.45rem;">
                <span style="font-size: 1rem;">${p.avatar || '🎮'}</span>
                <div>
                  <div style="font-size: 0.82rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 0.3rem;">
                    ${p.name}
                    ${isParty ? '<span style="font-size: 0.6rem; background: rgba(168, 85, 247, 0.3); color: #d8b4fe; padding: 0.05rem 0.25rem; border-radius: 3px; font-weight: 900;">PARTY</span>' : ''}
                  </div>
                  <div style="font-size: 0.68rem; color: var(--text-muted);">${p.role || 'Member'}</div>
                </div>
              </div>
              <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 800;">${p.elo || 2200}</span>
            </div>
          `);
        } else {
          // Open slot
          slots.push(`
            <div style="display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.02); border: 1px dashed ${isBlue ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255, 82, 82, 0.25)'}; padding: 0.4rem 0.6rem; border-radius: 6px; color: var(--text-dim); font-size: 0.75rem; font-weight: 600;">
              <span>⏳ Searching player...</span>
            </div>
          `);
        }
      }
      return slots.join('');
    };

    return `
      <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; margin-top: 1rem; background: rgba(0,0,0,0.4); padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border-color);">
        <!-- Team Blue (Your Squad) -->
        <div style="background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 8px; padding: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(0, 242, 254, 0.2); padding-bottom: 0.35rem;">
            <span style="font-size: 0.85rem; font-weight: 900; color: var(--accent-cyan); display: flex; align-items: center; gap: 0.35rem;">
              <span>🔵</span> TEAM ALPHA (YOUR SQUAD)
            </span>
            <span style="font-size: 0.75rem; font-weight: 800; color: #fff;">${this.teamBlue.length} / ${cap}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            ${renderTeamSlots(this.teamBlue, true)}
          </div>
        </div>

        <!-- Center VS Badge -->
        <div style="text-align: center;">
          <div style="font-size: 1.3rem; font-weight: 900; color: var(--accent-gold); text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);">VS</div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.2rem;">BALANCED ELO</div>
        </div>

        <!-- Team Red (Opponents) -->
        <div style="background: rgba(255, 82, 82, 0.05); border: 1px solid rgba(255, 82, 82, 0.3); border-radius: 8px; padding: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(255, 82, 82, 0.2); padding-bottom: 0.35rem;">
            <span style="font-size: 0.85rem; font-weight: 900; color: var(--accent-red); display: flex; align-items: center; gap: 0.35rem;">
              <span>🔴</span> TEAM OMEGA (OPPONENTS)
            </span>
            <span style="font-size: 0.75rem; font-weight: 800; color: #fff;">${this.teamRed.length} / ${cap}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            ${renderTeamSlots(this.teamRed, false)}
          </div>
        </div>
      </div>
    `;
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
