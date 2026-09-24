--[[
    City Underground - Client Property System
    Property management UI bridge and keys interface.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Property = CityUnderground.Property or {}

function CityUnderground.Property.Buy(propId)
    if net and net.Start then
        net.Start("CU_Prop_Buy")
        net.WriteString(propId)
        net.SendToServer()
    end
end

function CityUnderground.Property.Rent(propId)
    if net and net.Start then
        net.Start("CU_Prop_Rent")
        net.WriteString(propId)
        net.SendToServer()
    end
end

function CityUnderground.Property.ToggleLock(propId)
    if net and net.Start then
        net.Start("CU_Prop_ToggleLock")
        net.WriteString(propId)
        net.SendToServer()
    end
end
