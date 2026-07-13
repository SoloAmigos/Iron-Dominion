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
/* ===== Faction-distinct Command Centers (bold archetypes) ===== */
function cmdVanguard(g,X,Y,W,H,C,ac,F){
  // Sleek high-tech glass HQ — stepped tower, blue glazing, helipad, comm spire
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+8,Y+H*.52,W-16,H*.4,C(30),C(40),C(18));            // glass concourse
  g.fillStyle='#15323f';for(let i=0;i<5;i++)g.fillRect(X+14+i*((W-28)/5),Y+H*.58,((W-28)/5)-4,H*.1);
  g.fillStyle='rgba(120,210,255,.5)';for(let i=0;i<5;i++)g.fillRect(X+14+i*((W-28)/5),Y+H*.58,((W-28)/5)-4,H*.035);
  pPanel(g,X+W*.28,Y+H*.16,W*.44,H*.42,C(34),C(44),C(20));      // tower tier 1
  pPanel(g,X+W*.34,Y+H*.08,W*.32,H*.2,C(38),C(48),C(24));       // tower tier 2
  g.fillStyle='rgba(120,210,255,.85)';g.fillRect(X+W*.46,Y+H*.1,W*.08,H*.44); // glowing core
  g.fillStyle='#26303c';g.beginPath();g.arc(X+W*.32,Y+H*.3,12,0,7);g.fill();  // radar pad
  g.fillStyle=C(30);g.beginPath();g.arc(X+W*.32,Y+H*.3,8,0,7);g.fill();
  g.fillStyle='#22303f';g.beginPath();g.arc(X+W*.74,Y+H*.74,16,0,7);g.fill(); // helipad
  g.strokeStyle='#7fd6ff';g.lineWidth=2;g.beginPath();g.arc(X+W*.74,Y+H*.74,12,0,7);g.stroke();
  g.fillStyle='#7fd6ff';g.font='bold 13px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('H',X+W*.74,Y+H*.74);
  g.strokeStyle='#bcd6e6';g.lineWidth=2;g.beginPath();g.moveTo(X+W*.5,Y+H*.08);g.lineTo(X+W*.5,Y-10);g.stroke(); // mast
  g.fillStyle=ac;g.beginPath();g.arc(X+W*.5,Y-10,2.6,0,7);g.fill();
  g.fillStyle='#0e1a22';g.fillRect(X+W*.42,Y+H*.82,W*.16,H*.1);  // entrance
  g.fillStyle=ac;g.fillRect(X+8,Y+H-8,W-16,4);
}
function cmdCrimson(g,X,Y,W,H,C,ac,F){
  // Brutalist red bunker — riveted iron mass, twin smokestacks, red star
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+H*.2,W-12,H*.72,C(26),C(33),C(14));pBolts(g,X+6,Y+H*.2,W-12,H*.72);
  pPanel(g,X+W*.14,Y+H*.06,W*.5,H*.32,C(30),C(38),C(16));pBolts(g,X+W*.14,Y+H*.06,W*.5,H*.32);
  g.fillStyle='#1a0e0c';for(let i=0;i<4;i++)g.fillRect(X+W*.18+i*W*.12,Y+H*.44,W*.07,H*.06); // slit windows
  g.fillStyle='rgba(255,90,60,.6)';for(let i=0;i<4;i++)g.fillRect(X+W*.18+i*W*.12,Y+H*.44,W*.07,H*.018);
  for(const sx of[X+W*.72,X+W*.84]){                              // twin smokestacks
    g.fillStyle=C(20);g.fillRect(sx,Y+H*.02,W*.07,H*.5);
    g.fillStyle=C(12);g.fillRect(sx,Y+H*.02,W*.07,H*.05);
    g.fillStyle='#3a2018';g.fillRect(sx-1,Y+H*.02,W*.09,4);
  }
  g.fillStyle=ac;pStar(g,X+W*.3,Y+H*.21,9);                       // red star
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();pStar(g,X+W*.3,Y+H*.21,9);g.fill();
  g.fillStyle=ac;pStar(g,X+W*.3,Y+H*.21,7);
  pHazard(g,X+W*.3,Y+H-14,W*.4,5);                                // armored entrance
  g.fillStyle='#160c0a';g.fillRect(X+W*.36,Y+H-12,W*.28,10);
  g.fillStyle=ac;g.fillRect(X+8,Y+H-7,W-16,4);
}
function cmdScorpion(g,X,Y,W,H,C,ac,F){
  // Scavenger scrap fortress — welded shanty, tarp roof, junk dish, scaffolding tower
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.62,W*.5,H*.42,0,0,7);g.fill();
  pPanel(g,X+W*.1,Y+H*.34,W*.54,H*.56,C(28),C(36),C(15));
  g.fillStyle='#6b4a2a';g.fillRect(X+W*.12,Y+H*.4,W*.2,H*.16);   // mismatched plates
  g.fillStyle='#7a5230';g.fillRect(X+W*.34,Y+H*.5,W*.16,H*.2);
  g.fillStyle=C(32);g.fillRect(X+W*.14,Y+H*.62,W*.18,H*.2);
  g.strokeStyle='rgba(120,60,20,.5)';g.lineWidth=1.4;             // rust streaks
  for(let i=0;i<4;i++){g.beginPath();g.moveTo(X+W*.16+i*W*.12,Y+H*.4);g.lineTo(X+W*.16+i*W*.12,Y+H*.86);g.stroke()}
  g.fillStyle='#5a4a30';g.beginPath();g.moveTo(X+W*.08,Y+H*.36);g.lineTo(X+W*.4,Y+H*.22);g.lineTo(X+W*.68,Y+H*.34);g.lineTo(X+W*.66,Y+H*.4);g.lineTo(X+W*.1,Y+H*.42);g.closePath();g.fill(); // tarp roof
  g.strokeStyle='#3a3018';g.lineWidth=1;for(let i=0;i<6;i++){g.beginPath();g.moveTo(X+W*.1+i*W*.1,Y+H*.41);g.lineTo(X+W*.12+i*W*.1,Y+H*.26);g.stroke()}
  g.strokeStyle=C(22);g.lineWidth=2.4;g.strokeRect(X+W*.7,Y+H*.3,W*.18,H*.58); // scaffolding tower
  g.beginPath();g.moveTo(X+W*.7,Y+H*.3);g.lineTo(X+W*.88,Y+H*.88);g.moveTo(X+W*.88,Y+H*.3);g.lineTo(X+W*.7,Y+H*.88);g.stroke();
  g.fillStyle='#3a4034';g.beginPath();g.arc(X+W*.79,Y+H*.26,10,Math.PI*.8,Math.PI*2.1);g.fill(); // junk dish
  g.strokeStyle='#888';g.lineWidth=1;g.beginPath();g.moveTo(X+W*.79,Y+H*.26);g.lineTo(X+W*.79,Y+H*.3);g.stroke();
  g.fillStyle='#7a3a20';g.beginPath();g.arc(X+W*.18,Y+H*.9,5,0,7);g.fill();   // barrels + tire
  g.fillStyle='#9c4f2a';g.beginPath();g.arc(X+W*.28,Y+H*.92,5,0,7);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(X+W*.4,Y+H*.92,5,0,7);g.fill();
  g.strokeStyle='#888';g.lineWidth=1.6;g.beginPath();g.moveTo(X+W*.4,Y+H*.22);g.lineTo(X+W*.42,Y-6);g.stroke(); // scrap flag
  g.fillStyle=ac;g.beginPath();g.moveTo(X+W*.42,Y-6);g.lineTo(X+W*.56,Y-2);g.lineTo(X+W*.42,Y+6);g.closePath();g.fill();
}
function cmdNorthwind(g,X,Y,W,H,C,ac,F){
  // Angular stone/ice keep — crenellated battlements, corner towers, frost accents
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+H*.42,W-12,H*.5,C(28),C(36),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;                  // stone blocks
  for(let r=0;r<3;r++){const yy=Y+H*.42+r*H*.16;g.beginPath();g.moveTo(X+6,yy);g.lineTo(X+W-6,yy);g.stroke();
    for(let c=0;c<5;c++){const xx=X+10+c*((W-20)/5)+(r%2?((W-20)/10):0);g.beginPath();g.moveTo(xx,yy);g.lineTo(xx,yy+H*.16);g.stroke()}}
  pPanel(g,X+W*.32,Y+H*.12,W*.36,H*.4,C(32),C(42),C(18));        // central keep
  for(const tx of[X+W*.1,X+W*.74]){                              // corner towers
    pPanel(g,tx,Y+H*.2,W*.16,H*.32,C(30),C(40),C(16));
    g.fillStyle=C(34);for(let i=0;i<3;i++)g.fillRect(tx+i*W*.06,Y+H*.16,W*.04,H*.06);
  }
  g.fillStyle=C(36);for(let i=0;i<5;i++)g.fillRect(X+W*.32+i*W*.073,Y+H*.08,W*.045,H*.05); // keep crenellations
  g.fillStyle='#0c2a28';for(let i=0;i<3;i++)g.fillRect(X+W*.38+i*W*.08,Y+H*.24,W*.03,H*.12); // arrow slits
  g.fillStyle='rgba(120,255,235,.5)';for(let i=0;i<3;i++)g.fillRect(X+W*.38+i*W*.08,Y+H*.24,W*.03,H*.04);
  g.fillStyle='rgba(180,245,240,.7)';                            // icicles
  for(let i=0;i<6;i++){const ix=X+W*.34+i*W*.06;g.beginPath();g.moveTo(ix,Y+H*.13);g.lineTo(ix+3,Y+H*.13);g.lineTo(ix+1.5,Y+H*.2);g.closePath();g.fill()}
  g.strokeStyle='#cfe';g.lineWidth=1.6;g.beginPath();g.moveTo(X+W*.5,Y+H*.08);g.lineTo(X+W*.5,Y-12);g.stroke(); // banner
  g.fillStyle=ac;g.fillRect(X+W*.5,Y-12,W*.12,H*.08);
  g.fillStyle='#0c1a1a';g.beginPath();g.moveTo(X+W*.44,Y+H-4);g.lineTo(X+W*.44,Y+H*.78);g.quadraticCurveTo(X+W*.5,Y+H*.72,X+W*.56,Y+H*.78);g.lineTo(X+W*.56,Y+H-4);g.closePath();g.fill(); // gate
  g.fillStyle=ac;g.fillRect(X+8,Y+H-7,W-16,4);
}
function cmdNeutral(g,X,Y,W,H,C,ac,F){
  pFoundation(g,X,Y,W,H);
  g.fillStyle='#2e352c';g.beginPath();g.arc(X+W-26,Y+H-26,18,0,7);g.fill();
  g.strokeStyle='#737d68';g.lineWidth=2;g.beginPath();g.arc(X+W-26,Y+H-26,14,0,7);g.stroke();
  g.fillStyle='#9aa48c';g.font='bold 14px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('H',X+W-26,Y+H-25);
  pPanel(g,X+8,Y+8,W*.62,H*.56,C(31),C(38),C(19));
  g.strokeStyle='rgba(0,0,0,.22)';
  for(let i=1;i<3;i++){g.beginPath();g.moveTo(X+8,Y+8+H*.56*i/3);g.lineTo(X+8+W*.62,Y+8+H*.56*i/3);g.stroke()}
  pPanel(g,X+16,Y+14,16,12,C(36),C(43),C(24));
  g.fillStyle='#2b3128';g.beginPath();g.arc(X+24,Y+20,4,0,7);g.fill();
  g.fillStyle='#30372d';g.beginPath();g.arc(X+W*.62,Y+H*.34,15,0,7);g.fill();
  g.fillStyle=C(28);g.beginPath();g.arc(X+W*.62,Y+H*.34,10,0,7);g.fill();
  pPanel(g,X+W*.66,Y+14,W*.28,H*.42,C(28),C(35),C(17));
  pWindows(g,X+W*.68,Y+22,3,true);pWindows(g,X+W*.68,Y+36,3,true);
  pHazard(g,X+W*.26,Y+H-16,W*.34,5);
  g.fillStyle='#171d15';g.fillRect(X+W*.30,Y+H-11,W*.26,9);
  g.fillStyle=ac;g.fillRect(X+W*.30,Y+H-11,W*.26,2);
  g.fillStyle=ac;g.fillRect(X+8,Y+H-7,26,4);
}
function cmdAddon(g,X,Y,W,H,C,ac,gen){
  // Sub-faction specialist add-on (parent CC stays recognizable)
  if(gen==='air'){
    pPanel(g,X+W*.02,Y+H*.5,W*.2,H*.4,C(34),C(44),C(20));
    g.fillStyle='#7fd6ff';g.fillRect(X+W*.04,Y+H*.54,W*.16,H*.035);
    g.strokeStyle='#ccc';g.lineWidth=1.4;g.beginPath();g.moveTo(X+W*.13,Y+H*.5);g.lineTo(X+W*.13,Y+H*.4);g.stroke();
    g.fillStyle='#ff7a3a';g.beginPath();g.moveTo(X+W*.13,Y+H*.4);g.lineTo(X+W*.22,Y+H*.42);g.lineTo(X+W*.22,Y+H*.46);g.lineTo(X+W*.13,Y+H*.46);g.closePath();g.fill();
    g.fillStyle='#ffd95e';for(let i=0;i<3;i++){g.beginPath();g.arc(X+W*.05+i*W*.06,Y+H*.9,1.6,0,7);g.fill()}
  }else if(gen==='inf'){
    pPanel(g,X+W*.02,Y+H*.58,W*.22,H*.32,C(30),C(38),C(16));
    g.fillStyle=C(22);g.fillRect(X+W*.04,Y+H*.62,W*.18,H*.035);
    g.fillStyle='#5a5132';g.beginPath();g.moveTo(X+W*.04,Y+H*.92);g.lineTo(X+W*.1,Y+H*.82);g.lineTo(X+W*.16,Y+H*.92);g.closePath();g.fill();
    g.strokeStyle='#888';g.lineWidth=1;g.beginPath();g.moveTo(X+W*.02,Y+H*.56);g.lineTo(X+W*.24,Y+H*.5);g.stroke();
    g.fillStyle=ac;for(let i=0;i<3;i++)g.fillRect(X+W*.06+i*W*.06,Y+H*.52,W*.03,H*.04);
  }else if(gen==='toxin'){
    for(const tx of[X+W*.04,X+W*.16]){
      g.fillStyle=C(24);g.beginPath();g.ellipse(tx+W*.04,Y+H*.74,W*.05,H*.16,0,0,7);g.fill();
      g.fillStyle='rgba(120,220,60,.4)';g.fillRect(tx+W*.02,Y+H*.62,W*.04,H*.06);
    }
    g.fillStyle='rgba(120,220,60,.5)';g.beginPath();g.arc(X+W*.1,Y+H*.58,6,0,7);g.fill();
    g.strokeStyle='#4a6a2a';g.lineWidth=2;g.beginPath();g.moveTo(X+W*.1,Y+H*.62);g.lineTo(X+W*.1,Y+H*.74);g.stroke();
  }else if(gen==='def'){
    pPanel(g,X+W*.02,Y+H*.62,W*.24,H*.28,C(30),C(40),C(16));
    pHazard(g,X+W*.02,Y+H*.58,W*.24,4);
    g.fillStyle=C(20);g.beginPath();g.arc(X+W*.14,Y+H*.66,9,Math.PI,0);g.fill();
    g.fillStyle=C(10);g.fillRect(X+W*.14,Y+H*.645,W*.14,3);
    g.fillStyle='#6b6038';for(let i=0;i<4;i++){g.beginPath();g.ellipse(X+W*.04+i*W*.05,Y+H*.9,W*.03,H*.02,0,0,7);g.fill()}
  }
}
/* ===== Faction-distinct Power Plants ===== */
function pwrVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+6,Y+10,W-12,H-18,C(28),C(38),C(16));
  g.fillStyle='#0a2230';g.beginPath();g.arc(X+W/2,Y+H*.46,15,0,7);g.fill();
  g.fillStyle='rgba(120,210,255,.9)';g.beginPath();g.arc(X+W/2,Y+H*.46,9,0,7);g.fill();
  g.strokeStyle='#7fd6ff';g.lineWidth=2;g.beginPath();g.arc(X+W/2,Y+H*.46,15,0,7);g.stroke();
  g.strokeStyle=C(44);g.lineWidth=3;
  g.beginPath();g.moveTo(X+10,Y+H-14);g.lineTo(X+W/2-14,Y+H*.46);g.moveTo(X+W-10,Y+H-14);g.lineTo(X+W/2+14,Y+H*.46);g.stroke();
  g.fillStyle=ac;g.fillRect(X+4,Y+4,12,4);g.fillRect(X+W-16,Y+4,12,4);
}
function pwrCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+H*.4,W-12,H*.55,C(26),C(34),C(14));pBolts(g,X+6,Y+H*.4,W-12,H*.55);
  g.fillStyle=C(20);g.fillRect(X+W*.6,Y+2,W*.22,H*.5);
  g.fillStyle='#3a2018';g.fillRect(X+W*.6-1,Y+2,W*.24,4);
  g.fillStyle=C(30);g.beginPath();g.moveTo(X+W*.2,Y+H*.4);g.lineTo(X+W*.5,Y+H*.4);g.lineTo(X+W*.42,Y+H*.2);g.lineTo(X+W*.28,Y+H*.2);g.closePath();g.fill();
  g.fillStyle='#2a140c';g.fillRect(X+W*.16,Y+H*.56,W*.3,H*.28);
  g.fillStyle='rgba(255,130,40,.85)';g.fillRect(X+W*.18,Y+H*.59,W*.26,H*.2);
  g.fillStyle=ac;g.fillRect(X+6,Y+H-7,W-12,3);
}
function pwrScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.6,W*.46,H*.4,0,0,7);g.fill();
  pPanel(g,X+W*.14,Y+H*.42,W*.52,H*.46,C(28),C(36),C(15));
  g.fillStyle='#6b4a2a';g.fillRect(X+W*.18,Y+H*.48,W*.2,H*.18);
  g.strokeStyle=C(22);g.lineWidth=4;g.lineCap='round';
  g.beginPath();g.moveTo(X+W*.58,Y+H*.44);g.lineTo(X+W*.58,Y+H*.2);g.lineTo(X+W*.74,Y+H*.2);g.stroke();g.lineCap='butt';
  g.fillStyle='#7a3a20';g.fillRect(X+W*.7,Y+H*.58,W*.14,H*.2);
  g.fillStyle='#c9a23a';g.fillRect(X+W*.73,Y+H*.6,W*.04,H*.05);
  g.fillStyle=ac;g.fillRect(X+W*.14,Y+H-8,W*.3,3);
}
function pwrNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+H*.34,W-12,H*.6,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let r=0;r<2;r++){const yy=Y+H*.34+r*H*.3;g.beginPath();g.moveTo(X+6,yy);g.lineTo(X+W-6,yy);g.stroke()}
  g.fillStyle='#0c2a28';g.beginPath();g.arc(X+W/2,Y+H*.34,12,Math.PI,0);g.closePath();g.fill();
  g.fillStyle='rgba(120,255,235,.7)';g.beginPath();g.arc(X+W/2,Y+H*.34,7,Math.PI,0);g.closePath();g.fill();
  g.fillStyle=C(34);for(let i=0;i<3;i++)g.fillRect(X+10+i*((W-20)/3),Y+H*.3,(W-20)/6,5);
  g.fillStyle=ac;g.fillRect(X+6,Y+H-7,W-12,3);
}
/* ===== Faction-distinct Barracks ===== */

function barVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+8,Y+12,W-16,H-22,C(28),C(38),C(16));
  g.fillStyle='rgba(120,210,255,.5)';g.fillRect(X+12,Y+18,W-24,6);
  g.fillStyle='#15323f';g.fillRect(X+W*.42,Y+H-26,W*.16,20);
  g.fillStyle=ac;g.fillRect(X+W*.42,Y+H-26,W*.16,2.5);
  pWindows(g,X+16,Y+H-28,3,true);
  g.strokeStyle='#bcd6e6';g.lineWidth=1.6;g.beginPath();g.moveTo(X+14,Y+14);g.lineTo(X+14,Y-8);g.stroke();
  g.fillStyle=ac;g.fillRect(X+8,Y+8,14,4);
}
function barCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+16,W-12,H-24,C(26),C(34),C(14));pBolts(g,X+6,Y+16,W-12,H-24);
  g.fillStyle='#1a0e0c';for(let i=0;i<4;i++)g.fillRect(X+18+i*W*.2,Y+30,W*.1,H*.16);
  g.fillStyle='rgba(255,90,60,.55)';for(let i=0;i<4;i++)g.fillRect(X+18+i*W*.2,Y+30,W*.1,4);
  g.fillStyle='#160c0a';g.fillRect(X+W*.42,Y+H-22,W*.16,16);
  // sandbags
  g.fillStyle='#6b6038';for(let i=0;i<5;i++){g.beginPath();g.ellipse(X+16+i*((W-30)/4),Y+H-8,8,4,0,0,7);g.fill()}
  // banner pole
  g.strokeStyle=C(40);g.lineWidth=1.8;g.beginPath();g.moveTo(X+W-16,Y+18);g.lineTo(X+W-16,Y-10);g.stroke();
  g.fillStyle=ac;g.fillRect(X+W-16,Y-10,W*.12,H*.18);
}
function barScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.6,W*.52,H*.5,0,0,7);g.fill();
  // tents
  for(let i=0;i<3;i++){const tx=X+14+i*W*.3;
    g.fillStyle=i%2?'#5a5132':'#6b5e38';g.beginPath();g.moveTo(tx,Y+H-12);g.lineTo(tx+W*.12,Y+H*.4);g.lineTo(tx+W*.24,Y+H-12);g.closePath();g.fill();
    g.strokeStyle='#3a3018';g.lineWidth=1;g.beginPath();g.moveTo(tx+W*.12,Y+H*.4);g.lineTo(tx+W*.12,Y+H-12);g.stroke();}
  // scrap shelter + campfire
  g.fillStyle=C(26);g.fillRect(X+W*.62,Y+H*.42,W*.3,H*.4);
  g.fillStyle='rgba(255,140,40,.8)';g.beginPath();g.arc(X+W*.2,Y+H-10,5,0,7);g.fill();
  g.fillStyle=ac;g.fillRect(X+W*.62,Y+H-8,W*.2,3);
}
function barNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+18,W-12,H-26,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let c=0;c<6;c++){const xx=X+8+c*((W-16)/6);g.beginPath();g.moveTo(xx,Y+18);g.lineTo(xx,Y+H-8);g.stroke()}
  g.beginPath();g.moveTo(X+6,Y+H*.55);g.lineTo(X+W-6,Y+H*.55);g.stroke();
  g.fillStyle=C(34);for(let i=0;i<6;i++)g.fillRect(X+10+i*((W-20)/6),Y+12,(W-20)/12,6); // crenellations
  g.fillStyle='#0c1a1a';g.fillRect(X+W*.44,Y+H-22,W*.12,16);
  // shields on wall
  g.fillStyle=ac;for(let i=0;i<3;i++){g.beginPath();g.arc(X+W*.2+i*W*.3,Y+H*.4,6,0,7);g.fill()}
  g.strokeStyle='#cfe';g.lineWidth=1.6;g.beginPath();g.moveTo(X+14,Y+14);g.lineTo(X+14,Y-10);g.stroke();
  g.fillStyle=ac;g.fillRect(X+14,Y-10,W*.1,H*.16);
}
/* ===== Faction-distinct War Factories ===== */
function factVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+8,Y+8,W-16,H-22,C(30),C(38),C(18));
  // glass control booth (top-right)
  pPanel(g,X+W-30,Y+4,24,26,C(34),C(44),C(20));
  g.fillStyle='rgba(120,210,255,.6)';g.fillRect(X+W-27,Y+8,18,8);
  g.fillStyle=ac;g.fillRect(X+W-30,Y+4,24,3);
  // robotic gantry arm
  g.strokeStyle=C(46);g.lineWidth=3;g.lineCap='round';
  g.beginPath();g.moveTo(X+20,Y+22);g.lineTo(X+W*.5,Y+22);g.lineTo(X+W*.6,Y+H*.5);g.stroke();g.lineCap='butt';
  g.fillStyle='#7fd6ff';g.beginPath();g.arc(X+W*.6,Y+H*.5,4,0,7);g.fill();
  // blue energy bay door (bottom-center)
  g.fillStyle='#0e2230';g.fillRect(X+W*.30,Y+H-18,W*.40,15);
  g.fillStyle='rgba(120,210,255,.4)';g.fillRect(X+W*.30,Y+H-18,W*.40,3);
  g.fillStyle=ac;g.fillRect(X+8,Y+H-8,20,4);
}
function factCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+18,W-12,H-26,C(26),C(34),C(14));pBolts(g,X+6,Y+18,W-12,H-26);
  // twin smokestacks (top-right anchor for smoke overlay)
  g.fillStyle=C(20);g.fillRect(X+W-30,Y+2,11,26);g.fillRect(X+W-16,Y+2,11,20);
  g.fillStyle='#3a2018';g.fillRect(X+W-31,Y+2,13,4);g.fillRect(X+W-17,Y+2,13,4);
  // overhead crane rail
  g.strokeStyle='#8a8f7c';g.lineWidth=2.6;g.beginPath();g.moveTo(X+16,Y+26);g.lineTo(X+W*.6,Y+26);g.stroke();
  g.fillStyle=C(30);g.fillRect(X+W*.35,Y+24,10,6);
  // molten foundry door (bottom-center)
  g.fillStyle='#2a140c';g.fillRect(X+W*.30,Y+H-18,W*.40,15);
  g.fillStyle='rgba(255,130,40,.85)';g.fillRect(X+W*.32,Y+H-15,W*.36,9);
  pHazard(g,X+W*.28,Y+H-22,W*.44,4);
  g.fillStyle=ac;g.fillRect(X+8,Y+H-8,20,4);
}
function factScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.6,W*.5,H*.46,0,0,7);g.fill();
  pPanel(g,X+W*.08,Y+H*.34,W*.6,H*.56,C(28),C(36),C(15));
  // mismatched plates + rust
  g.fillStyle='#6b4a2a';g.fillRect(X+W*.12,Y+H*.4,W*.22,H*.2);
  g.fillStyle='#7a5230';g.fillRect(X+W*.38,Y+H*.46,W*.2,H*.24);
  // scaffolding crane (right)
  g.strokeStyle=C(22);g.lineWidth=2.4;g.strokeRect(X+W*.7,Y+H*.24,W*.2,H*.62);
  g.beginPath();g.moveTo(X+W*.7,Y+H*.24);g.lineTo(X+W*.9,Y+H*.86);g.moveTo(X+W*.9,Y+H*.24);g.lineTo(X+W*.7,Y+H*.86);g.stroke();
  // exhaust pipe top-right
  g.fillStyle=C(20);g.fillRect(X+W-22,Y+4,10,22);
  // tarp + door
  g.fillStyle='#5a4a30';g.beginPath();g.moveTo(X+W*.06,Y+H*.36);g.lineTo(X+W*.4,Y+H*.24);g.lineTo(X+W*.7,Y+H*.34);g.lineTo(X+W*.68,Y+H*.4);g.lineTo(X+W*.08,Y+H*.42);g.closePath();g.fill();
  g.fillStyle='#171d16';g.fillRect(X+W*.30,Y+H-18,W*.40,15);
  g.fillStyle=ac;g.fillRect(X+W*.08,Y+H-8,20,4);
}
function factNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+20,W-12,H-28,C(28),C(37),C(16));
  // stone courses
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let r=0;r<3;r++){const yy=Y+20+r*((H-28)/3);g.beginPath();g.moveTo(X+6,yy);g.lineTo(X+W-6,yy);g.stroke();
    for(let c=0;c<6;c++){const xx=X+10+c*((W-20)/6)+(r%2?((W-20)/12):0);g.beginPath();g.moveTo(xx,yy);g.lineTo(xx,yy+(H-28)/3);g.stroke()}}
  // crenellations
  g.fillStyle=C(34);for(let i=0;i<7;i++)g.fillRect(X+8+i*((W-16)/7),Y+14,(W-16)/14,6);
  // chimney stack top-right + frost vent
  g.fillStyle=C(24);g.fillRect(X+W-26,Y+2,12,20);
  g.fillStyle='rgba(120,255,235,.5)';g.fillRect(X+W*.16,Y+H*.4,W*.14,H*.1);
  // forge door glow (bottom-center)
  g.fillStyle='#0c1a1a';g.fillRect(X+W*.30,Y+H-18,W*.40,15);
  g.fillStyle='rgba(255,150,60,.7)';g.fillRect(X+W*.33,Y+H-15,W*.34,8);
  g.fillStyle=ac;g.fillRect(X+8,Y+H-8,20,4);
}
/* ===== Faction-distinct Supply Centers ===== */
function supVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+8,Y+10,W-16,H-22,C(30),C(40),C(18));
  for(let r=0;r<2;r++)for(let c=0;c<4;c++){
    g.fillStyle=(r+c)%2?'#2a5566':'#1f4250';g.fillRect(X+14+c*((W-28)/4),Y+18+r*((H-44)/2),((W-28)/4)-3,((H-44)/2)-3);
    g.fillStyle='rgba(120,210,255,.35)';g.fillRect(X+14+c*((W-28)/4),Y+18+r*((H-44)/2),((W-28)/4)-3,3);
  }
  g.fillStyle='#15323f';g.fillRect(X+W*.34,Y+H-20,W*.32,16);
  g.fillStyle=ac;g.fillRect(X+W*.34,Y+H-20,W*.32,2.5);
  g.strokeStyle='#bcd6e6';g.lineWidth=1.6;g.beginPath();g.moveTo(X+14,Y+12);g.lineTo(X+14,Y-8);g.stroke();
  g.fillStyle=ac;g.fillRect(X+8,Y+6,14,4);
}
function supCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+14,W-12,H-22,C(26),C(34),C(14));pBolts(g,X+6,Y+14,W-12,H-22);
  pHazard(g,X+6,Y+H-14,W-12,5);
  for(let i=0;i<4;i++){g.fillStyle='#6b5a2a';g.fillRect(X+14+i*((W-28)/4),Y+H-36-((i%2)*6),((W-28)/4)-4,22);
    g.fillStyle='#8a6a22';g.fillRect(X+14+i*((W-28)/4),Y+H-36-((i%2)*6),((W-28)/4)-4,4);}
  g.strokeStyle='#8a8f7c';g.lineWidth=3;g.beginPath();g.moveTo(X+W-16,Y+8);g.lineTo(X+W-16,Y+30);g.lineTo(X+W-44,Y+12);g.stroke();
  g.fillStyle=ac;pStar(g,X+W*.22,Y+H*.3,7);
  g.fillStyle=ac;g.fillRect(X+6,Y+H-7,W-12,3);
}
function supScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.6,W*.5,H*.46,0,0,7);g.fill();
  pPanel(g,X+W*.1,Y+H*.3,W*.6,H*.58,C(28),C(36),C(15));
  g.fillStyle='#5a4a30';g.beginPath();g.moveTo(X+W*.06,Y+H*.32);g.lineTo(X+W*.4,Y+H*.2);g.lineTo(X+W*.72,Y+H*.3);g.lineTo(X+W*.7,Y+H*.36);g.lineTo(X+W*.08,Y+H*.38);g.closePath();g.fill();
  g.fillStyle='#6b4a2a';g.fillRect(X+W*.14,Y+H*.5,W*.18,H*.3);
  g.fillStyle='#7a5230';g.fillRect(X+W*.36,Y+H*.56,W*.16,H*.26);
  g.fillStyle='#7a3a20';g.beginPath();g.arc(X+W*.78,Y+H*.66,7,0,7);g.fill();
  g.fillStyle='#9c4f2a';g.beginPath();g.arc(X+W*.86,Y+H*.74,6,0,7);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(X+W*.7,Y+H*.84,5,0,7);g.fill();
  g.fillStyle=ac;g.fillRect(X+W*.1,Y+H-8,W*.3,3);
}
function supNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+6,Y+16,W-12,H-24,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let r=0;r<3;r++){const yy=Y+16+r*((H-24)/3);g.beginPath();g.moveTo(X+6,yy);g.lineTo(X+W-6,yy);g.stroke()}
  g.fillStyle=C(34);for(let i=0;i<6;i++)g.fillRect(X+10+i*((W-20)/6),Y+10,(W-20)/12,6);
  for(let i=0;i<3;i++){g.fillStyle='#4a5a52';g.fillRect(X+16+i*((W-32)/3),Y+H-34,((W-32)/3)-4,24);
    g.fillStyle='rgba(220,245,240,.6)';g.fillRect(X+16+i*((W-32)/3),Y+H-34,((W-32)/3)-4,4);}
  g.strokeStyle='#cfe';g.lineWidth=1.6;g.beginPath();g.moveTo(X+14,Y+12);g.lineTo(X+14,Y-10);g.stroke();
  g.fillStyle=ac;g.fillRect(X+14,Y-10,W*.1,H*.2);
  g.fillStyle=ac;g.fillRect(X+6,Y+H-7,W-12,3);
}
/* ===== Faction-distinct Tech Labs ===== */
function techVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+3,Y+3,W-6,H-6,C(27),C(34),C(13));
  g.fillStyle='#10181c';g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.34,0,7);g.fill();
  const dg=g.createRadialGradient(X+W*.27,Y+H*.44,2,X+W*.3,Y+H*.5,H*.34);
  dg.addColorStop(0,'#9fe9ff');dg.addColorStop(.55,'#2e7d96');dg.addColorStop(1,'#143641');
  g.fillStyle=dg;g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.3,0,7);g.fill();
  g.strokeStyle='#0c2228';g.lineWidth=1.2;g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.3,0,7);g.stroke();
  g.beginPath();g.moveTo(X+W*.3-H*.3,Y+H*.5);g.lineTo(X+W*.3+H*.3,Y+H*.5);g.stroke();
  g.beginPath();g.moveTo(X+W*.3,Y+H*.5-H*.3);g.lineTo(X+W*.3,Y+H*.5+H*.3);g.stroke();
  g.fillStyle=C(20);g.fillRect(X+W*.58,Y+8,W*.34,H-16);
  g.strokeStyle='#aeb8a4';g.lineWidth=1.6;
  for(let i=0;i<3;i++){const axx=X+W*.64+i*W*.1;g.beginPath();g.moveTo(axx,Y+H*.55);g.lineTo(axx,Y+2-i*3);g.stroke();g.fillStyle='#7fd6ff';g.beginPath();g.arc(axx,Y+2-i*3,1.6,0,7);g.fill();}
  g.fillStyle=ac;g.fillRect(X+5,Y+5,W*.16,4);
}
function techCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+5,Y+10,W-10,H-16,C(26),C(34),C(14));pBolts(g,X+5,Y+10,W-10,H-16);
  g.fillStyle='#2a140c';g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.3,0,7);g.fill();
  g.fillStyle='rgba(255,90,50,.85)';g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.2,0,7);g.fill();
  g.strokeStyle=C(16);g.lineWidth=2;g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.3,0,7);g.stroke();
  g.fillStyle=C(20);g.fillRect(X+W*.66,Y+4,W*.1,H*.5);g.fillRect(X+W*.8,Y+4,W*.1,H*.4);
  g.fillStyle='#3a2018';g.fillRect(X+W*.66-1,Y+4,W*.12,4);
  g.fillStyle=ac;pStar(g,X+W*.74,Y+H*.72,6);
  g.fillStyle=ac;g.fillRect(X+5,Y+H-7,W*.3,3);
}
function techScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.62,W*.46,H*.42,0,0,7);g.fill();
  pPanel(g,X+W*.08,Y+H*.34,W*.5,H*.56,C(28),C(36),C(15));
  g.fillStyle='#1a2a12';g.beginPath();g.arc(X+W*.3,Y+H*.55,H*.26,0,7);g.fill();
  g.fillStyle='rgba(120,220,60,.7)';g.beginPath();g.arc(X+W*.3,Y+H*.55,H*.16,0,7);g.fill();
  g.fillStyle='#3a4034';g.beginPath();g.arc(X+W*.74,Y+H*.34,12,Math.PI*.8,Math.PI*2.1);g.fill();
  g.strokeStyle='#888';g.lineWidth=1.4;g.beginPath();g.moveTo(X+W*.74,Y+H*.34);g.lineTo(X+W*.74,Y+H*.5);g.stroke();
  g.fillStyle='#6b4a2a';g.fillRect(X+W*.6,Y+H*.6,W*.16,H*.24);
  g.fillStyle=ac;g.fillRect(X+W*.08,Y+H-8,W*.3,3);
}
function techNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+5,Y+14,W-10,H-20,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let c=0;c<6;c++){const xx=X+8+c*((W-16)/6);g.beginPath();g.moveTo(xx,Y+14);g.lineTo(xx,Y+H-6);g.stroke()}
  g.fillStyle='#0c2a28';g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.32,Math.PI,0);g.closePath();g.fill();
  g.fillStyle='rgba(120,255,235,.55)';g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.24,Math.PI,0);g.closePath();g.fill();
  g.strokeStyle='rgba(180,245,240,.7)';g.lineWidth=1.4;g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.32,Math.PI,0);g.stroke();
  g.strokeStyle=C(14);g.lineWidth=2;g.beginPath();g.moveTo(X+W*.3,Y+H*.5);g.lineTo(X+W*.3+10,Y+H*.5-18);g.stroke();
  pPanel(g,X+W*.6,Y+18,W*.34,H-26,C(30),C(40),C(16));
  g.fillStyle=C(34);for(let i=0;i<4;i++)g.fillRect(X+W*.6+i*W*.085,Y+14,W*.04,5);
  g.fillStyle=ac;g.fillRect(X+5,Y+H-7,W*.3,3);
}
/* ===== Faction-distinct Markets ===== */
function mktVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+6,Y+10,W-12,H-18,C(30),C(40),C(18));
  g.fillStyle='#0e2230';g.fillRect(X+4,Y+2,W-8,10);
  for(let i=0;i<6;i++){g.fillStyle=i%2?ac:'rgba(120,210,255,.5)';g.fillRect(X+6+i*(W-12)/6,Y+3,(W-12)/6-1,6);}
  for(let i=0;i<3;i++){g.fillStyle=C(26+i*4);g.fillRect(X+10+i*((W-20)/3),Y+H-28,((W-20)/3)-3,20);
    g.fillStyle='rgba(120,210,255,.25)';g.fillRect(X+10+i*((W-20)/3),Y+H-28,((W-20)/3)-3,4);}
  g.fillStyle='#0c1a20';g.fillRect(X+W*.55,Y+22,W*.3,H*.3);
  g.fillStyle='rgba(120,210,255,.5)';g.fillRect(X+W*.57,Y+24,W*.26,H*.26);
  g.fillStyle=ac;g.fillRect(X+5,Y+H-6,18,4);
}
function mktCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+5,Y+12,W-10,H-18,C(26),C(34),C(14));pBolts(g,X+5,Y+12,W-10,H-18);
  pHazard(g,X+5,Y+2,W-10,10);
  g.strokeStyle='#3a2018';g.lineWidth=2.4;
  for(let i=0;i<5;i++){g.beginPath();g.moveTo(X+10+i*(W-20)/5,Y+14);g.lineTo(X+10+i*(W-20)/5,Y+H-12);g.stroke();}
  for(let i=0;i<3;i++){g.fillStyle='#6b5a2a';g.beginPath();g.ellipse(X+14+i*((W-28)/2.5),Y+H-14,8,5,0,0,7);g.fill();
    g.fillStyle='rgba(255,140,40,.8)';g.beginPath();g.ellipse(X+14+i*((W-28)/2.5),Y+H-18,5,2.5,0,0,7);g.fill();}
  g.fillStyle=ac;pStar(g,X+W*.7,Y+H*.4,6);
  g.fillStyle=ac;g.fillRect(X+5,Y+H-6,W-10,3);
}
function mktScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.6,W*.54,H*.5,0,0,7);g.fill();
  pPanel(g,X+W*.08,Y+H*.28,W*.58,H*.56,C(28),C(36),C(15));
  g.fillStyle='#5a4a30';g.beginPath();g.moveTo(X+W*.04,Y+H*.3);g.lineTo(X+W*.38,Y+H*.18);g.lineTo(X+W*.68,Y+H*.28);g.lineTo(X+W*.66,Y+H*.34);g.lineTo(X+W*.06,Y+H*.36);g.closePath();g.fill();
  g.fillStyle='#6b4a2a';g.fillRect(X+W*.12,Y+H*.52,W*.2,H*.22);
  g.fillStyle='#8a6a2a';g.beginPath();g.ellipse(X+W*.72,Y+H*.66,11,8,0,0,7);g.fill();
  g.fillStyle='rgba(255,140,40,.6)';g.beginPath();g.arc(X+W*.18,Y+H*.84,5,0,7);g.fill();
  g.fillStyle=ac;g.fillRect(X+W*.08,Y+H-7,W*.3,3);
}
function mktNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+5,Y+14,W-10,H-20,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let r=0;r<3;r++){const yy=Y+14+r*(H-20)/3;g.beginPath();g.moveTo(X+5,yy);g.lineTo(X+W-5,yy);g.stroke();}
  g.fillStyle=C(34);for(let i=0;i<5;i++)g.fillRect(X+8+i*(W-16)/5,Y+8,(W-16)/10,6);
  g.fillStyle='rgba(220,245,240,.65)';g.fillRect(X+5,Y+6,W-10,5);
  for(let i=0;i<3;i++){g.fillStyle='#4a5a52';g.fillRect(X+10+i*((W-20)/3),Y+H-28,((W-20)/3)-3,20);
    g.fillStyle='rgba(220,245,240,.4)';g.fillRect(X+10+i*((W-20)/3),Y+H-28,((W-20)/3)-3,3);}
  g.strokeStyle='#cfe';g.lineWidth=1.4;g.beginPath();g.moveTo(X+12,Y+12);g.lineTo(X+12,Y-8);g.stroke();
  g.fillStyle=ac;g.fillRect(X+12,Y-8,10,H*.12);
  g.fillStyle=ac;g.fillRect(X+5,Y+H-6,W-10,3);
}
/* ===== Faction-distinct Silos ===== */
function siloVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  g.fillStyle='#4a4d44';g.fillRect(X+3,Y+3,W-6,H-6);
  g.fillStyle='#565a50';g.fillRect(X+3,Y+3,W-6,(H-6)*.45);
  g.strokeStyle='#23251f';g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
  for(let i=0;i<(W-6)/8;i++){g.fillStyle=i%2?'rgba(120,210,255,.6)':'rgba(20,60,80,.8)';g.fillRect(X+3+i*8,Y+H-11,8,8);}
  const cx=X+W/2,cy=Y+H*.46,R=Math.min(W,H)*.3;
  g.fillStyle='#10181c';g.beginPath();g.arc(cx,cy,R+3,0,7);g.fill();
  g.fillStyle='#1a2e3c';g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
  g.fillStyle='#1e3a4e';g.beginPath();g.arc(cx,cy,R,-Math.PI/2,Math.PI/2);g.closePath();g.fill();
  g.strokeStyle='#0a1820';g.lineWidth=1.8;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();
  g.beginPath();g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
  g.fillStyle='rgba(120,210,255,.8)';
  for(let i=0;i<3;i++){const a=-Math.PI/2+i*(Math.PI*2/3);g.save();g.translate(cx,cy);g.rotate(a);g.beginPath();g.moveTo(0,-3);g.lineTo(R*.62,-R*.34);g.lineTo(R*.62,R*.34-6);g.closePath();g.fill();g.restore();}
  g.fillStyle='#0d1c26';g.beginPath();g.arc(cx,cy,3.4,0,7);g.fill();
  pPanel(g,X+W-26,Y+6,20,16,C(28),C(36),C(14));pWindows(g,X+W-23,Y+10,2,true);
  g.fillStyle=ac;g.fillRect(X+6,Y+6,14,4);
}
function siloCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+4,Y+4,W-8,H-8,C(26),C(34),C(14));pBolts(g,X+4,Y+4,W-8,H-8);
  pHazard(g,X+4,Y+H-11,W-8,8);
  g.fillStyle=C(20);g.fillRect(X+W-32,Y+4,12,28);g.fillRect(X+W-16,Y+4,12,22);
  g.fillStyle='#3a2018';g.fillRect(X+W-33,Y+4,14,5);g.fillRect(X+W-17,Y+4,14,5);
  const cx=X+W/2,cy=Y+H*.46,R=Math.min(W,H)*.3;
  g.fillStyle='#23251f';g.beginPath();g.arc(cx,cy,R+3,0,7);g.fill();
  g.fillStyle='#3a1a10';g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
  g.fillStyle='#4e2012';g.beginPath();g.arc(cx,cy,R,-Math.PI/2,Math.PI/2);g.closePath();g.fill();
  g.strokeStyle='#191b15';g.lineWidth=1.8;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();
  g.beginPath();g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
  g.fillStyle='rgba(255,80,40,.85)';
  for(let i=0;i<3;i++){const a=-Math.PI/2+i*(Math.PI*2/3);g.save();g.translate(cx,cy);g.rotate(a);g.beginPath();g.moveTo(0,-3);g.lineTo(R*.62,-R*.34);g.lineTo(R*.62,R*.34-6);g.closePath();g.fill();g.restore();}
  g.fillStyle='#191b15';g.beginPath();g.arc(cx,cy,3.4,0,7);g.fill();
  pPanel(g,X+W-26,Y+6,20,16,C(28),C(36),C(14));pWindows(g,X+W-23,Y+10,2,false);
  g.fillStyle=ac;g.fillRect(X+6,Y+6,14,4);
}
function siloScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.6,W*.58,H*.52,0,0,7);g.fill();
  pPanel(g,X+W*.08,Y+H*.3,W*.6,H*.58,C(28),C(36),C(15));
  g.fillStyle='#5a4a30';g.beginPath();g.moveTo(X+W*.04,Y+H*.32);g.lineTo(X+W*.44,Y+H*.18);g.lineTo(X+W*.72,Y+H*.3);g.lineTo(X+W*.7,Y+H*.37);g.lineTo(X+W*.06,Y+H*.38);g.closePath();g.fill();
  const cx=X+W/2,cy=Y+H*.52,R=Math.min(W,H)*.26;
  g.fillStyle='#23251f';g.beginPath();g.arc(cx,cy,R+3,0,7);g.fill();
  g.fillStyle='#3a3628';g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
  g.fillStyle='#474338';g.beginPath();g.arc(cx,cy,R,-Math.PI/2,Math.PI/2);g.closePath();g.fill();
  g.strokeStyle='#191b15';g.lineWidth=1.8;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();
  g.beginPath();g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
  g.fillStyle='rgba(140,180,60,.75)';
  for(let i=0;i<3;i++){const a=-Math.PI/2+i*(Math.PI*2/3);g.save();g.translate(cx,cy);g.rotate(a);g.beginPath();g.moveTo(0,-3);g.lineTo(R*.62,-R*.34);g.lineTo(R*.62,R*.34-6);g.closePath();g.fill();g.restore();}
  g.fillStyle='#191b15';g.beginPath();g.arc(cx,cy,3.4,0,7);g.fill();
  g.fillStyle=C(22);g.fillRect(X+W*.72,Y+H*.34,W*.2,H*.18);
  g.fillStyle=ac;g.fillRect(X+W*.08,Y+H-7,W*.3,3);
}
function siloNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+4,Y+4,W-8,H-8,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let r=0;r<4;r++){const yy=Y+4+r*(H-8)/4;g.beginPath();g.moveTo(X+4,yy);g.lineTo(X+W-4,yy);g.stroke();
    for(let c=0;c<7;c++){const xx=X+8+c*((W-16)/7)+(r%2?((W-16)/14):0);g.beginPath();g.moveTo(xx,yy);g.lineTo(xx,yy+(H-8)/4);g.stroke();}}
  g.fillStyle=C(34);for(let i=0;i<8;i++)g.fillRect(X+6+i*((W-12)/8),Y,((W-12)/16),6);
  g.fillStyle='rgba(220,245,240,.5)';g.fillRect(X+4,Y+2,W-8,4);
  const cx=X+W/2,cy=Y+H*.46,R=Math.min(W,H)*.3;
  g.fillStyle='#0a1a1a';g.beginPath();g.arc(cx,cy,R+3,0,7);g.fill();
  g.fillStyle='#102020';g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
  g.fillStyle='#182c2c';g.beginPath();g.arc(cx,cy,R,-Math.PI/2,Math.PI/2);g.closePath();g.fill();
  g.strokeStyle='#0a1414';g.lineWidth=1.8;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();
  g.beginPath();g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
  g.fillStyle='rgba(120,255,235,.7)';
  for(let i=0;i<3;i++){const a=-Math.PI/2+i*(Math.PI*2/3);g.save();g.translate(cx,cy);g.rotate(a);g.beginPath();g.moveTo(0,-3);g.lineTo(R*.62,-R*.34);g.lineTo(R*.62,R*.34-6);g.closePath();g.fill();g.restore();}
  g.fillStyle='#0a1414';g.beginPath();g.arc(cx,cy,3.4,0,7);g.fill();
  pPanel(g,X+W-26,Y+6,20,16,C(30),C(38),C(16));pWindows(g,X+W-23,Y+10,2,true);
  g.fillStyle=ac;g.fillRect(X+6,Y+6,14,4);
}
/* ===== Faction-distinct Turret Bases ===== */
function turrVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  g.fillStyle='#39413a';g.beginPath();g.arc(X+W/2,Y+H/2,W/2-2,0,7);g.fill();
  g.strokeStyle='#262c25';g.lineWidth=2;g.stroke();
  g.strokeStyle='rgba(120,210,255,.5)';g.lineWidth=1.2;g.beginPath();g.arc(X+W/2,Y+H/2,W/2-6,0,7);g.stroke();
  g.fillStyle='#8d855f';
  for(let i=0;i<10;i++){const a=i/10*7;g.beginPath();g.ellipse(X+W/2+Math.cos(a)*(W/2-9),Y+H/2+Math.sin(a)*(H/2-9),6,3.6,a,0,7);g.fill();}
  g.fillStyle=C(30);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*20,py=Y+H/2+Math.sin(a)*20;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();g.strokeStyle='#1d231a';g.lineWidth=2;g.stroke();
  g.fillStyle=C(38);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*15,py=Y+H/2+Math.sin(a)*15;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();
  g.fillStyle='rgba(120,210,255,.4)';
  for(let i=0;i<8;i++){const a=i/8*7+.39;g.fillRect(X+W/2+Math.cos(a)*17.5-1,Y+H/2+Math.sin(a)*17.5-1,2,2);}
  g.fillStyle='#23291f';g.beginPath();g.arc(X+W/2,Y+H/2,9,0,7);g.fill();
  g.strokeStyle=ac;g.lineWidth=2;g.beginPath();g.arc(X+W/2,Y+H/2,11.5,0,7);g.stroke();
}
function turrCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#2a180c';g.beginPath();g.arc(X+W/2,Y+H/2,W/2-2,0,7);g.fill();
  g.strokeStyle='#1a0e06';g.lineWidth=2.4;g.stroke();
  g.fillStyle='#6b5a2a';
  for(let i=0;i<10;i++){const a=i/10*7;g.beginPath();g.ellipse(X+W/2+Math.cos(a)*(W/2-9),Y+H/2+Math.sin(a)*(H/2-9),7,4,a,0,7);g.fill();}
  g.fillStyle=C(24);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*20,py=Y+H/2+Math.sin(a)*20;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();g.strokeStyle='#1a0e06';g.lineWidth=2.4;g.stroke();
  g.fillStyle=C(32);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*15,py=Y+H/2+Math.sin(a)*15;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();
  g.fillStyle='rgba(200,180,120,.5)';
  for(let i=0;i<8;i++){const a=i/8*7+.39;g.fillRect(X+W/2+Math.cos(a)*17.5-1,Y+H/2+Math.sin(a)*17.5-1,2.5,2.5);}
  g.fillStyle='rgba(255,60,20,.2)';g.beginPath();g.arc(X+W/2,Y+H/2,12,0,7);g.fill();
  g.fillStyle='#1a0e06';g.beginPath();g.arc(X+W/2,Y+H/2,9,0,7);g.fill();
  g.strokeStyle=ac;g.lineWidth=2;g.beginPath();g.arc(X+W/2,Y+H/2,11.5,0,7);g.stroke();
}
function turrScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.55,W*.5,H*.44,0,0,7);g.fill();
  g.fillStyle='#6b6038';
  for(let i=0;i<12;i++){const a=i/12*7;g.beginPath();g.ellipse(X+W/2+Math.cos(a)*(W/2-7),Y+H/2+Math.sin(a)*(H/2-7),8,4.5,a,0,7);g.fill();}
  g.fillStyle=C(28);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*20,py=Y+H/2+Math.sin(a)*20;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();g.strokeStyle=C(14);g.lineWidth=2;g.stroke();
  g.fillStyle=C(36);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*15,py=Y+H/2+Math.sin(a)*15;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.25)';
  for(let i=0;i<8;i++){const a=i/8*7+.39;g.fillRect(X+W/2+Math.cos(a)*17.5-1,Y+H/2+Math.sin(a)*17.5-1,2,2);}
  g.fillStyle='#1a1e16';g.beginPath();g.arc(X+W/2,Y+H/2,9,0,7);g.fill();
  g.strokeStyle=ac;g.lineWidth=2;g.beginPath();g.arc(X+W/2,Y+H/2,11.5,0,7);g.stroke();
}
function turrNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle=C(22);g.beginPath();g.arc(X+W/2,Y+H/2,W/2-2,0,7);g.fill();
  g.strokeStyle=C(12);g.lineWidth=2;g.stroke();
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;g.beginPath();g.arc(X+W/2,Y+H/2,W/2-6,0,7);g.stroke();
  g.fillStyle=C(30);
  for(let i=0;i<8;i++){const a=i/8*7;g.beginPath();g.ellipse(X+W/2+Math.cos(a)*(W/2-9),Y+H/2+Math.sin(a)*(H/2-9),7,4,a,0,7);g.fill();
    g.strokeStyle=C(16);g.lineWidth=.8;g.stroke();}
  g.fillStyle=C(26);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*20,py=Y+H/2+Math.sin(a)*20;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();g.strokeStyle=C(14);g.lineWidth=2;g.stroke();
  g.fillStyle=C(34);g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*7+.39,px=X+W/2+Math.cos(a)*15,py=Y+H/2+Math.sin(a)*15;i?g.lineTo(px,py):g.moveTo(px,py);}
  g.closePath();g.fill();
  g.fillStyle='rgba(180,245,240,.4)';
  for(let i=0;i<8;i++){const a=i/8*7+.39;g.fillRect(X+W/2+Math.cos(a)*17.5-1,Y+H/2+Math.sin(a)*17.5-1,2,2);}
  g.fillStyle='#0c1a1a';g.beginPath();g.arc(X+W/2,Y+H/2,9,0,7);g.fill();
  g.strokeStyle=ac;g.lineWidth=2;g.beginPath();g.arc(X+W/2,Y+H/2,11.5,0,7);g.stroke();
}
/* ===== Faction-distinct Airfields ===== */
function airVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  g.fillStyle='#3a3d35';g.fillRect(X+6,Y+H*.28,W-12,H*.38);
  g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=2;g.setLineDash([8,6]);
  g.beginPath();g.moveTo(X+W/2,Y+H*.28);g.lineTo(X+W/2,Y+H*.66);g.stroke();g.setLineDash([]);
  g.fillStyle='rgba(120,210,255,.6)';
  for(let i=0;i<5;i++){g.fillRect(X+8+i*(W-16)/5,Y+H-14,(W-16)/5-2,4);}
  const pads=BT.airfield.pads;
  for(let i=0;i<4;i++){const px=W/2+pads[i][0]*24,py=H/2+pads[i][1]*19.2;
    g.fillStyle='#0d2030';g.beginPath();g.arc(X+px,Y+py,10,0,7);g.fill();
    g.strokeStyle='rgba(120,210,255,.8)';g.lineWidth=1.4;g.beginPath();g.arc(X+px,Y+py,10,0,7);g.stroke();
    g.strokeStyle='rgba(120,210,255,.6)';g.lineWidth=1;
    g.beginPath();g.moveTo(X+px-7,Y+py);g.lineTo(X+px+7,Y+py);g.moveTo(X+px,Y+py-7);g.lineTo(X+px,Y+py+7);g.stroke();}
  pPanel(g,X+W*.6,Y+4,W*.22,H*.5,C(32),C(42),C(20));
  g.fillStyle='rgba(120,210,255,.6)';g.fillRect(X+W*.62,Y+12,W*.18,H*.1);
  g.fillStyle=ac;g.fillRect(X+W*.6,Y+4,W*.22,3);
  pWindows(g,X+W*.62,Y+14,2,true);
}
function airCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+4,Y+4,W-8,H-8,C(22),C(30),C(12));pBolts(g,X+4,Y+4,W-8,H-8);
  g.fillStyle='#2a241c';g.fillRect(X+6,Y+H*.28,W-12,H*.38);
  g.strokeStyle='rgba(255,100,40,.5)';g.lineWidth=2;g.setLineDash([8,6]);
  g.beginPath();g.moveTo(X+W/2,Y+H*.28);g.lineTo(X+W/2,Y+H*.66);g.stroke();g.setLineDash([]);
  pHazard(g,X+4,Y+H-10,W-8,6);
  const pads=BT.airfield.pads;
  for(let i=0;i<4;i++){const px=W/2+pads[i][0]*24,py=H/2+pads[i][1]*19.2;
    g.fillStyle='#2a140c';g.beginPath();g.arc(X+px,Y+py,10,0,7);g.fill();
    g.strokeStyle='rgba(255,100,40,.7)';g.lineWidth=1.4;g.beginPath();g.arc(X+px,Y+py,10,0,7);g.stroke();
    g.strokeStyle='rgba(255,140,40,.6)';g.lineWidth=1;
    g.beginPath();g.moveTo(X+px-7,Y+py);g.lineTo(X+px+7,Y+py);g.moveTo(X+px,Y+py-7);g.lineTo(X+px,Y+py+7);g.stroke();}
  pPanel(g,X+W*.6,Y+4,W*.22,H*.5,C(26),C(34),C(14));pBolts(g,X+W*.6,Y+4,W*.22,H*.5);
  g.fillStyle='rgba(255,90,50,.5)';g.fillRect(X+W*.62,Y+10,W*.18,H*.08);
  g.fillStyle='#3a2018';g.fillRect(X+W*.62,Y+H*.5,W*.18,4);
  g.fillStyle=ac;g.fillRect(X+W*.6,Y+4,W*.22,3);
  pWindows(g,X+W*.62,Y+14,2,false);
  g.fillStyle=ac;g.fillRect(X+4,Y+H-6,22,4);
}
function airScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W*.4,Y+H*.62,W*.5,H*.44,0,0,7);g.fill();
  pPanel(g,X+W*.06,Y+H*.22,W*.62,H*.68,C(28),C(36),C(15));
  g.fillStyle='#2e2c1c';g.fillRect(X+W*.08,Y+H*.28,W*.58,H*.38);
  g.strokeStyle='rgba(200,180,80,.4)';g.lineWidth=1.8;g.setLineDash([8,6]);
  g.beginPath();g.moveTo(X+W*.36,Y+H*.28);g.lineTo(X+W*.36,Y+H*.66);g.stroke();g.setLineDash([]);
  const pads=BT.airfield.pads;
  for(let i=0;i<4;i++){const px=W/2+pads[i][0]*24,py=H/2+pads[i][1]*19.2;
    g.fillStyle='#2a2818';g.beginPath();g.arc(X+px,Y+py,10,0,7);g.fill();
    g.strokeStyle='rgba(140,160,60,.6)';g.lineWidth=1.4;g.beginPath();g.arc(X+px,Y+py,10,0,7);g.stroke();
    g.strokeStyle='rgba(140,160,60,.4)';g.lineWidth=1;
    g.beginPath();g.moveTo(X+px-7,Y+py);g.lineTo(X+px+7,Y+py);g.moveTo(X+px,Y+py-7);g.lineTo(X+px,Y+py+7);g.stroke();}
  g.fillStyle='#5a4a30';g.beginPath();g.moveTo(X+W*.02,Y+H*.24);g.lineTo(X+W*.5,Y+H*.1);g.lineTo(X+W*.72,Y+H*.22);g.lineTo(X+W*.7,Y+H*.3);g.lineTo(X+W*.04,Y+H*.3);g.closePath();g.fill();
  g.fillStyle=C(24);g.fillRect(X+W*.72,Y+H*.2,W*.2,H*.46);
  g.strokeStyle=C(14);g.lineWidth=1;g.strokeRect(X+W*.72,Y+H*.2,W*.2,H*.46);
  g.fillStyle='#6b4a2a';g.fillRect(X+W*.74,Y+H*.22,W*.16,H*.14);
  g.fillStyle=ac;g.fillRect(X+W*.06,Y+H-7,22,3);
}
function airNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+4,Y+4,W-8,H-8,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.15)';g.lineWidth=1;
  for(let r=0;r<4;r++){const yy=Y+4+r*(H-8)/4;g.beginPath();g.moveTo(X+4,yy);g.lineTo(X+W-4,yy);g.stroke();}
  g.fillStyle='#2e3028';g.fillRect(X+6,Y+H*.28,W-12,H*.38);
  g.fillStyle='rgba(220,245,240,.3)';g.fillRect(X+6,Y+H*.28,W-12,4);
  g.strokeStyle='rgba(180,245,240,.5)';g.lineWidth=1.8;g.setLineDash([8,6]);
  g.beginPath();g.moveTo(X+W/2,Y+H*.28);g.lineTo(X+W/2,Y+H*.66);g.stroke();g.setLineDash([]);
  const pads=BT.airfield.pads;
  for(let i=0;i<4;i++){const px=W/2+pads[i][0]*24,py=H/2+pads[i][1]*19.2;
    g.fillStyle='#0e1a1a';g.beginPath();g.arc(X+px,Y+py,10,0,7);g.fill();
    g.strokeStyle='rgba(180,245,240,.7)';g.lineWidth=1.4;g.beginPath();g.arc(X+px,Y+py,10,0,7);g.stroke();
    g.strokeStyle='rgba(180,245,240,.5)';g.lineWidth=1;
    g.beginPath();g.moveTo(X+px-7,Y+py);g.lineTo(X+px+7,Y+py);g.moveTo(X+px,Y+py-7);g.lineTo(X+px,Y+py+7);g.stroke();}
  pPanel(g,X+W*.6,Y+4,W*.22,H*.5,C(30),C(40),C(18));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let c=0;c<3;c++){const xx=X+W*.62+c*W*.075;g.beginPath();g.moveTo(xx,Y+6);g.lineTo(xx,Y+H*.5);g.stroke();}
  g.fillStyle=C(34);for(let i=0;i<4;i++)g.fillRect(X+W*.62+i*W*.055,Y,W*.03,5);
  g.fillStyle='rgba(220,245,240,.5)';g.fillRect(X+W*.62,Y+8,W*.18,H*.08);
  pWindows(g,X+W*.62,Y+14,2,true);
  g.fillStyle=ac;g.fillRect(X+W*.6,Y+4,W*.22,3);
  g.fillStyle=ac;g.fillRect(X+4,Y+H-6,22,4);
}
/* ===== Faction-distinct Radar Towers ===== */
function radVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  pPanel(g,X+W*.18,Y+H*.52,W*.64,H*.36,C(30),C(40),C(18));
  g.strokeStyle=C(40);g.lineWidth=2.8;g.lineCap='round';
  g.beginPath();g.moveTo(X+W/2,Y+H*.5);g.lineTo(X+W/2,Y+12);g.stroke();g.lineCap='butt';
  g.fillStyle=C(24);g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.closePath();g.fill();
  g.strokeStyle='rgba(120,210,255,.6)';g.lineWidth=1.6;g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.stroke();
  g.fillStyle=C(34);g.beginPath();g.arc(X+W/2,Y+16,W*.2,Math.PI,0);g.closePath();g.fill();
  g.fillStyle='rgba(120,210,255,.9)';g.beginPath();g.arc(X+W/2,Y+15,2.6,0,7);g.fill();
  g.fillStyle='rgba(120,210,255,.35)';g.beginPath();g.arc(X+W/2,Y+15,5.5,0,7);g.fill();
  g.fillStyle=ac;g.fillRect(X+5,Y+H-7,14,4);
}
function radCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+W*.18,Y+H*.52,W*.64,H*.36,C(26),C(34),C(14));pBolts(g,X+W*.18,Y+H*.52,W*.64,H*.36);
  g.strokeStyle=C(30);g.lineWidth=4;g.lineCap='round';
  g.beginPath();g.moveTo(X+W/2,Y+H*.5);g.lineTo(X+W/2,Y+12);g.stroke();g.lineCap='butt';
  g.fillStyle=C(20);g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.closePath();g.fill();
  g.strokeStyle='rgba(255,80,40,.5)';g.lineWidth=2;g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.stroke();
  g.fillStyle=C(30);g.beginPath();g.arc(X+W/2,Y+16,W*.2,Math.PI,0);g.closePath();g.fill();
  g.fillStyle='rgba(255,80,40,.9)';g.beginPath();g.arc(X+W/2,Y+15,2.6,0,7);g.fill();
  g.fillStyle='rgba(255,80,40,.25)';g.beginPath();g.arc(X+W/2,Y+15,5.5,0,7);g.fill();
  g.fillStyle=ac;pStar(g,X+W*.7,Y+H*.78,5);
  g.fillStyle=ac;g.fillRect(X+5,Y+H-7,14,4);
}
function radScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.68,W*.48,H*.36,0,0,7);g.fill();
  pPanel(g,X+W*.16,Y+H*.5,W*.68,H*.38,C(28),C(36),C(15));
  g.strokeStyle=C(22);g.lineWidth=3;g.lineCap='round';
  g.beginPath();g.moveTo(X+W*.5,Y+H*.5);g.lineTo(X+W*.52,Y+14);g.stroke();g.lineCap='butt';
  g.save();g.translate(X+W*.52,Y+16);g.rotate(.15);
  g.fillStyle=C(24);g.beginPath();g.arc(0,0,W*.28,Math.PI,0);g.closePath();g.fill();
  g.strokeStyle=C(36);g.lineWidth=1.4;g.beginPath();g.arc(0,0,W*.28,Math.PI,0);g.stroke();
  g.fillStyle=C(32);g.beginPath();g.arc(0,0,W*.18,Math.PI,0);g.closePath();g.fill();
  g.restore();
  g.fillStyle='rgba(140,220,60,.9)';g.beginPath();g.arc(X+W*.52,Y+16,2.6,0,7);g.fill();
  g.fillStyle='rgba(140,220,60,.3)';g.beginPath();g.arc(X+W*.52,Y+16,5.5,0,7);g.fill();
  g.fillStyle=ac;g.fillRect(X+W*.16,Y+H-7,14,3);
}
function radNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+W*.18,Y+H*.52,W*.64,H*.36,C(30),C(38),C(17));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let c=0;c<3;c++){const xx=X+W*.22+c*W*.2;g.beginPath();g.moveTo(xx,Y+H*.52);g.lineTo(xx,Y+H*.88);g.stroke();}
  g.strokeStyle=C(34);g.lineWidth=3.4;g.lineCap='round';
  g.beginPath();g.moveTo(X+W/2,Y+H*.5);g.lineTo(X+W/2,Y+12);g.stroke();g.lineCap='butt';
  g.fillStyle=C(22);g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.closePath();g.fill();
  g.strokeStyle='rgba(180,245,240,.6)';g.lineWidth=1.6;g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.stroke();
  g.fillStyle=C(30);g.beginPath();g.arc(X+W/2,Y+16,W*.2,Math.PI,0);g.closePath();g.fill();
  g.fillStyle='rgba(180,245,240,.9)';g.beginPath();g.arc(X+W/2,Y+15,2.6,0,7);g.fill();
  g.fillStyle='rgba(180,245,240,.3)';g.beginPath();g.arc(X+W/2,Y+15,5.5,0,7);g.fill();
  g.fillStyle=ac;g.fillRect(X+5,Y+H-7,14,4);
}
/* ===== Faction-distinct SAM Sites ===== */
function samVanguard(g,X,Y,W,H,C,ac){
  pFoundation(g,X,Y,W,H);
  g.fillStyle=C(26);g.beginPath();g.arc(X+W/2,Y+H/2+4,W*.36,0,7);g.fill();
  g.strokeStyle=C(16);g.lineWidth=1.4;g.stroke();
  g.fillStyle=C(32);g.fillRect(X+W*.18,Y+H*.24,W*.64,7);
  g.strokeStyle='rgba(120,210,255,.4)';g.lineWidth=1;g.strokeRect(X+W*.18,Y+H*.24,W*.64,7);
  for(let i=0;i<2;i++){const mx=X+W*.28+i*W*.28;
    g.fillStyle='#7ab8cc';g.fillRect(mx,Y+H*.14,6,12);
    g.fillStyle='rgba(120,210,255,.8)';g.fillRect(mx,Y+H*.14,6,3);
    g.fillStyle='#4a8098';g.beginPath();g.moveTo(mx,Y+H*.14);g.lineTo(mx+3,Y+H*.08);g.lineTo(mx+6,Y+H*.14);g.closePath();g.fill();}
  g.fillStyle=ac;g.fillRect(X+6,Y+H-7,12,4);
}
function samCrimson(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+5,Y+12,W-10,H-18,C(24),C(32),C(12));pBolts(g,X+5,Y+12,W-10,H-18);
  g.fillStyle=C(22);g.beginPath();g.arc(X+W/2,Y+H/2+4,W*.36,0,7);g.fill();
  g.strokeStyle=C(12);g.lineWidth=1.8;g.stroke();
  pHazard(g,X+5,Y+H-12,W-10,5);
  g.fillStyle=C(28);g.fillRect(X+W*.16,Y+H*.22,W*.68,8);
  g.strokeStyle=C(14);g.lineWidth=1;g.strokeRect(X+W*.16,Y+H*.22,W*.68,8);
  for(let i=0;i<3;i++){const mx=X+W*.22+i*(W*.56/3.2);
    g.fillStyle='#8ab0bc';g.fillRect(mx,Y+H*.12,5,12);
    g.fillStyle='#c04030';g.fillRect(mx,Y+H*.12,5,4);
    g.fillStyle='#8a2810';g.beginPath();g.moveTo(mx,Y+H*.12);g.lineTo(mx+2.5,Y+H*.06);g.lineTo(mx+5,Y+H*.12);g.closePath();g.fill();}
  g.fillStyle=ac;g.fillRect(X+5,Y+H-6,12,4);
}
function samScorpion(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H*.6,W*.48,H*.42,0,0,7);g.fill();
  pPanel(g,X+W*.1,Y+H*.36,W*.56,H*.52,C(28),C(36),C(15));
  g.fillStyle=C(24);g.beginPath();g.arc(X+W/2,Y+H*.52,W*.32,0,7);g.fill();
  g.strokeStyle=C(14);g.lineWidth=1.4;g.stroke();
  g.save();g.translate(X+W/2,Y+H*.46);g.rotate(-.2);
  g.fillStyle=C(30);g.fillRect(-W*.28,0,W*.56,7);
  g.strokeStyle=C(14);g.lineWidth=1;g.strokeRect(-W*.28,0,W*.56,7);
  for(let i=0;i<3;i++){const mx=-W*.22+i*(W*.44/3.2);
    g.fillStyle='#9a8a5a';g.fillRect(mx,-12,5,12);
    g.fillStyle='rgba(200,160,60,.8)';g.fillRect(mx,-12,5,3);}
  g.restore();
  g.fillStyle=ac;g.fillRect(X+W*.1,Y+H-7,14,3);
}
function samNorthwind(g,X,Y,W,H,C,ac){
  pShadow(g,X,Y,W,H);
  pPanel(g,X+5,Y+14,W-10,H-20,C(28),C(37),C(16));
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;
  for(let r=0;r<2;r++){const yy=Y+14+r*(H-20)/2;g.beginPath();g.moveTo(X+5,yy);g.lineTo(X+W-5,yy);g.stroke();}
  g.fillStyle=C(24);g.beginPath();g.arc(X+W/2,Y+H/2+4,W*.34,0,7);g.fill();
  g.strokeStyle=C(12);g.lineWidth=1.8;g.stroke();
  g.fillStyle=C(30);
  for(let i=0;i<6;i++){const a=i/6*7;g.beginPath();g.ellipse(X+W/2+Math.cos(a)*W*.3,Y+H/2+4+Math.sin(a)*W*.3,5.5,3.5,a,0,7);g.fill();}
  g.fillStyle=C(28);g.fillRect(X+W*.2,Y+H*.24,W*.6,7);
  g.strokeStyle='rgba(180,245,240,.4)';g.lineWidth=1;g.strokeRect(X+W*.2,Y+H*.24,W*.6,7);
  for(let i=0;i<3;i++){const mx=X+W*.26+i*(W*.5/3.2);
    g.fillStyle='#8a9aa0';g.fillRect(mx,Y+H*.14,5,12);
    g.fillStyle='rgba(180,245,240,.8)';g.fillRect(mx,Y+H*.14,5,3);
    g.fillStyle='#5a6a70';g.beginPath();g.moveTo(mx,Y+H*.14);g.lineTo(mx+2.5,Y+H*.07);g.lineTo(mx+5,Y+H*.14);g.closePath();g.fill();}
  g.fillStyle=ac;g.fillRect(X+5,Y+H-6,14,4);
}
/* --- building sprites --- */
function bSpr(type,fk,gen){
  const t=BT[type],W=t.w*TILE,H=t.h*TILE;
  const key='B'+type+'_'+fk+(type==='command'&&gen&&gen!=='std'?'_'+gen:'');
  return spr(key,W+BM*2,H+BM*2,g=>{
    const X=BM,Y=BM,F=FACTIONS[fk]||{c:'#9aa48c',d:'#7a8470'},ac=F.c,C=facCol(fk);
    pShadow(g,X,Y,W,H);
    switch(type){
      case 'command':{
        if(fk==='vanguard')cmdVanguard(g,X,Y,W,H,C,ac,F);
        else if(fk==='crimson')cmdCrimson(g,X,Y,W,H,C,ac,F);
        else if(fk==='scorpion')cmdScorpion(g,X,Y,W,H,C,ac,F);
        else if(fk==='northwind')cmdNorthwind(g,X,Y,W,H,C,ac,F);
        else cmdNeutral(g,X,Y,W,H,C,ac,F);
        if(gen&&gen!=='std')cmdAddon(g,X,Y,W,H,C,ac,gen);
        break;}
      case 'power':{
        if(fk==='crimson')pwrCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')pwrScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')pwrNorthwind(g,X,Y,W,H,C,ac);
        else pwrVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'supply':{
        if(fk==='crimson')supCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')supScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')supNorthwind(g,X,Y,W,H,C,ac);
        else supVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'barracks':{
        if(fk==='crimson')barCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')barScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')barNorthwind(g,X,Y,W,H,C,ac);
        else barVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'factory':{
        if(fk==='crimson')factCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')factScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')factNorthwind(g,X,Y,W,H,C,ac);
        else factVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'market':{
        if(fk==='crimson')mktCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')mktScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')mktNorthwind(g,X,Y,W,H,C,ac);
        else mktVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'tech':{
        if(fk==='crimson')techCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')techScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')techNorthwind(g,X,Y,W,H,C,ac);
        else techVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'silo':{
        if(fk==='crimson')siloCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')siloScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')siloNorthwind(g,X,Y,W,H,C,ac);
        else siloVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'civil':{
        pShadow(g,X,Y,W,H);
        // walls
        g.fillStyle='#5a5e52';g.fillRect(X,Y,W,H);
        g.fillStyle='#686c5e';g.fillRect(X,Y,W,H*.45);
        g.strokeStyle='#30342c';g.lineWidth=1.4;g.strokeRect(X,Y,W,H);
        // pitched roof
        g.fillStyle='#474b3e';g.beginPath();
        g.moveTo(X-2,Y+H*.38);g.lineTo(X+W/2,Y+2);g.lineTo(X+W+2,Y+H*.38);g.closePath();g.fill();
        g.strokeStyle='#272b22';g.lineWidth=1;g.stroke();
        // windows
        for(let i=0;i<3;i++){
          g.fillStyle='#10150e';g.fillRect(X+7+i*17,Y+H*.5,12,10);
          g.fillStyle='#8ab8c4';g.fillRect(X+8+i*17,Y+H*.5+1,10,8);
          g.fillStyle='rgba(170,220,235,.35)';g.fillRect(X+8+i*17,Y+H*.5+1,10,4);
        }
        // door
        g.fillStyle='#2e3228';g.fillRect(X+W/2-7,Y+H-16,14,14);
        g.fillStyle='#4a5040';g.fillRect(X+W/2-6,Y+H-15,12,12);
        g.fillStyle='#7a8d6e';g.fillRect(X+W/2-1,Y+H-9,2,8);
        // garrison indicator
        g.fillStyle='#9aa48c';g.font='bold 9px sans-serif';g.textAlign='center';g.textBaseline='bottom';
        g.fillText('[INF]',X+W/2,Y+H+BM*.5);
        break;}
      case 'oilrig':{
        pShadow(g,X,Y,W,H);
        // base platform
        g.fillStyle='#4a4438';g.fillRect(X,Y,W,H);
        g.fillStyle='#5a5247';g.fillRect(X,Y,W,H*.4);
        g.strokeStyle='#282320';g.lineWidth=1.4;g.strokeRect(X,Y,W,H);
        // derrick frame
        g.strokeStyle='#8a6b2e';g.lineWidth=2.8;
        g.beginPath();
        g.moveTo(X+W*.28,Y+H-6);g.lineTo(X+W/2,Y+5);
        g.moveTo(X+W*.72,Y+H-6);g.lineTo(X+W/2,Y+5);
        g.stroke();
        g.strokeStyle='#a88238';g.lineWidth=1.6;
        for(let i=0;i<3;i++){
          const yt=Y+H-10-i*(H-20)/3,hw=W*.36*(1-i*.22);
          g.beginPath();g.moveTo(X+W/2-hw,yt);g.lineTo(X+W/2+hw,yt);g.stroke();
        }
        // pump head
        g.fillStyle='#c0984a';g.beginPath();g.ellipse(X+W*.62,Y+H*.52,9,6,0,0,7);g.fill();
        g.strokeStyle='#8a6b2e';g.lineWidth=2;
        g.beginPath();g.moveTo(X+W*.62,Y+H*.58);g.lineTo(X+W*.62,Y+H*.74);g.stroke();
        // storage tank
        g.fillStyle='#23291f';g.beginPath();g.ellipse(X+W*.28,Y+H*.72,11,9,0,0,7);g.fill();
        g.fillStyle='#31382c';g.beginPath();g.ellipse(X+W*.27,Y+H*.71,9,7,0,0,7);g.fill();
        // income label
        g.fillStyle='#c9a23a';g.font='bold 10px sans-serif';g.textAlign='center';g.textBaseline='middle';
        g.fillText('$',X+W/2,Y+H-6);
        break;}
      case 'turret':{
        if(fk==='crimson')turrCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')turrScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')turrNorthwind(g,X,Y,W,H,C,ac);
        else turrVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'airfield':{
        if(fk==='crimson')airCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')airScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')airNorthwind(g,X,Y,W,H,C,ac);
        else airVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'radar':{
        if(fk==='crimson')radCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')radScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')radNorthwind(g,X,Y,W,H,C,ac);
        else radVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'tunnel':{
        pFoundation(g,X,Y,W,H);
        // sandbag ring
        g.fillStyle='#6b5a3a';
        for(let i=0;i<10;i++){const a2=i/10*Math.PI*2;g.beginPath();g.ellipse(X+W/2+Math.cos(a2)*W*.42,Y+H/2+Math.sin(a2)*H*.42,7,4.5,a2,0,7);g.fill()}
        g.fillStyle='#7d6a44';
        for(let i=0;i<10;i++){const a2=(i+.5)/10*Math.PI*2;g.beginPath();g.ellipse(X+W/2+Math.cos(a2)*W*.42,Y+H/2+Math.sin(a2)*H*.42-2,6,3.6,a2,0,7);g.fill()}
        // dark shaft
        const tg=g.createRadialGradient(X+W/2,Y+H/2,2,X+W/2,Y+H/2,W*.34);
        tg.addColorStop(0,'#05070a');tg.addColorStop(.7,'#141a12');tg.addColorStop(1,'#2a3024');
        g.fillStyle=tg;g.beginPath();g.ellipse(X+W/2,Y+H/2,W*.34,H*.3,0,0,7);g.fill();
        g.strokeStyle='#0c100a';g.lineWidth=2;
        g.beginPath();g.ellipse(X+W/2,Y+H/2,W*.34,H*.3,0,0,7);g.stroke();
        // ladder hint + support beams
        g.strokeStyle='#8a7a52';g.lineWidth=2;
        g.beginPath();g.moveTo(X+W/2-6,Y+H/2-H*.28);g.lineTo(X+W/2-6,Y+H/2);g.moveTo(X+W/2+6,Y+H/2-H*.28);g.lineTo(X+W/2+6,Y+H/2);g.stroke();
        g.strokeStyle='#5a4a2e';g.lineWidth=1.2;
        for(let i=0;i<3;i++){g.beginPath();g.moveTo(X+W/2-6,Y+H/2-H*.24+i*7);g.lineTo(X+W/2+6,Y+H/2-H*.24+i*7);g.stroke()}
        // camo tarp corner + faction trim
        g.fillStyle=C(26);g.beginPath();g.moveTo(X+4,Y+4);g.lineTo(X+W*.42,Y+4);g.lineTo(X+4,Y+H*.42);g.closePath();g.fill();
        g.fillStyle=ac;g.fillRect(X+4,Y+H-8,W*.3,4);
        break;}
      case 'samsite':{
        if(fk==='crimson')samCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')samScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')samNorthwind(g,X,Y,W,H,C,ac);
        else samVanguard(g,X,Y,W,H,C,ac);
        break;}
      case 'repairbay':{
        pShadow(g,X,Y,W,H);
        pFoundation(g,X,Y,W,H);
        // Overhead crane rail
        g.fillStyle=C(40);g.fillRect(X+6,Y+10,W-12,5);
        g.strokeStyle=C(16);g.lineWidth=1;g.strokeRect(X+6,Y+10,W-12,5);
        // Crane trolley block
        g.fillStyle=C(32);g.fillRect(X+W*.38,Y+8.5,W*.24,8);
        g.strokeStyle=C(14);g.lineWidth=1;g.strokeRect(X+W*.38,Y+8.5,W*.24,8);
        // Hoist cable + hook
        g.strokeStyle='#8a8264';g.lineWidth=1.6;
        g.beginPath();g.moveTo(X+W*.5,Y+16.5);g.lineTo(X+W*.5,Y+30);g.stroke();
        g.strokeStyle='#c9a23a';g.lineWidth=2.4;g.lineCap='round';
        g.beginPath();g.moveTo(X+W*.5,Y+30);g.lineTo(X+W*.5-5,Y+34);g.stroke();
        g.lineCap='butt';
        // Bay interior (dark recessed)
        g.fillStyle='#141810';g.fillRect(X+8,Y+22,W-16,H*.42);
        g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1;g.strokeRect(X+8,Y+22,W-16,H*.42);
        // Bay door frame (lower section)
        g.fillStyle=C(24);g.fillRect(X+8,Y+H*.64,W-16,H*.26);
        g.strokeStyle=C(12);g.lineWidth=1;g.strokeRect(X+8,Y+H*.64,W-16,H*.26);
        // Horizontal door panel lines
        g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=1;
        for(let i=1;i<4;i++){g.beginPath();g.moveTo(X+8,Y+H*.64+i*H*.065);g.lineTo(X+W-8,Y+H*.64+i*H*.065);g.stroke()}
        // Hazard stripe at door base
        pHazard(g,X+8,Y+H*.9,W-16,4);
        // Repair cross on side wall
        g.fillStyle='rgba(90,210,80,.92)';
        g.fillRect(X+W*.14,Y+H*.3,5,14);g.fillRect(X+W*.14-4.5,Y+H*.3+4.5,14,5);
        // Tool storage box beside bay
        g.fillStyle=C(20);g.fillRect(X+W-18,Y+H*.3,13,H*.24);
        g.strokeStyle=C(10);g.lineWidth=1;g.strokeRect(X+W-18,Y+H*.3,13,H*.24);
        g.fillStyle='#c9a23a';g.fillRect(X+W-16,Y+H*.36,2.4,6);g.fillRect(X+W-10,Y+H*.36,2.4,6);
        // Faction accent
        g.fillStyle=ac;g.fillRect(X+8,Y+H-6,18,4);
        break;}
      case 'watchtower':{
        pShadow(g,X,Y,W,H);
        // Foundation platform
        pPanel(g,X+W*.16,Y+H*.68,W*.68,H*.28,C(24),C(32),C(14));
        pBolts(g,X+W*.16,Y+H*.68,W*.68,H*.28);
        // Tower shaft (narrow and tall)
        pPanel(g,X+W*.33,Y+H*.22,W*.34,H*.52,C(26),C(34),C(15));
        g.strokeStyle=C(14);g.lineWidth=1;
        g.beginPath();g.moveTo(X+W*.33,Y+H*.36);g.lineTo(X+W*.67,Y+H*.36);g.stroke();
        g.beginPath();g.moveTo(X+W*.33,Y+H*.52);g.lineTo(X+W*.67,Y+H*.52);g.stroke();
        g.beginPath();g.moveTo(X+W*.33,Y+H*.65);g.lineTo(X+W*.67,Y+H*.65);g.stroke();
        // Ladder rungs on left side
        g.strokeStyle='#5a6454';g.lineWidth=1;
        g.beginPath();g.moveTo(X+W*.24,Y+H*.26);g.lineTo(X+W*.24,Y+H*.68);g.stroke();
        g.beginPath();g.moveTo(X+W*.31,Y+H*.26);g.lineTo(X+W*.31,Y+H*.68);g.stroke();
        for(let i=0;i<5;i++){const ly=Y+H*.30+i*H*.08;g.beginPath();g.moveTo(X+W*.24,ly);g.lineTo(X+W*.31,ly);g.stroke()}
        // Observation deck (wider than shaft)
        pPanel(g,X+W*.14,Y+H*.16,W*.72,H*.1,C(30),C(38),C(18));
        // Crenellations (battlements above deck top edge)
        g.fillStyle=C(22);
        for(let i=0;i<5;i++)g.fillRect(X+W*.16+i*W*.135,Y+H*.1,W*.09,H*.07);
        // Apex searchlight
        g.fillStyle='#1a1e18';g.beginPath();g.arc(X+W*.5,Y+H*.08,5.5,0,7);g.fill();
        g.fillStyle='#ddd8a8';g.beginPath();g.arc(X+W*.5,Y+H*.08,3.8,0,7);g.fill();
        // Light cone
        g.fillStyle='rgba(245,245,180,.2)';
        g.beginPath();g.moveTo(X+W*.5,Y+H*.08);g.lineTo(X+W*.5-14,Y+H*.02);g.lineTo(X+W*.5+14,Y+H*.02);g.closePath();g.fill();
        // Faction accent on deck railing
        g.fillStyle=ac;g.fillRect(X+W*.16,Y+H*.16,W*.68,3);
        break;}
    }
  });
}

/* --- vehicle sprites --- */
function trackPair(g,w,h){
  g.fillStyle='#1c211a';
  g.fillRect(-w/2,-h/2,w,7);g.fillRect(-w/2,h/2-7,w,7);
  g.fillStyle='#0f130d';
  for(let i=0;i<w/5;i++){g.fillRect(-w/2+2+i*5,-h/2+1.4,2.4,4.2);g.fillRect(-w/2+2+i*5,h/2-5.6,2.4,4.2)}
}
/* ── Building Construction Kit: applied ONCE to every cached building sprite.
      Gives all structures height (wall extrusion), sun-consistent roof beveling,
      a bold faction stripe, and seeded roof furniture — coherent across the set. ── */
const _KIT_FULL=new Set(['command','power','supply','barracks','factory','market','tech','airfield','radar','repairbay']);
const _KIT_LITE=new Set(['turret','samsite','silo','watchtower']);
function _bKit(cv,type,fk){
  const t=BT[type];if(!t)return;
  const g=cv.getContext('2d');
  const W=t.w*TILE,H=t.h*TILE,X=BM,Y=BM;
  const F=FACTIONS[fk]||{c:'#9aa48c'},ac=F.c;
  const full=_KIT_FULL.has(type);
  if(!full&&!_KIT_LITE.has(type))return;
  let sd=0;for(let i=0;i<type.length;i++)sd=(sd*31+type.charCodeAt(i))&1023;
  const rnd=()=>{sd=(sd*1103515245+12345)&0x3fffffff;return (sd>>8)/4194304%1};
  if(full){
    // wall extrusion: the roof is UP, walls fall to bottom+right (sun from top-left)
    g.fillStyle='rgba(8,10,12,0.5)';
    g.fillRect(X+3,Y+H-7,W-6,4);g.fillRect(X+W-7,Y+5,4,H-10);
    g.fillStyle='rgba(0,0,0,0.28)';
    g.fillRect(X+3,Y+H-3,W-5,2);g.fillRect(X+W-3,Y+4,2,H-6);
    // roof bevel highlight (top+left)
    g.fillStyle='rgba(255,248,225,0.22)';
    g.fillRect(X+3,Y+3,W-6,2);g.fillRect(X+3,Y+3,2,H-6);
    // roof sheen: sunlit corner → shaded corner
    const sh=g.createLinearGradient(X,Y,X+W,Y+H);
    sh.addColorStop(0,'rgba(255,246,220,0.10)');
    sh.addColorStop(.5,'rgba(0,0,0,0)');
    sh.addColorStop(1,'rgba(6,8,14,0.16)');
    g.fillStyle=sh;g.fillRect(X+3,Y+3,W-6,H-6);
    // roof furniture: seeded vents/AC boxes with drop shadows + a duct line
    const nf=2+((W*H)>>13);
    for(let i=0;i<nf;i++){
      const fw=8+rnd()*8,fh=6+rnd()*6;
      const fx=X+8+rnd()*(W-24-fw),fy=Y+8+rnd()*(H-26-fh);
      g.fillStyle='rgba(0,0,0,0.3)';g.fillRect(fx+2,fy+2,fw,fh);
      g.fillStyle=rnd()<.5?'#4c5450':'#585f56';g.fillRect(fx,fy,fw,fh);
      g.fillStyle='rgba(255,248,225,0.28)';g.fillRect(fx,fy,fw,1.6);
      g.strokeStyle='rgba(10,12,10,0.6)';g.lineWidth=1;g.strokeRect(fx,fy,fw,fh);
      if(rnd()<.5){g.strokeStyle='rgba(20,22,20,0.55)';for(let v=2;v<fw-2;v+=3){g.beginPath();g.moveTo(fx+v,fy+1.5);g.lineTo(fx+v,fy+fh-1.5);g.stroke()}}
    }
    g.strokeStyle='rgba(30,34,32,0.55)';g.lineWidth=2.4;
    const py=Y+6+rnd()*(H-16);
    g.beginPath();g.moveTo(X+5,py);g.lineTo(X+5+(W-10)*(.4+rnd()*.4),py);g.stroke();
    g.strokeStyle='rgba(255,248,225,0.14)';g.lineWidth=1;
    g.beginPath();g.moveTo(X+5,py-1);g.lineTo(X+5+(W-10)*.4,py-1);g.stroke();
  }
  // bold faction stripe: left-edge band with hazard notch — ownership pops at a glance
  g.fillStyle='rgba(0,0,0,0.35)';g.fillRect(X+3,Y+3,7,H-6);
  g.fillStyle=ac;g.fillRect(X+4,Y+4,5,H-8);
  g.fillStyle='rgba(0,0,0,0.35)';
  for(let yy=Y+8;yy<Y+H-8;yy+=11)g.fillRect(X+4,yy,5,4);
  // corner beacons
  g.fillStyle=ac;
  g.beginPath();g.arc(X+W-8,Y+7,2.2,0,7);g.fill();
  g.beginPath();g.arc(X+W-8,Y+H-8,2.2,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,0.5)';
  g.beginPath();g.arc(X+W-8.6,Y+6.4,0.9,0,7);g.fill();
}
/* ── v63 Building Redesign: distinct silhouettes for the core five.
      Overrides the base painters (kit still applies on top). ── */
const _bRedesign={
  command(g,X,Y,W,H,C,ac){
    // two-tier stepped HQ + comms spire + helipad
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(24);g.fillRect(X+3,Y+3,W-6,H-6);                       // lower tier
    g.fillStyle=C(32);g.fillRect(X+10,Y+8,W-20,H-30);                    // upper tier
    g.fillStyle=C(40);g.fillRect(X+10,Y+8,W-20,10);
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);g.strokeRect(X+10,Y+8,W-20,H-30);
    // helipad
    g.fillStyle='#20242a';g.beginPath();g.arc(X+W*.68,Y+H-26,20,0,7);g.fill();
    g.strokeStyle='#aeb8c4';g.lineWidth=2;g.beginPath();g.arc(X+W*.68,Y+H-26,16,0,7);g.stroke();
    g.font='bold 15px sans-serif';g.fillStyle='#aeb8c4';g.textAlign='center';g.textBaseline='middle';
    g.fillText('H',X+W*.68,Y+H-26);
    // comms spire + dish
    g.fillStyle=C(16);g.fillRect(X+18,Y+12,10,14);
    g.strokeStyle='#c8ccc4';g.lineWidth=2;g.beginPath();g.moveTo(X+23,Y+12);g.lineTo(X+23,Y-6);g.stroke();
    g.fillStyle='#ff5147';g.beginPath();g.arc(X+23,Y-7,2.4,0,7);g.fill();
    g.fillStyle='#d4d8d0';g.beginPath();g.ellipse(X+40,Y+16,7,4.6,-.6,0,7);g.fill();
    g.strokeStyle='#6a7066';g.beginPath();g.ellipse(X+40,Y+16,7,4.6,-.6,0,7);g.stroke();
    // command glass strip
    g.fillStyle='#9fd8f0';g.fillRect(X+14,Y+H-26,W*.34,8);
    g.fillStyle='rgba(255,255,255,.5)';g.fillRect(X+14,Y+H-26,W*.34,2.4);
    g.fillStyle=ac;g.fillRect(X+12,Y+H-14,W*.4,4);
  },
  power(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(24);g.fillRect(X+3,Y+H*.44,W-6,H*.5);                  // base hall
    g.strokeStyle=C(12);g.lineWidth=1.4;g.strokeRect(X+3,Y+H*.44,W-6,H*.5);
    // twin cooling stacks with glow cores
    for(const cx of[X+W*.32,X+W*.7]){
      g.fillStyle='#2a2f2c';g.beginPath();g.arc(cx,Y+H*.36,W*.2,0,7);g.fill();
      g.fillStyle=C(34);g.beginPath();g.arc(cx,Y+H*.36,W*.16,0,7);g.fill();
      const gl=g.createRadialGradient(cx,Y+H*.36,1,cx,Y+H*.36,W*.11);
      gl.addColorStop(0,'#ffe9a8');gl.addColorStop(.55,'#ff9b3d');gl.addColorStop(1,'rgba(120,40,10,0)');
      g.fillStyle=gl;g.beginPath();g.arc(cx,Y+H*.36,W*.11,0,7);g.fill();
      g.strokeStyle='#14170f';g.lineWidth=1.6;g.beginPath();g.arc(cx,Y+H*.36,W*.2,0,7);g.stroke();
    }
    // pipe manifold + transformer fins
    g.strokeStyle='#565f56';g.lineWidth=4;g.beginPath();g.moveTo(X+W*.32,Y+H*.52);g.lineTo(X+W*.7,Y+H*.52);g.stroke();
    g.strokeStyle='#20251c';g.lineWidth=1.4;
    for(let i=0;i<4;i++){g.strokeRect(X+8+i*7,Y+H-18,4,12)}
    g.fillStyle=ac;g.fillRect(X+W-20,Y+H-16,12,8);
    g.fillStyle='#ffd95e';g.fillRect(X+W-18,Y+H-14,8,4);
  },
  supply(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(26);g.fillRect(X+3,Y+3,W-6,H-6);
    // corrugated warehouse roof
    g.fillStyle=C(34);g.fillRect(X+3,Y+3,W-6,H*.55);
    g.strokeStyle=C(16);g.lineWidth=1;
    for(let x=X+8;x<X+W-8;x+=7){g.beginPath();g.moveTo(x,Y+5);g.lineTo(x,Y+H*.55);g.stroke()}
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
    // loading dock + pallets
    g.fillStyle='#3a3428';g.fillRect(X+6,Y+H*.6,W-12,H*.32);
    g.fillStyle='#ffd95e';for(let x=X+10;x<X+W-16;x+=14)g.fillRect(x,Y+H*.6+2,7,3);
    for(const[px,py]of[[X+10,Y+H*.68],[X+24,Y+H*.72],[X+W-26,Y+H*.66]]){
      g.fillStyle='#8a6a2e';g.fillRect(px,py,11,9);
      g.fillStyle='#a8842e';g.fillRect(px,py,11,3.4);
      g.strokeStyle='#3e2f12';g.lineWidth=1;g.strokeRect(px,py,11,9);
    }
    g.fillStyle=ac;g.fillRect(X+6,Y+6,W*.3,5);
  },
  barracks(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(26);g.fillRect(X+3,Y+3,W-6,H-6);
    // pitched roof with ridge
    g.fillStyle=C(36);g.beginPath();g.moveTo(X+3,Y+H*.42);g.lineTo(X+W/2,Y+6);g.lineTo(X+W-3,Y+H*.42);g.closePath();g.fill();
    g.fillStyle=C(22);g.beginPath();g.moveTo(X+W/2,Y+6);g.lineTo(X+W-3,Y+H*.42);g.lineTo(X+W/2,Y+H*.42);g.closePath();g.fill();
    g.strokeStyle=C(12);g.lineWidth=1.6;
    g.beginPath();g.moveTo(X+3,Y+H*.42);g.lineTo(X+W/2,Y+6);g.lineTo(X+W-3,Y+H*.42);g.stroke();
    g.strokeRect(X+3,Y+3,W-6,H-6);
    // sandbag entrance + door
    g.fillStyle='#171a14';g.fillRect(X+W/2-8,Y+H-20,16,15);
    g.fillStyle='#6b5a3a';
    for(const dx of[-15,-9,9,15]){g.beginPath();g.ellipse(X+W/2+dx,Y+H-8,6,3.6,0,0,7);g.fill()}
    // bunk windows
    g.fillStyle='#9fd8f0';for(let i=0;i<3;i++)g.fillRect(X+10+i*((W-30)/2.4),Y+H*.5,10,7);
    g.fillStyle=ac;g.fillRect(X+W/2-14,Y+H*.42-4,28,4);
  },
  factory(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(24);g.fillRect(X+3,Y+3,W-6,H-6);
    // sawtooth industrial roof
    const teeth=4,tw=(W-6)/teeth;
    for(let i=0;i<teeth;i++){
      const tx=X+3+i*tw;
      g.fillStyle=C(34);g.beginPath();g.moveTo(tx,Y+H*.4);g.lineTo(tx,Y+8);g.lineTo(tx+tw,Y+H*.4);g.closePath();g.fill();
      g.fillStyle='#9fd8f0';g.beginPath();g.moveTo(tx+1.5,Y+H*.4-2);g.lineTo(tx+1.5,Y+12);g.lineTo(tx+tw*.42,Y+H*.4-2);g.closePath();g.fill();
      g.strokeStyle=C(12);g.lineWidth=1.2;g.beginPath();g.moveTo(tx,Y+H*.4);g.lineTo(tx,Y+8);g.lineTo(tx+tw,Y+H*.4);g.stroke();
    }
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
    // big vehicle bay with hazard frame
    g.fillStyle='#14170f';g.fillRect(X+W*.3,Y+H-26,W*.4,21);
    g.fillStyle='#ffd95e';g.fillRect(X+W*.3-4,Y+H-26,4,21);g.fillRect(X+W*.7,Y+H-26,4,21);
    g.strokeStyle='#3a4034';g.lineWidth=1;
    for(let yy=Y+H-23;yy<Y+H-6;yy+=4){g.beginPath();g.moveTo(X+W*.3,yy);g.lineTo(X+W*.7,yy);g.stroke()}
    // smokestack + crane arm
    g.fillStyle='#3a3f3a';g.fillRect(X+W-18,Y+10,9,16);
    g.fillStyle='#14170f';g.fillRect(X+W-18,Y+8,9,4);
    g.strokeStyle='#565f56';g.lineWidth=3;g.beginPath();g.moveTo(X+10,Y+H*.46);g.lineTo(X+W*.4,Y+H*.46);g.stroke();
    g.strokeStyle='#20251c';g.lineWidth=1;g.beginPath();g.moveTo(X+W*.34,Y+H*.46);g.lineTo(X+W*.34,Y+H*.6);g.stroke();
    g.fillStyle=ac;g.fillRect(X+6,Y+H-10,W*.18,5);
  },
  market(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle='#4a3f2a';g.fillRect(X+3,Y+3,W-6,H-6); // bazaar ground
    g.strokeStyle='#2a2416';g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
    // canopy on poles, striped
    g.fillStyle='#20251c';for(const[px,py]of[[X+8,Y+8],[X+W-11,Y+8],[X+8,Y+H*.5],[X+W-11,Y+H*.5]])g.fillRect(px,py,3,H*.4);
    for(let i=0;i<(W-10)/9;i++){g.fillStyle=i%2?ac:'#e8e3d2';g.fillRect(X+5+i*9,Y+5,9,H*.42)}
    g.strokeStyle='#14170f';g.lineWidth=1.4;g.strokeRect(X+5,Y+5,W-10,H*.42);
    // goods: crates + barrel + coin sign
    for(const[cx,cy]of[[X+9,Y+H-19],[X+22,Y+H-15],[X+W-24,Y+H-18]]){
      g.fillStyle='#8a6a2e';g.fillRect(cx,cy,11,9);g.fillStyle='#a8842e';g.fillRect(cx,cy,11,3.2);
      g.strokeStyle='#3e2f12';g.lineWidth=1;g.strokeRect(cx,cy,11,9);
    }
    g.fillStyle='#9c3a30';g.beginPath();g.arc(X+W*.55,Y+H-14,5.5,0,7);g.fill();
    g.fillStyle='#191407';g.beginPath();g.arc(X+W*.32,Y+H*.3,8,0,7);g.fill();
    g.fillStyle='#ffd95e';g.beginPath();g.arc(X+W*.32,Y+H*.3-1,7,0,7);g.fill();
    g.fillStyle='#a8801e';g.font='bold 10px sans-serif';g.textAlign='center';g.textBaseline='middle';
    g.fillText('$',X+W*.32,Y+H*.3-1);
  },
  tech(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(24);g.fillRect(X+3,Y+3,W-6,H-6);
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
    // central reactor ring with glow + orbit nodes
    const cx=X+W*.38,cy=Y+H*.5,R=Math.min(W,H)*.3;
    g.strokeStyle='#0c2228';g.lineWidth=6;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();
    g.strokeStyle='#2e7d96';g.lineWidth=4;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();
    const gl=g.createRadialGradient(cx,cy,1,cx,cy,R*.8);
    gl.addColorStop(0,'#c9f2ff');gl.addColorStop(.5,'#4fb3d6');gl.addColorStop(1,'rgba(20,60,80,0)');
    g.fillStyle=gl;g.beginPath();g.arc(cx,cy,R*.8,0,7);g.fill();
    g.fillStyle='#9fe9ff';for(let i=0;i<4;i++){const a2=i*Math.PI/2+.4;g.beginPath();g.arc(cx+Math.cos(a2)*R,cy+Math.sin(a2)*R,3,0,7);g.fill()}
    // server racks
    g.fillStyle=C(16);g.fillRect(X+W*.68,Y+8,W*.24,H-16);
    g.strokeStyle=C(10);g.lineWidth=1;g.strokeRect(X+W*.68,Y+8,W*.24,H-16);
    for(let yy=Y+12;yy<Y+H-14;yy+=7){g.fillStyle='#2a3a34';g.fillRect(X+W*.7,yy,W*.2,4);
      g.fillStyle=Math.random()<.5?'#7dff9a':'#ff5147';g.fillRect(X+W*.7+2,yy+1,2,2)}
    g.fillStyle=ac;g.fillRect(X+6,Y+6,W*.2,4);
  },
  radar(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(24);g.fillRect(X+3,Y+3,W-6,H-6);
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
    // sweep pad rings
    const cx=X+W*.5,cy=Y+H*.52;
    g.strokeStyle='rgba(125,220,255,.3)';g.lineWidth=1.6;
    for(const r of[H*.18,H*.3,H*.42]){g.beginPath();g.arc(cx,cy,r,0,7);g.stroke()}
    // big lattice dish
    g.fillStyle='#20242a';g.beginPath();g.ellipse(cx,cy,H*.34,H*.2,-.5,0,7);g.fill();
    g.fillStyle='#d4d8d0';g.beginPath();g.ellipse(cx-2,cy-2,H*.3,H*.17,-.5,0,7);g.fill();
    g.strokeStyle='#6a7066';g.lineWidth=1;
    g.beginPath();g.ellipse(cx-2,cy-2,H*.3,H*.17,-.5,0,7);g.stroke();
    g.beginPath();g.moveTo(cx-H*.26,cy+H*.1);g.lineTo(cx+H*.22,cy-H*.14);g.stroke();
    g.strokeStyle='#3a3f3a';g.lineWidth=3;g.beginPath();g.moveTo(cx-2,cy-2);g.lineTo(cx+H*.14,cy-H*.18);g.stroke();
    g.fillStyle='#ff5147';g.beginPath();g.arc(cx+H*.15,cy-H*.19,2.2,0,7);g.fill();
    g.fillStyle=ac;g.fillRect(X+6,Y+H-11,W*.26,5);
  },
  repairbay(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(24);g.fillRect(X+3,Y+3,W-6,H-6);
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
    // open service pit with a chassis inside
    g.fillStyle='#14170f';g.fillRect(X+8,Y+H*.34,W-16,H*.5);
    g.strokeStyle='#ffd95e';g.lineWidth=2;g.strokeRect(X+8,Y+H*.34,W-16,H*.5);
    g.fillStyle='#3a4034';g.fillRect(X+W*.3,Y+H*.44,W*.4,H*.28);
    g.fillStyle='#2a2f2c';g.fillRect(X+W*.36,Y+H*.4,W*.28,H*.1);
    g.strokeStyle='#565f56';g.lineWidth=2;g.beginPath();g.moveTo(X+W*.5,Y+H*.34);g.lineTo(X+W*.5,Y+H*.2);g.stroke(); // hoist
    g.fillStyle='#565f56';g.fillRect(X+10,Y+H*.2-2,W-20,4); // gantry rail
    // tool wall
    g.fillStyle='#20251c';g.fillRect(X+8,Y+8,W-16,H*.16);
    g.fillStyle='#8a9478';for(let x=X+12;x<X+W-14;x+=8)g.fillRect(x,Y+11,3,H*.09);
    g.fillStyle=ac;g.fillRect(X+W-24,Y+H-12,16,5);
  },
  turret(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    const cx=X+W/2,cy=Y+H/2,R=Math.min(W,H)*.42;
    g.fillStyle='#4a4d44';g.beginPath(); // octagon bunker
    for(let i=0;i<8;i++){const a2=i*Math.PI/4+Math.PI/8;const px=cx+Math.cos(a2)*R,py=cy+Math.sin(a2)*R;i?g.lineTo(px,py):g.moveTo(px,py)}
    g.closePath();g.fill();g.strokeStyle='#23251f';g.lineWidth=2;g.stroke();
    g.fillStyle='#565a50';g.beginPath();g.arc(cx,cy,R*.62,0,7);g.fill();
    g.strokeStyle='#2e3128';g.lineWidth=1.4;g.beginPath();g.arc(cx,cy,R*.62,0,7);g.stroke();
    g.fillStyle='#8a9478';for(let i=0;i<8;i++){const a2=i*Math.PI/4;g.beginPath();g.arc(cx+Math.cos(a2)*R*.62,cy+Math.sin(a2)*R*.62,1.6,0,7);g.fill()}
    g.fillStyle='#5a5132';g.fillRect(X+5,Y+H-13,10,8);g.strokeStyle='#2e2a18';g.strokeRect(X+5,Y+H-13,10,8);
    g.fillStyle=ac;g.fillRect(cx-3,cy-3,6,6);
  },
  samsite(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle=C(24);g.fillRect(X+3,Y+3,W-6,H-6);
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
    // angled quad launcher
    g.save();g.translate(X+W*.5,Y+H*.52);g.rotate(-.5);
    g.fillStyle='#2a2f2c';g.fillRect(-16,-11,32,22);
    for(let i=0;i<4;i++){const oy=-8+i*5.4;
      g.fillStyle='#d4d8d0';g.fillRect(-13,oy,26,3.4);
      g.fillStyle='#ff5147';g.beginPath();g.moveTo(13,oy);g.lineTo(18,oy+1.7);g.lineTo(13,oy+3.4);g.closePath();g.fill();
    }
    g.restore();
    g.fillStyle='#20242a';g.beginPath();g.arc(X+W*.22,Y+H*.76,6,0,7);g.fill();
    g.fillStyle='#7dff9a';g.beginPath();g.arc(X+W*.22,Y+H*.76,2,0,7);g.fill();
    g.fillStyle=ac;g.fillRect(X+W-22,Y+6,14,4);
  },
  silo(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle='#4a4d44';g.fillRect(X+3,Y+3,W-6,H-6);
    g.strokeStyle='#23251f';g.lineWidth=2;g.strokeRect(X+3,Y+3,W-6,H-6);
    const cx=X+W/2,cy=Y+H*.46,R=Math.min(W,H)*.32;
    g.strokeStyle='#ffb02e';g.lineWidth=3;g.setLineDash([7,5]);g.beginPath();g.arc(cx,cy,R+7,0,7);g.stroke();g.setLineDash([]);
    g.fillStyle='#23251f';g.beginPath();g.arc(cx,cy,R+3,0,7);g.fill();
    g.fillStyle='#3a3d35';g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
    g.fillStyle='#474b41';g.beginPath();g.arc(cx,cy,R,-Math.PI/2,Math.PI/2);g.closePath();g.fill();
    g.strokeStyle='#14150f';g.lineWidth=2;g.beginPath();g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
    g.fillStyle='#ffb02e';for(let i=0;i<3;i++){const a2=-Math.PI/2+i*2.09;
      g.save();g.translate(cx,cy);g.rotate(a2);g.beginPath();g.moveTo(0,-3);g.lineTo(R*.6,-R*.3);g.lineTo(R*.6,R*.3-5);g.closePath();g.fill();g.restore()}
    g.fillStyle='#565a50';g.fillRect(X+W-24,Y+8,16,12);g.strokeStyle='#23251f';g.strokeRect(X+W-24,Y+8,16,12);
    pHazard(g,X+4,Y+H-11,W-8,7);
  },
  airfield(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    g.fillStyle='#3c4038';g.fillRect(X+3,Y+3,W-6,H-6); // tarmac
    g.strokeStyle='#23251f';g.lineWidth=1.8;g.strokeRect(X+3,Y+3,W-6,H-6);
    // runway centerline + threshold stripes
    g.fillStyle='#d4d8c8';for(let x=X+10;x<X+W-14;x+=14)g.fillRect(x,Y+H*.5-1.6,8,3.2);
    for(let i=0;i<5;i++){g.fillRect(X+6,Y+8+i*5,3,3);g.fillRect(X+W-9,Y+8+i*5,3,3)}
    // pad circles
    for(const px of[X+W*.3,X+W*.7]){
      g.strokeStyle='#aeb8a4';g.lineWidth=2;g.beginPath();g.arc(px,Y+H*.74,11,0,7);g.stroke();
      g.fillStyle='rgba(255,217,94,.5)';g.beginPath();g.arc(px,Y+H*.74,2.4,0,7);g.fill();
    }
    // control tower + windsock
    g.fillStyle=C(30);g.fillRect(X+W-26,Y+7,18,16);g.strokeStyle=C(12);g.strokeRect(X+W-26,Y+7,18,16);
    g.fillStyle='#9fd8f0';g.fillRect(X+W-23,Y+10,12,5);
    g.strokeStyle='#8a9478';g.lineWidth=1.6;g.beginPath();g.moveTo(X+10,Y+10);g.lineTo(X+10,Y+2);g.stroke();
    g.fillStyle='#ff7a3d';g.beginPath();g.moveTo(X+10,Y+2);g.lineTo(X+20,Y+4);g.lineTo(X+10,Y+6);g.closePath();g.fill();
    g.fillStyle=ac;g.fillRect(X+6,Y+H-10,W*.2,4);
  },
  watchtower(g,X,Y,W,H,C,ac){
    pShadow(g,X,Y,W,H);
    // X-braced legs
    g.strokeStyle='#5a5132';g.lineWidth=3;
    g.beginPath();g.moveTo(X+7,Y+H-5);g.lineTo(X+W-9,Y+9);g.moveTo(X+W-9,Y+H-5);g.lineTo(X+7,Y+9);g.stroke();
    g.strokeStyle='#3e3620';g.lineWidth=4;
    g.beginPath();g.moveTo(X+6,Y+H-4);g.lineTo(X+10,Y+8);g.moveTo(X+W-6,Y+H-4);g.lineTo(X+W-10,Y+8);g.stroke();
    // cabin
    g.fillStyle=C(30);g.fillRect(X+6,Y+5,W-12,H*.4);
    g.strokeStyle=C(12);g.lineWidth=1.6;g.strokeRect(X+6,Y+5,W-12,H*.4);
    g.fillStyle='#9fd8f0';g.fillRect(X+9,Y+9,W-18,6);
    g.fillStyle=C(38);g.fillRect(X+4,Y+3,W-8,4); // roof lip
    // searchlight cone hint
    g.fillStyle='rgba(255,240,180,.16)';g.beginPath();g.moveTo(X+W-10,Y+12);g.lineTo(X+W+16,Y+2);g.lineTo(X+W+16,Y+26);g.closePath();g.fill();
    g.fillStyle='#ffe9a8';g.beginPath();g.arc(X+W-10,Y+12,2.6,0,7);g.fill();
    g.fillStyle=ac;g.fillRect(X+8,Y+H*.4+1,W-16,3);
  },
};
const _bSprRaw=bSpr;
bSpr=function(type,fk,gen){
  let cv;
  if(_bRedesign[type]){
    const t=BT[type],W=t.w*TILE,H=t.h*TILE;
    cv=spr('R63_'+type+'_'+fk,W+BM*2,H+BM*2,g=>{
      const F=FACTIONS[fk]||{c:'#9aa48c'},ac=F.c,C=facCol(fk);
      _bRedesign[type](g,BM,BM,W,H,C,ac);
    });
  }else cv=_bSprRaw(type,fk,gen);
  if(cv&&!cv._kit){cv._kit=true;try{_bKit(cv,type,fk)}catch(e){}}
  return cv;
};
function uSpr(type,fk){
  const F=FACTIONS[fk],ac=F.c,C=facCol(fk);
  switch(type){
    case 'tank':return spr('Utank_'+fk,44,30,g=>{
      g.translate(22,15);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,19,12,0,0,7);g.fill();
      if(fk==='crimson'){
        // Warlord — wide blocky hull, exhaust stacks, riveted
        trackPair(g,40,30);
        g.fillStyle=C(27);g.beginPath();g.moveTo(-18,-10);g.lineTo(12,-10);g.lineTo(18,-3.5);g.lineTo(18,3.5);g.lineTo(12,10);g.lineTo(-18,10);g.closePath();g.fill();
        g.fillStyle=C(34);g.beginPath();g.moveTo(-18,-10);g.lineTo(12,-10);g.lineTo(18,-3.5);g.lineTo(18,0);g.lineTo(-18,0);g.closePath();g.fill();
        g.strokeStyle=C(13);g.lineWidth=1.5;g.beginPath();g.moveTo(-18,-10);g.lineTo(12,-10);g.lineTo(18,-3.5);g.lineTo(18,3.5);g.lineTo(12,10);g.lineTo(-18,10);g.closePath();g.stroke();
        g.fillStyle='#111108';g.fillRect(-20,-9,3.5,5.5);g.fillRect(-20,3.5,3.5,5.5);
        g.fillStyle='#3a2c18';g.fillRect(-19.8,-8.8,1.8,5);g.fillRect(-19.8,3.7,1.8,5);
        for(let i=0;i<4;i++){g.fillStyle=C(42);g.beginPath();g.arc(-12+i*7,-9.8,1.6,0,7);g.fill();g.beginPath();g.arc(-12+i*7,9.8,1.6,0,7);g.fill();}
        g.fillStyle=ac;g.fillRect(8,-9,3.5,18);
      }else if(fk==='scorpion'){
        // Marauder — low wedge hull, sand camo stripes
        trackPair(g,38,26);
        g.fillStyle=C(31);g.beginPath();g.moveTo(-16,-7);g.lineTo(9,-8);g.lineTo(20,-2.5);g.lineTo(20,2.5);g.lineTo(9,8);g.lineTo(-16,7);g.closePath();g.fill();
        g.fillStyle=C(38);g.beginPath();g.moveTo(-16,-7);g.lineTo(9,-8);g.lineTo(20,-2.5);g.lineTo(20,0);g.lineTo(-16,0);g.closePath();g.fill();
        g.strokeStyle=C(15);g.lineWidth=1.3;g.beginPath();g.moveTo(-16,-7);g.lineTo(9,-8);g.lineTo(20,-2.5);g.lineTo(20,2.5);g.lineTo(9,8);g.lineTo(-16,7);g.closePath();g.stroke();
        g.fillStyle='rgba(0,0,0,.14)';g.beginPath();g.moveTo(-6,-8);g.lineTo(2,-8);g.lineTo(-12,8);g.lineTo(-20,8);g.closePath();g.fill();
        g.fillStyle='rgba(255,255,255,.07)';g.beginPath();g.moveTo(3,-8);g.lineTo(11,-7);g.lineTo(-3,8);g.lineTo(-12,8);g.closePath();g.fill();
        g.fillStyle=ac;g.fillRect(9,-6.5,3.5,13);
      }else if(fk==='northwind'){
        // Glacier — wide boxy hull, front skirt plates
        trackPair(g,38,30);
        g.fillStyle=C(29);g.beginPath();g.moveTo(-18,-10);g.lineTo(8,-10);g.lineTo(14,-3.5);g.lineTo(14,3.5);g.lineTo(8,10);g.lineTo(-18,10);g.closePath();g.fill();
        g.fillStyle=C(36);g.beginPath();g.moveTo(-18,-10);g.lineTo(8,-10);g.lineTo(14,-3.5);g.lineTo(14,0);g.lineTo(-18,0);g.closePath();g.fill();
        g.strokeStyle=C(15);g.lineWidth=1.4;g.beginPath();g.moveTo(-18,-10);g.lineTo(8,-10);g.lineTo(14,-3.5);g.lineTo(14,3.5);g.lineTo(8,10);g.lineTo(-18,10);g.closePath();g.stroke();
        g.fillStyle=C(22);g.fillRect(-17,-13.5,26,3.5);g.fillRect(-17,10,26,3.5);
        g.strokeStyle=C(12);g.lineWidth=.9;g.strokeRect(-17,-13.5,26,3.5);g.strokeRect(-17,10,26,3.5);
        g.fillStyle=ac;g.fillRect(5,-9,3.5,18);
      }else{
        // Vanguard Crusader — angular hull, louvered engine panel
        trackPair(g,38,28);
        g.fillStyle=C(29);g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,3);g.lineTo(11,8);g.lineTo(-16,8);g.closePath();g.fill();
        g.fillStyle=C(36);g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,0);g.lineTo(-16,0);g.closePath();g.fill();
        g.strokeStyle=C(15);g.lineWidth=1.4;g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,3);g.lineTo(11,8);g.lineTo(-16,8);g.closePath();g.stroke();
        g.fillStyle=C(18);g.fillRect(-15,-5,6,10);
        g.strokeStyle=C(10);g.lineWidth=1;for(let i=0;i<3;i++){g.beginPath();g.moveTo(-14.4,-3+i*3);g.lineTo(-9.6,-3+i*3);g.stroke()}
        g.fillStyle='#1d231a';g.fillRect(-18,-6,3,4);
        g.fillStyle=ac;g.fillRect(7,-7.4,4,14.8);
      }
    });
    case 'dominator':return spr('Udom_'+fk,50,34,g=>{
      g.translate(25,17);
      g.fillStyle='rgba(0,0,0,.32)';g.beginPath();g.ellipse(1,2,22,14,0,0,7);g.fill();
      trackPair(g,44,32);
      g.fillStyle=C(27);
      g.beginPath();g.moveTo(-19,-9.5);g.lineTo(13,-9.5);g.lineTo(21,-4);g.lineTo(21,4);g.lineTo(13,9.5);g.lineTo(-19,9.5);g.closePath();g.fill();
      g.fillStyle=C(34);
      g.beginPath();g.moveTo(-19,-9.5);g.lineTo(13,-9.5);g.lineTo(21,-4);g.lineTo(21,0);g.lineTo(-19,0);g.closePath();g.fill();
      g.strokeStyle=C(13);g.lineWidth=1.6;
      g.beginPath();g.moveTo(-19,-9.5);g.lineTo(13,-9.5);g.lineTo(21,-4);g.lineTo(21,4);g.lineTo(13,9.5);g.lineTo(-19,9.5);g.closePath();g.stroke();
      // side armor plates
      g.fillStyle=C(22);g.fillRect(-16,-11.5,26,3.4);g.fillRect(-16,8.1,26,3.4);
      g.fillStyle='#1d231a';g.fillRect(-22,-7,4,5);g.fillRect(-22,2,4,5);
      g.fillStyle=ac;g.fillRect(9,-8.6,5,17.2);
    });
    case 'paladin':return spr('Upal_'+fk,44,28,g=>{
      g.translate(22,14);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,19,11,0,0,7);g.fill();
      trackPair(g,36,26);
      g.fillStyle=C(31);
      g.beginPath();g.moveTo(-15,-7);g.lineTo(8,-7);g.lineTo(18,-2.4);g.lineTo(18,2.4);g.lineTo(8,7);g.lineTo(-15,7);g.closePath();g.fill();
      g.fillStyle=C(39);
      g.beginPath();g.moveTo(-15,-7);g.lineTo(8,-7);g.lineTo(18,-2.4);g.lineTo(18,0);g.lineTo(-15,0);g.closePath();g.fill();
      g.strokeStyle=C(16);g.lineWidth=1.3;
      g.beginPath();g.moveTo(-15,-7);g.lineTo(8,-7);g.lineTo(18,-2.4);g.lineTo(18,2.4);g.lineTo(8,7);g.lineTo(-15,7);g.closePath();g.stroke();
      // energy core glow
      g.fillStyle='#7ddcff';g.beginPath();g.arc(-9,0,2.8,0,7);g.fill();
      g.fillStyle='rgba(125,220,255,.35)';g.beginPath();g.arc(-9,0,5,0,7);g.fill();
      g.fillStyle=ac;g.fillRect(6,-6.4,4,12.8);
    });
    case 'flak':return spr('Uflak_'+fk,40,26,g=>{
      g.translate(20,13);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,16,9,0,0,7);g.fill();
      // tracked chassis
      g.fillStyle='#14180f';g.fillRect(-15,-10,30,6);g.fillRect(-15,4,30,6);
      g.fillStyle='#3a4034';for(let i=0;i<5;i++){g.fillRect(-13+i*6.4,-9,3,4);g.fillRect(-13+i*6.4,5,3,4)}
      // hull
      g.fillStyle=C(32);g.fillRect(-13,-6,26,12);
      g.fillStyle=C(40);g.fillRect(-13,-6,26,5);
      g.strokeStyle=C(14);g.lineWidth=1.2;g.strokeRect(-13,-6,26,12);
      // radar dish (spins live in drawUnit? keep baked)
      g.fillStyle='#c8cec0';g.beginPath();g.ellipse(-8,0,4,2.6,-.5,0,7);g.fill();
      g.strokeStyle='#5a6052';g.lineWidth=1;g.beginPath();g.ellipse(-8,0,4,2.6,-.5,0,7);g.stroke();
      // quad AA barrels angled up
      g.strokeStyle='#1d221a';g.lineWidth=2.2;
      for(const off of[-3.4,-1.2,1.2,3.4]){g.beginPath();g.moveTo(2,off);g.lineTo(15,off*.7-3);g.stroke()}
      g.fillStyle=C(24);g.fillRect(-1,-4.5,7,9);
      g.fillStyle=ac;g.fillRect(-12,-4.6,3,9.2);
      // muzzle tips
      g.fillStyle='#ffd98a';for(const off of[-3.4,-1.2,1.2,3.4]){g.beginPath();g.arc(15,off*.7-3,1,0,7);g.fill()}
    });
    case 'technical':return spr('Utec_'+fk,42,24,g=>{
      g.translate(21,12);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,17,9,0,0,7);g.fill();
      g.fillStyle='#14180f';
      for(const wx of[-11,11])for(const wy of[-8.5,8.5]){g.beginPath();g.arc(wx,wy,4.4,0,7);g.fill()}
      g.fillStyle='#3a4034';
      for(const wx of[-11,11])for(const wy of[-8.5,8.5]){g.beginPath();g.arc(wx,wy,1.7,0,7);g.fill()}
      // open bed
      g.fillStyle=C(30);g.fillRect(-17,-7,20,14);
      g.fillStyle=C(18);g.fillRect(-15,-5,16,10);
      g.strokeStyle=C(12);g.lineWidth=1.2;g.strokeRect(-17,-7,20,14);
      // cab
      g.fillStyle=C(38);g.fillRect(3,-7,14,14);
      g.fillStyle=C(46);g.fillRect(3,-7,14,5.5);
      g.fillStyle='#9fc3d4';g.beginPath();g.moveTo(15,-5);g.lineTo(18,-3.4);g.lineTo(18,3.4);g.lineTo(15,5);g.closePath();g.fill();
      g.strokeStyle=C(14);g.lineWidth=1.1;g.strokeRect(3,-7,14,14);
      g.fillStyle=ac;g.fillRect(4,-2.6,4.6,5.2);
      // rust patches (scavenger flavor)
      g.fillStyle='rgba(122,72,32,.5)';g.fillRect(-13,3,5,3);g.fillRect(8,-6.5,4,2.4);
    });
    case 'arty':return spr('Uarty_'+fk,42,28,g=>{
      g.translate(21,14);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,17,11,0,0,7);g.fill();
      if(fk==='crimson'){
        // Dragonfire — heavy siege hull, wide breech, prominent barrel stub
        trackPair(g,36,28);
        g.fillStyle=C(26);g.beginPath();g.moveTo(-15,-9);g.lineTo(14,-9);g.lineTo(17,-3);g.lineTo(17,3);g.lineTo(14,9);g.lineTo(-15,9);g.closePath();g.fill();
        g.fillStyle=C(33);g.beginPath();g.moveTo(-15,-9);g.lineTo(14,-9);g.lineTo(17,-3);g.lineTo(17,0);g.lineTo(-15,0);g.closePath();g.fill();
        g.strokeStyle=C(12);g.lineWidth=1.5;g.strokeRect(-15,-9,32,18);
        g.fillStyle=C(18);g.fillRect(-15,-7,5,14);g.strokeStyle=C(10);g.lineWidth=.9;g.strokeRect(-15,-7,5,14);
        g.fillStyle=C(22);g.fillRect(14,-12,4,24);
        g.strokeStyle=C(11);g.lineWidth=1.2;g.strokeRect(14,-12,4,24);
        for(let i=0;i<4;i++){g.fillStyle=C(40);g.beginPath();g.arc(-10+i*8,-9,1.6,0,7);g.fill();}
        g.fillStyle=ac;g.fillRect(10,-8,3.5,16);
      }else if(fk==='scorpion'){
        // Junk Lobber — wheeled chassis, improvised rocket tubes
        g.fillStyle='#14180f';for(const wx of[-12,10])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,4,0,7);g.fill()}
        g.fillStyle='#3a4034';for(const wx of[-12,10])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,1.6,0,7);g.fill()}
        g.fillStyle=C(30);g.fillRect(-16,-6,28,12);g.fillStyle=C(37);g.fillRect(-16,-6,28,5.5);
        g.strokeStyle=C(13);g.lineWidth=1.2;g.strokeRect(-16,-6,28,12);
        g.fillStyle='rgba(122,72,32,.5)';g.fillRect(-14,1,5,4);g.fillRect(6,-5.5,4,3);
        g.fillStyle=C(20);g.fillRect(-22,-5,7,10);
        g.fillStyle=ac;g.fillRect(7,-5.5,3.5,11);
      }else if(fk==='northwind'){
        // Avalanche — wide mortar carrier, enclosed armored cab
        trackPair(g,36,28);
        g.fillStyle=C(30);g.beginPath();g.moveTo(-14,-8);g.lineTo(10,-8);g.lineTo(14,-2.5);g.lineTo(14,2.5);g.lineTo(10,8);g.lineTo(-14,8);g.closePath();g.fill();
        g.fillStyle=C(37);g.beginPath();g.moveTo(-14,-8);g.lineTo(10,-8);g.lineTo(14,-2.5);g.lineTo(14,0);g.lineTo(-14,0);g.closePath();g.fill();
        g.strokeStyle=C(14);g.lineWidth=1.3;g.beginPath();g.moveTo(-14,-8);g.lineTo(10,-8);g.lineTo(14,-2.5);g.lineTo(14,2.5);g.lineTo(10,8);g.lineTo(-14,8);g.closePath();g.stroke();
        g.fillStyle=C(24);g.fillRect(-14,-6,6,12);g.strokeStyle=C(12);g.lineWidth=.9;g.strokeRect(-14,-6,6,12);
        g.fillStyle='#8fb4c4';g.fillRect(-13,-4,4,6);
        g.fillStyle=ac;g.fillRect(6,-7,3.5,14);
      }else{
        // Vanguard Thunderer — tracked SPG
        trackPair(g,34,26);
        g.fillStyle=C(28);g.beginPath();g.moveTo(-14,-7);g.lineTo(12,-7);g.lineTo(16,-2);g.lineTo(16,2);g.lineTo(12,7);g.lineTo(-14,7);g.closePath();g.fill();
        g.fillStyle=C(35);g.beginPath();g.moveTo(-14,-7);g.lineTo(12,-7);g.lineTo(16,-2);g.lineTo(16,0);g.lineTo(-14,0);g.closePath();g.fill();
        g.strokeStyle=C(14);g.lineWidth=1.4;g.strokeRect(-14,-7,30,14);
        g.fillStyle=C(20);g.beginPath();g.moveTo(-14,-5);g.lineTo(-20,-7);g.lineTo(-20,7);g.lineTo(-14,5);g.closePath();g.fill();
        g.fillStyle=ac;g.fillRect(8,-6.4,4,12.8);
      }
    });
    case 'truck':return spr('Utruck_'+fk,46,28,g=>{
      g.translate(23,14);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,19,11,0,0,7);g.fill();
      g.fillStyle='#14180f';
      for(const wx of[-15,-7,12])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,4.6,0,7);g.fill()}
      g.fillStyle='#3a4034';
      for(const wx of[-15,-7,12])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,1.8,0,7);g.fill()}
      g.fillStyle=C(30);g.fillRect(-20,-8,28,16);
      g.fillStyle=C(37);g.fillRect(-20,-8,28,7);
      g.strokeStyle=C(15);g.lineWidth=1.2;
      for(let i=0;i<5;i++){g.beginPath();g.moveTo(-17+i*5.5,-8);g.lineTo(-17+i*5.5,8);g.stroke()}
      g.strokeRect(-20,-8,28,16);
      g.fillStyle=C(33);g.fillRect(8,-8,13,16);
      g.fillStyle=C(41);g.fillRect(8,-8,13,6);
      g.fillStyle='#9fc3d4';g.beginPath();g.moveTo(19,-6);g.lineTo(22,-4);g.lineTo(22,4);g.lineTo(19,6);g.closePath();g.fill();
      g.fillStyle=ac;g.fillRect(9,-3,5,6);
      g.strokeStyle=C(14);g.lineWidth=1.2;g.strokeRect(8,-8,13,16);
    });
    case 'drone':return spr('Udrone_'+fk,36,30,g=>{
      g.translate(18,15);
      // hover shadow further offset
      g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(2,5,12,7,0,0,7);g.fill();
      // rotor blur discs
      g.fillStyle='rgba(180,200,190,.18)';
      for(const[rx,ry]of[[-9,-9],[-9,9],[9,-9],[9,9]]){g.beginPath();g.arc(rx,ry,6.2,0,7);g.fill()}
      g.strokeStyle='rgba(220,235,225,.5)';g.lineWidth=1;
      for(const[rx,ry]of[[-9,-9],[-9,9],[9,-9],[9,9]]){g.beginPath();g.arc(rx,ry,6.2,0,7);g.stroke()}
      // arms
      g.strokeStyle=C(20);g.lineWidth=2.6;
      g.beginPath();g.moveTo(-8,-8);g.lineTo(8,8);g.moveTo(-8,8);g.lineTo(8,-8);g.stroke();
      // body pod
      g.fillStyle=C(34);g.beginPath();g.ellipse(0,0,8.6,6.4,0,0,7);g.fill();
      g.fillStyle=C(43);g.beginPath();g.ellipse(-.8,-1.2,5.8,4,0,0,7);g.fill();
      g.strokeStyle=C(15);g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,8.6,6.4,0,0,7);g.stroke();
      // sensor eye + gun
      g.fillStyle='#9fe9ff';g.beginPath();g.arc(4.6,0,2,0,7);g.fill();
      g.fillStyle=C(12);g.fillRect(8,-1.3,8,2.6);
      g.fillStyle=ac;g.fillRect(-4,-3.6,2.6,7.2);
    });
    case 'scarab':return spr('Uscar_'+fk,36,24,g=>{
      g.translate(18,12);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,14,8,0,0,7);g.fill();
      g.fillStyle='#14180f';
      for(const wx of[-9,9])for(const wy of[-8,8]){g.beginPath();g.arc(wx,wy,4,0,7);g.fill()}
      g.fillStyle='#3a4034';
      for(const wx of[-9,9])for(const wy of[-8,8]){g.beginPath();g.arc(wx,wy,1.5,0,7);g.fill()}
      // ramshackle body
      g.fillStyle=C(31);g.fillRect(-13,-6,24,12);
      g.fillStyle=C(39);g.fillRect(-13,-6,24,5);
      g.strokeStyle=C(13);g.lineWidth=1.2;g.strokeRect(-13,-6,24,12);
      // strapped explosive barrels
      g.fillStyle='#9c3a30';g.beginPath();g.arc(-5,0,4.6,0,7);g.fill();
      g.fillStyle='#c0584a';g.beginPath();g.arc(-6,-1,2.8,0,7);g.fill();
      g.fillStyle='#9c3a30';g.beginPath();g.arc(3,0,4.6,0,7);g.fill();
      g.fillStyle='#c0584a';g.beginPath();g.arc(2,-1,2.8,0,7);g.fill();
      g.strokeStyle='#2a1410';g.lineWidth=1.2;
      g.beginPath();g.moveTo(-13,-3);g.lineTo(11,-3);g.moveTo(-13,3);g.lineTo(11,3);g.stroke();
      // hazard nose stripes
      g.fillStyle='#ffd95e';g.fillRect(11,-6,3,12);
      g.fillStyle='#191407';
      for(let i=0;i<3;i++)g.fillRect(11,-6+i*4+1.4,3,2);
      // blinking fuse light baked bright
      g.fillStyle='#ff5147';g.beginPath();g.arc(-10,-4,1.8,0,7);g.fill();
      g.fillStyle=ac;g.fillRect(7,-5,2.6,10);
    });
    case 'dozer':return spr('Udozer_'+fk,44,30,g=>{
      g.translate(22,15);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,18,12,0,0,7);g.fill();
      trackPair(g,32,28);
      g.fillStyle='#8f7f37';g.fillRect(-13,-8,24,16);
      g.fillStyle='#a8973f';g.fillRect(-13,-8,24,7);
      g.strokeStyle='#4d431c';g.lineWidth=1.4;g.strokeRect(-13,-8,24,16);
      g.fillStyle='#3a3f33';g.fillRect(-9,-5,11,10);
      g.fillStyle='#8fb4c4';g.fillRect(-7,-3.4,7,6.8);
      g.strokeStyle='#20251c';g.lineWidth=1;g.strokeRect(-9,-5,11,10);
      g.fillStyle='#1d231a';g.fillRect(3,-7,2.6,5);
      g.strokeStyle='#6f6230';g.lineWidth=2.6;
      g.beginPath();g.moveTo(8,-6);g.lineTo(16,-8);g.moveTo(8,6);g.lineTo(16,8);g.stroke();
      g.fillStyle='#9aa88c';g.fillRect(16,-12,5,24);
      g.fillStyle='#c9a23a';g.fillRect(17,-12,1.6,24);
      g.fillStyle='#5a5246';g.fillRect(20,-12,1,24);
      g.fillStyle=ac;g.fillRect(-12.4,-2.6,3.6,5.2);
    });
  }
  return null;
}
/* --- soldier painter (shared by world + icons) --- */
function drawSoldier(g,type,ac,R,moving,ph,fk){
  if(moving){
    g.strokeStyle='#2c3326';g.lineWidth=2.8;
    const lo=Math.sin(ph)*4.2;
    g.beginPath();g.moveTo(-1,-2.6);g.lineTo(-4+lo,-4.2);g.moveTo(-1,2.6);g.lineTo(-4-lo,4.2);g.stroke();
  }
  g.fillStyle='#11160e';g.beginPath();g.arc(0,0,R+1,0,7);g.fill();
  if(fk==='northwind'){
    // Heavy parka — wider body silhouette + visible collar
    g.fillStyle='#2a3440';g.beginPath();g.arc(0,0,R*1.12,0,7);g.fill();
    g.fillStyle='#3a4a58';g.beginPath();g.arc(-1,-1,R*.7,0,7);g.fill();
    g.fillStyle='#4a5c6a';g.beginPath();g.arc(-0.5,-0.5,R*.45,0,7);g.fill();
  }else if(fk==='crimson'){
    // Heavy assault armor — dark plates + shoulder pad outline
    g.fillStyle='#1a1208';g.beginPath();g.arc(0,0,R*1.05,0,7);g.fill();
    g.fillStyle='#2e1e0e';g.beginPath();g.arc(-1,-1,R*.65,0,7);g.fill();
    g.fillStyle='#3c2a14';g.beginPath();g.arc(-0.8,-0.8,R*.42,0,7);g.fill();
  }else if(fk==='scorpion'){
    // Light desert kit — tan wrap + keffiyeh
    g.fillStyle='#2e2a16';g.beginPath();g.arc(0,0,R,0,7);g.fill();
    g.fillStyle='#4a4228';g.beginPath();g.arc(-1,-1,R*.62,0,7);g.fill();
    g.fillStyle='#5e5432';g.beginPath();g.arc(-0.8,-0.8,R*.4,0,7);g.fill();
  }else{
    // Vanguard standard body
    g.fillStyle='#3f4a37';g.beginPath();g.arc(0,0,R,0,7);g.fill();
    g.fillStyle='#535f48';g.beginPath();g.arc(-1,-1,R*.62,0,7);g.fill();
  }
  if(type==='rocket'){
    g.fillStyle='#4a4438';g.fillRect(-4,-R-2.8,15,4.2);
    g.fillStyle='#b8443a';g.fillRect(11,-R-2.8,3.2,4.2);
    g.strokeStyle='#23271e';g.lineWidth=.9;g.strokeRect(-4,-R-2.8,15,4.2);
  }else if(type==='inferno'){
    // fuel tanks on back
    g.fillStyle='#7a3a20';g.beginPath();g.arc(-R*.7,-2.4,2.6,0,7);g.fill();
    g.fillStyle='#9c4f2a';g.beginPath();g.arc(-R*.7,2.4,2.6,0,7);g.fill();
    g.strokeStyle='#3a1d10';g.lineWidth=.9;
    g.beginPath();g.arc(-R*.7,-2.4,2.6,0,7);g.stroke();g.beginPath();g.arc(-R*.7,2.4,2.6,0,7);g.stroke();
    // flamethrower nozzle
    g.strokeStyle='#2a2f24';g.lineWidth=2.8;
    g.beginPath();g.moveTo(0,3);g.lineTo(R+7,3);g.stroke();
    g.fillStyle='#ffa040';g.beginPath();g.arc(R+8,3,1.9,0,7);g.fill();
    g.strokeStyle='#5a3214';g.lineWidth=1.1;
    g.beginPath();g.moveTo(-R*.4,-2.4);g.lineTo(1,2);g.stroke();
  }else if(type==='mortar'){
    // mortar tube + baseplate beside soldier
    g.fillStyle='#262b21';g.beginPath();g.ellipse(R+5,4.5,4.6,2.4,0,0,7);g.fill();
    g.strokeStyle='#454d3a';g.lineWidth=3.4;
    g.beginPath();g.moveTo(R+3,5.6);g.lineTo(R+10,-3.4);g.stroke();
    g.strokeStyle='#20251c';g.lineWidth=1;
    g.beginPath();g.moveTo(R+3,5.6);g.lineTo(R+10,-3.4);g.stroke();
    g.fillStyle='#11150e';g.beginPath();g.arc(R+10.4,-3.8,2,0,7);g.fill();
    // ammo crate
    g.fillStyle='#5a5132';g.fillRect(-R-4,-5.6,4.6,4.2);
    g.strokeStyle='#2e2a18';g.lineWidth=.8;g.strokeRect(-R-4,-5.6,4.6,4.2);
  }else if(type==='guardian'){
    // tower shield held forward
    g.fillStyle='#2e3a40';g.beginPath();
    g.moveTo(R+2,-R-1);g.lineTo(R+6,-R+1);g.lineTo(R+6,R-1);g.lineTo(R+2,R+1);g.closePath();g.fill();
    g.strokeStyle='#15191c';g.lineWidth=1;g.stroke();
    g.fillStyle=ac;g.fillRect(R+3.2,-2,1.8,4);
    g.strokeStyle='#2a2f24';g.lineWidth=2.4;
    g.beginPath();g.moveTo(0,3);g.lineTo(R+2,3);g.stroke();
  }else{
    g.strokeStyle='#2a2f24';g.lineWidth=2.6;
    g.beginPath();g.moveTo(1,3);g.lineTo(R+9,3);g.stroke();
    g.strokeStyle='#5d5440';g.lineWidth=1.4;
    g.beginPath();g.moveTo(0,3);g.lineTo(4,3);g.stroke();
  }
  if(type==='guardian'){
    g.fillStyle='#46565e';g.beginPath();g.arc(1.2,0,R*.55,0,7);g.fill();
    g.fillStyle='#5a6c75';g.beginPath();g.arc(2,-.9,R*.34,0,7);g.fill();
  }else if(fk==='northwind'){
    g.fillStyle='#3a4c5a';g.beginPath();g.arc(1.2,0,R*.55,0,7);g.fill();
    g.fillStyle='#4e6070';g.beginPath();g.arc(2,-.9,R*.34,0,7);g.fill();
    // fur collar ring
    g.strokeStyle='#555e5c';g.lineWidth=2;g.beginPath();g.arc(0,0,R*.9,Math.PI*.6,Math.PI*1.4);g.stroke();
  }else if(fk==='crimson'){
    g.fillStyle='#2e2010';g.beginPath();g.arc(1.2,0,R*.55,0,7);g.fill();
    g.fillStyle='#3e2c18';g.beginPath();g.arc(2,-.9,R*.34,0,7);g.fill();
    // shoulder armour nubs
    g.fillStyle='#1a120a';g.fillRect(-R*.2,-R*1.1,R*.5,R*.45);g.fillRect(-R*.2,R*.65,R*.5,R*.45);
  }else if(fk==='scorpion'){
    g.fillStyle='#3e3820';g.beginPath();g.arc(1.2,0,R*.55,0,7);g.fill();
    g.fillStyle='#524a28';g.beginPath();g.arc(2,-.9,R*.34,0,7);g.fill();
    // keffiyeh tail drape (small hanging cloth)
    g.fillStyle='#5a5430';g.beginPath();g.moveTo(-R*.3,-R*.8);g.lineTo(-R*.8,-R*.3);g.lineTo(-R*.7,R*.4);g.lineTo(-R*.2,R*.2);g.closePath();g.fill();
    g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.6;g.stroke();
  }else{
    g.fillStyle='#5b6850';g.beginPath();g.arc(1.2,0,R*.55,0,7);g.fill();
    g.fillStyle='#6d7b60';g.beginPath();g.arc(2,-.9,R*.34,0,7);g.fill();
  }
  g.fillStyle=ac;g.beginPath();g.arc(-R*.5,-R*.42,2.3,0,7);g.fill();
  g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=.8;
  g.beginPath();g.arc(-R*.5,-R*.42,2.3,0,7);g.stroke();
}
/* --- icons --- */
const ICONS={};
function iconURL(kind,type,team){
  const fk=fac[team],key=kind+type+fk;
  if(ICONS[key])return ICONS[key];
  const c=mkCv(80,80),g=c.getContext('2d');
  if(kind==='b'){
    const s=bSpr(type,fk);
    const sc=Math.min(76/s.lw,76/s.lh);
    g.translate(40,40);g.drawImage(s,-s.lw*sc/2,-s.lh*sc/2,s.lw*sc,s.lh*sc);
  }else{
    const t=UT[type];
    g.translate(40,42);g.rotate(-Math.PI/2);
    if(t.cat==='inf'){g.scale(2.5,2.5);drawSoldier(g,type,FACTIONS[fk].c,t.r*1.3,false,0,fk)}
    else{
      const s=uSpr(type,fk);
      const sc=Math.min(72/s.lw,60/s.lh);
      g.drawImage(s,-s.lw*sc/2,-s.lh*sc/2,s.lw*sc,s.lh*sc);
      // turret overlays on icons
      g.scale(sc,sc);drawVehTurret(type,g,fk,0);
    }
  }
  ICONS[key]=c.toDataURL();
  return ICONS[key];
}
/* --- live drawing --- */
function drawVehTurret(type,g,fk,rot){
  const C=facCol(fk),ac=FACTIONS[fk].c;
  g.save();g.rotate(rot);
  if(type==='tank'){
    g.fillStyle=C(34);g.beginPath();g.arc(0,0,7.6,0,7);g.fill();
    g.fillStyle=C(41);g.beginPath();g.arc(-1,-1,5.4,0,7);g.fill();
    g.strokeStyle=C(15);g.lineWidth=1.3;g.beginPath();g.arc(0,0,7.6,0,7);g.stroke();
    g.fillStyle=C(17);g.fillRect(5,-2.4,18,4.8);
    g.fillStyle=C(9);g.fillRect(20,-3.2,4,6.4);
    g.fillStyle=C(24);g.beginPath();g.arc(-2.6,0,2.6,0,7);g.fill();
  }else if(type==='dominator'){
    g.fillStyle=C(31);g.beginPath();g.arc(0,0,9.4,0,7);g.fill();
    g.fillStyle=C(39);g.beginPath();g.arc(-1.2,-1.2,6.6,0,7);g.fill();
    g.strokeStyle=C(13);g.lineWidth=1.5;g.beginPath();g.arc(0,0,9.4,0,7);g.stroke();
    g.fillStyle=C(16);g.fillRect(6,-5.4,20,4);g.fillRect(6,1.4,20,4);
    g.fillStyle=C(8);g.fillRect(23,-6,4,5.2);g.fillRect(23,.8,4,5.2);
    g.fillStyle=ac;g.beginPath();g.arc(0,0,3,0,7);g.fill();
  }else if(type==='paladin'){
    g.fillStyle=C(36);g.beginPath();
    for(let i=0;i<6;i++){const a=i/6*7;const px=Math.cos(a)*7,py=Math.sin(a)*7;i?g.lineTo(px,py):g.moveTo(px,py)}
    g.closePath();g.fill();
    g.strokeStyle=C(16);g.lineWidth=1.3;g.stroke();
    g.fillStyle=C(20);g.fillRect(4,-1.6,20,3.2);
    g.fillStyle='#7ddcff';
    g.fillRect(8,-2.6,2,5.2);g.fillRect(13,-2.6,2,5.2);g.fillRect(18,-2.6,2,5.2);
    g.beginPath();g.arc(24.5,0,2.2,0,7);g.fill();
    g.fillStyle='rgba(125,220,255,.4)';g.beginPath();g.arc(24.5,0,3.8,0,7);g.fill();
  }else if(type==='technical'){
    // MG ring mount + gunner
    g.strokeStyle='#2a2f26';g.lineWidth=1.6;g.beginPath();g.arc(-7,0,5.6,0,7);g.stroke();
    g.fillStyle='#3f4a37';g.beginPath();g.arc(-7,0,3.4,0,7);g.fill();
    g.fillStyle='#5b6850';g.beginPath();g.arc(-6.4,-.6,2,0,7);g.fill();
    g.fillStyle='#23271e';g.fillRect(-4,-1.6,16,3.2);
    g.fillStyle='#11150e';g.fillRect(10,-2.2,3,4.4);
  }
  g.restore();
}
function drawBrackets(x,y,w,h,col){
  const L=Math.min(9,w*.3);
  ctx.strokeStyle=col||'#9fe27c';ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(x,y+L);ctx.lineTo(x,y);ctx.lineTo(x+L,y);
  ctx.moveTo(x+w-L,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+L);
  ctx.moveTo(x+w,y+h-L);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w-L,y+h);
  ctx.moveTo(x+L,y+h);ctx.lineTo(x,y+h);ctx.lineTo(x,y+h-L);
  ctx.stroke();
}
function drawHPBar(e,x,y,w){
  const f=clamp(e.hp/e.maxhp,0,1);
  if(f>=1&&!sel.includes(e))return;
  ctx.fillStyle='#000c';ctx.fillRect(x-1.5,y-1.5,w+3,6);
  ctx.strokeStyle='rgba(220,230,212,.35)';ctx.lineWidth=1;ctx.strokeRect(x-1.5,y-1.5,w+3,6);
  ctx.fillStyle='#1c241a';ctx.fillRect(x,y,w,3);
  ctx.fillStyle=f>.55?'#7ed957':(f>.28?'#ffd95e':'#ff6a5e');
  ctx.fillRect(x,y,w*f,3);
  ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x,y,w*f,1.2);
}
/* --- battle damage: deterministic wear geometry cached per building --- */
function bWear(b,w,h){
  if(b._wear&&b._wear.w===w&&b._wear.h===h)return b._wear;
  let s=((b.id+1)*2654435761)>>>0;
  const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
  const ix0=w*.13,ix1=w*.87,iy0=h*.15,iy1=h*.9;
  const RX=()=>ix0+rnd()*(ix1-ix0),RY=()=>iy0+rnd()*(iy1-iy0);
  const cracks=[];
  for(let i=0;i<7;i++){
    let cx=RX(),cy=iy0+rnd()*(h*.38);const pts=[[cx,cy]];
    const segs=2+(rnd()*3|0);
    for(let k=0;k<segs;k++){cx+=(rnd()-.5)*w*.22;cy+=rnd()*h*.2+h*.05;pts.push([clamp(cx,ix0,ix1),clamp(cy,iy0,iy1)])}
    cracks.push(pts);
  }
  const scorch=[];for(let i=0;i<6;i++)scorch.push([RX(),RY(),h*.1+rnd()*h*.15]);
  const holes=[];for(let i=0;i<4;i++)holes.push([RX(),RY(),w*.1+rnd()*w*.1,h*.1+rnd()*h*.1]);
  const fires=[];for(let i=0;i<5;i++)fires.push([ix0+rnd()*(ix1-ix0),iy0+(iy1-iy0)*(.42+rnd()*.52)]);
  b._wear={w,h,cracks,scorch,holes,fires};
  return b._wear;
}
function drawBuildingWear(b,x0,y0,w,h){
  const f=clamp(b.hp/b.maxhp,0,1);
  if(f>=0.82)return;
  const W=bWear(b,w,h);
  ctx.save();
  ctx.beginPath();ctx.rect(x0,y0,w,h);ctx.clip();
  // scorch smudges
  const sa=clamp((0.82-f)*1.25,0,.55),nsc=f<.5?W.scorch.length:3;
  for(let i=0;i<nsc;i++){const sc=W.scorch[i];
    const g=ctx.createRadialGradient(x0+sc[0],y0+sc[1],0,x0+sc[0],y0+sc[1],sc[2]);
    g.addColorStop(0,'rgba(12,10,8,'+sa+')');g.addColorStop(1,'rgba(12,10,8,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x0+sc[0],y0+sc[1],sc[2],0,7);ctx.fill();
  }
  // cracks
  if(f<.7){
    const nc=Math.round(clamp((.7-f)/.7,0,1)*W.cracks.length);
    for(let i=0;i<nc;i++){const pts=W.cracks[i];
      ctx.strokeStyle='rgba(10,9,7,.7)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(x0+pts[0][0],y0+pts[0][1]);
      for(let k=1;k<pts.length;k++)ctx.lineTo(x0+pts[k][0],y0+pts[k][1]);ctx.stroke();
      ctx.strokeStyle='rgba(150,140,120,.22)';ctx.lineWidth=.8;ctx.stroke();
    }
  }
  // blown-out panels (interior exposed + bent rebar)
  if(f<.45){
    const nh=Math.round(clamp((.45-f)/.45,0,1)*W.holes.length);
    for(let i=0;i<nh;i++){const hx=W.holes[i][0],hy=W.holes[i][1],hw=W.holes[i][2],hh=W.holes[i][3];
      ctx.fillStyle='#0c0b08';
      ctx.beginPath();ctx.moveTo(x0+hx,y0+hy);ctx.lineTo(x0+hx+hw*.6,y0+hy-hh*.12);
      ctx.lineTo(x0+hx+hw,y0+hy+hh*.1);ctx.lineTo(x0+hx+hw*.85,y0+hy+hh);
      ctx.lineTo(x0+hx+hw*.2,y0+hy+hh*.85);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(90,80,60,.5)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x0+hx+2,y0+hy+hh);ctx.lineTo(x0+hx+hw*.3,y0+hy+2);
      ctx.moveTo(x0+hx+hw*.6,y0+hy+hh);ctx.lineTo(x0+hx+hw*.7,y0+hy);ctx.stroke();
    }
  }
  ctx.restore();
  // ember glow when critical
  if(f<.25){
    const pulse=0.5+0.5*Math.sin(gtime*6+b.id);
    for(let i=0;i<W.fires.length;i++){const fx=W.fires[i][0],fy=W.fires[i][1];
      ctx.fillStyle='rgba(255,'+(90+60*pulse|0)+',30,'+(0.22+0.18*pulse)+')';
      ctx.beginPath();ctx.arc(x0+fx,y0+fy,5+2*pulse,0,7);ctx.fill();
    }
  }
}
function drawApron(b,x0,y0,w,h){
  // worn earth apron grounds the structure to the terrain
  const cx=x0+w/2,cy=y0+h*0.62;
  const gr=ctx.createRadialGradient(cx,cy,Math.min(w,h)*.28,cx,cy,Math.max(w,h)*.78);
  gr.addColorStop(0,'rgba(38,30,16,0.30)');
  gr.addColorStop(.65,'rgba(38,30,16,0.14)');
  gr.addColorStop(1,'rgba(38,30,16,0)');
  ctx.fillStyle=gr;
  ctx.beginPath();ctx.ellipse(cx,cy,Math.max(w,h)*.78,Math.max(w,h)*.55,0,0,7);ctx.fill();
  // access ruts at the door side
  ctx.strokeStyle='rgba(30,24,12,0.22)';ctx.lineWidth=3;
  const dj=(b.id%3)-1;
  ctx.beginPath();ctx.moveTo(cx-7+dj*4,y0+h-4);ctx.quadraticCurveTo(cx-9+dj*6,y0+h+16,cx-13+dj*8,y0+h+30);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx+7+dj*4,y0+h-4);ctx.quadraticCurveTo(cx+9+dj*6,y0+h+16,cx+13+dj*8,y0+h+30);ctx.stroke();
}
function drawBuilding(b){
  const x0=b.tx*TILE,y0=b.ty*TILE,w=b.t.w*TILE,h=b.t.h*TILE;
  const bx=x0+w/2,by=y0+h/2;
  if(b.built&&!b.isHole)drawApron(b,x0,y0,w,h);
  const btw=w,bth=h;
  const fk=b.team>=0?fac[b.team]:'neutral';
  const gen=b.team>=0&&typeof gens!=='undefined'?gens[b.team]:'std';
  const ac=b.team>=0?TEAMC[b.team]:'#9aa48c';
  // GLA hole rendering (Scorpion)
  if(b.isHole){
    const R=Math.max(btw,bth)*.4;
    ctx.save();
    // crater bowl
    ctx.globalAlpha=0.9;
    ctx.fillStyle='#171008';ctx.beginPath();ctx.ellipse(bx,by,R+6,R*.82+6,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#0a0703';ctx.beginPath();ctx.ellipse(bx,by,R,R*.8,0,0,Math.PI*2);ctx.fill();
    // debris chunks around the rim
    ctx.fillStyle='#3a3226';
    for(let i=0;i<7;i++){const a2=i/7*Math.PI*2+b.id;
      ctx.save();ctx.translate(bx+Math.cos(a2)*(R+4),by+Math.sin(a2)*(R*.8+4));ctx.rotate(a2*1.7);
      ctx.fillRect(-4,-2.5,8,5);ctx.restore();}
    // smoulder glow
    ctx.fillStyle='#ff6600';ctx.globalAlpha=0.35+0.2*Math.sin(gtime*4+b.id);
    ctx.beginPath();ctx.arc(bx,by,8,0,Math.PI*2);ctx.fill();
    // rebuild timer arc
    ctx.strokeStyle='#ffaa00';ctx.lineWidth=3;ctx.globalAlpha=0.75;
    ctx.beginPath();ctx.arc(bx,by,R,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-b.holeT/15));ctx.stroke();
    ctx.restore();
    // rising smoke wisps
    if(state==='play'&&Math.random()<.05)addPart({k:'smoke',x:bx+vrand(-R*.5,R*.5),y:by+vrand(-6,6),vx:vrand(-4,4),vy:vrand(-18,-8),life:vrand(.8,1.4),max:1.4,s:vrand(6,11)});
    // hp bar — the hole can be shot to finish it off
    drawHPBar(b,x0+4,y0-7,w-8);
    if(sel.includes(b)){
      ctx.strokeStyle='rgba(159,226,124,.8)';ctx.lineWidth=1.6;ctx.setLineDash([6,4]);
      ctx.strokeRect(x0+1,y0+1,w-2,h-2);ctx.setLineDash([]);
    }
    return;
  }
  if(!b.built){
    ctx.fillStyle='#231d12';ctx.fillRect(x0+2,y0+2,w-4,h-4);
    ctx.fillStyle='#2f2818';ctx.fillRect(x0+5,y0+5,w-10,h-10);
    ctx.strokeStyle='rgba(120,110,80,.35)';ctx.lineWidth=1;
    for(let i=1;i<4;i++){
      ctx.beginPath();ctx.moveTo(x0+5,y0+5+(h-10)*i/4);ctx.lineTo(x0+w-5,y0+5+(h-10)*i/4);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x0+5+(w-10)*i/4,y0+5);ctx.lineTo(x0+5+(w-10)*i/4,y0+h-5);ctx.stroke();
    }
    ctx.fillStyle='#7d7456';
    for(const[px,py]of[[x0+6,y0+6],[x0+w-10,y0+6],[x0+6,y0+h-10],[x0+w-10,y0+h-10]])ctx.fillRect(px,py,4,4);
    if(b.prog>.3){
      const s=bSpr(b.type,fk,gen);
      ctx.globalAlpha=clamp((b.prog-.3)/.7,0,1)*.85;
      ctx.drawImage(s,x0-BM,y0-BM,w+BM*2,h+BM*2);
      ctx.globalAlpha=1;
    }
    const sh=(h-12)*Math.min(1,b.prog*1.4);
    ctx.strokeStyle='#8a8264';ctx.lineWidth=1.6;
    ctx.beginPath();
    ctx.moveTo(x0+6,y0+h-6);ctx.lineTo(x0+6,y0+h-6-sh);
    ctx.moveTo(x0+w-6,y0+h-6);ctx.lineTo(x0+w-6,y0+h-6-sh);
    ctx.moveTo(x0+6,y0+h-6-sh);ctx.lineTo(x0+w-6,y0+h-6-sh);
    ctx.moveTo(x0+6,y0+h-6);ctx.lineTo(x0+w-6,y0+h-6-sh);
    ctx.stroke();
    ctx.fillStyle='#000b';ctx.fillRect(x0+4,y0-10,w-8,7);
    ctx.fillStyle='#ffd95e';ctx.fillRect(x0+5,y0-9,(w-10)*b.prog,5);
    if(sel.includes(b))drawBrackets(x0-2,y0-2,w+4,h+4);
    if(tileVisAt(b.x,b.y)===2||!isEnemy(0,b.team))drawHPBar(b,x0+4,y0-17,w-8);
    return;
  }
  ctx.drawImage(bSpr(b.type,fk,gen),x0-BM,y0-BM,w+BM*2,h+BM*2);
  switch(b.type){
    case 'command':{
      if(fk==='vanguard'){
        ctx.save();ctx.translate(x0+w*.32,y0+h*.3);ctx.rotate(gtime*1.4);
        ctx.fillStyle='#cfeaff';ctx.beginPath();ctx.arc(0,0,10,-.6,.6);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#7fd6ff';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(11,0);ctx.stroke();ctx.restore();
        if(Math.sin(gtime*3.4)>0){ctx.fillStyle='#7fd6ff';ctx.beginPath();ctx.arc(x0+w*.5,y0-10,2.4,0,7);ctx.fill()}
      }else if(fk==='crimson'){
        if(state==='play'&&Math.random()<.18)addPart({k:'smoke',x:x0+w*.72+vrand(0,w*.12),y:y0+h*.02,vx:vrand(-3,3),vy:-22,life:1.1,max:1.1,s:6});
        if(Math.sin(gtime*3)>0){ctx.fillStyle='#ff5147';ctx.beginPath();ctx.arc(x0+w*.4,y0+h*.08,2.4,0,7);ctx.fill()}
      }else if(fk==='scorpion'){
        ctx.save();ctx.translate(x0+w*.79,y0+h*.26);ctx.rotate(Math.sin(gtime*.8+b.id)*.4);
        ctx.strokeStyle='rgba(180,190,170,.55)';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,9,Math.PI*.8,Math.PI*2.1);ctx.stroke();ctx.restore();
        if(state==='play'&&Math.random()<.05)addPart({k:'smoke',x:x0+w*.2+vrand(0,w*.1),y:y0+h*.4,vx:vrand(-2,2),vy:-12,life:.8,max:.8,s:4});
      }else if(fk==='northwind'){
        ctx.fillStyle='rgba(120,255,235,'+(0.06+0.05*Math.sin(gtime*1.6+b.id))+')';
        ctx.fillRect(x0+w*.32,y0+h*.08,w*.36,h*.2);
        if(Math.sin(gtime*3.2)>0){ctx.fillStyle='#7ffee8';ctx.beginPath();ctx.arc(x0+w*.56,y0-8,2.2,0,7);ctx.fill()}
      }else{
        ctx.save();ctx.translate(x0+w*.62,y0+h*.34);ctx.rotate(gtime*1.2);
        ctx.fillStyle='#d6dfc9';ctx.beginPath();ctx.arc(0,0,12,-.62,.62);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#7e8a72';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(13,0);ctx.stroke();ctx.restore();
        if(Math.sin(gtime*3.4)>0){ctx.fillStyle='#ff5147';ctx.beginPath();ctx.arc(x0+w-22,y0-8,2.4,0,7);ctx.fill()}
      }
      break;}
    case 'power':
      if(state==='play'&&Math.random()<.05){
        const cxp=Math.random()<.5?x0+22:x0+w-22;
        addPart({k:'smoke',x:cxp,y:y0+18,vx:vrand(-4,4),vy:-18,life:.8,max:.8,s:4});
      }
      break;
    case 'barracks':{
      const px=x0+10,py=y0-9,fw=Math.sin(gtime*5)*2.5;
      ctx.fillStyle=ac;
      ctx.beginPath();ctx.moveTo(px,py);
      ctx.quadraticCurveTo(px+9,py-3+fw,px+19,py+1+fw);
      ctx.lineTo(px+19,py+8+fw);ctx.quadraticCurveTo(px+9,py+4+fw,px,py+9);
      ctx.closePath();ctx.fill();
      break;}
    case 'factory':
      if(b.queue.length){
        ctx.fillStyle='rgba(255,200,90,'+(0.18+0.14*Math.sin(gtime*7))+')';
        ctx.fillRect(x0+w*.30,y0+h-18,w*.40,15);
        if(state==='play'&&Math.random()<.12)addPart({k:'smoke',x:x0+w-21,y:y0+2,vx:vrand(-4,4),vy:-22,life:.9,max:.9,s:5});
      }
      break;
    case 'supply':
      if(Math.sin(gtime*4)>0.3){ctx.fillStyle='#ffd95e';ctx.beginPath();ctx.arc(x0+w*.3-4,y0+h-17,2,0,7);ctx.fill()}
      break;
    case 'market':{
      const gl=(gtime*1.1+b.id)%3.5;
      if(gl<.35){ctx.fillStyle='rgba(255,240,180,'+(1-gl/.35)+')';ctx.beginPath();ctx.arc(x0+w/2-5,y0+h*.5,2.4,0,7);ctx.fill()}
      break;}
    case 'tech':{
      // faction-specific research glow at the dome/core (x0+w*.3, y0+h*.5)
      const tp=0.10+0.08*Math.sin(gtime*2.6+b.id);
      if(fk==='crimson'){
        ctx.fillStyle='rgba(255,90,50,'+(tp+0.04)+')';ctx.beginPath();ctx.arc(x0+w*.3,y0+h*.5,h*.3,0,7);ctx.fill();
        if(state==='play'&&Math.random()<.12)addPart({k:'smoke',x:x0+w*.7+vrand(0,w*.12),y:y0+4,vx:vrand(-3,3),vy:-20,life:1,max:1,s:5});
      }else if(fk==='scorpion'){
        ctx.fillStyle='rgba(120,220,60,'+(tp+0.05)+')';ctx.beginPath();ctx.arc(x0+w*.3,y0+h*.55,h*.26,0,7);ctx.fill();
        ctx.save();ctx.translate(x0+w*.74,y0+h*.34);ctx.rotate(Math.sin(gtime*.7+b.id)*.35);
        ctx.strokeStyle='rgba(180,190,170,.5)';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,11,Math.PI*.8,Math.PI*2.1);ctx.stroke();ctx.restore();
      }else if(fk==='northwind'){
        ctx.fillStyle='rgba(120,255,235,'+tp+')';ctx.beginPath();ctx.arc(x0+w*.3,y0+h*.5,h*.3,Math.PI,0);ctx.closePath();ctx.fill();
      }else{
        ctx.fillStyle='rgba(125,220,255,'+tp+')';ctx.beginPath();ctx.arc(x0+w*.3,y0+h*.5,h*.34,0,7);ctx.fill();
        if(Math.sin(gtime*5+b.id)>0.2){ctx.fillStyle='#7fd6ff';ctx.beginPath();ctx.arc(x0+w*.74,y0-4,1.8,0,7);ctx.fill()}
      }
      break;}
    case 'silo':{
      const cx=x0+w/2,cy=y0+h*.46,R2=Math.min(w,h)*.3;
      const ch=b.charge||0;
      if(ch>0&&ch<1){
        ctx.strokeStyle='rgba(255,176,46,.85)';ctx.lineWidth=4;
        ctx.beginPath();ctx.arc(cx,cy,R2+7,-Math.PI/2,-Math.PI/2+ch*Math.PI*2);ctx.stroke();
        if(Math.sin(gtime*4)>0){ctx.fillStyle='#ff5147';ctx.beginPath();ctx.arc(x0+w-16,y0+4,2.4,0,7);ctx.fill()}
      }else if(ch>=1){
        ctx.strokeStyle='rgba(255,176,46,'+(0.6+0.4*Math.sin(gtime*6))+')';ctx.lineWidth=4;
        ctx.beginPath();ctx.arc(cx,cy,R2+7,0,7);ctx.stroke();
        ctx.fillStyle='rgba(255,120,60,'+(0.25+0.2*Math.sin(gtime*6))+')';
        ctx.beginPath();ctx.arc(cx,cy,R2,0,7);ctx.fill();
      }
      break;}
    case 'turret':{
      const cx=x0+w/2,cy=y0+h/2;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(b.ta||0);
      const C=facCol(fk);
      ctx.fillStyle=C(24);ctx.fillRect(-9,-5,8,10);
      ctx.fillStyle=C(38);ctx.beginPath();ctx.arc(0,0,7.5,0,7);ctx.fill();
      ctx.strokeStyle=C(15);ctx.lineWidth=1.4;ctx.stroke();
      ctx.fillStyle=C(15);ctx.fillRect(5,-4,21,3);ctx.fillRect(5,1,21,3);
      ctx.fillStyle=C(8);ctx.fillRect(24,-4.6,4,4.2);ctx.fillRect(24,.4,4,4.2);
      ctx.fillStyle=ac;ctx.beginPath();ctx.arc(0,0,2.6,0,7);ctx.fill();
      ctx.restore();
      if(lowPow[b.team]){
        ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.arc(cx,y0-9,9,0,7);ctx.fill();
        ctx.fillStyle='#ff6a5e';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('⚡',cx,y0-9);
        ctx.strokeStyle='#ff6a5e';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx-6,y0-3);ctx.lineTo(cx+6,y0-15);ctx.stroke();
      }
      break;}
    case 'repairbay':{
      // Animated crane trolley traversing the rail
      const ctpos=(gtime*.55+b.id*.4)%1;
      const cxPos=x0+w*.14+w*.72*Math.abs(Math.sin(ctpos*Math.PI));
      ctx.fillStyle='rgba(200,215,180,'+(0.45+0.18*Math.sin(gtime*2.2+b.id))+')';
      ctx.beginPath();ctx.arc(cxPos,y0+13,4,0,7);ctx.fill();
      // Pulsing repair cross when captured
      if(b.team>=0){
        const gp=0.18+0.12*Math.sin(gtime*4.5+b.id);
        ctx.fillStyle='rgba(90,210,80,'+gp+')';
        ctx.fillRect(x0+w*.14,y0+h*.3,5,14);ctx.fillRect(x0+w*.14-4.5,y0+h*.3+4.5,14,5);
      }
      break;}
    case 'watchtower':{
      // Rotating searchlight sweep
      const wta=gtime*1.5+b.id*.7;
      ctx.strokeStyle='rgba(255,255,195,'+(0.18+0.1*Math.sin(gtime*2+b.id))+')';ctx.lineWidth=3.4;
      ctx.beginPath();ctx.moveTo(x0+w*.5,y0+h*.08);
      ctx.lineTo(x0+w*.5+Math.cos(wta)*22,y0+h*.08+Math.sin(wta)*22*.4);ctx.stroke();
      // Blinking red beacon
      if(Math.sin(gtime*3.8+b.id)>0.2){ctx.fillStyle='rgba(255,70,55,.92)';ctx.beginPath();ctx.arc(x0+w*.5,y0+h*.08-5,2.4,0,7);ctx.fill()}
      break;}
  }
  // Building type icon badge
  {const BICO={command:'🏢',power:'⚡',supply:'📦',market:'💰',barracks:'🪖',factory:'⚙️',tech:'🔬',silo:'☢️',airfield:'✈️',samsite:'🚀',tunnel:'🕳️',repairbay:'🔩',watchtower:'🔭'};
  const bic=BICO[b.type];
  if(bic){ctx.save();const icx=x0+w/2,icy=y0+7;ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.ellipse(icx,icy,11,9,0,0,7);ctx.fill();ctx.font='11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(bic,icx,icy);ctx.restore()}}
  // Progressive battle damage — cracks, scorch, blown panels, embers
  drawBuildingWear(b,x0,y0,w,h);
  // Damage particle emitters — smoke thickens with damage, fire + sparks when critical
  if(b.built&&state==='play'&&(tileVisAt(b.x,b.y)===2||!isEnemy(0,b.team))){
    const df=b.hp/b.maxhp;
    if(df<.7&&Math.random()<(.7-df)*.2)
      addPart({k:'smoke',x:x0+vrand(8,w-8),y:y0+vrand(6,h*.5),vx:vrand(-5,5),vy:vrand(-30,-14),life:vrand(.8,1.4),max:1.4,s:vrand(6,12)});
    if(df<.28){
      if(Math.random()<.12)addPart({k:'fire',x:x0+vrand(10,w-10),y:y0+vrand(h*.4,h-10),vx:vrand(-4,4),vy:vrand(-16,-6),life:vrand(.25,.5),max:.5,s:vrand(6,11)});
      if(Math.random()<.05)addPart({k:'spark',x:x0+vrand(10,w-10),y:y0+vrand(h*.3,h-10),vx:vrand(-30,30),vy:vrand(-50,-10),life:vrand(.2,.4),max:.4,s:vrand(1.5,3),c:'#ffb347'});
    }
  }
  if(b.flash>0){ctx.fillStyle='rgba(255,255,255,'+(b.flash*3)+')';ctx.fillRect(x0+2,y0+2,w-4,h-4)}
  if(sel.includes(b)){
    drawBrackets(x0-2,y0-2,w+4,h+4);
    if(b.t.trains){
      const r=b.rally;
      ctx.strokeStyle='#ffd95e';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x,r.y-17);ctx.stroke();
      ctx.fillStyle='#ffd95e';ctx.beginPath();ctx.moveTo(r.x,r.y-17);ctx.lineTo(r.x+13,r.y-12.5);ctx.lineTo(r.x,r.y-8);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(r.x,r.y+1,5,2,0,0,7);ctx.fill();
    }
  } else if(b.team===0&&b.t.trains&&b.built){
    // Faint persistent rally line visible even when not selected
    const r=b.rally;
    const rdx=r.x-b.x,rdy=r.y-b.y;
    if(rdx*rdx+rdy*rdy>TILE*TILE*2){
      ctx.strokeStyle='rgba(255,217,94,0.22)';ctx.lineWidth=1.1;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(r.x,r.y);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='rgba(255,217,94,0.30)';ctx.beginPath();ctx.arc(r.x,r.y,3,0,7);ctx.fill();
    }
  }
  // Garrison count badge
  if(b.garrison&&b.garrison.length){
    ctx.fillStyle='rgba(0,0,0,.75)';ctx.beginPath();ctx.arc(x0+w-8,y0+8,8,0,7);ctx.fill();
    ctx.fillStyle='#c8d48e';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(b.garrison.length,x0+w-8,y0+8);
  }
  // Build queue count badge — small circle showing pending units
  if(b.queue&&b.queue.length&&b.built&&b.t.trains){
    const qx=x0+8,qy=y0+h-8;
    ctx.fillStyle='rgba(0,0,0,.78)';ctx.beginPath();ctx.arc(qx,qy,8,0,7);ctx.fill();
    ctx.fillStyle='#ffd95e';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(b.queue.length,qx,qy);
  }
  // Capture progress bar
  const capUnit=units.find(uu=>!uu.dead&&uu.isCapturing&&uu.captureTarget===b);
  if(capUnit){
    ctx.fillStyle='#000b';ctx.fillRect(x0+4,y0-22,w-8,8);
    ctx.fillStyle='#7ddcff';ctx.fillRect(x0+5,y0-21,(w-10)*clamp(capUnit.captureProgress,0,1),6);
    ctx.fillStyle='rgba(125,220,255,.85)';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillText('CAPTURING',x0+w/2,y0-22);
  }
  if(tileVisAt(b.x,b.y)===2||!isEnemy(0,b.team))drawHPBar(b,x0+4,y0-10,w-8);
}

function drawInf(u){
  const R=u.t.r*1.3;
  const ph=gtime*11+u.id*2.1;
  const bob=u.moving?Math.sin(ph)*.9:0;
  ctx.save();ctx.translate(u.x,u.y+bob*.3);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,3,R*.95,R*.5,0,0,7);ctx.fill();
  ctx.rotate(u.a);
  drawSoldier(ctx,u.type,TEAMC[u.team],R,u.moving,ph,fac[u.team]);
  ctx.restore();
}
function drawUnit(u){
  if(u.hidden)return;
  if(isEnemy(0,u.team)&&tileVisAt(u.x,u.y)!==2)return;
  // Aircraft rendering
  if(u.cat==='air'||u.zHeight>10){
    const zh=(u.zHeight!==undefined&&u.zHeight!==null)?u.zHeight:30;
    const bob=zh>10?Math.sin(gtime*2.2+u.id)*2:0;
    const drawY=u.y-zh-bob;
    // Ground shadow — tightens under the craft as it lands
    if(zh>2){
      ctx.save();
      ctx.globalAlpha=0.28*(1-zh/90)+0.08;
      ctx.fillStyle='rgba(0,0,0,.7)';
      ctx.beginPath();ctx.ellipse(u.x+zh*.15,u.y+zh*.08,u.t.r*(0.7+zh/75),u.t.r*(0.32+zh/160),0,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
      ctx.restore();
    }
    // Selection ring at ground level
    if(sel.includes(u)){
      ctx.strokeStyle='rgba(159,226,124,.7)';ctx.lineWidth=1.6;ctx.setLineDash([6,4]);
      ctx.beginPath();ctx.arc(u.x,u.y,u.t.r+4,0,Math.PI*2);ctx.stroke();
      ctx.setLineDash([]);
    }
    const fk=fac[u.team];
    ctx.save();ctx.translate(u.x,drawY);ctx.rotate(u.a);
    if(u.type==='gunship'){
      // Gunship: rounded fuselage + rotor disk
      ctx.fillStyle=TEAMC[u.team];
      ctx.beginPath();ctx.ellipse(0,0,14,7,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=TEAMD[u.team];
      ctx.fillRect(-12,-2,10,4);
      // Rotor blades (horizontal lines)
      ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(16,0);ctx.stroke();
      ctx.save();ctx.rotate(Math.PI/2);
      ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(12,0);ctx.stroke();
      ctx.restore();
      // Tail rotor
      ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(-13,-5);ctx.lineTo(-13,-10);ctx.stroke();
      // Engine glow
      ctx.fillStyle='rgba(255,160,80,'+(0.4+0.3*Math.sin(gtime*30))+')';
      ctx.beginPath();ctx.arc(2,0,2.2,0,Math.PI*2);ctx.fill();
    }else if(u.type==='bomber'){
      // Heavy bomber — wide wings, twin engines
      ctx.fillStyle=TEAMC[u.team];
      ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(0,-6);ctx.lineTo(-14,-4);ctx.lineTo(-14,4);ctx.lineTo(0,6);ctx.closePath();ctx.fill();
      ctx.fillStyle=TEAMD[u.team];
      ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(0,-6);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
      // Wide swept wings
      ctx.fillStyle=TEAMC[u.team];
      ctx.beginPath();ctx.moveTo(2,-5);ctx.lineTo(-10,-24);ctx.lineTo(-15,-18);ctx.lineTo(-5,-5);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(2,5);ctx.lineTo(-10,24);ctx.lineTo(-15,18);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();
      // Twin engine pods under wings
      ctx.fillStyle=TEAMD[u.team];
      for(const ey of[-15,15]){ctx.fillRect(-11,ey-2.5,9,5)}
      ctx.fillStyle='rgba(255,140,60,'+(0.45+0.35*Math.sin(gtime*14))+')';
      for(const ey of[-15,15]){ctx.beginPath();ctx.arc(-11,ey,2.4,0,Math.PI*2);ctx.fill()}
    }else{
      // Raptor swept-wing silhouette
      ctx.fillStyle=TEAMC[u.team];
      ctx.beginPath();
      ctx.moveTo(14,0);ctx.lineTo(2,-10);ctx.lineTo(-12,-4);ctx.lineTo(-12,4);ctx.lineTo(2,10);ctx.closePath();ctx.fill();
      ctx.fillStyle=TEAMD[u.team];
      ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(2,-10);ctx.lineTo(2,0);ctx.closePath();ctx.fill();
      // Engine glow
      ctx.fillStyle='rgba(255,160,80,'+(0.5+0.4*Math.sin(gtime*20))+')';
      ctx.beginPath();ctx.arc(-13,0,2.6,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
    // Ammo pips
    if(u.ammo>0){
      ctx.save();ctx.translate(u.x,drawY+u.t.r+8);
      const maxAmmo=u.t.ammo||4;
      for(let i=0;i<maxAmmo;i++){
        ctx.fillStyle=i<u.ammo?'#ffd95e':'#333';
        ctx.beginPath();ctx.arc((i-(maxAmmo-1)/2)*6,0,2,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    }
    drawHPBar(u,u.x-12,drawY-u.t.r-10,24);
    return;
  }
  if(sel.includes(u)){
    ctx.fillStyle='rgba(159,226,124,.10)';
    ctx.beginPath();ctx.arc(u.x,u.y,u.t.r+6,0,7);ctx.fill();
    ctx.strokeStyle='rgba(159,226,124,.3)';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(u.x,u.y,u.t.r+6,0,7);ctx.stroke();
    ctx.strokeStyle='rgba(159,226,124,.95)';ctx.lineWidth=1.8;
    ctx.setLineDash([7,5]);ctx.lineDashOffset=-gtime*18;
    ctx.beginPath();ctx.arc(u.x,u.y,u.t.r+6,0,7);ctx.stroke();
    ctx.setLineDash([]);ctx.lineDashOffset=0;
  }
  const fk=fac[u.team];
  if(u.cat==='inf'){drawInf(u)}
  else{
    const s=uSpr(u.type,fk);
    ctx.save();ctx.translate(u.x,u.y);ctx.rotate(u.a);
    ctx.drawImage(s,-s.lw/2,-s.lh/2,s.lw,s.lh);
    ctx.restore();
    if(u.type==='tank'||u.type==='arty'||u.type==='paladin'||u.type==='dominator'||u.type==='technical'){
      ctx.save();ctx.translate(u.x,u.y);
      if(u.type==='arty'){
        ctx.rotate(u.ta||u.a);
        const C=facCol(fk);
        ctx.fillStyle=C(35);ctx.beginPath();ctx.arc(0,0,6.4,0,7);ctx.fill();
        ctx.strokeStyle=C(15);ctx.lineWidth=1.2;ctx.stroke();
        ctx.fillStyle=C(21);ctx.fillRect(1,-3.2,10,6.4);
        ctx.fillStyle=C(14);ctx.fillRect(2,-2.2,27,4.4);
        ctx.fillStyle=C(7);ctx.fillRect(26,-3.2,5,6.4);
      }else drawVehTurret(u.type,ctx,fk,u.ta||u.a);
      ctx.restore();
    }
    if(u.type==='truck'&&u.cargo>0){
      ctx.save();ctx.translate(u.x,u.y);ctx.rotate(u.a);
      ctx.fillStyle='#d8a93f';ctx.fillRect(-13,-5.5,16,11);
      ctx.fillStyle='#f3cf6d';ctx.fillRect(-13,-5.5,16,3);
      ctx.strokeStyle='#7a5c1e';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(-8,-5.5);ctx.lineTo(-8,5.5);ctx.moveTo(-2,-5.5);ctx.lineTo(-2,5.5);ctx.stroke();
      ctx.restore();
    }
    if(u.type==='dozer'&&u.site&&state==='play'&&Math.random()<.2)
      addPart({k:'spark',x:u.x+Math.cos(u.a)*17,y:u.y+Math.sin(u.a)*17,vx:vrand(-20,20),vy:vrand(-40,-5),life:.25,max:.25,s:1.8,c:'#ffe9a8'});
    if(u.moving&&state==='play'&&Math.random()<.2)
      addPart({k:'dust',x:u.x-Math.cos(u.a)*14+vrand(-4,4),y:u.y-Math.sin(u.a)*14+vrand(-4,4),vx:vrand(-6,6),vy:vrand(-10,-2),life:.55,max:.55,s:vrand(2.5,5)});
  }
  { // team-colored ground ring — readability at any zoom
    const gr=ctx.createRadialGradient(u.x,u.y+2,u.t.r*0.3,u.x,u.y+2,u.t.r*1.5);
    const tc=TEAMC[u.team]||'#9aa48c';
    gr.addColorStop(0,tc+'55');gr.addColorStop(.65,tc+'22');gr.addColorStop(1,tc+'00');
    ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(u.x,u.y+2,u.t.r*1.5,u.t.r*1.0,0,0,7);ctx.fill();
  }
  if(state==='play'&&u.moving&&u.cat==='veh'&&(u.zHeight||0)<=0&&Math.random()<.10){
    addPart({k:'dust',x:u.x-Math.cos(u.a)*u.t.r,y:u.y-Math.sin(u.a)*u.t.r+3,vx:vrand(-8,8)-Math.cos(u.a)*12,vy:vrand(-10,-2),life:vrand(.35,.6),max:.6,s:vrand(3,6)});
  }
  if(u.type==='scarab'&&Math.sin(gtime*9+u.id)>0){
    ctx.fillStyle='#ff5147';
    const bx=u.x+Math.cos(u.a+Math.PI*.78)*10,by=u.y+Math.sin(u.a+Math.PI*.78)*10;
    ctx.beginPath();ctx.arc(bx,by,2,0,7);ctx.fill();
  }
  if(u.flash>0){
    ctx.fillStyle='rgba(255,255,255,'+(u.flash*4)+')';
    ctx.beginPath();ctx.arc(u.x,u.y,u.t.r+3,0,7);ctx.fill();
  }
  drawHPBar(u,u.x-12,u.y-u.t.r-10,24);
  // Veterancy chevrons
  if(u.unitRank>0){
    ctx.save();ctx.translate(u.x,u.y-u.t.r-16);
    for(let i=0;i<u.unitRank;i++){
      const cx=-(u.unitRank-1)*4+i*8;
      ctx.fillStyle=u.unitRank>=3?'#ffd95e':(u.unitRank>=2?'#ffe05a':'#c8d48e');
      ctx.beginPath();ctx.moveTo(cx-3.5,-1);ctx.lineTo(cx,4);ctx.lineTo(cx+3.5,-1);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=.7;ctx.stroke();
    }
    ctx.restore();
  }
  // Scrap level indicator (Scorpion vehicles)
  if(u.scrapLevel>0&&u.cat==='veh'){
    ctx.save();ctx.translate(u.x+u.t.r+2,u.y-4);
    ctx.fillStyle=u.scrapLevel>=2?'#ffd95e':'#c08040';
    for(let i=0;i<u.scrapLevel;i++)ctx.fillRect(-2.5,i*5-u.scrapLevel*2.5,5,3);
    ctx.restore();
  }
  // Signature unit badge (★ pip to the right of HP bar)
  if(u.t.sig){
    const sx=u.x+u.t.r+7,sy=u.y-u.t.r-8;
    ctx.save();
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.arc(sx,sy,5.8,0,7);ctx.fill();
    ctx.fillStyle=TEAMC[u.team];ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('★',sx,sy);
    ctx.restore();
  }
}
function drawScrap(s){
  ctx.save();ctx.translate(s.x,s.y);
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(1,2,7,3.5,0,0,7);ctx.fill();
  ctx.fillStyle='#6e4c22';ctx.fillRect(-5,-3,10,6);
  ctx.fillStyle='#8a6030';ctx.fillRect(-5,-3,10,3);
  ctx.fillStyle='rgba(200,150,70,.5)';ctx.fillRect(-3,-3,4,6);
  ctx.restore();
}
function drawPile(p){
  if(p.amt<=0)return;
  const f=p.amt/p.max,n=Math.max(1,Math.ceil(f*6));
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(p.x+3,p.y+12,30,10,0,0,7);ctx.fill();
  for(let i=0;i<n;i++){
    const gx=p.x-22+(i%3)*20,gy=p.y-14+Math.floor(i/3)*20;
    ctx.fillStyle='#171208';ctx.fillRect(gx-9,gy-7,20,17);
    ctx.fillStyle='#d8a93f';ctx.fillRect(gx-10,gy-9,20,17);
    ctx.fillStyle='#f3cf6d';ctx.fillRect(gx-10,gy-9,20,5);
    ctx.fillStyle='#8a6a22';ctx.fillRect(gx-10,gy+3,20,3);
    ctx.fillStyle='#6e5b2e';ctx.fillRect(gx-4,gy-9,2,17);ctx.fillRect(gx+3,gy-9,2,17);
  }
  const gl=(gtime*1.3+p.tx)%4;
  if(gl<.3){
    ctx.fillStyle='rgba(255,255,230,'+(1-gl/.3)+')';
    ctx.beginPath();ctx.arc(p.x-12,p.y-12,2.2,0,7);ctx.fill();
  }
}
function drawProj(p){
  if(!p.active)return;
  let yoff=0;
  if(p.kind==='arc'){
    const d=Math.hypot(p.dx-p.sx,p.dy-p.sy);
    yoff=-Math.sin(p.t*Math.PI)*Math.min(150,d*.18+26);
  }
  ctx.save();ctx.translate(p.x,p.y+yoff);
  if(p.kind==='rocket'){
    ctx.rotate(p.a||0);
    ctx.fillStyle='rgba(255,160,80,'+(0.6+0.4*Math.sin(gtime*40))+')';
    ctx.beginPath();ctx.moveTo(-5,0);ctx.lineTo(-12,-2.4);ctx.lineTo(-10,0);ctx.lineTo(-12,2.4);ctx.closePath();ctx.fill();
    ctx.fillStyle='#e7e7da';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-3.4);ctx.lineTo(-5,3.4);ctx.closePath();ctx.fill();
    ctx.fillStyle='#b8443a';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(3,-1.8);ctx.lineTo(3,1.8);ctx.closePath();ctx.fill();
  }else if(p.kind==='arc'){
    ctx.rotate(p.t*9);
    ctx.fillStyle='#2d3327';ctx.beginPath();ctx.ellipse(0,0,5,3.4,0,0,7);ctx.fill();
    ctx.strokeStyle='#5a614f';ctx.lineWidth=1;ctx.stroke();
  }else{
    ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.arc(0,0,2.2,0,7);ctx.fill();
    ctx.fillStyle='rgba(255,210,120,.5)';ctx.beginPath();ctx.arc(-3,0,2,0,7);ctx.fill();
  }
  ctx.restore();
  if(p.kind==='arc'&&yoff<-6){
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(p.x,p.y,5,2.4,0,0,7);ctx.fill();
  }
}
function drawPart(p){
  const PDT=1/60;
  if(!p.active)return;
  if((p.k==='dust'||p.k==='spark')&&tileVisAt(p.x,p.y)<2)return;
  const f=p.life/p.max;
  switch(p.k){
    case 'scorch':
      ctx.fillStyle='rgba(8,10,7,'+(.45*Math.min(1,f*2))+')';
      ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,7);ctx.fill();break;
    case 'ring':
      if(p.c){ctx.strokeStyle=p.c;ctx.globalAlpha=f;}
      else ctx.strokeStyle='rgba(255,200,120,'+f+')';
      ctx.lineWidth=3*f+1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.s*(1-f)+4,0,7);ctx.stroke();
      if(p.c)ctx.globalAlpha=1;
      break;
    case 'heal':{
      const yo=(1-f)*16;
      ctx.fillStyle='rgba(125,255,154,'+(f*.9)+')';
      ctx.fillRect(p.x-1.7,p.y-yo-p.s/2,3.4,p.s);
      ctx.fillRect(p.x-p.s/2,p.y-yo-1.7,p.s,3.4);
      ctx.fillStyle='rgba(125,255,154,'+(f*.2)+')';
      ctx.beginPath();ctx.arc(p.x,p.y-yo,p.s*.9,0,7);ctx.fill();break;}
    case 'wreck':{
      // falling aircraft: ballistic drop, spin, flame+smoke trail, crash boom at ground
      p.x+=p.vx*PDT;p.y+=p.vy*PDT;
      p.vz=(p.vz||-30)-160*PDT;p.z=Math.max(0,(p.z||30)+p.vz*PDT);
      p.rot=(p.rot||0)+(p.vrot||5)*PDT;
      if(Math.random()<.6)addPart({k:'fire',x:p.x+vrand(-4,4),y:p.y-p.z+vrand(-4,4),vx:vrand(-10,10),vy:vrand(-6,10),life:.25,max:.25,s:vrand(4,8)});
      if(Math.random()<.5)addPart({k:'smoke',x:p.x+vrand(-4,4),y:p.y-p.z+vrand(-4,4),vx:vrand(-8,8),vy:vrand(-14,-2),life:vrand(.5,.9),max:.9,s:vrand(6,12)});
      ctx.save();ctx.translate(p.x,p.y-p.z);ctx.rotate(p.rot);
      ctx.fillStyle=TEAMD[p.team]||'#444';
      ctx.beginPath();ctx.moveTo(p.s,0);ctx.lineTo(-p.s*.7,-p.s*.55);ctx.lineTo(-p.s*.5,0);ctx.lineTo(-p.s*.7,p.s*.55);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,140,40,.8)';ctx.beginPath();ctx.arc(vrand(-3,3),vrand(-3,3),p.s*.3,0,7);ctx.fill();
      ctx.restore();
      if(p.z<=0||p.life<=PDT){ // crash
        boomFx(p.x,p.y,26,true);
        addPart({k:'scorch',x:p.x,y:p.y,life:14,max:14,s:20});
        p.life=0;
      }
      return;}
    case 'flakpuff':{
      const g2=1-f;
      ctx.fillStyle='rgba(60,58,52,'+(f*.75)+')';
      ctx.beginPath();ctx.arc(p.x,p.y-g2*6,p.s*(0.6+g2*.9),0,7);ctx.fill();
      ctx.fillStyle='rgba(120,116,104,'+(f*.5)+')';
      ctx.beginPath();ctx.arc(p.x-p.s*.3,p.y-g2*6-p.s*.3,p.s*(0.35+g2*.5),0,7);ctx.fill();
      if(f>.8){ctx.fillStyle='rgba(255,220,150,'+((f-.8)*4)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.s*.5,0,7);ctx.fill()}
      return;}
    case 'chute':{
      const yo=-(f)*22; // descends as life runs out
      ctx.fillStyle='rgba(225,228,210,'+Math.min(1,f*2)+')';
      ctx.beginPath();ctx.arc(p.x,p.y+yo,p.s,Math.PI,0);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(160,162,148,'+Math.min(1,f*2)+')';ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(p.x-p.s,p.y+yo);ctx.lineTo(p.x,p.y+yo+11);
      ctx.moveTo(p.x+p.s,p.y+yo);ctx.lineTo(p.x,p.y+yo+11);
      ctx.moveTo(p.x,p.y+yo);ctx.lineTo(p.x,p.y+yo+11);ctx.stroke();break;}
    case 'fire':{
      const r=p.s*(.55+.75*(1-f));
      if(p.c){
        ctx.globalAlpha=.75*f;ctx.fillStyle=p.c;
        ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();
        ctx.globalAlpha=1;
      }else{
        ctx.fillStyle='rgba(255,110,40,'+(.75*f)+')';
        ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();
        ctx.fillStyle='rgba(255,225,140,'+(.85*f)+')';
        ctx.beginPath();ctx.arc(p.x,p.y-r*.18,r*.55,0,7);ctx.fill();
      }
      break;}
    case 'deb':
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.fillStyle='rgba(40,44,36,'+Math.min(1,f*1.6)+')';
      ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.7);ctx.restore();break;
    case 'spark':
      ctx.fillStyle=p.c||'#ffd27d';ctx.globalAlpha=f;
      ctx.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s);ctx.globalAlpha=1;break;
    case 'smoke':
      if(p.c){ctx.globalAlpha=.5*f;ctx.fillStyle=p.c;}
      else ctx.fillStyle='rgba(70,76,64,'+(.5*f)+')';
      ctx.beginPath();ctx.arc(p.x,p.y,p.s*(1.6-f*.6),0,7);ctx.fill();
      if(p.c)ctx.globalAlpha=1;
      break;
    case 'dust':
      ctx.fillStyle='rgba(108,96,70,'+(.4*f)+')';
      ctx.beginPath();ctx.arc(p.x,p.y,p.s*(1.7-f*.7),0,7);ctx.fill();break;
    case 'flash':
      ctx.fillStyle=p.c?('rgba(159,233,255,'+f+')'):'rgba(255,238,170,'+f+')';
      ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,7);ctx.fill();break;
    case 'trace':
      if(p.fl){
        ctx.strokeStyle='rgba(255,120,40,'+(f*2.2)+')';ctx.lineWidth=5;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x2,p.y2);ctx.stroke();
        ctx.strokeStyle='rgba(255,220,120,'+(f*4)+')';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x2,p.y2);ctx.stroke();
      }else if(p.c){
        ctx.strokeStyle='rgba(125,220,255,'+(f*2.4)+')';ctx.lineWidth=4;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x2,p.y2);ctx.stroke();
        ctx.strokeStyle='rgba(220,248,255,'+(f*7)+')';ctx.lineWidth=1.4;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x2,p.y2);ctx.stroke();
      }else{
        ctx.strokeStyle='rgba(255,230,160,'+(f*3)+')';ctx.lineWidth=3.4;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x2,p.y2);ctx.stroke();
        ctx.strokeStyle='rgba(255,255,220,'+(f*9)+')';ctx.lineWidth=1.2;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x2,p.y2);ctx.stroke();
      }break;
    case 'txt':
      ctx.fillStyle='rgba(255,217,94,'+f+')';ctx.font='bold 15px sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(p.txt,p.x,p.y);break;
  }
}
function drawPlane(p){
  ctx.save();ctx.translate(p.x,p.y);
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(6,28,20,5,0,0,7);ctx.fill();
  ctx.fillStyle='#8da2ad';
  ctx.beginPath();ctx.moveTo(26,0);ctx.lineTo(8,-4);ctx.lineTo(-16,-3);ctx.lineTo(-16,3);ctx.lineTo(8,4);ctx.closePath();ctx.fill();
  ctx.fillStyle='#7b909b';
  ctx.beginPath();ctx.moveTo(8,-2);ctx.lineTo(-6,-14);ctx.lineTo(-12,-13);ctx.lineTo(-2,-2);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(8,2);ctx.lineTo(-6,14);ctx.lineTo(-12,13);ctx.lineTo(-2,2);ctx.closePath();ctx.fill();
  ctx.fillStyle='#677a85';
  ctx.beginPath();ctx.moveTo(-12,-2);ctx.lineTo(-20,-8);ctx.lineTo(-22,-7);ctx.lineTo(-16,-1);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-12,2);ctx.lineTo(-20,8);ctx.lineTo(-22,7);ctx.lineTo(-16,1);ctx.closePath();ctx.fill();
  ctx.fillStyle='#3f5560';ctx.beginPath();ctx.ellipse(14,0,6,2.4,0,0,7);ctx.fill();
  ctx.fillStyle='rgba(255,176,102,'+(0.6+0.4*Math.sin(gtime*30))+')';ctx.fillRect(-21,-1.6,5,3.2);
  ctx.restore();
}
let boxSel=null;
function render(){
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#0a0e09';ctx.fillRect(0,0,vw,vh);
  if(!groundCv)return;
  const z=cam.z;
  let shx=0,shy=0;
  if(shake>0){shx=vrand(-1,1)*shake*10;shy=vrand(-1,1)*shake*10}
  ctx.setTransform(dpr*z,0,0,dpr*z,dpr*(vw/2-cam.x*z+shx),dpr*(vh/2-cam.y*z+shy));
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(groundCv,0,0);
  for(const p of parts)if(p.k==='scorch')drawPart(p);
  // Building wreckage — charred, smouldering ruins that cool over time
  for(const r of rubbles){
    const f=r.life/r.max;
    const rx=r.x-r.w/2,ry=r.y-r.h/2;
    ctx.save();
    ctx.globalAlpha=Math.min(0.92,f*3);
    // charred slab base
    ctx.fillStyle='#14110a';ctx.fillRect(rx+2,ry+2,r.w-4,r.h-4);
    // broken concrete chunks + twisted beams (deterministic from seed)
    let s=(r.seed||1)>>>0;const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
    for(let i=0;i<7;i++){const cw=r.w*(.13+rnd()*.17),cx=rx+rnd()*(r.w-cw),cy=ry+rnd()*(r.h-cw*.6);
      ctx.fillStyle=rnd()<.5?'#241d12':'#2c2417';ctx.fillRect(cx,cy,cw,cw*.58);}
    ctx.strokeStyle='#3a3322';ctx.lineWidth=2;
    for(let i=0;i<3;i++){const bx=rx+r.w*(.25+i*.25),by=ry+r.h*.72;
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+(rnd()-.5)*14,by-r.h*(.28+rnd()*.3));ctx.stroke();}
    ctx.globalAlpha=1;
    // smouldering heat glow + smoke while still hot (first ~45% of life)
    if(f>0.55){
      const heat=(f-0.55)/0.45,pulse=0.5+0.5*Math.sin(gtime*5+r.x);
      ctx.fillStyle='rgba(255,120,40,'+(0.16*heat*pulse)+')';
      ctx.fillRect(rx+4,ry+4,r.w-8,r.h-8);
      if(state==='play'&&Math.random()<0.16*heat)
        addPart({k:'smoke',x:r.x+vrand(-r.w*.3,r.w*.3),y:r.y+vrand(-r.h*.3,r.h*.2),vx:vrand(-6,6),vy:vrand(-26,-12),life:vrand(1,2),max:2,s:vrand(8,16)});
      if(state==='play'&&Math.random()<0.09*heat)
        addPart({k:'spark',x:r.x+vrand(-r.w*.3,r.w*.3),y:r.y,vx:vrand(-20,20),vy:vrand(-40,-10),life:.4,max:.4,s:2,c:'#ff8a3a'});
    }
    ctx.restore();
  }
  for(const fz of fireZones){
    if(tileVisAt(fz.x,fz.y)<1)continue;
    const fl=fz.life/fz.maxLife;
    const pulse=0.7+0.3*Math.sin(gtime*9+fz.x*.05);
    const gr=ctx.createRadialGradient(fz.x,fz.y,0,fz.x,fz.y,fz.r);
    if(fz.toxic){
      gr.addColorStop(0,'rgba(80,210,60,'+(.65*fl*pulse)+')');
      gr.addColorStop(.55,'rgba(30,150,20,'+(.45*fl)+')');
      gr.addColorStop(1,'rgba(10,70,0,0)');
    }else{
      gr.addColorStop(0,'rgba(255,160,30,'+(.7*fl*pulse)+')');
      gr.addColorStop(.55,'rgba(230,60,10,'+(.5*fl)+')');
      gr.addColorStop(1,'rgba(160,20,0,0)');
    }
    ctx.fillStyle=gr;ctx.beginPath();ctx.arc(fz.x,fz.y,fz.r,0,7);ctx.fill();
  }
  for(const p of piles)drawPile(p);
  for(const s of scraps)drawScrap(s);
  for(const b of builds)drawBuilding(b);
  // Render interpolation for units
  for(const u of units){
    if(u.dead)continue;
    const ox=u.x,oy=u.y;
    u.x=(u.px!==undefined)?u.px+(ox-u.px)*renderAlpha:ox;
    u.y=(u.py!==undefined)?u.py+(oy-u.py)*renderAlpha:oy;
    drawUnit(u);
    u.x=ox;u.y=oy;
  }
  for(const p of projs)drawProj(p);
  for(const p of parts)if(p.k!=='scorch')drawPart(p);
  for(const p of planes)drawPlane(p);
    {const _sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(fogCv,0,0,MAPW,MAPH,0,0,WW,WH);
  ctx.imageSmoothingEnabled=_sm;}
  if(placing){
    const t=BT[placing.type],ok=canPlace(placing.type,placing.tx,placing.ty,0);
    placing.ok=ok;
    const x0=placing.tx*TILE,y0=placing.ty*TILE,w=t.w*TILE,h=t.h*TILE;
    ctx.globalAlpha=.6;
    ctx.drawImage(bSpr(placing.type,fac[0],gens[0]),x0-BM,y0-BM,w+BM*2,h+BM*2);
    ctx.globalAlpha=1;
    ctx.fillStyle=ok?'rgba(120,220,110,.22)':'rgba(235,90,70,.34)';
    ctx.fillRect(x0,y0,w,h);
    ctx.strokeStyle=ok?'#8fe27c':'#ff7a68';ctx.lineWidth=2;ctx.setLineDash([8,6]);
    ctx.strokeRect(x0,y0,w,h);ctx.setLineDash([]);
    if(!ok){
      ctx.strokeStyle='#ff7a68';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(x0+w/2-10,y0+h/2-10);ctx.lineTo(x0+w/2+10,y0+h/2+10);
      ctx.moveTo(x0+w/2+10,y0+h/2-10);ctx.lineTo(x0+w/2-10,y0+h/2+10);ctx.stroke();
    }
  }
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(boxSel){
    ctx.strokeStyle='#9fe27c';ctx.lineWidth=1.4;
    ctx.fillStyle='rgba(140,220,120,.12)';
    const x=Math.min(boxSel.x0,boxSel.x1),y=Math.min(boxSel.y0,boxSel.y1);
    const w=Math.abs(boxSel.x1-boxSel.x0),h=Math.abs(boxSel.y1-boxSel.y0);
    ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);
  }
  if(targetPower){
    const col=targetPower==='repair'?'#8fe27c':targetPower==='nuke'?'#ffb02e':'#ffb066';
    ctx.strokeStyle=col;ctx.lineWidth=2;
    const r=16+Math.sin(gtime*6)*4;
    ctx.beginPath();ctx.arc(vw/2,vh/2,r,0,7);ctx.stroke();
    ctx.beginPath();ctx.moveTo(vw/2-r-7,vh/2);ctx.lineTo(vw/2+r+7,vh/2);ctx.moveTo(vw/2,vh/2-r-7);ctx.lineTo(vw/2,vh/2+r+7);ctx.stroke();
    ctx.fillStyle=col;ctx.font='bold 13px sans-serif';ctx.textAlign='center';
    ctx.fillText(POWERS[targetPower].ic+' '+POWERS[targetPower].nm+' — TAP A TARGET',vw/2,vh/2-r-14);
  }
}
function renderMini(){
  const sx=mcv.width/WW,sy=mcv.height/WH;
  mctx.fillStyle='#1d2718';mctx.fillRect(0,0,mcv.width,mcv.height);
  mctx.fillStyle='#4a4f49';
  for(const r of rocks)mctx.fillRect(r.tx*TILE*sx,r.ty*TILE*sy,2,2);
  mctx.fillStyle='#d8a93f';
  for(const p of piles)if(p.amt>0)mctx.fillRect(p.x*sx-2,p.y*sy-2,4,4);
  for(const b of builds){
    if(b.dead)continue;
    if(isEnemy(0,b.team)&&vis[idx(b.tx,b.ty)]===0)continue;
    mctx.fillStyle=b.team>=0?TEAMC[b.team]:'#9aa48c';
    mctx.fillRect(b.tx*TILE*sx,b.ty*TILE*sy,Math.max(3,b.t.w*TILE*sx),Math.max(3,b.t.h*TILE*sy));
  }
  for(const u of units){
    if(u.dead)continue;
    if(isEnemy(0,u.team)&&tileVisAt(u.x,u.y)!==2)continue;
    mctx.fillStyle=TEAMC[u.team];
    if(u.cat==='air'){
      // Circles for air units to distinguish from ground forces
      mctx.beginPath();mctx.arc(u.x*sx,u.y*sy,2.2,0,7);mctx.fill();
    }else{
      mctx.fillRect(u.x*sx-1.5,u.y*sy-1.5,3,3);
    }
  }
  mctx.fillStyle='rgba(0,0,0,.62)';
  const tw=TILE*sx,th=TILE*sy;
  for(let y=0;y<MAPH;y+=2)for(let x=0;x<MAPW;x+=2)
    if(vis[idx(x,y)]===0)mctx.fillRect(x*TILE*sx,y*TILE*sy,tw*2+.5,th*2+.5);
  const vwW=vw/cam.z,vwH=vh/cam.z;
  mctx.strokeStyle='#e9f1e2';mctx.lineWidth=1;
  mctx.strokeRect((cam.x-vwW/2)*sx,(cam.y-vwH/2)*sy,vwW*sx,vwH*sy);
}
