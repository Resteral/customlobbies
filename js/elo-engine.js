/* CustomLobbies.com - ELO Engine, Modified Captain Snake Draft, Game Capacity Pools & XP System */

class EloEngine {
  constructor() {
    this.defaultKFactor = 32;
    this.rankTiers = [
      { name: 'Bronze', min: 0, max: 1199, badge: '🥉', color: '#cd7f32' },
      { name: 'Silver', min: 1200, max: 1399, badge: '🥈', color: '#c0c0c0' },
      { name: 'Gold', min: 1400, max: 1599, badge: '🥇', color: '#ffd700' },
      { name: 'Platinum', min: 1600, max: 1799, badge: '💎', color: '#00e5ff' },
      { name: 'Diamond', min: 1800, max: 1999, badge: '🔷', color: '#00f2fe' },
      { name: 'Master', min: 2000, max: 2199, badge: '🔮', color: '#9d4edd' },
      { name: 'Grandmaster', min: 2200, max: 2399, badge: '👑', color: '#ff007f' },
      { name: 'Radiant', min: 2400, max: 9999, badge: '🔥', color: '#ffea00' }
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
      'Dota 2': 10,
      'StarCraft II': 2,
      'PUBG': 16,
      'Arkheron': 12,
      'Empulse': 10,
      'Rainbow Six Siege': 10,
      'FiveM GTA RP': 16,
      'Rocket League': 6,
      'Apex Legends': 6
    };

    // Competitive Map Pools
    this.mapPools = {
      'Counter-Strike 2': ['Mirage', 'Inferno', 'Nuke', 'Anubis', 'Ancient', 'Dust II', 'Vertigo'],
      'CS2 Bhop (Auto & Scroll)': ['bhop_badges', 'bhop_monster_jam', 'bhop_pro', 'bhop_ez', 'bhop_eula'],
      'CS2 Danger Zone (BR)': ['dz_blacksite', 'dz_sirocco', 'dz_county', 'dz_vineyard'],
      'CS2 Retake (Bomb Defusal)': ['de_mirage_retake', 'de_inferno_retake', 'de_dust2_retake', 'de_nuke_retake', 'de_anubis_retake'],
      'CS2 Execute (Tactical Scrims)': ['de_mirage_execute', 'de_inferno_execute', 'de_nuke_execute', 'de_ancient_execute'],
      'CS2 1v1 Arena (Aim Map)': ['am_aim_map', 'am_redline', 'am_dust2014', 'am_grass', 'am_map_v2'],
      'CS2 Gun Game (Arms Race)': ['ar_shoots', 'ar_baggage', 'ar_monastery', 'ar_pool_day', 'ar_lunacy'],
      'CS2 Deathmatch (FFA DM)': ['de_dust2_dm', 'de_mirage_dm', 'de_inferno_dm', 'de_nuke_dm'],
      'CS2 HNS (Hide & Seek)': ['hns_floppytown', 'hns_dust2', 'hns_rooftops', 'hns_cbble', 'hns_bhop', 'hns_italy'],
      'CS2 Surf (Tier 1-6)': ['surf_utopia_v3', 'surf_kitsune', 'surf_beginner', 'surf_greatriver', 'surf_ski_2'],
      'CS2 KZ / Climb (Bhop)': ['kz_hb_man_bhop', 'kz_cliffhanger', 'kz_pro_slide', 'kz_bhop_valley'],
      'CS2 Zombie Escape': ['ze_predator_ultimate', 'ze_paranoid', 'ze_fapescape', 'ze_minigames'],
      'Valorant': ['Ascent', 'Bind', 'Haven', 'Split', 'Lotus', 'Sunset'],
      'Rainbow Six Siege': ['Clubhouse', 'Oregon', 'Bank', 'Kafe', 'Chalet', 'Consulate'],
      'Dota 2': ['Radiant Side', 'Dire Side', 'Captains Mode Draft']
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

  // Get Rank Tier Info
  getRankTier(mmr) {
    const tier = this.rankTiers.find(t => mmr >= t.min && mmr <= t.max);
    return tier || this.rankTiers[0];
  }

  // Player Level & XP System
  calculatePlayerLevel(xp = 3450) {
    const xpPerLevel = 200;
    const level = Math.floor(xp / xpPerLevel) + 1;
    const currentLevelXP = xp % xpPerLevel;
    const pct = Math.round((currentLevelXP / xpPerLevel) * 100);

    let title = 'Rookie Challenger';
    if (level > 40) title = 'Apex Warlord';
    else if (level > 30) title = 'Grandmaster Striker';
    else if (level > 20) title = 'Diamond Veteran';
    else if (level > 10) title = 'Gold Competitor';

    return {
      level,
      title,
      xp,
      currentLevelXP,
      xpPerLevel,
      pct
    };
  }

  // Auto-Balance Team Matchmaker
  autoBalanceTeams(playersPool) {
    const sorted = [...playersPool].sort((a, b) => b.elo - a.elo);
    const team1 = [];
    const team2 = [];

    let sum1 = 0;
    let sum2 = 0;

    sorted.forEach((p, idx) => {
      if (idx % 2 === 0) {
        if (sum1 <= sum2) {
          team1.push(p);
          sum1 += p.elo;
        } else {
          team2.push(p);
          sum2 += p.elo;
        }
      } else {
        if (sum2 <= sum1) {
          team2.push(p);
          sum2 += p.elo;
        } else {
          team1.push(p);
          sum1 += p.elo;
        }
      }
    });

    const avg1 = Math.round(sum1 / (team1.length || 1));
    const avg2 = Math.round(sum2 / (team2.length || 1));
    const mmrDiff = Math.abs(avg1 - avg2);

    return {
      team1,
      team2,
      avgMMR1: avg1,
      avgMMR2: avg2,
      mmrDiff
    };
  }

  /* MODIFIED CAPTAIN SNAKE DRAFT RULE:
     - Top MMR = Captain #1
     - 2nd Highest MMR = Captain #2
     - Turn 1: Captain #2 gets First Pick (or CAN PASS to Captain #1)
     - Turn 2: Captain #1 gets next TWO picks
     - Turn 3: Alternates back to Captain #2 for next picks
  */
  performCustomSnakeDraft(playersPool, passFirstPick = false) {
    const sorted = [...playersPool].sort((a, b) => b.elo - a.elo);
    const cap1 = sorted[0] || { name: 'Captain #1 (Highest MMR)', elo: 2540 };
    const cap2 = sorted[1] || { name: 'Captain #2 (2nd Highest MMR)', elo: 2150 };

    const unpicked = sorted.slice(2);
    const team1 = [cap1]; // Highest MMR Team
    const team2 = [cap2]; // 2nd Highest MMR Team

    let turnOwner = passFirstPick ? 1 : 2; // 2nd Highest MMR starts unless passed!
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
        // Switch turn owner and assign double picks (2)
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

  // Standard Snake Draft fallback
  performSnakeAutoDraft(playersPool) {
    return this.performCustomSnakeDraft(playersPool, false);
  }
}

window.eloEngine = new EloEngine();
