// (A) FILES TO CACHE
const CACHE_NAME = "DartScoreboardOffline";
var urlsToCache = [
    'https://joe-crosby.github.io/dart-scoreboard/',
    'https://joe-crosby.github.io/dart-scoreboard/images/dartboard.png',
    'https://joe-crosby.github.io/dart-scoreboard/images/frame-background.png',
    'https://joe-crosby.github.io/dart-scoreboard/css/messageboard.css',
    'https://joe-crosby.github.io/dart-scoreboard/css/dartboard.css',
    'https://joe-crosby.github.io/dart-scoreboard/css/scoreboard.css',
    'https://joe-crosby.github.io/dart-scoreboard/js/games/dart-game.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/games/x01.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/games/around-the-world.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/games/cricket.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/games/shanghai.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/messageboard.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/player.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/dartboard.js',
    'https://joe-crosby.github.io/dart-scoreboard/js/scoreboard.js'
];

// (B) CREATE/INSTALL CACHE
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(urlsToCache);
        })
        .catch(function(err) {
            console.error(err);
        })
    );
});

// // (C) LOAD FROM CACHE, FALLBACK TO NETWORK IF NOT FOUND
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(evt.request)
//     .then((res) => { return res || fetch(event.request); })
//   );
// });

// Network first, fall back to cache. This will keep the cache up to date.
self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request
  if (event.request.mode === 'navigate') {
    // Open the cache
    event.respondWith(caches.open(CACHE_NAME).then((cache) => {
      // Go to the network first
      return fetch(event.request.url).then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request.url);
      });
    }));
  } else {
    return;
  }
});
