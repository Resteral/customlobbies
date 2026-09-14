# ⚡ SALTY-GEN: AI Fight Club (AI Fighting Arena & Spectator Betting Game)

An automated AI-vs-AI fighting arena and spectator betting simulator inspired by **SaltyBet** and **M.U.G.E.N**. 

Users can prompt and create any character imaginable (such as the legendary **Pop-Tart Wombat**, **Goku of Spaghetti**, or **Cyberpunk Capybara**), place virtual **SaltyBucks** bets based on calculated odds, and watch the AI fighters brawl in real-time on a 2D combat canvas with custom moves, super attacks, and simulated Twitch stream hype chat!

---

## 🎮 Features

1. **🧬 AI Prompt-to-Fighter Generator**:
   - Type any name or concept (e.g. `Pop-Tart Wombat`, `Anxious Espresso Machine`, `Vampire Chainsaw Duck`).
   - Generates procedural stats (HP, ATK, DEF, SPD, CRIT, Super Meter Gain), Archetype (Rushdown, Zoner, Juggernaut, Trickster, Glass Cannon, Grappler), and tailored colors.
   - Generates 3 unique special moves + 1 screen-shaking **Ultimate Super Attack**.
   - Procedural 2D skeletal canvas sprites with custom bodies, eyes, weapons, and particle effects.

2. **🎰 SaltyBet Spectator Wagering System**:
   - Live pre-fight betting countdown with dynamic odds calculation (e.g. 2.40x vs 1.65x) based on fighter MMR, tier, and win streaks.
   - Quick bet chips ($100, $500, $2,500, "ALL IN!") or custom bet amounts.
   - Bankroll tracking with a **Salty Bailout** button when you go broke.

3. **⚔️ 2D Canvas Combat Engine (60 FPS)**:
   - Dynamic AI decision making: footsies, spacing, dashes, jumps, blocks, combos, juggling, and projectiles.
   - Super meter gauge: charge up and unleash cinematic ultimate attacks with screen freeze, background dimming, and camera shakes.
   - Dramatic slow-motion KO impact finishes.
   - Speed controls: 1x, 1.5x, 2x match acceleration.

4. **💬 Simulated Twitch / Salty Stream Chat**:
   - Automated live chat stream with thousands of virtual spectators reacting dynamically to critical hits, super moves, massive combos, and crazy underdog upsets.
   - Interactive user chat box to talk with the crowd.

5. **🔊 Web Audio Procedural Synthesizer & Speech Announcer**:
   - 16-bit retro arcade hit sounds, laser whooshes, block clangs, super explosions, and coin sounds.
   - Browser Web Speech API announcer calling out the rounds, fighter names, and KO victories.

6. **🏆 Fighter Hall of Fame & Tier Rankings**:
   - Rank progression from **Salt Tier (F)** to **God Tier (X)** based on MMR and win/loss records.
   - Saved persistently in browser `localStorage`.

---

## 🚀 How to Run

Simply open `salty_ai_arena/index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari) or serve with any local HTTP server:

```powershell
# Using Python
cd salty_ai_arena
python -m http.server 8080

# Or using Node npx http-server
npx http-server ./salty_ai_arena -p 8080
```
Then navigate to `http://localhost:8080` in your browser!
