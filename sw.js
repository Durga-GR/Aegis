self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Aegis Alert', {
      body: data.body || 'A trigger was activated.',
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true
    })
  );
});
