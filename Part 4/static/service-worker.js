const CACHE_NAME = 'tea-shop-cache-v1';
const urlsToCache = [
    '/',
    '/cart',
    '/check-out',
    '/confirmation',
    '/items',
    '/item',
    '/login',
    '/about-us',
    '/contact-us',
    '/admin/items-manager',
    '/admin/orders-manager',

    // Styles & Manifest
    '/static/style.css',
    '/static/manifest.json',

    // JS Files
    '/static/db.js',
    '/static/index.js',
    '/static/cart.js',
    '/static/checkout-handler.js',
    '/static/displayItem.js',
    '/static/items-list.js',
    '/static/items-manager.js',
    '/static/login.js',
    '/static/logout.js',
    '/static/orders-manager.js',
    '/static/send-dummy-order.js',

    // Icons for manifest
    '/static/icons/icon-192.png',
    '/static/icons/icon-512.png',

    // Image assets (if needed)
    '/static/img/img-banner.png',
    '/static/img/img-tea-2.png',
    '/static/img/img-tea-3.png',
    '/static/img/location-pin.svg',
    '/static/img/tea-mug.svg',
    '/static/img/contact-mobile.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

