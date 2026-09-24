--[[
    City Underground - Server Communication Engine
    Server-authoritative proximity chat router, introduction identity system, and OOC channels.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Chat = CityUnderground.Chat or {}
CityUnderground.Chat.Introductions = CityUnderground.Chat.Introductions or {}

if util and util.AddNetworkString then
    util.AddNetworkString("CU_Chat_SendMessage")
    util.AddNetworkString("CU_Chat_ReceiveMessage")
    util.AddNetworkString("CU_Chat_Introduce")
end

-- Send chat message to targeted or nearby players
function CityUnderground.Chat.RouteMessage(senderPly, channel, text, targetCharId)
    local senderChar = CityUnderground.Character.GetActive(senderPly)
    if not senderChar or not text or text == "" then return end

    local senderPos = senderPly:GetPos()

    if channel == "OOC" then
        -- Global broadcast
        if not player or not player.GetAll then return end
        for _, ply in ipairs(player.GetAll()) do
            if net and net.Start then
                net.Start("CU_Chat_ReceiveMessage")
                net.WriteString("OOC")
                net.WriteString("[OOC] " .. senderChar.firstName .. " " .. senderChar.lastName)
                net.WriteString(text)
                net.Send(ply)
            end
        end
    elseif channel == "LOCAL" or channel == "WHISPER" or channel == "SHOUT" or channel == "ME" or channel == "DO" then
        local maxDist = CityUnderground.Chat.Distances[channel] or 250
        local maxDistSqr = maxDist * maxDist

        if not player or not player.GetAll then return end
        for _, ply in ipairs(player.GetAll()) do
            local distSqr = senderPos:DistToSqr(ply:GetPos())
            if distSqr <= maxDistSqr then
                local tChar = CityUnderground.Character.GetActive(ply)
                local known = false

                if ply == senderPly then
                    known = true
                elseif tChar and tChar.knownCitizens and tChar.knownCitizens[senderChar.id] then
                    known = true
                end

                local displayName = known and (senderChar.firstName .. " " .. senderChar.lastName) or ("Unknown Citizen [" .. string.sub(senderChar.id, -4) .. "]")
                
                local formattedText = text
                if channel == "ME" then
                    formattedText = "*** " .. displayName .. " " .. text
                elseif channel == "DO" then
                    formattedText = "* " .. text .. " (( " .. displayName .. " ))"
                end

                if net and net.Start then
                    net.Start("CU_Chat_ReceiveMessage")
                    net.WriteString(channel)
                    net.WriteString(displayName)
                    net.WriteString(formattedText)
                    net.Send(ply)
                end
            end
        end
    end
end

-- Introduce Character to Nearby Players
function CityUnderground.Chat.Introduce(senderPly)
    local senderChar = CityUnderground.Character.GetActive(senderPly)
    if not senderChar then return end

    local senderPos = senderPly:GetPos()
    for _, ply in ipairs(player.GetAll()) do
        if ply ~= senderPly and senderPos:DistToSqr(ply:GetPos()) <= (200 * 200) then
            local tChar = CityUnderground.Character.GetActive(ply)
            if tChar then
                tChar.knownCitizens = tChar.knownCitizens or {}
                tChar.knownCitizens[senderChar.id] = true
            end
        end
    end

    CityUnderground.Chat.RouteMessage(senderPly, "ME", "introduces themselves as " .. senderChar.firstName .. " " .. senderChar.lastName .. ".")
end

-- Network handlers
if net and net.Receive then
    net.Receive("CU_Chat_SendMessage", function(len, ply)
        local channel = net.ReadString()
        local text = net.ReadString()
        CityUnderground.Chat.RouteMessage(ply, channel, text)
    end)

    net.Receive("CU_Chat_Introduce", function(len, ply)
        CityUnderground.Chat.Introduce(ply)
    end)
end
