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
  else if(hintStage===4&&hasB('factory')){toast('⚔️ Destroy ALL enemy buildings!');hintStage=5}
}

/* ---------- menu state ---------- */
let chosenFac='vanguard';
let chosenGenId='std';
let chosenMapKey='desert';
let chosenMapSize='s2';
let chosenSpawnIdx=0;
let chosenGens={vanguard:'std',crimson:'std',scorpion:'std',northwind:'std'};
let slotFac=[]; // per-slot chosen faction, null/'rnd' = random

/* ---------- screen helpers ---------- */
function uiClick(){SFX.click()}
function panel(inner){return '<div class="panel">'+inner+'</div>'}
function eyebrow(t){return '<div class="scr-title">'+t+'</div>'}

function genChips(fk){
  const gs=GENERALS[fk]||[];
  if(!gs||gs.length<=1)return '';
  let s='<div style="margin:6px 0 2px;font-size:11px;opacity:.7">General:</div><div style="display:flex;gap:6px;flex-wrap:wrap">';
  for(const g of gs){
    const sel=chosenGens[fk]===g.id;
    s+='<button class="dbtn'+(sel?' sel':'')+'" data-genfk="'+fk+'" data-genid="'+g.id+'" style="font-size:11px;padding:4px 8px" title="'+g.desc+'">'+g.nm+'</button>';
  }
  return s+'</div>';
}
function wireGens(){
  for(const b of overlay.querySelectorAll('[data-genid]'))b.onclick=()=>{
    const fk=b.dataset.genfk,id=b.dataset.genid;
    chosenGens[fk]=id;uiClick();
    for(const x of overlay.querySelectorAll('[data-genfk="'+fk+'"]'))x.classList.toggle('sel',x.dataset.genid===id);
    const d=document.getElementById('fdesc');if(d)d.textContent=FACTIONS[chosenFac].desc+' | '+GENERALS[fk].find(g=>g.id===id).desc;
  };
}

/* ===== SCREEN 1: MAIN MENU ===== */
function showMenu(){showMainMenu()}
function showMainMenu(){
  state='menu';overlay.style.display='flex';
  overlay.innerHTML=panel(
    eyebrow('REAL-TIME STRATEGY')+
    '<h1>IRON <span>DOMINION</span></h1>'+
    '<div class="sub" style="margin-bottom:20px">Command. Conquer. Dominate.</div>'+
    '<button class="big-btn arcade" id="playBtn">▶ PLAY</button>'+
    '<button class="big-btn" id="settingsBtn" style="font-size:14px;padding:12px">⚙ SETTINGS</button>'+
    '<button class="dbtn install" id="installBtn" style="width:100%;margin-top:8px">📲 Install App</button>'+
    '<button class="dbtn" id="howtoBtn" style="width:100%;margin-top:8px;font-size:13px">❓ How to Play</button>'+
    '<div class="howto" id="howtoBox">'+
    '<b>🚜 Dozer</b> builds structures · <b>📦 Supply Center</b> earns cash via trucks<br>'+
    '<b>⚡ Power</b> keeps production fast and turrets online<br>'+
    '<b>Tap</b> select / command · <b>Drag</b> pan · <b>Pinch</b> zoom · minimap to jump<br>'+
    '<b>Hold finger</b> then drag = box-select · <b>🚜</b> cycles dozers · <b>⚔ ARMY</b> selects all<br>'+
    '<b>💰 Market</b> = passive income · <b>🔬 Tech Lab</b> = upgrades · <b>☢️ Silo</b> = superweapon<br>'+
    '<b>⭐ Rank up</b> → skill points → unlock General powers (Repair/Drop/Strike/Nuke)<br>'+
    '<b>🏆 Win:</b> destroy every enemy structure</div>'+
    '</div>'
  );
  document.getElementById('playBtn').onclick=()=>{uiClick();showModeTypeSelect()};
  document.getElementById('settingsBtn').onclick=()=>{uiClick();showSettings()};
  const hb=document.getElementById('howtoBtn');
  hb.onclick=()=>{const box=document.getElementById('howtoBox');if(box){box.classList.toggle('open');hb.textContent=box.classList.contains('open')?'✖ Close':'❓ How to Play'}};
  const ib=document.getElementById('installBtn');
  if(ib){if(_installPrompt){ib.style.display='';ib.onclick=()=>{_installPrompt.prompt();_installPrompt.userChoice.then(()=>{_installPrompt=null;ib.style.display='none'})}}else ib.style.display='none'}
}

/* ===== SCREEN 1b: SETTINGS ===== */
function showSettings(){
  overlay.innerHTML=panel(
    eyebrow('IRON DOMINION')+
    '<h1 style="font-size:clamp(22px,6vw,36px)">SETTINGS</h1>'+
    '<div class="dbtns" style="flex-direction:column;gap:10px">'+
    '<button class="dbtn" id="muteSet" style="width:100%">'+(window._muted?'🔇 Sound: OFF':'🔊 Sound: ON')+'</button>'+
    '</div>'+
    '<div class="nav-row"><button class="dbtn back-btn" id="backBtn">← BACK</button></div>'
  );
  document.getElementById('backBtn').onclick=()=>{uiClick();showMainMenu()};
  document.getElementById('muteSet').onclick=()=>{
    uiClick();window._muted=!window._muted;
    document.getElementById('muteSet').textContent=window._muted?'🔇 Sound: OFF':'🔊 Sound: ON';
    const mb=document.getElementById('muteBtn');if(mb)mb.textContent=window._muted?'🔇':'🔊';
  };
}

/* ===== SCREEN 2: ARCADE or CAMPAIGN ===== */
function showModeTypeSelect(){
  overlay.innerHTML=panel(
    eyebrow('IRON DOMINION')+
    '<h1 style="font-size:clamp(22px,6vw,36px)">PLAY</h1>'+
    '<div style="margin-top:16px">'+
    '<button class="big-btn arcade" id="arcadeBtn">🎮 ARCADE<br><span style="font-size:12px;font-weight:400;opacity:.8">Skirmish vs AI — choose your rules</span></button>'+
    '<button class="big-btn campaign" id="campBtn">📋 CAMPAIGN<br><span style="font-size:12px;font-weight:400;opacity:.8">Story missions with objectives</span></button>'+
    '</div>'+
    '<div class="nav-row"><button class="dbtn back-btn" id="backBtn">← BACK</button></div>'
  );
  document.getElementById('arcadeBtn').onclick=()=>{uiClick();showFactionSelect()};
  document.getElementById('campBtn').onclick=()=>{uiClick();if(typeof showCampaignMenu==='function')showCampaignMenu()};
  document.getElementById('backBtn').onclick=()=>{uiClick();showMainMenu()};
}

/* ===== SCREEN 3: FACTION SELECT ===== */
function showFactionSelect(){
  let s='<div class="fgrid2">';
  for(const k of FACKEYS){
    const F=FACTIONS[k];
    s+='<div class="fcard2'+(k===chosenFac?' sel':'')+'" data-f="'+k+'" style="--fc:'+F.c+'">'+
      '<div class="fname">'+F.name+'</div><div class="ftag">'+F.tag+'</div></div>';
  }
  s+='</div>';
  overlay.innerHTML=panel(
    eyebrow('ARCADE — STEP 1 OF 2')+
    '<h1 style="font-size:clamp(18px,5vw,30px)">CHOOSE FACTION</h1>'+
    s+
    '<div class="fdesc" id="fdesc">'+FACTIONS[chosenFac].desc+'</div>'+
    '<div id="genChipsArea" style="margin-top:6px">'+genChips(chosenFac)+'</div>'+
    '<div class="nav-row">'+
    '<button class="dbtn back-btn" id="backBtn">← BACK</button>'+
    '<button class="dbtn next-btn" id="nextBtn">NEXT →</button>'+
    '</div>'
  );
  for(const c of overlay.querySelectorAll('[data-f]'))c.onclick=()=>{
    chosenFac=c.dataset.f;uiClick();
    for(const x of overlay.querySelectorAll('[data-f]'))x.classList.toggle('sel',x.dataset.f===chosenFac);
    const d=document.getElementById('fdesc');if(d)d.textContent=FACTIONS[chosenFac].desc;
    const gc=document.getElementById('genChipsArea');if(gc){gc.innerHTML=genChips(chosenFac);wireGens()}
  };
  wireGens();
  document.getElementById('backBtn').onclick=()=>{uiClick();showModeTypeSelect()};
  document.getElementById('nextBtn').onclick=()=>{uiClick();showLobby()};
}

/* ===== SCREEN 4: MATCH SETUP (map + size + slots) ===== */
const _TEAM_LETTERS='ABCDEFGH';
const _TYPE_LABELS={easy:'🤖 Easy',medium:'🤖 Med',hard:'🤖 Hard'};
const _TYPES_CYCLE=['easy','medium','hard'];
const _MAP_SIZES=[['s2','Small'],['s4','Medium'],['s8','Large']];

function _spawnLabel(sp,mw,mh){
  const xf=sp[0]/mw,yf=sp[1]/mh;
  return (yf<0.4?'Top':yf>0.6?'Bottom':'Mid')+'-'+(xf<0.4?'Left':xf>0.6?'Right':'Center');
}

function showLobby(){
  // Sync arrays to current numSlots
  slotType[0]='human';
  while(slotType.length<numSlots)slotType.push('medium');
  slotType.length=numSlots;
  while(slotAlliance.length<numSlots)slotAlliance.push(slotAlliance.length);
  slotAlliance.length=numSlots;

  // Clamp spawn index to available spawns for this map/slot combo
  const _mapDef=(MAPS[chosenMapKey]||MAPS.desert)[chosenMapSize||'s2']||MAPS.desert.s2;
  const _spawnMax=Math.min((_mapDef.spawns||[]).length,numSlots)-1;
  if(chosenSpawnIdx>_spawnMax)chosenSpawnIdx=0;

  let mapS='<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:4px 0 2px">';
  for(const k of Object.keys(MAPS))
    mapS+='<button class="dbtn'+(chosenMapKey===k?' sel':'')+'" data-map="'+k+'" style="font-size:12px;padding:5px 12px">'+k.charAt(0).toUpperCase()+k.slice(1)+'</button>';
  mapS+='</div>';

  let sizeS='<div style="display:flex;gap:6px;justify-content:center;margin:2px 0 4px">';
  for(const[k,label]of _MAP_SIZES)
    sizeS+='<button class="dbtn'+(chosenMapSize===k?' sel':'')+'" data-sz="'+k+'" style="font-size:11px;padding:4px 10px">'+label+'</button>';
  sizeS+='</div>';

  // Spawn selector — one button per available spawn position
  let spawnS='<div style="display:flex;gap:5px;align-items:center;justify-content:center;margin:2px 0 8px;flex-wrap:wrap">';
  spawnS+='<span style="font-size:10px;color:#8aaa80;letter-spacing:1px">YOUR START:</span>';
  const _mw=_mapDef.w||60,_mh=_mapDef.h||40;
  for(let si=0;si<Math.min((_mapDef.spawns||[]).length,numSlots);si++){
    const lbl=_spawnLabel(_mapDef.spawns[si],_mw,_mh);
    spawnS+='<button class="dbtn'+(chosenSpawnIdx===si?' sel':'')+'" data-sp="'+si+'" style="font-size:10px;padding:3px 9px">'+lbl+'</button>';
  }
  spawnS+='</div>';

  while(slotFac.length<numSlots)slotFac.push('rnd');
  slotFac.length=numSlots;
  const _FAC_CYCLE=['rnd',...FACKEYS];
  function _facLabel(f){return f==='rnd'?'❓ Rnd':FACTIONS[f].name.split(' ')[0]}

  let rows='<div class="lobby-slots">';
  for(let i=0;i<numSlots;i++){
    const col=ALL_TEAMC[i%8];
    const letter=_TEAM_LETTERS[slotAlliance[i]%8];
    const isHuman=slotType[i]==='human';
    rows+='<div class="lslot">'+
      '<span class="lslot-dot" style="background:'+col+'">'+(i+1)+'</span>'+
      (isHuman
        ?'<span class="lslot-team-fixed">Team '+letter+'</span>'
        :'<button class="dbtn lslot-team" data-ti="'+i+'">Team '+letter+'</button>')+
      (isHuman
        ?'<span class="lslot-you">👤 YOU</span>'
        :'<button class="dbtn lslot-type" data-si="'+i+'">'+_TYPE_LABELS[slotType[i]]+'</button>')+
      (isHuman?''
        :'<button class="dbtn lslot-fac" data-fi="'+i+'" style="font-size:10px;padding:3px 7px;min-width:54px">'+_facLabel(slotFac[i]||'rnd')+'</button>')+
      '</div>';
  }
  rows+='</div>';

  overlay.innerHTML=panel(
    eyebrow('ARCADE — STEP 2 OF 2')+
    '<h1 style="font-size:clamp(16px,5vw,26px);margin-bottom:4px">MATCH SETUP</h1>'+
    mapS+sizeS+
    '<canvas id="mapPrev" width="240" height="120" style="display:block;margin:4px auto 4px;border:1px solid rgba(120,150,100,.25);border-radius:4px"></canvas>'+
    spawnS+
    '<div style="display:flex;align-items:center;gap:10px;justify-content:center;margin:4px 0 4px">'+
    '<span style="font-size:11px;color:#8aaa80;letter-spacing:1px">PLAYERS</span>'+
    '<button class="dbtn" id="slotMinus" style="min-width:34px;padding:4px 8px;font-size:18px;line-height:1">−</button>'+
    '<span id="slotCount" style="font-size:20px;font-weight:800;min-width:22px;text-align:center">'+numSlots+'</span>'+
    '<button class="dbtn" id="slotPlus" style="min-width:34px;padding:4px 8px;font-size:18px;line-height:1">+</button>'+
    '</div>'+
    '<div style="font-size:10px;color:#8aaa80;text-align:center;margin-bottom:5px">Tap team · tap bot · tap faction name to change</div>'+
    rows+
    '<div class="nav-row">'+
    '<button class="dbtn back-btn" id="backBtn">← BACK</button>'+
    '<button class="big-btn arcade" id="startBtn" style="flex:1;margin-bottom:0;padding:13px">⚔ START BATTLE</button>'+
    '</div>'
  );

  // Draw map preview
  const _pCv=document.getElementById('mapPrev');
  if(_pCv){
    const _pg=_pCv.getContext('2d');
    const _mw=_mapDef.w,_mh=_mapDef.h;
    const _scx=240/_mw,_scy=120/_mh;
    _pg.fillStyle=_mapDef.deco==='sand'?'#c4a96a':_mapDef.deco==='urban'?'#4a4e48':'#2b3a25';
    _pg.fillRect(0,0,240,120);
    // Walls
    _pg.strokeStyle='rgba(100,80,60,.6)';_pg.lineWidth=2;
    for(const w of(_mapDef.walls||[])){
      const[p1,p2]=w;_pg.beginPath();
      _pg.moveTo((p1[0]+.5)*_scx,(p1[1]+.5)*_scy);_pg.lineTo((p2[0]+.5)*_scx,(p2[1]+.5)*_scy);_pg.stroke();
    }
    // Neutral buildings
    _pg.fillStyle='rgba(150,160,140,.6)';
    for(const nd of(_mapDef.neutrals||[])){
      const t=BT[nd.type];_pg.fillRect(nd.tx*_scx,nd.ty*_scy,t.w*_scx,t.h*_scy);
    }
    // Gold piles
    _pg.fillStyle='#ffd95e';
    for(const[px,py]of(_mapDef.piles||[])){
      _pg.fillRect((px+.3)*_scx,(py+.3)*_scy,1.4*_scx,1.4*_scy);
    }
    // Spawns
    const _sp=(_mapDef.spawns||[]).slice(0,numSlots);
    for(let si=0;si<_sp.length;si++){
      const[sx,sy]=_sp[si];
      _pg.fillStyle=si===chosenSpawnIdx?ALL_TEAMC[0]:ALL_TEAMC[Math.min(si,7)];
      _pg.beginPath();_pg.arc((sx+2)*_scx,(sy+2)*_scy,si===chosenSpawnIdx?7:5,0,7);_pg.fill();
      _pg.strokeStyle='rgba(0,0,0,.5)';_pg.lineWidth=1.5;_pg.stroke();
      _pg.fillStyle='#fff';_pg.font='bold 8px sans-serif';_pg.textAlign='center';_pg.textBaseline='middle';
      _pg.fillText(si===chosenSpawnIdx?'P':(si+1),(sx+2)*_scx,(sy+2)*_scy);
    }
  }

  for(const b of overlay.querySelectorAll('[data-map]'))b.onclick=()=>{
    chosenMapKey=b.dataset.map;chosenSpawnIdx=0;uiClick();showLobby();
  };
  for(const b of overlay.querySelectorAll('[data-sz]'))b.onclick=()=>{
    chosenMapSize=b.dataset.sz;chosenSpawnIdx=0;uiClick();showLobby();
  };
  for(const b of overlay.querySelectorAll('[data-sp]'))b.onclick=()=>{
    chosenSpawnIdx=+b.dataset.sp;uiClick();
    for(const x of overlay.querySelectorAll('[data-sp]'))x.classList.toggle('sel',+x.dataset.sp===chosenSpawnIdx);
  };
  document.getElementById('slotMinus').onclick=()=>{
    if(numSlots<=2)return;
    numSlots--;slotType.length=numSlots;slotAlliance.length=numSlots;slotFac.length=numSlots;uiClick();showLobby();
  };
  document.getElementById('slotPlus').onclick=()=>{
    if(numSlots>=8)return;
    numSlots++;slotType.push('medium');slotAlliance.push(numSlots-1);slotFac.push('rnd');uiClick();showLobby();
  };
  for(const b of overlay.querySelectorAll('[data-ti]'))b.onclick=()=>{
    const i=+b.dataset.ti;
    slotAlliance[i]=(slotAlliance[i]+1)%numSlots;
    b.textContent='Team '+_TEAM_LETTERS[slotAlliance[i]%8];uiClick();
  };
  for(const b of overlay.querySelectorAll('[data-si]'))b.onclick=()=>{
    const i=+b.dataset.si;
    slotType[i]=_TYPES_CYCLE[(_TYPES_CYCLE.indexOf(slotType[i])+1)%3];
    b.textContent=_TYPE_LABELS[slotType[i]];uiClick();
  };
  for(const b of overlay.querySelectorAll('[data-fi]'))b.onclick=()=>{
    const i=+b.dataset.fi;
    const cur=slotFac[i]||'rnd';
    slotFac[i]=_FAC_CYCLE[(_FAC_CYCLE.indexOf(cur)+1)%_FAC_CYCLE.length];
    b.textContent=_facLabel(slotFac[i]);uiClick();
  };
  document.getElementById('backBtn').onclick=()=>{uiClick();showFactionSelect()};
  document.getElementById('startBtn').onclick=()=>{uiClick();init()};
}

function showPause(){
  overlay.style.display='flex';
  overlay.innerHTML=panel(
    eyebrow('PAUSED')+
    '<h1 style="font-size:clamp(26px,7vw,44px)">IRON <span>DOMINION</span></h1>'+
    '<div class="dbtns"><button class="dbtn" id="resBtn">▶ RESUME</button>'+
    '<button class="dbtn hard" id="quitBtn">MAIN MENU</button></div>'
  );
  document.getElementById('resBtn').onclick=()=>{overlay.style.display='none';state='play'};
  document.getElementById('quitBtn').onclick=showMenu;
}

function endGame(win){
  if(state!=='play')return;
  state=win?'win':'lose';
  const _elapsed=Math.floor(gtime);
  const _mm=Math.floor(_elapsed/60),_ss=_elapsed%60;
  const _timeStr=_mm+'m '+(_ss<10?'0':'')+_ss+'s';
  SFX.boom(true);
  setTimeout(()=>{
    const enemyFac=fac.find((f,i)=>i>0&&isEnemy(0,i))||fac[1]||'crimson';
    const enemyNames=fac.filter((f,i)=>i>0&&isEnemy(0,i)).map(f=>FACTIONS[f].name).join(', ');
    overlay.style.display='flex';
    overlay.innerHTML=panel(
      '<div class="eyebrow">'+(win?'VICTORY — THE REGION IS OURS':'BASE LOST')+'</div>'+
      '<div class="bigres '+(win?'win':'lose')+'">'+(win?'VICTORY':'DEFEAT')+'</div>'+
      '<div class="sub">'+(win?'Every enemy structure lies in ruins.':'The '+(enemyNames||FACTIONS[enemyFac].name)+' overran your position.')+'</div>'+
      '<div style="display:flex;justify-content:center;gap:18px;margin:12px 0 4px;font-size:13px;opacity:.85">'+
      '<span>⏱ '+_timeStr+'</span><span>⚔️ '+gameStats.kills+' kills</span><span>🏚 '+gameStats.bldgs+' bldgs</span>'+
      '</div>'+
      '<div class="dbtns" style="margin-top:12px">'+
      '<button class="dbtn arcade" id="retryBtn">↺ REMATCH</button>'+
      '<button class="dbtn" id="menuBtn2">⌂ MAIN MENU</button>'+
      '</div>'
    );
    document.getElementById('retryBtn').onclick=()=>{uiClick();init()};
    document.getElementById('menuBtn2').onclick=()=>{uiClick();showMenu()};
  },win?900:1400);
}

/* ---------- init ---------- */
function init(name){
  // name is optional (used by campaign); arcade uses slotType/slotAlliance from lobby
  diffName=name||'normal';D=DIFF[diffName]||DIFF.normal;
  // numSlots is set by the lobby (or campaign); ensure slot arrays are sized correctly
  if(!numSlots||numSlots<2)numSlots=2;
  if(!slotAlliance||slotAlliance.length!==numSlots){slotAlliance=[];for(let i=0;i<numSlots;i++)slotAlliance.push(i)}
  if(!slotType||slotType.length!==numSlots){slotType=['human'];for(let i=1;i<numSlots;i++)slotType.push('medium')}

  // Build faction list: slot 0 = player, rest random AI (unique where possible)
  matchSeed=Date.now()&0x7fffffff;setSeed(matchSeed);
  fac=[chosenFac];
  const _usedFacs=new Set([chosenFac]);
  for(let i=1;i<numSlots;i++){
    const avail=FACKEYS.filter(k=>!_usedFacs.has(k));
    const pool=avail.length?avail:FACKEYS.filter(k=>k!==fac[i-1]);
    const picked=pool[Math.floor(srandom()*pool.length)];
    fac.push(picked);_usedFacs.add(picked);
  }
  TEAMC=ALL_TEAMC.slice(0,numSlots);
  TEAMD=ALL_TEAMD.slice(0,numSlots);
  strikeCdMax=FAC(0).strikeCd;strikeBombs=FAC(0).bombs;
  gens=[chosenGens[chosenFac]||'std'];
  for(let i=1;i<numSlots;i++)gens.push('std');

  // Map setup
  chosenMap=chosenMapKey||'desert';
  MAP=(MAPS[chosenMap]||MAPS.desert)[chosenMapSize||'s2']||MAPS.desert.s2;
  setMapDims(MAP.w,MAP.h);

  simFrame=0;simAcc=0;
  gameStats={kills:0,bldgs:0};
  gameSpeed=1;const _sb=document.getElementById('speedBtn');if(_sb)_sb.textContent='1×';
  units=[];builds=[];planes=[];sel=[];placing=null;scraps=[];
  blocked=new Uint8Array(MAPW*MAPH);vis=new Uint8Array(MAPW*MAPH);
  resetPowers();
  upg=Array.from({length:numSlots},()=>({w:0,a:0,mk:0,cp:0}));
  shake=0;
  xp=new Array(numSlots).fill(0);
  rank=new Array(numSlots).fill(1);
  skp=new Array(numSlots).fill(1);
  genOpen=false;
  money=new Array(numSlots).fill(4000);
  powerP=new Array(numSlots).fill(0);
  powerU=new Array(numSlots).fill(0);
  lowPow=new Array(numSlots).fill(false);
  ids=1;gtime=0;fogT=0;powT=0;uiT=0;winT=3;aiT=1.5;miniT=0;sepT=0;
  underAttackCd=0;readyCd=0;hintStage=0;boxSel=null;boxStart=null;panMode=false;pinch=null;pts.clear();
  setSelMode(false);clearLP();dozI=-1;lastTapT=0;lastTapId=0;

  initPools();
  shInit();
  genWorld(chosenMap,numSlots);buildGround();

  const allSpawns=MAP.spawns.slice(0,numSlots);
  const psi=Math.min(chosenSpawnIdx,allSpawns.length-1);
  const playerSpawn=allSpawns[psi];
  const aiSpawns=allSpawns.filter((_,i)=>i!==psi);
  for(let si=aiSpawns.length-1;si>0;si--){const j=Math.floor(srandom()*(si+1));[aiSpawns[si],aiSpawns[j]]=[aiSpawns[j],aiSpawns[si]]}
  const pc=placeBuilding('command',0,playerSpawn[0],playerSpawn[1],true);
  ais=[];
  for(let i=1;i<numSlots;i++){
    const sp=aiSpawns[i-1]||aiSpawns[aiSpawns.length-1];
    const ec=placeBuilding('command',i,sp[0],sp[1],true);
    const diff=slotType[i]||'medium';
    const a=makeAI(diff);a.team=i;a.cc=ec;a.builtTypes.command=true;
    money[i]=SLOT_DIFFS[diff].trickle*60+2000;
    ais.push(a);
    spawnUnit('dozer',i,ec.x,(ec.ty+BT.command.h)*TILE+34);
  }
  ai=ais[0]||null; // backward compat

  const dz=spawnUnit('dozer',0,pc.x,(pc.ty+pc.t.h)*TILE+34);
  cam.x=pc.x;cam.y=pc.y;cam.z=clamp(Math.min(vw,vh)/620,.55,1);
  clampCam();
  sel=[dz];
  updateFog();recomputePower();renderMini();
  overlay.style.display='none';
  state='play';
  refreshPowers();updateRankBtn();updateHUD();updateCard();
  toast('🚜 '+dispName('u','dozer',0)+' ready — build menu below');
  const mapLabel=chosenMap.charAt(0).toUpperCase()+chosenMap.slice(1);
  toast('⚔ Map: '+mapLabel+' · Enemy: '+FACTIONS[fac[1]].name+(numSlots>2?' +more':''));
  toast('⭐ Spend your skill point — tap the star button');
  toast('⚔️ '+GENMOD(0).nm+' doctrine active');
}

/* ---------- fixed-timestep sim ---------- */
function simStep(){
  drainInputs();
  for(const u of units)if(!u.dead){u.px=u.x;u.py=u.y}
  for(const b of builds)if(!b.dead){b.px=b.x;b.py=b.y}

  const dt=SIM_DT;
  gtime+=dt;

  shClear();
  for(const u of units)if(!u.dead)shInsert(u);
  for(const b of builds)if(!b.dead)shInsert(b);

  for(const u of units)updateUnit(u,dt);
  if(units.some(u=>u.dead))units=units.filter(u=>!u.dead);
  for(const b of builds)updateBuilding(b,dt);
  if(builds.some(b=>b.dead))builds=builds.filter(b=>!b.dead);
  updateProjs(dt);updateParts(dt);updatePlanes(dt);
  for(let i=scraps.length-1;i>=0;i--){scraps[i].life-=dt;if(scraps[i].life<=0)scraps.splice(i,1)}
  separation(dt);
  fogT-=dt;if(fogT<=0){fogT=.25;updateFog()}
  powT-=dt;if(powT<=0){powT=.5;recomputePower()}
  // Tick all AIs
  aiT-=dt;
  if(aiT<=0){
    aiT=1;
    for(let i=0;i<ais.length;i++){
      const prev=ai;ai=ais[i];
      aiTick(1);
      ai=prev;
    }
  }
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
    const pa=slotAlliance[0]||0;
    let playerAlive=false,enemyAlive=false;
    for(const b of builds){
      if(b.dead||b.team<0)continue;
      if((slotAlliance[b.team]||b.team)===pa)playerAlive=true;
      else enemyAlive=true;
    }
    if(!campaign){
      if(!playerAlive)endGame(false);
      else if(!enemyAlive)endGame(true);
    }
  }
  uiT-=dt;if(uiT<=0){uiT=.3;updateHUD();refreshCard();checkHints()}
  miniT-=dt;if(miniT<=0){miniT=.35;renderMini()}
  const ps=620/cam.z*dt;let kx=0,ky=0;
  if(keys['w']||keys['arrowup'])ky-=1;
  if(keys['s']||keys['arrowdown'])ky+=1;
  if(keys['a']||keys['arrowleft'])kx-=1;
  if(keys['d']||keys['arrowright'])kx+=1;
  if(kx||ky){cam.x+=kx*ps;cam.y+=ky*ps;clampCam()}
  if(campaign&&typeof updateCampaign==='function')updateCampaign();
  simFrame++;
}

let lastTs=0;
function frame(ts){
  requestAnimationFrame(frame);
  if(state!=='play'){render();return}
  const dtReal=Math.min((ts-(lastTs||ts))/1000,0.1);
  lastTs=ts;
  simAcc+=dtReal*gameSpeed;
  let steps=0,maxS=gameSpeed*5;
  while(simAcc>=SIM_DT&&steps<maxS){simStep();simAcc-=SIM_DT;steps++}
  if(steps>=maxS)simAcc=0;
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
