/**
 * HELIX Platform (docs.helixgame.com UE5 Sandbox) - Competitive Matchmaking Server Engine
 * Connects CustomLobbies competitive queues, 5v5 scrims, and tournament brackets directly to the Helix Dedicated Server!
 */

const HelixMatchmakingServer = {
  activeQueues: new Map(), // gameType -> Set of player objects
  activeMatches: new Map(), // matchId -> match object
  playerRatings: new Map(), // playerId -> { elo: 1500, wins: 0, losses: 0 }

  arenas: [
    { id: 'arena_pacifica_alpha', name: 'Pacifica New Harbor Metro 5v5 Arena', maxPlayers: 10, map: '/Game/Pacifica/Map/Pacifica', spawnAlpha: { x: -1200, y: 3500, z: 200 }, spawnBravo: { x: 1400, y: -2200, z: 200 } },
    { id: 'arena_pacifica_bravo', name: 'Industrial Docks Defusal District', maxPlayers: 10, map: '/Game/Pacifica/Map/Pacifica', spawnAlpha: { x: 4500, y: 1200, z: 150 }, spawnBravo: { x: -3800, y: -1800, z: 150 } },
    { id: 'arena_pacifica_charlie', name: 'Outskirts Outpost 33v33 Battalion Zone', maxPlayers: 66, map: '/Game/Pacifica/Map/Pacifica', spawnAlpha: { x: 8000, y: 8000, z: 300 }, spawnBravo: { x: -8000, y: -8000, z: 300 } }
  ],

  config: {
    helixServerHost: '127.0.0.1',
    gamePort: 7777,
    queryPort: 27015,
    autoStartThreshold: 10,
    serverPassword: 'helix_comp_scrim'
  },

  getOrCreateRating(playerId, playerName = 'HelixPlayer') {
    if (!this.playerRatings.has(playerId)) {
      this.playerRatings.set(playerId, {
        id: playerId,
        name: playerName,
        elo: 1500,
        wins: 0,
        losses: 0,
        streak: 0
      });
    }
    return this.playerRatings.get(playerId);
  },

  joinQueue(playerId, playerName, gameType = 'cs2_5v5') {
    if (!this.activeQueues.has(gameType)) {
      this.activeQueues.set(gameType, new Map());
    }

    const queue = this.activeQueues.get(gameType);
    const player = this.getOrCreateRating(playerId, playerName);
    
    queue.set(playerId, player);
    console.log(`[HELIX MATCHMAKING] Player ${playerName} (${player.elo} MMR) joined queue '${gameType}'. Queue count: ${queue.size}`);

    // Auto-pop competitive match when queue fills
    if (queue.size >= this.config.autoStartThreshold) {
      return this.startMatch(gameType);
    }

    return {
      success: true,
      queueSize: queue.size,
      maxPlayers: this.config.autoStartThreshold,
      status: 'QUEUED'
    };
  },

  fillAIAndStart(gameType = 'cs2_5v5') {
    if (!this.activeQueues.has(gameType)) {
      this.activeQueues.set(gameType, new Map());
    }

    const queue = this.activeQueues.get(gameType);
    const botNames = ['S1mple_Fragger', 'ZywOo_Master', 'NiKo_OneTap', 'B1t_Headshot', 'Dev1ce_Tactician', 'Rain_EntryGod', 'Broky_Clutcher', 'Ropz_Lurker', 'm0NESY_God', 'Karrigan_IGL'];

    let botIdx = 0;
    while (queue.size < this.config.autoStartThreshold && botIdx < botNames.length) {
      const botId = `bot_${botIdx}`;
      if (!queue.has(botId)) {
        queue.set(botId, {
          id: botId,
          name: botNames[botIdx],
          elo: 2400 + Math.floor(Math.random() * 200),
          isAI: true
        });
      }
      botIdx++;
    }

    return this.startMatch(gameType);
  },

  startMatch(gameType = 'cs2_5v5') {
    const queue = this.activeQueues.get(gameType);
    if (!queue || queue.size === 0) return null;

    const playersList = Array.from(queue.values());
    queue.clear();

    // Sort by ELO and split into balanced teams (Snake draft)
    playersList.sort((a, b) => b.elo - a.elo);

    const teamAlpha = [];
    const teamBravo = [];

    playersList.forEach((p, idx) => {
      if (idx % 2 === 0) {
        teamAlpha.push(p);
      } else {
        teamBravo.push(p);
      }
    });

    const matchId = `helix_match_${Date.now()}`;
    const arena = this.arenas[0];
    const serverConnectCmd = `connect ${this.config.helixServerHost}:${this.config.gamePort}; password ${this.config.serverPassword}`;
    const steamConnectUri = `steam://connect/${this.config.helixServerHost}:${this.config.gamePort}`;

    const matchData = {
      matchId,
      gameType,
      arena: arena.name,
      teamAlpha,
      teamBravo,
      serverConnectCmd,
      steamConnectUri,
      status: 'LIVE_DISPATCHED',
      startTime: Date.now(),
      scoreAlpha: 0,
      scoreBravo: 0
    };

    this.activeMatches.set(matchId, matchData);
    console.log(`[HELIX MATCHMAKING] 🚀 MATCH POPPED: ${matchId} on ${arena.name}`);
    console.log(`[HELIX MATCHMAKING] Server Command: ${serverConnectCmd}`);

    return matchData;
  },

  reportMatchResult(matchId, winningTeam) {
    const match = this.activeMatches.get(matchId);
    if (!match) return false;

    const winners = winningTeam === 'alpha' ? match.teamAlpha : match.teamBravo;
    const losers = winningTeam === 'alpha' ? match.teamBravo : match.teamAlpha;

    winners.forEach(p => {
      const rating = this.getOrCreateRating(p.id, p.name);
      rating.wins++;
      rating.elo += 25;
      rating.streak = Math.max(1, rating.streak + 1);
    });

    losers.forEach(p => {
      const rating = this.getOrCreateRating(p.id, p.name);
      rating.losses++;
      rating.elo = Math.max(100, rating.elo - 20);
      rating.streak = Math.min(-1, rating.streak - 1);
    });

    match.status = 'COMPLETED';
    match.winner = winningTeam;
    console.log(`[HELIX MATCHMAKING] 🏆 Match ${matchId} completed. Winner: ${winningTeam.toUpperCase()}`);

    return true;
  }
};

// Expose server endpoints for Helix Node.js Platform
if (typeof Helix !== 'undefined' && Helix.server) {
  Helix.server(async () => {
    console.log('[HELIX MATCHMAKING] Competitive Matchmaking Server Engine Initialized.');

    Helix.endpoint('HelixMM_JoinQueue', (data) => {
      return HelixMatchmakingServer.joinQueue(data.playerId, data.playerName, data.gameType);
    });

    Helix.endpoint('HelixMM_FillAI', (data) => {
      return HelixMatchmakingServer.fillAIAndStart(data.gameType);
    });

    Helix.endpoint('HelixMM_ReportResult', (data) => {
      return HelixMatchmakingServer.reportMatchResult(data.matchId, data.winningTeam);
    });

    Helix.playerJoined(async (playerId) => {
      console.log(`[HELIX MATCHMAKING] Registered player connection in Helix Server: ${playerId}`);
    });
  });
}

if (typeof module !== 'undefined') {
  module.exports = HelixMatchmakingServer;
}
