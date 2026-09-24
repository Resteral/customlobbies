--[[
    City Underground - Shared Persistence System
    Manages data schema definitions, storage structure, and validation rules.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Persistence = CityUnderground.Persistence or {}

-- Standard persistent character schema definition
CityUnderground.Persistence.DefaultCharacterSchema = {
    id = "",
    steamId = "",
    firstName = "John",
    lastName = "Doe",
    gender = "male",
    model = "models/player/citizen_01.mdl",
    skinTone = 1,
    hairColor = "#3b2317",
    clothingStyle = "casual",
    cash = 500,
    bank = 2500,
    job = "citizen",
    jobRank = 1,
    health = 100,
    hunger = 100,
    thirst = 100,
    playtimeMinutes = 0,
    jailTimeRemaining = 0,
    isHandcuffed = false,
    inventory = {},
    ownedVehicles = {},
    properties = {},
    warrants = {},
    knownCitizens = {},
    lastPosition = { x = 500, y = 500, z = 10, heading = 90 },
    createdAt = 0,
    lastSavedAt = 0
}

function CityUnderground.Persistence.CreateDefaultCharacter(steamId, firstName, lastName, gender, model, clothingStyle)
    local char = table.Copy and table.Copy(CityUnderground.Persistence.DefaultCharacterSchema) or {}
    for k, v in pairs(CityUnderground.Persistence.DefaultCharacterSchema) do
        char[k] = type(v) == "table" and {} or v
    end
    
    char.id = string.format("char_%s_%d", tostring(os.time()), math.random(1000, 9999))
    char.steamId = tostring(steamId or "LOCAL_PLAYER")
    char.firstName = firstName or "Citizen"
    char.lastName = lastName or "Underground"
    char.gender = gender or "male"
    char.model = model or "models/player/citizen_01.mdl"
    char.clothingStyle = clothingStyle or "casual"
    char.createdAt = os.time()
    char.lastSavedAt = os.time()

    -- Initial Starter Inventory Items
    char.inventory = {
        { id = "item_1", itemType = "food_sandwich", count = 2, slot = 1 },
        { id = "item_2", itemType = "drink_water", count = 2, slot = 2 },
        { id = "item_3", itemType = "phone", count = 1, slot = 3 }
    }
    
    return char
end
