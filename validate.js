const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check bracket balance in script sections
const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.log("ERROR: No babel script found"); process.exit(1); }
const js = scriptMatch[1];

let curly = 0, square = 0, paren = 0;
for (const ch of js) {
  if (ch === '{') curly++;
  if (ch === '}') curly--;
  if (ch === '[') square++;
  if (ch === ']') square--;
  if (ch === '(') paren++;
  if (ch === ')') paren--;
}

console.log(`Curly: ${curly}, Square: ${square}, Paren: ${paren}`);
if (curly !== 0 || square !== 0 || paren !== 0) {
  console.log("ERROR: Unbalanced brackets!");
  process.exit(1);
} else {
  console.log("OK: All brackets balanced");
}

// Check HTML structure
const openTags = (html.match(/<div/g) || []).length;
const closeTags = (html.match(/<\/div>/g) || []).length;
console.log(`HTML divs: open=${openTags} close=${closeTags}`);

console.log("File size:", (html.length / 1024).toFixed(1), "KB");
console.log("VALIDATION PASSED");
