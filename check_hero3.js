const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

// Find hero-section
const idx = js.indexOf('hero-section');
if (idx > 0) {
  console.log('Found at index:', idx);
  const context = js.substring(Math.max(0, idx-100), idx + 2000);
  console.log(context);
} else {
  console.log('hero-section not found');
  // Try other patterns
  const alt = js.indexOf('hero_iris');
  console.log('hero_iris:', alt);
  const alt2 = js.indexOf('heroSection');
  console.log('heroSection:', alt2);
}
