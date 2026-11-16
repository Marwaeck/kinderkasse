// Kinderkasse – Offline-Speicher. Online wird immer die neueste Version geholt, offline die gespeicherte.
const CACHE='kinderkasse-v5';
const FILES=['./','index.html','zbar.js','apple-touch-icon.png','manifest.webmanifest','ZBAR-LICENSE.txt'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET' || new URL(req.url).origin!==self.location.origin) return;
  e.respondWith(
    fetch(req).then(res=>{ if(res && res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); } return res; })
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r || (req.mode==='navigate' ? caches.match('index.html') : Response.error())))
  );
});
