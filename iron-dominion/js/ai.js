'use strict';
/* ================= ENEMY AI ================= */
function makeAI(diff){
  const aiD=SLOT_DIFFS[diff]||SLOT_DIFFS.medium;
  const bo=[
    {b:'power',o:[-3,1]},
    {b:'supply',o:[-5,3]},
    {b:'barracks',o:[1,6]},
    {b:'power',o:[-3,-2]},
    {b:'factory',o:[-1,9]},
    {b:'turret',o:[-7,8]},
    {b:'market',o:[6,2]},
    {b:'power',o:[-6,1]},
    {b:'turret',o:[2,11]},
    {b:'tech',o:[-4,12]},
    {b:'supply',o:[5,9]},
    {b:'market',o:[8,5]},
    {b:'turret',o:[-7,3]},
    {b:'power',o:[5,-1]},
    {b:'radar',o:[-5,11]},
    {b:'samsite',o:[0,13]},
    {b:'airfield',o:[9,7]},
  ];
  if(aiD.silo)bo.push({b:'silo',o:[7,9]},{b:'power',o:[-2,13]});
  return{bo,boi:0,builtTypes:{},waveT:aiD.first,rebT:6,defT:0,upT:25,nukeT:0,cc:null,D:aiD,team:1,
    waveN:0,regroup:null,lastWave:null};
}
/* Per-faction combat doctrine: production weights + wave cadence */
const FACMIX={
  vanguard: {fArty:.2, fAlt:'paladin',  bRocket:.35,cadence:1.0},  // armor spearheads
  crimson:  {fArty:.5, fAlt:'arty',     bRocket:.55,cadence:1.15}, // artillery sieges
  scorpion: {fArty:.15,fAlt:'technical',bRocket:.4, cadence:.8},   // cheap fast raids
  northwind:{fArty:.3, fAlt:'guardian', bRocket:.45,cadence:1.0},  // combined arms
};
function aiMix(t){return FACMIX[fac[t]]||FACMIX.vanguard}
function aiCountBuild(type){let n=0;for(const b of builds)if(!b.dead&&b.team===ai.team&&b.type===type)n++;return n}
function aiBuildAt(type,off){
  const t=ai.team;
  if(isLocked(type,t))return false;
  const cc=ai.cc&&!ai.cc.dead?ai.cc:builds.find(b=>b.team===t&&!b.dead);
  if(!cc)return false;
  let tx=cc.tx+off[0],ty=cc.ty+off[1];
  if(!canPlace(type,tx,ty,t)){
    let ok=false;
    for(let r=1;r<=7&&!ok;r++)for(let dy=-r;dy<=r&&!ok;dy++)for(let dx=-r;dx<=r&&!ok;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
      if(canPlace(type,tx+dx,ty+dy,t)){tx+=dx;ty+=dy;ok=true}
    }
    if(!ok)return false;
  }
  money[t]-=costOf('b',type,t);
  const site=placeBuilding(type,t,tx,ty,false);
  ai.builtTypes[type]=true;
  return site;
}
function aiTick(tick){
  const t=ai.team, aiD=ai.D||SLOT_DIFFS.medium;
  money[t]+=aiD.trickle*tick;
  const sites=builds.filter(b=>b.team===t&&!b.dead&&!b.built&&!b.isHole);
  const dozers=units.filter(u=>u.team===t&&!u.dead&&u.type==='dozer');
  for(const s of sites){
    if(dozers.some(d=>d.site===s))continue;
    const free=dozers.find(d=>!d.site);
    if(free){free.site=s;free.path=null}
  }
  let cur=ai.bo[ai.boi];
  while(cur&&FAC(t).noPower&&cur.b==='power'){ai.boi++;cur=ai.bo[ai.boi]}
  if(cur&&money[t]>=costOf('b',cur.b,t)&&dozers.length&&sites.length<=dozers.length){
    if(aiBuildAt(cur.b,cur.o)!==false)ai.boi++;
    else ai.boi++;
  }
  if(lowPow[t]&&money[t]>=costOf('b','power',t)&&!sites.some(s=>s.type==='power'))aiBuildAt('power',[rand(-7,5)|0,rand(-2,10)|0]);
  ai.rebT-=tick;
  if(ai.rebT<=0){
    ai.rebT=6;
    for(const k of['power','supply','barracks','factory','radar']){
      if(k==='power'&&FAC(t).noPower)continue;
      if(ai.builtTypes[k]&&aiCountBuild(k)===0&&money[t]>=costOf('b',k,t)){aiBuildAt(k,[rand(-6,4)|0,rand(0,10)|0]);break}
    }
    const wantDz=(sites.length>1||gtime>90)?2:1;
    if(dozers.length<wantDz&&money[t]>=costOf('u','dozer',t)){
      const cc=builds.find(b=>b.team===t&&!b.dead&&b.built&&b.t.trains&&b.t.trains.includes('dozer'));
      if(cc&&cc.queue.length<1){money[t]-=costOf('u','dozer',t);cc.queue.push({type:'dozer',p:0})}
    }
  }
  ai.upT-=tick;
  if(ai.upT<=0){
    ai.upT=6;
    if(money[t]>1800)for(const id of['w1','a1','w2','a2','mkt','cap'])if(buyUpgrade(t,id))break;
  }
  if(!piles.some(p=>p.amt>0)&&aiCountBuild('market')<3&&money[t]>=costOf('b','market',t)&&!sites.some(s2=>s2.type==='market'))
    aiBuildAt('market',[rand(-7,7)|0,rand(-2,11)|0]);
  ai.nukeT-=tick;
  if(ai.nukeT<=0){
    for(const b of builds){
      if(b.dead||!b.built||b.team!==t||!b.t.silo||(b.charge||0)<1)continue;
      let tgt=null,bs=-1;
      for(const pb of builds){
        if(pb.dead||!isEnemy(t,pb.team))continue;
        let sc=pb.maxhp;
        for(const pb2 of builds)if(!pb2.dead&&isEnemy(t,pb2.team)&&dist2(pb,pb2)<170)sc+=pb2.maxhp*.5;
        if(sc>bs){bs=sc;tgt=pb}
      }
      if(!tgt){const pu=units.filter(u=>!u.dead&&isEnemy(t,u.team));if(pu.length)tgt=pu[0]}
      if(tgt){fireNukeFrom(b,tgt.x+rand(-20,20),tgt.y+rand(-20,20),t);ai.nukeT=75+rand(-15,15);break}
    }
  }
  // Airfield production (raptor + any GENMOD sig air units)
  for(const b of builds){
    if(b.dead||!b.built||b.team!==t||b.type!=='airfield'||b.queue.length>=2)continue;
    const padAvail=b.padUnits&&b.padUnits.some(p=>p===null||p===undefined);
    if(!padAvail)continue;
    const airRoster=['raptor'];
    for(const sg of FAC(t).sigs)if(sg.at==='airfield'&&!airRoster.includes(sg.unit))airRoster.push(sg.unit);
    for(const sg of GENMOD(t).sigs||[])if(sg.at==='airfield'&&!airRoster.includes(sg.unit))airRoster.push(sg.unit);
    const pick=airRoster[Math.floor(Math.random()*airRoster.length)];
    if(!isLocked(pick,t)){const c=costOf('u',pick,t);if(money[t]>=c){money[t]-=c;b.queue.push({type:pick,p:0})}}
  }
  const myUnits=units.filter(u=>u.team===t&&!u.dead);
  const trucks=myUnits.filter(u=>u.type==='truck').length;
  const army=myUnits.filter(u=>COMBAT.includes(u.type));
  const supplies=aiCountBuild('supply');
  const cap=aiD.cap+Math.floor(gtime/240)*4;
  for(const b of builds){
    if(b.dead||!b.built||b.team!==t||!b.t.trains||b.queue.length>=2)continue;
    if(b.type==='airfield')continue;
    const tc=costOf('u','truck',t);
    if(b.type==='supply'&&trucks<Math.min(3,supplies*2)&&money[t]>=tc){money[t]-=tc;b.queue.push({type:'truck',p:0});continue}
    if(army.length>=cap)continue;
    const sigs=FAC(t).sigs,mix=aiMix(t);
    if(b.type==='factory'){
      let pick=Math.random()<mix.fArty?'arty':'tank';
      if(Math.random()<.22&&UT[mix.fAlt]&&!isLocked(mix.fAlt,t))pick=mix.fAlt;
      if(isLocked(pick,t))pick='arty';
      if(isLocked(pick,t))pick=null;
      const fs=[...sigs.filter(g=>g.at==='factory'),...(GENMOD(t).sigs||[]).filter(g=>g.at==='factory')];
      if(fs.length&&Math.random()<.35){const cand=fs[Math.floor(Math.random()*fs.length)].unit;if(!isLocked(cand,t)&&UT[cand]&&UT[cand].cat!=='air')pick=cand}
      if(pick&&UT[pick]&&UT[pick].cat!=='air'){const c=costOf('u',pick,t);if(money[t]>=c){money[t]-=c;b.queue.push({type:pick,p:0})}}
    }else if(b.type==='barracks'){
      let pick=Math.random()<mix.bRocket?'rocket':'ranger';
      if(isLocked(pick,t))pick='ranger';
      const bs2=[...sigs.filter(g=>g.at==='barracks'),...(GENMOD(t).sigs||[]).filter(g=>g.at==='barracks')];
      if(bs2.length&&Math.random()<.4){const cand=bs2[Math.floor(Math.random()*bs2.length)].unit;if(!isLocked(cand,t))pick=cand}
      const c=costOf('u',pick,t);
      if(money[t]>=c&&Math.random()<.8){money[t]-=c;b.queue.push({type:pick,p:0})}
    }
  }
  ai.defT-=tick;
  if(ai.defT<=0){
    ai.defT=2;
    let threat=null;
    for(const u of units){
      if(u.dead||!isEnemy(t,u.team)||!COMBAT.includes(u.type))continue;
      for(const b of builds)if(!b.dead&&b.team===t&&dist2(u,b)<300){threat=u;break}
      if(threat)break;
    }
    if(threat)for(const u of army)if(!u.attackTarget&&dist2(u,threat)<700)orderMove(u,threat.x,threat.y,'am');
  }
  // Staged flank: units regroup at waypoint, then strike the real target together
  if(ai.regroup){
    ai.regroup.t-=tick;
    if(ai.regroup.t<=0){
      const rg=ai.regroup;ai.regroup=null;
      if(rg.tgt&&!rg.tgt.dead){
        let i=0;
        for(const u of rg.units)if(!u.dead){const[ox,oy]=formOff(i++);orderMove(u,rg.tgt.x+ox,rg.tgt.y+oy,'am')}
      }
    }
  }
  // Retreat: if the committed wave lost 60%+ of its force, pull survivors home
  if(ai.lastWave){
    const alive=ai.lastWave.units.filter(u=>!u.dead);
    if(alive.length===0)ai.lastWave=null;
    else if(alive.length<ai.lastWave.size*.4){
      const home=ai.cc&&!ai.cc.dead?ai.cc:{x:WW/2,y:WH/2};
      let i=0;
      for(const u of alive){const[ox,oy]=formOff(i++);orderMove(u,home.x+ox,home.y+oy+TILE*4,'am')}
      ai.lastWave=null;
    }
  }
  ai.waveT-=tick;
  if(ai.waveT<=0){
    ai.waveT=aiD.wave*aiMix(t).cadence;
    if(army.length>=5){
      ai.waveN++;
      const ref=ai.cc&&!ai.cc.dead?ai.cc:{x:WW/2,y:WH/2};
      const strat=ai.waveN%4; // 1=flank-left 2=econ-raid 3=flank-right 0=direct
      let tgt=null,bd=1e9;
      for(const b of builds){
        if(b.dead||!isEnemy(t,b.team))continue;
        let d=dist2(b,ref)*(b.isHole?.2:1);
        // Econ raid: heavily prefer supply depots and markets
        if(strat===2&&(b.type==='supply'||b.type==='market'))d*=.15;
        if(d<bd){bd=d;tgt=b}
      }
      if(tgt){
        const sorted=army.slice().sort((a,b2)=>dist2(a,ref)-dist2(b2,ref));
        const guards=Math.ceil(sorted.length*.22);
        const strike=sorted.slice(guards);
        ai.lastWave={units:strike.slice(),size:strike.length};
        if(strat===1||strat===3){
          // Flank: stage at a waypoint perpendicular to the attack axis
          const mx=(ref.x+tgt.x)/2,my=(ref.y+tgt.y)/2;
          const dx=tgt.x-ref.x,dy=tgt.y-ref.y,len=Math.hypot(dx,dy)||1;
          const side=strat===1?1:-1;
          const wx=clamp(mx-dy/len*420*side,TILE*2,WW-TILE*2);
          const wy=clamp(my+dx/len*420*side,TILE*2,WH-TILE*2);
          let i=0;
          for(const u of strike){const[ox,oy]=formOff(i++);orderMove(u,wx+ox,wy+oy,'am')}
          ai.regroup={units:strike.slice(),tgt,t:11};
        }else{
          let i=0;
          for(const u of strike){const[ox,oy]=formOff(i++);orderMove(u,tgt.x+ox,tgt.y+oy,'am')}
        }
      }
    }
  }
  // Air patrols: aircraft with no orders auto-attack nearest enemy — independent of wave timer
  {
    let airTgt=null,ad=1e9;
    for(const b2 of builds){if(b2.dead||!isEnemy(t,b2.team))continue;const d=dist2(b2,ai.cc||builds[0]);if(d<ad){ad=d;airTgt=b2}}
    if(airTgt){
      for(const u of army){
        if(u.cat!=='air'||u.loiter||u.rearmT>0||u.attackTarget)continue;
        orderMove(u,airTgt.x+rand(-50,50),airTgt.y+rand(-50,50),'am');
      }
    }
  }
}
