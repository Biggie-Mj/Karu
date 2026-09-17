import {initial} from './data.js';
import {apply,clone,turnSnapshot,validateState,exportData,importData} from './engine.js';
export const KEY='karu-compagnon-v1:'+location.pathname.replace(/index\.html$/,'');
const BACKUP=KEY+':backup';
let state=initial(),undo=[],warning='',blocked=false;
const transactions=new Set();
try{const text=localStorage.getItem(KEY);if(text)state=importData(text);}catch(e){warning='La sauvegarde locale est illisible. Elle est conservée : exportez-la avant de la remplacer dans Réglages.';blocked=true;}
// A legacy save has no historic turn start; begin tracking from this opening.
if(!state.turnCheckpoint&&state.turn.phase==='active')state.turnCheckpoint=turnSnapshot(state);
export const getState=()=>state;
export const canUndo=()=>undo.length>0;
export const getWarning=()=>warning;
export const hasBackup=()=>{try{return !!localStorage.getItem(BACKUP)}catch{return false}};
export function persist(){if(blocked)return false;try{localStorage.setItem(KEY,exportData(state));warning='';return true;}catch{warning='Sauvegarde locale impossible : exportez votre partie pour ne pas perdre vos modifications.';return false;}}
export function dispatch(event){if(event.transactionId&&transactions.has(event.transactionId))return 'Opération déjà enregistrée.';const result=apply(state,event);if(event.transactionId){transactions.add(event.transactionId);if(transactions.size>300)transactions.delete(transactions.values().next().value);}undo.push(clone(state));if(undo.length>30)undo.shift();state=result.state;persist();return result.message;}
export function undoLast(){if(!undo.length)throw new Error('Rien à annuler.');transactions.clear();const current=state;state=undo.pop();state.notes=current.notes;state.categories=current.categories;state.settings=current.settings;state.updatedAt=new Date().toISOString();persist();return 'Dernière opération annulée.';}
export function updateContent(mutator){const next=clone(state);mutator(next);validateState(next);next.updatedAt=new Date().toISOString();state=next;persist();}
export function replaceState(next){validateState(next);try{localStorage.setItem(BACKUP,localStorage.getItem(KEY)||exportData(state));}catch{throw new Error('Impossible de conserver la sauvegarde précédente. Exportez-la avant le remplacement.');}state=clone(next);blocked=false;undo=[];transactions.clear();persist();}
export function restoreBackup(){const raw=localStorage.getItem(BACKUP);if(!raw)throw new Error('Aucune sauvegarde précédente.');replaceState(importData(raw));}
export const rawSave=()=>localStorage.getItem(KEY)||exportData(state);

