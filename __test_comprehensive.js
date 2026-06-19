const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SS_DIR = 'c:\\Users\\user\\Desktop\\Rostrum Akademi\\test_ss';
if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });
const SS = (name) => path.join(SS_DIR, name + '.png');

const results = [];
const bugs = [];

function log(emoji, section, step, msg) {
  const line = `${emoji} [${section}/${step}] ${msg}`;
  console.log(line);
  results.push(line);
  if (emoji === '❌') bugs.push(line);
}
async function ss(page, name) {
  try { await page.screenshot({ path: SS(name), fullPage: false }); } catch(e) {}
}
async function ssFull(page, name) {
  try { await page.screenshot({ path: SS(name), fullPage: true }); } catch(e) {}
}

async function loginUsername(page, username, password) {
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
  await page.waitForTimeout(1500);
}

async function logout(page) {
  try {
    await page.locator('.sb-item').filter({ hasText: /çıkış/i }).first().click();
    await page.waitForSelector('#loginScreen', { state: 'visible', timeout: 5000 });
  } catch(e) {
    await page.goto('http://localhost:8080/app.html');
    await page.waitForSelector('#loginScreen', { state: 'visible', timeout: 5000 });
  }
  await page.waitForTimeout(400);
}

// ═══════════════════════════════════════════
// KOÇ EKRANı — KAPSAMLI TEST
// ═══════════════════════════════════════════
async function testCoach(browser) {
  console.log('\n\n╔══════════════════════════════════════╗');
  console.log('║    BÖLÜM 1: KOÇ EKRANı (Desktop)    ║');
  console.log('╚══════════════════════════════════════╝');
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  try {
    // 1. GİRİŞ
    await loginUsername(page, 'demokoc', 'koc123');
    await ss(page, 'k01_home');
    log('✅', 'KOÇ', 'GİRİŞ', 'Koç girişi başarılı (demokoc/koc123)');

    const welcomeText = await page.locator('.view.active, #view-home').textContent().catch(() => '');
    const hasWelcome = welcomeText.includes('Demo') || welcomeText.includes('Koç') || welcomeText.includes('günler');
    log(hasWelcome ? '✅' : 'ℹ️', 'KOÇ', 'ANASAYFA', `Karşılama metni görünüyor: ${hasWelcome}`);

    // 2. ÖĞRENCİLERİM
    await page.locator('.sb-item').filter({ hasText: /öğrenci/i }).first().click();
    await page.waitForTimeout(1500);
    await ss(page, 'k02_students');

    const stuRows = await page.locator('.stu-row').count();
    log(stuRows > 0 ? '✅' : '❌', 'KOÇ', 'ÖĞRENCİLER', `${stuRows} öğrenci listelendi`);

    // İstatistik pill'leri
    const statPills = await page.locator('.stu-stat-pill').count();
    log(statPills > 0 ? '✅' : '⚠️', 'KOÇ', 'ÖĞRENCİLER', `Stat pill'ler: ${statPills} adet`);

    // Yeni öğrenci butonu
    const newStuBtn = await page.locator('button').filter({ hasText: /yeni öğrenci/i }).count();
    log(newStuBtn > 0 ? '✅' : '⚠️', 'KOÇ', 'ÖĞRENCİLER', `"+ Yeni Öğrenci" butonu: ${newStuBtn > 0}`);

    // 3. ÖĞRENCİ DETAYI + PROGRAM
    await page.locator('.stu-row').first().click();
    await page.waitForTimeout(1500);
    await ss(page, 'k03_student_detail');
    log('✅', 'KOÇ', 'ÖĞRENCİ-DETAY', 'Öğrenci detay sayfası açıldı');

    const progCard = page.locator('[onclick*="openStudentProgram"]').first();
    await progCard.click();
    await page.waitForTimeout(2000);
    await ss(page, 'k04_program');

    const dayCols = await page.locator('.day-col').count();
    log(dayCols === 7 ? '✅' : '❌', 'KOÇ', 'PROGRAM', `Haftalık program: ${dayCols}/7 gün kolonu`);

    // Bugün vurgulanmış mı?
    const todayCol = await page.locator('.day-col.today').count();
    log(todayCol > 0 ? '✅' : '⚠️', 'KOÇ', 'PROGRAM', `Bugün vurgulanmış: ${todayCol > 0}`);

    // Hafta navigasyonu
    const weekNav = await page.locator('.week-nav, [onclick*="changeWeek"]').count();
    log(weekNav > 0 ? '✅' : '⚠️', 'KOÇ', 'PROGRAM', `Hafta navigasyonu: ${weekNav > 0}`);

    // Tarih etiketi
    const weekLbl = await page.locator('.week-lbl').textContent().catch(() => '');
    log(weekLbl ? '✅' : '⚠️', 'KOÇ', 'PROGRAM', `Hafta etiketi: "${weekLbl.trim()}"`);

    // Banner butonları
    const bannerBtns = await page.locator('.prog-banner button').count();
    log('ℹ️', 'KOÇ', 'PROGRAM', `Banner buton sayısı: ${bannerBtns}`);

    // 4. GÖREV EKLEME
    const addBtn = page.locator('.add-day-btn').first();
    await addBtn.click();
    const modalOk = await page.locator('#taskModal').waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    log(modalOk ? '✅' : '❌', 'KOÇ', 'GÖREV-EKLE', 'Görev ekleme modalı açıldı');

    if (modalOk) {
      await ss(page, 'k05_task_modal');
      // Tür seçenekleri
      const typeOpts = await page.locator('#tmType option').allTextContents();
      log(typeOpts.length >= 4 ? '✅' : '⚠️', 'KOÇ', 'GÖREV-MODAL', `Tür seçenekleri: ${JSON.stringify(typeOpts)}`);

      // Soru bankası türü seç
      await page.selectOption('#tmType', 'soru');
      await page.waitForTimeout(400);
      const soruWrap = await page.locator('#soruBankasiWrap').isVisible().catch(() => false);
      log(soruWrap ? '✅' : '⚠️', 'KOÇ', 'GÖREV-MODAL', `Soru bankası paneli görünüyor: ${soruWrap}`);

      // Deneme türü
      await page.selectOption('#tmType', 'deneme');
      await page.waitForTimeout(400);
      const testWrap = await page.locator('#tmTestWrap').isVisible().catch(() => false);
      log(testWrap ? '✅' : '⚠️', 'KOÇ', 'GÖREV-MODAL', `Deneme net tablosu görünüyor: ${testWrap}`);

      // Diğer türü
      await page.selectOption('#tmType', 'diger');
      await page.waitForTimeout(300);
      await page.locator('#tmSubjectFree').fill('Playwright Test');
      await page.fill('#tmDuration', '45');

      await page.locator('#taskModal button').filter({ hasText: /ekle|kaydet/i }).first().click();
      await page.waitForTimeout(1800);
      await ss(page, 'k06_task_added');

      const taskCount = await page.locator('.task-card').count();
      log(taskCount > 0 ? '✅' : '❌', 'KOÇ', 'GÖREV-EKLE', `Görev eklendi: ${taskCount} kart`);

      // Task card renk sınıfı
      const hasDigerClass = await page.locator('.task-card.task-diger').count();
      log(hasDigerClass > 0 ? '✅' : '⚠️', 'KOÇ', 'GÖREV-EKLE', `task-diger CSS sınıfı: ${hasDigerClass > 0}`);

      // 5. GÖREV MENÜSÜ (3 nokta)
      const menuBtn = page.locator('.tc-menu-btn').first();
      if (await menuBtn.count() > 0) {
        await menuBtn.click();
        await page.waitForTimeout(400);
        await ss(page, 'k07_task_menu');

        const menuItems = await page.locator('.tc-dropdown button').allTextContents();
        log(menuItems.length > 0 ? '✅' : '⚠️', 'KOÇ', 'GÖREV-MENÜ', `Menü öğeleri: ${JSON.stringify(menuItems.map(t => t.trim()))}`);

        // Kopyala
        const copyBtn = page.locator('.tc-dropdown button').filter({ hasText: /kopya/i }).first();
        if (await copyBtn.count() > 0) {
          await copyBtn.click();
          await page.waitForTimeout(600);
          const pasteBtns = await page.locator('button').filter({ hasText: /yapıştır/i }).count();
          log(pasteBtns > 0 ? '✅' : '⚠️', 'KOÇ', 'KOPYALA', `Yapıştır butonları belirdi: ${pasteBtns}`);

          await ss(page, 'k08_paste_btns');

          // Yapıştır → buton kaybolur
          if (pasteBtns > 0) {
            await page.locator('button').filter({ hasText: /yapıştır/i }).first().click();
            await page.waitForTimeout(1500);
            const remaining = await page.locator('button').filter({ hasText: /yapıştır/i }).count();
            log(remaining === 0 ? '✅' : '❌', 'KOÇ', 'YAPIŞTIR', `Yapıştır sonrası buton kayboluyor: ${remaining === 0} (kalan: ${remaining})`);
            await ss(page, 'k09_after_paste');
          }
        } else {
          await page.keyboard.press('Escape');
        }
      }

      // 6. GÖREV DETAY MODAL
      await page.locator('.task-card').first().click();
      const detailOk = await page.locator('#taskDetailModal').waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
      log(detailOk ? '✅' : '❌', 'KOÇ', 'DETAY-MODAL', 'Görev detay modalı açıldı');

      if (detailOk) {
        await ss(page, 'k10_task_detail');

        // Başlık/konu
        const detailTitle = await page.locator('#tdSubject, .td-subject, #tdTitle').textContent().catch(() => '');
        log('ℹ️', 'KOÇ', 'DETAY-MODAL', `Konu: "${detailTitle.trim()}"`);

        // Done toggle
        const doneBox = page.locator('#tdDoneBox');
        const doneVisible = await doneBox.isVisible().catch(() => false);
        log(doneVisible ? '✅' : '⚠️', 'KOÇ', 'DETAY-MODAL', `Done toggle görünür: ${doneVisible}`);

        if (doneVisible) {
          const before = await doneBox.textContent();
          await doneBox.click();
          await page.waitForTimeout(700);
          const after = await doneBox.textContent();
          log(before.trim() !== after.trim() ? '✅' : '⚠️', 'KOÇ', 'DETAY-MODAL', `Toggle: "${before.trim()}" → "${after.trim()}"`);
          await ss(page, 'k10b_done_toggled');
        }

        // Not alanı
        const noteOk = await page.locator('#tdNote').isVisible().catch(() => false);
        log(noteOk ? '✅' : '⚠️', 'KOÇ', 'DETAY-MODAL', `Not alanı: ${noteOk}`);
        if (noteOk) {
          await page.locator('#tdNote').fill('Test notu girildi');
        }

        // Süre bilgisi
        const durEl = await page.locator('#tdDuration, .td-duration').textContent().catch(() => '');
        log('ℹ️', 'KOÇ', 'DETAY-MODAL', `Süre: "${durEl.trim()}"`);

        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }

      // 7. HAFTA DEĞİŞTİRME
      const prevBtn = page.locator('[onclick*="changeWeek(-1)"], .week-prev, button:has-text("←")').first();
      if (await prevBtn.count() > 0) {
        const lblBefore = await page.locator('.week-lbl').textContent().catch(() => '');
        await prevBtn.click();
        await page.waitForTimeout(1000);
        const lblAfter = await page.locator('.week-lbl').textContent().catch(() => '');
        log(lblBefore !== lblAfter ? '✅' : '⚠️', 'KOÇ', 'HAFTA-NAV', `Önceki hafta: "${lblBefore.trim()}" → "${lblAfter.trim()}"`);
        await ss(page, 'k11_prev_week');
        // Geri gel
        const nextBtn = page.locator('[onclick*="changeWeek(1)"], .week-next, button:has-text("→")').first();
        if (await nextBtn.count() > 0) await nextBtn.click();
        await page.waitForTimeout(700);
      }
    }

    // 8. KAYNAKLARIM — filtre barı
    await page.locator('.sb-item').filter({ hasText: /kaynak/i }).first().click();
    await page.waitForTimeout(2000);
    await ss(page, 'k12_resources');

    const filterBar = page.locator('.cr-filter-bar');
    const barOk = await filterBar.isVisible().catch(() => false);
    log(barOk ? '✅' : '❌', 'KOÇ', 'KAYNAKLARIM', `Filtre barı görünür: ${barOk}`);

    if (barOk) {
      const barBox = await filterBar.boundingBox();
      log('ℹ️', 'KOÇ', 'KAYNAKLARIM', `Filtre barı boyutu: ${Math.round(barBox.width)}×${Math.round(barBox.height)}px`);

      const sBox = await page.locator('#crSearch').boundingBox();
      const eBox = await page.locator('#crExam').boundingBox();
      const subBox = await page.locator('#crSubject').boundingBox();
      const sameRow = sBox && eBox && subBox &&
        Math.abs(sBox.y - eBox.y) < 20 && Math.abs(sBox.y - subBox.y) < 20;
      log(sameRow ? '✅' : '❌', 'KOÇ', 'KAYNAKLARIM', `Filtreler tek satırda: ${sameRow}`);

      // Arama testi
      await page.locator('#crSearch').fill('test');
      await page.waitForTimeout(500);
      await ss(page, 'k13_filter_active');
      await page.locator('#crSearch').fill('');

      // Sekme geçişi
      const crTabs = await page.locator('.cr-tab').count();
      log('ℹ️', 'KOÇ', 'KAYNAKLARIM', `CR Sekme sayısı: ${crTabs}`);
      if (crTabs > 1) {
        await page.locator('.cr-tab').nth(1).click();
        await page.waitForTimeout(700);
        await ss(page, 'k13b_cr_tab2');
        log('✅', 'KOÇ', 'KAYNAKLARIM', 'Sekme 2 geçişi çalışıyor');
        await page.locator('.cr-tab').first().click();
        await page.waitForTimeout(500);
      }
    }

    // 9. PROFİL
    await page.locator('.sb-item').filter({ hasText: /profil/i }).first().click();
    await page.waitForTimeout(1200);
    await ss(page, 'k14_profile');
    log('✅', 'KOÇ', 'PROFİL', 'Profil sekmesi açıldı');

    const profileGrid = await page.evaluate(() => {
      const el = document.querySelector('.coach-profile-container');
      return el ? getComputedStyle(el).gridTemplateColumns : 'not found';
    });
    log(profileGrid.includes('px') ? '✅' : '⚠️', 'KOÇ', 'PROFİL', `İki kolon layout: ${profileGrid}`);

    const profileInputs = await page.locator('#view-coach-profile input, #view-coach-profile textarea').count();
    log(profileInputs > 0 ? '✅' : '⚠️', 'KOÇ', 'PROFİL', `Form alanları: ${profileInputs} input/textarea`);

    // 10. MESAJLAR
    const msgTab = page.locator('.sb-item').filter({ hasText: /mesaj/i }).first();
    if (await msgTab.count() > 0) {
      await msgTab.click();
      await page.waitForTimeout(1200);
      await ss(page, 'k15_messages');
      log('✅', 'KOÇ', 'MESAJLAR', 'Mesajlar sekmesi açıldı');

      const msgList = await page.locator('.msg-list, .msg-item, .msg-row, .msg-contact').count();
      log('ℹ️', 'KOÇ', 'MESAJLAR', `Mesaj/konuşma sayısı: ${msgList}`);
    }

    // 11. TO-DO
    const todoTab = page.locator('.sb-item').filter({ hasText: /to-do|todo/i }).first();
    if (await todoTab.count() > 0) {
      await todoTab.click();
      await page.waitForTimeout(1000);
      await ss(page, 'k16_todo');
      log('✅', 'KOÇ', 'TO-DO', 'To-Do sekmesi açıldı');
    }

    // 12. TEMA TOGGLE
    const themeBtn = page.locator('[onclick*="toggleTheme"], .theme-btn, button:has-text("🎨")').first();
    if (await themeBtn.count() > 0) {
      await themeBtn.click();
      await page.waitForTimeout(300);
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      log('✅', 'KOÇ', 'TEMA', `Tema toggle çalışıyor: data-theme="${theme}"`);
      // light modda program kontrol
      await page.locator('[onclick*="openStudentProgram"]').first().click().catch(() => {});
      await page.waitForTimeout(1000);
      await ss(page, 'k17_light_mode');
      // geri dark'a
      await themeBtn.click();
      await page.waitForTimeout(300);
    }

  } catch(e) {
    log('❌', 'KOÇ', 'HATA', e.message.split('\n')[0]);
    await ss(page, 'k_ERROR');
  }

  await ctx.close();
}

// ═══════════════════════════════════════════
// ÖĞRENCİ EKRANı — KAPSAMLI TEST
// ═══════════════════════════════════════════
async function testStudent(browser) {
  console.log('\n\n╔══════════════════════════════════════╗');
  console.log('║  BÖLÜM 2: ÖĞRENCİ EKRANı (Desktop)  ║');
  console.log('╚══════════════════════════════════════╝');
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  try {
    await loginUsername(page, 'demoogrenci', 'ogrenci123');
    await ss(page, 's01_home');
    log('✅', 'ÖĞR', 'GİRİŞ', 'Öğrenci girişi başarılı (demoogrenci/ogrenci123)');

    // Sidebar öğeleri
    const sbItems = await page.locator('.sb-item').allTextContents();
    log('ℹ️', 'ÖĞR', 'SIDEBAR', `Sidebar: ${JSON.stringify(sbItems.map(t => t.replace(/\s+/g,' ').trim()))}`);

    // Görev Ekle butonu OLMAMALI
    const addBtnCount = await page.locator('.add-day-btn').count();
    log(addBtnCount === 0 ? '✅' : '❌', 'ÖĞR', 'READONLY', `Görev Ekle butonu yok: ${addBtnCount === 0}`);

    // Programım sekmesi
    const progTab = page.locator('.sb-item').filter({ hasText: /program/i }).first();
    if (await progTab.count() > 0) {
      await progTab.click();
      await page.waitForTimeout(2000);
      await ss(page, 's02_program');

      const dayCols = await page.locator('.day-col').count();
      log(dayCols === 7 ? '✅' : '⚠️', 'ÖĞR', 'PROGRAM', `Haftalık program: ${dayCols}/7 gün`);

      const addBtnsInProgram = await page.locator('.add-day-btn').count();
      log(addBtnsInProgram === 0 ? '✅' : '❌', 'ÖĞR', 'READONLY', `Program içinde Görev Ekle yok: ${addBtnsInProgram === 0}`);

      const taskCards = await page.locator('.task-card').count();
      log('ℹ️', 'ÖĞR', 'PROGRAM', `Görev sayısı: ${taskCards}`);

      if (taskCards > 0) {
        // Görev tıkla → detay modal
        await page.locator('.task-card').first().click();
        const detailOk = await page.locator('#taskDetailModal').waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
        log(detailOk ? '✅' : '⚠️', 'ÖĞR', 'DETAY-MODAL', `Görev detay açıldı: ${detailOk}`);

        if (detailOk) {
          await ss(page, 's03_task_detail');
          const doneBox = page.locator('#tdDoneBox');
          if (await doneBox.isVisible().catch(() => false)) {
            await doneBox.click();
            await page.waitForTimeout(700);
            log('✅', 'ÖĞR', 'DETAY-MODAL', 'Done toggle tıklandı');
            await ss(page, 's03b_done');
          }
          await page.keyboard.press('Escape');
        }
      } else {
        log('ℹ️', 'ÖĞR', 'PROGRAM', 'Bu hafta görev yok (koçun atamadığı öğrenci için normal)');
      }
    }

    // Denemeler sekmesi
    const examTab = page.locator('.sb-item').filter({ hasText: /deneme/i }).first();
    if (await examTab.count() > 0) {
      await examTab.click();
      await page.waitForTimeout(1200);
      await ss(page, 's04_exams');
      log('✅', 'ÖĞR', 'DENEMELER', 'Denemeler sekmesi açıldı');
    }

    // Koçuma Yaz
    const msgTab = page.locator('.sb-item').filter({ hasText: /koç|mesaj/i }).first();
    if (await msgTab.count() > 0) {
      await msgTab.click();
      await page.waitForTimeout(1200);
      await ss(page, 's05_message');
      log('✅', 'ÖĞR', 'MESAJ', 'Koçuma Yaz sekmesi açıldı');

      const msgInput = page.locator('.msg-input, #msgInput, textarea[placeholder*="mesaj"]').first();
      if (await msgInput.isVisible().catch(() => false)) {
        await msgInput.fill('Test mesajı');
        log('✅', 'ÖĞR', 'MESAJ', 'Mesaj input alanı var');
      }
    }

    // Profil sekmesi
    const profileTab = page.locator('.sb-item').filter({ hasText: /profil/i }).first();
    if (await profileTab.count() > 0) {
      await profileTab.click();
      await page.waitForTimeout(1000);
      await ss(page, 's06_profile');
      log('✅', 'ÖĞR', 'PROFİL', 'Öğrenci profil sekmesi açıldı');
    }

  } catch(e) {
    log('❌', 'ÖĞR', 'HATA', e.message.split('\n')[0]);
    await ss(page, 's_ERROR');
  }

  await ctx.close();
}

// ═══════════════════════════════════════════
// YÖNETİCİ — KAPSAMLI TEST
// ═══════════════════════════════════════════
async function testAdmin(browser) {
  console.log('\n\n╔══════════════════════════════════════╗');
  console.log('║  BÖLÜM 3: YÖNETİCİ (site_admin)     ║');
  console.log('╚══════════════════════════════════════╝');
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  try {
    await page.goto('http://localhost:8080/site_admin.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await ss(page, 'a01_login');

    // Giriş formu
    const lgUser = page.locator('#lgUser');
    const lgPass = page.locator('#lgPass');
    const lgOk = await lgUser.isVisible().catch(() => false);
    log(lgOk ? '✅' : '❌', 'ADMİN', 'GİRİŞ-FORM', `Giriş formu: ${lgOk}`);

    await lgUser.fill('admin');
    await lgPass.fill('admin2026');
    await page.click('.btn-login');
    await page.waitForTimeout(1500);
    await ss(page, 'a02_dashboard');

    const appVisible = await page.locator('#appShell').isVisible().catch(() => false);
    log(appVisible ? '✅' : '❌', 'ADMİN', 'GİRİŞ', `Admin girişi başarılı (admin/admin2026): ${appVisible}`);

    if (!appVisible) {
      const err = await page.locator('.login-err').textContent().catch(() => '');
      log('❌', 'ADMİN', 'GİRİŞ', `Hata: "${err}"`);
      await ctx.close();
      return;
    }

    // Dashboard istatistikleri
    const statCount = await page.locator('.stat').count();
    log(statCount > 0 ? '✅' : '⚠️', 'ADMİN', 'DASHBOARD', `İstatistik kartları: ${statCount}`);

    // Sidebar sekmeleri
    const sbItems = await page.locator('.sb-item').allTextContents();
    log('ℹ️', 'ADMİN', 'SIDEBAR', `Sekmeler: ${JSON.stringify(sbItems.map(t => t.replace(/\s+/g,' ').trim()))}`);

    // Her sekmeye git
    const tabNames = [
      { text: /öğrenci|koç|kullanıcı/i, label: 'Kullanıcılar' },
      { text: /içerik|blog/i, label: 'İçerik' },
      { text: /duyuru/i, label: 'Duyurular' },
      { text: /başvuru|lead/i, label: 'Başvurular' },
    ];
    for (const tab of tabNames) {
      const tabEl = page.locator('.sb-item').filter({ hasText: tab.text }).first();
      if (await tabEl.count() > 0) {
        await tabEl.click();
        await page.waitForTimeout(800);
        const viewHtml = await page.locator('.view.active').textContent().catch(() => '');
        const hasContent = viewHtml.length > 50;
        log(hasContent ? '✅' : '⚠️', 'ADMİN', tab.label, `Sekme içeriği yüklendi: ${hasContent}`);
        await ss(page, `a03_${tab.label.toLowerCase()}`);
      }
    }

    // Tüm sekmeleri sırayla dene
    const allSbItems = await page.locator('.sb-item').all();
    for (let i = 0; i < allSbItems.length; i++) {
      const txt = (await allSbItems[i].textContent()).replace(/\s+/g,' ').trim();
      await allSbItems[i].click();
      await page.waitForTimeout(600);
      log('ℹ️', 'ADMİN', `SEKME-${i+1}`, `"${txt}" açıldı`);
    }
    await ss(page, 'a04_final');

  } catch(e) {
    log('❌', 'ADMİN', 'HATA', e.message.split('\n')[0]);
    await ss(page, 'a_ERROR');
  }

  await ctx.close();
}

// ═══════════════════════════════════════════
// MOBİL TEST — KOÇ + ÖĞRENCİ
// ═══════════════════════════════════════════
async function testMobile(browser) {
  console.log('\n\n╔══════════════════════════════════════╗');
  console.log('║     BÖLÜM 4: MOBİL GÖRÜNÜM TEST     ║');
  console.log('╚══════════════════════════════════════╝');

  // iPhone 14 Pro: 393x852
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page = await ctx.newPage();

  try {
    // ── MOBİL KOÇ GİRİŞİ ──
    await loginUsername(page, 'demokoc', 'koc123');
    await ss(page, 'm01_coach_home');
    log('✅', 'MOBİL', 'KOÇ-GİRİŞ', 'Koç mobil girişi başarılı');

    // Sidebar/hamburger menü
    const hamburger = page.locator('.hamburger, .sb-toggle, [onclick*="toggleSidebar"], .mobile-menu-btn, #menuToggle').first();
    const hasHamburger = await hamburger.count() > 0;
    log(hasHamburger ? '✅' : 'ℹ️', 'MOBİL', 'SIDEBAR', `Hamburger menü: ${hasHamburger}`);

    // Sidebar görünürlüğü
    const sidebarVisible = await page.locator('.sidebar, #sidebar').isVisible().catch(() => false);
    log('ℹ️', 'MOBİL', 'SIDEBAR', `Sidebar görünür (mobil): ${sidebarVisible}`);

    // Overflow kontrolü
    const hasHorizScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    log(hasHorizScroll ? '⚠️' : '✅', 'MOBİL', 'LAYOUT', `Yatay scroll yok: ${!hasHorizScroll}`);

    // Full sayfa screenshot
    await ssFull(page, 'm01b_coach_home_full');

    // Öğrenciler sekmesi
    try {
      const stuTab = page.locator('.sb-item').filter({ hasText: /öğrenci/i }).first();
      if (await stuTab.count() > 0) {
        await stuTab.click();
        await page.waitForTimeout(1500);
        await ss(page, 'm02_students');
        log('✅', 'MOBİL', 'ÖĞRENCİLER', 'Öğrenci listesi açıldı');

        const stuRows = await page.locator('.stu-row').count();
        log('ℹ️', 'MOBİL', 'ÖĞRENCİLER', `Öğrenci sayısı: ${stuRows}`);

        if (stuRows > 0) {
          await page.locator('.stu-row').first().click();
          await page.waitForTimeout(1500);
          await ss(page, 'm03_student_detail');

          // Program aç
          const progCard = page.locator('[onclick*="openStudentProgram"]').first();
          if (await progCard.count() > 0) {
            await progCard.click();
            await page.waitForTimeout(2000);
            await ss(page, 'm04_program');
            await ssFull(page, 'm04_program_full');

            const dayCols = await page.locator('.day-col').count();
            log(dayCols > 0 ? '✅' : '⚠️', 'MOBİL', 'PROGRAM', `Program görünüyor: ${dayCols} kolon`);

            // Mobilde program responsive mi?
            const weekGrid = await page.locator('.week-grid').first();
            if (await weekGrid.count() > 0) {
              const gridBox = await weekGrid.boundingBox();
              log('ℹ️', 'MOBİL', 'PROGRAM', `Hafta grid genişliği: ${Math.round(gridBox?.width || 0)}px`);

              // Yatay kaydırma var mı?
              const gridScrollable = await page.evaluate(() => {
                const el = document.querySelector('.week-grid');
                return el ? el.scrollWidth > el.clientWidth : false;
              });
              log(gridScrollable ? 'ℹ️' : '✅', 'MOBİL', 'PROGRAM', `Grid yatay kaydırılabilir: ${gridScrollable}`);
            }

            // Görev ekleme
            const addBtn = page.locator('.add-day-btn').first();
            if (await addBtn.count() > 0) {
              await addBtn.scrollIntoViewIfNeeded();
              await addBtn.tap();
              const modalOk = await page.locator('#taskModal').waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
              log(modalOk ? '✅' : '⚠️', 'MOBİL', 'GÖREV-EKLE', `Modal mobilde açılıyor: ${modalOk}`);
              if (modalOk) {
                await ss(page, 'm05_task_modal');
                await page.keyboard.press('Escape');
                await page.waitForTimeout(400);
              }
            }
          }
        }
      }
    } catch(e) {
      log('⚠️', 'MOBİL', 'KOÇ-HATA', e.message.split('\n')[0]);
    }

    // Kaynaklarım filtre bar — mobilde
    try {
      await page.locator('.sb-item').filter({ hasText: /kaynak/i }).first().click();
      await page.waitForTimeout(1800);
      await ss(page, 'm06_resources');
      await ssFull(page, 'm06_resources_full');

      const barBox = await page.locator('.cr-filter-bar').boundingBox().catch(() => null);
      if (barBox) {
        log('ℹ️', 'MOBİL', 'KAYNAKLARIM', `Filtre barı: ${Math.round(barBox.width)}×${Math.round(barBox.height)}px`);
        const barWrapped = barBox.height > 60;
        log(barWrapped ? '⚠️' : '✅', 'MOBİL', 'KAYNAKLARIM', `Filtre barı sarmalamıyor: ${!barWrapped}`);
      }
    } catch(e) {
      log('⚠️', 'MOBİL', 'KAYNAKLARIM', e.message.split('\n')[0]);
    }

  } catch(e) {
    log('❌', 'MOBİL', 'KOÇ-ERR', e.message.split('\n')[0]);
    await ss(page, 'm_ERROR_coach');
  }

  await ctx.close();

  // ── MOBİL ÖĞRENCİ ──
  const ctx2 = await browser.newContext({
    viewport: { width: 393, height: 852 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page2 = await ctx2.newPage();

  try {
    await loginUsername(page2, 'demoogrenci', 'ogrenci123');
    await ss(page2, 'm07_student_home');
    log('✅', 'MOBİL', 'ÖĞR-GİRİŞ', 'Öğrenci mobil girişi başarılı');

    const hasHorizScroll2 = await page2.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    log(hasHorizScroll2 ? '⚠️' : '✅', 'MOBİL', 'ÖĞR-LAYOUT', `Yatay overflow yok: ${!hasHorizScroll2}`);

    // Program sekmesi
    const progTab = page2.locator('.sb-item').filter({ hasText: /program/i }).first();
    if (await progTab.count() > 0) {
      await progTab.click();
      await page2.waitForTimeout(2000);
      await ss(page2, 'm08_student_program');
      await ssFull(page2, 'm08_student_program_full');

      const dayCols = await page2.locator('.day-col').count();
      log(dayCols === 7 ? '✅' : '⚠️', 'MOBİL', 'ÖĞR-PROGRAM', `${dayCols} gün kolonu (393px viewport)`);

      // Scrollable mi?
      const isScrollable = await page2.evaluate(() => {
        const wg = document.querySelector('.week-grid');
        return wg ? wg.scrollWidth > wg.clientWidth : false;
      });
      log('ℹ️', 'MOBİL', 'ÖĞR-PROGRAM', `Hafta grid yatay kaydırılabilir: ${isScrollable}`);
    }

    await ssFull(page2, 'm09_student_full');

  } catch(e) {
    log('❌', 'MOBİL', 'ÖĞR-ERR', e.message.split('\n')[0]);
    await ss(page2, 'm_ERROR_student');
  }

  await ctx2.close();
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
(async () => {
  const browser = await chromium.launch({ headless: true });

  await testCoach(browser);
  await testStudent(browser);
  await testAdmin(browser);
  await testMobile(browser);

  await browser.close();

  console.log('\n\n╔══════════════════════════════════════════════╗');
  console.log('║                SONUÇ RAPORU                  ║');
  console.log('╚══════════════════════════════════════════════╝');

  const passes = results.filter(r => r.startsWith('✅')).length;
  const fails  = results.filter(r => r.startsWith('❌')).length;
  const warns  = results.filter(r => r.startsWith('⚠️')).length;
  const infos  = results.filter(r => r.startsWith('ℹ️')).length;

  console.log(`\n✅ PASS: ${passes} | ❌ FAIL: ${fails} | ⚠️ UYARI: ${warns} | ℹ️ BİLGİ: ${infos}`);

  if (bugs.length > 0) {
    console.log('\n❌ BULUNAN HATALAR:');
    bugs.forEach(b => console.log('  ' + b));
  } else {
    console.log('\n❌ Kritik hata bulunamadı.');
  }

  console.log(`\n📸 Ekran görüntüleri: ${SS_DIR}`);
  const screenshots = fs.readdirSync(SS_DIR).filter(f => f.endsWith('.png')).sort();
  console.log(`   Toplam: ${screenshots.length} ekran görüntüsü`);
})().catch(e => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});
