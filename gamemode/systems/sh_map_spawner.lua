--[[
    City Underground - Shared Map Entity & NPC Placement System
    Defines archetype presets for persistent world NPCs, vendors, dealers, and interactive props.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Spawner = CityUnderground.Spawner or {}
CityUnderground.Spawner.Archetypes = CityUnderground.Spawner.Archetypes or {}

CityUnderground.Spawner.Archetypes["fisherman"] = {
    id = "fisherman",
    name = "Old Salty Fisherman",
    title = "Pier Pier-Master & Fishmonger",
    model = "models/player/fisherman.mdl",
    icon = "🎣",
    category = "Civic & Jobs",
    dialog = "The tides are high in New Harbor today. Looking for fresh bait or want to sell your morning catch?",
    action = "OPEN_FISHING_SHOP",
    shopItems = {
        { id = "fishing_rod", name = "Fiberglass Fishing Rod", price = 120, icon = "🎣" },
        { id = "fishing_bait", name = "Nightcrawler Bait Pack", price = 15, icon = "🪱" }
    },
    buyItems = {
        { id = "fish_bass", name = "Fresh Harbor Bass", price = 45, icon = "🐟" },
        { id = "fish_tuna", name = "Atlantic Bluefin Tuna", price = 95, icon = "🐟" },
        { id = "fish_crab", name = "New Harbor Blue Crab", price = 30, icon = "🦀" }
    }
}

CityUnderground.Spawner.Archetypes["gas_attendant"] = {
    id = "gas_attendant",
    name = "Sunoco Service Clerk",
    title = "Gas Station Employee",
    model = "models/player/gas_clerk.mdl",
    icon = "⛽",
    category = "Commercial Vendors",
    dialog = "Welcome to Sunoco! Premium unleaded, motor oil, and cold energy drinks ready for the road.",
    action = "OPEN_STORE",
    shopItems = {
        { id = "repair_kit", name = "Auto Repair Tool Kit", price = 150, icon = "🔧" },
        { id = "drink_coffee", name = "Hot Espresso Roast", price = 12, icon = "☕" },
        { id = "food_sandwich", name = "Deli Roast Sandwich", price = 15, icon = "🥪" },
        { id = "drink_water", name = "Bottled Spring Water", price = 10, icon = "💧" }
    }
}

CityUnderground.Spawner.Archetypes["drug_dealer"] = {
    id = "drug_dealer",
    name = "Alleyway Fence & Broker",
    title = "Underground Contraband Dealer",
    model = "models/player/dealer.mdl",
    icon = "🕶️",
    category = "Criminal Contacts",
    dialog = "Keep your voice down. What do you have to move, and how much cash are you looking for?",
    action = "OPEN_STREET_BUYER",
    shopItems = {
        { id = "contraband_reagents", name = "Chemical Reagent Flask", price = 120, icon = "🧪" },
        { id = "botany_seed", name = "Botanical Seed Pack", price = 35, icon = "🌱" }
    }
}

CityUnderground.Spawner.Archetypes["car_dealer"] = {
    id = "car_dealer",
    name = "Metro Motors Sales Agent",
    title = "Vehicle Dealership Representative",
    model = "models/player/suit.mdl",
    icon = "🚗",
    category = "Commercial Vendors",
    dialog = "Looking for a reliable compact, executive cruiser, or high-torque street muscle? Let's talk financing.",
    action = "OPEN_DEALERSHIP"
}

CityUnderground.Spawner.Archetypes["casino_dealer"] = {
    id = "casino_dealer",
    name = "Velvet Lounge Pit Boss",
    title = "High-Stakes Blackjack & Casino Dealer",
    model = "models/player/casino_dealer.mdl",
    icon = "🎲",
    category = "Entertainment & Nightlife",
    dialog = "Place your bets on the felt. Table limits range from $50 up to $10,000. Dealer stands on 17.",
    action = "OPEN_CASINO"
}

CityUnderground.Spawner.Archetypes["doctor"] = {
    id = "doctor",
    name = "Dr. Alvarez, MD",
    title = "Mercy Hospital ER Attending",
    model = "models/player/doctor.mdl",
    icon = "🏥",
    category = "Civic & Jobs",
    dialog = "Please step up for triage. We provide trauma treatments, sterile bandages, and checkups.",
    action = "HEAL_PLAYER",
    shopItems = {
        { id = "medkit", name = "Trauma First Aid Kit", price = 85, icon = "🩹" }
    }
}

CityUnderground.Spawner.Archetypes["courier_dispatch"] = {
    id = "courier_dispatch",
    name = "Logistics Dispatcher Evans",
    title = "Harbor Express Route Coordinator",
    model = "models/player/worker.mdl",
    icon = "📦",
    category = "Civic & Jobs",
    dialog = "We have freight routes waiting across the city. Ready to clock in for delivery runs?",
    action = "OPEN_DELIVERY"
}

CityUnderground.Spawner.Archetypes["atm_terminal"] = {
    id = "atm_terminal",
    name = "First Trust Automated ATM",
    title = "24/7 Banking Machine",
    model = "models/props/atm.mdl",
    icon = "💳",
    category = "Interactive Props",
    action = "OPEN_BANKING"
}

CityUnderground.Spawner.Archetypes["hydro_pot"] = {
    id = "hydro_pot",
    name = "Hydroponic Crop Planter",
    title = "Indoor Agricultural Pot",
    model = "models/props/pot.mdl",
    icon = "🪴",
    category = "Interactive Props",
    action = "OPEN_BOTANY"
}

CityUnderground.Spawner.Archetypes["synth_station"] = {
    id = "synth_station",
    name = "Chemical Synthesis Station",
    title = "Molecular Compound Chamber",
    model = "models/props/lab.mdl",
    icon = "⚗️",
    category = "Interactive Props",
    action = "OPEN_SYNTH"
}
