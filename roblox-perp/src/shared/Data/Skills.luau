--!strict
-- Skill tree: all skills, per-level bonuses, and max levels.

export type SkillBonus = {
	CraftTimeReduction : number?,  -- fraction faster per level (e.g. 0.015 = 1.5%)
	DrugYieldBonus     : number?,  -- extra-output probability per level
	DrugQualityBonus   : number?,  -- sell-price multiplier bonus per level
	SpeedBonus         : number?,  -- flat WalkSpeed added per level
	JumpBonus          : number?,  -- flat JumpPower added per level
	DetectionReduction : number?,  -- police-detection reduction per level
	DamageBonus        : number?,  -- melee damage per level
}

export type Skill = {
	Id           : string,
	Name         : string,
	Description  : string,
	Icon         : string,
	MaxLevel     : number,
	BonusPerLevel: SkillBonus,
}

local Skills: {[string]: Skill} = {

	Chemistry = {
		Id          = "Chemistry",
		Name        = "Chemistry",
		Description = "Drug synthesis mastery. Reduces craft time and increases drug yield & quality.",
		Icon        = "⚗️",
		MaxLevel    = 50,
		BonusPerLevel = {
			CraftTimeReduction = 0.015,  -- up to 73.5% faster at lvl 50
			DrugYieldBonus     = 0.010,  -- up to +49% chance of bonus output
			DrugQualityBonus   = 0.008,  -- up to +39.2% sell price at lvl 50
		},
	},

	Crafting = {
		Id          = "Crafting",
		Name        = "Crafting",
		Description = "General fabrication. Faster tool and consumable crafting.",
		Icon        = "🔧",
		MaxLevel    = 50,
		BonusPerLevel = {
			CraftTimeReduction = 0.020,  -- up to 98% faster at lvl 50 (capped at 90%)
		},
	},

	Agility = {
		Id          = "Agility",
		Name        = "Agility",
		Description = "Train your body to move faster and leap further.",
		Icon        = "⚡",
		MaxLevel    = 50,
		BonusPerLevel = {
			SpeedBonus = 0.30,   -- +15 WalkSpeed at max
			JumpBonus  = 0.20,   -- +10 JumpPower at max
		},
	},

	Stealth = {
		Id          = "Stealth",
		Name        = "Stealth",
		Description = "Reduces police detection while selling or crafting.",
		Icon        = "🕶️",
		MaxLevel    = 50,
		BonusPerLevel = {
			DetectionReduction = 0.012,  -- up to 58.8% less detectable
		},
	},

	Strength = {
		Id          = "Strength",
		Name        = "Strength",
		Description = "Hit harder in melee and carry heavier loads.",
		Icon        = "💪",
		MaxLevel    = 50,
		BonusPerLevel = {
			DamageBonus = 0.50,  -- +25 damage at max
		},
	},
}

return Skills
