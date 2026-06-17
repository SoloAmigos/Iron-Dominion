'use strict';
/* --- vehicle sprites --- */
function trackPair(g,w,h){
  g.fillStyle='#1c211a';
  g.fillRect(-w/2,-h/2,w,7);g.fillRect(-w/2,h/2-7,w,7);
  g.fillStyle='#0f130d';
  for(let i=0;i<w/5;i++){g.fillRect(-w/2+2+i*5,-h/2+1.4,2.4,4.2);g.fillRect(-w/2+2+i*5,h/2-5.6,2.4,4.2)}
}
function uSpr(type,fk){
  const F=FACTIONS[fk],ac=F.c,C=facCol(fk);
  switch(type){
    case 'tank':return spr('Utank_'+fk,44,30,g=>{
      g.translate(22,15);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,19,12,0,0,7);g.fill();
      if(fk==='crimson'){
        // Warlord — wide blocky hull, exhaust stacks, riveted
        trackPair(g,40,30);
        g.fillStyle=C(27);g.beginPath();g.moveTo(-18,-10);g.lineTo(12,-10);g.lineTo(18,-3.5);g.lineTo(18,3.5);g.lineTo(12,10);g.lineTo(-18,10);g.closePath();g.fill();
        g.fillStyle=C(34);g.beginPath();g.moveTo(-18,-10);g.lineTo(12,-10);g.lineTo(18,-3.5);g.lineTo(18,0);g.lineTo(-18,0);g.closePath();g.fill();
        g.strokeStyle=C(13);g.lineWidth=1.5;g.beginPath();g.moveTo(-18,-10);g.lineTo(12,-10);g.lineTo(18,-3.5);g.lineTo(18,3.5);g.lineTo(12,10);g.lineTo(-18,10);g.closePath();g.stroke();
        g.fillStyle='#111108';g.fillRect(-20,-9,3.5,5.5);g.fillRect(-20,3.5,3.5,5.5);
        g.fillStyle='#3a2c18';g.fillRect(-19.8,-8.8,1.8,5);g.fillRect(-19.8,3.7,1.8,5);
        for(let i=0;i<4;i++){g.fillStyle=C(42);g.beginPath();g.arc(-12+i*7,-9.8,1.6,0,7);g.fill();g.beginPath();g.arc(-12+i*7,9.8,1.6,0,7);g.fill();}
        g.fillStyle=ac;g.fillRect(8,-9,3.5,18);
      }else if(fk==='scorpion'){
        // Marauder — low wedge hull, sand camo stripes
        trackPair(g,38,26);
        g.fillStyle=C(31);g.beginPath();g.moveTo(-16,-7);g.lineTo(9,-8);g.lineTo(20,-2.5);g.lineTo(20,2.5);g.lineTo(9,8);g.lineTo(-16,7);g.closePath();g.fill();
        g.fillStyle=C(38);g.beginPath();g.moveTo(-16,-7);g.lineTo(9,-8);g.lineTo(20,-2.5);g.lineTo(20,0);g.lineTo(-16,0);g.closePath();g.fill();
        g.strokeStyle=C(15);g.lineWidth=1.3;g.beginPath();g.moveTo(-16,-7);g.lineTo(9,-8);g.lineTo(20,-2.5);g.lineTo(20,2.5);g.lineTo(9,8);g.lineTo(-16,7);g.closePath();g.stroke();
        g.fillStyle='rgba(0,0,0,.14)';g.beginPath();g.moveTo(-6,-8);g.lineTo(2,-8);g.lineTo(-12,8);g.lineTo(-20,8);g.closePath();g.fill();
        g.fillStyle='rgba(255,255,255,.07)';g.beginPath();g.moveTo(3,-8);g.lineTo(11,-7);g.lineTo(-3,8);g.lineTo(-12,8);g.closePath();g.fill();
        g.fillStyle=ac;g.fillRect(9,-6.5,3.5,13);
      }else if(fk==='northwind'){
        // Glacier — wide boxy hull, front skirt plates
        trackPair(g,38,30);
        g.fillStyle=C(29);g.beginPath();g.moveTo(-18,-10);g.lineTo(8,-10);g.lineTo(14,-3.5);g.lineTo(14,3.5);g.lineTo(8,10);g.lineTo(-18,10);g.closePath();g.fill();
        g.fillStyle=C(36);g.beginPath();g.moveTo(-18,-10);g.lineTo(8,-10);g.lineTo(14,-3.5);g.lineTo(14,0);g.lineTo(-18,0);g.closePath();g.fill();
        g.strokeStyle=C(15);g.lineWidth=1.4;g.beginPath();g.moveTo(-18,-10);g.lineTo(8,-10);g.lineTo(14,-3.5);g.lineTo(14,3.5);g.lineTo(8,10);g.lineTo(-18,10);g.closePath();g.stroke();
        g.fillStyle=C(22);g.fillRect(-17,-13.5,26,3.5);g.fillRect(-17,10,26,3.5);
        g.strokeStyle=C(12);g.lineWidth=.9;g.strokeRect(-17,-13.5,26,3.5);g.strokeRect(-17,10,26,3.5);
        g.fillStyle=ac;g.fillRect(5,-9,3.5,18);
      }else{
        // Vanguard Crusader — angular hull, louvered engine panel
        trackPair(g,38,28);
        g.fillStyle=C(29);g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,3);g.lineTo(11,8);g.lineTo(-16,8);g.closePath();g.fill();
        g.fillStyle=C(36);g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,0);g.lineTo(-16,0);g.closePath();g.fill();
        g.strokeStyle=C(15);g.lineWidth=1.4;g.beginPath();g.moveTo(-16,-8);g.lineTo(11,-8);g.lineTo(18,-3);g.lineTo(18,3);g.lineTo(11,8);g.lineTo(-16,8);g.closePath();g.stroke();
        g.fillStyle=C(18);g.fillRect(-15,-5,6,10);
        g.strokeStyle=C(10);g.lineWidth=1;for(let i=0;i<3;i++){g.beginPath();g.moveTo(-14.4,-3+i*3);g.lineTo(-9.6,-3+i*3);g.stroke()}
        g.fillStyle='#1d231a';g.fillRect(-18,-6,3,4);
        g.fillStyle=ac;g.fillRect(7,-7.4,4,14.8);
      }
    });
    case 'dominator':return spr('Udom_'+fk,50,34,g=>{
      g.translate(25,17);
      g.fillStyle='rgba(0,0,0,.32)';g.beginPath();g.ellipse(1,2,22,14,0,0,7);g.fill();
      trackPair(g,44,32);
      g.fillStyle=C(27);
      g.beginPath();g.moveTo(-19,-9.5);g.lineTo(13,-9.5);g.lineTo(21,-4);g.lineTo(21,4);g.lineTo(13,9.5);g.lineTo(-19,9.5);g.closePath();g.fill();
      g.fillStyle=C(34);
      g.beginPath();g.moveTo(-19,-9.5);g.lineTo(13,-9.5);g.lineTo(21,-4);g.lineTo(21,0);g.lineTo(-19,0);g.closePath();g.fill();
      g.strokeStyle=C(13);g.lineWidth=1.6;
      g.beginPath();g.moveTo(-19,-9.5);g.lineTo(13,-9.5);g.lineTo(21,-4);g.lineTo(21,4);g.lineTo(13,9.5);g.lineTo(-19,9.5);g.closePath();g.stroke();
      // side armor plates
      g.fillStyle=C(22);g.fillRect(-16,-11.5,26,3.4);g.fillRect(-16,8.1,26,3.4);
      g.fillStyle='#1d231a';g.fillRect(-22,-7,4,5);g.fillRect(-22,2,4,5);
      g.fillStyle=ac;g.fillRect(9,-8.6,5,17.2);
    });
    case 'paladin':return spr('Upal_'+fk,44,28,g=>{
      g.translate(22,14);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,19,11,0,0,7);g.fill();
      trackPair(g,36,26);
      g.fillStyle=C(31);
      g.beginPath();g.moveTo(-15,-7);g.lineTo(8,-7);g.lineTo(18,-2.4);g.lineTo(18,2.4);g.lineTo(8,7);g.lineTo(-15,7);g.closePath();g.fill();
      g.fillStyle=C(39);
      g.beginPath();g.moveTo(-15,-7);g.lineTo(8,-7);g.lineTo(18,-2.4);g.lineTo(18,0);g.lineTo(-15,0);g.closePath();g.fill();
      g.strokeStyle=C(16);g.lineWidth=1.3;
      g.beginPath();g.moveTo(-15,-7);g.lineTo(8,-7);g.lineTo(18,-2.4);g.lineTo(18,2.4);g.lineTo(8,7);g.lineTo(-15,7);g.closePath();g.stroke();
      // energy core glow
      g.fillStyle='#7ddcff';g.beginPath();g.arc(-9,0,2.8,0,7);g.fill();
      g.fillStyle='rgba(125,220,255,.35)';g.beginPath();g.arc(-9,0,5,0,7);g.fill();
      g.fillStyle=ac;g.fillRect(6,-6.4,4,12.8);
    });
    case 'technical':return spr('Utec_'+fk,42,24,g=>{
      g.translate(21,12);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,17,9,0,0,7);g.fill();
      g.fillStyle='#14180f';
      for(const wx of[-11,11])for(const wy of[-8.5,8.5]){g.beginPath();g.arc(wx,wy,4.4,0,7);g.fill()}
      g.fillStyle='#3a4034';
      for(const wx of[-11,11])for(const wy of[-8.5,8.5]){g.beginPath();g.arc(wx,wy,1.7,0,7);g.fill()}
      // open bed
      g.fillStyle=C(30);g.fillRect(-17,-7,20,14);
      g.fillStyle=C(18);g.fillRect(-15,-5,16,10);
      g.strokeStyle=C(12);g.lineWidth=1.2;g.strokeRect(-17,-7,20,14);
      // cab
      g.fillStyle=C(38);g.fillRect(3,-7,14,14);
      g.fillStyle=C(46);g.fillRect(3,-7,14,5.5);
      g.fillStyle='#9fc3d4';g.beginPath();g.moveTo(15,-5);g.lineTo(18,-3.4);g.lineTo(18,3.4);g.lineTo(15,5);g.closePath();g.fill();
      g.strokeStyle=C(14);g.lineWidth=1.1;g.strokeRect(3,-7,14,14);
      g.fillStyle=ac;g.fillRect(4,-2.6,4.6,5.2);
      // rust patches (scavenger flavor)
      g.fillStyle='rgba(122,72,32,.5)';g.fillRect(-13,3,5,3);g.fillRect(8,-6.5,4,2.4);
    });
    case 'arty':return spr('Uarty_'+fk,42,28,g=>{
      g.translate(21,14);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,17,11,0,0,7);g.fill();
      if(fk==='crimson'){
        // Dragonfire — heavy siege hull, wide breech, prominent barrel stub
        trackPair(g,36,28);
        g.fillStyle=C(26);g.beginPath();g.moveTo(-15,-9);g.lineTo(14,-9);g.lineTo(17,-3);g.lineTo(17,3);g.lineTo(14,9);g.lineTo(-15,9);g.closePath();g.fill();
        g.fillStyle=C(33);g.beginPath();g.moveTo(-15,-9);g.lineTo(14,-9);g.lineTo(17,-3);g.lineTo(17,0);g.lineTo(-15,0);g.closePath();g.fill();
        g.strokeStyle=C(12);g.lineWidth=1.5;g.strokeRect(-15,-9,32,18);
        g.fillStyle=C(18);g.fillRect(-15,-7,5,14);g.strokeStyle=C(10);g.lineWidth=.9;g.strokeRect(-15,-7,5,14);
        g.fillStyle=C(22);g.fillRect(14,-12,4,24);
        g.strokeStyle=C(11);g.lineWidth=1.2;g.strokeRect(14,-12,4,24);
        for(let i=0;i<4;i++){g.fillStyle=C(40);g.beginPath();g.arc(-10+i*8,-9,1.6,0,7);g.fill();}
        g.fillStyle=ac;g.fillRect(10,-8,3.5,16);
      }else if(fk==='scorpion'){
        // Junk Lobber — wheeled chassis, improvised rocket tubes
        g.fillStyle='#14180f';for(const wx of[-12,10])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,4,0,7);g.fill()}
        g.fillStyle='#3a4034';for(const wx of[-12,10])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,1.6,0,7);g.fill()}
        g.fillStyle=C(30);g.fillRect(-16,-6,28,12);g.fillStyle=C(37);g.fillRect(-16,-6,28,5.5);
        g.strokeStyle=C(13);g.lineWidth=1.2;g.strokeRect(-16,-6,28,12);
        g.fillStyle='rgba(122,72,32,.5)';g.fillRect(-14,1,5,4);g.fillRect(6,-5.5,4,3);
        g.fillStyle=C(20);g.fillRect(-22,-5,7,10);
        g.fillStyle=ac;g.fillRect(7,-5.5,3.5,11);
      }else if(fk==='northwind'){
        // Avalanche — wide mortar carrier, enclosed armored cab
        trackPair(g,36,28);
        g.fillStyle=C(30);g.beginPath();g.moveTo(-14,-8);g.lineTo(10,-8);g.lineTo(14,-2.5);g.lineTo(14,2.5);g.lineTo(10,8);g.lineTo(-14,8);g.closePath();g.fill();
        g.fillStyle=C(37);g.beginPath();g.moveTo(-14,-8);g.lineTo(10,-8);g.lineTo(14,-2.5);g.lineTo(14,0);g.lineTo(-14,0);g.closePath();g.fill();
        g.strokeStyle=C(14);g.lineWidth=1.3;g.beginPath();g.moveTo(-14,-8);g.lineTo(10,-8);g.lineTo(14,-2.5);g.lineTo(14,2.5);g.lineTo(10,8);g.lineTo(-14,8);g.closePath();g.stroke();
        g.fillStyle=C(24);g.fillRect(-14,-6,6,12);g.strokeStyle=C(12);g.lineWidth=.9;g.strokeRect(-14,-6,6,12);
        g.fillStyle='#8fb4c4';g.fillRect(-13,-4,4,6);
        g.fillStyle=ac;g.fillRect(6,-7,3.5,14);
      }else{
        // Vanguard Thunderer — tracked SPG
        trackPair(g,34,26);
        g.fillStyle=C(28);g.beginPath();g.moveTo(-14,-7);g.lineTo(12,-7);g.lineTo(16,-2);g.lineTo(16,2);g.lineTo(12,7);g.lineTo(-14,7);g.closePath();g.fill();
        g.fillStyle=C(35);g.beginPath();g.moveTo(-14,-7);g.lineTo(12,-7);g.lineTo(16,-2);g.lineTo(16,0);g.lineTo(-14,0);g.closePath();g.fill();
        g.strokeStyle=C(14);g.lineWidth=1.4;g.strokeRect(-14,-7,30,14);
        g.fillStyle=C(20);g.beginPath();g.moveTo(-14,-5);g.lineTo(-20,-7);g.lineTo(-20,7);g.lineTo(-14,5);g.closePath();g.fill();
        g.fillStyle=ac;g.fillRect(8,-6.4,4,12.8);
      }
    });
    case 'truck':return spr('Utruck_'+fk,46,28,g=>{
      g.translate(23,14);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,19,11,0,0,7);g.fill();
      g.fillStyle='#14180f';
      for(const wx of[-15,-7,12])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,4.6,0,7);g.fill()}
      g.fillStyle='#3a4034';
      for(const wx of[-15,-7,12])for(const wy of[-9.5,9.5]){g.beginPath();g.arc(wx,wy,1.8,0,7);g.fill()}
      g.fillStyle=C(30);g.fillRect(-20,-8,28,16);
      g.fillStyle=C(37);g.fillRect(-20,-8,28,7);
      g.strokeStyle=C(15);g.lineWidth=1.2;
      for(let i=0;i<5;i++){g.beginPath();g.moveTo(-17+i*5.5,-8);g.lineTo(-17+i*5.5,8);g.stroke()}
      g.strokeRect(-20,-8,28,16);
      g.fillStyle=C(33);g.fillRect(8,-8,13,16);
      g.fillStyle=C(41);g.fillRect(8,-8,13,6);
      g.fillStyle='#9fc3d4';g.beginPath();g.moveTo(19,-6);g.lineTo(22,-4);g.lineTo(22,4);g.lineTo(19,6);g.closePath();g.fill();
      g.fillStyle=ac;g.fillRect(9,-3,5,6);
      g.strokeStyle=C(14);g.lineWidth=1.2;g.strokeRect(8,-8,13,16);
    });
    case 'drone':return spr('Udrone_'+fk,36,30,g=>{
      g.translate(18,15);
      // hover shadow further offset
      g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(2,5,12,7,0,0,7);g.fill();
      // rotor blur discs
      g.fillStyle='rgba(180,200,190,.18)';
      for(const[rx,ry]of[[-9,-9],[-9,9],[9,-9],[9,9]]){g.beginPath();g.arc(rx,ry,6.2,0,7);g.fill()}
      g.strokeStyle='rgba(220,235,225,.5)';g.lineWidth=1;
      for(const[rx,ry]of[[-9,-9],[-9,9],[9,-9],[9,9]]){g.beginPath();g.arc(rx,ry,6.2,0,7);g.stroke()}
      // arms
      g.strokeStyle=C(20);g.lineWidth=2.6;
      g.beginPath();g.moveTo(-8,-8);g.lineTo(8,8);g.moveTo(-8,8);g.lineTo(8,-8);g.stroke();
      // body pod
      g.fillStyle=C(34);g.beginPath();g.ellipse(0,0,8.6,6.4,0,0,7);g.fill();
      g.fillStyle=C(43);g.beginPath();g.ellipse(-.8,-1.2,5.8,4,0,0,7);g.fill();
      g.strokeStyle=C(15);g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,8.6,6.4,0,0,7);g.stroke();
      // sensor eye + gun
      g.fillStyle='#9fe9ff';g.beginPath();g.arc(4.6,0,2,0,7);g.fill();
      g.fillStyle=C(12);g.fillRect(8,-1.3,8,2.6);
      g.fillStyle=ac;g.fillRect(-4,-3.6,2.6,7.2);
    });
    case 'scarab':return spr('Uscar_'+fk,36,24,g=>{
      g.translate(18,12);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,14,8,0,0,7);g.fill();
      g.fillStyle='#14180f';
      for(const wx of[-9,9])for(const wy of[-8,8]){g.beginPath();g.arc(wx,wy,4,0,7);g.fill()}
      g.fillStyle='#3a4034';
      for(const wx of[-9,9])for(const wy of[-8,8]){g.beginPath();g.arc(wx,wy,1.5,0,7);g.fill()}
      // ramshackle body
      g.fillStyle=C(31);g.fillRect(-13,-6,24,12);
      g.fillStyle=C(39);g.fillRect(-13,-6,24,5);
      g.strokeStyle=C(13);g.lineWidth=1.2;g.strokeRect(-13,-6,24,12);
      // strapped explosive barrels
      g.fillStyle='#9c3a30';g.beginPath();g.arc(-5,0,4.6,0,7);g.fill();
      g.fillStyle='#c0584a';g.beginPath();g.arc(-6,-1,2.8,0,7);g.fill();
      g.fillStyle='#9c3a30';g.beginPath();g.arc(3,0,4.6,0,7);g.fill();
      g.fillStyle='#c0584a';g.beginPath();g.arc(2,-1,2.8,0,7);g.fill();
      g.strokeStyle='#2a1410';g.lineWidth=1.2;
      g.beginPath();g.moveTo(-13,-3);g.lineTo(11,-3);g.moveTo(-13,3);g.lineTo(11,3);g.stroke();
      // hazard nose stripes
      g.fillStyle='#ffd95e';g.fillRect(11,-6,3,12);
      g.fillStyle='#191407';
      for(let i=0;i<3;i++)g.fillRect(11,-6+i*4+1.4,3,2);
      // blinking fuse light baked bright
      g.fillStyle='#ff5147';g.beginPath();g.arc(-10,-4,1.8,0,7);g.fill();
      g.fillStyle=ac;g.fillRect(7,-5,2.6,10);
    });
    case 'dozer':return spr('Udozer_'+fk,44,30,g=>{
      g.translate(22,15);
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,2,18,12,0,0,7);g.fill();
      trackPair(g,32,28);
      g.fillStyle='#8f7f37';g.fillRect(-13,-8,24,16);
      g.fillStyle='#a8973f';g.fillRect(-13,-8,24,7);
      g.strokeStyle='#4d431c';g.lineWidth=1.4;g.strokeRect(-13,-8,24,16);
      g.fillStyle='#3a3f33';g.fillRect(-9,-5,11,10);
      g.fillStyle='#8fb4c4';g.fillRect(-7,-3.4,7,6.8);
      g.strokeStyle='#20251c';g.lineWidth=1;g.strokeRect(-9,-5,11,10);
      g.fillStyle='#1d231a';g.fillRect(3,-7,2.6,5);
      g.strokeStyle='#6f6230';g.lineWidth=2.6;
      g.beginPath();g.moveTo(8,-6);g.lineTo(16,-8);g.moveTo(8,6);g.lineTo(16,8);g.stroke();
      g.fillStyle='#9aa88c';g.fillRect(16,-12,5,24);
      g.fillStyle='#c9a23a';g.fillRect(17,-12,1.6,24);
      g.fillStyle='#5a5246';g.fillRect(20,-12,1,24);
      g.fillStyle=ac;g.fillRect(-12.4,-2.6,3.6,5.2);
    });
  }
  return null;
}