// Global Event Hub & Router
window.currentVenueId = null;

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.action) return;

  switch (data.action) {
    case 'open_mixology':
      if (window.initMixologyStation) {
        window.initMixologyStation(data.venueId, data.barId, data.recipes, data.wholesale);
      }
      break;

    case 'open_tablet':
      if (window.initTablet) {
        window.initTablet(data.data);
      }
      break;

    case 'open_pos':
      if (window.initPOS) {
        window.initPOS(data.venueId, data.registerId, data.nearbyPlayers);
      }
      break;

    case 'open_safe_modal':
      window.currentVenueId = data.venueId;
      document.getElementById('modalSafeBalance').innerText = '$' + Number(data.balance || 0).toLocaleString();
      document.getElementById('safeModal').classList.remove('hidden');
      break;

    case 'show_breathalyzer':
      if (window.initBreathalyzer) {
        window.initBreathalyzer(data.targetName, data.bac, data.legalLimit);
      }
      break;

    case 'open_dj_modal':
      window.currentVenueId = data.venueId;
      document.getElementById('djModal').classList.remove('hidden');
      break;

    case 'play_dj_audio':
      const audio = document.getElementById('djAudioPlayer');
      if (audio && data.url) {
        audio.src = data.url;
        audio.volume = data.volume || 0.8;
        audio.play().catch(e => console.log('Audio autoplay prevented:', e));
      }
      break;

    case 'stop_dj_audio':
      const audioStop = document.getElementById('djAudioPlayer');
      if (audioStop) {
        audioStop.pause();
        audioStop.src = '';
      }
      break;

    case 'force_close':
      document.querySelectorAll('.app-window').forEach(el => el.classList.add('hidden'));
      break;

    default:
      break;
  }
});

// Close all UI on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllUI();
  }
});

function closeAllUI() {
  document.querySelectorAll('.app-window').forEach(el => el.classList.add('hidden'));
  fetch(`https://${GetParentResourceName()}/close_ui`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  }).catch(() => {});
}

// DJ Booth controls
function playDJTrack() {
  const url = document.getElementById('djUrlInput').value;
  const volume = parseFloat(document.getElementById('djVolumeInput').value) || 0.8;

  if (!url) return;

  fetch(`https://${GetParentResourceName()}/dj_play_track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: window.currentVenueId,
      url: url,
      volume: volume
    })
  }).catch(() => {});
}

function stopDJTrack() {
  fetch(`https://${GetParentResourceName()}/dj_stop_track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: window.currentVenueId
    })
  }).catch(() => {});
}

// Safe modal controls
function setSafeAmount(amt) {
  document.getElementById('safeAmountInput').value = amt;
}

function submitSafeAction(action) {
  const pin = document.getElementById('safePinInput').value;
  const amt = parseFloat(document.getElementById('safeAmountInput').value);

  if (!amt || amt <= 0) return;

  fetch(`https://${GetParentResourceName()}/safe_submit_action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: window.currentVenueId,
      action: action,
      amount: amt,
      pin: pin
    })
  }).catch(() => {});
}
