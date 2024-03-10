// based on https://github.com/mdn/dom-examples/blob/9edd9627054b78f64cabd005cffca5a0808281c9/service-worker/simple-service-worker/sw.js

const cachePromise = globalThis.caches.open("v1");

globalThis.addEventListener("install", (event) => {
  event.waitUntil((async () =>
    (await cachePromise).addAll([
      "./index.html",
      "./style.css",
      "./index.js",
      "./img/favicon.ico",
      "./img/android-chrome-36x36.png",
      "./img/android-chrome-48x48.png",
      "./img/android-chrome-72x72.png",
      "./img/android-chrome-96x96.png",
      "./img/android-chrome-128x128.png",
      "./img/android-chrome-144x144.png",
      "./img/android-chrome-152x152.png",
      "./img/android-chrome-192x192.png",
      "./img/android-chrome-256x256.png",
      "./img/android-chrome-384x384.png",
      "./img/android-chrome-512x512.png",
    ]))());
});

globalThis.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await cachePromise;

      const request = event.request;

      // try to get the resource from the network
      try {
        const res = await fetch(request);

        if (res.ok) {
          await cache.put(request, res.clone());
        } else {
          // try to use a cached response
          const cached = await cache.match(request);
          if (cached) return cached;
        }

        return res;
      } catch (_) {
        // try to use a cached response
        const res = await cache.match(request);
        if (res) return res;
      }
    })(),
  );
});
