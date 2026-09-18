// CustomLobbies Desktop Program Client Suite v2.5
class ProgramClientSuite {
  constructor() {
    this.isMaximized = false;
    this.systemPing = 14;
    this.systemMemory = 128.4;
    this.activeConnectLobby = null;
  }

  init() {
    this.setupWindowControls();
    this.setupKeyboardShortcuts();
    this.startSystemMetricsTicker();
    console.log('🛡️ CustomLobbies Desktop Program Client Engine initialized!');
  }

  setupWindowControls() {
    const minBtn = document.getElementById('desktopMinBtn');
    const maxBtn = document.getElementById('desktopMaxBtn');
    const closeBtn = document.getElementById('desktopCloseBtn');

    if (minBtn) {
      minBtn.addEventListener('click', () => {
        if (window.require) {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('window-minimize');
        } else {
          alert('💻 CustomLobbies Program Client minimized to Windows system taskbar tray.');
        }
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', () => {
        if (window.require) {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('window-maximize');
        } else {
          this.isMaximized = !this.isMaximized;
          if (this.isMaximized) {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            }
          } else {
            if (document.exitFullscreen && document.fullscreenElement) {
              document.exitFullscreen();
            }
          }
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (window.require) {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('window-close');
        } else {
          alert('💻 CustomLobbies Program Client running in background tray.');
        }
      });
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'q') {
          e.preventDefault();
          const btn = document.querySelector('[data-tab=lobbies-view]');
          if (btn) btn.click();
          if (window.app) window.app.openQuickQueueModal();
        } else if (key === 'l') {
          e.preventDefault();
          const btn = document.querySelector('[data-tab=lobbies-view]');
          if (btn) btn.click();
        } else if (key === 't' || key === 'b') {
          e.preventDefault();
          const btn = document.querySelector('[data-tab=tournaments-view]');
          if (btn) btn.click();
        } else if (key === 'd') {
          e.preventDefault();
          const btn = document.querySelector('[data-tab=debate-view]');
          if (btn) btn.click();
        } else if (key === 'c') {
          e.preventDefault();
          const btn = document.querySelector('[data-tab=community-view]');
          if (btn) btn.click();
        }
      }
    });
  }

  startSystemMetricsTicker() {
    setInterval(() => {
      this.systemPing = Math.floor(12 + Math.random() * 6);
      this.systemMemory = (124 + Math.random() * 14).toFixed(1);

      const pingEl = document.getElementById('desktopStatusPing');
      if (pingEl) pingEl.textContent = `⚡ ${this.systemPing}ms`;

      const memEl = document.getElementById('desktopStatusMemory');
      if (memEl) memEl.textContent = `💾 ${this.systemMemory} MB`;
    }, 2500);
  }

  launchDirectGameProtocol(serverIp = '127.0.0.1:7777', gameName = 'Pacifica Helix Dedicated Server') {
    const protocol = `steam://connect/${serverIp}`;
    alert(`🚀 LAUNCHING HELIX DEDICATED SERVER PROTOCOL!\n\nGame / Map: ${gameName}\nHelix Server IP: ${serverIp}\nProtocol: ${protocol}\n\nConnecting to Pacifica Helix Competitive Server Engine...`);
    window.location.href = protocol;
  }
}

window.programClientSuite = new ProgramClientSuite();
document.addEventListener('DOMContentLoaded', () => window.programClientSuite.init());
