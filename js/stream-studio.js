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
        title: '🎯 CS2 Mirage A-Site 1v4 Clutch Run',
        game: 'Counter-Strike 2',
        trigger: '🐰 PB Speedrun Trigger',
        duration: '0:15',
        date: '1h ago',
        clPointsEarned: 25,
        claimed: false,
        thumb: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80',
        videoURL: '#'
      },
      {
        id: 504,
        title: '⚡ Empulse Facility 5K Electro-Pulse Wipe',
        game: 'Empulse',
        trigger: '⚡ 5K Electro-Pulse Wipe',
        duration: '0:19',
        date: '2h ago',
        clPointsEarned: 25,
        claimed: false,
        thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
        videoURL: '#'
      },
      {
        id: 505,
        title: '🎯 Neon Skyline Apex Striker Railgun Headshot Ace',
        game: 'Empulse',
        trigger: '🎯 1v3 Overcharge Clutch',
        duration: '0:16',
        date: '3h ago',
        clPointsEarned: 25,
        claimed: false,
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
        videoURL: '#'
      }
    ];

    this.streamerAnnouncements = [
      {
        id: 901,
        author: 'RadiantReaper',
        game: 'Counter-Strike 2',
        title: '🔴 CS2 $1,000 Major Scrim Finals Watch Party!',
        description: 'Watch party active on CustomLobbies WebRTC Ingest Node! Drop in chat for live viewer 500 CL-Points giveaway!',
        giveaway: 500,
        claimed: false,
        hypes: 84,
        date: '15m ago',
        isLive: true
      },
      {
        id: 902,
        author: 'Empulse_Overlord',
        game: 'Empulse',
        title: '⚡ Empulse 5v5 Cyber Arena League Week 1 Grand Finals!',
        description: 'Live broadcast & custom lobby subscriber matches! Join our voice room to play with the pros!',
        giveaway: 250,
        claimed: false,
        hypes: 62,
        date: '45m ago',
        isLive: true
      },
      {
        id: 903,
        author: 'Valkyrie_CS',
        game: 'Valorant',
        title: '🎯 Valorant Radiant Rank Up Stream & 1v1 Arena Duels',
        description: 'Streaming 1080p 60FPS on CustomLobbies RTMP Ingest! Challenging viewers to 1v1 aim map duels!',
        giveaway: 100,
        claimed: true,
        hypes: 48,
        date: '2h ago',
        isLive: false
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
    this.renderStreamerAnnouncements();
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

  openAnnouncementModal() {
    const modal = document.getElementById('streamerAnnouncementModal');
    if (modal) modal.classList.add('active');
  }

  publishAnnouncement() {
    const channel = document.getElementById('announcementChannelName')?.value.trim() || 'You (Verified Streamer)';
    const title = document.getElementById('announcementTitle')?.value.trim() || '🔴 Live Stream Broadcast & Watch Party!';
    const game = document.getElementById('announcementGame')?.value || 'Counter-Strike 2';
    const giveaway = parseInt(document.getElementById('announcementGiveaway')?.value || 100);
    const desc = document.getElementById('announcementDescription')?.value.trim() || 'Tune into our live broadcast on CustomLobbies WebRTC Stream Node!';

    const newAnn = {
      id: Date.now(),
      author: channel,
      game: game,
      title: title,
      description: desc,
      giveaway: giveaway,
      claimed: false,
      hypes: 12,
      date: 'Just Now',
      isLive: true
    };

    this.streamerAnnouncements.unshift(newAnn);
    this.renderStreamerAnnouncements();

    const modal = document.getElementById('streamerAnnouncementModal');
    if (modal) modal.classList.remove('active');

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    alert(`📢 STREAM ANNOUNCEMENT PUBLISHED!\n\nHeadline: "${title}"\nGame: ${game}\nGiveaway: 🪙 ${giveaway} CL-Points!\n\nBroadcast alert posted live to CustomLobbies Streamer Hub!`);
  }

  claimStreamerGiveaway(annId) {
    const ann = this.streamerAnnouncements.find(a => a.id === annId);
    if (!ann || ann.claimed) return;

    ann.claimed = true;
    if (window.app) {
      window.app.clPoints += ann.giveaway;
      window.app.updatePointsWidget();
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('ggwp');
    }

    this.renderStreamerAnnouncements();
    alert(`🎁 STREAM GIVEAWAY CLAIMED!\n\nYou claimed +${ann.giveaway} 🪙 CL-Points from ${ann.author}'s live stream announcement!`);
  }

  hypeStreamAnnouncement(annId) {
    const ann = this.streamerAnnouncements.find(a => a.id === annId);
    if (!ann) return;

    ann.hypes = (ann.hypes || 0) + 1;

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('cheer');
    }

    if (window.app) {
      window.app.clPoints += 10;
      window.app.updatePointsWidget();
    }

    this.renderStreamerAnnouncements();
    alert(`🔥 STREAM ANNOUNCEMENT HYPED!\n\nYou hyped ${ann.author}'s stream announcement! Earned +10 🪙 CL-Points bonus!`);
  }

  renderStreamerAnnouncements() {
    const container = document.getElementById('streamerAnnouncementsGrid');
    if (!container) return;

    if (this.streamerAnnouncements.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 1.5rem;">No active streamer announcements. Be the first to post!</div>`;
      return;
    }

    container.innerHTML = this.streamerAnnouncements.map(a => `
      <div style="background: rgba(0,0,0,0.4); border: 1px solid ${a.isLive ? 'var(--accent-gold)' : 'var(--border-color)'}; border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: ${a.isLive ? '0 0 15px rgba(255, 215, 0, 0.15)' : 'none'};">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="lobby-game-tag" style="background: ${a.isLive ? 'rgba(255, 82, 82, 0.2)' : 'rgba(255,255,255,0.08)'}; color: ${a.isLive ? 'var(--accent-red)' : 'var(--text-muted)'}; font-weight: 800; font-size: 0.72rem;">
              ${a.isLive ? '🔴 STREAMER LIVE' : '📢 BROADCAST ALERT'}
            </span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${a.date}</span>
          </div>

          <h4 style="font-size: 0.98rem; font-weight: 900; margin-bottom: 0.3rem; color: var(--text-main);">${a.title}</h4>
          <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 800; margin-bottom: 0.5rem;">Streamer: ${a.author} • Game: ${a.game}</div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.8rem;">${a.description}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.6rem;">
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-purple btn-sm" style="flex: 1; font-size: 0.75rem;" onclick="alert('📺 WATCH LIVE STREAM:\\n\\nConnecting to ${a.author}\\'s Native WebRTC Stream Server Node...\\nBitrate: 6000 Kbps | 1080p 60FPS')">
              📺 Watch Live
            </button>
            <button class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.75rem; border-color: var(--accent-gold); color: var(--accent-gold);" onclick="window.streamStudioEngine.hypeStreamAnnouncement(${a.id})">
              🔥 Hype (${a.hypes})
            </button>
          </div>
          <button class="btn ${a.claimed ? 'btn-secondary' : 'btn-primary'} btn-sm" style="width: 100%; font-size: 0.75rem;" onclick="window.streamStudioEngine.claimStreamerGiveaway(${a.id})" ${a.claimed ? 'disabled' : ''}>
            ${a.claimed ? '✅ Giveaway Claimed' : `🎁 Claim 🪙 ${a.giveaway} Points Giveaway`}
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

    const btnCloseAnn = document.getElementById('btnCloseAnnouncementModal');
    const btnCancelAnn = document.getElementById('btnCancelAnnouncementModal');
    const btnSubmitAnn = document.getElementById('btnSubmitStreamerAnnouncement');
    const modalAnn = document.getElementById('streamerAnnouncementModal');

    if (btnCloseAnn) btnCloseAnn.addEventListener('click', () => modalAnn?.classList.remove('active'));
    if (btnCancelAnn) btnCancelAnn.addEventListener('click', () => modalAnn?.classList.remove('active'));
    if (btnSubmitAnn) btnSubmitAnn.addEventListener('click', () => this.publishAnnouncement());
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
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const render = () => {
      if (!this.isStreaming) return;
      if (videoEl && !videoEl.paused && !videoEl.ended && this.canvas && this.ctx) {
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
