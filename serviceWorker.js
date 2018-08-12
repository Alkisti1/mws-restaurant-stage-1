// Store cache version and url into variables
const cacheVersion = 'v1.0';
const cacheFiles = [
  './',
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './data/restaurants.json',
  './js/dbhelper.js',
  './js/main.js',
  './js/restaurant_info.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
];

// Make sure the service worker opens the cache version first
// then add all the urls into the cache before it installs.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
    .open(cacheVersion)
    .then((cache) => cache.addAll(cacheFiles))
  )
});

// Before the service worker can activate itself, it needs to delete the old cache versions
// first check all keys inside the caches array and map them into a new array
// if the old cache doesn't match the new cache, delete the old cache.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
    .keys()
    .then((allCacheVersions) => {
      return Promise.all(allCacheVersions.map((thisCacheVersion) => {
        if (thisCacheVersion !== cacheVersion) {
          return caches.delete(thisCacheVersion);
        }
      }))
    })
  )
});

// The service worker will fetch all requests to the website and if it finds the url in the
// cache, it will respond with it. Otherwise it will fetch the new url.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches
    .match(e.request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(e.request);
    })
  )
});
