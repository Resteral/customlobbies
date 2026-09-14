/**
 * AI Interior Architect
 * Generates procedural multi-room FiveM MLO interior blueprints with portals, lighting moods, and themed props.
 */

class AIArchitect {
    static getPresetBlueprints() {
        return [
            {
                id: 'tactical_bunker',
                title: 'Tactical Underground Bunker & Armory',
                prompt: 'create a high security underground bunker with airlock entrance, war room command center, and armory vault',
                icon: '🛡️',
                tags: ['Military', 'Vault', 'Armory', 'Dark']
            },
            {
                id: 'weed_dispensary',
                title: 'Weed Dispensary & Hydroponic Grow Lab',
                prompt: 'create an illegal weed dispensary with retail storefront, hydroponic grow room, and back drying storage vault',
                icon: '🌿',
                tags: ['Business', 'Drugs', 'Hydro', 'Neon']
            },
            {
                id: 'neon_speakeasy',
                title: 'Neon Speakeasy Bar & VIP Casino',
                prompt: 'create a secret neon underground speakeasy bar with dancefloor, vip lounge, and hidden poker gambling den',
                icon: '🍸',
                tags: ['Nightclub', 'Bar', 'Casino', 'VIP']
            },
            {
                id: 'detective_office',
                title: 'Detective Agency & Interrogation Suite',
                prompt: 'create a police detective agency with reception foyer, bullpen office desk, and soundproof interrogation cell',
                icon: '👮',
                tags: ['Police', 'Office', 'Interrogation', 'Corporate']
            },
            {
                id: 'chop_shop',
                title: 'Underground Chop Shop & Mechanic Bay',
                prompt: 'create a gritty underground chop shop with 2 car lifts, engine crane, tool chests, and back office',
                icon: '🔧',
                tags: ['Garage', 'Mechanic', 'Industrial', 'Vehicles']
            },
            {
                id: 'medical_clinic',
                title: 'Underground Black Market Clinic',
                prompt: 'create an underground medical clinic with reception waiting room, operating theater, and pharmacy supply room',
                icon: '🩺',
                tags: ['Medical', 'Hospital', 'Trauma', 'Clean']
            }
        ];
    }

    /**
     * Generates a complete MLO project structure from prompt
     */
    static async generate(prompt) {
        try {
            const response = await fetch('/api/ai/architect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt })
            });
            const data = await response.json();
            if (data.success && data.project) {
                return data.project;
            }
        } catch (e) {
            console.warn('Backend AI endpoint unavailable, using fallback generator:', e);
        }

        // Client-side fallback generator
        return this.clientFallbackGenerate(prompt);
    }

    static clientFallbackGenerate(prompt) {
        const p = prompt.toLowerCase();
        
        if (p.includes('chop') || p.includes('garage') || p.includes('mechanic')) {
            return {
                name: 'mlo_chop_shop',
                displayName: 'Underground Chop Shop & Mechanic Bay',
                archetype: 'hei_dlc_mlo_chopshop',
                position: { x: -215.0, y: -1320.5, z: 30.5 },
                rotation: { x: 0, y: 0, z: 0, w: 1 },
                rooms: [
                    { name: 'limbo', bbMin: [-25, -25, -5], bbMax: [25, 25, 10], timecycle: 'default', blend: 0.0, flags: 0 },
                    { name: 'garage_service_bay', bbMin: [-10, -10, -1], bbMax: [10, 10, 6], timecycle: 'int_motel', blend: 1.0, flags: 0 },
                    { name: 'office_parts_storage', bbMin: [10, -6, -1], bbMax: [18, 6, 4], timecycle: 'int_hospital', blend: 1.0, flags: 0 }
                ],
                portals: [
                    {
                        fromRoom: 0, toRoom: 1, flags: 0,
                        vertices: [
                            { x: 0, y: -10, z: 0 },
                            { x: 0, y: -10, z: 3.5 },
                            { x: 4, y: -10, z: 3.5 },
                            { x: 4, y: -10, z: 0 }
                        ]
                    },
                    {
                        fromRoom: 1, toRoom: 2, flags: 0,
                        vertices: [
                            { x: 10, y: 0, z: 0 },
                            { x: 10, y: 0, z: 2.8 },
                            { x: 10, y: 2, z: 2.8 },
                            { x: 10, y: 2, z: 0 }
                        ]
                    }
                ],
                entities: [
                    { model: 'prop_car_lift_01', room: 1, pos: { x: -4, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
                    { model: 'prop_toolchest_01', room: 1, pos: { x: -8, y: 4, z: 0 }, rot: { x: 0, y: 0, z: 0.707, w: 0.707 }, scale: { x: 1, y: 1, z: 1 } },
                    { model: 'prop_engine_hoist_01', room: 1, pos: { x: 4, y: 4, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
                    { model: 'v_corp_desk', room: 2, pos: { x: 14, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
                    { model: 'v_corp_offchair', room: 2, pos: { x: 14, y: 1.5, z: 0 }, rot: { x: 0, y: 0, z: 1, w: 0 }, scale: { x: 1, y: 1, z: 1 } }
                ],
                entitySets: [
                    { name: 'active_repairs', entities: [0, 2] }
                ]
            };
        }

        // Default: Bunker
        return {
            name: 'mlo_tactical_bunker',
            displayName: 'Tactical Underground Bunker & Armory',
            archetype: 'hei_dlc_mlo_bunker',
            position: { x: 480.0, y: -1300.0, z: 29.0 },
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            rooms: [
                { name: 'limbo', bbMin: [-25, -25, -5], bbMax: [25, 25, 10], timecycle: 'default', blend: 0.0, flags: 0 },
                { name: 'airlock_entrance', bbMin: [-3, -4, -1], bbMax: [3, 4, 4], timecycle: 'v_tunnel', blend: 1.0, flags: 0 },
                { name: 'command_center', bbMin: [-8, -8, -1], bbMax: [8, 8, 5], timecycle: 'int_hospital', blend: 1.0, flags: 0 },
                { name: 'armory_vault', bbMin: [8, -6, -1], bbMax: [18, 6, 4], timecycle: 'int_motel', blend: 1.0, flags: 0 }
            ],
            portals: [
                {
                    fromRoom: 0, toRoom: 1, flags: 0,
                    vertices: [
                        { x: 0, y: -4, z: 0 },
                        { x: 0, y: -4, z: 2.8 },
                        { x: 2, y: -4, z: 2.8 },
                        { x: 2, y: -4, z: 0 }
                    ]
                },
                {
                    fromRoom: 1, toRoom: 2, flags: 0,
                    vertices: [
                        { x: 0, y: 4, z: 0 },
                        { x: 0, y: 4, z: 2.8 },
                        { x: 2, y: 4, z: 2.8 },
                        { x: 2, y: 4, z: 0 }
                    ]
                },
                {
                    fromRoom: 2, toRoom: 3, flags: 0,
                    vertices: [
                        { x: 8, y: 0, z: 0 },
                        { x: 8, y: 0, z: 2.8 },
                        { x: 8, y: 2, z: 2.8 },
                        { x: 8, y: 2, z: 0 }
                    ]
                }
            ],
            entities: [
                { model: 'v_ilev_arm_secdoor', room: 1, pos: { x: 0, y: -4, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
                { model: 'hei_prop_heist_monitor', room: 2, pos: { x: 0, y: 4, z: 1.2 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
                { model: 'hei_prop_hei_table_console', room: 2, pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
                { model: 'gr_prop_gr_gun_cabinet_01a', room: 3, pos: { x: 15, y: 3, z: 0 }, rot: { x: 0, y: 0, z: 1, w: 0 }, scale: { x: 1, y: 1, z: 1 } },
                { model: 'prop_vault_safe_01', room: 3, pos: { x: 15, y: -3, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } }
            ],
            entitySets: [
                { name: 'high_security_lockdown', entities: [0, 3, 4] }
            ]
        };
    }
}

if (typeof module !== 'undefined') {
    module.exports = AIArchitect;
}
