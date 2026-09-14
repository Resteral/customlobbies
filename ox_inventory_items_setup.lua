return {
    ['testburger'] = {
        label = 'Test Burger',
        weight = 220,
        degrade = 60,
        client = {
            image = 'burger_chicken.png',
            status = { hunger = 200000 },
            anim = 'eating',
            prop = 'burger',
            usetime = 2500,
            export = 'ox_inventory_examples.testburger'
        },
        server = {
            export = 'ox_inventory_examples.testburger',
            test = 'what an amazingly delicious burger, amirite?'
        },
        buttons = {
            {
                label = 'Lick it',
                action = function(slot)
                    print('You licked the burger')
                end
            },
            {
                label = 'Squeeze it',
                action = function(slot)
                    print('You squeezed the burger :(')
                end
            },
            {
                label = 'What do you call a vegan burger?',
                group = 'Hamburger Puns',
                action = function(slot)
                    print('A misteak.')
                end
            },
            {
                label = 'What do frogs like to eat with their hamburgers?',
                group = 'Hamburger Puns',
                action = function(slot)
                    print('French flies.')
                end
            },
            {
                label = 'Why were the burger and fries running?',
                group = 'Hamburger Puns',
                action = function(slot)
                    print('Because they\'re fast food.')
                end
            }
        },
        consume = 0.3
    },

    ['bandage'] = {
        label = 'Bandage',
        weight = 115,
    },

    ['burger'] = {
        label = 'Burger',
        weight = 220,
        client = {
            status = { hunger = 200000 },
            anim = 'eating',
            prop = 'burger',
            usetime = 2500,
            notification = 'You ate a delicious burger'
        },
    },

    ['sprunk'] = {
        label = 'Sprunk',
        weight = 350,
        client = {
            status = { thirst = 200000 },
            anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
            prop = { model = `prop_ld_can_01`, pos = vec3(0.01, 0.01, 0.06), rot = vec3(5.0, 5.0, -180.5) },
            usetime = 2500,
            notification = 'You quenched your thirst with a sprunk'
        }
    },

    ['parachute'] = {
        label = 'Parachute',
        weight = 8000,
        stack = false,
        client = {
            anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
            usetime = 1500
        }
    },

    ['garbage'] = {
        label = 'Garbage',
    },

    ['paperbag'] = {
        label = 'Paper Bag',
        weight = 1,
        stack = false,
        close = false,
        consume = 0
    },

    ['panties'] = {
        label = 'Knickers',
        weight = 10,
        consume = 0,
        client = {
            status = { thirst = -100000, stress = -25000 },
            anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
            prop = { model = `prop_cs_panties_02`, pos = vec3(0.03, 0.0, 0.02), rot = vec3(0.0, -13.5, -1.5) },
            usetime = 2500,
        }
    },

    ['lockpick'] = {
        label = 'Lockpick',
        weight = 160,
    },

    ['phone'] = {
        label = 'Phone',
        weight = 190,
        stack = false,
        consume = 0,
        client = {
            add = function(total)
                if total > 0 then
                    pcall(function() return exports.npwd:setPhoneDisabled(false) end)
                end
            end,

            remove = function(total)
                if total < 1 then
                    pcall(function() return exports.npwd:setPhoneDisabled(true) end)
                end
            end
        }
    },

    ['mustard'] = {
        label = 'Mustard',
        weight = 500,
        client = {
            status = { hunger = 25000, thirst = 25000 },
            anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
            prop = { model = `prop_food_mustard`, pos = vec3(0.01, 0.0, -0.07), rot = vec3(1.0, 1.0, -1.5) },
            usetime = 2500,
            notification = 'You... drank mustard'
        }
    },

    ['water'] = {
        label = 'Water',
        weight = 500,
        client = {
            status = { thirst = 200000 },
            anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
            prop = { model = `prop_ld_flow_bottle`, pos = vec3(0.03, 0.03, 0.02), rot = vec3(0.0, 0.0, -1.5) },
            usetime = 2500,
            cancel = true,
            notification = 'You drank some refreshing water'
        }
    },

    ['armour'] = {
        label = 'Bulletproof Vest',
        weight = 3000,
        stack = false,
        client = {
            anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
            usetime = 3500
        }
    },

    ['clothing'] = {
        label = 'Clothing',
        consume = 0,
    },

    ['money'] = {
        label = 'Money',
    },

    ['black_money'] = {
        label = 'Dirty Money',
    },

    ['id_card'] = {
        label = 'Identification Card',
    },

    ['driver_license'] = {
        label = 'Drivers License',
    },

    ['weaponlicense'] = {
        label = 'Weapon License',
    },

    ['lawyerpass'] = {
        label = 'Lawyer Pass',
    },

    ['radio'] = {
        label = 'Radio',
        weight = 1000,
        allowArmed = true,
        consume = 0,
        client = {
            event = 'mm_radio:client:use'
        }
    },

    ['jammer'] = {
        label = 'Radio Jammer',
        weight = 10000,
        allowArmed = true,
        client = {
            event = 'mm_radio:client:usejammer'
        }
    },

    ['radiocell'] = {
        label = 'AAA Cells',
        weight = 1000,
        stack = true,
        allowArmed = true,
        client = {
            event = 'mm_radio:client:recharge'
        }
    },

    ['advancedlockpick'] = {
        label = 'Advanced Lockpick',
        weight = 500,
    },

    ['screwdriverset'] = {
        label = 'Screwdriver Set',
        weight = 500,
    },

    ['electronickit'] = {
        label = 'Electronic Kit',
        weight = 500,
    },

    ['cleaningkit'] = {
        label = 'Cleaning Kit',
        weight = 500,
    },

    ['repairkit'] = {
        label = 'Repair Kit',
        weight = 2500,
    },

    ['advancedrepairkit'] = {
        label = 'Advanced Repair Kit',
        weight = 4000,
    },

    ['diamond_ring'] = {
        label = 'Diamond',
        weight = 1500,
    },

    ['rolex'] = {
        label = 'Golden Watch',
        weight = 1500,
    },

    ['goldbar'] = {
        label = 'Gold Bar',
        weight = 1500,
    },

    ['goldchain'] = {
        label = 'Golden Chain',
        weight = 1500,
    },

    ['crack_baggy'] = {
        label = 'Crack Baggy',
        weight = 100,
    },

    ['cokebaggy'] = {
        label = 'Bag of Coke',
        weight = 100,
    },

    ['coke_brick'] = {
        label = 'Coke Brick',
        weight = 2000,
    },

    ['coke_small_brick'] = {
        label = 'Coke Package',
        weight = 1000,
    },

    ['xtcbaggy'] = {
        label = 'Bag of Ecstasy',
        weight = 100,
    },

    ['meth'] = {
        label = 'Methamphetamine',
        weight = 100,
    },

    ['oxy'] = {
        label = 'Oxycodone',
        weight = 100,
    },

    ['weed_ak47'] = {
        label = 'AK47 2g',
        weight = 200,
    },

    ['weed_ak47_seed'] = {
        label = 'AK47 Seed',
        weight = 1,
    },

    ['weed_skunk'] = {
        label = 'Skunk 2g',
        weight = 200,
    },

    ['weed_skunk_seed'] = {
        label = 'Skunk Seed',
        weight = 1,
    },

    ['weed_amnesia'] = {
        label = 'Amnesia 2g',
        weight = 200,
    },

    ['weed_amnesia_seed'] = {
        label = 'Amnesia Seed',
        weight = 1,
    },

    ['weed_og-kush'] = {
        label = 'OGKush 2g',
        weight = 200,
    },

    ['weed_og-kush_seed'] = {
        label = 'OGKush Seed',
        weight = 1,
    },

    ['weed_white-widow'] = {
        label = 'OGKush 2g',
        weight = 200,
    },

    ['weed_white-widow_seed'] = {
        label = 'White Widow Seed',
        weight = 1,
    },

    ['weed_purple-haze'] = {
        label = 'Purple Haze 2g',
        weight = 200,
    },

    ['weed_purple-haze_seed'] = {
        label = 'Purple Haze Seed',
        weight = 1,
    },

    ['weed_brick'] = {
        label = 'Weed Brick',
        weight = 2000,
    },

    ['weed_nutrition'] = {
        label = 'Plant Fertilizer',
        weight = 2000,
    },

    ['joint'] = {
        label = 'Joint',
        weight = 200,
    },

    ['rolling_paper'] = {
        label = 'Rolling Paper',
        weight = 0,
    },

    ['empty_weed_bag'] = {
        label = 'Empty Weed Bag',
        weight = 0,
    },

    ['firstaid'] = {
        label = 'First Aid',
        weight = 2500,
    },

    ['ifaks'] = {
        label = 'Individual First Aid Kit',
        weight = 2500,
    },

    ['painkillers'] = {
        label = 'Painkillers',
        weight = 400,
    },

    ['firework1'] = {
        label = '2Brothers',
        weight = 1000,
    },

    ['firework2'] = {
        label = 'Poppelers',
        weight = 1000,
    },

    ['firework3'] = {
        label = 'WipeOut',
        weight = 1000,
    },

    ['firework4'] = {
        label = 'Weeping Willow',
        weight = 1000,
    },

    ['steel'] = {
        label = 'Steel',
        weight = 100,
    },

    ['rubber'] = {
        label = 'Rubber',
        weight = 100,
    },

    ['metalscrap'] = {
        label = 'Metal Scrap',
        weight = 100,
    },

    ['iron'] = {
        label = 'Iron',
        weight = 100,
    },

    ['copper'] = {
        label = 'Copper',
        weight = 100,
    },

    ['aluminum'] = {
        label = 'Aluminium',
        weight = 100,
    },

    ['plastic'] = {
        label = 'Plastic',
        weight = 100,
    },

    ['glass'] = {
        label = 'Glass',
        weight = 100,
    },

    ['gatecrack'] = {
        label = 'Gatecrack',
        weight = 1000,
    },

    ['cryptostick'] = {
        label = 'Crypto Stick',
        weight = 100,
    },

    ['trojan_usb'] = {
        label = 'Trojan USB',
        weight = 100,
    },

    ['toaster'] = {
        label = 'Toaster',
        weight = 5000,
    },

    ['small_tv'] = {
        label = 'Small TV',
        weight = 100,
    },

    ['security_card_01'] = {
        label = 'Security Card A',
        weight = 100,
    },

    ['security_card_02'] = {
        label = 'Security Card B',
        weight = 100,
    },

    ['drill'] = {
        label = 'Drill',
        weight = 5000,
    },

    ['thermite'] = {
        label = 'Thermite',
        weight = 1000,
    },

    ['diving_gear'] = {
        label = 'Diving Gear',
        weight = 30000,
    },

    ['diving_fill'] = {
        label = 'Diving Tube',
        weight = 3000,
    },

    ['antipatharia_coral'] = {
        label = 'Antipatharia',
        weight = 1000,
    },

    ['dendrogyra_coral'] = {
        label = 'Dendrogyra',
        weight = 1000,
    },

    ['jerry_can'] = {
        label = 'Jerrycan',
        weight = 3000,
    },

    ['nitrous'] = {
        label = 'Nitrous',
        weight = 1000,
    },

    ['wine'] = {
        label = 'Wine',
        weight = 500,
    },

    ['grape'] = {
        label = 'Grape',
        weight = 10,
    },

    ['grapejuice'] = {
        label = 'Grape Juice',
        weight = 200,
    },

    ['coffee'] = {
        label = 'Coffee',
        weight = 200,
    },

    ['vodka'] = {
        label = 'Vodka',
        weight = 500,
    },

    ['whiskey'] = {
        label = 'Whiskey',
        weight = 200,
    },

    ['beer'] = {
        label = 'Beer',
        weight = 200,
    },

    ['sandwich'] = {
        label = 'Sandwich',
        weight = 200,
    },

    ['walking_stick'] = {
        label = 'Walking Stick',
        weight = 1000,
    },

    ['lighter'] = {
        label = 'Lighter',
        weight = 200,
    },

    ['binoculars'] = {
        label = 'Binoculars',
        weight = 800,
    },

    ['stickynote'] = {
        label = 'Sticky Note',
        weight = 0,
    },

    ['empty_evidence_bag'] = {
        label = 'Empty Evidence Bag',
        weight = 200,
    },

    ['filled_evidence_bag'] = {
        label = 'Filled Evidence Bag',
        weight = 200,
    },

    ['harness'] = {
        label = 'Harness',
        weight = 200,
    },

    ['handcuffs'] = {
        label = 'Handcuffs',
        weight = 200,
    },

    -- ==========================================
    -- 1. SMELTING: ORES & MINERALS
    -- ==========================================
    ['iron_ore'] = {
        label = 'Iron Ore',
        weight = 800,
        stack = true,
        close = true,
        description = 'Raw unrefined iron ore extracted from rock veins.'
    },
    ['copper_ore'] = {
        label = 'Copper Ore',
        weight = 750,
        stack = true,
        close = true,
        description = 'Raw reddish copper ore deposit.'
    },
    ['gold_ore'] = {
        label = 'Gold Ore',
        weight = 1200,
        stack = true,
        close = true,
        description = 'Heavy raw chunk of mineral rock rich with gold flakes.'
    },
    ['silver_ore'] = {
        label = 'Silver Ore',
        weight = 900,
        stack = true,
        close = true,
        description = 'Lustrous raw silver ore.'
    },
    ['bauxite_ore'] = {
        label = 'Bauxite Ore',
        weight = 600,
        stack = true,
        close = true,
        description = 'Sedimentary rock with high aluminum content.'
    },

    -- ==========================================
    -- 2. SMELTING: INGOTS & BULLION
    -- ==========================================
    ['iron_ingot'] = {
        label = 'Iron Ingot',
        weight = 1500,
        stack = true,
        close = true,
        description = 'Heavy bar of smelted, refined structural iron.'
    },
    ['copper_ingot'] = {
        label = 'Copper Ingot',
        weight = 1400,
        stack = true,
        close = true,
        description = 'High-conductivity pure copper bar.'
    },
    ['gold_ingot'] = {
        label = '24K Gold Ingot',
        weight = 2000,
        stack = true,
        close = true,
        description = 'Solid 24-karat stamped gold bullion bar.'
    },
    ['silver_ingot'] = {
        label = 'Silver Ingot',
        weight = 1500,
        stack = true,
        close = true,
        description = 'Refined .999 pure silver bullion.'
    },
    ['aluminum_ingot'] = {
        label = 'Aluminum Ingot',
        weight = 700,
        stack = true,
        close = true,
        description = 'Lightweight, refined aluminum bar.'
    },
    ['steel_ingot'] = {
        label = 'Steel Ingot',
        weight = 1600,
        stack = true,
        close = true,
        description = 'High-tensile carbon steel alloy ingot.'
    },
    ['brass_ingot'] = {
        label = 'Brass Ingot',
        weight = 1450,
        stack = true,
        close = true,
        description = 'Refined acoustic and corrosion-resistant brass alloy.'
    },
    ['melted_gold'] = {
        label = 'Unmarked Molten Gold Bar',
        weight = 1800,
        stack = true,
        close = true,
        description = 'Melted-down stolen jewelry formed into an unmarked gold bar.'
    },
    ['slag_waste'] = {
        label = 'Furnace Slag',
        weight = 500,
        stack = true,
        close = true,
        description = 'Vitreous byproduct left over after metal refining.'
    },

    -- ==========================================
    -- 3. SMELTING: FUELS & SCRAP MATERIALS
    -- ==========================================
    ['coal'] = {
        label = 'Lump Coal',
        weight = 400,
        stack = true,
        close = true,
        description = 'Black combustible sedimentary rock, excellent for forge heating.'
    },
    ['charcoal'] = {
        label = 'Hardwood Charcoal',
        weight = 300,
        stack = true,
        close = true,
        description = 'Purified carbon fuel for blast furnaces.'
    },
    ['propane_canister'] = {
        label = 'Propane Canister',
        weight = 1200,
        stack = true,
        close = true,
        description = 'Pressurized propane gas canister for industrial burners.'
    },
    ['scrap_metal'] = {
        label = 'Scrap Metal',
        weight = 350,
        stack = true,
        close = true,
        description = 'Assorted pieces of discarded steel and iron.'
    },
    ['empty_can'] = {
        label = 'Crushed Aluminum Can',
        weight = 50,
        stack = true,
        close = true,
        description = 'Empty soda can ready for recycling into aluminum.'
    },
    ['copper_wire'] = {
        label = 'Stripped Copper Wire',
        weight = 150,
        stack = true,
        close = true,
        description = 'Copper electrical wire stripped of insulation.'
    },
    ['zinc_scrap'] = {
        label = 'Zinc Scrap',
        weight = 250,
        stack = true,
        close = true,
        description = 'Pieces of zinc scrap used in alloying brass.'
    },
    ['rolex'] = {
        label = 'Gold Luxury Watch',
        weight = 300,
        stack = true,
        close = true,
        description = 'Expensive gold watch with diamond bezel.'
    },
    ['gold_chain'] = {
        label = 'Gold Chain',
        weight = 200,
        stack = true,
        close = true,
        description = 'Heavy 18k solid gold rope chain.'
    },
    ['diamond_ring'] = {
        label = 'Diamond Ring',
        weight = 100,
        stack = true,
        close = true,
        description = 'Platinum and gold band set with diamonds.'
    },
    ['loose_diamond'] = {
        label = 'Loose Cut Diamond',
        weight = 20,
        stack = true,
        close = true,
        description = 'Extracted high-clarity loose diamond.'
    },

    -- ==========================================
    -- 4. ICE CREAM TRUCK: REAL ICE CREAM PARLOR
    -- ==========================================
    ['vanilla_cone'] = {
        label = 'Vanilla Soft Serve',
        weight = 200,
        stack = true,
        close = true,
        description = 'Classic vanilla soft serve in a crisp waffle cone.'
    },
    ['chocolate_gelato'] = {
        label = 'Double Chocolate Gelato',
        weight = 250,
        stack = true,
        close = true,
        description = 'Rich dark chocolate gelato giving a brief sprint sugar rush.'
    },
    ['strawberry_sundae'] = {
        label = 'Strawberry Sundae',
        weight = 300,
        stack = true,
        close = true,
        description = 'Layered strawberry sundae with fresh cream and cherry.'
    },
    ['rocket_pop'] = {
        label = 'Rocket Ice Pop',
        weight = 150,
        stack = true,
        close = true,
        description = 'Cherry, lime, and blue raspberry tri-flavored ice pop.'
    },
    ['rainbow_sorbet'] = {
        label = 'Rainbow Sorbet',
        weight = 200,
        stack = true,
        close = true,
        description = 'Zesty citrus sorbet with refreshing stamina restoration.'
    },

    -- ==========================================
    -- 5. ICE CREAM TRUCK: WEED TREATS & SUPPLIES
    -- ==========================================
    ['weed_icecream'] = {
        label = 'Mint Cannabis Cone',
        weight = 200,
        stack = true,
        close = true,
        description = 'Mint ice cream infused with THC extract.'
    },
    ['space_pop'] = {
        label = 'Space Pop Popsicle',
        weight = 150,
        stack = true,
        close = true,
        description = 'Tricolor fruit ice pop loaded with cannabis syrup.'
    },
    ['weed_brownie'] = {
        label = 'Pot Fudge Brownie',
        weight = 250,
        stack = true,
        close = true,
        description = 'Dark chocolate brownie baked with weed butter rosin.'
    },
    ['weed_gummies'] = {
        label = 'THC Gummy Bears',
        weight = 100,
        stack = true,
        close = true,
        description = 'Sour fruit gummies packed with 100mg nano THC.'
    },
    ['weed_baggy'] = {
        label = 'OG Kush Baggie',
        weight = 100,
        stack = true,
        close = true,
        description = 'Standard 1g baggie of high quality dried cannabis.'
    },
    ['weed_joint'] = {
        label = 'Pre-Rolled Joint',
        weight = 50,
        stack = true,
        close = true,
        description = 'King-size pre-rolled joint of premium herb.'
    },

    -- ==========================================
    -- 6. INGREDIENTS & RAW EDIBLE SUPPLIES
    -- ==========================================
    ['raw_weed'] = {
        label = 'Raw Uncured Weed',
        weight = 200,
        stack = true,
        close = true,
        description = 'Freshly harvested sticky raw cannabis colas.'
    },
    ['weed_skunk'] = {
        label = 'Cured Skunk Buds',
        weight = 100,
        stack = true,
        close = true,
        description = 'Cured top-grade aromatic skunk buds.'
    },
    ['butter'] = {
        label = 'Organic Butter',
        weight = 250,
        stack = true,
        close = true,
        description = 'High fat cream butter for cooking and THC extraction.'
    },
    ['sugar'] = {
        label = 'Refined Sugar',
        weight = 500,
        stack = true,
        close = true,
        description = 'Granulated baking sugar.'
    },
    ['milk'] = {
        label = 'Whole Milk',
        weight = 1000,
        stack = true,
        close = true,
        description = 'Fresh jug of whole milk for ice cream churns.'
    },

    -- ==========================================
    -- 7. QBX_FISHING: RODS, BAIT & FISH
    -- ==========================================
    ['fishingrod_basic'] = {
        label = 'Basic Fishing Rod',
        weight = 1000,
        stack = false,
        close = true,
        description = 'A worn-out rod. Might snag something better if you are lucky.',
    },
    ['fishingrod_advanced'] = {
        label = 'Advanced Fishing Rod',
        weight = 1000,
        stack = false,
        close = true,
        description = 'A sturdier rod that reaches deeper waters.',
    },
    ['fishingrod_pro'] = {
        label = 'Pro Fishing Rod',
        weight = 1000,
        stack = false,
        close = true,
        description = 'Professional grade. Reels in serious fish.',
    },
    ['fishingrod_expert'] = {
        label = 'Expert Fishing Rod',
        weight = 1000,
        stack = false,
        close = true,
        description = 'Engineered for trophy catches.',
    },
    ['fishingrod_master'] = {
        label = 'Master Fishing Rod',
        weight = 1000,
        stack = false,
        close = true,
        description = 'The finest rod money cannot buy. Only the deep sea remains.',
    },
    ['fishing_bait'] = {
        label = 'Fishing Bait',
        weight = 10,
        stack = true,
        close = false,
        description = 'Consumed each cast when bait is enabled.',
    },
    ['fish_sardine']  = { label = 'Sardine',       weight = 200, stack = true, close = false },
    ['fish_anchovy']  = { label = 'Anchovy',       weight = 180, stack = true, close = false },
    ['fish_mackerel'] = { label = 'Mackerel',      weight = 350, stack = true, close = false },
    ['fish_trout']    = { label = 'Rainbow Trout', weight = 400, stack = true, close = false },
    ['fish_seabass']  = { label = 'Sea Bass',      weight = 600, stack = true, close = false },
    ['fish_salmon']   = { label = 'Salmon',        weight = 700, stack = true, close = false },
    ['fish_tuna']     = { label = 'Yellowfin Tuna',weight = 1200, stack = true, close = false },
    ['fish_swordfish']= { label = 'Swordfish',     weight = 1800, stack = true, close = false },
    ['fish_marlin']   = { label = 'Blue Marlin',   weight = 2500, stack = true, close = false },
    ['fish_bluefin']  = { label = 'Bluefin Tuna',  weight = 3000, stack = true, close = false },
    ['trash_boot']    = { label = 'Old Boot',      weight = 300, stack = true, close = false },
    ['trash_can']     = { label = 'Rusty Can',     weight = 150, stack = true, close = false },
    ['trash_seaweed'] = { label = 'Seaweed',       weight = 100, stack = true, close = false }
}
