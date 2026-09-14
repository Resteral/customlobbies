let currentCoords = { x: 0, y: 0, z: 0 };
let activeBusinessesCache = {};
let currentActiveZoneId = null;

let lastRep = null;
let lastRepLevel = null;
let hudAutoHideTimer = null;
let isCursorOpen = false;

function showLevelUpToast(title, sub, badge, isLevelUp) {
    const toast = document.getElementById('turf-level-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastSub = document.getElementById('toast-sub');
    const toastBadge = document.getElementById('toast-gain-badge');
    const toastIcon = document.getElementById('toast-icon');

    toastTitle.textContent = title;
    toastSub.textContent = sub;
    toastBadge.textContent = badge;
    toastIcon.className = isLevelUp ? 'fa-solid fa-crown' : 'fa-solid fa-shield-halved';

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4500);
}

function expandFullHUD() {
    document.getElementById('turf-hud').classList.remove('hidden');
    document.getElementById('turf-mini-pill').classList.add('hidden');
    resetHUDAutoHideTimer();
}

function collapseToMiniPill() {
    if (isCursorOpen) return;
    document.getElementById('turf-hud').classList.add('hidden');
    document.getElementById('turf-mini-pill').classList.remove('hidden');
}

function resetHUDAutoHideTimer() {
    if (hudAutoHideTimer) clearTimeout(hudAutoHideTimer);
    hudAutoHideTimer = setTimeout(() => {
        collapseToMiniPill();
    }, 7000);
}

function showUIPopup(title, desc, type, badge, icon) {
    const container = document.getElementById('ui-popup-container');
    if (!container) return;

    const card = document.createElement('div');
    card.className = `ui-popup-card ${type || 'inform'}`;
    
    let iconClass = icon || 'fa-solid fa-bell';
    if (!iconClass.includes('fa-')) iconClass = 'fa-solid ' + iconClass;

    card.innerHTML = `
        <div class="pop-icon-wrap"><i class="${iconClass}"></i></div>
        <div class="pop-content">
            <span class="pop-title">${title}</span>
            <span class="pop-desc">${desc}</span>
        </div>
        ${badge ? `<span class="pop-badge">${badge}</span>` : ''}
    `;

    container.appendChild(card);

    setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (card.parentNode) card.parentNode.removeChild(card);
        }, 400);
    }, 4500);
}

window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.action === 'showUIPopup') {
        showUIPopup(data.title, data.description, data.type, data.badge, data.icon);
    }

    if (data.action === 'updateTurfHUD') {
        const hud = document.getElementById('turf-hud');
        currentActiveZoneId = data.zoneId;

        const titleText = (data.label || "COMMERCIAL PREMISE").toUpperCase();
        document.getElementById('turf-title').textContent = titleText;
        document.getElementById('mini-title').textContent = titleText;
        document.getElementById('crew-name').textContent = (data.owner || "UNCLAIMED").toUpperCase();

        // Update Above Mini-Map Territory & Syndicate Radar Pill
        const radarBanner = document.getElementById('turf-radar-banner');
        if (radarBanner) {
            radarBanner.classList.remove('hidden');
            document.getElementById('radar-zone-title').textContent = titleText;
            document.getElementById('radar-street-txt').textContent = (data.streetName || "LOS SANTOS").toUpperCase();
            document.getElementById('radar-owner-tag').textContent = (data.ownerCrewTag || data.owner || "UNCLAIMED").toUpperCase();
            document.getElementById('radar-protect-tag').textContent = (data.protectorCrewTag || data.owner || "NONE").toUpperCase();
        }

        // Protection Rep (0 - 100%)
        const rep = data.protectionRep ?? 25;
        const repFill = document.getElementById('rep-fill');
        const repVal = document.getElementById('rep-val');

        repFill.style.width = `${rep}%`;
        let repLevel = "Level 1 Vulnerable";
        let levelNum = 1;
        if (rep >= 100) { repLevel = "Level 5 Fortress"; levelNum = 5; }
        else if (rep >= 75) { repLevel = "Level 4 Fortified"; levelNum = 4; }
        else if (rep >= 50) { repLevel = "Level 3 Guarded"; levelNum = 3; }
        else if (rep >= 25) { repLevel = "Level 2 Established"; levelNum = 2; }

        repVal.textContent = `${rep}% (${repLevel})`;
        document.getElementById('mini-rep').textContent = `${rep}% REP (LVL ${levelNum})`;
        const radarRepBadge = document.getElementById('radar-rep-badge');
        if (radarRepBadge) radarRepBadge.textContent = `${rep}% REP (LVL ${levelNum})`;

        // Executive KPI Overview Bar Updates
        const kpiVault = document.getElementById('kpi-vault-val');
        if (kpiVault) kpiVault.textContent = `$${(data.vaultCash || 0).toLocaleString()} CASH`;
        const kpiRep = document.getElementById('kpi-rep-val');
        if (kpiRep) kpiRep.textContent = `${rep}% (LVL ${levelNum})`;
        const kpiSupply = document.getElementById('kpi-supply-val');
        if (kpiSupply) kpiSupply.textContent = `${data.supplies || 100}% RESTOCKED`;

        // Job Limit Badge (0/2 Active)
        const jobLimitBadge = document.getElementById('jobs-limit-badge');
        if (jobLimitBadge) {
            jobLimitBadge.textContent = `${data.activeJobs || 0}/${data.maxJobs || 2} JOBS ACTIVE`;
            jobLimitBadge.style.borderColor = (data.activeJobs || 0) >= 2 ? 'var(--red-alert)' : 'var(--turf-cyan)';
            jobLimitBadge.style.color = (data.activeJobs || 0) >= 2 ? 'var(--red-alert)' : 'var(--turf-cyan)';
        }

        // Points Accumulation Live Indicator
        const accumBar = document.getElementById('rep-accum-bar');
        const accumText = document.getElementById('accum-text');
        const miniPointDot = document.getElementById('mini-point-dot');
        const miniPointTxt = document.getElementById('mini-point-txt');

        if (data.isEarningRep) {
            const remSecs = data.repGainRemaining || 300;
            const mins = Math.floor(remSecs / 60);
            const secs = remSecs % 60;
            const timeStr = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

            if (accumBar) accumBar.classList.remove('hidden');
            if (accumText) accumText.innerHTML = `⚡ <strong>EARNING DEFENSE POINTS</strong> &bull; +1 REP IN ${timeStr}`;
            if (miniPointDot) miniPointDot.classList.remove('hidden');
            if (miniPointTxt) miniPointTxt.textContent = `+1 PT IN ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        } else {
            if (accumBar) accumBar.classList.add('hidden');
            if (miniPointDot) miniPointDot.classList.add('hidden');
            if (miniPointTxt) miniPointTxt.textContent = rep >= 100 ? 'MAX FORTRESS' : 'CONTESTED';
        }

        // Supply Chain / Raw Material Meter
        const supplies = data.supplies ?? 100;
        const suppliesFill = document.getElementById('supplies-fill');
        const suppliesVal = document.getElementById('supplies-val');
        if (suppliesFill && suppliesVal) {
            suppliesFill.style.width = `${supplies}%`;
            if (supplies >= 80) {
                suppliesVal.textContent = `${supplies}% (Optimal +35% Boost)`;
                suppliesVal.style.color = 'var(--success)';
            } else if (supplies > 0) {
                suppliesVal.textContent = `${supplies}% (Standard Yield)`;
                suppliesVal.style.color = 'var(--amber)';
            } else {
                suppliesVal.textContent = `0% (DEPLETED -60% Penalty!)`;
                suppliesVal.style.color = 'var(--red-alert)';
            }
        }

        // Check if Rep increased or Level Up occurred!
        if (lastRep !== null) {
            if (rep > lastRep) {
                const diff = rep - lastRep;
                const isLvlUp = (lastRepLevel !== null && repLevel !== lastRepLevel);
                if (isLvlUp) {
                    showLevelUpToast(`⭐ DEFENSE LEVEL UP: ${repLevel.toUpperCase()}!`, `${data.label} fortified to ${rep}%! Payout boost active.`, `LEVEL ${levelNum}`, true);
                } else {
                    showLevelUpToast(`🛡️ PROTECTION REP GAINED!`, `Standing on premise: +${diff}% Rep (${rep}% total).`, `+${diff}% REP`, false);
                }
                expandFullHUD();
            }
        }
        lastRep = rep;
        lastRepLevel = repLevel;

        // Passive Payout & Multiplier
        const payoutVal = document.getElementById('payout-val');
        const mult = data.repMultiplier || 1.0;
        const projected = data.projectedPayout || 150;
        payoutVal.innerHTML = `+$${projected} / min <small>(${mult.toFixed(1)}x Boost)</small>`;

        // Import & Export Logistics Metrics
        const elImports = document.getElementById('hud-imports-val');
        const elExports = document.getElementById('hud-exports-val');
        const elVolume = document.getElementById('hud-volume-val');

        if (elImports) elImports.textContent = data.importsCount ?? 0;
        if (elExports) elExports.textContent = data.exportsCount ?? 0;
        if (elVolume) elVolume.textContent = `$${((data.tradeVolume || 0)).toLocaleString()}`;

        // Raw Crafting Materials Stash
        if (data.materials) {
            for (const [mat, count] of Object.entries(data.materials)) {
                const el = document.getElementById(`mat-${mat}-val`);
                if (el) el.textContent = count;
            }
        }

        // Bank Connection & On-Site Vault Status
        const bankStatusVal = document.getElementById('bank-status-val');
        const vaultCashVal = document.getElementById('vault-cash-val');
        const bankSubLbl = document.getElementById('bank-sub-lbl');

        if (data.bankConnected) {
            bankStatusVal.textContent = `ACTIVE (${Math.ceil((data.bankSecondsRemaining || 0) / 60)}m Left) 🏦`;
            bankStatusVal.style.color = 'var(--success)';
        } else {
            bankStatusVal.textContent = 'NO ACTIVE TIES ❌';
            bankStatusVal.style.color = 'var(--red-alert)';
        }

        const vCash = data.vaultCash || 0;
        vaultCashVal.textContent = `$${vCash.toLocaleString()} CASH`;

        // Mission Dispatch Board (Visible for Owners)
        const missionBoard = document.getElementById('mission-board-section');
        const guardTitleLbl = document.getElementById('guard-title-lbl');
        const guardCostLbl = document.getElementById('guard-cost-lbl');

        if (data.isOwner) {
            missionBoard.classList.remove('hidden');
            if (data.bankConnected) {
                bankSubLbl.textContent = `DEPOSIT $${vCash.toLocaleString()} (+20% BONUS)`;
            } else {
                bankSubLbl.textContent = `DELIVER $${vCash.toLocaleString()} TO RENEW TIES`;
            }

            const gLvl = data.guardLevel || 0;
            if (gLvl >= 3) {
                guardTitleLbl.textContent = 'ELITE GUARDS (MAX)';
                guardCostLbl.textContent = 'ACTIVE DEFENSE';
            } else if (gLvl === 2) {
                guardTitleLbl.textContent = 'HIRE BLACK-OPS';
                guardCostLbl.textContent = '$25,000 • TACTICAL';
            } else if (gLvl === 1) {
                guardTitleLbl.textContent = 'HIRE ENFORCERS';
                guardCostLbl.textContent = '$12,000 • ARMED';
            } else {
                guardTitleLbl.textContent = 'HIRE LOOKOUT';
                guardCostLbl.textContent = '$5,000 • ARMED';
            }
        } else {
            missionBoard.classList.add('hidden');
        }

        // Buy Business Deed Button (Available at 100% Rep)
        const buySection = document.getElementById('buy-deed-section');
        const costLbl = document.getElementById('deed-cost-lbl');
        const purchasedBadge = document.getElementById('purchased-badge');

        if (data.isPurchased) {
            buySection.classList.add('hidden');
            purchasedBadge.classList.remove('hidden');
        } else {
            purchasedBadge.classList.add('hidden');
            if (data.canBuy) {
                buySection.classList.remove('hidden');
                costLbl.textContent = `$${(data.buyPrice || 25000).toLocaleString()} CASH`;
            } else {
                buySection.classList.add('hidden');
            }
        }

        // Robbery Vault Button & Progress Section
        const robSection = document.getElementById('rob-biz-section');
        const cooldownBadge = document.getElementById('vault-cooldown-badge');
        const cooldownText = document.getElementById('cooldown-text');
        const heistSection = document.getElementById('robbery-heist-section');
        const robTimeText = document.getElementById('rob-time-text');
        const robFill = document.getElementById('rob-fill');

        if (data.isRobbing) {
            robSection.classList.add('hidden');
            cooldownBadge.classList.add('hidden');
            heistSection.classList.remove('hidden');

            const remaining = data.robSeconds || 0;
            const total = data.robTotal || 35;
            robTimeText.textContent = `${remaining}s / ${total}s`;
            const robPct = Math.max(0, Math.min(100, (remaining / total) * 100));
            robFill.style.width = `${robPct}%`;
        } else {
            heistSection.classList.add('hidden');
            if (data.cooldownRemaining && data.cooldownRemaining > 0) {
                robSection.classList.add('hidden');
                cooldownBadge.classList.remove('hidden');
                const mins = Math.ceil(data.cooldownRemaining / 60);
                cooldownText.textContent = `VAULT EMPTIED • ${mins}m COOLDOWN`;
            } else {
                cooldownBadge.classList.add('hidden');
                robSection.classList.remove('hidden');
            }
        }

        // Capture Progress
        const fill = document.getElementById('capture-fill');
        const statusText = document.getElementById('capture-status-text');
        const timeText = document.getElementById('capture-time-text');
        const contested = document.getElementById('contested-badge');

        const maxTime = data.captureTime || 45;
        const currentProgress = data.progress || 0;
        const pct = Math.min(100, Math.max(0, (currentProgress / maxTime) * 100));

        fill.style.width = `${pct}%`;
        timeText.textContent = `${currentProgress}s / ${maxTime}s`;

        if (data.isContested) {
            contested.classList.remove('hidden');
            statusText.textContent = 'DEFENSE CONTESTED';
            statusText.style.color = 'var(--red-alert)';
            fill.style.background = 'linear-gradient(90deg, #e63946, #ff758f)';
        } else {
            contested.classList.add('hidden');
            if (data.isCapturing) {
                statusText.textContent = 'SEIZING PREMISE...';
                statusText.style.color = 'var(--amber)';
                fill.style.background = 'linear-gradient(90deg, var(--amber), #ffd166)';
            } else {
                statusText.textContent = 'PROTECTED PREMISE (HOLDING)';
                statusText.style.color = 'var(--turf-cyan)';
                fill.style.background = 'linear-gradient(90deg, var(--turf-cyan), #48cae4)';
            }
        }
    } else if (data.action === 'openBossHUD') {
        expandFullHUD();
        isCursorOpen = true;
        const closeBtn = document.getElementById('hud-close-cursor-btn');
        if (closeBtn) closeBtn.classList.remove('hidden');

        const missionBoard = document.getElementById('mission-board-section');
        const syndicateRow = document.querySelector('.syndicate-actions-row');
        const contrabandSec = document.querySelector('.contraband-vault-box');
        const fleetSection = document.querySelector('.fleet-quick-spawner');

        if (data.isOwner) {
            if (missionBoard) missionBoard.classList.remove('hidden');
            if (fleetSection) fleetSection.classList.remove('hidden');
            if (contrabandSec) contrabandSec.classList.remove('hidden');
            showUIPopup("👑 BOSS TERMINAL", "Welcome Boss. Management console unlocked.", "success", "ONLINE", "fa-crown");
        } else {
            if (missionBoard) missionBoard.classList.add('hidden');
            if (fleetSection) fleetSection.classList.add('hidden');
            if (contrabandSec) contrabandSec.classList.add('hidden');
            showUIPopup("👁️ PREMISE INSPECTION", "Vault & security status online. Ready for heist or operations.", "inform", "INSPECT", "fa-eye");
        }
    } else if (data.action === 'hideTurfHUD') {
        currentActiveZoneId = null;
        lastRep = null;
        lastRepLevel = null;
        if (hudAutoHideTimer) clearTimeout(hudAutoHideTimer);
        document.getElementById('turf-hud').classList.add('hidden');
        document.getElementById('turf-mini-pill').classList.add('hidden');
        document.getElementById('turf-level-toast').classList.add('hidden');
        const radarBanner = document.getElementById('turf-radar-banner');
        if (radarBanner) radarBanner.classList.add('hidden');
    } else if (data.action === 'showSellingBadge') {
        const badge = document.getElementById('selling-badge');
        if (data.active) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    } else if (data.action === 'setCursorState') {
        isCursorOpen = data.active;
        const closeBtn = document.getElementById('hud-close-cursor-btn');
        const hintBar = document.getElementById('cursor-hint-bar');
        if (data.active) {
            expandFullHUD();
            if (closeBtn) closeBtn.classList.remove('hidden');
            if (hintBar) hintBar.innerHTML = '<i class="fa-solid fa-arrow-pointer"></i> <strong>CURSOR ACTIVE</strong> • Press <kbd>ESC</kbd> or <kbd>Z</kbd> to Return';
        } else {
            document.getElementById('turf-hud').classList.add('hidden');
            if (closeBtn) closeBtn.classList.add('hidden');
            if (hintBar) hintBar.innerHTML = '<i class="fa-solid fa-arrow-pointer"></i> Press <kbd>Z</kbd> or <kbd>H</kbd> for Mouse Cursor';
        }
    } else if (data.action === 'openAdminCreator') {
        currentCoords = data.coords || { x: 0, y: 0, z: 0 };
        activeBusinessesCache = data.existing || {};

        document.getElementById('form-coords-text').textContent = 
            `X: ${currentCoords.x.toFixed(2)} | Y: ${currentCoords.y.toFixed(2)} | Z: ${currentCoords.z.toFixed(2)}`;

        // Populate Table & Count
        renderAdminTable(activeBusinessesCache);
        const kpiBiz = document.getElementById('kpi-biz-val');
        if (kpiBiz) kpiBiz.textContent = `${Object.keys(activeBusinessesCache || {}).length || 35} LIVE`;
        document.getElementById('admin-creator-modal').classList.remove('hidden');
    } else if (data.action === 'closeAdminModal') {
        document.getElementById('admin-creator-modal').classList.add('hidden');
    }
});

// Master Admin Category Filter Tabs
document.querySelectorAll('.m-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.m-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.action-section').forEach(sec => {
            const cat = sec.getAttribute('data-category');
            if (filter === 'all' || filter === cat) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });
    });
});

// 1-Click Quick Spawn Business Preset Handler
window.adminQuickSpawnBiz = function(name, payout, radius, cap, type) {
    const autoId = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(Math.random() * 1000);
    const bizData = {
        id: autoId,
        label: name,
        payout: payout,
        captureTime: cap,
        radius: radius,
        owner: 'Unclaimed',
        coords: currentCoords
    };

    fetch(`https://${GetParentResourceName()}/deployBusiness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bizData)
    });

    closeAdminModal();
};

// Toggle Custom Form Accordion
window.toggleCustomCreatorForm = function() {
    const body = document.getElementById('creator-form');
    const chevron = document.getElementById('cc-chevron');
    if (body.classList.contains('hidden')) {
        body.classList.remove('hidden');
        if (chevron) chevron.className = 'fa-solid fa-chevron-up';
    } else {
        body.classList.add('hidden');
        if (chevron) chevron.className = 'fa-solid fa-chevron-down';
    }
};

function renderAdminTable(existing) {
    const tbody = document.getElementById('biz-table-body');
    tbody.innerHTML = '';
    const keys = Object.keys(existing);
    document.getElementById('total-biz-count').textContent = keys.length;

    for (const [id, biz] of Object.entries(existing)) {
        const tr = document.createElement('tr');
        const payout = (biz.passiveReward && biz.passiveReward.amount) || 200;
        tr.innerHTML = `
            <td><strong>${biz.label || id}</strong></td>
            <td><span style="color: var(--success);">$${payout}/min</span></td>
            <td><span style="color: var(--amber);">${biz.owner || 'Unclaimed'}</span></td>
            <td>
                <button class="action-btn tp" data-id="${id}" title="Teleport to Property" style="background: rgba(46, 196, 182, 0.2); color: var(--turf-cyan); border: 1px solid var(--turf-cyan); padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
                    <i class="fa-solid fa-location-arrow"></i> TP
                </button>
                <button class="action-btn del" data-id="${id}" title="Delete Property">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tr.querySelector('.action-btn.tp').addEventListener('click', () => {
            fetch(`https://${GetParentResourceName()}/adminTeleport`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zoneId: id })
            });
        });

        tr.querySelector('.action-btn.del').addEventListener('click', () => {
            deleteBuilding(id);
        });

        tbody.appendChild(tr);
    }
}

// Global Master Admin Action Helpers
window.adminStartMission = function(type, key) {
    if (type === 'restock') {
        fetch(`https://${GetParentResourceName()}/startRestockRun`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zoneId: currentActiveZoneId || 'auto', depotKey: key })
        });
    } else if (type === 'bank') {
        fetch(`https://${GetParentResourceName()}/startBankRun`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zoneId: currentActiveZoneId || 'auto', dropoffKey: key })
        });
    } else if (type === 'vip') {
        fetch(`https://${GetParentResourceName()}/startVIPRun`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zoneId: currentActiveZoneId || 'auto', vipKey: key })
        });
    }
    closeAdminModal();
};

window.adminSpawnTruck = function() {
    fetch(`https://${GetParentResourceName()}/adminSpawnTruck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
    closeAdminModal();
};

window.adminSetLivery = function(index) {
    fetch(`https://${GetParentResourceName()}/adminSetLivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livery: index })
    });
};

window.adminToggleJingle = function() {
    fetch(`https://${GetParentResourceName()}/adminToggleJingle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
};

window.adminToggleSelling = function() {
    fetch(`https://${GetParentResourceName()}/adminToggleSelling`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
};

window.adminQuickCheat = function(cheatType) {
    fetch(`https://${GetParentResourceName()}/adminQuickCheat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId: currentActiveZoneId, cheatType: cheatType })
    });
};

// 1-Click Template Button Autofill
document.querySelectorAll('.tpl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const payout = btn.getAttribute('data-payout');
        const radius = btn.getAttribute('data-radius');
        const cap = btn.getAttribute('data-cap');

        const elName = document.getElementById('biz-label');
        const elPayout = document.getElementById('biz-payout');
        const elRadius = document.getElementById('biz-radius');
        const elCap = document.getElementById('biz-captime');

        if (elName) elName.value = name;
        if (elPayout) elPayout.value = payout;
        if (elRadius) elRadius.value = radius;
        if (elCap) elCap.value = cap;
    });
});

// Form Submit: Deploy Business
const creatorForm = document.getElementById('creator-form');
if (creatorForm) {
    creatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const labelInput = document.getElementById('biz-label');
        const label = labelInput ? labelInput.value.trim() : 'New Business';
        const autoId = label.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(Math.random() * 1000);

        const elPayout = document.getElementById('biz-payout');
        const elCap = document.getElementById('biz-captime');
        const elRadius = document.getElementById('biz-radius');
        const elOwner = document.getElementById('biz-owner');

        const bizData = {
            id: autoId,
            label: label,
            payout: elPayout ? elPayout.value : 300,
            captureTime: elCap ? elCap.value : 45,
            radius: elRadius ? elRadius.value : 18,
            owner: (elOwner && elOwner.value.trim()) || 'Unclaimed',
            coords: currentCoords
        };

        fetch(`https://${GetParentResourceName()}/deployBusiness`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bizData)
        });

        closeAdminModal();
    });
}

function deleteBuilding(zoneId) {
    fetch(`https://${GetParentResourceName()}/deleteBusiness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId: zoneId })
    });
    delete activeBusinessesCache[zoneId];
    renderAdminTable(activeBusinessesCache);
}

function closeAdminModal() {
    const modal = document.getElementById('admin-creator-modal');
    if (modal) modal.classList.add('hidden');
    fetch(`https://${GetParentResourceName()}/closeAdminCreator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

const creatorCloseBtn = document.getElementById('creator-close-btn');
if (creatorCloseBtn) creatorCloseBtn.addEventListener('click', closeAdminModal);

// Buy Business Deed Button Click
const buyDeedBtn = document.getElementById('buy-deed-btn');
if (buyDeedBtn) {
    buyDeedBtn.addEventListener('click', () => {
        if (currentActiveZoneId) {
            fetch(`https://${GetParentResourceName()}/buyBusinessDeed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zoneId: currentActiveZoneId })
            });
        }
    });
}

// Rob Business Vault Button Click
const robBizBtn = document.getElementById('rob-biz-btn');
if (robBizBtn) {
    robBizBtn.addEventListener('click', () => {
        if (currentActiveZoneId) {
            fetch(`https://${GetParentResourceName()}/startRobbery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zoneId: currentActiveZoneId })
            });
        }
    });
}

// Start Bank Run Money Delivery Button Click
const bankRunBtn = document.getElementById('bank-run-btn');
if (bankRunBtn) {
    bankRunBtn.addEventListener('click', () => {
        if (currentActiveZoneId) {
            fetch(`https://${GetParentResourceName()}/startBankRun`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zoneId: currentActiveZoneId })
            });
        }
    });
}

// Start Restock Supply Run Button Click
const startRestockBtn = document.getElementById('start-restock-btn');
if (startRestockBtn) {
    startRestockBtn.addEventListener('click', () => {
        if (currentActiveZoneId) {
            fetch(`https://${GetParentResourceName()}/startRestockRun`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zoneId: currentActiveZoneId, depotKey: 'ls_docks' })
            });
        }
    });
}

// Start VIP Smuggle Delivery Button Click
const startVipBtn = document.getElementById('start-vip-btn');
if (startVipBtn) {
    startVipBtn.addEventListener('click', () => {
        if (currentActiveZoneId) {
            fetch(`https://${GetParentResourceName()}/startVIPRun`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zoneId: currentActiveZoneId, vipKey: 'pacific_bluffs' })
            });
        }
    });
}

// Hire Security Guard Detail Button Click
const hireGuardBtn = document.getElementById('hire-guard-btn');
if (hireGuardBtn) {
    hireGuardBtn.addEventListener('click', () => {
        if (currentActiveZoneId) {
            fetch(`https://${GetParentResourceName()}/upgradeSecurity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zoneId: currentActiveZoneId, level: 1 })
            });
        }
    });
}

// Close Cursor Mode Button
const hudCloseCursorBtn = document.getElementById('hud-close-cursor-btn');
if (hudCloseCursorBtn) {
    hudCloseCursorBtn.addEventListener('click', () => {
        fetch(`https://${GetParentResourceName()}/closeCursorMode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });
}

// Expand Full HUD on Mini-Pill Click
const miniPill = document.getElementById('turf-mini-pill');
if (miniPill) {
    miniPill.addEventListener('click', () => {
        expandFullHUD();
    });
}

// ==============================================================================
// SYNDICATE EMPIRE OPERATIONS & ACTIONS
// ==============================================================================
let isContrabandStashed = false;

// 1. Graffiti Tag & Clean Buttons
const btnTagGraffiti = document.getElementById('btn-tag-graffiti');
if (btnTagGraffiti) {
    btnTagGraffiti.addEventListener('click', () => {
        fetch(`https://${GetParentResourceName()}/tagGraffiti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });
}

const btnCleanGraffiti = document.getElementById('btn-clean-graffiti');
if (btnCleanGraffiti) {
    btnCleanGraffiti.addEventListener('click', () => {
        fetch(`https://${GetParentResourceName()}/cleanGraffiti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });
}

// 2. Data Terminal Hack & Reboot Buttons
const btnHackTerminal = document.getElementById('btn-hack-terminal');
if (btnHackTerminal) {
    btnHackTerminal.addEventListener('click', () => {
        fetch(`https://${GetParentResourceName()}/hackTerminal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });
}

const btnRebootTerminal = document.getElementById('btn-reboot-terminal');
if (btnRebootTerminal) {
    btnRebootTerminal.addEventListener('click', () => {
        fetch(`https://${GetParentResourceName()}/rebootTerminal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });
}

// 3. Contraband Vault Toggle & Raids
const btnToggleContraband = document.getElementById('btn-toggle-contraband');
if (btnToggleContraband) {
    btnToggleContraband.addEventListener('click', () => {
        isContrabandStashed = !isContrabandStashed;
        const txt = document.getElementById('contraband-risk-txt');
        if (txt) {
            txt.textContent = isContrabandStashed ? '⚠️ ILLICIT NARCOTICS (HIGH RAID RISK!)' : 'CLEAN (DEED SAFE)';
            txt.style.color = isContrabandStashed ? 'var(--red-alert)' : 'var(--success)';
        }
        fetch(`https://${GetParentResourceName()}/toggleContraband`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hasContraband: isContrabandStashed })
        });
    });
}

const btnRaidBusiness = document.getElementById('btn-raid-business');
if (btnRaidBusiness) {
    btnRaidBusiness.addEventListener('click', () => {
        fetch(`https://${GetParentResourceName()}/raidBusiness`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    });
}

// 4. Fleet Spawner
window.spawnCompanyFleet = function(model, plate) {
    fetch(`https://${GetParentResourceName()}/spawnCompanyFleet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model, plate: plate })
    });
};

// 5. District Investments
window.investInDistrict = function(targetZone, amount) {
    fetch(`https://${GetParentResourceName()}/investDistrict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetZone: targetZone, amount: amount })
    });
};

// 6. Job Board Dispatcher
window.postJobFromAdmin = function() {
    const title = document.getElementById('job-title-input').value.trim() || 'Commercial Transport Contract';
    const type = document.getElementById('job-type-select').value;
    const bounty = parseInt(document.getElementById('job-bounty-input').value) || 2500;

    fetch(`https://${GetParentResourceName()}/postJobQuest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, jobType: type, bounty: bounty })
    });

    document.getElementById('job-title-input').value = '';
};

window.claimJobQuest = function(jobId) {
    fetch(`https://${GetParentResourceName()}/claimJobQuest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobId })
    });
};

window.completeJobQuest = function(jobId) {
    fetch(`https://${GetParentResourceName()}/completeJobQuest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobId })
    });
};

// Sync Job Board Message
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action === "syncJobBoard") {
        renderJobBoard(data.jobs || []);
    } else if (data.action === "openCraftingWorkbench") {
        openAdminModal();
        const craftBtn = document.querySelector('.m-tab-btn[data-filter="crafting"]');
        if (craftBtn) craftBtn.click();
    }
});

function renderJobBoard(jobs) {
    const container = document.getElementById('jobs-list-container');
    if (!container) return;

    if (jobs.length === 0) {
        container.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--text-muted); font-size: 11px; padding: 20px;">No active contracts on the board. Post one above!</div>`;
        return;
    }

    container.innerHTML = jobs.map(j => `
        <div class="job-contract-card">
            <div class="j-card-head">
                <span class="j-title">${j.title}</span>
                <span class="j-bounty">$${(j.bounty || 2500).toLocaleString()}</span>
            </div>
            <div style="font-size: 10px; color: var(--text-muted);">
                Sponsor: <strong style="color: var(--turf-cyan);">${j.sponsorLabel || 'Commercial Enterprise'}</strong> &bull; Status: <strong style="color: ${j.status === 'available' ? 'var(--success)' : 'var(--amber)'};">${j.status.toUpperCase()}</strong>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 4px;">
                ${j.status === 'available' ? `
                    <button class="action-btn" style="flex: 1; background: var(--turf-cyan); color: #000; font-weight: 900;" onclick="claimJobQuest('${j.id}')">ACCEPT CONTRACT</button>
                ` : `
                    <button class="action-btn" style="flex: 1; background: var(--success); color: #000; font-weight: 900;" onclick="completeJobQuest('${j.id}')">COMPLETE CONTRACT</button>
                `}
            </div>
        </div>
    `).join('');
}

// Gun Smuggle & B2B Trade Dispatchers
window.startGunRun = function(gunKey) {
    fetch(`https://${GetParentResourceName()}/startGunRun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gunKey: gunKey })
    });
};

window.startB2BTrade = function(tradeKey) {
    fetch(`https://${GetParentResourceName()}/startB2BDeal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeKey: tradeKey })
    });
};

window.requestTruckToStreet = function() {
    fetch(`https://${GetParentResourceName()}/requestTruckToStreet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
};

window.craftBlueprint = function(recipeKey) {
    fetch(`https://${GetParentResourceName()}/craftItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeKey: recipeKey })
    });
};

// Master Menu Tab Switcher (3 Business Empires)
document.querySelectorAll('.m-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.m-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const sections = document.querySelectorAll('.action-section');

        sections.forEach(sec => {
            const cat = sec.getAttribute('data-category');
            if (filter === 'all' || filter === cat) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });
    });
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAdminModal();
        fetch(`https://${GetParentResourceName()}/closeCursorMode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }
});



