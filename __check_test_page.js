const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: {width:600,height:500} })).newPage();
  await page.goto('http://localhost:8080/test.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4500);
  await page.screenshot({ path: 'c:\\Users\\user\\Desktop\\Rostrum Akademi\\test_ss\\test_page.png', fullPage: true });
  const tag = await page.locator('#statusTag').textContent();
  const vals = await Promise.all(['valDomain','valSupabase','valApp'].map(id =>
    page.locator('#'+id).textContent()
  ));
  console.log('Status:', tag.trim());
  console.log('Domain:', vals[0]);
  console.log('Supabase:', vals[1]);
  console.log('app.html:', vals[2]);
  await browser.close();
})();
