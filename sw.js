const CACHE_NAME = 'botequim-v10010';

const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './botequim-modal.png',
    './botequim-pwa.png',
    './icon.png',
    './icon512.png',
    './bar-bg.webp'
];

// INSTALL
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.all(
                ASSETS.map(url =>
                    cache.add(url).catch(() => console.warn('Falha ao cachear:', url))
                )
            )
        )
    );
    self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// FETCH
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;

            return fetch(e.request).catch(() => {
                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
