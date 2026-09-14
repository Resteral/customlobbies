/* CustomLobbies.com - Community Chat & WebRTC Voice Channels Manager */
class ChatVoiceManager {
  constructor() {
    this.currentTextChannel = 'general';
    this.currentVoiceRoom = null;
    this.isMicMuted = false;
    this.isDeafened = false;
    this.creatingChannelType = 'text';

    this.textMessages = {
      'general': [
        { id: 1, author: 'ApexGod99', text: 'Anyone hosting 5v5 CS2 scrims tonight?', time: '7:42 PM', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' },
        { id: 2, author: 'ShadowNinja', text: 'Queue up on quick queue! Need 2 more high Diamond players.', time: '7:44 PM', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80' }
      ],
      'lfg-cs2': [
        { id: 3, author: 'Valkyrie_CS', text: 'LFG 5v5 Mirage/Inferno. 1900+ MMR only.', time: '7:30 PM', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' }
      ],
      'lfg-valorant': [
        { id: 4, author: 'RadiantReaper', text: 'Need a Controller main for Ascent lobby!', time: '7:15 PM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' }
      ],
      'tournaments': [
        { id: 5, author: 'CustomLobbiesBot', text: '🏆 Weekly $500 5v5 Tournament registrations open tomorrow at 12:00 PM EST!', time: '6:00 PM', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ],
      'stream-showcase': [
        { id: 6, author: 'ProStreamer', text: 'Live testing out the new Follower Alert widgets! Come check it out: customlobbies.com/prostreamer', time: '5:50 PM', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80' }
      ]
    };

    this.onlineUsers = [
      { name: 'ApexGod99', mmr: 2150, status: 'Online' },
      { name: 'ShadowNinja', mmr: 1920, status: 'In Game' },
      { name: 'Valkyrie_CS', mmr: 1840, status: 'Streaming' },
      { name: 'RadiantReaper', mmr: 2540, status: 'Online' },
      { name: 'ProSniper_2026', mmr: 1450, status: 'In Queue' }
    ];
  }

  init() {
    this.renderMessages();
    this.renderOnlineUsers();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Channel selection clicks
    document.addEventListener('click', (e) => {
      const textItem = e.target.closest('[data-channel]');
      if (textItem) {
        const chan = textItem.getAttribute('data-channel');
        this.switchTextChannel(chan, textItem);
      }

      const voiceItem = e.target.closest('[data-voice]');
      if (voiceItem) {
        const vroom = voiceItem.getAttribute('data-voice');
        this.selectVoiceRoom(vroom);
      }
    });

    // Chat form submit
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chatInputText');
        const text = input.value.trim();
        if (text) {
          this.sendMessage(text);
          input.value = '';
        }
      });
    }

    // Modal Create Channel Buttons
    const btnAddText = document.getElementById('btnAddTextChannel');
    const btnAddVoice = document.getElementById('btnAddVoiceChannel');
    const modal = document.getElementById('createChannelModal');
    const btnCloseModal = document.getElementById('btnCloseChannelModal');
    const btnSubmitModal = document.getElementById('btnSubmitNewChannel');

    if (btnAddText) {
      btnAddText.addEventListener('click', () => {
        this.creatingChannelType = 'text';
        document.getElementById('channelModalTitle').textContent = 'Create Text Channel';
        modal.classList.add('active');
      });
    }

    if (btnAddVoice) {
      btnAddVoice.addEventListener('click', () => {
        this.creatingChannelType = 'voice';
        document.getElementById('channelModalTitle').textContent = 'Create Voice Channel Room';
        modal.classList.add('active');
      });
    }

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (btnSubmitModal) {
      btnSubmitModal.addEventListener('click', () => this.handleCreateChannel());
    }

    // Voice Control Buttons
    const btnConnect = document.getElementById('btnConnectVoice');
    const btnMic = document.getElementById('btnToggleMic');
    const btnDeafen = document.getElementById('btnToggleDeafen');

    if (btnConnect) {
      btnConnect.addEventListener('click', () => this.toggleVoiceConnection());
    }

    if (btnMic) {
      btnMic.addEventListener('click', () => {
        this.isMicMuted = !this.isMicMuted;
        document.getElementById('micIcon').textContent = this.isMicMuted ? '🔇' : '🎙️';
        btnMic.classList.toggle('btn-danger', this.isMicMuted);
      });
    }

    if (btnDeafen) {
      btnDeafen.addEventListener('click', () => {
        this.isDeafened = !this.isDeafened;
        document.getElementById('deafenIcon').textContent = this.isDeafened ? '🔇' : '🎧';
        btnDeafen.classList.toggle('btn-danger', this.isDeafened);
      });
    }
  }

  switchTextChannel(channelName, element) {
    this.currentTextChannel = channelName;
    document.querySelectorAll('[data-channel]').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');

    document.getElementById('currentChannelHeader').textContent = `# ${channelName}`;
    document.getElementById('currentChannelTopic').textContent = `Discussion and chat for #${channelName}`;
    document.getElementById('chatInputText').placeholder = `Send a message to #${channelName}...`;

    this.renderMessages();
  }

  sendMessage(text) {
    if (!this.textMessages[this.currentTextChannel]) {
      this.textMessages[this.currentTextChannel] = [];
    }

    const newMsg = {
      id: Date.now(),
      author: 'You (Host)',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&auto=format&fit=crop&q=80'
    };

    this.textMessages[this.currentTextChannel].push(newMsg);
    this.renderMessages();
  }

  renderMessages() {
    const container = document.getElementById('chatMessagesBox');
    if (!container) return;

    const msgs = this.textMessages[this.currentTextChannel] || [];
    container.innerHTML = msgs.map(m => `
      <div class="chat-message-row">
        <img src="${m.avatar}" class="chat-msg-avatar" alt="${m.author}">
        <div class="chat-msg-content">
          <div>
            <span class="chat-msg-author">${m.author}</span>
            <span class="chat-msg-time">${m.time}</span>
          </div>
          <div class="chat-msg-text">${m.text}</div>
        </div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }

  renderOnlineUsers() {
    const container = document.getElementById('onlineUsersList');
    if (!container) return;

    container.innerHTML = this.onlineUsers.map(u => `
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-green);"></span>
          <span style="font-weight: 600;">${u.name}</span>
        </div>
        <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.78rem;">${u.mmr} MMR</span>
      </div>
    `).join('');
  }

  selectVoiceRoom(roomKey) {
    this.currentVoiceRoom = roomKey;
    document.getElementById('voiceRoomName').textContent = roomKey.replace('-', ' ').toUpperCase();
  }

  toggleVoiceConnection() {
    const badge = document.getElementById('voiceStatusBadge');
    const roomName = document.getElementById('voiceRoomName');
    const btnConnect = document.getElementById('btnConnectVoice');
    const btnMic = document.getElementById('btnToggleMic');
    const btnDeafen = document.getElementById('btnToggleDeafen');

    if (badge.textContent === 'Connected') {
      badge.textContent = 'Disconnected';
      badge.style.background = 'rgba(255, 82, 82, 0.2)';
      badge.style.color = 'var(--accent-red)';
      btnConnect.textContent = 'Join Voice Channel';
      btnConnect.classList.remove('btn-danger');
      btnConnect.classList.add('btn-primary');
      btnMic.disabled = true;
      btnDeafen.disabled = true;
    } else {
      if (!this.currentVoiceRoom) this.currentVoiceRoom = 'general-voice';
      badge.textContent = 'Connected';
      badge.style.background = 'rgba(0, 230, 118, 0.2)';
      badge.style.color = 'var(--accent-green)';
      roomName.textContent = this.currentVoiceRoom.replace('-', ' ').toUpperCase();
      btnConnect.textContent = 'Disconnect Voice';
      btnConnect.classList.remove('btn-primary');
      btnConnect.classList.add('btn-danger');
      btnMic.disabled = false;
      btnDeafen.disabled = false;
    }
  }

  handleCreateChannel() {
    const input = document.getElementById('newChannelNameInput');
    const name = input.value.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name) return;

    if (this.creatingChannelType === 'text') {
      const list = document.getElementById('textChannelsList');
      const div = document.createElement('div');
      div.className = 'channel-item';
      div.setAttribute('data-channel', name);
      div.textContent = `# ${name}`;
      list.appendChild(div);
      this.textMessages[name] = [
        { id: Date.now(), author: 'System', text: `Welcome to #${name}!`, time: 'Just now', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80' }
      ];
      this.switchTextChannel(name, div);
    } else {
      const list = document.getElementById('voiceChannelsList');
      const div = document.createElement('div');
      div.className = 'channel-item';
      div.setAttribute('data-voice', name);
      div.innerHTML = `<span>🔊</span> ${name.replace('-', ' ')}`;
      list.appendChild(div);
      this.selectVoiceRoom(name);
    }

    input.value = '';
    document.getElementById('createChannelModal').classList.remove('active');
  }
}

window.chatVoiceManager = new ChatVoiceManager();
document.addEventListener('DOMContentLoaded', () => window.chatVoiceManager.init());
