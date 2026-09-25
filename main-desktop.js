const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let localDedicatedServerProcess = null;
let localServerLogs = [];

function startLocalServerProcess() {
  if (localDedicatedServerProcess) {
    return { success: true, running: true, message: 'Server already active', pid: localDedicatedServerProcess.pid };
  }
  try {
    const serverScript = path.join(__dirname, 'js/index.js');
    localDedicatedServerProcess = spawn(process.execPath, [serverScript], {
      cwd: __dirname,
      env: { ...process.env, HELIX_PORT: '7777', NODE_ENV: 'production' }
    });

    localDedicatedServerProcess.stdout.on('data', (chunk) => {
      const line = chunk.toString();
      console.log(`[DEDICATED SERVER]: ${line}`);
      localServerLogs.push(`[${new Date().toLocaleTimeString()}] ${line.trim()}`);
      if (localServerLogs.length > 100) localServerLogs.shift();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('local-server-log', line);
      }
    });

    localDedicatedServerProcess.stderr.on('data', (chunk) => {
      const line = chunk.toString();
      console.error(`[DEDICATED SERVER ERR]: ${line}`);
      localServerLogs.push(`[ERR ${new Date().toLocaleTimeString()}] ${line.trim()}`);
      if (localServerLogs.length > 100) localServerLogs.shift();
    });

    localDedicatedServerProcess.on('close', (code) => {
      console.log(`[DEDICATED SERVER] Process stopped with code ${code}`);
      localDedicatedServerProcess = null;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('local-server-status', { running: false, code: code });
      }
    });

    return { success: true, running: true, message: 'Dedicated server running on 127.0.0.1:7777', pid: localDedicatedServerProcess.pid };
  } catch (err) {
    console.error('[DEDICATED SERVER] Failed to spawn:', err);
    return { success: false, running: false, error: err.message };
  }
}

function stopLocalServerProcess() {
  if (localDedicatedServerProcess) {
    try {
      localDedicatedServerProcess.kill();
    } catch (e) {}
    localDedicatedServerProcess = null;
    return { success: true, running: false, message: 'Dedicated server halted' };
  }
  return { success: true, running: false, message: 'No server was running' };
}

function createServer() {
  const root = __dirname;
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
  };

  const server = http.createServer((req, res) => {
    // API endpoints for browser or renderer communication
    if (req.url === '/api/server-status' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        running: !!localDedicatedServerProcess,
        pid: localDedicatedServerProcess ? localDedicatedServerProcess.pid : null,
        port: 7777,
        logs: localServerLogs.slice(-10)
      }));
      return;
    }

    if (req.url === '/api/start-server' && req.method === 'POST') {
      const result = startLocalServerProcess();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(result));
      return;
    }

    if (req.url === '/api/stop-server' && req.method === 'POST') {
      const result = stopLocalServerProcess();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(result));
      return;
    }

    if (req.url === '/api/launch-protocol' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          if (parsed.url) {
            shell.openExternal(parsed.url);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ success: true, url: parsed.url }));
            return;
          }
        } catch (e) {}
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success: false, error: 'Invalid URL payload' }));
      });
      return;
    }

    let parsedUrl = req.url.split('?')[0];
    let filePath = path.join(root, parsedUrl === '/' ? 'index.html' : parsedUrl);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>', 'utf-8');
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

  server.listen(3300, '127.0.0.1', () => {
    console.log('⚡ CustomLobbies Desktop Local Engine running on http://127.0.0.1:3300');
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 1024,
    minHeight: 720,
    title: 'CustomLobbies Desktop Program Client v2.5',
    icon: path.join(__dirname, 'assets/logo.jpg'),
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: '#0a0b10',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadURL('http://127.0.0.1:3300');

  // Intercept window.open calls
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('steam://') || url.startsWith('helix://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Intercept will-navigate to prevent ERR_UNKNOWN_URL_SCHEME when renderer does window.location.href = 'steam://...'
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('steam://') || url.startsWith('helix://') || (!url.startsWith('http://127.0.0.1:3300') && !url.startsWith('http://localhost:3300'))) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopLocalServerProcess();
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// IPC handler for launching Steam or custom protocol game links
ipcMain.on('launch-server-protocol', (event, payload) => {
  const url = typeof payload === 'string' ? payload : (payload && payload.url);
  if (url) {
    console.log(`[IPC] Launching external server protocol: ${url}`);
    shell.openExternal(url);
    event.reply('server-protocol-dispatched', { success: true, url });
  }
});

// Dedicated server process management via IPC
ipcMain.on('start-local-dedicated-server', (event) => {
  const result = startLocalServerProcess();
  event.reply('local-server-status', result);
});

ipcMain.on('stop-local-dedicated-server', (event) => {
  const result = stopLocalServerProcess();
  event.reply('local-server-status', result);
});

ipcMain.on('get-server-status', (event) => {
  event.reply('local-server-status', {
    running: !!localDedicatedServerProcess,
    pid: localDedicatedServerProcess ? localDedicatedServerProcess.pid : null,
    port: 7777,
    logs: localServerLogs.slice(-10)
  });
});
