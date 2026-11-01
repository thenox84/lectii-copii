/* Clădirea 8 — Sala de concerte (microfonul și difuzorul) — clădirea specială a lui Andrei */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  const piano =
    '<g class="grand">' +
    '<path d="M24 40 L304 -66 L322 -54 L56 40Z" fill="#1F2937"/>' +
    '<line x1="220" y1="40" x2="250" y2="-34" stroke="#9CA3AF" stroke-width="5"/>' +
    '<path d="M0 92 V46 Q0 36 12 36 H262 Q340 36 352 78 V92Z" fill="#111827"/>' +
    '<path d="M14 44 H250" stroke="#374151" stroke-width="4"/>' +
    '<rect x="-36" y="44" width="46" height="16" rx="2" fill="#fff"/><rect x="-36" y="40" width="46" height="6" fill="#0B0F19"/>' +
    '<rect x="14" y="92" width="16" height="104" rx="4" fill="#111827"/><rect x="316" y="92" width="16" height="104" rx="4" fill="#111827"/>' +
    '<rect x="150" y="92" width="10" height="70" fill="#111827"/><rect x="140" y="160" width="30" height="8" rx="3" fill="#CA8A04"/>' +
    '</g>';
  const hall =
    '<rect width="800" height="450" fill="#2E1065"/>' +
    '<path d="M400 0 L220 380 H600Z" fill="#FEF9C3" opacity=".14"/>' +
    '<rect y="368" width="800" height="82" fill="#92400E"/><rect y="362" width="800" height="12" fill="#B45309"/>' +
    '<path d="M0 0 H130 Q100 160 150 370 Q70 390 0 384Z" fill="#B91C1C"/><path d="M40 0 Q20 180 60 380 M84 0 Q64 180 104 376" stroke="#7F1D1D" stroke-width="6" fill="none"/>' +
    '<path d="M800 0 H670 Q700 160 650 370 Q730 390 800 384Z" fill="#B91C1C"/><path d="M760 0 Q780 180 740 380 M716 0 Q736 180 696 376" stroke="#7F1D1D" stroke-width="6" fill="none"/>' +
    '<path d="M0 0 H800 V34 Q760 60 720 34 Q680 60 640 34 Q600 60 560 34 Q520 60 480 34 Q440 60 400 34 Q360 60 320 34 Q280 60 240 34 Q200 60 160 34 Q120 60 80 34 Q40 60 0 34Z" fill="#991B1B"/>';

  OT.registerBuilding({
    id: 8,
    key: 'concert',
    name: 'Sala de concerte',
    color: '#8B5CF6',
    dark: '#2E1065',
    noBadge: true,
    learned: 'Sunetul e aer care tremură. Microfonul îl transformă în numere, iar difuzorul — înapoi în sunet.',
    bow: { top: '3%', left: '2%' },
    bunny: 'right',
    mission: {
      type: 'custom',
      say: 'Maria, apasă pe clapa care se aprinde și cântă «Steluța»!',
      render(body, api) {
        body.classList.add('m-piano');
        OT.piano.mariaGame(body, api.scope, (txt) => api.win(txt));
      },
    },
    steps: [
      {
        text: 'Bine ai venit în <b>Sala de concerte</b>, Andrei! Tu cânți la pian de un an. Atinge pianul! Apoi hai să aflăm ce e, de fapt, <b>sunetul</b>.',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            hall +
              `<g class="pno" transform="translate(370 170)" style="cursor:pointer">${piano}</g>` +
              `<g transform="translate(206 108) scale(.82)">${A.andrei()}</g>` +
              `<g transform="translate(20 300) scale(.42)">${A.maria()}</g><g transform="translate(96 318) scale(.38)">${A.elena()}</g>` +
              '<g transform="translate(560 120)"><g class="tap-hint"><circle r="34" fill="#fff" opacity=".9"/><text y="12" font-size="34" text-anchor="middle">👆</text></g></g>'
          );
          const hint = svg.querySelector('.tap-hint');
          hint.style.animation = 'bob 1.2s ease-in-out infinite';
          const pno = svg.querySelector('.pno');
          let busy = false;
          pno.addEventListener('click', async () => {
            if (busy) return;
            busy = true;
            hint.style.display = 'none';
            const seq = [60, 64, 67, 72, 76, 79, 84];
            for (let i = 0; i < seq.length; i++) {
              if (!ctx.alive) return;
              OT.audio.piano(seq[i], { vel: 0.7 });
              const c = OT.center(pno);
              OT.fx.burst('notes', c.x + (i - 3) * 20, c.y - 40, 2, { size: 34, spread: 120 });
              await ctx.wait(140);
            }
            busy = false;
          });
        },
      },
      {
        text: 'Sunetul e <b>aer care tremură</b>. Atinge coarda! Ea tremură și împinge aerul, ca valurile pe apă când arunci o pietricică.',
        adult: 'vibrații și unde sonore',
        wait: true,
        hint: 'Atinge coarda pianului!',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#F5F3FF"/>' +
              '<rect x="50" y="90" width="330" height="120" rx="16" fill="#FDE68A"/>' +
              '<circle cx="80" cy="150" r="10" fill="#92400E"/><circle cx="350" cy="150" r="10" fill="#92400E"/>' +
              '<path class="string" d="M80 150 Q215 150 350 150" stroke="#475569" stroke-width="6" fill="none"/>' +
              '<path d="M80 150 L350 150" stroke="transparent" stroke-width="80" class="str-hit" style="cursor:pointer"/>' +
              '<g class="airwaves" fill="none" stroke="#8B5CF6" stroke-width="5" stroke-linecap="round"></g>' +
              '<text x="215" y="250" font-size="26" font-weight="900" text-anchor="middle" fill="#6D28D9">👆 Atinge coarda</text>' +
              '<g transform="translate(560 300)"><ellipse rx="190" ry="70" fill="#7DD3FC"/><g class="ripples" fill="none" stroke="#fff" stroke-width="5"></g><circle class="stone" cx="0" cy="-200" r="14" fill="#64748B" opacity="0"/></g>' +
              '<g transform="translate(640 60)"><circle r="40" fill="#fff"/><text y="14" font-size="40" text-anchor="middle">👂</text></g>'
          );
          const str = svg.querySelector('.string');
          const air = svg.querySelector('.airwaves');
          const rip = svg.querySelector('.ripples');
          const stone = svg.querySelector('.stone');
          let amp = 0;
          ctx.raf((t) => {
            const y = 150 + amp * Math.sin(t / 22);
            str.setAttribute('d', `M80 150 Q215 ${y.toFixed(1)} 350 150`);
            amp *= 0.97;
            if (amp < 0.3) amp = 0;
          });
          function wave(parent, make, n, dur) {
            for (let i = 0; i < n; i++) {
              ctx.timeout(() => {
                const el = OT.s(make.tag, make.attrs);
                parent.appendChild(el);
                ctx.tween(dur, (p) => make.step(el, p)).then(() => el.remove());
              }, i * 350);
            }
          }
          svg.querySelector('.str-hit').addEventListener('click', () => {
            amp = 26;
            OT.audio.piano(45, { vel: 0.9 });
            wave(air, { tag: 'path', attrs: {}, step: (el, p) => {
              const r = 30 + p * 200;
              el.setAttribute('d', `M${380 + r * 0.2} ${150 - r * 0.6} Q${380 + r} 150 ${380 + r * 0.2} ${150 + r * 0.6}`);
              el.setAttribute('opacity', (1 - p).toFixed(2));
            } }, 4, 2200);
            // pietricica în apă
            OT.anim(stone, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(200px)', opacity: 1, offset: 0.85 }, { transform: 'translateY(200px)', opacity: 0 }], { duration: 700, easing: 'ease-in', fill: 'forwards' }).then(() => {
              wave(rip, { tag: 'ellipse', attrs: { cx: 0, cy: 0 }, step: (el, p) => {
                el.setAttribute('rx', (10 + p * 180).toFixed(1));
                el.setAttribute('ry', (4 + p * 64).toFixed(1));
                el.setAttribute('opacity', (1 - p).toFixed(2));
              } }, 4, 2400);
            });
            if (!ctx.isDone) {
              ctx.setText('Vezi? Coarda tremură, aerul tremură în valuri, și valurile ajung până la <b>urechea ta</b>. Asta e sunetul!', 'vibrații și unde sonore');
              ctx.done();
            }
          });
        },
      },
      {
        text: 'Notele <b>joase</b> tremură încet: valuri late. Notele <b>înalte</b> tremură repede: valuri dese. Apasă pe amândouă!',
        adult: 'frecvența (de câte ori tremură aerul într-o secundă)',
        wait: true,
        hint: 'Apasă și pe nota joasă, și pe nota înaltă!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene(
            '0 0 800 360',
            '<rect width="800" height="360" rx="20" fill="#F5F3FF"/><line x1="40" y1="180" x2="760" y2="180" stroke="#DDD6FE" stroke-width="4"/>' +
              '<path class="wv" d="" stroke="#8B5CF6" stroke-width="8" fill="none" stroke-linecap="round"/>' +
              '<text class="who" x="400" y="60" font-size="48" text-anchor="middle"></text>'
          );
          const wv = svg.querySelector('.wv');
          const who = svg.querySelector('.who');
          const low = h('button', { class: 'big-btn', style: { background: '#A16207', color: '#fff' } }, '🐻 Notă joasă');
          const high = h('button', { class: 'big-btn', style: { background: '#0EA5E9', color: '#fff' } }, '🐦 Notă înaltă');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, low, high));
          let cycles = 3;
          let amp = 0;
          let phase = 0;
          const tried = {};
          ctx.raf(() => {
            phase += 0.05 * cycles;
            let d = '';
            for (let x = 40; x <= 760; x += 4) {
              const y = 180 - amp * Math.sin(((x - 40) / 720) * cycles * Math.PI * 2 - phase);
              d += (x === 40 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
            }
            wv.setAttribute('d', d);
            amp *= 0.992;
          });
          function play(k) {
            tried[k] = true;
            if (k === 'low') {
              cycles = 2.5;
              who.textContent = '🐻 bum… bum…';
              OT.audio.piano(40, { vel: 1 });
            } else {
              cycles = 16;
              who.textContent = '🐦 ciu-ciu-ciu!';
              OT.audio.piano(88, { vel: 0.8 });
            }
            amp = 120;
            if (tried.low && tried.high && !ctx.isDone) {
              ctx.setText('Exact! Jos = valuri <b>late</b>, încet. Sus = valuri <b>dese</b>, repede. Pianul tău are și note joase, și note înalte!', 'frecvența, măsurată în herți (Hz)');
              ctx.done();
            }
          }
          low.addEventListener('click', () => play('low'));
          high.addEventListener('click', () => play('high'));
        },
      },
      {
        text: 'Microfonul e ca o <b>ureche mică</b>. El „pozează” unda și scrie un <b>număr</b> pentru fiecare poză — ca la poza cățelului! Trage de buton.',
        adult: 'microfon și eșantionare',
        wait: true,
        hint: 'Trage butonul spre dreapta, ca să faci mai multe poze!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene('0 0 800 380', '');
          const range = h('input', { type: 'range', min: '4', max: '64', step: '1', value: '6', class: 'zoom-range', 'aria-label': 'Câte poze' });
          const label = h('div', { class: 'zoom-label' });
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, h('span', { class: 'zoom-label' }, '📸'), range, label));
          const f = (x) => Math.sin(x * Math.PI * 2 * 2) * 0.75 + Math.sin(x * Math.PI * 2 * 5) * 0.2;
          let said = false;
          function draw(n) {
            let m = '<rect width="800" height="380" rx="20" fill="#F5F3FF"/><line x1="40" y1="190" x2="760" y2="190" stroke="#DDD6FE" stroke-width="3"/>';
            let d = '';
            for (let i = 0; i <= 360; i++) {
              const x = i / 360;
              d += (i ? 'L' : 'M') + (40 + x * 720).toFixed(1) + ' ' + (190 - f(x) * 140).toFixed(1);
            }
            m += `<path d="${d}" stroke="#CBD5E1" stroke-width="6" fill="none" stroke-dasharray="10 8"/>`;
            // trepte: ce „vede” telefonul din poze
            let st = '';
            const w = 720 / n;
            for (let i = 0; i < n; i++) {
              const y = 190 - f((i + 0.5) / n) * 140;
              st += (i ? 'L' : 'M') + (40 + i * w).toFixed(1) + ' ' + y.toFixed(1) + ' L' + (40 + (i + 1) * w).toFixed(1) + ' ' + y.toFixed(1);
            }
            m += `<path d="${st}" stroke="#8B5CF6" stroke-width="6" fill="none" stroke-linejoin="round"/>`;
            const every = Math.max(1, Math.round(n / 8));
            for (let i = 0; i < n; i++) {
              const x = 40 + (i + 0.5) * w;
              const v = f((i + 0.5) / n);
              const y = 190 - v * 140;
              m += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${n > 40 ? 4 : 7}" fill="#EC4899"/>`;
              if (i % every === 0) m += `<text x="${x.toFixed(1)}" y="${(v > 0 ? y - 16 : y + 34).toFixed(1)}" font-size="22" font-weight="900" text-anchor="middle" fill="#831843">${Math.round(v * 100)}</text>`;
            }
            svg.innerHTML = m;
            label.textContent = n + ' poze';
            if (n >= 48 && !said) {
              said = true;
              ctx.sfx('success');
              ctx.setText('Cu multe poze, numerele seamănă perfect cu unda! Telefonul face peste <b>44.000 de poze ale sunetului într-o secundă</b>.', 'eșantionare: 44.100 de eșantioane pe secundă');
              ctx.done();
            }
          }
          range.addEventListener('input', () => draw(+range.value));
          draw(6);
        },
      },
      {
        text: '<b>Difuzorul</b> face invers: citește numerele și împinge aerul înainte și înapoi. Așa auzi muzica! Apasă pe difuzor.',
        adult: 'difuzor',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#F5F3FF"/>' +
              '<g class="nums" font-size="30" font-weight="900" fill="#8B5CF6"></g>' +
              '<g class="spk" transform="translate(470 225)" style="cursor:pointer"><rect x="-70" y="-110" width="140" height="220" rx="24" fill="#334155"/>' +
              '<circle r="78" fill="#1E293B"/><g class="cone"><circle r="62" fill="#64748B"/><circle r="30" fill="#94A3B8"/><circle r="12" fill="#CBD5E1"/></g></g>' +
              '<g class="sw" fill="none" stroke="#EC4899" stroke-width="6" stroke-linecap="round"></g>' +
              `<g transform="translate(640 150) scale(.7)">${A.maria()}</g>` +
              '<g transform="translate(470 80)"><g class="tap-hint"><circle r="30" fill="#fff"/><text y="11" font-size="30" text-anchor="middle">👆</text></g></g>'
          );
          const nums = svg.querySelector('.nums');
          const cone = svg.querySelector('.cone');
          const sw = svg.querySelector('.sw');
          const hint = svg.querySelector('.tap-hint');
          hint.style.animation = 'bob 1.2s ease-in-out infinite';
          ctx.interval(() => {
            const t = OT.s('text', { x: 20, y: OT.randInt(140, 320) }, String(OT.randInt(-99, 99)));
            nums.appendChild(t);
            ctx.tween(2600, (p) => t.setAttribute('x', (20 + p * 360).toFixed(1)), (p) => p).then(() => t.remove());
          }, 450);
          let busy = false;
          svg.querySelector('.spk').addEventListener('click', async () => {
            if (busy) return;
            busy = true;
            hint.style.display = 'none';
            const tune = [60, 60, 67, 67, 69, 69, 67];
            for (let i = 0; i < tune.length; i++) {
              if (!ctx.alive) return;
              OT.audio.piano(tune[i], { vel: 0.8 });
              OT.anim(cone, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 300 });
              const p = OT.s('path', { d: 'M560 160 Q600 225 560 290' });
              sw.appendChild(p);
              ctx.tween(1200, (q) => {
                p.setAttribute('transform', `translate(${(q * 70).toFixed(1)} 0)`);
                p.setAttribute('opacity', (1 - q).toFixed(2));
              }).then(() => p.remove());
              await ctx.wait(i === 6 ? 700 : 380);
            }
            busy = false;
          });
        },
      },
      {
        text: 'Acum e rândul tău! În studioul de muzică poți cânta la pian, vezi <b>unda</b> sunetului și te poți <b>înregistra</b> cântând la pianul tău adevărat — apoi trimiți cântecul bunicii!',
        wait: true,
        hint: 'Apasă pe „Intră în studioul de muzică”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          ctx.scene('0 0 800 400', hall.replace('height="450"', 'height="400"') + `<g transform="translate(300 150)">${piano}</g>` + `<g transform="translate(150 70) scale(.8)">${A.andrei()}</g>`);
          const go = h('button', { class: 'big-btn primary', style: { fontSize: 'clamp(20px,2.4vw,30px)', minHeight: '70px' } }, '🎹 Intră în studioul de muzică');
          go.addEventListener('click', () => {
            OT.sfx('success');
            OT.go('piano', { fromLesson: true });
          });
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, go));
        },
      },
    ],
  });
})();
