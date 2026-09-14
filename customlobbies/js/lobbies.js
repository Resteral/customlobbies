// Lobby Management System for CustomLobbies.com
class LobbyManager {
    constructor() {
        this.lobbies = [];
        this.selectedGame = 'all';
        this.filterType = 'all'; // 'all', 'publicity_vote', 'open'
        this.searchQuery = '';
        this.activeLobbyId = null;
    }

    init(lobbiesData) {
        this.lobbies = lobbiesData || [];
        this.renderGameFilters();
        this.renderLobbies();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('lobbySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderLobbies();
            });
        }

        const filterSelect = document.getElementById('lobbyTypeFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterType = e.target.value;
                this.renderLobbies();
            });
        }
    }

    renderGameFilters() {
        const container = document.getElementById('gameFilterList');
        if (!container) return;

        container.innerHTML = INITIAL_GAMES.map(game => `
            <button class="game-filter-chip ${this.selectedGame === game.id ? 'active' : ''}" 
                    data-game="${game.id}" 
                    onclick="lobbyManager.setGameFilter('${game.id}')">
                <span class="game-icon">${game.icon}</span>
                <span class="game-name">${game.name}</span>
            </button>
        `).join('');
    }

    setGameFilter(gameId) {
        soundManager.playClick();
        this.selectedGame = gameId;
        this.renderGameFilters();
        this.renderLobbies();
    }

    renderLobbies() {
        const container = document.getElementById('lobbiesGrid');
        if (!container) return;

        let filtered = this.lobbies.filter(lobby => {
            const matchesGame = this.selectedGame === 'all' || lobby.game === this.selectedGame;
            const matchesType = this.filterType === 'all' || lobby.entryType === this.filterType;
            const matchesSearch = !this.searchQuery || 
                lobby.title.toLowerCase().includes(this.searchQuery) ||
                lobby.gameName.toLowerCase().includes(this.searchQuery) ||
                lobby.region.toLowerCase().includes(this.searchQuery) ||
                lobby.tags.some(t => t.toLowerCase().includes(this.searchQuery));
            return matchesGame && matchesType && matchesSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card col-span-full">
                    <div class="empty-icon">🎮</div>
                    <h3>No Custom Lobbies Found</h3>
                    <p>Be the first to host a match connected to our dedicated 128-tick server database cluster!</p>
                    <div class="flex justify-center gap-3 mt-3">
                        <button class="btn btn-primary" onclick="app.openModal('createLobbyModal')">
                            <span>➕</span> Host a Custom Lobby
                        </button>
                        <button class="btn btn-secondary" onclick="queueManager.startQueue('${this.selectedGame !== 'all' ? this.selectedGame : 'valorant'}')">
                            <span>⚡</span> Auto-Join Queue
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(lobby => {
            const currentCount = lobby.currentPlayers.length;
            const isFull = currentCount >= lobby.maxSlots;
            const isPublicity = lobby.entryType === 'publicity_vote';

            return `
                <div class="lobby-card glass-panel glow-hover animate-fade-in" onclick="lobbyManager.openLobbyDetails('${lobby.id}')">
                    <div class="lobby-card-header">
                        <div class="lobby-badge-group">
                            <span class="badge badge-dark">${lobby.gameName}</span>
                            ${isPublicity ? 
                                '<span class="badge badge-publicity"><span class="pulse-dot"></span> 5s Vote Gate</span>' : 
                                '<span class="badge badge-open">🟢 Direct Connect</span>'}
                        </div>
                        <div class="lobby-player-count ${isFull ? 'full' : ''}">
                            <span class="count-num">${currentCount}/${lobby.maxSlots}</span>
                            <span class="count-label">Players</span>
                        </div>
                    </div>

                    <h3 class="lobby-title">${escapeHtml(lobby.title)}</h3>

                    <div class="lobby-meta">
                        <div class="meta-item"><span class="meta-icon">🌐</span> ${lobby.region}</div>
                        <div class="meta-item"><span class="meta-icon">⚡</span> ${lobby.ping || 18}ms</div>
                        <div class="meta-item"><span class="meta-icon">🎙️</span> ${lobby.hasVoice ? 'Voice On' : 'No Mic'}</div>
                    </div>

                    <div class="p-2 rounded bg-black/40 border border-white/5 my-2 flex items-center justify-between text-xs">
                        <span class="text-muted font-mono text-[11px] truncate max-w-[170px]">🖥️ ${escapeHtml(lobby.serverIp || '104.28.19.42:7777')}</span>
                        <span class="text-neon-cyan font-bold cursor-pointer hover:underline" onclick="event.stopPropagation(); programClient.openGameConnectModal(${JSON.stringify(lobby).replace(/"/g, '&quot;')})">
                            🔗 Connect Link
                        </span>
                    </div>

                    <div class="lobby-host-bar">
                        <img src="${lobby.host.avatar}" alt="${lobby.host.username}" class="host-avatar" />
                        <div class="host-info">
                            <span class="host-name">Host: <strong>${escapeHtml(lobby.host.username)}</strong></span>
                            <span class="host-time">${lobby.createdAt}</span>
                        </div>
                    </div>

                    <div class="lobby-tags">
                        ${lobby.tags.map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('')}
                    </div>

                    <div class="lobby-card-footer flex gap-2">
                        <button class="btn ${isFull ? 'btn-secondary' : isPublicity ? 'btn-publicity' : 'btn-primary'} flex-1" 
                                onclick="event.stopPropagation(); lobbyManager.handleJoinLobby('${lobby.id}')">
                            ${isFull ? '👁️ Spectate' : isPublicity ? '⚡ Knock & 5s Vote' : '🚀 Join Match'}
                        </button>
                        <button class="btn btn-secondary btn-xs px-2" title="Launch Game Protocol" onclick="event.stopPropagation(); programClient.openGameConnectModal(${JSON.stringify(lobby).replace(/"/g, '&quot;')})">
                            🎮 Connect
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openLobbyDetails(lobbyId) {
        soundManager.playClick();
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;

        this.activeLobbyId = lobbyId;
        const modal = document.getElementById('lobbyDetailsModal');
        if (!modal) return;

        const content = document.getElementById('lobbyDetailsContent');
        if (content) {
            content.innerHTML = this.renderLobbyDetailsHTML(lobby);
        }

        app.openModal('lobbyDetailsModal');
    }

    renderLobbyDetailsHTML(lobby) {
        const isUserInLobby = lobby.currentPlayers.some(p => p.id === app.currentUser.id);
        const alphaTeam = lobby.currentPlayers.filter(p => p.team === 'Alpha');
        const omegaTeam = lobby.currentPlayers.filter(p => p.team === 'Omega');
        const spectators = lobby.currentPlayers.filter(p => p.team === 'Spectator');

        return `
            <div class="lobby-room-view">
                <div class="lobby-room-header">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="badge badge-dark">${lobby.gameName}</span>
                            <span class="badge badge-sub">${lobby.mode}</span>
                            ${lobby.entryType === 'publicity_vote' ? '<span class="badge badge-publicity">5s Intro Publicity Gate</span>' : '<span class="badge badge-open">Open Matchmaking</span>'}
                        </div>
                        <h2 class="text-2xl font-bold text-gradient">${escapeHtml(lobby.title)}</h2>
                    </div>
                    <div class="text-right">
                        <div class="text-xl font-extrabold text-neon-cyan">${lobby.currentPlayers.length} / ${lobby.maxSlots} SLOTS</div>
                        <div class="text-xs text-muted">${lobby.region} • ${lobby.tier} • ${lobby.ping || 18}ms</div>
                    </div>
                </div>

                <!-- Server Endpoint & Direct Game Link Banner -->
                <div class="glass-card p-3 my-3 border border-neon-cyan/30 flex flex-wrap justify-between items-center gap-2">
                    <div>
                        <div class="text-xs text-muted">DEDICATED SERVER ENDPOINT:</div>
                        <div class="text-sm font-mono text-neon-cyan font-bold">${escapeHtml(lobby.serverIp || '104.28.19.42:7777')}</div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-xs btn-primary pulse-btn" onclick="programClient.openGameConnectModal(${JSON.stringify(lobby).replace(/"/g, '&quot;')})">
                            🚀 Launch & Direct Connect
                        </button>
                        <button class="btn btn-xs btn-outline" onclick="navigator.clipboard.writeText('${lobby.serverIp || '104.28.19.42:7777'}'); app.showToast('Copied IP to clipboard!', 'info');">
                            📋 Copy IP
                        </button>
                    </div>
                </div>

                <div class="lobby-room-banner glass-card p-3 my-2 flex justify-between items-center text-xs">
                    <div class="flex items-center gap-3">
                        <img src="${lobby.host.avatar}" class="w-8 h-8 rounded-full border border-neon-purple" />
                        <div>
                            <span class="font-semibold">Host: ${escapeHtml(lobby.host.username)}</span>
                            <span class="text-neon-cyan block">Voice: ${escapeHtml(lobby.voiceChannel || 'Built-in Spatial VoIP')}</span>
                        </div>
                    </div>
                    <div class="text-muted max-w-md">
                        <strong>Rules:</strong> ${escapeHtml(lobby.rules || 'Standard competitive rules.')}
                    </div>
                </div>

                <!-- Teams Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                    <!-- Team Alpha -->
                    <div class="team-card team-alpha glass-panel p-3">
                        <div class="team-header flex justify-between items-center pb-2 border-b border-white/10">
                            <div class="font-bold text-neon-cyan">🛡️ TEAM ALPHA (${alphaTeam.length})</div>
                            ${isUserInLobby ? `<button class="btn btn-xs btn-outline" onclick="lobbyManager.switchTeam('${lobby.id}', 'Alpha')">Switch Here</button>` : ''}
                        </div>
                        <div class="team-roster mt-2 space-y-2">
                            ${alphaTeam.map(p => this.renderRosterSlot(p, lobby)).join('')}
                        </div>
                    </div>

                    <!-- Team Omega -->
                    <div class="team-card team-omega glass-panel p-3">
                        <div class="team-header flex justify-between items-center pb-2 border-b border-white/10">
                            <div class="font-bold text-neon-pink">⚔️ TEAM OMEGA (${omegaTeam.length})</div>
                            ${isUserInLobby ? `<button class="btn btn-xs btn-outline" onclick="lobbyManager.switchTeam('${lobby.id}', 'Omega')">Switch Here</button>` : ''}
                        </div>
                        <div class="team-roster mt-2 space-y-2">
                            ${omegaTeam.map(p => this.renderRosterSlot(p, lobby)).join('')}
                        </div>
                    </div>
                </div>

                ${spectators.length > 0 ? `
                    <div class="spectators-box glass-panel p-2 text-xs text-muted flex items-center gap-2">
                        <span>👁️ Spectators (${spectators.length}):</span>
                        ${spectators.map(s => `<span class="badge badge-dark">${escapeHtml(s.username)}</span>`).join(' ')}
                    </div>
                ` : ''}

                <!-- Lobby Action Bar -->
                <div class="lobby-room-footer mt-4 pt-3 border-t border-white/10 flex flex-wrap justify-between items-center gap-3">
                    <div class="flex gap-2">
                        ${isUserInLobby ? `
                            <button class="btn btn-success" onclick="lobbyManager.toggleReady('${lobby.id}')">
                                <span>⚡</span> Ready Up
                            </button>
                            <button class="btn btn-danger" onclick="lobbyManager.leaveLobby('${lobby.id}')">
                                <span>🚪</span> Leave Lobby
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="lobbyManager.handleJoinLobby('${lobby.id}')">
                                ${lobby.entryType === 'publicity_vote' ? '⚡ Knock with 5s Intro' : '🚀 Join Match'}
                            </button>
                        `}
                        <button class="btn btn-secondary" onclick="friendsManager.openInviteToLobbyModal('${lobby.id}')">
                            <span>👥</span> Invite Friends
                        </button>
                    </div>

                    <div class="flex gap-2">
                        <button class="btn btn-primary pulse-btn" onclick="programClient.openGameConnectModal(${JSON.stringify(lobby).replace(/"/g, '&quot;')})">
                            🎮 Connect Game Client
                        </button>
                        ${lobby.host.id === app.currentUser.id ? `
                            <button class="btn btn-success" onclick="lobbyManager.launchMatch('${lobby.id}')">
                                🚀 START MATCH NOW
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderRosterSlot(player, lobby) {
        const isMe = player.id === app.currentUser.id;
        const isHost = player.role === 'Host';

        return `
            <div class="roster-slot flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 ${isMe ? 'border-neon-cyan/50 bg-neon-cyan/10' : ''}">
                <div class="flex items-center gap-2">
                    <span class="status-indicator ${player.ready ? 'ready' : 'not-ready'}"></span>
                    <span class="font-medium text-sm ${isMe ? 'text-neon-cyan font-bold' : ''}">
                        ${escapeHtml(player.username)} ${isMe ? '(You)' : ''}
                    </span>
                    ${isHost ? '<span class="badge badge-xs badge-host">HOST</span>' : ''}
                </div>
                <div class="flex items-center gap-3 text-xs">
                    <span class="text-muted font-mono">${player.ping || 18}ms</span>
                    <span class="${player.ready ? 'text-green-400 font-semibold' : 'text-gray-500'}">
                        ${player.ready ? 'READY ✅' : 'WAITING ⏳'}
                    </span>
                </div>
            </div>
        `;
    }

    handleJoinLobby(lobbyId) {
        soundManager.playClick();
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;

        if (lobby.currentPlayers.some(p => p.id === app.currentUser.id)) {
            this.openLobbyDetails(lobbyId);
            return;
        }

        if (lobby.entryType === 'publicity_vote') {
            groupsManager.startPublicityVoteApplication({
                targetType: 'lobby',
                targetId: lobby.id,
                targetTitle: lobby.title,
                targetHost: lobby.host.username
            });
            return;
        }

        if (lobby.currentPlayers.length >= lobby.maxSlots) {
            app.showToast('Lobby is currently full. Joining as spectator.', 'info');
            lobby.currentPlayers.push({
                id: app.currentUser.id,
                username: app.currentUser.username,
                team: 'Spectator',
                ready: true,
                role: 'Spectator',
                ping: 18,
                mmr: app.currentUser.mmr
            });
        } else {
            const alphaCount = lobby.currentPlayers.filter(p => p.team === 'Alpha').length;
            const omegaCount = lobby.currentPlayers.filter(p => p.team === 'Omega').length;
            const assignedTeam = alphaCount <= omegaCount ? 'Alpha' : 'Omega';

            lobby.currentPlayers.push({
                id: app.currentUser.id,
                username: app.currentUser.username,
                team: assignedTeam,
                ready: false,
                role: 'Member',
                ping: 18,
                mmr: app.currentUser.mmr
            });
            soundManager.playJoinChime();
            app.showToast(`Joined ${lobby.title} (Team ${assignedTeam})!`, 'success');

            // Log database insertion
            databaseManager.logQuery(`POSTGRES: INSERT INTO lobby_members (lobby_id, user_id, team, server_ip) VALUES ('${lobby.id}', '${app.currentUser.id}', '${assignedTeam}', '${lobby.serverIp}');`);
        }

        this.renderLobbies();
        this.openLobbyDetails(lobbyId);
    }

    switchTeam(lobbyId, newTeam) {
        soundManager.playClick();
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;

        const player = lobby.currentPlayers.find(p => p.id === app.currentUser.id);
        if (player) {
            player.team = newTeam;
            this.openLobbyDetails(lobbyId);
            app.showToast(`Switched to Team ${newTeam}!`, 'info');
        }
    }

    toggleReady(lobbyId) {
        soundManager.playClick();
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;

        const player = lobby.currentPlayers.find(p => p.id === app.currentUser.id);
        if (player) {
            player.ready = !player.ready;
            this.openLobbyDetails(lobbyId);
            app.showToast(player.ready ? 'You are READY! ⚡' : 'Unreadied.', 'info');
        }
    }

    leaveLobby(lobbyId) {
        soundManager.playClick();
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;

        lobby.currentPlayers = lobby.currentPlayers.filter(p => p.id !== app.currentUser.id);
        app.closeModal('lobbyDetailsModal');
        this.renderLobbies();
        app.showToast('Left the lobby.', 'info');
    }

    launchMatch(lobbyId) {
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        soundManager.playVoteApproved();
        app.showToast('🔥 MATCH LAUNCHING! Allocating Dedicated Game Server...', 'success');
        
        databaseManager.logQuery(`SERVER_FLEET: Allocated dedicated port ${lobby ? lobby.serverIp : '7777'} to match session ${lobbyId}. Synced across 14 database nodes.`);

        setTimeout(() => {
            if (lobby) programClient.openGameConnectModal(lobby);
        }, 600);
    }

    createLobby(formData) {
        soundManager.playClick();
        const gameObj = INITIAL_GAMES.find(g => g.id === formData.game) || { name: 'Custom Game', icon: '🎮', defaultPort: 27015, protocol: 'customlobbies://direct-connect' };

        const randomPort = gameObj.defaultPort || 27015;
        const newLobby = {
            id: 'lobby_' + Date.now(),
            title: formData.title || `${app.currentUser.username}'s ${gameObj.name} Lobby`,
            game: formData.game,
            gameName: gameObj.name,
            host: {
                id: app.currentUser.id,
                username: app.currentUser.username,
                avatar: app.currentUser.avatar
            },
            mode: formData.mode || 'Competitive',
            region: formData.region || 'NA East (Virginia)',
            serverIp: `142.250.190.${Math.floor(Math.random() * 200)}:${randomPort}`,
            connectLink: gameObj.protocol || 'customlobbies://direct-connect',
            consoleCommand: `connect 142.250.190.50:${randomPort}; password customlobbies`,
            tier: formData.tier || 'Open Tier',
            ping: Math.floor(14 + Math.random() * 10),
            maxSlots: parseInt(formData.maxSlots) || 10,
            currentPlayers: [
                {
                    id: app.currentUser.id,
                    username: app.currentUser.username,
                    team: 'Alpha',
                    ready: true,
                    role: 'Host',
                    ping: 14,
                    mmr: app.currentUser.mmr
                }
            ],
            entryType: formData.entryType || 'publicity_vote',
            hasVoice: formData.hasVoice !== false,
            voiceChannel: formData.voiceChannel || 'Discord Voice Room',
            rules: formData.rules || 'Respect other players, have fun, no griefing.',
            createdAt: 'Just now',
            tags: [gameObj.name, formData.mode || 'Custom', formData.entryType === 'publicity_vote' ? '5sVote' : 'DirectConnect']
        };

        this.lobbies.unshift(newLobby);
        this.renderLobbies();
        app.closeModal('createLobbyModal');
        soundManager.playJoinChime();
        app.showToast('🎉 Custom Lobby Created & Server Port Allocated!', 'success');

        databaseManager.logQuery(`POSTGRES: INSERT INTO lobbies (id, game_id, host_id, server_ip) VALUES ('${newLobby.id}', '${newLobby.game}', '${app.currentUser.id}', '${newLobby.serverIp}');`);

        this.openLobbyDetails(newLobby.id);
    }
}

const lobbyManager = new LobbyManager();
