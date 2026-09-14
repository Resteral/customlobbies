/**
 * CustomLobbies.com - Standalone Electron Desktop Program
 * Provides native desktop window, GPU-accelerated screen capture, system audio mixer, system tray icon & in-game hotkeys.
 */

const { app, BrowserWindow, ipcMain, desktopCapturer, globalShortcut, Tray, Menu } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { WebSocketServer } = require('ws');

let mainWindow;
let tray;
const PORT = 8088;

// Create Local WebSocket Relay Bridge
function startWebSocketBridge() {
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

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('⚡ Desktop Program connected to WebSocket Bridge');
    ws.on('message', (message) => {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(message);
        }
      });
    });
  });

  server.listen(PORT, () => {
    console.log(`🎥 CustomLobbies Desktop Streamer Program Relay active at http://localhost:${PORT}`);
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'CustomLobbies.com - Native Desktop App',
    backgroundColor: '#0a0c10',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Load Main Web App inside Electron Desktop Window
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupTray() {
  try {
    tray = new Tray(path.join(__dirname, '../assets/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      { label: '🎮 Open CustomLobbies Desktop App', click: () => mainWindow && mainWindow.show() },
      { label: '🎥 Launch Streamer Studio', click: () => mainWindow && mainWindow.loadFile(path.join(__dirname, 'stream-capturer.html')) },
      { label: '🎙️ Toggle Voice Mic Mute', click: () => mainWindow && mainWindow.webContents.send('toggle-voice-mute') },
      { type: 'separator' },
      { label: '❌ Exit Program', click: () => app.quit() }
    ]);
    tray.setToolTip('CustomLobbies Desktop Program');
    tray.setContextMenu(contextMenu);
  } catch (err) {
    console.log('Tray setup skipped (no icon file)');
  }
}

// Electron Application Lifecycle
app.whenReady().then(() => {
  startWebSocketBridge();
  createMainWindow();
  setupTray();

  // Register Global In-Game Overlay Hotkey: Ctrl+Shift+L
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // IPC Handler for Native Screen Sources
  ipcMain.handle('get-desktop-sources', async () => {
    const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
    return sources;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
