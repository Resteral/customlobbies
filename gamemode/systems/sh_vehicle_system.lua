--[[
    City Underground - Shared Vehicle System
    Catalog of purchasable vehicles, performance attributes, and trunk capacities.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Vehicles = CityUnderground.Vehicles or {}
CityUnderground.Vehicles.Catalog = CityUnderground.Vehicles.Catalog or {}

CityUnderground.Vehicles.Catalog["compact_coupe"] = {
    id = "compact_coupe",
    name = "Harbor City Compact",
    category = "Civilian",
    price = 3500,
    topSpeed = 95,
    acceleration = 12,
    fuelCapacity = 45,
    trunkSlots = 8,
    trunkMaxWeight = 25.0,
    model = "models/vehicles/compact_car.mdl"
}

CityUnderground.Vehicles.Catalog["executive_sedan"] = {
    id = "executive_sedan",
    name = "East Coast Executive Sedan",
    category = "Civilian",
    price = 8500,
    topSpeed = 120,
    acceleration = 16,
    fuelCapacity = 60,
    trunkSlots = 12,
    trunkMaxWeight = 40.0,
    model = "models/vehicles/executive_sedan.mdl"
}

CityUnderground.Vehicles.Catalog["muscle_cruiser"] = {
    id = "muscle_cruiser",
    name = "Metro V8 Street Muscle",
    category = "Sport",
    price = 15000,
    topSpeed = 145,
    acceleration = 22,
    fuelCapacity = 70,
    trunkSlots = 10,
    trunkMaxWeight = 30.0,
    model = "models/vehicles/muscle_car.mdl"
}

CityUnderground.Vehicles.Catalog["delivery_van"] = {
    id = "delivery_van",
    name = "Harbor Express Cargo Van",
    category = "Commercial",
    price = 6000,
    topSpeed = 85,
    acceleration = 10,
    fuelCapacity = 80,
    trunkSlots = 24,
    trunkMaxWeight = 100.0,
    model = "models/vehicles/delivery_van.mdl"
}

CityUnderground.Vehicles.Catalog["police_interceptor"] = {
    id = "police_interceptor",
    name = "Metro Police Interceptor Cruiser",
    category = "Emergency",
    price = 0,
    topSpeed = 140,
    acceleration = 20,
    fuelCapacity = 65,
    trunkSlots = 16,
    trunkMaxWeight = 50.0,
    model = "models/vehicles/police_cruiser.mdl"
}
