// Venue Management Tablet Logic
let tabletData = {};

window.initTablet = function(data) {
  tabletData = data || {};
  const venue = data.venue || {};

  document.getElementById('tabletVenueName').innerText = venue.venue_id ? venue.venue_id.toUpperCase() : 'NIGHTLIFE VENUE';
  document.getElementById('tabletOwnerName').innerText = `Owner: ${venue.owner_name || 'Unowned'}`;
  document.getElementById('tabletHypeVal').innerText = `${Math.round(venue.hype_level || 50)}%`;

  document.getElementById('statSafeBalance').innerText = `$${Number(venue.safe_balance || 0).toLocaleString()}`;
  document.getElementById('statActiveEmployees').innerText = `${(data.employees || []).length} Staff`;
  document.getElementById('statCoverCharge').innerText = `$${venue.entry_fee || 50}`;

  renderEmployeeTable(data.employees || []);
  renderWholesaleGrid(data.wholesale || {});
  renderSignatureDrinksList(data.signatureDrinks || []);
  renderLedgerTable(data.ledger || []);

  document.getElementById('venueTablet').classList.remove('hidden');
  switchTabletTab('overview');
};

function switchTabletTab(tabId) {
  document.querySelectorAll('.tablet-nav .nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tablet-tab-pane').forEach(p => p.classList.add('hidden'));

  const tabPaneMap = {
    'overview': 'tabOverview',
    'employees': 'tabEmployees',
    'stock': 'tabStock',
    'signatures': 'tabSignatures',
    'ledger': 'tabLedger'
  };

  const targetPane = document.getElementById(tabPaneMap[tabId]);
  if (targetPane) {
    targetPane.classList.remove('hidden');
  }

  const navBtns = document.querySelectorAll('.tablet-nav .nav-item');
  if (tabId === 'overview' && navBtns[0]) navBtns[0].classList.add('active');
  if (tabId === 'employees' && navBtns[1]) navBtns[1].classList.add('active');
  if (tabId === 'stock' && navBtns[2]) navBtns[2].classList.add('active');
  if (tabId === 'signatures' && navBtns[3]) navBtns[3].classList.add('active');
  if (tabId === 'ledger' && navBtns[4]) navBtns[4].classList.add('active');
}

// ============================================================================
// EMPLOYEES
// ============================================================================
function renderEmployeeTable(employees) {
  const tbody = document.getElementById('employeeTableBody');
  tbody.innerHTML = '';

  if (employees.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No staff currently hired.</td></tr>';
    return;
  }

  employees.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${emp.name}</strong></td>
      <td><span class="badge">${getRankLabel(emp.rank_id)}</span></td>
      <td>$${emp.pay_rate || 200} / shift</td>
      <td>$${Number(emp.total_earned || 0).toLocaleString()}</td>
      <td>
        <button class="btn-action secondary" style="padding: 4px 8px; font-size: 11px; color:#ff4d4d;" onclick="fireEmployee('${emp.identifier}')">
          <i class="fa-solid fa-user-minus"></i> Fire
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function getRankLabel(rankId) {
  const ranks = {
    1: 'Barback',
    2: 'Bartender',
    3: 'VIP Host',
    4: 'Lead Mixologist',
    5: 'Manager',
    6: 'Owner'
  };
  return ranks[rankId] || 'Staff';
}

function fireEmployee(ident) {
  fetch(`https://${GetParentResourceName()}/tablet_fire_employee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: tabletData.venue ? tabletData.venue.venue_id : null,
      employeeIdent: ident
    })
  }).then(() => {
    closeAllUI();
  }).catch(() => {});
}

function openHireModal() {
  const serverId = prompt('Enter Player Server ID to hire:');
  const rank = prompt('Enter Rank (1: Barback, 2: Bartender, 3: VIP Host, 4: Lead Mixologist, 5: Manager):', '2');
  if (serverId && rank) {
    fetch(`https://${GetParentResourceName()}/tablet_hire_employee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        venueId: tabletData.venue ? tabletData.venue.venue_id : null,
        targetServerId: parseInt(serverId),
        rankId: parseInt(rank)
      })
    }).then(() => {
      closeAllUI();
    }).catch(() => {});
  }
}

// ============================================================================
// WHOLESALE STOCK
// ============================================================================
function renderWholesaleGrid(wholesale) {
  const container = document.getElementById('wholesaleGrid');
  container.innerHTML = '';

  for (const [key, item] of Object.entries(wholesale)) {
    const card = document.createElement('div');
    card.className = 'wholesale-card';
    card.innerHTML = `
      <div>
        <h4>${item.label}</h4>
        <span class="badge">${item.category || 'Supply'}</span>
      </div>
      <div class="wholesale-price-row">
        <span>Wholesale: <strong style="color:var(--accent-green);">$${item.wholesalePrice}</strong></span>
        <span>Retail Sugg: $${item.retailSuggested || 50}</span>
      </div>
      <button class="btn-action primary" style="width:100%; justify-content:center;" onclick="orderWholesale('${key}', 1)">
        <i class="fa-solid fa-cart-shopping"></i> Order Supply ($${item.wholesalePrice})
      </button>
    `;
    container.appendChild(card);
  }
}

function orderWholesale(itemName, qty) {
  fetch(`https://${GetParentResourceName()}/tablet_order_stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: tabletData.venue ? tabletData.venue.venue_id : null,
      itemName: itemName,
      quantity: qty
    })
  }).catch(() => {});
}

// ============================================================================
// SIGNATURE DRINK CREATOR
// ============================================================================
function renderSignatureDrinksList(signatures) {
  const container = document.getElementById('signatureDrinksList');
  container.innerHTML = '';

  if (signatures.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size:13px;">No custom signature drinks registered yet.</p>';
    return;
  }

  signatures.forEach(sig => {
    const div = document.createElement('div');
    div.className = 'recipe-card';
    div.innerHTML = `
      <h4><i class="fa-solid fa-martini-glass"></i> ${sig.label}</h4>
      <div class="recipe-card-meta">
        <span>Perk: +${(sig.buff_type || 'Stamina').toUpperCase()}</span>
        <span style="color:var(--accent-green); font-weight:700;">$${sig.price}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function submitSignatureDrink() {
  const name = document.getElementById('sigNameInput').value;
  const primarySpirit = document.getElementById('sigPrimarySpiritSelect').value;
  const secondaryLiqueur = document.getElementById('sigLiqueurSelect').value;
  const mixer = document.getElementById('sigMixerSelect').value;
  const garnish = document.getElementById('sigGarnishSelect').value;
  const glass = document.getElementById('sigGlassSelect').value;
  const buff = document.getElementById('sigBuffSelect').value;
  const price = parseInt(document.getElementById('sigPriceInput').value) || 65;

  if (!name) {
    alert('Please provide a name for your custom signature cocktail.');
    return;
  }

  const newDrink = {
    label: name,
    category: 'cocktails',
    glassType: glass,
    iceType: 'cubed',
    ingredients: [
      { item: primarySpirit, amount: 45, label: primarySpirit.replace(/_/g, ' ').toUpperCase() },
      { item: secondaryLiqueur, amount: 25, label: secondaryLiqueur.replace(/_/g, ' ').toUpperCase() },
      { item: mixer, amount: 40, label: mixer.replace(/_/g, ' ').toUpperCase() }
    ],
    shaken: true,
    garnish: garnish,
    price: price,
    buffType: buff,
    buffDuration: 260,
    color: 'rgba(255, 42, 133, 0.85)',
    description: `A master-crafted signature cocktail blended with ${primarySpirit.replace(/_/g, ' ')}, ${secondaryLiqueur.replace(/_/g, ' ')}, and infused with ${garnish.replace(/_/g, ' ')}.`
  };

  fetch(`https://${GetParentResourceName()}/tablet_save_signature_drink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: tabletData.venue ? tabletData.venue.venue_id : null,
      drink: newDrink
    })
  }).then(() => {
    closeAllUI();
  }).catch(() => {});
}

// ============================================================================
// ACCOUNTING & LEDGER
// ============================================================================
function renderLedgerTable(ledger) {
  const tbody = document.getElementById('ledgerTableBody');
  tbody.innerHTML = '';

  if (ledger.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No ledger activity recorded.</td></tr>';
    return;
  }

  ledger.forEach(entry => {
    const isPositive = (entry.amount >= 0);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.created_at || 'Recent'}</td>
      <td><span class="badge">${entry.type}</span></td>
      <td style="color: ${isPositive ? 'var(--accent-green)' : '#ff4d4d'}; font-family: var(--font-mono); font-weight: 700;">
        ${isPositive ? '+' : ''}$${Number(entry.amount).toLocaleString()}
      </td>
      <td>${entry.description}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openSafeFromTablet() {
  closeAllUI();
  if (tabletData.venue) {
    document.getElementById('modalSafeBalance').innerText = '$' + Number(tabletData.venue.safe_balance || 0).toLocaleString();
    window.currentVenueId = tabletData.venue.venue_id;
    document.getElementById('safeModal').classList.remove('hidden');
  }
}
