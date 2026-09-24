--[[
    City Underground Item: Express Courier Parcel
--]]

CityUnderground.Inventory.RegisterItem("delivery_parcel", {
    name = "Sealed Express Cargo Parcel",
    description = "Barcoded logistics box destined for a business client in New Harbor. Must be delivered intact.",
    category = "Logistics",
    weight = 4.0,
    maxStack = 4,
    icon = "📦",
    useText = "Inspect Barcode",
    OnUse = function(ply, item)
        return false
    end
})
