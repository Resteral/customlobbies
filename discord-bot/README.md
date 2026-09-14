# CustomLobbies.com Discord Bot

An official Discord bot for CustomLobbies.com enabling players to join matchmaking queues, track ELO MMR stats, auto-balance 5v5 scrim teams, report match outcomes, and create voice/text channels.

## Commands

| Command | Description |
|---|---|
| `-join` / `!join` / `/join` | Join the active matchmaking queue. Auto-creates balanced teams at 10 players. |
| `-leave` / `!leave` / `/leave` | Leave the matchmaking queue. |
| `-stats [user]` | Display detailed ELO, rank badge, win-rate, and streak. |
| `-reportwin <team1\|team2>` | Record match winner, calculate ELO rating adjustments, and update leaderboards. |
| `-createchannel <name> <text\|voice>` | Create new Discord channels directly from the bot. |
| `-leaderboard` | Show top ELO players on the server. |

## Quick Setup Instructions

1. Install Node.js (v18+ recommended).
2. Open terminal in the `discord-bot` directory and run:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `discord-bot/`:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   ```
4. Run the bot:
   ```bash
   npm start
   ```
