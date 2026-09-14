/**
 * Interactive Window Curtains & Blinds Manager
 * Controls opening and closing states, 3D animations, and FiveM runtime ox_target interaction scripts.
 */

class CurtainManager {
    constructor() {
        this.curtainGroups = [];
    }

    /**
     * Toggles a curtain entity between Open and Closed states
     */
    static toggleCurtainState(entity) {
        if (!entity.isCurtain) return;

        if (entity.curtainState === 'open') {
            entity.curtainState = 'closed';
            if (entity.model.includes('open')) {
                entity.model = entity.model.replace('open', 'closed');
            } else if (entity.model.includes('up')) {
                entity.model = entity.model.replace('up', 'down');
            }
        } else {
            entity.curtainState = 'open';
            if (entity.model.includes('closed')) {
                entity.model = entity.model.replace('closed', 'open');
            } else if (entity.model.includes('down')) {
                entity.model = entity.model.replace('down', 'up');
            }
        }

        return entity.curtainState;
    }

    /**
     * Generates FiveM ox_target / qb-target interactive script for curtains
     */
    static generateCurtainLua(curtainEntities, interiorName) {
        if (!curtainEntities || curtainEntities.length === 0) return '';

        return `-- ==========================================
-- INTERACTIVE WINDOW CURTAINS & BLINDS (ox_target / qb-target / E-Interact)
-- ==========================================

local windowCurtains = {
${curtainEntities.map((c, i) => `    [${i + 1}] = {
        name = "${c.name || 'Window Curtains'}",
        coords = vec3(${c.pos.x.toFixed(2)}, ${c.pos.y.toFixed(2)}, ${c.pos.z.toFixed(2)}),
        isOpen = ${c.curtainState === 'open' ? 'true' : 'false'},
        modelOpen = \`${c.model.includes('closed') ? c.model.replace('closed', 'open') : c.model}\`,
        modelClosed = \`${c.model.includes('open') ? c.model.replace('open', 'closed') : c.model}\`
    }`).join(',\n')}
}

-- Register Target Interaction for each Curtain / Blind
CreateThread(function()
    for id, curtain in pairs(windowCurtains) do
        -- ox_target support
        if exports.ox_target then
            exports.ox_target:addSphereZone({
                coords = curtain.coords,
                radius = 1.2,
                debug = false,
                options = {
                    {
                        name = 'toggle_curtain_' .. id,
                        icon = 'fa-solid fa-person-shelter',
                        label = 'Toggle Curtains / Blinds',
                        onSelect = function()
                            ToggleCurtain(id)
                        end
                    }
                }
            })
        end
    end
end)

function ToggleCurtain(id)
    local c = windowCurtains[id]
    if not c then return end

    c.isOpen = not c.isOpen
    
    -- Play cloth / blind rustle sound
    PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)

    -- Toggle interior entity set or replace object
    if currentInteriorId and currentInteriorId ~= 0 then
        if c.isOpen then
            ActivateInteriorEntitySet(currentInteriorId, "curtains_open")
            DeactivateInteriorEntitySet(currentInteriorId, "curtains_closed")
            print(("[^2MLO^7] Curtains Opened: %s"):format(c.name))
        else
            ActivateInteriorEntitySet(currentInteriorId, "curtains_closed")
            DeactivateInteriorEntitySet(currentInteriorId, "curtains_open")
            print(("[^1MLO^7] Curtains Closed: %s"):format(c.name))
        end
        RefreshInterior(currentInteriorId)
    end
end

-- Slash Command fallback: /togglecurtains
RegisterCommand("togglecurtains", function()
    local ped = PlayerPedId()
    local pCoords = GetEntityCoords(ped)
    for id, c in pairs(windowCurtains) do
        if #(pCoords - c.coords) < 3.0 then
            ToggleCurtain(id)
            return
        end
    end
    print("^3No window curtains nearby to toggle!^7")
end, false)
`;
    }
}

if (typeof module !== 'undefined') {
    module.exports = CurtainManager;
}
