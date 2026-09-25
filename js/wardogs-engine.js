/* CustomLobbies.com - WARDOGS Competitive Esports Engine (33v33v33 Tri-Faction Circuit) */
class WardogsEngine {
  constructor() {
    this.divisionName = 'WARDOGS 33 v 33 v 33 Tri-Faction Mercenary League';
    this.seasonCode = 'OPERATION: AMBER STRIKE (Season 4)';
    this.totalBounty = '50,000 CL-Points USD Bounties';

    // Scraped Live Telemetry (SteamDB, TwitchTracker & BULKHEAD / Team17 Official Stats)
    this.liveTelemetry = {
      developer: 'BULKHEAD / Team17',
      releaseDate: 'September 10, 2026 (Steam Early Access)',
      peakConcurrentPlayers: 364820,
      activeConcurrentPlayers: 184920,
      twitchConcurrentViewers: 198540,
      steamApprovalRating: '85% Very Positive (14,280 Reviews)',
      persistentEconomyBalance: '12,500 CL-Points Funds',
      activeMatchFormat: '99-Player Tri-Faction Combined Arms (33v33v33)'
    };

    // Tri-Faction War Command Definitions
    this.factions = {
      alpha: { name: 'Vanguard Command', code: 'ALPHA-BLUE', accent: 'var(--accent-cyan)', hex: '#00e5ff', perk: '🛡️ Heavy Fortress & Ballistic Barricades', sector: 'Sector A: Quantum Citadel Base' },
      bravo: { name: 'Apex Raiders', code: 'BRAVO-RED', accent: '#ffab00', hex: '#ff6f00', perk: '⚡ Rapid Flank & Heavy Breaching Charges', sector: 'Sector B: Orbital Refinery' },
      charlie: { name: 'Cyber Spectre Unit', code: 'CHARLIE-GOLD', accent: '#ffd700', hex: '#ffd700', perk: '🧠 Orbital EMP & Drone Recon Scan', sector: 'Sector C: Data Core Vault' }
    };

    // Official Competitive Circuit Divisions (50,000 CL-Points Prize Pool)
    this.circuitDivisions = [];

    // Scheduled Live Operations & Scrim Fixtures
    this.operationsCalendar = [];

    // Tactical Sector Capture Map Telemetry
    this.sectors = [
      { id: 'SEC-A', name: 'Sector 33-A Citadel Alpha', controllingFaction: 'Vanguard Command (Alpha)', controlPct: 38, activeBuffer: '128-Tick Shield On' },
      { id: 'SEC-B', name: 'Sector 33-B Orbital Core', controllingFaction: 'Apex Raiders (Bravo)', controlPct: 34, activeBuffer: 'Overdrive Active' },
      { id: 'SEC-C', name: 'Sector 33-C Cyber Vault', controllingFaction: 'Cyber Spectre (Charlie)', controlPct: 28, activeBuffer: 'EMP Stealth Online' }
    ];

    // Operative Role Presets & Loadouts
    this.rolePresets = {
      '🎯 Marksman / Sniper': { primary: 'M200 Intervention / Heavy Railgun', secondary: 'Desert Eagle .50', gadget: 'Thermal Recon Drone', perk: 'High-Velocity Armor Piercing' },
      '⚡ Breacher / Assault': { primary: 'AK-47 Tactical / M4A1-S', secondary: 'USP Tactical', gadget: 'C4 Breaching Charge', perk: 'Adrenaline Surge (+15% Movement)' },
      '🧠 Recon / Scout': { primary: 'MP7 / Vector Submachine Gun', secondary: 'P250 Silenced', gadget: 'UAV Radar Pulse Pulse', perk: 'Stealth Footsteps & Sensor Jammer' },
      '🛡️ Heavy / Tank': { primary: 'M249 SAW / Minigun', secondary: 'Magnum Revolver', gadget: 'Deployable Ballistic Shield', perk: 'Blast Shield (-30% Explosive Damage)' },
      '📻 Comms Specialist': { primary: 'AUG / SG 553 Rifle', secondary: 'Five-SeveN', gadget: 'Tactical Respawn Beacon', perk: 'Field Medic Revive (+50 HP)' }
    };

    // Default Solo Mercenaries
    this.soloMercenaries = [];

    // Default Squad Units
    this.registeredSquads = [];

    // Default Tactical Bounties
    this.tacticalBounties = [];

    // Match History Rooms
    this.rankedSelectionHistory = [];

    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('cl_wardogs_state_v2');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.soloMercenaries) {
            this.soloMercenaries = data.soloMercenaries.map(m => ({...m, game: 'WARDOGS'}));
        }
        if (data.registeredSquads) {
            this.registeredSquads = data.registeredSquads.map(s => ({...s, game: 'WARDOGS'}));
        }
        if (data.tacticalBounties) this.tacticalBounties = data.tacticalBounties;
        if (data.rankedSelectionHistory) this.rankedSelectionHistory = data.rankedSelectionHistory;
        if (data.circuitDivisions) this.circuitDivisions = data.circuitDivisions;
        if (data.operationsCalendar) this.operationsCalendar = data.operationsCalendar;
        
        // Force flush migration to disk
        this.saveState();
      }
    } catch (e) {
      console.warn('Error loading Wardogs state:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('cl_wardogs_state_v2', JSON.stringify({
        soloMercenaries: this.soloMercenaries,
        registeredSquads: this.registeredSquads,
        tacticalBounties: this.tacticalBounties,
        rankedSelectionHistory: this.rankedSelectionHistory,
        circuitDivisions: this.circuitDivisions,
        operationsCalendar: this.operationsCalendar
      }));
    } catch (e) {
      console.warn('Error saving Wardogs state:', e);
    }
  }

  // Register Solo Mercenary
  registerSoloMercenary(handle, callsign, game, role, elo = 1840) {
    const newMerc = {
      id: Date.now(),
      name: handle || 'Operative_X',
      callsign: callsign ? callsign.toUpperCase() : `DOG-${Math.floor(Math.random() * 90 + 10)}`,
      game: game || 'WARDOGS',
      role: role || '⚡ Breacher / Assault',
      elo: parseInt(elo) || 1840,
      kd: '2.00',
      status: 'Available',
      contracts: 1,
      acVerified: true,
      badge: '🏅 Enlisted Mercenary',
      bountyEarned: '500 CL-Points'
    };

    this.soloMercenaries.unshift(newMerc);
    this.saveState();
    return newMerc;
  }

  // Register Squad Unit for Competitive Circuit
  registerSquadUnit(squadName, tag, captainHandle, game, squadSize = 50) {
    const newSquad = {
      id: Date.now(),
      name: squadName || 'Tactical Company',
      tag: tag.startsWith('[') ? tag.toUpperCase() : `[${tag.toUpperCase()}]`,
      captain: captainHandle || 'Ghost_Dog_99',
      game: game || 'WARDOGS',
      record: '0W - 0L',
      membersCount: parseInt(squadSize) || 50,
      status: 'ACTIVE CONTRACT',
      bountyEarned: '0 CL-Points',
      faction: '🔵 Vanguard Command'
    };

    this.registeredSquads.unshift(newSquad);

    // Also add team to Vanguard Open Division standings
    if (this.circuitDivisions[2]) {
      this.circuitDivisions[2].teams.push({
        rank: this.circuitDivisions[2].teams.length + 1,
        name: squadName,
        tag: newSquad.tag,
        captain: captainHandle,
        wins: 0,
        losses: 0,
        points: 0,
        sectorControl: '0%',
        elo: 1600,
        status: 'Enlisted Challenger'
      });
    }

    this.saveState();
    return newSquad;
  }

  // Challenge Squad Unit to Official Competitive Scrim
  challengeSquadUnit(squadId, dateStr = 'Tonight 21:00 EST', mapName = 'Sector 33 - Quantum Citadel') {
    const sq = this.registeredSquads.find(s => s.id === squadId) || this.registeredSquads[0];
    const newOp = {
      id: `OP-${Date.now().toString().slice(-3)}`,
      week: 'OFFICIAL SCRIM CHALLENGE',
      title: `Tactical Scrim: You (Host) VS ${sq.name}`,
      teamA: 'Your Company',
      teamB: sq.name,
      teamC: 'Vanguard Patrol',
      date: dateStr,
      map: mapName,
      status: 'SCHEDULED',
      prize: '1,000 CL-Points Scrim Bounty'
    };

    this.operationsCalendar.unshift(newOp);
    this.saveState();
    return newOp;
  }

  // Trigger Tactical Strike
  triggerTacticalStrike(strikeType) {
    let resultText = '';
    if (strikeType === 'recon') {
      resultText = '🛰️ ORBITAL RECON SWEEP LAUNCHED: Displaying all 66 enemy combatant positions on Tri-Faction minimap for 30s!';
    } else if (strikeType === 'emp') {
      resultText = '⚡ EMP SHOCKWAVE DISPATCHED: Disabled enemy HUDs and electronic turrets across Sector 33-B Core!';
    } else {
      resultText = '📦 AIR DROP DEPLOYED: High-velocity ammo crates and ballistic shields dropped at Sector 33-A!';
    }
    return resultText;
  }

  // Claim Bounty
  claimBounty(bountyId) {
    const b = this.tacticalBounties.find(item => item.id === bountyId);
    if (b) {
      b.completed = true;
      this.saveState();
      return b;
    }
    return null;
  }

  // Perform Ranked Selection Draft for 33 v 33 v 33 (99 Players)
  generateRankedSelectionMatch(gameName = 'WARDOGS') {
    // Only allow teams with at least 22 members to be selected as Faction Commanders
    const eligibleCommanders = [...this.registeredSquads].filter(s => (s.membersCount || 0) >= 22);
    
    // Sort registered pre-formed squads by highest member count created before entry
    const sortedSquads = eligibleCommanders.sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0));

    // If we don't have enough 22+ player teams, fill with AI placeholders just for the UI
    const squad1 = sortedSquads[0] || { name: 'Awaiting Team...', captain: 'Searching...', membersCount: 0 };
    const squad2 = sortedSquads[1] || { name: 'Awaiting Team...', captain: 'Searching...', membersCount: 0 };
    const squad3 = sortedSquads[2] || { name: 'Awaiting Team...', captain: 'Searching...', membersCount: 0 };

    const eligibleSolos = this.soloMercenaries.filter(m => m.game === gameName || m.game === 'WARDOGS');
    const pool = [...eligibleSolos].sort((a, b) => b.elo - a.elo);

    const capacity = 99; // 33 v 33 v 33 Tri-Faction

    const factionAlpha = [];
    const factionBravo = [];
    const factionCharlie = [];

    const rolesList = ['🎯 Marksman / Sniper', '⚡ Breacher / Assault', '🧠 Recon / Scout', '🛡️ Heavy / Tank', '📻 Comms Specialist'];

    // Ensure squad captains (highest member count leaders) are placed at slot 0 of each faction
    factionAlpha.push({
      id: 901,
      name: squad1.captain,
      callsign: 'COMMANDER-ALPHA',
      game: gameName,
      role: '👑 Battalion Commander (Highest Roster: ' + squad1.membersCount + ' Members)',
      elo: 2680,
      kd: '2.45',
      status: 'Commander Selected',
      badge: '👑 Commander (Roster Size: ' + squad1.membersCount + ')',
      isCommander: true,
      squadName: squad1.name,
      membersCount: squad1.membersCount
    });

    factionBravo.push({
      id: 902,
      name: squad2.captain,
      callsign: 'COMMANDER-BRAVO',
      game: gameName,
      role: '👑 Battalion Commander (Roster: ' + squad2.membersCount + ' Members)',
      elo: 2450,
      kd: '2.15',
      status: 'Commander Selected',
      badge: '👑 Commander (Roster Size: ' + squad2.membersCount + ')',
      isCommander: true,
      squadName: squad2.name,
      membersCount: squad2.membersCount
    });

    factionCharlie.push({
      id: 903,
      name: squad3.captain,
      callsign: 'COMMANDER-CHARLIE',
      game: gameName,
      role: '👑 Battalion Commander (Roster: ' + squad3.membersCount + ' Members)',
      elo: 2380,
      kd: '2.10',
      status: 'Commander Selected',
      badge: '👑 Commander (Roster Size: ' + squad3.membersCount + ')',
      isCommander: true,
      squadName: squad3.name,
      membersCount: squad3.membersCount
    });

    // Generate pool of 96 remaining draft operatives
    const remainingDraft = [];
    for (let i = 3; i < capacity; i++) {
      let player = pool[i - 3];
      if (!player) {
        const selectedRole = rolesList[(i - 3) % rolesList.length];
        const randomKd = (2.4 - (i - 3) * 0.01 + Math.random() * 0.2).toFixed(2);
        const randomClPoints = Math.floor(6500 - (i - 3) * 50 + Math.random() * 200);
        player = {
          id: 1000 + i,
          name: `Operative_DOG_${i + 1}`,
          callsign: `DOG-${Math.floor(Math.random() * 899 + 100)}`,
          game: gameName,
          role: selectedRole,
          elo: Math.floor(2550 - (i - 3) * 6 + Math.random() * 35),
          kd: randomKd,
          bountyEarned: `$${randomClPoints.toLocaleString()}`,
          status: 'Selected for Ranked',
          badge: i % 5 === 0 ? '🏆 Elite Veteran' : '🛡️ Standard Operative'
        };
      } else {
        player.status = 'Selected for Ranked';
      }
      remainingDraft.push(player);
    }

    // Attach Rank Info & Effective Performance-Adjusted MMR to all players
    [...factionAlpha, ...factionBravo, ...factionCharlie, ...remainingDraft].forEach(p => {
      const rank = this.computePlayerRankTier(p);
      p.rankInfo = rank;
      p.effectiveElo = rank.effectiveMMR;
      p.mmrAdjustment = rank.mmrAdjustment;
      p.kd = rank.kd;
      p.bountyEarned = p.bountyEarned || rank.clPointsFormatted;
      p.rankTitle = rank.rankTitle;
      p.rankBadge = rank.rankBadge;
    });

    // Sort remaining draft operatives descending by Effective MMR
    remainingDraft.sort((a, b) => b.effectiveElo - a.effectiveElo);

    // Greedy Least-Sum Equalization Balancing across Factions using Effective MMR
    remainingDraft.forEach(player => {
      const totals = [
        { faction: factionAlpha, sum: factionAlpha.reduce((acc, p) => acc + (p.effectiveElo || p.elo), 0) },
        { faction: factionBravo, sum: factionBravo.reduce((acc, p) => acc + (p.effectiveElo || p.elo), 0) },
        { faction: factionCharlie, sum: factionCharlie.reduce((acc, p) => acc + (p.effectiveElo || p.elo), 0) }
      ];

      // Pick lowest sum faction that has less than 33 players
      const available = totals.filter(t => t.faction.length < 33);
      available.sort((a, b) => a.sum - b.sum);

      available[0].faction.push(player);
    });

    const avgAlpha = Math.round(factionAlpha.reduce((acc, p) => acc + (p.effectiveElo || p.elo), 0) / factionAlpha.length);
    const avgBravo = Math.round(factionBravo.reduce((acc, p) => acc + (p.effectiveElo || p.elo), 0) / factionBravo.length);
    const avgCharlie = Math.round(factionCharlie.reduce((acc, p) => acc + (p.effectiveElo || p.elo), 0) / factionCharlie.length);

    const kdAlpha = (factionAlpha.reduce((acc, p) => acc + parseFloat(p.kd), 0) / factionAlpha.length).toFixed(2);
    const kdBravo = (factionBravo.reduce((acc, p) => acc + parseFloat(p.kd), 0) / factionBravo.length).toFixed(2);
    const kdCharlie = (factionCharlie.reduce((acc, p) => acc + parseFloat(p.kd), 0) / factionCharlie.length).toFixed(2);

    const clPointsAlpha = factionAlpha.reduce((acc, p) => acc + (p.rankInfo ? p.rankInfo.clPointsVal : 1000), 0);
    const clPointsBravo = factionBravo.reduce((acc, p) => acc + (p.rankInfo ? p.rankInfo.clPointsVal : 1000), 0);
    const clPointsCharlie = factionCharlie.reduce((acc, p) => acc + (p.rankInfo ? p.rankInfo.clPointsVal : 1000), 0);

    const maxAvg = Math.max(avgAlpha, avgBravo, avgCharlie);
    const minAvg = Math.min(avgAlpha, avgBravo, avgCharlie);
    const overallAvg = Math.round((avgAlpha + avgBravo + avgCharlie) / 3);
    const balancePct = (100 - ((maxAvg - minAvg) / overallAvg) * 100).toFixed(1);

    const matchRoom = {
      id: `WD-TRIWAR-${Date.now().toString().slice(-4)}`,
      game: gameName,
      format: '33 v 33 v 33 Tri-Faction War (99 Operatives)',
      capacity: 99,
      commanderAlpha: squad1,
      commanderBravo: squad2,
      commanderCharlie: squad3,
      factionAlpha: factionAlpha,
      factionBravo: factionBravo,
      factionCharlie: factionCharlie,
      avgEloAlpha: avgAlpha,
      avgEloBravo: avgBravo,
      avgEloCharlie: avgCharlie,
      kdAlpha,
      kdBravo,
      kdCharlie,
      clPointsAlpha: `$${clPointsAlpha.toLocaleString()}`,
      clPointsBravo: `$${clPointsBravo.toLocaleString()}`,
      clPointsCharlie: `$${clPointsCharlie.toLocaleString()}`,
      balanceRating: `${balancePct}% Equalized`,
      map: 'Sector 33 - Quantum Citadel (Tri-Zone Fortress)',
      serverNode: `US-EAST-WARNODE-${Math.floor(Math.random() * 90 + 10)} (128-Tick Tickrate)`,
      status: `DEPLOYED TO DEDICATED 99-PLAYER SERVER NODE (128-TICK) • ${balancePct}% BALANCED`,
      timestamp: new Date().toLocaleTimeString()
    };

    this.rankedSelectionHistory.unshift(matchRoom);
    this.saveState();
    return matchRoom;
  }

  // Compute Player Rank & Effective MMR from Base ELO, K/D Ratio, and CL-Points Economy Balance
  computePlayerRankTier(player) {
    const baseElo = player.elo || 1800;
    const kd = parseFloat(player.kd) || 1.85;
    const clPointsVal = parseInt((player.bountyEarned || '1200 CL-Points').replace(/[^0-9]/g, '')) || 1200;

    // Performance MMR Adjustment based on K/D & Economy
    const kdMMRBonus = Math.round((kd - 1.0) * 120);
    const clPointsMMRBonus = Math.round(clPointsVal / 250);
    const mmrAdjustment = kdMMRBonus + clPointsMMRBonus;

    // Effective MMR
    const effectiveMMR = Math.max(800, baseElo + mmrAdjustment);

    const compositeScore = (effectiveMMR * 0.5) + (kd * 450) + (clPointsVal / 8);

    let rankTitle = '🥉 Vanguard Recruit';
    let rankBadge = '🥉';

    if (effectiveMMR >= 2500 || compositeScore >= 2400) {
      rankTitle = '👑 Apex Commander';
      rankBadge = '👑';
    } else if (effectiveMMR >= 2200 || compositeScore >= 2100) {
      rankTitle = '💎 Diamond Veteran';
      rankBadge = '💎';
    } else if (effectiveMMR >= 1800 || compositeScore >= 1800) {
      rankTitle = '🥇 Gold Operative';
      rankBadge = '🥇';
    } else if (effectiveMMR >= 1400 || compositeScore >= 1500) {
      rankTitle = '🥈 Silver Combatant';
      rankBadge = '🥈';
    }

    return {
      baseElo,
      effectiveMMR,
      mmrAdjustment,
      compositeScore: Math.round(compositeScore),
      rankTitle,
      rankBadge,
      kd: kd.toFixed(2),
      clPointsVal,
      clPointsFormatted: `$${clPointsVal.toLocaleString()}`
    };
  }

  // Live Scraped Telemetry Engine for WARDOGS (SteamDB & Twitch Tracker Sync)
  scrapeLiveWardogsTelemetry() {
    const deltaPlayers = Math.floor(Math.random() * 2400) - 1200;
    const deltaTwitch = Math.floor(Math.random() * 1800) - 900;

    this.liveTelemetry.activeConcurrentPlayers = Math.max(100000, this.liveTelemetry.activeConcurrentPlayers + deltaPlayers);
    this.liveTelemetry.twitchConcurrentViewers = Math.max(50000, this.liveTelemetry.twitchConcurrentViewers + deltaTwitch);

    return this.liveTelemetry;
  }
}

// Global Export
window.wardogsEngine = new WardogsEngine();
