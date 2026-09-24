--[[
    City Underground - Shared Job System
    Job registry, ranks, uniforms, and permission capabilities.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Jobs = CityUnderground.Jobs or {}
CityUnderground.Jobs.Registry = CityUnderground.Jobs.Registry or {}

CityUnderground.Jobs.Registry["citizen"] = {
    id = "citizen",
    title = "Citizen",
    description = "Ordinary civilian living in New Harbor. Free to pursue legal professions, criminal enterprises, or real estate.",
    salary = 75,
    isWhitelisted = false,
    color = "#94a3b8"
}

CityUnderground.Jobs.Registry["delivery"] = {
    id = "delivery",
    title = "Harbor Express Courier",
    description = "Transport commercial packages across New Harbor districts using company delivery vans.",
    salary = 120,
    isWhitelisted = false,
    color = "#38bdf8",
    hasVehicle = true,
    vehicleModel = "models/vehicles/delivery_van.mdl"
}

CityUnderground.Jobs.Registry["police"] = {
    id = "police",
    title = "Metro Police Officer",
    description = "Enforce city laws, patrol neighborhoods, respond to 911 dispatch calls, apprehend criminals, and process suspects.",
    salary = 350,
    isWhitelisted = true,
    color = "#00f2fe",
    hasVehicle = true,
    vehicleModel = "models/vehicles/police_cruiser.mdl"
}

CityUnderground.Jobs.Registry["paramedic"] = {
    id = "paramedic",
    title = "Mercy Hospital Paramedic",
    description = "Respond to medical emergencies, revive unconscious citizens, and restock medical clinics.",
    salary = 300,
    isWhitelisted = false,
    color = "#10b981",
    hasVehicle = true,
    vehicleModel = "models/vehicles/ambulance.mdl"
}
