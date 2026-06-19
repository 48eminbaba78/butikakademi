// ═══════════════════════════════════════════════════════════
// BUTIK AKADEMI — CENTRAL CONFIGURATION
// Tüm HTML dosyaları bu config'i kullanır
// ═══════════════════════════════════════════════════════════
const CONFIG = {
  SUPABASE_URL: 'https://imyhenrwmsmyikpollur.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34',
  SITE_URL: window.location.origin || 'https://rostrumakademi.com',
  get APP_URL() { return this.SITE_URL + '/app.html'; },
  get API_BASE() { return this.SITE_URL + '/api'; },
};
