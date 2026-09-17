import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
const root=new URL('../',import.meta.url),source=await fs.readFile(new URL('sw.js',root),'utf8');
async function worker(){
 const handlers={},stores=new Map(),deleted=[];let claimed=false,online=true,networkCalls=0;
 const scope='https://example.test/Karu/';
 const key=input=>new URL(typeof input==='string'?input:input.url,scope).href.split('?')[0];
 const caches={open:async name=>{
  if(!stores.has(name))stores.set(name,new Map());const entries=stores.get(name);
  return {addAll:async paths=>{for(const path of paths){const url=new URL(path,scope);const relative=url.pathname.slice('/Karu/'.length)||'index.html';const bytes=await fs.readFile(new URL(relative,root));entries.set(key(path),new Response(bytes));}},match:async req=>entries.get(key(req))?.clone()};
 },keys:async()=>[...stores.keys()],delete:async name=>{deleted.push(name);return stores.delete(name)}};
 vm.runInNewContext(source,{URL,Response,caches,self:{registration:{scope},location:{origin:'https://example.test'},clients:{claim:async()=>{claimed=true}},addEventListener:(type,fn)=>handlers[type]=fn},fetch:async()=>{networkCalls++;if(!online)throw new Error('offline');return new Response('network')}});
 async function lifecycle(type){let result;handlers[type]({waitUntil:p=>result=p});await result;}
 async function fetchPath(path,mode='cors'){let result;handlers.fetch({request:{url:new URL(path,scope).href,method:'GET',mode},respondWith:p=>result=p});return await result;}
 return {stores,deleted,lifecycle,fetchPath,offline:()=>online=false,claimed:()=>claimed,calls:()=>networkCalls};
}
test('Hors ligne : tous les fichiers précachés existent sous un sous-dossier',async()=>{const w=await worker();await w.lifecycle('install');await w.lifecycle('activate');assert.equal(w.claimed(),true);w.offline();for(const file of ['index.html','js/app.js','js/gestures.js','js/source-texts.js','assets/backgrounds/04-journal.webp','assets/icons/ki.png'])assert.ok((await w.fetchPath(file)).ok);assert.equal(w.calls(),0);});
test('Hors ligne : navigation et paramètre de version retrouvent le cache',async()=>{const w=await worker();await w.lifecycle('install');w.offline();assert.match(await (await w.fetchPath('index.html?v=revision','navigate')).text(),/Grand-Père Coquille/);assert.match(await (await w.fetchPath('route-inconnue','navigate')).text(),/Grand-Père Coquille/);});
test('Mise à jour : ne supprime jamais le cache d’un autre compagnon',async()=>{const w=await worker();w.stores.set('karu-cache-%2FKaru%2F-0.9',new Map());w.stores.set('karu-cache-%2FSilas%2F-0.9',new Map());await w.lifecycle('install');await w.lifecycle('activate');assert.deepEqual(w.deleted,['karu-cache-%2FKaru%2F-0.9']);assert.equal(w.stores.has('karu-cache-%2FSilas%2F-0.9'),true);});
test('Le service worker ne prend pas les requêtes hors de son périmètre',async()=>{const w=await worker();assert.equal(await w.fetchPath('https://other.test/file'),undefined);assert.equal(await w.fetchPath('../Silas/index.html'),undefined);});
