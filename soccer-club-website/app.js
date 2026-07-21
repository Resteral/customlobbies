/* app.js - Mad Eagles Soccer Club Website */

// --- Global App State ---
const AppState = {
  activeView: 'home',
  cart: [],
  selectedSector: null,
  ticketQuantity: 1,
  ticketAddons: {
    parking: false,
    hospitality: false
  },
  checkoutFlipped: false,
  selectedCompareLeft: '',
  selectedCompareRight: '',
  quiz: {
    currentQuestionIndex: 0,
    score: 0,
    selectedOption: null,
    answered: false,
    completed: false
  }
};

// --- Mock Databases ---

const PLAYERS_DB = [
  // Goalkeepers
  {
    id: 'gk-lennox',
    name: 'Marcus Lennox',
    number: 1,
    position: 'Goalkeeper',
    posShort: 'GK',
    avatar: `<svg viewBox="0 0 100 100" class="player-avatar"><circle cx="50" cy="40" r="25" fill="#ffd166"/><path d="M20 90 C 20 65, 80 65, 80 90" fill="#ffd166"/><rect x="42" y="32" width="16" height="6" fill="#121216"/><circle cx="45" cy="35" r="2" fill="#fff"/><circle cx="55" cy="35" r="2" fill="#fff"/></svg>`,
    stats: { reflexes: 89, diving: 86, handling: 84, kicking: 78, positioning: 88, speed: 52 },
    bio: { age: 29, nationality: 'Germany', height: '192 cm', weight: '88 kg', apps: 124, cleanSheets: 48, goals: 0 }
  },
  // Defenders
  {
    id: 'def-kruger',
    name: 'Viktor Kruger',
    number: 4,
    position: 'Defender',
    posShort: 'CB',
    avatar: `<svg viewBox="0 0 100 100" class="player-avatar"><circle cx="50" cy="40" r="25" fill="#ff1f40"/><path d="M20 90 C 20 65, 80 65, 80 90" fill="#ff1f40"/><rect x="35" y="35" width="30" height="4" fill="#ffb703"/><circle cx="45" cy="32" r="2" fill="#fff"/><circle cx="55" cy="32" r="2" fill="#fff"/></svg>`,
    stats: { pace: 78, shooting: 54, passing: 71, dribbling: 68, defending: 91, physicality: 89 },
    bio: { age: 27, nationality: 'Sweden', height: '189 cm', weight: '84 kg', apps: 98, cleanSheets: 35, goals: 6 }
  },
  {
    id: 'def-silva',
    name: 'Mateo Silva',
    number: 3,
    position: 'Defender',
    posShort: 'LB',
    avatar: `<svg viewBox="0 0 100 100" class="player-avatar"><circle cx="50" cy="40" r="25" fill="#ff1f40"/><path d="M20 90 C 20 65, 80 65, 80 90" fill="#ff1f40"/><circle cx="45" cy="35" r="2" fill="#fff"/><circle cx="55" cy="35" r="2" fill="#fff"/></svg>`,
    stats: { pace: 88, shooting: 62, passing: 78, dribbling: 81, defending: 83, physicality: 76 },
    bio: { age: 24, nationality: 'Brazil', height: '178 cm', weight: '71 kg', apps: 72, cleanSheets: 22, goals: 3 }
  },
  // Midfielders
  {
    id: 'mid-sterling',
    name: 'Chase Sterling',
    number: 8,
    position: 'Midfielder',
    posShort: 'CM',
    avatar: `<svg viewBox="0 0 100 100" class="player-avatar"><circle cx="50" cy="40" r="25" fill="#ff1f40"/><path d="M20 90 C 20 65, 80 65, 80 90" fill="#ff1f40"/><path d="M40 30 Q50 20 60 30" fill="none" stroke="#ffb703" stroke-width="3"/><circle cx="45" cy="35" r="2" fill="#fff"/><circle cx="55" cy="35" r="2" fill="#fff"/></svg>`,
    stats: { pace: 82, shooting: 79, passing: 92, dribbling: 88, defending: 74, physicality: 79 },
    bio: { age: 28, nationality: 'England', height: '181 cm', weight: '76 kg', apps: 156, cleanSheets: 45, goals: 28 }
  },
  {
    id: 'mid-bell',
    name: 'Kaito Bell',
    number: 10,
    position: 'Midfielder',
    posShort: 'AM',
    avatar: `<svg viewBox="0 0 100 100" class="player-avatar"><circle cx="50" cy="40" r="25" fill="#ff1f40"/><path d="M20 90 C 20 65, 80 65, 80 90" fill="#ff1f40"/><path d="M45 20 L55 20 L50 30 Z" fill="#ffb703"/><circle cx="45" cy="35" r="2" fill="#fff"/><circle cx="55" cy="35" r="2" fill="#fff"/></svg>`,
    stats: { pace: 85, shooting: 84, passing: 89, dribbling: 93, defending: 48, physicality: 65 },
    bio: { age: 22, nationality: 'Japan', height: '173 cm', weight: '65 kg', apps: 42, cleanSheets: 10, goals: 14 }
  },
  // Attackers
  {
    id: 'att-leclerc',
    name: 'Antoine Leclerc',
    number: 9,
    position: 'Attacker',
    posShort: 'ST',
    avatar: `<svg viewBox="0 0 100 100" class="player-avatar"><circle cx="50" cy="40" r="25" fill="#ff1f40"/><path d="M20 90 C 20 65, 80 65, 80 90" fill="#ff1f40"/><rect x="48" y="25" width="4" height="15" fill="#ffb703"/><circle cx="45" cy="35" r="2" fill="#fff"/><circle cx="55" cy="35" r="2" fill="#fff"/></svg>`,
    stats: { pace: 93, shooting: 92, passing: 75, dribbling: 87, defending: 35, physicality: 82 },
    bio: { age: 26, nationality: 'France', height: '185 cm', weight: '79 kg', apps: 110, cleanSheets: 12, goals: 74 }
  },
  {
    id: 'att-diop',
    name: 'Sadio Diop',
    number: 11,
    position: 'Attacker',
    posShort: 'LW',
    avatar: `<svg viewBox="0 0 100 100" class="player-avatar"><circle cx="50" cy="40" r="25" fill="#ff1f40"/><path d="M20 90 C 20 65, 80 65, 80 90" fill="#ff1f40"/><circle cx="45" cy="35" r="2" fill="#fff"/><circle cx="55" cy="35" r="2" fill="#fff"/></svg>`,
    stats: { pace: 95, shooting: 85, passing: 81, dribbling: 91, defending: 40, physicality: 73 },
    bio: { age: 25, nationality: 'Senegal', height: '175 cm', weight: '68 kg', apps: 84, cleanSheets: 15, goals: 31 }
  }
];

const SCHEDULE_DB = {
  fixtures: [
    { opponent: 'Paris Saint-Germain', date: 'Jul 22, 2026', time: '20:00', competition: 'UEFA Champions League', venue: 'Eagle Nest Arena' },
    { opponent: 'FC Barcelona', date: 'Jul 29, 2026', time: '19:30', competition: 'Pre-Season Supercup', venue: 'Camp Nou' },
    { opponent: 'Manchester United', date: 'Aug 05, 2026', time: '15:00', competition: 'International Cup', venue: 'Eagle Nest Arena' }
  ],
  results: [
    {
      opponent: 'Bayern Munich',
      score: '3 - 2',
      outcome: 'W',
      competition: 'UEFA Champions League',
      date: 'May 16, 2026',
      scorers: [
        { minute: 14, player: 'A. Leclerc', team: 'home' },
        { minute: 34, player: 'T. Müller', team: 'away' },
        { minute: 58, player: 'K. Bell', team: 'home' },
        { minute: 72, player: 'H. Kane', team: 'away' },
        { minute: 88, player: 'S. Diop', team: 'home' }
      ],
      timeline: [
        { minute: 14, type: 'goal', text: 'Goal! Antoine Leclerc fires a rocket in the top corner. Assist by Sterling.', player: 'Leclerc' },
        { minute: 28, type: 'card-yellow', text: 'Yellow Card: Viktor Kruger for a tactical foul on Musiala.', player: 'Kruger' },
        { minute: 34, type: 'goal', text: 'Goal! Thomas Müller levels for Bayern with a header from a corner.', player: 'Müller' },
        { minute: 58, type: 'goal', text: 'Goal! Kaito Bell dribbles past two defenders and chips the goalkeeper!', player: 'Bell' },
        { minute: 72, type: 'goal', text: 'Penalty Goal! Harry Kane converts after a handball in the box.', player: 'Kane' },
        { minute: 88, type: 'goal', text: 'Goal! Sadio Diop scores the winner off a swift counter attack!', player: 'Diop' }
      ]
    },
    {
      opponent: 'Real Madrid',
      score: '1 - 1',
      outcome: 'D',
      competition: 'Champions League Semis',
      date: 'May 09, 2026',
      scorers: [
        { minute: 42, player: 'V. Jr', team: 'away' },
        { minute: 67, player: 'C. Sterling', team: 'home' }
      ],
      timeline: [
        { minute: 12, type: 'card-yellow', text: 'Yellow Card: Carvajal for a sliding tackle on Diop.', player: 'Carvajal' },
        { minute: 42, type: 'goal', text: 'Goal! Vinicius Jr curls it into the far post. Madrid lead.', player: 'Vinicius Jr' },
        { minute: 67, type: 'goal', text: 'Goal! Chase Sterling strikes from outside the penalty area!', player: 'Sterling' }
      ]
    }
  ]
};

const SECTORS_DB = {
  'North Stand': { price: 45, color: '#e63946', desc: 'Lively fan zone behind the North Goal' },
  'East Stand': { price: 65, color: '#ffd166', desc: 'Excellent pitch-side view, family-friendly' },
  'West Stand': { price: 75, color: '#06d6a0', desc: 'Premium side views, close to dugout' },
  'South VIP Lounge': { price: 180, color: '#ffd700', desc: 'Ultra-exclusive hospitality, food & drinks included' }
};

const PRODUCTS_DB = [
  { id: 'prod-kit-home', name: 'Mad Eagles Home Kit 26/27', price: 89.99, image: 'assets/jersey.png' },
  { id: 'prod-kit-away', name: 'Mad Eagles Away Kit 26/27', price: 84.99, image: 'assets/jersey.png' },
  { id: 'prod-scarf', name: 'Eagle Pride Fan Scarf', price: 19.99, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 'prod-jacket', name: 'Championship Training Jacket', price: 69.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
];

// --- Tactical Rules & Play Quiz Database ---
const QUIZ_QUESTIONS = [
  {
    question: "Rules Scenario: The attacker (A9) passes to A11. Is Player A11 offside when the ball is kicked from Grid E3 to F4?",
    options: [
      "Yes, A11 is ahead of the second-last defender and active in play.",
      "No, A11 is behind the ball when passed.",
      "No, A11 is level with the second-last defender (D3) in Grid F4.",
      "No, offside is only called if inside the penalty area."
    ],
    correctIndex: 2,
    explanation: "Correct! Defender D3 is on line F4, keeping Attacker A11 level. Under FIFA Law 11, a player is not in an offside position if they are level with the second-last opponent.",
    board: {
      gridOverlay: true,
      defenders: [
        { x: 30, y: 15, label: 'D2' },
        { x: 65, y: 50, label: 'D3' }, // Second last defender
        { x: 88, y: 55, label: 'GK' }
      ],
      attackers: [
        { x: 45, y: 35, label: 'A9 (Ball)' },
        { x: 65, y: 75, label: 'A11' } // Level with D3
      ],
      ball: { x: 45, y: 35 },
      offsideLine: 65, // X position of offside line (vertical line)
      passLanes: [
        { from: { x: 45, y: 35 }, to: { x: 65, y: 75 }, status: 'success' }
      ],
      description: "Match Grid: Attacker A9 in E3 makes a diagonal pass to A11 in F4. D3 is currently occupying coordinate F4."
    }
  },
  {
    question: "Tactical Play: You are Midfielder A10 at coordinate D3. Which pass is the 'Right Play' to create a scoring opportunity while avoiding interception?",
    options: [
      "Pass directly to Attacker A9 (F2) — High risk, marked closely by D2.",
      "Diagonal pass to Wing A11 (G5) — Exploiting space behind D3.",
      "Back-pass to Defender A4 (B3) — Safe play, but stops attacking momentum.",
      "Shoot directly from Grid D3 — Low probability of scoring."
    ],
    correctIndex: 1,
    explanation: "Excellent tactical vision! Passing to A11 at G5 utilizes the open channel behind defender D3. D3 is caught out of position, leaving A11 in a 1v1 crossing or shooting stance.",
    board: {
      gridOverlay: true,
      defenders: [
        { x: 55, y: 22, label: 'D2' }, // marking A9
        { x: 48, y: 48, label: 'D3' }, // caught in middle
        { x: 90, y: 50, label: 'GK' }
      ],
      attackers: [
        { x: 35, y: 50, label: 'A10' }, // Ball carrier
        { x: 65, y: 20, label: 'A9' }, // Heavily marked
        { x: 75, y: 80, label: 'A11' } // Open space
      ],
      ball: { x: 35, y: 50 },
      passLanes: [
        { from: { x: 35, y: 50 }, to: { x: 65, y: 20 }, status: 'intercepted' },
        { from: { x: 35, y: 50 }, to: { x: 75, y: 80 }, status: 'success' }
      ],
      description: "Board: A10 has the ball. Defenders are blocking central lane. A11 is making a run down the wing."
    }
  },
  {
    question: "Rules Scenario: A defender (D2) blocks a shot inside the penalty box with a hand that is positioned naturally by their side. What should the referee call?",
    options: [
      "Penalty Kick and Red Card.",
      "Penalty Kick and Yellow Card.",
      "Direct Free Kick outside the box.",
      "Play on (No infraction — hand position is natural)."
    ],
    correctIndex: 3,
    explanation: "Correct. According to FIFA Law 12, it is not an offense if the ball touches a player's hand/arm that has not made their body unnaturally bigger. Since the arm was in a natural position by their side, play continues.",
    board: {
      gridOverlay: false,
      defenders: [
        { x: 78, y: 45, label: 'D2' },
        { x: 92, y: 50, label: 'GK' }
      ],
      attackers: [
        { x: 60, y: 40, label: 'A9' }
      ],
      ball: { x: 75, y: 44 }, // Ball hitting hand of D2
      referee: { x: 58, y: 70 },
      passLanes: [
        { from: { x: 60, y: 40 }, to: { x: 78, y: 45 }, status: 'handball' }
      ],
      description: "Penalty box view. A9 shoots. D2 blocks with arm close to the torso."
    }
  }
];

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  initRouting();
  initCountdown();
  initMatchCenter();
  initSquadHub();
  initTickets();
  initCart();
  initQuiz();
  initRegistration();
  lucide.createIcons();
});

// --- Routing System ---
function initRouting() {
  const tabs = document.querySelectorAll('[id^="btn-"]');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Extract view name from ID (e.g. btn-portal -> portal)
      const view = tab.id.replace('btn-', '');
      switchView(view);
    });
  });
}

function switchView(viewName) {
  AppState.activeView = viewName;
  
  // Update section visibility
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const activeSec = document.getElementById(`view-${viewName}`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  // Update nav buttons active class
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`btn-${viewName}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Handle special section loading
  if (viewName === 'academy') {
    renderQuizQuestion();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Match Countdown Timer ---
function initCountdown() {
  // Set date to 3 days in the future
  const countdownDate = new Date();
  countdownDate.setDate(countdownDate.getDate() + 3);
  countdownDate.setHours(20, 0, 0, 0); // 8:00 PM

  const timerNumDays = document.getElementById('timer-days');
  const timerNumHours = document.getElementById('timer-hours');
  const timerNumMins = document.getElementById('timer-mins');
  const timerNumSecs = document.getElementById('timer-secs');

  if (!timerNumDays) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = countdownDate.getTime() - now;

    if (distance < 0) {
      clearInterval(interval);
      document.querySelector('.countdown-timer').innerHTML = '<div style="grid-column: span 4; font-weight:700;">MATCH IS LIVE!</div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerNumDays.textContent = String(days).padStart(2, '0');
    timerNumHours.textContent = String(hours).padStart(2, '0');
    timerNumMins.textContent = String(minutes).padStart(2, '0');
    timerNumSecs.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  const interval = setInterval(updateTimer, 1000);
}

// --- Match Center Results & Timeline ---
function initMatchCenter() {
  const tabResultsBtn = document.getElementById('tab-results');
  const tabFixturesBtn = document.getElementById('tab-fixtures');
  const contentResults = document.getElementById('match-results-content');
  const contentFixtures = document.getElementById('match-fixtures-content');

  if (tabResultsBtn) {
    tabResultsBtn.addEventListener('click', () => {
      tabResultsBtn.classList.add('active');
      tabFixturesBtn.classList.remove('active');
      contentResults.classList.add('active');
      contentFixtures.classList.remove('active');
    });

    tabFixturesBtn.addEventListener('click', () => {
      tabFixturesBtn.classList.add('active');
      tabResultsBtn.classList.remove('active');
      contentFixtures.classList.add('active');
      contentResults.classList.remove('active');
    });
  }

  // Populate Results
  const resultsGrid = document.querySelector('.results-grid');
  if (resultsGrid) {
    resultsGrid.innerHTML = SCHEDULE_DB.results.map((res, index) => `
      <div class="glass-card result-card" onclick="loadMatchAnalysis(${index})">
        <div class="result-meta">
          <span>${res.competition}</span>
          <span>${res.date}</span>
        </div>
        <div class="result-scoreboard">
          <div class="result-team">Mad Eagles</div>
          <div class="result-score">${res.score}</div>
          <div class="result-team">${res.opponent}</div>
        </div>
        <div class="result-scorers">
          <div class="scorer-list">
            ${res.scorers.map(s => `
              <div style="display:flex; justify-content:space-between; font-size: 0.75rem;">
                <span style="${s.team === 'home' ? 'font-weight:600;' : 'color:var(--text-muted);'}">
                  ⚽ ${s.player}
                </span>
                <span>${s.minute}'</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="margin-top:12px; font-size:0.75rem; text-align:center; color:var(--accent); font-weight:600; cursor:pointer;">
          View Event Analysis →
        </div>
      </div>
    `).join('');
  }

  // Populate Fixtures
  const fixturesList = document.querySelector('.fixtures-list');
  if (fixturesList) {
    fixturesList.innerHTML = SCHEDULE_DB.fixtures.map(fix => `
      <div class="fixture-row">
        <div class="fixture-date">${fix.date}</div>
        <div class="fixture-vs">
          <span class="fixture-team-name">Mad Eagles</span>
          <span class="fixture-vs-text">VS</span>
          <span class="fixture-team-name">${fix.opponent}</span>
        </div>
        <div class="fixture-competition">${fix.competition}</div>
        <div class="fixture-ticket-btn">
          <button class="btn btn-primary" style="font-size:0.75rem; padding: 6px 12px;" onclick="switchView('tickets')">Tickets</button>
        </div>
      </div>
    `).join('');
  }

  // Load first match analysis by default
  loadMatchAnalysis(0);
}

window.loadMatchAnalysis = function(matchIndex) {
  const match = SCHEDULE_DB.results[matchIndex];
  if (!match) return;

  const titleNode = document.getElementById('analysis-match-title');
  const barNode = document.getElementById('timeline-bar');
  const detailsNode = document.getElementById('active-event-details');

  if (titleNode) {
    titleNode.textContent = `Match Timeline: Mad Eagles vs ${match.opponent}`;
  }

  // Draw event nodes
  if (barNode) {
    barNode.innerHTML = '';
    match.timeline.forEach((event, idx) => {
      const percent = (event.minute / 90) * 100;
      const node = document.createElement('div');
      node.className = 'timeline-event-node';
      node.style.left = `${percent}%`;
      node.dataset.type = event.type;
      
      let icon = '⚽';
      if (event.type === 'card-yellow') icon = '🟨';
      if (event.type === 'card-red') icon = '🟥';

      node.innerHTML = `<span class="event-icon-small">${icon}</span>`;
      node.addEventListener('click', () => showTimelineEvent(event));
      barNode.appendChild(node);

      // Default show first event
      if (idx === 0) showTimelineEvent(event);
    });
  }
};

function showTimelineEvent(event) {
  const detailsNode = document.getElementById('active-event-details');
  if (detailsNode) {
    let icon = '⚽ Goal!';
    if (event.type === 'card-yellow') icon = '🟨 Yellow Card';
    if (event.type === 'card-red') icon = '🟥 Red Card';

    detailsNode.innerHTML = `
      <div class="event-time-badge">${event.minute}'</div>
      <h3 style="margin-bottom:6px; color: #fff;">${icon} - ${event.player}</h3>
      <p style="color: var(--text-secondary); max-width: 600px;">${event.text}</p>
    `;
  }
}

// --- Squad Hub (Grid, Filters, Modal, Compare) ---
function initSquadHub() {
  renderSquad('all');

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pos = btn.dataset.position;
      renderSquad(pos);
    });
  });

  // Load Compare Dropdowns
  const leftSel = document.getElementById('compare-left');
  const rightSel = document.getElementById('compare-right');

  if (leftSel && rightSel) {
    const optionsHtml = PLAYERS_DB.map(p => `<option value="${p.id}">${p.number}. ${p.name} (${p.posShort})</option>`).join('');
    leftSel.innerHTML = '<option value="">Select Player A</option>' + optionsHtml;
    rightSel.innerHTML = '<option value="">Select Player B</option>' + optionsHtml;

    leftSel.addEventListener('change', (e) => {
      AppState.selectedCompareLeft = e.target.value;
      updateComparisonDeck();
    });

    rightSel.addEventListener('change', (e) => {
      AppState.selectedCompareRight = e.target.value;
      updateComparisonDeck();
    });
  }
}

function renderSquad(filter) {
  const squadGrid = document.querySelector('.squad-grid');
  if (!squadGrid) return;

  const filtered = PLAYERS_DB.filter(p => filter === 'all' || p.position.toLowerCase() === filter.toLowerCase());

  squadGrid.innerHTML = filtered.map(p => {
    let statPreview = '';
    if (p.position === 'Goalkeeper') {
      statPreview = `
        <div class="preview-stat"><div class="stat-val">${p.stats.reflexes}</div><div class="stat-lbl">REF</div></div>
        <div class="preview-stat"><div class="stat-val">${p.stats.positioning}</div><div class="stat-lbl">POS</div></div>
        <div class="preview-stat"><div class="stat-val">${p.stats.diving}</div><div class="stat-lbl">DIV</div></div>
      `;
    } else {
      statPreview = `
        <div class="preview-stat"><div class="stat-val">${p.stats.pace}</div><div class="stat-lbl">PAC</div></div>
        <div class="preview-stat"><div class="stat-val">${p.stats.shooting}</div><div class="stat-lbl">SHO</div></div>
        <div class="preview-stat"><div class="stat-val">${p.stats.passing}</div><div class="stat-lbl">PAS</div></div>
      `;
    }

    return `
      <div class="player-card" onclick="openPlayerModal('${p.id}')">
        <div class="player-card-bg"></div>
        <div class="player-badge-num">
          <span class="player-num">${p.number}</span>
          <span class="player-pos-short">${p.posShort}</span>
        </div>
        <div class="player-img-container">
          ${p.avatar}
        </div>
        <div class="player-info-container">
          <div class="player-name">${p.name}</div>
          <div class="player-pos-full">${p.position}</div>
          <div class="player-stats-preview">
            ${statPreview}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openPlayerModal = function(playerId) {
  const player = PLAYERS_DB.find(p => p.id === playerId);
  if (!player) return;

  const modal = document.getElementById('player-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-close" onclick="closePlayerModal()">&times;</div>
      <div class="player-details-grid">
        <div class="player-details-profile">
          <div style="width:160px; height:160px; margin:0 auto 16px auto;">
            ${player.avatar}
          </div>
          <h2 style="font-size:2rem; margin-bottom:4px;">#${player.number} ${player.name}</h2>
          <div style="color:var(--accent); font-weight:700; text-transform:uppercase; font-size:0.9rem; letter-spacing:0.05em; margin-bottom:16px;">
            ${player.position} (${player.posShort})
          </div>
          <div class="glass-card" style="padding:12px; display:grid; grid-template-columns:1fr 1fr; gap:12px; text-align:left; font-size:0.85rem;">
            <div><span style="color:var(--text-secondary)">Age:</span> ${player.bio.age} yrs</div>
            <div><span style="color:var(--text-secondary)">Apps:</span> ${player.bio.apps}</div>
            <div><span style="color:var(--text-secondary)">Height:</span> ${player.bio.height}</div>
            <div><span style="color:var(--text-secondary)">Weight:</span> ${player.bio.weight}</div>
            <div style="grid-column: span 2;"><span style="color:var(--text-secondary)">Nation:</span> ${player.bio.nationality}</div>
            <div style="grid-column: span 2;"><span style="color:var(--text-secondary)">Record:</span> ${player.position === 'Goalkeeper' ? player.bio.cleanSheets + ' Clean Sheets' : player.bio.goals + ' Goals'}</div>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:8px;">Performance Statistics</h3>
          <div class="stats-bars-container">
            ${Object.entries(player.stats).map(([stat, val]) => `
              <div class="stat-bar-row">
                <div class="stat-bar-info">
                  <span class="stat-bar-name">${stat}</span>
                  <span class="stat-bar-val">${val}</span>
                </div>
                <div class="stat-bar-track">
                  <div class="stat-bar-fill" id="bar-${stat}" style="width: 0%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');

  // Trigger animation for fill bars after a brief render delay
  setTimeout(() => {
    Object.entries(player.stats).forEach(([stat, val]) => {
      const fillBar = document.getElementById(`bar-${stat}`);
      if (fillBar) fillBar.style.width = `${val}%`;
    });
  }, 100);
};

window.closePlayerModal = function() {
  const modal = document.getElementById('player-modal');
  if (modal) modal.classList.remove('active');
};

// Player Side-by-Side Comparison
function updateComparisonDeck() {
  const leftId = AppState.selectedCompareLeft;
  const rightId = AppState.selectedCompareRight;

  const leftCard = document.getElementById('compare-card-left');
  const rightCard = document.getElementById('compare-card-right');
  const statsBox = document.getElementById('comparison-stats');

  if (!leftId || !rightId) {
    if (leftCard) leftCard.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-muted);">Select Player A</div>`;
    if (rightCard) rightCard.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-muted);">Select Player B</div>`;
    if (statsBox) statsBox.style.display = 'none';
    return;
  }

  const pA = PLAYERS_DB.find(p => p.id === leftId);
  const pB = PLAYERS_DB.find(p => p.id === rightId);

  if (!pA || !pB) return;

  // Render cards
  leftCard.innerHTML = renderCompareCardMarkup(pA);
  rightCard.innerHTML = renderCompareCardMarkup(pB);

  // Render Stats list
  statsBox.style.display = 'block';

  // Find overlapping stats to compare (e.g. GK vs Outfield differs, but let's list whichever overlap or standard 6 stats)
  const statsToCompare = pA.position === 'Goalkeeper' && pB.position === 'Goalkeeper'
    ? ['reflexes', 'diving', 'handling', 'kicking', 'positioning', 'speed']
    : ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physicality'];

  let statsHtml = `
    <div style="text-align:center; font-weight:700; text-transform:uppercase; font-size:0.9rem; margin-bottom:12px; color:var(--accent);">
      Attribute Duel
    </div>
  `;

  statsToCompare.forEach(stat => {
    const valA = pA.stats[stat] || 0;
    const valB = pB.stats[stat] || 0;

    let classA = '';
    let classB = '';

    if (valA > valB) classA = 'comp-winner';
    else if (valB > valA) classB = 'comp-winner';

    statsHtml += `
      <div class="comparison-stat-line">
        <span class="comp-val-left ${classA}">${valA}</span>
        <span class="comp-stat-lbl">${stat}</span>
        <span class="comp-val-right ${classB}">${valB}</span>
      </div>
    `;
  });

  statsBox.innerHTML = statsHtml;
}

function renderCompareCardMarkup(player) {
  return `
    <div class="player-card" style="margin: 0 auto; pointer-events:none;">
      <div class="player-card-bg"></div>
      <div class="player-badge-num">
        <span class="player-num">${player.number}</span>
        <span class="player-pos-short">${player.posShort}</span>
      </div>
      <div class="player-img-container">
        ${player.avatar}
      </div>
      <div class="player-info-container">
        <div class="player-name">${player.name}</div>
        <div class="player-pos-full">${player.position}</div>
      </div>
    </div>
  `;
}

// --- Ticketing Seating Selector ---
function initTickets() {
  const sectors = document.querySelectorAll('.stadium-sector');
  sectors.forEach(sec => {
    sec.addEventListener('click', () => {
      sectors.forEach(s => s.classList.remove('selected'));
      sec.classList.add('selected');
      AppState.selectedSector = sec.dataset.sector;
      updateTicketCalculator();
    });
  });

  const qtyInput = document.getElementById('ticket-qty');
  if (qtyInput) {
    qtyInput.addEventListener('input', (e) => {
      AppState.ticketQuantity = Math.max(1, parseInt(e.target.value) || 1);
      updateTicketCalculator();
    });
  }

  const addonParking = document.getElementById('addon-parking');
  const addonHospitality = document.getElementById('addon-hospitality');

  if (addonParking) {
    addonParking.addEventListener('change', (e) => {
      AppState.ticketAddons.parking = e.target.checked;
      updateTicketCalculator();
    });
  }
  if (addonHospitality) {
    addonHospitality.addEventListener('change', (e) => {
      AppState.ticketAddons.hospitality = e.target.checked;
      updateTicketCalculator();
    });
  }

  // Credit Card Form Bindings
  const ccNumInput = document.getElementById('cc-number-input');
  const ccNameInput = document.getElementById('cc-name-input');
  const ccExpiryInput = document.getElementById('cc-expiry-input');
  const ccCvvInput = document.getElementById('cc-cvv-input');

  if (ccNumInput) {
    ccNumInput.addEventListener('input', (e) => {
      document.getElementById('cc-num-val').textContent = e.target.value || '•••• •••• •••• ••••';
    });
  }
  if (ccNameInput) {
    ccNameInput.addEventListener('input', (e) => {
      document.getElementById('cc-name-val').textContent = (e.target.value || 'YOUR NAME').toUpperCase();
    });
  }
  if (ccExpiryInput) {
    ccExpiryInput.addEventListener('input', (e) => {
      document.getElementById('cc-exp-val').textContent = e.target.value || 'MM/YY';
    });
  }
  if (ccCvvInput) {
    ccCvvInput.addEventListener('focus', () => {
      document.getElementById('credit-card-wrapper').classList.add('flipped');
    });
    ccCvvInput.addEventListener('blur', () => {
      document.getElementById('credit-card-wrapper').classList.remove('flipped');
    });
    ccCvvInput.addEventListener('input', (e) => {
      document.getElementById('cc-cvv-val').textContent = e.target.value || '•••';
    });
  }
}

function updateTicketCalculator() {
  const calcBody = document.getElementById('ticket-calculator-details');
  if (!calcBody) return;

  if (!AppState.selectedSector) {
    calcBody.innerHTML = `<div style="padding: 20px; text-align:center; color:var(--text-muted);">Please select a stadium stand on the map</div>`;
    document.getElementById('buy-tickets-submit').disabled = true;
    return;
  }

  const sector = SECTORS_DB[AppState.selectedSector];
  const ticketBasePrice = sector.price;
  const baseTotal = ticketBasePrice * AppState.ticketQuantity;

  let addonsPrice = 0;
  let addonsHtml = '';
  
  if (AppState.ticketAddons.parking) {
    addonsPrice += 15 * AppState.ticketQuantity;
    addonsHtml += `<div class="ticket-calc-row"><span>VIP Parking Addon</span><span>$${15 * AppState.ticketQuantity}</span></div>`;
  }
  if (AppState.ticketAddons.hospitality) {
    addonsPrice += 50 * AppState.ticketQuantity;
    addonsHtml += `<div class="ticket-calc-row"><span>Hospitality Food/Drink</span><span>$${50 * AppState.ticketQuantity}</span></div>`;
  }

  const grandTotal = baseTotal + addonsPrice;

  calcBody.innerHTML = `
    <div class="ticket-calc-row" style="border-bottom: 2px solid var(--border); padding-bottom: 8px;">
      <h3 style="color:#fff;">${AppState.selectedSector}</h3>
      <span class="badge" style="background-color: var(--accent); color:#fff; font-size:0.75rem;">$${ticketBasePrice} / seat</span>
    </div>
    <p style="font-size:0.8rem; color:var(--text-secondary); margin: 8px 0 16px 0;">${sector.desc}</p>
    
    <div class="ticket-calc-row">
      <span>Base Tickets (${AppState.ticketQuantity}x)</span>
      <span>$${baseTotal}</span>
    </div>
    ${addonsHtml}
    <div class="ticket-calc-row" style="border-top: 1px solid var(--border); margin-top: 16px; padding-top: 16px;">
      <span style="font-weight:700;">Grand Total</span>
      <span class="calc-total">$${grandTotal}</span>
    </div>
  `;

  document.getElementById('buy-tickets-submit').disabled = false;
}

window.openCheckoutModal = function() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');
};

window.closeCheckoutModal = function() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
};

window.submitCheckout = function(e) {
  e.preventDefault();
  alert('Payment Successful! Your digital match tickets have been sent to your email.');
  closeCheckoutModal();
  // Reset
  AppState.selectedSector = null;
  document.querySelectorAll('.stadium-sector').forEach(s => s.classList.remove('selected'));
  document.getElementById('addon-parking').checked = false;
  document.getElementById('addon-hospitality').checked = false;
  AppState.ticketAddons = { parking: false, hospitality: false };
  AppState.ticketQuantity = 1;
  document.getElementById('ticket-qty').value = 1;
  updateTicketCalculator();
};

// --- Merchandise Shop & Floating Cart ---
function initCart() {
  // Populate Shop Items
  const shopGrid = document.querySelector('.shop-grid');
  if (shopGrid) {
    shopGrid.innerHTML = PRODUCTS_DB.map(p => `
      <div class="glass-card shop-card">
        <div class="shop-img-container">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="shop-info">
          <div class="shop-title">${p.name}</div>
          <div class="shop-meta">
            <span class="shop-price">$${p.price.toFixed(2)}</span>
            <button class="btn btn-primary" style="font-size:0.75rem; padding:8px 16px;" onclick="addToCart('${p.id}')">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load cart from localStorage
  const savedCart = localStorage.getItem('madedles_cart');
  if (savedCart) {
    AppState.cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

window.toggleCart = function() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.toggle('active');
  }
};

window.addToCart = function(productId) {
  const product = PRODUCTS_DB.find(p => p.id === productId);
  if (!product) return;

  const existing = AppState.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  // Open cart drawer automatically to show added item
  document.getElementById('cart-drawer').classList.add('active');
};

window.updateQuantity = function(productId, delta) {
  const item = AppState.cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    AppState.cart = AppState.cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem('madedles_cart', JSON.stringify(AppState.cart));
}

function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  const countBadge = document.getElementById('cart-badge-count');
  const subtotalNode = document.getElementById('cart-subtotal');

  if (!container) return;

  const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  countBadge.textContent = totalCount;
  countBadge.style.display = totalCount > 0 ? 'flex' : 'none';

  if (AppState.cart.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-muted);">Your shopping cart is empty</div>`;
    subtotalNode.textContent = '$0.00';
    return;
  }

  container.innerHTML = AppState.cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity-row">
          <div class="quantity-control">
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span style="font-weight:600; font-size:0.85rem;">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
          <span style="font-weight:700; font-size:0.9rem;">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  subtotalNode.textContent = `$${subtotal.toFixed(2)}`;
}

window.checkoutCart = function() {
  alert('Order Placed Successfully! Thank you for supporting Mad Eagles FC.');
  AppState.cart = [];
  saveCart();
  updateCartUI();
  toggleCart();
};

// --- Tactical Quiz Engine (Canvas, Scenario drawings) ---
function initQuiz() {
  // Bind buttons
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (AppState.quiz.currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        AppState.quiz.currentQuestionIndex++;
        AppState.quiz.answered = false;
        AppState.quiz.selectedOption = null;
        renderQuizQuestion();
      } else {
        // Complete Quiz
        AppState.quiz.completed = true;
        showQuizCertificate();
      }
    });
  }

  const restartBtn = document.getElementById('quiz-restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      AppState.quiz.currentQuestionIndex = 0;
      AppState.quiz.score = 0;
      AppState.quiz.answered = false;
      AppState.quiz.selectedOption = null;
      AppState.quiz.completed = false;
      
      document.getElementById('quiz-active-deck').style.display = 'grid';
      document.getElementById('quiz-cert-screen').classList.remove('active');
      renderQuizQuestion();
    });
  }
}

function renderQuizQuestion() {
  const qData = QUIZ_QUESTIONS[AppState.quiz.currentQuestionIndex];
  if (!qData) return;

  // Set counter
  document.getElementById('quiz-q-num').textContent = `Question ${AppState.quiz.currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}`;
  document.getElementById('quiz-score-val').textContent = `Score: ${AppState.quiz.score}`;

  // Set Q Text
  document.getElementById('quiz-question-text').textContent = qData.question;

  // Set Options
  const optionsStack = document.getElementById('quiz-options-stack');
  optionsStack.innerHTML = qData.options.map((opt, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C, D
    return `
      <button class="option-btn" id="opt-btn-${idx}" onclick="selectQuizOption(${idx})">
        <span class="option-letter">${letter}</span>
        <span style="font-size:0.9rem;">${opt}</span>
      </button>
    `;
  }).join('');

  // Hide feedback and next buttons
  document.getElementById('quiz-feedback-box').classList.remove('active', 'correct', 'incorrect');
  document.getElementById('quiz-next-btn').style.display = 'none';

  // Draw Tactical Canvas
  drawTacticalBoard(qData, null);
}

window.selectQuizOption = function(optionIndex) {
  if (AppState.quiz.answered) return;

  AppState.quiz.answered = true;
  AppState.quiz.selectedOption = optionIndex;

  const qData = QUIZ_QUESTIONS[AppState.quiz.currentQuestionIndex];
  const feedbackBox = document.getElementById('quiz-feedback-box');
  const nextBtn = document.getElementById('quiz-next-btn');

  // Highlights
  const selectedBtn = document.getElementById(`opt-btn-${optionIndex}`);
  const correctBtn = document.getElementById(`opt-btn-${qData.correctIndex}`);

  if (optionIndex === qData.correctIndex) {
    AppState.quiz.score += 10;
    selectedBtn.classList.add('correct');
    feedbackBox.classList.add('active', 'correct');
    feedbackBox.innerHTML = `<strong>✓ CORRECT!</strong><br>${qData.explanation}`;
  } else {
    selectedBtn.classList.add('incorrect');
    correctBtn.classList.add('correct');
    feedbackBox.classList.add('active', 'incorrect');
    feedbackBox.innerHTML = `<strong>✗ INCORRECT.</strong><br>${qData.explanation}`;
  }

  // Draw passing animation line on canvas
  drawTacticalBoard(qData, optionIndex);

  // Update Score
  document.getElementById('quiz-score-val').textContent = `Score: ${AppState.quiz.score}`;

  // Show Next / Finish button
  nextBtn.style.display = 'inline-flex';
  if (AppState.quiz.currentQuestionIndex === QUIZ_QUESTIONS.length - 1) {
    nextBtn.textContent = 'Finish Test';
  } else {
    nextBtn.textContent = 'Next Question →';
  }
};

function drawTacticalBoard(qData, selectedOptIdx) {
  const canvas = document.getElementById('tactical-pitch');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Set dimensions (fit bounds coordinate)
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Green Pitch Background
  ctx.fillStyle = '#1e3a24';
  ctx.fillRect(0, 0, w, h);

  // Draw grass stripes
  ctx.fillStyle = '#18301c';
  const stripeWidth = w / 12;
  for (let i = 0; i < 12; i += 2) {
    ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
  }

  // 2. Draw Pitch Markings (White Lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;

  // Boundary outer
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Center Line
  ctx.beginPath();
  ctx.moveTo(w / 2, 10);
  ctx.lineTo(w / 2, h - 10);
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, h / 5, 0, Math.PI * 2);
  ctx.stroke();

  // Center spot
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fill();

  // Left Penalty Box (assuming play moving left-to-right, but standard is moving towards right goal)
  // Let's draw Right Penalty Box (Mad Eagles target goal)
  ctx.strokeRect(w - w / 6 - 10, h / 4, w / 6, h / 2);
  ctx.strokeRect(w - w / 18 - 10, h / 3 + 10, w / 18, h / 3 - 20);

  // Left Penalty Box
  ctx.strokeRect(10, h / 4, w / 6, h / 2);
  ctx.strokeRect(10, h / 3 + 10, w / 18, h / 3 - 20);

  // Corner arcs
  const drawCorner = (cx, cy, start, end) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 10, start, end);
    ctx.stroke();
  };
  drawCorner(10, 10, 0, Math.PI / 2);
  drawCorner(w - 10, 10, Math.PI / 2, Math.PI);
  drawCorner(10, h - 10, Math.PI * 1.5, 0);
  drawCorner(w - 10, h - 10, Math.PI, Math.PI * 1.5);

  // 3. Draw Grid coordinates if enabled
  if (qData.board.gridOverlay) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

    // Vertical grid lines (A to H)
    const cols = 8;
    for (let c = 1; c < cols; c++) {
      const x = 10 + (c * (w - 20)) / cols;
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, h - 10);
      ctx.stroke();

      // Label letter
      const letter = String.fromCharCode(65 + c - 1);
      ctx.fillText(letter, x - (w - 20) / cols / 2, 20);
    }
    // Last letter label
    ctx.fillText(String.fromCharCode(65 + cols - 1), w - (w - 20) / cols / 2 - 10, 20);

    // Horizontal grid lines (1 to 6)
    const rows = 6;
    for (let r = 1; r < rows; r++) {
      const y = 10 + (r * (h - 20)) / rows;
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();

      // Label number
      ctx.fillText(String(r), 15, y - (h - 20) / rows / 2);
    }
    ctx.fillText(String(rows), 15, h - (h - 20) / rows / 2 - 5);
  }

  // Conversion function from coordinate percent (0-100) to actual canvas pixel
  function getCanvasCoords(percentX, percentY) {
    // 0-100 fits inside the outer boundary margins (10 to w-10)
    const px = 10 + (percentX / 100) * (w - 20);
    const py = 10 + (percentY / 100) * (h - 20);
    return { x: px, y: py };
  }

  // 4. Draw Offside Line (if active/answered)
  if (qData.board.offsideLine && AppState.quiz.answered) {
    const offCoords = getCanvasCoords(qData.board.offsideLine, 0);
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(offCoords.x, 10);
    ctx.lineTo(offCoords.x, h - 10);
    ctx.stroke();
    ctx.setLineDash([]); // Reset
    ctx.fillStyle = '#f1c40f';
    ctx.font = '10px sans-serif';
    ctx.fillText("Offside Line", offCoords.x - 65, h - 15);
  }

  // 5. Draw Passing Lanes
  if (qData.board.passLanes) {
    qData.board.passLanes.forEach((lane, idx) => {
      // Draw path indicator if quiz is answered OR if option matches
      const isSelected = selectedOptIdx !== null && selectedOptIdx === idx;
      const isCorrect = idx === qData.correctIndex;
      
      const start = getCanvasCoords(lane.from.x, lane.from.y);
      const end = getCanvasCoords(lane.to.x, lane.to.y);

      // Only draw if answered OR drawing all possible lanes as thin dashes
      if (!AppState.quiz.answered) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        drawArrow(ctx, start.x, start.y, end.x, end.y);
        ctx.setLineDash([]);
      } else if (isSelected || (AppState.quiz.answered && isCorrect)) {
        // Draw selected lane or correct lane
        ctx.strokeStyle = isCorrect ? '#2ecc71' : '#e74c3c';
        ctx.lineWidth = 3;
        drawArrow(ctx, start.x, start.y, end.x, end.y);

        if (lane.status === 'intercepted' && isSelected) {
          // Draw interception X
          ctx.strokeStyle = '#e74c3c';
          ctx.lineWidth = 3;
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;
          ctx.beginPath();
          ctx.moveTo(midX - 6, midY - 6);
          ctx.lineTo(midX + 6, midY + 6);
          ctx.moveTo(midX + 6, midY - 6);
          ctx.lineTo(midX - 6, midY + 6);
          ctx.stroke();
        }
      }
    });
  }

  // Helper function to draw an arrow
  function drawArrow(context, fromx, fromy, tox, toy) {
    const headlen = 10;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fillStyle = context.strokeStyle;
    context.fill();
  }

  // 6. Draw Ball
  if (qData.board.ball) {
    const ballPos = getCanvasCoords(qData.board.ball.x, qData.board.ball.y);
    ctx.beginPath();
    ctx.arc(ballPos.x, ballPos.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Inner star/circle details
    ctx.beginPath();
    ctx.arc(ballPos.x, ballPos.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
  }

  // 7. Draw Defenders (Blue)
  if (qData.board.defenders) {
    qData.board.defenders.forEach(def => {
      const pos = getCanvasCoords(def.x, def.y);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#3498db';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Number label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(def.label, pos.x, pos.y);
    });
  }

  // 8. Draw Attackers (Red)
  if (qData.board.attackers) {
    qData.board.attackers.forEach(att => {
      const pos = getCanvasCoords(att.x, att.y);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#ff1f40';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Number label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(att.label.replace(' (Ball)', ''), pos.x, pos.y);
    });
  }

  // 9. Draw Referee (Yellow)
  if (qData.board.referee) {
    const pos = getCanvasCoords(qData.board.referee.x, qData.board.referee.y);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#f1c40f';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Label REF
    ctx.fillStyle = '#000';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("R", pos.x, pos.y);
  }
}

function showQuizCertificate() {
  document.getElementById('quiz-active-deck').style.display = 'none';
  const certScreen = document.getElementById('quiz-cert-screen');
  certScreen.classList.add('active');

  // Fill in certificate details
  const nameInput = document.getElementById('reg-name');
  const studentName = nameInput && nameInput.value ? nameInput.value : 'Eagle Cadet';
  document.getElementById('cert-student-name').textContent = studentName;
  
  const scorePct = Math.round((AppState.quiz.score / (QUIZ_QUESTIONS.length * 10)) * 100);
  document.getElementById('cert-score-desc').innerHTML = `Has successfully passed the Academy Rules & Tactics Examination with a grade of <strong>${scorePct}%</strong> (${AppState.quiz.score} / ${QUIZ_QUESTIONS.length * 10} Points)`;

  // Save completion to registry if registered
  let regData = localStorage.getItem('madedles_registration');
  if (regData) {
    regData = JSON.parse(regData);
    regData.quizScore = AppState.quiz.score;
    localStorage.setItem('madedles_registration', JSON.stringify(regData));
    updateDigitalPassUI(regData);
  }
}

// --- Membership / Trials Registration ---
function initRegistration() {
  const form = document.getElementById('membership-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const birthdate = document.getElementById('reg-dob').value;
      const position = document.getElementById('reg-position').value;
      const tier = document.getElementById('reg-tier').value;

      const registrationId = 'ME-' + Math.floor(100000 + Math.random() * 900000);
      const regData = {
        id: registrationId,
        name,
        email,
        birthdate,
        position,
        tier,
        quizScore: AppState.quiz.completed ? AppState.quiz.score : null
      };

      // Save to local storage
      localStorage.setItem('madedles_registration', JSON.stringify(regData));
      
      // Update UI
      updateDigitalPassUI(regData);
      
      alert('Registration Successful! Your Mad Eagles digital pass has been generated.');
    });
  }

  // Load existing registration
  const savedReg = localStorage.getItem('madedles_registration');
  if (savedReg) {
    const data = JSON.parse(savedReg);
    
    // Autofill fields
    if (document.getElementById('reg-name')) document.getElementById('reg-name').value = data.name;
    if (document.getElementById('reg-email')) document.getElementById('reg-email').value = data.email;
    if (document.getElementById('reg-dob')) document.getElementById('reg-dob').value = data.birthdate;
    if (document.getElementById('reg-position')) document.getElementById('reg-position').value = data.position;
    if (document.getElementById('reg-tier')) document.getElementById('reg-tier').value = data.tier;

    updateDigitalPassUI(data);
  }
}

function updateDigitalPassUI(data) {
  const passContainer = document.getElementById('digital-pass-container');
  if (!passContainer) return;

  const currentYear = new Date().getFullYear();
  const displayPosition = data.position ? data.position.toUpperCase() : 'MIDFIELDER';
  const displayTier = data.tier === 'academy' ? 'ACADEMY CADET' : 'ELITE MEMBER';
  const tierClass = data.tier === 'elite' ? 'gold' : '';

  passContainer.innerHTML = `
    <div class="membership-pass">
      <div class="pass-glow"></div>
      <div class="pass-header">
        <div class="pass-logo">
          <svg viewBox="0 0 100 100" class="logo-icon" style="width:20px; height:20px; filter:none;"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8"/><path d="M30 40 L50 25 L70 40 L50 75 Z" fill="currentColor"/></svg>
          MAD EAGLES
        </div>
        <span class="pass-tier ${tierClass}">${displayTier}</span>
      </div>
      <div class="pass-body">
        <div class="pass-number">ID: ${data.id}</div>
        <div class="pass-name">${data.name.toUpperCase()}</div>
        
        <div class="pass-meta">
          <div>
            <div class="pass-meta-lbl">Role / Position</div>
            <div class="pass-meta-val">${displayPosition}</div>
          </div>
          <div>
            <div class="pass-meta-lbl">Tactical Score</div>
            <div class="pass-meta-val">${data.quizScore !== null ? data.quizScore + ' Pts' : 'PENDING TEST'}</div>
          </div>
        </div>
      </div>
      <div class="pass-footer">
        <div class="pass-barcode"></div>
        <div class="pass-year">${currentYear}</div>
      </div>
    </div>
  `;
}
