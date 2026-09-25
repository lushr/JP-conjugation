const CACHE_NAME="jp-conjugation-v1";const APP_FILES=["./","./index.html","./style.css","./script.js","./conjugations.json","./manifest.json","./icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):Promise.resolve()))));self.clients.claim()});
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)))});
