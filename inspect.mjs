import { chromium } from 'playwright';

async function main() {
  const b = await chromium.launch({headless: true});
  const p = await b.newPage();
  await p.goto('http://localhost:3000/demos/demo-3/index.html', {waitUntil: 'networkidle'});
  await p.waitForTimeout(3000);

  const elements = await p.evaluate(() => {
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      const bg = cs.backgroundImage;
      const bgColor = cs.backgroundColor;
      if (bg && bg !== 'none') {
        results.push({tag: el.tagName, class: el.className, bg: bg.substring(0, 80), bgColor});
      }
    });
    return results;
  });

  console.log('Elements with bg images:', elements.length);
  elements.slice(0, 25).forEach(e => console.log(`  <${e.tag} class="${e.class}"> ${e.bg} | color: ${e.bgColor}`));

  // Also get page text to understand sections
  const text = await p.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log('\nPage text preview:');
  console.log(text);

  await b.close();
}

main().catch(console.error);
