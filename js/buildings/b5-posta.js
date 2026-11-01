/* Clădirea 5 — Poșta (aplicația de mesaje) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  document.head.appendChild(
    h('style', {
      text:
        '.b5-float{animation:floaty 3s ease-in-out infinite}' +
        '.b5-float.d1{animation-delay:.7s}.b5-float.d2{animation-delay:1.4s}' +
        '.b5-photo{cursor:grab}' +
        '.b5-fb{min-height:1.3em;font-weight:900;font-size:clamp(16px,1.9vw,23px);text-align:center;color:#BE185D;padding:0 8px}' +
        '.b5-fb.ok{color:#15803D}' +
        '.choice .b5-av{width:46px;height:46px;border-radius:50%;background:#F3E8FF;flex:none}' +
        '.b5-pz{cursor:pointer;transition:transform .45s ease}' +
        '.b5-pz.drag{transition:none}' +
        '.b5-pz.sel .b5-frame{stroke:#FACC15;stroke-width:8}' +
        '@media (max-width:520px){.choice .b5-av{width:36px;height:36px}}' +
        '@media (max-width:700px) and (orientation:portrait){.stage.st-col.b45-safe{padding-bottom:64px}}' +
        '@media (orientation:landscape) and (max-height:540px){.stage.st-col.b45-safe.br .st-controls{padding-right:84px}.stage.st-col.b45-safe.bl .st-controls{padding-left:84px}' +
        '.b45-safe .choice{min-height:46px;padding:4px 12px;font-size:16px}.b45-safe .st-controls .big-btn{min-height:42px;font-size:16px}}',
    })
  );

  const ENV_FILLS = ['#FFFBEB', '#FCE7F3', '#E0F2FE', '#DCFCE7', '#FEF3C7'];

  OT.registerBuilding({
    id: 5,
    key: 'posta',
    name: 'Poșta',
    color: '#EF4444',
    dark: '#FFFFFF',
    learned: 'Poza se pune într-un plic cu adresa bunicii și se împarte în plicuri mici, numerotate.',
    bow: { top: '3%', left: '2%' },
    bunny: 'right',
    mission: {
      type: 'count',
      say: 'Maria, câte plicuri vezi? Numără și apasă pe cifra potrivită!',
      item: (i) => `<g transform="rotate(${[-8, 6, -4, 10, -10][i % 5]} 50 50)">${A.envelope(6, 22, 88, ENV_FILLS[i % 5])}</g>`,
      n: 5,
      max: 6,
      answer: 'Sunt cinci plicuri!',
      bg:
        '<rect width="800" height="420" fill="#FEE2E2"/><path d="M0 0 h800 v24 h-800z" fill="#FCA5A5"/>' +
        '<rect y="352" width="800" height="68" fill="#B45309"/><rect y="344" width="800" height="14" rx="4" fill="#D97706"/>' +
        '<g transform="translate(720 60)"><circle r="34" fill="#fff" stroke="#EF4444" stroke-width="6"/><path d="M0 0 v-20 M0 0 h14" stroke="#2B2D42" stroke-width="5" stroke-linecap="round"/></g>' +
        '<g transform="translate(40 250)"><path d="M10 100 h50 l-8 -50 h-34z" fill="#C2410C"/><ellipse cx="22" cy="30" rx="14" ry="30" fill="#22C55E" transform="rotate(-25 22 30)"/><ellipse cx="48" cy="30" rx="14" ry="30" fill="#16A34A" transform="rotate(25 48 30)"/></g>',
      positions: [
        [170, 120],
        [380, 95],
        [600, 130],
        [280, 280],
        [520, 285],
      ],
    },
    steps: [
      {
        text: 'Aceasta e <b>Poșta</b> orașului. Aici mesajele se pregătesc de drum, ca scrisorile pe care le trimiți prin poștă.',
        adult: 'aplicația de mesaje',
        render(ctx) {
          ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#E0F2FE"/><rect y="370" width="800" height="80" fill="#D9F99D"/>' +
              A.cloud(80, 40, 0.6) + A.cloud(560, 24, 0.5) +
              `<g transform="translate(270 90) scale(1.12)">${A.buildings.posta()}</g>` +
              `<g transform="translate(60 120) scale(.8)">${A.andrei()}</g>` +
              `<g transform="translate(150 170) rotate(-8)"><rect width="74" height="86" rx="6" fill="#fff" stroke="#CBD5E1" stroke-width="3"/>${A.photoSVG({ size: 62, x: 6, y: 6 })}</g>` +
              `<g class="b5-float"><g transform="translate(600 70) rotate(10)">${A.envelope(0, 0, 70, '#FCE7F3')}</g></g>` +
              `<g class="b5-float d1"><g transform="translate(680 150) rotate(-12)">${A.envelope(0, 0, 60)}</g></g>` +
              `<g class="b5-float d2"><g transform="translate(615 230) rotate(6)">${A.envelope(0, 0, 54, '#E0F2FE')}</g></g>`
          );
        },
      },
      {
        text: 'Mai întâi, poza intră într-un <b>plic</b>. Trage poza cățelului în plic (sau apasă pe ea)!',
        adult: 'atașarea pozei la mesaj',
        wait: true,
        hint: 'Trage poza cățelului în plicul deschis!',
        render(ctx) {
          const portrait = ctx.stage.clientHeight > ctx.stage.clientWidth * 1.1;
          const VW = portrait ? 400 : 800;
          const VH = portrait ? 620 : 450;
          const FX = portrait ? 100 : 90;
          const FY = portrait ? 24 : 120;
          const EX = portrait ? 60 : 450;
          const EY = portrait ? 395 : 200;
          const EW = 280;
          const CX = FX + 100;
          const CY = FY + 113;
          const m =
            `<rect width="${VW}" height="${VH}" fill="#FFF7ED"/><rect y="${VH - 40}" width="${VW}" height="40" fill="#FED7AA"/>` +
            `<g class="b5-env">${A.envelope(EX, EY, EW, '#FFFBEB', true)}</g>` +
            (portrait
              ? `<text class="b5-arrow hl-pulse" x="${CX}" y="${FY + 274}" font-size="44" font-weight="900" text-anchor="middle" fill="#EF4444">⬇</text>`
              : '<text class="b5-arrow hl-pulse" x="345" y="245" font-size="54" font-weight="900" text-anchor="middle" fill="#EF4444">➜</text>') +
            `<g class="b5-photo"><g class="b5-ph-in"><rect x="${FX}" y="${FY}" width="200" height="226" rx="10" fill="#fff" stroke="#CBD5E1" stroke-width="4"/>` +
            A.photoSVG({ size: 176, x: FX + 12, y: FY + 12 }) +
            `<text x="${CX}" y="${FY + 214}" font-size="20" font-weight="900" text-anchor="middle" fill="#64748B">🐶 pentru bunica</text></g></g>`;
          const svg = ctx.scene(`0 0 ${VW} ${VH}`, m);
          svg.style.touchAction = 'none';
          const photo = svg.querySelector('.b5-photo');
          const env = svg.querySelector('.b5-env');
          const arrow = svg.querySelector('.b5-arrow');
          let p = { x: 0, y: 0 };
          let inside = false;
          const place = (s) => photo.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})${s ? ` translate(${CX} ${CY}) scale(${s}) translate(${-CX} ${-CY})` : ''}`);
          function back() {
            const from = { x: p.x, y: p.y };
            ctx.tween(450, (k) => {
              p.x = from.x * (1 - k);
              p.y = from.y * (1 - k);
              place();
            });
          }
          async function insert() {
            inside = true;
            arrow.style.display = 'none';
            // centrul pozei merge spre centrul plicului
            const from = { x: p.x, y: p.y };
            const to = { x: EX + EW / 2 - CX, y: EY + EW * 0.33 - CY };
            ctx.sfx('whoosh');
            await ctx.tween(900, (k) => {
              p.x = OT.lerp(from.x, to.x, k);
              p.y = OT.lerp(from.y, to.y, k);
              place(1 - k * 0.6);
              photo.setAttribute('opacity', (1 - Math.max(0, k - 0.6) / 0.4).toFixed(2));
            });
            photo.style.display = 'none';
            env.innerHTML =
              A.envelope(EX, EY, EW, '#FFFBEB', false) +
              `<g transform="translate(${EX + 18} ${EY + 108})"><rect width="60" height="60" rx="6" fill="#fff" stroke="#CBD5E1" stroke-width="2"/>${A.photoSVG({ size: 52, x: 4, y: 4 })}</g>`;
            ctx.sfx('paper');
            OT.anim(env, [{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 500 });
            ctx.praise('Poza e în plic! ✉️');
            ctx.setText('Poza e în plic! Dar plicul încă nu știe unde să meargă. Are nevoie de o <b>adresă</b>.', 'atașarea pozei la mesaj');
            ctx.done();
          }
          let drag = false;
          let moved = false;
          let s0 = null;
          let o0 = null;
          ctx.on(photo, 'pointerdown', (e) => {
            if (inside) return;
            drag = true;
            moved = false;
            s0 = OT.svgPoint(svg, e);
            o0 = { x: p.x, y: p.y };
            try {
              photo.setPointerCapture(e.pointerId);
            } catch (er) {}
            ctx.sfx('tap');
          });
          ctx.on(photo, 'pointermove', (e) => {
            if (!drag) return;
            const q = OT.svgPoint(svg, e);
            if (Math.abs(q.x - s0.x) + Math.abs(q.y - s0.y) > 6) moved = true;
            p.x = o0.x + q.x - s0.x;
            p.y = o0.y + q.y - s0.y;
            place();
          });
          const end = () => {
            if (!drag) return;
            drag = false;
            if (inside) return;
            const cx = CX + p.x;
            const cy = CY + p.y;
            if (!moved || (cx > EX - 40 && cx < EX + EW + 40 && cy > EY - 110 && cy < EY + EW * 0.66 + 40)) insert();
            else back();
          };
          ctx.on(photo, 'pointerup', end);
          ctx.on(photo, 'pointercancel', end);
        },
      },
      {
        text: 'Pe plic scriem <b>adresa</b>. Fiecare telefon are o adresă, ca o casă. Cui trimitem poza?',
        adult: 'numărul de telefon (contactul)',
        wait: true,
        hint: 'Alege cui trimitem poza cățelului!',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b45-safe', 'br');
          const svg = ctx.scene(
            '0 0 800 330',
            '<rect width="800" height="330" fill="#FFF7ED"/>' +
              A.envelope(190, 20, 420, '#FFFBEB') +
              '<g transform="translate(518 42)"><rect width="70" height="80" rx="4" fill="#fff" stroke="#F59E0B" stroke-width="3" stroke-dasharray="6 4"/><g transform="translate(10 14) scale(.5)">' + A.heart('#F43F5E') + '</g></g>' +
              '<text x="232" y="250" font-size="30" font-weight="900" fill="#92400E">Către:</text><path d="M340 256 h230" stroke="#F59E0B" stroke-width="4" stroke-dasharray="8 6"/>' +
              '<text class="b5-to" x="455" y="246" font-size="36" font-weight="900" text-anchor="middle" fill="#6D28D9"></text>' +
              '<text class="b5-addr" x="455" y="284" font-size="22" font-weight="800" text-anchor="middle" fill="#7C2D12"></text>'
          );
          const to = svg.querySelector('.b5-to');
          const addr = svg.querySelector('.b5-addr');
          const fb = h('div', { class: 'b5-fb' });
          const row = h('div', { class: 'choice-row' });
          let solved = false;
          const opts = [
            { k: 'bunica', t: 'Bunica', ok: true },
            { k: 'mama', t: 'Mama', e: '👩', why: 'Mama e chiar aici, acasă, lângă tine! Poza asta e pentru bunica.' },
            { k: 'tata', t: 'Tata', e: '👨', why: 'Tata a văzut deja cățelul azi. Poza asta e pentru bunica!' },
            { k: 'necunoscut', t: 'Necunoscut', e: '❓', why: 'Nu trimitem poze necunoscuților! Alegem doar oameni pe care îi cunoaștem.' },
          ];
          OT.shuffle(opts).forEach((o) => {
            const b = h('button', { class: 'choice' });
            if (o.k === 'bunica') b.appendChild(OT.art.head('bunica', { class: 'b5-av' }));
            else b.appendChild(h('span', { class: 'ico' }, o.e));
            b.appendChild(h('span', {}, o.t));
            b.addEventListener('click', () => {
              if (solved) return;
              if (o.ok) {
                solved = true;
                b.classList.add('right');
                ctx.sfx('success');
                to.textContent = 'Bunica 💜';
                addr.textContent = '📍 telefonul bunicii';
                OT.anim(to, [{ opacity: 0 }, { opacity: 1 }], { duration: 700 });
                fb.className = 'b5-fb ok';
                fb.textContent = '✅ Da! Acum plicul știe unde să meargă: la telefonul bunicii.';
                ctx.setText('Bravo! Pe plic scrie acum adresa bunicii. Așa, poza nu se rătăcește prin oraș.', 'numărul de telefon (contactul)');
                ctx.done();
              } else {
                b.classList.remove('nope');
                void b.offsetWidth;
                b.classList.add('nope');
                ctx.sfx('hmm');
                fb.className = 'b5-fb';
                fb.textContent = (o.k === 'necunoscut' ? '🛑 ' : '💗 ') + o.why;
              }
            });
            row.appendChild(b);
          });
          ctx.stage.appendChild(h('div', { class: 'st-controls', style: { flexDirection: 'column', gap: '6px' } }, row, fb));
        },
      },
      {
        text: 'Poza e mare, așa că Poșta o taie în <b>bucăți mici</b>. Fiecare bucată primește plicul ei, cu un număr.',
        adult: 'pachete de date',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b45-safe', 'br');
          const S = 240;
          const PW = S / 3;
          const PH = S / 2;
          const X0 = 60;
          const Y0 = 90;
          const photo = A.photoSVG({ size: S });
          let m = '<rect width="800" height="420" fill="#FFF7ED"/>';
          // plicurile mici
          const envPos = [];
          for (let k = 0; k < 6; k++) {
            const ex = 400 + (k % 3) * 125;
            const ey = 70 + Math.floor(k / 3) * 160;
            envPos.push([ex, ey]);
            m += `<g class="b5-se" data-k="${k}">${A.envelope(ex, ey, 104, '#FFFBEB')}<circle cx="${ex + 92}" cy="${ey + 6}" r="17" fill="#EF4444" stroke="#fff" stroke-width="3"/><text x="${ex + 92}" y="${ey + 13}" font-size="20" font-weight="900" text-anchor="middle" fill="#fff">${k + 1}</text></g>`;
          }
          for (let k = 0; k < 6; k++) {
            const c = k % 3;
            const r = Math.floor(k / 3);
            m += `<g class="b5-pc" data-k="${k}" transform="translate(${X0 + c * PW} ${Y0 + r * PH})"><svg x="0" y="0" width="${PW}" height="${PH}" viewBox="${c * PW} ${r * PH} ${PW} ${PH}">${photo}</svg>` +
              `<g class="b5-num" opacity="0"><circle cx="16" cy="16" r="15" fill="#EF4444" stroke="#fff" stroke-width="3"/><text x="16" y="22" font-size="18" font-weight="900" text-anchor="middle" fill="#fff">${k + 1}</text></g></g>`;
          }
          m += `<g class="b5-cuts" opacity="0" stroke="#EF4444" stroke-width="4" stroke-dasharray="10 7"><path d="M${X0 + PW} ${Y0 - 10} v${S + 20}"/><path d="M${X0 + 2 * PW} ${Y0 - 10} v${S + 20}"/><path d="M${X0 - 10} ${Y0 + PH} h${S + 20}"/></g>`;
          m += `<text class="b5-sc" x="${X0 - 30}" y="${Y0 + PH + 12}" font-size="40" opacity="0">✂️</text>`;
          m += '<text class="b5-done" x="560" y="395" font-size="24" font-weight="900" text-anchor="middle" fill="#B91C1C" opacity="0">6 plicuri mici, cu numere de la 1 la 6</text>';
          const svg = ctx.scene('0 0 800 420', m);
          const pcs = Array.from(svg.querySelectorAll('.b5-pc'));
          const cuts = svg.querySelector('.b5-cuts');
          const sc = svg.querySelector('.b5-sc');
          const doneTxt = svg.querySelector('.b5-done');
          const again = h('button', { class: 'big-btn' }, '↻ Încă o dată');
          again.style.visibility = 'hidden';
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, again));
          const home = (k) => ({ x: X0 + (k % 3) * PW, y: Y0 + Math.floor(k / 3) * PH });
          const setT = (el, x, y, s) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s || 1).toFixed(3)})`);
          let running = false;
          async function play() {
            if (running) return;
            running = true;
            again.style.visibility = 'hidden';
            doneTxt.setAttribute('opacity', '0');
            pcs.forEach((p, k) => {
              const o = home(k);
              setT(p, o.x, o.y, 1);
              p.setAttribute('opacity', '1');
              p.querySelector('.b5-num').setAttribute('opacity', '0');
            });
            cuts.setAttribute('opacity', '0');
            sc.setAttribute('opacity', '0');
            await ctx.wait(900);
            // foarfeca taie
            sc.setAttribute('opacity', '1');
            await ctx.tween(1400, (k) => sc.setAttribute('x', (X0 - 30 + k * (S + 30)).toFixed(1)));
            ctx.sfx('paper');
            cuts.setAttribute('opacity', '1');
            sc.setAttribute('opacity', '0');
            await ctx.wait(500);
            // bucățile se depărtează și primesc numere
            await ctx.tween(900, (q) => {
              pcs.forEach((p, k) => {
                const o = home(k);
                const c = k % 3;
                const r = Math.floor(k / 3);
                setT(p, o.x + (c - 1) * 14 * q, o.y + (r - 0.5) * 18 * q, 1);
              });
            });
            cuts.setAttribute('opacity', '0');
            pcs.forEach((p) => p.querySelector('.b5-num').setAttribute('opacity', '1'));
            ctx.sfx('pop');
            await ctx.wait(1000);
            // fiecare bucată zboară în plicul ei
            for (let k = 0; k < 6; k++) {
              const p = pcs[k];
              const c = k % 3;
              const r = Math.floor(k / 3);
              const o = home(k);
              const from = { x: o.x + (c - 1) * 14, y: o.y + (r - 0.5) * 18 };
              const [ex, ey] = envPos[k];
              const to = { x: ex + 32, y: ey + 10 };
              ctx.sfx('whoosh');
              await ctx.tween(800, (q) => {
                setT(p, OT.lerp(from.x, to.x, q), OT.lerp(from.y, to.y, q) - Math.sin(Math.PI * q) * 60, 1 - q * 0.55);
                p.setAttribute('opacity', (1 - Math.max(0, q - 0.75) / 0.25).toFixed(2));
              });
              ctx.sfx('paper');
              const se = svg.querySelector(`.b5-se[data-k="${k}"]`);
              OT.anim(se, [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }], { duration: 400 });
              await ctx.wait(250);
            }
            doneTxt.setAttribute('opacity', '1');
            again.style.visibility = 'visible';
            running = false;
          }
          again.addEventListener('click', () => {
            ctx.sfx('tap');
            play();
          });
          play();
        },
      },
      {
        text: 'Provocare: plicurile au ajuns la bunica, dar bucățile sunt amestecate! Lipește poza la loc: atinge două bucăți ca să le schimbi între ele.',
        adult: 'refacerea pachetelor',
        wait: true,
        hint: 'Pune bucățile în ordine: 1, 2, 3 sus și 4, 5, 6 jos!',
        render(ctx) {
          const portrait = ctx.stage.clientHeight > ctx.stage.clientWidth * 1.1;
          const VW = portrait ? 400 : 800;
          // grila stă deasupra colțului cu iepurașul Elenei
          const VH = portrait ? 620 : 450;
          const S = 330;
          const PW = S / 3;
          const PH = S / 2;
          const G = portrait ? 8 : 10;
          const OX = portrait ? 27 : 280;
          const OY = portrait ? 182 : 55;
          const MX = portrait ? 150 : 50;
          const MY = portrait ? 50 : 120;
          const MS = portrait ? 100 : 160;
          const photo = A.photoSVG({ size: S });
          const slot = (i) => ({ x: OX + (i % 3) * (PW + G), y: OY + Math.floor(i / 3) * (PH + G) });
          let m = `<rect width="${VW}" height="${VH}" fill="#F5F3FF"/>`;
          m += `<g transform="translate(${MX} ${MY})"><rect x="-14" y="-44" width="${MS + 28}" height="${MS + 58}" rx="16" fill="#fff" stroke="#EF4444" stroke-width="4"/><text x="${MS / 2}" y="-14" font-size="22" font-weight="900" text-anchor="middle" fill="#7F1D1D">Model</text>${A.photoSVG({ size: MS })}</g>`;
          for (let i = 0; i < 6; i++) {
            const s = slot(i);
            m += `<rect x="${s.x}" y="${s.y}" width="${PW}" height="${PH}" rx="10" fill="#EDE9FE" stroke="#C4B5FD" stroke-width="3" stroke-dasharray="8 6"/>` +
              `<text x="${s.x + PW / 2}" y="${s.y + PH / 2 + 22}" font-size="64" font-weight="900" text-anchor="middle" fill="#DDD6FE">${i + 1}</text>`;
          }
          for (let k = 0; k < 6; k++) {
            const c = k % 3;
            const r = Math.floor(k / 3);
            m += `<g class="b5-pz" data-k="${k}"><svg x="0" y="0" width="${PW}" height="${PH}" viewBox="${c * PW} ${r * PH} ${PW} ${PH}">${photo}</svg>` +
              `<rect class="b5-frame" width="${PW}" height="${PH}" fill="none" stroke="#fff" stroke-width="4"/>` +
              `<g class="b5-num"><circle cx="22" cy="22" r="19" fill="#EF4444" stroke="#fff" stroke-width="3"/><text x="22" y="30" font-size="23" font-weight="900" text-anchor="middle" fill="#fff">${k + 1}</text></g></g>`;
          }
          const svg = ctx.scene(`0 0 ${VW} ${VH}`, m);
          svg.style.touchAction = 'none';
          const pcs = Array.from(svg.querySelectorAll('.b5-pz'));
          // amestecăm (niciodată deja rezolvat)
          let order;
          do order = OT.shuffle([0, 1, 2, 3, 4, 5]);
          while (order.filter((k, i) => k === i).length > 1);
          const posOf = {}; // piesa k -> slotul în care stă
          order.forEach((k, i) => (posOf[k] = i));
          const put = (k, gap) => {
            const s = slot(posOf[k]);
            const gx = gap === false ? (posOf[k] % 3) * -G : 0;
            const gy = gap === false ? Math.floor(posOf[k] / 3) * -G : 0;
            pcs[k].style.transform = `translate(${s.x + gx}px, ${s.y + gy}px)`;
          };
          pcs.forEach((p, k) => put(k));
          let sel = null;
          let solved = false;
          function swap(a, b) {
            const t = posOf[a];
            posOf[a] = posOf[b];
            posOf[b] = t;
            put(a);
            put(b);
            ctx.sfx('pop');
            check();
          }
          function check() {
            for (let k = 0; k < 6; k++) if (posOf[k] !== k) return;
            solved = true;
            ctx.timeout(() => {
              pcs.forEach((p, k) => {
                put(k, false);
                p.querySelector('.b5-num').style.transition = 'opacity .6s';
                p.querySelector('.b5-num').style.opacity = '0';
                p.querySelector('.b5-frame').setAttribute('stroke-width', '0');
              });
              ctx.praise('Bravo, Andrei! 🐶');
              ctx.setText('Bravo! Exact așa lipește telefonul bunicii bucățile la loc, după numere. Plicul e gata de zbor — mergem la <b>Aeroport</b>!', 'refacerea pachetelor');
              ctx.done();
            }, 500);
          }
          function select(k) {
            if (sel !== null) pcs[sel].classList.remove('sel');
            sel = k;
            if (k !== null) {
              pcs[k].classList.add('sel');
              // piesa aleasă vine deasupra
              pcs[k].parentNode.appendChild(pcs[k]);
            }
          }
          // atingere: alegi o bucată, apoi alta → se schimbă. Tragere: tragi o bucată peste alta.
          let down = null;
          let s0 = null;
          let moved = false;
          ctx.on(svg, 'pointerdown', (e) => {
            if (solved) return;
            const g = e.target.closest && e.target.closest('.b5-pz');
            if (!g) return;
            down = +g.dataset.k;
            s0 = { x: e.clientX, y: e.clientY };
            moved = false;
            try {
              svg.setPointerCapture(e.pointerId);
            } catch (er) {}
          });
          ctx.on(svg, 'pointermove', (e) => {
            if (down === null) return;
            const dx = e.clientX - s0.x;
            const dy = e.clientY - s0.y;
            if (!moved && Math.abs(dx) + Math.abs(dy) > 10) {
              moved = true;
              select(down);
              pcs[down].classList.add('drag');
              pcs[down].style.pointerEvents = 'none';
            }
            if (moved) {
              const a = OT.svgPoint(svg, { clientX: s0.x, clientY: s0.y });
              const b = OT.svgPoint(svg, e);
              const s = slot(posOf[down]);
              pcs[down].style.transform = `translate(${s.x + b.x - a.x}px, ${s.y + b.y - a.y}px)`;
            }
          });
          const up = (e) => {
            if (down === null) return;
            const k = down;
            down = null;
            if (moved) {
              pcs[k].classList.remove('drag');
              const under = document.elementFromPoint(e.clientX, e.clientY);
              pcs[k].style.pointerEvents = '';
              const g = under && under.closest && under.closest('.b5-pz');
              select(null);
              if (g && +g.dataset.k !== k) swap(k, +g.dataset.k);
              else put(k);
              return;
            }
            ctx.sfx('tap');
            if (sel === null) select(k);
            else if (sel === k) select(null);
            else {
              const a = sel;
              select(null);
              swap(a, k);
            }
          };
          ctx.on(svg, 'pointerup', up);
          ctx.on(svg, 'pointercancel', (e) => {
            if (down !== null) {
              pcs[down].classList.remove('drag');
              pcs[down].style.pointerEvents = '';
              put(down);
              down = null;
            }
          });
        },
      },
    ],
  });
})();
