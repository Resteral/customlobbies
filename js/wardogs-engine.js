/* CustomLobbies.com - WARDOGS Competitive Esports Engine (33v33v33 Tri-Faction Circuit) */
class WardogsEngine {
  constructor() {
    this.divisionName = 'WARDOGS 33 v 33 v 33 Tri-Faction Mercenary League';
    this.seasonCode = 'OPERATION: AMBER STRIKE (Season 4)';
    this.totalBounty = '$50,000 USD Bounties';

    // Tri-Faction War Command Definitions
    this.factions = {
      alpha: { name: 'Vanguard Command', code: 'ALPHA-BLUE', accent: 'var(--accent-cyan)', hex: '#00e5ff', perk: '🛡️ Heavy Fortress & Ballistic Barricades', sector: 'Sector A: Quantum Citadel Base' },
      bravo: { name: 'Apex Raiders', code: 'BRAVO-RED', accent: '#ffab00', hex: '#ff6f00', perk: '⚡ Rapid Flank & Heavy Breaching Charges', sector: 'Sector B: Orbital Refinery' },
      charlie: { name: 'Cyber Spectre Unit', code: 'CHARLIE-GOLD', accent: '#ffd700', hex: '#ffd700', perk: '🧠 Orbital EMP & Drone Recon Scan', sector: 'Sector C: Data Core Vault' }
    };

    // Official Competitive Circuit Divisions ($50,000 Prize Pool)
    this.circuitDivisions = [
      {
        id: 'apex-master',
        name: '🏆 Apex Master League (ELO 2200+)',
        prizePool: '$25,000 USD',
        teams: [
          { rank: 1, name: 'WARDOG Company Alpha', tag: '[WD-ALPHA]', captain: 'Ghost_Dog_99', wins: 18, losses: 2, points: 54, sectorControl: '42%', elo: 2680, status: '1st Place • Qualified' },
          { rank: 2, name: 'Iron Claw Battalion Bravo', tag: '[CLAW]', captain: 'Sargeant_Iron', wins: 15, losses: 3, points: 45, sectorControl: '36%', elo: 2450, status: '2nd Place • Qualified' },
          { rank: 3, name: 'Phantom Brigade Charlie', tag: '[K9-PHANTOM]', captain: 'Shadow_K9', wins: 14, losses: 4, points: 42, sectorControl: '32%', elo: 2380, status: 'Contender' },
          { rank: 4, name: 'Slapshot Cyber Hounds', tag: '[HOUNDS]', captain: 'Puck_Hunter', wins: 12, losses: 6, points: 36, sectorControl: '28%', elo: 2290, status: 'Contender' }
        ]
      },
      {
        id: 'dreadnought',
        name: '🥇 Dreadnought Division (ELO 1800+)',
        prizePool: '$15,000 USD',
        teams: [
          { rank: 1, name: 'Valkyrie Vanguard', tag: '[VALK]', captain: 'Valkyrie_Merc', wins: 11, losses: 2, points: 33, sectorControl: '38%', elo: 2150, status: 'Division Leader' },
          { rank: 2, name: 'Titan Armor Corps', tag: '[TITAN]', captain: 'Arkheron_Vanguard', wins: 9, losses: 4, points: 27, sectorControl: '30%', elo: 1980, status: 'Challenger' }
        ]
      },
      {
        id: 'vanguard-open',
        name: '🥉 Vanguard Open Division (Free Entry)',
        prizePool: '$10,000 USD',
        teams: [
          { rank: 1, name: 'Rookie Mercenaries', tag: '[RM]', wins: 7, losses: 1, points: 21, sectorControl: '45%', elo: 1650, status: 'Open Leader' }
        ]
      }
    ];

    // Scheduled Live Operations & Scrim Fixtures
    this.operationsCalendar = [
      { id: 'OP-401', week: 'WEEK 4 TRI-FACTION SIEGE', title: 'Operation Amber Strike: Citadel Core Siege', teamA: 'WARDOG Company Alpha', teamB: 'Iron Claw Battalion', teamC: 'Phantom Brigade', date: 'Tonight 20:00 EST', map: 'Sector 33 - Quantum Citadel', status: '🔴 LIVE BROADCAST', prize: '$5,000 Bounty Match' },
      { id: 'OP-402', week: 'WEEK 5 BATTALION SCRIM', title: 'Operation Cobalt Dawn: Sector B Assault', teamA: 'Valkyrie Vanguard', teamB: 'Titan Armor Corps', teamC: 'Slapshot Cyber Hounds', date: 'Tomorrow 21:00 EST', map: 'Sector 33 - Orbital Core', status: 'UPCOMING', prize: '$2,500 Bounty Match' }
    ];

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
    this.soloMercenaries = [
      { id: 101, name: 'Ghost_Dog_99', callsign: 'VIPER-1', game: 'Counter-Strike 2', role: '🎯 Marksman / Sniper', elo: 2580, kd: '2.35', status: 'Selected for Ranked', contracts: 42, acVerified: true, badge: '🏆 Season 3 Champion', bountyEarned: '$6,400' },
      { id: 102, name: 'Sargeant_Iron', callsign: 'HAMMER-6', game: 'Empulse', role: '⚡ Breacher / Assault', elo: 2450, kd: '2.10', status: 'Available', contracts: 38, acVerified: true, badge: '⚡ Demolitions Expert', bountyEarned: '$4,800' },
      { id: 103, name: 'Valkyrie_Merc', callsign: 'VALKYRIE-3', game: 'Valorant', role: '🧠 Recon / Scout', elo: 2390, kd: '1.95', status: 'Available', contracts: 29, acVerified: true, badge: '🎯 Intel Specialist', bountyEarned: '$3,200' },
      { id: 104, name: 'Shadow_K9', callsign: 'SPECTRE-4', game: 'REMATCH', role: '📻 Comms Specialist', elo: 2480, kd: '2.20', status: 'Selected for Ranked', contracts: 35, acVerified: true, badge: '📡 Tactical Commander', bountyEarned: '$5,100' }
    ];

    // Default Squad Units
    this.registeredSquads = [
      { id: 201, name: 'WARDOG Company Alpha', tag: '[WD-ALPHA]', captain: 'Ghost_Dog_99', game: 'Counter-Strike 2', record: '18W - 2L', membersCount: 33, status: 'SELECTED FOR RANKED', bountyEarned: '$12,500', faction: '🔵 Vanguard Command' },
      { id: 202, name: 'Iron Claw Battalion Bravo', tag: '[CLAW]', captain: 'Sargeant_Iron', game: 'Empulse', record: '15W - 3L', membersCount: 33, status: 'ACTIVE CONTRACT', bountyEarned: '$8,200', faction: '🔴 Apex Raiders' }
    ];

    // Default Tactical Bounties
    this.tacticalBounties = [
      { id: 'BNT-01', title: 'Capture Sector 33 Cyber Core', reward: '+250 🪙 CL-Points', cash: '$1,500 Cash', desc: 'Secure Sector 33-C for 5 consecutive rounds in Tri-Faction Warfare.', completed: false },
      { id: 'BNT-02', title: 'Orbital Recon Sweep', reward: '+150 🪙 CL-Points', cash: '$750 Cash', desc: 'Tag 25 enemy operatives using Thermal Recon Drones.', completed: false },
      { id: 'BNT-03', title: 'Battalion Scrim Victory', reward: '+500 🪙 CL-Points', cash: '$3,000 Cash', desc: 'Lead a 33-man Battalion to victory against 2 competing factions.', completed: true }
    ];

    // Match History Rooms
    this.rankedSelectionHistory = [];

    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('cl_wardogs_state_v2');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.soloMercenaries) this.soloMercenaries = data.soloMercenaries;
        if (data.registeredSquads) this.registeredSquads = data.registeredSquads;
        if (data.tacticalBounties) this.tacticalBounties = data.tacticalBounties;
        if (data.rankedSelectionHistory) this.rankedSelectionHistory = data.rankedSelectionHistory;
        if (data.circuitDivisions) this.circuitDivisions = data.circuitDivisions;
        if (data.operationsCalendar) this.operationsCalendar = data.operationsCalendar;
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
      game: game || 'Counter-Strike 2',
      role: role || '⚡ Breacher / Assault',
      elo: parseInt(elo) || 1840,
      kd: '2.00',
      status: 'Available',
      contracts: 1,
      acVerified: true,
      badge: '🏅 Enlisted Mercenary',
      bountyEarned: '$500'
    };

    this.soloMercenaries.unshift(newMerc);
    this.saveState();
    return newMerc;
  }

  // Register Squad Unit for Competitive Circuit
  registerSquadUnit(squadName, tag, captainHandle, game, squadSize = 33) {
    const newSquad = {
      id: Date.now(),
      name: squadName || 'Tactical Company',
      tag: tag.startsWith('[') ? tag.toUpperCase() : `[${tag.toUpperCase()}]`,
      captain: captainHandle || 'Ghost_Dog_99',
      game: game || 'Counter-Strike 2',
      record: '0W - 0L',
      membersCount: parseInt(squadSize) || 33,
      status: 'ACTIVE CONTRACT',
      bountyEarned: '$0',
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
      prize: '$1,000 Scrim Bounty'
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
  generateRankedSelectionMatch(gameName = 'Counter-Strike 2') {
    // Sort registered pre-formed squads by highest member count created before entry
    const sortedSquads = [...this.registeredSquads].sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0));

    const squad1 = sortedSquads[0] || { name: 'WARDOG Company Alpha', captain: 'Ghost_Dog_99', membersCount: 33 };
    const squad2 = sortedSquads[1] || { name: 'Iron Claw Battalion Bravo', captain: 'Sargeant_Iron', membersCount: 33 };
    const squad3 = sortedSquads[2] || { name: 'Phantom Brigade Charlie', captain: 'Shadow_K9', membersCount: 28 };

    const eligibleSolos = this.soloMercenaries.filter(m => m.game === gameName || m.game === 'Counter-Strike 2');
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

    for (let i = 3; i < capacity; i++) {
      let player = pool[i - 3];
      if (!player) {
        const selectedRole = rolesList[i % rolesList.length];
        player = {
          id: 1000 + i,
          name: `Operative_DOG_${i + 1}`,
          callsign: `DOG-${Math.floor(Math.random() * 899 + 100)}`,
          game: gameName,
          role: selectedRole,
          elo: Math.floor(2550 - i * 6 + Math.random() * 40),
          kd: (2.2 - i * 0.01).toFixed(2),
          status: 'Selected for Ranked',
          badge: i % 5 === 0 ? '🏆 Elite Veteran' : '🛡️ Standard Operative'
        };
      } else {
        player.status = 'Selected for Ranked';
      }

      if (i % 3 === 0) {
        factionAlpha.push(player);
      } else if (i % 3 === 1) {
        factionBravo.push(player);
      } else {
        factionCharlie.push(player);
      }
    }

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
      avgEloAlpha: Math.round(factionAlpha.reduce((acc, p) => acc + p.elo, 0) / factionAlpha.length),
      avgEloBravo: Math.round(factionBravo.reduce((acc, p) => acc + p.elo, 0) / factionBravo.length),
      avgEloCharlie: Math.round(factionCharlie.reduce((acc, p) => acc + p.elo, 0) / factionCharlie.length),
      map: 'Sector 33 - Quantum Citadel (Tri-Zone Fortress)',
      serverNode: `US-EAST-WARNODE-${Math.floor(Math.random() * 90 + 10)} (128-Tick Tickrate)`,
      status: 'DEPLOYED TO DEDICATED 99-PLAYER SERVER NODE (128-TICK)',
      timestamp: new Date().toLocaleTimeString()
    };

    this.rankedSelectionHistory.unshift(matchRoom);
    this.saveState();
    return matchRoom;
  }
}

// Global Export
window.wardogsEngine = new WardogsEngine();
