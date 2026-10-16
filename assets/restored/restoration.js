(()=>{'use strict';const $=(q)=>document.querySelector(q);const $$=(q)=>[...document.querySelectorAll(q)];const root=$('#intro');if(root){const steps=$$('.intro-frame'),go=$('#start-with-sound'),audio=$('#intro-audio'),choice=$('#choice'),notice=$('#intro-state');let cur=0,timers=[],sound=true;function stop(){timers.forEach(clearTimeout);timers=[]}function frame(i){cur=i;steps.forEach((x,k)=>x.classList.toggle('active',k===i));choice.hidden=i<9;notice.textContent=i>=9?'Select a language · בחרו שפה':'City of David · '+Math.max(i,1)+' / '+(steps.length-1)}function start(){stop();frame(0);go.hidden=true;audio.currentTime=0;if(sound)audio.play().catch(()=>{notice.textContent='Sound blocked — click Sound on to enable'});steps.slice(1).forEach((_,k)=>timers.push(setTimeout(()=>frame(k+1),2050*(k+1))))}function finish(){stop();frame(steps.length-1);go.hidden=true;audio.pause()}go.onclick=start;$('#intro-skip').onclick=finish;$('#intro-replay').onclick=start;$('#sound-toggle').onclick=()=>{sound=!sound;$('#sound-toggle').textContent=sound?'♫ Sound on':'♫ Sound off';$('#sound-toggle').setAttribute('aria-pressed',sound?'true':'false');if(!sound)audio.pause();else audio.play().catch(()=>{});};document.addEventListener('keydown',e=>{if(e.key==='Escape')finish()});$$('.languagebar a').forEach(a=>a.addEventListener('click',()=>audio.pause()));}
const pano=$('.panorama-view');if(pano){let drag=false,start=0,old=0,pos=0;const pic=pano.querySelector('img');function range(){return Math.max(0,pic.getBoundingClientRect().width-pano.clientWidth)}function set(x){pos=Math.max(-range(),Math.min(0,x));pic.style.left=pos+'px'}pic.onload=()=>set(-range()/2);pano.addEventListener('pointerdown',e=>{drag=true;start=e.clientX;old=pos;pano.setPointerCapture(e.pointerId)});pano.addEventListener('pointermove',e=>{if(drag)set(old+e.clientX-start)});pano.addEventListener('pointerup',()=>drag=false);$$('[data-pan]').forEach(b=>b.onclick=()=>set(pos+Number(b.dataset.pan)))}
$$('.tour-hotspots button').forEach(b=>b.onclick=()=>{const t=$('#tour-feedback');t.textContent=b.title+' — the original linked location video is not in the supplied archive.';});$$('.audio-switch').forEach(b=>b.onclick=()=>{const a=b.parentNode.querySelector('audio');if(a.paused)a.play().catch(()=>{});else a.pause()});
})();

// Version 4 rebuilt chronology. The year is part of each selectable image, above its image rather than over it.
(()=>{'use strict';const rail=document.querySelector('#period-rail');if(!rail)return;
const dataNode=document.querySelector('#timeline-data'), detail=document.querySelector('#period-detail');if(!dataNode||!detail)return;
const periods=JSON.parse(dataNode.textContent),lang=document.body.dataset.lang||'en',base='../assets/restored/images/';
const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=p=>lang==='he'?p.he:p.en;
const year=p=>(p.year<0?String(Math.abs(p.year))+' BCE':String(p.year)+(p.year<100?' CE':''));
let index=periods.length-1;rail.textContent='';
function select(i){index=i;Array.from(rail.children).forEach((el,k)=>{let on=i===k;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on));if(on)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current')});
const p=periods[i];let body=p.has_archived_text?`<p class="hebrew-source" lang="he" dir="rtl">${esc(p.he_body)}</p>`:`<p class="period-note-missing">${lang==='he'?'לא נשמר תיאור נפרד לתקופה זו בארכיון.':'No separate original description survives for this period.'}</p>`;
const sub=p.he_subtitle?`<h3 lang="he" dir="rtl">${esc(p.he_subtitle)}</h3>`:'';
detail.innerHTML=`<img class="period-detail-art" alt="${esc(title(p))}" src="${base+encodeURIComponent(p.image)}"><div class="period-detail-copy"><h2>${esc(title(p))} · <span dir="ltr">${year(p)}</span></h2>${sub}${body}</div>`;
const selected=rail.children[i];if(selected){const host=rail.getBoundingClientRect(),box=selected.getBoundingClientRect();if(box.left<host.left || box.right>host.right)selected.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});}}
periods.forEach((p,i)=>{const button=document.createElement('button');button.type='button';button.className='period-tile';button.title=title(p)+' · '+year(p);button.setAttribute('aria-label',button.title);button.innerHTML=`<span class="period-year" dir="ltr">${p.year}</span><span class="period-image"><img alt="" loading="eager" src="${base+encodeURIComponent(p.image)}"></span><span class="period-shortname">${esc(title(p))}</span>`;button.addEventListener('click',()=>select(i));button.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const offset=e.key==='ArrowRight'?(lang==='he'?-1:1):(lang==='he'?1:-1);const next=(i+offset+periods.length)%periods.length;rail.children[next].focus();select(next)}});rail.append(button)});
select(index);
})();
// Version 5: Magnifier shows a magnified crop of the CURRENT composited frame.
// The historical time slider is completely independent of the optical magnifier.
(()=>{'use strict';
const tour=document.querySelector('.hp-v4-layout');if(!tour)return;
const dataNode=document.querySelector('#hp-images');if(!dataNode)return;
const data=JSON.parse(dataNode.textContent);
const view=document.querySelector('#hp-view'),base=document.querySelector('#hp-image-0'),blend=document.querySelector('#hp-image-1');
const range=document.querySelector('#hp-time'),lens=document.querySelector('#hp-magnifier'),magnify=document.querySelector('#hp-glass');
const markers=document.querySelector('#hp-markers'),lone=document.querySelector('.hp-v4-label-one'),ltwo=document.querySelector('.hp-v4-label-two');
const lenslabel=document.querySelector('#hp-lens-label');if(lenslabel)lenslabel.hidden=true;
const canvas=document.createElement('canvas');canvas.className='hp-v5-lens-canvas';canvas.setAttribute('aria-hidden','true');
lens.prepend(canvas);const ctx=canvas.getContext('2d');
const images=[...data.images,data.base],positions=[0,20,35,65,85,100];
let hovered=false,pinned=false,touchActive=false,frac=0,px=.5,py=.5;
const zoom=2.35;
function pair(p){let i=0;while(i<positions.length-2&&p>positions[i+1])i++;
 return {i,j:i+1,t:Math.max(0,Math.min(1,(p-positions[i])/(positions[i+1]-positions[i])))};}
function drawLens(){if(!lens.classList.contains('visible'))return;
 const w=lens.clientWidth,h=lens.clientHeight;if(!w||!h)return;
 const ratio=Math.min(3,window.devicePixelRatio||1),cw=Math.round(w*ratio),ch=Math.round(h*ratio);
 if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}
 ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
 const vr=view.getBoundingClientRect(),vw=vr.width,vh=vr.height;
 // Images use object-fit:fill on the main viewer. Replicate those precise
 // dimensions here, enlarged around the SAME pointer coordinates.
 function layer(img,opacity){if(opacity<=0||!img.complete||!img.naturalWidth)return;
  ctx.globalAlpha=opacity;
  ctx.drawImage(img,w/2-px*vw*zoom,h/2-py*vh*zoom,vw*zoom,vh*zoom);
 }
 layer(base,1);layer(blend,frac);ctx.globalAlpha=1;
}
function render(){const p=Number(range.value);const st=pair(p);frac=st.t;
 if(base.getAttribute('src')!==images[st.i])base.src=images[st.i];
 if(blend.getAttribute('src')!==images[st.j])blend.src=images[st.j];
 blend.style.opacity=String(frac);
 const value=p<50?data.ancient+' '+(100-p)+'%':data.modern+' '+p+'%';
 range.setAttribute('aria-valuetext',value);
 drawLens();
}
function move(x,y){const r=view.getBoundingClientRect();
 px=Math.max(0,Math.min(1,(x-r.left)/r.width));py=Math.max(0,Math.min(1,(y-r.top)/r.height));
 lens.style.left=(px*100)+'%';lens.style.top=(py*100)+'%';drawLens();
}
function show(){lens.classList.toggle('visible',hovered||pinned||touchActive);drawLens();}
base.addEventListener('load',drawLens);blend.addEventListener('load',drawLens);
range.addEventListener('input',render);
view.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;hovered=true;move(e.clientX,e.clientY);show();});
view.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&!touchActive)return;
 if(e.pointerType!=='touch')hovered=true;move(e.clientX,e.clientY);show();});
view.addEventListener('pointerleave',e=>{if(e.pointerType==='touch')return;hovered=false;show();});
view.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;touchActive=true;move(e.clientX,e.clientY);show();});
view.addEventListener('pointerup',()=>{touchActive=false;show();});
view.addEventListener('pointercancel',()=>{touchActive=false;show();});
magnify.addEventListener('click',()=>{pinned=!pinned;magnify.setAttribute('aria-pressed',String(pinned));
 if(pinned&&!hovered){px=.5;py=.5;lens.style.left='50%';lens.style.top='50%';}show();});
markers.addEventListener('click',()=>{const yes=markers.getAttribute('aria-pressed')!=='true';
 markers.setAttribute('aria-pressed',String(yes));lone.hidden=ltwo.hidden=!yes;});
view.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
 e.preventDefault();range.value=String(Math.max(0,Math.min(100,Number(range.value)+(e.key==='ArrowLeft'?-5:5))));render();
 }else if(e.key==='Escape'){pinned=false;magnify.setAttribute('aria-pressed','false');show();}});
window.addEventListener('resize',drawLens);
render();
})();
