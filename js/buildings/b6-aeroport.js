/* Clădirea 6 — Aeroportul (antena) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  document.head.appendChild(
    h('style', {
      text:
        '.b6-node{cursor:pointer}' +
        '.b6-node .b6-in{transform-box:fill-box;transform-origin:center}' +
        '.b6-node.ok .b6-ring{stroke:#22C55E;fill:#DCFCE7}' +
        '.b6-hint .b6-in{animation:pulse .9s ease-in-out 4}' +
        '.b6-blink{animation:b6blink 1.2s ease-in-out infinite}' +
        '@keyframes b6blink{0%,100%{opacity:1}50%{opacity:.25}}' +
        '.b6-typing circle{animation:b6blink 1s ease-in-out infinite}' +
        '.b6-typing circle:nth-child(2){animation-delay:.2s}.b6-typing circle:nth-child(3){animation-delay:.4s}',
    })
  );

  /* plic cu aripioare (centrat în 0,0, lățime ≈ 60) */
  const wingedEnv = (fill) =>
    '<path d="M-28 -4 l-26 -16 l6 20z M28 -4 l26 -16 l-6 20z" fill="#fff" stroke="#93C5FD" stroke-width="3" stroke-linejoin="round"/>' +
    A.envelope(-30, -20, 60, fill);
  /* bifă (✓) desenată, colț stânga-sus în 0,0 */
  const tick = (x, y, cls) => `<path class="${cls || ''}" d="M${x} ${y + 7} l5 5 l10 -12" stroke="#94A3B8" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  /* capul bunicii într-un cerc (pentru ecrane mici) */
  const granHead = (x, y, s) =>
    `<g transform="translate(${x} ${y})"><circle r="${s / 2}" fill="#F3E8FF"/><svg x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" viewBox="46 20 108 120">${A.bunica()}</svg></g>`;
  const andreiHead = (x, y, s) =>
    `<g transform="translate(${x} ${y})"><circle r="${s / 2}" fill="#DBEAFE"/><svg x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" viewBox="42 24 116 116">${A.andrei()}</svg></g>`;
  const sky = (hgt) => `<rect width="800" height="${hgt}" fill="#DBEAFE"/>`;

  /* ----- harta drumului (pasul 5) ----- */
  const STOPS = [
    { name: 'Telefonul lui Andrei', icon: () => A.phone(-22, -38, 44, 76, `<rect width="38" height="65" rx="5" fill="#E0F2FE"/>` + A.photoSVG({ size: 30, x: 4, y: 18 })) },
    { name: 'Turnul din oraș', icon: () => A.tower(0, 40, 0.48) },
    { name: 'Cablul', icon: () => '<path d="M-36 6 q9 -28 18 0 t18 0 t18 0 t18 0" stroke="#334155" stroke-width="9" fill="none" stroke-linecap="round"/><circle class="b6-blink" cx="-18" cy="6" r="5" fill="#FDE047"/><circle class="b6-blink" cx="18" cy="6" r="5" fill="#FDE047"/>' },
    { name: 'Turnul bunicii', icon: () => A.tower(-6, 40, 0.48) + `<g transform="translate(14 -36) scale(.26)">${A.heart()}</g>` },
    { name: 'Telefonul bunicii', icon: () => A.phone(-22, -38, 44, 76, '<rect width="38" height="65" rx="5" fill="#F3E8FF"/>') + granHead(0, 0, 34) },
  ];
  const SLOTS = [
    [150, 120],
    [400, 100],
    [650, 130],
    [270, 315],
    [540, 315],
  ];
  // pentru ecrane înguste (telefon ținut vertical)
  const SLOTS_P = [
    [110, 105],
    [330, 215],
    [110, 335],
    [330, 450],
    [220, 580],
  ];

  OT.registerBuilding({
    id: 6,
    key: 'aeroport',
    name: 'Aeroportul',
    color: '#60A5FA',
    dark: '#1E3A8A',
    learned: 'Plicurile zboară prin aer până la un turn, apoi prin cabluri până la telefonul bunicii. ✓✓ înseamnă că au ajuns.',
    bow: { top: '3%', right: '2%' },
    bunny: 'left',
    mission: {
      type: 'stars',
      say: 'Maria, pe cer s-au ascuns trei steluțe! Le găsești? Atinge-le!',
      scene:
        '<rect width="800" height="450" fill="#BAE6FD"/><rect y="250" width="800" height="110" fill="#DBEAFE" opacity=".5"/>' +
        '<g transform="translate(70 66)"><circle r="40" fill="#FDE047"/><circle r="52" fill="#FDE047" opacity=".25"/></g>' +
        '<rect y="360" width="800" height="90" fill="#86EFAC"/><rect y="384" width="800" height="44" fill="#94A3B8"/>' +
        [40, 160, 280, 400, 520, 640, 760].map((x) => `<rect x="${x}" y="402" width="60" height="8" rx="4" fill="#fff"/>`).join('') +
        '<rect x="30" y="300" width="200" height="64" rx="10" fill="#93C5FD"/><rect x="30" y="292" width="200" height="12" rx="5" fill="#3B82F6"/>' +
        [46, 86, 126, 166, 200].map((x) => `<rect x="${x}" y="316" width="22" height="22" rx="4" fill="#FEF3C7"/>`).join('') +
        '<rect x="634" y="170" width="44" height="194" fill="#60A5FA"/><path d="M606 172 h100 l-10 -46 h-80z" fill="#1D4ED8"/>' +
        '<rect x="622" y="138" width="26" height="22" rx="3" fill="#FEF3C7"/><rect x="664" y="138" width="26" height="22" rx="3" fill="#FEF3C7"/>' +
        '<line x1="656" y1="126" x2="656" y2="92" stroke="#374151" stroke-width="5"/>' +
        A.cloud(150, 70, 1.25) +
        A.cloud(470, 40, 0.9) +
        A.plane(410, 225, 1.7) +
        A.cloud(250, 230, 0.8, '#F8FAFC'),
      stars: [
        [292, 112, 23],
        [372, 186, 21],
        [656, 74, 23],
      ],
      answer: 'Ai găsit toate steluțele de pe cer!',
    },
    steps: [
      /* 1 — avioane invizibile */
      {
        text: 'Plicurile pleacă de la Aeroport. Ele zboară prin aer, dar sunt <b>nevăzute</b> — ca niște avioane invizibile!',
        adult: 'antena telefonului · unde radio',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          let m = sky(450) + '<rect y="360" width="800" height="90" fill="#86EFAC"/>' + A.cloud(560, 40, 0.9) + A.cloud(330, 110, 0.6);
          m += `<g transform="translate(50 120) scale(1.0)">${A.buildings.aeroport()}</g>`;
          m += '<g class="envs"></g>';
          const svg = ctx.scene('0 0 800 450', m);
          svg.style.overflow = 'hidden';
          const envs = svg.querySelector('.envs');
          const flyers = [];
          for (let i = 0; i < 4; i++) {
            const g = OT.s('g', { opacity: '0.18' });
            g.innerHTML = wingedEnv();
            envs.appendChild(g);
            flyers.push({ g, t: i * 0.25 });
          }
          let visible = false;
          const btn = h('button', { class: 'big-btn blue' }, '👓 Ochelari magici');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          btn.addEventListener('click', () => {
            visible = !visible;
            ctx.sfx(visible ? 'star' : 'tap');
            btn.textContent = visible ? '🙈 Ascunde plicurile' : '👓 Ochelari magici';
            flyers.forEach((f) => f.g.setAttribute('opacity', visible ? '1' : '0.18'));
            if (visible) ctx.setText('Cu ochelarii magici le vezi! În realitate, plicurile zboară nevăzute și foarte, foarte repede.', 'antena telefonului · unde radio');
          });
          let last = performance.now();
          ctx.raf((t) => {
            const dt = (t - last) / 1000;
            last = t;
            flyers.forEach((f) => {
              f.t = (f.t + dt * 0.09) % 1;
              const x = 250 + f.t * 500;
              const y = 150 - Math.sin(f.t * Math.PI) * 90 + Math.sin(f.t * 12) * 8;
              f.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(Math.cos(f.t * 12) * 6).toFixed(1)}) scale(.9)`);
            });
          });
        },
      },
      /* 2 — antena trimite la turn */
      {
        text: 'Antena telefonului trimite plicurile până la un <b>turn înalt</b> de lângă oraș. Ele merg prin aer, ca niște valuri nevăzute.',
        adult: 'turn de telefonie mobilă (antenă)',
        render(ctx) {
          let m = sky(450) + '<rect y="380" width="800" height="70" fill="#86EFAC"/>' + A.cloud(330, 30, 0.7);
          m += `<g transform="translate(40 70) scale(.95)">${A.andrei()}</g>`;
          m += `<g transform="translate(170 200) rotate(-6)">${A.phone(0, 0, 50, 86, '<rect width="44" height="74" rx="5" fill="#E0F2FE"/>' + A.photoSVG({ size: 36, x: 4, y: 18 }))}</g>`;
          m += '<g class="waves" fill="none" stroke="#3B82F6" stroke-linecap="round"></g>';
          m += `<g transform="translate(660 395) scale(1.45)">${A.tower(0, 0, 1)}</g>`;
          m += '<circle class="b6-blink" cx="660" cy="163" r="12" fill="#EF4444" opacity=".5"/>';
          m += '<g class="env" opacity="0">' + wingedEnv() + '</g>';
          const svg = ctx.scene('0 0 800 450', m);
          const wv = svg.querySelector('.waves');
          const arcs = [];
          for (let i = 0; i < 4; i++) {
            const p = OT.s('path', { 'stroke-width': '7' });
            wv.appendChild(p);
            arcs.push(p);
          }
          const env = svg.querySelector('.env');
          const cx = 205;
          const cy = 220;
          const t0 = performance.now();
          ctx.raf((t) => {
            const s = (t - t0) / 1000;
            arcs.forEach((p, i) => {
              const k = ((s * 0.35 + i / arcs.length) % 1);
              const r = 20 + k * 430;
              const a = 0.42;
              const x1 = cx + r * Math.cos(-a);
              const y1 = cy + r * Math.sin(-a) - k * 50;
              const x2 = cx + r * Math.cos(a);
              const y2 = cy + r * Math.sin(a) - k * 50;
              p.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`);
              p.setAttribute('opacity', (1 - k).toFixed(2));
            });
            const k = (s % 4.5) / 4.5;
            if (k < 0.85) {
              const q = k / 0.85;
              const x = OT.lerp(225, 640, q);
              const y = OT.lerp(210, 170, q) - Math.sin(q * Math.PI) * 60;
              env.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(.8)`);
              env.setAttribute('opacity', (q < 0.1 ? q * 10 : q > 0.9 ? (1 - q) * 10 : 1).toFixed(2));
            } else env.setAttribute('opacity', '0');
          });
        },
      },
      /* 3 — cabluri sub pământ și sub mare */
      {
        text: 'De la turn, plicurile merg prin <b>cabluri lungi</b> — pe sub pământ și chiar pe sub mare — până la turnul de lângă bunica.',
        adult: 'cabluri de fibră optică · internet',
        render(ctx) {
          let m = '<rect width="800" height="450" fill="#DBEAFE"/>';
          m += '<rect y="200" width="270" height="250" fill="#B45309"/><rect y="190" width="270" height="22" fill="#4ADE80"/>';
          m += '<rect x="560" y="200" width="240" height="250" fill="#B45309"/><rect x="560" y="190" width="240" height="22" fill="#4ADE80"/>';
          m += '<rect x="270" y="210" width="290" height="240" fill="#38BDF8"/><path d="M270 212 q18 -12 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0" fill="#7DD3FC"/>';
          m += '<path d="M270 430 q140 -30 290 0 v20 h-290z" fill="#FDE68A"/>';
          m += '<g class="fish"><g class="f1"><path d="M0 0 q18 -14 36 0 q-18 14 -36 0z M36 0 l14 -10 v20z" fill="#FB923C"/><circle cx="10" cy="-2" r="3" fill="#2B2D42"/></g>' +
            '<g class="f2"><path d="M0 0 q14 -10 28 0 q-14 10 -28 0z M28 0 l11 -8 v16z" fill="#F472B6"/><circle cx="8" cy="-2" r="2.5" fill="#2B2D42"/></g></g>';
          m += '<g transform="translate(20 110) scale(.32)">' + A.buildings.studio() + '</g><g transform="translate(70 120) scale(.3)">' + A.buildings.posta() + '</g>';
          m += `<g transform="translate(190 200) scale(.75)">${A.tower(0, 0, 1)}</g>`;
          m += `<g transform="translate(620 120) scale(.32)">${A.buildings.bunica()}</g>`;
          m += `<g transform="translate(700 200) scale(.75)">${A.tower(0, 0, 1)}</g>`;
          const d = 'M190 205 V300 Q210 380 300 412 H520 Q600 400 640 330 Q700 300 700 205';
          m += `<path d="${d}" stroke="#1E293B" stroke-width="14" fill="none" stroke-linejoin="round"/><path class="cable" d="${d}" stroke="#475569" stroke-width="6" fill="none"/>`;
          m += '<g class="dots"></g>';
          m += '<g font-size="22" font-weight="900" fill="#fff" text-anchor="middle"><text x="120" y="300">sub pământ</text><text x="415" y="300">sub mare</text><text x="690" y="420">sub pământ</text></g>';
          const svg = ctx.scene('0 0 800 450', m);
          const cable = svg.querySelector('.cable');
          const L = cable.getTotalLength();
          const dots = svg.querySelector('.dots');
          const pts = [];
          for (let i = 0; i < 6; i++) {
            const c = OT.s('circle', { r: '8', fill: '#FDE047', stroke: '#F59E0B', 'stroke-width': '2' });
            dots.appendChild(c);
            pts.push(c);
          }
          const f1 = svg.querySelector('.f1');
          const f2 = svg.querySelector('.f2');
          const t0 = performance.now();
          ctx.raf((t) => {
            const s = (t - t0) / 1000;
            pts.forEach((c, i) => {
              const k = (s * 0.08 + i / pts.length) % 1;
              const p = cable.getPointAtLength(k * L);
              c.setAttribute('cx', p.x.toFixed(1));
              c.setAttribute('cy', p.y.toFixed(1));
            });
            f1.setAttribute('transform', `translate(${(290 + ((s * 25) % 230)).toFixed(1)} ${(330 + Math.sin(s) * 10).toFixed(1)})`);
            f2.setAttribute('transform', `translate(${(520 - ((s * 18 + 100) % 230)).toFixed(1)} ${(270 + Math.sin(s * 1.3) * 8).toFixed(1)}) scale(-1 1)`);
          });
        },
      },
      /* 4 — trimite poza, ✓✓ */
      {
        text: 'Hai să trimitem poza la bunica! Apasă pe <b>„Trimite!”</b> și urmărește plicul.',
        adult: 'confirmare de livrare',
        wait: true,
        hint: 'Apasă pe butonul „Trimite!”.',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          let m = sky(300) + '<rect y="300" width="800" height="150" fill="#C08552"/><rect y="292" width="800" height="14" fill="#4ADE80"/>' + A.cloud(330, 20, 0.6);
          // cablul de sub pământ
          m += '<path d="M290 300 V398 H510 V300" stroke="#1E293B" stroke-width="12" fill="none"/><path d="M290 300 V398 H510 V300" stroke="#475569" stroke-width="5" fill="none"/>';
          m += A.tower(290, 300, 1) + A.tower(510, 300, 1);
          // telefonul lui Andrei
          m += A.phone(24, 30, 160, 262, '');
          m += '<g transform="translate(35 46)">' +
            '<rect width="138" height="36" rx="10" fill="#DBEAFE"/>' + granHead(20, 18, 28) + '<text x="40" y="24" font-size="15" font-weight="900" fill="#1E3A8A">Bunica</text>' +
            '<g class="a-bubble" opacity="0"><rect x="34" y="56" width="98" height="114" rx="14" fill="#BBF7D0"/>' + A.photoSVG({ size: 80, x: 43, y: 64 }) +
            tick(92, 148, 't1') + tick(101, 148, 't2') + '</g></g>';
          // telefonul bunicii
          m += A.phone(616, 30, 160, 262, '');
          m += '<g transform="translate(627 46)">' +
            '<rect width="138" height="36" rx="10" fill="#F3E8FF"/>' + andreiHead(20, 18, 28) + '<text x="40" y="24" font-size="15" font-weight="900" fill="#6D28D9">Andrei</text>' +
            '<g class="g-bubble" opacity="0"><rect x="6" y="56" width="98" height="104" rx="14" fill="#fff" stroke="#E9D5FF" stroke-width="2"/>' + A.photoSVG({ size: 80, x: 15, y: 64 }) + '</g>' +
            '<g class="b6-typing" opacity="0" transform="translate(6 176)"><rect width="70" height="34" rx="14" fill="#fff" stroke="#E9D5FF" stroke-width="2"/><circle cx="20" cy="17" r="5" fill="#94A3B8"/><circle cx="35" cy="17" r="5" fill="#94A3B8"/><circle cx="50" cy="17" r="5" fill="#94A3B8"/></g></g>';
          m += '<g class="g-ding" opacity="0"><circle cx="760" cy="40" r="26" fill="#F43F5E"/><text x="760" y="49" font-size="24" font-weight="900" text-anchor="middle" fill="#fff">1</text></g>';
          // valuri în aer
          m += '<g class="wv1" opacity="0" fill="none" stroke="#3B82F6" stroke-width="5" stroke-linecap="round"><path d="M200 120 q12 14 0 28"/><path d="M214 108 q22 26 0 52"/><path d="M228 96 q32 38 0 76"/></g>';
          m += '<g class="wv2" opacity="0" fill="none" stroke="#3B82F6" stroke-width="5" stroke-linecap="round"><path d="M548 120 q12 14 0 28"/><path d="M562 108 q22 26 0 52"/><path d="M576 96 q32 38 0 76"/></g>';
          const route = 'M175 150 Q235 70 290 132 L290 300 L290 398 L510 398 L510 300 L510 132 Q565 70 640 150';
          m += `<path class="route" d="${route}" fill="none" stroke="none"/>`;
          m += '<g class="env" opacity="0">' + wingedEnv() + '</g>';
          const svg = ctx.scene('0 0 800 450', m);
          const btn = h('button', { class: 'big-btn primary' }, '✉️ Trimite!');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          const route$ = svg.querySelector('.route');
          const L = route$.getTotalLength();
          const env = svg.querySelector('.env');
          const $ = (s) => svg.querySelector(s);
          let busy = false;
          let sent = 0;
          async function send() {
            if (busy) return;
            busy = true;
            btn.disabled = true;
            sent++;
            // pregătire
            ['.g-bubble', '.b6-typing', '.g-ding', '.t2'].forEach((s) => $(s).setAttribute('opacity', '0'));
            $('.t1').setAttribute('stroke', '#94A3B8');
            $('.t2').setAttribute('stroke', '#94A3B8');
            $('.a-bubble').setAttribute('opacity', '1');
            OT.anim($('.a-bubble'), [{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
            ctx.sfx('paper');
            ctx.setText('Plicul a plecat! Vezi bifa ✓ de lângă poză? Înseamnă: <b>„a plecat de la mine”</b>.', 'confirmare de livrare');
            await ctx.wait(1200);
            ctx.sfx('whoosh');
            $('.wv1').setAttribute('opacity', '1');
            env.setAttribute('opacity', '1');
            let wv2 = false;
            await ctx.tween(
              7500,
              (p) => {
                const pt = route$.getPointAtLength(p * L);
                env.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) scale(.7)`);
                if (p > 0.18) $('.wv1').setAttribute('opacity', '0');
                if (p > 0.82 && !wv2) {
                  wv2 = true;
                  $('.wv2').setAttribute('opacity', '1');
                  ctx.sfx('whoosh');
                }
              },
              (t) => t
            );
            $('.wv2').setAttribute('opacity', '0');
            env.setAttribute('opacity', '0');
            // a ajuns!
            ctx.sfx('ding');
            $('.g-bubble').setAttribute('opacity', '1');
            OT.anim($('.g-bubble'), [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
            $('.g-ding').setAttribute('opacity', '1');
            $('.t2').setAttribute('opacity', '1');
            $('.t1').setAttribute('stroke', '#0EA5E9');
            $('.t2').setAttribute('stroke', '#0EA5E9');
            const c = OT.center(svg);
            OT.fx.burst('hearts', c.x + svg.getBoundingClientRect().width * 0.33, c.y - 40, 10);
            OT.state.photoSent = true;
            OT.save();
            ctx.setText('Ding! 🔔 Poza a ajuns! <b>✓</b> = plicul a plecat. <b>✓✓</b> = plicul a ajuns la bunica.', 'confirmare de livrare');
            await ctx.wait(2200);
            $('.b6-typing').setAttribute('opacity', '1');
            ctx.setText('Uite: bunica scrie ceva… ✍️ Vom afla ce ne răspunde la sfârșitul călătoriei!', 'confirmare de livrare');
            busy = false;
            btn.disabled = false;
            btn.textContent = '✉️ Trimite din nou';
            ctx.done();
          }
          btn.addEventListener('click', send);
        },
      },
      /* 5 — provocare: drumul plicului */
      {
        text: 'Provocare: arată drumul plicului! Atinge pe rând opririle, de la telefonul tău până la telefonul bunicii.',
        adult: 'rețeaua de telefonie și internet',
        wait: true,
        hint: 'Atinge opririle în ordine: începe cu telefonul lui Andrei!',
        render(ctx) {
          // așezare amestecată (dar nu în ordinea bună de la stânga la dreapta)
          let order;
          do order = OT.shuffle([0, 1, 2, 3, 4]);
          while (order.every((v, i) => v === i));
          const portrait = ctx.stage.clientWidth < ctx.stage.clientHeight * 0.95;
          const slots = portrait ? SLOTS_P : SLOTS;
          const VW = portrait ? 440 : 800;
          const VH = portrait ? 700 : 420;
          const posOf = {};
          order.forEach((stop, slot) => (posOf[stop] = slots[slot]));
          let m = `<rect width="${VW}" height="${VH}" fill="#EFF6FF"/><g class="lines"></g>`;
          STOPS.forEach((s, i) => {
            const [x, y] = posOf[i];
            m += `<g class="b6-node" data-i="${i}" transform="translate(${x} ${y})"><g class="b6-in">` +
              `<circle class="b6-ring" r="58" fill="#fff" stroke="#93C5FD" stroke-width="6"/>${s.icon()}` +
              `<g class="num" opacity="0"><circle cx="44" cy="-44" r="20" fill="#22C55E"/><text x="44" y="-36" font-size="22" font-weight="900" text-anchor="middle" fill="#fff">${i + 1}</text></g>` +
              `<rect x="-104" y="64" width="208" height="34" rx="12" fill="#fff" opacity=".9"/><text y="88" font-size="20" font-weight="900" text-anchor="middle" fill="#1E3A8A">${s.name}</text>` +
              '</g></g>';
          });
          const svg = ctx.scene(`0 0 ${VW} ${VH}`, m);
          const lines = svg.querySelector('.lines');
          let next = 0;
          let hintTimer = 0;
          const nodeEl = (i) => svg.querySelector(`.b6-node[data-i="${i}"]`);
          function pulseRight() {
            const n = nodeEl(next);
            n.classList.remove('b6-hint');
            void n.getBoundingClientRect();
            n.classList.add('b6-hint');
          }
          svg.querySelectorAll('.b6-node').forEach((n) =>
            n.addEventListener('click', () => {
              const i = +n.dataset.i;
              if (next >= STOPS.length || n.classList.contains('ok')) return;
              if (i === next) {
                ctx.clearTimeout(hintTimer);
                n.classList.remove('b6-hint');
                n.classList.add('ok');
                n.querySelector('.num').setAttribute('opacity', '1');
                ctx.sfx('pop');
                if (next > 0) {
                  const [x1, y1] = posOf[next - 1];
                  const [x2, y2] = posOf[next];
                  const ln = OT.s('line', { x1, y1, x2, y2, stroke: '#3B82F6', 'stroke-width': '10', 'stroke-linecap': 'round', 'stroke-dasharray': '1000', 'stroke-dashoffset': '1000' });
                  lines.appendChild(ln);
                  ctx.tween(700, (p) => ln.setAttribute('stroke-dashoffset', (1000 * (1 - p)).toFixed(0)));
                }
                next++;
                if (next === STOPS.length) {
                  ctx.praise('Bravo, Andrei! ✓✓');
                  ctx.setText('Asta e drumul plicului! Și știi ce? Tot drumul ăsta durează <b>mai puțin decât o clipire</b>! 😉');
                  ctx.done();
                } else {
                  ctx.setText('Da! ' + STOPS[next - 1].name + '. Și apoi unde merge plicul?');
                }
              } else {
                ctx.sfx('hmm');
                OT.anim(n.querySelector('.b6-in'), [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 400 });
                ctx.setText(next === 0 ? 'Hmm, nu încă. Plicul pornește de la <b>telefonul lui Andrei</b>.' : 'Hmm, mai gândește-te: unde merge plicul <b>după</b> „' + STOPS[next - 1].name + '”?');
                ctx.clearTimeout(hintTimer);
                hintTimer = ctx.timeout(pulseRight, 1300);
              }
            })
          );
        },
      },
    ],
  });
})();
