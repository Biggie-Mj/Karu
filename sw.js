// Change VERSION at every deployment; existing pages keep their current worker until closed.
const VERSION='1.0.1';
const PREFIX='karu-cache-'+encodeURIComponent(new URL(self.registration.scope).pathname)+'-';
const CACHE=PREFIX+VERSION;
const FILES=["./", "./index.html", "./styles.css", "./manifest.webmanifest", "./REGLES-ET-ARBITRAGES.md", "./app.js", "./gestures.js", "./data.js", "./source-texts.js", "./engine.js", "./storage.js", "./app-icon.png", "./01-accueil.webp", "./02-combat.webp", "./03-social.webp", "./04-journal.webp", "./baton.png", "./brassards.png", "./calebasse.png", "./carapace.png", "./ceinture.png", "./chaussons.png", "./deplacement.png", "./flechettes.png", "./griffes.png", "./inventaire.png", "./jets.png", "./journal.png", "./ki.png", "./main-ouverte.png", "./meditation.png", "./poing.png", "./reaction.png", "./repos.png", "./social.png", "./vitalite.png"];
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

