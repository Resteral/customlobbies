let currentSlots = {};
let itemsConfig = {};
let equipmentConfig = {};
let maxWeight = 12.0;
let hasBackpack = false;
let draggedSlot = null;
let currentStats = { strength: 60, stamina: 70 };

const app = document.getElementById('app');
const weightText = document.getElementById('weight-text');
const weightBarFill = document.getElementById('weight-bar-fill');
const holster201 = document.getElementById('holster-201');
const holsterContent201 = document.getElementById('holster-content-201');
const holster202 = document.getElementById('holster-202');
const holsterContent202 = document.getElementById('holster-content-202');
const utility302 = document.getElementById('utility-302');

const slotsTopLeft = document.getElementById('slots-top-left');
const slotsTopRight = document.getElementById('slots-top-right');
const slotsBottomLeft = document.getElementById('slots-bottom-left');
const slotsBottomRight = document.getElementById('slots-bottom-right');
const backpackGrid = document.getElementById('backpack-grid');
const backpackBadge = document.getElementById('backpack-badge');
const tooltip = document.getElementById('tooltip');

const statStrLevel = document.getElementById('stat-str-level');
const statStrFill = document.getElementById('stat-str-fill');
const statStrBonus = document.getElementById('stat-str-bonus');
const statStaLevel = document.getElementById('stat-sta-level');
const statStaFill = document.getElementById('stat-sta-fill');
const statStaBonus = document.getElementById('stat-sta-bonus');

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
        closeUI();
    }
});

function closeUI() {
    app.classList.add('hidden');
    tooltip.classList.add('hidden');
    fetch(`https://${GetParentResourceName()}/closeUI`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.action === "open") {
        itemsConfig = data.itemsConfig || {};
        equipmentConfig = data.equipmentConfig || {};
        maxWeight = data.maxWeight || 12.0;
        currentSlots = data.slots || {};
        currentStats = data.stats || { strength: 60, stamina: 70 };
        hasBackpack = data.hasBackpack || false;
        renderInventory(data.totalWeight || 0.0);
        app.classList.remove('hidden');
    } else if (data.action === "close") {
        app.classList.add('hidden');
        tooltip.classList.add('hidden');
    } else if (data.action === "update") {
        currentSlots = data.slots || {};
        currentStats = data.stats || { strength: 60, stamina: 70 };
        hasBackpack = data.hasBackpack || false;
        maxWeight = data.maxWeight || 12.0;
        renderInventory(data.totalWeight || 0.0);
    } else if (data.action === "notification") {
        showNotification(data.message, data.type);
    }
});

function renderInventory(totalWeight) {
    renderRPGStats();

    weightText.innerText = `${totalWeight.toFixed(1)} / ${maxWeight.toFixed(1)} KG`;
    const pct = Math.min((totalWeight / maxWeight) * 100, 100);
    weightBarFill.style.width = `${pct}%`;

    renderEquipmentPaperdoll();

    renderHolsterSlot(holster201, holsterContent201, 201, "PRIMARY SIDEARM [H]");
    renderHolsterSlot(holster202, holsterContent202, 202, "CONCEALED SIDEARM [J]");

    renderUtilitySlot(utility302, 302, "LEATHER WALLET / CASH");

    renderPocketGroup(slotsTopLeft, [1, 2]);
    renderPocketGroup(slotsTopRight, [3, 4]);
    renderPocketGroup(slotsBottomLeft, [5, 6]);
    renderPocketGroup(slotsBottomRight, [7, 8]);

    renderBackpackGrid();
}

function renderRPGStats() {
    const strLvl = currentStats.strength || 60;
    const staLvl = currentStats.stamina || 70;

    if (statStrLevel) statStrLevel.innerText = `LVL ${strLvl}`;
    if (statStrFill) statStrFill.style.width = `${strLvl}%`;
    if (statStrBonus) statStrBonus.innerText = `+${(strLvl * 0.15).toFixed(1)} KG`;

    if (statStaLevel) statStaLevel.innerText = `LVL ${staLvl}`;
    if (statStaFill) statStaFill.style.width = `${staLvl}%`;
    if (statStaBonus) statStaBonus.innerText = `+${Math.floor((staLvl / 100) * 50)}%`;
}

function renderEquipmentPaperdoll() {
    [101, 102, 103, 104, 105, 106, 107, 108].forEach(slotNum => {
        const slotEl = document.getElementById(`equip-${slotNum}`);
        if (!slotEl) return;

        const itemData = currentSlots[slotNum];
        const defaultConfig = equipmentConfig[slotNum] || { label: "EQUIPMENT SLOT", icon: "👕" };

        slotEl.innerHTML = `<span class="slot-type-badge">${defaultConfig.icon} ${defaultConfig.label}</span>`;

        if (itemData && itemData.name) {
            const config = itemsConfig[itemData.name] || { label: itemData.name, weight: 0.5 };
            const label = document.createElement('div');
            label.className = 'item-label';
            label.innerText = config.label;
            slotEl.appendChild(label);

            slotEl.draggable = true;
            slotEl.ondragstart = () => { draggedSlot = slotNum; };
            slotEl.onmouseenter = (e) => showTooltip(e, config);
            slotEl.onmouseleave = hideTooltip;
        } else {
            slotEl.draggable = false;
        }

        attachSlotDragOverDrop(slotEl, slotNum);
    });
}

function renderHolsterSlot(slotEl, contentEl, slotNum, placeholderText) {
    if (!slotEl || !contentEl) return;
    contentEl.innerHTML = '';
    const itemData = currentSlots[slotNum];

    if (itemData && itemData.name) {
        slotEl.classList.add('occupied');
        const config = itemsConfig[itemData.name] || { label: itemData.name, weight: 1.5 };
        
        const label = document.createElement('div');
        label.className = 'item-label';
        label.innerText = `🔫 ${config.label}`;
        contentEl.appendChild(label);

        slotEl.draggable = true;
        slotEl.ondragstart = () => { draggedSlot = slotNum; };
        slotEl.onmouseenter = (e) => showTooltip(e, config);
        slotEl.onmouseleave = hideTooltip;
    } else {
        slotEl.classList.remove('occupied');
        contentEl.innerHTML = `
            <span class="holster-icon">🔫</span>
            <span class="holster-text">${placeholderText}</span>
        `;
        slotEl.draggable = false;
    }

    attachSlotDragOverDrop(slotEl, slotNum);
}

function renderUtilitySlot(slotEl, slotNum, placeholderText) {
    if (!slotEl) return;
    slotEl.innerHTML = '';
    const itemData = currentSlots[slotNum];

    if (itemData && itemData.name) {
        const config = itemsConfig[itemData.name] || { label: itemData.name, weight: 0.2 };
        
        const label = document.createElement('div');
        label.className = 'item-label';
        label.innerText = config.label;
        slotEl.appendChild(label);

        slotEl.draggable = true;
        slotEl.ondragstart = () => { draggedSlot = slotNum; };
        slotEl.onmouseenter = (e) => showTooltip(e, config);
        slotEl.onmouseleave = hideTooltip;
    } else {
        slotEl.innerHTML = `<span class="utility-placeholder">${placeholderText}</span>`;
        slotEl.draggable = false;
    }

    attachSlotDragOverDrop(slotEl, slotNum);
}

function renderPocketGroup(containerEl, slotNumbers) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    slotNumbers.forEach(slotNum => {
        const slotEl = createSlotElement(slotNum);
        containerEl.appendChild(slotEl);
    });
}

function renderBackpackGrid() {
    if (!backpackGrid) return;
    backpackGrid.innerHTML = '';
    if (hasBackpack) {
        backpackGrid.classList.remove('locked');
        if (backpackBadge) {
            backpackBadge.className = 'backpack-status-badge active';
            backpackBadge.innerText = 'OPEN BACKPACK (+16 SLOTS)';
        }
    } else {
        backpackGrid.classList.add('locked');
        if (backpackBadge) {
            backpackBadge.className = 'backpack-status-badge inactive';
            backpackBadge.innerText = 'NO BACKPACK';
        }
    }

    for (let i = 9; i <= 24; i++) {
        const slotEl = createSlotElement(i);
        backpackGrid.appendChild(slotEl);
    }
}

function createSlotElement(slotNum) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.slot = slotNum;

    const itemData = currentSlots[slotNum];
    if (itemData && itemData.name) {
        const config = itemsConfig[itemData.name] || { label: itemData.name, weight: 0.1, description: '' };

        const label = document.createElement('div');
        label.className = 'item-label';
        label.innerText = config.label;

        if (itemData.amount > 1) {
            const count = document.createElement('div');
            count.className = 'item-count';
            count.innerText = `x${itemData.amount}`;
            slot.appendChild(count);
        }

        slot.appendChild(label);
        slot.draggable = true;

        slot.addEventListener('mouseenter', (e) => showTooltip(e, config));
        slot.addEventListener('mouseleave', hideTooltip);

        slot.addEventListener('dblclick', () => {
            fetch(`https://${GetParentResourceName()}/useItem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slot: slotNum })
            });
        });
    }

    attachSlotDragOverDrop(slot, slotNum);
    return slot;
}

function attachSlotDragOverDrop(slotElement, slotNum) {
    slotElement.addEventListener('dragstart', () => {
        draggedSlot = slotNum;
    });

    slotElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotElement.classList.add('drag-over');
    });

    slotElement.addEventListener('dragleave', () => {
        slotElement.classList.remove('drag-over');
    });

    slotElement.addEventListener('drop', (e) => {
        e.preventDefault();
        slotElement.classList.remove('drag-over');
        const fromSlot = draggedSlot;
        const toSlot = slotNum;

        if (fromSlot !== null && toSlot !== null && fromSlot !== toSlot) {
            const draggedItem = currentSlots[fromSlot];
            if (draggedItem) {
                const itemDef = itemsConfig[draggedItem.name];

                if (toSlot === 201 || toSlot === 202) {
                    if (!itemDef || !itemDef.isWeapon) {
                        showNotification('Only sidearms can be holstered here!', 'error');
                        return;
                    }
                }
                if (toSlot === 302 && (!itemDef || !itemDef.isWallet)) {
                    showNotification('Only wallets fit in the wallet pocket!', 'error');
                    return;
                }
                if (toSlot >= 101 && toSlot <= 108 && (!itemDef || itemDef.equipSlot !== toSlot)) {
                    showNotification('Invalid clothing type for this paperdoll slot!', 'error');
                    return;
                }
            }

            fetch(`https://${GetParentResourceName()}/moveItem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromSlot, toSlot, amount: 1 })
            });
        }
        draggedSlot = null;
    });
}

function showTooltip(e, config) {
    document.getElementById('tooltip-name').innerText = config.label;
    document.getElementById('tooltip-weight').innerText = `${config.weight} KG`;
    document.getElementById('tooltip-desc').innerText = config.description || 'No description available.';

    tooltip.style.left = `${e.clientX + 15}px`;
    tooltip.style.top = `${e.clientY + 15}px`;
    tooltip.classList.remove('hidden');
}

function hideTooltip() {
    tooltip.classList.add('hidden');
}

function showNotification(message, type) {
    const container = document.getElementById('notifications');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3200);
}
