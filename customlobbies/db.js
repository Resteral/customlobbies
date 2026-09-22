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

    // Seed system user if empty
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO users (username) VALUES ('System')`);
        }
    });
});

module.exports = db;
