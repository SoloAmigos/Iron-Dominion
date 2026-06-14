'use strict';
let state='menu',diffName='normal',D=DIFF.normal;
let units=[],builds=[],projs=[],parts=[],planes=[],piles=[],rocks=[],scraps=[],rubbles=[],fireZones=[];
let blocked=new Uint8Array(MAPW*MAPH),vis=new Uint8Array(MAPW*MAPH);
let money=[4000,4000],powerP=[0,0],powerU=[0,0],lowPow=[false,false];
let sel=[],placing=null;
let strikeCdMax=110,strikeBombs=3;
let cam={x:WW/2,y:WH/2,z:1},dpr=1,vw=0,vh=0;
let ids=1,gtime=0,fogT=0,powT=0,uiT=0,winT=1,aiT=0,sepT=0,miniT=0;
let underAttackCd=0,readyCd=0,hintStage=0,hintT=0,shake=0;
let ai=null,ais=[],groundCv=null,fogCv=null,fogImg=null;
const keys={};

// Fixed timestep
const SIM_DT=1/60;
let simFrame=0,simAcc=0,renderAlpha=1;
let matchSeed=1,inputQueue=[];

// Object pool caps
const PROJ_CAP=500,PART_CAP=700;

// Campaign
let campaign=null;

// Game speed and match stats
let gameSpeed=0.75;
let gameStats={kills:0,bldgs:0,moneyEarned:0};
