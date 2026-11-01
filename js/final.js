/* Orașul din Telefon — FINALUL (bunica răspunde + petrecerea familiei) și DIPLOMELE printabile
   OT.go('final')     -> telefonul bunicii, mesajele, petrecerea
   OT.go('diplomas')  -> cele trei diplome (A4 culcat, una pe pagină la tipărire)
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
    { key: 'concert', name: 'Sala de concerte', color: '#8B5CF6' },
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
    const stars = OT.starCount();

    const root = h('div', { class: 'final' });
    const mapTop = h('button', { class: 'icon-btn', 'aria-label': 'Harta orașului', title: 'Harta orașului' }, '🗺️');
    const top = h('div', { class: 'final-top' }, mapTop, h('h1', {}, 'Bunica a răspuns! 💌'), h('span', { class: 'ft-spacer' }));

    /* telefonul bunicii */
    const status = h('div', { class: 'gh-status' }, 'online');
    const head = h('div', { class: 'gran-head' }, A.head('bunica'), h('div', {}, h('div', { class: 'gh-name' }, 'Bunica ❤️'), status));
    const msgs = h('div', { class: 'gran-msgs' });
    const phone = h('div', { class: 'gran-phone' }, h('div', { class: 'gran-screen' }, head, msgs));

    const party = buildParty();
    const main = h('div', { class: 'final-main' }, phone, party.el);

    const dipBtn = h('button', { class: 'big-btn pink' }, '📜 Diplomele');
    const mapBtn = h('button', { class: 'big-btn' }, '🗺️ Harta');
    const actions = h('div', { class: 'final-actions' }, dipBtn, mapBtn);
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

    function addMsg(cls, ...kids) {
      const m = h('div', { class: 'msg ' + cls }, ...kids);
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
      return m;
    }
    const ticks = () => h('span', { class: 'ticks' }, '✓✓');

    /* cântecul lui Andrei (dacă a fost trimis) */
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
      // 1) poza trimisă de Andrei
      const thumb = OT.svg('0 0 16 16', A.photoSVG({ size: 16 }), { class: 'thumb', 'shape-rendering': 'crispEdges' });
      addMsg('me photo', thumb, h('div', { class: 'cap' }, 'Uite cățelul nostru! 🐶', ticks()));
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
        const lbl = h('div', {}, h('div', {}, '🎹 Cântecul lui Andrei'));
        // durata e salvată în milisecunde (vezi js/piano.js)
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
      const lines = ['Dragul meu Andrei! 🥰', 'Am primit poza cu cățelul — e minunată! Am pus-o pe ecranul telefonului meu. 🐶'];
      if (song) lines.push('Și am ascultat cântecul tău la pian de două ori! Cânți atât de frumos… sunt tare mândră de tine! 🎹');
      let kiss = 'Pupici multe pentru Maria';
      if (stars === 1) kiss += ' și pentru steluța ei ⭐';
      else if (stars > 1) kiss += ' și pentru cele ' + (stars <= 10 ? FEM[stars] : stars + (needsDe(stars) ? ' de' : '')) + ' steluțe ale ei ⭐';
      kiss += ', și pentru micuța Elena și iepurașul ei! 🐰';
      lines.push(kiss);
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
        { name: 'dog', left: 0, w: 23, sfx: 'woof', fx: 'hearts', label: 'Cățelul' },
        { name: 'andrei', left: 16, w: 21, sfx: 'boing', fx: 'stars', label: 'Andrei' },
        { name: 'bunica', left: 32, w: 21, sfx: 'giggle', fx: 'hearts', label: 'Bunica' },
        { name: 'maria', left: 48, w: 20, sfx: 'star', fx: 'stars', label: 'Maria' },
        { name: 'elena', left: 63, w: 19, sfx: 'giggle', fx: 'bubbles', label: 'Elena' },
        { name: 'cat', left: 81, w: 18, sfx: 'meow', fx: 'hearts', label: 'Pisica' },
      ];
      chars.forEach((c, i) => {
        const wrap = h('button', { class: 'p-char p-' + c.name, 'aria-label': c.label });
        wrap.style.left = c.left + '%';
        wrap.style.width = c.w + '%';
        const svg = A.make(c.name, { class: 'p-svg' });
        svg.style.animationDelay = (i * 0.11).toFixed(2) + 's';
        wrap.appendChild(svg);
        wrap.addEventListener('click', () => {
          OT.sfx(c.sfx);
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
          [0.2, 0.5, 0.8].forEach((p, k) => scope.timeout(() => OT.fx.burst('balloons', r.left + r.width * p, r.bottom - 30, 4), 300 + k * 450));
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

    run();
  };

  /* ===================================================== DIPLOMELE */
  const THEMES = {
    andrei: { c1: '#3B82F6', c2: '#93C5FD', soft: '#EFF6FF' },
    maria: { c1: '#EC4899', c2: '#F9A8D4', soft: '#FDF2F8' },
    elena: { c1: '#F59E0B', c2: '#FDE68A', soft: '#FFFBEB' },
  };
  const SIDE = {
    andrei: (i) => [A.gear(50, 50, 30, '#3B82F6', 8).replace('class="gear-spin"', ''), A.note('#3B82F6'), A.bolt('#93C5FD')][i % 3],
    maria: (i) => [A.star('#FBCFE8', '#EC4899'), A.star('#FDE047', '#F59E0B'), A.bow()][i % 3],
    elena: (i) => [A.heart('#F43F5E'), A.balloon('#FBBF24'), A.heart('#F472B6')][i % 3],
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

  function diplomaAndrei() {
    const badges = h('div', { class: 'dip-badges' });
    for (let i = 1; i <= OT.TOTAL; i++) {
      const b = bInfo(i);
      const s = A.badgeSVG(b.key, b.color, { 'aria-label': b.name });
      if (!OT.isDone(i)) s.classList.add('off');
      badges.appendChild(s);
    }
    return diploma({
      id: 'andrei',
      give: 'Se acordă lui',
      name: 'Andrei',
      role: 'Inginer-șef al Orașului din Telefon',
      why: 'pentru că a descoperit cum călătorește o poză prin telefon: pătrățele și numere, memorie și baterie, poștă și antenă, siguranță și muzică.',
      art: [A.make('andrei', { class: 'dip-kid' }), badges],
    });
  }
  function diplomaMaria() {
    const n = OT.starCount();
    const jar = OT.svg('0 0 120 140', A.jar(n), { class: 'dip-jar' });
    return diploma({
      id: 'maria',
      give: 'Se acordă Mariei',
      name: 'Maria',
      role: 'Vânătoarea de steluțe a orașului',
      why: n > 0
        ? 'pentru că a găsit fundițele roz, a rezolvat misiunile și a adunat ' + starsCount(n) + ' în borcanul orașului.'
        : 'pentru că pornește cu curaj la vânătoarea de steluțe ascunse în orașul din telefon.',
      art: [A.make('maria', { class: 'dip-kid' }), jar, OT.svg('0 0 100 100', A.star(), { class: 'dip-small' })],
    });
  }
  function diplomaElena() {
    const n = OT.bunnyCount();
    let why = 'pentru că a umplut orașul de zâmbete, inimioare, baloane și bule de săpun.';
    if (n === 1) why += ' Și-a găsit iepurașul într-o clădire!';
    else if (n > 1) why += ' Și-a găsit iepurașul în ' + (n <= 10 ? FEM[n] : n + (needsDe(n) ? ' de' : '')) + ' clădiri!';
    return diploma({
      id: 'elena',
      give: 'Se acordă Elenei',
      name: 'Elena',
      role: 'Mascota orașului',
      why,
      art: [A.make('elena', { class: 'dip-kid' }), A.make('bunny', { class: 'dip-bunny' }), OT.svg('0 0 100 100', A.heart('#F472B6'), { class: 'dip-small' })],
    });
  }

  OT.screens.diplomas = function (app, params, scope) {
    const root = h('div', { class: 'diplomas-screen' });
    const dips = { andrei: diplomaAndrei(), maria: diplomaMaria(), elena: diplomaElena() };
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
      btn('blue', 'Tipărește doar Andrei', '🖨️ Andrei', () => doPrint('andrei')),
      btn('pink', 'Tipărește doar Maria', '🖨️ Maria', () => doPrint('maria')),
      btn('yellow', 'Tipărește doar Elena', '🖨️ Elena', () => doPrint('elena')),
      btn('', '🗺️ Harta', '🗺️ Harta', () => {
        OT.sfx('tap');
        OT.go('map');
      }),
      h('div', { class: 'dip-tip' }, 'Pentru părinți: la tipărire alegeți hârtie A4, așezare „Peisaj” (Landscape) și bifați „Grafică de fundal”.')
    );
    const list = h('div', { class: 'dip-list' }, dips.andrei, dips.maria, dips.elena);
    root.append(bar, list);
    app.appendChild(root);
  };
})();
