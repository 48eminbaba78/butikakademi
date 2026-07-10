// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — UI & INTERACTION SERVICES
// ═══════════════════════════════════════════════

import { db } from './config.js';
import { S, session } from './state.js';
import { loadAllData, dbQ } from './api.js';
import { 
  showLoading, sha256, normalizeUsername, showToast, 
  esc, fmtDate, addDays, todayStr, netColor, typeLabel, 
  om, cm, getWeekStart, getStudentWeekStart, saveUI, saveS
} from './helpers.js';

function formatMinToHours(mins) {
  if (!mins || mins <= 0) return '0 sa';
  const hrs = Math.floor(mins / 60);
  const m = mins % 60;
  if (hrs > 0 && m > 0) {
    return `${hrs} sa ${m} dk`;
  } else if (hrs > 0) {
    return `${hrs} sa`;
  } else {
    return `${m} dk`;
  }
}
window.formatMinToHours = formatMinToHours;

function customConfirm(message) {
  return new Promise((resolve) => {
    let modal = document.getElementById('customConfirmModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'customConfirmModal';
      modal.className = 'modal-bg';
      modal.style.zIndex = '999999';
      modal.innerHTML = `
        <div class="modal" style="max-width:360px;text-align:center;padding:24px 20px;border-radius:16px;background:var(--surface);border:1px solid var(--border)">
          <div style="font-size:32px;margin-bottom:12px">⚠️</div>
          <div id="confirmMessage" style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:20px;line-height:1.5"></div>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-ghost" id="confirmCancelBtn" style="flex:1;justify-content:center;padding:10px;border-radius:10px">İptal</button>
            <button class="btn btn-accent" id="confirmOkBtn" style="flex:1;justify-content:center;padding:10px;border-radius:10px;background:#ef4444;border-color:#ef4444;color:#fff">Tamam</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('open');
          resolve(false);
        }
      });
    }

    modal.querySelector('#confirmMessage').textContent = message;

    const okBtn = modal.querySelector('#confirmOkBtn');
    const cancelBtn = modal.querySelector('#confirmCancelBtn');

    const newOkBtn = okBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    modal.classList.add('open');
    newOkBtn.focus();

    newOkBtn.onclick = () => {
      modal.classList.remove('open');
      resolve(true);
    };

    newCancelBtn.onclick = () => {
      modal.classList.remove('open');
      resolve(false);
    };
  });
}
window.customConfirm = customConfirm;

async function checkCoachSubscription() {
  const dbUser = session.dbUser;
  if (!dbUser) return;

  // Bypass for Emin Ceylan, test accounts, localhost, and explicit test mode
  if (
    dbUser.email === 'ceylanemin1928@gmail.com' ||
    dbUser.email === 'simkoc1@rostrumakademi.com' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.__testMode
  ) return;

  if (session.role === 'coach' || session.role === 'developer') {
    const plan = dbUser.plan || 'trial';
    if (plan === 'trial') {
      const trialEnds = dbUser.trial_ends_at ? new Date(dbUser.trial_ends_at) : new Date(new Date(dbUser.created_at).getTime() + 14 * 24 * 60 * 60 * 1000);
      const now = new Date();
      if (now > trialEnds) {
        showTrialExpiredScreen();
      }
    }
  } else if ((session.role === 'student' || session.role === 'parent') && session.coachId) {
    try {
      const { data: coachUser } = await db.from('users').select('plan,trial_ends_at,created_at,email').eq('id', session.coachId).maybeSingle();
      if (coachUser) {
        if (
          coachUser.email === 'ceylanemin1928@gmail.com' ||
          coachUser.email === 'simkoc1@rostrumakademi.com'
        ) return;
        const plan = coachUser.plan || 'trial';
        if (plan === 'trial') {
          const trialEnds = coachUser.trial_ends_at ? new Date(coachUser.trial_ends_at) : new Date(new Date(coachUser.created_at).getTime() + 14 * 24 * 60 * 60 * 1000);
          const now = new Date();
          if (now > trialEnds) {
            showTrialExpiredScreen();
          }
        }
      }
    } catch (e) {
      console.error('Error checking coach subscription:', e);
    }
  }
}

function showTrialExpiredScreen() {
  let modal = document.getElementById('trialExpiredModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'trialExpiredModal';
    modal.className = 'modal-bg open';
    modal.style.zIndex = '9999999'; // ensure it is on top of everything
    modal.innerHTML = `
      <div class="modal" style="max-width:460px;text-align:center;padding:32px 24px;border-radius:18px;background:var(--surface);border:2.5px solid var(--accent);box-shadow:var(--shadow-lg)">
        <div style="font-size:54px;margin-bottom:18px">⏳</div>
        <h2 style="font-size:20px;font-weight:900;margin-bottom:12px;color:var(--accent)">Deneme Süreniz Doldu</h2>
        <p style="font-size:13px;color:var(--text-mid);line-height:1.7;margin-bottom:24px">
          Rostrum Akademi'nin 14 günlük ücretsiz deneme süresi sona ermiştir. 
          Çalışmalarınıza devam etmek ve size uygun paketi seçmek için lütfen kurucu/destek ekibimizle iletişime geçin.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;align-items:stretch">
          <button class="btn btn-accent" onclick="openSupportChatDirect()" style="justify-content:center;padding:12px;font-size:14px;font-weight:700">
            💬 Kurucuya / Ekibe Yaz (Canlı Destek)
          </button>
          <div style="font-size:11px;color:var(--text-dim);margin-top:6px">
            E-posta: <b>ceylanemin1928@gmail.com</b>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    modal.classList.add('open');
  }
}
window.openSupportChatDirect = openSupportChat;
window.checkCoachSubscription = checkCoachSubscription;
window.showTrialExpiredScreen = showTrialExpiredScreen;


// ═══════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════
// ── TAB TANIMLARI ──────────────────────────────
const coachTabs=[
  {id:'home',lbl:'🏠',name:'Ana Sayfa'},
  {id:'students',lbl:'👤',name:'Öğrencilerim'},
  {id:'todolist',lbl:'📅',name:'Ajanda'},
  {id:'coach-resources',lbl:'📚',name:'Kaynaklarım'},
  {id:'coach-applications',lbl:'📩',name:'Başvurular'},
];
const stuTabs=[
  {id:'portal',lbl:'🏠',name:'Ana Sayfa'},
  {id:'sportal',lbl:'📋',name:'Programım'},
  {id:'sexams',lbl:'📊',name:'Denemeler'},
  {id:'smessages',lbl:'💬',name:'Koçuma Yaz'},
  {id:'suyelik',lbl:'💳',name:'Üyeliğim'},
  {id:'sprofil',lbl:'👤',name:'Profilim'},
];
const devTabs=[
  {id:'dev-dashboard',lbl:'🖥️',name:'Dev Panel'},
  {id:'dev-tickets',lbl:'🎫',name:'Destek'},
];
const parentTabs=[
  {id:'parent-home',lbl:'🏠',name:'Ana Sayfa'},
  {id:'parent-progress',lbl:'📊',name:'İlerleme'},
  {id:'parent-messages',lbl:'💬',name:'Koça Yaz'},
  {id:'parent-ai',lbl:'🤖',name:'AI Asistan'},
];

function toggleSidebar(){
  document.getElementById('mainSidebar')?.classList.toggle('open');
}
function toggleUserMenu(){
  document.getElementById('tnUserMenu')?.classList.toggle('open');
}
function closeUserMenu(){
  document.getElementById('tnUserMenu')?.classList.remove('open');
}
document.addEventListener('click', e => {
  const wrap = document.getElementById('tnUserWrap');
  if(wrap && !wrap.contains(e.target)) closeUserMenu();
});

function setupShell(){
  checkCoachSubscription();
  const tabs = session.role==='coach' ? coachTabs : session.role==='developer' ? [...coachTabs, ...devTabs] : session.role==='parent' ? parentTabs : stuTabs;
  const allTabs = [...tabs, {id:'profile',lbl:'👤',name:'Profil'}, {id:'settings',lbl:'⚙️',name:'Ayarlar'}];

  // Top nav items
  document.getElementById('sidebarNav').innerHTML = tabs.map(t=>`
    <div class="tn-nav-item" id="sbi_${t.id}" onclick="switchTab('${t.id}')">
      <span>${t.lbl}</span>
      <span>${t.name}</span>
    </div>`).join('');

  // Mobile nav
  document.getElementById('mobileNav').innerHTML = tabs.slice(0,5).map(t=>`
    <button class="mnav-btn" id="mntab_${t.id}" onclick="switchTab('${t.id}')">${t.lbl}<span style="font-size:9px;display:block">${t.name}</span></button>`).join('');

  // Content views
  document.getElementById('mainContent').innerHTML = [
    ...tabs,
    {id:'student-detail'}, {id:'profile'}, {id:'settings'},
    {id:'coach-resources'}, {id:'coach-applications'}, {id:'coach-notes'}, {id:'coach-profile'},
    {id:'messages'}, {id:'todolist'},
    // program ayrı view — student-detail'dan açılır
    {id:'program'},{id:'appointments'},{id:'exams'}
  ].map(t=>`<div class="view" id="view-${t.id}"></div>`).join('');

  // Profile pill
  const dbUser = session.dbUser;
  const stu = session.role==='student' ? S.students.find(s=>s.id===session.studentId) : null;
  const name = dbUser?.full_name || stu?.name || '';
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const roleColors = {coach:'#f0a500', student: stu?.color||'#4da6ff', developer:'#c084fc', parent:'#3ecf8e'};
  const roleLabels = {coach:'KOÇ', student:'ÖĞRENCİ', developer:'DEV', parent:'VELİ'};
  document.getElementById('sbAv').textContent = initials;
  document.getElementById('sbAv').style.background = roleColors[session.role]||'#888';
  document.getElementById('sbName').textContent = name;
  document.getElementById('sbRole').textContent = roleLabels[session.role]||session.role;

  // Workspace logo
  if((session.role==='coach' || session.role==='developer') && S.workspace?.brand_name) {
    const _lt=document.querySelector('.sb-logo-text'); if(_lt) _lt.textContent=S.workspace.brand_name;
    const tnLogo=document.querySelector('.tn-logo .sb-logo-icon'); if(tnLogo) tnLogo.textContent=S.workspace.brand_name.slice(0,1).toUpperCase();
  }

  // Site Yönetimi — sadece developer
  const siteAdminBtn = document.getElementById('sb-site-admin');
  if(siteAdminBtn) siteAdminBtn.style.display = session.role==='developer' ? 'flex' : 'none';

  // Koç Profilim dropdown item — sadece koçlarda göster
  const coachProfileItem = document.getElementById('tnCoachProfileItem');
  if(coachProfileItem) coachProfileItem.style.display = (session.role==='coach' || session.role==='developer') ? 'flex' : 'none';

  initAIChatForRole();
  setTimeout(loadAnnouncements, 600);
  // Koç ise bekleyen başvuru sayısını badge olarak göster
  if (session.role === 'coach' || session.role === 'developer') {
    db.from('match_requests').select('id', { count: 'exact', head: true })
      .eq('matched_coach_id', session.coachId).eq('status', 'pending')
      .then(({ count }) => {
        if (count > 0) {
          const sbiEl = document.getElementById('sbi_coach-applications');
          if (sbiEl && !sbiEl.querySelector('.sb-badge')) {
            const badge = document.createElement('span');
            badge.className = 'sb-badge';
            badge.textContent = count;
            sbiEl.appendChild(badge);
          }
        }
      });
  }
}

function switchTab(tab, updateHash = true){
  if (!tab) return;
  currentTab = tab;
  if (updateHash) {
    window.location.hash = tab;
  }
  // Top nav active state
  document.querySelectorAll('.tn-nav-item').forEach(el=>el.classList.remove('active'));
  const activeEl = document.getElementById('sbi_'+tab) || document.getElementById('sb-'+tab);
  if(activeEl) activeEl.classList.add('active');
  // View
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const viewEl = document.getElementById('view-'+tab);
  if(viewEl) viewEl.classList.add('active');
  // Title
  const allTabs = [...coachTabs,...stuTabs,...devTabs,...parentTabs,
    {id:'profile',name:'Profil'},{id:'settings',name:'Ayarlar'},
    {id:'student-detail',name:S.students.find(s=>s.id===S.activeStuId)?.name||'Öğrenci'},
    {id:'program',name:'Program'},{id:'appointments',name:'Randevular'},{id:'exams',name:'Denemeler'}
  ];
  const tabDef = allTabs.find(t=>t.id===tab);
  const tbarTitle = document.getElementById('tbarTitle'); if(tbarTitle) tbarTitle.textContent = tabDef?.name || tab;
  // Render
  const renderMap = {
    home:renderHome, students:renderStudentsSearch, messages:renderMessages,
    'coach-applications':renderCoachApplications,
    'coach-notes':renderCoachNotes,
    todolist:renderTodoList, portal:renderPortal, sportal:renderSPortal,
    sexams:renderSExams, smessages:renderSMessages, suyelik:renderSUyelik, sprofil:renderSProfil,
    profile:renderProfile, settings:renderSettings,
    'student-detail': () => { if(S.activeStuId) openStudentDetail(S.activeStuId); else switchTab('students'); },
    program: () => { if(S.activeStuId) openStudentProgram(S.activeStuId); else switchTab('students'); },
    exams: () => { if(S.activeStuId) renderExams(); else switchTab('students'); },
    appointments: () => { if(S.activeStuId) renderAppointments(); else switchTab('students'); },
    'dev-dashboard':renderDevDashboard,'dev-users':renderDevUsers,
    'dev-resources':renderDevResources,'dev-finance':renderDevFinance,
    'dev-announce':renderDevAnnounce,'dev-tickets':renderDevTickets,
    'parent-home':renderParentHome,'parent-progress':renderParentProgress,
    'parent-messages':renderSMessages,'parent-ai':renderParentAI,
    'coach-profile': renderCoachProfile,
    'dev-matches': renderDevMatches,
    'coach-resources': renderCoachResources,
  };
  try {
    renderMap[tab]?.();
  } catch(err) {
    console.error('[switchTab] Render error for tab:', tab, err);
    if(viewEl) {
      viewEl.innerHTML = `<div style="padding:24px;color:var(--text)"><b>Hata Oluştu ⚠️</b><p style="color:var(--text-mid);margin-top:6px">${esc(err.message)}</p><pre style="font-size:10px;color:var(--text-dim);white-space:pre-wrap;margin-top:8px">${esc((err.stack||'').slice(0,400))}</pre></div>`;
    }
  }
  if(tab==='messages'||tab==='smessages') initRealtime();
  else destroyRealtime();

  const bubble = document.getElementById('aiChatBubble');
  if (bubble) {
    if (tab === 'dev-tickets' || tab.startsWith('dev-') || tab === 'messages' || tab === 'smessages') {
      bubble.style.display = 'none';
      document.getElementById('aiChatPanel')?.classList.remove('open');
    } else if (session.role === 'student' || session.role === 'coach' || session.role === 'parent') {
      bubble.style.display = 'flex';
    }
  }
}

// ── KOÇ ANA SAYFA ──────────────────────────────
function renderHome(){
  const el = document.getElementById('view-home');
  if(!el) return;
  try{
  const now = new Date();
  const dayNames = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const monthNames = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const todayStr = fmtDate(now);

  // Unread messages
  let unread = 0;
  Object.values(S.messages).forEach(msgs => { unread += msgs.filter(m=>m.from==='student'&&!m.read).length; });

  // Bugünkü randevular
  const todayAppts = S.appointments.filter(a=>a.date===todayStr).sort((a,b)=>a.time.localeCompare(b.time));

  // --- ANOMALİ TESPİTİ (Erken Uyarılar) ---
  const anomalies = [];
  const ws = getWeekStart(0, 0);

  (S.students || []).forEach(s => {
    // 1) Görev tamamlama analizi
    let totalTasks = 0;
    let doneTasks = 0;
    for (let i = 0; i < 7; i++) {
      const dateStr = fmtDate(addDays(ws, i));
      const tasks = S.tasks[`${s.id}_${dateStr}`] || [];
      totalTasks += tasks.length;
      doneTasks += tasks.filter(t => t.done).length;
    }
    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    if (totalTasks > 0 && completionRate < 30) {
      anomalies.push({
        studentId: s.id,
        studentName: s.name,
        color: s.color,
        type: 'tasks',
        icon: '📋',
        title: 'Düşük Görev',
        desc: `Bu haftaki görev tamamlama oranı <b>%${completionRate}</b>'de kaldı (${doneTasks}/${totalTasks} görev tamamlandı).`
      });
    }

    // 2) Deneme net düşüşü analizi
    const stuExams = (S.exams || []).filter(e => e.studentId === s.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const examsByType = {};
    stuExams.forEach(e => {
      if (!examsByType[e.type]) examsByType[e.type] = [];
      examsByType[e.type].push(e);
    });

    Object.entries(examsByType).forEach(([examType, list]) => {
      if (list.length >= 2) {
        const latest = list[0];
        const prev = list[1];
        const latestTotal = Object.values(latest.nets || {}).reduce((sum, v) => sum + Number(v || 0), 0);
        const prevTotal = Object.values(prev.nets || {}).reduce((sum, v) => sum + Number(v || 0), 0);
        const diff = latestTotal - prevTotal;
        if (diff < -5) {
          anomalies.push({
            studentId: s.id,
            studentName: s.name,
            color: s.color,
            type: 'exams',
            icon: '📉',
            title: `Net Düşüşü (${examType})`,
            desc: `Son denemede <b>${latestTotal} net</b> yaptı. Önceki denemesine (${prevTotal} net) göre <b>${Math.abs(diff).toFixed(1)} net düşüş</b>.`
          });
        }
      }
    });

    // 3) Bu hafta hiç program yapılmamış
    if (totalTasks === 0) {
      anomalies.push({
        studentId: s.id, studentName: s.name, color: s.color,
        type: 'noplan', icon: '📭', title: 'Program Yok',
        desc: `Bu hafta için henüz hiç görev eklenmemiş.`
      });
    }

    // 4) Son 3 gündür hiçbir görev tamamlanmamış (en az 1 görevi varsa)
    if (totalTasks > 0 && doneTasks === 0) {
      let hasTaskLast3 = false;
      for (let i = 0; i < 3; i++) {
        const d = fmtDate(addDays(now, -i));
        if ((S.tasks[`${s.id}_${d}`]||[]).length > 0) { hasTaskLast3 = true; break; }
      }
      if (hasTaskLast3) {
        anomalies.push({
          studentId: s.id, studentName: s.name, color: s.color,
          type: 'inactive', icon: '💤', title: '3 Gündür Pasif',
          desc: `Son 3 gündür hiçbir görev tamamlanmadı. İletişime geç!`
        });
      }
    }

    // 5) Tüm görevleri tamamlayanlar (pozitif)
    if (totalTasks > 0 && doneTasks === totalTasks) {
      anomalies.push({
        studentId: s.id, studentName: s.name, color: s.color,
        type: 'perfect', icon: '🏆', title: 'Harika Hafta!',
        desc: `Bu haftaki tüm ${totalTasks} görevi tamamladı! Tebrik et.`
      });
    }

    // 6) Soru çözüm hızı analizi
    const studentSpeeds = (S.studentSpeeds || []).filter(sp => sp.student_id === s.id);
    studentSpeeds.forEach(sp => {
      let limit = 120;
      if (sp.exam_type === 'TYT') {
        if (['Türkçe', 'Sosyal'].includes(sp.subject)) limit = 100;
        else if (['Matematik', 'Fen'].includes(sp.subject)) limit = 130;
      } else if (sp.exam_type && sp.exam_type.startsWith('AYT')) {
        limit = 180;
      }
      if (sp.secs_per_question > limit) {
        anomalies.push({
          studentId: s.id,
          studentName: s.name,
          color: s.color,
          type: 'speed',
          icon: '⚡',
          title: `Hız Aşımı (${sp.exam_type} - ${sp.subject})`,
          desc: `Soru çözüm hızı <b>${sp.secs_per_question} sn/soru</b> (Limit: ${limit} sn).`
        });
      }
    });
  });

  let anomaliesHTML = '';
  if (anomalies.length === 0) {
    anomaliesHTML = `
      <div style="text-align:center;padding:16px;color:var(--text-dim);font-size:13px">
        ✅ Harika! Şu an için kritik bir performans düşüşü veya uyarı bulunmuyor.
      </div>`;
  } else {
    const typeStyle = {
      perfect: { badge: '#3ecf8e', badgeBg: 'rgba(62,207,142,.12)', border: 'rgba(62,207,142,.25)' },
      noplan:  { badge: '#f0a500', badgeBg: 'rgba(240,165,0,.1)',   border: 'rgba(240,165,0,.2)' },
      inactive:{ badge: '#ff5c7a', badgeBg: 'rgba(255,92,122,.08)', border: 'rgba(255,92,122,.2)' },
      tasks:   { badge: '#ff5c7a', badgeBg: 'rgba(255,92,122,.08)', border: 'rgba(255,92,122,.2)' },
      exams:   { badge: '#ff5c7a', badgeBg: 'rgba(255,92,122,.08)', border: 'rgba(255,92,122,.2)' },
      speed:   { badge: '#f0a500', badgeBg: 'rgba(240,165,0,.1)',   border: 'rgba(240,165,0,.2)' },
    };
    anomaliesHTML = anomalies.map(a => {
      const st = typeStyle[a.type] || typeStyle.tasks;
      return `<div style="cursor:pointer;padding:10px 12px;margin-bottom:8px;border-radius:8px;background:${st.badgeBg};border:1px solid ${st.border};display:flex;align-items:center;gap:10px;transition:opacity .15s" onclick="openStudentDetail('${a.studentId}')" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
        <div style="font-size:18px;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0">${a.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px">
            <span style="font-size:13px;font-weight:700">${esc(a.studentName)}</span>
            <span style="font-size:10px;font-weight:700;color:${st.badge};white-space:nowrap">${a.title}</span>
          </div>
          <div style="font-size:11px;color:var(--text-mid);line-height:1.4">${a.desc}</div>
        </div>
      </div>`;
    }).join('');
  }

  const hr = now.getHours();
  const greeting = hr < 6 ? 'İyi geceler' : hr < 12 ? 'Günaydın' : hr < 18 ? 'İyi günler' : 'İyi akşamlar';
  const timeNow = `${String(hr).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const nextAppt = todayAppts.find(a => a.time >= timeNow);

  // YKS 2026 geri sayım
  const yks2026 = new Date(2026, 5, 14);
  const daysToYks = Math.max(0, Math.ceil((yks2026 - now) / (1000*60*60*24)));

  // Haftanın görev tamamlama özeti
  const ws2 = getWeekStart(0, 0);
  let weekTotal = 0, weekDone = 0;
  S.students.forEach(s => {
    for(let i=0;i<7;i++){
      const tasks = S.tasks[`${s.id}_${fmtDate(addDays(ws2,i))}`]||[];
      weekTotal += tasks.length;
      weekDone += tasks.filter(t=>t.done).length;
    }
  });
  const weekPct = weekTotal > 0 ? Math.round(weekDone/weekTotal*100) : 0;

  el.innerHTML = `
    <!-- HERO -->
    <div class="home-hero">
      <div class="home-hero-left">
        <div class="home-hero-greeting">${greeting},</div>
        <div class="home-hero-name">${esc(session.dbUser?.full_name?.split(' ')[0]||'Koç')} 👋</div>
        <div class="home-hero-date">${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}</div>
      </div>
      <div class="home-hero-right">
        <div class="home-yks-badge">
          <div class="home-yks-num">${daysToYks}</div>
          <div class="home-yks-meta">gün kaldı<br><b>YKS 2026</b></div>
        </div>
      </div>
    </div>

    <!-- STAT KARTLARI -->
    <div class="home-stats-v2">
      <div class="hsv2-card" onclick="switchTab('students')" title="Öğrencilere git">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap hsv2-amber">👥</span>
          <span class="hsv2-trend">→</span>
        </div>
        <div class="hsv2-val">${S.students.length}</div>
        <div class="hsv2-lbl">Aktif Öğrenci</div>
      </div>
      <div class="hsv2-card" onclick="switchTab('students')" title="Öğrencilere git — randevu sekmesi">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap hsv2-blue">📅</span>
          <span class="hsv2-trend" style="color:var(--blue)">${nextAppt ? nextAppt.time : '—'}</span>
        </div>
        <div class="hsv2-val" style="color:var(--blue)">${todayAppts.length}</div>
        <div class="hsv2-lbl">Bugün Randevu</div>
        <div class="hsv2-sub">${nextAppt ? `Sıradaki: ${nextAppt.time}` : 'Randevu tamamlandı'}</div>
      </div>
      <div class="hsv2-card" onclick="switchTab('messages')" title="Mesajlara git">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap ${unread>0?'hsv2-red':'hsv2-green'}">💬</span>
          ${unread>0?`<span class="hsv2-badge-red">${unread} yeni</span>`:'<span class="hsv2-badge-green">Temiz</span>'}
        </div>
        <div class="hsv2-val" style="color:${unread>0?'var(--red)':'var(--green)'}">${unread}</div>
        <div class="hsv2-lbl">Okunmamış Mesaj</div>
        <div class="hsv2-sub">${unread>0?'Yanıt bekliyor':'Tüm mesajlar okundu'}</div>
      </div>
      <div class="hsv2-card" title="Haftalık görev durumu">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap ${weekPct>=70?'hsv2-green':weekPct>=40?'hsv2-amber':'hsv2-red'}">📋</span>
          <span class="hsv2-trend" style="color:${weekPct>=70?'var(--green)':weekPct>=40?'var(--accent)':'var(--red)'}">%${weekPct}</span>
        </div>
        <div class="hsv2-val" style="color:${weekPct>=70?'var(--green)':weekPct>=40?'var(--accent)':'var(--red)'}">${weekDone}<span style="font-size:18px;font-weight:500;color:var(--text-dim)">/${weekTotal}</span></div>
        <div class="hsv2-lbl">Haftalık Görev</div>
        <div class="hsv2-progress"><div class="hsv2-bar" style="width:${weekPct}%;background:${weekPct>=70?'var(--green)':weekPct>=40?'var(--accent)':'var(--red)'}"></div></div>
      </div>
    </div>

    <!-- ALT GRID: Uyarılar + Randevular -->
    <div class="home-bottom-grid">
      <div class="home-section-card ${anomalies.length>0?'hsc-has-alerts':''}">
        <div class="hsc-head">
          <span class="hsc-head-icon">${anomalies.length>0?'⚠️':'✅'}</span>
          <span class="hsc-head-title">Erken Uyarılar</span>
          <span class="hsc-pill ${anomalies.length>0?'hsc-pill-red':'hsc-pill-green'}">${anomalies.length>0?anomalies.length+' uyarı':'Temiz'}</span>
        </div>
        <div class="hsc-body">${anomaliesHTML}</div>
      </div>
      <div class="home-section-card">
        <div class="hsc-head">
          <span class="hsc-head-icon">📅</span>
          <span class="hsc-head-title">Bugünün Randevuları</span>
          <span class="hsc-pill">${todayAppts.length} randevu</span>
        </div>
        <div class="hsc-body">
          ${todayAppts.length===0?`<div class="hsc-empty">Bugün randevu yok</div>`:''}
          ${todayAppts.map(a=>{
            const stu = S.students.find(s=>s.id===a.studentId);
            const isPast = a.time < timeNow;
            // Canlı ders kontrolü: şu andan 15 dk önce ile ders süresi sonuna kadar
            const [aH,aM] = a.time.split(':').map(Number);
            const apptMinutes = aH*60+aM;
            const [nH,nM] = timeNow.split(':').map(Number);
            const nowMinutes = nH*60+nM;
            const diffMin = apptMinutes - nowMinutes;
            const isLive = diffMin >= -((a.duration||60)) && diffMin <= 15;
            const liveBtn = isLive && a.meet_link ? `<a href="${esc(a.meet_link)}" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:8px;background:${diffMin<=0?'var(--red)':'var(--accent)'};color:${diffMin<=0?'white':'#0f0e0c'};font-size:11px;font-weight:800;text-decoration:none;animation:${diffMin<=0?'pulse 1.5s infinite':'none'};white-space:nowrap;flex-shrink:0">${diffMin<=0?'🔴 Ders Sürüyor':'🟡 Derse Gir'}</a>` : '';
            return `<div class="hsc-appt-row ${isPast&&!isLive?'hsc-appt-past':''}">
              <div class="hsc-appt-time">${a.time}</div>
              <div class="hsc-appt-bar" style="background:${stu?.color||'var(--accent)'}"></div>
              <div style="flex:1;min-width:0">
                <div class="hsc-appt-name">${esc(stu?.name||'?')}</div>
                <div class="hsc-appt-meta">${esc(a.type)} · ${a.duration} dk${!isLive&&a.meet_link?` · <a href="${esc(a.meet_link)}" target="_blank" style="color:var(--blue);text-decoration:none">${a.meet_link.includes('zoom')?'Zoom':'Meet'} →</a>`:''}</div>
              </div>
              ${liveBtn || (isPast?'<span class="hsc-appt-done">✓</span>':'')}
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- HIZLI ERİŞİM -->
    <div style="display:flex;gap:8px;max-width:900px;margin:0 auto 4px;justify-content:center">
      ${[
        {tab:'messages',icon:'💬',label:'Mesajlar',sub:unread>0?unread+' okunmamış':'Temiz'},
        {tab:'coach-notes',icon:'📝',label:'Notlarım',sub:'Kişisel notlar'},
        {tab:'todolist',icon:'📅',label:'Ajanda',sub:'Tüm randevular'},
        {tab:'coach-applications',icon:'📩',label:'Başvurular',sub:'Eşleşme talepleri'},
      ].map(({tab,icon,label,sub})=>`
        <div onclick="switchTab('${tab}')" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:9px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;transition:border-color .15s;flex:1;justify-content:center" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <span style="font-size:16px">${icon}</span>
          <div><div style="font-size:12px;font-weight:700">${label}</div><div style="font-size:10px;color:var(--text-dim)">${sub}</div></div>
        </div>`).join('')}
    </div>`;
  }catch(err){ console.error('[renderHome] HATA:',err); el.innerHTML=`<div style='padding:24px;color:var(--text)'><b>İyi günler 👋</b><p style='color:var(--text-mid);margin-top:6px'>Hata: ${esc(err.message)}</p></div>`; }
}

// ── ÖĞRENCİ ARAMA ──────────────────────────────
function renderStudentsSearch(){
  const el = document.getElementById('view-students');
  const ws = getWeekStart(0, 0);
  const weekStats = {};
  S.students.forEach(s=>{
    let total=0,done=0,totalMin=0,doneMin=0;
    for(let i=0;i<7;i++){
      const tasks=S.tasks[`${s.id}_${fmtDate(addDays(ws,i))}`]||[];
      tasks.forEach(t=>{
        total++; totalMin+=Number(t.duration||0);
        if(t.done){done++;doneMin+=Number(t.duration||0);}
      });
    }
    weekStats[s.id]={total,done,totalMin,doneMin};
  });

  const totalStudents = S.students.length;
  const activeThisWeek = S.students.filter(s=>{ const w=weekStats[s.id]; return w&&w.total>0; }).length;
  const completedAll   = S.students.filter(s=>{ const w=weekStats[s.id]; return w&&w.total>0&&w.done===w.total; }).length;

  el.innerHTML = `<div style="max-width:640px;margin:0 auto">
    <!-- Üst başlık -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <div>
        <div style="font-size:22px;font-weight:800;letter-spacing:-.3px">Öğrencilerim</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:3px">${totalStudents} öğrenci · ${activeThisWeek} bu hafta aktif · ${completedAll} hafta tamamladı</div>
      </div>
      <button class="btn btn-accent" onclick="openStudentModal()" style="gap:6px;font-size:13px;padding:9px 18px">
        <span style="font-size:16px;line-height:1">+</span> Yeni Öğrenci
      </button>
    </div>

    <!-- Arama -->
    <div style="position:relative;margin-bottom:16px">
      <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:var(--text-dim)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" placeholder="Öğrenci ara..." id="stuSearchInput" oninput="filterStudentSearch()" autocomplete="off"
        style="width:100%;padding:11px 14px 11px 40px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box;transition:border .15s"
        onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
    </div>

    <!-- Öğrenci listesi -->
    <div id="stuSearchResults" style="display:flex;flex-direction:column;gap:8px">
      ${S.students.length === 0 ? `
        <div style="text-align:center;padding:64px 20px;color:var(--text-dim)">
          <div style="width:56px;height:56px;border-radius:16px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 16px">👤</div>
          <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">Henüz öğrenciniz yok</div>
          <div style="font-size:12px">Yeni öğrenci eklemek için sağ üstteki butonu kullanın.</div>
        </div>
      ` : S.students.map(s=>{
        const w=weekStats[s.id]||{total:0,done:0,totalMin:0,doneMin:0};
        const pct=w.total>0?Math.round((w.done/w.total)*100):0;
        const pctColor=pct>=80?'var(--green)':pct>=40?'var(--accent)':'var(--red)';
        const barColor=pct>=80?'#059669':pct>=40?'#E8613A':'#DC2626';
        const isComplete=w.total>0&&w.done===w.total;
        const lastExam=S.exams.filter(e=>e.studentId===s.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
        const totalNet=lastExam?Object.values(lastExam.nets||{}).reduce((a,b)=>a+b,0).toFixed(1):null;
        return `<div class="stu-row" id="sturow_${s.id}" onclick="openStudentDetail('${s.id}')" style="padding:12px 16px;align-items:center;gap:12px;border-radius:10px">
          <div style="width:38px;height:38px;border-radius:10px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0">${s.name[0]}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--text)">${esc(s.name)}</div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:1px">${esc(s.target||'Hedef belirtilmemiş')}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;font-size:11px;color:var(--text-mid)">
            <span style="font-weight:700;color:${pctColor}">%${pct}</span>
            <span style="color:var(--border2)">·</span>
            <span>${w.done}/${w.total} görev</span>
            ${totalNet?`<span style="color:var(--border2)">·</span><span><b style="color:var(--text)">${totalNet}</b> net</span>`:''}
            ${isComplete?`<span style="color:var(--border2)">·</span><span style="color:var(--green);font-weight:600">✓ Tamam</span>`:''}
          </div>
          <svg style="width:13px;height:13px;color:var(--border2);flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        </div>`;
      }).join('')}
    </div>
    <div id="stuSearchNoResults" style="display:none;text-align:center;padding:48px 20px;color:var(--text-dim)">
      <div style="font-size:13px">Aramanızla eşleşen öğrenci bulunamadı.</div>
    </div>
  </div>`;
}

function filterStudentSearch(){
  const q = document.getElementById('stuSearchInput').value.trim().toLowerCase();
  const noResults = document.getElementById('stuSearchNoResults');
  let matchCount = 0;
  S.students.forEach(s=>{
    const row=document.getElementById('sturow_'+s.id);
    if(row) {
      const match = s.name.toLowerCase().includes(q);
      row.style.display=match?'flex':'none';
      if(match) matchCount++;
    }
  });
  if(noResults) {
    noResults.style.display = (q && matchCount === 0) ? 'block' : 'none';
  }
}

function openStudentDetail(stuId){
  if(!S.students.find(s=>s.id===stuId)) return;
  S.activeStuId = stuId;

  const s = S.students.find(s=>s.id===S.activeStuId);
  const ws = getWeekStart(0, s.weekStart||0);
  let wTotal=0,wDone=0,wMin=0;
  for(let i=0;i<7;i++){
    const tasks=S.tasks[`${s.id}_${fmtDate(addDays(ws,i))}`]||[];
    wTotal+=tasks.length; wDone+=tasks.filter(t=>t.done).length;
    wMin+=tasks.reduce((sum,t)=>sum+Number(t.duration||0),0);
  }
  const wPct=wTotal>0?Math.round((wDone/wTotal)*100):0;
  const pctColor=wPct>=80?'var(--green)':wPct>=50?'var(--accent)':'var(--red)';

  const el=document.getElementById('view-student-detail');
  el.innerHTML=`
    <button class="back-link" onclick="switchTab('students')">← Öğrencilerim</button>

    <!-- Öğrenci başlık -->
    <div style="display:flex;align-items:flex-start;gap:18px;padding-bottom:24px;border-bottom:1px solid var(--border);margin-bottom:0">
      <div style="width:52px;height:52px;border-radius:12px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;flex-shrink:0">${s.name[0]}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:20px;font-weight:800;letter-spacing:-.3px;line-height:1.2">${esc(s.name)}</div>
        <div style="font-size:13px;color:var(--text-mid);margin-top:3px">${esc(s.target||'Hedef belirtilmemiş')}</div>
        <div style="display:flex;gap:28px;margin-top:14px;flex-wrap:wrap">
          <div><div style="font-size:22px;font-weight:800;color:var(--accent);line-height:1;letter-spacing:-.5px">${wTotal}</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Bu Hafta</div></div>
          <div><div style="font-size:22px;font-weight:800;color:var(--green);line-height:1;letter-spacing:-.5px">${wDone}</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Tamamlanan</div></div>
          <div><div style="font-size:22px;font-weight:800;color:${pctColor};line-height:1;letter-spacing:-.5px">%${wPct}</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Oran</div></div>
          <div><div style="font-size:22px;font-weight:800;color:var(--blue);line-height:1;letter-spacing:-.5px">${Math.round(wMin/60)}s</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Çalışma</div></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0;padding-top:4px">
        <button class="btn btn-ghost btn-sm" onclick="switchTab('messages');setTimeout(()=>selectThread('${s.id}'),100)" style="gap:5px">💬 Mesaj</button>
        <button class="btn btn-ghost btn-sm" onclick="openStudentModal('${s.id}')" style="gap:5px">✏️ Düzenle</button>
      </div>
    </div>

    <!-- Sekme navigasyonu -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:24px;overflow-x:auto">
      ${[
        {label:'Program', icon:'📋', fn:`openStudentProgram('${s.id}')`},
        {label:'Denemeler', icon:'📊', fn:`openStudentExams('${s.id}')`},
        {label:'Randevular', icon:'📅', fn:`openStudentAppointments('${s.id}')`},
        {label:'Notlar', icon:'📝', fn:`openStudentNotes('${s.id}')`},
        {label:'Kaynaklar', icon:'📖', fn:`openStudentKaynaklar('${s.id}')`},
        {label:'Konu Haritası', icon:'🗺️', fn:`openKonuHaritasi('${s.id}')`},
        {label:'Hız', icon:'⚡', fn:`openSpeedModal('${s.id}')`},
        {label:'Rapor', icon:'📄', fn:`openReportModal('${s.id}')`},
        {label:'Geçmiş Raporlar', icon:'🗂️', fn:`openPastReports('${s.id}')`},
      ].map(t=>`<button onclick="${t.fn}" style="display:flex;align-items:center;gap:6px;padding:14px 18px;background:none;border:none;border-bottom:2px solid transparent;font-size:13px;font-weight:600;color:var(--text-mid);cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s" onmouseover="this.style.color='var(--text)';this.style.borderBottomColor='var(--border2)'" onmouseout="this.style.color='var(--text-mid)';this.style.borderBottomColor='transparent'">${t.icon} ${t.label}</button>`).join('')}
    </div>

    <!-- Haftalık ilerleme -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:16px;box-shadow:var(--shadow)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text)">Haftalık İlerleme</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px">${wDone} tamamlandı · ${wTotal - wDone} kaldı · ${Math.round(wMin/60)} saat</div>
        </div>
        <div style="font-size:28px;font-weight:800;color:${pctColor};letter-spacing:-.5px">%${wPct}</div>
      </div>
      <div style="height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${wPct}%;background:${pctColor};border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1)"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:10px">
        <span style="font-size:11px;color:var(--text-dim)">0%</span>
        <span style="font-size:11px;color:var(--text-dim)">100%</span>
      </div>
    </div>

    <!-- AI COPILOT SECTION -->
    <div class="card" style="margin-top:16px; border: 1px dashed var(--accent); padding: 18px; border-radius: 14px; background: var(--surface)">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px">
        <span style="font-size:24px">🤖</span>
        <div>
          <h3 style="margin:0; font-family:'Inter',sans-serif; font-size:16px; font-weight:800">Yapay Zeka Copilot</h3>
          <p style="margin:2px 0 0 0; font-size:11px; color:var(--text-dim)">Öğrencinin haftalık performans verilerini analiz ederek kişiselleştirilmiş bir mesaj taslağı hazırlayın.</p>
        </div>
      </div>
      
      <div style="margin-bottom:12px">
        <button id="aiCopilotBtn" class="btn btn-accent btn-sm" onclick="generateAICopilotDraft('${s.id}')">🤖 Durum Analizi Yap ve Taslak Oluştur</button>
      </div>
      
      <div id="aiCopilotResultArea" style="display:none; margin-top:12px">
        <div id="aiCopilotAnalysisBox" style="background:var(--surface2); border:1px solid var(--border); padding:12px; border-radius:8px; font-size:12px; margin-bottom:12px; line-height:1.5">
          <!-- Analiz buraya gelecek -->
        </div>
        <div style="background:var(--accent-dim); border:1px solid var(--accent); color:var(--accent); padding:10px; border-radius:8px; font-size:11px; margin-bottom:10px">
          💡 <b>Önemli Not:</b> Yapay zekanın hazırladığı taslak aşağıdadır. Gönderebilmek için taslağı en az bir karakter değiştirecek şekilde düzenlemelisiniz.
        </div>
        <div class="field">
          <label style="font-size:11px; font-weight:700">Mesaj Taslağı (Düzenlenmesi Zorunlu)</label>
          <textarea id="aiCopilotTextarea" style="width:100%; min-height:150px; font-family:inherit; font-size:13px; line-height:1.5; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--surface2); color:var(--text)" oninput="checkCopilotDraftEdited()"></textarea>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px">
          <button id="aiCopilotSendBtn" class="btn btn-accent btn-sm" onclick="sendCopilotDraft('${s.id}')" style="background:var(--green); border-color:var(--green); color:white" disabled>✍️ Düzenlemeyi Kaydet ve Öğrenciye Gönder</button>
          <span id="aiCopilotEditWarning" style="color:var(--red); font-size:11px; font-weight:bold">Öğrenciye gönderebilmek için taslak üzerinde en az bir değişiklik yapmalısınız.</span>
        </div>
      </div>
    </div>`;

  if(currentTab !== 'student-detail') switchTab('student-detail');
  const _tt1=document.getElementById('tbarTitle'); if(_tt1) _tt1.textContent = s.name;
}

// ── YILDIZ SEVİYE TANIMLARI ─────────────────────
const MASTERY_LEVELS = [
  { stars: 0, label: 'Başlanmadı',       color: '#6b7280', bg: 'rgba(107,114,128,.08)',  border: 'rgba(107,114,128,.2)'  },
  { stars: 1, label: 'Anlamadım',        color: '#ef4444', bg: 'rgba(239,68,68,.08)',    border: 'rgba(239,68,68,.2)'    },
  { stars: 2, label: 'Temel Zorluk',     color: '#f97316', bg: 'rgba(249,115,22,.08)',   border: 'rgba(249,115,22,.2)'   },
  { stars: 3, label: 'Temel OK',         color: '#eab308', bg: 'rgba(234,179,8,.08)',    border: 'rgba(234,179,8,.2)'    },
  { stars: 4, label: 'Orta Seviye',      color: '#84cc16', bg: 'rgba(132,204,22,.08)',   border: 'rgba(132,204,22,.2)'   },
  { stars: 5, label: 'İleri Seviye',     color: '#22c55e', bg: 'rgba(34,197,94,.08)',    border: 'rgba(34,197,94,.2)'    },
  { stars: 6, label: 'Uzman',            color: '#10b981', bg: 'rgba(16,185,129,.08)',   border: 'rgba(16,185,129,.2)'   },
  { stars: 7, label: 'Tekrar Dışı (TD)', color: '#3b82f6', bg: 'rgba(59,130,246,.1)',    border: 'rgba(59,130,246,.3)'   },
];

// 10 günlük periyot hesaplama yardımcıları
function _getPeriodStart(date) {
  const d = new Date(date);
  const day = d.getDate();
  const periodDay = day <= 10 ? 1 : day <= 20 ? 11 : 21;
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(periodDay).padStart(2,'0')}`;
}

function _getPeriods(count = 6) {
  const periods = [];
  const now = new Date();
  // Bugünün periyodundan geriye doğru `count` periyot
  let d = new Date(now);
  for (let i = 0; i < count; i++) {
    const ps = _getPeriodStart(d);
    if (!periods.find(p => p.start === ps)) periods.unshift({ start: ps, label: _periodLabel(ps) });
    // Bir önceki periyoda git
    const [y, m, day] = ps.split('-').map(Number);
    if (day === 21) d = new Date(y, m-1, 11);
    else if (day === 11) d = new Date(y, m-1, 1);
    else d = new Date(y, m-2, 21);
    if (periods.length >= count) break;
  }
  return periods.slice(-count);
}

function _periodLabel(ps) {
  const [y, m, d] = ps.split('-').map(Number);
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const endDay = d === 1 ? 10 : d === 11 ? 20 : new Date(y, m, 0).getDate();
  return `${d}-${endDay} ${months[m-1]}`;
}

// ── YKS ALAN DERS GRUPLARI ──────────────────────
const YKS_AREA_SUBJECTS = {
  SAY: ['Dil Bilgisi', 'TYT Matematik', 'AYT Matematik', 'Geometri', 'TYT Fizik', 'AYT Fizik', 'TYT Kimya', 'AYT Kimya', 'TYT Biyoloji', 'AYT Biyoloji'],
  EA: ['Dil Bilgisi', 'TYT Matematik', 'AYT Matematik', 'Geometri', 'AYT Edebiyat', 'Tarih (TYT-AYT)', 'Coğrafya (TYT-AYT)', 'Felsefe Grubu & Din'],
  SOZ: ['Dil Bilgisi', 'TYT Matematik', 'Geometri', 'AYT Edebiyat', 'Tarih (TYT-AYT)', 'Coğrafya (TYT-AYT)', 'Felsefe Grubu & Din'],
  DIL: ['Dil Bilgisi', 'TYT Matematik', 'Geometri', 'YDT İngilizce']
};

async function openKonuHaritasi(stuId) {
  const s = S.students.find(x => x.id === stuId);
  if (!s) return;

  const el = document.getElementById('view-student-detail');
  el.innerHTML = `<button class="back-link" onclick="openStudentDetail('${stuId}')">← ${esc(s.name)}</button><div style="padding:20px;color:var(--text-dim);font-size:13px">Yükleniyor…</div>`;

  const isCoach = session.role === 'coach' || session.role === 'developer';
  const area = s.yksArea || 'SAY';
  const subjects = YKS_AREA_SUBJECTS[area] || YKS_AREA_SUBJECTS.SAY;
  let activeSub = subjects[0];
  let activeView = 'mastery'; // 'mastery' | 'tekrar'

  // Mastery verisini S'den al (api.js'de yüklendi)
  // { subject: { konu: row } }
  function getMastery(subject, konu) {
    return (S.konuMastery[stuId]?.[subject]?.[konu]) || null;
  }

  function getTekrarLog(subject, konu) {
    return S.konuTekrarLog[stuId]?.[subject]?.[konu] || {};
  }

  // ── Mastery güncelleme ──────────────────────────
  async function updateMastery(subject, konu, stars, statusOverride) {
    const existing = getMastery(subject, konu);
    const now = new Date().toISOString();
    const newStatus = statusOverride || (stars >= 7 ? 'td' : stars > 0 ? 'active' : 'not_started');
    const row = {
      student_id: stuId,
      coach_id: session.coachId,
      subject, konu, stars,
      status: newStatus,
      updated_at: now,
      ...(newStatus === 'active' && !existing?.ka_date ? { ka_date: now } : {}),
      ...(newStatus === 'td' && !existing?.td_date ? { td_date: now } : {}),
      ...(newStatus === 'active' && existing?.status === 'td' ? { td_date: null } : {}),
    };
    const { data, error } = await db.from('konu_mastery')
      .upsert(row, { onConflict: 'student_id,subject,konu' })
      .select().single();
    if (error) { showToast('Hata: ' + error.message); return; }
    // State güncelle
    if (!S.konuMastery[stuId]) S.konuMastery[stuId] = {};
    if (!S.konuMastery[stuId][subject]) S.konuMastery[stuId][subject] = {};
    S.konuMastery[stuId][subject][konu] = data;
    return data;
  }

  // ── Tekrar log güncelleme ───────────────────────
  async function updateTekrarLog(subject, konu, periodStart, count) {
    const now = new Date().toISOString();
    const row = {
      student_id: stuId,
      coach_id: session.coachId,
      subject, konu,
      period_start: periodStart,
      review_count: count,
      updated_at: now
    };
    const { data, error } = await db.from('konu_tekrar_log')
      .upsert(row, { onConflict: 'student_id,subject,konu,period_start' })
      .select().single();
    if (error) { showToast('Hata: ' + error.message); return; }
    if (!S.konuTekrarLog[stuId]) S.konuTekrarLog[stuId] = {};
    if (!S.konuTekrarLog[stuId][subject]) S.konuTekrarLog[stuId][subject] = {};
    if (!S.konuTekrarLog[stuId][subject][konu]) S.konuTekrarLog[stuId][subject][konu] = {};
    S.konuTekrarLog[stuId][subject][konu][periodStart] = data;
    return data;
  }

  // ── MASTERY TABLE ───────────────────────────────
  function buildMasteryTable(subKey) {
    const topics = KONU_LISTESI[subKey] || [];
    const rows = topics.map((konu, ri) => {
      const m = getMastery(subKey, konu);
      const stars = m?.stars || 0;
      const status = m?.status || 'not_started';
      const lv = MASTERY_LEVELS[stars];
      const isTD = status === 'td';
      const rowBg = ri % 2 === 0 ? 'var(--surface)' : 'var(--surface2)';

      // Toplam tekrar sayısı
      const tekrarMap = getTekrarLog(subKey, konu);
      const totalReviews = Object.values(tekrarMap).reduce((a, r) => a + (r.review_count || 0), 0);
      const lastReviewDate = m?.last_review_date ? new Date(m.last_review_date).toLocaleDateString('tr-TR', {day:'2-digit',month:'short'}) : '—';

      // Yıldız widget
      const starHtml = isCoach ? Array.from({length:7}, (_, i) => {
        const sv = i + 1;
        const filled = sv <= stars;
        const escSub = subKey.replace(/'/g, "\\'");
        const escKonu = konu.replace(/'/g, "\\'");
        return `<span class="km-star${filled?' km-star-on':''}" data-stars="${sv}" 
          onclick="window._kmSetStars('${escSub}','${escKonu}',${sv})"
          title="${MASTERY_LEVELS[sv].label}"
          style="cursor:pointer;font-size:16px;line-height:1;transition:transform .1s;display:inline-block"
          onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'"
        >${filled?'⭐':'☆'}</span>`;
      }).join('') : Array.from({length:7}, (_,i) => `<span style="font-size:14px;opacity:${i<stars?1:.25}">${i<stars?'⭐':'☆'}</span>`).join('');

      // Statü rozeti
      let statusBadge = '';
      if (isTD) statusBadge = `<span style="font-size:9px;font-weight:800;color:#3b82f6;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);border-radius:4px;padding:1px 5px;margin-left:4px">TD</span>`;
      else if (m?.ka_date) statusBadge = `<span style="font-size:9px;font-weight:700;color:#10b981;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);border-radius:4px;padding:1px 5px;margin-left:4px">KA✓</span>`;

      const konuId = 'km_' + btoa(encodeURIComponent(subKey + '|' + konu)).replace(/[^a-zA-Z0-9]/g,'');

      return `<tr id="${konuId}" style="background:${lv.bg};border-bottom:1px solid ${lv.border};transition:background .3s">
        <td style="padding:10px 14px;font-size:12px;font-weight:600;color:var(--text);min-width:200px;position:sticky;left:0;z-index:1;background:${rowBg};border-right:1px solid var(--border)">
          ${esc(konu)}${statusBadge}
        </td>
        <td style="padding:8px 12px;white-space:nowrap">
          ${starHtml}
        </td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:${lv.color};white-space:nowrap">
          ${stars > 0 ? lv.label : '<span style="color:var(--text-dim)">—</span>'}
        </td>
        <td style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-mid);white-space:nowrap">
          ${totalReviews > 0 ? `<b style="color:var(--text)">${totalReviews}×</b>` : '—'}
        </td>
        <td style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-dim);white-space:nowrap">${lastReviewDate}</td>
        ${isCoach ? `<td style="padding:8px 8px;text-align:center;white-space:nowrap">
          <button onclick="window._kmToggleKA('${subKey.replace(/'/g, "\\'")}','${konu.replace(/'/g, "\\'")}')" 
            style="font-size:10px;padding:3px 7px;border-radius:5px;border:1px solid var(--border);background:var(--surface2);color:var(--text-mid);cursor:pointer;margin-right:4px" 
            title="Konu Anlatımı tamamlandı">KA</button>
          <button onclick="window._kmToggleTD('${subKey.replace(/'/g, "\\'")}','${konu.replace(/'/g, "\\'")}')" 
            style="font-size:10px;padding:3px 7px;border-radius:5px;border:1px solid ${isTD?'#3b82f6':'var(--border)'};background:${isTD?'rgba(59,130,246,.15)':'var(--surface2)'};color:${isTD?'#3b82f6':'var(--text-mid)'};cursor:pointer;font-weight:${isTD?'800':'400'}" 
            title="Tekrar Dışı">TD</button>
        </td>` : ''}
      </tr>`;
    }).join('');

    // Özet istatistikler
    const allMastery = topics.map(k => getMastery(subKey, k));
    const countByLevel = Array(8).fill(0);
    allMastery.forEach(m => countByLevel[m?.stars || 0]++);
    const tdCount = allMastery.filter(m => m?.status === 'td').length;
    const activeCount = allMastery.filter(m => m?.status === 'active').length;

    const statsHtml = `<div style="display:flex;gap:12px;flex-wrap:wrap;padding:12px 16px;background:var(--surface2);border-bottom:1px solid var(--border);align-items:center">
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:var(--text)">${topics.length}</b> konu</span>
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:#3b82f6">${tdCount}</b> TD</span>
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:#22c55e">${activeCount}</b> aktif</span>
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:#6b7280">${countByLevel[0]}</b> başlanmadı</span>
      <div style="flex:1;height:6px;background:var(--surface3);border-radius:99px;overflow:hidden;min-width:80px;max-width:200px">
        <div style="height:100%;width:${topics.length > 0 ? Math.round((tdCount/topics.length)*100) : 0}%;background:#3b82f6;border-radius:99px"></div>
      </div>
      <span style="font-size:11px;color:#3b82f6;font-weight:700">${topics.length > 0 ? Math.round((tdCount/topics.length)*100) : 0}% TD</span>
    </div>`;

    return statsHtml + `<div style="overflow-x:auto">
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr style="background:var(--surface2)">
            <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);border-right:1px solid var(--border);position:sticky;left:0;z-index:2;background:var(--surface2);white-space:nowrap;min-width:200px">KONU</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">HAKİMİYET</th>
            <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">SEVİYE</th>
            <th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">TEKRAR</th>
            <th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">SON TEKRAR</th>
            ${isCoach ? `<th style="padding:8px 8px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">İŞLEMLER</th>` : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  // ── TEKRAR TAKVİM TABLE ─────────────────────────
  function buildTekrarTable(subKey) {
    const topics = KONU_LISTESI[subKey] || [];
    const periods = _getPeriods(6);
    const todayPeriod = _getPeriodStart(new Date());

    const header = `<tr style="background:var(--surface2)">
      <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);border-right:1px solid var(--border);position:sticky;left:0;z-index:2;background:var(--surface2);white-space:nowrap;min-width:200px">KONU</th>
      <th style="padding:8px 8px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap;min-width:60px">⭐</th>
      ${periods.map(p => `<th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:${p.start===todayPeriod?'var(--accent)':'var(--text-dim)'};background:${p.start===todayPeriod?'var(--accent-dim)':'var(--surface2)'};white-space:nowrap;min-width:100px;border-left:1px solid var(--border)">${p.label}</th>`).join('')}
      <th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap;border-left:2px solid var(--border)">TOPLAM</th>
    </tr>`;

    const body = topics.map((konu, ri) => {
      const m = getMastery(subKey, konu);
      const stars = m?.stars || 0;
      const status = m?.status || 'not_started';
      const isTD = status === 'td';
      const lv = MASTERY_LEVELS[stars];
      const rowBg = ri % 2 === 0 ? 'var(--surface)' : 'var(--surface2)';
      const tekrarMap = getTekrarLog(subKey, konu);

      let totalReviews = 0;
      const periodCells = periods.map(p => {
        const logRow = tekrarMap[p.start];
        const cnt = logRow?.review_count || 0;
        totalReviews += cnt;
        const isCurrent = p.start === todayPeriod;

        if (isCoach) {
          // 6 kutucukluk mini grid
          const boxes = Array.from({length:6}, (_, bi) => {
            const filled = bi < cnt;
            const escSub = subKey.replace(/'/g, "\\'");
            const escKonu = konu.replace(/'/g, "\\'");
            return `<span class="kt-box${filled?' kt-box-on':''}"
              onclick="window._ktToggleBox('${escSub}','${escKonu}','${p.start}',${bi+1})"
              style="display:inline-block;width:14px;height:14px;border-radius:3px;border:1.5px solid ${filled?lv.color:'var(--border2)'};background:${filled?lv.bg:'transparent'};cursor:pointer;transition:all .15s;margin:1px"
              title="${bi+1}. tekrar"
            ></span>`;
          }).join('');
          return `<td style="padding:6px 10px;border-left:1px solid var(--border);background:${isCurrent?'var(--accent-dim)':rowBg};text-align:center">${boxes}</td>`;
        } else {
          const boxes = Array.from({length:6}, (_, bi) => {
            const filled = bi < cnt;
            return `<span style="display:inline-block;width:12px;height:12px;border-radius:3px;border:1.5px solid ${filled?lv.color:'var(--border2)'};background:${filled?lv.bg:'transparent'};margin:1px"></span>`;
          }).join('');
          return `<td style="padding:6px 10px;border-left:1px solid var(--border);background:${isCurrent?'var(--accent-dim)':rowBg};text-align:center">${boxes}</td>`;
        }
      }).join('');

      const statusBadge = isTD 
        ? `<span style="font-size:9px;font-weight:800;color:#3b82f6;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);border-radius:4px;padding:1px 5px;margin-left:4px">TD</span>`
        : '';

      return `<tr style="background:${rowBg}">
        <td style="padding:8px 14px;font-size:12px;font-weight:600;color:var(--text);border-right:1px solid var(--border);position:sticky;left:0;z-index:1;background:${rowBg};white-space:nowrap">
          ${esc(konu)}${statusBadge}
        </td>
        <td style="padding:8px 8px;white-space:nowrap">
          <span style="font-size:11px">${'⭐'.repeat(Math.max(0,stars))}</span>
        </td>
        ${periodCells}
        <td style="padding:8px 10px;text-align:center;font-size:12px;font-weight:800;color:${totalReviews>0?lv.color:'var(--text-dim)'};border-left:2px solid var(--border)">${totalReviews||0}</td>
      </tr>`;
    }).join('');

    return `<div style="overflow-x:auto"><table style="border-collapse:collapse;width:max-content;min-width:100%"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
  }

  // ── Window callbacks ─────────────────────────────
  window._kmSetStars = async function(subject, konu, stars) {
    const existing = getMastery(subject, konu);
    // TD'deyse ve yıldız düşürülüyorsa statüyü aktife al
    const statusOverride = existing?.status === 'td' && stars < 7 ? 'active' : null;
    await updateMastery(subject, konu, stars, statusOverride);
    // Satırı yenile
    const konuId = 'km_' + btoa(encodeURIComponent(subject + '|' + konu)).replace(/[^a-zA-Z0-9]/g,'');
    const row = document.getElementById(konuId);
    if (row) {
      const freshHtml = buildMasteryTable(subject);
      document.getElementById('khTable').innerHTML = freshHtml;
    }
    showToast(`${konu}: ${MASTERY_LEVELS[stars].label} ✓`);
  };

  window._kmToggleKA = async function(subject, konu) {
    const existing = getMastery(subject, konu);
    const now = new Date().toISOString();
    const hasKA = !!existing?.ka_date;
    const row = {
      student_id: stuId, coach_id: session.coachId,
      subject, konu,
      stars: existing?.stars || 1,
      status: existing?.status || 'active',
      ka_date: hasKA ? null : now,
      updated_at: now
    };
    const { data, error } = await db.from('konu_mastery').upsert(row, { onConflict: 'student_id,subject,konu' }).select().single();
    if (error) { showToast('Hata: ' + error.message); return; }
    if (!S.konuMastery[stuId]) S.konuMastery[stuId] = {};
    if (!S.konuMastery[stuId][subject]) S.konuMastery[stuId][subject] = {};
    S.konuMastery[stuId][subject][konu] = data;
    document.getElementById('khTable').innerHTML = buildMasteryTable(subject);
    showToast(hasKA ? 'KA tarihi kaldırıldı' : 'KA ✓ tamamlandı olarak işaretlendi');
  };

  window._kmToggleTD = async function(subject, konu) {
    const existing = getMastery(subject, konu);
    const isTD = existing?.status === 'td';
    const newStars = isTD ? (existing?.stars >= 7 ? 5 : existing?.stars) : 7;
    await updateMastery(subject, konu, newStars, isTD ? 'active' : 'td');
    document.getElementById('khTable').innerHTML = activeView === 'mastery' ? buildMasteryTable(subject) : buildTekrarTable(subject);
    showToast(isTD ? `${konu} tekrar listesine geri döndü` : `${konu} → TD ✓`);
  };

  window._ktToggleBox = async function(subject, konu, periodStart, boxIndex) {
    const existing = getTekrarLog(subject, konu);
    const logRow = existing[periodStart];
    const currentCount = logRow?.review_count || 0;
    // Toggle: eğer tıklanan kutu zaten doluysa o kutunun sayısına indir, değilse artır
    const newCount = currentCount >= boxIndex ? boxIndex - 1 : boxIndex;
    await updateTekrarLog(subject, konu, periodStart, newCount);
    // Son tekrar tarihini güncelle
    if (newCount > 0) {
      const m = getMastery(subject, konu);
      const now = new Date().toISOString();
      const reviewRow = {
        student_id: stuId, coach_id: session.coachId, subject, konu,
        stars: m?.stars || 0, status: m?.status || 'active',
        last_review_date: now, review_count: (m?.review_count || 0) + 1,
        updated_at: now
      };
      const { data } = await db.from('konu_mastery').upsert(reviewRow, { onConflict: 'student_id,subject,konu' }).select().single();
      if (data) {
        if (!S.konuMastery[stuId]) S.konuMastery[stuId] = {};
        if (!S.konuMastery[stuId][subject]) S.konuMastery[stuId][subject] = {};
        S.konuMastery[stuId][subject][konu] = data;
      }
    }
    document.getElementById('khTable').innerHTML = buildTekrarTable(subject);
  };


  // ── Ders tabları ve görünüm toggle ──────────────
  function _refreshTable() {
    const sub = window._khActiveSub || activeSub;
    document.getElementById('khTable').innerHTML = activeView === 'mastery' ? buildMasteryTable(sub) : buildTekrarTable(sub);
  }

  const subTabs = subjects.map(k =>
    `<button class="kh-tab" onclick="window._khActiveSub='${k}';document.querySelectorAll('.kh-tab').forEach(b=>{b.style.color='var(--text-mid)';b.style.borderBottom='2px solid transparent';b.style.fontWeight='600'});this.style.color='var(--accent)';this.style.borderBottom='2px solid var(--accent)';this.style.fontWeight='700';window._khRefresh()"
      style="padding:10px 16px;border:none;border-bottom:2px solid ${k===activeSub?'var(--accent)':'transparent'};background:none;font-size:12px;font-weight:${k===activeSub?'700':'600'};color:${k===activeSub?'var(--accent)':'var(--text-mid)'};cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s">${k}</button>`
  ).join('');

  window._khActiveSub = activeSub;
  window._khRefresh = _refreshTable;

  el.innerHTML = `
    <button class="back-link" onclick="openStudentDetail('${stuId}')">← ${esc(s.name)}</button>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
      <div style="font-size:18px;font-weight:800;letter-spacing:-.2px">${esc(s.name)} — Konu Haritası</div>
      <div style="display:flex;gap:8px;align-items:center">
        <div style="display:flex;border:1.5px solid var(--border);border-radius:8px;overflow:hidden;font-size:12px">
          <button id="kmViewMastery" onclick="window._kmSwitchView('mastery')" style="padding:7px 14px;border:none;border-right:1px solid var(--border);background:var(--accent);color:#fff;font-weight:700;cursor:pointer;font-family:inherit">⭐ Hakimiyet</button>
          <button id="kmViewTekrar" onclick="window._kmSwitchView('tekrar')" style="padding:7px 14px;border:none;background:var(--surface);color:var(--text-mid);font-weight:600;cursor:pointer;font-family:inherit">🔄 Tekrar Takvimi</button>
        </div>
      </div>
    </div>

    <!-- Yıldız açıklama rehberi (collapsible) -->
    <details style="margin-bottom:12px;background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden">
      <summary style="padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;color:var(--text-mid);list-style:none;display:flex;align-items:center;gap:6px">
        ℹ️ Yıldız Seviye Rehberi
        <svg style="width:14px;height:14px;margin-left:auto" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </summary>
      <div style="padding:12px 16px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:8px">
        ${MASTERY_LEVELS.slice(1).map(lv => `
          <div style="display:flex;align-items:center;gap:6px;font-size:11px">
            <span style="font-weight:800;color:${lv.color}">⭐${lv.stars}</span>
            <span style="color:var(--text-mid)">${lv.label}</span>
          </div>`).join('<span style="color:var(--border2)">·</span>')}
      </div>
    </details>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--shadow)">
      <div style="display:flex;border-bottom:1px solid var(--border);overflow-x:auto;padding:0 4px">${subTabs}</div>
      <div id="khTable" style="overflow-x:auto;max-height:calc(100vh - 310px);overflow-y:auto">${buildMasteryTable(activeSub)}</div>
    </div>`;

  window._kmSwitchView = function(view) {
    activeView = view;
    const btnM = document.getElementById('kmViewMastery');
    const btnT = document.getElementById('kmViewTekrar');
    if (view === 'mastery') {
      btnM.style.background = 'var(--accent)'; btnM.style.color = '#fff'; btnM.style.fontWeight = '700';
      btnT.style.background = 'var(--surface)'; btnT.style.color = 'var(--text-mid)'; btnT.style.fontWeight = '600';
    } else {
      btnT.style.background = 'var(--accent)'; btnT.style.color = '#fff'; btnT.style.fontWeight = '700';
      btnM.style.background = 'var(--surface)'; btnM.style.color = 'var(--text-mid)'; btnM.style.fontWeight = '600';
    }
    window._khRefresh();
  };
}

function openStudentProgram(stuId){
  S.activeStuId = stuId;
  const el = document.getElementById('view-program');
  const _sn=S.students.find(s=>s.id===S.activeStuId)?.name||'';
  el.innerHTML=`<button class="back-link" onclick="switchTab('student-detail')">← ${_sn}</button>`;
  el.innerHTML += document.createElement('div').innerHTML; // placeholder
  if(currentTab !== 'program') switchTab('program');
  const _tt2=document.getElementById('tbarTitle'); if(_tt2) _tt2.textContent = (S.students.find(s=>s.id===S.activeStuId)?.name||'')+' · Program';
  renderProgram();
}

function openStudentExams(stuId){
  S.activeStuId = stuId;
  if(currentTab !== 'exams') switchTab('exams');
  const _tt3=document.getElementById('tbarTitle'); if(_tt3) _tt3.textContent = (S.students.find(s=>s.id===S.activeStuId)?.name||'')+' · Denemeler';
  renderExams();
}

function openStudentAppointments(stuId){
  S.activeStuId = stuId;
  if(currentTab !== 'appointments') switchTab('appointments');
  const _tt4=document.getElementById('tbarTitle'); if(_tt4) _tt4.textContent = (S.students.find(s=>s.id===S.activeStuId)?.name||'')+' · Randevular';
  renderAppointments();
}

// ═══════════════════════════════════════════════
// STUDENT KAYNAKLAR (Kitap / Test Takibi)
// ═══════════════════════════════════════════════
let _sbBooks = {}; // { studentId: [...books] }

async function openStudentKaynaklar(stuId) {
  const s = S.students.find(x => x.id === stuId);
  if (!s) return;
  S.activeStuId = stuId;
  if (currentTab !== 'student-detail') switchTab('student-detail');
  const el = document.getElementById('view-student-detail');
  el.innerHTML = `<button class="back-link" onclick="openStudentDetail('${stuId}')">← ${esc(s.name)}</button>
    <div style="padding:20px;color:var(--text-dim);font-size:13px">Yükleniyor…</div>`;
  if (!_sbBooks[stuId]) {
    const { data } = await db.from('student_books').select('*').eq('student_id', stuId).order('created_at', { ascending: true });
    _sbBooks[stuId] = data || [];
  }
  _renderKaynaklar(stuId);
}

function _renderKaynaklar(stuId) {
  const s = S.students.find(x => x.id === stuId);
  const books = _sbBooks[stuId] || [];
  const el = document.getElementById('view-student-detail');
  const isCoach = session.role === 'coach' || session.role === 'developer';
  const totalTests = books.reduce((s,b) => s+b.total_tests, 0);
  const doneTests  = books.reduce((s,b) => s+b.completed_tests, 0);
  const overallPct = totalTests > 0 ? Math.round((doneTests/totalTests)*100) : 0;
  const pctColor   = overallPct >= 75 ? 'var(--green)' : overallPct >= 40 ? 'var(--accent)' : 'var(--red)';

  const booksHtml = books.length ? books.map(b => {
    const pct = b.total_tests > 0 ? Math.min(100, Math.round((b.completed_tests / b.total_tests) * 100)) : 0;
    const bc  = pct >= 75 ? 'var(--green)' : pct >= 40 ? 'var(--accent)' : 'var(--red)';
    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;margin-bottom:7px">${esc(b.name)}</div>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="flex:1;height:7px;background:var(--surface3);border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:${bc};border-radius:99px;transition:width .4s"></div>
            </div>
            <span style="font-size:12px;font-weight:800;color:${bc};white-space:nowrap;min-width:36px;text-align:right">%${pct}</span>
          </div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:4px">${b.completed_tests} / ${b.total_tests} test tamamlandı</div>
        </div>
        ${isCoach ? `<div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn-ghost btn-xs" onclick="editStudentBook('${stuId}','${b.id}')">✏️</button>
          <button class="btn btn-danger btn-xs" onclick="deleteStudentBook('${stuId}','${b.id}')" style="opacity:.4" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.4">🗑</button>
        </div>` : ''}
      </div>
    </div>`;
  }).join('') : `<div class="empty"><p>Henüz kaynak eklenmemiş.</p></div>`;

  el.innerHTML = `
    <button class="back-link" onclick="openStudentDetail('${stuId}')">← ${esc(s.name)}</button>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:18px;font-weight:800;letter-spacing:-.2px">${esc(s.name)} — Kaynaklar</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:2px">${books.length} kaynak · ${doneTests}/${totalTests} test tamamlandı</div>
      </div>
      ${isCoach ? `<button class="btn btn-accent btn-sm" onclick="addStudentBook('${stuId}')">+ Kaynak Ekle</button>` : ''}
    </div>
    ${books.length > 1 ? `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:14px">
      <div style="flex:1">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Genel İlerleme</div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="flex:1;height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${overallPct}%;background:${pctColor};border-radius:99px;transition:width .4s"></div>
          </div>
          <span style="font-size:14px;font-weight:800;color:${pctColor};white-space:nowrap">%${overallPct}</span>
        </div>
      </div>
    </div>` : ''}
    ${booksHtml}`;
}

function addStudentBook(stuId) {
  document.getElementById('sbModalTitle').textContent = 'Kaynak Ekle';
  document.getElementById('sbId').value = '';
  document.getElementById('sbStuId').value = stuId;
  document.getElementById('sbName').value = '';
  document.getElementById('sbTotal').value = '0';
  document.getElementById('sbCompleted').value = '0';
  document.getElementById('sbPctPreview').innerHTML = '';
  om('sbModal');
}

function editStudentBook(stuId, bookId) {
  const b = (_sbBooks[stuId] || []).find(x => x.id === bookId);
  if (!b) return;
  document.getElementById('sbModalTitle').textContent = 'Kaynağı Düzenle';
  document.getElementById('sbId').value = bookId;
  document.getElementById('sbStuId').value = stuId;
  document.getElementById('sbName').value = b.name;
  document.getElementById('sbTotal').value = b.total_tests;
  document.getElementById('sbCompleted').value = b.completed_tests;
  sbUpdatePct();
  om('sbModal');
}

function sbUpdatePct() {
  const total     = parseInt(document.getElementById('sbTotal')?.value) || 0;
  const completed = parseInt(document.getElementById('sbCompleted')?.value) || 0;
  const el = document.getElementById('sbPctPreview');
  if (!el || !total) { if (el) el.innerHTML = ''; return; }
  const pct = Math.min(100, Math.round((completed / total) * 100));
  const c   = pct >= 75 ? 'var(--green)' : pct >= 40 ? 'var(--accent)' : 'var(--red)';
  el.innerHTML = `<div style="display:flex;align-items:center;gap:10px">
    <div style="flex:1;height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
      <div style="height:100%;width:${pct}%;background:${c};border-radius:99px;transition:width .3s"></div>
    </div>
    <span style="font-size:13px;font-weight:800;color:${c}">%${pct}</span>
  </div>`;
}

async function saveStudentBook() {
  const name = document.getElementById('sbName').value.trim();
  if (!name) return showToast('Kaynak adı girin!');
  const total     = Math.max(0, parseInt(document.getElementById('sbTotal').value) || 0);
  const completed = Math.min(total, Math.max(0, parseInt(document.getElementById('sbCompleted').value) || 0));
  const stuId = document.getElementById('sbStuId').value;
  const id    = document.getElementById('sbId').value;
  const payload = { name, total_tests: total, completed_tests: completed };
  if (id) {
    const { error } = await db.from('student_books').update(payload).eq('id', id);
    if (error) return showToast('Hata: ' + error.message);
    const b = (_sbBooks[stuId] || []).find(x => x.id === id);
    if (b) Object.assign(b, payload);
    showToast('Güncellendi ✓');
  } else {
    const { data, error } = await db.from('student_books').insert({
      ...payload, student_id: stuId, coach_id: session.coachId
    }).select().single();
    if (error) return showToast('Hata: ' + error.message);
    if (!_sbBooks[stuId]) _sbBooks[stuId] = [];
    _sbBooks[stuId].push(data);
    showToast('Kaynak eklendi ✓');
  }
  cm('sbModal');
  _renderKaynaklar(stuId);
}

async function deleteStudentBook(stuId, id) {
  if (!await customConfirm('Bu kaynağı silmek istiyor musunuz?')) return;
  const { error } = await db.from('student_books').delete().eq('id', id);
  if (error) return showToast('Hata: ' + error.message);
  _sbBooks[stuId] = (_sbBooks[stuId] || []).filter(b => b.id !== id);
  _renderKaynaklar(stuId);
  showToast('Silindi ✓');
}

// ── PROFİL ─────────────────────────────────────
function renderProfile(){
  const el = document.getElementById('view-profile');
  const u = session.dbUser;
  const initials = (u?.full_name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const roleLabel = session.role==='coach'?'Koç':session.role==='developer'?'Developer':'Öğrenci';
  el.innerHTML = `
    <div style="max-width:480px;margin:0 auto">
      <!-- Mini user card -->
      <div style="display:flex;align-items:center;gap:14px;padding:20px 24px;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:20px;box-shadow:var(--shadow)">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0">${initials}</div>
        <div>
          <div style="font-size:16px;font-weight:800;letter-spacing:-.2px">${esc(u?.full_name||'')}</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px">${roleLabel} · ${esc(S.workspace?.brand_name||'Rostrum Akademi')}</div>
        </div>
      </div>

      <!-- Form -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:16px">
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Ad Soyad</label>
          <input id="pf_name" value="${esc(u?.full_name||'')}" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Kullanıcı Adı</label>
          <input id="pf_user" value="${esc(u?.username||'')}" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        ${(session.role==='coach' || session.role==='developer')?`<div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Akademi Adı</label>
          <input id="pf_brand" value="${esc(S.workspace?.brand_name||'')}" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`:''}
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Yeni Şifre <span style="font-weight:400;text-transform:none">(boş bırakılırsa değişmez)</span></label>
          <input type="password" id="pf_pass" placeholder="••••••••" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <button class="btn btn-accent" onclick="saveProfile()" style="align-self:flex-start;padding:9px 20px">Kaydet</button>
      </div>
    </div>`;
}

async function saveProfile(){
  const name = document.getElementById('pf_name').value.trim();
  const pass = document.getElementById('pf_pass').value;
  const brand = document.getElementById('pf_brand')?.value?.trim();
  if(!name) return showToast('Ad boş olamaz!');
  const payload = {full_name:name};
  if(pass) payload.password_hash = await sha256(pass);
  await db.from('users').update(payload).eq('id',session.dbUser.id);
  if(brand && (session.role==='coach' || session.role==='developer')) {
    await db.from('workspaces').update({brand_name:brand}).eq('coach_id',session.coachId);
    S.workspace = {...(S.workspace||{}), brand_name:brand};
    document.querySelector('.sb-logo-text').textContent = brand;
  }
  session.dbUser = {...session.dbUser, full_name:name};
  document.getElementById('sbName').textContent = name;
  showToast('Profil kaydedildi ✓');
}

// ── AYARLAR ──────────────────────────────────────
function renderSettings(){
  const el = document.getElementById('view-settings');
  const isDark = document.documentElement.getAttribute('data-theme')==='dark';
  el.innerHTML = `
    <div style="max-width:500px;margin:0 auto">
      <div class="settings-block">
        <div class="settings-block-title">Görünüm</div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Mod</div></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-sm ${isDark?'btn-accent':'btn-ghost'}" onclick="setTheme('dark');renderSettings()">🌙 Karanlık</button>
            <button class="btn btn-sm ${!isDark?'btn-accent':'btn-ghost'}" onclick="setTheme('light');renderSettings()">☀️ Aydınlık</button>
          </div>
        </div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Accent Rengi</div></div>
          <div class="accent-palette">
            ${ACCENT_COLORS.map(c=>`<div class="ac-dot" onclick="applyAccent('${c.val}','${c.dim}')" style="background:${c.val}" title="${c.name}"></div>`).join('')}
          </div>
        </div>
      </div>
      
      ${session.role === 'developer' ? `
      <div class="settings-block" style="margin-top:20px">
        <div class="settings-block-title">Yapay Zeka (AI) Geliştirici Ayarları</div>
        <div class="setting-item" style="flex-direction:column;align-items:flex-start;gap:10px">
          <div>
            <div class="setting-item-lbl">Gemini API Anahtarı (Yerel Test)</div>
            <div class="setting-item-sub" style="font-size:11px;line-height:1.5;margin-top:2px">Yalnızca yerel geliştirme ortamı için. Production'da Vercel env kullanılır.</div>
          </div>
          <div style="display:flex;gap:8px;width:100%">
            <input type="text" id="geminiApiKeyInput" value="${esc(localStorage.getItem('gemini_api_key')||'')}" placeholder="AIzaSy..." style="flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:12px;outline:none" autocomplete="off">
            <button class="btn btn-accent btn-sm" onclick="saveGeminiKey()">Kaydet</button>
          </div>
        </div>
      </div>` : ''}

      <div class="settings-block" style="margin-top:20px">
        <div class="settings-block-title">Bildirim Ayarları</div>
        <div class="setting-item">
          <div>
            <div class="setting-item-lbl">Anlık Bildirimler (Push)</div>
            <div class="setting-item-sub" style="font-size:11px;line-height:1.5;margin-top:2px">Yeni mesajlar, ödevler ve deneme yorumları için tarayıcı bildirimlerini etkinleştirin.</div>
          </div>
          <button class="btn btn-accent btn-sm" onclick="requestNotificationPermission()">Etkinleştir</button>
        </div>
      </div>

      ${(session.role === 'coach' || session.role === 'developer') ? (() => {
        const u = session.dbUser;
        const plan = u?.plan || 'trial';
        const planLabel = plan === 'trial' ? 'Deneme Dönemi' : plan === 'pro' ? 'Pro Üyelik' : plan === 'premium' ? 'Premium Üyelik' : plan.charAt(0).toUpperCase() + plan.slice(1);
        const planColor = plan === 'trial' ? '#f0a500' : '#3ecf8e';
        let membershipEnd = null;
        if (u?.trial_ends_at) membershipEnd = new Date(u.trial_ends_at);
        else if (u?.created_at) membershipEnd = new Date(new Date(u.created_at).getTime() + 14 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const daysLeft = membershipEnd ? Math.max(0, Math.ceil((membershipEnd - now) / (1000 * 60 * 60 * 24))) : null;
        const fmtDate = d => d ? d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
        const statusColor = daysLeft === null ? '#888' : daysLeft > 7 ? '#3ecf8e' : daysLeft > 3 ? '#f0a500' : '#ef4444';
        const stuCount = S.students?.length || 0;
        return `
      <div class="settings-block" style="margin-top:20px">
        <div class="settings-block-title">Üyelik</div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Plan</div><div class="setting-item-sub" style="color:${planColor};font-weight:600">${planLabel}</div></div>
        </div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Bitiş Tarihi</div><div class="setting-item-sub">${fmtDate(membershipEnd)}</div></div>
          ${daysLeft !== null ? `<span style="background:${statusColor}22;color:${statusColor};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">${daysLeft} gün</span>` : ''}
        </div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Aktif Öğrenci</div><div class="setting-item-sub">${stuCount} öğrenci</div></div>
        </div>
        <div class="setting-item" style="flex-direction:column;align-items:flex-start;gap:8px">
          <div class="setting-item-lbl">Plan Yükseltme / Yenileme</div>
          <div style="font-size:11px;color:var(--text-dim);line-height:1.5">Üyelik yenileme veya plan değişikliği için destek ekibiyle iletişime geçin.</div>
          <a href="mailto:destek@rostrumakademi.com" style="font-size:12px;color:var(--accent);text-decoration:none;font-weight:600">destek@rostrumakademi.com →</a>
        </div>
      </div>`;
      })() : ''}

      <div class="settings-block" style="margin-top:20px">
        <div class="settings-block-title">Hesap</div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Kullanıcı Adı</div><div class="setting-item-sub">${esc(session.dbUser?.username||'')}</div></div>
          <button class="btn btn-ghost btn-sm" onclick="switchTab('profile')">Düzenle</button>
        </div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Oturumu Kapat</div></div>
          <button class="btn btn-danger btn-sm" onclick="doLogout()">Çıkış</button>
        </div>
      </div>
    </div>`;
}

function saveGeminiKey(){
  const key = document.getElementById('geminiApiKeyInput').value.trim();
  if(!key) {
    localStorage.removeItem('gemini_api_key');
    showToast('API Anahtarı kaldırıldı.');
  } else {
    localStorage.setItem('gemini_api_key', key);
    showToast('API Anahtarı kaydedildi ✓');
  }
}
// switchTab yukarıda tanımlı (sidebar versiyonu)

// ═══════════════════════════════════════════════
// PROGRAM
// ═══════════════════════════════════════════════
let _taskDate='';
function renderProgram(){
  const el=document.getElementById('view-program');
  const stu=S.students.find(s=>s.id===S.activeStuId);
  const ws=stu?.weekStart??0;
  const wStart=getWeekStart(S.weekOffset,ws);
  const wEnd=addDays(wStart,6);
  const today=todayStr();
  const progMode = localStorage.getItem('ra_program_mode') || 'weekly';

  let dayCards='';
  for(let i=0;i<7;i++){
    const d=addDays(wStart,i);
    const ds=fmtDate(d);
    const isToday=ds===today;
    const key=`${S.activeStuId}_${ds}`;
    const tasks=S.tasks[key]||[];
    const totalMin=tasks.reduce((s,t)=>s+Number(t.duration),0);
    const doneMin=tasks.reduce((s,t)=>s+(t.done?Number(t.duration):0),0);
    const dayLabel=DAYS_TR[(ws+i)%7];

    // Saatlik moda göre sırala
    const sortedTasks = [...tasks];
    if (progMode === 'hourly') {
      sortedTasks.sort((a, b) => {
        if (a.start_time && !b.start_time) return -1;
        if (!a.start_time && b.start_time) return 1;
        if (a.start_time && b.start_time) return a.start_time.localeCompare(b.start_time);
        return 0;
      });
    }

    const taskHtml=sortedTasks.map((t)=> {
      const ti = tasks.indexOf(t);
      const timeBadge = t.start_time ? `<div class="tc-time-badge">🕒 ${t.start_time}</div>` : '';
      return `
        <div data-task-id="${t._id}" class="task-card task-${t.type} ${t.done?'done':''} ${t.start_time?'hourly-card':''}" onclick="openTaskDetail('${ds}',${ti},'coach')" style="cursor:pointer">
          <div class="tc-check ${t.done?'on':''}" onclick="event.stopPropagation();toggleTask('${ds}',${ti})"></div>
          <div class="tc-body">
            ${timeBadge}
            <div class="tc-type">${typeLabel(t.type)}${t.exam?' · '+t.exam:''}</div>
            <div class="tc-subject">${esc(t.subject)}</div>
            <div class="tc-meta">${t.duration} dk</div>
          </div>
          <button class="tc-menu-btn" onclick="event.stopPropagation();showTaskMenu('${ds}',${ti},this)">⋯</button>
        </div>`;
    }).join('');

    const shortDay = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][(ws+i)%7];
    dayCards+=`<div class="day-col ${isToday?'today':''}">
      <div class="day-hd">
        <div>
          <div class="day-name-lbl">${shortDay}</div>
          <div class="day-num">${d.getDate()}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="day-badge" style="font-size:8.5px">${formatMinToHours(doneMin)} / ${formatMinToHours(totalMin)}</span>
          ${_clipboardTask?`<button class="btn btn-ghost btn-xs" onclick="pasteTaskFromClipboard('${ds}')" style="font-size:9px;color:var(--accent);border-color:rgba(240,165,0,.3);background:var(--accent-dim);padding:2px 6px">Yapıştır</button>`:''}
        </div>
      </div>
      <div class="day-tasks-list">${taskHtml||''}</div>
      <button class="add-day-btn" onclick="openTaskModal('${ds}','${dayLabel}')" ${!S.activeStuId?'disabled':''}>+ Görev Ekle</button>
    </div>`;
  }

  el.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${stu?esc(stu.name):'Öğrenci'}</button>
    <div class="card prog-banner">
      <div class="prog-avatar" style="background:${stu?.color||'#555'};color:#0f0e0c">${stu?stu.name[0]:'?'}</div>
      <div class="prog-meta">
        <h2>${stu?esc(stu.name):'Öğrenci Seçin'}</h2>
        <p>${stu?esc(stu.target):'Program görüntülemek için öğrenci seçin'}</p>
      </div>
      <div class="prog-actions">
        <button class="btn btn-ghost btn-sm" onclick="saveWeekAsTemplate()" style="display:none">Şablon Kaydet</button>
        <button class="btn btn-ghost btn-sm" onclick="applyTemplateToWeek()" style="display:none">Şablon Uygula</button>
        <button class="btn btn-ghost btn-sm" onclick="openWeeklyPDFModal()">📄 PDF</button>
        <button class="btn btn-danger btn-sm" onclick="openClearWeekModal()">Temizle</button>
      </div>
    </div>
    <div class="week-nav" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn btn-ghost btn-sm" onclick="chWeek(-1)">←</button>
        <span class="week-lbl">${wStart.getDate()} ${MONTHS_TR[wStart.getMonth()]} — ${wEnd.getDate()} ${MONTHS_TR[wEnd.getMonth()]} ${wEnd.getFullYear()}</span>
        <button class="btn btn-ghost btn-sm" onclick="chWeek(1)">→</button>
        <button class="btn btn-ghost btn-sm" onclick="goToday()">Bugün</button>
      </div>
      
      <!-- Program Görünüm Seçici Toggle -->
      <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;gap:4px">
        <button class="btn btn-xs ${progMode==='weekly'?'btn-accent':'btn-ghost'}" onclick="setProgramMode('weekly')" style="padding:4px 10px;font-size:11px;font-weight:700;border-radius:8px">📋 Günlük Serbest</button>
        <button class="btn btn-xs ${progMode==='hourly'?'btn-accent':'btn-ghost'}" onclick="setProgramMode('hourly')" style="padding:4px 10px;font-size:11px;font-weight:700;border-radius:8px">🕒 Saatlik Düzen</button>
      </div>

      ${_clipboardTask?`<button class="btn btn-accent btn-sm" onclick="pasteTaskToWholeWeek()" style="font-size:12px;padding:6px 12px;gap:6px">📋 Kopyalananı Tüm Haftaya Yapıştır</button>`:''}
    </div>
    <div class="week-grid">${dayCards}</div>`;
}

function selectStu(id){S.activeStuId=id||null;saveS();renderProgram();}
function chWeek(d){S.weekOffset+=d;saveS();renderProgram();}
function goToday(){S.weekOffset=0;saveS();renderProgram();}

function setProgramMode(mode) {
  localStorage.setItem('ra_program_mode', mode);
  if (session.role === 'student') {
    renderSPortal();
  } else {
    renderProgram();
  }
}
window.setProgramMode = setProgramMode;

(()=>{
  const s=document.createElement('style');
  s.textContent=`
    .tc-time-badge {
      font-size: 11px;
      font-weight: 800;
      color: var(--accent);
      background: var(--accent-dim);
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 6px;
      width: fit-content;
      border: 1px solid rgba(240,165,0,.2);
    }
    .task-card.hourly-card {
      border-left: 4px solid var(--accent) !important;
    }
  `;
  document.head.appendChild(s);
})();

// CLEAR WEEK with day picker
let _clearDaysSel=[];
function openClearWeekModal(){
  if(!S.activeStuId)return showToast('Önce öğrenci seçin');
  const stu=S.students.find(s=>s.id===S.activeStuId);
  const ws=stu?.weekStart??0;
  const wStart=getWeekStart(S.weekOffset,ws);
  _clearDaysSel=[];
  let html='';
  for(let i=0;i<7;i++){
    const d=addDays(wStart,i);
    const ds=fmtDate(d);
    const dayLabel=DAYS_TR[(ws+i)%7];
    const hasTasks=(S.tasks[`${S.activeStuId}_${ds}`]||[]).length>0;
    const shortDay = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][(ws+i)%7];
    html+=`<button class="day-sel-btn" id="dsbtn_${i}" data-ds="${ds}" onclick="toggleDaySel(${i},'${ds}')">
      <div>${shortDay}</div>
      <div style="font-size:14px;font-weight:800">${d.getDate()}</div>
      ${hasTasks?`<div style="font-size:9px;color:var(--accent);margin-top:2px">●</div>`:'<div style="font-size:9px;opacity:0">·</div>'}
    </button>`;
  }
  document.getElementById('daySelectorGrid').innerHTML=html;
  om('clearWeekModal');
}
function toggleDaySel(i,ds){
  const btn=document.getElementById('dsbtn_'+i);
  const idx=_clearDaysSel.indexOf(ds);
  if(idx===-1){_clearDaysSel.push(ds);btn.classList.add('sel');}
  else{_clearDaysSel.splice(idx,1);btn.classList.remove('sel');}
}
function toggleAllDays(){
  const btns=document.querySelectorAll('.day-sel-btn');
  if(_clearDaysSel.length===7){_clearDaysSel=[];btns.forEach(b=>b.classList.remove('sel'));}
  else{
    _clearDaysSel=[];
    btns.forEach((b,i)=>{_clearDaysSel.push(b.dataset.ds);b.classList.add('sel');});
  }
}
async function confirmClearDays(){
  if(!_clearDaysSel.length)return showToast('Önce gün seçin');
  if(!await customConfirm(`${_clearDaysSel.length} günün görevleri silinsin mi?`))return;
  showLoading(true, 'Siliniyor...');
  for(const ds of _clearDaysSel){
    await db.from('tasks').delete().eq('student_id',S.activeStuId).eq('date',ds);
    delete S.tasks[`${S.activeStuId}_${ds}`];
  }
  showLoading(false);
  saveUI();cm('clearWeekModal');renderProgram();showToast(`${_clearDaysSel.length} gün temizlendi ✓`);
}

// ── KONU LİSTESİ ────────────────────────────────
const KONU_LISTESI = {
  'Dil Bilgisi': [
    'Sözcükte Anlam','Cümlede Anlam','Ses Bilgisi','Yazım Kuralları',
    'Noktalama İşaretleri','Sözcükte Yapı','İsim','Sıfat','Zamir','Zarf',
    'İsim-Sıfat Tamlamaları','Edat-Bağlaç-Ünlem',
    'Fiiller – Fiil Çekimleri – Fiillerde Zaman Kayması','Ek Fiil – Ek Eylem',
    'Fiilde Çatı','Fiilimsiler','Cümlenin Öğeleri','Cümle Türleri','Anlatım Bozuklukları'
  ],
  'TYT Matematik': [
    'Sayılar ve Basamak','Bölünebilme','EBOB-EKOK','Kesirler ve Ondalıklı Sayılar',
    'Mutlak Değer','Üslü Sayılar','Köklü Sayılar','Oran-Orantı',
    'Problemler – Yaş-İşçi-Havuz','Problemler – Kar-Zarar-Yüzde',
    'Problemler – Hareket','Problemler – Karışım',
    'Birinci Dereceden Denklemler','Kümeler','Mantık','Fonksiyonlar',
    'Polinomlar','İkinci Dereceden Denklemler',
    'Permütasyon-Kombinasyon','Olasılık','İstatistik ve Veri'
  ],
  'AYT Matematik': [
    'Polinomlar','Karmaşık Sayılar','Logaritma',
    'Trigonometri','Diziler','Limit ve Süreklilik',
    'Türev','İntegral','Matrisler ve Determinant'
  ],
  'Geometri': [
    'Doğruda Açı','Üçgende Açı ve Kenar','Üçgende Alan','Üçgende Benzerlik',
    'Özel Üçgenler (Pisagor)','Dörtgenler','Dörtgende Alan',
    'Çember ve Daire','Çemberde Açı','Analitik Geometri – Nokta ve Doğru',
    'Analitik Geometri – Çember','Katı Cisimler','Uzay Geometrisi'
  ],
  'TYT Fizik': [
    'Fizik Bilimine Giriş','Madde ve Özellikleri','Basınç','Kaldırma Kuvveti',
    'Isı Sıcaklık Genleşme','Hareket','Newton Hareket Yasaları',
    'İş Güç Enerji','Elektrik','Manyetizma','Optik','Dalgalar'
  ],
  'AYT Fizik': [
    'Vektörler','Bağıl ve Bileşik Hareket','Newton\'ın Hareket Yasaları',
    'Sabit İvmeli Hareket','Tek Boyutta Atışlar','İki Boyutta Atışlar',
    'Enerji','İtme ve Momentum','Tork ve Denge','Kütle ve Ağırlık Merkezi',
    'Basit Makineler','Elektriksel Kuvvet ve Elektrik Alan',
    'Elektriksel Potansiyel Enerji','Düzgün Elektrik Alan ve Sığa',
    'Manyetik Alan','Manyetik Kuvvet','Manyetik İndüksiyon',
    'Alternatif Akım ve Transformatörler','Düzgün Çembersel Hareket',
    'Eylemsizlik Momenti ve Açısal Momentum','Genel Çekim Yasası ve Kepler',
    'Basit Harmonik Hareket','Dalga Mekaniği','Elektromanyetik Dalgalar',
    'Atom Modelleri ve Atomun Yapısı','Büyük Patlama ve Atom Altı Parçacıklar',
    'Radyoaktivite','Özel Görelilik Teorisi','Modern Fizik'
  ],
  'TYT Kimya': [
    'Kimyanın Sembolik Dili','Atom Modelleri','Periyodik Cetvel','Etkileşimler',
    'Maddenin Halleri','Kimyanın Temel Kanunları','Mol Kavramı',
    'Kimyasal Hesaplamalar','Kimyasal Tepkime Türleri','Karışımlar',
    'Asitler ve Bazlar','Tuzlar','Doğa ve Kimya','Kimya Her Yerde'
  ],
  'AYT Kimya': [
    'Modern Atom','Gazlar','Sıvı Çözeltiler ve Çözünürlük',
    'Tepkimelerde Hız','Tepkimelerde Denge','Sulu Çözelti Dengeleri',
    'Kimya ve Elektrik','Karbon Kimyası','Organik Bileşikler','Enerji Kaynakları'
  ],
  'TYT Biyoloji': [
    'Canlıların Temel Bileşenleri','İnorganik Bileşikler','Karbohidratlar',
    'Lipitler (Yağlar)','Proteinler','Hormonlar','Vitaminler','Enzimler',
    'Nükleik Asitler','DNA-RNA','ATP Metabolizma','Hücre Organelleri',
    'Hücre Zarı Madde Geçişleri','Ekoloji','Güncel Çevre Sorunları',
    'Canlıların Sınıflandırılması','Hücre Bölünmeleri','Mitoz','Mayoz','Kalıtım'
  ],
  'AYT Biyoloji': [
    'Sinir Sistemi','Endokrin Sistemi','Duyu Organları','Destek Hareket Sistemi',
    'Dolaşım Sistemi','Bağışıklık Sistemi','Solunum Sistemi','Üriner Sistemi',
    'Üreme Sistemi','Komünite Ekolojisi','Popülasyon Ekolojisi',
    'Genden Proteine','Enerji Dönüşümleri','Bitki Biyolojisi','Canlı ve Çevre'
  ],
  'AYT Edebiyat': [
    'Güzel Sanatlar ve Edebiyat', 'Coşku ve Heyecanı Dile Getiren Metinler (Şiir)', 'Olay Çevresinde Oluşan Edebi Metinler', 'Destan Dönemi Türk Edebiyatı', 'İslamiyet Kabulü İlk Edebi Ürünler', 'Divan Edebiyatı', 'Halk Edebiyatı', 'Tanzimat Edebiyatı', 'Servet-i Fünun Edebiyatı', 'Fecr-i Ati Edebiyatı', 'Milli Edebiyat', 'Cumhuriyet Dönemi Türk Edebiyatı', 'Edebi Akımlar'
  ],
  'Tarih (TYT-AYT)': [
    'Tarih ve Zaman', 'İnsanlığın İlk Dönemleri', 'Orta Çağ\'da Dünya', 'İlk ve Orta Çağlarda Türk Dünyası', 'İslam Medeniyetinin Doğuşu', 'İlk Türk-İslam Devletleri', 'Beylikten Devlete Osmanlı', 'Dünya Gücü Osmanlı', 'Osmanlı Kültür ve Medeniyeti', 'En Uzun Yüzyıl (Osmanlı)', 'XX. Yüzyıl Başlarında Osmanlı', 'I. Dünya Savaşı', 'Milli Mücadele Hazırlık Dönemi', 'Kurtuluş Savaşı ve Antlaşmalar', 'Atatürk İlke ve İnkılapları', 'Atatürk Dönemi Türk Dış Politikası'
  ],
  'Coğrafya (TYT-AYT)': [
    'Doğa ve İnsan', 'Dünya\'nın Şekli ve Hareketleri', 'Coğrafi Konum', 'Harita Bilgisi', 'Atmosfer ve İklim', 'Dünya\'nın Tektonik Yapısı', 'İç ve Dış Kuvvetler', 'Nüfus ve Yerleşme', 'Ekonomik Faaliyetler', 'Bölgeler ve Ülkeler', 'Çevre ve Toplum', 'Ekosistem ve Madde Dönüşü', 'Türkiye\'de Nüfus ve Yerleşme', 'Türkiye\'nin Coğrafi Konumu ve Bölgeleri', 'Küresel Ortam: Bölgeler ve Ülkeler'
  ],
  'Felsefe Grubu & Din': [
    'Felsefeyi Tanıma', 'Bilgi Felsefesi', 'Varlık Felsefesi', 'Ahlak Felsefesi', 'Sanat Felsefesi', 'Din Felsefesi', 'Siyaset Felsefesi', 'Bilim Felsefesi', 'Psikolojiye Giriş', 'Sosyolojiye Giriş', 'Klasik Mantık', 'Kur\'an-ı Kerim ve Anlamı', 'İnanç ve İbadet', 'Ahlak ve Değerler', 'Hz. Muhammed ve Gençlik', 'İslam Medeniyeti ve Bilim'
  ],
  'YDT İngilizce': [
    'Grammar (Dil Bilgisi)', 'Vocabulary (Kelime Bilgisi)', 'Reading Comprehension (Okuduğunu Anlama)', 'Sentence Completion (Cümle Tamamlama)', 'Dialogue Completion (Diyalog Tamamlama)', 'Translation (Çeviri)', 'Restatement (Eş Anlamlı Cümle)', 'Paragraph Completion (Paragraf Tamamlama)', 'Irrelevant Sentence (Anlamı Bozan Cümle)'
  ]
};

// Görev konusuyla eşleşen konu listesini bul
function _getKonular(examType, subject) {
  const fullKey = `${examType||''} ${subject||''}`.trim();
  return KONU_LISTESI[fullKey] || KONU_LISTESI[subject||''] || null;
}

let _wrongTopics = []; // Aktif modalda seçili yanlış konular

function toggleKonuChip(el, konu) {
  const idx = _wrongTopics.indexOf(konu);
  if (idx === -1) {
    _wrongTopics.push(konu);
    el.style.borderColor = 'var(--red)';
    el.style.background = 'rgba(255,92,122,.12)';
    el.style.color = 'var(--red)';
  } else {
    _wrongTopics.splice(idx, 1);
    el.style.borderColor = 'var(--border)';
    el.style.background = 'var(--surface)';
    el.style.color = 'var(--text-mid)';
  }
}
window.toggleKonuChip = toggleKonuChip;

// ── YENİ KAYNAK TOGGLE ──────────────────────────
let _manualTests = [];

function toggleNewResourceMode() {
  const on = document.getElementById('tmNewResourceToggle').checked;
  _applyNewResourceToggle(on);
}

function _applyNewResourceToggle(on) {
  document.getElementById('tmSearchSection').style.display = on ? 'none' : '';
  document.getElementById('tmManualSection').style.display = on ? '' : 'none';
  document.getElementById('tmTestWrap').style.display = 'none';
  // Toggle slider rengi
  const slider = document.getElementById('tmToggleSlider');
  if (slider) {
    slider.style.background = on ? 'var(--accent)' : 'var(--border)';
    slider.style.setProperty('--tw-after-x', on ? '16px' : '0px');
  }
}

function addManualTest() {
  const inp = document.getElementById('tmManualTestInput');
  const val = inp.value.trim();
  if (!val) return;
  _manualTests.push(val);
  inp.value = '';
  _renderManualTestChips();
}

function removeManualTest(i) {
  _manualTests.splice(i, 1);
  _renderManualTestChips();
}

function _renderManualTestChips() {
  const wrap = document.getElementById('tmManualTestChips');
  if (!wrap) return;
  wrap.innerHTML = _manualTests.map((t, i) => `
    <span style="display:inline-flex;align-items:center;gap:5px;background:var(--accent-dim);border:1px solid rgba(240,165,0,.3);color:var(--accent);padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600">
      ${esc(t)}
      <button onclick="removeManualTest(${i})" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:14px;padding:0;line-height:1">×</button>
    </span>`).join('');
}

function openTaskModal(ds, dayName){
  if(!S.activeStuId)return showToast('Önce öğrenci seçin');
  _taskDate=ds;
  _editingTaskId=null; // Reset edit mode
  _selectedBook=null;
  document.querySelector('#taskModal h2').innerHTML = `Görev Ekle — <span id="tmDay">${dayName}</span>`;
  document.querySelector('#taskModal .btn-accent').textContent = 'Programa Ekle';
  document.getElementById('tmSubjectFree').value='';
  document.getElementById('tmDuration').value='60';
  document.getElementById('tmStartTime').value='';
  document.getElementById('tmNote').value='';
  document.getElementById('tmExam').value='';
  document.getElementById('tmType').value='deneme';
  document.getElementById('tmSubjectSel').style.display='none';
  document.getElementById('tmSubjectFree').style.display='';
  document.getElementById('soruBankasiWrap').style.display='none';
  document.getElementById('tmBookSearch').value='';
  document.getElementById('tmBookVal').value='';
  document.getElementById('tmBookList').style.display='none';
  document.getElementById('tmTestWrap').style.display='none';
  const sumEl=document.getElementById('tmTestSummary');
  if(sumEl) sumEl.style.display='none';
  // Reset manuel kaynak modu
  const tog = document.getElementById('tmNewResourceToggle');
  if (tog) { tog.checked = false; _applyNewResourceToggle(false); }
  document.getElementById('tmManualKaynak').value='';
  document.getElementById('tmManualTestInput').value='';
  document.getElementById('tmManualTestChips').innerHTML='';
  _manualTests = [];
  loadStudentSpeeds();
  om('taskModal');
}
// ═══════════════════════════════════════════════
// SORU BANKASI — Supabase'den dinamik
// ═══════════════════════════════════════════════

// Cache: { 'TYT_Matematik': [{name, year, tests:[]}] }
let _resourcesCache = {};
let _resourcesLoaded = false;

async function loadResources() {
  if(_resourcesLoaded) return;
  const {data} = await db.from('resources').select('*').eq('active', true).order('name');
  if(data) {
    data.forEach(r => {
      let subjects = [r.subject];
      if (r.subject === 'Tarih') {
        subjects.push('Tarih1', 'Tarih2');
      } else if (r.subject === 'Coğrafya') {
        subjects.push('Coğrafya1', 'Coğrafya2');
      } else if (r.subject === 'Din Kültürü' || r.subject === 'Din') {
        subjects = ['Din', 'Din Kültürü'];
      }
      
      subjects.forEach(sub => {
        const key = `${r.exam_type}_${sub}`;
        if(!_resourcesCache[key]) _resourcesCache[key] = [];
        _resourcesCache[key].push({
          name: r.name,
          yil: r.year,
          testler: Array.isArray(r.tests) ? r.tests : [],
          publisher: r.publisher
        });
      });
    });
    _resourcesLoaded = true;
  }
}

let _filteredBooks = [];
let _selectedBook = null;

function updateSubjectList(){
  const exam=document.getElementById('tmExam').value;
  const type=document.getElementById('tmType').value;
  const sel=document.getElementById('tmSubjectSel');
  const free=document.getElementById('tmSubjectFree');
  _selectedBook=null;
  document.getElementById('tmBookVal').value='';
  document.getElementById('tmBookSearch').value='';
  document.getElementById('tmBookList').innerHTML='';
  document.getElementById('tmBookList').style.display='none';
  document.getElementById('tmTestWrap').style.display='none';
  const sumEl=document.getElementById('tmTestSummary');
  if(sumEl) sumEl.style.display='none';

  if(exam && SUBJECT_MAP[exam]){
    sel.innerHTML=SUBJECT_MAP[exam].map(s=>`<option value="${s}">${s}</option>`).join('');
    sel.style.display='';free.style.display='none';
  } else {
    sel.style.display='none';free.style.display='';
  }

  const showPanel = (type==='soru'||type==='konu') && exam;
  document.getElementById('soruBankasiWrap').style.display=showPanel?'':'none';
  const searchEl=document.getElementById('tmBookSearch');
  if(searchEl) searchEl.placeholder = type==='konu'?'Hoca veya playlist ara...':'Kitap veya yayınevi ara...';
  // reset cache so type change reloads
  _resourcesLoaded=false; _resourcesCache={};
  if(showPanel) renderBookList('');
}

function updateBookList(){
  _selectedBook=null;
  document.getElementById('tmBookVal').value='';
  document.getElementById('tmBookSearch').value='';
  document.getElementById('tmBookList').style.display='none';
  document.getElementById('tmTestWrap').style.display='none';
  const type=document.getElementById('tmType').value;
  const exam=document.getElementById('tmExam').value;
  _resourcesLoaded=false; _resourcesCache={};
  if((type==='soru'||type==='konu')&&exam) renderBookList('');
}

document.getElementById('tmType').addEventListener('change', updateSubjectList);

async function renderBookList(query){
  const exam=document.getElementById('tmExam').value;
  const subject=document.getElementById('tmSubjectSel').value||'';
  const type=document.getElementById('tmType').value;
  const listEl=document.getElementById('tmBookList');
  const wantedType = type==='konu' ? 'playlist' : 'book';

  if(!_resourcesLoaded){
    listEl.style.display='block';
    listEl.innerHTML=`<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">⏳ Yükleniyor...</div>`;
    // Her seferinde temiz çek
    const {data}=await db.from('resources').select('*').eq('active',true).eq('resource_type',wantedType).order('name');
    _resourcesCache={};
    if(data){
      data.forEach(r=>{
        let subjects = [r.subject];
        if (r.subject === 'Tarih') {
          subjects.push('Tarih1', 'Tarih2');
        } else if (r.subject === 'Coğrafya') {
          subjects.push('Coğrafya1', 'Coğrafya2');
        } else if (r.subject === 'Din Kültürü' || r.subject === 'Din') {
          subjects = ['Din', 'Din Kültürü'];
        }
        
        subjects.forEach(sub => {
          const key=`${r.exam_type}_${sub}`;
          if(!_resourcesCache[key]) _resourcesCache[key]=[];
          _resourcesCache[key].push({name:r.name,yil:r.year,testler:Array.isArray(r.tests)?r.tests:[],publisher:r.publisher,resource_type:r.resource_type||'book'});
        });
      });
    }
    _resourcesLoaded=true;
  }

  const key=`${exam}_${subject}`;
  const books=_resourcesCache[key]||[];
  const q=query.toLowerCase();
  _filteredBooks=books.filter(b=>!q||b.name.toLowerCase().includes(q)||b.publisher?.toLowerCase().includes(q));

  if(!query && !_filteredBooks.length){
    listEl.style.display='none'; return;
  }
  if(!_filteredBooks.length){
    listEl.style.display='block';
    listEl.innerHTML=`<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">Kaynak bulunamadı</div>`;
    return;
  }
  listEl.style.display='block';
  listEl.innerHTML=_filteredBooks.map((b,i)=>`
    <div onclick="selectBook(${i})" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;transition:background .15s"
      onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
      <div>
        <div style="font-size:13px;font-weight:700">${esc(b.name)}</div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px">${esc(b.publisher||'')} · ${b.testler.length} test</div>
      </div>
      <span style="font-size:10px;font-weight:700;background:var(--green-dim);color:var(--green);padding:2px 7px;border-radius:99px;margin-left:8px;flex-shrink:0">${b.yil}</span>
    </div>`).join('');
}

function filterBooks(){
  const q=document.getElementById('tmBookSearch').value;
  if(q.length===0){ document.getElementById('tmBookList').style.display='none'; return; }
  renderBookList(q);
}

function selectBook(idx){
  _selectedBook=_filteredBooks[idx];
  document.getElementById('tmBookVal').value=_selectedBook.name;
  document.getElementById('tmBookSearch').value=_selectedBook.name;
  document.getElementById('tmBookList').style.display='none';
  renderTestList();
  document.getElementById('tmTestWrap').style.display='';
}

// Çoklu test/video seçim listesi
function renderTestList(){
  if(!_selectedBook) return;
  const el=document.getElementById('tmTestList');
  const isPlaylist = _selectedBook.resource_type==='playlist';

  const bookName = _selectedBook.name||'';
  el.innerHTML=_selectedBook.testler.map((t,i)=>{
    const rawLabel=t.label||t;
    // Eğer video adı playlist adıyla aynıysa (API yokken kaydedilmiş), "Ders N" göster
    const label = (rawLabel.trim()==='' || rawLabel.trim()===bookName.trim()) ? `Ders ${i+1}` : rawLabel;
    const soru=t.soru||0; // kitap=soru sayısı, playlist=dakika
    const url=t.url||'';
    const topic=t.topic||'';

    // Status visual indicators
    const status = getTestStatus(rawLabel);
    const statusClass = status === 'done' ? 'ti-status-done' : (status === 'pending' ? 'ti-status-pending' : '');
    const statusBadge = status === 'done' ? `<span class="ti-badge ti-badge-done">✓ Tamamlandı</span>` : (status === 'pending' ? `<span class="ti-badge ti-badge-pending">⏳ Atandı</span>` : '');

    if(isPlaylist){
      // Video satırı — checkbox + numara + başlık + link + süre
      return `<label class="${statusClass}" style="display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;transition:background .1s;border-bottom:1px solid var(--border)"
        onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
        <input type="checkbox" id="test_${i}" value="${i}" onchange="updateTestSummary()"
          style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
        <div style="width:22px;height:22px;border-radius:6px;background:var(--surface3);color:var(--text-mid);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(label)}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
            <span style="font-size:10px;color:var(--text-dim)">${soru>0?`⏱ ${soru} dk`:'⏱ ?'}</span>
            ${statusBadge}
          </div>
        </div>
        ${url?`<a href="${esc(url)}" target="_blank" onclick="event.stopPropagation()"
          style="display:flex;align-items:center;gap:3px;font-size:11px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:5px 10px;border-radius:7px;text-decoration:none;flex-shrink:0;white-space:nowrap"
          onmouseover="this.style.background='#cc000044'" onmouseout="this.style.background='#cc000022'">▶ İzle</a>`
          :`<span style="font-size:10px;color:var(--text-dim);flex-shrink:0;padding:5px 8px;border:1px solid var(--border);border-radius:7px">Linksiz</span>`}
      </label>`;
    } else {
      // Soru bankası satırı
      return `<label class="${statusClass}" style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;transition:background .1s"
        onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
        <input type="checkbox" id="test_${i}" value="${i}" onchange="updateTestSummary()"
          style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
        <div style="flex:1;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:600">${esc(label)}</span>
          ${statusBadge}
        </div>
        ${soru>0?`<span style="font-size:10px;color:var(--text-dim);background:var(--surface3);padding:2px 7px;border-radius:99px;flex-shrink:0">${soru} soru</span>`:''}
      </label>`;
    }
  }).join('');
  updateTestSummary();
}

function selectAllTests(){
  document.querySelectorAll('#tmTestList input[type=checkbox]').forEach(cb=>cb.checked=true);
  updateTestSummary();
}
function clearAllTests(){
  document.querySelectorAll('#tmTestList input[type=checkbox]').forEach(cb=>cb.checked=false);
  updateTestSummary();
}

function updateTestSummary(){
  if(!_selectedBook) return;
  const checked=[...document.querySelectorAll('#tmTestList input[type=checkbox]:checked')];
  const summaryEl=document.getElementById('tmTestSummary');
  const summaryText=document.getElementById('tmTestSummaryText');
  const suggestEl=document.getElementById('tmSuggestedDuration');
  const speedRow=document.getElementById('tmSpeedRow');
  const isPlaylist=_selectedBook.resource_type==='playlist';

  if(checked.length===0){summaryEl.style.display='none';return;}

  let totalSoru=0, totalDakika=0;
  checked.forEach(cb=>{
    const idx=parseInt(cb.value);
    const t=_selectedBook.testler[idx];
    if(isPlaylist) totalDakika+=(t?.soru||0);
    else totalSoru+=(t?.soru||0);
  });

  // Hız çarpanı
  const speedBtn = document.querySelector('[data-mspeed].speed-active');
  const speedMult = speedBtn ? parseFloat(speedBtn.dataset.mspeed) : 1;

  let suggestedMin=0;
  if(isPlaylist){
    suggestedMin=totalDakika>0?Math.ceil(totalDakika/speedMult):0;
    summaryText.textContent=`${checked.length} video · ${totalDakika} dk`;
    if(speedRow) speedRow.style.display='';
  } else {
    const exam=document.getElementById('tmExam').value;
    const subject=document.getElementById('tmSubjectSel').value||'';
    const speedKey=`${S.activeStuId}_${exam}_${subject}`;
    const secsPerQ=_studentSpeeds[speedKey]||180;
    suggestedMin=totalSoru>0?Math.ceil((totalSoru*secsPerQ)/60):0;
    summaryText.textContent=`${checked.length} test · ${totalSoru} soru${suggestedMin>0?' · Önerilen: '+suggestedMin+' dk':''}`;
    if(speedRow) speedRow.style.display='none';
  }

  suggestEl.style.display=suggestedMin>0?'':'none';
  _suggestedDuration=suggestedMin;
  suggestEl.setAttribute('data-dur',suggestedMin);
  summaryEl.style.display='';
  if(suggestedMin>0) document.getElementById('tmDuration').value=suggestedMin;
}

function selectModalSpeed(speed){
  // Butonları güncelle
  document.querySelectorAll('[data-mspeed]').forEach(b=>{
    const isActive = b.dataset.mspeed===speed;
    b.classList.toggle('speed-active', isActive);
    b.style.borderColor = isActive?'var(--accent)':'var(--border)';
    b.style.background = isActive?'var(--accent-dim)':'var(--surface2)';
    b.style.color = isActive?'var(--accent)':'var(--text-mid)';
  });
  // Süreyi yeniden hesapla
  updateTestSummary();
}

let _suggestedDuration = 0;

function applyDuration(){
  if(_suggestedDuration>0){
    document.getElementById('tmDuration').value=_suggestedDuration;
    showToast('Süre uygulandı: '+_suggestedDuration+' dk');
  }
}

// Öğrenci hız cache
let _studentSpeeds={};
async function loadStudentSpeeds(){
  if(!S.activeStuId) return;
  const {data}=await db.from('student_speeds').select('*').eq('student_id',S.activeStuId);
  _studentSpeeds={};
  (data||[]).forEach(s=>{
    const key=`${s.student_id}_${s.exam_type}_${s.subject}`;
    _studentSpeeds[key]=s.secs_per_question;
  });
}

// Öğrenci hız yönetimi — öğrenci modalına eklenecek
async function saveStudentSpeed(stuId, examType, subject, secsPerQ){
  const {data:existing}=await db.from('student_speeds').select('id').eq('student_id',stuId).eq('exam_type',examType).eq('subject',subject).single();
  if(existing){
    await db.from('student_speeds').update({secs_per_question:secsPerQ,updated_at:new Date().toISOString()}).eq('id',existing.id);
  } else {
    await db.from('student_speeds').insert({student_id:stuId,coach_id:session.coachId,exam_type:examType,subject,secs_per_question:secsPerQ});
  }
  // Cache güncelle
  _studentSpeeds[`${stuId}_${examType}_${subject}`]=secsPerQ;
  showToast('Hız kaydedildi ✓');
}

// Ders değişince kitap listesi sıfırla — BUG FIX
document.getElementById('tmType').addEventListener('change', updateSubjectList);

let _savingTask = false;
async function saveTask(){
  if (_savingTask) return;
  _savingTask = true;
  const saveBtn = document.querySelector('#taskModal button[onclick*="saveTask"]');
  const oldText = saveBtn ? saveBtn.textContent : 'Programa Ekle';
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Kaydediliyor...';
  }

  try {
    const type=document.getElementById('tmType').value;
    const sel=document.getElementById('tmSubjectSel');
    const free=document.getElementById('tmSubjectFree');
    const examType=document.getElementById('tmExam').value;
    const duration=parseInt(document.getElementById('tmDuration').value)||60;
    const startTime=document.getElementById('tmStartTime').value || null;
    const baseNote=document.getElementById('tmNote').value.trim();

    // ── Manuel kaynak modu ──
    const isManualMode = document.getElementById('tmNewResourceToggle')?.checked;
    if (isManualMode) {
      const kaynak = document.getElementById('tmManualKaynak').value.trim();
      if (!kaynak) return showToast('Kaynak adı girin!');
      const subjectBase = sel.style.display !== 'none' ? sel.value : free.value.trim();
      const subject = subjectBase ? `${subjectBase} - ${kaynak}` : kaynak;
      const fullList = _manualTests.map(label => ({ label, url: '', soru: 0 }));
      let note = baseNote;
      if (_manualTests.length > 0) {
        note = `${_manualTests.length} test: ${_manualTests.slice(0,3).join(', ')}${_manualTests.length>3?` +${_manualTests.length-3} daha`:''}`;
      }
      const payload = {
        student_id:S.activeStuId, coach_id:session.coachId, date:_taskDate,
        type, exam_type:examType, subject, duration, note, done:false,
        task_items: fullList.length > 0 ? fullList : null,
        start_time: startTime
      };
      showLoading(true);
      const { error } = await db.from('tasks').insert(payload);
      showLoading(false);
      if (error) return showToast('Hata: '+error.message);
      const key=`${S.activeStuId}_${_taskDate}`;
      if(!S.tasks[key]) S.tasks[key]=[];
      S.tasks[key].push({type,exam:examType,subject,duration,note,done:false,task_items:payload.task_items,start_time:startTime});
      cm('taskModal'); renderProgram(); showToast('Görev eklendi ✓');
      return;
    }

    // ── Normal mod (veritabanı arama) ──
    const bookVal=document.getElementById('tmBookVal').value;
    const isPlaylist=_selectedBook?.resource_type==='playlist';

    let subject='';
    if((type==='soru'||type==='konu') && bookVal){
      const dersSel=sel.style.display!=='none'?sel.value:'';
      subject=dersSel?`${dersSel} - ${bookVal}`:`${bookVal}`;
    } else {
      subject=(sel.style.display!=='none'?sel.value:free.value).trim();
    }
    if(!subject)return showToast('Ders adı girin!');

    const checkedBoxes=[...document.querySelectorAll('#tmTestList input[type=checkbox]:checked')];

    // Not: seçili testlerin/videoların tam listesi
    let note = baseNote;
    let fullList = []; // detay modal için tam liste
    if(checkedBoxes.length>0 && _selectedBook){
      const labels = checkedBoxes.map(cb=>{
        const t=_selectedBook.testler[parseInt(cb.value)];
        return t?.label||t||'';
      });
      fullList = checkedBoxes.map(cb=>{
        const t=_selectedBook.testler[parseInt(cb.value)];
        return {label:t?.label||t||'', url:t?.url||'', soru:t?.soru||0};
      });
      if(isPlaylist){
        const _vShort = l => l.length > 14 ? l.slice(0,13)+'…' : l;
        note=`${labels.length} video: ${labels.slice(0,5).map(_vShort).join(', ')}${labels.length>5?` +${labels.length-5}`:''}`;
      } else {
        const _tShort = l => l.length > 14 ? l.slice(0,13)+'…' : l;
        note=`${labels.length} test: ${labels.slice(0,5).map(_tShort).join(', ')}${labels.length>5?` +${labels.length-5}`:''}`;
      }
    }

    const payload={
      student_id:S.activeStuId, coach_id:session.coachId, date:_taskDate,
      type, exam_type:examType, subject, duration, note, done:false,
      task_items: fullList.length > 0 ? fullList : null,
      start_time: startTime
    };

    if (_editingTaskId) {
      showLoading(true);
      const { error } = await db.from('tasks').update({
        type: payload.type,
        exam_type: payload.exam_type,
        subject: payload.subject,
        duration: payload.duration,
        note: payload.note,
        task_items: payload.task_items,
        start_time: payload.start_time
      }).eq('id', _editingTaskId);
      showLoading(false);
      
      if(error) return showToast('Hata: '+error.message);

      const key=`${S.activeStuId}_${_taskDate}`;
      if(S.tasks[key]) {
        const idx = S.tasks[key].findIndex(t => t._id === _editingTaskId);
        if (idx !== -1) {
          S.tasks[key][idx] = {
            _id: _editingTaskId,
            type: payload.type,
            exam: payload.exam_type,
            subject: payload.subject,
            duration: payload.duration,
            note: payload.note,
            done: S.tasks[key][idx].done,
            student_note: S.tasks[key][idx].student_note || '',
            task_items: payload.task_items,
            start_time: payload.start_time
          };
        }
      }
      cm('taskModal');
      renderProgram();
      showToast('Görev güncellendi ✓');
      _editingTaskId = null;
    } else {
      const {data,error}=await db.from('tasks').insert(payload).select().single();
      if(error)return showToast('Hata: '+error.message);

      const key=`${S.activeStuId}_${_taskDate}`;
      if(!S.tasks[key])S.tasks[key]=[];
      S.tasks[key].push({
        _id:data.id,
        type:data.type,
        exam:data.exam_type,
        subject:data.subject,
        duration:data.duration,
        note:data.note,
        done:false,
        student_note: '',
        task_items: data.task_items || null,
        start_time: data.start_time
      });

      cm('taskModal');
      renderProgram();
      showToast('Görev eklendi ✓');
    }
  } finally {
    _savingTask = false;
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = oldText;
    }
  }
}
async function toggleTask(ds,idx){
  const key=`${S.activeStuId}_${ds}`;
  const t=S.tasks[key]?.[idx]; if(!t)return;
  const newDone=!t.done;
  await db.from('tasks').update({done:newDone}).eq('id',t._id);
  t.done=newDone; renderProgram();
}
// ── GÖREV 3-NOKTA MENÜSÜ ───────────────────────
let _tcDropdown = null;
function closeTaskMenu(){ if(_tcDropdown){ _tcDropdown.remove(); _tcDropdown=null; } }
document.addEventListener('click', closeTaskMenu);

function showTaskMenu(ds, idx, btn){
  closeTaskMenu();
  const rect = btn.getBoundingClientRect();
  const drop = document.createElement('div');
  drop.className = 'tc-dropdown';
  drop.innerHTML = `
    <button onclick="closeTaskMenu();openCoachTaskEdit('${ds}',${idx})">✏️ Düzenle</button>
    <button onclick="closeTaskMenu();copyTaskToClipboard('${ds}',${idx})">📋 Kopyala</button>
    <button onclick="closeTaskMenu();copyTaskToWholeWeek('${ds}',${idx})">📅 Tüm Haftaya Kopyala</button>
    <button class="danger" onclick="closeTaskMenu();deleteTask('${ds}',${idx})">🗑 Kaldır</button>`;
  // Ekran sınırını kontrol et
  const top = rect.bottom + 4;
  const left = Math.min(rect.left, window.innerWidth - 155);
  drop.style.cssText = `top:${top}px;left:${left}px;`;
  document.body.appendChild(drop);
  _tcDropdown = drop;
  // Propagation'ı durdur ki document click kapatamasın
  setTimeout(()=>drop.addEventListener('click', e=>e.stopPropagation()), 0);
}

async function copyTask(ds, idx){
  const key = `${S.activeStuId}_${ds}`;
  const t = S.tasks[key]?.[idx];
  if(!t) return;
  const {data,error} = await db.from('tasks').insert({
    student_id: S.activeStuId,
    coach_id: session.coachId,
    date: ds,
    type: t.type,
    exam_type: t.exam||null,
    subject: t.subject,
    duration: t.duration,
    note: t.note||null,
    done: false,
    task_items: t.task_items||null
  }).select().single();
  if(error) return showToast('Kopyalama başarısız');
  if(!S.tasks[key]) S.tasks[key]=[];
  S.tasks[key].push({ _id:data.id, type:data.type, exam:data.exam_type, subject:data.subject, duration:data.duration, note:data.note, done:false, student_note:'', task_items:data.task_items||null });
  renderProgram();
  showToast('Görev kopyalandı');
}

async function deleteTask(ds,idx){
  const key=`${S.activeStuId}_${ds}`;
  const t=S.tasks[key]?.[idx]; if(!t)return;
  const label = [t.exam, t.subject].filter(Boolean).join(' · ') || t.type || 'Görev';
  
  // Row fade animation
  const rowEl = document.querySelector(`[data-task-id="${t._id}"]`);
  if (rowEl) {
    rowEl.style.transition = 'all 0.3s ease';
    rowEl.style.opacity = '0';
    rowEl.style.transform = 'translateX(30px)';
    const bodyEl = rowEl.querySelector('.tc-body');
    if (bodyEl) {
      bodyEl.innerHTML = '<div style="color:var(--red); font-weight:700; font-size:12px; display:flex; align-items:center; gap:6px">🗑️ Siliniyor...</div>';
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  await db.from('tasks').delete().eq('id',t._id);
  S.tasks[key].splice(idx,1);
  renderProgram();
  showToast(`"${label}" silindi`);
}

// ═══════════════════════════════════════════════
// COACH TODO LIST (dün / bugün / yarın)
// ═══════════════════════════════════════════════
let _ctdDate='';
let _agendaWeekOffset = 0;
let _agendaFilter = { studentId:'', type:'' };
window._draggingApptId = null;
let _draggingApptId = null;

const APPT_TYPE_COLORS = {
  'Haftalık Değerlendirme':'#E8613A',
  'TYT Koçluğu':'#3B82F6',
  'AYT Koçluğu':'#8B5CF6',
  'Mentörlük':'#10B981',
  'Deneme Analizi':'#F59E0B',
  'Motivasyon':'#EC4899',
  'Genel Görüşme':'#64748B',
};
const TL_START = 0, TL_END = 24, PX_H = 60;

function apptTypeColor(type){ return APPT_TYPE_COLORS[type]||'#64748B'; }

function gcalUrlFor(a){
  const stu = S.students.find(s=>s.id===a.studentId);
  const start = new Date(a.date+'T'+(a.time||'09:00'));
  const end = new Date(start.getTime()+(a.duration||45)*60000);
  const fmt = d=>d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((stu?.name||'Öğrenci')+' – Koçluk')}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(a.type||'')}`;
}

function agendaPrev(){ _agendaWeekOffset--; renderAgenda(); }
function agendaNext(){ _agendaWeekOffset++; renderAgenda(); }
function agendaToday(){ _agendaWeekOffset=0; renderAgenda(); }
function agendaSetFilter(k,v){ _agendaFilter[k]=v; renderAgenda(); }

function exportAgendaICS(){
  let appts = S.appointments;
  if(_agendaFilter.studentId) appts = appts.filter(a=>a.studentId===_agendaFilter.studentId);
  if(_agendaFilter.type) appts = appts.filter(a=>a.type===_agendaFilter.type);
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Rostrum Akademi//TR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Rostrum Ajanda'];
  appts.forEach(a=>{
    const stu=S.students.find(s=>s.id===a.studentId);
    const start=new Date(a.date+'T'+(a.time||'09:00'));
    const end=new Date(start.getTime()+(a.duration||45)*60000);
    const fmt=d=>d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';
    lines.push('BEGIN:VEVENT',`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${(stu?.name||'Öğrenci')} – ${a.type||'Koçluk'}`);
    if(a.note) lines.push(`DESCRIPTION:${a.note.replace(/\n/g,'\\n')}`);
    if(a.meetLink||a.meet_link) lines.push(`URL:${a.meetLink||a.meet_link}`);
    lines.push(`UID:rostrum-${a.id}@rostrumakademi.com`,'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const lnk=document.createElement('a'); lnk.href=url; lnk.download='rostrum-ajanda.ics'; lnk.click();
  URL.revokeObjectURL(url); showToast('Ajanda indirildi ✓');
}

function openApptPopup(apptId, event){
  event.stopPropagation();
  const prev=document.getElementById('apptDetailPopup');
  if(prev){ const wasId=prev.dataset.id; prev.remove(); if(wasId===apptId) return; }
  const a=S.appointments.find(x=>x.id===apptId); if(!a) return;
  const stu=S.students.find(s=>s.id===a.studentId);
  const color=apptTypeColor(a.type);
  const popup=document.createElement('div');
  popup.id='apptDetailPopup'; popup.dataset.id=apptId;
  const vw=window.innerWidth,vh=window.innerHeight,pw=264;
  let x=Math.min(event.clientX+12,vw-pw-12);
  let y=Math.min(event.clientY+12,vh-220);
  popup.style.cssText=`position:fixed;left:${x}px;top:${y}px;z-index:600;width:${pw}px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,.18);animation:viewIn .15s ease`;
  const meetLink=a.meetLink||a.meet_link;
  popup.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0"></div>
      <div style="flex:1;font-size:14px;font-weight:800">${esc(stu?.name||'?')}</div>
      <button onclick="document.getElementById('apptDetailPopup')?.remove()" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:18px;line-height:1;padding:0">×</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:12px;font-size:12px;color:var(--text-mid)">
      <div>🕐 <b style="color:var(--text)">${a.time||'—'}</b> · ${a.duration} dk</div>
      <div>📋 <span style="background:${color}20;color:${color};padding:1px 8px;border-radius:99px;font-weight:700;font-size:11px">${esc(a.type||'')}</span></div>
      ${a.note?`<div>📝 <span style="color:var(--text)">${esc(a.note)}</span></div>`:''}
      <div>📅 ${new Date(a.date+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'})}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${meetLink?`<a href="${esc(meetLink)}" target="_blank" style="font-size:11px;font-weight:700;color:var(--blue);background:var(--blue-dim);padding:4px 10px;border-radius:99px;text-decoration:none">🎥 ${meetLink.includes('zoom')?'Zoom':'Meet'}</a>`:''}
      <a href="${gcalUrlFor(a)}" target="_blank" style="font-size:11px;font-weight:700;color:var(--green);background:var(--green-dim);padding:4px 10px;border-radius:99px;text-decoration:none">📅 GCal</a>
      <button onclick="document.getElementById('apptDetailPopup')?.remove();openAgendaApptModal('${a.id}')" style="font-size:11px;font-weight:700;color:var(--text);background:var(--surface2);padding:4px 10px;border-radius:99px;border:1px solid var(--border);cursor:pointer;font-family:inherit">✏️ Düzenle</button>
      <button onclick="deleteAgendaAppt('${a.id}')" style="font-size:11px;font-weight:700;color:var(--red,#ef4444);background:#ef444410;padding:4px 10px;border-radius:99px;border:none;cursor:pointer;font-family:inherit">🗑</button>
    </div>`;
  document.body.appendChild(popup);
  setTimeout(()=>{ document.addEventListener('click',function _cp(e){ if(!popup.contains(e.target)){popup.remove();document.removeEventListener('click',_cp);} }); },50);
}

async function handleApptDrop(event, ds){
  event.preventDefault();
  const apptId=window._draggingApptId; if(!apptId) return; window._draggingApptId=null; _draggingApptId=null;
  const col=event.currentTarget;
  const rect=col.getBoundingClientRect();
  const scrollEl=col.closest('[data-tl-scroll]');
  const scrollTop=scrollEl?scrollEl.scrollTop:0;
  const y=event.clientY-rect.top+scrollTop;
  const totalMin=(y/PX_H)*60+TL_START*60;
  const h=Math.max(TL_START,Math.min(TL_END-1,Math.floor(totalMin/60)));
  const rawM=Math.round((totalMin%60)/15)*15;
  const m=rawM>=60?0:rawM;
  const timeStr=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const {error}=await db.from('appointments').update({date:ds,time:timeStr}).eq('id',apptId);
  if(error){showToast('Hata: '+error.message);return;}
  const a=S.appointments.find(x=>x.id===apptId);
  if(a){a.date=ds;a.time=timeStr;}
  renderAgenda(); showToast('Randevu taşındı ✓');
}

function renderTodoList(){ renderAgenda(); }

function renderAgenda(){
  const el = document.getElementById('view-todolist');
  if(!el) return;

  // CSS Enjeksiyonu
  if (!document.getElementById('fc-styles')) {
    const s = document.createElement('style');
    s.id = 'fc-styles';
    s.textContent = `
      .fc {
        --fc-border-color: var(--border) !important;
        --fc-page-bg-color: var(--surface) !important;
        font-family: inherit !important;
        color: var(--text) !important;
      }
      .fc .fc-col-header-cell-cushion,
      .fc .fc-timegrid-slot-label-cushion,
      .fc .fc-list-day-text,
      .fc .fc-list-day-side-text {
        color: var(--text) !important;
        font-weight: 700 !important;
        text-decoration: none !important;
      }
      .fc-theme-standard td, .fc-theme-standard th {
        border-color: var(--border) !important;
      }
      .fc .fc-toolbar-title {
        font-size: 15px !important;
        font-weight: 800 !important;
        color: var(--text) !important;
      }
      .fc .fc-button-primary {
        background-color: var(--surface2) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        font-weight: 700 !important;
        font-size: 12px !important;
        text-transform: capitalize !important;
        padding: 5px 10px !important;
      }
      .fc .fc-button-primary:hover {
        background-color: var(--surface3) !important;
        border-color: var(--border) !important;
      }
      .fc .fc-button-active {
        background-color: var(--accent) !important;
        border-color: var(--accent) !important;
        color: #0f0e0c !important;
      }
      .fc .fc-list-event:hover td {
        background-color: var(--surface2) !important;
      }
      .fc .fc-list-empty {
        background-color: var(--surface) !important;
        color: var(--text-dim) !important;
      }
      .fc-v-event {
        border-radius: 8px !important;
        padding: 4px 8px !important;
        border: none !important;
        box-shadow: var(--shadow) !important;
      }
      .fc-event-title {
        font-weight: 700 !important;
        font-size: 11px !important;
      }
      .fc-event-time {
        font-size: 9px !important;
        opacity: 0.8;
      }
      .fc .fc-scroller {
        scrollbar-width: thin !important;
      }
    `;
    document.head.appendChild(s);
  }

  // Filtre seçenekleri
  const studentOpts=`<option value="">Tüm Öğrenciler</option>`+S.students.map(s=>`<option value="${s.id}"${_agendaFilter.studentId===s.id?' selected':''}>${esc(s.name)}</option>`).join('');
  const typeOpts=`<option value="">Tüm Tipler</option>`+Object.keys(APPT_TYPE_COLORS).map(t=>`<option value="${t}"${_agendaFilter.type===t?' selected':''}>${t}</option>`).join('');

  // Randevu verilerini filtrele ve FullCalendar formatına çevir
  let appts = S.appointments;
  if(_agendaFilter.studentId) appts=appts.filter(a=>a.studentId===_agendaFilter.studentId);
  if(_agendaFilter.type) appts=appts.filter(a=>a.type===_agendaFilter.type);

  const events = appts.map(a => {
    const stu = S.students.find(s => s.id === a.studentId);
    const c = apptTypeColor(a.type);
    const startStr = `${a.date}T${a.time || '09:00'}`;
    const start = new Date(startStr);
    const end = new Date(start.getTime() + (a.duration || 45) * 60000);
    
    // YYYY-MM-DDTHH:MM:SS formatına dönüştür
    const pad = n => String(n).padStart(2,'0');
    const endStr = `${end.getFullYear()}-${pad(end.getMonth()+1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}:00`;
    
    return {
      id: a.id,
      title: `${stu?.name || 'Öğrenci'} (${a.type || 'Randevu'})`,
      start: startStr,
      end: endStr,
      backgroundColor: c,
      borderColor: c,
      textColor: '#ffffff',
      extendedProps: { ...a }
    };
  });

  const selStyle='font-size:12px;padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;font-family:inherit';

  // Eğer takvim yapısı kurulmadıysa HTML iskeletini oluştur
  let calendarContainer = document.getElementById('fc-calendar');
  if (!calendarContainer) {
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;height:calc(100vh - 104px);overflow:hidden;box-sizing:border-box">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex-shrink:0">
          <select style="${selStyle}" onchange="agendaSetFilter('studentId',this.value)">${studentOpts}</select>
          <select style="${selStyle}" onchange="agendaSetFilter('type',this.value)">${typeOpts}</select>
          <button onclick="exportAgendaICS()" style="font-size:12px;padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-family:inherit;color:var(--text)">📥 ICS İndir</button>
          <div style="flex:1"></div>
          <button class="btn btn-accent btn-sm" onclick="openAgendaApptModal(null)">+ Randevu Ekle</button>
        </div>
        <div id="fc-calendar" style="flex:1;min-height:0;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:12px;box-shadow:var(--shadow)"></div>
      </div>
    `;
    calendarContainer = document.getElementById('fc-calendar');
  } else {
    // Seçim kutularının değerlerini güncelle
    const selects = el.querySelectorAll('select');
    if (selects[0]) selects[0].innerHTML = studentOpts;
    if (selects[1]) selects[1].innerHTML = typeOpts;
  }

  // FullCalendar kurulumu veya güncellemesi
  if (typeof FullCalendar !== 'undefined') {
    if (window._fcInstance) {
      window._fcInstance.removeAllEvents();
      window._fcInstance.addEventSource(events);
      window._fcInstance.updateSize();
    } else {
      window._fcInstance = new FullCalendar.Calendar(calendarContainer, {
        initialView: window.innerWidth < 700 ? 'listWeek' : 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
          today: 'Bugün',
          month: 'Ay',
          week: 'Hafta',
          day: 'Gün',
          list: 'Ajanda'
        },
        locale: 'tr',
        firstDay: 1, // Pazartesi
        slotMinTime: '08:00',
        slotMaxTime: '23:00',
        allDaySlot: false,
        editable: true,
        droppable: true,
        selectable: true,
        eventClick: function(info) {
          openApptPopup(info.event.id, info.jsEvent);
        },
        select: function(info) {
          const dateStr = info.startStr.slice(0, 10);
          const timeStr = info.startStr.slice(11, 16) || '14:00';
          openAgendaApptModal(null, dateStr);
          setTimeout(() => {
            const timeEl = document.getElementById('amTime');
            if (timeEl) timeEl.value = timeStr;
          }, 50);
        },
        eventDrop: async function(info) {
          const newStart = info.event.start;
          const newEnd = info.event.end || new Date(newStart.getTime() + 45 * 60000);
          const ds = newStart.getFullYear() + '-' + String(newStart.getMonth()+1).padStart(2,'0') + '-' + String(newStart.getDate()).padStart(2,'0');
          const timeStr = String(newStart.getHours()).padStart(2,'0') + ':' + String(newStart.getMinutes()).padStart(2,'0');
          const dur = Math.round((newEnd.getTime() - newStart.getTime()) / 60000);
          
          const apptId = info.event.id;
          const { error } = await db.from('appointments').update({
            date: ds,
            time: timeStr,
            duration: dur
          }).eq('id', apptId);

          if (error) {
            showToast('Hata: ' + error.message);
            info.revert();
            return;
          }
          
          const a = S.appointments.find(x => x.id === apptId);
          if (a) {
            a.date = ds;
            a.time = timeStr;
            a.duration = dur;
          }
          showToast('Randevu taşıma başarılı ✓');
        },
        eventResize: async function(info) {
          const newStart = info.event.start;
          const newEnd = info.event.end;
          if (!newEnd) return;
          const dur = Math.round((newEnd.getTime() - newStart.getTime()) / 60000);
          
          const apptId = info.event.id;
          const { error } = await db.from('appointments').update({
            duration: dur
          }).eq('id', apptId);

          if (error) {
            showToast('Hata: ' + error.message);
            info.revert();
            return;
          }
          
          const a = S.appointments.find(x => x.id === apptId);
          if (a) {
            a.duration = dur;
          }
          showToast('Randevu süresi güncellendi ✓');
        },
        events: events
      });
      window._fcInstance.render();
    }
  } else {
    console.warn('FullCalendar library not loaded yet');
  }
}

function openAgendaApptModal(id, prefillDate){
  const a = id ? S.appointments.find(x=>x.id===id) : null;
  document.getElementById('amTitle').textContent = a ? 'Randevuyu Düzenle' : 'Yeni Randevu';
  document.getElementById('amId').value = id||'';
  document.getElementById('amStudent').innerHTML = S.students.map(s=>`<option value="${s.id}" ${a?.studentId===s.id?'selected':''}>${esc(s.name)}</option>`).join('');
  document.getElementById('amDate').value = a ? a.date : (prefillDate || fmtDate(new Date()));
  document.getElementById('amTime').value = a ? a.time : '14:00';
  document.getElementById('amDuration').value = a ? a.duration : '45';
  document.getElementById('amType').value = a ? a.type : 'Haftalık Değerlendirme';
  document.getElementById('amNote').value = a ? (a.note||'') : '';
  document.getElementById('amMeetLink').value = a ? (a.meetLink||a.meet_link||'') : '';
  om('apptModal');
}

async function deleteAgendaAppt(id){
  if(!await customConfirm('Randevu silinsin mi?')) return;
  await db.from('appointments').delete().eq('id',id);
  S.appointments = S.appointments.filter(a=>a.id!==id);
  renderAgenda();
  showToast('Randevu silindi');
}

function openCoachTodoModal(ds, dayLabel){
  _ctdDate=ds;
  document.getElementById('ctdDay').textContent=dayLabel;
  document.getElementById('ctdTask').value='';
  document.getElementById('ctdNote').value='';
  om('coachTodoModal');
}
async function saveCoachTodo(){
  const task=document.getElementById('ctdTask').value.trim();
  if(!task)return showToast('Görev adı girin!');
  const payload={date:_ctdDate,coach_id:session.coachId,task,note:document.getElementById('ctdNote').value.trim(),done:false};
  const {data,error}=await db.from('coach_todos').insert(payload).select().single();
  if(error)return showToast('Hata: '+error.message);
  if(!S.coachTodos[_ctdDate])S.coachTodos[_ctdDate]=[];
  S.coachTodos[_ctdDate].push({_id:data.id,task:data.task,note:data.note,done:false});
  cm('coachTodoModal');renderTodoList();showToast('Görev eklendi ✓');
}
async function toggleCtd(ds,idx){
  const t=S.coachTodos[ds]?.[idx]; if(!t)return;
  const newDone=!t.done;
  await db.from('coach_todos').update({done:newDone}).eq('id',t._id);
  t.done=newDone; renderTodoList();
}
async function deleteCtd(ds,idx){
  const t=S.coachTodos[ds]?.[idx]; if(!t)return;
  await db.from('coach_todos').delete().eq('id',t._id);
  S.coachTodos[ds].splice(idx,1); renderTodoList(); showToast('Silindi');
}

// ═══════════════════════════════════════════════
// STUDENTS
// ═══════════════════════════════════════════════
function renderStudents(){ renderStudentsSearch(); }
function goProgram(id){
  S.activeStuId=id; S.weekOffset=0; saveUI();
  openStudentProgram(id);
}
function openStudentModal(id){
  const s=id?S.students.find(x=>x.id===id):null;
  document.getElementById('smTitle').textContent=s?'Öğrenciyi Düzenle':'Yeni Öğrenci';
  document.getElementById('smId').value=id||'';
  document.getElementById('smName').value=s?.name||'';
  document.getElementById('smTarget').value=s?.target||'';
  document.getElementById('smUsername').value=s?.username||'';
  document.getElementById('smPass').value=s?.pass||STU_DEFAULT_PASS;
  document.getElementById('smWeekStart').value=s?.weekStart??0;
  document.getElementById('smYksArea').value=s?.yksArea||'SAY';
  document.getElementById('smProg').value=s?.progress||0;
  document.getElementById('smProgVal').textContent=(s?.progress||0)+'%';
  document.querySelectorAll('.color-opt').forEach(el=>el.classList.toggle('sel',el.dataset.c===(s?.color||'#f0a500')));
  // Koç modunda role field varsa gizle, save butonu normal çağırsın
  const roleField=document.getElementById('smRoleField');
  if(roleField) roleField.style.display='none';
  document.querySelector('#studentModal .btn-accent').setAttribute('onclick','saveStudent()');
  om('studentModal');
}
document.getElementById('smProg').addEventListener('input',function(){document.getElementById('smProgVal').textContent=this.value+'%';});
document.getElementById('smColorPick').addEventListener('click',function(e){const o=e.target.closest('.color-opt');if(!o)return;document.querySelectorAll('.color-opt').forEach(el=>el.classList.remove('sel'));o.classList.add('sel');});
async function saveStudent(){
  const name=document.getElementById('smName').value.trim();
  if(!name)return showToast('İsim girin!');
  const color=document.querySelector('.color-opt.sel')?.dataset.c||'#f0a500';
  const id=document.getElementById('smId').value;
  const uname=normalizeUsername(document.getElementById('smUsername').value.trim())||(normalizeUsername(name.split(' ')[0])+Math.floor(Math.random()*100));
  const passRaw=document.getElementById('smPass').value||STU_DEFAULT_PASS;
  const pass = await sha256(passRaw);
  const yksArea = document.getElementById('smYksArea').value;
  const payload={full_name:name,target:document.getElementById('smTarget').value.trim()||'Hedef belirtilmemiş',color,progress:Number(document.getElementById('smProg').value),password_hash:pass,week_start:Number(document.getElementById('smWeekStart').value),username:uname,role:'student',coach_id:session.coachId,yks_area:yksArea};
  if(id){
    const {error}=await db.rpc('update_student_profile', {
      p_student_id: id,
      p_full_name: name,
      p_target: payload.target,
      p_color: color,
      p_progress: payload.progress,
      p_week_start: payload.week_start,
      p_username: uname,
      p_plain_password: passRaw,
      p_password_hash: pass,
      p_yks_area: payload.yks_area
    });
    if(error)return showToast('Hata: '+error.message);
    const s=S.students.find(x=>x.id===id);
    if(s)Object.assign(s,{name:payload.full_name,target:payload.target,color,progress:payload.progress,pass:payload.password_hash,weekStart:payload.week_start,username:uname,yksArea:payload.yks_area});
    showToast('Güncellendi ✓');
    saveUI();cm('studentModal');renderStudentsSearch();
  } else {
    const email = uname + '@rostrumakademi.com';
    const { data: { session: authSess } } = await db.auth.getSession();
    const resp = await fetch('/api/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authSess?.access_token||''}` },
      body: JSON.stringify({ email, password: passRaw, full_name: payload.full_name, username: uname, color: payload.color, target: payload.target, progress: payload.progress, week_start: payload.week_start, coach_id: payload.coach_id, exam_profile: 'YKS', yks_area: payload.yks_area })
    });
    const result = await resp.json();
    if (!resp.ok) return showToast('Hata: ' + result.error);
    const newUserId = result.userId;
    S.students.push({id:newUserId,name:payload.full_name,target:payload.target,color:payload.color,progress:payload.progress||0,pass:pass,weekStart:payload.week_start||0,username:uname,yksArea:payload.yks_area});
    if(!S.activeStuId)S.activeStuId=newUserId;
    saveUI();cm('studentModal');
    // Davet bilgisi göster
    showInviteInfo(payload.full_name, uname, passRaw);
  }
}
// ── ÖĞRENCİ DAVET BİLGİSİ ──────────────────────
function showInviteInfo(name, username, pass){
  let modal = document.getElementById('inviteModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'inviteModal';
    modal.className = 'modal-bg';
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  const siteUrl = window.location.origin + window.location.pathname.replace('app.html','');
  const loginUrl = `${siteUrl}app.html`;
  const whatsappText = encodeURIComponent(`Merhaba ${name}! 🎓\n\nSeni Rostrum Akademi platformuna ekledim.\n\n📱 Giriş adresi: ${loginUrl}\n👤 Kullanıcı adı: ${username}\n🔑 Şifre: ${pass}\n\nGiriş yaptıktan sonra programını görebileceksin!`);

  modal.innerHTML = `<div class="modal" style="max-width:480px">
    <button class="modal-close" onclick="cm('inviteModal');renderStudentsSearch()">×</button>
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:40px;margin-bottom:8px">🎉</div>
      <h2>${esc(name)} eklendi!</h2>
      <p style="font-size:13px;color:var(--text-mid);margin-top:6px">Öğrencine aşağıdaki bilgileri paylaş</p>
    </div>

    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Kullanıcı Adı</div>
          <div style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:var(--accent)">${esc(username)}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Şifre</div>
          <div style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:var(--accent)">${esc(pass)}</div>
        </div>
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
        <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Giriş Adresi</div>
        <div style="font-size:12px;color:var(--blue);word-break:break-all">${loginUrl}</div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="copyInvite('${esc(username)}','${esc(pass)}','${loginUrl}')">📋 Kopyala</button>
      <a href="https://wa.me/?text=${whatsappText}" target="_blank" class="btn btn-accent" style="flex:1;justify-content:center;text-decoration:none">💬 WhatsApp ile Gönder</a>
    </div>

    <div style="border-top:1px solid var(--border);padding-top:14px;margin-top:12px">
      <div style="font-size:11px;font-weight:600;color:var(--text-dim);margin-bottom:8px">📧 E-posta ile gönder (opsiyonel)</div>
      <div style="display:flex;gap:8px">
        <input type="email" id="inviteEmailInput" placeholder="veli@ornek.com" style="flex:1;padding:9px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:13px;outline:none">
        <button onclick="sendInviteEmail()" style="padding:9px 16px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">Gönder</button>
      </div>
      <div id="inviteEmailMsg" style="display:none;font-size:12px;margin-top:6px;padding:6px 10px;border-radius:6px"></div>
    </div>

    <button class="btn btn-ghost" style="width:100%;justify-content:center;margin-top:12px" onclick="cm('inviteModal');renderStudentsSearch()">Kapat</button>
  </div>`;
  window._pendingInvite = { name, username, pass, loginUrl };
  om('inviteModal');
}

async function sendInviteEmail() {
  const email = document.getElementById('inviteEmailInput')?.value.trim();
  const msgEl = document.getElementById('inviteEmailMsg');
  if (!email || !email.includes('@')) {
    if (msgEl) { msgEl.style.display = 'block'; msgEl.style.background = 'var(--red-dim)'; msgEl.style.color = 'var(--red)'; msgEl.textContent = 'Geçerli bir e-posta girin.'; }
    return;
  }
  if (!window._pendingInvite) return;
  const { name, username, pass, loginUrl } = window._pendingInvite;
  if (msgEl) { msgEl.style.display = 'block'; msgEl.style.background = 'var(--surface2)'; msgEl.style.color = 'var(--text-mid)'; msgEl.textContent = 'Gönderiliyor...'; }
  try {
    const resp = await fetch('/api/mailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'student_welcome',
        to: email,
        student_name: name,
        username,
        password: pass,
        login_url: loginUrl,
        coach_name: S.workspace?.brand_name || ''
      })
    });
    const d = await resp.json();
    if (resp.ok) {
      if (msgEl) { msgEl.style.background = 'var(--green-dim)'; msgEl.style.color = 'var(--green)'; msgEl.textContent = '✓ Mail gönderildi!'; }
    } else {
      throw new Error(d.error || 'Sunucu hatası');
    }
  } catch (e) {
    if (msgEl) { msgEl.style.background = 'var(--red-dim)'; msgEl.style.color = 'var(--red)'; msgEl.textContent = '✗ ' + e.message; }
  }
}
window.sendInviteEmail = sendInviteEmail;

function copyInvite(username, pass, url){
  const text = `Giriş adresi: ${url}\nKullanıcı adı: ${username}\nŞifre: ${pass}`;
  navigator.clipboard.writeText(text).then(()=>showToast('Kopyalandı ✓')).catch(()=>{
    const el=document.createElement('textarea');el.value=text;document.body.appendChild(el);el.select();document.execCommand('copy');el.remove();showToast('Kopyalandı ✓');
  });
}
async function deleteStu(id){
  if(!await customConfirm('Bu öğrenciyi silmek istediğinizden emin misiniz?'))return;
  
  const rowEl = document.getElementById(`sturow_${id}`);
  if (rowEl) {
    rowEl.style.transition = 'all 0.3s ease';
    rowEl.style.opacity = '0';
    rowEl.style.transform = 'translateX(30px)';
    rowEl.innerHTML = '<div style="color:var(--red); font-weight:700; font-size:13px; display:flex; align-items:center; gap:6px">🗑️ Siliniyor...</div>';
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  const {error}=await db.from('users').delete().eq('id',id);
  if(error)return showToast('Hata: '+error.message);
  S.students=S.students.filter(s=>s.id!==id);
  if(S.activeStuId===id)S.activeStuId=S.students[0]?.id||null;
  saveUI();renderStudents();showToast('Silindi');
}

// ═══════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════
function renderAppointments(){
  const el=document.getElementById('view-appointments');
  el.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${S.students.find(s=>s.id===S.activeStuId)?.name||'Öğrenci'}</button>
    <div class="sh"><h2>Randevular</h2><button class="btn btn-accent" onclick="openApptModal()">+ Yeni Randevu</button></div>
    <div class="appts-layout">
      <div class="card cp">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <span style="font-family:'Inter',sans-serif;font-size:17px;font-weight:700" id="calMonthLbl"></span>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="chCalMonth(-1)">‹</button>
            <button class="btn btn-ghost btn-sm" onclick="chCalMonth(1)">›</button>
          </div>
        </div>
        <div class="cal-dow-row">${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}</div>
        <div class="cal-days-grid" id="calDaysGrid"></div>
      </div>
      <div>
        <div class="card cp">
          <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)" id="apptListTitle">Yaklaşan Görüşmeler</div>
          <div id="apptList"></div>
          <button class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;margin-top:8px" onclick="S.calSelDay=null;renderCalDays();renderApptList()">Tümünü Göster</button>
        </div>
      </div>
    </div>`;
  renderCalDays();renderApptList();
}
function renderCalDays(){
  const y=S.calYear,m=S.calMonth;
  document.getElementById('calMonthLbl').textContent=`${MONTHS_TR[m]} ${y}`;
  const firstDow=new Date(y,m,1).getDay();
  const dim=new Date(y,m+1,0).getDate();
  const ts=todayStr();
  const apptDays=new Set(S.appointments.filter(a=>{const d=new Date(a.date);return d.getFullYear()===y&&d.getMonth()===m;}).map(a=>new Date(a.date).getDate()));
  const pad=firstDow===0?6:firstDow-1;
  let html='';
  for(let i=0;i<pad;i++)html+=`<div class="cal-day empty"></div>`;
  for(let d=1;d<=dim;d++){
    const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html+=`<div class="cal-day ${ds===ts?'today':''} ${ds===S.calSelDay&&ds!==ts?'selected':''} ${apptDays.has(d)?'has-appt':''}" onclick="selCalDay('${ds}')">${d}</div>`;
  }
  document.getElementById('calDaysGrid').innerHTML=html;
}
function selCalDay(ds){S.calSelDay=S.calSelDay===ds?null:ds;renderCalDays();renderApptList();}
function chCalMonth(delta){S.calMonth+=delta;if(S.calMonth>11){S.calMonth=0;S.calYear++;}if(S.calMonth<0){S.calMonth=11;S.calYear--;}saveS();renderCalDays();}
function renderApptList(){
  const ts=todayStr();let appts=S.appointments;let title='Yaklaşan Görüşmeler';
  if(S.calSelDay){appts=appts.filter(a=>a.date===S.calSelDay);title=new Date(S.calSelDay+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long'});}
  else{appts=appts.filter(a=>a.date>=ts).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,10);}
  document.getElementById('apptListTitle').textContent=title;
  if(!appts.length){document.getElementById('apptList').innerHTML=`<div class="empty"><p>Randevu yok</p></div>`;return;}
  document.getElementById('apptList').innerHTML=appts.map(a=>{
    const stu=S.students.find(s=>s.id===a.studentId);
    const isToday=a.date===ts;
    const dl=isToday?'BUGÜN':new Date(a.date+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
    return `<div data-appt-id="${a.id}" class="appt-item" style="border-left-color:${stu?.color||'#555'}">
      <div class="appt-when">${dl} • ${a.time} (${a.duration} dk)</div>
      <div class="appt-name">${esc(stu?.name||'?')}</div>
      <div class="appt-type">${esc(a.type)}</div>
      ${a.note?`<div class="appt-note">${esc(a.note)}</div>`:''}
      ${a.meet_link?`<div style="margin-top:6px;display:flex;gap:6px;align-items:center">
        <a href="${esc(a.meet_link)}" target="_blank" style="font-size:11px;background:var(--blue-dim);color:var(--blue);padding:3px 10px;border-radius:99px;text-decoration:none;font-weight:700">${a.meet_link.includes('zoom')?'🎥 Zoom':`📹 Meet`}</a>
        <button class="btn btn-ghost btn-xs" onclick="copyToClipboard('${esc(a.meet_link)}')">Kopyala</button>
      </div>`:''}
      <div class="appt-actions">
        <button class="btn btn-ghost btn-xs" onclick="openApptModal('${a.id}')">✏️</button>
        <button class="btn btn-danger btn-xs" onclick="deleteAppt('${a.id}')">🗑</button>
      </div>
    </div>`;
  }).join('');
}
function openApptModal(id){
  const a=id?S.appointments.find(x=>x.id===id):null;
  document.getElementById('amTitle').textContent=a?'Randevuyu Düzenle':'Yeni Randevu';
  document.getElementById('amId').value=id||'';
  document.getElementById('amStudent').innerHTML=S.students.map(s=>`<option value="${s.id}" ${a?.studentId===s.id?'selected':''}>${esc(s.name)}</option>`).join('');
  document.getElementById('amDate').value=a?a.date:fmtDate(new Date());
  document.getElementById('amTime').value=a?a.time:'14:00';
  document.getElementById('amDuration').value=a?a.duration:'45';
  document.getElementById('amType').value=a?a.type:'Haftalık Değerlendirme';
  document.getElementById('amNote').value=a?.note||'';
  document.getElementById('amMeetLink').value=a?.meet_link||'';
  om('apptModal');
}
async function saveAppt(){
  const stuId=document.getElementById('amStudent').value;
  const date=document.getElementById('amDate').value;
  const time=document.getElementById('amTime').value;
  if(!stuId||!date||!time)return showToast('Tüm alanları doldurun!');
  const rawMeetLink = document.getElementById('amMeetLink').value.trim();
  if(rawMeetLink && !rawMeetLink.startsWith('https://')) return showToast('Toplantı linki https:// ile başlamalı');
  if(rawMeetLink && !/zoom\.us|meet\.google|teams\.microsoft|webex\.com/.test(rawMeetLink)) return showToast('Geçersiz link — Zoom, Meet, Teams veya Webex linki girin');
  const id=document.getElementById('amId').value;
  const payload={student_id:stuId,coach_id:session.coachId,date,time,duration:parseInt(document.getElementById('amDuration').value),type:document.getElementById('amType').value,note:document.getElementById('amNote').value.trim(),meet_link:rawMeetLink};
  if(id){
    await db.from('appointments').update(payload).eq('id',id);
    const a=S.appointments.find(x=>x.id===id);
    if(a)Object.assign(a,{studentId:stuId,date,time,duration:payload.duration,type:payload.type,note:payload.note});
    showToast('Güncellendi ✓');
  } else {
    const {data,error}=await db.from('appointments').insert(payload).select().single();
    if(error)return showToast('Hata: '+error.message);
    S.appointments.push({id:data.id,studentId:data.student_id,date:data.date,time:data.time,duration:data.duration,type:data.type,note:data.note});
    showToast('Randevu eklendi ✓');
  }
  cm('apptModal');
  if(currentTab === 'todolist') renderAgenda(); else if(document.getElementById('view-appointments')?.classList.contains('active')) renderAppointments();
}
async function deleteAppt(id){
  if(!await customConfirm('Bu randevuyu silmek istediğinizden emin misiniz?'))return;
  
  const rowEl = document.querySelector(`[data-appt-id="${id}"]`);
  if (rowEl) {
    rowEl.style.transition = 'all 0.3s ease';
    rowEl.style.opacity = '0';
    rowEl.style.transform = 'translateX(30px)';
    const nameEl = rowEl.querySelector('.appt-name');
    if (nameEl) nameEl.innerHTML = '<span style="color:var(--red); font-weight:700">🗑️ Siliniyor...</span>';
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  await db.from('appointments').delete().eq('id',id);
  S.appointments=S.appointments.filter(a=>a.id!==id);
  renderAppointments();
  showToast('Silindi');
}

// ═══════════════════════════════════════════════
// YKS PUAN HESAP YARDIMCILARI (2024 formülü)
// ═══════════════════════════════════════════════
function _tytPuan(nets) {
  return 100 + (Number(nets['Türkçe']||0) + Number(nets['Matematik']||0) + Number(nets['Fen']||0) + Number(nets['Sosyal']||0)) * (400/120);
}
function _aytRawPuan(type, nets) {
  const n = f => Number(nets[f]||0);
  if (type === 'AYT-SAY') return 100 + (n('Matematik')+n('Fizik')+n('Kimya')+n('Biyoloji')) * 5.0;
  if (type === 'AYT-EA')  return 100 + (n('Matematik')+n('Edebiyat')+n('Tarih')+n('Coğrafya')) * 5.0;
  if (type === 'AYT-SOZ') return 100 + (n('Edebiyat')+n('Tarih1')+n('Tarih2')+n('Coğrafya1')+n('Coğrafya2')+n('Felsefe')+n('Din')) * 5.0;
  return null;
}
const _YKS_LABEL = { 'AYT-SAY':'SAY','AYT-EA':'EA','AYT-SOZ':'SÖZ' };
const _YKS_COLOR = { 'TYT':'#3B82F6','SAY':'#8B5CF6','EA':'#10B981','SÖZ':'#F59E0B' };

function puanCardHtml(exam, studentExams) {
  const { type, nets } = exam;
  if (type === 'TYT') {
    const p = _tytPuan(nets);
    const c = _YKS_COLOR.TYT;
    return `<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <span style="background:${c}18;border:1px solid ${c}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
        <span style="font-size:10px;font-weight:700;color:${c};text-transform:uppercase">TYT Puan</span>
        <span style="font-size:18px;font-weight:900;color:${c}">${p.toFixed(2)}</span>
      </span>
    </div>`;
  }
  const label = _YKS_LABEL[type];
  if (!label) return '';
  const c = _YKS_COLOR[label] || '#64748B';
  const ayt = _aytRawPuan(type, nets);
  const lastTyt = studentExams
    .filter(e => e.type === 'TYT' && e.date <= exam.date)
    .sort((a,b) => b.date.localeCompare(a.date))[0];
  if (lastTyt) {
    const tyt = _tytPuan(lastTyt.nets);
    const final = tyt * 0.4 + ayt * 0.6;
    return `<div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="background:${c}18;border:1px solid ${c}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
        <span style="font-size:10px;font-weight:700;color:${c};text-transform:uppercase">${label} Puan</span>
        <span style="font-size:18px;font-weight:900;color:${c}">${final.toFixed(2)}</span>
      </span>
      <span style="font-size:11px;color:var(--text-dim)">TYT×0.4 <b>${(tyt*0.4).toFixed(1)}</b> · AYT×0.6 <b>${(ayt*0.6).toFixed(1)}</b></span>
    </div>`;
  }
  return `<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <span style="background:${c}18;border:1px solid ${c}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
      <span style="font-size:10px;font-weight:700;color:${c};text-transform:uppercase">AYT ${label} Ham</span>
      <span style="font-size:18px;font-weight:900;color:${c}">${ayt.toFixed(2)}</span>
    </span>
    <span style="font-size:10px;color:var(--text-dim);font-style:italic">TYT etkisi dahil değil</span>
  </div>`;
}

function _refreshModalPuan() {
  const el = document.getElementById('emPuanDisplay');
  if (!el) return;
  const type = document.getElementById('emExamType')?.value;
  if (!type) return;
  const nets = {};
  (EXAM_DEFS[type]||[]).forEach(ders => {
    const d = _examDetails[ders] || {};
    nets[ders] = Math.max(0, (d.dogru||0) - (d.yanlis||0)/4);
  });
  if (type === 'TYT') {
    const p = _tytPuan(nets);
    const c = _YKS_COLOR.TYT;
    el.innerHTML = `<div style="background:${c}12;border:1px solid ${c}35;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px">
      <span style="font-size:11px;font-weight:700;color:${c};text-transform:uppercase;letter-spacing:.4px">🎯 TYT Puan</span>
      <span style="font-size:24px;font-weight:900;color:${c};letter-spacing:-.5px">${p.toFixed(2)}</span>
    </div>`;
    return;
  }
  const label = _YKS_LABEL[type];
  const c = _YKS_COLOR[label] || '#64748B';
  const ayt = _aytRawPuan(type, nets);
  if (ayt === null) { el.innerHTML = ''; return; }
  const stuId = document.getElementById('emStudent')?.value;
  const lastTyt = stuId ? [...S.exams]
    .filter(e => e.studentId === stuId && e.type === 'TYT')
    .sort((a,b) => b.date.localeCompare(a.date))[0] : null;
  if (lastTyt) {
    const tyt = _tytPuan(lastTyt.nets);
    const final = tyt * 0.4 + ayt * 0.6;
    el.innerHTML = `<div style="background:${c}12;border:1px solid ${c}35;border-radius:10px;padding:10px 14px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:700;color:${c};text-transform:uppercase;letter-spacing:.4px">🎯 ${label} Puan</span>
        <span style="font-size:24px;font-weight:900;color:${c};letter-spacing:-.5px">${final.toFixed(2)}</span>
        <span style="font-size:11px;color:var(--text-dim)">TYT×0.4=${(tyt*0.4).toFixed(1)} · AYT×0.6=${(ayt*0.6).toFixed(1)}</span>
      </div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:3px">TYT: ${lastTyt.date} tarihli deneme baz alındı</div>
    </div>`;
  } else {
    el.innerHTML = `<div style="background:${c}12;border:1px solid ${c}35;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="font-size:11px;font-weight:700;color:${c};text-transform:uppercase;letter-spacing:.4px">🎯 AYT ${label} Ham</span>
      <span style="font-size:24px;font-weight:900;color:${c};letter-spacing:-.5px">${ayt.toFixed(2)}</span>
      <span style="font-size:10px;color:var(--text-dim);font-style:italic">TYT puanı bulunamadı</span>
    </div>`;
  }
}

// ═══════════════════════════════════════════════
// EXAMS (Coach view — read-only + comment)
// ═══════════════════════════════════════════════
function _examChartHtml(exams, stu) {
  if (!exams.length) return '';
  const sorted  = [...exams].sort((a,b)=>a.date.localeCompare(b.date)).slice(-8);
  const latest  = sorted[sorted.length-1];
  const prev    = sorted.length>=2 ? sorted[sorted.length-2] : null;
  const fields  = EXAM_DEFS[latest.type]||[];
  const accent  = stu?.color||'#f0a500';

  const latestTotal = fields.reduce((s,f)=>s+Number(latest.nets?.[f]||0),0);
  const prevTotal   = prev ? fields.reduce((s,f)=>s+Number(prev.nets?.[f]||0),0) : null;
  const delta       = prevTotal!==null ? latestTotal-prevTotal : null;
  const worstF      = fields.length ? fields.reduce((w,f)=>Number(latest.nets?.[f]||0)<Number(latest.nets?.[w]||0)?f:w, fields[0]) : null;
  const dColor      = delta===null?'var(--text-dim)':delta>=0?'#3ecf8e':'#ef4444';
  const dSign       = delta===null?'—':(delta>=0?'+':'')+delta.toFixed(1);

  // ── Stat tiles ──
  const statHtml=`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
      <div style="font-size:9px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px">Son Deneme</div>
      <div style="font-family:'Inter',sans-serif;font-size:26px;font-weight:900;color:${accent};line-height:1">${latestTotal.toFixed(1)}</div>
      <div style="font-size:9px;color:var(--text-dim);margin-top:3px">toplam net</div>
    </div>
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
      <div style="font-size:9px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px">Gelişim</div>
      <div style="font-family:'Inter',sans-serif;font-size:26px;font-weight:900;line-height:1;color:${dColor}">${dSign}</div>
      <div style="font-size:9px;color:var(--text-dim);margin-top:3px">${prevTotal!==null?'önceki denemeden':'tek deneme'}</div>
    </div>
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
      <div style="font-size:9px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px">Eksik Ders</div>
      ${worstF?`<div style="font-size:15px;font-weight:900;line-height:1.2;color:#ef4444">${esc(worstF)}</div>
      <div style="font-size:11px;font-weight:700;color:var(--text-mid);margin-top:3px">${Number(latest.nets?.[worstF]||0).toFixed(1)} net</div>`:'<div style="font-size:12px;color:var(--text-dim)">—</div>'}
    </div>
  </div>`;

  // ── Ders bazlı horizontal bars (son deneme) ──
  const subBarsHtml=fields.map(f=>{
    const v=Number(latest.nets?.[f]||0);
    const maxQ=(EXAM_SORU[latest.type]||{})[f]||40;
    const pct=Math.min(100,Math.max(0,(v/maxQ)*100));
    const col=v>=maxQ*0.6?'#3ecf8e':v>=maxQ*0.35?'#f0a500':'#ef4444';
    return `<div style="margin-bottom:11px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
        <span style="font-size:12px;font-weight:600;color:var(--text)">${esc(f)}</span>
        <span style="font-size:14px;font-weight:800;color:${col};font-family:'Inter',sans-serif">${v.toFixed(1)}</span>
      </div>
      <div style="background:rgba(255,255,255,0.07);border-radius:4px;height:7px;overflow:hidden">
        <div style="width:${pct.toFixed(1)}%;height:100%;background:${col};border-radius:4px"></div>
      </div>
    </div>`;
  }).join('');

  if (sorted.length<2) return `<div class="card cp" style="margin-bottom:16px">
    <div style="font-size:11px;font-weight:700;margin-bottom:12px;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px">📊 Deneme Özeti</div>
    ${statHtml}
    <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Son Deneme · Derse Göre</div>
    ${subBarsHtml}
  </div>`;

  // ── Toplam net trend (alan grafiği, tek çizgi) ──
  const totals=sorted.map(e=>{const f=EXAM_DEFS[e.type]||[];return f.reduce((s,fn)=>s+Number(e.nets?.[fn]||0),0);});
  const maxTot=Math.max(...totals,10);
  const W=600,H=160,PL=40,PR=16,PT=28,PB=30;
  const CW=W-PL-PR,CH=H-PT-PB;
  const n=sorted.length;
  const xOf=i=>PL+(n<=1?CW/2:(i/(n-1))*CW);
  const yOf=v=>PT+CH-(v/maxTot)*CH;

  const rawStep=maxTot/4;
  const gStep=rawStep<=10?10:rawStep<=20?20:rawStep<=25?25:50;
  const gridVals=[];for(let v=0;v<=maxTot+gStep;v+=gStep){if(v<=maxTot*1.12)gridVals.push(v);}

  const gridSvg=gridVals.map(v=>{
    const y=yOf(v).toFixed(1);
    return `<line x1="${PL}" y1="${y}" x2="${W-PR}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`+
      `<text x="${PL-5}" y="${(yOf(v)+3.5).toFixed(1)}" text-anchor="end" font-size="9" fill="rgba(200,215,230,0.28)" font-family="system-ui,sans-serif">${v}</text>`;
  }).join('');

  const linePts=sorted.map((_,i)=>`${xOf(i).toFixed(1)},${yOf(totals[i]).toFixed(1)}`).join(' ');
  const areaD=`M ${xOf(0).toFixed(1)},${yOf(totals[0]).toFixed(1)} `
    +sorted.slice(1).map((_,i)=>`L ${xOf(i+1).toFixed(1)},${yOf(totals[i+1]).toFixed(1)}`).join(' ')
    +` L ${xOf(n-1).toFixed(1)},${(PT+CH).toFixed(1)} L ${xOf(0).toFixed(1)},${(PT+CH).toFixed(1)} Z`;
  const gid='ag'+Math.random().toString(36).slice(2,7);

  const dotsSvg=sorted.map((e,i)=>{
    const cx=xOf(i).toFixed(1),cy=yOf(totals[i]).toFixed(1);
    return `<circle cx="${cx}" cy="${cy}" r="5" fill="${accent}" stroke="#0d0d0f" stroke-width="2.5"/>`
      +`<text x="${cx}" y="${(yOf(totals[i])-10).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${accent}" font-family="system-ui,sans-serif">${totals[i].toFixed(0)}</text>`;
  }).join('');

  const xLabSvg=sorted.map((e,i)=>{
    let l=e.name.replace(/Deneme\s+/,'#').replace(/^(TYT|AYT-SAY|AYT-EA|AYT-SOZ)\s+/,'');
    if(l.length>7)l=l.slice(0,6)+'…';
    return `<text x="${xOf(i).toFixed(1)}" y="${(H-PB+14).toFixed(1)}" text-anchor="middle" font-size="9" fill="rgba(200,215,230,0.35)" font-family="system-ui,sans-serif">${esc(l)}</text>`;
  }).join('');

  const trendSvg=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${accent}" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
  </linearGradient></defs>
  ${gridSvg}
  <path d="${areaD}" fill="url(#${gid})"/>
  <polyline points="${linePts}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${dotsSvg}${xLabSvg}
</svg>`;

  return `<div class="card cp" style="margin-bottom:16px">
    <div style="font-size:11px;font-weight:700;margin-bottom:12px;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px">📊 Deneme Takibi</div>
    ${statHtml}
    <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Toplam Net Trendi · Son ${n} Deneme</div>
    ${trendSvg}
    <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin:16px 0 10px">Son Deneme · Derse Göre</div>
    ${subBarsHtml}
  </div>`;
}

function renderExams(){
  const el=document.getElementById('view-exams');
  const stu = S.students.find(s=>s.id===S.activeStuId);
  const exams=[...S.exams].filter(e=>e.studentId===S.activeStuId).sort((a,b)=>b.date.localeCompare(a.date));

  const chartHtml = _examChartHtml(exams, stu);

  const list=exams.length?exams.map(e=>{
    const fields=EXAM_DEFS[e.type]||[];
    const total=fields.reduce((s,f)=>s+Number(e.nets?.[f]||0),0).toFixed(1);
    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:14px;font-weight:700">${esc(e.name)}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${new Date(e.date+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-dim)">Toplam Net</div>
            <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:900;line-height:1">${total}</div>
          </div>
          <button class="btn btn-ghost btn-xs" onclick="openCommentModal('${e.id}')">💬 Yorumla</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${fields.map(f=>{
          const v=Number(e.nets?.[f]||0);
          const col=v>=20?'var(--green)':v>=12?'var(--accent)':'var(--red)';
          return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:8px 12px;min-width:70px;text-align:center">
            <div style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px">${f}</div>
            <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:${col}">${v}</div>
          </div>`;
        }).join('')}
      </div>
      ${puanCardHtml(e, exams)}
      ${e.note?`<div style="margin-top:10px;font-size:12px;color:var(--text-mid);font-style:italic">"${esc(e.note)}"</div>`:''}
      ${(()=>{
        if (!e.examDetails || !Object.keys(e.examDetails).length) return '';
        const rows = fields.map(ders => {
          const d = e.examDetails[ders];
          if (!d) return '';
          const net = Math.max(0,(d.dogru||0)-(d.yanlis||0)/4).toFixed(2);
          const wrongKonular = d.yanlis_konular||[];
          return `<div style="padding:6px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${wrongKonular.length?'5px':'0'}">
              <span style="font-size:11px;font-weight:700;color:var(--text-mid)">${esc(ders)}</span>
              <span style="font-size:11px;color:var(--text-dim)">D:<b style="color:var(--green)">${d.dogru||0}</b> Y:<b style="color:var(--red)">${d.yanlis||0}</b> B:<b>${d.bos||0}</b> · Net <b style="color:var(--accent)">${net}</b></span>
            </div>
            ${wrongKonular.length?`<div style="display:flex;flex-wrap:wrap;gap:3px">${wrongKonular.map(k=>`<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:rgba(255,92,122,.1);color:var(--red);border:1px solid rgba(255,92,122,.2)">${esc(k)}</span>`).join('')}</div>`:''}
          </div>`;
        }).filter(Boolean).join('');
        return rows ? `<div style="margin-top:10px;background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px 14px">
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📋 Ders Detayları</div>
          ${rows}
        </div>` : '';
      })()}
      ${e.coachComment?`<div style="margin-top:8px;background:var(--accent-dim);border:1px solid rgba(240,165,0,.2);border-radius:8px;padding:9px 12px;font-size:12px"><span style="font-weight:700;color:var(--accent)">Koç: </span>${esc(e.coachComment)}</div>`:''}
    </div>`;
  }).join(''):'<div class="empty"><p>Henüz deneme sonucu yok</p></div>';

  el.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${stu?esc(stu.name):'Öğrenci'}</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800">${stu?esc(stu.name)+'  — ':''} Denemeler</div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${exams.length} deneme kaydı</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openKonuRaporu('${S.activeStuId}')">📊 Konu Raporu</button>
      </div>
    </div>
    ${chartHtml}
    ${list}`;
}

let _krStuId = null;
let _krType = 'TYT';
const _krTypes = ['TYT', 'AYT-SAY', 'AYT-EA', 'AYT-SOZ'];

function _krRenderBody() {
  const allExams = S.exams.filter(e => e.studentId === _krStuId);
  const filtered = allExams.filter(e => e.type === _krType && e.examDetails && Object.keys(e.examDetails).length);

  const counts = {};
  filtered.forEach(e => {
    Object.entries(e.examDetails).forEach(([ders, d]) => {
      (d.yanlis_konular || []).forEach(k => {
        const key = ders + '§' + k;
        counts[key] = (counts[key] || 0) + 1;
      });
    });
  });

  const rows = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, cnt]) => {
      const [ders, konu] = key.split('§');
      const bar = Math.round((cnt / Math.max(filtered.length, 1)) * 100);
      const col = cnt >= 3 ? 'var(--red)' : cnt === 2 ? 'var(--accent)' : 'var(--text-mid)';
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-size:12px;color:var(--text-dim);white-space:nowrap">${esc(ders)}</td>
        <td style="padding:8px 10px;font-size:13px;font-weight:600">${esc(konu)}</td>
        <td style="padding:8px 10px;text-align:center">
          <span style="font-size:14px;font-weight:800;color:${col}">${cnt}</span>
          <span style="font-size:10px;color:var(--text-dim)">/${filtered.length}</span>
        </td>
        <td style="padding:8px 10px;min-width:90px">
          <div style="height:6px;border-radius:3px;background:var(--surface2);overflow:hidden">
            <div style="height:100%;width:${bar}%;background:${col};border-radius:3px;transition:width .3s"></div>
          </div>
        </td>
      </tr>`;
    });

  const tabs = _krTypes.map(t =>
    `<button onclick="window._krType='${t}';_krRenderBody()" style="padding:6px 14px;border-radius:20px;border:1px solid ${t===_krType?'var(--accent)':'var(--border)'};background:${t===_krType?'var(--accent-dim)':'transparent'};color:${t===_krType?'var(--accent)':'var(--text-dim)'};font-size:12px;cursor:pointer;font-weight:${t===_krType?700:400}">${t}</button>`
  ).join('');

  const tableHtml = rows.length
    ? `<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px">${filtered.length} denemeden derlendi · <b>${rows.length}</b> farklı yanlış konu · 🔴 ≥3 tekrar kritik</div>
       <div style="overflow-x:auto">
       <table style="width:100%;border-collapse:collapse">
         <thead><tr style="border-bottom:2px solid var(--border)">
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Ders</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Konu</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:center;text-transform:uppercase;letter-spacing:.5px">Tekrar</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Sıklık</th>
         </tr></thead>
         <tbody>${rows.join('')}</tbody>
       </table></div>`
    : `<div style="text-align:center;padding:40px;color:var(--text-dim);font-size:13px">${filtered.length ? 'Bu denemeler için henüz konu işaretlenmemiş.' : _krType + ' tipi deneme kaydı yok.'}</div>`;

  document.getElementById('konuRaporuBody').innerHTML = `
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${tabs}</div>
    ${tableHtml}`;
}
window._krRenderBody = _krRenderBody;

function openKonuRaporu(stuId) {
  _krStuId = stuId;
  const firstWithData = S.exams.find(e => e.studentId === stuId && e.examDetails && Object.keys(e.examDetails).length);
  _krType = firstWithData?.type || 'TYT';
  _krRenderBody();
  om('konuRaporuModal');
}
window.openKonuRaporu = openKonuRaporu;

function openCommentModal(examId){
  const e=S.exams.find(x=>x.id===examId);
  document.getElementById('cmExamId').value=examId;
  document.getElementById('cmText').value=e?.coachComment||'';
  om('commentModal');
}
async function saveComment(){
  const id=document.getElementById('cmExamId').value;
  const comment=document.getElementById('cmText').value.trim();
  await db.from('exams').update({coach_comment:comment}).eq('id',id);
  const e=S.exams.find(x=>x.id===id);
  if(e)e.coachComment=comment;
  cm('commentModal');renderExams();showToast('Yorum kaydedildi ✓');
}
async function deleteExam(id){if(!await customConfirm('Bu denemeyi silmek istediğinizden emin misiniz?'))return;await db.from('exams').delete().eq('id',id);S.exams=S.exams.filter(e=>e.id!==id);renderExams();showToast('Silindi');}

// ═══════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════
function renderMessages(){
  const el=document.getElementById('view-messages');
  el.innerHTML=`<div class="sh" style="margin-bottom:14px"><h2>Mesajlar</h2></div>
    <div class="msg-layout">
      <div class="msg-sidebar">
        <div class="msg-sidebar-hd">Öğrenciler</div>
        ${S.students.map(s=>{
          const thread=S.messages[s.id]||[];
          const last=thread[thread.length-1];
          const unread=thread.filter(m=>m.from==='student'&&!m.read).length;
          return `<div class="msg-contact ${S.msgThread===s.id?'active':''}" onclick="selectThread('${s.id}')">
            <div class="msg-contact-avatar" style="background:${s.color}">${s.name[0]}</div>
            <div style="flex:1;min-width:0">
              <div class="msg-contact-name">${esc(s.name.split(' ')[0])}</div>
              <div class="msg-contact-last">${last?esc(last.text.slice(0,35)):'Mesaj yok'}</div>
            </div>
            ${unread?`<span class="msg-unread">${unread}</span>`:''}
          </div>`;
        }).join('')}
      </div>
      <div class="msg-main" id="msgMain">
        ${S.msgThread?renderThreadHTML(S.msgThread,'coach'):'<div class="no-chat-sel">Öğrenci seçin</div>'}
      </div>
    </div>`;
  if(S.msgThread) scrollMsgs();
}

async function selectThread(stuId){
  S.msgThread=stuId;
  const unreadIds=(S.messages[stuId]||[]).filter(m=>m.from==='student'&&!m.read&&m._id).map(m=>m._id);
  if(unreadIds.length) await db.from('messages').update({read:true}).in('id',unreadIds);
  (S.messages[stuId]||[]).forEach(m=>{if(m.from==='student')m.read=true;});
  document.getElementById('msgMain').innerHTML=renderThreadHTML(stuId,'coach');
  document.querySelectorAll('.msg-contact').forEach(el=>el.classList.remove('active'));
  S.students.forEach((s,i)=>{if(s.id===stuId)document.querySelectorAll('.msg-contact')[i]?.classList.add('active');});
  scrollMsgs();
  // Realtime'ı bu thread için yeniden başlat
  initRealtime();
}

// pending image for message
let _msgPendingImg = null; // { file, previewUrl }

function renderThreadHTML(stuId, role){
  const stu = S.students.find(s=>s.id===stuId);
  const thread = S.messages[stuId] || [];
  const color = stu?.color || '#E8613A';

  const rows = thread.map(m => {
    const isOut = (role==='coach'&&m.from==='coach')||(role==='student'&&m.from==='student');
    const imgHtml = m.image_url
      ? `<img src="${esc(m.image_url)}" onclick="window.open('${esc(m.image_url)}','_blank')" />`
      : '';
    const textHtml = m.text ? esc(m.text) : '';
    const content = imgHtml + (imgHtml && textHtml ? `<div style="margin-top:5px">${textHtml}</div>` : textHtml);
    if (isOut) {
      return `<div class="msg-row out">
        <div class="msg-bubble out">${content}<div class="msg-bubble-time">${m.time}</div></div>
      </div>`;
    } else {
      return `<div class="msg-row in">
        <div class="msg-avatar-sm" style="background:${color}">${stu?.name[0]||'?'}</div>
        <div class="msg-bubble in">${content}<div class="msg-bubble-time">${m.time}</div></div>
      </div>`;
    }
  }).join('');

  return `<div class="msg-main-hd">
    <div class="msg-main-hd-avatar" style="background:${color}">${stu?.name[0]||'?'}</div>
    <div>
      <div class="msg-main-hd-name">${esc(stu?.name||'')}</div>
      <div class="msg-main-hd-status">● Çevrimiçi</div>
    </div>
  </div>
  <div class="msg-body" id="msgBody">${rows||'<div class="empty" style="margin-top:40px;text-align:center;color:var(--text-dim)">👋 Henüz mesaj yok</div>'}</div>
  <div id="msgImgPreview" style="display:none" class="msg-img-preview">
    <img id="msgImgThumb" src="" /><span id="msgImgName"></span>
    <span class="msg-img-remove" onclick="window._cancelMsgImg()">✕</span>
  </div>
  <div class="msg-input-area">
    <label class="msg-attach-btn" title="Fotoğraf gönder">
      📎<input type="file" accept="image/*,application/pdf" style="display:none" onchange="window._pickMsgImg(this,'${stuId}','${role}')">
    </label>
    <textarea class="msg-input" id="msgInput" placeholder="Mesaj yaz..." rows="1"
      onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg('${stuId}','${role}');}"
      oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,110)+'px'"
      onpaste="window._handleMsgPaste(event,'${stuId}','${role}')"></textarea>
    <button class="msg-send-btn" onclick="sendMsg('${stuId}','${role}')">
      <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
    </button>
  </div>`;
}

window._pickMsgImg = function(inp, stuId, role) {
  const file = inp.files[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Dosya max 5 MB olabilir'); inp.value=''; return; }
  _msgPendingImg = { file };
  const preview = document.getElementById('msgImgPreview');
  const thumb = document.getElementById('msgImgThumb');
  const name = document.getElementById('msgImgName');
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => { thumb.src = e.target.result; thumb.style.display='block'; };
    reader.readAsDataURL(file);
  } else { thumb.style.display='none'; }
  name.textContent = file.name;
  preview.style.display = 'flex';
  inp.value = '';
};
window._cancelMsgImg = function() {
  _msgPendingImg = null;
  document.getElementById('msgImgPreview').style.display = 'none';
};

window._handleMsgPaste = function(event, stuId, role) {
  const items = event.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      event.preventDefault();
      const file = item.getAsFile();
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { showToast('Dosya max 5 MB olabilir'); return; }
      _msgPendingImg = { file };
      const reader = new FileReader();
      reader.onload = e => {
        const preview = document.getElementById('msgImgPreview');
        const thumb = document.getElementById('msgImgThumb');
        const name = document.getElementById('msgImgName');
        thumb.src = e.target.result; thumb.style.display = 'block';
        name.textContent = 'Yapıştırılan görsel';
        if (preview) preview.style.display = 'flex';
      };
      reader.readAsDataURL(file);
      return;
    }
  }
};

async function sendMsg(stuId, role){
  const inp = document.getElementById('msgInput');
  const text = inp.value.trim();
  if (!text && !_msgPendingImg) return;

  const coachId = session.coachId || S.students.find(s=>s.id===stuId)?.coachId || S.students.find(s=>s.id===session.studentId)?.coachId;

  let image_url = null;
  if (_msgPendingImg) {
    const file = _msgPendingImg.file;
    const ext = file.name.split('.').pop();
    const path = `${stuId}/${Date.now()}.${ext}`;
    const { error: upErr } = await db.storage.from('chat_images').upload(path, file, { upsert: true });
    if (upErr) { showToast('Görsel yüklenemedi: ' + upErr.message); return; }
    const { data: urlData } = db.storage.from('chat_images').getPublicUrl(path);
    image_url = urlData.publicUrl;
    _msgPendingImg = null;
    document.getElementById('msgImgPreview').style.display = 'none';
  }

  const { data, error } = await db.from('messages').insert({
    student_id: stuId, coach_id: coachId, from_role: role,
    text: text || null, image_url, read: false
  }).select().single();
  if (error) { showToast('Hata: ' + error.message); return; }

  if (!S.messages[stuId]) S.messages[stuId] = [];
  S.messages[stuId].push({
    _id: data.id, from: role, text: text || '', image_url,
    time: new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}), read: false
  });
  inp.value = ''; inp.style.height = 'auto';
  if (currentTab==='messages')   { document.getElementById('msgMain').innerHTML=renderThreadHTML(stuId,'coach');   scrollMsgs(); }
  if (currentTab==='smessages')  { document.getElementById('msgMain').innerHTML=renderThreadHTML(stuId,'student'); scrollMsgs(); }
}
function scrollMsgs(){setTimeout(()=>{const b=document.getElementById('msgBody');if(b)b.scrollTop=b.scrollHeight;},60);}

// ═══════════════════════════════════════════════
// STUDENT PORTAL
// ═══════════════════════════════════════════════
function renderPortal(){
  const el=document.getElementById('view-portal');
  if(!el) return;

  // Öğrenciyi bul — önce studentId ile, yoksa activeStuId ile
  let stu = S.students.find(s=>s.id===session.studentId);
  if(!stu && S.students.length > 0) stu = S.students[0];

  if(!stu){
    el.innerHTML=`<div style="text-align:center;padding:60px 20px;color:var(--text-mid)">
      <div style="font-size:36px;margin-bottom:12px">⏳</div>
      <p style="font-size:14px">Profil yükleniyor...</p>
    </div>`;
    setTimeout(()=>{ if(S.students.length) renderPortal(); }, 800);
    return;
  }

  // studentId'yi güncelle
  if(!session.studentId) session.studentId = stu.id;
  S.activeStuId = stu.id;
  const today=todayStr();
  const key=`${stu.id}_${today}`;
  const todayTasks=S.tasks[key]||[];
  const doneTasks=todayTasks.filter(t=>t.done).length;
  const nextAppt=S.appointments.filter(a=>a.studentId===stu.id&&a.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const unread=(S.messages[stu.id]||[]).filter(m=>m.from==='coach'&&!m.read).length;

  // Tekrar gereken konular
  const stuMastery = S.konuMastery?.[stu.id] || {};
  const tekrarGereken = [];
  const now30 = new Date();
  now30.setDate(now30.getDate() - 30);
  Object.entries(stuMastery).forEach(([subject, konular]) => {
    Object.entries(konular).forEach(([konu, m]) => {
      if (m.status === 'td') return; // TD olanları gösterme
      if (m.status === 'not_started') return;
      const lastReview = m.last_review_date ? new Date(m.last_review_date) : null;
      const daysSince = lastReview ? Math.floor((Date.now() - lastReview.getTime()) / 86400000) : 999;
      const isUrgent = m.stars <= 2;
      const isOverdue = daysSince > 20;
      if (isUrgent || isOverdue) {
        tekrarGereken.push({ konu, subject, stars: m.stars, daysSince });
      }
    });
  });
  tekrarGereken.sort((a, b) => a.stars - b.stars || b.daysSince - a.daysSince);

  const tekrarKartHTML = tekrarGereken.length > 0 ? `
    <div class="card cp" style="border-color:rgba(239,68,68,.3)">
      <div class="portal-sec-title">🔄 Tekrar Gereken Konular <span style="font-size:11px;background:rgba(239,68,68,.12);color:#ef4444;padding:2px 8px;border-radius:99px;font-weight:700">${tekrarGereken.length}</span></div>
      ${tekrarGereken.slice(0, 5).map(t => {
        const lv = MASTERY_LEVELS[t.stars];
        const daysText = t.daysSince < 999 ? `${t.daysSince}g önce` : 'Hiç';
        return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:13px;color:${lv.color};font-weight:800;white-space:nowrap">${'⭐'.repeat(t.stars) || '○'}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(t.konu)}</div>
            <div style="font-size:10px;color:var(--text-dim)">${esc(t.subject)} · Son: ${t.daysSince < 999 ? t.daysSince + 'g önce' : 'Hiç'}</div>
          </div>
        </div>`;
      }).join('')}
      ${tekrarGereken.length > 5 ? `<div style="font-size:11px;color:var(--text-dim);margin-top:8px;text-align:center">+${tekrarGereken.length - 5} daha…</div>` : ''}
    </div>` : '';

  el.innerHTML=`
    <div class="portal-hero">
      <div class="portal-avatar" style="background:${stu.color}">${stu.name[0]}</div>
      <div class="portal-info">
        <h1>Merhaba, ${esc(stu.name.split(' ')[0])}! 👋</h1>
        <p>${esc(stu.target)} · ${new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</p>
      </div>
    </div>
    <div class="portal-grid">
      <div class="card cp">
        <div class="portal-sec-title">📋 Bugünün Görevleri</div>
        ${todayTasks.length?`
          ${todayTasks.map((t,i)=>`
            <div data-task-id="${t._id}" class="task-card task-${t.type} ${t.done?'done':''}" style="margin-bottom:6px">
              <div class="tc-check ${t.done?'on':''}" onclick="stuToggleTask('${today}',${i})"></div>
              <div class="tc-body">
                <div class="tc-type">${typeLabel(t.type)}${t.exam?' · '+t.exam:''}</div>
                <div class="tc-subject">${esc(t.subject)}</div>
                <div class="tc-meta">${t.duration} dk${t.note?' · '+esc(t.note):''}</div>
              </div>
            </div>`).join('')}
          <div style="margin-top:8px;font-size:12px;color:var(--text-mid)">${doneTasks}/${todayTasks.length} tamamlandı</div>
        `:'<div class="empty"><p>Bugün için görev atanmamış</p></div>'}
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="card cp">
          <div class="portal-sec-title">📈 İlerleme</div>
          <div style="font-family:'Inter',sans-serif;font-size:36px;font-weight:800;color:${stu.color};margin-bottom:6px">%${stu.progress}</div>
          <div class="prog-bar-wrap"><div class="prog-bar" style="width:${stu.progress}%;background:${stu.color}"></div></div>
        </div>
        <div class="card cp">
          <div class="portal-sec-title">📅 Sonraki Randevu</div>
          ${nextAppt?`<div style="font-size:12px;color:var(--text-mid);margin-bottom:3px">${new Date(nextAppt.date+'T12:00').toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</div>
          <div style="font-family:'Inter',sans-serif;font-size:20px;font-weight:700">${nextAppt.time}</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:3px">${esc(nextAppt.type)} · ${nextAppt.duration} dk</div>`
          :'<div style="font-size:13px;color:var(--text-dim)">Yaklaşan randevu yok</div>'}
        </div>
        ${unread>0?`<div class="card cp" style="border-color:var(--accent);cursor:pointer" onclick="switchTab('smessages')">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">💬</span>
            <div><div style="font-weight:700">${unread} yeni mesaj</div><div style="font-size:12px;color:var(--text-mid)">Koçundan</div></div>
          </div>
        </div>`:''}
        ${tekrarKartHTML}
      </div>
    </div>`;
}

async function stuToggleTask(ds,idx){
  const stu=S.students.find(s=>s.id===session.studentId);if(!stu)return;
  const key=`${stu.id}_${ds}`;
  const t=S.tasks[key]?.[idx]; if(!t)return;
  const newDone=!t.done;
  await db.from('tasks').update({done:newDone}).eq('id',t._id);
  t.done=newDone; renderPortal();
}

// ═══════════════════════════════════════════════
// STUDENT PROGRAM VIEW
// ═══════════════════════════════════════════════
function renderSPortal(){
  const stu=S.students.find(s=>s.id===session.studentId);if(!stu)return;
  const el=document.getElementById('view-sportal');
  const ws=stu.weekStart??0;
  const wStart=getWeekStart(S.weekOffset,ws);
  const wEnd=addDays(wStart,6);
  const today=todayStr();
  const progMode = localStorage.getItem('ra_program_mode') || 'weekly';

  let dayCards='';
  for(let i=0;i<7;i++){
    const d=addDays(wStart,i);const ds=fmtDate(d);const isToday=ds===today;
    const key=`${stu.id}_${ds}`;const tasks=S.tasks[key]||[];
    const totalMin=tasks.reduce((s,t)=>s+Number(t.duration),0);
    const doneMin=tasks.reduce((s,t)=>s+(t.done?Number(t.duration):0),0);
    const dayLabel=DAYS_TR[(ws+i)%7];

    // Saatlik moda göre sırala
    const sortedTasks = [...tasks];
    if (progMode === 'hourly') {
      sortedTasks.sort((a, b) => {
        if (a.start_time && !b.start_time) return -1;
        if (!a.start_time && b.start_time) return 1;
        if (a.start_time && b.start_time) return a.start_time.localeCompare(b.start_time);
        return 0;
      });
    }

    const taskHtml=sortedTasks.map((t)=> {
      const ti = tasks.indexOf(t);
      const timeBadge = t.start_time ? `<div class="tc-time-badge">🕒 ${t.start_time}</div>` : '';
      return `
        <div data-task-id="${t._id}" class="task-card task-${t.type} ${t.done?'done':''} ${t.start_time?'hourly-card':''}" onclick="openTaskDetail('${ds}',${ti},'student')" style="cursor:pointer">
          <div class="tc-check ${t.done?'on':''}" onclick="event.stopPropagation();stuToggleTask2('${ds}',${ti})"></div>
          <div class="tc-body">
            ${timeBadge}
            <div class="tc-type">${typeLabel(t.type)}${t.exam?' · '+t.exam:''}</div>
            <div class="tc-subject">${esc(t.subject)}</div>
            <div class="tc-meta">${t.duration} dk</div>
          </div>
        </div>`;
    }).join('');

    const shortDay = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][(ws+i)%7];
    dayCards+=`<div class="day-col ${isToday?'today':''}">
      <div class="day-hd">
        <div><div class="day-name-lbl">${shortDay}</div><div class="day-num">${d.getDate()}</div></div>
        <span class="day-badge" style="font-size:8.5px">${formatMinToHours(doneMin)} / ${formatMinToHours(totalMin)}</span>
      </div>
      <div class="day-tasks-list">${taskHtml||'<div class="empty" style="padding:8px 0"><p style="font-size:11px">Görev yok</p></div>'}</div>
    </div>`;
  }
  el.innerHTML=`
    <div class="week-nav" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn btn-ghost btn-sm" onclick="chWeekS(-1)">← Önceki</button>
        <span class="week-lbl">${wStart.getDate()} ${MONTHS_TR[wStart.getMonth()]} — ${wEnd.getDate()} ${MONTHS_TR[wEnd.getMonth()]} ${wEnd.getFullYear()}</span>
        <button class="btn btn-ghost btn-sm" onclick="chWeekS(1)">Sonraki →</button>
        <button class="btn btn-ghost btn-sm" onclick="S.weekOffset=0;saveUI();renderSPortal()">Bugün</button>
      </div>

      <!-- Program Görünüm Seçici Toggle -->
      <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;gap:4px">
        <button class="btn btn-xs ${progMode==='weekly'?'btn-accent':'btn-ghost'}" onclick="setProgramMode('weekly')" style="padding:4px 10px;font-size:11px;font-weight:700;border-radius:8px">📋 Günlük Serbest</button>
        <button class="btn btn-xs ${progMode==='hourly'?'btn-accent':'btn-ghost'}" onclick="setProgramMode('hourly')" style="padding:4px 10px;font-size:11px;font-weight:700;border-radius:8px">🕒 Saatlik Düzen</button>
      </div>
    </div>
    <div class="week-grid">${dayCards}</div>`;
}

async function stuToggleTask2(ds,idx){
  const stu=S.students.find(s=>s.id===session.studentId);if(!stu)return;
  const key=`${stu.id}_${ds}`;
  const t=S.tasks[key]?.[idx]; if(!t)return;
  const newDone=!t.done;
  await db.from('tasks').update({done:newDone}).eq('id',t._id);
  t.done=newDone; renderSPortal();
}
function chWeekS(d){S.weekOffset+=d;saveUI();renderSPortal();}

// ── GÖREV GERİ BİLDİRİM YARDIMCI FONKSİYONLARI ──────────────────
let _feedbackDraft = {};

window._fbChip = function(field, val, el) {
  _feedbackDraft[field] = isNaN(val) ? val : Number(val);
  el.parentElement.querySelectorAll('[data-fb-val]').forEach(b => {
    const on = b.dataset.fbVal == val;
    b.style.background  = on ? b.dataset.fbBg    : 'var(--surface2)';
    b.style.borderColor = on ? b.dataset.fbColor  : 'var(--border)';
    b.style.color       = on ? b.dataset.fbColor  : 'var(--text-mid)';
    b.style.fontWeight  = on ? '700' : '600';
  });
  if (field === 'status') {
    const s = document.getElementById('fbBlockerSection');
    if (s) s.style.display = val === 'completed' ? 'none' : 'block';
  }
};

window._fbStar = function(n) {
  _feedbackDraft.focus = n;
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById('fbStar' + i);
    if (el) { el.textContent = i <= n ? '★' : '☆'; el.style.color = i <= n ? '#f0a500' : 'var(--text-dim)'; }
  }
};

function _fbStudentHtml(t) {
  const fb  = t.student_feedback || {};
  const st  = fb.status || (t.done ? 'completed' : '');
  const th  = fb.time_spent != null ? Math.floor(fb.time_spent / 60) : '';
  const tm  = fb.time_spent != null ? fb.time_spent % 60 : '';
  const fc  = fb.focus      || 0;
  const df  = fb.difficulty || 0;
  const bl  = fb.blocker    || '';
  _feedbackDraft = { status: st || null, focus: fc, difficulty: df, blocker: bl };

  const STATUS = [
    { v:'completed', l:'✓ Tamamladım', c:'#3ecf8e', bg:'rgba(62,207,142,.12)' },
    { v:'partial',   l:'~ Kısmen',     c:'#f0a500', bg:'rgba(240,165,0,.12)'  },
    { v:'failed',    l:'✕ Yapamadım',  c:'#ef4444', bg:'rgba(239,68,68,.12)'  },
  ];
  const DIFF = [
    { v:1, l:'Çok Kolay', c:'#3ecf8e', bg:'rgba(62,207,142,.1)'  },
    { v:2, l:'Kolay',     c:'#86efac', bg:'rgba(134,239,172,.1)' },
    { v:3, l:'Orta',      c:'#f0a500', bg:'rgba(240,165,0,.1)'   },
    { v:4, l:'Zor',       c:'#fb923c', bg:'rgba(251,146,60,.1)'  },
    { v:5, l:'Çok Zor',   c:'#ef4444', bg:'rgba(239,68,68,.1)'   },
  ];
  const BLOCK = [
    { v:'time',  l:'Zamanım yetmedi'          },
    { v:'topic', l:'Konuyu anlamadım'          },
    { v:'hard',  l:'Kaynak çok zordu'          },
    { v:'moti',  l:'İstek/motivasyonum yoktu'  },
  ];

  return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px 16px;margin-bottom:14px">

    <div style="margin-bottom:14px">
      <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Tamamlanma Durumu</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
        ${STATUS.map(s=>`<button onclick="window._fbChip('status','${s.v}',this)" data-fb-val="${s.v}" data-fb-color="${s.c}" data-fb-bg="${s.bg}"
          style="padding:9px 4px;border-radius:9px;border:1.5px solid ${st===s.v?s.c:'var(--border)'};background:${st===s.v?s.bg:'var(--surface2)'};color:${st===s.v?s.c:'var(--text-mid)'};font-size:12px;font-weight:${st===s.v?'700':'600'};cursor:pointer;transition:all .15s">${esc(s.l)}</button>`).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">⏱ Süre</div>
        <div style="display:flex;gap:5px;align-items:center">
          <input id="fbHour" type="number" min="0" max="23" placeholder="0" value="${th}"
            style="width:44px;padding:8px 4px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-weight:700;text-align:center"
            oninput="if(this.value>23)this.value=23">
          <span style="font-size:11px;color:var(--text-dim)">sa</span>
          <input id="fbMin" type="number" min="0" max="59" placeholder="0" value="${tm}"
            style="width:44px;padding:8px 4px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-weight:700;text-align:center"
            oninput="if(this.value>59)this.value=59">
          <span style="font-size:11px;color:var(--text-dim)">dk</span>
        </div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">🎯 Odaklanma</div>
        <div style="display:flex;gap:2px;padding-top:2px">
          ${[1,2,3,4,5].map(i=>`<span id="fbStar${i}" onclick="window._fbStar(${i})" style="font-size:24px;cursor:pointer;color:${i<=fc?'#f0a500':'var(--text-dim)'};transition:color .1s">${i<=fc?'★':'☆'}</span>`).join('')}
        </div>
      </div>
    </div>

    <div style="margin-bottom:14px">
      <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📊 Zorluk</div>
      <div style="display:flex;gap:4px">
        ${DIFF.map(d=>`<button onclick="window._fbChip('difficulty',${d.v},this)" data-fb-val="${d.v}" data-fb-color="${d.c}" data-fb-bg="${d.bg}"
          style="flex:1;padding:7px 3px;border-radius:8px;border:1.5px solid ${df===d.v?d.c:'var(--border)'};background:${df===d.v?d.bg:'var(--surface2)'};color:${df===d.v?d.c:'var(--text-mid)'};font-size:10px;font-weight:${df===d.v?'700':'600'};cursor:pointer;transition:all .15s;text-align:center">${esc(d.l)}</button>`).join('')}
      </div>
    </div>

    <div id="fbBlockerSection" style="display:${st && st!=='completed'?'block':'none'}">
      <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Neden Yapamadın?</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${BLOCK.map(b=>`<button onclick="window._fbChip('blocker','${b.v}',this)" data-fb-val="${b.v}" data-fb-color="#fb923c" data-fb-bg="rgba(251,146,60,.1)"
          style="padding:6px 11px;border-radius:8px;border:1.5px solid ${bl===b.v?'#fb923c':'var(--border)'};background:${bl===b.v?'rgba(251,146,60,.1)':'var(--surface2)'};color:${bl===b.v?'#fb923c':'var(--text-mid)'};font-size:11px;font-weight:${bl===b.v?'700':'600'};cursor:pointer;transition:all .15s">${esc(b.l)}</button>`).join('')}
      </div>
    </div>

  </div>`;
}

function _fbCoachHtml(t) {
  const fb = t.student_feedback || {};
  const hasFb = fb.status || fb.focus || fb.difficulty || (fb.time_spent > 0) || fb.blocker;
  if (!hasFb) return '';

  const SI = {
    completed: { l:'Tamamladı',        c:'#3ecf8e', bg:'rgba(62,207,142,.1)' },
    partial:   { l:'Kısmen Tamamladı', c:'#f0a500', bg:'rgba(240,165,0,.1)'  },
    failed:    { l:'Yapamadı',          c:'#ef4444', bg:'rgba(239,68,68,.1)'  },
  };
  const DL = {1:'Çok Kolay',2:'Kolay',3:'Orta',4:'Zor',5:'Çok Zor'};
  const BL = {time:'Zamanı yetmedi',topic:'Konuyu anlayamadı',hard:'Kaynak çok zordu',moti:'Motivasyon yok'};
  const si      = SI[fb.status];
  const t_s     = fb.time_spent;
  const timeStr = t_s > 0 ? (Math.floor(t_s/60)>0?Math.floor(t_s/60)+'sa ':'') + (t_s%60>0?t_s%60+'dk':'') : null;
  const stars   = fb.focus ? '★'.repeat(fb.focus)+'☆'.repeat(5-fb.focus) : null;

  const DIFF_C = {1:'#3ecf8e',2:'#86efac',3:'#f0a500',4:'#fb923c',5:'#ef4444'};
  const dc = fb.difficulty ? DIFF_C[fb.difficulty] : 'var(--text-mid)';

  return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:12px 16px;margin-bottom:14px">
    <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">💬 Geri Bildirim</div>

    <!-- Satır 1: durum + süre -->
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
      ${si?`<span style="padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;background:${si.bg};color:${si.c};border:1px solid ${si.c}33">${si.l}</span>`:''}
      ${timeStr?`<span style="padding:4px 12px;border-radius:20px;font-size:12px;background:var(--surface);border:1px solid var(--border);color:var(--text-mid)">⏱ ${timeStr}</span>`:''}
    </div>

    <!-- Satır 2: odaklanma + zorluk -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:${fb.blocker?'10px':'0'}">
      ${stars?`<div style="background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:7px 10px">
        <div style="font-size:9px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">🎯 Odaklanma</div>
        <div style="font-size:16px;color:#f0a500;letter-spacing:1px">${stars}</div>
      </div>`:''}
      ${fb.difficulty?`<div style="background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:7px 10px">
        <div style="font-size:9px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">📊 Zorluk</div>
        <div style="font-size:13px;font-weight:700;color:${dc}">${DL[fb.difficulty]||''}</div>
      </div>`:''}
    </div>

    ${fb.blocker?`<div style="font-size:12px;color:var(--text-mid)">Neden: <b style="color:#fb923c">${BL[fb.blocker]||fb.blocker}</b></div>`:''}
  </div>`;
}

// ── GÖREV DETAY MODALI ──────────────────────────
async function openTaskDetail(ds, idx, role){
  const stuId = session.role==='student' ? session.studentId : S.activeStuId;
  const key = `${stuId}_${ds}`;
  const t = S.tasks[key]?.[idx];
  if(!t) return;

  // Koç görüntüsünde öğrencinin en güncel verisini çek
  if (role === 'coach' && t._id) {
    const { data: fresh } = await db.from('tasks').select('*').eq('id', t._id).single();
    if (fresh) {
      t.done             = fresh.done;
      t.student_note     = fresh.student_note     || '';
      t.student_result   = fresh.student_result   || null;
      t.student_feedback = fresh.student_feedback || null;
    }
  }

  let modal = document.getElementById('taskDetailModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'taskDetailModal';
    modal.className = 'modal-bg';
    document.body.appendChild(modal);
    modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open'); });
  }

  const typeColors = {soru:'var(--blue)',konu:'#c084fc',deneme:'var(--accent)',diger:'var(--text-mid)'};
  const typeLabels2 = {soru:'Soru Bankası',konu:'Konu Anlatımı',deneme:'Deneme',diger:'Diğer'};
  const col = typeColors[t.type]||'var(--accent)';
  const isVideo = t.type==='konu';
  const items = t.task_items || [];

  // Test/video listesi HTML
  let itemsHtml = '';
  if(items.length > 0){
    itemsHtml = `<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${isVideo?'Videolar':'Testler'} (${items.length})</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden;max-height:200px;overflow-y:auto">
        ${items.map((item,i)=>`
          <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--border);${i===items.length-1?'border-bottom:none':''};cursor:${role==='coach'?'default':'pointer'};transition:background .1s"
            ${role==='coach'?'':`onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''"`}>
            <input type="checkbox" ${item.done?'checked':''} ${role==='coach'?'disabled':''} onchange="toggleDetailItem('${ds}',${idx},${i},'${role}')"
              style="width:16px;height:16px;accent-color:var(--accent);cursor:${role==='coach'?'default':'pointer'};flex-shrink:0;">
            <div style="width:20px;height:20px;border-radius:6px;background:${col}22;color:${col};font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:4px">${i+1}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;line-height:1.4;${item.done?'text-decoration:line-through;color:var(--text-dim);':''}">${esc(item.label||(`Ders ${i+1}`))}</div>
              <div style="font-size:11px;color:var(--text-mid);margin-top:2px">⏱ ${item.soru>0?(isVideo?item.soru+' dk':item.soru+' soru'):'?'}</div>
            </div>
            ${item.url?`<a href="${esc(item.url)}" target="_blank" onclick="event.stopPropagation()"
              style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:6px 12px;border-radius:8px;text-decoration:none;flex-shrink:0;white-space:nowrap">▶ İzle</a>`:''}
          </label>`).join('')}
      </div>
    </div>`;
  } else if(t.note && (t.note.includes('test:') || t.note.includes('video:'))){
    itemsHtml = `<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${isVideo?'Videolar':'Testler'}</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--text-mid)">${esc(t.note)}</div>
    </div>`;
  }

  modal.innerHTML = `<div class="modal">
    <button class="modal-close" onclick="cm('taskDetailModal')">×</button>

    <!-- Görev başlık -->
    <div style="border-left:3px solid ${col};padding-left:12px;margin-bottom:20px">
      <div style="font-size:10px;font-weight:700;color:${col};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${typeLabels2[t.type]||t.type}${t.exam?' · '+t.exam:''}</div>
      <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;line-height:1.2">${esc(t.subject)}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:4px">${new Date(ds+'T12:00').toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</div>
    </div>

    <!-- Geri bildirim: öğrenci=form, koç=özet+durum -->
    ${role==='student' ? _fbStudentHtml(t) : `
    <div style="background:var(--surface2);border:1.5px solid ${t.done?'var(--green)':'var(--border)'};border-radius:11px;padding:12px 16px;display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div style="width:20px;height:20px;border-radius:5px;background:${t.done?'var(--green)':'transparent'};border:2px solid ${t.done?'var(--green)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">${t.done?'✓':''}</div>
      <div style="font-size:13px;font-weight:700;color:${t.done?'var(--green)':'var(--text-dim)'}">${t.done?'Tamamlandı':'Henüz tamamlanmadı'}</div>
    </div>
    ${_fbCoachHtml(t)}`}

    <!-- Test/Video listesi -->
    ${itemsHtml}

    <!-- Sonuç Gir (soru/deneme türleri için) -->
    ${(t.type==='soru'||t.type==='deneme') ? `
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px 16px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">📊 Sonucu Gir</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--green);margin-bottom:4px">✓ Doğru</div>
          <input type="number" id="tdDogru" min="0" value="${t.student_result?.dogru??''}" placeholder="0" ${role==='coach'?'disabled':''}
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--red);margin-bottom:4px">✗ Yanlış</div>
          <input type="number" id="tdYanlis" min="0" value="${t.student_result?.yanlis??''}" placeholder="0" ${role==='coach'?'disabled':''}
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);margin-bottom:4px">— Boş</div>
          <input type="number" id="tdBos" min="0" value="${t.student_result?.bos??''}" placeholder="0" ${role==='coach'?'disabled':''}
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
      </div>
      ${t.student_result ? `<div style="font-size:11px;color:var(--text-dim);margin-top:8px;text-align:right">Son güncelleme: ${new Date(t.student_result.ts||Date.now()).toLocaleDateString('tr-TR')}</div>` : ''}
    </div>
    ${(()=>{
      const konular = _getKonular(t.exam, t.subject);
      if (!konular) return '';
      _wrongTopics = [...(t.student_result?.yanlis_konular||[])];
      return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px 16px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">📌 Yanlış Konular</div>
        <div style="display:flex;flex-wrap:wrap;gap:0">${konular.map(k=>{
          const sel = _wrongTopics.includes(k);
          return `<span ${role==='coach'?'':`onclick="toggleKonuChip(this,'${k.replace(/'/g,"\\'")}')"`}
            style="display:inline-block;padding:5px 11px;margin:3px;border-radius:20px;font-size:11px;font-weight:600;cursor:${role==='coach'?'default':'pointer'};user-select:none;border:1px solid ${sel?'var(--red)':'var(--border)'};background:${sel?'rgba(255,92,122,.12)':'var(--surface)'};color:${sel?'var(--red)':'var(--text-mid)'}">
            ${esc(k)}</span>`;
        }).join('')}</div>
      </div>`;
    })()}
    ` : ''}

    <!-- Not -->
    <div class="field">
      <label>${role==='student'?'Koçuma Not':'Öğrenci Notu'}</label>
      <textarea id="tdNote" placeholder="${role==='student'?'Koçuna iletmek istediğin bir şey var mı?':'—'}" style="min-height:60px" ${role==='coach'?'disabled':''}>${t.student_note||''}</textarea>
    </div>

    <div style="display:flex; gap:10px; margin-top:12px">
      ${role==='coach' 
        ? `<button class="btn btn-ghost" style="flex:1; justify-content:center; padding:12px; font-weight:700;" onclick="cm('taskDetailModal'); openCoachTaskEdit('${ds}',${idx})">⚙ Düzenle</button>
           <button class="btn btn-accent" style="flex:2; justify-content:center; padding:12px; font-weight:700;" onclick="cm('taskDetailModal')">Kapat</button>` 
        : `<button class="btn btn-accent" style="flex:1; justify-content:center; padding:12px; font-weight:700;" onclick="saveTaskDetail('${ds}',${idx},'${role}')">Kaydet</button>`
      }
    </div>
  </div>`;

  om('taskDetailModal');
}

async function toggleTaskDetail(ds, idx, role){
  if(role==='coach') return;
  const stuId = session.role==='student' ? session.studentId : S.activeStuId;
  const key = `${stuId}_${ds}`;
  const t = S.tasks[key]?.[idx]; if(!t) return;
  t.done = !t.done;
  
  // Eğer görevin alt öğeleri varsa, tüm alt öğeleri de işaretle
  if(t.task_items && Array.isArray(t.task_items)){
    t.task_items.forEach(item => { item.done = t.done; });
  }
  
  await db.from('tasks').update({done:t.done, task_items: t.task_items || null}).eq('id',t._id);
  openTaskDetail(ds, idx, role); // Modali yenile
  if(role==='student') renderSPortal(); else renderProgram();
}

async function toggleDetailItem(ds, idx, itemIdx, role){
  if(role==='coach') return;
  const stuId = session.role==='student' ? session.studentId : S.activeStuId;
  const key = `${stuId}_${ds}`;
  const t = S.tasks[key]?.[idx]; if(!t || !t.task_items) return;
  
  t.task_items[itemIdx].done = !t.task_items[itemIdx].done;
  const allDone = t.task_items.every(item => item.done);
  t.done = allDone;
  
  showLoading(true);
  await db.from('tasks').update({task_items: t.task_items, done: t.done}).eq('id', t._id);
  showLoading(false);
  
  openTaskDetail(ds, idx, role);
  if(role==='student') renderSPortal(); else renderProgram();
  showToast('İlerleme kaydedildi ✓');
}

function selectVideoSpeed(btn, speed){
  // Butonları güncelle
  btn.closest('div').querySelectorAll('button[data-speed]').forEach(b=>{
    const isSelected = b.dataset.speed === speed;
    b.style.borderColor = isSelected?'var(--accent)':'var(--border)';
    b.style.background = isSelected?'var(--accent-dim)':'var(--surface2)';
    b.style.color = isSelected?'var(--accent)':'var(--text-mid)';
  });
  document.getElementById('tdSpeed').value = speed;
  // Süre hesapla
  const speedNum = parseFloat(speed);
  const calcEl = document.getElementById('speedCalc');
  if(calcEl){
    const totalMin = parseInt(calcEl.closest('[id=speedInfo]')?.textContent?.match(/Toplam (\d+) dk/)?.[1]||0);
    calcEl.textContent = Math.ceil(totalMin/speedNum) + ' dk';
    // Süreyi de güncelle
    document.getElementById('tdDuration').value = Math.ceil(totalMin/speedNum);
  }
}

async function saveTaskDetail(ds, idx, role){
  if(role==='coach') return;
  const stuId = session.role==='student' ? session.studentId : S.activeStuId;
  const key = `${stuId}_${ds}`;
  const t = S.tasks[key]?.[idx]; if(!t) return;
  const note = document.getElementById('tdNote')?.value.trim() || '';

  const updatePayload = { student_note: note };

  // Geri bildirim alanlarını kaydet
  const fbH = parseInt(document.getElementById('fbHour')?.value) || 0;
  const fbM = parseInt(document.getElementById('fbMin')?.value)  || 0;
  const fbTime = fbH * 60 + fbM;
  const fb = {
    status:     _feedbackDraft.status     || null,
    time_spent: fbTime > 0 ? fbTime : (t.student_feedback?.time_spent || null),
    focus:      _feedbackDraft.focus      || null,
    difficulty: _feedbackDraft.difficulty || null,
    blocker:    _feedbackDraft.blocker    || null,
  };
  if (fb.status || fb.focus || fb.difficulty || fbTime > 0) {
    updatePayload.student_feedback = fb;
    t.student_feedback = fb;
    if (fb.status) {
      updatePayload.done = fb.status !== 'failed';
      t.done = updatePayload.done;
    }
  }

  const dogEl = document.getElementById('tdDogru');
  const yanEl = document.getElementById('tdYanlis');
  const bosEl = document.getElementById('tdBos');
  if (dogEl !== null) {
    const dogru = parseInt(dogEl.value) || 0;
    const yanlis = parseInt(yanEl.value) || 0;
    const bos = parseInt(bosEl.value) || 0;
    if (dogru > 0 || yanlis > 0 || bos > 0 || _wrongTopics.length > 0) {
      updatePayload.student_result = {
        dogru, yanlis, bos,
        yanlis_konular: [..._wrongTopics],
        ts: new Date().toISOString()
      };
      t.student_result = updatePayload.student_result;
    }
  }

  if (!t._id) { showToast('Hata: görev ID bulunamadı'); return; }
  const { error: saveErr } = await db.from('tasks').update(updatePayload).eq('id', t._id);
  if (saveErr) { showToast('Kaydetme hatası: ' + saveErr.message); console.error('saveTaskDetail error', saveErr, updatePayload); return; }
  t.student_note = note;
  cm('taskDetailModal');
  showToast('Kaydedildi ✓');
  if(role==='student') renderSPortal(); else renderProgram();
}

// ═══════════════════════════════════════════════
// STUDENT EXAMS VIEW (enter exams)
// ═══════════════════════════════════════════════
function renderSExams(){
  const stu=S.students.find(s=>s.id===session.studentId);if(!stu)return;
  const el=document.getElementById('view-sexams');
  const exams=[...S.exams].filter(e=>e.studentId===stu.id).sort((a,b)=>b.date.localeCompare(a.date));

  let chartHtml='';
  if(exams.length>1){
    const chartData=[...exams].sort((a,b)=>a.date.localeCompare(b.date)).slice(-8);
    const maxT=Math.max(...chartData.map(e=>{const f=EXAM_DEFS[e.type]||[];return f.reduce((s,fn)=>s+Number(e.nets?.[fn]||0),0);}),1);
    chartHtml=`<div class="card cp" style="margin-bottom:16px">
      <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px">📈 Net Gelişimim</div>
      <div class="bar-chart">
        ${chartData.map(e=>{
          const f=EXAM_DEFS[e.type]||[];
          const total=f.reduce((s,fn)=>s+Number(e.nets?.[fn]||0),0);
          const h=Math.max(Math.round((total/maxT)*100),4);
          return `<div class="bar-wrap">
            <div class="bar-val">${total.toFixed(0)}</div>
            <div class="bar" style="height:${h}%;background:${stu.color}"></div>
            <div class="bar-label">${esc(e.name.replace('Deneme ','#').replace('TYT ','').replace('AYT ',''))}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  const list=exams.length?exams.map(e=>{
    const fields=EXAM_DEFS[e.type]||[];
    const total=fields.reduce((s,f)=>s+Number(e.nets?.[f]||0),0).toFixed(1);
    const netBoxes=fields.map(f=>{const v=Number(e.nets?.[f]||0);return `<div class="net-box"><div class="net-label">${f}</div><div class="net-val ${netColor(v)}">${v}</div></div>`;}).join('');
    return `<div class="exam-item">
      <div class="exam-header">
        <div><div class="exam-name">${esc(e.name)}</div><div class="exam-date">${new Date(e.date+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div></div>
        <button class="btn btn-ghost btn-xs" onclick="openStudentExamModal('${e.id}')">✏️ Düzenle</button>
      </div>
      ${e.note?`<div style="font-size:12px;color:var(--text-mid);margin-bottom:8px;font-style:italic">"${esc(e.note)}"</div>`:''}
      <div class="nets-grid">${netBoxes}</div>
      <div style="margin-top:8px"><div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800">Toplam: ${total}</div></div>
      ${puanCardHtml(e, exams)}
      ${e.coachComment?`<div class="coach-comment-box"><strong>Koç Yorumu</strong>${esc(e.coachComment)}</div>`:''}
    </div>`;
  }).join(''):'<div class="empty"><p>Henüz deneme sonucu eklemediniz.<br>İlk sonucunuzu girin!</p></div>';

  el.innerHTML=`
    <div class="sh"><h2>Denemelerim</h2><button class="btn btn-accent" onclick="openStudentExamModal()">+ Sonuç Gir</button></div>
    ${chartHtml}${list}`;
}

function openStudentExamModal(id){
  const e=id?S.exams.find(x=>x.id===id):null;
  document.getElementById('emTitle').textContent=e?'Sonucu Düzenle':'Deneme Sonucu Gir';
  document.getElementById('emId').value=id||'';
  document.getElementById('emName').value=e?.name||'';
  document.getElementById('emDate').value=e?.date||fmtDate(new Date());
  document.getElementById('emStudentWrap').style.display='none';
  document.getElementById('emStudent').innerHTML=`<option value="${session.studentId}">${esc(S.students.find(s=>s.id===session.studentId)?.name||'')}</option>`;
  document.getElementById('emExamType').value=e?.type||'TYT';
  document.getElementById('emNote').value=e?.note||'';
  renderNetInputs();
  // Mevcut D/Y/B değerlerini geri yükle
  if (e?.examDetails) {
    Object.entries(e.examDetails).forEach(([ders, d]) => {
      const dEl = document.getElementById(`ed_${ders}_d`);
      const yEl = document.getElementById(`ed_${ders}_y`);
      const bEl = document.getElementById(`ed_${ders}_b`);
      if (dEl) { dEl.value = d.dogru||0; yEl.value = d.yanlis||0; bEl.value = d.bos||0; }
      _examDetails[ders] = { ...d };
      updateExamNet(ders);
      // Yanlış konu chiplerini işaretle
      (d.yanlis_konular||[]).forEach(konu => {
        const chips = document.querySelectorAll(`#konu_acc_${ders.replace(/\s/g,'_')} span`);
        chips.forEach(chip => {
          if (chip.textContent.trim() === konu) {
            chip.style.borderColor = 'var(--red)';
            chip.style.background = 'rgba(255,92,122,.12)';
            chip.style.color = 'var(--red)';
          }
        });
      });
    });
  }
  om('examModal');
}
function openExamModal(id){
  document.getElementById('emStudentWrap').style.display='';
  document.getElementById('emStudent').innerHTML=S.students.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
  openStudentExamModal(id);
  document.getElementById('emStudentWrap').style.display='';
}
let _examDetails = {}; // { 'Türkçe': { dogru, yanlis, bos, yanlis_konular:[] }, ... }

function toggleExamKonuChip(el, ders, konu) {
  if (!_examDetails[ders]) _examDetails[ders] = { dogru:0, yanlis:0, bos:0, yanlis_konular:[] };
  const arr = _examDetails[ders].yanlis_konular;
  const i = arr.indexOf(konu);
  if (i === -1) {
    arr.push(konu);
    el.style.borderColor = 'var(--red)';
    el.style.background = 'rgba(255,92,122,.12)';
    el.style.color = 'var(--red)';
  } else {
    arr.splice(i, 1);
    el.style.borderColor = 'var(--border)';
    el.style.background = 'var(--surface)';
    el.style.color = 'var(--text-mid)';
  }
}
window.toggleExamKonuChip = toggleExamKonuChip;

function _calcExamNet(ders) {
  const d = _examDetails[ders] || {};
  const net = (d.dogru||0) - (d.yanlis||0)/4;
  return Math.max(0, net);
}

function updateExamNet(ders) {
  const d = parseInt(document.getElementById(`ed_${ders}_d`)?.value)||0;
  const y = parseInt(document.getElementById(`ed_${ders}_y`)?.value)||0;
  const b = parseInt(document.getElementById(`ed_${ders}_b`)?.value)||0;
  if (!_examDetails[ders]) _examDetails[ders] = { yanlis_konular:[] };
  _examDetails[ders].dogru = d;
  _examDetails[ders].yanlis = y;
  _examDetails[ders].bos = b;
  const type = document.getElementById('emExamType').value;
  const max = EXAM_SORU[type]?.[ders] || 40;
  const total = d + y + b;
  const netEl = document.getElementById(`ed_${ders}_net`);
  const warnEl = document.getElementById(`ed_${ders}_warn`);
  if (netEl) netEl.textContent = (Math.max(0, d - y/4)).toFixed(2);
  if (warnEl) warnEl.style.display = total > max ? '' : 'none';
  _refreshModalPuan();
}
window.updateExamNet = updateExamNet;

function toggleKonuAccordion(ders) {
  const el = document.getElementById(`konu_acc_${ders.replace(/\s/g,'_')}`);
  if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
}
window.toggleKonuAccordion = toggleKonuAccordion;

function renderNetInputs(){
  const type = document.getElementById('emExamType').value;
  const subjects = EXAM_DEFS[type] || [];
  _examDetails = {};
  const puanEl = document.getElementById('emPuanDisplay');
  if (puanEl) puanEl.innerHTML = '';

  document.getElementById('netInputsWrap').innerHTML = subjects.map(ders => {
    const max = EXAM_SORU[type]?.[ders] || 40;
    const konuKeys = EXAM_KONU_MAP[`${type}_${ders}`] || [];
    const allKonular = konuKeys.flatMap(k => KONU_LISTESI[k] || []);
    const konuHtml = allKonular.length ? `
      <div style="margin-top:8px">
        <button type="button" onclick="toggleKonuAccordion('${ders}')"
          style="font-size:11px;font-weight:700;color:var(--text-dim);background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px">
          📌 Yanlış Konular <span style="font-size:10px">▾</span>
        </button>
        <div id="konu_acc_${ders.replace(/\s/g,'_')}" style="display:none;margin-top:6px;display:flex;flex-wrap:wrap;gap:0">
          ${allKonular.map(k => `<span onclick="toggleExamKonuChip(this,'${ders}','${k.replace(/'/g,"\\'")}')"
            style="display:inline-block;padding:4px 10px;margin:2px;border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;user-select:none;border:1px solid var(--border);background:var(--surface);color:var(--text-mid)">${esc(k)}</span>`).join('')}
        </div>
      </div>` : '';

    return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:12px 14px;margin-bottom:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px">${esc(ders)}</span>
        <span style="font-size:10px;color:var(--text-dim)">${max} soru · Net: <b id="ed_${ders}_net" style="color:var(--accent)">0.00</b></span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--green);margin-bottom:3px">✓ Doğru</div>
          <input type="number" id="ed_${ders}_d" min="0" max="${max}" value="0"
            oninput="updateExamNet('${ders}')"
            style="width:100%;padding:7px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--red);margin-bottom:3px">✗ Yanlış</div>
          <input type="number" id="ed_${ders}_y" min="0" max="${max}" value="0"
            oninput="updateExamNet('${ders}')"
            style="width:100%;padding:7px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);margin-bottom:3px">— Boş</div>
          <input type="number" id="ed_${ders}_b" min="0" max="${max}" value="0"
            oninput="updateExamNet('${ders}')"
            style="width:100%;padding:7px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
      </div>
      <div id="ed_${ders}_warn" style="display:none;font-size:10px;color:var(--red);margin-top:4px">⚠ D+Y+B toplamı ${max} soruyu geçiyor!</div>
      ${konuHtml}
    </div>`;
  }).join('');
}
async function saveExam(){
  const name=document.getElementById('emName').value.trim();
  if(!name)return showToast('Sınav adı girin!');
  const type=document.getElementById('emExamType').value;

  // D/Y/B'den net hesapla
  const nets={};
  (EXAM_DEFS[type]||[]).forEach(ders=>{
    const d=_examDetails[ders]||{};
    nets[ders]=Math.max(0,(d.dogru||0)-(d.yanlis||0)/4);
  });

  const id=document.getElementById('emId').value;
  const stuId=document.getElementById('emStudent').value;
  const payload={
    name, date:document.getElementById('emDate').value,
    student_id:stuId,
    coach_id:session.coachId||S.students.find(s=>s.id===stuId)?.coachId,
    exam_type:type, nets,
    exam_details:_examDetails,
    student_note:document.getElementById('emNote').value.trim()
  };
  // exam_details kolonu yoksa payload'dan çıkar (migration bekleniyor)
  async function _tryExamSave(p, isUpdate, id) {
    if (isUpdate) {
      const { error } = await db.from('exams').update(p).eq('id', id);
      if (error?.message?.includes('exam_details')) {
        const { exam_details: _, ...p2 } = p;
        return db.from('exams').update(p2).eq('id', id);
      }
      return { error };
    } else {
      const res = await db.from('exams').insert(p).select().single();
      if (res.error?.message?.includes('exam_details')) {
        const { exam_details: _, ...p2 } = p;
        return db.from('exams').insert(p2).select().single();
      }
      return res;
    }
  }

  if(id){
    const { error } = await _tryExamSave(payload, true, id);
    if(error) return showToast('Hata: '+error.message);
    const e=S.exams.find(x=>x.id===id);
    if(e)Object.assign(e,{name:payload.name,date:payload.date,studentId:stuId,type,nets,examDetails:_examDetails,note:payload.student_note});
    showToast('Güncellendi ✓');
  } else {
    const {data,error}=await _tryExamSave(payload, false, null);
    if(error)return showToast('Hata: '+error.message);
    S.exams.push({id:data.id,studentId:data.student_id,name:data.name,date:data.date,type:data.exam_type,nets:data.nets||{},examDetails:data.exam_details||{},note:data.student_note,coachComment:''});
    showToast('Deneme eklendi ✓');
  }
  cm('examModal');
  if(session.role==='student')renderSExams();else renderExams();

  // ── Mastery öneri bildirimi (koça) ──────────────
  if (session.role === 'coach' || session.role === 'developer') {
    try {
      // Sınavdaki yanlış konuları topla
      const wrongKonular = [];
      Object.values(_examDetails || {}).forEach(dersDetail => {
        if (dersDetail?.yanlis_konular?.length) {
          wrongKonular.push(...dersDetail.yanlis_konular);
        }
      });
      // Sınavdaki genel wrong_topics de varsa ekle
      if (_wrongTopics?.length) wrongKonular.push(..._wrongTopics);
      const uniqueWrong = [...new Set(wrongKonular)];

      if (uniqueWrong.length > 0 && stuId) {
        const stuMastery = S.konuMastery?.[stuId] || {};
        const warnings = [];
        Object.entries(stuMastery).forEach(([subject, konular]) => {
          Object.entries(konular).forEach(([konu, m]) => {
            if (uniqueWrong.includes(konu)) {
              if (m.status === 'td') {
                warnings.push({ konu, subject, type: 'td_broken', stars: m.stars });
              } else if (m.stars >= 5) {
                warnings.push({ konu, subject, type: 'high_star_wrong', stars: m.stars });
              }
            }
          });
        });
        if (warnings.length > 0) {
          const tdBroken = warnings.filter(w => w.type === 'td_broken');
          const highStar = warnings.filter(w => w.type === 'high_star_wrong');
          let msg = '⚠️ Mastery Önerileri: ';
          if (tdBroken.length > 0) msg += `${tdBroken.map(w=>w.konu).join(', ')} TD'den düştü! `;
          if (highStar.length > 0) msg += `${highStar.map(w=>w.konu).join(', ')} için yıldız düşürmeyi düşün.`;
          // Bildirim paneli oluştur
          setTimeout(() => {
            const notifEl = document.createElement('div');
            notifEl.style.cssText = 'position:fixed;bottom:80px;right:16px;max-width:360px;background:var(--surface);border:1.5px solid var(--accent);border-radius:12px;padding:14px 16px;box-shadow:var(--shadow-lg);z-index:99999;animation:slideIn .3s ease';
            notifEl.innerHTML = `
              <div style="display:flex;align-items:flex-start;gap:10px">
                <span style="font-size:20px;flex-shrink:0">⚠️</span>
                <div style="flex:1">
                  <div style="font-size:13px;font-weight:800;margin-bottom:6px">Deneme → Konu Mastery Önerisi</div>
                  ${tdBroken.length > 0 ? `<div style="font-size:11px;color:var(--red);margin-bottom:4px">🔴 TD'den düşenler: <b>${tdBroken.map(w=>w.konu).join(', ')}</b></div>` : ''}
                  ${highStar.length > 0 ? `<div style="font-size:11px;color:var(--accent)">🟡 Yıldız düşürmeyi düşün: <b>${highStar.map(w=>w.konu).join(', ')}</b></div>` : ''}
                  <div style="font-size:10px;color:var(--text-dim);margin-top:6px">Değişiklik yapmak için Konu Haritası'na git</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="border:none;background:none;color:var(--text-dim);cursor:pointer;font-size:16px;line-height:1;flex-shrink:0">×</button>
              </div>`;
            document.body.appendChild(notifEl);
            setTimeout(() => notifEl.remove(), 12000);
          }, 600);
        }
      }
    } catch(e) { console.error('[mastery suggestion]', e); }
  }
}

// ═══════════════════════════════════════════════
// STUDENT MESSAGES
// ═══════════════════════════════════════════════
async function renderSMessages(){
  const stu=S.students.find(s=>s.id===session.studentId);if(!stu)return;
  // mark coach messages read
  const unreadIds=(S.messages[stu.id]||[]).filter(m=>m.from==='coach'&&!m.read&&m._id).map(m=>m._id);
  if(unreadIds.length) await db.from('messages').update({read:true}).in('id',unreadIds);
  (S.messages[stu.id]||[]).forEach(m=>{if(m.from==='coach')m.read=true;});
  const el=document.getElementById('view-smessages');
  el.innerHTML=`<div class="sh" style="margin-bottom:12px"><h2>💬 Koçuma Yaz</h2></div>
    <div class="smsg-wrap">
      <div class="msg-main" id="msgMain">${renderThreadHTML(stu.id,'student')}</div>
    </div>`;
  scrollMsgs();
}

// ═══════════════════════════════════════════════
// SUPABASE REALTIME CHAT
// ═══════════════════════════════════════════════
let _realtimeChannel = null;

function initRealtime() {
  destroyRealtime();
  const stuId = (session.role==='coach' || session.role==='developer') ? S.msgThread : session.studentId;
  if(!stuId) return;

  _realtimeChannel = db.channel('messages_' + stuId)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `student_id=eq.${stuId}`
    }, payload => {
      const m = payload.new;
      if(!S.messages[stuId]) S.messages[stuId] = [];
      // tekrar ekleme önlemi
      if(S.messages[stuId].find(x=>x._id===m.id)) return;
      S.messages[stuId].push({
        _id: m.id, from: m.from_role, text: m.text||'', image_url: m.image_url||null, read: m.read,
        time: new Date(m.created_at).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})
      });
      if(currentTab==='messages' && S.msgThread===stuId) {
        document.getElementById('msgMain').innerHTML = renderThreadHTML(stuId,'coach');
        scrollMsgs();
      }
      if(currentTab==='smessages') {
        document.getElementById('msgMain').innerHTML = renderThreadHTML(stuId,'student');
        scrollMsgs();
      }
    })
    .subscribe();
}

function destroyRealtime() {
  if(_realtimeChannel) { db.removeChannel(_realtimeChannel); _realtimeChannel=null; }
}

// Eski polling fonksiyonları (artık kullanılmıyor ama var)
function startChatPoll(){}
function stopChatPoll(){}

// ═══════════════════════════════════════════════
// DEVELOPER PANEL
// ═══════════════════════════════════════════════

// ── DASHBOARD ──────────────────────────────────
async function devResetOnboarding() {
  await db.from('workspaces').upsert(
    { coach_id: session.coachId, brand_name: S.workspace?.brand_name || 'Akademi', brand_color: S.workspace?.brand_color || '#f0a500', onboarding_done: false },
    { onConflict: 'coach_id' }
  );
  if (S.workspace) S.workspace.onboarding_done = false;
  showOnboarding();
}
window.devResetOnboarding = devResetOnboarding;

async function renderDevDashboard() {
  const el = document.getElementById('view-dev-dashboard');
  el.innerHTML = `<div class="sh"><h2>🖥️ Sistem Dashboard</h2></div><div class="empty"><p>Yükleniyor...</p></div>`;

  const [usersRes, tasksRes, examsRes, msgsRes, ticketsRes, paymentsRes] = await Promise.all([
    db.from('users').select('id,role,created_at'),
    db.from('tasks').select('id,done,created_at'),
    db.from('exams').select('id,created_at'),
    db.from('messages').select('id,created_at'),
    db.from('tickets').select('id,status,created_at'),
    db.from('payments').select('id,amount,status,payment_date'),
  ]);

  const users = usersRes.data||[];
  const tasks = tasksRes.data||[];
  const exams = examsRes.data||[];
  const msgs = msgsRes.data||[];
  const tickets = ticketsRes.data||[];
  const payments = paymentsRes.data||[];

  const coaches = users.filter(u=>u.role==='coach').length;
  const students = users.filter(u=>u.role==='student').length;
  const totalRevenue = payments.filter(p=>p.status==='completed').reduce((s,p)=>s+Number(p.amount),0);
  const openTickets = tickets.filter(t=>t.status==='open').length;

  // Son 7 gün aktivite
  const days7 = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i);
    return fmtDate(d);
  });
  const tasksByDay = days7.map(d=>tasks.filter(t=>t.created_at?.startsWith(d)).length);
  const maxD = Math.max(...tasksByDay,1);

  el.innerHTML = `
    <div class="sh"><h2>🖥️ Sistem Dashboard</h2>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-size:12px;color:var(--text-dim)">${new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
        <button class="btn btn-ghost btn-sm" onclick="devResetOnboarding()" title="Onboarding sihirbazını yeniden başlat">🧙 Sihirbazı Test Et</button>
      </div>
    </div>

    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Toplam Öğrenci</div><div class="stat-val" style="color:var(--blue)">${students}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Koç</div><div class="stat-val" style="color:var(--accent)">${coaches}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Görev</div><div class="stat-val">${tasks.length}</div><div style="font-size:11px;color:var(--green);margin-top:3px">✓ ${tasks.filter(t=>t.done).length} tamamlandı</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Deneme</div><div class="stat-val">${exams.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Mesaj</div><div class="stat-val">${msgs.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Gelir</div><div class="stat-val" style="color:var(--green)">${totalRevenue.toLocaleString('tr-TR')} ₺</div></div>
      <div class="stat-card"><div class="stat-label">Açık Ticket</div><div class="stat-val" style="color:${openTickets>0?'var(--red)':'var(--green)'}">${openTickets}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">📅 Son 7 Gün Görev Aktivitesi</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:80px">
          ${days7.map((d,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="font-size:10px;color:var(--text-mid);font-weight:600">${tasksByDay[i]}</div>
            <div style="width:100%;background:var(--accent);border-radius:3px 3px 0 0;height:${Math.max(Math.round((tasksByDay[i]/maxD)*100),4)}%;min-height:3px;opacity:.8"></div>
            <div style="font-size:9px;color:var(--text-dim)">${new Date(d+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">🎫 Son Ticket'lar</div>
        ${tickets.slice(-5).reverse().map(t=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
            <span style="color:var(--text-mid)">#${t.id.slice(0,6)}</span>
            <span class="role-badge" style="background:${t.status==='open'?'var(--red-dim)':t.status==='resolved'?'var(--green-dim)':'var(--accent-dim)'};color:${t.status==='open'?'var(--red)':t.status==='resolved'?'var(--green)':'var(--accent)'}">${t.status}</span>
          </div>`).join('') || '<div style="font-size:12px;color:var(--text-dim)">Ticket yok</div>'}
      </div>
    </div>`;
}

// ── KULLANICI YÖNETİMİ ─────────────────────────
async function renderDevUsers() {
  const el = document.getElementById('view-dev-users');
  const {data:users} = await db.from('users').select('*').order('created_at');
  const now = new Date();

  function _planBadge(u) {
    if (u.role !== 'coach' && u.role !== 'developer') return '<span style="color:var(--text-dim);font-size:11px">—</span>';
    const plan = u.plan || 'trial';
    if (plan === 'active') return '<span style="font-size:10px;font-weight:800;color:#10b981;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.3);border-radius:4px;padding:2px 7px">AKTİF</span>';
    if (plan === 'paused') return '<span style="font-size:10px;font-weight:700;color:#f59e0b;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.3);border-radius:4px;padding:2px 7px">DURAKLATILDI</span>';
    if (plan === 'cancelled') return '<span style="font-size:10px;font-weight:700;color:#ef4444;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:4px;padding:2px 7px">İPTAL</span>';
    // trial
    const trialEnd = u.trial_ends_at ? new Date(u.trial_ends_at) : new Date(new Date(u.created_at).getTime() + 14*24*60*60*1000);
    const daysLeft = Math.ceil((trialEnd - now) / 86400000);
    if (daysLeft <= 0) return '<span style="font-size:10px;font-weight:700;color:#ef4444;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:4px;padding:2px 7px">SÜRESİ DOLDU</span>';
    return `<span style="font-size:10px;font-weight:700;color:#6366f1;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:4px;padding:2px 7px">DENEME · ${daysLeft}g</span>`;
  }

  el.innerHTML = `
    <div class="sh"><h2>👥 Kullanıcı Yönetimi</h2>
      <button class="btn btn-accent" onclick="openDevUserModal()">+ Kullanıcı Ekle</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:1px solid var(--border);color:var(--text-dim);font-size:11px;text-transform:uppercase;letter-spacing:.5px">
            <th style="text-align:left;padding:10px 12px">Ad Soyad</th>
            <th style="text-align:left;padding:10px 12px">Kullanıcı Adı</th>
            <th style="text-align:left;padding:10px 12px">Rol</th>
            <th style="text-align:left;padding:10px 12px">Plan</th>
            <th style="text-align:left;padding:10px 12px">Kayıt</th>
            <th style="padding:10px 12px"></th>
          </tr>
        </thead>
        <tbody>
          ${(users||[]).map(u=>`
            <tr style="border-bottom:1px solid var(--border);transition:background .15s" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background=''">
              <td style="padding:10px 12px;font-weight:700">${esc(u.full_name)}</td>
              <td style="padding:10px 12px;color:var(--text-mid)">${esc(u.username)}</td>
              <td style="padding:10px 12px"><span class="role-badge ${u.role==='coach'?'role-coach':u.role==='developer'?'role-dev':'role-student'}">${u.role}</span></td>
              <td style="padding:10px 12px">${_planBadge(u)}</td>
              <td style="padding:10px 12px;color:var(--text-dim);font-size:11px">${new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
              <td style="padding:10px 12px;display:flex;gap:6px;flex-wrap:nowrap">
                ${(u.role==='coach'||u.role==='developer')?`<button class="btn btn-accent btn-xs" onclick="openPlanModal('${u.id}','${esc(u.full_name)}','${u.plan||'trial'}','${u.trial_ends_at||''}')">📋</button>`:''}
                <button class="btn btn-ghost btn-xs" onclick="openDevUserModal('${u.id}')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteUser('${u.id}','${esc(u.full_name)}')">🗑</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openDevUserModal(id) {
  const u = id ? (await db.from('users').select('*').eq('id',id).single()).data : null;
  // reuse student modal but show all roles
  document.getElementById('smTitle').textContent = u ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı';
  document.getElementById('smId').value = id||'';
  document.getElementById('smName').value = u?.full_name||'';
  document.getElementById('smTarget').value = u?.target||'';
  document.getElementById('smUsername').value = u?.username||'';
  document.getElementById('smPass').value = u?.password_hash||'';
  document.getElementById('smWeekStart').value = u?.week_start||0;
  document.getElementById('smProg').value = u?.progress||0;
  document.getElementById('smProgVal').textContent = (u?.progress||0)+'%';
  document.querySelectorAll('.color-opt').forEach(el=>el.classList.toggle('sel',el.dataset.c===(u?.color||'#f0a500')));
  // add role selector if not present
  let roleField = document.getElementById('smRoleField');
  if(!roleField) {
    roleField = document.createElement('div');
    roleField.id = 'smRoleField';
    roleField.className = 'field';
    roleField.innerHTML = `<label>Rol</label><select id="smRole" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none"><option value="student">Öğrenci</option><option value="coach">Koç</option><option value="developer">Developer</option></select>`;
    document.getElementById('smName').closest('.modal').insertBefore(roleField, document.getElementById('smName').parentElement);
  }
  document.getElementById('smRole').value = u?.role||'student';
  // Developer modunda save butonu farklı fonksiyon çağırsın
  document.querySelector('#studentModal .btn-accent').setAttribute('onclick','saveStudentDev()');
  om('studentModal');
}

async function devDeleteUser(id, name) {
  if (!await customConfirm(`"${name}" kullanıcısını kalıcı olarak silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`)) return;
  showLoading(true);
  try {
    const { data: { session: s } } = await db.auth.getSession();
    const resp = await fetch('/api/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s?.access_token || ''}` },
      body: JSON.stringify({ targetUserId: id })
    });
    const d = await resp.json();
    if (!resp.ok) throw new Error(d.error || 'Sunucu hatası');
    showToast(`🗑 ${name} silindi`);
    renderDevUsers();
  } catch (e) {
    showToast('Hata: ' + e.message);
  } finally {
    showLoading(false);
  }
}

function openPlanModal(userId, userName, currentPlan, trialEndsAt) {
  let modal = document.getElementById('planMgmtModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'planMgmtModal';
    modal.className = 'modal-bg';
    modal.innerHTML = `<div class="modal" style="max-width:400px">
      <button class="modal-close" onclick="cm('planMgmtModal')">×</button>
      <h2 id="planModalTitle">Plan Yönet</h2>
      <input type="hidden" id="planUserId">
      <div class="field">
        <label>Plan Durumu</label>
        <select id="planStatus" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none">
          <option value="trial">Deneme (Trial)</option>
          <option value="active">Aktif (Ücretli)</option>
          <option value="paused">Duraklatıldı</option>
          <option value="cancelled">İptal Edildi</option>
        </select>
      </div>
      <div class="field" id="trialEndField">
        <label>Deneme Bitiş Tarihi</label>
        <input type="date" id="planTrialEnd" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box">
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px">Boş bırakılırsa kayıt tarihinden +14 gün hesaplanır</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-accent" style="flex:1;justify-content:center;padding:11px" onclick="savePlan()">Kaydet</button>
        <button class="btn btn-ghost" style="padding:11px 18px" onclick="cm('planMgmtModal')">İptal</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    document.getElementById('planStatus').addEventListener('change', function() {
      document.getElementById('trialEndField').style.display = this.value === 'trial' ? '' : 'none';
    });
  }
  document.getElementById('planModalTitle').textContent = `Plan Yönet — ${userName}`;
  document.getElementById('planUserId').value = userId;
  document.getElementById('planStatus').value = currentPlan || 'trial';
  document.getElementById('trialEndField').style.display = (currentPlan === 'trial' || !currentPlan) ? '' : 'none';
  if (trialEndsAt) {
    document.getElementById('planTrialEnd').value = trialEndsAt.split('T')[0];
  } else {
    document.getElementById('planTrialEnd').value = '';
  }
  om('planMgmtModal');
}

async function savePlan() {
  const userId = document.getElementById('planUserId').value;
  const plan = document.getElementById('planStatus').value;
  const trialEnd = document.getElementById('planTrialEnd').value;
  const payload = { plan };
  if (plan === 'trial' && trialEnd) payload.trial_ends_at = trialEnd;
  else if (plan !== 'trial') payload.trial_ends_at = null;
  showLoading(true);
  const { error } = await db.from('users').update(payload).eq('id', userId);
  showLoading(false);
  if (error) return showToast('Hata: ' + error.message);
  const planLabels = { trial: 'Deneme', active: 'Aktif', paused: 'Duraklatıldı', cancelled: 'İptal' };
  showToast(`Plan güncellendi: ${planLabels[plan] || plan} ✓`);
  cm('planMgmtModal');
  renderDevUsers();
}

// ── KAYNAK YÖNETİMİ ───────────────────────────
let _devResources = [];
async function renderDevResources() {
  const el = document.getElementById('view-dev-resources');
  const {data} = await db.from('resources').select('*').order('resource_type,exam_type,subject,name');
  _devResources = data||[];

  const books = _devResources.filter(r=>r.resource_type!=='playlist');
  const playlists = _devResources.filter(r=>r.resource_type==='playlist');

  el.innerHTML = `
    <div class="sh"><h2>📚 Kaynak & Müfredat Yönetimi</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openResourceModal(null,'book')">+ Soru Bankası</button>
        <button class="btn btn-accent btn-sm" onclick="openPlaylistModal()">▶ Playlist / Video Ekle</button>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Soru Bankası</div><div class="stat-val">${books.length}</div></div>
      <div class="stat-card"><div class="stat-label">Playlist</div><div class="stat-val">${playlists.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Kaynak</div><div class="stat-val">${_devResources.length}</div></div>
    </div>

    <!-- PLAYLİSTLER -->
    <div style="margin-bottom:24px">
      <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        ▶ Konu Anlatımı Playlistleri <span style="font-size:12px;font-weight:400;color:var(--text-dim)">${playlists.length} playlist</span>
      </div>
      ${playlists.length===0?`<div class="empty"><p>Henüz playlist eklenmemiş</p></div>`:''}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
        ${playlists.map(p=>`
          <div class="card" style="padding:14px 16px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:700;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.name)}</div>
                <div style="font-size:11px;color:var(--text-dim)">${esc(p.publisher)} · ${p.exam_type} ${p.subject} · ${(p.tests||[]).length} video</div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0">
                <button class="btn btn-ghost btn-xs" onclick="openResourceModal('${p.id}','playlist')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteResource('${p.id}')" style="opacity:.5" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">🗑</button>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- SORU BANKALARI -->
    <div>
      <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        📚 Soru Bankaları <span style="font-size:12px;font-weight:400;color:var(--text-dim)">${books.length} kitap</span>
      </div>
      ${books.length===0?`<div class="empty"><p>Henüz kitap eklenmemiş</p></div>`:''}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
        ${books.map(b=>`
          <div class="card" style="padding:14px 16px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:var(--accent);font-weight:700;margin-bottom:2px">${b.exam_type} · ${b.subject}</div>
                <div style="font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(b.name)}</div>
                <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${esc(b.publisher)} · ${(b.tests||[]).length} test</div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0">
                <span style="font-size:10px;padding:2px 7px;border-radius:99px;background:${b.active?'var(--green-dim)':'var(--red-dim)'};color:${b.active?'var(--green)':'var(--red)'}">${b.active?'Aktif':'Pasif'}</span>
                <button class="btn btn-ghost btn-xs" onclick="openResourceModal('${b.id}','book')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteResource('${b.id}')" style="opacity:.5" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">🗑</button>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── PLAYLİST EKLE / YOUTUBE IMPORT ────────────
function openPlaylistModal() {
  let modal = document.getElementById('playlistModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'playlistModal';
    modal.className = 'modal-bg';
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  modal.innerHTML = `<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('playlistModal')">×</button>
    <h2>▶ Playlist / Video Ekle</h2>

    <!-- YouTube Import -->
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <span style="background:#ff0000;color:white;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px">YT</span>
        YouTube'dan Otomatik Çek
      </div>
      <div style="font-size:12px;color:var(--text-mid);margin-bottom:10px">Oynatma listesi (Playlist) URL'sini yapıştırın, video listesi otomatik olarak yüklensin.</div>
      <div style="display:flex;gap:8px">
        <input id="ytPlaylistUrl" placeholder="https://youtube.com/playlist?list=PL..." style="flex:1;font-size:12px">
        <button class="btn btn-accent btn-sm" onclick="fetchYouTubePlaylist()">Çek →</button>
      </div>
      <div id="ytStatus" style="font-size:12px;color:var(--text-mid);margin-top:8px"></div>
    </div>

    <!-- Manuel Giriş -->
    <div style="font-size:13px;font-weight:700;margin-bottom:12px">✏️ Manuel Giriş</div>
    <div class="field-row">
      <div class="field"><label>Sınav</label>
        <select id="plExam"><option value="TYT">TYT</option><option value="AYT-SAY">AYT Sayısal</option><option value="AYT-EA">AYT EA</option><option value="AYT-SOZ">AYT Sözel</option></select>
      </div>
      <div class="field"><label>Ders</label><input id="plSubject" placeholder="Matematik, Fizik..."></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Hoca / Kanal Adı</label><input id="plPublisher" placeholder="Mert Hoca, Eyüp B..."></div>
      <div class="field"><label>Playlist Adı</label><input id="plName" placeholder="AYT Matematik Kampı 2025"></div>
    </div>
    <div class="field">
      <label>Videolar <span style="color:var(--text-dim);font-weight:400">(Her satıra: Video Başlığı | YouTube Linki | Süre(dk))</span></label>
      <textarea id="plVideos" style="min-height:200px;font-size:12px;font-family:monospace" placeholder="Ders 1 - Polinomlar | https://youtube.com/watch?v=xxx | 45&#10;Ders 2 - Türev | https://youtube.com/watch?v=yyy | 38&#10;Ders 3 - İntegral | https://youtube.com/watch?v=zzz | 52"></textarea>
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="savePlaylist()">Playlist Kaydet</button>
  </div>`;

  om('playlistModal');
}

async function fetchYouTubePlaylist() {
  const url = document.getElementById('ytPlaylistUrl').value.trim();
  const statusEl = document.getElementById('ytStatus');

  if(!url) return statusEl.innerHTML = '<span style="color:var(--red)">⚠️ Playlist URL giriniz</span>';

  // Playlist ID çıkar
  const match = url.match(/[?&]list=([^&]+)/);
  if(!match) return statusEl.innerHTML = '<span style="color:var(--red)">⚠️ Geçersiz URL — "list=..." parametresi bulunamadı</span>';
  const listId = match[1];

  statusEl.innerHTML = '⏳ Yükleniyor...';
  try {
    let videos = [], nextPage = '';
    do {
      let apiUrl = `/api/youtube?playlistId=${listId}`;
      if (nextPage) {
        apiUrl += `&pageToken=${nextPage}`;
      }
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Oynatma listesi yüklenemedi.');
      }
      const data = await res.json();
      if(data.items) {
        videos = videos.concat(data.items);
      }
      nextPage = data.nextPageToken || '';
    } while(nextPage && videos.length < 200);

    // Textarea'yı doldur
    document.getElementById('plVideos').value = videos.map(v=>`${v.title} | ${v.url} | ${v.duration}`).join('\n');
    statusEl.innerHTML = `<span style="color:var(--green)">✓ ${videos.length} video yüklendi!</span>`;

  } catch(e) {
    statusEl.innerHTML = `<span style="color:var(--red)">⚠️ Hata: ${e.message}</span>`;
  }
}

async function savePlaylist() {
  const name = document.getElementById('plName').value.trim();
  const subject = document.getElementById('plSubject').value.trim();
  const publisher = document.getElementById('plPublisher').value.trim();
  if(!name||!subject||!publisher) return showToast('Tüm alanları doldurun!');

  const lines = document.getElementById('plVideos').value.split('\n').map(l=>l.trim()).filter(Boolean);
  if(!lines.length) return showToast('En az 1 video girin!');

  const videos = lines.map(line=>{
    const parts = line.split('|').map(p=>p.trim());
    return {
      label: parts[0]||'',
      url: parts[1]||'',
      topic: '',
      soru: parseInt(parts[2])||0  // dakika
    };
  }).filter(v=>v.label);

  const payload = {
    exam_type: document.getElementById('plExam').value,
    subject, publisher, name,
    year: new Date().getFullYear(),
    tests: videos,
    active: true,
    resource_type: 'playlist'
  };

  const {error} = await db.from('resources').insert(payload);
  if(error) return showToast('Hata: '+error.message);
  showToast(`✓ "${name}" eklendi — ${videos.length} video`);
  cm('playlistModal');
  renderDevResources();
}

function openResourceModal(id, type='book') {
  const r = id ? _devResources.find(x=>x.id===id) : null;
  let modal = document.getElementById('resourceModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'resourceModal';
    modal.className = 'modal-bg';
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  const isPlaylist = (r?.resource_type||type)==='playlist';
  modal.innerHTML = `<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('resourceModal')">×</button>
    <h2 id="rmTitle">${r?'Düzenle':'Ekle'} — ${isPlaylist?'Playlist':'Soru Bankası'}</h2>
    <input type="hidden" id="rmId" value="${id||''}">
    <input type="hidden" id="rmType" value="${isPlaylist?'playlist':'book'}">
    <div class="field-row">
      <div class="field"><label>Sınav</label>
        <select id="rmExam"><option value="TYT">TYT</option><option value="AYT-SAY">AYT Sayısal</option><option value="AYT-EA">AYT EA</option><option value="AYT-SOZ">AYT Sözel</option></select>
      </div>
      <div class="field"><label>Ders</label><input id="rmSubject" placeholder="Matematik, Fizik..."></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${isPlaylist?'Hoca / Kanal':'Yayınevi'}</label><input id="rmPublisher"></div>
      <div class="field"><label>Ad</label><input id="rmName"></div>
    </div>
    ${isPlaylist?`
    <div class="field">
      <label>Videolar <span style="color:var(--text-dim);font-weight:400">(Başlık | Link | Süre)</span></label>
      <textarea id="rmTests" style="min-height:180px;font-size:11px;font-family:monospace"></textarea>
    </div>`:`
    <div class="field">
      <label>Testler <span style="color:var(--text-dim);font-weight:400">(Her satır: Test Adı | Soru Sayısı)</span></label>
      <textarea id="rmTests" style="min-height:180px;font-size:12px;font-family:monospace"></textarea>
    </div>`}
    <div class="field-row">
      <div class="field"><label>Durum</label>
        <select id="rmActive"><option value="true">Aktif</option><option value="false">Pasif</option></select>
      </div>
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveResource()">Kaydet</button>
  </div>`;

  document.getElementById('rmExam').value = r?.exam_type||'TYT';
  document.getElementById('rmSubject').value = r?.subject||'';
  document.getElementById('rmPublisher').value = r?.publisher||'';
  document.getElementById('rmName').value = r?.name||'';
  document.getElementById('rmActive').value = String(r?.active!==false);

  // Tests alanını doldur
  const tests = r?.tests||[];
  if(isPlaylist) {
    document.getElementById('rmTests').value = tests.map(t=>`${t.label||t} | ${t.url||''} | ${t.soru||0}`).join('\n');
  } else {
    document.getElementById('rmTests').value = tests.map(t=>`${t.label||t} | ${t.soru||0}`).join('\n');
  }
  om('resourceModal');
}

async function saveResource() {
  const name = document.getElementById('rmName').value.trim();
  const subject = document.getElementById('rmSubject').value.trim();
  if(!name||!subject) return showToast('Ad ve ders zorunlu!');
  const id = document.getElementById('rmId').value;
  const isPlaylist = document.getElementById('rmType').value==='playlist';
  const lines = document.getElementById('rmTests').value.split('\n').map(l=>l.trim()).filter(Boolean);
  let tests = [];
  if(isPlaylist) {
    tests = lines.map(l=>{
      const p = l.split('|').map(x=>x.trim());
      return {label:p[0]||'', url:p[1]||'', topic:'', soru:parseInt(p[2])||0};
    });
  } else {
    tests = lines.map(l=>{
      const p = l.split('|').map(x=>x.trim());
      return {label:p[0]||'', soru:parseInt(p[1])||0};
    });
  }
  const payload = {
    exam_type: document.getElementById('rmExam').value,
    subject, publisher: document.getElementById('rmPublisher').value.trim(),
    year: new Date().getFullYear(), name, tests,
    active: document.getElementById('rmActive').value==='true',
    resource_type: isPlaylist?'playlist':'book'
  };
  if(id) { await db.from('resources').update(payload).eq('id',id); showToast('Güncellendi ✓'); }
  else { await db.from('resources').insert(payload); showToast('Kaynak eklendi ✓'); }
  cm('resourceModal'); renderDevResources();
}

async function devDeleteResource(id) {
  if(!await customConfirm('Bu kaynağı silmek istediğinizden emin misiniz?')) return;
  await db.from('resources').delete().eq('id',id);
  showToast('Silindi'); renderDevResources();
}

// ── FİNANS ────────────────────────────────────
async function renderDevFinance() {
  const el = document.getElementById('view-dev-finance');
  const [{data:subs},{data:pays}] = await Promise.all([
    db.from('subscriptions').select('*,users(full_name,color)').order('created_at',{ascending:false}),
    db.from('payments').select('*,users(full_name)').order('payment_date',{ascending:false}).limit(20),
  ]);

  const totalMo = (pays||[]).filter(p=>p.status==='completed').reduce((s,p)=>s+Number(p.amount),0);
  const activeSubs = (subs||[]).filter(s=>s.status==='active').length;

  el.innerHTML = `
    <div class="sh"><h2>💰 Finans Yönetimi</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openPaymentModal()">+ Ödeme Ekle</button>
        <button class="btn btn-accent btn-sm" onclick="openSubModal()">+ Abonelik</button>
      </div>
    </div>
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Toplam Tahsilat</div><div class="stat-val" style="color:var(--green)">${totalMo.toLocaleString('tr-TR')} ₺</div></div>
      <div class="stat-card"><div class="stat-label">Aktif Abonelik</div><div class="stat-val">${activeSubs}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam İşlem</div><div class="stat-val">${(pays||[]).length}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:12px">📋 Abonelikler</div>
        ${(subs||[]).map(s=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:13px;font-weight:700">${esc(s.users?.full_name||'?')}</div>
              <div style="font-size:11px;color:var(--text-dim)">${s.plan} · ${s.start_date}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:13px;font-weight:700;color:var(--green)">${Number(s.amount).toLocaleString('tr-TR')} ₺</div>
              <span style="font-size:10px;padding:2px 7px;border-radius:99px;background:${s.status==='active'?'var(--green-dim)':'var(--red-dim)'};color:${s.status==='active'?'var(--green)':'var(--red)'}">${s.status}</span>
            </div>
          </div>`).join('') || '<div class="empty"><p>Abonelik yok</p></div>'}
      </div>
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:12px">💳 Son Ödemeler</div>
        ${(pays||[]).slice(0,10).map(p=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:12px;font-weight:700">${esc(p.users?.full_name||'?')}</div>
              <div style="font-size:11px;color:var(--text-dim)">${p.payment_date} · ${p.method}</div>
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--green)">${Number(p.amount).toLocaleString('tr-TR')} ₺</div>
          </div>`).join('') || '<div class="empty"><p>Ödeme yok</p></div>'}
      </div>
    </div>`;
}

function openPaymentModal() {
  let modal = document.getElementById('paymentModal');
  if(!modal) {
    modal = document.createElement('div'); modal.id='paymentModal'; modal.className='modal-bg';
    modal.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('paymentModal')">×</button>
      <h2>Ödeme Ekle</h2>
      <div class="field"><label>Öğrenci</label><select id="pmStudent">${S.students.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></div>
      <div class="field-row">
        <div class="field"><label>Tutar (₺)</label><input type="number" id="pmAmount" placeholder="1500"></div>
        <div class="field"><label>Yöntem</label><select id="pmMethod"><option>nakit</option><option>havale</option><option>kart</option><option>iyzico</option></select></div>
      </div>
      <div class="field"><label>Tarih</label><input type="date" id="pmDate" value="${fmtDate(new Date())}"></div>
      <div class="field"><label>Açıklama</label><input id="pmDesc" placeholder="Mayıs ayı ücreti"></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="savePayment()">Kaydet</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  // refresh student list
  document.getElementById('pmStudent').innerHTML=S.students.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
  om('paymentModal');
}

async function savePayment() {
  const amount = parseFloat(document.getElementById('pmAmount').value);
  if(!amount) return showToast('Tutar girin!');
  await db.from('payments').insert({
    student_id: document.getElementById('pmStudent').value,
    amount, method: document.getElementById('pmMethod').value,
    payment_date: document.getElementById('pmDate').value,
    description: document.getElementById('pmDesc').value,
    status:'completed'
  });
  showToast('Ödeme kaydedildi ✓'); cm('paymentModal'); renderDevFinance();
}

function openSubModal() {
  let modal = document.getElementById('subModal');
  if(!modal) {
    modal = document.createElement('div'); modal.id='subModal'; modal.className='modal-bg';
    modal.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('subModal')">×</button>
      <h2>Abonelik Ekle</h2>
      <div class="field"><label>Öğrenci</label><select id="sbStudent"></select></div>
      <div class="field-row">
        <div class="field"><label>Plan</label><select id="sbPlan"><option value="monthly">Aylık</option><option value="quarterly">3 Aylık</option><option value="yearly">Yıllık</option></select></div>
        <div class="field"><label>Aylık Tutar (₺)</label><input type="number" id="sbAmount" placeholder="1500"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Başlangıç</label><input type="date" id="sbStart" value="${fmtDate(new Date())}"></div>
        <div class="field"><label>Bitiş (isteğe bağlı)</label><input type="date" id="sbEnd"></div>
      </div>
      <div class="field"><label>Durum</label><select id="sbStatus"><option value="active">Aktif</option><option value="trial">Deneme</option><option value="paused">Durduruldu</option><option value="cancelled">İptal</option></select></div>
      <div class="field"><label>Not</label><input id="sbNotes" placeholder="..."></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveSub()">Kaydet</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  document.getElementById('sbStudent').innerHTML=S.students.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
  om('subModal');
}

async function saveSub() {
  const amount = parseFloat(document.getElementById('sbAmount').value);
  if(!amount) return showToast('Tutar girin!');
  await db.from('subscriptions').insert({
    student_id: document.getElementById('sbStudent').value,
    plan: document.getElementById('sbPlan').value, amount,
    start_date: document.getElementById('sbStart').value,
    end_date: document.getElementById('sbEnd').value||null,
    status: document.getElementById('sbStatus').value,
    notes: document.getElementById('sbNotes').value
  });
  showToast('Abonelik eklendi ✓'); cm('subModal'); renderDevFinance();
}

// ── DUYURULAR ─────────────────────────────────
async function renderDevAnnounce() {
  const el = document.getElementById('view-dev-announce');
  const {data} = await db.from('announcements').select('*').order('created_at',{ascending:false});
  const typeColors = {info:'var(--blue)',warning:'var(--accent)',success:'var(--green)',urgent:'var(--red)'};

  el.innerHTML = `
    <div class="sh"><h2>📣 Duyuru Yönetimi</h2>
      <button class="btn btn-accent" onclick="openAnnounceModal()">+ Duyuru Ekle</button>
    </div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Aktif duyurular tüm kullanıcıların ana ekranında gösterilir.</div>
    ${(data||[]).length===0?'<div class="empty"><p>Henüz duyuru yok</p></div>':''}
    ${(data||[]).map(a=>`
      <div class="card" style="padding:16px 20px;margin-bottom:10px;border-left:3px solid ${typeColors[a.type]||'var(--accent)'}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div style="flex:1">
            <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:4px">${esc(a.title)}</div>
            <div style="font-size:13px;color:var(--text-mid);margin-bottom:8px">${esc(a.body)}</div>
            <div style="display:flex;gap:8px">
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${typeColors[a.type]+'22'};color:${typeColors[a.type]}">${a.type}</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:var(--surface2);color:var(--text-dim)">${a.target}</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${a.active?'var(--green-dim)':'var(--red-dim)'};color:${a.active?'var(--green)':'var(--red)'}">${a.active?'Aktif':'Pasif'}</span>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-xs" onclick="toggleAnnounce('${a.id}',${!a.active})">${a.active?'Pasife Al':'Aktifleştir'}</button>
            <button class="btn btn-danger btn-xs" onclick="devDeleteAnnounce('${a.id}')">🗑</button>
          </div>
        </div>
      </div>`).join('')}`;
}

function openAnnounceModal() {
  let modal = document.getElementById('announceModal');
  if(!modal) {
    modal = document.createElement('div'); modal.id='announceModal'; modal.className='modal-bg';
    modal.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('announceModal')">×</button>
      <h2>Yeni Duyuru</h2>
      <div class="field"><label>Başlık</label><input id="anTitle" placeholder="Önemli Güncelleme"></div>
      <div class="field"><label>İçerik</label><textarea id="anBody" placeholder="Duyuru metni..."></textarea></div>
      <div class="field-row">
        <div class="field"><label>Tür</label><select id="anType"><option value="info">Bilgi</option><option value="warning">Uyarı</option><option value="success">Başarı</option><option value="urgent">Acil</option></select></div>
        <div class="field"><label>Hedef</label><select id="anTarget"><option value="all">Herkes</option><option value="students">Öğrenciler</option><option value="coaches">Koçlar</option></select></div>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveAnnounce()">Yayınla</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  om('announceModal');
}

async function saveAnnounce() {
  const title = document.getElementById('anTitle').value.trim();
  const body = document.getElementById('anBody').value.trim();
  if(!title||!body) return showToast('Başlık ve içerik zorunlu!');
  await db.from('announcements').insert({title,body,type:document.getElementById('anType').value,target:document.getElementById('anTarget').value,active:true});
  showToast('Duyuru yayınlandı ✓'); cm('announceModal'); renderDevAnnounce();
}

async function toggleAnnounce(id, active) {
  await db.from('announcements').update({active}).eq('id',id);
  renderDevAnnounce();
}

async function devDeleteAnnounce(id) {
  if(!await customConfirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;
  await db.from('announcements').delete().eq('id',id);
  showToast('Silindi'); renderDevAnnounce();
}

// ── DESTEK / TİCKET ───────────────────────────
let _chatPollInterval = null;
let _activeTicketId = null;
let _selectedDevTicketId = null;
let _devChatPollInterval = null;
let _devTicketsList = [];
let _supportMessagesList = [];
let _chatState = 'welcome'; // 'welcome', 'ai', 'emin', 'emin_start'

async function renderDevTickets() {
  const el = document.getElementById('view-dev-tickets');
  if (!el) return;

  const { data, error } = await db.from('tickets')
    .select('*,users!tickets_user_id_fkey(full_name,role)')
    .order('updated_at', { ascending: false });

  _devTicketsList = data || [];

  if (!_selectedDevTicketId && _devTicketsList.length > 0) {
    _selectedDevTicketId = _devTicketsList[0].id;
  }

  el.innerHTML = `
    <div class="sh" style="margin-bottom:12px">
      <h2>🎫 Destek & Geri Bildirim Masası</h2>
    </div>

    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; height: 600px; max-height: calc(100vh - 180px); margin-top: 10px">
      <!-- Left Pane: Chats List -->
      <div style="overflow-y: auto; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 8px; padding: 12px">
        <div style="font-size: 11px; font-weight:800; color:var(--text-dim); text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px">Konuşmalar</div>
        ${_devTicketsList.length === 0 ? `
          <div style="text-align:center; padding:40px 10px; color:var(--text-dim); font-size:12px">Kayıtlı destek talebi yok.</div>
        ` : _devTicketsList.map(t => {
          const isSelected = t.id === _selectedDevTicketId;
          const userLabel = t.users?.full_name || 'Kullanıcı';
          const userRole = t.users?.role === 'coach' ? 'KOÇ' : t.users?.role === 'parent' ? 'VELİ' : 'ÖĞRENCİ';
          
          let lastMsg = 'Mesaj yok';
          try {
            const parsed = JSON.parse(t.body);
            if (Array.isArray(parsed) && parsed.length > 0) {
              lastMsg = parsed[parsed.length - 1].text;
            } else {
              lastMsg = t.body;
            }
          } catch(e) {
            lastMsg = t.body;
          }

          const lastMsgSnippet = lastMsg.length > 28 ? lastMsg.slice(0, 26) + '...' : lastMsg;
          const statusBadge = t.status === 'open' 
            ? '<span style="font-size:9px; background:#ef444422; color:#ef4444; padding:2px 6px; border-radius:99px; font-weight:700">Yeni</span>' 
            : t.status === 'resolved'
            ? '<span style="font-size:9px; background:#10b98122; color:#10b981; padding:2px 6px; border-radius:99px; font-weight:700">Cevaplandı</span>'
            : '<span style="font-size:9px; background:var(--border2); color:var(--text-dim); padding:2px 6px; border-radius:99px; font-weight:700">Kapatıldı</span>';

          const bg = isSelected ? 'var(--accent-dim)' : 'var(--surface)';
          const border = isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)';
          const padding = isSelected ? '10px 11px' : '10px 12px';

          return `
            <div onclick="selectDevTicket('${t.id}')" style="background:${bg}; border:${border}; border-radius:10px; padding:${padding}; cursor:pointer; display:flex; flex-direction:column; gap:4px; transition:all .15s">
              <div style="display:flex; justify-content:space-between; align-items:center">
                <span style="font-weight:700; font-size:12px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px">${esc(userLabel)}</span>
                <span style="font-size:9px; font-weight:800; color:var(--text-dim)">${userRole}</span>
              </div>
              <div style="font-size:11px; color:var(--text-mid); overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${esc(lastMsgSnippet)}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px">
                <span style="font-size:9px; color:var(--text-dim)">${new Date(t.updated_at).toLocaleDateString('tr-TR')}</span>
                ${statusBadge}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Right Pane: Active Chat Area -->
      <div id="devChatArea" style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden">
        <!-- Rendered dynamically by loadDevChatArea() -->
      </div>
    </div>
  `;

  loadDevChatArea();

  if (_devChatPollInterval) clearInterval(_devChatPollInterval);
  _devChatPollInterval = setInterval(pollActiveDevChat, 4000);
}

function selectDevTicket(id) {
  _selectedDevTicketId = id;
  renderDevTickets();
}

async function pollActiveDevChat() {
  if (!_selectedDevTicketId) return;
  const area = document.getElementById('devChatArea');
  if (!area) return;

  const { data: ticket, error } = await db.from('tickets')
    .select('*,users!tickets_user_id_fkey(full_name,role)')
    .eq('id', _selectedDevTicketId)
    .single();

  if (error || !ticket) return;

  let parsedMessages = [];
  try {
    parsedMessages = JSON.parse(ticket.body);
    if (!Array.isArray(parsedMessages)) {
      parsedMessages = [{ sender: 'user', text: ticket.body, time: ticket.created_at }];
    }
  } catch(e) {
    parsedMessages = [{ sender: 'user', text: ticket.body, time: ticket.created_at }];
  }

  const msgsContainer = document.getElementById('devChatMessages');
  if (msgsContainer) {
    const currentScroll = msgsContainer.scrollTop;
    const isNearBottom = msgsContainer.scrollHeight - msgsContainer.clientHeight - currentScroll < 40;

    msgsContainer.innerHTML = parsedMessages.map(m => {
      const isMe = m.sender === 'emin';
      const senderName = isMe ? 'Kurucu / Destek' : m.sender === 'ai' ? 'Yapay Zeka' : m.name || 'Kullanıcı';
      const bg = isMe ? 'var(--blue)' : m.sender === 'ai' ? 'var(--surface2)' : 'var(--accent)';
      const color = isMe ? '#fff' : m.sender === 'ai' ? 'var(--text)' : 'var(--on-accent)';
      const align = isMe ? 'flex-end' : 'flex-start';
      const borderRadius = isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px';
      const timeFormatted = new Date(m.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      return `
        <div style="align-self:${align}; max-width:80%; display:flex; flex-direction:column; align-items:${isMe ? 'flex-end' : 'flex-start'}">
          <div style="font-size:10px; color:var(--text-dim); margin-bottom:3px; font-weight:600">${senderName}</div>
          <div style="padding:10px 14px; border-radius:${borderRadius}; background:${bg}; color:${color}; font-size:13px; line-height:1.5; word-wrap:break-word; white-space:pre-wrap">${esc(m.text)}</div>
          <div style="font-size:9px; color:var(--text-dim); margin-top:4px">${timeFormatted}</div>
        </div>
      `;
    }).join('');

    if (isNearBottom) {
      msgsContainer.scrollTop = msgsContainer.scrollHeight;
    }
  }
}

function loadDevChatArea() {
  const area = document.getElementById('devChatArea');
  if (!area) return;

  const t = _devTicketsList.find(x => x.id === _selectedDevTicketId);
  if (!t) {
    area.innerHTML = `
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--text-dim); padding:20px; text-align:center">
        <div style="font-size:48px; margin-bottom:12px">🎫</div>
        <div style="font-weight:700">Aktif Sohbet Seçilmedi</div>
        <div style="font-size:12px; margin-top:4px">Soldaki listeden bir destek sohbeti seçerek yanıtlayabilirsiniz.</div>
      </div>
    `;
    return;
  }

  const userLabel = t.users?.full_name || 'Kullanıcı';
  const userRole = t.users?.role === 'coach' ? 'KOÇ' : t.users?.role === 'parent' ? 'VELİ' : 'ÖĞRENCİ';

  let parsedMessages = [];
  try {
    parsedMessages = JSON.parse(t.body);
    if (!Array.isArray(parsedMessages)) {
      parsedMessages = [{ sender: 'user', text: t.body, time: t.created_at }];
    }
  } catch(e) {
    parsedMessages = [{ sender: 'user', text: t.body, time: t.created_at }];
  }

  area.innerHTML = `
    <!-- Active Chat Header -->
    <div style="padding:14px 20px; border-bottom: 1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface2)">
      <div>
        <div style="font-weight:800; font-size:14px; color:var(--text)">${esc(userLabel)} <span style="font-size:10px; font-weight:700; color:var(--text-dim); margin-left:6px">${userRole}</span></div>
        <div style="font-size:11px; color:var(--text-mid); margin-top:2px">Konu: ${esc(t.subject)}</div>
      </div>
      <div style="display:flex; gap:10px; align-items:center">
        <select onchange="updateTicketStatus('${t.id}',this.value)" style="background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:6px 12px; font-size:12px; color:var(--text); cursor:pointer; outline:none">
          <option value="open" ${t.status==='open'?'selected':''}>Açık (İşlem Bekliyor)</option>
          <option value="resolved" ${t.status==='resolved'?'selected':''}>Cevaplandı / Çözüldü</option>
          <option value="closed" ${t.status==='closed'?'selected':''}>Kapatıldı</option>
        </select>
        <button class="btn btn-danger btn-xs" onclick="devDeleteTicket('${t.id}')" style="padding:6px; border-radius:8px">🗑</button>
      </div>
    </div>

    <!-- Message Logs -->
    <div id="devChatMessages" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; background:var(--surface)">
      ${parsedMessages.map(m => {
        const isMe = m.sender === 'emin';
        const senderName = isMe ? 'Kurucu / Destek' : m.sender === 'ai' ? 'Yapay Zeka' : m.name || 'Kullanıcı';
        const bg = isMe ? 'var(--blue)' : m.sender === 'ai' ? 'var(--surface2)' : 'var(--accent)';
        const color = isMe ? '#fff' : m.sender === 'ai' ? 'var(--text)' : 'var(--on-accent)';
        const align = isMe ? 'flex-end' : 'flex-start';
        const borderRadius = isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px';
        const timeFormatted = new Date(m.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        return `
          <div style="align-self:${align}; max-width:80%; display:flex; flex-direction:column; align-items:${isMe ? 'flex-end' : 'flex-start'}">
            <div style="font-size:10px; color:var(--text-dim); margin-bottom:3px; font-weight:600">${senderName}</div>
            <div style="padding:10px 14px; border-radius:${borderRadius}; background:${bg}; color:${color}; font-size:13px; line-height:1.5; word-wrap:break-word; white-space:pre-wrap">${esc(m.text)}</div>
            <div style="font-size:9px; color:var(--text-dim); margin-top:4px">${timeFormatted}</div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Footer Reply Input -->
    <div style="padding:12px 16px; border-top:1px solid var(--border); display:flex; gap:8px; background:var(--surface2); align-items:flex-end">
      <textarea id="devReplyInput" placeholder="Sohbete yanıt yazın..." rows="1" style="flex:1; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:10px 14px; font-size:13px; font-family:inherit; color:var(--text); resize:none; max-height:80px; outline:none" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendDevReply()}"></textarea>
      <button class="btn btn-accent" onclick="sendDevReply()" style="padding:8px 16px; font-size:13px; border-radius:10px; align-self:stretch; justify-content:center">Gönder</button>
    </div>
  `;

  const msgsContainer = document.getElementById('devChatMessages');
  if (msgsContainer) msgsContainer.scrollTop = msgsContainer.scrollHeight;
}

async function sendDevReply() {
  const input = document.getElementById('devReplyInput');
  const text = input.value.trim();
  if (!text || !_selectedDevTicketId) return;

  input.value = '';

  showLoading(true);
  const { data: ticket } = await db.from('tickets').select('body').eq('id', _selectedDevTicketId).single();
  let currentHistory = [];
  if (ticket && ticket.body) {
    try {
      currentHistory = JSON.parse(ticket.body);
    } catch(e) {
      currentHistory = [{ sender: 'user', text: ticket.body, time: new Date().toISOString() }];
    }
  }

  const replyMsg = {
    sender: 'emin',
    text,
    time: new Date().toISOString(),
    name: 'Kurucu / Destek'
  };

  currentHistory.push(replyMsg);

  const { error } = await db.from('tickets')
    .update({ 
      body: JSON.stringify(currentHistory), 
      reply: text, 
      status: 'resolved', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', _selectedDevTicketId);

  showLoading(false);

  if (error) {
    showToast('Hata: ' + error.message);
    return;
  }

  showToast('Yanıt gönderildi ✓');
  renderDevTickets();
}

async function updateTicketStatus(id, status) {
  await db.from('tickets').update({status, updated_at: new Date().toISOString()}).eq('id',id);
  showToast('Durum güncellendi ✓');
  renderDevTickets();
}

async function devDeleteTicket(id) {
  if(!await customConfirm('Bu talebi silmek istediğinizden emin misiniz?')) return;
  await db.from('tickets').delete().eq('id',id);
  showToast('Silindi');
  _selectedDevTicketId = null;
  renderDevTickets();
}

function openSupportTicket() {
  openSupportChat();
}

async function openSupportChat() {
  let modal = document.getElementById('supportChatModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'supportChatModal';
    modal.className = 'modal-bg';
    modal.style.zIndex = '99999999';
    modal.innerHTML = `
      <div class="modal" style="max-width:500px;width:100%;height:600px;display:flex;flex-direction:column;padding:0;overflow:hidden;border-radius:18px;border:1px solid var(--border)">
        <!-- Header -->
        <div style="padding:16px 20px;background:linear-gradient(135deg,rgba(240,165,0,.1),rgba(232,98,42,.05));border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">💬</span>
            <div>
              <div style="font-weight:800;font-size:15px;color:var(--text)">Rostrum Destek Merkezi</div>
              <div style="font-size:11px;color:var(--green);font-weight:700" id="supportStatusLabel">● Çevrimiçi Asistan</div>
            </div>
          </div>
          <button class="modal-close" onclick="closeSupportChat()" style="position:static;font-size:22px;background:none;border:none;color:var(--text-mid);cursor:pointer;padding:4px">✕</button>
        </div>

        <!-- Chat messages view -->
        <div id="supportMessages" style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;background:var(--surface)">
          <!-- Dynamic Messages -->
        </div>

        <!-- Typing Indicator -->
        <div id="supportTyping" class="ai-typing" style="margin: 0 20px 10px; padding:8px 12px; border-radius:10px; display:none; gap:4px; align-items:center; background:var(--surface2)">
          <span></span><span></span><span></span>
        </div>

        <!-- Footer input bar -->
        <div style="padding:12px 16px;border-top:1px solid var(--border);display:flex;gap:8px;align-items:flex-end;background:var(--surface2)">
          <textarea id="supportInput" placeholder="Mesajınızı yazın..." rows="1" style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 14px;font-size:13px;font-family:inherit;color:var(--text);resize:none;max-height:80px;outline:none" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendSupportMessage()}"></textarea>
          <button class="btn btn-accent" onclick="sendSupportMessage()" style="padding:8px 16px;font-size:13px;border-radius:10px;align-self:stretch;justify-content:center">Gönder</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => {
      const isBlocked = document.getElementById('trialExpiredModal')?.classList.contains('open');
      if (e.target === modal && !isBlocked) {
        closeSupportChat();
      }
    });
  }

  om('supportChatModal');
  await refreshSupportMessages();

  if (_chatPollInterval) clearInterval(_chatPollInterval);
  _chatPollInterval = setInterval(refreshSupportMessages, 4000);
}

function closeSupportChat() {
  cm('supportChatModal');
  if (_chatPollInterval) {
    clearInterval(_chatPollInterval);
    _chatPollInterval = null;
  }
}

async function refreshSupportMessages() {
  const userId = session.dbUser?.id;
  if (!userId) return;

  const msgsContainer = document.getElementById('supportMessages');
  if (!msgsContainer) return;

  const { data: tickets, error } = await db.from('tickets')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching ticket:', error);
    return;
  }

  const activeTicket = tickets && tickets[0];

  if (activeTicket) {
    _activeTicketId = activeTicket.id;
    _chatState = 'emin';
    
    const statusLabelEl = document.getElementById('supportStatusLabel');
    if (statusLabelEl) statusLabelEl.textContent = '● Kurucu / Destek Ekibi';

    let parsedMessages = [];
    try {
      parsedMessages = JSON.parse(activeTicket.body);
      if (!Array.isArray(parsedMessages)) {
        parsedMessages = [{ sender: 'user', text: activeTicket.body, time: activeTicket.created_at }];
      }
    } catch(e) {
      parsedMessages = [{ sender: 'user', text: activeTicket.body, time: activeTicket.created_at }];
    }

    if (activeTicket.reply && parsedMessages[parsedMessages.length - 1]?.text !== activeTicket.reply) {
      parsedMessages.push({ sender: 'emin', text: activeTicket.reply, time: activeTicket.updated_at });
    }

    renderSupportMessagesList(parsedMessages);
  } else {
    if (_chatState === 'welcome') {
      const statusLabelEl = document.getElementById('supportStatusLabel');
      if (statusLabelEl) statusLabelEl.textContent = '● Çevrimiçi Asistan';

      msgsContainer.innerHTML = `
        <div style="text-align:center;padding:40px 20px">
          <div style="font-size:48px;margin-bottom:12px">🎓</div>
          <div style="font-size:16px;font-weight:700;margin-bottom:6px;color:var(--text)">Rostrum Destek Asistanına Hoş Geldiniz!</div>
          <div style="font-size:12px;color:var(--text-mid);line-height:1.6;margin-bottom:24px">
            Uygulama ile ilgili teknik, pedagojik veya fiyatlandırma sorularınızı sorabilirsiniz.
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;align-items:stretch;max-width:280px;margin:0 auto">
            <button class="btn btn-accent" onclick="startAISupportChat()" style="justify-content:center;padding:10px;font-size:13px">
              🤖 Yapay Zeka Asistanı ile Konuş
            </button>
            <button class="btn btn-ghost" onclick="startEminSupportChat()" style="justify-content:center;padding:10px;font-size:13px;border-color:var(--border)">
              ✉️ Kurucuya / Destek Ekibine Yaz
            </button>
          </div>
        </div>
      `;
    } else if (_chatState === 'ai') {
      const statusLabelEl = document.getElementById('supportStatusLabel');
      if (statusLabelEl) statusLabelEl.textContent = '● Yapay Zeka';
      renderSupportMessagesList(_supportMessagesList);
    }
  }
}

function renderSupportMessagesList(list) {
  const msgsContainer = document.getElementById('supportMessages');
  if (!msgsContainer) return;

  const currentScroll = msgsContainer.scrollTop;
  const isNearBottom = msgsContainer.scrollHeight - msgsContainer.clientHeight - currentScroll < 40;

  msgsContainer.innerHTML = list.map(m => {
    const isMe = m.sender === 'user';
    const senderName = isMe ? 'Siz' : m.sender === 'ai' ? 'Yapay Zeka Asistanı' : 'Kurucu / Destek Ekibi';
    const bg = isMe ? 'var(--accent)' : 'var(--surface2)';
    const border = isMe ? 'none' : '1px solid var(--border)';
    const textColor = isMe ? 'var(--on-accent)' : 'var(--text)';
    const align = isMe ? 'flex-end' : 'flex-start';
    const borderRadius = isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px';
    const timeFormatted = new Date(m.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    return `
      <div style="align-self:${align};max-width:80%;display:flex;flex-direction:column;align-items:${isMe ? 'flex-end' : 'flex-start'}">
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;font-weight:600">${senderName}</div>
        <div style="padding:10px 14px;border-radius:${borderRadius};background:${bg};border:${border};color:${textColor};font-size:13px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap">${esc(m.text)}</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:4px">${timeFormatted}</div>
      </div>
    `;
  }).join('');

  if (isNearBottom) {
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }
}

function startAISupportChat() {
  _chatState = 'ai';
  _supportMessagesList = [{
    sender: 'ai',
    text: 'Merhaba! Ben Rostrum Akademi Yapay Zeka Asistanıyım. 🤖 Size nasıl yardımcı olabilirim?',
    time: new Date().toISOString()
  }];
  renderSupportMessagesList(_supportMessagesList);
}

function startEminSupportChat() {
  _chatState = 'emin_start';
  const msgsContainer = document.getElementById('supportMessages');
  if (msgsContainer) {
    msgsContainer.innerHTML = `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:48px;margin-bottom:12px">✉️</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:6px;color:var(--text)">Kurucuya / Destek Ekibine Yaz</div>
        <div style="font-size:12px;color:var(--text-mid);line-height:1.6;margin-bottom:24px">
          Soru, görüş veya abonelik taleplerinizi iletin. Kurucu ekibimiz mesajlarınızı inceleyip en kısa sürede bu ekrandan yanıtlayacaktır.
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;max-width:320px;margin:0 auto">
          <input type="text" id="eminSubject" placeholder="Konu (Örn: Paket Satın Alma)" style="padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px">
          <textarea id="eminInitialMessage" placeholder="Mesajınız..." style="padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);min-height:80px;font-size:13px"></textarea>
          <button class="btn btn-accent" onclick="submitEminInitialMessage()" style="justify-content:center;padding:10px;font-size:13px">
            Gönder ve Bağlan
          </button>
        </div>
      </div>
    `;
  }
}

async function submitEminInitialMessage() {
  const subjectInput = document.getElementById('eminSubject');
  const msgInput = document.getElementById('eminInitialMessage');
  const subject = subjectInput ? subjectInput.value.trim() : 'Müşteri Destek Sohbeti';
  const text = msgInput ? msgInput.value.trim() : '';

  if (!text) return showToast('Mesaj boş olamaz!');

  const userId = session.dbUser?.id;
  const name = session.dbUser?.full_name || 'Kullanıcı';

  const initialMessage = {
    sender: 'user',
    text,
    time: new Date().toISOString(),
    name
  };

  showLoading(true);
  const { data, error } = await db.from('tickets').insert({
    user_id: userId,
    subject,
    body: JSON.stringify([initialMessage]),
    category: 'emin',
    status: 'open'
  }).select().single();
  showLoading(false);

  if (error) {
    showToast('Hata: ' + error.message);
    return;
  }

  _activeTicketId = data.id;
  _chatState = 'emin';
  showToast('Talebiniz destek ekibine iletildi ✓');
  await refreshSupportMessages();
}

async function sendSupportMessage() {
  const input = document.getElementById('supportInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';

  if (_chatState === 'ai') {
    const userMsg = { sender: 'user', text, time: new Date().toISOString() };
    _supportMessagesList.push(userMsg);
    renderSupportMessagesList(_supportMessagesList);

    const typing = document.getElementById('supportTyping');
    if (typing) typing.style.display = 'flex';

    try {
      const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? '/api/ai-chat'
        : '/api/ai-chat';
      
      const formattedHistory = _supportMessagesList.slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          messages: formattedHistory,
          context: {},
          userRole: 'parent' // Arayüzde müşteri temsilcisi gibi yanıt vermesi için parent/vasi rolüyle benzer sistem promptu
        })
      });

      let reply = '';
      if (response.ok) {
        const data = await response.json();
        reply = data.reply;
      } else {
        reply = await callGeminiFallback(text, {}, session.role || 'coach');
      }
      _supportMessagesList.push({ sender: 'ai', text: reply, time: new Date().toISOString() });
    } catch(e) {
      try {
        const reply = await callGeminiFallback(text, {}, session.role || 'coach');
        _supportMessagesList.push({ sender: 'ai', text: reply, time: new Date().toISOString() });
      } catch (e2) {
        _supportMessagesList.push({ sender: 'ai', text: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya doğrudan destek ekibimize mesaj gönderin.', time: new Date().toISOString() });
      }
    } finally {
      if (typing) typing.style.display = 'none';
      renderSupportMessagesList(_supportMessagesList);
    }
  } else if (_chatState === 'emin') {
    const name = session.dbUser?.full_name || 'Kullanıcı';
    const userMsg = { sender: 'user', text, time: new Date().toISOString(), name };

    showLoading(true);
    const { data: ticket } = await db.from('tickets').select('body').eq('id', _activeTicketId).single();
    let currentHistory = [];
    if (ticket && ticket.body) {
      try {
        currentHistory = JSON.parse(ticket.body);
      } catch(e) {
        currentHistory = [{ sender: 'user', text: ticket.body, time: new Date().toISOString(), name }];
      }
    }
    currentHistory.push(userMsg);

    const { error } = await db.from('tickets')
      .update({ body: JSON.stringify(currentHistory), status: 'open', updated_at: new Date().toISOString() })
      .eq('id', _activeTicketId);

    showLoading(false);
    if (error) {
      showToast('Gönderim hatası: ' + error.message);
      return;
    }
    await refreshSupportMessages();
  }
}

// Duyuruları portal'da göster
async function loadAnnouncements() {
  const {data} = await db.from('announcements').select('*').eq('active',true);
  const target = session.role;
  const relevant = (data||[]).filter(a=>a.target==='all'||(a.target==='students'&&target==='student')||(a.target==='coaches'&&target==='coach'));
  if(!relevant.length) return;
  const typeColors = {info:'var(--blue)',warning:'var(--accent)',success:'var(--green)',urgent:'var(--red)'};
  const container = document.createElement('div');
  container.style.cssText='position:fixed;top:64px;right:16px;z-index:400;display:flex;flex-direction:column;gap:8px;max-width:340px';
  container.id='announceBanner';
  relevant.slice(0,3).forEach(a=>{
    const el=document.createElement('div');
    el.style.cssText=`background:var(--surface);border:1px solid var(--border);border-left:3px solid ${typeColors[a.type]||'var(--accent)'};border-radius:10px;padding:12px 14px;box-shadow:var(--shadow);animation:fadeUp .3s ease`;
    el.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div><div style="font-size:13px;font-weight:700;margin-bottom:3px">${esc(a.title)}</div><div style="font-size:12px;color:var(--text-mid)">${esc(a.body)}</div></div>
      <button onclick="this.closest('div[style]').remove()" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:16px;flex-shrink:0">×</button>
    </div>`;
    container.appendChild(el);
  });
  document.body.appendChild(container);
  setTimeout(()=>container.remove(), 8000);
}

// ── DEVELOPER saveStudent override ─────────────
// saveStudent'ın orijinali yukarıda tanımlı, developer için genişletiyoruz
const _devSaveStudent = saveStudent;
// Not: saveStudentDev fonksiyonunun asıl güncel tanımı dosyanın ilerleyen kısımlarında yer almaktadır.


// ── CSS for developer role badge ───────────────
(()=>{
  const s=document.createElement('style');
  s.textContent='.role-dev{background:rgba(192,132,252,.15);color:#c084fc;}';
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// İLK GÜN KARŞILAMA SİHİRBAZI (WELCOME TOUR)
// ═══════════════════════════════════════════════
function showOnboarding() {
  let modal = document.getElementById('onboardingModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'onboardingModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)';
    document.body.appendChild(modal);
  }
  renderOnboardingStep(0, modal);
}

const onboardingSteps = [
  {
    icon: '👋',
    title: 'Rostrum Akademi\'ye Hoş Geldiniz! 🎓',
    body: `Sizinle birlikte büyümek ve platformumuzu geliştirmek bizim en büyük tutkumuz.<br><br>
           <b>Önemli Not:</b> Rostrum Akademi, siz koçlarımızın değerli geri bildirimleriyle sürekli gelişen canlı bir sistemdir. Her türlü görüş, eleştiri ve özellik talebinizi bizimle paylaşmaktan lütfen çekinmeyin. Birlikte en verimli eğitim ortamını inşa edeceğiz!`,
    nextLabel: 'Özellikleri İncele →'
  },
  {
    icon: '⚡',
    title: 'Işık Hızında SPA Performansı 🚀',
    body: `Rostrum Akademi, modern Tek Sayfa Uygulaması (SPA) mimarisiyle sıfır gecikme ile ışık hızında çalışır.<br><br>
           Tüm paneller, filtreler ve öğrenci profilleri arasında geçiş yaparken sayfa yenilenmesini beklemez, zaman kaybetmeden işlerinizi yönetirsiniz.`,
    nextLabel: 'Devam →'
  },
  {
    icon: '📅',
    title: 'Haftalık Program & D1Y1B Takibi 📋',
    body: `Öğrencilerinizin haftalık ders programlarını hazırlayabilir, günlük ders ve soru hedefleri atayabilirsiniz.<br><br>
           Öğrencileriniz günlük ödevlerini tamamlayıp Doğru, Yanlış, Boş (D1Y1B) net girişlerini yaptıkça, tüm ilerlemeyi anlık olarak takip edebilirsiniz.`,
    nextLabel: 'Devam →'
  },
  {
    icon: '📊',
    title: 'Gelişmiş Denemeler & Grafik Analizi 📈',
    body: `TYT, AYT, LGS, KPSS ve ALES deneme sınavı sonuçlarını detaylıca kaydedin.<br><br>
           Zengin interaktif grafiklerle net gelişimini izleyin, ders ve konu bazlı boş/yanlış analizleriyle öğrencinin eksiklerini anında tespit edin.`,
    nextLabel: 'Devam →'
  },
  {
    icon: '🤖',
    title: 'Yapay Zeka Destekli Asistan ve Copilot 🧠',
    body: `Öğrencilerinizin 7/24 akademik sorularını sokratik yöntemle çözen **AI Ders Asistanı**, veliler için **AI Veli Asistanı** ve sizin için öğrenci analizleri hazırlayan **AI Copilot** her an hizmetinizde!`,
    nextLabel: 'Devam →'
  },
  {
    icon: '🗓️',
    title: 'FullCalendar Ajanda & Tek Tıkla Ders 🕒',
    body: `Yeni FullCalendar entegrasyonu sayesinde koçluk seanslarınızı ve toplantılarınızı takvim üzerinde sürükle-bırak kolaylığıyla planlayın.<br><br>
           Ders saati yaklaştığında sistemdeki "Derse Katıl" butonuyla Zoom/Meet derslerini tek tıkla başlatın.`,
    nextLabel: 'Hadi Başlayalım! 🚀',
    isCompletion: true
  }
];

let _obStep = 0;

function renderOnboardingStep(step, modal) {
  _obStep = step;
  const s = onboardingSteps[step];
  const total = onboardingSteps.length;
  const dots = Array.from({length:total},(_,i)=>`<div style="width:${i===step?24:8}px;height:8px;border-radius:99px;background:${i===step?'var(--accent)':'var(--border2)'};transition:width .3s"></div>`).join('');

  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border2);border-radius:24px;width:100%;max-width:480px;padding:40px;animation:fadeUp .3s ease;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg)">
    <div style="text-align:center;margin-bottom:28px">
      <div style="font-size:52px;margin-bottom:12px">${s.icon}</div>
      <h3 style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--text);margin-bottom:12px;line-height:1.3">${s.title}</h3>
      <p style="font-size:14px;color:var(--text-mid);line-height:1.6">${s.body}</p>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px;margin-top:28px">
      <button class="btn btn-accent" style="width:100%;padding:14px;font-weight:700" onclick="advanceOnboarding(${step},false)">${s.nextLabel}</button>
      <div style="display:flex;gap:6px;justify-content:center;margin-top:20px">${dots}</div>
    </div>
  </div>`;
}

async function advanceOnboarding(step, skip) {
  const modal = document.getElementById('onboardingModal');
  if (!modal) return;

  // Completion adımındaysa ("Hadi Başlayalım!") → onayla ve kapat
  if(onboardingSteps[step]?.isCompletion) {
    showLoading(true);
    try {
      const { error } = await db.from('workspaces').update({ onboarding_done: true }).eq('coach_id', session.coachId);
      if (error) throw error;
      if (S.workspace) S.workspace.onboarding_done = true;
      modal.remove();
      switchTab('home');
      showToast('🎉 Hoş geldiniz! Platformunuz hazır.');
    } catch(e) {
      showToast('Hata: ' + e.message);
    } finally {
      showLoading(false);
    }
    return;
  }

  const nextStep = step + 1;
  renderOnboardingStep(nextStep, modal);
}

// ═══════════════════════════════════════════════
// PWA — Telefona Yükle
// ═══════════════════════════════════════════════
let _pwaPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _pwaPrompt = e;
  // Topbar'a "Uygulamayı Yükle" butonu ekle
  const btn = document.createElement('button');
  btn.id = 'pwaInstallBtn';
  btn.className = 'btn btn-ghost btn-sm';
  btn.innerHTML = '📲 Yükle';
  btn.style.cssText = 'font-size:11px;padding:5px 10px';
  btn.onclick = async () => {
    _pwaPrompt.prompt();
    const {outcome} = await _pwaPrompt.userChoice;
    if(outcome==='accepted') { btn.remove(); showToast('Uygulama yüklendi ✓'); }
  };
  document.querySelector('.tbar-right').insertBefore(btn, document.querySelector('.user-pill'));
});

// ═══════════════════════════════════════════════
// STUDENT PROFILE PAGE
// ═══════════════════════════════════════════════
async function renderSProfil() {
  const stu = S.students.find(s=>s.id===session.studentId);
  if(!stu) return;
  const el = document.getElementById('view-sprofil');
  if(!el) return;

  // Profil detaylarını Supabase'den yükle
  const { data: profile, error: profErr } = await db.from('student_profiles').select('*').eq('id', session.studentId).maybeSingle();
  if (profErr) {
    console.error('Öğrenci profili yüklenirken hata:', profErr);
  }

  const bio = profile?.bio || '';
  const school = profile?.school || '';
  const grade = profile?.grade || '';
  const target_university = profile?.target_university || '';
  const target_department = profile?.target_department || '';
  const struggling_subjects = profile?.struggling_subjects || '';
  const daily_capacity = profile?.daily_capacity || '';

  // Stats
  const myExams = S.exams.filter(e=>e.studentId===stu.id).sort((a,b)=>a.date.localeCompare(b.date));
  const lastExam = myExams[myExams.length-1];
  const lastTotal = lastExam ? (()=>{const f=EXAM_DEFS[lastExam.type]||[];return f.reduce((s,fn)=>s+Number(lastExam.nets?.[fn]||0),0).toFixed(1);})() : '—';

  // Haftalık tamamlama
  const ws = getWeekStart(0, stu.weekStart??0);
  let weekTotal=0, weekDone=0;
  for(let i=0;i<7;i++){
    const tasks=S.tasks[`${stu.id}_${fmtDate(addDays(ws,i))}`]||[];
    weekTotal+=tasks.length; weekDone+=tasks.filter(t=>t.done).length;
  }
  const weekPct = weekTotal>0?Math.round((weekDone/weekTotal)*100):0;

  // Toplam tamamlanan görev (tüm zamanlar)
  let totalDone=0;
  Object.keys(S.tasks).filter(k=>k.startsWith(stu.id+'_')).forEach(k=>{ totalDone+=S.tasks[k].filter(t=>t.done).length; });

  // Deneme trendi
  let trendHtml='';
  if(myExams.length>0){
    const chartData=myExams.slice(-6);
    const maxT=Math.max(...chartData.map(e=>{const f=EXAM_DEFS[e.type]||[];return f.reduce((s,fn)=>s+Number(e.nets?.[fn]||0),0);}),1);
    trendHtml=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📈 Net Gelişim Grafiği</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:90px;margin-top:12px">
          ${chartData.map(e=>{
            const f=EXAM_DEFS[e.type]||[];
            const total=f.reduce((s,fn)=>s+Number(e.nets?.[fn]||0),0);
            const h=Math.max(Math.round((total/maxT)*100),4);
            const prev=chartData[chartData.indexOf(e)-1];
            const prevT=prev?(EXAM_DEFS[prev.type]||[]).reduce((s,fn)=>s+Number(prev.nets?.[fn]||0),0):total;
            const arrow=total>prevT?'↑':total<prevT?'↓':'';
            const arrowColor=total>prevT?'var(--green)':total<prevT?'var(--red)':'var(--text-dim)';
            return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
              <div style="font-size:10px;font-weight:700;color:var(--text-mid)">${total.toFixed(0)}</div>
              <div style="font-size:9px;color:${arrowColor};font-weight:800">${arrow}</div>
              <div style="width:100%;background:${stu.color};border-radius:4px 4px 0 0;height:${h}%;min-height:4px"></div>
              <div style="font-size:9px;color:var(--text-dim);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%">${esc(e.name.replace('Deneme','').replace('TYT','').replace('AYT','').trim())}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  // Ders bazında net ortalamaları
  let dersOrtHtml='';
  if(myExams.length>0){
    const lastType=lastExam.type;
    const fields=EXAM_DEFS[lastType]||[];
    const avgs=fields.map(f=>{
      const vals=myExams.filter(e=>e.type===lastType).map(e=>Number(e.nets?.[f]||0));
      const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;
      const last=Number(lastExam.nets?.[f]||0);
      return {f,avg:avg.toFixed(1),last,color:netColor(last)};
    });
    dersOrtHtml=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📊 Ders Bazında Performans (${lastType})</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:10px">
          ${avgs.map(a=>`
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px;text-align:center">
              <div style="font-size:10px;color:var(--text-dim);font-weight:700;margin-bottom:4px;text-transform:uppercase">${a.f}</div>
              <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:var(--${a.color==='good'?'green':a.color==='mid'?'accent':'red'})">${a.last}</div>
              <div style="font-size:10px;color:var(--text-dim);margin-top:2px">ort: ${a.avg}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // Yaklaşan randevular
  const myAppts=S.appointments.filter(a=>a.studentId===stu.id&&a.date>=todayStr()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);

  el.innerHTML=`
    <!-- HERO -->
    <div class="portal-hero" style="margin-bottom:16px">
      <div class="portal-avatar" style="background:${stu.color};width:72px;height:72px;border-radius:18px;font-size:28px">${stu.name[0]}</div>
      <div class="portal-info" style="flex:1">
        <h1>${esc(stu.name)}</h1>
        <p>${esc(stu.target)}</p>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="stats-row" style="margin-bottom:16px">
      <div class="stat-card">
        <div class="stat-label">Genel İlerleme</div>
        <div class="stat-val" style="color:${stu.color}">%${stu.progress}</div>
        <div class="prog-bar-wrap" style="margin-top:8px"><div class="prog-bar" style="width:${stu.progress}%;background:${stu.color}"></div></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Bu Hafta Görev</div>
        <div class="stat-val">${weekDone}<span style="font-size:14px;color:var(--text-dim)">/${weekTotal}</span></div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">%${weekPct} tamamlandı</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Son Deneme Neti</div>
        <div class="stat-val" style="color:var(--accent)">${lastTotal}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">${lastExam?esc(lastExam.name):'Deneme yok'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Tamamlanan</div>
        <div class="stat-val">${totalDone}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">görev</div>
      </div>
    </div>

    ${trendHtml}
    ${dersOrtHtml}

    <!-- YAKLAŞAN RANDEVULAR -->
    <div class="card cp" style="margin-bottom:16px">
      <div class="portal-sec-title">📅 Yaklaşan Randevularım</div>
      ${myAppts.length?myAppts.map(a=>`
        <div style="background:var(--surface2);border:1px solid var(--border);border-left:3px solid ${stu.color};border-radius:9px;padding:12px;margin-top:8px">
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:3px">${new Date(a.date+'T12:00').toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})}</div>
          <div style="font-family:'Inter',sans-serif;font-size:17px;font-weight:700">${a.time} <span style="font-size:13px;color:var(--text-mid)">· ${a.duration} dk</span></div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${esc(a.type)}</div>
        </div>`).join('')
      :'<div style="font-size:13px;color:var(--text-dim);margin-top:8px">Yaklaşan randevu yok</div>'}
    </div>

    <!-- DETAYLI PROFIL BILGILERI -->
    <div class="card cp" style="margin-bottom:16px">
      <div class="portal-sec-title">📝 Detaylı Profil Bilgilerim</div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Okul</label>
          <input type="text" id="spSchool" value="${esc(school)}" placeholder="Okulunuz" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Sınıf / Seviye</label>
          <input type="text" id="spGrade" value="${esc(grade)}" placeholder="Örn: 12. Sınıf, Mezun" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hedef Üniversite</label>
          <input type="text" id="spTargetUni" value="${esc(target_university)}" placeholder="Örn: Boğaziçi Üniversitesi" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hedef Bölüm</label>
          <input type="text" id="spTargetDept" value="${esc(target_department)}" placeholder="Örn: Bilgisayar Mühendisliği" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Zorlandığım Dersler</label>
          <input type="text" id="spStruggling" value="${esc(struggling_subjects)}" placeholder="Örn: Fizik, Geometri" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Günlük Çalışma Kapasitesi (Saat)</label>
          <input type="number" id="spCapacity" value="${esc(daily_capacity)}" placeholder="Örn: 6" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Biyografi / Kendinden Bahset</label>
        <textarea id="spBio" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${esc(bio)}</textarea>
      </div>

      <button class="btn btn-accent" style="width:100%; padding:10px;" onclick="saveStudentProfile()">Profil Bilgilerini Güncelle ✓</button>
    </div>

    <!-- ŞİFRE DEĞİŞTİR -->
    <div class="card cp">
      <div class="portal-sec-title">🔒 Şifre Değiştir</div>
      <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
        <input type="password" id="newPass1" placeholder="Yeni şifre" style="flex:1;min-width:140px;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none">
        <input type="password" id="newPass2" placeholder="Şifreyi tekrar gir" style="flex:1;min-width:140px;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none">
        <button class="btn btn-accent" onclick="changePassword()">Kaydet</button>
      </div>
    </div>`;
}

async function saveStudentProfile() {
  const userId = session.dbUser.id;
  const bio = document.getElementById('spBio').value.trim();
  const school = document.getElementById('spSchool').value.trim();
  const grade = document.getElementById('spGrade').value.trim();
  const target_university = document.getElementById('spTargetUni').value.trim();
  const target_department = document.getElementById('spTargetDept').value.trim();
  const struggling_subjects = document.getElementById('spStruggling').value.trim();
  const daily_capacity = parseInt(document.getElementById('spCapacity').value) || null;

  const payload = {
    id: userId,
    bio,
    school,
    grade,
    target_university,
    target_department,
    struggling_subjects,
    daily_capacity,
    updated_at: new Date().toISOString()
  };

  const { error } = await db.from('student_profiles').upsert(payload);
  if (error) {
    showToast('Profil kaydedilemedi: ' + error.message, false);
  } else {
    showToast('Profil başarıyla güncellendi ✓', true);
  }
}

async function changePassword() {
  const p1=document.getElementById('newPass1').value;
  const p2=document.getElementById('newPass2').value;
  if(!p1) return showToast('Şifre girin!');
  if(p1!==p2) return showToast('Şifreler uyuşmuyor!');
  if(p1.length<4) return showToast('En az 4 karakter olmalı');
  const {error}=await db.from('users').update({password_hash:p1}).eq('id',session.studentId);
  if(error) return showToast('Hata: '+error.message);
  showToast('Şifre güncellendi ✓');
  document.getElementById('newPass1').value='';
  document.getElementById('newPass2').value='';
}

// ═══════════════════════════════════════════════
// ÜYELİK EKRANI (Öğrenci)
// ═══════════════════════════════════════════════
async function renderSUyelik() {
  const el = document.getElementById('view-suyelik');
  if (!el) return;

  el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:200px"><div style="width:32px;height:32px;border:3px solid var(--accent);border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite"></div></div>`;

  const stu = S.students.find(s => s.id === session.studentId);
  const dbUser = session.dbUser;

  // Fetch coach info
  let coachUser = null;
  if (session.coachId) {
    const { data } = await db.from('users').select('full_name,plan,trial_ends_at,created_at,email').eq('id', session.coachId).maybeSingle();
    coachUser = data;
  }

  const enrollDate = dbUser?.created_at ? new Date(dbUser.created_at) : null;
  const now = new Date();

  const plan = coachUser?.plan || 'trial';
  const planLabel = plan === 'trial' ? 'Deneme Dönemi' : plan === 'pro' ? 'Pro Üyelik' : plan === 'premium' ? 'Premium Üyelik' : plan.charAt(0).toUpperCase() + plan.slice(1);
  const planColor = plan === 'trial' ? '#f0a500' : plan === 'pro' ? '#3ecf8e' : plan === 'premium' ? '#8b5cf6' : '#3ecf8e';
  const planBg = plan === 'trial' ? '#fff8e6' : plan === 'pro' ? '#e6faf3' : plan === 'premium' ? '#f3e8ff' : '#e6faf3';
  const planBgDark = plan === 'trial' ? '#2a2010' : plan === 'pro' ? '#0d2a1e' : plan === 'premium' ? '#1e0d2a' : '#0d2a1e';

  let membershipEnd = null;
  if (coachUser?.trial_ends_at) {
    membershipEnd = new Date(coachUser.trial_ends_at);
  } else if (coachUser?.created_at) {
    membershipEnd = new Date(new Date(coachUser.created_at).getTime() + 14 * 24 * 60 * 60 * 1000);
  }

  const daysLeft = membershipEnd ? Math.max(0, Math.ceil((membershipEnd - now) / (1000 * 60 * 60 * 24))) : null;
  const daysUsed = enrollDate ? Math.floor((now - enrollDate) / (1000 * 60 * 60 * 24)) : null;

  const fmtDate = d => d ? d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const statusColor = daysLeft === null ? '#888' : daysLeft > 7 ? '#3ecf8e' : daysLeft > 3 ? '#f0a500' : '#ef4444';
  const statusIcon = daysLeft === null ? '❓' : daysLeft > 7 ? '✅' : daysLeft > 3 ? '⚠️' : '🔴';
  const statusText = daysLeft === null ? 'Durum bilinmiyor' : daysLeft > 7 ? 'Aktif' : daysLeft > 3 ? 'Yakında Sona Eriyor' : daysLeft === 0 ? 'Bugün Sona Eriyor' : 'Kritik — ' + daysLeft + ' gün';

  el.innerHTML = `
    <div style="max-width:480px;margin:0 auto;padding:16px">

      <!-- Üyelik Durumu Kartı -->
      <div style="background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:24px;margin-bottom:16px;position:relative;overflow:hidden">
        <div style="position:absolute;top:0;right:0;width:120px;height:120px;background:${planColor};opacity:.06;border-radius:50%;transform:translate(30%,-30%)"></div>
        <div style="display:flex;align-items:flex-start;gap:16px">
          <div style="width:52px;height:52px;border-radius:14px;background:${planBg};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">💳</div>
          <div style="flex:1">
            <div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px">Üyelik Planı</div>
            <div style="font-size:20px;font-weight:700;color:var(--text)">${planLabel}</div>
            <div style="display:inline-flex;align-items:center;gap:5px;background:${planBg};color:${planColor};font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;margin-top:6px">
              <span>${statusIcon}</span><span>${statusText}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detay Bilgiler -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:16px">
        ${[
          { icon: '🎓', label: 'Koçum', value: coachUser?.full_name || '—' },
          { icon: '📅', label: 'Kayıt Tarihi', value: fmtDate(enrollDate) },
          { icon: '⏳', label: 'Kullanım Süresi', value: daysUsed !== null ? daysUsed + ' gün' : '—' },
          { icon: '📆', label: 'Üyelik Sona Erme', value: fmtDate(membershipEnd) },
          { icon: '⌛', label: 'Kalan Süre', value: daysLeft !== null ? `<span style="color:${statusColor};font-weight:700">${daysLeft} gün</span>` : '—' },
        ].map(({ icon, label, value }, i, arr) => `
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;${i < arr.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
            <span style="font-size:18px;width:24px;text-align:center">${icon}</span>
            <div style="flex:1">
              <div style="font-size:11px;color:var(--text-dim)">${label}</div>
              <div style="font-size:14px;font-weight:600;color:var(--text);margin-top:1px">${value}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Günlük Sayaç -->
      ${daysLeft !== null ? `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:16px">
        <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;font-weight:600">Üyelik Süresi</div>
        ${(() => {
          const total = membershipEnd && enrollDate ? Math.max(1, Math.ceil((membershipEnd - enrollDate) / (1000 * 60 * 60 * 24))) : 14;
          const used = Math.min(total, total - daysLeft);
          const pct = Math.min(100, Math.round((used / total) * 100));
          const barColor = daysLeft > 7 ? '#3ecf8e' : daysLeft > 3 ? '#f0a500' : '#ef4444';
          return `
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim);margin-bottom:6px">
              <span>${used} gün kullanıldı</span>
              <span>${daysLeft} gün kaldı</span>
            </div>
            <div style="background:var(--surface2);border-radius:6px;height:10px;overflow:hidden">
              <div style="width:${pct}%;height:100%;background:${barColor};border-radius:6px;transition:width .5s ease"></div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:6px">%${pct} tamamlandı</div>
          `;
        })()}
      </div>
      ` : ''}

      <!-- İletişim / Yardım -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px">
        <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:12px">Üyelik Talebi & İletişim</div>
        <div style="font-size:12px;color:var(--text-dim);line-height:1.6;margin-bottom:14px">
          Üyelik yenileme, plan değişikliği veya destek için koçunuzla iletişime geçin.
        </div>
        <button onclick="switchTab('smessages')" style="width:100%;padding:11px;background:var(--accent);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">
          <span>💬</span><span>Koçuma Mesaj Gönder</span>
        </button>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════
// KOÇ VE GELİŞTİRİCİ PROFİL / EŞLEŞME EK PARÇALARI
// ═══════════════════════════════════════════════
async function renderCoachProfile() {
  const el = document.getElementById('view-coach-profile');
  if(!el) return;
  
  el.innerHTML = `<div class="loading">Profil bilgileri yükleniyor...</div>`;
  
  const userId = session.dbUser.id;
  let profile = null;
  let error = null;
  
  const res = await db.from('coach_profiles').select('*').eq('id', userId).maybeSingle();
  profile = res.data;
  error = res.error;
  
  if (error) {
    const cached = localStorage.getItem(`coach_profile_${userId}`);
    if (cached) {
      try {
        profile = JSON.parse(cached);
        error = null;
      } catch(e) {}
    }
    if (error) {
      el.innerHTML = `<div style="padding:20px;color:var(--red)">Profil yüklenirken hata oluştu: ${esc(error.message)}</div>`;
      return;
    }
  } else if (!profile) {
    const cached = localStorage.getItem(`coach_profile_${userId}`);
    if (cached) {
      try {
        profile = JSON.parse(cached);
      } catch(e) {}
    }
  }
  
  const bio = profile?.bio || '';
  const subjects = profile?.subjects || '';
  const education = profile?.education || '';
  const experience = profile?.experience || '';
  const photo_url = profile?.photo_url || '';
  const instagram = profile?.instagram || '';
  const linkedin = profile?.linkedin || '';
  
  const coachBulUrl = window.location.origin + window.location.pathname.replace('app.html', 'koc_bul.html') + `?coach=${userId}`;
  
  el.innerHTML = `
    <div style="max-width:900px;margin:0 auto">
    <div style="margin-bottom: 20px;">
      <h2 style="font-family:'Inter',sans-serif; margin-bottom: 6px;">👤 Koç Profilim</h2>
      <p style="font-size: 13px; color: var(--text-mid); margin-bottom: 15px;">
        "Koç Bul" sayfasında görünecek bilgilerinizi buradan düzenleyebilirsiniz.
      </p>
      
      <div style="margin-bottom: 16px; background: var(--surface2); border: 1px dashed var(--border); padding: 12px; border-radius: 9px;">
        <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Kamuya Açık Profil Linkiniz</label>
        <div style="display:flex; gap:8px;">
          <input type="text" readonly value="${coachBulUrl}" id="coachBulLink" style="flex:1; background:var(--surface3); border:1px solid var(--border); border-radius:9px; padding:10px 13px; font-size:13px; color:var(--text-mid); outline:none;">
          <button class="btn btn-ghost" onclick="navigator.clipboard.writeText(document.getElementById('coachBulLink').value); showToast('Link kopyalandı ✓')">🔗 Kopyala</button>
          <a href="${coachBulUrl}" target="_blank" class="btn btn-accent" style="text-decoration:none; display:inline-flex; align-items:center;">👁 Göster</a>
        </div>
      </div>

      <div class="coach-profile-container">
        <!-- Sol Sütun: Form -->
        <div class="card coach-profile-form" style="margin:0; padding:20px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Uzmanlık Alanı / Dersler (Virgülle ayırın)</label>
              <input type="text" id="cpSubjects" value="${esc(subjects)}" placeholder="Örn: Matematik, Fizik, Türkçe" oninput="updateProfilePreview()" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Profil Fotoğrafı URL'si</label>
              <input type="text" id="cpPhotoUrl" value="${esc(photo_url)}" placeholder="https://..." oninput="updateProfilePreview()" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
            </div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hakkımda / Biyografi</label>
            <textarea id="cpBio" oninput="updateProfilePreview()" style="width:100%; min-height:100px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${esc(bio)}</textarea>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Eğitim Bilgisi</label>
              <textarea id="cpEducation" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${esc(education)}</textarea>
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Deneyim / Başarılar</label>
              <textarea id="cpExperience" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${esc(experience)}</textarea>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Instagram Kullanıcı Adı (İsteğe bağlı)</label>
              <div style="display:flex; align-items:center; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:0 13px;">
                <span style="color:var(--text-dim); margin-right:4px;">@</span>
                <input type="text" id="cpInstagram" value="${esc(instagram)}" placeholder="kullaniciadi" oninput="updateProfilePreview()" style="flex:1; background:none; border:none; padding:10px 0; font-size:14px; color:var(--text); outline:none;">
              </div>
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">LinkedIn Profil URL (İsteğe bağlı)</label>
              <input type="text" id="cpLinkedin" value="${esc(linkedin)}" placeholder="https://linkedin.com/in/..." oninput="updateProfilePreview()" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
            </div>
          </div>

          <button class="btn btn-accent" style="width:100%; padding:12px; font-size:14px;" onclick="saveCoachProfile()">Kaydet ✓</button>
        </div>

        <!-- Sağ Sütun: Canlı Önizleme -->
        <div class="coach-preview-column">
          <div style="position: sticky; top: 10px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; text-align: center;">CANLI ÖNİZLEME</div>
            <div class="profile-preview-card">
              <div class="preview-card-header">
                <div class="preview-avatar" id="prevAvatar"></div>
                <div class="preview-header-info">
                  <div class="preview-name" id="prevName">${esc(session.dbUser?.full_name || 'Koç')}</div>
                  <div class="preview-role">Mentör & Koç</div>
                  <div class="preview-socials" id="prevSocials"></div>
                </div>
              </div>
              
              <div class="preview-subjects-wrap" id="prevSubjects"></div>
              
              <div class="preview-tabs">
                <button class="prev-tab-btn active" id="btn-prev-bio" onclick="switchPreviewTab('bio')">Biyografi</button>
                <button class="prev-tab-btn" id="btn-prev-edu" onclick="switchPreviewTab('edu')">Eğitim</button>
                <button class="prev-tab-btn" id="btn-prev-exp" onclick="switchPreviewTab('exp')">Deneyim</button>
              </div>
              
              <div class="preview-tab-content" id="prevTabContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize preview card fields
  updateProfilePreview();
}

let _activePreviewTab = 'bio';

function updateProfilePreview() {
  const photoUrl = document.getElementById('cpPhotoUrl')?.value.trim() || '';
  const subjects = document.getElementById('cpSubjects')?.value.trim() || '';
  const bio = document.getElementById('cpBio')?.value.trim() || '';
  const education = document.getElementById('cpEducation')?.value.trim() || '';
  const experience = document.getElementById('cpExperience')?.value.trim() || '';
  const instagram = document.getElementById('cpInstagram')?.value.trim() || '';
  const linkedin = document.getElementById('cpLinkedin')?.value.trim() || '';
  const name = session.dbUser?.full_name || 'Koç';

  // Avatar
  const prevAv = document.getElementById('prevAvatar');
  if (prevAv) {
    if (photoUrl) {
      prevAv.style.backgroundImage = `url('${photoUrl}')`;
      prevAv.style.backgroundColor = 'transparent';
      prevAv.innerHTML = '';
    } else {
      prevAv.style.backgroundImage = '';
      prevAv.style.backgroundColor = 'var(--accent-dim)';
      const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      prevAv.innerHTML = initials || '?';
    }
  }

  // Socials
  const prevSocials = document.getElementById('prevSocials');
  if (prevSocials) {
    let socialHtml = '';
    if (instagram) {
      socialHtml += `<a href="https://instagram.com/${instagram}" target="_blank" class="preview-social-link" title="Instagram">📸 @${instagram}</a>`;
    }
    if (linkedin) {
      let displayLnk = 'LinkedIn';
      if (linkedin.includes('/in/')) {
        const parts = linkedin.split('/in/');
        displayLnk = 'in/' + parts[1].split('/')[0];
      }
      socialHtml += `<a href="${linkedin}" target="_blank" class="preview-social-link" title="LinkedIn">💼 ${displayLnk}</a>`;
    }
    prevSocials.innerHTML = socialHtml;
  }

  // Subjects
  const prevSub = document.getElementById('prevSubjects');
  if (prevSub) {
    if (subjects) {
      const list = subjects.split(',').map(s => s.trim()).filter(Boolean);
      prevSub.innerHTML = list.map(s => `<span class="preview-tag">${esc(s)}</span>`).join('');
    } else {
      prevSub.innerHTML = `<span class="preview-tag" style="background:none; border:1px dashed var(--border); color:var(--text-dim)">Ders / Uzmanlık Belirtilmedi</span>`;
    }
  }

  // Tab content
  const tabContent = document.getElementById('prevTabContent');
  if (tabContent) {
    let text = '';
    if (_activePreviewTab === 'bio') {
      text = bio || 'Biyografi bilgisi henüz girilmedi.';
    } else if (_activePreviewTab === 'edu') {
      text = education || 'Eğitim bilgisi henüz girilmedi.';
    } else if (_activePreviewTab === 'exp') {
      text = experience || 'Deneyim/başarılar henüz girilmedi.';
    }
    tabContent.innerHTML = nl2br(esc(text));
  }
}

function switchPreviewTab(tab) {
  _activePreviewTab = tab;
  
  const btnBio = document.getElementById('btn-prev-bio');
  const btnEdu = document.getElementById('btn-prev-edu');
  const btnExp = document.getElementById('btn-prev-exp');
  
  if (btnBio) btnBio.classList.toggle('active', tab === 'bio');
  if (btnEdu) btnEdu.classList.toggle('active', tab === 'edu');
  if (btnExp) btnExp.classList.toggle('active', tab === 'exp');
  
  updateProfilePreview();
}

function nl2br(str) {
  return str.replace(/\n/g, '<br>');
}

async function saveCoachProfile() {
  const userId = session.dbUser.id;
  const bio = document.getElementById('cpBio').value.trim();
  const subjects = document.getElementById('cpSubjects').value.trim();
  const education = document.getElementById('cpEducation').value.trim();
  const experience = document.getElementById('cpExperience').value.trim();
  const photo_url = document.getElementById('cpPhotoUrl').value.trim();
  const instagram = document.getElementById('cpInstagram').value.trim();
  const linkedin = document.getElementById('cpLinkedin').value.trim();
  
  const payload = {
    id: userId,
    bio,
    subjects,
    education,
    experience,
    photo_url,
    instagram,
    linkedin,
    updated_at: new Date().toISOString()
  };
  
  // Save to local storage as fallback first
  localStorage.setItem(`coach_profile_${userId}`, JSON.stringify(payload));
  
  const { error } = await db.from('coach_profiles').upsert(payload);
  if (error) {
    console.warn('Database save failed, profile saved locally in localStorage:', error);
    showToast('Profil yerel tarayıcıya kaydedildi (Veritabanı RLS hatası: ' + error.message + ')', true);
  } else {
    showToast('Profil başarıyla güncellendi ✓', true);
  }
}

async function renderDevMatches() {
  const el = document.getElementById('view-dev-matches');
  if(!el) return;

  el.innerHTML = `<div class="loading">Eşleşmeler yükleniyor...</div>`;

  const { data: requests, error } = await db.from('match_requests').select('*, matched_coach:matched_coach_id(full_name, username)').order('created_at', { ascending: false });

  if (error) {
    el.innerHTML = `<div style="padding:20px;color:var(--red)">Eşleşme başvuruları yüklenirken hata oluştu: ${esc(error.message)}</div>`;
    return;
  }

  const statusLabels = {
    pending: '⏳ Bekliyor',
    matched: '🤝 Eşleştirildi',
    completed: '✅ Tamamlandı'
  };

  const statusColors = {
    pending: 'rgba(240, 165, 0, 0.15)',
    matched: 'rgba(96, 180, 255, 0.15)',
    completed: 'rgba(62, 207, 142, 0.15)'
  };
  
  const textColors = {
    pending: 'var(--accent)',
    matched: 'var(--accent4)',
    completed: 'var(--green)'
  };

  el.innerHTML = `
    <div class="card" style="margin-bottom:20px;">
      <h2 style="font-family:'Inter',sans-serif; margin-bottom: 6px;">🤝 Danışan Eşleşme Başvuruları</h2>
      <p style="font-size:13px; color:var(--text-mid); margin-bottom:15px;">
        Koç Bulucu (koc_bul.html) sayfası üzerinden gelen öğrencilerin koç eşleşme taleplerini buradan yönetebilirsiniz.
      </p>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px; color:var(--text);">
          <thead>
            <tr style="border-bottom:1px solid var(--border); text-align:left;">
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">ÖĞRENCİ BİLGİLERİ</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">SINAV / STİL</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">TALEP EDİLEN KOÇ</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">DURUM</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">TARİH</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            ${requests.length === 0 ? `
              <tr>
                <td colspan="6" style="padding:20px; text-align:center; color:var(--text-mid);">Henüz eşleşme başvurusu bulunmuyor.</td>
              </tr>
            ` : requests.map(r => `
              <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:10px;">
                  <div style="font-weight:700;">${esc(r.student_name)}</div>
                  <div style="font-size:11px; color:var(--text-mid);">${esc(r.email)}</div>
                  <div style="font-size:11px; color:var(--text-mid);">${esc(r.phone || '—')}</div>
                </td>
                <td style="padding:10px;">
                  <span style="background:var(--accent-dim); color:var(--accent); font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px;">${esc(r.exam_profile)}</span>
                  <div style="font-size:11px; color:var(--text-mid); margin-top:4px;">Stil: ${esc(r.style || 'Belirtilmemiş')}</div>
                </td>
                <td style="padding:10px;">
                  ${r.matched_coach ? `
                    <div style="font-weight:600; color:var(--accent2);">${esc(r.matched_coach.full_name)}</div>
                    <div style="font-size:11px; color:var(--text-mid);">@${esc(r.matched_coach.username)}</div>
                  ` : `<span style="color:var(--text-dim);">Herhangi Biri</span>`}
                </td>
                <td style="padding:10px;">
                  <span style="background:${statusColors[r.status]}; color:${textColors[r.status]}; font-size:11px; font-weight:700; padding:4px 10px; border-radius:99px; display:inline-block;">
                    ${statusLabels[r.status] || r.status}
                  </span>
                </td>
                <td style="padding:10px; font-size:11px; color:var(--text-mid);">
                  ${new Date(r.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td style="padding:10px;">
                  <select onchange="updateMatchRequestStatus('${r.id}', this.value)" style="background:var(--surface3); border:1px solid var(--border); border-radius:6px; color:var(--text); padding:4px 8px; font-size:12px; outline:none; cursor:pointer;">
                    <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>⏳ Bekliyor</option>
                    <option value="matched" ${r.status === 'matched' ? 'selected' : ''}>🤝 Eşleştirildi</option>
                    <option value="completed" ${r.status === 'completed' ? 'selected' : ''}>✅ Tamamlandı</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function updateMatchRequestStatus(id, newStatus) {
  const { error } = await db.from('match_requests').update({ status: newStatus }).eq('id', id);
  if (error) {
    showToast('Durum güncellenirken hata: ' + error.message, false);
  } else {
    showToast('Durum güncellendi ✓', true);
    renderDevMatches();
  }
}

// ═══════════════════════════════════════════════
// ÖĞRENCİ HIZ AYARLARI
// ═══════════════════════════════════════════════
async function openSpeedModal(stuId) {
  const stu=S.students.find(s=>s.id===stuId);
  if(!stu) return;

  // Hızları yükle
  const {data:speeds}=await db.from('student_speeds').select('*').eq('student_id',stuId);
  const speedMap={};
  (speeds||[]).forEach(s=>{ speedMap[`${s.exam_type}_${s.subject}`]=s.secs_per_question; });

  const subjects=[
    {exam:'TYT',sub:'Matematik'},{exam:'TYT',sub:'Türkçe'},{exam:'TYT',sub:'Fizik'},
    {exam:'TYT',sub:'Kimya'},{exam:'TYT',sub:'Biyoloji'},{exam:'TYT',sub:'Geometri'},
    {exam:'AYT-SAY',sub:'Matematik'},{exam:'AYT-SAY',sub:'Fizik'},
    {exam:'AYT-SAY',sub:'Kimya'},{exam:'AYT-SAY',sub:'Biyoloji'},
  ];

  let modal=document.getElementById('speedModal');
  if(!modal){
    modal=document.createElement('div');modal.id='speedModal';modal.className='modal-bg';
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  modal.innerHTML=`<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('speedModal')">×</button>
    <h2>⚡ ${esc(stu.name)} — Soru Çözme Hızı</h2>
    <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Her ders için öğrencinin soru başına harcadığı saniyeyi girin. Görev eklerken süre otomatik hesaplanır.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">
      ${subjects.map(({exam,sub})=>{
        const key=`${exam}_${sub}`;
        const val=speedMap[key]||180;
        const min=Math.floor(val/60);
        const sec=val%60;
        return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px">
          <div style="font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${exam}</div>
          <div style="font-size:13px;font-weight:700;margin-bottom:8px">${sub}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" id="spd_${key}" value="${val}" min="10" max="600" step="5"
              style="width:70px;background:var(--surface3);border:1px solid var(--border);border-radius:6px;padding:5px 8px;font-size:13px;font-weight:700;color:var(--text);text-align:center">
            <span style="font-size:11px;color:var(--text-dim)">sn/soru</span>
          </div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px">${min>0?min+'dk ':''}</div>
        </div>`;
      }).join('')}
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:16px" onclick="saveAllSpeeds('${stuId}')">Tümünü Kaydet</button>
  </div>`;
  om('speedModal');
}

async function saveAllSpeeds(stuId){
  const subjects=[
    {exam:'TYT',sub:'Matematik'},{exam:'TYT',sub:'Türkçe'},{exam:'TYT',sub:'Fizik'},
    {exam:'TYT',sub:'Kimya'},{exam:'TYT',sub:'Biyoloji'},{exam:'TYT',sub:'Geometri'},
    {exam:'AYT-SAY',sub:'Matematik'},{exam:'AYT-SAY',sub:'Fizik'},
    {exam:'AYT-SAY',sub:'Kimya'},{exam:'AYT-SAY',sub:'Biyoloji'},
  ];
  for(const {exam,sub} of subjects){
    const key=`${exam}_${sub}`;
    const el=document.getElementById('spd_'+key);
    if(!el) continue;
    const secs=parseInt(el.value)||180;
    await saveStudentSpeed(stuId,exam,sub,secs);
  }
  cm('speedModal');
  showToast('Hız ayarları kaydedildi ✓');
}

// ═══════════════════════════════════════════════
// ── ÖĞRENCİ NOTLARI ────────────────────────────
async function openStudentNotes(stuId) {
  const stu = S.students.find(s => s.id === stuId);
  if (!stu) return;

  const { data } = await db.from('student_notes').select('notes').eq('coach_id', session.coachId).eq('student_id', stuId).maybeSingle();
  const existingNotes = data?.notes || '';

  let modal = document.getElementById('studentNotesModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'studentNotesModal';
    modal.className = 'modal-bg';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  }

  modal.innerHTML = `<div class="modal">
    <button class="modal-close" onclick="cm('studentNotesModal')">×</button>
    <h2>📝 ${esc(stu.name)} — Notlar</h2>
    <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Öğrenciyle ilgili gözlemler, önemli bilgiler, hatırlatmalar…</p>
    <div class="field">
      <textarea id="studentNoteText" style="min-height:260px;font-size:13px;line-height:1.7;resize:vertical" placeholder="Örnek: Türkçe paragrafta hız sorunu var. Veli baskılı, motivasyon takip edilmeli. Son denemede geometri 4 yanlış...">${esc(existingNotes)}</textarea>
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveStudentNote('${stuId}')">Kaydet</button>
  </div>`;
  om('studentNotesModal');
}

async function saveStudentNote(stuId) {
  const notes = document.getElementById('studentNoteText').value;
  const { error } = await db.from('student_notes').upsert(
    { coach_id: session.coachId, student_id: stuId, notes, updated_at: new Date().toISOString() },
    { onConflict: 'coach_id,student_id' }
  );
  if (error) { showToast('Not kaydedilemedi: ' + error.message); return; }
  showToast('Not kaydedildi ✓');
  cm('studentNotesModal');
}

// PDF RAPOR SİSTEMİ
// ═══════════════════════════════════════════════
function openReportModal(stuId) {
  let modal = document.getElementById('reportModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.className = 'modal-bg';
    modal.innerHTML = `<div class="modal">
      <button class="modal-close" onclick="cm('reportModal')">×</button>
      <h2>📄 Performans Raporu</h2>
      <input type="hidden" id="rpStuId">
      <div class="field"><label>Dönem</label>
        <select id="rpPeriod">
          <option value="weekly">Bu Hafta</option>
          <option value="monthly" selected>Bu Ay</option>
          <option value="custom">Tarih Aralığı</option>
        </select>
      </div>
      <div id="rpCustomDates" style="display:none">
        <div class="field-row">
          <div class="field"><label>Başlangıç</label><input type="date" id="rpStart"></div>
          <div class="field"><label>Bitiş</label><input type="date" id="rpEnd"></div>
        </div>
      </div>
      <div class="field"><label>Koç Notu (isteğe bağlı)</label>
        <textarea id="rpNote" placeholder="Bu dönem için genel değerlendirmenizi yazın..." style="min-height:90px"></textarea>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="previewReport()">👁 Önizle</button>
          <button class="btn btn-accent" style="flex:1;justify-content:center" onclick="generatePDF()">⬇️ PDF İndir</button>
        </div>
        <button class="btn btn-ghost" style="width:100%;justify-content:center;background:#25d366;color:#fff;border:none;gap:6px" onclick="sendWhatsAppReport()">💬 Veliye WhatsApp Gönder</button>
        <button class="btn btn-ghost" style="width:100%;justify-content:center;background:var(--surface3);color:var(--text);border:1px solid var(--border);gap:6px" onclick="archivePerformanceReport()">💾 Raporu Sisteme Kaydet (Arşivle)</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
    document.getElementById('rpPeriod').addEventListener('change',function(){
      document.getElementById('rpCustomDates').style.display=this.value==='custom'?'':'none';
    });
  }
  document.getElementById('rpStuId').value = stuId;
  // Default tarihler
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  document.getElementById('rpStart').value = fmtDate(firstDay);
  document.getElementById('rpEnd').value = fmtDate(now);
  document.getElementById('rpNote').value = '';
  om('reportModal');
}

function getReportDates() {
  const period = document.getElementById('rpPeriod').value;
  const now = new Date();
  if(period==='weekly') {
    const ws = getWeekStart(0, 0);
    return { start: fmtDate(ws), end: fmtDate(addDays(ws,6)) };
  } else if(period==='monthly') {
    return { start: fmtDate(new Date(now.getFullYear(),now.getMonth(),1)), end: fmtDate(now) };
  } else {
    return { start: document.getElementById('rpStart').value, end: document.getElementById('rpEnd').value };
  }
}

function buildReportHTML(stuId, preview=false) {
  const stu = S.students.find(s=>s.id===stuId);
  if(!stu) return '';
  const {start, end} = getReportDates();
  const coachNote = document.getElementById('rpNote').value.trim();
  const brandName = S.workspace?.brand_name || 'Rostrum Akademi';
  const brandColor = S.workspace?.brand_color || '#f0a500';
  const coachName = session.dbUser?.full_name || 'Koç';

  // Dönemdeki görevler
  const allTasks = [];
  const d = new Date(start);
  while(fmtDate(d) <= end) {
    const key = `${stuId}_${fmtDate(d)}`;
    (S.tasks[key]||[]).forEach(t => allTasks.push({...t, date:fmtDate(d)}));
    d.setDate(d.getDate()+1);
  }
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t=>t.done).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) : 0;
  const totalMin = allTasks.filter(t=>t.done).reduce((s,t)=>s+Number(t.duration||0),0);

  // Ders bazında dağılım
  const bySubject = {};
  allTasks.forEach(t => {
    const k = t.subject||'Diğer';
    if(!bySubject[k]) bySubject[k]={total:0,done:0};
    bySubject[k].total++;
    if(t.done) bySubject[k].done++;
  });

  // Denemeler
  const myExams = S.exams.filter(e=>e.studentId===stuId && e.date>=start && e.date<=end)
    .sort((a,b)=>a.date.localeCompare(b.date));

  // Randevular
  const myAppts = S.appointments.filter(a=>a.studentId===stuId && a.date>=start && a.date<=end)
    .sort((a,b)=>a.date.localeCompare(b.date));

  const periodLabel = `${new Date(start+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})} – ${new Date(end+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}`;

  // Bar chart SVG for exams
  let examChartSVG = '';
  if(myExams.length > 1) {
    const maxNet = Math.max(...myExams.map(e=>(EXAM_DEFS[e.type]||[]).reduce((s,f)=>s+Number(e.nets?.[f]||0),0)),1);
    const w = 400, h = 80, bw = Math.min(40, (w-20)/myExams.length-4);
    examChartSVG = `<svg width="${w}" height="${h+30}" style="overflow:visible">
      ${myExams.map((e,i)=>{
        const total=(EXAM_DEFS[e.type]||[]).reduce((s,f)=>s+Number(e.nets?.[f]||0),0);
        const bh=Math.max(Math.round((total/maxNet)*(h-10)),4);
        const x=10+i*((w-20)/myExams.length);
        return `<rect x="${x}" y="${h-bh}" width="${bw}" height="${bh}" rx="3" fill="${brandColor}" opacity="0.85"/>
          <text x="${x+bw/2}" y="${h-bh-4}" text-anchor="middle" font-size="10" fill="#333">${total.toFixed(0)}</text>
          <text x="${x+bw/2}" y="${h+14}" text-anchor="middle" font-size="9" fill="#666">${esc(e.name.replace('Deneme','').replace('TYT','').replace('AYT','').trim()||String(i+1))}</text>`;
      }).join('')}
    </svg>`;
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#fff;font-size:13px;line-height:1.5;}
  .page{max-width:800px;margin:0 auto;padding:${preview?'30px':'20px 30px'};}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:18px;border-bottom:3px solid ${brandColor};margin-bottom:24px;}
  .brand{font-size:22px;font-weight:800;color:${brandColor};letter-spacing:-0.5px;}
  .brand-sub{font-size:11px;color:#888;margin-top:3px;}
  .report-title{text-align:right;}
  .report-title h1{font-size:18px;font-weight:700;color:#1a1a1a;}
  .report-title p{font-size:11px;color:#888;margin-top:3px;}
  .student-hero{background:linear-gradient(135deg,${brandColor}15,${brandColor}05);border:1.5px solid ${brandColor}30;border-radius:12px;padding:18px 22px;margin-bottom:20px;display:flex;align-items:center;gap:16px;}
  .stu-avatar{width:52px;height:52px;border-radius:12px;background:${brandColor};color:#fff;font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .stu-name{font-size:20px;font-weight:800;}
  .stu-target{font-size:12px;color:#666;margin-top:3px;}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
  .stat-box{background:#f8f8f8;border:1px solid #e8e8e8;border-radius:10px;padding:12px 14px;text-align:center;}
  .stat-box .val{font-size:26px;font-weight:800;color:${brandColor};}
  .stat-box .lbl{font-size:10px;color:#888;margin-top:3px;text-transform:uppercase;letter-spacing:.5px;}
  .section{margin-bottom:20px;}
  .section-title{font-size:14px;font-weight:700;color:${brandColor};margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid ${brandColor}20;display:flex;align-items:center;gap:6px;}
  table{width:100%;border-collapse:collapse;font-size:12px;}
  th{background:${brandColor}15;color:#333;font-weight:700;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.4px;}
  td{padding:7px 10px;border-bottom:1px solid #f0f0f0;}
  tr:last-child td{border-bottom:none;}
  .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;}
  .badge-green{background:#e8faf3;color:#16a34a;}
  .badge-yellow{background:#fef9ec;color:#ca8a04;}
  .badge-red{background:#fef2f2;color:#dc2626;}
  .prog-bar{height:8px;background:#eee;border-radius:99px;overflow:hidden;margin-top:4px;}
  .prog-fill{height:100%;border-radius:99px;background:${brandColor};}
  .note-box{background:#fffbeb;border:1.5px solid ${brandColor}40;border-radius:10px;padding:14px 16px;}
  .note-box .note-header{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:${brandColor};margin-bottom:6px;}
  .footer{margin-top:30px;padding-top:14px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:10px;color:#aaa;}
  .progress-circle{position:relative;width:64px;height:64px;flex-shrink:0;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.no-print{display:none!important;}}
</style>
</head>
<body>
<div class="page">
  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="brand">${esc(brandName)}</div>
      <div class="brand-sub">Koç: ${esc(coachName)}</div>
    </div>
    <div class="report-title">
      <h1>Performans Raporu</h1>
      <p>${periodLabel}</p>
      <p>Oluşturulma: ${new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</p>
    </div>
  </div>

  <!-- ÖĞRENCİ -->
  <div class="student-hero">
    <div class="stu-avatar">${stu.name[0]}</div>
    <div>
      <div class="stu-name">${esc(stu.name)}</div>
      <div class="stu-target">${esc(stu.target)}</div>
      <div style="margin-top:8px">
        <div style="font-size:11px;color:#666;margin-bottom:3px">Genel İlerleme %${stu.progress}</div>
        <div class="prog-bar" style="width:200px"><div class="prog-fill" style="width:${stu.progress}%"></div></div>
      </div>
    </div>
  </div>

  <!-- ÖZET İSTATİSTİKLER -->
  <div class="stats-grid">
    <div class="stat-box"><div class="val">${totalTasks}</div><div class="lbl">Toplam Görev</div></div>
    <div class="stat-box"><div class="val" style="color:#16a34a">${doneTasks}</div><div class="lbl">Tamamlanan</div></div>
    <div class="stat-box"><div class="val">%${pct}</div><div class="lbl">Tamamlanma</div></div>
    <div class="stat-box"><div class="val">${Math.round(totalMin/60)}</div><div class="lbl">Çalışma (saat)</div></div>
  </div>

  <!-- DERS BAZINDA ÇALIŞMA -->
  ${Object.keys(bySubject).length > 0 ? `
  <div class="section">
    <div class="section-title">📚 Ders Bazında Çalışma</div>
    <table>
      <thead><tr><th>Ders</th><th>Toplam</th><th>Tamamlanan</th><th>Oran</th><th></th></tr></thead>
      <tbody>
        ${Object.entries(bySubject).sort((a,b)=>b[1].total-a[1].total).map(([subj,data])=>{
          const pct2=Math.round((data.done/data.total)*100);
          const badge=pct2>=80?'badge-green':pct2>=50?'badge-yellow':'badge-red';
          return `<tr>
            <td><strong>${esc(subj)}</strong></td>
            <td>${data.total}</td>
            <td>${data.done}</td>
            <td><span class="badge ${badge}">%${pct2}</span></td>
            <td style="width:120px"><div class="prog-bar"><div class="prog-fill" style="width:${pct2}%"></div></div></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>` : ''}

  <!-- DENEMELER -->
  ${myExams.length > 0 ? `
  <div class="section">
    <div class="section-title">📊 Deneme Sonuçları</div>
    ${examChartSVG ? `<div style="margin-bottom:16px;padding:12px;background:#f8f8f8;border-radius:8px">${examChartSVG}</div>` : ''}
    <table>
      <thead><tr><th>Sınav</th><th>Tarih</th><th>Tür</th>${(EXAM_DEFS[myExams[0]?.type]||[]).map(f=>`<th>${f}</th>`).join('')}<th>Toplam</th></tr></thead>
      <tbody>
        ${myExams.map(e=>{
          const fields=EXAM_DEFS[e.type]||[];
          const total=fields.reduce((s,f)=>s+Number(e.nets?.[f]||0),0).toFixed(1);
          return `<tr>
            <td><strong>${esc(e.name)}</strong></td>
            <td>${new Date(e.date+'T12:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}</td>
            <td>${esc(e.type)}</td>
            ${fields.map(f=>{const v=Number(e.nets?.[f]||0);return `<td><span class="badge ${v>=20?'badge-green':v>=12?'badge-yellow':'badge-red'}">${v}</span></td>`;}).join('')}
            <td><strong>${total}</strong></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>` : ''}

  <!-- RANDEVULAR -->
  ${myAppts.length > 0 ? `
  <div class="section">
    <div class="section-title">📅 Görüşmeler</div>
    <table>
      <thead><tr><th>Tarih</th><th>Saat</th><th>Tür</th><th>Süre</th></tr></thead>
      <tbody>
        ${myAppts.map(a=>`<tr>
          <td>${new Date(a.date+'T12:00').toLocaleDateString('tr-TR',{weekday:'short',day:'numeric',month:'short'})}</td>
          <td>${a.time}</td>
          <td>${esc(a.type)}</td>
          <td>${a.duration} dk</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  <!-- KOÇ NOTU -->
  ${coachNote ? `
  <div class="section">
    <div class="note-box">
      <div class="note-header">Koç Değerlendirmesi</div>
      <div style="font-size:13px;line-height:1.7;color:#333">${esc(coachNote).replace(/\n/g,'<br>')}</div>
      <div style="margin-top:10px;font-size:11px;color:#888">— ${esc(coachName)}</div>
    </div>
  </div>` : ''}

  <!-- FOOTER -->
  <div class="footer">
    <span>${esc(brandName)} · ${esc(coachName)}</span>
    <span>${esc(stu.name)} · ${periodLabel}</span>
    <span>Rostrum Akademi Platformu</span>
  </div>
</div>
</body>
</html>`;
}

function previewReport() {
  const stuId = document.getElementById('rpStuId').value;
  const html = buildReportHTML(stuId, true);
  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
}

function generatePDF() {
  const stuId = document.getElementById('rpStuId').value;
  const stu = S.students.find(s=>s.id===stuId);
  const html = buildReportHTML(stuId, false);
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(()=>{
    win.focus();
    win.print();
    // print dialog açılır, "PDF olarak kaydet" seçilir
  }, 500);
  cm('reportModal');
  showToast('PDF oluşturuluyor — "PDF olarak kaydet" seçin');
}

async function sendWhatsAppReport() {
  const stuId = document.getElementById('rpStuId').value;
  const s = S.students.find(x => x.id === stuId);
  if (!s) return;

  const reportUrl = `${window.location.origin}/api/generate-pdf-report?studentId=${stuId}`;
  const message = `Merhaba, ${s.name} isimli öğrencimizin bu dönemki performans ve gelişim raporu hazırlandı. Aşağıdaki bağlantıdan raporu detaylıca görüntüleyebilirsiniz:\n\n🔗 ${reportUrl}`;

  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
  cm('reportModal');
  showToast('WhatsApp yönlendirmesi açıldı ✓');
}


function openWeeklyPDFModal(){
  let modal = document.getElementById('weeklyPDFModal');
  if(!modal){
    modal = document.createElement('div'); modal.id='weeklyPDFModal'; modal.className='modal-bg';
    modal.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('weeklyPDFModal')">×</button>
      <h2>🖨️ Haftalık Program PDF</h2>
      <div class="field">
        <label>Koç Notu (isteğe bağlı)</label>
        <textarea id="pdfNote" placeholder="Bu haftaki programla ilgili notunuzu ekleyin..." style="min-height:90px"></textarea>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px" onclick="generateWeeklyPDF()">PDF Oluştur →</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  }
  document.getElementById('pdfNote').value='';
  om('weeklyPDFModal');
}

function generateWeeklyPDF(){
  const note = document.getElementById('pdfNote').value.trim();
  // Geçici olarak rapor modalındaki note alanını kullan
  cm('weeklyPDFModal');
  printWeeklyProgramWithNote(S.activeStuId, note);
}

function printWeeklyProgramWithNote(stuId, coachNote){
  const stu=S.students.find(s=>s.id===stuId);
  if(!stu) return;
  const wsOff=stu?.weekStart??0;
  const wStart=getWeekStart(S.weekOffset,wsOff);
  const wEnd=addDays(wStart,6);
  const brandName=S.workspace?.brand_name||'Rostrum Akademi';
  const bc=S.workspace?.brand_color||'#f0a500';
  const DAYS=['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
  const MONTHS=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const TC={deneme:'#f59e0b',soru:'#3b82f6',konu:'#10b981',diger:'#8b5cf6'};
  const TBG={deneme:'#fffbeb',soru:'#eff6ff',konu:'#f0fdf4',diger:'#faf5ff'};
  const TL={deneme:'Deneme',soru:'Soru Bankası',konu:'Konu Anlatımı',diger:'Diğer'};
  const today=fmtDate(new Date());
  let totalTasks=0,doneTasks=0,totalMin=0,dayColumns='';

  for(let i=0;i<7;i++){
    const d=addDays(wStart,i);
    const ds=fmtDate(d);
    const tasks=S.tasks[`${stuId}_${ds}`]||[];
    totalTasks+=tasks.length;
    doneTasks+=tasks.filter(t=>t.done).length;
    totalMin+=tasks.reduce((s,t)=>s+Number(t.duration||0),0);
    const isToday=ds===today;
    const shortDay=DAYS[(wsOff+i)%7].slice(0,3).toUpperCase();
    const dayMin=tasks.reduce((s,t)=>s+Number(t.duration||0),0);

    const cards=tasks.map(t=>{
      const color=TC[t.type]||'#94a3b8';
      const bg=TBG[t.type]||'#f8fafc';
      const lbl=TL[t.type]||'Diğer';
      return `<div style="margin-bottom:5px;border-radius:7px;background:${bg};border:1px solid ${color}28;border-left:3px solid ${color}">
        <div style="padding:6px 8px">
          <div style="font-size:7.5px;font-weight:800;color:${color};text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${lbl}${t.exam?` · ${t.exam}`:''}</div>
          <div style="font-size:10px;font-weight:700;color:#111;line-height:1.3">${esc(t.subject)}</div>
          ${t.note?`<div style="font-size:7.5px;color:#999;margin-top:2px;line-height:1.4;word-break:break-word">${esc(t.note)}</div>`:''}
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
            <span style="display:inline-flex;align-items:center;gap:4px;font-size:8px;color:#bbb">
              <span style="display:inline-block;width:11px;height:11px;border:1.5px solid #d0cec9;border-radius:3px;flex-shrink:0"></span>
              ${t.duration} dk
            </span>
            ${t.done?`<span style="font-size:8px;font-weight:700;color:#22c55e">✓ Tamam</span>`:''}
          </div>
        </div>
      </div>`;
    }).join('');

    dayColumns+=`<div style="padding:0 5px;border-right:${i<6?`1px solid #ede9e3`:'none'}">
      <div style="padding-bottom:7px;margin-bottom:7px;border-bottom:2px solid ${isToday?bc:'#ede9e3'}">
        <div style="font-size:8px;font-weight:800;color:${isToday?bc:'#bbb'};text-transform:uppercase;letter-spacing:.8px">${shortDay}</div>
        <div style="font-size:22px;font-weight:900;color:${isToday?bc:'#111'};line-height:1;margin-top:1px">${d.getDate()}</div>
        ${dayMin>0?`<div style="font-size:7px;color:#ccc;margin-top:2px">${dayMin}dk · ${tasks.length}g</div>`:''}
      </div>
      ${tasks.length===0?`<div style="font-size:13px;color:#e8e4dc;text-align:center;padding:14px 0">—</div>`:cards}
    </div>`;
  }

  const pct=totalTasks>0?Math.round((doneTasks/totalTasks)*100):0;
  const pctColor=pct>=80?'#22c55e':pct>=50?bc:'#f59e0b';
  const initials=stu.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  let detailedDaysList = '';
  for(let i=0;i<7;i++){
    const d=addDays(wStart,i);
    const ds=fmtDate(d);
    const tasks=S.tasks[`${stuId}_${ds}`]||[];
    if (tasks.length === 0) continue;

    const dayName=DAYS[(wsOff+i)%7];
    const taskRows = tasks.map((t, index) => {
      const color=TC[t.type]||'#94a3b8';
      const lbl=TL[t.type]||'Diğer';
      return `<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #eee">
        <div style="display:flex;align-items:baseline;gap:8px">
          <span style="font-size:12px;font-weight:800;color:${color}">${index + 1}. ${lbl}${t.exam?` (${t.exam})`:''}</span>
          <span style="font-size:12px;font-weight:700;color:#111">${esc(t.subject)}</span>
          <span style="font-size:11px;color:#666;margin-left:auto">${t.duration} dk</span>
        </div>
        ${t.note ? `<div style="font-size:10px;color:#555;margin-top:4px;padding-left:14px;border-left:2px solid ${color}40;line-height:1.5">${esc(t.note).replace(/\n/g, '<br>')}</div>` : ''}
      </div>`;
    }).join('');

    detailedDaysList += `<div style="margin-bottom:24px">
      <h3 style="font-size:14px;font-weight:800;color:${bc};border-bottom:2px solid ${bc}40;padding-bottom:4px;margin-bottom:10px">${d.getDate()} ${MONTHS[d.getMonth()]} - ${dayName}</h3>
      <div>${taskRows}</div>
    </div>`;
  }

  const html=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Segoe UI',-apple-system,Arial,sans-serif;background:#fff;color:#111;}
    @media print{
      .no-print{display:none!important;}
      @page{size:A4 landscape;margin:5mm;}
      .page-break{page-break-before:always;}
    }
  </style>
  </head><body>

  <!-- ACCENT BAR -->
  <div style="height:5px;background:${bc}"></div>

  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px 11px;border-bottom:1px solid #ede9e3">
    <div>
      <div style="font-size:18px;font-weight:900;color:${bc};letter-spacing:-.3px">${esc(brandName)}</div>
      <div style="font-size:9.5px;color:#bbb;margin-top:2px;letter-spacing:.2px">Haftalık Çalışma Programı</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="text-align:right">
        <div style="font-size:14px;font-weight:800;color:#111">${esc(stu.name)}</div>
        ${stu.target?`<div style="font-size:8.5px;color:#aaa;margin-top:1px">🎯 ${esc(stu.target)}</div>`:''}
        <div style="font-size:8.5px;color:#bbb;margin-top:1px">${wStart.getDate()} ${MONTHS[wStart.getMonth()]} – ${wEnd.getDate()} ${MONTHS[wEnd.getMonth()]} ${wEnd.getFullYear()}</div>
      </div>
      <div style="width:40px;height:40px;border-radius:10px;background:${bc};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;letter-spacing:-.5px;flex-shrink:0">${initials}</div>
    </div>
  </div>

  <!-- STATS BAR -->
  <div style="display:flex;align-items:center;gap:0;padding:7px 18px;background:#faf9f8;border-bottom:1px solid #ede9e3">
    <div style="display:flex;align-items:center;gap:18px">
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:${bc};letter-spacing:-.5px">${totalTasks}</div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Görev</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:#22c55e;letter-spacing:-.5px">${doneTasks}</div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Tamamlanan</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:#3b82f6;letter-spacing:-.5px">${Math.round(totalMin/60)}<span style="font-size:10px">sa</span></div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Süre</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:90px;height:7px;background:#ede9e3;border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${pctColor};border-radius:99px"></div>
        </div>
        <div style="font-size:14px;font-weight:900;color:${pctColor};min-width:36px">%${pct}</div>
      </div>
    </div>
  </div>

  <!-- WEEK GRID -->
  <div style="display:grid;grid-template-columns:repeat(7,1fr);padding:10px 8px 6px">${dayColumns}</div>

  <!-- COACH NOTE -->
  ${coachNote?`<div style="margin:2px 14px 10px;padding:10px 14px;background:${bc}0d;border-left:3px solid ${bc};border-radius:0 8px 8px 0">
    <div style="font-size:8px;font-weight:800;color:${bc};text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">Koç Notu</div>
    <div style="font-size:10px;color:#444;line-height:1.6">${esc(coachNote)}</div>
  </div>`:''}

  <!-- FOOTER -->
  <div style="display:flex;align-items:center;gap:14px;padding:7px 16px;border-top:1px solid #ede9e3;background:#faf9f8">
    <span style="font-size:8px;color:#ccc;margin-right:4px;font-weight:600">TÜRLER:</span>
    ${Object.entries(TL).map(([k,v])=>`<div style="display:flex;align-items:center;gap:4px;font-size:8.5px;color:#888"><div style="width:8px;height:8px;border-radius:2px;background:${TC[k]}"></div>${v}</div>`).join('')}
    <div style="margin-left:auto;font-size:8px;color:#ccc">${esc(brandName)} · ${new Date().toLocaleDateString('tr-TR')}</div>
  </div>

  <!-- PRINT BUTTON -->
  <div class="no-print" style="padding:12px 16px;display:flex;align-items:center;gap:12px;border-top:1px solid #ede9e3">
    <button onclick="window.print()" style="background:${bc};color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:.2px">🖨️ PDF İndir / Yazdır</button>
    <span style="font-size:11px;color:#bbb">Tarayıcı ayarlarından "Arka plan grafikleri"ni aktif edin</span>
  </div>

  <!-- PAGE 2: DETAILED LIST VIEW -->
  ${detailedDaysList ? `
  <div class="page-break" style="padding:40px 30px;max-width:1000px;margin:0 auto">
    <div style="font-size:18px;font-weight:900;color:${bc};margin-bottom:20px;border-bottom:2px solid ${bc};padding-bottom:10px">📋 Günlük Detaylı Görev Açıklamaları</div>
    ${detailedDaysList}
  </div>` : ''}

  </body></html>`;

  const win=window.open('','_blank','width=1200,height=850');
  win.document.write(html); win.document.close();
  setTimeout(()=>win.focus(),300);
}

// ═══════════════════════════════════════════════
// ZOOM / MEET LİNK
// ═══════════════════════════════════════════════
function generateMeetLink(){
  const c='abcdefghijklmnopqrstuvwxyz';
  const seg=()=>Array.from({length:3},()=>c[Math.floor(Math.random()*c.length)]).join('');
  return `https://meet.google.com/${seg()}-${seg()}-${seg()}`;
}
function generateZoomLink(){
  return `https://zoom.us/j/${Math.floor(Math.random()*9000000000)+1000000000}`;
}
function copyToClipboard(text){
  navigator.clipboard.writeText(text).then(()=>showToast('Link kopyalandı ✓')).catch(()=>{
    const el=document.createElement('textarea');el.value=text;document.body.appendChild(el);el.select();document.execCommand('copy');el.remove();showToast('Link kopyalandı ✓');
  });
}

// ═══════════════════════════════════════════════
// TEMA SİSTEMİ
// ═══════════════════════════════════════════════
const ACCENT_COLORS=[
  {name:'Altın',val:'#f0a500',dim:'rgba(240,165,0,.12)'},
  {name:'Turuncu',val:'#e8622a',dim:'rgba(232,98,42,.12)'},
  {name:'Mavi',val:'#4da6ff',dim:'rgba(77,166,255,.12)'},
  {name:'Yeşil',val:'#3ecf8e',dim:'rgba(62,207,142,.12)'},
  {name:'Mor',val:'#c084fc',dim:'rgba(192,132,252,.12)'},
  {name:'Pembe',val:'#f472b6',dim:'rgba(244,114,182,.12)'},
  {name:'Kırmızı',val:'#ff5c5c',dim:'rgba(255,92,92,.12)'},
  {name:'Turkuaz',val:'#06b6d4',dim:'rgba(6,182,212,.12)'},
];

function loadTheme(){
  try{
    const s=JSON.parse(localStorage.getItem('ba_theme')||'{}');
    if(s.theme==='dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    if(s.accent) applyAccent(s.accent,s.accentDim,false);
  }catch(e){}
}

function applyAccent(val,dim,save=true){
  document.documentElement.style.setProperty('--accent',val);
  document.documentElement.style.setProperty('--accent-dim',dim||'rgba(240,165,0,.12)');
  if(save){try{const s=JSON.parse(localStorage.getItem('ba_theme')||'{}');s.accent=val;s.accentDim=dim;localStorage.setItem('ba_theme',JSON.stringify(s));}catch(e){}}
}

function setTheme(theme){
  if(theme==='dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  try{const s=JSON.parse(localStorage.getItem('ba_theme')||'{}');s.theme=theme;localStorage.setItem('ba_theme',JSON.stringify(s));}catch(e){}
  document.querySelectorAll('.theme-btn').forEach(b=>{
    const active=b.dataset.theme===theme;
    b.style.background=active?'var(--accent-dim)':'';
    b.style.borderColor=active?'var(--accent)':'';
    b.style.color=active?'var(--accent)':'';
  });
}

function openThemePanel(){
  let panel=document.getElementById('themePanel');
  if(panel){panel.remove();return;}
  panel=document.createElement('div');
  panel.id='themePanel';
  const isDark=document.documentElement.getAttribute('data-theme')!=='light';
  panel.style.cssText='position:fixed;top:60px;right:12px;background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:18px;z-index:300;box-shadow:var(--shadow-lg);min-width:230px;animation:fadeUp .2s ease';
  panel.innerHTML=`
    <div style="font-family:\'Inter\',sans-serif;font-size:13px;font-weight:700;margin-bottom:12px;color:var(--text)">🎨 Tema Ayarları</div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Mod</div>
    <div style="display:flex;gap:6px;margin-bottom:16px">
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="dark" onclick="setTheme('dark')" style="${isDark?'background:var(--accent-dim);border-color:var(--accent);color:var(--accent)':''}">🌙 Karanlık</button>
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="light" onclick="setTheme('light')" style="${!isDark?'background:var(--accent-dim);border-color:var(--accent);color:var(--accent)':''}">☀️ Aydınlık</button>
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Accent Rengi</div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px">
      ${ACCENT_COLORS.map(c=>`<div onclick="applyAccent('${c.val}','${c.dim}');document.getElementById('themePanel').remove()" title="${c.name}"
        style="width:28px;height:28px;border-radius:8px;background:${c.val};cursor:pointer;transition:transform .1s"
        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform=''"></div>`).join('')}
    </div>
    <button onclick="document.getElementById('themePanel').remove()" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text-mid);border-radius:8px;padding:7px;font-family:inherit;font-size:12px;cursor:pointer">Kapat</button>`;
  document.body.appendChild(panel);
  setTimeout(()=>document.addEventListener('click',function h(e){if(!panel.contains(e.target)&&!e.target.closest('[onclick*=openThemePanel]')){panel.remove();document.removeEventListener('click',h);}},true),150);
}

// ═══════════════════════════════════════════════
// AI KOÇ ASİSTANI
// ═══════════════════════════════════════════════
let aiChatHistory = [];
let aiIsTyping = false;

function initAIChatForRole() {
  const bubble = document.getElementById('aiChatBubble');
  const headerName = document.querySelector('.ai-header-name');
  const msgs = document.getElementById('aiMessages');
  if (!bubble || !headerName || !msgs) return;
  
  aiChatHistory = [];
  msgs.innerHTML = `
    <div class="ai-welcome">
      <div class="ai-welcome-emoji">🎓</div>
      <div class="ai-welcome-title"></div>
      <div class="ai-welcome-sub"></div>
      <div class="ai-quick-btns"></div>
    </div>`;
  
  const welcome = msgs.querySelector('.ai-welcome');
  const titleEl = welcome.querySelector('.ai-welcome-title');
  const subEl = welcome.querySelector('.ai-welcome-sub');
  const btnsEl = welcome.querySelector('.ai-quick-btns');

  if (session.role === 'coach' || session.role === 'developer') {
    bubble.title = "Yapay Zeka Koç Asistanı";
    headerName.textContent = "Yapay Zeka Koç Asistanı";
    titleEl.textContent = "Merhaba Hocam! Ben Koç Asistanınız";
    subEl.textContent = "Öğrenci analizleri, veri okuma, ders çalışma programı taslakları hazırlama ve pedagojik konularda size yardımcı olabilirim.";
    btnsEl.innerHTML = `
      <button class="ai-quick-btn" onclick="aiQuickSend('Seçili öğrencinin genel durum analizini yap')">📊 Öğrenci Analizi</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Pedagojik motivasyon teknikleri öner')">💡 Pedagojik Öneri</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zorlanan bir öğrenci için haftalık program şablonu oluştur')">📋 Program Şablonu</button>
    `;
  } else if (session.role === 'parent') {
    bubble.title = "Yapay Zeka Veli Bilgilendirme Asistanı";
    headerName.textContent = "Yapay Zeka Veli Asistanı";
    titleEl.textContent = "Merhaba! Ben Veli Asistanıyım";
    subEl.textContent = "Çocuğunuzun ders çalışma durumu, deneme netleri ve evde ona nasıl destek olabileceğiniz konularında bilgi alabilirsiniz.";
    btnsEl.innerHTML = `
      <button class="ai-quick-btn" onclick="aiQuickSend('Çocuğumun bu haftaki gelişimini özetle')">📊 Gelişim Özeti</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Evde verimli ders çalışma ortamı nasıl sağlanır?')">🏠 Ev Ortamı</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Sınav stresiyle başa çıkmak için veli olarak ne yapmalıyım?')">🧘 Stres Yönetimi</button>
    `;
  } else { // student, developer vb.
    bubble.title = "Yapay Zeka Ders Asistanı";
    headerName.textContent = "Yapay Zeka Ders Asistanı";
    titleEl.textContent = "Merhaba! Ben Ders Asistanın (Yapay Zeka)";
    subEl.textContent = "7/24 anlık soru çözümü, konu anlatımı, özet çıkarma ve mini pratik sınav konularında sana yardımcı olan mekanik bir asistanım. Ben bir yapay zekayım ve koçunun yerini alamam; duygusal veya motivasyonel konularda koçuna danışmalısın.";
    btnsEl.innerHTML = `
      <button class="ai-quick-btn" onclick="aiQuickSend('Çözemediğim bir Matematik/Fen sorusu var. Sokratik tarzda, adım adım ipuçları vererek çözmeme yardım eder misin?')">📝 Çözemediğim Soru Var</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bir konunun özetini çıkarmak istiyorum. Hangi ders ve konudan özet çıkarmak istediğimi sorup yardımcı olur musun?')">📖 Konu Özeti Çıkar</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zayıf olduğum konular üzerinde çalışıp pratik yapmak istiyorum. Hangi derslerden yardıma ihtiyacım olduğunu sorup pratik yapalım.')">🎯 Zayıf Konuları Çalış</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bana seçtiğim bir konudan 3 soruluk hızlı bir mini quiz yapar mısın? Soruları tek tek sor.')">⚡ Hızlı Sınav Yap</button>
    `;
  }
}

function toggleAIChat(){
  const panel = document.getElementById('aiChatPanel');
  const bubble = document.getElementById('aiChatBubble');
  if(panel.classList.contains('open')){
    panel.classList.remove('open');
    bubble.style.display='flex';
  } else {
    panel.classList.add('open');
    bubble.style.display='none';
    // Auto-scroll
    const msgs = document.getElementById('aiMessages');
    msgs.scrollTop = msgs.scrollHeight;
    document.getElementById('aiInput').focus();
  }
}

function aiQuickSend(text){
  document.getElementById('aiInput').value = text;
  sendAIMessage();
}

function buildAIContext(){
  const ctx = {};
  try {
    // Öğrenci bilgisi
    const stu = S.students.find(s=>s.id===S.activeStuId);
    if(stu) {
      ctx.studentName = stu.name;
      ctx.target = stu.target || '';
    }
    if(session.role==='parent' && session.childName) {
      ctx.studentName = session.childName;
    }
    // Son denemeler
    const stuExams = (S.exams||[]).filter(e=>e.studentId===S.activeStuId).slice(-5);
    if(stuExams.length) {
      ctx.recentExams = stuExams.map(e=>({
        name: e.type + ' ' + (e.name||''),
        date: e.date||'',
        nets: e.nets||{}
      }));
    }
    // Görev tamamlama
    let allTasks = [];
    Object.entries(S.tasks||{}).forEach(([key, tasks]) => {
      if(key.startsWith(S.activeStuId + '_')) {
        allTasks = allTasks.concat(tasks);
      }
    });
    if(allTasks.length) {
      const done = allTasks.filter(t=>t.done).length;
      ctx.taskCompletionRate = Math.round((done/allTasks.length)*100);
      ctx.weeklyTaskCount = allTasks.length;
    }
    // Sınav profili
    const examDefs = Object.keys(EXAM_DEFS);
    if(stuExams.length) ctx.examProfile = stuExams[0]?.type || examDefs[0];
  } catch(e) { console.warn('AI context error:', e); }
  return ctx;
}

function addAIMessage(role, content){
  aiChatHistory.push({role, content});
  const msgs = document.getElementById('aiMessages');
  // İlk mesajda welcome'ı kaldır
  const welcome = msgs.querySelector('.ai-welcome');
  if(welcome) welcome.remove();
  
  const time = new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  div.innerHTML = `${esc(content).replace(/\n/g,'<br>')}<div class="ai-msg-time">${time}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

let _aiPendingImg = null; // { base64, mimeType, name }

window._pickAiImg = function(inp) {
  const file = inp.files[0]; if (!file) return;
  if (file.size > 8 * 1024 * 1024) { showToast('Dosya max 8 MB olabilir'); inp.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result.split(',')[1];
    _aiPendingImg = { base64, mimeType: file.type, name: file.name };
    const prev = document.getElementById('aiImgPreview');
    const thumb = document.getElementById('aiImgThumb');
    const name = document.getElementById('aiImgName');
    thumb.src = e.target.result; thumb.style.display = 'block';
    name.textContent = file.name;
    prev.style.display = 'flex';
  };
  reader.readAsDataURL(file);
  inp.value = '';
};
window._cancelAiImg = function() {
  _aiPendingImg = null;
  const prev = document.getElementById('aiImgPreview');
  if (prev) prev.style.display = 'none';
};

async function sendAIMessage(){
  if(aiIsTyping) return;
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  const pendingImg = _aiPendingImg;
  if(!text && !pendingImg) return;

  input.value = '';
  if (pendingImg) {
    window._cancelAiImg();
    const msgs = document.getElementById('aiMessages');
    const welcome = msgs.querySelector('.ai-welcome'); if(welcome) welcome.remove();
    const div = document.createElement('div');
    div.className = 'ai-msg user';
    div.innerHTML = `<img src="data:${pendingImg.mimeType};base64,${pendingImg.base64}" style="max-width:180px;max-height:180px;border-radius:10px;display:block" />${text ? `<div style="margin-top:6px">${esc(text)}</div>` : ''}<div class="ai-msg-time">${new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}</div>`;
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
    aiChatHistory.push({role:'user', content: text || 'Fotoğraftaki soruyu çöz.', image: pendingImg});
  } else {
    addAIMessage('user', text);
  }
  
  // Typing indicator
  aiIsTyping = true;
  document.getElementById('aiTyping').classList.add('show');
  document.getElementById('aiSendBtn').disabled = true;
  
  try {
    const context = buildAIContext();
    const userRole = session.role || 'student';

    // Fotoğraf varsa Groq desteklemiyor — ai-chat'e imageBase64 gönder (Gemini branch)
    if (pendingImg) {
      const visRes = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: pendingImg.base64,
          mimeType: pendingImg.mimeType,
          text: text || 'Bu soruyu çöz.',
          context,
          userRole
        })
      });
      if (visRes.ok) {
        const visData = await visRes.json();
        addAIMessage('assistant', visData.reply || 'Yanıt alınamadı.');
      } else {
        // Server key yoksa client-side Gemini fallback
        const fallbackReply = await callGeminiFallback(text, context, userRole, pendingImg);
        addAIMessage('assistant', fallbackReply);
      }
    } else {
      const apiUrl = '/api/ai-chat';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          messages: aiChatHistory.slice(-10),
          context,
          userRole
        })
      });

      if(!response.ok) {
        const fallbackReply = await callGeminiFallback(text, context, userRole, null);
        addAIMessage('assistant', fallbackReply);
      } else {
        const data = await response.json();
        addAIMessage('assistant', data.reply || 'Yanıt alınamadı.');
      }
    }
  } catch(e) {
    console.error('AI error:', e);
    try {
      const ctx = buildAIContext();
      const fallbackReply = await callGeminiFallback(text, ctx, session.role||'student', pendingImg);
      addAIMessage('assistant', fallbackReply);
    } catch(e2) {
      const hasLocalKey = localStorage.getItem('gemini_api_key');
      if (!hasLocalKey) {
        addAIMessage('assistant', '🔒 Bu özellik ileride aktif olacaktır. Yakında kullanıma açılacak.');
      } else {
        addAIMessage('assistant', '🔒 Bu özellik ileride aktif olacaktır. Yakında kullanıma açılacak.');
      }
    }
  } finally {
    aiIsTyping = false;
    document.getElementById('aiTyping').classList.remove('show');
    document.getElementById('aiSendBtn').disabled = false;
  }
}

let _detectedGeminiModel = null;
async function autoDetectModel(key) {
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    if(!r.ok) return null;
    const data = await r.json();
    const models = data.models || [];
    // 1) Flash içeren ve generateContent destekleyen modeli ara
    let bestModel = models.find(m => m.name.toLowerCase().includes('flash') && m.supportedGenerationMethods.includes('generateContent'));
    // 2) Sadece generateContent destekleyen ilk modeli ara
    if(!bestModel) {
      bestModel = models.find(m => m.supportedGenerationMethods.includes('generateContent'));
    }
    if(bestModel) {
      return bestModel.name.replace('models/', '');
    }
  } catch(e) {
    console.warn('Auto-detect model failed:', e);
  }
  return null;
}

// Fallback: Doğrudan Gemini API (geliştirme modu için)
async function callGeminiFallback(userText, context, userRole, pendingImg) {
  let localKey = localStorage.getItem('gemini_api_key');
  if (!localKey) {
    try {
      const { data } = await db.from('platform_settings').select('value').eq('key', 'ai_settings').maybeSingle();
      if (data && data.value && data.value.gemini_api_key) {
        localKey = data.value.gemini_api_key;
      }
    } catch(e) {
      console.warn('DB Gemini API key load error:', e);
    }
  }
  const GEMINI_KEY = localKey;
  if (!GEMINI_KEY) {
    throw new Error('API anahtarı eksik.');
  }
  
  let modelName = 'gemini-1.5-flash'; // Varsayılan model
  if (GEMINI_KEY) {
    if (_detectedGeminiModel) {
      modelName = _detectedGeminiModel;
    } else {
      const detected = await autoDetectModel(GEMINI_KEY);
      if (detected) {
        _detectedGeminiModel = detected;
        modelName = detected;
        console.log('[Gemini API] Otomatik model tespiti başarılı:', modelName);
      }
    }
  }
  
  let systemPrompt = `Sen "Rostrum Akademi Yapay Zeka Asistanı"sın. Türkiye eğitim sistemine (YKS, LGS) hakim, rolüne göre öğrencilere, velilere veya koçlara destek veren bir yapay zekasın.\n\nKESİNLİKLE YALNIZCA TÜRKÇE yanıt ver. İngilizce, Japonca, Çince veya başka hiçbir dil/karakter kullanma.

Rostrum Akademi İşleyişi, Üyelik ve Fiyatlandırma Bilgileri:
1. Kayıt olan tüm koçlara 14 gün ücretsiz deneme süresi tanımlanır. Bu süre bitiminde panel kilitlenir.
2. Otomatik ödeme/kredi kartı altyapısı yoktur; paket satın alma, ödeme ve lisans uzatma işlemleri tamamen manuel olarak yürütülür.
3. Kullanıcılar paket satın almak, deneme sürelerini uzatmak veya üyeliklerini aktif etmek için Kurucu Emin Ceylan (ceylanemin1928@gmail.com) ile iletişime geçmelidir.
4. Destek panelinde bulunan "Kurucuya / Destek Ekibine Yaz" seçeneği ile doğrudan kurucu ekibe mesaj gönderebilir ve bu ekran üzerinden onunla canlı yazışabilirler.
5. Güncel Paket Fiyatları:
   - Başlangıç Paketi (Starter): Aylık 299 TL
   - Koç Pro Paketi (Pro): Aylık 599 TL
   - Kurumsal Paket (Enterprise): Aylık 1499 TL`;
  
  // Kullanıcı & üyelik bilgisi
  const dbUser = session.dbUser;
  if (dbUser) {
    const plan = dbUser.plan || 'trial';
    const planLabel = {trial:'Deneme',starter:'Başlangıç',pro:'Pro',enterprise:'Kurumsal'}[plan] || plan;
    if (plan === 'trial') {
      const trialEnd = dbUser.trial_ends_at
        ? new Date(dbUser.trial_ends_at)
        : new Date(new Date(dbUser.created_at).getTime() + 14*24*60*60*1000);
      const daysLeft = Math.max(0, Math.ceil((trialEnd - Date.now()) / 86400000));
      systemPrompt += `\nKULLANICI BİLGİSİ: Ad=${dbUser.full_name||dbUser.username}, Plan=${planLabel}, Deneme süresi kalan=${daysLeft} gün (bitiş: ${trialEnd.toLocaleDateString('tr-TR')}).`;
    } else {
      systemPrompt += `\nKULLANICI BİLGİSİ: Ad=${dbUser.full_name||dbUser.username}, Plan=${planLabel} (aktif üye).`;
    }
  }

  const hasImage = !!pendingImg;

  if(userRole === 'parent') {
    systemPrompt += '\nVELİ MODU: Veliye saygılı ve güven verici konuş. Çocuğun durumunu yapıcı aktar.';
  } else if(userRole === 'student') {
    if (hasImage) {
      systemPrompt += `\nÖĞRENCİ MODU — SORU ÇÖZÜMÜ:
Öğrenci sana bir soru fotoğrafı gönderdi. Şu anda o sorunun ait olduğu dersin uzman öğretmenisin.
Kurallar:
1. Soruyu dikkatlice incele, konusunu belirle ve kısaca belirt (örn: "Bu soru trigonometri konusundan").
2. Çözümü adım adım, net ve öğretici bir dille yaz. Her adımı numaralandır.
3. Formül veya kural kullandıysan neden kullandığını açıkla.
4. Varsa alternatif çözüm yolunu da kısaca belirt.
5. Sonunda öğrenciye bu konuyu pekiştirmek için 1 kısa öneri ekle.`;
    } else {
      systemPrompt += `\nÖĞRENCİ MODU (YAPAY ZEKA DERS ASİSTANI):
1. Kendini net bir Yapay Zeka Ders Asistanı olarak tanıt; insan gibi davranma.
2. Duygusal/motivasyonel koçluk yapma; bu talepleri koça yönlendir.
3. Sokratik yöntem kullan: doğrudan cevap yerine ipucu ver, sorular sor.
4. Sadece soru çözümü, konu anlatımı, özet, mini test yap. Program önerisini reddet.`;
    }
  } else if(userRole === 'coach') {
    systemPrompt += `\nKOÇ MODU (YAPAY ZEKA COPILOT):
Karşındaki kişi bir Eğitim Koçudur. Ona profesyonel bir meslektaş gibi hitap et. Veri odaklı analizler, pedagojik öneriler sun.`;
  }

  if(userRole === 'coach' && context.studentName) {
    systemPrompt += `\nŞu anda seçili öğrenci: ${context.studentName}`;
  } else if(context.studentName) {
    systemPrompt += `\nÖğrenci: ${context.studentName}`;
  }
  if(context.recentExams) systemPrompt += `\nSon denemeler: ${JSON.stringify(context.recentExams)}`;
  if(context.taskCompletionRate!==undefined) systemPrompt += `\nGörev tamamlama: %${context.taskCompletionRate}`;
  if(context.target) systemPrompt += `\nHedef: ${context.target}`;

  // Build Gemini messages with optional image
  const historyMsgs = aiChatHistory.slice(-8).map(m => {
    const parts = [];
    if (m.image) parts.push({ inlineData: { mimeType: m.image.mimeType, data: m.image.base64 } });
    parts.push({ text: m.content || (m.image ? 'Soruyu çöz' : '') });
    return { role: m.role==='user'?'user':'model', parts };
  });

  const messages = [
    {role:'user', parts:[{text: systemPrompt}]},
    {role:'model', parts:[{text:'Anladım! Rostrum Akademi Yapay Zeka Asistanı olarak hazırım.'}]},
    ...historyMsgs
  ];
  
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      contents: messages,
      generationConfig: {temperature:0.7, maxOutputTokens:1500}
    })
  });
  
  if(!resp.ok) {
    let errMsg = `HTTP ${resp.status}`;
    try {
      const errData = await resp.json();
      if(errData?.error?.message) errMsg = errData.error.message;
    } catch(e) {}
    throw new Error(errMsg);
  }
  const data = await resp.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt üretilemedi.';
}

let _originalCopilotDraft = "";

async function generateAICopilotDraft(stuId) {
  const s = S.students.find(s=>s.id===stuId);
  if (!s) return;
  
  const btn = document.getElementById('aiCopilotBtn');
  btn.disabled = true;
  btn.textContent = "⌛ Analiz Ediliyor ve Taslak Oluşturuluyor...";
  
  try {
    // Haftalık görev bilgileri
    const ws = getWeekStart(0, s.weekStart||0);
    let wTotal=0, wDone=0, wMin=0;
    for(let i=0;i<7;i++){
      const tasks=S.tasks[`${s.id}_${fmtDate(addDays(ws,i))}`]||[];
      wTotal+=tasks.length; wDone+=tasks.filter(t=>t.done).length;
      wMin+=tasks.reduce((sum,t)=>sum+Number(t.duration||0),0);
    }
    const wPct=wTotal>0?Math.round((wDone/wTotal)*100):0;
    
    // Son denemeler
    const stuExams = (S.exams||[]).filter(e=>e.studentId===stuId).slice(-5);
    const recentExamsData = stuExams.map(e=>({
      name: e.type + ' ' + (e.name||''),
      date: e.date||'',
      nets: e.nets||{}
    }));
    
    // Hız bilgileri
    const speedMap = {};
    (S.studentSpeeds||[]).filter(sp=>sp.student_id===stuId).forEach(sp=>{
      speedMap[`${sp.exam_type}_${sp.subject}`] = sp.secs_per_question;
    });

    const prompt = `Lütfen şu öğrenci için haftalık durum analizi ve öğrenciye gönderilecek haftalık değerlendirme mesajı taslağı oluştur:
Öğrenci Adı: ${s.name}
Hedef: ${s.target || 'Belirtilmemiş'}
Bu haftaki görev tamamlama oranı: %${wPct} (${wDone}/${wTotal} görev tamamlandı, toplam ${Math.round(wMin/60)} saat çalışıldı)
Son denemeler: ${JSON.stringify(recentExamsData)}
Soru Çözüm Hızları (saniye/soru): ${JSON.stringify(speedMap)}

ANALİZ VE TASLAK KURALLARI (TÜRKÇE YAZ):
1. Analiz kısmını koçun göreceği şekilde kısa, net ve yapıcı tut. Zayıf konuları ve sınav netlerindeki değişimleri vurgula.
2. Öğrenciye gönderilecek mesaj taslağını samimi ve destekleyici yaz, fakat koçun kendi yorumlarını ekleyebileceği şablon alanları bırak. Örneğin: "[Buraya öğrenciyle son görüşmenizden özel bir not ekleyin]" veya "[Zorlandığı konuyla ilgili kendi ek önerilerinizi girin]".
3. Mesaj taslağı tamamen Türkçe, samimi ve yapıcı olmalıdır. Asla yapay zeka olduğunu belli eden klişeler içermesin.
4. Çıktıyı tam olarak şu iki etiket arasında yapılandır:
[ANALİZ]
(Koç için durum analizi ve anomali tespiti)
[TASLAK]
(Öğrenciye gönderilecek haftalık değerlendirme taslağı)`;

    let reply = "";
    const context = {
      studentName: s.name,
      target: s.target,
      recentExams: recentExamsData,
      taskCompletionRate: wPct,
      weeklyTaskCount: wTotal
    };
    
    // Fetch or Fallback
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          messages: [{role: 'user', content: prompt}],
          context,
          userRole: 'coach'
        })
      });
      if (response.ok) {
        const data = await response.json();
        reply = data.reply;
      } else {
        reply = await callGeminiFallback(prompt, context, 'coach');
      }
    } catch(e) {
      reply = await callGeminiFallback(prompt, context, 'coach');
    }
    
    // Parse reply
    let analysis = "Analiz üretilemedi.";
    let draft = "Taslak üretilemedi.";
    
    const analysisIdx = reply.indexOf('[ANALİZ]');
    const draftIdx = reply.indexOf('[TASLAK]');
    
    if (analysisIdx !== -1 && draftIdx !== -1) {
      if (analysisIdx < draftIdx) {
        analysis = reply.substring(analysisIdx + 8, draftIdx).trim();
        draft = reply.substring(draftIdx + 8).trim();
      } else {
        draft = reply.substring(draftIdx + 8, analysisIdx).trim();
        analysis = reply.substring(analysisIdx + 8).trim();
      }
    } else {
      draft = reply;
    }
    
    document.getElementById('aiCopilotAnalysisBox').innerHTML = `<b>📊 Yapay Zeka Durum Analizi:</b><br>${analysis.replace(/\n/g, '<br>')}`;
    document.getElementById('aiCopilotTextarea').value = draft;
    _originalCopilotDraft = draft;
    
    // Reset controls
    document.getElementById('aiCopilotResultArea').style.display = 'block';
    document.getElementById('aiCopilotSendBtn').disabled = true;
    document.getElementById('aiCopilotEditWarning').style.display = 'inline';
    
  } catch(e) {
    console.error('generateAICopilotDraft error:', e);
    showToast('Taslak oluşturulurken hata: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "🤖 Durum Analizi Yap ve Taslak Oluştur";
  }
}

function checkCopilotDraftEdited() {
  const val = document.getElementById('aiCopilotTextarea').value.trim();
  const sendBtn = document.getElementById('aiCopilotSendBtn');
  const warning = document.getElementById('aiCopilotEditWarning');
  
  if (val && val !== _originalCopilotDraft) {
    sendBtn.disabled = false;
    warning.style.display = 'none';
  } else {
    sendBtn.disabled = true;
    warning.style.display = 'inline';
  }
}

async function sendCopilotDraft(stuId) {
  const text = document.getElementById('aiCopilotTextarea').value.trim();
  if (!text) return;
  
  const sendBtn = document.getElementById('aiCopilotSendBtn');
  sendBtn.disabled = true;
  sendBtn.textContent = "Gönderiliyor...";
  
  try {
    const coachId = session.coachId || S.students.find(s=>s.id===stuId)?.coachId;
    const {data, error} = await db.from('messages').insert({
      student_id: stuId,
      coach_id: coachId,
      from_role: 'coach',
      text: text,
      read: false
    }).select().single();
    
    if (error) throw error;

    // Ayrıca reports tablosuna arşivle
    await db.from('reports').insert({
      student_id: stuId,
      coach_id: coachId,
      type: 'ai_copilot',
      title: 'Yapay Zeka Copilot Değerlendirmesi',
      content: text,
      start_date: todayStr(),
      end_date: todayStr()
    });
    
    if (!S.messages[stuId]) S.messages[stuId] = [];
    S.messages[stuId].push({
      _id: data.id,
      from: 'coach',
      text: text,
      time: new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}),
      read: false
    });
    
    showToast('Taslak mesaj başarıyla düzenlendi, öğrenciye gönderildi ve arşive kaydedildi! ✓');
    
    // Clear Copilot Area
    document.getElementById('aiCopilotResultArea').style.display = 'none';
    document.getElementById('aiCopilotTextarea').value = '';
    _originalCopilotDraft = "";
    
  } catch(e) {
    console.error('sendCopilotDraft error:', e);
    showToast('Gönderim hatası: ' + e.message);
    sendBtn.disabled = false;
  } finally {
    sendBtn.textContent = "✍️ Düzenlemeyi Kaydet ve Öğrenciye Gönder";
  }
}

// ═══════════════════════════════════════════════
// VELİ DASHBOARD
// ═══════════════════════════════════════════════
function renderParentHome(){
  const stu = S.students.find(s=>s.id===S.activeStuId);
  const childName = session.childName || stu?.name || 'Öğrenci';
  const el = document.getElementById('view-parent-home');
  if(!el) return;
  
  // Görev istatistikleri
  let allTasks = [];
  Object.entries(S.tasks||{}).forEach(([key, tasks]) => {
    if(key.startsWith(S.activeStuId + '_')) {
      allTasks = allTasks.concat(tasks);
    }
  });
  const doneTasks = allTasks.filter(t=>t.done).length;
  const taskRate = allTasks.length ? Math.round((doneTasks/allTasks.length)*100) : 0;
  
  // Son denemeler
  const exams = (S.exams||[]).filter(e=>e.studentId===S.activeStuId).slice(-3);
  
  el.innerHTML = `
    <div style="padding:24px;max-width:800px;margin:0 auto">
      <div style="margin-bottom:24px">
        <div style="font-size:24px;font-weight:800;margin-bottom:4px">👋 Merhaba!</div>
        <div style="color:var(--text-mid);font-size:14px">${esc(childName)}'in koçluk paneli</div>
      </div>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px">
        <div class="card" style="text-align:center;padding:20px">
          <div style="font-size:32px;font-weight:800;color:var(--accent)">${taskRate}%</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:4px">Görev Tamamlama</div>
          <div style="background:var(--surface2);border-radius:8px;height:6px;margin-top:10px;overflow:hidden">
            <div style="height:100%;width:${taskRate}%;background:var(--green);border-radius:8px;transition:width .5s"></div>
          </div>
        </div>
        <div class="card" style="text-align:center;padding:20px">
          <div style="font-size:32px;font-weight:800;color:var(--blue)">${doneTasks}/${allTasks.length}</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:4px">Tamamlanan Görevler</div>
        </div>
        <div class="card" style="text-align:center;padding:20px">
          <div style="font-size:32px;font-weight:800;color:var(--green)">${exams.length}</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:4px">Son Denemeler</div>
        </div>
      </div>
      
      ${exams.length ? `
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;margin-bottom:12px">📊 Son Deneme Sonuçları</div>
        ${exams.map(e=>{
          const total = Object.values(e.nets||{}).reduce((a,v)=>a+(parseFloat(v)||0),0);
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${esc(e.name||e.type)}</div><div style="font-size:11px;color:var(--text-mid)">${e.date||''}</div></div>
            <div style="font-weight:800;color:var(--accent)">${total.toFixed(1)} net</div>
          </div>`;
        }).join('')}
      </div>` : ''}
      
      <div class="card" style="padding:20px;background:linear-gradient(135deg,rgba(240,165,0,.05),rgba(62,207,142,.05))">
        <div style="font-size:15px;font-weight:700;margin-bottom:8px">🤖 AI Asistandan Yardım Alın</div>
        <div style="font-size:12px;color:var(--text-mid);margin-bottom:12px">Çocuğunuzun ilerlemesi hakkında anında rapor alabilirsiniz.</div>
        <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;width:100%;padding:12px">🤖 AI Asistan ile Konuş</button>
      </div>
    </div>`;
}

function renderParentProgress(){
  const el = document.getElementById('view-parent-progress');
  if(!el) return;
  const stu = S.students.find(s=>s.id===S.activeStuId);
  const childName = session.childName || stu?.name || 'Öğrenci';
  const exams = (S.exams||[]).filter(e=>e.studentId===S.activeStuId);
  let allTasks = [];
  Object.entries(S.tasks||{}).forEach(([key, tasks]) => {
    if(key.startsWith(S.activeStuId + '_')) {
      allTasks = allTasks.concat(tasks);
    }
  });
  
  el.innerHTML = `
    <div style="padding:24px;max-width:800px;margin:0 auto">
      <div style="font-size:20px;font-weight:800;margin-bottom:20px">📊 ${esc(childName)} - İlerleme Raporu</div>
      
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📋 Haftalık Görevler</div>
        ${allTasks.length ? allTasks.slice(-10).map(t=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="width:20px;height:20px;border-radius:50%;background:${t.done?'var(--green)':'var(--surface2)'};border:2px solid ${t.done?'var(--green)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">${t.done?'✓':''}</div>
            <div style="flex:1;font-size:13px">${esc(t.subject)} <span style="font-size:11px;color:var(--text-dim)">(${typeLabel(t.type)})</span></div>
            <div style="font-size:11px;color:var(--text-mid)">${t.done?'Tamamlandı':'Bekliyor'}</div>
          </div>`).join('') : '<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz görev bulunmuyor.</div>'}
      </div>
      
      <div class="card" style="padding:20px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📊 Deneme Geçmişi</div>
        ${exams.length ? exams.slice(-10).map(e=>{
          const total = Object.values(e.nets||{}).reduce((a,v)=>a+(parseFloat(v)||0),0);
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${esc(e.name||e.type)}</div><div style="font-size:11px;color:var(--text-mid)">${e.date||''}</div></div>
            <div style="font-weight:800;color:var(--accent)">${total.toFixed(1)} net</div>
          </div>`;
        }).join('') : '<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz deneme sonucu yok.</div>'}
      </div>
    </div>`;
}

function renderParentAI(){
  const el = document.getElementById('view-parent-ai');
  if(!el) return;
  el.innerHTML = `
    <div style="padding:24px;max-width:600px;margin:0 auto;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🤖</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px">AI Koç Asistanı</div>
      <div style="font-size:13px;color:var(--text-mid);margin-bottom:24px;line-height:1.7">Çocuğunuzun eğitim süreci hakkında sorular sorun, deneme analizleri isteyin veya öneriler alın.</div>
      <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;padding:14px 32px;font-size:15px">💬 AI Asistan ile Konuşmaya Başla</button>
    </div>`;
}

// ═══════════════════════════════════════════════
// NEW FEATURES: COACH RESOURCES, EXCEL IMPORT, ANALYTICS, INDICATORS, TASK EDITING, TEMPLATES & CLIPBOARD
// ═══════════════════════════════════════════════

let _editTaskData = null; // Stores task being edited: { ds, idx, taskObj }
let _coachSelectedResource = null;

// Developer save user fallback
async function saveStudentDev(){
  const id=document.getElementById('smId').value;
  const name=document.getElementById('smName').value.trim();
  const uname=normalizeUsername(document.getElementById('smUsername').value.trim());
  const passRaw=document.getElementById('smPass').value;
  const role=document.getElementById('smRole').value;
  const target=document.getElementById('smTarget').value.trim();
  const color=document.querySelector('.color-opt.sel')?.dataset.c||'#f0a500';
  const weekStart=Number(document.getElementById('smWeekStart').value);
  const progress=Number(document.getElementById('smProg').value);

  if(!name || !uname || !passRaw) return showToast('Ad, kullanıcı adı ve şifre zorunlu!');
  const pass = passRaw.length === 64 ? passRaw : await sha256(passRaw);
  const email = uname + '@rostrumakademi.com';

  const payload={
    full_name:name, username:uname, password_hash:pass, role, target, color, week_start:weekStart, progress
  };

  showLoading(true);
  if(id){
    const {error}=await db.from('users').update(payload).eq('id',id);
    showLoading(false);
    if(error) return showToast('Hata: '+error.message);
    showToast('Kullanıcı güncellendi ✓');
  } else {
    const { data: newUserId, error } = await db.rpc('create_new_user', {
      p_email: email,
      p_password: passRaw,
      p_full_name: name,
      p_username: uname,
      p_role: role,
      p_target: target,
      p_color: color,
      p_progress: progress,
      p_week_start: weekStart,
      p_coach_id: null,
      p_institution_id: null,
      p_exam_profile: 'YKS'
    });
    showLoading(false);
    if(error) return showToast('Hata: '+error.message);
    showToast('Kullanıcı başarıyla oluşturuldu ✓');
  }
  cm('studentModal');
  renderDevUsers();
}

// 1. Kaynaklarım UI Tab Görünümü
let _crAllRes = [];
let _crFilter = { search: '', exam: '', subject: '' };

function applyResFilter(all) {
  const q = _crFilter.search;
  return all.filter(r => {
    if (q && !r.name.toLowerCase().includes(q) && !(r.publisher||'').toLowerCase().includes(q)) return false;
    if (_crFilter.exam && r.exam_type !== _crFilter.exam) return false;
    if (_crFilter.subject && r.subject !== _crFilter.subject) return false;
    return true;
  });
}

function updateCRFilter() {
  _crFilter.search = (document.getElementById('crSearch')?.value || '').toLowerCase().trim();
  _crFilter.exam   = document.getElementById('crExam')?.value || '';
  _crFilter.subject = document.getElementById('crSubject')?.value || '';
  const contentEl = document.getElementById('cr-tab-content');
  if (!contentEl) return;
  const activeCls = document.querySelector('.cr-tab.active');
  const tab = activeCls?.id === 'crt-playlists' ? 'playlists' : activeCls?.id === 'crt-analytics' ? 'analytics' : 'books';
  const filtered = applyResFilter(_crAllRes);
  contentEl.innerHTML = buildCRContent(tab, filtered);
}

function buildCRContent(activeTab, res) {
  const books = res.filter(r => r.resource_type === 'book');
  const playlists = res.filter(r => r.resource_type === 'playlist');

  const SUBJ_COLOR = {
    'Matematik':'#3B82F6','Fizik':'#8B5CF6','Kimya':'#06B6D4','Biyoloji':'#10B981',
    'Geometri':'#6366F1','Türkçe':'#F59E0B','Edebiyat':'#EC4899','Tarih':'#EF4444',
    'Coğrafya':'#84CC16','Felsefe':'#14B8A6','Din Kültürü':'#F97316','Din':'#F97316','Genel':'#6B7280',
  };
  const SUBJ_ICON = {
    'Matematik':'∑','Fizik':'⚛','Kimya':'🧪','Biyoloji':'🌿',
    'Geometri':'△','Türkçe':'T','Edebiyat':'✒','Tarih':'🏛',
    'Coğrafya':'🌍','Felsefe':'💭','Din Kültürü':'☪','Din':'☪','Genel':'📌',
  };

  function buildGroupedList(items, type) {
    if(!items.length) return `<div style="text-align:center;padding:48px;color:var(--text-dim);font-size:13px">Kaynak bulunamadı.</div>`;
    const groups = {};
    items.forEach(r => {
      const key = r.exam_type || 'Diğer';
      if(!groups[key]) groups[key] = {};
      const sub = r.subject || 'Genel';
      if(!groups[key][sub]) groups[key][sub] = [];
      groups[key][sub].push(r);
    });
    return Object.entries(groups).map(([exam, subjects]) => `
      <div style="margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#fff;background:var(--accent);padding:3px 10px;border-radius:99px">${exam}</span>
          <div style="flex:1;height:1px;background:var(--border)"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
        ${Object.entries(subjects).map(([sub, rows]) => {
          const color = SUBJ_COLOR[sub]||'#6B7280';
          const icon = SUBJ_ICON[sub]||'📌';
          return `<div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:7px">
              <div style="width:22px;height:22px;border-radius:6px;background:${color}20;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${color};flex-shrink:0">${icon}</div>
              <span style="font-size:12px;font-weight:700;color:${color}">${sub}</span>
              <span style="font-size:10px;color:var(--text-dim)">${rows.length} kaynak</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;padding-left:28px">
              ${rows.map(r => `
                <div style="display:flex;align-items:center;padding:10px 14px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);gap:12px;cursor:default;transition:all .15s;box-shadow:var(--shadow)" onmouseover="this.style.borderColor='${color}';this.style.boxShadow='0 2px 12px ${color}22'" onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='var(--shadow)'">
                  <div style="flex:1;min-width:0">
                    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px">${esc(r.name)}${r.coach_id?` <span style="font-size:10px;font-weight:700;color:var(--accent);background:var(--accent-dim);padding:1px 6px;border-radius:99px;margin-left:4px">Özel</span>`:''}</div>
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                      <span style="font-size:11px;font-weight:600;color:var(--text-dim);background:var(--surface2);padding:1px 8px;border-radius:99px;border:1px solid var(--border)">${esc(r.publisher||'—')}</span>
                      <span style="font-size:11px;color:var(--text-dim)">${(r.tests||[]).length} ${type==='book'?'test':'video'}</span>
                    </div>
                  </div>
                  ${r.coach_id?`<div style="display:flex;gap:4px;flex-shrink:0">
                    <button class="btn btn-ghost btn-xs" onclick="openResourceModalCoach('${r.id}','${type}')">✏️</button>
                    <button class="btn btn-danger btn-xs" onclick="deleteResourceCoach('${r.id}')">🗑</button>
                  </div>`:''}
                </div>`).join('')}
            </div>
          </div>`;
        }).join('')}
        </div>
      </div>`).join('');
  }

  if (activeTab === 'books') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:8px">
        <div style="font-size:13px;color:var(--text-dim)">${books.length} soru bankası</div>
        <div style="display:flex;gap:8px">
          <label class="btn btn-ghost btn-sm" style="position:relative;cursor:pointer">📥 Excel'den Yükle<input type="file" accept=".xlsx,.xls,.csv" onchange="importResourcesFromExcel(event)" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label>
          <button class="btn btn-accent btn-sm" onclick="openResourceModalCoach(null,'book')">+ Soru Bankası</button>
        </div>
      </div>
      ${buildGroupedList(books, 'book')}`;
  } else if (activeTab === 'playlists') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:8px">
        <div style="font-size:13px;color:var(--text-dim)">${playlists.length} oynatma listesi</div>
        <div style="display:flex;gap:8px">
          <label class="btn btn-ghost btn-sm" style="position:relative;cursor:pointer">📥 Excel'den Yükle<input type="file" accept=".xlsx,.xls,.csv" onchange="importResourcesFromExcel(event)" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label>
          <button class="btn btn-accent btn-sm" onclick="openResourceModalCoach(null,'playlist')">+ Playlist Ekle</button>
        </div>
      </div>
      ${buildGroupedList(playlists, 'playlist')}`;
  } else {
    const stats = compileResourceStats(res);
    return `
      <div style="margin-bottom:16px">
        <h3 style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;margin-bottom:4px">Kaynak Analitiği Raporu</h3>
        <p style="font-size:11px;color:var(--text-dim)">Öğrencilerinizin en sık kullandığı ve en yüksek tamamlama oranına sahip kaynakları inceleyin.</p>
      </div>
      <div class="analytics-grid">
        ${stats.map(s=>{
          const pct=s.totalCount>0?Math.round((s.doneCount/s.totalCount)*100):0;
          const pctColor=pct>=80?'var(--green)':pct>=50?'var(--accent)':'var(--text-dim)';
          return `<div class="analytics-card">
            <div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">${s.exam_type} · ${s.subject}</div>
            <div style="font-size:14px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:8px">${esc(s.name)}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-mid);margin-bottom:6px"><span>Tamamlama</span><span style="font-weight:700;color:${pctColor}">%${pct}</span></div>
            <div style="height:5px;background:var(--surface3);border-radius:99px;overflow:hidden;margin-bottom:10px"><div style="height:100%;width:${pct}%;background:${pctColor};border-radius:99px"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim)"><span>Atanma: <b>${s.assignedCount}</b></span><span>Öğrenci: <b>${s.studentsCount}</b></span></div>
          </div>`;
        }).join('')||'<div style="grid-column:span 3;text-align:center;padding:40px;color:var(--text-dim)">Kayıtlı performans verisi bulunamadı.</div>'}
      </div>`;
  }
}

async function renderCoachResources() {
  const el = document.getElementById('view-coach-resources');
  if(!el) return;

  if(!_crAllRes.length) {
    el.innerHTML = `<div style="max-width:720px;margin:0 auto;padding:40px;text-align:center;color:var(--text-dim);font-size:13px">Kaynaklar yükleniyor…</div>`;
    const { data: resources, error } = await db.from('resources')
      .select('*')
      .or(`coach_id.eq.${session.coachId},coach_id.is.null`)
      .order('resource_type,exam_type,subject,name');
    if(error) console.error(error);
    _crAllRes = resources || [];
  }
  _crFilter = { search: '', exam: '', subject: '' };

  let activeTab = 'books';
  const prevTabEl = document.querySelector('.cr-tab.active');
  if(prevTabEl) {
    if(prevTabEl.id === 'crt-playlists') activeTab = 'playlists';
    else if(prevTabEl.id === 'crt-analytics') activeTab = 'analytics';
  }

  el.innerHTML = `<div style="max-width:720px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <h2 style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800">Kaynaklarım</h2>
        <p style="font-size:12px;color:var(--text-mid);margin-top:2px">Soru bankaları, video listeleri ve kaynak analitiği.</p>
      </div>
    </div>

    <div class="cr-tabs">
      <button class="cr-tab ${activeTab==='books'?'active':''}" id="crt-books" onclick="switchCRTab('books')">Soru Bankaları</button>
      <button class="cr-tab ${activeTab==='playlists'?'active':''}" id="crt-playlists" onclick="switchCRTab('playlists')">Oynatma Listeleri</button>
      <button class="cr-tab ${activeTab==='analytics'?'active':''}" id="crt-analytics" onclick="switchCRTab('analytics')">Kaynak Analizi</button>
    </div>

    <div class="cr-filter-bar">
      <div class="cr-filter-search">
        <span style="color:var(--text-dim);font-size:14px">🔍</span>
        <input type="text" id="crSearch" placeholder="Kaynak veya yayınevi ara..." oninput="updateCRFilter()" autocomplete="off">
      </div>
      <select class="cr-filter-select" id="crExam" onchange="updateCRFilter()">
        <option value="">Tüm Sınavlar</option>
        <option value="TYT">TYT</option>
        <option value="AYT-SAY">AYT Sayısal</option>
        <option value="AYT-EA">AYT EA</option>
        <option value="AYT-SOZ">AYT Sözel</option>
      </select>
      <select class="cr-filter-select" id="crSubject" onchange="updateCRFilter()">
        <option value="">Tüm Dersler</option>
        <option>Matematik</option><option>Fizik</option><option>Kimya</option><option>Biyoloji</option>
        <option>Geometri</option><option>Türkçe</option><option>Edebiyat</option><option>Tarih</option>
        <option>Coğrafya</option><option>Felsefe</option><option>Din</option>
      </select>
    </div>

    <div id="cr-tab-content">
      ${buildCRContent(activeTab, _crAllRes)}
    </div>
  </div>`;
}

function switchCRTab(tab) {
  document.querySelectorAll('.cr-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('crt-' + tab)?.classList.add('active');
  const filtered = applyResFilter(_crAllRes);
  document.getElementById('cr-tab-content').innerHTML = buildCRContent(tab, filtered);
}

// Kaynak kullanım istatistiklerini hesaplama fonksiyonu
function compileResourceStats(resources) {
  const resourceStats = {};
  
  resources.forEach(r => {
    resourceStats[r.name] = {
      name: r.name,
      exam_type: r.exam_type,
      subject: r.subject,
      assignedCount: 0,
      totalCount: 0,
      doneCount: 0,
      students: new Set()
    };
  });
  
  Object.entries(S.tasks).forEach(([key, tasks]) => {
    const studentId = key.split('_')[0];
    tasks.forEach(t => {
      resources.forEach(r => {
        if(t.subject && t.subject.includes(r.name)) {
          const stats = resourceStats[r.name];
          if(stats) {
            stats.assignedCount++;
            stats.students.add(studentId);
            
            if(t.task_items && Array.isArray(t.task_items)) {
              t.task_items.forEach(item => {
                stats.totalCount++;
                if(item.done || t.done) stats.doneCount++;
              });
            } else {
              stats.totalCount++;
              if(t.done) stats.doneCount++;
            }
          }
        }
      });
    });
  });
  
  return Object.values(resourceStats)
    .map(s => ({
      ...s,
      studentsCount: s.students.size
    }))
    .filter(s => s.assignedCount > 0)
    .sort((a,b) => b.assignedCount - a.assignedCount);
}

// Koç özel kaynak ekleme modalı
function openResourceModalCoach(id, type='book') {
  const isPlaylist = type==='playlist';
  let modal = document.getElementById('coachResourceModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'coachResourceModal';
    modal.className = 'modal-bg';
    modal.innerHTML = `<div class="modal modal-lg">
      <button class="modal-close" onclick="cm('coachResourceModal')">×</button>
      <h2 id="crmTitle">Kaynak Ekle</h2>
      <input type="hidden" id="crmId">
      <input type="hidden" id="crmType">
      <div class="field-row">
        <div class="field"><label>Sınav</label>
          <select id="crmExam"><option value="TYT">TYT</option><option value="AYT-SAY">AYT Sayısal</option><option value="AYT-EA">AYT EA</option><option value="AYT-SOZ">AYT Sözel</option></select>
        </div>
        <div class="field"><label>Ders</label>
          <select id="crmSubject">
            <option>Matematik</option><option>Fizik</option><option>Kimya</option><option>Biyoloji</option>
            <option>Geometri</option><option>Türkçe</option><option>Edebiyat</option><option>Tarih</option>
            <option>Coğrafya</option><option>Felsefe</option><option>Din</option>
          </select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Yayınevi / Hoca</label><input id="crmPublisher" placeholder="Karakök, Eyüp B..."></div>
        <div class="field"><label>Kaynak Adı</label><input id="crmName" placeholder="Soru Bankası / Kamp Adı"></div>
      </div>
      
      <div id="crmYtImportBox" style="border:1.5px solid rgba(255,0,0,.2);background:rgba(255,0,0,.04);border-radius:12px;padding:14px;margin-bottom:14px;display:none">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:7px">
            <span style="background:#ff0000;color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:4px;letter-spacing:.5px">YT</span>
            <span style="font-size:13px;font-weight:700">YouTube Playlist'ten Otomatik Çek</span>
          </div>
          <a href="/nasil-yapilir.html" target="_blank" style="font-size:11px;color:var(--accent);text-decoration:none;font-weight:600">❓ Nasıl yapılır?</a>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <input id="crmYtUrl" placeholder="https://youtube.com/playlist?list=PL..." style="flex:1;font-size:12px;border-radius:8px">
          <button type="button" class="btn btn-accent btn-sm" onclick="fetchYtPlaylistCoach()" style="white-space:nowrap">▶ Çek</button>
        </div>
        <div id="crmYtStatus" style="font-size:11px;color:var(--text-mid);margin-bottom:6px"></div>
        <!-- Video önizleme listesi -->
        <div id="crmVideoPreview" style="display:none;background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden;max-height:260px;overflow-y:auto"></div>
      </div>

      <!-- Kitap için textarea, playlist için gizli (veri dahili tutulur) -->
      <div class="field" id="crmTestsField">
        <label id="crmTestsLabel">Testler</label>
        <textarea id="crmTests" style="min-height:180px; font-size:12px; font-family:monospace" placeholder="Format:\nSayılar - Test 1 | 12\nSayılar - Test 2 | 14"></textarea>
      </div>
      <button class="btn btn-accent" style="width:100%; justify-content:center; padding:12px; margin-top:4px" onclick="saveResourceCoach()">Kaydet</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open'); });
  }

  document.getElementById('crmId').value = id || '';
  document.getElementById('crmType').value = type;
  document.getElementById('crmTitle').textContent = (id?'Kaynağı Düzenle':'Kaynak Ekle') + (isPlaylist?' — Playlist':' — Soru Bankası');
  document.getElementById('crmTestsLabel').innerHTML = isPlaylist ? 'Videolar <span style="color:var(--text-dim);font-weight:400">(Format: Video Adı | Link | Süre(dk))</span>' : 'Testler <span style="color:var(--text-dim);font-weight:400">(Format: Test Adı | Soru Sayısı)</span>';
  document.getElementById('crmTests').placeholder = isPlaylist ? 'Ders 1 | https://youtube.com/watch?v=xxx | 45\nDers 2 | https://youtube.com/watch?v=yyy | 38' : 'Sayılar - Test 1 | 12\nSayılar - Test 2 | 14';
  document.getElementById('crmYtImportBox').style.display = isPlaylist && !id ? '' : 'none';
  document.getElementById('crmTestsField').style.display = isPlaylist ? 'none' : '';
  document.getElementById('crmYtUrl').value = '';
  document.getElementById('crmYtStatus').textContent = '';
  document.getElementById('crmVideoPreview').style.display = 'none';
  document.getElementById('crmVideoPreview').innerHTML = '';
  window._crmFetchedVideos = [];

  if(id) {
    db.from('resources').select('*').eq('id', id).single().then(({data}) => {
      if(data) {
        document.getElementById('crmExam').value = data.exam_type;
        document.getElementById('crmSubject').value = data.subject;
        document.getElementById('crmPublisher').value = data.publisher || '';
        document.getElementById('crmName').value = data.name || '';
        const tests = data.tests || [];
        if(isPlaylist) {
          // Düzenleme modunda textarea göster, önizleme yerine
          document.getElementById('crmTestsField').style.display = '';
          document.getElementById('crmTests').value = tests.map(t=>`${t.label||t} | ${t.url||''} | ${t.soru||0}`).join('\n');
        } else {
          document.getElementById('crmTests').value = tests.map(t=>`${t.label||t} | ${t.soru||0}`).join('\n');
        }
      }
    });
  } else {
    document.getElementById('crmExam').value = 'TYT';
    document.getElementById('crmSubject').value = 'Matematik';
    document.getElementById('crmPublisher').value = '';
    document.getElementById('crmName').value = '';
    document.getElementById('crmTests').value = '';
  }

  om('coachResourceModal');
}

async function fetchYtPlaylistCoach() {
  const url = document.getElementById('crmYtUrl').value.trim();
  const statusEl = document.getElementById('crmYtStatus');
  if(!url) return statusEl.innerHTML = '<span style="color:var(--red)">⚠️ Playlist URL girin</span>';
  const match = url.match(/[?&]list=([^&]+)/);
  if(!match) return statusEl.innerHTML = '<span style="color:var(--red)">⚠️ list= parametresi bulunamadı</span>';
  const listId = match[1];

  statusEl.innerHTML = '⏳ Çekiliyor...';
  try {
    let videos = [], nextPage = '';
    do {
      let apiUrl = `/api/youtube?playlistId=${listId}`;
      if (nextPage) apiUrl += `&pageToken=${nextPage}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Playlist çekilemedi.');
      const data = await res.json();
      if(data.items) videos = videos.concat(data.items);
      nextPage = data.nextPageToken || '';
      statusEl.innerHTML = `⏳ ${videos.length} video yükleniyor...`;
    } while(nextPage && videos.length < 200);

    window._crmFetchedVideos = videos;

    // Görsel önizleme
    const preview = document.getElementById('crmVideoPreview');
    preview.style.display = '';
    preview.innerHTML = videos.map((v,i) => `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--border)">
        <div style="width:20px;height:20px;border-radius:5px;background:var(--surface3);color:var(--text-mid);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.title)}</div>
          <div style="font-size:10px;color:var(--text-dim)">⏱ ${v.duration||'?'} dk</div>
        </div>
        <a href="${esc(v.url)}" target="_blank" style="font-size:10px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:3px 8px;border-radius:6px;text-decoration:none;flex-shrink:0">▶</a>
      </div>`).join('');

    // Playlist adını otomatik doldur (boşsa)
    if(videos.length > 0 && !document.getElementById('crmName').value) {
      const first = videos[0].title;
      document.getElementById('crmName').value = first.split(' | ')[0].split(' - ')[0].trim().slice(0,50);
    }

    statusEl.innerHTML = `<span style="color:var(--green)">✓ ${videos.length} video çekildi!</span>`;
  } catch(e) {
    statusEl.innerHTML = `<span style="color:var(--red)">⚠️ Hata: ${e.message}</span>`;
  }
}

async function saveResourceCoach() {
  const name = document.getElementById('crmName').value.trim();
  const subject = document.getElementById('crmSubject').value;
  if(!name || !subject) return showToast('Ad ve ders zorunlu!');
  const id = document.getElementById('crmId').value;
  const isPlaylist = document.getElementById('crmType').value==='playlist';
  const lines = document.getElementById('crmTests').value.split('\n').map(l=>l.trim()).filter(Boolean);
  const fetched = window._crmFetchedVideos || [];

  let tests = [];
  if(isPlaylist) {
    if(fetched.length > 0) {
      // YouTube'dan çekilmiş veriler varsa onları kullan
      tests = fetched.map(v => ({label: v.title||'', url: v.url||'', topic:'', soru: parseInt(v.duration)||0}));
    } else {
      // Manuel girilmiş textarea verisi
      tests = lines.map(l=>{
        const p = l.split('|').map(x=>x.trim());
        return {label:p[0]||'', url:p[1]||'', topic:'', soru:parseInt(p[2])||0};
      });
    }
    if(!tests.length) return showToast('Video listesi boş! Önce playlist çekin.');
  } else {
    tests = lines.map(l=>{
      const p = l.split('|').map(x=>x.trim());
      return {label:p[0]||'', soru:parseInt(p[1])||0};
    });
  }

  const payload = {
    exam_type: document.getElementById('crmExam').value,
    subject,
    publisher: document.getElementById('crmPublisher').value.trim(),
    year: new Date().getFullYear(),
    name,
    tests,
    active: true,
    resource_type: isPlaylist?'playlist':'book',
    coach_id: session.coachId
  };

  showLoading(true);
  if(id) {
    await db.from('resources').update(payload).eq('id', id);
    showToast('Güncellendi ✓');
  } else {
    await db.from('resources').insert(payload);
    showToast('Kaynak eklendi ✓');
  }
  showLoading(false);
  cm('coachResourceModal');
  _crAllRes = [];
  renderCoachResources();
}

async function deleteResourceCoach(id) {
  if(!await customConfirm('Bu kaynağı silmek istediğinizden emin misiniz?')) return;
  showLoading(true);
  await db.from('resources').delete().eq('id', id);
  showLoading(false);
  showToast('Silindi');
  _crAllRes = [];
  renderCoachResources();
}

// 2. Excel okuma ve veri aktarma fonksiyonları
function importResourcesFromExcel(event) {
  const file = event.target.files[0];
  if(!file) return;

  showLoading(true);
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      if(rows.length === 0) {
        showLoading(false);
        return showToast('Excel dosyası boş!');
      }

      const resourcesMap = {};
      rows.forEach(row => {
        const name = row['Kaynak Adı'] || row['Name'] || row['Kitap Adı'] || row['Playlist Adı'] || '';
        const typeStr = row['Kaynak Türü'] || row['Type'] || row['Tür'] || 'book';
        const type = typeStr.toLowerCase().includes('playlist') ? 'playlist' : 'book';
        const publisher = row['Yayınevi'] || row['Publisher'] || row['Hoca'] || '';
        const exam = row['Sınav'] || row['Exam'] || 'TYT';
        const subject = row['Ders'] || row['Subject'] || '';
        const label = row['Öğe Adı'] || row['Test'] || row['Video'] || row['Test Adı'] || row['Video Adı'] || '';
        const soru = parseInt(row['Soru Sayısı'] || row['Soru'] || row['Süre'] || row['Süre (dk)'] || 0);
        const url = row['URL'] || row['Link'] || '';

        if(!name || !subject || !label) return;

        const key = `${name}_${exam}_${subject}_${type}`;
        if(!resourcesMap[key]) {
          resourcesMap[key] = {
            exam_type: exam,
            subject: subject,
            publisher: publisher,
            name: name,
            resource_type: type,
            tests: []
          };
        }
        resourcesMap[key].tests.push({
          label,
          soru,
          url,
          topic: ''
        });
      });

      const list = Object.values(resourcesMap);
      if(list.length === 0) {
        showLoading(false);
        return showToast('Uyumlu veri bulunamadı! Sütun başlıklarını kontrol edin.');
      }

      let count = 0;
      for(const resObj of list) {
        const { error } = await db.from('resources').insert({
          ...resObj,
          year: new Date().getFullYear(),
          active: true,
          coach_id: session.coachId
        });
        if(!error) count++;
      }

      showLoading(false);
      showToast(`✓ Excel'den ${count} kaynak başarıyla aktarıldı!`);
      _crAllRes = [];
      renderCoachResources();
    } catch(err) {
      showLoading(false);
      console.error(err);
      showToast('Excel okuma hatası: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function importStudentsFromExcel(event) {
  const file = event.target.files[0];
  if(!file) return;

  showLoading(true);
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      
      if(rows.length === 0) {
        showLoading(false);
        return showToast('Excel dosyası boş!');
      }

      let count = 0;
      for(const row of rows) {
        const name = row['Ad Soyad'] || row['Ad'] || row['Name'] || '';
        const target = row['Hedef'] || row['Target'] || 'Hedef belirtilmemiş';
        let uname = row['Kullanıcı Adı'] || row['Username'] || '';
        let passRaw = row['Şifre'] || row['Password'] || STU_DEFAULT_PASS;

        if(!name) continue;
        if(!uname) {
          uname = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random()*100);
          uname = normalizeUsername(uname);
        }

        const pass = await sha256(passRaw);
        const email = uname + '@rostrumakademi.com';

        const { data: newUserId, error } = await db.rpc('create_new_user', {
          p_email: email,
          p_password: passRaw,
          p_full_name: name,
          p_username: uname,
          p_role: 'student',
          p_target: target,
          p_color: '#4da6ff',
          p_progress: 0,
          p_week_start: 0,
          p_coach_id: session.coachId,
          p_institution_id: null,
          p_exam_profile: 'YKS'
        });

        if(!error && newUserId) {
          S.students.push({
            id: newUserId, name, target, color: '#4da6ff', progress: 0, pass, weekStart: 0, username: uname
          });
          count++;
        }
      }

      showLoading(false);
      showToast(`✓ Excel'den ${count} öğrenci başarıyla eklendi!`);
      saveUI();
      renderStudentsSearch();
    } catch(err) {
      showLoading(false);
      console.error(err);
      showToast('Excel okuma hatası: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// 3. Test durumunu kontrol eden analitik fonksiyon
function getTestStatus(label) {
  if (!S.activeStuId || !_selectedBook) return null;
  
  let status = null;
  Object.entries(S.tasks).forEach(([key, tasks]) => {
    if(key.startsWith(S.activeStuId + '_')) {
      tasks.forEach(t => {
        if (t.subject && t.subject.includes(_selectedBook.name)) {
          if(t.task_items && Array.isArray(t.task_items)) {
            t.task_items.forEach(item => {
              const itemLabel = item.label || item;
              if (itemLabel === label) {
                const isDone = item.done || t.done;
                if (isDone) {
                  status = 'done';
                } else if (status !== 'done') {
                  status = 'pending';
                }
              }
            });
          } else {
            if (t.note && t.note.includes(label)) {
              if (t.done) {
                status = 'done';
              } else if (status !== 'done') {
                status = 'pending';
              }
            }
          }
        }
      });
    }
  });
  return status;
}

// 4. Koç görev düzenleme modalı ve güncelleme
async function openCoachTaskEdit(ds, idx) {
  const stuId = S.activeStuId;
  const key = `${stuId}_${ds}`;
  const t = S.tasks[key]?.[idx];
  if(!t) return;
  
  _taskDate = ds;
  _editingTaskId = t._id;
  _selectedBook = null;
  
  // Set modal title to "Görev Düzenle"
  document.querySelector('#taskModal h2').innerHTML = `Görev Düzenle — <span id="tmDay">${ds}</span>`;
  
  // Set button text to "Güncelle"
  document.querySelector('#taskModal .btn-accent').textContent = 'Güncelle';
  
  // Load values
  document.getElementById('tmType').value = t.type;
  document.getElementById('tmExam').value = t.exam || '';
  document.getElementById('tmDuration').value = t.duration || 60;
  document.getElementById('tmStartTime').value = t.start_time || '';
  document.getElementById('tmNote').value = t.note || '';

  const exam = t.exam || '';
  const type = t.type;

  // updateSubjectList() yerine manuel kurulum — renderBookList'i tetiklemez
  {
    const sel = document.getElementById('tmSubjectSel');
    const free = document.getElementById('tmSubjectFree');
    document.getElementById('tmBookVal').value = '';
    document.getElementById('tmBookSearch').value = '';
    document.getElementById('tmBookList').style.display = 'none';
    document.getElementById('tmTestWrap').style.display = 'none';
    const sumEl = document.getElementById('tmTestSummary');
    if (sumEl) sumEl.style.display = 'none';
    if (exam && typeof SUBJECT_MAP !== 'undefined' && SUBJECT_MAP[exam]) {
      sel.innerHTML = SUBJECT_MAP[exam].map(s => `<option value="${s}">${s}</option>`).join('');
      sel.style.display = ''; free.style.display = 'none';
    } else {
      sel.style.display = 'none'; free.style.display = '';
    }
    const showPanel = (type === 'soru' || type === 'konu') && exam;
    document.getElementById('soruBankasiWrap').style.display = showPanel ? '' : 'none';
    const searchEl = document.getElementById('tmBookSearch');
    if (searchEl) searchEl.placeholder = type === 'konu' ? 'Hoca veya playlist ara...' : 'Kitap veya yayınevi ara...';
  }

  const isBookOrPlaylist = (type === 'soru' || type === 'konu') && exam;
  
  if (isBookOrPlaylist) {
    const sel = document.getElementById('tmSubjectSel');
    // If subject contains a " - ", e.g. "Matematik - Karakök Soru Bankası"
    let ders = '';
    let bookName = t.subject;
    if (t.subject.includes(' - ')) {
      const parts = t.subject.split(' - ');
      ders = parts[0].trim();
      bookName = parts.slice(1).join(' - ').trim();
    }
    
    if (ders && SUBJECT_MAP[exam] && SUBJECT_MAP[exam].includes(ders)) {
      sel.value = ders;
    }
    
    document.getElementById('tmBookVal').value = bookName;
    document.getElementById('tmBookSearch').value = bookName;
    
    // Now load resources, filter, and select this book
    showLoading(true);
    await loadResources(); // Ensure resources loaded
    showLoading(false);
    
    const keyStr = `${exam}_${ders}`;
    const books = _resourcesCache[keyStr] || [];
    let matchedBook = books.find(b => b.name === bookName);
    if (!matchedBook) {
      // search globally in cache
      Object.values(_resourcesCache).forEach(list => {
        const found = list.find(b => b.name === bookName);
        if (found) matchedBook = found;
      });
    }
    
    if (matchedBook) {
      _selectedBook = matchedBook;
      document.getElementById('tmTestWrap').style.display = '';
      
      // Render test list
      renderTestList();
      
      // Select the tests that were checked!
      const assignedLabels = (t.task_items || []).map(item => item.label || item);
      const checkboxes = document.querySelectorAll('#tmTestList input[type=checkbox]');
      checkboxes.forEach(cb => {
        const idxVal = parseInt(cb.value);
        const testLabel = _selectedBook.testler[idxVal]?.label || _selectedBook.testler[idxVal];
        if (assignedLabels.includes(testLabel)) {
          cb.checked = true;
        } else {
          cb.checked = false;
        }
      });
      updateTestSummary();
    }
  } else {
    // Plain text subject
    const sel = document.getElementById('tmSubjectSel');
    const free = document.getElementById('tmSubjectFree');
    if (sel.style.display !== 'none') {
      sel.value = t.subject;
    } else {
      free.value = t.subject;
    }
    document.getElementById('tmBookVal').value = '';
    document.getElementById('tmBookSearch').value = '';
    document.getElementById('tmBookList').style.display = 'none';
    document.getElementById('tmTestWrap').style.display = 'none';
  }
  
  om('taskModal');
}

// 5. Program Şablonları (Templates) Kaydet & Uygula
async function saveWeekAsTemplate() {
  const name = prompt("Şablon adı giriniz:");
  if(!name) return;
  
  const s = S.students.find(x=>x.id===S.activeStuId);
  const ws = s?.weekStart??0;
  const wStart = getWeekStart(S.weekOffset, ws);
  
  const templateTasks = [];
  for(let i=0; i<7; i++) {
    const d = addDays(wStart, i);
    const ds = fmtDate(d);
    const key = `${S.activeStuId}_${ds}`;
    const dayTasks = S.tasks[key] || [];
    dayTasks.forEach(t => {
      templateTasks.push({
        day_index: i,
        type: t.type,
        exam_type: t.exam || null,
        subject: t.subject,
        duration: t.duration,
        note: t.note || '',
        task_items: t.task_items || null
      });
    });
  }
  
  if(templateTasks.length === 0) return showToast('Bu haftada kaydedilecek görev bulunmuyor!');
  
  showLoading(true);
  const { error } = await db.from('program_templates').insert({
    coach_id: session.coachId,
    name: name,
    description: `${templateTasks.length} görev içeriyor.`,
    tasks: templateTasks
  });
  showLoading(false);
  
  if(error) return showToast('Şablon kaydedilemedi: ' + error.message);
  showToast('Hafta şablon olarak kaydedildi ✓');
}

async function applyTemplateToWeek() {
  showLoading(true);
  const { data: templates, error } = await db.from('program_templates').select('*').eq('coach_id', session.coachId);
  showLoading(false);
  if(error) return showToast('Şablonlar yüklenemedi.');
  if(!templates || templates.length === 0) return showToast('Kayıtlı şablonunuz bulunmuyor. Önce haftayı şablon olarak kaydedin.');
  
  let modal = document.getElementById('applyTemplateModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'applyTemplateModal';
    modal.className = 'modal-bg';
    modal.innerHTML = `<div class="modal">
      <button class="modal-close" onclick="cm('applyTemplateModal')">×</button>
      <h2>Şablon Uygula</h2>
      <div class="field"><label>Şablon Seçin</label>
        <select id="atmSelect"></select>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:12px" onclick="confirmApplyTemplate()">Uygula</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open'); });
  }
  
  document.getElementById('atmSelect').innerHTML = templates.map(t => `<option value="${t.id}">${esc(t.name)} (${t.tasks.length} Görev)</option>`).join('');
  om('applyTemplateModal');
}

async function confirmApplyTemplate() {
  const templateId = document.getElementById('atmSelect').value;
  if(!templateId) return;
  
  showLoading(true);
  const { data: template, error } = await db.from('program_templates').select('*').eq('id', templateId).single();
  if(error || !template) {
    showLoading(false);
    return showToast('Şablon yüklenemedi.');
  }
  
  const s = S.students.find(x=>x.id===S.activeStuId);
  const ws = s?.weekStart??0;
  const wStart = getWeekStart(S.weekOffset, ws);
  
  for(const t of template.tasks) {
    const targetDate = fmtDate(addDays(wStart, t.day_index));
    const payload = {
      student_id: S.activeStuId,
      coach_id: session.coachId,
      date: targetDate,
      type: t.type,
      exam_type: t.exam_type,
      subject: t.subject,
      duration: t.duration,
      note: t.note,
      done: false,
      task_items: t.task_items
    };
    
    const { data: inserted, error: insErr } = await db.from('tasks').insert(payload).select().single();
    if(!insErr && inserted) {
      const key = `${S.activeStuId}_${targetDate}`;
      if(!S.tasks[key]) S.tasks[key] = [];
      S.tasks[key].push({
        _id: inserted.id,
        type: inserted.type,
        exam: inserted.exam_type,
        subject: inserted.subject,
        duration: inserted.duration,
        note: inserted.note,
        done: false,
        student_note: '',
        task_items: inserted.task_items
      });
    }
  }
  showLoading(false);
  cm('applyTemplateModal');
  renderProgram();
  showToast('Şablon başarıyla uygulandı ✓');
}

// 6. Clipboard kopyala-yapıştır altyapısı
function copyTaskToClipboard(ds, idx) {
  const stuId = S.activeStuId;
  const key = `${stuId}_${ds}`;
  const t = S.tasks[key]?.[idx];
  if(!t) return;
  
  _clipboardTask = {
    type: t.type,
    exam: t.exam,
    subject: t.subject,
    duration: t.duration,
    note: t.note,
    task_items: t.task_items
  };
  showToast('Görev panoya kopyalandı ✓');
  renderProgram();
}

async function pasteTaskFromClipboard(ds) {
  if(!_clipboardTask) return;
  
  const payload = {
    student_id: S.activeStuId,
    coach_id: session.coachId,
    date: ds,
    type: _clipboardTask.type,
    exam_type: _clipboardTask.exam || null,
    subject: _clipboardTask.subject,
    duration: _clipboardTask.duration,
    note: _clipboardTask.note,
    done: false,
    task_items: _clipboardTask.task_items
  };
  
  showLoading(true);
  const { data, error } = await db.from('tasks').insert(payload).select().single();
  showLoading(false);
  if(error) return showToast('Hata: ' + error.message);
  
  const key = `${S.activeStuId}_${ds}`;
  if(!S.tasks[key]) S.tasks[key] = [];
  S.tasks[key].push({
    _id: data.id,
    type: data.type,
    exam: data.exam_type,
    subject: data.subject,
    duration: data.duration,
    note: data.note,
    done: false,
    student_note: '',
    task_items: data.task_items
  });
  
  renderProgram();
  showToast('Görev yapıştırıldı ✓');
}

async function copyTaskToWholeWeek(ds, idx) {
  const key = `${S.activeStuId}_${ds}`;
  const t = S.tasks[key]?.[idx];
  if(!t) return;

  const stu = S.students.find(s => s.id === S.activeStuId);
  const ws = stu?.weekStart ?? 0;
  const wStart = getWeekStart(S.weekOffset, ws);

  const payloads = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(wStart, i);
    const dateStr = fmtDate(d);
    if (dateStr === ds) continue;
    
    payloads.push({
      student_id: S.activeStuId,
      coach_id: session.coachId,
      date: dateStr,
      type: t.type,
      exam_type: t.exam || null,
      subject: t.subject,
      duration: t.duration,
      note: t.note,
      done: false,
      task_items: t.task_items
    });
  }

  if (payloads.length === 0) return;

  showLoading(true);
  const { data, error } = await db.from('tasks').insert(payloads).select();
  showLoading(false);
  
  if (error) return showToast('Hata: ' + error.message);

  (data || []).forEach(inserted => {
    const k = `${S.activeStuId}_${inserted.date}`;
    if (!S.tasks[k]) S.tasks[k] = [];
    S.tasks[k].push({
      _id: inserted.id,
      type: inserted.type,
      exam: inserted.exam_type,
      subject: inserted.subject,
      duration: inserted.duration,
      note: inserted.note,
      done: false,
      student_note: '',
      task_items: inserted.task_items
    });
  });

  renderProgram();
  showToast('Görev tüm haftaya kopyalandı ✓');
}

async function pasteTaskToWholeWeek() {
  if (!_clipboardTask) return;

  const stu = S.students.find(s => s.id === S.activeStuId);
  const ws = stu?.weekStart ?? 0;
  const wStart = getWeekStart(S.weekOffset, ws);

  const payloads = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(wStart, i);
    const dateStr = fmtDate(d);
    
    payloads.push({
      student_id: S.activeStuId,
      coach_id: session.coachId,
      date: dateStr,
      type: _clipboardTask.type,
      exam_type: _clipboardTask.exam || null,
      subject: _clipboardTask.subject,
      duration: _clipboardTask.duration,
      note: _clipboardTask.note,
      done: false,
      task_items: _clipboardTask.task_items
    });
  }

  showLoading(true);
  const { data, error } = await db.from('tasks').insert(payloads).select();
  showLoading(false);
  
  if (error) return showToast('Hata: ' + error.message);

  (data || []).forEach(inserted => {
    const k = `${S.activeStuId}_${inserted.date}`;
    if (!S.tasks[k]) S.tasks[k] = [];
    S.tasks[k].push({
      _id: inserted.id,
      type: inserted.type,
      exam: inserted.exam_type,
      subject: inserted.subject,
      duration: inserted.duration,
      note: inserted.note,
      done: false,
      student_note: '',
      task_items: inserted.task_items
    });
  });

  _clipboardTask = null;
  renderProgram();
  showToast('Görev tüm haftaya yapıştırıldı ✓');
}

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
loadTheme();
renderNetInputs();

window.addEventListener('hashchange', () => {
  let tab = window.location.hash.substring(1);
  const isLoggedIn = document.getElementById('appShell').classList.contains('visible');
  if (isLoggedIn && tab !== currentTab) {
    if (!tab) {
      tab = {coach:'home', student:'portal', developer:'home', parent:'parent-home'}[session.role] || 'portal';
      window.location.hash = tab;
      return;
    }
    if (document.getElementById('view-' + tab)) {
      switchTab(tab, false);
    }
  }
});


// ── KOÇ BAŞVURULARI ─────────────────────────────────────────
async function renderCoachApplications() {
  const el = document.getElementById('view-coach-applications');
  if (!el) return;
  el.innerHTML = `<div style="padding:24px;max-width:800px;margin:0 auto">
    <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px">Eşleşme Başvuruları</div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:20px">koc-bul sayfasından gelen öğrenci başvuruları</div>
    <div id="appsList" style="display:flex;flex-direction:column;gap:10px">
      <div style="text-align:center;padding:32px;color:var(--text-dim)">Yükleniyor...</div>
    </div>
  </div>`;

  const { data: apps, error } = await db
    .from('match_requests')
    .select('*')
    .eq('matched_coach_id', session.coachId)
    .order('created_at', { ascending: false });

  const list = document.getElementById('appsList');
  if (error || !apps) {
    list.innerHTML = `<div style="padding:20px;color:var(--red);background:var(--red-dim);border-radius:10px">Başvurular yüklenemedi: ${error?.message||'Bilinmeyen hata'}</div>`;
    return;
  }
  if (apps.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-dim)">
      <div style="font-size:32px;margin-bottom:12px">📭</div>
      <div style="font-size:14px;font-weight:600">Henüz başvuru yok</div>
      <div style="font-size:12px;margin-top:4px">Koc-bul sayfasındaki profilinize öğrenci başvurduğunda burada görünecek.</div>
    </div>`;
    // Badge temizle
    const badge = document.querySelector('#sbi_coach-applications .sb-badge');
    if (badge) badge.remove();
    return;
  }

  const statusColors = { pending:'#f0a500', accepted:'#3ecf8e', rejected:'#ff5c7a' };
  const statusLabels = { pending:'Beklemede', accepted:'Kabul Edildi', rejected:'Reddedildi' };

  list.innerHTML = apps.map(a => `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px">
        <div>
          <div style="font-size:15px;font-weight:700">${esc(a.student_name||'İsimsiz')}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${new Date(a.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
        </div>
        <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;background:${statusColors[a.status]||'#888'}22;color:${statusColors[a.status]||'#888'};white-space:nowrap">
          ${statusLabels[a.status]||a.status}
        </span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">E-posta</div>
          <a href="mailto:${esc(a.email||'')}" style="font-size:13px;font-weight:600;color:var(--accent);text-decoration:none">${esc(a.email||'—')}</a>
        </div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Telefon</div>
          <a href="tel:${esc(a.phone||'')}" style="font-size:13px;font-weight:600;color:var(--text);text-decoration:none">${esc(a.phone||'—')}</a>
        </div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Sınav Grubu</div>
          <div style="font-size:13px;font-weight:600">${esc(a.exam_profile||'—')}</div>
        </div>
        ${a.style?`<div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Koçluk Tercihi</div>
          <div style="font-size:12px;color:var(--text-mid)">${esc(a.style)}</div>
        </div>`:''}
      </div>
      ${a.status==='pending'?`
      <div style="display:flex;gap:8px">
        <button onclick="updateApplication('${a.id}','accepted','${esc(a.email||'')}','${esc(a.student_name||'')}')" style="flex:1;padding:9px;background:rgba(62,207,142,.12);color:#3ecf8e;border:1px solid rgba(62,207,142,.25);border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✓ Kabul Et</button>
        <button onclick="updateApplication('${a.id}','rejected','${esc(a.email||'')}','${esc(a.student_name||'')}')" style="flex:1;padding:9px;background:rgba(255,92,122,.08);color:#ff5c7a;border:1px solid rgba(255,92,122,.2);border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✗ Reddet</button>
      </div>`:''}
    </div>`).join('');

  // Badge — bekleyen sayısı
  const pendingCount = apps.filter(a => a.status === 'pending').length;
  const sbiEl = document.getElementById('sbi_coach-applications');
  if (sbiEl) {
    const existing = sbiEl.querySelector('.sb-badge');
    if (existing) existing.remove();
    if (pendingCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'sb-badge';
      badge.textContent = pendingCount;
      sbiEl.appendChild(badge);
    }
  }
}

async function updateApplication(appId, status, applicantEmail, applicantName) {
  const { error } = await db.from('match_requests').update({ status }).eq('id', appId);
  if (error) return showToast('Hata: ' + error.message);
  showToast(status === 'accepted' ? '✓ Başvuru kabul edildi' : 'Başvuru reddedildi');
  if (applicantEmail) {
    fetch('/api/mailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'application_update',
        to: applicantEmail,
        student_name: applicantName || '',
        status,
        coach_name: S.workspace?.brand_name || 'Koçunuz'
      })
    }).catch(e => console.warn('[updateApplication] mail error:', e.message));
  }
  renderCoachApplications();
}

// ── KOÇ NOTLARI ─────────────────────────────────────────────
let _coachNotesCache = null;

async function renderCoachNotes() {
  const el = document.getElementById('view-coach-notes');
  if (!el) return;
  el.innerHTML = `<div style="padding:24px;max-width:860px;margin:0 auto">
    <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px">Notlarım</div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:20px">Kişisel notlar — sadece sen görürsün</div>
    <div style="display:flex;gap:10px;margin-bottom:18px">
      <button onclick="openNoteEditor(null)" style="padding:8px 18px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">+ Yeni Not</button>
    </div>
    <div id="coachNotesList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
      <div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-dim)">Yükleniyor...</div>
    </div>
  </div>`;

  const key = `coach_notes_${session.coachId}`;
  const { data } = await db.from('platform_settings').select('value').eq('key', key).maybeSingle();
  _coachNotesCache = data?.value?.notes || [];
  _renderNoteCards();
}

function _renderNoteCards() {
  const list = document.getElementById('coachNotesList');
  if (!list) return;
  const notes = _coachNotesCache;
  if (!notes.length) {
    list.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-dim)">
      <div style="font-size:36px;margin-bottom:12px">📝</div>
      <div style="font-size:14px;font-weight:600">Henüz not yok</div>
      <div style="font-size:12px;margin-top:4px">+ Yeni Not ile başla</div>
    </div>`;
    return;
  }
  const colors = ['#f0a50018','#3ecf8e18','#4da6ff18','#c084fc18','#ff5c7a18'];
  list.innerHTML = notes.map((n, i) => `
    <div style="background:${colors[i%colors.length]};border:1px solid var(--border);border-radius:14px;padding:16px;cursor:pointer;position:relative;transition:border-color .15s"
      onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'"
      onclick="openNoteEditor(${i})">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">
        <div style="font-size:13px;font-weight:700;color:var(--text)">${esc(n.title||'Başlıksız')}</div>
        <button onclick="event.stopPropagation();deleteCoachNote(${i})" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:16px;padding:0;line-height:1;flex-shrink:0">✕</button>
      </div>
      <div style="font-size:12px;color:var(--text-mid);white-space:pre-wrap;line-height:1.5;max-height:100px;overflow:hidden">${esc(n.body||'')}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:10px">${n.updated ? new Date(n.updated).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}) : ''}</div>
    </div>`).join('');
}

function openNoteEditor(idx) {
  const note = idx !== null ? (_coachNotesCache[idx] || {}) : {};
  let modal = document.getElementById('coachNoteModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'coachNoteModal';
    modal.className = 'modal-bg';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `<div class="modal" style="max-width:520px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:16px;font-weight:800">${idx===null?'Yeni Not':'Notu Düzenle'}</div>
      <button onclick="document.getElementById('coachNoteModal').style.display='none'" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--text-dim)">✕</button>
    </div>
    <input id="noteEditorTitle" value="${esc(note.title||'')}" placeholder="Başlık..." style="width:100%;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-weight:600;box-sizing:border-box;margin-bottom:10px">
    <textarea id="noteEditorBody" rows="8" placeholder="Not içeriği..." style="width:100%;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:13px;line-height:1.6;resize:vertical;box-sizing:border-box;font-family:inherit">${esc(note.body||'')}</textarea>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button onclick="saveCoachNote(${idx})" style="flex:1;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">Kaydet</button>
      <button onclick="document.getElementById('coachNoteModal').style.display='none'" style="padding:10px 16px;background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;cursor:pointer">İptal</button>
    </div>
  </div>`;
  modal.style.display = 'flex';
}

async function saveCoachNote(idx) {
  const title = document.getElementById('noteEditorTitle').value.trim();
  const body = document.getElementById('noteEditorBody').value.trim();
  if (!title && !body) return showToast('Not boş olamaz');
  const entry = { title: title||'Başlıksız', body, updated: new Date().toISOString() };
  if (idx === null) {
    _coachNotesCache.unshift(entry);
  } else {
    _coachNotesCache[idx] = entry;
  }
  await _saveCoachNotesToDB();
  document.getElementById('coachNoteModal').style.display = 'none';
  _renderNoteCards();
  showToast('Not kaydedildi ✓');
}

async function deleteCoachNote(idx) {
  if (!await customConfirm('Bu notu silmek istiyor musun?')) return;
  _coachNotesCache.splice(idx, 1);
  await _saveCoachNotesToDB();
  _renderNoteCards();
  showToast('Not silindi');
}

async function _saveCoachNotesToDB() {
  const key = `coach_notes_${session.coachId}`;
  await db.from('platform_settings').upsert({ key, value: { notes: _coachNotesCache } }, { onConflict: 'key' });
}

// ── AUTO REGISTRATION ON WINDOW FOR INLINE HTML HANDLERS ──
window.toggleSidebar = toggleSidebar;
window.setupShell = setupShell;
window.switchTab = switchTab;
window.renderHome = renderHome;
window.renderCoachApplications = renderCoachApplications;
window.updateApplication = updateApplication;
window.renderCoachNotes = renderCoachNotes;
window.openNoteEditor = openNoteEditor;
window.toggleNewResourceMode = toggleNewResourceMode;
window.addManualTest = addManualTest;
window.removeManualTest = removeManualTest;
window.saveCoachNote = saveCoachNote;
window.deleteCoachNote = deleteCoachNote;
window.renderStudentsSearch = renderStudentsSearch;
window.filterStudentSearch = filterStudentSearch;
window.openStudentDetail = openStudentDetail;
window.openKonuHaritasi = openKonuHaritasi;
window.openStudentProgram = openStudentProgram;
window.openStudentExams = openStudentExams;
window.openStudentAppointments = openStudentAppointments;
window.renderProfile = renderProfile;
window.saveProfile = saveProfile;
window.renderSettings = renderSettings;
window.saveGeminiKey = saveGeminiKey;
window.renderProgram = renderProgram;
window.selectStu = selectStu;
window.chWeek = chWeek;
window.goToday = goToday;
window.openClearWeekModal = openClearWeekModal;
window.toggleDaySel = toggleDaySel;
window.toggleAllDays = toggleAllDays;
window.confirmClearDays = confirmClearDays;
window.openTaskModal = openTaskModal;
window.loadResources = loadResources;
window.updateSubjectList = updateSubjectList;
window.updateBookList = updateBookList;
window.renderBookList = renderBookList;
window.filterBooks = filterBooks;
window.selectBook = selectBook;
window.renderTestList = renderTestList;
window.selectAllTests = selectAllTests;
window.clearAllTests = clearAllTests;
window.updateTestSummary = updateTestSummary;
window.selectModalSpeed = selectModalSpeed;
window.applyDuration = applyDuration;
window.loadStudentSpeeds = loadStudentSpeeds;
window.saveStudentSpeed = saveStudentSpeed;
window.saveTask = saveTask;
window.toggleTask = toggleTask;
window.closeTaskMenu = closeTaskMenu;
window.showTaskMenu = showTaskMenu;
window.copyTask = copyTask;
window.deleteTask = deleteTask;
window.renderTodoList = renderTodoList;
window.renderStudents = renderStudents;
window.goProgram = goProgram;
window.openStudentModal = openStudentModal;
window.saveStudent = saveStudent;
window.showInviteInfo = showInviteInfo;
window.copyInvite = copyInvite;
window.deleteStu = deleteStu;
window.renderAppointments = renderAppointments;
window.renderCalDays = renderCalDays;
window.selCalDay = selCalDay;
window.chCalMonth = chCalMonth;
window.renderApptList = renderApptList;
window.openApptModal = openApptModal;
window.saveAppt = saveAppt;
window.deleteAppt = deleteAppt;
window.renderExams = renderExams;
window.openCommentModal = openCommentModal;
window.saveComment = saveComment;
window.deleteExam = deleteExam;
window.renderMessages = renderMessages;
window.selectThread = selectThread;
window.renderThreadHTML = renderThreadHTML;
window.sendMsg = sendMsg;
window.scrollMsgs = scrollMsgs;
window.renderPortal = renderPortal;
window.stuToggleTask = stuToggleTask;
window.renderSPortal = renderSPortal;
window.stuToggleTask2 = stuToggleTask2;
window.chWeekS = chWeekS;
window.openTaskDetail = openTaskDetail;
window.toggleTaskDetail = toggleTaskDetail;
window.toggleDetailItem = toggleDetailItem;
window.selectVideoSpeed = selectVideoSpeed;
window.saveTaskDetail = saveTaskDetail;
window.renderSExams = renderSExams;
window.openStudentExamModal = openStudentExamModal;
window.openExamModal = openExamModal;
window.renderNetInputs = renderNetInputs;
window.saveExam = saveExam;
window.renderSMessages = renderSMessages;
window.initRealtime = initRealtime;
window.destroyRealtime = destroyRealtime;
window.renderDevDashboard = renderDevDashboard;
window.renderDevUsers = renderDevUsers;
window.openDevUserModal = openDevUserModal;
window.devDeleteUser = devDeleteUser;
window.openPlanModal = openPlanModal;
window.savePlan = savePlan;
window.renderDevResources = renderDevResources;
window.openPlaylistModal = openPlaylistModal;
window.fetchYouTubePlaylist = fetchYouTubePlaylist;
window.savePlaylist = savePlaylist;
window.openResourceModal = openResourceModal;
window.saveResource = saveResource;
window.devDeleteResource = devDeleteResource;
window.renderDevFinance = renderDevFinance;
window.openPaymentModal = openPaymentModal;
window.savePayment = savePayment;
window.openSubModal = openSubModal;
window.saveSub = saveSub;
window.renderDevAnnounce = renderDevAnnounce;
window.openAnnounceModal = openAnnounceModal;
window.saveAnnounce = saveAnnounce;
window.toggleAnnounce = toggleAnnounce;
window.devDeleteAnnounce = devDeleteAnnounce;
window.renderDevTickets = renderDevTickets;
window.updateTicketStatus = updateTicketStatus;
window.devDeleteTicket = devDeleteTicket;
window.selectDevTicket = selectDevTicket;
window.sendDevReply = sendDevReply;
window.openSupportTicket = openSupportTicket;
window.openSupportChat = openSupportChat;
window.closeSupportChat = closeSupportChat;
window.startAISupportChat = startAISupportChat;
window.startEminSupportChat = startEminSupportChat;
window.submitEminInitialMessage = submitEminInitialMessage;
window.sendSupportMessage = sendSupportMessage;
window.openSupportChatDirect = openSupportChat;
window.checkCoachSubscription = checkCoachSubscription;
window.showTrialExpiredScreen = showTrialExpiredScreen;
window.loadAnnouncements = loadAnnouncements;
window.saveStudentDev = saveStudentDev;
window.showOnboarding = showOnboarding;
window.renderOnboardingStep = renderOnboardingStep;
window.advanceOnboarding = advanceOnboarding;
window.renderSProfil = renderSProfil;
window.saveStudentProfile = saveStudentProfile;
window.changePassword = changePassword;
window.renderCoachProfile = renderCoachProfile;
window.updateProfilePreview = updateProfilePreview;
window.switchPreviewTab = switchPreviewTab;
window.nl2br = nl2br;
window.saveCoachProfile = saveCoachProfile;
window.renderDevMatches = renderDevMatches;
window.updateMatchRequestStatus = updateMatchRequestStatus;
window.openSpeedModal = openSpeedModal;
window.saveAllSpeeds = saveAllSpeeds;
window.openStudentNotes = openStudentNotes;
window.saveStudentNote = saveStudentNote;
window.openReportModal = openReportModal;
window.getReportDates = getReportDates;
window.buildReportHTML = buildReportHTML;
window.previewReport = previewReport;
window.generatePDF = generatePDF;
window.openWeeklyPDFModal = openWeeklyPDFModal;
window.generateWeeklyPDF = generateWeeklyPDF;
window.printWeeklyProgramWithNote = printWeeklyProgramWithNote;
window.generateMeetLink = generateMeetLink;
window.generateZoomLink = generateZoomLink;
window.copyToClipboard = copyToClipboard;
window.loadTheme = loadTheme;
window.applyAccent = applyAccent;
window.setTheme = setTheme;
window.openThemePanel = openThemePanel;
window.initAIChatForRole = initAIChatForRole;
window.toggleAIChat = toggleAIChat;
window.aiQuickSend = aiQuickSend;
window.buildAIContext = buildAIContext;
window.addAIMessage = addAIMessage;
window.sendAIMessage = sendAIMessage;
window.autoDetectModel = autoDetectModel;
window.callGeminiFallback = callGeminiFallback;
window.generateAICopilotDraft = generateAICopilotDraft;
window.checkCopilotDraftEdited = checkCopilotDraftEdited;
window.sendCopilotDraft = sendCopilotDraft;
window.renderParentHome = renderParentHome;
window.renderParentProgress = renderParentProgress;
window.renderParentAI = renderParentAI;
window.applyResFilter = applyResFilter;
window.updateCRFilter = updateCRFilter;
window.buildCRContent = buildCRContent;
window.renderCoachResources = renderCoachResources;
window.switchCRTab = switchCRTab;
window.compileResourceStats = compileResourceStats;
window.openResourceModalCoach = openResourceModalCoach;
window.fetchYtPlaylistCoach = fetchYtPlaylistCoach;
window.saveResourceCoach = saveResourceCoach;
window.deleteResourceCoach = deleteResourceCoach;
window.importResourcesFromExcel = importResourcesFromExcel;
window.importStudentsFromExcel = importStudentsFromExcel;
window.getTestStatus = getTestStatus;
window.openCoachTaskEdit = openCoachTaskEdit;
window.saveWeekAsTemplate = saveWeekAsTemplate;
window.applyTemplateToWeek = applyTemplateToWeek;
window.confirmApplyTemplate = confirmApplyTemplate;
window.copyTaskToClipboard = copyTaskToClipboard;
window.pasteTaskFromClipboard = pasteTaskFromClipboard;
window.copyTaskToWholeWeek = copyTaskToWholeWeek;
window.pasteTaskToWholeWeek = pasteTaskToWholeWeek;
window.sendWhatsAppReport = sendWhatsAppReport;
window.toggleUserMenu = toggleUserMenu;
window.closeUserMenu = closeUserMenu;
window.renderAgenda = renderAgenda;
window.openAgendaApptModal = openAgendaApptModal;
window.deleteAgendaAppt = deleteAgendaAppt;
window.agendaPrev = agendaPrev;
window.agendaNext = agendaNext;
window.agendaToday = agendaToday;
window.agendaSetFilter = agendaSetFilter;
window.exportAgendaICS = exportAgendaICS;
window.openApptPopup = openApptPopup;
window.handleApptDrop = handleApptDrop;
window.openStudentKaynaklar = openStudentKaynaklar;
window.addStudentBook = addStudentBook;
window.editStudentBook = editStudentBook;
window.sbUpdatePct = sbUpdatePct;
window.saveStudentBook = saveStudentBook;
window.deleteStudentBook = deleteStudentBook;

async function archivePerformanceReport() {
  const stuId = document.getElementById('rpStuId').value;
  const s = S.students.find(x => x.id === stuId);
  if (!s) return;
  const period = document.getElementById('rpPeriod').value;
  const { start, end } = getReportDates();
  const note = document.getElementById('rpNote').value.trim();
  
  let periodTitle = "Performans Raporu";
  if (period === 'weekly') periodTitle = "Haftalık Performans Raporu";
  else if (period === 'monthly') periodTitle = "Aylık Performans Raporu";
  else periodTitle = "Özel Dönem Performans Raporu";
  
  const title = `${periodTitle} (${start} - ${end})`;
  const content = note || "Değerlendirme notu eklenmedi.";
  
  showLoading(true);
  const coachId = session.coachId || s.coachId;
  const { error } = await db.from('reports').insert({
    student_id: stuId,
    coach_id: coachId,
    type: 'performance',
    title: title,
    content: content,
    start_date: start,
    end_date: end
  });
  showLoading(false);
  
  if (error) {
    showToast('Rapor kaydedilirken hata oluştu: ' + error.message);
  } else {
    showToast('Rapor başarıyla geçmişe kaydedildi! ✓');
    cm('reportModal');
  }
}

async function openPastReports(stuId) {
  const s = S.students.find(x => x.id === stuId);
  if (!s) return;
  S.activeStuId = stuId;
  if (currentTab !== 'student-detail') switchTab('student-detail');
  const el = document.getElementById('view-student-detail');
  el.innerHTML = `<button class="back-link" onclick="openStudentDetail('${stuId}')">← ${esc(s.name)}</button>
    <div style="padding:20px;color:var(--text-mid);font-size:13px">Raporlar yükleniyor…</div>`;

  const { data, error } = await db.from('reports').select('*').eq('student_id', stuId).order('created_at', { ascending: false });
  if (error) {
    el.innerHTML = `<button class="back-link" onclick="openStudentDetail('${stuId}')">← ${esc(s.name)}</button>
      <div style="padding:20px;color:var(--red);font-size:13px">Hata: ${error.message}</div>`;
    return;
  }

  let html = `
    <button class="back-link" onclick="openStudentDetail('${stuId}')">← ${esc(s.name)}</button>
    <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text)">🗂️ Geçmiş Raporlar</h2>
      </div>
  `;

  if (!data || data.length === 0) {
    html += `
      <div style="text-align:center;padding:40px;background:var(--surface);border:1px solid var(--border);border-radius:12px;color:var(--text-dim)">
        <div style="font-size:36px;margin-bottom:12px">📭</div>
        <div style="font-size:13px">Bu öğrenci için henüz kaydedilmiş bir gelişim raporu bulunmuyor.</div>
      </div>
    </div>`;
    el.innerHTML = html;
    return;
  }

  html += `<div style="display:flex;flex-direction:column;gap:12px">`;
  data.forEach(r => {
    const icon = r.type === 'ai_copilot' ? '🧠' : '📄';
    const typeText = r.type === 'ai_copilot' ? 'AI Copilot Değerlendirmesi' : 'Performans Raporu';
    const dateStr = new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    html += `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px;box-shadow:var(--shadow)">
        <div style="min-width:0;flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:16px">${icon}</span>
            <span style="font-size:11px;font-weight:800;text-transform:uppercase;color:var(--text-dim);letter-spacing:.5px">${typeText}</span>
          </div>
          <h4 style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.title)}</h4>
          <div style="font-size:11px;color:var(--text-dim)">Oluşturulma: ${dateStr}</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost btn-sm" onclick="viewArchivedReport('${r.id}')">Görüntüle</button>
          ${(session.role === 'coach' || session.role === 'developer') ? `<button class="btn btn-danger btn-sm" style="background:#ef4444;border-color:#ef4444;color:#fff" onclick="deleteArchivedReport('${r.id}', '${stuId}')">Sil</button>` : ''}
        </div>
      </div>
    `;
  });
  html += `</div></div>`;
  el.innerHTML = html;
}

async function viewArchivedReport(reportId) {
  showLoading(true);
  const { data, error } = await db.from('reports').select('*').eq('id', reportId).single();
  showLoading(false);
  if (error || !data) return showToast('Rapor yüklenemedi: ' + (error?.message || 'Bulunamadı'));

  let modal = document.getElementById('viewReportDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'viewReportDetailModal';
    modal.className = 'modal-bg';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  }

  const icon = data.type === 'ai_copilot' ? '🧠' : '📄';
  const formattedDate = new Date(data.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  modal.innerHTML = `
    <div class="modal" style="max-width:600px; max-height:85vh; overflow-y:auto">
      <button class="modal-close" onclick="cm('viewReportDetailModal')">×</button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:12px">
        <span style="font-size:24px">${icon}</span>
        <div>
          <h3 style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:var(--text)">${esc(data.title)}</h3>
          <div style="font-size:11px;color:var(--text-dim)">Oluşturulma Tarihi: ${formattedDate}</div>
        </div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:20px;font-size:13px;line-height:1.7;color:var(--text);white-space:pre-wrap;overflow-y:auto;max-height:450px">${esc(data.content)}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;gap:8px">
        <button class="btn btn-ghost" onclick="cm('viewReportDetailModal')">Kapat</button>
        <button class="btn btn-accent" onclick="printActiveReport()">Yazdır / Paylaş</button>
      </div>
    </div>
  `;
  om('viewReportDetailModal');
}

function printActiveReport() {
  const modal = document.getElementById('viewReportDetailModal');
  if (!modal) return;
  const title = modal.querySelector('h3').textContent;
  const dateStr = modal.querySelector('div div').textContent;
  const content = modal.querySelector('div[style*="pre-wrap"]').textContent;

  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
          .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: 800; margin: 0; color: #111827; }
          .date { font-size: 13px; color: #6b7280; margin-top: 5px; }
          .content { font-size: 15px; white-space: pre-wrap; color: #374151; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${title}</h1>
          <div class="date">${dateStr}</div>
        </div>
        <div class="content">${content}</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  win.document.close();
}

async function deleteArchivedReport(reportId, stuId) {
  const confirmed = await customConfirm('Bu raporu kalıcı olarak silmek istediğinize emin misiniz?');
  if (!confirmed) return;

  showLoading(true);
  const { error } = await db.from('reports').delete().eq('id', reportId);
  showLoading(false);

  if (error) {
    showToast('Rapor silinirken hata oluştu: ' + error.message);
  } else {
    showToast('Rapor başarıyla silindi ✓');
    openPastReports(stuId);
  }
}

window.archivePerformanceReport = archivePerformanceReport;
window.openPastReports = openPastReports;
window.viewArchivedReport = viewArchivedReport;
window.printActiveReport = printActiveReport;
window.deleteArchivedReport = deleteArchivedReport;
