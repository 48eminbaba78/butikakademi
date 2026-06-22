// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — GLOBAL STATE & CONSTANTS
// ═══════════════════════════════════════════════

export const S = {
  students: [],
  tasks: {},
  appointments: [],
  exams: [],
  messages: {},
  coachTodos: {},
  weekOffset: 0,
  calMonth: new Date().getMonth(),
  calYear: new Date().getFullYear(),
  calSelDay: null,
  activeStuId: null,
  msgThread: null,
  workspace: null,
  studentSpeeds: []
};

export const session = {
  role: null,
  studentId: null,
  dbUser: null,
  coachId: null,
  childName: null
};

// Global tanımları window nesnesine bağlıyoruz (Geriye dönük tam uyumluluk için)
window.S = S;
window.session = session;

window._loginMode = 'email';
window.COACH_PASS = 'koc123';
window.STU_DEFAULT_PASS = 'ogrenci123';
window.DAYS_TR = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
window.MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

window.EXAM_DEFS = {
  TYT: ['Türkçe', 'Matematik', 'Fen', 'Sosyal'],
  'AYT-SAY': ['Matematik', 'Fizik', 'Kimya', 'Biyoloji'],
  'AYT-EA': ['Matematik', 'Edebiyat', 'Tarih', 'Coğrafya'],
  'AYT-SOZ': ['Edebiyat', 'Tarih1', 'Tarih2', 'Coğrafya1', 'Coğrafya2', 'Felsefe', 'Din'],
};

window.SUBJECT_MAP = {
  TYT: ['Türkçe', 'Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Felsefe', 'Din'],
  'AYT-SAY': ['Matematik', 'Fizik', 'Kimya', 'Biyoloji'],
  'AYT-EA': ['Matematik', 'Edebiyat', 'Tarih', 'Coğrafya', 'Felsefe'],
  'AYT-SOZ': ['Edebiyat', 'Tarih1', 'Tarih2', 'Coğrafya1', 'Coğrafya2', 'Felsefe', 'Din'],
};

window.currentTab = '';
window._clipboardTask = null;
window._editingTaskId = null;
window._regRole = null;
window._onbRole = null;
window._oauthUser = null;
