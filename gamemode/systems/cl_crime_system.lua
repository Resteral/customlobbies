--[[
    City Underground - Client Crime System
    Lab synthesis minigame and street trading UI bridge.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Crime = CityUnderground.Crime or {}

if net and net.Receive then
    net.Receive("CU_Crime_SynthesisStatus", function()
        local isCooking = net.ReadBool()
        local duration = net.ReadInt(16)

        if CityUnderground.UI and CityUnderground.UI.UpdateSynthesisProgress then
            CityUnderground.UI.UpdateSynthesisProgress(isCooking, duration)
        end
    end)
end

function CityUnderground.Crime.RequestSynthesis()
    if net and net.Start then
        net.Start("CU_Crime_StartSynthesis")
        net.SendToServer()
    end
end

function CityUnderground.Crime.RequestSellToBuyer(buyerId, count)
    if net and net.Start then
        net.Start("CU_Crime_SellToBuyer")
        net.WriteString(buyerId)
        net.WriteInt(count, 16)
        net.SendToServer()
    end
end
