/* Clădirea 1 — Studioul foto (camera) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  const room =
    '<rect width="800" height="450" fill="#FEF3C7"/><rect y="350" width="800" height="100" fill="#E7B98A"/>' +
    '<ellipse cx="420" cy="410" rx="300" ry="34" fill="#F9A8D4" opacity=".6"/>' +
    '<rect x="560" y="40" width="160" height="120" rx="10" fill="#BAE6FD" stroke="#fff" stroke-width="10"/><path d="M640 40 v120 M560 100 h160" stroke="#fff" stroke-width="6"/>' +
    A.cloud(585, 60, 0.5);

  OT.registerBuilding({
    id: 1,
    key: 'studio',
    name: 'Studioul foto',
    color: '#5CC8C4',
    dark: '#0B4F4C',
    learned: 'O poză e un mozaic din mii de pătrățele colorate.',
    bow: { top: '3%', right: '2%' },
    bunny: 'left',
    mission: {
      type: 'stars',
      say: 'Maria, în studio s-au ascuns trei steluțe! Le găsești? Atinge-le!',
      scene:
        '<rect width="800" height="450" fill="#FEF3C7"/><rect y="360" width="800" height="90" fill="#D6A26B"/>' +
        '<path d="M250 30 h300 v340 h-300z" fill="#E0F2FE"/><path d="M250 370 q150 40 300 0 v-12 h-300z" fill="#BAE6FD"/><rect x="240" y="22" width="320" height="16" rx="8" fill="#94A3B8"/>' +
        '<rect x="40" y="60" width="130" height="96" rx="6" fill="#ECFCCB" stroke="#B45309" stroke-width="9"/><path d="M48 148 l40 -46 l30 30 l18 -18 l26 34z" fill="#86EFAC"/>' +
        '<circle cx="146" cy="84" r="12" fill="#FDE68A"/>' +
        '<line x1="690" y1="150" x2="690" y2="380" stroke="#475569" stroke-width="8"/><path d="M690 380 l-40 40 M690 380 l40 40 M690 380 v44" stroke="#475569" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M620 70 h140 l-24 90 h-92z" fill="#fff" stroke="#94A3B8" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M150 230 l-50 160 M150 230 l50 160 M150 230 v170" stroke="#475569" stroke-width="7" stroke-linecap="round"/>' +
        '<rect x="96" y="186" width="110" height="64" rx="12" fill="#374151"/><circle cx="168" cy="218" r="22" fill="#1F2937"/><circle cx="168" cy="218" r="14" fill="#60A5FA"/>' +
        '<g transform="translate(300 170) scale(.9)">' + A.dog() + '</g>' +
        '<path d="M565 330 h70 l-10 50 h-50z" fill="#C2410C"/>' +
        '<ellipse cx="575" cy="290" rx="24" ry="44" fill="#22C55E" transform="rotate(-30 575 290)"/><ellipse cx="625" cy="286" rx="24" ry="46" fill="#16A34A" transform="rotate(28 625 286)"/><ellipse cx="600" cy="272" rx="22" ry="52" fill="#4ADE80"/>',
      stars: [
        [100, 112, 20],
        [690, 112, 20],
        [600, 300, 17],
      ],
      answer: 'Ai găsit toate cele trei steluțe!',
    },
    steps: [
      {
        text: 'Andrei vrea să-i facă o poză cățelului, pentru bunica. Apasă pe butonul roșu ca să faci poza!',
        wait: true,
        hint: 'Apasă pe butonul roșu „Fă poza”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene(
            '0 0 800 450',
            room +
              `<g transform="translate(70 40) scale(1.15)">${A.andrei()}</g>` +
              `<g transform="translate(200 200) rotate(-8)">${A.phone(0, 0, 70, 120, '<rect class="ph-screen" width="60" height="103" rx="6" fill="#1E293B"/><g class="ph-photo" opacity="0">' + A.photoSVG({ size: 56, x: 2, y: 22 }) + '</g>')}</g>` +
              `<g class="dog-g" transform="translate(470 196) scale(1.1)">${A.dog()}</g>` +
              '<rect class="flash" width="800" height="450" fill="#fff" opacity="0" pointer-events="none"/>'
          );
          const btn = h('button', { class: 'big-btn', style: { background: '#EF4444', color: '#fff' } }, '📸 Fă poza!');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          let shots = 0;
          btn.addEventListener('click', () => {
            shots++;
            ctx.sfx('shutter');
            const fl = svg.querySelector('.flash');
            OT.anim(fl, [{ opacity: 0.95 }, { opacity: 0 }], { duration: 700, easing: 'ease-out' });
            svg.querySelector('.ph-photo').setAttribute('opacity', '1');
            const dog = svg.querySelector('.dog-g');
            OT.anim(dog, [{ transform: 'translate(470px,196px) scale(1.1)' }, { transform: 'translate(470px,180px) scale(1.12)' }, { transform: 'translate(470px,196px) scale(1.1)' }], { duration: 600 });
            ctx.timeout(() => ctx.sfx('woof'), 500);
            if (shots === 1) {
              ctx.setText('Clic! Poza e gata! 🐶 Acum ea pornește într-o călătorie prin <b>orașul din telefon</b>. Prima oprire: Studioul foto!');
              ctx.done();
            }
          });
        },
      },
      {
        text: 'Pe spatele telefonului e un ochi mic de sticlă. El prinde lumina care vine de la cățel — la fel ca ochiul tău.',
        adult: 'obiectivul camerei foto',
        render(ctx) {
          ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#E0F2FE"/><rect y="380" width="800" height="70" fill="#86EFAC"/>' +
              '<g transform="translate(90 70)"><circle r="44" fill="#FDE047"/><g stroke="#FACC15" stroke-width="8" stroke-linecap="round">' +
              [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="0" y1="-58" x2="0" y2="-76" transform="rotate(${a})"/>`).join('') +
              '</g></g>' +
              '<path class="dash-move" d="M130 100 L260 230" stroke="#FACC15" stroke-width="7" fill="none" stroke-linecap="round"/>' +
              `<g transform="translate(150 200) scale(.95)">${A.dog()}</g>` +
              '<g class="dash-move"><path d="M360 250 L585 225" stroke="#F59E0B" stroke-width="7" fill="none"/><path d="M360 290 L585 235" stroke="#F59E0B" stroke-width="7" fill="none"/><path d="M360 210 L585 215" stroke="#F59E0B" stroke-width="7" fill="none"/></g>' +
              '<rect x="590" y="110" width="90" height="230" rx="22" fill="#334155"/><rect x="600" y="120" width="70" height="210" rx="16" fill="#475569"/>' +
              '<circle cx="635" cy="225" r="40" fill="#1F2937"/><circle class="hl-pulse" cx="635" cy="225" r="27" fill="#60A5FA"/><circle cx="625" cy="214" r="9" fill="#fff" opacity=".7"/>' +
              '<g transform="translate(650 50)"><rect x="-10" y="-30" width="150" height="60" rx="18" fill="#fff"/><text x="65" y="10" font-size="30" font-weight="900" text-anchor="middle" fill="#2B2D42">👁️ = 📷</text></g>'
          );
        },
      },
      {
        text: 'În spatele ochiului e o plăcuță cu foarte multe pătrățele mici. Fiecare pătrățel prinde <b>o singură culoare</b>.',
        adult: 'senzorul de imagine',
        render(ctx) {
          const N = 16;
          const cell = 22;
          let m = '<rect width="800" height="450" fill="#F0FDFA"/>';
          m += `<g transform="translate(224 49)">`;
          for (let r = 0; r < N; r++)
            for (let c = 0; c < N; c++)
              m += `<rect class="cell" data-r="${r}" data-c="${c}" x="${c * cell}" y="${r * cell}" width="${cell - 2}" height="${cell - 2}" rx="3" fill="#E2E8F0"/>`;
          m += '</g>';
          m += '<g class="magn" opacity="0"><circle r="54" fill="none" stroke="#334155" stroke-width="10"/><line x1="38" y1="38" x2="80" y2="80" stroke="#334155" stroke-width="14" stroke-linecap="round"/></g>';
          m += '<g transform="translate(60 120)"><rect width="140" height="90" rx="16" fill="#fff" stroke="#5CC8C4" stroke-width="4"/><text x="70" y="40" font-size="22" font-weight="900" text-anchor="middle" fill="#0B4F4C">1 pătrățel</text><text x="70" y="70" font-size="22" font-weight="900" text-anchor="middle" fill="#0B4F4C">= 1 culoare</text></g>';
          const svg = ctx.scene('0 0 800 450', m);
          const cells = Array.from(svg.querySelectorAll('.cell'));
          const P = A.photo;
          const magn = svg.querySelector('.magn');
          let k = 0;
          const fill = () => {
            for (let s = 0; s < 6 && k < cells.length; s++, k++) {
              const el = cells[k];
              el.setAttribute('fill', P.palette[P.rows[+el.dataset.r][+el.dataset.c]]);
            }
            if (k >= cells.length) {
              ctx.clearInterval(iv);
              // lupa arată un singur pătrățel
              magn.setAttribute('opacity', '1');
              magn.setAttribute('transform', `translate(${224 + 4 * cell + 10} ${49 + 5 * cell + 10})`);
              OT.anim(magn, [{ opacity: 0 }, { opacity: 1 }], { duration: 800 });
            }
          };
          const iv = ctx.interval(fill, 60);
        },
      },
      {
        text: 'Poza cățelului e un <b>mozaic</b>! Trage de buton (sau apasă pe ➕) ca să te apropii cât mai mult de poză.',
        adult: 'pixeli',
        wait: true,
        hint: 'Trage butonul până la capăt, ca să vezi pătrățelele!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const S = 320;
          const svg = ctx.scene(
            `0 0 ${S} ${S}`,
            A.photoSVG({ size: S }) +
              '<g class="gridlines" opacity="0" stroke="#fff" stroke-width=".9">' +
              Array.from({ length: 15 }, (_, i) => `<line x1="${(i + 1) * 20}" y1="0" x2="${(i + 1) * 20}" y2="${S}"/><line x1="0" y1="${(i + 1) * 20}" x2="${S}" y2="${(i + 1) * 20}"/>`).join('') +
              '</g>'
          );
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svg.style.borderRadius = '16px';
          const range = h('input', { type: 'range', min: '1', max: '6', step: '0.05', value: '1', class: 'zoom-range', 'aria-label': 'Apropie poza' });
          const minus = h('button', { class: 'icon-btn' }, '➖');
          const plus = h('button', { class: 'icon-btn' }, '➕');
          const label = h('div', { class: 'zoom-label' }, '🔍 x1');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, minus, range, plus, label));
          const grid = svg.querySelector('.gridlines');
          const cx = 5 * 20 + 10;
          const cy = 5.5 * 20;
          let said = false;
          function apply(z) {
            const w = S / z;
            const x = OT.clamp(cx - w / 2, 0, S - w);
            const y = OT.clamp(cy - w / 2, 0, S - w);
            svg.setAttribute('viewBox', `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${w.toFixed(2)}`);
            grid.setAttribute('opacity', OT.clamp((z - 1.6) / 2.5, 0, 1).toFixed(2));
            grid.setAttribute('stroke-width', (0.9 / Math.sqrt(z)).toFixed(2));
            label.textContent = '🔍 x' + Math.round(z);
            if (z >= 4.5 && !said) {
              said = true;
              ctx.sfx('success');
              ctx.setText('Vezi? Poza e făcută din <b>pătrățele colorate</b>, puse unul lângă altul. De departe nu le vezi, de aproape — da!', 'pixeli');
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
        text: 'Provocare: fă și tu o poză din pătrățele! Alege o culoare și colorează inimioara la fel ca în model.',
        adult: 'artă cu pixeli (pixel art)',
        wait: true,
        hint: 'Colorează toate pătrățelele ca în modelul mic!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const T = ['.RR...RR.', 'RPRRRRRRR', 'RPRRRRRRR', 'RRRRRRRRR', '.RRRRRRR.', '..RRRRR..', '...RRR...', '....R....'];
          const COL = { R: '#EF4444', P: '#F9A8D4', '.': '#FFFFFF' };
          const W = 9;
          const H = 8;
          const c = 46;
          const ox = 300;
          const oy = 26;
          let m = '<rect width="800" height="420" fill="#F0FDFA"/>';
          // model mic
          m += '<g transform="translate(40 60)"><rect x="-14" y="-40" width="190" height="210" rx="16" fill="#fff" stroke="#5CC8C4" stroke-width="4"/><text x="81" y="-12" font-size="22" font-weight="900" text-anchor="middle" fill="#0B4F4C">Model</text>';
          for (let r = 0; r < H; r++) for (let k = 0; k < W; k++) m += `<rect x="${k * 18}" y="${r * 18}" width="17" height="17" fill="${COL[T[r][k]]}" stroke="#E2E8F0" stroke-width="1"/>`;
          m += '</g>';
          m += `<g class="paint" transform="translate(${ox} ${oy})">`;
          for (let r = 0; r < H; r++) for (let k = 0; k < W; k++) m += `<rect class="px" data-r="${r}" data-c="${k}" x="${k * c}" y="${r * c}" width="${c - 3}" height="${c - 3}" rx="6" fill="#fff" stroke="#CBD5E1" stroke-width="2"/>`;
          m += '</g>';
          const svg = ctx.scene('0 0 800 420', m);
          svg.style.touchAction = 'none';
          let cur = 'R';
          const grid = {};
          const pal = h('div', { class: 'palette' });
          [['R', 'Roșu'], ['P', 'Roz'], ['.', 'Gumă']].forEach(([k, name]) => {
            const b = h('button', { class: 'pal-btn' + (k === cur ? ' on' : ''), 'aria-label': name }, h('span', { class: 'sw', style: { background: k === '.' ? '#fff' : COL[k] } }, k === '.' ? '🧽' : ''), name);
            b.addEventListener('click', () => {
              cur = k;
              OT.sfx('tap');
              pal.querySelectorAll('.pal-btn').forEach((x) => x.classList.toggle('on', x === b));
            });
            pal.appendChild(b);
          });
          const left = h('div', { class: 'zoom-label' });
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, pal, left));
          function count() {
            let wrong = 0;
            for (let r = 0; r < H; r++) for (let k = 0; k < W; k++) if ((grid[r + ',' + k] || '.') !== T[r][k]) wrong++;
            return wrong;
          }
          let finished = false;
          function paint(el) {
            if (!el || !el.classList || !el.classList.contains('px') || finished) return;
            const key = el.dataset.r + ',' + el.dataset.c;
            if ((grid[key] || '.') === cur) return;
            grid[key] = cur;
            el.setAttribute('fill', COL[cur]);
            OT.sfx('click');
            const w = count();
            left.textContent = w ? 'Mai ai ' + w + (w === 1 ? ' pătrățel' : ' pătrățele') : '';
            if (!w) {
              finished = true;
              ctx.praise('Bravo, Andrei! ❤️');
              ctx.setText('Bravo! Ai făcut o poză din pătrățele — exact cum face camera telefonului, doar că ea folosește <b>milioane</b> de pătrățele!');
              ctx.done();
            }
          }
          let down = false;
          ctx.on(svg, 'pointerdown', (e) => {
            down = true;
            paint(e.target);
          });
          ctx.on(svg, 'pointermove', (e) => {
            if (!down) return;
            paint(document.elementFromPoint(e.clientX, e.clientY));
          });
          ctx.on(window, 'pointerup', () => (down = false));
          ctx.on(window, 'pointercancel', () => (down = false));
          left.textContent = 'Mai ai ' + count() + ' pătrățele';
        },
      },
    ],
  });
})();
