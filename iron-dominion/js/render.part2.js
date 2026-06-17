'use strict';
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