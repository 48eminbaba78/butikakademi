const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  // Login as coach
  await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.click('button.login-tab[onclick*="username"]');
  await page.fill('#loginUser', 'demokoc');
  await page.fill('#loginPass', 'koc123');
  await page.click('.btn-login');
  await page.waitForFunction(() => document.getElementById('appShell')?.classList.contains('visible'), { timeout: 15000 });
  await page.waitForTimeout(1500);
  console.log('=== COACH LOGGED IN ===');

  // Check sidebar role
  const sbRoleEl = await page.locator('#sbRole').count();
  const sbRoleText = await page.locator('#sbRole').textContent().catch(() => '(not found)');
  console.log('sbRole element count:', sbRoleEl, 'text:', sbRoleText);

  // Navigate to students
  const stuTab = page.locator('.sb-item').filter({ hasText: /öğrenci/i }).first();
  await stuTab.click();
  await page.waitForTimeout(1200);

  // Click first student
  await page.locator('.stu-row').first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'test_ss/debug_student_open.png' });

  // Find all tabs
  const allTabs = await page.locator('button, .tab-btn, [class*="tab"]').allTextContents();
  console.log('All tab-like elements:', JSON.stringify(allTabs.filter(t => t.trim())));

  // Look for active view
  const activeView = await page.evaluate(() => {
    const main = document.querySelector('.main-content, #mainContent, .content, main');
    return main ? main.innerHTML.substring(0, 500) : 'no main found';
  });
  console.log('Current view snippet:', activeView.substring(0, 300));

  // Get sidebar items
  const sbItems = await page.locator('.sb-item').allTextContents();
  console.log('Sidebar items:', JSON.stringify(sbItems));

  // Check for tab navigation elements
  const tabs = await page.locator('[onclick*="switch"], [onclick*="Tab"], [onclick*="tab"], .tab-btn, .tab-item').allTextContents();
  console.log('Tab elements:', JSON.stringify(tabs));

  // Screenshots to see what's visible
  await page.screenshot({ path: 'test_ss/debug_coach_view.png' });

  // Check what renderProgram-related elements exist
  const dayColExists = await page.locator('.day-col').count();
  const weekGrid = await page.locator('.week-grid').count();
  const progBanner = await page.locator('.prog-banner').count();
  console.log('day-col:', dayColExists, 'week-grid:', weekGrid, 'prog-banner:', progBanner);

  // Check main content area HTML
  const mainHTML = await page.evaluate(() => {
    return document.body.innerHTML.substring(0, 2000);
  });
  // Write to file for inspection
  fs.writeFileSync('test_ss/debug_html.txt', mainHTML);
  console.log('HTML written to test_ss/debug_html.txt (first 300 chars):');
  console.log(mainHTML.substring(0, 300));

  await browser.close();
})();
