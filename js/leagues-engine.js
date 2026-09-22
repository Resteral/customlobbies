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

    // Play Tonight Board Posts Store
    this.playTonightPosts = [
      {
        id: 'post_101',
        host: 'S1mple_Pro',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=S1mple',
        game: 'Counter-Strike 2',
        gameIcon: '🎯',
        timeSlot: 'Tonight 20:00 EST',
        region: 'NA-East',
        skillLevel: 'Diamond / Master',
        openSlots: 2,
        totalSlots: 5,
        note: 'Looking for 2 solid riflers/anchors for 128-tick Premier scrims!',
        participants: ['S1mple_Pro', 'ZywOo_Clutch', 'Niko_CS'],
        createdAt: '15 mins ago'
      },
      {
        id: 'post_102',
        host: 'Valkyrie_CS',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Valkyrie',
        game: 'Valorant',
        gameIcon: '🔥',
        timeSlot: 'Tonight 21:30 EST',
        region: 'NA-West',
        skillLevel: 'Ascendant / Radiant',
        openSlots: 1,
        totalSlots: 5,
        note: 'Need 1 Controller / Smoker for night climb!',
        participants: ['Valkyrie_CS', 'TenZ_Aim', 'Shroud_God', 'Hiko_Inhuman'],
        createdAt: '30 mins ago'
      },
      {
        id: 'post_103',
        host: 'PuckMaster99',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Puck',
        game: 'Slapshot: Rebound',
        gameIcon: '🏒',
        timeSlot: 'Tonight 22:00 EST',
        region: 'EU-Central',
        skillLevel: 'All Welcome',
        openSlots: 3,
        totalSlots: 6,
        note: 'Casual 3v3 puck session & custom lobby games.',
        participants: ['PuckMaster99', 'IceKing', 'Deeker'],
        createdAt: '1 hour ago'
      }
    ];

    // Saved Rules Presets Repository
    this.rulesPresets = [
      {
        id: 'preset_sniper',
        name: '🎯 Sniper-Only 1v1 AWP Duel',
        description: 'AWP only, infinite ammo, instant respawn, no armor',
        game: 'Counter-Strike 2',
        map: 'de_dust2 (Mid Only)',
        draftType: '1v1 Duel',
        maxSlots: 2
      },
      {
        id: 'preset_faceit',
        name: '👑 FACEIT Competitive Snake Draft',
        description: '10 Players, 2 Captains snake draft 1-2-2-1, BO3 veto',
        game: 'Counter-Strike 2',
        map: 'Mirage & Inferno & Nuke',
        draftType: 'FACEIT Snake Draft',
        maxSlots: 10
      },
      {
        id: 'preset_beginners',
        name: '🌱 Beginners & Chill Welcome',
        description: 'No toxic behavior, open microphone advice, casual rounds',
        game: 'Valorant',
        map: 'Ascent',
        draftType: 'Open LFG',
        maxSlots: 10
      },
      {
        id: 'preset_hardcore',
        name: '⚔️ Hardcore Pistol Only',
        description: 'Desert Eagle & USP-S only, Headshots multiplier x2',
        game: 'Counter-Strike 2',
        map: 'de_inferno',
        draftType: 'Competitive 5v5',
        maxSlots: 10
      }
    ];

    // Community Hubs Directory
    this.communityHubs = [
      {
        id: 'hub_cs2_na',
        name: '🎯 CS2 Premier NA Community',
        members: 14250,
        activeLobbies: 8,
        description: 'The primary North American 128-tick CS2 scrim & draft network.',
        modCount: 12,
        banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
      },
      {
        id: 'hub_slapshot',
        name: '🏒 Slapshot Rebound Pro League',
        members: 6800,
        activeLobbies: 4,
        description: 'Official Slapshot 3v3 puck arena community hub.',
        modCount: 6,
        banner: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800'
      },
      {
        id: 'hub_wardogs',
        name: '🐕 WARDOGS 33v33 Battalion Hub',
        members: 9500,
        activeLobbies: 5,
        description: 'Large-scale tactical 33-man tri-faction warfare community.',
        modCount: 8,
        banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800'
      }
    ];

    // Reliability & Trust Records
    this.playerReliability = {
      'DEFAULT_USER': { completionRate: '99.2%', completedMatches: 124, noShows: 0, trustBadge: '🛡️ Verified Pristine', honorLevel: 'Level 5 (Legendary)', activeAppeals: 0 }
    };

    // Head-to-Head Squad Rivalries
    this.rivalries = {
      'Valkyrie Esports vs Cyber Titans': { winsA: 4, winsB: 2, total: 6, lastMatch: 'Yesterday (Valkyrie won 16-14)' },
      'Slapshot Overlords vs Cyber Skaters': { winsA: 5, winsB: 3, total: 8, lastMatch: 'Sept 18 (Overlords won 3-1)' }
    };

    // Match Disputes Records
    this.matchDisputes = [];
  }

  // Play Tonight Board Operations
  createPlayTonightPost(post) {
    const newPost = {
      id: 'post_' + Date.now(),
      host: post.host || 'RadiantReaper',
      avatar: post.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host',
      game: post.game || 'Counter-Strike 2',
      gameIcon: post.gameIcon || '🎮',
      timeSlot: post.timeSlot || 'Tonight 20:00 EST',
      region: post.region || 'NA-East',
      skillLevel: post.skillLevel || 'Open',
      openSlots: parseInt(post.totalSlots || 5) - 1,
      totalSlots: parseInt(post.totalSlots || 5),
      note: post.note || 'Looking for squad mates tonight!',
      participants: [post.host || 'RadiantReaper'],
      createdAt: 'Just now'
    };
    this.playTonightPosts.unshift(newPost);
    return newPost;
  }

  joinPlayTonightSpot(postId, playerHandle) {
    const post = this.playTonightPosts.find(p => p.id === postId);
    if (!post) return null;

    if (post.openSlots > 0 && !post.participants.includes(playerHandle)) {
      post.participants.push(playerHandle);
      post.openSlots -= 1;
    }
    return post;
  }

  // Preset Management
  saveRulesPreset(preset) {
    const newPreset = {
      id: 'preset_' + Date.now(),
      name: preset.name || 'Custom Presets #1',
      description: preset.description || 'Custom rules setup',
      game: preset.game || 'Counter-Strike 2',
      map: preset.map || 'de_dust2',
      draftType: preset.draftType || 'Competitive 5v5',
      maxSlots: preset.maxSlots || 10
    };
    this.rulesPresets.push(newPreset);
    return newPreset;
  }

  // Player Reliability Lookup
  getReliabilityProfile(userHandle) {
    if (!this.playerReliability[userHandle]) {
      this.playerReliability[userHandle] = {
        completionRate: '98.5%',
        completedMatches: 45 + Math.floor(Math.random() * 50),
        noShows: Math.floor(Math.random() * 2),
        trustBadge: '🛡️ Verified Gamer',
        honorLevel: 'Level 4 (Honorable)',
        activeAppeals: 0
      };
    }
    return this.playerReliability[userHandle];
  }

  // Record Match Result & Dispute Handling
  recordMatchResult(lobbyId, captainA, scoreA, captainB, scoreB) {
    if (parseInt(scoreA) === parseInt(scoreB)) {
      // Direct score agreement
      return { status: 'CONFIRMED', winner: captainA, score: `${scoreA}-${scoreB}` };
    } else {
      // Score mismatch -> Open Dispute
      const dispute = {
        id: 'disp_' + Date.now(),
        lobbyId,
        captainA,
        scoreA,
        captainB,
        scoreB,
        status: 'PENDING_EVIDENCE',
        createdAt: new Date().toISOString()
      };
      this.matchDisputes.push(dispute);
      return { status: 'DISPUTED', dispute };
    }
  }

  // Get Rivalry Record
  getRivalryRecord(squadA, squadB) {
    const key1 = `${squadA} vs ${squadB}`;
    const key2 = `${squadB} vs ${squadA}`;
    if (this.rivalries[key1]) return this.rivalries[key1];
    if (this.rivalries[key2]) {
      const r = this.rivalries[key2];
      return { winsA: r.winsB, winsB: r.winsA, total: r.total, lastMatch: r.lastMatch };
    }
    return { winsA: 2, winsB: 1, total: 3, lastMatch: 'Last Week (Close Duel)' };
  }
}

// Global Export
window.leaguesEngine = new LeaguesEngine();

