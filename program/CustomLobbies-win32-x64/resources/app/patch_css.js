const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('.desktop-program-titlebar {')) {
  const cssInjection = `
    .desktop-program-titlebar {
      -webkit-app-region: drag;
      user-select: none;
    }
    .desktop-program-titlebar button, .desktop-program-titlebar a, .desktop-program-titlebar input {
      -webkit-app-region: no-drag;
    }
  `;
  html = html.replace('</style>', cssInjection + '\n  </style>');
  fs.writeFileSync('index.html', html);
  console.log('Injected webkit drag css');
}
