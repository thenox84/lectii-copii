/* Clădirea 2 — Fabrica de numere (procesorul) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;
  const P = A.photo;
  const INK = '#2B2D42';

  document.head.appendChild(
    h('style', {
      text:
        '.b2-arm{transform-box:fill-box}' +
        '.b2-arm-l{transform-origin:100% 50%;animation:b2arm .22s ease-in-out infinite alternate}' +
        '.b2-arm-r{transform-origin:0% 50%;animation:b2arm .22s ease-in-out infinite alternate-reverse}' +
        '@keyframes b2arm{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}' +
        '.b2-blink{animation:b2blink .5s steps(2) infinite}.b2-d2{animation-delay:.15s}.b2-d3{animation-delay:.3s}' +
        '@keyframes b2blink{50%{opacity:.25}}' +
        '.b2-px{cursor:pointer}.b2-px text{pointer-events:none}' +
        '.b2-pal .sw{color:#fff;font-weight:900;font-size:22px;text-shadow:0 1px 2px rgba(0,0,0,.45)}' +
        '.b2-tap{min-width:200px;font-size:clamp(22px,2.6vw,32px)!important;background:#F97316!important;color:#fff!important}' +
        '.b2-tap.off{opacity:.5}' +
        '@media (max-width:600px),(max-height:540px){.b2-pal .pal-name{display:none}.b2-pal .pal-btn{padding:6px}}' +
        '@media (max-width:600px) and (orientation:portrait){.stage.st-col.b2-safe{padding-bottom:52px}}',
    })
  );

  /* numere scrise ca în română: 10.000.000.000 */
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const ori = (n) => (n === 1 ? 'o dată' : 'de ' + n + (n % 100 >= 20 || (n % 100 === 0 && n > 0) ? ' de ori' : ' ori'));

  /* muncitorul super-rapid al fabricii (originea între umeri; capul sus la -142, tălpile la 122) */
  function worker() {
    return (
      '<g class="b2-worker">' +
      '<rect x="-34" y="70" width="22" height="44" rx="8" fill="#1E3A8A"/><rect x="12" y="70" width="22" height="44" rx="8" fill="#1E3A8A"/>' +
      '<rect x="-42" y="108" width="34" height="14" rx="7" fill="#374151"/><rect x="8" y="108" width="34" height="14" rx="7" fill="#374151"/>' +
      '<g class="b2-arm b2-arm-l"><rect x="-92" y="-6" width="56" height="16" rx="8" fill="#94A3B8"/><circle cx="-94" cy="2" r="12" fill="#F59E0B"/></g>' +
      '<g class="b2-arm b2-arm-r"><rect x="36" y="-6" width="56" height="16" rx="8" fill="#94A3B8"/><circle cx="94" cy="2" r="12" fill="#F59E0B"/></g>' +
      '<rect x="-44" y="-20" width="88" height="96" rx="22" fill="#3B82F6"/>' +
      '<rect x="-26" y="0" width="52" height="34" rx="8" fill="#DBEAFE"/>' +
      '<circle class="b2-blink" cx="-13" cy="17" r="6" fill="#22C55E"/><circle class="b2-blink b2-d2" cx="0" cy="17" r="6" fill="#FACC15"/><circle class="b2-blink b2-d3" cx="13" cy="17" r="6" fill="#EF4444"/>' +
      '<rect x="-10" y="-34" width="20" height="16" fill="#94A3B8"/>' +
      '<rect x="-46" y="-104" width="92" height="74" rx="24" fill="#CBD5E1"/>' +
      '<rect x="-34" y="-92" width="68" height="46" rx="16" fill="#1E293B"/>' +
      '<ellipse cx="-14" cy="-72" rx="7" ry="9" fill="#67E8F9"/><ellipse cx="14" cy="-72" rx="7" ry="9" fill="#67E8F9"/>' +
      '<path d="M-12 -58 q12 9 24 0" stroke="#67E8F9" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M-50 -100 q0 -40 50 -42 q50 2 50 42z" fill="#FACC15"/><rect x="-58" y="-104" width="116" height="10" rx="5" fill="#EAB308"/>' +
      '</g>'
    );
  }
  const revGear = (m, dur) => m.replace('class="gear-spin"', `class="gear-spin" style="animation-direction:reverse;animation-duration:${dur || 5}s"`);
  const ORDER = ['.', 'b', 'd', 'w', 'k', 'p', 'r', 'g'];

  OT.registerBuilding({
    id: 2,
    key: 'fabrica',
    name: 'Fabrica de numere',
    color: '#F59E0B',
    dark: '#7C2D12',
    learned: 'Telefonul transformă fiecare culoare într-un număr — și lucrează foarte, foarte repede.',
    bow: { top: '3%', left: '2%' },
    bunny: 'right',
    mission: {
      type: 'match',
      say: 'Maria, ajută fabrica! Trage fiecare pătrățel colorat în căsuța de aceeași culoare.',
      colors: ['#EF4444', '#3B82F6', '#FACC15', '#22C55E'],
      answer: 'Toate pătrățelele sunt la locul lor!',
    },
    steps: [
      /* 1. Fabrica și muncitorul super-rapid */
      {
        text: 'Bine ai venit la <b>Fabrica de numere</b>! Aici lucrează un muncitor foarte, foarte rapid. El face toate socotelile telefonului.',
        adult: 'procesorul',
        render(ctx) {
          let belt = '';
          for (let i = 0; i < 6; i++)
            belt += `<g class="b2-crate"><rect x="-23" y="-23" width="46" height="46" rx="8" fill="#FDBA74" stroke="#C2410C" stroke-width="3"/><text y="11" font-size="28" font-weight="900" text-anchor="middle" fill="#7C2D12">${(i * 7 + 3) % 10}</text></g>`;
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#FFEDD5"/><rect y="372" width="800" height="78" fill="#D6D3D1"/><rect y="368" width="800" height="8" fill="#A8A29E"/>' +
              A.gear(110, 130, 58, '#FDBA74', 10) +
              revGear(A.gear(205, 70, 34, '#FB923C', 8), 4) +
              revGear(A.gear(690, 120, 48, '#FDBA74', 9), 6) +
              '<rect x="300" y="10" width="200" height="56" rx="14" fill="#1E293B" stroke="#F59E0B" stroke-width="5"/>' +
              '<text class="b2-display" x="400" y="50" font-size="32" font-weight="900" text-anchor="middle" fill="#4ADE80" font-family="ui-monospace,Menlo,Consolas,monospace">10735</text>' +
              `<g transform="translate(400 210) scale(.88)">${worker()}</g>` +
              '<rect x="40" y="318" width="720" height="34" rx="17" fill="#475569"/>' +
              Array.from({ length: 12 }, (_, i) => `<circle cx="${70 + i * 60}" cy="335" r="9" fill="#94A3B8"/>`).join('') +
              '<path class="dash-move" d="M58 321 H742" stroke="#CBD5E1" stroke-width="5"/>' +
              `<svg x="40" y="0" width="720" height="450" viewBox="40 0 720 450"><g class="b2-belt">${belt}</g></svg>`
          );
          const crates = Array.from(svg.querySelectorAll('.b2-crate'));
          const disp = svg.querySelector('.b2-display');
          ctx.interval(() => {
            disp.textContent = String(OT.randInt(10000, 99999));
          }, 140);
          const t0 = performance.now();
          ctx.raf((t) => {
            const off = ((t - t0) / 1000) * 50;
            crates.forEach((c, i) => {
              const x = ((off + i * 150) % 900) + 10;
              c.setAttribute('transform', `translate(${x.toFixed(1)} 292)`);
            });
          });
        },
      },
      /* 2. Culorile intră în mașină, ies numere */
      {
        text: 'Telefonul nu vede culori. El știe doar <b>numere</b>! Așa că fiecare culoare primește numărul ei.',
        adult: 'cod numeric pentru fiecare culoare',
        render(ctx) {
          let legend = '';
          ORDER.forEach((k, i) => {
            const x = 34 + i * 94;
            legend += `<rect x="${x}" y="24" width="42" height="42" rx="9" fill="${P.palette[k]}" stroke="#CBD5E1" stroke-width="2"/><text x="${x + 50}" y="55" font-size="26" font-weight="900" fill="${INK}">= ${P.numbers[k]}</text>`;
          });
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#FFF7ED"/><rect x="18" y="12" width="764" height="66" rx="16" fill="#fff" stroke="#FDBA74" stroke-width="3"/>' +
              legend +
              '<rect y="300" width="800" height="34" fill="#475569"/><path class="dash-move" d="M0 303 H800" stroke="#CBD5E1" stroke-width="5"/>' +
              '<svg x="0" y="0" width="800" height="450" viewBox="0 0 800 450"><g class="b2-items"></g></svg>' +
              '<path d="M300 236 h-26 v64 h26z M500 236 h26 v64 h-26z" fill="#B45309"/>' +
              '<rect x="300" y="140" width="200" height="190" rx="24" fill="#F59E0B" stroke="#B45309" stroke-width="6"/>' +
              A.gear(400, 222, 42, '#B45309', 9) +
              '<rect x="282" y="100" width="236" height="48" rx="12" fill="#fff" stroke="#B45309" stroke-width="4"/>' +
              `<text x="400" y="134" font-size="22" font-weight="900" text-anchor="middle" fill="#7C2D12">culoare → număr</text>` +
              '<text x="150" y="390" font-size="24" font-weight="900" text-anchor="middle" fill="#9A3412">intră culori</text>' +
              '<text x="650" y="390" font-size="24" font-weight="900" text-anchor="middle" fill="#9A3412">ies numere</text>'
          );
          const layer = svg.querySelector('.b2-items');
          const items = [];
          let ci = 0;
          function spawn() {
            const k = ORDER[ci++ % ORDER.length];
            const g = OT.s('g');
            g.innerHTML =
              `<rect x="-26" y="-26" width="52" height="52" rx="9" fill="${P.palette[k]}" stroke="#fff" stroke-width="3"/>` +
              `<text y="11" font-size="32" font-weight="900" text-anchor="middle" fill="${INK}" opacity="0">${P.numbers[k]}</text>`;
            layer.appendChild(g);
            items.push({ x: -40, g, out: false });
          }
          spawn();
          ctx.interval(spawn, 1700);
          let last = performance.now();
          ctx.raf((t) => {
            const dt = Math.min(0.1, (t - last) / 1000);
            last = t;
            for (let i = items.length - 1; i >= 0; i--) {
              const it = items[i];
              it.x += dt * 85;
              it.g.setAttribute('transform', `translate(${it.x.toFixed(1)} 274)`);
              if (!it.out && it.x > 520) {
                it.out = true;
                const r = it.g.querySelector('rect');
                r.setAttribute('fill', '#fff');
                r.setAttribute('stroke', '#94A3B8');
                it.g.querySelector('text').setAttribute('opacity', '1');
              }
              if (it.x > 850) {
                it.g.remove();
                items.splice(i, 1);
              }
            }
          });
        },
      },
      /* 3. Poza cățelului devine un tabel de numere */
      {
        text: 'Uite poza cățelului! Telefonul o ține minte ca pe un joc „colorează după numere”. Apasă pe „Arată numerele”!',
        adult: 'date digitale',
        wait: true,
        hint: 'Apasă pe butonul „Arată numerele”!',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b2-safe');
          const N = 16;
          const c = 28;
          let m = '<rect width="640" height="460" fill="#FFF7ED"/><g transform="translate(8 6)">';
          for (let r = 0; r < N; r++)
            for (let k = 0; k < N; k++) {
              const ch = P.rows[r][k];
              m += `<g class="b2-c" data-d="${r + k}" data-ch="${ch}"><rect x="${k * c}" y="${r * c}" width="${c - 1}" height="${c - 1}" rx="2" fill="${P.palette[ch]}" stroke="${P.palette[ch]}" stroke-width="1"/>` +
                `<text x="${k * c + c / 2}" y="${r * c + c * 0.72}" font-size="17" font-weight="800" text-anchor="middle" fill="${INK}" opacity="0">${P.numbers[ch]}</text></g>`;
            }
          m += '</g>';
          ORDER.forEach((k, i) => {
            const y = 12 + i * 56;
            m += `<rect x="478" y="${y}" width="40" height="40" rx="8" fill="${P.palette[k]}" stroke="#CBD5E1" stroke-width="2"/><text x="528" y="${y + 30}" font-size="26" font-weight="900" fill="${INK}">= ${P.numbers[k]}</text>`;
          });
          const svg = ctx.scene('0 0 640 460', m);
          const byD = [];
          svg.querySelectorAll('.b2-c').forEach((g) => {
            const d = +g.dataset.d;
            (byD[d] = byD[d] || []).push(g);
          });
          let showNums = false;
          let busy = false;
          const btn = h('button', { class: 'big-btn', style: { background: '#F97316', color: '#fff' } }, '🔢 Arată numerele');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          btn.addEventListener('click', () => {
            if (busy) return;
            busy = true;
            showNums = !showNums;
            ctx.sfx('whoosh');
            byD.forEach((list, d) =>
              ctx.timeout(() => {
                list.forEach((g) => {
                  const rect = g.querySelector('rect');
                  const ch = g.dataset.ch;
                  rect.setAttribute('fill', showNums ? '#fff' : P.palette[ch]);
                  rect.setAttribute('stroke', showNums ? '#E2E8F0' : P.palette[ch]);
                  g.querySelector('text').setAttribute('opacity', showNums ? '1' : '0');
                });
              }, d * 45)
            );
            ctx.timeout(() => {
              busy = false;
              btn.textContent = showNums ? '🎨 Arată culorile' : '🔢 Arată numerele';
              if (showNums && !ctx.isDone) {
                ctx.setText('Asta „vede” telefonul: un tabel plin de <b>numere</b>! Când îți arată poza, transformă numerele înapoi în culori.', 'date digitale');
                ctx.done();
              }
            }, byD.length * 45 + 300);
          });
        },
      },
      /* 4. Întrecerea: cât de repede lucrează muncitorul */
      {
        text: 'Hai la întrecere cu muncitorul! Ai 5 secunde: apasă butonul cât de repede poți.',
        adult: 'miliarde de operații pe secundă',
        wait: true,
        hint: 'Apasă butonul portocaliu cât de repede poți!',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b2-safe');
          const svg = ctx.scene(
            '0 0 800 420',
            '<rect width="800" height="420" fill="#FFF7ED"/>' +
              '<rect x="40" y="16" width="720" height="22" rx="11" fill="#FED7AA"/><rect class="b2-timer" x="40" y="16" width="720" height="22" rx="11" fill="#F97316"/>' +
              '<text x="400" y="34" font-size="18" font-weight="900" text-anchor="middle" fill="#fff" class="b2-sec">5 secunde</text>' +
              '<rect x="40" y="56" width="340" height="344" rx="24" fill="#fff" stroke="#93C5FD" stroke-width="4"/>' +
              `<svg x="140" y="66" width="140" height="140" viewBox="42 24 116 116">${A.andrei()}</svg>` +
              '<text x="210" y="252" font-size="32" font-weight="900" text-anchor="middle" fill="#1D4ED8">Tu</text>' +
              '<text class="b2-me" x="210" y="322" font-size="70" font-weight="900" text-anchor="middle" fill="' + INK + '">0</text>' +
              '<text x="210" y="370" font-size="22" font-weight="800" text-anchor="middle" fill="#64748B">apăsări</text>' +
              '<rect x="420" y="56" width="340" height="344" rx="24" fill="#fff" stroke="#FDBA74" stroke-width="4"/>' +
              `<g transform="translate(590 146) scale(.52)">${worker()}</g>` +
              '<text x="590" y="252" font-size="30" font-weight="900" text-anchor="middle" fill="#C2410C">Muncitorul</text>' +
              '<text class="b2-fac" x="590" y="318" font-size="34" font-weight="900" text-anchor="middle" fill="' + INK + '">0</text>' +
              '<text x="590" y="370" font-size="22" font-weight="800" text-anchor="middle" fill="#64748B">socoteli</text>'
          );
          const me = svg.querySelector('.b2-me');
          const fac = svg.querySelector('.b2-fac');
          const bar = svg.querySelector('.b2-timer');
          const sec = svg.querySelector('.b2-sec');
          const tap = h('button', { class: 'big-btn b2-tap' }, '👆 Apasă!');
          const again = h('button', { class: 'big-btn', style: { display: 'none' } }, '🔁 Încă o dată');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, tap, again));
          let state = 'idle';
          let taps = 0;
          function press() {
            if (state === 'done') return;
            if (state === 'idle') {
              state = 'run';
              const t0 = performance.now();
              ctx.raf((t) => {
                const p = Math.min(1, (t - t0) / 5000);
                fac.textContent = fmt(p >= 1 ? 1e10 : p * 1e10 + Math.random() * 1e6);
                bar.setAttribute('width', (720 * (1 - p)).toFixed(1));
                sec.textContent = p >= 1 ? 'Gata!' : Math.ceil(5 - p * 5) + (Math.ceil(5 - p * 5) === 1 ? ' secundă' : ' secunde');
                if (p >= 1) {
                  finish();
                  return false;
                }
              });
            }
            taps++;
            me.textContent = String(taps);
            OT.sfx('click');
            OT.anim(me, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 120 });
          }
          function finish() {
            state = 'done';
            tap.classList.add('off');
            ctx.sfx('fanfare');
            const tu = taps === 0 ? 'Tu nu ai apucat să apeși.' : 'Tu ai apăsat ' + ori(taps) + '.';
            ctx.setText(tu + ' Muncitorul a făcut <b>10 miliarde</b> de socoteli! Atât de repede lucrează telefonul.', 'miliarde de operații pe secundă');
            ctx.praise('Ce viteză! ⚡');
            ctx.done();
            ctx.timeout(() => (again.style.display = ''), 900);
          }
          tap.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            press();
          });
          tap.addEventListener('click', (e) => {
            if (e.detail === 0) press(); // tastatura (Enter / Space)
          });
          again.addEventListener('click', () => {
            OT.sfx('tap');
            state = 'idle';
            taps = 0;
            me.textContent = '0';
            fac.textContent = '0';
            bar.setAttribute('width', '720');
            sec.textContent = '5 secunde';
            tap.classList.remove('off');
            again.style.display = 'none';
          });
        },
      },
      /* 5. Provocare: colorează după numere */
      {
        text: 'Provocare: <b>colorează după numere</b>! Alege o culoare (fiecare are numărul ei) și colorează pătrățelele cu același număr. Ce iese?',
        adult: 'decodare (numere → culori)',
        wait: true,
        hint: 'Colorează fiecare pătrățel cu culoarea care are același număr!',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b2-safe');
          const T = ['11177111', '11777711', '17777771', '12233221', '12233221', '88888888'];
          const COL = { 1: '#9ED8F5', 2: '#C47F3B', 3: '#7A4A22', 7: '#E53E3E', 8: '#6CBF5E' };
          const NAME = { 1: 'albastru', 2: 'maro', 3: 'maro închis', 7: 'roșu', 8: 'verde' };
          const DARK = { 2: 1, 3: 1, 7: 1 };
          const W = 8;
          const H = 6;
          const c = 62;
          const ox = 150;
          const oy = 14;
          let m = '<rect width="660" height="400" fill="#FFF7ED"/>';
          m += `<g class="b2-dog" opacity="0" transform="translate(4 262) scale(.58)">${A.dog()}</g>`;
          m += `<g transform="translate(${ox} ${oy})">`;
          for (let r = 0; r < H; r++)
            for (let k = 0; k < W; k++)
              m += `<g class="b2-px" data-r="${r}" data-c="${k}"><rect x="${k * c}" y="${r * c}" width="${c - 3}" height="${c - 3}" rx="7" fill="#fff" stroke="#CBD5E1" stroke-width="2"/>` +
                `<text x="${k * c + (c - 3) / 2}" y="${r * c + c * 0.66}" font-size="28" font-weight="900" text-anchor="middle" fill="${INK}">${T[r][k]}</text></g>`;
          m += '</g>';
          const svg = ctx.scene('0 0 660 400', m);
          svg.style.touchAction = 'none';
          let cur = '1';
          const grid = {};
          const pal = h('div', { class: 'palette b2-pal' });
          Object.keys(COL).forEach((k) => {
            const b = h(
              'button',
              { class: 'pal-btn' + (k === cur ? ' on' : ''), 'aria-label': k + ' ' + NAME[k] },
              h('span', { class: 'sw', style: { background: COL[k] } }, k),
              h('span', { class: 'pal-name' }, NAME[k])
            );
            b.addEventListener('click', () => {
              cur = k;
              OT.sfx('tap');
              pal.querySelectorAll('.pal-btn').forEach((x) => x.classList.toggle('on', x === b));
            });
            pal.appendChild(b);
          });
          const left = h('div', { class: 'zoom-label' });
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, pal, left));
          const wrong = () => {
            let w = 0;
            for (let r = 0; r < H; r++) for (let k = 0; k < W; k++) if (grid[r + ',' + k] !== T[r][k]) w++;
            return w;
          };
          const showLeft = () => {
            const w = wrong();
            left.textContent = w ? 'Mai ai ' + w + (w === 1 ? ' pătrățel' : w >= 20 ? ' de pătrățele' : ' pătrățele') : '';
            return w;
          };
          let finished = false;
          function paint(target) {
            const g = target && target.closest ? target.closest('.b2-px') : null;
            if (!g || finished) return;
            const key = g.dataset.r + ',' + g.dataset.c;
            if (grid[key] === cur) return;
            grid[key] = cur;
            g.querySelector('rect').setAttribute('fill', COL[cur]);
            g.querySelector('rect').setAttribute('stroke', COL[cur]);
            const tx = g.querySelector('text');
            tx.setAttribute('fill', DARK[cur] ? '#fff' : INK);
            tx.setAttribute('opacity', '.55');
            OT.sfx('click');
            if (!showLeft()) {
              finished = true;
              ctx.praise('Bravo, Andrei! 🏠');
              const dog = svg.querySelector('.b2-dog');
              ctx.tween(1200, (p) => dog.setAttribute('opacity', p.toFixed(2)));
              ctx.timeout(() => ctx.sfx('woof'), 700);
              ctx.setText('O căsuță pentru cățel! Ai citit numerele și le-ai făcut din nou culori — exact ce face telefonul când îți arată o poză.');
              ctx.done();
            }
          }
          let down = false;
          ctx.on(svg, 'pointerdown', (e) => {
            down = true;
            paint(e.target);
          });
          ctx.on(svg, 'pointermove', (e) => {
            if (down) paint(document.elementFromPoint(e.clientX, e.clientY));
          });
          ctx.on(window, 'pointerup', () => (down = false));
          ctx.on(window, 'pointercancel', () => (down = false));
          showLeft();
        },
      },
    ],
  });
})();
