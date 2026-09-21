const GAMES = [
    { id: 'csgo', name: 'CS:GO', category: 'FPS', icon: '🔫', tickrate: '128-Tick', avgQueueSec: 4, activeQueues: 1420 },
    { id: 'valorant', name: 'Valorant', category: 'FPS', icon: '🎯', tickrate: '128-Tick', avgQueueSec: 6, activeQueues: 2150 },
    { id: 'rocketleague', name: 'Rocket League', category: 'Sports', icon: '🏎️', tickrate: '120-Tick', avgQueueSec: 3, activeQueues: 840 },
    { id: 'rust', name: 'Rust', category: 'Survival', icon: '🪨', tickrate: 'Modded', avgQueueSec: 12, activeQueues: 320 }
];

// Auto-Join Queue & Real-Time Matchmaker System for CustomLobbies.com
class QueueManager {
    constructor() {
        this.status = 'IDLE'; // 'IDLE' | 'QUEUED' | 'MATCH_FOUND' | 'CONNECTED'
        this.queuedGame = null;
        this.queueTimer = null;
        this.elapsedSeconds = 0;
        this.matchCountdownTimer = null;
        this.matchSecondsLeft = 10;
        this.foundLobby = null;
    }

    init() {
        this.renderAutoQueueHub();
        this.updateQueueWidgetUI();

        // Listen for socket events
        socket.on('match_found', (data) => {
            if (this.status === 'QUEUED' && this.queuedGame && this.queuedGame.id === data.game) {
                clearInterval(this.queueTimer);
                this.triggerMatchFound(this.queuedGame, data.match_id);
            }
        });

        socket.on('route_to_lobby', (data) => {
            app.showToast(`Routing to lobby ${data.lobby_id}...`, 'success');
            // Hide modal and join logic could go here
            setTimeout(() => {
                app.closeModal('matchFoundModal');
                this.status = 'IDLE';
                this.queuedGame = null;
                this.updateQueueWidgetUI();
                app.switchView('lobbies');
            }, 1000);
        });
    }

    renderAutoQueueHub() {
        const container = document.getElementById('autoQueueGamesGrid');
        if (!container) return;

        const games = GAMES;

        container.innerHTML = games.map(game => `
            <div class="auto-queue-card glass-panel glow-hover p-4 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-3xl">${game.icon}</span>
                        <span class="badge badge-dark text-[10px]">${escapeHtml(game.category)}</span>
                    </div>
                    <h3 class="font-bold text-base text-white">${escapeHtml(game.name)}</h3>
                    <div class="text-xs text-muted mt-1 flex flex-col gap-1">
                        <span class="text-neon-cyan">⚡ Avg Queue: ~${game.avgQueueSec}s</span>
                        <span>👥 ${game.activeQueues.toLocaleString()} Players Searching</span>
                        <span class="text-[11px] text-gray-400">🛡️ ${game.tickrate}</span>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-white/5 flex gap-2">
                    <button class="btn btn-primary btn-sm btn-block" onclick="queueManager.startQueue('${game.id}')">
                        ⚡ Auto-Join Queue
                    </button>
                </div>
            </div>
        `).join('');
    }

    startQueue(gameId) {
        soundManager.playClick();
        const game = GAMES.find(g => g.id === gameId);
        if (!game) return;

        // If already in queue for this game, ignore
        if (this.status === 'QUEUED' && this.queuedGame && this.queuedGame.id === gameId) {
            app.showToast('Already searching for matches!', 'warning');
            return;
        }

        this.status = 'QUEUED';
        this.queuedGame = game;
        this.elapsedSeconds = 0;

        // Emit queue event to backend
        socket.emit('join_queue', { game: game.id });

        // Log to database console
        databaseManager.logQuery(`REDIS: ZADD queue:${game.id} ${app.currentUser.mmr} "${app.currentUser.id}"`);
        databaseManager.logQuery(`POSTGRES: INSERT INTO queue_telemetry (user_id, game, elo, region) VALUES ('${app.currentUser.id}', '${game.id}', ${app.currentUser.mmr}, 'NA-East');`);

        this.updateQueueWidgetUI();
        app.showToast(`⚡ Entered Auto-Join Queue for ${game.name}! Finding lowest-ping server...`, 'success');

        clearInterval(this.queueTimer);
        this.queueTimer = setInterval(() => {
            this.elapsedSeconds++;
            this.updateQueueWidgetUI();
        }, 1000);
    }

    cancelQueue() {
        soundManager.playClick();
        clearInterval(this.queueTimer);
        clearInterval(this.matchCountdownTimer);
        
        if (this.queuedGame) {
            databaseManager.logQuery(`REDIS: ZREM queue:${this.queuedGame.id} "${app.currentUser.id}"`);
        }

        this.status = 'IDLE';
        this.queuedGame = null;
        this.updateQueueWidgetUI();
        app.closeModal('matchFoundModal');
        app.showToast('Matchmaking queue cancelled.', 'info');
    }

    updateQueueWidgetUI() {
        const bar = document.getElementById('globalQueueBar');
        if (!bar) return;

        if (this.status === 'QUEUED' && this.queuedGame) {
            bar.style.display = 'flex';
            bar.classList.add('animate-fade-in');
            
            const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
            const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');

            document.getElementById('queueGameTitle').innerText = `${this.queuedGame.icon} ${this.queuedGame.name}`;
            document.getElementById('queueTimerText').innerText = `${mins}:${secs}`;
            document.getElementById('queueEloRange').innerText = `MMR ${app.currentUser.mmr - 50} - ${app.currentUser.mmr + 50}`;
        } else {
            bar.style.display = 'none';
        }
    }

    triggerMatchFound(game) {
        this.status = 'MATCH_FOUND';
        this.updateQueueWidgetUI();
        soundManager.playVoteApproved();

        // Pick or generate match lobby
        let lobby = lobbyManager.lobbies.find(l => l.game === game.id);
        if (!lobby) {
            lobby = {
                id: 'lobby_auto_' + Date.now(),
                title: `⚡ AUTO-MATCH: ${game.name} 5v5 Competitive Server [128-Tick]`,
                game: game.id,
                gameName: game.name,
                host: { id: 'bot_server', username: 'CustomLobbies Dedicated Host', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80' },
                mode: 'Ranked Competitive',
                region: 'NA East (Virginia)',
                serverIp: `142.250.190.${Math.floor(Math.random() * 200)}:${game.defaultPort || 27015}`,
                connectLink: game.protocol || 'customlobbies://direct-connect',
                consoleCommand: `connect 142.250.190.45:${game.defaultPort || 27015}; password auto_match`,
                tier: app.currentUser.rank,
                ping: Math.floor(12 + Math.random() * 15),
                maxSlots: 10,
                currentPlayers: [
                    { id: 'p1', username: 'PhantomStrike', team: 'Alpha', ready: true, role: 'Member', ping: 14, mmr: app.currentUser.mmr + 10 },
                    { id: 'p2', username: 'BulletStorm_9', team: 'Alpha', ready: true, role: 'Member', ping: 19, mmr: app.currentUser.mmr - 15 },
                    { id: 'p3', username: 'NeonSpectre', team: 'Omega', ready: true, role: 'Member', ping: 21, mmr: app.currentUser.mmr + 5 },
                    { id: 'p4', username: 'Vortex_King', team: 'Omega', ready: true, role: 'Member', ping: 16, mmr: app.currentUser.mmr }
                ],
                entryType: 'open',
                hasVoice: true,
                voiceChannel: 'Built-in Server Spatial VoIP',
                rules: 'Official CustomLobbies Automated Competitive Rules.',
                createdAt: 'Just now',
                tags: [game.name, 'AutoMatch', 'DedicatedServer', 'LowPing']
            };
            lobbyManager.lobbies.unshift(lobby);
            lobbyManager.renderLobbies();
        }

        this.foundLobby = lobby;

        // Show urgent Accept modal
        document.getElementById('matchGameName').innerText = `${game.icon} ${game.name}`;
        document.getElementById('matchServerNode').innerText = `${lobby.region} • ${lobby.ping}ms ping`;
        document.getElementById('matchTickrate').innerText = game.tickrate || '128-Tick Dedicated';
        
        this.matchSecondsLeft = 10;
        document.getElementById('matchAcceptCountdown').innerText = this.matchSecondsLeft;

        app.openModal('matchFoundModal');

        clearInterval(this.matchCountdownTimer);
        this.matchCountdownTimer = setInterval(() => {
            this.matchSecondsLeft--;
            document.getElementById('matchAcceptCountdown').innerText = this.matchSecondsLeft;
            soundManager.playCountdownTick(this.matchSecondsLeft <= 3);

            if (this.matchSecondsLeft <= 0) {
                clearInterval(this.matchCountdownTimer);
                this.cancelQueue();
                app.showToast('Match declined (timed out).', 'warning');
            }
        }, 1000);
    }

    acceptMatch() {
        soundManager.playClick();
        clearInterval(this.matchCountdownTimer);

        // Tell the backend we accepted the match
        socket.emit('accept_match', { 
            game: this.queuedGame.id, 
            match_id: this.foundLobby.id 
        });

        this.status = 'CONNECTED';
        
        // Database log (UI telemetry simulation still shows for effect)
        databaseManager.logQuery(`POSTGRES: INSERT INTO match_participants (match_id, user_id, team, ping) VALUES ('${this.foundLobby.id}', '${app.currentUser.id}', 'Alpha', ${this.foundLobby.ping});`);
        databaseManager.logQuery(`SERVER_FLEET: Allocated dedicated port ${this.foundLobby.serverIp} to match session ${this.foundLobby.id}.`);

        soundManager.playVoteApproved();
        app.showToast('🚀 MATCH ACCEPTED! Waiting for server allocation...', 'success');

        // Add user to local lobby representation
        if (this.foundLobby && !this.foundLobby.currentPlayers.some(p => p.id === app.currentUser.id)) {
            this.foundLobby.currentPlayers.push({
                id: app.currentUser.id,
                username: app.currentUser.username,
                team: 'Alpha',
                ready: true,
                role: 'Member',
                ping: this.foundLobby.ping,
                mmr: app.currentUser.mmr
            });
        }
    }

    declineMatch() {
        soundManager.playVoteRejected();
        this.cancelQueue();
    }
}

const queueManager = new QueueManager();
