'use strict';
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