--[[
    Item: Security Camera Kit
    Used to manually install 1080p CCTV cameras in properties and bases.
--]]

ITEM = ITEM or {}
ITEM.id = "security_camera"
ITEM.name = "1080p Motorized CCTV Camera Kit"
ITEM.category = "Defenses & Security"
ITEM.model = "models/props/surveillance_dome.mdl"
ITEM.icon = "📹"
ITEM.weight = 1.2
ITEM.price = 450
ITEM.description = "Complete security camera assembly with mounting bracket, 12V power transformer, and BNC/RJ45 connectors."

function ITEM:OnUse(ply)
    if CLIENT then
        if window and window.CCTVSystem then
            window.CCTVSystem.openInstaller('apt_101', 4, 2)
        end
    end
    return false
end
