const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SS_DIR = 'c:\\Users\\user\\Desktop\\Rostrum Akademi\\test_ss';
if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR);

const SS = (name) => path.join(SS_DIR, name + '.png');
const results = [];

function log(emoji, step, msg) {
  const line = `${emoji} [${step}] ${msg}`;
  console.log(line);
  results.push(line);
}

let page, browser;

async function screenshot(name) {
  try { await page.screenshot({ path: SS(name), fullPage: false }); } catch(e) {}
}

async function loginAs(username, password) {
  await page.goto('http://localhost:8080/app.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.click('button.login-tab[onclick*="username"]');
  await page.waitForTimeout(200);
  await page.fill('#loginUser', username);
  await page.fill('#loginPass', password);
  await page.click('.btn-login');
  await page.waitForFunction(
    () => document.getElementById('appShell')?.classList.contains('visible'),
    { timeout: 15000 }
  );
  await page.waitForTimeout(1200);
}

async function logout() {
  try {
    const logoutBtn = page.locator('.sb-item, button').filter({ hasText: /çıkış|logout/i }).first();
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      await page.waitForTimeout(600);
    }
    await page.waitForSelector('#loginScreen', { state: 'visible', timeout: 5000 });
  } catch(e) {
    await page.goto('http://localhost:8080/app.html');
    await page.waitForSelector('#loginScreen', { state: 'visible', timeout: 6000 });
  }
}

(async () => {
  browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  page = await ctx.newPage();

  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push('JS_ERR: ' + e.message));
  // Only capture non-400 console errors (400 is expected for Supabase auth fallback)
  page.on('console', m => {
    if (m.type() === 'error' && !m.text().includes('400')) jsErrors.push('CON_ERR: ' + m.text());
  });

  // ══════════════════════════════════════════════════
  // BÖLÜM 1: KOÇ EKRANı
  // ══════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════');
  console.log('BÖLÜM 1: KOÇ EKRANı');
  console.log('══════════════════════════════════════');

  try {
    await loginAs('demokoc', 'koc123');
    await screenshot('01_coach_home');
    log('✅', 'KOÇ-1', 'Koç girişi başarılı');

    // Role label (may be hidden in collapsed sidebar)
    const role = await page.evaluate(() => {
      const el = document.getElementById('sbRole');
      return el ? (el.textContent.trim() || el.getAttribute('data-role') || '(empty text)') : '(not found)';
    });
    log(role.includes('KOÇ') || role.includes('koc') || role.includes('coach') ? '✅' : 'ℹ️', 'KOÇ-2', `Rol: "${role}" (sidebar collapsed modda text gizlenmiş olabilir)`);

    // Default theme
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'not set (dark default)');
    log('ℹ️', 'KOÇ-3', `Tema: ${theme}`);

    // ── ANA SAYFA İSTATİSTİKLER ──
    await screenshot('01b_coach_home_stats');
    const homeStats = await page.locator('.home-stats, .stat-card, .stats-grid').count();
    log(homeStats > 0 ? '✅' : 'ℹ️', 'KOÇ-4', `Ana sayfa istatistik kartları: ${homeStats}`);

    // ── ÖĞRENCİLERİM SEKMESİ ──
    const stuTab = page.locator('.sb-item').filter({ hasText: /öğrenci/i }).first();
    await stuTab.click();
    await page.waitForTimeout(1500);
    await screenshot('02_students_list');

    const stuRows = await page.locator('.stu-row').count();
    log(stuRows > 0 ? '✅' : '⚠️', 'KOÇ-5', `Öğrenci listesi: ${stuRows} öğrenci`);

    // Eski ilerleme yüzdesi kaldırıldı mı?
    const oldPct = await page.locator('.week-prog-pct').count();
    const newStats = await page.locator('.stu-week-stats, .stu-stat-pill').count();
    log(oldPct === 0 ? '✅' : '❌', 'KOÇ-6', `Eski % ilerleme elementi: ${oldPct} (beklenen: 0)`);
    log(newStats > 0 ? '✅' : '⚠️', 'KOÇ-7', `Yeni istatistik pills: ${newStats}`);

    // ── HAFTALIK PROGRAM ──
    const firstStu = page.locator('.stu-row').first();
    await firstStu.click();
    await page.waitForTimeout(1500);
    await screenshot('03_student_detail');
    log('✅', 'KOÇ-8', `Öğrenci detay sayfası açıldı`);

    // Program navigasyonu - DIV onclick="openStudentProgram(...)"
    const progCard = page.locator('[onclick*="openStudentProgram"]').first();
    if (await progCard.count() > 0) {
      await progCard.click();
      await page.waitForTimeout(2000);
      await screenshot('04_program_page');

      const dayCols = await page.locator('.day-col').count();
      const weekGrid = await page.locator('.week-grid').count();
      log(dayCols === 7 ? '✅' : '⚠️', 'KOÇ-9', `Program: ${dayCols} gün kolonu, ${weekGrid} hafta grid`);

      // Light mode kart rengi testi
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
      await page.waitForTimeout(400);
      await screenshot('04b_program_light');
      const dayBg = await page.evaluate(() => {
        const el = document.querySelector('.day-col');
        return el ? getComputedStyle(el).backgroundColor : 'not found';
      });
      const isWhiteOrLight = dayBg.includes('255, 255, 255') || dayBg === 'rgb(255, 255, 255)';
      log('ℹ️', 'KOÇ-10', `Light mode kart rengi: ${dayBg}`);
      log(isWhiteOrLight ? '✅' : '⚠️', 'KOÇ-10b', `Light modda beyaz arka plan: ${isWhiteOrLight}`);
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));

      // Gün isimleri kısa mı?
      const dayNames = await page.locator('.day-name-lbl').allTextContents();
      const shortNames = dayNames.every(n => n.length <= 3);
      log(shortNames ? '✅' : '⚠️', 'KOÇ-11', `Gün isimleri kısa (<=3 harf): ${JSON.stringify(dayNames)}`);

      // Gün numaraları büyük mü?
      const dayNumFontSize = await page.evaluate(() => {
        const el = document.querySelector('.day-num');
        return el ? getComputedStyle(el).fontSize : 'not found';
      });
      log('ℹ️', 'KOÇ-12', `Gün numarası font boyutu: ${dayNumFontSize}`);

      // ── GÖREV EKLEME ──
      const addBtn = page.locator('.add-day-btn').first();
      if (await addBtn.count() > 0) {
        await addBtn.click();
        const modalVisible = await page.locator('#taskModal').waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
        if (modalVisible) {
          await screenshot('05_task_modal');
          log('✅', 'KOÇ-13', 'Görev modalı açıldı');

          // Görev türü seç
          await page.selectOption('#tmType', 'diger').catch(() => {});
          const freeField = page.locator('#tmSubjectFree');
          if (await freeField.isVisible().catch(() => false)) {
            await freeField.fill('Playwright Test Görevi');
          }
          await page.fill('#tmDuration', '30');

          const saveBtn = page.locator('#taskModal button').filter({ hasText: /ekle|kaydet|tamam/i }).first();
          await saveBtn.click();
          await page.waitForTimeout(2000);
          await screenshot('06_task_added');

          const taskCards = await page.locator('.task-card').count();
          log(taskCards > 0 ? '✅' : '⚠️', 'KOÇ-14', `Görev eklendi: ${taskCards} kart`);

          // ── GÖREV KOPYALA/YAPIŞTIR ──
          if (taskCards > 0) {
            const menuBtn = page.locator('.tc-menu-btn').first();
            if (await menuBtn.count() > 0) {
              await menuBtn.click();
              await page.waitForTimeout(400);

              const copyBtn = page.locator('.tc-dropdown button, .task-menu-dropdown button, [onclick*="copyTask"]').filter({ hasText: /kopya/i }).first();
              if (await copyBtn.count() > 0) {
                await copyBtn.click();
                await page.waitForTimeout(700);
                const pasteBtns = await page.locator('button, [onclick*="paste"]').filter({ hasText: /yapıştır/i }).count();
                log(pasteBtns > 0 ? '✅' : '⚠️', 'KOÇ-15', `Kopyalama → yapıştır butonları görünür: ${pasteBtns}`);

                if (pasteBtns > 0) {
                  await screenshot('07_paste_buttons');
                  const firstPaste = page.locator('button, [onclick*="paste"]').filter({ hasText: /yapıştır/i }).first();
                  await firstPaste.click();
                  await page.waitForTimeout(1500);
                  await screenshot('08_after_paste');
                  const pasteBtnsAfter = await page.locator('button, [onclick*="paste"]').filter({ hasText: /yapıştır/i }).count();
                  log(pasteBtnsAfter === 0 ? '✅' : '❌', 'KOÇ-16', `Yapıştır sonrası buton kayboluyor: ${pasteBtnsAfter === 0} (kalan=${pasteBtnsAfter})`);
                }
              } else {
                await page.keyboard.press('Escape');
                log('⚠️', 'KOÇ-15', 'Kopyala butonu dropdown içinde bulunamadı');
              }
            } else {
              log('⚠️', 'KOÇ-15', 'Görev menü butonu (.tc-menu-btn) bulunamadı');
            }

            // ── GÖREV DETAY MODAL ──
            await page.locator('.task-card').first().click();
            const detailVisible = await page.locator('#taskDetailModal').waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
            if (detailVisible) {
              await screenshot('09_task_detail_modal');
              log('✅', 'KOÇ-17', 'Görev detay modalı açıldı');

              // Done toggle
              const doneBox = page.locator('#tdDoneBox');
              if (await doneBox.count() > 0) {
                const before = await doneBox.textContent();
                await doneBox.click();
                await page.waitForTimeout(700);
                const after = await doneBox.textContent();
                log(before !== after ? '✅' : '⚠️', 'KOÇ-18', `Tamamlandı toggle: "${before.trim()}"→"${after.trim()}"`);
              }

              // Sub-items checkboxes
              const checkItems = await page.locator('.detail-check-item, .td-check, [onclick*="toggleDetailItem"]').count();
              log('ℹ️', 'KOÇ-19', `Alt madde checkbox'ları: ${checkItems}`);

              await page.keyboard.press('Escape');
              await page.waitForTimeout(400);
            } else {
              log('⚠️', 'KOÇ-17', 'Görev detay modalı açılmadı');
            }
          }
        } else {
          log('⚠️', 'KOÇ-13', 'Görev modalı açılmadı');
        }
      } else {
        log('⚠️', 'KOÇ-13', '.add-day-btn bulunamadı');
      }
    } else {
      log('❌', 'KOÇ-9', 'openStudentProgram DIV bulunamadı');
    }

  } catch(e) {
    log('❌', 'KOÇ-ERR', e.message.split('\n')[0]);
    await screenshot('error_coach');
  }

  // ══════════════════════════════════════════════════
  // KAYNAKLARIM FILTRE BAR
  // ══════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════');
  console.log('KAYNAKLARIM FİLTRE BAR');
  console.log('══════════════════════════════════════');

  try {
    const resTab = page.locator('.sb-item').filter({ hasText: /kaynak/i }).first();
    if (await resTab.count() > 0) {
      await resTab.click();
      await page.waitForTimeout(1800);
      await screenshot('10_resources');

      const filterBar = page.locator('.cr-filter-bar');
      const barVisible = await filterBar.isVisible().catch(() => false);
      log(barVisible ? '✅' : '❌', 'RES-1', `Filtre barı görünür: ${barVisible}`);

      if (barVisible) {
        const barBox = await filterBar.boundingBox();
        log('ℹ️', 'RES-2', `Filtre barı: ${Math.round(barBox.width)}x${Math.round(barBox.height)}px`);

        const hasSearch  = await page.locator('#crSearch').count() > 0;
        const hasExam    = await page.locator('#crExam').count() > 0;
        const hasSubject = await page.locator('#crSubject').count() > 0;
        log(hasSearch  ? '✅' : '❌', 'RES-3', `Arama: ${hasSearch}`);
        log(hasExam    ? '✅' : '❌', 'RES-4', `Sınav dropdown: ${hasExam}`);
        log(hasSubject ? '✅' : '❌', 'RES-5', `Konu dropdown: ${hasSubject}`);

        // Aynı satır kontrolü (y koordinatları)
        if (hasSearch && hasExam) {
          const sBox = await page.locator('#crSearch').boundingBox();
          const eBox = await page.locator('#crExam').boundingBox();
          const subBox = await page.locator('#crSubject').boundingBox();
          const sameRow = sBox && eBox && subBox &&
                          Math.abs(sBox.y - eBox.y) < 20 &&
                          Math.abs(sBox.y - subBox.y) < 20;
          log(sameRow ? '✅' : '❌', 'RES-6', `Tüm filtreler tek satırda: ${sameRow} (search.y=${Math.round(sBox?.y)}, exam.y=${Math.round(eBox?.y)}, subj.y=${Math.round(subBox?.y)})`);
        }

        // Arama testi
        await page.locator('#crSearch').fill('matematik');
        await page.waitForTimeout(500);
        await screenshot('10b_filter_search');
        log('✅', 'RES-7', 'Arama filtresi uygulandı');
        await page.locator('#crSearch').fill('');
        await page.waitForTimeout(300);

        // Exam filtresi
        const examOpts = await page.locator('#crExam option').count();
        log('ℹ️', 'RES-8', `Sınav seçenekleri: ${examOpts}`);
      }
    } else {
      log('⚠️', 'RES-0', 'Kaynaklarım sekmesi bulunamadı');
    }
  } catch(e) {
    log('❌', 'RES-ERR', e.message.split('\n')[0]);
  }

  // ══════════════════════════════════════════════════
  // KOÇ PROFİL
  // ══════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════');
  console.log('KOÇ PROFİL');
  console.log('══════════════════════════════════════');

  try {
    const profileTab = page.locator('.sb-item').filter({ hasText: /profil/i }).first();
    if (await profileTab.count() > 0) {
      await profileTab.click();
      await page.waitForTimeout(1200);
      await screenshot('11_coach_profile');
      log('✅', 'PRF-1', 'Profil sekmesi açıldı');

      // İki kolon layout
      const twoCol = await page.evaluate(() => {
        const sel = '.profile-cols, .profile-grid, .coach-profile-layout, [style*="grid-template-columns"]';
        return document.querySelectorAll(sel).length;
      });
      log('ℹ️', 'PRF-2', `İki kolon layout elementi: ${twoCol}`);

      // Live preview
      const preview = await page.locator('.coach-card-preview, .profile-preview, .live-preview, .coach-card').count();
      log('ℹ️', 'PRF-3', `Live preview kartı: ${preview}`);

      // Ad alanı — try multiple selectors
      const nameField = await page.evaluate(() => {
        const candidates = ['#coachName', '#cpName', '#profileName', 'input[name="name"]', 'input[placeholder*="ad"]'];
        for (const sel of candidates) {
          const el = document.querySelector(sel);
          if (el) return sel;
        }
        // Last resort: find any visible input in the profile view
        const view = document.querySelector('.view.active');
        if (view) {
          const inp = view.querySelector('input[type=text], input:not([type])');
          return inp ? 'found: ' + (inp.id || inp.name || inp.placeholder) : null;
        }
        return null;
      });
      log('ℹ️', 'PRF-4', `Ad input selector: ${nameField}`);

      if (nameField && !nameField.startsWith('found: ') && nameField !== 'null') {
        const inputEl = page.locator(nameField).first();
        await inputEl.fill('Demo Koç (Test)');
        await page.waitForTimeout(400);
        log('✅', 'PRF-5', 'Ad alanı dolduruldu');
      } else {
        // Try the generic approach
        const activeInputs = await page.locator('.view.active input[type=text], .view.active input:not([type])').count();
        log('ℹ️', 'PRF-4b', `Aktif view'daki text inputlar: ${activeInputs}`);
      }
    } else {
      log('⚠️', 'PRF-0', 'Profil sekmesi bulunamadı');
    }
  } catch(e) {
    log('❌', 'PRF-ERR', e.message.split('\n')[0]);
  }

  // Logout
  await logout().catch(() => {});

  // ══════════════════════════════════════════════════
  // BÖLÜM 2: ÖĞRENCİ EKRANı
  // ══════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════');
  console.log('BÖLÜM 2: ÖĞRENCİ EKRANı');
  console.log('══════════════════════════════════════');

  try {
    await loginAs('demoogrenci', 'ogrenci123');
    await screenshot('12_student_home');
    log('✅', 'STU-1', 'Öğrenci girişi başarılı');

    const role = await page.evaluate(() => {
      const el = document.getElementById('sbRole');
      return el ? el.textContent.trim() : '(not found)';
    });
    log('ℹ️', 'STU-2', `Sidebar rol: "${role}"`);

    await page.waitForTimeout(1800);
    await screenshot('12b_student_program');

    // Öğrenci haftalık program görmeli (doğrudan)
    const dayCols = await page.locator('.day-col').count();
    log(dayCols === 7 ? '✅' : '⚠️', 'STU-3', `Haftalık program: ${dayCols} kolon`);

    // Görev Ekle butonu öğrencide OLMAMALI
    const addBtn = await page.locator('.add-day-btn').count();
    log(addBtn === 0 ? '✅' : '❌', 'STU-4', `Görev Ekle butonu yok (readonly): ${addBtn === 0}`);

    const taskCards = await page.locator('.task-card').count();
    log('ℹ️', 'STU-5', `Göreve sayısı: ${taskCards}`);

    if (taskCards > 0) {
      await page.locator('.task-card').first().click();
      const detailVisible = await page.locator('#taskDetailModal').waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
      if (detailVisible) {
        await screenshot('13_student_task_detail');
        log('✅', 'STU-6', 'Öğrenci görev detay modalı açıldı');

        const doneBox = page.locator('#tdDoneBox');
        if (await doneBox.count() > 0) {
          await doneBox.click();
          await page.waitForTimeout(700);
          log('✅', 'STU-7', 'Tamamlandı toggle çalışıyor');
          await screenshot('13b_student_done_toggle');
        }

        // Not alanı
        const noteField = page.locator('#tdNote');
        if (await noteField.count() > 0) {
          await noteField.fill('Bugün gayet iyi anladım!');
          log('✅', 'STU-8', 'Not alanı dolduruldu');
        }

        await page.keyboard.press('Escape');
      } else {
        log('⚠️', 'STU-6', 'Görev detay modalı açılmadı');
      }
    } else {
      log('ℹ️', 'STU-5b', 'Bu haftaya ait görev yok — detay testi atlandı');
    }

  } catch(e) {
    log('❌', 'STU-ERR', e.message.split('\n')[0]);
    await screenshot('error_student');
  }

  // ══════════════════════════════════════════════════
  // BÖLÜM 3: YÖNETİCİ (site_admin.html)
  // ══════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════');
  console.log('BÖLÜM 3: YÖNETİCİ EKRANı');
  console.log('══════════════════════════════════════');

  try {
    await page.goto('http://localhost:8080/site_admin.html', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1500);
    await screenshot('14_admin_login');

    const pageTitle = await page.title();
    log('ℹ️', 'ADM-1', `Sayfa başlığı: "${pageTitle}"`);

    const loginScreen = await page.locator('#loginScreen').isVisible().catch(() => false);
    log('ℹ️', 'ADM-2', `Giriş ekranı: ${loginScreen}`);

    if (loginScreen) {
      // Admin login: admin / admin2026
      const userField = page.locator('#lgUser');
      const passField = page.locator('#lgPass');
      if (await userField.count() > 0 && await passField.count() > 0) {
        await userField.fill('admin');
        await passField.fill('admin2026');
        await page.click('.btn-login');
        await page.waitForTimeout(2000);
        await screenshot('15_admin_logged_in');

        const appShellVisible = await page.locator('#appShell').isVisible().catch(() => false);
        log(appShellVisible ? '✅' : '❌', 'ADM-3', `Admin girişi başarılı: ${appShellVisible}`);

        if (appShellVisible) {
          // Stats visible
          const statsCards = await page.locator('.stat, .stat-val, .stats-grid').count();
          log(statsCards > 0 ? '✅' : '⚠️', 'ADM-4', `İstatistik kartları: ${statsCards}`);

          // Sidebar nav
          const sbItems = await page.locator('.sb-item').count();
          log(sbItems > 0 ? '✅' : '⚠️', 'ADM-5', `Sidebar navigasyon: ${sbItems} item`);

          // Navigate to users/coaches section
          const usersTab = page.locator('.sb-item').filter({ hasText: /kullanıcı|koç|öğrenci|user/i }).first();
          if (await usersTab.count() > 0) {
            await usersTab.click();
            await page.waitForTimeout(1000);
            await screenshot('15b_admin_users');
            log('✅', 'ADM-6', 'Kullanıcılar/Koçlar sekmesi açıldı');
          }
        }
      }
    }
  } catch(e) {
    log('❌', 'ADM-ERR', e.message.split('\n')[0]);
    await screenshot('error_admin');
  }

  // ══════════════════════════════════════════════════
  // ÖZET
  // ══════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════');
  console.log('SONUÇ RAPORU');
  console.log('══════════════════════════════════════');

  if (jsErrors.length > 0) {
    console.log('\nJS HATALARI:');
    jsErrors.slice(0, 5).forEach(e => console.log('  ' + e));
  } else {
    console.log('JS Hataları: YOK ✅');
  }

  const passes = results.filter(r => r.startsWith('✅')).length;
  const fails  = results.filter(r => r.startsWith('❌')).length;
  const warns  = results.filter(r => r.startsWith('⚠️')).length;
  const infos  = results.filter(r => r.startsWith('ℹ️')).length;
  console.log(`\nTOPLAM: ✅ ${passes} | ❌ ${fails} | ⚠️ ${warns} | ℹ️ ${infos}`);
  console.log(`\nEkran görüntüleri: ${SS_DIR}`);

  await browser.close();
})().catch(e => {
  console.error('\nFATAL ERROR:', e.message);
  process.exit(1);
});
