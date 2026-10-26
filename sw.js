// 更新靜態檔案後請修改版本字串
const CACHE='reels-prompt-studio-v2';
const FILES=['./','./index.html','./styles.css','./app.js','./data/examples.json','./manifest.webmanifest','./assets/favicon.svg','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// 網路優先：有網路時永遠取得最新版本，離線時改用快取
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(resp=>{if(resp.ok){const clone=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,clone))}return resp}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
