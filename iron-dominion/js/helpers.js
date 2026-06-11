'use strict';
const idx=(x,y)=>y*MAPW+x;
const inB=(x,y)=>x>=0&&y>=0&&x<MAPW&&y<MAPH;
const TT=v=>Math.floor(v/TILE);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dist2=(a,b)=>{const dx=a.x-b.x,dy=a.y-b.y;return Math.sqrt(dx*dx+dy*dy)};
const rand=(a,b)=>a+Math.random()*(b-a);
function tileVisAt(x,y){const tx=TT(x),ty=TT(y);return inB(tx,ty)?vis[idx(tx,ty)]:0}
function formOff(i){
  if(!i)return[0,0];let r=1,c=i;
  while(c>8*r){c-=8*r;r++}
  const ang=(c/(8*r))*Math.PI*2;
  return[Math.cos(ang)*r*34,Math.sin(ang)*r*34];
}
function entRad(e){return e.kind==='b'?Math.max(e.t.w,e.t.h)*TILE*.45:e.t.r}
