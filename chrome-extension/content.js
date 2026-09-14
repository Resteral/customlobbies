// CustomLobbies.com Chrome Extension Content Script
console.log('🎮 CustomLobbies Assistant Content Script Initialized');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TRIGGER_ALERT') {
    const alertBanner = document.createElement('div');
    alertBanner.style.cssText = `
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(10, 12, 16, 0.95);
      border: 3px solid #00f2fe;
      border-radius: 16px;
      padding: 20px 40px;
      color: #fff;
      font-size: 24px;
      font-weight: 900;
      text-align: center;
      box-shadow: 0 0 30px rgba(0, 242, 254, 0.5);
      z-index: 1000000;
    `;
    alertBanner.innerHTML = `
      <div style="color: #00f2fe; font-size: 28px;">NEW FOLLOWER!</div>
      <div style="font-size: 18px; font-weight: 600; margin-top: 8px;">${request.username || 'NightHawk99'} just followed!</div>
    `;
    document.body.appendChild(alertBanner);

    setTimeout(() => alertBanner.remove(), 4000);
  }
});
