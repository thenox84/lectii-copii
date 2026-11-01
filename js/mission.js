/* Orașul din Telefon — misiunile Mariei (fundița roz 🎀)
   Tipuri de misiuni (câmpul `mission` al unei clădiri):

   { type: 'count', say: 'Maria, câte plicuri vezi?',
     item: (i) => markupSVG_100x100, n: 5, max: 6,
     answer: 'Sunt cinci plicuri!', bg: markup_800x420 (opțional), positions: [[x,y],...] (opțional) }

   { type: 'match', say: 'Trage fiecare pătrățel în căsuța de aceeași culoare!',
     colors: ['#EF4444', '#3B82F6', '#FACC15'],
     item: (culoare) => markup_100x100, target: (culoare) => markup_100x100 }

   { type: 'stars', say: 'Găsește trei steluțe ascunse în desen!',
     scene: markup_800x450, stars: [[x, y, raza], [x, y, raza], [x, y, raza]] }

   { type: 'custom', say: '...', icon: markup_100x100, render(body, api) }   // api.win(), api.tryAgain(t), api.scope
*/
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;

  /* borcanul cu steluțe (viewBox 0 0 120 140) */
  OT.art.jar = function (n) {
    const pos = [[44, 114], [78, 116], [60, 98], [36, 92], [86, 94], [60, 78], [42, 64], [80, 66], [60, 50]];
    let s = '';
    for (let i = 0; i < Math.min(n, pos.length); i++) {
      s += `<path d="${OT.art.starPath(pos[i][0], pos[i][1], 15, 7)}" fill="#FCD34D" stroke="#F59E0B" stroke-width="2.5" stroke-linejoin="round" transform="rotate(${(i * 23) % 40 - 20} ${pos[i][0]} ${pos[i][1]})"/>`;
    }
    return (
      `<path d="M28 28 h64 q10 0 10 12 v82 q0 14 -14 14 h-56 q-14 0 -14 -14 v-82 q0 -12 10 -12z" fill="#E0F2FE" fill-opacity=".75" stroke="#7DD3FC" stroke-width="4"/>` +
      s +
      `<path d="M30 44 v66" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".75"/>` +
      `<rect x="24" y="20" width="72" height="12" rx="6" fill="#7DD3FC"/><rect x="32" y="6" width="56" height="18" rx="6" fill="#F472B6"/>` +
      `<g transform="translate(46 0) scale(.28)">${OT.art.bow()}</g>`
    );
  };

  // numele culorilor pentru „căsuța …” (feminin)
  const COLOR_NAMES = {
    '#EF4444': 'roșie', '#3B82F6': 'albastră', '#FACC15': 'galbenă', '#22C55E': 'verde',
    '#A855F7': 'mov', '#F97316': 'portocalie', '#EC4899': 'roz',
  };
  const DICE = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[26, 26], [50, 50], [74, 74]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  };

  let cur = null; // misiunea deschisă

  const M = (OT.mission = {
    close() {
      if (!cur) return;
      cur.scope.dispose();
      cur.el.remove();
      cur = null;
      OT.speakStop();
    },
    open(b, onWin, jarEl) {
      M.close();
      const def = b.mission;
      if (!def) return;
      const scope = OT.scope();
      const already = !!OT.state.stars[b.id];
      const el = h('div', { class: 'mission', role: 'dialog', 'aria-label': 'Misiunea Mariei' });
      const card = h('div', { class: 'm-card' });
      const maria = h('div', { class: 'm-maria' });
      maria.appendChild(OT.art.head('maria'));
      const say = h('button', { class: 'm-say', 'aria-label': 'Ascultă ce ai de făcut' }, '🔊');
      const picto = h('div', { class: 'm-picto' });
      picto.appendChild(OT.svg('0 0 100 100', def.icon || pictogram(def)));
      const close = h('button', { class: 'm-close', 'aria-label': 'Închide' }, '✕');
      const head = h('div', { class: 'm-head' }, maria, say, picto, close);
      const body = h('div', { class: 'm-body m-' + def.type });
      const fb = h('div', { class: 'm-feedback' });
      card.append(head, body, fb);
      el.appendChild(card);
      document.body.appendChild(el);
      cur = { el, scope };

      const speakTask = () => OT.speak(def.say);
      say.addEventListener('click', () => {
        OT.sfx('tap');
        speakTask();
        say.classList.remove('wiggle');
      });
      close.addEventListener('click', () => {
        OT.sfx('tap');
        M.close();
      });
      scope.timeout(speakTask, 350);
      say.classList.add('wiggle');

      let won = false;
      const api = {
        scope,
        body,
        speak: (t) => OT.speak(t),
        tryAgain(msg) {
          OT.sfx('hmm');
          const t = 'Mai încearcă! ' + (msg || '');
          fb.className = 'm-feedback again';
          fb.textContent = '💗 ' + t;
          OT.speak(t);
        },
        win(msg) {
          if (won) return;
          won = true;
          OT.sfx('star');
          scope.timeout(() => OT.sfx('success'), 300);
          const t = 'Bravo, Maria! ' + (msg || '') + (already ? '' : ' Ai câștigat o steluță!');
          fb.className = 'm-feedback win';
          fb.innerHTML = '';
          fb.appendChild(h('span', {}, '⭐ ' + t));
          OT.speak(t);
          const c = OT.center(card);
          OT.fx.burst('stars', c.x, c.y, 16, { spread: 260 });
          OT.fx.confetti(60);
          if (!already) {
            OT.state.stars[b.id] = true;
            OT.save();
            if (jarEl) {
              const j = OT.center(jarEl);
              OT.fx.fly('stars', c.x, c.y, j.x, j.y, { size: 80, ms: 1500 }).then(() => {
                if (onWin) onWin();
                jarEl.classList.remove('bump');
                void jarEl.offsetWidth;
                jarEl.classList.add('bump');
              });
            } else if (onWin) scope.timeout(onWin, 1500);
          }
          const ok = h('button', { class: 'big-btn m-ok' }, '⭐ Gata!');
          ok.addEventListener('click', () => {
            OT.sfx('tap');
            M.close();
          });
          scope.timeout(() => fb.appendChild(ok), 900);
        },
      };
      const T = TYPES[def.type];
      if (T) T(def, body, api);
    },
  });

  function pictogram(def) {
    if (def.type === 'count') {
      const it = def.item ? def.item(0) : OT.art.star();
      return `<g transform="translate(2 8) scale(.5)">${it}</g><text x="78" y="44" font-size="40" font-weight="900" text-anchor="middle" fill="#DB2777">?</text>` +
        `<g font-size="20" font-weight="900" fill="#2B2D42" text-anchor="middle"><rect x="6" y="64" width="26" height="28" rx="6" fill="#FCE7F3"/><text x="19" y="85">1</text><rect x="37" y="64" width="26" height="28" rx="6" fill="#FCE7F3"/><text x="50" y="85">2</text><rect x="68" y="64" width="26" height="28" rx="6" fill="#FCE7F3"/><text x="81" y="85">3</text></g>`;
    }
    if (def.type === 'match') {
      const c = (def.colors && def.colors[0]) || '#EF4444';
      return `<rect x="6" y="30" width="30" height="30" rx="6" fill="${c}"/><path d="M42 46 h18 l-6 -7 M60 46 l-6 7" stroke="#DB2777" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<path d="M64 34 h30 v32 h-30z" fill="none" stroke="${c}" stroke-width="6" stroke-linejoin="round"/><path d="M64 34 l8 -8 h30 l-8 8" fill="none" stroke="${c}" stroke-width="4"/>`;
    }
    if (def.type === 'stars') {
      return `<circle cx="34" cy="34" r="20" fill="#E0F2FE" stroke="#64748B" stroke-width="7"/><path d="M48 48 l18 18" stroke="#64748B" stroke-width="10" stroke-linecap="round"/>` +
        [[24, 84], [50, 84], [76, 84]].map(([x, y]) => `<path d="${OT.art.starPath(x, y, 12, 5.5)}" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>`).join('') +
        `<path d="${OT.art.starPath(78, 30, 14, 6)}" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>`;
    }
    return OT.art.note('#EC4899');
  }

  /* ---------- tipurile de misiuni ---------- */
  const TYPES = {
    /* NUMĂRĂ */
    count(def, body, api) {
      const n = def.n;
      const max = def.max || 6;
      const VBW = 800;
      const VBH = 420;
      const slots = def.positions || [
        [120, 110], [320, 90], [520, 120], [700, 95], [200, 300], [420, 290], [620, 305], [80, 250], [740, 260],
      ];
      const pos = slots.slice(0, n);
      let m = def.bg || '';
      pos.forEach(([x, y], i) => {
        m += `<g class="c-item" data-i="${i}" transform="translate(${x - 60} ${y - 60})"><g class="c-inner"><g transform="scale(1.2)">${def.item(i)}</g></g>` +
          `<g class="c-num" opacity="0"><circle cx="100" cy="10" r="26" fill="#DB2777"/><text x="100" y="21" font-size="32" font-weight="900" text-anchor="middle" fill="#fff">${i + 1}</text></g></g>`;
      });
      const svg = OT.svg(`0 0 ${VBW} ${VBH}`, m, { class: 'm-scene' });
      const pad = h('div', { class: 'digits' });
      let counting = false;
      for (let d = 1; d <= max; d++) {
        const btn = h('button', { class: 'digit', 'aria-label': String(d) });
        btn.appendChild(h('span', { class: 'dg' }, String(d)));
        const dots = (DICE[d] || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#DB2777"/>`).join('');
        btn.appendChild(OT.svg('0 0 100 100', dots, { class: 'dice' }));
        btn.addEventListener('click', () => {
          if (counting) return;
          OT.sfx('tap');
          if (d === n) {
            btn.classList.add('right');
            api.win(def.answer || '');
          } else {
            btn.classList.add('nope');
            setTimeout(() => btn.classList.remove('nope'), 600);
            api.tryAgain('Hai să numărăm împreună.');
            countTogether();
          }
        });
        pad.appendChild(btn);
      }
      // numărăm împreună: fiecare lucru se aprinde și primește un număr
      async function countTogether() {
        counting = true;
        const items = Array.from(svg.querySelectorAll('.c-item'));
        await api.scope.wait(1600);
        for (let i = 0; i < items.length; i++) {
          if (!api.scope.alive) return;
          const it = items[i];
          it.querySelector('.c-num').setAttribute('opacity', '1');
          it.classList.add('lit');
          OT.sfx('bubble');
          OT.speak(OT.numberWords[i + 1]);
          await api.scope.wait(950);
        }
        counting = false;
      }
      // atingerea unui lucru îl face să sară (fără „greșeli”)
      svg.querySelectorAll('.c-item').forEach((g) =>
        g.addEventListener('click', () => {
          OT.sfx('pop');
          g.classList.remove('hop');
          void g.getBoundingClientRect();
          g.classList.add('hop');
        })
      );
      body.append(svg, pad);
    },

    /* POTRIVEȘTE CULORILE (tragi sau atingi) */
    match(def, body, api) {
      const colors = def.colors;
      const items = h('div', { class: 'mt-row mt-items' });
      const targets = h('div', { class: 'mt-row mt-targets' });
      const itemArt = def.item || ((c) => `<rect x="14" y="14" width="72" height="72" rx="14" fill="${c}" stroke="#fff" stroke-width="6"/>`);
      const targetArt =
        def.target ||
        ((c) => `<path d="M10 40 h80 v50 h-80z" fill="${c}" opacity=".25"/><path d="M10 40 h80 v50 h-80z M10 40 l14 -16 h80 l-14 16" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>`);
      let placed = 0;
      let selected = null;
      const tEls = OT.shuffle(colors).map((c) => {
        const t = h('div', { class: 'mt-target', 'data-c': c });
        t.appendChild(OT.svg('0 0 100 100', targetArt(c)));
        t.addEventListener('click', () => {
          if (selected) tryDrop(selected, t);
        });
        targets.appendChild(t);
        return t;
      });
      OT.shuffle(colors).forEach((c) => {
        const it = h('div', { class: 'mt-item', 'data-c': c });
        it.appendChild(OT.svg('0 0 100 100', itemArt(c)));
        items.appendChild(it);
        dragify(it);
      });
      body.append(items, h('div', { class: 'mt-arrow' }, '⬇'), targets);

      function wiggleTarget(c) {
        const t = tEls.find((x) => x.dataset.c === c && !x.classList.contains('full'));
        if (t) {
          t.classList.remove('wiggle');
          void t.offsetWidth;
          t.classList.add('wiggle');
        }
      }
      function tryDrop(it, t) {
        it.classList.remove('sel');
        selected = null;
        if (t.dataset.c === it.dataset.c && !t.classList.contains('full')) {
          OT.sfx('pop');
          t.classList.add('full');
          it.classList.add('placed');
          it.style.transform = '';
          t.appendChild(it);
          const c = OT.center(t);
          OT.fx.burst('sparkles', c.x, c.y, 8);
          placed++;
          if (placed === colors.length) api.win(def.answer || 'Toate culorile sunt la locul lor!');
          else OT.speak(OT.pick(['Da!', 'Super!', 'Bravo!']));
        } else {
          it.style.transition = 'transform .5s';
          it.style.transform = '';
          setTimeout(() => (it.style.transition = ''), 520);
          const name = COLOR_NAMES[it.dataset.c];
          api.tryAgain(def.hint || (name ? 'Caută căsuța ' + name + '.' : 'Caută căsuța de aceeași culoare.'));
          wiggleTarget(it.dataset.c);
        }
      }
      function dragify(it) {
        let sx = 0;
        let sy = 0;
        let moved = false;
        let dragging = false;
        it.addEventListener('pointerdown', (e) => {
          if (it.classList.contains('placed')) return;
          dragging = true;
          moved = false;
          sx = e.clientX;
          sy = e.clientY;
          it.setPointerCapture && it.setPointerCapture(e.pointerId);
          it.classList.add('drag');
          OT.sfx('tap');
        });
        it.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          const dx = e.clientX - sx;
          const dy = e.clientY - sy;
          if (Math.abs(dx) + Math.abs(dy) > 8) moved = true;
          it.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;
        });
        const end = (e) => {
          if (!dragging) return;
          dragging = false;
          it.classList.remove('drag');
          if (!moved) {
            // atingere simplă: selectează, apoi atinge căsuța
            it.style.transform = '';
            if (selected && selected !== it) selected.classList.remove('sel');
            selected = it;
            it.classList.add('sel');
            OT.speak('Acum atinge căsuța de aceeași culoare!');
            return;
          }
          const t = tEls.find((t) => {
            const r = t.getBoundingClientRect();
            return e.clientX >= r.left - 20 && e.clientX <= r.right + 20 && e.clientY >= r.top - 20 && e.clientY <= r.bottom + 20;
          });
          if (t) tryDrop(it, t);
          else {
            it.style.transition = 'transform .4s';
            it.style.transform = '';
            setTimeout(() => (it.style.transition = ''), 420);
          }
        };
        it.addEventListener('pointerup', end);
        it.addEventListener('pointercancel', end);
      }
    },

    /* GĂSEȘTE STELUȚELE */
    stars(def, body, api) {
      const total = def.stars.length;
      let found = 0;
      const counter = h('div', { class: 'st-counter' });
      const slots = [];
      for (let i = 0; i < total; i++) {
        const s = OT.svg('0 0 100 100', `<path d="${OT.art.starPath(50, 52, 44, 20)}" fill="#fff" stroke="#F59E0B" stroke-width="6" stroke-dasharray="10 7" stroke-linejoin="round"/>`);
        slots.push(s);
        counter.appendChild(s);
      }
      let m = def.scene || '';
      def.stars.forEach(([x, y, r], i) => {
        m += `<g class="hid-star" data-i="${i}" transform="translate(${x} ${y})"><circle r="${r * 1.9}" fill="#fff" opacity="0"/>` +
          `<path d="${OT.art.starPath(0, 0, r, r * 0.45)}" fill="#FDE047" stroke="#EAB308" stroke-width="3" stroke-linejoin="round"/></g>`;
      });
      const svg = OT.svg('0 0 800 450', m, { class: 'm-scene' });
      let last = Date.now();
      svg.querySelectorAll('.hid-star').forEach((g) =>
        g.addEventListener('click', (e) => {
          e.stopPropagation();
          if (g.classList.contains('got')) return;
          g.classList.add('got');
          last = Date.now();
          OT.sfx('star');
          const c = OT.center(g);
          OT.fx.burst('sparkles', c.x, c.y, 10);
          const sl = slots[found];
          sl.innerHTML = OT.art.star();
          sl.classList.add('filled');
          found++;
          if (found === total) api.win(def.answer || 'Ai găsit toate steluțele!');
          else OT.speak(found === 1 ? 'Una! Mai caută!' : found === 2 ? 'Două! Încă una!' : String(found));
        })
      );
      svg.addEventListener('click', () => {
        if (found < total) OT.sfx('bubble');
      });
      // indiciu blând dacă nu găsește
      api.scope.interval(() => {
        if (found >= total) return;
        if (Date.now() - last > 9000) {
          last = Date.now();
          const rest = Array.from(svg.querySelectorAll('.hid-star:not(.got)'));
          const g = rest[0];
          if (g) {
            g.classList.remove('hint');
            void g.getBoundingClientRect();
            g.classList.add('hint');
            OT.speak('Uite! Ceva strălucește!');
          }
        }
      }, 1000);
      const scroller = h('div', { class: 'm-scroll' }, svg);
      body.append(counter, scroller);
    },

    custom(def, body, api) {
      def.render(body, api);
    },
  };
})();
