'use strict';
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