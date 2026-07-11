--!strict
-- Crafting recipes: ingredients → output, craft time, skill gates, XP rewards.

export type Ingredient = {
	ItemId : string,
	Amount : number,
}

export type Recipe = {
	Id                 : string,
	Name               : string,
	Category           : "Drug" | "Tool" | "Consumable",
	Ingredients        : {Ingredient},
	OutputItemId       : string,
	OutputAmount       : number,
	BaseCraftTime      : number,           -- seconds (Chemistry/Crafting skill reduces this)
	RequiredSkill      : string?,
	RequiredSkillLevel : number?,
	XpReward           : {[string]: number}, -- skillId → XP on success
}

local Recipes: {[string]: Recipe} = {

	-- ─────────────────────────────────────────────────────────────────────────
	-- TIER 1 DRUGS
	-- ─────────────────────────────────────────────────────────────────────────
	CraftWeed = {
		Id                 = "CraftWeed",
		Name               = "Dry Cannabis",
		Category           = "Drug",
		Ingredients        = {
			{ ItemId = "WeedSeeds",  Amount = 3 },
			{ ItemId = "Fertilizer", Amount = 1 },
		},
		OutputItemId       = "Weed",
		OutputAmount       = 2,
		BaseCraftTime      = 15,
		RequiredSkill      = "Chemistry",
		RequiredSkillLevel = 1,
		XpReward           = { Chemistry = 20 },
	},

	CraftShrooms = {
		Id                 = "CraftShrooms",
		Name               = "Grow Mushrooms",
		Category           = "Drug",
		Ingredients        = {
			{ ItemId = "MushroomSpores", Amount = 2 },
			{ ItemId = "CompostBag",     Amount = 1 },
		},
		OutputItemId       = "Shrooms",
		OutputAmount       = 3,
		BaseCraftTime      = 20,
		RequiredSkill      = "Chemistry",
		RequiredSkillLevel = 2,
		XpReward           = { Chemistry = 30 },
	},

	-- ─────────────────────────────────────────────────────────────────────────
	-- TIER 2 DRUGS
	-- ─────────────────────────────────────────────────────────────────────────
	CraftCocaine = {
		Id                 = "CraftCocaine",
		Name               = "Process Cocaine",
		Category           = "Drug",
		Ingredients        = {
			{ ItemId = "CocoaLeaves",  Amount = 5 },
			{ ItemId = "ChemicalBase", Amount = 2 },
		},
		OutputItemId       = "Cocaine",
		OutputAmount       = 1,
		BaseCraftTime      = 35,
		RequiredSkill      = "Chemistry",
		RequiredSkillLevel = 8,
		XpReward           = { Chemistry = 65 },
	},

	CraftMeth = {
		Id                 = "CraftMeth",
		Name               = "Cook Crystal Meth",
		Category           = "Drug",
		Ingredients        = {
			{ ItemId = "Pseudoephedrine", Amount = 4 },
			{ ItemId = "AcidVial",        Amount = 2 },
			{ ItemId = "Lithium",         Amount = 1 },
		},
		OutputItemId       = "Meth",
		OutputAmount       = 1,
		BaseCraftTime      = 45,
		RequiredSkill      = "Chemistry",
		RequiredSkillLevel = 10,
		XpReward           = { Chemistry = 80 },
	},

	-- ─────────────────────────────────────────────────────────────────────────
	-- TIER 3 DRUGS
	-- ─────────────────────────────────────────────────────────────────────────
	CraftHeroin = {
		Id                 = "CraftHeroin",
		Name               = "Refine Heroin",
		Category           = "Drug",
		Ingredients        = {
			{ ItemId = "Opium",      Amount = 6 },
			{ ItemId = "AceticAcid", Amount = 3 },
			{ ItemId = "Morphine",   Amount = 2 },
		},
		OutputItemId       = "Heroin",
		OutputAmount       = 1,
		BaseCraftTime      = 60,
		RequiredSkill      = "Chemistry",
		RequiredSkillLevel = 20,
		XpReward           = { Chemistry = 150 },
	},

	-- ─────────────────────────────────────────────────────────────────────────
	-- TOOLS
	-- ─────────────────────────────────────────────────────────────────────────
	CraftLockpick = {
		Id                 = "CraftLockpick",
		Name               = "Craft Lockpick",
		Category           = "Tool",
		Ingredients        = {
			{ ItemId = "MetalScrap", Amount = 2 },
		},
		OutputItemId       = "Lockpick",
		OutputAmount       = 1,
		BaseCraftTime      = 8,
		RequiredSkill      = "Crafting",
		RequiredSkillLevel = 1,
		XpReward           = { Crafting = 15 },
	},

	CraftMedkit = {
		Id                 = "CraftMedkit",
		Name               = "Assemble Medkit",
		Category           = "Consumable",
		Ingredients        = {
			{ ItemId = "Bandage",    Amount = 3 },
			{ ItemId = "Antiseptic", Amount = 1 },
		},
		OutputItemId       = "Medkit",
		OutputAmount       = 1,
		BaseCraftTime      = 5,
		RequiredSkill      = "Crafting",
		RequiredSkillLevel = 1,
		XpReward           = { Crafting = 10 },
	},

	CraftKnife = {
		Id                 = "CraftKnife",
		Name               = "Craft Combat Knife",
		Category           = "Tool",
		Ingredients        = {
			{ ItemId = "MetalScrap", Amount = 4 },
			{ ItemId = "Tape",       Amount = 1 },
		},
		OutputItemId       = "Knife",
		OutputAmount       = 1,
		BaseCraftTime      = 12,
		RequiredSkill      = "Crafting",
		RequiredSkillLevel = 5,
		XpReward           = { Crafting = 25, Strength = 10 },
	},
}

return Recipes
