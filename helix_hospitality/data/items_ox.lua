-- ============================================================================
-- OX_INVENTORY ITEM DEFINITIONS
-- Copy and paste these into your ox_inventory/data/items.lua
-- ============================================================================

return {
    ['breathalyzer'] = {
        label = 'Digital Breathalyzer',
        weight = 300,
        stack = false,
        close = true,
        description = 'Law enforcement digital tool used to test blood alcohol content (BAC) of suspects.'
    },

    ['crafted_cocktail'] = {
        label = 'Handcrafted Cocktail',
        weight = 350,
        stack = false,
        close = true,
        description = 'An artisan hand-mixed cocktail with unique star rating, flavors, and perks.'
    },

    -- REAL BRANDED SPIRITS
    ['grey_goose_vodka'] = { label = 'Grey Goose Vodka (750ml)', weight = 1200, stack = true, close = true, description = 'Premium French vodka distilled from wheat.' },
    ['belvedere_vodka'] = { label = 'Belvedere Pure Vodka (750ml)', weight = 1200, stack = true, close = true, description = 'Four-times distilled Polish rye vodka.' },
    ['titos_vodka'] = { label = "Tito's Handmade Vodka (750ml)", weight = 1200, stack = true, close = true, description = 'Craft distilled corn vodka from Austin, Texas.' },
    ['absolut_vodka'] = { label = 'Absolut Swedish Vodka (750ml)', weight = 1200, stack = true, close = true, description = 'Classic Swedish winter wheat vodka.' },
    
    ['patron_silver'] = { label = 'Patrón Silver Tequila (750ml)', weight = 1200, stack = true, close = true, description = 'Ultra-premium 100% Weber Blue Agave tequila.' },
    ['casamigos_blanco'] = { label = 'Casamigos Blanco Tequila (750ml)', weight = 1200, stack = true, close = true, description = 'Crisp, clean tequila with hints of citrus and vanilla.' },
    ['don_julio_blanco'] = { label = 'Don Julio Blanco (750ml)', weight = 1200, stack = true, close = true, description = 'Handcrafted Highlands crisp agave tequila.' },
    ['del_maguey_mezcal'] = { label = 'Del Maguey Vida Mezcal (750ml)', weight = 1200, stack = true, close = true, description = 'Artisanal organic smoky Oaxaca mezcal.' },

    ['hennessy_vs'] = { label = 'Hennessy V.S Cognac (750ml)', weight = 1200, stack = true, close = true, description = 'World famous aged French cognac with oak notes.' },
    ['jameson_whiskey'] = { label = 'Jameson Irish Whiskey (750ml)', weight = 1200, stack = true, close = true, description = 'Triple distilled smooth Irish blend.' },
    ['jack_daniels'] = { label = "Jack Daniel's Old No. 7 (750ml)", weight = 1200, stack = true, close = true, description = 'Charcoal mellowed Tennessee sour mash whiskey.' },
    ['macallan_12'] = { label = 'The Macallan 12 Double Cask', weight = 1200, stack = true, close = true, description = 'Iconic single malt Scotch aged in sherry oak casks.' },
    ['bulleit_bourbon'] = { label = 'Bulleit Frontier Bourbon (750ml)', weight = 1200, stack = true, close = true, description = 'High rye content bold Kentucky bourbon.' },
    ['crown_royal'] = { label = 'Crown Royal Canadian Whisky', weight = 1200, stack = true, close = true, description = 'Smooth blended Canadian whisky.' },
    ['fireball_whiskey'] = { label = 'Fireball Cinnamon Whisky (750ml)', weight = 1200, stack = true, close = true, description = 'Spicy cinnamon flavored whisky.' },

    ['bombay_sapphire'] = { label = 'Bombay Sapphire Gin (750ml)', weight = 1200, stack = true, close = true, description = 'Vapour-infused 10 exotic botanicals gin.' },
    ['hendricks_gin'] = { label = "Hendrick's Botanical Gin (750ml)", weight = 1200, stack = true, close = true, description = 'Infused with cucumber and rose petals.' },
    ['tanqueray_gin'] = { label = 'Tanqueray London Dry Gin (750ml)', weight = 1200, stack = true, close = true, description = 'Crisp classic juniper-forward London dry gin.' },

    ['bacardi_superior'] = { label = 'Bacardi Superior White Rum (750ml)', weight = 1200, stack = true, close = true, description = 'Smooth white rum for mixing tropical drinks.' },
    ['captain_morgan'] = { label = 'Captain Morgan Spiced Rum (750ml)', weight = 1200, stack = true, close = true, description = 'Caribbean rum spiced with vanilla and aromatics.' },
    ['malibu_rum'] = { label = 'Malibu Caribbean Coconut Rum', weight = 1200, stack = true, close = true, description = 'Smooth coconut flavored rum.' },
    ['havana_club_7'] = { label = 'Havana Club 7 Year Dark Rum', weight = 1200, stack = true, close = true, description = 'Aged Cuban dark sipping rum.' },

    -- LIQUEURS & SCHNAPPS
    ['jagermeister'] = { label = 'Jägermeister Herbal Liqueur', weight = 1200, stack = true, close = true, description = '56-herb German botanical liqueur.' },
    ['baileys_irish_cream'] = { label = 'Baileys Original Irish Cream', weight = 1200, stack = true, close = true, description = 'Irish dairy cream and aged whiskey blend.' },
    ['kahlua_coffee'] = { label = 'Kahlúa Coffee Liqueur (750ml)', weight = 1200, stack = true, close = true, description = 'Rich Arabica coffee bean liqueur.' },
    ['cointreau_orange'] = { label = 'Cointreau Triple Sec Liqueur', weight = 1200, stack = true, close = true, description = 'Crystal clear sweet and bitter orange peel liqueur.' },
    ['aperol_aperitivo'] = { label = 'Aperol Italian Aperitivo (750ml)', weight = 1200, stack = true, close = true, description = 'Zesty orange and gentian herb Italian aperitif.' },
    ['campari_bitter'] = { label = 'Campari Red Bitter (750ml)', weight = 1200, stack = true, close = true, description = 'Vibrant red bitter botanical infusion.' },
    ['peppermint_schnapps'] = { label = 'Rumple Minze Peppermint Schnapps', weight = 1200, stack = true, close = true, description = '100-proof crisp peppermint schnapps.' },
    ['blue_curacao'] = { label = 'DeKuyper Blue Curaçao (750ml)', weight = 1200, stack = true, close = true, description = 'Vibrant blue citrus liqueur.' },
    ['midori_melon'] = { label = 'Midori Melon Liqueur (750ml)', weight = 1200, stack = true, close = true, description = 'Bright emerald Japanese melon liqueur.' },
    ['angostura_bitters'] = { label = 'Angostura Aromatic Bitters (200ml)', weight = 300, stack = true, close = true, description = 'Concentrated botanical cocktail bitters.' },

    -- GARNISHES & RIMS
    ['cocktail_olives'] = { label = 'Castelvetrano Olives Jar', weight = 400, stack = true, description = 'Buttery Italian cocktail olives with pimentos.' },
    ['margarita_salt'] = { label = 'Flaked Sea Salt Rim Box', weight = 300, stack = true, description = 'Coarse sea salt for rimming margarita glasses.' },
    ['cane_sugar_rim'] = { label = 'Raw Cane Sugar Rim Box', weight = 300, stack = true, description = 'Raw Demerara sugar for cocktail rims.' },
    ['crushed_peppermint'] = { label = 'Crushed Peppermint Candy Shaker', weight = 250, stack = true, description = 'Festive crushed peppermint for rimming holiday cocktails.' },
    ['fresh_mint_sprig'] = { label = 'Fresh Spearmint Pack', weight = 100, stack = true, description = 'Aromatic mint leaves for mojitos and juleps.' },
    ['maraschino_cherries'] = { label = 'Luxardo Maraschino Cherries', weight = 400, stack = true, description = 'Gourmet dark candied cherries in marasca syrup.' },
    ['lime_wedges'] = { label = 'Fresh Cut Lime Wedges', weight = 200, stack = true, description = 'Fresh tart lime slices.' },
    ['orange_slices'] = { label = 'Dehydrated Orange Wheels', weight = 150, stack = true, description = 'Dehydrated citrus wheels for cocktail aromatics.' },
    ['cinnamon_sticks'] = { label = 'Ceylon Cinnamon Sticks Jar', weight = 150, stack = true, description = 'Fragrant cinnamon sticks.' },
    ['whipped_cream'] = { label = 'Sweet Vanilla Whipped Cream', weight = 300, stack = true, description = 'Cream canister for dessert cocktails.' },
    ['chocolate_syrup'] = { label = 'Dark Chocolate Drizzle', weight = 400, stack = true, description = 'Artisan chocolate syrup.' },
    ['tabasco_hot_sauce'] = { label = 'Tabasco Pepper Sauce', weight = 200, stack = true, description = 'Spicy aged red pepper sauce.' },
    ['cocktail_umbrellas'] = { label = 'Tropical Paper Umbrellas (100pk)', weight = 80, stack = true, description = 'Festive paper umbrellas.' },

    -- MIXERS & SOOTHERS
    ['fevertree_tonic'] = { label = 'Fever-Tree Tonic Water', weight = 300, stack = true, description = 'Botanical tonic water.' },
    ['fevertree_gingerbeer'] = { label = 'Fever-Tree Ginger Beer', weight = 300, stack = true, description = 'Fiery brewed ginger beer.' },
    ['red_bull_energy'] = { label = 'Red Bull Energy Drink', weight = 250, stack = true, description = 'Vitalizes body and mind.' },
    ['sparkling_prosecco'] = { label = 'La Marca Prosecco (750ml)', weight = 1200, stack = true, description = 'Crisp Italian sparkling wine.' },
    ['water_bottle'] = { label = 'Purified Water Bottle', weight = 500, stack = true, close = true, description = 'Restores hydration and lowers BAC.' },
    ['hot_coffee'] = { label = 'Hot Espresso Coffee', weight = 300, stack = true, close = true, description = 'Clears the mind and sober up faster.' },
    ['hangover_pill'] = { label = 'Hangover Relief Pill', weight = 50, stack = true, close = true, description = 'Fast-acting BAC reducing pharmaceutical tablet.' }
}
