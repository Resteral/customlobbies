// ==========================================
// ARKHERON STATS & BUILD MAKER DATABASE
// ==========================================

const ETERNALS = [
  { id: 'leodin', name: 'Leodin', emoji: '🧝', role: 'Fighter', set: 'Tempest', lore: 'A swift, wind-bending swordsman who utilizes gale forces to reposition and outmaneuver adversaries. He climbs the Tower looking for ancient relics that can cure his dying homeland.', stats: { hp: 'A', speed: 'S', damage: 'A' }, ability: { name: 'Gale Slash', desc: 'Leaps forward in a whirlwind, dealing 280% damage to all enemies hit and knocking them into the air for 1.5 seconds. Gain 30% movement speed for 4 seconds afterwards.' } },
  { id: 'rynshi', name: 'Rynshi', emoji: '🥷', role: 'Assassin', set: 'Tempest', lore: 'An aero-adept rogue who slips through shadows carried by draft winds. Rynshi targets high-priority spellcasters and can quickly vanish into air currents.', stats: { hp: 'C', speed: 'S', damage: 'S' }, ability: { name: 'Aero Decoy', desc: 'Vanish into thin air, leaving a wind clone that explodes for 180% magic damage when hit, blinding enemies. Relocate 5 meters in the targeted direction.' } },
  
  { id: 'dahla', name: 'Dahla', emoji: '🧛', role: 'Bruiser', set: 'Bloodthorn', lore: 'A savage arena veteran who infuses physical blades with life-stealing magic. Every cut feeds her hunger, making her nearly impossible to defeat in close-quarters combat.', stats: { hp: 'A', speed: 'B', damage: 'S' }, ability: { name: 'Sanguine Fury', desc: 'Enter a state of blood Frenzy for 6 seconds. Increase lifesteal by 25% and attack speed by 40%. Attacks deal bonus physical damage equal to 4% of target\'s current health.' } },
  { id: 'ravah', name: 'Ravah', emoji: '🐲', role: 'Fighter', set: 'Bloodthorn', lore: 'A beastmaster from the volcanic outer cliffs who utilizes blood pacts with wild drakes. Ravah fights with relentless ferocity, growing stronger as his own health decreases.', stats: { hp: 'S', speed: 'B', damage: 'A' }, ability: { name: 'Beast Claws', desc: 'Strike forward in a wide arc, dealing 220% physical damage and applying a Bleed effect that deals 80% damage over 5 seconds. Heals Ravah for 50% of the damage dealt.' } },
  
  { id: 'edani', name: 'Edani', emoji: '🧙', role: 'Mage', set: 'Voidbringer', lore: 'An academic wizard who unlocked void equations. Edani calls down massive gravitational singularities that compress space, crushing groups of enemies at once.', stats: { hp: 'B', speed: 'B', damage: 'S' }, ability: { name: 'Void Collapse', desc: 'Summon a gravitational anomaly at a target area for 3 seconds. Pulls in all nearby entities and deals 120% Ability Power damage per second, exploding for 300% AP at the end.' } },
  { id: 'hollow', name: 'Hollow', emoji: '👻', role: 'Mage', set: 'Voidbringer', lore: 'A restless spirit bound to ancient relics. Hollow channels cosmic decay and phasing mechanics to pass through obstacles and disintegrate enemies with abyssal energy.', stats: { hp: 'C', speed: 'A', damage: 'S' }, ability: { name: 'Abyssal Beam', desc: 'Channell a concentrated ray of void energy for up to 3 seconds. Deals 450% AP damage over the duration. Hollow can slowly hover and rotate while casting.' } },
  
  { id: 'karriv', name: 'Karriv', emoji: '🛡️', role: 'Tank', set: 'Solar Flare', lore: 'A holy crusader who channels solar heat into his heavy shield and broadsword. Karriv leads the front lines, scorching enemies while protecting his allies with walls of flame.', stats: { hp: 'S', speed: 'C', damage: 'A' }, ability: { name: 'Sol Crest', desc: 'Raises shield to absorb all frontal attacks for 3 seconds, storing the damage. Release it in a solar blast dealing 150% of stored damage + 10% of max health as fire damage.' } },
  { id: 'vaton', name: 'Vaton', emoji: '🤖', role: 'Juggernaut', set: 'Solar Flare', lore: 'A mechanical blacksmith construct powered by a miniature star core. Vaton expels superheated steam to burn foes and gains high armor shielding when critically damaged.', stats: { hp: 'S', speed: 'C', damage: 'A' }, ability: { name: 'Superheat Slam', desc: 'Strike the ground with massive force, creating a magma fissure that ripples forward. Deals 240% damage, ignites targets for 4 seconds, and creates a solar shield for 15% Max HP.' } },
  
  { id: 'grimwold', name: 'Grimwold', emoji: '🎅', role: 'Tank', set: 'Frostward', lore: 'An ancient guardian of the frost peaks who can freeze his own blood to shrug off mortal wounds. He locks down battlefields by creating glaciers and blizzards.', stats: { hp: 'S', speed: 'D', damage: 'B' }, ability: { name: 'Rime Ward', desc: 'Create a localized frost dome for 5 seconds. Allies inside gain 30% armor and magic shield. Enemies inside are slowed by 50% and frozen for 1.5 seconds if they stay for 3 seconds.' } },
  { id: 'tsubo', name: 'Tsu\'bo', emoji: '🥋', role: 'Fighter', set: 'Frostward', lore: 'A warrior monk who channels glacial flow into his martial arts. Tsu\'bo deflects attacks with sheets of ice and strikes with bone-chilling force.', stats: { hp: 'A', speed: 'A', damage: 'B' }, ability: { name: 'Glacial Palm', desc: 'Strike a target dealing 200% damage and freezing them solid for 2 seconds. Breaking the ice deals an additional 150% damage and slows surrounding enemies.' } },
  
  { id: 'irenna', name: 'Irenna', emoji: '⚔️', role: 'Assassin', set: 'Shadowstep', lore: 'A deadly dual-blade duelist who performs flawless strikes from the blind spots. Irenna thrives in fast skirmishes, chaining critical dashes between targets.', stats: { hp: 'B', speed: 'A', damage: 'S' }, ability: { name: 'Twilight Dash', desc: 'Dashes through a target, dealing 250% critical damage if striking from behind. Can be recast once within 3 seconds if the first strike kills or critically hits.' } },
  { id: 'penelope', name: 'Penelope', emoji: '👩', role: 'Ranger', set: 'Shadowstep', lore: 'An alchemist archer who coats her arrowheads in lethal nightshade poisons. She sets cloaked toxic traps and fires sniper shots from absolute stealth.', stats: { hp: 'C', speed: 'A', damage: 'S' }, ability: { name: 'Eclipse Cloak', desc: 'Enter absolute invisibility for 4 seconds. During this time, movement speed is increased by 25%. Your next basic attack deals 180% bonus damage and silences for 2 seconds.' } }
];

const RELICS = [
  // Tempest Set (Speed & Air)
  { id: 'tempest_crown', name: 'Crown of Hurricanes', slot: 'crown', set: 'Tempest', stats: { hp: 100, ap: 15, speed: 15 }, desc: 'A crown made of condensed vapor. Grants movement speed and base health.' },
  { id: 'tempest_weapon1', name: 'Gale Bow', slot: 'weapon1', set: 'Tempest', stats: { ap: 35, speed: 20 }, desc: 'Fires arrows wrapped in whistling wind. Greatly increases speed and power.' },
  { id: 'tempest_weapon2', name: 'Zephyr Scimitar', slot: 'weapon2', set: 'Tempest', stats: { ap: 30, speed: 15 }, desc: 'An exceptionally lightweight blade that slashes with hurricane speed.' },
  { id: 'tempest_amulet', name: 'Tornado Pendant', slot: 'amulet', set: 'Tempest', stats: { cdr: 5, speed: 15 }, desc: 'An amulet housing a miniature storm. Grants cooldown reductions.' },

  // Bloodthorn Set (Lifesteal & Physical)
  { id: 'bloodthorn_crown', name: 'Cowl of Bloodshed', slot: 'crown', set: 'Bloodthorn', stats: { hp: 150, ap: 10, lifesteal: 3 }, desc: 'A crimson hood smelling of iron. Grants lifesteal and high health.' },
  { id: 'bloodthorn_weapon1', name: 'Bloodthorn Daggers', slot: 'weapon1', set: 'Bloodthorn', stats: { ap: 25, lifesteal: 8 }, desc: 'Daggers that feed on blood, providing high attack speed and lifesteal.' },
  { id: 'bloodthorn_weapon2', name: 'Crimson Greatsword', slot: 'weapon2', set: 'Bloodthorn', stats: { ap: 40, lifesteal: 5 }, desc: 'A heavy claymore that absorbs life force from wounds it inflicts.' },
  { id: 'bloodthorn_amulet', name: 'Vampiric Amulet', slot: 'amulet', set: 'Bloodthorn', stats: { hp: 100, lifesteal: 5 }, desc: 'A dark red jewel that glows in the dark. Grants flat healing from all damage.' },

  // Voidbringer Set (Magic & CDR)
  { id: 'voidbringer_crown', name: 'Circlet of the Rift', slot: 'crown', set: 'Voidbringer', stats: { hp: 80, ap: 25, cdr: 4 }, desc: 'Channels cosmic distortions, providing high power and CDR.' },
  { id: 'voidbringer_weapon1', name: 'Rift Scepter', slot: 'weapon1', set: 'Voidbringer', stats: { ap: 45, cdr: 5 }, desc: 'Spits purple sparks from the abyss. The ultimate tool for spells.' },
  { id: 'voidbringer_weapon2', name: 'Abyssal Codex', slot: 'weapon2', set: 'Voidbringer', stats: { ap: 40, cdr: 5 }, desc: 'A book containing void equations. Enhances ability frequency.' },
  { id: 'voidbringer_amulet', name: 'Singularity Lens', slot: 'amulet', set: 'Voidbringer', stats: { hp: 100, cdr: 6 }, desc: 'Distorts light. Grants highest cooldown reduction on the market.' },

  // Solar Flare Set (Fire & Defenses)
  { id: 'solar_crown', name: 'Heliodor Crown', slot: 'crown', set: 'Solar Flare', stats: { hp: 200, ap: 10, armor: 15 }, desc: 'Glows like a small sun. Provides significant health and shielding.' },
  { id: 'solar_weapon1', name: 'Sunspire Halberd', slot: 'weapon1', set: 'Solar Flare', stats: { ap: 30, armor: 20 }, desc: 'A long polearm heated to white-hot levels. Grants armor and high range.' },
  { id: 'solar_weapon2', name: 'Aegis of the Sun', slot: 'weapon2', set: 'Solar Flare', stats: { hp: 150, armor: 30 }, desc: 'A heavy tower shield that emits searing waves. Best defensive weapon.' },
  { id: 'solar_amulet', name: 'Sol Ring Pendant', slot: 'amulet', set: 'Solar Flare', stats: { hp: 100, armor: 15, cdr: 5 }, desc: 'Forged in stellar flames, balancing defenses and ability speeds.' },

  // Frostward Set (Ice & Max Health)
  { id: 'frostward_crown', name: 'Icebound Visor', slot: 'crown', set: 'Frostward', stats: { hp: 250, armor: 10 }, desc: 'Constructed from glacier shards. Grants the highest flat health.' },
  { id: 'frostward_weapon1', name: 'Glacier Hammer', slot: 'weapon1', set: 'Frostward', stats: { ap: 20, hp: 150, armor: 20 }, desc: 'A crushing hammer of pure ice. Boosts health and defensive armor.' },
  { id: 'frostward_weapon2', name: 'Frostbite Shield', slot: 'weapon2', set: 'Frostward', stats: { hp: 200, armor: 30 }, desc: 'A crystalline shield that freezes attackers. Highest block stats.' },
  { id: 'frostward_amulet', name: 'Permafrost Necklace', slot: 'amulet', set: 'Frostward', stats: { hp: 150, cdr: 5 }, desc: 'A cold collar that dampens impact shock, boosting health pool.' },

  // Shadowstep Set (Stealth & Criticals)
  { id: 'shadowstep_crown', name: 'Hood of Whispers', slot: 'crown', set: 'Shadowstep', stats: { hp: 100, ap: 10, crit: 4 }, desc: 'Muffles breathing and sight, giving a solid critical boost.' },
  { id: 'shadowstep_weapon1', name: 'Nightshade Katana', slot: 'weapon1', set: 'Shadowstep', stats: { ap: 35, crit: 8 }, desc: 'A dark steel blade coated in deadly plant poisons. High critical strike.' },
  { id: 'shadowstep_weapon2', name: 'Shuriken of Twilight', slot: 'weapon2', set: 'Shadowstep', stats: { ap: 25, crit: 6 }, desc: 'Throwing weapons that bypass defenses, boosting crit damage.' },
  { id: 'shadowstep_amulet', name: 'Eclipse Talisman', slot: 'amulet', set: 'Shadowstep', stats: { speed: 10, crit: 5 }, desc: 'An amulet that flickers out of sight. Boosts critical rating and speed.' }
];

const SETS_METADATA = {
  'Tempest': {
    bonus2: { name: 'Tailwind Resonance', desc: '+12% Movement Speed and wind trails.' },
    bonus4: { name: 'Storm Ascendancy', desc: 'Allows transformation into Leodin or Rynshi. Ultimate attacks shock all nearby foes.' }
  },
  'Bloodthorn': {
    bonus2: { name: 'Sanguine Feast', desc: '+8% Lifesteal and bleed details.' },
    bonus4: { name: 'Carnage Ascendancy', desc: 'Allows transformation into Dahla or Ravah. Attacks generate stacks of physical frenzy.' }
  },
  'Voidbringer': {
    bonus2: { name: 'Spellweave Surge', desc: '+15% Cooldown Reduction (CDR).' },
    bonus4: { name: 'Abyssal Ascendancy', desc: 'Allows transformation into Edani or Hollow. Spells apply a temporal decay vortex.' }
  },
  'Solar Flare': {
    bonus2: { name: 'Sunbound Aegis', desc: '+25 Armor and +100 Max Health.' },
    bonus4: { name: 'Helios Ascendancy', desc: 'Allows transformation into Karriv or Vaton. Releases fire explosions on shield blocks.' }
  },
  'Frostward': {
    bonus2: { name: 'Winter\'s Shielding', desc: '+300 Max Health and chills melee attackers.' },
    bonus4: { name: 'Rime Ascendancy', desc: 'Allows transformation into Grimwold or Tsu\'bo. Freezes attackers when shielding.' }
  },
  'Shadowstep': {
    bonus2: { name: 'Precision Dagger', desc: '+15% Critical Strike Chance.' },
    bonus4: { name: 'Shadow Ascendancy', desc: 'Allows transformation into Irenna or Penelope. Vanishes from enemy sight on critical kills.' }
  }
};

// ==========================================
// MOCK USERS DATABASE
// ==========================================
const MOCK_PROFILES = {
  'sean': {
    username: 'Sean',
    avatar: '🛡️',
    title: 'Relic Hunter',
    bio: 'Climbing the Tower, one relic at a time. Solar Flare and Tempest sets are my jam!',
    matchesCount: 154,
    winrate: '58.4%',
    kd: '1.84',
    avgFloor: '6.2 Floor',
    savedBuilds: [
      { id: 'mock-1', name: 'Solar Sentinel Tank', items: ['solar_crown', 'solar_weapon1', 'solar_weapon2', 'solar_amulet'], eternalId: 'karriv', notes: 'Max out shields and reflect fire damage. Ideal frontliner.' },
      { id: 'mock-2', name: 'Windrunner Assassin', items: ['tempest_crown', 'tempest_weapon1', 'tempest_weapon2', 'tempest_amulet'], eternalId: 'rynshi', notes: 'Maximum mobility and hit-and-run tactics.' }
    ],
    matches: [
      { id: 101, type: 'Ascension Royale', eternal: 'Karriv', outcome: 'Win', kda: '8/2/14', floor: '10th Floor (Victory)', score: '24,800 pts' },
      { id: 102, type: 'Ascension Royale', eternal: 'Rynshi', outcome: 'Loss', kda: '12/4/3', floor: '6th Floor', score: '12,400 pts' },
      { id: 103, type: 'Ascension Royale', eternal: 'Karriv', outcome: 'Win', kda: '3/1/18', floor: '10th Floor (Victory)', score: '28,100 pts' },
      { id: 104, type: 'Ascension Royale', eternal: 'Dahla', outcome: 'Win', kda: '15/3/8', floor: '10th Floor (Victory)', score: '31,000 pts' },
      { id: 105, type: 'Ascension Royale', eternal: 'Leodin', outcome: 'Loss', kda: '5/5/4', floor: '4th Floor', score: '6,200 pts' }
    ]
  },
  'tofushark': {
    username: 'TofuShark',
    avatar: '🦊',
    title: 'Scavenger',
    bio: 'Casual rogue player, mostly trying out Shattered builds. Give me critical strike chance and lifesteal!',
    matchesCount: 89,
    winrate: '48.9%',
    kd: '1.21',
    avgFloor: '4.8 Floor',
    savedBuilds: [
      { id: 'mock-3', name: 'Shattered Blood-Blade', items: ['bloodthorn_crown', 'shadowstep_weapon1', 'bloodthorn_weapon2', 'shadowstep_amulet'], eternalId: null, notes: 'Mixes lifesteal and high crit rate. Very fun squishy duelist.' }
    ],
    matches: [
      { id: 201, type: 'Ascension Royale', eternal: 'None (Shattered)', outcome: 'Loss', kda: '6/6/2', floor: '5th Floor', score: '8,900 pts' },
      { id: 202, type: 'Ascension Royale', eternal: 'Penelope', outcome: 'Win', kda: '10/2/8', floor: '10th Floor (Victory)', score: '23,100 pts' }
    ]
  },
  'towergod': {
    username: 'TowerGod',
    avatar: '👑',
    title: 'Apex Eternal',
    bio: 'Competitive player. Analyzing relics for the absolute highest DPS meta builds.',
    matchesCount: 1204,
    winrate: '71.2%',
    kd: '3.42',
    avgFloor: '8.9 Floor',
    savedBuilds: [
      { id: 'mock-4', name: 'Void Mage Nuke', items: ['voidbringer_crown', 'voidbringer_weapon1', 'voidbringer_weapon2', 'voidbringer_amulet'], eternalId: 'hollow', notes: 'Pure glass cannon CDR. Keep distance and channel Abyssal Beam.' }
    ],
    matches: [
      { id: 301, type: 'Ascension Royale', eternal: 'Hollow', outcome: 'Win', kda: '19/1/5', floor: '10th Floor (Victory)', score: '44,900 pts' },
      { id: 302, type: 'Ascension Royale', eternal: 'Edani', outcome: 'Win', kda: '14/0/11', floor: '10th Floor (Victory)', score: '41,200 pts' },
      { id: 303, type: 'Ascension Royale', eternal: 'Hollow', outcome: 'Win', kda: '22/2/8', floor: '10th Floor (Victory)', score: '49,800 pts' }
    ]
  }
};

// ==========================================
// CLIENT STATE MANAGEMENT
// ==========================================
let appState = {
  currentTab: 'dashboard',
  linkedUser: null, // Stores user object if logged in/linked
  activeProfile: 'sean', // Which profile is currently visible in Profile tab
  
  // Build Maker state
  build: {
    name: '',
    notes: '',
    slots: {
      crown: null,
      weapon1: null,
      weapon2: null,
      amulet: null
    },
    selectedEternalId: null
  },
  
  activeSelectorSlot: null, // Crown, weapon1, etc.
  relicFilterSet: 'all',    // active set filter inside relic selector
  
  // Stored custom builds (localStorage fallback)
  customBuilds: []
};

// ==========================================
// APP INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // 1. Load LocalStorage details
  loadLocalStorage();

  // 2. Setup live Steam statistics (mock live query with public API logic or simulated data)
  initializeLiveStats();

  // 3. Render Dashboard Meta lists
  renderDashboard();

  // 4. Render Eternals Lore Tab
  renderEternalsTab();

  // 5. Build Maker UI init
  updateBuildMakerUI();

  // 6. Profiles init
  loadProfile(appState.activeProfile);

  // 7. Check if there is an encoded build in the URL parameters
  checkUrlParams();
  
  // 8. Setup window close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('relic-selector-modal');
      closeModal('link-account-modal');
      closeModal('eternal-detail-modal');
    }
  });
});

function loadLocalStorage() {
  // Linked user
  const savedUser = localStorage.getItem('arkheron_linked_user');
  if (savedUser) {
    appState.linkedUser = JSON.parse(savedUser);
    // Sync to MOCK_PROFILES so it updates player list
    MOCK_PROFILES[appState.linkedUser.username.toLowerCase()] = appState.linkedUser;
    appState.activeProfile = appState.linkedUser.username.toLowerCase();
  }
  
  updateHeaderUserWidget();

  // Saved builds
  const savedBuilds = localStorage.getItem('arkheron_custom_builds');
  if (savedBuilds) {
    appState.customBuilds = JSON.parse(savedBuilds);
  } else {
    // Save empty initially
    localStorage.setItem('arkheron_custom_builds', JSON.stringify([]));
  }
}

// ==========================================
// STEAM API & SIMULATED STATS
// ==========================================
function initializeLiveStats() {
  const liveEl = document.getElementById('live-players');
  const peakEl = document.getElementById('peak-players');
  const matchesEl = document.getElementById('global-matches');

  // Attempt to fetch actual Steam concurrent player counts using proxy / steam API
  // App ID 3401450 is the playtest/game ID
  fetch('https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=3401450')
    .then(res => {
      if (!res.ok) throw new Error('API down');
      return res.json();
    })
    .then(data => {
      if (data && data.response && data.response.player_count !== undefined) {
        const count = data.response.player_count;
        // Check if count is realistic (sometimes playtest counts are low or 0 during offline)
        const displayCount = count > 0 ? count : Math.floor(1000 + Math.random() * 800);
        liveEl.textContent = Number(displayCount).toLocaleString();
        peakEl.textContent = Number(Math.floor(displayCount * 2.1)).toLocaleString();
        showToast('Successfully pulled live Steam player data.', 'info');
      } else {
        generateSimulatedStats();
      }
    })
    .catch(() => {
      // Fallback to simulated database
      generateSimulatedStats();
    });

  // Dynamic ticking simulation of active players to make it feel alive!
  setInterval(() => {
    let currentVal = parseInt(liveEl.textContent.replace(/,/g, ''));
    if (isNaN(currentVal)) currentVal = 1480;
    
    // Add/subtract small numbers
    const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
    const newVal = Math.max(100, currentVal + change);
    liveEl.textContent = newVal.toLocaleString();
    
    // Increment global matches slowly
    let matchesVal = parseInt(matchesEl.textContent.replace(/,/g, ''));
    if (isNaN(matchesVal)) matchesVal = 41208;
    matchesEl.textContent = (matchesVal + (Math.random() > 0.7 ? 1 : 0)).toLocaleString();
  }, 4000);
}

function generateSimulatedStats() {
  const liveEl = document.getElementById('live-players');
  const peakEl = document.getElementById('peak-players');
  const matchesEl = document.getElementById('global-matches');
  
  // Seed realistic numbers
  const live = Math.floor(1200 + Math.random() * 600);
  const peak = Math.floor(2800 + Math.random() * 1000);
  const matches = Math.floor(38000 + Math.random() * 5000);
  
  liveEl.textContent = live.toLocaleString();
  peakEl.textContent = peak.toLocaleString();
  matchesEl.textContent = matches.toLocaleString();
}

// ==========================================
// TABS & ROUTING
// ==========================================
function switchTab(tabId) {
  // Update nav buttons
  document.querySelectorAll('nav .nav-link').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update tab container visibilities
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });
  const activeSection = document.getElementById(`tab-${tabId}`);
  if (activeSection) activeSection.classList.add('active');

  appState.currentTab = tabId;
  
  // Reload profile tab when switched to it
  if (tabId === 'profiles') {
    loadProfile(appState.activeProfile);
  }
}

// ==========================================
// DASHBOARD VIEW GENERATION
// ==========================================
function renderDashboard() {
  // Most Played Eternals Usage Data
  const usageData = [
    { name: 'Karriv', useRate: 18.5, winRate: 54.2, emoji: '🛡️' },
    { name: 'Irenna', useRate: 15.2, winRate: 52.8, emoji: '⚔️' },
    { name: 'Leodin', useRate: 13.9, winRate: 50.1, emoji: '🧝' },
    { name: 'Edani', useRate: 12.1, winRate: 51.5, emoji: '🧙' },
    { name: 'Dahla', useRate: 10.4, winRate: 48.7, emoji: '🧛' },
    { name: 'Grimwold', useRate: 8.8, winRate: 47.9, emoji: '🎅' },
    { name: 'Hollow', useRate: 7.5, winRate: 53.6, emoji: '👻' },
    { name: 'Penelope', useRate: 5.6, winRate: 49.5, emoji: '👩' }
  ];

  const usageContainer = document.getElementById('eternals-usage-list');
  usageContainer.innerHTML = '';

  usageData.forEach(item => {
    const itemHtml = `
      <div class="usage-item">
        <div class="usage-item-info">
          <span class="usage-item-name">${item.emoji} ${item.name}</span>
          <span class="usage-item-percentage">${item.useRate}% usage <span style="color: var(--text-dark); margin: 0 0.25rem;">|</span> <span style="color: var(--color-success);">${item.winRate}% WR</span></span>
        </div>
        <div class="usage-item-bar-bg">
          <div class="usage-item-bar-fill" style="width: 0%" data-width="${item.useRate * 5}%"></div>
        </div>
      </div>
    `;
    usageContainer.insertAdjacentHTML('beforeend', itemHtml);
  });

  // Relic Set Meta Rankings
  const setRankings = [
    { name: 'Solar Flare Set', score: 55.4, pick: '22%', badge: 'badge-success', rating: 'S-Tier' },
    { name: 'Shadowstep Set', score: 53.8, pick: '18%', badge: 'badge-success', rating: 'A-Tier' },
    { name: 'Voidbringer Set', score: 52.5, pick: '20%', badge: 'badge-primary', rating: 'A-Tier' },
    { name: 'Tempest Set', score: 50.8, pick: '15%', badge: 'badge-primary', rating: 'B-Tier' },
    { name: 'Bloodthorn Set', score: 49.1, pick: '14%', badge: 'badge-warning', rating: 'C-Tier' },
    { name: 'Frostward Set', score: 46.2, pick: '11%', badge: 'badge-danger', rating: 'D-Tier' }
  ];

  const setMetaContainer = document.getElementById('relic-set-meta-list');
  setMetaContainer.innerHTML = '';

  setRankings.forEach((set, index) => {
    const setHtml = `
      <div class="meta-item">
        <div class="meta-item-left">
          <span class="meta-item-rank rank-${index+1}">${index+1}</span>
          <div>
            <div class="meta-item-name">${set.name}</div>
            <div class="meta-item-subset">Pick Rate: ${set.pick}</div>
          </div>
        </div>
        <div class="meta-item-right">
          <span class="meta-item-winrate">${set.score}%</span>
          <span class="badge ${set.badge}" style="font-size: 0.65rem;">${set.rating}</span>
        </div>
      </div>
    `;
    setMetaContainer.insertAdjacentHTML('beforeend', setHtml);
  });

  // Trigger animations after a tiny delay
  setTimeout(() => {
    document.querySelectorAll('.usage-item-bar-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-width');
    });
  }, 100);
}

// ==========================================
// ETERNALS LORE GRID
// ==========================================
function renderEternalsTab() {
  const container = document.getElementById('eternals-cards-container');
  container.innerHTML = '';

  ETERNALS.forEach(eternal => {
    const cardHtml = `
      <div class="glass-card eternal-card" onclick="viewEternalDetails('${eternal.id}')">
        <div class="eternal-card-avatar">${eternal.emoji}</div>
        <h3 class="eternal-card-name">${eternal.name}</h3>
        <span class="eternal-card-role">${eternal.role}</span>
        <p class="eternal-card-desc">${eternal.lore.substring(0, 75)}...</p>
        <div class="eternal-card-stats">
          <span>HP: ${eternal.stats.hp}</span> • 
          <span>SPD: ${eternal.stats.speed}</span> • 
          <span>DMG: ${eternal.stats.damage}</span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
  });
}

function viewEternalDetails(eternalId) {
  const eternal = ETERNALS.find(e => e.id === eternalId);
  if (!eternal) return;

  document.getElementById('eternal-modal-title').textContent = `${eternal.name} Profile`;
  document.getElementById('eternal-modal-avatar').textContent = eternal.emoji;
  document.getElementById('eternal-modal-name').textContent = eternal.name;
  document.getElementById('eternal-modal-role').textContent = eternal.role;
  document.getElementById('eternal-modal-relicset').textContent = `${eternal.set} Set Synergy`;
  document.getElementById('eternal-modal-lore').textContent = eternal.lore;
  
  // Stat values mapping
  document.getElementById('eternal-modal-stat-health').textContent = eternal.stats.hp;
  document.getElementById('eternal-modal-stat-speed').textContent = eternal.stats.speed;
  document.getElementById('eternal-modal-stat-damage').textContent = eternal.stats.damage;
  
  document.getElementById('eternal-modal-ability-name').textContent = eternal.ability.name;
  document.getElementById('eternal-modal-ability-desc').textContent = eternal.ability.desc;

  openModal('eternal-detail-modal');
}

// ==========================================
// BUILD MAKER LOGIC
// ==========================================
function openRelicSelector(slotName) {
  appState.activeSelectorSlot = slotName;
  document.getElementById('relic-selector-title').textContent = `Select ${slotName.toUpperCase()} Relic`;
  
  // Reset filter and render
  appState.relicFilterSet = 'all';
  document.querySelectorAll('#relic-selector-modal .btn-secondary').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById('filter-all-relics').classList.add('active');
  
  renderRelicsSelectorGrid();
  openModal('relic-selector-modal');
}

function filterRelics(setName) {
  appState.relicFilterSet = setName;
  
  document.querySelectorAll('#relic-selector-modal .btn-secondary').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`filter-${setName}`).classList.add('active');
  
  renderRelicsSelectorGrid();
}

function renderRelicsSelectorGrid() {
  const grid = document.getElementById('relics-selector-grid');
  grid.innerHTML = '';

  const slotType = appState.activeSelectorSlot; // crown, weapon1, weapon2, amulet
  
  // Filter relics that fit this specific slot
  let filtered = RELICS.filter(item => {
    // weapon1 and weapon2 can accept any weapon slot
    if (slotType === 'weapon1' || slotType === 'weapon2') {
      return item.slot === 'weapon1' || item.slot === 'weapon2';
    }
    return item.slot === slotType;
  });

  // Filter by Relic Set if not 'all'
  if (appState.relicFilterSet !== 'all') {
    filtered = filtered.filter(item => item.set === appState.relicFilterSet);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dark); padding: 2rem;">No relics match this filter.</div>`;
    return;
  }

  filtered.forEach(relic => {
    // Generate stat description strings
    const statLines = [];
    if (relic.stats.hp) statLines.push(`+${relic.stats.hp} HP`);
    if (relic.stats.ap) statLines.push(`+${relic.stats.ap} AP`);
    if (relic.stats.armor) statLines.push(`+${relic.stats.armor} Armor`);
    if (relic.stats.speed) statLines.push(`+${relic.stats.speed}% Speed`);
    if (relic.stats.cdr) statLines.push(`+${relic.stats.cdr}% CDR`);
    if (relic.stats.crit) statLines.push(`+${relic.stats.crit}% Crit`);
    if (relic.stats.lifesteal) statLines.push(`+${relic.stats.lifesteal}% Life`);

    // Icon emoji based on slot
    let emoji = '👑';
    if (relic.slot === 'weapon1' || relic.slot === 'weapon2') emoji = '⚔️';
    if (relic.slot === 'amulet') emoji = '📿';

    const card = `
      <div class="relic-option-card" onclick="selectRelic('${relic.id}')">
        <div class="relic-option-icon">${emoji}</div>
        <div class="relic-option-info">
          <span class="relic-option-name">${relic.name}</span>
          <span class="relic-option-set">${relic.set} Set</span>
          <span class="relic-option-stats">${statLines.join(' • ')}</span>
        </div>
      </div>
    `;
    grid.insertAdjacentHTML('beforeend', card);
  });
}

function selectRelic(relicId) {
  const relic = RELICS.find(r => r.id === relicId);
  if (!relic || !appState.activeSelectorSlot) return;

  appState.build.slots[appState.activeSelectorSlot] = relic;
  closeModal('relic-selector-modal');
  
  // Trigger update
  updateBuildMakerUI();
  showToast(`Equipped ${relic.name}.`, 'success');
}

function removeRelic(slotName, event) {
  if (event) event.stopPropagation(); // prevent modal opening trigger
  
  const relic = appState.build.slots[slotName];
  if (!relic) return;

  appState.build.slots[slotName] = null;
  
  // If we cleared items, we might need to reset selectedEternalId
  checkEternalSelectionReset();

  updateBuildMakerUI();
  showToast(`Unequipped ${relic.name}.`, 'info');
}

// Checks if we lost the 4-set bonus that allowed our current Eternal
function checkEternalSelectionReset() {
  const setCounts = getActiveSetCounts();
  let has4Set = false;
  let activeSetName = '';
  
  for (const [setName, count] of Object.entries(setCounts)) {
    if (count === 4) {
      has4Set = true;
      activeSetName = setName;
    }
  }

  if (!has4Set) {
    appState.build.selectedEternalId = null;
  } else {
    // Verify current selectedEternal matches the active 4-set
    const currentEternal = ETERNALS.find(e => e.id === appState.build.selectedEternalId);
    if (currentEternal && currentEternal.set !== activeSetName) {
      appState.build.selectedEternalId = null;
    }
  }
}

// Counts how many equipped relics belong to each set
function getActiveSetCounts() {
  const counts = {};
  Object.values(appState.build.slots).forEach(relic => {
    if (relic) {
      counts[relic.set] = (counts[relic.set] || 0) + 1;
    }
  });
  return counts;
}

function updateBuildMakerUI() {
  // 1. Sync slots visualization
  const slots = ['crown', 'weapon1', 'weapon2', 'amulet'];
  
  slots.forEach(slot => {
    const cardEl = document.getElementById(`slot-${slot}`);
    const nameEl = document.getElementById(`name-${slot}`);
    const setEl = document.getElementById(`set-${slot}`);
    const relic = appState.build.slots[slot];
    
    if (relic) {
      cardEl.classList.add('equipped');
      nameEl.textContent = relic.name;
      setEl.textContent = `${relic.set} Set`;
    } else {
      cardEl.classList.remove('equipped');
      nameEl.textContent = 'Empty Slot';
      setEl.textContent = 'Click to select relic';
    }
  });

  // 2. Count set counts and determine active synergies
  const setCounts = getActiveSetCounts();
  
  let has2Set = false;
  let has4Set = false;
  let setWith2 = [];
  let setWith4 = null;

  for (const [setName, count] of Object.entries(setCounts)) {
    if (count >= 2 && count < 4) {
      has2Set = true;
      setWith2.push(setName);
    } else if (count === 4) {
      has2Set = true;
      has4Set = true;
      setWith2.push(setName);
      setWith4 = setName;
    }
  }

  // Sync Synergy cards
  const card2set = document.getElementById('synergy-2set');
  const title2set = document.getElementById('title-2set');
  const desc2set = document.getElementById('desc-2set');
  
  if (has2Set) {
    card2set.classList.add('active');
    const setsStr = setWith2.map(s => `${s} Set`).join(' & ');
    title2set.textContent = `${setsStr} Resonance Active`;
    
    // Accumulate descriptions
    const bonusDescs = setWith2.map(s => `• <strong>${s}:</strong> ${SETS_METADATA[s].bonus2.desc}`).join('<br>');
    desc2set.innerHTML = bonusDescs;
  } else {
    card2set.classList.remove('active');
    title2set.textContent = '2-Piece Resonance (Inactive)';
    desc2set.innerHTML = 'Equip at least 2 relics from the same set to trigger a resonant set passive.';
  }

  const card4set = document.getElementById('synergy-4set');
  const title4set = document.getElementById('title-4set');
  const desc4set = document.getElementById('desc-4set');
  
  if (has4Set) {
    card4set.classList.add('active');
    title4set.textContent = `${setWith4} Harmony Active`;
    desc4set.innerHTML = SETS_METADATA[setWith4].bonus4.desc;
    
    // Toggle Panels
    document.getElementById('shattered-build-panel').style.display = 'none';
    
    const transPanel = document.getElementById('eternal-transform-panel');
    transPanel.style.display = 'block';
    
    // If no eternal is selected for this 4-set, default to the first matching one
    const options = ETERNALS.filter(e => e.set === setWith4);
    if (!appState.build.selectedEternalId || !options.find(o => o.id === appState.build.selectedEternalId)) {
      appState.build.selectedEternalId = options[0].id;
    }
    
    // Populate Transformation Panel
    const activeEternal = ETERNALS.find(e => e.id === appState.build.selectedEternalId);
    
    // Render switcher buttons inside transformation panel so users can toggle between the 2 options!
    const switcherHtml = `
      <div style="display: flex; gap: 0.5rem; margin: 0.5rem 0;">
        ${options.map(o => `
          <button class="btn btn-secondary ${o.id === activeEternal.id ? 'btn-primary' : ''}" 
                  style="font-size:0.75rem; padding: 0.25rem 0.5rem;" 
                  onclick="selectEternal('${o.id}')">
            ${o.emoji} ${o.name}
          </button>
        `).join('')}
      </div>
    `;
    
    document.getElementById('transformation-avatar').textContent = activeEternal.emoji;
    document.getElementById('transformation-eternal-name').textContent = activeEternal.name;
    document.getElementById('transformation-lore').innerHTML = `You have harmonized with the ${setWith4} Relics!<br>Choose your Eternal form below:${switcherHtml}<br><span style="font-size:0.8rem; color:var(--text-dark); font-style:italic;">"${activeEternal.lore}"</span>`;
    document.getElementById('transformation-ability-name').textContent = activeEternal.ability.name;
    document.getElementById('transformation-ability-desc').textContent = activeEternal.ability.desc;

  } else {
    card4set.classList.remove('active');
    title4set.textContent = '4-Piece Eternal Harmony (Inactive)';
    desc4set.innerHTML = 'Equip all 4 relics from a set to transform your Eternal and unlock a 5th ultimate ability.';
    
    document.getElementById('eternal-transform-panel').style.display = 'none';
    
    // Check if there is a mix of relics at all
    const activeItemsCount = Object.values(appState.build.slots).filter(Boolean).length;
    if (activeItemsCount > 0 && !has4Set) {
      document.getElementById('shattered-build-panel').style.display = 'block';
    } else {
      document.getElementById('shattered-build-panel').style.display = 'none';
    }
  }

  // 3. Compute stats
  calculateCombatStats(setCounts, has2Set, has4Set);
}

function selectEternal(eternalId) {
  appState.build.selectedEternalId = eternalId;
  updateBuildMakerUI();
  const eternalName = ETERNALS.find(e => e.id === eternalId).name;
  showToast(`Transformed into ${eternalName}!`, 'success');
}

function calculateCombatStats(setCounts, has2Set, has4Set) {
  // Base stats
  let hp = 1000;
  let ap = 80;
  let armor = 40;
  let cdr = 0;
  let crit = 5;
  let speed = 300;
  let lifesteal = 0;
  
  const traits = [];

  // Add individual Relic stats
  Object.values(appState.build.slots).forEach(relic => {
    if (relic) {
      if (relic.stats.hp) hp += relic.stats.hp;
      if (relic.stats.ap) ap += relic.stats.ap;
      if (relic.stats.armor) armor += relic.stats.armor;
      if (relic.stats.cdr) cdr += relic.stats.cdr;
      if (relic.stats.crit) crit += relic.stats.crit;
      if (relic.stats.lifesteal) lifesteal += relic.stats.lifesteal;
      
      // Speed is stored as percentage in relic definitions, accumulate flat equivalent
      if (relic.stats.speed) {
        speed += (300 * (relic.stats.speed / 100));
      }
    }
  });

  // Apply Set active synergy multipliers
  for (const [setName, count] of Object.entries(setCounts)) {
    if (count >= 2) {
      // Apply 2set bonus modifiers
      if (setName === 'Tempest') {
        speed += (300 * 0.12);
        traits.push('🌀 <strong>Tailwind:</strong> +12% Movement Speed');
      }
      if (setName === 'Bloodthorn') {
        lifesteal += 8;
        ap += 10;
        traits.push('🩸 <strong>Sanguine Feast:</strong> +8% Lifesteal & +10 Attack Power');
      }
      if (setName === 'Voidbringer') {
        cdr += 15;
        traits.push('⏳ <strong>Spellweave Surge:</strong> +15% Cooldown Reduction');
      }
      if (setName === 'Solar Flare') {
        armor += 25;
        hp += 100;
        traits.push('🛡️ <strong>Sunbound Aegis:</strong> +25 Armor & +100 Max Health');
      }
      if (setName === 'Frostward') {
        hp += 300;
        traits.push('❄️ <strong>Winter Shielding:</strong> +300 Max Health & attackers slowed');
      }
      if (setName === 'Shadowstep') {
        crit += 15;
        traits.push('⚡ <strong>Precision Strike:</strong> +15% Critical strike chance');
      }
    }

    if (count === 4) {
      // Apply 4set bonus modifiers
      if (setName === 'Tempest') {
        speed += (300 * 0.10);
        traits.push('⚡ <strong>Storm Lord:</strong> Attacks shock surrounding foes for magic chain damage.');
      }
      if (setName === 'Bloodthorn') {
        lifesteal += 5;
        traits.push('🩸 <strong>Carnage Stack:</strong> Physical strikes build attack speed stacks (up to 40%).');
      }
      if (setName === 'Voidbringer') {
        cdr += 10;
        traits.push('🔮 <strong>Void Singularity:</strong> Spells create micro vortexes that drag targets.');
      }
      if (setName === 'Solar Flare') {
        armor += 20;
        traits.push('🔥 <strong>Solar Ignition:</strong> Absorbing hits ignites close-by attackers.');
      }
      if (setName === 'Frostward') {
        armor += 15;
        traits.push('❄️ <strong>Rime Armor:</strong> Being hit has a 10% chance to freeze the attacker.');
      }
      if (setName === 'Shadowstep') {
        crit += 10;
        traits.push('🥷 <strong>Shadow Cloaking:</strong> Defeating an enemy grants 2s invisibility.');
      }
    }
  }

  // Caps
  cdr = Math.min(60, cdr);
  crit = Math.min(100, crit);

  // Render text values
  document.getElementById('val-ap').textContent = Math.round(ap);
  document.getElementById('val-hp').textContent = Math.round(hp);
  document.getElementById('val-armor').textContent = Math.round(armor);
  document.getElementById('val-cdr').textContent = `${Math.round(cdr)}%`;
  document.getElementById('val-crit').textContent = `${Math.round(crit)}%`;
  document.getElementById('val-speed').textContent = Math.round(speed);
  document.getElementById('val-lifesteal').textContent = `${Math.round(lifesteal)}%`;

  // Render bar fills (relative to high standards)
  // AP: relative to 200 max
  document.getElementById('bar-ap').style.width = `${Math.min(100, (ap / 200) * 100)}%`;
  // HP: relative to 3000 max
  document.getElementById('bar-hp').style.width = `${Math.min(100, (hp / 2500) * 100)}%`;
  // Armor: relative to 200 max
  document.getElementById('bar-armor').style.width = `${Math.min(100, (armor / 200) * 100)}%`;
  // CDR: relative to 60 max
  document.getElementById('bar-cdr').style.width = `${Math.min(100, (cdr / 60) * 100)}%`;
  // Crit: relative to 100 max
  document.getElementById('bar-crit').style.width = `${Math.min(100, crit)}%`;
  // Speed: relative to 500 max
  document.getElementById('bar-speed').style.width = `${Math.min(100, ((speed - 250) / 250) * 100)}%`;
  // Lifesteal: relative to 50 max
  document.getElementById('bar-lifesteal').style.width = `${Math.min(100, (lifesteal / 50) * 100)}%`;

  // Active traits list render
  const traitsBox = document.getElementById('stat-traits-container');
  traitsBox.innerHTML = '';
  
  if (traits.length > 0) {
    traits.forEach(t => {
      traitsBox.insertAdjacentHTML('beforeend', `<span style="font-size: 0.8rem; color: var(--text-main); display: block;">${t}</span>`);
    });
  } else {
    traitsBox.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-dark);">No active set passive modifiers yet. Equip relics of matching sets to activate special passive traits.</span>`;
  }
}

// ==========================================
// BUILD SAVING & LOADING
// ==========================================
function saveCurrentBuild() {
  const nameInput = document.getElementById('build-name-input').value.trim();
  const descInput = document.getElementById('build-desc-input').value.trim();
  
  if (!nameInput) {
    showToast('Please enter a name for your build.', 'warning');
    return;
  }

  // Check if at least one relic is equipped
  const slotsFilled = Object.values(appState.build.slots).some(Boolean);
  if (!slotsFilled) {
    showToast('Equip at least one relic before saving.', 'warning');
    return;
  }

  // Create build object
  const newBuild = {
    id: 'build-' + Date.now(),
    name: nameInput,
    notes: descInput,
    items: Object.keys(appState.build.slots).map(slot => {
      const relic = appState.build.slots[slot];
      return relic ? relic.id : null;
    }),
    eternalId: appState.build.selectedEternalId
  };

  // Add to local state
  appState.customBuilds.push(newBuild);
  localStorage.setItem('arkheron_custom_builds', JSON.stringify(appState.customBuilds));

  // Sync to mock profile Sean if linked
  if (appState.linkedUser) {
    appState.linkedUser.savedBuilds.push(newBuild);
    localStorage.setItem('arkheron_linked_user', JSON.stringify(appState.linkedUser));
    // sync back to profile DB
    MOCK_PROFILES[appState.linkedUser.username.toLowerCase()] = appState.linkedUser;
  } else {
    // Save to Sean's local profile temporarily
    MOCK_PROFILES['sean'].savedBuilds.push(newBuild);
  }

  showToast('Build saved successfully to your profile!', 'success');
  
  // Refresh profile rendering
  loadProfile(appState.activeProfile);
}

function loadBuild(buildId) {
  // Look in customBuilds, then mock profiles
  let build = appState.customBuilds.find(b => b.id === buildId);
  if (!build) {
    // search in profiles
    Object.values(MOCK_PROFILES).forEach(profile => {
      const found = profile.savedBuilds.find(b => b.id === buildId);
      if (found) build = found;
    });
  }

  if (!build) {
    showToast('Build not found.', 'error');
    return;
  }

  // Equip slots
  appState.build.name = build.name;
  document.getElementById('build-name-input').value = build.name;
  
  appState.build.notes = build.notes || '';
  document.getElementById('build-desc-input').value = build.notes || '';

  const slots = ['crown', 'weapon1', 'weapon2', 'amulet'];
  slots.forEach((slot, index) => {
    const relicId = build.items[index];
    if (relicId) {
      appState.build.slots[slot] = RELICS.find(r => r.id === relicId);
    } else {
      appState.build.slots[slot] = null;
    }
  });

  appState.build.selectedEternalId = build.eternalId;

  updateBuildMakerUI();
  switchTab('buildmaker');
  showToast(`Loaded build: ${build.name}`, 'info');
}

function deleteSavedBuild(buildId, event) {
  if (event) event.stopPropagation(); // Stop trigger loadBuild card click

  // Remove from customBuilds
  appState.customBuilds = appState.customBuilds.filter(b => b.id !== buildId);
  localStorage.setItem('arkheron_custom_builds', JSON.stringify(appState.customBuilds));

  // Remove from mock profiles
  Object.values(MOCK_PROFILES).forEach(profile => {
    profile.savedBuilds = profile.savedBuilds.filter(b => b.id !== buildId);
  });

  // Remove from linked user
  if (appState.linkedUser) {
    appState.linkedUser.savedBuilds = appState.linkedUser.savedBuilds.filter(b => b.id !== buildId);
    localStorage.setItem('arkheron_linked_user', JSON.stringify(appState.linkedUser));
  }

  loadProfile(appState.activeProfile);
  showToast('Build deleted.', 'info');
}

// ==========================================
// SHARE BUILD LOGIC (URL ENCODING)
// ==========================================
function shareCurrentBuild() {
  const nameVal = encodeURIComponent(document.getElementById('build-name-input').value || 'Unnamed Setup');
  const notesVal = encodeURIComponent(document.getElementById('build-desc-input').value || '');
  
  // Map items to their IDs or 'empty'
  const items = Object.keys(appState.build.slots).map(slot => {
    const relic = appState.build.slots[slot];
    return relic ? relic.id : 'empty';
  }).join(',');

  const eternalId = appState.build.selectedEternalId || 'none';

  // Construct URL
  const shareUrl = `${window.location.origin}${window.location.pathname}?b=${items}&n=${nameVal}&d=${notesVal}&e=${eternalId}`;

  // Copy to clipboard
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      showToast('Shareable URL copied to clipboard!', 'success');
    })
    .catch(() => {
      showToast('Could not copy link automatically. Please copy the browser URL bar.', 'warning');
    });
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const itemsParam = params.get('b');
  
  if (itemsParam) {
    const nameParam = params.get('n') || 'Shared Build';
    const notesParam = params.get('d') || '';
    const eternalParam = params.get('e') || 'none';

    document.getElementById('build-name-input').value = decodeURIComponent(nameParam);
    document.getElementById('build-desc-input').value = decodeURIComponent(notesParam);

    const itemsArray = itemsParam.split(',');
    const slots = ['crown', 'weapon1', 'weapon2', 'amulet'];

    slots.forEach((slot, index) => {
      const relicId = itemsArray[index];
      if (relicId && relicId !== 'empty') {
        appState.build.slots[slot] = RELICS.find(r => r.id === relicId);
      } else {
        appState.build.slots[slot] = null;
      }
    });

    if (eternalParam && eternalParam !== 'none') {
      appState.build.selectedEternalId = eternalParam;
    }

    updateBuildMakerUI();
    
    // Switch to build maker tab to show the build
    setTimeout(() => {
      switchTab('buildmaker');
      showToast('Successfully loaded shared build!', 'success');
    }, 400);
  }
}

// ==========================================
// USER ACCOUNTS / PROFILES LOGIC
// ==========================================
function searchProfile() {
  const inputVal = document.getElementById('search-climber-input').value.trim().toLowerCase();
  
  if (!inputVal) {
    showToast('Please enter a username to search.', 'warning');
    return;
  }

  if (MOCK_PROFILES[inputVal]) {
    loadProfile(inputVal);
    showToast(`Found profile for ${MOCK_PROFILES[inputVal].username}!`, 'success');
  } else {
    // Generate a simulated profiles block for the searched user!
    const capitalizedName = inputVal.charAt(0).toUpperCase() + inputVal.slice(1);
    
    const emojis = ['🥷', '🧙', '🐉', '🤖', '💀', '👩', '👨'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const titles = ['Scavenger', 'Tower Climber', 'Bronze Relic Guardian', 'Ascendant Slayer'];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];

    const bio = `Exploring the Tower floors since last season. Enjoys trying out new setups and theorycrafting.`;

    const randomMatches = Math.floor(20 + Math.random() * 150);
    const winrate = `${(45 + Math.random() * 20).toFixed(1)}%`;
    const kd = (0.8 + Math.random() * 1.5).toFixed(2);
    const floor = `${Math.floor(2 + Math.random() * 8)}nd Floor`;

    // Create random matches list
    const mockMatches = [];
    const outcomes = ['Win', 'Loss'];
    const mockEternals = ['Karriv', 'Irenna', 'Leodin', 'Edani', 'Hollow', 'Dahla'];
    
    for (let i = 0; i < 4; i++) {
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      const et = mockEternals[Math.floor(Math.random() * mockEternals.length)];
      const k = Math.floor(1 + Math.random() * 15);
      const d = Math.floor(1 + Math.random() * 10);
      const a = Math.floor(2 + Math.random() * 15);

      mockMatches.push({
        id: 1000 + i,
        type: 'Ascension Royale',
        eternal: et,
        outcome: outcome,
        kda: `${k}/${d}/${a}`,
        floor: outcome === 'Win' ? '10th Floor (Victory)' : `${Math.floor(2 + Math.random() * 8)}th Floor`,
        score: `${Math.floor(5000 + Math.random() * 30000).toLocaleString()} pts`
      });
    }

    const randomProfile = {
      username: capitalizedName,
      avatar: randomEmoji,
      title: randomTitle,
      bio: bio,
      matchesCount: randomMatches,
      winrate: winrate,
      kd: kd,
      avgFloor: floor,
      savedBuilds: [],
      matches: mockMatches
    };

    MOCK_PROFILES[inputVal] = randomProfile;
    loadProfile(inputVal);
    showToast(`Dynamically resolved stats for ${capitalizedName}.`, 'success');
  }
}

function loadProfile(usernameKey) {
  const profile = MOCK_PROFILES[usernameKey];
  if (!profile) return;

  appState.activeProfile = usernameKey;

  // Render values
  document.getElementById('profile-avatar-big').textContent = profile.avatar;
  document.getElementById('profile-username-val').textContent = profile.username;
  document.getElementById('profile-badge-val').textContent = profile.title;
  document.getElementById('profile-bio-val').textContent = profile.bio || 'No bio set.';

  document.getElementById('profile-stat-matches').textContent = profile.matchesCount;
  document.getElementById('profile-stat-winrate').textContent = profile.winrate;
  document.getElementById('profile-stat-kd').textContent = profile.kd;
  document.getElementById('profile-stat-floor').textContent = profile.avgFloor;

  // Showcase titles sub-badges row
  const titlesContainer = document.getElementById('profile-titles-val');
  titlesContainer.innerHTML = `<span class="badge badge-secondary">${profile.title}</span>`;
  if (profile.matchesCount > 100) {
    titlesContainer.insertAdjacentHTML('beforeend', `<span class="badge badge-primary">Veteran</span>`);
  }
  if (parseFloat(profile.winrate) > 55) {
    titlesContainer.insertAdjacentHTML('beforeend', `<span class="badge badge-success">High Winrate</span>`);
  }

  // Load Saved Builds
  const buildsContainer = document.getElementById('profile-saved-builds-container');
  buildsContainer.innerHTML = '';

  const allBuilds = [...profile.savedBuilds];
  
  // If viewing Sean's profile (local default), combine custom builds
  if (usernameKey === 'sean' || (appState.linkedUser && usernameKey === appState.linkedUser.username.toLowerCase())) {
    appState.customBuilds.forEach(cb => {
      // avoid duplicates
      if (!allBuilds.find(b => b.id === cb.id)) {
        allBuilds.push(cb);
      }
    });
  }

  document.getElementById('saved-builds-count').textContent = allBuilds.length;

  if (allBuilds.length === 0) {
    buildsContainer.innerHTML = `
      <div style="grid-column: 1/-1; color: var(--text-dark); text-align: center; padding: 2rem 0; font-size: 0.9rem;">
        No saved builds found. Go to the Build Maker tab to create and save one.
      </div>
    `;
  } else {
    allBuilds.forEach(build => {
      const eternalEmoji = build.eternalId ? (ETERNALS.find(e => e.id === build.eternalId)?.emoji || '🔮') : '🔮';
      const eternalName = build.eternalId ? (ETERNALS.find(e => e.id === build.eternalId)?.name || 'Shattered') : 'Shattered';
      
      const buildHtml = `
        <div class="saved-build-card" onclick="loadBuild('${build.id}')">
          <div class="saved-build-delete" onclick="deleteSavedBuild('${build.id}', event)">✖</div>
          <div class="saved-build-header">
            <span class="saved-build-name">${build.name}</span>
          </div>
          <span class="saved-build-eternal">${eternalEmoji} ${eternalName}</span>
          <div class="saved-build-relics">
            ${build.items.map(itemId => {
              if (!itemId) return `<div class="saved-build-relic-dot">❓</div>`;
              const relic = RELICS.find(r => r.id === itemId);
              let icon = '👑';
              if (relic && (relic.slot === 'weapon1' || relic.slot === 'weapon2')) icon = '⚔️';
              if (relic && relic.slot === 'amulet') icon = '📿';
              return `<div class="saved-build-relic-dot" title="${relic ? relic.name : 'Unknown'}">${icon}</div>`;
            }).join('')}
          </div>
        </div>
      `;
      buildsContainer.insertAdjacentHTML('beforeend', buildHtml);
    });
  }

  // Load Recent Match Logs
  const matchContainer = document.getElementById('profile-matches-container');
  matchContainer.innerHTML = '';

  if (!profile.matches || profile.matches.length === 0) {
    matchContainer.innerHTML = `<div style="text-align: center; color: var(--text-dark); padding: 1rem 0;">No match history found.</div>`;
  } else {
    profile.matches.forEach(match => {
      const matchClass = match.outcome.toLowerCase() === 'win' ? 'win' : 'loss';
      
      // lookup emoji
      const etData = ETERNALS.find(e => e.name === match.eternal);
      const etEmoji = etData ? etData.emoji : '🔮';

      const matchHtml = `
        <div class="match-card ${matchClass}">
          <div class="match-avatar-col">
            <div class="match-avatar-icon">${etEmoji}</div>
            <div class="match-avatar-info">
              <span class="match-eternal-name">${match.eternal}</span>
              <span class="match-mode">${match.type}</span>
            </div>
          </div>
          <div class="match-kda-col">
            <div class="match-kda-value">${match.kda}</div>
            <div class="match-kda-label">K/D/A</div>
          </div>
          <div class="match-stats-col">
            <span class="match-stat-main">${match.outcome}</span>
            <span class="match-stat-sub">${match.floor}</span>
          </div>
        </div>
      `;
      matchContainer.insertAdjacentHTML('beforeend', matchHtml);
    });
  }

  // Sync linking panels widget
  const linkWidget = document.getElementById('profile-link-widget');
  const widgetTitle = document.getElementById('link-widget-title');
  const widgetDesc = document.getElementById('link-widget-desc');
  const widgetBtn = document.getElementById('link-widget-btn');
  const editProfileBtn = document.getElementById('edit-profile-btn');

  // Check if this active profile belongs to our active linked user
  if (appState.linkedUser && appState.linkedUser.username.toLowerCase() === usernameKey) {
    linkWidget.classList.add('linked');
    widgetTitle.innerHTML = '<span>✅</span> Account Linked';
    widgetDesc.textContent = `You are currently logged in as ${profile.username}. You can edit your bio, select avatars, or modify your titles using the edit profile button.`;
    widgetBtn.style.display = 'none';
    editProfileBtn.style.display = 'block';
  } else {
    linkWidget.classList.remove('linked');
    widgetTitle.innerHTML = '<span>🔗</span> Link Steam Account';
    widgetDesc.textContent = `Claim this profile and link your account to customize badges, select titles, and save custom builds.`;
    widgetBtn.style.display = 'block';
    editProfileBtn.style.display = 'none';
  }
}

// LINK ACCOUNT ACTIONS
let selectedAvatarIconTmp = '👨';

function openLinkAccountModal() {
  const usernameInput = document.getElementById('link-username-input');
  const titleSelect = document.getElementById('link-title-select');
  const bioInput = document.getElementById('link-bio-input');

  // If already linked, fill form values
  if (appState.linkedUser) {
    usernameInput.value = appState.linkedUser.username;
    titleSelect.value = appState.linkedUser.title;
    bioInput.value = appState.linkedUser.bio || '';
    selectedAvatarIconTmp = appState.linkedUser.avatar;
    document.getElementById('link-account-modal-title').textContent = 'Edit Profile Details';
  } else {
    usernameInput.value = '';
    titleSelect.value = 'Scavenger';
    bioInput.value = '';
    selectedAvatarIconTmp = '👨';
    document.getElementById('link-account-modal-title').textContent = 'Link Bonfire / Steam Account';
  }

  document.getElementById('link-selected-avatar-preview').textContent = selectedAvatarIconTmp;
  openModal('link-account-modal');
}

function selectAvatarIcon(emoji) {
  selectedAvatarIconTmp = emoji;
  document.getElementById('link-selected-avatar-preview').textContent = emoji;
}

function confirmAccountLink() {
  const usernameInput = document.getElementById('link-username-input').value.trim();
  const titleSelect = document.getElementById('link-title-select').value;
  const bioInput = document.getElementById('link-bio-input').value.trim();

  if (!usernameInput) {
    showToast('Username cannot be empty!', 'warning');
    return;
  }

  // Create linked user profile details
  const key = usernameInput.toLowerCase();

  // Inherited statistics or set fresh ones if new
  const currentDetails = MOCK_PROFILES[key] || {
    matchesCount: 32,
    winrate: '52.5%',
    kd: '1.24',
    avgFloor: '4.5 Floor',
    savedBuilds: [],
    matches: [
      { id: 901, type: 'Ascension Royale', eternal: 'Leodin', outcome: 'Win', kda: '6/2/10', floor: '10th Floor (Victory)', score: '19,400 pts' },
      { id: 902, type: 'Ascension Royale', eternal: 'None (Shattered)', outcome: 'Loss', kda: '4/5/2', floor: '3rd Floor', score: '4,200 pts' }
    ]
  };

  const updatedUser = {
    username: usernameInput,
    avatar: selectedAvatarIconTmp,
    title: titleSelect,
    bio: bioInput,
    matchesCount: currentDetails.matchesCount,
    winrate: currentDetails.winrate,
    kd: currentDetails.kd,
    avgFloor: currentDetails.avgFloor,
    savedBuilds: currentDetails.savedBuilds,
    matches: currentDetails.matches
  };

  // Save to LocalState
  appState.linkedUser = updatedUser;
  localStorage.setItem('arkheron_linked_user', JSON.stringify(updatedUser));
  
  // Sync to database
  MOCK_PROFILES[key] = updatedUser;
  appState.activeProfile = key;

  // UI updates
  updateHeaderUserWidget();
  loadProfile(key);
  closeModal('link-account-modal');
  showToast(`Profile linked to account: ${usernameInput}!`, 'success');
}

function updateHeaderUserWidget() {
  const widgetName = document.getElementById('user-widget-name');
  const widgetAvatar = document.getElementById('user-widget-avatar');

  if (appState.linkedUser) {
    widgetName.textContent = appState.linkedUser.username;
    widgetAvatar.textContent = appState.linkedUser.avatar;
  } else {
    widgetName.textContent = 'Guest Player';
    widgetAvatar.textContent = '?';
  }
}

// ==========================================
// TOASTS & MODAL HELPERS
// ==========================================
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let emoji = 'ℹ️';
  if (type === 'success') emoji = '✅';
  if (type === 'warning') emoji = '⚠️';
  if (type === 'error') emoji = '❌';

  toast.innerHTML = `
    <span>${emoji}</span>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
