--[[
    Client-Side Custom Systems Net Handlers & HUD integration
]]--

local PLUGIN = PLUGIN or {}

net.Receive("ixCustomSystemOpen", function()
    local entity = net.ReadEntity()
    local systemID = net.ReadString()
    local system = ix.customSystems.Get(systemID)
    if not system then return end

    if IsValid(ix.gui.stationMenu) then
        ix.gui.stationMenu:Close()
    end

    ix.gui.stationMenu = vgui.Create("ixStationMenu")
    ix.gui.stationMenu:Setup(entity, system)
end)

net.Receive("ixCustomSystemSpawn", function()
    local allSystems = net.ReadTable()
    
    if IsValid(ix.gui.systemEditor) then
        ix.gui.systemEditor:Close()
    end

    ix.gui.systemEditor = vgui.Create("ixSystemEditorMenu")
    ix.gui.systemEditor:PopulateSystems(allSystems)
end)
