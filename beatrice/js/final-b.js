/* Ediția Beatrice — FINALUL (bunica răspunde + petrecerea) și DIPLOMELE printabile
   OT.go('final')     -> telefonul bunicii, mesajele, petrecerea
   OT.go('diplomas')  -> cele două diplome ale Beatricei (A4 culcat, una pe pagină la tipărire)
*/
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;
  const A = OT.art;

  /* clădirile (dacă o clădire nu e încă înregistrată, folosim aceste date) */
  const FALLBACK = [
    null,
    { key: 'studio', name: 'Studioul foto', color: '#5CC8C4' },
    { key: 'fabrica', name: 'Fabrica de numere', color: '#F59E0B' },
    { key: 'dulap', name: 'Masa de lucru și Dulapul', color: '#A78BFA' },
    { key: 'centrala', name: 'Centrala electrică', color: '#34D399' },
    { key: 'posta', name: 'Poșta', color: '#EF4444' },
    { key: 'aeroport', name: 'Aeroportul', color: '#60A5FA' },
    { key: 'primaria', name: 'Primăria', color: '#FCD34D' },
    { key: 'chitara', name: 'Studioul de chitară', color: '#F59E0B' },
  ];
  function bInfo(i) {
    const b = OT.buildings[i] || {};
    const f = FALLBACK[i];
    return { key: b.key || f.key, name: b.name || f.name, color: b.color || f.color };
  }

  const FEM = ['zero', 'o', 'două', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă', 'zece'];
  const MONTHS = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  /** „de” în română: 20 de steluțe, 101 steluțe, 120 de steluțe */
  const needsDe = (n) => n >= 20 && (n % 100 === 0 || n % 100 >= 20);
  /** 1 steluță / 7 steluțe / 25 de steluțe */
  function starsCount(n) {
    return n + (n === 1 ? ' steluță' : needsDe(n) ? ' de steluțe' : ' steluțe');
  }
  function today() {
    const d = new Date();
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* ===================================================== FINALUL */
  OT.screens.final = function (app, params, scope) {
    OT.state.finalSeen = true;
    OT.save();
    const song = !!OT.state.songSent;
    A.useDrawing && A.useDrawing();

    const root = h('div', { class: 'final bea' });
    const mapTop = h('button', { class: 'icon-btn', 'aria-label': 'Harta orașului', title: 'Harta orașului' }, '🗺️');
    const top = h('div', { class: 'final-top' }, mapTop, h('h1', {}, 'Bunica a răspuns! 💌'), h('span', { class: 'ft-spacer' }));

    /* telefonul bunicii */
    const status = h('div', { class: 'gh-status' }, 'online');
    const head = h('div', { class: 'gran-head' }, A.head('bunica'), h('div', {}, h('div', { class: 'gh-name' }, 'Bunica ❤️'), status));
    const msgs = h('div', { class: 'gran-msgs' });
    const phone = h('div', { class: 'gran-phone' }, h('div', { class: 'gran-screen' }, head, msgs));

    const party = buildParty();
    const main = h('div', { class: 'final-main' }, phone, party.el);

    const dipBtn = h('button', { class: 'big-btn pink' }, '📜 Diploma');
    const artBtn = h('button', { class: 'big-btn yellow' }, '🎨 Atelierul');
    const mapBtn = h('button', { class: 'big-btn' }, '🗺️ Harta');
    const actions = h('div', { class: 'final-actions' }, dipBtn, artBtn, mapBtn);
    root.append(top, main, actions);
    app.appendChild(root);

    const toMap = () => {
      OT.sfx('tap');
      OT.go('map');
    };
    mapTop.addEventListener('click', toMap);
    mapBtn.addEventListener('click', toMap);
    dipBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('diplomas');
    });
    artBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('atelier');
    });

    function addMsg(cls, ...kids) {
      const m = h('div', { class: 'msg ' + cls }, ...kids);
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
      return m;
    }
    const ticks = () => h('span', { class: 'ticks' }, '✓✓');

    /* cântecul Beatricei (dacă a fost trimis) */
    let audio = null;
    let url = null;
    scope.add(() => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
      }
      if (url) URL.revokeObjectURL(url);
    });

    async function run() {
      await scope.wait(500);
      // 1) desenul trimis de Beatrice
      const thumb = OT.svg('0 0 16 16', A.photoSVG({ size: 16 }), { class: 'thumb drawing', 'shape-rendering': 'crispEdges' });
      addMsg('me photo', thumb, h('div', { class: 'cap' }, 'Uite ce am desenat pentru tine! 🎨', ticks()));
      OT.sfx('pop');

      // 2) cântecul (doar dacă l-a trimis)
      if (song) {
        await scope.wait(900);
        let rec = null;
        try {
          rec = await OT.dulap.load();
        } catch (e) {
          rec = null;
        }
        if (!scope.alive) return;
        const row = h('div', { class: 'song-row' });
        if (rec && rec.blob) {
          url = URL.createObjectURL(rec.blob);
          audio = new Audio(url);
          const play = h('button', { class: 'play-btn', 'aria-label': 'Ascultă cântecul' }, '▶️');
          play.addEventListener('click', () => {
            if (audio.paused) {
              OT.speakStop();
              const p = audio.play();
              if (p && p.catch) p.catch(() => {});
              play.textContent = '⏸️';
            } else {
              audio.pause();
              play.textContent = '▶️';
            }
          });
          audio.addEventListener('ended', () => (play.textContent = '▶️'));
          row.appendChild(play);
        }
        const lbl = h('div', {}, h('div', {}, '🎸 Cântecul Beatricei la chitară'));
        // durata e salvată în milisecunde
        const d = rec && isFinite(rec.duration) ? Math.round(+rec.duration / 1000) : 0;
        if (d > 0) lbl.appendChild(h('div', { class: 'dur' }, Math.floor(d / 60) + ':' + String(d % 60).padStart(2, '0')));
        row.appendChild(lbl);
        addMsg('me song', row, ticks());
        OT.sfx('pop');
      }

      // 3) bunica scrie…
      await scope.wait(900);
      status.textContent = 'scrie…';
      const typing = h('div', { class: 'typing' }, h('i'), h('i'), h('i'));
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;
      await scope.wait(2000);

      // 4) răspunsul bunicii
      const col = mainColor();
      const lines = ['Draga mea Beatrice! 🥰'];
      lines.push('Am primit desenul tău — e minunat!' + (col ? ' Ce frumos ai folosit ' + col + '!' : '') + ' L-am pus pe ecranul telefonului, ca să-l văd în fiecare zi. 🎨');
      if (song) lines.push('Și ai cântat la chitară pentru mine! L-am ascultat de două ori… sunt tare mândră de tine! 🎸');
      lines.push(song ? 'Desenează mai departe și exersează la chitară — abia aștept următorul tău concert!' : 'Desenează mai departe! Și când înveți un cântec la chitară, să mi-l trimiți și mie. 🎸');
      lines.push('Te iubește, Bunica ❤️');

      OT.sfx('ding');
      OT.speak(lines.join(' '));
      for (let i = 0; i < lines.length; i++) {
        if (!scope.alive) return;
        if (i > 0) {
          msgs.appendChild(typing);
          msgs.scrollTop = msgs.scrollHeight;
          await scope.wait(950);
        }
        typing.remove();
        addMsg('her' + (i === lines.length - 1 ? ' sign' : ''), lines[i]);
        if (i > 0) OT.sfx('bubble');
      }
      status.textContent = 'online';
      const reread = h('button', { class: 'reread' }, '🔊 Citește din nou');
      reread.addEventListener('click', () => OT.speak(lines.join(' ')));
      msgs.appendChild(reread);
      msgs.scrollTop = msgs.scrollHeight;

      // 5) petrecerea!
      await scope.wait(500);
      party.celebrate();
      dipBtn.classList.add('glow-on');
    }

    /* toată familia sărbătorește */
    function buildParty() {
      const el = h('div', { class: 'party' });
      el.appendChild(OT.svg('0 0 600 70', garland(), { class: 'garland', preserveAspectRatio: 'none' }));
      const hura = h('div', { class: 'hura' }, 'Hura! 🎉');
      el.appendChild(hura);
      const chars = [
        { name: 'easel', left: 0, w: 24, sfx: 'pop', fx: 'sparkles', label: 'Desenul Beatricei' },
        { name: 'bunica', left: 22, w: 21, sfx: 'giggle', fx: 'hearts', label: 'Bunica' },
        { name: 'beatrice', left: 42, w: 22, sfx: 'boing', fx: 'stars', label: 'Beatrice' },
        { name: 'guitar', left: 63, w: 12, sfx: null, fx: 'notes', label: 'Chitara' },
        { name: 'cat', left: 79, w: 19, sfx: 'meow', fx: 'hearts', label: 'Pisica' },
      ];
      chars.forEach((c, i) => {
        const wrap = h('button', { class: 'p-char p-' + c.name, 'aria-label': c.label });
        wrap.style.left = c.left + '%';
        wrap.style.width = c.w + '%';
        const svg = A.make(c.name, { class: 'p-svg' });
        svg.style.animationDelay = (i * 0.11).toFixed(2) + 's';
        wrap.appendChild(svg);
        wrap.addEventListener('click', () => {
          if (c.name === 'guitar') {
            if (OT.audio.strum) OT.audio.strum([48, 52, 55, 60, 64], { vel: 0.7 });
            else OT.sfx('success');
          } else OT.sfx(c.sfx);
          OT.anim(wrap, [{ transform: 'translateY(0)' }, { transform: 'translateY(-28%)' }, { transform: 'translateY(0)' }], { duration: 650, easing: 'ease-out' });
          OT.fx.at(svg, c.fx, 10);
        });
        el.appendChild(wrap);
      });
      return {
        el,
        celebrate() {
          el.classList.add('dancing');
          OT.sfx('fanfare');
          OT.fx.confetti(140);
          const r = el.getBoundingClientRect();
          [0.25, 0.5, 0.85].forEach((p, k) => scope.timeout(() => OT.fx.burst('balloons', r.left + r.width * p, r.bottom - 30, 4), 300 + k * 450));
          scope.timeout(() => OT.fx.confetti(80), 3200);
          scope.timeout(() => {
            const c = OT.center(hura);
            OT.fx.burst('hearts', c.x, c.y, 12);
          }, 800);
        },
      };
    }
    function garland() {
      const cols = ['#F87171', '#FACC15', '#4ADE80', '#38BDF8', '#A78BFA', '#F472B6'];
      let m = '<path d="M0 6 Q300 46 600 6" fill="none" stroke="#7C3AED" stroke-width="3"/>';
      const n = 17;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const x = t * 600;
        const y = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 46 + t * t * 6;
        m += `<path d="M${x - 14} ${y - 2} L${x + 14} ${y - 2} L${x} ${y + 24}Z" fill="${cols[i % cols.length]}"/>`;
      }
      return m;
    }

    /* culoarea folosită cel mai des în desen (fără alb) */
    function mainColor() {
      const P = A.photo;
      const cnt = {};
      (P.rows || []).forEach((r) => {
        for (const ch of r) if (ch !== '.' && P.names[ch] && P.names[ch] !== 'alb') cnt[ch] = (cnt[ch] || 0) + 1;
      });
      const keys = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]);
      if (!keys.length) return '';
      return keys.length > 1 ? 'culorile ' + P.names[keys[0]] + ' și ' + P.names[keys[1]] : 'culoarea ' + P.names[keys[0]];
    }

    run();
  };

  /* ===================================================== DIPLOMELE */
  const THEMES = {
    artista: { c1: '#14B8A6', c2: '#99F6E4', soft: '#F0FDFA' },
    chitara: { c1: '#B45309', c2: '#FCD34D', soft: '#FFFBEB' },
  };
  const brush = '<path d="M70 10 L88 28 L44 72 L28 56Z" fill="#F59E0B"/><path d="M28 56 L44 72 Q34 92 10 90 Q8 66 28 56Z" fill="#7C3AED"/>';
  const SIDE = {
    artista: (i) => [brush, A.star('#FDE047', '#F59E0B'), A.heart('#F472B6')][i % 3],
    chitara: (i) => [A.note('#B45309'), A.note('#EC4899'), A.star('#FDE047', '#F59E0B')][i % 3],
  };

  function frame(t, side) {
    let m = `<rect width="297" height="210" fill="#FFFDF5"/>`;
    m += `<rect x="4" y="4" width="289" height="202" rx="7" fill="none" stroke="${t.c1}" stroke-width="4"/>`;
    m += `<rect x="9.5" y="9.5" width="278" height="191" rx="5" fill="none" stroke="${t.c2}" stroke-width="1.2" stroke-dasharray="3 2.2"/>`;
    [[12, 12], [285, 12], [12, 198], [285, 198]].forEach(([x, y]) => {
      m += `<path d="${A.starPath(x, y, 6.5, 3)}" fill="${t.c2}" stroke="${t.c1}" stroke-width="1" stroke-linejoin="round"/>`;
    });
    // ghirlandă de stegulețe
    const cols = ['#F87171', '#FACC15', '#4ADE80', '#38BDF8', '#A78BFA', '#F472B6'];
    m += `<path d="M30 9.5 Q148.5 19 267 9.5" fill="none" stroke="${t.c1}" stroke-width=".8"/>`;
    const n = 15;
    for (let i = 0; i < n; i++) {
      const tt = (i + 0.5) / n;
      const x = 30 + tt * 237;
      const y = (1 - tt) * (1 - tt) * 9.5 + 2 * (1 - tt) * tt * 19 + tt * tt * 9.5;
      m += `<path d="M${(x - 3.6).toFixed(1)} ${(y - 0.6).toFixed(1)} L${(x + 3.6).toFixed(1)} ${(y - 0.6).toFixed(1)} L${x.toFixed(1)} ${(y + 6).toFixed(1)}Z" fill="${cols[i % cols.length]}"/>`;
    }
    // iconițe pe margini
    [62, 105, 148].forEach((y, i) => {
      m += `<g transform="translate(11 ${y - 7}) scale(.14)">${side(i)}</g>`;
      m += `<g transform="translate(272 ${y - 7}) scale(.14)">${side(i + 1)}</g>`;
    });
    return m;
  }
  function seal(t) {
    let pts = '';
    const N = 28;
    for (let i = 0; i < N * 2; i++) {
      const r = i % 2 ? 46 : 54;
      const a = (Math.PI * i) / N - Math.PI / 2;
      pts += (60 + r * Math.cos(a)).toFixed(1) + ',' + (60 + r * Math.sin(a)).toFixed(1) + ' ';
    }
    return (
      `<path d="M40 86 L26 138 L44 128 L54 140 L60 96z" fill="${t.c1}"/><path d="M80 86 L94 138 L76 128 L66 140 L60 96z" fill="${t.c2}"/>` +
      `<polygon points="${pts}" fill="#FBBF24"/><circle cx="60" cy="60" r="42" fill="#FDE68A" stroke="#F59E0B" stroke-width="3"/>` +
      `<circle cx="60" cy="60" r="35" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3"/>` +
      A.phone(45, 32, 30, 54, `<path d="${A.starPath(13, 22, 9, 4)}" fill="#FACC15"/><path d="${A.starPath(8, 38, 4.5, 2)}" fill="#F472B6"/><path d="${A.starPath(19, 39, 4.5, 2)}" fill="#60A5FA"/>`)
    );
  }
  function scribble() {
    return OT.svg('0 0 120 30', '<path d="M4 22 q10 -22 18 -4 q6 12 12 -6 q4 -10 10 2 q6 14 14 -2 q6 -14 12 0 q4 8 10 -2 q6 -8 14 4 l20 -6" fill="none" stroke="#1D4ED8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>');
  }

  function diploma(o) {
    const t = THEMES[o.id];
    const d = h('section', { class: 'diploma dip-' + o.id, id: 'dip-' + o.id, 'aria-label': 'Diploma ' + o.name });
    d.appendChild(OT.svg('0 0 297 210', frame(t, SIDE[o.id]), { class: 'frame', preserveAspectRatio: 'none' }));
    const foot = h(
      'div',
      { class: 'dip-foot' },
      h('div', { class: 'sig-block' }, h('div', { class: 'sig-hand' }, 'Bunica'), h('div', { class: 'sig' }, 'Bunica')),
      h('div', { class: 'dip-date' }, today()),
      h('div', { class: 'sig-block' }, h('div', { class: 'sig-hand' }, scribble()), h('div', { class: 'sig' }, 'Primarul Orașului din Telefon'))
    );
    const art = h('div', { class: 'dip-art' }, ...o.art);
    const inn = h(
      'div',
      { class: 'dip-in' },
      h('div', { class: 'dip-kicker' }, 'ORAȘUL DIN TELEFON'),
      h('div', { class: 'dip-title' }, 'DIPLOMĂ'),
      h('div', { class: 'dip-give' }, o.give),
      h('div', { class: 'dip-name' }, o.name),
      h('div', { class: 'dip-role', style: { color: t.c1 } }, '„' + o.role + '”'),
      h('div', { class: 'dip-why' }, o.why),
      art,
      foot
    );
    d.appendChild(inn);
    d.appendChild(OT.svg('0 0 120 140', seal(t), { class: 'dip-seal' }));
    return d;
  }

  function badgesRow() {
    const badges = h('div', { class: 'dip-badges' });
    for (let i = 1; i <= OT.TOTAL; i++) {
      const b = bInfo(i);
      const s = A.badgeSVG(b.key, b.color, { 'aria-label': b.name });
      if (!OT.isDone(i)) s.classList.add('off');
      badges.appendChild(s);
    }
    return badges;
  }
  function diplomaArtista() {
    const drawing = OT.svg('0 0 16 16', A.photoSVG({ size: 16 }), { class: 'dip-drawing', 'shape-rendering': 'crispEdges' });
    return diploma({
      id: 'artista',
      give: 'Se acordă Beatricei',
      name: 'Beatrice',
      role: 'Inginera-șefă și artista Orașului din Telefon',
      why: 'pentru că a desenat un desen minunat și a urmărit cum călătorește prin telefon: pătrățele și numere, memorie, baterie, poștă, antenă, siguranță și muzică.',
      art: [A.make('beatrice', { class: 'dip-kid' }), drawing, badgesRow()],
    });
  }
  function diplomaChitara() {
    const song = !!OT.state.songSent;
    const learn = h(
      'div',
      { class: 'dip-learn' },
      h('div', {}, '🎸 Corzile tremură și fac aerul să tremure.'),
      h('div', {}, '🖐️ Apăsată pe taste, coarda e mai scurtă → nota e mai sus.'),
      h('div', {}, '📦 Cutia chitarei face sunetul mai puternic.'),
      h('div', {}, '🎙️ Microfonul face din sunet numere; 🔊 difuzorul le face iar sunet.')
    );
    return diploma({
      id: 'chitara',
      give: 'Se acordă Beatricei',
      name: 'Beatrice',
      role: 'Chitarista Orașului din Telefon',
      why: song
        ? 'pentru că a aflat cum cântă chitara și i-a trimis bunicii un cântec înregistrat la chitara ei adevărată.'
        : 'pentru că a aflat cum cântă chitara: din corzi, taste și cutia ei de lemn, până la microfon și difuzor.',
      art: [A.make('beatrice', { class: 'dip-kid' }), A.make('guitar', { class: 'dip-guitar' }), learn],
    });
  }

  OT.screens.diplomas = function (app, params, scope) {
    const root = h('div', { class: 'diplomas-screen' });
    A.useDrawing && A.useDrawing();
    const dips = { artista: diplomaArtista(), chitara: diplomaChitara() };
    const clear = () => Object.keys(dips).forEach((k) => dips[k].classList.remove('skip-print'));
    function doPrint(only) {
      OT.sfx('tap');
      Object.keys(dips).forEach((k) => dips[k].classList.toggle('skip-print', !!only && k !== only));
      try {
        window.print();
      } catch (e) {
        /* tipărirea nu e disponibilă */
      }
    }
    scope.on(window, 'afterprint', clear);
    scope.add(clear);

    const btn = (cls, long, short, fn) => {
      const b = h('button', { class: 'big-btn ' + cls }, h('span', { class: 'long' }, long), h('span', { class: 'short' }, short));
      b.addEventListener('click', fn);
      return b;
    };
    const bar = h(
      'div',
      { class: 'dip-bar' },
      btn('primary', '🖨️ Tipărește toate', '🖨️ Toate', () => doPrint(null)),
      btn('blue', 'Tipărește doar „Artista”', '🖨️ Artista', () => doPrint('artista')),
      btn('yellow', 'Tipărește doar „Chitarista”', '🖨️ Chitara', () => doPrint('chitara')),
      btn('', '🗺️ Harta', '🗺️ Harta', () => {
        OT.sfx('tap');
        OT.go('map');
      }),
      h('div', { class: 'dip-tip' }, 'Pentru părinți: la tipărire alegeți hârtie A4, așezare „Peisaj” (Landscape) și bifați „Grafică de fundal”.')
    );
    const list = h('div', { class: 'dip-list' }, dips.artista, dips.chitara);
    root.append(bar, list);
    app.appendChild(root);
  };
})();
