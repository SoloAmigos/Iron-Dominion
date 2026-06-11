'use strict';
/* ================= WORLD ================= */
function genWorld(){
  blocked.fill(0);vis.fill(0);piles=[];rocks=[];
  const pdef=[[10,32,42000],[4,25,42000],[48,5,42000],[54,12,42000],[28,15,56000],[30,22,56000]];
  for(const[tx,ty,a]of pdef)piles.push({kind:'p',tx,ty,x:(tx+1)*TILE,y:(ty+1)*TILE,amt:a,max:a});
  const safe=(tx,ty)=>{
    if(Math.hypot(tx-6,ty-33)<10||Math.hypot(tx-53,ty-6)<10)return false;
    for(const p of piles)if(Math.abs(tx-p.tx-1)<3.5&&Math.abs(ty-p.ty-1)<3.5)return false;
    return true;
  };
  for(let c=0;c<26;c++){
    let tx=1+Math.floor(Math.random()*(MAPW-2)),ty=1+Math.floor(Math.random()*(MAPH-2));
    if(!safe(tx,ty))continue;
    const n=1+Math.floor(Math.random()*4);
    for(let k=0;k<n;k++){
      if(inB(tx,ty)&&safe(tx,ty)&&!blocked[idx(tx,ty)]){blocked[idx(tx,ty)]=1;rocks.push({tx,ty,v:Math.random()})}
      tx+=Math.round(rand(-1,1));ty+=Math.round(rand(-1,1));
    }
  }
  // Neutral structures: civil buildings (garrison) and oil derricks (capture)
  const neutralDefs=[
    {type:'civil', tx:20,ty:26},{type:'civil', tx:36,ty:16},
    {type:'oilrig',tx:22,ty:8 },{type:'oilrig',tx:44,ty:28}
  ];
  for(const nd of neutralDefs){
    const t=BT[nd.type];let ok=true;
    for(let ny=nd.ty;ny<nd.ty+t.h&&ok;ny++)
      for(let nx=nd.tx;nx<nd.tx+t.w&&ok;nx++)
        if(!inB(nx,ny)||blocked[idx(nx,ny)])ok=false;
    const cx=nd.tx+t.w/2,cy=nd.ty+t.h/2;
    if(Math.hypot(cx-6,cy-33)<8||Math.hypot(cx-53,cy-6)<8)ok=false;
    for(const p of piles)if(Math.abs(cx-p.tx-1)<4&&Math.abs(cy-p.ty-1)<4)ok=false;
    if(ok)placeBuilding(nd.type,-1,nd.tx,nd.ty,true);
  }
}
function blockRect(tx,ty,w,h,v){
  for(let y=ty;y<ty+h;y++)for(let x=tx;x<tx+w;x++)if(inB(x,y))blocked[idx(x,y)]=v;
}
function buildGround(){
  groundCv=document.createElement('canvas');groundCv.width=WW;groundCv.height=WH;
  const g=groundCv.getContext('2d');
  g.fillStyle='#2b3a25';g.fillRect(0,0,WW,WH);
  for(let i=0;i<1100;i++){
    const x=Math.random()*WW,y=Math.random()*WH,r=rand(14,70);
    g.fillStyle=['#2f4028','#293822','#33442b','#26331f','#36462e'][i%5];
    g.globalAlpha=rand(.25,.6);g.beginPath();g.ellipse(x,y,r,r*rand(.4,.9),rand(0,3),0,7);g.fill();
  }
  g.globalAlpha=.5;
  for(let i=0;i<260;i++){
    g.fillStyle=i%2?'#3d4a33':'#222e1c';
    g.fillRect(Math.random()*WW,Math.random()*WH,rand(2,5),rand(2,5));
  }
  g.globalAlpha=1;
  for(let i=0;i<80;i++){
    g.fillStyle='rgba(64,52,34,'+rand(.10,.22)+')';
    g.beginPath();g.ellipse(Math.random()*WW,Math.random()*WH,rand(20,60),rand(10,30),rand(0,3),0,7);g.fill();
  }
  g.lineWidth=1.4;
  for(let i=0;i<650;i++){
    const x=Math.random()*WW,y=Math.random()*WH;
    g.strokeStyle=i%2?'#4f6a3a':'#43592f';g.globalAlpha=rand(.4,.85);
    g.beginPath();g.moveTo(x,y);g.lineTo(x-2,y-5);g.moveTo(x,y);g.lineTo(x+1,y-6);g.moveTo(x,y);g.lineTo(x+3,y-4);g.stroke();
  }
  g.globalAlpha=1;
  const decoOK=(tx,ty)=>{
    if(!inB(tx,ty)||blocked[idx(tx,ty)])return false;
    if(Math.hypot(tx-6,ty-33)<9||Math.hypot(tx-53,ty-6)<9)return false;
    for(const p of piles)if(Math.abs(tx-p.tx-1)<3.5&&Math.abs(ty-p.ty-1)<3.5)return false;
    return true;
  };
  for(let i=0;i<75;i++){
    const tx=1+Math.random()*(MAPW-2)|0,ty=1+Math.random()*(MAPH-2)|0;
    if(!decoOK(tx,ty))continue;
    const x=tx*TILE+rand(6,34),y=ty*TILE+rand(6,34),r=rand(5,9);
    g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x+2,y+3,r+2,r*.55,0,0,7);g.fill();
    g.fillStyle='#33502a';g.beginPath();g.arc(x,y,r,0,7);g.arc(x+r*.7,y+2,r*.7,0,7);g.fill();
    g.fillStyle='#446b36';g.beginPath();g.arc(x-r*.25,y-r*.3,r*.6,0,7);g.fill();
  }
  for(let i=0;i<42;i++){
    const tx=1+Math.random()*(MAPW-2)|0,ty=1+Math.random()*(MAPH-2)|0;
    if(!decoOK(tx,ty))continue;
    const x=tx*TILE+20,y=ty*TILE+20,r=rand(10,15);
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
  vg.addColorStop(0,'rgba(255,250,220,.05)');
  vg.addColorStop(.55,'rgba(0,0,0,0)');
  vg.addColorStop(1,'rgba(5,10,4,.34)');
  g.fillStyle=vg;g.fillRect(0,0,WW,WH);
  const edge=(x,y,w2,h2,vert)=>{
    g.fillStyle='#20261c';g.fillRect(x,y,w2,h2);
    const n=Math.floor((vert?h2:w2)/26);
    for(let i=0;i<=n;i++){
      const t=i*26+rand(-5,5);
      const bx=vert?x+(x<WW/2?0:rand(0,4)):t, by=vert?t:y+(y<WH/2?0:rand(0,4));
      const rw=rand(16,30),rh=rand(12,20);
      const px=vert?x+rand(-2,w2-rw+2):bx, py=vert?by:y+rand(-2,h2-rh+2);
      g.fillStyle=['#3c423a','#454c42','#34392f'][i%3];
      g.beginPath();
      g.moveTo(px,py+rh);g.lineTo(px+rw*.18,py+rand(0,4));g.lineTo(px+rw*.55,py);
      g.lineTo(px+rw,py+rh*.4);g.lineTo(px+rw*.9,py+rh);g.closePath();g.fill();
      g.fillStyle='#555d52';
      g.beginPath();g.moveTo(px+rw*.2,py+rh*.5);g.lineTo(px+rw*.35,py+rh*.14);g.lineTo(px+rw*.6,py+rh*.3);g.lineTo(px+rw*.45,py+rh*.6);g.closePath();g.fill();
    }
  };
  edge(0,0,WW,16,false);edge(0,WH-16,WW,16,false);
  edge(0,0,16,WH,true);edge(WW-16,0,16,WH,true);
  g.strokeStyle='#10150c';g.lineWidth=5;g.strokeRect(2,2,WW-4,WH-4);
  g.strokeStyle='rgba(120,130,110,.25)';g.lineWidth=1.4;g.strokeRect(16,16,WW-32,WH-32);
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
  for(const u of units)if(u.team===0&&!u.dead)stampVis(u.x,u.y,u.t.sight);
  for(const b of builds)if(b.team===0&&!b.dead)stampVis(b.x,b.y,b.built?7:4);
  const d=fogImg.data;
  for(let i=0;i<vis.length;i++){
    const o=i*4;d[o]=0;d[o+1]=0;d[o+2]=0;
    d[o+3]=vis[i]===2?0:(vis[i]===1?118:255);
  }
  fogCv.getContext('2d').putImageData(fogImg,0,0);
}
