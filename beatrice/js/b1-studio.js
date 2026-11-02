/* Ediția Beatrice — Clădirea 1: Studioul foto (camera). Aici Beatrice își face desenul din pătrățele. */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  document.head.appendChild(
    h('style', {
      text:
        '.bs1-paint{touch-action:none}.bs1-tools{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center}' +
        '.bs1-sw{width:44px;height:44px;border-radius:50%;border:4px solid #fff;box-shadow:0 0 0 2px #CBD5E1,0 3px 0 rgba(0,0,0,.15);padding:0}' +
        '.bs1-sw.on{box-shadow:0 0 0 4px #2B2D42,0 3px 0 rgba(0,0,0,.15);transform:scale(1.12)}' +
        '.bs1-tools .big-btn{min-height:48px;font-size:16px;padding:0 14px}' +
        '@media (max-width:520px){.bs1-sw{width:36px;height:36px}}' +
        '@media (orientation:landscape) and (max-height:540px){.bs1-sw{width:32px;height:32px}.bs1-tools .big-btn{min-height:40px;font-size:14px}}',
    })
  );

  const room =
    '<rect width="800" height="450" fill="#FDF2F8"/><rect y="350" width="800" height="100" fill="#E9D5FF"/>' +
    '<rect x="590" y="40" width="160" height="110" rx="10" fill="#BAE6FD" stroke="#fff" stroke-width="10"/>';

  OT.registerBuilding({
    id: 1,
    key: 'studio',
    name: 'Studioul foto',
    color: '#5CC8C4',
    dark: '#0B4F4C',
    learned: 'Camera vede lumea ca pe un mozaic din mii de pătrățele colorate — ca un goblen cusut punct cu punct.',
    steps: [
      {
        text: 'Beatrice vrea să-i trimită bunicii un desen. Mai întâi îl pozează cu telefonul. Apasă pe butonul roșu!',
        wait: true,
        hint: 'Apasă pe „Pozează desenul”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene(
            '0 0 800 450',
            room +
              `<g transform="translate(470 150)">${A.easel()}</g>` +
              `<g transform="translate(120 60) scale(1.1)">${A.beatrice()}</g>` +
              `<g transform="translate(300 190) rotate(10)">${A.phone(0, 0, 70, 120, '<rect width="60" height="103" rx="6" fill="#1E293B"/><g class="ph-photo" opacity="0">' + A.photoSVG({ size: 56, x: 2, y: 22 }) + '</g>')}</g>` +
              '<rect class="flash" width="800" height="450" fill="#fff" opacity="0" pointer-events="none"/>'
          );
          const btn = h('button', { class: 'big-btn', style: { background: '#EF4444', color: '#fff' } }, '📸 Pozează desenul');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          btn.addEventListener('click', () => {
            ctx.sfx('shutter');
            OT.anim(svg.querySelector('.flash'), [{ opacity: 0.95 }, { opacity: 0 }], { duration: 700 });
            svg.querySelector('.ph-photo').setAttribute('opacity', '1');
            if (!ctx.isDone) {
              ctx.setText('Clic! Desenul e acum în telefon. Dar oare cum „vede” telefonul un desen? Hai să aflăm!');
              ctx.done();
            }
          });
        },
      },
      {
        text: 'Pe spatele telefonului e un ochi mic de sticlă. El adună lumina care vine de la desen — la fel ca ochiul tău când privești o pictură.',
        adult: 'obiectivul camerei foto',
        render(ctx) {
          ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#F0FDFA"/>' +
              `<g transform="translate(60 120) scale(1.05)">${A.easel()}</g>` +
              '<g class="dash-move"><path d="M240 200 L585 225" stroke="#F59E0B" stroke-width="7" fill="none"/><path d="M240 250 L585 230" stroke="#F59E0B" stroke-width="7" fill="none"/><path d="M240 150 L585 220" stroke="#F59E0B" stroke-width="7" fill="none"/></g>' +
              '<rect x="590" y="110" width="90" height="230" rx="22" fill="#334155"/><circle cx="635" cy="225" r="40" fill="#1F2937"/><circle class="hl-pulse" cx="635" cy="225" r="27" fill="#60A5FA"/>' +
              '<g transform="translate(650 50)"><rect x="-10" y="-30" width="150" height="60" rx="18" fill="#fff"/><text x="65" y="10" font-size="30" font-weight="900" text-anchor="middle">👁️ = 📷</text></g>'
          );
        },
      },
      {
        text: 'În spatele ochiului e o plăcuță cu foarte multe pătrățele mici. Fiecare pătrățel prinde <b>o singură culoare</b> — ca un punct de cusătură într-un goblen.',
        adult: 'senzorul de imagine',
        render(ctx) {
          const N = 16;
          const c = 22;
          let m = '<rect width="800" height="450" fill="#F0FDFA"/><g transform="translate(224 49)">';
          for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) m += `<rect class="cell" data-r="${r}" data-c="${k}" x="${k * c}" y="${r * c}" width="${c - 2}" height="${c - 2}" rx="3" fill="#E2E8F0"/>`;
          m += '</g><g transform="translate(40 120)"><rect width="150" height="90" rx="16" fill="#fff" stroke="#5CC8C4" stroke-width="4"/><text x="75" y="40" font-size="22" font-weight="900" text-anchor="middle" fill="#0B4F4C">1 pătrățel</text><text x="75" y="70" font-size="22" font-weight="900" text-anchor="middle" fill="#0B4F4C">= 1 culoare</text></g>';
          const svg = ctx.scene('0 0 800 450', m);
          const cells = Array.from(svg.querySelectorAll('.cell'));
          const P = A.photo;
          let k = 0;
          const iv = ctx.interval(() => {
            for (let s = 0; s < 6 && k < cells.length; s++, k++) {
              const el = cells[k];
              el.setAttribute('fill', P.palette[P.rows[+el.dataset.r][+el.dataset.c]]);
            }
            if (k >= cells.length) ctx.clearInterval(iv);
          }, 60);
        },
      },
      {
        text: 'Pentru telefon, orice imagine e un <b>mozaic</b>. Trage de buton (sau apasă ➕) ca să te apropii de desen.',
        adult: 'pixeli (de la „picture element” = bucățică de imagine)',
        wait: true,
        hint: 'Trage butonul până aproape de capăt!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const S = 320;
          const svg = ctx.scene(
            `0 0 ${S} ${S}`,
            A.photoSVG({ size: S }) +
              '<g class="gridlines" opacity="0" stroke="#94A3B8" stroke-width=".9">' +
              Array.from({ length: 15 }, (_, i) => `<line x1="${(i + 1) * 20}" y1="0" x2="${(i + 1) * 20}" y2="${S}"/><line x1="0" y1="${(i + 1) * 20}" x2="${S}" y2="${(i + 1) * 20}"/>`).join('') +
              '</g>'
          );
          const range = h('input', { type: 'range', min: '1', max: '6', step: '0.05', value: '1', class: 'zoom-range', 'aria-label': 'Apropie desenul' });
          const minus = h('button', { class: 'icon-btn' }, '➖');
          const plus = h('button', { class: 'icon-btn' }, '➕');
          const label = h('div', { class: 'zoom-label' }, '🔍 x1');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, minus, range, plus, label));
          const grid = svg.querySelector('.gridlines');
          let said = false;
          function apply(z) {
            const w = S / z;
            const x = OT.clamp(210 - w / 2, 0, S - w);
            const y = OT.clamp(90 - w / 2, 0, S - w);
            svg.setAttribute('viewBox', `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${w.toFixed(2)}`);
            grid.setAttribute('opacity', OT.clamp((z - 1.6) / 2.5, 0, 1).toFixed(2));
            grid.setAttribute('stroke-width', (0.9 / Math.sqrt(z)).toFixed(2));
            label.textContent = '🔍 x' + Math.round(z);
            if (z >= 4.5 && !said) {
              said = true;
              ctx.sfx('success');
              ctx.setText('Vezi? De departe pare un desen neted, de aproape sunt <b>pătrățele</b> puse unul lângă altul — ca într-un mozaic din cioburi colorate.', 'pixeli');
              ctx.done();
            }
          }
          range.addEventListener('input', () => apply(+range.value));
          const step = (d) => {
            range.value = OT.clamp(+range.value + d, 1, 6);
            apply(+range.value);
            ctx.sfx('tap');
          };
          minus.addEventListener('click', () => step(-1));
          plus.addEventListener('click', () => step(1));
          apply(1);
        },
      },
      {
        text: 'Provocarea ta de artistă: desenează <b>din pătrățele</b> desenul pe care îl trimiți bunicii! Alege culori și colorează. Când ești gata, apasă „Gata”.',
        adult: 'artă cu pixeli (pixel art)',
        wait: true,
        hint: 'Colorează măcar 20 de pătrățele, apoi apasă „✅ Gata”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const N = 16;
          const C = 26;
          const PAL = A.BEA_PALETTE;
          const keys = ['r', 'o', 'y', 'g', 'b', 'p', 'k', '.'];
          const grid = A.photo.rows.map((r) => r.split(''));
          let m = `<rect x="-6" y="-6" width="${N * C + 12}" height="${N * C + 12}" rx="10" fill="#E2E8F0"/>`;
          for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) m += `<rect class="px" data-r="${r}" data-c="${k}" x="${k * C}" y="${r * C}" width="${C - 1.5}" height="${C - 1.5}" rx="3" fill="${PAL[grid[r][k]]}"/>`;
          const svg = ctx.scene(`-8 -8 ${N * C + 16} ${N * C + 16}`, m, { class: 'bs1-paint' });
          let cur = 'r';
          const tools = h('div', { class: 'bs1-tools' });
          const sws = keys.map((k) => {
            const b = h('button', { class: 'bs1-sw' + (k === cur ? ' on' : ''), 'aria-label': A.BEA_NAMES[k], style: { background: PAL[k] } }, k === '.' ? '🧽' : '');
            b.addEventListener('click', () => {
              cur = k;
              OT.sfx('tap');
              sws.forEach((x) => x.classList.toggle('on', x === b));
            });
            tools.appendChild(b);
            return b;
          });
          const clear = h('button', { class: 'big-btn' }, '🧹 Pagină albă');
          const done = h('button', { class: 'big-btn primary' }, '✅ Gata');
          tools.append(clear, done);
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, tools));
          function paint(el) {
            if (!el || !el.classList || !el.classList.contains('px')) return;
            const r = +el.dataset.r;
            const k = +el.dataset.c;
            if (grid[r][k] === cur) return;
            grid[r][k] = cur;
            el.setAttribute('fill', PAL[cur]);
            OT.sfx('click');
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
          clear.addEventListener('click', () => {
            OT.sfx('whoosh');
            for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) grid[r][k] = '.';
            svg.querySelectorAll('.px').forEach((el) => el.setAttribute('fill', PAL['.']));
          });
          done.addEventListener('click', () => {
            const colored = grid.reduce((s, row) => s + row.filter((x) => x !== '.').length, 0);
            if (colored < 20) {
              OT.sfx('hmm');
              OT.toast('🎨 Mai colorează puțin: ai ' + colored + ' pătrățele, încă ' + (20 - colored) + '!');
              return;
            }
            OT.state.drawing = grid.map((row) => row.join(''));
            OT.save();
            A.useDrawing();
            ctx.praise('Ce desen frumos! 🎨');
            OT.fx.confetti(60);
            ctx.setText('Minunat! <b>Desenul tău</b> e gata. De acum el călătorește prin tot orașul, până la bunica. Uită-te după el în fiecare clădire!');
            ctx.done();
          });
        },
      },
    ],
  });
})();
