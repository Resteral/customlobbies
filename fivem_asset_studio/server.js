const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5050;
const PUBLIC_DIR = path.join(__dirname, 'public');
const SERVER_BASE = 'C:\\Users\\Sean\\Desktop\\txData\\Qbox_861B84.base';
const DEFAULT_DEPLOY_ROOT = path.join(SERVER_BASE, 'resources', '[standalone]');
const OX_ITEMS_PATH = path.join(SERVER_BASE, 'resources', '[ox]', 'ox_inventory', 'data', 'items.lua');
const SERVER_CFG_PATH = path.join(SERVER_BASE, 'server.cfg');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.obj': 'text/plain',
    '.mtl': 'text/plain'
};

function ensureDirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// AI Bot System Blueprint Parser
function parsePromptToBlueprint(prompt) {
    const p = prompt.toLowerCase();
    
    let blueprint = {
        preset: 'crafting_station',
        resourceName: 'tripo_custom_system',
        propName: 'prop_tripo_machine_01',
        targetLabel: 'Interact with Station',
        actionTime: 6,
        animDict: 'anim@amb@business@weed@weed_inspecting_high_p1@',
        inputItem: 'raw_material',
        outputItem: 'crafted_product',
        coords: { x: 149.95, y: -1040.59, z: 29.37, h: 90.0 }
    };

    if (p.includes('weed') || p.includes('rosin') || p.includes('dab') || p.includes('cannabis')) {
        blueprint.resourceName = 'tripo_rosin_press';
        blueprint.propName = 'prop_weed_press_01';
        blueprint.targetLabel = 'Press Rosin Extract';
        blueprint.inputItem = 'weed_baggy';
        blueprint.outputItem = 'rosin_dabs';
        blueprint.animDict = 'anim@amb@business@weed@weed_inspecting_high_p1@';
    } else if (p.includes('ice cream') || p.includes('soft serve') || p.includes('dispenser') || p.includes('munchies')) {
        blueprint.preset = 'vending_dispenser';
        blueprint.resourceName = 'tripo_softserve_stand';
        blueprint.propName = 'prop_icecream_machine_01';
        blueprint.targetLabel = 'Dispense Soft Serve';
        blueprint.inputItem = 'cash';
        blueprint.outputItem = 'mint_chocolate_cone';
        blueprint.animDict = 'mini@sprunk';
    } else if (p.includes('coke') || p.includes('cocaine') || p.includes('brick') || p.includes('cut')) {
        blueprint.resourceName = 'tripo_coke_cutting_table';
        blueprint.propName = 'prop_coke_bench_01';
        blueprint.targetLabel = 'Cut & Press Cocaine';
        blueprint.inputItem = 'coke_raw';
        blueprint.outputItem = 'coke_brick';
        blueprint.animDict = 'anim@amb@business@meth@meth_monitoring_cooking@cooking@';
    } else if (p.includes('moonshine') || p.includes('alcohol') || p.includes('distill') || p.includes('still')) {
        blueprint.resourceName = 'tripo_moonshine_still';
        blueprint.propName = 'prop_moonshine_barrel_01';
        blueprint.targetLabel = 'Distill Moonshine Batch';
        blueprint.inputItem = 'corn_mash';
        blueprint.outputItem = 'moonshine_jar';
        blueprint.animDict = 'mp_common';
    } else if (p.includes('stash') || p.includes('safe') || p.includes('vault') || p.includes('storage')) {
        blueprint.preset = 'storage_stash';
        blueprint.resourceName = 'tripo_secure_safe';
        blueprint.propName = 'prop_vault_safe_01';
        blueprint.targetLabel = 'Open Syndicate Safe';
        blueprint.inputItem = 'safe_key';
        blueprint.outputItem = 'clean_money';
        blueprint.animDict = 'anim@heists@keycard@';
    } else if (p.includes('vending') || p.includes('snack') || p.includes('drink') || p.includes('shop')) {
        blueprint.preset = 'vending_dispenser';
        blueprint.resourceName = 'tripo_vending_machine';
        blueprint.propName = 'prop_vending_snack_01';
        blueprint.targetLabel = 'Purchase Snacks & Drinks';
        blueprint.inputItem = 'cash';
        blueprint.outputItem = 'energy_drink';
        blueprint.animDict = 'mini@sprunk';
    }

    // Extract any explicit names if provided
    const words = prompt.split(' ');
    if (words.length > 2) {
        blueprint.botMessage = `🤖 FiveM Copilot: I designed a complete **${blueprint.targetLabel}** blueprint! Auto-configured prop model hash, animations, and crafting recipe for you.`;
    }

    return blueprint;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API: AI Bot Prompt Generator
    if (pathname === '/api/bot/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const blueprint = parsePromptToBlueprint(data.prompt || '');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, blueprint: blueprint }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Auto-Inject Item into Ox Inventory
    if (pathname === '/api/bot/auto-inject-item' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const itemCode = data.itemCode;
                const itemName = data.itemName;

                if (!fs.existsSync(OX_ITEMS_PATH)) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: `Ox Inventory items.lua not found at ${OX_ITEMS_PATH}` }));
                    return;
                }

                let currentContent = fs.readFileSync(OX_ITEMS_PATH, 'utf8');
                if (currentContent.includes(`['${itemName}']`)) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: `Item ['${itemName}'] already exists in Ox Inventory!` }));
                    return;
                }

                // Append before the end
                if (currentContent.trim().endsWith('}')) {
                    const lastIdx = currentContent.lastIndexOf('}');
                    currentContent = currentContent.substring(0, lastIdx) + '\n\t' + itemCode.trim() + '\n}';
                } else {
                    currentContent += '\n' + itemCode;
                }

                fs.writeFileSync(OX_ITEMS_PATH, currentContent, 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: `Successfully injected ['${itemName}'] directly into Ox Inventory!`
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Auto-Add to server.cfg
    if (pathname === '/api/bot/auto-add-server-cfg' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const resName = data.resourceName;

                if (fs.existsSync(SERVER_CFG_PATH)) {
                    let cfgContent = fs.readFileSync(SERVER_CFG_PATH, 'utf8');
                    if (!cfgContent.includes(`ensure ${resName}`)) {
                        cfgContent += `\nensure ${resName}\n`;
                        fs.writeFileSync(SERVER_CFG_PATH, cfgContent, 'utf8');
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: `Added "ensure ${resName}" to server.cfg!`
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Deploy Resource to FiveM Server
    if (pathname === '/api/deploy' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const resourceName = (data.resourceName || 'custom_tripo_asset').toLowerCase().replace(/[^a-z0-9_]/g, '_');
                const deployPath = data.targetPath || path.join(DEFAULT_DEPLOY_ROOT, resourceName);
                const localExportPath = path.join(__dirname, 'exports', resourceName);

                const targets = [deployPath, localExportPath];

                targets.forEach(target => {
                    ensureDirSync(target);
                    ensureDirSync(path.join(target, 'client'));
                    ensureDirSync(path.join(target, 'server'));
                    ensureDirSync(path.join(target, 'stream'));

                    if (data.manifest) {
                        fs.writeFileSync(path.join(target, 'fxmanifest.lua'), data.manifest, 'utf8');
                    }
                    if (data.clientLua) {
                        fs.writeFileSync(path.join(target, 'client', 'cl_main.lua'), data.clientLua, 'utf8');
                    }
                    if (data.serverLua) {
                        fs.writeFileSync(path.join(target, 'server', 'sv_main.lua'), data.serverLua, 'utf8');
                    }
                    if (data.configLua) {
                        fs.writeFileSync(path.join(target, 'config.lua'), data.configLua, 'utf8');
                    }
                    if (data.itemsLua) {
                        fs.writeFileSync(path.join(target, 'items_snippet.lua'), data.itemsLua, 'utf8');
                    }
                    if (data.readme) {
                        fs.writeFileSync(path.join(target, 'README.md'), data.readme, 'utf8');
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    resourceName: resourceName,
                    deployPath: deployPath,
                    localExportPath: localExportPath,
                    message: `Successfully generated and deployed ${resourceName} to your FiveM server!`
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Static File Serving
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 FiveM 3D Asset Studio & AI Server Copilot Running!`);
    console.log(`🌐 Web UI: http://localhost:${PORT}`);
    console.log(`📂 Server Deploy Root: ${DEFAULT_DEPLOY_ROOT}`);
    console.log(`=======================================================`);
});
