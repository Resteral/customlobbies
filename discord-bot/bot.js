/**
 * CustomLobbies.com - Official Discord Bot
 * Handles -join, -leave, -stats, ELO/MMR matchmaking, channel creation, and match reporting
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

// In-Memory Database / State Storage (Can sync to CustomLobbies REST API)
const queuePool = new Set();
const playerStats = new Map();
let activeMatch = null;

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

client.on('ready', () => {
  console.log(`🤖 CustomLobbies.com Discord Bot logged in as ${client.user.tag}`);
  client.user.setActivity('CustomLobbies.com | -join -stats', { type: 3 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
  const prefixUsed = PREFIXES.find(p => content.startsWith(p));
  if (!prefixUsed) return;

  const args = content.slice(prefixUsed.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // COMMAND 1: -j / -join (Join Queue & Team Pool)
  if (command === 'join' || command === 'j') {
    const player = getOrCreatePlayer(message.author.id, message.author.username);
    if (queuePool.has(message.author.id)) {
      return message.reply('⚠️ You are already in the matchmaking lobby queue!');
    }

    queuePool.add(message.author.id);
    const playersList = Array.from(queuePool).map(id => playerStats.get(id));

    const embed = new EmbedBuilder()
      .setColor('#00f2fe')
      .setTitle('⚡ CustomLobbies Matchmaking Queue & Team Pool')
      .setDescription(`**${message.author.username}** joined the lobby queue! (${player.elo} MMR)\n\n**Lobby Status:** ${queuePool.size} / 10 Players Joined`)
      .addFields({
        name: '👥 Queued Players in Lobby',
        value: playersList.map((p, i) => `${i + 1}. **${p.username}** (${p.elo} MMR - ${getRankBadge(p.elo)})`).join('\n')
      })
      .setFooter({ text: 'Type -j to join, -l to leave, -lobby to view players in queue' });

    message.channel.send({ embeds: [embed] });

    // Auto-pop match when 10 players join
    if (queuePool.size >= 10) {
      queuePool.clear();

      // Split into Team 1 and Team 2
      const team1 = playersList.slice(0, 5);
      const team2 = playersList.slice(5, 10);
      
      activeMatch = { team1, team2 };

      const matchEmbed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('🎉 LOBBY MATCH POPPED! (5v5 Balanced Server Node)')
        .addFields(
          { name: '🔵 Team Alpha', value: team1.map(p => `• **${p.username}** (${p.elo} MMR)`).join('\n'), inline: true },
          { name: '🔴 Team Bravo', value: team2.map(p => `• **${p.username}** (${p.elo} MMR)`).join('\n'), inline: true }
        )
        .addFields({
          name: '🚀 Dedicated Server Connect Command',
          value: '`connect 144.76.12.89:27015; password scrim33`'
        })
        .setFooter({ text: 'Report outcome using -reportwin team1 OR -reportwin team2' });

      message.channel.send({ embeds: [matchEmbed] });
    }
  }

  // COMMAND 2: -l / -leave (Leave Queue)
  else if (command === 'leave' || command === 'l') {
    if (!queuePool.has(message.author.id)) {
      return message.reply('⚠️ You are not currently in the lobby queue.');
    }

    queuePool.delete(message.author.id);
    message.reply(`✅ Removed from lobby queue. Lobby Queue Status: ${queuePool.size} / 10 Players.`);
  }

  // COMMAND 3: -lobby / -queue / -players / -pool (View Players in Lobby Queue)
  else if (command === 'lobby' || command === 'queue' || command === 'players' || command === 'pool') {
    if (queuePool.size === 0) {
      const embed = new EmbedBuilder()
        .setColor('#9d4edd')
        .setTitle('🎮 CustomLobbies Active Queue')
        .setDescription('No players currently queued in the lobby. Type **-j** or **-join** to join!');
      return message.channel.send({ embeds: [embed] });
    }

    const playersList = Array.from(queuePool).map(id => playerStats.get(id));
    const playersText = playersList.map((p, i) => `${i + 1}. **${p.username}** - ${p.elo} MMR (${getRankBadge(p.elo)})`).join('\n');

    const embed = new EmbedBuilder()
      .setColor('#00f2fe')
      .setTitle(`🎮 CustomLobbies Active Queue Pool (${queuePool.size} / 10 Players)`)
      .setDescription(playersText)
      .setFooter({ text: 'Type -j to join, -l to leave, -lobby to view players' });

    message.channel.send({ embeds: [embed] });
  }

  // COMMAND 3: -stats (View Player ELO & Record)
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

  // COMMAND 4: -reportwin (Submit Match Outcome)
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
      w.wins++;
      w.streak = Math.max(1, w.streak + 1);
      const update = calculateEloUpdate(w.elo, 1500);
      w.elo += update.winnerGain;
      totalGain = update.winnerGain;
    });

    losers.forEach(l => {
      l.losses++;
      l.streak = Math.min(-1, l.streak - 1);
      const update = calculateEloUpdate(1500, l.elo);
      l.elo = Math.max(100, l.elo - update.loserLoss);
    });

    activeMatch = null;

    const reportEmbed = new EmbedBuilder()
      .setColor('#00e676')
      .setTitle('🏆 Match Outcome Recorded!')
      .setDescription(`**Winners:** ${winners.map(w => w.username).join(', ')}\n**MMR Adjustment:** +${totalGain} MMR for winners | -${totalGain} MMR for losers`)
      .setFooter({ text: 'Stats updated on CustomLobbies.com' });

    message.channel.send({ embeds: [reportEmbed] });
  }

  // COMMAND 5: -createchannel (Add Discord Voice/Text Channel)
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

  // COMMAND 6: -leaderboard
  else if (command === 'leaderboard') {
    const allPlayers = Array.from(playerStats.values()).sort((a, b) => b.elo - a.elo).slice(0, 10);
    if (allPlayers.length === 0) {
      return message.reply('No players registered yet! Type -join to play.');
    }

    const leaderboardText = allPlayers.map((p, idx) => `${idx + 1}. **${p.username}** - ${p.elo} MMR (${getRankBadge(p.elo)})`).join('\n');
    
    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🏆 CustomLobbies Top ELO Leaderboard')
      .setDescription(leaderboardText);

    message.channel.send({ embeds: [embed] });
  }
});

if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN);
} else {
  console.log('💡 Note: Set DISCORD_TOKEN in discord-bot/.env to run the bot on your server!');
}
