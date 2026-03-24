const CACHE_NAME = 'botequim-v10016';
const OFFLINE_URL = './index.html';

// Recursos ESSENCIAIS para funcionamento offline
const ESSENTIAL_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './botequim-modal.png',
    './botequim-pwa.png',
    './comanda.png',
    './icon.png',
    './icon512.png',
    './bar-bg.webp'
];

// Recursos externos que DEVEM ser cacheados
const EXTERNAL_CACHE = [
    'https://cdn.tailwindcss.com/3.4.1',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalação com cache garantido
self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            
            // Cachear assets essenciais
            for (const asset of ESSENTIAL_ASSETS) {
                try {
                    const response = await fetch(asset);
                    if (response.ok) {
                        await cache.put(asset, response);
                        console.log(`✅ Cached: ${asset}`);
                    }
                } catch (err) {
                    console.log(`⚠️ Failed to cache ${asset}:`, err);
                }
            }
            
            // Cachear recursos externos
            for (const url of EXTERNAL_CACHE) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response);
                        console.log(`✅ Cached external: ${url}`);
                    }
                } catch (err) {
                    console.log(`⚠️ Failed to cache external ${url}:`, err);
                }
            }
            
            console.log('✅ Service Worker installed with all assets');
        })()
    );
    self.skipWaiting();
});

// Ativação - toma controle imediato
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            // Limpar caches antigos
            const keys = await caches.keys();
            await Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
            await self.clients.claim();
            console.log('✅ Service Worker activated');
        })()
    );
});

// Estratégia de fetch inteligente
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Para navegação (HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    // Tenta buscar da rede primeiro
                    const networkResponse = await fetch(event.request);
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                } catch (error) {
                    // Offline: tenta cache, fallback para index.html
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) return cachedResponse;
                    return caches.match(OFFLINE_URL);
                }
            })()
        );
        return;
    }
    
    // Para CSS, JS, imagens - Cache First
    if (event.request.destination === 'style' || 
        event.request.destination === 'script' ||
        event.request.destination === 'image' ||
        event.request.destination === 'font') {
        
        event.respondWith(
            (async () => {
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) return cachedResponse;
                
                try {
                    const networkResponse = await fetch(event.request);
                    if (networkResponse && networkResponse.status === 200) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                } catch (error) {
                    // Fallback para imagem padrão se for imagem
                    if (event.request.destination === 'image') {
                        return caches.match('./icon.png');
                    }
                    return new Response('Recurso indisponível offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                }
            })()
        );
        return;
    }
    
    // Para outros recursos
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return new Response('Offline', { status: 503 });
            });
        })
    );
});
