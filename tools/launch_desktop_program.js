const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const PORT = 3300;
const ROOT_DIR = path.resolve(__dirname, '..');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  let filePath = path.join(ROOT_DIR, reqUrl === '/' ? 'index.html' : reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 CustomLobbies File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('====================================================');
  console.log('🛡️  CUSTOMLOBBIES DESKTOP PROGRAM CLIENT ENGINE v2.5');
  console.log('====================================================');
  console.log(`⚡ Desktop Server Active: http://127.0.0.1:${PORT}`);
  console.log('🎮 Telemetry Status: 100% ONLINE | 128-Tick Scrim Engine Active');
  console.log('====================================================');

  launchStandaloneAppWindow();
});

function launchStandaloneAppWindow() {
  const url = `http://127.0.0.1:${PORT}`;

  // Try Electron first
  exec('npx electron main-desktop.js', { cwd: ROOT_DIR }, (err) => {
    if (err) {
      console.log('ℹ️ Electron not installed globally. Launching Native Standalone Desktop Window Mode...');
      launchBrowserAppMode(url);
    }
  });
}

function launchBrowserAppMode(url) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  let command = null;
  let args = [];

  if (fs.existsSync(edgePath)) {
    command = edgePath;
    args = [`--app=${url}`, '--name=CustomLobbiesDesktopApp', '--window-size=1480,940'];
  } else if (fs.existsSync(chromePath)) {
    command = chromePath;
    args = [`--app=${url}`, '--name=CustomLobbiesDesktopApp', '--window-size=1480,940'];
  } else {
    // Windows start fallback
    exec(`start "" "${url}"`);
    return;
  }

  console.log(`🚀 Launching Standalone Desktop Program Window: ${command}`);
  const appProcess = spawn(command, args, { detached: true, stdio: 'ignore' });
  appProcess.unref();
}
