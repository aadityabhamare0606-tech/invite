const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\demos\demo-3\assets\index-YMWjVkqv.js', 'utf8');

// Find bg color patterns
const bgColors = [...js.matchAll(/bg-\[([^]]+)\]/g)];
console.log('bg-[...] patterns:');
const bgSet = new Set(bgColors.map(m => m[1]));
[...bgSet].forEach(b => console.log(' ', b));

// Find section/div structures
const sections = [...js.matchAll(/s\.jsxs?\("section"/g)];
console.log('\nSection JSX calls:', sections.length);

// Find all s.jsxs("section" or s.jsx("section" calls with context
const sectionContext = [...js.matchAll(/s\.jsxs?\("section",\{className:"([^"]*)"/g)];
console.log('Section className patterns:', sectionContext.length);
sectionContext.forEach(m => console.log(' ', m[1]));

// Find all background gradients
const gradients = [...js.matchAll(/linear-gradient\([^)]+\)/g)];
console.log('\nAll linear-gradient patterns:');
const gradSet = new Set(gradients.map(m => m[0]));
[...gradSet].forEach(g => console.log(' ', g.substring(0, 80)));

// Find div sections
const divSections = [...js.matchAll(/className="([^"]*card[^"]*|[^"]*gallery[^"]*|[^"]*faq[^"]*|[^"]*trust[^"]*|[^"]*event[^"]*|[^"]*how[^"]*|[^"]*feel[^"]*|[^"]*footer[^"]*|[^"]*collection[^"]*)/g)];
console.log('\nSection-related classes:');
const divSet = new Set(divSections.map(m => m[1]));
[...divSet].forEach(d => console.log(' ', d));
