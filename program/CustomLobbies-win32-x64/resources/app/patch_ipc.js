const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('desktopMinBtn.addEventListener')) {
  const scriptInjection = `
  <script>
    if (typeof require !== 'undefined') {
      const { ipcRenderer } = require('electron');
      const minBtn = document.getElementById('desktopMinBtn');
      const maxBtn = document.getElementById('desktopMaxBtn');
      const closeBtn = document.getElementById('desktopCloseBtn');
      
      if (minBtn) minBtn.addEventListener('click', () => ipcRenderer.send('window-minimize'));
      if (maxBtn) maxBtn.addEventListener('click', () => ipcRenderer.send('window-maximize'));
      if (closeBtn) closeBtn.addEventListener('click', () => ipcRenderer.send('window-close'));
    }
  </script>
</body>`;
  html = html.replace('</body>', scriptInjection);
  fs.writeFileSync('index.html', html);
  console.log('Injected IPC window controls');
}
