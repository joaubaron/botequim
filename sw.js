// ⚠️ Atualize a versão a cada deploy

const CACHE_VERSION = '08.04.2026-1608';
const CACHE_NAME = `botequim-${CACHE_VERSION}`;
const OFFLINE_URL = './index.html';

// Recursos ESSENCIAIS para funcionamento offline
const ESSENTIAL_ASSETS = [
'./',
'./index.html',
'./manifest.json',
'./botequim.png',
'./comanda.png',
'./icon.png',
'./icon512.png',
'./sw.js'
];

// Recursos externos que DEVEM ser cacheados
const EXTERNAL_CACHE = [
'https://cdn.tailwindcss.com/3.4.1?plugins=forms,typography,aspect-ratio,container-queries',
'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap',
'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// Instalação com cache garantido
self.addEventListener('install', event => {
event.waitUntil(
(async () => {
const cache = await caches.open(CACHE_NAME);

// Cachear assets essenciais
for (const asset of ESSENTIAL_ASSETS) {
try {
const response = await fetch(asset, {
cache: 'no-cache'  // Evita cache durante instalação
});
if (response.ok) {
await cache.put(asset, response);
console.log(`✅ Cached: ${asset}`);
} else {
console.log(`⚠️ Failed to cache ${asset}: status ${response.status}`);
}
} catch (err) {
console.log(`❌ Error caching ${asset}:`, err);
}
}

// Cachear recursos externos
for (const url of EXTERNAL_CACHE) {
try {
const response = await fetch(url, {
mode: 'cors',
credentials: 'omit'
});
if (response.ok) {
await cache.put(url, response);
console.log(`✅ Cached external: ${url}`);
} else {
console.log(`⚠️ Failed to cache external ${url}: status ${response.status}`);
}
} catch (err) {
console.log(`❌ Error caching external ${url}:`, err);
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
keys.filter(key => key !== CACHE_NAME).map(key => {
console.log(`🗑️ Deleting old cache: ${key}`);
return caches.delete(key);
})
);
await self.clients.claim();
console.log('✅ Service Worker activated');
})()
);
});

// Estratégia de fetch inteligente
self.addEventListener('fetch', event => {
const url = new URL(event.request.url);

// Ignorar requisições de analytics e extensões
if (url.pathname.includes('chrome-extension') || 
url.pathname.includes('analytics') ||
url.hostname.includes('google-analytics')) {
return;
}

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
console.log('📱 Offline mode - serving from cache');
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
if (cachedResponse) {
console.log(`📦 Cache hit: ${url.pathname}`);
return cachedResponse;
}

try {
const networkResponse = await fetch(event.request);
if (networkResponse && networkResponse.status === 200) {
const cache = await caches.open(CACHE_NAME);
cache.put(event.request, networkResponse.clone());
console.log(`🌐 Network & cached: ${url.pathname}`);
}
return networkResponse;
} catch (error) {
console.log(`❌ Failed to fetch: ${url.pathname}`);
// Fallback para imagem padrão se for imagem
if (event.request.destination === 'image') {
return caches.match('./icon.png');
}
return new Response('Recurso indisponível offline', {
status: 503,
statusText: 'Service Unavailable',
headers: new Headers({
'Content-Type': 'text/plain'
})
});
}
})()
);
return;
}

// Para outros recursos - Network First com fallback
event.respondWith(
(async () => {
try {
const networkResponse = await fetch(event.request);
// Cache apenas recursos bem-sucedidos
if (networkResponse && networkResponse.status === 200) {
const cache = await caches.open(CACHE_NAME);
cache.put(event.request, networkResponse.clone());
}
return networkResponse;
} catch (error) {
const cachedResponse = await caches.match(event.request);
if (cachedResponse) {
console.log(`📦 Cache fallback: ${url.pathname}`);
return cachedResponse;
}
return new Response('Recurso indisponível offline', { 
status: 503,
statusText: 'Service Unavailable'
});
}
})()
);
});
