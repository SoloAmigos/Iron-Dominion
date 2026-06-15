'use strict';
/* ═══════════════════════════════════════════════════════════════
   IRON DOMINION — AUDIO ENGINE v2
   All synthesis is procedural Web Audio API — no asset files.
   Architecture: master compressor → gain channels (sfx/ui/music)
                 + parallel reverb send for depth.
   ═══════════════════════════════════════════════════════════════ */

let AC=null, muted=false;
let _mG,_sG,_uG,_mxG,_rv,_rvOut;
let musicVol=0.48, sfxVol=0.9;
// Restore persisted audio prefs
try{
  const _s=JSON.parse(localStorage.getItem('id_audio')||'{}');
  if(typeof _s.m==='number')musicVol=_s.m;
  if(typeof _s.s==='number')sfxVol=_s.s;
  muted=!!_s.mu;
}catch(e){}
function _saveAudio(){try{localStorage.setItem('id_audio',JSON.stringify({m:musicVol,s:sfxVol,mu:muted}))}catch(e){}}

// ─── Engine init ──────────────────────────────────────────────
function ac(){
  if(!AC){
    try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
    const cmp=AC.createDynamicsCompressor();
    cmp.threshold.value=-14; cmp.knee.value=6;
    cmp.ratio.value=4; cmp.attack.value=0.005; cmp.release.value=0.1;
    cmp.connect(AC.destination);
    _mG =_G(1.0, cmp);      // master
    _sG =_G(sfxVol, _mG);   // sfx  (world sounds)
    _uG =_G(0.58, _mG);     // ui   (interface sounds)
    _mxG=_G(musicVol,_mG);  // music
    // Synthetic reverb — exponentially-decaying noise impulse
    _rv  = _mkRev(1.4);
    _rvOut=_G(0.16, _mG);
    _rv.connect(_rvOut);
  }
  if(AC.state==='suspended') AC.resume();
  return AC;
}
function _G(v,d){const g=AC.createGain();g.gain.value=v;if(d)g.connect(d);return g}
function _mkRev(s){
  const c=AC,sr=c.sampleRate,len=sr*s|0,b=c.createBuffer(2,len,sr);
  for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.7)}
  const cv=c.createConvolver();cv.buffer=b;return cv;
}

// ─── Low-level synth primitives ─────────────────────────────────────────
// Oscillator with attack + exponential decay. Returns the osc so callers can ramp frequency.
function _O(t,f,tp,dur,vol,dst,att,f2){
  if(!AC)return null;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type=tp||'sine'; o.frequency.setValueAtTime(f,t);
  if(f2!=null) o.frequency.exponentialRampToValueAtTime(Math.max(10,f2),t+dur*0.85);
  att=att||0.003;
  g.gain.setValueAtTime(0.0001,t);
  g.gain.linearRampToValueAtTime(vol,t+att);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(dst||_sG);
  o.start(t); o.stop(t+dur+0.05);
  return o;
}
// Filtered noise burst. rvAmt>0 sends a copy to the reverb bus.
function _N(t,dur,vol,fc,ft,dst,rvAmt){
  if(!AC)return;
  const c=AC,sr=c.sampleRate;
  const buf=c.createBuffer(1,Math.ceil(sr*(dur+0.15)),sr);
  const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  const s=c.createBufferSource(); s.buffer=buf;
  const f=c.createBiquadFilter(); f.type=ft||'lowpass'; f.frequency.value=fc||1200;
  const g=c.createGain();
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(f); f.connect(g); g.connect(dst||_sG);
  if(rvAmt&&_rv){const rg=c.createGain();rg.gain.value=rvAmt;g.connect(rg);rg.connect(_rv)}
  s.start(t); s.stop(t+dur+0.15);
}

// ─── Drum kit (used by music sequencer) ──────────────────────────────────
function _kick(t,v){
  // Sub-bass sine sweep: 150Hz → 32Hz — the foundation of every good kick
  const o=AC.createOscillator(), g=AC.createGain();
  o.type='sine';
  o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(32,t+0.1);
  g.gain.setValueAtTime(v||0.62,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.32);
  o.connect(g); g.connect(_mxG); o.start(t); o.stop(t+0.36);
  // Click transient
  _N(t,0.01,0.28,5000,'highpass',_mxG);
}
function _snare(t,v){
  // Tonal body
  _O(t,220,'triangle',0.15,v||0.38,_mxG,0.001);
  // Noise layer — the "snap"
  const rg=AC.createGain(); rg.gain.value=0.25; _rv&&rg.connect(_rv);
  _N(t,0.18,(v||0.38)*0.95,3000,'bandpass',_mxG,0.28);
}
function _hihat(t,v,open){
  _N(t,open?0.2:0.034,v||0.22,open?7500:9200,'highpass',_mxG);
}
function _clap(t){
  // Two short noise bursts slightly apart mimic finger-clap timing
  _N(t,    0.025,0.3,2800,'bandpass',_mxG);
  _N(t+0.01,0.04,0.22,2400,'bandpass',_mxG,0.2);
}
function _bassnote(t,hz,v){
  // Sawtooth bass through a snappy resonant low-pass — punchy and warm
  const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();
  o.type='sawtooth'; o.frequency.value=hz;
  f.type='lowpass'; f.Q.value=3.5;
  f.frequency.setValueAtTime(900,t); f.frequency.exponentialRampToValueAtTime(160,t+0.2);
  g.gain.setValueAtTime(0.0001,t);
  g.gain.linearRampToValueAtTime(v||0.32,t+0.008);
  g.gain.setValueAtTime(v||0.32,t+0.065);
  g.gain.exponentialRampToValueAtTime(0.0001,t+0.26);
  o.connect(f); f.connect(g); g.connect(_mxG); o.start(t); o.stop(t+0.3);
}
function _chordstab(t){
  // Am power chord: root + fifth + octave (sawtooth → lowpass)
  for(const hz of [110,165,220]){
    const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();
    o.type='sawtooth'; o.frequency.value=hz;
    f.type='lowpass'; f.frequency.value=1600; f.Q.value=1.8;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.07,t+0.006);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.11);
    o.connect(f); f.connect(g); g.connect(_mxG);
    if(_rv){const rg=AC.createGain();rg.gain.value=0.3;g.connect(rg);rg.connect(_rv)}
    o.start(t); o.stop(t+0.14);
  }
}
// Atmospheric pad: slow-attack, sustained drone
function _pad(t,hz,dur,v){
  const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();
  o.type='sawtooth'; o.frequency.value=hz;
  f.type='lowpass'; f.frequency.value=600; f.Q.value=0.8;
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v||0.04,t+1.2);
  g.gain.setValueAtTime(v||0.04,t+dur-0.8); g.gain.linearRampToValueAtTime(0.0001,t+dur);
  o.connect(f); f.connect(g);
  if(_rv){const rg=AC.createGain();rg.gain.value=0.5;g.connect(rg);rg.connect(_rv)}
  g.connect(_mxG); o.start(t); o.stop(t+dur+0.05);
}

// ─── Music sequencer ─────────────────────────────────────────────────────
// Key: A minor. Bass notes in Hz (0 = rest).
const _A1=55,_B1=61.7,_C2=65.4,_D2=73.4,_E2=82.4,_F2=87.3,_G2=98,_A2=110;
// Each tier is an array of bar-length variations, cycled bar-by-bar so the
// loop evolves instead of repeating the same bar forever. All variants in a
// tier share one tempo (bpm read from variant 0 during the glide).
const _PAT={
  calm:[
    { // A — Am drone
      bpm:96,
      kick:  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hat:   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      ohat:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      bass:  [_A1,0,0,0,0,0,0,0,_A1,0,0,0,_E2,0,0,0],
      stab:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    },
    { // B — Am→F→C→G gentle movement
      bpm:96,
      kick:  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hat:   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
      ohat:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      bass:  [_A1,0,0,0,_F2,0,0,0,_C2,0,0,0,_G2,0,0,0],
      stab:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    },
    { // C — breakdown, lets the pad breathe
      bpm:96,
      kick:  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      snare: [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      hat:   [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
      ohat:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      bass:  [_A1,0,0,0,0,0,0,0,_E2,0,0,0,0,0,0,0],
      stab:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    },
  ],
  intense:[
    { // A — main groove
      bpm:118,
      kick:  [1,0,0,1,0,0,1,0,1,0,0,0,1,0,1,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hat:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ohat:  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
      bass:  [_A1,0,_E2,0,_A1,_D2,_E2,0,_A1,0,_C2,0,_E2,0,_G2,0],
      stab:  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    },
    { // B — driving, walking bass
      bpm:118,
      kick:  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hat:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ohat:  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
      bass:  [_A1,_A1,0,_C2,0,_D2,0,_E2,_A1,_A1,0,_C2,0,_E2,0,_F2],
      stab:  [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    },
    { // C — syncopated, aggressive
      bpm:118,
      kick:  [1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0],
      snare: [0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
      hat:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ohat:  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      bass:  [_A1,0,0,_E2,_A1,0,_G2,0,_A1,0,0,_E2,_F2,0,_E2,0],
      stab:  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    },
    { // D — fill: snare roll building into the next loop
      bpm:118,
      kick:  [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,0,0,0,0,1,0,1,0,1,1,1,1],
      hat:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ohat:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      bass:  [_A1,0,_E2,0,_A1,0,_E2,0,_A1,0,0,0,_E2,0,0,0],
      stab:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    },
  ],
};

const SEQ={step:0,bar:0,next:0,bpm:96,id:null,intensity:0,target:0,padNext:0};
const _LOOK=0.12; // schedule this many seconds ahead

function startMusic(){
  if(SEQ.id||muted)return;
  const c=ac(); if(!c)return;
  SEQ.step=0; SEQ.bar=0; SEQ.next=c.currentTime+0.08; SEQ.bpm=96;
  SEQ.padNext=c.currentTime;
  SEQ.id=setInterval(_seqTick,22);
}
function stopMusic(){
  if(SEQ.id){clearInterval(SEQ.id);SEQ.id=null}
  if(_mxG&&AC){
    const t=AC.currentTime;
    _mxG.gain.cancelScheduledValues(t);
    _mxG.gain.setValueAtTime(_mxG.gain.value,t);
    _mxG.gain.linearRampToValueAtTime(0.0001,t+1.8);
  }
}
function resumeMusic(){
  if(!SEQ.id&&!muted){startMusic();if(_mxG&&AC){_mxG.gain.cancelScheduledValues(AC.currentTime);_mxG.gain.setValueAtTime(0.0001,AC.currentTime);_mxG.gain.linearRampToValueAtTime(musicVol,AC.currentTime+0.8)}}
}
function setMusicIntensity(v){SEQ.target=Math.max(0,Math.min(1,v))}

function _seqTick(){
  if(!AC||muted)return;
  // Smoothly blend intensity
  const spd=SEQ.intensity<SEQ.target?0.004:0.0025;
  SEQ.intensity=SEQ.intensity<SEQ.target
    ?Math.min(SEQ.target,SEQ.intensity+spd)
    :Math.max(SEQ.target,SEQ.intensity-spd);

  const hi=SEQ.intensity>=0.5;
  const tier=hi?_PAT.intense:_PAT.calm;
  SEQ.bpm+=(tier[0].bpm-SEQ.bpm)*0.04; // glide BPM (variants share a tempo)
  const stepDur=60/(SEQ.bpm*4);  // 16th note duration

  while(SEQ.next<AC.currentTime+_LOOK){
    const s=SEQ.step,t=SEQ.next,iv=SEQ.intensity;
    const p=tier[SEQ.bar%tier.length]; // cycle bar variations for variety
    if(p.kick[s])  _kick(t, 0.52+iv*0.18);
    if(p.snare[s]) _snare(t,0.34+iv*0.14);
    if(p.hat[s])   _hihat(t,0.12+iv*0.1,false);
    if(p.ohat[s])  _hihat(t,0.18,true);
    if(p.bass[s])  _bassnote(t,p.bass[s],0.26+iv*0.09);
    if(p.stab[s])  _chordstab(t);
    // Ambient pad — fires every two bars (bar start) in calm mode
    if(!hi&&s===0&&t>SEQ.padNext){
      const barDur=stepDur*16;
      _pad(t,_A1,barDur*2-0.1,0.032);
      _pad(t,_E2*0.5,barDur*2-0.1,0.018); // octave sub
      SEQ.padNext=t+barDur*2;
    }
    SEQ.step++;
    if(SEQ.step>=16){SEQ.step=0;SEQ.bar=(SEQ.bar+1)%64}
    SEQ.next+=stepDur;
  }
}

// ─── SFX ──────────────────────────────────────────────────────────────────────
const SFX={
  // UI tap — clean metallic tick with a short high ring
  click:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,1300,'square',0.04,0.052,_uG,0.001);
    _N(t,0.018,0.028,7500,'highpass',_uG);
  },
  // Error — dissonant descending sawtooth pair
  err:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,270,'sawtooth',0.22,0.072,_uG,0.002,128);
    _O(t,278,'sawtooth',0.22,0.048,_uG,0.002,132);
  },
  // Money received — bright ascending chime
  cash:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,    1320,'sine',0.13,0.09,_uG,0.002);
    _O(t+0.07,1760,'sine',0.16,0.08,_uG,0.002);
    _O(t+0.14,2200,'sine',0.11,0.06,_uG,0.002);
  },
  // Rifle crack — bandpass noise burst + sub tick + short tail
  shoot:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _N(t,    0.024,0.22,5200,'bandpass');
    _N(t,    0.06, 0.07,1800,'lowpass');
    _O(t,190,'sine',0.042,0.065,_sG,0.001,95);
  },
  // Rocket launch — frequency-sweep whoosh + bass pop
  rocket:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    const buf=AC.createBuffer(1,AC.sampleRate*0.45,AC.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const s=AC.createBufferSource(); s.buffer=buf;
    const f=AC.createBiquadFilter(); f.type='bandpass'; f.Q.value=3;
    f.frequency.setValueAtTime(220,t); f.frequency.exponentialRampToValueAtTime(4500,t+0.32);
    const g=AC.createGain(); g.gain.setValueAtTime(0.26,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.45);
    s.connect(f); f.connect(g); g.connect(_sG); s.start(t); s.stop(t+0.5);
    _O(t,100,'sine',0.12,0.12,_sG,0.001);
  },
  // Explosion — layered sub + body + crack + tail, with reverb
  boom:(big)=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    if(big){
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='sine'; o.frequency.setValueAtTime(82,t); o.frequency.exponentialRampToValueAtTime(26,t+0.28);
      g.gain.setValueAtTime(0.58,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.52);
      o.connect(g); g.connect(_sG); o.start(t); o.stop(t+0.56);
      _N(t,    0.58, 0.48, 700,'lowpass', _sG, 0.45);
      _N(t,    0.07, 0.44,5500,'bandpass',_sG);
      _N(t+0.1,1.1,  0.14, 320,'lowpass', _sG, 0.55); // long reverberant tail
    } else {
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='sine'; o.frequency.setValueAtTime(110,t); o.frequency.exponentialRampToValueAtTime(36,t+0.16);
      g.gain.setValueAtTime(0.34,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.32);
      o.connect(g); g.connect(_sG); o.start(t); o.stop(t+0.36);
      _N(t,0.34,0.3,1200,'lowpass',_sG,0.3);
      _N(t,0.05,0.26,4800,'bandpass',_sG);
    }
  },
  // Nuke — massive full-spectrum detonation, very long tail
  nuke:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    const o=AC.createOscillator(),g=AC.createGain();
    o.type='sine'; o.frequency.setValueAtTime(64,t); o.frequency.exponentialRampToValueAtTime(18,t+0.6);
    g.gain.setValueAtTime(0.72,t); g.gain.exponentialRampToValueAtTime(0.0001,t+1.4);
    o.connect(g); g.connect(_sG); o.start(t); o.stop(t+1.5);
    _N(t,    1.4, 0.55, 9000,'lowpass', _sG, 0.65);
    _N(t,    2.2, 0.28,  260,'lowpass', _sG, 0.8);  // sub rumble
    _N(t,    0.09,0.62, 6000,'bandpass',_sG);         // crack
    _N(t+0.25,3.0,0.12, 180,'lowpass', _sG, 0.9);   // ultra-long tail
  },
  // Construction complete — major triad arpeggio
  done:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,    523,'sine',0.15,0.08,_uG,0.003); // C5
    _O(t+0.1,659,'sine',0.17,0.07,_uG,0.003); // E5
    _O(t+0.2,784,'sine',0.19,0.1, _uG,0.003); // G5
  },
  // Unit selected — quick pitch-up blip
  sel:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,580,'sine',0.06,0.042,_uG,0.002,1150);
  },
  // Jet engine — broadband roar with sawtooth carrier
  jet:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _N(t,0.9,0.13,3000,'bandpass');
    _N(t,0.9,0.07, 500,'lowpass');
    _O(t,88,'sawtooth',0.85,0.065,_sG,0.025);
  },
  // Heal — warm rising minor third
  heal:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,    440,'sine',0.16,0.065,_uG,0.005);
    _O(t+0.09,554,'sine',0.18,0.06, _uG,0.005);
    _O(t+0.18,659,'sine',0.16,0.055,_uG,0.005);
  },
  // Unit death — low thud with decaying noise (flesh/metal mix)
  squish:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _N(t,0.16,0.22,380,'lowpass');
    _O(t,88,'sine',0.14,0.1,_sG,0.001,38);
  },
  // Building placement — metallic clank
  build:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,600,'square',0.065,0.075,_uG,0.001,290);
    _N(t,0.045,0.065,3200,'bandpass',_uG);
  },
  // Alert / warning
  alert:()=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    _O(t,    880,'square',0.09,0.065,_uG,0.001);
    _O(t+0.13,660,'square',0.09,0.055,_uG,0.001);
  },
  // Unit voice acknowledgement — short blip per category (inf/veh/air)
  voice:(cat)=>{
    if(muted)return; const c=ac(); if(!c)return; const t=c.currentTime;
    if(cat==='air'){
      _O(t,    1100,'sine',0.06,0.04,_uG,0.002,1420);
      _O(t+0.05,1420,'sine',0.05,0.032,_uG,0.001);
    } else if(cat==='inf'){
      _O(t,720,'sine',0.06,0.05,_uG,0.002,900);
    } else {
      _O(t,440,'sawtooth',0.05,0.055,_uG,0.002,320);
    }
  },
};

// Legacy shim — units.js calls tone() directly for laser sound
function tone(f,du,type,vol,slide){
  if(muted)return; const c=ac(); if(!c)return;
  _O(c.currentTime,f,type,du,vol||0.04,_sG,0.003,slide?f+slide:undefined);
}

// ─── Volume / mute API ──────────────────────────────────────────────
function setMusicVol(v){
  musicVol=Math.max(0,Math.min(1,v));
  if(_mxG&&AC&&!muted) _mxG.gain.setTargetAtTime(musicVol,AC.currentTime,0.08);
  _saveAudio();
}
function setSfxVol(v){
  sfxVol=Math.max(0,Math.min(1,v));
  if(_sG&&AC) _sG.gain.setTargetAtTime(sfxVol,AC.currentTime,0.05);
  _saveAudio();
}
// Low-power alarm — repeating two-tone pulse while under-powered
let _lpAlarmId=null;
function startLowPowAlarm(){
  if(_lpAlarmId||muted)return;
  _lpAlarmId=setInterval(()=>{
    if(muted||!AC)return;
    const c=ac();if(!c)return;const t=c.currentTime;
    _O(t,    440,'square',0.05,0.08,_uG,0.001,370);
    _O(t+0.18,370,'square',0.04,0.07,_uG,0.001);
  },2400);
}
function stopLowPowAlarm(){
  if(_lpAlarmId){clearInterval(_lpAlarmId);_lpAlarmId=null}
}

// Called by mute button — handles music fade in/out
function applyMute(){
  _saveAudio();
  if(!AC)return;
  if(muted){
    stopMusic();
    _mG.gain.setTargetAtTime(0.0001,AC.currentTime,0.04);
  } else {
    _mG.gain.setTargetAtTime(1.0,AC.currentTime,0.06);
    resumeMusic();
  }
}
