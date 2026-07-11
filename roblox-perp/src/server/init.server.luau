--!strict
-- Server bootstrap: require services in dependency order, then wire them up.

local SkillService    = require(script.Services.SkillService)
local CraftingService = require(script.Services.CraftingService)
local DrugService     = require(script.Services.DrugService)
local PlantService    = require(script.Services.PlantService)

-- Inject cross-service dependencies
CraftingService.Init(SkillService)
DrugService.Init(SkillService, CraftingService)
PlantService.Init(CraftingService, SkillService)

print("[PERP] ✅ Server services loaded: Skill · Crafting · Drug · Plant")
