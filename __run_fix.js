const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await ctx.newPage();

  page.on('console', m => console.log('[CON]', m.type(), m.text().substring(0, 150)));
  page.on('pageerror', e => console.log('[ERR]', e.message));

  await page.goto('http://localhost:8080/fix_demo_accounts.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('=== fix_demo_accounts.html loaded ===');

  // Click Fix button
  await page.click('button:has-text("Tüm Demo Hesapları Düzelt")');
  await page.waitForTimeout(5000);

  // Read log output
  const logText = await page.locator('#log').textContent();
  console.log('=== LOG OUTPUT ===');
  console.log(logText);

  await page.screenshot({ path: 'test_ss/fix_accounts_result.png', fullPage: true });

  await browser.close();
})();
