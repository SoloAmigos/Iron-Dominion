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
  if(u.unitXp>=VXPT[4]&&u.unitRank<5)u.unitRank=5;
  else if(u.unitXp>=VXPT[3]&&u.unitRank<4)u.unitRank=4;
  else if(u.unitXp>=VXPT[2]&&u.unitRank<3)u.unitRank=3;
  else if(u.unitXp>=VXPT[1]&&u.unitRank<2)u.unitRank=2;
  else if(u.unitXp>=VXPT[0]&&u.unitRank<1)u.unitRank=1;
  if(u.unitRank>old){
    if(u.unitRank===2&&old<2)u.spd=Math.min(u.spd*1.1,u.t.spd*FAC(u.team).spd*1.25);
    if(u.unitRank===4&&old<4){u.maxhp=Math.round(u.maxhp*1.2);u.hp=Math.min(u.maxhp,Math.round(u.hp*1.2))}
    if(u.unitRank===5&&old<5)u.r=Math.round(u.r*1.15);
    if(u.team===0){
      addPart({k:'txt',x:u.x,y:u.y-30,life:1.8,max:1.8,s:0,txt:u.unitRank>=4?'★ ELITE ★':'★ PROMOTED'});
      SFX.done();
    }
  }
}

/* ===== Scrap pickup (Scorpion) ===== */
function pickupScrap(u){
  if(u.scrapLevel>=2)return;
  // Find nearest unclaimed scrap within 120px
  let best=null,bd=120;
  for(const s of scraps){if(s.dead||s.claimed)continue;const d=Math.hypot(s.x-u.x,s.y-u.y);if(d<bd){bd=d;best=s}}
  if(!best)return;
  best.claimed=true;
  u.scrapLevel=Math.min(2,u.scrapLevel+1);
  addPart({k:'txt',x:u.x,y:u.y-24,life:1.4,max:1.4,s:0,txt:'⚙️ SCRAP LV'+u.scrapLevel});
}

/* ===== Unit death ===== */
function kill(e){
  if(e.dead)return;
  e.dead=true;
  // Eject from garrison
  if(e.hidden&&e.garrisonBuilding){
    const gb=e.garrisonBuilding;
    if(gb.garrison)gb.garrison=gb.garrison.filter(u=>u!==e);
    e.hidden=false;e.garrisonBuilding=null;
  }
  // Release airfield pad
  if(e.home&&e.padI>=0){e.home.padUnits[e.padI]=null;e.home=null;e.padI=-1}
  // Drop scrap for Scorpion vehicles
  if(e.cat==='veh'&&e.type!=='dozer'&&e.type!=='truck'){
    scraps.push({x:e.x+vrand(-8,8),y:e.y+vrand(-8,8),dead:false,claimed:false,id:ids++});
  }
  if(e.kind==='b'){
    rubbles.push({x:e.x,y:e.y,w:e.t.w*TILE,h:e.t.h*TILE,life:22,max:22});
    boomFx(e.x,e.y,Math.max(e.t.w,e.t.h)*22,true);
    for(let i=0;i<6;i++)addPart({k:'smoke',x:e.x+vrand(-e.t.w*TILE/2,e.t.w*TILE/2),y:e.y+vrand(-e.t.h*TILE/2,e.t.h*TILE/2),vx:vrand(-8,8),vy:vrand(-30,-8),life:vrand(1,2),max:2,s:vrand(10,22)});
    if(isEnemy(0,e.team)){
      gameStats.bldgs++;
      xpGain(0,300);
    }
    SFX.boom(true);
  }else{
    boomFx(e.x,e.y,e.cat==='inf'?10:20,e.cat!=='inf');
    addPart({k:'scorch',x:e.x,y:e.y,life:12,max:12,s:e.cat==='inf'?8:18});
    if(e.cat!=='inf'&&Math.random()<.5)
      addPart({k:'smoke',x:e.x,y:e.y,vx:vrand(-6,6),vy:vrand(-20,-6),life:vrand(.8,1.6),max:1.6,s:vrand(8,18)});
    if(isEnemy(0,e.team)){
      gameStats.kills++;
      xpGain(0,e.cat==='inf'?60:(e.cat==='veh'?180:350));
    }
    if(e.type==='scarab'){
      boomFx(e.x,e.y,e.t.suicide?WPN[e.t.suicide].splash:40,true);
    }
  }
}

/* ===== Damage ===== */
function dealDamage(e,dmg,src){
  if(!e||e.dead)return;
  // Fortress mode: buildings take 40% less damage
  if(e.kind==='b'&&e.fortressT>0)dmg*=0.6;
  e.hp-=dmg;
  e.flash=0.12;
  if(e.hp<=0)kill(e);
  if(src&&!src.dead&&src.kind==='u'){
    src.unitXp=(src.unitXp||0)+dmg;
    checkVeterancy(src);
    if(e.dead&&src.kills!==undefined){
      src.kills++;
      if(isEnemy(0,e.team)&&src.team===0){
        // Scorpion scrap pickup on kill (for vehicles)
        if(fac[0]==='scorpion'&&src.cat==='veh'&&src.type!=='dozer'&&src.type!=='truck')pickupScrap(src);
      }
    }
  }
}

/* ===== Poison DOT tick ===== */
function tickPoison(u,dt){
  if(!u.poisonT||u.poisonT<=0)return;
  u.poisonT-=dt;
  dealDamage(u,u.poisonDps*dt,null);
  if(u.poisonT<=0){u.poisonT=0;u.poisonDps=0}
  if(Math.random()<dt*3)addPart({k:'spark',x:u.x+vrand(-6,6),y:u.y+vrand(-6,6),vx:vrand(-8,8),vy:vrand(-18,-4),life:.3,max:.3,s:2.2,c:'#4dff88'});
}

/* ===== Suicide unit (Scarab) ===== */
function scarabCheck(u,dt){
  if(u.type!=='scarab'||!u.t.suicide)return;
  const w=WPN[u.t.suicide];
  for(const e of units){
    if(e.dead||!isEnemy(u.team,e.team))continue;
    if(Math.hypot(e.x-u.x,e.y-u.y)<u.t.r+entRad(e)+8){
      dealDamage(e,w.dmg*w.mult[e.cat],u);
      kill(u);
      return;
    }
  }
}

/* ===== Boomkart splash on death ===== */
function boomkartDeath(u){
  const w=WPN.boomkart;
  const nearby=shQuery(u.x,u.y,w.splash+20);
  for(const e of nearby){
    if(e.dead||!isEnemy(u.team,e.team))continue;
    const d=Math.hypot(e.x-u.x,e.y-u.y)-entRad(e);
    if(d<=w.splash)dealDamage(e,w.dmg*w.mult[e.cat],null);
  }
  addPart({k:'ring',x:u.x,y:u.y,life:.4,max:.4,s:w.splash});
  addPart({k:'flash',x:u.x,y:u.y,life:.1,max:.1,s:w.splash*.8});
  for(let i=0;i<10;i++)addPart({k:'spark',x:u.x,y:u.y,vx:vrand(-80,80),vy:vrand(-100,-20),life:vrand(.3,.6),max:.6,s:vrand(2,4),c:'#ffd27d'});
}

function entRad(e){return e.kind==='b'?(Math.max(e.t.w,e.t.h)*TILE/2):e.t.r}
function dist2(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}

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
function findPad(u){
  const ab=builds.find(b=>!b.dead&&b.built&&b.team===u.team&&b.type==='airfield');
  if(!ab)return null;
  return claimPad(ab,u)?ab:null;
}

function impact(p){
  if(p.w===WPN.nuke){
    boomFx(p.x,p.y,120,true);
    addPart({k:'ring',x:p.x,y:p.y,life:.8,max:.8,s:240});
    addPart({k:'ring',x:p.x,y:p.y,life:1.2,max:1.2,s:380});
    addPart({k:'flash',x:p.x,y:p.y,life:.6,max:.6,s:520});
    for(let i=0;i<16;i++)addPart({k:'fire',x:p.x+rand(-70,70),y:p.y+rand(-70,70),vx:vrand(-30,30),vy:vrand(-90,-30),life:vrand(.5,1.1),max:1.1,s:vrand(20,46)});
    for(let i=0;i<14;i++)addPart({k:'smoke',x:p.x+rand(-40,40),y:p.y+rand(-30,30),vx:vrand(-16,16),vy:vrand(-70,-25),life:vrand(1.2,2.4),max:2.4,s:vrand(16,34)});
    // Mushroom cloud — rising stem
    for(let i=0;i<9;i++)addPart({k:'smoke',x:p.x+vrand(-7,7),y:p.y,vx:vrand(-3,3),vy:-55-i*9,life:vrand(1.5,3.2),max:3.2,s:vrand(14+i*5,26+i*6)});
    // Mushroom cap ring
    for(let i=0;i<12;i++){const a=i/12*6.28;addPart({k:'smoke',x:p.x+Math.cos(a)*58,y:p.y-195,vx:Math.cos(a)*15,vy:vrand(-10,4),life:vrand(2,3.8),max:3.8,s:vrand(26,48)})}
    addPart({k:'scorch',x:p.x,y:p.y,life:18,max:18,s:130});
    SFX.nuke();shake=1.1;
  }else if(p.w===WPN.orbitalLaser){
    // Beam column from orbit to impact point
    addPart({k:'trace',x:p.x,y:p.y-1200,x2:p.x,y2:p.y,life:.7,max:.7,c:true});
    addPart({k:'trace',x:p.x+4,y:p.y-1200,x2:p.x+4,y2:p.y,life:.4,max:.4,c:true});
    addPart({k:'ring',x:p.x,y:p.y,life:.5,max:.5,s:200,c:'#7deeff'});
    addPart({k:'ring',x:p.x,y:p.y,life:.9,max:.9,s:290,c:'#7deeff'});
    addPart({k:'flash',x:p.x,y:p.y,life:.45,max:.45,s:350,c:'#9fe9ff'});
    for(let i=0;i<18;i++)addPart({k:'spark',x:p.x+rand(-40,40),y:p.y+rand(-40,40),vx:vrand(-80,80),vy:vrand(-100,-10),life:vrand(.3,.8),max:.8,s:3.5,c:'#7deeff'});
    addPart({k:'scorch',x:p.x,y:p.y,life:18,max:18,s:85});
    SFX.nuke();shake=1.0;
  }else if(p.w===WPN.toxicNuke){
    boomFx(p.x,p.y,70,true);
    for(let i=0;i<8;i++)addPart({k:'fire',x:p.x+rand(-40,40),y:p.y+rand(-40,40),vx:vrand(-20,20),vy:vrand(-60,-20),life:vrand(.4,.9),max:.9,s:vrand(10,28),c:'#4dff88'});
    for(let i=0;i<6;i++)addPart({k:'smoke',x:p.x+rand(-30,30),y:p.y+rand(-20,20),vx:vrand(-10,10),vy:vrand(-50,-15),life:vrand(.8,1.8),max:1.8,s:vrand(10,24),c:'#3aaa55'});
    addPart({k:'scorch',x:p.x,y:p.y,life:20,max:20,s:100});
    // Lingering toxic cloud zone
    fireZones.push({x:p.x,y:p.y,r:75,life:12,maxLife:12,team:p.team,tickT:0,dmg:6,toxic:true});
    SFX.nuke();shake=0.6;
  }else if(p.w===WPN.barrageMsl){
    boomFx(p.x,p.y,50,false);
    // Ice-burst visual
    addPart({k:'ring',x:p.x,y:p.y,life:.5,max:.5,s:88,c:'#9ef0ff'});
    for(let i=0;i<9;i++)addPart({k:'spark',x:p.x+rand(-18,18),y:p.y+rand(-18,18),vx:vrand(-55,55),vy:vrand(-75,-8),life:vrand(.3,.65),max:.65,s:2.8,c:'#9ef0ff'});
    // Brief chill on nearby enemies
    const iceQ=shQuery(p.x,p.y,70);
    for(const e of iceQ){if(e.dead||e.hidden||!isEnemy(p.team,e.team)||e.kind==='b')continue;if(Math.hypot(e.x-p.x,e.y-p.y)-entRad(e)<=62)e.slowT=Math.max(e.slowT||0,2.5)}
    shake=Math.min(shake+0.2,1.0);
  }else boomFx(p.x,p.y,Math.max(p.w.splash,14),p.w.splash>30);
  if(p.w.flame&&p.w.splash>10)fireZones.push({x:p.x,y:p.y,r:55,life:10,maxLife:10,team:p.team,tickT:0,dmg:12});
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
  const mul=(sh.dmgMul||1)*upDmg(sh.team)*scrapMul*((sh.rallyT||0)>0?1.25:1);
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
  }else if(w.kind==='shell'){
    addPart({k:'trace',x:mx,y:my,x2:tgt.x,y2:tgt.y,life:.1,max:.1,c:traceC,fl:false});
    boomFx(tgt.x,tgt.y,Math.max(w.splash,14),w.splash>20);
    const nearby2=shQuery(tgt.x,tgt.y,w.splash+16);
    for(const e of nearby2){
      if(e.dead||!isEnemy(sh.team,e.team))continue;
      const isAir=e.kind==='u'&&(e.zHeight||0)>10;if(isAir&&!w.aa)continue;
      const d=dist2(e,tgt)-entRad(e);
      if(d<=w.splash){
        const fall=clamp(1-Math.max(0,d)/w.splash*.5,.5,1);
        dealDamage(e,w.dmg*mul*w.mult[e.cat]*fall,sh);
        if(toxinActive)applyPoison(e,w.dmg*0.06);
      }
    }
  }else if(w.kind==='rocket'){
    const tp={x:tgt.x,y:tgt.y,team:tgt.team};
    addProj({kind:'rocket',x:mx,y:my,dx:tgt.x,dy:tgt.y,target:tgt,spd:w.spd||300,w,team:sh.team,src:sh,mul,toxin:toxinActive});
  }else if(w.kind==='arc'){
    const d=Math.hypot(tgt.x-mx,tgt.y-my);
    addProj({kind:'arc',x:mx,y:my,sx:mx,sy:my,dx:tgt.x,dy:tgt.y,t:0,dur:Math.max(.5,d/((w.spd||250)*1.1)),spd:w.spd||250,w,team:sh.team,src:sh,mul,toxin:toxinActive});
  }
}

/* ===== SPATIAL HASH ===== */
const SH_CELL=80;
let _shMap=new Map();
function shKey(x,y){return((x/SH_CELL|0)<<16)|((y/SH_CELL|0)&0xffff)}
function shUpdate(){
  _shMap.clear();
  for(const e of units){
    if(e.dead||e.hidden)continue;
    const k=shKey(e.x,e.y);
    if(!_shMap.has(k))_shMap.set(k,[]);
    _shMap.get(k).push(e);
  }
  for(const b of builds){
    if(b.dead||!b.built)continue;
    const k=shKey(b.x,b.y);
    if(!_shMap.has(k))_shMap.set(k,[]);
    _shMap.get(k).push(b);
  }
}
function shQuery(x,y,r){
  const out=[];
  const cx=x/SH_CELL|0,cy=y/SH_CELL|0;
  const cr=Math.ceil(r/SH_CELL)+1;
  for(let dx=-cr;dx<=cr;dx++)for(let dy=-cr;dy<=cr;dy++){
    const k=((cx+dx)<<16)|((cy+dy)&0xffff);
    const arr=_shMap.get(k);
    if(arr)for(const e of arr)out.push(e);
  }
  return out;
}

/* ===== Unit AI / per-frame update ===== */
function findEnemy(u){
  let best=null,bd=u.t.sight*TILE+40;
  const cands=shQuery(u.x,u.y,bd+40);
  for(const e of cands){
    if(e.dead||e.hidden||!isEnemy(u.team,e.team))continue;
    const isAir=e.kind==='u'&&(e.zHeight||0)>10;
    if(u.t.wpn===undefined||u.t.suicide)continue;
    const w=WPN[u.t.wpn];
    if(!w)continue;
    if(isAir&&!w.aa)continue;
    if(!isAir&&w.aaOnly)continue;
    const d=Math.hypot(e.x-u.x,e.y-u.y);
    if(d<bd){bd=d;best=e}
  }
  return best;
}
function moveUnit(u,dt){
  if(!u.path||u.wpi>=u.path.length){u.moving=false;return}
  const wp=u.path[u.wpi];
  const tx=wp[0]*TILE+TILE/2,ty=wp[1]*TILE+TILE/2;
  const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy);
  if(d<6){u.wpi++;return}
  const spd=u.spd*(u.stunT>0?0:(u.slowT>0?.5:1));
  const step=spd*dt;
  u.a=Math.atan2(dy,dx);
  u.moving=true;
  u.px=u.x;u.py=u.y;
  u.x+=dx/d*Math.min(step,d);
  u.y+=dy/d*Math.min(step,d);
}
function issueOrder(u,order){
  u.order=order;u.path=null;u.wpi=0;u.retry=0;
  if(order.type==='move'||order.type==='attack-move'||order.type==='attack'){
    const gx=TT(order.x),gy=TT(order.y);
    u.path=astar(TT(u.x),TT(u.y),gx,gy,blocked);
    u.wpi=0;
  }
}
// Order helpers — thin wrappers used by ui.js, ai.js, buildings.js
function orderMove(u,x,y,kind){
  if(u.cat==='air'){u.loiter={x,y};u.attackTarget=null;u.orbT=0;return}
  u.attackTarget=null;u.anchor=null;
  issueOrder(u,{type:kind==='am'?'attack-move':'move',x,y});
}
function orderAttack(u,tgt){
  if(u.cat==='air'){u.attackTarget=tgt;if(tgt)u.loiter={x:tgt.x,y:tgt.y};u.orbT=0;return}
  u.anchor=null;
  issueOrder(u,{type:'attack',x:tgt.x,y:tgt.y,target:tgt});
}
function orderGarrison(u,b){
  if(!b.t||!b.t.garrison)return;
  if((b.garrison||[]).length>=(b.t.garrisonMax||4)){if(u.team===0){SFX.err();toast('🏠 Building full')}return}
  u.attackTarget=null;u.anchor=null;
  issueOrder(u,{type:'garrison',x:b.x,y:b.y,target:b});
}
function doGarrison(u,b){
  if(!b.garrison)b.garrison=[];
  if(b.garrison.length>=(b.t.garrisonMax||4))return;
  b.garrison.push(u);
  u.hidden=true;u.garrisonBuilding=b;
  u.path=null;u.order=null;u.ts='idle';
}
function leaveGarrison(u){
  const b=u.garrisonBuilding;
  if(!b)return;
  if(b.garrison)b.garrison=b.garrison.filter(x=>x!==u);
  u.hidden=false;u.garrisonBuilding=null;
  u.x=b.x+vrand(-16,16);u.y=(b.ty+b.t.h)*TILE+8;
  u.order=null;u.ts='idle';
}
function doCapture(u,b,dt){
  u.isCapturing=true;u.captureTarget=b;
  u.captureProgress=(u.captureProgress||0)+dt/8;
  if(u.captureProgress>=1){
    u.captureProgress=1;
    b.team=u.team;
    u.isCapturing=false;u.captureTarget=null;u.captureProgress=0;
    u.order=null;u.ts='idle';
    if(u.team===0){
      toast('🚩 '+dispName('b',b.type,u.team)+' captured!');
      SFX.done();
      updateHUD();
    }
  }
}

function updateUnit(u,dt){
  if(u.dead)return;
  // Stun
  if(u.stunT>0){u.stunT-=dt;u.moving=false;return}
  // Poison
  tickPoison(u,dt);
  if(u.dead)return;
  // Slow timer
  if(u.slowT>0)u.slowT-=dt;
  // Rally timer
  if(u.rallyT>0)u.rallyT-=dt;
  // Flash
  if(u.flash>0)u.flash=Math.max(0,u.flash-dt*4);
  // Smoke damage aura (damaged vehicles)
  if(u.cat==='veh'&&u.hp<u.maxhp*.4&&state==='play'){
    u.smkT=(u.smkT||0)-dt;
    if(u.smkT<=0){u.smkT=0.22;addPart({k:'smoke',x:u.x+vrand(-8,8),y:u.y+vrand(-4,4),vx:vrand(-4,4),vy:vrand(-14,-4),life:.55,max:.55,s:vrand(4,8)})}
  }
  // Scarab suicide check
  scarabCheck(u,dt);
  if(u.dead)return;
  // Aircraft update
  if(u.cat==='air'){updateAir(u,dt);return}
  // Garrison logic
  if(u.hidden){
    const b=u.garrisonBuilding;
    if(!b||b.dead){leaveGarrison(u);return}
    // Garrison fires at nearby enemies
    const w=u.t.wpn?WPN[u.t.wpn]:null;
    if(!w||w.kind!=='hit')return;
    u.cd=(u.cd||0)-dt;
    if(u.cd>0)return;
    const tgt=findEnemy(u);
    if(!tgt)return;
    if(Math.hypot(tgt.x-b.x,tgt.y-b.y)>u.t.sight*TILE+20)return;
    fireFrom(u,u.t.wpn,tgt);u.cd=w.rel;
    return;
  }
  // Healing aura (repair bay)
  if(u.healT>0){u.healT-=dt;if(u.hp<u.maxhp)u.hp=Math.min(u.maxhp,u.hp+u.maxhp*.005*dt*60)}
  // Weapon cooldown
  u.cd=Math.max(0,u.cd-dt);
  // Scan timer
  u.scan-=dt;
  if(u.scan<0){
    u.scan=0.3+Math.random()*.2;
    // Auto-retarget: idle or attack-move only — plain move and attack orders are not distracted
    const _ot=u.order&&u.order.type;
    if(u.ts==='idle'||(_ot==='attack-move'))u.attackTarget=findEnemy(u);
  }
  // Repath
  u.repath-=dt;

  // ORDER HANDLING
  if(u.order){
    const o=u.order;
    if(o.type==='stop'){u.order=null;u.ts='idle';u.path=null;return}
    if(o.type==='garrison'){
      const b=o.target;
      if(!b||b.dead){u.order=null;return}
      if(Math.hypot(u.x-b.x,u.y-b.y)<20){doGarrison(u,b);return}
      if(!u.path||u.repath<=0){u.path=astar(TT(u.x),TT(u.y),b.tx+1,b.ty+1,blocked);u.wpi=0;u.repath=2}
      moveUnit(u,dt);u.ts='move';return;
    }
    if(o.type==='capture'){
      const b=o.target;
      if(!b||b.dead){u.order=null;return}
      if(b.team===u.team){u.order=null;return}
      if(Math.hypot(u.x-b.x,u.y-b.y)<TILE*1.4){
        doCapture(u,b,dt);u.moving=false;return;
      }
      if(!u.path||u.repath<=0){u.path=astar(TT(u.x),TT(u.y),b.tx+Math.floor(b.t.w/2),b.ty+Math.floor(b.t.h/2),blocked);u.wpi=0;u.repath=2}
      moveUnit(u,dt);u.ts='move';return;
    }
    if(o.type==='move'||o.type==='attack-move'){
      if(o.type==='attack-move'){
        const e=findEnemy(u);
        if(e)u.attackTarget=e;
        if(u.attackTarget&&!u.attackTarget.dead){
          const w=u.t.wpn?WPN[u.t.wpn]:null;
          if(w){
            const d=Math.hypot(u.attackTarget.x-u.x,u.attackTarget.y-u.y);
            if(d<=w.rng*1.05){
              u.moving=false;
              if(u.cd<=0){fireFrom(u,u.t.wpn,u.attackTarget);u.cd=w.rel}
              return;
            }
          }
        }
      }
      if(!u.path||u.path.length===0){
        u.order=null;u.ts='idle';return;
      }
      moveUnit(u,dt);u.ts='move';
      if(u.wpi>=u.path.length){u.order=null;u.ts='idle'}
      return;
    }
    if(o.type==='attack'){
      const tgt=o.target;
      if(!tgt||tgt.dead){u.order=null;u.ts='idle';return}
      u.attackTarget=tgt;
      const w=u.t.wpn?WPN[u.t.wpn]:null;
      if(!w){u.order=null;return}
      const d=Math.hypot(tgt.x-u.x,tgt.y-u.y);
      if(d<=w.rng*1.05){
        u.moving=false;
        if(u.cd<=0){fireFrom(u,u.t.wpn,tgt);u.cd=w.rel}
        return;
      }
      if(u.repath<=0){u.path=astar(TT(u.x),TT(u.y),TT(tgt.x),TT(tgt.y),blocked);u.wpi=0;u.repath=1.5}
      moveUnit(u,dt);u.ts='move';
      return;
    }
    if(o.type==='patrol'){
      const w=u.t.wpn?WPN[u.t.wpn]:null;
      if(w&&u.attackTarget&&!u.attackTarget.dead){
        const d=Math.hypot(u.attackTarget.x-u.x,u.attackTarget.y-u.y);
        if(d<=w.rng*1.05){
          u.moving=false;
          if(u.cd<=0){fireFrom(u,u.t.wpn,u.attackTarget);u.cd=w.rel}
          return;
        }
      }
      const pts=o.pts;
      if(!pts||pts.length<2){u.order=null;return}
      const pt=pts[o.pi||0];
      if(!u.path||u.repath<=0){u.path=astar(TT(u.x),TT(u.y),TT(pt.x),TT(pt.y),blocked);u.wpi=0;u.repath=3}
      moveUnit(u,dt);u.ts='move';
      if(u.wpi>=u.path.length){o.pi=((o.pi||0)+1)%pts.length;u.path=null}
      return;
    }
  }

  // IDLE LOGIC
  u.ts='idle';
  const w=u.t.wpn?WPN[u.t.wpn]:null;
  // Supply truck
  if(u.type==='truck'&&u.auto){
    updateTruck(u,dt);return;
  }
  // Dozer
  if(u.type==='dozer'){
    updateDozer(u,dt);return;
  }
  // Auto-attack (attack-move anchor)
  if(u.anchor){
    const e=findEnemy(u);
    if(e){
      if(w){
        const d=Math.hypot(e.x-u.x,e.y-u.y);
        if(d<=w.rng*1.05){
          u.attackTarget=e;u.moving=false;
          if(u.cd<=0){fireFrom(u,u.t.wpn,e);u.cd=w.rel}
          return;
        }else{
          // Chase if within anchor radius (but don't stray too far)
          const da=Math.hypot(e.x-u.anchor.x,e.y-u.anchor.y);
          if(da<200){
            if(u.repath<=0){u.path=astar(TT(u.x),TT(u.y),TT(e.x),TT(e.y),blocked);u.wpi=0;u.repath=1.5}
            moveUnit(u,dt);u.ts='move';return;
          }
        }
      }
    }
    // Return to anchor
    const da2=Math.hypot(u.x-u.anchor.x,u.y-u.anchor.y);
    if(da2>32){
      if(u.repath<=0){u.path=astar(TT(u.x),TT(u.y),TT(u.anchor.x),TT(u.anchor.y),blocked);u.wpi=0;u.repath=2}
      moveUnit(u,dt);u.ts='move';
    }
    return;
  }
  if(!w)return;
  // Weapon range-gated combat
  const minRng=w.minRng||0;
  if(!u.attackTarget||u.attackTarget.dead)u.attackTarget=findEnemy(u);
  if(!u.attackTarget)return;
  const tgt=u.attackTarget;
  const d=Math.hypot(tgt.x-u.x,tgt.y-u.y);
  if(d<=w.rng*1.05&&d>=minRng){
    u.moving=false;
    if(u.cd<=0){fireFrom(u,u.t.wpn,tgt);u.cd=w.rel}
    return;
  }
  // Out of range — step toward
  if(d>w.rng*1.1){
    if(u.repath<=0){u.path=astar(TT(u.x),TT(u.y),TT(tgt.x),TT(tgt.y),blocked);u.wpi=0;u.repath=1.2}
    moveUnit(u,dt);u.ts='move';
  }
}

function updateTruck(u,dt){
  // Supply truck: auto-drive to nearest pile, collect gold, deliver to command center
  const w=u.t.wpn?WPN[u.t.wpn]:null;
  if(w&&!u.hidden){
    const e=findEnemy(u);
    if(e){
      const d=Math.hypot(e.x-u.x,e.y-u.y);
      if(d<=w.rng*1.05&&u.cd<=0){fireFrom(u,u.t.wpn,e);u.cd=w.rel}
    }
  }
  if(u.cargo>0){
    // Deliver
    const cmd=builds.find(b=>!b.dead&&b.built&&b.team===u.team&&b.type==='command');
    if(!cmd){return}
    const d=Math.hypot(cmd.x-u.x,cmd.y-u.y);
    if(d<30){
      const earned=u.cargo*upMk(u.team);
      money[u.team]+=earned;
      if(u.team===0){gameStats.moneyEarned+=earned;updateHUD()}
      addPart({k:'txt',x:u.x,y:u.y-26,life:1.5,max:1.5,s:0,txt:'+$'+earned});
      u.cargo=0;return;
    }
    if(u.repath<=0){u.path=astar(TT(u.x),TT(u.y),TT(cmd.x),TT(cmd.y),blocked);u.wpi=0;u.repath=3}
    moveUnit(u,dt);u.ts='move';return;
  }
  // Find pile
  let best=null,bd=9999;
  for(const p of piles){if(p.amt<=0)continue;const d=Math.hypot(p.x-u.x,p.y-u.y);if(d<bd){bd=d;best=p}}
  if(!best){u.moving=false;return}
  u.pile=best;
  const d=Math.hypot(best.x-u.x,best.y-u.y);
  if(d<28){
    const take=Math.min(best.amt,150);
    best.amt-=take;u.cargo+=take;
    u.wpi=9999;
    return;
  }
  if(u.repath<=0){u.path=astar(TT(u.x),TT(u.y),TT(best.x),TT(best.y),blocked);u.wpi=0;u.repath=3}
  moveUnit(u,dt);u.ts='move';
}

function updateDozer(u,dt){
  if(u.site){
    const b=u.site;
    if(b.dead||b.built){u.site=null;u.order=null;u.ts='idle';return}
    const d=Math.hypot(b.x-u.x,b.y-u.y);
    if(d>24){
      if(u.repath<=0){u.path=astar(TT(u.x),TT(u.y),b.tx+Math.floor(b.t.w/2),b.ty+Math.floor(b.t.h/2),blocked);u.wpi=0;u.repath=2}
      moveUnit(u,dt);u.ts='move';return;
    }
    b.prog=Math.min(1,b.prog+dt/b.t.bt);
    if(b.prog>=1){
      b.built=true;
      if(b.type==='supply'){
        const tr=spawnUnit('truck',b.team,b.x+vrand(-16,16),(b.ty+b.t.h)*TILE+16);
        if(tr)tr.auto=true;
      }
      if(b.type==='power')powerTick(b.team);
      setBlocked(b,true);
      u.site=null;
    }
    u.moving=false;u.ts='build';
    return;
  }
  u.moving=false;
}

/* ===== Air unit update ===== */
function updateAir(u,dt){
  u.cd=Math.max(0,u.cd-dt);
  if(u.flash>0)u.flash=Math.max(0,u.flash-dt*4);
  // On-pad: rearm + repair
  if(u.ts==='rearming'){
    u.rearmT=(u.rearmT||0)-dt;
    if(u.rearmT<=0){
      u.ammo=u.t.ammo||4;
      u.hp=Math.min(u.maxhp,u.hp+u.maxhp*.5);
      u.ts='idle';
    }
    u.moving=false;return;
  }
  // Bomber RTB when out of ammo
  if(u.ammo<=0&&u.home){
    const pp=padPos(u.home,u.padI);
    const d=Math.hypot(pp.x-u.x,pp.y-u.y);
    if(d<16){
      u.x=pp.x;u.y=pp.y;
      u.ts='rearming';u.rearmT=8;
      return;
    }
    const ang=Math.atan2(pp.y-u.y,pp.x-u.x);
    u.a=ang;u.px=u.x;u.py=u.y;
    u.x+=Math.cos(ang)*u.spd*dt;
    u.y+=Math.sin(ang)*u.spd*dt;
    u.moving=true;u.zHeight=30;
    return;
  }
  // Attack logic
  const w=u.t.wpn?WPN[u.t.wpn]:null;
  if(!w){u.moving=false;return}
  if(!u.attackTarget||u.attackTarget.dead){
    // Seek nearest enemy (air units prefer ground targets unless aaOnly)
    let best=null,bd=u.t.sight*TILE+60;
    for(const e of units){
      if(e.dead||!isEnemy(u.team,e.team))continue;
      if(w.aaOnly&&(e.zHeight||0)<=10)continue;
      if(!w.aa&&(e.zHeight||0)>10)continue;
      const d=Math.hypot(e.x-u.x,e.y-u.y);
      if(d<bd){bd=d;best=e}
    }
    u.attackTarget=best;
  }
  if(!u.attackTarget){u.moving=false;return}
  const tgt=u.attackTarget;
  const d=Math.hypot(tgt.x-u.x,tgt.y-u.y);
  const ang=Math.atan2(tgt.y-u.y,tgt.x-u.x);
  if(d<=w.rng*.9&&d>=w.minRng||0){
    if(u.cd<=0&&u.ammo>0){
      fireFrom(u,u.t.wpn,tgt);
      u.cd=w.rel;
      u.ammo=Math.max(0,u.ammo-1);
    }
    // Circle the target
    const perp=u.a+Math.PI*.5;
    u.px=u.x;u.py=u.y;
    u.x+=Math.cos(perp)*u.spd*dt*.6;
    u.y+=Math.sin(perp)*u.spd*dt*.6;
    u.a=Math.atan2(u.y-tgt.y,u.x-tgt.x)+Math.PI;
    u.moving=true;u.zHeight=30;
  }else{
    u.a=ang;
    u.px=u.x;u.py=u.y;
    u.x+=Math.cos(ang)*u.spd*dt;
    u.y+=Math.sin(ang)*u.spd*dt;
    u.moving=true;u.zHeight=30;
  }
  // Drone: runs out of ammo and disappears
  if(u.type==='drone'&&u.ammo<=0){
    u.dead=true;
    addPart({k:'smoke',x:u.x,y:u.y,vx:vrand(-8,8),vy:vrand(-20,-6),life:.8,max:.8,s:8});
  }
}

/* ===== Main unit update loop ===== */
function updateUnits(dt){
  shUpdate();
  for(const u of units){
    if(u.dead)continue;
    updateUnit(u,dt);
  }
  // Repair bay aura
  for(const b of builds){
    if(b.dead||!b.built||!b.t.repairAura)continue;
    b.repT=(b.repT||0)-dt;
    if(b.repT>0)continue;
    b.repT=2.5;
    for(const u of units){
      if(u.dead||u.team!==b.team||Math.hypot(u.x-b.x,u.y-b.y)>110)continue;
      if(u.hp<u.maxhp){u.hp=Math.min(u.maxhp,u.hp+u.maxhp*.04);addPart({k:'heal',x:u.x,y:u.y,life:.5,max:.5,s:10})}
      u.healT=1;
    }
  }
  // Purge dead
  for(let i=units.length-1;i>=0;i--)if(units[i].dead)units.splice(i,1);
  // Blood/scrap cleanup
  for(let i=scraps.length-1;i>=0;i--)if(scraps[i].dead)scraps.splice(i,1);
  for(let i=rubbles.length-1;i>=0;i--){
    rubbles[i].life-=dt;
    if(rubbles[i].life<=0)rubbles.splice(i,1);
  }
}

/* ===== Garrison fire from buildings ===== */
function garrisonFire(b,dt){
  if(!b.garrison||!b.garrison.length)return;
  const gc=b.garrison;
  for(const u of gc){
    if(u.dead)continue;
    u.cd=Math.max(0,(u.cd||0)-dt);
    if(u.cd>0)continue;
    const w=u.t.wpn?WPN[u.t.wpn]:null;
    if(!w||w.kind!=='hit')continue;
    let best=null,bd=u.t.sight*TILE;
    for(const e of units){
      if(e.dead||e.hidden||!isEnemy(u.team,e.team))continue;
      if((e.zHeight||0)>10&&!w.aa)continue;
      const d=Math.hypot(e.x-b.x,e.y-b.y);
      if(d<bd){bd=d;best=e}
    }
    if(!best)continue;
    fireFrom(u,u.t.wpn,best);u.cd=w.rel;
  }
  // Remove dead garrison members
  b.garrison=gc.filter(u=>!u.dead);
  if(!b.garrison.length)b.garrison=[];
}

/* ===== Unit kill check (boomkart) ===== */
function checkBoomkartKill(u){
  if(u.type==='scarab'&&u.dead&&u.t.suicide){
    boomkartDeath(u);
    boomFx(u.x,u.y,60,true);
  }
}
