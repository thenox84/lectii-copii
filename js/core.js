/* Orașul din Telefon — nucleul jocului
   Spațiu de nume global: OT
   - OT.h / OT.s / OT.svg   : creare elemente HTML / SVG
   - OT.state / OT.save     : progresul salvat în localStorage
   - OT.scope()             : temporizatoare și evenimente curățate automat
   - OT.go(ecran, parametri): navigare între ecrane
*/
(function () {
  'use strict';
  const OT = (window.OT = window.OT || {});
  // configurare (o altă ediție a jocului poate seta window.OT_CONFIG înainte de acest fișier)
  OT.cfg = Object.assign({ hero: 'Andrei', guide: 'andrei', jar: true, storageKey: 'orasul-din-telefon-v1', dbName: 'orasul-din-telefon' }, window.OT_CONFIG || {});
  const SVGNS = 'http://www.w3.org/2000/svg';
  OT.SVGNS = SVGNS;

  /* ---------- creare elemente ---------- */
  function applyAttrs(el, attrs) {
    if (!attrs) return;
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.setAttribute('class', v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  function appendKids(el, kids) {
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
  }
  /** Element HTML: OT.h('div', {class:'x', onclick: fn}, copii...) */
  OT.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    applyAttrs(el, attrs);
    appendKids(el, kids);
    return el;
  };
  /** Element SVG: OT.s('circle', {cx:10, cy:10, r:5}) */
  OT.s = function (tag, attrs, ...kids) {
    const el = document.createElementNS(SVGNS, tag);
    applyAttrs(el, attrs);
    appendKids(el, kids);
    return el;
  };
  /** <svg> cu viewBox și conținut din text: OT.svg('0 0 800 500', '<circle .../>', {class:'scene'}) */
  OT.svg = function (viewBox, markup, attrs) {
    const el = document.createElementNS(SVGNS, 'svg');
    el.setAttribute('viewBox', viewBox);
    el.setAttribute('xmlns', SVGNS);
    applyAttrs(el, attrs);
    if (markup) el.innerHTML = markup;
    return el;
  };
  /** Coordonatele unui eveniment în sistemul viewBox al unui <svg> */
  OT.svgPoint = function (svg, evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const m = svg.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 };
  };
  OT.$ = (sel, root) => (root || document).querySelector(sel);
  OT.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ---------- mici utilitare ---------- */
  OT.rand = (a, b) => a + Math.random() * (b - a);
  OT.randInt = (a, b) => Math.floor(OT.rand(a, b + 1));
  OT.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  OT.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  OT.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  OT.lerp = (a, b, t) => a + (b - a) * t;
  OT.ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  OT.center = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  OT.reducedMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  OT.numberWords = ['zero', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă', 'zece'];

  /** Animație Web Animations; întoarce o promisiune care se rezolvă la final */
  OT.anim = function (el, keyframes, opts) {
    if (!el || !el.animate) return Promise.resolve();
    try {
      const a = el.animate(keyframes, opts);
      return a.finished.catch(() => {});
    } catch (e) {
      return Promise.resolve();
    }
  };

  /* ---------- scope: temporizatoare/evenimente curățate automat ---------- */
  OT.scope = function () {
    const ac = new AbortController();
    const timers = new Set();
    const intervals = new Set();
    const loops = new Set();
    const disposers = [];
    const sc = {
      signal: ac.signal,
      get alive() {
        return !ac.signal.aborted;
      },
      timeout(fn, ms) {
        if (ac.signal.aborted) return 0;
        const id = setTimeout(() => {
          timers.delete(id);
          if (!ac.signal.aborted) fn();
        }, ms);
        timers.add(id);
        return id;
      },
      clearTimeout(id) {
        clearTimeout(id);
        timers.delete(id);
      },
      interval(fn, ms) {
        if (ac.signal.aborted) return 0;
        const id = setInterval(() => {
          if (!ac.signal.aborted) fn();
        }, ms);
        intervals.add(id);
        return id;
      },
      clearInterval(id) {
        clearInterval(id);
        intervals.delete(id);
      },
      /** buclă pe cadre: fn(t) e apelată la fiecare cadru până întoarce false */
      raf(fn) {
        const loop = { id: 0, stop: () => { cancelAnimationFrame(loop.id); loops.delete(loop); } };
        const tick = (t) => {
          if (ac.signal.aborted) return;
          if (fn(t) === false) {
            loops.delete(loop);
            return;
          }
          loop.id = requestAnimationFrame(tick);
        };
        loop.id = requestAnimationFrame(tick);
        loops.add(loop);
        return loop;
      },
      /** animație pe durată: fn(p) cu p de la 0 la 1; întoarce promisiune */
      tween(ms, fn, ease) {
        const e = ease || OT.ease;
        return new Promise((res) => {
          const t0 = performance.now();
          sc.raf((t) => {
            const p = Math.min(1, (t - t0) / ms);
            fn(e(p), p);
            if (p >= 1) {
              res();
              return false;
            }
          });
        });
      },
      on(el, type, fn, opts) {
        if (!el) return;
        el.addEventListener(type, fn, Object.assign({ signal: ac.signal }, opts || {}));
      },
      /** promisiune care se rezolvă după ms (nu se mai rezolvă dacă ecranul s-a închis) */
      wait(ms) {
        return new Promise((res) => sc.timeout(res, ms));
      },
      add(fn) {
        disposers.push(fn);
      },
      dispose() {
        if (ac.signal.aborted) return;
        ac.abort();
        timers.forEach(clearTimeout);
        intervals.forEach(clearInterval);
        loops.forEach((l) => cancelAnimationFrame(l.id));
        timers.clear();
        intervals.clear();
        loops.clear();
        while (disposers.length) {
          try {
            disposers.pop()();
          } catch (e) {
            console.warn(e);
          }
        }
      },
    };
    return sc;
  };

  /* ---------- progres salvat ---------- */
  const KEY = OT.cfg.storageKey;
  const DEFAULTS = {
    v: 1,
    introSeen: false,
    done: {}, // insigne Andrei: {1:true,...}
    stars: {}, // steluțele Mariei: {1:true,...}
    bunny: {}, // iepurașul Elenei găsit: {1:true,...}
    eggs: {}, // easter egg-uri: {mozart:true, bach:true}
    photoSent: false,
    songSent: false,
    finalSeen: false,
    unlockAll: false,
    settings: { sound: true, voice: true },
  };
  function load() {
    let s = null;
    try {
      s = JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch (e) {
      s = null;
    }
    const st = JSON.parse(JSON.stringify(DEFAULTS));
    if (s && typeof s === 'object') {
      Object.assign(st, s);
      st.settings = Object.assign({}, DEFAULTS.settings, s.settings || {});
    }
    return st;
  }
  OT.state = load();
  OT.save = function () {
    try {
      localStorage.setItem(KEY, JSON.stringify(OT.state));
    } catch (e) {
      /* fără localStorage: jocul merge, doar nu se salvează */
    }
  };
  OT.resetProgress = function () {
    const settings = OT.state.settings;
    OT.state = JSON.parse(JSON.stringify(DEFAULTS));
    OT.state.settings = settings;
    OT.save();
    if (OT.dulap) OT.dulap.remove();
  };
  OT.TOTAL = 8;
  OT.isDone = (id) => !!OT.state.done[id];
  OT.isUnlocked = (id) => id <= 1 || OT.state.unlockAll || !!OT.state.done[id - 1];
  OT.doneCount = () => Object.keys(OT.state.done).filter((k) => OT.state.done[k]).length;
  OT.starCount = () => Object.keys(OT.state.stars).filter((k) => OT.state.stars[k]).length;
  OT.bunnyCount = () => Object.keys(OT.state.bunny).filter((k) => OT.state.bunny[k]).length;
  OT.allDone = () => {
    for (let i = 1; i <= OT.TOTAL; i++) if (!OT.state.done[i]) return false;
    return true;
  };

  /* ---------- clădiri ---------- */
  OT.buildings = {};
  /** Înregistrează o clădire (lecție). Vezi js/lesson.js pentru formatul complet. */
  OT.registerBuilding = function (def) {
    OT.buildings[def.id] = def;
  };

  /* ---------- notificare scurtă ---------- */
  let toastTimer = 0;
  OT.toast = function (html, opts) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), (opts && opts.ms) || 3200);
    if (opts && opts.speak && OT.speak) OT.speak(opts.speak === true ? html : opts.speak);
  };

  /* ---------- navigare ---------- */
  OT.screens = {};
  let current = null;
  OT.current = () => current;
  OT.go = function (name, params, opts) {
    params = params || {};
    opts = opts || {};
    const app = document.getElementById('app');
    if (current && current.scope) current.scope.dispose();
    if (OT.speakStop) OT.speakStop();
    if (OT.fx && OT.fx.clear) OT.fx.clear();
    app.innerHTML = '';
    app.className = 'screen screen-' + name;
    const scope = OT.scope();
    current = { name, params, scope };
    window.scrollTo(0, 0);
    try {
      OT.screens[name](app, params, scope);
    } catch (e) {
      console.error(e);
      if (name !== 'map') OT.go('map');
      return;
    }
    // butonul „înapoi” al telefonului/browserului duce la hartă, nu iese din joc
    try {
      if (name === 'map') history.replaceState({ ot: 'map' }, '');
      else if (!opts.fromPop) history.pushState({ ot: name }, '');
    } catch (e) {}
  };
  window.addEventListener('popstate', () => {
    if (!current) return;
    if (current.name === 'elena') {
      // Joaca Elenei nu se închide din greșeală
      try {
        history.pushState({ ot: 'elena' }, '');
      } catch (e) {}
      return;
    }
    if (current.name !== 'map') OT.go('map', {}, { fromPop: true });
  });

  /* ---------- ecran complet (pentru Joaca Elenei) ---------- */
  OT.fullscreen = {
    enter() {
      const d = document.documentElement;
      const f = d.requestFullscreen || d.webkitRequestFullscreen;
      if (f && !document.fullscreenElement) {
        try {
          const p = f.call(d);
          if (p && p.catch) p.catch(() => {});
        } catch (e) {}
      }
    },
    exit() {
      const f = document.exitFullscreen || document.webkitExitFullscreen;
      if (f && (document.fullscreenElement || document.webkitFullscreenElement)) {
        try {
          const p = f.call(document);
          if (p && p.catch) p.catch(() => {});
        } catch (e) {}
      }
    },
  };

  /* ---------- „Dulapul”: înregistrarea lui Andrei, păstrată în browser (IndexedDB) ---------- */
  OT.dulap = (function () {
    let mem = null; // copie în memorie (dacă IndexedDB nu merge)
    function db() {
      return new Promise((res, rej) => {
        if (!window.indexedDB) return rej(new Error('fără IndexedDB'));
        const r = indexedDB.open(OT.cfg.dbName, 1);
        r.onupgradeneeded = () => r.result.createObjectStore('dulap');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    }
    return {
      async save(rec) {
        mem = rec;
        try {
          const d = await db();
          await new Promise((res, rej) => {
            const tx = d.transaction('dulap', 'readwrite');
            tx.objectStore('dulap').put(rec, 'cantec');
            tx.oncomplete = res;
            tx.onerror = () => rej(tx.error);
          });
        } catch (e) {
          /* rămâne doar în memorie */
        }
      },
      async load() {
        if (mem) return mem;
        try {
          const d = await db();
          mem = await new Promise((res) => {
            const tx = d.transaction('dulap', 'readonly');
            const g = tx.objectStore('dulap').get('cantec');
            g.onsuccess = () => res(g.result || null);
            g.onerror = () => res(null);
          });
        } catch (e) {
          mem = null;
        }
        return mem;
      },
      async remove() {
        mem = null;
        try {
          const d = await db();
          const tx = d.transaction('dulap', 'readwrite');
          tx.objectStore('dulap').delete('cantec');
        } catch (e) {}
      },
    };
  })();
})();
