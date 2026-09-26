// CustomLobbies.com Chrome Extension Content Script - Floating Widget Injector
console.log('🎮 CustomLobbies Chrome Extension Content Script Loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'INJECT_FLOATING_WIDGET') {
    injectFloatingWidget(request.game || 'Counter-Strike 2');
    sendResponse({ status: 'WIDGET_INJECTED' });
  }
});

function injectFloatingWidget(selectedGame = 'Counter-Strike 2') {
  let existing = document.getElementById('cl-floating-extension-widget');
  if (existing) {
    existing.style.display = 'block';
    return;
  }

  const widget = document.createElement('div');
  widget.id = 'cl-floating-extension-widget';
  widget.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 320px;
    background: rgba(13, 17, 23, 0.95);
    backdrop-filter: blur(12px);
    border: 2px solid #00e5ff;
    border-radius: 14px;
    padding: 16px;
    color: #f0f4f8;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 10px 30px rgba(0, 229, 255, 0.25);
    z-index: 9999999;
    user-select: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;

  widget.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: move;" id="cl-widget-header">
      <div style="display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 900; color: #00e5ff;">
        <span>🎮</span> CustomLobbies Queue
      </div>
      <div style="display: flex; gap: 6px; align-items: center;">
        <span style="font-size: 11px; background: rgba(0, 229, 255, 0.15); color: #00e5ff; padding: 2px 6px; border-radius: 8px; font-weight: 800;">1840 ELO</span>
        <button id="cl-widget-close" style="background: transparent; border: none; color: #8b949e; font-size: 16px; cursor: pointer;">✕</button>
      </div>
    </div>

    <div style="font-size: 12px; color: #8b949e; margin-bottom: 8px;">
      Selected: <strong style="color: #fff;" id="cl-widget-game">${selectedGame}</strong>
    </div>

    <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 12px; color: #00e5ff; font-weight: 800;" id="cl-widget-status">Ready</span>
      <span style="font-size: 13px; font-weight: 900; color: #ffd700;" id="cl-widget-timer">⏱️ 00:00</span>
    </div>

    <button id="cl-widget-btn-join" style="
      width: 100%;
      background: linear-gradient(135deg, #00e5ff, #0091ea);
      color: #000;
      border: none;
      border-radius: 8px;
      padding: 10px;
      font-weight: 900;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
    ">
      <span>⚡</span> JOIN QUEUE (-join)
    </button>
  `;

  document.body.appendChild(widget);

  // Close widget
  document.getElementById('cl-widget-close').addEventListener('click', () => {
    widget.style.display = 'none';
  });

  // Toggle queue logic
  let inQueue = false;
  let timerInterval = null;
  let seconds = 0;
  const btnJoin = document.getElementById('cl-widget-btn-join');
  const statusEl = document.getElementById('cl-widget-status');
  const timerEl = document.getElementById('cl-widget-timer');

  btnJoin.addEventListener('click', () => {
    inQueue = !inQueue;
    if (inQueue) {
      btnJoin.innerHTML = '<span>❌</span> LEAVE QUEUE (-leave)';
      btnJoin.style.background = '#ff5252';
      btnJoin.style.color = '#fff';
      seconds = 0;

      timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerEl.textContent = `⏱️ ${mins}:${secs}`;
        const count = Math.min(10, Math.floor(seconds / 2) + 1);
        statusEl.textContent = `Queue (${count}/10)`;

        if (count === 10) {
          clearInterval(timerInterval);
          alert(`🔥 MATCH FOUND!\n\n${selectedGame} 5v5 Premier Scrim Server Ready!`);
          btnJoin.innerHTML = '<span>⚡</span> JOIN QUEUE (-join)';
          btnJoin.style.background = 'linear-gradient(135deg, #00e5ff, #0091ea)';
          btnJoin.style.color = '#000';
          statusEl.textContent = 'Match Ready!';
        }
      }, 1000);
    } else {
      if (timerInterval) clearInterval(timerInterval);
      btnJoin.innerHTML = '<span>⚡</span> JOIN QUEUE (-join)';
      btnJoin.style.background = 'linear-gradient(135deg, #00e5ff, #0091ea)';
      btnJoin.style.color = '#000';
      statusEl.textContent = 'Ready';
      timerEl.textContent = '⏱️ 00:00';
    }
  });

  // Make Widget Draggable
  const header = document.getElementById('cl-widget-header');
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - widget.getBoundingClientRect().left;
    offsetY = e.clientY - widget.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    widget.style.left = `${e.clientX - offsetX}px`;
    widget.style.top = `${e.clientY - offsetY}px`;
    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}
