'use strict';
var cacheName="news";
//Array con los documentos a guardar en la  Cache Storage
var filesToCache = [
  '/',
  '/index.html',
  '/images/myapp.png',
  '/images/icon_top.png',
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
//Instala el serviceWorker
self.addEventListener('install', function(event) {
  console.log('SW instalado');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('SW cacheando archivos');
      return cache.addAll(filesToCache);
    })
  );
});
//Activa el serviceWorker
self.addEventListener('activate', function(event) {
 console.log("SW activated");
});
//Hace un fetch a la cache cogiendo los archivos cacheados en el array filesToCache
self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);
//Hace la respuesta de cache
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Respuesta de cache', response);

        return response;
//Hace la respuesta de la red
      }else{
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
//Muestra la notificacion push con el texto que hemos introducido en el emulador de servidor de mensajes push
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
//Escuchador para cuando das click a la notificacion te lleve al index de la pagina
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://127.0.0.1:8887/')
  );
});