/* Clădirea 3 — Masa de lucru și Dulapul (memoria) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  document.head.appendChild(
    h('style', {
      text:
        '.b3-drag{cursor:grab}.b3-glow{animation:glow 1.4s ease-in-out infinite}' +
        '.b3-arm{transform-box:fill-box}' +
        '.b3-arm-l{transform-origin:100% 50%;animation:b3arm .25s ease-in-out infinite alternate}' +
        '.b3-arm-r{transform-origin:0% 50%;animation:b3arm .25s ease-in-out infinite alternate-reverse}' +
        '@keyframes b3arm{from{transform:rotate(-25deg)}to{transform:rotate(25deg)}}' +
        '@media (max-width:600px) and (orientation:portrait){.stage.st-col.b3-safe{padding-bottom:52px}}',
    })
  );

  /* ---------- desene ---------- */
  const BG = '<rect width="800" height="450" fill="#F5F3FF"/><rect y="366" width="800" height="84" fill="#D6A26B"/><rect y="362" width="800" height="6" fill="#B45309" opacity=".4"/>';
  /* masa: (x,y) = colțul blatului; picioarele ajung la podea (y+116) */
  const table = (x, y, w) =>
    `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="18" rx="5" fill="#B45309"/><rect x="0" y="14" width="${w}" height="8" rx="3" fill="#92400E"/>` +
    `<rect x="16" y="20" width="14" height="96" fill="#92400E"/><rect x="${w - 30}" y="20" width="14" height="96" fill="#92400E"/></g>`;
  const label = (x, y, text, w) =>
    `<g transform="translate(${x} ${y})"><rect x="${-(w || 220) / 2}" y="-30" width="${w || 220}" height="48" rx="14" fill="#fff" stroke="#A78BFA" stroke-width="4"/>` +
    `<text y="3" font-size="25" font-weight="900" text-anchor="middle" fill="#3B0764">${text}</text></g>`;
  /* poza cățelului înrămată (64×64) */
  const photoItem = () => `${A.photoSVG({ size: 64 })}<rect width="64" height="64" fill="none" stroke="#fff" stroke-width="4"/>`;
  /* poză mică simplă (pentru rafturi pline) */
  const miniPhoto = (c) => `<rect width="40" height="34" rx="3" fill="#fff"/><rect x="4" y="4" width="32" height="26" fill="#BAE6FD"/><circle cx="20" cy="20" r="8" fill="${c || '#C47F3B'}"/><rect x="4" y="24" width="32" height="6" fill="#86EFAC"/>`;
  const drawing = () =>
    `<rect width="74" height="58" rx="4" fill="#fff" stroke="#CBD5E1" stroke-width="2"/><path d="M10 44 q10 -26 22 -8 t24 -12" stroke="#3B82F6" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<circle cx="56" cy="16" r="8" fill="#FACC15"/><rect x="40" y="48" width="38" height="8" rx="4" fill="#EF4444" transform="rotate(-18 40 48)"/>`;
  const gamepad = () =>
    `<rect x="0" y="8" width="78" height="42" rx="21" fill="#6366F1"/><rect x="14" y="24" width="18" height="6" rx="2" fill="#E0E7FF"/><rect x="20" y="18" width="6" height="18" rx="2" fill="#E0E7FF"/>` +
    `<circle cx="56" cy="22" r="5" fill="#F87171"/><circle cx="64" cy="32" r="5" fill="#FACC15"/>`;
  const book = (c) => `<rect width="22" height="56" rx="3" fill="${c}"/><rect x="3" y="8" width="16" height="4" fill="#fff" opacity=".6"/>`;
  const noteIcon = (c) => `<g transform="scale(.45)">${A.note(c)}</g>`;

  /* muncitorul (același ca la fabrică), mai mic */
  const worker = () =>
    '<g>' +
    '<rect x="-34" y="70" width="22" height="44" rx="8" fill="#1E3A8A"/><rect x="12" y="70" width="22" height="44" rx="8" fill="#1E3A8A"/>' +
    '<rect x="-42" y="108" width="34" height="14" rx="7" fill="#374151"/><rect x="8" y="108" width="34" height="14" rx="7" fill="#374151"/>' +
    '<g class="b3-arm b3-arm-l"><rect x="-92" y="-6" width="56" height="16" rx="8" fill="#94A3B8"/><circle cx="-94" cy="2" r="12" fill="#F59E0B"/></g>' +
    '<g class="b3-arm b3-arm-r"><rect x="36" y="-6" width="56" height="16" rx="8" fill="#94A3B8"/><circle cx="94" cy="2" r="12" fill="#F59E0B"/></g>' +
    '<rect x="-44" y="-20" width="88" height="96" rx="22" fill="#3B82F6"/><rect x="-26" y="0" width="52" height="34" rx="8" fill="#DBEAFE"/>' +
    '<rect x="-10" y="-34" width="20" height="16" fill="#94A3B8"/><rect x="-46" y="-104" width="92" height="74" rx="24" fill="#CBD5E1"/>' +
    '<rect x="-34" y="-92" width="68" height="46" rx="16" fill="#1E293B"/><ellipse cx="-14" cy="-72" rx="7" ry="9" fill="#67E8F9"/><ellipse cx="14" cy="-72" rx="7" ry="9" fill="#67E8F9"/>' +
    '<path d="M-12 -58 q12 9 24 0" stroke="#67E8F9" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<path d="M-50 -100 q0 -40 50 -42 q50 2 50 42z" fill="#FACC15"/><rect x="-58" y="-104" width="116" height="10" rx="5" fill="#EAB308"/></g>';

  /* dulapul: (x,y) colț, lățime w, înălțime hh; rafturi la 30%, 58%, 84%; conținut = markup pe rafturi */
  function wardrobe(x, y, w, hh, inside, doorsCls) {
    const half = w / 2;
    return (
      `<g transform="translate(${x} ${y})">` +
      `<path d="M-14 6 h${w + 28} l-14 -26 h${-w}z" fill="#7C3AED"/>` +
      `<rect x="0" y="0" width="${w}" height="${hh}" rx="10" fill="#A78BFA"/>` +
      `<rect x="12" y="12" width="${w - 24}" height="${hh - 24}" rx="6" fill="#EDE9FE"/>` +
      [0.3, 0.58, 0.84].map((p) => `<rect x="12" y="${hh * p}" width="${w - 24}" height="8" fill="#8B5CF6"/>`).join('') +
      (inside || '') +
      `<g class="${doorsCls || 'b3-doors'}"><rect class="b3-dl" x="12" y="12" width="${half - 14}" height="${hh - 24}" rx="8" fill="#C4B5FD" stroke="#8B5CF6" stroke-width="3"/>` +
      `<rect class="b3-dr" x="${half + 2}" y="12" width="${half - 14}" height="${hh - 24}" rx="8" fill="#C4B5FD" stroke="#8B5CF6" stroke-width="3"/>` +
      `<circle class="b3-kl" cx="${half - 12}" cy="${hh / 2}" r="6" fill="#6D28D9"/><circle class="b3-kr" cx="${half + 12}" cy="${hh / 2}" r="6" fill="#6D28D9"/></g>` +
      `</g>`
    );
  }
  /* deschide ușile dulapului (o = 0 închis … 1 deschis) */
  function setDoors(svg, w, hh, o) {
    const half = w / 2;
    const dw = (half - 14) * (1 - 0.82 * o);
    const dl = svg.querySelector('.b3-dl');
    const dr = svg.querySelector('.b3-dr');
    if (!dl) return;
    dl.setAttribute('width', dw.toFixed(1));
    dr.setAttribute('width', dw.toFixed(1));
    dr.setAttribute('x', (w - 12 - dw).toFixed(1));
    svg.querySelector('.b3-kl').setAttribute('cx', (12 + dw - 10).toFixed(1));
    svg.querySelector('.b3-kr').setAttribute('cx', (w - 12 - dw + 10).toFixed(1));
  }
  /* rafturi pline (pentru un dulap de 240×296 la (0,0)) */
  function fullShelves(w, hh, withPhotoSlot) {
    const s1 = hh * 0.3;
    const s2 = hh * 0.58;
    const s3 = hh * 0.84;
    let m = '';
    const nP = Math.floor((w - 34) / 50);
    const nB = Math.floor((w - 34) / 25);
    // raftul de sus: poze
    ['#C47F3B', '#F472B6', '#FACC15', '#7A4A22'].slice(0, nP).forEach((c, i) => (m += `<g transform="translate(${22 + i * 50} ${s1 - 36})">${miniPhoto(c)}</g>`));
    // raftul din mijloc: cântece și jocuri (cu loc liber pentru poza cățelului)
    m += `<g transform="translate(22 ${s2 - 46})">${noteIcon('#8B5CF6')}</g><g transform="translate(62 ${s2 - 46})">${noteIcon('#EC4899')}</g>`;
    if (!withPhotoSlot) m += `<g transform="translate(110 ${s2 - 50}) scale(.62)">${gamepad()}</g>` + (w >= 230 ? `<g transform="translate(166 ${s2 - 46})">${noteIcon('#22C55E')}</g>` : '');
    // raftul de jos: cărți
    ['#EF4444', '#3B82F6', '#22C55E', '#F59E0B', '#A855F7', '#EC4899', '#14B8A6', '#F97316'].slice(0, nB).forEach((c, i) => (m += `<g transform="translate(${22 + i * 25} ${s3 - 58})">${book(c)}</g>`));
    return m;
  }

  /* jucăriile pentru misiunea Mariei (100×100, cu baza la y≈92) */
  const TOYS = [
    () =>
      '<circle cx="50" cy="56" r="36" fill="#EF4444"/><path d="M15 50 q35 -22 70 0" stroke="#fff" stroke-width="8" fill="none"/>' +
      '<path d="M20 72 q30 -14 60 0" stroke="#3B82F6" stroke-width="7" fill="none"/><circle cx="36" cy="38" r="7" fill="#fff" opacity=".6"/>',
    () =>
      '<g transform="translate(0 7)"><path d="M6 72 v-16 q0 -8 8 -10 l14 -4 l12 -18 h30 l14 18 h4 q10 0 10 10 v20z" fill="#3B82F6"/>' +
      '<path d="M44 28 h24 l10 14 h-40z" fill="#BFDBFE"/><circle cx="28" cy="72" r="13" fill="#1F2937"/><circle cx="28" cy="72" r="5" fill="#CBD5E1"/>' +
      '<circle cx="74" cy="72" r="13" fill="#1F2937"/><circle cx="74" cy="72" r="5" fill="#CBD5E1"/><rect x="88" y="52" width="8" height="6" rx="2" fill="#FDE047"/></g>',
    () =>
      '<circle cx="34" cy="18" r="9" fill="#B45309"/><circle cx="66" cy="18" r="9" fill="#B45309"/><circle cx="34" cy="18" r="4" fill="#FDE68A"/><circle cx="66" cy="18" r="4" fill="#FDE68A"/>' +
      '<ellipse cx="50" cy="70" rx="26" ry="22" fill="#B45309"/><ellipse cx="50" cy="72" rx="14" ry="13" fill="#FDE68A"/>' +
      '<ellipse cx="24" cy="64" rx="8" ry="12" fill="#B45309" transform="rotate(30 24 64)"/><ellipse cx="76" cy="64" rx="8" ry="12" fill="#B45309" transform="rotate(-30 76 64)"/>' +
      '<ellipse cx="36" cy="88" rx="11" ry="7" fill="#92400E"/><ellipse cx="64" cy="88" rx="11" ry="7" fill="#92400E"/>' +
      '<circle cx="50" cy="36" r="21" fill="#B45309"/><ellipse cx="50" cy="43" rx="10" ry="8" fill="#FDE68A"/>' +
      '<circle cx="42" cy="32" r="3.5" fill="#2B2D42"/><circle cx="58" cy="32" r="3.5" fill="#2B2D42"/><ellipse cx="50" cy="40" rx="4" ry="3" fill="#2B2D42"/>' +
      '<path d="M46 46 q4 4 8 0" stroke="#2B2D42" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    () =>
      '<path d="M22 40 l14 -14 h48 l-14 14z" fill="#FDE68A" stroke="#CA8A04" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M70 40 l14 -14 v50 l-14 14z" fill="#EAB308" stroke="#CA8A04" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="22" y="40" width="48" height="50" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>' +
      '<text x="46" y="80" font-size="36" font-weight="900" text-anchor="middle" fill="#B45309">A</text>',
  ];

  OT.registerBuilding({
    id: 3,
    key: 'dulap',
    name: 'Masa de lucru și Dulapul',
    color: '#A78BFA',
    dark: '#3B0764',
    learned: 'Masa de lucru se golește când se stinge telefonul; dulapul păstrează pozele mult timp.',
    bow: { top: '3%', right: '2%' },
    bunny: 'left',
    mission: {
      type: 'count',
      say: 'Maria, câte jucării sunt pe masă? Numără și apasă pe cifra potrivită!',
      item: (i) => TOYS[i % TOYS.length](),
      n: 4,
      max: 6,
      answer: 'Sunt patru jucării!',
      bg:
        '<rect width="800" height="420" fill="#F5F3FF"/><rect y="330" width="800" height="90" fill="#D6A26B"/>' +
        '<rect x="60" y="246" width="680" height="22" rx="6" fill="#B45309"/><rect x="60" y="262" width="680" height="10" rx="4" fill="#92400E"/>' +
        '<rect x="90" y="270" width="18" height="64" fill="#92400E"/><rect x="692" y="270" width="18" height="64" fill="#92400E"/>',
      positions: [
        [160, 198],
        [320, 198],
        [480, 198],
        [640, 198],
      ],
    },
    steps: [
      /* 1. Masa de lucru: rapidă, dar mică */
      {
        text: 'Telefonul ține lucrurile în două locuri. Primul e <b>masa de lucru</b>, lângă muncitor: aici stă ce folosești ACUM. E foarte rapidă, dar mică.',
        adult: 'memoria de lucru (RAM)',
        render(ctx) {
          const svg = ctx.scene(
            '0 0 800 450',
            BG +
              `<g opacity=".4">${wardrobe(560, 70, 210, 296, fullShelves(210, 296))}</g>` +
              table(50, 250, 330) +
              `<g transform="translate(78 180)">${photoItem()}</g>` +
              `<g transform="translate(166 192)">${drawing()}</g>` +
              `<g transform="translate(262 198)">${gamepad()}</g>` +
              `<g transform="translate(468 290) scale(.62)">${worker()}</g>` +
              label(215, 118, 'Masa de lucru', 230) +
              `<g transform="translate(352 74) scale(.55)">${A.bolt()}</g>` +
              `<g class="b3-book" opacity="0">${book('#EF4444')}</g>` +
              '<g class="b3-full" opacity="0"><rect x="250" y="136" width="170" height="40" rx="12" fill="#FEE2E2" stroke="#F87171" stroke-width="3"/><text x="335" y="164" font-size="22" font-weight="900" text-anchor="middle" fill="#B91C1C">Nu mai e loc!</text></g>'
          );
          const bk = svg.querySelector('.b3-book');
          const full = svg.querySelector('.b3-full');
          // o carte încearcă să încapă pe masă… și cade
          (async function loop() {
            await ctx.wait(1200);
            while (ctx.alive) {
              bk.setAttribute('opacity', '1');
              await ctx.tween(1100, (p) => bk.setAttribute('transform', `translate(300 ${(20 + p * 120).toFixed(1)})`));
              full.setAttribute('opacity', '1');
              ctx.sfx('bubble');
              await ctx.tween(900, (p) => bk.setAttribute('transform', `translate(${(300 + p * 100).toFixed(1)} ${(140 + p * p * 166).toFixed(1)}) rotate(${(p * 80).toFixed(1)} 11 28)`), (x) => x);
              await ctx.wait(700);
              await ctx.tween(500, (p) => bk.setAttribute('opacity', (1 - p).toFixed(2)));
              full.setAttribute('opacity', '0');
              await ctx.wait(1800);
            }
          })();
        },
      },
      /* 2. Dulapul: mare, păstrează mult timp */
      {
        text: 'Al doilea loc e <b>dulapul</b>. E uriaș și păstrează lucrurile mult timp: poze, jocuri, cântece — chiar și când telefonul e stins.',
        adult: 'memoria de stocare',
        render(ctx) {
          const W = 260;
          const H = 300;
          const svg = ctx.scene(
            '0 0 800 450',
            BG +
              `<g opacity=".45">${table(30, 250, 180)}<g transform="translate(50 196)">${drawing()}</g></g>` +
              wardrobe(270, 64, W, H, `<g class="b3-in" opacity="0">${fullShelves(W, H)}</g>`) +
              label(400, 34, 'Dulapul', 170) +
              '<g class="b3-tags" opacity="0">' +
              '<g transform="translate(640 120)"><rect x="-60" y="-26" width="120" height="44" rx="12" fill="#fff" stroke="#A78BFA" stroke-width="3"/><text y="5" font-size="22" font-weight="900" text-anchor="middle" fill="#3B0764">📷 poze</text></g>' +
              '<g transform="translate(660 210)"><rect x="-80" y="-26" width="160" height="44" rx="12" fill="#fff" stroke="#A78BFA" stroke-width="3"/><text y="5" font-size="22" font-weight="900" text-anchor="middle" fill="#3B0764">🎵 cântece, 🎮 jocuri</text></g>' +
              '<g transform="translate(640 300)"><rect x="-60" y="-26" width="120" height="44" rx="12" fill="#fff" stroke="#A78BFA" stroke-width="3"/><text y="5" font-size="22" font-weight="900" text-anchor="middle" fill="#3B0764">📚 cărți</text></g>' +
              '</g>'
          );
          const inside = svg.querySelector('.b3-in');
          const tags = svg.querySelector('.b3-tags');
          (async () => {
            await ctx.wait(700);
            ctx.sfx('whoosh');
            inside.setAttribute('opacity', '1');
            await ctx.tween(2000, (p) => setDoors(svg, W, H, p));
            await ctx.tween(800, (p) => tags.setAttribute('opacity', p.toFixed(2)));
          })();
        },
      },
      /* 3. Pune poza în dulap */
      {
        text: 'Pune poza cățelului în dulap, ca s-o păstrezi! Trage poza până în dulap (sau doar atinge-o).',
        adult: 'a salva un fișier',
        wait: true,
        hint: 'Trage poza cățelului în dulap!',
        render(ctx) {
          const W = 240;
          const H = 296;
          const WX = 530;
          const WY = 70;
          const SLOT = { x: WX + 100, y: WY + H * 0.58 - 68 };
          const HOME = { x: 74, y: 178 };
          const svg = ctx.scene(
            '0 0 800 450',
            BG +
              wardrobe(WX, WY, W, H, fullShelves(W, H, true) + `<rect class="b3-slot b3-glow" x="98" y="${H * 0.58 - 70}" width="68" height="68" rx="8" fill="#FEF9C3" stroke="#F59E0B" stroke-width="4" stroke-dasharray="10 7"/>`) +
              table(40, 250, 340) +
              `<g class="b3-other" transform="translate(170 192)">${drawing()}</g>` +
              `<g class="b3-other" transform="translate(268 198)">${gamepad()}</g>` +
              '<path class="dash-move b3-arrow" d="M150 160 Q 360 30 600 170" stroke="#F59E0B" stroke-width="6" fill="none" stroke-linecap="round"/>' +
              `<g class="b3-photo b3-drag b3-glow" transform="translate(${HOME.x} ${HOME.y})">${photoItem()}<rect width="64" height="64" fill="transparent"/></g>`
          );
          svg.style.touchAction = 'none';
          setDoors(svg, W, H, 1);
          const ph = svg.querySelector('.b3-photo');
          const slot = svg.querySelector('.b3-slot');
          const arrow = svg.querySelector('.b3-arrow');
          let pos = Object.assign({}, HOME);
          let drag = null;
          let placed = false;
          const put = (p, s) => ph.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${s || 1})`);
          function flyTo(to, after) {
            const from = Object.assign({}, pos);
            return ctx
              .tween(700, (p) => {
                pos = { x: OT.lerp(from.x, to.x, p), y: OT.lerp(from.y, to.y, p) - Math.sin(p * Math.PI) * 60 };
                put(pos);
              })
              .then(after);
          }
          function store() {
            placed = true;
            ph.classList.remove('b3-glow', 'b3-drag');
            arrow.remove();
            ctx.sfx('whoosh');
            flyTo(SLOT, () => {
              pos = Object.assign({}, SLOT);
              put(pos);
              slot.remove();
              ctx.praise('Poza e în dulap! 🐶');
              ctx.setText('Super! Poza cățelului stă acum în dulap, la păstrare. Desenul și jocul au rămas pe masă — pe ele le folosim acum.', 'a salva un fișier');
              ctx.mem.photoInDulap = true;
              ctx.done();
            });
          }
          ctx.on(ph, 'pointerdown', (e) => {
            if (placed) return;
            e.preventDefault();
            const pt = OT.svgPoint(svg, e);
            drag = { dx: pt.x - pos.x, dy: pt.y - pos.y, sx: pt.x, sy: pt.y, moved: false, id: e.pointerId };
            try {
              svg.setPointerCapture(e.pointerId);
            } catch (er) {}
            ctx.sfx('tap');
          });
          ctx.on(svg, 'pointermove', (e) => {
            if (!drag) return;
            const pt = OT.svgPoint(svg, e);
            if (Math.abs(pt.x - drag.sx) + Math.abs(pt.y - drag.sy) > 10) drag.moved = true;
            pos = { x: pt.x - drag.dx, y: pt.y - drag.dy };
            put(pos, 1.12);
          });
          const end = (e) => {
            if (!drag) return;
            const d = drag;
            drag = null;
            if (!d.moved) return store(); // simplă atingere
            const pt = OT.svgPoint(svg, e);
            if (pt.x > WX - 20 && pt.x < WX + W + 20 && pt.y > WY - 20 && pt.y < WY + H) store();
            else {
              ctx.sfx('hmm');
              ctx.toast('Aproape! Du poza până în dulap. 🗄️');
              flyTo(HOME, () => (pos = Object.assign({}, HOME)));
            }
          };
          ctx.on(svg, 'pointerup', end);
          ctx.on(svg, 'pointercancel', end);
          svg.querySelectorAll('.b3-other').forEach((g) =>
            ctx.on(g, 'click', () => {
              if (placed) return;
              ctx.sfx('hmm');
              ctx.toast('Pe acesta îl folosim acum — rămâne pe masă. Mută poza cățelului! 🐶');
            })
          );
        },
      },
      /* 4. Stinge telefonul! */
      {
        text: 'Acum apasă pe „Stinge telefonul”. Ce crezi că se întâmplă cu lucrurile de pe masă și din dulap?',
        adult: 'memoria de lucru se golește fără curent',
        wait: true,
        hint: 'Apasă pe „Stinge telefonul”, apoi pe „Aprinde telefonul”!',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b3-safe');
          const W = 240;
          const H = 296;
          const WX = 530;
          const WY = 70;
          const items =
            `<g class="b3-it" transform="translate(70 192)">${drawing()}</g>` +
            `<g class="b3-it" transform="translate(170 198)">${gamepad()}</g>` +
            `<g class="b3-it" transform="translate(272 194) scale(1.1)">${noteIcon('#EC4899')}</g>`;
          const svg = ctx.scene(
            '0 0 800 450',
            BG +
              wardrobe(WX, WY, W, H, fullShelves(W, H, true) + `<g class="b3-kept" transform="translate(100 ${H * 0.58 - 68})">${photoItem()}</g>`) +
              table(40, 250, 340) +
              `<g class="b3-items">${items}</g>` +
              label(210, 118, 'Masa de lucru', 230) +
              label(WX + W / 2, 40, 'Dulapul', 170) +
              '<g class="b3-q" opacity="0"><text x="210" y="226" font-size="60" font-weight="900" text-anchor="middle" fill="#A78BFA">?</text></g>' +
              '<rect class="b3-dark" width="800" height="450" fill="#0F172A" opacity="0" pointer-events="none"/>' +
              '<text class="b3-zzz" x="400" y="230" font-size="54" font-weight="900" text-anchor="middle" fill="#C7D2FE" opacity="0">z z z</text>'
          );
          setDoors(svg, W, H, 1);
          const dark = svg.querySelector('.b3-dark');
          const zzz = svg.querySelector('.b3-zzz');
          const kept = svg.querySelector('.b3-kept');
          const q = svg.querySelector('.b3-q');
          const btn = h('button', { class: 'big-btn', style: { background: '#334155', color: '#fff' } }, '🔌 Stinge telefonul');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, btn));
          let phase = 'on';
          let busy = false;
          btn.addEventListener('click', async () => {
            if (busy) return;
            busy = true;
            if (phase === 'on') {
              ctx.sfx('powerOff');
              ctx.setText('Telefonul se stinge… Fără curent, muncitorul se oprește.');
              const its = Array.from(svg.querySelectorAll('.b3-it'));
              // lucrurile de pe masă dispar („puf!”)
              await ctx.wait(500);
              its.forEach((g, i) =>
                ctx.timeout(() => {
                  const c = OT.center(g);
                  OT.fx.burst('sparkles', c.x, c.y, 7, { spread: 70 });
                  OT.sfx('pop');
                  OT.anim(g, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
                  ctx.timeout(() => g.setAttribute('opacity', '0'), 480);
                }, i * 350)
              );
              await ctx.tween(1800, (p) => dark.setAttribute('opacity', (p * 0.9).toFixed(2)));
              zzz.setAttribute('opacity', '1');
              phase = 'off';
              btn.textContent = '💡 Aprinde telefonul';
              btn.style.background = '#FACC15';
              btn.style.color = '#2B2D42';
              ctx.setText('Telefonul doarme. 😴 Ce a rămas? Apasă pe „Aprinde telefonul”!');
            } else if (phase === 'off') {
              ctx.sfx('powerOn');
              zzz.setAttribute('opacity', '0');
              await ctx.tween(1500, (p) => dark.setAttribute('opacity', ((1 - p) * 0.9).toFixed(2)));
              q.setAttribute('opacity', '1');
              kept.classList.add('b3-glow');
              const c = OT.center(kept);
              OT.fx.burst('stars', c.x, c.y, 10, { spread: 120 });
              ctx.sfx('success');
              ctx.setText('Vezi? <b>Masa s-a golit</b>, dar <b>dulapul a păstrat poza</b>! 🐶 De aceea pozele stau în dulap.');
              ctx.done();
              phase = 'again';
              btn.textContent = '🔁 Încă o dată';
              btn.style.background = '#A78BFA';
              btn.style.color = '#fff';
            } else {
              // reia: lucrurile revin pe masă
              ctx.sfx('tap');
              q.setAttribute('opacity', '0');
              kept.classList.remove('b3-glow');
              svg.querySelectorAll('.b3-it').forEach((g) => {
                g.setAttribute('opacity', '1');
                OT.anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
              });
              phase = 'on';
              btn.textContent = '🔌 Stinge telefonul';
              btn.style.background = '#334155';
              btn.style.color = '#fff';
            }
            busy = false;
          });
        },
      },
      /* 5. Provocare: întrebări */
      {
        text: 'Provocare: răspunde la trei întrebări despre masă și dulap!',
        wait: true,
        hint: 'Răspunde la toate cele trei întrebări!',
        render(ctx) {
          OT.kit.quiz(
            ctx,
            [
              {
                pic: '📷 ➜ 🗄️ 🔌',
                q: 'Ai pus poza în dulap și stingi telefonul. Mai e poza acolo?',
                options: [
                  { t: 'Da, dulapul o păstrează', ico: '👍', ok: true, why: 'Da! Dulapul ține lucrurile chiar și când telefonul e stins.' },
                  { t: 'Nu, a dispărut', ico: '👎', why: 'Hmm… dulapul păstrează lucrurile chiar și fără curent. Mai încearcă!' },
                ],
              },
              {
                pic: '🎨 🪫',
                q: 'Desenai ceva pe masa de lucru și s-a terminat bateria înainte să apeși „Salvează”. Mai e desenul?',
                options: [
                  { t: 'Nu, s-a pierdut', ico: '😢', ok: true, why: 'Așa e! Masa se golește. De aceea apăsăm „Salvează” — ca desenul să ajungă în dulap.' },
                  { t: 'Da, e tot acolo', ico: '😃', why: 'Hmm… masa de lucru se golește când se stinge telefonul. Mai încearcă!' },
                ],
              },
              {
                pic: '🤔',
                q: 'Unde încap mai multe lucruri?',
                options: [
                  { t: 'În dulap', ico: '🗄️', ok: true, why: 'Da! Dulapul e uriaș: încap mii de poze și cântece.' },
                  { t: 'Pe masa de lucru', ico: '🪑', why: 'Masa e rapidă, dar mică. Mai încearcă!' },
                ],
              },
            ],
            () => {
              ctx.setText('Bravo! Acum știi secretul: <b>masa</b> e pentru ce folosești acum, <b>dulapul</b> păstrează lucrurile mult timp.');
              ctx.done();
            },
            { endPic: '🗄️🏆', endText: 'Bravo! Știi tot despre masă și dulap!' }
          );
        },
      },
    ],
  });
})();
