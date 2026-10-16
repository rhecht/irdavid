(() => {
'use strict';
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const C = window.COD_CONTENT || { timeline:[], gallery:[], news:[], images:{} };
const img = name => C.images[name] || '';
const safeText = str => String(str||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const menuToggle=$('#menuToggle'), nav=$('#navLinks');
if(menuToggle && nav) menuToggle.addEventListener('click',()=>{let show=nav.classList.toggle('visible');menuToggle.setAttribute('aria-expanded',String(show))});
const more=$('#moreToggle');
if(more)more.addEventListener('click',()=>{const wrapper=more.closest('.more-wrap');wrapper.classList.toggle('open');more.setAttribute('aria-expanded',String(wrapper.classList.contains('open')))});
// Original recovered site music never auto-starts.
const music=$('#backgroundMusic'), musicBtn=$('#musicToggle');
if(music && musicBtn){musicBtn.addEventListener('click',async()=>{
 if(music.paused){try{await music.play();musicBtn.textContent='♫ Pause original site music';musicBtn.setAttribute('aria-pressed','true')}catch(e){musicBtn.textContent='Audio could not be played';}}
 else{music.pause();musicBtn.textContent='♫ Play original site music';musicBtn.setAttribute('aria-pressed','false')}
});}
// Timeline: all 16 original English chapters and their actual 2009 accompanying images.
const eraBtns=$('#eraButtons');
if(eraBtns && C.timeline?.length){let current=0;const periods=C.timeline;
 periods.forEach((period,index)=>{const b=document.createElement('button');b.type='button';b.textContent=String(index+1).padStart(2,'0')+' · '+period.title;b.dataset.index=index;b.addEventListener('click',()=>select(index));eraBtns.appendChild(b)});
 const select=index=>{current=Math.max(0,Math.min(index,periods.length-1));const p=periods[current];
 $('#eraTitle').textContent=p.title;$('#eraText').innerHTML=p.article;$('#eraCount').textContent=String(current+1).padStart(2,'0')+' / '+String(periods.length).padStart(2,'0');
 const photo=$('#eraImage');if(p.image){photo.src=encodeURI(p.image);photo.style.display='block';}else photo.style.display='none';
 $$('.era-buttons button').forEach((b,i)=>{b.classList.toggle('current',i===current);b.setAttribute('aria-current',i===current?'true':'false')});
 $('#eraPrev').disabled=current===0;$('#eraNext').disabled=current===periods.length-1;
 try { if(history.replaceState) history.replaceState(null,'','#period-'+(current+1)); } catch (_) { /* works in restricted local-file browsing */ }
 };
 $('#eraPrev').addEventListener('click',()=>select(current-1));$('#eraNext').addEventListener('click',()=>select(current+1));
 window.addEventListener('hashchange',()=>{const p=/period-(\d+)/.exec(location.hash);if(p)select(Number(p[1])-1)});
 const initial=/period-(\d+)/.exec(location.hash);select(initial?Number(initial[1])-1:0);
}
// View original 5,394-pixel panorama with pointer-drag, slider and arrow controls.
const pan=$('#panoramaFrame'), panoImg=$('#panoramaImage');
if(pan && panoImg){let pct=.5,start=null;const slider=$('#panRange');
 const draw=()=>{const overflow=Math.max(0,panoImg.getBoundingClientRect().width-pan.clientWidth);panoImg.style.transform='translateX('+(-overflow*pct)+'px)';slider.value=String(Math.round(pct*100));$('#panPosition').textContent=String(Math.round(pct*100))+'%'};
 const set=n=>{pct=Math.max(0,Math.min(1,n));draw()};
 const ready=()=>{panoImg.style.width='auto';panoImg.style.height=pan.clientHeight+'px';draw()};
 panoImg.addEventListener('load',ready);if(panoImg.complete)ready();
 slider.addEventListener('input',()=>set(Number(slider.value)/100));$('#panPrev').addEventListener('click',()=>set(pct-.12));$('#panNext').addEventListener('click',()=>set(pct+.12));$('#panReset').addEventListener('click',()=>set(.5));
 pan.addEventListener('pointerdown',e=>{start={x:e.clientX,p:pct};pan.setPointerCapture(e.pointerId)});
 pan.addEventListener('pointermove',e=>{if(!start)return;const overflow=Math.max(1,panoImg.getBoundingClientRect().width-pan.clientWidth);set(start.p-(e.clientX-start.x)/overflow)});
 pan.addEventListener('pointerup',()=>start=null);pan.addEventListener('pointercancel',()=>start=null);
 pan.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();set(pct-.035)}if(e.key==='ArrowRight'){e.preventDefault();set(pct+.035)}});
 window.addEventListener('resize',draw);
}
// Present genuine archival virtual-tour slides. Missing videos are not made to look playable.
const places=$('#locationGrid');
if(places){const refs=['place1.flv','place2.flv','place3.flv','place5.flv','place7.flv','place8.flv','place11.flv','place12.flv','place13.flv'];
 const backgrounds=C.gallery.filter(g=>g.group==='dragmasker' && (g.width>=400));
 refs.forEach((file,i)=>{const item=backgrounds[i%Math.max(1,backgrounds.length)];const el=document.createElement('article');el.className='location-card';el.innerHTML=`${item?`<img src="${item.file}" alt="Original virtual tour scene" loading="lazy">`:`<img src="${img('aerial')}" alt="Original tour background" loading="lazy">`}<div class="card-body"><h3>Archive location ${i+1}</h3><small>Original external path: video/${safeText(file)}</small><div class="unavailable">◌ Video file not supplied</div></div>`;places.appendChild(el)});
}
// Gallery: filtered, paged, accessible lightbox; image files from source SWFs.
let currentGallery=[];let lightboxIndex=0;
const lightbox=$('#lightbox'), modalImg=$('#lightboxImage');
const openLightbox=i=>{if(!lightbox || !currentGallery[i])return;lightboxIndex=i;const item=currentGallery[i];modalImg.src=item.file;modalImg.alt='Recovered image from '+item.source;$('#lightboxCaption').textContent=item.source+' · '+item.width+' × '+item.height+' px';lightbox.hidden=false;document.body.classList.add('lightbox-open');$('.lightbox-close').focus()};
const closeLightbox=()=>{if(!lightbox)return;lightbox.hidden=true;document.body.classList.remove('lightbox-open')};
const moveLightbox=delta=>openLightbox((lightboxIndex+delta+currentGallery.length)%currentGallery.length);
if(lightbox){$('.lightbox-close').addEventListener('click',closeLightbox);$('.lightbox-prev').addEventListener('click',()=>moveLightbox(-1));$('.lightbox-next').addEventListener('click',()=>moveLightbox(1));lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});document.addEventListener('keydown',e=>{if(lightbox.hidden)return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')moveLightbox(-1);if(e.key==='ArrowRight')moveLightbox(1)})}
const galleryGrid=$('#galleryGrid');
if(galleryGrid){let displayed=0;
 const filterGallery=()=>{const group=$('#galleryFilter').value,query=$('#gallerySearch').value.trim().toLowerCase();currentGallery=C.gallery.filter(g=>(group==='all'||(group==='CityofDavid'?g.group.startsWith('CityofDavid'):group==='dragmasker'?g.group.startsWith('dragmasker'):g.group===group))&&(!query||(g.source.toLowerCase().includes(query)||g.group.toLowerCase().includes(query))));displayed=0;galleryGrid.replaceChildren();append();$('#galleryCount').textContent=currentGallery.length+' recovered image'+(currentGallery.length===1?'':'s')+' in this view'};
 const append=()=>{const end=Math.min(currentGallery.length,displayed+24);for(let i=displayed;i<end;i++){const item=currentGallery[i];const b=document.createElement('button');b.type='button';b.className='gallery-item';b.innerHTML=`<img src="${item.thumb}" alt="Recovered image from ${safeText(item.group)}" loading="lazy"><span>${safeText(item.source)}</span>`;b.addEventListener('click',()=>openLightbox(i));galleryGrid.appendChild(b)}displayed=end;$('#galleryMore').hidden=displayed>=currentGallery.length};
 $('#galleryMore').addEventListener('click',append);$('#galleryFilter').addEventListener('change',filterGallery);$('#gallerySearch').addEventListener('input',filterGallery);filterGallery();
}
// HTML5 game inspired by MatchingPairs2. This game is new; source images are preserved.
const game=$('#memoryGrid');
if(game){const pool=[1,2,3,4,5,6].map(i=>({file:img('gamecard'+i)}));let selected=[],done=0,moves=0,locked=false;
 const start=()=>{done=0;moves=0;selected=[];locked=false;$('#gameMoves').textContent='0';$('#gameMatches').textContent='0 / 6';$('#gameMessage').textContent='';game.replaceChildren();
 const cards=[...pool.map((f,i)=>({file:f.file,pair:i})),...pool.map((f,i)=>({file:f.file,pair:i}))];for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]]}
 cards.forEach((c,i)=>{const b=document.createElement('button');b.className='memory-tile';b.type='button';b.setAttribute('aria-label','Hidden card '+(i+1));b.innerHTML='<span>✦</span><img alt="Historical image" src="'+c.file+'">';b.addEventListener('click',()=>{
 if(locked||b.classList.contains('flipped')||b.classList.contains('matched'))return;b.classList.add('flipped');b.setAttribute('aria-label','Revealed archaeological image');selected.push({b,pair:c.pair});if(selected.length!==2)return;
 moves++;$('#gameMoves').textContent=String(moves);if(selected[0].pair===selected[1].pair){selected.forEach(x=>{x.b.classList.add('matched');x.b.disabled=true});done++;$('#gameMatches').textContent=done+' / 6';selected=[];if(done===6)$('#gameMessage').textContent='All pairs found! A piece of Jerusalem’s past rediscovered.'}
 else{locked=true;const old=selected;setTimeout(()=>{old.forEach(x=>{x.b.classList.remove('flipped');x.b.setAttribute('aria-label','Hidden card')});selected=[];locked=false},850)}
 });game.appendChild(b)})
 };$('#restartGame').addEventListener('click',start);start();
}
})();
