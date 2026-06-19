const { chromium } = require('playwright');
const fs = require('fs');
const SS_DIR = 'c:\\Users\\user\\Desktop\\Rostrum Akademi\\test_ss';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  // ── KAYNAKLARIM TEST ─────────────────────────────
  console.log('=== KAYNAKLARIM TEST ===');
  await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.click('button.login-tab[onclick*="username"]');
  await page.fill('#loginUser', 'demokoc');
  await page.fill('#loginPass', 'koc123');
  await page.click('.btn-login');
  await page.waitForFunction(() => document.getElementById('appShell')?.classList.contains('visible'), { timeout: 15000 });
  await page.waitForTimeout(1500);

  // Go directly to Kaynaklarım (first navigation, clean state)
  const resTab = page.locator('.sb-item').filter({ hasText: /kaynak/i }).first();
  console.log('Kaynaklarım tab count:', await resTab.count());
  await resTab.click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: SS_DIR + '/res_main.png' });

  const filterBar = page.locator('.cr-filter-bar');
  const barVisible = await filterBar.isVisible().catch(() => false);
  console.log('Filter bar visible:', barVisible);

  if (barVisible) {
    const barBox = await filterBar.boundingBox();
    console.log('Filter bar box:', barBox);

    const sBox = await page.locator('#crSearch').boundingBox();
    const eBox = await page.locator('#crExam').boundingBox();
    const subBox = await page.locator('#crSubject').boundingBox();
    console.log('search.y:', Math.round(sBox?.y), '| exam.y:', Math.round(eBox?.y), '| subj.y:', Math.round(subBox?.y));
    const sameRow = Math.abs(sBox.y - eBox.y) < 20 && Math.abs(sBox.y - subBox.y) < 20;
    console.log('All on same row:', sameRow, '✅');
  }

  // Test exam filter
  const examOpts = await page.locator('#crExam option').allTextContents();
  console.log('Exam options:', JSON.stringify(examOpts));

  // ── COACH PROFILE TEST ────────────────────────────
  console.log('\n=== KOÇ PROFİL TEST ===');
  const profileTab = page.locator('.sb-item').filter({ hasText: /profil/i }).first();
  console.log('Profile tab count:', await profileTab.count());
  await profileTab.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: SS_DIR + '/profile_main.png' });

  // Find inputs in active view
  const inputs = await page.evaluate(() => {
    const view = document.querySelector('.view.active');
    if (!view) return 'no active view';
    return Array.from(view.querySelectorAll('input, textarea')).map(el =>
      `${el.tagName}#${el.id} name=${el.name} placeholder=${el.placeholder}`
    );
  });
  console.log('Inputs in active view:', JSON.stringify(inputs, null, 2));

  const viewId = await page.evaluate(() => document.querySelector('.view.active')?.id || 'not found');
  console.log('Active view ID:', viewId);

  // Check two-column layout
  const gridCols = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*')).filter(el =>
      getComputedStyle(el).display === 'grid' &&
      getComputedStyle(el).gridTemplateColumns.includes(' ')
    );
    return els.map(el => ({ id: el.id, class: el.className.substring(0, 50), cols: getComputedStyle(el).gridTemplateColumns }));
  });
  console.log('Grid layouts:', JSON.stringify(gridCols.slice(0, 5)));

  // ── STUDENT PROGRAM TEST ──────────────────────────
  console.log('\n=== ÖĞRENCİ PROGRAM TEST ===');
  // Logout first
  try {
    const logoutBtn = page.locator('.sb-item').filter({ hasText: /çıkış/i }).first();
    await logoutBtn.click();
    await page.waitForSelector('#loginScreen', { state: 'visible', timeout: 5000 });
  } catch(e) {
    await page.goto('http://localhost:8080/app.html');
    await page.waitForSelector('#loginScreen', { state: 'visible', timeout: 5000 });
  }

  await page.waitForTimeout(500);
  await page.click('button.login-tab[onclick*="username"]');
  await page.fill('#loginUser', 'demoogrenci');
  await page.fill('#loginPass', 'ogrenci123');
  await page.click('.btn-login');
  await page.waitForFunction(() => document.getElementById('appShell')?.classList.contains('visible'), { timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: SS_DIR + '/student_after_login.png' });

  const activeViewId = await page.evaluate(() => document.querySelector('.view.active')?.id || 'none');
  const dayCols = await page.locator('.day-col').count();
  const weekGrid = await page.locator('.week-grid').count();
  console.log('Active view after student login:', activeViewId);
  console.log('day-col count:', dayCols, '| week-grid count:', weekGrid);

  // What sidebar items does student have?
  const stuSbItems = await page.locator('.sb-item').allTextContents();
  console.log('Student sidebar items:', JSON.stringify(stuSbItems.map(t => t.trim())));

  // Try to navigate to program
  const progNav = page.locator('.sb-item, [onclick*="program"], [onclick*="Program"]').filter({ hasText: /program|hafta/i }).first();
  if (await progNav.count() > 0) {
    await progNav.click();
    await page.waitForTimeout(1500);
    const dayColsAfter = await page.locator('.day-col').count();
    console.log('day-col after program nav:', dayColsAfter);
    await page.screenshot({ path: SS_DIR + '/student_program.png' });
  } else {
    // Check if it's directly visible after some wait
    await page.waitForTimeout(1000);
    const dayColsFinal = await page.locator('.day-col').count();
    console.log('day-col after extra wait:', dayColsFinal);
  }

  await browser.close();
  console.log('\nDone.');
})();
