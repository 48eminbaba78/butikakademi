const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  const logs = [];
  page.on('pageerror', e => { logs.push('JS_ERR: ' + e.message); console.log('JS_ERR:', e.message); });
  page.on('console', m => { logs.push(m.type() + ': ' + m.text()); console.log('[CON]', m.type(), m.text()); });

  await page.goto('http://localhost:8080/app.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test_ss/debug_01_initial.png' });

  // Check login screen
  const loginVisible = await page.locator('#loginScreen').isVisible();
  console.log('Login screen visible:', loginVisible);

  // Print buttons on login screen
  const buttons = await page.locator('button').allTextContents();
  console.log('Buttons:', JSON.stringify(buttons));

  // Try username mode login
  const usernameTab = await page.locator('button.login-tab[onclick*="username"]').count();
  console.log('Username tab button count:', usernameTab);

  if (usernameTab > 0) {
    await page.click('button.login-tab[onclick*="username"]');
    await page.waitForTimeout(300);
  }

  const userFieldVisible = await page.locator('#loginUser').isVisible().catch(() => false);
  console.log('Username field visible after tab click:', userFieldVisible);

  await page.fill('#loginUser', 'demokoc');
  await page.fill('#loginPass', 'koc123');
  await page.screenshot({ path: 'test_ss/debug_02_before_login.png' });

  // Listen for network requests
  page.on('response', async r => {
    if (r.url().includes('supabase')) {
      console.log('[NET]', r.status(), r.url().substring(0, 80));
    }
  });

  await page.click('.btn-login');
  await page.waitForTimeout(8000); // wait longer

  await page.screenshot({ path: 'test_ss/debug_03_after_login.png' });

  const appShellClass = await page.evaluate(() => document.getElementById('appShell')?.className);
  const loginScreenDisplay = await page.evaluate(() => document.getElementById('loginScreen')?.style.display);
  const errorEl = await page.locator('.login-error, #loginErr, .err').textContent().catch(() => '');

  console.log('appShell classes:', appShellClass);
  console.log('loginScreen display:', loginScreenDisplay);
  console.log('Error element text:', errorEl);

  await browser.close();
})();
