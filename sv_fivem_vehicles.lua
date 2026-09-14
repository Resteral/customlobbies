-- FiveM Vehicle Dynamics & Helix Trunk Inventory for Helix
local PLUGIN = PLUGIN

util.AddNetworkString("ixVehToggleEngine")
util.AddNetworkString("ixVehToggleLock")
util.AddNetworkString("ixVehOpenTrunk")
util.AddNetworkString("ixVehFobEffect")
util.AddNetworkString("ixPerpStartLockpick")
util.AddNetworkString("ixPerpLockpickResult")

-- Vehicle Engine Ignition Toggle
net.Receive("ixVehToggleEngine", function(len, ply)
    local veh = net.ReadEntity()
    if not IsValid(veh) then return end

    if ply:GetPos():DistToSqr(veh:GetPos()) > 40000 and ply:GetVehicle() ~= veh then return end

    local curState = veh:GetNWBool("ixVehEngine", false)
    local fuel = veh:GetNWInt("ixVehFuel", 100)

    if fuel <= 0 and not curState then
        ply:Notify("The vehicle fuel tank is empty! Use a Jerry Can.")
        return
    end

    local newState = not curState
    veh:SetNWBool("ixVehEngine", newState)

    if newState then
        veh:EmitSound("ambient/machines/diesel_engine_idle.wav", 70, 100)
        ply:Notify("Engine STARTED.")
    else
        veh:EmitSound("ambient/machines/spinup.wav", 60, 60)
        ply:Notify("Engine STOPPED.")
    end
end)

-- Vehicle Lock Toggle
net.Receive("ixVehToggleLock", function(len, ply)
    local veh = net.ReadEntity()
    if not IsValid(veh) then return end

    if ply:GetPos():DistToSqr(veh:GetPos()) > 40000 and ply:GetVehicle() ~= veh then return end

    local isLocked = veh:GetNWBool("ixVehLocked", false)
    local newLocked = not isLocked
    veh:SetNWBool("ixVehLocked", newLocked)

    if newLocked then
        veh:EmitSound("buttons/button17.wav", 75, 120)
        ply:Notify("Vehicle LOCKED.")
    else
        veh:EmitSound("buttons/button18.wav", 75, 120)
        ply:Notify("Vehicle UNLOCKED.")
    end
end)

-- Vehicle Trunk Helix Inventory Storage
net.Receive("ixVehOpenTrunk", function(len, ply)
    local veh = net.ReadEntity()
    if not IsValid(veh) then return end

    if ply:GetPos():DistToSqr(veh:GetPos()) > 22500 then
        ply:Notify("You are too far from the vehicle trunk!")
        return
    end

    if veh:GetNWBool("ixVehLocked", false) then
        ply:Notify("The vehicle trunk is locked! Unlock or lockpick it first.")
        return
    end

    -- Create or restore persistent Helix Inventory for this vehicle
    local invID = veh.ixTrunkInventoryID
    if invID then
        local inv = ix.inventory.instances[invID]
        if inv then
            ix.storage.Open(ply, inv, {
                name = "Vehicle Trunk Storage",
                entity = veh,
                searchTime = 1,
                bMultipleUsers = true
            })
            return
        end
    end

    -- Create 6x4 Grid Inventory
    ix.inventory.New(0, "trunk_" .. veh:EntIndex(), function(inventory)
        inventory.vars.isTrunk = true
        inventory.vars.entity = veh
        veh.ixTrunkInventoryID = inventory:GetID()

        ix.storage.Open(ply, inventory, {
            name = "Vehicle Trunk Storage",
            entity = veh,
            searchTime = 1,
            bMultipleUsers = true
        })
    end, 6, 4)
end)

-- Handle Lockpick Minigame Result
net.Receive("ixPerpLockpickResult", function(len, ply)
    local ent = net.ReadEntity()
    local success = net.ReadBool()

    local char = ply:GetCharacter()
    if not char then return end

    local inv = char:GetInventory()
    if not inv then return end

    if success then
        if IsValid(ent) then
            if ent:IsDoor() or ent:GetClass() == "prop_door_rotating" then
                ent:Fire("Unlock")
                ent:Fire("Open")
                ply:Notify("Door lock successfully bypassed!")
            elseif ent:IsVehicle() or ent:GetClass() == "prop_vehicle_jeep" or ent:GetClass() == "prop_vehicle_airboat" then
                ent:SetNWBool("ixVehLocked", false)
                ent:SetNWBool("ixVehEngine", true)
                ply:Notify("Vehicle bypassed & hotwired!")
            elseif ent:GetClass() == "ix_drillable_safe" then
                if ent.OpenSafe then ent:OpenSafe(ply) end
            end
        end

        char:AddSkillXP("lockpicking", 40)
    else
        -- Break one lockpick on fail
        local lockpickItem = inv:HasItem("lockpick")
        if lockpickItem then
            inv:Remove(lockpickItem.id)
            ply:Notify("Your lockpick broke into pieces!")
        end

        -- Chance to trigger police alarm
        if math.random(1, 3) == 1 then
            PLUGIN:SendPoliceAlert(ply:GetPos(), "SECURITY ALERT: Burglary / Lockpick attempt detected!")
        end
    end
end)

-- Vehicle Fuel & Damage Think Hook
hook.Add("Think", "FiveM_Vehicle_EngineFuelThink", function()
    PLUGIN.nextVehFuelTick = PLUGIN.nextVehFuelTick or 0
    if CurTime() < PLUGIN.nextVehFuelTick then return end
    PLUGIN.nextVehFuelTick = CurTime() + 4

    for _, veh in ipairs(ents.FindByClass("prop_vehicle_*")) do
        if IsValid(veh) and veh:GetNWBool("ixVehEngine", false) then
            local driver = veh:GetDriver()
            local fuel = veh:GetNWInt("ixVehFuel", 100)
            local health = veh:GetNWInt("ixVehHealth", 100)

            -- Drain fuel
            if fuel > 0 then
                local drain = IsValid(driver) and 1 or 0.2
                local newFuel = math.max(0, fuel - drain)
                veh:SetNWInt("ixVehFuel", newFuel)

                if newFuel <= 0 then
                    veh:SetNWBool("ixVehEngine", false)
                    veh:EmitSound("ambient/machines/spinup.wav", 60, 50)
                    if IsValid(driver) then
                        driver:Notify("Your vehicle ran completely out of fuel!")
                    end
                end
            end

            -- Low health engine stall
            if health < 25 and math.random(1, 10) == 1 then
                veh:EmitSound("ambient/materials/metal_groan.wav", 65, 120)
                if IsValid(driver) then
                    driver:Notify("Engine is sputtering from critical damage!")
                end
            end
        end
    end
end)
