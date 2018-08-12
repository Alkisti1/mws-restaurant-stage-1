let cacheName = 'v1';

//Install the site assets
//https://developers.google.com/web/fundamentals/codelabs/offline/

const cacheFiles = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/mediastyles.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
];

//https://developers.google.com/web/fundamentals/codelabs/offline/
//Install the site assets

self.addEventListener('install', e => {
  console.log('serviceWorker installed!');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('serviceWorker is caching files...');
      return cache.addAll(cacheFiles);
    })
    .catch(err => {
      console.log('Error while caching files with ', err);
    })
  );
});

//https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
//Deleting old caches
self.addEventListener('activate', e => {
  console.log('serviceWorker activated!');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(name => {
        if(cacheName !== name) {
          console.log('serviceWorker is removing the old cache...');
          return caches.delete(name);
        }
      }));
    })
    .catch(err => {
      console.log('Error while removing old cache with ', err);
    })
  );
});

//Intercept the web page requests
//https://developers.google.com/web/fundamentals/codelabs/offline/
self.addEventListener('fetch', e => {
  console.log('serviceWorker is fetching content...');
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if(res) {
          console.log('serviceWorker found content in cache!', res.url);
          return res;
        }
        return fetch(e.request);
      })
      .catch(err => {
        console.log('Error while fetching data with ', err);
      })
  );
});
