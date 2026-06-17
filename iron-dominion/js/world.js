'use strict';
/* ================= WORLD ================= */
function genWorld(mapKey,slots,skipNeutrals){
  MAP=getMapVariant(mapKey||chosenMap||'desert',slots||numSlots||2);
  setMapDims(MAP.w,MAP.h);
  shInit();
  blocked=new Uint8Array(MAPW*MAPH);vis=new Uint8Array(MAPW*MAPH);
  piles=[];rocks=[];

  for(const[tx,ty]of MAP.piles){
    const amt=42000+Math.floor(srandom()*14000);
    piles.push({kind:'p',tx,ty,x:(tx+1)*TILE,y:(ty+1)*TILE,amt,max:amt});
  }

  const onPile=(tx,ty)=>{for(const p of piles)if(Math.abs(tx-p.tx-1)<2.5&&Math.abs(ty-p.ty-1)<2.5)return true;return false};

  const spawn0=MAP.spawns[0],spawn1=MAP.spawns[1];
  const safe=(tx,ty)=>{
    if(Math.hypot(tx-spawn0[0]-2,ty-spawn0[1]-2)<10)return false;
    if(Math.hypot(tx-spawn1[0]-2,ty-spawn1[1]-2)<10)return false;
    for(const p of piles)if(Math.abs(tx-p.tx-1)<3.5&&Math.abs(ty-p.ty-1)<3.5)return false;
    return true;
  };

  for(let c=0;c<26;c++){
    let tx=1+Math.floor(srandom()*(MAPW-2)),ty=1+Math.floor(srandom()*(MAPH-2));
    if(!safe(tx,ty))continue;
    const n=1+Math.floor(srandom()*4);
    for(let k=0;k<n;k++){
      if(inB(tx,ty)&&safe(tx,ty)&&!blocked[idx(tx,ty)]){blocked[idx(tx,ty)]=1;rocks.push({tx,ty,v:srandom()})}
      tx+=Math.round(rand(-1,1));ty+=Math.round(rand(-1,1));
    }
  }

  for(const r of (MAP.rocks||[])){
    if(inB(r.tx,r.ty)&&!blocked[idx(r.tx,r.ty)]&&!onPile(r.tx,r.ty)){
      blocked[idx(r.tx,r.ty)]=1;
      rocks.push({tx:r.tx,ty:r.ty,v:srandom()});
    }
  }

  for(const wall of (MAP.walls||[])){
    const[p1,p2]=wall;
    const dx=p2[0]-p1[0],dy=p2[1]-p1[1];
    const steps=Math.max(Math.abs(dx),Math.abs(dy));
    for(let s=0;s<=steps;s++){
      const tx=Math.round(p1[0]+dx*s/steps);
      const ty=Math.round(p1[1]+dy*s/steps);
      if(inB(tx,ty)&&!blocked[idx(tx,ty)]&&!onPile(tx,ty)){
        blocked[idx(tx,ty)]=1;
        rocks.push({tx,ty,v:srandom()});
      }
    }
  }

  for(const nd of (MAP.neutrals||[])){
    const t=BT[nd.type];let ok=true;
    for(let ny=nd.ty;ny<nd.ty+t.h&&ok;ny++)
      for(let nx=nd.tx;nx<nd.tx+t.w&&ok;nx++)
        if(!inB(nx,ny)||blocked[idx(nx,ny)])ok=false;
    const cx=nd.tx+t.w/2,cy=nd.ty+t.h/2;
    if(Math.hypot(cx-spawn0[0]-2,cy-spawn0[1]-2)<8)ok=false;
    if(Math.hypot(cx-spawn1[0]-2,cy-spawn1[1]-2)<8)ok=false;
    for(const p of piles)if(Math.abs(cx-p.tx-1)<4&&Math.abs(cy-p.ty-1)<4)ok=false;
    if(ok&&!skipNeutrals)placeBuilding(nd.type,-1,nd.tx,nd.ty,true);
  }
}
function blockRect(tx,ty,w,h,v){
  for(let y=ty;y<ty+h;y++)for(let x=tx;x<tx+w;x++)if(inB(x,y))blocked[idx(x,y)]=v;
}
function buildGround(){
  groundCv=document.createElement('canvas');groundCv.width=WW;groundCv.height=WH;
  const g=groundCv.getContext('2d');
  const deco=MAP.deco||'green';

  if(deco==='sand'){
    g.fillStyle='#c4a96a';g.fillRect(0,0,WW,WH);
    for(let i=0;i<1200;i++){
      const x=Math.random()*WW,y=Math.random()*WH,r=vrand(12,65);
      g.fillStyle=['#c9ae72','#b89a58','#d4b87a','#aa8d4e','#c2a463'][i%5];
      g.globalAlpha=vrand(.2,.55);g.beginPath();g.ellipse(x,y,r,r*vrand(.35,.85),vrand(0,3),0,7);g.fill();
    }
    g.globalAlpha=.45;
    for(let i=0;i<320;i++){
      g.fillStyle=i%2?'#d6ba80':'#a88848';
      g.fillRect(Math.random()*WW,Math.random()*WH,vrand(2,6),vrand(1,3));
    }
    g.globalAlpha=1;
    for(let i=0;i<60;i++){
      g.fillStyle='rgba(200,160,80,'+vrand(.08,.18)+')';
      g.beginPath();g.ellipse(Math.random()*WW,Math.random()*WH,vrand(30,90),vrand(8,28),vrand(0,3),0,7);g.fill();
    }
    const spawn0=MAP.spawns[0],spawn1=MAP.spawns[1];
    const decoOK=(tx,ty)=>{
      if(!inB(tx,ty)||blocked[idx(tx,ty)])return false;
      if(Math.hypot(tx-spawn0[0]-2,ty-spawn0[1]-2)<9)return false;
      if(Math.hypot(tx-spawn1[0]-2,ty-spawn1[1]-2)<9)return false;
      for(const p of piles)if(Math.abs(tx-p.tx-1)<3.5&&Math.abs(ty-p.ty-1)<3.5)return false;
      return true;
    };
    for(let i=0;i<45;i++){
      const tx=1+Math.random()*(MAPW-2)|0,ty=1+Math.random()*(MAPH-2)|0;
      if(!decoOK(tx,ty))continue;
      const x=tx*TILE+vrand(8,32),y=ty*TILE+vrand(8,32),r=vrand(3,7);
      g.fillStyle='rgba(0,0,0,.14)';g.beginPath();g.ellipse(x+2,y+3,r+2,r*.4,0,0,7);g.fill();
      g.fillStyle='#8b7040';g.fillRect(x-1,y,2,6);
      g.fillStyle='#7a8a38';g.beginPath();g.arc(x,y-3,r*.7,0,7);g.fill();
      g.fillStyle='#919e42';g.beginPath();g.arc(x-r*.2,y-5,r*.4,0,7);g.fill();
    }
    for(const r of rocks){
      const x=r.tx*TILE,y=r.ty*TILE;
      g.fillStyle='#b89060';g.beginPath();
      g.moveTo(x+6,y+30);g.lineTo(x+4+r.v*8,y+10);g.lineTo(x+20,y+3+r.v*6);g.lineTo(x+34,y+12);g.lineTo(x+36,y+32);g.lineTo(x+20,y+38);g.closePath();g.fill();
      g.fillStyle='#d4aa76';g.beginPath();g.moveTo(x+8,y+26);g.lineTo(x+8+r.v*6,y+12);g.lineTo(x+22,y+8);g.lineTo(x+28,y+18);g.lineTo(x+18,y+28);g.closePath();g.fill();
      g.fillStyle='#9e7a50';g.fillRect(x+8,y+32,24,4);
    }
    const vgd=g.createRadialGradient(WW*.38,WH*.32,WH*.3,WW*.5,WH*.5,WW*.72);
    vgd.addColorStop(0,'rgba(255,240,180,.06)');vgd.addColorStop(.6,'rgba(0,0,0,0)');vgd.addColorStop(1,'rgba(80,50,10,.28)');
    g.fillStyle=vgd;g.fillRect(0,0,WW,WH);
    g.fillStyle='#8c6030';g.fillRect(0,0,WW,14);g.fillRect(0,WH-14,WW,14);g.fillRect(0,0,14,WH);g.fillRect(WW-14,0,14,WH);
    g.strokeStyle='#6b4820';g.lineWidth=5;g.strokeRect(2,2,WW-4,WH-4);

  } else if(deco==='urban'){
    g.fillStyle='#4a4e48';g.fillRect(0,0,WW,WH);
    g.globalAlpha=0.18;
    for(let gx=0;gx<WW;gx+=80){g.strokeStyle='#6a6e66';g.lineWidth=1;g.beginPath();g.moveTo(gx,0);g.lineTo(gx,WH);g.stroke()}
    for(let gy=0;gy<WH;gy+=80){g.beginPath();g.moveTo(0,gy);g.lineTo(WW,gy);g.stroke()}
    g.globalAlpha=1;
    for(let i=0;i<900;i++){
      const x=Math.random()*WW,y=Math.random()*WH,r=vrand(10,55);
      g.fillStyle=['#525650','#484c46','#5a5e58','#424642','#5e6259'][i%5];
      g.globalAlpha=vrand(.15,.45);g.beginPath();g.ellipse(x,y,r,r*vrand(.5,.95),vrand(0,3),0,7);g.fill();
    }
    g.globalAlpha=.35;
    for(let i=0;i<180;i++){
      const x=Math.random()*WW,y=Math.random()*WH,l=vrand(8,40),a=vrand(0,Math.PI);
      g.strokeStyle='#333836';g.lineWidth=vrand(.8,2.2);g.globalAlpha=vrand(.3,.7);
      g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();
    }
    g.globalAlpha=1;
    const spawn0u=MAP.spawns[0],spawn1u=MAP.spawns[1];
    const decoOKu=(tx,ty)=>{
      if(!inB(tx,ty)||blocked[idx(tx,ty)])return false;
      if(Math.hypot(tx-spawn0u[0]-2,ty-spawn0u[1]-2)<9)return false;
      if(Math.hypot(tx-spawn1u[0]-2,ty-spawn1u[1]-2)<9)return false;
      for(const p of piles)if(Math.abs(tx-p.tx-1)<3.5&&Math.abs(ty-p.ty-1)<3.5)return false;
      return true;
    };
    for(let i=0;i<55;i++){
      const tx=1+Math.random()*(MAPW-2)|0,ty=1+Math.random()*(MAPH-2)|0;
      if(!decoOKu(tx,ty))continue;
      const x=tx*TILE+vrand(4,36),y=ty*TILE+vrand(4,36);
      g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x+2,y+2,vrand(8,22),vrand(6,16));
      g.fillStyle=['#5e6258','#686c62','#4e5248'][i%3];
      g.fillRect(x,y,vrand(8,22),vrand(6,16));
      g.fillStyle='#727870';g.fillRect(x+2,y+1,4,3);
    }
    for(const r of rocks){
      const x=r.tx*TILE,y=r.ty*TILE;
      g.fillStyle='#5a6058';g.beginPath();
      g.moveTo(x+6,y+30);g.lineTo(x+4+r.v*8,y+10);g.lineTo(x+20,y+3+r.v*6);g.lineTo(x+34,y+12);g.lineTo(x+36,y+32);g.lineTo(x+20,y+38);g.closePath();g.fill();
      g.fillStyle='#747c72';g.beginPath();g.moveTo(x+8,y+26);g.lineTo(x+8+r.v*6,y+12);g.lineTo(x+22,y+8);g.lineTo(x+28,y+18);g.lineTo(x+18,y+28);g.closePath();g.fill();
      g.fillStyle='#3e4440';g.fillRect(x+8,y+32,24,4);
    }
    const vgu=g.createRadialGradient(WW*.45,WH*.35,WH*.25,WW*.5,WH*.5,WW*.68);
    vgu.addColorStop(0,'rgba(200,210,190,.04)');vgu.addColorStop(.6,'rgba(0,0,0,0)');vgu.addColorStop(1,'rgba(10,14,8,.36)');
    g.fillStyle=vgu;g.fillRect(0,0,WW,WH);
    g.fillStyle='#2a2e28';g.fillRect(0,0,WW,14);g.fillRect(0,WH-14,WW,14);g.fillRect(0,0,14,WH);g.fillRect(WW-14,0,14,WH);
    g.strokeStyle='#181c16';g.lineWidth=5;g.strokeRect(2,2,WW-4,WH-4);

  } else if(deco==='snow'){
    g.fillStyle='#c4d0d8';g.fillRect(0,0,WW,WH);
    for(let i=0;i<800;i++){
      const x=Math.random()*WW,y=Math.random()*WH,r=vrand(15,75);
      g.fillStyle=['#c8d4dc','#b8c8d4','#d0dae2','#acbcc8','#d4dce4'][i%5];
      g.globalAlpha=vrand(.2,.5);g.beginPath();g.ellipse(x,y,r,r*vrand(.4,.9),vrand(0,3),0,7);g.fill();
    }
    g.globalAlpha=1;
    for(let i=0;i<55;i++){
      g.fillStyle='rgba(240,248,255,'+vrand(.18,.35)+')';
      g.beginPath();g.ellipse(Math.random()*WW,Math.random()*WH,vrand(45,110),vrand(8,22),vrand(0,2),0,7);g.fill();
    }
    for(let i=0;i<90;i++){
      const x=Math.random()*WW,y=Math.random()*WH,l=vrand(10,50),a=vrand(0,Math.PI);
      g.strokeStyle='#8099aa';g.lineWidth=vrand(.5,1.5);g.globalAlpha=vrand(.15,.45);
      g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();
    }
    g.globalAlpha=1;
    const spawn0sn=MAP.spawns[0],spawn1sn=MAP.spawns[1];
    const decoOKsn=(tx,ty)=>{
      if(!inB(tx,ty)||blocked[idx(tx,ty)])return false;
      if(Math.hypot(tx-spawn0sn[0]-2,ty-spawn0sn[1]-2)<9)return false;
      if(Math.hypot(tx-spawn1sn[0]-2,ty-spawn1sn[1]-2)<9)return false;
      for(const p of piles)if(Math.abs(tx-p.tx-1)<3.5&&Math.abs(ty-p.ty-1)<3.5)return false;
      return true;
    };
    for(let i=0;i<30;i++){
      const tx=1+Math.random()*(MAPW-2)|0,ty=1+Math.random()*(MAPH-2)|0;
      if(!decoOKsn(tx,ty))continue;
      const x=tx*TILE+vrand(8,32),y=ty*TILE+vrand(8,32);
      g.fillStyle='rgba(0,0,0,.10)';g.beginPath();g.ellipse(x+2,y+4,5,2.5,0,0,7);g.fill();
      g.fillStyle='#3c4a54';g.fillRect(x-1,y-1,2,7);
      g.fillStyle='#aabbc8';g.beginPath();g.moveTo(x,y-12);g.lineTo(x+6,y-2);g.lineTo(x-6,y-2);g.closePath();g.fill();
      g.fillStyle='#c8d8e4';g.beginPath();g.moveTo(x,y-16);g.lineTo(x+4,y-8);g.lineTo(x-4,y-8);g.closePath();g.fill();
    }
    for(const r of rocks){
      const x=r.tx*TILE,y=r.ty*TILE;
      g.fillStyle='#6e8090';g.beginPath();
      g.moveTo(x+6,y+30);g.lineTo(x+4+r.v*8,y+10);g.lineTo(x+20,y+3+r.v*6);g.lineTo(x+34,y+12);g.lineTo(x+36,y+32);g.lineTo(x+20,y+38);g.closePath();g.fill();
      g.fillStyle='#94a8b8';g.beginPath();g.moveTo(x+8,y+26);g.lineTo(x+8+r.v*6,y+12);g.lineTo(x+22,y+8);g.lineTo(x+28,y+18);g.lineTo(x+18,y+28);g.closePath();g.fill();
      g.fillStyle='rgba(230,240,248,.9)';g.beginPath();g.ellipse(x+20,y+7,12,5,0,0,7);g.fill();
      g.fillStyle='#506070';g.fillRect(x+8,y+32,24,4);
    }
    const vgsn=g.createRadialGradient(WW*.42,WH*.38,WH*.28,WW*.5,WH*.5,WW*.70);
    vgsn.addColorStop(0,'rgba(240,248,255,.06)');vgsn.addColorStop(.6,'rgba(0,0,0,0)');vgsn.addColorStop(1,'rgba(30,50,70,.30)');
    g.fillStyle=vgsn;g.fillRect(0,0,WW,WH);
    g.fillStyle='#5a7088';g.fillRect(0,0,WW,14);g.fillRect(0,WH-14,WW,14);g.fillRect(0,0,14,WH);g.fillRect(WW-14,0,14,WH);
    g.strokeStyle='#3a5060';g.lineWidth=5;g.strokeRect(2,2,WW-4,WH-4);
    g.strokeStyle='rgba(150,180,200,.30)';g.lineWidth=1.4;g.strokeRect(16,16,WW-32,WH-32);

  } else {
    g.fillStyle='#2b3a25';g.fillRect(0,0,WW,WH);
    for(let i=0;i<1100;i++){
      const x=Math.random()*WW,y=Math.random()*WH,r=vrand(14,70);
      g.fillStyle=['#2f4028','#293822','#33442b','#26331f','#36462e'][i%5];
      g.globalAlpha=vrand(.25,.6);g.beginPath();g.ellipse(x,y,r,r*vrand(.4,.9),vrand(0,3),0,7);g.fill();
    }
    g.globalAlpha=.5;
    for(let i=0;i<260;i++){
      g.fillStyle=i%2?'#3d4a33':'#222e1c';
      g.fillRect(Math.random()*WW,Math.random()*WH,vrand(2,5),vrand(2,5));
    }
    g.globalAlpha=1;
    for(let i=0;i<80;i++){
      g.fillStyle='rgba(64,52,34,'+vrand(.10,.22)+')';
      g.beginPath();g.ellipse(Math.random()*WW,Math.random()*WH,vrand(20,60),vrand(10,30),vrand(0,3),0,7);g.fill();
    }
    g.lineWidth=1.4;
    for(let i=0;i<650;i++){
      const x=Math.random()*WW,y=Math.random()*WH;
      g.strokeStyle=i%2?'#4f6a3a':'#43592f';g.globalAlpha=vrand(.4,.85);
      g.beginPath();g.moveTo(x,y);g.lineTo(x-2,y-5);g.moveTo(x,y);g.lineTo(x+1,y-6);g.moveTo(x,y);g.lineTo(x+3,y-4);g.stroke();
    }
    g.globalAlpha=1;
    const spawn0=MAP.spawns[0],spawn1=MAP.spawns[1];
    const decoOK=(tx,ty)=>{
      if(!inB(tx,ty)||blocked[idx(tx,ty)])return false;
      if(Math.hypot(tx-spawn0[0]-2,ty-spawn0[1]-2)<9)return false;
      if(Math.hypot(tx-spawn1[0]-2,ty-spawn1[1]-2)<9)return false;
      for(const p of piles)if(Math.abs(tx-p.tx-1)<3.5&&Math.abs(ty-p.ty-1)<3.5)return false;
      return true;
    };
    for(let i=0;i<75;i++){
      const tx=1+Math.random()*(MAPW-2)|0,ty=1+Math.random()*(MAPH-2)|0;
      if(!decoOK(tx,ty))continue;
      const x=tx*TILE+vrand(6,34),y=ty*TILE+vrand(6,34),r=vrand(5,9);
      g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x+2,y+3,r+2,r*.55,0,0,7);g.fill();
      g.fillStyle='#33502a';g.beginPath();g.arc(x,y,r,0,7);g.arc(x+r*.7,y+2,r*.7,0,7);g.fill();
      g.fillStyle='#446b36';g.beginPath();g.arc(x-r*.25,y-r*.3,r*.6,0,7);g.fill();
    }
    for(let i=0;i<42;i++){
      const tx=1+Math.random()*(MAPW-2)|0,ty=1+Math.random()*(MAPH-2)|0;
      if(!decoOK(tx,ty))continue;
      const x=tx*TILE+20,y=ty*TILE+20,r=vrand(10,15);
      g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(x+4,y+5,r+3,r*.5,0,0,7);g.fill();
      g.fillStyle='#3c2e1c';g.fillRect(x-2,y-2,4,8);
      g.fillStyle='#27411f';g.beginPath();g.arc(x,y-4,r,0,7);g.fill();
      g.fillStyle='#33522a';g.beginPath();g.arc(x-r*.2,y-6,r*.75,0,7);g.fill();
      g.fillStyle='#477036';g.beginPath();g.arc(x-r*.35,y-8,r*.42,0,7);g.fill();
    }
    for(const r of rocks){
      const x=r.tx*TILE,y=r.ty*TILE;
      g.fillStyle='#494f49';g.beginPath();
      g.moveTo(x+6,y+30);g.lineTo(x+4+r.v*8,y+10);g.lineTo(x+20,y+3+r.v*6);g.lineTo(x+34,y+12);g.lineTo(x+36,y+32);g.lineTo(x+20,y+38);g.closePath();g.fill();
      g.fillStyle='#5d655d';g.beginPath();g.moveTo(x+8,y+26);g.lineTo(x+8+r.v*6,y+12);g.lineTo(x+22,y+8);g.lineTo(x+28,y+18);g.lineTo(x+18,y+28);g.closePath();g.fill();
      g.fillStyle='#363b36';g.fillRect(x+8,y+32,24,4);
    }
    const vg=g.createRadialGradient(WW*.38,WH*.32,WH*.3,WW*.5,WH*.5,WW*.72);
    vg.addColorStop(0,'rgba(255,250,220,.05)');vg.addColorStop(.55,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(5,10,4,.34)');
    g.fillStyle=vg;g.fillRect(0,0,WW,WH);
    g.fillStyle='#20261c';g.fillRect(0,0,WW,14);g.fillRect(0,WH-14,WW,14);g.fillRect(0,0,14,WH);g.fillRect(WW-14,0,14,WH);
    g.strokeStyle='#10150c';g.lineWidth=5;g.strokeRect(2,2,WW-4,WH-4);
    g.strokeStyle='rgba(120,130,110,.25)';g.lineWidth=1.4;g.strokeRect(16,16,WW-32,WH-32);
  }

  fogCv=document.createElement('canvas');fogCv.width=MAPW;fogCv.height=MAPH;
  fogImg=fogCv.getContext('2d').createImageData(MAPW,MAPH);
}

/* ================= PATHFINDING ================= */
function freeNear(tx,ty){
  if(inB(tx,ty)&&!blocked[idx(tx,ty)])return{x:tx,y:ty};
  for(let r=1;r<=8;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
    if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
    const x=tx+dx,y=ty+dy;
    if(inB(x,y)&&!blocked[idx(x,y)])return{x,y};
  }
  return null;
}
function hpush(h,n){h.push(n);let i=h.length-1;while(i>0){const p=(i-1)>>1;if(h[p][0]<=h[i][0])break;const t=h[p];h[p]=h[i];h[i]=t;i=p}}
function hpop(h){const t=h[0],l=h.pop();if(h.length){h[0]=l;let i=0;for(;;){let s=i;const a=2*i+1,b=a+1;
  if(a<h.length&&h[a][0]<h[s][0])s=a;if(b<h.length&&h[b][0]<h[s][0])s=b;if(s===i)break;const x=h[s];h[s]=h[i];h[i]=x;i=s}}return t}
function losClear(x1,y1,x2,y2){
  const d=Math.hypot(x2-x1,y2-y1),steps=Math.max(1,Math.ceil(d/(TILE*.4)));
  for(let i=1;i<steps;i++){
    const x=x1+(x2-x1)*i/steps,y=y1+(y2-y1)*i/steps;
    if(blocked[idx(TT(x),TT(y))])return false;
  }
  return true;
}
function findPath(sx,sy,txw,tyw){
  let s=freeNear(clamp(TT(sx),0,MAPW-1),clamp(TT(sy),0,MAPH-1));
  let t=freeNear(clamp(TT(txw),0,MAPW-1),clamp(TT(tyw),0,MAPH-1));
  if(!s||!t)return null;
  if(s.x===t.x&&s.y===t.y)return[{x:txw,y:tyw}];
  const N=MAPW*MAPH,g=new Float32Array(N).fill(Infinity),came=new Int32Array(N).fill(-1),cl=new Uint8Array(N);
  const si=idx(s.x,s.y),ti=idx(t.x,t.y);
  const H=i=>{const x=i%MAPW,y=(i/MAPW)|0;return Math.hypot(x-t.x,y-t.y)};
  g[si]=0;const heap=[[H(si),si]];
  let best=si,bestH=H(si),exp=0,found=false;
  const DIRS=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.42],[1,-1,1.42],[-1,1,1.42],[-1,-1,1.42]];
  while(heap.length&&exp<4500){
    const[,ci]=hpop(heap);
    if(cl[ci])continue;cl[ci]=1;exp++;
    if(ci===ti){found=true;break}
    const hh=H(ci);if(hh<bestH){bestH=hh;best=ci}
    const cx=ci%MAPW,cy=(ci/MAPW)|0;
    for(const[dx,dy,c]of DIRS){
      const nx=cx+dx,ny=cy+dy;
      if(!inB(nx,ny))continue;
      const ni=idx(nx,ny);
      if(blocked[ni]||cl[ni])continue;
      if(dx&&dy&&(blocked[idx(cx+dx,cy)]||blocked[idx(cx,cy+dy)]))continue;
      const ng=g[ci]+c;
      if(ng<g[ni]){g[ni]=ng;came[ni]=ci;hpush(heap,[ng+H(ni),ni])}
    }
  }
  const end=found?ti:best;
  if(end===si)return null;
  let pts=[],i=end;
  while(i!==-1&&i!==si){pts.push({x:(i%MAPW)*TILE+TILE/2,y:((i/MAPW)|0)*TILE+TILE/2});i=came[i]}
  pts.reverse();
  if(found)pts[pts.length-1]={x:txw,y:tyw};
  const out=[];let a={x:sx,y:sy},k=0;
  while(k<pts.length){
    let j=pts.length-1;
    for(;j>k;j--)if(losClear(a.x,a.y,pts[j].x,pts[j].y))break;
    out.push(pts[j]);a=pts[j];k=j+1;
  }
  return out;
}
// Compatibility shim: units.js pathfinds in tile coordinates; findPath() works
// in world pixels and reads `blocked` directly.
function astar(stx,sty,gtx,gty){
  return findPath(stx*TILE+TILE/2,sty*TILE+TILE/2,gtx*TILE+TILE/2,gty*TILE+TILE/2);
}

/* ================= FOG ================= */
function stampVis(x,y,rt){
  const cx=TT(x),cy=TT(y),r2=rt*rt;
  for(let ty=Math.max(0,cy-rt);ty<=Math.min(MAPH-1,cy+rt);ty++)
    for(let tx=Math.max(0,cx-rt);tx<=Math.min(MAPW-1,cx+rt);tx++){
      const dx=tx-cx,dy=ty-cy;
      if(dx*dx+dy*dy<=r2)vis[idx(tx,ty)]=2;
    }
}
function updateFog(){
  for(let i=0;i<vis.length;i++)if(vis[i]===2)vis[i]=1;
  for(const u of units)if(!u.dead&&u.team>=0&&!isEnemy(0,u.team))stampVis(u.x,u.y,u.t.sight);
  for(const b of builds)if(!b.dead&&b.team>=0&&!isEnemy(0,b.team))stampVis(b.x,b.y,b.built?(b.t.sight||7):4);
  const d=fogImg.data;
  for(let i=0;i<vis.length;i++){
    const o=i*4;d[o]=0;d[o+1]=0;d[o+2]=0;
    d[o+3]=vis[i]===2?0:(vis[i]===1?118:255);
  }
  fogCv.getContext('2d').putImageData(fogImg,0,0);
}
