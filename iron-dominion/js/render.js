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
/* --- building sprites --- */
function bSpr(type,fk){
  const t=BT[type],W=t.w*TILE,H=t.h*TILE;
  return spr('B'+type+'_'+fk,W+BM*2,H+BM*2,g=>{
    const X=BM,Y=BM,F=FACTIONS[fk]||{c:'#9aa48c',d:'#7a8470'},ac=F.c,C=facCol(fk);
    pShadow(g,X,Y,W,H);
    switch(type){
      case 'command':{
        pFoundation(g,X,Y,W,H);
        // helipad corner
        g.fillStyle='#2e352c';g.beginPath();g.arc(X+W-26,Y+H-26,18,0,7);g.fill();
        g.strokeStyle='#737d68';g.lineWidth=2;g.beginPath();g.arc(X+W-26,Y+H-26,14,0,7);g.stroke();
        g.fillStyle='#9aa48c';g.font='bold 14px sans-serif';g.textAlign='center';g.textBaseline='middle';
        g.fillText('H',X+W-26,Y+H-25);
        // main two-storey block
        pPanel(g,X+8,Y+8,W*.62,H*.56,C(31),C(38),C(19));
        g.strokeStyle='rgba(0,0,0,.22)';
        for(let i=1;i<3;i++){g.beginPath();g.moveTo(X+8,Y+8+H*.56*i/3);g.lineTo(X+8+W*.62,Y+8+H*.56*i/3);g.stroke()}
        pPanel(g,X+16,Y+14,16,12,C(36),C(43),C(24));
        g.fillStyle='#2b3128';g.beginPath();g.arc(X+24,Y+20,4,0,7);g.fill();
        g.strokeStyle=C(48);g.beginPath();g.moveTo(X+20,Y+20);g.lineTo(X+28,Y+20);g.moveTo(X+24,Y+16);g.lineTo(X+24,Y+24);g.stroke();
        // radar pad (dish live)
        g.fillStyle='#30372d';g.beginPath();g.arc(X+W*.62,Y+H*.34,15,0,7);g.fill();
        g.strokeStyle='#171c16';g.lineWidth=2;g.stroke();
        g.fillStyle=C(28);g.beginPath();g.arc(X+W*.62,Y+H*.34,10,0,7);g.fill();
        // right wing
        pPanel(g,X+W*.66,Y+14,W*.28,H*.42,C(28),C(35),C(17));
        pWindows(g,X+W*.68,Y+22,3,true);
        pWindows(g,X+W*.68,Y+36,3,true);
        // antenna
        g.strokeStyle='#9aa28c';g.lineWidth=1.6;
        g.beginPath();g.moveTo(X+W-22,Y+10);g.lineTo(X+W-22,Y-8);g.stroke();
        g.beginPath();g.moveTo(X+W-27,Y+2);g.lineTo(X+W-17,Y+2);g.stroke();
        // entrance
        pHazard(g,X+W*.26,Y+H-16,W*.34,5);
        g.fillStyle='#171d15';g.fillRect(X+W*.30,Y+H-11,W*.26,9);
        g.fillStyle=ac;g.fillRect(X+W*.30,Y+H-11,W*.26,2);
        g.fillStyle=ac;g.fillRect(X+8,Y+H-7,26,4);
        g.fillStyle=F.d;g.fillRect(X+8,Y+H*.56+8,W*.62,4);
        break;}
      case 'power':{
        pFoundation(g,X,Y,W,H);
        pPanel(g,X+W*.30,Y+H-26,W*.4,18,C(30),C(37),C(19));
        g.fillStyle='#c9a23a';g.beginPath();g.moveTo(X+W/2,Y+H-23);g.lineTo(X+W/2+5,Y+H-14);g.lineTo(X+W/2-5,Y+H-14);g.closePath();g.fill();
        g.fillStyle='#1c1c14';g.font='bold 7px sans-serif';g.textAlign='center';g.fillText('!',X+W/2,Y+H-15.5);
        g.strokeStyle=C(40);g.lineWidth=4;g.lineCap='round';
        g.beginPath();g.moveTo(X+20,Y+30);g.lineTo(X+20,Y+H-20);g.lineTo(X+W*.36,Y+H-20);g.stroke();
        g.beginPath();g.moveTo(X+W-20,Y+30);g.lineTo(X+W-20,Y+H-20);g.lineTo(X+W*.64,Y+H-20);g.stroke();
        g.lineCap='butt';
        for(const cxp of[X+22,X+W-22]){
          g.fillStyle=C(38);g.beginPath();g.arc(cxp,Y+24,14,0,7);g.fill();
          g.fillStyle=C(46);g.beginPath();g.arc(cxp-3,Y+21,11,0,7);g.fill();
          g.fillStyle='#23291f';g.beginPath();g.ellipse(cxp,Y+23,8,7,0,0,7);g.fill();
          g.strokeStyle=C(54);g.lineWidth=1.5;g.beginPath();g.arc(cxp,Y+24,13,Math.PI*.7,Math.PI*1.4);g.stroke();
        }
        g.fillStyle=ac;g.fillRect(X+4,Y+4,12,4);g.fillRect(X+W-16,Y+4,12,4);
        break;}
      case 'supply':{
        pFoundation(g,X,Y,W,H);
        // yellow logistics yard corner
        pHazard(g,X+4,Y+H-12,30,4);
        pPanel(g,X+8,Y+8,W-16,H-26,C(31),C(39),C(20));
        for(let i=0;i<7;i++){g.fillStyle=i%2?C(34):C(28);g.fillRect(X+12+i*(W-24)/7,Y+11,(W-24)/7-1,H-34)}
        g.fillStyle='#2c332a';g.fillRect(X+8,Y+8+(H-26)/2-1.5,W-16,3);
        g.strokeStyle='#8a8f7c';g.lineWidth=3;
        g.beginPath();g.moveTo(X+W-14,Y+4);g.lineTo(X+W-14,Y+26);g.stroke();
        g.beginPath();g.moveTo(X+W-14,Y+8);g.lineTo(X+W-44,Y+8);g.stroke();
        g.strokeStyle='#41463a';g.lineWidth=1.4;
        g.beginPath();g.moveTo(X+W-36,Y+8);g.lineTo(X+W-36,Y+18);g.stroke();
        g.fillStyle='#c9a23a';g.fillRect(X+W-39,Y+18,6,5);
        for(let i=0;i<3;i++){
          g.fillStyle='#d8a93f';g.fillRect(X+12+i*4,Y+H-32-i*5,16,8);
          g.fillStyle='#8a6a22';g.fillRect(X+12+i*4,Y+H-32-i*5+5,16,2);
          g.fillStyle='#f3cf6d';g.fillRect(X+12+i*4,Y+H-32-i*5,16,2);
        }
        pHazard(g,X+W*.3,Y+H-19,W*.4,4);
        g.fillStyle='#1b211a';g.fillRect(X+W*.33,Y+H-15,W*.34,12);
        g.strokeStyle='#39423a';g.lineWidth=1;
        for(let i=1;i<4;i++){g.beginPath();g.moveTo(X+W*.33,Y+H-15+i*3);g.lineTo(X+W*.67,Y+H-15+i*3);g.stroke()}
        g.fillStyle='#ffd95e';g.font='bold 9px sans-serif';g.textAlign='center';g.fillText('$',X+W/2,Y+H-5);
        g.fillStyle=ac;g.fillRect(X+8,Y+H-9,16,4);
        break;}
      case 'barracks':{
        // dirt training ground instead of slab
        g.fillStyle='#33301f';g.beginPath();g.ellipse(X+W/2,Y+H/2+3,W*.56,H*.62,0,0,7);g.fill();
        g.fillStyle='#3d3927';g.beginPath();g.ellipse(X+W/2,Y+H/2+2,W*.5,H*.55,0,0,7);g.fill();
        g.fillStyle=C(26);
        g.beginPath();g.moveTo(X+8,Y+H-10);g.lineTo(X+8,Y+26);
        g.quadraticCurveTo(X+8,Y+8,X+34,Y+8);g.lineTo(X+W-22,Y+8);
        g.quadraticCurveTo(X+W-8,Y+8,X+W-8,Y+26);g.lineTo(X+W-8,Y+H-10);g.closePath();g.fill();
        g.strokeStyle=C(34);g.lineWidth=1.6;
        for(let i=0;i<5;i++){const xx=X+18+i*(W-38)/4;g.beginPath();g.moveTo(xx,Y+9);g.lineTo(xx,Y+H-10);g.stroke()}
        g.strokeStyle='#28302a';g.beginPath();g.moveTo(X+8,Y+26);g.lineTo(X+W-8,Y+26);g.stroke();
        g.fillStyle='#1b211a';g.fillRect(X+W/2-7,Y+H-26,14,16);
        g.fillStyle=ac;g.fillRect(X+W/2-7,Y+H-26,14,2.5);
        pWindows(g,X+16,Y+32,2,true);pWindows(g,X+W-34,Y+32,2,true);
        g.fillStyle='#8d855f';
        for(let i=0;i<6;i++){g.beginPath();g.ellipse(X+14+i*((W-28)/5),Y+H-7,7,4,0,0,7);g.fill()}
        g.fillStyle='#6f6848';
        for(let i=0;i<5;i++){g.beginPath();g.ellipse(X+20+i*((W-28)/5),Y+H-11,7,4,0,0,7);g.fill()}
        g.strokeStyle='#cfd8c2';g.lineWidth=2;
        g.beginPath();g.moveTo(X+10,Y+12);g.lineTo(X+10,Y-9);g.stroke();
        break;}
      case 'factory':{
        pFoundation(g,X,Y,W,H);
        pPanel(g,X+8,Y+8,W-16,H-22,C(30),C(38),C(19));
        for(let i=0;i<3;i++){
          const sx=X+12+i*(W-24)/3,sw=(W-24)/3-2;
          g.fillStyle=C(24);g.beginPath();g.moveTo(sx,Y+26);g.lineTo(sx,Y+10);g.lineTo(sx+sw,Y+26);g.closePath();g.fill();
          g.fillStyle='#7e93a0';g.beginPath();g.moveTo(sx,Y+10);g.lineTo(sx+5,Y+10);g.lineTo(sx+sw*.4,Y+26);g.lineTo(sx,Y+26);g.closePath();g.fill();
        }
        pPanel(g,X+W-26,Y+2,11,22,C(33),C(41),C(22));
        g.fillStyle=ac;g.fillRect(X+W-26,Y+6,11,3);
        g.strokeStyle=C(40);g.lineWidth=3.4;g.lineCap='round';
        g.beginPath();g.moveTo(X+10,Y+34);g.lineTo(X+10,Y+H-26);g.stroke();
        g.beginPath();g.moveTo(X+15,Y+38);g.lineTo(X+15,Y+H-26);g.stroke();g.lineCap='butt';
        g.strokeStyle='#8a8f7c';g.lineWidth=2.4;
        g.beginPath();g.moveTo(X+24,Y+30);g.lineTo(X+W-32,Y+30);g.stroke();
        g.fillStyle='#33392f';g.fillRect(X+W*.45,Y+28,9,5);
        pHazard(g,X+W*.28,Y+H-22,W*.44,4);
        g.fillStyle='#171d16';g.fillRect(X+W*.30,Y+H-18,W*.40,15);
        g.strokeStyle='#3a423a';g.lineWidth=1;
        for(let i=1;i<6;i++){const xx=X+W*.30+i*W*.40/6;g.beginPath();g.moveTo(xx,Y+H-18);g.lineTo(xx,Y+H-3);g.stroke()}
        g.fillStyle=ac;g.fillRect(X+8,Y+H-8,20,4);
        break;}
      case 'market':{
        // dirt yard foundation with crates
        g.fillStyle='rgba(70,58,36,.5)';g.beginPath();g.ellipse(X+W/2,Y+H/2,W*.62,H*.62,0,0,7);g.fill();
        pShadow(g,X+3,Y+5,W-4,H-4);
        pPanel(g,X+4,Y+10,W-8,H-12,C(26),C(33),C(13));
        // striped awning out front
        g.fillStyle=C(38);g.fillRect(X+2,Y+2,W-4,13);
        for(let i=0;i<(W-4)/10;i++){g.fillStyle=i%2?ac:'#e8e3d2';g.fillRect(X+2+i*10,Y+2,10,13)}
        g.strokeStyle=C(12);g.lineWidth=1.4;g.strokeRect(X+2,Y+2,W-4,13);
        // coin sign
        g.fillStyle='#191407';g.beginPath();g.arc(X+W/2,Y+H*.55,9.4,0,7);g.fill();
        g.fillStyle='#ffd95e';g.beginPath();g.arc(X+W/2,Y+H*.55-1,8.4,0,7);g.fill();
        g.fillStyle='#a8801e';g.font='bold 11px sans-serif';g.textAlign='center';g.textBaseline='middle';
        g.fillText('$',X+W/2,Y+H*.55-1);
        // crates by the door
        for(const[cx2,cy2]of[[X+8,Y+H-14],[X+W-16,Y+H-13],[X+W-26,Y+H-11]]){
          g.fillStyle='#8a6a2e';g.fillRect(cx2,cy2,9,8);
          g.fillStyle='#a8842e';g.fillRect(cx2,cy2,9,3);
          g.strokeStyle='#3e2f12';g.lineWidth=.9;g.strokeRect(cx2,cy2,9,8);
        }
        pBolts(g,X+4,Y+10,W-8,H-12);
        break;}
      case 'tech':{
        pFoundation(g,X,Y,W,H);
        pShadow(g,X+3,Y+4,W-5,H-5);
        pPanel(g,X+3,Y+3,W-6,H-6,C(27),C(34),C(13));
        // glass research dome (left)
        g.fillStyle='#10181c';g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.34,0,7);g.fill();
        const dg=g.createRadialGradient(X+W*.27,Y+H*.44,2,X+W*.3,Y+H*.5,H*.34);
        dg.addColorStop(0,'#9fe9ff');dg.addColorStop(.55,'#2e7d96');dg.addColorStop(1,'#143641');
        g.fillStyle=dg;g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.3,0,7);g.fill();
        g.strokeStyle='#0c2228';g.lineWidth=1.2;
        g.beginPath();g.arc(X+W*.3,Y+H*.5,H*.3,0,7);g.stroke();
        g.beginPath();g.moveTo(X+W*.3-H*.3,Y+H*.5);g.lineTo(X+W*.3+H*.3,Y+H*.5);g.stroke();
        g.beginPath();g.moveTo(X+W*.3,Y+H*.5-H*.3);g.lineTo(X+W*.3,Y+H*.5+H*.3);g.stroke();
        // antenna array (right)
        g.fillStyle=C(20);g.fillRect(X+W*.58,Y+8,W*.34,H-16);
        g.strokeStyle=C(11);g.lineWidth=1.1;g.strokeRect(X+W*.58,Y+8,W*.34,H-16);
        g.strokeStyle='#aeb8a4';g.lineWidth=1.6;
        for(let i=0;i<3;i++){
          const axx=X+W*.64+i*W*.1;
          g.beginPath();g.moveTo(axx,Y+H*.55);g.lineTo(axx,Y+2-i*3);g.stroke();
          g.fillStyle='#ff5147';g.beginPath();g.arc(axx,Y+2-i*3,1.6,0,7);g.fill();
        }
        pWindows(g,X+W*.6,Y+H-16,3,true);
        g.fillStyle=ac;g.fillRect(X+5,Y+5,W*.16,4);
        pBolts(g,X+3,Y+3,W-6,H-6);
        break;}
      case 'silo':{
        pFoundation(g,X,Y,W,H);
        // big concrete pad
        g.fillStyle='#4a4d44';g.fillRect(X+3,Y+3,W-6,H-6);
        g.fillStyle='#565a50';g.fillRect(X+3,Y+3,W-6,(H-6)*.45);
        g.strokeStyle='#23251f';g.lineWidth=1.6;g.strokeRect(X+3,Y+3,W-6,H-6);
        pHazard(g,X+3,Y+H-11,W-6,8);
        // circular blast doors
        const cx2=X+W/2,cy2=Y+H*.46,R2=Math.min(W,H)*.3;
        g.fillStyle='#23251f';g.beginPath();g.arc(cx2,cy2,R2+3,0,7);g.fill();
        g.fillStyle='#3a3d35';g.beginPath();g.arc(cx2,cy2,R2,0,7);g.fill();
        g.fillStyle='#474b41';g.beginPath();g.arc(cx2,cy2,R2,-Math.PI/2,Math.PI/2);g.closePath();g.fill();
        g.strokeStyle='#191b15';g.lineWidth=1.8;
        g.beginPath();g.arc(cx2,cy2,R2,0,7);g.stroke();
        g.beginPath();g.moveTo(cx2,cy2-R2);g.lineTo(cx2,cy2+R2);g.stroke();
        // radiation chevrons on the doors
        g.fillStyle='#ffb02e';
        for(let i=0;i<3;i++){
          const a2=-Math.PI/2+i*(Math.PI*2/3);
          g.save();g.translate(cx2,cy2);g.rotate(a2);
          g.beginPath();g.moveTo(0,-3);g.lineTo(R2*.62,-R2*.34);g.lineTo(R2*.62,R2*.34-6);g.closePath();g.fill();
          g.restore();
        }
        g.fillStyle='#191b15';g.beginPath();g.arc(cx2,cy2,3.4,0,7);g.fill();
        // control bunker corner
        pPanel(g,X+W-26,Y+6,20,16,C(28),C(35),C(12));
        pWindows(g,X+W-23,Y+10,2,true);
        g.fillStyle=ac;g.fillRect(X+6,Y+6,12,4);
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
        // circular concrete pad
        g.fillStyle='#39413a';g.beginPath();g.arc(X+W/2,Y+H/2,W/2-2,0,7);g.fill();
        g.strokeStyle='#262c25';g.lineWidth=2;g.stroke();
        g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1;
        g.beginPath();g.arc(X+W/2,Y+H/2,W/2-6,0,7);g.stroke();
        g.fillStyle='#8d855f';
        for(let i=0;i<10;i++){const a=i/10*7;g.beginPath();g.ellipse(X+W/2+Math.cos(a)*(W/2-9),Y+H/2+Math.sin(a)*(H/2-9),6,3.6,a,0,7);g.fill()}
        g.fillStyle=C(28);g.beginPath();
        for(let i=0;i<8;i++){const a=i/8*7+.39;const px=X+W/2+Math.cos(a)*20,py=Y+H/2+Math.sin(a)*20;i?g.lineTo(px,py):g.moveTo(px,py)}
        g.closePath();g.fill();
        g.strokeStyle='#1d231a';g.lineWidth=2;g.stroke();
        g.fillStyle=C(36);g.beginPath();
        for(let i=0;i<8;i++){const a=i/8*7+.39;const px=X+W/2+Math.cos(a)*15,py=Y+H/2+Math.sin(a)*15;i?g.lineTo(px,py):g.moveTo(px,py)}
        g.closePath();g.fill();
        g.fillStyle='rgba(0,0,0,.4)';
        for(let i=0;i<8;i++){const a=i/8*7+.39;g.fillRect(X+W/2+Math.cos(a)*17.5-1,Y+H/2+Math.sin(a)*17.5-1,2,2)}
        g.fillStyle='#23291f';g.beginPath();g.arc(X+W/2,Y+H/2,9,0,7);g.fill();
        g.strokeStyle=ac;g.lineWidth=2;g.beginPath();g.arc(X+W/2,Y+H/2,11.5,0,7);g.stroke();
        break;}
      case 'airfield':{
        pFoundation(g,X,Y,W,H);
        // Taxiway stripes
        g.fillStyle='#c9a23a';
        for(let i=0;i<5;i++){g.fillRect(X+8+i*(W-16)/5,Y+H-14,(W-16)/5-2,4)}
        // Runway
        g.fillStyle='#3a3d35';g.fillRect(X+6,Y+H*.3,W-12,H*.35);
        g.strokeStyle='#c9a23a';g.lineWidth=2;g.setLineDash([8,6]);
        g.beginPath();g.moveTo(X+W/2,Y+H*.3);g.lineTo(X+W/2,Y+H*.65);g.stroke();
        g.setLineDash([]);
        // 4 landing pads
        const pads2=BT.airfield.pads;
        for(let i=0;i<4;i++){
          const px2=(W/2+pads2[i][0]*1.2*TILE/TILE*20),py2=(H/2+pads2[i][1]*1.2*TILE/TILE*16);
          g.fillStyle='#2d3328';g.beginPath();g.arc(X+px2,Y+py2,10,0,7);g.fill();
          g.strokeStyle='#ffd95e';g.lineWidth=1.4;g.beginPath();g.arc(X+px2,Y+py2,10,0,7);g.stroke();
          g.strokeStyle='#ffd95e';g.lineWidth=1;
          g.beginPath();g.moveTo(X+px2-7,Y+py2);g.lineTo(X+px2+7,Y+py2);
          g.moveTo(X+px2,Y+py2-7);g.lineTo(X+px2,Y+py2+7);g.stroke();
        }
        // Control tower
        pPanel(g,X+W*.6,Y+4,W*.22,H*.5,C(32),C(40),C(18));
        pWindows(g,X+W*.62,Y+12,2,true);
        g.fillStyle=ac;g.fillRect(X+W*.6,Y+4,W*.22,3);
        break;}
      case 'radar':{
        pFoundation(g,X,Y,W,H);
        // Equipment room
        pPanel(g,X+W*.18,Y+H*.52,W*.64,H*.36,C(28),C(36),C(17));
        // Mast
        g.strokeStyle=C(38);g.lineWidth=3.4;g.lineCap='round';
        g.beginPath();g.moveTo(X+W/2,Y+H*.5);g.lineTo(X+W/2,Y+12);g.stroke();g.lineCap='butt';
        // Dish
        g.fillStyle=C(22);g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.closePath();g.fill();
        g.strokeStyle=C(38);g.lineWidth=1.6;g.beginPath();g.arc(X+W/2,Y+16,W*.3,Math.PI,0);g.stroke();
        g.fillStyle=C(32);g.beginPath();g.arc(X+W/2,Y+16,W*.2,Math.PI,0);g.closePath();g.fill();
        // Sensor pulse
        g.fillStyle='#9fe9ff';g.beginPath();g.arc(X+W/2,Y+15,2.6,0,7);g.fill();
        g.fillStyle='rgba(159,233,255,.35)';g.beginPath();g.arc(X+W/2,Y+15,5.5,0,7);g.fill();
        g.fillStyle=ac;g.fillRect(X+5,Y+H-7,12,4);
        break;}
      case 'samsite':{
        pFoundation(g,X,Y,W,H);
        // SAM launcher base
        g.fillStyle=C(24);g.beginPath();g.arc(X+W/2,Y+H/2+4,W*.36,0,7);g.fill();
        g.strokeStyle=C(14);g.lineWidth=1.4;g.stroke();
        // Launch rail
        g.fillStyle=C(30);g.fillRect(X+W*.2,Y+H*.25,W*.6,8);
        g.strokeStyle=C(16);g.lineWidth=1;g.strokeRect(X+W*.2,Y+H*.25,W*.6,8);
        // SAM missiles on rail
        for(let i=0;i<3;i++){
          const mx2=X+W*.25+i*(W*.5/3);
          g.fillStyle='#8ab0bc';g.fillRect(mx2,Y+H*.18,5,10);
          g.fillStyle='#c04030';g.fillRect(mx2,Y+H*.18,5,3);
        }
        g.fillStyle=ac;g.fillRect(X+6,Y+H-7,10,4);
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
function uSpr(type,fk){
  const F=FACTIONS[fk],ac=F.c,C=facCol(fk);
  switch(type){
    case 'tank':return spr('Utank_'+fk,44,30,g=>{
      g.translate(22,15);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,19,12,0,0,7);g.fill();
      trackPair(g,38,28);
      g.fillStyle=C(29);
      g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,3);g.lineTo(11,8);g.lineTo(-16,8);g.closePath();g.fill();
      g.fillStyle=C(36);
      g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,0);g.lineTo(-16,0);g.closePath();g.fill();
      g.strokeStyle=C(15);g.lineWidth=1.4;
      g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,3);g.lineTo(11,8);g.lineTo(-16,8);g.closePath();g.stroke();
      g.fillStyle=C(18);g.fillRect(-15,-5,6,10);
      g.strokeStyle=C(10);g.lineWidth=1;
      for(let i=0;i<3;i++){g.beginPath();g.moveTo(-14.4,-3+i*3);g.lineTo(-9.6,-3+i*3);g.stroke()}
      g.fillStyle='#1d231a';g.fillRect(-18,-6,3,4);
      g.fillStyle=ac;g.fillRect(7,-7.4,4,14.8);
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
      trackPair(g,34,26);
      g.fillStyle=C(28);
      g.beginPath();g.moveTo(-14,-7);g.lineTo(12,-7);g.lineTo(16,-2);g.lineTo(16,2);g.lineTo(12,7);g.lineTo(-14,7);g.closePath();g.fill();
      g.fillStyle=C(35);
      g.beginPath();g.moveTo(-14,-7);g.lineTo(12,-7);g.lineTo(16,-2);g.lineTo(16,0);g.lineTo(-14,0);g.closePath();g.fill();
      g.strokeStyle=C(14);g.lineWidth=1.4;g.strokeRect(-14,-7,30,14);
      g.fillStyle=C(20);g.beginPath();g.moveTo(-14,-5);g.lineTo(-20,-7);g.lineTo(-20,7);g.lineTo(-14,5);g.closePath();g.fill();
      g.fillStyle=ac;g.fillRect(8,-6.4,4,12.8);
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
function drawSoldier(g,type,ac,R,moving,ph){
  if(moving){
    g.strokeStyle='#2c3326';g.lineWidth=2.8;
    const lo=Math.sin(ph)*4.2;
    g.beginPath();g.moveTo(-1,-2.6);g.lineTo(-4+lo,-4.2);g.moveTo(-1,2.6);g.lineTo(-4-lo,4.2);g.stroke();
  }
  g.fillStyle='#11160e';g.beginPath();g.arc(0,0,R+1,0,7);g.fill();
  g.fillStyle='#3f4a37';g.beginPath();g.arc(0,0,R,0,7);g.fill();
  g.fillStyle='#535f48';g.beginPath();g.arc(-1,-1,R*.62,0,7);g.fill();
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
  g.fillStyle=type==='guardian'?'#46565e':'#5b6850';g.beginPath();g.arc(1.2,0,R*.55,0,7);g.fill();
  g.fillStyle=type==='guardian'?'#5a6c75':'#6d7b60';g.beginPath();g.arc(2,-.9,R*.34,0,7);g.fill();
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
    if(t.cat==='inf'){g.scale(2.5,2.5);drawSoldier(g,type,FACTIONS[fk].c,t.r*1.3,false,0)}
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
function drawBuilding(b){
  const x0=b.tx*TILE,y0=b.ty*TILE,w=b.t.w*TILE,h=b.t.h*TILE;
  const bx=x0+w/2,by=y0+h/2;
  const btw=w,bth=h;
  const fk=b.team>=0?fac[b.team]:'neutral';
  const ac=b.team>=0?TEAMC[b.team]:'#9aa48c';
  // GLA hole rendering (Scorpion)
  if(b.isHole){
    ctx.save();ctx.globalAlpha=0.85;
    ctx.fillStyle='#1a0a00';ctx.beginPath();ctx.arc(bx,by,Math.max(btw,bth)*.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ff6600';ctx.globalAlpha=0.4+0.2*Math.sin(Date.now()*.005);
    ctx.beginPath();ctx.arc(bx,by,8,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffaa00';ctx.lineWidth=3;ctx.globalAlpha=0.7;
    ctx.beginPath();ctx.arc(bx,by,Math.max(btw,bth)*.4,0,Math.PI*2*(1-b.holeT/15));ctx.stroke();
    ctx.restore();
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
      const s=bSpr(b.type,fk);
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
  ctx.drawImage(bSpr(b.type,fk),x0-BM,y0-BM,w+BM*2,h+BM*2);
  switch(b.type){
    case 'command':{
      ctx.save();ctx.translate(x0+w*.62,y0+h*.34);ctx.rotate(gtime*1.2);
      ctx.fillStyle='#d6dfc9';ctx.beginPath();ctx.arc(0,0,12,-.62,.62);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#7e8a72';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(13,0);ctx.stroke();
      ctx.restore();
      if(Math.sin(gtime*3.4)>0){ctx.fillStyle='#ff5147';ctx.beginPath();ctx.arc(x0+w-22,y0-8,2.4,0,7);ctx.fill()}
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
      // pulsing dome glow + blinking antenna lights
      ctx.fillStyle='rgba(125,220,255,'+(0.10+0.08*Math.sin(gtime*2.6))+')';
      ctx.beginPath();ctx.arc(x0+w*.3,y0+h*.5,h*.34,0,7);ctx.fill();
      if(Math.sin(gtime*5+b.id)>0.2){ctx.fillStyle='#ff5147';ctx.beginPath();ctx.arc(x0+w*.74,y0-4,1.8,0,7);ctx.fill()}
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
  {const BICO={command:'🏢',power:'⚡',supply:'📦',market:'💰',barracks:'🪖',factory:'⚙️',tech:'🔬',silo:'☢️',airfield:'✈️',samsite:'🚀',repairbay:'🔩',watchtower:'🔭'};
  const bic=BICO[b.type];
  if(bic){ctx.save();const icx=x0+w/2,icy=y0+7;ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.ellipse(icx,icy,11,9,0,0,7);ctx.fill();ctx.font='11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(bic,icx,icy);ctx.restore()}}
  if(b.hp<b.maxhp*.45&&state==='play'&&(tileVisAt(b.x,b.y)===2||!isEnemy(0,b.team))){
    if(Math.random()<.08)addPart({k:'smoke',x:x0+vrand(8,w-8),y:y0+vrand(6,h*.5),vx:vrand(-5,5),vy:vrand(-26,-12),life:vrand(.7,1.2),max:vrand(.7,1.2),s:vrand(5,9)});
    if(b.hp<b.maxhp*.25&&Math.random()<.05)addPart({k:'fire',x:x0+vrand(10,w-10),y:y0+vrand(8,h-12),vx:0,vy:vrand(-14,-6),life:vrand(.2,.4),max:vrand(.2,.4),s:vrand(5,9)});
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
  drawSoldier(ctx,u.type,TEAMC[u.team],R,u.moving,ph);
  ctx.restore();
}
function drawUnit(u){
  if(u.hidden)return;
  if(isEnemy(0,u.team)&&tileVisAt(u.x,u.y)!==2)return;
  // Aircraft rendering
  if(u.cat==='air'||u.zHeight>10){
    const zh=u.zHeight||30;
    const drawY=u.y-zh;
    // Ground shadow
    ctx.save();
    ctx.globalAlpha=0.28*(1-zh/80);
    ctx.fillStyle='rgba(0,0,0,.7)';
    ctx.beginPath();ctx.ellipse(u.x+zh*.15,u.y+zh*.08,u.t.r*1.1,u.t.r*.5,0,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
    ctx.restore();
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
  // Building rubble — decaying scorch marks where buildings died
  for(const r of rubbles){
    const f=r.life/r.max;
    ctx.globalAlpha=Math.min(0.85,f*2.5);
    ctx.fillStyle='rgba(18,16,10,0.82)';
    ctx.fillRect(r.x-r.w/2+2,r.y-r.h/2+2,r.w-4,r.h-4);
    ctx.strokeStyle='rgba(55,48,28,0.7)';ctx.lineWidth=1.5;
    ctx.strokeRect(r.x-r.w/2+4,r.y-r.h/2+4,r.w-8,r.h-8);
    ctx.globalAlpha=1;
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
  ctx.drawImage(fogCv,0,0,MAPW,MAPH,0,0,WW,WH);
  if(placing){
    const t=BT[placing.type],ok=canPlace(placing.type,placing.tx,placing.ty,0);
    placing.ok=ok;
    const x0=placing.tx*TILE,y0=placing.ty*TILE,w=t.w*TILE,h=t.h*TILE;
    ctx.globalAlpha=.6;
    ctx.drawImage(bSpr(placing.type,fac[0]),x0-BM,y0-BM,w+BM*2,h+BM*2);
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
