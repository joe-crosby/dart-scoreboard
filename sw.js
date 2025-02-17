const version = 1;
const CACHE_NAME = `DartScoreboardOffline${version}`;

var cacheItemUrls = [
    './',
    './index.html',
    './images/dartboard.png',
    './images/frame-background.png',
    './css/messageboard.css',
    './css/dartboard.css',
    './css/scoreboard.css',
    './js/games/dart-game.js',
    './js/games/x01.js',
    './js/games/around-the-world.js',
    './js/games/cricket.js',
    './js/games/shanghai.js',
    './js/messageboard.js',
    './js/player.js',
    './js/dartboard.js',
    './js/scoreboard.js'
];

const addResourceUrlsToCache = async (items) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(items).catch((err) => {
    console.error(err);
  });
}

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cache = await caches.open(CACHE_NAME);
  const cachedKeys = await cache.keys();
  const cachesToDelete = cachedKeys.filter((key) => key != CACHE_NAME);
  await Promise.all(cachesToDelete.map(deleteCache));
}

// Create the cache on install
self.addEventListener('install', function(event) {
    event.waitUntil(
      addResourceUrlsToCache(cacheItemUrls)
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(deleteOldCaches());
});

const cacheFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};


self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: './index.html',
    })
  );
});
