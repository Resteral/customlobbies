// Live Streaming Hub & Creator Studio for CustomLobbies.com
class StreamsManager {
    constructor() {
        this.streams = [];
        this.activeStream = null;
        this.isBroadcasting = false;
        this.broadcastStream = null;
        this.simulatedChatInterval = null;
        this.chatMessages = [];
    }

    init(streamsData) {
        this.streams = streamsData || [];
        this.renderStreams();
    }

    renderStreams() {
        const container = document.getElementById('streamsGrid');
        if (!container) return;

        container.innerHTML = this.streams.map(stream => `
            <div class="stream-card glass-panel glow-hover animate-fade-in" onclick="streamsManager.openStreamPlayer('${stream.id}')">
                <div class="stream-thumb-wrap">
                    <img src="${stream.thumbnail}" alt="${escapeHtml(stream.title)}" class="stream-thumb-img" />
                    <span class="live-pill"><span class="pulse-dot"></span> LIVE</span>
                    <span class="viewer-count-pill">👁️ ${stream.viewers.toLocaleString()}</span>
                    <span class="uptime-pill">⏱️ ${stream.uptime}</span>
                </div>

                <div class="stream-card-body p-3">
                    <div class="flex items-start gap-3">
                        <img src="${stream.streamer.avatar}" alt="${escapeHtml(stream.streamer.username)}" class="streamer-avatar" />
                        <div class="flex-1 min-w-0">
                            <h3 class="stream-title truncate font-bold text-white">${escapeHtml(stream.title)}</h3>
                            <div class="streamer-meta text-xs text-muted mt-1">
                                <span class="font-medium text-neon-cyan">${escapeHtml(stream.streamer.username)}</span> • 
                                <span>${escapeHtml(stream.game)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="stream-tags-row mt-2 flex flex-wrap gap-1">
                        ${stream.tags.map(t => `<span class="badge badge-dark text-xs">#${escapeHtml(t)}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    openStreamPlayer(streamId) {
        soundManager.playClick();
        const stream = this.streams.find(s => s.id === streamId);
        if (!stream) return;

        this.activeStream = stream;
        const modal = document.getElementById('streamPlayerModal');
        if (!modal) return;

        document.getElementById('playerStreamTitle').innerText = stream.title;
        document.getElementById('playerStreamerName').innerText = stream.streamer.username;
        document.getElementById('playerStreamerAvatar').src = stream.streamer.avatar;
        document.getElementById('playerGameName').innerText = stream.game;
        document.getElementById('playerViewerCount').innerText = stream.viewers.toLocaleString() + ' viewers';

        const videoPlayer = document.getElementById('mainStreamVideo');
        if (videoPlayer) {
            videoPlayer.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
            videoPlayer.play().catch(e => console.log('Autoplay prevented:', e));
        }

        // Initialize Stream Chat
        this.chatMessages = [
            { user: 'CyberNinja', text: 'THAT CLUTCH WAS INSANE 🔥', time: 'Just now' },
            { user: 'ViperMain_00', text: 'Let me in the next 5s publicity vote lobby!!', time: 'Just now' },
            { user: 'PixelGamer', text: 'ggs in the chat boys 🚀', time: 'Just now' }
        ];
        this.renderStreamChat();
        this.startSimulatedChat();

        app.openModal('streamPlayerModal');
    }

    renderStreamChat() {
        const container = document.getElementById('streamChatBox');
        if (!container) return;

        container.innerHTML = this.chatMessages.map(msg => `
            <div class="chat-msg-row">
                <span class="chat-user font-bold text-neon-cyan">${escapeHtml(msg.user)}:</span>
                <span class="chat-text text-gray-200">${escapeHtml(msg.text)}</span>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }

    sendStreamChatMessage() {
        const input = document.getElementById('streamChatInput');
        if (!input || !input.value.trim()) return;

        const msgText = input.value.trim();
        this.chatMessages.push({
            user: app.currentUser.username,
            text: msgText,
            time: 'Now'
        });
        input.value = '';
        soundManager.playClick();
        this.renderStreamChat();
    }

    sendStreamReaction(emoji) {
        soundManager.playClick();
        this.chatMessages.push({
            user: app.currentUser.username,
            text: `${emoji} ${emoji} ${emoji}`,
            time: 'Now'
        });
        this.renderStreamChat();
        app.showFloatingReaction(emoji);
    }

    startSimulatedChat() {
        clearInterval(this.simulatedChatInterval);
        const randomUsers = ['AcesHigh', 'HeadshotQueen', 'ShadowStalker', 'ClutchLord', 'VortexPro', 'RogueBlade'];
        const randomQuotes = [
            'Sheesh that aim is crispy! 🎯',
            'Can we get a lobby invite?',
            'CustomLobbies.com is the cleanest platform hands down',
            '5-second vote gate is the greatest idea ever lmao',
            'VOTE YES on the knock queue!!',
            'W streamer 👑',
            'Let\'s goooooooo 🔥🔥🔥'
        ];

        this.simulatedChatInterval = setInterval(() => {
            if (!this.activeStream) return;
            const randUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
            const randText = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
            this.chatMessages.push({
                user: randUser,
                text: randText,
                time: 'Now'
            });
            if (this.chatMessages.length > 25) this.chatMessages.shift();
            this.renderStreamChat();
        }, 3500);
    }

    // ==========================================
    // CREATOR STUDIO: GO LIVE (Screen/Camera)
    // ==========================================

    openGoLiveModal() {
        soundManager.playClick();
        app.openModal('goLiveModal');
    }

    async startBroadcasting() {
        soundManager.playClick();
        const title = document.getElementById('broadcastTitleInput').value.trim() || `${app.currentUser.username}'s Live Customs`;
        const game = document.getElementById('broadcastGameSelect').value || 'Valorant';
        const source = document.querySelector('input[name="streamSource"]:checked')?.value || 'camera';

        let streamSourceTrack = null;
        try {
            if (source === 'screen' && navigator.mediaDevices.getDisplayMedia) {
                this.broadcastStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            } else if (navigator.mediaDevices.getUserMedia) {
                this.broadcastStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            }
        } catch (err) {
            console.warn('Could not acquire real media capture:', err);
        }

        const newLiveStream = {
            id: 'stream_' + Date.now(),
            title: `🔴 ${title}`,
            streamer: {
                id: app.currentUser.id,
                username: app.currentUser.username,
                avatar: app.currentUser.avatar,
                followers: '1.2K'
            },
            game: game,
            viewers: 1,
            thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80',
            isLive: true,
            tags: ['LiveHost', 'CustomLobby', '5sVote'],
            uptime: 'Just started'
        };

        this.streams.unshift(newLiveStream);
        this.renderStreams();
        app.closeModal('goLiveModal');

        soundManager.playVoteApproved();
        app.showToast('🚀 YOU ARE LIVE! Broadcasting to CustomLobbies network...', 'success');
        this.openStreamPlayer(newLiveStream.id);
    }
}

const streamsManager = new StreamsManager();
