import fs from 'fs';
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

const matches = [...js.matchAll(/className="([a-zA-Z0-9_-]*hero[a-zA-Z0-9_-]*)"/g)];
const unique = [...new Set(matches.map(m => m[1]))];
console.log('Hero-related class names:');
unique.forEach(m => console.log(' ', m));
