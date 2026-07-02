'use strict';
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
  ctx.drawImage(fogCv,0,0,MAPW,MAPH,0,0,WW,WH);
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
