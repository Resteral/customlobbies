ITEM.name = "Vehicle Remote Key Fob"
ITEM.description = "A remote key fob with lock, unlock, and panic alarm buttons for your registered vehicles."
ITEM.model = "models/props_lab/keypad.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Vehicle & Mechanics"

ITEM.functions.ToggleLock = {
    name = "Toggle Lock",
    tip = "Remote lock or unlock nearby vehicles you own.",
    icon = "icon16/lock.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local char = client:GetCharacter()
        if not char then return false end

        local pPos = client:GetPos()
        local foundVeh = nil

        for _, veh in ipairs(ents.FindInSphere(pPos, 600)) do
            if veh:IsVehicle() or veh:GetClass() == "prop_vehicle_jeep" or veh:GetClass() == "prop_vehicle_airboat" then
                if veh:GetNWInt("ixVehOwner", 0) == char:GetID() or veh.ixOwner == client then
                    foundVeh = veh
                    break
                end
            end
        end

        if not IsValid(foundVeh) then
            client:Notify("No owned vehicles within remote key range!")
            return false
        end

        local isLocked = foundVeh:GetNWBool("ixVehLocked", false)
        local newLocked = not isLocked
        foundVeh:SetNWBool("ixVehLocked", newLocked)

        if newLocked then
            foundVeh:EmitSound("buttons/button17.wav", 75, 120)
            client:Notify("Vehicle LOCKED [Chirp-Chirp]")
        else
            foundVeh:EmitSound("buttons/button18.wav", 75, 120)
            client:Notify("Vehicle UNLOCKED [Chirp]")
        end

        net.Start("ixVehFobEffect")
            net.WriteEntity(foundVeh)
            net.WriteBool(newLocked)
        net.Broadcast()

        return false
    end
}
