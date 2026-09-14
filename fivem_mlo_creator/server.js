const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5150;
const PUBLIC_DIR = path.join(__dirname, 'public');
const EXPORTS_DIR = path.join(__dirname, 'exports');
const PROJECTS_DIR = path.join(__dirname, 'projects');

// Common FiveM base paths to check for direct deployment
const DEFAULT_FIVEM_PATHS = [
    'C:\\Users\\Sean\\Desktop\\txData\\Qbox_861B84.base\\resources\\[standalone]',
    'C:\\Users\\Sean\\Desktop\\txData\\Qbox_861B84.base\\resources',
    'C:\\Users\\Sean\\Desktop\\txData\\CFXDefault_XXXX.base\\resources'
];

function ensureDirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

ensureDirSync(PUBLIC_DIR);
ensureDirSync(EXPORTS_DIR);
ensureDirSync(PROJECTS_DIR);

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.lua': 'text/plain',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.obj': 'text/plain',
    '.mtl': 'text/plain',
    '.ico': 'image/x-icon'
};

// Procedural AI Interior Architect presets & generator
function generateAIInterior(prompt) {
    const p = prompt.toLowerCase();
    
    let result = {
        name: 'mlo_custom_interior',
        displayName: 'Custom AI Interior',
        archetype: 'hei_dlc_mlo_custom',
        position: { x: 970.2, y: -100.5, z: 74.0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        rooms: [],
        portals: [],
        entities: [],
        entitySets: []
    };

    if (p.includes('bunker') || p.includes('vault') || p.includes('armory') || p.includes('underground')) {
        result.name = 'mlo_underground_bunker';
        result.displayName = 'Tactical Underground Bunker & Armory';
        result.rooms = [
            { id: 0, name: 'limbo', bbMin: [-30, -30, -10], bbMax: [30, 30, 10], timecycle: 'default', blend: 0.0, flags: 0 },
            { id: 1, name: 'airlock_entrance', bbMin: [-3, -4, -1], bbMax: [3, 4, 4], timecycle: 'v_tunnel', blend: 1.0, flags: 0 },
            { id: 2, name: 'tactical_war_room', bbMin: [-10, -10, -1], bbMax: [10, 10, 5], timecycle: 'int_hospital', blend: 1.0, flags: 0 },
            { id: 3, name: 'high_sec_armory', bbMin: [10, -8, -1], bbMax: [22, 8, 4], timecycle: 'int_motel', blend: 1.0, flags: 0 }
        ];
        result.portals = [
            {
                fromRoom: 0, toRoom: 1, flags: 0,
                vertices: [
                    { x: 0, y: -4, z: 0 },
                    { x: 0, y: -4, z: 3 },
                    { x: 2, y: -4, z: 3 },
                    { x: 2, y: -4, z: 0 }
                ]
            },
            {
                fromRoom: 1, toRoom: 2, flags: 0,
                vertices: [
                    { x: 0, y: 4, z: 0 },
                    { x: 0, y: 4, z: 3 },
                    { x: 2, y: 4, z: 3 },
                    { x: 2, y: 4, z: 0 }
                ]
            },
            {
                fromRoom: 2, toRoom: 3, flags: 0,
                vertices: [
                    { x: 10, y: 0, z: 0 },
                    { x: 10, y: 0, z: 3 },
                    { x: 10, y: 2, z: 3 },
                    { x: 10, y: 2, z: 0 }
                ]
            }
        ];
        result.entities = [
            { id: 'bunk_door', name: 'Airlock Security Door', model: 'v_ilev_arm_secdoor', room: 1, pos: { x: 0, y: -4, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'bunk_desk', name: 'War Room Console', model: 'hei_prop_hei_table_console', room: 2, pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'bunk_server', name: 'Server Rack', model: 'hei_prop_heist_monitor', room: 2, pos: { x: -4, y: 4, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'bunk_guns', name: 'Heavy Rifle Wall Rack', model: 'gr_prop_gr_gun_cabinet_01a', room: 3, pos: { x: 15, y: -4, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } }
        ];
    } else if (p.includes('penthouse') || p.includes('luxury') || p.includes('mansion') || p.includes('apartment')) {
        result.name = 'mlo_luxury_penthouse';
        result.displayName = 'High-End Modern Penthouse Suite';
        result.rooms = [
            { id: 0, name: 'limbo', bbMin: [-40, -40, -10], bbMax: [40, 40, 10], timecycle: 'default', blend: 0.0, flags: 0 },
            { id: 1, name: 'grand_foyer', bbMin: [-5, -6, 0], bbMax: [5, 6, 4], timecycle: 'int_clothes_high', blend: 1.0, flags: 0 },
            { id: 2, name: 'panoramic_living_room', bbMin: [-12, -14, 0], bbMax: [12, 14, 4.5], timecycle: 'int_clothes_high', blend: 1.0, flags: 0 },
            { id: 3, name: 'master_spa_bath', bbMin: [12, -6, 0], bbMax: [20, 6, 3.5], timecycle: 'int_hospital', blend: 1.0, flags: 0 }
        ];
        result.portals = [
            {
                fromRoom: 0, toRoom: 1, flags: 0,
                vertices: [
                    { x: 0, y: -6, z: 0 }, { x: 0, y: -6, z: 2.8 }, { x: 2.2, y: -6, z: 2.8 }, { x: 2.2, y: -6, z: 0 }
                ]
            },
            {
                fromRoom: 1, toRoom: 2, flags: 0,
                vertices: [
                    { x: 0, y: 6, z: 0 }, { x: 0, y: 6, z: 3.5 }, { x: 3.5, y: 6, z: 3.5 }, { x: 3.5, y: 6, z: 0 }
                ]
            },
            {
                fromRoom: 2, toRoom: 3, flags: 0,
                vertices: [
                    { x: 12, y: 0, z: 0 }, { x: 12, y: 0, z: 2.8 }, { x: 12, y: 1.8, z: 2.8 }, { x: 12, y: 1.8, z: 0 }
                ]
            }
        ];
        result.entities = [
            { id: 'sofa_1', name: 'Leather Sectional', model: 'v_club_leather_sofa', room: 2, pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'table_1', name: 'Coffee Table', model: 'prop_table_03', room: 2, pos: { x: 0, y: 1.8, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'win_1', name: 'Floor-to-Ceiling Window', model: 'v_ilev_glass_huge', room: 2, pos: { x: 0, y: 12, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'curtain_1', name: 'Velvet Curtains', model: 'prop_curtain_open_01', room: 2, pos: { x: 0, y: 11.9, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, isCurtain: true, curtainState: 'open' },
            { id: 'bath_tub', name: 'Luxury Soaker Tub', model: 'v_res_mp_soakertub', room: 3, pos: { x: 16, y: 2, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'bath_vanity', name: 'Double Marble Vanity', model: 'v_res_mp_vanity', room: 3, pos: { x: 16, y: -4, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'bath_toilet', name: 'Porcelain Toilet', model: 'prop_toilet_01', room: 3, pos: { x: 19, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } }
        ];
    } else {
        result.name = 'mlo_executive_lounge';
        result.displayName = 'Executive Lounge & Office';
        result.rooms = [
            { id: 0, name: 'limbo', bbMin: [-30, -30, -10], bbMax: [30, 30, 10], timecycle: 'default', blend: 0.0, flags: 0 },
            { id: 1, name: 'reception', bbMin: [-4, -5, 0], bbMax: [4, 5, 3.5], timecycle: 'int_clothes_high', blend: 1.0, flags: 0 },
            { id: 2, name: 'executive_office', bbMin: [-8, -8, 0], bbMax: [8, 8, 4], timecycle: 'int_clothes_high', blend: 1.0, flags: 0 }
        ];
        result.portals = [
            {
                fromRoom: 0, toRoom: 1, flags: 0,
                vertices: [
                    { x: 0, y: -5, z: 0 }, { x: 0, y: -5, z: 2.5 }, { x: 2, y: -5, z: 2.5 }, { x: 2, y: -5, z: 0 }
                ]
            },
            {
                fromRoom: 1, toRoom: 2, flags: 0,
                vertices: [
                    { x: 0, y: 5, z: 0 }, { x: 0, y: 5, z: 3 }, { x: 2.5, y: 5, z: 3 }, { x: 2.5, y: 5, z: 0 }
                ]
            }
        ];
        result.entities = [
            { id: 'exec_desk', name: 'Executive Desk', model: 'v_corp_desk', room: 2, pos: { x: 0, y: 2, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'exec_chair', name: 'Swivel Chair', model: 'v_corp_offchair', room: 2, pos: { x: 0, y: 0.8, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } },
            { id: 'lounge_sofa', name: 'Leather Sofa', model: 'v_club_leather_sofa', room: 1, pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 } }
        ];
    }

    return result;
}

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API ENDPOINTS
    if (pathname === '/api/status' && req.method === 'GET') {
        let detectedDeploy = null;
        for (const p of DEFAULT_FIVEM_PATHS) {
            if (fs.existsSync(p)) {
                detectedDeploy = p;
                break;
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            version: '1.3.0',
            detectedDeployRoot: detectedDeploy,
            exportsDir: EXPORTS_DIR,
            projectsDir: PROJECTS_DIR
        }));
        return;
    }

    if (pathname === '/api/ai/architect' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const generated = generateAIInterior(data.prompt || '');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, project: generated }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    if (pathname === '/api/projects' && req.method === 'GET') {
        try {
            const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'));
            const projects = files.map(file => {
                const content = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8');
                try {
                    const parsed = JSON.parse(content);
                    return {
                        filename: file,
                        name: parsed.name || file.replace('.json', ''),
                        displayName: parsed.displayName || parsed.name,
                        roomCount: (parsed.rooms || []).length,
                        entityCount: (parsed.entities || []).length,
                        updatedAt: fs.statSync(path.join(PROJECTS_DIR, file)).mtime
                    };
                } catch (e) {
                    return { filename: file, name: file, roomCount: 0, entityCount: 0 };
                }
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, projects }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (pathname === '/api/projects/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const project = JSON.parse(body);
                const safeName = (project.name || 'untitled_mlo').replace(/[^a-zA-Z0-9_-]/g, '_');
                const filePath = path.join(PROJECTS_DIR, `${safeName}.json`);
                fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, filename: `${safeName}.json` }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    if (pathname === '/api/projects/load' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const filePath = path.join(PROJECTS_DIR, data.filename);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, project: JSON.parse(content) }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Project file not found' }));
                }
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // EXPORT TO SERVER & BACKUP
    if (pathname === '/api/export' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const bundle = JSON.parse(body);
                const resName = (bundle.name || 'custom_mlo').toLowerCase().replace(/[^a-z0-9_]/g, '_');
                
                // Write to local exports directory
                const localTargetDir = path.join(EXPORTS_DIR, resName);
                const localStreamDir = path.join(localTargetDir, 'stream');
                ensureDirSync(localTargetDir);
                ensureDirSync(localStreamDir);

                const writeBundleFiles = (targetDir, streamDir) => {
                    ensureDirSync(targetDir);
                    ensureDirSync(streamDir);

                    if (bundle.fxmanifest) fs.writeFileSync(path.join(targetDir, 'fxmanifest.lua'), bundle.fxmanifest, 'utf8');
                    if (bundle.clientLua) fs.writeFileSync(path.join(targetDir, 'client.lua'), bundle.clientLua, 'utf8');
                    if (bundle.configLua) fs.writeFileSync(path.join(targetDir, 'config.lua'), bundle.configLua, 'utf8');
                    if (bundle.doorlockConfig) fs.writeFileSync(path.join(targetDir, 'doorlocks.lua'), bundle.doorlockConfig, 'utf8');
                    if (bundle.ytypXml) fs.writeFileSync(path.join(streamDir, `${resName}.ytyp.xml`), bundle.ytypXml, 'utf8');
                    if (bundle.ymapXml) fs.writeFileSync(path.join(streamDir, `${resName}.ymap.xml`), bundle.ymapXml, 'utf8');
                    if (bundle.projectJson) fs.writeFileSync(path.join(targetDir, `${resName}.mlo.json`), JSON.stringify(bundle.projectJson, null, 2), 'utf8');
                };

                writeBundleFiles(localTargetDir, localStreamDir);

                // Write to server deployPath if provided
                let deployedServerDir = null;
                if (bundle.deployPath) {
                    try {
                        const targetDir = path.join(bundle.deployPath, resName);
                        const streamDir = path.join(targetDir, 'stream');
                        writeBundleFiles(targetDir, streamDir);
                        deployedServerDir = targetDir;
                    } catch (deployErr) {
                        console.error('Error deploying directly to server folder:', deployErr);
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    resourceName: resName,
                    exportPath: deployedServerDir || localTargetDir,
                    localBackupPath: localTargetDir,
                    fileCount: 7
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Static File Serving
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
        safePath = '/index.html';
    }

    const filePath = path.join(PUBLIC_DIR, safePath);
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`404 Not Found: ${pathname}`);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`500 Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 FiveM MLO Creator Suite is running!`);
    console.log(`🌐 Web Interface: http://localhost:${PORT}`);
    console.log(`📁 Exports: ${EXPORTS_DIR}`);
    console.log(`💾 Projects: ${PROJECTS_DIR}`);
    console.log(`=======================================================`);
});
