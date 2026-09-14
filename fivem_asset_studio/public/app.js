// ==============================================================================
// FIVEM 3D ASSET STUDIO • THREE.JS VIEWPORT & AI COPILOT ENGINE
// ==============================================================================

let scene, camera, renderer, controls;
let currentModel = null;
let isWireframe = false;
let isAutoRotate = false;
let activeCodeTab = 'cl_main.lua';

// Init Three.js 3D Viewport
function init3DViewport() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d14);

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2.5, 2.0, 3.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x2ec4b6, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x9d4edd, 0.8);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    // Grid Floor
    const grid = new THREE.GridHelper(10, 20, 0x2ec4b6, 0x1f293d);
    grid.position.y = -0.01;
    scene.add(grid);

    // Spawn Default Stand-in Prop (Rosin Press Cube)
    createDefaultProp();

    // Animation Render Loop
    function animate() {
        requestAnimationFrame(animate);
        if (isAutoRotate && currentModel) {
            currentModel.rotation.y += 0.008;
        }
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

function createDefaultProp() {
    const geometry = new THREE.BoxGeometry(0.8, 1.2, 0.7);
    const material = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.6,
        roughness: 0.2,
        wireframe: false
    });
    currentModel = new THREE.Mesh(geometry, material);
    currentModel.position.y = 0.6;
    scene.add(currentModel);
    updateDimensions(geometry);
}

function updateDimensions(geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const size = new THREE.Vector3();
    box.getSize(size);
    document.getElementById('stat-dimensions').textContent = 
        `${size.x.toFixed(2)}m x ${size.y.toFixed(2)}m x ${size.z.toFixed(2)}m`;
}

// 3D Model File Loader (GLB, GLTF, OBJ)
function loadModelFromFile(file) {
    const reader = new FileReader();
    const filename = file.name.toLowerCase();
    document.getElementById('stat-filename').textContent = file.name;
    document.getElementById('dropzone-overlay').style.display = 'none';

    if (filename.endsWith('.glb') || filename.endsWith('.gltf')) {
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            const loader = new THREE.GLTFLoader();
            loader.parse(e.target.result, '', (gltf) => {
                if (currentModel) scene.remove(currentModel);
                currentModel = gltf.scene;

                // Center & normalize scale
                const box = new THREE.Box3().setFromObject(currentModel);
                const size = new THREE.Vector3();
                box.getSize(size);
                document.getElementById('stat-dimensions').textContent = 
                    `${size.x.toFixed(2)}m x ${size.y.toFixed(2)}m x ${size.z.toFixed(2)}m`;

                scene.add(currentModel);
            });
        };
    } else if (filename.endsWith('.obj')) {
        reader.readAsText(file);
        reader.onload = (e) => {
            const loader = new THREE.OBJLoader();
            const obj = loader.parse(e.target.result);
            if (currentModel) scene.remove(currentModel);
            currentModel = obj;
            scene.add(currentModel);
        };
    }
}

// ==============================================================================
// DRAG & DROP & CONTROLS LISTENERS
// ==============================================================================
const canvasContainer = document.getElementById('canvas-container');
const fileInput = document.getElementById('file-input');

canvasContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvasContainer.classList.add('drag-active');
});

canvasContainer.addEventListener('dragleave', () => {
    canvasContainer.classList.remove('drag-active');
});

canvasContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    canvasContainer.classList.remove('drag-active');
    if (e.dataTransfer.files.length > 0) {
        loadModelFromFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        loadModelFromFile(e.target.files[0]);
    }
});

document.getElementById('btn-wireframe').addEventListener('click', () => {
    isWireframe = !isWireframe;
    if (currentModel) {
        currentModel.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.wireframe = isWireframe;
            }
        });
    }
});

document.getElementById('btn-autorotate').addEventListener('click', () => {
    isAutoRotate = !isAutoRotate;
});

document.getElementById('btn-reset-cam').addEventListener('click', () => {
    camera.position.set(2.5, 2.0, 3.5);
    controls.target.set(0, 0.5, 0);
});

// ==============================================================================
// TAB SWITCHING
// ==============================================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

        btn.classList.add('active');
        const target = btn.getAttribute('data-tab');
        document.getElementById(target).classList.remove('hidden');

        if (target === 'tab-code') {
            updateCodeDisplay();
        }
    });
});

document.querySelectorAll('.code-sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.code-sub-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCodeTab = btn.getAttribute('data-file');
        updateCodeDisplay();
    });
});

// ==============================================================================
// AI BOT PROMPT DESIGNER & QUICK CHIPS
// ==============================================================================
function requestBotDesign(promptText) {
    if (!promptText || promptText.trim() === '') return;

    fetch('/api/bot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.blueprint) {
            applyBlueprint(data.blueprint);
            showToast(`🤖 Copilot: Auto-designed ${data.blueprint.resourceName}!`);
        }
    })
    .catch(err => {
        showToast('Error communicating with AI Copilot: ' + err.message);
    });
}

function applyBlueprint(bp) {
    if (bp.preset) document.getElementById('preset-select').value = bp.preset;
    if (bp.resourceName) document.getElementById('cfg-res-name').value = bp.resourceName;
    if (bp.propName) document.getElementById('cfg-prop-name').value = bp.propName;
    if (bp.targetLabel) document.getElementById('cfg-target-label').value = bp.targetLabel;
    if (bp.actionTime) document.getElementById('cfg-action-time').value = bp.actionTime;
    if (bp.animDict) document.getElementById('cfg-anim-dict').value = bp.animDict;
    if (bp.inputItem) document.getElementById('cfg-input-item').value = bp.inputItem;
    if (bp.outputItem) document.getElementById('cfg-output-item').value = bp.outputItem;

    updateCodeDisplay();
}

document.getElementById('bot-send-btn').addEventListener('click', () => {
    const prompt = document.getElementById('bot-prompt-input').value;
    requestBotDesign(prompt);
});

document.getElementById('bot-prompt-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        requestBotDesign(e.target.value);
    }
});

document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const p = chip.getAttribute('data-prompt');
        document.getElementById('bot-prompt-input').value = p;
        requestBotDesign(p);
    });
});

// ==============================================================================
// FIVEM LUA CODE GENERATOR ENGINE
// ==============================================================================
function getFormData() {
    return {
        preset: document.getElementById('preset-select').value,
        resourceName: document.getElementById('cfg-res-name').value || 'tripo_custom_asset',
        propName: document.getElementById('cfg-prop-name').value || 'prop_tripo_asset_01',
        framework: document.getElementById('cfg-framework').value,
        inventory: document.getElementById('cfg-inventory').value,
        targetLabel: document.getElementById('cfg-target-label').value || 'Interact',
        actionTime: parseInt(document.getElementById('cfg-action-time').value) || 5,
        animDict: document.getElementById('cfg-anim-dict').value || 'mp_common',
        inputItem: document.getElementById('cfg-input-item').value || 'weed_baggy',
        outputItem: document.getElementById('cfg-output-item').value || 'rosin_dabs',
        coords: {
            x: parseFloat(document.getElementById('cfg-coord-x').value) || 0.0,
            y: parseFloat(document.getElementById('cfg-coord-y').value) || 0.0,
            z: parseFloat(document.getElementById('cfg-coord-z').value) || 0.0,
            h: parseFloat(document.getElementById('cfg-coord-h').value) || 0.0
        }
    };
}

function generateClientLua(d) {
    return `-- ==============================================================================
-- Resource: ${d.resourceName}
-- Generated by FiveM 3D Asset Studio (Tripo2FiveM Pipeline)
-- ==============================================================================

local spawnedObject = nil

-- Spawn 3D World Prop with Collision
CreateThread(function()
    local modelHash = GetHashKey(Config.PropModel or '${d.propName}')
    RequestModel(modelHash)
    while not HasModelLoaded(modelHash) do Wait(10) end

    local coords = Config.SpawnCoords or vec4(${d.coords.x}, ${d.coords.y}, ${d.coords.z}, ${d.coords.h})
    spawnedObject = CreateObject(modelHash, coords.x, coords.y, coords.z - 1.0, false, false, false)
    SetEntityHeading(spawnedObject, coords.w)
    FreezeEntityPosition(spawnedObject, true)
    SetEntityAsMissionEntity(spawnedObject, true, true)

    -- Register Target Interaction
    if Config.Framework == 'ox_target' or exports['ox_target'] then
        exports.ox_target:addLocalEntity(spawnedObject, {
            {
                name = '${d.resourceName}_interact',
                icon = 'fa-solid fa-cube',
                label = '${d.targetLabel}',
                onSelect = function()
                    TriggerEvent('${d.resourceName}:client:startAction')
                end
            }
        })
    elseif exports['qb-target'] then
        exports['qb-target']:AddTargetEntity(spawnedObject, {
            options = {
                {
                    icon = 'fa-solid fa-cube',
                    label = '${d.targetLabel}',
                    action = function()
                        TriggerEvent('${d.resourceName}:client:startAction')
                    end
                }
            },
            distance = 2.5
        })
    end
end)

-- Action Execution Event Handler
RegisterNetEvent('${d.resourceName}:client:startAction', function()
    local ped = PlayerPedId()

    -- Progress Bar
    if lib and lib.progressBar then
        local success = lib.progressBar({
            duration = ${d.actionTime * 1000},
            label = '${d.targetLabel}...',
            useWhileDead = false,
            canCancel = true,
            disable = { car = true, move = true, combat = true },
            anim = {
                dict = '${d.animDict}',
                clip = 'idle'
            }
        })
        if success then
            TriggerServerEvent('${d.resourceName}:server:completeAction')
        end
    else
        TaskPlayAnim(ped, '${d.animDict}', 'idle', 8.0, -8.0, ${d.actionTime * 1000}, 49, 0, false, false, false)
        Wait(${d.actionTime * 1000})
        ClearPedTasks(ped)
        TriggerServerEvent('${d.resourceName}:server:completeAction')
    end
end)
`;
}

function generateServerLua(d) {
    return `-- ==============================================================================
-- Server Handler: ${d.resourceName}
-- ==============================================================================

RegisterNetEvent('${d.resourceName}:server:completeAction', function()
    local src = source

    -- Ox Inventory Handler
    if exports['ox_inventory'] then
        local hasItem = exports.ox_inventory:GetItem(src, '${d.inputItem}', nil, true)
        if hasItem and hasItem >= 1 then
            exports.ox_inventory:RemoveItem(src, '${d.inputItem}', 1)
            exports.ox_inventory:AddItem(src, '${d.outputItem}', 1)
            TriggerClientEvent('ox_lib:notify', src, {
                title = 'Success!',
                description = 'Successfully crafted ' .. '${d.outputItem}' .. '!',
                type = 'success'
            })
        else
            TriggerClientEvent('ox_lib:notify', src, {
                title = 'Missing Ingredients',
                description = 'You need 1x ' .. '${d.inputItem}' .. ' to craft this!',
                type = 'error'
            })
        end
    else
        -- QB-Core / Fallback
        TriggerClientEvent('ox_lib:notify', src, { title = 'Action Completed!', type = 'success' })
    end
end)
`;
}

function generateManifest(d) {
    return `fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name '${d.resourceName}'
author 'FiveM 3D Asset Studio • Tripo Pipeline'
description 'Custom 3D Model System Generated with FiveM Asset Studio'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/cl_main.lua'
}

server_scripts {
    'server/sv_main.lua'
}

data_file 'DLC_ITYP_REQUEST' 'stream/${d.propName}.ytyp'
`;
}

function generateConfig(d) {
    return `Config = {}

Config.Framework = '${d.framework}'
Config.Inventory = '${d.inventory}'
Config.PropModel = '${d.propName}'
Config.SpawnCoords = vec4(${d.coords.x}, ${d.coords.y}, ${d.coords.z}, ${d.coords.h})
Config.ActionDuration = ${d.actionTime}
Config.InputItem = '${d.inputItem}'
Config.OutputItem = '${d.outputItem}'
`;
}

function generateItemsLua(d) {
    return `['${d.outputItem}'] = {
    label = '${d.outputItem.replace(/_/g, ' ').toUpperCase()}',
    weight = 100,
    stack = true,
    close = true,
    description = 'High quality product crafted with the 3D ${d.propName} station.',
    client = {
        image = '${d.outputItem}.png',
    }
},
`;
}

function updateCodeDisplay() {
    const data = getFormData();
    let code = '';
    if (activeCodeTab === 'cl_main.lua') code = generateClientLua(data);
    else if (activeCodeTab === 'sv_main.lua') code = generateServerLua(data);
    else if (activeCodeTab === 'fxmanifest.lua') code = generateManifest(data);
    else if (activeCodeTab === 'config.lua') code = generateConfig(data);
    else if (activeCodeTab === 'items.lua') code = generateItemsLua(data);

    document.getElementById('code-display').textContent = code;
}

// Copy Code Button
document.getElementById('copy-code-btn').addEventListener('click', () => {
    const code = document.getElementById('code-display').textContent;
    navigator.clipboard.writeText(code);
    showToast('Code copied to clipboard!');
});

// Auto-Inject Item to Ox Inventory Button
document.getElementById('btn-inject-ox').addEventListener('click', () => {
    const data = getFormData();
    const itemCode = generateItemsLua(data);

    fetch('/api/bot/auto-inject-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: data.outputItem, itemCode: itemCode })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            showToast(`⚡ Injected ['${data.outputItem}'] into ox_inventory/data/items.lua!`);
        } else {
            showToast('Error: ' + result.error);
        }
    })
    .catch(err => {
        showToast('Error injecting: ' + err.message);
    });
});

// Auto-Add to server.cfg Button
document.getElementById('btn-add-cfg').addEventListener('click', () => {
    const data = getFormData();

    fetch('/api/bot/auto-add-server-cfg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceName: data.resourceName })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            showToast(`📝 Added "ensure ${data.resourceName}" to server.cfg!`);
        } else {
            showToast('Error: ' + result.error);
        }
    })
    .catch(err => {
        showToast('Error adding to cfg: ' + err.message);
    });
});

// 1-Click Deploy Button
document.getElementById('deploy-btn').addEventListener('click', () => {
    const data = getFormData();
    const payload = {
        resourceName: data.resourceName,
        manifest: generateManifest(data),
        clientLua: generateClientLua(data),
        serverLua: generateServerLua(data),
        configLua: generateConfig(data),
        itemsLua: generateItemsLua(data),
        readme: `# ${data.resourceName}\n\nGenerated with FiveM 3D Asset Studio (Tripo2FiveM Pipeline).\n\nAdd \`ensure ${data.resourceName}\` to your \`server.cfg\`!`
    };

    fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            showToast(`🚀 Deployed ${data.resourceName} to FiveM Server!`);
        } else {
            showToast('Error: ' + result.error);
        }
    })
    .catch(err => {
        showToast('Error deploying: ' + err.message);
    });
});

// ==============================================================================
// STANDALONE SCRIPT FACTORY GENERATOR ENGINE
// ==============================================================================
window.onFactoryTemplateChange = function() {
    const sel = document.getElementById('factory-template-select').value;
    const resInput = document.getElementById('fac-res-name');
    const labelInput = document.getElementById('fac-system-label');

    if (sel === 'business_empire') {
        resInput.value = 'standalone_business_empire';
        labelInput.value = 'Commercial Business Empire';
        document.getElementById('fac-feat-nui').checked = true;
        document.getElementById('fac-feat-supplies').checked = true;
        document.getElementById('fac-feat-vault').checked = true;
        document.getElementById('fac-feat-guards').checked = true;
        document.getElementById('fac-feat-missions').checked = true;
        document.getElementById('fac-feat-npcsell').checked = true;
        document.getElementById('fac-feat-livery').checked = false;
    } else if (sel === 'mobile_truck') {
        resInput.value = 'standalone_mobile_truck';
        labelInput.value = 'Mobile Job & Dispensary Truck';
        document.getElementById('fac-feat-nui').checked = true;
        document.getElementById('fac-feat-supplies').checked = false;
        document.getElementById('fac-feat-vault').checked = false;
        document.getElementById('fac-feat-guards').checked = false;
        document.getElementById('fac-feat-missions').checked = true;
        document.getElementById('fac-feat-npcsell').checked = true;
        document.getElementById('fac-feat-livery').checked = true;
    } else if (sel === 'crafting_lab') {
        resInput.value = 'standalone_crafting_lab';
        labelInput.value = 'Interactive Processing Lab';
        document.getElementById('fac-feat-nui').checked = false;
        document.getElementById('fac-feat-supplies').checked = false;
        document.getElementById('fac-feat-vault').checked = false;
        document.getElementById('fac-feat-guards').checked = false;
        document.getElementById('fac-feat-missions').checked = false;
        document.getElementById('fac-feat-npcsell').checked = false;
        document.getElementById('fac-feat-livery').checked = false;
    } else if (sel === 'delivery_smuggle') {
        resInput.value = 'standalone_smuggle_network';
        labelInput.value = 'Contraband Delivery Network';
        document.getElementById('fac-feat-nui').checked = true;
        document.getElementById('fac-feat-supplies').checked = true;
        document.getElementById('fac-feat-vault').checked = false;
        document.getElementById('fac-feat-guards').checked = true;
        document.getElementById('fac-feat-missions').checked = true;
        document.getElementById('fac-feat-npcsell').checked = false;
        document.getElementById('fac-feat-livery').checked = false;
    }
};

window.generateAndDeployFactoryScript = function() {
    const archetype = document.getElementById('factory-template-select').value;
    const resName = document.getElementById('fac-res-name').value.trim() || 'standalone_custom_system';
    const label = document.getElementById('fac-system-label').value.trim() || 'Custom System';

    const hasNui = document.getElementById('fac-feat-nui').checked;
    const hasSupplies = document.getElementById('fac-feat-supplies').checked;
    const hasVault = document.getElementById('fac-feat-vault').checked;
    const hasGuards = document.getElementById('fac-feat-guards').checked;
    const hasMissions = document.getElementById('fac-feat-missions').checked;
    const hasNpcSell = document.getElementById('fac-feat-npcsell').checked;
    const hasLivery = document.getElementById('fac-feat-livery').checked;

    // Compile Config.lua
    const configLua = `-- ==============================================================================
-- Config: ${label} (${resName})
-- Generated by FiveM Standalone Script Factory
-- ==============================================================================
Config = {}

Config.SystemLabel = "${label}"
Config.Framework = "auto" -- auto, ox, qb, esx, standalone
Config.EnableNUI = ${hasNui}
Config.EnableSupplies = ${hasSupplies}
Config.EnableVaultHeists = ${hasVault}
Config.EnableGuards = ${hasGuards}
Config.EnableMissions = ${hasMissions}
Config.EnableNPCStreetSales = ${hasNpcSell}
Config.EnableCustomLiveries = ${hasLivery}

-- Payout & Economy
Config.BasePayout = 350
Config.PayoutIntervalSeconds = 60
Config.RepGainIntervalSeconds = 300
Config.SupplyDecayPerPayout = 4

Config.Zones = {
    ["zone_01"] = {
        label = "${label} Hub",
        coords = vec3(149.95, -1040.59, 29.37),
        radius = 20.0,
        payout = 400
    }
}
`;

    // Compile fxmanifest.lua
    const manifestLua = `fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name '${resName}'
author 'FiveM Standalone Script Factory'
description '${label} - 100% Standalone Multi-Framework Resource'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/cl_main.lua'
}

server_scripts {
    'server/sv_main.lua'
}
`;

    // Compile Client Lua
    const clientLua = `-- ==============================================================================
-- Client: ${label} (${resName})
-- 100% Standalone Architecture with Universal Bridge
-- ==============================================================================

local currentZone = nil

CreateThread(function()
    while true do
        local sleep = 1000
        local ped = PlayerPedId()
        local pCoords = GetEntityCoords(ped)

        for id, zone in pairs(Config.Zones or {}) do
            local dist = #(pCoords - zone.coords)
            if dist < 45.0 then
                sleep = 0
                DrawMarker(1, zone.coords.x, zone.coords.y, zone.coords.z - 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, zone.radius * 2.0, zone.radius * 2.0, 1.2, 46, 196, 182, 120, false, false, 2, false, nil, nil, false)
                
                if dist < zone.radius and not currentZone then
                    currentZone = id
                    TriggerServerEvent('${resName}:server:enterZone', id)
                    if lib and lib.notify then
                        lib.notify({ title = Config.SystemLabel, description = 'Entered ' .. zone.label, type = 'inform' })
                    end
                elseif dist >= zone.radius and currentZone == id then
                    currentZone = nil
                    TriggerServerEvent('${resName}:server:leaveZone', id)
                end
            end
        end
        Wait(sleep)
    end
end)

${hasLivery ? `
-- Custom Livery & Vehicle Extras Handler
RegisterCommand('setwrap', function(source, args)
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if veh and veh > 0 then
        local liveryIndex = tonumber(args[1]) or 0
        SetVehicleLivery(veh, liveryIndex)
        SetVehicleMod(veh, 48, liveryIndex, false)
        if lib and lib.notify then lib.notify({ title = 'Livery Updated', description = 'Applied wrap #' .. liveryIndex, type = 'success' }) end
    end
end, false)
` : ''}

${hasNpcSell ? `
-- NPC Street Selling Mode Toggle
local isSelling = false
RegisterCommand('streetsell', function()
    isSelling = not isSelling
    if lib and lib.notify then
        lib.notify({ title = 'Street Selling', description = isSelling and 'Street sales activated! Buyers will approach.' or 'Street sales stopped.', type = isSelling and 'success' or 'inform' })
    end
end, false)
` : ''}
`;

    // Compile Server Lua
    const serverLua = `-- ==============================================================================
-- Server: ${label} (${resName})
-- Multi-Framework Bridge & Passive Payout Engine
-- ==============================================================================

local ZoneStates = {}

-- Initialize States
for id, zone in pairs(Config.Zones or {}) do
    ZoneStates[id] = {
        owner = "Unclaimed",
        supplies = 100,
        vaultCash = 5000,
        rep = 50
    }
end

-- Passive Economy Loop
CreateThread(function()
    while true do
        Wait((Config.PayoutIntervalSeconds or 60) * 1000)
        for id, state in pairs(ZoneStates) do
            if Config.EnableSupplies then
                state.supplies = math.max(0, state.supplies - (Config.SupplyDecayPerPayout or 4))
            end
            state.vaultCash = state.vaultCash + (Config.BasePayout or 350)
        end
    end
end)

RegisterNetEvent('${resName}:server:enterZone', function(zoneId)
    local src = source
    -- Sync client state
end)

RegisterNetEvent('${resName}:server:leaveZone', function(zoneId)
    local src = source
end)
`;

    const payload = {
        resourceName: resName,
        manifest: manifestLua,
        clientLua: clientLua,
        serverLua: serverLua,
        configLua: configLua,
        itemsLua: `-- Custom item snippet for ${resName}`,
        readme: `# ${label} (${resName})\n\nStandalone FiveM Resource generated with FiveM Standalone Script Factory.\n\nAdd \`ensure ${resName}\` to your \`server.cfg\`!`
    };

    fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            showToast(`🏭 Factory: Successfully built & deployed ${resName}!`);
        } else {
            showToast('Factory Error: ' + result.error);
        }
    })
    .catch(err => {
        showToast('Factory Error: ' + err.message);
    });
};

function showToast(msg) {
    const toast = document.getElementById('studio-toast');
    document.getElementById('toast-message').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// Input change listeners
document.querySelectorAll('.studio-input, .studio-select').forEach(input => {
    input.addEventListener('input', () => {
        if (!document.getElementById('tab-code').classList.contains('hidden')) {
            updateCodeDisplay();
        }
    });
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    init3DViewport();
    updateCodeDisplay();
});

