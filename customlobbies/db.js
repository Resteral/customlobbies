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
        title TEXT,
        host_id INTEGER,
        max_players INTEGER DEFAULT 5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(host_id) REFERENCES users(id)
    )`);

    // Squads / Grouping System
    db.run(`CREATE TABLE IF NOT EXISTS squads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        host_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed some initial data if empty
    db.get("SELECT COUNT(*) as count FROM lobbies", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO users (username) VALUES ('System')`);
            db.run(`INSERT INTO lobbies (game, title, host_id) VALUES ('CS:GO', 'Competitive Rank Push', 1)`);
            db.run(`INSERT INTO lobbies (game, title, host_id) VALUES ('Valorant', 'Chill Unrated', 1)`);
        }
    });
});

module.exports = db;
