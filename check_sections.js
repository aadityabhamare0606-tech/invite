const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

// Find all section definitions and their class names
const sections = [...js.matchAll(/className="([a-z-]*section[a-z-]*)"/g)];
console.log('Section class names:');
sections.forEach(m => console.log(' ', m[1]));

// Find bg-related patterns
const bgPatterns = [...js.matchAll(/background["']?\s*[:=]\s*["']([^"']{0,50})["']/g)];
console.log('\nBackground patterns:');
bgPatterns.forEach(m => console.log(' ', m[1].substring(0, 50)));

// Find color patterns in sections
const colorPatterns = [...js.matchAll(/#[a-fA-F0-9]{3,8}/g)];
const uniqueColors = [...new Set(colorPatterns.map(m => m[0]))];
console.log('\nUnique colors found:', uniqueColors.slice(0, 30).join(', '));

// Find the section wrapper classes
const sectionWrappers = [...js.matchAll(/className="([a-z-]*section[a-z-]*)"/g)];
console.log('\nAll section wrappers:');
sectionWrappers.forEach(m => console.log(' ', m[1]));

// Search for bg classes
const bgClasses = [...js.matchAll(/className="([a-z-]*bg[a-z-]*)"/g)];
console.log('\nBackground-related classes:');
bgClasses.forEach(m => console.log(' ', m[1]));

// Find all className="..." patterns that contain 'bg' or 'section' or 'div' with style
const allClasses = [...js.matchAll(/className="([^"]*bg[^"]*|[^"]*section[^"]*|[^"]*bg-[^"]*)"/g)];
console.log('\nAll bg/section classes:');
allClasses.forEach(m => console.log(' ', m[1]));
