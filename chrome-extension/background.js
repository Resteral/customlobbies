// CustomLobbies.com Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 CustomLobbies.com Chrome Extension Installed successfully');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_CAPTURE') {
    console.log('Starting desktop media capture with streamId:', message.streamId);
    sendResponse({ status: 'STREAM_STARTED', streamId: message.streamId });
  }
});
