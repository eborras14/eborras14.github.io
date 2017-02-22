'use strict';
var cacheName="news";
var filesToCache = [
  '/',
  '/index.html',
  '/images/myapp.png',
  '/scripts/secciones.js',
  '/sucesos.html',
  '/internacional.html',
  '/politica.html',
  '/deportes.html',
  '/favoritas.html',
  '/scripts/ajax_peticion.js',
  '/scripts/main.js',
  '/images/error.png',
  '/images/leer_mas.png',
  '/images/remove.png',
  '/images/refresh.png',
  '/styles/styles.css'

];
console.log("SW startup");
self.addEventListener('install', function(event) {
  console.log('SW instalado');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('SW cacheando archivos');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate', function(event) {
 console.log("SW activated");
});
self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Respuesta de cache', response);

        return response;
      }else{
     // console.log('Respuesta cache fallida, intentar desde red..');

      return fetch(event.request).then(function(response) {
        console.log('Respuesta de red:', response);

        return response;
      }).catch(function(error) {
        console.error('Fetch fallido:', error);

        throw error;
      });
    }
    })
  );
});
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  const title = 'MyApp PWA';
  const options = {
    body: event.data.text(),
    icon: 'images/myapp.png',
    badge: 'images/myapp.png'
  };
const notificationPromise = self.registration.showNotification(title, options);
event.waitUntil(notificationPromise);

});
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://127.0.0.1:8887/')
  );
});