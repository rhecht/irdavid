/* City of David Flash arcade: documented HTML5 recreations, no backend/Flash/CDN. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
let active='memory';
const tabs=$$('.arcade-tab');
function showGame(g){active=g;tabs.forEach(t=>{let on=t.dataset.game===g;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});$$('.arcade-panel').forEach(p=>p.hidden=p.id!=='panel-'+g);if(g!=='tetris')T.pauseOnExit();if(g!=='ninja')N.pauseOnExit();}
tabs.forEach(t=>t.addEventListener('click',()=>showGame(t.dataset.game)));
$('.arcade-selector')?.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const i=tabs.indexOf(document.activeElement);const next=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];next.focus();showGame(next.dataset.game)});
const gpath='assets/games/';
const soundEnabled={tetris:false,ninja:false};
const soundBank={tetris:{drop:'games_tetris_id0133.mp3',clear:'games_tetris_id0137.mp3',end:'games_tetris_id0138.mp3'},ninja:{coin:'ninja_id0002.mp3',hit:'ninja_id0003.mp3',throw:'ninja_id0004.mp3',win:'ninja_id0005.mp3'}};
function playSfx(game,event){if(!soundEnabled[game])return;const name=soundBank[game]?.[event];if(!name)return;const a=new Audio(gpath+name);a.volume=.4;a.play().catch(()=>{});}
for(const game of ['tetris','ninja']){document.getElementById(game+'Sound').addEventListener('click',function(){soundEnabled[game]=!soundEnabled[game];this.textContent='Sound: '+(soundEnabled[game]?'On':'Off');this.setAttribute('aria-pressed',String(soundEnabled[game]));});}

const asset=(name)=>{const image=new Image();image.src=gpath+name;return image};
const textures=[151,155,159,163,167,171].map(id=>asset('games_tetris_id'+id+'_DefineBitsJPEG3.png'));
const photos=[asset('games_tetris_id0016_DefineBitsJPEG2.jpg'),asset('games_tetris_id0195_DefineBitsJPEG2.jpg')];
const paintBlock=(ctx,x,y,size,id,alpha=1)=>{ctx.save();ctx.globalAlpha=alpha;const t=textures[id%textures.length];if(t.complete&&t.naturalWidth){ctx.drawImage(t,x,y,size,size)}else{ctx.fillStyle=['#988457','#a46c45','#6e6251','#97916c','#b99c57','#826c4c'][id%6];ctx.fillRect(x,y,size,size)}ctx.fillStyle='rgba(250,230,180,.21)';ctx.fillRect(x+1,y+1,size-2,2);ctx.fillStyle='rgba(0,0,0,.37)';ctx.fillRect(x+1,y+size-3,size-2,2);ctx.strokeStyle='#29241a';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,size-1,size-1);ctx.restore()};
const SHAPES=[[[0,1],[1,1],[2,1],[3,1]],[[0,0],[0,1],[1,1],[2,1]],[[2,0],[0,1],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[0,1],[1,1]],[[1,0],[0,1],[1,1],[2,1]],[[0,0],[1,0],[1,1],[2,1]]];
const T={board:[],piece:null,bag:[],next:null,held:null,usedHold:false,score:0,lines:0,level:1,state:'idle',last:0,acc:0,raf:null,photoIdx:0};
const tc=$('#tetrisCanvas'), tx=tc.getContext('2d'),tn=$('#tetrisNext').getContext('2d'),th=$('#tetrisHold').getContext('2d');
function newBoard(){return Array.from({length:20},()=>Array(10).fill(-1))}
function drawMini(ctx,piece){ctx.clearRect(0,0,120,108);ctx.fillStyle='#151618';ctx.fillRect(0,0,120,108);if(piece==null)return;const cells=SHAPES[piece];const minX=Math.min(...cells.map(c=>c[0])),maxX=Math.max(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1])),maxY=Math.max(...cells.map(c=>c[1]));const s=23,ox=(120-(maxX-minX+1)*s)/2-minX*s,oy=(108-(maxY-minY+1)*s)/2-minY*s;for(const [x,y] of cells)paintBlock(ctx,ox+x*s,oy+y*s,s,piece)}
function fillBag(){if(T.bag.length===0){T.bag=[0,1,2,3,4,5,6];for(let i=T.bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[T.bag[i],T.bag[j]]=[T.bag[j],T.bag[i]]}}}
function take(){fillBag();return T.bag.pop()}
function shape(t,rotation){let cells=SHAPES[t].map(p=>p.slice());for(let k=0;k<rotation;k++)cells=cells.map(([x,y])=>[3-y,x]);return cells}
function valid(p){return shape(p.t,p.r).every(([sx,sy])=>{const x=p.x+sx,y=p.y+sy;return x>=0&&x<10&&y<20&&(y<0||T.board[y][x]<0)})}
function spawn(type){T.piece={t:type??T.next,x:3,y:-1,r:0};if(type==null)T.next=take();drawMini(tn,T.next);if(!valid(T.piece))endT('The excavation is full','Game over — try for a new high score.','Play again')}
function nextOverlay(msg,desc,label,action){const box=$('#tetrisOverlay');box.hidden=false;box.querySelector('strong').textContent=msg;box.querySelector('span').textContent=desc;$('#tetrisBegin').textContent=label;$('#tetrisBegin').onclick=action}
function hideTOverlay(){$('#tetrisOverlay').hidden=true;tc.focus({preventScroll:true})}
function updateTStats(){$('#tetrisScore').textContent=T.score.toLocaleString();$('#tetrisLines').textContent=T.lines;$('#tetrisLevel').textContent=T.level}
function resetT(){T.board=newBoard();T.bag=[];T.held=null;T.usedHold=false;T.score=0;T.lines=0;T.level=1;T.acc=0;T.last=0;T.photoIdx=0;T.next=take();spawn();drawMini(th,null);updateTStats();T.state='playing';hideTOverlay();cancelAnimationFrame(T.raf);T.raf=requestAnimationFrame(tframe)}
function endT(title,desc,label){playSfx('tetris','end');T.state='over';cancelAnimationFrame(T.raf);nextOverlay(title,desc,label,resetT)}
function pauseT(){if(T.state==='playing'){T.state='paused';cancelAnimationFrame(T.raf);nextOverlay('Paused','Your falling stones are waiting.','Resume',resumeT);$('#tetrisPause').textContent='Resume'}}
function resumeT(){if(T.state!=='paused')return;T.state='playing';T.last=0;hideTOverlay();$('#tetrisPause').textContent='Pause';T.raf=requestAnimationFrame(tframe)}
T.pauseOnExit=pauseT;
function moveT(dx,dy){if(T.state!=='playing')return false;const p={...T.piece,x:T.piece.x+dx,y:T.piece.y+dy};if(valid(p)){T.piece=p;if(dy>0&&dx===0)T.score++;return true}if(dy>0)lockT();return false}
function rotateT(dir){if(T.state!=='playing')return;const r=(T.piece.r+dir+4)%4;for(const offset of [0,-1,1,-2,2]){const p={...T.piece,r,x:T.piece.x+offset};if(valid(p)){T.piece=p;break}}}
function lockT(){let above=false;shape(T.piece.t,T.piece.r).forEach(([sx,sy])=>{const x=T.piece.x+sx,y=T.piece.y+sy;if(y<0)above=true;else T.board[y][x]=T.piece.t});if(above){endT('Game over','Your tower reached the top.','Try again');return}let count=0;for(let y=19;y>=0;y--){if(T.board[y].every(a=>a>=0)){T.board.splice(y,1);T.board.unshift(Array(10).fill(-1));y++;count++}}if(count){playSfx('tetris','clear');T.lines+=count;T.score+=([0,100,300,500,800][count]||800)*T.level;T.level=Math.floor(T.lines/10)+1;T.photoIdx=(T.photoIdx+count)%photos.length}T.usedHold=false;updateTStats();spawn()}
function hardT(){if(T.state!=='playing')return;let n=0;while(valid({...T.piece,y:T.piece.y+1})){T.piece.y++;n++}T.score+=2*n;playSfx('tetris','drop');lockT();updateTStats()}
function holdT(){if(T.state!=='playing'||T.usedHold)return;const was=T.piece.t;if(T.held==null){T.held=was;spawn()}else{spawn(T.held);T.held=was}T.usedHold=true;drawMini(th,T.held)}
function renderT(){const w=300,h=600,s=30;tx.clearRect(0,0,w,h);tx.fillStyle='#13191a';tx.fillRect(0,0,w,h);const bg=photos[T.photoIdx%photos.length];if(bg.complete&&bg.naturalWidth){tx.save();tx.globalAlpha=.23;tx.drawImage(bg,0,0,300,600);tx.restore()}for(let y=0;y<20;y++){for(let x=0;x<10;x++){const id=T.board[y]?.[x]??-1;if(id>=0)paintBlock(tx,x*s,y*s,s,id);else{tx.strokeStyle='rgba(226,192,133,.15)';tx.strokeRect(x*s+.5,y*s+.5,s,s)}}}if(T.piece){let ghost={...T.piece};while(valid({...ghost,y:ghost.y+1}))ghost.y++;for(const [dx,dy] of shape(ghost.t,ghost.r)){let x=ghost.x+dx,y=ghost.y+dy;if(y>=0)paintBlock(tx,x*s,y*s,s,ghost.t,.2)}for(const [dx,dy] of shape(T.piece.t,T.piece.r)){let x=T.piece.x+dx,y=T.piece.y+dy;if(y>=0)paintBlock(tx,x*s,y*s,s,T.piece.t)}}}
function tframe(time){if(T.state!=='playing')return;if(T.last){const dt=Math.min(time-T.last,80);T.acc+=dt}T.last=time;let speed=Math.max(90,760*Math.pow(.84,T.level-1));while(T.acc>speed&&T.state==='playing'){moveT(0,1);T.acc-=speed}renderT();if(T.state==='playing')T.raf=requestAnimationFrame(tframe)}
$('#tetrisBegin').onclick=resetT;$('#tetrisPause').addEventListener('click',()=>T.state==='playing'?pauseT():T.state==='paused'?resumeT():resetT());$('#tetrisRestart').addEventListener('click',resetT);
function tAction(a){if(T.state!=='playing')return;switch(a){case'left':moveT(-1,0);break;case'right':moveT(1,0);break;case'down':moveT(0,1);break;case'rotate':rotateT(1);break;case'backrotate':rotateT(-1);break;case'drop':hardT();break;case'hold':holdT();break;}updateTStats();renderT()}
renderT();drawMini(tn,null);drawMini(th,null);
// Adventure: two levels built with extracted imagery and a simplified side-scrolling platform engine.
const nc=$('#ninjaCanvas'),nx=nc.getContext('2d');
const art={sky:asset('ninja_id0015_DefineBitsJPEG2.jpg'),cave:asset('ninja_id0139_DefineBitsJPEG2.jpg'),hills:asset('ninja_id0106_DefineBitsJPEG3.png'),hero:asset('ninja_id0021_DefineBitsJPEG3.png'),flame:asset('ninja_id0051_DefineBitsJPEG3.png'),snake:asset('ninja_id0061_DefineBitsLossless2.png'),eagle:asset('ninja_id0056_DefineBitsJPEG3.png'),coin:asset('ninja_id0100_DefineBitsJPEG3.png')};
const N={state:'idle',level:1,score:0,lives:3,enemiesPassed:0,hero:{x:55,y:280,w:40,h:54,vx:0,vy:0,ground:false,dir:1,inv:0},platforms:[],enemies:[],coins:[],shots:[],keys:new Set(),camera:0,last:0,raf:null,shotCooldown:0};
function buildLevel(level){const floorY=level===1?374:370;const floorIntervals=[[0,390],[460,710],[780,1130],[1200,1570],[1650,1940],[2010,2510]];N.platforms=floorIntervals.map(([x,end])=>({x,y:floorY,w:end-x,h:50}));N.platforms.push(...[[180,305,140],[570,284,130],[850,307,140],[1060,235,120],[1390,290,130],[1730,285,150],[2120,270,160]].map(([x,y,w])=>({x,y,w,h:22})));
N.coins=[130,265,365,575,865,1095,1250,1450,1725,1860,2120,2280,2400].map((x,i)=>({x,y:i%3===0?floorY-65:i%3===1?244:floorY-82,got:false}));N.enemies=[{x:325,type:'snake',y:floorY-39},{x:605,type:'fire',y:floorY-67},{x:885,type:'eagle',y:185},{x:1055,type:'snake',y:floorY-39},{x:1460,type:'fire',y:floorY-67},{x:1730,type:'eagle',y:180},{x:2160,type:'snake',y:floorY-39}].map((e,i)=>({...e,alive:true,phase:i*1.2,origin:e.x}));
N.hero={x:55,y:280,w:39,h:50,vx:0,vy:0,ground:false,dir:1,inv:0};N.shots=[];N.camera=0;N.shotCooldown=0;N.level=level;N.keys.clear();updateNStats()}
function updateNStats(){$('#ninjaScore').textContent=N.score;$('#ninjaLives').textContent='♥ '.repeat(Math.max(0,N.lives)).trim()||'—';$('#ninjaLevel').textContent=N.level+' / 2';$('#ninjaEnemies').textContent=N.enemiesPassed}
function nOverlay(title,desc,label,action){const overlay=$('#ninjaOverlay');overlay.hidden=false;overlay.querySelector('strong').textContent=title;overlay.querySelector('span').textContent=desc;const btn=$('#ninjaBegin');btn.textContent=label;btn.onclick=action}
function startN(){N.score=0;N.lives=3;N.enemiesPassed=0;buildLevel(1);goN()}
function goN(){N.state='playing';N.last=0;$('#ninjaOverlay').hidden=true;$('#ninjaPause').textContent='Pause';nc.focus({preventScroll:true});cancelAnimationFrame(N.raf);N.raf=requestAnimationFrame(nframe)}
function pauseN(){if(N.state!=='playing')return;N.state='paused';N.keys.clear();cancelAnimationFrame(N.raf);$('#ninjaPause').textContent='Resume';nOverlay('Paused','Your archaeological expedition is on hold.','Continue',goN)}
N.pauseOnExit=pauseN;
function finishN(){playSfx('ninja','win');N.state='win';cancelAnimationFrame(N.raf);nOverlay('Expedition complete!','You earned '+N.score+' points and survived both routes.','Play again',startN)}
function damageN(){if(N.hero.inv>0||N.state!=='playing')return;N.lives--;playSfx('ninja','hit');N.hero.inv=1.7;N.hero.vy=-260;N.hero.x=Math.max(45,N.hero.x-65);updateNStats();if(N.lives<=0){N.state='over';cancelAnimationFrame(N.raf);nOverlay('Expedition ended','You earned '+N.score+' points. Try again and collect the seals.','Try again',startN)}}
function collision(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function throwN(){if(N.state!=='playing'||N.shotCooldown>0)return;const p=N.hero;N.shots.push({x:p.x+p.w/2,y:p.y+18,vx:430*p.dir,ttl:1.1,w:16,h:16});N.shotCooldown=.42;playSfx('ninja','throw')}
function stepN(dt,t){const h=N.hero;N.shotCooldown=Math.max(0,N.shotCooldown-dt);h.inv=Math.max(0,h.inv-dt);const left=N.keys.has('left'),right=N.keys.has('right');h.vx=(Number(right)-Number(left))*250;if(h.vx)h.dir=Math.sign(h.vx);h.x=Math.max(0,Math.min(2475,h.x+h.vx*dt));const prevBottom=h.y+h.h;h.vy=Math.min(630,h.vy+1060*dt);h.y+=h.vy*dt;h.ground=false;for(const p of N.platforms){if(h.vy>=0&&h.x+h.w>p.x+8&&h.x<p.x+p.w-8&&prevBottom<=p.y+12&&h.y+h.h>=p.y){h.y=p.y-h.h;h.vy=0;h.ground=true}}if(h.y>480){damageN();h.x=Math.max(55,Math.floor(h.x/380)*380+15);h.y=210;h.vy=-150}if(N.state!=='playing')return;
for(const c of N.coins){if(!c.got&&collision(h,{x:c.x,y:c.y,w:35,h:35})){c.got=true;N.score+=100;playSfx('ninja','coin');updateNStats()}}
for(const e of N.enemies){if(!e.alive)continue;const pos={x:e.origin+(e.type==='eagle'?Math.sin(t*.0015+e.phase)*57:Math.sin(t*.0007+e.phase)*26),y:e.y+(e.type==='eagle'?Math.sin(t*.003+e.phase)*25:0),w:e.type==='eagle'?72:e.type==='fire'?40:62,h:e.type==='eagle'?58:e.type==='fire'?58:35};e.pos=pos;if(collision(h,pos))damageN()}
for(const b of N.shots){b.x+=b.vx*dt;b.ttl-=dt;for(const e of N.enemies){if(e.alive&&e.pos&&collision(b,e.pos)){e.alive=false;b.ttl=0;N.score+=50;N.enemiesPassed++;updateNStats()}}}N.shots=N.shots.filter(b=>b.ttl>0);
N.camera=Math.max(0,Math.min(2510-760,h.x-235));if(h.x>2440){if(N.level===1){N.score+=250;buildLevel(2)}else finishN();updateNStats()}}
function drawAsset(ctx,img,x,y,w,h){if(img.complete&&img.naturalWidth)ctx.drawImage(img,x,y,w,h);else{ctx.fillStyle='#b4a27a';ctx.fillRect(x,y,w,h)}}
function renderN(time=0){nx.clearRect(0,0,760,420);let cave=N.level===2;const bg=cave?art.cave:art.sky;if(bg.complete&&bg.naturalWidth){if(cave)nx.drawImage(bg,0,0,760,420);else{const sx=Math.min(bg.naturalWidth-760,Math.max(0,N.camera*.36));nx.drawImage(bg,sx,0,Math.min(1600,bg.naturalWidth-sx),bg.naturalHeight,0,0,760,420)}}else{nx.fillStyle='#816845';nx.fillRect(0,0,760,420)}
nx.fillStyle=cave?'rgba(15,8,5,.26)':'rgba(5,9,12,.15)';nx.fillRect(0,0,760,420);
nx.save();nx.translate(-N.camera,0);for(const p of N.platforms){nx.fillStyle='#6c5439';nx.fillRect(p.x,p.y,p.w,p.h);nx.fillStyle='#ac926b';nx.fillRect(p.x,p.y,p.w,8);nx.strokeStyle='#3a2819';nx.lineWidth=1;for(let k=p.x+24;k<p.x+p.w;k+=35){nx.beginPath();nx.moveTo(k,p.y+9);nx.lineTo(k,p.y+p.h);nx.stroke()}}
for(const c of N.coins){if(!c.got)drawAsset(nx,art.coin,c.x,c.y+Math.sin(time*.004+c.x)*3,34,33)}for(const e of N.enemies){if(!e.alive)continue;const p=e.pos||{x:e.x,y:e.y,w:55,h:45};drawAsset(nx,art[e.type==='fire'?'flame':e.type],p.x,p.y,p.w,p.h)}
for(const b of N.shots){nx.fillStyle='#e4c47c';nx.beginPath();nx.arc(b.x,b.y,7,0,Math.PI*2);nx.fill();nx.strokeStyle='#553d20';nx.stroke()}
const p=N.hero;if(p.inv===0||Math.floor(time/100)%2===0){nx.save();if(p.dir<0){nx.translate(p.x+p.w,p.y);nx.scale(-1,1);drawAsset(nx,art.hero,0,0,p.w,p.h)}else drawAsset(nx,art.hero,p.x,p.y,p.w,p.h);nx.restore()}
nx.fillStyle='#f3ce7b';nx.fillRect(2460,225,5,145);nx.fillStyle='#70451d';nx.fillRect(2465,220,50,30);nx.fillStyle='#ffe5a6';nx.font='bold 13px sans-serif';nx.fillText('EXIT',2471,240);nx.restore();nx.fillStyle='#ffcb67';nx.font='bold 12px sans-serif';nx.fillText(N.level===1?'CITY OF DAVID · ROOFTOPS':'CITY OF DAVID · UNDERGROUND',14,23)}
function nframe(time){if(N.state!=='playing')return;const dt=N.last?Math.min(.035,(time-N.last)/1000):0;N.last=time;if(dt)stepN(dt,time);renderN(time);if(N.state==='playing')N.raf=requestAnimationFrame(nframe)}
$('#ninjaBegin').addEventListener('click',startN);$('#ninjaRestart').addEventListener('click',startN);$('#ninjaPause').addEventListener('click',()=>N.state==='playing'?pauseN():N.state==='paused'?goN():startN());renderN();
// Keyboard only affects the currently selected, running game; browser scrolling otherwise works normally.
const tk={'ArrowLeft':'left','ArrowRight':'right','ArrowDown':'down','ArrowUp':'rotate','KeyX':'rotate','KeyZ':'backrotate','Space':'drop','KeyC':'hold'};
function normalizeN(code){return {'ArrowLeft':'left','KeyA':'left','ArrowRight':'right','KeyD':'right','Space':'jump','ArrowUp':'jump','KeyW':'jump','KeyX':'fire','KeyK':'fire'}[code]}
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;
 if(active==='tetris'&&T.state==='playing'){if(e.code==='KeyP'){e.preventDefault();pauseT();return}const a=tk[e.code];if(a){e.preventDefault();tAction(a)}}
 else if(active==='tetris'&&T.state==='paused'&&e.code==='KeyP'){e.preventDefault();resumeT()}
 if(active==='ninja'&&N.state==='playing'){if(e.code==='KeyP'){e.preventDefault();pauseN();return}const a=normalizeN(e.code);if(!a)return;e.preventDefault();if(a==='fire'&&!e.repeat)throwN();if(a==='jump'&&!e.repeat&&N.hero.ground){N.hero.vy=-470;N.hero.ground=false}if(a==='left'||a==='right')N.keys.add(a)}
 else if(active==='ninja'&&N.state==='paused'&&e.code==='KeyP'){e.preventDefault();goN()}
});
document.addEventListener('keyup',e=>{const a=normalizeN(e.code);if(a)N.keys.delete(a)});
window.addEventListener('blur',()=>{N.keys.clear();pauseN();pauseT()});document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseN();pauseT()}});
$$('[data-tetris]').forEach(btn=>{btn.addEventListener('pointerdown',e=>{e.preventDefault();tAction(btn.dataset.tetris);btn.classList.add('pressed')});['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,()=>btn.classList.remove('pressed')))});
$$('[data-ninja]').forEach(btn=>{const a=btn.dataset.ninja;btn.addEventListener('pointerdown',e=>{e.preventDefault();btn.classList.add('pressed');if(a==='left'||a==='right')N.keys.add(a);else if(a==='jump'&&N.state==='playing'&&N.hero.ground){N.hero.vy=-470;N.hero.ground=false}else if(a==='fire')throwN()});['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,()=>{btn.classList.remove('pressed');N.keys.delete(a)}))});
})();
