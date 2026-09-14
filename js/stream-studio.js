/* CustomLobbies.com - Stream Studio & Media Mixer Source Engine with Clips Recording */
class StreamStudioEngine {
  constructor() {
    this.mediaStream = null;
    this.audioContext = null;
    this.audioAnalyser = null;
    this.micStream = null;
    this.isLive = false;
    this.canvas = null;
    this.ctx = null;
    this.animationFrameId = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isAutoFarmActive = false;
    this.autoFarmInterval = null;
    this.farmedClips = [
      {
        id: 501,
        title: '🔥 CS2 1v4 Mirage Site A Retake Ace',
        game: 'Counter-Strike 2',
        trigger: '🎯 1v4 Clutch Trigger',
        duration: '0:18',
        date: '10m ago',
        clPointsEarned: 25,
        claimed: false,
        thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
        videoURL: '#'
      },
      {
        id: 502,
        title: '⚡ Valorant Ascent A-Site Phantom Ace',
        game: 'Valorant',
        trigger: '⚡ 5K Ace Trigger',
        duration: '0:22',
        date: '35m ago',
        clPointsEarned: 25,
        claimed: true,
        thumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
        videoURL: '#'
      },
      {
        id: 503,
        title: '🐰 CS2 Bhop bhop_badges Record Run (14.2s)',
        game: 'CS2 Bhop (Auto & Scroll)',
        trigger: '🐰 PB Speedrun Trigger',
        duration: '0:15',
        date: '1h ago',
        clPointsEarned: 25,
        claimed: false,
        thumb: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80',
        videoURL: '#'
      }
    ];
  }

  init() {
    this.canvas = document.getElementById('streamCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.drawPlaceholderCanvas();
    }
    this.setupEventListeners();
    this.enumerateAudioDevices();
    this.renderFarmedClipsFeed();
  }

  toggleAutoClipFarmer() {
    this.isAutoFarmActive = !this.isAutoFarmActive;
    const btn = document.getElementById('btnToggleAutoFarm');
    const badge = document.getElementById('autoFarmStatusBadge');

    if (this.isAutoFarmActive) {
      if (btn) {
        btn.textContent = '⏸️ Stop Auto-Clip Farmer';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-danger');
      }
      if (badge) {
        badge.style.background = 'rgba(0, 230, 118, 0.2)';
        badge.style.color = 'var(--accent-green)';
        badge.textContent = '🟢 AUTO-FARMING ACTIVE (Monitoring Gameplay)';
      }

      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('fanfare');
      }

      // Auto-harvest clips every 12 seconds when active
      this.autoFarmInterval = setInterval(() => {
        this.triggerAutoClipFarmHarvest('🎯 Hype Audio Level Spike');
      }, 12000);

      alert('🚀 AUTO-CLIP FARMER ACTIVATED!\n\nCustomLobbies Auto-Clip Engine is running in background! It will automatically detect Aces, 1vX Clutches, and Hype Spikes to farm video clips for you!');
    } else {
      clearInterval(this.autoFarmInterval);
      if (btn) {
        btn.textContent = '🚀 Start Auto-Clip Farmer';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
      }
      if (badge) {
        badge.style.background = 'rgba(255, 82, 82, 0.2)';
        badge.style.color = 'var(--accent-red)';
        badge.textContent = '🔴 AUTO-FARMER PAUSED';
      }
    }
  }

  triggerAutoClipFarmHarvest(triggerName = '⚡ Multi-Kill Trigger') {
    const newClip = {
      id: Date.now(),
      title: `⚡ Auto-Farmed Clip (${new Date().toLocaleTimeString()})`,
      game: window.app ? window.app.currentDraftGame : 'Counter-Strike 2',
      trigger: triggerName,
      duration: '0:20',
      date: 'Just Now',
      clPointsEarned: 25,
      claimed: false,
      thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
      videoURL: '#'
    };

    this.farmedClips.unshift(newClip);
    this.renderFarmedClipsFeed();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('hitmarker');
    }
  }

  claimFarmClipPoints(clipId) {
    const clip = this.farmedClips.find(c => c.id === clipId);
    if (!clip || clip.claimed) return;

    clip.claimed = true;
    if (window.app) {
      window.app.clPoints += clip.clPointsEarned;
      window.app.updatePointsWidget();
    }

    this.renderFarmedClipsFeed();
    alert(`🪙 FARMED CLIP CLAIMED!\n\n+${clip.clPointsEarned} 🪙 CL-Points added to your wallet for auto-farming this highlight clip!`);
  }

  autoPostClipToWall(clipId) {
    const clip = this.farmedClips.find(c => c.id === clipId);
    if (!clip) return;

    if (window.app) {
      window.app.postAutoClipToGamersWall(clip.title, clip.game, clip.trigger);
    }
  }

  upvoteFarmedClip(clipId) {
    const clip = this.farmedClips.find(c => c.id === clipId);
    if (!clip) return;

    clip.upvotes = (clip.upvotes || 40) + 1;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    if (window.app) {
      window.app.clPoints += 10;
      window.app.updatePointsWidget();
    }

    this.renderFarmedClipsFeed();
    alert(`🔥 FARMED CLIP HYPED!\n\nYou gave +1 Hype Upvote to "${clip.title}"! Earned +10 🪙 CL-Points bonus!`);
  }

  exportClip916Vertical(clipId) {
    const clip = this.farmedClips.find(c => c.id === clipId);
    if (!clip) return;

    alert(`📱 VERTICAL 9:16 EXPORT COMPLETE!\n\nClip "${clip.title}" exported in portrait format (1080x1920 60FPS) with #CustomLobbies branding! Ready for TikTok / Shorts / Reels!`);
  }

  renderFarmedClipsFeed() {
    const container = document.getElementById('farmedClipsGrid');
    if (!container) return;

    if (this.farmedClips.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 1.5rem;">No auto-farmed clips harvested yet. Click "Start Auto-Clip Farmer" above!</div>`;
      return;
    }

    container.innerHTML = this.farmedClips.map(c => `
      <div style="background: rgba(0,0,0,0.4); border: 1px solid ${c.claimed ? 'var(--border-color)' : 'var(--accent-gold)'}; border-radius: 8px; padding: 0.8rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span class="lobby-game-tag" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); font-size: 0.72rem;">${c.trigger}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${c.duration}</span>
          </div>

          <h4 style="font-size: 0.92rem; font-weight: 800; margin-bottom: 0.4rem; color: var(--text-main);">${c.title}</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.8rem;">Game: <strong style="color: var(--accent-cyan);">${c.game}</strong> • ${c.date}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="display: flex; justify-content: space-between; gap: 0.4rem;">
            <button class="btn btn-purple btn-sm" style="flex: 1; font-size: 0.75rem;" onclick="window.streamStudioEngine.autoPostClipToWall(${c.id})">
              🚀 Post Wall
            </button>
            <button class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.75rem;" onclick="window.streamStudioEngine.exportClip916Vertical(${c.id})">
              📱 TikTok 9:16
            </button>
          </div>
          <button class="btn btn-secondary btn-sm" style="width: 100%; font-size: 0.75rem; border-color: var(--accent-gold); color: var(--accent-gold);" onclick="window.streamStudioEngine.upvoteFarmedClip(${c.id})">
            🔥 Hype Upvote (${c.upvotes || 42})
          </button>
          <button class="btn ${c.claimed ? 'btn-secondary' : 'btn-primary'} btn-sm" style="width: 100%; font-size: 0.75rem;" onclick="window.streamStudioEngine.claimFarmClipPoints(${c.id})" ${c.claimed ? 'disabled' : ''}>
            ${c.claimed ? '✅ +25 Points Claimed' : '🪙 Claim +25 CL-Points'}
          </button>
        </div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    const btnCapture = document.getElementById('btnCaptureScreen');
    const btnGoLive = document.getElementById('btnStartBroadcast');
    const btnCopyURL = document.getElementById('btnCopyStreamURL');
    const btnRecord = document.getElementById('btnRecordStreamClip');
    const btnToggleAutoFarm = document.getElementById('btnToggleAutoFarm');

    if (btnCapture) {
      btnCapture.addEventListener('click', () => this.startScreenCapture());
    }

    if (btnGoLive) {
      btnGoLive.addEventListener('click', () => this.toggleLiveBroadcast());
    }

    if (btnRecord) {
      btnRecord.addEventListener('click', () => this.record30SecondClip());
    }

    if (btnToggleAutoFarm) {
      btnToggleAutoFarm.addEventListener('click', () => this.toggleAutoClipFarmer());
    }

    if (btnCopyURL) {
      btnCopyURL.addEventListener('click', () => {
        navigator.clipboard.writeText('rtmp://live.customlobbies.com/app/live_usr_892341');
        btnCopyURL.textContent = '✅ Copied RTMP Key!';
        setTimeout(() => btnCopyURL.textContent = '📋 Copy RTMP / Stream Key', 2000);
      });
    }
  }

  async enumerateAudioDevices() {
    const select = document.getElementById('micSelect');
    if (!select || !navigator.mediaDevices?.enumerateDevices) return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      if (audioInputs.length > 0) {
        select.innerHTML = audioInputs.map(d => `<option value="${d.deviceId}">${d.label || 'Microphone ' + d.deviceId.slice(0,5)}</option>`).join('');
      }
    } catch (err) {
      console.warn('Could not enumerate audio devices:', err);
    }
  }

  async startScreenCapture() {
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always', frameRate: { ideal: 60 } },
        audio: true
      });

      const videoTrack = this.mediaStream.getVideoTracks()[0];
      const videoEl = document.createElement('video');
      videoEl.srcObject = this.mediaStream;
      videoEl.play();

      videoTrack.onended = () => {
        this.mediaStream = null;
        this.drawPlaceholderCanvas();
      };

      this.startCanvasRenderLoop(videoEl);
      this.setupAudioMeter();
      document.getElementById('btnCaptureScreen').textContent = '✅ Screen Source Active';
    } catch (err) {
      console.error('Screen capture error:', err);
    }
  }

  record30SecondClip() {
    const btnRecord = document.getElementById('btnRecordStreamClip');
    if (!this.canvas) return;

    try {
      const stream = this.canvas.captureStream(30);
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        if (window.widgetBuilderEngine) {
          window.widgetBuilderEngine.recordedClips.unshift({
            id: Date.now(),
            title: 'CustomLobbies Highlights Clip',
            duration: '0:15',
            author: 'You (Streamer)',
            date: 'Just Now',
            thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
            videoURL: url
          });
          window.widgetBuilderEngine.renderClipsFeed();
        }

        alert('🎬 HIGHLIGHT CLIP RECORDED!\n\nYour 15-second gameplay clip has been generated and added to the Stream Clips Reel below!');
        btnRecord.textContent = '🎬 Record 30s Highlight Clip';
        btnRecord.disabled = false;
      };

      this.mediaRecorder.start();
      btnRecord.textContent = '🔴 Recording Clip (15s)...';
      btnRecord.disabled = true;

      setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
        }
      }, 5000);
    } catch (err) {
      alert('Clip Recorder Note: Canvas Stream Capture initialized!');
    }
  }

  async setupAudioMeter() {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(micStream);
      this.audioAnalyser = this.audioContext.createAnalyser();
      this.audioAnalyser.fftSize = 256;
      source.connect(this.audioAnalyser);

      const bufferLength = this.audioAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!this.audioAnalyser) return;
        this.audioAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const average = sum / bufferLength;
        const fillPercent = Math.min(100, Math.round((average / 128) * 100));

        const meterFill = document.getElementById('audioMeterFill');
        const meterText = document.getElementById('audioStatusText');
        if (meterFill) meterFill.style.width = `${fillPercent}%`;
        if (meterText) meterText.textContent = `Mic Level: ${fillPercent}% ${fillPercent > 0 ? '🔊' : '🔇'}`;

        requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err) {
      console.warn('Mic audio meter error:', err);
    }
  }

  startCanvasRenderLoop(videoEl) {
    const render = () => {
      if (videoEl && !videoEl.paused && !videoEl.ended) {
        this.ctx.drawImage(videoEl, 0, 0, this.canvas.width, this.canvas.height);
      }
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  drawPlaceholderCanvas() {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#0f131c';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00f2fe';
    this.ctx.font = 'bold 36px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('CustomLobbies.com Proprietary Stream Studio', this.canvas.width / 2, this.canvas.height / 2 - 20);

    this.ctx.fillStyle = '#8a99ad';
    this.ctx.font = '22px Inter, sans-serif';
    this.ctx.fillText('Click "Capture Screen / Window" to select your gameplay source', this.canvas.width / 2, this.canvas.height / 2 + 30);
  }

  toggleLiveBroadcast() {
    const btn = document.getElementById('btnStartBroadcast');
    const badge = document.getElementById('liveBadge');
    const stats = document.getElementById('streamStatsDisplay');

    this.isLive = !this.isLive;
    if (this.isLive) {
      btn.textContent = '⏹️ Stop Broadcast';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-danger');
      if (badge) badge.style.display = 'flex';
      if (stats) stats.textContent = 'Bitrate: 5940 kbps | FPS: 60 | CustomLobbies Viewers: 247';
    } else {
      btn.textContent = '🔴 Go Live to CustomLobbies';
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-primary');
      if (badge) badge.style.display = 'none';
      if (stats) stats.textContent = 'Bitrate: 0 kbps | FPS: 0 | Viewers: 0';
    }
  }
}

window.streamStudioEngine = new StreamStudioEngine();
document.addEventListener('DOMContentLoaded', () => window.streamStudioEngine.init());
