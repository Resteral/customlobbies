let truckData = {
    netId: null,
    isDriver: false,
    items: {},
    wholesale: {},
    stock: {},
    prices: {},
    jingleActive: false,
    sellingActive: false,
    totalSales: 0
};

let activeTab = 'icecream';
let isSecretUnlocked = false;
let selectedItemKey = null;
let selectedQuantity = 1;

// ==============================================================================
// WEB AUDIO SYNTHESIZER (ZERO ASSET DEPENDENCIES)
// ==============================================================================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playSound(type) {
    try {
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'click') {
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'scan') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            osc.start(now);
            osc.stop(now + 0.18);
        } else if (type === 'buy') {
            // Cha-Ching Coin Register
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {}
}

// ==============================================================================
// AMBIENT PARTICLE SMOKE CANVAS (PURPLE HAZE & GREEN VAPORS)
// ==============================================================================
const canvas = document.getElementById('ambient-smoke-canvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function initSmokeCanvas() {
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = [];
    for (let i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 60 + 30,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -Math.random() * 0.5 - 0.2,
            alpha: Math.random() * 0.3 + 0.1,
            color: Math.random() > 0.5 ? '124, 255, 77' : '142, 68, 173'
        });
    }
}

function animateSmoke() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y + p.r < 0) {
            p.y = canvas.height + p.r;
            p.x = Math.random() * canvas.width;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animateSmoke);
}

window.addEventListener('resize', initSmokeCanvas);
initSmokeCanvas();
animateSmoke();

// ==============================================================================
// FIVEM NUI MESSAGE LISTENER
// ==============================================================================
window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.action === 'open') {
        truckData = {
            netId: data.netId,
            isDriver: data.isDriver || false,
            items: data.items || {},
            wholesale: data.wholesale || {},
            stock: data.stock || {},
            prices: data.prices || {},
            jingleActive: data.jingleActive || false,
            sellingActive: data.sellingActive || false,
            totalSales: data.totalSales || 0
        };

        selectedQuantity = 1;
        selectedItemKey = null;

        if (truckData.isDriver) {
            isSecretUnlocked = true;
            document.getElementById('driver-nav-wrapper').classList.remove('hidden');
        } else {
            isSecretUnlocked = false;
            document.getElementById('driver-nav-wrapper').classList.add('hidden');
        }

        updateSecretUIState();
        switchTab('icecream');

        document.getElementById('truck-app').classList.remove('hidden');
    } else if (data.action === 'updateTruck') {
        truckData.stock = data.stock || truckData.stock;
        truckData.prices = data.prices || truckData.prices;
        truckData.jingleActive = data.jingleActive ?? truckData.jingleActive;
        truckData.sellingActive = data.sellingActive ?? truckData.sellingActive;
        truckData.totalSales = data.totalSales ?? truckData.totalSales;

        renderCatalog();
        if (selectedItemKey) renderInspector(selectedItemKey);
        renderManagement();
    } else if (data.action === 'close') {
        closeUI();
    }
});

// Update Secret Stash UI State
function updateSecretUIState() {
    const weedTab = document.getElementById('weed-tab-btn');
    const hardTab = document.getElementById('hard-drugs-tab-btn');
    const sellTab = document.getElementById('sell-drugs-tab-btn');
    const secretBtn = document.getElementById('secret-toggle-btn');
    const secretText = document.getElementById('secret-btn-text');

    if (isSecretUnlocked) {
        if (weedTab) weedTab.classList.remove('hidden');
        if (hardTab) hardTab.classList.remove('hidden');
        if (sellTab) sellTab.classList.remove('hidden');
        secretBtn.classList.add('unlocked');
        secretText.textContent = 'SMUGGLER STASH: UNLOCKED';
    } else {
        if (weedTab) weedTab.classList.add('hidden');
        if (hardTab) hardTab.classList.add('hidden');
        if (sellTab) sellTab.classList.add('hidden');
        secretBtn.classList.remove('unlocked');
        secretText.textContent = 'SMUGGLER STASH: LOCKED';
        if (activeTab !== 'icecream' && activeTab !== 'management') {
            switchTab('icecream');
        }
    }
}

// Secret Toggle Button Click (Fingerprint Scanner)
document.getElementById('secret-toggle-btn').addEventListener('click', () => {
    playSound('scan');
    isSecretUnlocked = !isSecretUnlocked;
    updateSecretUIState();
});

// Switch Tab Navigation
function switchTab(tabId) {
    playSound('click');
    activeTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });

    const catalogSection = document.getElementById('tab-catalog');
    const sellSection = document.getElementById('tab-sell-drugs');
    const mgmtSection = document.getElementById('tab-management');
    const craftSection = document.getElementById('tab-crafting');

    selectedQuantity = 1;
    updateQtyButtons();

    if (tabId === 'management') {
        catalogSection.classList.add('hidden');
        if (sellSection) sellSection.classList.add('hidden');
        if (craftSection) craftSection.classList.add('hidden');
        mgmtSection.classList.remove('hidden');
        renderManagement();
    } else if (tabId === 'sell_drugs') {
        catalogSection.classList.add('hidden');
        mgmtSection.classList.add('hidden');
        if (craftSection) craftSection.classList.add('hidden');
        if (sellSection) sellSection.classList.remove('hidden');
        renderWholesale();
    } else if (tabId === 'crafting') {
        catalogSection.classList.add('hidden');
        mgmtSection.classList.add('hidden');
        if (sellSection) sellSection.classList.add('hidden');
        if (craftSection) craftSection.classList.remove('hidden');
        initCraftingStation();
    } else {
        catalogSection.classList.remove('hidden');
        if (sellSection) sellSection.classList.add('hidden');
        if (craftSection) craftSection.classList.add('hidden');
        mgmtSection.classList.add('hidden');
        renderCatalog();
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
    });
});

let hudSearchQuery = '';
let hudFilterCategory = 'all';

// Toast Notification Controller
let toastTimeout = null;
function showHudToast(title, desc, icon = '🍦') {
    const toast = document.getElementById('hud-purchase-toast');
    if (!toast) return;

    clearTimeout(toastTimeout);
    document.getElementById('hud-toast-title').textContent = title;
    document.getElementById('hud-toast-desc').textContent = desc;
    document.querySelector('.hud-toast-icon').textContent = icon;

    toast.classList.remove('hidden', 'fade-out');

    toastTimeout = setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3200);
}

// Render Catalog Cards
function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const matchingKeys = [];
    const query = hudSearchQuery.toLowerCase().trim();

    for (const [key, item] of Object.entries(truckData.items)) {
        // Category Filter from Tabs & Chips
        if (activeTab === 'icecream' && item.category !== 'icecream') continue;
        if (activeTab === 'weed' && item.category !== 'weed') continue;
        if (activeTab === 'hard_drugs' && item.category !== 'hard_drugs') continue;

        if (hudFilterCategory === 'cones' && item.category !== 'icecream') continue;
        if (hudFilterCategory === 'edibles' && item.category !== 'weed') continue;
        if (hudFilterCategory === 'illicits' && item.category !== 'hard_drugs') continue;

        // Search Query Filter
        if (query) {
            const labelMatch = (item.label || '').toLowerCase().includes(query);
            const strainMatch = (item.strain || '').toLowerCase().includes(query);
            const descMatch = (item.description || '').toLowerCase().includes(query);
            const typeMatch = (item.type || '').toLowerCase().includes(query);
            if (!labelMatch && !strainMatch && !descMatch && !typeMatch) continue;
        }

        matchingKeys.push(key);

        const stockCount = truckData.stock[key] ?? item.defaultStock ?? 0;
        const price = truckData.prices[key] ?? item.price ?? 10;
        const isSelected = (selectedItemKey === key) || (selectedItemKey === null && matchingKeys.length === 1);

        if (isSelected && selectedItemKey === null) {
            selectedItemKey = key;
        }

        const card = document.createElement('div');
        card.className = `product-card ${selectedItemKey === key ? 'active' : ''}`;
        card.innerHTML = `
            <div class="card-icon-wrap">${item.icon || '🌿'}</div>
            <div class="card-info">
                <h3>${item.label}</h3>
                <div class="card-type-sub">${item.type || item.strain || 'STREET PRODUCT'}</div>
                <div class="card-quick-buy-row">
                    <button class="quick-buy-btn ${stockCount <= 0 ? 'disabled' : ''}" data-buy-qty="1">
                        <i class="fa-solid fa-bolt"></i> BUY 1x ($${price})
                    </button>
                    <button class="quick-buy-btn ${stockCount < 5 ? 'disabled' : ''}" data-buy-qty="5">
                        <i class="fa-solid fa-boxes-stacked"></i> 5x ($${price * 5})
                    </button>
                </div>
            </div>
            <div class="card-price-stock">
                <div class="card-price">$${price}</div>
                <div class="card-stock">STOCK: ${stockCount}</div>
            </div>
        `;

        // Card Select for detailed inspector
        card.addEventListener('click', (e) => {
            if (e.target.closest('.quick-buy-btn')) return;
            playSound('click');
            selectedItemKey = key;
            renderCatalog();
            renderInspector(key);
        });

        // Quick Buy Button Handlers directly on card
        card.querySelectorAll('.quick-buy-btn').forEach(qbBtn => {
            qbBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const qbCount = parseInt(qbBtn.getAttribute('data-buy-qty'), 10) || 1;
                if (stockCount < qbCount) return;

                playSound('buy');
                fetch(`https://${GetParentResourceName()}/buyItem`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ netId: truckData.netId, itemKey: key, count: qbCount })
                });

                showHudToast('QUICK PURCHASE SENT', `Purchased ${qbCount}x ${item.label} for $${price * qbCount}!`, item.icon || '🍦');
            });
        });

        grid.appendChild(card);
    }

    if (matchingKeys.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-box-open" style="font-size: 32px; margin-bottom: 10px; color: #444;"></i>
                <p>No matching products or contraband found in truck freezer.</p>
            </div>
        `;
    }

    if (selectedItemKey && truckData.items[selectedItemKey]) {
        renderInspector(selectedItemKey);
    }
}

// Render Right-Hand 3D Inspector Stage & Dossier
function renderInspector(key) {
    const item = truckData.items[key];
    if (!item) return;

    const stockCount = truckData.stock[key] ?? item.defaultStock ?? 0;
    const price = truckData.prices[key] ?? item.price ?? 10;
    const totalPrice = price * selectedQuantity;

    document.getElementById('inspect-icon').textContent = item.icon || '🌿';
    document.getElementById('inspect-type').textContent = (item.type || item.category || 'PRODUCT').toUpperCase();
    document.getElementById('inspect-title').textContent = item.label;
    document.getElementById('inspect-strain').innerHTML = `<i class="fa-solid fa-dna"></i> Strain/Genetics: ${item.strain || 'Standard Street Grade'}`;
    document.getElementById('inspect-price').textContent = `$${price}`;
    document.getElementById('inspect-desc').textContent = item.description || 'No description available.';

    // Potency
    document.getElementById('inspect-potency-val').textContent = item.potency || 'Standard Potency';
    document.getElementById('inspect-potency-fill').style.width = `${item.potencyPct || 70}%`;

    // Pharmacology Buff Chips
    const chipsContainer = document.getElementById('inspect-effects-chips');
    chipsContainer.innerHTML = '';
    const effects = item.effects || ["Standard Street High", "Stress Relief -50%"];
    effects.forEach(eff => {
        const chip = document.createElement('span');
        chip.className = 'effect-chip';
        chip.innerHTML = `<i class="fa-solid fa-sparkles"></i> ${eff}`;
        chipsContainer.appendChild(chip);
    });

    // Purchase Button
    const buyBtn = document.getElementById('inspect-purchase-btn');
    const buyText = document.getElementById('purchase-btn-text');

    if (stockCount <= 0) {
        buyBtn.disabled = true;
        buyText.textContent = 'SOLD OUT IN FREEZER';
    } else if (stockCount < selectedQuantity) {
        buyBtn.disabled = true;
        buyText.textContent = `INSUFFICIENT STOCK (${stockCount} REMAINING)`;
    } else {
        buyBtn.disabled = false;
        buyText.textContent = `PURCHASE (${selectedQuantity}x) • $${totalPrice.toLocaleString()}`;
    }
}

// Quantity Selector Buttons
document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        selectedQuantity = parseInt(btn.getAttribute('data-qty'), 10) || 1;
        updateQtyButtons();
        if (selectedItemKey) renderInspector(selectedItemKey);
    });
});

function updateQtyButtons() {
    document.querySelectorAll('.qty-btn').forEach(btn => {
        const q = parseInt(btn.getAttribute('data-qty'), 10);
        btn.classList.toggle('active', q === selectedQuantity);
    });
}

// Purchase Click (Inspector Primary Buy Button)
document.getElementById('inspect-purchase-btn').addEventListener('click', () => {
    if (!selectedItemKey) return;
    const item = truckData.items[selectedItemKey];
    if (!item) return;

    const unitPrice = truckData.prices[selectedItemKey] ?? item.price ?? 10;
    const totalCost = unitPrice * selectedQuantity;

    playSound('buy');
    fetch(`https://${GetParentResourceName()}/buyItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            netId: truckData.netId,
            itemKey: selectedItemKey,
            count: selectedQuantity
        })
    });

    showHudToast('PURCHASE DISPATCHED', `Ordered ${selectedQuantity}x ${item.label} for $${totalCost.toLocaleString()}!`, item.icon || '🍦');
});

// Search Input Listener
const searchInput = document.getElementById('hud-search-input');
const clearSearchBtn = document.getElementById('hud-clear-search-btn');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        hudSearchQuery = e.target.value;
        if (clearSearchBtn) {
            clearSearchBtn.classList.toggle('hidden', !hudSearchQuery);
        }
        renderCatalog();
    });
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        hudSearchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderCatalog();
    });
}

// Category Filter Chips
document.querySelectorAll('.hud-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
        playSound('click');
        document.querySelectorAll('.hud-chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        hudFilterCategory = chip.getAttribute('data-filter') || 'all';
        renderCatalog();
    });
});

// Render Wholesale Drug Selling Grid
function renderWholesale() {
    const grid = document.getElementById('sell-drugs-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const wholesaleItems = truckData.wholesale || {};

    for (const [key, item] of Object.entries(wholesaleItems)) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'stretch';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-size: 32px;">${item.icon || '🌿'}</div>
                <div style="color: var(--munchies-green); font-weight: 900; font-size: 15px;">+$${item.payout} EA</div>
            </div>
            <h3 style="font-size: 15px; margin-bottom: 2px;">${item.label}</h3>
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">${item.type || 'RAW PRODUCT'}</div>
            <p style="font-size: 12px; color: var(--munchies-cream); margin-bottom: 14px;">${item.description || ''}</p>
            <div style="margin-top: auto; display: flex; gap: 8px;">
                <button class="sell-action-btn" data-item="${key}" data-qty="1">
                    <i class="fa-solid fa-hand-holding-dollar"></i> SELL 1x ($${item.payout})
                </button>
                <button class="sell-action-btn" data-item="${key}" data-qty="5" style="background: linear-gradient(135deg, var(--munchies-purple), #4a154b); color: #fff;">
                    SELL 5x ($${item.payout * 5})
                </button>
            </div>
        `;

        card.querySelectorAll('.sell-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                playSound('buy');
                const qty = parseInt(btn.getAttribute('data-qty'), 10) || 1;
                sellWholesaleDrug(key, qty);
            });
        });

        grid.appendChild(card);
    }
}

function sellWholesaleDrug(itemKey, count) {
    fetch(`https://${GetParentResourceName()}/sellWholesale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ netId: truckData.netId, itemKey: itemKey, count: count })
    });
}

// Render Management Panel
function renderManagement() {
    document.getElementById('total-sales-stat').textContent = `$${truckData.totalSales.toLocaleString()}`;

    const jingleBtn = document.getElementById('toggle-jingle-btn');
    const jingleText = document.getElementById('jingle-btn-text');
    if (truckData.jingleActive) {
        jingleBtn.classList.add('active');
        jingleText.textContent = 'STOP JINGLE CHIME';
    } else {
        jingleBtn.classList.remove('active');
        jingleText.textContent = 'START JINGLE CHIME';
    }

    const sellBtn = document.getElementById('toggle-selling-btn');
    const sellText = document.getElementById('selling-btn-text');
    if (truckData.sellingActive) {
        sellBtn.classList.add('active');
        sellText.textContent = 'PAUSE SELLING MODE';
    } else {
        sellBtn.classList.remove('active');
        sellText.textContent = 'ENABLE SELLING MODE';
    }

    const tbody = document.getElementById('stock-table-body');
    tbody.innerHTML = '';

    for (const [key, item] of Object.entries(truckData.items)) {
        const stockCount = truckData.stock[key] ?? item.defaultStock ?? 0;
        const price = truckData.prices[key] ?? item.price ?? 10;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.icon || ''} ${item.label}</strong></td>
            <td><span style="color: var(--munchies-green); font-weight: 800;">${(item.category || '').toUpperCase()}</span></td>
            <td><span class="stock-count">${stockCount}</span></td>
            <td>$${price}</td>
            <td>
                <button class="stock-restock-btn" data-item="${key}">
                    <i class="fa-solid fa-plus"></i> +10 Stock
                </button>
            </td>
        `;

        row.querySelector('.stock-restock-btn').addEventListener('click', () => {
            playSound('buy');
            restockItem(key, 10);
        });

        tbody.appendChild(row);
    }
}

function restockItem(itemId, count) {
    fetch(`https://${GetParentResourceName()}/depositStock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ netId: truckData.netId, itemId: itemId, count: count })
    });
}

document.getElementById('toggle-jingle-btn').addEventListener('click', () => {
    playSound('click');
    truckData.jingleActive = !truckData.jingleActive;
    fetch(`https://${GetParentResourceName()}/toggleJingle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ netId: truckData.netId, state: truckData.jingleActive })
    });
});

document.getElementById('toggle-selling-btn').addEventListener('click', () => {
    playSound('click');
    truckData.sellingActive = !truckData.sellingActive;
    fetch(`https://${GetParentResourceName()}/toggleSelling`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ netId: truckData.netId, state: truckData.sellingActive })
    });
});

let curLivery = 0;

function updateLiveryDisplay() {
    document.getElementById('cur-livery-num').textContent = curLivery;
    fetch(`https://${GetParentResourceName()}/setTruckLivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ netId: truckData.netId, livery: curLivery })
    });
}

document.getElementById('prev-livery-btn').addEventListener('click', () => {
    playSound('click');
    curLivery = Math.max(0, curLivery - 1);
    updateLiveryDisplay();
});

document.getElementById('next-livery-btn').addEventListener('click', () => {
    playSound('click');
    curLivery = curLivery + 1;
    updateLiveryDisplay();
});

document.getElementById('apply-munchies-livery-btn').addEventListener('click', () => {
    playSound('buy');
    updateLiveryDisplay();
});

function closeUI() {
    playSound('click');
    document.getElementById('truck-app').classList.add('hidden');
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

// ==============================================================================
// REALISTIC SOFT SERVE CREATION STATION LOGIC
// ==============================================================================
let craftFlavor = 'mint';
let pourProgress = 0;
let isPouring = false;
let pourInterval = null;
let addedSyrups = [];
let addedToppings = [];

function initCraftingStation() {
    setupSyrupCanvas();
    updateCraftingSummary();
}

function setupSyrupCanvas() {
    const sCanvas = document.getElementById('syrup-canvas');
    if (!sCanvas) return;
    sCanvas.width = 130;
    sCanvas.height = 190;
}

// Select Flavor
document.querySelectorAll('.flavor-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        playSound('click');
        craftFlavor = pill.getAttribute('data-flavor');
        document.querySelectorAll('.flavor-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyFlavorToSwirl();
        updateCraftingSummary();
    });
});

// Pull Lever to select & pour
document.querySelectorAll('.lever-arm-wrap').forEach(lever => {
    lever.addEventListener('mousedown', () => {
        const flav = lever.getAttribute('data-flavor');
        craftFlavor = flav;
        document.querySelectorAll('.flavor-pill').forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-flavor') === flav);
        });
        applyFlavorToSwirl();
        lever.classList.add('pulled');
        startPouring();
    });

    lever.addEventListener('mouseup', () => {
        lever.classList.remove('pulled');
        stopPouring();
    });

    lever.addEventListener('mouseleave', () => {
        lever.classList.remove('pulled');
        stopPouring();
    });
});

function applyFlavorToSwirl() {
    const layers = document.querySelectorAll('.swirl-layer');
    layers.forEach(layer => {
        layer.className = 'swirl-layer';
        if (layer.id === 'swirl-base') layer.classList.add('l-base');
        else if (layer.id === 'swirl-mid') layer.classList.add('l-mid');
        else if (layer.id === 'swirl-top') layer.classList.add('l-top');
        else if (layer.id === 'swirl-tip') layer.classList.add('l-tip');

        if (craftFlavor === 'mint') layer.classList.add('mint-flavor');
        else if (craftFlavor === 'chocolate') layer.classList.add('chocolate-flavor');
        else if (craftFlavor === 'swirl') layer.classList.add('swirl-flavor');
    });
}

// Hold to Pour Button
const pourBtn = document.getElementById('pour-hold-btn');
if (pourBtn) {
    pourBtn.addEventListener('mousedown', startPouring);
    pourBtn.addEventListener('mouseup', stopPouring);
    pourBtn.addEventListener('mouseleave', stopPouring);
}

function startPouring() {
    if (isPouring || pourProgress >= 100) return;
    isPouring = true;
    playSound('scan');

    const stream = document.getElementById('cream-stream');
    if (stream) stream.classList.remove('hidden');

    pourInterval = setInterval(() => {
        pourProgress = Math.min(100, pourProgress + 4);
        document.getElementById('pour-progress-bar').style.width = `${pourProgress}%`;

        // Reveal Swirl Layers Progressively
        if (pourProgress >= 20) document.getElementById('swirl-base').classList.remove('hidden');
        if (pourProgress >= 50) document.getElementById('swirl-mid').classList.remove('hidden');
        if (pourProgress >= 75) document.getElementById('swirl-top').classList.remove('hidden');
        if (pourProgress >= 95) document.getElementById('swirl-tip').classList.remove('hidden');

        if (pourProgress >= 100) {
            stopPouring();
            playSound('click');
        }
    }, 60);
}

function stopPouring() {
    if (!isPouring) return;
    isPouring = false;
    if (pourInterval) clearInterval(pourInterval);
    const stream = document.getElementById('cream-stream');
    if (stream) stream.classList.add('hidden');
}

// Reset Cone
document.getElementById('reset-cone-btn').addEventListener('click', () => {
    playSound('click');
    pourProgress = 0;
    addedSyrups = [];
    addedToppings = [];

    document.getElementById('pour-progress-bar').style.width = '0%';
    document.querySelectorAll('.swirl-layer').forEach(l => l.classList.add('hidden'));
    document.getElementById('cone-cherry').classList.add('hidden');

    const sCanvas = document.getElementById('syrup-canvas');
    if (sCanvas) {
        const ctx = sCanvas.getContext('2d');
        ctx.clearRect(0, 0, sCanvas.width, sCanvas.height);
    }

    updateCraftingSummary();
});

// Squeeze Syrups
document.querySelectorAll('.syrup-bottle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (pourProgress < 40) return;
        playSound('click');
        const syrupType = btn.getAttribute('data-syrup');
        if (!addedSyrups.includes(syrupType)) addedSyrups.push(syrupType);
        drawSyrupDrizzle(syrupType);
        updateCraftingSummary();
    });
});

function drawSyrupDrizzle(syrupType) {
    const sCanvas = document.getElementById('syrup-canvas');
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');

    let color = '#3e2723';
    if (syrupType === 'strawberry') color = '#c2185b';
    else if (syrupType === 'thc_honey') color = '#2e7d32';
    else if (syrupType === 'caramel') color = '#ff8f00';

    sCtx.strokeStyle = color;
    sCtx.lineWidth = 4;
    sCtx.lineCap = 'round';
    sCtx.beginPath();

    for (let i = 0; i < 4; i++) {
        const startX = 35 + Math.random() * 60;
        const startY = 40 + Math.random() * 50;
        sCtx.moveTo(startX, startY);
        sCtx.quadraticCurveTo(startX + (Math.random() - 0.5) * 20, startY + 25, startX + (Math.random() - 0.5) * 10, startY + 45);
    }
    sCtx.stroke();
}

// Toppings
document.querySelectorAll('.topping-jar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (pourProgress < 40) return;
        playSound('click');
        const topping = btn.getAttribute('data-topping');

        if (topping === 'cherry') {
            document.getElementById('cone-cherry').classList.remove('hidden');
        } else {
            drawSprinkles(topping);
        }

        if (!addedToppings.includes(topping)) addedToppings.push(topping);
        updateCraftingSummary();
    });
});

function drawSprinkles(type) {
    const sCanvas = document.getElementById('syrup-canvas');
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');

    for (let i = 0; i < 16; i++) {
        const x = 35 + Math.random() * 60;
        const y = 35 + Math.random() * 65;

        if (type === 'sprinkles') {
            const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#a855f7', '#22c55e'];
            sCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            sCtx.fillRect(x, y, 5, 2);
        } else if (type === 'oreo') {
            sCtx.fillStyle = '#1e1b18';
            sCtx.beginPath();
            sCtx.arc(x, y, 2 + Math.random() * 2, 0, Math.PI * 2);
            sCtx.fill();
        } else if (type === 'peanuts') {
            sCtx.fillStyle = '#d97706';
            sCtx.beginPath();
            sCtx.arc(x, y, 2.5, 0, Math.PI * 2);
            sCtx.fill();
        }
    }
}

function updateCraftingSummary() {
    let name = "VAINILLA WAFFLE CONE";
    if (craftFlavor === 'mint') name = "MINT THC CANNABIS CONE";
    else if (craftFlavor === 'chocolate') name = "DUTCH CHOCOLATE CONE";
    else if (craftFlavor === 'swirl') name = "DUAL TWIST THC SWIRL";

    document.getElementById('craft-summary-name').textContent = name;

    const list = document.getElementById('craft-ingredients-list');
    list.innerHTML = '<span class="ingredient-tag">Crispy Waffle Cone</span>';

    if (pourProgress >= 20) {
        const fTag = document.createElement('span');
        fTag.className = 'ingredient-tag';
        fTag.textContent = `${craftFlavor.toUpperCase()} Cream`;
        list.appendChild(fTag);
    }

    addedSyrups.forEach(s => {
        const tag = document.createElement('span');
        tag.className = 'ingredient-tag';
        tag.textContent = s === 'thc_honey' ? '50mg THC Distillate' : `${s.toUpperCase()} Drizzle`;
        list.appendChild(tag);
    });

    addedToppings.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'ingredient-tag';
        tag.textContent = t.toUpperCase();
        list.appendChild(tag);
    });
}

// Serve Customer / Pack
document.getElementById('serve-customer-btn').addEventListener('click', () => {
    if (pourProgress < 50) return;
    playSound('buy');

    fetch(`https://${GetParentResourceName()}/craftIceCream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            flavor: craftFlavor,
            syrups: addedSyrups,
            toppings: addedToppings
        })
    });

    // Reset cone
    document.getElementById('reset-cone-btn').click();
});
