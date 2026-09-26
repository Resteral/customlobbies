local PLUGIN = PLUGIN

PLUGIN.lastHeistTime = PLUGIN.lastHeistTime or 0

function PLUGIN:GetPoliceCount()
    local policeCount = 0
    local targetFaction = ix.config.Get("policeFactionName", "Civil Protection")

    for _, v in ipairs(player.GetAll()) do
        local character = v:GetCharacter()
        if character then
            local faction = ix.faction.indices[character:GetFaction()]
            if faction and (faction.name == targetFaction or string.find(string.lower(faction.name), "police") or string.find(string.lower(faction.name), "cop") or string.find(string.lower(faction.name), "swat")) then
                policeCount = policeCount + 1
            end
        end
    end

    return policeCount
end

function PLUGIN:SendPoliceAlert(pos, message)
    local targetFaction = ix.config.Get("policeFactionName", "Civil Protection")

    net.Start("ixPoliceAlert")
        net.WriteVector(pos)
        net.WriteString(message or "ALERT: Silent Alarm Triggered!")
    for _, v in ipairs(player.GetAll()) do
        local character = v:GetCharacter()
        if character then
            local faction = ix.faction.indices[character:GetFaction()]
            if faction and (faction.name == targetFaction or string.find(string.lower(faction.name), "police") or string.find(string.lower(faction.name), "cop")) then
                net.Send(v)
            end
        end
    end
end

net.Receive("ixHeistMinigameResult", function(len, ply)
    local ent = net.ReadEntity()
    local success = net.ReadBool()

    if not IsValid(ent) or ply:GetPos():DistToSqr(ent:GetPos()) > 62500 then return end

    if ent.OnHackResult then
        ent:OnHackResult(ply, success)
    end
end)

net.Receive("ixBlackMarketTransaction", function(len, ply)
    local itemID = net.ReadString()
    local action = net.ReadString()
    local ent = net.ReadEntity()

    if not IsValid(ent) or ent:GetClass() ~= "ix_blackmarket_npc" then return end
    if ply:GetPos():DistToSqr(ent:GetPos()) > 40000 then return end

    local character = ply:GetCharacter()
    if not character then return end

    local inventory = character:GetInventory()
    if not inventory then return end

    if action == "sell" then
        local item = inventory:HasItem(itemID)
        if item then
            local priceInfo = PLUGIN.marketPrices[itemID] or { current = 100 }
            local sellPrice = priceInfo.current or 100
            
            if item:GetData("quality") then
                sellPrice = math.Round(sellPrice * (item:GetData("quality", 100) / 100))
            end

            if inventory:Remove(item.id) then
                character:GiveMoney(sellPrice)
                ply:Notify("Sold " .. item.name .. " for $" .. sellPrice)
                
                if PLUGIN.marketPrices[itemID] then
                    PLUGIN.marketPrices[itemID].current = math.max(
                        PLUGIN.marketPrices[itemID].min,
                        PLUGIN.marketPrices[itemID].current - 5
                    )
                end
            end
        else
            ply:Notify("You do not have this item in your inventory!")
        end
    elseif action == "buy" then
        local buyItems = {
            ["weed_seed"] = 50,
            ["meth_chemicals"] = 120,
            ["thermal_drill"] = 1500,
            ["hacking_device"] = 800,
            ["thermite"] = 600,
            ["keycard"] = 1000,
            ["brick_wall"] = 250,
            ["brick_counter"] = 200,
            ["security_grate"] = 300
        }
        local cost = buyItems[itemID]
        if cost then
            if character:HasMoney(cost) then
                inventory:Add(itemID, 1, {}, function(success, item)
                    if success then
                        character:TakeMoney(cost)
                        ply:Notify("Purchased " .. item.name .. " for $" .. cost)
                    else
                        ply:Notify("Your inventory is full!")
                    end
                end)
            else
                ply:Notify("You cannot afford this item!")
            end
        end
    end
end)

net.Receive("ixDrugLabCookAction", function(len, ply)
    local ent = net.ReadEntity()
    local action = net.ReadString()

    if not IsValid(ent) or ent:GetClass() ~= "ix_meth_lab" then return end
    if ply:GetPos():DistToSqr(ent:GetPos()) > 40000 then return end

    if ent.HandleCookAction then
        ent:HandleCookAction(ply, action)
    end
end)

function PLUGIN:SaveData()
    local pots, labs, safes, npcs, vaults, parts, benches, lamps = {}, {}, {}, {}, {}, {}, {}, {}

    for _, v in ipairs(ents.FindByClass("ix_weed_pot")) do
        table.insert(pots, { pos = v:GetPos(), angles = v:GetAngles(), water = v:GetWater(), growth = v:GetGrowth() })
    end
    for _, v in ipairs(ents.FindByClass("ix_meth_lab")) do
        table.insert(labs, { pos = v:GetPos(), angles = v:GetAngles() })
    end
    for _, v in ipairs(ents.FindByClass("ix_drillable_safe")) do
        table.insert(safes, { pos = v:GetPos(), angles = v:GetAngles() })
    end
    for _, v in ipairs(ents.FindByClass("ix_blackmarket_npc")) do
        table.insert(npcs, { pos = v:GetPos(), angles = v:GetAngles() })
    end
    for _, v in ipairs(ents.FindByClass("ix_bank_vault")) do
        table.insert(vaults, { pos = v:GetPos(), angles = v:GetAngles(), code = v.passcode })
    end
    for _, v in ipairs(ents.FindByClass("ix_modular_part")) do
        table.insert(parts, { pos = v:GetPos(), angles = v:GetAngles(), model = v:GetModel(), partType = v:GetPartType(), owner = v:GetOwnerID() })
    end
    for _, v in ipairs(ents.FindByClass("ix_perp_crafting_bench")) do
        table.insert(benches, { pos = v:GetPos(), angles = v:GetAngles() })
    end
    for _, v in ipairs(ents.FindByClass("ix_perp_grow_lamp")) do
        table.insert(lamps, { pos = v:GetPos(), angles = v:GetAngles(), active = v:GetNWBool("ixLampActive", true) })
    end

    self:SaveHelixData("crime_weed_pots", pots)
    self:SaveHelixData("crime_meth_labs", labs)
    self:SaveHelixData("crime_drillable_safes", safes)
    self:SaveHelixData("crime_blackmarket_npcs", npcs)
    self:SaveHelixData("crime_bank_vaults", vaults)
    self:SaveHelixData("crime_modular_parts", parts)
    self:SaveHelixData("perp_crafting_benches", benches)
    self:SaveHelixData("perp_grow_lamps", lamps)
end

function PLUGIN:LoadData()
    local pots = self:RestoreHelixData("crime_weed_pots") or {}
    for _, v in ipairs(pots) do
        local ent = ents.Create("ix_weed_pot")
        ent:SetPos(v.pos)
        ent:SetAngles(v.angles)
        ent:Spawn()
        ent:SetWater(v.water or 50)
        ent:SetGrowth(v.growth or 0)
    end

    local safes = self:RestoreHelixData("crime_drillable_safes") or {}
    for _, v in ipairs(safes) do
        local ent = ents.Create("ix_drillable_safe")
        ent:SetPos(v.pos)
        ent:SetAngles(v.angles)
        ent:Spawn()
    end

    local npcs = self:RestoreHelixData("crime_blackmarket_npcs") or {}
    for _, v in ipairs(npcs) do
        local ent = ents.Create("ix_blackmarket_npc")
        ent:SetPos(v.pos)
        ent:SetAngles(v.angles)
        ent:Spawn()
    end

    local vaults = self:RestoreHelixData("crime_bank_vaults") or {}
    for _, v in ipairs(vaults) do
        local ent = ents.Create("ix_bank_vault")
        ent:SetPos(v.pos)
        ent:SetAngles(v.angles)
        ent:Spawn()
        if v.code then ent.passcode = v.code end
    end

    local parts = self:RestoreHelixData("crime_modular_parts") or {}
    for _, v in ipairs(parts) do
        local ent = ents.Create("ix_modular_part")
        ent:SetPos(v.pos)
        ent:SetAngles(v.angles)
        if v.model then ent:SetModel(v.model) end
        ent:Spawn()
        if v.partType then ent:SetPartType(v.partType) end
        if v.owner then ent:SetOwnerID(v.owner) end
    end

    local benches = self:RestoreHelixData("perp_crafting_benches") or {}
    for _, v in ipairs(benches) do
        local ent = ents.Create("ix_perp_crafting_bench")
        ent:SetPos(v.pos)
        ent:SetAngles(v.angles)
        ent:Spawn()
    end

    local lamps = self:RestoreHelixData("perp_grow_lamps") or {}
    for _, v in ipairs(lamps) do
        local ent = ents.Create("ix_perp_grow_lamp")
        ent:SetPos(v.pos)
        ent:SetAngles(v.angles)
        ent:Spawn()
        if v.active ~= nil then ent:SetNWBool("ixLampActive", v.active) end
    end
end
