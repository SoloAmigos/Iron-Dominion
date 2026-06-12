const CACHE='iron-dominion-v15';
const ASSETS=['.','index.html','css/style.css','manifest.json','icon-192.png','icon-512.png',
  'js/audio.js','js/config.js','js/state.js','js/helpers.js','js/world.js',
  'js/units.js','js/buildings.js','js/projectiles.js','js/ai.js',
  'js/render.js','js/campaign.js','js/ui.js','js/main.js'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
