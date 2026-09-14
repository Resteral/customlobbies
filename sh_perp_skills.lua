-- PERP Skill System Definitions for Helix
local PLUGIN = PLUGIN

PLUGIN.Skills = PLUGIN.Skills or {}

-- Define the 6 PERP Core Skills
PLUGIN.Skills = {
    ["crafting"] = {
        name = "Engineering & Crafting",
        desc = "Improves crafting speed, reduces material waste, and unlocks advanced blueprint tiers.",
        maxLevel = 20,
        icon = "wrench",
        color = Color(243, 156, 18),
        perks = {
            [5] = "Apprentice: 10% faster crafting speed.",
            [10] = "Journeyman: Unlocks military tier weapon & armor recipes.",
            [15] = "Master: 25% chance to salvage half materials on craft.",
            [20] = "Grandmaster: Instant crafting for basic items & 30% speed boost."
        }
    },
    ["chemistry"] = {
        name = "Botany & Chemistry",
        desc = "Increases drug potency, weed harvest yields, cook quality, and fertilizer efficiency.",
        maxLevel = 20,
        icon = "flask",
        color = Color(46, 204, 113),
        perks = {
            [5] = "Green Thumb: +15% weed yield per harvest.",
            [10] = "Synthesizer: Drug purity increased by 20% on all batches.",
            [15] = "Lab Master: Meth cook speed +30% and immune to toxic fumes.",
            [20] = "Heisenberg: Pure 100% batches sell for 1.5x market price."
        }
    },
    ["lockpicking"] = {
        name = "Burglary & Lockpicking",
        desc = "Expands sweet-spot angle in lockpicking, speeds up safe drilling, and reduces alarm triggers.",
        maxLevel = 20,
        icon = "key",
        color = Color(155, 89, 182),
        perks = {
            [5] = "Pickpocket: Lockpicks have 20% less chance to break.",
            [10] = "Burglar: Safe drilling time reduced by 25%.",
            [15] = "Ghost: 40% chance silent bypass without triggering police alarm.",
            [20] = "Infiltrator: Master lockpicking sweet-spot widened by 100%."
        }
    },
    ["marksmanship"] = {
        name = "Marksmanship & Combat",
        desc = "Reduces weapon recoil, speeds up reloading, and increases stamina recovery.",
        maxLevel = 20,
        icon = "crosshair",
        color = Color(231, 76, 60),
        perks = {
            [5] = "Steady Aim: 15% recoil reduction.",
            [10] = "Fast Hands: 20% faster weapon reload speed.",
            [15] = "Battle Hardened: 25% stamina depletion reduction while sprinting.",
            [20] = "Deadeye: Pinpoint precision and minimal flinch when taking damage."
        }
    },
    ["driving"] = {
        name = "Driving & Mechanics",
        desc = "Increases vehicle top speed control, reduces fuel consumption, and improves vehicle repair speed.",
        maxLevel = 20,
        icon = "car",
        color = Color(52, 152, 219),
        perks = {
            [5] = "Cruiser: 15% reduced vehicle fuel consumption.",
            [10] = "Mechanic: Repair kits restore 50% more vehicle health.",
            [15] = "Racer: 20% increased vehicle acceleration and drift traction.",
            [20] = "Transporter: Complete immunity to vehicle engine stalls on collision."
        }
    },
    ["medical"] = {
        name = "Medical & First Aid",
        desc = "Increases health recovered from bandages/medkits and accelerates player revival.",
        maxLevel = 20,
        icon = "heart",
        color = Color(26, 188, 156),
        perks = {
            [5] = "First Responder: Bandages heal 25% more HP.",
            [10] = "Paramedic: Medkit application time halved.",
            [15] = "Combat Medic: Defibrillators and revivals succeed with full HP.",
            [20] = "Surgeon: Passive passive HP regeneration when out of combat."
        }
    }
}

-- Calculate XP required for a given level: Base * (level ^ 1.75)
function PLUGIN:GetRequiredSkillXP(level)
    if level <= 1 then return 100 end
    return math.floor(100 * math.pow(level, 1.75))
end
