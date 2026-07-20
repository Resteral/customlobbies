# Arkheron Lobby & Stats Discord Bot

This folder contains a deployable Discord bot for competitive Arkheron matchmaking, player ELO tracking, character serpentine drafts, and gear relic set lookups.

## Requirements
- **Node.js** (v16.11.0 or higher is recommended)
- A **Discord Bot Token** (Registered in Discord Developer Portal)

## Setup
1. Open a command terminal in this directory and install dependencies:
   ```bash
   npm install
   ```
2. Edit `.env` and paste your token in place of `YOUR_DISCORD_BOT_TOKEN`.
3. Open the Discord Developer Portal, navigate to your Bot, and verify the bot has **Message Content Intent** enabled under the Privileged Gateway Intents list.
4. Run the bot server:
   ```bash
   npm start
   ```

## Command Protocols (Prefixed with -, !, or /)
- `-j` / `-join [code]` - Join general queue or custom lobby room.
- `-l` / `-leave [code]` - Exit queue or lobby room.
- `-lobby [size]` - Create custom lobby for 3 (solo), 6 (scrim), or 9 (royale) players, generating code.
- `-lobbies` - List active custom lobbies.
- `-draft` - Start serpentine draft (captains pick Eternals; needs 6 players in queue).
- `-pick [index/name]` - Select an Eternal from the draft pool (captains turn).
- `-stats [player]` - View ELO, Wins, K/D, Avg Floor, and builds.
- `-compare [player]` - Compare ELO and expected win odds.
- `-elochart [player]` - Generate ELO trend charts.
- `-build [eternal]` - Lookup relic sets and ability details.
- `-eternals` - List all available characters.
- `-relics` - List relic set bonuses.
