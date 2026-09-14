/* CustomLobbies.com - Competitive Esports Leagues Engine for 28 Game Titles */
class LeaguesEngine {
  constructor() {
    this.currentSeason = 'Season 4: Cyberpunk Showdown';
    this.seasonTimeRemaining = '14 Days 08 Hours';
    this.totalPrizePool = '$35,000 USD';

    // Competitive Leagues Database for all 28 games
    this.leagues = {
      'Counter-Strike 2': {
        season: 'Season 4: Cyberpunk Showdown',
        prizePool: '$5,000 USD',
        divisions: [
          {
            id: 'premier',
            name: '🏆 Premier Master Division',
            minElo: 2200,
            prize: '$3,000 USD',
            teams: [
              { rank: 1, name: 'Valkyrie Esports', tag: '[VCS]', wins: 14, losses: 1, points: 42, roundDelta: '+168', winRate: '93.3%', elo: 2680, captain: 'RadiantReaper' },
              { rank: 2, name: 'Cyber Titans', tag: '[TITAN]', wins: 12, losses: 3, points: 36, roundDelta: '+120', winRate: '80.0%', elo: 2450, captain: 'ApexGod99' },
              { rank: 3, name: 'Neon Samurai', tag: '[NEON]', wins: 10, losses: 5, points: 30, roundDelta: '+78', winRate: '66.7%', elo: 2320, captain: 'Valkyrie_CS' },
              { rank: 4, name: 'Quantum Apex', tag: '[QA]', wins: 8, losses: 7, points: 24, roundDelta: '+34', winRate: '53.3%', elo: 2240, captain: 'ShadowNinja' }
            ]
          },
          {
            id: 'diamond',
            name: '🥇 Diamond Competitive Division',
            minElo: 1800,
            prize: '$1,500 USD',
            teams: [
              { rank: 1, name: 'Hyperion Syndicate', tag: '[HYPR]', wins: 11, losses: 2, points: 33, roundDelta: '+95', winRate: '84.6%', elo: 2110, captain: 'Hyper_CS' },
              { rank: 2, name: 'Pulse Vanguard', tag: '[PULSE]', wins: 9, losses: 4, points: 27, roundDelta: '+62', winRate: '69.2%', elo: 1980, captain: 'PulseMaster' }
            ]
          },
          {
            id: 'challenger',
            name: '🥉 Challenger Open Division',
            minElo: 0,
            prize: '$500 USD',
            teams: [
              { rank: 1, name: 'Alpha Squad 99', tag: '[A99]', wins: 8, losses: 1, points: 24, roundDelta: '+72', winRate: '88.9%', elo: 1650, captain: 'RookieGod' },
              { rank: 2, name: 'Rogue Strikers', tag: '[ROGUE]', wins: 6, losses: 3, points: 18, roundDelta: '+28', winRate: '66.7%', elo: 1540, captain: 'StrikeForce' }
            ]
          }
        ],
        fixtures: [
          { week: 'Week 5 Matchup', teamA: 'Valkyrie Esports', teamB: 'Cyber Titans', date: 'Tonight 20:00 EST', format: 'Best of 3 (BO3 Map Veto)', status: '🔴 LIVE BROADCAST' },
          { week: 'Week 5 Matchup', teamA: 'Neon Samurai', teamB: 'Quantum Apex', date: 'Tomorrow 21:00 EST', format: 'Best of 3 (BO3 Map Veto)', status: 'UPCOMING' }
        ]
      },
      'Empulse': {
        season: 'Season 4: Cyberpunk Showdown',
        prizePool: '$3,500 USD',
        divisions: [
          {
            id: 'premier',
            name: '🏆 Empulse Pro Circuit',
            minElo: 2000,
            prize: '$2,500 USD',
            teams: [
              { rank: 1, name: 'Empulse Overlords', tag: '[EMP]', wins: 13, losses: 0, points: 39, roundDelta: '+180', winRate: '100%', elo: 2750, captain: 'Empulse_Overlord' },
              { rank: 2, name: 'Vector Velocity', tag: '[VEC]', wins: 10, losses: 3, points: 30, roundDelta: '+92', winRate: '76.9%', elo: 2420, captain: 'VectorGod' }
            ]
          },
          {
            id: 'challenger',
            name: '🥉 Overcharge Open Cup',
            minElo: 0,
            prize: '$1,000 USD',
            teams: [
              { rank: 1, name: 'Cyber Matrix', tag: '[CM]', wins: 7, losses: 2, points: 21, roundDelta: '+50', winRate: '77.8%', elo: 1820, captain: 'MatrixRunner' }
            ]
          }
        ],
        fixtures: [
          { week: 'Finals Matchup', teamA: 'Empulse Overlords', teamB: 'Vector Velocity', date: 'Sept 19 19:00 EST', format: 'Best of 5 Championship', status: 'UPCOMING' }
        ]
      },
      'REMATCH': {
        season: 'Season 4: Cyberpunk Showdown',
        prizePool: '$3,000 USD',
        divisions: [
          {
            id: 'premier',
            name: '🏆 REMATCH Championship Division',
            minElo: 2000,
            prize: '$2,000 USD',
            teams: [
              { rank: 1, name: 'Nexus Rematch Squad', tag: '[NRS]', wins: 12, losses: 2, points: 36, roundDelta: '+135', winRate: '85.7%', elo: 2620, captain: 'Rematch_God' }
            ]
          }
        ],
        fixtures: [
          { week: 'Week 4 Matchup', teamA: 'Nexus Rematch Squad', teamB: 'Cyber City Legends', date: 'Sept 20 20:00 EST', format: 'Best of 3', status: 'UPCOMING' }
        ]
      },
      'Valorant': {
        season: 'Season 4: Cyberpunk Showdown',
        prizePool: '$4,000 USD',
        divisions: [
          {
            id: 'premier',
            name: '🏆 Radiant Premier Circuit',
            minElo: 2100,
            prize: '$3,000 USD',
            teams: [
              { rank: 1, name: 'Radiant Vipers', tag: '[VIPER]', wins: 11, losses: 1, points: 33, roundDelta: '+110', winRate: '91.7%', elo: 2590, captain: 'Valkyrie_CS' }
            ]
          }
        ],
        fixtures: [
          { week: 'Week 5 Matchup', teamA: 'Radiant Vipers', teamB: 'Ascendant Phoenix', date: 'Sept 21 21:00 EST', format: 'Best of 3 Map Veto', status: 'UPCOMING' }
        ]
      },
      'Slapshot: Rebound': {
        season: 'Season 4: Cyberpunk Showdown',
        prizePool: '$2,500 USD',
        divisions: [
          {
            id: 'premier',
            name: '🏆 Slapshot Pro Puck Division',
            minElo: 2000,
            prize: '$1,800 USD',
            teams: [
              { rank: 1, name: 'Slapshot Overlords', tag: '[PUCK]', wins: 12, losses: 1, points: 36, roundDelta: '+124', winRate: '92.3%', elo: 2650, captain: 'PuckMaster99' },
              { rank: 2, name: 'Cyber Skaters', tag: '[ICE]', wins: 9, losses: 4, points: 27, roundDelta: '+58', winRate: '69.2%', elo: 2310, captain: 'IceKing' }
            ]
          },
          {
            id: 'challenger',
            name: '🥉 Slapshot Open Rink Cup',
            minElo: 0,
            prize: '$700 USD',
            teams: [
              { rank: 1, name: 'Puck Strikers 3v3', tag: '[STK]', wins: 7, losses: 2, points: 21, roundDelta: '+42', winRate: '77.8%', elo: 1780, captain: 'Deeker' }
            ]
          }
        ],
        fixtures: [
          { week: 'Week 5 Matchup', teamA: 'Slapshot Overlords', teamB: 'Cyber Skaters', date: 'This Friday 20:00 EST', format: 'Best of 3 Puck Veto', status: 'UPCOMING' }
        ]
      }
    };
  }

  // Get or initialize League data for any of the 28 games
  getLeagueForGame(gameName) {
    if (this.leagues[gameName]) return this.leagues[gameName];

    // Generic fallback auto-generator for remaining games
    this.leagues[gameName] = {
      season: this.currentSeason,
      prizePool: '$2,000 USD',
      divisions: [
        {
          id: 'premier',
          name: `🏆 ${gameName} Master Division`,
          minElo: 2000,
          prize: '$1,500 USD',
          teams: [
            { rank: 1, name: `${gameName} Elite Squad`, tag: '[ELITE]', wins: 10, losses: 1, points: 30, roundDelta: '+90', winRate: '90.9%', elo: 2400, captain: 'RadiantReaper' },
            { rank: 2, name: `${gameName} Strikers`, tag: '[STRK]', wins: 8, losses: 3, points: 24, roundDelta: '+45', winRate: '72.7%', elo: 2150, captain: 'ApexGod99' }
          ]
        },
        {
          id: 'challenger',
          name: `🥉 ${gameName} Open League`,
          minElo: 0,
          prize: '$500 USD',
          teams: [
            { rank: 1, name: 'Rookie Contenders', tag: '[RC]', wins: 6, losses: 2, points: 18, roundDelta: '+30', winRate: '75.0%', elo: 1600, captain: 'RookieOne' }
          ]
        }
      ],
      fixtures: [
        { week: 'Week 4 Matchup', teamA: `${gameName} Elite Squad`, teamB: `${gameName} Strikers`, date: 'This Weekend 18:00 EST', format: 'Best of 3', status: 'UPCOMING' }
      ]
    };

    return this.leagues[gameName];
  }

  // Register new team into a game's league division
  registerTeamForLeague(gameName, divisionId, teamName, teamTag, captainHandle = 'RadiantReaper') {
    const league = this.getLeagueForGame(gameName);
    const division = league.divisions.find(d => d.id === divisionId) || league.divisions[0];

    const newTeam = {
      rank: division.teams.length + 1,
      name: teamName,
      tag: teamTag.startsWith('[') ? teamTag : `[${teamTag.toUpperCase()}]`,
      wins: 0,
      losses: 0,
      points: 0,
      roundDelta: '0',
      winRate: '0%',
      elo: 1800,
      captain: captainHandle
    };

    division.teams.push(newTeam);
    return newTeam;
  }
}

// Global Export
window.leaguesEngine = new LeaguesEngine();
