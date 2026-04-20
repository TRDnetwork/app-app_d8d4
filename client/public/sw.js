self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('shopsphere-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
        '/_next/static/chunks/webpack.js',
        '/_next/static/chunks/main.js',
        '/_next/static/chunks/pages/_app.js',
        '/_next/static/css/app/layout.module.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});