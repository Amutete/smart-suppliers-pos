// A name for the cache
const CACHE_NAME = 'smart-suppliers-pos-v1.1';

// A list of all the files and assets the app needs to function offline
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/html5-qrcode',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
  // Note: Add any other crucial assets here, like your logo if it's a file
];

// Event listener for when the service worker is installed
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified assets to the cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener for when the app makes a network request (e.g., for a file or data)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Try to find a matching request in the cache first
    caches.match(event.request)
      .then(response => {
        // If a cached version is found, return it
        if (response) {
          return response;
        }
        // If not found in cache, fetch it from the network
        return fetch(event.request);
      })
    );
});

// Event listener to clean up old caches when a new service worker is activated
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete any caches that are not in our whitelist
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
