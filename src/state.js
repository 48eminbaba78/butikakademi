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
  studentSpeeds: [],
  konuHaftaSoru: []
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
window.STU_DEFAULT_PASS = 'Rostrum' + Math.floor(1000 + Math.random() * 9000);
window.DAYS_TR = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
window.MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

window.EXAM_DEFS = {
  TYT: ['Türkçe', 'Matematik', 'Fen', 'Sosyal'],
  'AYT-SAY': ['Matematik', 'Fizik', 'Kimya', 'Biyoloji'],
  'AYT-EA': ['Matematik', 'Edebiyat', 'Tarih', 'Coğrafya'],
  'AYT-SOZ': ['Edebiyat', 'Tarih1', 'Tarih2', 'Coğrafya1', 'Coğrafya2', 'Felsefe', 'Din'],
};

// Soru sayısı limitleri (D+Y+B bu sayıyı geçemez)
window.EXAM_SORU = {
  TYT:       { Türkçe: 40, Matematik: 40, Fen: 20, Sosyal: 20 },
  'AYT-SAY': { Matematik: 40, Fizik: 14, Kimya: 13, Biyoloji: 13 },
  'AYT-EA':  { Matematik: 40, Edebiyat: 24, Tarih: 10, Coğrafya: 6 },
  'AYT-SOZ': { Edebiyat: 24, Tarih1: 10, Tarih2: 11, Coğrafya1: 6, Coğrafya2: 11, Felsefe: 12, Din: 6 },
};

// Deneme dersi → KONU_LISTESI anahtarı
window.EXAM_KONU_MAP = {
  'TYT_Türkçe':       ['Dil Bilgisi'],
  'TYT_Matematik':    ['TYT Matematik', 'Geometri'],
  'TYT_Fen':          ['TYT Fizik', 'TYT Kimya', 'TYT Biyoloji'],
  'TYT_Sosyal':       [],
  'AYT-SAY_Matematik':['AYT Matematik', 'Geometri'],
  'AYT-SAY_Fizik':    ['AYT Fizik'],
  'AYT-SAY_Kimya':    ['AYT Kimya'],
  'AYT-SAY_Biyoloji': ['AYT Biyoloji'],
  'AYT-EA_Matematik': ['AYT Matematik', 'Geometri'],
  'AYT-EA_Edebiyat':  ['Dil Bilgisi'],
};

window.SUBJECT_MAP = {
  TYT: ['Türkçe', 'Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Felsefe', 'Din'],
  'AYT-SAY': ['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji'],
  'AYT-EA': ['Matematik', 'Geometri', 'Edebiyat', 'Tarih', 'Coğrafya', 'Felsefe'],
  'AYT-SOZ': ['Edebiyat', 'Tarih1', 'Tarih2', 'Coğrafya1', 'Coğrafya2', 'Felsefe', 'Din'],
};

window.currentTab = '';
window._clipboardTask = null;
window._editingTaskId = null;
window._regRole = null;
window._onbRole = null;
window._oauthUser = null;
