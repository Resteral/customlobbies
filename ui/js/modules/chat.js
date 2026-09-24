// Roleplay Chat Module
window.Chat = {
  init() {
    const input = document.getElementById('chat-input');
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const text = input.value.trim();
        if (text) {
          if (window.CityUndergroundCore) {
            window.CityUndergroundCore.sendChatMessage(text);
          }
          input.value = '';
        }
      }
    });
  },

  addMessage(channel, sender, text) {
    const msgBox = document.getElementById('chat-messages');
    if (!msgBox) return;

    const colors = {
      LOCAL: '#f8fafc',
      WHISPER: '#94a3b8',
      SHOUT: '#f59e0b',
      ME: '#c084fc',
      DO: '#38bdf8',
      OOC: '#64748b',
      PM: '#ec4899',
      SYS: '#10b981'
    };

    const color = colors[channel] || '#f8fafc';
    const row = document.createElement('div');
    row.className = 'chat-msg';
    row.style.color = color;

    if (channel === 'ME' || channel === 'DO') {
      row.innerHTML = `<span>${text}</span>`;
    } else {
      row.innerHTML = `<span class="chat-sender">${sender}:</span> <span>${text}</span>`;
    }

    msgBox.appendChild(row);
    msgBox.scrollTop = msgBox.scrollHeight;
  }
};
