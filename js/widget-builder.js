/* CustomLobbies.com - Widget Studio, Soundboard & Stream Clips Engine */
class WidgetBuilderEngine {
  constructor() {
    this.audioCtx = null;
    this.recordedClips = [
      { id: 1, title: 'CS2 1v4 Clutch Mirage Ace', duration: '0:24', author: 'ApexGod99', date: 'Just Now', upvotes: 38, thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80' },
      { id: 2, title: 'Valorant Radiant Headshot Spray', duration: '0:18', author: 'Valkyrie_CS', date: '2h ago', upvotes: 24, thumb: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80' }
    ];
  }

  init() {
    this.setupEventListeners();
    this.renderClipsFeed();
  }

  upvoteClip(clipId) {
    const clip = this.recordedClips.find(c => c.id === clipId);
    if (!clip) return;

    clip.upvotes = (clip.upvotes || 0) + 1;
    this.playSoundEffect('fanfare');

    if (window.app) {
      window.app.clPoints += 10;
      window.app.updatePointsWidget();
    }

    this.renderClipsFeed();
    alert(`🔥 CLIP HYPED!\n\nYou gave +1 Hype Upvote to "${clip.title}"! Earned +10 🪙 CL-Points bonus!`);
  }

  setupEventListeners() {
    const btnFollow = document.getElementById('btnTestFollowAlert');
    const btnSub = document.getElementById('btnTestSubAlert');
    const btnCopyOBS = document.getElementById('btnCopyOBSLink');

    if (btnFollow) {
      btnFollow.addEventListener('click', () => this.triggerAlert('NightHawk99', 'follower'));
    }

    if (btnSub) {
      btnSub.addEventListener('click', () => this.triggerAlert('ViperQueen', 'subscriber'));
    }

    if (btnCopyOBS) {
      btnCopyOBS.addEventListener('click', () => {
        const input = document.getElementById('obsOverlayURL');
        navigator.clipboard.writeText(input.value);
        btnCopyOBS.textContent = '✅ Copied!';
        setTimeout(() => btnCopyOBS.textContent = 'Copy Link', 2000);
      });
    }

    // Soundboard Button Listeners
    document.addEventListener('click', (e) => {
      const soundBtn = e.target.closest('[data-sound]');
      if (soundBtn) {
        const soundType = soundBtn.getAttribute('data-sound');
        this.playSoundEffect(soundType);
      }
    });

    // Input change handlers
    const colorPicker = document.getElementById('alertColorPicker');
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        document.getElementById('alertBoxPreview').style.borderColor = e.target.value;
      });
    }
  }

  getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioCtx;
  }

  playSoundEffect(soundType) {
    try {
      if (soundType === 'lobby_start' || soundType === 'match_found' || soundType === 'accept_match' || soundType === 'lobby_created') {
        const audio = new Audio('audio/lobby_start.wav');
        audio.play().catch(err => console.warn('Custom audio playback issue:', err));
        return;
      }

      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (soundType === 'airhorn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(466.16, now); // Bb4
        osc.frequency.setValueAtTime(466.16, now + 0.15);
        osc.frequency.setValueAtTime(622.25, now + 0.25); // Eb5
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (soundType === 'hitmarker') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (soundType === 'ggwp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.setValueAtTime(329.63, now + 0.12); // E4
        osc.frequency.setValueAtTime(392.00, now + 0.24); // G4
        osc.frequency.setValueAtTime(523.25, now + 0.36); // C5
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (soundType === 'cheer') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (soundType === 'match_found') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.15); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.3); // D6
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (soundType === 'accept_match') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (soundType === 'fanfare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        osc.frequency.setValueAtTime(659.25, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (err) {
      console.warn('Sound effect error:', err);
    }
  }

  triggerAlert(username, type) {
    const alertBox = document.getElementById('alertBoxPreview');
    const titleEl = document.getElementById('previewAlertTitle');
    const textEl = document.getElementById('previewAlertText');

    if (type === 'follower') {
      titleEl.textContent = '🎉 NEW FOLLOWER!';
      textEl.textContent = `${username} just followed the stream!`;
      this.playSoundEffect('synth');
    } else {
      titleEl.textContent = '⭐ NEW SUBSCRIBER!';
      textEl.textContent = `${username} subscribed at Tier 3 (6 Months)!`;
      this.playSoundEffect('fanfare');
    }

    if (window.firebaseGoogleEngine) {
      window.firebaseGoogleEngine.speakTextAlert(`${username} ${type === 'follower' ? 'just followed the stream' : 'subscribed at Tier 3'}`);
    }

    alertBox.classList.add('trigger-alert');
    setTimeout(() => {
      alertBox.classList.remove('trigger-alert');
    }, 3500);
  }

  renderClipsFeed() {
    const grid = document.getElementById('streamClipsGrid');
    if (!grid) return;

    grid.innerHTML = this.recordedClips.map(c => `
      <div class="card" style="padding: 0.8rem; overflow: hidden; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 0.6rem;">
            <img src="${c.thumb}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" alt="Clip">
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">${c.duration}</div>
            <button class="btn btn-primary btn-sm" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; width: 44px; height: 44px; padding: 0;" onclick="alert('▶️ Playing clip: ${c.title}')">▶</button>
          </div>
          <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.2rem;">${c.title}</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem;">Clipped by <strong style="color: var(--accent-cyan);">${c.author}</strong> • ${c.date}</p>
        </div>

        <button class="btn btn-purple btn-sm" style="width: 100%;" onclick="window.widgetBuilderEngine.upvoteClip(${c.id})">
          🔥 Upvote Clip (${c.upvotes || 0})
        </button>
      </div>
    `).join('');
  }
}

window.widgetBuilderEngine = new WidgetBuilderEngine();
document.addEventListener('DOMContentLoaded', () => window.widgetBuilderEngine.init());
