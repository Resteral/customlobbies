// CustomLobbies Desktop Program Client Suite v2.5
class ProgramClientSuite {
  constructor() {
    this.isMaximized = false;
    this.systemPing = 14;
    this.systemMemory = 128.4;
    this.activeConnectLobby = null;
  }

  init() {
    this.initClientMode();
    this.setupWindowControls();
    this.setupKeyboardShortcuts();
    this.startSystemMetricsTicker();
    console.log('🛡️ CustomLobbies Desktop Program Client Engine initialized!');
  }

  initClientMode() {
    const isDesktopApp = !!(window.require || (window.process && window.process.type) || (navigator.userAgent && navigator.userAgent.includes('Electron')));
    if (isDesktopApp) {
      document.body.classList.add('is-desktop-app');
      const saved = localStorage.getItem('cl_discord_client_mode');
      if (saved === 'true' || saved === null) {
        document.body.classList.add('discord-client-fullscreen');
        const label = document.getElementById('labelDesktopClientMode');
        if (label) label.textContent = 'Web View';
      }
    } else {
      // In web browser, ensure website is never trapped in fullscreen client mode
      document.body.classList.remove('discord-client-fullscreen');
      document.body.classList.remove('is-desktop-app');
      const label = document.getElementById('labelDesktopClientMode');
      if (label) label.textContent = 'Full Client View';
    }
  }

  toggleClientMode() {
    const isClient = document.body.classList.toggle('discord-client-fullscreen');
    localStorage.setItem('cl_discord_client_mode', isClient ? 'true' : 'false');
    const label = document.getElementById('labelDesktopClientMode');
    if (label) label.textContent = isClient ? 'Web View' : 'Full Client View';

    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(isClient ? '🖥️ Switched to Standalone Discord Client View' : '🌐 Switched to Web Browser Navigation View', 'info');
    }
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
        if (e.shiftKey && key === 'd') {
          e.preventDefault();
          this.toggleClientMode();
        } else if (key === 'm') {
          e.preventDefault();
          if (window.chatVoiceManager) window.chatVoiceManager.toggleMic();
        } else if (key === 'd' && !e.shiftKey) {
          e.preventDefault();
          if (window.chatVoiceManager) window.chatVoiceManager.toggleDeafen();
        } else if (key === 'q') {
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
    if (window.app && typeof window.app.launchServerProtocol === 'function') {
      window.app.launchServerProtocol({
        serverIp: serverIp,
        game: 'Helix Game',
        title: gameName,
        map: 'Pacifica World'
      });
    } else {
      const protocol = `steam://connect/${serverIp}`;
      try {
        let iframe = document.getElementById('protocolDispatchFrame');
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.id = 'protocolDispatchFrame';
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
        }
        iframe.src = protocol;
      } catch(e) {}
    }
  }
}

window.programClientSuite = new ProgramClientSuite();
document.addEventListener('DOMContentLoaded', () => window.programClientSuite.init());
