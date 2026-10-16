(() => {
 'use strict';
 // Replay original Hp4.swf globe/radar art. The user explicitly starts soundtrack to meet browser policy.
 const overlay=document.getElementById('hp6-intro');
 if(overlay){
  const main=overlay.closest('.hp-v4-main');
  const screen=document.getElementById('hp6-screen'), globe=document.getElementById('hp6-globe');
  const start=document.getElementById('hp6-start'),skip=document.getElementById('hp6-skip'),replay=document.getElementById('hp6-replay');
  const controls=overlay.querySelector('.hp6-overlay');
  const sound=main.closest('.hp-v4-layout').querySelector('audio');
  const BASE='../assets/v6/globe/';
  const files=["hp4_id0100_DefineBits.png", "hp4_id0103_DefineBits.png", "hp4_id0107_DefineBits.png", "hp4_id0110_DefineBits.png", "hp4_id0113_DefineBits.png", "hp4_id0116_DefineBits.png", "hp4_id0119_DefineBits.png", "hp4_id0122_DefineBits.png", "hp4_id0125_DefineBits.png", "hp4_id0128_DefineBits.png", "hp4_id0131_DefineBits.png", "hp4_id0134_DefineBits.png", "hp4_id0137_DefineBits.png", "hp4_id0140_DefineBits.png", "hp4_id0143_DefineBits.png", "hp4_id0146_DefineBits.png", "hp4_id0149_DefineBits.png", "hp4_id0152_DefineBits.png", "hp4_id0155_DefineBits.png", "hp4_id0158_DefineBits.png", "hp4_id0161_DefineBits.png", "hp4_id0164_DefineBits.png", "hp4_id0167_DefineBits.png", "hp4_id0170_DefineBits.png", "hp4_id0173_DefineBits.png", "hp4_id0176_DefineBits.png", "hp4_id0179_DefineBits.png", "hp4_id0182_DefineBits.png", "hp4_id0185_DefineBits.png", "hp4_id0188_DefineBits.png", "hp4_id0191_DefineBits.png", "hp4_id0194_DefineBits.png", "hp4_id0197_DefineBits.png", "hp4_id0201_DefineBits.png", "hp4_id0204_DefineBits.png", "hp4_id0207_DefineBits.png", "hp4_id0210_DefineBits.png", "hp4_id0213_DefineBits.png", "hp4_id0216_DefineBits.png", "hp4_id0219_DefineBits.png", "hp4_id0222_DefineBits.png", "hp4_id0225_DefineBits.png", "hp4_id0228_DefineBits.png", "hp4_id0231_DefineBits.png", "hp4_id0234_DefineBits.png", "hp4_id0237_DefineBits.png", "hp4_id0240_DefineBits.png", "hp4_id0243_DefineBits.png"];
  // Only use frames that exist in the recovered sequence.
  let pos=0,ticker=null,endTimer=null,phaseTimers=[];
  const effects=[106,200].map(id=>{const a=new Audio(`../assets/v6/hp4_id${String(id).padStart(4,'0')}.mp3`);a.preload='auto';a.volume=.7;return a});
  const clear=()=>{clearInterval(ticker);clearTimeout(endTimer);phaseTimers.forEach(clearTimeout);phaseTimers=[];effects.forEach(a=>{a.pause();a.currentTime=0});};
  const hide=()=>{clear();overlay.classList.add('hp6-hidden');overlay.classList.remove('hp6-finishing');screen.classList.remove('hp6-zoom','hp6-radaring');};
  const playSound=()=>{if(sound){sound.volume=.74;sound.currentTime=0;sound.play().catch(()=>{const note=main.querySelector('.hp-v4-source-note');if(note)note.textContent='Use the audio player to enable soundtrack.';});}};
  const run=()=>{
   clear();overlay.classList.remove('hp6-hidden','hp6-finishing');screen.classList.remove('hp6-zoom','hp6-radaring');
   controls.classList.add('hp6-playing');pos=0;globe.src=BASE+files[pos];playSound();
   // Original hp4.swf: StartSound 106 on SWF frame 3, StartSound 200 on frame 34 at 30 fps.
   phaseTimers.push(setTimeout(()=>effects[0].play().catch(()=>{}),100));
   phaseTimers.push(setTimeout(()=>effects[1].play().catch(()=>{}),1133));
   // Advance recovered Earth frames sequentially, then re-create radar/aerial fly-in.
   ticker=setInterval(()=>{pos++;if(pos<files.length){globe.src=BASE+files[pos]}else{
     clearInterval(ticker);ticker=null;screen.classList.add('hp6-zoom');
     phaseTimers.push(setTimeout(()=>{screen.classList.add('hp6-radaring');globe.style.opacity='0';},180));
     phaseTimers.push(setTimeout(()=>{screen.querySelector('.hp6-radar').style.backgroundImage="url('../assets/v6/head/hp4_id0250_DefineBitsJPEG2.jpg')"},650));
     phaseTimers.push(setTimeout(()=>{screen.querySelector('.hp6-radar').style.backgroundImage="url('../assets/v6/head/hp4_id0257_DefineBitsJPEG2.jpg')"},1650));
     phaseTimers.push(setTimeout(()=>{screen.querySelector('.hp6-radar').style.backgroundImage="url('../assets/v6/head/hp4_id0283_DefineBitsJPEG3.jpg')"},3400));
     phaseTimers.push(setTimeout(()=>{screen.querySelector('.hp6-radar').style.backgroundImage="url('../assets/v6/head/hp4_id0330_DefineBitsJPEG2.jpg')"},4050));
     endTimer=setTimeout(()=>{overlay.classList.add('hp6-finishing');phaseTimers.push(setTimeout(hide,650))},6500);
   }},33.33);
  };
  const reset=()=>{globe.style.opacity='';screen.querySelector('.hp6-radar').style.backgroundImage="url('../assets/v6/head/hp4_id0243_DefineBits.png')";};
  start.addEventListener('click',()=>{reset();run()});skip.addEventListener('click',()=>{hide();if(sound && sound.paused) sound.play().catch(()=>{})});
  if(replay)replay.addEventListener('click',()=>{reset();run()});
  window.addEventListener('pagehide',clear);
 }
 // Early Jerusalem: clickable markers synchronized with the original source-page labels and photos.
 const map=document.getElementById('sviva6-map');
 if(map){
  const data=JSON.parse(document.getElementById('sviva6-data').textContent),lang=document.body.dataset.lang;
  const photo=document.getElementById('sviva6-photo'),name=document.getElementById('sviva6-name');
  const buttons=[...document.querySelectorAll('[data-place]')];
  const select=(i)=>{const v=data[i];if(!v)return;photo.src='../assets/v6/surroundings/'+v.image;photo.alt=(lang==='he'?v.he:v.en);name.textContent=lang==='he'?v.he:v.en;
   buttons.forEach(b=>{let active=Number(b.dataset.place)===i;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});};
  buttons.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.place))));select(0);
 }
})();
