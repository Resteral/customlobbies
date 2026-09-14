Config = {}

Config.InteriorName = "Luxury Penthouse with Spa & Curtains"
Config.ArchetypeName = "hei_dlc_mlo_penthouse"

-- World Coordinates
Config.Location = vec3(-75.00, -800.00, 243.00)

-- Room Names & IDs
Config.Rooms = {
    [0] = { name = "limbo", timecycle = "default" },
    [1] = { name = "living_lounge", timecycle = "int_clothes_high" },
    [2] = { name = "bathroom_suite", timecycle = "int_hospital" }
}

-- Switchable Entity Sets
Config.EntitySets = {
    ["curtains_open"] = { defaultActive = true },
    ["curtains_closed"] = { defaultActive = true }
}
