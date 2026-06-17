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
