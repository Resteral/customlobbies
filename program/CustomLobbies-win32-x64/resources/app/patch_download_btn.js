const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const buttonHtml = `
      <a href="CustomLobbies-Desktop-App.zip" download class="nav-btn" style="background: var(--accent-purple); color: white; border: 1px solid #b9a3e3; font-weight: 900; text-decoration: none; padding: 0.5rem 1rem; border-radius: 6px; display: flex; align-items: center; gap: 0.5rem; margin-right: 1rem;">
        <span>⬇️</span> Download App
      </a>
`;

if (!html.includes('CustomLobbies-Desktop-App.zip')) {
  html = html.replace('<div class="nav-dropdown-wrapper">', buttonHtml + '\n      <div class="nav-dropdown-wrapper">');
  fs.writeFileSync('index.html', html);
  console.log('Added Download App button!');
}
