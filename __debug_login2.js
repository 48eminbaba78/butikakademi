const { chromium } = require('playwright');

(async () => {
  // Kullanıcı adı tabıyla test et
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', m => { if(m.type()==='error') errors.push(m.text()); });

  // E-posta tab + demokoc (@ olmadan)
  await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.fill('#loginEmail', 'demokoc');
  await page.fill('#loginPass', 'koc123');
  await page.click('.btn-login');
  await page.waitForTimeout(5000);
  const r1 = await page.evaluate(() => ({
    appVisible: document.getElementById('appShell')?.classList.contains('visible'),
    errText: document.querySelector('.login-error, #loginErr, .err')?.textContent?.trim() || ''
  }));
  console.log('E-posta tab + "demokoc" + koc123 =>', JSON.stringify(r1));

  // E-posta tab + tam email
  await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.fill('#loginEmail', 'demokoc@rostrumakademi.com');
  await page.fill('#loginPass', 'koc123');
  await page.click('.btn-login');
  await page.waitForTimeout(5000);
  const r2 = await page.evaluate(() => ({
    appVisible: document.getElementById('appShell')?.classList.contains('visible'),
    errText: document.querySelector('.login-error, #loginErr, .err')?.textContent?.trim() || ''
  }));
  console.log('E-posta tab + "demokoc@rostrumakademi.com" + koc123 =>', JSON.stringify(r2));

  // E-posta tab + butikakademi.com email  
  await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.fill('#loginEmail', 'demokoc@butikakademi.com');
  await page.fill('#loginPass', 'koc123');
  await page.click('.btn-login');
  await page.waitForTimeout(5000);
  const r3 = await page.evaluate(() => ({
    appVisible: document.getElementById('appShell')?.classList.contains('visible'),
    errText: document.querySelector('.login-error, #loginErr, .err')?.textContent?.trim() || ''
  }));
  console.log('E-posta tab + "demokoc@butikakademi.com" + koc123 =>', JSON.stringify(r3));

  await browser.close();
  console.log('\nDB\'deki email:', 'demokoc@butikakademi.com');
  console.log('Login kodu oluşturuyor:', 'demokoc@rostrumakademi.com');
  console.log('=> FARK VAR! DB email != login kodunun aradığı email');
})();
