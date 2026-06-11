'use strict';
/* ================= PROJECTILES / PARTICLES / PLANES ================= */
function updateProjs(dt){
  for(let i=projs.length-1;i>=0;i--){
    const p=projs[i];
    if(p.kind==='rocket'){
      if(p.target&&!p.target.dead){p.dx=p.target.x;p.dy=p.target.y}
      const dx=p.dx-p.x,dy=p.dy-p.y,d=Math.hypot(dx,dy),st=p.spd*dt;
      if(d<=st+6){impact(p);projs.splice(i,1);continue}
      p.x+=dx/d*st;p.y+=dy/d*st;p.a=Math.atan2(dy,dx);
      if(Math.random()<.5)parts.push({k:'smoke',x:p.x,y:p.y,vx:0,vy:-6,life:.35,max:.35,s:3});
    }else{
      p.t+=dt/p.dur;
      if(p.t>=1){impact(p);projs.splice(i,1);continue}
      p.x=p.sx+(p.dx-p.sx)*p.t;p.y=p.sy+(p.dy-p.sy)*p.t;
    }
  }
}
function updateParts(dt){
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i];
    p.life-=dt;
    if(p.life<=0){parts.splice(i,1);continue}
    if(p.vx!==undefined){p.x+=p.vx*dt;p.y+=p.vy*dt}
    if(p.k==='spark')p.vy+=160*dt;
    if(p.k==='deb'){p.vy+=300*dt;p.rot+=p.vr*dt}
  }
  if(parts.length>420)parts.splice(0,parts.length-420);
}
function buyUpgrade(team,id){
  const U=UPGS[id];if(!U)return false;
  if(upg[team][U.f]>=U.lv)return false;
  if(U.need){const N=UPGS[U.need];if(upg[team][N.f]<N.lv)return false}
  if(money[team]<U.cost)return false;
  if(!builds.some(b=>!b.dead&&b.built&&b.team===team&&b.t.lab))return false;
  money[team]-=U.cost;
  if(U.f==='a'){
    const old=upArm(team);upg[team].a=U.lv;const nw=upArm(team);
    for(const u of units)if(!u.dead&&u.team===team){u.maxhp=Math.round(u.maxhp/old*nw);u.hp=Math.min(u.maxhp,Math.round(u.hp/old*nw))}
  }else upg[team][U.f]=U.lv;
  if(team===0){toast(U.ic+' '+U.nm+' research complete!');SFX.done();updateCard();updateHUD()}
  return true;
}
function doRepair(x,y){
  let n=0;
  for(const u of units)if(!u.dead&&u.team===0&&u.hp<u.maxhp&&Math.hypot(u.x-x,u.y-y)<170){u.hp=Math.min(u.maxhp,u.hp+u.maxhp*.5);n++;parts.push({k:'heal',x:u.x,y:u.y,life:.6,max:.6,s:14})}
  for(const b of builds)if(!b.dead&&b.built&&b.team===0&&b.hp<b.maxhp&&Math.hypot(b.x-x,b.y-y)<190){b.hp=Math.min(b.maxhp,b.hp+b.maxhp*.3);n++;parts.push({k:'heal',x:b.x,y:b.y,life:.7,max:.7,s:26})}
  parts.push({k:'ring',x,y,life:.5,max:.5,s:170,c:'#7dff9a'});
  pw.repair.cd=POWERS.repair.cd;SFX.heal();
  toast(n?'🔧 Field repairs complete':'🔧 Nothing damaged there');
  updateHUD();
}
function doDrop(x,y){
  planes.push({x:x-1150,y,tx:x,vx:520,dropped:false,kind:'drop'});
  pw.drop.cd=POWERS.drop.cd;
  SFX.jet();toast('🪂 Reinforcements inbound!');
  updateHUD();
}
function launchStrike(x,y){
  pw.strike.cd=strikeCdMax;
  planes.push({x:x-1150,y,tx:x,vx:560,dropped:false,kind:'strike'});
  SFX.jet();toast('✈️ Airstrike inbound!');
  updateHUD();
}
function fireNukeFrom(s,x,y,team){
  s.charge=0;
  projs.push({kind:'arc',x:s.x,y:s.y,sx:s.x,sy:s.y,dx:x,dy:y,t:0,dur:2.4,spd:300,target:null,w:WPN.nuke,team,nuke:true});
  parts.push({k:'flash',x:s.x,y:s.y,life:.2,max:.2,s:46});
  for(let i=0;i<6;i++)parts.push({k:'smoke',x:s.x+rand(-14,14),y:s.y+rand(-4,20),vx:rand(-10,10),vy:rand(-24,-6),life:rand(.6,1.3),max:1.3,s:rand(9,17)});
  SFX.jet();
  toast(team===0?'☢️ MISSILE AWAY!':'☢️ WARNING — enemy missile launch detected!');
  if(team===1)shake=Math.max(shake,.5);
}
function launchNuke(x,y){
  const s=builds.find(b=>!b.dead&&b.built&&b.team===0&&b.t.silo&&(b.charge||0)>=1);
  if(!s){SFX.err();return}
  fireNukeFrom(s,x,y,0);
  updateHUD();
}
function updatePlanes(dt){
  for(let i=planes.length-1;i>=0;i--){
    const p=planes[i];
    p.x+=p.vx*dt;
    if(Math.random()<.6)parts.push({k:'smoke',x:p.x-26,y:p.y+rand(-4,4),vx:-40,vy:0,life:.4,max:.4,s:3});
    if(!p.dropped&&p.kind==='drop'&&p.x>=p.tx-60){
      p.dropped=true;
      for(let k=0;k<3;k++){
        const u=spawnUnit(k===2?'rocket':'ranger',0,p.tx+rand(-34,34),p.y+rand(-28,28));
        parts.push({k:'chute',x:u.x,y:u.y-26,life:.85,max:.85,s:13});
        parts.push({k:'dust',x:u.x,y:u.y,life:.4,max:.4,s:10});
      }
      SFX.done();
    }
    if(!p.dropped&&p.kind!=='drop'&&p.x>=p.tx-150){
      p.dropped=true;SFX.jet();
      for(let k=0;k<strikeBombs;k++){
        const ox=rand(-55,55),oy=rand(-45,45);
        projs.push({kind:'arc',x:p.x,y:p.y,sx:p.x,sy:p.y,dx:p.tx+ox,dy:p.y+oy,t:0,dur:.55+k*.16,spd:300,target:null,w:WPN.bomb,team:0});
      }
    }
    if(p.x>p.tx+1500)planes.splice(i,1);
  }
}
