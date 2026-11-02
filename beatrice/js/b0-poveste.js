/* Ediția Beatrice — povestea de la început */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;

  const room =
    '<rect width="800" height="450" fill="#FDF2F8"/><rect y="340" width="800" height="110" fill="#E9D5FF"/>' +
    '<rect x="560" y="40" width="170" height="120" rx="10" fill="#BAE6FD" stroke="#fff" stroke-width="10"/><path d="M645 40 v120 M560 100 h170" stroke="#fff" stroke-width="6"/>' +
    A.cloud(585, 55, 0.5) +
    '<g opacity=".7"><rect x="40" y="50" width="70" height="56" rx="4" fill="#fff" stroke="#F472B6" stroke-width="5"/><circle cx="62" cy="72" r="9" fill="#FACC15"/><path d="M46 100 l20 -18 l14 10 l12 -14 l14 22z" fill="#86EFAC"/>' +
    '<rect x="130" y="70" width="56" height="70" rx="4" fill="#fff" stroke="#60A5FA" stroke-width="5"/><path d="M146 120 q12 -30 24 0" stroke="#EF4444" stroke-width="6" fill="none"/></g>';

  OT.registerBuilding({
    id: 0,
    story: true,
    autoSpeak: true,
    key: null,
    name: 'Povestea',
    color: '#FBCFE8',
    dark: '#831843',
    steps: [
      {
        text: 'Bună! Eu sunt <b>Beatrice</b>. Am 11 ani, îmi place mult să desenez și să fac lucruri frumoase. Și acum învăț să cânt la <b>chitară</b>! 🎸',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            room +
              `<g class="who" data-n="bea" transform="translate(250 50) scale(1.15)"><g class="who-in">${A.beatrice()}</g></g>` +
              `<g class="who" data-n="gtr" transform="translate(470 120) rotate(14)"><g class="who-in"><g transform="scale(.9)">${A.guitar()}</g></g></g>` +
              `<g class="who" data-n="easel" transform="translate(40 170) scale(.95)"><g class="who-in">${A.easel()}</g></g>`
          );
          svg.querySelectorAll('.who').forEach((g) => {
            g.style.cursor = 'pointer';
            g.addEventListener('click', () => {
              const inner = g.querySelector('.who-in');
              OT.anim(inner, [{ transform: 'translateY(0)' }, { transform: 'translateY(-30px)' }, { transform: 'translateY(0)' }], { duration: 600, easing: 'ease-out' });
              const n = g.dataset.n;
              if (n === 'gtr') {
                OT.audio.strum([52, 59, 64, 67, 71, 76], { vel: 0.7 });
                OT.fx.at(g, 'notes', 8, { size: 32 });
              } else if (n === 'easel') {
                ctx.sfx('pop');
                OT.fx.at(g, 'sparkles', 8);
                ctx.speak('Desenul meu!');
              } else {
                ctx.sfx('boing');
                OT.fx.at(g, 'hearts', 6, { size: 30 });
                ctx.speak('Eu sunt Beatrice!');
              }
            });
          });
        },
      },
      {
        text: 'Am făcut un desen pentru <b>bunica</b>, care stă departe. Vreau să i-l trimit pe telefon — și mai târziu să-i cânt ceva la chitară!',
        render(ctx) {
          ctx.scene(
            '0 0 800 450',
            room +
              `<g transform="translate(40 120) scale(.95)">${A.easel()}</g>` +
              `<g transform="translate(230 60) scale(1.1)">${A.beatrice()}</g>` +
              '<g><circle cx="470" cy="150" r="10" fill="#fff"/><circle cx="500" cy="118" r="16" fill="#fff"/>' +
              '<path d="M520 24 h220 a40 40 0 0 1 40 40 v150 a40 40 0 0 1 -40 40 h-220 a40 40 0 0 1 -40 -40 v-150 a40 40 0 0 1 40 -40z" fill="#fff"/>' +
              `<g transform="translate(520 30) scale(.66)">${A.bunica()}</g>` +
              `<g transform="translate(660 70)">${A.phone(0, 0, 70, 120, A.photoSVG({ size: 56, x: 2, y: 24 }))}</g>` +
              '<text x="700" y="232" font-size="30" text-anchor="middle">❓</text></g>'
          );
        },
      },
      {
        text: 'Dar cum ajunge desenul până la telefonul bunicii? Hai să ne uităm <b>înăuntrul telefonului</b>. E un oraș întreg, cu clădiri care lucrează!',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            '<rect width="800" height="450" fill="#1E293B"/><g class="zoomer">' +
              A.phone(310, 40, 180, 370, '', '#0F172A') +
              '<g transform="translate(323 63)"><rect width="154" height="318" rx="16" fill="#86EFAC"/><rect width="154" height="90" rx="16" fill="#7DD3FC"/>' +
              '<path d="M0 150 H154 M0 260 H154" stroke="#F6EBD3" stroke-width="14"/>' +
              ['studio', 'fabrica', 'dulap', 'centrala', 'posta', 'chitara'].map((k, i) => `<g transform="translate(${8 + (i % 3) * 48} ${i < 3 ? 92 : 202}) scale(.17)">${A.buildings[k]()}</g>`).join('') +
              '<circle cx="128" cy="30" r="16" fill="#FDE047"/></g></g>'
          );
          const z = svg.querySelector('.zoomer');
          z.style.transformOrigin = '400px 225px';
          OT.anim(z, [{ transform: 'scale(.6)', opacity: 0.4 }, { transform: 'scale(1)', opacity: 1 }], { duration: 2200, easing: 'ease-out', fill: 'forwards' });
          ctx.timeout(() => ctx.sfx('whoosh'), 300);
        },
      },
      {
        text: 'În fiecare clădire afli ceva nou și ai o provocare. Ultima clădire e un <b>studio de chitară</b> 🎸! Iar când vrei doar să desenezi, intră în <b>Atelierul de desen</b> 🎨.',
        render(ctx) {
          ctx.scene(
            '0 0 800 450',
            room +
              `<g transform="translate(90 90) scale(.9)">${A.buildings.studio()}</g>` +
              `<g transform="translate(470 70) scale(.95)">${A.buildings.chitara()}</g>` +
              `<g transform="translate(330 120) scale(.95)">${A.beatrice()}</g>`
          );
        },
      },
    ],
  });
})();
