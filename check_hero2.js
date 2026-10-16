const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

const sectionStart = js.indexOf('className="hero-section"');
if (sectionStart > 0) {
  const context = js.substring(sectionStart, sectionStart + 3000);
  console.log('Hero section JSX:');
  console.log(context);
}
