const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.click('button.login-tab[onclick*="username"]');
  await page.fill('#loginUser', 'demokoc');
  await page.fill('#loginPass', 'koc123');
  await page.click('.btn-login');
  await page.waitForFunction(() => document.getElementById('appShell')?.classList.contains('visible'), { timeout: 15000 });
  await page.waitForTimeout(1500);

  await page.locator('.sb-item').filter({ hasText: /öğrenci/i }).first().click();
  await page.waitForTimeout(1200);
  await page.locator('.stu-row').first().click();
  await page.waitForTimeout(1500);

  // Dump the visible main content (look for student detail area)
  const detailHTML = await page.evaluate(() => {
    const v = document.querySelector('.view.active, [id*="student"], [id*="stu-detail"], #view-student, .stu-detail');
    if (v) return v.innerHTML.substring(0, 3000);
    // find all visible views
    const views = Array.from(document.querySelectorAll('.view')).filter(el => el.style.display !== 'none');
    return views.map(v => v.id + ': ' + v.innerHTML.substring(0, 500)).join('\n---\n');
  });
  console.log('DETAIL HTML:\n', detailHTML.substring(0, 2000));
  fs.writeFileSync('test_ss/debug_student_detail.txt', detailHTML);

  // Look for any buttons with "program" in onclick
  const programBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, [onclick]'))
      .filter(el => (el.getAttribute('onclick') || '').toLowerCase().includes('program') || 
                    el.textContent.toLowerCase().includes('program'))
      .map(el => el.tagName + ' onclick="' + el.getAttribute('onclick') + '" text="' + el.textContent.trim().substring(0,50) + '"');
  });
  console.log('Program-related elements:', JSON.stringify(programBtns, null, 2));

  await page.screenshot({ path: 'test_ss/debug_student_detail.png', fullPage: false });
  console.log('Screenshot taken');

  await browser.close();
})();
