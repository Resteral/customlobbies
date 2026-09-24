--[[
    City Underground Item: Mobile Smartphone
--]]

CityUnderground.Inventory.RegisterItem("phone", {
    name = "CityLink 5G Smartphone",
    description = "Essential smartphone equipped with banking app, GPS navigator, messaging, and contacts.",
    category = "Electronics",
    weight = 0.2,
    maxStack = 1,
    icon = "📱",
    useText = "Open Phone",
    OnUse = function(ply, item)
        if net and net.Start then
            net.Start("CU_Econ_OpenBankUI")
            net.Send(ply)
        end
        return false -- Do not consume phone on use
    end
})
