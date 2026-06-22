// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — DATABASE API SERVICES
// ═══════════════════════════════════════════════

import { db } from './config.js';
import { S, session } from './state.js';
import { showLoading } from './helpers.js';

export async function dbQ(table, query = {}) {
  let q = db.from(table).select('*');
  Object.entries(query).forEach(([k, v]) => {
    q = q.eq(k, v);
  });
  const { data, error } = await q;
  if (error) console.error(table, error);
  return data || [];
}

export async function loadAllData() {
  showLoading(true);
  try {
    const coachId = session.coachId;

    // Workspace
    if (session.role === 'coach') {
      const { data: ws, error: wsErr } = await db.from('workspaces').select('*').eq('coach_id', coachId).single();
      S.workspace = ws || null;
      if (wsErr && wsErr.code !== 'PGRST116') console.warn('workspaces:', wsErr.message);
    }

    // Students — sadece bu koçun öğrencileri
    let stuQuery = db.from('users').select('*').eq('role', 'student');
    if (session.role === 'student') {
      stuQuery = stuQuery.eq('id', session.studentId);
    } else if (session.role === 'coach') {
      stuQuery = stuQuery.eq('coach_id', coachId);
    }
    // developer ve institution rollerinin durumları (seed hiyerarşisi)
    const { data: studentsData, error: stuErr } = await stuQuery;
    if (stuErr) console.error('Students fetch error:', stuErr);
    S.students = (studentsData || []).map(s => ({
      id: s.id,
      name: s.full_name || s.username || 'Öğrenci',
      target: s.target || '',
      color: s.color || '#4da6ff',
      progress: s.progress || 0,
      weekStart: s.week_start || 0,
      username: s.username,
      coachId: s.coach_id
    }));

    // Tasks
    let tasksData = [];
    if (session.role === 'student') {
      tasksData = (await db.from('tasks').select('*').eq('student_id', session.studentId)).data || [];
    } else if (session.role === 'coach') {
      tasksData = (await db.from('tasks').select('*').eq('coach_id', coachId)).data || [];
    } else {
      tasksData = (await db.from('tasks').select('*')).data || [];
    }
    S.tasks = {};
    tasksData.forEach(t => {
      const key = `${t.student_id}_${t.date}`;
      if (!S.tasks[key]) S.tasks[key] = [];
      S.tasks[key].push({
        _id: t.id,
        type: t.type,
        exam: t.exam_type,
        subject: t.subject,
        duration: t.duration,
        note: t.note,
        done: t.done,
        student_note: t.student_note || '',
        task_items: t.task_items
      });
    });

    // Appointments
    let apptsData = [];
    if (session.role === 'student') {
      apptsData = (await db.from('appointments').select('*').eq('student_id', session.studentId)).data || [];
    } else if (session.role === 'coach') {
      apptsData = (await db.from('appointments').select('*').eq('coach_id', coachId)).data || [];
    } else {
      apptsData = (await db.from('appointments').select('*')).data || [];
    }
    S.appointments = apptsData.map(a => ({
      id: a.id,
      studentId: a.student_id,
      date: a.date,
      time: a.time,
      duration: a.duration,
      type: a.type,
      note: a.note,
      meetLink: a.meet_link
    }));

    // Exams
    let examsData = [];
    if (session.role === 'student') {
      examsData = (await db.from('exams').select('*').eq('student_id', session.studentId)).data || [];
    } else if (session.role === 'coach') {
      examsData = (await db.from('exams').select('*').eq('coach_id', coachId)).data || [];
    } else {
      examsData = (await db.from('exams').select('*')).data || [];
    }
    S.exams = examsData.map(e => ({
      id: e.id,
      studentId: e.student_id,
      name: e.name,
      date: e.date,
      type: e.exam_type,
      nets: e.nets || {},
      note: e.student_note,
      coachComment: e.coach_comment
    }));

    // Messages
    let msgsData = [];
    if (session.role === 'student') {
      msgsData = (await db.from('messages').select('*').eq('student_id', session.studentId)).data || [];
    } else if (session.role === 'coach') {
      msgsData = (await db.from('messages').select('*').eq('coach_id', coachId)).data || [];
    } else {
      msgsData = (await db.from('messages').select('*')).data || [];
    }
    S.messages = {};
    msgsData.forEach(m => {
      if (!S.messages[m.student_id]) S.messages[m.student_id] = [];
      S.messages[m.student_id].push({
        _id: m.id,
        from: m.from_role,
        text: m.text,
        read: m.read,
        time: new Date(m.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });
    });
    Object.keys(S.messages).forEach(k => S.messages[k].sort((a, b) => (a._id > b._id ? 1 : -1)));

    // Coach todos
    let todosData = session.role === 'coach'
      ? (await db.from('coach_todos').select('*').eq('coach_id', coachId)).data || []
      : session.role === 'developer' ? (await db.from('coach_todos').select('*')).data || [] : [];
    S.coachTodos = {};
    todosData.forEach(t => {
      if (!S.coachTodos[t.date]) S.coachTodos[t.date] = [];
      S.coachTodos[t.date].push({ _id: t.id, task: t.task, note: t.note, done: t.done });
    });

    // Student speeds
    let speedsData = [];
    if (session.role === 'student') {
      speedsData = (await db.from('student_speeds').select('*').eq('student_id', session.studentId)).data || [];
    } else if (session.role === 'coach') {
      speedsData = (await db.from('student_speeds').select('*').eq('coach_id', coachId)).data || [];
    } else {
      speedsData = (await db.from('student_speeds').select('*')).data || [];
    }
    S.studentSpeeds = speedsData;

    // UI state restore
    try {
      const ui = JSON.parse(localStorage.getItem('ba_ui_' + session.dbUser?.id) || '{}');
      if (ui.weekOffset !== undefined) S.weekOffset = ui.weekOffset;
      if (ui.activeStuId) S.activeStuId = ui.activeStuId;
      if (ui.calMonth !== undefined) {
        S.calMonth = ui.calMonth;
        S.calYear = ui.calYear;
      }
    } catch (e) {}

  } catch (e) {
    console.error('loadAllData error', e);
  }
  showLoading(false);
}

// Expose to window for backward compatibility
window.dbQ = dbQ;
window.loadAllData = loadAllData;
