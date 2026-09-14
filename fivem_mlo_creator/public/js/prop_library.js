/**
 * GTA V / FiveM Curated Prop Catalog & Material Library
 * Includes Structural, Walls, Windows, Curtains, Bathrooms, Furniture, Bedroom, Kitchen, Living, Lighting, Tech, Crime, and Industrial.
 */

const WALL_MATERIALS = [
    { id: 'drywall_white', name: 'White Drywall Plaster', color: '#f8fafc', roughness: 0.9, metalness: 0.0, pattern: 'smooth' },
    { id: 'drywall_gray', name: 'Modern Charcoal Paint', color: '#334155', roughness: 0.8, metalness: 0.0, pattern: 'smooth' },
    { id: 'tile_subway_white', name: 'White Subway Tile (Gloss)', color: '#ffffff', roughness: 0.15, metalness: 0.1, pattern: 'subway_tile' },
    { id: 'tile_ceramic_black', name: 'Black Marble Hexagon Tile', color: '#1e293b', roughness: 0.2, metalness: 0.15, pattern: 'hex_tile' },
    { id: 'tile_mosaic_blue', name: 'Spa Blue Mosaic Tile', color: '#0ea5e9', roughness: 0.25, metalness: 0.1, pattern: 'mosaic_tile' },
    { id: 'marble_carrara', name: 'Luxury Carrara White Marble', color: '#f1f5f9', roughness: 0.1, metalness: 0.2, pattern: 'marble' },
    { id: 'marble_nero', name: 'Nero Marquina Black Marble', color: '#0f172a', roughness: 0.1, metalness: 0.2, pattern: 'marble' },
    { id: 'wood_oak_panel', name: 'Warm Oak Slat Paneling', color: '#b45309', roughness: 0.6, metalness: 0.0, pattern: 'wood_slat' },
    { id: 'wood_walnut', name: 'Dark Walnut Vertical Slats', color: '#451a03', roughness: 0.5, metalness: 0.0, pattern: 'wood_slat' },
    { id: 'brick_exposed_red', name: 'Exposed Loft Red Brick', color: '#991b1b', roughness: 0.95, metalness: 0.0, pattern: 'brick' },
    { id: 'brick_dark_industrial', name: 'Dark Industrial Brick', color: '#3f3f46', roughness: 0.9, metalness: 0.0, pattern: 'brick' },
    { id: 'concrete_polished', name: 'Polished Architectural Concrete', color: '#64748b', roughness: 0.4, metalness: 0.05, pattern: 'concrete' },
    { id: 'concrete_rough', name: 'Raw Brutalist Concrete', color: '#475569', roughness: 0.9, metalness: 0.0, pattern: 'concrete' },
    { id: 'metal_corrugated', name: 'Corrugated Steel Panel', color: '#94a3b8', roughness: 0.35, metalness: 0.8, pattern: 'metal_panel' }
];

const GTA_PROP_LIBRARY = [
    // ==========================================
    // WALLS, WINDOWS & CURTAINS
    // ==========================================
    { name: 'Modular Wall 4x3m', model: 'v_ilev_cd_wall01', category: 'structural', size: [4.0, 0.2, 3.0], icon: '🧱', desc: 'Standard 4m interior wall' },
    { name: 'Modular Wall 2x3m', model: 'v_ilev_cd_wall02', category: 'structural', size: [2.0, 0.2, 3.0], icon: '🧱', desc: 'Compact 2m interior partition wall' },
    { name: 'Wall with Window Cutout 4x3m', model: 'v_ilev_cd_wallwindow', category: 'windows', size: [4.0, 0.2, 3.0], icon: '🪟', desc: 'Wall panel with framed central window opening' },
    { name: 'Glass Window Pane 2x1.5m', model: 'v_ilev_bank_glass01', category: 'windows', size: [2.0, 0.05, 1.5], icon: '🪟', desc: 'Clear glass window pane' },
    { name: 'Floor-to-Ceiling Luxury Window', model: 'v_ilev_glass_huge', category: 'windows', size: [3.5, 0.08, 3.0], icon: '🪟', desc: 'Large modern panoramic glass window' },
    { name: 'Fabric Curtains (Open State)', model: 'prop_curtain_open_01', category: 'windows', size: [2.2, 0.2, 2.6], icon: '🪟', desc: 'Luxury side-draped open curtains' },
    { name: 'Fabric Curtains (Closed State)', model: 'prop_curtain_closed_01', category: 'windows', size: [2.2, 0.2, 2.6], icon: '🪟', desc: 'Full-cover drawn blackout curtains' },
    { name: 'Venetian Blinds (Horizontal Open)', model: 'prop_blinds_open_01', category: 'windows', size: [1.8, 0.1, 2.0], icon: '🪟', desc: 'Modern aluminum horizontal open slats' },
    { name: 'Venetian Blinds (Horizontal Closed)', model: 'prop_blinds_closed_01', category: 'windows', size: [1.8, 0.1, 2.0], icon: '🪟', desc: 'Drawn horizontal blinds for privacy' },
    { name: 'Motorized Roller Blind (Up)', model: 'prop_roller_blind_up', category: 'windows', size: [2.0, 0.1, 0.2], icon: '🪟', desc: 'Retracted roller blind cylinder' },
    { name: 'Motorized Roller Blind (Down)', model: 'prop_roller_blind_down', category: 'windows', size: [2.0, 0.1, 2.4], icon: '🪟', desc: 'Lowered blackout roller shade' },

    // ==========================================
    // BEDROOM & LIVING ROOM FURNITURE
    // ==========================================
    { name: 'King Size Luxury Platform Bed', model: 'v_res_d_bed', category: 'bedroom', size: [2.2, 2.2, 1.1], icon: '🛏️', desc: 'King upholstered platform bed with plush pillows & duvet' },
    { name: 'Modern Bedside Nightstand', model: 'v_res_d_bedside', category: 'bedroom', size: [0.6, 0.5, 0.6], icon: '🪑', desc: 'Dark wood 2-drawer bedside table' },
    { name: 'Modern Wardrobe Closet', model: 'v_res_d_wardrobe', category: 'bedroom', size: [1.8, 0.7, 2.2], icon: '🚪', desc: 'Floor-to-ceiling clothing wardrobe' },
    { name: 'Luxury Leather Sectional Sofa', model: 'v_club_leather_sofa', category: 'living', size: [2.6, 1.1, 0.9], icon: '🛋️', desc: 'Black tufted luxury lounge sofa' },
    { name: 'Modern Velvet Lounge Armchair', model: 'v_res_m_armchair', category: 'living', size: [1.0, 0.9, 0.85], icon: '🪑', desc: 'Plush velvet accent chair' },
    { name: 'Marble Top Coffee Table', model: 'prop_table_03', category: 'living', size: [1.3, 0.7, 0.45], icon: '🛋️', desc: 'Carrara marble and brass low table' },
    { name: 'TV Media Console Unit', model: 'prop_tv_cabinet_01', category: 'living', size: [2.2, 0.5, 0.6], icon: '📺', desc: 'Low-profile media entertainment credenza' },
    { name: '65-inch 4K Wall Flat Screen TV', model: 'prop_tv_flat_01', category: 'living', size: [1.5, 0.08, 0.9], icon: '📺', desc: 'Ultra-thin OLED wall television' },
    { name: 'Plush Area Floor Rug (3x2m)', model: 'v_res_mp_rug', category: 'living', size: [3.0, 2.0, 0.02], icon: '🧶', desc: 'Soft woven geometric carpet rug' },
    { name: 'Potted Fiddle Leaf Fig Plant', model: 'prop_plant_int_01', category: 'living', size: [0.7, 0.7, 1.8], icon: '🪴', desc: 'Indoor ceramic potted decorative plant' },

    // ==========================================
    // KITCHEN & DINING / BAR
    // ==========================================
    { name: 'Modern Kitchen Island Counter', model: 'v_res_kit_counter', category: 'kitchen', size: [2.8, 1.1, 0.9], icon: '🍳', desc: 'Quartz countertop kitchen island with prep sink' },
    { name: 'Double-Door Stainless Fridge', model: 'v_res_fridge', category: 'kitchen', size: [1.0, 0.9, 2.0], icon: '🧊', desc: 'French door refrigerator with ice dispenser' },
    { name: 'Built-in Induction Oven Range', model: 'v_res_oven', category: 'kitchen', size: [0.9, 0.8, 0.9], icon: '🔥', desc: 'Glass cooktop stove and convection oven' },
    { name: 'Espresso Bar Coffee Machine', model: 'prop_coffee_machine_01', category: 'kitchen', size: [0.4, 0.35, 0.45], icon: '☕', desc: 'Commercial chrome espresso maker' },
    { name: 'Curved Nightclub Bar Counter', model: 'v_club_bar', category: 'kitchen', size: [4.0, 1.2, 1.1], icon: '🍸', desc: 'Illuminated nightclub granite bar module' },
    { name: 'Club Leather Barstool', model: 'v_club_barstool', category: 'kitchen', size: [0.5, 0.5, 0.9], icon: '🪑', desc: 'Chrome & leather adjustable barstool' },
    { name: 'Liquor Bottle Display Shelves', model: 'v_club_bar_bottles', category: 'kitchen', size: [2.0, 0.4, 1.8], icon: '🍾', desc: 'Tiered alcohol bottle back-bar rack' },

    // ==========================================
    // COMPLETE BATHROOM FIXTURES & PLUMBING
    // ==========================================
    { name: 'Modern Porcelain Toilet', model: 'prop_toilet_01', category: 'bathroom', size: [0.5, 0.7, 0.8], icon: '🚽', desc: 'Modern dual-flush ceramic toilet' },
    { name: 'Commercial Wall Urinal', model: 'prop_urinal_01', category: 'bathroom', size: [0.4, 0.4, 0.9], icon: '🚽', desc: 'Wall-mounted stainless steel/ceramic urinal' },
    { name: 'Luxury Freestanding Bathtub', model: 'v_res_mp_soakertub', category: 'bathroom', size: [1.9, 0.9, 0.7], icon: '🛁', desc: 'Oval luxury deep soaking soaking tub' },
    { name: 'Modern Jacuzzi Hydro Tub', model: 'prop_jacuzzi_01', category: 'bathroom', size: [2.4, 2.4, 0.9], icon: '🛁', desc: 'Luxury multi-jet heated spa jacuzzi tub' },
    { name: 'Walk-In Glass Shower Stall', model: 'v_res_mp_shower', category: 'bathroom', size: [1.4, 1.4, 2.4], icon: '🚿', desc: 'Frameless glass shower with rainfall showerhead' },
    { name: 'Double Vanity Sink with Marble Top', model: 'v_res_mp_vanity', category: 'bathroom', size: [2.0, 0.6, 0.9], icon: '🚰', desc: 'Floating dual vessel sink cabinet' },
    { name: 'Single Pedestal Bathroom Sink', model: 'prop_sink_02', category: 'bathroom', size: [0.6, 0.5, 0.85], icon: '🚰', desc: 'Compact ceramic pedestal hand sink' },
    { name: 'Illuminated LED Bathroom Mirror', model: 'v_res_mp_mirror', category: 'bathroom', size: [1.8, 0.05, 1.1], icon: '🪞', desc: 'Backlit defogging vanity mirror' },
    { name: 'Heated Towel Rack (Chrome)', model: 'prop_towel_rail_01', category: 'bathroom', size: [0.6, 0.15, 1.0], icon: '🧖', desc: 'Wall-mounted heated steel towel rail' },
    { name: 'Toilet Paper Dispenser', model: 'prop_toilet_roll_01', category: 'bathroom', size: [0.2, 0.15, 0.2], icon: '🧻', desc: 'Chrome wall roll holder' },
    { name: 'Bathroom Privacy Stall Divider', model: 'prop_toilet_stall_01', category: 'bathroom', size: [1.2, 1.6, 2.1], icon: '🚪', desc: 'Commercial restroom divider cubicle' },
    { name: 'Soft Memory Foam Bath Mat', model: 'prop_bath_mat_01', category: 'bathroom', size: [0.8, 0.5, 0.02], icon: '🛁', desc: 'Water-absorbent plush bathroom floor mat' },

    // ==========================================
    // OFFICE & STUDY / TECH
    // ==========================================
    { name: 'Executive Office Desk', model: 'v_corp_desk', category: 'office', size: [2.2, 1.1, 0.8], icon: '🪑', desc: 'Modern dark mahogany executive desk' },
    { name: 'Ergonomic Leather Swivel Chair', model: 'v_corp_offchair', category: 'office', size: [0.8, 0.8, 1.2], icon: '🪑', desc: 'High-back ergonomic lumbar office chair' },
    { name: 'Tall Executive Bookcase Unit', model: 'v_corp_bookshelf', category: 'office', size: [1.4, 0.4, 2.2], icon: '📚', desc: 'Shelving unit with legal books and awards' },
    { name: 'Ultra-thin Laptop Computer', model: 'prop_laptop_01a', category: 'office', size: [0.35, 0.25, 0.02], icon: '💻', desc: 'Placed desktop laptop computer' },
    { name: 'Conference Boardroom Table', model: 'v_corp_table02', category: 'office', size: [3.6, 1.4, 0.8], icon: '🪑', desc: 'Long boardroom meeting table' },
    { name: 'Server Rack Cabinet (Active LEDs)', model: 'hei_prop_heist_monitor', category: 'tech', size: [0.9, 1.0, 2.2], icon: '🖥️', desc: 'Data center server rack with blinking nodes' },
    { name: 'Multi-Monitor Control Console', model: 'hei_prop_hei_table_console', category: 'tech', size: [2.5, 1.2, 1.5], icon: '💻', desc: 'Tactical multi-display surveillance workstation' },
    { name: 'Dome CCTV Security Camera', model: 'prop_cctv_cam_01a', category: 'tech', size: [0.3, 0.4, 0.3], icon: '📹', desc: 'Ceiling/wall optical security camera' },

    // ==========================================
    // CRIME, VAULT & UNDERGROUND
    // ==========================================
    { name: 'Gun Cabinet Wall Rack (Rifles)', model: 'gr_prop_gr_gun_cabinet_01a', category: 'crime', size: [1.8, 0.4, 2.2], icon: '🔫', desc: 'Bunker armory heavy rifle locker' },
    { name: 'Handgun & Ammo Storage Locker', model: 'gr_prop_gr_gun_cabinet_02a', category: 'crime', size: [1.4, 0.4, 2.0], icon: '🔫', desc: 'Pistol & ammunition security rack' },
    { name: 'Weed Hydroponic Plant (Mature)', model: 'bkr_prop_weed_plant_01a', category: 'crime', size: [0.7, 0.7, 1.2], icon: '🌿', desc: 'High-grade cannabis pot plant' },
    { name: 'Hydroponic Grow Lamp System', model: 'bkr_prop_weed_hydro_lamp_01', category: 'crime', size: [1.6, 0.8, 0.4], icon: '💡', desc: 'Suspended high-output grow light' },
    { name: 'Cocaine Processing Table', model: 'bkr_prop_coke_table01a', category: 'crime', size: [2.0, 1.0, 0.9], icon: '🧪', desc: 'Drug lab cutting table with scales & press' },
    { name: 'Money Stacks & Cash Briefcase', model: 'bkr_prop_money_sorted_01', category: 'crime', size: [0.8, 0.5, 0.3], icon: '💵', desc: 'Bundled clean $100 bills and security briefcase' },
    { name: 'Heavy Floor Vault Safe', model: 'prop_vault_safe_01', category: 'crime', size: [1.0, 0.9, 1.6], icon: '🔐', desc: 'Reinforced dual-dial combo safe' },

    // ==========================================
    // GARAGE & INDUSTRIAL
    // ==========================================
    { name: 'Hydraulic 2-Post Car Lift', model: 'prop_car_lift_01', category: 'industrial', size: [3.8, 2.0, 3.5], icon: '🚗', desc: 'Heavy vehicle mechanic hydraulic lift' },
    { name: 'Mechanic Rolling Tool Chest', model: 'prop_toolchest_01', category: 'industrial', size: [1.2, 0.6, 1.0], icon: '🔧', desc: 'Red steel multi-drawer mechanic tool box' },
    { name: 'Hydraulic Engine Hoist Crane', model: 'prop_engine_hoist_01', category: 'industrial', size: [1.4, 1.0, 1.8], icon: '🏗️', desc: 'Heavy engine removal hoist' },
    { name: 'Heavy Wooden Pallet Stacks', model: 'prop_pallet_01a', category: 'industrial', size: [1.2, 1.2, 1.4], icon: '📦', desc: 'Stacked warehouse shipping pallets' },
    { name: '55-Gallon Steel Hazmat Drum', model: 'prop_oil_barrel_01', category: 'industrial', size: [0.6, 0.6, 0.9], icon: '🛢️', desc: 'Industrial lubricant / oil barrel' }
];

const TIMECYCLE_MODIFIERS = [
    { name: 'default', label: 'Default / None', desc: 'Standard GTA V ambient lighting' },
    { name: 'int_hospital', label: 'Hospital / Clean White (Bathroom)', desc: 'Bright clinical daylight fluorescent lighting' },
    { name: 'int_motel', label: 'Motel / Warm Bath Ambient', desc: 'Atmospheric warm tungsten dim lighting' },
    { name: 'int_club_neon', label: 'Nightclub / Vivid Neon', desc: 'Deep violet, cyan & neon contrast lighting' },
    { name: 'v_tunnel', label: 'Underground Tunnel / Bunker', desc: 'High contrast dark shadowy vault mood' },
    { name: 'int_clothes_high', label: 'Luxury Boutique / High-End', desc: 'Soft diffused high CRI fashion lighting' },
    { name: 'int_amb_neonmid', label: 'Cyberpunk Neon Mid', desc: 'Accentuated color saturation and dark blacks' },
    { name: 'int_prison', label: 'Prison / Cold Steel', desc: 'Desaturated cold surveillance tone' }
];

if (typeof module !== 'undefined') {
    module.exports = { GTA_PROP_LIBRARY, WALL_MATERIALS, TIMECYCLE_MODIFIERS };
}
