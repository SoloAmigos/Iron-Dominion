'use strict';
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
        if(fk==='crimson')techCrimson(g,X,Y,W,H,C,ac);
        else if(fk==='scorpion')techScorpion(g,X,Y,W,H,C,ac);
        else if(fk==='northwind')techNorthwind(g,X,Y,W,H,C,ac);
        else techVanguard(g,X,Y,W,H,C,ac);
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
