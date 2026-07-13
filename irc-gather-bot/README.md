# IRC Gather Bot

A lightweight, zero-dependency Node.js bot that manages a player queue/lobby for gather games (mixes) on IRC.

## Features
- **Zero External Dependencies**: Built entirely using Node.js core libraries (`net`, `fs`, `path`). No `npm install` required!
- **Automatic Reconnection**: Automatically tries to reconnect to the IRC server if disconnected.
- **PING/PONG Keep-Alive**: Automatically responds to server PING commands to keep the connection alive.
- **Commands**:
  - `-j` / `!j` / `.j` - Join the queue.
  - `-l` / `!l` / `.l` - Leave the queue.
  - `-s` / `!s` / `-status` - View current players in the queue.
  - `-clear` / `!clear` - Clear the queue.
- **Auto-Reset**: Once the queue reaches 8 players, it announces the full list of players and automatically resets.

## Installation & Configuration

1. Install [Node.js](https://nodejs.org/) (if not already installed).
2. Configure connection settings in `config.json`:
   ```json
   {
     "server": "irc.libera.chat",
     "port": 6667,
     "nick": "GatherBot",
     "user": "gatherbot",
     "realname": "Gather Queue Bot",
     "channel": "#cs-gather-test",
     "queueLimit": 8,
     "reconnectInterval": 5000
   }
   ```

## Running the Bot

Run the bot from the command line using:
```bash
node bot.js
```
