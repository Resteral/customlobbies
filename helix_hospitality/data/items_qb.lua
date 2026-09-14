-- ============================================================================
-- QB-CORE / QBOX / PS-INVENTORY ITEM DEFINITIONS
-- Copy and paste these into your qb-core/shared/items.lua
-- ============================================================================

QBItems = {
    ['breathalyzer'] = { name = 'breathalyzer', label = 'Digital Breathalyzer', weight = 300, type = 'item', image = 'breathalyzer.png', unique = false, useable = true, shouldClose = true, description = 'Law enforcement digital tool used to test blood alcohol content.' },
    ['crafted_cocktail'] = { name = 'crafted_cocktail', label = 'Handcrafted Cocktail', weight = 350, type = 'item', image = 'crafted_cocktail.png', unique = true, useable = true, shouldClose = true, description = 'An artisan hand-mixed cocktail with unique star rating, flavors, and perks.' },

    -- REAL BRANDED SPIRITS
    ['grey_goose_vodka'] = { name = 'grey_goose_vodka', label = 'Grey Goose Vodka', weight = 1200, type = 'item', image = 'grey_goose.png', unique = false, useable = true, shouldClose = true, description = 'Premium French vodka distilled from wheat.' },
    ['belvedere_vodka'] = { name = 'belvedere_vodka', label = 'Belvedere Pure Vodka', weight = 1200, type = 'item', image = 'belvedere.png', unique = false, useable = true, shouldClose = true, description = 'Four-times distilled Polish rye vodka.' },
    ['titos_vodka'] = { name = 'titos_vodka', label = "Tito's Handmade Vodka", weight = 1200, type = 'item', image = 'titos.png', unique = false, useable = true, shouldClose = true, description = 'Craft distilled corn vodka from Austin, Texas.' },
    ['absolut_vodka'] = { name = 'absolut_vodka', label = 'Absolut Swedish Vodka', weight = 1200, type = 'item', image = 'absolut.png', unique = false, useable = true, shouldClose = true, description = 'Classic Swedish winter wheat vodka.' },
    ['patron_silver'] = { name = 'patron_silver', label = 'Patrón Silver Tequila', weight = 1200, type = 'item', image = 'patron_silver.png', unique = false, useable = true, shouldClose = true, description = 'Ultra-premium 100% Weber Blue Agave tequila.' },
    ['casamigos_blanco'] = { name = 'casamigos_blanco', label = 'Casamigos Blanco Tequila', weight = 1200, type = 'item', image = 'casamigos.png', unique = false, useable = true, shouldClose = true, description = 'Crisp, clean tequila with hints of citrus and vanilla.' },
    ['don_julio_blanco'] = { name = 'don_julio_blanco', label = 'Don Julio Blanco', weight = 1200, type = 'item', image = 'don_julio.png', unique = false, useable = true, shouldClose = true, description = 'Handcrafted Highlands crisp agave tequila.' },
    ['del_maguey_mezcal'] = { name = 'del_maguey_mezcal', label = 'Del Maguey Vida Mezcal', weight = 1200, type = 'item', image = 'mezcal.png', unique = false, useable = true, shouldClose = true, description = 'Artisanal organic smoky Oaxaca mezcal.' },
    ['hennessy_vs'] = { name = 'hennessy_vs', label = 'Hennessy V.S Cognac', weight = 1200, type = 'item', image = 'hennessy.png', unique = false, useable = true, shouldClose = true, description = 'World famous aged French cognac with oak notes.' },
    ['jameson_whiskey'] = { name = 'jameson_whiskey', label = 'Jameson Irish Whiskey', weight = 1200, type = 'item', image = 'jameson.png', unique = false, useable = true, shouldClose = true, description = 'Triple distilled smooth Irish blend.' },
    ['jack_daniels'] = { name = 'jack_daniels', label = "Jack Daniel's Old No. 7", weight = 1200, type = 'item', image = 'jack_daniels.png', unique = false, useable = true, shouldClose = true, description = 'Charcoal mellowed Tennessee sour mash whiskey.' },
    ['macallan_12'] = { name = 'macallan_12', label = 'The Macallan 12 Double Cask', weight = 1200, type = 'item', image = 'macallan.png', unique = false, useable = true, shouldClose = true, description = 'Iconic single malt Scotch aged in sherry oak casks.' },
    ['bulleit_bourbon'] = { name = 'bulleit_bourbon', label = 'Bulleit Frontier Bourbon', weight = 1200, type = 'item', image = 'bulleit.png', unique = false, useable = true, shouldClose = true, description = 'High rye content bold Kentucky bourbon.' },
    ['crown_royal'] = { name = 'crown_royal', label = 'Crown Royal Canadian Whisky', weight = 1200, type = 'item', image = 'crown_royal.png', unique = false, useable = true, shouldClose = true, description = 'Smooth blended Canadian whisky.' },
    ['fireball_whiskey'] = { name = 'fireball_whiskey', label = 'Fireball Cinnamon Whisky', weight = 1200, type = 'item', image = 'fireball.png', unique = false, useable = true, shouldClose = true, description = 'Spicy cinnamon flavored whisky.' },
    ['bombay_sapphire'] = { name = 'bombay_sapphire', label = 'Bombay Sapphire Gin', weight = 1200, type = 'item', image = 'bombay.png', unique = false, useable = true, shouldClose = true, description = 'Vapour-infused 10 exotic botanicals gin.' },
    ['hendricks_gin'] = { name = 'hendricks_gin', label = "Hendrick's Botanical Gin", weight = 1200, type = 'item', image = 'hendricks.png', unique = false, useable = true, shouldClose = true, description = 'Infused with cucumber and rose petals.' },
    ['tanqueray_gin'] = { name = 'tanqueray_gin', label = 'Tanqueray London Dry Gin', weight = 1200, type = 'item', image = 'tanqueray.png', unique = false, useable = true, shouldClose = true, description = 'Crisp classic juniper-forward London dry gin.' },
    ['bacardi_superior'] = { name = 'bacardi_superior', label = 'Bacardi Superior White Rum', weight = 1200, type = 'item', image = 'bacardi.png', unique = false, useable = true, shouldClose = true, description = 'Smooth white rum for mixing tropical drinks.' },
    ['captain_morgan'] = { name = 'captain_morgan', label = 'Captain Morgan Spiced Rum', weight = 1200, type = 'item', image = 'captain_morgan.png', unique = false, useable = true, shouldClose = true, description = 'Caribbean rum spiced with vanilla and aromatics.' },
    ['malibu_rum'] = { name = 'malibu_rum', label = 'Malibu Coconut Rum', weight = 1200, type = 'item', image = 'malibu.png', unique = false, useable = true, shouldClose = true, description = 'Smooth coconut flavored rum.' },
    ['havana_club_7'] = { name = 'havana_club_7', label = 'Havana Club 7 Year Dark Rum', weight = 1200, type = 'item', image = 'havana_club.png', unique = false, useable = true, shouldClose = true, description = 'Aged Cuban dark sipping rum.' },

    -- LIQUEURS & SCHNAPPS
    ['jagermeister'] = { name = 'jagermeister', label = 'Jägermeister Herbal Liqueur', weight = 1200, type = 'item', image = 'jagermeister.png', unique = false, useable = true, shouldClose = true, description = '56-herb German botanical liqueur.' },
    ['baileys_irish_cream'] = { name = 'baileys_irish_cream', label = 'Baileys Original Irish Cream', weight = 1200, type = 'item', image = 'baileys.png', unique = false, useable = true, shouldClose = true, description = 'Irish dairy cream and aged whiskey blend.' },
    ['kahlua_coffee'] = { name = 'kahlua_coffee', label = 'Kahlúa Coffee Liqueur', weight = 1200, type = 'item', image = 'kahlua.png', unique = false, useable = true, shouldClose = true, description = 'Rich Arabica coffee bean liqueur.' },
    ['cointreau_orange'] = { name = 'cointreau_orange', label = 'Cointreau Triple Sec', weight = 1200, type = 'item', image = 'cointreau.png', unique = false, useable = true, shouldClose = true, description = 'Crystal clear orange peel liqueur.' },
    ['aperol_aperitivo'] = { name = 'aperol_aperitivo', label = 'Aperol Aperitivo', weight = 1200, type = 'item', image = 'aperol.png', unique = false, useable = true, shouldClose = true, description = 'Zesty orange Italian aperitif.' },
    ['campari_bitter'] = { name = 'campari_bitter', label = 'Campari Red Bitter', weight = 1200, type = 'item', image = 'campari.png', unique = false, useable = true, shouldClose = true, description = 'Vibrant red bitter botanical infusion.' },
    ['peppermint_schnapps'] = { name = 'peppermint_schnapps', label = 'Rumple Minze Peppermint', weight = 1200, type = 'item', image = 'peppermint_schnapps.png', unique = false, useable = true, shouldClose = true, description = '100-proof crisp peppermint schnapps.' },
    ['blue_curacao'] = { name = 'blue_curacao', label = 'DeKuyper Blue Curaçao', weight = 1200, type = 'item', image = 'blue_curacao.png', unique = false, useable = true, shouldClose = true, description = 'Vibrant blue citrus liqueur.' },
    ['midori_melon'] = { name = 'midori_melon', label = 'Midori Melon Liqueur', weight = 1200, type = 'item', image = 'midori.png', unique = false, useable = true, shouldClose = true, description = 'Bright emerald Japanese melon liqueur.' },
    ['angostura_bitters'] = { name = 'angostura_bitters', label = 'Angostura Bitters', weight = 300, type = 'item', image = 'bitters.png', unique = false, useable = true, shouldClose = true, description = 'Concentrated botanical cocktail bitters.' },

    -- GARNISHES & RIMS
    ['cocktail_olives'] = { name = 'cocktail_olives', label = 'Castelvetrano Olives Jar', weight = 400, type = 'item', image = 'olives.png', unique = false, useable = false, shouldClose = false, description = 'Italian cocktail olives with pimentos.' },
    ['margarita_salt'] = { name = 'margarita_salt', label = 'Flaked Sea Salt Rim Box', weight = 300, type = 'item', image = 'salt_rim.png', unique = false, useable = false, shouldClose = false, description = 'Coarse sea salt for margarita rims.' },
    ['cane_sugar_rim'] = { name = 'cane_sugar_rim', label = 'Raw Cane Sugar Rim Box', weight = 300, type = 'item', image = 'sugar_rim.png', unique = false, useable = false, shouldClose = false, description = 'Raw cane sugar for cocktail rims.' },
    ['crushed_peppermint'] = { name = 'crushed_peppermint', label = 'Crushed Peppermint Shaker', weight = 250, type = 'item', image = 'peppermint_shaker.png', unique = false, useable = false, shouldClose = false, description = 'Festive crushed peppermint for rims.' },
    ['fresh_mint_sprig'] = { name = 'fresh_mint_sprig', label = 'Fresh Spearmint Pack', weight = 100, type = 'item', image = 'mint.png', unique = false, useable = false, shouldClose = false, description = 'Aromatic mint leaves for cocktails.' },
    ['maraschino_cherries'] = { name = 'maraschino_cherries', label = 'Luxardo Cherries', weight = 400, type = 'item', image = 'cherries.png', unique = false, useable = false, shouldClose = false, description = 'Gourmet dark candied cherries.' },
    ['lime_wedges'] = { name = 'lime_wedges', label = 'Fresh Lime Wedges', weight = 200, type = 'item', image = 'lime.png', unique = false, useable = false, shouldClose = false, description = 'Fresh tart lime slices.' },
    ['orange_slices'] = { name = 'orange_slices', label = 'Dehydrated Orange Wheels', weight = 150, type = 'item', image = 'orange.png', unique = false, useable = false, shouldClose = false, description = 'Dehydrated citrus wheels.' },
    ['cinnamon_sticks'] = { name = 'cinnamon_sticks', label = 'Ceylon Cinnamon Sticks', weight = 150, type = 'item', image = 'cinnamon.png', unique = false, useable = false, shouldClose = false, description = 'Fragrant cinnamon sticks.' },
    ['whipped_cream'] = { name = 'whipped_cream', label = 'Vanilla Whipped Cream', weight = 300, type = 'item', image = 'whipped_cream.png', unique = false, useable = false, shouldClose = false, description = 'Cream canister for dessert cocktails.' },
    ['chocolate_syrup'] = { name = 'chocolate_syrup', label = 'Dark Chocolate Drizzle', weight = 400, type = 'item', image = 'chocolate.png', unique = false, useable = false, shouldClose = false, description = 'Artisan chocolate syrup.' },
    ['tabasco_hot_sauce'] = { name = 'tabasco_hot_sauce', label = 'Tabasco Pepper Sauce', weight = 200, type = 'item', image = 'tabasco.png', unique = false, useable = false, shouldClose = false, description = 'Spicy aged red pepper sauce.' },
    ['cocktail_umbrellas'] = { name = 'cocktail_umbrellas', label = 'Tropical Umbrellas', weight = 80, type = 'item', image = 'umbrellas.png', unique = false, useable = false, shouldClose = false, description = 'Festive paper umbrellas.' },

    -- SOBER ITEMS
    ['water_bottle'] = { name = 'water_bottle', label = 'Purified Water Bottle', weight = 500, type = 'item', image = 'water.png', unique = false, useable = true, shouldClose = true, description = 'Restores hydration and lowers BAC.' },
    ['hot_coffee'] = { name = 'hot_coffee', label = 'Hot Espresso Coffee', weight = 300, type = 'item', image = 'coffee.png', unique = false, useable = true, shouldClose = true, description = 'Clears the mind and sobers up faster.' },
    ['hangover_pill'] = { name = 'hangover_pill', label = 'Hangover Relief Pill', weight = 50, type = 'item', image = 'pill.png', unique = false, useable = true, shouldClose = true, description = 'Fast-acting BAC reducing tablet.' }
}
