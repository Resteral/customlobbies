// City Underground - Sims & Fortnite-Style Open MLO Base Building Engine (Key: H)
window.BaseBuilder = {
  activePropertyId: 'apt_101',
  activeFloorIndex: 0, // 0 = Ground, 1 = Upper Loft, -1 = Sub-Basement
  activeFloorId: 'floor_1',
  isIsometric: false,
  gridSize: 12, // Dynamic based on MLO property footprint
  cellSize: 36,
  cameraAngle: 0, // 0, 90, 180, 270 degrees
  cutawayMode: 'up', // 'up', 'cutaway', 'down'
  
  // Fortnite Fast Building Mode & Materials
  activeMaterial: 'wood', // 'wood', 'brick', 'metal'
  activeFortnitePiece: 'wall', // 'wall', 'floor', 'ramp', 'cone', 'trap'
  isMouseDown: false,
  lastBuiltCell: { x: -1, y: -1 },
  isEditModeOpen: false,
  editTargetObjId: null,
  editTiles: [true, true, true, true, true, true, true, true, true], // 3x3 tiles: true=solid, false=hollow

  // Active Build/Buy Mode & Categories
  activeMode: 'build', // 'build' or 'buy'
  activeSubcategory: 'walls',
  selectedCatalogId: 'wall_fortnite_wood',
  selectedRotation: 0,
  selectedColor: '#92400e',
  activeTool: 'place', // 'place', 'eyedropper', 'sledgehammer', 'shove', 'zone', 'rotate', 'interact'
  
  hoverCell: { x: 0, y: 0 },
  draggedObjId: null,
  activeFxList: [],
  audioCtx: null,

  // Room Zone Definition
  currentZoneIndex: 0,
  zoneTypes: [
    { name: '🛋️ Living & Social', color: 'rgba(56, 189, 248, 0.25)', border: '#38bdf8' },
    { name: '🛏️ Bedroom & Stash', color: 'rgba(168, 85, 247, 0.25)', border: '#a855f7' },
    { name: '🧪 Synthesis Lab', color: 'rgba(234, 179, 8, 0.25)', border: '#eab308' },
    { name: '🪴 Hydroponics Grow', color: 'rgba(16, 185, 129, 0.25)', border: '#10b981' },
    { name: '⚔️ Armory & Killzone', color: 'rgba(239, 68, 68, 0.25)', border: '#ef4444' },
    { name: '🚗 Garage & Workshop', color: 'rgba(249, 115, 22, 0.25)', border: '#f97316' }
  ],
  roomZones: {},

  // Multi-Floor Layout Data per MLO Property
  mloLayouts: {
    apt_101: [
      { id: 'apt_w1', catalogId: 'wall_fortnite_wood', gridX: 0, gridY: 0, rotation: 0, color: '#92400e', health: 150 },
      { id: 'apt_w2', catalogId: 'wall_fortnite_wood', gridX: 1, gridY: 0, rotation: 0, color: '#92400e', health: 150 },
      { id: 'apt_w3', catalogId: 'door_wood', gridX: 2, gridY: 0, rotation: 0, color: '#854d0e', health: 400 },
      { id: 'apt_w4', catalogId: 'wall_fortnite_wood', gridX: 3, gridY: 0, rotation: 0, color: '#92400e', health: 150 },
      { id: 'apt_w5', catalogId: 'window_single', gridX: 4, gridY: 0, rotation: 0, color: '#38bdf8', health: 180 },
      { id: 'apt_f1', catalogId: 'floor_fortnite_wood', gridX: 0, gridY: 0, rotation: 0, color: '#78350f', health: 150 },
      { id: 'apt_o1', catalogId: 'barricade_flippable_bookshelf', gridX: 5, gridY: 1, rotation: 0, color: '#78350f', health: 1500 },
      { id: 'apt_o2', catalogId: 'defense_door_wedge', gridX: 2, gridY: 1, rotation: 0, color: '#0284c7', health: 1200 },
      { id: 'apt_o3', catalogId: 'bed_queen', gridX: 2, gridY: 4, rotation: 0, color: '#0284c7', health: 300 },
      { id: 'apt_o4', catalogId: 'sofa_leather', gridX: 6, gridY: 4, rotation: 0, color: '#1e293b', health: 400 },
      { id: 'apt_o5', catalogId: 'synth_lab_table', gridX: 2, gridY: 8, rotation: 0, color: '#581c87', health: 600 }
    ],
    mlo_industrial_warehouse: [
      { id: 'wh_w1', catalogId: 'wall_fortnite_metal', gridX: 0, gridY: 0, rotation: 0, color: '#334155', health: 500 },
      { id: 'wh_w2', catalogId: 'suburban_garage_blast_door', gridX: 6, gridY: 0, rotation: 0, color: '#334155', health: 2000 },
      { id: 'wh_f1', catalogId: 'floor_fortnite_metal', gridX: 0, gridY: 0, rotation: 0, color: '#1e293b', health: 500 },
      { id: 'wh_o1', catalogId: 'gunsmith_workbench', gridX: 2, gridY: 4, rotation: 0, color: '#713f12', health: 750 },
      { id: 'wh_o2', catalogId: 'synth_lab_table', gridX: 10, gridY: 4, rotation: 0, color: '#581c87', health: 800 },
      { id: 'wh_o3', catalogId: 'barricade_heavy_wardrobe', gridX: 6, gridY: 2, rotation: 0, color: '#292524', health: 1800 },
      { id: 'wh_o4', catalogId: 'cctv_security_station', gridX: 2, gridY: 10, rotation: 0, color: '#0369a1', health: 300 }
    ],
    mlo_suburban_ranch: [
      { id: 'sub_w1', catalogId: 'wall_fortnite_brick', gridX: 0, gridY: 0, rotation: 0, color: '#b91c1c', health: 300 },
      { id: 'sub_f1', catalogId: 'floor_fortnite_wood', gridX: 0, gridY: 0, rotation: 0, color: '#78350f', health: 150 },
      { id: 'sub_o1', catalogId: 'suburban_porch_bunker', gridX: 6, gridY: 0, rotation: 0, color: '#854d0e', health: 950 },
      { id: 'sub_o2', catalogId: 'suburban_claymore_gnome', gridX: 3, gridY: 0, rotation: 0, color: '#e11d48', health: 120 },
      { id: 'sub_o3', catalogId: 'suburban_chem_sprinkler', gridX: 12, gridY: 2, rotation: 0, color: '#06b6d4', health: 250 },
      { id: 'sub_o4', catalogId: 'suburban_electric_gate', gridX: 6, gridY: 2, rotation: 0, color: '#eab308', health: 700 },
      { id: 'sub_o5', catalogId: 'suburban_megaphone_pa', gridX: 0, gridY: 5, rotation: 0, color: '#fbbf24', health: 200 }
    ],
    mlo_downtown_storefront: [
      { id: 'store_w1', catalogId: 'wall_glass', gridX: 0, gridY: 0, rotation: 0, color: '#38bdf8', health: 200 },
      { id: 'store_f1', catalogId: 'floor_marble', gridX: 0, gridY: 0, rotation: 0, color: '#f8fafc', health: 600 },
      { id: 'store_o1', catalogId: 'defense_riot_grate', gridX: 5, gridY: 0, rotation: 0, color: '#0f172a', health: 900 },
      { id: 'store_o2', catalogId: 'secure_vault_safe', gridX: 2, gridY: 4, rotation: 0, color: '#0f172a', health: 1500 },
      { id: 'store_o3', catalogId: 'refrigerator', gridX: 8, gridY: 4, rotation: 0, color: '#94a3b8', health: 500 }
    ],
    mlo_dockside_garage: [
      { id: 'gar_w1', catalogId: 'wall_fortnite_metal', gridX: 0, gridY: 0, rotation: 0, color: '#334155', health: 500 },
      { id: 'gar_f1', catalogId: 'floor_concrete', gridX: 0, gridY: 0, rotation: 0, color: '#334155', health: 1000 },
      { id: 'gar_o1', catalogId: 'suburban_garage_blast_door', gridX: 6, gridY: 0, rotation: 0, color: '#334155', health: 2000 },
      { id: 'gar_o2', catalogId: 'gunsmith_workbench', gridX: 2, gridY: 4, rotation: 0, color: '#713f12', health: 750 },
      { id: 'gar_o3', catalogId: 'furniture_cast_iron_stove_blocker', gridX: 6, gridY: 2, rotation: 0, color: '#1e293b', health: 2200 }
    ],
    mlo_underground_bunker: [
      { id: 'bunk_w1', catalogId: 'wall_fortnite_metal', gridX: 0, gridY: 0, rotation: 0, color: '#1e293b', health: 500 },
      { id: 'bunk_f1', catalogId: 'floor_marble', gridX: 0, gridY: 0, rotation: 0, color: '#0f172a', health: 2500 },
      { id: 'bunk_o1', catalogId: 'defense_steel_barricade', gridX: 6, gridY: 0, rotation: 0, color: '#475569', health: 800 },
      { id: 'bunk_o2', catalogId: 'defense_keypad_door', gridX: 6, gridY: 1, rotation: 0, color: '#1e3a8a', pin: '9944', health: 1200 },
      { id: 'bunk_o3', catalogId: 'secure_vault_safe', gridX: 3, gridY: 6, rotation: 0, color: '#0f172a', health: 1500 },
      { id: 'bunk_o4', catalogId: 'synth_lab_table', gridX: 10, gridY: 6, rotation: 0, color: '#581c87', health: 800 }
    ]
  },

  placedObjects: [],

  // Sub-Category Definitions
  subcategories: {
    build: [
      { id: 'fortnite', name: '⚡ Fortnite Fast-Build' },
      { id: 'walls', name: '🧱 Walls & Fences' },
      { id: 'doors', name: '🚪 Doors & Portals' },
      { id: 'windows', name: '🪟 Windows' },
      { id: 'flooring', name: '🪵 Flooring' },
      { id: 'wallpaint', name: '🎨 Wallpapers & Paint' },
      { id: 'lighting', name: '💡 Lighting & Fixtures' }
    ],
    buy: [
      { id: 'comfort', name: '🛋️ Comfort' },
      { id: 'surfaces', name: '🪑 Surfaces' },
      { id: 'appliances', name: '🍳 Appliances' },
      { id: 'electronics', name: '📺 Electronics' },
      { id: 'storage', name: '🗄️ Storage & Stashes' },
      { id: 'production', name: '🧪 Synthesis & Botany' },
      { id: 'barricades', name: '🛑 Flippable Barricades' },
      { id: 'fitness', name: '🏋️ Gym & Fitness' },
      { id: 'suburban', name: '🏡 Suburban Traps' },
      { id: 'defense', name: '🛡️ Fortifications' },
      { id: 'decor', name: '🪴 Decor & Plants' }
    ]
  },

  // Complete Sims & Fortnite Master Catalog
  catalog: {
    // === FORTNITE FAST-BUILD CORE PIECES ===
    wall_fortnite_wood: { name: 'Wood Wall (Fortnite)', mode: 'build', subcat: 'fortnite', price: 25, w: 1, h: 1, icon: '🧱', color: '#92400e', maxHealth: 150, isWall: true, mat: 'wood', desc: 'Instant-deploy wooden defensive wall.' },
    wall_fortnite_brick: { name: 'Brick Wall (Fortnite)', mode: 'build', subcat: 'fortnite', price: 45, w: 1, h: 1, icon: '🧱', color: '#b91c1c', maxHealth: 300, isWall: true, mat: 'brick', desc: 'Instant-deploy stone masonry wall.' },
    wall_fortnite_metal: { name: 'Metal Wall (Fortnite)', mode: 'build', subcat: 'fortnite', price: 85, w: 1, h: 1, icon: '🛡️', color: '#334155', maxHealth: 500, isWall: true, mat: 'metal', desc: 'Instant-deploy reinforced alloy blast wall.' },

    floor_fortnite_wood: { name: 'Wood Floor Platform', mode: 'build', subcat: 'fortnite', price: 20, w: 1, h: 1, icon: '🪵', color: '#78350f', isFloor: true, mat: 'wood', desc: 'Instant-deploy wooden floor platform.' },
    floor_fortnite_brick: { name: 'Brick Floor Platform', mode: 'build', subcat: 'fortnite', price: 35, w: 1, h: 1, icon: '⬛', color: '#475569', isFloor: true, mat: 'brick', desc: 'Instant-deploy stone floor platform.' },
    floor_fortnite_metal: { name: 'Metal Floor Platform', mode: 'build', subcat: 'fortnite', price: 65, w: 1, h: 1, icon: '🛡️', color: '#1e293b', isFloor: true, mat: 'metal', desc: 'Instant-deploy steel deck floor platform.' },

    ramp_fortnite_wood: { name: 'Wood Ramp / Stairs', mode: 'build', subcat: 'fortnite', price: 30, w: 1, h: 1, icon: '📐', color: '#b45309', maxHealth: 150, isRamp: true, mat: 'wood', desc: '45° ascending wooden staircase for high-ground.' },
    ramp_fortnite_brick: { name: 'Brick Ramp / Stairs', mode: 'build', subcat: 'fortnite', price: 50, w: 1, h: 1, icon: '📐', color: '#991b1b', maxHealth: 300, isRamp: true, mat: 'brick', desc: '45° ascending stone staircase for high-ground.' },
    ramp_fortnite_metal: { name: 'Metal Ramp / Stairs', mode: 'build', subcat: 'fortnite', price: 90, w: 1, h: 1, icon: '📐', color: '#0f172a', maxHealth: 500, isRamp: true, mat: 'metal', desc: '45° ascending steel staircase with heavy ballistic shielding.' },

    cone_fortnite_wood: { name: 'Wood Cone / Roof', mode: 'build', subcat: 'fortnite', price: 25, w: 1, h: 1, icon: '🔺', color: '#d97706', maxHealth: 150, isCone: true, mat: 'wood', desc: 'Pyramid roof cone to block drop attacks.' },
    cone_fortnite_brick: { name: 'Brick Cone / Roof', mode: 'build', subcat: 'fortnite', price: 40, w: 1, h: 1, icon: '🔺', color: '#7f1d1d', maxHealth: 300, isCone: true, mat: 'brick', desc: 'Stone pyramid roof cone.' },
    cone_fortnite_metal: { name: 'Metal Cone / Roof', mode: 'build', subcat: 'fortnite', price: 75, w: 1, h: 1, icon: '🔺', color: '#1e293b', maxHealth: 500, isCone: true, mat: 'metal', desc: 'Steel-armored pyramid roof cone.' },

    // === BUILD MODE: WALLS & FENCES ===
    wall_drywall: { name: 'Drywall Partition', mode: 'build', subcat: 'walls', price: 65, w: 1, h: 1, icon: '🧱', color: '#e2e8f0', maxHealth: 250, isWall: true, desc: 'Standard residential drywall partition.' },
    wall_brick: { name: 'Exposed Red Brick', mode: 'build', subcat: 'walls', price: 120, w: 1, h: 1, icon: '🧱', color: '#991b1b', maxHealth: 600, isWall: true, desc: 'Solid load-bearing red brick wall.' },
    wall_concrete: { name: 'Reinforced Concrete', mode: 'build', subcat: 'walls', price: 180, w: 1, h: 1, icon: '🧱', color: '#475569', maxHealth: 850, isWall: true, desc: 'Heavy industrial poured concrete slab.' },
    wall_steel: { name: 'Hardened Steel Bunker Wall', mode: 'build', subcat: 'walls', price: 320, w: 1, h: 1, icon: '🛡️', color: '#1e293b', maxHealth: 1500, isWall: true, desc: 'Ballistic titanium-alloy reinforced blast wall.' },
    wall_glass: { name: 'Tinted Glass Divider', mode: 'build', subcat: 'walls', price: 150, w: 1, h: 1, icon: '🪟', color: '#38bdf8', maxHealth: 200, isWall: true, desc: 'Floor-to-ceiling modern acoustic glass.' },
    fence_picket: { name: 'White Picket Fence', mode: 'build', subcat: 'walls', price: 40, w: 1, h: 1, icon: '🏡', color: '#f8fafc', maxHealth: 150, isWall: true, desc: 'Classic suburban wooden picket perimeter fence.' },
    fence_barbed: { name: 'Razor-Wire Fence Post', mode: 'build', subcat: 'walls', price: 95, w: 1, h: 1, icon: '⛓️', color: '#64748b', maxHealth: 350, isWall: true, desc: 'Galvanized chainlink topped with concertina wire.' },

    // === BUILD MODE: DOORS & PORTALS ===
    door_wood: { name: 'Solid Pine Door', mode: 'build', subcat: 'doors', price: 160, w: 1, h: 1, icon: '🚪', color: '#854d0e', maxHealth: 400, isDoor: true, desc: 'Standard residential lockable wooden door.' },
    door_steel: { name: 'Reinforced Steel Door', mode: 'build', subcat: 'doors', price: 450, w: 1, h: 1, icon: '🚪', color: '#334155', maxHealth: 1000, isDoor: true, desc: 'Commercial heavy gauge door with multi-point deadbolts.' },
    door_vault: { name: 'Keypad Vault Door', mode: 'build', subcat: 'doors', price: 1200, w: 2, h: 1, icon: '🔐', color: '#1e3a8a', maxHealth: 1600, isDoor: true, action: 'KEYPAD', desc: 'Heavy blast-rated security door with digital keypad.' },
    archway_open: { name: 'Open Plaster Archway', mode: 'build', subcat: 'doors', price: 90, w: 1, h: 1, icon: '🏛️', color: '#cbd5e1', isDoor: true, desc: 'Seamless open architectural passageway.' },
    door_french: { name: 'French Double Glass Doors', mode: 'build', subcat: 'doors', price: 380, w: 2, h: 1, icon: '🚪', color: '#0284c7', maxHealth: 350, isDoor: true, desc: 'Elegant double glass balcony & patio doors.' },

    // === BUILD MODE: WINDOWS ===
    window_single: { name: 'Single-Pane Sash Window', mode: 'build', subcat: 'windows', price: 110, w: 1, h: 1, icon: '🪟', color: '#38bdf8', maxHealth: 180, isWindow: true, desc: 'Standard residential sunlight window.' },
    window_bay: { name: 'Wide Bay Window', mode: 'build', subcat: 'windows', price: 240, w: 2, h: 1, icon: '🪟', color: '#0284c7', maxHealth: 250, isWindow: true, desc: 'Panoramic triple-pane architectural bay window.' },
    window_gunslit: { name: 'Armored Ballistic Gun-Slit', mode: 'build', subcat: 'windows', price: 350, w: 1, h: 1, icon: '🎯', color: '#0f172a', maxHealth: 900, isWindow: true, desc: 'Narrow slit reinforced with 3-inch ballistic polycarbonate.' },

    // === BUILD MODE: FLOORING ===
    floor_hardwood: { name: 'Dark Oak Hardwood', mode: 'build', subcat: 'flooring', price: 45, w: 1, h: 1, icon: '🪵', color: '#78350f', isFloor: true, desc: 'Polished walnut hardwood tongue-and-groove planks.' },
    floor_pine: { name: 'Scandi Light Pine', mode: 'build', subcat: 'flooring', price: 40, w: 1, h: 1, icon: '🪵', color: '#d97706', isFloor: true, desc: 'Bright minimalist Nordic pine flooring.' },
    floor_marble: { name: 'Italian Carrara Marble', mode: 'build', subcat: 'flooring', price: 95, w: 1, h: 1, icon: '🏛️', color: '#f8fafc', isFloor: true, desc: 'Polished luxury veined white marble tile.' },
    floor_concrete: { name: 'Polished Industrial Slate', mode: 'build', subcat: 'flooring', price: 35, w: 1, h: 1, icon: '⬛', color: '#334155', isFloor: true, desc: 'Sealed concrete industrial warehouse flooring.' },
    floor_carpet: { name: 'Tactical Charcoal Carpet', mode: 'build', subcat: 'flooring', price: 30, w: 1, h: 1, icon: '🧶', color: '#1e293b', isFloor: true, desc: 'High-traffic sound-dampening commercial carpet.' },

    // === BUILD MODE: WALL COVERINGS & PAINT ===
    paint_slate: { name: 'Midnight Slate Paint', mode: 'build', subcat: 'wallpaint', price: 25, w: 1, h: 1, icon: '🎨', color: '#0f172a', isPaint: true, desc: 'Matte dark charcoal interior wall coat.' },
    paint_victorian: { name: 'Victorian Damask Wallpaper', mode: 'build', subcat: 'wallpaint', price: 45, w: 1, h: 1, icon: '📜', color: '#581c87', isPaint: true, desc: 'Opulent gold-filigree patterned wallpaper.' },
    paint_white: { name: 'Pure White Modern Stucco', mode: 'build', subcat: 'wallpaint', price: 20, w: 1, h: 1, icon: '⚪', color: '#ffffff', isPaint: true, desc: 'Crisp, modern reflective white plaster finish.' },
    paint_brick: { name: 'Distressed Brick Veneer', mode: 'build', subcat: 'wallpaint', price: 50, w: 1, h: 1, icon: '🧱', color: '#b91c1c', isPaint: true, desc: 'Rustic distressed loft brick wall cladding.' },

    // === BUILD MODE: LIGHTING ===
    light_potlight: { name: 'Recessed LED Potlight', mode: 'build', subcat: 'lighting', price: 80, w: 1, h: 1, icon: '💡', color: '#fef08a', isLight: true, desc: 'Ceiling mounted dimmable warm LED spotlight.' },
    light_uv_grow: { name: 'Hydroponic UV Grow Lamp', mode: 'build', subcat: 'lighting', price: 450, w: 2, h: 1, icon: '💡', color: '#a855f7', maxHealth: 150, isLight: true, desc: 'Full spectrum UV light for botanical grow yields.' },
    light_neon_cyan: { name: 'Cyber Neon Lightbar', mode: 'build', subcat: 'lighting', price: 180, w: 2, h: 1, icon: '💡', color: '#00f2fe', isLight: true, desc: 'Vibrant neon blue architectural accent strip.' },
    light_floor_brass: { name: 'Brass Arc Floor Lamp', mode: 'build', subcat: 'lighting', price: 140, w: 1, h: 1, icon: '🏮', color: '#f59e0b', maxHealth: 100, isLight: true, desc: 'Mid-century brass arching living room lamp.' },

    // === BUY MODE: COMFORT ===
    chair_dining_wood: { name: 'Oak Dining Chair', mode: 'buy', subcat: 'comfort', price: 120, w: 1, h: 1, icon: '🪑', color: '#854d0e', action: 'SIT_CHAIR', maxHealth: 250, isChair: true, desc: 'Oak dining chair with smooth slide-out animation when sitting.' },
    chair_office_executive: { name: 'Executive Swivel Chair', mode: 'buy', subcat: 'comfort', price: 280, w: 1, h: 1, icon: '🪑', color: '#0f172a', action: 'SIT_CHAIR', maxHealth: 300, isChair: true, desc: 'High-back ergonomic leather swivel chair with smooth glide animation.' },
    chair_kitchen_barstool: { name: 'Industrial Swivel Barstool', mode: 'buy', subcat: 'comfort', price: 95, w: 1, h: 1, icon: '🪑', color: '#713f12', action: 'SIT_CHAIR', maxHealth: 200, isChair: true, desc: 'Walnut counter barstool with 360-degree swivel and slide-out clearance.' },
    sofa_leather: { name: 'Leather Sectional Sofa', mode: 'buy', subcat: 'comfort', price: 650, w: 3, h: 2, icon: '🛋️', color: '#1e293b', maxHealth: 400, desc: 'Supple Italian leather 3-piece sectional.' },
    bed_queen: { name: 'Queen Memory Foam Bed', mode: 'buy', subcat: 'comfort', price: 850, w: 2, h: 3, icon: '🛏️', color: '#0284c7', action: 'REST', maxHealth: 300, desc: 'Luxury plush mattress. Rest restores 100% health.' },
    recliner_ergo: { name: 'Ergonomic Lounge Recliner', mode: 'buy', subcat: 'comfort', price: 320, w: 1, h: 1, icon: '🪑', color: '#334155', action: 'REST', maxHealth: 200, desc: 'Adjustable zero-gravity comfort lounger.' },
    bunk_tactical: { name: 'Tactical Steel Bunk Bed', mode: 'buy', subcat: 'comfort', price: 480, w: 2, h: 2, icon: '🛏️', color: '#0f172a', action: 'REST', maxHealth: 500, desc: 'Reinforced dual-tier squad bunk bed.' },

    // === BUY MODE: SURFACES ===
    dining_table: { name: 'Mahogany Dining Table', mode: 'buy', subcat: 'surfaces', price: 400, w: 3, h: 2, icon: '🪑', color: '#451a03', maxHealth: 350, desc: 'Solid carved mahogany dining room centerpiece.' },
    coffee_table: { name: 'Glass & Steel Coffee Table', mode: 'buy', subcat: 'surfaces', price: 150, w: 2, h: 1, icon: '☕', color: '#0f172a', maxHealth: 150, desc: 'Tempered glass top lounge coffee table.' },
    desk_executive: { name: 'Executive Walnut Desk', mode: 'buy', subcat: 'surfaces', price: 520, w: 3, h: 2, icon: '🖥️', color: '#78350f', maxHealth: 450, desc: 'Grand managerial desk with lockable drawers.' },
    counter_granite: { name: 'Granite Kitchen Island', mode: 'buy', subcat: 'surfaces', price: 300, w: 2, h: 1, icon: '🍽️', color: '#1e293b', maxHealth: 500, desc: 'Polished black granite food prep island.' },

    // === BUY MODE: APPLIANCES ===
    refrigerator: { name: 'Commercial Stainless Fridge', mode: 'buy', subcat: 'appliances', price: 950, w: 2, h: 2, icon: '🧊', color: '#94a3b8', action: 'FRIDGE', maxHealth: 500, desc: 'Double-door commercial cold storage with ice maker.' },
    stove_oven: { name: 'Commercial 6-Burner Cooking Stove', mode: 'buy', subcat: 'appliances', price: 750, w: 2, h: 2, icon: '🍳', color: '#334155', action: 'OPEN_COOKING_STOVE', maxPerProperty: 1, maxHealth: 600, desc: 'Grid-locked commercial gas range stove and convection oven for gourmet cooking (1 Per House).' },
    microwave_oven: { name: 'Compact Digital Microwave', mode: 'buy', subcat: 'appliances', price: 120, w: 1, h: 1, icon: '🍿', color: '#475569', action: 'OPEN_COOKING_STOVE', maxHealth: 150, desc: '1200W quick-reheat countertop appliance.' },
    espresso_machine: { name: 'Italian Barista Espresso Rig', mode: 'buy', subcat: 'appliances', price: 420, w: 1, h: 1, icon: '☕', color: '#eab308', action: 'COFFEE', maxHealth: 200, desc: 'High-pressure brass espresso brewer (+Stamina bonus).' },

    // === BUY MODE: ELECTRONICS ===
    flatscreen_tv: { name: '75" 4K OLED Smart TV', mode: 'buy', subcat: 'electronics', price: 1200, w: 2, h: 1, icon: '📺', color: '#000000', action: 'TV', maxHealth: 200, desc: 'Bezel-less ultra HD smart display with streaming apps.' },
    cctv_security_station: { name: 'CCTV Security Terminal', mode: 'buy', subcat: 'electronics', price: 1100, w: 2, h: 1, icon: '📹', color: '#0369a1', action: 'CCTV', maxHealth: 300, desc: 'Multi-camera surveillance monitor feed terminal.' },
    battlestation_pc: { name: 'Liquid-Cooled Battlestation PC', mode: 'buy', subcat: 'electronics', price: 2400, w: 2, h: 1, icon: '🖥️', color: '#a855f7', action: 'PC', maxHealth: 250, desc: 'Custom RGB rig for hacking and deep web banking.' },

    // === BUY MODE: STORAGE ===
    secure_vault_safe: { name: 'Titanium Floor Safe (80kg)', mode: 'buy', subcat: 'storage', price: 1500, w: 2, h: 2, icon: '🗄️', color: '#0f172a', action: 'STASH', maxHealth: 1500, desc: 'Fireproof floor-bolted safe with PIN combination dial.' },
    weapon_rack: { name: 'Tactical Weapon Rack (10 Slots)', mode: 'buy', subcat: 'storage', price: 600, w: 2, h: 1, icon: '⚔️', color: '#1e293b', action: 'ARMORY', maxHealth: 500, desc: 'Wall-mounted lockable rifle and shotgun display rack.' },
    filing_cabinet: { name: 'Steel 4-Drawer File Cabinet', mode: 'buy', subcat: 'storage', price: 180, w: 1, h: 1, icon: '📁', color: '#475569', action: 'STASH', maxHealth: 300, desc: 'Heavy gauge steel files for deeds and contraband blueprints.' },

    // === BUY MODE: PRODUCTION ===
    workbench_engineering: { name: 'Precision Engineering Work Bench', mode: 'buy', subcat: 'production', price: 650, w: 2, h: 1, icon: '🔧', color: '#0284c7', action: 'OPEN_WORKBENCH', maxPerProperty: 1, maxHealth: 1200, desc: 'Grid-locked workbench for high-security lock upgrades, tool tuning, and sensor calibration (1 Per House).' },
    crafting_bench_master: { name: 'Heavy Fabrication Crafting Bench', mode: 'buy', subcat: 'production', price: 500, w: 2, h: 1, icon: '🔨', color: '#d97706', action: 'OPEN_CRAFTING_BENCH', maxPerProperty: 1, maxHealth: 1000, desc: 'Grid-locked fabrication station for assembling prop barricades, lockpick sets, CCTV kits, and gym weights (1 Per House).' },
    synth_lab_table: { name: 'Chemical Synthesis Reactor', mode: 'buy', subcat: 'production', price: 2500, w: 3, h: 2, icon: '⚗️', color: '#581c87', action: 'SYNTH', maxHealth: 800, desc: 'High-temperature distillation reactor for illicit chemistry.' },
    hydro_grow_pot: { name: 'Hydroponic Cultivar Planter', mode: 'buy', subcat: 'production', price: 350, w: 1, h: 1, icon: '🪴', color: '#15803d', action: 'BOTANY', maxHealth: 200, desc: 'Aerated nutrient basin for accelerated botanical crops.' },
    gunsmith_workbench: { name: 'Master Gunsmith Workbench', mode: 'buy', subcat: 'production', price: 1800, w: 3, h: 2, icon: '🛠️', color: '#713f12', action: 'CRAFT', maxHealth: 750, desc: 'Heavy vise, milling table, and suppressor fabrication station.' },

    // === BUY MODE: FLIPPABLE BARRICADES ===
    barricade_flippable_bookshelf: { name: 'Oak Stand-Up Bookshelf', mode: 'buy', subcat: 'barricades', price: 380, w: 2, h: 1, icon: '📚', color: '#78350f', maxHealth: 1500, isDefense: true, action: 'FLIP_STAND', desc: 'Flips upright into a 1,500 HP corridor-sealing barricade.' },
    barricade_flippable_table: { name: 'Steel Flip-Table Shield', mode: 'buy', subcat: 'barricades', price: 320, w: 3, h: 2, icon: '🪑', color: '#451a03', maxHealth: 1100, isDefense: true, action: 'FLIP_TABLE', desc: 'Flips on side to create a ballistic bunker with gun ports.' },
    barricade_heavy_wardrobe: { name: 'Sliding Doorway Armoire', mode: 'buy', subcat: 'barricades', price: 550, w: 2, h: 2, icon: '🚪', color: '#292524', maxHealth: 1800, isDefense: true, action: 'SHOVE_BARRICADE', desc: 'Heavy steel-lined wardrobe to shove against picked doors.' },
    defense_door_wedge: { name: 'Titanium Door Wedge', mode: 'buy', subcat: 'barricades', price: 140, w: 1, h: 1, icon: '🛑', color: '#0284c7', maxHealth: 1200, isDefense: true, action: 'JAM_DOOR', desc: 'Kicked under doors to stop lockpicked doors from opening.' },
    defense_lock_electrifier: { name: 'Anti-Lockpick Handle Stun Rig', mode: 'buy', subcat: 'barricades', price: 480, w: 1, h: 1, icon: '⚡', color: '#eab308', maxHealth: 250, isDefense: true, action: 'TEST_STUN_RIG', desc: 'Zaps lockpickers with 10,000V & snaps their lockpicks.' },
    defense_door_flashbang_trip: { name: 'Door-Mounted Flashbang Rig', mode: 'buy', subcat: 'barricades', price: 290, w: 1, h: 1, icon: '💥', color: '#f97316', maxHealth: 180, isDefense: true, action: 'TEST_FLASH_RIG', desc: 'Blinds raiders entering through picked doors.' },
    defense_falling_cabinet_trap: { name: 'Tilted Filing Cabinet Trap', mode: 'buy', subcat: 'barricades', price: 410, w: 2, h: 1, icon: '🗄️', color: '#475569', maxHealth: 600, isDefense: true, action: 'TEST_DROP_TRAP', desc: 'Collapses on raiders pushing door, dealing 80 damage.' },
    furniture_cast_iron_stove_blocker: { name: 'Cast-Iron Stove Anchor', mode: 'buy', subcat: 'barricades', price: 620, w: 2, h: 2, icon: '🍳', color: '#1e293b', maxHealth: 2200, isDefense: true, action: 'SHOVE_BARRICADE', desc: '500lb cast-iron stove shoved to anchor doors shut.' },

    // === BUY MODE: SUBURBAN WARFARE & TRAPS ===
    suburban_claymore_gnome: { name: 'Claymore Lawn Gnome', mode: 'buy', subcat: 'suburban', price: 320, w: 1, h: 1, icon: '🧙‍♂️', color: '#e11d48', maxHealth: 120, isDefense: true, action: 'GNOME', desc: 'Concealed directional explosive ceramic lawn gnome.' },
    suburban_chem_sprinkler: { name: 'Pepper Sprinkler', mode: 'buy', subcat: 'suburban', price: 450, w: 1, h: 1, icon: '💦', color: '#06b6d4', maxHealth: 250, isDefense: true, action: 'SPRINKLER', desc: 'Oscillating sprinkler firing caustic pepper mist.' },
    suburban_firework_mortar: { name: 'Tripwire Mortar Box', mode: 'buy', subcat: 'suburban', price: 550, w: 1, h: 1, icon: '🎆', color: '#f59e0b', maxHealth: 300, isDefense: true, action: 'FIREWORKS', desc: 'Whistling screaming fireworks defense battery.' },
    suburban_electric_gate: { name: 'Electrified Gate (5kV)', mode: 'buy', subcat: 'suburban', price: 680, w: 2, h: 1, icon: '⚡', color: '#eab308', maxHealth: 700, isDefense: true, action: 'VOLTAGE', desc: 'Picket fence gate with 5,000V intruder shock.' },
    suburban_oil_slick: { name: 'Porch Grease Sprayer', mode: 'buy', subcat: 'suburban', price: 280, w: 2, h: 1, icon: '🛢️', color: '#18181b', maxHealth: 200, isDefense: true, action: 'OIL', desc: 'Discharges friction-less oil causing slips & falls.' },
    suburban_caltrop_spikes: { name: 'Lawn Caltrop Strip', mode: 'buy', subcat: 'suburban', price: 190, w: 2, h: 1, icon: '📍', color: '#71717a', maxHealth: 150, isDefense: true, desc: 'Concealed tire spikes in lawn turf.' },
    suburban_mailbox_alarm: { name: 'Booby-Trap Mailbox', mode: 'buy', subcat: 'suburban', price: 260, w: 1, h: 1, icon: '📬', color: '#3b82f6', maxHealth: 200, isDefense: true, action: 'MAILBOX', desc: 'Strobe alarm and 911 dispatch notification.' },
    suburban_porch_bunker: { name: 'Porch Sandbag Bunker', mode: 'buy', subcat: 'suburban', price: 390, w: 2, h: 1, icon: '🏖️', color: '#854d0e', maxHealth: 950, isDefense: true, desc: 'Hardened porch ballistic cover.' },
    suburban_pepperball_sentry: { name: 'Yard Sentry Turret', mode: 'buy', subcat: 'suburban', price: 1400, w: 1, h: 1, icon: '🤖', color: '#dc2626', maxHealth: 450, isDefense: true, action: 'SENTRY', desc: 'Motion tracking turret firing pepperballs.' },
    suburban_megaphone_pa: { name: 'Megaphone Roof PA', mode: 'buy', subcat: 'suburban', price: 420, w: 1, h: 1, icon: '📢', color: '#fbbf24', maxHealth: 200, isDefense: true, action: 'MEGAPHONE', desc: 'Blasts "GET OFF MY LAWN" alerts across block.' },
    suburban_strobe_floodlight: { name: 'Strobe Floodlight', mode: 'buy', subcat: 'suburban', price: 340, w: 1, h: 1, icon: '🔦', color: '#fef08a', maxHealth: 180, isDefense: true, action: 'STROBE', desc: '50,000 Lumen blinding strobe spotlight.' },
    suburban_garage_blast_door: { name: 'Garage Blast Shutter', mode: 'buy', subcat: 'suburban', price: 1600, w: 3, h: 1, icon: '🛡️', color: '#334155', maxHealth: 2000, isDefense: true, action: 'SHUTTER', desc: 'Reinforced motorized roll-up steel blast door.' },

    // === BUY MODE: DEFENSES & FORTIFICATIONS ===
    defense_steel_barricade: { name: 'Steel Blast Barricade', mode: 'buy', subcat: 'defense', price: 450, w: 2, h: 1, icon: '🛡️', color: '#475569', maxHealth: 800, isDefense: true, desc: 'Interlocking steel riot wall with vision slits.' },
    defense_keypad_door: { name: 'Keypad Security Door', mode: 'buy', subcat: 'defense', price: 1200, w: 2, h: 1, icon: '🚪', color: '#1e3a8a', maxHealth: 1200, isDefense: true, action: 'KEYPAD', desc: 'High-security PIN keypad entry door.' },
    defense_sandbags: { name: 'Ballistic Sandbags', mode: 'buy', subcat: 'defense', price: 220, w: 2, h: 1, icon: '🧱', color: '#78350f', maxHealth: 500, isDefense: true, desc: 'Military Kevlar-woven sandbag firing berm.' },
    defense_barbed_wire: { name: 'Razor Wire Strip', mode: 'buy', subcat: 'defense', price: 180, w: 2, h: 1, icon: '⛓️', color: '#94a3b8', maxHealth: 350, isDefense: true, desc: 'Sharp perimeter razor ribbon barrier.' },
    defense_tripwire_alarm: { name: 'Laser Tripwire Alarm', mode: 'buy', subcat: 'defense', price: 380, w: 1, h: 1, icon: '🚨', color: '#ef4444', maxHealth: 150, isDefense: true, action: 'ALARM', desc: 'Infrared laser tripwire wired to silent radio alarm.' },
    defense_riot_grate: { name: 'Steel Riot Grate', mode: 'buy', subcat: 'defense', price: 700, w: 2, h: 1, icon: '🔒', color: '#0f172a', maxHealth: 900, isDefense: true, action: 'GRATE', desc: 'Motorized heavy steel security window scissor gate.' },

    // === BUY MODE: GYM & FITNESS ===
    gym_bench_press: { name: '225-lb Olympic Bench Press', mode: 'buy', subcat: 'fitness', price: 650, w: 2, h: 2, icon: '🏋️', color: '#1e293b', action: 'WORKOUT_BENCH', maxHealth: 800, desc: 'Heavy barbell press station. Trains Physical Strength XP & max carry weight.' },
    gym_pullup_bar: { name: 'Titan Grip Pull-Up Rack', mode: 'buy', subcat: 'fitness', price: 280, w: 1, h: 1, icon: '💪', color: '#0f172a', action: 'WORKOUT_PULLUP', maxHealth: 400, desc: 'Wall-mounted multi-grip chin-up & core bar.' },
    gym_punching_bag: { name: 'Heavy Leather Boxing Bag', mode: 'buy', subcat: 'fitness', price: 320, w: 1, h: 1, icon: '🥊', color: '#dc2626', action: 'WORKOUT_BOXING', maxHealth: 600, desc: '100-lb sand-filled punching bag for power strike training.' },
    gym_treadmill: { name: 'Commercial Incline Treadmill', mode: 'buy', subcat: 'fitness', price: 850, w: 2, h: 1, icon: '🏃', color: '#38bdf8', action: 'WORKOUT_TREADMILL', maxHealth: 500, desc: 'High-speed digital incline runner. Builds sprint stamina recovery.' },

    // === BUY MODE: DECOR ===
    indoor_palm: { name: 'Paradise Palm Plant', mode: 'buy', subcat: 'decor', price: 95, w: 1, h: 1, icon: '🌴', color: '#10b981', maxHealth: 80, desc: 'Potted tropical palm plant for fresh aesthetic.' },
    modern_rug: { name: 'Geometric Floor Rug', mode: 'buy', subcat: 'decor', price: 120, w: 3, h: 2, icon: '🧶', color: '#6366f1', maxHealth: 100, desc: 'Modern designer wool area rug.' },
    neon_city_sign: { name: 'Neon "OPEN" Art Sign', mode: 'buy', subcat: 'decor', price: 210, w: 2, h: 1, icon: '💡', color: '#ec4899', maxHealth: 80, desc: 'Retro hot-pink neon wall hanging piece.' }
  },

  // Audio FX Synthesizer
  playAudioFx(type) {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      if (type === 'plop' || type === 'place') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.1);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'eyedropper' || type === 'sample') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'sledgehammer' || type === 'demolish') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'gnome_blast' || type === 'mortar') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(type === 'mortar' ? 450 : 160, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'sprinkler') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'electric_zap') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'shove') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.warn("Audio FX synthesis unavailable", e);
    }
  },

  init() {
    window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;

      const key = e.key.toLowerCase();
      if (key === 'h') {
        this.toggle();
      } else if (!document.getElementById('modal-base-builder')?.classList.contains('hidden')) {
        // Fortnite Fast Building & Edit Hotkeys
        if (key === 'z' || e.code === 'KeyZ') {
          this.selectFortnitePiece('wall');
        } else if (key === 'x' || e.code === 'KeyX') {
          this.selectFortnitePiece('floor');
        } else if (key === 'c' || e.code === 'KeyC') {
          this.selectFortnitePiece('ramp');
        } else if (key === 'v' || e.code === 'KeyV') {
          this.selectFortnitePiece('cone');
        } else if (key === 't' || e.code === 'KeyT') {
          this.selectFortnitePiece('trap');
        } else if (key === 'g' || e.code === 'KeyG') {
          if (this.isEditModeOpen) {
            this.confirmEdit();
          } else {
            this.toggleEditMode();
          }
        } else if (key === '1') {
          this.setMaterial('wood');
        } else if (key === '2') {
          this.setMaterial('brick');
        } else if (key === '3') {
          this.setMaterial('metal');
        } else if (key === 'r') {
          this.rotateSelected();
        } else if (key === 'e') {
          this.setTool('eyedropper');
        } else if (key === 'k') {
          this.setTool('sledgehammer');
        } else if (key === 'p') {
          this.setTool('place');
        } else if (key === 's') {
          this.setTool('shove');
        } else if (e.key === 'PageUp') {
          this.changeFloor(1);
        } else if (e.key === 'PageDown') {
          this.changeFloor(-1);
        } else if (key === 'escape') {
          if (this.isEditModeOpen) {
            this.cancelEdit();
          }
        }
      }
    });

    this.bindCanvasEvents();
  },

  // Fortnite Building Hotbar Methods
  selectFortnitePiece(piece) {
    this.activeFortnitePiece = piece;
    document.querySelectorAll('.fortnite-slot').forEach(s => s.classList.remove('active'));
    document.getElementById(`fortnite-slot-${piece}`)?.classList.add('active');

    if (piece === 'trap') {
      this.selectedCatalogId = 'suburban_caltrop_spikes';
    } else {
      this.selectedCatalogId = `${piece}_fortnite_${this.activeMaterial}`;
    }

    const item = this.catalog[this.selectedCatalogId];
    if (item) {
      this.selectedColor = item.color;
      this.inspectItem(this.selectedCatalogId);
    }
    this.setTool('place');
    this.playAudioFx('sample');
    this.renderGrid();
  },

  setMaterial(mat) {
    this.activeMaterial = mat;
    document.querySelectorAll('.fortnite-mat-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`mat-btn-${mat}`)?.classList.add('active');
    this.playAudioFx('sample');

    if (this.activeFortnitePiece && this.activeFortnitePiece !== 'trap' && this.activeFortnitePiece !== 'edit') {
      this.selectFortnitePiece(this.activeFortnitePiece);
    }
  },

  cycleMaterial() {
    const mats = ['wood', 'brick', 'metal'];
    const nextIdx = (mats.indexOf(this.activeMaterial) + 1) % mats.length;
    this.setMaterial(mats[nextIdx]);
  },

  // Fortnite 3x3 Fast Edit Mode
  toggleEditMode() {
    const popover = document.getElementById('fortnite-edit-popover');
    if (!popover) return;

    this.isEditModeOpen = !this.isEditModeOpen;
    if (this.isEditModeOpen) {
      popover.classList.remove('hidden');
      document.querySelectorAll('.fortnite-slot').forEach(s => s.classList.remove('active'));
      document.getElementById('fortnite-slot-edit')?.classList.add('active');
      this.editTargetObjId = null;

      // Find structure under cursor or closest placed wall/floor
      const target = this.findObjectAt(this.hoverCell.x, this.hoverCell.y) || this.placedObjects[this.placedObjects.length - 1];
      if (target) {
        this.editTargetObjId = target.id;
      }
      this.editTiles = [true, true, true, true, true, true, true, true, true];
      this.refreshEditTilesUI();
      this.playAudioFx('sample');
    } else {
      popover.classList.add('hidden');
      if (this.activeFortnitePiece) {
        this.selectFortnitePiece(this.activeFortnitePiece);
      }
    }
  },

  toggleEditTile(idx) {
    this.editTiles[idx] = !this.editTiles[idx];
    this.playAudioFx('plop');
    this.refreshEditTilesUI();
  },

  applyEditPreset(preset) {
    if (preset === 'door') {
      // Hollow center and bottom-center (indices 4, 7)
      this.editTiles = [true, true, true, true, false, true, true, false, true];
    } else if (preset === 'window') {
      // Hollow center (index 4)
      this.editTiles = [true, true, true, true, false, true, true, true, true];
    } else if (preset === 'half') {
      // Hollow top row (indices 0, 1, 2)
      this.editTiles = [false, false, false, true, true, true, true, true, true];
    } else if (preset === 'arch') {
      // Hollow middle column (indices 1, 4, 7)
      this.editTiles = [true, false, true, true, false, true, true, false, true];
    } else if (preset === 'reset') {
      this.editTiles = [true, true, true, true, true, true, true, true, true];
    }
    this.playAudioFx('sample');
    this.refreshEditTilesUI();
  },

  refreshEditTilesUI() {
    const tiles = document.querySelectorAll('.fortnite-edit-tile');
    tiles.forEach((tile, idx) => {
      if (this.editTiles[idx]) {
        tile.classList.add('solid');
        tile.classList.remove('hollow');
      } else {
        tile.classList.remove('solid');
        tile.classList.add('hollow');
      }
    });
  },

  confirmEdit() {
    const hollowCount = this.editTiles.filter(t => !t).length;
    let target = this.placedObjects.find(o => o.id === this.editTargetObjId);
    if (!target && this.placedObjects.length > 0) {
      target = this.placedObjects[this.placedObjects.length - 1];
    }

    if (target) {
      const def = this.catalog[target.catalogId];
      if (hollowCount === 0) {
        // Reset to full piece
      } else if (this.editTiles[4] === false && this.editTiles[7] === false) {
        // Doorway edit
        target.catalogId = 'door_wood';
        target.color = '#854d0e';
      } else if (this.editTiles[4] === false) {
        // Window edit
        target.catalogId = 'window_single';
        target.color = '#38bdf8';
      } else if (!this.editTiles[0] && !this.editTiles[1] && !this.editTiles[2]) {
        // Half-wall
        target.catalogId = 'wall_drywall';
        target.color = '#cbd5e1';
      } else if (!this.editTiles[1] && !this.editTiles[4] && !this.editTiles[7]) {
        // Archway
        target.catalogId = 'archway_open';
        target.color = '#cbd5e1';
      }
      this.triggerCanvasFx('blast', target.gridX, target.gridY, '#38bdf8');
    }

    this.playAudioFx('plop');
    this.toggleEditMode();
    this.renderGrid();
  },

  cancelEdit() {
    const popover = document.getElementById('fortnite-edit-popover');
    if (popover) popover.classList.add('hidden');
    this.isEditModeOpen = false;
    this.selectFortnitePiece(this.activeFortnitePiece || 'wall');
  },

  open(propertyId = 'apt_101') {
    this.switchProperty(propertyId);
    document.getElementById('modal-base-builder')?.classList.remove('hidden');
    this.setModeCategory('build', 'walls');
    this.updateStatsHUD();
    this.renderGrid();
  },

  close() {
    document.getElementById('modal-base-builder')?.classList.add('hidden');
  },

  toggle() {
    const el = document.getElementById('modal-base-builder');
    if (el) {
      if (el.classList.contains('hidden')) {
        this.open();
      } else {
        this.close();
      }
    }
  },

  switchProperty(propertyId) {
    this.activePropertyId = propertyId;
    const propSelect = document.getElementById('builder-property-select');
    if (propSelect && propSelect.value !== propertyId) {
      propSelect.value = propertyId;
    }

    // Grid sizing based on MLO property footprint
    if (propertyId === 'mlo_industrial_warehouse' || propertyId === 'mlo_suburban_ranch' || propertyId === 'mlo_underground_bunker') {
      this.gridSize = 16;
      this.cellSize = 28;
    } else if (propertyId === 'mlo_downtown_storefront' || propertyId === 'mlo_dockside_garage') {
      this.gridSize = 14;
      this.cellSize = 32;
    } else {
      this.gridSize = 12;
      this.cellSize = 36;
    }

    this.placedObjects = this.mloLayouts[propertyId] || [];
    this.roomZones = {};

    const titleEl = document.getElementById('builder-canvas-title');
    if (titleEl) {
      const names = {
        apt_101: '🏢 Harborview Apt 101 MLO',
        mlo_industrial_warehouse: '🏭 Pier 9 Open Warehouse MLO',
        mlo_suburban_ranch: '🏡 Suburban Ranch House MLO',
        mlo_downtown_storefront: '🏪 Downtown Storefront & Loft MLO',
        mlo_dockside_garage: '🔧 Harbor Chop Shop Garage MLO',
        mlo_underground_bunker: '🛡️ Underground Fallout Bunker MLO'
      };
      titleEl.textContent = names[propertyId] || '🏠 Open MLO Base';
    }

    this.updateStatsHUD();
    this.renderGrid();
  },

  changeFloor(delta) {
    this.activeFloorIndex = Math.max(-1, Math.min(2, this.activeFloorIndex + delta));
    const names = { '-1': 'B1 (Bunker)', '0': 'FL 1 (Ground)', '1': 'FL 2 (Loft)', '2': 'FL 3 (Roof)' };
    const badge = document.getElementById('builder-floor-badge');
    if (badge) badge.textContent = names[this.activeFloorIndex] || 'FL 1';
    this.playAudioFx('sample');
    this.renderGrid();
  },

  setCutawayMode(mode) {
    this.cutawayMode = mode;
    document.querySelectorAll('.btn-segment').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-cutaway-${mode === 'cutaway' ? 'cut' : mode}`)?.classList.add('active');
    this.renderGrid();
  },

  togglePerspective() {
    this.isIsometric = !this.isIsometric;
    const btn = document.getElementById('btn-toggle-view-mode');
    const badge = document.getElementById('builder-view-badge');

    if (this.isIsometric) {
      if (btn) btn.textContent = '📐 2D Top-Down View';
      if (badge) badge.textContent = '[3D Isometric Sims Mode]';
      this.playAudioFx('sample');
    } else {
      if (btn) btn.textContent = '🎲 3D Isometric View';
      if (badge) badge.textContent = '[2D Top-Down Mode]';
      this.playAudioFx('sample');
    }
    this.renderGrid();
  },

  rotateCamera() {
    this.cameraAngle = (this.cameraAngle + 90) % 360;
    this.playAudioFx('shove');
    this.renderGrid();
  },

  setTool(tool) {
    this.activeTool = tool;
    document.querySelectorAll('.builder-tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tool-btn-${tool}`)?.classList.add('active');

    const overlay = document.getElementById('builder-canvas-info-overlay');
    if (overlay) {
      const msgs = {
        place: '🔨 Place Mode: Left-click grid to place item | [R] Rotate piece',
        eyedropper: '💧 Pipette / Eyedropper: Click any placed item or floor to clone & sample it!',
        sledgehammer: '💥 Demolish / Sledgehammer: Click any item to demolish for 70% cash refund!',
        shove: '🖐️ Shove / Drag: Click heavy furniture, then click new tile to shove & barricade entrances!',
        zone: '🏷️ Room Zone Painter: Click grid squares to designate room zone types (Living, Lab, Armory, etc.)',
        rotate: '🔄 Rotate 90°: Rotates active blueprint placement piece',
        interact: '🎯 Test & Trigger: Click traps, flippable barricades, or security keypads to trigger them!'
      };
      overlay.textContent = msgs[tool] || 'Left-click to interact';
    }
  },

  setModeCategory(mode, subcat = null) {
    this.activeMode = mode;
    document.querySelectorAll('.builder-main-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-mode-${mode}`)?.classList.add('active');

    const subcats = this.subcategories[mode] || [];
    const pillContainer = document.getElementById('builder-subcategory-pills');
    if (pillContainer) {
      pillContainer.innerHTML = '';
      subcats.forEach((sc, idx) => {
        const pill = document.createElement('button');
        pill.className = `builder-subcat-pill ${(subcat ? sc.id === subcat : idx === 0) ? 'active' : ''}`;
        pill.textContent = sc.name;
        pill.onclick = () => {
          document.querySelectorAll('.builder-subcat-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.activeSubcategory = sc.id;
          this.renderCatalogTray(sc.id);
        };
        pillContainer.appendChild(pill);
      });
    }

    const firstSubcat = subcat || (subcats[0] ? subcats[0].id : 'walls');
    this.activeSubcategory = firstSubcat;
    this.renderCatalogTray(firstSubcat);
  },

  renderCatalogTray(subcategory) {
    const tray = document.getElementById('builder-catalog-grid');
    if (!tray) return;
    tray.innerHTML = '';

    const items = Object.entries(this.catalog).filter(([k, v]) => v.subcat === subcategory);

    items.forEach(([id, item]) => {
      const card = document.createElement('div');
      card.className = `builder-catalog-card ${this.selectedCatalogId === id ? 'selected' : ''}`;
      card.innerHTML = `
        <div style="font-size:22px;">${item.icon}</div>
        <div style="font-size:11px; font-weight:700; color:#fff; text-align:center; margin-top:2px;">${item.name}</div>
        <div style="font-size:11px; color:var(--accent-emerald); font-weight:700; margin-top:1px;">$${item.price}</div>
        ${item.maxHealth ? `<div style="font-size:9px; color:var(--accent-cyan);">🛡️ ${item.maxHealth} HP</div>` : ''}
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.builder-catalog-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedCatalogId = id;
        this.selectedColor = item.color;
        this.inspectItem(id);
        this.setTool('place');
        this.playAudioFx('sample');
        this.renderGrid();
      });

      tray.appendChild(card);
    });

    if (items.length > 0 && (!this.selectedCatalogId || !this.catalog[this.selectedCatalogId] || this.catalog[this.selectedCatalogId].subcat !== subcategory)) {
      this.selectedCatalogId = items[0][0];
      this.inspectItem(items[0][0]);
    }
  },

  inspectItem(id) {
    const item = this.catalog[id];
    if (!item) return;
    const nameEl = document.getElementById('inspector-name');
    const priceEl = document.getElementById('inspector-price');
    const descEl = document.getElementById('inspector-desc');
    const metaEl = document.getElementById('inspector-meta');

    if (nameEl) nameEl.textContent = item.name;
    if (priceEl) priceEl.textContent = `$${item.price}`;
    if (descEl) descEl.textContent = item.desc || 'Architectural piece.';
    if (metaEl) {
      metaEl.innerHTML = `
        <span>📐 Size: ${item.w}x${item.h}</span>
        ${item.maxHealth ? `<span>🛡️ HP: ${item.maxHealth}</span>` : ''}
        ${item.action ? `<span>⚡ Action: ${item.action}</span>` : ''}
      `;
    }
  },

  rotateSelected() {
    this.selectedRotation = (this.selectedRotation + 90) % 360;
    const badge = document.getElementById('builder-rot-badge');
    if (badge) badge.textContent = `${this.selectedRotation}°`;
    this.playAudioFx('sample');
    this.renderGrid();
  },

  cycleRoomZone() {
    this.currentZoneIndex = (this.currentZoneIndex + 1) % this.zoneTypes.length;
    const cur = this.zoneTypes[this.currentZoneIndex];
    this.setTool('zone');
    this.playAudioFx('sample');
    alert(`🏷️ Selected Room Zone: ${cur.name}. Left-click grid squares to paint floor zones!`);
  },

  clearBase() {
    if (confirm("⚠️ Are you sure you want to clear this entire base floor? All objects will be sold for a 70% refund.")) {
      const refund = this.placedObjects.reduce((acc, o) => {
        const d = this.catalog[o.catalogId];
        return acc + Math.floor((d ? d.price : 50) * 0.7);
      }, 0);

      const char = window.CityUndergroundCore?.activeState.character;
      if (char) {
        char.bank += refund;
        window.HUD?.updateStats(char);
      }

      this.placedObjects = [];
      this.roomZones = {};
      this.playAudioFx('sledgehammer');
      this.updateStatsHUD();
      this.renderGrid();
      alert(`Cleared floor layout. Total 70% refund of +$${refund.toLocaleString()} deposited to bank!`);
    }
  },

  bindCanvasEvents() {
    const canvas = document.getElementById('builder-floor-canvas');
    if (!canvas) return;

    // Prevent context menu to allow right-click material toggle
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.cycleMaterial();
    });

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left Click
        this.isMouseDown = true;
        if (this.activeTool === 'place') {
          this.placeItemAtHover();
          this.lastBuiltCell = { x: this.hoverCell.x, y: this.hoverCell.y };
        } else if (this.activeTool === 'eyedropper') {
          this.eyedropperItemAtHover();
        } else if (this.activeTool === 'sledgehammer') {
          this.demolishItemAtHover();
        } else if (this.activeTool === 'shove') {
          this.shoveItemAtHover();
        } else if (this.activeTool === 'zone') {
          this.roomZones[`${this.hoverCell.x},${this.hoverCell.y}`] = this.currentZoneIndex;
          this.playAudioFx('sample');
          this.renderGrid();
        } else if (this.activeTool === 'interact') {
          this.interactItemAtHover();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.lastBuiltCell = { x: -1, y: -1 };
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / this.cellSize);
      const y = Math.floor((e.clientY - rect.top) / this.cellSize);
      const newCell = { x: Math.max(0, Math.min(this.gridSize - 1, x)), y: Math.max(0, Math.min(this.gridSize - 1, y)) };

      const cellChanged = (newCell.x !== this.hoverCell.x || newCell.y !== this.hoverCell.y);
      this.hoverCell = newCell;

      // Turbo Building: Dragging left click places piece across each new cell
      if (this.isMouseDown && this.activeTool === 'place' && cellChanged) {
        if (this.hoverCell.x !== this.lastBuiltCell.x || this.hoverCell.y !== this.lastBuiltCell.y) {
          this.placeItemAtHover();
          this.lastBuiltCell = { x: this.hoverCell.x, y: this.hoverCell.y };
        }
      }

      this.renderGrid();
    });
  },

  placeItemAtHover() {
    const def = this.catalog[this.selectedCatalogId];
    if (!def) return;

    // Verify Real Estate Deed Ownership
    if (window.Property && !window.Property.isOwned(this.activePropertyId)) {
      const reg = window.Property.registry[this.activePropertyId];
      const name = reg ? reg.name : 'this property';
      const price = reg ? reg.buyPrice : 50000;
      const rent = reg ? reg.rentPrice : 500;

      const confirmBuy = confirm(`🔒 UNOWNED REAL ESTATE DEED!\n\nYou must own or lease "${name}" before building bases here.\n\n• Buy Deed: $${price.toLocaleString()}\n• Monthly Lease: $${rent.toLocaleString()}/mo\n\nWould you like to purchase the deed now?`);
      if (confirmBuy) {
        window.Property.buy(this.activePropertyId);
      }
      return;
    }

    const char = window.CityUndergroundCore?.activeState.character;
    if (char && char.bank < def.price) {
      alert("Insufficient funds in bank account to purchase this piece!");
      return;
    }

    // Enforce maxPerProperty limit (e.g. 1 Work Bench, 1 Crafting Bench per house)
    if (def.maxPerProperty) {
      const currentCount = this.placedObjects.filter(o => o.catalogId === this.selectedCatalogId).length;
      if (currentCount >= def.maxPerProperty) {
        alert(`⚠️ PROPERTY LIMIT REACHED!\n\nYou can only place ${def.maxPerProperty} ${def.name} per house/property!`);
        return;
      }
    }

    let w = (this.selectedRotation === 90 || this.selectedRotation === 270) ? def.h : def.w;
    let h = (this.selectedRotation === 90 || this.selectedRotation === 270) ? def.w : def.h;

    if (this.hoverCell.x + w > this.gridSize || this.hoverCell.y + h > this.gridSize) {
      alert("Cannot place outside property perimeter bounds!");
      return;
    }

    if (char) {
      char.bank -= def.price;
      window.HUD?.updateStats(char);
    }

    const newObj = {
      id: 'obj_' + this.selectedCatalogId + '_' + Date.now(),
      catalogId: this.selectedCatalogId,
      gridX: this.hoverCell.x,
      gridY: this.hoverCell.y,
      rotation: this.selectedRotation,
      color: this.selectedColor || def.color,
      pin: def.action === 'KEYPAD' ? '1234' : undefined,
      health: def.maxHealth || 500
    };

    this.placedObjects.push(newObj);
    this.playAudioFx('plop');
    this.triggerCanvasFx('place', this.hoverCell.x, this.hoverCell.y, def.color || '#38bdf8');
    this.updateStatsHUD();
    this.renderGrid();

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Base_PlaceObject', {
        propId: this.activePropertyId,
        catalogId: this.selectedCatalogId,
        gridX: this.hoverCell.x,
        gridY: this.hoverCell.y,
        rotation: this.selectedRotation,
        color: this.selectedColor || def.color
      });
    }
  },

  eyedropperItemAtHover() {
    const clicked = this.findObjectAt(this.hoverCell.x, this.hoverCell.y);
    if (clicked) {
      this.selectedCatalogId = clicked.catalogId;
      this.selectedRotation = clicked.rotation || 0;
      this.selectedColor = clicked.color;
      this.inspectItem(clicked.catalogId);
      this.setTool('place');
      this.playAudioFx('eyedropper');
      this.triggerCanvasFx('sample', clicked.gridX, clicked.gridY, '#00f2fe');
      alert(`💧 Pipette Sampled: "${this.catalog[clicked.catalogId]?.name || 'Object'}"! Ready to clone and place.`);
      this.renderGrid();
    }
  },

  demolishItemAtHover() {
    const clicked = this.findObjectAt(this.hoverCell.x, this.hoverCell.y);
    if (!clicked) return;

    const def = this.catalog[clicked.catalogId];
    const refund = Math.floor((def ? def.price : 100) * 0.7);

    const char = window.CityUndergroundCore?.activeState.character;
    if (char) {
      char.bank += refund;
      window.HUD?.updateStats(char);
    }

    this.placedObjects = this.placedObjects.filter(o => o.id !== clicked.id);
    this.playAudioFx('sledgehammer');
    this.triggerCanvasFx('blast', clicked.gridX, clicked.gridY, '#ef4444');
    this.updateStatsHUD();
    this.renderGrid();
    alert(`💥 Demolished ${def ? def.name : 'Structure'} for a 70% refund of +$${refund}!`);

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Base_RemoveObject', {
        propId: this.activePropertyId,
        objId: clicked.id
      });
    }
  },

  shoveItemAtHover() {
    if (this.draggedObjId) {
      const obj = this.placedObjects.find(o => o.id === this.draggedObjId);
      if (obj) {
        const def = this.catalog[obj.catalogId];
        let w = (obj.rotation === 90 || obj.rotation === 270) ? def.h : def.w;
        let h = (obj.rotation === 90 || obj.rotation === 270) ? def.w : def.h;

        if (this.hoverCell.x + w <= this.gridSize && this.hoverCell.y + h <= this.gridSize) {
          obj.gridX = this.hoverCell.x;
          obj.gridY = this.hoverCell.y;
          this.playAudioFx('shove');
          this.triggerCanvasFx('shove', obj.gridX, obj.gridY, '#38bdf8');
          alert(`🖐️ *SCREECH!* Shoved & dragged ${def.name} against entrance/hallway boundary!`);

          if (window.CityUndergroundCore) {
            window.CityUndergroundCore.sendEvent('CU_Base_MoveObject', {
              propId: this.activePropertyId,
              objId: obj.id,
              newGridX: obj.gridX,
              newGridY: obj.gridY,
              newRotation: obj.rotation
            });
          }
        }
      }
      this.draggedObjId = null;
      this.renderGrid();
    } else {
      const clicked = this.findObjectAt(this.hoverCell.x, this.hoverCell.y);
      if (clicked) {
        this.draggedObjId = clicked.id;
        this.playAudioFx('shove');
        alert(`🖐️ Selected "${this.catalog[clicked.catalogId]?.name || 'Furniture'}". Click any target grid square to shove it against a door!`);
        this.renderGrid();
      }
    }
  },

  interactItemAtHover() {
    const clicked = this.findObjectAt(this.hoverCell.x, this.hoverCell.y);
    if (!clicked) return;

    const def = this.catalog[clicked.catalogId];
    if (!def) return;

    if (window.CityUndergroundCore) {
      window.CityUndergroundCore.sendEvent('CU_Base_InteractObject', {
        propId: this.activePropertyId,
        objId: clicked.id,
        actionType: def.action || ''
      });
    }

    if (def.action === 'FLIP_STAND') {
      this.playAudioFx('shove');
      clicked.isFlipped = !clicked.isFlipped;
      this.triggerCanvasFx('blast', clicked.gridX, clicked.gridY, '#78350f');
      alert(`📚 *THUMP!* Heavy Oak Bookshelf flipped into: ${clicked.isFlipped ? 'UPRIGHT BARRICADE (1,500 HP Corridor Seal) 🛡️' : 'Normal Bookshelf'}`);
    } else if (def.action === 'FLIP_TABLE') {
      this.playAudioFx('shove');
      clicked.isFlipped = !clicked.isFlipped;
      this.triggerCanvasFx('blast', clicked.gridX, clicked.gridY, '#451a03');
      alert(`🪑 *CRUNCH!* Steel Table kicked on its side into: ${clicked.isFlipped ? 'GUN-SHIELD BUNKER (1,100 HP Firing Cover) 🛡️' : 'Normal Dining Table'}`);
    } else if (def.action === 'JAM_DOOR') {
      this.playAudioFx('shove');
      clicked.isJammed = !clicked.isJammed;
      alert(`🛑 Titanium Door Jammer Wedge: ${clicked.isJammed ? 'ENGAGED & KICKED UNDER DOOR 🛑 (Lockpicked Doors Cannot Open!)' : 'DISENGAGED'}`);
    } else if (def.action === 'TEST_STUN_RIG') {
      this.playAudioFx('electric_zap');
      this.triggerCanvasFx('electric', clicked.gridX, clicked.gridY, '#eab308');
      alert("⚡ ZZZZZT! Anti-Lockpick Handle Stun Rig discharged 10,000V capacitor shock! Lockpicks snap on contact!");
    } else if (def.action === 'TEST_FLASH_RIG') {
      this.playAudioFx('mortar');
      this.triggerCanvasFx('blast', clicked.gridX, clicked.gridY, '#f97316');
      alert("💥 *FLASH-BANG!* Door-Mounted Flashbang Rig popped! Blinding flash fills doorway!");
    } else if (def.action === 'TEST_DROP_TRAP') {
      this.playAudioFx('sledgehammer');
      this.triggerCanvasFx('blast', clicked.gridX, clicked.gridY, '#475569');
      alert("🗄️ *CRASH-BAM!* Tilted Heavy Filing Cabinet collapsed onto doorway! Deals 80 crushing damage to raiders!");
    } else if (def.action === 'GNOME') {
      this.playAudioFx('gnome_blast');
      this.triggerCanvasFx('blast', clicked.gridX, clicked.gridY, '#e11d48');
      alert("🧙‍♂️💥 BOOM! Tactical Claymore Lawn Gnome detonated directional blast! Inflicted 95 blast damage!");
    } else if (def.action === 'SPRINKLER') {
      this.playAudioFx('sprinkler');
      this.triggerCanvasFx('water', clicked.gridX, clicked.gridY, '#06b6d4');
      alert("💦 PSH-PSH-PSHHHH! High-Pressure Pepper Sprinkler activated! Caustic teargas mist covers 360° yard arc!");
    } else if (def.action === 'FIREWORKS') {
      this.playAudioFx('mortar');
      this.triggerCanvasFx('blast', clicked.gridX, clicked.gridY, '#f59e0b');
      alert("🎆 *SCREEECH-POP!* Tripwire Mortar Battery fired rapid pyrotechnic salvo at trespassers!");
    } else if (def.action === 'VOLTAGE') {
      this.playAudioFx('electric_zap');
      clicked.isEnergized = !clicked.isEnergized;
      this.triggerCanvasFx('electric', clicked.gridX, clicked.gridY, '#eab308');
      alert(`⚡ Electrified Picket Gate capacitor: ${clicked.isEnergized ? 'ENERGIZED (5,000V) ⚡' : 'DE-ENERGIZED'}`);
    } else if (def.action === 'KEYPAD') {
      window.KeypadTerminal?.open(clicked.id, clicked.pin || "1234", () => {
        alert("🔓 Access granted through Keypad Security Door!");
      });
    } else if (def.action === 'REST') {
      const char = window.CityUndergroundCore?.activeState.character;
      if (char) {
        char.health = 100;
        window.HUD?.updateStats(char);
      }
      alert("🛏️ Rested comfortably in Plush Bed. Health fully restored to 100%!");
    } else if (def.action === 'SYNTH') {
      window.CrimeLab?.openSynth();
    } else if (def.action === 'BOTANY') {
      window.BotanyUI?.open();
    } else if (def.action === 'STASH') {
      window.StorageContainer?.open("Secure Storage Stash", 80.0);
    } else if (def.action === 'WORKOUT_BENCH') {
      window.Workout?.open('bench');
    } else if (def.action === 'WORKOUT_BOXING') {
      window.Workout?.open('punching_bag');
    } else if (def.action === 'WORKOUT_TREADMILL') {
      window.Workout?.open('treadmill');
    } else if (def.action === 'WORKOUT_PULLUP') {
      window.Workout?.open('bench');
    } else if (def.action === 'OPEN_WORKBENCH') {
      window.CraftingBenchUI?.open('workbench');
    } else if (def.action === 'OPEN_CRAFTING_BENCH' || def.action === 'CRAFT') {
      window.CraftingBenchUI?.open('crafting_bench');
    } else if (def.action === 'OPEN_COOKING_STOVE' || def.action === 'COOK') {
      window.CookingStoveUI?.open();
    } else if (def.action === 'SIT_CHAIR' || def.isChair) {
      window.ChairSystem?.toggleSit(clicked.id, clicked);
    }

    this.renderGrid();
  },

  triggerCanvasFx(type, gx, gy, color) {
    this.activeFxList.push({
      type: type,
      gx: gx,
      gy: gy,
      color: color,
      radius: 4,
      maxRadius: 55,
      opacity: 1.0
    });
    this.renderGrid();
  },

  findObjectAt(gx, gy) {
    return this.placedObjects.find(obj => {
      const def = this.catalog[obj.catalogId];
      if (!def) return false;
      let w = (obj.rotation === 90 || obj.rotation === 270) ? def.h : def.w;
      let h = (obj.rotation === 90 || obj.rotation === 270) ? def.w : def.h;
      return gx >= obj.gridX && gx < obj.gridX + w && gy >= obj.gridY && gy < obj.gridY + h;
    });
  },

  updateStatsHUD() {
    const totalValue = this.placedObjects.reduce((acc, o) => {
      const d = this.catalog[o.catalogId];
      return acc + (d ? d.price : 0);
    }, 0);

    const valEl = document.getElementById('builder-property-value');
    if (valEl) valEl.textContent = `$${totalValue.toLocaleString()}`;

    const countEl = document.getElementById('builder-item-count');
    if (countEl) countEl.textContent = `${this.placedObjects.length} Objects`;
  },

  renderGrid() {
    const canvas = document.getElementById('builder-floor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (this.isIsometric) {
      // ================= 3D ISOMETRIC SIMS PERSPECTIVE ENGINE =================
      const originX = width / 2;
      const originY = 60;
      const isoW = Math.min(16, Math.floor(200 / this.gridSize));
      const isoH = Math.floor(isoW * 0.55);

      const toIso = (gx, gy) => ({
        x: originX + (gx - gy) * isoW,
        y: originY + (gx + gy) * isoH
      });

      // 1. Draw Diamond Grid Tiles
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          const pt = toIso(x, y);

          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pt.x + isoW, pt.y + isoH);
          ctx.lineTo(pt.x, pt.y + isoH * 2);
          ctx.lineTo(pt.x - isoW, pt.y + isoH);
          ctx.closePath();

          const zoneIdx = this.roomZones[`${x},${y}`];
          if (zoneIdx !== undefined && this.zoneTypes[zoneIdx]) {
            ctx.fillStyle = this.zoneTypes[zoneIdx].color;
          } else {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#1e293b' : '#0f172a';
          }
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // 2. Depth Sort & Render Objects
      const sorted = [...this.placedObjects].sort((a, b) => (a.gridX + a.gridY) - (b.gridX + b.gridY));

      sorted.forEach(obj => {
        const def = this.catalog[obj.catalogId];
        if (!def) return;

        let w = (obj.rotation === 90 || obj.rotation === 270) ? def.h : def.w;
        let h = (obj.rotation === 90 || obj.rotation === 270) ? def.w : def.h;

        const pt = toIso(obj.gridX, obj.gridY);
        let prismHeight = 16;

        if (def.isWall || def.isDoor || def.isWindow) {
          if (this.cutawayMode === 'down') {
            prismHeight = 3;
          } else if (this.cutawayMode === 'cutaway') {
            // Cut down foreground walls
            prismHeight = (obj.gridX > this.gridSize / 2 || obj.gridY > this.gridSize / 2) ? 8 : 32;
          } else {
            prismHeight = 34; // Walls Up Full
          }
        } else if (def.isDefense || def.action === 'FLIP_STAND') {
          prismHeight = 22;
        } else if (def.isRamp || def.isCone) {
          prismHeight = 24;
        }

        const topPt = { x: pt.x, y: pt.y - prismHeight };

        if (def.isCone) {
          // 3D Isometric Pyramid / Cone
          const apex = { x: pt.x + isoW * (h - w) / 2, y: pt.y + isoH * (w + h) / 2 - prismHeight * 1.4 };
          const p1 = { x: pt.x, y: pt.y };
          const p2 = { x: pt.x + isoW * h, y: pt.y + isoH * h };
          const p3 = { x: pt.x + isoW * (h - w), y: pt.y + isoH * (w + h) };
          const p4 = { x: pt.x - isoW * w, y: pt.y + isoH * w };

          // Front-Left Face
          ctx.beginPath();
          ctx.moveTo(p4.x, p4.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(apex.x, apex.y);
          ctx.closePath();
          ctx.fillStyle = obj.color || def.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.stroke();

          // Front-Right Face
          ctx.beginPath();
          ctx.moveTo(p3.x, p3.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(apex.x, apex.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.stroke();

        } else if (def.isRamp) {
          // 3D Isometric Wedge / Ramp
          const pBaseL = { x: pt.x - isoW * w, y: pt.y + isoH * w };
          const pBaseB = { x: pt.x, y: pt.y + isoH * (w + h) };
          const pBaseR = { x: pt.x + isoW * h, y: pt.y + isoH * h };
          const pTop = { x: pt.x, y: pt.y - prismHeight };
          const pTopR = { x: pt.x + isoW * h, y: pt.y + isoH * h - prismHeight };

          // Ramp Sloped Surface
          ctx.beginPath();
          ctx.moveTo(pBaseL.x, pBaseL.y);
          ctx.lineTo(pBaseB.x, pBaseB.y);
          ctx.lineTo(pTopR.x, pTopR.y);
          ctx.lineTo(pTop.x, pTop.y);
          ctx.closePath();
          ctx.fillStyle = obj.color || def.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Triangular Side Flank
          ctx.beginPath();
          ctx.moveTo(pBaseB.x, pBaseB.y);
          ctx.lineTo(pBaseR.x, pBaseR.y);
          ctx.lineTo(pTopR.x, pTopR.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fill();
          ctx.stroke();

        } else {
          // Standard Isometric 3D Prism
          // Left Face
          ctx.beginPath();
          ctx.moveTo(pt.x - isoW * w, pt.y + isoH * w);
          ctx.lineTo(pt.x, pt.y + isoH * (w + h));
          ctx.lineTo(topPt.x, topPt.y + isoH * (w + h));
          ctx.lineTo(topPt.x - isoW * w, topPt.y + isoH * w);
          ctx.closePath();
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.fill();

          // Right Face
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y + isoH * (w + h));
          ctx.lineTo(pt.x + isoW * h, pt.y + isoH * h);
          ctx.lineTo(topPt.x + isoW * h, topPt.y + isoH * h);
          ctx.lineTo(topPt.x, topPt.y + isoH * (w + h));
          ctx.closePath();
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fill();

          // Top Cap Diamond
          ctx.beginPath();
          ctx.moveTo(topPt.x, topPt.y);
          ctx.lineTo(topPt.x + isoW * h, topPt.y + isoH * h);
          ctx.lineTo(topPt.x + isoW * (h - w), topPt.y + isoH * (w + h));
          ctx.lineTo(topPt.x - isoW * w, topPt.y + isoH * w);
          ctx.closePath();

          ctx.fillStyle = obj.color || def.color;
          ctx.fill();
          ctx.strokeStyle = def.isDefense ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Floating Icon
        ctx.fillStyle = '#fff';
        ctx.font = '13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(def.icon, topPt.x + isoW * (h - w) / 2, topPt.y + isoH * (w + h) / 2);

        // Health Bar
        if ((def.isDefense || def.mat) && def.maxHealth) {
          const hpPct = Math.max(0, Math.min(1, (obj.health || def.maxHealth) / def.maxHealth));
          const hbx = topPt.x - 12;
          const hby = topPt.y + 4;
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(hbx, hby, 24, 3);
          ctx.fillStyle = hpPct > 0.4 ? '#10b981' : '#ef4444';
          ctx.fillRect(hbx, hby, 24 * hpPct, 3);
        }
      });

      // Hover Diamond Preview
      if (this.activeTool === 'place' || this.activeTool === 'zone') {
        const pt = toIso(this.hoverCell.x, this.hoverCell.y);
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x + isoW, pt.y + isoH);
        ctx.lineTo(pt.x, pt.y + isoH * 2);
        ctx.lineTo(pt.x - isoW, pt.y + isoH);
        ctx.closePath();
        ctx.fillStyle = this.activeTool === 'zone' ? this.zoneTypes[this.currentZoneIndex].color : 'rgba(16, 185, 129, 0.5)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

    } else {
      // ================= 2D TOP-DOWN PRECISION GRID ENGINE =================
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          const px = x * this.cellSize;
          const py = y * this.cellSize;

          const zoneIdx = this.roomZones[`${x},${y}`];
          if (zoneIdx !== undefined && this.zoneTypes[zoneIdx]) {
            ctx.fillStyle = this.zoneTypes[zoneIdx].color;
          } else {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#1e293b' : '#0f172a';
          }
          ctx.fillRect(px, py, this.cellSize, this.cellSize);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, this.cellSize, this.cellSize);
        }
      }

      // Placed Objects
      this.placedObjects.forEach(obj => {
        const def = this.catalog[obj.catalogId];
        if (!def) return;

        let w = (obj.rotation === 90 || obj.rotation === 270) ? def.h : def.w;
        let h = (obj.rotation === 90 || obj.rotation === 270) ? def.w : def.h;

        let slideY = 0;
        if (window.ChairSystem && window.ChairSystem.seatedChairId === obj.id) {
          slideY = window.ChairSystem.slideOffset;
        }

        const px = obj.gridX * this.cellSize;
        const py = obj.gridY * this.cellSize + slideY;
        const pw = w * this.cellSize;
        const ph = h * this.cellSize;

        ctx.shadowColor = obj.color || def.color;
        ctx.shadowBlur = def.isDefense ? 10 : 4;
        ctx.fillStyle = obj.color || def.color;
        ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);

        // Ramp Slope Lines (2D)
        if (def.isRamp) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(px + 4, py + ph / 2, pw - 8, ph / 2 - 4);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.moveTo(px + 4, py + ph / 2);
          ctx.lineTo(px + pw - 4, py + ph / 2);
          ctx.stroke();
        }

        // Cone Pyramid Diagonal Lines (2D)
        if (def.isCone) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.moveTo(px + 2, py + 2);
          ctx.lineTo(px + pw - 2, py + ph - 2);
          ctx.moveTo(px + pw - 2, py + 2);
          ctx.lineTo(px + 2, py + ph - 2);
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.strokeStyle = def.isDefense ? 'rgba(56, 189, 248, 0.7)' : (window.ChairSystem && window.ChairSystem.seatedChairId === obj.id ? '#10b981' : 'rgba(255, 255, 255, 0.3)');
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, py + 2, pw - 4, ph - 4);

        // Icon or Seated Player
        ctx.fillStyle = '#fff';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (window.ChairSystem && window.ChairSystem.seatedChairId === obj.id && window.ChairSystem.isSeated) {
          ctx.fillText('🧍', px + pw / 2, py + ph / 2);
        } else {
          ctx.fillText(def.icon, px + pw / 2, py + ph / 2);
        }

        // Health Bar
        if ((def.isDefense || def.mat) && def.maxHealth) {
          const hpPct = Math.max(0, Math.min(1, (obj.health || def.maxHealth) / def.maxHealth));
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(px + 4, py + ph - 6, pw - 8, 3);
          ctx.fillStyle = hpPct > 0.4 ? '#10b981' : '#ef4444';
          ctx.fillRect(px + 4, py + ph - 6, (pw - 8) * hpPct, 3);
        }

        if (obj.isEnergized) {
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.9)';
          ctx.lineWidth = 2;
          ctx.strokeRect(px - 2, py - 2, pw + 4, ph + 4);
        }
      });

      // Trap & Placement Particles
      for (let i = this.activeFxList.length - 1; i >= 0; i--) {
        const fx = this.activeFxList[i];
        const cx = fx.gx * this.cellSize + this.cellSize / 2;
        const cy = fx.gy * this.cellSize + this.cellSize / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, fx.radius, 0, Math.PI * 2);
        ctx.strokeStyle = fx.color || '#e11d48';
        ctx.lineWidth = 3;
        ctx.globalAlpha = fx.opacity;
        ctx.stroke();

        if (fx.type === 'water') {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.fill();
        } else if (fx.type === 'blast') {
          ctx.fillStyle = 'rgba(225, 29, 72, 0.25)';
          ctx.fill();
        } else if (fx.type === 'electric') {
          ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
          ctx.fill();
        }
        ctx.restore();

        fx.radius += 7;
        fx.opacity -= 0.12;

        if (fx.opacity <= 0 || fx.radius >= fx.maxRadius) {
          this.activeFxList.splice(i, 1);
        }
      }

      // Hover Placement Preview
      if (this.activeTool === 'place') {
        const def = this.catalog[this.selectedCatalogId];
        if (def) {
          let w = (this.selectedRotation === 90 || this.selectedRotation === 270) ? def.h : def.w;
          let h = (this.selectedRotation === 90 || this.selectedRotation === 270) ? def.w : def.h;

          const px = this.hoverCell.x * this.cellSize;
          const py = this.hoverCell.y * this.cellSize;
          const pw = w * this.cellSize;
          const ph = h * this.cellSize;

          const isValid = (this.hoverCell.x + w <= this.gridSize && this.hoverCell.y + h <= this.gridSize);

          ctx.fillStyle = isValid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
          ctx.fillRect(px, py, pw, ph);
          ctx.strokeStyle = isValid ? '#10b981' : '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(px, py, pw, ph);

          ctx.fillStyle = '#fff';
          ctx.font = '14px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(def.icon, px + pw / 2, py + ph / 2);
        }
      } else if (this.activeTool === 'eyedropper') {
        const px = this.hoverCell.x * this.cellSize;
        const py = this.hoverCell.y * this.cellSize;
        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
        ctx.fillRect(px, py, this.cellSize, this.cellSize);
        ctx.strokeStyle = '#00f2fe';
        ctx.strokeRect(px, py, this.cellSize, this.cellSize);
      } else if (this.activeTool === 'sledgehammer') {
        const px = this.hoverCell.x * this.cellSize;
        const py = this.hoverCell.y * this.cellSize;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.fillRect(px, py, this.cellSize, this.cellSize);
        ctx.strokeStyle = '#ef4444';
        ctx.strokeRect(px, py, this.cellSize, this.cellSize);
      } else if (this.activeTool === 'zone') {
        const px = this.hoverCell.x * this.cellSize;
        const py = this.hoverCell.y * this.cellSize;
        ctx.fillStyle = this.zoneTypes[this.currentZoneIndex].color;
        ctx.fillRect(px, py, this.cellSize, this.cellSize);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(px, py, this.cellSize, this.cellSize);
      }
    }
  }
};

// Initialize module when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.BaseBuilder.init());
} else {
  window.BaseBuilder.init();
}

