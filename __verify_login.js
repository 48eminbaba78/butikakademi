const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  // Önce DB email'lerini güncelle
  await page.goto('http://localhost:8080/fix_demo_accounts.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Inline update script çalıştır
  const updateResult = await page.evaluate(async () => {
    const results = [];
    // Coach email güncelle
    const { data: d1, error: e1 } = await db.from('users')
      .update({ email: 'demokoc@rostrumakademi.com' })
      .eq('username', 'demokoc')
      .select('username, email');
    results.push({ op: 'koç email', ok: !e1, data: d1?.[0]?.email, err: e1?.message });

    // Student email güncelle
    const { data: d2, error: e2 } = await db.from('users')
      .update({ email: 'demoogrenci@rostrumakademi.com' })
      .eq('username', 'demoogrenci')
      .select('username, email');
    results.push({ op: 'öğrenci email', ok: !e2, data: d2?.[0]?.email, err: e2?.message });

    return results;
  });
  console.log('DB email güncelleme:', JSON.stringify(updateResult, null, 2));

  await browser.close();

  // Şimdi tüm login senaryolarını test et
  const browser2 = await chromium.launch({ headless: true });
  const ctx2 = await browser2.newContext({ viewport: { width: 1400, height: 900 } });
  const page2 = await ctx2.newPage();

  const scenarios = [
    { tab: 'email', user: 'demokoc',                     pass: 'koc123',    label: '📧 E-posta tab + kullanıcı adı' },
    { tab: 'email', user: 'demokoc@rostrumakademi.com',  pass: 'koc123',    label: '📧 E-posta tab + @rostrumakademi.com' },
    { tab: 'email', user: 'demokoc@butikakademi.com',    pass: 'koc123',    label: '📧 E-posta tab + @butikakademi.com' },
    { tab: 'user',  user: 'demokoc',                     pass: 'koc123',    label: '👤 Kullanıcı Adı tab' },
    { tab: 'email', user: 'demoogrenci',                 pass: 'ogrenci123',label: '📧 Öğrenci - kullanıcı adı' },
    { tab: 'user',  user: 'demoogrenci',                 pass: 'ogrenci123',label: '👤 Öğrenci - kullanıcı adı tabı' },
  ];

  console.log('\n=== GİRİŞ SENARYOLARI ===');
  for (const s of scenarios) {
    await page2.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
    await page2.waitForTimeout(400);

    if (s.tab === 'user') {
      await page2.click('button.login-tab[onclick*="username"]');
      await page2.waitForTimeout(150);
      await page2.fill('#loginUser', s.user);
    } else {
      await page2.fill('#loginEmail', s.user);
    }
    await page2.fill('#loginPass', s.pass);
    await page2.click('.btn-login');
    await page2.waitForTimeout(5000);

    const result = await page2.evaluate(() => ({
      ok: document.getElementById('appShell')?.classList.contains('visible'),
      err: document.querySelector('.login-error, #loginErr, .err')?.textContent?.trim() || ''
    }));

    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${s.label}: ${result.ok ? 'BAŞARILI' : 'BAŞARISIZ — ' + result.err}`);
  }

  await browser2.close();
})();
