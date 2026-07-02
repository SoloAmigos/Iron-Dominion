'use strict';
function drawBuilding(b){
  const x0=b.tx*TILE,y0=b.ty*TILE,w=b.t.w*TILE,h=b.t.h*TILE;
  const bx=x0+w/2,by=y0+h/2;
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
