/**
 * Salty AI Arena - Main Application Controller (Realistic Edition)
 * Orchestrates matchmaking, realistic canvas loop, UI interactions, AI generation, and tournament brackets.
 */
class SaltyApp {
    constructor() {
        this.roster = [];
        this.currentFighter1 = null;
        this.currentFighter2 = null;
        this.gameMode = "endless";

        this.engine = null;
        this.speedMultiplier = 1.0;
        this.bettingCountdown = 12;
        this.bettingTimerId = null;
        this.state = "betting";

        this.tournament = null;
    }

    init() {
        // Load roster
        const saved = localStorage.getItem("salty_roster_v2");
        if (saved) {
            try {
                this.roster = JSON.parse(saved);
            } catch (e) {
                this.roster = [...window.DEFAULT_ROSTER];
            }
        } else {
            this.roster = [...window.DEFAULT_ROSTER];
            this.saveRoster();
        }

        // Initialize Canvas & Combat Engine
        const canvas = document.getElementById("fightCanvas");
        this.engine = new CombatEngine(canvas);
        this.engine.onMatchEvent = (type, data) => this.handleCombatEvent(type, data);

        // Bind UI Events
        this.bindEvents();

        // Update Wallet & HUD
        window.bettingSystem.saveBalance();
        this.renderRosterTable();

        // Start initial match
        this.setupNextMatch();

        // Start loop
        requestAnimationFrame((t) => this.loop(t));
    }

    saveRoster() {
        localStorage.setItem("salty_roster_v2", JSON.stringify(this.roster));
    }

    bindEvents() {
        // Betting Buttons
        document.querySelectorAll(".bet-chip").forEach(btn => {
            btn.addEventListener("click", () => {
                const corner = btn.dataset.corner;
                const amtStr = btn.dataset.amount;
                let amt = amtStr === "all" ? window.bettingSystem.balance : parseInt(amtStr);
                const res = window.bettingSystem.placeBet(corner, amt);
                if (!res.success) alert(res.msg);
                else this.updateBettingUI();
            });
        });

        // Custom Bet Button
        const customBetBtn = document.getElementById("btnCustomBet");
        if (customBetBtn) {
            customBetBtn.addEventListener("click", () => {
                const corner = document.querySelector('input[name="cornerSelect"]:checked')?.value || "red";
                const inputAmt = parseInt(document.getElementById("customBetAmount").value);
                if (isNaN(inputAmt) || inputAmt <= 0) {
                    alert("Please enter a valid bet amount!");
                    return;
                }
                const res = window.bettingSystem.placeBet(corner, inputAmt);
                if (!res.success) alert(res.msg);
                else this.updateBettingUI();
            });
        }

        // Bailout Button
        const bailoutBtn = document.getElementById("btnBailout");
        if (bailoutBtn) {
            bailoutBtn.addEventListener("click", () => {
                if (!window.bettingSystem.claimBailout()) {
                    alert("You can only claim a Salty Bailout when your balance is under $100!");
                }
            });
        }

        // Skip Bet Countdown
        const skipBetBtn = document.getElementById("btnSkipBetting");
        if (skipBetBtn) {
            skipBetBtn.addEventListener("click", () => {
                if (this.state === "betting") this.bettingCountdown = 0;
            });
        }

        // Prompt Generator Open / Close
        const btnCreateModal = document.getElementById("btnOpenCreateModal");
        const createModal = document.getElementById("createModal");
        const btnCloseCreate = document.getElementById("btnCloseCreateModal");

        if (btnCreateModal && createModal) {
            btnCreateModal.addEventListener("click", () => {
                createModal.classList.remove("hidden");
                this.rollRandomPrompt();
            });
        }
        if (btnCloseCreate && createModal) {
            btnCloseCreate.addEventListener("click", () => createModal.classList.add("hidden"));
        }

        // Roll Random Prompt Idea
        const btnRandomPrompt = document.getElementById("btnRandomPrompt");
        if (btnRandomPrompt) {
            btnRandomPrompt.addEventListener("click", () => this.rollRandomPrompt());
        }

        // Generate / Preview Fighter
        const btnPreviewFighter = document.getElementById("btnPreviewFighter");
        if (btnPreviewFighter) {
            btnPreviewFighter.addEventListener("click", () => this.previewCustomFighter());
        }

        // Save & Add Custom Fighter
        const btnSaveFighter = document.getElementById("btnSaveFighter");
        if (btnSaveFighter) {
            btnSaveFighter.addEventListener("click", () => this.saveCustomFighter());
        }

        // Roster / Leaderboard Modal Open/Close
        const btnOpenRoster = document.getElementById("btnOpenRoster");
        const rosterModal = document.getElementById("rosterModal");
        const btnCloseRoster = document.getElementById("btnCloseRoster");

        if (btnOpenRoster && rosterModal) {
            btnOpenRoster.addEventListener("click", () => {
                rosterModal.classList.remove("hidden");
                this.renderRosterTable();
            });
        }
        if (btnCloseRoster && rosterModal) {
            btnCloseRoster.addEventListener("click", () => rosterModal.classList.add("hidden"));
        }

        // Speed multi-buttons
        document.querySelectorAll(".speed-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".speed-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.speedMultiplier = parseFloat(btn.dataset.speed);
            });
        });

        // Chat send input
        const chatInput = document.getElementById("userChatInput");
        const chatSend = document.getElementById("btnSendChat");
        const sendMsg = () => {
            const txt = chatInput.value.trim();
            if (txt) {
                window.bettingSystem.addChatMessage("YOU", txt, "user");
                chatInput.value = "";
            }
        };
        if (chatSend) chatSend.addEventListener("click", sendMsg);
        if (chatInput) chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMsg(); });

        // Audio toggle buttons
        const btnToggleSound = document.getElementById("btnToggleSound");
        if (btnToggleSound) {
            btnToggleSound.addEventListener("click", () => {
                window.soundSynth.enabled = !window.soundSynth.enabled;
                btnToggleSound.innerText = window.soundSynth.enabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
            });
        }

        const btnToggleVoice = document.getElementById("btnToggleVoice");
        if (btnToggleVoice) {
            btnToggleVoice.addEventListener("click", () => {
                window.soundSynth.announcerEnabled = !window.soundSynth.announcerEnabled;
                btnToggleVoice.innerText = window.soundSynth.announcerEnabled ? "🎙️ Voice: ON" : "🔇 Voice: OFF";
            });
        }
    }

    rollRandomPrompt() {
        const input = document.getElementById("promptInput");
        if (input) {
            input.value = window.fighterGenerator.getRandomIdea();
            this.previewCustomFighter();
        }
    }

    previewCustomFighter() {
        const input = document.getElementById("promptInput");
        const val = input ? input.value : "Pop-Tart Wombat";
        const fighter = window.fighterGenerator.generateFighter(val);
        this.previewedFighter = fighter;

        const previewContainer = document.getElementById("fighterPreviewCard");
        if (!previewContainer) return;

        previewContainer.innerHTML = `
            <div class="preview-header" style="border-left: 4px solid ${fighter.appearance.colors.glow}">
                <h3>[${fighter.tier}] ${fighter.name}</h3>
                <span class="preview-title">"${fighter.title}"</span>
                <div class="preview-archetype">Class: <strong>${fighter.weightClass} (${fighter.mass}kg)</strong> | Archetype: <strong>${fighter.archetype}</strong></div>
            </div>
            <div class="preview-stats-grid">
                <div>❤️ HP: <strong>${fighter.stats.maxHp}</strong></div>
                <div>🛡️ Poise: <strong>${fighter.stats.maxPoise}</strong></div>
                <div>⚔️ ATK: <strong>${fighter.stats.attack}</strong></div>
                <div>🛡️ DEF: <strong>${fighter.stats.defense}</strong></div>
                <div>⚡ SPD: <strong>${fighter.stats.speed}</strong></div>
                <div>💥 CRIT: <strong>${Math.round(fighter.stats.critRate * 100)}%</strong></div>
            </div>
            <div class="preview-moves">
                <div class="move-item"><span>High Strike:</span> <strong>${fighter.moves.light.name}</strong> [Headzone]</div>
                <div class="move-item"><span>Body Strike:</span> <strong>${fighter.moves.heavy.name}</strong> [Torsozone]</div>
                <div class="move-item"><span>Low Sweep:</span> <strong>${fighter.moves.lowSweep.name}</strong> [Legzone - Trips]</div>
                <div class="move-item"><span>Special Ballistic:</span> <strong>${fighter.moves.special1.name}</strong></div>
                <div class="move-item super"><span>★ ULTIMATE:</span> <strong>${fighter.moves.ultimate.name}</strong></div>
            </div>
            <div class="preview-quote">
                <em>${fighter.quotes.intro}</em>
            </div>
        `;
    }

    saveCustomFighter() {
        if (!this.previewedFighter) return;
        this.roster.push(this.previewedFighter);
        this.saveRoster();
        this.renderRosterTable();

        window.bettingSystem.addSystemChat(`✨ NEW FIGHTER REGISTERED: ${this.previewedFighter.name} (${this.previewedFighter.mass}kg) entered the arena!`);
        alert(`"${this.previewedFighter.name}" successfully added to the Salty Roster!`);

        const createModal = document.getElementById("createModal");
        if (createModal) createModal.classList.add("hidden");
    }

    setupNextMatch() {
        if (this.roster.length < 2) {
            this.roster = [...window.DEFAULT_ROSTER];
            this.saveRoster();
        }

        const idx1 = Math.floor(Math.random() * this.roster.length);
        let idx2 = Math.floor(Math.random() * this.roster.length);
        while (idx2 === idx1 && this.roster.length > 1) {
            idx2 = Math.floor(Math.random() * this.roster.length);
        }

        this.currentFighter1 = this.roster[idx1];
        this.currentFighter2 = this.roster[idx2];

        this.state = "betting";
        this.bettingCountdown = 12;

        window.bettingSystem.calculateOdds(this.currentFighter1, this.currentFighter2);
        this.updateFighterCardsUI();
        this.updateBettingUI();

        if (this.bettingTimerId) clearInterval(this.bettingTimerId);
        this.bettingTimerId = setInterval(() => {
            this.bettingCountdown--;
            const timerEl = document.getElementById("betCountdown");
            if (timerEl) timerEl.innerText = this.bettingCountdown.toString();

            if (this.bettingCountdown <= 0) {
                clearInterval(this.bettingTimerId);
                this.startCombatMatch();
            }
        }, 1000);
    }

    startCombatMatch() {
        this.state = "fighting";
        window.bettingSystem.closeBetting();
        this.updateBettingUI();

        this.engine.resetMatch(this.currentFighter1, this.currentFighter2);
    }

    handleCombatEvent(type, data) {
        window.bettingSystem.handleCombatEvent(type, data);

        if (type === "match_end") {
            this.handleMatchEnd(data.winner);
        }
    }

    handleMatchEnd(winnerEntity) {
        this.state = "payout";
        const winningCorner = winnerEntity.corner;
        const winnerData = winnerEntity.data;
        const loserData = winnerEntity.corner === "red" ? this.currentFighter2 : this.currentFighter1;

        window.bettingSystem.resolveBets(winningCorner);

        const rWinner = this.roster.find(f => f.id === winnerData.id || f.name === winnerData.name);
        const rLoser = this.roster.find(f => f.id === loserData.id || f.name === loserData.name);

        if (rWinner) {
            rWinner.record.wins++;
            rWinner.record.kos++;
            rWinner.record.streaks++;
            rWinner.mmr = (rWinner.mmr || 1000) + 25;
            this.updateTierRating(rWinner);
        }
        if (rLoser) {
            rLoser.record.losses++;
            rLoser.record.streaks = 0;
            rLoser.mmr = Math.max(500, (rLoser.mmr || 1000) - 20);
            this.updateTierRating(rLoser);
        }
        this.saveRoster();
        this.renderRosterTable();

        setTimeout(() => {
            this.setupNextMatch();
        }, 5000);
    }

    updateTierRating(fighter) {
        const mmr = fighter.mmr || 1000;
        if (mmr >= 1350) fighter.tier = "X";
        else if (mmr >= 1200) fighter.tier = "S";
        else if (mmr >= 1050) fighter.tier = "A";
        else if (mmr >= 900) fighter.tier = "B";
        else fighter.tier = "SALT";
    }

    updateFighterCardsUI() {
        const f1 = this.currentFighter1;
        const f2 = this.currentFighter2;

        const redCard = document.getElementById("redFighterCard");
        const blueCard = document.getElementById("blueFighterCard");

        if (redCard && f1) {
            redCard.innerHTML = `
                <div class="corner-badge red">RED CORNER</div>
                <div class="fighter-name">[${f1.tier}] ${f1.name}</div>
                <div class="fighter-title">"${f1.title}"</div>
                <div class="fighter-weight-class">Class: <strong>${f1.weightClass || "Middleweight"} (${f1.mass || 75}kg)</strong></div>
                <div class="fighter-odds">Odds: <strong>${window.bettingSystem.redOdds}x</strong></div>
                <div class="fighter-record">W/L: ${f1.record.wins}W - ${f1.record.losses}L (Streak: ${f1.record.streaks})</div>
                <div class="fighter-stats-mini">
                    <span>HP: ${f1.stats.maxHp}</span> | <span>Poise: ${f1.stats.maxPoise || 100}</span> | <span>ATK: ${f1.stats.attack}</span>
                </div>
            `;
        }

        if (blueCard && f2) {
            blueCard.innerHTML = `
                <div class="corner-badge blue">BLUE CORNER</div>
                <div class="fighter-name">[${f2.tier}] ${f2.name}</div>
                <div class="fighter-title">"${f2.title}"</div>
                <div class="fighter-weight-class">Class: <strong>${f2.weightClass || "Middleweight"} (${f2.mass || 75}kg)</strong></div>
                <div class="fighter-odds">Odds: <strong>${window.bettingSystem.blueOdds}x</strong></div>
                <div class="fighter-record">W/L: ${f2.record.wins}W - ${f2.record.losses}L (Streak: ${f2.record.streaks})</div>
                <div class="fighter-stats-mini">
                    <span>HP: ${f2.stats.maxHp}</span> | <span>Poise: ${f2.stats.maxPoise || 100}</span> | <span>ATK: ${f2.stats.attack}</span>
                </div>
            `;
        }
    }

    updateBettingUI() {
        const statusEl = document.getElementById("bettingStatus");
        const betInfoEl = document.getElementById("activeBetInfo");

        if (statusEl) {
            statusEl.innerText = this.state === "betting" ? "BETTING IS OPEN!" : (this.state === "fighting" ? "FIGHT IN PROGRESS" : "RESOLVING PAYOUTS");
            statusEl.className = `betting-status-banner ${this.state}`;
        }

        if (betInfoEl) {
            if (window.bettingSystem.currentBet) {
                const b = window.bettingSystem.currentBet;
                const odds = b.corner === "red" ? window.bettingSystem.redOdds : window.bettingSystem.blueOdds;
                const potPayout = Math.round(b.amount * odds);
                betInfoEl.innerHTML = `Current Bet: <strong>$${b.amount.toLocaleString()}</strong> on <span class="corner-${b.corner}">${b.corner.toUpperCase()}</span> (Potential Win: <strong>+$${potPayout.toLocaleString()}</strong>)`;
            } else {
                betInfoEl.innerText = "No active bet placed for this match.";
            }
        }

        document.querySelectorAll(".bet-chip, #btnCustomBet").forEach(btn => {
            btn.disabled = this.state !== "betting";
        });
    }

    renderRosterTable() {
        const tbody = document.getElementById("rosterTableBody");
        if (!tbody) return;

        const sorted = [...this.roster].sort((a, b) => (b.mmr || 1000) - (a.mmr || 1000));
        tbody.innerHTML = sorted.map((f, i) => `
            <tr>
                <td>#${i + 1}</td>
                <td><span class="tier-pill tier-${f.tier}">${f.tier}</span></td>
                <td><strong>${f.name}</strong><br><small style="color:#aaa;">${f.title}</small></td>
                <td>${f.weightClass || "Middleweight"}<br><small style="color:#88a;">${f.mass || 75}kg | Poise: ${f.stats.maxPoise || 100}</small></td>
                <td>${f.mmr || 1000}</td>
                <td>${f.record.wins}W / ${f.record.losses}L</td>
                <td>🔥 ${f.record.streaks}</td>
                <td>
                    <button class="btn-sm" onclick="window.saltyApp.forceMatch('${f.id}')">Fight Next</button>
                </td>
            </tr>
        `).join("");
    }

    forceMatch(fighterId) {
        const f = this.roster.find(x => x.id === fighterId);
        if (!f) return;
        this.currentFighter1 = f;
        const rosterModal = document.getElementById("rosterModal");
        if (rosterModal) rosterModal.classList.add("hidden");
        this.setupNextMatch();
    }

    loop(time) {
        if (this.state === "fighting" || this.state === "payout" || this.state === "betting") {
            this.engine.update(this.speedMultiplier);
            this.engine.render(time);
        }
        requestAnimationFrame((t) => this.loop(t));
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.saltyApp = new SaltyApp();
    window.saltyApp.init();
});
