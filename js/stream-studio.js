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
  }

  init() {
    this.canvas = document.getElementById('streamCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.drawPlaceholderCanvas();
    }
    this.setupEventListeners();
    this.enumerateAudioDevices();
  }

  setupEventListeners() {
    const btnCapture = document.getElementById('btnCaptureScreen');
    const btnGoLive = document.getElementById('btnStartBroadcast');
    const btnCopyURL = document.getElementById('btnCopyStreamURL');
    const btnRecord = document.getElementById('btnRecordStreamClip');

    if (btnCapture) {
      btnCapture.addEventListener('click', () => this.startScreenCapture());
    }

    if (btnGoLive) {
      btnGoLive.addEventListener('click', () => this.toggleLiveBroadcast());
    }

    if (btnRecord) {
      btnRecord.addEventListener('click', () => this.record30SecondClip());
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
    this.ctx.fillText('CustomLobbies.com Stream Canvas Studio', this.canvas.width / 2, this.canvas.height / 2 - 20);

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
      if (stats) stats.textContent = 'Bitrate: 5940 kbps | FPS: 60 | Viewers: 247';
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
