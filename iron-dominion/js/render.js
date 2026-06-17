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
/* --- painter helpers --- */
function pPanel(g,x,y,w,h,base,light,dark){
  g.fillStyle=base;g.fillRect(x,y,w,h);
  g.fillStyle=light;g.fillRect(x,y,w,1.6);g.fillRect(x,y,1.6,h);
  g.fillStyle=dark;g.fillRect(x,y+h-1.6,w,1.6);g.fillRect(x+w-1.6,y,1.6,h);
}
function pBolts(g,x,y,w,h){
  g.fillStyle='rgba(0,0,0,.4)';
  g.fillRect(x+2,y+2,2,2);g.fillRect(x+w-4,y+2,2,2);
  g.fillRect(x+2,y+h-4,2,2);g.fillRect(x+w-4,y+h-4,2,2);
}
function pHazard(g,x,y,w,h){
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
  g.fillStyle='#c9a23a';g.fillRect(x,y,w,h);
  g.fillStyle='#1c1c14';
  for(let i=-h;i<w;i+=8){g.beginPath();g.moveTo(x+i,y+h);g.lineTo(x+i+h,y);g.lineTo(x+i+h+4,y);g.lineTo(x+i+4,y+h);g.closePath();g.fill()}
  g.restore();
}
function pWindows(g,x,y,n,lit){
  for(let i=0;i<n;i++){
    g.fillStyle='#10150e';g.fillRect(x+i*9,y,6.5,5.5);
    g.fillStyle=lit?'#ffd95e':'#2c3a44';g.fillRect(x+i*9+1,y+1,4.5,3.5);
    if(lit){g.fillStyle='rgba(255,217,94,.25)';g.fillRect(x+i*9-1,y-1,8.5,7.5)}
  }
}
function pShadow(g,x,y,w,h){
  g.fillStyle='rgba(0,0,0,.28)';
  g.beginPath();g.moveTo(x+4,y+5);g.lineTo(x+w+7,y+5);g.lineTo(x+w+7,y+h+8);g.lineTo(x+4,y+h+8);g.closePath();g.fill();
}
function pFoundation(g,X,Y,W,H){
  pPanel(g,X,Y,W,H,'#39413a','#4b554b','#262c25');
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1;
  g.strokeRect(X+3.5,Y+3.5,W-7,H-7);
  pBolts(g,X,Y,W,H);
}
function pStar(g,cx,cy,r){
  g.beginPath();
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;i?g.lineTo(px,py):g.moveTo(px,py)}
  g.closePath();g.fill();
}
