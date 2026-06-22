// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — DATABASE CONFIGURATION
// ═══════════════════════════════════════════════

const SB_URL = 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34';

// CDN üzerinden yüklenen supabase global değişkenini kullanıyoruz
export const db = supabase.createClient(SB_URL, SB_KEY);
window.db = db;
