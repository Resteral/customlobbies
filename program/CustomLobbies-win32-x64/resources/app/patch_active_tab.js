const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update nav buttons
html = html.replace('class="nav-btn active" data-tab="lobbies-view"', 'class="nav-btn" data-tab="lobbies-view"');
html = html.replace('class="nav-btn" data-tab="community-view"', 'class="nav-btn active" data-tab="community-view"');

html = html.replace('class="nav-btn active" data-tab="lobbies-view" onclick=', 'class="nav-btn" data-tab="lobbies-view" onclick=');
html = html.replace('class="nav-btn" data-tab="community-view" onclick=', 'class="nav-btn active" data-tab="community-view" onclick=');

// Update sections
html = html.replace('<section id="lobbies-view" class="view-section active">', '<section id="lobbies-view" class="view-section">');
html = html.replace('<section id="community-view" class="view-section">', '<section id="community-view" class="view-section active">');

fs.writeFileSync('index.html', html);
console.log('Swapped default active tab to community-view!');
