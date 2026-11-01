/* Povestea de la început (se vede prima dată când se deschide jocul) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;

  const floor =
    '<rect width="800" height="450" fill="#E0F2FE"/><rect y="340" width="800" height="110" fill="#BBF7D0"/>' +
    A.cloud(60, 40, 0.8) + A.cloud(560, 20, 0.6) + A.tree(740, 340, 0.9) + A.tree(60, 345, 0.7, '#22C55E');

  OT.registerBuilding({
    id: 0,
    story: true,
    autoSpeak: true,
    key: null,
    name: 'Povestea',
    color: '#FDE68A',
    dark: '#78350F',
    steps: [
      {
        text: 'Bună! Eu sunt <b>Andrei</b>. Am 10 ani și cânt la pian. Ele sunt surioarele mele: <b>Maria</b> și <b>Elena</b>.',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            floor +
              `<g class="who" data-n="andrei" transform="translate(150 40) scale(1.2)"><g class="who-in">${A.andrei()}</g></g>` +
              `<g class="who" data-n="maria" transform="translate(370 70) scale(1.12)"><g class="who-in">${A.maria()}</g></g>` +
              `<g class="who" data-n="elena" transform="translate(540 92) scale(1.06)"><g class="who-in">${A.elena()}</g></g>` +
              `<g transform="translate(630 300) scale(.58)">${A.dog()}</g>` +
              '<g font-size="26" font-weight="900" text-anchor="middle" fill="#2B2D42">' +
              '<rect x="196" y="398" width="128" height="40" rx="20" fill="#fff"/><text x="260" y="427">Andrei, 10</text>' +
              '<rect x="420" y="398" width="116" height="40" rx="20" fill="#fff"/><text x="478" y="427">Maria, 6</text>' +
              '<rect x="584" y="398" width="116" height="40" rx="20" fill="#fff"/><text x="642" y="427">Elena, 2</text></g>'
          );
          const say = { andrei: 'Eu sunt Andrei!', maria: 'Eu sunt Maria!', elena: 'Eu sunt Elena! Și el e iepurașul meu!' };
          svg.querySelectorAll('.who').forEach((g) => {
            g.style.cursor = 'pointer';
            g.addEventListener('click', () => {
              const inner = g.querySelector('.who-in');
              OT.anim(inner, [{ transform: 'translateY(0)' }, { transform: 'translateY(-40px)' }, { transform: 'translateY(0)' }], { duration: 600, easing: 'ease-out' });
              ctx.sfx('boing');
              ctx.speak(say[g.dataset.n]);
              OT.fx.at(g, 'hearts', 6, { size: 30, spread: 100 });
            });
          });
        },
      },
      {
        text: 'Azi i-am făcut o poză cățelului nostru. Vreau să i-o trimit <b>bunicii</b>, care stă departe!',
        render(ctx) {
          ctx.scene(
            '0 0 800 450',
            floor +
              `<g transform="translate(60 50) scale(1.15)">${A.andrei()}</g>` +
              `<g transform="translate(190 210) rotate(-8)">${A.phone(0, 0, 66, 112, A.photoSVG({ size: 54, x: 2, y: 20 }))}</g>` +
              `<g transform="translate(300 230) scale(.85)">${A.dog()}</g>` +
              '<g class="think"><circle cx="420" cy="150" r="10" fill="#fff"/><circle cx="450" cy="118" r="16" fill="#fff"/>' +
              '<path d="M470 30 h260 a40 40 0 0 1 40 40 v130 a40 40 0 0 1 -40 40 h-260 a40 40 0 0 1 -40 -40 v-130 a40 40 0 0 1 40 -40z" fill="#fff"/>' +
              `<g transform="translate(480 26) scale(.68)">${A.bunica()}</g>` +
              `<g transform="translate(640 70)">${A.phone(0, 0, 70, 120, '<g>' + A.photoSVG({ size: 56, x: 2, y: 24 }) + '</g>')}</g>` +
              `<text x="620" y="300" font-size="30" font-weight="900" text-anchor="middle" fill="#DB2777">❓</text></g>`
          );
        },
      },
      {
        text: 'Dar cum ajunge poza până la telefonul bunicii? Hai să ne uităm <b>înăuntrul telefonului</b>. E un oraș întreg!',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#1E293B"/>' +
              '<g class="zoomer">' +
              A.phone(310, 40, 180, 370, '', '#0F172A') +
              '<g transform="translate(323 63)"><rect width="154" height="318" rx="16" fill="#86EFAC"/><rect width="154" height="90" rx="16" fill="#7DD3FC"/>' +
              '<path d="M0 150 H154 M0 260 H154" stroke="#F6EBD3" stroke-width="14"/>' +
              ['studio', 'fabrica', 'dulap', 'centrala', 'posta', 'aeroport'].map((k, i) => `<g transform="translate(${8 + (i % 3) * 48} ${i < 3 ? 92 : 202}) scale(.17)">${A.buildings[k]()}</g>`).join('') +
              '<circle cx="128" cy="30" r="16" fill="#FDE047"/></g></g>'
          );
          const z = svg.querySelector('.zoomer');
          z.style.transformOrigin = '400px 225px';
          OT.anim(z, [{ transform: 'scale(.6)', opacity: 0.4 }, { transform: 'scale(1)', opacity: 1 }], { duration: 2200, easing: 'ease-out', fill: 'forwards' });
          ctx.timeout(() => ctx.sfx('whoosh'), 300);
        },
      },
      {
        text: '<b>Maria</b>, caută <b>fundița roz</b> 🎀 în fiecare clădire: acolo te așteaptă o misiune! <b>Elena</b>, iepurașul tău se ascunde peste tot. Găsește-l!',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            floor +
              `<g transform="translate(110 60) scale(1.1)">${A.maria()}</g>` +
              `<g class="bow-big" transform="translate(320 70)"><g class="bb-in">${A.bow()}</g></g>` +
              `<g transform="translate(430 96) scale(1.04)">${A.elena()}</g>` +
              `<g class="peek" transform="translate(620 230)"><g class="pk-in"><g transform="scale(.7)">${A.bunny()}</g></g>` +
              '<g transform="translate(-10 110)"><circle cx="40" cy="40" r="40" fill="#4ADE80"/><circle cx="100" cy="30" r="48" fill="#22C55E"/><circle cx="160" cy="44" r="40" fill="#4ADE80"/><rect y="40" width="200" height="60" fill="#22C55E"/></g></g>'
          );
          const bow = svg.querySelector('.bb-in');
          bow.style.transformBox = 'fill-box';
          bow.style.transformOrigin = 'center';
          bow.style.animation = 'pulse 1.4s ease-in-out infinite';
          const pk = svg.querySelector('.peek');
          pk.style.cursor = 'pointer';
          pk.addEventListener('click', () => {
            OT.anim(pk.querySelector('.pk-in'), [{ transform: 'translateY(0)' }, { transform: 'translateY(-90px)' }, { transform: 'translateY(0)' }], { duration: 900, easing: 'ease-out' });
            ctx.sfx('boing');
            OT.fx.at(pk, 'balloons', 6);
          });
          svg.querySelector('.bow-big').addEventListener('click', () => {
            ctx.sfx('star');
            OT.fx.at(svg.querySelector('.bow-big'), 'stars', 8);
          });
        },
      },
    ],
  });
})();
