const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  await page.goto('http://localhost:8080/setup.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const stats = await page.evaluate(async () => {
    // query users
    const { data: users, error } = await db.from('users').select('role, username, coach_id, parent_id');
    if (error) return { error: error.message };

    const roles = {};
    users.forEach(u => {
      roles[u.role] = (roles[u.role] || 0) + 1;
    });

    return {
      total: users.length,
      roles,
      users: users.map(u => ({ role: u.role, username: u.username, coach_id: u.coach_id, parent_id: u.parent_id }))
    };
  });

  console.log('Database user statistics:', JSON.stringify(stats, null, 2));
  await browser.close();
})();
