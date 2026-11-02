/* Orașul din Telefon — harta orașului (meniul principal)
   - clădirile se deblochează pe rând; orașul se luminează pe măsură ce Andrei câștigă insigne
   - surprize pentru Elena: soarele, norii, copacii, cățelul și pisica reacționează la atingere
   - borcanul cu steluțe al Mariei
*/
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;
  const A = OT.art;
  OT.temp = OT.temp || {};

  const ORDER = [1, 2, 3, 4, 5, 6, 7, 8];
  const MAPNAME = { 3: 'Masa și Dulapul' }; // nume mai scurte pe hartă

  function layout(portrait) {
    if (portrait) {
      return {
        W: 1000,
        H: 1600,
        s: 0.95,
        pos: { 1: [190, 560], 2: [500, 560], 3: [810, 560], 4: [810, 900], 5: [500, 900], 6: [190, 900], 7: [190, 1240], 8: [500, 1240] },
        road: 'M -60 610 H 860 Q 935 610 935 680 V 880 Q 935 950 860 950 H 140 Q 65 950 65 1020 V 1220 Q 65 1290 140 1290 H 1060',
        horizon: 330,
        sun: [140, 130],
        clouds: [[330, 70, 0.9], [620, 150, 0.7], [470, 260, 0.55]],
        gran: [820, 300, 0.62],
        jar: [810, 1235],
        cat: [900, 1500],
        trees: [[345, 545, 0.8], [655, 885, 0.75], [345, 1225, 0.8], [90, 1480, 0.9], [640, 1470, 0.85], [960, 760, 0.7]],
        lamps: [[345, 640], [655, 640], [935, 760], [655, 980], [345, 980], [65, 1100], [345, 1320], [655, 1320]],
        flowers: [[200, 1420], [260, 1450], [480, 1500], [760, 1390], [560, 1410]],
        pond: [330, 1500, 120, 40],
      };
    }
    return {
      W: 1600,
      H: 1000,
      s: 1.02,
      pos: { 1: [190, 430], 2: [530, 430], 3: [870, 430], 4: [1210, 430], 5: [1210, 830], 6: [870, 830], 7: [530, 830], 8: [190, 830] },
      road: 'M -60 472 H 1390 Q 1470 472 1470 552 V 790 Q 1470 870 1390 870 H -60',
      horizon: 270,
      sun: [120, 105],
      clouds: [[360, 50, 0.9], [760, 30, 0.75], [1060, 90, 0.6]],
      gran: [1470, 255, 0.6],
      jar: [1545, 690],
      cat: [1530, 985],
      trees: [[360, 420, 0.75], [700, 420, 0.7], [1040, 420, 0.72], [1370, 820, 0.7], [700, 820, 0.7], [360, 820, 0.72]],
      lamps: [[360, 520], [700, 520], [1040, 520], [1400, 640], [1040, 920], [700, 920], [360, 920], [40, 920]],
      flowers: [[1560, 470], [1520, 520], [40, 520], [80, 560]],
      pond: [1560, 880, 0, 0],
    };
  }

  function sunMarkup(x, y) {
    let rays = '';
    for (let i = 0; i < 12; i++) rays += `<rect x="-6" y="-92" width="12" height="28" rx="6" transform="rotate(${i * 30})"/>`;
    return (
      `<g class="sun-g tap-react" data-kind="sun" transform="translate(${x} ${y})">` +
      `<circle r="110" fill="#fff" opacity="0"/>` +
      `<g class="sun-rays" fill="#FACC15">${rays}</g><circle r="58" fill="#FDE047" stroke="#FACC15" stroke-width="6"/>` +
      `<g class="sun-face"><circle cx="-18" cy="-8" r="6" fill="#92400E"/><circle cx="18" cy="-8" r="6" fill="#92400E"/><path d="M-16 14 q16 12 32 0" stroke="#92400E" stroke-width="5" fill="none" stroke-linecap="round"/></g>` +
      `<g class="sun-face-happy"><path d="M-26 -6 q8 -10 16 0 M10 -6 q8 -10 16 0" stroke="#92400E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-24 8 q24 30 48 0z" fill="#fff" stroke="#92400E" stroke-width="4"/><circle cx="-34" cy="12" r="8" fill="#FB923C" opacity=".6"/><circle cx="34" cy="12" r="8" fill="#FB923C" opacity=".6"/></g>` +
      `</g>`
    );
  }

  OT.screens.map = function (app, params, scope) {
    const portrait = window.innerHeight > window.innerWidth * 1.05;
    const L = layout(portrait);
    const done = OT.doneCount();
    const all = OT.allDone();
    const dark = 0.42 * (1 - done / OT.TOTAL);
    const firstOpen = ORDER.find((i) => !OT.isDone(i) && OT.isUnlocked(i));
    const current = firstOpen || null;

    /* ---------- desenul hărții ---------- */
    let m = '';
    m += `<defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DD3FC"/><stop offset="1" stop-color="#E0F2FE"/></linearGradient>` +
      `<linearGradient id="nightG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1B4B"/><stop offset="1" stop-color="#6366F1"/></linearGradient></defs>`;
    // cer (cu margini mult în afară, ca să umple tot ecranul)
    m += `<rect x="-2000" y="-2000" width="${L.W + 4000}" height="${L.horizon + 2060}" fill="url(#skyG)"/>`;
    m += `<rect class="map-dark" x="-2000" y="-2000" width="${L.W + 4000}" height="${L.horizon + 2060}" fill="url(#nightG)" opacity="${(dark * 1.2).toFixed(2)}"/>`;
    // stele de noapte
    let nstars = '';
    for (let i = 0; i < 26; i++) {
      const x = (i * 397) % L.W;
      const y = 20 + ((i * 131) % (L.horizon - 60));
      nstars += `<circle cx="${x}" cy="${y}" r="${2 + (i % 3)}" fill="#fff"/>`;
    }
    m += `<g class="map-dark" opacity="${(dark * 1.8).toFixed(2)}">${nstars}</g>`;
    m += sunMarkup(L.sun[0], L.sun[1]);
    L.clouds.forEach(([x, y, s], i) => {
      m += `<g class="cloud-g tap-react" data-kind="cloud" data-i="${i}" style="animation-delay:-${i * 7}s">${A.cloud(x, y, s * 1.6)}</g>`;
    });
    // dealuri și iarbă
    m += `<path d="M-2000 ${L.horizon + 40} Q ${L.W * 0.2} ${L.horizon - 70} ${L.W * 0.45} ${L.horizon + 20} T ${L.W + 2000} ${L.horizon} V 3000 H -2000Z" fill="#86EFAC"/>`;
    m += `<rect x="-2000" y="${L.horizon + 30}" width="${L.W + 4000}" height="3000" fill="#6EE7A0"/>`;
    // casa bunicii, departe, pe un deal
    const [gx, gy, gs] = L.gran;
    m += `<g class="gran-g tap-react" data-kind="gran"><ellipse cx="${gx}" cy="${gy + 4}" rx="${150 * gs + 40}" ry="${36 * gs + 10}" fill="#4ADE80"/>` +
      `<g transform="translate(${gx - 130 * gs} ${gy - 232 * gs}) scale(${gs})"><g class="bld-art bld${all ? ' lit' : ''}">${A.buildings.bunica()}</g></g>` +
      `<g transform="translate(${gx} ${gy + 34})"><rect x="-92" y="-20" width="184" height="40" rx="20" fill="#fff" opacity=".92"/><text y="9" font-size="24" font-weight="900" text-anchor="middle" fill="#BE123C">Casa bunicii</text></g>` +
      (all ? `<g transform="translate(${gx} ${gy - 190 * gs})"><g class="pin"><g transform="translate(-34 -60) scale(.68)">${A.heart('#F43F5E')}</g></g></g>` : '') +
      `</g>`;
    if (OT.state.photoSent) {
      const p6 = L.pos[6];
      m += `<path d="M ${p6[0] + 25} ${p6[1] - 270} Q ${(p6[0] + gx) / 2} ${Math.min(p6[1], gy) - 300} ${gx - 40} ${gy - 120}" stroke="#fff" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round" fill="none" opacity=".9"/>`;
    }
    // drumul
    m += `<path d="${L.road}" stroke="#E9D7B5" stroke-width="82" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    m += `<path d="${L.road}" stroke="#F6EBD3" stroke-width="66" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    m += `<path d="${L.road}" stroke="#fff" stroke-width="6" stroke-dasharray="28 26" fill="none" opacity=".9"/>`;
    // iaz
    if (L.pond[2]) m += `<ellipse cx="${L.pond[0]}" cy="${L.pond[1]}" rx="${L.pond[2]}" ry="${L.pond[3]}" fill="#7DD3FC" stroke="#38BDF8" stroke-width="6"/><path d="M${L.pond[0] - 40} ${L.pond[1] - 6} q12 -8 24 0" stroke="#fff" stroke-width="4" fill="none"/>`;
    // flori
    L.flowers.forEach(([x, y], i) => {
      const c = ['#F472B6', '#FACC15', '#A78BFA', '#F87171', '#60A5FA'][i % 5];
      m += `<g class="flower tap-react" data-kind="flower"><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 26}" stroke="#16A34A" stroke-width="4"/>` +
        `<g transform="translate(${x} ${y})"><g class="fl-head">${[0, 72, 144, 216, 288].map((a) => `<circle cx="0" cy="-10" r="8" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="7" fill="#FDE047"/></g></g></g>`;
    });
    // întuneric peste pământ (orașul se luminează treptat)
    m += `<rect class="map-dark" x="-2000" y="${L.horizon - 80}" width="${L.W + 4000}" height="3000" fill="#0B1A3A" opacity="${dark.toFixed(2)}" pointer-events="none"/>`;
    // copaci
    L.trees.forEach(([x, y, s], i) => {
      m += `<g class="tree-g tap-react" data-kind="tree" data-i="${i}"><g class="tree-in" transform="translate(${x} ${y})"><g class="tree-shake">${A.tree(0, 0, s, ['#4ADE80', '#22C55E', '#86EFAC'][i % 3])}</g></g></g>`;
    });
    // felinare: se aprind pe rând
    L.lamps.forEach(([x, y], i) => {
      const on = i < done;
      m += `<g transform="translate(${x} ${y})"><circle class="lamp-light" cy="-74" r="34" fill="#FEF08A" opacity="${on ? 0.55 : 0}"/><rect x="-4" y="-70" width="8" height="70" fill="#475569"/><circle cy="-74" r="12" fill="${on ? '#FDE047' : '#94A3B8'}"/></g>`;
    });
    // clădirile
    ORDER.forEach((id) => {
      const b = OT.buildings[id];
      const [x, y] = L.pos[id];
      const key = b ? b.key : ['studio', 'fabrica', 'dulap', 'centrala', 'posta', 'aeroport', 'primaria', 'concert'][id - 1];
      const name = b ? MAPNAME[id] || b.name : 'Clădirea ' + id;
      const unlocked = OT.isUnlocked(id);
      const isDone = OT.isDone(id);
      const cls = ['bld-g', unlocked ? '' : 'locked', isDone ? 'lit' : '', id === current ? 'current' : '', params.justDone && id === params.justDone + 1 ? 'unlocking' : ''].join(' ');
      const s = L.s;
      const fs = portrait ? 27 : 25;
      const lw = Math.max(150, name.length * fs * 0.56 + 40);
      m += `<g class="${cls}" data-id="${id}" data-kind="bld">` +
        `<rect x="${x - 135 * s}" y="${y - 260 * s}" width="${270 * s}" height="${300 * s}" fill="#fff" opacity="0"/>` +
        `<g transform="translate(${x - 130 * s} ${y - 232 * s}) scale(${s})"><g class="bld-art bld">${A.buildings[key]()}</g></g>` +
        `<g class="bld-label" transform="translate(${x} ${y + 36})"><rect x="${-lw / 2}" y="-23" width="${lw}" height="46" rx="23" stroke="${b ? b.color : '#ccc'}" stroke-width="5"/>` +
        `<text y="${fs * 0.36}" font-size="${fs}" text-anchor="middle">${unlocked ? '' : '🔒 '}${name}</text></g>` +
        (isDone ? `<g transform="translate(${x + 78 * s} ${y - 250 * s}) scale(.5)">${A.badge(key, b ? b.color : '#fff')}</g>` : '') +
        (OT.state.stars[id] ? `<g transform="translate(${x - lw / 2 - 26} ${y + 14}) scale(.44)">${A.star()}</g>` : '') +
        (!unlocked ? `<g transform="translate(${x - 34} ${y - 170 * s}) scale(.68)">${A.lock('#CBD5E1')}</g>` : '') +
        (id === current ? `<g transform="translate(${x} ${y - (portrait ? 196 : 262) * s}) scale(${portrait ? 0.85 : 1})"><g class="pin"><path d="M-44 -64 h88 a14 14 0 0 1 14 14 v30 a14 14 0 0 1 -14 14 h-30 l-14 18 l-14 -18 h-30 a14 14 0 0 1 -14 -14 v-30 a14 14 0 0 1 14 -14z" fill="#F43F5E"/><text y="-23" font-size="30" font-weight="900" text-anchor="middle" fill="#fff">Aici!</text></g></g>` : '') +
        `</g>`;
    });
    // borcanul cu steluțe al Mariei (altă ediție își poate pune aici altceva: OT.cfg.mapExtra)
    const [jx, jy] = L.jar;
    if (OT.cfg.mapExtra) m += OT.cfg.mapExtra(jx, jy);
    else m += `<g class="jar-g tap-react" data-kind="jar" transform="translate(${jx} ${jy})"><g class="jar-in"><ellipse cx="0" cy="4" rx="58" ry="12" fill="#000" opacity=".12"/>` +
      `<g transform="translate(-55 -130) scale(.92)">${A.jar(OT.starCount())}</g>` +
      `<g transform="translate(0 30)"><rect x="-62" y="-18" width="124" height="36" rx="18" fill="#fff" stroke="#F472B6" stroke-width="4"/><text y="9" font-size="24" font-weight="900" text-anchor="middle" fill="#DB2777">⭐ ${OT.starCount()} / 8</text></g></g></g>`;
    // pisica
    const [cx, cy] = L.cat;
    m += `<g class="cat-g tap-react" data-kind="cat"><g transform="translate(${cx - 55} ${cy - 108}) scale(.55)"><g class="cat-body-g">${A.cat()}</g></g></g>`;
    // copiii + cățelul, lângă clădirea curentă
    function kidsPos(id) {
      if (!id) {
        const p = L.jar;
        return [p[0] - (portrait ? 230 : 160), p[1] + (portrait ? 70 : 140)];
      }
      const [x, y] = L.pos[id];
      const right = x + 178 < L.W - 40;
      return [right ? x + 172 : x - 172, y + 58];
    }
    const kp = kidsPos(current || (all ? null : 1));
    m += `<g class="kids-g" transform="translate(${kp[0]} ${kp[1]})">` + (OT.cfg.mapKids ? OT.cfg.mapKids() + '</g>' :
      `<g transform="translate(-86 -110) scale(.34)"><g class="kid">${A.andrei()}</g></g>` +
      `<g transform="translate(-36 -100) scale(.31)"><g class="kid">${A.maria()}</g></g>` +
      `<g transform="translate(2 -94) scale(.29)"><g class="kid">${A.elena()}</g></g>` +
      `<g class="dog-g tap-react" data-kind="dog" transform="translate(40 -62) scale(.3)">${A.dog()}</g></g>`);

    /* ---------- HTML ---------- */
    const root = h('div', { class: 'map' + (portrait ? ' portrait' : '') });
    const strip = h('div', { class: 'badges-strip' });
    ORDER.forEach((id) => {
      const b = OT.buildings[id];
      if (!b) return;
      strip.appendChild(OT.art.badgeSVG(b.key, b.color, { class: OT.isDone(id) ? 'got' : '' }));
    });
    const titleEl = h('div', { class: 'map-title' }, 'Orașul din Telefon', h('small', {}, all ? (OT.cfg.subDone || 'Poza a ajuns la bunica! 💌') : (OT.cfg.sub || 'Ajută poza cățelului să ajungă la bunica!')));
    const top = h('div', { class: 'map-top' }, titleEl, strip);
    const svg = OT.svg(`0 0 ${L.W} ${L.H}`, m, { class: 'map-svg', preserveAspectRatio: 'xMidYMid meet' });
    const screen = h('div', { class: 'map-screen' }, svg);
    const phone = h('div', { class: 'map-phone' }, screen);

    let elenaBtn;
    if (OT.cfg.mapButton) elenaBtn = OT.cfg.mapButton();
    else {
      elenaBtn = h('button', { class: 'elena-btn', 'aria-label': 'Joaca Elenei' });
      elenaBtn.appendChild(OT.art.make('bunny'));
      elenaBtn.appendChild(h('span', {}, 'Joaca Elenei'));
      elenaBtn.addEventListener('click', () => {
        OT.sfx('boing');
        OT.go('elena');
      });
    }
    const right = h('div', { class: 'small-btns' });
    const storyBtn = h('button', { class: 'icon-btn', 'aria-label': 'Povestea', title: 'Povestea de la început' }, '📖');
    storyBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('lesson', { id: 0 });
    });
    const gear = h('button', { class: 'icon-btn', 'aria-label': 'Pentru părinți', title: 'Pentru părinți' }, '⚙️');
    gear.addEventListener('click', () => parentsDialog(scope));
    right.append(storyBtn, gear);
    const mid = h('div', { class: 'mid-btns' });
    if (all) {
      const fin = h('button', { class: 'big-btn final-btn' }, '💌 Mesaj de la bunica');
      fin.addEventListener('click', () => {
        OT.sfx('ding');
        OT.go('final');
      });
      mid.appendChild(fin);
    }
    if (OT.state.finalSeen) {
      const dip = h('button', { class: 'big-btn yellow' }, '📜 Diplome');
      dip.addEventListener('click', () => {
        OT.sfx('tap');
        OT.go('diplomas');
      });
      mid.appendChild(dip);
    }
    const bottom = h('div', { class: 'map-bottom' }, elenaBtn, mid, right);
    root.append(top, phone, bottom);
    app.appendChild(root);
    // etichetele se potrivesc după lățimea reală a textului
    svg.querySelectorAll('.bld-label').forEach((g) => {
      const t = g.querySelector('text');
      const r = g.querySelector('rect');
      try {
        const w = t.getBBox().width + 34;
        r.setAttribute('x', (-w / 2).toFixed(1));
        r.setAttribute('width', w.toFixed(1));
      } catch (e) {}
    });

    /* ---------- atingeri ---------- */
    let candyBusy = 0;
    svg.addEventListener('click', (e) => {
      const g = e.target.closest && e.target.closest('[data-kind]');
      if (!g) return;
      const kind = g.dataset.kind;
      const c = OT.center(g);
      if (OT.cfg.mapTap && OT.cfg.mapTap(kind, g, c, scope)) return;
      if (kind === 'bld') {
        const id = +g.dataset.id;
        if (!OT.buildings[id]) return;
        if (!OT.isUnlocked(id)) {
          OT.sfx('hmm');
          g.classList.remove('shake');
          void g.getBoundingClientRect();
          g.classList.add('shake');
          const prev = OT.buildings[id - 1];
          OT.toast('🔒 Mai întâi: ' + (prev ? prev.name : 'clădirea de dinainte'), { speak: 'Clădirea e încă încuiată. Mai întâi termină ' + (prev ? prev.name : 'clădirea de dinainte') + '.' });
          return;
        }
        OT.sfx('tap');
        if (id === 8 && OT.isDone(8)) OT.go(OT.cfg.room8 || 'piano');
        else OT.go('lesson', { id });
      } else if (kind === 'sun') {
        g.classList.add('happy');
        OT.sfx('sun');
        OT.fx.burst('sparkles', c.x, c.y, 14, { spread: 200 });
        scope.timeout(() => g.classList.remove('happy'), 3500);
      } else if (kind === 'cloud') {
        if (Date.now() - candyBusy < 1200) return;
        candyBusy = Date.now();
        OT.sfx('candy');
        const r = g.getBoundingClientRect();
        OT.fx.rain('candy', 14, { x0: r.left + r.width * 0.15, x1: r.right - r.width * 0.15, y0: r.top + r.height * 0.6, ms: 1400, size: 34, fallMs: 2400 });
        OT.anim(g, [{ opacity: 1 }, { opacity: 0.7 }, { opacity: 1 }], { duration: 1400 });
      } else if (kind === 'tree') {
        const t = g.querySelector('.tree-shake');
        t.classList.remove('wiggle');
        void t.getBoundingClientRect();
        t.classList.add('wiggle');
        t.style.transformBox = 'fill-box';
        t.style.transformOrigin = '50% 100%';
        OT.sfx('rustle');
        OT.fx.burst('confetti', c.x, c.y - 20, 12, { spread: 120, size: 16 });
      } else if (kind === 'dog') {
        g.classList.remove('wag');
        void g.getBoundingClientRect();
        g.classList.add('wag');
        OT.sfx('woof');
        OT.fx.burst('hearts', c.x, c.y, 6, { size: 30, spread: 90 });
      } else if (kind === 'cat') {
        g.classList.add('purr');
        OT.sfx('purr');
        OT.fx.burst('hearts', c.x, c.y - 20, 5, { size: 26, spread: 80 });
        scope.timeout(() => {
          OT.sfx('meow');
          g.classList.remove('purr');
        }, 1900);
      } else if (kind === 'flower') {
        const f = g.querySelector('.fl-head');
        OT.anim(f, [{ transform: 'scale(1)' }, { transform: 'scale(1.8) rotate(40deg)' }, { transform: 'scale(1)' }], { duration: 900, easing: 'ease-out' });
        OT.sfx('bubble');
        OT.fx.burst('sparkles', c.x, c.y, 6, { size: 22, spread: 70 });
      } else if (kind === 'jar') {
        const n = OT.starCount();
        g.classList.remove('bump');
        void g.getBoundingClientRect();
        g.classList.add('bump');
        OT.sfx('star');
        OT.fx.burst('stars', c.x, c.y - 30, Math.max(3, n * 2), { size: 30, spread: 120 });
        OT.speak(n === 0 ? 'Acesta e borcanul Mariei. Caută fundița roz în fiecare clădire, ca să câștigi steluțe!' : n === 1 ? 'Maria are o steluță în borcan! Bravo, Maria!' : `Maria are ${n} steluțe în borcan! Bravo, Maria!`);
      } else if (kind === 'gran') {
        if (all) {
          OT.sfx('ding');
          OT.go('final');
        } else {
          OT.sfx('tap');
          OT.toast('🏡 Aici locuiește bunica. Ajută poza să ajungă la ea!', { speak: true });
        }
      }
    });

    /* ---------- animații la intrare ---------- */
    if (params.justDone) {
      const nb = OT.buildings[params.justDone + 1];
      scope.timeout(() => {
        if (nb) {
          OT.sfx('unlock');
          const g = svg.querySelector(`[data-id="${nb.id}"]`);
          if (g) OT.fx.at(g, 'sparkles', 16, { spread: 160 });
          OT.toast('🔓 S-a deschis: <b>' + nb.name + '</b>!', { speak: 'S-a deschis o clădire nouă: ' + nb.name + '!' });
        } else if (all) {
          OT.sfx('fanfare');
          OT.fx.confetti(120);
          OT.toast('💌 Ai toate insignele! Bunica ți-a trimis un mesaj!', { speak: 'Ai toate insignele! Bunica ți-a trimis un mesaj! Apasă pe inimioară.', ms: 5000 });
        }
      }, 700);
      // copiii merg la clădirea nouă
      const kg = svg.querySelector('.kids-g');
      const from = kidsPos(params.justDone);
      const to = kp;
      kg.setAttribute('transform', `translate(${from[0]} ${from[1]})`);
      scope.timeout(() => {
        scope.tween(2200, (p) => {
          const x = OT.lerp(from[0], to[0], p);
          const y = OT.lerp(from[1], to[1], p) - Math.abs(Math.sin(p * Math.PI * 6)) * 12;
          kg.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        });
      }, 900);
    } else if (!OT.state.mapHintSaid && current === 1) {
      OT.state.mapHintSaid = true;
      OT.save();
      scope.timeout(() => OT.speak('Apasă pe Studioul foto ca să începi călătoria!'), 600);
    }
    // easter egg: orașul dansează / cad steluțe
    const now = Date.now();
    if (OT.temp.danceUntil > now) {
      root.classList.add('dancing');
      scope.timeout(() => root.classList.remove('dancing'), OT.temp.danceUntil - now);
    }
    if (OT.temp.starsUntil > now) {
      OT.fx.rain('stars', 30, { ms: Math.min(8000, OT.temp.starsUntil - now), size: 26, fallMs: 6000 });
    }
    // la rotirea ecranului (telefon/tabletă), harta se redesenează
    let rt = 0;
    scope.on(window, 'resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const p = window.innerHeight > window.innerWidth * 1.05;
        if (p !== portrait && OT.current().name === 'map') OT.go('map');
      }, 250);
    });
  };

  /* ---------- fereastra pentru părinți ---------- */
  function parentsDialog(scope) {
    OT.sfx('tap');
    const back = h('div', { class: 'dialog-back' });
    const d = h('div', { class: 'dialog', role: 'dialog' });
    const row = (label, btn) => h('div', { class: 'row' }, h('span', {}, label), btn);
    const tog = (on, a, b) => h('button', { class: 'big-btn toggle' + (on ? ' on' : '') }, on ? a : b);
    const snd = tog(OT.state.settings.sound, 'Pornit', 'Oprit');
    snd.addEventListener('click', () => {
      OT.audio.setSound(!OT.state.settings.sound);
      snd.textContent = OT.state.settings.sound ? 'Pornit' : 'Oprit';
      snd.classList.toggle('on', OT.state.settings.sound);
      OT.sfx('tap');
    });
    const voice = tog(OT.state.settings.voice, 'Pornită', 'Oprită');
    voice.addEventListener('click', () => {
      OT.state.settings.voice = !OT.state.settings.voice;
      OT.save();
      voice.textContent = OT.state.settings.voice ? 'Pornită' : 'Oprită';
      voice.classList.toggle('on', OT.state.settings.voice);
      if (OT.state.settings.voice) OT.speak('Bună! Eu citesc cerințele pentru Maria.');
    });
    const unlock = tog(OT.state.unlockAll, 'Da', 'Nu');
    unlock.addEventListener('click', () => {
      OT.state.unlockAll = !OT.state.unlockAll;
      OT.save();
      unlock.textContent = OT.state.unlockAll ? 'Da' : 'Nu';
      unlock.classList.toggle('on', OT.state.unlockAll);
    });
    const dip = h('button', { class: 'big-btn' }, 'Deschide');
    dip.addEventListener('click', () => {
      back.remove();
      OT.go('diplomas');
    });
    const reset = h('button', { class: 'big-btn danger' }, 'Șterge');
    let armed = false;
    reset.addEventListener('click', () => {
      if (!armed) {
        armed = true;
        reset.textContent = 'Sigur? Apasă iar';
        return;
      }
      OT.resetProgress();
      back.remove();
      OT.go('lesson', { id: 0 });
    });
    const roVoice = OT.speech.hasRomanian();
    d.append(
      h('h2', {}, '⚙️ Pentru părinți'),
      row('🔊 Sunete', snd),
      row('🗣️ Vocea care citește', voice),
      row('🔓 Toate clădirile deschise', unlock),
      row('📜 Diplomele (de tipărit)', dip),
      row('🗑️ Șterge progresul', reset),
      h('p', {}, roVoice ? '✅ Am găsit o voce în limba română pe acest dispozitiv.' : '⚠️ Pe acest dispozitiv nu am găsit o voce în limba română, așa că citirea poate suna ciudat. Pe iPhone/iPad: Setări → Accesibilitate → Conținut vorbit → Voci → Română. Pe Android: Setări → Text în vorbire → limba română.'),
      h('p', {}, '🎙️ Înregistrarea la pian (în Sala de concerte) folosește microfonul doar dacă dați voie. Înregistrarea rămâne doar pe acest dispozitiv.'),
      h('p', {}, '📱 Pe iPhone, dacă nu se aude nimic, verificați butonul de „silențios” de pe marginea telefonului.'),
      h('p', {}, OT.cfg.parentsNote || '🐰 Joaca Elenei se închide ținând apăsat butonul mic ✕ din colțul din dreapta-sus.'),
      h('div', { class: 'close-row' }, h('button', { class: 'big-btn primary', onclick: () => back.remove() }, 'Gata'))
    );
    back.appendChild(d);
    back.addEventListener('click', (e) => {
      if (e.target === back) back.remove();
    });
    document.body.appendChild(back);
    scope.add(() => back.remove());
  }
})();
