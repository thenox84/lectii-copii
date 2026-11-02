/* Ediția Beatrice — Clădirea 8: Studioul de chitară (cum face chitara sunetul; microfonul și difuzorul) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;
  const OPEN = [40, 45, 50, 55, 59, 64];

  const stage =
    '<rect width="800" height="450" fill="#431407"/>' +
    '<path d="M400 0 L230 380 H570Z" fill="#FEF3C7" opacity=".14"/>' +
    '<rect y="368" width="800" height="82" fill="#92400E"/><rect y="362" width="800" height="12" fill="#B45309"/>' +
    '<g fill="#FDE68A">' + [60, 160, 260, 540, 640, 740].map((x, i) => `<circle cx="${x}" cy="${30 + (i % 2) * 18}" r="7"/>`).join('') + '</g>' +
    '<path d="M20 30 Q120 60 220 32 Q320 60 420 30 Q520 60 620 32 Q720 60 800 30" stroke="#FDE68A" stroke-width="2" fill="none" opacity=".5"/>' +
    `<g transform="translate(600 160) scale(.9)">${A.easel()}</g>` +
    '<g transform="translate(60 300)"><rect x="-10" y="20" width="60" height="50" rx="6" fill="#C2410C"/><ellipse cx="20" cy="10" rx="34" ry="26" fill="#16A34A"/><ellipse cx="0" cy="-6" rx="16" ry="30" fill="#22C55E"/></g>';

  OT.registerBuilding({
    id: 8,
    key: 'chitara',
    name: 'Studioul de chitară',
    color: '#F59E0B',
    dark: '#78350F',
    noBadge: true,
    learned: 'Coarda care tremură face aerul să tremure; degetul pe tastă scurtează coarda și nota urcă. Microfonul face din sunet numere, difuzorul le face iar sunet.',
    steps: [
      {
        text: 'Bine ai venit în <b>Studioul de chitară</b>, Beatrice! Tu înveți să cânți la chitară. Atinge chitara! Apoi hai să vedem cum face ea sunetul.',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            stage +
              `<g transform="translate(250 70) scale(.95)">${A.beatrice()}</g>` +
              `<g class="gtr" transform="translate(420 70) rotate(14) scale(.95)" style="cursor:pointer">${A.guitar()}</g>` +
              '<g transform="translate(470 60)"><g class="tap-hint"><circle r="32" fill="#fff" opacity=".9"/><text y="11" font-size="32" text-anchor="middle">👆</text></g></g>'
          );
          const hint = svg.querySelector('.tap-hint');
          hint.style.animation = 'bob 1.2s ease-in-out infinite';
          const g = svg.querySelector('.gtr');
          g.addEventListener('click', () => {
            hint.style.display = 'none';
            OT.audio.strum([40, 47, 52, 55, 59, 64], { vel: 0.75 });
            const c = OT.center(g);
            OT.fx.burst('notes', c.x, c.y, 8, { size: 34, spread: 150 });
          });
        },
      },
      {
        text: 'Sunetul e <b>aer care tremură</b>. Ciupește coarda! Ea tremură înainte și înapoi și împinge aerul în valuri, până la urechea ta.',
        adult: 'vibrații și unde sonore',
        wait: true,
        hint: 'Atinge coarda ca s-o ciupești!',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#FFF7ED"/>' +
              '<rect x="40" y="170" width="440" height="60" rx="14" fill="#92400E"/>' +
              '<rect x="60" y="160" width="16" height="80" rx="4" fill="#FEF3C7"/><rect x="440" y="164" width="14" height="72" rx="4" fill="#451A03"/>' +
              '<path class="string" d="M68 200 Q258 200 447 200" stroke="#E7C690" stroke-width="7" fill="none"/>' +
              '<path d="M68 200 L447 200" stroke="transparent" stroke-width="90" class="str-hit" style="cursor:pointer"/>' +
              '<text x="258" y="290" font-size="26" font-weight="900" text-anchor="middle" fill="#9A3412">👆 Ciupește coarda</text>' +
              '<g class="airwaves" fill="none" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"></g>' +
              '<g transform="translate(690 200)"><circle r="46" fill="#fff"/><text y="16" font-size="46" text-anchor="middle">👂</text></g>'
          );
          const str = svg.querySelector('.string');
          const air = svg.querySelector('.airwaves');
          let amp = 0;
          ctx.raf((t) => {
            str.setAttribute('d', `M68 200 Q258 ${(200 + amp * Math.sin(t / 18)).toFixed(1)} 447 200`);
            amp *= 0.965;
            if (amp < 0.3) amp = 0;
          });
          svg.querySelector('.str-hit').addEventListener('click', () => {
            amp = 30;
            OT.audio.guitar(45, { vel: 1 });
            for (let i = 0; i < 4; i++) {
              ctx.timeout(() => {
                const p = OT.s('path', {});
                air.appendChild(p);
                ctx.tween(2000, (q) => {
                  const r = 20 + q * 180;
                  p.setAttribute('d', `M${470 + r * 0.25} ${200 - r * 0.7} Q${470 + r} 200 ${470 + r * 0.25} ${200 + r * 0.7}`);
                  p.setAttribute('opacity', (1 - q).toFixed(2));
                }).then(() => p.remove());
              }, i * 330);
            }
            if (!ctx.isDone) {
              ctx.setText('Vezi? Coarda tremură, aerul tremură în valuri, iar valurile ajung la <b>urechea ta</b>. Asta e sunetul!', 'vibrații și unde sonore');
              ctx.done();
            }
          });
        },
      },
      {
        text: 'Chitara ta are <b>6 corzi</b>: Mi, La, Re, Sol, Si, Mi. Atinge fiecare coardă! Ascultă: cele groase sună jos, cele subțiri sună sus.',
        adult: 'corzile și frecvența (de câte ori tremură pe secundă)',
        wait: true,
        hint: 'Atinge toate cele 6 corzi!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const board = OT.gtBoard({ vertical: window.innerHeight > window.innerWidth * 1.1 && window.innerWidth < 760 });
          board.svg.classList.add('scene');
          ctx.stage.appendChild(board.svg);
          const row = h('div', { class: 'st-controls', style: { gap: '8px' } });
          const chips = ['Mi', 'La', 'Re', 'Sol', 'Si', 'Mi'].map((n) => {
            const s = h('span', { class: 'zoom-label', style: { opacity: '.35', minWidth: '0', fontSize: '16px' } }, n);
            row.appendChild(s);
            return s;
          });
          ctx.stage.appendChild(row);
          const got = new Set();
          ctx.on(board.svg, 'pointerdown', (e) => {
            e.preventDefault();
            const r = board.hit(e);
            OT.audio.guitar(OPEN[r.i], { vel: 0.9 });
            board.vibrate(r.i);
            board.flash(r.i, 0);
            got.add(r.i);
            chips[r.i].style.opacity = '1';
            chips[r.i].textContent = '✓ ' + ['Mi', 'La', 'Re', 'Sol', 'Si', 'Mi'][r.i];
            if (got.size === 6 && !ctx.isDone) {
              ctx.setText('Exact! Coarda <b>groasă</b> tremură încet: notă <b>joasă</b>. Coarda <b>subțire</b> tremură repede: notă <b>înaltă</b>.', 'frecvența, măsurată în herți (Hz)');
              ctx.praise('Bravo, Beatrice! 🎸');
              ctx.done();
            }
          });
        },
      },
      {
        text: 'Când apeși coarda pe o <b>tastă</b>, partea care tremură se face mai <b>scurtă</b> — și nota urcă. Ca o riglă pe marginea mesei: mai scurtă = bâzâie mai repede. Trage degetul spre dreapta!',
        adult: 'tastele, lungimea și tensiunea corzii (acordajul)',
        wait: true,
        hint: 'Trage degetul roz pe coardă, spre dreapta!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const X0 = 60, X1 = 740;
          const frets = [140, 250, 350, 440, 520, 592, 656];
          let m = '<rect width="800" height="340" fill="#FFF7ED"/><rect x="40" y="120" width="720" height="80" rx="12" fill="#5B2E0E"/>' +
            `<rect x="${X0 - 8}" y="112" width="16" height="96" rx="4" fill="#FEF3C7"/>` +
            frets.map((x, i) => `<rect x="${x - 3}" y="118" width="6" height="84" fill="#D6D3D1"/><text x="${x - 40}" y="236" font-size="20" font-weight="800" text-anchor="middle" fill="#9A3412">${i + 1}</text>`).join('') +
            `<rect x="${X1}" y="110" width="20" height="100" rx="5" fill="#451A03"/>` +
            '<path class="part" d="" stroke="#F472B6" stroke-width="14" stroke-linecap="round" opacity=".55"/>' +
            `<line class="str" x1="${X0}" y1="160" x2="${X1}" y2="160" stroke="#E7C690" stroke-width="6"/>` +
            '<g class="finger" style="cursor:grab"><circle r="26" fill="#F472B6" stroke="#fff" stroke-width="5"/><text y="9" font-size="24" text-anchor="middle">👆</text></g>' +
            '<text class="lbl" x="400" y="80" font-size="30" font-weight="900" text-anchor="middle" fill="#9A3412"></text>' +
            '<g transform="translate(70 260)"><text font-size="34">📏</text><text x="46" y="-4" font-size="20" font-weight="800" fill="#9A3412">riglă lungă = brrr încet · riglă scurtă = bzzz repede</text></g>';
          const svg = ctx.scene('0 0 800 340', m);
          svg.style.touchAction = 'none';
          const tight = h('button', { class: 'big-btn yellow' }, '🔧 Strânge cheița');
          const loose = h('button', { class: 'big-btn' }, '🔧 Slăbește');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, tight, loose));
          const finger = svg.querySelector('.finger');
          const part = svg.querySelector('.part');
          const lbl = svg.querySelector('.lbl');
          const NAMES = OT.GT ? OT.GT.NAMES : ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
          let fret = 0;
          let tune = 0;
          let tried = { far: false, peg: false };
          function place(k, play) {
            fret = k;
            const x = k === 0 ? X0 - 30 : frets[k - 1] - 30;
            finger.setAttribute('transform', `translate(${x} 160)`);
            const from = k === 0 ? X0 : frets[k - 1];
            part.setAttribute('d', `M${from} 160 L${X1} 160`);
            const midi = 45 + k + tune;
            lbl.textContent = (k ? 'Tasta ' + k : 'Coarda liberă') + ' → ' + NAMES[midi % 12];
            if (play) {
              OT.audio.guitar(midi, { vel: 0.9 });
              OT.anim(svg.querySelector('.str'), [{ transform: 'translateY(0)' }, { transform: 'translateY(-3px)' }, { transform: 'translateY(3px)' }, { transform: 'translateY(0)' }], { duration: 160, iterations: 4 });
            }
            if (k >= 4) tried.far = true;
            check();
          }
          function check() {
            if (tried.far && tried.peg && !ctx.isDone) {
              ctx.setText('Bravo! Coardă mai <b>scurtă</b> (degetul pe tastă) sau mai <b>întinsă</b> (cheița strânsă) = tremură mai repede = notă mai <b>sus</b>.', 'tastele, lungimea și tensiunea corzii (acordajul)');
              ctx.done();
            } else if (tried.far && !tried.peg) ctx.setText('Super! Nota a urcat. Acum încearcă și cheița: <b>🔧 Strânge cheița</b>.', 'tastele și tensiunea corzii');
          }
          const kAt = (x) => {
            let k = 0;
            frets.forEach((fx, i) => {
              if (x > fx - 70) k = i + 1;
            });
            return x < X0 + 40 ? 0 : k;
          };
          let drag = false;
          ctx.on(svg, 'pointerdown', (e) => {
            drag = true;
            try {
              svg.setPointerCapture(e.pointerId);
            } catch (err) {}
            const k = kAt(OT.svgPoint(svg, e).x);
            place(k, true);
          });
          ctx.on(svg, 'pointermove', (e) => {
            if (!drag) return;
            const k = kAt(OT.svgPoint(svg, e).x);
            if (k !== fret) place(k, true);
          });
          ctx.on(svg, 'pointerup', () => (drag = false));
          ctx.on(svg, 'pointercancel', () => (drag = false));
          tight.addEventListener('click', () => {
            tune = Math.min(2, tune + 1);
            tried.peg = true;
            ctx.sfx('click');
            place(fret, true);
          });
          loose.addEventListener('click', () => {
            tune = Math.max(-2, tune - 1);
            ctx.sfx('click');
            place(fret, true);
          });
          place(0, false);
        },
      },
      {
        text: 'O coardă singură sună încet. <b>Cutia de lemn</b> și gaura rotundă fac sunetul mare — ca atunci când pui mâinile pâlnie la gură 📣. Încearcă amândouă!',
        adult: 'cutia de rezonanță',
        wait: true,
        hint: 'Apasă „Fără cutie”, apoi „Cu cutie”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene(
            '0 0 800 360',
            '<rect width="800" height="360" fill="#FFF7ED"/>' +
              `<g class="body" opacity=".25" transform="translate(144 276) rotate(-90) scale(1.6)">${A.guitar()}</g>` +
              '<line x1="150" y1="180" x2="600" y2="180" stroke="#E7C690" stroke-width="6"/>' +
              '<g class="waves" fill="none" stroke="#F59E0B" stroke-linecap="round"></g>' +
              '<text class="lbl" x="400" y="340" font-size="26" font-weight="900" text-anchor="middle" fill="#9A3412"></text>'
          );
          const body = svg.querySelector('.body');
          const waves = svg.querySelector('.waves');
          const lbl = svg.querySelector('.lbl');
          const no = h('button', { class: 'big-btn' }, '🪢 Fără cutie');
          const yes = h('button', { class: 'big-btn yellow' }, '🎸 Cu cutie');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, no, yes));
          const tried = {};
          function play(withBody) {
            tried[withBody ? 'y' : 'n'] = true;
            body.setAttribute('opacity', withBody ? '1' : '.18');
            OT.audio.guitar(52, { vel: withBody ? 1 : 0.18 });
            OT.audio.guitar(59, { vel: withBody ? 0.7 : 0.12, at: 0.02 });
            lbl.textContent = withBody ? 'Cutia tremură și ea → valuri MARI 🔊' : 'Doar coarda → valuri mici 🔈';
            const n = withBody ? 5 : 2;
            for (let i = 0; i < n; i++) {
              ctx.timeout(() => {
                const c = OT.s('circle', { cx: 486, cy: 180, r: 10, 'stroke-width': withBody ? 8 : 3 });
                waves.appendChild(c);
                ctx.tween(1800, (q) => {
                  c.setAttribute('r', (10 + q * (withBody ? 300 : 120)).toFixed(1));
                  c.setAttribute('opacity', (1 - q).toFixed(2));
                }).then(() => c.remove());
              }, i * 250);
            }
            if (tried.y && tried.n && !ctx.isDone) {
              ctx.setText('Ai auzit diferența? Lemnul tremură odată cu corzile și mișcă mult mai mult aer. De asta chitara se aude până în ultimul rând al sălii!', 'cutia de rezonanță');
              ctx.done();
            }
          }
          no.addEventListener('click', () => play(false));
          yes.addEventListener('click', () => play(true));
        },
      },
      {
        text: '<b>Microfonul</b> „pozează” unda de mii de ori pe secundă și scrie un număr pentru fiecare poză — ca la pixelii desenului tău! <b>Difuzorul</b> face invers: din numere, iar sunet. Trage de buton.',
        adult: 'microfon, eșantionare și difuzor',
        wait: true,
        hint: 'Trage butonul spre dreapta, ca să faci mai multe poze!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene('0 0 800 380', '');
          const range = h('input', { type: 'range', min: '4', max: '64', step: '1', value: '6', class: 'zoom-range', 'aria-label': 'Câte poze' });
          const label = h('div', { class: 'zoom-label' });
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, h('span', { class: 'zoom-label' }, '📸'), range, label));
          const f = (x) => Math.sin(x * Math.PI * 2 * 2) * 0.7 + Math.sin(x * Math.PI * 2 * 6) * 0.22;
          let said = false;
          function draw(n) {
            let m = '<rect width="800" height="380" rx="20" fill="#FFF7ED"/><line x1="40" y1="190" x2="760" y2="190" stroke="#FED7AA" stroke-width="3"/>';
            let d = '';
            for (let i = 0; i <= 360; i++) d += (i ? 'L' : 'M') + (40 + (i / 360) * 720).toFixed(1) + ' ' + (190 - f(i / 360) * 140).toFixed(1);
            m += `<path d="${d}" stroke="#CBD5E1" stroke-width="6" fill="none" stroke-dasharray="10 8"/>`;
            let st = '';
            const w = 720 / n;
            for (let i = 0; i < n; i++) {
              const y = 190 - f((i + 0.5) / n) * 140;
              st += (i ? 'L' : 'M') + (40 + i * w).toFixed(1) + ' ' + y.toFixed(1) + ' L' + (40 + (i + 1) * w).toFixed(1) + ' ' + y.toFixed(1);
            }
            m += `<path d="${st}" stroke="#F59E0B" stroke-width="6" fill="none" stroke-linejoin="round"/>`;
            const every = Math.max(1, Math.round(n / 8));
            for (let i = 0; i < n; i++) {
              const x = 40 + (i + 0.5) * w;
              const v = f((i + 0.5) / n);
              const y = 190 - v * 140;
              m += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${n > 40 ? 4 : 7}" fill="#DB2777"/>`;
              if (i % every === 0) m += `<text x="${x.toFixed(1)}" y="${(v > 0 ? y - 16 : y + 34).toFixed(1)}" font-size="22" font-weight="900" text-anchor="middle" fill="#7C2D12">${Math.round(v * 100)}</text>`;
            }
            svg.innerHTML = m;
            label.textContent = n + ' poze';
            if (n >= 48 && !said) {
              said = true;
              ctx.sfx('success');
              ctx.setText('Cu multe poze, numerele seamănă perfect cu unda! Telefonul face peste <b>44.000 de poze ale sunetului într-o secundă</b>. Difuzorul le citește și mișcă aerul la fel.', 'eșantionare: 44.100 de eșantioane pe secundă');
              ctx.done();
            }
          }
          range.addEventListener('input', () => draw(+range.value));
          draw(6);
        },
      },
      {
        text: 'Acum e rândul tău! În studio cânți acorduri, înveți o melodie, îți <b>acordezi</b> chitara adevărată cu microfonul și te <b>înregistrezi</b> — apoi trimiți cântecul bunicii, împreună cu desenul tău!',
        wait: true,
        hint: 'Apasă pe „Intră în studioul de chitară”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          ctx.scene('0 0 800 400', stage.replace('height="450"', 'height="400"') + `<g transform="translate(250 60) scale(.9)">${A.beatrice()}</g>` + `<g transform="translate(410 70) rotate(14) scale(.9)">${A.guitar()}</g>`);
          const go = h('button', { class: 'big-btn primary', style: { fontSize: 'clamp(20px,2.4vw,30px)', minHeight: '70px' } }, '🎸 Intră în studioul de chitară');
          go.addEventListener('click', () => {
            OT.sfx('success');
            OT.go('guitar', { fromLesson: true });
          });
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, go));
        },
      },
    ],
  });
})();
