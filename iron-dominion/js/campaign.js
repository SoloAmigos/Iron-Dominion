'use strict';
/* ================= CAMPAIGN MISSION SCRIPTING ENGINE =================
   Missions are data objects:
   - map / fac / diff  : match parameters
   - intro             : narrative dialog lines shown before the mission
   - setup()           : ran after init() — preplace units, override AI
   - objectives[]      : sequential {desc, check()} condition objects;
                         optional {action} fires once when completed
   - failCheck()       : optional custom loss condition
   AI overrides ride on ai.script: {passive, waves:[{t,units[],warn}]}. */

const CAMPAIGN=[
  {
    id:'c1',nm:'First Strike',map:'desert',fac:'vanguard',diff:'easy',
    brief:'A weakened Cartel cell holds the north-east ridge. Wipe out their outpost before they dig in.',
    intro:[
      '📡 COMMAND: Commander, recon shows a Scorpion Cartel outpost north-east.',
      '📡 COMMAND: They are cut off from reinforcement. Build up and crush them.',
      '📡 COMMAND: Destroy every enemy structure. Good hunting.',
    ],
    setup(){
      ai.script={passive:false};
      ai.bo.length=6;                 // stunted enemy build order
      money[1]=1500;D=Object.assign({},D,{trickle:2,cap:8,silo:false});
    },
    objectives:[
      {desc:'Destroy all enemy structures',
        check:()=>!builds.some(b=>!b.dead&&b.team===1)},
    ],
  },
  {
    id:'c2',nm:'Hold the Line',map:'valley',fac:'northwind',diff:'normal',
    brief:'Enemy armor is funnelling through the river chokepoint. Survive the assault waves for 6 minutes.',
    intro:[
      '📡 COMMAND: Massive enemy columns inbound through the valley choke.',
      '📡 COMMAND: Fortify the pass. Turrets and Guardians will hold the wall.',
      '📡 COMMAND: Reinforcements arrive in six minutes. Do NOT lose your Command Center.',
    ],
    setup(){
      ai.script={passive:true,waves:[
        {t:60, units:['tank','ranger','ranger'],warn:'Enemy probe approaching the choke!'},
        {t:150,units:['tank','tank','rocket','rocket'],warn:'Armored column inbound!'},
        {t:240,units:['dominator','tank','tank','rocket','ranger','ranger'],warn:'Heavy assault detected!'},
        {t:310,units:['dominator','dominator','arty','tank','rocket','rocket'],warn:'FINAL PUSH — hold the line!'},
      ]};
      money[0]=6000;
      for(let i=0;i<3;i++)spawnUnit('guardian',0,cam.x+rand(-60,60),cam.y+rand(-40,40));
    },
    objectives:[
      {desc:'Survive until 06:00',check:()=>gtime>=360},
    ],
    failCheck:()=>!builds.some(b=>!b.dead&&b.team===0&&b.type==='command'),
  },
  {
    id:'c3',nm:'Black Gold',map:'urban',fac:'scorpion',diff:'normal',
    brief:'The city runs on oil. Seize both derricks with the Capture Protocol, then burn the enemy out.',
    intro:[
      '📡 COMMAND: This city bankrolls the entire enemy war effort.',
      '📡 COMMAND: Research the Capture Protocol and seize BOTH oil derricks.',
      '📡 COMMAND: Once the oil is ours, raze their base to the ground.',
    ],
    setup(){
      ai.script={passive:false};
      money[0]=5000;
    },
    objectives:[
      {desc:'Capture 2 Oil Derricks (research 🚩 Capture Protocol)',
        check:()=>builds.filter(b=>!b.dead&&b.type==='oilrig'&&b.team===0).length>=2,
        action:()=>toast('🎖 Objective complete — now destroy the enemy base!')},
      {desc:'Destroy all enemy structures',
        check:()=>!builds.some(b=>!b.dead&&b.team===1)},
    ],
  },
];

function showCampaignMenu(){
  let s='<div class="panel"><div class="eyebrow">SINGLE PLAYER</div><h1>CAMPAIGN</h1><div class="dbtns" style="flex-direction:column">';
  CAMPAIGN.forEach((m,i)=>{
    s+='<button class="dbtn" data-mi="'+i+'" style="width:100%">'+(i+1)+'. '+m.nm+'</button>';
  });
  s+='<button class="dbtn hard" id="campBack">← BACK</button></div>'+
    '<div class="fdesc" id="mdesc">Select a mission</div></div>';
  overlay.innerHTML=s;overlay.style.display='flex';
  for(const b of overlay.querySelectorAll('[data-mi]')){
    b.onmouseenter=()=>{const d=document.getElementById('mdesc');if(d)d.textContent=CAMPAIGN[b.dataset.mi].brief};
    b.onclick=()=>{SFX.click();startMission(+b.dataset.mi)};
  }
  document.getElementById('campBack').onclick=()=>{SFX.click();showMenu()};
}

function startMission(mi){
  const m=CAMPAIGN[mi];
  chosenFac=m.fac;chosenMap=m.map;
  init(m.diff);
  campaign={mi,oi:0};
  m.setup();
  state='pause';
  showMissionIntro(m,0);
}

function showMissionIntro(m,li){
  overlay.style.display='flex';
  overlay.innerHTML='<div class="panel"><div class="eyebrow">MISSION '+(campaign.mi+1)+'</div>'+
    '<h1>'+m.nm.toUpperCase()+'</h1>'+
    '<div class="sub" style="min-height:48px">'+m.intro[li]+'</div>'+
    '<div class="dbtns"><button class="dbtn" id="diaNext">'+(li<m.intro.length-1?'NEXT ▶':'⚔ BEGIN MISSION')+'</button></div>'+
    '<div class="fdesc">🎯 '+m.objectives[0].desc+'</div></div>';
  document.getElementById('diaNext').onclick=()=>{
    SFX.click();
    if(li<m.intro.length-1)showMissionIntro(m,li+1);
    else{overlay.style.display='none';state='play';toast('🎯 OBJECTIVE: '+m.objectives[0].desc)}
  };
}

/* Called on the 1s win-check timer inside the fixed sim step */
function updateCampaign(){
  const m=CAMPAIGN[campaign.mi];
  if(m.failCheck&&m.failCheck()){endGame(false);return}
  const obj=m.objectives[campaign.oi];
  if(obj&&obj.check()){
    if(obj.action)obj.action();
    campaign.oi++;
    if(campaign.oi>=m.objectives.length){
      endGame(true);
      campaign=null;
    }else{
      toast('🎯 NEW OBJECTIVE: '+m.objectives[campaign.oi].desc);
      SFX.done();
    }
  }
}
