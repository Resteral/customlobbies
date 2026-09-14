/**
 * World Building Replacer & Open Interior Integration Engine
 * Provides pre-configured GTA V building locations, doorway coordinates, and door model hiding
 * to seamlessly replace existing world buildings with open walk-in MLO interiors.
 */

const WORLD_BUILDING_PRESETS = [
    {
        id: 'mirror_park_suburban',
        name: 'Mirror Park Suburban House',
        category: 'residential',
        desc: 'Replaces closed suburban home with an open 2-story walk-in interior with glass backyard patio.',
        coords: { x: 1045.2, y: -450.6, z: 64.2 },
        heading: 135.0,
        doorsToHide: ['prop_door_01', 'v_ilev_trev_doorfront', 'prop_bh_door_01'],
        entranceOffset: { x: 0.0, y: -6.0, z: 0.0 }
    },
    {
        id: 'rockford_hills_mansion',
        name: 'Rockford Hills Luxury Villa',
        category: 'mansion',
        desc: 'Replaces locked mansion facade with open walk-in foyer, living room, and master spa bathroom.',
        coords: { x: -750.2, y: 320.5, z: 85.0 },
        heading: 260.0,
        doorsToHide: ['prop_wood_door_01', 'v_ilev_bk_door01'],
        entranceOffset: { x: 0.0, y: -8.0, z: 0.0 }
    },
    {
        id: 'vinewood_storefront',
        name: 'Vinewood Blvd Commercial Storefront',
        category: 'commercial',
        desc: 'Replaces closed commercial shop front with open floor-to-ceiling glass walk-in retail lounge.',
        coords: { x: 380.5, y: 150.2, z: 102.5 },
        heading: 160.0,
        doorsToHide: ['prop_door_02', 'v_ilev_bank_glass01'],
        entranceOffset: { x: 0.0, y: -5.0, z: 0.0 }
    },
    {
        id: 'sandy_shores_motel',
        name: 'Sandy Shores Open Motel / House',
        category: 'desert',
        desc: 'Replaces boarded-up motel room with an open walk-in modern apartment suite.',
        coords: { x: 1550.0, y: 3750.0, z: 34.0 },
        heading: 90.0,
        doorsToHide: ['prop_motel_door_01', 'prop_ch2_05c_door'],
        entranceOffset: { x: 0.0, y: -4.0, z: 0.0 }
    },
    {
        id: 'vespucci_beach_villa',
        name: 'Vespucci Beach Boardwalk Villa',
        category: 'beach',
        desc: 'Replaces closed beach house with open walk-in beach villa with oceanview glass windows.',
        coords: { x: -1450.0, y: -980.0, z: 10.0 },
        heading: 45.0,
        doorsToHide: ['prop_beach_door_01'],
        entranceOffset: { x: 0.0, y: -6.0, z: 0.0 }
    },
    {
        id: 'legion_square_penthouse',
        name: 'Legion Square Rooftop Sky Penthouse',
        category: 'penthouse',
        desc: 'Replaces empty skyscraper rooftop with open walk-in panoramic sky penthouse suite.',
        coords: { x: 120.0, y: -850.0, z: 150.0 },
        heading: 0.0,
        doorsToHide: [],
        entranceOffset: { x: 0.0, y: -5.0, z: 0.0 }
    }
];

if (typeof module !== 'undefined') {
    module.exports = { WORLD_BUILDING_PRESETS };
}
