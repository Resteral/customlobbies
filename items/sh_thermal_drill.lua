ITEM.name = "Thermal Drill Kit"
ITEM.description = "Heavy duty industrial drill equipped with a high-temperature burn tip for penetrating bank vault doors and steel safes."
ITEM.model = "models/props_construction/appliance_box.mdl"
ITEM.width = 2
ITEM.height = 2
ITEM.category = "Heist Gear"

ITEM.functions.Deploy = {
    name = "Deploy Drill",
    tip = "Attach thermal drill to a safe or vault door.",
    icon = "icon16/wrench.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()
        local ent = trace.Entity

        if IsValid(ent) and (ent:GetClass() == "ix_drillable_safe" or ent:GetClass() == "ix_bank_vault") then
            if ent:GetIsDrilling() then
                client:Notify("A drill is already active on this target!")
                return false
            end

            local plugin = ix.plugin.Get("Helix Drugs & Heists")
            if plugin and plugin:GetPoliceCount() < ix.config.Get("minPoliceForHeist", 2) then
                client:Notify("There must be at least " .. ix.config.Get("minPoliceForHeist", 2) .. " police officers online to start a heist!")
                return false
            end

            ent:StartDrilling(client)
            client:Notify("Deployed Thermal Drill! Monitor for overheating and jams!")
            return true
        else
            client:Notify("You must be facing a Drillable Safe or Bank Vault Door!")
            return false
        end
    end
}
