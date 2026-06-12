'use strict';
/* ---------- PWA install prompt ---------- */
let _installPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();_installPrompt=e;const ib=document.getElementById('installBtn');if(ib)ib.style.display=''});
window.addEventListener('appinstalled',()=>{_installPrompt=null});

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
let chosenGenId='std';
let chosenMapKey='desert';
let chosenGens={vanguard:'std',crimson:'std',scorpion:'std',northwind:'std'};

function genChips(fk){
  const gs=GENERALS[fk]||[];
  if(!gs||gs.length<=1)return '';
  let s='<div style="margin:4px 0 2px;font-size:11px;opacity:.7">General:</div><div style="display:flex;gap:6px;flex-wrap:wrap">';
  for(const g of gs){
    const sel=chosenGens[fk]===g.id;
    s+='<button class="dbtn'+(sel?' sel':'')+'" data-genfk="'+fk+'" data-genid="'+g.id+'" style="font-size:11px;padding:4px 8px" title="'+g.desc+'">'+g.nm+'</button>';
  }
  return s+'</div>';
}
function wireGens(){
  for(const b of overlay.querySelectorAll('[data-genid]'))b.onclick=()=>{
    const fk=b.dataset.genfk,id=b.dataset.genid;
    chosenGens[fk]=id;SFX.click();
    for(const x of overlay.querySelectorAll('[data-genfk="'+fk+'"]'))x.classList.toggle('sel',x.dataset.genid===id);
    const d=document.getElementById('fdesc');if(d)d.textContent=FACTIONS[chosenFac].desc+' | General: '+GENERALS[fk].find(g=>g.id===id).desc;
  };
}

function mapChips(){
  let s='<div style="margin:8px 0 2px;font-size:11px;opacity:.7">Map:</div><div style="display:flex;gap:6px;flex-wrap:wrap">';
  for(const k of Object.keys(MAPS)){
    const sel=chosenMapKey===k;
    s+='<button class="dbtn'+(sel?' sel':'')+'" data-map="'+k+'" style="font-size:11px;padding:4px 10px">'+k.charAt(0).toUpperCase()+k.slice(1)+'</button>';
  }
  return s+'</div>';
}
function wireMaps(){
  for(const b of overlay.querySelectorAll('[data-map]'))b.onclick=()=>{
    chosenMapKey=b.dataset.map;SFX.click();
    for(const x of overlay.querySelectorAll('[data-map]'))x.classList.toggle('sel',x.dataset.map===chosenMapKey);
  };
}

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
    // Update gen chips for selected faction
    const gc=document.getElementById('genChipsArea');
    if(gc)gc.innerHTML=genChips(chosenFac);
    wireGens();
  };
}
function showMenu(){
  state='menu';overlay.style.display='flex';
  overlay.innerHTML='<div class="panel">'+
    '<div class="eyebrow">REAL-TIME STRATEGY</div>'+
    '<h1>IRON <span>DOMINION</span></h1>'+
    '<div class="sub" style="margin-bottom:6px">Choose your faction, Commander:</div>'+
    facCards()+
    '<div id="genChipsArea">'+genChips(chosenFac)+'</div>'+
    mapChips()+
    diffBtns()+
    '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:0">'+
    '<button class="dbtn" id="campaignBtn" style="background:#4a3800;border-color:#c9a23a;color:#ffd95e;min-width:140px">📋 CAMPAIGN</button>'+
    '<button class="dbtn install" id="installBtn">📲 Install App</button>'+
    '<button class="dbtn" id="howtoBtn" style="min-width:120px;font-size:13px">❓ How to Play</button>'+
    '</div>'+
    '<div class="howto" id="howtoBox">'+
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
  wireDiff();wireFac();wireGens();wireMaps();
  const cb=document.getElementById('campaignBtn');
  if(cb)cb.onclick=()=>{if(typeof showCampaignMenu==='function')showCampaignMenu();else toast('Campaign not available')};
  const hb=document.getElementById('howtoBtn');
  if(hb)hb.onclick=()=>{const box=document.getElementById('howtoBox');if(box){box.classList.toggle('open');hb.textContent=box.classList.contains('open')?'✖ Close':'❓ How to Play'}};
  const ib=document.getElementById('installBtn');
  if(ib){
    if(_installPrompt){ib.style.display='';ib.onclick=()=>{_installPrompt.prompt();_installPrompt.userChoice.then(()=>{_installPrompt=null;ib.style.display='none'})}}
    else ib.style.display='none';
  }
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
  // Apply chosen generals
  gens=[chosenGens[chosenFac]||'std','std'];
  // Set up map
  chosenMap=chosenMapKey;
  MAP=MAPS[chosenMap];
  setMapDims(MAP.w,MAP.h);

  // Seed RNG
  matchSeed=Date.now()&0x7fffffff;setSeed(matchSeed);simFrame=0;simAcc=0;

  units=[];builds=[];planes=[];sel=[];placing=null;scraps=[];
  // Re-allocate typed arrays for new map size
  blocked=new Uint8Array(MAPW*MAPH);vis=new Uint8Array(MAPW*MAPH);
  resetPowers();upg=[{w:0,a:0,mk:0,cp:0},{w:0,a:0,mk:0,cp:0}];shake=0;
  xp=[0,0];rank=[1,1];skp=[1,1];genOpen=false;
  money=[4000,4000];powerP=[0,0];powerU=[0,0];lowPow=[false,false];
  ids=1;gtime=0;fogT=0;powT=0;uiT=0;winT=3;aiT=1.5;miniT=0;sepT=0;
  underAttackCd=0;readyCd=0;hintStage=0;boxSel=null;boxStart=null;panMode=false;pinch=null;pts.clear();
  setSelMode(false);clearLP();dozI=-1;lastTapT=0;lastTapId=0;
  // Init object pools
  initPools();
  shInit();
  genWorld(chosenMap);buildGround();
  const sp0=MAP.spawns[0],sp1=MAP.spawns[1];
  const pc=placeBuilding('command',0,sp0[0],sp0[1],true);
  const ec=placeBuilding('command',1,sp1[0],sp1[1],true);
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
  toast('⚔️ '+GENMOD(0).nm+' doctrine active');
}

/* ---------- fixed-timestep sim ---------- */
function simStep(){
  drainInputs();
  // Snapshot positions for render interpolation
  for(const u of units)if(!u.dead){u.px=u.x;u.py=u.y}
  for(const b of builds)if(!b.dead){b.px=b.x;b.py=b.y}

  const dt=SIM_DT;
  gtime+=dt;

  // Rebuild spatial hash
  shClear();
  for(const u of units)if(!u.dead)shInsert(u);
  for(const b of builds)if(!b.dead)shInsert(b);

  for(const u of units)updateUnit(u,dt);
  if(units.some(u=>u.dead))units=units.filter(u=>!u.dead);
  for(const b of builds)updateBuilding(b,dt);
  if(builds.some(b=>b.dead))builds=builds.filter(b=>!b.dead);
  updateProjs(dt);updateParts(dt);updatePlanes(dt);
  // Expire scrap tokens
  for(let i=scraps.length-1;i>=0;i--){scraps[i].life-=dt;if(scraps[i].life<=0)scraps.splice(i,1)}
  separation(dt);
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
    for(const b of builds){if(b.team===0)pl++;else if(b.team===1)en++}
    if(en===0&&!campaign)endGame(true);
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
  // Campaign update
  if(campaign&&typeof updateCampaign==='function')updateCampaign();
  simFrame++;
}

let lastTs=0;
function frame(ts){
  requestAnimationFrame(frame);
  if(state!=='play'){render();return}
  const dtReal=Math.min((ts-(lastTs||ts))/1000,0.1);
  lastTs=ts;
  simAcc+=dtReal;
  let steps=0;
  while(simAcc>=SIM_DT&&steps<6){simStep();simAcc-=SIM_DT;steps++}
  if(steps>=6)simAcc=0; // spiral of death protection
  renderAlpha=simAcc/SIM_DT;
  render();
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
