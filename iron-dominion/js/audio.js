'use strict';
let AC=null,muted=false;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,du,type,vol,slide){if(muted)return;const c=ac();if(!c)return;try{
  const o=c.createOscillator(),g=c.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,c.currentTime);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),c.currentTime+du);
  g.gain.setValueAtTime(vol||.05,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+du);
  o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+du+.02);}catch(e){}}
function noise(du,vol,fc){if(muted)return;const c=ac();if(!c)return;try{
  const n=c.sampleRate*du|0,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=fc||900;
  const g=c.createGain();g.gain.value=vol||.15;s.connect(f);f.connect(g);g.connect(c.destination);s.start();}catch(e){}}
const SFX={
  click:()=>tone(880,.05,'square',.04),
  err:()=>tone(150,.18,'sawtooth',.05),
  cash:()=>{tone(1200,.06,'square',.045);setTimeout(()=>tone(1650,.07,'square',.045),60)},
  shoot:()=>tone(210,.045,'square',.022,-130),
  rocket:()=>noise(.25,.05,2600),
  boom:b=>{noise(b?.55:.32,b?.28:.18,b?520:850);tone(72,.3,'sine',.11,-42)},
  nuke:()=>{noise(1.2,.4,400);tone(48,.9,'sine',.2,-20)},
  done:()=>{tone(660,.09,'triangle',.06);setTimeout(()=>tone(990,.12,'triangle',.06),95)},
  sel:()=>tone(520,.05,'triangle',.04),
  jet:()=>noise(.9,.12,3200),
  heal:()=>{tone(520,.1,'sine',.05);setTimeout(()=>tone(780,.12,'sine',.05),90)},
  squish:()=>{noise(.13,.12,320);tone(95,.12,'sine',.08,-55)},
};
