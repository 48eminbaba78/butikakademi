// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — HELPER FUNCTIONS
// ═══════════════════════════════════════════════

import { S, session } from './state.js';

export function saveUI() {
  try {
    localStorage.setItem('ba_ui_' + (session.dbUser?.id || 'x'), JSON.stringify({
      weekOffset: S.weekOffset,
      activeStuId: S.activeStuId,
      calMonth: S.calMonth,
      calYear: S.calYear
    }));
  } catch (e) {}
}

export function saveS() {
  saveUI();
}

export function showLoading(on) {
  let el = document.getElementById('loadingOverlay');
  if (on && !el) {
    el = document.createElement('div');
    el.id = 'loadingOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(15,14,12,.8);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;backdrop-filter:blur(4px)';
    el.innerHTML = `<div style="width:36px;height:36px;border:3px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite"></div><div style="font-size:13px;color:var(--text-mid)">Yükleniyor...</div>`;
    if (!document.getElementById('spinStyle')) {
      const s = document.createElement('style');
      s.id = 'spinStyle';
      s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }
    document.body.appendChild(el);
  } else if (!on && el) {
    el.remove();
  }
}

export function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function fmtDate(d) {
  return d instanceof Date ? d.toISOString().split('T')[0] : d;
}

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function todayStr() {
  return fmtDate(new Date());
}

export function netColor(v) {
  return v >= 20 ? 'good' : v >= 12 ? 'mid' : 'low';
}

export function typeLabel(t) {
  return { deneme: '📊 Deneme', soru: '📚 Soru', konu: '🎯 Konu', diger: '⭐ Diğer' }[t] || t;
}

export function om(id) {
  document.getElementById(id).classList.add('open');
}

export function cm(id) {
  document.getElementById(id).classList.remove('open');
}

export function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2300);
}

// Click-outside ve Escape tuşu ile tüm modalları kapatma desteği
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-bg')) {
    e.target.classList.remove('open');
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-bg.open').forEach(el => el.classList.remove('open'));
  }
});

// Haftalık program başlangıç hesaplama (0=Pazartesi, 6=Pazar)
export function getWeekStart(offset, stuWeekStart = 0) {
  const t = new Date();
  const dow = t.getDay(); // 0=Pazar
  const todayIdx = dow === 0 ? 6 : dow - 1; // Pzt=0..Paz=6
  const diff = todayIdx - stuWeekStart;
  const monday = new Date(t);
  monday.setDate(t.getDate() - ((diff + 7) % 7) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function getStudentWeekStart() {
  const s = S.students.find(x => x.id === S.activeStuId);
  return s?.weekStart ?? 0;
}

// Şifre hashleme (SHA-256)
export async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Kullanıcı adı normalleştirme
export function normalizeUsername(str) {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/i/g, 'i')
    .replace(/\s+/g, '')
    .replace(/\u0307/g, '');
}

// Bildirim izin talebi
export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Bu tarayıcı anlık bildirimleri desteklemiyor.");
    return;
  }
  
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        showToast("Bildirim izinleri onaylandı ✓");
      }
    });
  } else if (Notification.permission === "granted") {
    showToast("Bildirim izinleri zaten açık ✓");
  } else {
    showToast("Bildirim izinleri tarayıcı ayarlarından engellenmiş.");
  }
}

// Expose to window for HTML inline event handlers
window.saveUI = saveUI;
window.saveS = saveS;
window.showLoading = showLoading;
window.esc = esc;
window.fmtDate = fmtDate;
window.addDays = addDays;
window.todayStr = todayStr;
window.netColor = netColor;
window.typeLabel = typeLabel;
window.om = om;
window.cm = cm;
window.showToast = showToast;
window.getWeekStart = getWeekStart;
window.getStudentWeekStart = getStudentWeekStart;
window.sha256 = sha256;
window.normalizeUsername = normalizeUsername;
window.requestNotificationPermission = requestNotificationPermission;
