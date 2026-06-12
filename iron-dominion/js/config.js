'use strict';
/* ================= CONFIG ================= */
const TILE=40;
let MAPW=60,MAPH=40,WW=MAPW*TILE,WH=MAPH*TILE;
function setMapDims(w,h){MAPW=w;MAPH=h;WW=w*TILE;WH=h*TILE}

/* 8-team colour palette */
const ALL_TEAMC=['#4da3ff','#ff5147','#4dff80','#c966ff','#ff8c00','#00eeff','#ff66aa','#ffee00'];
const ALL_TEAMD=['#244a6e','#6e2424','#1a5c30','#3d1a6e','#6e3a00','#006e6e','#6e1a44','#6e5c00'];
let TEAMC=[...ALL_TEAMC], TEAMD=[...ALL_TEAMD];

/* Game-mode definitions */
const GAME_MODES={
  '1v1': {slots:2, alliances:[0,1],                    label:'1v1',   desc:'You vs 1 AI enemy'},
  '1v3': {slots:4, alliances:[0,1,1,1],                label:'1v3',   desc:'You vs 3 AI enemies'},
  '1v7': {slots:8, alliances:[0,1,1,1,1,1,1,1],        label:'1v7',   desc:'You vs 7 AI enemies (horde)'},
  '2v2': {slots:4, alliances:[0,1,0,1],                label:'2v2',   desc:'You + AI ally vs 2 enemies'},
  '4v4': {slots:8, alliances:[0,1,0,1,0,1,0,1],        label:'4v4',   desc:'You + 3 allies vs 4 enemies'},
  'ffa4':{slots:4, alliances:[0,1,2,3],                label:'FFA 4', desc:'4-way free-for-all'},
  'ffa8':{slots:8, alliances:[0,1,2,3,4,5,6,7],        label:'FFA 8', desc:'8-way free-for-all'},
};
let gameMode='1v1', numSlots=2, slotAlliance=[0,1];
let slotType=['human','medium'];  // per-slot: 'human'|'easy'|'medium'|'hard'

/* Per-AI difficulty presets */
const SLOT_DIFFS={
  easy:  {trickle:45,  cap:5,  wave:45, first:65, silo:false},
  medium:{trickle:100, cap:10, wave:25, first:35, silo:true},
  hard:  {trickle:175, cap:16, wave:16, first:20, silo:true},
};
function isEnemy(a,b){if(a===b||a<0||b<0)return false;if(!slotAlliance.length)return a!==b;return slotAlliance[a]!==slotAlliance[b]}

const MAPS={
  desert:{
    s2:{w:60,h:40, spawns:[[4,33],[55,5]],
      piles:[[18,28],[25,20],[38,14],[45,25]],
      neutrals:[{type:'oilrig',tx:30,ty:20},{type:'civil',tx:12,ty:15},{type:'civil',tx:48,ty:25}],
      rocks:[],walls:[],deco:'sand'},
    s4:{w:88,h:56, spawns:[[4,48],[83,5],[83,48],[4,5]],
      piles:[[20,40],[35,28],[55,28],[68,40],[20,15],[68,15],[44,48],[44,8]],
      neutrals:[{type:'oilrig',tx:44,ty:28},{type:'oilrig',tx:22,ty:28},{type:'oilrig',tx:66,ty:28},
        {type:'civil',tx:15,ty:22},{type:'civil',tx:70,ty:34},{type:'civil',tx:44,ty:40}],
      rocks:[],walls:[],deco:'sand'},
    s8:{w:120,h:76, spawns:[[4,68],[115,5],[115,68],[4,5],[59,68],[60,5],[4,36],[115,36]],
      piles:[[20,58],[50,18],[70,18],[100,58],[20,18],[100,18],[60,68],[60,8],[40,38],[80,38],[15,38],[105,38],[40,58],[80,58]],
      neutrals:[{type:'oilrig',tx:60,ty:38},{type:'oilrig',tx:30,ty:38},{type:'oilrig',tx:90,ty:38},
        {type:'oilrig',tx:60,ty:20},{type:'oilrig',tx:60,ty:56},
        {type:'civil',tx:20,ty:38},{type:'civil',tx:100,ty:38}],
      rocks:[],walls:[],deco:'sand'},
  },
  urban:{
    s2:{w:60,h:40, spawns:[[4,33],[55,5]],
      piles:[[15,30],[22,22],[40,18],[50,28]],
      neutrals:[{type:'oilrig',tx:22,ty:18},{type:'oilrig',tx:38,ty:22},{type:'civil',tx:10,ty:10},{type:'civil',tx:50,ty:30}],
      rocks:[{tx:25,ty:25},{tx:35,ty:15},{tx:20,ty:10}],walls:[],deco:'urban'},
    s4:{w:88,h:56, spawns:[[4,48],[83,5],[83,48],[4,5]],
      piles:[[18,42],[30,28],[58,28],[70,42],[18,14],[70,14],[44,50],[44,6]],
      neutrals:[{type:'oilrig',tx:44,ty:28},{type:'oilrig',tx:22,ty:28},{type:'oilrig',tx:66,ty:28},
        {type:'civil',tx:12,ty:24},{type:'civil',tx:72,ty:32},{type:'civil',tx:44,ty:42}],
      rocks:[{tx:30,ty:28},{tx:58,ty:28},{tx:44,ty:14},{tx:44,ty:42}],walls:[],deco:'urban'},
    s8:{w:120,h:76, spawns:[[4,68],[115,5],[115,68],[4,5],[59,68],[60,5],[4,36],[115,36]],
      piles:[[18,60],[50,20],[70,20],[102,60],[18,20],[102,20],[60,70],[60,8],[38,38],[82,38],[14,38],[106,38],[38,60],[82,60]],
      neutrals:[{type:'oilrig',tx:60,ty:38},{type:'oilrig',tx:30,ty:38},{type:'oilrig',tx:90,ty:38},
        {type:'oilrig',tx:60,ty:22},{type:'oilrig',tx:60,ty:54},
        {type:'civil',tx:20,ty:38},{type:'civil',tx:100,ty:38}],
      rocks:[{tx:40,ty:38},{tx:80,ty:38},{tx:60,ty:20},{tx:60,ty:56}],walls:[],deco:'urban'},
  },
  valley:{
    s2:{w:72,h:36, spawns:[[4,28],[67,6]],
      piles:[[20,24],[30,18],[42,14],[55,22]],
      neutrals:[{type:'oilrig',tx:36,ty:18},{type:'civil',tx:15,ty:20},{type:'civil',tx:57,ty:14}],
      rocks:[],walls:[[[24,10],[24,26]],[[48,10],[48,26]]],deco:'green'},
    s4:{w:96,h:64, spawns:[[4,56],[91,5],[91,56],[4,5]],
      piles:[[20,48],[38,32],[58,32],[76,48],[20,16],[76,16],[48,58],[48,6]],
      neutrals:[{type:'oilrig',tx:48,ty:32},{type:'oilrig',tx:24,ty:32},{type:'oilrig',tx:72,ty:32},
        {type:'civil',tx:16,ty:24},{type:'civil',tx:78,ty:40}],
      rocks:[],walls:[[[28,16],[28,48]],[[68,16],[68,48]]],deco:'green'},
    s8:{w:128,h:80, spawns:[[4,72],[123,5],[123,72],[4,5],[63,72],[64,5],[4,40],[123,40]],
      piles:[[20,64],[48,22],[80,22],[108,64],[20,22],[108,22],[64,74],[64,6],[32,40],[96,40],[14,40],[114,40],[48,64],[80,64]],
      neutrals:[{type:'oilrig',tx:64,ty:40},{type:'oilrig',tx:32,ty:40},{type:'oilrig',tx:96,ty:40},
        {type:'oilrig',tx:64,ty:22},{type:'oilrig',tx:64,ty:58},
        {type:'civil',tx:22,ty:40},{type:'civil',tx:104,ty:40}],
      rocks:[],walls:[[[36,20],[36,60]],[[92,20],[92,60]]],deco:'green'},
  },
};
let MAP=MAPS.desert.s2;
let chosenMap='desert';
function getMapVariant(mapKey,n){const m=MAPS[mapKey]||MAPS.desert;return n<=2?m.s2:n<=4?m.s4:m.s8}
function mapSpawns(map,n){return map.spawns.slice(0,n)}

/* ================= FACTIONS ================= */
const FACTIONS={
  vanguard:{key:'vanguard',name:'Vanguard Coalition',c:'#4da3ff',d:'#24496e',
    tag:'High-tech precision strikes',
    desc:'+10% weapon damage · Airstrike drops 4 bombs, 80s cooldown · Signatures: Paladin laser tank & Falcon drone · units cost +10%',
    dmg:1.10,ucost:1.10,bcost:1,uhp:1,bhp:1,spd:1,noPower:false,turretDmg:1,cheap:[],
    strikeCd:80,bombs:4,sigs:[{unit:'paladin',at:'factory'},{unit:'drone',at:'airfield'}],h:140,sat:9,
    names:{dozer:'Pioneer',truck:'Hauler',ranger:'Trooper',rocket:'Javelin Team',tank:'Crusader',arty:'Thunderer',
      command:'Field HQ',power:'Fusion Plant',supply:'Logistics Center',barracks:'Training Camp',factory:'Assembly Bay',
      turret:'Sentry Gun',market:'Supply Pad',tech:'Strategy Lab',silo:'Orbital Uplink'}},
  crimson:{key:'crimson',name:'Crimson Legion',c:'#ff5147',d:'#6e2424',
    tag:'Overwhelm with numbers',
    desc:'Tanks & infantry cost −15% · tanks +10% HP · Signatures: Dominator heavy tank & Inferno flame trooper',
    dmg:1,ucost:1,bcost:1,uhp:1,bhp:1,spd:1,noPower:false,turretDmg:1,cheap:['tank','ranger','rocket','inferno'],tankHp:1.10,
    strikeCd:110,bombs:3,sigs:[{unit:'dominator',at:'factory'},{unit:'inferno',at:'barracks'}],h:8,sat:15,
    names:{dozer:'Worker Rig',truck:'Ox Hauler',ranger:'Conscript',rocket:'Tank Hunter',tank:'Warlord',arty:'Dragonfire',
      command:'War Council',power:'Coal Plant',supply:'Quartermaster Depot',barracks:'Red Garrison',factory:'Iron Works',
      turret:'Bunker Gun',market:'State Foundry',tech:'Doctrine Bureau',silo:'Hellstorm Silo'}},
  scorpion:{key:'scorpion',name:'Scorpion Cartel',c:'#ffb02e',d:'#7a5210',
    tag:'Scavengers of the wastes',
    desc:'Needs NO power at all · buildings cost −10% · Signatures: Technical raider & Scarab bomb kart · units −10% HP · Vehicles scavenge wreck scraps for bonus damage',
    dmg:1,ucost:1,bcost:.9,uhp:.9,bhp:1,spd:1.05,noPower:true,turretDmg:1,cheap:[],
    strikeCd:110,bombs:3,sigs:[{unit:'technical',at:'factory'},{unit:'scarab',at:'factory'}],h:45,sat:20,
    names:{dozer:'Scrap Rig',truck:'Smuggler Van',ranger:'Raider',rocket:'Stinger Cell',tank:'Marauder',arty:'Junk Lobber',
      command:'Warlord Den',power:'Generator Shack',supply:'Stash House',barracks:'Recruit Tents',factory:'Chop Shop',
      turret:'Gun Nest',market:'Black Market',tech:'Smuggler Guild',silo:'Rocket Pit'}},
  northwind:{key:'northwind',name:'Northwind Pact',c:'#3fe0c8',d:'#176358',
    tag:'The unbreakable wall',
    desc:'Buildings +25% HP · turrets +25% damage · units +15% HP but −10% speed · Signatures: Guardian trooper & Mortar team',
    dmg:1,ucost:1,bcost:1,uhp:1.15,bhp:1.25,spd:.9,noPower:false,turretDmg:1.25,cheap:[],
    strikeCd:110,bombs:3,sigs:[{unit:'guardian',at:'barracks'},{unit:'mortar',at:'barracks'}],h:200,sat:13,
    names:{dozer:'Drift Dozer',truck:'Ice Hauler',ranger:'Watchman',rocket:'Pike Team',tank:'Glacier',arty:'Avalanche',
      command:'Citadel',power:'Geothermal Plant',supply:'Stockpile',barracks:'Garrison Hall',factory:'Forge Hall',
      turret:'Bastion Gun',market:'Trade Hub',tech:'Polar Institute',silo:'Aurora Battery'}},
};
const FACKEYS=['vanguard','crimson','scorpion','northwind'];
let fac=['vanguard','crimson'];
const FAC=t=>FACTIONS[fac[t]];
function dispName(kind,type,team){
  if(team<0)return kind==='b'?BT[type].name:UT[type].name;
  const f=FAC(team);
  return (f.names&&f.names[type])||(kind==='u'?UT[type].name:BT[type].name);
}

/* ================= GENERALS ================= */
const GENERALS={
  vanguard:[
    {id:'std',nm:'Standard',desc:'No modifier',ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1,locked:[],sigs:[]},
    {id:'air',nm:'Air General',desc:'Gunship & Raptor −20% cost · no tanks',ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1,locked:['tank','arty','dominator'],rapCost:.8,sigs:[{at:'airfield',unit:'gunship'}]},
  ],
  crimson:[
    {id:'std',nm:'Standard',desc:'No modifier',ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1,locked:[],sigs:[]},
    {id:'inf',nm:'Infantry General',desc:'Infantry −25% cost, +15% HP · no factory',ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1,locked:['tank','arty','dominator','paladin'],infCost:.75,infHp:1.15,sigs:[]},
  ],
  scorpion:[
    {id:'std',nm:'Standard',desc:'No modifier',ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1,locked:[],sigs:[]},
    {id:'toxin',nm:'Toxin General',desc:'Poison DOT on all attacks · units −10% HP',ucostMul:1,bcostMul:1,incomeMul:1,toxin:true,turretHpMul:1,locked:[],uhpMul:0.9,sigs:[]},
  ],
  northwind:[
    {id:'std',nm:'Standard',desc:'No modifier',ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1,locked:[],sigs:[]},
    {id:'def',nm:'Defense General',desc:'Turrets +50% HP, buildings +15% HP · units −18% attack',ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1.5,bHpMul:1.15,unitDmgMul:0.82,locked:[],sigs:[]},
  ],
};
let gens=['std','std']; // chosen general id per team
function GENMOD(t){const g=GENERALS[fac[t]];return g?g.find(x=>x.id===gens[t])||g[0]:{ucostMul:1,bcostMul:1,incomeMul:1,toxin:false,turretHpMul:1,locked:[]}}
function isLocked(type,team){return GENMOD(team).locked.includes(type)}

function costOf(kind,type,team){
  if(team<0)return 0;
  const f=FAC(team),gm=GENMOD(team);
  let c=kind==='u'?UT[type].cost:BT[type].cost;
  if(kind==='u'){c*=f.ucost*gm.ucostMul;if(f.cheap.includes(type))c*=.85}
  else c*=f.bcost*gm.bcostMul;
  return Math.round(c/25)*25;
}

const WPN={
  rifle:   {dmg:9,  rel:.6, rng:150, kind:'hit',                 splash:0,  mult:{inf:1,  veh:.3, bld:.18}},
  mg:      {dmg:26, rel:.85,rng:230, kind:'hit',                 splash:0,  mult:{inf:.9, veh:.65,bld:.3}},
  rocket:  {dmg:42, rel:2.4,rng:195, kind:'rocket', spd:300,     splash:22, mult:{inf:.55,veh:1,  bld:1},aa:true},
  cannon:  {dmg:46, rel:2.1,rng:185, kind:'shell',  spd:470,     splash:18, mult:{inf:.6, veh:1,  bld:.75}},
  howitzer:{dmg:80, rel:4.8,rng:330, kind:'arc',    spd:250, minRng:100, splash:50, mult:{inf:1,veh:.8,bld:1}},
  bomb:    {dmg:135,rel:1,  rng:1,   kind:'arc',    spd:300,     splash:72, mult:{inf:1,  veh:1,  bld:1}},
  laser:   {dmg:34, rel:1.0,rng:215, kind:'hit',  laser:true,   splash:0,  mult:{inf:.5, veh:1.15,bld:.6}},
  twin:    {dmg:36, rel:1.25,rng:185,kind:'shell', spd:470, twin:true, splash:14, mult:{inf:.6,veh:1, bld:.8}},
  mgT:     {dmg:20, rel:.5, rng:200, kind:'hit',                 splash:0,  mult:{inf:1,  veh:.5, bld:.25}},
  gmg:     {dmg:16, rel:.55,rng:175, kind:'hit',                 splash:0,  mult:{inf:1.1,veh:.45,bld:.3}},
  dgun:    {dmg:12, rel:.4, rng:190, kind:'hit',                 splash:0,  mult:{inf:.9, veh:.5, bld:.2}},
  flame:   {dmg:24, rel:.4, rng:115, kind:'hit',  flame:true,   splash:0,  mult:{inf:1.35,veh:.5, bld:.95}},
  mortar:  {dmg:55, rel:3.6,rng:280, kind:'arc',   spd:240, minRng:80, splash:36, mult:{inf:1.1,veh:.6,bld:.9}},
  boomkart:{dmg:260,rel:1,  rng:1,   kind:'hit',                 splash:60, mult:{inf:1,  veh:1,  bld:1.1}},
  nuke:        {dmg:1500,rel:1,rng:1,kind:'arc',  spd:300,splash:165,mult:{inf:1,  veh:1,  bld:1}},
  toxicNuke:   {dmg:600, rel:1,rng:1,kind:'arc',  spd:280,splash:120,mult:{inf:1.2,veh:.8, bld:.7},toxicSplash:true},
  barrageMsl:  {dmg:420, rel:1,rng:1,kind:'rocket',spd:360,splash:70, mult:{inf:1, veh:.9, bld:.8}},
  orbitalLaser:{dmg:1800,rel:1,rng:1,kind:'arc',  spd:900,splash:90, mult:{inf:1, veh:1.3,bld:1.2},orbital:true},
  agm:     {dmg:90, rel:3.5,rng:280, kind:'rocket',spd:420,      splash:28, mult:{inf:.7, veh:1.2,bld:1},aa:false},
  sam:     {dmg:65, rel:2.8,rng:260, kind:'rocket',spd:500,      splash:15, mult:{inf:.3, veh:.8, bld:.4},aa:true,aaOnly:true},
  bigbomb: {dmg:220,rel:6.5,rng:310, kind:'arc',   spd:260,      splash:185,mult:{inf:1.2,veh:1.1,bld:1.4},aa:false},
};
const UT={
  dozer:   {name:'Dozer',          ic:'🚜', cost:1000,bt:8, hp:300,spd:74, r:13,sight:5,cat:'veh', desc:'Constructs buildings',wc:2},
  truck:   {name:'Supply Truck',   ic:'🚚', cost:600, bt:6, hp:260,spd:102,r:13,sight:5,cat:'veh', desc:'Hauls supplies — auto',wc:2},
  ranger:  {name:'Ranger',         ic:'🪖', cost:200, bt:4, hp:95, spd:62, r:7, sight:6,cat:'inf', wpn:'rifle',  desc:'Anti-infantry',wc:1},
  rocket:  {name:'Rocket Trp',     ic:'🎯', cost:300, bt:5, hp:85, spd:56, r:7, sight:6,cat:'inf', wpn:'rocket', desc:'Anti-armor',wc:1},
  tank:    {name:'Brawler Tank',   ic:'🦏', cost:800, bt:9, hp:330,spd:88, r:14,sight:6,cat:'veh', wpn:'cannon', desc:'Main battle tank',wc:3},
  arty:    {name:'Howitzer',       ic:'💣', cost:1100,bt:12,hp:190,spd:64, r:14,sight:7,cat:'veh', wpn:'howitzer',desc:'Long-range siege',wc:2},
  paladin:   {name:'Paladin',       ic:'🔷', cost:1000,bt:10,hp:300,spd:92, r:14,sight:7,cat:'veh', wpn:'laser', desc:'Laser tank — melts armor',sig:true,wc:3},
  dominator: {name:'Dominator',     ic:'🐗', cost:1200,bt:13,hp:520,spd:64, r:15,sight:6,cat:'veh', wpn:'twin',  desc:'Heavy twin-cannon tank',sig:true,wc:3},
  technical: {name:'Technical',     ic:'🛻', cost:450, bt:5, hp:200,spd:130,r:13,sight:6,cat:'veh', wpn:'mgT',   desc:'Fast raider gun-truck',sig:true,wc:2},
  guardian:  {name:'Guardian',      ic:'🛡', cost:450, bt:6, hp:230,spd:54, r:8, sight:6,cat:'inf', wpn:'gmg',   desc:'Shielded heavy trooper',sig:true,wc:1},
  drone:     {name:'Falcon Drone',  ic:'🛸', cost:500, bt:6, hp:130,spd:142,r:11,sight:8,cat:'air', wpn:'dgun', desc:'Light attack drone — trains from Airfield',sig:true,wc:2,ammo:8},
  inferno:   {name:'Inferno Trooper',ic:'🔥',cost:350,bt:5, hp:100,spd:58, r:7, sight:6,cat:'inf', wpn:'flame',desc:'Close-range flamethrower',sig:true,wc:1},
  scarab:    {name:'Scarab Kart',   ic:'💥', cost:400, bt:5, hp:110,spd:150,r:11,sight:6,cat:'veh', suicide:'boomkart',desc:'Rams & explodes!',sig:true,wc:2},
  mortar:    {name:'Mortar Team',   ic:'🎇', cost:500, bt:6, hp:90, spd:52, r:8, sight:7,cat:'inf', wpn:'mortar',desc:'Long-range mortar',sig:true,wc:1},
  raptor:    {name:'Raptor',        ic:'✈️', cost:1400,bt:14,hp:220,spd:240,r:12,sight:9,cat:'air', wpn:'agm',   desc:'Jet fighter — RTB to rearm',sig:false,wc:2,ammo:4},
  gunship:   {name:'Gunship',       ic:'🚁', cost:1800,bt:16,hp:420,spd:115,r:14,sight:9,cat:'air', wpn:'agm',   desc:'Attack helicopter — Air General only',sig:true,wc:3,ammo:6},
  bomber:    {name:'Heavy Bomber',  ic:'🛩️', cost:2800,bt:22,hp:320,spd:62, r:20,sight:8,cat:'air', wpn:'bigbomb',desc:'Slow strategic bomber — devastating area payload',wc:4,ammo:3},
};
const BT={
  command:  {name:'Command Center', ic:'🏢', cost:2000,bt:20,hp:2600,w:4,h:4,pow:2,  trains:['dozer'],          desc:'HQ — trains Dozers'},
  power:    {name:'Power Plant',    ic:'⚡', cost:600, bt:8, hp:650, w:2,h:2,pow:-10,                            desc:'+10 power'},
  supply:   {name:'Supply Center',  ic:'📦', cost:1400,bt:10,hp:1300,w:3,h:3,pow:2,  trains:['truck'],          desc:'Drop-off + free truck'},
  barracks: {name:'Barracks',       ic:'🪖', cost:500, bt:8, hp:1100,w:3,h:2,pow:1,  trains:['ranger','rocket'],desc:'Trains infantry'},
  factory:  {name:'War Factory',    ic:'🏭', cost:2000,bt:14,hp:1600,w:4,h:3,pow:3,  trains:['tank','arty'],    desc:'Builds vehicles'},
  turret:   {name:'Guard Turret',   ic:'🗼', cost:900, bt:8, hp:950, w:2,h:2,pow:2,  wpn:'mg',                  desc:'Base defense — needs power'},
  market:   {name:'Market',         ic:'💰', cost:1500,bt:10,hp:900, w:2,h:2,pow:2,  income:180,                desc:'+$180 every 5s — passive income'},
  tech:     {name:'Tech Lab',       ic:'🔬', cost:1500,bt:12,hp:1000,w:3,h:2,pow:3,  lab:true,                  desc:'Unlocks army upgrades'},
  silo:     {name:'Missile Silo',   ic:'☢️', cost:4000,bt:22,hp:1500,w:3,h:3,pow:6,  silo:true,                 desc:'Superweapon — charges 150s'},
  civil:    {name:'Civil Structure',ic:'🏠', cost:0,   bt:0, hp:350, w:2,h:2,pow:0,  garrison:true,garrisonMax:4,desc:'Infantry can garrison inside'},
  oilrig:   {name:'Oil Derrick',    ic:'⛽', cost:0,   bt:0, hp:500, w:2,h:2,pow:0,  capturable:true,income:100,desc:'Capture with infantry for $100 every 5s'},
  airfield: {name:'Airfield',       ic:'✈️', cost:2500,bt:18,hp:1800,w:5,h:4,pow:4,  trains:['raptor','bomber'],pads:[[-1,-1],[1,-1],[-1,1],[1,1]],desc:'Trains & launches Raptors and Bombers'},
  samsite:  {name:'SAM Site',       ic:'🚀', cost:1200,bt:10,hp:900, w:2,h:2,pow:3,  wpn:'sam',                 desc:'Anti-air defense'},
  radar:    {name:'Radar Tower',    ic:'📡', cost:1100,bt:10,hp:700, w:2,h:2,pow:2,  sight:20,                  desc:'Wide-area sensors — reveals fog in a large radius'},
};
const BUILD_ORDER_UI=['power','barracks','factory','airfield','tech','turret','samsite','radar','silo','supply','market','command'];
const BUILD_CATEGORIES=[
  {id:'production', label:'Production', ic:'🏭', items:['barracks','factory','airfield','tech']},
  {id:'combat',     label:'Combat',     ic:'⚔️',  items:['turret','samsite','radar','silo']},
  {id:'economy',    label:'Economy',    ic:'💰',  items:['supply','market','command']},
];
const COMBAT=['ranger','rocket','tank','arty','paladin','dominator','technical','guardian','drone','inferno','scarab','mortar','raptor','gunship','bomber'];
const DIFF={
  easy:  {trickle:3, wave:120,first:220,cap:12,label:'EASY',silo:false},
  normal:{trickle:9, wave:95, first:160,cap:20,label:'NORMAL',silo:true},
  hard:  {trickle:18,wave:75, first:125,cap:28,label:'HARD',silo:true},
};

/* ===== Veterancy XP thresholds (unit-level ranks) ===== */
const VXPT=[200,600,1400]; // rank 1,2,3 unlock thresholds

/* ===== Scrap damage multipliers for Scorpion faction ===== */
const SCRAP_DMG=[1,1.15,1.3]; // level 0,1,2

const UPGS={
  w1: {nm:'Weapons I',    ic:'⚔️', cost:1200,need:null, f:'w', lv:1,desc:'+12% damage'},
  a1: {nm:'Armor I',      ic:'🛡️', cost:1200,need:null, f:'a', lv:1,desc:'+12% unit HP'},
  w2: {nm:'Weapons II',   ic:'⚔️', cost:2000,need:'w1', f:'w', lv:2,desc:'+24% damage total'},
  a2: {nm:'Armor II',     ic:'🛡️', cost:2000,need:'a1', f:'a', lv:2,desc:'+24% unit HP total'},
  mkt:{nm:'Black Market', ic:'💸', cost:1800,need:null, f:'mk',lv:1,desc:'+50% all passive market income'},
  cap:{nm:'Capture Protocol',ic:'🚩',cost:800,need:null,f:'cp',lv:1,desc:'Infantry can capture neutral Oil Derricks'},
};
let upg=[{w:0,a:0,mk:0,cp:0},{w:0,a:0,mk:0,cp:0}];
const upDmg=t=>1+.12*upg[t].w;
const upArm=t=>1+.12*upg[t].a;
const upMk=t=>upg[t].mk?1.5:1;

const POWERS={
  repair:{ic:'🔧',nm:'REPAIR',cd:70, rank:1, need:null,      hint:'Tap an area — repairs nearby friendly units & buildings'},
  drop:  {ic:'🪂',nm:'DROP',  cd:100,rank:2, need:'barracks',hint:'Tap an area — paradrops 3 infantry'},
  strike:{ic:'✈️',nm:'STRIKE',cd:110,rank:3, need:'factory', hint:'Tap anywhere on the map to call the strike'},
  nuke:  {ic:'☢️',nm:'LAUNCH',cd:0,  rank:0, need:'silo',    hint:'Tap the target — missile away!'},
};
let pw=null,targetPower=null;
function resetPowers(){
  pw={repair:{unl:false,on:true, cd:0},
      drop:  {unl:false,on:false,cd:0},
      strike:{unl:false,on:false,cd:0},
      nuke:  {unl:true, on:false,cd:0}};
  targetPower=null;
}
resetPowers();

const XPL=[0,500,1200,2200,3600,5400];
const MAXRANK=XPL.length;
let xp=[0,0],rank=[1,1],skp=[1,1];
function xpGain(team,amt){
  if(rank[team]>=MAXRANK){xp[team]+=amt;return}
  xp[team]+=amt;
  while(rank[team]<MAXRANK&&xp[team]>=XPL[rank[team]]){
    rank[team]++;skp[team]++;
    if(team===0){
      toast('⭐ Promotion! General rank '+rank[team]+' — skill point earned');
      SFX.done();
      if(typeof refreshPowers==='function')refreshPowers();
      if(typeof updateRankBtn==='function')updateRankBtn();
    }
  }
}
function unlockPower(team,k){
  const P=POWERS[k];
  if(!P||pw[k].unl)return false;
  if(P.rank>rank[team])return false;
  if(skp[team]<1)return false;
  skp[team]--;pw[k].unl=true;
  if(team===0){
    toast(P.ic+' '+P.nm+' unlocked!');SFX.done();
    pw[k].cd=Math.min(pw[k].cd||0,15);
    if(typeof refreshPowers==='function')refreshPowers();
    if(typeof updateRankBtn==='function')updateRankBtn();
  }
  return true;
}
