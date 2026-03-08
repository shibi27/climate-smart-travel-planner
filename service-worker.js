const CACHE_NAME = "climaroute-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/CSS/base.css",
  "/CSS/components.css",
  "/CSS/layout.css",
  "/CSS/map.css",
  "/CSS/themes.css",
  "/CSS/calendar.css",
  "/CSS/animation.css",
  "/JS/main.js",
  "/JS/map.js",
  "/JS/calendar.js",
  "/JS/places.js",
  "/JS/validation.js",
  "/JS/autocomplete.js",
  "/JS/generatePlan.js",
  "/JS/markers.js",
  "/assets/favicon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});