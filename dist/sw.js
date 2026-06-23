// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — PWAs & SERVICE WORKER
// ═══════════════════════════════════════════════

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Bildirimi Alındı.');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { 
        title: 'Rostrum Akademi', 
        body: event.data.text() 
      };
    }
  }

  const title = data.title || 'Rostrum Akademi';
  const options = {
    body: data.body || 'Yeni bir bildiriminiz var!',
    icon: data.icon || '/ss_01_login.png',
    badge: data.badge || '/ss_01_login.png',
    data: data.url || '/app.html',
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Görüntüle' },
      { action: 'close', title: 'Kapat' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Bildirim Tıklandı.');
  event.notification.close();

  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Eğer uygulama sekmesi zaten açıksa oraya odaklan, yoksa yeni sekme aç
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes('/app.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data || '/app.html');
      }
    })
  );
});
