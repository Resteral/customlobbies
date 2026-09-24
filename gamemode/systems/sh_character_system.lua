--[[
    City Underground - Shared Character System
    Defines character models, appearance customization schemas, and validation rules.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Character = CityUnderground.Character or {}

CityUnderground.Character.MaxCharactersPerPlayer = 4

CityUnderground.Character.AllowedModels = {
    male = {
        "models/player/group01/male_01.mdl",
        "models/player/group01/male_02.mdl",
        "models/player/group01/male_03.mdl",
        "models/player/group01/male_04.mdl",
        "models/player/group01/male_05.mdl",
        "models/player/group01/male_06.mdl",
        "models/player/group01/male_07.mdl",
        "models/player/group01/male_08.mdl",
        "models/player/group01/male_09.mdl"
    },
    female = {
        "models/player/group01/female_01.mdl",
        "models/player/group01/female_02.mdl",
        "models/player/group01/female_03.mdl",
        "models/player/group01/female_04.mdl",
        "models/player/group01/female_06.mdl",
        "models/player/group01/female_07.mdl"
    }
}

CityUnderground.Character.ClothingStyles = {
    casual = { name = "Casual Urban", description = "Standard hoodie and denim jeans." },
    business = { name = "Formal Business", description = "Tailored suit jacket with dress slacks." },
    streetwear = { name = "Streetwear", description = "Graphic athletic jacket, high-tops, and cargo pants." },
    workwear = { name = "Industrial Workwear", description = "High-visibility utility vest and heavy boots." }
}

-- Name validation rule: Must be First and Last name, English letters only, 2-16 chars each.
function CityUnderground.Character.ValidateName(firstName, lastName)
    if not firstName or not lastName then
        return false, "First and Last name must both be provided."
    end

    firstName = string.Trim(firstName)
    lastName = string.Trim(lastName)

    if #firstName < 2 or #firstName > 16 then
        return false, "First name must be between 2 and 16 characters."
    end
    if #lastName < 2 or #lastName > 16 then
        return false, "Last name must be between 2 and 16 characters."
    end

    if not firstName:match("^[A-Z][a-zA-Z]*$") then
        return false, "First name must start with a capital letter and contain only letters."
    end
    if not lastName:match("^[A-Z][a-zA-Z]*$") then
        return false, "Last name must start with a capital letter and contain only letters."
    end

    return true, nil
end
