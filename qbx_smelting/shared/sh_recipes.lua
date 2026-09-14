Config = Config or {}

Config.Recipes = {
    -- ==========================================
    -- 1. ORES & RAW MINERALS
    -- ==========================================
    ['iron_ingot'] = {
        label = "Refined Iron Ingot",
        category = "ores",
        minTemp = 800,           -- Melting point in Celsius
        optimalTemp = 1100,
        smeltTime = 8000,        -- Smelting time in ms
        inputs = {
            { item = "iron_ore", count = 3, label = "Iron Ore" }
        },
        outputs = {
            { item = "iron_ingot", count = 1, label = "Iron Ingot" }
        },
        slagOutput = { item = "slag_waste", chance = 20, count = 1 },
        description = "Smelt raw iron ore into a heavy, workable refined iron ingot."
    },
    ['copper_ingot'] = {
        label = "Refined Copper Ingot",
        category = "ores",
        minTemp = 750,
        optimalTemp = 1050,
        smeltTime = 7000,
        inputs = {
            { item = "copper_ore", count = 3, label = "Copper Ore" }
        },
        outputs = {
            { item = "copper_ingot", count = 1, label = "Copper Ingot" }
        },
        slagOutput = { item = "slag_waste", chance = 15, count = 1 },
        description = "High-conductivity copper ingot smelted from raw ore deposits."
    },
    ['gold_ingot'] = {
        label = "24K Pure Gold Bullion",
        category = "ores",
        minTemp = 950,
        optimalTemp = 1150,
        smeltTime = 12000,
        inputs = {
            { item = "gold_ore", count = 4, label = "Gold Ore" }
        },
        outputs = {
            { item = "gold_ingot", count = 1, label = "Gold Ingot" }
        },
        slagOutput = { item = "slag_waste", chance = 10, count = 1 },
        description = "Solid high-purity gold bullion stamped and ready for market."
    },
    ['silver_ingot'] = {
        label = "Pure Silver Ingot",
        category = "ores",
        minTemp = 700,
        optimalTemp = 960,
        smeltTime = 7500,
        inputs = {
            { item = "silver_ore", count = 3, label = "Silver Ore" }
        },
        outputs = {
            { item = "silver_ingot", count = 1, label = "Silver Ingot" }
        },
        slagOutput = { item = "slag_waste", chance = 15, count = 1 },
        description = "Refined .999 pure silver ingot."
    },
    ['aluminum_ingot'] = {
        label = "Aluminum Ingot",
        category = "ores",
        minTemp = 600,
        optimalTemp = 750,
        smeltTime = 5000,
        inputs = {
            { item = "bauxite_ore", count = 3, label = "Bauxite Ore" }
        },
        outputs = {
            { item = "aluminum_ingot", count = 1, label = "Aluminum Ingot" }
        },
        description = "Lightweight, corrosion-resistant aluminum ingot."
    },

    -- ==========================================
    -- 2. ALLOYS & REFINED METALS
    -- ==========================================
    ['steel_ingot'] = {
        label = "High-Grade Steel Ingot",
        category = "alloys",
        minTemp = 1100,
        optimalTemp = 1450,
        smeltTime = 10000,
        inputs = {
            { item = "iron_ingot", count = 2, label = "Iron Ingot" },
            { item = "coal", count = 1, label = "Lump Coal" }
        },
        outputs = {
            { item = "steel_ingot", count = 1, label = "Steel Ingot" }
        },
        description = "Carbon-infused iron alloy forming durable high-grade structural steel."
    },
    ['brass_ingot'] = {
        label = "Refined Brass Ingot",
        category = "alloys",
        minTemp = 850,
        optimalTemp = 1020,
        smeltTime = 8000,
        inputs = {
            { item = "copper_ingot", count = 1, label = "Copper Ingot" },
            { item = "zinc_scrap", count = 1, label = "Zinc Scrap" }
        },
        outputs = {
            { item = "brass_ingot", count = 1, label = "Brass Ingot" }
        },
        description = "Acoustic and rust-resistant copper-zinc alloy."
    },

    -- ==========================================
    -- 3. RECYCLED SCRAP & URBAN SALVAGE
    -- ==========================================
    ['scrap_to_iron'] = {
        label = "Melted Scrap Iron",
        category = "scrap",
        minTemp = 800,
        optimalTemp = 1100,
        smeltTime = 6500,
        inputs = {
            { item = "scrap_metal", count = 5, label = "Scrap Metal" }
        },
        outputs = {
            { item = "iron_ingot", count = 1, label = "Iron Ingot" }
        },
        slagOutput = { item = "slag_waste", chance = 30, count = 1 },
        description = "Recycle junk vehicle parts and discarded scrap into usable iron."
    },
    ['cans_to_aluminum'] = {
        label = "Recycled Aluminum Bar",
        category = "scrap",
        minTemp = 550,
        optimalTemp = 700,
        smeltTime = 4000,
        inputs = {
            { item = "empty_can", count = 8, label = "Crushed Soda Cans" }
        },
        outputs = {
            { item = "aluminum_ingot", count = 1, label = "Aluminum Ingot" }
        },
        description = "Melt down aluminum soda cans into a neat ingot."
    },
    ['copper_wire_to_ingot'] = {
        label = "Recycled Copper Wire",
        category = "scrap",
        minTemp = 750,
        optimalTemp = 1050,
        smeltTime = 6000,
        inputs = {
            { item = "copper_wire", count = 4, label = "Stripped Copper Wire" }
        },
        outputs = {
            { item = "copper_ingot", count = 1, label = "Copper Ingot" }
        },
        description = "Melt down stripped electrical wiring into clean copper."
    },

    -- ==========================================
    -- 4. BLACK MARKET / STOLEN JEWELRY MELTING
    -- ==========================================
    ['stolen_watches_to_gold'] = {
        label = "Melt Luxury Watches (Rolex)",
        category = "jewelry",
        minTemp = 950,
        optimalTemp = 1200,
        smeltTime = 10000,
        inputs = {
            { item = "rolex", count = 2, label = "Gold Luxury Watch" }
        },
        outputs = {
            { item = "melted_gold", count = 1, label = "Unmarked Melted Gold" }
        },
        description = "Strip serial numbers and melt luxury watches into an untraceable gold bar."
    },
    ['stolen_chains_to_gold'] = {
        label = "Melt Gold Chains",
        category = "jewelry",
        minTemp = 900,
        optimalTemp = 1150,
        smeltTime = 9000,
        inputs = {
            { item = "gold_chain", count = 3, label = "Gold Chain" }
        },
        outputs = {
            { item = "melted_gold", count = 1, label = "Unmarked Melted Gold" }
        },
        description = "Melt stolen chains into unmarked bullion."
    },
    ['diamond_rings_to_melt'] = {
        label = "Extract Diamonds & Melt Ring",
        category = "jewelry",
        minTemp = 900,
        optimalTemp = 1150,
        smeltTime = 11000,
        inputs = {
            { item = "diamond_ring", count = 2, label = "Diamond Ring" }
        },
        outputs = {
            { item = "melted_gold", count = 1, label = "Unmarked Melted Gold" },
            { item = "loose_diamond", count = 2, label = "Loose Cut Diamond" }
        },
        description = "Melt the gold band and recover clean, unmounted loose diamonds."
    }
}
