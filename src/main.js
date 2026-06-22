// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — MAIN APPLICATION ENTRY POINT
// ═══════════════════════════════════════════════

import './state.js';
import './config.js';
import './helpers.js';
import './api.js';
import './auth.js';
import './ui.js';

// Başlangıç mantığı (Oturum öncesi yüklemeler)
if (window.loadTheme) window.loadTheme();
if (window.renderNetInputs) window.renderNetInputs();

// Google OAuth redirect sonrası oturum doğrulaması
if (window.checkOAuthSession) window.checkOAuthSession();

// Service Worker Kaydı (PWAs & Push Notifications)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker başarıyla kaydedildi ✓', reg.scope);
      })
      .catch(err => {
        console.warn('Service Worker kaydı başarısız oldu:', err);
      });
  });
}

// Hash yönlendirme dinleyicisi (Tarayıcı geri tuşuna karşı koruma)
window.addEventListener('hashchange', () => {
  let tab = window.location.hash.substring(1);
  const isLoggedIn = document.getElementById('appShell').classList.contains('visible');
  if (isLoggedIn && tab !== window.currentTab) {
    if (!tab) {
      tab = { 
        coach: 'home', 
        student: 'portal', 
        developer: 'dev-dashboard', 
        parent: 'parent-home' 
      }[window.session.role] || 'portal';
      window.location.hash = tab;
      return;
    }
    if (document.getElementById('view-' + tab)) {
      window.switchTab(tab, false);
    }
  }
});

console.log('Rostrum Akademi App initialized successfully ✓');
