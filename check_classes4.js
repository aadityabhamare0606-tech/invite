const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

// Find className patterns with double quotes
const doubleQ = [...js.matchAll(/className:([^,}]+)/g)];
console.log('className: matches:', doubleQ.length);
doubleQ.slice(0, 20).forEach(m => console.log(' ', m[0].substring(0, 80)));

// Find all unique class strings
const classStrings = [...js.matchAll(/"([a-z-]+)"[^}]{0,10}className|className[^}]{0,20}"([a-z-]+)"/g)];
console.log('\nMore class matches:', classStrings.length);

// Just search for specific keywords
const keywords = ['bg-', 'bg:', 'section', 'card', 'gallery', 'faq', 'trust', 'testimonial', 'how-it', 'feel', 'footer'];
console.log('\nKeyword search:');
keywords.forEach(kw => {
  const matches = [...js.matchAll(kw + '[^a-z-]{0,20}')];
  const unique = [...new Set(matches.map(m => m[0].substring(0, 40)))];
  if (unique.length > 0) {
    console.log(` ${kw}: ${unique.slice(0, 5).join(', ')}`);
  }
});
