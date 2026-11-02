/* Ediția Beatrice — desene: Beatrice, chitara, clădirea „Studioul de chitară”, desenul ei */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const SKIN = '#F8D3AE';
  const SKIN2 = '#F0BF95';
  const INK = '#2B2D42';
  const HAIR = '#7B4A2A';

  /* Beatrice, 11 ani (viewBox 0 0 200 320): păr lung, beretă de pictoriță, creion în mână */
  A.beatrice = () =>
    `<ellipse cx="100" cy="304" rx="56" ry="9" fill="#000" opacity=".12"/>` +
    `<path d="M48 86 Q40 160 66 178 L134 178 Q160 160 152 86Z" fill="${HAIR}"/>` +
    `<g class="legs"><rect x="81" y="236" width="16" height="58" rx="7" fill="${SKIN2}"/><rect x="103" y="236" width="16" height="58" rx="7" fill="${SKIN2}"/>` +
    `<rect x="80" y="270" width="18" height="20" rx="5" fill="#fff"/><rect x="102" y="270" width="18" height="20" rx="5" fill="#fff"/>` +
    `<ellipse cx="88" cy="296" rx="17" ry="9" fill="#7C3AED"/><ellipse cx="112" cy="296" rx="17" ry="9" fill="#7C3AED"/></g>` +
    `<g class="arm-l"><path d="M66 146 q-20 30 -16 70" stroke="${SKIN2}" stroke-width="18" stroke-linecap="round" fill="none"/></g>` +
    `<g class="arm-r"><path d="M134 146 q24 24 26 54" stroke="${SKIN2}" stroke-width="18" stroke-linecap="round" fill="none"/>` +
    `<g transform="translate(162 196) rotate(-30)"><rect x="-5" y="-34" width="10" height="44" fill="#FACC15"/><rect x="-5" y="-40" width="10" height="7" fill="#F472B6"/><path d="M-5 10 l5 13 l5 -13z" fill="#F5D0A9"/><path d="M-1.6 19 l1.6 4 l1.6 -4z" fill="${INK}"/></g></g>` +
    `<path d="M60 142 q40 -20 80 0 l12 40 l-16 6 l-2 32 q-34 8 -68 0 l-2 -32 l-16 -6z" fill="#14B8A6"/>` +
    `<g transform="translate(100 182)"><path d="M-16 -2 a18 14 0 1 1 28 10 q-6 -2 -8 4 q-4 8 -20 -14z" fill="#fff"/><circle cx="-8" cy="-6" r="3" fill="#EF4444"/><circle cx="2" cy="-9" r="3" fill="#FACC15"/><circle cx="10" cy="-3" r="3" fill="#3B82F6"/><circle cx="-10" cy="3" r="3" fill="#22C55E"/></g>` +
    `<path d="M64 212 h72 l12 36 q-48 10 -96 0z" fill="#3B5BA9"/>` +
    `<rect x="91" y="120" width="18" height="22" rx="6" fill="${SKIN2}"/>` +
    `<circle cx="100" cy="86" r="45" fill="${SKIN}"/>` +
    `<path d="M55 84 Q52 40 100 38 Q148 40 145 84 Q134 62 114 62 Q102 56 90 62 Q70 60 55 84Z" fill="${HAIR}"/>` +
    `<g transform="rotate(-12 94 42)"><ellipse cx="94" cy="44" rx="48" ry="15" fill="#7C3AED"/><ellipse cx="94" cy="40" rx="40" ry="10" fill="#8B5CF6"/><circle cx="94" cy="28" r="5" fill="#6D28D9"/></g>` +
    `<g class="eyes"><ellipse cx="84" cy="90" rx="6" ry="7" fill="${INK}"/><ellipse cx="116" cy="90" rx="6" ry="7" fill="${INK}"/><circle cx="86" cy="87" r="2.3" fill="#fff"/><circle cx="118" cy="87" r="2.3" fill="#fff"/></g>` +
    `<path d="M78 86 l-4 -3 M78 90 l-5 -1 M122 86 l4 -3 M122 90 l5 -1" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M76 76 q8 -5 16 -1 M108 75 q8 -4 16 1" stroke="${HAIR}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<circle cx="72" cy="104" r="7" fill="#F87171" opacity=".35"/><circle cx="128" cy="104" r="7" fill="#F87171" opacity=".35"/>` +
    `<path class="mouth" d="M88 106 q12 12 24 0z" fill="#fff" stroke="#7A2E2E" stroke-width="3.5" stroke-linejoin="round"/>`;

  /* chitara acustică (viewBox 0 0 120 320) */
  A.guitar = () =>
    `<rect x="52" y="20" width="16" height="170" fill="#78350F"/>` +
    [40, 62, 82, 100, 116, 130, 142, 154].map((y) => `<rect x="52" y="${y}" width="16" height="2" fill="#D6D3D1"/>`).join('') +
    `<path d="M46 22 h28 l-3 -20 h-22z" fill="#451A03"/>` +
    [6, 12, 18].map((y) => `<circle cx="44" cy="${y}" r="3.5" fill="#E7E5E4"/><circle cx="76" cy="${y}" r="3.5" fill="#E7E5E4"/>`).join('') +
    `<circle cx="60" cy="182" r="40" fill="#F59E0B"/><circle cx="60" cy="250" r="54" fill="#F59E0B"/><rect x="34" y="190" width="52" height="40" fill="#F59E0B"/>` +
    `<circle cx="60" cy="182" r="40" fill="none" stroke="#B45309" stroke-width="3"/><circle cx="60" cy="250" r="54" fill="none" stroke="#B45309" stroke-width="3"/>` +
    `<circle cx="60" cy="214" r="17" fill="#3B1D0A" stroke="#92400E" stroke-width="4"/>` +
    `<rect x="40" y="266" width="40" height="8" rx="3" fill="#451A03"/>` +
    `<g class="g-strings" stroke="#FEF3C7" stroke-width="1.2">` + [54, 56.4, 58.8, 61.2, 63.6, 66].map((x) => `<line x1="${x}" y1="8" x2="${x}" y2="270"/>`).join('') + `</g>`;

  A.buildings.chitara = () =>
    `<rect x="118" y="8" width="24" height="112" fill="#92400E"/>` +
    [28, 46, 62, 76, 88].map((y) => `<rect x="118" y="${y}" width="24" height="3" fill="#E7E5E4"/>`).join('') +
    `<path d="M112 10 h36 l-4 -28 h-28z" fill="#78350F"/>` +
    [-14, -4, 6].map((y) => `<circle cx="110" cy="${y}" r="5" fill="#E7E5E4"/><circle cx="150" cy="${y}" r="5" fill="#E7E5E4"/>`).join('') +
    `<circle cx="130" cy="122" r="46" fill="#F59E0B" stroke="#B45309" stroke-width="6"/><circle cx="130" cy="178" r="56" fill="#F59E0B" stroke="#B45309" stroke-width="6"/>` +
    `<rect x="90" y="124" width="80" height="50" fill="#F59E0B"/>` +
    `<circle class="win" cx="130" cy="140" r="20"/><circle cx="130" cy="140" r="25" fill="none" stroke="#78350F" stroke-width="4"/>` +
    `<g stroke="#FEF3C7" stroke-width="1.4">` + [124, 126.5, 129, 131.5, 134, 136.5].map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="196"/>`).join('') + `</g>` +
    `<rect x="108" y="194" width="44" height="8" rx="3" fill="#78350F"/>` +
    `<path d="M116 232 v-20 a14 14 0 0 1 28 0 v20z" fill="#78350F"/>` +
    `<g class="notes"><g transform="translate(40 60) scale(.42)">${A.note('#F472B6')}</g><g transform="translate(184 40) scale(.38)">${A.note('#FDE047')}</g><g transform="translate(196 120) scale(.32)">${A.note('#86EFAC')}</g></g>`;
  A.icons.chitara = () => `<g transform="translate(52 -6) rotate(35) scale(.34)">${A.guitar()}</g>`;
  /* șevaletul cu desenul Beatricei (viewBox 0 0 200 240) */
  A.easel = () =>
    `<path d="M50 230 L90 30 M150 230 L110 30 M100 30 V236" stroke="#92400E" stroke-width="9" stroke-linecap="round"/>` +
    `<rect x="40" y="40" width="120" height="120" rx="6" fill="#fff" stroke="#B45309" stroke-width="6"/>` +
    `<g transform="translate(46 46)">${A.photoSVG({ size: 108 })}</g>` +
    `<rect x="34" y="158" width="132" height="10" rx="4" fill="#B45309"/>`;

  /* desenul Beatricei = „poza” care călătorește prin oraș (16×16, culorile 1–8) */
  const DEFAULT = [
    '................',
    '.yyy............',
    'yyyyy.....rr....',
    'yyyyy....rrrr...',
    '.yyy....rryyrr..',
    '........rryyrr..',
    '.........rrrr...',
    '..........rr....',
    '..........g.....',
    '........gggg....',
    '..........g.....',
    '..........g.....',
    '........ooooo...',
    '.........ooo....',
    'gggggggggggggggg',
    'gggggggggggggggg',
  ];
  A.BEA_PALETTE = { '.': '#FFFFFF', r: '#EF4444', o: '#F97316', y: '#FACC15', g: '#22C55E', b: '#3B82F6', p: '#A855F7', k: '#2B2D42' };
  A.BEA_NAMES = { '.': 'alb', r: 'roșu', o: 'portocaliu', y: 'galben', g: 'verde', b: 'albastru', p: 'mov', k: 'negru' };
  A.BEA_NUMBERS = { '.': 1, r: 2, o: 3, y: 4, g: 5, b: 6, p: 7, k: 8 };
  A.DEFAULT_DRAWING = DEFAULT;
  /** folosește desenul Beatricei (salvat în progres) ca „poza” jocului */
  A.useDrawing = function () {
    const d = OT.state.drawing;
    const ok = Array.isArray(d) && d.length === 16 && d.every((r) => typeof r === 'string' && r.length === 16);
    A.photo.rows = ok ? d : DEFAULT;
    A.photo.palette = A.BEA_PALETTE;
    A.photo.numbers = A.BEA_NUMBERS;
    A.photo.names = A.BEA_NAMES;
  };
  A.useDrawing();
})();
(function () {
  const A = window.OT.art;
  A.VB.beatrice = '0 0 200 320';
  A.VB.guitar = '0 0 120 320';
  A.VB.easel = '0 0 200 240';
  A.HEAD.beatrice = '40 18 120 124';
})();
