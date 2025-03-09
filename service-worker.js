const CACHE_NAME = 'wordvibe-cache-v1';
const FILES_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './words.json',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching WordVibe assets...');
            return cache.addAll(FILES_TO_CACHE);
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
