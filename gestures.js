// A long press consumes only its own compatibility click, never a subsequent tap.
export function bindLongPress(root,onDetails,{schedule=setTimeout,cancel=clearTimeout}={}) {
 let timer=null,origin=null,suppressed=null;
 const stop=()=>{if(timer!==null)cancel(timer);timer=null;origin=null;};
 root.addEventListener('pointerdown',e=>{
  suppressed=null;stop();
  const el=e.target.closest('[data-detail]');
  if(!el||e.button!==0||e.isPrimary===false)return;
  origin={x:e.clientX,y:e.clientY,el};
  timer=schedule(()=>{timer=null;suppressed=el;onDetails(el);},450);
 });
 root.addEventListener('pointermove',e=>{
  if(origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>10)stop();
 });
 for(const type of ['pointerup','pointercancel','scroll'])root.addEventListener(type,stop,{capture:true,passive:true});
 root.addEventListener('contextmenu',e=>{if(e.target.closest('[data-detail]'))e.preventDefault();});
 root.addEventListener('click',e=>{
  if(suppressed&&(e.target===suppressed||suppressed.contains(e.target))){
   suppressed=null;e.preventDefault();e.stopImmediatePropagation();
  }else suppressed=null;
 },{capture:true});
}
