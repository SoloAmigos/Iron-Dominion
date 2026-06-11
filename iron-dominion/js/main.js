'use strict';
/* ---------- hints ---------- */
function hasB(type){return builds.some(b=>b.team===0&&!b.dead&&b.built&&b.type===type)}
function checkHints(){
  if(hintStage===0&&gtime>5){
    if(FAC(0).noPower){toast('🏗️ Step 1 — select your Dozer, build a 📦 Supply Center (the Cartel needs no power!)');hintStage=2}
    else{toast('🏗️ Step 1 — select your Dozer, build a ⚡ Power Plant');hintStage=1}
  }
  else if(hintStage===1&&hasB('power')){toast('📦 Step 2 — build a Supply Center near the gold crates');hintStage=2}
  else if(hintStage===2&&hasB('supply')){toast('🪖 Step 3 — build a Barracks and train troops');hintStage=3}
  else if(hintStage===3&&hasB('barracks')){toast('🏭 Step 4 — a War Factory unlocks tanks + Airstrike');hintStage=4}
  else if(hintStage===4&&hasB('factory')){toast('⚔️ Destroy ALL enemy buildings to the north-east!');hintStage=5}
}

/* ---------- overlays ---------- */
function diffBtns(){
  return '<div class="dbtns">'+
    '<button class="dbtn easy" data-d="easy">EASY</button>'+
    '<button class="dbtn" data-d="normal">NORMAL</button>'+
    '<button class="dbtn hard" data-d="hard">HARD</button></div>';
}
function wireDiff(){
  for(const b of overlay.querySelectorAll('[data-d]'))b.onclick=()=>{ac();init(b.dataset.d)};
}
let chosenFac='vanguard';
function facCards(){
  let s='<div class="fgrid">';
  for(const k of FACKEYS){
    const F=FACTIONS[k];
    s+='<div class="fcard'+(k===chosenFac?' sel':'')+'" data-f="'+k+'" style="--fc:'+F.c+'">'+
      '<div class="fname">'+F.name+'</div><div class="ftag">'+F.tag+'</div></div>';
  }
  return s+'</div><div class="fdesc" id="fdesc">'+FACTIONS[chosenFac].desc+'</div>';
}
function wireFac(){
  for(const c of overlay.querySelectorAll('[data-f]'))c.onclick=()=>{
    chosenFac=c.dataset.f;SFX.click();
    for(const x of overlay.querySelectorAll('[data-f]'))x.classList.toggle('sel',x.dataset.f===chosenFac);
    const d=document.getElementById('fdesc');if(d)d.textContent=FACTIONS[chosenFac].desc;
  };
}
function showMenu(){
  state='menu';overlay.style.display='flex';
  overlay.innerHTML='<div class="panel">'+
    '<div class="eyebrow">REAL-TIME STRATEGY</div>'+
    '<h1>IRON <span>DOMINION</span></h1>'+
    '<div class="sub">Choose your faction, Commander:</div>'+
    facCards()+
    diffBtns()+
    '<div class="howto">'+
    '<b>🚜 Dozer</b> builds structures · <b>📦 Supply Center</b> earns cash via trucks<br>'+
    '<b>⚡ Power</b> keeps production fast and turrets online<br>'+
    '<b>Tap</b> select / command · <b>Drag</b> pan · <b>Pinch</b> zoom · minimap to jump<br>'+
    '<b>Hold finger</b> (or ⬚ button) then drag = box-select multiple units<br>'+
    '<b>🚜 button</b> jumps to your Dozers · <b>⚔ ARMY</b> selects all troops<br>'+
    '<b>💰 Market</b> = endless income · <b>🔬 Tech Lab</b> = upgrades · <b>☢️ Silo</b> = superweapon<br>'+
    '<b>⭐ Rank up</b> by destroying enemies — skill points unlock General powers<br>'+
    '<b>Powers</b>: 🔧 Repair · 🪂 Drop · ✈️ Strike · ☢️ Launch · Dozers can repair buildings<br>'+
    '<b>PC:</b> left-drag box select · right-click command · wheel zoom · WASD pan<br>'+
    '<b>🏆 Win:</b> destroy every enemy structure</div></div>';
  wireDiff();wireFac();
}
function showPause(){
  overlay.style.display='flex';
  overlay.innerHTML='<div class="panel"><div class="eyebrow">PAUSED</div><h1>IRON <span>DOMINION</span></h1>'+
    '<div class="dbtns"><button class="dbtn" id="resBtn">▶ RESUME</button>'+
    '<button class="dbtn hard" id="quitBtn">MAIN MENU</button></div></div>';
  document.getElementById('resBtn').onclick=()=>{overlay.style.display='none';state='play'};
  document.getElementById('quitBtn').onclick=showMenu;
}
function endGame(win){
  if(state!=='play')return;
  state=win?'win':'lose';
  SFX.boom(true);
  setTimeout(()=>{
    overlay.style.display='flex';
    overlay.innerHTML='<div class="panel"><div class="eyebrow">'+(win?'THE REGION IS OURS':'BASE LOST')+'</div>'+
      '<div class="bigres '+(win?'win':'lose')+'">'+(win?'VICTORY':'DEFEAT')+'</div>'+
      '<div class="sub">'+(win?'Every enemy structure lies in ruins, Commander.':'The '+FAC(1).name+' overran our position. Regroup and try again.')+'</div>'+
      '<div class="sub" style="margin-top:6px">Play again:</div>'+facCards()+diffBtns()+'</div>';
    wireDiff();wireFac();
  },win?900:1400);
}

/* ---------- init / loop ---------- */
function init(name){
  diffName=name;D=DIFF[name];
  const others=FACKEYS.filter(k=>k!==chosenFac);
  fac=[chosenFac,others[Math.random()*others.length|0]];
  TEAMC=[FAC(0).c,FAC(1).c];TEAMD=[FAC(0).d,FAC(1).d];
  strikeCdMax=FAC(0).strikeCd;strikeBombs=FAC(0).bombs;
  units=[];builds=[];projs=[];parts=[];planes=[];sel=[];placing=null;
  resetPowers();upg=[{w:0,a:0},{w:0,a:0}];shake=0;
  xp=[0,0];rank=[1,1];skp=[1,1];genOpen=false;
  money=[4000,4000];powerP=[0,0];powerU=[0,0];lowPow=[false,false];
  ids=1;gtime=0;fogT=0;powT=0;uiT=0;winT=3;aiT=1.5;miniT=0;sepT=0;
  underAttackCd=0;readyCd=0;hintStage=0;boxSel=null;boxStart=null;panMode=false;pinch=null;pts.clear();
  setSelMode(false);clearLP();dozI=-1;lastTapT=0;lastTapId=0;
  genWorld();buildGround();
  const pc=placeBuilding('command',0,4,31,true);
  const ec=placeBuilding('command',1,51,4,true);
  ai=makeAI();ai.cc=ec;ai.builtTypes.command=true;
  const dz=spawnUnit('dozer',0,pc.x,(pc.ty+pc.t.h)*TILE+34);
  spawnUnit('dozer',1,ec.x,(ec.ty+ec.t.h)*TILE+34);
  cam.x=pc.x;cam.y=pc.y;cam.z=clamp(Math.min(vw,vh)/620,.55,1);
  clampCam();
  sel=[dz];
  updateFog();recomputePower();renderMini();
  overlay.style.display='none';
  state='play';
  refreshPowers();updateRankBtn();updateHUD();updateCard();
  toast('🚜 '+dispName('u','dozer',0)+' ready — use the build menu below');
  toast('⚔ Enemy: '+FAC(1).name);
  toast('⭐ Tap the star — spend your first skill point on a General power');
}
let lastT=0;
function frame(ts){
  requestAnimationFrame(frame);
  const dt=Math.min(.05,(ts-lastT)/1000||0);lastT=ts;
  if(state==='play'){
    gtime+=dt;
    for(const u of units)updateUnit(u,dt);
    if(units.some(u=>u.dead))units=units.filter(u=>!u.dead);
    for(const b of builds)updateBuilding(b,dt);
    if(builds.some(b=>b.dead))builds=builds.filter(b=>!b.dead);
    updateProjs(dt);updateParts(dt);updatePlanes(dt);
    separation();
    fogT-=dt;if(fogT<=0){fogT=.25;updateFog()}
    powT-=dt;if(powT<=0){powT=.5;recomputePower()}
    aiT-=dt;if(aiT<=0){aiT=1;aiTick(1)}
    for(const k in pw){
      const P=pw[k];
      if(k!=='nuke'&&P.on&&P.cd>0){P.cd-=dt;if(P.cd<=0){P.cd=0;toast(POWERS[k].ic+' '+POWERS[k].nm+' ready');SFX.done()}}
    }
    shake=Math.max(0,shake-dt*1.4);
    underAttackCd=Math.max(0,underAttackCd-dt);
    readyCd=Math.max(0,readyCd-dt);
    winT-=dt;
    if(winT<=0){
      winT=1;
      let pl=0,en=0;
      for(const b of builds){if(b.team===0)pl++;else en++}
      if(en===0)endGame(true);
      else if(pl===0)endGame(false);
    }
    uiT-=dt;if(uiT<=0){uiT=.3;updateHUD();refreshCard();checkHints()}
    miniT-=dt;if(miniT<=0){miniT=.35;renderMini()}
    const ps=620/cam.z*dt;let kx=0,ky=0;
    if(keys['w']||keys['arrowup'])ky-=1;
    if(keys['s']||keys['arrowdown'])ky+=1;
    if(keys['a']||keys['arrowleft'])kx-=1;
    if(keys['d']||keys['arrowright'])kx+=1;
    if(kx||ky){cam.x+=kx*ps;cam.y+=ky*ps;clampCam()}
  }
  if(state!=='menu')render();
}
function resize(){
  vw=innerWidth;vh=innerHeight;
  dpr=Math.min(devicePixelRatio||1,2);
  cv.width=vw*dpr;cv.height=vh*dpr;
  cv.style.width=vw+'px';cv.style.height=vh+'px';
  clampCam();
}
addEventListener('resize',resize);
resize();
showMenu();
requestAnimationFrame(frame);
