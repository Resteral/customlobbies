--[[
    City Underground - Shared Inventory System
    Registry of item prototypes, slot limits, and weight calculations.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Inventory = CityUnderground.Inventory or {}
CityUnderground.Inventory.ItemRegistry = CityUnderground.Inventory.ItemRegistry or {}

CityUnderground.Inventory.MaxSlots = 24
CityUnderground.Inventory.MaxWeightKg = 35.0

-- Register an item prototype
function CityUnderground.Inventory.RegisterItem(id, data)
    CityUnderground.Inventory.ItemRegistry[id] = {
        id = id,
        name = data.name or "Unknown Item",
        description = data.description or "",
        category = data.category or "General",
        weight = data.weight or 0.1,
        maxStack = data.maxStack or 1,
        icon = data.icon or "📦",
        isContraband = data.isContraband or false,
        useText = data.useText or "Use",
        OnUse = data.OnUse or function(ply, item) return true end
    }
end

function CityUnderground.Inventory.GetItemData(itemType)
    return CityUnderground.Inventory.ItemRegistry[itemType]
end

-- Calculate total weight of an inventory list
function CityUnderground.Inventory.CalculateTotalWeight(items)
    local total = 0
    if not items then return total end
    for _, item in ipairs(items) do
        local proto = CityUnderground.Inventory.GetItemData(item.itemType)
        if proto then
            total = total + (proto.weight * (item.count or 1))
        end
    end
    return math.Round(total, 2)
end
