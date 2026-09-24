ITEM.name = "High-Pressure Pepper Sprinkler"
ITEM.description = "A lawn sprinkler modified with high-pressure oscillating heads that sprays caustic pepper mist across a 360-degree radius."
ITEM.model = "models/props_c17/canister01a.mdl"
ITEM.width = 1
ITEM.height = 1
ITEM.category = "Suburban Defenses"
ITEM.price = 450

ITEM.functions.Use = {
    name = "Deploy Sprinkler Trap",
    tip = "Install oscillating chemical sprinkler on lawn.",
    icon = "icon16/weather_rain.png",
    OnRun = function(itemTable)
        local client = itemTable.player
        local trace = client:GetEyeTrace()

        if client:GetPos():DistToSqr(trace.HitPos) > 10000 then
            client:Notify("Too far away to plant sprinkler!")
            return false
        end

        if SERVER then
            client:Notify("High-Pressure Pepper Sprinkler installed on lawn! Armed & oscillating.")
        end

        return true
    end
}
