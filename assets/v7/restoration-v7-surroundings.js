/* City of David surroundings: original 11 map regions, labels, and archived photographs.
   Color shapes extracted from CityofDavidSviva3.swf DefineButton2 rollover assets.
   Accessible hover/focus/click behavior; no Flash or server dependency. */
(() => {
  'use strict';
  const map = document.querySelector('#sviva6-map[data-sviva7="true"]');
  const node = document.getElementById('sviva6-data');
  if (!map || !node) return;
  const data = JSON.parse(node.textContent);
  const lang = document.body.dataset.lang || 'he';
  const photo = document.getElementById('sviva6-photo');
  const title = document.getElementById('sviva6-name');
  const tip = document.getElementById('sviva7-tooltip');
  const layers = Array.from(map.querySelectorAll('.sviva7-region'));
  const pins = Array.from(map.querySelectorAll('.sviva7-pin'));
  const shapes = Array.from(map.querySelectorAll('.sviva7-shape'));
  const list = Array.from(document.querySelectorAll('.sviva6-listlink'));
  let selected = 0;
  let hovered = -1;
  let persist = false;
  const label = (i) => data[i] && (data[i][lang] || data[i].en || data[i].he);
  const location = (i) => data[i] && '../assets/v6/surroundings/' + data[i].image;

  function changePhoto(i) {
    const v = data[i];
    if (!v) return;
    photo.src = location(i);
    photo.alt = label(i);
    title.textContent = label(i);
    // The old page changes the caption/photo on hovering a map location.
  }
  function showTooltip(i) {
    const v = data[i];
    if (!v) return;
    tip.textContent = label(i);
    tip.lang = lang;
    tip.dir = lang === 'he' ? 'rtl' : 'ltr';
    tip.hidden = false;
    // Bind label to its original yellow marker, not an arbitrary mouse position.
    const x = Math.max(15, Math.min(83, v.pinX / 498 * 100));
    const y = Math.max(8, Math.min(98, v.pinY / 653 * 100));
    tip.style.left = x + '%';
    tip.style.top = y + '%';
  }
  function active(i, keep) {
    if (!data[i]) return;
    hovered = i;
    persist = !!keep;
    layers.forEach(el => el.classList.toggle('sviva7-on', Number(el.dataset.region) === i));
    pins.forEach(el => el.classList.toggle('sviva7-hover', Number(el.dataset.place) === i));
    shapes.forEach(el => el.classList.toggle('sviva7-on', Number(el.dataset.place) === i));
    changePhoto(i);
    showTooltip(i);
  }
  function clearHover(force=false) {
    if (persist && !force) return;
    hovered = -1;
    persist = false;
    layers.forEach(el => el.classList.remove('sviva7-on'));
    pins.forEach(el => el.classList.remove('sviva7-hover'));
    shapes.forEach(el => el.classList.remove('sviva7-on'));
    tip.hidden = true;
    changePhoto(selected);
  }
  function choose(i) {
    if (!data[i]) return;
    selected = i;
    pins.concat(list).forEach(el => {
      const on = Number(el.dataset.place) === i;
      el.classList.toggle('active', on);
      el.setAttribute('aria-pressed', String(on));
    });
    active(i, true);
  }
  pins.forEach(el => {
    const i = Number(el.dataset.place);
    el.removeAttribute('title');
    el.addEventListener('mouseenter', () => active(i,false));
    el.addEventListener('focus', () => active(i,false));
    el.addEventListener('blur', () => clearHover(true));
    el.addEventListener('click', () => choose(i));
  });
  shapes.forEach(el => {
    const i = Number(el.dataset.place);
    el.addEventListener('pointerenter', () => active(i,false));
    el.addEventListener('focus', () => active(i,false));
    el.addEventListener('blur', () => clearHover(true));
    el.addEventListener('click', () => choose(i));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); choose(i);}
    });
  });
  list.forEach(el => {
    const i = Number(el.dataset.place);
    el.addEventListener('mouseenter', () => active(i,false));
    el.addEventListener('focus', () => active(i,false));
    el.addEventListener('mouseleave', () => clearHover(true));
    el.addEventListener('blur', () => clearHover(true));
    el.addEventListener('click', () => choose(i));
  });
  // The SWF's regions touch one another. Delegation avoids leave/enter ordering
  // clearing the new highlight while crossing a boundary.
  map.addEventListener('pointermove', (event) => {
    const target = event.target.closest('.sviva7-shape,.sviva7-pin');
    if (target) {
      const i = Number(target.dataset.place);
      if (hovered !== i) active(i,false);
    } else if (hovered !== -1 && !persist) clearHover(true);
  });
  map.addEventListener('mouseleave', () => clearHover(true));
  // In touch mode the selected name remains visible until the next selection.
  choose(0);
  clearHover(true);
})();
