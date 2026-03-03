const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const match = html.match(/TEMPLATE_CATEGORIES\s*=\s*\[([\s\S]*?)\n    \];/);
if (!match) { console.log('Not found'); process.exit(1); }

const cats = match[1].split(/\{\s*id:/g).filter(Boolean);
let total = 0;
cats.forEach(cat => {
  const id = (cat.match(/'([^']+)'/) || ['','?'])[1];
  const nameField = (cat.match(/name:\s*'([^']+)'/) || ['','?'])[1];
  const count = (cat.match(/\{ name:/g) || []).length;
  total += count;
  console.log(id.padEnd(22) + nameField.padEnd(30) + count + ' templates');
});
console.log('---');
console.log('TOTAL: ' + total + ' templates');
