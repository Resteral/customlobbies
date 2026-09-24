--[[
    City Underground - Client Character System
    Client-side character data handler and UI synchronization bridge.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Character = CityUnderground.Character or {}
CityUnderground.LocalChar = CityUnderground.LocalChar or {}

if net and net.Receive then
    -- Receive characters list
    net.Receive("CU_Char_SendList", function()
        local chars = net.ReadTable()
        CityUnderground.CharacterList = chars
        
        -- Forward to WebUI / Derma
        if CityUnderground.UI and CityUnderground.UI.OnCharactersReceived then
            CityUnderground.UI.OnCharactersReceived(chars)
        end
    end)

    -- Receive live stat sync
    net.Receive("CU_Char_SyncStats", function()
        local stats = net.ReadTable()
        CityUnderground.LocalChar = stats

        if CityUnderground.UI and CityUnderground.UI.UpdateHUD then
            CityUnderground.UI.UpdateHUD(stats)
        end
    end)
end

function CityUnderground.Character.RequestList()
    if net and net.Start then
        net.Start("CU_Char_RequestList")
        net.SendToServer()
    end
end

function CityUnderground.Character.Create(firstName, lastName, gender, model, clothingStyle)
    if net and net.Start then
        net.Start("CU_Char_Create")
        net.WriteTable({
            firstName = firstName,
            lastName = lastName,
            gender = gender,
            model = model,
            clothingStyle = clothingStyle
        })
        net.SendToServer()
    end
end

function CityUnderground.Character.Select(charId)
    if net and net.Start then
        net.Start("CU_Char_Select")
        net.WriteString(charId)
        net.SendToServer()
    end
end

function CityUnderground.Character.Delete(charId)
    if net and net.Start then
        net.Start("CU_Char_Delete")
        net.WriteString(charId)
        net.SendToServer()
    end
end
