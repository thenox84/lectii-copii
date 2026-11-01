/* Orașul din Telefon — Sala de concerte: pianul virtual, unda sunetului, înregistrarea la pianul adevărat
   - Pianul lui Andrei: 2 octave (Do4–Do6), se poate cânta și cu tastatura calculatorului
   - Pianul Mariei: clape colorate + „Steluța” (melodie populară franceză, liberă de drepturi)
   - Pianul Elenei: clape mari cu animăluțe; orice atingere = note colorate care zboară
   - Surprize: începutul din „Rondo alla Turca” (Mozart) → orașul dansează;
               începutul „Preludiului în Do major” (Bach) → cad steluțe liniștite.
     (Doar aceste două melodii vechi, libere de drepturi, sunt recunoscute.)
*/
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;
  const A = OT.art;

  const NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
  const BLACK = { 1: 1, 3: 1, 6: 1, 8: 1, 10: 1 };
  const isBlack = (m) => !!BLACK[m % 12];
  // tastatura calculatorului (poziția fizică a tastelor)
  const CODE2MIDI = {
    KeyZ: 60, KeyS: 61, KeyX: 62, KeyD: 63, KeyC: 64, KeyV: 65, KeyG: 66, KeyB: 67, KeyH: 68, KeyN: 69, KeyJ: 70, KeyM: 71,
    KeyQ: 72, Digit2: 73, KeyW: 74, Digit3: 75, KeyE: 76, KeyR: 77, Digit5: 78, KeyT: 79, Digit6: 80, KeyY: 81, Digit7: 82, KeyU: 83, KeyI: 84,
    Comma: 72, KeyL: 73, Period: 74, Semicolon: 75, Slash: 76,
  };
  const MIDI2LABEL = {};
  ['Z', 'S', 'X', 'D', 'C', 'V', 'G', 'B', 'H', 'N', 'J', 'M'].forEach((k, i) => (MIDI2LABEL[60 + i] = k));
  ['Q', '2', 'W', '3', 'E', 'R', '5', 'T', '6', 'Y', '7', 'U', 'I'].forEach((k, i) => (MIDI2LABEL[72 + i] = k));
  const RAINBOW = { 60: '#EF4444', 62: '#F97316', 64: '#EAB308', 65: '#22C55E', 67: '#06B6D4', 69: '#3B82F6', 71: '#8B5CF6', 72: '#EC4899' };
  const NOTE_COLORS = ['#F87171', '#FB923C', '#FACC15', '#4ADE80', '#38BDF8', '#818CF8', '#F472B6', '#A78BFA'];

  // „Steluța” (Ah! vous dirai-je, maman — melodie populară franceză, sec. XVIII, liberă de drepturi)
  const STELUTA = [60, 60, 67, 67, 69, 69, 67, 65, 65, 64, 64, 62, 62, 60, 67, 67, 65, 65, 64, 64, 62, 67, 67, 65, 65, 64, 64, 62, 60, 60, 67, 67, 69, 69, 67, 65, 65, 64, 64, 62, 62, 60];
  const STELUTA_PART = 14;
  // surprizele (intervale față de prima notă — merg în orice octavă)
  const EGGS = [
    { id: 'mozart', rel: [0, -2, -3, -2, 1, 3, 1, 0, 1] }, // Si La Sol# La Do | Re Do Si Do
    { id: 'bach', rel: [0, 4, 7, 12, 16, 7, 12, 16] }, // Do Mi Sol Do Mi Sol Do Mi
  ];

  /* ---------- clapele ---------- */
  OT.piano = {};
  OT.piano.keyboard = function (o) {
    const scope = o.scope;
    const el = h('div', { class: 'keyboard ' + (o.mode || '') });
    const inner = h('div', { class: 'kb-inner', style: { position: 'relative', display: 'flex', width: '100%', height: '100%', gap: o.mode === 'elena' ? '6px' : '0' } });
    el.appendChild(inner);
    const keys = {};
    const midis = [];
    for (let m = o.low; m <= o.high; m++) if (!(o.whitesOnly && isBlack(m))) midis.push(m);
    const whites = midis.filter((m) => !isBlack(m));
    const nW = whites.length;
    midis.forEach((m) => {
      const black = isBlack(m);
      const k = h('div', { class: 'key ' + (black ? 'black' : 'white'), 'data-m': m });
      if (black) {
        const wi = whites.indexOf(m - 1);
        k.style.left = `calc(${((wi + 1) / nW) * 100}% - ${(0.62 / nW) * 50}%)`;
        k.style.width = (0.62 / nW) * 100 + '%';
      }
      if (o.mode === 'maria') {
        k.style.background = `linear-gradient(${RAINBOW[m]}, ${RAINBOW[m]}dd)`;
        k.appendChild(h('span', { class: 'nm' }, NAMES[m % 12]));
      } else if (o.mode === 'elena') {
        const kinds = ['bunny', 'frog', 'cat', 'pig', 'chick', 'bear', 'panda', 'lion'];
        k.style.background = NOTE_COLORS[whites.indexOf(m) % NOTE_COLORS.length];
        k.style.justifyContent = 'center';
        k.appendChild(OT.art.animal(kinds[whites.indexOf(m) % kinds.length]));
      } else if (o.labels !== false) {
        if (!black) k.appendChild(h('span', { class: 'nm' }, NAMES[m % 12] + (m === 60 ? '' : '')));
        if (MIDI2LABEL[m]) k.appendChild(h('span', { class: 'kb' }, MIDI2LABEL[m]));
      }
      keys[m] = k;
      inner.appendChild(k);
    });
    if (o.mode === 'elena') inner.querySelectorAll('.key.white').forEach((k) => (k.style.flex = '1'));

    const voices = {};
    function down(m, src) {
      if (!keys[m]) return;
      if (voices[m]) voices[m].stop(true);
      voices[m] = OT.audio.piano(m, { vel: o.vel || 0.85 });
      keys[m].classList.add('down');
      if (o.onDown) o.onDown(m, keys[m], src);
    }
    function up(m) {
      if (!keys[m]) return;
      keys[m].classList.remove('down');
      if (voices[m]) {
        voices[m].stop();
        if (!OT.audio.pedal) delete voices[m];
      }
    }
    // atingere/mouse: mai multe degete, alunecare peste clape
    const ptr = {};
    const keyAt = (x, y) => {
      const t = document.elementFromPoint(x, y);
      const k = t && t.closest && t.closest('.key');
      return k && inner.contains(k) ? +k.dataset.m : null;
    };
    scope.on(inner, 'pointerdown', (e) => {
      e.preventDefault();
      const m = keyAt(e.clientX, e.clientY);
      if (m == null) return;
      try {
        inner.setPointerCapture(e.pointerId);
      } catch (err) {}
      ptr[e.pointerId] = m;
      down(m, 'touch');
    });
    scope.on(inner, 'pointermove', (e) => {
      if (!(e.pointerId in ptr)) return;
      const m = keyAt(e.clientX, e.clientY);
      if (m != null && m !== ptr[e.pointerId]) {
        up(ptr[e.pointerId]);
        ptr[e.pointerId] = m;
        down(m, 'touch');
      }
    });
    const end = (e) => {
      if (!(e.pointerId in ptr)) return;
      up(ptr[e.pointerId]);
      delete ptr[e.pointerId];
    };
    scope.on(inner, 'pointerup', end);
    scope.on(inner, 'pointercancel', end);
    // tastatura calculatorului
    if (o.computerKeys) {
      const held = {};
      scope.on(document, 'keydown', (e) => {
        const blocker = document.querySelector('.mission, .dialog-back, .send-overlay');
        if (blocker && !blocker.contains(el)) return;
        if (!el.isConnected) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.code === 'Space') {
          e.preventDefault();
          if (o.onPedal && !e.repeat) o.onPedal(true);
          return;
        }
        let m = CODE2MIDI[e.code];
        if (m == null || e.repeat) return;
        if (o.whitesOnly && isBlack(m)) return;
        if (m < o.low || m > o.high) {
          // tastatura mică (Maria/Elena): aducem nota în intervalul clapelor
          while (m > o.high) m -= 12;
          while (m < o.low) m += 12;
          if (!keys[m]) return;
        }
        e.preventDefault();
        held[e.code] = m;
        down(m, 'key');
      });
      scope.on(document, 'keyup', (e) => {
        if (e.code === 'Space') {
          if (o.onPedal) o.onPedal(false);
          return;
        }
        if (held[e.code] != null) {
          up(held[e.code]);
          delete held[e.code];
        }
      });
    }
    scope.add(() => Object.values(voices).forEach((v) => v.stop(true)));
    return {
      el,
      keys,
      down,
      up,
      releaseAll() {
        Object.keys(voices).forEach((m) => {
          voices[m].stop(true);
          delete voices[m];
        });
      },
      hint(m) {
        Object.values(keys).forEach((k) => k.classList.remove('next-hint'));
        if (m != null && keys[m]) keys[m].classList.add('next-hint');
      },
      dimOthers(m) {
        Object.entries(keys).forEach(([mm, k]) => k.classList.toggle('dim', m != null && +mm !== m));
      },
    };
  };

  /* ---------- unda sunetului + numerele care curg ---------- */
  OT.piano.viz = function (scope, label) {
    const wrap = h('div', { class: 'pr-viz' });
    const cv = h('canvas');
    const nums = h('div', { class: 'pr-numbers' });
    const lab = h('div', { class: 'pr-viz-label' }, label || '〰️ Unda sunetului');
    wrap.append(cv, nums, lab);
    let source = null;
    let buf = null;
    const g = cv.getContext('2d');
    let lastNum = 0;
    const list = [];
    function size() {
      const r = cv.getBoundingClientRect();
      const d = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(10, Math.round(r.width * d));
      cv.height = Math.max(10, Math.round(r.height * d));
    }
    scope.on(window, 'resize', size);
    scope.timeout(size, 30);
    scope.raf((t) => {
      const an = source || OT.audio.analyser;
      const W = cv.width;
      const H = cv.height;
      g.clearRect(0, 0, W, H);
      g.strokeStyle = 'rgba(255,255,255,.15)';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(0, H / 2);
      g.lineTo(W, H / 2);
      g.stroke();
      if (!an) return;
      if (!buf || buf.length !== an.fftSize) buf = new Float32Array(an.fftSize);
      if (an.getFloatTimeDomainData) an.getFloatTimeDomainData(buf);
      else {
        const b = new Uint8Array(an.fftSize);
        an.getByteTimeDomainData(b);
        for (let i = 0; i < b.length; i++) buf[i] = (b[i] - 128) / 128;
      }
      // pornim de la o trecere prin zero, ca unda să stea pe loc
      let start = 0;
      for (let i = 1; i < buf.length / 2; i++) {
        if (buf[i - 1] < 0 && buf[i] >= 0) {
          start = i;
          break;
        }
      }
      const n = Math.min(900, buf.length - start);
      const numW = nums.getBoundingClientRect().width * (cv.width / Math.max(1, cv.getBoundingClientRect().width));
      const drawW = W - numW - 10;
      let peak = 0;
      for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(buf[start + i]));
      const gain = peak > 0.001 ? Math.min(6, 0.42 / peak) : 1;
      const grad = g.createLinearGradient(0, 0, drawW, 0);
      grad.addColorStop(0, '#A78BFA');
      grad.addColorStop(0.5, '#F472B6');
      grad.addColorStop(1, '#FDE047');
      g.strokeStyle = grad;
      g.lineWidth = Math.max(3, H / 60);
      g.lineJoin = 'round';
      g.beginPath();
      for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * drawW;
        const y = H / 2 - buf[start + i] * gain * H;
        if (i) g.lineTo(x, y);
        else g.moveTo(x, y);
      }
      g.stroke();
      // punctele = „pozele” făcute sunetului
      g.fillStyle = '#fff';
      const step = Math.max(12, Math.floor(n / 40));
      for (let i = 0; i < n; i += step) {
        const x = (i / (n - 1)) * drawW;
        const y = H / 2 - buf[start + i] * gain * H;
        g.beginPath();
        g.arc(x, y, Math.max(2.5, H / 90), 0, Math.PI * 2);
        g.fill();
      }
      if (t - lastNum > 130) {
        lastNum = t;
        const v = buf[start + Math.floor(n / 3)] || 0;
        const val = peak < 0.003 ? 0 : Math.round(v * 1000);
        list.push(val);
        if (list.length > 14) list.shift();
        nums.innerHTML = list.map((x) => `<div>${x > 0 ? '+' : ''}${x}</div>`).join('');
      }
    });
    return {
      el: wrap,
      setSource(an) {
        source = an;
      },
      resize: size,
    };
  };

  /* ---------- orașul mic de deasupra pianului ---------- */
  function miniCity() {
    const keys = ['studio', 'fabrica', 'dulap', 'centrala', 'posta', 'aeroport', 'primaria', 'concert'];
    let m = '<rect x="-400" y="232" width="2400" height="60" fill="#4C1D95"/>';
    keys.forEach((k, i) => {
      m += `<g transform="translate(${i * 200 + 10} 20) scale(.82)"><g class="mini-b bld lit">${A.buildings[k]()}</g></g>`;
    });
    m += `<g class="pr-bunny" transform="translate(1560 150)"><g class="pb-in"><g transform="scale(.42)">${A.bunny()}</g></g></g>`;
    const svg = OT.svg('0 -10 1640 270', m, { preserveAspectRatio: 'xMidYMax meet' });
    return h('div', { class: 'pr-city' }, svg);
  }

  /* ---------- jocul Mariei (folosit și ca misiune cu fundița) ---------- */
  OT.piano.mariaGame = function (container, scope, onWin) {
    const panel = h('div', { class: 'maria-song' });
    const title = h('div', { class: 'ms-title' }, '⭐ Steluța');
    const dots = h('div', { class: 'song-dots' });
    const listen = h('button', { class: 'big-btn pink ms-btn' }, '▶️ Ascult-o');
    const again = h('button', { class: 'big-btn ms-btn' }, '🔁 De la capăt');
    panel.append(title, listen, again);
    const kb = OT.piano.keyboard({ scope, low: 60, high: 72, whitesOnly: true, mode: 'maria', computerKeys: true, vel: 0.8, onDown: (m, k) => played(m, k) });
    container.append(panel, dots, kb.el);
    let target = STELUTA_PART;
    let pos = 0;
    let wrongs = 0;
    let demo = false;
    let won = false;
    function drawDots() {
      dots.innerHTML = '';
      for (let i = 0; i < target; i++) {
        const d = h('i', { class: i < pos ? 'done' : i === pos ? 'now' : '' });
        d.style.setProperty('--c', RAINBOW[STELUTA[i]]);
        dots.appendChild(d);
      }
    }
    function update() {
      drawDots();
      kb.hint(pos < target ? STELUTA[pos] : null);
    }
    function played(m, k) {
      flyNote(k, 2);
      if (demo || pos >= target) return;
      if (m === STELUTA[pos]) {
        pos++;
        wrongs = 0;
        if (pos >= target) {
          kb.hint(null);
          drawDots();
          scope.timeout(finish, 500);
        } else update();
      } else {
        wrongs++;
        const right = kb.keys[STELUTA[pos]];
        right.classList.remove('next-hint');
        void right.offsetWidth;
        right.classList.add('next-hint');
        if (wrongs === 2) OT.speak('Mai încearcă! Apasă pe clapa care sare și strălucește.');
      }
    }
    function finish() {
      OT.fx.confetti(70);
      if (target === STELUTA_PART) {
        if (!won) {
          won = true;
          if (onWin) onWin('Ai cântat «Steluța»!');
        } else OT.speak('Bravo, Maria! Ai cântat «Steluța»!');
        const more = h('button', { class: 'big-btn primary ms-btn' }, '⭐ Tot cântecul');
        more.addEventListener('click', () => {
          more.remove();
          target = STELUTA.length;
          OT.speak('Hai să cântăm tot cântecul! Urmărește clapa care strălucește.');
          update();
        });
        panel.appendChild(more);
      } else {
        OT.sfx('fanfare');
        OT.speak('Bravo, Maria! Ai cântat tot cântecul! Ești o pianistă adevărată!');
      }
    }
    listen.addEventListener('click', async () => {
      if (demo) return;
      demo = true;
      kb.hint(null);
      for (let i = 0; i < STELUTA_PART; i++) {
        if (!scope.alive) return;
        const m = STELUTA[i];
        kb.down(m, 'demo');
        await scope.wait(i === 6 || i === 13 ? 700 : 380);
        kb.up(m);
        await scope.wait(90);
      }
      demo = false;
      update();
    });
    again.addEventListener('click', () => {
      OT.sfx('tap');
      pos = 0;
      target = STELUTA_PART;
      panel.querySelectorAll('.ms-btn.primary').forEach((b) => b.remove());
      update();
    });
    update();
    return kb;
  };

  function flyNote(keyEl, n) {
    const r = keyEl.getBoundingClientRect();
    OT.fx.burst('notes', r.left + r.width / 2, r.top + 10, n || 1, { size: 34, spread: 90 });
  }

  /* ---------- ecranul Sălii de concerte ---------- */
  OT.screens.piano = function (app, params, scope) {
    let mode = params.mode || 'andrei';
    const root = h('div', { class: 'piano-room' });
    const mapBtn = h('button', { class: 'icon-btn', 'aria-label': 'Harta', title: 'Harta orașului' }, '🗺️');
    const lessonBtn = h('button', { class: 'icon-btn', 'aria-label': 'Lecția', title: 'Lecția despre sunet' }, '📖');
    const tabs = h('div', { class: 'pr-tabs' });
    const T = [
      ['andrei', '🎹 ', 'Pianul lui Andrei', 'Andrei'],
      ['maria', '🎀 ', 'Pianul Mariei', 'Maria'],
      ['elena', '🐰 ', 'Pianul Elenei', 'Elena'],
    ];
    const tabBtns = {};
    T.forEach(([k, ico, long, short]) => {
      const b = h('button', { class: 'pr-tab ' + k }, ico, h('span', { class: 't-long' }, long), h('span', { class: 't-short' }, short));
      b.addEventListener('click', () => {
        if (k === mode) return;
        OT.sfx('tap');
        setMode(k);
      });
      tabBtns[k] = b;
      tabs.appendChild(b);
    });
    const top = h('div', { class: 'pr-top' }, mapBtn, lessonBtn, tabs);
    const city = miniCity();
    const main = h('div', { class: 'pr-main' });
    root.append(top, main);
    app.appendChild(root);

    mapBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('map', { justDone: params.justEarned ? 8 : null });
    });
    lessonBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('lesson', { id: 8 });
    });
    // iepurașul Elenei, ascuns după clădiri
    const bun = city.querySelector('.pr-bunny');
    bun.style.cursor = 'pointer';
    bun.addEventListener('click', () => {
      OT.sfx('boing');
      OT.anim(bun.querySelector('.pb-in'), [{ transform: 'translateY(0)' }, { transform: 'translateY(-70px)' }, { transform: 'translateY(0)' }], { duration: 800, easing: 'ease-out' });
      OT.fx.at(bun, OT.pick(['hearts', 'balloons', 'bubbles']), 10);
      if (!OT.state.bunny[8]) {
        OT.state.bunny[8] = true;
        OT.save();
      }
    });

    let sub = null; // scope pentru modul curent
    let earned = OT.isDone(8);
    let notesPlayed = 0;
    const history = [];

    function checkEggs(m) {
      const now = Date.now();
      if (history.length && now - history[history.length - 1].t > 2500) history.length = 0;
      history.push({ m, t: now });
      if (history.length > 12) history.shift();
      for (const egg of EGGS) {
        const L = egg.rel.length;
        if (history.length < L) continue;
        const seq = history.slice(-L).map((x) => x.m);
        if (seq.every((x, i) => x - seq[0] === egg.rel[i])) {
          history.length = 0;
          fireEgg(egg.id);
          return;
        }
      }
    }
    function fireEgg(id) {
      OT.state.eggs[id] = true;
      OT.save();
      if (id === 'mozart') {
        OT.temp.danceUntil = Date.now() + 25000;
        city.classList.add('dancing');
        scope.timeout(() => city.classList.remove('dancing'), 25000);
        OT.fx.confetti(80);
        OT.fx.burst('notes', window.innerWidth / 2, window.innerHeight / 3, 16, { spread: 300 });
        OT.toast('🎉 Rondo alla Turca de Mozart! <b>Orașul dansează!</b>', { ms: 5000 });
      } else {
        OT.temp.starsUntil = Date.now() + 14000;
        OT.fx.rain('stars', 46, { ms: 10000, size: 28, fallMs: 7000 });
        OT.toast('✨ Preludiul în Do major de Bach! <b>Cad steluțe peste oraș…</b>', { ms: 6000 });
      }
    }

    function award() {
      if (earned) return;
      earned = true;
      OT.state.done[8] = true;
      OT.save();
      params.justEarned = true;
      const b = OT.buildings[8];
      // banner care NU oprește cântatul (dispare singur)
      const pop = h('div', { class: 'award-pop' });
      pop.appendChild(OT.art.badgeSVG('concert', b ? b.color : '#8B5CF6'));
      pop.appendChild(h('div', {}, h('b', {}, 'Bravo, Andrei! Ai câștigat insigna Sălii de concerte!'), h('div', { class: 'ap-sub' }, '💡 ' + (b ? b.learned : ''))));
      const x = h('button', { class: 'icon-btn', 'aria-label': 'Închide' }, '✕');
      x.addEventListener('click', () => pop.remove());
      pop.appendChild(x);
      root.appendChild(pop);
      scope.timeout(() => pop.remove(), 9000);
      OT.sfx('fanfare');
      OT.fx.confetti(80);
    }

    function setMode(k) {
      mode = k;
      if (sub) sub.dispose();
      sub = OT.scope();
      scope.add(() => sub && sub.dispose());
      main.innerHTML = '';
      Object.entries(tabBtns).forEach(([kk, b]) => b.classList.toggle('on', kk === k));
      OT.audio.pedal = false;
      if (k === 'andrei') andreiMode(sub);
      else if (k === 'maria') mariaMode(sub);
      else elenaMode(sub);
    }

    /* ----- Andrei ----- */
    function andreiMode(sc) {
      const viz = OT.piano.viz(sc, '〰️ Unda sunetului · ⚪ = „pozele” sunetului');
      const msg = h('div', { class: 'pr-msg' });
      const rec = h('button', { class: 'big-btn rec-btn' });
      const recIdle = () => rec.replaceChildren('🎙️ Înregistrează-te', h('span', { class: 't-long' }, ' la pianul adevărat'));
      recIdle();
      const listen = h('button', { class: 'big-btn blue', disabled: true });
      const listenIdle = () => listen.replaceChildren('▶️ Ascultă', h('span', { class: 't-long' }, ' din Dulap'));
      listenIdle();
      const send = h('button', { class: 'big-btn pink', disabled: true }, '✉️ Trimite', h('span', { class: 't-long' }, '-l bunicii'));
      const pedal = h('button', { class: 'big-btn pedal', title: 'Pedala (tasta Spațiu)' }, '🦶 Pedală');
      const meter = h('div', { class: 'mic-meter', style: { display: 'none' } }, h('i'));
      const controls = h('div', { class: 'pr-controls' }, rec, listen, send, pedal);
      const tip = h('div', { class: 'pr-tip' });
      main.append(city, viz.el, meter, controls, msg, tip);
      const setPedal = (on) => {
        OT.audio.pedal = on;
        pedal.classList.toggle('on', on);
        if (!on) kb.releaseAll();
      };
      pedal.addEventListener('click', () => setPedal(!OT.audio.pedal));
      const kb = OT.piano.keyboard({
        scope: sc,
        low: 60,
        high: 84,
        computerKeys: true,
        onPedal: setPedal,
        onDown: (m, k, src) => {
          flyNote(k, 1);
          if (src !== 'demo') {
            checkEggs(m);
            notesPlayed++;
            if (!earned) {
              tip.textContent = `🏅 Cântă ${12} note ca să câștigi insigna: ${Math.min(notesPlayed, 12)}/12`;
              if (notesPlayed >= 12) {
                award();
                showTip();
              }
            }
          }
        },
      });
      main.appendChild(kb.el);
      function showTip() {
        if (!earned) tip.textContent = `🏅 Cântă 12 note ca să câștigi insigna: ${Math.min(notesPlayed, 12)}/12`;
        else if (window.innerWidth < 600 && window.innerHeight > window.innerWidth) tip.textContent = '🔄 Întoarce telefonul pe orizontală ca să ai clape mai mari.';
        else tip.innerHTML = '🎁 Surpriză: cântă începutul din <b>Rondo alla Turca</b> (Mozart) sau din <b>Preludiul în Do major</b> (Bach) și privește orașul!';
      }
      showTip();
      msg.innerHTML = window.matchMedia('(hover: hover)').matches ? '⌨️ Poți cânta și cu tastatura: <b>Z S X D C V…</b> (jos) și <b>Q 2 W 3 E R…</b> (sus).' : '';

      // ---- înregistrarea ----
      let stream = null;
      let recorder = null;
      let chunks = [];
      let t0 = 0;
      let timer = 0;
      let micSrc = null;
      let micAn = null;
      let audioEl = null;
      let audioUrl = null;
      let meterLoop = null;
      async function refresh() {
        const r = await OT.dulap.load();
        if (!sc.alive) return;
        listen.disabled = !r;
        send.disabled = !r;
        if (r && !recorder) msg.innerHTML = `🗄️ În Dulap: înregistrarea ta (${fmt(r.duration || 0)}).` + (OT.state.songSent ? ' ✓✓ Bunica a primit-o.' : '');
      }
      refresh();
      const fmt = (ms) => {
        const s = Math.round(ms / 1000);
        return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      };
      function stopPlayback() {
        if (audioEl) {
          audioEl.pause();
          audioEl = null;
        }
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          audioUrl = null;
        }
        listenIdle();
      }
      sc.add(() => {
        stopPlayback();
        stopRecording(true);
      });
      function micOK() {
        return !!(window.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
      }
      async function startRecording() {
        stopPlayback();
        if (!micOK()) {
          msg.innerHTML = '🎙️ Microfonul nu poate fi folosit aici (merge doar pe pagina sigură <b>https</b>, într-un browser obișnuit). Nu-i nimic — poți cânta mai departe pe pianul de pe ecran!';
          OT.sfx('hmm');
          return;
        }
        msg.textContent = '🎙️ Telefonul îți cere voie să folosească microfonul. Apasă „Permite”.';
        try {
          if (navigator.audioSession) {
            try {
              navigator.audioSession.type = 'play-and-record';
            } catch (e) {}
          }
          OT.audio._recording = true;
          stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        } catch (e) {
          OT.audio._recording = false;
          stream = null;
          msg.innerHTML = '🙈 Microfonul nu a primit voie. Nu-i nimic — restul jocului merge la fel! (Părinții pot da voie din setările browserului.)';
          OT.sfx('hmm');
          return;
        }
        if (!sc.alive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const ctx = OT.audio.unlock();
        try {
          micSrc = ctx.createMediaStreamSource(stream);
          micAn = ctx.createAnalyser();
          micAn.fftSize = 2048;
          micSrc.connect(micAn);
          viz.setSource(micAn);
        } catch (e) {}
        const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg;codecs=opus'];
        const type = types.find((t) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
        try {
          recorder = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream);
        } catch (e) {
          recorder = new MediaRecorder(stream);
        }
        chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size) chunks.push(e.data);
        };
        recorder.onstop = async () => {
          const dur = Date.now() - t0;
          const blob = new Blob(chunks, { type: recorder.mimeType || type || 'audio/webm' });
          recorder = null;
          if (blob.size > 0) {
            await OT.dulap.save({ blob, type: blob.type, date: Date.now(), duration: dur });
            OT.state.songSent = false;
            OT.save();
            if (!sc.alive) return;
            OT.sfx('success');
            msg.innerHTML = '🗄️ Gata! Cântecul tău e acum în <b>Dulap</b> (memoria telefonului). Apasă „Ascultă”!';
            const c = OT.center(listen);
            OT.fx.burst('stars', c.x, c.y, 10);
            if (!earned) award();
          }
          refresh();
        };
        recorder.start(1000);
        t0 = Date.now();
        rec.textContent = '⏹️ Gata, oprește';
        rec.classList.add('on');
        meter.style.display = '';
        msg.textContent = '🔴 Înregistrez… Cântă la pianul tău adevărat! Uite unda ta, în timp real.';
        timer = sc.interval(() => {
          const d = Date.now() - t0;
          rec.textContent = '⏹️ Gata (' + fmt(d) + ')';
          if (d > 10 * 60 * 1000) stopRecording();
        }, 500);
        const mb = new Uint8Array(1024);
        meterLoop = sc.raf(() => {
          if (!micAn) return false;
          micAn.getByteTimeDomainData(mb);
          let s = 0;
          for (let i = 0; i < mb.length; i++) s += Math.abs(mb[i] - 128);
          meter.firstChild.style.width = Math.min(100, (s / mb.length) * 4) + '%';
        });
      }
      function stopRecording(silent) {
        if (timer) sc.clearInterval(timer);
        timer = 0;
        if (meterLoop) meterLoop.stop();
        if (recorder && recorder.state !== 'inactive') {
          try {
            recorder.stop();
          } catch (e) {}
        }
        if (stream) stream.getTracks().forEach((t) => t.stop());
        stream = null;
        try {
          if (micSrc) micSrc.disconnect();
        } catch (e) {}
        micSrc = null;
        micAn = null;
        viz.setSource(null);
        OT.audio._recording = false;
        if (navigator.audioSession) {
          try {
            navigator.audioSession.type = 'playback';
          } catch (e) {}
        }
        if (!silent) {
          recIdle();
          rec.classList.remove('on');
          meter.style.display = 'none';
        }
      }
      rec.addEventListener('click', () => {
        OT.audio.unlock();
        if (recorder) stopRecording();
        else startRecording();
      });
      listen.addEventListener('click', async () => {
        if (audioEl) {
          stopPlayback();
          return;
        }
        const r = await OT.dulap.load();
        if (!r || !sc.alive) return;
        audioUrl = URL.createObjectURL(r.blob);
        audioEl = new Audio(audioUrl);
        audioEl.playsInline = true;
        const ctx = OT.audio.unlock();
        try {
          const src = ctx.createMediaElementSource(audioEl);
          src.connect(OT.audio.master);
        } catch (e) {}
        audioEl.onended = () => {
          stopPlayback();
          msg.innerHTML = '🔊 Ai auzit? Difuzorul a citit numerele din Dulap și a făcut aerul să tremure din nou!';
        };
        try {
          await audioEl.play();
          listen.textContent = '⏸️ Oprește';
          msg.textContent = '🔊 Difuzorul transformă numerele înapoi în sunet…';
        } catch (e) {
          stopPlayback();
          msg.textContent = 'Nu am putut porni înregistrarea. Mai încearcă o dată!';
        }
      });
      send.addEventListener('click', async () => {
        const r = await OT.dulap.load();
        if (!r) return;
        stopPlayback();
        sendToGran(root, sc, () => {
          OT.state.songSent = true;
          OT.state.photoSent = true;
          OT.save();
          refresh();
        });
      });
    }

    /* ----- Maria ----- */
    function mariaMode(sc) {
      const head = h('div', { class: 'pr-maria-head' });
      const face = h('div', { class: 'm-maria' });
      face.appendChild(OT.art.head('maria'));
      const say = h('button', { class: 'm-say', 'aria-label': 'Ascultă' }, '🔊');
      const instr = 'Maria, apasă pe clapa care se aprinde și cântă «Steluța»!';
      say.addEventListener('click', () => OT.speak(instr));
      head.append(face, say, h('div', { class: 'pr-maria-txt' }, '👆 🎹 ✨'));
      main.append(head);
      OT.piano.mariaGame(main, sc, (txt) => {
        OT.sfx('star');
        if (!OT.state.stars[8]) {
          OT.state.stars[8] = true;
          OT.save();
          OT.speak('Bravo, Maria! ' + txt + ' Ai câștigat o steluță!');
          OT.fx.burst('stars', window.innerWidth / 2, window.innerHeight / 2, 16, { spread: 260 });
        } else OT.speak('Bravo, Maria! ' + txt);
      });
      sc.timeout(() => OT.speak(instr), 400);
    }

    /* ----- Elena ----- */
    function elenaMode(sc) {
      const stageEl = h('div', { class: 'pr-elena-stage' });
      const dancers = h('div', { class: 'elena-dancers' });
      const kinds = Object.keys(A.animals);
      const ds = [];
      for (let i = 0; i < 6; i++) {
        const a = OT.art.animal(kinds[(i * 3) % kinds.length]);
        a.style.left = 4 + i * 16 + '%';
        a.style.animationDelay = i * 0.12 + 's';
        a.style.animationPlayState = 'paused';
        dancers.appendChild(a);
        ds.push(a);
      }
      stageEl.appendChild(dancers);
      main.append(stageEl);
      let stopT = 0;
      const kb = OT.piano.keyboard({
        scope: sc,
        low: 60,
        high: 72,
        whitesOnly: true,
        mode: 'elena',
        computerKeys: true,
        vel: 0.7,
        onDown: (m, k) => {
          flyNote(k, 6);
          const r = k.getBoundingClientRect();
          OT.fx.burst(OT.pick(['balloons', 'stars', 'hearts', 'bubbles']), r.left + r.width / 2, r.top, 2);
          ds.forEach((d) => (d.style.animationPlayState = 'running'));
          const d = ds[Math.floor(Math.random() * ds.length)];
          OT.anim(d, [{ translate: '0 0' }, { translate: '0 -60px' }, { translate: '0 0' }], { duration: 500, easing: 'ease-out' });
          sc.clearTimeout(stopT);
          stopT = sc.timeout(() => ds.forEach((x) => (x.style.animationPlayState = 'paused')), 2500);
        },
      });
      main.appendChild(kb.el);
    }

    setMode(mode);
    if (params.fromLesson) {
      scope.timeout(() => OT.speak('Cântă la pian și privește unda sunetului!'), 500);
    }
  };

  /* ---------- trimiterea cântecului (și a pozei) la bunica ---------- */
  function sendToGran(root, sc, onDone) {
    const ov = h('div', { class: 'send-overlay' });
    const card = h('div', { class: 'send-card' });
    const svg = OT.svg(
      '0 0 600 300',
      `<g class="s-photo" transform="translate(150 20)"><rect x="-6" y="-6" width="102" height="102" rx="8" fill="#fff"/>${A.photoSVG({ size: 90 })}</g>` +
        `<g class="s-song" transform="translate(370 26)"><rect x="-6" y="-6" width="96" height="96" rx="18" fill="#8B5CF6"/><g transform="translate(4 2) scale(.84)">${A.note('#fff')}</g></g>` +
        `<g class="s-env">${A.envelope(200, 150, 200, '#FFFBEB', true)}</g>` +
        `<g class="s-ticks" font-size="56" font-weight="900" fill="#0284C7"><text class="t1" x="420" y="280" opacity="0">✓</text><text class="t2" x="455" y="280" opacity="0">✓</text></g>`
    );
    const title = h('div', { class: 'send-title' }, '✉️ Punem cântecul și poza în plic…');
    card.append(svg, title);
    ov.appendChild(card);
    root.appendChild(ov);
    const photo = svg.querySelector('.s-photo');
    const song = svg.querySelector('.s-song');
    const env = svg.querySelector('.s-env');
    (async () => {
      OT.sfx('paper');
      OT.anim(photo, [{ transform: 'translate(150px,20px)' }, { transform: 'translate(255px,170px) scale(.4)', opacity: 0.2 }], { duration: 1200, fill: 'forwards', easing: 'ease-in' });
      await sc.wait(500);
      OT.anim(song, [{ transform: 'translate(370px,26px)' }, { transform: 'translate(270px,176px) scale(.4)', opacity: 0.2 }], { duration: 1200, fill: 'forwards', easing: 'ease-in' });
      await sc.wait(1300);
      env.innerHTML = A.envelope(200, 150, 200, '#FFFBEB', false);
      OT.sfx('paper');
      title.textContent = '🛫 Plicul zboară prin aer, la turn, apoi prin cabluri…';
      await sc.wait(500);
      OT.sfx('whoosh');
      svg.querySelector('.t1').setAttribute('opacity', '1');
      await OT.anim(env, [{ transform: 'translate(0,0)' }, { transform: 'translate(160px,-60px) scale(.7) rotate(-8deg)', offset: 0.5 }, { transform: 'translate(520px,-200px) scale(.2)', opacity: 0 }], { duration: 2200, easing: 'ease-in', fill: 'forwards' });
      await sc.wait(300);
      svg.querySelector('.t2').setAttribute('opacity', '1');
      OT.sfx('ding');
      title.textContent = '✓✓ Ding! Bunica a primit cântecul tău și poza cățelului!';
      OT.fx.confetti(60);
      onDone();
      const ok = h('button', { class: 'big-btn primary' }, '🎹 Super!');
      ok.addEventListener('click', () => ov.remove());
      card.appendChild(ok);
    })();
    sc.add(() => ov.remove());
  }
})();
