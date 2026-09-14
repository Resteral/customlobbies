--[[
    Helix Data-Driven Custom Systems Engine
    Allows developers & admins to register entire interactive systems, processors,
    and workbenches with simple declarative data tables.
]]--

ix.customSystems = ix.customSystems or {}
ix.customSystems.stored = ix.customSystems.stored or {}

-- Register a new system definition
function ix.customSystems.Register(id, data)
    data.id = id
    data.name = data.name or "Interactive Station"
    data.model = data.model or "models/props_c17/furnituretable002a.mdl"
    data.category = data.category or "Workbenches"
    data.processTime = data.processTime or 5
    data.inputs = data.inputs or {}
    data.outputs = data.outputs or {}
    data.reqSkills = data.reqSkills or {}
    data.xp = data.xp or { skill = "crafting", amount = 25 }
    data.startSound = data.startSound or "ambient/machines/combine_terminal_idle1.wav"
    data.finishSound = data.finishSound or "ambient/levels/labs/coinslot1.wav"
    data.color = data.color or Color(52, 152, 219)

    ix.customSystems.stored[id] = data
end

function ix.customSystems.Get(id)
    return ix.customSystems.stored[id]
end

function ix.customSystems.GetAll()
    return ix.customSystems.stored
end

-- Verify if player has required skills
function ix.customSystems.HasRequirements(client, systemID)
    local system = ix.customSystems.Get(systemID)
    if not system then return false, "Invalid system." end

    local char = client:GetCharacter()
    if not char then return false, "No character found." end

    -- Check skills if PERP skill system is loaded
    if system.reqSkills and char.GetSkillLevel then
        for skillName, reqLvl in pairs(system.reqSkills) do
            local curLvl = char:GetSkillLevel(skillName) or 0
            if curLvl < reqLvl then
                return false, string.format("Requires %s Level %d (You have Level %d)", string.upper(skillName), reqLvl, curLvl)
            end
        end
    end

    -- Check ingredients in character inventory
    local inv = char:GetInventory()
    if not inv then return false, "No inventory." end

    for itemID, count in pairs(system.inputs) do
        local itemCount = inv:GetItemCount(itemID)
        if itemCount < count then
            local itemTable = ix.item.list[itemID]
            local itemName = itemTable and itemTable.name or itemID
            return false, string.format("Missing %dx %s (You have %d)", count, itemName, itemCount)
        end
    end

    return true, "Ready"
end

-- Pre-register built-in game systems
ix.customSystems.Register("weed_processor", {
    name = "Hydroponic Weed Packaging Station",
    category = "Drug Processing",
    model = "models/props_c17/furnituretable002a.mdl",
    processTime = 4,
    reqSkills = { botany = 1 },
    inputs = { ["weed_plant"] = 2 },
    outputs = { ["packaged_weed"] = 1 },
    xp = { skill = "botany", amount = 35 },
    startSound = "weapons/knife/knife_slash1.wav",
    finishSound = "items/itempickup.wav",
    color = Color(46, 204, 113)
})

ix.customSystems.Register("ammo_press", {
    name = "Industrial Ammo Reloading Press",
    category = "Ballistics & Armory",
    model = "models/props_c17/furnituretable001a.mdl",
    processTime = 6,
    reqSkills = { crafting = 2 },
    inputs = { ["scrap_metal"] = 2 },
    outputs = { ["pistol_ammo"] = 1 },
    xp = { skill = "crafting", amount = 40 },
    startSound = "ambient/machines/keyboard2_clicks.wav",
    finishSound = "weapons/smg1/smg1_reload.wav",
    color = Color(230, 126, 34)
})

ix.customSystems.Register("crypto_miner", {
    name = "Quantum Crypto Decryption Node",
    category = "Cyber & Hacking",
    model = "models/props_lab/reciever01a.mdl",
    processTime = 8,
    reqSkills = { crafting = 3 },
    inputs = { ["crypto_usb"] = 1 },
    outputs = { ["clean_cash"] = 250 },
    xp = { skill = "crafting", amount = 60 },
    startSound = "ambient/machines/combine_terminal_idle4.wav",
    finishSound = "buttons/bell1.wav",
    color = Color(155, 89, 182)
})
