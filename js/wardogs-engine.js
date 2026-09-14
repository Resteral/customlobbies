/* CustomLobbies.com - WARDOGS Tactical Mercenary League & Ranked Selection Engine */
class WardogsEngine {
  constructor() {
    this.divisionName = 'WARDOGS Tactical Mercenary League';
    this.seasonCode = 'OPERATION: AMBER STRIKE (Season 4)';
    this.totalBounty = '$50,000 USD Bounties';

    // Solo Mercenary Recruitment Pool
    this.soloMercenaries = [
      { id: 101, name: 'Ghost_Dog_99', callsign: 'Viper-1', game: 'Counter-Strike 2', role: '🎯 Marksman / Sniper', elo: 2580, kd: '2.35', status: 'Selected for Ranked', contracts: 42, acVerified: true },
      { id: 102, name: 'Sargeant_Iron', callsign: 'Hammer-6', game: 'Empulse', role: '⚡ Breacher / Assault', elo: 2450, kd: '2.10', status: 'Available', contracts: 38, acVerified: true },
      { id: 103, name: 'Valkyrie_Merc', callsign: 'Valkyrie-3', game: 'Valorant', role: '🧠 Recon / Scout', elo: 2390, kd: '1.95', status: 'Available', contracts: 29, acVerified: true },
      { id: 104, name: 'Shadow_K9', callsign: 'Spectre-4', game: 'REMATCH', role: '📻 Comms Specialist', elo: 2480, kd: '2.20', status: 'Selected for Ranked', contracts: 35, acVerified: true },
      { id: 105, name: 'Puck_Hunter', callsign: 'Apex-2', game: 'Slapshot: Rebound', role: '⚡ Breacher / Assault', elo: 2610, kd: '2.50', status: 'Selected for Ranked', contracts: 50, acVerified: true },
      { id: 106, name: 'Cursed_Operator', callsign: 'Phantom-5', game: 'Deadlock', role: '🎯 Marksman / Sniper', elo: 2250, kd: '1.85', status: 'Available', contracts: 18, acVerified: true },
      { id: 107, name: 'Arkheron_Vanguard', callsign: 'Titan-7', game: 'Arkheron', role: '🛡️ Heavy / Tank', elo: 2310, kd: '2.05', status: 'Available', contracts: 24, acVerified: true }
    ];

    // Registered Squad Units / Mercenary Teams
    this.registeredSquads = [
      { id: 201, name: 'WARDOG Alpha Strike', tag: '[WD-ALPHA]', captain: 'Ghost_Dog_99', game: 'Counter-Strike 2', record: '18W - 2L', membersCount: 5, status: 'SELECTED FOR RANKED', bountyEarned: '$12,500' },
      { id: 202, name: 'Iron Claw Mercenaries', tag: '[CLAW]', captain: 'Sargeant_Iron', game: 'Empulse', record: '15W - 3L', membersCount: 5, status: 'ACTIVE CONTRACT', bountyEarned: '$8,200' },
      { id: 203, name: 'Phantom Unit K9', tag: '[K9-PHANTOM]', captain: 'Shadow_K9', game: 'REMATCH', record: '14W - 1L', membersCount: 5, status: 'ACTIVE CONTRACT', bountyEarned: '$9,400' },
      { id: 204, name: 'Slapshot Cyber Hounds', tag: '[HOUNDS]', captain: 'Puck_Hunter', game: 'Slapshot: Rebound', record: '12W - 0L', membersCount: 3, status: 'SELECTED FOR RANKED', bountyEarned: '$7,800' }
    ];

    // Active Ranked Selection Match Rooms
    this.rankedSelectionHistory = [];
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
      acVerified: true
    };

    this.soloMercenaries.unshift(newMerc);
    return newMerc;
  }

  // Register Squad Unit
  registerSquadUnit(squadName, tag, captainHandle, game, squadSize = 5) {
    const newSquad = {
      id: Date.now(),
      name: squadName || 'Tactical Squad',
      tag: tag.startsWith('[') ? tag.toUpperCase() : `[${tag.toUpperCase()}]`,
      captain: captainHandle || 'Ghost_Dog_99',
      game: game || 'Counter-Strike 2',
      record: '0W - 0L',
      membersCount: parseInt(squadSize) || 5,
      status: 'ACTIVE CONTRACT',
      bountyEarned: '$0'
    };

    this.registeredSquads.unshift(newSquad);
    return newSquad;
  }

  // Perform Ranked Selection Draft for a Game Title
  generateRankedSelectionMatch(gameName = 'Counter-Strike 2') {
    // Filter available solo combatants and squad captains for target game
    const eligibleSolos = this.soloMercenaries.filter(m => m.game === gameName || m.game === 'Counter-Strike 2');
    const eligibleSquads = this.registeredSquads.filter(s => s.game === gameName || s.game === 'Counter-Strike 2');

    // Sort by ELO
    const pool = [...eligibleSolos].sort((a, b) => b.elo - a.elo);
    const capacity = (gameName === 'Slapshot: Rebound' || gameName === 'Rocket League') ? 6 : 10;

    // Pick top combatants
    const selected = pool.slice(0, capacity);

    // Split into Fireteam Alpha and Fireteam Bravo
    const alpha = [];
    const bravo = [];

    selected.forEach((player, idx) => {
      if (idx % 2 === 0) {
        alpha.push(player);
      } else {
        bravo.push(player);
      }
      player.status = 'Selected for Ranked';
    });

    const matchRoom = {
      id: `WD-RANKED-${Date.now().toString().slice(-4)}`,
      game: gameName,
      capacity: capacity,
      fireteamAlpha: alpha,
      fireteamBravo: bravo,
      avgEloAlpha: Math.round(alpha.reduce((acc, p) => acc + p.elo, 0) / (alpha.length || 1)),
      avgEloBravo: Math.round(bravo.reduce((acc, p) => acc + p.elo, 0) / (bravo.length || 1)),
      map: gameName === 'Slapshot: Rebound' ? 'Puck Arena Stadium' : 'de_mirage',
      status: 'DEPLOYED TO DEDICATED SERVER (128-TICK)',
      timestamp: new Date().toLocaleTimeString()
    };

    this.rankedSelectionHistory.unshift(matchRoom);
    return matchRoom;
  }
}

// Global Export
window.wardogsEngine = new WardogsEngine();
