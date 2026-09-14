/**
 * The Sims Buy & Build Mode Interactive Catalog
 * Organizes props, walls, windows, curtains, and plumbing into intuitive room-by-room Sims categories.
 */

const materialsList = (typeof WALL_MATERIALS !== 'undefined') ? WALL_MATERIALS : (typeof require !== 'undefined' ? require('./prop_library.js').WALL_MATERIALS : []);

const SIMS_CATALOG = {
    // BUILD MODE CATEGORIES
    build: [
        {
            id: 'walls_rooms',
            name: 'Walls & Rooms',
            icon: '🧱',
            subcategories: [
                { id: 'tool_wall', name: 'Drag Wall Tool', icon: '🧱', isTool: 'drag_wall', desc: 'Click and drag on the grid to draw straight walls of any length.' },
                { id: 'tool_room', name: 'Drag Room Box', icon: '📦', isTool: 'drag_room', desc: 'Click and drag a box on the grid to build an entire enclosed room with floor & ceiling.' },
                { id: 'tool_sledge', name: 'Sledgehammer', icon: '🔨', isTool: 'sledgehammer', desc: 'Click any wall or object to demolish it instantly.' },
                { id: 'tool_eyedropper', name: 'Eyedropper', icon: '💧', isTool: 'eyedropper', desc: 'Click any object to duplicate and place copies.' }
            ]
        },
        {
            id: 'wall_patterns',
            name: 'Wall Patterns & Tiles',
            icon: '🎨',
            materials: materialsList
        },
        {
            id: 'doors_portals',
            name: 'Doors & Portals',
            icon: '🚪',
            models: ['v_ilev_bath_door', 'v_ilev_bk_door01', 'v_ilev_arm_secdoor', 'prop_ch2_05c_door', 'v_ilev_trev_doorfront', 'v_ilev_ph_cellgate', 'prop_roller_car_01']
        },
        {
            id: 'windows_curtains',
            name: 'Windows & Curtains',
            icon: '🪟',
            models: ['prop_curtain_open_01', 'prop_curtain_closed_01', 'prop_blinds_open_01', 'prop_blinds_closed_01', 'v_ilev_cd_wallwindow', 'v_ilev_bank_glass01', 'v_ilev_glass_huge']
        }
    ],

    // BUY MODE CATEGORIES
    buy: [
        {
            id: 'bedroom',
            name: 'Bedroom & Rest',
            icon: '🛏️',
            models: ['v_res_d_bed', 'v_res_d_bedside', 'v_res_d_wardrobe']
        },
        {
            id: 'living_comfort',
            name: 'Living & Sofas',
            icon: '🛋️',
            models: ['v_club_leather_sofa', 'v_res_m_armchair', 'prop_table_03', 'prop_tv_cabinet_01', 'prop_tv_flat_01', 'v_res_mp_rug', 'prop_plant_int_01']
        },
        {
            id: 'kitchen_dining',
            name: 'Kitchen & Dining',
            icon: '🍳',
            models: ['v_res_kit_counter', 'v_res_fridge', 'v_res_oven', 'prop_coffee_machine_01', 'v_club_bar', 'v_club_barstool', 'v_club_bar_bottles']
        },
        {
            id: 'bathroom',
            name: 'Bathroom & Spa',
            icon: '🚽',
            models: ['prop_toilet_01', 'prop_urinal_01', 'v_res_mp_soakertub', 'prop_jacuzzi_01', 'v_res_mp_shower', 'v_res_mp_vanity', 'prop_sink_02', 'v_res_mp_mirror', 'prop_towel_rail_01', 'prop_toilet_roll_01', 'prop_bath_mat_01', 'prop_toilet_stall_01']
        },
        {
            id: 'surfaces_desks',
            name: 'Office & Study',
            icon: '💼',
            models: ['v_corp_desk', 'v_corp_offchair', 'v_corp_bookshelf', 'prop_laptop_01a', 'v_corp_table02']
        },
        {
            id: 'lighting',
            name: 'Lighting & Ambience',
            icon: '💡',
            models: ['v_ilev_lightstrip01', 'v_ilev_recesslight', 'v_club_neonlight', 'prop_warninglight_01', 'prop_spot_light_01']
        },
        {
            id: 'tech_electronics',
            name: 'Electronics & Security',
            icon: '🖥️',
            models: ['hei_prop_heist_monitor', 'hei_prop_hei_table_console', 'prop_cctv_cam_01a', 'hei_prop_heist_card_hack_01', 'prop_tv_flat_01']
        },
        {
            id: 'crime_underground',
            name: 'Underground & Vault',
            icon: '🔫',
            models: ['gr_prop_gr_gun_cabinet_01a', 'gr_prop_gr_gun_cabinet_02a', 'bkr_prop_weed_plant_01a', 'bkr_prop_weed_hydro_lamp_01', 'bkr_prop_coke_table01a', 'bkr_prop_money_sorted_01', 'prop_vault_safe_01']
        },
        {
            id: 'industrial_garage',
            name: 'Garage & Industrial',
            icon: '🚗',
            models: ['prop_car_lift_01', 'prop_toolchest_01', 'prop_engine_hoist_01', 'prop_pallet_01a', 'prop_oil_barrel_01']
        }
    ]
};

if (typeof module !== 'undefined') {
    module.exports = SIMS_CATALOG;
}
