--[[
    City Underground - Shared Skills & Progression System
    Defines roleplay skills, XP curves, and passive perk bonuses.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Skills = CityUnderground.Skills or {}
CityUnderground.Skills.List = {
    ["synthesis"] = {
        name = "Chemical Synthesis",
        description = "Expertise in operating chemical reactors and contraband synthesis labs.",
        icon = "⚗️",
        maxLevel = 5,
        perks = {
            [1] = "Standard compound synthesis.",
            [2] = "Reduces synthesis cycle time by 15%.",
            [3] = "10% chance to yield bonus contraband crystal.",
            [4] = "Reduces police detection risk by 20%.",
            [5] = "Master Alchemist: 30% faster synthesis and maximum purity."
        }
    },
    ["lockpicking"] = {
        name = "Lockpicking & Burglary",
        description = "Dexterity with tension wrenches and picking security pins.",
        icon = "🗝️",
        maxLevel = 5,
        perks = {
            [1] = "Ability to pick standard vehicle locks.",
            [2] = "Increases sweet spot angle by 20%.",
            [3] = "Reduces pick break chance by 30%.",
            [4] = "Ability to pick apartment security locks.",
            [5] = "Master Burglar: Silent lockpicking without alarm triggers."
        }
    },
    ["botany"] = {
        name = "Botany & Agriculture",
        description = "Knowledge of hydroponics, soil fertilizers, and plant yield cycles.",
        icon = "🌱",
        maxLevel = 5,
        perks = {
            [1] = "Ability to plant and harvest basic herbal pots.",
            [2] = "Reduces water consumption by 20%.",
            [3] = "Increases crop growth speed by 25%.",
            [4] = "Increases harvest yield by +1 item.",
            [5] = "Green Thumb: Double harvest yields and rapid germination."
        }
    },
    ["driving"] = {
        name = "Vehicle Handling & Driving",
        description = "Precision behind the wheel, fuel efficiency, and high-speed control.",
        icon = "🏎️",
        maxLevel = 5,
        perks = {
            [1] = "Standard civilian vehicle operation.",
            [2] = "Reduces fuel consumption rate by 15%.",
            [3] = "Increases top speed acceleration by 10%.",
            [4] = "Reduces vehicle crash damage by 25%.",
            [5] = "Stunt Driver: Max handling traction and drift control."
        }
    },
    ["medical"] = {
        name = "Emergency Medicine",
        description = "Application of trauma dressings, CPR, and medical diagnostics.",
        icon = "🩹",
        maxLevel = 5,
        perks = {
            [1] = "Application of standard bandages.",
            [2] = "First aid kits restore +20% extra health.",
            [3] = "Reduces treatment application time by 30%.",
            [4] = "Ability to revive incapacitated citizens.",
            [5] = "Chief Surgeon: Instant stabilization and full health recovery."
        }
    },
    ["strength"] = {
        name = "Physical Strength & Athletics",
        description = "Carrying capacity, prop shoving torque, melee power, and sprint stamina.",
        icon = "💪",
        maxLevel = 5,
        perks = {
            [1] = "+5kg Carry Weight & Standard Shoving",
            [2] = "+10kg Carry Weight & 20% Melee Impact",
            [3] = "+15kg Carry Weight & Ability to shove heavy cast-iron stoves",
            [4] = "+20kg Carry Weight & 35% Faster Sprint Stamina Recovery",
            [5] = "Titan Physique: +25kg Max Carry Weight, 50% Melee Bonus & Superhuman Prop Throwing"
        }
    },
    ["cooking"] = {
        name = "Culinary Arts & Nutrition",
        description = "Gourmet food preparation, flavor balancing, hunger/thirst restoration, and physical nourishment buffs.",
        icon = "🍳",
        maxLevel = 5,
        perks = {
            [1] = "Basic skillet cooking (Scrambled eggs, coffee, snacks).",
            [2] = "Reduces cooking preparation time by 20%.",
            [3] = "Hot meals restore +25% extra hunger and health.",
            [4] = "Meals provide a +15% sprint stamina and endurance buff.",
            [5] = "Master Chef: Gourmet 5-star feasts grant full needs replenishment and +10kg carry capacity buff."
        }
    }
}

-- Calculate level from XP
function CityUnderground.Skills.GetLevelFromXP(xp)
    xp = xp or 0
    if xp >= 5000 then return 5 end
    if xp >= 2500 then return 4 end
    if xp >= 1000 then return 3 end
    if xp >= 350 then return 2 end
    return 1
end
