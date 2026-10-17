// Copies app.html to app/<view>.html so every /app/* URL is a real static file on Vercel
// (no rewrite rules needed). Run after editing app.html:  node scripts-sync-app-pages.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/app.html', 'utf8');
fs.mkdirSync(__dirname + '/app', { recursive: true });
for (const v of ['video', 'history', 'saved', 'account', 'settings', 'admin', 'generate']) {
  fs.writeFileSync(`${__dirname}/app/${v}.html`, src);
}
console.log('synced app/*.html');
