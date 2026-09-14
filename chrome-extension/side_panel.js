document.addEventListener('DOMContentLoaded', () => {
  const btnQueue = document.getElementById('spBtnQueue');
  const statusText = document.getElementById('spStatusText');
  const timerText = document.getElementById('spTimer');
  const gameSelect = document.getElementById('spGameSelect');

  let inQueue = false;
  let interval = null;
  let seconds = 0;

  btnQueue.addEventListener('click', () => {
    inQueue = !inQueue;

    if (inQueue) {
      btnQueue.innerHTML = '<span>❌</span> LEAVE QUEUE (-leave)';
      btnQueue.classList.remove('btn-primary');
      btnQueue.classList.add('btn-danger');
      seconds = 0;

      interval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerText.textContent = `⏱️ ${mins}:${secs}`;
        const count = Math.min(10, Math.floor(seconds / 2) + 1);
        statusText.textContent = `Searching (${count}/10)...`;

        if (count === 10) {
          clearInterval(interval);
          alert(`🔥 MATCH READY!\n\n${gameSelect.value} 128-tick Dedicated Server Connected!`);
          resetQueue();
        }
      }, 1000);
    } else {
      resetQueue();
    }
  });

  function resetQueue() {
    inQueue = false;
    if (interval) clearInterval(interval);
    btnQueue.innerHTML = '<span>⚡</span> JOIN MATCHMAKING QUEUE (-join)';
    btnQueue.classList.remove('btn-danger');
    btnQueue.classList.add('btn-primary');
    statusText.textContent = 'Status: Idle';
    timerText.textContent = '⏱️ 00:00';
  }
});
