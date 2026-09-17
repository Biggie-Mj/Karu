import {initial,ATTRS,SKILLS,VERSION} from './data.js';
export const clone=x=>structuredClone(x);
export const mod=x=>Math.floor((x-10)/2);
export const signed=n=>n>=0?`+${n}`:`−${Math.abs(n)}`;
const require=(ok,msg)=>{if(!ok)throw new Error(msg)};
export function number(n,min=0,max=100000){require(typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max,'Valeur numérique hors limites.');return n;}
export function integer(n,min=0,max=100000){number(n,min,max);require(Number.isInteger(n),'Un nombre entier est requis.');return n;}
export const activeItem=(s,effect)=>s.items.find(i=>i.effect===effect&&i.equipped&&i.quantity>0&&(!i.requiresAttunement||i.attuned));
export function derived(s){
 const c=s.character,m=Object.fromEntries(Object.entries(c.stats).map(([k,v])=>[k,mod(v)])),unarmored=!c.armor&&!c.shield;
 const belt=activeItem(s,'belt'),bracers=unarmored?activeItem(s,'bracers'):null;
 let speed=(c.baseSpeed+(unarmored?c.monkSpeed:0))*(s.resources.exhaustion>=2?.5:1);
 if(s.shell||s.resources.hp===0||['Agrippé','Entravé','Étourdi','Paralysé','Inconscient'].some(x=>s.conditions.includes(x))||s.resources.exhaustion>=5)speed=0;
 const ac=(c.armor?c.naturalAc:Math.max(c.naturalAc,unarmored?10+m.dex+m.wis:0))+(c.shield?2:0)+(bracers?.bonus||0)+c.acAdjustment+(s.shell?c.rules.shellBonus:0);
 return {mods:m,unarmored,belt,ac,speed,climb:activeItem(s,'slippers')&&!c.encumbered&&!c.slippery?speed:0,dc:8+c.proficiency+m.wis+(unarmored?(belt?.bonus||0):0)+c.dcAdjustment,maxHp:s.resources.exhaustion>=4?Math.floor(c.maxHp/2):c.maxHp,moveLeft:Math.max(0,speed*(1+s.turn.dashes)-s.turn.moveSpent),passive:10+skillBonus(s,'perception')};
}
export const skillBonus=(s,id)=>{const a=SKILLS.find(x=>x[0]===id);return mod(s.character.stats[a[2]])+s.character.proficiency*s.character.skills[id].proficiency+s.character.skills[id].adjustment;};
export const saveBonus=(s,k)=>mod(s.character.stats[k])+s.character.proficiency*s.character.saves[k]+(s.character.saveAdjustments[k]||0);
export function attackStats(s,id){const a=s.attacks[id];require(a,'Attaque inconnue.');const m=mod(s.character.stats[a.attr]);return {...a,bonus:m+s.character.proficiency+s.character.attackAdjustment+(a.bonusAdjustment||0),damageMod:m+s.character.damageAdjustment+(a.damageAdjustment||0),die:a.unarmed?s.character.martialDie:a.die};}
export function rollDice(count,sides,rng){integer(count,1,100);integer(sides,2,1000);const die=()=>{if(rng)return 1+Math.floor(rng()*sides);const max=4294967296-(4294967296%sides),a=new Uint32Array(1);do{crypto.getRandomValues(a)}while(a[0]>=max);return 1+a[0]%sides;};const dice=Array.from({length:count},die);return {dice,total:dice.reduce((a,b)=>a+b,0)};}
export function d20(mode='normal',manual=[],rng){require(['normal','adv','dis'].includes(mode),'Mode de jet invalide.');const count=mode==='normal'?1:2;if(manual.length)require(manual.length===count,'Saisir tous les dés du jet manuel.');const dice=manual.length?manual.map(n=>integer(n,1,20)):rollDice(count,20,rng).dice;return {dice,natural:mode==='adv'?Math.max(...dice):mode==='dis'?Math.min(...dice):dice[0],mode};}
export function effectiveMode(s,chosen,kind,key){let adv=chosen==='adv',dis=chosen==='dis',reasons=[];const add=(isAdv,reason)=>{if(isAdv)adv=true;else dis=true;reasons.push(reason)};
 if(kind==='save'&&s.shell){if(['str','con'].includes(key))add(true,'Carapace');if(key==='dex')add(false,'Carapace');}
 if(kind==='save'&&key==='dex'&&s.effects.some(x=>x.kind==='dodge')&&derived(s).speed>0&&!incapacitated(s))add(true,'Esquive');
 if(kind==='save'&&key==='dex'&&s.conditions.includes('Entravé'))add(false,'Entravé');
 if((kind==='skill'||kind==='check')&&s.resources.exhaustion>=1)add(false,'Épuisement');
 if(['attack','save'].includes(kind)&&s.resources.exhaustion>=3)add(false,'Épuisement');
 if((kind==='attack'||kind==='skill'||kind==='check')&&s.conditions.includes('Empoisonné'))add(false,'Empoisonné');
 if(kind==='attack'&&['À terre','Entravé','Aveuglé'].some(x=>s.conditions.includes(x)))add(false,'État défavorable');
 return {mode:adv===dis?'normal':adv?'adv':'dis',reasons};}
export const incapacitated=s=>s.resources.hp===0||s.resources.dead||['Neutralisé','Étourdi','Paralysé','Inconscient'].some(x=>s.conditions.includes(x));
function able(s,own=true,shellAllowed=false){require(!incapacitated(s),'Karu ne peut pas agir dans cet état.');require(shellAllowed||!s.shell,'Dans la carapace, seule la sortie en action bonus est possible.');if(own)require(s.turn.phase==='active','Attendre le début du tour de Karu.');}
function spend(s,kind){require(!s.turn[kind],`${kind==='action'?'Action':kind==='bonus'?'Action bonus':'Réaction'} déjà utilisée.`);s.turn[kind]=true;}
function ki(s,n){integer(n,0,100);require(s.resources.ki>=n,'Ki insuffisant.');s.resources.ki-=n;}
function addEffect(s,kind,name,boundary,turn,target='Karu'){s.effects.push({id:crypto.randomUUID(),kind,name,boundary,turn,target});}
function heal(s,n){number(n);require(!s.resources.dead,'Karu est mort : ajustement du MJ requis.');const before=s.resources.hp;s.resources.hp=Math.min(derived(s).maxHp,s.resources.hp+n);if(s.resources.hp>0){s.resources.success=0;s.resources.failure=0;s.resources.stable=false;s.conditions=s.conditions.filter(c=>c!=='Inconscient');}return s.resources.hp-before;}
function damage(s,n,critical=false){integer(n);const r=s.resources,wasZero=r.hp===0,absorbed=Math.min(r.tempHp,n);r.tempHp-=absorbed;const rest=n-absorbed,before=r.hp;r.hp=Math.max(0,r.hp-rest);
 if(n>0&&wasZero){r.stable=false;r.failure=Math.min(3,r.failure+(critical?2:1));if(r.failure>=3)r.dead=true;}
 if(rest>=before+derived(s).maxHp&&rest>0)r.dead=true;
 if(r.hp===0&&n>0){if(!s.conditions.includes('À terre'))s.conditions.push('À terre');if(!s.conditions.includes('Inconscient'))s.conditions.push('Inconscient');}
 return `${n} dégâts : ${absorbed} absorbés, ${before-r.hp} PV perdus.${r.dead?' Karu est mort.':r.hp===0?' Karu est à 0 PV.':''}`;
}
export function canAttack(s,id,source='action'){try{validateAttack(s,id,source);return ''}catch(e){return e.message}}
function validateAttack(s,id,source){const a=attackStats(s,id);able(s,source!=='opportunity'&&source!=='return');
 if(id==='dart'&&source!=='return')require((s.items.find(i=>i.id==='darts')?.quantity||0)>0,'Plus de fléchettes.');
 if(source==='action')require(!s.turn.action||s.turn.attacksLeft>0,'Action déjà utilisée.');
 else if(source==='arts'){require(a.unarmed&&derived(s).unarmored,'Arts martiaux : frappe à mains nues, sans armure ni bouclier.');require(s.turn.attackTaken&&s.turn.martialQualified,'Une attaque à mains nues ou avec arme de moine est nécessaire.');require(!s.turn.bonus,'Action bonus déjà utilisée.');}
 else if(source==='flurry'){require(a.unarmed,'Rafale : frappe à mains nues.');if(!s.turn.flurryLeft){require(!s.turn.bonus,'Action bonus déjà utilisée.');require(s.turn.attackTaken&&s.turn.attacksLeft===0&&s.turn.flurryWindow,'Terminer l’action Attaquer juste avant la Rafale.');require(!s.turn.bonus,'Action bonus déjà utilisée.');require(s.resources.ki>=s.character.rules.flurryCost,'Ki insuffisant.');}}
 else if(source==='opportunity'){require(a.melee,'L’opportunité demande une attaque de corps à corps.');require(!s.turn.reaction,'Réaction déjà utilisée.');}
 else if(source==='return'){require(s.returnReady,'Aucun projectile attrapé prêt à être renvoyé.');require(s.resources.ki>=s.character.rules.returnCost,'Ki insuffisant.');}
 else throw new Error('Source d’attaque inconnue.');
}
export function apply(state,event,rng){const s=clone(state),r=s.resources,c=s.character,t=s.turn;let message='';const rules=c.rules;
 switch(event.type){
 case 'attack':{
  validateAttack(s,event.id,event.source);const a=attackStats(s,event.id),source=event.source;
  if(source==='action'){if(!t.action){spend(s,'action');t.attacksLeft=2;t.attackTaken=true;}t.attacksLeft--;if(a.monk)t.martialQualified=true;t.flurryWindow=t.attacksLeft===0;}
  else if(source==='arts'){spend(s,'bonus');t.flurryWindow=false;}
  else if(source==='flurry'){if(!t.flurryLeft){spend(s,'bonus');ki(s,rules.flurryCost);t.flurryLeft=2;}t.flurryLeft--;t.flurryWindow=false;}
  else if(source==='opportunity')spend(s,'reaction');
  else if(source==='return'){ki(s,rules.returnCost);s.returnReady=false;}
  if(event.id==='dart'&&source!=='return')s.items.find(i=>i.id==='darts').quantity--;
  integer(event.natural,1,20);integer(event.damage,0,100000);
  const hit=event.natural===1?false:event.natural===20?true:!!event.hit;
  s.lastHit=hit?{id:crypto.randomUUID(),melee:a.melee&&source!=='return',flurry:source==='flurry',stunUsed:false,openUsed:false,target:event.target||'Cible',damage:event.damage}:null;
  message=`${source==='return'?'Renvoi du projectile':a.name} · ${event.rollText||event.natural} · ${hit?`${event.damage} ${source==='return'&&event.damageType?event.damageType:a.type}${event.natural===20?' · critique':''}`:'manqué'} · ${event.target||'Cible'}.`;break;
 }
 case 'finishAttacks':able(s);require(t.attackTaken&&t.attacksLeft>0,'Aucune attaque restante.');t.attacksLeft=0;t.flurryWindow=true;message='Attaque restante abandonnée ; action Attaquer terminée.';break;
 case 'stun':{able(s,false);require(s.lastHit?.melee&&!s.lastHit.stunUsed,'Nécessite une nouvelle touche au corps à corps.');ki(s,rules.stunCost);s.lastHit.stunUsed=true;const target=event.target||s.lastHit.target;require(['success','failure'].includes(event.result),'Résultat du JS requis.');if(event.result==='failure')addEffect(s,'stunned','Étourdi','end',t.number+1,target);message=`Frappe étourdissante · ${target} · CON DD ${derived(s).dc} : ${event.result==='failure'?'échec, étourdi jusqu’à la fin du prochain tour':'réussite'}.`;break;}
 case 'open':{require(s.lastHit?.flurry&&!s.lastHit.openUsed,'Nécessite une nouvelle touche de Rafale.');require(['prone','push','noReaction'].includes(event.effect),'Effet inconnu.');const target=event.target||s.lastHit.target;s.lastHit.openUsed=true;if(event.effect==='noReaction')addEffect(s,'noReaction','Sans réaction','end',t.number+1,target);else if(event.result==='failure'&&event.effect==='prone')addEffect(s,'prone','À terre','manual',0,target);message=`Main Ouverte · ${target} · ${event.effect==='noReaction'?'sans réaction jusqu’à la fin du prochain tour':event.result==='failure'?(event.effect==='prone'?'à terre':'repoussé jusqu’à 4,5 m'):'sauvegarde réussie'}.`;break;}
 case 'ability':{
  const id=event.id;able(s,true,id==='exit');
  if(id==='shell'){spend(s,'action');s.shell=true;if(!s.conditions.includes('À terre'))s.conditions.push('À terre');message=`Dans la carapace · CA ${derived(s).ac}.`;}
  else if(id==='exit'){require(s.shell,'Karu n’est pas dans sa carapace.');spend(s,'bonus');s.shell=false;if(event.belt){require(derived(s).belt&&r.belt,'Propriété de ceinture indisponible.');const max=derived(s).speed/2;number(event.distance||0,0,max);r.belt=false;s.conditions=s.conditions.filter(x=>x!=='À terre');message=`Sortie avec ceinture · relevé · ${event.distance||0} m sans opportunité (hors budget normal).`;}else message='Sortie normale ; Karu reste à terre jusqu’à se relever.';}
  else if(id==='patient'){spend(s,'bonus');ki(s,rules.patientCost);addEffect(s,'dodge','Esquive','start',t.number+1);message='Défense patiente jusqu’au début du prochain tour.';}
  else if(id==='windDash'||id==='windDisengage'){spend(s,'bonus');ki(s,rules.windCost);if(id==='windDash')t.dashes++;else addEffect(s,'disengage','Désengagement','end',t.number);addEffect(s,'jump','Sauts doublés','end',t.number);message=id==='windDash'?'Déplacement aérien · Foncer.':'Déplacement aérien · Se désengager.';}
  else if(id==='whole'){require(r.whole,'Intégrité physique déjà utilisée.');spend(s,'action');r.whole=false;message=`Intégrité physique · +${heal(s,c.level*rules.wholeMultiplier)} PV.`;}
  else if(id==='still'){require(['Charmé','Effrayé'].includes(event.condition)&&s.conditions.includes(event.condition),'Choisir un état actif : charmé ou effrayé.');spend(s,'action');s.conditions=s.conditions.filter(x=>x!==event.condition);message=`Quiétude de l’esprit · ${event.condition} terminé.`;}
  else if(id==='dash'){spend(s,'action');t.dashes++;message='Foncer · budget de déplacement augmenté.';}
  else if(id==='dodge'){spend(s,'action');addEffect(s,'dodge','Esquive','start',t.number+1);message='Esquiver jusqu’au début du prochain tour.';}
  else if(id==='disengage'){spend(s,'action');addEffect(s,'disengage','Désengagement','end',t.number);message='Se désengager pour ce tour.';}
  else {spend(s,'action');message=`${event.label||'Action courante'} · action utilisée. Résolution avec le MJ.`;}
  t.flurryWindow=false;s.lastHit=null;break;
 }
 case 'deflect':{able(s,false);spend(s,'reaction');integer(event.incoming,0);const die=event.die?integer(event.die,1,10):rollDice(1,10,rng).total;const reduce=die+mod(c.stats.dex)+c.level,remaining=Math.max(0,event.incoming-reduce);s.returnReady=remaining===0&&!!event.catch;message=`Parade · ${die} + ${mod(c.stats.dex)+c.level} = ${reduce} réduits. ${damage(s,remaining)}${s.returnReady?' Projectile attrapé : renvoi immédiat possible.':''}`;s.lastHit=null;break;}
 case 'declineReturn':s.returnReady=false;message='Projectile conservé, sans renvoi.';break;
 case 'fall':able(s,false);spend(s,'reaction');integer(event.incoming,0);message=`Chute ralentie · réduction ${c.level*rules.fallMultiplier}. ${damage(s,Math.max(0,event.incoming-c.level*rules.fallMultiplier))}`;break;
 case 'evasion':require(event.eligible,'Confirmer un effet DEX pour moitié.');integer(event.incoming,0);message=`Esquive instinctive · ${damage(s,event.success?0:Math.floor(event.incoming/2))}`;break;
 case 'hp':integer(event.amount);if(event.kind==='damage')message=damage(s,event.amount,!!event.critical);else if(event.kind==='heal')message=`Soins · +${heal(s,event.amount)} PV.`;else if(event.kind==='temp'){const old=r.tempHp;r.tempHp=event.amount;message=`PV temporaires : ${old} → ${r.tempHp}, sans cumul.`;}else throw new Error('Opération PV inconnue.');break;
 case 'death':{
  require(r.hp===0&&!r.dead&&!r.stable,'Jet de mort indisponible.');const n=integer(event.natural,1,20);
  if(n===20){heal(s,1);message='20 naturel · Karu récupère 1 PV.';}
  else {if(n===1)r.failure+=2;else if(n<10)r.failure++;else r.success++;r.failure=Math.min(3,r.failure);r.success=Math.min(3,r.success);if(r.failure===3)r.dead=true;else if(r.success===3){r.stable=true;r.success=0;r.failure=0;}message=`Jet de mort ${n} · ${r.dead?'mort':r.stable?'stabilisé':`${r.success} réussite(s), ${r.failure} échec(s)`}.`;}break;
 }
 case 'stabilize':require(r.hp===0&&!r.dead,'Stabilisation impossible.');r.stable=true;r.success=0;r.failure=0;message='Karu est stabilisé à 0 PV ; il reste inconscient.';break;
 case 'move':{able(s);const n=number(event.amount,0,1000);const cost=n*(1+(s.conditions.includes('À terre')?1:0)+(event.difficult?1:0));require(cost<=derived(s).moveLeft,'Déplacement restant insuffisant.');t.moveSpent+=cost;t.flurryWindow=false;message=`${n} m parcourus · ${cost} m dépensés.`;break;}
 case 'stand':able(s);require(s.conditions.includes('À terre'),'Karu est déjà debout.');require(derived(s).speed>0&&derived(s).moveLeft>=derived(s).speed/2,'Déplacement insuffisant pour se relever.');t.moveSpent+=derived(s).speed/2;s.conditions=s.conditions.filter(x=>x!=='À terre');message='Karu se relève (moitié de sa vitesse).';break;
 case 'endTurn':require(t.phase==='active','Tour déjà terminé.');t.phase='waiting';t.attacksLeft=0;t.flurryLeft=0;t.flurryWindow=false;s.lastHit=null;s.returnReady=false;s.effects=s.effects.filter(e=>!(e.boundary==='end'&&e.turn<=t.number));message=`Fin du tour ${t.number}. La réaction n’est pas rechargée.`;break;
 case 'startTurn':require(t.phase==='waiting','Terminer le tour actuel avant le suivant.');s.turn={...initial().turn,number:t.number+1};s.lastHit=null;s.returnReady=false;s.effects=s.effects.filter(e=>!(e.boundary==='start'&&e.turn<=s.turn.number));message=`Début du tour ${s.turn.number} · action, bonus, réaction et mouvement disponibles.`;break;
 case 'condition':require(typeof event.name==='string'&&event.name.length<80,'État invalide.');if(event.active){if(!s.conditions.includes(event.name))s.conditions.push(event.name);}else s.conditions=s.conditions.filter(x=>x!==event.name);message=`${event.name} : ${event.active?'actif':'retiré'}.`;break;
 case 'removeEffect':s.effects=s.effects.filter(x=>x.id!==event.id);message='Effet retiré manuellement.';break;
 case 'rest':{
  require(!r.dead,'Un repos ne ramène pas à la vie.');require(['short','long','dawn'].includes(event.kind),'Repos inconnu.');
  if(event.kind==='dawn'){r.gourd=true;message='Nouvelle aube · purification de la calebasse rechargée.';break;}
  let extra='';if(event.kind==='short'){const count=integer(event.hd||0,0,r.hd);let healed=0;const dice=[];for(let i=0;i<count;i++){const d=rollDice(1,c.hitDie,rng).total;dice.push(d);healed+=heal(s,Math.max(0,d+mod(c.stats.con)));}r.hd-=count;extra=`${count} dé(s) de vie [${dice.join(', ')}] · +${healed} PV.`;}
  else {require(r.hp>0,'Repos long : au moins 1 PV au début du repos.');r.hp=derived(s).maxHp;r.tempHp=0;r.hd=Math.min(c.hitDice,r.hd+Math.max(1,Math.floor(c.hitDice/2)));r.whole=true;if(event.food&&r.exhaustion>0)r.exhaustion--;r.hp=derived(s).maxHp;extra='PV restaurés ; moitié des dés de vie récupérée ; intégrité physique rechargée.';}
  if(event.meditation)r.ki=c.maxKi;r.belt=true;s.lastHit=null;s.returnReady=false;s.turn={...initial().turn,number:t.number,phase:'waiting'};s.effects=s.effects.filter(e=>e.boundary==='manual');message=`Repos ${event.kind==='short'?'court':'long'} terminé. ${extra} ${event.meditation?'Ki récupéré après méditation.':'Ki inchangé : pas de méditation.'}`;break;
 }
 case 'item':{
  const idx=s.items.findIndex(x=>x.id===event.item.id);const it=clone(event.item);integer(it.quantity,0,9999);require(it.name.trim(),'Nom requis.');if(it.attuned){require(it.requiresAttunement,'Cet objet ne requiert pas d’harmonisation.');require(s.items.filter(x=>x.id!==it.id&&x.attuned&&x.quantity>0).length<3,'Trois harmonisations maximum.');}
  if(idx<0)s.items.push(it);else s.items[idx]=it;r.hp=Math.min(r.hp,derived(s).maxHp);message=`Inventaire · ${it.name} enregistré.`;break;
 }
 case 'consume':{const it=s.items.find(x=>x.id===event.id);require(it&&it.quantity>0,'Objet épuisé.');it.quantity--;message=`${it.name} utilisé. Résoudre son effet avec le MJ.`;break;}
 case 'retrieve':able(s);spend(s,'action');message='Objet récupéré du sac sans fond · action utilisée.';break;
 case 'gourd':require(r.gourd,'Purification déjà utilisée depuis la dernière aube.');require(s.items.some(i=>i.id==='gourd'&&i.quantity>0),'Calebasse absente.');r.gourd=false;message='Purification de la calebasse utilisée ; volume à valider avec le MJ.';break;
 case 'coins':for(const k of Object.keys(s.coins))s.coins[k]=integer(event.coins[k],0,10000000);message='Bourse mise à jour.';break;
 case 'configure':s.character=clone(event.character);validateCharacter(s.character);r.hp=Math.min(r.hp,derived(s).maxHp);r.ki=Math.min(r.ki,s.character.maxKi);r.hd=Math.min(r.hd,s.character.hitDice);message='Fiche mise à jour ; valeurs dérivées recalculées.';break;
 case 'adjust':{
  for(const [k,v] of Object.entries(event.values)){require(Object.hasOwn(r,k),'Ressource inconnue.');require(typeof v===typeof r[k],'Type de ressource invalide.');r[k]=v;}
  r.hp=Math.min(r.hp,derived(s).maxHp);if(r.hp>0){r.stable=false;r.success=0;r.failure=0;s.conditions=s.conditions.filter(x=>x!=='Inconscient');}message='Ajustement explicite du MJ.';break;
 }
 case 'roll':message=String(event.message).slice(0,2000);break;
 default:throw new Error('Opération inconnue.');
 }
 // A new operation after a hit ends its trigger window, except the two on-hit effects.
 if(!['attack','stun','open','roll'].includes(event.type))s.lastHit=null;
 if(!['deflect','roll'].includes(event.type))s.returnReady=false;
 if(derived(s).speed===0||incapacitated(s))s.effects=s.effects.filter(e=>e.kind!=='dodge');
 r.hp=Math.min(r.hp,derived(s).maxHp);s.updatedAt=new Date().toISOString();s.log.unshift({id:crypto.randomUUID(),at:s.updatedAt,turn:s.turn.number,message});s.log=s.log.slice(0,300);validateState(s);return {state:s,message};
}
export function validateCharacter(c){require(c&&typeof c==='object','Personnage manquant.');require(typeof c.name==='string'&&c.name.length>0&&c.name.length<100,'Nom invalide.');integer(c.level,1,20);for(const k of Object.keys(ATTRS))integer(c.stats?.[k],1,30);integer(c.proficiency,0,10);integer(c.maxHp,1,10000);integer(c.maxKi,0,100);integer(c.hitDice,1,30);integer(c.hitDie,2,20);integer(c.martialDie,2,20);number(c.naturalAc,0,100);number(c.baseSpeed,0,100);number(c.monkSpeed,0,100);for(const k of ['attackAdjustment','damageAdjustment','acAdjustment','dcAdjustment'])number(c[k],-100,100);for(const k of Object.keys(ATTRS)){number(c.saves[k],0,2);number(c.saveAdjustments[k]||0,-100,100);}for(const [id]of SKILLS){number(c.skills?.[id]?.proficiency,0,2);number(c.skills[id].adjustment,-100,100);}for(const k of ['shellBonus','flurryCost','patientCost','windCost','stunCost','returnCost','wholeMultiplier','fallMultiplier'])number(c.rules[k],0,100);for(const k of ['armor','shield','encumbered','slippery'])require(typeof c[k]==='boolean','Option de fiche invalide.');}
export function validateState(s){require(s?.schema===VERSION,'Version de sauvegarde incompatible.');validateCharacter(s.character);const r=s.resources;for(const k of ['hp','tempHp','ki','hd','success','failure','exhaustion'])integer(r?.[k],0,k==='success'||k==='failure'?3:k==='exhaustion'?6:100000);require(r.hp<=derived(s).maxHp&&r.ki<=s.character.maxKi&&r.hd<=s.character.hitDice,'Ressources supérieures à leur maximum.');for(const k of ['whole','belt','gourd','stable','dead'])require(typeof r[k]==='boolean','Ressource booléenne invalide.');
 require(Array.isArray(s.items)&&s.items.length<=1000,'Inventaire invalide.');for(const i of s.items){require(typeof i.id==='string'&&typeof i.name==='string'&&typeof i.description==='string','Objet invalide.');integer(i.quantity,0,9999);for(const k of ['equipped','attuned','requiresAttunement'])require(typeof i[k]==='boolean','Équipement invalide.');if(i.bonus!==undefined)number(i.bonus,-100,100);}
 require(new Set(s.items.map(i=>i.id)).size===s.items.length,'Identifiants d’objets dupliqués.');require(s.items.filter(i=>i.attuned&&i.quantity>0).length<=3,'Trop d’harmonisations.');
 require(s.turn&&['active','waiting'].includes(s.turn.phase),'Tour invalide.');integer(s.turn.number,1,100000);for(const k of ['action','bonus','reaction','attackTaken','martialQualified','flurryWindow'])require(typeof s.turn[k]==='boolean','Économie de tour invalide.');for(const k of ['attacksLeft','flurryLeft'])integer(s.turn[k],0,2);number(s.turn.moveSpent);integer(s.turn.dashes,0,20);
 for(const k of ['conditions','effects','notes','categories','log'])require(Array.isArray(s[k])&&s[k].length<=5000,`${k} invalide.`);
 require(typeof s.shell==='boolean'&&typeof s.returnReady==='boolean','État de carapace / renvoi invalide.');
 require(s.conditions.every(x=>typeof x==='string'),'États invalides.');for(const e of s.effects)require(typeof e.id==='string'&&typeof e.name==='string'&&typeof e.target==='string'&&['start','end','manual'].includes(e.boundary)&&Number.isFinite(e.turn),'Effet invalide.');
 for(const n of s.notes)require(typeof n.id==='string'&&typeof n.title==='string'&&typeof n.body==='string'&&typeof n.category==='string'&&typeof n.tags==='string','Note invalide.');for(const cat of s.categories)require(typeof cat.id==='string'&&typeof cat.name==='string'&&/^#[0-9a-f]{6}$/i.test(cat.color),'Catégorie invalide.');
 for(const entry of s.log)require(entry&&typeof entry.message==='string'&&typeof entry.at==='string'&&Number.isInteger(entry.turn),'Historique invalide.');
 require(Array.isArray(s.character.tools)&&s.character.tools.every(x=>typeof x==='string')&&typeof s.character.languages==='string','Outils ou langues invalides.');
 for(const [id,a] of Object.entries(s.attacks||{})){require(typeof a.name==='string'&&Object.hasOwn(ATTRS,a.attr),'Attaque invalide.');integer(a.die,2,100);for(const k of ['melee','monk','unarmed'])require(a[k]===undefined||typeof a[k]==='boolean','Propriété d’attaque invalide.');for(const k of ['bonusAdjustment','damageAdjustment'])if(a[k]!==undefined)number(a[k],-100,100);}
 require(Object.keys(initial().attacks).every(k=>s.attacks?.[k]),'Attaque obligatoire manquante.');for(const k of Object.keys(initial().details))require(typeof s.details?.[k]?.text==='string'&&typeof s.details[k].name==='string','Description manquante.');
 require(s.settings&&typeof s.settings.contrast==='boolean'&&typeof s.settings.reduceMotion==='boolean','Préférences invalides.');for(const k of ['pc','pa','pe','po','pp'])integer(s.coins?.[k],0,10000000);return true;
}
export function importData(text){require(text.length<6000000,'Fichier trop volumineux (6 Mo maximum).');const raw=JSON.parse(text);const state=raw.app==='karu-compagnon'?raw.state:raw;validateState(state);return clone(state);}
export const exportData=s=>JSON.stringify({app:'karu-compagnon',version:VERSION,exportedAt:new Date().toISOString(),state:s},null,2);
