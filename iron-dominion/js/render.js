'use strict';
/* ================= RENDER (faction sprites) ================= */
const cv=document.getElementById('game'),ctx=cv.getContext('2d');
const mcv=document.getElementById('mini'),mctx=mcv.getContext('2d');
const BM=14;

function mkCv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
const SPR={};
function spr(key,w,h,fn){
  let s=SPR[key];
  if(!s){s=mkCv(Math.ceil(w*2),Math.ceil(h*2));const g=s.getContext('2d');g.scale(2,2);fn(g);s.lw=w;s.lh=h;SPR[key]=s}
  return s;
}
function facCol(fk){
  if(fk==='neutral')return l=>'hsl(90,12%,'+l+'%)';
  const F=FACTIONS[fk];return l=>'hsl('+F.h+','+F.sat+'%,'+l+'%)'
}
__PLACEHOLDER_DO_NOT_SEND__