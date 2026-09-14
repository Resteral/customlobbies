// POS Cash Register Logic
let posVenueId = null;
let posRegisterId = null;

function onSelectCustomerChange() {
  const val = document.getElementById('posCustomerSelect').value;
  if (val) {
    document.getElementById('posManualIdInput').value = val;
  }
}

window.initPOS = function(venueId, registerId, nearbyPlayers) {
  posVenueId = venueId;
  posRegisterId = registerId;

  const select = document.getElementById('posCustomerSelect');
  select.innerHTML = '';

  if (nearbyPlayers && nearbyPlayers.length > 0) {
    select.innerHTML = '<option value="">-- Select a detected patron --</option>';
    nearbyPlayers.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.innerText = `${p.name} [Server ID: ${p.id}]`;
      select.appendChild(opt);
    });
    // Auto-select first patron if available
    select.selectedIndex = 1;
    document.getElementById('posManualIdInput').value = nearbyPlayers[0].id;
  } else {
    select.innerHTML = '<option value="">No other patrons nearby (Use manual ID below)</option>';
    document.getElementById('posManualIdInput').value = '';
  }

  document.getElementById('posAmountInput').value = '';
  document.getElementById('posDescriptionInput').value = '';
  document.getElementById('posModal').classList.remove('hidden');
};

function submitPOSCharge() {
  let targetId = document.getElementById('posManualIdInput').value;
  if (!targetId) {
    targetId = document.getElementById('posCustomerSelect').value;
  }
  const amount = parseFloat(document.getElementById('posAmountInput').value);
  const desc = document.getElementById('posDescriptionInput').value || 'Drinks & Bar Tab';

  if (!targetId || parseInt(targetId) <= 0) {
    alert('Please select a customer or enter a valid Server ID.');
    return;
  }

  if (!amount || amount <= 0) {
    alert('Please enter a valid bill amount.');
    return;
  }

  fetch(`https://${GetParentResourceName()}/pos_charge_bill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: posVenueId,
      targetServerId: parseInt(targetId),
      amount: amount,
      description: desc
    })
  }).then(() => {
    closeAllUI();
  }).catch(() => {});
}
