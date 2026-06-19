const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  page.on('response', async r => {
    if (r.url().includes('supabase') && r.url().includes('token')) {
      console.log('[AUTH]', r.status(), await r.text().catch(() => '(no body)'));
    }
  });

  const testCreds = [
    { user: 'demokoc@rostrumakademi.com', pass: 'koc123', note: 'demokoc email' },
    { user: 'dev@rostrumakademi.com',     pass: 'dev123', note: 'developer' },
    { user: 'dev',                         pass: 'dev123', note: 'dev username' },
    { user: 'demokoc',                     pass: 'Koc123', note: 'uppercase' },
    { user: 'demokoc',                     pass: 'demo123', note: 'demo123' },
  ];

  for (const c of testCreds) {
    await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    if (!c.user.includes('@')) {
      await page.click('button.login-tab[onclick*="username"]');
      await page.waitForTimeout(200);
      await page.fill('#loginUser', c.user);
    } else {
      await page.fill('#loginEmail', c.user);
    }
    await page.fill('#loginPass', c.pass);
    await page.click('.btn-login');
    await page.waitForTimeout(4000);

    const visible = await page.evaluate(() => document.getElementById('appShell')?.classList.contains('visible'));
    const errText = await page.locator('.login-error, #loginErr, .err').textContent().catch(() => '');
    console.log(`[${c.note}] ${c.user}/${c.pass} => login=${visible} err="${errText.trim()}"`);

    if (visible) {
      console.log('*** SUCCESS with:', c.note, c.user, c.pass);
      const role = await page.textContent('#sbRole').catch(() => '');
      console.log('    Role:', role.trim());
      break;
    }
  }

  await browser.close();
})();
