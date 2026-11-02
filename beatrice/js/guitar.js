/* Ediția Beatrice — Studioul de chitară
   - 🎸 Chitara: gâtul chitarei (6 corzi, 5 taste), acorduri pentru începători, strum cu degetul
   - 🎼 Învață o melodie: „Oda bucuriei” (Beethoven, liberă de drepturi) pe corzile subțiri
   - 🎚️ Acordorul: microfonul ascultă chitara adevărată și arată dacă o coardă e prea jos / prea sus
   - 🎙️ Înregistrează-te: înregistrare cu microfonul, „în Dulap”, ascultare, trimitere la bunica
   Surpriză: acordurile Do → Sol → La minor → Fa (o succesiune foarte veche, folosită în mii de cântece) fac orașul să danseze. */
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;
  const A = OT.art;

  if (!document.getElementById('gt-style')) {
    document.head.appendChild(
      OT.h('style', {
        id: 'gt-style',
        text:
          '.gt-room{background:linear-gradient(#431407,#7c2d12 55%,#b45309)}' +
          '.gt-room .pr-tab.on{color:#9a3412}' +
          '#app.screen-guitar ~ #toast{top:calc(70px + env(safe-area-inset-top));bottom:auto}' +
          '.gt-board-wrap{position:relative;flex:1 1 auto;min-height:120px;display:flex;align-items:center;justify-content:center;touch-action:none}' +
          '.gt-board{width:100%;height:100%;touch-action:none;cursor:pointer}' +
          '.gt-chords{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;flex:none}' +
          '.gt-chord{border:none;border-radius:16px;padding:6px 14px;min-height:48px;font-weight:900;font-size:clamp(15px,1.7vw,20px);background:#fff7ed;color:#7c2d12;box-shadow:0 4px 0 rgba(0,0,0,.25)}' +
          '.gt-chord.on{background:#facc15;color:#422006}' +
          '.gt-chord small{display:block;font-size:.7em;opacity:.7}' +
          '.gt-vib-h{animation:gtvibh .07s linear 14}' +
          '.gt-vib-v{animation:gtvibv .07s linear 14}' +
          '@keyframes gtvibh{0%,100%{transform:translateY(0)}25%{transform:translateY(-3px)}75%{transform:translateY(3px)}}' +
          '@keyframes gtvibv{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}' +
          '.gt-target{animation:gtglow .9s ease-in-out infinite}' +
          '@keyframes gtglow{0%,100%{opacity:1}50%{opacity:.45}}' +
          '.gt-tuner{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center}' +
          '.gt-note{font-size:clamp(54px,12vmin,120px);font-weight:900;line-height:1;color:#fde68a}' +
          '.gt-freq{font-size:clamp(15px,2vw,22px);font-weight:800;opacity:.85}' +
          '.gt-meter{width:min(640px,92%);height:auto}' +
          '.gt-verdict{font-size:clamp(18px,2.6vw,30px);font-weight:900;min-height:1.3em}' +
          '.gt-strings-row{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}' +
          '.gt-strings-row span{background:rgba(255,255,255,.15);border-radius:12px;padding:6px 10px;font-weight:900;font-size:clamp(13px,1.6vw,18px)}' +
          '.gt-strings-row span.on{background:#facc15;color:#422006}' +
          '.gt-song-head{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;flex:none}' +
          '.gt-song-title{font-weight:900;font-size:clamp(19px,2.6vw,30px);color:#fde68a}' +
          '.gt-dots{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;flex:none}' +
          '.gt-dots i{width:13px;height:13px;border-radius:50%;background:rgba(255,255,255,.25)}' +
          '.gt-dots i.done{background:#facc15}' +
          '.gt-dots i.now{box-shadow:0 0 0 3px #fff}' +
          '@media (max-width:700px),(max-height:540px){.gt-chord{min-height:42px;padding:4px 10px;font-size:15px}.gt-chord small{display:none}}' +
          '@media (orientation:landscape) and (max-height:540px){.gt-room .pr-city{display:none}.gt-room .pr-viz{min-height:44px;max-height:22vh}}' +
          '@media (max-width:480px){.gt-room .pr-top{flex-wrap:wrap}.gt-room .pr-tabs{flex:1 1 100%;order:3}.gt-room .pr-tab{font-size:14px;padding:4px 9px;min-height:40px}}' +
          '@media (orientation:portrait) and (max-width:700px){.gt-room .pr-city{height:56px}.gt-room .pr-viz{min-height:60px;max-height:18vh;flex:0 0 auto;height:16vh}}',
      })
    );
  }

  /* ---------- note și corzi ---------- */
  const NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
  const OPEN = [40, 45, 50, 55, 59, 64]; // Mi La Re Sol Si Mi (de la coarda groasă la cea subțire)
  const SNAME = ['Mi', 'La', 'Re', 'Sol', 'Si', 'Mi'];
  const SLONG = ['Mi (groasă)', 'La', 'Re', 'Sol', 'Si', 'Mi (subțire)'];
  const CHORDS = {
    Em: { name: 'Mi minor', key: 'E', f: [0, 2, 2, 0, 0, 0], fing: [null, 2, 3, null, null, null] },
    Am: { name: 'La minor', key: 'A', f: [null, 0, 2, 2, 1, 0], fing: [null, null, 2, 3, 1, null] },
    C: { name: 'Do', key: 'C', f: [null, 3, 2, 0, 1, 0], fing: [null, 3, 2, null, 1, null] },
    G: { name: 'Sol', key: 'G', f: [3, 2, 0, 0, 0, 3], fing: [2, 1, null, null, null, 3] },
    D: { name: 'Re', key: 'D', f: [null, null, 0, 2, 3, 2], fing: [null, null, null, 1, 3, 2] },
    F: { name: 'Fa (ușor)', key: 'F', f: [null, null, 3, 2, 1, 1], fing: [null, null, 3, 2, 1, 1] },
  };
  const EGG = ['C', 'G', 'Am', 'F'];
  // „Oda bucuriei” (Beethoven) — [coarda, tasta]; coarda 5 = Mi subțire, 4 = Si
  const E = [5, 0], F = [5, 1], G = [5, 3], D = [4, 3], Cc = [4, 1];
  const ODA = [E, E, F, G, G, F, E, D, Cc, Cc, D, E, E, D, D, E, E, F, G, G, F, E, D, Cc, Cc, D, E, D, Cc, Cc];
  const ODA_LONG = { 14: 1, 29: 1 }; // note lungi (pentru „Ascult-o”)
  OT.GT = { OPEN, SNAME, CHORDS, NAMES };

  /* ---------- detectarea notei (metoda YIN, pentru acordor) ---------- */
  OT.gtDetect = function (buf, sr) {
    const n = buf.length;
    let rms = 0;
    for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / n);
    if (rms < 0.008) return null;
    const minLag = Math.floor(sr / 1000);
    const maxLag = Math.min(Math.floor(sr / 65), Math.floor(n / 2));
    const W = Math.min(n - maxLag, 2048);
    if (W < 64) return null;
    const d = new Float32Array(maxLag + 1);
    for (let t = 1; t <= maxLag; t++) {
      let s = 0;
      for (let j = 0; j < W; j++) {
        const x = buf[j] - buf[j + t];
        s += x * x;
      }
      d[t] = s;
    }
    const c = new Float32Array(maxLag + 1);
    c[0] = 1;
    let run = 0;
    for (let t = 1; t <= maxLag; t++) {
      run += d[t];
      c[t] = run ? (d[t] * t) / run : 1;
    }
    let tau = -1;
    for (let t = minLag; t <= maxLag; t++) {
      if (c[t] < 0.15) {
        while (t + 1 <= maxLag && c[t + 1] < c[t]) t++;
        tau = t;
        break;
      }
    }
    if (tau < 0) {
      let best = 1;
      for (let t = minLag; t <= maxLag; t++) if (c[t] < best) {
        best = c[t];
        tau = t;
      }
      if (best > 0.35) return null;
    }
    let bt = tau;
    if (tau > 1 && tau < maxLag) {
      const a = c[tau - 1], b = c[tau], g = c[tau + 1];
      const den = a + g - 2 * b;
      if (den) bt = tau + (a - g) / (2 * den);
    }
    return sr / bt;
  };
  const midiOf = (f) => 69 + 12 * Math.log2(f / 440);
  const noteName = (m) => NAMES[((Math.round(m) % 12) + 12) % 12];

  /* ---------- gâtul chitarei (SVG) ---------- */
  const NUT = 110;
  const FRETS = [NUT, 280, 440, 590, 731, 864];
  const END = 990;
  function makeBoard(o) {
    const vertical = !!o.vertical;
    const K = vertical ? 0.62 : 1;
    const sc = (i) => (vertical ? 50 + i * 40 : 250 - i * 40); // coordonata corzii
    const P = (a, i) => (vertical ? [sc(i), a * K] : [a, sc(i)]);
    const vb = vertical ? `0 0 300 ${END * K + 10}` : `0 0 ${END + 10} 300`;
    const pt = (a, c) => (vertical ? `${c} ${a * K}` : `${a} ${c}`);
    let m = '';
    // lemnul
    const r0 = P(NUT, 0), r1 = P(FRETS[5], 5);
    const x0 = Math.min(r0[0], r1[0]) - 22, y0 = Math.min(r0[1], r1[1]) - 22;
    const w = Math.abs(r1[0] - r0[0]) + 44, hh = Math.abs(r1[1] - r0[1]) + 44;
    m += `<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" rx="10" fill="#5B2E0E"/>`;
    // gura chitarei în zona de strum
    const sh = P(FRETS[5] + 75, 2.5);
    m += `<circle cx="${sh[0]}" cy="${sh[1]}" r="${vertical ? 70 : 90}" fill="#F59E0B" opacity=".25"/><circle cx="${sh[0]}" cy="${sh[1]}" r="${vertical ? 50 : 62}" fill="#1C0A02" opacity=".55"/>`;
    const tl = P(FRETS[5] + 75, vertical ? -0.9 : 6.05);
    m += `<text x="${tl[0]}" y="${tl[1] + (vertical ? 0 : 6)}" font-size="${vertical ? 18 : 20}" font-weight="900" text-anchor="middle" fill="#FDE68A">👋 strum</text>`;
    // semne pe taste (3, 5)
    [3, 5].forEach((k) => {
      const c = P((FRETS[k - 1] + FRETS[k]) / 2, 2.5);
      m += `<circle cx="${c[0]}" cy="${c[1]}" r="9" fill="#FDE68A" opacity=".55"/>`;
    });
    // taste (bare de metal) + căpușa
    FRETS.forEach((a, k) => {
      const p1 = P(a, -0.4), p2 = P(a, 5.4);
      m += `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${k ? '#D6D3D1' : '#FEF3C7'}" stroke-width="${k ? 6 : 12}" stroke-linecap="round"/>`;
      if (k) {
        const lb = P((FRETS[k - 1] + a) / 2, vertical ? -1 : 6.05);
        m += `<text x="${lb[0]}" y="${lb[1] + (vertical ? 6 : 6)}" font-size="18" font-weight="800" text-anchor="middle" fill="#FED7AA" opacity=".8">${k}</text>`;
      }
    });
    // corzile
    for (let i = 0; i < 6; i++) {
      const p1 = P(NUT - 4, i), p2 = P(END, i);
      m += `<g class="gt-str" data-i="${i}"><line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${i < 3 ? '#E7C690' : '#F1F5F9'}" stroke-width="${2 + (5 - i) * 1.1}"/></g>`;
      const lb = P(NUT / 2 - 6, i);
      m += `<text x="${lb[0]}" y="${lb[1] + 7}" font-size="${vertical ? 17 : 21}" font-weight="900" text-anchor="middle" fill="#FDE68A">${SNAME[i]}</text>`;
    }
    m += `<g class="gt-marks"></g>`;
    const svg = OT.svg(vb, m, { class: 'gt-board', preserveAspectRatio: 'xMidYMid meet' });
    const marks = svg.querySelector('.gt-marks');
    function fretCenter(k) {
      return k === 0 ? NUT / 2 + 26 : (FRETS[k - 1] + FRETS[k]) / 2 + 12;
    }
    function hit(e) {
      const p = OT.svgPoint(svg, e);
      const a = (vertical ? p.y / K : p.x);
      const c = vertical ? p.x : p.y;
      const i = OT.clamp(Math.round(vertical ? (c - 50) / 40 : (250 - c) / 40), 0, 5);
      const off = Math.abs(c - sc(i));
      if (a > FRETS[5] + 4) return { i, strum: true, off };
      let k = 0;
      if (a >= NUT) for (k = 1; k < 5 && a > FRETS[k]; k++);
      return { i, k, off };
    }
    return {
      svg,
      vertical,
      hit,
      vibrate(i) {
        const g = svg.querySelector(`.gt-str[data-i="${i}"]`);
        if (!g) return;
        g.classList.remove('gt-vib-h', 'gt-vib-v');
        void g.getBoundingClientRect();
        g.classList.add(vertical ? 'gt-vib-v' : 'gt-vib-h');
      },
      /** semne: [{i, k, label, color, cls}] ; k=null → X (coardă care nu se cântă) */
      marks(list) {
        let mm = '';
        (list || []).forEach((d) => {
          if (d.k === null) {
            const p = P(NUT / 2 + 26, d.i);
            mm += `<text x="${p[0]}" y="${p[1] + 9}" font-size="26" font-weight="900" text-anchor="middle" fill="#FCA5A5">✕</text>`;
            return;
          }
          const p = P(fretCenter(d.k), d.i);
          if (d.k === 0) mm += `<circle class="${d.cls || ''}" cx="${p[0]}" cy="${p[1]}" r="13" fill="none" stroke="${d.color || '#FDE68A'}" stroke-width="5"/>`;
          else mm += `<g class="${d.cls || ''}"><circle cx="${p[0]}" cy="${p[1]}" r="17" fill="${d.color || '#FACC15'}" stroke="#fff" stroke-width="3"/>` + (d.label != null ? `<text x="${p[0]}" y="${p[1] + 7}" font-size="19" font-weight="900" text-anchor="middle" fill="#422006">${d.label}</text>` : '') + `</g>`;
        });
        marks.innerHTML = mm;
      },
      flash(i, k) {
        const p = P(fretCenter(k), i);
        const c = OT.s('circle', { cx: p[0], cy: p[1], r: 15, fill: '#fff', opacity: 0.9 });
        marks.appendChild(c);
        OT.anim(c, [{ opacity: 0.9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.8)' }], { duration: 500 }).then(() => c.remove());
        c.style.transformBox = 'fill-box';
        c.style.transformOrigin = 'center';
      },
    };
  }
  OT.gtBoard = makeBoard;

  /* ---------- orașul mic (dansează / primește steluțe) ---------- */
  function miniCity() {
    const keys = ['studio', 'fabrica', 'dulap', 'centrala', 'posta', 'aeroport', 'primaria', 'chitara'];
    let m = '<rect x="-400" y="232" width="2400" height="60" fill="#7C2D12"/>';
    keys.forEach((k, i) => {
      if (A.buildings[k]) m += `<g transform="translate(${i * 200 + 10} 20) scale(.82)"><g class="mini-b bld lit">${A.buildings[k]()}</g></g>`;
    });
    m += `<g transform="translate(1565 98) scale(.42)">${A.beatrice()}</g>`;
    return h('div', { class: 'pr-city' }, OT.svg('0 -10 1640 270', m, { preserveAspectRatio: 'xMidYMax meet' }));
  }

  const fmt = (ms) => {
    const s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };

  /* ---------- ecranul ---------- */
  OT.screens.guitar = function (app, params, scope) {
    let mode = params.mode || 'play';
    const root = h('div', { class: 'piano-room gt-room' });
    const mapBtn = h('button', { class: 'icon-btn', 'aria-label': 'Harta', title: 'Harta orașului' }, '🗺️');
    const lessonBtn = h('button', { class: 'icon-btn', 'aria-label': 'Lecția', title: 'Lecția despre chitară' }, '📖');
    const tabs = h('div', { class: 'pr-tabs' });
    const T = [
      ['play', '🎸 ', 'Chitara', 'Chitara'],
      ['song', '🎼 ', 'Învață o melodie', 'Melodie'],
      ['tune', '🎚️ ', 'Acordorul', 'Acordor'],
      ['rec', '🎙️ ', 'Înregistrează-te', 'Microfon'],
    ];
    const tabBtns = {};
    T.forEach(([k, ico, long, short]) => {
      const b = h('button', { class: 'pr-tab' }, ico, h('span', { class: 't-long' }, long), h('span', { class: 't-short' }, short));
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

    let earnedNow = false;
    let earned = OT.isDone(8);
    const chordsUsed = new Set();
    const seq = [];
    mapBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('map', { justDone: earnedNow ? 8 : null });
    });
    lessonBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('lesson', { id: 8 });
    });

    function award(why) {
      if (earned) return;
      earned = true;
      earnedNow = true;
      OT.state.done[8] = true;
      OT.save();
      const b = OT.buildings[8];
      const pop = h('div', { class: 'award-pop' });
      pop.appendChild(OT.art.badgeSVG('chitara', b ? b.color : '#F59E0B'));
      pop.appendChild(h('div', {}, h('b', {}, 'Bravo, Beatrice! ' + (why || '') + ' Ai câștigat insigna Studioului de chitară!'), h('div', { class: 'ap-sub' }, '💡 ' + (b ? b.learned : ''))));
      const x = h('button', { class: 'icon-btn', 'aria-label': 'Închide' }, '✕');
      x.addEventListener('click', () => pop.remove());
      pop.appendChild(x);
      root.appendChild(pop);
      scope.timeout(() => pop.remove(), 9000);
      OT.sfx('fanfare');
      OT.fx.confetti(80);
    }
    function dance() {
      OT.temp.danceUntil = Date.now() + 25000;
      city.classList.add('dancing');
      scope.timeout(() => city.classList.remove('dancing'), 25000);
      OT.fx.confetti(80);
      OT.fx.burst('notes', window.innerWidth / 2, window.innerHeight / 3, 16, { spread: 300 });
      OT.toast('🎉 Do – Sol – La minor – Fa! Cele patru acorduri fermecate: <b>orașul dansează!</b>', { ms: 5500 });
      OT.state.eggs.chords = true;
      OT.save();
    }

    let sub = null;
    function setMode(k) {
      mode = k;
      if (sub) sub.dispose();
      sub = OT.scope();
      scope.add(() => sub && sub.dispose());
      main.innerHTML = '';
      Object.entries(tabBtns).forEach(([kk, b]) => b.classList.toggle('on', kk === k));
      ({ play: playMode, song: songMode, tune: tuneMode, rec: recMode })[k](sub);
    }
    const isPortrait = () => window.innerHeight > window.innerWidth * 1.1 && window.innerWidth < 760;
    // la rotirea ecranului, gâtul chitarei se redesenează
    let lastP = isPortrait();
    let rt = 0;
    scope.on(window, 'resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (isPortrait() !== lastP && (mode === 'play' || mode === 'song')) {
          lastP = isPortrait();
          setMode(mode);
        }
      }, 250);
    });

    /* ----- 🎸 Chitara ----- */
    function playMode(sc) {
      const viz = OT.piano.viz(sc, '〰️ Unda sunetului · ⚪ = „pozele” sunetului');
      const board = makeBoard({ vertical: isPortrait() });
      const wrap = h('div', { class: 'gt-board-wrap' }, board.svg);
      const chordsRow = h('div', { class: 'gt-chords' });
      const msg = h('div', { class: 'pr-msg' });
      const tip = h('div', { class: 'pr-tip' });
      let chord = null;
      const btns = {};
      const none = h('button', { class: 'gt-chord on' }, 'Corzi libere', h('small', {}, 'fără acord'));
      none.addEventListener('click', () => selectChord(null, true));
      chordsRow.appendChild(none);
      Object.entries(CHORDS).forEach(([k, c]) => {
        const b = h('button', { class: 'gt-chord' }, c.name, h('small', {}, c.key === 'E' ? 'Em' : c.key === 'A' ? 'Am' : c.key));
        b.addEventListener('click', () => selectChord(k, true));
        btns[k] = b;
        chordsRow.appendChild(b);
      });
      const strumBtn = h('button', { class: 'big-btn yellow' }, 'Strum ⬇');
      strumBtn.addEventListener('click', () => strum(true));
      chordsRow.appendChild(strumBtn);
      main.append(city, viz.el, wrap, chordsRow, msg, tip);

      function frets() {
        return chord ? CHORDS[chord].f : [0, 0, 0, 0, 0, 0];
      }
      function showChord() {
        if (!chord) return board.marks([]);
        const c = CHORDS[chord];
        board.marks(c.f.map((k, i) => ({ i, k, label: c.fing[i] })));
      }
      function selectChord(k, play) {
        chord = k;
        none.classList.toggle('on', !k);
        Object.entries(btns).forEach(([kk, b]) => b.classList.toggle('on', kk === k));
        showChord();
        msg.innerHTML = k ? `Acordul <b>${CHORDS[k].name}</b>: pune degetele pe bulinele galbene (cifra = degetul), apoi fă „strum” în dreapta.` : 'Corzile libere: fără degete pe taste.';
        if (play) strum(true);
      }
      function pluck(i, k) {
        if (k == null) return;
        OT.audio.guitar(OPEN[i] + k, { vel: 0.85 });
        board.vibrate(i);
        board.flash(i, k);
      }
      let played = 0;
      function noteStrum() {
        if (chord) {
          chordsUsed.add(chord);
          if (seq[seq.length - 1] !== chord) seq.push(chord);
          if (seq.length > 6) seq.shift();
          if (seq.slice(-4).join() === EGG.join()) {
            seq.length = 0;
            dance();
          }
          if (chordsUsed.size >= 3) award('Ai cântat 3 acorduri diferite.');
        }
        updateTip();
      }
      function strum(down) {
        const f = frets();
        const order = [0, 1, 2, 3, 4, 5];
        if (!down) order.reverse();
        order.forEach((i, n) => {
          if (f[i] == null) return;
          OT.audio.guitar(OPEN[i] + f[i], { at: n * 0.03, vel: 0.7 });
          sc.timeout(() => board.vibrate(i), n * 30);
        });
        const r = wrap.getBoundingClientRect();
        OT.fx.burst('notes', r.right - r.width * 0.1, r.top + r.height / 2, 2, { size: 30, spread: 90 });
        noteStrum();
      }
      function updateTip() {
        if (!earned) tip.textContent = `🏅 Cântă 3 acorduri diferite ca să câștigi insigna: ${Math.min(chordsUsed.size, 3)}/3`;
        else if (isPortrait()) tip.textContent = '🔄 Întoarce telefonul: chitara se face mai mare.';
        else tip.innerHTML = '🎁 Surpriză: fă „strum” pe acordurile <b>Do → Sol → La minor → Fa</b>, pe rând, și privește orașul!';
        if (window.matchMedia('(hover: hover)').matches && !isPortrait()) tip.innerHTML += '<br><span style="opacity:.8">⌨️ 1–6 = corzile · E A C G D F = acordurile · Spațiu = strum</span>';
      }
      updateTip();
      // atingeri: pe taste = o notă; în zona din dreapta (sau trăgând peste corzi) = strum
      const ptr = {};
      sc.on(board.svg, 'pointerdown', (e) => {
        e.preventDefault();
        try {
          board.svg.setPointerCapture(e.pointerId);
        } catch (err) {}
        const r = board.hit(e);
        ptr[e.pointerId] = { i: r.i, strum: r.strum, k: r.k, n: 0 };
        if (r.strum) {
          const f = frets();
          if (f[r.i] != null) pluck(r.i, f[r.i]);
        } else pluck(r.i, chord && r.k === 0 ? frets()[r.i] : r.k);
        played++;
      });
      sc.on(board.svg, 'pointermove', (e) => {
        const p = ptr[e.pointerId];
        if (!p) return;
        const r = board.hit(e);
        if (r.i !== p.i) {
          // a trecut peste alte corzi: le cântă pe toate dintre ele
          const step = r.i > p.i ? 1 : -1;
          for (let i = p.i + step; i !== r.i + step; i += step) {
            const f = r.strum || p.strum ? frets()[i] : r.k;
            if (f != null) pluck(i, f);
          }
          p.n += Math.abs(r.i - p.i);
          p.i = r.i;
        }
      });
      const end = (e) => {
        const p = ptr[e.pointerId];
        if (p && p.n >= 3) noteStrum();
        delete ptr[e.pointerId];
      };
      sc.on(board.svg, 'pointerup', end);
      sc.on(board.svg, 'pointercancel', end);
      sc.on(document, 'keydown', (e) => {
        if (document.querySelector('.send-overlay, .dialog-back') || e.repeat || e.ctrlKey || e.metaKey) return;
        const n = e.code.match(/^Digit([1-6])$/);
        if (n) {
          const i = +n[1] - 1;
          pluck(i, frets()[i] == null ? 0 : frets()[i]);
          return;
        }
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          strum(true);
          return;
        }
        const ck = Object.keys(CHORDS).find((k) => 'Key' + CHORDS[k].key === e.code);
        if (ck) {
          e.preventDefault();
          selectChord(ck, true);
        }
      });
      selectChord(null, false);
      msg.innerHTML = 'Atinge o coardă pe o tastă ca să cânți o notă. Alege un acord și fă „strum” în dreapta 👋.';
      void played;
    }

    /* ----- 🎼 Oda bucuriei ----- */
    function songMode(sc) {
      const head = h('div', { class: 'gt-song-head' });
      const title = h('div', { class: 'gt-song-title' }, '🎼 Oda bucuriei');
      const listen = h('button', { class: 'big-btn yellow' }, '▶️ Ascult-o');
      const again = h('button', { class: 'big-btn' }, '🔁 De la capăt');
      head.append(title, listen, again);
      const dots = h('div', { class: 'gt-dots' });
      const board = makeBoard({ vertical: isPortrait() });
      const wrap = h('div', { class: 'gt-board-wrap' }, board.svg);
      const msg = h('div', { class: 'pr-msg' }, 'Atinge bulina care strălucește: coarda și tasta arătate. Cifra = tasta.');
      main.append(city, head, dots, wrap, msg);
      let pos = 0;
      let wrongs = 0;
      let demo = false;
      function draw() {
        dots.innerHTML = '';
        ODA.forEach((_, i) => dots.appendChild(h('i', { class: i < pos ? 'done' : i === pos ? 'now' : '' })));
        if (pos < ODA.length) {
          const [i, k] = ODA[pos];
          board.marks([{ i, k, label: k, cls: 'gt-target', color: '#F472B6' }]);
          msg.innerHTML = `Coarda <b>${SLONG[i]}</b>, ${k ? 'tasta <b>' + k + '</b>' : '<b>liberă</b> (fără deget)'} → nota <b>${noteName(OPEN[i] + k)}</b>`;
        } else board.marks([]);
      }
      function finish() {
        OT.temp.starsUntil = Date.now() + 14000;
        OT.fx.rain('stars', 46, { ms: 9000, size: 28, fallMs: 7000 });
        OT.sfx('fanfare');
        OT.toast('✨ Bravo, Beatrice! Ai cântat „Oda bucuriei” de Beethoven! Cad steluțe peste oraș…', { ms: 6000, speak: 'Bravo, Beatrice! Ai cântat Oda bucuriei!' });
        award('Ai cântat „Oda bucuriei”.');
        msg.innerHTML = '🏆 Gata! Acum încearc-o pe chitara ta adevărată: aceleași corzi, aceleași taste.';
      }
      sc.on(board.svg, 'pointerdown', (e) => {
        e.preventDefault();
        if (demo || pos >= ODA.length) return;
        const r = board.hit(e);
        const k = r.strum ? 0 : r.k;
        OT.audio.guitar(OPEN[r.i] + k, { vel: 0.85 });
        board.vibrate(r.i);
        board.flash(r.i, k);
        const [ti, tk] = ODA[pos];
        if (OPEN[r.i] + k === OPEN[ti] + tk && (r.i === ti || r.off < 30)) {
          pos++;
          wrongs = 0;
          draw();
          if (pos >= ODA.length) sc.timeout(finish, 400);
        } else {
          wrongs++;
          if (wrongs === 2) OT.speak('Mai încearcă! Atinge bulina roz care strălucește.');
        }
      });
      listen.addEventListener('click', async () => {
        if (demo) return;
        demo = true;
        for (let n = 0; n < ODA.length && n < 15; n++) {
          if (!sc.alive) return;
          const [i, k] = ODA[n];
          board.marks([{ i, k, label: k, color: '#F472B6' }]);
          OT.audio.guitar(OPEN[i] + k, { vel: 0.8 });
          board.vibrate(i);
          await sc.wait(ODA_LONG[n] ? 800 : 420);
        }
        demo = false;
        draw();
      });
      again.addEventListener('click', () => {
        OT.sfx('tap');
        pos = 0;
        draw();
      });
      draw();
    }

    /* ----- 🎚️ Acordorul ----- */
    function tuneMode(sc) {
      const box = h('div', { class: 'gt-tuner' });
      const note = h('div', { class: 'gt-note' }, '🎸');
      const freq = h('div', { class: 'gt-freq' }, 'Ciupește o coardă a chitarei tale, lângă telefon.');
      const meter = OT.svg(
        '0 0 600 170',
        '<path d="M60 150 A240 240 0 0 1 540 150" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="26" stroke-linecap="round"/>' +
          '<path d="M262 18 A240 240 0 0 1 338 18" fill="none" stroke="#4ADE80" stroke-width="26"/>' +
          '<text x="70" y="168" font-size="20" font-weight="900" fill="#FCA5A5">prea jos</text><text x="530" y="168" font-size="20" font-weight="900" text-anchor="end" fill="#FCA5A5">prea sus</text>' +
          '<g class="gt-needle"><line x1="300" y1="160" x2="300" y2="30" stroke="#FDE68A" stroke-width="8" stroke-linecap="round"/></g><circle cx="300" cy="160" r="14" fill="#FDE68A"/>',
        { class: 'gt-meter' }
      );
      const needle = meter.querySelector('.gt-needle');
      needle.style.transformOrigin = '300px 160px';
      needle.style.transition = 'transform .15s';
      const verdict = h('div', { class: 'gt-verdict' });
      const row = h('div', { class: 'gt-strings-row' });
      const chips = SLONG.map((n, i) => {
        const s = h('span', {}, `${i + 1}. ${n}`);
        row.appendChild(s);
        return s;
      });
      const start = h('button', { class: 'big-btn yellow' }, '🎙️ Pornește acordorul');
      const msg = h('div', { class: 'pr-msg' }, 'Cheițele de sus întind sau slăbesc corzile: strânsă = notă mai sus, slăbită = notă mai jos.');
      box.append(note, freq, meter, verdict, row, start, msg);
      main.append(box);
      let stream = null;
      let an = null;
      let src = null;
      const hist = [];
      function stop() {
        if (stream) stream.getTracks().forEach((t) => t.stop());
        stream = null;
        try {
          if (src) src.disconnect();
        } catch (e) {}
        src = null;
        an = null;
        OT.audio._recording = false;
      }
      sc.add(stop);
      function show(f) {
        if (!f) return;
        hist.push(f);
        if (hist.length > 5) hist.shift();
        const sorted = hist.slice().sort((a, b) => a - b);
        const fm = sorted[Math.floor(sorted.length / 2)];
        const m = midiOf(fm);
        note.textContent = noteName(m);
        freq.textContent = fm.toFixed(1) + ' Hz · aerul tremură de ' + Math.round(fm) + ' de ori pe secundă';
        let best = 0;
        OPEN.forEach((s, i) => {
          if (Math.abs(m - s) < Math.abs(m - OPEN[best])) best = i;
        });
        chips.forEach((c, i) => c.classList.toggle('on', i === best));
        const cents = 1200 * Math.log2(fm / OT.audio.freq(OPEN[best]));
        const cl = OT.clamp(cents, -50, 50);
        needle.style.transform = `rotate(${(cl / 50) * 70}deg)`;
        if (Math.abs(cents) <= 6) {
          verdict.textContent = `✅ Perfect! Coarda ${SLONG[best]} e acordată.`;
          verdict.style.color = '#4ADE80';
        } else if (cents < 0) {
          verdict.textContent = `⬆️ Puțin prea jos: strânge ușor cheița corzii ${SLONG[best]}.`;
          verdict.style.color = '#FDE68A';
        } else {
          verdict.textContent = `⬇️ Puțin prea sus: slăbește ușor cheița corzii ${SLONG[best]}.`;
          verdict.style.color = '#FDE68A';
        }
      }
      OT.gtShowPitch = show; // pentru teste
      start.addEventListener('click', async () => {
        if (stream) {
          stop();
          start.textContent = '🎙️ Pornește acordorul';
          return;
        }
        if (!(window.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
          msg.innerHTML = '🎙️ Microfonul nu poate fi folosit aici (merge pe pagina sigură <b>https</b>). Restul studioului merge la fel!';
          return;
        }
        msg.textContent = '🎙️ Telefonul îți cere voie să folosească microfonul. Apasă „Permite”.';
        try {
          OT.audio._recording = true;
          stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        } catch (e) {
          OT.audio._recording = false;
          stream = null;
          msg.innerHTML = '🙈 Microfonul nu a primit voie. Nu-i nimic — poți cânta mai departe în celelalte camere!';
          return;
        }
        if (!sc.alive) return stop();
        const c = OT.audio.unlock();
        src = c.createMediaStreamSource(stream);
        an = c.createAnalyser();
        an.fftSize = 4096;
        src.connect(an);
        start.textContent = '⏹️ Oprește acordorul';
        msg.textContent = '👂 Te ascult! Ciupește câte o coardă și las-o să sune.';
        const buf = new Float32Array(an.fftSize);
        let last = 0;
        sc.raf((t) => {
          if (!an) return false;
          if (t - last < 70) return;
          last = t;
          an.getFloatTimeDomainData(buf);
          show(OT.gtDetect(buf, c.sampleRate));
        });
      });
    }

    /* ----- 🎙️ Înregistrează-te ----- */
    function recMode(sc) {
      const viz = OT.piano.viz(sc, '〰️ Unda ta, în timp real');
      const msg = h('div', { class: 'pr-msg' });
      const rec = h('button', { class: 'big-btn rec-btn' });
      const recIdle = () => rec.replaceChildren('🎙️ Înregistrează-te', h('span', { class: 't-long' }, ' cântând la chitară'));
      recIdle();
      const listen = h('button', { class: 'big-btn blue', disabled: true });
      const listenIdle = () => listen.replaceChildren('▶️ Ascultă', h('span', { class: 't-long' }, ' din Dulap'));
      listenIdle();
      const send = h('button', { class: 'big-btn pink', disabled: true }, '✉️ Trimite', h('span', { class: 't-long' }, '-l bunicii'));
      const meter = h('div', { class: 'mic-meter', style: { display: 'none' } }, h('i'));
      main.append(city, viz.el, meter, h('div', { class: 'pr-controls' }, rec, listen, send), msg);
      let stream = null, recorder = null, chunks = [], t0 = 0, timer = 0, micSrc = null, micAn = null, audioEl = null, audioUrl = null, meterLoop = null;
      async function refresh() {
        const r = await OT.dulap.load();
        if (!sc.alive) return;
        listen.disabled = !r;
        send.disabled = !r;
        if (r && !recorder) msg.innerHTML = `🗄️ În Dulap: cântecul tău (${fmt(r.duration || 0)}).` + (OT.state.songSent ? ' ✓✓ Bunica l-a primit.' : '');
        else if (!r) msg.innerHTML = 'Ia-ți chitara adevărată, apasă butonul roșu și cântă! Microfonul transformă sunetul în numere.';
      }
      refresh();
      function stopPlayback() {
        if (audioEl) audioEl.pause();
        audioEl = null;
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = null;
        listenIdle();
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
      sc.add(() => {
        stopPlayback();
        stopRecording(true);
      });
      async function startRecording() {
        stopPlayback();
        if (!(window.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)) {
          msg.innerHTML = '🎙️ Microfonul nu poate fi folosit aici (merge doar pe pagina sigură <b>https</b>). Restul studioului merge la fel!';
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
          const blob = new Blob(chunks, { type: (recorder && recorder.mimeType) || type || 'audio/webm' });
          recorder = null;
          if (blob.size > 0) {
            await OT.dulap.save({ blob, type: blob.type, date: Date.now(), duration: dur });
            OT.state.songSent = false;
            OT.save();
            if (!sc.alive) return;
            OT.sfx('success');
            const c = OT.center(listen);
            OT.fx.burst('stars', c.x, c.y, 10);
            award('Te-ai înregistrat cântând.');
          }
          await refresh();
          if (sc.alive && blob.size > 0) msg.innerHTML = '🗄️ Gata! Cântecul tău e acum în <b>Dulap</b> (memoria telefonului). Apasă „Ascultă”!';
        };
        recorder.start(1000);
        t0 = Date.now();
        rec.textContent = '⏹️ Gata, oprește';
        rec.classList.add('on');
        meter.style.display = '';
        msg.textContent = '🔴 Înregistrez… Cântă la chitara ta! Uite unda ta, în timp real.';
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
      rec.addEventListener('click', () => {
        OT.audio.unlock();
        if (recorder) stopRecording();
        else startRecording();
      });
      listen.addEventListener('click', async () => {
        if (audioEl) return stopPlayback();
        const r = await OT.dulap.load();
        if (!r || !sc.alive) return;
        audioUrl = URL.createObjectURL(r.blob);
        audioEl = new Audio(audioUrl);
        audioEl.playsInline = true;
        try {
          OT.audio.unlock().createMediaElementSource(audioEl).connect(OT.audio.master);
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
        if (!(await OT.dulap.load())) return;
        stopPlayback();
        sendToGran(root, sc, () => {
          OT.state.songSent = true;
          OT.state.photoSent = true;
          OT.save();
          refresh();
        });
      });
    }

    setMode(mode);
    if (params.fromLesson) scope.timeout(() => OT.speak('Cântă la chitară și privește unda sunetului!'), 500);
  };

  /* ---------- trimiterea cântecului și a desenului la bunica ---------- */
  function sendToGran(root, sc, onDone) {
    const ov = h('div', { class: 'send-overlay' });
    const card = h('div', { class: 'send-card' });
    const svg = OT.svg(
      '0 0 600 300',
      `<g class="s-photo" transform="translate(150 20)"><rect x="-6" y="-6" width="102" height="102" rx="8" fill="#fff"/>${A.photoSVG({ size: 90 })}</g>` +
        `<g class="s-song" transform="translate(370 26)"><rect x="-6" y="-6" width="96" height="96" rx="18" fill="#F59E0B"/><g transform="translate(46 -2) rotate(30) scale(.28)">${A.guitar()}</g></g>` +
        `<g class="s-env">${A.envelope(200, 150, 200, '#FFFBEB', true)}</g>` +
        `<g font-size="56" font-weight="900" fill="#0284C7"><text class="t1" x="420" y="280" opacity="0">✓</text><text class="t2" x="455" y="280" opacity="0">✓</text></g>`
    );
    const title = h('div', { class: 'send-title' }, '✉️ Punem cântecul și desenul tău în plic…');
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
      title.textContent = '✓✓ Ding! Bunica a primit cântecul tău la chitară și desenul!';
      OT.fx.confetti(60);
      onDone();
      const ok = h('button', { class: 'big-btn primary' }, '🎸 Super!');
      ok.addEventListener('click', () => ov.remove());
      card.appendChild(ok);
    })();
    sc.add(() => ov.remove());
  }
})();
