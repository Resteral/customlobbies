// custom-lobbies-enhancements.js
// Adds the 5-Second Publicity Gatekeeper and Game Database Server Hooks

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject the 5-Second Publicity Vote Gatekeeper HTML Modal
    const gatekeeperHTML = `
    <div class="modal-overlay" id="publicityGatekeeperModal">
        <div class="modal-card" style="max-width: 550px; text-align: center;">
            <h3 style="color: var(--accent-cyan); font-weight: 900; margin-bottom: 0.5rem; font-size: 1.5rem;">⚡ 5-Second Publicity Gatekeeper</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                This squad requires a live 5-second intro video. Squad members will review your intro to accept or deny your application!
            </p>
            
            <div style="background: #000; border: 2px solid var(--border-glow); border-radius: 12px; overflow: hidden; position: relative; margin-bottom: 1.5rem; height: 300px; display: flex; justify-content: center; align-items: center;">
                <video id="gkWebcamFeed" autoplay muted style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
                <div id="gkStatusText" style="position: absolute; z-index: 10; font-weight: 900; font-size: 1.2rem; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">
                    📷 Requesting Camera...
                </div>
            </div>

            <div style="font-size: 3rem; font-weight: 900; color: var(--accent-purple); margin-bottom: 1rem; font-family: monospace;" id="gkCountdownDisplay">5</div>

            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-secondary" onclick="window.customEnhancements.closeGatekeeper()">Cancel</button>
                <button class="btn btn-primary" id="gkStartRecordBtn" onclick="window.customEnhancements.startRecording()" style="box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);" disabled>
                    🔴 Start 5-Second Intro
                </button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', gatekeeperHTML);

    // 2. Enhance Matchmaking Queue to show Database Hooking
    if (window.matchmakingHubEngine) {
        const originalStart = window.matchmakingHubEngine.startMatchmakingQueue.bind(window.matchmakingHubEngine);
        window.matchmakingHubEngine.startMatchmakingQueue = function(gameName, modeName, regionName) {
            // First, trigger custom database connection visuals
            if (window.app && window.app.showToast) {
                window.app.showToast('🔗 Hooking into external Game Databases...', 'info');
                setTimeout(() => {
                    window.app.showToast('✅ Database connected! Resolving dedicated game servers...', 'success');
                }, 1500);
            }
            // Call original
            originalStart(gameName, modeName, regionName);
        };
    }
});

window.customEnhancements = {
    stream: null,
    recorder: null,
    targetTeam: null,
    
    openGatekeeper(teamName) {
        this.targetTeam = teamName;
        const modal = document.getElementById('publicityGatekeeperModal');
        modal.classList.add('active');
        document.getElementById('gkStatusText').innerText = '📷 Requesting Camera...';
        document.getElementById('gkStartRecordBtn').disabled = true;
        document.getElementById('gkCountdownDisplay').innerText = '5';
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                this.stream = stream;
                const video = document.getElementById('gkWebcamFeed');
                video.srcObject = stream;
                video.style.display = 'block';
                document.getElementById('gkStatusText').style.display = 'none';
                document.getElementById('gkStartRecordBtn').disabled = false;
            })
            .catch(err => {
                document.getElementById('gkStatusText').innerText = '⚠️ Camera Not Found. (Simulation Mode)';
                document.getElementById('gkStartRecordBtn').disabled = false;
            });
    },

    closeGatekeeper() {
        const modal = document.getElementById('publicityGatekeeperModal');
        modal.classList.remove('active');
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        const video = document.getElementById('gkWebcamFeed');
        video.style.display = 'none';
        video.srcObject = null;
    },

    startRecording() {
        const btn = document.getElementById('gkStartRecordBtn');
        btn.disabled = true;
        btn.innerText = '🔴 RECORDING...';
        document.getElementById('gkStatusText').style.display = 'block';
        document.getElementById('gkStatusText').innerText = 'LIVE BROADCASTING...';
        
        let timeLeft = 5;
        document.getElementById('gkCountdownDisplay').innerText = timeLeft;
        
        const interval = setInterval(() => {
            timeLeft--;
            document.getElementById('gkCountdownDisplay').innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                this.finishRecording();
            }
        }, 1000);
    },

    finishRecording() {
        document.getElementById('gkCountdownDisplay').innerText = 'DONE!';
        document.getElementById('gkStatusText').innerText = '✅ Intro Captured! Sending to Squad for Live Review...';
        
        setTimeout(() => {
            this.closeGatekeeper();
            if (window.app && window.app.showToast) {
                window.app.showToast(`🚀 Application submitted to ${this.targetTeam}! The squad is voting now...`, 'success');
                
                // Simulate vote result
                setTimeout(() => {
                    alert(`🎉 PUBLICITY VOTE PASSED!\n\nThe squad accepted your 5-second intro video. Welcome to ${this.targetTeam}!`);
                }, 4000);
            } else {
                alert(`🚀 Application submitted to ${this.targetTeam}!`);
            }
        }, 2000);
    }
};

// Override any "Join Team" logic in the UI if we can hook it
window.originalJoinTeam = window.app ? window.app.joinTeam : null;
if (window.app) {
    window.app.triggerGatekeeperJoin = function(teamName) {
        window.customEnhancements.openGatekeeper(teamName);
    };
}
