const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

const allClassNames = [...js.matchAll(/className="([^"]+)"/g)];
const classSet = new Set(allClassNames.map(m => m[1]));
console.log('All unique class names (' + classSet.size + '):');
[...classSet].sort().forEach(c => console.log(' ', c));
