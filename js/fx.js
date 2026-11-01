/* Orașul din Telefon — efecte vizuale (inimioare, baloane, bule, confetti, steluțe, bomboane, note)
   OT.fx.burst('hearts', x, y, 10)   (x,y = coordonate pe ecran, în pixeli)
   OT.fx.rain('stars', 30, {ms: 6000})
   OT.fx.confetti(120)
*/
(function () {
  'use strict';
  const OT = window.OT;
  const COLORS = ['#F87171', '#FB923C', '#FACC15', '#4ADE80', '#38BDF8', '#818CF8', '#F472B6', '#A78BFA'];
  let layer = null;
  let count = 0;
  const pending = new Set(); // ploile programate (se opresc la schimbarea ecranului)
  const MAX = 180;

  function L() {
    if (!layer) layer = document.getElementById('fx');
    return layer;
  }
  function svgEl(vb, markup, size) {
    const el = OT.svg(vb, markup);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    return el;
  }
  function make(type, size) {
    const c = OT.pick(COLORS);
    const a = OT.art;
    switch (type) {
      case 'hearts':
        return svgEl('0 0 100 100', a.heart(OT.pick(['#F43F5E', '#FB7185', '#EC4899', '#F472B6'])), size);
      case 'balloons': {
        const el = svgEl('0 0 100 140', a.balloon(c), size);
        el.style.height = size * 1.4 + 'px';
        return el;
      }
      case 'stars':
        return svgEl('0 0 100 100', a.star(OT.pick(['#FDE047', '#FCD34D', '#FEF08A']), '#F59E0B'), size);
      case 'candy':
        return svgEl('0 0 100 100', a.candy(c), size);
      case 'notes':
        return svgEl('0 0 100 100', a.note(c), size);
      case 'sparkles':
        return svgEl('0 0 100 100', a.sparkle(OT.pick(['#FDE68A', '#FFFFFF', '#FBCFE8'])), size);
      case 'bubbles': {
        const d = OT.h('div', { class: 'fx-bubble' });
        d.style.width = d.style.height = size + 'px';
        return d;
      }
      case 'confetti': {
        const d = OT.h('div', { class: 'fx-confetti' });
        d.style.width = size * 0.5 + 'px';
        d.style.height = size + 'px';
        d.style.background = c;
        return d;
      }
      case 'animals': {
        const kinds = Object.keys(a.animals);
        return svgEl('0 0 100 100', a.animals[OT.pick(kinds)](), size);
      }
      default:
        return svgEl('0 0 100 100', a.star(), size);
    }
  }
  function add(el, x, y) {
    if (count >= MAX || !L()) return null;
    el.classList.add('fx-p');
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    L().appendChild(el);
    count++;
    return el;
  }
  function done(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
      count--;
    }
  }
  function run(el, frames, opts) {
    if (!el) return;
    if (!el.animate) {
      setTimeout(() => done(el), opts.duration || 1500);
      return;
    }
    const an = el.animate(frames, opts);
    an.onfinish = () => done(el);
    an.oncancel = () => done(el);
  }

  const fx = (OT.fx = {
    /** izbucnire de particule în jurul unui punct */
    burst(type, x, y, n, o) {
      o = o || {};
      n = n || 10;
      const base = o.size || (type === 'confetti' ? 18 : type === 'balloons' ? 54 : 40);
      for (let i = 0; i < n; i++) {
        const size = base * OT.rand(0.7, 1.25);
        const el = add(make(type, size), x - size / 2, y - size / 2);
        if (!el) return;
        const ang = OT.rand(0, Math.PI * 2);
        const dist = OT.rand(60, o.spread || 180);
        let dx = Math.cos(ang) * dist;
        let dy = Math.sin(ang) * dist;
        const dur = OT.rand(1200, 2000) * (o.slow || 1);
        let frames;
        if (type === 'balloons' || type === 'bubbles') {
          dx = OT.rand(-120, 120);
          dy = -OT.rand(260, Math.max(320, window.innerHeight * 0.8));
          frames = [
            { transform: 'translate(0,0) scale(.3)', opacity: 0 },
            { transform: `translate(${dx * 0.3}px, ${dy * 0.2}px) scale(1)`, opacity: 1, offset: 0.15 },
            { transform: `translate(${dx * 0.7}px, ${dy * 0.6}px) scale(1) rotate(${OT.rand(-10, 10)}deg)`, opacity: 1, offset: 0.7 },
            { transform: `translate(${dx}px, ${dy}px) scale(${type === 'bubbles' ? 1.4 : 1})`, opacity: 0 },
          ];
          run(el, frames, { duration: dur * 1.8, easing: 'ease-out', delay: i * 40 });
        } else {
          frames = [
            { transform: 'translate(0,0) scale(.2) rotate(0deg)', opacity: 0 },
            { transform: `translate(${dx * 0.6}px, ${dy * 0.6}px) scale(1.1) rotate(${OT.rand(-40, 40)}deg)`, opacity: 1, offset: 0.35 },
            { transform: `translate(${dx}px, ${dy + 60}px) scale(.8) rotate(${OT.rand(-90, 90)}deg)`, opacity: 0 },
          ];
          run(el, frames, { duration: dur, easing: 'cubic-bezier(.2,.7,.3,1)', delay: i * 18 });
        }
      }
    },
    /** cad de sus (ploaie de steluțe, bomboane, confetti) */
    rain(type, n, o) {
      o = o || {};
      const W = window.innerWidth;
      const x0 = o.x0 == null ? 0 : o.x0;
      const x1 = o.x1 == null ? W : o.x1;
      const y0 = o.y0 == null ? -60 : o.y0;
      const total = o.ms || 4000;
      for (let i = 0; i < n; i++) {
        const tid = setTimeout(() => {
          pending.delete(tid);
          const size = (o.size || 34) * OT.rand(0.7, 1.3);
          const el = add(make(type, size), OT.rand(x0, x1) - size / 2, y0);
          if (!el) return;
          const fall = (o.fall || window.innerHeight + 120) - y0;
          const sway = OT.rand(-60, 60);
          const dur = (o.fallMs || 3200) * OT.rand(0.8, 1.3);
          run(
            el,
            [
              { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
              { transform: `translate(${sway * 0.4}px, ${fall * 0.1}px) rotate(20deg)`, opacity: 1, offset: 0.1 },
              { transform: `translate(${sway}px, ${fall * 0.6}px) rotate(${OT.rand(-90, 90)}deg)`, opacity: 1, offset: 0.7 },
              { transform: `translate(${sway * 0.6}px, ${fall}px) rotate(${OT.rand(-180, 180)}deg)`, opacity: 0 },
            ],
            { duration: dur, easing: 'linear' }
          );
        }, (total * i) / n);
        pending.add(tid);
      }
    },
    confetti(n) {
      fx.rain('confetti', n || 100, { ms: 1500, size: 18, fallMs: 2600 });
    },
    /** o singură particulă care zboară de la (x1,y1) la (x2,y2) — ex. steluța spre borcan */
    fly(type, x1, y1, x2, y2, o) {
      o = o || {};
      const size = o.size || 60;
      const el = add(make(type, size), x1 - size / 2, y1 - size / 2);
      if (!el) return Promise.resolve();
      const dx = x2 - x1;
      const dy = y2 - y1;
      return new Promise((res) => {
        if (!el.animate) {
          done(el);
          return res();
        }
        const an = el.animate(
          [
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 120}px) scale(1.6) rotate(180deg)`, opacity: 1, offset: 0.4 },
            { transform: `translate(${dx}px, ${dy}px) scale(.5) rotate(360deg)`, opacity: 0.9 },
          ],
          { duration: o.ms || 1300, easing: 'ease-in-out' }
        );
        an.onfinish = () => {
          done(el);
          res();
        };
      });
    },
    at(el, type, n, o) {
      const c = OT.center(el);
      fx.burst(type, c.x, c.y, n, o);
    },
    clear() {
      pending.forEach(clearTimeout);
      pending.clear();
      if (!L()) return;
      L().innerHTML = '';
      count = 0;
    },
  });
})();
