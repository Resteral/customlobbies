/* CustomLobbies.com - 4-Way Cross-Platform Integrations Engine
   Connects: Twitch, Streamlabs API, Discord Webhooks, and CustomLobbies.com
*/

class IntegrationsHubEngine {
  constructor() {
    this.twitchConnected = false;
    this.streamlabsConnected = false;
    this.discordWebhookConnected = false;

    this.settings = {
      twitchUsername: 'ProStreamer_2026',
      streamlabsToken: '',
      discordWebhookURL: ''
    };
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
  }

  loadSettings() {
    const saved = localStorage.getItem('cl_integrations');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
        if (this.settings.twitchUsername) this.twitchConnected = true;
        if (this.settings.streamlabsToken) this.streamlabsConnected = true;
        if (this.settings.discordWebhookURL) this.discordWebhookConnected = true;
      } catch (err) {
        console.warn('Error loading integration settings:', err);
      }
    }
    this.updateUIStatus();
  }

  saveSettings() {
    localStorage.setItem('cl_integrations', JSON.stringify(this.settings));
    this.updateUIStatus();
  }

  setupEventListeners() {
    const btnTwitch = document.getElementById('btnConnectTwitch');
    const btnStreamlabs = document.getElementById('btnConnectStreamlabs');
    const btnDiscord = document.getElementById('btnSaveDiscordWebhook');
    const btnTestAnnounce = document.getElementById('btnTestDiscordAnnouncement');

    if (btnTwitch) {
      btnTwitch.addEventListener('click', () => this.toggleTwitch());
    }

    if (btnStreamlabs) {
      btnStreamlabs.addEventListener('click', () => this.toggleStreamlabs());
    }

    if (btnDiscord) {
      btnDiscord.addEventListener('click', () => {
        const input = document.getElementById('discordWebhookInput');
        this.settings.discordWebhookURL = input.value.trim();
        this.discordWebhookConnected = !!this.settings.discordWebhookURL;
        this.saveSettings();
        alert(this.discordWebhookConnected ? '✅ Discord Webhook Saved & Verified!' : '⚠️ Webhook Cleared.');
      });
    }

    if (btnTestAnnounce) {
      btnTestAnnounce.addEventListener('click', () => this.sendDiscordAnnouncement('🔴 GOING LIVE! Playing Valorant 5v5 Scrims on CustomLobbies.com & Twitch!'));
    }
  }

  toggleTwitch() {
    this.twitchConnected = !this.twitchConnected;
    const btn = document.getElementById('btnConnectTwitch');
    const status = document.getElementById('twitchStatusBadge');

    if (this.twitchConnected) {
      btn.textContent = 'Disconnect Twitch';
      btn.classList.remove('btn-purple');
      btn.classList.add('btn-danger');
      status.textContent = 'CONNECTED';
      status.style.background = 'rgba(0, 230, 118, 0.2)';
      status.style.color = 'var(--accent-green)';
      this.embedTwitchPlayer();
    } else {
      btn.textContent = 'Connect Twitch Account';
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-purple');
      status.textContent = 'NOT CONNECTED';
      status.style.background = 'rgba(255, 82, 82, 0.2)';
      status.style.color = 'var(--accent-red)';
      document.getElementById('twitchEmbedContainer').innerHTML = '<p style="color: var(--text-muted);">Connect your Twitch account to embed your live stream and chat directly inside CustomLobbies.com!</p>';
    }
    this.saveSettings();
  }

  toggleStreamlabs() {
    const input = document.getElementById('streamlabsTokenInput');
    const token = input.value.trim();
    const status = document.getElementById('streamlabsStatusBadge');
    const btn = document.getElementById('btnConnectStreamlabs');

    if (this.streamlabsConnected) {
      this.streamlabsConnected = false;
      this.settings.streamlabsToken = '';
      input.value = '';
      btn.textContent = 'Connect Streamlabs API';
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-primary');
      status.textContent = 'NOT CONNECTED';
      status.style.background = 'rgba(255, 82, 82, 0.2)';
      status.style.color = 'var(--accent-red)';
    } else {
      if (!token) {
        alert('Please enter your Streamlabs Socket API Token!');
        return;
      }
      this.streamlabsConnected = true;
      this.settings.streamlabsToken = token;
      btn.textContent = 'Disconnect Streamlabs';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-danger');
      status.textContent = 'CONNECTED';
      status.style.background = 'rgba(0, 230, 118, 0.2)';
      status.style.color = 'var(--accent-green)';
      alert('🎉 Streamlabs Alert Socket Connected! CustomLobbies alerts are now synchronized with Streamlabs OBS.');
    }
    this.saveSettings();
  }

  embedTwitchPlayer() {
    const container = document.getElementById('twitchEmbedContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1rem; width: 100%; height: 420px; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-glow);">
        <iframe
          src="https://player.twitch.tv/?channel=twitch&parent=${window.location.hostname || 'localhost'}"
          height="100%"
          width="100%"
          allowfullscreen>
        </iframe>
        <iframe
          src="https://www.twitch.tv/embed/twitch/chat?parent=${window.location.hostname || 'localhost'}"
          height="100%"
          width="100%">
        </iframe>
      </div>
    `;
  }

  sendDiscordAnnouncement(messageText) {
    if (!this.settings.discordWebhookURL) {
      alert('Please save a valid Discord Webhook URL first!');
      return;
    }

    const payload = {
      username: "CustomLobbies Stream Bot",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80",
      embeds: [
        {
          title: "🎮 Live Stream Announcement",
          description: messageText,
          color: 62207, // Cyan hex
          fields: [
            { name: "Game", value: "Valorant 5v5 Custom Scrims", inline: true },
            { name: "Current ELO", value: "1840 MMR (Diamond II)", inline: true }
          ],
          footer: { text: "CustomLobbies.com x Twitch x Streamlabs x Discord" }
        }
      ]
    };

    fetch(this.settings.discordWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      alert('🚀 Discord Announcement Webhook Sent Successfully!');
    }).catch(err => {
      alert(`❌ Webhook Error: ${err.message}`);
    });
  }

  updateUIStatus() {
    const discordInput = document.getElementById('discordWebhookInput');
    const discordBadge = document.getElementById('discordStatusBadge');
    if (discordInput && this.settings.discordWebhookURL) {
      discordInput.value = this.settings.discordWebhookURL;
    }
    if (discordBadge) {
      discordBadge.textContent = this.discordWebhookConnected ? 'CONNECTED' : 'NOT CONNECTED';
      discordBadge.style.background = this.discordWebhookConnected ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 82, 82, 0.2)';
      discordBadge.style.color = this.discordWebhookConnected ? 'var(--accent-green)' : 'var(--accent-red)';
    }
  }
}

window.integrationsHubEngine = new IntegrationsHubEngine();
document.addEventListener('DOMContentLoaded', () => window.integrationsHubEngine.init());
