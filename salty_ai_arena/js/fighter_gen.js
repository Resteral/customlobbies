/**
 * FighterGenerator - AI Procedural Prompt-to-Fighter Synthesizer (Realistic Edition)
 * Converts text prompts into physically-grounded fighters with anatomical hitboxes,
 * mass/weight classes, poise values, frame data, and battle wear attributes.
 */
class FighterGenerator {
    constructor() {
        this.archetypes = [
            { name: "Rushdown", weightClass: "Lightweight", mass: 65, poise: 75, hpMod: 0.9, atkMod: 1.25, spdMod: 1.3, defMod: 0.85, critMod: 1.2, desc: "Agile, frame-trap combos, vulnerable to headshots" },
            { name: "Zoner", weightClass: "Middleweight", mass: 82, poise: 90, hpMod: 0.85, atkMod: 1.15, spdMod: 0.95, defMod: 0.9, critMod: 1.1, desc: "Long-range ballistics, spacing control, fragile inside" },
            { name: "Juggernaut", weightClass: "Heavyweight", mass: 220, poise: 160, hpMod: 1.4, atkMod: 1.3, spdMod: 0.7, defMod: 1.35, critMod: 0.8, desc: "Super-armor poise, bone-crushing momentum, resistant to launches" },
            { name: "Trickster", weightClass: "Lightweight", mass: 58, poise: 70, hpMod: 0.95, atkMod: 1.1, spdMod: 1.25, defMod: 1.0, critMod: 1.4, desc: "High/low mixups, deceptive whiffs, evasive roll frames" },
            { name: "Grappler", weightClass: "Heavyweight", mass: 175, poise: 140, hpMod: 1.2, atkMod: 1.35, spdMod: 0.8, defMod: 1.15, critMod: 0.9, desc: "Devastating close-range slams and poise crushers" },
            { name: "Glass Cannon", weightClass: "Lightweight", mass: 60, poise: 65, hpMod: 0.75, atkMod: 1.5, spdMod: 1.25, defMod: 0.7, critMod: 1.5, desc: "Extreme lethal damage, shattered easily by counter-hits" }
        ];

        this.themes = [
            {
                keywords: ["poptart", "pop-tart", "wombat", "toast", "pastry", "cookie", "cake", "sugar", "sweet", "berry", "strawberry", "bakery", "donut", "bread"],
                colors: { primary: "#d48d56", secondary: "#ff3377", accent: "#ffffff", glow: "#ff6699", eye: "#2b1e1a", blood: "#d81b60" },
                bodyType: "pastry_box",
                themeName: "Pastry Pastry / Sugar Fury",
                movePrefixes: ["Strawberry Jam", "Toaster Pop", "Sugar Rush", "Frosted", "Crumbly"],
                superNames: ["ULTRA CRUMB APOCALYPSE", "SUPERNOVA TOASTER POP", "FROSTED JAM HYPERBEAM"]
            },
            {
                keywords: ["cyber", "cyberpunk", "robot", "mecha", "neon", "laser", "android", "matrix", "tech", "digital", "quantum", "glitch", "ai"],
                colors: { primary: "#00d4ff", secondary: "#ff0077", accent: "#ffea00", glow: "#00f0ff", eye: "#00ffff", blood: "#00f0ff" },
                bodyType: "mech_titan",
                themeName: "Cybernetic Synth / Neon Tech",
                movePrefixes: ["Overclock", "Laser Burst", "Plasma Vortex", "Glitch Shift", "Cyber Slash"],
                superNames: ["MAXIMUM OVERCLOCK PROTOCOL", "QUANTUM LASER MATRIX", "SYSTEM PURGE 9000"]
            },
            {
                keywords: ["capybara", "chill", "zen", "nature", "forest", "bear", "panda", "sloth", "water", "river"],
                colors: { primary: "#795548", secondary: "#a1887f", accent: "#4caf50", glow: "#76ff03", eye: "#3e2723", blood: "#4e342e" },
                bodyType: "quadruped_beast",
                themeName: "Zen Mammal / Earth Heavy",
                movePrefixes: ["Zen Slap", "Heavy Splash", "Unbothered Stance", "Hot Spring Geyser", "Citrus Roll"],
                superNames: ["ULTIMATE TRANQUILITY TSUNAMI", "HOT SPRING SUPERNOVA", "CAPYBARA COSMIC AURA"]
            },
            {
                keywords: ["goku", "saiyan", "dragon", "spaghetti", "noodle", "pasta", "meatball", "ramen", "carb", "italian"],
                colors: { primary: "#ff8f00", secondary: "#c62828", accent: "#fff59d", glow: "#ffd600", eye: "#ff3d00", blood: "#b71c1c" },
                bodyType: "humanoid",
                themeName: "Carbo-Saiyan / Pasta Overdrive",
                movePrefixes: ["Marinara Kamehameha", "Meatball Meteor", "Noodle Whip", "Al Dente Barrage", "Parmesan Shield"],
                superNames: ["SPIRIT MEATBALL OF DOOM", "SUPER SAIYAN AL DENTE X100", "INFINITE NOODLE CATACLYSM"]
            },
            {
                keywords: ["espresso", "coffee", "caffeine", "bean", "barista", "latte", "steam", "pressure", "anxious", "jitter"],
                colors: { primary: "#3e2723", secondary: "#cfd8dc", accent: "#ff6d00", glow: "#ff9100", eye: "#ffffff", blood: "#ff6d00" },
                bodyType: "floating_orb",
                themeName: "Hyper-Caffeinated Steam Fiend",
                movePrefixes: ["15-Bar Steam Blast", "Double Shot Jitter", "Boiling Crema", "Panic Dash", "Espresso Cannon"],
                superNames: ["TRIPLE SHOT OVERPRESSURE MELTDOWN", "CAFFEINE OVERDOSE LIGHTNING", "BOILING AMERICANO APOCALYPSE"]
            },
            {
                keywords: ["duck", "chainsaw", "vampire", "blood", "bat", "horror", "goth", "shadow", "demon", "skull", "dark"],
                colors: { primary: "#1e1e24", secondary: "#b71c1c", accent: "#ff1744", glow: "#d50000", eye: "#ff1744", blood: "#d50000" },
                bodyType: "avian_winged",
                themeName: "Gothic Havoc / Blood Feathers",
                movePrefixes: ["Chainsaw Quack", "Vampiric Dive", "Crimson Flap", "Scythe Feathers", "Dread Beak"],
                superNames: ["BLOODMOON CHAINSAW SLAUGHTER", "ETERNAL DREAD QUACK", "CRIMSON VAMPIRE ECLIPSE"]
            },
            {
                keywords: ["shrek", "ogre", "swamp", "onion", "green", "monster", "slime", "goblin", "frog", "toad"],
                colors: { primary: "#43a047", secondary: "#2e7d32", accent: "#795548", glow: "#76ff03", eye: "#ffeb3b", blood: "#33691e" },
                bodyType: "mech_titan",
                themeName: "Swamp Titan / Toxic Layer",
                movePrefixes: ["Onion Layer Slam", "Swamp Belch", "Mud Slide", "Heavy Belly Flop", "Toxic Stink"],
                superNames: ["THIS IS MY SWAMP OVERDRIVE", "TITANIC ONION DETONATION", "GREAT SWAMP COLLAPSE"]
            }
        ];

        this.randomPromptIdeas = [
            "Pop-Tart Wombat",
            "Cyberpunk Capybara",
            "Goku made of Spaghetti",
            "Anxious Espresso Machine",
            "Vampire Chainsaw Duck",
            "Neon Laser Chihuahua",
            "Mecha Shrek 3000",
            "Quantum Barista Goblin",
            "Nuclear Burrito Dragon",
            "Salty Pretzel Samurai",
            "Disco Bigfoot with Nunchucks",
            "Grandma with an Orbital Strike Cannon",
            "Glitch Wizard 404",
            "Spicy Wasabi Ninja",
            "Interdimensional Axolotl",
            "Heavy Metal Penguin"
        ];
    }

    getRandomIdea() {
        return this.randomPromptIdeas[Math.floor(Math.random() * this.randomPromptIdeas.length)];
    }

    generateFighter(prompt) {
        const cleanPrompt = (prompt || "Mysterious Challenger").trim();
        const lower = cleanPrompt.toLowerCase();

        let seed = 0;
        for (let i = 0; i < lower.length; i++) {
            seed = (seed * 31 + lower.charCodeAt(i)) & 0xFFFFFFF;
        }
        const rng = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        let matchedTheme = this.themes.find(t => t.keywords.some(k => lower.includes(k)));
        if (!matchedTheme) {
            const hue1 = Math.floor(rng() * 360);
            const hue2 = (hue1 + 120 + Math.floor(rng() * 60)) % 360;
            const hue3 = (hue1 + 240 + Math.floor(rng() * 60)) % 360;

            const bodyTypes = ["humanoid", "quadruped_beast", "pastry_box", "floating_orb", "mech_titan", "slime_blob", "avian_winged"];
            const selectedBody = bodyTypes[Math.floor(rng() * bodyTypes.length)];

            matchedTheme = {
                keywords: [],
                colors: {
                    primary: `hsl(${hue1}, 75%, 45%)`,
                    secondary: `hsl(${hue2}, 70%, 40%)`,
                    accent: `hsl(${hue3}, 85%, 60%)`,
                    glow: `hsl(${hue1}, 100%, 65%)`,
                    eye: `#ffffff`,
                    blood: `hsl(${hue1}, 80%, 30%)`
                },
                bodyType: selectedBody,
                themeName: "Mystic Combatant",
                movePrefixes: ["Cosmic Blast", "Void Dash", "Hyper Strike", "Astral Surge", "Nova Cannon"],
                superNames: ["CELESTIAL REALM DEVASTATION", "GENESIS PRIME EXPLOSION", "FINAL DIMENSIONAL SHIFT"]
            };
        }

        const archetypeIndex = Math.floor(rng() * this.archetypes.length);
        const arch = this.archetypes[archetypeIndex];

        const baseHp = 1000 + Math.floor((rng() - 0.5) * 150);
        const baseAtk = 25 + Math.floor((rng() - 0.5) * 6);
        const baseDef = 12 + Math.floor((rng() - 0.5) * 4);
        const baseSpd = 5.0 + (rng() - 0.5) * 1.2;
        const baseCrit = 0.12 + (rng() - 0.5) * 0.06;

        const hp = Math.round(baseHp * arch.hpMod);
        const attack = Math.round(baseAtk * arch.atkMod);
        const defense = Math.round(baseDef * arch.defMod);
        const speed = parseFloat((baseSpd * arch.spdMod).toFixed(1));
        const crit = parseFloat((baseCrit * arch.critMod).toFixed(2));
        const superGain = parseFloat((1.0 + (rng() - 0.5) * 0.4).toFixed(2));
        const poise = Math.round(arch.poise + (rng() - 0.5) * 20);
        const mass = Math.round(arch.mass + (rng() - 0.5) * 15);

        const moves = this.generateRealisticMoveSet(cleanPrompt, matchedTheme, rng);
        const quotes = this.generateQuotes(cleanPrompt, matchedTheme, arch, rng);
        const id = 'fighter_' + Math.random().toString(36).substr(2, 9);

        return {
            id: id,
            name: cleanPrompt,
            title: this.generateTitle(cleanPrompt, matchedTheme, arch, rng),
            archetype: arch.name,
            archetypeDesc: arch.desc,
            weightClass: arch.weightClass,
            mass: mass, // in kg, affects launch height & inertia
            tier: "A",
            mmr: 1000 + Math.floor((rng() - 0.5) * 100),
            record: { wins: 0, losses: 0, kos: 0, streaks: 0 },
            stats: {
                maxHp: hp,
                hp: hp,
                maxPoise: poise,
                poise: poise,
                attack: attack,
                defense: defense,
                speed: speed,
                critRate: crit,
                superGain: superGain
            },
            anatomy: {
                headRatio: 0.28,   // head hitzone height ratio
                torsoRatio: 0.45,  // torso hitzone height ratio
                legsRatio: 0.27    // legs hitzone height ratio
            },
            appearance: {
                bodyType: matchedTheme.bodyType,
                colors: matchedTheme.colors,
                scale: 0.95 + rng() * 0.25,
                particles: matchedTheme.colors.glow,
                battleDamageLevel: 0
            },
            moves: moves,
            quotes: quotes,
            createdAt: Date.now()
        };
    }

    generateTitle(name, theme, arch, rng) {
        const prefixes = ["The Legendary", "The Unstoppable", "The Apex", "Grandmaster", "Supreme", "Heavyweight", "Master of", "Atomic", "Cyber"];
        const suffixes = ["of Destiny", "the Undefeated", "the Destroyer", "of Salt", "Prime", "the Invincible", "the Iron Fist"];

        if (rng() > 0.5) {
            return `${prefixes[Math.floor(rng() * prefixes.length)]} ${name}`;
        } else {
            return `${name} ${suffixes[Math.floor(rng() * suffixes.length)]}`;
        }
    }

    generateRealisticMoveSet(name, theme, rng) {
        const p = theme.movePrefixes;
        const s = theme.superNames;

        const move1Name = p[Math.floor(rng() * p.length)] + " " + (["Jab", "Claw Thrust", "Quick Strike", "Cross", "Slice"][Math.floor(rng() * 5)]);
        const move2Name = p[Math.floor(rng() * p.length)] + " " + (["Heavy Uppercut", "Seismic Stomp", "Crushing Cleave", "Body Slam", "Sledge"][Math.floor(rng() * 5)]);
        const move3Name = p[Math.floor(rng() * p.length)] + " " + (["Low Sweep", "Trip Kick", "Leg Scythe", "Slide Tackle", "Floor Gouge"][Math.floor(rng() * 5)]);
        const superName = s[Math.floor(rng() * s.length)];

        return {
            light: {
                name: "High Jab (Headshot)",
                hitZone: "head", // head, torso, legs
                type: "melee",
                damage: 18,
                poiseDamage: 12,
                knockback: 4,
                meterGain: 12,
                startupFrames: 4,
                activeFrames: 3,
                recoveryFrames: 5,
                duration: 12,
                color: theme.colors.accent
            },
            heavy: {
                name: "Heavy Body Hook",
                hitZone: "torso",
                type: "melee",
                damage: 38,
                poiseDamage: 32,
                knockback: 11,
                meterGain: 22,
                startupFrames: 8,
                activeFrames: 5,
                recoveryFrames: 10,
                duration: 23,
                color: theme.colors.primary
            },
            lowSweep: {
                name: move3Name,
                hitZone: "legs", // Sweeps low - bypasses standing block!
                type: "low_sweep",
                damage: 28,
                poiseDamage: 25,
                knockback: 8,
                meterGain: 16,
                startupFrames: 7,
                activeFrames: 4,
                recoveryFrames: 9,
                duration: 20,
                color: theme.colors.secondary
            },
            special1: {
                name: move1Name,
                hitZone: "torso",
                type: rng() > 0.4 ? "projectile" : "dash_strike",
                damage: 48,
                poiseDamage: 38,
                knockback: 9,
                meterCost: 25,
                cooldown: 80,
                color: theme.colors.glow,
                speed: 9
            },
            special2: {
                name: move2Name,
                hitZone: "head",
                type: "anti_air",
                damage: 58,
                poiseDamage: 45,
                knockback: 16,
                meterCost: 35,
                cooldown: 110,
                color: theme.colors.secondary
            },
            ultimate: {
                name: superName,
                hitZone: "all",
                type: "super",
                damage: 175,
                poiseDamage: 100,
                hits: 8,
                meterCost: 100,
                color: theme.colors.glow,
                bgDim: true,
                freezeFrames: 45
            }
        };
    }

    generateQuotes(name, theme, arch, rng) {
        const intros = [
            `"Check the tape. You have zero answers for my reach."`,
            `"Prepare for optimal impact trajectory."`,
            `"Odds makers didn't calculate this frame advantage!"`,
            `"Protect your chin, because this ends round one."`,
            `"Let's see if your guard can handle 200 kilos of force!"`
        ];

        const victories = [
            `"Clean counter-hit. Flawless execution."`,
            `"Read like a book. EZ SaltyBucks!"`,
            `"Heavyweight power always claims the belt."`,
            `"Chat in shambles! The underdog takes the bag!"`,
            `"Total knockout. Respect the weight class!"`
        ];

        const taunts = [
            `"Wide open! What a whiff!"`,
            `"Drop your hands again, see what happens!"`,
            `"Your guard is already cracking!"`,
            `"Too slow on the tech roll!"`
        ];

        return {
            intro: intros[Math.floor(rng() * intros.length)],
            victory: victories[Math.floor(rng() * victories.length)],
            taunt: taunts[Math.floor(rng() * taunts.length)]
        };
    }
}

window.fighterGenerator = new FighterGenerator();
