/* Orașul din Telefon — Joaca Elenei 🐰
   Ecran fără text și fără reguli: orice atingere aduce animăluțe, baloane și confetti.
   Ieșirea: butonul mic ✕ din colț, ținut apăsat ~1 secundă (pentru părinți). */
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;
  const KINDS = Object.keys(OT.art.animals);
  // note care sună bine împreună (pentatonică): oricum ar apăsa, sună frumos
  const NOTES = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84];

  OT.screens.elena = function (app, params, scope) {
    const root = h('div', { class: 'elena-play' });
    const bunny = OT.art.make('bunny', { class: 'e-bg-bunny' });
    const hand = h('div', { class: 'e-hint-hand', 'aria-hidden': 'true' }, '👆');
    const exit = h('button', { class: 'elena-exit', 'aria-label': 'Ieșire (pentru părinți: țineți apăsat)' }, '✕');
    const ring = OT.svg('0 0 46 46', '<circle cx="23" cy="23" r="20" fill="none" stroke="#F472B6" stroke-width="5" stroke-dasharray="125.7" stroke-dashoffset="125.7" stroke-linecap="round"/>');
    exit.appendChild(ring);
    const tip = h('div', { class: 'elena-exit-tip' }, 'Țineți apăsat ✕ ca să ieșiți');
    root.append(bunny, hand, exit, tip);
    app.appendChild(root);
    OT.fullscreen.enter();
    scope.add(() => OT.fullscreen.exit());

    let animals = [];
    let touched = false;
    let kindIdx = Math.floor(Math.random() * KINDS.length);

    function noteAt(x) {
      const i = OT.clamp(Math.floor((x / window.innerWidth) * NOTES.length), 0, NOTES.length - 1);
      OT.audio.piano(NOTES[i], { vel: 0.55 });
    }
    function spawn(x, y) {
      if (!touched) {
        touched = true;
        hand.style.opacity = '0';
      }
      const kind = KINDS[kindIdx++ % KINDS.length];
      const size = OT.rand(110, 170) * Math.min(1.2, Math.max(0.75, Math.min(window.innerWidth, window.innerHeight) / 700));
      const el = h('div', { class: 'e-animal' });
      el.appendChild(OT.art.animal(kind));
      el.style.width = el.style.height = size + 'px';
      el.style.left = x - size / 2 + 'px';
      el.style.top = y - size / 2 + 'px';
      root.appendChild(el);
      animals.push(el);
      if (animals.length > 22) {
        const old = animals.shift();
        old.remove();
      }
      const up = -OT.rand(120, 260);
      const side = OT.rand(-80, 80);
      OT.anim(
        el,
        [
          { transform: 'scale(0) rotate(-30deg)', opacity: 1 },
          { transform: 'scale(1.25) rotate(8deg)', opacity: 1, offset: 0.12 },
          { transform: 'scale(1) rotate(-8deg) translateY(-10px)', opacity: 1, offset: 0.24 },
          { transform: 'scale(1.05) rotate(10deg) translateY(0)', opacity: 1, offset: 0.38 },
          { transform: 'scale(1) rotate(-10deg) translateY(-14px)', opacity: 1, offset: 0.52 },
          { transform: `translate(${side * 0.5}px, ${up * 0.4}px) scale(1) rotate(6deg)`, opacity: 1, offset: 0.72 },
          { transform: `translate(${side}px, ${up}px) scale(.8) rotate(-4deg)`, opacity: 0 },
        ],
        { duration: 4200, easing: 'ease-in-out', fill: 'forwards' }
      ).then(() => {
        el.remove();
        animals = animals.filter((a) => a !== el);
      });
      OT.fx.burst('confetti', x, y, 14, { spread: 170 });
      OT.fx.burst(OT.pick(['balloons', 'bubbles', 'hearts', 'stars']), x, y, 3);
      noteAt(x);
      if (Math.random() < 0.18) scope.timeout(() => OT.sfx(OT.pick(['giggle', 'boing', 'pop'])), 150);
      // iepurașul din mijloc se bucură și el
      const b = bunny.getBoundingClientRect();
      if (x > b.left && x < b.right && y > b.top && y < b.bottom) {
        OT.anim(bunny, [{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-50%,-75%) rotate(-6deg)' }, { transform: 'translate(-50%,-50%)' }], { duration: 700, easing: 'ease-out' });
        OT.sfx('boing');
      }
    }

    const last = {};
    scope.on(root, 'pointerdown', (e) => {
      if (e.target.closest('.elena-exit')) return;
      e.preventDefault();
      last[e.pointerId] = { t: Date.now(), x: e.clientX, y: e.clientY };
      spawn(e.clientX, e.clientY);
    });
    scope.on(root, 'pointermove', (e) => {
      const l = last[e.pointerId];
      if (!l) return;
      const now = Date.now();
      if (now - l.t > 110 && Math.hypot(e.clientX - l.x, e.clientY - l.y) > 30) {
        last[e.pointerId] = { t: now, x: e.clientX, y: e.clientY };
        OT.fx.burst(OT.pick(['sparkles', 'bubbles', 'stars']), e.clientX, e.clientY, 2, { size: 30, spread: 60 });
        if (Math.random() < 0.35) noteAt(e.clientX);
      }
    });
    const up = (e) => {
      delete last[e.pointerId];
    };
    scope.on(root, 'pointerup', up);
    scope.on(root, 'pointercancel', up);
    let lastKey = 0;
    scope.on(document, 'keydown', (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastKey < 120) return;
      lastKey = now;
      spawn(OT.rand(80, window.innerWidth - 80), OT.rand(100, window.innerHeight - 100));
    });
    // bule care urcă singure, ca să fie mereu ceva de privit
    scope.interval(() => {
      OT.fx.burst('bubbles', OT.rand(40, window.innerWidth - 40), window.innerHeight + 30, 1, { size: OT.rand(40, 80) });
    }, 1400);

    /* ieșirea pentru părinți: ținut apăsat */
    const circle = ring.querySelector('circle');
    let holdStart = 0;
    let holdLoop = null;
    function cancelHold() {
      holdStart = 0;
      if (holdLoop) holdLoop.stop();
      holdLoop = null;
      circle.setAttribute('stroke-dashoffset', '125.7');
    }
    exit.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      exit.setPointerCapture && exit.setPointerCapture(e.pointerId);
      holdStart = performance.now();
      tip.classList.add('show');
      scope.timeout(() => tip.classList.remove('show'), 2500);
      holdLoop = scope.raf((t) => {
        if (!holdStart) return false;
        const p = Math.min(1, (t - holdStart) / 1100);
        circle.setAttribute('stroke-dashoffset', (125.7 * (1 - p)).toFixed(1));
        if (p >= 1) {
          OT.go('map');
          return false;
        }
      });
    });
    exit.addEventListener('pointerup', cancelHold);
    exit.addEventListener('pointercancel', cancelHold);
    exit.addEventListener('pointerleave', cancelHold);
    exit.addEventListener('click', (e) => e.preventDefault());
  };
})();
