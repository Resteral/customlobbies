const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');

const startIndex = content.indexOf("if (!window.wardogsEngine) return;");
if (startIndex === -1) throw new Error("Could not find start");
const startSlice = content.substring(0, startIndex + 34); // Keep this line

const endIndex = content.indexOf("  challengeWardogsSquad(squadName) {");
if (endIndex === -1) throw new Error("Could not find end");

const endSlice = content.substring(endIndex);

const newLogic = `

    // Render Scraped Live Telemetry Stats
    const telemetry = window.wardogsEngine.scrapeLiveWardogsTelemetry();
    const telemetryElem = document.getElementById('wardogsTelemetryContainer');
    if (telemetryElem) {
      telemetryElem.innerHTML = \`
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-weight: 900; color: #ffab00; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
              <span class="live-dot" style="display: inline-block; width: 10px; height: 10px; background: #00e676; border-radius: 50%; box-shadow: 0 0 10px #00e676;"></span>
              <span>LIVE WARDOGS TELEMETRY & STEAM STATS</span>
              <span class="lobby-game-tag" style="background: rgba(255, 111, 0, 0.2); color: #ffab00; border: 1px solid #ff6f00;">\${telemetry.developer}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
              Official Early Access Data • \${telemetry.releaseDate} • \${telemetry.activeMatchFormat}
            </div>
          </div>
          <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; text-align: center;">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Active Concurrent</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: var(--accent-green);">\${telemetry.activeConcurrentPlayers.toLocaleString()} 🟢</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Steam Peak</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: var(--accent-cyan);">\${telemetry.peakConcurrentPlayers.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Twitch Viewers</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: #b9a3e3;">💜 \${telemetry.twitchConcurrentViewers.toLocaleString()}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Steam Rating</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: var(--accent-gold);">\${telemetry.steamApprovalRating}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Persistent Economy</div>
              <div style="font-size: 1.15rem; font-weight: 900; color: #ff6f00;">\${telemetry.persistentEconomyBalance}</div>
            </div>
          </div>
        </div>
      \`;
    }

    // Gather all teams (System Mock + User Created)
    const systemSquads = window.wardogsEngine.registeredSquads.filter(s => s.game === selectedGame || s.game === 'WARDOGS');
    const userTeams = this.myCreatedTeams.filter(t => t.game === selectedGame || t.game === 'WARDOGS');
    const allTeams = [...userTeams, ...systemSquads];

    // Gather free agents
    const solos = window.wardogsEngine.soloMercenaries.filter(m => m.game === selectedGame || m.game === 'WARDOGS');

    container.innerHTML = \`
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; align-items: start;">
        
        <!-- TEAMS COLUMN -->
        <div>
          <h2 style="color: #ffab00; font-size: 1.3rem; margin-bottom: 1rem; font-weight: 900; text-transform: uppercase;">🛡️ Registered Teams & Rosters</h2>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            \${allTeams.map(t => {
              // Extract members array if it exists (user teams), otherwise generate mock members for system squads
              let membersHtml = '';
              if (t.members && Array.isArray(t.members)) {
                membersHtml = t.members.map(m => \`
                  <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.85rem; margin-bottom: 0.25rem;">
                    <span><strong style="color: #fff;">\${m.name}</strong> <span style="color: var(--text-muted); font-size: 0.75rem;">(\${m.role || 'Operative'})</span></span>
                    <span style="color: var(--accent-purple); font-weight: 800;">\${m.elo || 1800} MMR</span>
                  </div>
                \`).join('');
              } else {
                // Mock system squad members based on captain
                membersHtml = \`
                  <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.85rem; margin-bottom: 0.25rem;">
                    <span><strong style="color: #fff;">\${t.captain || 'Ghost_Dog_99'}</strong> <span style="color: var(--text-muted); font-size: 0.75rem;">(Captain)</span></span>
                    <span style="color: var(--accent-purple); font-weight: 800;">2400 MMR</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.2rem 0.4rem;">
                    + \${t.membersCount ? t.membersCount - 1 : 32} Other Enlisted Operatives...
                  </div>
                \`;
              }

              return \`
                <div class="card" style="border-color: rgba(255, 111, 0, 0.5); background: rgba(0,0,0,0.4);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div>
                      <h3 style="font-size: 1.2rem; font-weight: 900; margin: 0; color: #fff;">\${t.name} <span style="color: var(--accent-gold); font-size: 0.85rem;">\${t.tag || ''}</span></h3>
                      <div style="font-size: 0.78rem; color: var(--accent-cyan); font-weight: 700; margin-top: 0.2rem;">Allegiance: \${t.faction || '🔵 Vanguard Command'}</div>
                    </div>
                    <span class="lobby-game-tag" style="background: rgba(0, 229, 255, 0.15); color: var(--accent-cyan);">Team Roster</span>
                  </div>
                  <div style="margin-top: 0.8rem;">
                    \${membersHtml}
                  </div>
                </div>
              \`;
            }).join('')}
          </div>
        </div>

        <!-- FREE AGENTS COLUMN -->
        <div>
          <h2 style="color: var(--accent-cyan); font-size: 1.3rem; margin-bottom: 1rem; font-weight: 900; text-transform: uppercase;">🐕 Free Agent Pool</h2>
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            \${solos.map(m => {
              const rolePreset = window.wardogsEngine.rolePresets ? (window.wardogsEngine.rolePresets[m.role] || window.wardogsEngine.rolePresets['⚡ Breacher / Assault']) : { primary: 'Standard Rifle', gadget: 'Frag Grenade' };
              return \`
              <div class="card" style="border-left: 3px solid var(--accent-cyan); padding: 0.8rem; background: rgba(0,0,0,0.4);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <strong style="color: #fff; font-size: 1.05rem;">\${m.name}</strong>
                  <span style="font-size: 0.7rem; color: var(--accent-gold);">\${m.callsign}</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                  Role: <span style="color: #fff;">\${m.role}</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.6rem;">
                  Loadout: <span style="color: var(--accent-cyan);">\${rolePreset.primary}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 0.3rem 0.5rem; border-radius: 4px;">
                  <strong style="color: var(--accent-purple); font-size: 0.8rem;">\${m.elo} MMR</strong>
                  <button class="btn btn-purple btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="window.app.recruitPlayerToTeam('\${m.id}', '\${m.name}', '\${m.callsign}')">➕ Recruit</button>
                </div>
              </div>
              \`;
            }).join('')}
          </div>
        </div>

      </div>
    \`;
  }
`;

fs.writeFileSync('js/app.js', startSlice + newLogic + "\n" + endSlice);
