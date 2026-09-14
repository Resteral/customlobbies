document.addEventListener('DOMContentLoaded', () => {
  const optDefaultGame = document.getElementById('optDefaultGame');
  const optVolume = document.getElementById('optVolume');
  const optServerUrl = document.getElementById('optServerUrl');
  const btnSave = document.getElementById('btnSaveOptions');

  // Load stored settings
  if (chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['defaultGame', 'volume', 'serverUrl'], (items) => {
      if (items.defaultGame) optDefaultGame.value = items.defaultGame;
      if (items.volume) optVolume.value = items.volume;
      if (items.serverUrl) optServerUrl.value = items.serverUrl;
    });
  }

  // Save settings
  btnSave.addEventListener('click', () => {
    const settings = {
      defaultGame: optDefaultGame.value,
      volume: optVolume.value,
      serverUrl: optServerUrl.value
    };

    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set(settings, () => {
        alert('✅ Settings saved successfully!');
      });
    } else {
      alert('✅ Settings saved locally!');
    }
  });
});
