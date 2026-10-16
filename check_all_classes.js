const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\demos\demo-3\assets\index-YMWjVkqv.js', 'utf8');

// Find all section JSX definitions
const sectionDefs = [...js.matchAll(/s\.jsxs?\(\s*"(section|div)"[\s\S]{0,200}?className="([^"]*)"/g)];
console.log('Section JSX definitions:');
sectionDefs.forEach(m => console.log(' ', m[2]));

// Find all className patterns
const allClassNames = [...js.matchAll(/className="([^"]+)"/g)];
const classSet = new Set(allClassNames.map(m => m[1]));
console.log('\nAll unique class names (' + classSet.size + '):');
[...classSet].sort().forEach(c => console.log(' ', c));
