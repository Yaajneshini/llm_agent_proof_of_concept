self.addEventListener("install", e => {
  e.waitUntil(caches.open("agent-cache").then(cache => cache.addAll(["/", "/index.html", "/styles.css", "/agent.js"])));
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
