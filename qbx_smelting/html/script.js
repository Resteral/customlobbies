let furnaceData = {
    furnaceId: null,
    maxTemp: 1800,
    currentTemp: 25,
    fuelLevel: 0,
    activeFuel: null,
    allowedCategories: [],
    recipes: {},
    fuels: {},
    inventory: {}
};

let currentCategory = 'all';
let selectedRecipeKey = null;
let activeSmeltInterval = null;

// ==========================================
// 1. FLOATING EMBER CANVAS PARTICLES
// ==========================================
const canvas = document.getElementById('ember-canvas');
const ctx = canvas.getContext('2d');
let embers = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createEmber() {
    return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 20,
        radius: Math.random() * 2.5 + 0.8,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.4 ? '#ff6b22' : '#ffb703'
    };
}

for (let i = 0; i < 40; i++) {
    embers.push(createEmber());
}

function animateEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = e.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.color;
        ctx.fill();

        e.y -= e.speedY;
        e.x += e.speedX;
        e.opacity -= 0.003;

        if (e.y < -10 || e.opacity <= 0) {
            embers[i] = createEmber();
        }
    }

    requestAnimationFrame(animateEmbers);
}
animateEmbers();

// ==========================================
// 2. WEB AUDIO SYNTHESIZER FOR IMMERSIVE AUDIO
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playForgeSound() {
    try {
        const ctx = getAudioContext();
        // Warm low frequency rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.5);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.0);
    } catch (e) {}
}

function playCompletionChime() {
    try {
        const ctx = getAudioContext();
        // High pure metal anvil ping
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
}

// ==========================================
// 3. FIVEM NUI MESSAGE LISTENER
// ==========================================
window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.action === 'open') {
        furnaceData = {
            furnaceId: data.furnaceId,
            label: data.label,
            type: data.type,
            maxTemp: data.maxTemp || 1800,
            currentTemp: data.currentTemp || 25,
            fuelLevel: data.fuelLevel || 0,
            activeFuel: data.activeFuel,
            allowedCategories: data.allowedCategories || [],
            recipes: data.recipes || {},
            fuels: data.fuels || {},
            inventory: data.inventory || {}
        };

        selectedRecipeKey = null;
        currentCategory = 'all';

        document.getElementById('furnace-name').textContent = data.label.toUpperCase();
        document.getElementById('furnace-type-tag').textContent = (data.type.toUpperCase() + ' GRADE • METALLURGY CHAMBER');
        document.getElementById('max-temp-marker').textContent = `${furnaceData.maxTemp}°C`;

        document.getElementById('active-smelt-modal').classList.add('hidden');
        document.getElementById('smelt-complete-card').classList.add('hidden');

        renderTelemetry();
        renderFuelButtons();
        renderRecipeList();
        renderRecipeDetails();

        document.getElementById('smelter-app').classList.remove('hidden');
    } else if (data.action === 'updateState') {
        furnaceData.currentTemp = data.currentTemp;
        furnaceData.fuelLevel = data.fuelLevel;
        furnaceData.activeFuel = data.activeFuel;

        renderTelemetry();
        if (selectedRecipeKey) {
            checkSmeltConditions();
        }
    } else if (data.action === 'close') {
        closeUI();
    }
});

// Render Live Telemetry Gauges
function renderTelemetry() {
    const tempVal = document.getElementById('temp-val');
    const tempFill = document.getElementById('temp-fill');
    const fuelVal = document.getElementById('fuel-seconds-val');
    const fuelFill = document.getElementById('fuel-fill');
    const fuelStatus = document.getElementById('active-fuel-text');

    const tempPct = Math.min(100, Math.max(0, (furnaceData.currentTemp / furnaceData.maxTemp) * 100));
    tempVal.textContent = `${Math.floor(furnaceData.currentTemp)}°C`;
    tempFill.style.width = `${tempPct}%`;

    fuelVal.textContent = `${furnaceData.fuelLevel}s REMAINING`;
    const fuelPct = Math.min(100, Math.max(0, (furnaceData.fuelLevel / 120) * 100));
    fuelFill.style.width = `${fuelPct}%`;

    if (furnaceData.fuelLevel > 0) {
        fuelStatus.textContent = `BURNING: ${furnaceData.activeFuel ? furnaceData.activeFuel.toUpperCase() : 'COMBUSTION IN PROGRESS'}`;
        fuelStatus.style.color = 'var(--amber-core)';
    } else {
        fuelStatus.textContent = 'STATUS: IDLE (NO COMBUSTION)';
        fuelStatus.style.color = 'var(--text-muted)';
    }
}

// Render Fuel Buttons
function renderFuelButtons() {
    const container = document.getElementById('fuel-buttons-grid');
    container.innerHTML = '';

    for (const [fuelKey, info] of Object.entries(furnaceData.fuels)) {
        const count = furnaceData.inventory[fuelKey] || 0;
        const btn = document.createElement('button');
        btn.className = 'fuel-feed-btn';
        btn.disabled = count <= 0;

        btn.innerHTML = `
            <span><i class="${info.icon || 'fa-solid fa-fire'}"></i> ${info.label} (+${info.heatAdded}°C)</span>
            <span class="fuel-btn-count">${count}x</span>
        `;

        btn.addEventListener('click', () => {
            feedFuel(fuelKey);
        });

        container.appendChild(btn);
    }
}

// Feed Fuel NUI Call
function feedFuel(fuelKey) {
    fetch(`https://${GetParentResourceName()}/addFuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fuelName: fuelKey })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.state) {
            furnaceData.currentTemp = data.state.temp;
            furnaceData.fuelLevel = data.state.fuel;
            furnaceData.activeFuel = data.state.activeFuel;
            if (furnaceData.inventory[fuelKey]) {
                furnaceData.inventory[fuelKey]--;
            }
            playForgeSound();
            renderTelemetry();
            renderFuelButtons();
            if (selectedRecipeKey) checkSmeltConditions();
        }
    })
    .catch(err => console.error('addFuel error:', err));
}

// Render Category Filtered Recipe List
function renderRecipeList() {
    const container = document.getElementById('recipe-list');
    container.innerHTML = '';

    for (const [key, recipe] of Object.entries(furnaceData.recipes)) {
        // Filter by furnace allowed categories
        if (furnaceData.allowedCategories.length > 0 && !furnaceData.allowedCategories.includes(recipe.category)) {
            continue;
        }

        // Filter by active category tab
        if (currentCategory !== 'all' && recipe.category !== currentCategory) {
            continue;
        }

        const card = document.createElement('div');
        card.className = `recipe-card ${selectedRecipeKey === key ? 'active' : ''}`;
        card.innerHTML = `
            <div class="recipe-card-header">
                <span>${recipe.label}</span>
                <span style="color: var(--amber-core); font-size: 11px;">${recipe.minTemp}°C</span>
            </div>
            <div class="recipe-card-sub">${recipe.category.toUpperCase()} • ${recipe.smeltTime / 1000}s SMELT TIME</div>
        `;

        card.addEventListener('click', () => {
            selectedRecipeKey = key;
            renderRecipeList();
            renderRecipeDetails();
        });

        container.appendChild(card);
    }
}

// Render Recipe Details / Crucible View
function renderRecipeDetails() {
    const noSelection = document.getElementById('no-selection');
    const details = document.getElementById('recipe-details');

    if (!selectedRecipeKey || !furnaceData.recipes[selectedRecipeKey]) {
        noSelection.classList.remove('hidden');
        details.classList.add('hidden');
        return;
    }

    noSelection.classList.add('hidden');
    details.classList.remove('hidden');

    const recipe = furnaceData.recipes[selectedRecipeKey];
    document.getElementById('selected-title').textContent = recipe.label;
    document.getElementById('selected-desc').textContent = recipe.description;
    document.getElementById('selected-temp-req').innerHTML = `<i class="fa-solid fa-temperature-arrow-up"></i> Required: ${recipe.minTemp}°C`;

    // Render Inputs
    const inputsContainer = document.getElementById('selected-inputs');
    inputsContainer.innerHTML = '';
    recipe.inputs.forEach(inp => {
        const userHas = furnaceData.inventory[inp.item] || 0;
        const isEnough = userHas >= inp.count;
        const slot = document.createElement('div');
        slot.className = `io-item-slot ${!isEnough ? 'missing' : ''}`;
        slot.innerHTML = `
            <span>${inp.label || inp.item}</span>
            <span>${userHas}/${inp.count}</span>
        `;
        inputsContainer.appendChild(slot);
    });

    // Render Outputs
    const outputsContainer = document.getElementById('selected-outputs');
    outputsContainer.innerHTML = '';
    recipe.outputs.forEach(out => {
        const slot = document.createElement('div');
        slot.className = 'io-item-slot';
        slot.innerHTML = `
            <span>${out.label || out.item}</span>
            <span style="color: var(--success); font-weight: bold;">+${out.count}</span>
        `;
        outputsContainer.appendChild(slot);
    });

    checkSmeltConditions();
}

// Check conditions for Smelt button
function checkSmeltConditions() {
    const recipe = furnaceData.recipes[selectedRecipeKey];
    if (!recipe) return;

    const smeltBtn = document.getElementById('start-smelt-btn');
    const tip = document.getElementById('smelt-status-tip');

    let hasMaterials = true;
    for (const inp of recipe.inputs) {
        const userHas = furnaceData.inventory[inp.item] || 0;
        if (userHas < inp.count) {
            hasMaterials = false;
            break;
        }
    }

    const isHotEnough = furnaceData.currentTemp >= recipe.minTemp;

    if (!hasMaterials) {
        smeltBtn.disabled = true;
        tip.textContent = '❌ Insufficient raw materials in your inventory.';
        tip.style.color = 'var(--fire-red)';
    } else if (!isHotEnough) {
        smeltBtn.disabled = true;
        tip.textContent = `⚠️ Chamber too cold (${Math.floor(furnaceData.currentTemp)}°C). Inject fuel to reach at least ${recipe.minTemp}°C!`;
        tip.style.color = 'var(--amber-core)';
    } else {
        smeltBtn.disabled = false;
        tip.textContent = '✅ Optimal temperature and materials ready. Press to smelt!';
        tip.style.color = 'var(--success)';
    }
}

// ==========================================
// 4. ACTIVE WORKING SMELTER SCREEN ANIMATION
// ==========================================
document.getElementById('start-smelt-btn').addEventListener('click', () => {
    if (!selectedRecipeKey) return;
    const recipe = furnaceData.recipes[selectedRecipeKey];
    if (!recipe) return;

    // Trigger client side sync (animation/ptfx in world)
    fetch(`https://${GetParentResourceName()}/startSmelt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: selectedRecipeKey })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            startActiveSmeltAnimation(recipe);
        }
    });
});

function startActiveSmeltAnimation(recipe) {
    const modal = document.getElementById('active-smelt-modal');
    const title = document.getElementById('active-smelt-name');
    const fill = document.getElementById('smelt-bar-fill');
    const moldFill = document.getElementById('mold-metal-fill');
    const solidIngot = document.getElementById('mold-solid-ingot');
    const stageLabel = document.getElementById('active-stage-label');
    const countdown = document.getElementById('active-countdown');
    const percent = document.getElementById('smelt-percent');
    const completeCard = document.getElementById('smelt-complete-card');

    title.textContent = `SMELTING ${recipe.label.toUpperCase()}`;
    modal.classList.remove('hidden');
    completeCard.classList.add('hidden');
    solidIngot.classList.add('hidden');
    fill.style.width = '0%';
    moldFill.style.height = '0%';

    playForgeSound();

    const duration = recipe.smeltTime || 8000;
    const startTime = Date.now();

    if (activeSmeltInterval) clearInterval(activeSmeltInterval);

    activeSmeltInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / duration) * 100);
        const remainingSec = Math.max(0, ((duration - elapsed) / 1000)).toFixed(1);

        fill.style.width = `${pct}%`;
        moldFill.style.height = `${pct}%`;
        percent.textContent = `${Math.floor(pct)}%`;
        countdown.textContent = `${remainingSec}s REMAINING`;

        if (pct < 35) {
            stageLabel.innerHTML = '<i class="fa-solid fa-fire fa-spin"></i> Liquefying Ore & Reagents...';
        } else if (pct < 75) {
            stageLabel.innerHTML = '<i class="fa-solid fa-angles-down fa-bounce"></i> Pouring Molten Stream into Casting Mold...';
        } else {
            stageLabel.innerHTML = '<i class="fa-solid fa-snowflake"></i> Solidifying & Cooling Ingot...';
        }

        if (pct >= 100) {
            clearInterval(activeSmeltInterval);
            finishSmeltingProcess(recipe);
        }
    }, 50);
}

function finishSmeltingProcess(recipe) {
    playCompletionChime();

    const solidIngot = document.getElementById('mold-solid-ingot');
    const completeCard = document.getElementById('smelt-complete-card');
    const yieldContainer = document.getElementById('reward-yield-chips');

    solidIngot.classList.remove('hidden');
    yieldContainer.innerHTML = '';

    recipe.outputs.forEach(out => {
        const chip = document.createElement('div');
        chip.className = 'yield-chip';
        chip.innerHTML = `<i class="fa-solid fa-bars"></i> ${out.label || out.item} <span style="color: var(--success);">(+${out.count})</span>`;
        yieldContainer.appendChild(chip);

        // Update local inventory count
        furnaceData.inventory[out.item] = (furnaceData.inventory[out.item] || 0) + out.count;
    });

    // Deduct inputs from local cache
    recipe.inputs.forEach(inp => {
        if (furnaceData.inventory[inp.item]) {
            furnaceData.inventory[inp.item] = Math.max(0, furnaceData.inventory[inp.item] - inp.count);
        }
    });

    setTimeout(() => {
        completeCard.classList.remove('hidden');
    }, 600);
}

document.getElementById('return-foundry-btn').addEventListener('click', () => {
    document.getElementById('active-smelt-modal').classList.add('hidden');
    renderRecipeDetails();
    renderFuelButtons();
});

// Category Tab Filters
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat');
        renderRecipeList();
    });
});

// Close UI Handler
function closeUI() {
    if (activeSmeltInterval) clearInterval(activeSmeltInterval);
    document.getElementById('smelter-app').classList.add('hidden');
    fetch(`https://${GetParentResourceName()}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

document.getElementById('close-btn').addEventListener('click', closeUI);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeUI();
    }
});
