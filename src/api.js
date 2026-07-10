// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — DATABASE API SERVICES
// ═══════════════════════════════════════════════

import { db } from './config.js';
import { S, session } from './state.js';
import { showLoading } from './helpers.js';

export async function dbQ(table, query = {}) {
  let q = db.from(table).select('*');
  Object.entries(query).forEach(([k, v]) => { q = q.eq(k, v); });
  const { data, error } = await q;
  if (error) console.error(table, error);
  return data || [];
}

// ── Cache helpers ─────────────────────────────
const CACHE_TTL = 4 * 60 * 1000; // 4 dakika

function _cacheKey() {
  return 'ra_d_' + (session.coachId || session.studentId || 'x');
}

export function invalidateCache() {
  try { localStorage.removeItem(_cacheKey()); } catch(e) {}
}

function _saveCache() {
  try {
    localStorage.setItem(_cacheKey(), JSON.stringify({
      ts: Date.now(),
      students: S.students,
      tasks: S.tasks,
      appointments: S.appointments,
      exams: S.exams,
      messages: S.messages,
      coachTodos: S.coachTodos,
      studentSpeeds: S.studentSpeeds,
      workspace: S.workspace,
      konuHaftaSoru: S.konuHaftaSoru,
    }));
  } catch(e) {}
}

function _restoreCache() {
  try {
    const raw = localStorage.getItem(_cacheKey());
    if (!raw) return false;
    const c = JSON.parse(raw);
    if (!c.ts || Date.now() - c.ts > CACHE_TTL) return false;
    if (c.students)      S.students      = c.students;
    if (c.tasks)         S.tasks         = c.tasks;
    if (c.appointments)  S.appointments  = c.appointments;
    if (c.exams)         S.exams         = c.exams;
    if (c.messages)      S.messages      = c.messages;
    if (c.coachTodos)    S.coachTodos    = c.coachTodos;
    if (c.studentSpeeds) S.studentSpeeds = c.studentSpeeds;
    if (c.workspace)     S.workspace     = c.workspace;
    if (c.konuHaftaSoru) S.konuHaftaSoru = c.konuHaftaSoru;
    return true;
  } catch(e) { return false; }
}

// ── Core fetch (tüm sorgular paralel) ────────
async function _fetchAll() {
  const coachId = session.coachId;
  const role    = session.role;

  const wsP = (role === 'coach' || role === 'developer')
    ? db.from('workspaces').select('*').eq('coach_id', coachId).single()
    : Promise.resolve({ data: null });

  let stuQ = db.from('users').select('*').eq('role', 'student');
  if      (role === 'student') stuQ = stuQ.eq('id', session.studentId);
  else if (role === 'coach' || role === 'developer')   stuQ = stuQ.eq('coach_id', coachId);
  const stuP = stuQ;

  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - 60);
  const dateLimitStr = dateLimit.toISOString().split('T')[0];

  const apptLimit = new Date();
  apptLimit.setDate(apptLimit.getDate() - 30);
  const apptLimitStr = apptLimit.toISOString().split('T')[0];

  const taskP = role === 'student'
    ? db.from('tasks').select('*').eq('student_id', session.studentId).gte('date', dateLimitStr)
    : (role === 'coach' || role === 'developer')
    ? db.from('tasks').select('*').eq('coach_id', coachId).gte('date', dateLimitStr)
    : db.from('tasks').select('*').gte('date', dateLimitStr);

  const apptP = role === 'student'
    ? db.from('appointments').select('*').eq('student_id', session.studentId).gte('date', apptLimitStr)
    : (role === 'coach' || role === 'developer')
    ? db.from('appointments').select('*').eq('coach_id', coachId).gte('date', apptLimitStr)
    : db.from('appointments').select('*').gte('date', apptLimitStr);

  const examP = role === 'student'
    ? db.from('exams').select('*').eq('student_id', session.studentId)
    : (role === 'coach' || role === 'developer')
    ? db.from('exams').select('*').eq('coach_id', coachId)
    : db.from('exams').select('*');

  const msgP = role === 'student'
    ? db.from('messages').select('*').eq('student_id', session.studentId).order('created_at', { ascending: false }).limit(200)
    : (role === 'coach' || role === 'developer')
    ? db.from('messages').select('*').eq('coach_id', coachId).order('created_at', { ascending: false }).limit(200)
    : db.from('messages').select('*').order('created_at', { ascending: false }).limit(200);

  const todoP = (role === 'coach' || role === 'developer')
    ? db.from('coach_todos').select('*').eq('coach_id', coachId)
    : Promise.resolve({ data: [] });

  const speedP = role === 'student'
    ? db.from('student_speeds').select('*').eq('student_id', session.studentId)
    : (role === 'coach' || role === 'developer')
    ? db.from('student_speeds').select('*').eq('coach_id', coachId)
    : db.from('student_speeds').select('*');

  const masteryP = (role === 'coach' || role === 'developer')
    ? db.from('konu_mastery').select('*').eq('coach_id', coachId)
    : role === 'student'
    ? db.from('konu_mastery').select('*').eq('student_id', session.studentId)
    : Promise.resolve({ data: [] });

  const tekrarLogP = (role === 'coach' || role === 'developer')
    ? db.from('konu_tekrar_log').select('*').eq('coach_id', coachId)
    : role === 'student'
    ? db.from('konu_tekrar_log').select('*').eq('student_id', session.studentId)
    : Promise.resolve({ data: [] });

  const [wsRes, stuRes, taskRes, apptRes, examRes, msgRes, todoRes, speedRes, masteryRes, tekrarLogRes] =
    await Promise.all([wsP, stuP, taskP, apptP, examP, msgP, todoP, speedP, masteryP, tekrarLogP]);

  if (role === 'coach' || role === 'developer') S.workspace = wsRes.data || null;

  S.students = (stuRes.data || []).map(s => ({
    id:       s.id,
    name:     s.full_name || s.username || 'Öğrenci',
    target:   s.target || '',
    color:    s.color || '#4da6ff',
    progress: s.progress || 0,
    weekStart:s.week_start || 0,
    username: s.username,
    coachId:  s.coach_id,
    yksArea:  s.yks_area || 'SAY'
  }));

  S.tasks = {};
  (taskRes.data || []).forEach(t => {
    const key = `${t.student_id}_${t.date}`;
    if (!S.tasks[key]) S.tasks[key] = [];
    S.tasks[key].push({
      _id:           t.id,
      type:          t.type,
      exam:          t.exam_type,
      subject:       t.subject,
      duration:      t.duration,
      note:          t.note,
      done:          t.done,
      student_note:  t.student_note || '',
      student_result:   t.student_result   || null,
      student_feedback: t.student_feedback || null,
      task_items:    t.task_items,
      start_time:    t.start_time
    });
  });

  S.appointments = (apptRes.data || []).map(a => ({
    id:             a.id,
    studentId:      a.student_id,
    date:           a.date,
    time:           a.time,
    duration:       a.duration,
    type:           a.type,
    note:           a.note,
    meetLink:       a.meet_link,
    google_event_id: a.google_event_id || null
  }));

  S.exams = (examRes.data || []).map(e => ({
    id:           e.id,
    studentId:    e.student_id,
    name:         e.name,
    date:         e.date,
    type:         e.exam_type,
    nets:         e.nets || {},
    examDetails:  e.exam_details || {},
    note:         e.student_note,
    coachComment: e.coach_comment
  }));

  S.messages = {};
  (msgRes.data || []).forEach(m => {
    if (!S.messages[m.student_id]) S.messages[m.student_id] = [];
    S.messages[m.student_id].push({
      _id:       m.id,
      from:      m.from_role,
      text:      m.text || '',
      image_url: m.image_url || null,
      read:      m.read,
      time: new Date(m.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });
  });
  Object.keys(S.messages).forEach(k =>
    S.messages[k].sort((a, b) => a._id > b._id ? 1 : -1)
  );

  S.coachTodos = {};
  (todoRes.data || []).forEach(t => {
    if (!S.coachTodos[t.date]) S.coachTodos[t.date] = [];
    S.coachTodos[t.date].push({ _id: t.id, task: t.task, note: t.note, done: t.done });
  });

  S.studentSpeeds = speedRes.data || [];

  // konu_mastery: { student_id: { subject: { konu: masteryRow } } }
  S.konuMastery = {};
  (masteryRes.data || []).forEach(r => {
    if (!S.konuMastery[r.student_id]) S.konuMastery[r.student_id] = {};
    if (!S.konuMastery[r.student_id][r.subject]) S.konuMastery[r.student_id][r.subject] = {};
    S.konuMastery[r.student_id][r.subject][r.konu] = r;
  });

  // konu_tekrar_log: { student_id: { subject: { konu: { period_start: row } } } }
  S.konuTekrarLog = {};
  (tekrarLogRes.data || []).forEach(r => {
    if (!S.konuTekrarLog[r.student_id]) S.konuTekrarLog[r.student_id] = {};
    if (!S.konuTekrarLog[r.student_id][r.subject]) S.konuTekrarLog[r.student_id][r.subject] = {};
    if (!S.konuTekrarLog[r.student_id][r.subject][r.konu]) S.konuTekrarLog[r.student_id][r.subject][r.konu] = {};
    S.konuTekrarLog[r.student_id][r.subject][r.konu][r.period_start] = r;
  });

  try {
    const ui = JSON.parse(localStorage.getItem('ba_ui_' + session.dbUser?.id) || '{}');
    if (ui.weekOffset !== undefined) S.weekOffset = ui.weekOffset;
    if (ui.activeStuId)              S.activeStuId = ui.activeStuId;
    if (ui.calMonth !== undefined) { S.calMonth = ui.calMonth; S.calYear = ui.calYear; }
  } catch(e) {}
}

// ── Ana fonksiyon: stale-while-revalidate ────
export async function loadAllData() {
  const hitCache = _restoreCache();

  if (hitCache) {
    // Önbellekten anında yükle, arka planda yenile
    _fetchAll()
      .then(() => {
        _saveCache();
        // Açık sekmeyi taze veriyle yenile
        if (window.currentTab) {
          try { window.switchTab(window.currentTab); } catch(e) {}
        }
      })
      .catch(e => console.error('Arka plan yenileme hatası:', e));
    return;
  }

  // İlk giriş: bekle, sonra cache'e kaydet
  showLoading(true);
  try {
    await _fetchAll();
    _saveCache();
  } catch(e) {
    console.error('loadAllData error', e);
  }
  showLoading(false);
}

// Expose to window
window.dbQ          = dbQ;
window.loadAllData  = loadAllData;
window.invalidateCache = invalidateCache;
