// Friends & Direct Messaging System for CustomLobbies.com
class FriendsManager {
    constructor() {
        this.friends = [];
        this.messages = {};
        this.activeChatFriendId = null;
    }

    init(friendsData, messagesData) {
        this.friends = friendsData || [];
        this.messages = messagesData || {};
        this.renderFriendsList();
        this.setupSearch();
    }

    setupSearch() {
        const input = document.getElementById('friendSearchInput');
        if (input) {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                this.renderFriendsList(query);
            });
        }
    }

    renderFriendsList(searchQuery = '') {
        const container = document.getElementById('friendsDrawerList');
        if (!container) return;

        let filtered = this.friends.filter(f => 
            !searchQuery || 
            f.username.toLowerCase().includes(searchQuery) ||
            f.tag.includes(searchQuery)
        );

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="p-4 text-center text-muted text-xs">
                    No friends found matching "${searchQuery}". Add new friends using the button below!
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(friend => {
            const statusClass = friend.status === 'online' ? 'status-online' :
                                friend.status === 'in-game' ? 'status-ingame' :
                                friend.status === 'streaming' ? 'status-streaming' : 'status-away';

            return `
                <div class="friend-item-card flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
                     onclick="friendsManager.openChat('${friend.id}')">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <img src="${friend.avatar}" class="w-10 h-10 rounded-full border border-white/10" />
                            <span class="status-indicator-badge ${statusClass}"></span>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-white flex items-center gap-1">
                                ${escapeHtml(friend.username)} <span class="text-xs text-muted">${friend.tag}</span>
                            </div>
                            <div class="text-xs text-gray-400 truncate max-w-[150px]">
                                ${escapeHtml(friend.gameActivity || friend.status)}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        ${friend.unreadMessages > 0 ? `<span class="unread-pill">${friend.unreadMessages}</span>` : ''}
                        <button class="btn btn-xs btn-outline" title="Send Direct Message" onclick="event.stopPropagation(); friendsManager.openChat('${friend.id}')">
                            💬
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openChat(friendId) {
        soundManager.playClick();
        const friend = this.friends.find(f => f.id === friendId);
        if (!friend) return;

        this.activeChatFriendId = friendId;
        friend.unreadMessages = 0;
        this.renderFriendsList();

        document.getElementById('dmFriendName').innerText = `${friend.username} ${friend.tag}`;
        document.getElementById('dmFriendAvatar').src = friend.avatar;
        document.getElementById('dmFriendStatus').innerText = friend.gameActivity || friend.status;

        this.renderChatMessages();
        app.openModal('directMessageModal');
    }

    renderChatMessages() {
        const container = document.getElementById('dmChatHistory');
        if (!container || !this.activeChatFriendId) return;

        const history = this.messages[this.activeChatFriendId] || [];

        container.innerHTML = history.map(msg => {
            const isMe = msg.senderId === app.currentUser.id;
            return `
                <div class="dm-message-bubble ${isMe ? 'dm-me' : 'dm-them'}">
                    <div class="dm-text">${escapeHtml(msg.text)}</div>
                    <div class="dm-time">${msg.timestamp}</div>
                </div>
            `;
        }).join('');

        container.scrollTop = container.scrollHeight;
    }

    sendDirectMessage() {
        const input = document.getElementById('dmChatInput');
        if (!input || !input.value.trim() || !this.activeChatFriendId) return;

        const text = input.value.trim();
        input.value = '';

        if (!this.messages[this.activeChatFriendId]) {
            this.messages[this.activeChatFriendId] = [];
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.messages[this.activeChatFriendId].push({
            id: 'm_' + Date.now(),
            senderId: app.currentUser.id,
            text: text,
            timestamp: timeStr
        });

        soundManager.playClick();
        this.renderChatMessages();

        // Simulated intelligent gaming buddy response
        setTimeout(() => {
            if (this.activeChatFriendId) {
                const responses = [
                    'Bet! Drop me the lobby link, I am locked in! 🎯',
                    'Checking out your 5-second intro right now, clean clip!',
                    'GGs! Ready whenever you are!',
                    'Send the squad invite, let\'s run it back 🔥',
                    'I\'ll be on in 2 minutes, hold my slot!'
                ];
                const reply = responses[Math.floor(Math.random() * responses.length)];
                this.messages[this.activeChatFriendId].push({
                    id: 'm_' + Date.now(),
                    senderId: this.activeChatFriendId,
                    text: reply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                soundManager.playMessageNotification();
                this.renderChatMessages();
            }
        }, 1800);
    }

    sendLobbyInviteFromDM() {
        soundManager.playClick();
        if (!this.activeChatFriendId) return;
        const friend = this.friends.find(f => f.id === this.activeChatFriendId);

        const inviteText = `🎮 [CUSTOM LOBBIES INVITE]: Join my 5v5 Custom Lobby! (Click to connect)`;
        if (!this.messages[this.activeChatFriendId]) this.messages[this.activeChatFriendId] = [];

        this.messages[this.activeChatFriendId].push({
            id: 'm_' + Date.now(),
            senderId: app.currentUser.id,
            text: inviteText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        this.renderChatMessages();
        app.showToast(`Sent lobby invitation to ${friend ? friend.username : 'friend'}!`, 'success');
    }

    addNewFriend(username, tag) {
        soundManager.playClick();
        const newFriend = {
            id: 'user_' + Date.now(),
            username: username || 'ProGamerX',
            tag: tag || `#${Math.floor(1000 + Math.random() * 9000)}`,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            status: 'online',
            gameActivity: 'Valorant - Main Menu',
            lastSeen: 'Now',
            unreadMessages: 0
        };

        this.friends.push(newFriend);
        this.renderFriendsList();
        app.closeModal('addFriendModal');
        soundManager.playVoteApproved();
        app.showToast(`🎉 Added ${newFriend.username}${newFriend.tag} as a friend!`, 'success');
    }

    openInviteToLobbyModal(lobbyId) {
        soundManager.playClick();
        const modal = document.getElementById('inviteFriendsModal');
        if (!modal) return;

        const listContainer = document.getElementById('inviteFriendsList');
        if (listContainer) {
            listContainer.innerHTML = this.friends.map(friend => `
                <div class="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                    <div class="flex items-center gap-2">
                        <img src="${friend.avatar}" class="w-8 h-8 rounded-full" />
                        <div>
                            <div class="text-sm font-semibold text-white">${escapeHtml(friend.username)}</div>
                            <div class="text-xs text-muted">${escapeHtml(friend.gameActivity || friend.status)}</div>
                        </div>
                    </div>
                    <button class="btn btn-xs btn-primary" onclick="friendsManager.dispatchLobbyInvite('${friend.id}', '${lobbyId}')">
                        ✉️ Invite
                    </button>
                </div>
            `).join('');
        }

        app.openModal('inviteFriendsModal');
    }

    dispatchLobbyInvite(friendId, lobbyId) {
        soundManager.playClick();
        const friend = this.friends.find(f => f.id === friendId);
        app.showToast(`Lobby invitation sent to ${friend ? friend.username : 'player'}!`, 'success');
        app.closeModal('inviteFriendsModal');
    }
}

const friendsManager = new FriendsManager();
