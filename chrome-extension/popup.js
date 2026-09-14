document.addEventListener('DOMContentLoaded', () => {
  const btnCapture = document.getElementById('extBtnStartCapture');
  const btnQueue = document.getElementById('extBtnJoinQueue');
  const btnInject = document.getElementById('extBtnInjectOverlay');
  const statusText = document.getElementById('extStatusText');

  btnCapture.addEventListener('click', () => {
    chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab'], (streamId) => {
      if (streamId) {
        statusText.textContent = `Screen Capture Active (Stream ID: ${streamId.slice(0,8)}...)`;
        chrome.runtime.sendMessage({ type: 'START_CAPTURE', streamId });
      }
    });
  });

  let inQueue = false;
  btnQueue.addEventListener('click', () => {
    inQueue = !inQueue;
    if (inQueue) {
      btnQueue.textContent = '❌ Leave Queue (-leave)';
      btnQueue.classList.remove('btn-purple');
      btnQueue.classList.add('btn-danger');
      statusText.textContent = 'Status: Searching for 5v5 Lobby (8/10)...';
    } else {
      btnQueue.textContent = '⚡ Join Quick Queue (-join)';
      btnQueue.classList.remove('btn-danger');
      btnQueue.classList.add('btn-purple');
      statusText.textContent = 'Status: Connected to CustomLobbies.com';
    }
  });

  btnInject.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectHUDOverlay
      });
      statusText.textContent = 'Status: In-game HUD overlay injected into active tab!';
    }
  });
});

function injectHUDOverlay() {
  if (document.getElementById('cl-hud-overlay')) return;

  const hud = document.createElement('div');
  hud.id = 'cl-hud-overlay';
  hud.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(18, 22, 31, 0.9);
    border: 2px solid #00f2fe;
    border-radius: 12px;
    padding: 12px 18px;
    color: #fff;
    font-family: system-ui, sans-serif;
    font-weight: 700;
    font-size: 13px;
    z-index: 999999;
    box-shadow: 0 0 20px rgba(0, 242, 254, 0.3);
  `;
  hud.innerHTML = `
    <div style="color: #00f2fe; margin-bottom: 4px;">🎮 CustomLobbies Stream HUD</div>
    <div>MMR: <span style="color: #ffd700;">1840 (Diamond II)</span></div>
    <div style="font-size: 11px; color: #8a99ad; margin-top: 4px;">Follower Alerts: ACTIVE</div>
  `;
  document.body.appendChild(hud);
}
