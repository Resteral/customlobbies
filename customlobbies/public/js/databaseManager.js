// Game Database Cluster & Server Fleet Telemetry System for CustomLobbies.com
class DatabaseManager {
    constructor() {
        this.cluster = DATABASE_CLUSTER;
        this.queryLog = [...DATABASE_CLUSTER.recentQueries];
        this.isStreaming = true;
        this.streamInterval = null;
    }

    init() {
        this.renderDatabaseDashboard();
        this.renderServerNodes();
        this.startLiveTelemetryStream();
    }

    renderDatabaseDashboard() {
        const queryContainer = document.getElementById('dbQueryStreamConsole');
        if (!queryContainer) return;

        queryContainer.innerHTML = this.queryLog.map(q => `
            <div class="db-query-line">
                <span class="db-timestamp">[${new Date().toLocaleTimeString()}]</span>
                <span class="db-sql">${escapeHtml(q)}</span>
            </div>
        `).join('');

        queryContainer.scrollTop = queryContainer.scrollHeight;
    }

    renderServerNodes() {
        const container = document.getElementById('serverFleetGrid');
        if (!container) return;

        container.innerHTML = this.cluster.nodes.map(node => `
            <div class="server-node-card glass-panel p-3 border-l-4 border-neon-cyan">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-bold text-white text-sm">${escapeHtml(node.name)}</h4>
                        <span class="text-xs text-muted">📍 ${node.location}</span>
                    </div>
                    <span class="badge badge-success text-[10px]">● ${node.status}</span>
                </div>

                <div class="grid grid-cols-3 gap-2 my-2 text-xs">
                    <div class="p-2 rounded bg-white/5">
                        <span class="text-muted block text-[10px]">ENDPOINT</span>
                        <span class="font-mono text-neon-cyan">${node.ip}:${node.port}</span>
                    </div>
                    <div class="p-2 rounded bg-white/5">
                        <span class="text-muted block text-[10px]">PING / LATENCY</span>
                        <span class="font-bold ${node.ping < 30 ? 'text-green-400' : 'text-yellow-400'}">${node.ping}ms</span>
                    </div>
                    <div class="p-2 rounded bg-white/5">
                        <span class="text-muted block text-[10px]">THROUGHPUT</span>
                        <span class="font-bold text-white">${node.queriesPerSec.toLocaleString()} QPS</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    logQuery(queryStr) {
        this.queryLog.push(queryStr);
        if (this.queryLog.length > 50) this.queryLog.shift();
        this.renderDatabaseDashboard();
    }

    startLiveTelemetryStream() {
        clearInterval(this.streamInterval);
        const randomOps = [
            () => `POSTGRES: SELECT mmr, rank FROM player_profiles WHERE user_id = 'user_${Math.floor(Math.random() * 50)}';`,
            () => `REDIS: HGETALL lobby_session:lob_${Math.floor(Math.random() * 100)};`,
            () => `TELEMETRY: Node us-east-1a heart-beat OK (Tick: 128, Ping: 16ms, Jitter: 0.2ms)`,
            () => `POSTGRES: UPDATE match_stats SET frags = frags + 1 WHERE match_id = 'lob_1';`,
            () => `REDIS: TTL queue_lock:marvel_rivals -> 28s`,
            () => `SERVER_FLEET: Synced 128-tick snapshot with 10 players on IP 104.28.19.42:7777`
        ];

        this.streamInterval = setInterval(() => {
            if (this.isStreaming) {
                const op = randomOps[Math.floor(Math.random() * randomOps.length)]();
                this.logQuery(op);
            }
        }, 4000);
    }

    executeCustomQuery(query) {
        soundManager.playClick();
        if (!query.trim()) return;

        this.logQuery(`EXEC >> ${query}`);

        let result = '';
        const qUpper = query.toUpperCase();

        if (qUpper.includes('SELECT') && qUpper.includes('PLAYERS')) {
            result = `[SQL RESULTS] Returned 4 records: user_me (MMR: 2180), ViperMain_00 (MMR: 2450), AWP_Sn1per (MMR: 2120), Chief_Miller (MMR: 1900)`;
        } else if (qUpper.includes('SELECT') && qUpper.includes('LOBBIES')) {
            result = `[SQL RESULTS] 24 Active Dedicated Lobbies Synced across PostgreSQL Cluster.`;
        } else if (qUpper.includes('SHOW SERVERS') || qUpper.includes('NODES')) {
            result = `[FLEET STATUS] 4 Database Nodes Online (US-East, US-West, EU-Central, Global). 100% Uptime.`;
        } else {
            result = `[QUERY OK] Query executed in 1.42ms. 1 row affected.`;
        }

        setTimeout(() => {
            this.logQuery(result);
            soundManager.playMessageNotification();
        }, 200);
    }
}

const databaseManager = new DatabaseManager();
