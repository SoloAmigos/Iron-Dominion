'use strict';
/* Lobby QoL — direct team picker.
   The base showLobby() wires each bot's "Team" button to cycle A→B→C… one
   tap at a time, which is tedious with many players. This wraps showLobby()
   so that, after each render, tapping a team button opens a small popup
   listing every team (A,B,C,D…) for a one-tap jump. Mirrors the uSpr() shim
   pattern in main.js — no need to re-push the large main.js. */
(function(){
  if(typeof showLobby!=='function')return;
  const _baseShowLobby=showLobby;
  showLobby=function(){
    _baseShowLobby.apply(this,arguments);
    if(typeof overlay==='undefined'||!overlay)return;
    function openPicker(btn,i){
      document.querySelectorAll('.team-pop').forEach(p=>p.remove());
      const pop=document.createElement('div');
      pop.className='team-pop';
      pop.style.cssText='position:fixed;z-index:200;display:flex;flex-wrap:wrap;gap:4px;padding:6px;background:#1c211a;border:1px solid #5a6b48;border-radius:4px;box-shadow:0 4px 14px rgba(0,0,0,.55);max-width:212px';
      let h='';
      for(let t=0;t<numSlots;t++){
        const sel=slotAlliance[i]===t;
        h+='<button class="dbtn" data-tt="'+t+'" style="min-width:34px;padding:5px 9px;font-weight:700'+(sel?';background:#7a8a4a;color:#10140d;border-color:#9fb066':'')+'">'+_TEAM_LETTERS[t%8]+'</button>';
      }
      pop.innerHTML=h;
      document.body.appendChild(pop);
      const br=btn.getBoundingClientRect();
      let left=br.left,top=br.bottom+4;
      if(left+pop.offsetWidth>innerWidth-8)left=innerWidth-pop.offsetWidth-8;
      if(left<8)left=8;
      if(top+pop.offsetHeight>innerHeight-8)top=br.top-pop.offsetHeight-4;
      pop.style.left=left+'px';pop.style.top=top+'px';
      for(const o of pop.querySelectorAll('[data-tt]'))o.onclick=ev=>{
        ev.stopPropagation();
        slotAlliance[i]=+o.dataset.tt;
        btn.textContent='Team '+_TEAM_LETTERS[slotAlliance[i]%8];
        pop.remove();uiClick();
      };
      setTimeout(()=>{
        const close=ev=>{if(pop.contains(ev.target)||ev.target===btn)return;pop.remove();document.removeEventListener('pointerdown',close,true)};
        document.addEventListener('pointerdown',close,true);
      },0);
    }
    for(const b of overlay.querySelectorAll('[data-ti]'))b.onclick=()=>{openPicker(b,+b.dataset.ti);uiClick();};
  };
})();
