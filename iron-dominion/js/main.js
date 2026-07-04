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
let startingCash=4000; // configurable in lobby
let idleDozerT=0;  // tracks idle dozer time for alert

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
  // build version badge — always visible at the bottom of the main menu so a
  // deployed push is verifiable at a glance (reads the same GAME_VERSION the SW cache uses)
  let _vb=document.getElementById('verBadge');
  if(!_vb){
    _vb=document.createElement('div');
    _vb.id='verBadge';
    _vb.style.cssText='position:fixed;bottom:calc(6px + env(safe-area-inset-bottom));left:0;right:0;text-align:center;font-size:11px;letter-spacing:1px;color:#8a9478;opacity:.75;z-index:60;pointer-events:none;font-family:inherit';
    document.body.appendChild(_vb);
  }
  const _cur=(typeof GAME_VERSION!=='undefined'?GAME_VERSION:'dev');
  _vb.textContent='IRON DOMINION '+_cur+' · build by Claude';
  _vb.style.display='block';
  // live check: ask the server which version is deployed; offer a one-tap update if newer
  try{
    fetch('js/version.js?ck='+Date.now(),{cache:'no-store'}).then(r=>r.text()).then(t=>{
      const mm=t.match(/GAME_VERSION='(v\d+)'/);
      if(mm&&mm[1]!==_cur){
        _vb.textContent='⬆️ '+mm[1]+' AVAILABLE — TAP TO UPDATE (you have '+_cur+')';
        _vb.style.cssText+=';color:#ffd95e;opacity:1;pointer-events:auto;font-weight:700';
        _vb.onclick=async()=>{
          _vb.textContent='UPDATING…';
          try{if(window.caches){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(e){}
          try{if(navigator.serviceWorker){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r2=>r2.update()))}}catch(e){}
          location.reload();
        };
      }
    }).catch(()=>{});
  }catch(e){}
  const _si=getSaveInfo();
  const _loadBtn=_si?'<button class="big-btn" id="loadBtn" style="font-size:14px;padding:12px">💾 CONTINUE<br><span style="font-size:11px;font-weight:400;opacity:.75">'+(_si.fac[0]?FACTIONS[_si.fac[0]].name:'')+(numSlots>2?' +more':'')+' · '+_si.map+' · '+_si.time+' · '+_si.ago+'</span></button>':'';
  overlay.innerHTML=panel(
    eyebrow('REAL-TIME STRATEGY')+
    '<h1>IRON <span>DOMINION</span></h1>'+
    '<div class="sub" style="margin-bottom:20px">Command. Conquer. Dominate.</div>'+
    '<button class="big-btn arcade" id="playBtn">▶ NEW GAME</button>'+
    _loadBtn+
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
  const _lb=document.getElementById('loadBtn');if(_lb)_lb.onclick=()=>{uiClick();loadGame()};
  document.getElementById('settingsBtn').onclick=()=>{uiClick();showSettings()};
  const hb=document.getElementById('howtoBtn');
  hb.onclick=()=>{const box=document.getElementById('howtoBox');if(box){box.classList.toggle('open');hb.textContent=box.classList.contains('open')?'✖ Close':'❓ How to Play'}};
  const ib=document.getElementById('installBtn');
  if(ib){
    const standalone=matchMedia('(display-mode: fullscreen),(display-mode: standalone)').matches||navigator.standalone;
    if(standalone)ib.style.display='none';
    else ib.onclick=()=>{
      uiClick();
      if(_installPrompt){_installPrompt.prompt();_installPrompt.userChoice.then(()=>{_installPrompt=null;ib.style.display='none'});return}
      // No native prompt available — show manual steps per platform
      const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
      alert(isIOS
        ?'To install on iOS:\n\n1. Tap the Share button (square with arrow)\n2. Scroll down, tap "Add to Home Screen"\n3. Tap "Add"'
        :'To install:\n\nChrome (Android): tap ⋮ menu → "Add to Home screen" / "Install app"\n\nChrome (Desktop): click the install icon in the address bar, or ⋮ menu → "Cast, save and share" → "Install page as app"\n\nIf no install option appears, the app may already be installed, or try a hard refresh (the manifest was recently updated).');
    };
  }
}

/* ===== SCREEN 1b: SETTINGS ===== */
function showSettings(){
  overlay.innerHTML=panel(
    eyebrow('IRON DOMINION')+
    '<h1 style="font-size:clamp(22px,6vw,36px)">SETTINGS</h1>'+
    '<div style="display:flex;flex-direction:column;gap:14px;margin:8px 0 4px">'+
      '<button class="dbtn" id="muteSet" style="width:100%">'+(muted?'🔇 Sound: OFF':'🔊 Sound: ON')+'</button>'+
      '<div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#c2d4b4">'+
        '<span style="width:80px;text-align:right">Music</span>'+
        '<input id="mxVol" type="range" min="0" max="100" value="'+Math.round(musicVol*100)+'" style="flex:1;accent-color:#62b169">'+
        '<span id="mxVolN" style="width:32px">'+Math.round(musicVol*100)+'</span>'+
      '</div>'+
      '<div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#c2d4b4">'+
        '<span style="width:80px;text-align:right">SFX</span>'+
        '<input id="sxVol" type="range" min="0" max="100" value="'+Math.round(sfxVol*100)+'" style="flex:1;accent-color:#62b169">'+
        '<span id="sxVolN" style="width:32px">'+Math.round(sfxVol*100)+'</span>'+
      '</div>'+
    '</div>'+
    '<div class="nav-row"><button class="dbtn back-btn" id="backBtn">← BACK</button></div>'
  );
  document.getElementById('backBtn').onclick=()=>{uiClick();showMainMenu()};
  document.getElementById('muteSet').onclick=()=>{
    muted=!muted;
    document.getElementById('muteSet').textContent=muted?'🔇 Sound: OFF':'🔊 Sound: ON';
    const mb=document.getElementById('muteBtn');if(mb)mb.textContent=muted?'🔇':'🔊';
    applyMute();
  };
  document.getElementById('mxVol').oninput=function(){
    setMusicVol(this.value/100);document.getElementById('mxVolN').textContent=this.value;
  };
  document.getElementById('sxVol').oninput=function(){
    setSfxVol(this.value/100);document.getElementById('sxVolN').textContent=this.value;
    SFX.click();
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
const _MAP_SIZES=[['s2','Small',2],['s4','Medium',4],['s6','Large',6],['s8','Huge',8]];
const _SIZEMAXSLOTS={s2:2,s4:4,s6:6,s8:8};

function _drawMapPrev(_md){
  const _pCv=document.getElementById('mapPrev');
  if(!_pCv||!_md)return;
  const _pg=_pCv.getContext('2d');
  const _mw=_md.w,_mh=_md.h,_scx=240/_mw,_scy=120/_mh;
  _pg.fillStyle=_md.deco==='sand'?'#c4a96a':_md.deco==='urban'?'#4a4e48':'#2b3a25';
  _pg.fillRect(0,0,240,120);
  _pg.strokeStyle='rgba(100,80,60,.6)';_pg.lineWidth=2;
  for(const w of(_md.walls||[])){const[p1,p2]=w;_pg.beginPath();_pg.moveTo((p1[0]+.5)*_scx,(p1[1]+.5)*_scy);_pg.lineTo((p2[0]+.5)*_scx,(p2[1]+.5)*_scy);_pg.stroke()}
  _pg.fillStyle='rgba(150,160,140,.6)';
  for(const nd of(_md.neutrals||[])){const t=BT[nd.type];if(t)_pg.fillRect(nd.tx*_scx,nd.ty*_scy,t.w*_scx,t.h*_scy)}
  _pg.fillStyle='#ffd95e';
  for(const[px,py]of(_md.piles||[])){_pg.fillRect((px+.3)*_scx,(py+.3)*_scy,1.4*_scx,1.4*_scy)}
  const _sp=(_md.spawns||[]).slice(0,numSlots);
  for(let si=0;si<_sp.length;si++){
    const[sx,sy]=_sp[si];
    _pg.fillStyle=si===chosenSpawnIdx?ALL_TEAMC[0]:ALL_TEAMC[Math.min(si,7)];
    _pg.beginPath();_pg.arc((sx+2)*_scx,(sy+2)*_scy,si===chosenSpawnIdx?7:5,0,7);_pg.fill();
    _pg.strokeStyle='rgba(0,0,0,.5)';_pg.lineWidth=1.5;_pg.stroke();
    _pg.fillStyle='#fff';_pg.font='bold 8px sans-serif';_pg.textAlign='center';_pg.textBaseline='middle';
    _pg.fillText(si===chosenSpawnIdx?'P':(si+1),(sx+2)*_scx,(sy+2)*_scy);
  }
}

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
  const _mapDef=applyFairLayout((MAPS[chosenMapKey]||MAPS.desert)[chosenMapSize||'s2']||MAPS.desert.s2);
  const _spawnMax=Math.min((_mapDef.spawns||[]).length,numSlots)-1;
  if(chosenSpawnIdx>_spawnMax)chosenSpawnIdx=0;

  let mapS='<div style="display:flex;align-items:center;gap:8px;justify-content:center;margin:4px 0 2px">'+
    '<span style="font-size:11px;color:#8aaa80;letter-spacing:1px">MAP</span>'+
    '<select id="mapSelect" style="background:#23261a;color:#cfc9ae;border:1px solid #565d40;border-top-color:#6a715a;border-radius:3px;padding:5px 10px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">';
  for(const k of Object.keys(MAPS))
    mapS+='<option value="'+k+'"'+(chosenMapKey===k?' selected':'')+'>'+k.charAt(0).toUpperCase()+k.slice(1)+'</option>';
  mapS+='</select></div>';

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
    '<div style="display:flex;align-items:center;gap:8px;justify-content:center;margin:6px 0 2px">'+
    '<span style="font-size:10px;color:#8aaa80;letter-spacing:1px">START $</span>'+
    '<input id="startCashSlider" type="range" min="1000" max="12000" step="500" value="'+startingCash+'" style="flex:1;max-width:110px;accent-color:#62b169">'+
    '<span id="startCashLabel" style="font-size:12px;font-weight:700;min-width:50px;color:#ffd95e">$'+startingCash+'</span>'+
    '</div>'+
    '<div class="nav-row">'+
    '<button class="dbtn back-btn" id="backBtn">← BACK</button>'+
    '<button class="big-btn arcade" id="startBtn" style="flex:1;margin-bottom:0;padding:13px">⚔ START BATTLE</button>'+
    '</div>'
  );

  // Draw map preview
  _drawMapPrev(_mapDef);

  const _msel=document.getElementById('mapSelect');
  if(_msel)_msel.onchange=()=>{chosenMapKey=_msel.value;chosenSpawnIdx=0;uiClick();showLobby()};
  for(const b of overlay.querySelectorAll('[data-sz]'))b.onclick=()=>{
    chosenMapSize=b.dataset.sz;chosenSpawnIdx=0;
    const _cap=_SIZEMAXSLOTS[chosenMapSize]||8;
    if(numSlots>_cap){numSlots=_cap;slotType.length=_cap;slotAlliance.length=_cap;slotFac.length=_cap}
    uiClick();showLobby();
  };
  for(const b of overlay.querySelectorAll('[data-sp]'))b.onclick=()=>{
    chosenSpawnIdx=+b.dataset.sp;uiClick();
    for(const x of overlay.querySelectorAll('[data-sp]'))x.classList.toggle('sel',+x.dataset.sp===chosenSpawnIdx);
    _drawMapPrev(_mapDef);
  };
  document.getElementById('slotMinus').onclick=()=>{
    if(numSlots<=2)return;
    numSlots--;slotType.length=numSlots;slotAlliance.length=numSlots;slotFac.length=numSlots;uiClick();showLobby();
  };
  document.getElementById('slotPlus').onclick=()=>{
    if(numSlots>=(_SIZEMAXSLOTS[chosenMapSize||'s8']||8))return;
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
  const _sc=document.getElementById('startCashSlider');
  const _scL=document.getElementById('startCashLabel');
  if(_sc)_sc.oninput=function(){startingCash=+this.value;if(_scL)_scL.textContent='$'+this.value};
}

function showPause(){
  overlay.style.display='flex';
  overlay.innerHTML=panel(
    eyebrow('PAUSED')+
    '<h1 style="font-size:clamp(26px,7vw,44px)">IRON <span>DOMINION</span></h1>'+
    '<div class="dbtns">'+
    '<button class="dbtn" id="resBtn">▶ RESUME</button>'+
    '<button class="dbtn" id="saveBtn">💾 SAVE GAME</button>'+
    '<button class="dbtn hard" id="quitBtn">MAIN MENU</button>'+
    '</div>'
  );
  document.getElementById('resBtn').onclick=()=>{overlay.style.display='none';state='play'};
  document.getElementById('saveBtn').onclick=()=>{saveGame();document.getElementById('saveBtn').textContent='✔ SAVED';document.getElementById('saveBtn').disabled=true};
  document.getElementById('quitBtn').onclick=showMenu;
}

function endGame(win){
  if(state!=='play')return;
  state=win?'win':'lose';
  stopMusic();
  if(typeof stopLowPowAlarm==='function')stopLowPowAlarm();
  const _elapsed=Math.floor(gtime);
  const _mm=Math.floor(_elapsed/60),_ss=_elapsed%60;
  const _timeStr=_mm+'m '+(_ss<10?'0':'')+_ss+'s';
  SFX.boom(true);
  setTimeout(()=>{
    const enemyFac=fac.find((f,i)=>i>0&&isEnemy(0,i))||fac[1]||'crimson';
    const enemyNames=fac.filter((f,i)=>i>0&&isEnemy(0,i)).map(f=>FACTIONS[f].name).join(', ');
    overlay.style.display='flex';
    const _incomeRate=_elapsed>60?Math.round((gameStats.moneyEarned||0)/(_elapsed/60)):0;
    overlay.innerHTML=panel(
      '<div class="eyebrow">'+(win?'VICTORY — THE REGION IS OURS':'BASE LOST')+'</div>'+
      '<div class="bigres '+(win?'win':'lose')+'">'+(win?'VICTORY':'DEFEAT')+'</div>'+
      '<div class="sub">'+(win?'Every enemy structure lies in ruins.':'The '+(enemyNames||FACTIONS[enemyFac].name)+' overran your position.')+'</div>'+
      '<div style="display:flex;justify-content:center;gap:14px;margin:12px 0 4px;font-size:12px;opacity:.88;flex-wrap:wrap">'+
      '<span>⏱ '+_timeStr+'</span><span>⚔️ '+gameStats.kills+' kills</span><span>🏚 '+gameStats.bldgs+' bldgs</span>'+(_incomeRate?'<span>💰 $'+_incomeRate+'/min</span>':'')+
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

/* ---------- save / load ---------- */
const SAVE_KEY='id_save_v1';
function hasSave(){try{return!!localStorage.getItem(SAVE_KEY)}catch(e){return false}}
function getSaveInfo(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
    if(!s||s.v!==1)return null;
    const ago=Math.floor((Date.now()-s.ts)/60000);
    const agoStr=ago<1?'just now':ago<60?ago+'m ago':Math.floor(ago/60)+'h ago';
    const mm=Math.floor((s.gtime||0)/60),ss=Math.floor((s.gtime||0)%60);
    return{fac:s.fac||[],map:s.chosenMap||'?',time:mm+'m '+(ss<10?'0':'')+ss+'s',ago:agoStr};
  }catch(e){return null}
}
function saveGame(){
  if(state!=='play')return;
  function serUnit(u){
    return{id:u.id,type:u.type,team:u.team,x:u.x,y:u.y,a:u.a,
      hp:u.hp,maxhp:u.maxhp,spd:u.spd,dmgMul:u.dmgMul,wc:u.wc,
      ammo:u.ammo,poisonT:u.poisonT||0,poisonDps:u.poisonDps||0,
      ts:u.ts,cargo:u.cargo||0,scrapLevel:u.scrapLevel||0,hidden:u.hidden||false,
      unitXp:u.unitXp||0,unitRank:u.unitRank||0,kills:u.kills||0,
      isCapturing:u.isCapturing||false,captureProgress:u.captureProgress||0,
      order:u.order||null,wpi:u.wpi||0,auto:u.auto||false,padI:u.padI||-1,
      site_id:u.site?u.site.id:null,fix_id:u.fix?u.fix.id:null,
      home_id:u.home?u.home.id:null,at_id:u.attackTarget?u.attackTarget.id:null,
      gb_id:u.garrisonBuilding?u.garrisonBuilding.id:null,
      ct_id:u.captureTarget?u.captureTarget.id:null,
      path:u.path?u.path.slice(0,20).map(p=>({x:p.x,y:p.y})):null};
  }
  function serBuild(b){
    return{id:b.id,type:b.type,team:b.team,tx:b.tx,ty:b.ty,
      hp:b.hp,maxhp:b.maxhp,built:b.built,prog:b.prog,dmgMul:b.dmgMul,
      cd:b.cd||0,queue:b.queue.map(q=>({type:q.type,p:q.p})),
      rally:{x:b.rally.x,y:b.rally.y},charge:b.charge||0,mkT:b.mkT||0,
      isHole:b.isHole||false,holeT:b.holeT||0,selfBuild:b.selfBuild||false,rebuilt:b.rebuilt||false,
      at_id:b.attackTarget?b.attackTarget.id:null,
      garrison_ids:(b.garrison||[]).filter(u=>u&&!u.dead).map(u=>u.id),
      pad_ids:(b.padUnits||[]).map(u=>u?u.id:null)};
  }
  const save={
    v:1,ts:Date.now(),
    fac:[...fac],gens:[...gens],slotAlliance:[...slotAlliance],slotType:[...slotType],
    numSlots,chosenMap,chosenMapSize,chosenSpawnIdx,matchSeed,diffName,
    gtime,simFrame,gameSpeed,gameStats:{...gameStats},ids,
    money:[...money],upg:upg.map(u=>({...u})),
    xp:[...xp],rank:[...rank],skp:[...skp],
    pw:Object.fromEntries(Object.entries(pw).map(([k,v])=>[k,{...v}])),
    strikeCdMax,strikeBombs,
    units:units.filter(u=>!u.dead).map(serUnit),
    builds:builds.filter(b=>!b.dead).map(serBuild),
    piles:piles.map(p=>({tx:p.tx,ty:p.ty,amt:p.amt})),
    vis:Array.from(vis),
    ais:ais.map(a=>({waveN:a.waveN||0,builtTypes:{...a.builtTypes}})),
  };
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));toast('💾 Game saved');SFX.click()}
  catch(e){toast('⚠️ Save failed — storage full?');SFX.err()}
}
function loadGame(){
  let save;
  try{save=JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch(e){save=null}
  if(!save||save.v!==1){toast('⚠️ No save found');SFX.err();return}
  // Restore match config
  fac=[...save.fac];gens=[...save.gens];
  slotAlliance=[...save.slotAlliance];slotType=[...save.slotType];
  numSlots=save.numSlots;
  chosenMap=save.chosenMap||'desert';chosenMapKey=chosenMap;
  chosenMapSize=save.chosenMapSize||'s2';chosenSpawnIdx=save.chosenSpawnIdx||0;
  matchSeed=save.matchSeed||1;diffName=save.diffName||'normal';D=DIFF[diffName]||DIFF.normal;
  // Setup world dims + seed (same seed → same rock layout)
  setSeed(matchSeed);
  TEAMC=ALL_TEAMC.slice(0,numSlots);TEAMD=ALL_TEAMD.slice(0,numSlots);
  for(let t=0;t<numSlots;t++){if(FACTIONS[fac[t]]){TEAMC[t]=FACTIONS[fac[t]].c;TEAMD[t]=FACTIONS[fac[t]].d}}
  MAP=(MAPS[chosenMap]||MAPS.desert)[chosenMapSize]||MAPS.desert.s2;
  setMapDims(MAP.w,MAP.h);
  // Reset sim
  simFrame=save.simFrame||0;simAcc=0;gtime=save.gtime||0;
  gameSpeed=save.gameSpeed||1;
  const _sb=document.getElementById('speedBtn');if(_sb)_sb.textContent=gameSpeed+'×';
  gameStats={...save.gameStats};ids=save.ids||1;strikeCdMax=save.strikeCdMax||110;strikeBombs=save.strikeBombs||3;
  shake=0;
  // Reset entity + UI state
  idleDozerT=0;
  units=[];builds=[];planes=[];sel=[];placing=null;scraps=[];rubbles=[];fireZones=[];
  blocked=new Uint8Array(MAPW*MAPH);vis=new Uint8Array(MAPW*MAPH);
  fogT=0;powT=0;uiT=0;winT=3;aiT=1.5;miniT=0;sepT=0;
  underAttackCd=0;readyCd=0;hintStage=5;
  boxSel=null;boxStart=null;panMode=false;pinch=null;pts.clear();
  setSelMode(false);clearLP();dozI=-1;lastTapT=0;lastTapId=0;
  resetPowers();
  // Economy + XP
  money=[...save.money];upg=save.upg.map(u=>({...u}));
  xp=[...save.xp];rank=[...save.rank];skp=[...save.skp];
  for(const k in save.pw)if(pw[k])Object.assign(pw[k],save.pw[k]);
  upg=Array.from({length:numSlots},(_,i)=>save.upg[i]?{...save.upg[i]}:{w:0,a:0,mk:0,cp:0});
  genOpen=false;
  // Generate world WITHOUT neutral buildings (we restore from save)
  initPools();shInit();
  genWorld(chosenMap,numSlots,true);
  // Restore pile amounts (genWorld placed them with seeded amounts, overwrite with saved amounts)
  if(save.piles){for(const sp of save.piles){const p=piles.find(x=>x.tx===sp.tx&&x.ty===sp.ty);if(p)p.amt=sp.amt}}
  buildGround();
  // Restore buildings
  for(const bd of save.builds){
    const t=BT[bd.type];if(!t)continue;
    const b={kind:'b',id:bd.id,type:bd.type,team:bd.team,tx:bd.tx,ty:bd.ty,
      x:(bd.tx+t.w/2)*TILE,y:(bd.ty+t.h/2)*TILE,
      hp:bd.hp,maxhp:bd.maxhp,t,cat:'bld',built:bd.built,prog:bd.prog,
      dmgMul:bd.dmgMul||1,queue:bd.queue.map(q=>({type:q.type,p:q.p})),
      rally:bd.rally,cd:bd.cd||0,ta:0,scan:Math.random()*.4,
      attackTarget:null,flash:0,dead:false,stT:0,
      charge:bd.charge||0,mkT:bd.mkT||0,
      isHole:bd.isHole||false,holeT:bd.holeT||0,
      selfBuild:bd.selfBuild||false,rebuilt:bd.rebuilt||false};
    if(t.garrison)b.garrison=[];
    if(bd.type==='airfield')b.padUnits=new Array(4).fill(null);
    if(bd.team>=0&&fac[bd.team]==='scorpion'&&b.isHole===undefined){b.isHole=false;b.holeT=0;b.selfBuild=false;b.rebuilt=false}
    if(!b.dead)blockRect(b.tx,b.ty,t.w,t.h,1);
    builds.push(b);
  }
  // Restore units
  for(const ud of save.units){
    const t=UT[ud.type];if(!t)continue;
    const u={kind:'u',id:ud.id,type:ud.type,team:ud.team,x:ud.x,y:ud.y,px:ud.x,py:ud.y,
      a:ud.a||0,ta:0,hp:ud.hp,maxhp:ud.maxhp,t,cat:t.cat,
      spd:ud.spd,dmgMul:ud.dmgMul||1,wc:ud.wc||t.wc||1,
      zHeight:t.cat==='air'?30:0,ammo:ud.ammo||0,home:null,padI:ud.padI||-1,rearmT:0,
      poisonT:ud.poisonT||0,poisonDps:ud.poisonDps||0,
      cd:0,scan:Math.random()*.4,repath:0,path:ud.path||null,wpi:ud.wpi||0,
      order:ud.order||null,attackTarget:null,site:null,pile:null,
      ts:ud.ts||'idle',lt:0,retry:0,cargo:ud.cargo||0,flash:0,dead:false,stT:0,
      lx:ud.x,ly:ud.y,anchor:null,auto:ud.auto||false,smkT:0,fix:null,healT:0,
      unitXp:ud.unitXp||0,unitRank:ud.unitRank||0,kills:ud.kills||0,
      scrapLevel:ud.scrapLevel||0,hidden:ud.hidden||false,garrisonBuilding:null,
      isCapturing:ud.isCapturing||false,captureTarget:null,captureProgress:ud.captureProgress||0,
      _site_id:ud.site_id,_fix_id:ud.fix_id,_home_id:ud.home_id,
      _at_id:ud.at_id,_gb_id:ud.gb_id,_ct_id:ud.ct_id};
    units.push(u);
  }
  // Resolve cross-references by id
  const _byId={};
  for(const u of units)_byId[u.id]=u;
  for(const b of builds)_byId[b.id]=b;
  for(const u of units){
    if(u._site_id)u.site=_byId[u._site_id]||null;
    if(u._fix_id)u.fix=_byId[u._fix_id]||null;
    if(u._home_id)u.home=_byId[u._home_id]||null;
    if(u._at_id)u.attackTarget=_byId[u._at_id]||null;
    if(u._gb_id)u.garrisonBuilding=_byId[u._gb_id]||null;
    if(u._ct_id)u.captureTarget=_byId[u._ct_id]||null;
    delete u._site_id;delete u._fix_id;delete u._home_id;
    delete u._at_id;delete u._gb_id;delete u._ct_id;
  }
  for(let i=0;i<save.builds.length;i++){
    const bd=save.builds[i],b=builds[i];
    if(!b)continue;
    if(bd.at_id)b.attackTarget=_byId[bd.at_id]||null;
    if(bd.garrison_ids&&b.garrison)
      b.garrison=bd.garrison_ids.map(id=>units.find(u=>u.id===id)).filter(Boolean);
    if(bd.pad_ids&&b.padUnits)
      b.padUnits=bd.pad_ids.map(id=>id!=null?units.find(u=>u.id===id)||null:null);
  }
  // Restore fog
  const sv=save.vis;for(let i=0;i<sv.length&&i<vis.length;i++)vis[i]=sv[i];
  // Rebuild AIs
  ais=[];
  for(let i=1;i<numSlots;i++){
    const diff=slotType[i]||'medium';
    const a=makeAI(diff);a.team=i;
    a.cc=builds.find(b=>!b.dead&&b.team===i&&b.type==='command')||null;
    const sai=save.ais[i-1];
    if(sai){a.waveN=sai.waveN||0;a.builtTypes={...sai.builtTypes}}
    a.builtTypes.command=true;
    ais.push(a);
  }
  ai=ais[0]||null;
  // Camera
  const _pcc=builds.find(b=>b.team===0&&b.type==='command'&&!b.dead);
  const _pu=units.find(u=>u.team===0&&!u.dead);
  if(_pcc){cam.x=_pcc.x;cam.y=_pcc.y}else if(_pu){cam.x=_pu.x;cam.y=_pu.y}
  cam.z=clamp(Math.min(vw,vh)/620,.55,1);clampCam();
  // Start
  updateFog();recomputePower();renderMini();
  overlay.style.display='none';state='play';
  startMusic();refreshPowers();updateRankBtn();updateHUD();updateCard();
  const eFacs=fac.slice(1).filter((_,i)=>isEnemy(0,i+1)).map(f=>FACTIONS[f]?.name||f).join(', ');
  toast('💾 Save loaded — '+FACTIONS[fac[0]].name+' vs '+(eFacs||'AI'));
}

/* ---------- init ---------- */
function hideVerBadge(){const b=document.getElementById('verBadge');if(b)b.style.display='none'}
function init(name){
  hideVerBadge();
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
  for(let t=0;t<numSlots;t++){if(FACTIONS[fac[t]]){TEAMC[t]=FACTIONS[fac[t]].c;TEAMD[t]=FACTIONS[fac[t]].d}}
  strikeCdMax=FAC(0).strikeCd;strikeBombs=FAC(0).bombs;
  gens=[chosenGens[chosenFac]||'std'];
  for(let i=1;i<numSlots;i++)gens.push('std');

  // Map setup
  chosenMap=chosenMapKey||'desert';
  MAP=(MAPS[chosenMap]||MAPS.desert)[chosenMapSize||'s2']||MAPS.desert.s2;
  setMapDims(MAP.w,MAP.h);

  simFrame=0;simAcc=0;
  gameStats={kills:0,bldgs:0,moneyEarned:0};
  gameSpeed=1;const _sb=document.getElementById('speedBtn');if(_sb)_sb.textContent='1×';
  idleDozerT=0;
  units=[];builds=[];planes=[];sel=[];placing=null;scraps=[];rubbles=[];fireZones=[];
  blocked=new Uint8Array(MAPW*MAPH);vis=new Uint8Array(MAPW*MAPH);
  resetPowers();
  upg=Array.from({length:numSlots},()=>({w:0,a:0,mk:0,cp:0}));
  shake=0;
  xp=new Array(numSlots).fill(0);
  rank=new Array(numSlots).fill(1);
  skp=new Array(numSlots).fill(1);
  genOpen=false;
  money=new Array(numSlots).fill(startingCash||4000);
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
  startMusic();
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
  updateProjs(dt);updateParts(dt);updatePlanes(dt);updateFireZones(dt);
  for(let i=scraps.length-1;i>=0;i--){scraps[i].life-=dt;if(scraps[i].life<=0)scraps.splice(i,1)}
  for(let i=rubbles.length-1;i>=0;i--){rubbles[i].life-=dt;if(rubbles[i].life<=0)rubbles.splice(i,1)}
  if(scanT>0)scanT=Math.max(0,scanT-dt);
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
  // Music intensity — ramp up when enemy units are near our territory
  if(simFrame%120===0){
    const threat=units.some(u=>{
      if(u.dead||!isEnemy(0,u.team)||!COMBAT.includes(u.type))return false;
      return builds.some(b=>!b.dead&&b.team===0&&dist2(u,b)<1600);
    });
    setMusicIntensity(threat?1:0);
  }
  readyCd=Math.max(0,readyCd-dt);
  // Low-power alarm — start/stop loop based on power state
  if(simFrame%60===0){
    if(lowPow[0]&&state==='play'){if(typeof startLowPowAlarm==='function')startLowPowAlarm()}
    else{if(typeof stopLowPowAlarm==='function')stopLowPowAlarm()}
  }
  // Idle dozer alert — warn every 30s if a dozer has nothing to do
  if(simFrame%180===0&&state==='play'){
    const hasIdle=units.some(u=>!u.dead&&u.team===0&&u.type==='dozer'&&!u.site&&!u.fix&&!u.path&&!u.order);
    if(hasIdle){idleDozerT+=3;if(idleDozerT>=30){idleDozerT=0;toast('🚜 Dozer is idle — tap 🚜 button to assign a task')}}
    else idleDozerT=0;
  }
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

/* ---- Airfield aircraft icon sprites ----
   The base uSpr() in render.js returns null for raptor/gunship/bomber, which made
   iconURL() throw and left the Airfield production card empty. This shim supplies
   the missing icons (no-op if render.js already provides them). */
(function(){
  if(typeof uSpr!=='function')return;
  const _baseUSpr=uSpr;
  uSpr=function(type,fk){
    const r=_baseUSpr(type,fk);
    if(r||(type!=='raptor'&&type!=='gunship'&&type!=='bomber'))return r;
    const F=FACTIONS[fk],ac=F.c,C=facCol(fk);
    if(type==='gunship')return spr('Ugunship_'+fk,36,30,g=>{
      g.translate(18,15);
      g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(0,1,13,7,0,0,7);g.fill();
      g.fillStyle=C(38);g.beginPath();g.ellipse(0,0,14,7,0,0,7);g.fill();
      g.fillStyle=C(28);g.fillRect(-12,-2,10,4);
      g.strokeStyle=C(14);g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,14,7,0,0,7);g.stroke();
      g.strokeStyle='rgba(225,235,225,.6)';g.lineWidth=1.5;
      g.beginPath();g.moveTo(-16,0);g.lineTo(16,0);g.stroke();
      g.beginPath();g.moveTo(0,-12);g.lineTo(0,12);g.stroke();
      g.strokeStyle=C(16);g.lineWidth=1.4;g.beginPath();g.moveTo(-13,-5);g.lineTo(-13,-10);g.stroke();
      g.fillStyle=ac;g.beginPath();g.arc(4,0,2.4,0,7);g.fill();
    });
    if(type==='bomber')return spr('Ubomber_'+fk,40,52,g=>{
      g.translate(20,26);
      g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(0,2,15,11,0,0,7);g.fill();
      g.fillStyle=C(32);
      g.beginPath();g.moveTo(2,-5);g.lineTo(-10,-24);g.lineTo(-15,-18);g.lineTo(-5,-5);g.closePath();g.fill();
      g.beginPath();g.moveTo(2,5);g.lineTo(-10,24);g.lineTo(-15,18);g.lineTo(-5,5);g.closePath();g.fill();
      g.fillStyle=C(40);
      g.beginPath();g.moveTo(18,0);g.lineTo(0,-6);g.lineTo(-14,-4);g.lineTo(-14,4);g.lineTo(0,6);g.closePath();g.fill();
      g.fillStyle=C(30);
      g.beginPath();g.moveTo(18,0);g.lineTo(0,-6);g.lineTo(0,0);g.closePath();g.fill();
      g.strokeStyle=C(15);g.lineWidth=1.2;
      g.beginPath();g.moveTo(18,0);g.lineTo(0,-6);g.lineTo(-14,-4);g.lineTo(-14,4);g.lineTo(0,6);g.closePath();g.stroke();
      g.fillStyle=C(20);for(const ey of[-15,15])g.fillRect(-11,ey-2.5,9,5);
      g.fillStyle='#ffb060';for(const ey of[-15,15]){g.beginPath();g.arc(-11,ey,2,0,7);g.fill()}
      g.fillStyle=ac;g.fillRect(2,-2.4,6,4.8);
    });
    return spr('Uraptor_'+fk,32,24,g=>{
      g.translate(16,12);
      g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(0,1,13,8,0,0,7);g.fill();
      g.fillStyle=C(40);
      g.beginPath();g.moveTo(14,0);g.lineTo(2,-10);g.lineTo(-12,-4);g.lineTo(-12,4);g.lineTo(2,10);g.closePath();g.fill();
      g.fillStyle=C(30);
      g.beginPath();g.moveTo(14,0);g.lineTo(2,-10);g.lineTo(2,0);g.closePath();g.fill();
      g.strokeStyle=C(15);g.lineWidth=1.2;
      g.beginPath();g.moveTo(14,0);g.lineTo(2,-10);g.lineTo(-12,-4);g.lineTo(-12,4);g.lineTo(2,10);g.closePath();g.stroke();
      g.fillStyle=ac;g.fillRect(-2,-2.2,7,4.4);
      g.fillStyle='#ffb060';g.beginPath();g.arc(-12,0,2.4,0,7);g.fill();
    });
  };
})();
