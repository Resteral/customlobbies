Bridge = Bridge or {}
Bridge.FrameworkName = 'standalone'
Bridge.InventoryName = 'standalone'
Bridge.TargetName = 'none'

local function DetectFramework()
    if Config.Framework ~= 'auto' then
        Bridge.FrameworkName = Config.Framework
        return
    end

    if GetResourceState('qbx_core') == 'started' then
        Bridge.FrameworkName = 'qbox'
    elseif GetResourceState('qb-core') == 'started' then
        Bridge.FrameworkName = 'qbcore'
    elseif GetResourceState('es_extended') == 'started' then
        Bridge.FrameworkName = 'esx'
    elseif GetResourceState('ox_core') == 'started' then
        Bridge.FrameworkName = 'ox_core'
    elseif GetResourceState('ND_Core') == 'started' then
        Bridge.FrameworkName = 'nd'
    else
        Bridge.FrameworkName = 'standalone'
    end
end

local function DetectInventory()
    if Config.Inventory ~= 'auto' then
        Bridge.InventoryName = Config.Inventory
        return
    end

    if GetResourceState('ox_inventory') == 'started' then
        Bridge.InventoryName = 'ox_inventory'
    elseif GetResourceState('qb-inventory') == 'started' then
        Bridge.InventoryName = 'qb-inventory'
    elseif GetResourceState('ps-inventory') == 'started' then
        Bridge.InventoryName = 'ps-inventory'
    elseif GetResourceState('qs-inventory') == 'started' then
        Bridge.InventoryName = 'qs-inventory'
    else
        Bridge.InventoryName = 'standalone'
    end
end

local function DetectTarget()
    if Config.Target ~= 'auto' then
        Bridge.TargetName = Config.Target
        return
    end

    if GetResourceState('ox_target') == 'started' then
        Bridge.TargetName = 'ox_target'
    elseif GetResourceState('qb-target') == 'started' then
        Bridge.TargetName = 'qb-target'
    elseif GetResourceState('qtarget') == 'started' then
        Bridge.TargetName = 'qtarget'
    else
        Bridge.TargetName = 'none'
    end
end

DetectFramework()
DetectInventory()
DetectTarget()

if Config.Debug then
    print(string.format('^3[helix_hospitality]^0 Auto-detected -> Framework: ^2%s^0 | Inventory: ^2%s^0 | Target: ^2%s^0',
        Bridge.FrameworkName, Bridge.InventoryName, Bridge.TargetName))
end
