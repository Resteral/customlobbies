// Desktop Program Client Suite & Direct Game Protocol Connector
class ProgramClient {
    constructor() {
        this.isMaximized = false;
        this.activeConnectLobby = null;
        this.systemPing = 14;
    }

    init() {
        this.setupWindowControls();
        this.setupKeyboardShortcuts();
        this.startSystemMetricsTicker();
    }

    setupWindowControls() {
        const minBtn = document.getElementById('windowMinBtn');
        const maxBtn = document.getElementById('windowMaxBtn');
        const closeBtn = document.getElementById('windowCloseBtn');

        if (minBtn) {
            minBtn.addEventListener('click', () => {
                soundManager.playClick();
                app.showToast('Application minimized to taskbar tray.', 'info');
            });
        }

        if (maxBtn) {
            maxBtn.addEventListener('click', () => {
                soundManager.playClick();
                this.isMaximized = !this.isMaximized;
                if (this.isMaximized) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                    maxBtn.innerHTML = '🗗';
                } else {
                    if (document.exitFullscreen && document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    maxBtn.innerHTML = '🗖';
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                soundManager.playClick();
                app.showToast('CustomLobbies Program Client running in background tray.', 'info');
            });
        }
    }

    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key.toLowerCase() === 'q') {
                    e.preventDefault();
                    app.switchView('auto-queue');
                } else if (e.key.toLowerCase() === 'l') {
                    e.preventDefault();
                    app.switchView('lobbies');
                } else if (e.key.toLowerCase() === 'd') {
                    e.preventDefault();
                    app.switchView('database');
                } else if (e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    app.switchView('streams');
                } else if (e.key.toLowerCase() === 'm') {
                    e.preventDefault();
                    const enabled = soundManager.toggleSound();
                    app.showToast(enabled ? 'Sound On' : 'Sound Muted', 'info');
                }
            }
        });
    }

    startSystemMetricsTicker() {
        setInterval(() => {
            this.systemPing = Math.floor(12 + Math.random() * 6);
            const pingEl = document.getElementById('systemStatusPing');
            if (pingEl) pingEl.innerText = `${this.systemPing}ms`;

            const memoryEl = document.getElementById('systemStatusMemory');
            if (memoryEl) {
                const mem = (128 + Math.random() * 12).toFixed(1);
                memoryEl.innerText = `${mem} MB`;
            }
        }, 3000);
    }

    // ============================================================
    // DIRECT GAME PROTOCOL CONNECT & LAUNCH MODAL
    // ============================================================

    openGameConnectModal(lobby) {
        soundManager.playClick();
        this.activeConnectLobby = lobby;

        document.getElementById('connectModalGameTitle').innerText = `${lobby.gameName} Dedicated Match Server`;
        document.getElementById('connectModalLobbyName').innerText = lobby.title;
        document.getElementById('connectModalServerIp').value = lobby.serverIp || '144.76.12.89:27015';
        document.getElementById('connectModalConsoleCmd').value = lobby.consoleCommand || `connect ${lobby.serverIp || '144.76.12.89:27015'}`;
        document.getElementById('connectModalPingBadge').innerText = `⚡ ${lobby.ping || 16}ms • ${lobby.region}`;
        document.getElementById('connectModalProtocolBadge').innerText = lobby.connectLink.split(':')[0].toUpperCase() + ' Protocol';

        app.openModal('gameConnectModal');
    }

    launchGameProtocol() {
        soundManager.playVoteApproved();
        if (!this.activeConnectLobby) return;

        const protocol = this.activeConnectLobby.connectLink;
        app.showToast(`🚀 Launching Game Engine Protocol: ${protocol}...`, 'success');

        // Trigger URI scheme
        try {
            window.location.href = protocol;
        } catch (e) {
            console.log('URI Scheme launch:', e);
        }

        // Database log
        databaseManager.logQuery(`GAME_CLIENT: Triggered protocol handler '${protocol}' for match session ${this.activeConnectLobby.id}`);
    }

    copyServerIp() {
        soundManager.playClick();
        const ipInput = document.getElementById('connectModalServerIp');
        if (ipInput) {
            navigator.clipboard.writeText(ipInput.value);
            app.showToast('Copied Server IP & Port to Clipboard!', 'success');
        }
    }

    copyConsoleCommand() {
        soundManager.playClick();
        const cmdInput = document.getElementById('connectModalConsoleCmd');
        if (cmdInput) {
            navigator.clipboard.writeText(cmdInput.value);
            app.showToast('Copied Game Console Connect Command!', 'success');
        }
    }
}

const programClient = new ProgramClient();
