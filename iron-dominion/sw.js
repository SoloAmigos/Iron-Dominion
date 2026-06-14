const CACHE='iron-dominion-v33';
const ASSETS=['.','index.html','css/style.css','manifest.json','icon-192.png','icon-512.png',
  'js/audio.js','js/config.js','js/state.js','js/helpers.js','js/world.js',
  'js/units.js','js/buildings.js','js/projectiles.js','js/ai.js',
  'js/render.js','js/campaign.js','js/ui.js','js/main.js','js/lobby-teampicker.js'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Network-first: always fetch the freshest file when online, fall back to cache offline.
// (Cache-first was serving stale JS after deploys.)
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&r.status===200&&r.type==='basic'){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
