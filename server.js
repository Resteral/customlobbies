require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3002; // Dynamically bound port for platforms like Railway or local testing

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const rawPath = req.url.split('?')[0];
  const urlPath = rawPath.toLowerCase();

  // ── /clicker shortcut ─────────────────────────────────────────────
  if (urlPath === '/clicker') {
    res.writeHead(302, { Location: '/clicker.html' });
    res.end();
    return;
  }

  // ── Static file — has a file extension, serve normally ────────────
  const extname = path.extname(urlPath);
  if (extname) {
    const filePath = path.join(__dirname, rawPath);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404); res.end('Not found');
      } else {
        const mime = MIME_TYPES[extname] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content, 'utf-8');
      }
    });
    return;
  }

  // ── Dynamic profile route: /username ──────────────────────────────
  // Any single-segment path (e.g. /resteral, /tofushark) is treated as
  // a player profile URL. The server injects __PROFILE_PLAYER__ into the
  // HTML; the client resolves whether that player actually exists.
  const segments = urlPath.split('/').filter(Boolean);
  if (segments.length === 1 && segments[0] !== 'index') {
    const slug = segments[0]; // e.g. "resteral"
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, 'utf-8', (err, html) => {
      if (err) { res.writeHead(500); res.end('Server Error'); return; }
      const injected = html.replace('</head>', `
  <script>
    /* Profile route: /${slug} */
    window.__PROFILE_SLUG__ = ${JSON.stringify(slug)};
  </script>
</head>`);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(injected, 'utf-8');
    });
    return;
  }

  // ── Root / → index.html ───────────────────────────────────────────
  fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
    if (err) { res.writeHead(500); res.end('Server Error'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content, 'utf-8');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// Start the Discord bot in the same process if a token is configured
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
if (DISCORD_BOT_TOKEN && DISCORD_BOT_TOKEN !== 'YOUR_DISCORD_BOT_TOKEN') {
  console.log('DISCORD_BOT_TOKEN detected in environment. Initializing Discord bot...');
  try {
    require('./bot.js');
  } catch (error) {
    console.error('Failed to load or start Discord bot:', error);
  }
} else {
  console.log('No DISCORD_BOT_TOKEN found or it is using the placeholder. Operating in Web Simulator mode only.');
}
