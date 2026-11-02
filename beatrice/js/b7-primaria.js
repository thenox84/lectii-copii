/* Ediția Beatrice — Clădirea 7: Primăria (siguranța) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  document.head.appendChild(
    h('style', {
      text:
        '.bb7-wing{transform-box:fill-box;transform-origin:80% 10%}' +
        '.bb7-wave .bb7-wing-r{animation:b7wave 1.2s ease-in-out infinite}' +
        '@keyframes b7wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-28deg)}}' +
        '.bb7-blink{animation:b7blink 4s infinite}' +
        '@keyframes b7blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}' +
        '.bb7-blink{transform-box:fill-box;transform-origin:center}' +
        '.bb7-rules{display:flex;flex-direction:column;align-items:center;gap:12px;padding:14px;width:100%;height:100%;justify-content:center}' +
        '.bb7-rules h3{margin:0;font-size:clamp(22px,3vw,36px);font-weight:900;color:#78350F}' +
        '.bb7-rule{display:flex;align-items:center;gap:14px;background:#FEF3C7;border-radius:20px;padding:10px 20px;font-size:clamp(18px,2.4vw,28px);font-weight:900;width:min(640px,96%);animation:pop .6s ease both;box-shadow:0 4px 0 rgba(0,0,0,.08)}' +
        '.bb7-rule .ic{font-size:1.6em;line-height:1}' +
        '.bb7-rule:nth-child(3){animation-delay:.4s}.bb7-rule:nth-child(4){animation-delay:.8s}.bb7-rule:nth-child(5){animation-delay:1.2s}' +
        '.bb7-sign{touch-action:none;cursor:crosshair}',
    })
  );

  /* Bufnița-Primar (viewBox 0 0 200 240, picioarele la y≈232) */
  const owl = () =>
    '<ellipse cx="100" cy="232" rx="58" ry="7" fill="#000" opacity=".12"/>' +
    '<path d="M56 74 l-10 -38 l34 24z M144 74 l10 -38 l-34 24z" fill="#854D0E"/>' +
    '<path d="M42 128 q-4 -78 58 -82 q62 4 58 82 q4 66 -58 98 q-62 -32 -58 -98z" fill="#A16207"/>' +
    '<ellipse cx="100" cy="168" rx="38" ry="52" fill="#FDE68A"/>' +
    '<g fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round"><path d="M80 146 q6 6 12 0 M98 146 q6 6 12 0 M116 146 q-2 4 -6 4 M88 166 q6 6 12 0 M106 166 q6 6 12 0 M80 186 q6 6 12 0 M98 186 q6 6 12 0"/></g>' +
    '<g class="bb7-wing bb7-wing-l"><path d="M46 116 q-30 44 4 92 q20 -34 10 -86z" fill="#854D0E"/></g>' +
    '<g class="bb7-wing bb7-wing-r"><path d="M154 116 q30 44 -4 92 q-20 -34 -10 -86z" fill="#854D0E"/></g>' +
    '<path d="M58 132 L150 194 l-7 13 L50 146z" fill="#FACC15"/><path d="M58 132 L150 194 l-2.5 4.5 L55.5 136.5z" fill="#2563EB"/><path d="M52.5 141.5 L145.5 202.5 l-2.5 4.5 L50 146z" fill="#DC2626"/>' +
    '<circle cx="128" cy="186" r="9" fill="#FDE047" stroke="#CA8A04" stroke-width="3"/>' +
    '<circle cx="78" cy="96" r="28" fill="#FEF3C7"/><circle cx="122" cy="96" r="28" fill="#FEF3C7"/>' +
    '<g class="bb7-blink"><circle cx="80" cy="96" r="13" fill="#2B2D42"/><circle cx="120" cy="96" r="13" fill="#2B2D42"/><circle cx="84" cy="91" r="4.5" fill="#fff"/><circle cx="124" cy="91" r="4.5" fill="#fff"/></g>' +
    '<g fill="none" stroke="#374151" stroke-width="4"><circle cx="79" cy="96" r="22"/><circle cx="121" cy="96" r="22"/><path d="M96 92 q4 -4 8 0"/></g>' +
    '<path d="M91 114 h18 l-9 16z" fill="#F97316"/>' +
    '<path d="M84 224 l-8 10 M86 224 v12 M88 224 l8 10 M112 224 l-8 10 M114 224 v12 M116 224 l8 10" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>';

  const granHead = (x, y, s) =>
    `<g transform="translate(${x} ${y})"><circle r="${s / 2}" fill="#F3E8FF"/><svg x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" viewBox="46 20 108 120">${A.bunica()}</svg></g>`;
  const emojiHead = (x, y, s, e, bg) =>
    `<g transform="translate(${x} ${y})"><circle r="${s / 2}" fill="${bg}"/><text y="${s * 0.2}" font-size="${s * 0.58}" text-anchor="middle">${e}</text></g>`;
  const bubbleTail = (x, y, fill) => `<path d="M${x} ${y} l-16 18 l28 -6z" fill="${fill}"/>`;


  /* întrebările „E în regulă sau NU?” */
  const OK = (why) => ({ t: 'E în regulă', ico: '👍', ok: true, why });
  const NO = (why) => ({ t: 'Nu! Întreb un adult', ico: '🛑', ok: true, why });
  const notOK = (why) => ({ t: 'E în regulă', ico: '👍', ok: false, why });
  const notNO = (why) => ({ t: 'Nu! Întreb un adult', ico: '🛑', ok: false, why });
  const QUESTIONS = [
    {
      pic: '👵🎨',
      q: 'Bunica te roagă să-i trimiți desenul tău nou.',
      options: [
        OK('Da! Bunica e din familie și se bucură de desenele tale. Când nu ești sigură, întrebi mama sau tata.'),
        notNO('Poți oricând să întrebi părinții! Dar bunica e din familie — ei îi trimitem desenul cu drag.'),
      ],
    },
    {
      pic: '❓🏆',
      q: 'Un necunoscut îți scrie: „Spune-mi parola și primești un premiu!”',
      options: [
        notOK('Hmm… niciun premiu nu valorează cât parola ta! Parola e ca lăcățelul jurnalului tău.'),
        NO('Exact! Parola nu se dă pentru nimic în lume. Nu răspunzi și spui imediat unui adult.'),
      ],
    },
    {
      pic: '👧🔑',
      q: 'O colegă de clasă îți cere parola de la tabletă, „doar ca să se joace puțin”.',
      options: [
        notOK('Chiar și prietenele bune nu primesc cheia jurnalului tău. Parola e doar a ta și a părinților.'),
        NO('Corect! Îi poți arăta jocul sau desenul, dar parola rămâne secretă — chiar și pentru prietene.'),
      ],
    },
    {
      pic: '❓📷',
      q: 'Cineva pe care nu-l cunoști îți cere o poză cu tine.',
      options: [
        notOK('Nu-l cunoști în viața reală, deci nu primește poze. Mai bine spui unui adult.'),
        NO('Bravo! Nu trimitem poze necunoscuților. Spunem imediat mamei sau tatălui.'),
      ],
    },
    {
      pic: '👩🔑',
      q: 'Mama te întreabă parola, ca să te ajute cu tableta.',
      options: [
        OK('Da! Părinții pot ști parola — ei te ajută și te apără.'),
        notNO('Mama și tata sunt chiar adulții care pot ști parola ta. Lor le poți spune.'),
      ],
    },
    {
      pic: '🖼️🏠',
      q: 'Un concurs de desen pe internet îți cere adresa de acasă și numărul de telefon.',
      options: [
        notOK('Atenție! Adresa și telefonul sunt informații secrete, ca parola. Un concurs adevărat îl vorbește cu părinții tăi.'),
        NO('Super! Adresa și telefonul nu le dăm singuri. Arăți concursul unui adult și hotărâți împreună.'),
      ],
    },
  ];

  /* jurnalul / caietul de schițe cu lăcățel */
  const diary = () =>
    '<g class="diary-closed"><rect x="60" y="80" width="250" height="300" rx="18" fill="#8B5CF6"/><rect x="60" y="80" width="34" height="300" rx="12" fill="#6D28D9"/>' +
    '<rect x="110" y="120" width="170" height="70" rx="12" fill="#EDE9FE"/><text x="195" y="150" font-size="22" font-weight="900" text-anchor="middle" fill="#6D28D9">Caietul</text><text x="195" y="178" font-size="22" font-weight="900" text-anchor="middle" fill="#6D28D9">meu secret</text>' +
    '<g transform="translate(150 210) scale(.7)">' + A.star('#FDE047') + '</g>' +
    '<rect x="270" y="220" width="70" height="40" rx="8" fill="#A78BFA"/><g transform="translate(290 196) scale(.62)">' + A.lock('#FBBF24') + '</g></g>' +
    '<g class="diary-open" opacity="0"><path d="M30 100 q90 -20 170 10 v270 q-80 -30 -170 -10z" fill="#fff" stroke="#C4B5FD" stroke-width="5"/><path d="M370 100 q-90 -20 -170 10 v270 q80 -30 170 -10z" fill="#fff" stroke="#C4B5FD" stroke-width="5"/>' +
    '<g transform="translate(55 140)">' + A.photoSVG({ size: 120 }) + '</g>' +
    '<g transform="translate(232 150) scale(.9)">' + A.heart('#F472B6') + '</g><path d="M230 270 q40 -30 100 0" stroke="#A855F7" stroke-width="5" fill="none"/><path d="M230 300 q40 -20 100 0" stroke="#22C55E" stroke-width="5" fill="none"/></g>';

  OT.registerBuilding({
    id: 7,
    key: 'primaria',
    name: 'Primăria',
    color: '#FCD34D',
    dark: '#78350F',
    learned: 'Parola e secretă ca jurnalul tău, iar desenele și pozele le trimitem doar oamenilor pe care îi cunoaștem.',
    steps: [
      /* 1 — Bufnița-Primar */
      {
        text: 'Aceasta e <b>Primăria</b>. Aici lucrează Bufnița-Primar. Ea are grijă ca toți cei din oraș să fie în siguranță.',
        adult: 'siguranța în telefon și pe internet',
        render(ctx) {
          let m = '<rect width="800" height="450" fill="#E0F2FE"/><rect y="370" width="800" height="80" fill="#86EFAC"/>' + A.cloud(40, 30, 0.7) + A.cloud(620, 50, 0.6);
          m += `<g transform="translate(250 80) scale(1.25)">${A.buildings.primaria()}</g>`;
          m += `<g class="owl-g bb7-wave" transform="translate(560 170) scale(.95)" style="cursor:pointer">${owl()}</g>`;
          m += `<g transform="translate(60 120) scale(.85)">${A.beatrice()}</g>`;
          m += '<g class="owl-say" opacity="0"><rect x="560" y="80" width="200" height="66" rx="20" fill="#fff"/>' + bubbleTail(640, 144, '#fff') + '<text x="660" y="122" font-size="26" font-weight="900" text-anchor="middle" fill="#78350F">Bună, Beatrice!</text></g>';
          const svg = ctx.scene('0 0 800 450', m);
          const say = svg.querySelector('.owl-say');
          const hello = () => {
            ctx.sfx('boing');
            say.setAttribute('opacity', '1');
            OT.anim(say, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600 });
            OT.speak('Hu-hu! Bună, Beatrice!');
          };
          ctx.timeout(() => {
            say.setAttribute('opacity', '1');
            OT.anim(say, [{ opacity: 0 }, { opacity: 1 }], { duration: 800 });
          }, 900);
          svg.querySelector('.owl-g').addEventListener('click', hello);
        },
      },
      /* 2 — parola e ca lăcățelul jurnalului */
      {
        text: 'Parola e ca <b>lăcățelul jurnalului tău secret</b> sau al caietului de schițe. O știi tu și părinții tăi. Nu o dai nimănui altcuiva — nici prietenelor!',
        adult: 'parolă · cod PIN',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          let m = '<rect width="800" height="420" fill="#FFFBEB"/>';
          m += diary();
          m += '<g class="key-g" style="cursor:pointer"><g class="key-in"><circle r="60" fill="#FEF3C7" opacity=".9"/><g transform="translate(-50 -50)">' + A.key('#FBBF24') + '</g></g></g>';
          m += '<text x="430" y="230" font-size="54" font-weight="900" text-anchor="middle" fill="#78350F">=</text>';
          m += A.phone(500, 40, 170, 300, '');
          m += '<g transform="translate(512 58)"><g class="lock-ic" transform="translate(48 18) scale(.5)">' + A.lock('#FBBF24') + '</g>' +
            '<g class="pin">' + [0, 1, 2, 3].map((i) => `<circle class="pd" cx="${38 + i * 26}" cy="100" r="9" fill="none" stroke="#1E3A8A" stroke-width="3"/>`).join('') + '</g>' +
            '<g font-size="18" font-weight="900" fill="#1E3A8A" text-anchor="middle">' +
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => `<circle cx="${38 + (i % 3) * 36}" cy="${140 + Math.floor(i / 3) * 34}" r="14" fill="#DBEAFE"/><text x="${38 + (i % 3) * 36}" y="${146 + Math.floor(i / 3) * 34}">${n}</text>`).join('') +
            '</g><g class="open-txt" opacity="0"><rect x="10" y="118" width="126" height="120" rx="12" fill="#DCFCE7"/><g transform="translate(23 128)">' + A.photoSVG({ size: 100 }) + '</g></g></g>';
          const svg = ctx.scene('0 0 800 420', m);
          const keyG = svg.querySelector('.key-g');
          const keyIn = svg.querySelector('.key-in');
          let used = false;
          const place = (x, y, r) => keyG.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)})`);
          place(430, 110, -20);
          keyIn.classList.add('hl-pulse');
          const btn = h('button', { class: 'big-btn yellow' }, '🔑 Folosește cheița');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          const reset = () => {
            svg.querySelector('.diary-closed').setAttribute('opacity', '1');
            svg.querySelector('.diary-open').setAttribute('opacity', '0');
            keyG.setAttribute('opacity', '1');
            svg.querySelector('.open-txt').setAttribute('opacity', '0');
            svg.querySelector('.lock-ic').setAttribute('opacity', '1');
            svg.querySelectorAll('.pd').forEach((d) => d.setAttribute('fill', 'none'));
            place(430, 110, -20);
          };
          async function useKey() {
            if (used) return;
            used = true;
            btn.disabled = true;
            keyIn.classList.remove('hl-pulse');
            ctx.sfx('tap');
            await ctx.tween(1600, (p) => place(OT.lerp(430, 316, p), OT.lerp(110, 238, p) - Math.sin(p * Math.PI) * 60, OT.lerp(-20, 0, p)));
            ctx.sfx('unlock');
            const dots = svg.querySelectorAll('.pd');
            for (let i = 0; i < dots.length; i++) {
              dots[i].setAttribute('fill', '#1E3A8A');
              ctx.sfx('click');
              await ctx.wait(220);
            }
            keyG.setAttribute('opacity', '0');
            svg.querySelector('.diary-closed').setAttribute('opacity', '0');
            const op = svg.querySelector('.diary-open');
            op.setAttribute('opacity', '1');
            OT.anim(op, [{ opacity: 0 }, { opacity: 1 }], { duration: 700 });
            ctx.sfx('paper');
            svg.querySelector('.open-txt').setAttribute('opacity', '1');
            svg.querySelector('.lock-ic').setAttribute('opacity', '0.25');
            ctx.setText('Cheița potrivită deschide caietul. Parola potrivită deschide telefonul. De aceea amândouă sunt <b>secrete</b>!', 'parolă · cod PIN');
            ctx.timeout(() => {
              used = false;
              btn.disabled = false;
              btn.textContent = '🔁 Încă o dată';
            }, 1500);
          }
          btn.addEventListener('click', () => {
            if (btn.textContent.indexOf('Încă') >= 0) reset();
            useKey();
          });
          keyG.addEventListener('click', useKey);
        },
      },
      /* 3 — necunoscuții */
      {
        text: 'Dacă cineva pe care <b>nu-l cunoști</b> îți scrie și îți cere parola, poze sau desene, NU răspunzi. Spui imediat mamei sau tatălui!',
        adult: 'siguranța online · necunoscuți pe internet',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const portrait = ctx.stage.clientWidth < ctx.stage.clientHeight * 0.95;
          const VB = portrait ? '0 0 440 640' : '0 0 800 420';
          let m = `<rect width="${portrait ? 440 : 800}" height="${portrait ? 640 : 420}" fill="#F8FAFC"/>`;
          m += A.phone(portrait ? 20 : 60, 20, 220, 380, '');
          m += `<g transform="translate(${portrait ? 36 : 76} 46)">` +
            '<rect width="188" height="44" rx="12" fill="#E5E7EB"/><circle cx="24" cy="22" r="16" fill="#9CA3AF"/><text x="24" y="30" font-size="22" font-weight="900" text-anchor="middle" fill="#fff">?</text>' +
            '<text x="50" y="29" font-size="18" font-weight="900" fill="#374151">Necunoscut</text>' +
            '<g class="msg1" opacity="0"><rect x="4" y="66" width="170" height="74" rx="16" fill="#fff" stroke="#E5E7EB" stroke-width="2"/><text x="16" y="96" font-size="17" font-weight="800" fill="#374151">Salut! Îmi dai</text><text x="16" y="122" font-size="17" font-weight="800" fill="#374151">parola ta? 🎁</text></g>' +
            '<g class="msg2" opacity="0"><rect x="4" y="152" width="170" height="74" rx="16" fill="#fff" stroke="#E5E7EB" stroke-width="2"/><text x="16" y="182" font-size="17" font-weight="800" fill="#374151">Trimite-mi și</text><text x="16" y="208" font-size="17" font-weight="800" fill="#374151">o poză cu tine!</text></g>' +
            '<g class="reply" opacity="0"><rect x="34" y="262" width="120" height="44" rx="22" fill="#3B82F6"/><text x="94" y="291" font-size="18" font-weight="900" text-anchor="middle" fill="#fff">Răspunde</text><path d="M30 256 L158 312 M158 256 L30 312" stroke="#EF4444" stroke-width="8" stroke-linecap="round"/></g>' +
            '</g>';
          m += `<g transform="${portrait ? 'translate(338 200) scale(.78)' : 'translate(400 150)'}">` + '<g class="stop" opacity="0"><path d="M-46 -112 h92 l66 66 v92 l-66 66 h-92 l-66 -66 v-92z" fill="#EF4444" stroke="#fff" stroke-width="8"/><text y="12" font-size="40" font-weight="900" text-anchor="middle" fill="#fff">STOP</text></g></g>';
          m += `<g transform="${portrait ? 'translate(-440 190)' : ''}">` + '<g class="parents" opacity="0"><path d="M480 300 h70" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/><path d="M540 286 l18 14 l-18 14" fill="none" stroke="#22C55E" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
            emojiHead(620, 300, 92, '👩', '#FCE7F3') + emojiHead(720, 300, 92, '👨', '#DBEAFE') +
            '<rect x="560" y="356" width="220" height="40" rx="14" fill="#DCFCE7"/><text x="670" y="384" font-size="21" font-weight="900" text-anchor="middle" fill="#15803D">Spun părinților!</text></g></g>';
          const svg = ctx.scene(VB, m);
          const btn = h('button', { class: 'big-btn' }, '🔁 Încă o dată');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          const show = (sel, pre) => {
            const el = svg.querySelector(sel);
            el.setAttribute('opacity', '1');
            OT.anim(el, [{ opacity: 0, transform: (pre || '') + ' scale(.85)' }, { opacity: 1, transform: (pre || '') + ' scale(1)' }], { duration: 700, easing: 'ease-out' });
          };
          let running = false;
          async function play() {
            if (running) return;
            running = true;
            ['.msg1', '.msg2', '.reply', '.stop', '.parents'].forEach((s) => svg.querySelector(s).setAttribute('opacity', '0'));
            await ctx.wait(600);
            ctx.sfx('ding');
            show('.msg1');
            await ctx.wait(1600);
            ctx.sfx('ding');
            show('.msg2');
            await ctx.wait(1600);
            ctx.sfx('zap');
            show('.stop');
            show('.reply');
            await ctx.wait(1700);
            ctx.sfx('success');
            show('.parents');
            running = false;
          }
          btn.addEventListener('click', play);
          play();
        },
      },
      /* 4 — desenele se pot copia */
      {
        text: 'Un desen sau o poză trimisă pe internet poate fi copiată și trimisă mai departe, de multe ori. De aceea o trimitem doar oamenilor pe care îi <b>cunoaștem în viața reală</b>.',
        adult: 'confidențialitate · viața privată',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          const card = (s) => `<rect x="-${s / 2 + 6}" y="-${s / 2 + 6}" width="${s + 12}" height="${s + 22}" rx="6" fill="#fff" stroke="#E5E7EB" stroke-width="2"/>` + A.photoSVG({ size: s, x: -s / 2, y: -s / 2 });
          let m = '<rect width="800" height="420" fill="#F5F3FF"/><g class="copies"></g>';
          m += `<g class="orig" transform="translate(400 190)">${card(110)}</g>`;
          m += '<g class="safe" opacity="0"><rect x="120" y="300" width="560" height="110" rx="26" fill="#DCFCE7" stroke="#22C55E" stroke-width="4"/>' +
            '<text x="400" y="333" font-size="22" font-weight="900" text-anchor="middle" fill="#15803D">Desene și poze trimitem doar la:</text>' +
            granHead(270, 372, 60) + emojiHead(400, 372, 60, '👩', '#FCE7F3') + emojiHead(530, 372, 60, '👨', '#DBEAFE') +
            '<g font-size="15" font-weight="900" fill="#15803D" text-anchor="middle"><text x="322" y="378">❤️</text><text x="465" y="378">❤️</text></g></g>';
          const svg = ctx.scene('0 0 800 420', m);
          const copies = svg.querySelector('.copies');
          const btn = h('button', { class: 'big-btn' }, '🔁 Încă o dată');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          let running = false;
          async function play() {
            if (running) return;
            running = true;
            copies.innerHTML = '';
            svg.querySelector('.safe').setAttribute('opacity', '0');
            svg.querySelector('.orig').setAttribute('opacity', '1');
            await ctx.wait(700);
            const targets = [];
            for (let i = 0; i < 14; i++) {
              const a = (i / 14) * Math.PI * 2;
              targets.push([400 + Math.cos(a) * OT.rand(200, 330), 170 + Math.sin(a) * OT.rand(100, 140)]);
            }
            for (let wave = 0; wave < 3; wave++) {
              const n = [2, 4, 8][wave];
              ctx.sfx('paper');
              for (let i = 0; i < n && targets.length; i++) {
                const [tx, ty] = targets.shift();
                const g = OT.s('g', {});
                g.innerHTML = card(56);
                copies.appendChild(g);
                ctx.tween(1100, (p) => g.setAttribute('transform', `translate(${OT.lerp(400, tx, p).toFixed(1)} ${OT.lerp(190, ty, p).toFixed(1)}) rotate(${(p * OT.rand(-20, 20)).toFixed(1)})`));
              }
              await ctx.wait(1300);
            }
            ctx.setText('Vezi? Desenul tău poate ajunge la foarte mulți oameni — ca o foaie pusă la copiator iar și iar!', 'confidențialitate · viața privată');
            await ctx.wait(1800);
            await ctx.tween(800, (p) => copies.setAttribute('opacity', (1 - p).toFixed(2)));
            copies.innerHTML = '';
            copies.setAttribute('opacity', '1');
            svg.querySelector('.orig').setAttribute('opacity', '0.25');
            const safe = svg.querySelector('.safe');
            safe.setAttribute('opacity', '1');
            OT.anim(safe, [{ opacity: 0 }, { opacity: 1 }], { duration: 800 });
            ctx.sfx('success');
            ctx.setText('De aceea trimitem desene și poze doar oamenilor pe care îi <b>cunoaștem în viața reală</b>: bunica, mama, tata.', 'confidențialitate · viața privată');
            running = false;
          }
          btn.addEventListener('click', play);
          play();
        },
      },
      /* 5 — semnătura artistei + întrebăm înainte */
      {
        text: 'Artiștii își <b>semnează</b> lucrările. Semnează-ți desenul cu degetul! Și ține minte: înainte să trimiți poza altcuiva, îl <b>întrebi</b> dacă e de acord.',
        adult: 'drepturi de autor · acordul persoanei din poză',
        wait: true,
        hint: 'Scrie-ți semnătura cu degetul (sau cu mouse-ul) în chenarul de jos!',
        render(ctx) {
          ctx.stage.classList.add('st-col');
          let m = '<rect width="800" height="420" fill="#F5F3FF"/>';
          m += '<rect x="230" y="14" width="340" height="392" rx="10" fill="#fff" stroke="#B45309" stroke-width="10"/>';
          m += '<g transform="translate(290 34)">' + A.photoSVG({ size: 220 }) + '</g>';
          m += '<rect class="bb7-sign" x="262" y="276" width="276" height="112" rx="12" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3" stroke-dasharray="10 8"/>';
          m += '<text class="sign-hint" x="400" y="342" font-size="24" font-weight="900" text-anchor="middle" fill="#B45309" pointer-events="none">✍️ semnează aici</text>';
          m += '<g class="ink" pointer-events="none" fill="none" stroke="#1E3A8A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></g>';
          m += '<g class="ask" opacity="0"><rect x="590" y="120" width="190" height="190" rx="24" fill="#DCFCE7" stroke="#22C55E" stroke-width="4"/>' +
            '<text x="685" y="190" font-size="46" text-anchor="middle">📷🙋</text><text x="685" y="240" font-size="20" font-weight="900" text-anchor="middle" fill="#15803D">„Pot să pun</text><text x="685" y="266" font-size="20" font-weight="900" text-anchor="middle" fill="#15803D">poza ta?”</text></g>';
          const svg = ctx.scene('0 0 800 420', m);
          const pad = svg.querySelector('.bb7-sign');
          const ink = svg.querySelector('.ink');
          const clear = h('button', { class: 'big-btn' }, '🧽 Șterge');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, clear));
          let path = null;
          let d = '';
          let total = 0;
          let last = null;
          let finished = false;
          const inPad = (p) => p.x > 266 && p.x < 534 && p.y > 280 && p.y < 384;
          ctx.on(pad, 'pointerdown', (e) => {
            e.preventDefault();
            try { pad.setPointerCapture(e.pointerId); } catch (err) {}
            const p = OT.svgPoint(svg, e);
            svg.querySelector('.sign-hint').setAttribute('opacity', '0');
            path = OT.s('path', {});
            ink.appendChild(path);
            d = `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
            path.setAttribute('d', d);
            last = p;
          });
          ctx.on(pad, 'pointermove', (e) => {
            if (!path) return;
            const p = OT.svgPoint(svg, e);
            if (!inPad(p)) return;
            total += Math.hypot(p.x - last.x, p.y - last.y);
            last = p;
            d += ` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
            path.setAttribute('d', d);
          });
          const end = () => {
            if (!path) return;
            path = null;
            if (total > 160 && !finished) {
              finished = true;
              ctx.sfx('success');
              const ask = svg.querySelector('.ask');
              ask.setAttribute('opacity', '1');
              OT.anim(ask, [{ opacity: 0 }, { opacity: 1 }], { duration: 700 });
              ctx.praise('Ce semnătură frumoasă! ✍️');
              ctx.setText('Acum toată lumea știe că desenul e <b>al tău</b>. Și la fel: pozele cu alți oameni le trimitem doar dacă i-am <b>întrebat</b> și sunt de acord.', 'drepturi de autor · acordul persoanei din poză');
              ctx.done();
            }
          };
          ctx.on(pad, 'pointerup', end);
          ctx.on(pad, 'pointercancel', end);
          clear.addEventListener('click', () => {
            ctx.sfx('tap');
            ink.innerHTML = '';
            if (!finished) {
              total = 0;
              svg.querySelector('.sign-hint').setAttribute('opacity', '1');
            }
          });
        },
      },
      /* 6 — provocare: E în regulă sau NU? */
      {
        text: 'Provocare: <b>E în regulă sau NU?</b> Citește fiecare întâmplare și alege.',
        adult: 'reguli de siguranță online',
        wait: true,
        hint: 'Răspunde la toate cele 6 întâmplări!',
        render(ctx) {
          OT.kit.quiz(
            ctx,
            QUESTIONS,
            () => {
              ctx.done();
              ctx.timeout(() => {
                ctx.stage.innerHTML = '';
                const box = h(
                  'div',
                  { class: 'bb7-rules' },
                  h('div', { class: 'quiz-pic' }, '🏛️'),
                  h('h3', {}, 'Regulile orașului'),
                  h('div', { class: 'bb7-rule' }, h('span', { class: 'ic' }, '🔑'), 'Parola e secretă.'),
                  h('div', { class: 'bb7-rule' }, h('span', { class: 'ic' }, '🙅'), 'Nu vorbim cu necunoscuți.'),
                  h('div', { class: 'bb7-rule' }, h('span', { class: 'ic' }, '✍️'), 'Desenele le trimitem doar celor cunoscuți.'),
                  h('div', { class: 'bb7-rule' }, h('span', { class: 'ic' }, '👨‍👩‍👧'), 'Spunem părinților.')
                );
                ctx.stage.appendChild(box);
                ctx.setText('Bravo! Acum știi <b>regulile orașului</b>. Bufnița-Primar e mândră de tine!', 'reguli de siguranță online');
              }, 2200);
            },
            { shuffle: false, delay: 3400, endPic: '🦉', endText: 'Bravo! Ai răspuns la toate întâmplările!' }
          );
        },
      },
    ],
  });
})();
