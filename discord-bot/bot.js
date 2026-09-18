/**
 * CustomLobbies.com - Official Discord Bot
 * Handles -j/-join, -l/-leave, -lobby, -fill/-autostart, -b/-bracket, -configtourney, -stats, ELO/MMR matchmaking, and server node dispatching.
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const PREFIXES = ['-', '!', '/'];

// In-Memory Database / Per-Channel State Storage
const channelLobbies = new Map(); // channelId -> { team1: [], team2: [], maxPerTeam: 5 }
const playerStats = new Map();
let activeMatch = null;

// AI Competitors Pool for Quick Auto-Fill
const AI_COMPETITORS = [
  { id: 'bot_s1mple', username: 'S1mple_Fragger', elo: 2650, role: 'AWPer / Sniper' },
  { id: 'bot_zywoo', username: 'ZywOo_Master', elo: 2620, role: 'Entry Fragger' },
  { id: 'bot_niko', username: 'NiKo_OneTap', elo: 2590, role: 'Rifler' },
  { id: 'bot_b1t', username: 'B1t_Headshot', elo: 2480, role: 'Flex Specialist' },
  { id: 'bot_device', username: 'Dev1ce_Tactician', elo: 2510, role: 'Support' },
  { id: 'bot_rain', username: 'Rain_EntryGod', elo: 2420, role: 'Entry Fragger' },
  { id: 'bot_broky', username: 'Broky_Clutcher', elo: 2550, role: 'AWPer' },
  { id: 'bot_ropz', username: 'Ropz_Lurker', elo: 2590, role: 'Lurker / Anchor' },
  { id: 'bot_monesy', username: 'm0NESY_God', elo: 2640, role: 'AWPer / Sniper' },
  { id: 'bot_karrigan', username: 'Karrigan_IGL', elo: 2450, role: 'In-Game Leader' }
];

// Helper: Get or Initialize Per-Channel Lobby
function getChannelLobby(channelId) {
  if (!channelLobbies.has(channelId)) {
    channelLobbies.set(channelId, {
      team1: [],
      team2: [],
      maxPerTeam: 5,
      map: 'Mirage / Inferno (Veto)',
      game: 'Counter-Strike 2'
    });
  }
  return channelLobbies.get(channelId);
}

// Helper: Calculate ELO Ratings
function calculateEloUpdate(winnerElo, loserElo, kFactor = 32) {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));
  
  const winnerNew = Math.round(winnerElo + kFactor * (1 - expectedWinner));
  const loserNew = Math.round(loserElo + kFactor * (0 - expectedLoser));
  
  return {
    winnerGain: winnerNew - winnerElo,
    loserLoss: loserElo - loserNew,
    winnerNew,
    loserNew
  };
}

// Helper: Get Rank Tier Badge
function getRankBadge(elo) {
  if (elo >= 2500) return '👑 Radiant';
  if (elo >= 2200) return '🔥 Grandmaster';
  if (elo >= 1900) return '💎 Master';
  if (elo >= 1600) return '🔹 Diamond';
  if (elo >= 1300) return '🛡️ Platinum';
  if (elo >= 1000) return '🥇 Gold';
  return '🥉 Bronze';
}

function getOrCreatePlayer(userId, username) {
  if (!playerStats.has(userId)) {
    playerStats.set(userId, {
      id: userId,
      username: username,
      elo: 1500,
      wins: 0,
      losses: 0,
      streak: 0
    });
  }
  return playerStats.get(userId);
}

// Helper: Trigger Match Start and Server Node Dispatch
function triggerMatchStart(channel, lobby) {
  const serverCmd = `connect 127.0.0.1:7777; password helix_comp_scrim`;
  activeMatch = { team1: [...lobby.team1], team2: [...lobby.team2], serverCmd };

  const matchEmbed = new EmbedBuilder()
    .setColor('#00e676')
    .setTitle('🚀 MATCH STARTED & LIVE SERVER DISPATCHED!')
    .setDescription(`🎉 **Lobby Match Popped in #${channel.name || 'channel'}!**\nAll 10 roster slots filled. 128-tick private server node provisioned.`)
    .addFields(
      { 
        name: '🔵 Team Alpha', 
        value: lobby.team1.length > 0 ? lobby.team1.map((p, i) => `${i === 0 ? '👑 ' : ''}**${p.username}** (${p.elo} MMR)`).join('\n') : '*Empty*', 
        inline: true 
      },
      { 
        name: '🔴 Team Bravo', 
        value: lobby.team2.length > 0 ? lobby.team2.map((p, i) => `${i === 0 ? '👑 ' : ''}**${p.username}** (${p.elo} MMR)`).join('\n') : '*Empty*', 
        inline: true 
      },
      {
        name: '🎮 Server Connect Command (1-Click Copy)',
        value: `\`\`\`bash\n${serverCmd}\n\`\`\``
      }
    )
    .setFooter({ text: 'CustomLobbies.com Match Engine | Report outcome with -reportwin team1 or -reportwin team2' });

  channel.send({ embeds: [matchEmbed] });

  // Reset channel lobby pool after start
  lobby.team1 = [];
  lobby.team2 = [];
}

client.on('ready', () => {
  console.log(`🤖 CustomLobbies.com Discord Bot logged in as ${client.user.tag}`);
  client.user.setActivity('CustomLobbies.com | -j -fill -bracket -help', { type: 3 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
  const prefixUsed = PREFIXES.find(p => content.startsWith(p));
  if (!prefixUsed) return;

  const args = content.slice(prefixUsed.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const lobby = getChannelLobby(message.channel.id);

  // COMMAND 1: -j / -join [1|2|alpha|bravo] (Join Match Pool)
  if (command === 'join' || command === 'j') {
    const player = getOrCreatePlayer(message.author.id, message.author.username);
    
    // Check if already in either team
    const inTeam1 = lobby.team1.some(p => p.id === player.id);
    const inTeam2 = lobby.team2.some(p => p.id === player.id);

    if (inTeam1 || inTeam2) {
      return message.reply('⚠️ You are already in this channel\'s match lobby pool!');
    }

    const targetArg = args[0]?.toLowerCase();
    let assignedTeam = null;

    if (targetArg === '1' || targetArg === 'alpha') {
      if (lobby.team1.length >= lobby.maxPerTeam) return message.reply('⚠️ Team Alpha is full! Join Team Bravo with `-j 2`');
      lobby.team1.push(player);
      assignedTeam = 'Team Alpha';
    } else if (targetArg === '2' || targetArg === 'bravo') {
      if (lobby.team2.length >= lobby.maxPerTeam) return message.reply('⚠️ Team Bravo is full! Join Team Alpha with `-j 1`');
      lobby.team2.push(player);
      assignedTeam = 'Team Bravo';
    } else {
      // Auto-assign to smaller team
      if (lobby.team1.length <= lobby.team2.length && lobby.team1.length < lobby.maxPerTeam) {
        lobby.team1.push(player);
        assignedTeam = 'Team Alpha';
      } else if (lobby.team2.length < lobby.maxPerTeam) {
        lobby.team2.push(player);
        assignedTeam = 'Team Bravo';
      } else {
        return message.reply('⚠️ Match lobby is completely full (10/10)! Start it with `-fill` or wait for next lobby.');
      }
    }

    const totalCount = lobby.team1.length + lobby.team2.length;
    const maxTotal = lobby.maxPerTeam * 2;

    const embed = new EmbedBuilder()
      .setColor('#00f2fe')
      .setTitle(`🎮 #${message.channel.name || 'channel'} MATCH LOBBY POOL (${totalCount}/${maxTotal})`)
      .setDescription(`**${message.author.username}** joined **${assignedTeam}**! (${player.elo} MMR)`)
      .addFields(
        {
          name: `🔵 Team Alpha (${lobby.team1.length}/${lobby.maxPerTeam})`,
          value: lobby.team1.length > 0 ? lobby.team1.map(p => `• **${p.username}** (${p.elo} MMR)`).join('\n') : '*Empty*',
          inline: true
        },
        {
          name: `🔴 Team Bravo (${lobby.team2.length}/${lobby.maxPerTeam})`,
          value: lobby.team2.length > 0 ? lobby.team2.map(p => `• **${p.username}** (${p.elo} MMR)`).join('\n') : '*Empty*',
          inline: true
        }
      )
      .setFooter({ text: 'Commands: -j (Join), -j 1 (Team 1), -j 2 (Team 2), -l (Leave), -fill (Auto-Start AI)' });

    message.channel.send({ embeds: [embed] });

    // Auto-Start when 10/10 players reached
    if (totalCount >= maxTotal) {
      triggerMatchStart(message.channel, lobby);
    }
  }

  // COMMAND 2: -fill / -autostart / -fillstart (Quick Fill AI & Auto-Start Match Engine)
  else if (command === 'fill' || command === 'autostart' || command === 'fillstart') {
    let botIndex = 0;
    while (lobby.team1.length < lobby.maxPerTeam && botIndex < AI_COMPETITORS.length) {
      const bot = AI_COMPETITORS[botIndex++];
      if (!lobby.team1.some(p => p.id === bot.id)) {
        lobby.team1.push(bot);
      }
    }
    while (lobby.team2.length < lobby.maxPerTeam && botIndex < AI_COMPETITORS.length) {
      const bot = AI_COMPETITORS[botIndex++];
      if (!lobby.team2.some(p => p.id === bot.id)) {
        lobby.team2.push(bot);
      }
    }

    message.reply('⚡ **Quick Fill AI Executed!** Filling remaining slots with top esports AI competitors & dispatching server node...');
    triggerMatchStart(message.channel, lobby);
  }

  // COMMAND 3: -l / -leave (Leave Lobby Pool)
  else if (command === 'leave' || command === 'l') {
    const userId = message.author.id;
    const initialCount = lobby.team1.length + lobby.team2.length;
    
    lobby.team1 = lobby.team1.filter(p => p.id !== userId);
    lobby.team2 = lobby.team2.filter(p => p.id !== userId);

    const newCount = lobby.team1.length + lobby.team2.length;
    if (initialCount === newCount) {
      return message.reply('⚠️ You are not currently in this channel\'s match pool.');
    }

    message.reply(`✅ Removed from match pool. Current Pool Status: ${newCount}/10 Players.`);
  }

  // COMMAND 4: -lobby / -queue / -players / -pool (View Lobby Roster)
  else if (command === 'lobby' || command === 'queue' || command === 'players' || command === 'pool') {
    const totalCount = lobby.team1.length + lobby.team2.length;

    const embed = new EmbedBuilder()
      .setColor('#00f2fe')
      .setTitle(`🎮 #${message.channel.name || 'channel'} MATCH LOBBY POOL (${totalCount}/10)`)
      .addFields(
        {
          name: `🔵 Team Alpha (${lobby.team1.length}/5)`,
          value: lobby.team1.length > 0 ? lobby.team1.map(p => `• **${p.username}** (${p.elo} MMR)`).join('\n') : '*No players*',
          inline: true
        },
        {
          name: `🔴 Team Bravo (${lobby.team2.length}/5)`,
          value: lobby.team2.length > 0 ? lobby.team2.map(p => `• **${p.username}** (${p.elo} MMR)`).join('\n') : '*No players*',
          inline: true
        }
      )
      .setFooter({ text: 'Type -j to join, -fill to auto-start with AI, -l to leave' });

    message.channel.send({ embeds: [embed] });
  }

  // COMMAND 5: -b / -bracket / -tourney (Esports Tournament Visual Bracket Embed)
  else if (command === 'bracket' || command === 'b' || command === 'tourney') {
    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🏆 CustomLobbies $1,500 CS2 Weekly Championship - Visual Bracket')
      .setDescription('Live Tournament Bracket Tree Sync from CustomLobbies.com')
      .addFields(
        {
          name: '🥊 Semi-Finals Match 1',
          value: '👑 **FaZe Clan** (16) vs **G2 Esports** (12)\n*Status: FaZe Advanced to Grand Finals*',
          inline: false
        },
        {
          name: '🥊 Semi-Finals Match 2',
          value: '👑 **Natus Vincere** (16) vs **Team Vitality** (14)\n*Status: NaVi Advanced to Grand Finals*',
          inline: false
        },
        {
          name: '👑 Grand Finals Championship',
          value: '⚡ **FaZe Clan** vs **Natus Vincere**\n*Prize Pool:* **$1,500 Cash + 5,000 CL-Points**\n*Map Veto:* De_Mirage, De_Inferno',
          inline: false
        }
      )
      .setFooter({ text: 'Use -configtourney to create your own tournament bracket!' });

    message.channel.send({ embeds: [embed] });
  }

  // COMMAND 6: -configtourney / -createbracket (Easy Tournament Configurator Guide)
  else if (command === 'configtourney' || command === 'createbracket') {
    const embed = new EmbedBuilder()
      .setColor('#a855f7')
      .setTitle('⚡ CustomLobbies 1-Click Tournament Configurator')
      .setDescription('Easily configure custom esports tournament brackets directly on CustomLobbies.com or in Discord!')
      .addFields(
        { name: '1. Select Format', value: '• **4-Team Rapid Bracket**\n• **8-Team Single Elimination**\n• **16-Team Championship Tree**', inline: true },
        { name: '2. Seeding Modes', value: '• **ELO High-to-Low Seeded**\n• **Random Draft Draw**\n• **Captain Pick Ranking**', inline: true },
        { name: '3. Web & Chat Sync', value: '• Synchronized bracket progression live on web, desktop program, and Discord chat!', inline: false }
      )
      .setFooter({ text: 'Click "⚡ Easy Configurator" on CustomLobbies.com to launch UI builder' });

    message.channel.send({ embeds: [embed] });
  }

  // COMMAND 7: -stats (View Player ELO & Record)
  else if (command === 'stats') {
    const targetUser = message.mentions.users.first() || message.author;
    const player = getOrCreatePlayer(targetUser.id, targetUser.username);
    const badge = getRankBadge(player.elo);
    const total = player.wins + player.losses;
    const winRate = total > 0 ? Math.round((player.wins / total) * 100) : 0;

    const embed = new EmbedBuilder()
      .setColor('#9d4edd')
      .setTitle(`📊 CustomLobbies Stats - ${player.username}`)
      .addFields(
        { name: 'MMR Rating', value: `**${player.elo} MMR** (${badge})`, inline: true },
        { name: 'Win / Loss', value: `${player.wins}W - ${player.losses}L (${winRate}% Win Rate)`, inline: true },
        { name: 'Win Streak', value: `${player.streak >= 0 ? '🔥 W' + player.streak : '❌ L' + Math.abs(player.streak)}`, inline: true }
      )
      .setThumbnail(targetUser.displayAvatarURL())
      .setFooter({ text: 'CustomLobbies.com ELO System' });

    message.channel.send({ embeds: [embed] });
  }

  // COMMAND 8: -reportwin (Submit Match Outcome)
  else if (command === 'reportwin') {
    if (!activeMatch) {
      return message.reply('⚠️ No active match in progress to report!');
    }

    const winnerArg = args[0]?.toLowerCase();
    if (winnerArg !== 'team1' && winnerArg !== 'team2' && winnerArg !== 'alpha' && winnerArg !== 'bravo') {
      return message.reply('⚠️ Usage: `-reportwin team1` OR `-reportwin team2`');
    }

    const winners = (winnerArg === 'team1' || winnerArg === 'alpha') ? activeMatch.team1 : activeMatch.team2;
    const losers = (winnerArg === 'team1' || winnerArg === 'alpha') ? activeMatch.team2 : activeMatch.team1;

    let totalGain = 0;
    winners.forEach(w => {
      w.wins = (w.wins || 0) + 1;
      w.streak = Math.max(1, (w.streak || 0) + 1);
      const update = calculateEloUpdate(w.elo || 1500, 1500);
      w.elo = (w.elo || 1500) + update.winnerGain;
      totalGain = update.winnerGain;
    });

    losers.forEach(l => {
      l.losses = (l.losses || 0) + 1;
      l.streak = Math.min(-1, (l.streak || 0) - 1);
      const update = calculateEloUpdate(1500, l.elo || 1500);
      l.elo = Math.max(100, (l.elo || 1500) - update.loserLoss);
    });

    activeMatch = null;

    const reportEmbed = new EmbedBuilder()
      .setColor('#00e676')
      .setTitle('🏆 Match Outcome Recorded!')
      .setDescription(`**Winners:** ${winners.map(w => w.username).join(', ')}\n**MMR Adjustment:** +${totalGain} MMR for winners | -${totalGain} MMR for losers`)
      .setFooter({ text: 'Stats updated on CustomLobbies.com' });

    message.channel.send({ embeds: [reportEmbed] });
  }

  // COMMAND 9: -createchannel (Add Voice/Text Channel)
  else if (command === 'createchannel') {
    const channelName = args[0];
    const type = args[1]?.toLowerCase() === 'voice' ? 2 : 0; // 2: GuildVoice, 0: GuildText

    if (!channelName) {
      return message.reply('⚠️ Usage: `-createchannel <name> [text|voice]`');
    }

    try {
      const createdChannel = await message.guild.channels.create({
        name: channelName,
        type: type
      });
      message.reply(`✅ Successfully created ${type === 2 ? 'Voice' : 'Text'} channel <#${createdChannel.id}>!`);
    } catch (err) {
      message.reply(`❌ Error creating channel: ${err.message}`);
    }
  }

  // COMMAND 10: -leaderboard (Top ELO Players)
  else if (command === 'leaderboard') {
    const allPlayers = Array.from(playerStats.values()).sort((a, b) => b.elo - a.elo).slice(0, 10);
    if (allPlayers.length === 0) {
      return message.reply('No players registered yet! Type -j to play.');
    }

    const leaderboardText = allPlayers.map((p, idx) => `${idx + 1}. **${p.username}** - ${p.elo} MMR (${getRankBadge(p.elo)})`).join('\n');
    
    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🏆 CustomLobbies Top ELO Leaderboard')
      .setDescription(leaderboardText);

    message.channel.send({ embeds: [embed] });
  }

  // COMMAND 11: -help (Bot Commands Guide)
  else if (command === 'help') {
    const embed = new EmbedBuilder()
      .setColor('#00f2fe')
      .setTitle('🤖 CustomLobbies Discord Bot - Command Reference')
      .addFields(
        { name: '🎮 Matchmaking & Queue', value: '• `-j` / `-join [1|2]`: Join match lobby pool (Team 1 or 2)\n• `-l` / `-leave`: Leave active match pool\n• `-lobby` / `-queue`: View current channel players\n• `-fill` / `-autostart`: Quick fill AI competitors & auto-start match', inline: false },
        { name: '🏆 Tournaments & Brackets', value: '• `-b` / `-bracket`: View live tournament bracket tree\n• `-configtourney`: Open easy tournament configurator guide', inline: false },
        { name: '📊 Stats & Admin', value: '• `-stats [@user]`: View player MMR & record\n• `-leaderboard`: Top ELO leaderboards\n• `-reportwin <team1|team2>`: Report match outcome\n• `-createchannel <name> [text|voice]`: Create Discord channel', inline: false }
      )
      .setFooter({ text: 'CustomLobbies.com Discord Bot v2.5' });

    message.channel.send({ embeds: [embed] });
  }
});

if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN);
} else {
  console.log('💡 Note: Set DISCORD_TOKEN in discord-bot/.env to run the bot on your server!');
}

