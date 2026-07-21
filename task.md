# Custom Lobbies Upgrade Tasks

- `[x]` Step 1: Update bot database, commands, and player drafting in `bot.js`
- `[x]` Step 2: Sync client-side simulator command parser in `app.js`
- `[x]` Step 3: Support automatic game-specific channel creation (`#draft-[game]` text channel, temporary team voice channels)
- `[x]` Step 4: Implement multi-game ELO databases (`arkheron`, `zealot`, `hockey`) with separate ratings & history
- `[x]` Step 5: Add game toggles to the simulated Rankings Leaderboard in `index.html`
- `[x]` Step 6: Verify background Discord bot starts up successfully with all new handlers
- `[x]` Step 7: Enforce channel-locked command execution (commands only process for the game name contained in the text channel title)
- `[x]` Step 8: Build game-specific matchmaking queues (`queues[game]`)
- `[x]` Step 9: Upgrade `-lobby` command to support player & MMR list lookups for active codes
- `[x]` Step 10: Implement `-leaderboards` plural alias for bot rankings
- `[x]` Step 11: Add teammate tracking and implement `-best` and `-worst` commands to check teammate records
- `[x]` Step 12: Add winstreak and losing streak tracking and implement `-peak` and `-lowest` commands to check streaks
- `[x]` Step 13: Implement explicit registration `-register [ingame-name]`, player card details `-profile`, customizable bios `-setbio`, and custom avatars `-setavatar`
- `[x]` Step 14: Embed the beautiful logo banner asset directly into the web simulator layout header
- `[x]` Step 15: Implement stats lookup for external games (`-valorant`, `-cod` / `-callofduty`, `-omegastrikers` / `-os`) and Steam (`-steam`) profiles
- `[x]` Step 16: Add custom profile hex color picker code customization (`-setcolor [hex-code]`) to style player profiles
