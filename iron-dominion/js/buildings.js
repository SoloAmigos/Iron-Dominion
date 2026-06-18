'use strict';
/* ================= BUILDINGS ================= */
function placeBuilding(type,team,tx,ty,instant){
  const t=BT[type];
  const f=team>=0?FAC(team):{bhp:1,dmg:1,turretDmg:1};
  const gm=team>=0?GENMOD(team):{turretHpMul:1,bcostMul:1,incomeMul:1};
  let mhp=Math.round(t.hp*f.bhp);
  // Apply GENMOD turretHpMul to turrets and samsites
  if(type==='turret'||type==='samsite')mhp=Math.round(mhp*gm.turretHpMul);
  // Apply GENMOD bHpMul (defense general) to all buildings
  if(gm.bHpMul&&type!=='turret'&&type!=='samsite')mhp=Math.round(mhp*gm.bHpMul);
  const b={kind:'b',id:ids++,type,team,tx,ty,x:(tx+t.w/2)*TILE,y:(ty+t.h/2)*TILE,
    hp:instant?mhp:mhp*.1,maxhp:mhp,t,cat:'bld',built:!!instant,prog:instant?1:0,
    dmgMul:team>=0?(f.dmg*(type==='turret'?f.turretDmg:1)):1,
    queue:[],rally:{x:(tx+t.w/2)*TILE,y:(ty+t.h+1.2)*TILE},cd:0,ta:0,scan:Math.random()*.4,attackTarget:null,flash:0,dead:false};
  if(t.garrison)b.garrison=[];
  // Scorpion GLA hole flags
  if(team>=0&&fac[team]==='scorpion'){b.isHole=false;b.holeT=0;b.selfBuild=false;b.rebuilt=false}
  // Airfield pad tracking
  if(type==='airfield'){b.padUnits=new Array(4).fill(null)}
  builds.push(b);
  blockRect(tx,ty,t.w,t.h,1);
  for(const u of units)if(!u.dead&&u.x>tx*TILE-8&&u.x<(tx+t.w)*TILE+8&&u.y>ty*TILE-8&&u.y<(ty+t.h)*TILE+8){
    const ft=freeNear(TT(u.x),TT(u.y));
    if(ft){u.path=[{x:ft.x*TILE+TILE/2,y:ft.y*TILE+TILE/2}];u.wpi=0}
  }
  return b;
}
function canPlace(type,tx,ty,team){
  const t=BT[type];
  if(tx<1||ty<1||tx+t.w>MAPW-1||ty+t.h>MAPH-1)return false;
  for(let y=ty;y<ty+t.h;y++)for(let x=tx;x<tx+t.w;x++){
    if(blocked[idx(x,y)])return false;
    if(team===0&&vis[idx(x,y)]===0)return false;
    for(const p of piles)if(x>=p.tx-1&&x<=p.tx+2&&y>=p.ty-1&&y<=p.ty+2)return false;
  }
  return true;
}
function completeBuilding(b){
  b.built=true;b.prog=1;b.hp=b.maxhp;
  // If this building is currently selected, rebuild its card so the stale
  // "Cancel build" button is replaced immediately (refreshCard only ticks progress).
  if(typeof updateCard==='function'&&typeof sel!=='undefined'&&sel.includes(b))updateCard();
  if(b.team===0){toast('🔧 Construction complete — '+dispName('b',b.type,0));SFX.done()}
  if(b.type==='supply'&&!b.rebuilt){const tr=spawnUnit('truck',b.team,b.rally.x,b.rally.y);if(tr)tr.auto=true}
  if(b.team===0){
    if(b.type==='barracks'&&!pw.drop.on){pw.drop.on=true;pw.drop.cd=15;
      toast(pw.drop.unl?'🪂 Reinforcement drop online!':'🪂 Drop zone ready — unlock it in the ⭐ General menu')}
    if(b.type==='factory'&&!pw.strike.on){pw.strike.on=true;pw.strike.cd=20;
      toast(pw.strike.unl?'✈️ Airstrike support online!':'✈️ Air support ready — unlock it in the ⭐ General menu')}
    if(b.type==='silo'&&!pw.nuke.on){pw.nuke.on=true;toast('☢️ Superweapon built — missile charging…')}
    if(typeof refreshPowers==='function')refreshPowers();
  }
}
function updateBuilding(b,dt){
  b.flash=Math.max(0,b.flash-dt);

  // GLA hole mechanic (Scorpion buildings)
  if(b.isHole){
    b.holeT-=dt;
    if(b.holeT<=0){
      b.selfBuild=true;b.isHole=false;b.built=false;b.hp=b.maxhp*.1;b.prog=0;
    }
    return;
  }

  if(!b.built){
    // selfBuild (GLA rebuild): try to assign a free dozer
    if(b.selfBuild){
      const dz=units.find(u=>!u.dead&&u.team===b.team&&u.type==='dozer'&&!u.site);
      if(dz){dz.site=b;dz.path=null;b.selfBuild=false}
    }
    if(b.prog>=1)completeBuilding(b);
    return;
  }

  // Airfield training
  if(b.type==='airfield'&&b.queue.length){
    const it=b.queue[0];
    const _bt=UT[it.type].bt;
    if(it.p<_bt)it.p+=dt*(lowPow[b.team]?.45:1);  // cap at 100% while pad is full
    if(it.p>=_bt){
      // Check if pad is available
      const padAvail=b.padUnits&&b.padUnits.some(p=>p===null||p===undefined);
      if(padAvail){
        b.queue.shift();
        const ex={x:b.x,y:(b.ty+b.t.h)*TILE+16};
        const nu=spawnUnit(it.type,b.team,ex.x,ex.y);
        claimPad(b,nu);
        if(b.team===0&&readyCd<=0){readyCd=1.4;toast(UT[it.type].ic+' '+dispName('u',it.type,b.team)+' ready');SFX.done()}
      }
      // pad full: hold at 100%, spawn the moment a pad frees
    }
  }

  if(b.queue.length&&b.type!=='airfield'){
    const it=b.queue[0];
    it.p+=dt*(lowPow[b.team]?.45:1);
    if(it.p>=UT[it.type].bt){
      b.queue.shift();
      const ex={x:b.x,y:(b.ty+b.t.h)*TILE+16};
      const nu=spawnUnit(it.type,b.team,ex.x,ex.y);
      if(it.type==='truck')nu.auto=true; // produced trucks auto-harvest like the free one
      if(Math.hypot(b.rally.x-ex.x,b.rally.y-ex.y)>TILE)orderMove(nu,b.rally.x+vrand(-14,14),b.rally.y+vrand(-14,14),'move');
      if(b.team===0&&readyCd<=0){readyCd=1.4;toast(UT[it.type].ic+' '+dispName('u',it.type,b.team)+' ready');SFX.done()}
    }
  }
  if(b.t.repairAura&&b.built&&b.team>=0){
    b.repT=(b.repT||0)+dt;
    if(b.repT>=2.5){
      b.repT-=2.5;
      const nearby=shQuery(b.x,b.y,180);
      for(const u of nearby){
        if(u.kind!=='u'||u.dead||u.team!==b.team||u.hp>=u.maxhp)continue;
        u.hp=Math.min(u.maxhp,u.hp+u.maxhp*.07);
        if(u.team===0)addPart({k:'txt',txt:'+HP',x:u.x,y:u.y-18,vy:-20,life:.75,max:.75});
      }
    }
  }
  if(b.t.income&&b.team>=0){
    const gm2=GENMOD(b.team);
    b.mkT=(b.mkT||0)+dt*(lowPow[b.team]?.5:1);
    if(b.mkT>=5){
      b.mkT-=5;
      const inc=Math.round(b.t.income*upMk(b.team)*gm2.incomeMul);
      money[b.team]+=inc;
      if(b.team===0){
        gameStats.moneyEarned=(gameStats.moneyEarned||0)+inc;
        addPart({k:'txt',txt:'+$'+inc,x:b.x,y:b.y-26,vy:-22,life:.9,max:.9});
      }
    }
  }
  if(b.t.silo){
    if(b.charge===undefined)b.charge=0;
    if(b.charge<1&&!lowPow[b.team]){
      b.charge=Math.min(1,b.charge+dt/300);
      if(b.charge>=1&&b.team===0){toast('☢️ Missile ready — hit LAUNCH!');SFX.done();if(typeof refreshPowers==='function')refreshPowers()}
    }
  }
  if(b.t.wpn&&!lowPow[b.team]){
    b.cd=Math.max(0,b.cd-dt);
    if(b.attackTarget&&(b.attackTarget.dead||dist2(b,b.attackTarget)-entRad(b.attackTarget)>WPN[b.t.wpn].rng*1.15))b.attackTarget=null;
    b.scan-=dt;
    if(!b.attackTarget&&b.scan<=0){b.scan=.45;b.attackTarget=findEnemyInRange(b,WPN[b.t.wpn].rng)}
    if(b.attackTarget&&b.cd<=0){fireFrom(b,b.t.wpn,b.attackTarget);b.cd=WPN[b.t.wpn].rel}
  }
  // Enemy recapture of player-held neutral buildings (oil/watchtower/repairbay)
  if(b.t.capturable&&b.team===0&&b.built){
    const near=shQuery(b.x,b.y,entRad(b)+TILE*2.2);
    let hasEnemy=false;
    for(const e of near){if(!e.dead&&e.kind==='u'&&e.cat==='inf'&&isEnemy(0,e.team)){hasEnemy=true;break}}
    if(hasEnemy){
      b.recaptureT=(b.recaptureT||0)+dt;
      if(b.recaptureT>=14){
        b.team=-1;b.recaptureT=0;
        if(state==='play')toast('📍 '+b.t.name+' lost to enemy infantry!');
      }
    }else{
      if(b.recaptureT)b.recaptureT=Math.max(0,b.recaptureT-dt*0.6);
    }
  }
  if((b.fortressT||0)>0)b.fortressT=Math.max(0,b.fortressT-dt);
}
function recomputePower(){
  const n=fac.length;
  for(let t=0;t<n;t++){
    if(!FAC(t)){continue}
    if(FAC(t).noPower){powerP[t]=99;powerU[t]=0;lowPow[t]=false;continue}
    let p=0,u=0;
    for(const b of builds)if(!b.dead&&b.built&&b.team===t&&!b.isHole){
      if(b.t.pow<0)p+=-b.t.pow;else u+=b.t.pow;
    }
    powerP[t]=p;powerU[t]=u;
    const low=u>p;
    if(t===0&&low&&!lowPow[0]&&state==='play')toast('🔌 Low power! Build more Power Plants');
    lowPow[t]=low;
  }
}
