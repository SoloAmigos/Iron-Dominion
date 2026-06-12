'use strict';
/* ================= SPAWN / DAMAGE ================= */
function spawnUnit(type,team,x,y){
  const t=UT[type],f=FAC(team);
  const ft=freeNear(TT(x),TT(y));
  if(ft){x=ft.x*TILE+TILE/2+rand(-6,6);y=ft.y*TILE+TILE/2+rand(-6,6)}
  let hp=t.hp*f.uhp*upArm(team);
  if(type==='tank'&&f.tankHp)hp*=f.tankHp;
  // Apply GENMOD infantry HP bonus (Infantry General)
  const gm=GENMOD(team);
  if(gm.infHp&&t.cat==='inf')hp*=gm.infHp;
  if(gm.uhpMul)hp*=gm.uhpMul;
  hp=Math.round(hp);
  const u={kind:'u',id:ids++,type,team,x,y,px:x,py:y,a:team?Math.PI*0.75:-Math.PI*0.25,ta:0,hp,maxhp:hp,t,cat:t.cat,
    spd:t.spd*f.spd,dmgMul:f.dmg*(gm.unitDmgMul||1),
    wc:t.wc||1,zHeight:t.cat==='air'?30:0,
    ammo:t.ammo||0,home:null,padI:-1,rearmT:0,
    poisonT:0,poisonDps:0,
    cd:0,scan:Math.random()*.4,repath:0,path:null,wpi:0,order:null,attackTarget:null,site:null,
    pile:null,ts:'idle',lt:0,retry:0,cargo:0,flash:0,dead:false,stT:0,lx:x,ly:y,anchor:null,auto:false,smkT:0,fix:null,healT:0,
    // Veterancy
    unitXp:0,unitRank:0,kills:0,
    // Scrap (Scorpion faction)
    scrapLevel:0,
    // Garrison
    hidden:false,garrisonBuilding:null,
    // Capture
    isCapturing:false,captureTarget:null,captureProgress:0};
  units.push(u);return u;
}

/* ===== Veterancy ===== */
function checkVeterancy(u){
  if(!u||u.dead||u.cat==='veh'&&(u.type==='truck'||u.type==='dozer'))return;
  const old=u.unitRank;
  if(u.unitXp>=VXPT[2]&&u.unitRank<3)u.unitRank=3;
  else if(u.unitXp>=VXPT[1]&&u.unitRank<2)u.unitRank=2;
  else if(u.unitXp>=VXPT[0]&&u.unitRank<1)u.unitRank=1;
  if(u.unitRank>old){
    if(u.unitRank===2&&old<2)u.spd=Math.min(u.spd*1.1,u.t.spd*FAC(u.team).spd*1.25);
    if(u.team===0){
      const msgs=['★ VETERAN','★★ ELITE','★★★ HEROIC'];
      toast(msgs[u.unitRank-1]+' — '+dispName('u',u.type,0)+(u.unitRank===3?' gains self-repair!':u.unitRank===2?' fires & moves faster!':('+10% fire rate!')));
      SFX.done();
    }
  }
}
function getVetCd(u,base){
  if(u.unitRank>=2)return base*.8;
  if(u.unitRank>=1)return base*.9;
  return base;
}

function dealDamage(e,amt,src){
  if(!e||e.dead)return;
  e.hp-=amt;e.flash=.15;
  if(e.team===0&&e.kind==='b'&&underAttackCd<=0&&state==='play'){underAttackCd=14;toast('⚠️ Our base is under attack!');SFX.err()}
  if(e.hp<=0)kill(e,src);
}
function kill(e,src){
  if(e.dead)return;
  // GLA hole mechanic for Scorpion buildings
  if(e.kind==='b'&&e.team>=0&&fac[e.team]==='scorpion'&&!e.isHole&&!e.rebuilt){
    e.isHole=true;e.holeT=15;e.hp=1;e.dead=false;
    // spawn hole particles
    for(let i=0;i<6;i++)addPart({k:'smoke',x:e.x+vrand(-12,12),y:e.y+vrand(-8,8),vx:vrand(-8,8),vy:vrand(-20,-8),life:vrand(.4,.9),max:.9,s:vrand(4,10)});
    addPart({k:'ring',x:e.x,y:e.y,life:.4,max:.4,s:Math.max(e.t.w,e.t.h)*TILE*.5});
    return;
  }
  e.dead=true;
  if(e.team===0||e.team===1){
    const base=Math.round(e.t.cost/4);
    xpGain(e.team===0?1:0,base);
  }
  // Veterancy: credit XP to the killing unit
  if(src&&src.kind==='u'&&!src.dead&&e.t&&e.t.cost){
    src.unitXp=(src.unitXp||0)+Math.round(e.t.cost*.4);
    src.kills=(src.kills||0)+1;
    checkVeterancy(src);
  }
  if(e.kind==='b'){
    blockRect(e.tx,e.ty,e.t.w,e.t.h,0);
    boomFx(e.x,e.y,Math.max(e.t.w,e.t.h)*22,true);
    // Eject garrisoned infantry when building dies
    if(e.garrison&&e.garrison.length){
      for(const gu of e.garrison.slice()){
        if(gu.dead)continue;
        gu.hidden=false;gu.garrisonBuilding=null;
        gu.x=e.x+rand(-24,24);gu.y=e.y+rand(-24,24);
        dealDamage(gu,gu.maxhp*.55,null);
      }
      e.garrison=[];
    }
    // Release airfield pads
    if(e.padUnits){
      for(let i=0;i<4;i++){
        const pu=e.padUnits[i];
        if(pu&&!pu.dead){pu.home=null;pu.padI=-1}
      }
    }
  }else{
    // Release pad for air units
    if(e.cat==='air'&&e.padI>=0&&e.home){e.home.padUnits[e.padI]=null}
    boomFx(e.x,e.y,e.cat==='inf'?10:20,e.cat!=='inf');
    // Scrap drop — vehicles only, not logistics
    if(e.cat==='veh'&&e.type!=='truck'&&e.type!=='dozer'&&Math.random()<.55){
      scraps.push({kind:'scr',x:e.x+rand(-10,10),y:e.y+rand(-10,10),
        level:Math.random()<.38?2:1,r:14,life:50,id:ids++});
    }
  }
  const si=sel.indexOf(e);
  if(si>=0){sel.splice(si,1);updateCard()}
}
function boomFx(x,y,s,big){
  addPart({k:'ring',x,y,life:.35,max:.35,s});
  addPart({k:'scorch',x,y,life:9,max:9,s:s*.8});
  addPart({k:'flash',x,y,life:.09,max:.09,s:s*.7});
  const nf=big?6:4;
  for(let i=0;i<nf;i++)
    addPart({k:'fire',x:x+rand(-s*.25,s*.25),y:y+rand(-s*.25,s*.25),vx:vrand(-22,22),vy:vrand(-46,-12),
      life:rand(.25,.55),max:.55,s:rand(s*.28,s*.5)});
  for(let i=0;i<Math.min(14,4+s/4);i++){
    const a=Math.random()*7,sp=vrand(30,150);
    addPart({k:'spark',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:vrand(.2,.5),max:.5,s:vrand(1.5,3.5),c:i%2?'#ff9a4d':'#ffd27d'});
  }
  if(big)for(let i=0;i<7;i++)
    addPart({k:'deb',x,y,vx:vrand(-130,130),vy:vrand(-180,-50),rot:vrand(0,7),vr:vrand(-9,9),
      life:vrand(.4,.9),max:.9,s:vrand(2,5)});
  for(let i=0;i<Math.min(8,2+s/8);i++)
    addPart({k:'smoke',x:x+vrand(-8,8),y:y+vrand(-8,8),vx:vrand(-12,12),vy:vrand(-30,-8),life:vrand(.5,1.1),max:1.1,s:vrand(6,14)});
  SFX.boom(big);
}

/* ===== Poison DOT ===== */
function applyPoison(e,dps){
  if(!e||e.dead)return;
  e.poisonT=Math.max(e.poisonT||0,4);
  e.poisonDps=Math.max(e.poisonDps||0,dps);
}

/* ===== Aircraft helpers ===== */
function padPos(b,i){
  const off=b.t.pads[i];
  return{x:(b.tx+b.t.w/2+off[0]*1.2)*TILE,y:(b.ty+b.t.h/2+off[1]*1.2)*TILE};
}
function claimPad(b,u){
  for(let i=0;i<4;i++){if(!b.padUnits[i]){b.padUnits[i]=u;u.home=b;u.padI=i;return true}}
  return false;
}
function flyTo(u,tx,ty,dt){
  const dx=tx-u.x,dy=ty-u.y,d=Math.sqrt(dx*dx+dy*dy);
  if(d<4){u.vx=0;u.vy=0;return true}
  const spd=u.t.spd*FAC(u.team).spd;
  u.vx=dx/d*spd;u.vy=dy/d*spd;
  u.a=Math.atan2(dy,dx);
  u.x+=u.vx*dt;u.y+=u.vy*dt;
  return false;
}
function updateAircraft(u,dt){
  if(u.dead)return;
  if(u.rearmT>0){
    u.rearmT-=dt;
    if(u.rearmT<=0){u.ammo=u.t.ammo||4;u.rearmT=0;if(u.home){const pp=padPos(u.home,u.padI);u.x=pp.x;u.y=pp.y}}
    return;
  }
  if(u.ammo<=0&&u.home&&!u.home.dead){
    const pp=padPos(u.home,u.padI);
    if(flyTo(u,pp.x,pp.y,dt)&&u.rearmT<=0)u.rearmT=8;
    return;
  }
  if(u.attackTarget&&!u.attackTarget.dead){flyTo(u,u.attackTarget.x,u.attackTarget.y,dt);return}
  if(u.path&&u.path.length){
    const wp=u.path[0];
    const gx=wp.x!==undefined?wp.x:(wp[0]*TILE+TILE/2);
    const gy=wp.y!==undefined?wp.y:(wp[1]*TILE+TILE/2);
    if(flyTo(u,gx,gy,dt))u.path.shift();
  } else if(u.home&&!u.home.dead){
    // Return to pad when no orders
    const pp=padPos(u.home,u.padI);
    flyTo(u,pp.x,pp.y,dt);
  }
}

/* ===== Crush check (heavy vehicles crush infantry) ===== */
function crushCheck(u){
  if(u.dead||u.cat!=='veh'||u.wc<3)return;
  const near=shQuery(u.x,u.y,u.t.r+8);
  for(const e of near){
    if(e===u||e.dead||!isEnemy(u.team,e.team))continue;
    if(e.kind==='u'&&e.wc===1){
      const dx=e.x-u.x,dy=e.y-u.y;
      if(Math.sqrt(dx*dx+dy*dy)<u.t.r+e.t.r*.7){
        kill(e);
        addPart({x:e.x,y:e.y,k:'spark',vx:vrand(-30,30),vy:vrand(-30,30),life:.4,max:.4,s:5,c:'#a00',blood:true});
        if(SFX.squish)SFX.squish();
      }
    }
  }
}

function impact(p){
  if(p.w===WPN.nuke){
    boomFx(p.x,p.y,120,true);
    addPart({k:'ring',x:p.x,y:p.y,life:.8,max:.8,s:240});
    addPart({k:'ring',x:p.x,y:p.y,life:1.2,max:1.2,s:340});
    addPart({k:'flash',x:p.x,y:p.y,life:.3,max:.3,s:300});
    for(let i=0;i<16;i++)addPart({k:'fire',x:p.x+rand(-70,70),y:p.y+rand(-70,70),vx:vrand(-30,30),vy:vrand(-90,-30),life:vrand(.5,1.1),max:1.1,s:vrand(20,46)});
    for(let i=0;i<14;i++)addPart({k:'smoke',x:p.x+rand(-40,40),y:p.y+rand(-30,30),vx:vrand(-16,16),vy:vrand(-70,-25),life:vrand(1.2,2.4),max:2.4,s:vrand(16,34)});
    addPart({k:'scorch',x:p.x,y:p.y,life:18,max:18,s:130});
    SFX.nuke();shake=1.1;
  }else if(p.w===WPN.orbitalLaser){
    addPart({k:'ring',x:p.x,y:p.y,life:.5,max:.5,s:180,c:'#7deeff'});
    addPart({k:'ring',x:p.x,y:p.y,life:.8,max:.8,s:100,c:'#bff5ff'});
    addPart({k:'flash',x:p.x,y:p.y,life:.25,max:.25,s:200,c:'#9fe9ff'});
    for(let i=0;i<10;i++)addPart({k:'spark',x:p.x+rand(-30,30),y:p.y+rand(-30,30),vx:vrand(-60,60),vy:vrand(-80,-10),life:vrand(.3,.7),max:.7,s:3,c:'#7deeff'});
    addPart({k:'scorch',x:p.x,y:p.y,life:14,max:14,s:80,c:'#2a6080'});
    SFX.nuke();shake=0.8;
  }else if(p.w===WPN.toxicNuke){
    boomFx(p.x,p.y,70,true);
    for(let i=0;i<8;i++)addPart({k:'fire',x:p.x+rand(-40,40),y:p.y+rand(-40,40),vx:vrand(-20,20),vy:vrand(-60,-20),life:vrand(.4,.9),max:.9,s:vrand(10,28),c:'#4dff88'});
    for(let i=0;i<6;i++)addPart({k:'smoke',x:p.x+rand(-30,30),y:p.y+rand(-20,20),vx:vrand(-10,10),vy:vrand(-50,-15),life:vrand(.8,1.8),max:1.8,s:vrand(10,24),c:'#3aaa55'});
    addPart({k:'scorch',x:p.x,y:p.y,life:20,max:20,s:100,c:'#1a4020'});
    SFX.nuke();shake=0.6;
  }else if(p.w===WPN.barrageMsl){
    boomFx(p.x,p.y,50,false);
    shake=Math.min(shake+0.2,1.0);
  }else boomFx(p.x,p.y,Math.max(p.w.splash,14),p.w.splash>30);
  const rad=Math.max(p.w.splash,14);
  const nearby=shQuery(p.x,p.y,rad+24);
  for(const e of nearby){
    if(e.dead||(e.team===p.team&&!p.nuke)||e.hidden)continue;
    // For non-nuke splash, also skip allies
    if(!p.nuke&&!isEnemy(p.team,e.team))continue;
    // zHeight gate: AA-only weapons skip non-air, non-AA weapons skip air
    const isAir=e.kind==='u'&&(e.zHeight||0)>10;
    if(isAir&&!p.w.aa)continue;
    const d=dist2(e,p)-entRad(e);
    if(d<=rad){
      const fall=clamp(1-Math.max(0,d)/rad*.5,.5,1);
      dealDamage(e,p.w.dmg*(p.mul||1)*p.w.mult[e.cat]*fall,p.src||null);
      // Poison splash
      if(p.toxin)applyPoison(e,p.w.dmg*0.08);
      if(p.w.toxicSplash)applyPoison(e,p.w.dmg*0.18);
    }
  }
}
function fireFrom(sh,wname,tgt){
  const w=WPN[wname];
  const scrapMul=SCRAP_DMG[sh.scrapLevel||0]||1;
  const mul=(sh.dmgMul||1)*upDmg(sh.team)*scrapMul;
  const ang=Math.atan2(tgt.y-sh.y,tgt.x-sh.x);sh.ta=ang;
  const mz=sh.kind==='b'?20:(sh.cat==='inf'?9:18);
  const mx=sh.x+Math.cos(ang)*mz,my=sh.y+Math.sin(ang)*mz;
  const heroic=sh.unitRank>=3;
  const traceC=heroic?'#ffd95e':(w.laser?'#7ddcff':(w.flame?'#ff9b3d':null));
  addPart({k:'flash',x:mx,y:my,life:.07,max:.07,s:6,c:w.laser?'#9fe9ff':(heroic?'#ffe080':null)});
  // Check GENMOD toxin
  const toxinActive=sh.team>=0&&GENMOD(sh.team).toxin;
  if(w.kind==='hit'){
    addPart({k:'trace',x:mx,y:my,x2:tgt.x+vrand(-3,3),y2:tgt.y+vrand(-3,3),
      life:w.laser?.12:(w.flame?.16:.07),max:w.laser?.12:(w.flame?.16:.07),c:traceC,fl:!!w.flame});
    if(w.flame){
      for(let i=0;i<2;i++)addPart({k:'fire',x:tgt.x+vrand(-8,8),y:tgt.y+vrand(-8,8),vx:vrand(-10,10),vy:vrand(-26,-8),life:vrand(.18,.3),max:.3,s:vrand(5,9)});
      if(tgt.kind==='b'&&tgt.garrison&&tgt.garrison.length){
        for(const gu of tgt.garrison)if(!gu.dead)dealDamage(gu,w.dmg*mul*w.mult.inf,sh);
      }
    }
    addPart({k:'spark',x:tgt.x,y:tgt.y,vx:vrand(-40,40),vy:vrand(-60,-5),life:.22,max:.22,s:2,c:w.laser?'#9fe9ff':(heroic?'#ffd95e':'#ffd27d')});
    dealDamage(tgt,w.dmg*mul*w.mult[tgt.cat],sh);
    // Apply toxin on hit
    if(toxinActive)applyPoison(tgt,w.dmg*0.08);
    if(Math.random()<.45){if(w.laser)tone(1500,.07,'sawtooth',.025,-900);else SFX.shoot()}
  }else{
    // Consume ammo for air units
    if(sh.cat==='air'&&sh.ammo>0)sh.ammo--;
    const d=Math.hypot(tgt.x-mx,tgt.y-my);
    const n=w.twin?2:1;
    const projSrc=sh.kind==='u'?sh:null;
    for(let i=0;i<n;i++){
      const po=w.twin?(i?5:-5):0;
      const ox=Math.cos(ang+Math.PI/2)*po,oy=Math.sin(ang+Math.PI/2)*po;
      addProj({kind:w.kind,x:mx+ox,y:my+oy,sx:mx+ox,sy:my+oy,dx:tgt.x+ox,dy:tgt.y+oy,t:0,dur:Math.max(.15,d/w.spd),spd:w.spd,
        target:w.kind==='rocket'?tgt:null,w,mul,team:sh.team,src:projSrc,toxin:toxinActive});
    }
    if(w.kind==='rocket')SFX.rocket();else SFX.shoot();
  }
}
/* ===== Fog-aware enemy finder (spatial-hash backed) ===== */
function findEnemyInRange(sh,r){
  let best=null,bd=1e9;
  const nearby=shQuery(sh.x,sh.y,r+24);
  const w=sh.t&&sh.t.wpn?WPN[sh.t.wpn]:null;
  for(const e of nearby){
    if(e.dead||!isEnemy(sh.team,e.team)||e.team<0||e.hidden)continue;
    if(tileVisAt(e.x,e.y)!==2)continue;
    // zHeight/aa-aware targeting
    const isAir=e.kind==='u'&&(e.zHeight||0)>10;
    if(w){
      if(isAir&&!w.aa)continue;
      if(!isAir&&w.aaOnly)continue;
    }
    const d=e.kind==='u'?(dist2(e,sh)-e.t.r)*.85:dist2(e,sh)-entRad(e);
    if(d<r&&d<bd){bd=d;best=e}
  }
  return best;
}

/* ================= UNIT LOGIC ================= */
function orderMove(u,x,y,kind){
  // Air units skip pathfinding
  if(u.cat==='air'){u.moveTarget={x,y};u.attackTarget=null;u.path=[{x,y}];return}
  u.order={kind:kind||'move',x,y,target:null};
  u.attackTarget=null;u.site=null;u.fix=null;u.anchor=null;u.auto=false;
  u.path=findPath(u.x,u.y,x,y);u.wpi=0;u.stT=0;
}
function orderAttack(u,t){
  u.order={kind:'attack',x:t.x,y:t.y,target:t};
  u.attackTarget=t;u.path=null;u.repath=0;u.anchor=null;u.auto=false;
}
function orderGarrison(u,b){
  if(!b.t.garrison)return;
  if((b.garrison||[]).length>=b.t.garrisonMax){if(u.team===0){SFX.err();toast('🏠 Building full')}return}
  u.order={kind:'garrison',target:b};
  u.attackTarget=null;u.path=findPath(u.x,u.y,b.x,b.y);u.wpi=0;u.anchor=null;u.auto=false;
}
function returnAnchor(u){
  const a=u.anchor;u.anchor=null;u.auto=false;u.attackTarget=null;
  if(a&&Math.hypot(a.x-u.x,a.y-u.y)>TILE)orderMove(u,a.x,a.y,'move');
}
function resumeOrder(u){
  u.attackTarget=null;
  if(u.order&&u.order.kind==='am'){
    if(Math.hypot(u.order.x-u.x,u.order.y-u.y)>TILE*1.5){u.path=findPath(u.x,u.y,u.order.x,u.order.y);u.wpi=0}
    else u.order=null;
  }else u.order=null;
}
function followPath(u,dt){
  const wp=u.path&&u.path[u.wpi];
  if(!wp){
    u.path=null;
    if(u.order&&(u.order.kind==='move'||u.order.kind==='am'))u.order=null;
    return;
  }
  const dx=wp.x-u.x,dy=wp.y-u.y,d=Math.hypot(dx,dy);
  if(d<14){u.wpi++;if(u.wpi>=u.path.length){u.path=null;if(u.order&&(u.order.kind==='move'||u.order.kind==='am'))u.order=null}return}
  const st=(u.spd||u.t.spd)*dt;
  u.x+=dx/d*st;u.y+=dy/d*st;
  u.a=Math.atan2(dy,dx);u.moving=true;
  const moved=Math.hypot(u.x-u.lx,u.y-u.ly);
  if(moved<st*.3)u.stT+=dt;else u.stT=0;
  if(u.stT>1){
    u.stT=0;
    const last=u.path[u.path.length-1];
    u.path=findPath(u.x+rand(-20,20),u.y+rand(-20,20),last.x,last.y);u.wpi=0;
  }
}
const LEASH=240;
function updateCombat(u,dt){
  if(u.isCapturing&&u.captureTarget&&!u.captureTarget.dead)return;
  if(u.garrisonBuilding){
    const b=u.garrisonBuilding;
    if(b.dead){
      u.hidden=false;u.garrisonBuilding=null;
      const gi=(b.garrison||[]).indexOf(u);if(gi>=0)b.garrison.splice(gi,1);
      return;
    }
    u.x=b.x;u.y=b.y;
    const w=WPN[u.t.wpn];if(!w)return;
    u.cd=Math.max(0,u.cd-dt);
    u.scan-=dt;
    if(u.scan<=0){
      u.scan=.45;
      if(!u.attackTarget||u.attackTarget.dead)u.attackTarget=findEnemyInRange(u,w.rng);
    }
    if(u.attackTarget&&(u.attackTarget.dead||dist2(u,u.attackTarget)-entRad(u.attackTarget)>w.rng*1.15))u.attackTarget=null;
    if(u.attackTarget&&u.cd<=0){
      fireFrom(u,u.t.wpn,u.attackTarget);
      u.cd=getVetCd(u,w.rel);
    }
    return;
  }
  if(u.order&&u.order.kind==='garrison'){
    const b=u.order.target;
    if(!b||b.dead||(b.garrison||[]).length>=b.t.garrisonMax){u.order=null;return}
    if(dist2(u,b)<entRad(b)+TILE){
      u.order=null;u.path=null;
      if(!b.garrison)b.garrison=[];
      if(b.garrison.length<b.t.garrisonMax){
        u.hidden=true;u.garrisonBuilding=b;b.garrison.push(u);
        if(b.team<0)b.team=u.team;
        if(u.team===0)toast('🏠 Infantry garrisoned — firing from building');
      }
      return;
    }
    u.repath-=dt;
    if(!u.path||u.repath<=0){u.path=findPath(u.x,u.y,b.x,b.y);u.wpi=0;u.repath=1}
    else followPath(u,dt);
    return;
  }
  const w=WPN[u.t.wpn];
  if(u.attackTarget&&u.attackTarget.dead){u.auto?returnAnchor(u):resumeOrder(u)}
  if(u.attackTarget){
    if(u.auto&&u.anchor&&Math.hypot(u.x-u.anchor.x,u.y-u.anchor.y)>LEASH){returnAnchor(u);return}
    const t=u.attackTarget,d=dist2(u,t)-entRad(t);
    const minR=w.minRng||0;
    if(d<=w.rng&&d>=minR*.6){
      u.path=null;
      u.a=u.ta=Math.atan2(t.y-u.y,t.x-u.x);
      if(u.cd<=0){fireFrom(u,u.t.wpn,t);u.cd=getVetCd(u,w.rel)}
    }else if(d<minR*.6){
      const ang=Math.atan2(u.y-t.y,u.x-t.x);
      u.x+=Math.cos(ang)*(u.spd||u.t.spd)*dt;u.y+=Math.sin(ang)*(u.spd||u.t.spd)*dt;u.a=ang;u.moving=true;
    }else{
      u.repath-=dt;
      if(!u.path||u.repath<=0){u.path=findPath(u.x,u.y,t.x,t.y);u.wpi=0;u.repath=.85}
      followPath(u,dt);
    }
  }else{
    if(u.path)followPath(u,dt);
    u.scan-=dt;
    if(u.scan<=0){
      u.scan=.4;
      const canScan=!u.order||u.order.kind==='am';
      if(canScan){
        const e=findEnemyInRange(u,w.rng*(u.order?1.5:1.05));
        if(e){
          u.attackTarget=e;u.path=null;
          if(!u.order){u.auto=true;if(!u.anchor)u.anchor={x:u.x,y:u.y}}
        }
      }
    }
  }
}
function updateScarab(u,dt){
  if(u.attackTarget&&u.attackTarget.dead){u.auto?returnAnchor(u):resumeOrder(u)}
  const t=u.attackTarget;
  if(t){
    if(u.auto&&u.anchor&&Math.hypot(u.x-u.anchor.x,u.y-u.anchor.y)>LEASH){returnAnchor(u);return}
    const d=dist2(u,t)-entRad(t);
    if(d<=u.t.r+9){
      const p={x:(u.x+t.x)/2,y:(u.y+t.y)/2,w:WPN[u.t.suicide],mul:(u.dmgMul||1)*upDmg(u.team),team:u.team,src:null};
      kill(u,null);impact(p);return;
    }
    u.repath-=dt;
    if(!u.path||u.repath<=0){u.path=findPath(u.x,u.y,t.x,t.y);u.wpi=0;u.repath=.7}
    followPath(u,dt);
  }else{
    if(u.path)followPath(u,dt);
    u.scan-=dt;
    if(u.scan<=0){
      u.scan=.4;
      const canScan=!u.order||u.order.kind==='am';
      if(canScan){
        const e=findEnemyInRange(u,u.order?300:200);
        if(e){u.attackTarget=e;u.path=null;if(!u.order){u.auto=true;if(!u.anchor)u.anchor={x:u.x,y:u.y}}}
      }
    }
  }
}
function updateTruck(u,dt){
  switch(u.ts){
    case 'idle':{
      if(u.path){followPath(u,dt);break}
      u.retry-=dt;if(u.retry>0)break;
      u.retry=1.5;
      let best=null,bd=1e9;
      for(const p of piles)if(p.amt>0){const d=dist2(u,p);if(d<bd){bd=d;best=p}}
      if(best){u.pile=best;u.ts='toPile';u.path=findPath(u.x,u.y,best.x,best.y);u.wpi=0}
      break;}
    case 'toPile':{
      if(!u.pile||u.pile.amt<=0){u.ts='idle';u.path=null;break}
      if(dist2(u,u.pile)<TILE*1.5){u.path=null;u.ts='load';u.lt=0}
      else{if(!u.path){u.retry-=dt;if(u.retry<=0){u.retry=1;u.path=findPath(u.x,u.y,u.pile.x,u.pile.y);u.wpi=0}}else followPath(u,dt)}
      break;}
    case 'load':{
      u.lt+=dt;
      if(Math.random()<.1)addPart({k:'spark',x:u.pile.x+vrand(-14,14),y:u.pile.y+vrand(-14,14),vx:0,vy:-20,life:.3,max:.3,s:2,c:'#ffd95e'});
      if(u.lt>2.2){
        const take=Math.min(300,u.pile.amt);u.pile.amt-=take;u.cargo=take;u.ts='toDepot';u.path=null;
      }
      break;}
    case 'toDepot':{
      let dep=null,bd=1e9;
      for(const b of builds)if(!b.dead&&b.built&&b.team===u.team&&b.type==='supply'){const d=dist2(u,b);if(d<bd){bd=d;dep=b}}
      if(!dep){u.retry-=dt;if(u.retry<=0)u.retry=2;break}
      if(dist2(u,dep)<TILE*2.1){
        money[u.team]+=u.cargo;
        if(u.team===0){SFX.cash();addPart({k:'txt',txt:'+$'+u.cargo,x:dep.x,y:dep.y-30,vy:-26,life:1,max:1})}
        u.cargo=0;u.ts='idle';u.retry=0;u.path=null;
      }else{
        if(!u.path){u.retry-=dt;if(u.retry<=0){u.retry=1;u.path=findPath(u.x,u.y,dep.x,dep.y);u.wpi=0}}
        else followPath(u,dt);
      }
      break;}
  }
}
function updateDozer(u,dt){
  if(u.site){
    const s=u.site;
    if(s.dead||s.built){u.site=null;u.path=null;
      // Mark as rebuilt (prevents supply truck respawn for GLA buildings)
      if(s.rebuilt===false)s.rebuilt=true;
      return}
    const rx=s.tx*TILE,ry=s.ty*TILE,rw=s.t.w*TILE,rh=s.t.h*TILE;
    const cx=clamp(u.x,rx,rx+rw),cy=clamp(u.y,ry,ry+rh);
    const d=Math.hypot(u.x-cx,u.y-cy);
    if(d<TILE*1.25){
      u.path=null;u.a=Math.atan2(s.y-u.y,s.x-u.x);
      const add=dt/s.t.bt;
      s.prog=Math.min(1,s.prog+add);
      s.hp=Math.min(s.maxhp,s.hp+add*s.maxhp*.9);
      if(Math.random()<.15)addPart({k:'spark',x:rx+Math.random()*rw,y:ry+Math.random()*rh,vx:vrand(-25,25),vy:vrand(-50,-10),life:.3,max:.3,s:2,c:'#ffe9a8'});
    }else{
      if(!u.path){u.repath-=dt;if(u.repath<=0){u.repath=1;u.path=findPath(u.x,u.y,s.x,s.y);u.wpi=0}}
      else followPath(u,dt);
    }
  }else if(u.fix){
    const b=u.fix;
    if(b.dead||!b.built||b.hp>=b.maxhp){u.fix=null;u.path=null;if(b.hp>=b.maxhp&&u.team===0)toast('🔧 Repairs complete — '+dispName('b',b.type,0));return}
    const rx=b.tx*TILE,ry=b.ty*TILE,rw=b.t.w*TILE,rh=b.t.h*TILE;
    const cx=clamp(u.x,rx,rx+rw),cy=clamp(u.y,ry,ry+rh);
    const d=Math.hypot(u.x-cx,u.y-cy);
    if(d<TILE*1.25){
      u.path=null;u.a=Math.atan2(b.y-u.y,b.x-u.x);
      b.hp=Math.min(b.maxhp,b.hp+b.maxhp*dt/b.t.bt*.7);
      if(Math.random()<.18)addPart({k:'spark',x:rx+Math.random()*rw,y:ry+Math.random()*rh,vx:vrand(-25,25),vy:vrand(-50,-10),life:.3,max:.3,s:2,c:'#9fe27c'});
      if(Math.random()<.05)addPart({k:'heal',x:b.x+vrand(-12,12),y:b.y+vrand(-8,8),life:.6,max:.6,s:12});
    }else{
      if(!u.path){u.repath-=dt;if(u.repath<=0){u.repath=1;u.path=findPath(u.x,u.y,b.x,b.y);u.wpi=0}}
      else followPath(u,dt);
    }
  }else if(u.path)followPath(u,dt);
}
/* ===== Capture neutral structures ===== */
function updateCapture(u,dt){
  if(!u.isCapturing||!u.captureTarget)return;
  const b=u.captureTarget;
  if(b.dead||b.team===u.team){u.isCapturing=false;u.captureTarget=null;u.captureProgress=0;return}
  const d=dist2(u,b);
  if(d>entRad(b)+TILE*1.5){
    u.repath=(u.repath||0)-dt;
    if(!u.path||u.repath<=0){u.path=findPath(u.x,u.y,b.x,b.y);u.wpi=0;u.repath=1.2}
    else followPath(u,dt);
    return;
  }
  u.path=null;u.captureProgress+=dt/10;
  if(Math.random()<.06)addPart({k:'spark',x:b.x+vrand(-12,12),y:b.y+vrand(-10,10),vx:0,vy:-18,life:.3,max:.3,s:2,c:'#7ddcff'});
  if(u.captureProgress>=1){
    b.team=u.team;
    u.isCapturing=false;u.captureTarget=null;u.captureProgress=0;
    if(u.team===0){toast('🚩 Oil Derrick captured — earning $'+b.t.income+' every 5s!');SFX.done()}
  }
}
const HEAL_AT={inf:['barracks'],veh:['factory','command']};
function updateFieldHeal(u,dt){
  if(u.hp>=u.maxhp||u.attackTarget)return;
  u.healT-=dt;
  if(u.healT>0)return;
  u.healT=.5;
  const kinds=HEAL_AT[u.cat];if(!kinds)return;
  const nearby=shQuery(u.x,u.y,200);
  for(const b of nearby){
    if(b.kind!=='b'||b.dead||!b.built||b.team!==u.team||!kinds.includes(b.type))continue;
    if(dist2(u,b)<entRad(b)+95){
      u.hp=Math.min(u.maxhp,u.hp+u.maxhp*.025);
      if(Math.random()<.4)addPart({k:'heal',x:u.x+vrand(-6,6),y:u.y-4,life:.5,max:.5,s:8});
      return;
    }
  }
}
/* ===== Scrap scavenging (Scorpion Cartel) ===== */
function updateScrapPickup(u){
  if(FAC(u.team).key!=='scorpion')return;
  if(u.cat!=='veh'||u.type==='truck'||u.type==='dozer')return;
  if((u.scrapLevel||0)>=2)return;
  for(let i=scraps.length-1;i>=0;i--){
    const s=scraps[i];
    if(Math.hypot(u.x-s.x,u.y-s.y)<u.t.r+s.r){
      u.scrapLevel=Math.min(2,(u.scrapLevel||0)+s.level);
      scraps.splice(i,1);
      if(u.team===0)toast('🔩 Scrap salvaged! Firepower +'+(Math.round((SCRAP_DMG[u.scrapLevel]-1)*100))+'%');
      break;
    }
  }
}
function updateUnit(u,dt){
  u.lxp=u.x;u.lyp=u.y;u.moving=false;
  u.cd=Math.max(0,u.cd-dt);u.flash=Math.max(0,u.flash-dt);

  // Air unit handling
  if(u.cat==='air'){
    updateAircraft(u,dt);
    // Air unit combat scan
    if(u.ammo>0&&!u.rearmT){
      u.scan-=dt;
      if(u.scan<=0){
        u.scan=.6;
        const w=WPN[u.t.wpn];
        if(w&&(!u.attackTarget||u.attackTarget.dead)){
          u.attackTarget=findEnemyInRange(u,w.rng);
        }
      }
      if(u.attackTarget&&!u.attackTarget.dead){
        const w=WPN[u.t.wpn];
        if(u.cd<=0&&dist2(u,u.attackTarget)<w.rng){
          fireFrom(u,u.t.wpn,u.attackTarget);
          u.cd=w.rel;
        }
      }
      if(u.attackTarget&&u.attackTarget.dead)u.attackTarget=null;
    }
    u.lx=u.lxp;u.ly=u.lyp;
    return;
  }

  if(u.type==='truck')updateTruck(u,dt);
  else if(u.type==='dozer')updateDozer(u,dt);
  else if(u.t.suicide)updateScarab(u,dt);
  else updateCombat(u,dt);
  if(u.isCapturing)updateCapture(u,dt);
  updateScrapPickup(u);
  updateFieldHeal(u,dt);
  // Heroic rank: passive self-repair
  if(u.unitRank>=3)u.hp=Math.min(u.maxhp,u.hp+dt*3);
  // Poison DOT tick
  if(u.poisonT>0){
    u.poisonT-=dt;
    u.hp-=u.poisonDps*dt;
    if(u.hp<=0){kill(u);return}
    if(Math.random()<.4)addPart({x:u.x+vrand(-8,8),y:u.y+vrand(-8,8),k:'spark',vx:0,vy:-18,life:.5,max:.5,s:3,c:'#4a2'});
  }
  if(u.hp<u.maxhp*.4&&u.cat!=='inf'&&!u.hidden){
    u.smkT-=dt;
    if(u.smkT<=0){u.smkT=.28;addPart({k:'smoke',x:u.x+vrand(-5,5),y:u.y+vrand(-5,5),vx:vrand(-6,6),vy:vrand(-26,-12),life:.7,max:.7,s:vrand(4,7)})}
  }
  // Heavy vehicle crush check
  if(u.wc>=3)crushCheck(u);
  u.lx=u.lxp;u.ly=u.lyp;
}
/* ===== Boids separation via spatial hash ===== */
function separation(dt){
  const MAXPUSH=85;
  for(const u of units){
    if(u.dead||u.cat==='air')continue;
    let fx=0,fy=0;
    const near=shQuery(u.x,u.y,u.t.r*2.5);
    for(const e of near){
      if(e===u||e.dead||e.kind!=='u')continue;
      const dx=u.x-e.x,dy=u.y-e.y,d2=dx*dx+dy*dy;
      const minD=(u.t.r+(e.t?e.t.r:12))*1.1;
      if(d2<minD*minD&&d2>0.01){const d=Math.sqrt(d2);fx+=dx/d*(minD-d);fy+=dy/d*(minD-d)}
    }
    const mag=Math.sqrt(fx*fx+fy*fy);
    if(mag>0){const s=Math.min(mag,MAXPUSH*dt)/mag;u.x+=fx*s;u.y+=fy*s}
  }
  for(const u of units){
    if(u.dead||u.hidden)continue;
    u.x=clamp(u.x,12,WW-12);u.y=clamp(u.y,12,WH-12);
  }
}
