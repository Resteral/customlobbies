/* CustomLobbies.com - WARDOGS 33v33v33 (99-Player) Tri-Faction Tactical Engine */
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

    // Solo Mercenary Recruitment Pool
    this.soloMercenaries = [
      { id: 101, name: 'Ghost_Dog_99', callsign: 'VIPER-1', game: 'Counter-Strike 2', role: '🎯 Marksman / Sniper', elo: 2580, kd: '2.35', status: 'Selected for Ranked', contracts: 42, acVerified: true, badge: '🏆 Season 3 Champion', bountyEarned: '$6,400' },
      { id: 102, name: 'Sargeant_Iron', callsign: 'HAMMER-6', game: 'Empulse', role: '⚡ Breacher / Assault', elo: 2450, kd: '2.10', status: 'Available', contracts: 38, acVerified: true, badge: '⚡ Demolitions Expert', bountyEarned: '$4,800' },
      { id: 103, name: 'Valkyrie_Merc', callsign: 'VALKYRIE-3', game: 'Valorant', role: '🧠 Recon / Scout', elo: 2390, kd: '1.95', status: 'Available', contracts: 29, acVerified: true, badge: '🎯 Intel Specialist', bountyEarned: '$3,200' },
      { id: 104, name: 'Shadow_K9', callsign: 'SPECTRE-4', game: 'REMATCH', role: '📻 Comms Specialist', elo: 2480, kd: '2.20', status: 'Selected for Ranked', contracts: 35, acVerified: true, badge: '📡 Tactical Commander', bountyEarned: '$5,100' },
      { id: 105, name: 'Puck_Hunter', callsign: 'APEX-2', game: 'Slapshot: Rebound', role: '⚡ Breacher / Assault', elo: 2610, kd: '2.50', status: 'Selected for Ranked', contracts: 50, acVerified: true, badge: '🏒 Cyber Enforcer', bountyEarned: '$8,900' },
      { id: 106, name: 'Cursed_Operator', callsign: 'PHANTOM-5', game: 'Deadlock', role: '🎯 Marksman / Sniper', elo: 2250, kd: '1.85', status: 'Available', contracts: 18, acVerified: true, badge: '🎯 Lone Wolf', bountyEarned: '$2,100' },
      { id: 107, name: 'Arkheron_Vanguard', callsign: 'TITAN-7', game: 'Arkheron', role: '🛡️ Heavy / Tank', elo: 2310, kd: '2.05', status: 'Available', contracts: 24, acVerified: true, badge: '🛡️ Fortress Shield', bountyEarned: '$3,600' }
    ];

    // Registered Squad Units / Mercenary Battalions (33-Man Companies)
    this.registeredSquads = [
      { id: 201, name: 'WARDOG Company Alpha', tag: '[WD-ALPHA]', captain: 'Ghost_Dog_99', game: 'Counter-Strike 2', record: '18W - 2L', membersCount: 33, status: 'SELECTED FOR RANKED', bountyEarned: '$12,500', faction: '🔵 Vanguard Command' },
      { id: 202, name: 'Iron Claw Battalion Bravo', tag: '[CLAW]', captain: 'Sargeant_Iron', game: 'Empulse', record: '15W - 3L', membersCount: 33, status: 'ACTIVE CONTRACT', bountyEarned: '$8,200', faction: '🔴 Apex Raiders' },
      { id: 203, name: 'Phantom Brigade Charlie', tag: '[K9-PHANTOM]', captain: 'Shadow_K9', game: 'REMATCH', record: '14W - 1L', membersCount: 33, status: 'ACTIVE CONTRACT', bountyEarned: '$9,400', faction: '🟡 Cyber Spectre' },
      { id: 204, name: 'Slapshot Cyber Hounds', tag: '[HOUNDS]', captain: 'Puck_Hunter', game: 'Slapshot: Rebound', record: '12W - 0L', membersCount: 33, status: 'SELECTED FOR RANKED', bountyEarned: '$7,800', faction: '🔵 Vanguard Command' }
    ];

    // Active Tactical Bounties
    this.tacticalBounties = [
      { id: 'BNT-01', title: 'Capture Sector 33 Cyber Core', reward: '+250 🪙 CL-Points', cash: '$1,500 Cash', desc: 'Secure Sector 33-C for 5 consecutive rounds in Tri-Faction Warfare.', completed: false },
      { id: 'BNT-02', title: 'Orbital Recon Sweep', reward: '+150 🪙 CL-Points', cash: '$750 Cash', desc: 'Tag 25 enemy operatives using Thermal Recon Drones.', completed: false },
      { id: 'BNT-03', title: 'Battalion Scrim Victory', reward: '+500 🪙 CL-Points', cash: '$3,000 Cash', desc: 'Lead a 33-man Battalion to victory against 2 competing factions.', completed: true }
    ];

    // Active Ranked Selection Match Rooms
    this.rankedSelectionHistory = [];
  }

  // Register Solo Mercenary
  registerSoloMercenary(handle, callsign, game, role, elo = 1840) {
    const roleInfo = this.rolePresets[role] || this.rolePresets['⚡ Breacher / Assault'];
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
    return newMerc;
  }

  // Register Squad Unit
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
    return newSquad;
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
      return b;
    }
    return null;
  }

  // Perform Ranked Selection Draft for 33 v 33 v 33 (99 Players)
  generateRankedSelectionMatch(gameName = 'Counter-Strike 2') {
    const eligibleSolos = this.soloMercenaries.filter(m => m.game === gameName || m.game === 'Counter-Strike 2');
    const pool = [...eligibleSolos].sort((a, b) => b.elo - a.elo);

    const capacity = 99; // 33 v 33 v 33 Tri-Faction

    const factionAlpha = [];
    const factionBravo = [];
    const factionCharlie = [];

    const rolesList = ['🎯 Marksman / Sniper', '⚡ Breacher / Assault', '🧠 Recon / Scout', '🛡️ Heavy / Tank', '📻 Comms Specialist'];

    for (let i = 0; i < capacity; i++) {
      let player = pool[i];
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
    return matchRoom;
  }
}

// Global Export
window.wardogsEngine = new WardogsEngine();
