Config = {}
Config.StartingCash = 500
Config.AdminAce = 'munchies.admin'

-- ==============================================================================
-- AI ROAMING TRUCK & SCHEDULED ROUTE STOPS
-- ==============================================================================
Config.AITruck = {
    enabled = true,                -- true = AI driver drives across map with stops; false = static parked shop
    truckModel = 'taco',           -- Vehicle model
    driverModel = 's_m_m_linecook', -- Driver ped model
    drivingSpeed = 13.5,           -- Driving speed in m/s (~30 mph)
    drivingStyle = 786603,         -- Realistic traffic driving (obeys lights, lanes, stops for obstacles)
    stopDuration = 120,            -- Time in seconds to park at each stop before driving to next (2 mins)
    honkOnArrival = true,          -- Honk horn upon pulling into a stop
    honkOnDeparture = true,        -- Honk horn right before driving away
    broadcastArrival = true,       -- Send server-wide notification when truck arrives at a stop
    interactionDistance = 4.0,     -- Max distance from truck to press [E]
    drawDistance = 25.0,           -- Draw distance for 3D marker/text
    blip = {
        enabled = true,
        sprite = 106,              -- Food truck blip sprite
        color = 2,                 -- Green
        scale = 0.85,
        name = 'Munchies Food Truck'
    },
    -- Route Stops across San Andreas (Exact roadway nodes)
    Stops = {
        {
            name = 'Legion Square',
            coords = vector4(215.11, -810.05, 30.73, 160.0),
            description = 'Downtown central street by Legion Square'
        },
        {
            name = 'Del Perro Pier',
            coords = vector4(-1607.72, -1035.85, 13.01, 320.0),
            description = 'Oceanfront road by pier entrance'
        },
        {
            name = 'Vinewood Boulevard',
            coords = vector4(304.55, 143.91, 103.88, 160.0),
            description = 'Vinewood nightlife street lane'
        },
        {
            name = 'Mirror Park',
            coords = vector4(1048.24, -773.12, 57.92, 270.0),
            description = 'Mirror Park lakeside road'
        },
        {
            name = 'Davis Mega Mall',
            coords = vector4(116.48, -1950.21, 20.75, 315.0),
            description = 'Innocence Blvd commercial lane'
        },
        {
            name = 'Sandy Shores Diner',
            coords = vector4(1982.72, 3052.12, 47.21, 60.0),
            description = 'Alhambra Dr desert highway stop'
        }
    }
}

-- Fallback static shop settings (used if Config.AITruck.enabled = false)
Config.Shop = {
    coords = vector4(-1195.19, -892.42, 13.98, 305.0),
    truckModel = 'taco',
    spawnTruck = true,
    pedModel = 's_m_m_linecook',
    pedCoords = vector4(-1193.86, -891.08, 13.98, 305.0),
    spawnPed = true,
    interactionDistance = 2.5,
    drawDistance = 20.0,
    blip = true,
    blipSprite = 106,
    blipScale = 0.75,
    blipName = 'Munchies Delivery'
}

-- ==============================================================================
-- FOOD & DRINK MENU
-- ==============================================================================
Config.Menu = {
    MUNCHIES = {
        { id = 'loaded_munchies', name = 'Loaded Munchies', icon = '🍔', description = 'Double patty, cheese and crispy toppings.', price = 18, health = 28 },
        { id = 'street_tacos', name = 'Street Tacos', icon = '🌮', description = 'Three loaded street tacos.', price = 14, health = 22 },
        { id = 'hot_wings', name = 'Hot Wings', icon = '🍗', description = 'Eight crispy wings with sauce.', price = 16, health = 24 },
        { id = 'loaded_fries', name = 'Loaded Fries', icon = '🍟', description = 'Crispy fries with cheese sauce.', price = 12, health = 18 },
        { id = 'grilled_cheese', name = 'Grilled Cheese', icon = '🥪', description = 'Golden bread and melted cheese.', price = 10, health = 16 },
        { id = 'munchie_box', name = 'Munchie Box', icon = '📦', description = 'Fries, wings, tenders and sauces.', price = 24, health = 35 }
    },
    DRINKS = {
        { id = 'purple_haze', name = 'Purple Haze Soda', icon = '🥤', description = 'Cold grape soda over ice.', price = 6, health = 10 },
        { id = 'green_rush', name = 'Green Rush', icon = '🧃', description = 'Lime citrus cooler.', price = 7, health = 12 },
        { id = 'cola', name = 'Ice Cold Cola', icon = '🥤', description = 'Classic chilled cola.', price = 5, health = 8 },
        { id = 'fruit_punch', name = 'Fruit Punch', icon = '🍹', description = 'Sweet mixed-fruit punch.', price = 6, health = 10 }
    },
    DESSERTS = {
        { id = 'chocolate_shake', name = 'Chocolate Shake', icon = '🥤', description = 'Thick chocolate shake.', price = 9, health = 15 },
        { id = 'brownie_bites', name = 'Brownie Bites', icon = '🍫', description = 'Warm brownie bites.', price = 8, health = 13 },
        { id = 'cookie_stack', name = 'Cookie Stack', icon = '🍪', description = 'Fresh baked cookies.', price = 7, health = 12 }
    }
}
