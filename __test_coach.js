const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', e => errors.push('JS ERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE ERR: ' + m.text()); });

  // ── 1. APP LOADS ─────────────────────────────────────────
  await page.goto('http://localhost:8080/app.html');
  await page.waitForSelector('#loginScreen', { state: 'visible' });
  await page.screenshot({ path: 'ss_01_login.png' });
  console.log('STEP 1: Login screen loaded');

  // ── 2. COACH LOGIN ───────────────────────────────────────
  await page.click('button:has-text("E-posta")');
  await page.fill('#loginEmail', 'demokoc@rostrum.com.tr');
  await page.fill('#loginPass', 'demo1234');
  await page.click('.btn-login');
  await page.waitForSelector('#appShell', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'ss_02_coach_home.png' });
  console.log('STEP 2: Coach logged in, home visible');

  // ── 3. SIDEBAR ROLE ──────────────────────────────────────
  const role = await page.textContent('#sbRole');
  console.log('STEP 3: Sidebar role = ' + role.trim());

  // ── 4. ÖĞRENCILERIM → STUDENT DETAIL ────────────────────
  const stuTab = page.locator('.sb-item').filter({ hasText: 'Öğrencilerim' });
  await stuTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'ss_03_students.png' });
  console.log('STEP 4: Students tab opened');

  // ── 5. STUDENT STATS PILLS (no progress bar) ─────────────
  const hasPct   = await page.locator('.week-prog-pct').count();
  const hasStats = await page.locator('.stu-week-stats').count();
  console.log('STEP 5: old progress pct elements=' + hasPct + ', new stat pills=' + hasStats);

  // ── 6. OPEN FIRST STUDENT ────────────────────────────────
  const firstStu = page.locator('.stu-row').first();
  const stuName  = await firstStu.locator('.stu-row-name').textContent();
  await firstStu.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'ss_04_student_detail.png' });
  console.log('STEP 6: Opened student: ' + stuName.trim());

  // ── 7. PROGRAM TAB ───────────────────────────────────────
  const progBtn = page.locator('button, .tab-btn, [onclick*="program"]').filter({ hasText: 'Program' }).first();
  await progBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ss_05_program.png' });
  console.log('STEP 7: Program tab opened');

  // ── 8. DAY CARDS VISIBLE ─────────────────────────────────
  const dayCols = await page.locator('.day-col').count();
  const dayNums = await page.locator('.day-num').count();
  console.log('STEP 8: day-col count=' + dayCols + ', day-num count=' + dayNums);

  // ── 9. ADD A TASK ────────────────────────────────────────
  const addBtn = page.locator('.add-day-btn').first();
  await addBtn.click();
  await page.waitForSelector('#taskModal', { state: 'visible' });
  await page.screenshot({ path: 'ss_06_task_modal.png' });
  console.log('STEP 9: Task modal opened');

  // ── 10. FILL TASK MODAL ──────────────────────────────────
  await page.selectOption('#tmType', 'diger');
  await page.fill('#tmSubjectFree', 'Test Görevi');
  await page.fill('#tmDuration', '30');
  await page.click('.btn-accent:has-text("Programa Ekle")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ss_07_task_added.png' });
  console.log('STEP 10: Task added');

  // ── 11. TASK CARD VISIBLE ────────────────────────────────
  const taskCards = await page.locator('.task-card').count();
  console.log('STEP 11: task-card count=' + taskCards);

  // ── 12. COPY TASK ────────────────────────────────────────
  const menuBtn = page.locator('.tc-menu-btn').first();
  await menuBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'ss_08_task_menu.png' });
  console.log('STEP 12: Task menu opened');

  const copyBtn = page.locator('.tc-dropdown button').filter({ hasText: 'Kopyala' });
  await copyBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'ss_09_after_copy.png' });
  console.log('STEP 12b: Copy clicked — checking paste buttons visible');
  const pasteBtns = await page.locator('button:has-text("Yapıştır")').count();
  console.log('STEP 12c: paste buttons visible = ' + pasteBtns);

  // ── 13. PASTE + PASTE BUTTON DISAPPEARS ──────────────────
  const pasteBtn = page.locator('button:has-text("Yapıştır")').first();
  await pasteBtn.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'ss_10_after_paste.png' });
  const pasteBtnsAfter = await page.locator('button:has-text("Yapıştır")').count();
  console.log('STEP 13: After paste — paste buttons still visible=' + pasteBtnsAfter + ' (expected 0)');

  // ── 14. TASK DETAIL MODAL ────────────────────────────────
  const tc = page.locator('.task-card').first();
  await tc.click();
  await page.waitForSelector('#taskDetailModal', { state: 'visible' });
  await page.screenshot({ path: 'ss_11_task_detail.png' });
  console.log('STEP 14: Task detail modal opened');

  // ── 15. TASK DONE TOGGLE ─────────────────────────────────
  const doneBox = page.locator('#tdDoneBox');
  await doneBox.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'ss_12_task_done.png' });
  const doneText = await page.locator('#tdDoneBox').textContent();
  console.log('STEP 15: Done toggle → ' + doneText.trim());

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  console.log('--- JS errors so far: ' + errors.length);
  errors.forEach(e => console.log('  ' + e));

  await browser.close();
})();
