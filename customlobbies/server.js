const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/lobbies', (req, res) => {
    db.all("SELECT * FROM lobbies ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const formatted = rows.map(r => ({
            ...r,
            host: r.host_name ? { id: r.host_id || 1, username: r.host_name, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' } : { id: 1, username: 'System', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
            currentPlayers: typeof r.currentPlayers === 'string' ? (tryParseJson(r.currentPlayers) || []) : (r.currentPlayers || []),
            tags: [r.gameName || r.game, r.mode || 'Competitive', 'DirectConnect']
        }));
        res.json({ lobbies: formatted });
    });
});

function tryParseJson(str) {
    try { return JSON.parse(str); } catch(e) { return []; }
}

app.post('/api/lobbies', (req, res) => {
    const { game, gameName, title, host_id, host_name, mode, region, serverIp, consoleCommand, maxSlots } = req.body;
    db.run(
        `INSERT INTO lobbies (game, gameName, title, host_id, host_name, mode, region, serverIp, consoleCommand, maxSlots) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [game, gameName || game, title, host_id || 1, host_name || 'Host', mode || 'Competitive', region || 'NA East', serverIp || '127.0.0.1:7777', consoleCommand || 'connect 127.0.0.1:7777', maxSlots || 10],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            const newLobby = {
                id: this.lastID,
                game,
                gameName: gameName || game,
                title,
                host: { id: host_id || 1, username: host_name || 'Host', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
                mode: mode || 'Competitive',
                region: region || 'NA East',
                serverIp: serverIp || '127.0.0.1:7777',
                consoleCommand: consoleCommand || 'connect 127.0.0.1:7777',
                maxSlots: maxSlots || 10,
                currentPlayers: []
            };
            io.emit('lobby_created', newLobby); // Broadcast to all connected clients
            res.status(201).json(newLobby);
        }
    );
});

// Real-time Socket.io logic
io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Matchmaking Queue
    socket.on('join_queue', (data) => {
        console.log(`[Queue] User ${socket.id} joined queue for ${data.game}`);
        // Simulate a delay, then find a match
        setTimeout(() => {
            socket.emit('match_found', { 
                game: data.game,
                match_id: Math.floor(Math.random() * 10000)
            });
        }, 5000 + Math.random() * 5000); // 5-10 seconds simulate
    });

    socket.on('accept_match', (data) => {
        console.log(`[Queue] User ${socket.id} accepted match ${data.match_id}`);
        // Simulate routing to lobby
        socket.emit('route_to_lobby', {
            lobby_id: Math.floor(Math.random() * 100),
            game: data.game
        });
    });

    // 5-Second Publicity Vote
    socket.on('submit_publicity_vote', (data) => {
        console.log(`[Vote] User ${socket.id} submitted intro video for squad ${data.squad_id}`);
        
        // Broadcast to "squad members" to vote
        socket.broadcast.emit('publicity_review_started', {
            applicant_id: socket.id,
            squad_id: data.squad_id,
            video_url: data.video_url // this could be a blob or media stream in real app
        });

        // Simulate squad voting result after 5 seconds
        setTimeout(() => {
            const passed = Math.random() > 0.5;
            io.emit('publicity_vote_result', {
                applicant_id: socket.id,
                passed,
                votes: passed ? [true, true, true, false] : [false, false, false, true]
            });
        }, 5000);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
