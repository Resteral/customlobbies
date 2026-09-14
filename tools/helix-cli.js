#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to parse CLI arguments
function parseArgs() {
    const raw = process.argv.slice(2);
    if (raw.length === 0) return { command: 'help', params: [], flags: {} };

    const command = raw[0];
    const params = [];
    const flags = {};

    for (let i = 1; i < raw.length; i++) {
        const arg = raw[i];
        if (arg.startsWith('--')) {
            const [k, v] = arg.slice(2).split('=');
            flags[k] = v === undefined ? true : v;
        } else {
            params.push(arg);
        }
    }

    return { command, params, flags };
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Generators
const Generators = {
    item(params, flags) {
        const id = params[0] || flags.id || 'new_item';
        const name = flags.name || params[1] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const type = flags.type || 'consumable';
        const model = flags.model || (type === 'weapon' ? 'models/weapons/w_pist_glock18.mdl' : 'models/props_junk/garbage_plasticbottle003a.mdl');
        const width = parseInt(flags.w || flags.width || (type === 'weapon' ? 2 : 1), 10);
        const height = parseInt(flags.h || flags.height || 1, 10);
        const category = flags.cat || flags.category || (type === 'weapon' ? 'Weapons' : type === 'crafting' ? 'Crafting Materials' : 'Consumables');
        const price = parseInt(flags.price || 50, 10);
        const heal = parseInt(flags.heal || 25, 10);
        const weaponClass = flags.class || flags.weapon || 'weapon_pistol';

        let functionsCode = '';
        if (type === 'consumable') {
            functionsCode = `
ITEM.functions.Consume = {
    name = "Consume",
    tip = "useTip",
    icon = "icon16/cup.png",
    OnRun = function(item)
        local client = item.player
        local char = client:GetCharacter()
        if not char then return false end

        client:SetHealth(math.min(client:GetMaxHealth(), client:Health() + ${heal}))
        client:EmitSound("npc/barnacle/barnacle_gulp1.wav")
        client:Notify("You consumed " .. item.name .. " (+${heal} HP).")
        return true
    end
}`;
        } else if (type === 'weapon') {
            functionsCode = `
ITEM.isWeapon = true
ITEM.class = "${weaponClass}"

ITEM.functions.Equip = {
    name = "Equip",
    tip = "equipTip",
    icon = "icon16/tick.png",
    OnRun = function(item)
        local client = item.player
        if client:HasWeapon(item.class) then
            client:Notify("You already have this equipped!")
            return false
        end
        client:Give(item.class)
        client:SelectWeapon(item.class)
        return true
    end
}`;
        } else if (type === 'crafting') {
            functionsCode = `
-- Material used for crafting workbenches
ITEM.isCraftingMaterial = true`;
        }

        const content = `-- Helix Item Definition: ${name}
ITEM.name = "${name}"
ITEM.description = "${flags.desc || flags.description || 'A useful item in the world.'}"
ITEM.model = "${model}"
ITEM.width = ${width}
ITEM.height = ${height}
ITEM.category = "${category}"
ITEM.price = ${price}
${functionsCode}
`;

        const itemsDir = path.join(ROOT_DIR, 'items');
        ensureDir(itemsDir);
        const filePath = path.join(itemsDir, `sh_${id}.lua`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`\x1b[32m✔ Created Item:\x1b[0m ${path.relative(ROOT_DIR, filePath)}`);
    },

    recipe(params, flags) {
        const id = params[0] || flags.id || 'new_recipe';
        const name = flags.name || params[1] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const result = flags.result || id;
        const amount = parseInt(flags.amount || 1, 10);
        const craftTime = parseInt(flags.time || 5, 10);
        const skill = flags.skill || 'crafting';
        const skillLevel = parseInt(flags.level || 1, 10);
        const xp = parseInt(flags.xp || 30, 10);
        const category = flags.cat || flags.category || 'General';

        // Parse ingredients: format "scrap_metal:2,chemicals:1"
        const rawIngs = flags.ingredients || 'scrap_metal:2';
        const ingredientLines = rawIngs.split(',').map(pair => {
            const [item, count] = pair.split(':');
            return `        ["${item.trim()}"] = ${parseInt(count || 1, 10)}`;
        }).join(',\n');

        const recipeLua = `
    ["${id}"] = {
        name = "${name}",
        desc = "${flags.desc || 'Crafted specialized item.'}",
        category = "${category}",
        result = "${result}",
        amount = ${amount},
        craftTime = ${craftTime},
        reqSkills = { ${skill} = ${skillLevel} },
        ingredients = {
${ingredientLines}
        },
        xp = { skill = "${skill}", amount = ${xp} }
    },`;

        console.log(`\n\x1b[36m--- Generated Recipe Lua Chunk (Add to sh_perp_crafting.lua) ---\x1b[0m`);
        console.log(recipeLua);

        // Optional auto-append to sh_perp_crafting.lua
        const craftFile = path.join(ROOT_DIR, 'sh_perp_crafting.lua');
        if (fs.existsSync(craftFile) && flags.append) {
            let fileContent = fs.readFileSync(craftFile, 'utf8');
            const insertIndex = fileContent.lastIndexOf('}');
            if (insertIndex !== -1) {
                fileContent = fileContent.slice(0, insertIndex) + recipeLua + '\n' + fileContent.slice(insertIndex);
                fs.writeFileSync(craftFile, fileContent, 'utf8');
                console.log(`\x1b[32m✔ Appended directly to sh_perp_crafting.lua\x1b[0m`);
            }
        }
    },

    entity(params, flags) {
        const id = params[0] || flags.id || 'ix_custom_station';
        const name = flags.name || params[1] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const model = flags.model || 'models/props_c17/furnituretable002a.mdl';
        const entDir = path.join(ROOT_DIR, 'entities', 'entities', id);
        ensureDir(entDir);

        const sharedContent = `AddCSLuaFile()

ENT.Type = "anim"
ENT.Base = "base_gmodentity"
ENT.PrintName = "${name}"
ENT.Author = "HelixGame"
ENT.Spawnable = true
ENT.AdminOnly = false
ENT.Category = "Helix Systems"

function ENT:SetupDataTables()
    self:NetworkVar("String", 0, "StationID")
end
`;

        const initContent = `AddCSLuaFile("cl_init.lua")
AddCSLuaFile("shared.lua")
include("shared.lua")

function ENT:Initialize()
    self:SetModel("${model}")
    self:PhysicsInit(SOLID_VPHYSICS)
    self:SetMoveType(MOVETYPE_VPHYSICS)
    self:SetSolid(SOLID_VPHYSICS)
    self:SetUseType(SIMPLE_USE)

    local phys = self:GetPhysicsObject()
    if IsValid(phys) then
        phys:Wake()
        phys:EnableMotion(false)
    end
end

function ENT:Use(activator, caller)
    if not IsValid(activator) or not activator:IsPlayer() then return end
    
    local stationID = self:GetStationID()
    if ix.customSystems and ix.customSystems.OpenStation then
        ix.customSystems.OpenStation(activator, self)
    else
        activator:Notify("Interacted with ${name}.")
    end
end
`;

        const clInitContent = `include("shared.lua")

function ENT:Draw()
    self:DrawModel()

    local pos = self:GetPos() + Vector(0, 0, 45)
    local ang = Angle(0, LocalPlayer():EyeAngles().y - 90, 90)

    cam.Start3D2D(pos, ang, 0.1)
        draw.SimpleText("${name}", "DermaLarge", 0, 0, Color(255, 255, 255), TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER)
    cam.End3D2D()
end
`;

        fs.writeFileSync(path.join(entDir, 'shared.lua'), sharedContent, 'utf8');
        fs.writeFileSync(path.join(entDir, 'init.lua'), initContent, 'utf8');
        fs.writeFileSync(path.join(entDir, 'cl_init.lua'), clInitContent, 'utf8');

        console.log(`\x1b[32m✔ Created Entity:\x1b[0m ${path.relative(ROOT_DIR, entDir)} (shared.lua, init.lua, cl_init.lua)`);
    },

    plugin(params, flags) {
        const name = params[0] || flags.name || 'NewSystem';
        const folderName = name.toLowerCase().replace(/\s+/g, '_');
        const author = flags.author || 'HelixGame';
        const desc = flags.desc || 'Custom Helix Gamemode Plugin.';
        const pluginDir = path.join(ROOT_DIR, 'plugins', folderName);
        ensureDir(pluginDir);

        const shPlugin = `local PLUGIN = PLUGIN or {}
PLUGIN.name = "${name}"
PLUGIN.author = "${author}"
PLUGIN.description = "${desc}"

ix.util.Include("sh_plugin.lua")
ix.util.Include("sv_plugin.lua")
ix.util.Include("cl_plugin.lua")

function PLUGIN:InitializedPlugins()
    print("[Helix] Initialized ${name} Plugin.")
end
`;

        const svPlugin = `local PLUGIN = PLUGIN

function PLUGIN:PlayerLoadedCharacter(client, character, currentChar)
    -- Character load hook
end
`;

        const clPlugin = `local PLUGIN = PLUGIN

-- Client hooks and net receivers
`;

        fs.writeFileSync(path.join(pluginDir, 'sh_plugin.lua'), shPlugin, 'utf8');
        fs.writeFileSync(path.join(pluginDir, 'sv_plugin.lua'), svPlugin, 'utf8');
        fs.writeFileSync(path.join(pluginDir, 'cl_plugin.lua'), clPlugin, 'utf8');

        console.log(`\x1b[32m✔ Created Plugin:\x1b[0m plugins/${folderName}`);
    },

    command(params, flags) {
        const name = params[0] || flags.name || 'CustomCommand';
        const adminOnly = flags.admin === true || flags.admin === 'true';
        const desc = flags.desc || 'Executes custom system action.';

        const content = `ix.command.Add("${name}", {
    description = "${desc}",
    adminOnly = ${adminOnly},
    arguments = {
        ix.type.player,
        ix.type.string
    },
    OnRun = function(self, client, target, reason)
        local char = target:GetCharacter()
        if not char then return "@invalidChar" end

        target:Notify("Action executed by " .. client:Name() .. ": " .. reason)
        return "Command ${name} executed."
    end
})
`;
        console.log(`\x1b[36m--- Helix Command Template ---\x1b[0m\n${content}`);
    },

    derma(params, flags) {
        const name = params[0] || flags.name || 'ixCustomMenu';
        const title = flags.title || 'Interactive Control Panel';
        const dermaDir = path.join(ROOT_DIR, 'derma');
        ensureDir(dermaDir);

        const content = `local PANEL = {}

function PANEL:Init()
    self:SetSize(ScrW() * 0.5, ScrH() * 0.6)
    self:Center()
    self:MakePopup()
    self:SetTitle("${title}")

    self.scroll = vgui.Create("DScrollPanel", self)
    self.scroll:Dock(FILL)
    self.scroll:DockMargin(12, 12, 12, 12)

    local btn = self.scroll:Add("DButton")
    btn:Dock(TOP)
    btn:DockMargin(0, 0, 0, 8)
    btn:SetTall(40)
    btn:SetText("Perform Action")
    btn.DoClick = function()
        surface.PlaySound("buttons/button14.wav")
        self:Close()
    end
end

function PANEL:Paint(w, h)
    draw.RoundedBox(8, 0, 0, w, h, Color(24, 28, 36, 245))
    draw.RoundedBoxEx(8, 0, 0, w, 32, Color(16, 18, 24, 255), true, true, false, false)
end

vgui.Register("${name}", PANEL, "DFrame")
`;

        const filePath = path.join(dermaDir, `cl_${name.toLowerCase()}.lua`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`\x1b[32m✔ Created Derma Menu:\x1b[0m ${path.relative(ROOT_DIR, filePath)}`);
    },

    help() {
        console.log(`
\x1b[35m=== Helix Game Script & System Scaffolding CLI ===\x1b[0m

\x1b[33mCommands:\x1b[0m
  \x1b[32mitem <id> [name] [options]\x1b[0m
    --type=consumable|weapon|crafting|equip
    --model="models/..."
    --w=1 --h=1 --price=100 --heal=25 --weapon=weapon_glock

  \x1b[32mrecipe <id> [name] [options]\x1b[0m
    --result=<item_id> --amount=1 --time=5 --skill=crafting --level=1 --xp=30
    --ingredients="scrap_metal:2,crypto_usb:1"
    --append (automatically appends into sh_perp_crafting.lua)

  \x1b[32mentity <id> [name] [options]\x1b[0m
    --model="models/props_c17/furnituretable002a.mdl"

  \x1b[32mplugin <name> [options]\x1b[0m
    --author="Name" --desc="Description"

  \x1b[32mderma <name> [options]\x1b[0m
    --title="Menu Title"

  \x1b[32mcommand <name> [options]\x1b[0m
    --admin=true|false --desc="Description"
`);
    }
};

const { command, params, flags } = parseArgs();
if (Generators[command]) {
    Generators[command](params, flags);
} else {
    Generators.help();
}
