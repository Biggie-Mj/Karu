// Presentation only: no mutation of character state, counters or dice.
export function isMagicItem(item){
 return ['belt','bracers','slippers','bag','gourd'].includes(item.id)||item.requiresAttunement||Boolean(item.effect)||/peu commun|rare|légendaire|artefact|magique|commun.*maison/i.test(item.rarity||'');
}
export function feedbackKind(event,before,after){
 if(after.resources.hp<before.resources.hp||after.resources.tempHp<before.resources.tempHp&&['hp','deflect','fall','evasion'].includes(event.type))return 'damage';
 if(after.resources.hp>before.resources.hp)return 'heal';
 if(event.type==='attack')return event.natural===1||(!event.hit&&event.natural!==20)?'miss':event.natural===20?'critical':'attack';
 if(event.type==='stun'||event.type==='open')return 'ki';
 if(event.type==='ability')return ['shell','exit','patient','dodge'].includes(event.id)?'guard':['windDash','windDisengage','dash'].includes(event.id)?'move':'ki';
 if(['deflect','fall','evasion'].includes(event.type)||event.type==='hp'&&event.kind==='temp')return 'guard';
 if(event.type==='rest')return 'rest';
 if(event.type==='startTurn')return 'turn';
 if(['move','stand'].includes(event.type))return 'move';
 if(event.type==='death')return event.natural===20?'heal':'guard';
 return null;
}
const PATTERNS={attack:22,critical:[25,35,45],miss:9,damage:[35,35,25],heal:[12,40,12],ki:[12,25,22],guard:20,move:10,rest:[10,45,15],turn:12};
let clearTimer;
export function playFeedback(event,before,after){
 const kind=feedbackKind(event,before,after);if(!kind)return;
 const reduced=after.settings.reduceMotion||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(after.settings.haptics!==false&&!reduced&&typeof navigator.vibrate==='function'){
  try{navigator.vibrate(PATTERNS[kind]);}catch{/* Unsupported/blocked haptics must never interrupt play. */}
 }
 const root=document.body;
 clearTimeout(clearTimer);root.removeAttribute('data-combat-fx');root.classList.remove('ki-spent-fx');
 if(reduced)return;
 // The previous effect is replaced, never stacked into a flashing sequence.
 requestAnimationFrame(()=>{
  root.dataset.combatFx=kind;
  if(after.resources.ki<before.resources.ki)root.classList.add('ki-spent-fx');
  clearTimer=setTimeout(()=>{root.removeAttribute('data-combat-fx');root.classList.remove('ki-spent-fx');},850);
 });
}


// The notice keeps its own colour for its full lifetime, independently of brief combat FX.
export function createResultNotice(element,root,{schedule=setTimeout,cancel=clearTimeout}={}){
 let timer=null,open=false,consumeClick=false;
 function hide(){if(timer!==null)cancel(timer);timer=null;open=false;element.classList.remove('show');if(typeof element.hidePopover==='function')try{element.hidePopover()}catch{}}
 function show(message,kind='neutral'){
  hide();element.textContent=message;element.dataset.noticeKind=kind||'neutral';open=true;
  if(typeof element.showPopover==='function')try{element.showPopover()}catch{}
  element.classList.add('show');timer=schedule(hide,5000);
 }
 root.addEventListener('pointerdown',e=>{
  consumeClick=false;
  if(!open)return;
  hide();consumeClick=true;e.preventDefault();e.stopImmediatePropagation();
 },{capture:true});
 root.addEventListener('click',e=>{
  if(!open&&!consumeClick)return;
  hide();consumeClick=false;e.preventDefault();e.stopImmediatePropagation();
 },{capture:true});
 root.addEventListener('keydown',e=>{if(open&&e.key==='Escape'){hide();e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 return {show,hide};
}
