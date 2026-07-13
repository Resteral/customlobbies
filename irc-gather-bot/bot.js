const net = require('net');
const fs = require('fs');
const path = require('path');

// Load Configuration
let config;
const configPath = path.join(__dirname, 'config.json');

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configFile);
} catch (err) {
  console.error('Error loading config.json. Using defaults.', err);
  config = {
    server: 'irc.libera.chat',
    port: 6667,
    nick: 'GatherBot',
    user: 'gatherbot',
    realname: 'Gather Queue Bot',
    channel: '#cs-gather-test',
    queueLimit: 8,
    reconnectInterval: 5000
  };
}

console.log(`Starting Gather Bot with configuration:`);
console.log(`- Server: ${config.server}:${config.port}`);
console.log(`- Nick: ${config.nick}`);
console.log(`- Channel: ${config.channel}`);
console.log(`- Queue Limit: ${config.queueLimit}`);

// Queue State
let queue = [];
let client = null;
let reconnectTimeout = null;
let readBuffer = '';

function connect() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  console.log(`Connecting to ${config.server}:${config.port}...`);
  client = net.createConnection(config.port, config.server);

  client.setEncoding('utf8');

  client.on('connect', () => {
    console.log('TCP Connection established. Registering with IRC server...');
    send(`NICK ${config.nick}`);
    send(`USER ${config.user} 0 * :${config.realname}`);
  });

  client.on('data', (data) => {
    readBuffer += data;
    const lines = readBuffer.split(/\r?\n/);
    // Keep the last partial line in the buffer
    readBuffer = lines.pop();

    for (const line of lines) {
      if (line.trim()) {
        handleLine(line);
      }
    }
  });

  client.on('close', (hadError) => {
    console.log(`Connection closed (hadError: ${hadError}). Reconnecting in ${config.reconnectInterval}ms...`);
    scheduleReconnect();
  });

  client.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
}

function scheduleReconnect() {
  if (!reconnectTimeout) {
    reconnectTimeout = setTimeout(connect, config.reconnectInterval);
  }
}

function send(rawText) {
  if (client && !client.destroyed) {
    client.write(rawText + '\r\n');
  }
}

function sendMessage(target, message) {
  send(`PRIVMSG ${target} :${message}`);
  console.log(`Sent to ${target}: ${message}`);
}

function handleLine(line) {
  // Log raw messages from the server for debugging
  console.log(`<< ${line}`);

  // 1. Keep-Alive Ping/Pong
  if (line.startsWith('PING')) {
    const serverId = line.substring(4).trim();
    send(`PONG ${serverId}`);
    return;
  }

  // 2. Welcome code (001) is received, meaning we are fully registered
  // Now we can join the channel.
  // IRC server messages are usually: :servername 001 nick :Welcome message
  const words = line.split(' ');
  if (words[1] === '001') {
    console.log(`Successfully registered. Joining channel ${config.channel}...`);
    send(`JOIN ${config.channel}`);
    return;
  }

  // 3. Process PRIVMSG (Channel or Direct Messages)
  // Format: :Nick!User@Host PRIVMSG Target :Message text
  const match = line.match(/^:([^!]+)![^@]+@[^\s]+\s+PRIVMSG\s+([^\s]+)\s+:(.*)$/i);
  if (match) {
    const senderNick = match[1];
    const target = match[2];
    const message = match[3].trim();

    // Check if the message is in our target channel
    // In IRC, if the target starts with '#', it's a channel message.
    if (target.toLowerCase() === config.channel.toLowerCase()) {
      handleChannelCommand(senderNick, message);
    }
  }
}

function handleChannelCommand(nick, message) {
  const normalizedMsg = message.toLowerCase();

  // Match commands: -j, !j, .j
  if (normalizedMsg === '-j' || normalizedMsg === '!j' || normalizedMsg === '.j') {
    if (queue.includes(nick)) {
      sendMessage(config.channel, `${nick}: You are already in the queue! [${queue.length}/${config.queueLimit}]`);
    } else {
      queue.push(nick);
      sendMessage(config.channel, `${nick} joined the queue. [${queue.length}/${config.queueLimit}]`);

      // Check if queue is full
      if (queue.length >= config.queueLimit) {
        const playerList = queue.join(', ');
        sendMessage(config.channel, `Lobby is FULL! Players: ${playerList}.`);
        sendMessage(config.channel, `Queue is resetting...`);
        queue = []; // Reset queue
      }
    }
    return;
  }

  // Match commands: -l, !l, .l
  if (normalizedMsg === '-l' || normalizedMsg === '!l' || normalizedMsg === '.l') {
    const index = queue.indexOf(nick);
    if (index !== -1) {
      queue.splice(index, 1);
      sendMessage(config.channel, `${nick} left the queue. [${queue.length}/${config.queueLimit}]`);
    } else {
      sendMessage(config.channel, `${nick}: You are not in the queue! [${queue.length}/${config.queueLimit}]`);
    }
    return;
  }

  // Match commands: -s, !s, -status, .status, !status
  if (
    normalizedMsg === '-s' ||
    normalizedMsg === '!s' ||
    normalizedMsg === '.s' ||
    normalizedMsg === '-status' ||
    normalizedMsg === '!status' ||
    normalizedMsg === '.status'
  ) {
    if (queue.length === 0) {
      sendMessage(config.channel, `The queue is currently empty. [0/${config.queueLimit}]`);
    } else {
      const playerList = queue.join(', ');
      sendMessage(config.channel, `Queue [${queue.length}/${config.queueLimit}]: ${playerList}`);
    }
    return;
  }

  // Match command: -clear, !clear, .clear (Admin command to clear queue)
  if (normalizedMsg === '-clear' || normalizedMsg === '!clear' || normalizedMsg === '.clear') {
    queue = [];
    sendMessage(config.channel, `Queue has been cleared by ${nick}. [0/${config.queueLimit}]`);
    return;
  }
}

// Start connection
connect();
