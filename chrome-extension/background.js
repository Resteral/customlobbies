// CustomLobbies.com Manifest V3 Background Service Worker
console.log('🚀 CustomLobbies Chrome Extension Service Worker Initialized');

chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ CustomLobbies Extension Installed successfully');
  
  // Set default badge
  chrome.action.setBadgeText({ text: 'LIVE' });
  chrome.action.setBadgeBackgroundColor({ color: '#00e5ff' });

  // Create context menu for right-clicking any text on webpages
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'cl-queue-selection',
      title: '⚡ Queue on CustomLobbies for "%s"',
      contexts: ['selection']
    });
  }
});

// Context Menu click listener
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cl-queue-selection' && tab?.id) {
      const selectedGame = info.selectionText;
      chrome.tabs.sendMessage(tab.id, {
        type: 'INJECT_FLOATING_WIDGET',
        game: selectedGame
      });
    }
  });
}

// Message Listener from Popup / Content Scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    chrome.action.setBadgeText({ text: message.text || '' });
    if (message.text === 'SEARCH') {
      chrome.action.setBadgeBackgroundColor({ color: '#ff9800' });
    } else {
      chrome.action.setBadgeBackgroundColor({ color: '#00e5ff' });
    }
    sendResponse({ status: 'BADGE_UPDATED' });
  }

  if (message.type === 'START_CAPTURE') {
    console.log('Starting desktop media capture with streamId:', message.streamId);
    sendResponse({ status: 'STREAM_STARTED', streamId: message.streamId });
  }
});
