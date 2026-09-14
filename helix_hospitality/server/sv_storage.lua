Storage = Storage or {}
Storage.UseMySQL = false
local JSON_FILE = 'data/saved_venues.json'

local memoryData = {
    venues = {},
    employees = {},
    signature_drinks = {},
    stock = {},
    ledger = {}
}

local function InitMySQLSchema(cb)
    if not Storage.UseMySQL then
        if cb then cb() end
        return
    end

    CreateThread(function()
        local tables = {
            [[CREATE TABLE IF NOT EXISTS `helix_venues` (
                `venue_id` VARCHAR(50) PRIMARY KEY,
                `owner_id` VARCHAR(64) NULL,
                `owner_name` VARCHAR(100) NULL,
                `safe_balance` BIGINT DEFAULT 0,
                `safe_pin` VARCHAR(10) DEFAULT '1234',
                `entry_fee` INT DEFAULT 50,
                `hype_level` FLOAT DEFAULT 50.0,
                `is_open` TINYINT DEFAULT 1,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );]],
            [[CREATE TABLE IF NOT EXISTS `helix_employees` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `venue_id` VARCHAR(50),
                `identifier` VARCHAR(64),
                `name` VARCHAR(100),
                `rank_id` INT DEFAULT 1,
                `pay_rate` INT DEFAULT 200,
                `total_earned` BIGINT DEFAULT 0,
                `hired_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY `unique_emp` (`venue_id`, `identifier`)
            );]],
            [[CREATE TABLE IF NOT EXISTS `helix_signature_drinks` (
                `drink_id` VARCHAR(64) PRIMARY KEY,
                `venue_id` VARCHAR(50),
                `creator_identifier` VARCHAR(64),
                `label` VARCHAR(100),
                `glass_type` VARCHAR(30),
                `ice_type` VARCHAR(30),
                `ingredients` LONGTEXT,
                `shaken` TINYINT DEFAULT 0,
                `garnish` VARCHAR(50) NULL,
                `price` INT DEFAULT 50,
                `color` VARCHAR(50) DEFAULT 'rgba(255, 100, 150, 0.8)',
                `buff_type` VARCHAR(30) DEFAULT 'stamina',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );]],
            [[CREATE TABLE IF NOT EXISTS `helix_venue_stock` (
                `venue_id` VARCHAR(50),
                `item_name` VARCHAR(50),
                `quantity` INT DEFAULT 0,
                PRIMARY KEY (`venue_id`, `item_name`)
            );]],
            [[CREATE TABLE IF NOT EXISTS `helix_venue_ledger` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `venue_id` VARCHAR(50),
                `type` VARCHAR(30),
                `amount` INT,
                `description` VARCHAR(255),
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );]]
        }

        for _, tblQuery in ipairs(tables) do
            if MySQL and MySQL.query and MySQL.query.await then
                pcall(function() MySQL.query.await(tblQuery) end)
            elseif exports.oxmysql and exports.oxmysql.query_async then
                pcall(function() exports.oxmysql:query_async(tblQuery) end)
            end
        end

        if cb then cb() end
    end)
end

local function LoadJSONData()
    local content = LoadResourceFile(GetCurrentResourceName(), JSON_FILE)
    if content and content ~= '' then
        local decoded = json.decode(content)
        if decoded then
            memoryData = decoded
        end
    end
end

local function SaveJSONData()
    if Storage.UseMySQL then return end
    SaveResourceFile(GetCurrentResourceName(), JSON_FILE, json.encode(memoryData, { indent = true }), -1)
end

function Storage.Init()
    local function populateDefaultVenues()
        for venueId, data in pairs(Config.Venues) do
            Storage.GetVenue(venueId, function(v)
                if not v then
                    Storage.CreateVenue(venueId, nil, nil, data.entryFeeDefault, data.safe.code)
                end
            end)
        end
    end

    if Config.Storage == 'oxmysql' or (Config.Storage == 'auto' and GetResourceState('oxmysql') == 'started') then
        Storage.UseMySQL = true
        if MySQL and MySQL.ready then
            MySQL.ready(function()
                InitMySQLSchema(function()
                    populateDefaultVenues()
                    print('^2[helix_hospitality]^0 Persistence initialized via MySQL / oxmysql.')
                end)
            end)
        else
            CreateThread(function()
                while GetResourceState('oxmysql') ~= 'started' do
                    Wait(100)
                end
                InitMySQLSchema(function()
                    populateDefaultVenues()
                    print('^2[helix_hospitality]^0 Persistence initialized via MySQL / oxmysql.')
                end)
            end)
        end
    else
        Storage.UseMySQL = false
        LoadJSONData()
        populateDefaultVenues()
        print('^3[helix_hospitality]^0 Standalone JSON storage active (data/saved_venues.json).')
    end
end

-- ============================================================================
-- VENUE DATA METHODS
-- ============================================================================
function Storage.GetVenue(venueId, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:single('SELECT * FROM helix_venues WHERE venue_id = ?', { venueId }, function(row)
            cb(row)
        end)
    else
        cb(memoryData.venues[venueId])
    end
end

function Storage.GetAllVenues(cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:query('SELECT * FROM helix_venues', {}, function(rows)
            cb(rows or {})
        end)
    else
        cb(memoryData.venues)
    end
end

function Storage.CreateVenue(venueId, ownerId, ownerName, entryFee, safePin)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:insert('INSERT INTO helix_venues (venue_id, owner_id, owner_name, entry_fee, safe_pin) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE entry_fee = ?',
            { venueId, ownerId, ownerName, entryFee or 50, safePin or '1234', entryFee or 50 })
    else
        memoryData.venues[venueId] = {
            venue_id = venueId,
            owner_id = ownerId,
            owner_name = ownerName,
            safe_balance = 0,
            safe_pin = safePin or '1234',
            entry_fee = entryFee or 50,
            hype_level = 65.0,
            is_open = 1
        }
        SaveJSONData()
    end
end

function Storage.UpdateVenueSafe(venueId, deltaAmount, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:update('UPDATE helix_venues SET safe_balance = GREATEST(0, safe_balance + ?) WHERE venue_id = ?',
            { deltaAmount, venueId }, function(affected)
                if cb then cb(affected > 0) end
            end)
    else
        if memoryData.venues[venueId] then
            memoryData.venues[venueId].safe_balance = math.max(0, (memoryData.venues[venueId].safe_balance or 0) + deltaAmount)
            SaveJSONData()
            if cb then cb(true) end
        else
            if cb then cb(false) end
        end
    end
end

function Storage.UpdateVenueOwner(venueId, ownerId, ownerName, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:update('UPDATE helix_venues SET owner_id = ?, owner_name = ? WHERE venue_id = ?',
            { ownerId, ownerName, venueId }, function(affected)
                if cb then cb(affected > 0) end
            end)
    else
        if memoryData.venues[venueId] then
            memoryData.venues[venueId].owner_id = ownerId
            memoryData.venues[venueId].owner_name = ownerName
            SaveJSONData()
            if cb then cb(true) end
        end
    end
end

-- ============================================================================
-- SIGNATURE DRINKS STORAGE
-- ============================================================================
function Storage.SaveSignatureDrink(drinkData, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:insert([[
            INSERT INTO helix_signature_drinks (drink_id, venue_id, creator_identifier, label, glass_type, ice_type, ingredients, shaken, garnish, price, color, buff_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ]], {
            drinkData.id, drinkData.venueId, drinkData.creator, drinkData.label,
            drinkData.glassType, drinkData.iceType, json.encode(drinkData.ingredients),
            drinkData.shaken and 1 or 0, drinkData.garnish, drinkData.price, drinkData.color, drinkData.buffType
        }, function(id)
            if cb then cb(id ~= nil) end
        end)
    else
        memoryData.signature_drinks[drinkData.id] = drinkData
        SaveJSONData()
        if cb then cb(true) end
    end
end

function Storage.GetVenueSignatureDrinks(venueId, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:query('SELECT * FROM helix_signature_drinks WHERE venue_id = ?', { venueId }, function(rows)
            local list = {}
            for _, r in ipairs(rows or {}) do
                r.ingredients = json.decode(r.ingredients or '[]')
                table.insert(list, r)
            end
            cb(list)
        end)
    else
        local list = {}
        for _, d in pairs(memoryData.signature_drinks or {}) do
            if d.venueId == venueId then
                table.insert(list, d)
            end
        end
        cb(list)
    end
end

-- ============================================================================
-- EMPLOYEES & LEDGER
-- ============================================================================
function Storage.GetVenueEmployees(venueId, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:query('SELECT * FROM helix_employees WHERE venue_id = ?', { venueId }, function(rows)
            cb(rows or {})
        end)
    else
        local emps = {}
        for _, e in pairs(memoryData.employees or {}) do
            if e.venue_id == venueId then table.insert(emps, e) end
        end
        cb(emps)
    end
end

function Storage.AddEmployee(venueId, identifier, name, rankId, payRate, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:insert('INSERT INTO helix_employees (venue_id, identifier, name, rank_id, pay_rate) VALUES (?, ?, ?, ?, ?)',
            { venueId, identifier, name, rankId, payRate }, function(id)
                if cb then cb(id ~= nil) end
            end)
    else
        local key = venueId .. '_' .. identifier
        memoryData.employees[key] = {
            venue_id = venueId,
            identifier = identifier,
            name = name,
            rank_id = rankId,
            pay_rate = payRate,
            total_earned = 0
        }
        SaveJSONData()
        if cb then cb(true) end
    end
end

function Storage.RemoveEmployee(venueId, identifier, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:query('DELETE FROM helix_employees WHERE venue_id = ? AND identifier = ?',
            { venueId, identifier }, function(result)
                if cb then cb(true) end
            end)
    else
        local key = venueId .. '_' .. identifier
        memoryData.employees[key] = nil
        SaveJSONData()
        if cb then cb(true) end
    end
end

function Storage.AddLedgerEntry(venueId, eType, amount, description)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:insert('INSERT INTO helix_venue_ledger (venue_id, type, amount, description) VALUES (?, ?, ?, ?)',
            { venueId, eType, amount, description })
    else
        table.insert(memoryData.ledger, {
            venue_id = venueId,
            type = eType,
            amount = amount,
            description = description,
            created_at = os.date('%Y-%m-%d %H:%M:%S')
        })
        SaveJSONData()
    end
end

function Storage.GetVenueLedger(venueId, cb)
    if Storage.UseMySQL and exports.oxmysql then
        exports.oxmysql:query('SELECT * FROM helix_venue_ledger WHERE venue_id = ? ORDER BY id DESC LIMIT 50', { venueId }, function(rows)
            cb(rows or {})
        end)
    else
        local list = {}
        for _, l in ipairs(memoryData.ledger or {}) do
            if l.venue_id == venueId then table.insert(list, l) end
        end
        cb(list)
    end
end
