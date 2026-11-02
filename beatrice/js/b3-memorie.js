/* Ediția Beatrice — Clădirea 3: Masa de lucru și Dulapul (memoria) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  const room = '<rect width="800" height="450" fill="#F5F3FF"/><rect y="360" width="800" height="90" fill="#DDD6FE"/>';
  const table = (x, y) =>
    `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="280" height="18" rx="6" fill="#B45309"/><rect x="16" y="18" width="16" height="110" fill="#92400E"/><rect x="248" y="18" width="16" height="110" fill="#92400E"/>` +
    `<rect x="70" y="-46" width="140" height="34" rx="17" fill="#fff" stroke="#A78BFA" stroke-width="4"/><text x="140" y="-22" font-size="22" font-weight="900" text-anchor="middle" fill="#5B21B6">Masa de lucru</text></g>`;
  const wardrobe = (x, y, open) =>
    `<g transform="translate(${x} ${y})"><path d="M-10 0 h220 l-14 -22 h-192z" fill="#7C3AED"/><rect x="0" y="0" width="200" height="290" rx="10" fill="#A78BFA"/>` +
    `<rect x="12" y="12" width="176" height="266" rx="8" fill="#EDE9FE"/>` +
    [70, 140, 210].map((yy) => `<rect x="12" y="${yy}" width="176" height="8" fill="#8B5CF6"/>`).join('') +
    `<g class="bb3-shelf">` +
    `<g transform="translate(28 22)"><rect width="40" height="44" rx="4" fill="#fff" stroke="#F59E0B" stroke-width="4"/><circle cx="20" cy="18" r="8" fill="#FACC15"/><path d="M4 40 l12 -14 l10 10 l10 -8 v12z" fill="#86EFAC"/></g>` +
    `<g transform="translate(82 26) scale(.4)">${A.note('#EC4899')}</g>` +
    `<g transform="translate(132 22)"><rect width="40" height="44" rx="4" fill="#fff" stroke="#3B82F6" stroke-width="4"/><path d="M8 34 q12 -24 24 0" stroke="#3B82F6" stroke-width="4" fill="none"/></g>` +
    `<g transform="translate(26 150)"><rect width="28" height="52" rx="3" fill="#EF4444"/><rect x="32" width="28" height="52" rx="3" fill="#3B82F6"/><rect x="64" width="28" height="52" rx="3" fill="#22C55E"/></g>` +
    `<g transform="translate(120 222)"><rect width="56" height="46" rx="6" fill="#FDE68A"/><text x="28" y="31" font-size="22" text-anchor="middle">🎮</text></g>` +
    `</g>` +
    `<rect class="bb3-slot" x="40" y="86" width="120" height="48" rx="8" fill="none" stroke="#F472B6" stroke-width="4" stroke-dasharray="10 8"/>` +
    `<g class="bb3-saved" opacity="0"><rect x="64" y="80" width="56" height="56" fill="#fff" stroke="#F472B6" stroke-width="3"/><g transform="translate(68 84)">${A.photoSVG({ size: 48 })}</g></g>` +
    (open
      ? ''
      : `<g class="bb3-doors"><rect x="6" y="6" width="94" height="278" rx="8" fill="#C4B5FD"/><rect x="100" y="6" width="94" height="278" rx="8" fill="#C4B5FD"/><circle cx="90" cy="150" r="6" fill="#6D28D9"/><circle cx="110" cy="150" r="6" fill="#6D28D9"/></g>`) +
    `<rect x="40" y="-62" width="120" height="34" rx="17" fill="#fff" stroke="#A78BFA" stroke-width="4"/><text x="100" y="-38" font-size="22" font-weight="900" text-anchor="middle" fill="#5B21B6">Dulapul</text></g>`;
  const drawingOnTable = (x, y, cls) =>
    `<g class="${cls || 'bb3-draw'}" transform="translate(${x} ${y})"><rect x="-4" y="-4" width="88" height="88" fill="#fff" stroke="#CBD5E1" stroke-width="3"/>${A.photoSVG({ size: 80 })}</g>`;
  const sketch = (x, y) =>
    `<g class="bb3-sketch" transform="translate(${x} ${y})"><rect width="80" height="80" fill="#FFFBEB" stroke="#CBD5E1" stroke-width="3"/>` +
    `<path d="M14 60 q14 -40 28 -10 t28 -20" stroke="#64748B" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="58" cy="24" r="10" fill="none" stroke="#F472B6" stroke-width="4"/>` +
    `<text x="40" y="100" font-size="15" font-weight="800" text-anchor="middle" fill="#64748B">schiță nesalvată</text></g>`;

  OT.registerBuilding({
    id: 3,
    key: 'dulap',
    name: 'Masa de lucru și Dulapul',
    color: '#A78BFA',
    dark: '#3B0764',
    learned: 'Ce e pe masa de lucru dispare când se stinge telefonul; ce salvezi în dulap rămâne.',
    steps: [
      {
        text: 'Telefonul are două locuri pentru lucruri. Primul e <b>masa de lucru</b>: aici stă desenul la care lucrezi chiar acum. E rapidă, dar mică.',
        adult: 'memoria de lucru (RAM)',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            room + table(60, 250) + drawingOnTable(90, 152) + sketch(200, 156) +
              `<g transform="translate(470 92) scale(.85)">${A.beatrice()}</g>` + wardrobe(600, 90) +
              '<g class="bb3-book" opacity="0"><rect x="0" y="0" width="70" height="56" rx="4" fill="#F59E0B" stroke="#B45309" stroke-width="3"/><text x="35" y="36" font-size="20" font-weight="900" text-anchor="middle" fill="#fff">📚</text></g>' +
              '<text class="bb3-full" x="200" y="120" font-size="24" font-weight="900" text-anchor="middle" fill="#DC2626" opacity="0">Nu mai e loc!</text>'
          );
          const book = svg.querySelector('.bb3-book');
          const full = svg.querySelector('.bb3-full');
          async function loop() {
            while (ctx.alive) {
              book.setAttribute('opacity', '1');
              await ctx.tween(1400, (p) => book.setAttribute('transform', `translate(${(360 - p * 70).toFixed(1)} ${(60 + p * 120).toFixed(1)})`));
              full.setAttribute('opacity', '1');
              ctx.sfx('hmm');
              await ctx.tween(900, (p) => book.setAttribute('transform', `translate(290 ${(180 + p * 170).toFixed(1)}) rotate(${(p * 60).toFixed(1)})`));
              book.setAttribute('opacity', '0');
              await ctx.wait(1400);
              full.setAttribute('opacity', '0');
              await ctx.wait(800);
            }
          }
          loop();
        },
      },
      {
        text: 'Al doilea loc e <b>dulapul</b> — ca mapa ta cu desene terminate. E uriaș și păstrează lucrurile mult timp: desene, poze, cântece, jocuri.',
        adult: 'memoria de stocare',
        render(ctx) {
          const svg = ctx.scene('0 0 800 450', room + `<g transform="translate(60 120) scale(.9)">${A.beatrice()}</g>` + wardrobe(300, 110) + `<g transform="translate(560 140) scale(.9)">${A.easel()}</g>`);
          const doors = svg.querySelector('.bb3-doors');
          ctx.timeout(() => {
            ctx.sfx('whoosh');
            OT.anim(doors, [{ opacity: 1, transform: 'scaleX(1)' }, { opacity: 0, transform: 'scaleX(0.1)' }], { duration: 1800, fill: 'forwards', easing: 'ease-in-out' });
          }, 700);
          doors.style.transformBox = 'fill-box';
          doors.style.transformOrigin = 'center';
        },
      },
      {
        text: 'Desenul tău e încă doar pe masă. Apasă pe <b>„💾 Salvează”</b> ca să-l pui în dulap, la păstrare!',
        adult: 'salvarea unui fișier',
        wait: true,
        hint: 'Apasă pe butonul „💾 Salvează”!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene('0 0 800 450', room + table(60, 260) + drawingOnTable(90, 162) + sketch(210, 166) + wardrobe(520, 110, true) + '<path class="bb3-arc" d="M140 160 Q360 0 610 210" stroke="#F472B6" stroke-width="5" stroke-dasharray="12 10" fill="none" opacity="0"/>');
          const btn = h('button', { class: 'big-btn', style: { background: '#8B5CF6', color: '#fff' } }, '💾 Salvează desenul');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          btn.addEventListener('click', async () => {
            if (ctx.mem.saved && ctx.isDone) return;
            btn.disabled = true;
            ctx.sfx('whoosh');
            svg.querySelector('.bb3-arc').setAttribute('opacity', '1');
            const fly = OT.s('g', { class: 'bb3-fly' });
            fly.innerHTML = `<rect x="-4" y="-4" width="88" height="88" fill="#fff" stroke="#F472B6" stroke-width="3"/>${A.photoSVG({ size: 80 })}`;
            svg.appendChild(fly);
            await ctx.tween(1600, (p) => {
              const x = (1 - p) * (1 - p) * 90 + 2 * (1 - p) * p * 330 + p * p * 584;
              const y = (1 - p) * (1 - p) * 162 + 2 * (1 - p) * p * 0 + p * p * 190;
              const s = 1 - p * 0.4;
              fly.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`);
            });
            fly.remove();
            svg.querySelector('.bb3-saved').setAttribute('opacity', '1');
            svg.querySelector('.bb3-slot').setAttribute('opacity', '0');
            ctx.sfx('success');
            ctx.mem.saved = true;
            ctx.setText('Gata! O <b>copie</b> a desenului e acum în dulap. Schița mică de pe masă n-ai salvat-o… vom vedea ce pățește!', 'salvarea unui fișier');
            ctx.done();
          });
        },
      },
      {
        text: 'Acum apasă pe <b>„Stinge telefonul”</b>. Ce crezi că se întâmplă cu lucrurile de pe masă și din dulap?',
        adult: 'memoria de lucru se golește fără curent',
        wait: true,
        hint: 'Stinge telefonul, apoi aprinde-l din nou!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const svg = ctx.scene(
            '0 0 800 450',
            room + table(60, 260) + drawingOnTable(90, 162) + sketch(210, 166) + wardrobe(520, 110, true) +
              '<rect class="bb3-dark" width="800" height="450" fill="#0F172A" opacity="0" pointer-events="none"/>' +
              '<text class="bb3-zzz" x="400" y="230" font-size="60" text-anchor="middle" fill="#fff" opacity="0">💤</text>'
          );
          svg.querySelector('.bb3-saved').setAttribute('opacity', '1');
          svg.querySelector('.bb3-slot').setAttribute('opacity', '0');
          const btn = h('button', { class: 'big-btn', style: { background: '#1E293B', color: '#fff' } }, '⏻ Stinge telefonul');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          let state = 'on';
          const dark = svg.querySelector('.bb3-dark');
          const zzz = svg.querySelector('.bb3-zzz');
          btn.addEventListener('click', async () => {
            if (state === 'busy') return;
            if (state === 'on') {
              state = 'busy';
              ctx.sfx('powerOff');
              ['.bb3-draw', '.bb3-sketch'].forEach((sel) => {
                const el = svg.querySelector(sel);
                if (!el) return;
                const c = OT.center(el);
                OT.fx.burst('sparkles', c.x, c.y, 8, { size: 26, spread: 80 });
                el.setAttribute('opacity', '0');
              });
              await ctx.tween(1500, (p) => dark.setAttribute('opacity', (p * 0.85).toFixed(2)));
              zzz.setAttribute('opacity', '1');
              btn.textContent = '⏻ Aprinde telefonul';
              state = 'off';
            } else if (state === 'off') {
              state = 'busy';
              ctx.sfx('powerOn');
              zzz.setAttribute('opacity', '0');
              await ctx.tween(1500, (p) => dark.setAttribute('opacity', ((1 - p) * 0.85).toFixed(2)));
              const saved = svg.querySelector('.bb3-saved');
              const c = OT.center(saved);
              OT.fx.burst('stars', c.x, c.y, 10);
              ctx.setText('Vezi? <b>Masa s-a golit</b> — și schița nesalvată a dispărut. Dar desenul din <b>dulap</b> e la locul lui! De aceea apăsăm pe „Salvează”.', 'memoria de lucru se golește fără curent');
              ctx.done();
              btn.textContent = '🔁 Încă o dată';
              state = 'again';
            } else {
              ctx.sfx('tap');
              svg.querySelector('.bb3-draw').setAttribute('opacity', '1');
              svg.querySelector('.bb3-sketch').setAttribute('opacity', '1');
              btn.textContent = '⏻ Stinge telefonul';
              state = 'on';
            }
          });
        },
      },
      {
        text: 'Provocare: răspunde la trei întrebări despre masa de lucru și dulap!',
        adult: 'memorie de lucru și memorie de stocare',
        wait: true,
        hint: 'Răspunde la toate cele trei întrebări!',
        render(ctx) {
          OT.kit.quiz(
            ctx,
            [
              {
                q: 'Desenai și s-a terminat bateria înainte să salvezi. Mai e desenul?',
                pic: '🎨 🔋❌',
                options: [
                  { t: 'Nu, s-a pierdut', ico: '😢', ok: true, why: 'Exact! Era doar pe masa de lucru, iar masa se golește când se stinge telefonul. Salvează des!' },
                  { t: 'Da, e în dulap', ico: '🗄️', why: 'Nu l-ai pus în dulap — nu ai apăsat „Salvează”. Mai gândește-te!' },
                ],
              },
              {
                q: 'Ai salvat desenul cu pisica ieri. Azi aprinzi telefonul. Îl găsești?',
                pic: '🐱 💾',
                options: [
                  { t: 'Da, e în dulap', ico: '🗄️', ok: true, why: 'Da! Ce e salvat în dulap rămâne și după ce telefonul se stinge.' },
                  { t: 'Nu, a dispărut', ico: '💨', why: 'Lucrurile salvate nu dispar când stingi telefonul. Mai încearcă!' },
                ],
              },
              {
                q: 'Unde încap sute de desene, cântece și poze?',
                pic: '🖼️🎵📷',
                options: [
                  { t: 'În dulap', ico: '🗄️', ok: true, why: 'Corect! Dulapul e uriaș. Masa de lucru e mică — ține doar ce folosești acum.' },
                  { t: 'Pe masa de lucru', ico: '🪑', why: 'Masa e rapidă, dar mică. Lucrurile multe stau în altă parte…' },
                ],
              },
            ],
            () => {
              ctx.setText('Bravo, Beatrice! Acum știi secretul: <b>salvează des</b>, ca desenele tale să ajungă în dulap!', 'memorie de lucru și memorie de stocare');
              ctx.done();
            },
            { endPic: '💾🏆', endText: 'Ai răspuns la toate! Ești o artistă care salvează des!' }
          );
        },
      },
    ],
  });
})();
