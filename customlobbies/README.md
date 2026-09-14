# ⚡ CustomLobbies.com — Desktop Program & Matchmaking Suite

**CustomLobbies.com** is an enterprise gaming matchmaker, live streaming hub, and social network featuring **Custom Lobbies for all games**, an **Auto-Join Matchmaking Queue**, **Direct Game Protocol Links**, **Real-Time Database Fleet Telemetry**, and the **5-Second Publicity Vote Gatekeeper**.

---

## 🚀 Key Features

### 1. 🎮 Custom Game Lobbies for All Games
- Full roster support: **Valorant, CS2, GTA V / FiveM RP, Marvel Rivals, Fortnite, Apex Legends, League of Legends, Rocket League, Overwatch 2, Rainbow Six Siege, COD Warzone, Rust, Dota 2, Super Smash Bros, Street Fighter 6, Helldivers 2, TF2, Minecraft**, and Custom Indie games.
- Dedicated 128-tick server node allocation, team slot assignments (**Team Alpha** vs **Team Omega** vs **Spectators**), and ready-up checks.

### 2. ⚡ Auto-Join Queue Matchmaking System
- 1-click **Auto-Join Queue** for any game.
- Real-time Redis-powered MMR/Elo range expansion and ping optimizer.
- **Match Found Modal**: 10-second countdown with sound effects, accept/decline triggers, and automatic routing to the allocated server slot.

### 3. 🚀 Direct Game Protocol Links & Connect Launcher
- Deep-linking URI schemes: `steam://connect/IP:PORT`, `fivem://connect/...`, `riotgames://...`, `battlenet://...`, `minecraft://...`.
- 1-Click **"LAUNCH GAME CLIENT & JOIN SERVER"** button.
- Copyable server IP/Port and in-game console connect commands (`connect 144.76.12.89:27015; password ...`).

### 4. 🗄️ Game Database Cluster & Server Fleet Telemetry
- Real-time simulated **PostgreSQL (Match Telemetry)**, **Redis (In-Memory Matchmaker)**, and **MongoDB (Blob Profile Store)**.
- Live SQL / Redis telemetry terminal streaming read/write operations in real time.
- Interactive SQL Query Runner (`SELECT * FROM players`, `SHOW SERVERS`, `SELECT * FROM lobbies`).

### 5. 🖥️ Desktop Program Suite Feel
- Desktop window titlebar with Minimize, Maximize/Fullscreen, and Close controls.
- Bottom system telemetry bar showing live server fleet status (14 nodes online, latency ping, memory utilization).
- Global keyboard shortcuts (`Ctrl+Q` Queue, `Ctrl+L` Lobbies, `Ctrl+D` Database, `Ctrl+S` Streams, `Ctrl+M` Audio).

### 6. ⚡ The 5-Second Publicity Vote Gatekeeper
- Live webcam/mic 5-second video intro recording studio with countdown ring.
- Real-time squad member review arena with 5-second countdown timer and **LET IN** vs **DENY** voting.

---

## 🛠️ How to Run

1. Open [`customlobbies/index.html`](file:///c:/Users/Sean/Documents/Downloads/HelixGame/customlobbies/index.html) in your web browser.
2. Or run a local server:
   ```bash
   cd customlobbies
   npx serve -l 3000 .
   ```
3. Visit `http://localhost:3000`.
