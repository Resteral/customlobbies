/* CustomLobbies.com - WARDOGS 33v33v33 (99-Player) Tri-Faction Tactical Engine */
class WardogsEngine {
  constructor() {
    this.divisionName = 'WARDOGS 33 v 33 v 33 Tri-Faction Mercenary League';
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

    // Registered Squad Units / Mercenary Battalions (33-Man Companies)
    this.registeredSquads = [
      { id: 201, name: 'WARDOG Company Alpha', tag: '[WD-ALPHA]', captain: 'Ghost_Dog_99', game: 'Counter-Strike 2', record: '18W - 2L', membersCount: 33, status: 'SELECTED FOR RANKED', bountyEarned: '$12,500' },
      { id: 202, name: 'Iron Claw Battalion Bravo', tag: '[CLAW]', captain: 'Sargeant_Iron', game: 'Empulse', record: '15W - 3L', membersCount: 33, status: 'ACTIVE CONTRACT', bountyEarned: '$8,200' },
      { id: 203, name: 'Phantom Brigade Charlie', tag: '[K9-PHANTOM]', captain: 'Shadow_K9', game: 'REMATCH', record: '14W - 1L', membersCount: 33, status: 'ACTIVE CONTRACT', bountyEarned: '$9,400' },
      { id: 204, name: 'Slapshot Cyber Hounds', tag: '[HOUNDS]', captain: 'Puck_Hunter', game: 'Slapshot: Rebound', record: '12W - 0L', membersCount: 33, status: 'SELECTED FOR RANKED', bountyEarned: '$7,800' }
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
      bountyEarned: '$0'
    };

    this.registeredSquads.unshift(newSquad);
    return newSquad;
  }

  // Perform Ranked Selection Draft for 33 v 33 v 33 (99 Players)
  generateRankedSelectionMatch(gameName = 'Counter-Strike 2') {
    const eligibleSolos = this.soloMercenaries.filter(m => m.game === gameName || m.game === 'Counter-Strike 2');
    const pool = [...eligibleSolos].sort((a, b) => b.elo - a.elo);

    const capacity = 99; // 33 v 33 v 33 Tri-Faction

    const factionAlpha = [];
    const factionBravo = [];
    const factionCharlie = [];

    for (let i = 0; i < capacity; i++) {
      let player = pool[i];
      if (!player) {
        player = {
          id: 1000 + i,
          name: `Operative_DOG_${i + 1}`,
          callsign: `DOG-${Math.floor(Math.random() * 899 + 100)}`,
          game: gameName,
          role: i % 4 === 0 ? '🎯 Marksman' : i % 3 === 0 ? '⚡ Breacher' : i % 2 === 0 ? '🧠 Recon' : '🛡️ Heavy',
          elo: Math.floor(2550 - i * 6 + Math.random() * 40),
          kd: (2.2 - i * 0.01).toFixed(2),
          status: 'Selected for Ranked'
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
      status: 'DEPLOYED TO DEDICATED 99-PLAYER SERVER NODE (128-TICK)',
      timestamp: new Date().toLocaleTimeString()
    };

    this.rankedSelectionHistory.unshift(matchRoom);
    return matchRoom;
  }
}

// Global Export
window.wardogsEngine = new WardogsEngine();
