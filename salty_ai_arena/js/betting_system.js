/**
 * BettingSystem - SaltyBet Wagering Engine & Simulated Crowd Hype Chat
 * Handles betting pools, live odds, user wallet, and reactive Twitch/Salty chat stream.
 */
class BettingSystem {
    constructor() {
        this.balance = parseInt(localStorage.getItem("salty_balance")) || 1000;
        this.currentBet = null; // { corner: "red"|"blue", amount: 100 }
        this.redPool = 0;
        this.bluePool = 0;
        this.redOdds = 1.9;
        this.blueOdds = 1.9;
        this.bettingOpen = false;

        this.chatMessages = [];
        this.chatBotNames = [
            "xX_SaltyLord_Xx", "ToasterFan99", "GokuSimp_420", "WombatGod",
            "SaltBot_AI", "PogChamp_Andy", "EZ_Money_Chad", "NeverBetBlue",
            "RedCornerLoyalist", "MemeInvestor", "Kappafication", "BailoutSeeker",
            "AlDenteWarrior", "GlitchSurfer", "AnimePowerScaler", "SaltyOracle"
        ];

        this.chatInterval = null;
    }

    saveBalance() {
        localStorage.setItem("salty_balance", this.balance.toString());
        const el = document.getElementById("walletBalance");
        if (el) el.innerText = `$${this.balance.toLocaleString()}`;
    }

    claimBailout() {
        if (this.balance < 100) {
            this.balance = 500;
            this.saveBalance();
            if (window.soundSynth) window.soundSynth.playCoin();
            this.addSystemChat("🧂 SALTY BAILOUT: You received $500 pity SaltyBucks! Don't lose it all this time!");
            return true;
        }
        return false;
    }

    calculateOdds(f1, f2) {
        // Base rating difference
        const mmrDiff = (f1.mmr || 1000) - (f2.mmr || 1000);
        const winRate1 = f1.record.wins / Math.max(1, (f1.record.wins + f1.record.losses));
        const winRate2 = f2.record.wins / Math.max(1, (f2.record.wins + f2.record.losses));

        let f1Prob = 0.5 + (mmrDiff / 1000) + (winRate1 - winRate2) * 0.2;
        f1Prob = Math.max(0.15, Math.min(0.85, f1Prob));
        const f2Prob = 1 - f1Prob;

        this.redOdds = parseFloat((1 / f1Prob * 0.95).toFixed(2));
        this.blueOdds = parseFloat((1 / f2Prob * 0.95).toFixed(2));

        // Seed simulated crowd betting pools
        const basePool = 25000 + Math.floor(Math.random() * 50000);
        this.redPool = Math.round(basePool * (f1Prob / 0.5));
        this.bluePool = Math.round(basePool * (f2Prob / 0.5));
        this.currentBet = null;
        this.bettingOpen = true;

        this.startPreFightChat(f1, f2);
    }

    placeBet(corner, amount) {
        if (!this.bettingOpen) return { success: false, msg: "Betting is currently closed!" };
        if (amount > this.balance) return { success: false, msg: "Insufficient SaltyBucks!" };
        if (amount <= 0) return { success: false, msg: "Invalid bet amount!" };

        this.balance -= amount;
        this.saveBalance();
        this.currentBet = { corner, amount };

        if (corner === "red") this.redPool += amount;
        else this.bluePool += amount;

        if (window.soundSynth) window.soundSynth.playCoin();
        this.addSystemChat(`💰 You bet $${amount.toLocaleString()} on [${corner.toUpperCase()} CORNER]! (Odds: ${corner === "red" ? this.redOdds : this.blueOdds}x)`);

        return { success: true, bet: this.currentBet };
    }

    closeBetting() {
        this.bettingOpen = false;
    }

    resolveBets(winningCorner) {
        this.bettingOpen = false;
        let payout = 0;

        if (this.currentBet) {
            if (this.currentBet.corner === winningCorner) {
                const odds = winningCorner === "red" ? this.redOdds : this.blueOdds;
                payout = Math.round(this.currentBet.amount * odds);
                this.balance += payout;
                this.saveBalance();

                if (window.soundSynth) window.soundSynth.playCoin();
                this.addSystemChat(`🎉 BET WON! You won +$${payout.toLocaleString()} SaltyBucks!`);
            } else {
                this.addSystemChat(`💀 BET LOST! You lost $${this.currentBet.amount.toLocaleString()}... PJSalt`);
            }
        }
        this.currentBet = null;
        return payout;
    }

    // --- Simulated Twitch/Salty Chat Engine ---

    addChatMessage(user, text, badge = "user") {
        this.chatMessages.push({ user, text, badge, time: Date.now() });
        if (this.chatMessages.length > 60) this.chatMessages.shift();

        const container = document.getElementById("chatMessages");
        if (!container) return;

        const row = document.createElement("div");
        row.className = `chat-msg ${badge}`;
        row.innerHTML = `<span class="chat-badge ${badge}">${badge.toUpperCase()}</span> <strong class="chat-user">${user}:</strong> <span class="chat-text">${text}</span>`;
        container.appendChild(row);
        container.scrollTop = container.scrollHeight;
    }

    addSystemChat(text) {
        this.addChatMessage("ARENA BOT", text, "system");
    }

    startPreFightChat(f1, f2) {
        if (this.chatInterval) clearInterval(this.chatInterval);

        const preQuotes = [
            `ALL IN ON ${f1.name.toUpperCase()}! FREE MONEY!`,
            `!bet red ${Math.floor(Math.random() * 2000 + 100)}`,
            `!bet blue ${Math.floor(Math.random() * 2000 + 100)}`,
            `Never doubt ${f2.name}, easy upset incoming!`,
            `LOOK AT THOSE ODDS! ${this.redOdds}x vs ${this.blueOdds}x`,
            `My entire bankroll is on ${f1.name} PogChamp`,
            `If ${f2.name} loses I am declaring bankruptcy LMAO`,
            `${f1.name} has the reach advantage for sure`,
            `RED IS GOING TO CRUMBLE PJSalt`,
            `Always bet on the food characters!!`
        ];

        this.chatInterval = setInterval(() => {
            if (!this.bettingOpen) return;
            const bot = this.chatBotNames[Math.floor(Math.random() * this.chatBotNames.length)];
            const msg = preQuotes[Math.floor(Math.random() * preQuotes.length)];
            this.addChatMessage(bot, msg, Math.random() < 0.2 ? "vip" : "user");
        }, 1400);
    }

    handleCombatEvent(eventType, data) {
        const bot = this.chatBotNames[Math.floor(Math.random() * this.chatBotNames.length)];

        if (eventType === "super_activated") {
            const superQuotes = [
                `HOLY CRAP THE SUPER MOVE! 🔥🔥🔥`,
                `LOOK AT THAT ANIMATION OMGGGG`,
                `IT'S OVER!! THAT'S A 1-HIT KO!`,
                `RUN! GET OUT OF THE WAY!`,
                `CINEMATIC IMPACT PogChamp PogChamp`
            ];
            this.addChatMessage(bot, superQuotes[Math.floor(Math.random() * superQuotes.length)], "hype");
        } else if (eventType === "damage" && data.combo >= 4) {
            this.addChatMessage(bot, `DAMN THAT ${data.combo}-HIT COMBO WAS CLEAN!`, "hype");
        } else if (eventType === "ko") {
            const koQuotes = [
                `K.O.! THE UPSET IS REAL! OMEGALUL`,
                `NEVER DOUBT THE CHAMP! EZ SALTYBUCKS!`,
                `RIGGED! REF WAS BLIND! PJSalt`,
                `I AM BROKE AGAIN! BAILOUT TIME!`,
                `What a fight! GG WP!`
            ];
            this.addChatMessage(bot, koQuotes[Math.floor(Math.random() * koQuotes.length)], "winner");
        }
    }
}

window.bettingSystem = new BettingSystem();
