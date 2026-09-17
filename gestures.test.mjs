import test from 'node:test';
import assert from 'node:assert/strict';
import {bindLongPress} from '../js/gestures.js';
function setup(){
 const events=new Map(),timers=new Map();let ticks=0,opened=0,ms=0;
 const root={addEventListener:(name,fn)=>{events.set(name,fn);}};
 const el={dataset:{detail:'flurry'},contains:x=>x===el,closest:()=>el};
 bindLongPress(root,()=>opened++,{schedule:(f,n)=>{ms=n;timers.set(++ticks,f);return ticks},cancel:id=>timers.delete(id)});
 return {el,fire:(type,extra={})=>events.get(type)?.({target:el,button:0,clientX:0,clientY:0,...extra}),hold:()=>[...timers.values()].forEach(f=>f()),opened:()=>opened,ms:()=>ms};
}
test('Appui long 450 ms : ouvre les détails et supprime son clic d’attaque',()=>{
 const t=setup();t.fire('pointerdown');assert.equal(t.ms(),450);t.hold();t.fire('pointerup');
 let prevented=false,stopped=false;t.fire('click',{preventDefault:()=>prevented=true,stopImmediatePropagation:()=>stopped=true});
 assert.equal(t.opened(),1);assert.equal(prevented&&stopped,true);
});
test('Défilement ou glissement annule les détails',()=>{
 for(const action of ['scroll','pointercancel','pointermove']){const t=setup();t.fire('pointerdown');t.fire(action,{clientY:12});t.hold();assert.equal(t.opened(),0);}
});
test('Appui bref : ne déclenche pas de détail',()=>{const t=setup();t.fire('pointerdown');t.fire('pointerup');t.hold();assert.equal(t.opened(),0);});
test('Le toucher suivant sur Fermer reste utilisable même sans clic de relâchement',()=>{
 const t=setup();t.fire('pointerdown');t.hold();t.fire('pointerup');
 const close={closest:()=>null};t.fire('pointerdown',{target:close});let stopped=false;
 t.fire('click',{target:close,preventDefault:()=>stopped=true,stopImmediatePropagation:()=>stopped=true});assert.equal(stopped,false);
});
