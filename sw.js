importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');


if (workbox) {
    console.log(`Workbox has been loaded`);
    workbox.core.skipWaiting();
    workbox.core.clientsClaim();
    workbox.precaching.precacheAndRoute([
        // Views
        { url: '/', revision: '1' },
        { url: '/index.html', revision: '1' },
        { url: '/team.html', revision: '1' },
        { url: '/nav.html', revision: '1' },

        // Pages
        { url: '/pages/home.html', revision: '1' },
        { url: '/pages/standing.html', revision: '1' },
        { url: '/pages/favorite.html', revision: '1' },

        // CSS
        { url: '/src/css/materialize.min.css', revision: '1' },

        // Javascript
        { url: '/src/js/materialize.min.js', revision: '1' },
        { url: '/src/js/register.js', revision: '1' },
        { url: '/src/js/api.js', revision: '1' },
        { url: '/src/js/nav.js', revision: '1' },
        { url: '/src/js/tab.js', revision: '1' },
        { url: '/src/js/db.js', revision: '1' },
        
        // Images
        { url: '/src/img/mipmap/football.png', revision: '1' },
        { url: '/src/img/mipmap/football-192.png', revision: '1' },

        // Vendor
        { url: '/src/vendor/js/idb.js', revision: '1' },

        // Manifest
        { url: '/manifest.json', revision: '1' },
        
    ], {
        ignoreURLParametersMatching: [/.*/]
    });

    try {
        workbox.routing.registerRoute(
            new RegExp('/pages/'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: 'football-pages',
            })
        );
    
        workbox.routing.registerRoute(
            new RegExp('.*\.js'),
            new workbox.strategies.CacheFirst({
                cacheName: 'resources-scripts',
            })
        );
    
        workbox.routing.registerRoute(
            /\.css$/,
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: 'resources-styles',
            })
        );
    
        workbox.routing.registerRoute(
            /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
            new workbox.strategies.CacheFirst({
                cacheName: 'resources-images',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 100,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                    }),
                ],
            })
        );
    
        workbox.routing.registerRoute(
            new RegExp('https://api.football-data.org/v2/') ,
            new workbox.strategies.CacheFirst({
                cacheName: 'football-datas',
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [0, 200]
                    })
                ]
            })
        )
    } catch (error) {
        console.log(error);
    }

    self.addEventListener('push', function(event) {
        console.log("Push Event is triggered");
        console.log(`The data is ${event.data.text()}`);
        let body = (event.data) ? event.data.text() : 'Push message no payload';
        const options = {
            body: body,
            icon: 'src/img/mipmap/football-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };

        event.waitUntil(
            self.registration.showNotification('Push Notification', options)
        );
    });
} else {
    console.log(`Workbox failed to be loaded`);
}