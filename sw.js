// Change VERSION at every deployment; existing pages keep their current worker until closed.
const VERSION='1.0.0';
const PREFIX='karu-cache-'+encodeURIComponent(new URL(self.registration.scope).pathname)+'-';
const CACHE=PREFIX+VERSION;
const FILES=["./", "./index.html", "./styles.css", "./manifest.webmanifest", "./REGLES-ET-ARBITRAGES.md", "./js/app.js", "./js/gestures.js", "./js/data.js", "./js/source-texts.js", "./js/engine.js", "./js/storage.js", "./assets/app-icon.png", "./assets/backgrounds/01-accueil.webp", "./assets/backgrounds/02-combat.webp", "./assets/backgrounds/03-social.webp", "./assets/backgrounds/04-journal.webp", "./assets/icons/baton.png", "./assets/icons/brassards.png", "./assets/icons/calebasse.png", "./assets/icons/carapace.png", "./assets/icons/ceinture.png", "./assets/icons/chaussons.png", "./assets/icons/deplacement.png", "./assets/icons/flechettes.png", "./assets/icons/griffes.png", "./assets/icons/inventaire.png", "./assets/icons/jets.png", "./assets/icons/journal.png", "./assets/icons/ki.png", "./assets/icons/main-ouverte.png", "./assets/icons/meditation.png", "./assets/icons/poing.png", "./assets/icons/reaction.png", "./assets/icons/repos.png", "./assets/icons/social.png", "./assets/icons/vitalite.png"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const hit=await cache.match(event.request,{ignoreSearch:true});if(hit)return hit;
  try{return await fetch(event.request)}catch(error){if(event.request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();throw error;}
 }));
});
