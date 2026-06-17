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
