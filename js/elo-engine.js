/* CustomLobbies.com - ELO Engine, Play-to-Earn CL-Points Economy, FACEIT Level 1-10 & Guardian AC */

class EloEngine {
  constructor() {
    this.defaultKFactor = 32;

    // FACEIT-Style Level 1 - 10 Rank Tiers + CPL Challenger Tier
    this.rankTiers = [
      { level: 1, name: 'FACEIT Level 1', min: 0, max: 800, badge: '🔴 Level 1', color: '#ff5252' },
      { level: 2, name: 'FACEIT Level 2', min: 801, max: 950, badge: '🟠 Level 2', color: '#ff793f' },
      { level: 3, name: 'FACEIT Level 3', min: 951, max: 1100, badge: '🟡 Level 3', color: '#ffb142' },
      { level: 4, name: 'FACEIT Level 4', min: 1101, max: 1250, badge: '🟢 Level 4', color: '#33d9b2' },
      { level: 5, name: 'FACEIT Level 5', min: 1251, max: 1400, badge: '🟢 Level 5', color: '#2ed573' },
      { level: 6, name: 'FACEIT Level 6', min: 1401, max: 1550, badge: '🔵 Level 6', color: '#70a1ff' },
      { level: 7, name: 'FACEIT Level 7', min: 1551, max: 1700, badge: '🔵 Level 7', color: '#1e90ff' },
      { level: 8, name: 'FACEIT Level 8', min: 1701, max: 1850, badge: '🟣 Level 8', color: '#706fd3' },
      { level: 9, name: 'FACEIT Level 9', min: 1851, max: 2000, badge: '🟣 Level 9', color: '#474787' },
      { level: 10, name: 'FACEIT Level 10 (Master)', min: 2001, max: 2400, badge: '👑 Level 10', color: '#ff5252' },
      { level: 11, name: 'CPL Pro League (FPL Challenger)', min: 2401, max: 9999, badge: '🔥 CPL PRO', color: '#ffd700' }
    ];

    // Max player capacity per game mode
    this.gameCapacities = {
      'Counter-Strike 2': 10,
      'CS2 Retake (Bomb Defusal)': 8,
      'CS2 Execute (Tactical Scrims)': 10,
      'CS2 1v1 Arena (Aim Map)': 2,
      'CS2 Gun Game (Arms Race)': 12,
      'CS2 Deathmatch (FFA DM)': 16,
      'CS2 HNS (Hide & Seek)': 16,
      'CS2 Surf (Tier 1-6)': 16,
      'CS2 KZ / Climb (Bhop)': 12,
      'CS2 Zombie Escape': 20,
      'Valorant': 10,
      'REMATCH': 10,
      'Arkheron': 12,
      'Empulse': 10,
      'Empulse 5v5 Cyber Arena': 10,
      'Empulse Overcharge Control': 12,
      'Empulse 10v10 Domination': 20,
      'Empulse 1v1 Railgun Duel': 2,
      'Empulse Electro Speedrun': 16,
      'Marvel Rivals': 12,
      'Deadlock': 12,
      'The Finals': 6,
      'Overwatch 2': 10,
      'League of Legends': 10,
      'Fortnite': 16,
      'Dota 2': 10,
      'StarCraft II': 2,
      'PUBG': 16,
      'Rainbow Six Siege': 10,
      'FiveM GTA RP': 16,
      'Rocket League': 6,
      'Slapshot: Rebound': 6
    };

    // Native Rank Systems per Game Title
    this.gameRankSystems = {
      'REMATCH': [
        { min: 0, max: 400, name: 'Rookie Tier', badge: '⚪ Rookie', color: '#a0a0a0' },
        { min: 401, max: 800, name: 'Challenger Tier', badge: '🩵 Challenger', color: '#00e5ff' },
        { min: 801, max: 1400, name: 'Elite Tier', badge: '💎 Elite', color: '#b388ff' },
        { min: 1401, max: 2000, name: 'Master Division', badge: '🔮 Master', color: '#aa00ff' },
        { min: 2001, max: 9999, name: 'Rematch Champion', badge: '🔥 Rematch Champ', color: '#ff1744' }
      ],
      'Arkheron': [
        { min: 0, max: 500, name: 'Initiated Gladiator', badge: '🤎 Initiated', color: '#cd7f32' },
        { min: 501, max: 1100, name: 'Cyber Gladiator', badge: '⚔️ Cyber Gladiator', color: '#00e5ff' },
        { min: 1101, max: 1800, name: 'Apex Archon', badge: '🏛️ Apex Archon', color: '#ffd700' },
        { min: 1801, max: 9999, name: 'Arkheron Overlord', badge: '👑 Arkheron Overlord', color: '#ff1744' }
      ],
      'Empulse': [
        { min: 0, max: 400, name: 'Empulse Cadet', badge: '⚪ Cadet', color: '#a0a0a0' },
        { min: 401, max: 800, name: 'Specialist Operative', badge: '🩵 Specialist', color: '#00e5ff' },
        { min: 801, max: 1300, name: 'Empulse Commando', badge: '🟢 Commando', color: '#00e676' },
        { min: 1301, max: 1800, name: 'Apex Striker', badge: '🟣 Apex Striker', color: '#b388ff' },
        { min: 1801, max: 2300, name: 'Empulse Overlord', badge: '🔮 Overlord', color: '#aa00ff' },
        { min: 2301, max: 9999, name: 'Empulse Legend', badge: '⚡ Empulse Legend', color: '#ff1744' }
      ],
      'Marvel Rivals': [
        { min: 0, max: 400, name: 'Bronze Rank', badge: '🤎 Bronze', color: '#cd7f32' },
        { min: 401, max: 800, name: 'Silver Rank', badge: '🥈 Silver', color: '#c0c0c0' },
        { min: 801, max: 1200, name: 'Gold Rank', badge: '🥇 Gold', color: '#ffd700' },
        { min: 1201, max: 1600, name: 'Platinum Rank', badge: '🩵 Platinum', color: '#00e5ff' },
        { min: 1601, max: 2000, name: 'Diamond Rank', badge: '💎 Diamond', color: '#b388ff' },
        { min: 2001, max: 2500, name: 'Grandmaster', badge: '🔮 Grandmaster', color: '#aa00ff' },
        { min: 2501, max: 9999, name: 'Eternity Leaderboard', badge: '⚡ Eternity', color: '#ff1744' }
      ],
      'Valorant': [
        { min: 0, max: 200, name: 'Iron 1 - 3', badge: '⚪ Iron', color: '#a0a0a0' },
        { min: 201, max: 400, name: 'Bronze 1 - 3', badge: '🤎 Bronze', color: '#cd7f32' },
        { min: 401, max: 600, name: 'Silver 1 - 3', badge: '🥈 Silver', color: '#c0c0c0' },
        { min: 601, max: 800, name: 'Gold 1 - 3', badge: '🥇 Gold', color: '#ffd700' },
        { min: 801, max: 1000, name: 'Platinum 1 - 3', badge: '🩵 Platinum', color: '#00e5ff' },
        { min: 1001, max: 1400, name: 'Diamond 1 - 3', badge: '💎 Diamond', color: '#b388ff' },
        { min: 1401, max: 1800, name: 'Ascendant 1 - 3', badge: '🟢 Ascendant', color: '#00e676' },
        { min: 1801, max: 2200, name: 'Immortal 1 - 3', badge: '🟣 Immortal', color: '#d500f9' },
        { min: 2201, max: 9999, name: 'Radiant Leaderboard', badge: '🔴 Radiant', color: '#ff1744' }
      ],
      'Slapshot: Rebound': [
        { min: 0, max: 500, name: 'Bronze Puck', badge: '🤎 Bronze Puck', color: '#cd7f32' },
        { min: 501, max: 900, name: 'Silver Puck', badge: '🥈 Silver Puck', color: '#c0c0c0' },
        { min: 901, max: 1300, name: 'Gold Puck', badge: '🥇 Gold Puck', color: '#ffd700' },
        { min: 1301, max: 1700, name: 'Platinum Puck', badge: '🩵 Platinum Puck', color: '#00e5ff' },
        { min: 1701, max: 2100, name: 'Diamond Puck', badge: '💎 Diamond Puck', color: '#b388ff' },
        { min: 2101, max: 2500, name: 'Master Puck', badge: '🔮 Master Puck', color: '#aa00ff' },
        { min: 2501, max: 9999, name: 'Slapshot Legend Top 50', badge: '🏒 Slapshot Legend', color: '#ff1744' }
      ],
      'Rocket League': [
        { min: 0, max: 500, name: 'Bronze I - III', badge: '🤎 Bronze', color: '#cd7f32' },
        { min: 501, max: 800, name: 'Silver I - III', badge: '🥈 Silver', color: '#c0c0c0' },
        { min: 801, max: 1100, name: 'Gold I - III', badge: '🥇 Gold', color: '#ffd700' },
        { min: 1101, max: 1400, name: 'Platinum I - III', badge: '🩵 Platinum', color: '#00e5ff' },
        { min: 1401, max: 1700, name: 'Diamond I - III', badge: '💎 Diamond', color: '#b388ff' },
        { min: 1701, max: 2000, name: 'Champion I - III', badge: '🟣 Champion', color: '#aa00ff' },
        { min: 2001, max: 2400, name: 'Grand Champion I - III', badge: '⚽ Grand Champion', color: '#ff1744' },
        { min: 2401, max: 9999, name: 'Supersonic Legend', badge: '⚡ Supersonic Legend', color: '#00f2fe' }
      ],
      'Dota 2': [
        { min: 0, max: 700, name: 'Herald Tier', badge: '🛡️ Herald', color: '#8d6e63' },
        { min: 701, max: 1200, name: 'Guardian Tier', badge: '⚔️ Guardian', color: '#78909c' },
        { min: 1201, max: 1700, name: 'Crusader Tier', badge: '🛡️ Crusader', color: '#26a69a' },
        { min: 1701, max: 2200, name: 'Archon Tier', badge: '📜 Archon', color: '#ffa726' },
        { min: 2201, max: 2700, name: 'Legend Tier', badge: '👑 Legend', color: '#ab47bc' },
        { min: 2701, max: 3200, name: 'Ancient Tier', badge: '🏛️ Ancient', color: '#42a5f5' },
        { min: 3201, max: 4000, name: 'Divine Tier', badge: '✨ Divine', color: '#ffca28' },
        { min: 4001, max: 9999, name: 'Immortal Leaderboard', badge: '🔥 Immortal', color: '#ef5350' }
      ],
      'Rainbow Six Siege': [
        { min: 0, max: 600, name: 'Copper I - V', badge: '🤎 Copper', color: '#8d6e63' },
        { min: 601, max: 1000, name: 'Bronze I - V', badge: '🥉 Bronze', color: '#cd7f32' },
        { min: 1001, max: 1400, name: 'Silver I - V', badge: '🥈 Silver', color: '#c0c0c0' },
        { min: 1401, max: 1800, name: 'Gold I - V', badge: '🥇 Gold', color: '#ffd700' },
        { min: 1801, max: 2200, name: 'Platinum I - V', badge: '🩵 Platinum', color: '#00e5ff' },
        { min: 2201, max: 2600, name: 'Emerald I - V', badge: '🟢 Emerald', color: '#00e676' },
        { min: 2601, max: 3000, name: 'Diamond I - V', badge: '💎 Diamond', color: '#b388ff' },
        { min: 3001, max: 9999, name: 'Champions Leaderboard', badge: '🛡️ Champions', color: '#ff1744' }
      ],
      'Slapshot: Rebound': [
        { min: 0, max: 800, name: 'Rookie Puck', badge: '🏒 Rookie', color: '#8d6e63' },
        { min: 801, max: 1500, name: 'Amateur Skater', badge: '⛸️ Amateur', color: '#c0c0c0' },
        { min: 1501, max: 2200, name: 'Pro Playmaker', badge: '⚡ Playmaker', color: '#ffd700' },
        { min: 2201, max: 2800, name: 'Master Captain', badge: '👑 Master', color: '#00e5ff' },
        { min: 2801, max: 9999, name: 'Slapshot Legend League', badge: '🔥 Slapshot Legend', color: '#ff1744' }
      ]
    };

    // Competitive Map Pools
    this.mapPools = {
      'Counter-Strike 2': ['Mirage', 'Inferno', 'Nuke', 'Anubis', 'Ancient', 'Dust II', 'Vertigo'],
      'Valorant': ['Ascent', 'Bind', 'Haven', 'Split', 'Lotus', 'Sunset'],
      'REMATCH': ['Nexus Arena', 'Cyber City', 'Sub-Zero Station', 'Viper Base'],
      'Arkheron': ['Arkheron Spire', 'Quantum Ruins', 'Oblivion Core'],
      'Empulse': ['Empulse Facility', 'Neon Skyline', 'Pulse Station', 'Cyber Core', 'Overcharge Dome', 'Vector Sector', 'Hyperion Matrix'],
      'Marvel Rivals': ['Tokyo 2099', 'Yggsgard', 'Wakanda Imperial'],
      'Deadlock': ['Cursed City Canyons', 'Midtown Lanes'],
      'The Finals': ['Monaco', 'Seoul', 'Las Vegas', 'Skyway Stadium'],
      'Rainbow Six Siege': ['Clubhouse', 'Oregon', 'Bank', 'Kafe', 'Chalet', 'Consulate'],
      'Dota 2': ['Radiant Side', 'Dire Side', 'Captains Mode Draft'],
      'Slapshot: Rebound': ['Puck Arena Stadium', 'Cyber Ice Rink', 'Frozen Coliseum', 'Neon Rink', 'Metro Ice Center']
    };
  }

  // Calculate CL-Points Reward per Match
  calculateMatchPointsRewards(isWin = true, isMVP = false, isTournament = false) {
    let points = 50; // Base participation reward
    if (isWin) points += 100;
    if (isMVP) points += 50;
    if (isTournament) points += 200;

    return {
      pointsEarned: points,
      breakdown: `${isWin ? '+100 Win Bonus' : '+50 Match Played'}${isMVP ? ' | +50 MVP' : ''}${isTournament ? ' | +200 Tourney' : ''}`
    };
  }

  getGameCapacity(gameName) {
    return this.gameCapacities[gameName] || 10;
  }

  // Calculate ELO Rating Change
  calculateRatingChange(ratingA, ratingB, outcomeA, kFactor = this.defaultKFactor) {
    const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const changeA = Math.round(kFactor * (outcomeA - expectedA));
    return changeA;
  }

  // Get Rank Tier Info (FACEIT Level 1-10)
  getRankTier(mmr) {
    const tier = this.rankTiers.find(t => mmr >= t.min && mmr <= t.max);
    return tier || this.rankTiers[0];
  }

  // Get Native Game Rank Tier per Game Title
  getGameSpecificRank(gameName, mmr) {
    const sys = this.gameRankSystems[gameName];
    if (sys) {
      const match = sys.find(t => mmr >= t.min && mmr <= t.max);
      if (match) return match;
    }
    // Fallback to FACEIT Level 1-10 Engine
    return this.getRankTier(mmr);
  }

  // Player Level & XP System
  calculatePlayerLevel(xp = 3450) {
    const xpPerLevel = 200;
    const level = Math.floor(xp / xpPerLevel) + 1;
    const currentLevelXP = xp % xpPerLevel;
    const pct = Math.round((currentLevelXP / xpPerLevel) * 100);

    let title = 'Level 8 Challenger';
    if (level > 40) title = 'CPL Pro Legend';
    else if (level > 30) title = 'FACEIT Level 10 Master';
    else if (level > 20) title = 'FACEIT Level 8 Veteran';

    return {
      level,
      title,
      xp,
      currentLevelXP,
      xpPerLevel,
      pct
    };
  }

  // Honor & Reputation Level Tiers
  getHonorTier(honorPoints = 0) {
    if (honorPoints >= 300) {
      return { level: 5, name: 'Legend of Honor 👑', badge: '👑 Honor Level 5', color: '#ffd700', icon: '👑' };
    } else if (honorPoints >= 150) {
      return { level: 4, name: 'Exemplary Leader', badge: '🌟 Honor Level 4', color: '#a855f7', icon: '🌟' };
    } else if (honorPoints >= 75) {
      return { level: 3, name: 'Honorable Competitor', badge: '💙 Honor Level 3', color: '#00f2fe', icon: '💙' };
    } else if (honorPoints >= 25) {
      return { level: 2, name: 'Respectable Teammate', badge: '🟢 Honor Level 2', color: '#00e676', icon: '🟢' };
    } else {
      return { level: 1, name: 'Novice Recruit', badge: '⚪ Honor Level 1', color: '#8a99ad', icon: '⚪' };
    }
  }

  // Auto-Balance Team Matchmaker (Highest MMR = Team Captains)
  autoBalanceTeams(playersPool) {
    const sorted = [...playersPool].sort((a, b) => (b.elo || b.mmr || 1800) - (a.elo || a.mmr || 1800));
    
    // Assign 1st highest MMR as Team 1 Captain, 2nd highest MMR as Team 2 Captain
    const cap1 = sorted[0] ? { ...sorted[0], isCaptain: true, captainLabel: '👑 Team 1 Captain (Highest MMR)' } : null;
    const cap2 = sorted[1] ? { ...sorted[1], isCaptain: true, captainLabel: '👑 Team 2 Captain (2nd Highest MMR)' } : null;

    const team1 = cap1 ? [cap1] : [];
    const team2 = cap2 ? [cap2] : [];

    let sum1 = cap1 ? (cap1.elo || 1800) : 0;
    let sum2 = cap2 ? (cap2.elo || 1800) : 0;

    const remaining = sorted.slice(2);
    remaining.forEach((p) => {
      if (sum1 <= sum2) {
        team1.push({ ...p, isCaptain: false });
        sum1 += (p.elo || 1800);
      } else {
        team2.push({ ...p, isCaptain: false });
        sum2 += (p.elo || 1800);
      }
    });

    const avg1 = Math.round(sum1 / (team1.length || 1));
    const avg2 = Math.round(sum2 / (team2.length || 1));
    const mmrDiff = Math.abs(avg1 - avg2);

    return {
      team1,
      team2,
      captain1: cap1,
      captain2: cap2,
      avgMMR1: avg1,
      avgMMR2: avg2,
      mmrDiff
    };
  }

  // Modified Captain Snake Draft
  performCustomSnakeDraft(playersPool, passFirstPick = false) {
    const sorted = [...playersPool].sort((a, b) => b.elo - a.elo);
    const cap1 = sorted[0] || { name: 'Captain #1 (Highest MMR)', elo: 2540 };
    const cap2 = sorted[1] || { name: 'Captain #2 (2nd Highest MMR)', elo: 2150 };

    const unpicked = sorted.slice(2);
    const team1 = [cap1];
    const team2 = [cap2];

    let turnOwner = passFirstPick ? 1 : 2;
    let picksRemainingForTurn = (turnOwner === 2 && !passFirstPick) ? 1 : 2;

    while (unpicked.length > 0) {
      const pickedPlayer = unpicked.shift();

      if (turnOwner === 2) {
        team2.push(pickedPlayer);
      } else {
        team1.push(pickedPlayer);
      }

      picksRemainingForTurn--;

      if (picksRemainingForTurn <= 0) {
        turnOwner = turnOwner === 1 ? 2 : 1;
        picksRemainingForTurn = 2;
      }
    }

    const sum1 = team1.reduce((acc, p) => acc + p.elo, 0);
    const sum2 = team2.reduce((acc, p) => acc + p.elo, 0);

    return {
      captain1: cap1,
      captain2: cap2,
      team1,
      team2,
      avgMMR1: Math.round(sum1 / team1.length),
      avgMMR2: Math.round(sum2 / team2.length),
      mmrDelta: Math.abs(Math.round(sum1 / team1.length) - Math.round(sum2 / team2.length)),
      firstPickOwner: passFirstPick ? 'Captain #1 (Passed by Cap #2)' : 'Captain #2 (2nd Highest MMR)'
    };
  }

  performSnakeAutoDraft(playersPool) {
    return this.performCustomSnakeDraft(playersPool, false);
  }
}

window.eloEngine = new EloEngine();
