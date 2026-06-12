'use strict';
/* ================= ENEMY AI ================= */
function makeAI(){
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
    {b:'samsite',o:[0,13]},
    {b:'airfield',o:[9,7]},
  ];
  if(D.silo)bo.push({b:'silo',o:[7,9]},{b:'power',o:[-2,13]});
  return{bo,boi:0,builtTypes:{},waveT:D.first,rebT:6,defT:0,upT:25,cc:null};
}
function aiCountBuild(type){let n=0;for(const b of builds)if(!b.dead&&b.team===1&&b.type===type)n++;return n}
function aiBuildAt(type,off){
  if(isLocked(type,1))return false;
  const cc=ai.cc&&!ai.cc.dead?ai.cc:builds.find(b=>b.team===1&&!b.dead);
  if(!cc)return false;
  let tx=cc.tx+off[0],ty=cc.ty+off[1];
  if(!canPlace(type,tx,ty,1)){
    let ok=false;
    for(let r=1;r<=7&&!ok;r++)for(let dy=-r;dy<=r&&!ok;dy++)for(let dx=-r;dx<=r&&!ok;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
      if(canPlace(type,tx+dx,ty+dy,1)){tx+=dx;ty+=dy;ok=true}
    }
    if(!ok)return false;
  }
  money[1]-=costOf('b',type,1);
  const site=placeBuilding(type,1,tx,ty,false);
  ai.builtTypes[type]=true;
  return site;
}
function aiTick(tick){
  money[1]+=D.trickle*tick;
  const sites=builds.filter(b=>b.team===1&&!b.dead&&!b.built&&!b.isHole);
  const dozers=units.filter(u=>u.team===1&&!u.dead&&u.type==='dozer');
  for(const s of sites){
    if(dozers.some(d=>d.site===s))continue;
    const free=dozers.find(d=>!d.site);
    if(free){free.site=s;free.path=null}
  }
  let cur=ai.bo[ai.boi];
  while(cur&&FAC(1).noPower&&cur.b==='power'){ai.boi++;cur=ai.bo[ai.boi]}
  if(cur&&money[1]>=costOf('b',cur.b,1)&&dozers.length&&sites.length<=dozers.length){
    if(aiBuildAt(cur.b,cur.o)!==false)ai.boi++;
    else ai.boi++;
  }
  if(lowPow[1]&&money[1]>=costOf('b','power',1)&&!sites.some(s=>s.type==='power'))aiBuildAt('power',[rand(-7,5)|0,rand(-2,10)|0]);
  ai.rebT-=tick;
  if(ai.rebT<=0){
    ai.rebT=6;
    for(const k of['power','supply','barracks','factory']){
      if(k==='power'&&FAC(1).noPower)continue;
      if(ai.builtTypes[k]&&aiCountBuild(k)===0&&money[1]>=costOf('b',k,1)){aiBuildAt(k,[rand(-6,4)|0,rand(0,10)|0]);break}
    }
    const wantDz=(sites.length>1||gtime>90)?2:1;
    if(dozers.length<wantDz&&money[1]>=costOf('u','dozer',1)){
      const cc=builds.find(b=>b.team===1&&!b.dead&&b.built&&b.t.trains&&b.t.trains.includes('dozer'));
      if(cc&&cc.queue.length<1){money[1]-=costOf('u','dozer',1);cc.queue.push({type:'dozer',p:0})}
    }
  }
  ai.upT-=tick;
  if(ai.upT<=0){
    ai.upT=6;
    if(money[1]>1800)for(const id of['w1','a1','w2','a2','mkt','cap'])if(buyUpgrade(1,id))break;
  }
  if(!piles.some(p=>p.amt>0)&&aiCountBuild('market')<3&&money[1]>=costOf('b','market',1)&&!sites.some(s2=>s2.type==='market'))
    aiBuildAt('market',[rand(-7,7)|0,rand(-2,11)|0]);
  for(const b of builds){
    if(b.dead||!b.built||b.team!==1||!b.t.silo||(b.charge||0)<1)continue;
    let tgt=null,bs=-1;
    for(const pb of builds){
      if(pb.dead||pb.team!==0)continue;
      let sc=pb.maxhp;
      for(const pb2 of builds)if(!pb2.dead&&pb2.team===0&&dist2(pb,pb2)<170)sc+=pb2.maxhp*.5;
      if(sc>bs){bs=sc;tgt=pb}
    }
    if(!tgt){const pu=units.filter(u=>!u.dead&&u.team===0);if(pu.length)tgt=pu[0]}
    if(tgt)fireNukeFrom(b,tgt.x+rand(-20,20),tgt.y+rand(-20,20),1);
  }
  // Airfield production
  for(const b of builds){
    if(b.dead||!b.built||b.team!==1||b.type!=='airfield'||b.queue.length>=2)continue;
    if(isLocked('raptor',1))continue;
    const c=costOf('u','raptor',1);
    const padAvail=b.padUnits&&b.padUnits.some(p=>p===null||p===undefined);
    if(padAvail&&money[1]>=c){money[1]-=c;b.queue.push({type:'raptor',p:0})}
  }
  const myUnits=units.filter(u=>u.team===1&&!u.dead);
  const trucks=myUnits.filter(u=>u.type==='truck').length;
  const army=myUnits.filter(u=>COMBAT.includes(u.type));
  const supplies=aiCountBuild('supply');
  const cap=D.cap+Math.floor(gtime/240)*4;
  for(const b of builds){
    if(b.dead||!b.built||b.team!==1||!b.t.trains||b.queue.length>=2)continue;
    if(b.type==='airfield')continue; // handled above
    const tc=costOf('u','truck',1);
    if(b.type==='supply'&&trucks<Math.min(3,supplies*2)&&money[1]>=tc){money[1]-=tc;b.queue.push({type:'truck',p:0});continue}
    if(army.length>=cap)continue;
    const sigs=FAC(1).sigs;
    if(b.type==='factory'){
      let pick=Math.random()<.3?'arty':'tank';
      if(isLocked(pick,1))pick='arty';
      if(isLocked(pick,1))pick=null;
      const fs=sigs.filter(g=>g.at==='factory');
      if(fs.length&&Math.random()<.35){const cand=fs[Math.floor(Math.random()*fs.length)].unit;if(!isLocked(cand,1))pick=cand}
      if(pick){const c=costOf('u',pick,1);if(money[1]>=c){money[1]-=c;b.queue.push({type:pick,p:0})}}
    }else if(b.type==='barracks'){
      let pick=Math.random()<.45?'rocket':'ranger';
      if(isLocked(pick,1))pick='ranger';
      const bs2=sigs.filter(g=>g.at==='barracks');
      if(bs2.length&&Math.random()<.4){const cand=bs2[Math.floor(Math.random()*bs2.length)].unit;if(!isLocked(cand,1))pick=cand}
      const c=costOf('u',pick,1);
      if(money[1]>=c&&Math.random()<.8){money[1]-=c;b.queue.push({type:pick,p:0})}
    }
  }
  ai.defT-=tick;
  if(ai.defT<=0){
    ai.defT=2;
    let threat=null;
    for(const u of units){
      if(u.dead||u.team!==0||!COMBAT.includes(u.type))continue;
      for(const b of builds)if(!b.dead&&b.team===1&&dist2(u,b)<300){threat=u;break}
      if(threat)break;
    }
    if(threat)for(const u of army)if(!u.attackTarget&&dist2(u,threat)<700)orderMove(u,threat.x,threat.y,'am');
  }
  ai.waveT-=tick;
  if(ai.waveT<=0){
    ai.waveT=D.wave;
    if(army.length>=5){
      let tgt=null,bd=1e9;
      const ref=ai.cc&&!ai.cc.dead?ai.cc:{x:WW-200,y:200};
      for(const b of builds){
        if(b.dead||b.team!==0)continue;
        // GLA holes get priority for purge
        const d=dist2(b,ref)*(b.isHole?.2:1);
        if(d<bd){bd=d;tgt=b}
      }
      if(tgt){
        const sorted=army.slice().sort((a,b2)=>dist2(a,ref)-dist2(b2,ref));
        const guards=Math.ceil(sorted.length*.22);
        for(let i=guards;i<sorted.length;i++){
          const[ox,oy]=formOff(i-guards);
          orderMove(sorted[i],tgt.x+ox,tgt.y+oy,'am');
        }
      }
    }
  }
}
