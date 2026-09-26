/**
 * HELIX Platform WebUI Event Controller
 */

let hackDifficulty = 4;
let hackSequence = [];
let userSequence = [];
let enteredPIN = "";

// Close Modal
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

// Police Alert Banner
function showPoliceAlert(msg) {
  const banner = document.getElementById('police-alert-banner');
  const text = document.getElementById('alert-message');
  if (banner && text) {
    text.innerText = msg;
    banner.classList.remove('hidden');
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 8000);
  }
}

// Business Management UI
function openBusinessUI() {
  document.getElementById('modal-business').classList.remove('hidden');
}

function buyBusiness(bizId) {
  if (window.Helix) {
    Helix.call('buyBusiness', bizId).then(res => {
      if (res.success) alert('Business Purchased Successfully!');
      else alert(res.message || 'Purchase Failed!');
    });
  } else {
    console.log(`[HelixWebUI] Buy Business: ${bizId}`);
  }
}

function depositDirty(bizId) {
  if (window.Helix) {
    Helix.call('depositDirtyMoney', bizId, 1000).then(res => {
      if (res.success) alert('Deposited $1,000 Dirty Cash for Laundering!');
    });
  } else {
    console.log(`[HelixWebUI] Deposit Dirty Cash: ${bizId}`);
  }
}

function collectClean(bizId) {
  if (window.Helix) {
    Helix.call('withdrawCleanMoney', bizId).then(res => {
      if (res.success) alert(`Collected $${res.payout} in Clean Business Profits!`);
    });
  } else {
    console.log(`[HelixWebUI] Collect Clean Profits: ${bizId}`);
  }
}

// Black Market UI
function openBlackMarketUI() {
  document.getElementById('modal-blackmarket').classList.remove('hidden');
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-sell').classList.add('hidden');
  document.getElementById('tab-buy').classList.add('hidden');

  if (tab === 'sell') {
    document.getElementById('tab-sell').classList.remove('hidden');
    event.target.classList.add('active');
  } else {
    document.getElementById('tab-buy').classList.remove('hidden');
    event.target.classList.add('active');
  }
}

function tradeItem(id, action) {
  if (window.Helix) {
    Helix.emit('blackMarketTrade', { id, action });
  } else {
    console.log(`[HelixWebUI] Trade: ${action} ${id}`);
  }
}

// Hacking Minigame UI
function openHackingUI(difficulty = 4) {
  hackDifficulty = difficulty;
  hackSequence = [];
  userSequence = [];
  
  for (let i = 0; i < hackDifficulty; i++) {
    hackSequence.push(Math.floor(Math.random() * 16) + 1);
  }

  const grid = document.getElementById('hack-grid');
  grid.innerHTML = '';
  document.getElementById('hack-status').innerText = `BYPASS NODES REQUIRED: 0 / ${hackDifficulty}`;

  for (let i = 1; i <= 16; i++) {
    const btn = document.createElement('button');
    btn.className = 'node-btn';
    btn.innerText = `NODE ${i}`;
    btn.onclick = () => clickHackNode(i, btn);
    grid.appendChild(btn);
  }

  document.getElementById('modal-hacking').classList.remove('hidden');
}

function clickHackNode(index, btn) {
  if (userSequence.length >= hackDifficulty) return;

  userSequence.push(index);
  btn.classList.add('selected');

  const step = userSequence.length - 1;
  if (hackSequence[step] !== index) {
    alert('SECURITY BYPASS FAILED! WRONG NODE SEQUENCE!');
    if (window.Helix) Helix.emit('hackingResult', false);
    closeModal('modal-hacking');
    return;
  }

  document.getElementById('hack-status').innerText = `BYPASS NODES REQUIRED: ${userSequence.length} / ${hackDifficulty}`;

  if (userSequence.length === hackDifficulty) {
    alert('CYBER OVERRIDE SUCCESSFUL!');
    if (window.Helix) Helix.emit('hackingResult', true);
    closeModal('modal-hacking');
  }
}

// Meth Lab UI
function openMethLabUI(data) {
  if (data) {
    document.getElementById('lab-temp').innerText = `${data.temperature || 25}°C`;
    document.getElementById('lab-prog').innerText = `${data.progress || 0}%`;
    document.getElementById('lab-purity').innerText = `${data.purity || 99}%`;
  }
  document.getElementById('modal-meth').classList.remove('hidden');
}

function sendCookAction(action) {
  if (window.Helix) Helix.emit('methCookAction', action);
  console.log(`[MethLab] Cook Action: ${action}`);
}

// Vault Keypad UI
function openVaultKeypadUI() {
  enteredPIN = "";
  updatePINDisplay();
  document.getElementById('modal-keypad').classList.remove('hidden');
}

function pressKey(num) {
  if (enteredPIN.length < 6) {
    enteredPIN += num;
    updatePINDisplay();
  }
}

function clearPIN() {
  enteredPIN = "";
  updatePINDisplay();
}

function updatePINDisplay() {
  document.getElementById('pin-display').innerText = enteredPIN.padEnd(6, '*');
}

function submitPIN() {
  if (window.Helix) Helix.emit('vaultPINSubmitted', enteredPIN);
  closeModal('modal-keypad');
}

// Listen to HelixJS WebUI events if running inside HELIX runtime
if (window.Helix && Helix.on) {
  Helix.on('showPoliceAlert', showPoliceAlert);
  Helix.on('openBlackMarketUI', openBlackMarketUI);
  Helix.on('openBusinessUI', openBusinessUI);
  Helix.on('openHackingUI', openHackingUI);
  Helix.on('openMethLabUI', openMethLabUI);
  Helix.on('openVaultKeypadUI', openVaultKeypadUI);
}
