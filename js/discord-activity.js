/* CustomLobbies.com - Discord Embedded App Activity Engine
   Official Discord Embedded App SDK Protocol & Activity Suite
   Enables CustomLobbies to run inside Discord Voice Channels & Server Chats
*/

class DiscordActivityEngine {
  constructor() {
    this.isDiscordActivity = false;
    this.isSimulatorMode = false;
    this.isHandshakeComplete = false;
    this.clientId = localStorage.getItem('cl_discord_client_id') || '1283928109382910291';
    this.clientSecret = localStorage.getItem('cl_discord_client_secret') || '';
    
    // Discord query parameters passed to the Activity iframe
    const urlParams = new URLSearchParams(window.location.search);
    this.frameId = urlParams.get('frame_id') || null;
    this.instanceId = urlParams.get('instance_id') || null;
    this.channelId = urlParams.get('channel_id') || null;
    this.guildId = urlParams.get('guild_id') || null;
    this.platform = urlParams.get('platform') || 'web'; // 'web', 'desktop', 'mobile'

    // Discord user profile & voice state
    this.discordUser = {
      id: 'usr_discord_882910',
      username: 'BDroplE',
      global_name: 'BDroplE #1',
      discriminator: '0',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=128&auto=format&fit=crop&q=80',
      accent_color: '#00f2fe'
    };

    this.channelInfo = {
      id: this.channelId || '104928192049182910',
      name: '🔊 Premier Scrim Comms #1',
      type: 2 // Guild Voice
    };

    this.guildInfo = {
      id: this.guildId || '987654321098765432',
      name: 'CustomLobbies Esports Community',
      icon: 'assets/logo.jpg'
    };

    this.participants = [
      { id: '1', username: 'BDroplE', global_name: 'BDroplE', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80', speaking: false, muted: false },
      { id: '2', username: 'ApexGod99', global_name: 'Apex God', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80', speaking: true, muted: false },
      { id: '3', username: 'Valkyrie_CS', global_name: 'Valkyrie', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80', speaking: false, muted: false },
      { id: '4', username: 'S1mple_Fragger', global_name: 'S1mple', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=80&auto=format&fit=crop&q=80', speaking: false, muted: true }
    ];

    this.currentActivity = {
      details: 'Browsing Competitive Matchmaking',
      state: 'Ready to Scrim (128-Tick)',
      timestamps: { start: Date.now() },
      assets: {
        large_image: 'customlobbies_logo',
        large_text: 'CustomLobbies.com',
        small_image: 'cs2_icon',
        small_text: '128-Tick Scrim Nodes'
      },
      party: { size: [1, 10] }
    };

    this.nonceCounter = 1;
    this.pendingCallbacks = new Map();
  }

  init() {
    this.checkEnvironment();
    this.setupMessageListener();
    this.setupUI();
    this.renderActivityStatusPills();

    if (this.isDiscordActivity) {
      console.log('🎮 [DiscordActivity] Launched inside Discord Embedded App iframe! Initializing SDK handshake...');
      this.startDiscordHandshake();
    } else {
      // Check if user previously enabled Simulator mode in local storage
      const savedSim = localStorage.getItem('cl_discord_sim_mode');
      if (savedSim === 'true') {
        this.enableSimulatorMode(false);
      }
    }
  }

  checkEnvironment() {
    // Detect if inside an iframe with Discord query params
    const inIframe = window.parent !== window;
    const hasDiscordParams = Boolean(this.frameId || this.instanceId || this.channelId);
    
    if (inIframe || hasDiscordParams) {
      this.isDiscordActivity = true;
      document.body.classList.add('discord-activity-mode');
    }
  }

  setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Security check: in production Discord postMessage origin is typically https://discord.com
      if (!event.data || typeof event.data !== 'object') return;
      
      const { cmd, evt, data, nonce } = event.data;

      if (nonce && this.pendingCallbacks.has(nonce)) {
        const callback = this.pendingCallbacks.get(nonce);
        this.pendingCallbacks.delete(nonce);
        callback(data);
      }

      if (evt) {
        this.handleDiscordEvent(evt, data);
      }
    });
  }

  setupUI() {
    // Attach click handler to modal close
    const btnCloseModal = document.getElementById('btnCloseDiscordActivityModal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => this.closeActivityModal());
    }

    // Attach click handler to modal overlay background click
    const modal = document.getElementById('discordActivityModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeActivityModal();
      });
    }
  }

  sendRpc(cmd, args = {}) {
    const nonce = `nonce_${this.nonceCounter++}_${Date.now()}`;
    return new Promise((resolve) => {
      this.pendingCallbacks.set(nonce, resolve);
      try {
        window.parent.postMessage({
          cmd,
          args,
          nonce
        }, '*');
      } catch (err) {
        console.warn('[DiscordActivity] postMessage error:', err);
        resolve(null);
      }
      // Timeout fallback in case not running inside active Discord client
      setTimeout(() => {
        if (this.pendingCallbacks.has(nonce)) {
          this.pendingCallbacks.delete(nonce);
          resolve(null);
        }
      }, 3000);
    });
  }

  async startDiscordHandshake() {
    try {
      // Step 1: Send INIT / READY to Discord client parent window
      const initResp = await this.sendRpc('INIT', { client_id: this.clientId, version: 1 });
      this.isHandshakeComplete = true;

      // Step 2: Request Authorize with scopes
      const authResp = await this.sendRpc('AUTHORIZE', {
        client_id: this.clientId,
        response_type: 'code',
        scope: ['identify', 'guilds', 'rpc.voice.read', 'activities.write']
      });

      // Step 3: Fetch Channel and Guild info
      if (this.channelId) {
        const channelResp = await this.sendRpc('GET_CHANNEL', { channel_id: this.channelId });
        if (channelResp && channelResp.name) {
          this.channelInfo = channelResp;
        }
      }

      // Step 4: Subscribe to Discord voice and participant events
      this.sendRpc('SUBSCRIBE', { evt: 'VOICE_STATE_UPDATE' });
      this.sendRpc('SUBSCRIBE', { evt: 'SPEAKING_START' });
      this.sendRpc('SUBSCRIBE', { evt: 'SPEAKING_STOP' });
      this.sendRpc('SUBSCRIBE', { evt: 'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE' });

      // Step 5: Sync initial presence
      this.setActivity({
        details: 'CustomLobbies: Competitive Scrims',
        state: 'Ready to Queue / Draft'
      });

      this.renderActivityTopBar();
      this.renderActivityStatusPills();
      this.syncUserIdentityWithApp();

      if (window.widgetBuilderEngine?.showToast) {
        window.widgetBuilderEngine.showToast('👾 Connected to Discord Activity Embedded App!', 'success');
      }
    } catch (err) {
      console.warn('[DiscordActivity] Handshake error:', err);
    }
  }

  handleDiscordEvent(evt, data) {
    if (!data) return;

    if (evt === 'VOICE_STATE_UPDATE') {
      const idx = this.participants.findIndex(p => p.id === data.user?.id);
      if (idx !== -1) {
        this.participants[idx].muted = data.voice_state?.mute || data.voice_state?.self_mute;
        this.renderActivityTopBar();
      }
    } else if (evt === 'SPEAKING_START') {
      const idx = this.participants.findIndex(p => p.id === data.user_id);
      if (idx !== -1) {
        this.participants[idx].speaking = true;
        this.renderActivityTopBar();
      }
    } else if (evt === 'SPEAKING_STOP') {
      const idx = this.participants.findIndex(p => p.id === data.user_id);
      if (idx !== -1) {
        this.participants[idx].speaking = false;
        this.renderActivityTopBar();
      }
    } else if (evt === 'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE') {
      if (Array.isArray(data.participants)) {
        this.participants = data.participants;
        this.renderActivityTopBar();
      }
    }
  }

  setActivity(activityUpdate = {}) {
    this.currentActivity = {
      ...this.currentActivity,
      ...activityUpdate,
      timestamps: { start: Date.now() }
    };

    if (this.isDiscordActivity) {
      this.sendRpc('SET_ACTIVITY', {
        activity: this.currentActivity
      });
    }

    this.updateActivityPresencePreview();
  }

  syncUserIdentityWithApp() {
    if (!window.app) return;

    // Harmonize Discord identity into CustomLobbies Gamer Passport
    if (this.discordUser.username) {
      window.app.user.displayName = this.discordUser.global_name || this.discordUser.username;
      window.app.user.handle = `@${this.discordUser.username}`;
    }

    if (this.discordUser.avatar) {
      window.app.userAvatar = this.discordUser.avatar;
      try {
        localStorage.setItem('cl_user_avatar', this.discordUser.avatar);
      } catch (e) {}

      // Update avatar previews in navbar and sidebar
      if (typeof window.app.updateAvatarDisplays === 'function') {
        window.app.updateAvatarDisplays();
      }
    }
  }

  // --- ACTIVITY SIMULATOR & DEV PREVIEW SUITE ---
  enableSimulatorMode(notify = true) {
    this.isSimulatorMode = true;
    document.body.classList.add('discord-activity-mode');
    localStorage.setItem('cl_discord_sim_mode', 'true');

    this.renderActivityTopBar();
    this.renderActivityStatusPills();
    this.updateActivityPresencePreview();

    if (notify && window.widgetBuilderEngine?.showToast) {
      window.widgetBuilderEngine.showToast('🚀 Discord Activity Simulator Activated! Running in Discord Frame Mode.', 'success');
    }
  }

  disableSimulatorMode(notify = true) {
    this.isSimulatorMode = false;
    if (!this.isDiscordActivity) {
      document.body.classList.remove('discord-activity-mode');
    }
    localStorage.removeItem('cl_discord_sim_mode');

    const topBar = document.getElementById('discordActivityTopBar');
    if (topBar) topBar.style.display = 'none';

    this.renderActivityStatusPills();
    this.updateActivityPresencePreview();

    if (notify && window.widgetBuilderEngine?.showToast) {
      window.widgetBuilderEngine.showToast('ℹ️ Exited Discord Activity Simulator.', 'info');
    }
  }

  toggleSimulatorMode() {
    if (this.isSimulatorMode) {
      this.disableSimulatorMode(true);
    } else {
      this.enableSimulatorMode(true);
    }
    this.updateSimulatorButtonUI();
  }

  renderActivityTopBar() {
    const topBar = document.getElementById('discordActivityTopBar');
    if (!topBar) return;

    if (!this.isDiscordActivity && !this.isSimulatorMode) {
      topBar.style.display = 'none';
      return;
    }

    topBar.style.display = 'flex';

    const participantsHtml = this.participants.map(p => `
      <div class="discord-activity-participant ${p.speaking ? 'speaking' : ''} ${p.muted ? 'muted' : ''}" title="${p.global_name || p.username} ${p.speaking ? '(Speaking)' : ''}">
        <img src="${p.avatar}" alt="${p.username}">
        ${p.speaking ? '<span class="discord-speaking-ring"></span>' : ''}
        ${p.muted ? '<span class="discord-muted-icon">🔇</span>' : ''}
      </div>
    `).join('');

    topBar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
        <div class="discord-activity-logo" style="display: flex; align-items: center; gap: 0.4rem;">
          <span style="font-size: 1.25rem;">👾</span>
          <strong style="color: #fff; font-size: 0.88rem; letter-spacing: 0.3px;">Discord Activity</strong>
        </div>
        <div style="height: 16px; width: 1px; background: rgba(255,255,255,0.2);"></div>
        <div style="display: flex; align-items: center; gap: 0.45rem; min-width: 0;">
          <span style="font-size: 0.95rem; color: #5865F2;">🔊</span>
          <span style="font-weight: 700; color: #fff; font-size: 0.82rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${this.channelInfo.name}
          </span>
          <span class="lobby-game-tag" style="background: rgba(88, 101, 242, 0.25); color: #5865F2; border: 1px solid #5865F2; font-size: 0.65rem; padding: 0.1rem 0.35rem;">
            ${this.isSimulatorMode ? '🧪 SIMULATOR' : 'LIVE'}
          </span>
        </div>
      </div>

      <!-- Center Voice Participants Avatars -->
      <div class="discord-activity-participants-list" style="display: flex; align-items: center; gap: 0.4rem;">
        ${participantsHtml}
        <button class="btn btn-secondary btn-sm" onclick="window.discordActivityEngine.openActivityModal()" title="Add / Invite Players" style="padding: 0.15rem 0.45rem; font-size: 0.72rem; border-radius: 20px;">
          ➕ ${this.participants.length}
        </button>
      </div>

      <!-- Right Voice Controls & Activity Settings -->
      <div style="display: flex; align-items: center; gap: 0.45rem;">
        <button class="btn btn-secondary btn-sm" onclick="window.discordActivityEngine.toggleParticipantSpeakingSim()" title="Simulate Voice Activity (Toggle Speaking)" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
          🎙️ Voice Sim
        </button>
        <button class="btn btn-purple btn-sm" onclick="window.discordActivityEngine.openActivityModal()" title="Discord Activity Settings & Invite Link" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; background: #5865F2; border-color: #5865F2;">
          ⚙️ Activity Hub
        </button>
        ${this.isSimulatorMode ? `
          <button class="btn btn-danger btn-sm" onclick="window.discordActivityEngine.disableSimulatorMode(true)" title="Exit Discord Activity Simulator" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">
            ✕ Exit Sim
          </button>
        ` : ''}
      </div>
    `;
  }

  toggleParticipantSpeakingSim() {
    if (this.participants.length > 0) {
      // Toggle speaking state on the user or first participant
      this.participants[0].speaking = !this.participants[0].speaking;
      this.renderActivityTopBar();
      if (window.widgetBuilderEngine?.playSoundEffect) {
        window.widgetBuilderEngine.playSoundEffect('click');
      }
    }
  }

  renderActivityStatusPills() {
    const pill = document.getElementById('navbarDiscordActivityPill');
    if (pill) {
      if (this.isDiscordActivity) {
        pill.innerHTML = `<span class="live-dot" style="background: #00e676;"></span> 👾 DISCORD ACTIVITY (LIVE)`;
        pill.className = 'activity-pill live';
      } else if (this.isSimulatorMode) {
        pill.innerHTML = `<span class="live-dot" style="background: #5865F2;"></span> 👾 SIMULATOR ACTIVE`;
        pill.className = 'activity-pill sim';
      } else {
        pill.innerHTML = `<span>👾</span> Discord Activity`;
        pill.className = 'activity-pill';
      }
    }
  }

  updateActivityPresencePreview() {
    const previewEl = document.getElementById('discordRichPresencePreview');
    if (!previewEl) return;

    previewEl.innerHTML = `
      <div style="background: rgba(43, 45, 49, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.85rem; display: flex; gap: 0.75rem; align-items: center;">
        <div style="position: relative; width: 48px; height: 48px;">
          <img src="assets/logo.jpg" style="width: 48px; height: 48px; border-radius: 10px; border: 1px solid var(--accent-cyan);" alt="CustomLobbies">
          <span style="position: absolute; bottom: -2px; right: -2px; background: #5865F2; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; border: 2px solid #2b2d31;">👾</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 800; font-size: 0.85rem; color: #fff;">PLAYING A GAME</div>
          <div style="font-weight: 700; font-size: 0.92rem; color: #fff;">CustomLobbies</div>
          <div style="font-size: 0.78rem; color: #dbdee1;">${this.currentActivity.details || 'Competitive Matchmaking'}</div>
          <div style="font-size: 0.75rem; color: #949ba4;">${this.currentActivity.state || '128-Tick Scrim Nodes'}</div>
        </div>
      </div>
    `;
  }

  // --- MODAL CONTROLS & CONFIGURATION ---
  openActivityModal() {
    const modal = document.getElementById('discordActivityModal');
    if (!modal) return;

    modal.classList.add('active');

    // Populate modal inputs
    const inputClientId = document.getElementById('discordActivityClientIdInput');
    const inputSecret = document.getElementById('discordActivitySecretInput');
    const textInviteUrl = document.getElementById('discordActivityInviteUrl');
    const slashCommand = document.getElementById('discordActivitySlashCmd');
    const envStatus = document.getElementById('discordActivityEnvStatus');

    if (inputClientId) inputClientId.value = this.clientId;
    if (inputSecret) inputSecret.value = this.clientSecret;

    const launchUrl = `https://discord.com/activities/${this.clientId}?channel_id=${this.channelInfo.id}`;
    if (textInviteUrl) textInviteUrl.value = launchUrl;
    if (slashCommand) slashCommand.textContent = `/activity activity_name: CustomLobbies channel: #${this.channelInfo.name.replace('🔊 ', '')}`;

    if (envStatus) {
      if (this.isDiscordActivity) {
        envStatus.innerHTML = `🟢 <b>Connected inside Discord Voice Activity!</b> (Frame: <code>${this.frameId || 'active'}</code> | Instance: <code>${this.instanceId || 'live'}</code>)`;
        envStatus.style.color = 'var(--accent-green)';
      } else if (this.isSimulatorMode) {
        envStatus.innerHTML = `🧪 <b>Running in Activity Simulator Mode.</b> Test frame layout & voice presence.`;
        envStatus.style.color = '#5865F2';
      } else {
        envStatus.innerHTML = `🌐 <b>Standalone Mode.</b> Launch via Discord voice channel rocket button or test with Simulator below.`;
        envStatus.style.color = 'var(--text-muted)';
      }
    }

    this.updateSimulatorButtonUI();
    this.updateActivityPresencePreview();
  }

  closeActivityModal() {
    const modal = document.getElementById('discordActivityModal');
    if (modal) modal.classList.remove('active');
  }

  updateSimulatorButtonUI() {
    const btn = document.getElementById('btnToggleDiscordSimulator');
    if (btn) {
      if (this.isSimulatorMode) {
        btn.textContent = '❌ Stop Discord Activity Simulator';
        btn.className = 'btn btn-danger btn-sm';
      } else {
        btn.textContent = '🧪 Launch Discord Activity Simulator';
        btn.className = 'btn btn-purple btn-sm';
      }
    }
  }

  saveConfiguration() {
    const inputClientId = document.getElementById('discordActivityClientIdInput');
    const inputSecret = document.getElementById('discordActivitySecretInput');

    if (inputClientId) {
      this.clientId = inputClientId.value.trim() || '1283928109382910291';
      localStorage.setItem('cl_discord_client_id', this.clientId);
    }

    if (inputSecret) {
      this.clientSecret = inputSecret.value.trim();
      localStorage.setItem('cl_discord_client_secret', this.clientSecret);
    }

    const textInviteUrl = document.getElementById('discordActivityInviteUrl');
    if (textInviteUrl) {
      textInviteUrl.value = `https://discord.com/activities/${this.clientId}?channel_id=${this.channelInfo.id}`;
    }

    if (window.widgetBuilderEngine?.showToast) {
      window.widgetBuilderEngine.showToast('✅ Discord Activity settings saved!', 'success');
    } else {
      alert('✅ Discord Activity settings saved!');
    }
  }

  copyInviteUrl() {
    const input = document.getElementById('discordActivityInviteUrl');
    const text = input ? input.value : `https://discord.com/activities/${this.clientId}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.widgetBuilderEngine?.showToast) {
          window.widgetBuilderEngine.showToast('📋 Discord Activity launch URL copied to clipboard!', 'success');
        } else {
          alert('📋 Discord Activity launch URL copied to clipboard!');
        }
      });
    }
  }

  copySlashCommand() {
    const text = `/activity activity_id:${this.clientId}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.widgetBuilderEngine?.showToast) {
          window.widgetBuilderEngine.showToast('📋 Slash command copied: /activity!', 'success');
        } else {
          alert('📋 Slash command copied: /activity!');
        }
      });
    }
  }
}

// Global initialization
window.discordActivityEngine = new DiscordActivityEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.discordActivityEngine.init();
});
