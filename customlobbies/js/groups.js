// Grouping System & 5-Second Publicity Vote Gatekeeper
class GroupsManager {
    constructor() {
        this.squads = [];
        this.activeApplication = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordedBlobUrl = null;
        this.webcamStream = null;
        this.recordingTimer = null;
        this.voteCountdownTimer = null;
        this.secondsLeft = 5;
    }

    init(squadsData) {
        this.squads = squadsData || [];
        this.renderSquads();
    }

    renderSquads() {
        const container = document.getElementById('squadsGrid');
        if (!container) return;

        container.innerHTML = this.squads.map(squad => {
            const isMember = squad.members.some(m => m.id === app.currentUser.id);
            const isLeader = squad.leader.id === app.currentUser.id;

            return `
                <div class="squad-card glass-panel glow-hover animate-fade-in">
                    <div class="squad-banner" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(13,17,23,0.95) 100%), url('${squad.banner}');">
                        <div class="squad-badge-tag">${escapeHtml(squad.tag)}</div>
                        <div class="squad-level-badge">LVL ${squad.level}</div>
                    </div>

                    <div class="squad-body p-4">
                        <div class="squad-header-row flex items-center gap-3">
                            <img src="${squad.avatar}" class="squad-avatar-img" />
                            <div>
                                <h3 class="text-xl font-bold text-gradient">${escapeHtml(squad.name)}</h3>
                                <span class="text-xs text-muted">Primary: <strong>${escapeHtml(squad.primaryGame)}</strong></span>
                            </div>
                        </div>

                        <p class="squad-desc mt-3 text-sm text-gray-300">${escapeHtml(squad.description)}</p>

                        <div class="squad-meta-stats grid grid-cols-2 gap-2 my-3 text-xs">
                            <div class="p-2 rounded bg-white/5 border border-white/5">
                                <span class="text-muted block">Members:</span>
                                <span class="font-bold text-white">${squad.members.length} / ${squad.maxMembers}</span>
                            </div>
                            <div class="p-2 rounded bg-white/5 border border-white/5">
                                <span class="text-muted block">Entry Security:</span>
                                <span class="font-bold ${squad.publicityVoteRequired ? 'text-neon-cyan' : 'text-green-400'}">
                                    ${squad.publicityVoteRequired ? '⚡ 5s Publicity Vote' : '🟢 Open Entry'}
                                </span>
                            </div>
                        </div>

                        <div class="squad-roster-preview my-3">
                            <div class="text-xs text-muted mb-1 font-semibold">Active Roster:</div>
                            <div class="flex flex-wrap gap-1">
                                ${squad.members.map(m => `
                                    <span class="badge badge-dark text-xs ${m.id === app.currentUser.id ? 'border border-neon-cyan text-neon-cyan' : ''}">
                                        ${escapeHtml(m.username)} (${m.role})
                                    </span>
                                `).join('')}
                            </div>
                        </div>

                        <div class="squad-footer mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                            ${isMember ? `
                                <span class="badge badge-success">✓ You are in this squad</span>
                                ${isLeader ? `<button class="btn btn-xs btn-outline" onclick="groupsManager.openSquadSettings('${squad.id}')">⚙️ Manage</button>` : ''}
                            ` : `
                                <button class="btn ${squad.publicityVoteRequired ? 'btn-publicity' : 'btn-primary'} btn-block"
                                        onclick="groupsManager.startPublicityVoteApplication({ targetType: 'squad', targetId: '${squad.id}', targetTitle: '${escapeHtml(squad.name)}' })">
                                    ${squad.publicityVoteRequired ? '⚡ Audition & Vote to Join' : '🚀 Instant Join'}
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ==========================================
    // 5-SECOND PUBLICITY VOTE FLOW (The Gatekeeper)
    // ==========================================

    startPublicityVoteApplication(targetInfo) {
        soundManager.playClick();
        this.activeApplication = targetInfo;
        this.recordedChunks = [];
        this.recordedBlobUrl = null;

        const modal = document.getElementById('publicityVoteApplyModal');
        if (!modal) return;

        // Reset studio UI
        document.getElementById('applyTargetTitle').innerText = targetInfo.targetTitle;
        document.getElementById('applyTargetType').innerText = targetInfo.targetType === 'lobby' ? 'Custom Lobby' : 'Squad';
        document.getElementById('recordingStatusText').innerText = 'Ready to record your 5-second intro!';
        document.getElementById('recordProgressFill').style.width = '0%';
        document.getElementById('previewVideoElement').style.display = 'none';
        document.getElementById('cameraFeedElement').style.display = 'block';
        document.getElementById('submitIntroBtn').disabled = true;

        app.openModal('publicityVoteApplyModal');
        this.startCameraPreview();
    }

    async startCameraPreview() {
        const videoElement = document.getElementById('cameraFeedElement');
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoElement) {
                    videoElement.srcObject = this.webcamStream;
                    videoElement.play();
                }
            } else {
                this.fallbackCameraMessage();
            }
        } catch (err) {
            console.warn('Webcam permission not granted or unavailable:', err);
            this.fallbackCameraMessage();
        }
    }

    fallbackCameraMessage() {
        const status = document.getElementById('recordingStatusText');
        if (status) {
            status.innerHTML = '🎥 Camera simulated preview enabled. Click <strong>Start 5s Record</strong> or use Animated Pitch Card!';
        }
    }

    start5SecondRecording() {
        soundManager.playClick();
        const startBtn = document.getElementById('startRecordBtn');
        const statusText = document.getElementById('recordingStatusText');
        const progressFill = document.getElementById('recordProgressFill');
        const countdownNum = document.getElementById('recordCountdownNum');

        if (startBtn) startBtn.disabled = true;

        let timeLeft = 5;
        countdownNum.innerText = timeLeft;
        countdownNum.classList.add('pulse-glow');
        statusText.innerText = '🔴 RECORDING LIVE INTRO (5 SECONDS)...';

        // Check if stream available for real recording
        if (this.webcamStream) {
            try {
                this.recordedChunks = [];
                this.mediaRecorder = new MediaRecorder(this.webcamStream);
                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) this.recordedChunks.push(e.data);
                };
                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                    this.recordedBlobUrl = URL.createObjectURL(blob);
                    this.showRecordedPreview(this.recordedBlobUrl);
                };
                this.mediaRecorder.start();
            } catch (e) {
                console.warn('MediaRecorder error:', e);
            }
        }

        soundManager.playCountdownTick(false);

        const interval = setInterval(() => {
            timeLeft--;
            const percent = ((5 - timeLeft) / 5) * 100;
            progressFill.style.width = `${percent}%`;

            if (timeLeft > 0) {
                countdownNum.innerText = timeLeft;
                soundManager.playCountdownTick(timeLeft === 1);
            } else {
                clearInterval(interval);
                countdownNum.innerText = 'DONE!';
                soundManager.playCountdownTick(true);

                if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                    this.mediaRecorder.stop();
                } else {
                    // Fallback to sample video if camera was not available
                    this.showRecordedPreview('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                }

                if (startBtn) {
                    startBtn.disabled = false;
                    startBtn.innerText = '🔄 Re-record 5s Intro';
                }
                statusText.innerText = '✅ 5-Second Intro Captured! Ready for Squad Publicity Vote.';
                document.getElementById('submitIntroBtn').disabled = false;
            }
        }, 1000);
    }

    showRecordedPreview(videoSrc) {
        const videoElement = document.getElementById('previewVideoElement');
        const cameraElement = document.getElementById('cameraFeedElement');

        if (cameraElement) cameraElement.style.display = 'none';
        if (videoElement) {
            videoElement.style.display = 'block';
            videoElement.src = videoSrc;
            videoElement.loop = true;
            videoElement.play();
        }
    }

    submitPublicityApplication() {
        soundManager.playClick();
        this.stopWebcam();
        app.closeModal('publicityVoteApplyModal');

        app.showToast('🚀 Your 5-Second Intro has been queued for live member voting!', 'success');

        // Trigger the interactive Group Review Arena so the user can experience the voting gatekeeper!
        setTimeout(() => {
            this.openLiveVoteReviewArena({
                id: 'app_' + Date.now(),
                applicantName: app.currentUser.username,
                applicantAvatar: app.currentUser.avatar,
                applicantRank: app.currentUser.rank,
                quote: app.currentUser.introQuote,
                videoUrl: this.recordedBlobUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                targetInfo: this.activeApplication,
                votesYes: 1,
                votesNo: 0,
                requiredVotes: 3
            });
        }, 900);
    }

    stopWebcam() {
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
            this.webcamStream = null;
        }
    }

    // ============================================================
    // LIVE 5-SECOND REVIEW VOTE ARENA (Squad / Lobby Members Review)
    // ============================================================

    openLiveVoteReviewArena(applicantData) {
        const modal = document.getElementById('livePublicityVoteModal');
        if (!modal) return;

        clearInterval(this.voteCountdownTimer);
        this.secondsLeft = 5;

        // Populate modal data
        document.getElementById('voteApplicantName').innerText = applicantData.applicantName;
        document.getElementById('voteApplicantRank').innerText = applicantData.applicantRank;
        document.getElementById('voteApplicantQuote').innerText = applicantData.quote || 'Ready to win with this squad!';
        document.getElementById('voteApplicantAvatar').src = applicantData.applicantAvatar;
        document.getElementById('voteTargetName').innerText = applicantData.targetInfo.targetTitle;

        const videoPlayer = document.getElementById('voteReviewVideoPlayer');
        if (videoPlayer) {
            videoPlayer.src = applicantData.videoUrl;
            videoPlayer.currentTime = 0;
            videoPlayer.play().catch(e => console.log('Autoplay blocked:', e));
        }

        // Reset meters
        const yesBar = document.getElementById('voteMeterYes');
        const noBar = document.getElementById('voteMeterNo');
        if (yesBar) yesBar.style.width = '60%';
        if (noBar) noBar.style.width = '20%';

        document.getElementById('voteResultBanner').style.display = 'none';
        document.getElementById('voteActionButtons').style.display = 'flex';

        app.openModal('livePublicityVoteModal');

        // Start intense 5s countdown
        const timerText = document.getElementById('voteCountdownTimerText');
        const timerProgress = document.getElementById('voteTimerRingFill');

        timerText.innerText = '5';
        soundManager.playCountdownTick(false);

        this.voteCountdownTimer = setInterval(() => {
            this.secondsLeft--;
            timerText.innerText = this.secondsLeft;

            const offset = 283 - ((5 - this.secondsLeft) / 5) * 283;
            if (timerProgress) timerProgress.style.strokeDashoffset = offset;

            if (this.secondsLeft > 0) {
                soundManager.playCountdownTick(this.secondsLeft === 1);
            } else {
                clearInterval(this.voteCountdownTimer);
                soundManager.playCountdownTick(true);
                this.finalizeVote(applicantData, true);
            }
        }, 1000);
    }

    castVote(applicantId, isUpvote) {
        soundManager.playClick();
        clearInterval(this.voteCountdownTimer);

        const yesBar = document.getElementById('voteMeterYes');
        const noBar = document.getElementById('voteMeterNo');

        if (isUpvote) {
            if (yesBar) yesBar.style.width = '100%';
            if (noBar) noBar.style.width = '0%';
            this.finalizeVote(null, true);
        } else {
            if (yesBar) yesBar.style.width = '20%';
            if (noBar) noBar.style.width = '80%';
            this.finalizeVote(null, false);
        }
    }

    finalizeVote(applicantData, isApproved) {
        document.getElementById('voteActionButtons').style.display = 'none';
        const banner = document.getElementById('voteResultBanner');
        banner.style.display = 'block';

        if (isApproved) {
            soundManager.playVoteApproved();
            banner.className = 'vote-result-banner approved animate-bounce-in';
            banner.innerHTML = `
                <div class="text-3xl">🎉 VOTED IN! (94% APPROVAL)</div>
                <p class="text-sm">Welcome to the team! Unlocking squad voice room & lobby slot...</p>
            `;

            // If user applied to lobby, add to lobby
            if (this.activeApplication && this.activeApplication.targetType === 'lobby') {
                const lobby = lobbyManager.lobbies.find(l => l.id === this.activeApplication.targetId);
                if (lobby && !lobby.currentPlayers.some(p => p.id === app.currentUser.id)) {
                    lobby.currentPlayers.push({
                        id: app.currentUser.id,
                        username: app.currentUser.username,
                        team: 'Alpha',
                        ready: true,
                        role: 'Member'
                    });
                    lobbyManager.renderLobbies();
                }
            }

            // If user applied to squad, add to squad
            if (this.activeApplication && this.activeApplication.targetType === 'squad') {
                const squad = this.squads.find(s => s.id === this.activeApplication.targetId);
                if (squad && !squad.members.some(m => m.id === app.currentUser.id)) {
                    squad.members.push({
                        id: app.currentUser.id,
                        username: app.currentUser.username,
                        role: 'Member',
                        rank: app.currentUser.rank
                    });
                    this.renderSquads();
                }
            }
        } else {
            soundManager.playVoteRejected();
            banner.className = 'vote-result-banner denied animate-shake';
            banner.innerHTML = `
                <div class="text-3xl">🚫 VOTE REJECTED (INSUFFICIENT VOTES)</div>
                <p class="text-sm">Better luck next audition! Keep grinding.</p>
            `;
        }

        setTimeout(() => {
            app.closeModal('livePublicityVoteModal');
            if (isApproved) {
                app.showToast('🏆 You have been successfully admitted by publicity vote!', 'success');
                if (this.activeApplication && this.activeApplication.targetType === 'lobby') {
                    lobbyManager.openLobbyDetails(this.activeApplication.targetId);
                }
            }
        }, 2800);
    }

    createSquad(formData) {
        soundManager.playClick();
        const newSquad = {
            id: 'squad_' + Date.now(),
            name: formData.name || 'Alpha Champions',
            tag: formData.tag ? `[${formData.tag.toUpperCase()}]` : '[ALPHA]',
            avatar: formData.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
            banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
            description: formData.description || 'New competitive squad on CustomLobbies.',
            leader: { id: app.currentUser.id, username: app.currentUser.username },
            members: [
                { id: app.currentUser.id, username: app.currentUser.username, role: 'Captain', rank: app.currentUser.rank }
            ],
            publicityVoteRequired: formData.publicityVoteRequired === true,
            minApprovalPercent: parseInt(formData.minApprovalPercent) || 66,
            activeVotes: [],
            primaryGame: formData.primaryGame || 'Multi-FPS',
            level: 1,
            memberCount: 1,
            maxMembers: 8
        };

        this.squads.unshift(newSquad);
        this.renderSquads();
        app.closeModal('createSquadModal');
        soundManager.playVoteApproved();
        app.showToast(`🎉 Squad "${newSquad.name}" Created with 5s Vote Gatekeeper!`, 'success');
    }
}

const groupsManager = new GroupsManager();
