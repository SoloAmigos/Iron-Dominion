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

/* ===== Spatial Hash (cell = 3 tiles = 120px) ===== */
const SHCELL=TILE*3,SHCW=(WW/SHCELL+1)|0,SHCH=(WH/SHCELL+1)|0;
const _SH=new Array(SHCW*SHCH).fill(null).map(()=>[]);
let _shg=0;
function shClear(){for(const c of _SH)c.length=0}
function shInsert(e){
  const r=e.kind==='b'?entRad(e):(e.t?e.t.r+2:12);
  const x0=Math.max(0,((e.x-r)/SHCELL)|0),y0=Math.max(0,((e.y-r)/SHCELL)|0);
  const x1=Math.min(SHCW-1,((e.x+r)/SHCELL)|0),y1=Math.min(SHCH-1,((e.y+r)/SHCELL)|0);
  for(let cy=y0;cy<=y1;cy++)for(let cx=x0;cx<=x1;cx++)_SH[cy*SHCW+cx].push(e);
}
function shQuery(x,y,r){
  const gen=++_shg,res=[];
  const x0=Math.max(0,((x-r)/SHCELL)|0),y0=Math.max(0,((y-r)/SHCELL)|0);
  const x1=Math.min(SHCW-1,((x+r)/SHCELL)|0),y1=Math.min(SHCH-1,((y+r)/SHCELL)|0);
  for(let cy=y0;cy<=y1;cy++)for(let cx=x0;cx<=x1;cx++){
    for(const e of _SH[cy*SHCW+cx])if(e._shg!==gen){e._shg=gen;res.push(e)}
  }
  return res;
}
