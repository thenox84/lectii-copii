/* Ediția Beatrice — Clădirea 2: Fabrica de numere (procesorul + culorile din lumină) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  document.head.appendChild(
    OT.h('style', {
      text:
        '.bb2-mix{display:flex;flex-direction:column;gap:8px;width:min(560px,100%);flex:none}' +
        '.bb2-row{display:flex;align-items:center;gap:10px;font-weight:900;font-size:clamp(16px,2vw,22px)}' +
        '.bb2-row .bb2-ico{width:34px;text-align:center;font-size:24px}' +
        '.bb2-row .bb2-val{width:48px;text-align:right;font-variant-numeric:tabular-nums}' +
        '.bb2-range{-webkit-appearance:none;appearance:none;flex:1;height:18px;border-radius:9px;outline:none;min-width:120px}' +
        '.bb2-range::-webkit-slider-thumb{-webkit-appearance:none;width:40px;height:40px;border-radius:50%;background:#fff;border:6px solid var(--c);box-shadow:0 3px 8px rgba(0,0,0,.3)}' +
        '.bb2-range::-moz-range-thumb{width:32px;height:32px;border-radius:50%;background:#fff;border:6px solid var(--c);box-shadow:0 3px 8px rgba(0,0,0,.3)}' +
        '@media (orientation:landscape) and (max-height:540px){.bb2-mix{gap:2px}.bb2-row{font-size:15px}.bb2-range::-webkit-slider-thumb{width:30px;height:30px;border-width:5px}.bb2-range{height:12px}}',
    })
  );

  const ORDER = ['.', 'r', 'o', 'y', 'g', 'b', 'p', 'k'];
  function legend(x, y, w) {
    const P = A.photo;
    const step = w / 8;
    return ORDER.map((ch, i) => {
      const cx = x + i * step;
      return `<rect x="${cx}" y="${y}" width="${step * 0.4}" height="${step * 0.4}" rx="5" fill="${P.palette[ch]}" stroke="#CBD5E1" stroke-width="2"/>` +
        `<text x="${cx + step * 0.46}" y="${y + step * 0.33}" font-size="${step * 0.32}" font-weight="900" fill="#2B2D42">=${P.numbers[ch]}</text>`;
    }).join('');
  }
  const robot = (x, y, s) =>
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<rect x="-6" y="-70" width="12" height="20" fill="#94A3B8"/><circle cx="0" cy="-74" r="8" fill="#F43F5E"/>` +
    `<rect x="-46" y="-52" width="92" height="70" rx="18" fill="#60A5FA"/><rect x="-34" y="-40" width="68" height="40" rx="10" fill="#1E293B"/>` +
    `<circle cx="-14" cy="-20" r="7" fill="#5EEAD4"/><circle cx="14" cy="-20" r="7" fill="#5EEAD4"/>` +
    `<g class="bb2-armL"><rect x="-74" y="30" width="30" height="12" rx="6" fill="#3B82F6"/></g><g class="bb2-armR"><rect x="44" y="30" width="30" height="12" rx="6" fill="#3B82F6"/></g>` +
    `<rect x="-40" y="22" width="80" height="70" rx="16" fill="#3B82F6"/><rect x="-18" y="40" width="36" height="26" rx="6" fill="#DBEAFE"/>` +
    `<rect x="-32" y="92" width="18" height="30" rx="6" fill="#1D4ED8"/><rect x="14" y="92" width="18" height="30" rx="6" fill="#1D4ED8"/></g>`;

  OT.registerBuilding({
    id: 2,
    key: 'fabrica',
    name: 'Fabrica de numere',
    color: '#F59E0B',
    dark: '#7C2D12',
    learned: 'Pe ecran, fiecare culoare e un amestec de lumină roșie, verde și albastră — iar telefonul o ține minte ca numere.',
    steps: [
      {
        text: 'Bine ai venit la <b>Fabrica de numere</b>! Aici lucrează un muncitor super-rapid. El face toate socotelile telefonului.',
        adult: 'procesorul',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#FFF7ED"/><rect y="350" width="800" height="100" fill="#FED7AA"/>' +
              A.gear(150, 150, 60, '#F59E0B', 10) + A.gear(250, 90, 36, '#FB923C', 8) + A.gear(660, 150, 56, '#F59E0B', 10) +
              '<rect x="300" y="40" width="200" height="60" rx="14" fill="#1E293B"/><text class="bb2-cnt" x="400" y="83" font-size="36" font-weight="900" text-anchor="middle" fill="#5EEAD4" font-family="monospace">0</text>' +
              robot(400, 250, 1.1) +
              '<rect x="80" y="370" width="640" height="26" rx="13" fill="#475569"/>' +
              [0, 1, 2, 3, 4, 5].map((i) => `<g class="bb2-box" data-i="${i}"><rect x="-22" y="-44" width="44" height="40" rx="8" fill="#FDBA74" stroke="#C2410C" stroke-width="3"/><text y="-16" font-size="22" font-weight="900" text-anchor="middle" fill="#7C2D12">${(i * 3 + 2) % 9}</text></g>`).join('')
          );
          const cnt = svg.querySelector('.bb2-cnt');
          const boxes = Array.from(svg.querySelectorAll('.bb2-box'));
          const armL = svg.querySelector('.bb2-armL');
          const armR = svg.querySelector('.bb2-armR');
          let n = 0;
          ctx.raf((t) => {
            n += 9137;
            cnt.textContent = String(n % 100000000);
            boxes.forEach((b, i) => {
              const x = 60 + ((t / 18 + i * 120) % 720);
              b.setAttribute('transform', `translate(${x.toFixed(1)} 372)`);
            });
            armL.setAttribute('transform', `translate(0 ${(Math.sin(t / 60) * 14).toFixed(1)})`);
            armR.setAttribute('transform', `translate(0 ${(Math.cos(t / 60) * 14).toFixed(1)})`);
          });
        },
      },
      {
        text: 'Telefonul nu vede culori, ca tine. Știe doar <b>numere</b>! Așa că fiecare culoare din desenul tău primește un număr — ca la cutia cu creioane numerotate.',
        adult: 'cod numeric pentru fiecare culoare',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#FFF7ED"/>' +
              `<g transform="translate(40 26)">${legend(0, 0, 720)}</g>` +
              '<rect x="60" y="250" width="680" height="24" rx="12" fill="#475569"/>' +
              '<rect x="310" y="150" width="180" height="150" rx="22" fill="#F59E0B" stroke="#C2410C" stroke-width="6"/>' + A.gear(400, 218, 34, '#C2410C', 9) +
              '<text x="400" y="140" font-size="24" font-weight="900" text-anchor="middle" fill="#7C2D12">culoare → număr</text>' +
              '<text x="150" y="330" font-size="24" font-weight="900" text-anchor="middle" fill="#7C2D12">intră culori</text><text x="650" y="330" font-size="24" font-weight="900" text-anchor="middle" fill="#7C2D12">ies numere</text>' +
              '<g class="bb2-items"></g>'
          );
          const items = svg.querySelector('.bb2-items');
          let k = 0;
          function one() {
            const ch = ORDER[k++ % ORDER.length];
            const g = OT.s('g');
            g.innerHTML = `<rect class="sq" x="-24" y="-48" width="48" height="48" rx="8" fill="${A.photo.palette[ch]}" stroke="#94A3B8" stroke-width="2"/>` +
              `<g class="num" opacity="0"><rect x="-24" y="-48" width="48" height="48" rx="8" fill="#fff" stroke="#C2410C" stroke-width="3"/><text y="-14" font-size="30" font-weight="900" text-anchor="middle" fill="#7C2D12">${A.photo.numbers[ch]}</text></g>`;
            items.appendChild(g);
            const sq = g.querySelector('.sq');
            const num = g.querySelector('.num');
            ctx.tween(5200, (p) => {
              const x = 80 + p * 640;
              g.setAttribute('transform', `translate(${x.toFixed(1)} 252)`);
              const hidden = x > 320 && x < 480;
              g.setAttribute('opacity', hidden ? '0' : '1');
              if (x >= 480) {
                sq.setAttribute('opacity', '0');
                num.setAttribute('opacity', '1');
              }
            }, (p) => p).then(() => g.remove());
          }
          one();
          ctx.interval(one, 1300);
        },
      },
      {
        text: 'Uite desenul tău! Pentru telefon, el e un tabel cu numere — ca un joc „colorează după numere”. Apasă pe „Arată numerele”!',
        adult: 'imagine digitală (un tabel de numere)',
        wait: true,
        hint: 'Apasă pe butonul „Arată numerele”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const S = 320;
          const svg = ctx.scene(`0 0 ${S + 200} ${S}`, '');
          let showNums = false;
          function draw() {
            svg.innerHTML =
              `<rect width="${S}" height="${S}" fill="#fff"/>` +
              (showNums
                ? `<g>${A.photoSVG({ size: S }).replace(/fill="[^"]+"/g, 'fill="#fff" stroke="#E2E8F0" stroke-width=".6"')}</g>` + numbersOnly()
                : A.photoSVG({ size: S })) +
              `<g transform="translate(${S + 24} 6)">` +
              ORDER.map((ch, i) => `<rect y="${i * 38}" width="30" height="30" rx="6" fill="${A.photo.palette[ch]}" stroke="#CBD5E1" stroke-width="2"/><text x="40" y="${i * 38 + 23}" font-size="22" font-weight="900" fill="#2B2D42">= ${A.photo.numbers[ch]}</text>`).join('') +
              '</g>';
          }
          function numbersOnly() {
            const c = S / 16;
            let m = '';
            for (let r = 0; r < 16; r++)
              for (let k = 0; k < 16; k++) {
                const ch = A.photo.rows[r][k];
                m += `<text x="${(k * c + c / 2).toFixed(1)}" y="${(r * c + c * 0.72).toFixed(1)}" font-size="${(c * 0.62).toFixed(1)}" font-weight="800" text-anchor="middle" fill="#2B2D42">${A.photo.numbers[ch]}</text>`;
              }
            return m;
          }
          draw();
          const btn = h('button', { class: 'big-btn', style: { background: '#F59E0B', color: '#fff' } }, '🔢 Arată numerele');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          btn.addEventListener('click', () => {
            showNums = !showNums;
            ctx.sfx('whoosh');
            OT.anim(svg, [{ transform: 'rotateY(0)' }, { transform: 'rotateY(90deg)' }, { transform: 'rotateY(0)' }], { duration: 700 });
            ctx.timeout(draw, 350);
            btn.textContent = showNums ? '🎨 Arată culorile' : '🔢 Arată numerele';
            if (!ctx.isDone) {
              ctx.setText('Vezi? Același desen, doar că scris cu <b>numere</b>. Telefonul ține minte numerele și, când vrei să vezi desenul, le transformă înapoi în culori.', 'imagine digitală (un tabel de numere)');
              ctx.done();
            }
          });
        },
      },
      {
        text: 'Surpriză pentru o pictoriță! Pe ecran, culorile nu se fac din vopsea, ci din <b>trei lumini</b>: roșie, verde și albastră. Aprinde luminile și vezi ce iese!',
        adult: 'RGB (roșu, verde, albastru)',
        wait: true,
        hint: 'Aprinde lumina roșie și pe cea verde, în același timp!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene(
            '0 0 800 380',
            '<rect width="800" height="380" rx="20" fill="#0F172A"/>' +
              '<g style="isolation:isolate">' +
              '<circle class="bb2-L" data-c="r" cx="330" cy="150" r="110" fill="#FF0000" style="mix-blend-mode:screen" opacity=".08"/>' +
              '<circle class="bb2-L" data-c="g" cx="470" cy="150" r="110" fill="#00FF00" style="mix-blend-mode:screen" opacity=".08"/>' +
              '<circle class="bb2-L" data-c="b" cx="400" cy="265" r="110" fill="#0000FF" style="mix-blend-mode:screen" opacity=".08"/></g>' +
              '<text class="bb2-res" x="400" y="40" font-size="28" font-weight="900" text-anchor="middle" fill="#fff"></text>'
          );
          const on = { r: false, g: false, b: false };
          const res = svg.querySelector('.bb2-res');
          const btns = {};
          const names = { r: '🔴 Roșu', g: '🟢 Verde', b: '🔵 Albastru' };
          const cols = { r: '#EF4444', g: '#22C55E', b: '#3B82F6' };
          const row = h('div', { class: 'st-controls' });
          Object.keys(names).forEach((c) => {
            const b = h('button', { class: 'big-btn', style: { border: '5px solid ' + cols[c] } }, names[c]);
            b.addEventListener('click', () => {
              on[c] = !on[c];
              ctx.sfx(on[c] ? 'pop' : 'tap');
              b.style.background = on[c] ? cols[c] : '#fff';
              b.style.color = on[c] ? '#fff' : '';
              update();
            });
            btns[c] = b;
            row.appendChild(b);
          });
          ctx.stage.appendChild(row);
          let saidYellow = false;
          function update() {
            svg.querySelectorAll('.bb2-L').forEach((el) => el.setAttribute('opacity', on[el.dataset.c] ? '1' : '.08'));
            const k = (on.r ? 'r' : '') + (on.g ? 'g' : '') + (on.b ? 'b' : '');
            const txt = { '': '', r: 'Roșu', g: 'Verde', b: 'Albastru', rg: 'Roșu + verde = GALBEN! 😮', rb: 'Roșu + albastru = roz-mov (magenta)', gb: 'Verde + albastru = turcoaz', rgb: 'Toate trei = ALB! ✨' }[k];
            res.textContent = txt;
            if (k === 'rg' && !saidYellow) {
              saidYellow = true;
              ctx.praise('Galben din lumină! 💡');
              ctx.setText('Ciudat, nu? Cu vopsea, roșu + verde dă maro. Cu <b>lumină</b>, roșu + verde dă <b>galben</b>! Și toate trei luminile aprinse fac <b>alb</b>.', 'RGB (roșu, verde, albastru) — amestec de lumini');
              ctx.done();
            }
          }
        },
      },
      {
        text: 'Provocare de pictoriță: amestecă cele trei lumini ca să obții culoarea din pătrățelul-model! Fiecare lumină are un număr de la 0 la 255.',
        adult: 'codul RGB al unei culori',
        wait: true,
        hint: 'Mișcă butoanele roșu, verde și albastru până se potrivesc culorile!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const T = [
            { name: 'galben ca soarele', c: [255, 220, 0] },
            { name: 'turcoaz ca marea', c: [0, 200, 200] },
            { name: 'mov ca o lavandă', c: [160, 40, 230] },
          ];
          let ti = 0;
          const v = [0, 0, 0];
          const svg = ctx.scene('0 0 800 300', '');
          function draw(ok) {
            const t = T[ti].c;
            svg.innerHTML =
              '<rect width="800" height="300" rx="20" fill="#FFF7ED"/>' +
              `<text x="220" y="40" font-size="26" font-weight="900" text-anchor="middle" fill="#7C2D12">Model: ${T[ti].name}</text>` +
              `<rect x="110" y="60" width="220" height="200" rx="24" fill="rgb(${t.join(',')})" stroke="#fff" stroke-width="8"/>` +
              '<text x="580" y="40" font-size="26" font-weight="900" text-anchor="middle" fill="#7C2D12">Culoarea ta</text>' +
              `<rect x="470" y="60" width="220" height="200" rx="24" fill="rgb(${v.join(',')})" stroke="${ok ? '#22C55E' : '#fff'}" stroke-width="8"/>` +
              `<text x="580" y="290" font-size="22" font-weight="900" text-anchor="middle" fill="#475569">${v.join(' · ')}</text>` +
              T.map((x, i) => `<circle cx="${370 + i * 30}" cy="285" r="9" fill="${i < ti ? '#22C55E' : i === ti ? '#F59E0B' : '#E2E8F0'}"/>`).join('');
          }
          const box = h('div', { class: 'bb2-mix' });
          const vals = [];
          [['🔴', '#EF4444'], ['🟢', '#22C55E'], ['🔵', '#3B82F6']].forEach(([ico, col], i) => {
            const r = h('input', { type: 'range', min: '0', max: '255', step: '5', value: '0', class: 'bb2-range', 'aria-label': ico });
            r.style.setProperty('--c', col);
            r.style.background = `linear-gradient(90deg, #000, ${col})`;
            const val = h('span', { class: 'bb2-val' }, '0');
            vals.push(val);
            r.addEventListener('input', () => {
              v[i] = +r.value;
              val.textContent = r.value;
              check();
            });
            box.appendChild(h('div', { class: 'bb2-row' }, h('span', { class: 'bb2-ico' }, ico), r, val));
          });
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, box));
          let busy = false;
          function check() {
            if (busy) return;
            const t = T[ti].c;
            const d = Math.hypot(v[0] - t[0], v[1] - t[1], v[2] - t[2]);
            draw(d < 75);
            if (d < 75) {
              busy = true;
              ctx.sfx('success');
              const c = OT.center(svg);
              OT.fx.burst('sparkles', c.x, c.y, 12);
              ctx.timeout(() => {
                ti++;
                busy = false;
                if (ti >= T.length) {
                  ti = T.length - 1;
                  draw(true);
                  ctx.praise('Bravo, Beatrice! 🎨');
                  ctx.setText('Super! Ai amestecat lumini ca un ecran adevărat. Pentru telefon, fiecare culoare e de fapt <b>trei numere</b>: cât roșu, cât verde și cât albastru.', 'codul RGB al unei culori');
                  ctx.done();
                } else {
                  ctx.setText('Perfect! Acum încearcă: <b>' + T[ti].name + '</b>.', 'codul RGB al unei culori');
                  draw(false);
                }
              }, 1200);
            }
          }
          draw(false);
        },
      },
    ],
  });
})();
