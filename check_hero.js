const fs = require('fs');
const js = fs.readFileSync('D:\\Firefox\\NEW\\invite\\public\\demos\\demo-3\\assets\\index-YMWjVkqv.js', 'utf8');

const heroRefs = [...js.matchAll(/className=["'][^"']*hero[^"']*["']/g)];
console.log('Hero class references:', heroRefs.length);
heroRefs.forEach(m => console.log(' ', m[0]));

const sectionStart = js.indexOf('hero');
if (sectionStart > 0) {
  const context = js.substring(Math.max(0, sectionStart-300), sectionStart+300);
  console.log('\nContext around first "hero":');
  console.log(context);
}
