--[[
    City Underground - Server Base Building & House Creator Engine
    Server-authoritative furniture placement, budget validation, persistent JSON saving, and interactions.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.BaseBuilder = CityUnderground.BaseBuilder or {}
CityUnderground.BaseBuilder.ActiveBases = CityUnderground.BaseBuilder.ActiveBases or {}

local BASE_DATA_DIR = "city_underground/player_bases/"

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Base_PlaceObject")
    util.AddNetworkString("CU_Base_RemoveObject")
    util.AddNetworkString("CU_Base_MoveObject")
    util.AddNetworkString("CU_Base_SyncLayout")
    util.AddNetworkString("CU_Base_InteractObject")
    util.AddNetworkString("CU_Base_TriggerDefense")
    util.AddNetworkString("CU_Base_BroadcastDefenseAlert")
end

-- Initialize Directory
function CityUnderground.BaseBuilder.Init()
    if file and file.CreateDir then
        file.CreateDir("city_underground")
        file.CreateDir("city_underground/player_bases")
    end
end

-- Get base save path
local function GetBasePath(charId, propId)
    return BASE_DATA_DIR .. tostring(charId):gsub("[:/\\]", "_") .. "_" .. tostring(propId) .. ".json"
end

-- Load Base Layout from Persistent Storage
function CityUnderground.BaseBuilder.LoadBaseLayout(charId, propId)
    local key = tostring(charId) .. "_" .. tostring(propId)
    if CityUnderground.BaseBuilder.ActiveBases[key] then
        return CityUnderground.BaseBuilder.ActiveBases[key]
    end

    local path = GetBasePath(charId, propId)
    if file and file.Exists and file.Exists(path, "DATA") then
        local raw = file.Read(path, "DATA")
        local data = util.JSONToTable(raw)
        if data and type(data) == "table" then
            CityUnderground.BaseBuilder.ActiveBases[key] = data
            return data
        end
    end

    CityUnderground.BaseBuilder.ActiveBases[key] = {
        propertyId = propId,
        ownerCharId = charId,
        objects = {}
    }
    return CityUnderground.BaseBuilder.ActiveBases[key]
end

-- Save Base Layout to Persistent Storage
function CityUnderground.BaseBuilder.SaveBaseLayout(charId, propId)
    local key = tostring(charId) .. "_" .. tostring(propId)
    local baseData = CityUnderground.BaseBuilder.ActiveBases[key]
    if not baseData then return end

    local path = GetBasePath(charId, propId)
    local jsonStr = util.TableToJSON(baseData, true)
    if file and file.Write then
        file.Write(path, jsonStr)
    end
end

-- Place Furniture Object
function CityUnderground.BaseBuilder.PlaceObject(ply, propId, catalogId, gridX, gridY, rotation, customColor)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false, "No active character" end

    local itemDef = CityUnderground.BaseBuilder.Catalog[catalogId]
    if not itemDef then return false, "Invalid catalog item" end

    -- Verify Real Estate Deed Ownership / Building Permission
    if CityUnderground.Property and CityUnderground.Property.HasBuildingPermission then
        if not CityUnderground.Property.HasBuildingPermission(char.id, propId) then
            if ply and ply.Notify then
                ply:Notify("🔒 You do not own the real estate deed for this property! Purchase or lease the deed first.")
            end
            return false, "Deed ownership required to build bases here"
        end
    end

    -- Verify Bank/Cash Funds
    local price = itemDef.price or 100
    if (char.bank or 0) < price then
        return false, "Insufficient funds in bank account"
    end

    local baseData = CityUnderground.BaseBuilder.LoadBaseLayout(char.id, propId)
    baseData.objects = baseData.objects or {}

    -- Check maxPerProperty limit (e.g. 1 Work Bench, 1 Crafting Bench per house)
    if itemDef.maxPerProperty then
        local count = 0
        for _, obj in ipairs(baseData.objects) do
            if obj.catalogId == catalogId then
                count = count + 1
            end
        end
        if count >= itemDef.maxPerProperty then
            if ply and ply.Notify then
                ply:Notify("⚠️ Property Limit: You can only build " .. itemDef.maxPerProperty .. " " .. itemDef.name .. " per house!")
            end
            return false, "Property limit reached for this item"
        end
    end

    local objId = "obj_" .. catalogId .. "_" .. os.time() .. "_" .. math.random(100, 999)
    local placedRecord = {
        id = objId,
        catalogId = catalogId,
        name = itemDef.name,
        gridX = gridX or 0,
        gridY = gridY or 0,
        rotation = rotation or 0,
        color = customColor or itemDef.color,
        placedAt = os.time()
    }

    table.insert(baseData.objects, placedRecord)
    char.bank = char.bank - price

    CityUnderground.Economy.LogTransaction(char.id, "PURCHASE", "Purchased & Placed " .. itemDef.name, -price)
    CityUnderground.Character.SyncStats(ply)
    CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
    CityUnderground.BaseBuilder.SyncToPlayer(ply, propId)

    return true, placedRecord
end

-- Remove / Sell Furniture Object
function CityUnderground.BaseBuilder.RemoveObject(ply, propId, objId)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    local baseData = CityUnderground.BaseBuilder.LoadBaseLayout(char.id, propId)
    for i, obj in ipairs(baseData.objects or {}) do
        if obj.id == objId then
            local itemDef = CityUnderground.BaseBuilder.Catalog[obj.catalogId]
            local refund = math.floor((itemDef and itemDef.price or 100) * 0.7) -- 70% sellback refund

            table.remove(baseData.objects, i)
            char.bank = (char.bank or 0) + refund

            CityUnderground.Economy.LogTransaction(char.id, "SALE", "Sold Furniture: " .. (obj.name or "Item"), refund)
            CityUnderground.Character.SyncStats(ply)
            CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
            CityUnderground.BaseBuilder.SyncToPlayer(ply, propId)
            return true
        end
    end
    return false
end

-- Move Placed Object
function CityUnderground.BaseBuilder.MoveObject(ply, propId, objId, newGridX, newGridY, newRotation)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    local baseData = CityUnderground.BaseBuilder.LoadBaseLayout(char.id, propId)
    for _, obj in ipairs(baseData.objects or {}) do
        if obj.id == objId then
            obj.gridX = newGridX
            obj.gridY = newGridY
            obj.rotation = newRotation
            CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
            CityUnderground.BaseBuilder.SyncToPlayer(ply, propId)
            return true
        end
    end
    return false
end

-- Sync Layout to Client
function CityUnderground.BaseBuilder.SyncToPlayer(ply, propId)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return end

    local baseData = CityUnderground.BaseBuilder.LoadBaseLayout(char.id, propId)
    if net and net.Start then
        net.Start("CU_Base_SyncLayout")
        net.WriteString(propId)
        net.WriteTable(baseData.objects or {})
        net.Send(ply)
    end
end

-- Trigger / Interact with Defense Entity
function CityUnderground.BaseBuilder.InteractDefense(ply, propId, objId, actionType, customData)
    local char = CityUnderground.Character.GetActive(ply)
    if not char then return false end

    local baseData = CityUnderground.BaseBuilder.LoadBaseLayout(char.id, propId)
    local targetObj = nil
    for _, obj in ipairs(baseData.objects or {}) do
        if obj.id == objId then
            targetObj = obj
            break
        end
    end

    if not targetObj then return false end
    local itemDef = CityUnderground.BaseBuilder.Catalog[targetObj.catalogId]
    if not itemDef then return false end

    -- Handle Suburban Warfare & Defense Traps
    if targetObj.catalogId == "suburban_claymore_gnome" or actionType == "TEST_GNOME" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("💥 CRUNCH! Tactical Claymore Lawn Gnome detonated directional blast at perimeter!")
            net.WriteString("#e11d48")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "suburban_chem_sprinkler" or actionType == "TEST_SPRINKLER" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("💦 PSHHH! High-Pressure Pepper Sprinkler activated! Caustic tear-gas mist deployed!")
            net.WriteString("#06b6d4")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "suburban_firework_mortar" or actionType == "TEST_FIREWORKS" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🎆 *SCREEECH-BOOM!* Tripwire Mortar Box launched rapid pyrotechnic barrage!")
            net.WriteString("#f59e0b")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "suburban_electric_gate" or actionType == "TOGGLE_VOLTAGE" then
        targetObj.isEnergized = not targetObj.isEnergized
        local status = targetObj.isEnergized and "ENERGIZED (5,000V)" or "DE-ENERGIZED"
        CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("⚡ Electrified Picket Gate capacitor set to: " .. status)
            net.WriteString("#eab308")
            net.Send(ply)
        end
        return true
    elseif targetObj.catalogId == "suburban_oil_slick" or actionType == "DISPENSE_OIL" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🛢️ SLIP! Driveway grease sprayer discharged slick friction-reducing puddle!")
            net.WriteString("#71717a")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "suburban_mailbox_alarm" or actionType == "TEST_MAILBOX" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("📬 🚨 BOOBY-TRAP TRIPPED! Suburban Mailbox Siren screaming! 911 dispatch alerted!")
            net.WriteString("#3b82f6")
            net.Broadcast()
        end
        if CityUnderground.Police and CityUnderground.Police.AddCADCall then
            CityUnderground.Police.AddCADCall("911 - Residential Mailbox Tamper Alarm", "Property " .. propId, "Automated Security Alert")
        end
        return true
    elseif targetObj.catalogId == "suburban_megaphone_pa" or actionType == "BROADCAST_MEGAPHONE" then
        local voiceLines = {
            "📢 [PA SYSTEM]: 'GET OFF MY LAWN! THIS IS PRIVATE SUBURBAN PROPERTY!'",
            "📢 [PA SYSTEM]: 'TRESPASSERS WILL BE COMPOSTED! BACK AWAY IMMEDIATELY!'",
            "📢 [PA SYSTEM]: 'POLICE ARE DISPATCHED! DROP YOUR WEAPONS AND VACATE THE DRIVEWAY!'"
        }
        local line = voiceLines[math.random(1, #voiceLines)]
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString(line)
            net.WriteString("#fbbf24")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "barricade_flippable_bookshelf" or actionType == "FLIP_STAND" then
        targetObj.isFlipped = not targetObj.isFlipped
        local posture = targetObj.isFlipped and "UPRIGHT BARRICADE (1,500 HP Corridor Wedge)" or "Normal Bookshelf"
        CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("📚 Heavy Oak Bookshelf flipped into: " .. posture .. "!")
            net.WriteString("#78350f")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "barricade_flippable_table" or actionType == "FLIP_TABLE" then
        targetObj.isFlipped = not targetObj.isFlipped
        local posture = targetObj.isFlipped and "GUN-SHIELD BUNKER (1,100 HP Firing Cover)" or "Normal Dining Table"
        CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🪑 Steel-Reinforced Table kicked over into: " .. posture .. "!")
            net.WriteString("#451a03")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "defense_door_wedge" or actionType == "JAM_DOOR" then
        targetObj.isJammed = not targetObj.isJammed
        local jamState = targetObj.isJammed and "ENGAGED (Door Firmly Jammed Shut)" or "REMOVED"
        CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🛑 Titanium Door Jammer Wedge: " .. jamState .. " - Lockpick entry blocked!")
            net.WriteString("#0284c7")
            net.Send(ply)
        end
        return true
    elseif targetObj.catalogId == "defense_lock_electrifier" or actionType == "TEST_STUN_RIG" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("⚡ ZZZZZT! Anti-Lockpick Handle Stun Rig discharged 10,000V capacitor shock!")
            net.WriteString("#eab308")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "defense_door_flashbang_trip" or actionType == "TEST_FLASH_RIG" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("💥 *FLASH-BANG!* Door-Mounted Flashbang Rig detonated in doorway! Raiders blinded!")
            net.WriteString("#f97316")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "defense_falling_cabinet_trap" or actionType == "TEST_DROP_TRAP" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🗄️ *CRASH!* Tilted Heavy Filing Cabinet collapsed onto doorway! 80 Crushing Damage dealt!")
            net.WriteString("#475569")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "barricade_heavy_wardrobe" or targetObj.catalogId == "furniture_cast_iron_stove_blocker" or actionType == "SHOVE_BARRICADE" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🚪 *SCREECH!* Heavy obstruction barricade shoved into position against entrance doorway!")
            net.WriteString("#292524")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "suburban_strobe_floodlight" or actionType == "TEST_STROBE" then
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🔦 FLASH! 50,000 Lumen Strobe Spotlight engaged in high-frequency pulse mode!")
            net.WriteString("#fef08a")
            net.Broadcast()
        end
        return true
    elseif targetObj.catalogId == "suburban_garage_blast_door" or actionType == "TOGGLE_SHUTTER" then
        targetObj.isOpen = not targetObj.isOpen
        local stateStr = targetObj.isOpen and "OPENED" or "LOCKED & SEALED"
        CityUnderground.BaseBuilder.SaveBaseLayout(char.id, propId)
        if net and net.Start then
            net.Start("CU_Base_BroadcastDefenseAlert")
            net.WriteString("🛡️ Heavy Garage Blast Shutter motorized state: " .. stateStr)
            net.WriteString("#38bdf8")
            net.Send(ply)
        end
        return true
    end

    return true
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Base_PlaceObject", function(len, ply)
        local propId = net.ReadString()
        local catalogId = net.ReadString()
        local gridX = net.ReadInt(16)
        local gridY = net.ReadInt(16)
        local rot = net.ReadInt(16)
        local color = net.ReadString()

        CityUnderground.BaseBuilder.PlaceObject(ply, propId, catalogId, gridX, gridY, rot, color)
    end)

    net.Receive("CU_Base_RemoveObject", function(len, ply)
        local propId = net.ReadString()
        local objId = net.ReadString()
        CityUnderground.BaseBuilder.RemoveObject(ply, propId, objId)
    end)

    net.Receive("CU_Base_MoveObject", function(len, ply)
        local propId = net.ReadString()
        local objId = net.ReadString()
        local newX = net.ReadInt(16)
        local newY = net.ReadInt(16)
        local newRot = net.ReadInt(16)
        CityUnderground.BaseBuilder.MoveObject(ply, propId, objId, newX, newY, newRot)
    end)

    net.Receive("CU_Base_InteractObject", function(len, ply)
        local propId = net.ReadString()
        local objId = net.ReadString()
        local actionType = net.ReadString()
        CityUnderground.BaseBuilder.InteractDefense(ply, propId, objId, actionType)
    end)
end

CityUnderground.BaseBuilder.Init()
