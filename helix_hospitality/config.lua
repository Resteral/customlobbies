-- ============================================================================
-- HELIX HOSPITALITY & NIGHTLIFE TYCOON - MASTER CONFIGURATION
-- ============================================================================

Config = {}

-- ============================================================================
-- 1. CORE & FRAMEWORK AUTO-DETECTION
-- ============================================================================
-- 'auto' automatically detects your installed frameworks, inventories, and target systems.
-- You can also force a specific mode by typing its string below.
Config.Framework   = 'auto'  -- Options: 'auto', 'standalone', 'qbcore', 'esx', 'qbox', 'nd'
Config.Inventory   = 'auto'  -- Options: 'auto', 'standalone', 'ox_inventory', 'qb-inventory', 'ps-inventory', 'qs-inventory'
Config.Target      = 'auto'  -- Options: 'auto', 'ox_target', 'qb-target', 'qtarget', 'none' (uses 3D text & [E] markers)
Config.Storage     = 'auto'  -- Options: 'auto', 'oxmysql', 'json' (JSON mode saves to data/saved_venues.json for 100% standalone)

Config.Debug       = false   -- Set to true to view zone wireframes and debug console outputs

-- ============================================================================
-- 2. ECONOMY & MANAGEMENT SETTINGS
-- ============================================================================
Config.Currency                 = '$'    -- Currency symbol displayed in UI
Config.PayrollIntervalMinutes   = 30     -- Automated staff wages payout interval in minutes
Config.MaxSignatureDrinksPerVenue = 15   -- Maximum custom signature cocktails a venue owner can invent
Config.VenueHypeDecayMinutes    = 60     -- Venue popularity/hype decreases naturally every X minutes if inactive
Config.HypeBonusPerDrinkSale    = 0.5    -- Hype gained per drink sold to patrons
Config.RequireIngredients       = false  -- Set to false so bartenders can freely mix all drinks using bar counter taps/stock (set true to require inventory items)

-- Staff hierarchy and default salary rates
Config.Ranks = {
    [1] = { name = 'Barback',        label = 'Barback',        defaultPay = 150, canCraft = true,  canRegister = false, canOrderStock = false, canManageEmployees = false, canAccessSafe = false },
    [2] = { name = 'Bartender',      label = 'Bartender',      defaultPay = 300, canCraft = true,  canRegister = true,  canOrderStock = false, canManageEmployees = false, canAccessSafe = false },
    [3] = { name = 'VIP_Host',       label = 'VIP Host',       defaultPay = 450, canCraft = true,  canRegister = true,  canOrderStock = false, canManageEmployees = false, canAccessSafe = false },
    [4] = { name = 'Lead_Mixologist',label = 'Lead Mixologist',defaultPay = 600, canCraft = true,  canRegister = true,  canOrderStock = true,  canManageEmployees = false, canAccessSafe = false },
    [5] = { name = 'Manager',        label = 'Manager',        defaultPay = 900, canCraft = true,  canRegister = true,  canOrderStock = true,  canManageEmployees = true,  canAccessSafe = true },
    [6] = { name = 'Owner',          label = 'Owner / Boss',   defaultPay = 0,   canCraft = true,  canRegister = true,  canOrderStock = true,  canManageEmployees = true,  canAccessSafe = true }
}

-- ============================================================================
-- 3. MIXOLOGY QUALITY & PRECISION ENGINE
-- ============================================================================
Config.Mixology = {
    PourTolerance = 0.08,        -- Sweet spot tolerance window (+/-) for hold-to-pour accuracy
    ShakerRhythmTolerance = 200, -- Milliseconds timing window for hitting shaker beat pulses
    AudioSynthesis = true,       -- Enable procedural WebAudio fluid streams, ice clinks, and shaker rattles

    -- 1 to 5 Star Quality Rating multipliers
    QualityStars = {
        [1] = { label = 'Poor',       buffMultiplier = 0.6, priceMultiplier = 0.70, drunkMultiplier = 1.20 },
        [2] = { label = 'Standard',   buffMultiplier = 0.8, priceMultiplier = 0.90, drunkMultiplier = 1.00 },
        [3] = { label = 'Good',       buffMultiplier = 1.0, priceMultiplier = 1.00, drunkMultiplier = 1.00 },
        [4] = { label = 'Great',      buffMultiplier = 1.3, priceMultiplier = 1.35, drunkMultiplier = 0.95 },
        [5] = { label = 'Masterpiece',buffMultiplier = 1.7, priceMultiplier = 1.80, drunkMultiplier = 0.90 }
    }
}

-- ============================================================================
-- 4. BLOOD ALCOHOL CONTENT (BAC) & DRUNKENNESS ENGINE
-- ============================================================================
Config.Alcohol = {
    DecayRatePerMinute = 0.003,  -- Natural BAC reduction rate per minute
    LegalDrivingLimit = 0.08,    -- Standard legal driving BAC limit for breathalyzers
    MaxBAC = 0.35,               -- Maximum BAC cap before blackout

    -- 5-Tiered Drunkenness Effects
    Tiers = {
        [1] = {
            minBAC = 0.02,
            maxBAC = 0.05,
            screenFilter = 'drunk_mild',
            walkStyle = nil,
            stumbleChance = 0,
            staminaRegenBoost = 1.10,
            description = 'Mild Buzz - Warm feeling and elevated stamina.'
        },
        [2] = {
            minBAC = 0.05,
            maxBAC = 0.12,
            screenFilter = 'drunk_medium',
            walkStyle = 'move_m@drunk@slightlydrunk',
            stumbleChance = 0.05,
            recoilReduction = 0.15,
            description = 'Tipsy - Starting to wobble, slightly impaired.'
        },
        [3] = {
            minBAC = 0.12,
            maxBAC = 0.20,
            screenFilter = 'spectator5',
            walkStyle = 'move_m@drunk@moderatedrunk',
            stumbleChance = 0.25,
            slurredSpeech = true,
            description = 'Drunk - High camera sway, tripping chances when sprinting.'
        },
        [4] = {
            minBAC = 0.20,
            maxBAC = 0.30,
            screenFilter = 'drug_drive_blend01',
            walkStyle = 'move_m@drunk@verydrunk',
            stumbleChance = 0.60,
            ragdollOnSprint = true,
            description = 'Wasted - Struggling to stand upright, massive disorientation.'
        },
        [5] = {
            minBAC = 0.30,
            maxBAC = 1.00,
            blackout = true,
            passoutDurationMs = 25000,
            description = 'Alcohol Poisoning - Blackout.'
        }
    },

    -- Consumable items that sober up players
    SoberItems = {
        ['water_bottle']   = { bacReduction = 0.03 },
        ['energy_drink']   = { bacReduction = 0.04 },
        ['hot_coffee']     = { bacReduction = 0.05 },
        ['hangover_pill']  = { bacReduction = 0.12 }
    }
}

-- ============================================================================
-- 5. VIP BOTTLE SERVICE PACKAGES & SPARKLER CEREMONY
-- ============================================================================
Config.BottleService = {
    SparklerParticleDict = 'core',
    SparklerParticleName = 'exp_grd_flare', -- Golden flare / sparkler particle FX
    TrayProp = `bkr_prop_biker_tray_01`,
    IceBucketProp = `prop_champ_cool`,
    Packages = {
        ['ace_of_spades'] = {
            label = 'Armand de Brignac (Ace of Spades Gold)',
            price = 5500,
            bottleProp = `prop_champ_01a`,
            servings = 6,
            bacPerServing = 0.04,
            hypeReward = 5.0,
            sparklerColor = { r = 1.0, g = 0.85, b = 0.2 } -- Gold
        },
        ['don_julio_1942'] = {
            label = 'Don Julio 1942 Añejo Tequila',
            price = 4500,
            bottleProp = `prop_tequila_bottle`,
            servings = 8,
            bacPerServing = 0.05,
            hypeReward = 4.5,
            sparklerColor = { r = 0.2, g = 0.9, b = 1.0 } -- Cyan Ice
        },
        ['clase_azul'] = {
            label = 'Clase Azul Reposado Tequila',
            price = 4200,
            bottleProp = `prop_tequila_bottle`,
            servings = 8,
            bacPerServing = 0.05,
            hypeReward = 4.0,
            sparklerColor = { r = 1.0, g = 0.2, b = 0.6 } -- Magenta VIP
        },
        ['dom_perignon'] = {
            label = 'Dom Pérignon Luminous Vintage',
            price = 3600,
            bottleProp = `prop_champ_01a`,
            servings = 6,
            bacPerServing = 0.04,
            hypeReward = 3.5,
            sparklerColor = { r = 0.8, g = 1.0, b = 0.2 } -- Emerald Gold
        },
        ['hennessy_paradis'] = {
            label = 'Hennessy Paradis Rare Cognac',
            price = 6000,
            bottleProp = `prop_cs_bottle_shot`,
            servings = 8,
            bacPerServing = 0.05,
            hypeReward = 6.0,
            sparklerColor = { r = 1.0, g = 0.5, b = 0.0 } -- Amber Fire
        }
    }
}

-- ============================================================================
-- 6. PRE-CONFIGURED PRESET VENUES
-- ============================================================================
Config.Venues = {
    ['bahama_mamas'] = {
        id = 'bahama_mamas',
        name = 'Bahama Mamas West',
        tagline = 'Tropical Luxury Nightclub',
        buyPrice = 750000,
        rentPricePerDay = 5000,
        entryFeeDefault = 50,
        blip = { coords = vector3(-1388.58, -588.62, 30.32), sprite = 93, color = 48, scale = 0.8 },
        door = { coords = vector3(-1388.58, -588.62, 30.32), radius = 2.5 },
        bars = {
            { id = 1, coords = vector3(-1394.88, -606.34, 30.32), heading = 35.0,  label = 'Main Bar Station A' },
            { id = 2, coords = vector3(-1390.45, -600.82, 30.32), heading = 125.0, label = 'Main Bar Station B' }
        },
        registers = {
            { id = 1, coords = vector3(-1393.55, -604.88, 30.32), label = 'Bar Register #1' },
            { id = 2, coords = vector3(-1389.20, -599.55, 30.32), label = 'Entrance Register' }
        },
        safe = { coords = vector3(-1383.62, -630.12, 30.82), code = '4829' },
        managementTablet = { coords = vector3(-1385.12, -627.55, 30.82) },
        djBooth = { coords = vector3(-1379.88, -615.22, 31.15), radius = 35.0 },
        vipBooths = {
            { id = 'vip_1', label = 'Ultra VIP Red Room', coords = vector3(-1385.22, -591.45, 30.32), capacity = 6, minSpend = 2500 },
            { id = 'vip_2', label = 'Balcony Mezzanine',   coords = vector3(-1375.44, -608.12, 34.50), capacity = 8, minSpend = 4000 }
        },
        stockDeliveryDrop = { coords = vector3(-1401.88, -579.55, 30.32), heading = 210.0 }
    },
    ['galaxy_club'] = {
        id = 'galaxy_club',
        name = 'Galaxy Superclub',
        tagline = 'The Pulse of Vinewood',
        buyPrice = 1200000,
        rentPricePerDay = 8500,
        entryFeeDefault = 100,
        blip = { coords = vector3(5.12, 221.88, 107.75), sprite = 614, color = 27, scale = 0.85 },
        door = { coords = vector3(5.12, 221.88, 107.75), radius = 3.0 },
        bars = {
            { id = 1, coords = vector3(128.55, -1283.45, 29.27), heading = 300.0, label = 'Galaxy Center Bar' },
            { id = 2, coords = vector3(121.22, -1289.88, 29.27), heading = 120.0, label = 'Galaxy Lounge Bar' }
        },
        registers = {
            { id = 1, coords = vector3(127.12, -1284.55, 29.27), label = 'Main Register' }
        },
        safe = { coords = vector3(135.88, -1275.22, 29.27), code = '7712' },
        managementTablet = { coords = vector3(134.45, -1277.88, 29.27) },
        djBooth = { coords = vector3(120.88, -1278.44, 30.50), radius = 40.0 },
        vipBooths = {
            { id = 'vip_1', label = 'Crown Skybox', coords = vector3(115.55, -1295.12, 33.20), capacity = 10, minSpend = 7500 }
        },
        stockDeliveryDrop = { coords = vector3(145.22, -1290.45, 29.27), heading = 90.0 }
    },
    ['vanilla_unicorn'] = {
        id = 'vanilla_unicorn',
        name = 'Vanilla Unicorn Gentlemen Club',
        tagline = 'Premier Entertainment & Cocktails',
        buyPrice = 650000,
        rentPricePerDay = 4500,
        entryFeeDefault = 40,
        blip = { coords = vector3(129.22, -1299.12, 29.23), sprite = 121, color = 8, scale = 0.8 },
        door = { coords = vector3(129.22, -1299.12, 29.23), radius = 2.5 },
        bars = {
            { id = 1, coords = vector3(129.12, -1282.88, 29.27), heading = 30.0, label = 'Unicorn Front Bar' }
        },
        registers = {
            { id = 1, coords = vector3(128.45, -1284.12, 29.27), label = 'Unicorn Register' }
        },
        safe = { coords = vector3(98.12, -1292.55, 29.27), code = '1984' },
        managementTablet = { coords = vector3(96.55, -1294.12, 29.27) },
        djBooth = { coords = vector3(121.22, -1288.55, 29.27), radius = 30.0 },
        vipBooths = {
            { id = 'vip_1', label = 'Backstage VIP Lounge', coords = vector3(104.22, -1298.55, 29.27), capacity = 4, minSpend = 2000 }
        },
        stockDeliveryDrop = { coords = vector3(138.88, -1305.12, 29.23), heading = 180.0 }
    },
    ['tequilala'] = {
        id = 'tequilala',
        name = 'Tequi-la-la Rock Bar',
        tagline = 'Classic Rock, Cold Drafts & Hard Liquor',
        buyPrice = 450000,
        rentPricePerDay = 3000,
        entryFeeDefault = 25,
        blip = { coords = vector3(-560.12, 286.55, 82.17), sprite = 93, color = 1, scale = 0.75 },
        door = { coords = vector3(-560.12, 286.55, 82.17), radius = 2.5 },
        bars = {
            { id = 1, coords = vector3(-562.45, 288.12, 82.17), heading = 175.0, label = 'Downstairs Rock Bar' }
        },
        registers = {
            { id = 1, coords = vector3(-561.12, 287.45, 82.17), label = 'Tequi-la-la Register' }
        },
        safe = { coords = vector3(-567.88, 294.12, 85.35), code = '6661' },
        managementTablet = { coords = vector3(-566.22, 292.88, 85.35) },
        djBooth = { coords = vector3(-552.12, 284.55, 82.95), radius = 30.0 },
        vipBooths = {
            { id = 'vip_1', label = 'Green Room Backstage', coords = vector3(-564.12, 299.12, 85.35), capacity = 6, minSpend = 1500 }
        },
        stockDeliveryDrop = { coords = vector3(-552.88, 298.55, 83.15), heading = 270.0 }
    },
    ['yellow_jack'] = {
        id = 'yellow_jack',
        name = 'Yellow Jack Inn',
        tagline = 'Desert Roadhouse, Whiskey & Darts',
        buyPrice = 300000,
        rentPricePerDay = 1800,
        entryFeeDefault = 10,
        blip = { coords = vector3(1986.12, 3053.88, 47.21), sprite = 93, color = 5, scale = 0.75 },
        door = { coords = vector3(1986.12, 3053.88, 47.21), radius = 2.0 },
        bars = {
            { id = 1, coords = vector3(1982.55, 3053.45, 47.21), heading = 60.0, label = 'Yellow Jack Saloon Bar' }
        },
        registers = {
            { id = 1, coords = vector3(1983.88, 3052.12, 47.21), label = 'Saloon Register' }
        },
        safe = { coords = vector3(1989.12, 3056.45, 47.21), code = '9021' },
        managementTablet = { coords = vector3(1988.45, 3055.12, 47.21) },
        djBooth = { coords = vector3(1980.12, 3050.22, 47.21), radius = 25.0 },
        vipBooths = {
            { id = 'vip_1', label = 'Biker Corner Table', coords = vector3(1984.88, 3048.55, 47.21), capacity = 6, minSpend = 800 }
        },
        stockDeliveryDrop = { coords = vector3(1996.12, 3046.22, 47.21), heading = 120.0 }
    }
}

-- ============================================================================
-- 7. WHOLESALE SUPPLY CATALOG: BRANDED LIQUORS, MIXERS & GARNISHES
-- ============================================================================
Config.WholesaleSupply = {
    -- REAL BRANDED VODKAS
    ['grey_goose_vodka']     = { label = 'Grey Goose Vodka (750ml)',        wholesalePrice = 55,  retailSuggested = 140, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['belvedere_vodka']      = { label = 'Belvedere Pure Vodka (750ml)',    wholesalePrice = 58,  retailSuggested = 150, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['titos_vodka']          = { label = "Tito's Handmade Vodka (750ml)",   wholesalePrice = 38,  retailSuggested = 100, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['absolut_vodka']        = { label = 'Absolut Swedish Vodka (750ml)',   wholesalePrice = 32,  retailSuggested = 85,  category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },

    -- REAL BRANDED TEQUILAS & MEZCALS
    ['patron_silver']        = { label = 'Patrón Silver Tequila (750ml)',   wholesalePrice = 65,  retailSuggested = 165, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['casamigos_blanco']     = { label = 'Casamigos Blanco Tequila (750ml)',wholesalePrice = 70,  retailSuggested = 180, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['don_julio_blanco']     = { label = 'Don Julio Blanco (750ml)',        wholesalePrice = 68,  retailSuggested = 175, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['del_maguey_mezcal']    = { label = 'Del Maguey Vida Mezcal (750ml)',  wholesalePrice = 52,  retailSuggested = 135, category = 'spirit', volumeMl = 750, alcoholPercent = 42.0 },

    -- REAL BRANDED WHISKIES, BOURBONS & COGNACS
    ['hennessy_vs']          = { label = 'Hennessy V.S Cognac (750ml)',     wholesalePrice = 62,  retailSuggested = 160, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['jameson_whiskey']      = { label = 'Jameson Irish Whiskey (750ml)',   wholesalePrice = 42,  retailSuggested = 110, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['jack_daniels']         = { label = "Jack Daniel's Old No. 7 (750ml)", wholesalePrice = 38,  retailSuggested = 100, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['macallan_12']          = { label = 'The Macallan 12 Double Cask',     wholesalePrice = 95,  retailSuggested = 240, category = 'spirit', volumeMl = 750, alcoholPercent = 43.0 },
    ['bulleit_bourbon']      = { label = 'Bulleit Frontier Bourbon (750ml)',wholesalePrice = 45,  retailSuggested = 120, category = 'spirit', volumeMl = 750, alcoholPercent = 45.0 },
    ['crown_royal']          = { label = 'Crown Royal Canadian Whisky',     wholesalePrice = 40,  retailSuggested = 105, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['fireball_whiskey']     = { label = 'Fireball Cinnamon Whisky (750ml)',wholesalePrice = 28,  retailSuggested = 75,  category = 'spirit', volumeMl = 750, alcoholPercent = 33.0 },

    -- REAL BRANDED GINS
    ['bombay_sapphire']      = { label = 'Bombay Sapphire Gin (750ml)',     wholesalePrice = 44,  retailSuggested = 115, category = 'spirit', volumeMl = 750, alcoholPercent = 47.0 },
    ['hendricks_gin']        = { label = "Hendrick's Botanical Gin (750ml)",wholesalePrice = 54,  retailSuggested = 140, category = 'spirit', volumeMl = 750, alcoholPercent = 41.4 },
    ['tanqueray_gin']        = { label = 'Tanqueray London Dry Gin (750ml)',wholesalePrice = 40,  retailSuggested = 105, category = 'spirit', volumeMl = 750, alcoholPercent = 47.3 },

    -- REAL BRANDED RUMS
    ['bacardi_superior']     = { label = 'Bacardi Superior White Rum (750ml)',wholesalePrice = 30, retailSuggested = 80,  category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },
    ['captain_morgan']       = { label = 'Captain Morgan Spiced Rum (750ml)', wholesalePrice = 32, retailSuggested = 85,  category = 'spirit', volumeMl = 750, alcoholPercent = 35.0 },
    ['malibu_rum']           = { label = 'Malibu Caribbean Coconut Rum',    wholesalePrice = 28,  retailSuggested = 75,  category = 'spirit', volumeMl = 750, alcoholPercent = 21.0 },
    ['havana_club_7']        = { label = 'Havana Club 7 Year Dark Rum',     wholesalePrice = 48,  retailSuggested = 125, category = 'spirit', volumeMl = 750, alcoholPercent = 40.0 },

    -- REAL BRANDED LIQUEURS, SCHNAPPS & BITTERS
    ['jagermeister']         = { label = 'Jägermeister Herbal Liqueur',     wholesalePrice = 38,  retailSuggested = 100, category = 'liqueur', volumeMl = 750, alcoholPercent = 35.0 },
    ['baileys_irish_cream']  = { label = 'Baileys Original Irish Cream',    wholesalePrice = 35,  retailSuggested = 90,  category = 'liqueur', volumeMl = 750, alcoholPercent = 17.0 },
    ['kahlua_coffee']        = { label = 'Kahlúa Coffee Liqueur (750ml)',   wholesalePrice = 32,  retailSuggested = 85,  category = 'liqueur', volumeMl = 750, alcoholPercent = 20.0 },
    ['cointreau_orange']     = { label = 'Cointreau Triple Sec Liqueur',    wholesalePrice = 45,  retailSuggested = 120, category = 'liqueur', volumeMl = 750, alcoholPercent = 40.0 },
    ['aperol_aperitivo']     = { label = 'Aperol Italian Aperitivo (750ml)',wholesalePrice = 34,  retailSuggested = 90,  category = 'liqueur', volumeMl = 750, alcoholPercent = 11.0 },
    ['campari_bitter']       = { label = 'Campari Red Bitter (750ml)',      wholesalePrice = 38,  retailSuggested = 100, category = 'liqueur', volumeMl = 750, alcoholPercent = 24.0 },
    ['peppermint_schnapps']  = { label = 'Rumple Minze Peppermint Schnapps',wholesalePrice = 36,  retailSuggested = 95,  category = 'liqueur', volumeMl = 750, alcoholPercent = 50.0 },
    ['blue_curacao']         = { label = 'DeKuyper Blue Curaçao (750ml)',   wholesalePrice = 25,  retailSuggested = 65,  category = 'liqueur', volumeMl = 750, alcoholPercent = 24.0 },
    ['midori_melon']         = { label = 'Midori Melon Liqueur (750ml)',    wholesalePrice = 36,  retailSuggested = 95,  category = 'liqueur', volumeMl = 750, alcoholPercent = 20.0 },
    ['angostura_bitters']    = { label = 'Angostura Aromatic Bitters (200ml)',wholesalePrice = 18,retailSuggested = 50,  category = 'liqueur', volumeMl = 200, alcoholPercent = 44.7 },

    -- MIXERS, JUICES & SODAS
    ['fevertree_tonic']      = { label = 'Fever-Tree Tonic Water (12pk)',   wholesalePrice = 24,  retailSuggested = 60,  category = 'mixer', volumeMl = 2400, alcoholPercent = 0.0 },
    ['fevertree_gingerbeer'] = { label = 'Fever-Tree Spiced Ginger Beer',   wholesalePrice = 26,  retailSuggested = 65,  category = 'mixer', volumeMl = 2400, alcoholPercent = 0.0 },
    ['red_bull_energy']      = { label = 'Red Bull Energy Drink Crate',     wholesalePrice = 45,  retailSuggested = 120, category = 'mixer', volumeMl = 6000, alcoholPercent = 0.0 },
    ['sparkling_prosecco']   = { label = 'La Marca Sparkling Prosecco',     wholesalePrice = 28,  retailSuggested = 75,  category = 'mixer', volumeMl = 750,  alcoholPercent = 11.0 },
    ['clamato_tomato_juice'] = { label = "Mott's Clamato & Tomato Juice",   wholesalePrice = 16,  retailSuggested = 40,  category = 'mixer', volumeMl = 1800, alcoholPercent = 0.0 },
    ['ocean_spray_cranberry']= { label = 'Ocean Spray Cranberry Juice Jug', wholesalePrice = 18,  retailSuggested = 45,  category = 'mixer', volumeMl = 2000, alcoholPercent = 0.0 },
    ['fresh_orange_juice']   = { label = 'Fresh Squeezed Orange Juice Jug', wholesalePrice = 18,  retailSuggested = 45,  category = 'mixer', volumeMl = 2000, alcoholPercent = 0.0 },
    ['fresh_pineapple_juice']= { label = 'Dole Pure Pineapple Juice (2L)',  wholesalePrice = 18,  retailSuggested = 45,  category = 'mixer', volumeMl = 2000, alcoholPercent = 0.0 },
    ['fresh_lime_juice']     = { label = 'Fresh Key Lime Juice Jug (1L)',   wholesalePrice = 15,  retailSuggested = 40,  category = 'mixer', volumeMl = 1000, alcoholPercent = 0.0 },
    ['fresh_lemon_juice']    = { label = 'Pure Eureka Lemon Juice Jug (1L)',wholesalePrice = 15,  retailSuggested = 40,  category = 'mixer', volumeMl = 1000, alcoholPercent = 0.0 },
    ['coconut_cream_coco']   = { label = 'Coco López Real Cream of Coconut',wholesalePrice = 16,  retailSuggested = 40,  category = 'mixer', volumeMl = 1000, alcoholPercent = 0.0 },
    ['club_soda_syrup']      = { label = 'Sparkling Club Soda Syrups (5L)', wholesalePrice = 20,  retailSuggested = 50,  category = 'mixer', volumeMl = 5000, alcoholPercent = 0.0 },
    ['cola_syrup']           = { label = 'Classic Cola Draft Syrup (5L)',   wholesalePrice = 25,  retailSuggested = 65,  category = 'mixer', volumeMl = 5000, alcoholPercent = 0.0 },
    ['simple_syrup']         = { label = 'Pure Cane Sugar Simple Syrup',    wholesalePrice = 12,  retailSuggested = 30,  category = 'mixer', volumeMl = 1000, alcoholPercent = 0.0 },
    ['grenadine_syrup']      = { label = 'Pomegranate Grenadine Syrup',     wholesalePrice = 14,  retailSuggested = 35,  category = 'mixer', volumeMl = 1000, alcoholPercent = 0.0 },

    -- GARNISHES, CONDIMENTS & RIM INGREDIENTS (OLIVES, SALT, SUGAR, PEPPERMINT, ETC.)
    ['cocktail_olives']      = { label = 'Castelvetrano Cocktail Olives Jar', wholesalePrice = 14, retailSuggested = 35, category = 'garnish', quantity = 60 },
    ['margarita_salt']       = { label = 'Flaked Sea Salt Rim Container',    wholesalePrice = 10, retailSuggested = 25, category = 'garnish', quantity = 100 },
    ['cane_sugar_rim']       = { label = 'Raw Cane Sugar Rim Container',     wholesalePrice = 10, retailSuggested = 25, category = 'garnish', quantity = 100 },
    ['crushed_peppermint']   = { label = 'Crushed Peppermint Candy Shaker',  wholesalePrice = 12, retailSuggested = 30, category = 'garnish', quantity = 80 },
    ['fresh_mint_sprig']     = { label = 'Fresh Spearmint & Peppermint Pack',wholesalePrice = 12, retailSuggested = 30, category = 'garnish', quantity = 50 },
    ['maraschino_cherries']  = { label = 'Luxardo Maraschino Cherries Jar',  wholesalePrice = 18, retailSuggested = 45, category = 'garnish', quantity = 60 },
    ['lime_wedges']          = { label = 'Fresh Cut Mexican Lime Wedges',    wholesalePrice = 10, retailSuggested = 25, category = 'garnish', quantity = 60 },
    ['orange_slices']        = { label = 'Dehydrated Orange Wheels Pack',    wholesalePrice = 12, retailSuggested = 30, category = 'garnish', quantity = 50 },
    ['cinnamon_sticks']      = { label = 'Ceylon Cinnamon Sticks Jar',       wholesalePrice = 14, retailSuggested = 35, category = 'garnish', quantity = 40 },
    ['whipped_cream']        = { label = 'Sweet Vanilla Whipped Cream Can',  wholesalePrice = 10, retailSuggested = 25, category = 'garnish', quantity = 40 },
    ['chocolate_syrup']      = { label = 'Artisan Dark Chocolate Drizzle',   wholesalePrice = 12, retailSuggested = 30, category = 'garnish', quantity = 50 },
    ['tabasco_hot_sauce']    = { label = 'Tabasco Brand Pepper Sauce',       wholesalePrice = 8,  retailSuggested = 20, category = 'garnish', quantity = 50 },
    ['cocktail_umbrellas']   = { label = 'Tropical Paper Umbrellas (100pk)', wholesalePrice = 8,  retailSuggested = 20, category = 'garnish', quantity = 100 },
    ['ice_bag']              = { label = 'Purified Triple-Filtered Ice (10kg)',wholesalePrice = 8, retailSuggested = 20, category = 'ice', quantity = 100 },
    ['cocktail_glassware']   = { label = 'Crystal Bar Glassware Crate (24pk)',wholesalePrice = 80,retailSuggested = 200, category = 'glass', quantity = 24 }
}
