--[[
    City Underground - Shared Property System
    Defines apartment properties, rental rates, and storage capacities.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Property = CityUnderground.Property or {}
CityUnderground.Property.Registry = CityUnderground.Property.Registry or {}

CityUnderground.Property.Registry["apt_101"] = {
    id = "apt_101",
    name = "Harborview Apartment 101",
    type = "apartment",
    isMLO = true,
    buyPrice = 12000,
    rentPrice = 150,
    maxKeys = 3,
    stashSlots = 20,
    stashMaxWeight = 60.0,
    gridWidth = 12,
    gridHeight = 12,
    floors = { "Ground Floor" },
    doorPos = { x = 200, y = 400, z = 10 },
    stashPos = { x = 215, y = 410, z = 10 },
    description = "Cozy open-concept 1-bedroom apartment in Harborview Towers with city street views."
}

CityUnderground.Property.Registry["mlo_industrial_warehouse"] = {
    id = "mlo_industrial_warehouse",
    name = "South Harbor Pier 9 Open Warehouse MLO",
    type = "industrial_mlo",
    isMLO = true,
    isOpenInterior = true,
    buyPrice = 85000,
    rentPrice = 850,
    maxKeys = 8,
    stashSlots = 60,
    stashMaxWeight = 300.0,
    gridWidth = 16,
    gridHeight = 16,
    floors = { "Ground Bay", "Mezzanine Office" },
    doorPos = { x = 180, y = 180, z = 10 },
    stashPos = { x = 195, y = 205, z = 10 },
    description = "Expansive open-bay industrial warehouse with high steel rafter ceilings, roll-up bay doors, and mezzanine catwalk."
}

CityUnderground.Property.Registry["mlo_suburban_ranch"] = {
    id = "mlo_suburban_ranch",
    name = "Harborview Suburban Ranch House MLO",
    type = "residential_mlo",
    isMLO = true,
    isOpenInterior = true,
    buyPrice = 65000,
    rentPrice = 600,
    maxKeys = 5,
    stashSlots = 45,
    stashMaxWeight = 180.0,
    gridWidth = 16,
    gridHeight = 16,
    floors = { "Ground Living", "Back Patio & Yard" },
    doorPos = { x = 120, y = 320, z = 10 },
    stashPos = { x = 140, y = 350, z = 10 },
    description = "Full suburban home with open front porch, living room, open-plan kitchen, attached garage, and backyard perimeter."
}

CityUnderground.Property.Registry["mlo_downtown_storefront"] = {
    id = "mlo_downtown_storefront",
    name = "Downtown Commercial Storefront & Loft MLO",
    type = "commercial_mlo",
    isMLO = true,
    isOpenInterior = true,
    buyPrice = 75000,
    rentPrice = 700,
    maxKeys = 6,
    stashSlots = 40,
    stashMaxWeight = 150.0,
    gridWidth = 14,
    gridHeight = 14,
    floors = { "1F Storefront", "2F Residential Loft" },
    doorPos = { x = 450, y = 520, z = 10 },
    stashPos = { x = 465, y = 540, z = 10 },
    description = "Street-level retail commercial boutique with panoramic display windows and an upstairs apartment loft."
}

CityUnderground.Property.Registry["mlo_dockside_garage"] = {
    id = "mlo_dockside_garage",
    name = "Harbor Customs Mechanic & Chop Shop MLO",
    type = "garage_mlo",
    isMLO = true,
    isOpenInterior = true,
    buyPrice = 90000,
    rentPrice = 900,
    maxKeys = 6,
    stashSlots = 50,
    stashMaxWeight = 250.0,
    gridWidth = 16,
    gridHeight = 14,
    floors = { "Vehicle Lift Bay", "Parts Armory" },
    doorPos = { x = 720, y = 220, z = 10 },
    stashPos = { x = 740, y = 240, z = 10 },
    description = "Open automotive speed shop with dual hydraulic vehicle lifts, tool racks, and reinforced security backroom."
}

CityUnderground.Property.Registry["mlo_underground_bunker"] = {
    id = "mlo_underground_bunker",
    name = "Old City Underground Bunker MLO",
    type = "bunker_mlo",
    isMLO = true,
    isOpenInterior = true,
    buyPrice = 120000,
    rentPrice = 1200,
    maxKeys = 10,
    stashSlots = 80,
    stashMaxWeight = 500.0,
    gridWidth = 16,
    gridHeight = 16,
    floors = { "Main Airlock & Vault", "Sub-Level Lab" },
    doorPos = { x = 150, y = 880, z = 2 },
    stashPos = { x = 165, y = 900, z = 2 },
    description = "Hardened subterranean fallout bunker sealed by heavy titanium blast doors, featuring standalone power and ventilation."
}
