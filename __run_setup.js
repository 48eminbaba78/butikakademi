const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  const logs = [];
  page.on('console', m => {
    console.log('[LOG]', m.type(), m.text().substring(0, 200));
    logs.push(m.text());
  });
  page.on('pageerror', e => console.log('[ERR]', e.message));

  await page.goto('http://localhost:8080/setup.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('=== setup.html yüklendi ===');

  // Buttons on page
  const btns = await page.locator('button').allTextContents();
  console.log('Buttons:', JSON.stringify(btns));

  // Find and click demo data setup button
  const setupBtn = page.locator('button').filter({ hasText: /demo|kurulum|oluştur|başlat|setup|yükle/i }).first();
  if (await setupBtn.count() > 0) {
    const btnText = await setupBtn.textContent();
    console.log('Clicking button:', btnText.trim());
    await setupBtn.click();
    // Wait for setup to complete (up to 30s)
    await page.waitForTimeout(15000);
  } else {
    console.log('Setup butonu bulunamadı — tüm butonlar:', JSON.stringify(btns));
  }

  // Check result
  const bodyText = await page.locator('body').textContent();
  const successLines = bodyText.split('\n').filter(l => l.includes('✅') || l.includes('ok') || l.includes('başarı')).slice(0, 10);
  console.log('Success lines:', successLines.join(' | '));

  await page.screenshot({ path: 'test_ss/setup_result.png', fullPage: true });
  console.log('Screenshot saved: test_ss/setup_result.png');

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('=== DONE ===');
})();
