/**
 * PresetFighters - Default roster with realistic weight classes, mass, and poise stats.
 */
const DEFAULT_ROSTER = [
    {
        id: "poptart_wombat",
        name: "Pop-Tart Wombat",
        title: "The Frosted Marsupial of Doom",
        archetype: "Rushdown",
        weightClass: "Lightweight",
        mass: 62, // kg
        archetypeDesc: "Blistering speed fueled by pure strawberry glaze. High combo traps, vulnerable to heavy counter-hits.",
        tier: "S",
        mmr: 1240,
        record: { wins: 14, losses: 3, kos: 12, streaks: 4 },
        stats: {
            maxHp: 1050,
            hp: 1050,
            maxPoise: 80,
            poise: 80,
            attack: 34,
            defense: 12,
            speed: 6.8,
            critRate: 0.22,
            superGain: 1.4
        },
        anatomy: { headRatio: 0.3, torsoRatio: 0.45, legsRatio: 0.25 },
        appearance: {
            bodyType: "pastry_box",
            colors: {
                primary: "#c27944",
                secondary: "#ff3377",
                accent: "#ffffff",
                glow: "#ff80ab",
                eye: "#1a001a",
                blood: "#c2185b"
            },
            scale: 1.1,
            particles: "#ff80ab",
            battleDamageLevel: 0
        },
        moves: {
            light: { name: "Glaze High Jab (Headshot)", hitZone: "head", type: "melee", damage: 22, poiseDamage: 14, knockback: 4, meterGain: 14, duration: 11, color: "#ff4081" },
            heavy: { name: "Crumb Body Slam", hitZone: "torso", type: "melee", damage: 44, poiseDamage: 36, knockback: 11, meterGain: 22, duration: 19, color: "#d48d56" },
            lowSweep: { name: "Pastry Crust Sweep", hitZone: "legs", type: "low_sweep", damage: 30, poiseDamage: 28, knockback: 9, meterGain: 16, duration: 18, color: "#ff80ab" },
            special1: { name: "Molten Jam Torpedo", hitZone: "torso", type: "dash_strike", damage: 54, poiseDamage: 40, knockback: 10, meterCost: 25, cooldown: 70, color: "#ff4081", speed: 11 },
            special2: { name: "Toaster Pop Upper", hitZone: "head", type: "anti_air", damage: 62, poiseDamage: 48, knockback: 16, meterCost: 35, cooldown: 110, color: "#ff80ab" },
            ultimate: { name: "SUPERNOVA TOASTER POP APOCALYPSE", hitZone: "all", type: "super", damage: 180, poiseDamage: 100, hits: 9, meterCost: 100, color: "#ff1744", bgDim: true, freezeFrames: 45 }
        },
        quotes: {
            intro: `"Fresh out of the toaster and calibrated for maximum kinetic impact."`,
            victory: `"Frosted, toasted, and completely undefeated! EZ SaltyBucks!"`,
            taunt: `"Your defense has more holes than Swiss cheese!"`
        }
    },
    {
        id: "cyberpunk_capybara",
        name: "Cyberpunk Capybara",
        title: "Neo-Tokyo Zen Enforcer",
        archetype: "Juggernaut",
        weightClass: "Heavyweight",
        mass: 240, // kg - massive inertia
        archetypeDesc: "Immovable titanium fortress with laser-guided geysers and unbreakable poise armor.",
        tier: "S",
        mmr: 1280,
        record: { wins: 18, losses: 2, kos: 15, streaks: 7 },
        stats: {
            maxHp: 1350,
            hp: 1350,
            maxPoise: 160,
            poise: 160,
            attack: 38,
            defense: 22,
            speed: 4.2,
            critRate: 0.15,
            superGain: 1.1
        },
        anatomy: { headRatio: 0.25, torsoRatio: 0.55, legsRatio: 0.2 },
        appearance: {
            bodyType: "quadruped_beast",
            colors: {
                primary: "#6d4c41",
                secondary: "#00b8d4",
                accent: "#ffd600",
                glow: "#00e5ff",
                eye: "#00e5ff",
                blood: "#3e2723"
            },
            scale: 1.25,
            particles: "#00e5ff",
            battleDamageLevel: 0
        },
        moves: {
            light: { name: "Cyber Chin Check (Headshot)", hitZone: "head", type: "melee", damage: 24, poiseDamage: 18, knockback: 5, meterGain: 12, duration: 13, color: "#00e5ff" },
            heavy: { name: "Heavy Citrus Smash", hitZone: "torso", type: "melee", damage: 52, poiseDamage: 45, knockback: 14, meterGain: 24, duration: 23, color: "#ffd600" },
            lowSweep: { name: "Hot Spring Low Sweep", hitZone: "legs", type: "low_sweep", damage: 34, poiseDamage: 32, knockback: 10, meterGain: 18, duration: 20, color: "#00b8d4" },
            special1: { name: "Neon Hot Spring Geyser", hitZone: "torso", type: "projectile", damage: 58, poiseDamage: 42, knockback: 12, meterCost: 30, cooldown: 90, color: "#00e5ff", speed: 8 },
            special2: { name: "Zen Barrier Overdrive", hitZone: "head", type: "anti_air", damage: 52, poiseDamage: 40, knockback: 15, meterCost: 35, cooldown: 100, color: "#76ff03" },
            ultimate: { name: "MAXIMUM CHILL MATRIX PURGE", hitZone: "all", type: "super", damage: 195, poiseDamage: 100, hits: 8, meterCost: 100, color: "#00e5ff", bgDim: true, freezeFrames: 50 }
        },
        quotes: {
            intro: `"Mass calculated. Momentum guaranteed. Prepare for pacification."`,
            victory: `"Unbothered. Moisturized. In my lane. Victorious."`,
            taunt: `"Your strikes fail to penetrate the armor."`
        }
    },
    {
        id: "goku_spaghetti",
        name: "Goku of Spaghetti",
        title: "Super Saiyan Al Dente",
        archetype: "Glass Cannon",
        weightClass: "Middleweight",
        mass: 78,
        archetypeDesc: "High carb Saiyan warrior with frame-perfect combo cancels and devastating meatball ballistics.",
        tier: "X",
        mmr: 1390,
        record: { wins: 22, losses: 5, kos: 20, streaks: 9 },
        stats: {
            maxHp: 920,
            hp: 920,
            maxPoise: 75,
            poise: 75,
            attack: 46,
            defense: 10,
            speed: 7.2,
            critRate: 0.28,
            superGain: 1.6
        },
        anatomy: { headRatio: 0.3, torsoRatio: 0.45, legsRatio: 0.25 },
        appearance: {
            bodyType: "humanoid",
            colors: {
                primary: "#ef6c00",
                secondary: "#b71c1c",
                accent: "#fff59d",
                glow: "#ffd600",
                eye: "#00e676",
                blood: "#b71c1c"
            },
            scale: 1.05,
            particles: "#ffd600",
            battleDamageLevel: 0
        },
        moves: {
            light: { name: "Al Dente Head Chop", hitZone: "head", type: "melee", damage: 26, poiseDamage: 16, knockback: 5, meterGain: 15, duration: 10, color: "#ffd600" },
            heavy: { name: "Marinara Gut Punch", hitZone: "torso", type: "melee", damage: 48, poiseDamage: 38, knockback: 12, meterGain: 25, duration: 17, color: "#d50000" },
            lowSweep: { name: "Noodle Low Trip", hitZone: "legs", type: "low_sweep", damage: 32, poiseDamage: 30, knockback: 9, meterGain: 18, duration: 16, color: "#fff59d" },
            special1: { name: "Marinara Kamehameha", hitZone: "torso", type: "projectile", damage: 64, poiseDamage: 45, knockback: 11, meterCost: 35, cooldown: 80, color: "#ff1744", speed: 13 },
            special2: { name: "Al Dente Transmission", hitZone: "head", type: "dash_strike", damage: 60, poiseDamage: 42, knockback: 14, meterCost: 35, cooldown: 100, color: "#ffd600", speed: 14 },
            ultimate: { name: "SPIRIT MEATBALL OF INFINITE CALORIES", hitZone: "all", type: "super", damage: 215, poiseDamage: 100, hits: 11, meterCost: 100, color: "#ff3d00", bgDim: true, freezeFrames: 55 }
        },
        quotes: {
            intro: `"Let's see if your posture can withstand true Al Dente power!"`,
            victory: `"Clean hit! Now where's the garlic bread?"`,
            taunt: `"Your guard is overcooked!"`
        }
    },
    {
        id: "mecha_shrek",
        name: "Mecha Shrek 3000",
        title: "Titanium Swamp Overlord",
        archetype: "Juggernaut",
        weightClass: "Heavyweight",
        mass: 310, // heaviest fighter
        archetypeDesc: "Depleted-uranium onion armor plates. Causes seismic arena tremors on impact.",
        tier: "S",
        mmr: 1260,
        record: { wins: 15, losses: 4, kos: 14, streaks: 5 },
        stats: {
            maxHp: 1400,
            hp: 1400,
            maxPoise: 180,
            poise: 180,
            attack: 39,
            defense: 24,
            speed: 3.9,
            critRate: 0.14,
            superGain: 1.0
        },
        anatomy: { headRatio: 0.22, torsoRatio: 0.58, legsRatio: 0.2 },
        appearance: {
            bodyType: "mech_titan",
            colors: {
                primary: "#2e7d32",
                secondary: "#1b5e20",
                accent: "#5d4037",
                glow: "#76ff03",
                eye: "#ffeb3b",
                blood: "#1b5e20"
            },
            scale: 1.35,
            particles: "#76ff03",
            battleDamageLevel: 0
        },
        moves: {
            light: { name: "Hydraulic Chin Check", hitZone: "head", type: "melee", damage: 26, poiseDamage: 22, knockback: 6, meterGain: 12, duration: 14, color: "#76ff03" },
            heavy: { name: "Depleted Onion Stomp", hitZone: "torso", type: "melee", damage: 56, poiseDamage: 55, knockback: 15, meterGain: 24, duration: 24, color: "#2e7d32" },
            lowSweep: { name: "Titanium Swamp Sweep", hitZone: "legs", type: "low_sweep", damage: 38, poiseDamage: 38, knockback: 12, meterGain: 18, duration: 22, color: "#76ff03" },
            special1: { name: "Toxic Core Missile", hitZone: "torso", type: "projectile", damage: 60, poiseDamage: 45, knockback: 12, meterCost: 35, cooldown: 100, color: "#76ff03", speed: 8 },
            special2: { name: "Swamp Armor Crash", hitZone: "head", type: "anti_air", damage: 66, poiseDamage: 50, knockback: 18, meterCost: 40, cooldown: 120, color: "#5d4037" },
            ultimate: { name: "THIS IS MY CYBER SWAMP OVERDRIVE", hitZone: "all", type: "super", damage: 205, poiseDamage: 100, hits: 6, meterCost: 100, color: "#76ff03", bgDim: true, freezeFrames: 55 }
        },
        quotes: {
            intro: `"ARMOR AT 100%. INITIATING POSTURE CRUSH SEQUENCE."`,
            victory: `"YOU ENTERED THE SWAMP. YOU PAID THE PRICE."`,
            taunt: `"YOUR WEAK STRIKES DO NOT COMPUTE."`
        }
    }
];

window.DEFAULT_ROSTER = DEFAULT_ROSTER;
