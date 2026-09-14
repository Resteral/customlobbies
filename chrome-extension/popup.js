document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Queue State Engine
  let inQueue = false;
  let queueInterval = null;
  let seconds = 0;

  const btnQueue = document.getElementById('extBtnToggleQueue');
  const statusBanner = document.getElementById('extQueueStatusBanner');
  const queueTimer = document.getElementById('extQueueTimer');
  const gameSelect = document.getElementById('extGameSelect');

  btnQueue.addEventListener('click', () => {
    inQueue = !inQueue;

    if (inQueue) {
      btnQueue.innerHTML = '<span>❌</span> LEAVE QUEUE (-leave)';
      btnQueue.classList.remove('btn-primary');
      btnQueue.classList.add('btn-danger');

      seconds = 0;
      playBeep(440, 0.15);

      queueInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        queueTimer.textContent = `⏱️ ${mins}:${secs}`;
        
        const count = Math.min(10, Math.floor(seconds / 2) + 1);
        statusBanner.querySelector('span:first-child').textContent = `Searching for ${gameSelect.value} (${count}/10)...`;

        if (count === 10) {
          playFanfare();
          alert(`🔥 MATCH FOUND!\n\n${gameSelect.value} 5v5 Premier Scrim Server Ready! Click Accept in Widget!`);
          resetQueue();
        }
      }, 1000);

      chrome.runtime.sendMessage({ type: 'UPDATE_BADGE', text: 'SEARCH' });
    } else {
      resetQueue();
    }
  });

  function resetQueue() {
    inQueue = false;
    if (queueInterval) clearInterval(queueInterval);
    btnQueue.innerHTML = '<span>⚡</span> JOIN MATCHMAKING QUEUE (-join)';
    btnQueue.classList.remove('btn-danger');
    btnQueue.classList.add('btn-primary');
    statusBanner.querySelector('span:first-child').textContent = 'Status: Ready to Matchmake';
    queueTimer.textContent = '⏱️ 00:00';
    chrome.runtime.sendMessage({ type: 'UPDATE_BADGE', text: '' });
  }

  // Inject On-Page Floating Widget
  const btnInject = document.getElementById('extBtnInjectWidget');
  btnInject.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { 
        type: 'INJECT_FLOATING_WIDGET', 
        game: gameSelect.value 
      }, (response) => {
        if (chrome.runtime.lastError) {
          // If content script not loaded, execute script directly
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }, () => {
            chrome.tabs.sendMessage(tab.id, { type: 'INJECT_FLOATING_WIDGET', game: gameSelect.value });
          });
        }
      });
      alert(`📌 Widget Injected!\n\nFloating CustomLobbies Matchmaking Widget is now live on ${tab.title || 'active tab'}!`);
    }
  });

  // Map Veto Chips
  const mapChips = document.querySelectorAll('.map-chip');
  let currentTurn = 'Team Alpha';

  mapChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.classList.contains('banned')) {
        chip.classList.remove('banned');
      } else {
        chip.classList.add('banned');
        currentTurn = currentTurn === 'Team Alpha' ? 'Team Bravo' : 'Team Alpha';
        const turnText = document.getElementById('extVetoTurnText');
        if (turnText) turnText.textContent = `${currentTurn === 'Team Alpha' ? '🔵' : '🔴'} TURN: ${currentTurn} Ban Phase`;
        playBeep(300, 0.1);
      }
    });
  });

  // Coin Flip
  const btnFlip = document.getElementById('extBtnFlipCoin');
  if (btnFlip) {
    btnFlip.addEventListener('click', () => {
      const winner = Math.random() < 0.5 ? 'Team Alpha' : 'Team Bravo';
      currentTurn = winner;
      const turnText = document.getElementById('extVetoTurnText');
      if (turnText) turnText.textContent = `🪙 COIN TOSS WINNER: ${winner} (Gets First Ban)!`;
      playFanfare();
    });
  }

  // Claim Points Giveaway
  const btnClaim = document.getElementById('extBtnClaimPoints');
  if (btnClaim) {
    btnClaim.addEventListener('click', () => {
      playFanfare();
      alert('🎁 GIVEAWAY CLAIMED!\n\n+100 CL-Points added to your CustomLobbies Esports Wallet!');
    });
  }

  // Desktop Screen Capture
  const btnCapture = document.getElementById('extBtnStartCapture');
  if (btnCapture) {
    btnCapture.addEventListener('click', () => {
      if (chrome.desktopCapture) {
        chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab'], (streamId) => {
          if (streamId) {
            alert(`🖥️ Stream Capture Active!\nStream ID: ${streamId.slice(0, 10)}... Handing off to OBS Studio / CustomLobbies Stream Node!`);
          }
        });
      } else {
        alert('🖥️ Desktop Capture initialized for active Chrome tab!');
      }
    });
  }

  // Audio Synthesizer via Web Audio API
  function playBeep(freq = 440, duration = 0.1) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function playFanfare() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.2);
      });
    } catch (e) {}
  }
});
