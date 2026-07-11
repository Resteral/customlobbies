--!strict
-- Client bootstrap: load all controllers in order.

local Controllers = script.Controllers

require(Controllers.DrugController)
require(Controllers.CraftingController)
require(Controllers.SkillController)
require(Controllers.PlantController)

print("[PERP] ✅ Client controllers loaded: Drug · Crafting · Skills · Plant")
