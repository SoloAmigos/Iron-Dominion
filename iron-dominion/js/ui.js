'use strict';
/* ================= UI / INPUT ================= */
const overlay=document.getElementById('overlay');
const cardEl=document.getElementById('card');
const toastsEl=document.getElementById('toasts');
let cardQ=null; // queue progress element ref
let selMode=false,lpTimer=null,dozI=-1;
let openCat=null; // which dozer build category is expanded
function setSelMode(v){
  selMode=v;
  document.getElementById('selBtn').classList.toggle('on',v);
}
function clearLP(){if(lpTimer){clearTimeout(lpTimer);lpTimer=null}}
function resumeSite(site){
  let dz=sel.find(x=>x.kind==='u'&&x.type==='dozer'&&!x.dead&&x.team===0);
  if(!dz){let bd=1e9;for(const x of units)if(!x.dead&&x.team===0&&x.type==='dozer'&&!x.site){const d=dist2(x,site);if(d<bd){bd=d;dz=x}}}
  if(!dz){SFX.err();toast('🚜 No free Dozer — train one at the Command Center');return false}
  dz.site=site;dz.order=null;dz.attackTarget=null;dz.path=null;
  SFX.click();toast('🔧 Resuming construction');
  return true;
}
function cancelSite(b){
  blockRect(b.tx,b.ty,b.t.w,b.t.h,0);
  b.dead=true;
  const refund=Math.floor(costOf('b',b.type,0)*(1-b.prog));
  money[0]+=refund;
  for(let i=0;i<5;i++)addPart({k:'dust',x:b.x+vrand(-20,20),y:b.y+vrand(-16,16),vx:vrand(-10,10),vy:vrand(-18,-4),life:.6,max:.6,s:vrand(3,6)});
  toast('🗑 Construction cancelled — refunded $'+refund);SFX.click();
  sel=sel.filter(e=>e!==b);updateHUD();updateCard();
}

function toast(msg){
  const d=document.createElement('div');d.className='toast';d.textContent=msg;
  toastsEl.appendChild(d);
  while(toastsEl.children.length>4)toastsEl.firstChild.remove();
  setTimeout(()=>{if(d.parentNode)d.remove()},3600);
}
function updateHUD(){
  document.getElementById('money').textContent='$'+Math.floor(money[0]);
  const pe=document.getElementById('power');
  pe.textContent='⚡ '+powerU[0]+'/'+powerP[0];
  pe.classList.toggle('low',lowPow[0]);
  for(const k in pw){
    const el=document.getElementById('pw_'+k);if(!el)continue;
    if(k==='nuke'){
      let ch=0,ready=0;
      for(const b of builds)if(!b.dead&&b.built&&b.team===0&&b.t.silo){ch=Math.max(ch,b.charge||0);if((b.charge||0)>=1)ready++}
      el.disabled=ch<1;
      el.innerHTML='☢️<span class="pcd">'+(ready>1?'FIRE ×'+ready:(ch>=1?'FIRE':Math.floor(ch*100)+'%'))+'</span>';
    }else{
      const P=pw[k];
      el.disabled=P.cd>0;
      el.innerHTML=POWERS[k].ic+'<span class="pcd">'+(P.cd>0?Math.ceil(P.cd)+'s':POWERS[k].nm)+'</span>';
    }
    el.classList.toggle('arm',targetPower===k);
  }
}
function refreshPowers(){
  const box=document.getElementById('powers');
  box.innerHTML='';
  for(const k in pw){
    if(!pw[k].on||!pw[k].unl)continue;
    const b=document.createElement('button');
    b.className='pbtn';b.id='pw_'+k;
    b.onclick=()=>{
      if(state!=='play')return;
      if(k==='nuke'){
        let ch=0;for(const bb of builds)if(!bb.dead&&bb.built&&bb.team===0&&bb.t.silo)ch=Math.max(ch,bb.charge||0);
        if(ch<1){SFX.err();toast('☢️ Missile still charging…');return}
      }else if(pw[k].cd>0){SFX.err();return}
      targetPower=targetPower===k?null:k;
      SFX.click();updateHUD();
      if(targetPower)toast(POWERS[k].ic+' '+POWERS[k].hint);
    };
    box.appendChild(b);
  }
  updateHUD();
}
function mkBtn(ic,nm,cost,cls,fn){
  const b=document.createElement('button');b.className='cbtn'+(cls?' '+cls:'');
  const icH=ic.startsWith('data:')?'<img class="icimg" src="'+ic+'">':ic;
  b.innerHTML='<span class="ic">'+icH+'</span><span class="nm">'+nm+'</span>'+(cost?'<span class="cost">$'+cost+'</span>':'');
  if(cost)b.dataset.cost=cost;
  b.onclick=fn;return b;
}
function mkInfo(html){const d=document.createElement('div');d.className='cinfo';d.innerHTML=html;return d}
let genOpen=false;
function updateRankBtn(){
  const b=document.getElementById('rankBtn');if(!b)return;
  b.textContent='⭐'+rank[0];
  b.classList.toggle('pts',skp[0]>0);
}
function genPanel(){
  const next=rank[0]<MAXRANK?XPL[rank[0]]:null;
  const prog=next?Math.floor(xp[0])+'/'+next+' XP':'MAX RANK';
  cardEl.appendChild(mkInfo('<b>⭐ General — Rank '+rank[0]+'</b>'+prog+' · Skill points: '+skp[0]+'<br>Earn XP by destroying the enemy'));
  for(const k of['repair','drop','strike']){
    const P=POWERS[k],st=pw[k];
    let label,cls='',fn;
    if(st.unl){label=P.nm+' ✓';cls='confirm';fn=()=>SFX.click()}
    else if(rank[0]<P.rank){label=P.nm+' — Rank '+P.rank;cls='warn';fn=()=>{SFX.err();toast('🔒 Reach General rank '+P.rank+' first')}}
    else if(skp[0]<1){label=P.nm+' — 1pt';cls='warn';fn=()=>{SFX.err();toast('⭐ No skill points — earn a promotion')}}
    else{label='UNLOCK '+P.nm;fn=()=>{unlockPower(0,k);updateCard()}}
    const btn=mkBtn(P.ic,label,0,cls,fn);
    cardEl.appendChild(btn);
  }
  cardEl.appendChild(mkBtn('✕','Close',0,'cancel',()=>{genOpen=false;updateCard()}));
}
function updateCard(){
  cardEl.innerHTML='';cardQ=null;
  if(state!=='play')return;
  if(placing){
    const t=BT[placing.type];
    cardEl.appendChild(mkInfo('<b>'+t.ic+' '+dispName('b',placing.type,0)+'</b>'+t.desc+'<br>Drag map / tap to position'));
    cardEl.appendChild(mkBtn('✓','PLACE',0,'confirm',confirmPlace));
    cardEl.appendChild(mkBtn('✕','Cancel',0,'cancel',()=>{placing=null;SFX.click();updateCard()}));
    return;
  }
  if(genOpen){genPanel();return}
  if(!sel.length)return;
  const e=sel[0];
  if(sel.length===1&&e.kind==='b'){
    const b=e;
    if(!b.built){
      const working=units.some(x=>!x.dead&&x.team===0&&x.type==='dozer'&&x.site===b);
      cardEl.appendChild(mkInfo('<b>'+b.t.ic+' '+dispName('b',b.type,0)+'</b>'+(working?'Building… ':'⚠️ Halted at ')+Math.floor(b.prog*100)+'%'));
      if(!working)cardEl.appendChild(mkBtn('▶','Resume',0,'confirm',()=>resumeSite(b)));
      cardEl.appendChild(mkBtn('🗑','Cancel build',0,'warn',()=>cancelSite(b)));
      cardEl.appendChild(mkBtn('✕','Deselect',0,'cancel',()=>{sel=[];updateCard()}));
      return;
    }
    if(b.t.trains){
      cardEl.appendChild(mkInfo('<b>'+b.t.ic+' '+dispName('b',b.type,0)+'</b>Tap ground to set rally point'));
      const roster=b.t.trains.slice();
      for(const sg of FAC(0).sigs)if(sg.at===b.type&&!roster.includes(sg.unit))roster.push(sg.unit);
      const gmSigs=GENMOD(0).sigs||[];
      for(const sg of gmSigs)if(sg.at===b.type&&!roster.includes(sg.unit))roster.push(sg.unit);
      for(const ut of roster){
        if(isLocked(ut,0))continue;
        const ucat=UT[ut]&&UT[ut].cat;
        if(b.type==='airfield'&&ucat!=='air')continue;
        if(b.type!=='airfield'&&ucat==='air')continue;
        const t=UT[ut],c=costOf('u',ut,0);
        cardEl.appendChild(mkBtn(iconURL('u',ut,0),dispName('u',ut,0),c,t.sig?'sig':'',()=>{
          if(money[0]<c){SFX.err();toast('💰 Not enough funds');return}
          if(b.type==='airfield'){
            const alive=(b.padUnits||[]).filter(p=>p&&!p.dead).length;
            if(alive+b.queue.length>=4){SFX.err();toast('Airfield at capacity — 4 pad limit');return}
          }else if(b.queue.length>=5){SFX.err();toast('Queue is full');return}
          money[0]-=c;b.queue.push({type:ut,p:0});SFX.click();updateHUD();updateCard();
        }));
      }
      if(b.queue.length){
        const d=document.createElement('div');d.className='cinfo';
        const qrow=document.createElement('div');qrow.className='qrow';
        for(let i=0;i<b.queue.length;i++){
          const it=b.queue[i];
          const chip=document.createElement('button');chip.className='qchip';chip.title='Tap to cancel';
          const img=document.createElement('img');img.className='qimg';img.src=iconURL('u',it.type,0);
          chip.appendChild(img);
          if(i===0){const sp=document.createElement('span');sp.id='qp';chip.appendChild(sp)}
          const _i=i; // capture index
          chip.onclick=()=>{
            const cost=costOf('u',it.type,0);
            const refund=_i===0?Math.floor(cost*(1-Math.min(1,it.p/(UT[it.type].bt||1)))):cost;
            b.queue.splice(_i,1);money[0]+=refund;
            SFX.click();toast('↩ '+dispName('u',it.type,0)+' cancelled — refunded $'+refund);
            updateHUD();updateCard();
          };
          qrow.appendChild(chip);
        }
        d.appendChild(qrow);
        const lbl=document.createElement('span');lbl.style.fontSize='11px';lbl.textContent='Queue '+b.queue.length+'/5 · tap to cancel';
        d.appendChild(lbl);
        cardEl.appendChild(d);cardQ={b,el:null};
      }
    }else if(b.t.lab){
      cardEl.appendChild(mkInfo('<b>'+b.t.ic+' '+dispName('b',b.type,0)+'</b>Research army upgrades:'));
      for(const id in UPGS){
        const U=UPGS[id];
        const done=upg[0][U.f]>=U.lv;
        const locked=U.need&&upg[0][UPGS[U.need].f]<UPGS[U.need].lv;
        const btn=mkBtn(U.ic,U.nm+(done?' ✓':''),done?0:U.cost,done?'confirm':(locked?'warn':''),()=>{
          if(done){SFX.click();return}
          if(locked){SFX.err();toast('🔒 Research '+UPGS[U.need].nm+' first');return}
          if(!buyUpgrade(0,id)){SFX.err();toast('💰 Need $'+U.cost)}
          else updateCard();
        });
        if(done)btn.disabled=false;
        cardEl.appendChild(btn);
      }
    }else if(b.t.silo){
      const ch=Math.floor((b.charge||0)*100);
      cardEl.appendChild(mkInfo('<b>'+b.t.ic+' '+dispName('b',b.type,0)+'</b>'+(ch>=100?'☢️ MISSILE READY — use the LAUNCH button':'Charging… '+ch+'%'+(lowPow[0]?' (slowed: LOW POWER)':''))));
    }else if(b.t.garrison){
      const gn=b.garrison?b.garrison.length:0,gmax=b.t.garrisonMax;
      const owner=b.team===0?'Friendly':b.team<0?'Neutral':'Enemy';
      cardEl.appendChild(mkInfo('<b>'+b.t.ic+' '+b.t.name+'</b>'+owner+' · Garrison: '+gn+'/'+gmax+'<br>'+b.t.desc));
      if(b.team===0&&gn>0){
        cardEl.appendChild(mkBtn('🚪','Evacuate',0,'warn',()=>{
          if(b.garrison)for(const gu of b.garrison.slice()){gu.hidden=false;gu.garrisonBuilding=null;gu.x=b.x+rand(-24,24);gu.y=b.y+rand(-24,24)}
          b.garrison=[];b.team=-1;SFX.click();toast('Infantry evacuated');updateCard();
        }));
      }
    }else if(b.t.capturable){
      const owner=b.team===0?'Yours — earning $'+b.t.income+'/5s':b.team<0?'Neutral':'Enemy-held';
      cardEl.appendChild(mkInfo('<b>'+b.t.ic+' '+b.t.name+'</b>'+owner+'<br>'+b.t.desc));
      if(b.team!==0&&upg[0].cp)cardEl.appendChild(mkBtn('🚩','Capture',0,'confirm',()=>{
        const inf=sel.filter(u=>u.kind==='u'&&!u.dead&&u.cat==='inf'&&u.team===0);
        if(!inf.length){SFX.err();toast('Select infantry units first');return}
        for(const u of inf){u.isCapturing=true;u.captureTarget=b;u.captureProgress=0;u.order=null;u.attackTarget=null;u.path=null}
        SFX.click();toast('🚩 Infantry moving to capture');
      }));
    }else{
      cardEl.appendChild(mkInfo('<b>'+b.t.ic+' '+dispName('b',b.type,0)+'</b>'+b.t.desc));
    }
    cardEl.appendChild(mkBtn('✕','Deselect',0,'cancel',()=>{sel=[];updateCard()}));
    return;
  }
  // units selected
  const myUnits=sel.filter(s=>s.kind==='u');
  const dz=myUnits.find(u=>u.type==='dozer');
  if(dz){
    // Show active assignment with a cancel shortcut
    if(dz.site&&!dz.site.dead){
      const s=dz.site;
      cardEl.appendChild(mkInfo('<b>🔧 Building:</b> '+s.t.ic+' '+dispName('b',s.type,0)+' — '+Math.floor(s.prog*100)+'%'));
      cardEl.appendChild(mkBtn('🗑','Cancel',0,'warn',()=>cancelSite(s)));
    } else if(dz.fix&&!dz.fix.dead){
      const b=dz.fix;
      const pct=Math.round(b.hp/b.maxhp*100);
      cardEl.appendChild(mkInfo('<b>🔩 Repairing:</b> '+b.t.ic+' '+dispName('b',b.type,0)+' — '+pct+'% HP'));
      cardEl.appendChild(mkBtn('✕','Stop repair',0,'warn',()=>{dz.fix=null;dz.path=null;SFX.click();updateCard()}));
    }
    cardEl.appendChild(mkInfo('<b>🚜 '+dispName('u','dozer',0)+'</b>Pick a structure:'));
    const REQ={tech:'barracks',silo:'factory',airfield:'factory',samsite:'power',market:'tech',command:'tech'};
    const _bldBtn=bt=>{
      const t=BT[bt],bc=costOf('b',bt,0);
      const locked=!!(REQ[bt]&&!hasB(REQ[bt]));
      cardEl.appendChild(mkBtn(t.ic,dispName('b',bt,0)+(locked?' 🔒':''),locked?0:bc,
        t.silo?'sig':(locked?'warn':''),()=>{
          if(locked){SFX.err();toast('🔒 Requires '+dispName('b',REQ[bt],0)+' first');return}
          if(money[0]<bc){SFX.err();toast('💰 Need $'+bc);return}
          const tx=clamp(TT(cam.x)-Math.floor(t.w/2),1,MAPW-t.w-1);
          const ty=clamp(TT(cam.y)-Math.floor(t.h/2),1,MAPH-t.h-1);
          placing={type:bt,tx,ty,ok:false};SFX.click();updateCard();
          toast('Tap the map to position, then ✓ PLACE');
        }));
    };
    // Power — standalone priority button (hidden for factions that need no power)
    if(!FAC(0).noPower)_bldBtn('power');
    // Collapsible category sections
    for(const cat of BUILD_CATEGORIES){
      const isOpen=openCat===cat.id;
      const cb=document.createElement('button');
      cb.className='cbtn ccat-btn'+(isOpen?' open':'');
      cb.innerHTML='<span class="ic">'+(isOpen?'▾':'▸')+'</span><span class="nm">'+cat.ic+' '+cat.label+'</span>';
      cb.onclick=()=>{openCat=isOpen?null:cat.id;SFX.sel();updateCard()};
      cardEl.appendChild(cb);
      if(isOpen)for(const bt of cat.items)_bldBtn(bt);
    }
  }else{
    const names=myUnits.length===1?UT[myUnits[0].type].ic+' '+dispName('u',myUnits[0].type,0):'⚔ '+myUnits.length+' units';
    cardEl.appendChild(mkInfo('<b>'+names+'</b>Tap ground to move · tap enemy to attack'));
  }
  cardEl.appendChild(mkBtn('🛑','Stop',0,'warn',()=>{
    for(const u of myUnits){u.order=null;u.path=null;u.attackTarget=null;if(u.type==='dozer')u.site=null;if(u.type==='truck'&&u.cargo>0)u.ts='toDepot'}
    SFX.click();
  }));
  cardEl.appendChild(mkBtn('✕','Deselect',0,'cancel',()=>{sel=[];updateCard()}));
}
function refreshCard(){
  for(const b of cardEl.querySelectorAll('.cbtn[data-cost]'))b.disabled=money[0]<+b.dataset.cost;
  if(cardQ){
    if(!cardQ.b.queue.length||cardQ.b.dead){updateCard();return}
    const el=document.getElementById('qp');
    if(el)el.textContent=Math.floor(cardQ.b.queue[0].p/UT[cardQ.b.queue[0].type].bt*100)+'%';
  }
}
function confirmPlace(){
  if(!placing)return;
  const t=BT[placing.type],bc=costOf('b',placing.type,0);
  if(money[0]<bc){SFX.err();toast('💰 Not enough funds');return}
  if(!canPlace(placing.type,placing.tx,placing.ty,0)){SFX.err();toast('🚫 Cannot place here — find clear, explored ground');return}
  money[0]-=bc;
  const site=placeBuilding(placing.type,0,placing.tx,placing.ty,false);
  // assign a dozer: prefer selected, else nearest free
  let dz=sel.find(u=>u.kind==='u'&&u.type==='dozer'&&!u.dead);
  if(!dz){
    let bd=1e9;
    for(const u of units)if(!u.dead&&u.team===0&&u.type==='dozer'){const d=dist2(u,site);if(d<bd){bd=d;dz=u}}
  }
  if(dz){dz.site=site;dz.order=null;dz.attackTarget=null;dz.path=null}
  placing=null;SFX.build();updateHUD();updateCard();
}

/* ---------- pointer input ---------- */
let pts=new Map(),pinch=null,panMode=false,downAt=null,boxStart=null;
let lastTapT=0,lastTapId=0;
function screenToWorld(px,py){return{x:(px-vw/2)/cam.z+cam.x,y:(py-vh/2)/cam.z+cam.y}}
const CAMPADX=180,CAMPADY=280;
function clampCam(){
  const hx=vw/2/cam.z,hy=vh/2/cam.z;
  cam.x=clamp(cam.x,Math.min(hx,WW/2)-CAMPADX,Math.max(WW-hx,WW/2)+CAMPADX);
  cam.y=clamp(cam.y,Math.min(hy,WH/2)-CAMPADY,Math.max(WH-hy,WH/2)+CAMPADY);
}
function hitTest(wx,wy){
  let best=null,bd=1e9;
  for(const u of units){
    if(u.dead||u.hidden)continue;
    if(isEnemy(0,u.team)&&tileVisAt(u.x,u.y)!==2)continue;
    const d=Math.hypot(u.x-wx,u.y-wy);
    if(d<u.t.r+13&&d<bd){bd=d;best=u}
  }
  if(best)return best;
  for(const b of builds){
    if(b.dead)continue;
    if(isEnemy(0,b.team)&&vis[idx(b.tx,b.ty)]===0)continue;
    if(wx>=b.tx*TILE&&wx<=(b.tx+b.t.w)*TILE&&wy>=b.ty*TILE&&wy<=(b.ty+b.t.h)*TILE)return b;
  }
  for(const p of piles){
    if(p.amt>0&&Math.abs(wx-p.x)<TILE&&Math.abs(wy-p.y)<TILE)return p;
  }
  return null;
}
function commandGround(wx,wy){
  let i=0;
  for(const u of sel){
    if(u.kind!=='u'||u.dead)continue;
    const[ox,oy]=formOff(i++);
    if(u.type==='dozer'){u.site=null;orderMove(u,wx+ox,wy+oy,'move')}
    else if(u.type==='truck')orderMove(u,wx+ox,wy+oy,'move'),u.ts='idle',u.retry=1.6,u.pile=null;
    else orderMove(u,wx+ox,wy+oy,'am');
  }
  if(i)SFX.click();
}
function commandTarget(hit){
  if(hit.kind==='b'&&hit.team===0&&!hit.built&&sel.some(x=>x.kind==='u'&&x.type==='dozer'&&!x.dead)){
    return resumeSite(hit);
  }
  if(hit.kind==='b'&&hit.team===0&&hit.built&&hit.hp<hit.maxhp){
    let n=0;
    for(const u of sel)if(u.kind==='u'&&u.type==='dozer'&&!u.dead){u.fix=hit;u.site=null;u.order=null;u.attackTarget=null;u.path=null;u.repath=0;n++}
    if(n){SFX.click();toast('🔧 Dozer repairing '+dispName('b',hit.type,0));return true}
  }
  // Garrison: infantry into a civil structure (neutral or friendly)
  if(hit.kind==='b'&&hit.t&&hit.t.garrison&&!isEnemy(0,hit.team)){
    const inf=sel.filter(u=>u.kind==='u'&&!u.dead&&u.cat==='inf'&&u.team===0);
    if(inf.length){
      for(const u of inf)orderGarrison(u,hit);
      SFX.click();toast('🏠 Infantry moving to garrison');return true;
    }
  }
  // Capture: infantry capture a neutral oil derrick
  if(hit.kind==='b'&&hit.t&&hit.t.capturable&&hit.team!==0){
    const inf=sel.filter(u=>u.kind==='u'&&!u.dead&&u.cat==='inf'&&u.team===0);
    if(inf.length){
      if(!upg[0].cp){SFX.err();toast('🔒 Research Capture Protocol at the Tech Lab first');return true}
      for(const u of inf){
        u.isCapturing=true;u.captureTarget=hit;u.captureProgress=0;
        u.order=null;u.attackTarget=null;u.path=null;
      }
      SFX.click();toast('🚩 Infantry moving to capture Oil Derrick');return true;
    }
    if(upg[0].cp)toast('⛽ Select infantry to capture this derrick');
    return false;
  }
  if(hit.kind==='p'){
    let n=0;
    for(const u of sel)if(u.kind==='u'&&u.type==='truck'&&!u.dead){
      u.pile=hit;u.ts='toPile';u.path=findPath(u.x,u.y,hit.x,hit.y);u.wpi=0;u.retry=1;n++;
    }
    if(n){SFX.click();return true}
    return false;
  }
  if(isEnemy(0,hit.team)){
    let n=0;
    for(const u of sel)if(u.kind==='u'&&!u.dead&&(COMBAT.includes(u.type)))orderAttack(u,hit),n++;
    if(n){SFX.click();return true}
  }
  return false;
}
function selectEnt(e){
  genOpen=false;
  sel=[e];SFX.sel();updateCard();
  // double tap: select all of same type on screen
  const now=performance.now();
  if(e.kind==='u'&&e.id===lastTapId&&now-lastTapT<380){
    sel=units.filter(u=>!u.dead&&u.team===0&&u.type===e.type&&Math.abs(u.x-cam.x)<vw/2/cam.z+40&&Math.abs(u.y-cam.y)<vh/2/cam.z+40);
    toast(UT[e.type].ic+' Selected '+sel.length+' × '+dispName('u',e.type,0));
    updateCard();
  }
  lastTapId=e.id;lastTapT=now;
}
function tap(px,py,isCmd){
  if(state!=='play')return;
  const{x:wx,y:wy}=screenToWorld(px,py);
  if(targetPower){
    const k=targetPower;targetPower=null;
    if(k==='strike'&&pw.strike.cd<=0)launchStrike(wx,wy);
    else if(k==='repair'&&pw.repair.cd<=0)doRepair(wx,wy);
    else if(k==='drop'&&pw.drop.cd<=0)doDrop(wx,wy);
    else if(k==='nuke')launchNuke(wx,wy);
    updateHUD();return;
  }
  if(placing){
    const t=BT[placing.type];
    placing.tx=clamp(Math.round(wx/TILE-t.w/2),1,MAPW-t.w-1);
    placing.ty=clamp(Math.round(wy/TILE-t.h/2),1,MAPH-t.h-1);
    return;
  }
  const hit=hitTest(wx,wy);
  if(isCmd){ // right-click style command
    if(hit&&commandTarget(hit))return;
    if(sel.length===1&&sel[0].kind==='b'&&sel[0].team===0&&sel[0].t.trains&&sel[0].built){
      sel[0].rally={x:wx,y:wy};SFX.click();return;
    }
    commandGround(wx,wy);return;
  }
  // contextual tap (touch) / left click
  if(hit){
    if(hit.kind==='p'){
      if(!commandTarget(hit))toast('📦 Supplies: $'+hit.amt+' — send a Supply Truck');
      return;
    }
    if(hit.team===0){
      if(hit.kind==='b'&&!hit.built&&sel.some(x=>x.kind==='u'&&x.type==='dozer'&&!x.dead)){resumeSite(hit);return}
      // Let commandTarget handle repair/garrison before falling back to selection
      if(sel.some(s=>s.kind==='u')&&commandTarget(hit))return;
      selectEnt(hit);return;
    }
    if(hit.team<0){  // neutral building
      if(commandTarget(hit))return;
      selectEnt(hit);return;
    }
    if(commandTarget(hit))return;
    toast('Enemy '+dispName(hit.kind==='u'?'u':'b',hit.type,1));
    return;
  }
  // ground
  if(sel.length===1&&sel[0].kind==='b'&&sel[0].team===0&&sel[0].t.trains&&sel[0].built){
    sel[0].rally={x:wx,y:wy};SFX.click();toast('🚩 Rally point set');return;
  }
  if(sel.some(s=>s.kind==='u'))commandGround(wx,wy);
  else sel=[],updateCard();
}
cv.addEventListener('pointerdown',e=>{
  cv.setPointerCapture(e.pointerId);
  pts.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now(),btn:e.button,type:e.pointerType});
  if(pts.size===2){
    const[a,b]=[...pts.values()];
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,w=screenToWorld(mx,my);
    pinch={d0:Math.hypot(a.x-b.x,a.y-b.y),z0:cam.z,wx:w.x,wy:w.y};
    panMode=false;boxStart=null;boxSel=null;clearLP();
  }else if(pts.size===1){
    panMode=false;pinch=null;clearLP();
    const canBox=!placing&&!targetPower&&state==='play';
    if(e.pointerType==='mouse'&&e.button===0&&canBox)boxStart={x:e.clientX,y:e.clientY};
    else if(e.pointerType!=='mouse'&&canBox&&selMode){
      boxStart={x:e.clientX,y:e.clientY};
    }else{
      boxStart=null;
      // long-press starts box select on touch
      if(e.pointerType!=='mouse'&&canBox){
        const px=e.clientX,py=e.clientY,pid=e.pointerId;
        lpTimer=setTimeout(()=>{
          lpTimer=null;
          const q=pts.get(pid);
          if(q&&pts.size===1&&!panMode&&Math.hypot(q.x-q.sx,q.y-q.sy)<10){
            boxStart={x:q.x,y:q.y};
            boxSel={x0:q.x,y0:q.y,x1:q.x,y1:q.y};
            if(navigator.vibrate)navigator.vibrate(18);
            SFX.sel();toast('⬚ Drag to box-select');
          }
        },340);
      }
    }
  }
});
cv.addEventListener('pointermove',e=>{
  const p=pts.get(e.pointerId);if(!p)return;
  const dx=e.clientX-p.x,dy=e.clientY-p.y;
  p.x=e.clientX;p.y=e.clientY;
  if(pinch&&pts.size===2){
    const[a,b]=[...pts.values()];
    const nd=Math.hypot(a.x-b.x,a.y-b.y);
    cam.z=clamp(pinch.z0*nd/Math.max(20,pinch.d0),.45,1.7);
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    cam.x=pinch.wx-(mx-vw/2)/cam.z;
    cam.y=pinch.wy-(my-vh/2)/cam.z;
    clampCam();return;
  }
  if(pts.size!==1)return;
  if(boxStart){
    if(Math.hypot(e.clientX-boxStart.x,e.clientY-boxStart.y)>6)
      boxSel={x0:boxStart.x,y0:boxStart.y,x1:e.clientX,y1:e.clientY};
    return;
  }
  const moved=Math.hypot(e.clientX-p.sx,e.clientY-p.sy);
  if(moved>10)clearLP();
  if(panMode||moved>11){
    panMode=true;
    cam.x-=dx/cam.z;cam.y-=dy/cam.z;clampCam();
  }
});
function endPointer(e){
  clearLP();
  const p=pts.get(e.pointerId);
  pts.delete(e.pointerId);
  if(pts.size<2)pinch=null;
  if(!p)return;
  if(boxSel&&boxStart){
    const a=screenToWorld(Math.min(boxSel.x0,boxSel.x1),Math.min(boxSel.y0,boxSel.y1));
    const b=screenToWorld(Math.max(boxSel.x0,boxSel.x1),Math.max(boxSel.y0,boxSel.y1));
    const got=units.filter(u=>!u.dead&&u.team===0&&u.x>=a.x&&u.x<=b.x&&u.y>=a.y&&u.y<=b.y);
    const combat=got.filter(u=>COMBAT.includes(u.type));
    sel=combat.length?combat:got;
    if(sel.length){SFX.sel();toast('⬚ '+sel.length+' selected');updateCard()}
    boxSel=null;boxStart=null;setSelMode(false);return;
  }
  boxSel=null;boxStart=null;
  if(panMode&&pts.size===0){panMode=false;return}
  if(pts.size>0)return;
  const dt=performance.now()-p.t;
  const moved=Math.hypot(e.clientX-p.sx,e.clientY-p.sy);
  if(dt<650&&moved<=11)tap(e.clientX,e.clientY,p.btn===2);
}
cv.addEventListener('pointerup',endPointer);
cv.addEventListener('pointercancel',e=>{clearLP();pts.delete(e.pointerId);pinch=null;panMode=false;boxSel=null;boxStart=null});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('wheel',e=>{
  e.preventDefault();
  const w=screenToWorld(e.clientX,e.clientY);
  cam.z=clamp(cam.z*(e.deltaY<0?1.12:.89),.45,1.7);
  cam.x=w.x-(e.clientX-vw/2)/cam.z;
  cam.y=w.y-(e.clientY-vh/2)/cam.z;
  clampCam();
},{passive:false});
// minimap
function miniJump(e){
  const r=mcv.getBoundingClientRect();
  cam.x=clamp((e.clientX-r.left)/r.width*WW,0,WW);
  cam.y=clamp((e.clientY-r.top)/r.height*WH,0,WH);
  clampCam();
}
mcv.addEventListener('pointerdown',e=>{e.preventDefault();mcv.setPointerCapture(e.pointerId);miniJump(e)});
mcv.addEventListener('pointermove',e=>{if(e.buttons)miniJump(e)});
// keyboard
const ctrlGroups={};
addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(e.key==='Escape'){
    if(placing)placing=null,updateCard();
    else if(targetPower)targetPower=null,updateHUD();
    else sel=[],updateCard();
  }
  // Control groups: Ctrl+1..5 assign, 1..5 recall
  if(state==='play'&&/^[1-5]$/.test(e.key)){
    if(e.ctrlKey){
      e.preventDefault();
      const g=sel.filter(s=>s.kind==='u'&&!s.dead&&s.team===0);
      if(g.length){ctrlGroups[e.key]=g;toast('⌘ Group '+e.key+' assigned ('+g.length+' units)');SFX.click()}
    }else{
      const g=(ctrlGroups[e.key]||[]).filter(u=>!u.dead);
      if(g.length){
        sel=g;updateCard();SFX.sel();
        // double-tap the key to also center the camera
        const now=performance.now();
        if(ctrlGroups['_t'+e.key]&&now-ctrlGroups['_t'+e.key]<400){cam.x=g[0].x;cam.y=g[0].y;clampCam()}
        ctrlGroups['_t'+e.key]=now;
      }
    }
  }
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
// buttons
document.getElementById('armyBtn').onclick=()=>{
  const a=units.filter(u=>!u.dead&&u.team===0&&COMBAT.includes(u.type));
  if(!a.length){SFX.err();toast('No combat units yet — build a Barracks');return}
  sel=a;SFX.sel();toast('⚔ '+a.length+' units selected');updateCard();
};
document.getElementById('selBtn').onclick=()=>{
  if(state!=='play')return;
  setSelMode(!selMode);SFX.click();
  if(selMode)toast('⬚ Drag a box over your units');
};
document.getElementById('dozBtn').onclick=()=>{
  if(state!=='play')return;
  const all=units.filter(x=>!x.dead&&x.team===0&&x.type==='dozer');
  if(!all.length){SFX.err();toast('🚜 No Dozers — train one at the Command Center');return}
  const free=all.filter(x=>!x.site&&!x.fix);
  if(!free.length){SFX.err();toast('🚜 All Dozers are busy');return}
  dozI=(dozI+1)%free.length;
  const d=free[dozI];
  sel=[d];cam.x=d.x;cam.y=d.y;clampCam();
  SFX.sel();updateCard();
};
document.getElementById('rankBtn').onclick=()=>{
  if(state!=='play')return;
  genOpen=!genOpen;if(genOpen)sel=[];
  SFX.click();updateCard();
};
document.getElementById('speedBtn').onclick=function(){
  if(state!=='play')return;
  gameSpeed=gameSpeed===1?2:gameSpeed===2?4:1;
  this.textContent=gameSpeed+'×';SFX.click();
};
document.getElementById('muteBtn').onclick=function(){muted=!muted;this.textContent=muted?'🔇':'🔊';applyMute()};
document.getElementById('muteBtn').textContent=muted?'🔇':'🔊';
document.getElementById('menuBtn').onclick=()=>{
  if(state==='play'){state='pause';showPause()}
  else if(state==='pause'){overlay.style.display='none';state='play'}
};
