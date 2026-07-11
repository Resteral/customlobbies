--!strict
-- Drug definitions: every craftable/usable drug, its effects, and sell price.

export type DrugEffect = {
	SpeedMultiplier : number,   -- 1.0 = no change, 1.5 = 50% faster
	JumpMultiplier  : number,
	Hallucinate     : boolean,  -- triggers client-side colour correction
	HealthRegen     : number,   -- HP/sec (negative = drain)
	Duration        : number,   -- seconds the effect lasts
}

export type Drug = {
	Id              : string,
	Name            : string,
	Description     : string,
	Tier            : number,          -- 1 = soft, 2 = hard, 3 = extreme
	BaseSellPrice   : number,          -- cash per unit at NPC
	AddictionChance : number,          -- 0–1 probability per use
	Effects         : DrugEffect,
}

local Drugs: {[string]: Drug} = {

	Weed = {
		Id              = "Weed",
		Name            = "Cannabis",
		Description     = "A mild relaxant. Slightly slows movement but regenerates health.",
		Tier            = 1,
		BaseSellPrice   = 80,
		AddictionChance = 0.04,
		Effects = {
			SpeedMultiplier = 0.92,
			JumpMultiplier  = 1.10,
			Hallucinate     = false,
			HealthRegen     = 0.5,
			Duration        = 30,
		},
	},

	Shrooms = {
		Id              = "Shrooms",
		Name            = "Psilocybin Mushrooms",
		Description     = "Causes vivid hallucinations and an elevated mood.",
		Tier            = 1,
		BaseSellPrice   = 130,
		AddictionChance = 0.07,
		Effects = {
			SpeedMultiplier = 1.00,
			JumpMultiplier  = 1.25,
			Hallucinate     = true,
			HealthRegen     = 0,
			Duration        = 45,
		},
	},

	Cocaine = {
		Id              = "Cocaine",
		Name            = "Cocaine",
		Description     = "Strong stimulant. Boosts speed and confidence significantly.",
		Tier            = 2,
		BaseSellPrice   = 310,
		AddictionChance = 0.22,
		Effects = {
			SpeedMultiplier = 1.40,
			JumpMultiplier  = 1.15,
			Hallucinate     = false,
			HealthRegen     = 0,
			Duration        = 40,
		},
	},

	Meth = {
		Id              = "Meth",
		Name            = "Crystal Meth",
		Description     = "Extreme speed and energy. Slowly drains health. Highly addictive.",
		Tier            = 2,
		BaseSellPrice   = 380,
		AddictionChance = 0.35,
		Effects = {
			SpeedMultiplier = 1.65,
			JumpMultiplier  = 1.30,
			Hallucinate     = false,
			HealthRegen     = -1.0,
			Duration        = 60,
		},
	},

	Heroin = {
		Id              = "Heroin",
		Name            = "Heroin",
		Description     = "Extreme euphoria. Severely impairs movement and drains health fast.",
		Tier            = 3,
		BaseSellPrice   = 650,
		AddictionChance = 0.55,
		Effects = {
			SpeedMultiplier = 0.80,
			JumpMultiplier  = 0.85,
			Hallucinate     = true,
			HealthRegen     = -2.0,
			Duration        = 120,
		},
	},
}

return Drugs
