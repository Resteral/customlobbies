// Default User Fallback
const DEFAULT_USER = {
    id: 'usr_' + Math.floor(Math.random()*10000),
    username: 'GuestGamer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    rank: 'Unranked',
    mmr: 1000,
    reputation: 'Honorable',
    xp: 450
};

// Global Socket Connection with Safe Fallback
let socketObj;
try {
    socketObj = (typeof io !== 'undefined') ? io() : {
        on: () => {},
        emit: () => {},
        broadcast: { emit: () => {} }
    };
} catch(e) {
    socketObj = { on: () => {}, emit: () => {}, broadcast: { emit: () => {} } };
}
window.socket = socketObj;

// Main Application Router & State Manager for CustomLobbies.com Desktop Program
class App {
    constructor() {
        this.currentUser = DEFAULT_USER;
        this.currentView = 'lobbies'; // 'lobbies', 'auto-queue', 'database', 'streams', 'groups', 'vote-arena', 'profile'
    }

    init() {
        const savedUser = localStorage.getItem('customlobbies_user');
        if (savedUser) {
            try { this.currentUser = JSON.parse(savedUser); } catch (e) { }
        }

        // Emit identity to server
        if (window.socket && window.socket.emit) {
            try { window.socket.emit('user_connected', this.currentUser); } catch(e){}
        }

        // Initialize All Core Subsystems with mock fallbacks
        const initialLobbies = typeof INITIAL_LOBBIES !== 'undefined' ? [...INITIAL_LOBBIES] : [];
        const initialStreams = typeof INITIAL_STREAMS !== 'undefined' ? [...INITIAL_STREAMS] : [];
        const initialGroups = typeof INITIAL_GROUPS !== 'undefined' ? [...INITIAL_GROUPS] : [];
        const initialFriends = typeof INITIAL_FRIENDS !== 'undefined' ? [...INITIAL_FRIENDS] : [];

        lobbyManager.init(initialLobbies);
        queueManager.init();
        databaseManager.init();
        programClient.init();
        streamsManager.init(initialStreams);
        groupsManager.init(initialGroups);
        friendsManager.init(initialFriends, []);
        if (typeof debateManager !== 'undefined') debateManager.init();

        // Fetch Lobbies from real backend
        fetch('/api/lobbies')
            .then(res => res.json())
            .then(data => {
                if (data && data.lobbies && data.lobbies.length > 0) {
                    lobbyManager.lobbies = data.lobbies;
                    if (this.currentView === 'lobbies') lobbyManager.renderLobbies();
                }
            })
            .catch(err => console.log("Using local lobbies state:", err));

        // Listen for new lobbies via Socket
        if (window.socket && window.socket.on) {
            try {
                window.socket.on('lobby_created', (newLobby) => {
                    lobbyManager.lobbies.unshift(newLobby);
                    if (this.currentView === 'lobbies') lobbyManager.renderLobbies();
                });
            } catch(e){}
        }

        this.renderUserProfileHeader();
        this.setupNavigation();
        this.setupModalBackdrops();

        console.log('⚡ CustomLobbies Desktop Program Suite initialized.');
    }

    renderUserProfileHeader() {
        const avatarEl = document.getElementById('navUserAvatar');
        const nameEl = document.getElementById('navUserName');
        const rankEl = document.getElementById('navUserRank');
        const mmrEl = document.getElementById('navUserMmr');

        if (avatarEl) avatarEl.src = this.currentUser.avatar;
        if (nameEl) nameEl.innerText = this.currentUser.username;
        if (rankEl) rankEl.innerText = this.currentUser.rank;
        if (mmrEl) mmrEl.innerText = `MMR ${this.currentUser.mmr || 2180}`;
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-tab-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetView = btn.getAttribute('data-view');
                if (targetView) this.switchView(targetView);
            });
        });
    }

    switchView(viewName) {
        soundManager.playClick();
        this.currentView = viewName;

        // Update active tab buttons
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-view') === viewName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Hide all views, show active
        document.querySelectorAll('.view-section').forEach(sec => {
            sec.style.display = 'none';
        });

        const activeSection = document.getElementById(`view-${viewName}`);
        if (activeSection) {
            activeSection.style.display = 'block';
            activeSection.classList.add('animate-fade-in');
        }

        // View refreshes
        if (viewName === 'auto-queue') queueManager.renderAutoQueueHub();
        if (viewName === 'database') { databaseManager.renderDatabaseDashboard(); databaseManager.renderServerNodes(); }
        if (viewName === 'streams') streamsManager.renderStreams();
        if (viewName === 'groups') groupsManager.renderSquads();
        if (viewName === 'lobbies') lobbyManager.renderLobbies();
        if (viewName === 'vote-arena') {
            if (typeof debateManager !== 'undefined') {
                debateManager.renderDebateArena();
            } else {
                this.renderVoteArenaOverview();
            }
        }
        if (viewName === 'profile') this.renderProfileView();
    }

    renderVoteArenaOverview() {
        const container = document.getElementById('voteArenaApplicantsList');
        if (!container) return;

        container.innerHTML = SAMPLE_APPLICANTS.map(app => `
            <div class="applicant-card glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <img src="${app.avatar}" class="w-14 h-14 rounded-full border-2 border-neon-cyan" />
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-lg font-bold text-white">${escapeHtml(app.username)}</span>
                            <span class="badge badge-dark">${app.tag}</span>
                            <span class="badge badge-publicity">5s Intro Ready</span>
                        </div>
                        <div class="text-xs text-neon-cyan mt-1">Applying for: <strong>${escapeHtml(app.appliedSquad)}</strong> • Rank: ${app.rank}</div>
                        <p class="text-xs text-gray-300 italic mt-1">${escapeHtml(app.pitchText)}</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <button class="btn btn-primary pulse-btn" onclick="app.launchApplicantReview('${app.id}')">
                        ⚡ Review 5s Intro & Vote
                    </button>
                </div>
            </div>
        `).join('');
    }

    launchApplicantReview(applicantId) {
        soundManager.playClick();
        const applicant = SAMPLE_APPLICANTS.find(a => a.id === applicantId);
        if (!applicant) return;

        groupsManager.openLiveVoteReviewArena({
            id: applicant.id,
            applicantName: applicant.username,
            applicantAvatar: applicant.avatar,
            applicantRank: applicant.rank,
            quote: applicant.pitchText,
            videoUrl: applicant.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            targetInfo: { targetTitle: applicant.appliedSquad, targetType: 'squad' },
            votesYes: applicant.votesFor,
            votesNo: applicant.votesAgainst,
            requiredVotes: applicant.totalRequired
        });
    }

    renderProfileView() {
        document.getElementById('profileUsernameInput').value = this.currentUser.username;
        document.getElementById('profileStatusInput').value = this.currentUser.customStatus;
        document.getElementById('profileRankInput').value = this.currentUser.rank;
        document.getElementById('profileQuoteInput').value = this.currentUser.introQuote;
        document.getElementById('profileAvatarPreview').src = this.currentUser.avatar;

        if (document.getElementById('profileStatsKd')) {
            document.getElementById('profileStatsKd').innerText = this.currentUser.stats?.kd || '1.84';
            document.getElementById('profileStatsWin').innerText = this.currentUser.stats?.winRate || '68.5%';
            document.getElementById('profileStatsMatches').innerText = this.currentUser.stats?.matchesPlayed || '342';
            document.getElementById('profileStatsMmr').innerText = this.currentUser.mmr || 2180;
        }
    }

    saveProfile() {
        soundManager.playClick();
        this.currentUser.username = document.getElementById('profileUsernameInput').value.trim() || this.currentUser.username;
        this.currentUser.customStatus = document.getElementById('profileStatusInput').value.trim();
        this.currentUser.rank = document.getElementById('profileRankInput').value.trim();
        this.currentUser.introQuote = document.getElementById('profileQuoteInput').value.trim();

        localStorage.setItem('customlobbies_user', JSON.stringify(this.currentUser));
        this.renderUserProfileHeader();
        soundManager.playVoteApproved();
        this.showToast('🎉 Gamer Profile & Database Record Saved!', 'success');

        databaseManager.logQuery(`POSTGRES: UPDATE player_profiles SET username = '${this.currentUser.username}', rank = '${this.currentUser.rank}' WHERE user_id = '${this.currentUser.id}';`);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            if (modalId === 'publicityVoteApplyModal') {
                groupsManager.stopWebcam();
            }
        }
    }

    setupModalBackdrops() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-pill toast-${type} animate-slide-up`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🔔'}</span>
            <span class="toast-text">${escapeHtml(message)}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    showFloatingReaction(emoji) {
        const floater = document.createElement('div');
        floater.className = 'floating-emoji';
        floater.innerText = emoji;
        floater.style.left = `${Math.random() * 80 + 10}%`;
        document.body.appendChild(floater);
        setTimeout(() => floater.remove(), 2000);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const app = new App();
window.addEventListener('DOMContentLoaded', () => app.init());
