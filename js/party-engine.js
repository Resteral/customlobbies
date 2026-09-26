/* CustomLobbies.com - Dedicated Global Party Management Engine
 * Allows players to group up in the same party, queue directly onto teams in lobbies and matchmaking,
 * and highlights party members across all online player rosters.
 */
class PartyEngine {
  constructor() {
    this.maxMembers = 5;
    this.party = this.loadPartyState();
    this.init();
  }

  loadPartyState() {
    try {
      const saved = localStorage.getItem('cl_user_party_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load party state:', e);
    }

    return this.createDefaultParty();
  }

  createDefaultParty() {
    const localUser = this.getLocalUserInfo();
    return {
      partyId: 'party_' + Date.now().toString(36),
      createdAt: Date.now(),
      leader: localUser.name,
      members: [
        {
          id: localUser.id,
          name: localUser.name,
          avatar: localUser.avatar,
          elo: localUser.elo,
          role: 'Party Leader',
          isLeader: true,
          ready: true,
          isLocal: true,
          teamTag: localUser.teamTag || 'CL'
        }
      ]
    };
  }

  getLocalUserInfo() {
    let name = 'You (Host)';
    let avatar = '👑';
    let elo = 2150;
    let teamTag = 'CL';

    if (window.app && window.app.user) {
      if (window.app.user.displayName) name = window.app.user.displayName;
      if (window.app.user.emblem || window.app.user.avatar) avatar = window.app.user.emblem || window.app.user.avatar;
      if (window.app.user.elo) elo = window.app.user.elo;
      if (window.app.user.teamTag) teamTag = window.app.user.teamTag;
    } else {
      const savedName = localStorage.getItem('cl_username');
      const savedAvatar = localStorage.getItem('cl_user_avatar');
      if (savedName) name = savedName;
      if (savedAvatar) avatar = savedAvatar;
    }

    return { id: 'usr_local_me', name, avatar, elo, teamTag };
  }

  savePartyState() {
    try {
      localStorage.setItem('cl_user_party_v1', JSON.stringify(this.party));
    } catch (e) {
      console.warn('Could not save party state:', e);
    }
    this.syncDiscordActivity();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.refreshLocalUser();
      this.renderPartyUI();
    });

    // If DOM is already loaded
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      setTimeout(() => {
        this.refreshLocalUser();
        this.renderPartyUI();
      }, 100);
    }
  }

  refreshLocalUser() {
    const localInfo = this.getLocalUserInfo();
    const localMember = this.party.members.find(m => m.isLocal);
    if (localMember) {
      localMember.name = localInfo.name;
      localMember.avatar = localInfo.avatar;
      localMember.elo = localInfo.elo;
      if (localMember.isLeader) {
        this.party.leader = localInfo.name;
      }
      this.savePartyState();
    }
  }

  getMembers() {
    return this.party.members || [];
  }

  getMemberCount() {
    return this.party.members ? this.party.members.length : 1;
  }

  isPartyFull() {
    return this.getMemberCount() >= this.maxMembers;
  }

  isInParty(playerName) {
    if (!playerName) return false;
    const cleanName = playerName.trim().toLowerCase();
    return this.getMembers().some(m => m.name.toLowerCase() === cleanName);
  }

  isPartyLeader(playerName) {
    const name = playerName || this.getLocalUserInfo().name;
    return this.party.leader.toLowerCase() === name.toLowerCase();
  }

  // Invite player to party
  invitePlayer(playerOrName) {
    if (this.isPartyFull()) {
      this.showToast(`⚠️ Your party is full (${this.maxMembers}/${this.maxMembers})!`, 'error');
      return false;
    }

    let targetPlayer = null;

    if (typeof playerOrName === 'string') {
      // Look up in onlineUsers or leaderboard
      const name = playerOrName.trim();
      if (this.isInParty(name)) {
        this.showToast(`ℹ️ ${name} is already in your party!`, 'info');
        return false;
      }

      if (window.chatVoiceManager && Array.isArray(window.chatVoiceManager.onlineUsers)) {
        targetPlayer = window.chatVoiceManager.onlineUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
      }

      if (!targetPlayer && window.app && Array.isArray(window.app.leaderboardData)) {
        targetPlayer = window.app.leaderboardData.find(u => u.name.toLowerCase() === name.toLowerCase());
      }

      if (!targetPlayer) {
        targetPlayer = {
          name: name,
          avatar: '🎮',
          elo: Math.floor(Math.random() * 800 + 1900),
          teamTag: 'SQUAD'
        };
      }
    } else if (typeof playerOrName === 'object' && playerOrName) {
      targetPlayer = playerOrName;
    }

    if (!targetPlayer || !targetPlayer.name) return false;

    if (this.isInParty(targetPlayer.name)) {
      this.showToast(`ℹ️ ${targetPlayer.name} is already in your party!`, 'info');
      return false;
    }

    // Add to party members
    const newMember = {
      id: 'party_mem_' + Math.random().toString(36).substring(2, 9),
      name: targetPlayer.name,
      avatar: targetPlayer.avatar || '🎮',
      elo: targetPlayer.mmr || targetPlayer.elo || 2200,
      role: targetPlayer.role || 'Flex Scrimmer',
      teamTag: targetPlayer.teamTag || 'SQUAD',
      isLeader: false,
      ready: true,
      isLocal: false
    };

    this.party.members.push(newMember);
    this.savePartyState();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    this.showToast(`🎉 ${targetPlayer.name} joined your party! (${this.getMemberCount()}/${this.maxMembers})`, 'success');
    this.renderPartyUI();

    // Also notify chat voice manager to re-render online users with party highlighted
    if (window.chatVoiceManager && typeof window.chatVoiceManager.renderOnlineUsers === 'function') {
      window.chatVoiceManager.renderOnlineUsers();
    }

    return true;
  }

  // Remove player from party
  kickMember(memberName) {
    if (!memberName) return;
    const member = this.party.members.find(m => m.name.toLowerCase() === memberName.toLowerCase());
    if (!member) return;

    if (member.isLocal) {
      this.leaveParty();
      return;
    }

    this.party.members = this.party.members.filter(m => m.name.toLowerCase() !== memberName.toLowerCase());
    this.savePartyState();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('button_click');
    }

    this.showToast(`👋 Removed ${memberName} from the party.`, 'info');
    this.renderPartyUI();

    if (window.chatVoiceManager && typeof window.chatVoiceManager.renderOnlineUsers === 'function') {
      window.chatVoiceManager.renderOnlineUsers();
    }
  }

  // Leave Party
  leaveParty() {
    this.party = this.createDefaultParty();
    this.savePartyState();

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('button_click');
    }

    this.showToast('🚪 You left the party and are now solo.', 'info');
    this.renderPartyUI();

    if (window.chatVoiceManager && typeof window.chatVoiceManager.renderOnlineUsers === 'function') {
      window.chatVoiceManager.renderOnlineUsers();
    }
  }

  // Disband Party
  disbandParty() {
    this.leaveParty();
  }

  // Toggle member ready state
  toggleReady(memberName) {
    const name = memberName || this.getLocalUserInfo().name;
    const member = this.party.members.find(m => m.name.toLowerCase() === name.toLowerCase());
    if (member) {
      member.ready = !member.ready;
      this.savePartyState();
      this.renderPartyUI();
      if (window.widgetBuilderEngine) {
        window.widgetBuilderEngine.playSoundEffect('queue_join');
      }
    }
  }

  // Toggle local player ready state
  toggleMyReady() {
    const localInfo = this.getLocalUserInfo();
    this.toggleReady(localInfo.name);
  }

  // Set all members ready
  readyAllMembers() {
    this.party.members.forEach(m => m.ready = true);
    this.savePartyState();
    this.renderPartyUI();
    this.showToast('✅ All party members are marked READY!', 'success');
  }

  // Copy party invite link to clipboard
  copyPartyInviteLink() {
    const url = `${window.location.origin}${window.location.pathname}?party=${this.party.partyId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('📋 Party Invite Link copied to clipboard! Share with friends.', 'success');
      }).catch(() => {
        prompt('Copy your Party Invite Link:', url);
      });
    } else {
      prompt('Copy your Party Invite Link:', url);
    }
  }

  // Sync party info to Discord Activity Rich Presence
  syncDiscordActivity() {
    if (window.discordActivityEngine && typeof window.discordActivityEngine.setActivity === 'function') {
      const count = this.getMemberCount();
      window.discordActivityEngine.setActivity({
        state: `In Party (${count}/${this.maxMembers} Members)`,
        party: { size: [count, this.maxMembers] }
      });
    }
  }

  // Toast Notification
  showToast(message, type = 'info') {
    if (window.widgetBuilderEngine && typeof window.widgetBuilderEngine.showToast === 'function') {
      window.widgetBuilderEngine.showToast(message, type);
    } else {
      console.log(`[PartyEngine Toast - ${type}]: ${message}`);
    }
  }

  // Open Quick Invite Modal showing all online players
  openPartyInviteModal() {
    let modal = document.getElementById('partyInviteModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'partyInviteModal';
      modal.className = 'modal-backdrop';
      modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;';
      document.body.appendChild(modal);
    }

    const onlineUsers = (window.chatVoiceManager && Array.isArray(window.chatVoiceManager.onlineUsers)) 
      ? window.chatVoiceManager.onlineUsers 
      : [];

    const nonPartyUsers = onlineUsers.filter(u => !this.isInParty(u.name));

    modal.innerHTML = `
      <div class="card" style="width: 100%; max-width: 540px; background: #0c101b; border: 2px solid var(--accent-purple); box-shadow: 0 0 30px rgba(168, 85, 247, 0.35); border-radius: 14px; overflow: hidden; animation: popIn 0.2s ease-out;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1.5rem; background: rgba(168, 85, 247, 0.15); border-bottom: 1px solid rgba(168, 85, 247, 0.3);">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.6rem;">👥</span>
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 900; color: #fff; margin: 0;">Invite Online Players to Party</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Group up together to queue into custom lobbies and scrims on the same team!</p>
            </div>
          </div>
          <button style="background: none; border: none; font-size: 1.5rem; color: #fff; cursor: pointer; padding: 0.2rem;" onclick="document.getElementById('partyInviteModal').remove()">✕</button>
        </div>

        <div style="padding: 1.25rem; max-height: 400px; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-cyan); font-weight: 800;">
              Active Online Players (${nonPartyUsers.length})
            </span>
            <button class="btn btn-secondary btn-sm" onclick="window.partyEngine.copyPartyInviteLink()" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">
              📋 Copy Link
            </button>
          </div>

          ${nonPartyUsers.length === 0 ? `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
              <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🎉</span>
              <strong>Everyone online is already in your party!</strong>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${nonPartyUsers.map(u => {
                const avatarImg = (u.avatar && u.avatar.startsWith('http')) 
                  ? `<img src="${u.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-cyan);">`
                  : `<div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(0, 242, 254, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid var(--accent-cyan);">${u.avatar || '🎮'}</div>`;

                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.6rem 0.8rem; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 0.7rem;">
                      ${avatarImg}
                      <div>
                        <div style="font-weight: 800; font-size: 0.9rem; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
                          ${u.name}
                          ${u.teamTag ? `<span style="font-size: 0.65rem; background: rgba(255, 171, 0, 0.2); color: var(--accent-gold); padding: 0.1rem 0.3rem; border-radius: 4px; font-weight: 900;">${u.teamTag}</span>` : ''}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 0.6rem;">
                          <span style="color: var(--accent-cyan); font-weight: 700;">${u.mmr || u.elo || 2200} MMR</span>
                          <span>•</span>
                          <span style="color: var(--accent-green);">🟢 Online</span>
                        </div>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="window.partyEngine.invitePlayer('${u.name}'); document.getElementById('partyInviteModal').remove();" style="padding: 0.35rem 0.8rem; font-weight: 800; font-size: 0.8rem;">
                      <span>➕</span> Invite
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <div style="padding: 1rem 1.25rem; background: rgba(0,0,0,0.4); border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Party Limit: <strong>${this.getMemberCount()}/${this.maxMembers} Members</strong>
          </span>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('partyInviteModal').remove()">Done</button>
        </div>
      </div>
    `;
  }

  // Render all Party UI Elements
  renderPartyUI() {
    this.renderGlobalPartyBar();
    this.renderMatchmakingPartyRoster();
  }

  // Persistent Global Party Bar at the top of the app
  renderGlobalPartyBar() {
    let bar = document.getElementById('globalPartyBar');
    if (!bar) {
      // Find top navbar or header
      const header = document.querySelector('header') || document.querySelector('.navbar') || document.body;
      bar = document.createElement('div');
      bar.id = 'globalPartyBar';
      bar.className = 'party-top-bar';
      
      if (header && header.classList && header.classList.contains('navbar')) {
        header.parentNode.insertBefore(bar, header.nextSibling);
      } else {
        document.body.insertBefore(bar, document.body.firstChild);
      }
    }

    const members = this.getMembers();
    const count = members.length;
    const isFull = count >= this.maxMembers;
    const localMember = members.find(m => m.isLocal) || members[0];
    const isReady = localMember ? localMember.ready : true;

    bar.innerHTML = `
      <div class="party-bar-inner">
        <!-- Party Info Pill -->
        <div class="party-info-group">
          <div class="party-badge">
            <span class="party-icon">👥</span>
            <span class="party-title">YOUR PARTY</span>
            <span class="party-count-tag">${count}/${this.maxMembers}</span>
          </div>

          <!-- Members Chips -->
          <div class="party-members-scroll">
            ${members.map(m => {
              const isLeader = m.isLeader;
              const readyClass = m.ready ? 'ready-ring' : 'unready-ring';
              const readyTitle = m.ready ? 'Ready for Match' : 'Not Ready';
              const avatarContent = (m.avatar && m.avatar.startsWith('http'))
                ? `<img src="${m.avatar}" class="party-member-avatar ${readyClass}" title="${m.name} (${readyTitle})">`
                : `<span class="party-member-avatar-emoji ${readyClass}" title="${m.name} (${readyTitle})">${m.avatar || '🎮'}</span>`;

              return `
                <div class="party-member-chip ${m.isLocal ? 'local-chip' : ''}">
                  <div class="party-avatar-wrap">
                    ${avatarContent}
                    ${isLeader ? '<span class="party-crown" title="Party Leader">👑</span>' : ''}
                    <span class="party-ready-dot ${m.ready ? 'dot-ready' : 'dot-unready'}"></span>
                  </div>
                  <div class="party-member-text">
                    <span class="party-member-name">${m.name}${m.isLocal ? ' (You)' : ''}</span>
                    <span class="party-member-elo">${m.elo || 2150} MMR</span>
                  </div>
                  ${!m.isLocal ? `
                    <button class="party-chip-kick" onclick="window.partyEngine.kickMember('${m.name}')" title="Kick from Party">✕</button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Party Actions -->
        <div class="party-actions-group">
          <button class="btn btn-sm ${isReady ? 'btn-success' : 'btn-warning'} party-ready-btn" onclick="window.partyEngine.toggleMyReady()">
            ${isReady ? '✔ READY' : '🟡 NOT READY'}
          </button>

          ${!isFull ? `
            <button class="btn btn-primary btn-sm party-invite-btn" onclick="window.partyEngine.openPartyInviteModal()">
              <span>➕</span> Invite Players
            </button>
          ` : `
            <span class="party-full-badge">Full Squad</span>
          `}

          <div class="party-extra-menu">
            <button class="btn btn-secondary btn-sm" onclick="window.partyEngine.copyPartyInviteLink()" title="Copy Party Invite Link">
              🔗 Share
            </button>
            ${count > 1 ? `
              <button class="btn btn-danger btn-sm" onclick="window.partyEngine.leaveParty()" title="Leave Party">
                Leave
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Render the Party Card inside the Matchmaking Hub View
  renderMatchmakingPartyRoster() {
    const container = document.getElementById('mmPartyQueueRoster');
    if (!container) return;

    const members = this.getMembers();
    const count = members.length;
    const isFull = count >= this.maxMembers;
    const localMember = members.find(m => m.isLocal) || members[0];
    const isReady = localMember ? localMember.ready : true;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
        <h3 style="font-size: 1.15rem; font-weight: 900; color: var(--accent-purple); margin: 0; display: flex; align-items: center; gap: 0.4rem;">
          <span>👥</span> Party Queue Roster
        </h3>
        <span class="lobby-game-tag" style="background: rgba(168, 85, 247, 0.2); border: 1px solid var(--accent-purple); color: #fff; font-size: 0.75rem; font-weight: 900;">
          ${count} / ${this.maxMembers} SQUAD
        </span>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
        Everyone in your party queues and enters custom lobbies <strong>directly together on the same team</strong>!
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem;">
        ${members.map(m => {
          const isLeader = m.isLeader;
          const avatarContent = (m.avatar && m.avatar.startsWith('http'))
            ? `<img src="${m.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid ${m.ready ? 'var(--accent-green)' : 'var(--accent-gold)'};">`
            : `<div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(168, 85, 247, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 2px solid ${m.ready ? 'var(--accent-green)' : 'var(--accent-gold)'};">${m.avatar || '🎮'}</div>`;

          return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid ${m.isLocal ? 'rgba(0, 242, 254, 0.4)' : 'var(--border-color)'};">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div style="position: relative;">
                  ${avatarContent}
                  ${isLeader ? '<span style="position: absolute; top: -6px; right: -6px; font-size: 0.8rem;">👑</span>' : ''}
                </div>
                <div>
                  <div style="font-size: 0.88rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
                    ${m.name}${m.isLocal ? ' (You)' : ''}
                    ${isLeader ? '<span style="font-size: 0.65rem; background: rgba(255, 215, 0, 0.2); color: var(--accent-gold); padding: 0.1rem 0.35rem; border-radius: 4px; font-weight: 900;">LEADER</span>' : ''}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 0.5rem; align-items: center;">
                    <span style="color: var(--accent-gold); font-weight: 800;">${m.elo || 2150} ELO</span>
                    <span>•</span>
                    <span style="color: ${m.ready ? 'var(--accent-green)' : 'var(--accent-gold)'}; font-weight: 700;">
                      ${m.ready ? '🟢 Ready' : '🟡 In Party'}
                    </span>
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 0.4rem; align-items: center;">
                ${m.isLocal ? `
                  <button class="btn btn-sm ${m.ready ? 'btn-success' : 'btn-warning'}" onclick="window.partyEngine.toggleMyReady()" style="font-size: 0.72rem; padding: 0.25rem 0.6rem;">
                    ${m.ready ? '✔ Ready' : 'Not Ready'}
                  </button>
                ` : `
                  <button class="btn btn-danger btn-sm" onclick="window.partyEngine.kickMember('${m.name}')" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" title="Kick Member">
                    ✕
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
        <button class="btn btn-primary btn-block" onclick="window.partyEngine.openPartyInviteModal()" ${isFull ? 'disabled' : ''} style="font-weight: 800; font-size: 0.85rem; padding: 0.55rem;">
          <span>➕</span> Invite Online Players
        </button>
        <button class="btn btn-secondary btn-block" onclick="window.partyEngine.copyPartyInviteLink()" style="font-weight: 800; font-size: 0.85rem; padding: 0.55rem;">
          📋 Link
        </button>
      </div>

      ${count > 1 ? `
        <button class="btn btn-secondary btn-block" onclick="window.partyEngine.leaveParty()" style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--accent-red); border-color: rgba(255, 82, 82, 0.3);">
          🚪 Leave Party (Return to Solo)
        </button>
      ` : ''}
    `;
  }
}

// Global Instantiation
window.partyEngine = new PartyEngine();
