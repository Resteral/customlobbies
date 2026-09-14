/**
 * CustomLobbies.com - Standalone Desktop Streamer Program & WebSocket Relay Server
 * Handles local desktop screen & system audio capture frames and routes to CustomLobbies Web App
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = 8088;

// Create HTTP Server serving stream controller interface
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'stream-capturer.html');
    fs.readFile(htmlPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading capturer UI');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Create WebSocket Broadcast Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('⚡ Desktop Streamer Client Connected to Local Bridge');

  ws.on('message', (message) => {
    // Relay stream data frames to all web subscribers
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Client Disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎥 CustomLobbies Desktop Streamer Program Running!`);
  console.log(`🌐 Stream Controller UI: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket Relay Bridge: ws://localhost:${PORT}`);
  console.log(`====================================================`);
});
