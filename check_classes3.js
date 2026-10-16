const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

// Find all class references
const allClasses = [...js.matchAll(/className=["']([^"']+)["']/g)];
console.log('className matches:', allClasses.length);
const classSet = new Set(allClasses.map(m => m[1]));
console.log('Unique classes (' + classSet.size + '):');
[...classSet].sort().forEach(c => {
  if (c.includes('bg') || c.includes('section') || c.includes('div') || c.includes('card') || c.includes('gallery') || c.includes('event') || c.includes('faq') || c.includes('trust') || c.includes('testimonial')) {
    console.log(' ', c);
  }
});
console.log('\nAll classes (filtered):');
[...classSet].sort().forEach(c => {
  if (!c.match(/^font-/)) console.log(' ', c);
});
