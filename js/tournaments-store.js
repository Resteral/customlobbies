/* CustomLobbies.com - Tournament Engine, Highest ELO Seeding, Bracket Advancement & Account Trophies */

class TournamentsStoreEngine {
  constructor() {
    this.purchasedBanners = new Set(['default']);
    this.equippedBanner = 'default';
    this.walletBalance = 150.00;
    this.pendingTournamentData = null;

    this.accountTrophies = [
      { id: 1, title: '$1,000 CS2 Open Champion', icon: '🏆', date: 'Aug 2026', game: 'Counter-Strike 2', tier: 'Grand Championship' },
      { id: 2, title: 'Valorant Diamond Clash Winner', icon: '🥇', date: 'Jul 2026', game: 'Valorant', tier: 'Pro Esports' },
      { id: 3, title: 'CustomLobbies Grandmaster 2026', icon: '👑', date: 'Jun 2026', game: 'Rocket League', tier: 'League Finals' }
    ];

    this.leagueEvents = [
      { id: 201, date: 'AUG 12', title: 'CS2 5v5 Summer Scrim League - Week 1', game: 'CS2', time: '7:00 PM EST', prize: '$1,500', status: 'Registration Open' },
      { id: 202, date: 'AUG 15', title: 'Valorant $500 Diamond Clash Bracket', game: 'Valorant', time: '6:00 PM EST', prize: '$500', status: 'Upcoming' },
      { id: 203, date: 'AUG 18', title: 'Rocket League 2v2 Grandmaster Cup', game: 'Rocket League', time: '8:00 PM EST', prize: '$750', status: 'Upcoming' },
      { id: 204, date: 'AUG 22', title: 'Apex Legends 3v3 Arena Championship', game: 'Apex', time: '5:00 PM EST', prize: '$2,000', status: 'Registration Open' }
    ];

    this.banners = [
      { id: 'neon-hex', name: 'Cyber Neon Hex', price: '$4.99', bg: 'linear-gradient(135deg, #00f2fe, #7b2cbf)', previewIcon: '⚡' },
      { id: 'inferno-flame', name: 'Inferno Dragon Flame', price: '$7.99', bg: 'linear-gradient(135deg, #ff5252, #ff7b00)', previewIcon: '🔥' },
      { id: 'gold-champ', name: 'Golden Champion Crown', price: '$9.99', bg: 'linear-gradient(135deg, #ffd700, #ffaa00)', previewIcon: '👑' },
      { id: 'void-portal', name: 'Void Portal Nebula', price: '$12.99', bg: 'linear-gradient(135deg, #9d4edd, #240046)', previewIcon: '🌌' }
    ];

    // Seeded Tournaments (Ranked by Highest ELO)
    this.tournaments = [
      {
        id: 101,
        title: 'CustomLobbies $1,000 CS2 Open Cup',
        game: 'Counter-Strike 2',
        prizePool: '$1,000 USD',
        hostingPlan: 'Pro Esports ($35 Fee Paid)',
        entryFee: 'Free',
        teams: 8,
        status: 'In Progress (Live Bracket)',
        bracket: {
          qf: [
            { team1: 'Alpha Squad (Seed #1 - 2540 ELO)', team2: 'Viper Clan (Seed #8 - 1450 ELO)', winner: 'Alpha Squad (Seed #1 - 2540 ELO)' },
            { team1: 'Shadow Esports (Seed #2 - 2150 ELO)', team2: 'Nexus Gaming (Seed #7 - 1510 ELO)', winner: 'Shadow Esports (Seed #2 - 2150 ELO)' },
            { team1: 'Radiant Titans (Seed #3 - 1920 ELO)', team2: 'Pulse 5v5 (Seed #6 - 1590 ELO)', winner: 'Radiant Titans (Seed #3 - 1920 ELO)' },
            { team1: 'NightOwls (Seed #4 - 1840 ELO)', team2: 'Apex Warriors (Seed #5 - 1720 ELO)', winner: 'Apex Warriors (Seed #5 - 1720 ELO)' }
          ],
          sf: [
            { team1: 'Alpha Squad (Seed #1)', team2: 'Shadow Esports (Seed #2)', winner: 'Alpha Squad (Seed #1)' },
            { team1: 'Radiant Titans (Seed #3)', team2: 'Apex Warriors (Seed #5)', winner: 'Radiant Titans (Seed #3)' }
          ],
          finals: { team1: 'Alpha Squad (Seed #1)', team2: 'Radiant Titans (Seed #3)', winner: null }
        }
      }
    ];
  }

  init() {
    this.renderBanners();
    this.renderTournaments();
    this.renderTrophyCabinet();
    this.renderLeagueCalendar();
    this.renderMonthlyCalendarGrid();
    this.setupEventListeners();
  }

  renderMonthlyCalendarGrid() {
    const grid = document.getElementById('fullTournamentCalendarGrid');
    if (!grid) return;

    const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let html = daysOfWeek.map(d => `<div class="calendar-header-day">${d}</div>`).join('');

    const eventMap = {
      4: { title: '🎯 CS2 1v1 Aim Arena', class: 'event-tag-cs2' },
      8: { title: '⚡ Empulse Cyber Scrim', class: 'event-tag-empulse' },
      12: { title: '🏆 CS2 $1.5k Summer Scrim', class: 'event-tag-cs2' },
      15: { title: '🔴 Valorant $500 Clash', class: 'event-tag-valorant' },
      18: { title: '⚽ Rocket League 2v2', class: 'event-tag-rematch' },
      22: { title: '🏆 Apex 3v3 Arena $2k', class: 'event-tag-arkheron' },
      25: { title: '🔥 REMATCH 5v5 Finals', class: 'event-tag-rematch' },
      29: { title: '⚔️ Arkheron Spire Scrims', class: 'event-tag-arkheron' }
    };

    for (let day = 1; day <= 30; day++) {
      const evt = eventMap[day];
      const isToday = (day === 14);

      html += `
        <div class="calendar-day-cell ${isToday ? 'active-day' : ''}" onclick="window.tournamentsStoreEngine.selectCalendarDay(${day})">
          <div class="calendar-day-number">${day} ${isToday ? '⭐ TODAY' : ''}</div>
          ${evt ? `<div class="calendar-event-tag ${evt.class}">${evt.title}</div>` : `<div style="font-size: 0.68rem; color: var(--text-dim);">No event</div>`}
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  selectCalendarDay(dayNumber) {
    alert(`📅 CALENDAR DATE DETAILS (SEP ${dayNumber}, 2026):\n\nScheduled Tournament Event details, registration deadlines, and squad sign-ups active!`);
  }

  changeMonth(dir) {
    const title = document.getElementById('calendarMonthTitle');
    const months = ['AUGUST 2026', 'SEPTEMBER 2026', 'OCTOBER 2026', 'NOVEMBER 2026'];
    this.currentMonthIdx = (this.currentMonthIdx !== undefined ? this.currentMonthIdx : 1) + dir;
    if (this.currentMonthIdx < 0) this.currentMonthIdx = 0;
    if (this.currentMonthIdx >= months.length) this.currentMonthIdx = months.length - 1;

    if (title) title.textContent = months[this.currentMonthIdx];
    this.renderMonthlyCalendarGrid();
  }

  advanceBracketWinner(tourneyId, round, matchIdx, winningTeamName) {
    const t = this.tournaments.find(tourn => tourn.id === tourneyId);
    if (!t) return;

    if (round === 'qf') {
      t.bracket.qf[matchIdx].winner = winningTeamName;
      if (matchIdx === 0) t.bracket.sf[0].team1 = winningTeamName;
      if (matchIdx === 1) t.bracket.sf[0].team2 = winningTeamName;
      if (matchIdx === 2) t.bracket.sf[1].team1 = winningTeamName;
      if (matchIdx === 3) t.bracket.sf[1].team2 = winningTeamName;
    } else if (round === 'sf') {
      t.bracket.sf[matchIdx].winner = winningTeamName;
      if (matchIdx === 0) t.bracket.finals.team1 = winningTeamName;
      if (matchIdx === 1) t.bracket.finals.team2 = winningTeamName;
    } else if (round === 'finals') {
      t.bracket.finals.winner = winningTeamName;
      this.awardWinnerTrophy(t.title, winningTeamName);
    }

    if (window.widgetBuilderEngine) {
      window.widgetBuilderEngine.playSoundEffect('fanfare');
    }

    this.renderTournaments();
    alert(`🏅 ADVANCED TEAM!\n\n"${winningTeamName}" has won their match and advanced to the next bracket round!`);
  }

  setupEventListeners() {
    const btnCreateTourney = document.getElementById('btnCreateTournament');
    const modalTourney = document.getElementById('createTourneyModal');
    const btnCloseTourney = document.getElementById('btnCloseTourneyModal');
    const btnProceedCheckout = document.getElementById('btnProceedCheckout');

    const modalCheckout = document.getElementById('tourneyCheckoutModal');
    const btnCloseCheckout = document.getElementById('btnCloseCheckoutModal');
    const btnConfirmPay = document.getElementById('btnConfirmPayTournament');

    if (btnCreateTourney) btnCreateTourney.addEventListener('click', () => modalTourney.classList.add('active'));
    if (btnCloseTourney) btnCloseTourney.addEventListener('click', () => modalTourney.classList.remove('active'));

    if (btnProceedCheckout) {
      btnProceedCheckout.addEventListener('click', () => {
        const title = document.getElementById('newTourneyTitle').value.trim() || 'Custom Tournament';
        const game = document.getElementById('newTourneyGame').value;
        const prizeNum = parseFloat(document.getElementById('newTourneyPrize').value) || 500;
        const planFee = parseFloat(document.getElementById('newTourneyPlan').value) || 35;
        const planName = document.getElementById('newTourneyPlan').options[document.getElementById('newTourneyPlan').selectedIndex].text;

        const total = prizeNum + planFee;

        this.pendingTournamentData = {
          title,
          game,
          prizePool: `$${prizeNum} USD`,
          prizeNum,
          planFee,
          planName,
          total
        };

        document.getElementById('summaryTourneyTitle').textContent = title;
        document.getElementById('summaryPlanFee').textContent = `$${planFee.toFixed(2)} USD (${planName})`;
        document.getElementById('summaryPrizeEscrow').textContent = `$${prizeNum.toFixed(2)} USD`;
        document.getElementById('summaryTotalAmount').textContent = `$${total.toFixed(2)} USD`;

        modalTourney.classList.remove('active');
        modalCheckout.classList.add('active');
      });
    }

    if (btnCloseCheckout) {
      btnCloseCheckout.addEventListener('click', () => modalCheckout.classList.remove('active'));
    }

    if (btnConfirmPay) {
      btnConfirmPay.addEventListener('click', () => {
        if (!this.pendingTournamentData) return;

        const method = document.getElementById('payMethodSelect').value;

        modalCheckout.classList.remove('active');

        this.tournaments.unshift({
          id: Date.now(),
          title: this.pendingTournamentData.title,
          game: this.pendingTournamentData.game,
          prizePool: this.pendingTournamentData.prizePool,
          hostingPlan: `${this.pendingTournamentData.planName} (Paid via ${method})`,
          entryFee: 'Free',
          teams: 8,
          status: 'Registration Open & Highest ELO Seeded',
          bracket: {
            qf: [
              { team1: 'Alpha Squad (Seed #1 - 2540 ELO)', team2: 'Viper Clan (Seed #8 - 1450 ELO)', winner: null },
              { team1: 'Shadow Esports (Seed #2 - 2150 ELO)', team2: 'Nexus Gaming (Seed #7 - 1510 ELO)', winner: null },
              { team1: 'Radiant Titans (Seed #3 - 1920 ELO)', team2: 'Pulse 5v5 (Seed #6 - 1590 ELO)', winner: null },
              { team1: 'NightOwls (Seed #4 - 1840 ELO)', team2: 'Apex Warriors (Seed #5 - 1720 ELO)', winner: null }
            ],
            sf: [
              { team1: 'TBD (Winner Match 1)', team2: 'TBD (Winner Match 2)', winner: null },
              { team1: 'TBD (Winner Match 3)', team2: 'TBD (Winner Match 4)', winner: null }
            ],
            finals: { team1: 'TBD', team2: 'TBD', winner: null }
          }
        });

        this.renderTournaments();
        alert(`✅ PAYMENT SUCCESSFUL!\n\nTransaction ID: tx_${Math.random().toString(36).substring(2, 10)}\nTotal Paid: $${this.pendingTournamentData.total.toFixed(2)} USD\n\nYour tournament "${this.pendingTournamentData.title}" is now LIVE on CustomLobbies with Highest ELO Bracket Seeding!`);
        this.pendingTournamentData = null;
      });
    }
  }

  renderTrophyCabinet() {
    const cabinet = document.getElementById('trophyCabinetGrid');
    if (!cabinet) return;

    cabinet.innerHTML = this.accountTrophies.map(t => `
      <div style="background: rgba(22, 28, 40, 0.9); border: 1px solid var(--accent-gold); border-radius: var(--radius-lg); padding: 1.25rem; text-align: center; box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);">
        <div style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));">${t.icon}</div>
        <h4 style="font-size: 1rem; font-weight: 800; color: var(--accent-gold);">${t.title}</h4>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.3rem;">Won in ${t.game} • ${t.date}</p>
        <span class="lobby-game-tag" style="background: rgba(255, 215, 0, 0.15); color: var(--accent-gold); margin-top: 0.6rem;">${t.tier}</span>
      </div>
    `).join('');
  }

  renderLeagueCalendar() {
    const calendar = document.getElementById('leagueCalendarContainer');
    if (!calendar) return;

    calendar.innerHTML = this.leagueEvents.map(e => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 0.8rem;">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div style="background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple)); padding: 0.6rem 1rem; border-radius: 8px; text-align: center; min-width: 80px;">
            <div style="font-size: 1rem; font-weight: 900; color: #000;">${e.date}</div>
          </div>
          <div>
            <h4 style="font-size: 1.05rem; font-weight: 800;">${e.title}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">🕒 ${e.time} | Game: <strong style="color: var(--accent-cyan);">${e.game}</strong> | Prize Pool: <strong style="color: var(--accent-gold);">${e.prize}</strong></p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green);">${e.status}</span>
          <button class="btn btn-primary btn-sm" onclick="alert('✅ Added ${e.title} to your CustomLobbies Calendar & Reminders!')">📅 Add to Calendar</button>
        </div>
      </div>
    `).join('');
  }

  awardWinnerTrophy(tourneyTitle, teamName) {
    const newTrophy = {
      id: Date.now(),
      title: `${tourneyTitle} Champion (${teamName})`,
      icon: '🏆',
      date: 'Just Now',
      game: 'CustomLobbies Cup',
      tier: 'Highest ELO Tournament Winner'
    };

    this.accountTrophies.unshift(newTrophy);
    this.renderTrophyCabinet();
    alert(`🎉 CONGRATULATIONS!\n\n"${teamName}" has been crowned the Champion of "${tourneyTitle}"!\n\nA digital Trophy [🏆 ${newTrophy.title}] has been awarded to your Account Showcase!`);
  }

  renderBanners() {
    const grid = document.getElementById('bannerStoreGrid');
    if (!grid) return;

    grid.innerHTML = this.banners.map(b => {
      const owned = this.purchasedBanners.has(b.id);
      const isEquipped = this.equippedBanner === b.id;

      return `
        <div class="card" style="position: relative; overflow: hidden;">
          <div style="height: 100px; background: ${b.bg}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 1rem; box-shadow: var(--shadow-glow);">
            ${b.previewIcon}
          </div>

          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.3rem;">${b.name}</h3>
          <p style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 1rem;">${b.price}</p>

          ${owned ? `
            <button class="btn ${isEquipped ? 'btn-secondary' : 'btn-primary'} btn-sm" style="width: 100%;" onclick="window.tournamentsStoreEngine.equipBanner('${b.id}')">
              ${isEquipped ? '✅ Equipped' : 'Equip Banner'}
            </button>
          ` : `
            <button class="btn btn-purple btn-sm" style="width: 100%;" onclick="window.tournamentsStoreEngine.buyBanner('${b.id}', '${b.name}', '${b.price}')">
              💳 Purchase Banner
            </button>
          `}
        </div>
      `;
    }).join('');
  }

  buyBanner(id, name, price) {
    if (confirm(`Purchase "${name}" for ${price}?`)) {
      this.purchasedBanners.add(id);
      this.equippedBanner = id;
      this.renderBanners();
      alert(`🎉 Successfully purchased and equipped "${name}"! Your custom lobbies will now display this banner.`);
    }
  }

  equipBanner(id) {
    this.equippedBanner = id;
    this.renderBanners();
  }

  renderTournaments() {
    const container = document.getElementById('tournamentsListContainer');
    if (!container) return;

    container.innerHTML = this.tournaments.map(t => `
      <div class="card" style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="lobby-game-tag">${t.game}</span>
              <span class="lobby-game-tag" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-green);">${t.hostingPlan || 'Verified Paid Host'}</span>
              <span class="lobby-game-tag" style="background: rgba(255, 215, 0, 0.15); color: var(--accent-gold);">👑 Highest ELO Seeded</span>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 900; margin-top: 0.4rem;">${t.title}</h2>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 1.3rem; font-weight: 900; color: var(--accent-gold);">${t.prizePool}</span>
            <p style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700;">${t.status}</p>
          </div>
        </div>

        <h3 style="font-size: 1rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 1rem;">Interactive Tournament Bracket Tree (Click "Advance" to promote winners)</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; background: rgba(0, 0, 0, 0.4); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <!-- Quarterfinals -->
          <div>
            <h4 style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.8rem;">Quarterfinals (Seeded)</h4>
            ${t.bracket.qf.map((m, idx) => `
              <div style="background: rgba(255,255,255,0.05); padding: 0.6rem; border-radius: 8px; margin-bottom: 0.6rem; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                  <span style="font-size: 0.82rem; font-weight: ${m.winner === m.team1 ? '800' : '500'}; color: ${m.winner === m.team1 ? 'var(--accent-green)' : 'inherit'};">${m.team1}</span>
                  <button class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.3rem; font-size: 0.65rem;" onclick="window.tournamentsStoreEngine.advanceBracketWinner(${t.id}, 'qf', ${idx}, '${m.team1}')">Advance</button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.82rem; font-weight: ${m.winner === m.team2 ? '800' : '500'}; color: ${m.winner === m.team2 ? 'var(--accent-green)' : 'inherit'};">${m.team2}</span>
                  <button class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.3rem; font-size: 0.65rem;" onclick="window.tournamentsStoreEngine.advanceBracketWinner(${t.id}, 'qf', ${idx}, '${m.team2}')">Advance</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Semifinals -->
          <div>
            <h4 style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.8rem;">Semifinals</h4>
            ${t.bracket.sf.map((m, idx) => `
              <div style="background: rgba(255,255,255,0.05); padding: 0.8rem; border-radius: 8px; margin-bottom: 1.2rem; border: 1px solid var(--border-glow);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <span style="font-size: 0.85rem; font-weight: ${m.winner === m.team1 ? '800' : '500'}; color: ${m.winner === m.team1 ? 'var(--accent-green)' : 'inherit'};">${m.team1}</span>
                  <button class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.3rem; font-size: 0.65rem;" onclick="window.tournamentsStoreEngine.advanceBracketWinner(${t.id}, 'sf', ${idx}, '${m.team1}')">Advance</button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.85rem; font-weight: ${m.winner === m.team2 ? '800' : '500'}; color: ${m.winner === m.team2 ? 'var(--accent-green)' : 'inherit'};">${m.team2}</span>
                  <button class="btn btn-secondary btn-sm" style="padding: 0.1rem 0.3rem; font-size: 0.65rem;" onclick="window.tournamentsStoreEngine.advanceBracketWinner(${t.id}, 'sf', ${idx}, '${m.team2}')">Advance</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Grand Finals -->
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <h4 style="font-size: 0.8rem; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 0.8rem;">👑 Grand Finals</h4>
            <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(0, 242, 254, 0.15)); padding: 1.2rem; border-radius: 12px; border: 2px solid var(--accent-gold); text-align: center;">
              <div style="font-size: 1.05rem; font-weight: 900; color: var(--accent-gold);">${t.bracket.finals.team1} vs ${t.bracket.finals.team2}</div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.5rem 0 1rem 0;">Winner receives ${t.prizePool} + Trophy</p>
              <div style="display: flex; gap: 0.5rem; justify-content: center;">
                <button class="btn btn-primary btn-sm" onclick="window.tournamentsStoreEngine.advanceBracketWinner(${t.id}, 'finals', 0, '${t.bracket.finals.team1}')">👑 Award Trophy to ${t.bracket.finals.team1}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

window.tournamentsStoreEngine = new TournamentsStoreEngine();
document.addEventListener('DOMContentLoaded', () => window.tournamentsStoreEngine.init());
