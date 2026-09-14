/**
 * The Sims MLO House Builder - In-Game Client Controller
 */

const SIMS_CATALOG = {
    rooms: [
        {
            id: 'room_shapes',
            name: 'Room Shapes & Sizes',
            icon: '🏠',
            items: [
                { type: 'room', id: 'room_4x4', name: 'Square Room (4x4m)', size: '4x4m', icon: '🔲', tag: 'Cozy Room', desc: 'Complete 4-walled enclosed room with floor & ceiling' },
                { type: 'room', id: 'room_6x6', name: 'Medium Room (6x6m)', size: '6x6m', icon: '🔲', tag: 'Standard Living', desc: 'Spacious 6x6m room with door cutout' },
                { type: 'room', id: 'room_8x8', name: 'Large Room (8x8m)', size: '8x8m', icon: '🔲', tag: 'Master Suite', desc: '8x8m room with panoramic glass wall' },
                { type: 'room', id: 'room_12x12', name: 'Grand Hall (12x12m)', size: '12x12m', icon: '🏰', tag: 'Grand Villa', desc: 'Massive luxury open-plan room' },
                { type: 'room', id: 'room_l_shape', name: 'L-Shaped Villa (12x8m)', size: '12x8m', icon: '📐', tag: 'L-Layout', desc: 'Modern L-shaped house shell' }
            ]
        },
        {
            id: 'complete_houses',
            name: 'Complete House Shells',
            icon: '🏡',
            items: [
                { type: 'house_shell', id: 'house_modern_villa', name: 'Modern Luxury Villa', icon: '🏡', tag: 'Walk-in House', desc: 'Complete finished house with living, bed, bath & lights' },
                { type: 'house_shell', id: 'house_beachfront', name: 'Beachfront Boardwalk Villa', icon: '🏖️', tag: 'Beach Villa', desc: 'Open-air coastal luxury home' },
                { type: 'house_shell', id: 'house_desert_compound', name: 'Desert Ranch Compound', icon: '🏜️', tag: 'Desert Ranch', desc: 'Sprawling single-story compound' }
            ]
        }
    ],
    room_sets: [
        {
            id: 'furnished_sets',
            name: '1-Click Furnished Rooms',
            icon: '🛋️',
            items: [
                { type: 'furnished_set', id: 'set_living', name: '🛋️ Luxury Living Room Set', icon: '🛋️', tag: 'Living Set', desc: 'Sectional sofa, 65" TV, coffee table, rug & lights' },
                { type: 'furnished_set', id: 'set_bedroom', name: '🛏️ Master Bedroom Set', icon: '🛏️', tag: 'Bedroom Set', desc: 'King platform bed, nightstands, wardrobe & lamps' },
                { type: 'furnished_set', id: 'set_kitchen', name: '🍳 Chef Kitchen & Bar Set', icon: '🍳', tag: 'Kitchen Set', desc: 'Quartz island, double fridge, stove, barstools' },
                { type: 'furnished_set', id: 'set_bathroom', name: '🛁 Spa & Bathroom Set', icon: '🛁', tag: 'Spa Set', desc: 'Soaking tub, dual vanity, glass shower & toilet' },
                { type: 'furnished_set', id: 'set_office', name: '💼 Executive Office Set', icon: '💼', tag: 'Office Set', desc: 'Mahogany desk, ergonomic chair, bookshelves, laptop' },
                { type: 'furnished_set', id: 'set_patio', name: '🏊 Pool & Patio Lounge Set', icon: '🏊', tag: 'Patio Set', desc: 'Infinity pool, sun loungers, fire pit & palm trees' }
            ]
        }
    ],
    walls_doors: [
        {
            id: 'wall_types',
            name: 'Walls & Partitions',
            icon: '🧱',
            items: [
                { type: 'prop', model: 'v_res_m_wall01', name: 'White Drywall Plaster (4m)', icon: '🧱', tag: 'Solid White' },
                { type: 'prop', model: 'prop_fncwood_02', name: 'Acoustic Wood Wall (4m)', icon: '🪵', tag: 'Wood Wall' },
                { type: 'prop', model: 'prop_wall_brick_01', name: 'Exposed Loft Brick (4m)', icon: '🧱', tag: 'Red Brick' },
                { type: 'prop', model: 'v_corp_divider01', name: 'Modern Room Divider', icon: '🏢', tag: 'Partition' },
                { type: 'prop', model: 'v_res_mp_shower', name: 'Panoramic Glass Wall', icon: '🪟', tag: 'Glass Wall' }
            ]
        },
        {
            id: 'door_types',
            name: 'Doors & Portals',
            icon: '🚪',
            items: [
                { type: 'prop', model: 'v_ilev_trev_doorfront', name: 'Solid Wood Apartment Door', icon: '🚪', tag: 'Solid Wood' },
                { type: 'prop', model: 'v_ilev_bk_door01', name: 'Modern Pivot Glass Door', icon: '🚪', tag: 'Pivot Glass' },
                { type: 'prop', model: 'v_ilev_bath_door', name: 'Frosted Bathroom Glass Door', icon: '🚪', tag: 'Frosted Glass' },
                { type: 'prop', model: 'v_ilev_arm_secdoor', name: 'Armored Vault Door', icon: '🚪', tag: 'Vault Steel' }
            ]
        }
    ],
    buy_mode: [
        {
            id: 'furniture_items',
            name: 'Individual Furniture',
            icon: '🪑',
            items: [
                { type: 'prop', model: 'v_club_leather_sofa', name: 'Italian Leather Sectional', icon: '🛋️', tag: 'Sofa' },
                { type: 'prop', model: 'prop_tv_flat_01', name: '65" 4K OLED TV', icon: '📺', tag: 'Television' },
                { type: 'prop', model: 'v_res_d_bed', name: 'King Platform Bed', icon: '🛏️', tag: 'Bed' },
                { type: 'prop', model: 'v_res_mp_soakertub', name: 'Spa Soaking Tub', icon: '🛁', tag: 'Bathtub' },
                { type: 'prop', model: 'v_res_mp_vanity', name: 'Double Marble Vanity', icon: '🚰', tag: 'Sink' },
                { type: 'prop', model: 'v_res_kit_counter', name: 'Kitchen Quartz Island', icon: '🍳', tag: 'Counter' },
                { type: 'prop', model: 'v_res_fridge', name: 'Stainless Refrigerator', icon: '🧊', tag: 'Fridge' },
                { type: 'prop', model: 'prop_toilet_01', name: 'Modern Toilet', icon: '🚽', tag: 'Toilet' },
                { type: 'prop', model: 'prop_ceiling_light_01', name: 'Warm Ceiling Downlight', icon: '💡', tag: 'Light Emitter', isLight: true }
            ]
        }
    ]
};

let currentMode = 'rooms';
let currentSubCategory = 'room_shapes';
let currentSelected = { type: 'room', id: 'room_4x4', name: 'Square Room (4x4m)' };
let currentRotationYaw = 0.0;
let currentElevationOffset = 0.0;

function init() {
    renderSubtabs();
    renderCards();
    bindEvents();
}

function sendNuiCallback(endpoint, data = {}) {
    const resName = window.GetParentResourceName ? window.GetParentResourceName() : 'mlo_custom_interior';
    return fetch(`https://${resName}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

function bindEvents() {
    // Mode Switcher Tabs
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentMode = e.currentTarget.getAttribute('data-mode');

            if (currentMode === 'erase_world') {
                sendNuiCallback('setTool', { tool: 'world_eraser' });
                document.getElementById('stamp-button-text').textContent = 'ERASE WORLD BUILDING';
                document.getElementById('sims-cards-slider').innerHTML = '<div style="font-size:12px;color:var(--sims-text-medium);padding:20px;">Aim crosshair at any GTA V world building and click "ERASE WORLD BUILDING" to remove it permanently.</div>';
                document.getElementById('sims-subtabs').innerHTML = '';
            } else {
                sendNuiCallback('setTool', { tool: 'place' });
                const categories = SIMS_CATALOG[currentMode] || [];
                if (categories.length > 0) currentSubCategory = categories[0].id;
                renderSubtabs();
                renderCards();
            }
        });
    });

    // Big Stamp Placement Button
    document.getElementById('btn-stamp-now').addEventListener('click', () => {
        executeStampPlacement();
    });

    // Rotation Buttons
    document.getElementById('btn-rot-left').addEventListener('click', () => {
        currentRotationYaw = (currentRotationYaw - 45.0 + 360.0) % 360.0;
        document.getElementById('val-rot-yaw').textContent = `${Math.round(currentRotationYaw)}°`;
        sendNuiCallback('setAngleYaw', { yaw: currentRotationYaw });
    });

    document.getElementById('btn-rot-right').addEventListener('click', () => {
        currentRotationYaw = (currentRotationYaw + 45.0) % 360.0;
        document.getElementById('val-rot-yaw').textContent = `${Math.round(currentRotationYaw)}°`;
        sendNuiCallback('setAngleYaw', { yaw: currentRotationYaw });
    });

    // Elevation Buttons
    document.getElementById('btn-elev-down').addEventListener('click', () => {
        currentElevationOffset = Number((currentElevationOffset - 0.5).toFixed(2));
        const sign = currentElevationOffset >= 0 ? '+' : '';
        document.getElementById('val-elev-z').textContent = `${sign}${currentElevationOffset.toFixed(1)}m`;
        sendNuiCallback('setElevationOffset', { offset: currentElevationOffset });
    });

    document.getElementById('btn-elev-up').addEventListener('click', () => {
        currentElevationOffset = Number((currentElevationOffset + 0.5).toFixed(2));
        const sign = currentElevationOffset >= 0 ? '+' : '';
        document.getElementById('val-elev-z').textContent = `${sign}${currentElevationOffset.toFixed(1)}m`;
        sendNuiCallback('setElevationOffset', { offset: currentElevationOffset });
    });

    // Undo Last Placed
    document.getElementById('btn-undo-last').addEventListener('click', () => {
        sendNuiCallback('undoLast');
    });

    // Save House
    document.getElementById('btn-save-sims').addEventListener('click', () => {
        sendNuiCallback('saveProject');
    });

    // Exit
    document.getElementById('btn-close-sims').addEventListener('click', () => {
        sendNuiCallback('closeMenu');
    });

    // Global Key Listener (<kbd>E</kbd> or <kbd>Enter</kbd> to place, <kbd>ESC</kbd> to exit)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
            executeStampPlacement();
        } else if (e.key === 'Escape') {
            sendNuiCallback('closeMenu');
        }
    });

    // FiveM Lua Message Listener
    window.addEventListener('message', (event) => {
        const item = event.data;
        if (item.action === 'open') {
            document.getElementById('sims-hud').classList.remove('hidden');
        } else if (item.action === 'close') {
            document.getElementById('sims-hud').classList.add('hidden');
        } else if (item.action === 'setAimCoords') {
            const targetPill = document.getElementById('sims-target-pill');
            if (item.coords) {
                targetPill.classList.remove('hidden');
                document.getElementById('sims-target-text').textContent = `Target: vec3(${item.coords.x.toFixed(1)}, ${item.coords.y.toFixed(1)}, ${item.coords.z.toFixed(1)})`;
            }
        }
    });
}

function executeStampPlacement() {
    if (currentMode === 'erase_world') {
        sendNuiCallback('eraseTargetBuilding');
    } else {
        sendNuiCallback('stampSimsSelection', {
            selection: currentSelected,
            yaw: currentRotationYaw,
            elevation: currentElevationOffset
        });
    }
}

function renderSubtabs() {
    const container = document.getElementById('sims-subtabs');
    container.innerHTML = '';

    const categories = SIMS_CATALOG[currentMode] || [];
    categories.forEach(cat => {
        const pill = document.createElement('div');
        pill.className = `subtab-pill ${cat.id === currentSubCategory ? 'active' : ''}`;
        pill.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
        pill.addEventListener('click', () => {
            currentSubCategory = cat.id;
            renderSubtabs();
            renderCards();
        });
        container.appendChild(pill);
    });
}

function renderCards() {
    const container = document.getElementById('sims-cards-slider');
    container.innerHTML = '';

    const categories = SIMS_CATALOG[currentMode] || [];
    const cat = categories.find(c => c.id === currentSubCategory);
    if (!cat || !cat.items) return;

    cat.items.forEach(item => {
        const card = document.createElement('div');
        const isSel = (currentSelected.id === item.id || currentSelected.model === item.model);
        card.className = `sims-card-item ${isSel ? 'selected' : ''}`;
        card.title = item.desc || item.name;
        card.innerHTML = `
            <div class="card-icon">${item.icon}</div>
            <div class="card-info">
                <span class="card-title">${item.name}</span>
                <span class="card-tag">${item.tag || item.size || 'Sims Item'}</span>
            </div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.sims-card-item').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            currentSelected = item;
            document.getElementById('stamp-button-text').textContent = `STAMP ${item.name.toUpperCase()}`;
            sendNuiCallback('selectSimsPreview', { selection: item });
        });
        container.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', init);
