// ============================================================================
// RESIDENT EVIL OUTBREAK - Complete Game Logic (3 Scenarios, 8 Survivors, Bosses)
// ============================================================================

const SURVIVORS = {
  kevin: {
    id: 'kevin',
    name: 'Kevin Ryman',
    occupation: 'R.P.D. Police Officer',
    description: 'Specializes in firearms. Starts with .45 Auto Pistol. Fast movement and lethal power aiming.',
    speed: 4.8,
    maxHp: 120,
    slots: 4,
    startingItems: [
      { id: 'handgun_45', name: '.45 Auto Pistol', type: 'handgun', ammo: 7, maxAmmo: 7, damage: 38, icon: '🔫', desc: 'Custom RPD .45 caliber handgun.' },
      { id: 'ammo_45', name: '.45 ACP Ammo', type: 'ammo', count: 21, icon: '📦' },
      { id: 'firstaid', name: 'First Aid Spray', type: 'heal', potency: 100, icon: '🧪' }
    ],
    ability: 'Power Shot: High critical headshot probability.'
  },
  cindy: {
    id: 'cindy',
    name: 'Cindy Lennox',
    occupation: 'J\'s Bar Waitress',
    description: 'Compassionate and quick. Herb Case stores 3 extra herbs. High team healing boost.',
    speed: 4.5,
    maxHp: 100,
    slots: 4,
    herbCase: ['herb_green', 'herb_red'],
    startingItems: [
      { id: 'handgun_9mm', name: 'Handgun 9mm', type: 'handgun', ammo: 15, maxAmmo: 15, damage: 25, icon: '🔫' },
      { id: 'ammo_9mm', name: '9mm Ammo', type: 'ammo', count: 30, icon: '📦' },
      { id: 'herb_green', name: 'Green Herb', type: 'herb', herbType: 'G', icon: '🌿' }
    ],
    ability: 'Herb Case: Can treat teammates and store 3 extra herbs.'
  },
  alyssa: {
    id: 'alyssa',
    name: 'Alyssa Ashcroft',
    occupation: 'Investigative Reporter',
    description: 'Resourceful journalist with a Lockpick Set to open locked storage lockers without keys. Quick dodge step.',
    speed: 4.6,
    maxHp: 95,
    slots: 4,
    startingItems: [
      { id: 'handgun_9mm', name: 'Handgun 9mm', type: 'handgun', ammo: 15, maxAmmo: 15, damage: 25, icon: '🔫' },
      { id: 'lockpick_set', name: 'Lockpick Set', type: 'tool', icon: '🗝️', desc: 'Fine pick tools that bypass mechanical locks.' },
      { id: 'firstaid', name: 'First Aid Spray', type: 'heal', potency: 100, icon: '🧪' }
    ],
    ability: 'Lockpicking & Backstep: Can open locked cabinets and quickly dodge attacks.'
  },
  david: {
    id: 'david',
    name: 'David King',
    occupation: 'Plumber & Craftsman',
    description: 'Tough survivor with a Tool Kit. High melee damage with heavy pipes and tools. Can craft custom weapons.',
    speed: 4.3,
    maxHp: 130,
    slots: 4,
    startingItems: [
      { id: 'handgun_9mm', name: 'Handgun 9mm', type: 'handgun', ammo: 15, maxAmmo: 15, damage: 25, icon: '🔫' },
      { id: 'pipe', name: 'Steel Pipe', type: 'pipe', durability: 20, damage: 35, icon: '🔩' },
      { id: 'knife', name: 'Folding Knife', type: 'knife', damage: 20, icon: '🔪', desc: 'Crafting component for Spears.' }
    ],
    ability: 'Craftsman: Can combine Planks + Knives into Spears, and Pipes + Batteries into Stun Rods.'
  },
  yoko: {
    id: 'yoko',
    name: 'Yoko Suzuki',
    occupation: 'University Student',
    description: 'Quiet former researcher with a large Knapsack holding 8 inventory slots. Can crawl to escape grabs.',
    speed: 4.1,
    maxHp: 90,
    slots: 8,
    startingItems: [
      { id: 'handgun_9mm', name: 'Handgun 9mm', type: 'handgun', ammo: 15, maxAmmo: 15, damage: 25, icon: '🔫' },
      { id: 'ammo_9mm', name: '9mm Ammo', type: 'ammo', count: 30, icon: '📦' },
      { id: 'herb_green', name: 'Green Herb', type: 'herb', herbType: 'G', icon: '🌿' },
      { id: 'herb_blue', name: 'Blue Herb', type: 'herb', herbType: 'B', icon: '🌱' }
    ],
    ability: 'Knapsack & Crawl: 8 inventory slots and grab evasion.'
  },
  mark: {
    id: 'mark',
    name: 'Mark Wilkins',
    occupation: 'Security Guard',
    description: 'Military veteran with high stamina and physical Guard Stance. Starts with Handgun and extra magazine.',
    speed: 4.2,
    maxHp: 140,
    slots: 4,
    startingItems: [
      { id: 'handgun_9mm', name: 'Handgun 9mm', type: 'handgun', ammo: 15, maxAmmo: 15, damage: 28, icon: '🔫' },
      { id: 'ammo_9mm', name: '9mm Ammo (30)', type: 'ammo', count: 30, icon: '📦' },
      { id: 'firstaid', name: 'First Aid Spray', type: 'heal', potency: 100, icon: '🧪' }
    ],
    ability: 'Guard Block (Key G): Blocks incoming attacks, reducing damage by 75%.'
  },
  george: {
    id: 'george',
    name: 'Dr. George Hamilton',
    occupation: 'Surgeon & Physician',
    description: 'Expert doctor with a Medical Capsule Shooter. Can synthesize Herbs into instant Antiviral darts.',
    speed: 4.4,
    maxHp: 100,
    slots: 4,
    startingItems: [
      { id: 'medical_shooter', name: 'Medical Shooter', type: 'medical_shooter', ammo: 5, maxAmmo: 5, damage: 15, icon: '💉', desc: 'Shoots Antiviral capsules that heal allies and slow virus.' },
      { id: 'herb_green', name: 'Green Herb', type: 'herb', herbType: 'G', icon: '🌿' },
      { id: 'firstaid', name: 'First Aid Spray', type: 'heal', potency: 100, icon: '🧪' }
    ],
    ability: 'Medical Synthesis: Converts herbs into injectable darts that lower virus %.'
  },
  jim: {
    id: 'jim',
    name: 'Jim Chapman',
    occupation: 'Subway Station Staff',
    description: 'Subway worker who knows underground layouts. Can flip a Lucky Coin to boost crits, and Play Dead to lose aggro.',
    speed: 4.5,
    maxHp: 95,
    slots: 4,
    startingItems: [
      { id: 'handgun_9mm', name: 'Handgun 9mm', type: 'handgun', ammo: 15, maxAmmo: 15, damage: 25, icon: '🔫' },
      { id: 'lucky_coin', name: 'Lucky Coin', type: 'tool', icon: '🪙', desc: 'Flipping boosts critical strike chance.' },
      { id: 'firstaid', name: 'First Aid Spray', type: 'heal', potency: 100, icon: '🧪' }
    ],
    ability: 'Play Dead (Key P) & Coin Toss: Lose zombie aggro and boost critical hits.'
  }
};

class OutbreakGame {
  constructor() {
    this.currentScenario = 'outbreak'; // 'outbreak', 'underbelly', 'hospital'
    this.selectedSurvivor = 'kevin';
    this.partnerSurvivor = 'cindy';
    this.player = null;
    this.partner = null;
    this.zombies = [];
    this.worldPickups = [];
    this.boss = null;

    this.state = 'MENU';
    this.hp = 120;
    this.maxHp = 120;
    this.virusPercent = 0.0;
    this.virusRate = 0.032;
    this.isBleeding = false;
    this.isPoisoned = false;
    this.isGuarding = false;
    this.isPlayingDead = false;
    this.critBonus = 0.0;
    this.inventory = [];
    this.equippedWeapon = null;

    this.partnerHp = 100;
    this.partnerMaxHp = 100;
    this.partnerVirus = 0.0;
    this.partnerState = 'FOLLOW';
    this.partnerEquipped = null;

    this.killCount = 0;
    this.startTime = 0;
    this.objectives = {};
    this.keys = {};
    this.isAiming = false;
    this.struggleCount = 0;
    this.isGrabbed = false;
    this.grabbedBy = null;

    this.setupInputs();
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (this.state === 'PLAYING') {
        if (e.code === 'KeyI' || e.code === 'Tab') {
          e.preventDefault();
          this.toggleInventory();
        } else if (e.code === 'Digit1') {
          this.triggerAdLib('HELP');
        } else if (e.code === 'Digit2') {
          this.triggerAdLib('COME_ON');
        } else if (e.code === 'Digit3') {
          this.triggerAdLib('ATTACK');
        } else if (e.code === 'Digit4') {
          this.triggerAdLib('THANK_YOU');
        } else if (e.code === 'KeyG') {
          this.toggleGuard(true);
        } else if (e.code === 'KeyP') {
          this.togglePlayDead();
        } else if (e.code === 'Space') {
          if (this.isGrabbed) this.struggleEscape();
        } else if (e.code === 'KeyF' || e.code === 'Enter') {
          this.handleActionOrFire();
        } else if (e.code === 'KeyR') {
          this.reloadEquipped();
        } else if (e.code === 'KeyE') {
          this.interactWorld();
        }
      } else if (this.state === 'INVENTORY') {
        if (e.code === 'KeyI' || e.code === 'Tab' || e.code === 'Escape') {
          e.preventDefault();
          this.toggleInventory();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'KeyG') this.toggleGuard(false);
    });

    window.addEventListener('mousedown', (e) => {
      if (this.state === 'PLAYING') {
        window.outbreakAudio.init();
        window.outbreakAudio.resume();
        if (e.button === 2) this.isAiming = true;
        else if (e.button === 0) {
          if (this.isAiming) this.fireWeapon();
          else this.interactWorld();
        }
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 2) this.isAiming = false;
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  toggleGuard(enable) {
    if (this.selectedSurvivor === 'mark') {
      this.isGuarding = enable;
      if (enable) window.outbreakAudio.playGuardBlock();
    }
  }

  togglePlayDead() {
    if (this.selectedSurvivor === 'jim') {
      this.isPlayingDead = !this.isPlayingDead;
      this.showSubtitle(this.isPlayingDead ? "Jim is Playing Dead! (Zombies ignore you)" : "Jim got back up.", 2500);
      if (this.player && this.player.mesh) {
        this.player.mesh.rotation.x = this.isPlayingDead ? Math.PI / 2 : 0;
        this.player.mesh.position.y = this.isPlayingDead ? 0.2 : 0;
      }
    }
  }

  // --- START GAME SCENARIOS ---
  startGame(charId, partnerId, scenario = 'outbreak') {
    this.currentScenario = scenario;
    this.selectedSurvivor = charId;
    this.partnerSurvivor = partnerId || (charId === 'kevin' ? 'cindy' : 'kevin');
    this.startTime = Date.now();
    this.killCount = 0;

    const pData = SURVIVORS[this.selectedSurvivor];
    this.hp = pData.maxHp;
    this.maxHp = pData.maxHp;
    this.virusPercent = 0.0;
    this.isBleeding = false;
    this.isPoisoned = false;
    this.isGuarding = false;
    this.isPlayingDead = false;
    this.inventory = JSON.parse(JSON.stringify(pData.startingItems));
    this.equippedWeapon = this.inventory[0];

    const partnerData = SURVIVORS[this.partnerSurvivor];
    this.partnerHp = partnerData.maxHp;
    this.partnerMaxHp = partnerData.maxHp;
    this.partnerVirus = 0.0;
    this.partnerEquipped = partnerData.startingItems[0];

    const models = window.outbreakModels;
    const engine = window.outbreakEngine;

    // Player & Partner Meshes
    if (this.player && this.player.mesh) engine.scene.remove(this.player.mesh);
    const pMesh = models.createCharacter(this.selectedSurvivor);
    pMesh.position.set(-1.0, 0, 1.0);
    engine.scene.add(pMesh);
    this.player = { mesh: pMesh, pos: pMesh.position, rot: pMesh.rotation, speed: pData.speed };
    this.updateEquippedVisual(this.player, this.equippedWeapon);

    if (this.partner && this.partner.mesh) engine.scene.remove(this.partner.mesh);
    const ptMesh = models.createCharacter(this.partnerSurvivor);
    ptMesh.position.set(-2.2, 0, 1.2);
    engine.scene.add(ptMesh);
    this.partner = { mesh: ptMesh, pos: ptMesh.position, rot: ptMesh.rotation, speed: partnerData.speed * 0.95 };
    this.updateEquippedVisual(this.partner, this.partnerEquipped);

    // Objectives Reset
    this.objectives = {
      barricadedFront: false, foundFuse: false, restoredPower: false,
      hasSubwayPass: false, restoredSubstation: false,
      hasPharmacyCard: false, drainedMorgue: false, synthesizedVPoison: false, bossDefeated: false
    };

    this.spawnScenarioContent();

    let startRoom = 'js_bar';
    if (this.currentScenario === 'underbelly') startRoom = 'subway_concourse';
    else if (this.currentScenario === 'hospital') startRoom = 'hospital_reception';

    engine.switchRoom(startRoom, false);

    this.state = 'PLAYING';
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'block';

    window.outbreakAudio.init();
    window.outbreakAudio.resume();
    window.outbreakAudio.playMenuSelect();

    if (this.currentScenario === 'hospital') {
      this.showSubtitle(`${pData.name}: "Raccoon General Hospital is overrun by leeches. We have to reach the Rooftop Helipad!"`, 5000);
    } else if (this.currentScenario === 'underbelly') {
      this.showSubtitle(`${pData.name}: "The subway lines are down. We have to restore power in the Substation and start the train!"`, 5000);
    } else {
      this.showSubtitle(`${pData.name}: "The bar won't hold long... we need to barricade the doors and find a way out!"`, 5000);
    }
  }

  updateEquippedVisual(entity, weaponItem) {
    const socket = entity.mesh.userData.weaponSocket;
    if (!socket) return;
    while (socket.children.length > 0) socket.remove(socket.children[0]);
    if (weaponItem) {
      const wpMesh = window.outbreakModels.createWeaponMesh(weaponItem.type);
      socket.add(wpMesh);
    }
  }

  spawnScenarioContent() {
    const engine = window.outbreakEngine;
    const models = window.outbreakModels;

    for (const p of this.worldPickups) engine.scene.remove(p.mesh);
    this.worldPickups = [];
    for (const z of this.zombies) engine.scene.remove(z.mesh);
    this.zombies = [];
    if (this.boss && this.boss.mesh) engine.scene.remove(this.boss.mesh);
    this.boss = null;

    if (this.currentScenario === 'outbreak') {
      const pickups = [
        { id: 'fuse_01', name: 'Electric Fuse', type: 'fuse', roomId: 'js_bar', x: -5.0, y: 0.1, z: -4.0, icon: '⚡' },
        { id: 'herb_green_1', name: 'Green Herb', type: 'herb', herbType: 'G', roomId: 'js_bar', x: 4.5, y: 0.1, z: -2.0, icon: '🌿' },
        { id: 'wood_board_1', name: '2x4 Plank', type: 'wood_board', roomId: 'js_bar', x: 2.0, y: 0.1, z: 4.0, icon: '🪵' },
        { id: 'brass_key', name: 'Brass Key', type: 'key', roomId: 'storage_room', x: -3.0, y: 0.1, z: -2.5, icon: '🗝️' },
        { id: 'shotgun', name: 'Shotgun M870', type: 'shotgun', ammo: 6, maxAmmo: 6, damage: 95, roomId: 'rooftop', x: 0.0, y: 0.85, z: -3.5, icon: '💥' },
        { id: 'fire_escape_key', name: 'Fire Escape Key', type: 'key', roomId: 'rooftop', x: -2.0, y: 0.1, z: 2.0, icon: '🔑' },
        { id: 'firstaid_street', name: 'First Aid Spray', type: 'heal', potency: 100, roomId: 'downtown_street', x: -5.5, y: 0.1, z: 4.0, icon: '🧪' }
      ];

      for (const item of pickups) {
        const mesh = models.createItemPickupMesh(item);
        mesh.position.set(item.x, item.y, item.z);
        if (item.roomId === 'js_bar') engine.scene.add(mesh);
        this.worldPickups.push({ data: item, mesh, isCollected: false });
      }

      const zSpawns = [
        { id: 'z1', type: 'male', roomId: 'js_bar', x: -1.0, z: 5.5, hp: 100, bangsDoor: true },
        { id: 'z2', type: 'female', roomId: 'js_bar', x: 1.2, z: 5.8, hp: 90, bangsDoor: true },
        { id: 'z3', type: 'crimson', roomId: 'storage_room', x: -2.0, z: 0.0, hp: 140 },
        { id: 'z4', type: 'crawler', roomId: 'rooftop', x: 2.0, z: 1.0, hp: 70 },
        { id: 'z5', type: 'cop', roomId: 'downtown_street', x: -2.0, z: 1.0, hp: 140 }
      ];

      for (const spawn of zSpawns) {
        const mesh = models.createZombie(spawn.type);
        mesh.position.set(spawn.x, 0, spawn.z);
        if (spawn.roomId === 'js_bar') engine.scene.add(mesh);
        this.zombies.push({
          id: spawn.id, type: spawn.type, roomId: spawn.roomId, mesh,
          pos: mesh.position, rot: mesh.rotation, hp: spawn.hp, maxHp: spawn.hp,
          isDead: false, speed: spawn.type === 'crimson' ? 2.8 : 1.3
        });
      }
    } else if (this.currentScenario === 'underbelly') {
      const pickups = [
        { id: 'subway_pass', name: 'Subway Pass Card', type: 'key', roomId: 'subway_concourse', x: -5.0, y: 0.1, z: 2.0, icon: '💳' },
        { id: 'substation_key', name: 'Substation Key', type: 'key', roomId: 'subway_concourse', x: 4.5, y: 0.1, z: -4.0, icon: '🗝️' },
        { id: 'shotgun', name: 'Shotgun M870', type: 'shotgun', ammo: 6, maxAmmo: 6, damage: 95, roomId: 'subway_substation', x: -3.0, y: 0.1, z: -2.0, icon: '💥' },
        { id: 'herb_green_sub', name: 'Green Herb', type: 'herb', herbType: 'G', roomId: 'subway_platform', x: -6.0, y: 0.1, z: 4.0, icon: '🌿' }
      ];

      for (const item of pickups) {
        const mesh = models.createItemPickupMesh(item);
        mesh.position.set(item.x, item.y, item.z);
        if (item.roomId === 'subway_concourse') engine.scene.add(mesh);
        this.worldPickups.push({ data: item, mesh, isCollected: false });
      }

      const zSpawns = [
        { id: 'sub_z1', type: 'male', roomId: 'subway_concourse', x: -2.0, z: -2.0, hp: 100 },
        { id: 'sub_z2', type: 'crimson', roomId: 'subway_concourse', x: 2.0, z: 3.0, hp: 140 }
      ];

      for (const spawn of zSpawns) {
        const mesh = models.createZombie(spawn.type);
        mesh.position.set(spawn.x, 0, spawn.z);
        if (spawn.roomId === 'subway_concourse') engine.scene.add(mesh);
        this.zombies.push({
          id: spawn.id, type: spawn.type, roomId: spawn.roomId, mesh,
          pos: mesh.position, rot: mesh.rotation, hp: spawn.hp, maxHp: spawn.hp,
          isDead: false, speed: spawn.type === 'crimson' ? 2.8 : 1.3
        });
      }

      const bossMesh = models.createBossMonster();
      bossMesh.position.set(0, 0, 1.0);
      this.boss = {
        name: 'MUTANT FLEA QUEEN', mesh: bossMesh, pos: bossMesh.position, rot: bossMesh.rotation,
        hp: 600, maxHp: 600, isDead: false, speed: 2.0, attackTimer: 0, roomId: 'subway_platform'
      };
    } else if (this.currentScenario === 'hospital') {
      // Scenario 3: The Hive (Hospital)
      const pickups = [
        { id: 'pharmacy_card', name: 'Pharmacy Keycard', type: 'key', roomId: 'hospital_reception', x: -3.5, y: 0.1, z: 2.0, icon: '💳', desc: 'Opens Doctor Hursh\'s Research Lab.' },
        { id: 'valve_handle', name: 'Drainage Valve Handle', type: 'key', roomId: 'hospital_lab', x: 3.0, y: 0.1, z: -3.0, icon: '⚙️', desc: 'Drains flooded morgue elevator shaft.' },
        { id: 'magnum', name: '.357 Magnum Revolver', type: 'magnum', ammo: 6, maxAmmo: 6, damage: 180, roomId: 'hospital_lab', x: -2.0, y: 0.1, z: 3.0, icon: '⭐', desc: 'Devastating high-caliber handgun.' },
        { id: 'grenade_launcher', name: 'M79 Grenade Launcher', type: 'grenade_launcher', ammo: 4, maxAmmo: 4, damage: 160, roomId: 'hospital_morgue', x: 2.5, y: 0.1, z: 2.0, icon: '💣', desc: 'Fires heavy explosive/flame rounds.' },
        { id: 'firstaid_hosp', name: 'First Aid Spray', type: 'heal', potency: 100, roomId: 'hospital_morgue', x: -4.0, y: 0.1, z: -2.0, icon: '🧪' },
        { id: 'herb_red_hosp', name: 'Red Herb', type: 'herb', herbType: 'R', roomId: 'hospital_reception', x: 4.5, y: 0.1, z: -2.0, icon: '🍁' }
      ];

      for (const item of pickups) {
        const mesh = models.createItemPickupMesh(item);
        mesh.position.set(item.x, item.y, item.z);
        if (item.roomId === 'hospital_reception') engine.scene.add(mesh);
        this.worldPickups.push({ data: item, mesh, isCollected: false });
      }

      const zSpawns = [
        { id: 'hosp_z1', type: 'male', roomId: 'hospital_reception', x: 0.0, z: -2.0, hp: 100 },
        { id: 'hosp_z2', type: 'crimson', roomId: 'hospital_reception', x: 3.0, z: 2.0, hp: 140 },
        { id: 'hosp_z3', type: 'crawler', roomId: 'hospital_morgue', x: 0.0, z: 0.0, hp: 70 }
      ];

      for (const spawn of zSpawns) {
        const mesh = models.createZombie(spawn.type);
        mesh.position.set(spawn.x, 0, spawn.z);
        if (spawn.roomId === 'hospital_reception') engine.scene.add(mesh);
        this.zombies.push({
          id: spawn.id, type: spawn.type, roomId: spawn.roomId, mesh,
          pos: mesh.position, rot: mesh.rotation, hp: spawn.hp, maxHp: spawn.hp,
          isDead: false, speed: spawn.type === 'crimson' ? 2.8 : 1.3
        });
      }

      const leechMesh = models.createLeechBoss();
      leechMesh.position.set(0, 0, 1.0);
      this.boss = {
        name: 'THE LEECH MONSTER (G-HULK)', mesh: leechMesh, pos: leechMesh.position, rot: leechMesh.rotation,
        hp: 750, maxHp: 750, isDead: false, speed: 1.8, attackTimer: 0, roomId: 'hospital_helipad'
      };
    }
  }

  // --- AD-LIB & COMBAT ---
  triggerAdLib(command) {
    const char = SURVIVORS[this.selectedSurvivor];
    const partner = SURVIVORS[this.partnerSurvivor];
    window.outbreakAudio.playAdLibBeep();

    if (command === 'HELP') {
      this.showSubtitle(`${char.name}: "I need help over here!"`, 3000);
      this.partnerState = 'HELP';
      setTimeout(() => this.showSubtitle(`${partner.name}: "Hold on! I'm coming!"`, 3000), 800);
    } else if (command === 'COME_ON') {
      this.showSubtitle(`${char.name}: "Come on, follow me!"`, 3000);
      this.partnerState = 'FOLLOW';
      setTimeout(() => this.showSubtitle(`${partner.name}: "Right behind you!"`, 3000), 800);
    } else if (command === 'ATTACK') {
      this.showSubtitle(`${char.name}: "Take them down!"`, 3000);
      this.partnerState = 'ATTACK';
      setTimeout(() => this.showSubtitle(`${partner.name}: "Covering you!"`, 3000), 800);
    } else if (command === 'THANK_YOU') {
      this.showSubtitle(`${char.name}: "Thanks for the backup."`, 3000);
      setTimeout(() => this.showSubtitle(`${partner.name}: "Don't mention it. Let's get out alive."`, 3000), 800);
    }
  }

  showSubtitle(text, duration = 3500) {
    const el = document.getElementById('dialog-box');
    if (!el) return;
    el.innerText = text;
    el.style.opacity = '1';
    clearTimeout(this.dialogTimeout);
    this.dialogTimeout = setTimeout(() => { el.style.opacity = '0'; }, duration);
  }

  handleActionOrFire() {
    if (this.isAiming || this.keys['Space']) this.fireWeapon();
    else this.interactWorld();
  }

  fireWeapon() {
    if (!this.equippedWeapon) {
      this.showSubtitle("No weapon equipped!", 2000);
      return;
    }

    const wp = this.equippedWeapon;
    if (wp.type === 'handgun' || wp.type === 'shotgun' || wp.type === 'magnum' || wp.type === 'grenade_launcher') {
      if (wp.ammo <= 0) {
        window.outbreakAudio.playMenuCancel();
        this.showSubtitle("*CLICK* Out of ammo! (Press R to reload)", 2000);
        return;
      }
      wp.ammo--;
      const muzzlePos = this.player.pos.clone().add(new THREE.Vector3(0, 1.2, 0));
      window.outbreakEngine.spawnMuzzleFlash(muzzlePos, this.player.mesh.rotation.y);

      if (wp.type === 'magnum') window.outbreakAudio.playMagnumShot();
      else if (wp.type === 'grenade_launcher') window.outbreakAudio.playGrenadeLaunch();
      else if (wp.type === 'shotgun') window.outbreakAudio.playShotgunShot();
      else window.outbreakAudio.playHandgunShot();

      this.processHits(wp);
    } else if (wp.type === 'medical_shooter') {
      if (wp.ammo <= 0) return;
      wp.ammo--;
      window.outbreakAudio.playMedicalInjector();
      this.hp = Math.min(this.maxHp, this.hp + 35);
      this.virusPercent = Math.max(0, this.virusPercent - 8.0);
      this.showSubtitle("Injected Antiviral Recovery Dart! Virus decreased by 8%!", 3000);
    } else if (wp.type === 'pipe' || wp.type === 'spear') {
      window.outbreakAudio.playMeleeSwing();
      this.processMeleeHit(wp);
    }

    this.updateHUD();
  }

  processHits(wp) {
    const engine = window.outbreakEngine;
    const pPos = this.player.pos;
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.mesh.rotation.y);

    if (this.boss && !this.boss.isDead && this.boss.roomId === engine.currentRoomId) {
      const dist = this.boss.pos.distanceTo(pPos);
      if (dist < 14.0) {
        this.boss.hp -= wp.damage;
        engine.spawnBloodSpurt(this.boss.pos.clone().add(new THREE.Vector3(0, 1.5, 0)));
        if (this.boss.hp <= 0) this.killBoss();
      }
    }

    for (const z of this.zombies) {
      if (z.isDead || z.roomId !== engine.currentRoomId) continue;
      const dist = z.pos.distanceTo(pPos);
      if (dist <= 14.0) {
        const dot = forward.dot(z.pos.clone().sub(pPos).normalize());
        if (dot > 0.5) {
          let damage = wp.damage;
          const critProb = (this.selectedSurvivor === 'kevin' ? 0.45 : 0.2) + this.critBonus;
          if (Math.random() < critProb || wp.type === 'magnum') {
            damage *= 2.5;
            this.showSubtitle("CRITICAL HEADSHOT!", 1500);
          }
          z.hp -= damage;
          engine.spawnBloodSpurt(z.pos.clone().add(new THREE.Vector3(0, 1.2, 0)));
          if (z.hp <= 0) this.killZombie(z);
          else z.pos.addScaledVector(forward, 0.4);
          if (wp.type !== 'shotgun' && wp.type !== 'grenade_launcher') break;
        }
      }
    }
  }

  processMeleeHit(wp) {
    const engine = window.outbreakEngine;
    const pPos = this.player.pos;
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.mesh.rotation.y);

    for (const z of this.zombies) {
      if (z.isDead || z.roomId !== engine.currentRoomId) continue;
      if (z.pos.distanceTo(pPos) < 2.2) {
        z.hp -= wp.damage;
        window.outbreakAudio.playMeleeHit(true);
        engine.spawnBloodSpurt(z.pos.clone().add(new THREE.Vector3(0, 1.0, 0)));
        z.pos.addScaledVector(forward, 0.8);
        if (z.hp <= 0) this.killZombie(z);
        break;
      }
    }
  }

  killZombie(z) {
    z.isDead = true;
    z.mesh.rotation.x = Math.PI / 2;
    z.mesh.position.y = 0.15;
    this.killCount++;
    window.outbreakAudio.playZombieGroan();
  }

  killBoss() {
    this.boss.isDead = true;
    this.objectives.bossDefeated = true;
    this.killCount += 10;
    window.outbreakAudio.playBossShriek();
    window.outbreakAudio.startAmbientMusic();
    this.showSubtitle("THE MONSTER HAS BEEN SLAIN! BOARD THE EVACUATION UNIT!", 5000);
  }

  reloadEquipped() {
    if (!this.equippedWeapon) return;
    const wp = this.equippedWeapon;
    const ammoItem = this.inventory.find(i => i.type === 'ammo');
    if (!ammoItem || ammoItem.count <= 0) {
      window.outbreakAudio.playMenuCancel();
      this.showSubtitle("No ammunition in inventory!", 2000);
      return;
    }
    const needed = wp.maxAmmo - wp.ammo;
    if (needed <= 0) return;
    const toLoad = Math.min(needed, ammoItem.count);
    wp.ammo += toLoad;
    ammoItem.count -= toLoad;
    if (ammoItem.count <= 0) this.inventory = this.inventory.filter(i => i !== ammoItem);

    window.outbreakAudio.playShotgunPump();
    this.showSubtitle(`Reloaded ${wp.name}`, 2000);
    this.updateHUD();
  }

  // --- INTERACTIONS & TYPEWRITER SAVE ---
  interactWorld() {
    const engine = window.outbreakEngine;
    const pPos = this.player.pos;

    // Pickups
    for (const p of this.worldPickups) {
      if (p.isCollected || p.data.roomId !== engine.currentRoomId) continue;
      if (p.mesh.position.distanceTo(pPos) < 1.6) {
        this.collectPickup(p);
        return;
      }
    }

    // Typewriter Save Points
    for (const tw of engine.typewriters) {
      if (engine.currentRoomId === 'hospital_lab' && tw.position.distanceTo(pPos) < 2.2) {
        window.outbreakAudio.playTypewriter();
        this.showSubtitle("PROGRESS CHECKPOINT SAVED TO TYPEWRITER.", 3500);
        return;
      }
    }

    // Doors
    for (const door of engine.doors) {
      if (door.position.distanceTo(pPos) < 2.2) {
        this.interactDoor(door);
        return;
      }
    }

    // Substation Breaker Box (Scenario 2)
    if (engine.currentRoomId === 'subway_substation') {
      const breakerPos = new THREE.Vector3(0, 1.5, -4.6);
      if (pPos.distanceTo(breakerPos) < 2.5) {
        this.objectives.restoredSubstation = true;
        window.outbreakAudio.playItemPickup();
        this.showSubtitle("Restored Main Subway Substation Power! Train tracks are electrified!", 4500);
        return;
      }
    }

    // Evac Helicopter (Scenario 3)
    if (engine.currentRoomId === 'hospital_helipad') {
      const heliPos = new THREE.Vector3(6.5, 0, 0);
      if (pPos.distanceTo(heliPos) < 3.5) {
        this.triggerVictory();
        return;
      }
    }

    // Train Driver Escape (Scenario 2)
    if (engine.currentRoomId === 'subway_train') {
      this.triggerVictory();
      return;
    }

    // Humvee Escape (Scenario 1)
    if (engine.currentRoomId === 'downtown_street') {
      const humveePos = new THREE.Vector3(8.0, 0, 0);
      if (pPos.distanceTo(humveePos) < 3.2) {
        this.triggerVictory();
        return;
      }
    }
  }

  collectPickup(pickup) {
    const pData = SURVIVORS[this.selectedSurvivor];
    if (this.inventory.length >= pData.slots) {
      window.outbreakAudio.playMenuCancel();
      this.showSubtitle("Inventory is full! (Press I to manage)", 2500);
      return;
    }
    pickup.isCollected = true;
    window.outbreakEngine.scene.remove(pickup.mesh);
    this.inventory.push(pickup.data);
    window.outbreakAudio.playItemPickup();
    this.showSubtitle(`Acquired: ${pickup.data.name}`, 3000);
    this.updateHUD();
  }

  interactDoor(door) {
    const data = door.userData;
    const engine = window.outbreakEngine;

    if (data.isLocked) {
      const hasKey = this.inventory.find(i => i.id === data.requiredKey);
      const isAlyssa = this.selectedSurvivor === 'alyssa' && this.inventory.some(i => i.id === 'lockpick_set');

      if (data.id === 'platform_to_train' && !this.objectives.restoredSubstation) {
        this.showSubtitle("Train has no electrical power! Restore power in the Substation.", 3500);
        return;
      }

      if (hasKey || (isAlyssa && data.requiredKey !== 'street_unlocked')) {
        data.isLocked = false;
        window.outbreakAudio.playDoorOpen();
        this.showSubtitle(`Unlocked the door!`, 2500);
        this.transitionRoom(data.targetRoom);
      } else {
        window.outbreakAudio.playMenuCancel();
        this.showSubtitle("It's locked. Requires specific key or clearance.", 2500);
      }
      return;
    }

    window.outbreakAudio.playDoorOpen();
    this.transitionRoom(data.targetRoom);
  }

  transitionRoom(targetRoom) {
    const engine = window.outbreakEngine;
    engine.switchRoom(targetRoom, true);

    if (targetRoom === 'hospital_helipad') {
      this.player.pos.set(-6.0, 0, 0.0);
      this.partner.pos.set(-7.5, 0, 0.0);
      if (this.boss && !this.boss.isDead) {
        engine.scene.add(this.boss.mesh);
        window.outbreakAudio.startBossMusic();
        this.showSubtitle("WARNING: THE LEECH MONSTER HAS AMBUSHED THE HELIPAD!", 4000);
      }
    } else if (targetRoom === 'hospital_lab') {
      this.player.pos.set(0, 0, 4.0);
      this.partner.pos.set(-1, 0, 4.0);
    } else if (targetRoom === 'hospital_morgue') {
      this.player.pos.set(0, 0, 4.0);
      this.partner.pos.set(-1, 0, 4.0);
    } else if (targetRoom === 'subway_platform') {
      this.player.pos.set(0, 0, 6.0);
      this.partner.pos.set(-1.5, 0, 6.0);
      if (this.boss && !this.boss.isDead) {
        engine.scene.add(this.boss.mesh);
        window.outbreakAudio.startBossMusic();
      }
    } else if (targetRoom === 'storage_room') {
      this.player.pos.set(0, 0, 4.5);
      this.partner.pos.set(-1, 0, 4.5);
    } else if (targetRoom === 'js_bar') {
      this.player.pos.set(4.5, 0, -5.5);
      this.partner.pos.set(4.0, 0, -4.5);
    } else if (targetRoom === 'downtown_street') {
      this.player.pos.set(0, 0, -8.0);
      this.partner.pos.set(-1.5, 0, -8.0);
    }

    for (const p of this.worldPickups) {
      if (!p.isCollected) {
        if (p.data.roomId === targetRoom) engine.scene.add(p.mesh);
        else engine.scene.remove(p.mesh);
      }
    }

    for (const z of this.zombies) {
      if (z.roomId === targetRoom) engine.scene.add(z.mesh);
      else engine.scene.remove(z.mesh);
    }
  }

  // --- VICTORY & GAME OVER ---
  triggerVictory() {
    this.state = 'VICTORY';
    window.outbreakAudio.playVictoryTheme();
    document.getElementById('hud').style.display = 'none';
    const victoryScreen = document.getElementById('victory-screen');
    victoryScreen.style.display = 'flex';

    const elapsedSec = (Date.now() - this.startTime) / 1000;
    let rank = 'B';
    if (elapsedSec < 120 && this.virusPercent < 45) rank = 'S';
    else if (elapsedSec < 180) rank = 'A';

    document.getElementById('results-rank').innerText = rank;
    document.getElementById('results-time').innerText = `${Math.floor(elapsedSec / 60)}m ${Math.floor(elapsedSec % 60)}s`;
    document.getElementById('results-kills').innerText = `${this.killCount} MUTANTS`;
  }

  triggerGameOver(isMutation = false) {
    this.state = 'GAMEOVER';
    window.outbreakAudio.playGameOverSting();
    document.getElementById('hud').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'flex';
    document.getElementById('game-over-reason').innerText = isMutation
      ? "T-VIRUS INFECTION REACHED 100% - YOU HAVE MUTATED INTO A ZOMBIE"
      : "YOU WERE OVERWHELMED BY THE HORDE";
  }

  // --- INVENTORY UI & 3D INSPECTION ---
  toggleInventory() {
    if (this.state === 'PLAYING') {
      this.state = 'INVENTORY';
      document.getElementById('inventory-modal').style.display = 'flex';
      window.outbreakAudio.playMenuSelect();
      this.renderInventoryUI();
    } else if (this.state === 'INVENTORY') {
      this.state = 'PLAYING';
      document.getElementById('inventory-modal').style.display = 'none';
      window.outbreakAudio.playMenuCancel();
    }
  }

  renderInventoryUI() {
    const container = document.getElementById('inventory-slots');
    container.innerHTML = '';
    const pData = SURVIVORS[this.selectedSurvivor];

    for (let i = 0; i < pData.slots; i++) {
      const item = this.inventory[i];
      const slot = document.createElement('div');
      slot.className = `inv-slot ${item ? 'filled' : 'empty'}`;

      if (item) {
        const isEq = this.equippedWeapon === item;
        slot.innerHTML = `
          <div class="slot-icon">${item.icon || '📦'}</div>
          <div class="slot-name">${item.name} ${isEq ? '<span class="eq-tag">[E]</span>' : ''}</div>
          <div class="slot-count">${item.ammo !== undefined ? `${item.ammo}/${item.maxAmmo}` : (item.count ? `x${item.count}` : '')}</div>
        `;
        slot.onclick = () => this.onInventoryItemClick(item, i);
      } else {
        slot.innerHTML = `<span class="empty-label">EMPTY</span>`;
      }
      container.appendChild(slot);
    }
  }

  onInventoryItemClick(item, index) {
    const actionPanel = document.getElementById('item-actions');
    actionPanel.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.desc || item.name}</p>
      <div class="action-buttons">
        ${item.ammo !== undefined || item.type === 'pipe' || item.type === 'spear' || item.type === 'magnum' || item.type === 'grenade_launcher' ? `<button onclick="outbreakGame.equipItem(${index})">EQUIP</button>` : ''}
        ${item.type === 'heal' || item.type === 'herb' ? `<button onclick="outbreakGame.useItem(${index})">USE</button>` : ''}
        <button onclick="outbreakGame.giveToPartner(${index})">GIVE TO PARTNER</button>
      </div>
    `;
  }

  equipItem(index) {
    const item = this.inventory[index];
    if (!item) return;
    this.equippedWeapon = item;
    this.updateEquippedVisual(this.player, this.equippedWeapon);
    window.outbreakAudio.playMenuSelect();
    this.renderInventoryUI();
    this.updateHUD();
  }

  useItem(index) {
    const item = this.inventory[index];
    if (!item) return;
    if (item.type === 'heal') {
      this.hp = Math.min(this.maxHp, this.hp + item.potency);
      this.isBleeding = false;
      this.isPoisoned = false;
      window.outbreakAudio.playHealSound();
      this.inventory.splice(index, 1);
    } else if (item.type === 'herb') {
      if (item.herbType === 'G') this.hp = Math.min(this.maxHp, this.hp + 40);
      else if (item.herbType === 'B') this.isPoisoned = false;
      window.outbreakAudio.playHealSound();
      this.inventory.splice(index, 1);
    }
    this.renderInventoryUI();
    this.updateHUD();
  }

  giveToPartner(index) {
    const item = this.inventory[index];
    if (!item) return;
    this.inventory.splice(index, 1);
    window.outbreakAudio.playMenuSelect();
    const partner = SURVIVORS[this.partnerSurvivor];
    this.showSubtitle(`Gave ${item.name} to ${partner.name}.`, 3000);
    this.renderInventoryUI();
    this.updateHUD();
  }

  struggleEscape() {
    if (!this.isGrabbed) return;
    this.struggleCount++;
    if (this.struggleCount >= 5) {
      this.isGrabbed = false;
      this.struggleCount = 0;
      if (this.grabbedBy) this.grabbedBy.pos.add(new THREE.Vector3(0, 0, -1.2));
      this.grabbedBy = null;
      window.outbreakAudio.playMeleeSwing();
      this.showSubtitle("Shoved the zombie off!", 2000);
    }
  }

  // --- UPDATE LOOP ---
  update(delta) {
    if (this.state !== 'PLAYING') return;

    let currentRate = this.virusRate;
    if (this.isBleeding) currentRate *= 2.5;
    this.virusPercent += currentRate * delta;
    this.partnerVirus += currentRate * 0.9 * delta;

    if (this.virusPercent >= 100.0) {
      this.triggerGameOver(true);
      return;
    }

    this.updatePlayerMovement(delta);
    this.updatePartnerAI(delta);
    this.updateZombies(delta);
    this.updateBoss(delta);

    window.outbreakEngine.updateCameraZone(this.player.pos);
    this.updateHUD();
  }

  updatePlayerMovement(delta) {
    if (this.isGrabbed || this.isPlayingDead) return;

    const p = this.player;
    const speed = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? p.speed * 1.5 : p.speed;

    let moveX = 0, moveZ = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const moveDir = new THREE.Vector3(moveX, 0, moveZ).normalize();
      p.pos.addScaledVector(moveDir, speed * delta);
      p.rot.y = Math.atan2(moveDir.x, moveDir.z);

      p.mesh.userData.walkTime += delta * 12;
      const legAngle = Math.sin(p.mesh.userData.walkTime) * 0.45;
      p.mesh.userData.leftLeg.rotation.x = legAngle;
      p.mesh.userData.rightLeg.rotation.x = -legAngle;
    } else {
      p.mesh.userData.leftLeg.rotation.x = 0;
      p.mesh.userData.rightLeg.rotation.x = 0;
    }

    if (this.isAiming || this.keys['Space']) {
      p.mesh.userData.rightArm.rotation.x = -Math.PI / 2;
      p.mesh.userData.leftArm.rotation.x = -Math.PI / 2.2;
    } else {
      p.mesh.userData.rightArm.rotation.x = 0;
      p.mesh.userData.leftArm.rotation.x = 0;
    }
  }

  updatePartnerAI(delta) {
    if (!this.partner || !this.partner.mesh) return;
    const pt = this.partner;
    const pPos = this.player.pos;

    if (pt.pos.distanceTo(pPos) > 2.5) {
      const dir = pPos.clone().sub(pt.pos).normalize();
      pt.pos.addScaledVector(dir, pt.speed * delta);
      pt.rot.y = Math.atan2(dir.x, dir.z);
    }
  }

  updateZombies(delta) {
    if (this.isPlayingDead) return;
    const engine = window.outbreakEngine;
    const pPos = this.player.pos;

    for (const z of this.zombies) {
      if (z.isDead || z.roomId !== engine.currentRoomId) continue;
      const dist = z.pos.distanceTo(pPos);

      if (dist < 8.0) {
        const dir = pPos.clone().sub(z.pos).normalize();
        z.pos.addScaledVector(dir, z.speed * delta);
        z.rot.y = Math.atan2(dir.x, dir.z);

        if (dist < 1.1 && !this.isGrabbed) {
          if (this.isGuarding) {
            this.hp -= 4;
            window.outbreakAudio.playGuardBlock();
            this.showSubtitle("BLOCKED ATTACK WITH GUARD STANCE!", 1500);
          } else {
            this.isGrabbed = true;
            this.grabbedBy = z;
            this.struggleCount = 0;
            this.hp -= 15;
            this.virusPercent += 1.5;
            this.isBleeding = true;
            window.outbreakAudio.playZombieBite();
            this.showSubtitle("GRABBED! Rapidly press SPACE or F to struggle!", 3000);
            if (this.hp <= 0) this.triggerGameOver(false);
          }
        }
      }
    }
  }

  updateBoss(delta) {
    if (!this.boss || this.boss.isDead || this.boss.roomId !== window.outbreakEngine.currentRoomId) return;
    const b = this.boss;
    const pPos = this.player.pos;
    const dist = b.pos.distanceTo(pPos);

    if (dist < 16.0) {
      const dir = pPos.clone().sub(b.pos).normalize();
      b.pos.addScaledVector(dir, b.speed * delta);
      b.rot.y = Math.atan2(dir.x, dir.z);

      if (dist < 2.5) {
        b.attackTimer += delta;
        if (b.attackTimer > 1.8) {
          b.attackTimer = 0;
          this.hp -= 30;
          window.outbreakAudio.playBossShriek();
          this.showSubtitle(`${b.name} ATTACKED! (-30 HP)`, 2000);
          if (this.hp <= 0) this.triggerGameOver(false);
        }
      }
    }
  }

  updateHUD() {
    const ekgLabel = document.getElementById('ekg-status-text');
    let condition = 'FINE', colorClass = 'fine';
    if (this.isBleeding) { condition = 'BLEED'; colorClass = 'bleed'; }
    else if (this.isPoisoned) { condition = 'POISON'; colorClass = 'poison'; }
    else if (this.hp <= 30) { condition = 'DANGER'; colorClass = 'danger'; }
    else if (this.hp <= 70) { condition = 'CAUTION'; colorClass = 'caution'; }

    if (ekgLabel) {
      ekgLabel.innerText = condition;
      ekgLabel.className = `condition-${colorClass}`;
    }

    const virusRing = document.getElementById('virus-gauge-fill');
    const virusText = document.getElementById('virus-percent-text');
    if (virusText) virusText.innerText = `${this.virusPercent.toFixed(1)}%`;
    if (virusRing) {
      const strokeVal = 283 - (this.virusPercent / 100) * 283;
      virusRing.style.strokeDashoffset = `${strokeVal}`;
    }

    const wpName = document.getElementById('hud-weapon-name');
    const wpAmmo = document.getElementById('hud-weapon-ammo');
    if (this.equippedWeapon) {
      wpName.innerText = this.equippedWeapon.name;
      wpAmmo.innerText = this.equippedWeapon.ammo !== undefined ? `${this.equippedWeapon.ammo} / ${this.equippedWeapon.maxAmmo}` : 'READY';
    } else {
      wpName.innerText = 'UNARMED';
      wpAmmo.innerText = '--';
    }

    const ptStatus = document.getElementById('partner-status-text');
    if (ptStatus) {
      const partner = SURVIVORS[this.partnerSurvivor];
      ptStatus.innerText = `${partner.name}: ${this.partnerHp > 50 ? 'FINE' : 'CAUTION'} (${this.partnerVirus.toFixed(0)}% INF)`;
    }

    const bossHud = document.getElementById('boss-hud-bar');
    if (bossHud) {
      if (this.boss && !this.boss.isDead && this.boss.roomId === window.outbreakEngine.currentRoomId) {
        bossHud.style.display = 'block';
        document.getElementById('boss-title-text').innerText = this.boss.name;
        const fill = document.getElementById('boss-hp-fill');
        if (fill) fill.style.width = `${(this.boss.hp / this.boss.maxHp) * 100}%`;
      } else {
        bossHud.style.display = 'none';
      }
    }
  }
}

window.outbreakGame = new OutbreakGame();
