--[[
    City Underground - Client Interaction System
    Performs distance raycasting/proximity detection to display floating prompts and trigger events.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Interaction = CityUnderground.Interaction or {}
CityUnderground.Interaction.CurrentTarget = nil

-- Check nearby points of interest / interactive entities in range
function CityUnderground.Interaction.GetTargetInRange(plyPos)
    -- Sample points defined in the district
    local mapLocations = {
        { id = "bank_atm", type = "BANK_ATM", x = 395, y = 645, z = 10, radius = 80 },
        { id = "store_cashier", type = "STORE_CASHIER", x = 640, y = 635, z = 10, radius = 80 },
        { id = "police_duty", type = "POLICE_DUTY", x = 160, y = 800, z = 10, radius = 80 },
        { id = "police_mdt", type = "POLICE_MDT", x = 210, y = 790, z = 10, radius = 80 },
        { id = "delivery_dispatch", type = "DELIVERY_DISPATCH", x = 800, y = 160, z = 10, radius = 80 },
        { id = "dealership_sales", type = "DEALERSHIP_SALES", x = 640, y = 360, z = 10, radius = 80 },
        { id = "gas_pump", type = "GAS_PUMP", x = 380, y = 370, z = 10, radius = 90 },
        { id = "apt_door", type = "APARTMENT_DOOR", x = 200, y = 400, z = 10, radius = 70 },
        { id = "apt_stash", type = "APARTMENT_STASH", x = 215, y = 410, z = 10, radius = 70 },
        { id = "synth_lab", type = "SYNTH_LAB", x = 200, y = 190, z = 10, radius = 70 },
        { id = "street_buyer_1", type = "STREET_BUYER", x = 260, y = 260, z = 10, radius = 70 }
    }

    for _, loc in ipairs(mapLocations) do
        local dx = plyPos.x - loc.x
        local dy = plyPos.y - loc.y
        local dist = math.sqrt(dx * dx + dy * dy)
        if dist <= loc.radius then
            return loc
        end
    end
    return nil
end

-- Primary Interaction Trigger (Called when player presses 'E')
function CityUnderground.Interaction.TriggerInteract(target)
    if not target then return end
    local tType = target.type

    if tType == "BANK_ATM" or tType == "BANK_TELLER" then
        if CityUnderground.UI and CityUnderground.UI.OpenBanking then CityUnderground.UI.OpenBanking() end
    elseif tType == "STORE_CASHIER" then
        if CityUnderground.UI and CityUnderground.UI.OpenStore then CityUnderground.UI.OpenStore() end
    elseif tType == "POLICE_DUTY" then
        if CityUnderground.Police and CityUnderground.Police.ToggleDuty then CityUnderground.Police.ToggleDuty() end
    elseif tType == "POLICE_MDT" then
        if CityUnderground.UI and CityUnderground.UI.OpenMDT then CityUnderground.UI.OpenMDT() end
    elseif tType == "DELIVERY_DISPATCH" then
        if CityUnderground.UI and CityUnderground.UI.OpenDeliveryDepot then CityUnderground.UI.OpenDeliveryDepot() end
    elseif tType == "DEALERSHIP_SALES" then
        if CityUnderground.UI and CityUnderground.UI.OpenDealership then CityUnderground.UI.OpenDealership() end
    elseif tType == "GAS_PUMP" then
        if CityUnderground.Vehicles and CityUnderground.Vehicles.RefuelNearestVehicle then CityUnderground.Vehicles.RefuelNearestVehicle() end
    elseif tType == "APARTMENT_DOOR" or tType == "APARTMENT_STASH" then
        if CityUnderground.UI and CityUnderground.UI.OpenProperty then CityUnderground.UI.OpenProperty("apt_101") end
    elseif tType == "SYNTH_LAB" then
        if CityUnderground.UI and CityUnderground.UI.OpenSynthLab then CityUnderground.UI.OpenSynthLab() end
    elseif tType == "STREET_BUYER" then
        if CityUnderground.UI and CityUnderground.UI.OpenStreetBuyer then CityUnderground.UI.OpenStreetBuyer(target.id) end
    end
end
