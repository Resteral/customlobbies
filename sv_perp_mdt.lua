-- Server-side PERP & FiveM Police MDT / CAD Dispatch Logic
local PLUGIN = PLUGIN

PLUGIN.MDT.Calls = PLUGIN.MDT.Calls or {}
PLUGIN.MDT.Warrants = PLUGIN.MDT.Warrants or {}

-- 911 Call Dispatch Receiver
net.Receive("ixPerpCall911", function(len, ply)
    local message = net.ReadString()
    if not message or string.Trim(message) == "" then return end

    local char = ply:GetCharacter()
    local callerName = char and char:GetName() or ply:Nick()
    local pos = ply:GetPos()

    local callData = {
        id = #PLUGIN.MDT.Calls + 1,
        caller = callerName,
        pos = pos,
        message = message,
        time = os.date("%H:%M:%S")
    }

    table.insert(PLUGIN.MDT.Calls, 1, callData)
    if #PLUGIN.MDT.Calls > 30 then
        table.remove(PLUGIN.MDT.Calls)
    end

    ply:Notify("911 Dispatch: Your emergency call has been transmitted to all units.")

    -- Send 911 alert to all police officers
    local targetFaction = ix.config.Get("policeFactionName", "Civil Protection")
    for _, v in ipairs(player.GetAll()) do
        local vChar = v:GetCharacter()
        if vChar then
            local faction = ix.faction.indices[vChar:GetFaction()]
            if faction and (faction.name == targetFaction or string.find(string.lower(faction.name), "police") or string.find(string.lower(faction.name), "cop")) then
                net.Start("ixPerp911Broadcast")
                    net.WriteTable(callData)
                net.Send(v)
            end
        end
    end
end)

-- Open MDT Terminal Command & Handler
ix.command.Add("MDT", {
    description = "Open the Police Mobile Data Terminal (MDT / CAD).",
    OnRun = function(self, ply)
        local char = ply:GetCharacter()
        if not char then return end

        local faction = ix.faction.indices[char:GetFaction()]
        local isCop = faction and (string.find(string.lower(faction.name), "police") or string.find(string.lower(faction.name), "cop") or string.find(string.lower(faction.name), "civil"))

        if not isCop and not ply:IsAdmin() then
            ply:Notify("You must be an active law enforcement officer to access the MDT!")
            return
        end

        net.Start("ixPerpOpenMDT")
            net.WriteTable(PLUGIN.MDT.Calls)
            net.WriteTable(PLUGIN.MDT.Warrants)
        net.Send(ply)
    end
})

-- Add / Remove Warrants
net.Receive("ixPerpAddWarrant", function(len, ply)
    local suspect = net.ReadString()
    local reason = net.ReadString()

    local char = ply:GetCharacter()
    if not char then return end

    local warrant = {
        id = #PLUGIN.MDT.Warrants + 1,
        suspect = suspect,
        reason = reason,
        officer = char:GetName(),
        time = os.date("%m/%d %H:%M")
    }

    table.insert(PLUGIN.MDT.Warrants, warrant)
    ply:Notify("Warrant issued for suspect: " .. suspect)

    -- Broadcast update to officers
    for _, v in ipairs(player.GetAll()) do
        local vChar = v:GetCharacter()
        if vChar then
            local faction = ix.faction.indices[vChar:GetFaction()]
            if faction and (string.find(string.lower(faction.name), "police") or string.find(string.lower(faction.name), "cop") or string.find(string.lower(faction.name), "civil")) then
                net.Start("ixPerpSyncMDT")
                    net.WriteTable(PLUGIN.MDT.Calls)
                    net.WriteTable(PLUGIN.MDT.Warrants)
                net.Send(v)
            end
        end
    end
end)

net.Receive("ixPerpRemoveWarrant", function(len, ply)
    local id = net.ReadInt(16)
    for i, w in ipairs(PLUGIN.MDT.Warrants) do
        if w.id == id then
            table.remove(PLUGIN.MDT.Warrants, i)
            ply:Notify("Warrant cleared.")
            break
        end
    end
end)

-- Handcuff & Search Handlers
net.Receive("ixPerpToggleCuff", function(len, ply)
    local target = net.ReadEntity()
    if not IsValid(target) or not target:IsPlayer() or ply:GetPos():DistToSqr(target:GetPos()) > 14400 then return end

    local isCuffed = target:GetNWBool("ixCuffed", false)
    target:SetNWBool("ixCuffed", not isCuffed)

    if not isCuffed then
        target:SetRunSpeed(80)
        target:SetWalkSpeed(80)
        target:EmitSound("ambient/materials/chain_hang1.wav")
        ply:Notify("Restrained " .. target:Name())
        target:Notify("You have been handcuffed by " .. ply:Name())
    else
        target:SetRunSpeed(220)
        target:SetWalkSpeed(100)
        ply:Notify("Unrestrained " .. target:Name())
        target:Notify("You were uncuffed by " .. ply:Name())
    end
end)

net.Receive("ixPerpSearchPlayer", function(len, ply)
    local target = net.ReadEntity()
    if not IsValid(target) or not target:IsPlayer() or ply:GetPos():DistToSqr(target:GetPos()) > 14400 then return end

    local targetChar = target:GetCharacter()
    if not targetChar then return end

    local targetInv = targetChar:GetInventory()
    if not targetInv then return end

    ix.storage.Open(ply, targetInv, {
        name = target:Name() .. "'s Pockets",
        entity = target,
        searchTime = 2,
        bMultipleUsers = false
    })
end)
