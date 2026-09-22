const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use environment variable for DB path to support persistent volumes on Railway
const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'customlobbies.db');
const db = new sqlite3.Database(dbPath);

// Initialize schema
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Lobbies table
    db.run(`CREATE TABLE IF NOT EXISTS lobbies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game TEXT,
        gameName TEXT,
        title TEXT,
        host_id INTEGER,
        host_name TEXT DEFAULT 'SystemHost',
        mode TEXT DEFAULT 'Competitive',
        region TEXT DEFAULT 'NA East (Virginia)',
        serverIp TEXT DEFAULT '127.0.0.1:7777',
        consoleCommand TEXT DEFAULT 'connect 127.0.0.1:7777; password helix_comp_scrim',
        maxSlots INTEGER DEFAULT 10,
        currentPlayers TEXT DEFAULT '[]',
        entryType TEXT DEFAULT 'open',
        rules TEXT DEFAULT 'Standard 5v5 FACEIT Rules.',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Squads / Grouping System
    db.run(`CREATE TABLE IF NOT EXISTS squads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        host_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed initial data if empty
    db.get("SELECT COUNT(*) as count FROM lobbies", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO users (username) VALUES ('System')`);
            db.run(`INSERT INTO lobbies (game, gameName, title, host_id, host_name, mode, region, serverIp, consoleCommand, maxSlots) VALUES ('cs2', 'Counter-Strike 2', '🔥 5v5 CS2 High MMR Scrims (128-Tick Dedicated)', 1, 'ApexGod99', 'Ranked Scrim', 'Helix Dedicated (127.0.0.1:7777)', '127.0.0.1:7777', 'connect 127.0.0.1:7777; password helix_comp_scrim', 10)`);
            db.run(`INSERT INTO lobbies (game, gameName, title, host_id, host_name, mode, region, serverIp, consoleCommand, maxSlots) VALUES ('valorant', 'Valorant', '🛡️ Valorant Radiant 5v5 Customs & Draft', 1, 'Valkyrie_CS', 'Custom Competitive', 'NA East (Virginia)', '192.168.1.85:27015', 'connect 192.168.1.85:27015; password customlobbies', 10)`);
            db.run(`INSERT INTO lobbies (game, gameName, title, host_id, host_name, mode, region, serverIp, consoleCommand, maxSlots) VALUES ('pacifica', 'Pacifica Crime 5v5', '🔫 Pacifica Metro 5v5 Scrim & Gunsmith Duel', 1, 'ShadowBlade', 'Pacifica Metro Scrim', 'Helix Dedicated (127.0.0.1:7777)', '127.0.0.1:7777', 'connect 127.0.0.1:7777; password helix_comp_scrim', 10)`);
        }
    });
});

module.exports = db;
