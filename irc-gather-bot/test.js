const EventEmitter = require('events');
const net = require('net');
const fs = require('fs');
const path = require('path');

// Load config to dynamically use the configured channel in tests
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
} catch (e) {
  config = { channel: '#cs-gather-test' };
}
const CHANNEL = config.channel;

// Mock Socket class
class MockSocket extends EventEmitter {
  constructor() {
    super();
    this.sentData = [];
    this.destroyed = false;
  }

  setEncoding(encoding) {
    this.encoding = encoding;
  }

  write(data) {
    this.sentData.push(data);
  }

  destroy() {
    this.destroyed = true;
    this.emit('close', false);
  }
}

let mockSocketInstance = null;

// Mock net.createConnection
net.createConnection = function (port, server) {
  console.log(`[TEST MOCK] Intercepted net.createConnection to ${server}:${port}`);
  mockSocketInstance = new MockSocket();
  return mockSocketInstance;
};

// Now require the bot
// It will execute using our mock net.createConnection
require('./bot.js');

// Run tests
function runTests() {
  const assertions = [];
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      process.exit(1);
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  }

  assert(mockSocketInstance !== null, 'Socket connection was initiated');

  // 1. Simulate TCP Connection
  console.log('\n--- Test 1: Connection Registration ---');
  mockSocketInstance.emit('connect');

  assert(
    mockSocketInstance.sentData.includes('NICK GatherBot\r\n'),
    'Sent NICK command on connection'
  );
  assert(
    mockSocketInstance.sentData.includes('USER gatherbot 0 * :Gather Queue Bot\r\n'),
    'Sent USER command on connection'
  );

  // Clear sent data for next steps
  mockSocketInstance.sentData = [];

  // 2. Simulate 001 Welcome message
  console.log('\n--- Test 2: Channel Join on 001 Welcome ---');
  mockSocketInstance.emit('data', ':irc.libera.chat 001 GatherBot :Welcome to Libera Chat\r\n');
  assert(
    mockSocketInstance.sentData.includes(`JOIN ${CHANNEL}\r\n`),
    'Joined channel on 001 Welcome'
  );

  mockSocketInstance.sentData = [];

  // 3. Simulate PING request
  console.log('\n--- Test 3: PING/PONG keep-alive ---');
  mockSocketInstance.emit('data', 'PING :12345678\r\n');
  assert(
    mockSocketInstance.sentData.includes('PONG :12345678\r\n'),
    'Responded with PONG to server PING'
  );

  mockSocketInstance.sentData = [];

  // 4. Simulate a user joining queue (-j)
  console.log('\n--- Test 4: Player Join Command (-j) ---');
  mockSocketInstance.emit('data', `:Player1!user@host PRIVMSG ${CHANNEL} :-j\r\n`);
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :Player1 joined the queue. [1/8]\r\n`),
    'Confirmed Player1 joined queue'
  );

  mockSocketInstance.sentData = [];

  // 5. Simulate duplicate join
  console.log('\n--- Test 5: Prevent Duplicate Join ---');
  mockSocketInstance.emit('data', `:Player1!user@host PRIVMSG ${CHANNEL} :-j\r\n`);
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :Player1: You are already in the queue! [1/8]\r\n`),
    'Warned player about duplicate join'
  );

  mockSocketInstance.sentData = [];

  // 6. Simulate player leaving queue (-l)
  console.log('\n--- Test 6: Player Leave Command (-l) ---');
  mockSocketInstance.emit('data', `:Player1!user@host PRIVMSG ${CHANNEL} :-l\r\n`);
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :Player1 left the queue. [0/8]\r\n`),
    'Confirmed Player1 left the queue'
  );

  mockSocketInstance.sentData = [];

  // 7. Status command check when empty
  console.log('\n--- Test 7: Status command (empty) ---');
  mockSocketInstance.emit('data', `:Player1!user@host PRIVMSG ${CHANNEL} :-s\r\n`);
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :The queue is currently empty. [0/8]\r\n`),
    'Indicated queue is empty'
  );

  mockSocketInstance.sentData = [];

  // 8. Add players until queue is full (8 players)
  console.log('\n--- Test 8: Fill the Queue (8 Players) ---');
  for (let i = 1; i <= 8; i++) {
    mockSocketInstance.emit('data', `:Player${i}!user@host PRIVMSG ${CHANNEL} :-j\r\n`);
  }

  // Check messages
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :Player1 joined the queue. [1/8]\r\n`),
    'Player1 joined'
  );
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :Player8 joined the queue. [8/8]\r\n`),
    'Player8 joined'
  );
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :Lobby is FULL! Players: Player1, Player2, Player3, Player4, Player5, Player6, Player7, Player8.\r\n`),
    'Announced full lobby of 8 players'
  );
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :Queue is resetting...\r\n`),
    'Announced queue reset'
  );

  mockSocketInstance.sentData = [];

  // 9. Status command check after reset
  console.log('\n--- Test 9: Status command (after reset) ---');
  mockSocketInstance.emit('data', `:Player1!user@host PRIVMSG ${CHANNEL} :-status\r\n`);
  assert(
    mockSocketInstance.sentData.includes(`PRIVMSG ${CHANNEL} :The queue is currently empty. [0/8]\r\n`),
    'Confirmed queue was reset to empty'
  );

  mockSocketInstance.sentData = [];

  console.log('\n======================================');
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('======================================');
  process.exit(0);
}

// Allow initialization to proceed, then run tests
setTimeout(runTests, 100);
