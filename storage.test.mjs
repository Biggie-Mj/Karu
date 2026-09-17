import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../js/data.js';
import {exportData,importData} from '../js/engine.js';
let seq=0;
async function fresh(seed=new Map()){
 globalThis.location={pathname:'/Karu/index.html'};
 globalThis.localStorage={getItem:k=>seed.get(k)??null,setItem:(k,v)=>seed.set(k,v)};
 const store=await import('../js/storage.js?case='+seq++);
 return {store,seed};
}
test('Stockage : rechargement fidèle, sans repos implicite',async()=>{
 const {store,seed}=await fresh();
 store.dispatch({type:'hp',kind:'damage',amount:11});
 store.dispatch({type:'adjust',values:{ki:2,whole:false,belt:false}});
 const next=await fresh(seed);assert.equal(next.store.getState().resources.hp,41);
 assert.equal(next.store.getState().resources.ki,2);assert.equal(next.store.getState().resources.whole,false);
});
test('Annulation : ressources restaurées, note récente conservée',async()=>{
 const {store}=await fresh();store.dispatch({type:'hp',kind:'damage',amount:9});
 store.updateContent(s=>s.notes.push({id:'n',title:'Thé',body:'Une halte',category:'',tags:''}));
 store.undoLast();assert.equal(store.getState().resources.hp,52);assert.equal(store.getState().notes[0].body,'Une halte');
});
test('Import et retour à la sauvegarde précédente',async()=>{
 const {store}=await fresh();store.dispatch({type:'hp',kind:'damage',amount:9});
 const candidate=initial();candidate.resources.ki=1;store.replaceState(candidate);
 assert.equal(store.getState().resources.ki,1);assert.equal(store.hasBackup(),true);
 store.restoreBackup();assert.equal(store.getState().resources.hp,43);assert.equal(store.getState().resources.ki,7);
});
test('Sauvegarde corrompue préservée et exportable',async()=>{
 const key='karu-compagnon-v1:/Karu/',seed=new Map([[key,'{bad-json']]);
 const {store}=await fresh(seed);assert.match(store.getWarning(),/illisible/);
 store.dispatch({type:'hp',kind:'damage',amount:3});assert.equal(seed.get(key),'{bad-json');
 assert.equal(store.rawSave(),'{bad-json');
});
test('Échec de stockage signalé, état courant encore exportable',async()=>{
 const {store}=await fresh();globalThis.localStorage.setItem=()=>{throw new Error('Quota');};
 store.dispatch({type:'hp',kind:'damage',amount:3});assert.match(store.getWarning(),/impossible/);
 assert.equal(importData(exportData(store.getState())).resources.hp,49);
});
test('Import invalide : ne modifie ni la partie ni sa sauvegarde',async()=>{
 const {store}=await fresh();const candidate=initial();candidate.log=[{message:7}];
 assert.throws(()=>store.replaceState(candidate));assert.equal(store.getState().log.length,0);
 assert.equal(store.hasBackup(),false);
});
test('Double validation : une seule dépense et un seul niveau d’annulation',async()=>{
 const {store}=await fresh();const event={type:'hp',kind:'damage',amount:8,transactionId:'one-touch'};
 store.dispatch(event);store.dispatch(event);assert.equal(store.getState().resources.hp,44);assert.equal(store.getState().log.length,1);
 store.undoLast();assert.equal(store.getState().resources.hp,52);assert.equal(store.canUndo(),false);
 store.dispatch(event);assert.equal(store.getState().resources.hp,44);
});
