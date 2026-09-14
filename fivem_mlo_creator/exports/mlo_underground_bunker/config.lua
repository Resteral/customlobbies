Config = {}

Config.InteriorName = "Tactical Underground Bunker & Armory"
Config.ArchetypeName = "hei_dlc_mlo_custom"

-- World Coordinates
Config.Location = vec3(970.20, -100.50, 74.00)

-- Room Names & IDs
Config.Rooms = {
    [undefined] = { name = "limbo", timecycle = "default" },
    [undefined] = { name = "airlock_entrance", timecycle = "v_tunnel" },
    [undefined] = { name = "tactical_war_room", timecycle = "int_hospital" },
    [undefined] = { name = "high_sec_armory", timecycle = "int_motel" }
}

-- Switchable Entity Sets
Config.EntitySets = {
    ["heavy_defenses"] = { defaultActive = true },
    ["raid_breached"] = { defaultActive = true }
}
