const fs = require('fs');
const js = fs.readFileSync('D:/Firefox/NEW/invite/public/demos/demo-3/assets/index-YMWjVkqv.js', 'utf8');

// Find all component definitions (Kf, Xf, Jf, qf, ed, td, nd, id)
const components = [...js.matchAll(/const\s+(\w+)=.*?s\.jsxs?\("section"/g)];
console.log('Component definitions:', components.length);
components.forEach(c => console.log(' ', c[1]));

// Find all className patterns with bg colors
const bgClasses = [...js.matchAll(/bg-\[([^]]+)\]/g)];
console.log('\nAll bg colors:');
const bgSet = new Set(bgClasses.map(m => m[1]));
[...bgSet].forEach(b => console.log(' ', b));

// Find section structures
const sectionBg = [...js.matchAll(/className:"([^"]*overflow[^"]*)"/g)];
console.log('\nOverflow class patterns:');
const overflowSet = new Set(sectionBg.map(m => m[1]));
[...overflowSet].forEach(s => console.log(' ', s));

// Find frontBg patterns
const frontBg = [...js.matchAll(/frontBg:"([^"]*)"/g)];
console.log('\nfrontBg values:');
frontBg.forEach(m => console.log(' ', m[1]));
