/* Orașul din Telefon — desene SVG (personaje, clădiri, iconițe, poza cățelului)
   Toate funcțiile întorc text SVG (markup) care se pune într-un <svg> cu viewBox potrivit.
   OT.art.make('andrei', {class:'x'})  -> element <svg> gata făcut
   OT.art.head('maria')                -> doar capul (pentru avatar)
*/
(function () {
  'use strict';
  const OT = window.OT;
  const art = (OT.art = {});

  const SKIN = '#F8D3AE';
  const SKIN2 = '#F0BF95';
  const INK = '#2B2D42';

  /* ---------- forme mici ---------- */
  art.starPath = function (cx, cy, R, r) {
    r = r == null ? R * 0.45 : r;
    let d = '';
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r : R;
      const a = (-90 + i * 36) * (Math.PI / 180);
      d += (i ? 'L' : 'M') + (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  };
  art.star = (fill, stroke) =>
    `<path d="${art.starPath(50, 52, 46, 20)}" fill="${fill || '#FCD34D'}" stroke="${stroke || '#F59E0B'}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M36 40 l6 -8" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  art.heartPath = 'M50 88 C18 64 4 46 14 27 C24 9 44 12 50 29 C56 12 76 9 86 27 C96 46 82 64 50 88Z';
  art.heart = (fill) => `<path d="${art.heartPath}" fill="${fill || '#F43F5E'}"/><path d="M26 32 q4 -8 12 -8" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".6"/>`;
  art.balloon = (fill) =>
    `<path d="M50 96 q-6 20 4 40" stroke="#94A3B8" stroke-width="2" fill="none"/>` +
    `<ellipse cx="50" cy="48" rx="34" ry="42" fill="${fill || '#F87171'}"/>` +
    `<path d="M44 90 h12 l-6 -8z" fill="${fill || '#F87171'}"/>` +
    `<ellipse cx="38" cy="32" rx="8" ry="12" fill="#fff" opacity=".45"/>`;
  art.candy = (fill) =>
    `<path d="M22 50 L4 34 L6 66Z M78 50 L96 34 L94 66Z" fill="${fill || '#F472B6'}"/>` +
    `<circle cx="50" cy="50" r="28" fill="${fill || '#F472B6'}"/>` +
    `<path d="M32 40 q18 -14 36 0 M30 56 q20 -14 40 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`;
  art.note = (fill) =>
    `<ellipse cx="34" cy="76" rx="18" ry="13" fill="${fill || '#8B5CF6'}" transform="rotate(-20 34 76)"/>` +
    `<rect x="46" y="14" width="7" height="62" rx="3" fill="${fill || '#8B5CF6'}"/>` +
    `<path d="M53 14 q26 6 24 32 q-6 -14 -24 -16z" fill="${fill || '#8B5CF6'}"/>`;
  art.bow = () =>
    `<path d="M50 36 C30 4 4 10 7 36 C4 62 30 68 50 36Z" fill="#F472B6" stroke="#DB2777" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M50 36 C70 4 96 10 93 36 C96 62 70 68 50 36Z" fill="#F472B6" stroke="#DB2777" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M20 26 q8 -8 16 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>` +
    `<circle cx="50" cy="36" r="11" fill="#EC4899" stroke="#DB2777" stroke-width="4"/>`;
  art.sparkle = (fill) => `<path d="M50 4 C54 40 60 46 96 50 C60 54 54 60 50 96 C46 60 40 54 4 50 C40 46 46 40 50 4Z" fill="${fill || '#FDE68A'}"/>`;
  art.cloud = (x, y, s, fill) =>
    `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M20 60 a26 26 0 0 1 10 -50 a34 34 0 0 1 62 6 a24 24 0 0 1 28 44z" fill="${fill || '#fff'}"/></g>`;
  art.tree = (x, y, s, c) =>
    `<g transform="translate(${x} ${y}) scale(${s || 1})"><rect x="-8" y="-10" width="16" height="44" rx="5" fill="#92400E"/>` +
    `<circle cx="0" cy="-38" r="34" fill="${c || '#4ADE80'}"/><circle cx="-24" cy="-18" r="22" fill="${c || '#4ADE80'}"/><circle cx="24" cy="-18" r="22" fill="${c || '#4ADE80'}"/>` +
    `<circle cx="-10" cy="-50" r="10" fill="#fff" opacity=".25"/></g>`;
  art.gear = (cx, cy, r, fill, teeth) => {
    teeth = teeth || 8;
    let t = '';
    for (let i = 0; i < teeth; i++) t += `<rect x="${-r * 0.2}" y="${-r * 1.28}" width="${r * 0.4}" height="${r * 0.5}" rx="${r * 0.08}" transform="rotate(${(360 / teeth) * i})"/>`;
    return `<g transform="translate(${cx} ${cy})"><g class="gear-spin" fill="${fill || '#6B7280'}">${t}<circle r="${r}"/><circle r="${r * 0.38}" fill="#fff" opacity=".85"/></g></g>`;
  };
  /** telefon desenat: (x,y) colț, lățime w, înălțime h, conținut ecran (markup), culoare carcasă */
  art.phone = (x, y, w, h, screen, body) =>
    `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="${w * 0.16}" fill="${body || '#334155'}"/>` +
    `<rect x="${w * 0.07}" y="${h * 0.06}" width="${w * 0.86}" height="${h * 0.86}" rx="${w * 0.1}" fill="#E0F2FE"/>` +
    `<rect x="${w * 0.38}" y="${h * 0.018}" width="${w * 0.24}" height="${h * 0.022}" rx="${h * 0.01}" fill="#1E293B"/>` +
    `<g transform="translate(${w * 0.07} ${h * 0.06})">${screen || ''}</g></g>`;
  /** plic: (x,y) colț, lățime w (înălțimea = 0.66w) */
  art.envelope = (x, y, w, fill, open) => {
    const h = w * 0.66;
    return (
      `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="${w * 0.06}" fill="${fill || '#FFFBEB'}" stroke="#F59E0B" stroke-width="${Math.max(2, w * 0.03)}"/>` +
      (open
        ? `<path d="M0 0 L${w / 2} ${-h * 0.55} L${w} 0" fill="${fill || '#FFFBEB'}" stroke="#F59E0B" stroke-width="${Math.max(2, w * 0.03)}" stroke-linejoin="round"/>`
        : `<path d="M${w * 0.02} ${h * 0.04} L${w / 2} ${h * 0.56} L${w * 0.98} ${h * 0.04}" fill="none" stroke="#F59E0B" stroke-width="${Math.max(2, w * 0.03)}" stroke-linejoin="round"/>`) +
      `<circle cx="${w / 2}" cy="${h * 0.56}" r="${w * 0.07}" fill="#F43F5E"/></g>`
    );
  };
  art.plane = (x, y, s, fill) =>
    `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M-50 0 q10 -12 70 -10 q22 2 30 10 q-8 8 -30 10 q-60 2 -70 -10z" fill="${fill || '#fff'}" stroke="#93C5FD" stroke-width="3"/>` +
    `<path d="M-6 -6 l-22 -30 h12 l30 30z M-6 6 l-22 30 h12 l30 -30z M-44 -4 l-10 -18 h8 l14 16z" fill="#3B82F6"/>` +
    `<circle cx="14" cy="-2" r="3" fill="#93C5FD"/><circle cx="2" cy="-2" r="3" fill="#93C5FD"/><circle cx="-10" cy="-2" r="3" fill="#93C5FD"/></g>`;
  art.tower = (x, y, s) =>
    `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M-30 0 L-6 -150 h12 L30 0 h-12 L0 -120 L-18 0z" fill="#64748B"/>` +
    `<path d="M-22 -40 h44 M-16 -80 h32 M-10 -115 h20" stroke="#64748B" stroke-width="5"/>` +
    `<rect x="-14" y="-150" width="28" height="10" rx="3" fill="#475569"/><circle cx="0" cy="-160" r="7" fill="#EF4444"/></g>`;
  art.lock = (fill) =>
    `<path d="M30 46 V32 a20 20 0 0 1 40 0 V46" stroke="#64748B" stroke-width="9" fill="none"/>` +
    `<rect x="18" y="44" width="64" height="48" rx="10" fill="${fill || '#FBBF24'}"/><circle cx="50" cy="64" r="7" fill="${INK}"/><rect x="47" y="66" width="6" height="14" rx="3" fill="${INK}"/>`;
  art.key = (fill) =>
    `<circle cx="28" cy="50" r="20" fill="${fill || '#FBBF24'}"/><circle cx="28" cy="50" r="8" fill="#fff"/>` +
    `<rect x="44" y="44" width="48" height="12" rx="4" fill="${fill || '#FBBF24'}"/><rect x="72" y="54" width="8" height="14" rx="2" fill="${fill || '#FBBF24'}"/><rect x="84" y="54" width="8" height="10" rx="2" fill="${fill || '#FBBF24'}"/>`;
  art.battery = (level, fill) => {
    level = level == null ? 1 : level;
    const h = 64 * level;
    return (
      `<rect x="40" y="6" width="20" height="10" rx="3" fill="#64748B"/><rect x="24" y="14" width="52" height="80" rx="10" fill="#fff" stroke="#64748B" stroke-width="6"/>` +
      `<rect x="32" y="${86 - h}" width="36" height="${h}" rx="5" fill="${fill || '#4ADE80'}"/>` +
      `<path d="M54 30 L40 56 h12 l-6 22 l16 -30 h-12z" fill="#FDE047" stroke="#CA8A04" stroke-width="2"/>`
    );
  };
  art.bulb = (on) =>
    `<path d="M50 10 a30 30 0 0 1 18 54 v10 h-36 v-10 a30 30 0 0 1 18 -54z" fill="${on ? '#FDE047' : '#E5E7EB'}" stroke="${on ? '#EAB308' : '#9CA3AF'}" stroke-width="4"/>` +
    `<rect x="34" y="76" width="32" height="14" rx="4" fill="#94A3B8"/>` +
    (on ? `<path d="M50 0 v-8 M84 20 l7 -6 M16 20 l-7 -6 M94 46 h8 M6 46 h-8" stroke="#FACC15" stroke-width="5" stroke-linecap="round" transform="translate(0 6)"/>` : '');
  art.bolt = (fill) => `<path d="M58 4 L20 56 h24 l-10 40 l46 -58 h-26z" fill="${fill || '#FDE047'}" stroke="#CA8A04" stroke-width="4" stroke-linejoin="round"/>`;

  /* ---------- personaje (viewBox 0 0 200 320, tălpile la y≈300) ---------- */
  const shadow = (rx) => `<ellipse cx="100" cy="304" rx="${rx || 58}" ry="9" fill="#000" opacity=".12"/>`;
  const eyes = (lx, rx, y, r) =>
    `<g class="eyes"><ellipse cx="${lx}" cy="${y}" rx="${r}" ry="${r * 1.15}" fill="${INK}"/><ellipse cx="${rx}" cy="${y}" rx="${r}" ry="${r * 1.15}" fill="${INK}"/>` +
    `<circle cx="${lx + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.38}" fill="#fff"/><circle cx="${rx + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.38}" fill="#fff"/></g>`;
  const cheeks = (lx, rx, y, r) =>
    `<circle cx="${lx}" cy="${y}" r="${r}" fill="#F87171" opacity=".35"/><circle cx="${rx}" cy="${y}" r="${r}" fill="#F87171" opacity=".35"/>`;

  art.andrei = () =>
    shadow(60) +
    `<g class="legs"><rect x="74" y="218" width="24" height="76" rx="9" fill="#2C4A86"/><rect x="102" y="218" width="24" height="76" rx="9" fill="#2C4A86"/>` +
    `<rect x="64" y="286" width="38" height="16" rx="8" fill="#E53E3E"/><rect x="98" y="286" width="38" height="16" rx="8" fill="#E53E3E"/>` +
    `<rect x="64" y="296" width="38" height="6" rx="3" fill="#fff"/><rect x="98" y="296" width="38" height="6" rx="3" fill="#fff"/></g>` +
    `<g class="arm-l"><path d="M64 142 q-22 30 -18 72" stroke="${SKIN2}" stroke-width="20" stroke-linecap="round" fill="none"/></g>` +
    `<g class="arm-r"><path d="M136 142 q22 30 18 72" stroke="${SKIN2}" stroke-width="20" stroke-linecap="round" fill="none"/></g>` +
    `<path d="M58 140 q42 -22 84 0 l12 42 l-18 6 l-2 40 q-32 9 -68 0 l-2 -40 l-18 -6z" fill="#3B82F6"/>` +
    `<g fill="#fff"><ellipse cx="94" cy="198" rx="9" ry="7" transform="rotate(-20 94 198)"/><rect x="100" y="164" width="4.5" height="34" rx="2"/><path d="M104 164 q15 4 13 19 q-3 -9 -13 -11z"/></g>` +
    `<rect x="90" y="118" width="20" height="20" rx="6" fill="${SKIN2}"/>` +
    `<circle cx="55" cy="86" r="10" fill="${SKIN2}"/><circle cx="145" cy="86" r="10" fill="${SKIN2}"/>` +
    `<circle cx="100" cy="82" r="46" fill="${SKIN}"/>` +
    `<path d="M54 80 Q50 34 100 30 Q152 32 148 80 Q145 60 128 55 Q132 47 120 44 Q113 57 92 53 Q80 61 66 59 Q58 65 54 80Z" fill="#6B3E1F"/>` +
    `<path d="M74 70 q9 -5 18 0 M108 70 q9 -5 18 0" stroke="#6B3E1F" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
    eyes(83, 117, 85, 6) +
    cheeks(71, 129, 101, 7) +
    `<path class="mouth" d="M86 104 q14 15 28 0z" fill="#fff" stroke="#7A2E2E" stroke-width="4" stroke-linejoin="round"/>`;

  art.maria = () =>
    shadow(46) +
    `<g class="legs"><rect x="83" y="232" width="14" height="62" rx="6" fill="${SKIN2}"/><rect x="103" y="232" width="14" height="62" rx="6" fill="${SKIN2}"/>` +
    `<rect x="82" y="268" width="16" height="24" rx="5" fill="#fff"/><rect x="102" y="268" width="16" height="24" rx="5" fill="#fff"/>` +
    `<ellipse cx="88" cy="296" rx="15" ry="8" fill="#DB2777"/><ellipse cx="112" cy="296" rx="15" ry="8" fill="#DB2777"/></g>` +
    `<g class="arm-l"><path d="M72 172 q-16 26 -14 56" stroke="${SKIN2}" stroke-width="15" stroke-linecap="round" fill="none"/></g>` +
    `<g class="arm-r"><path d="M128 172 q16 26 14 56" stroke="${SKIN2}" stroke-width="15" stroke-linecap="round" fill="none"/></g>` +
    `<path d="M72 166 q28 -14 56 0 l20 72 q-48 12 -96 0z" fill="#EC4899"/>` +
    `<path d="M86 160 q14 10 28 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    `<g fill="#fff" opacity=".85"><circle cx="86" cy="190" r="4"/><circle cx="112" cy="184" r="4"/><circle cx="100" cy="206" r="4"/><circle cx="76" cy="222" r="4"/><circle cx="124" cy="216" r="4"/><circle cx="100" cy="230" r="4"/></g>` +
    `<rect x="92" y="150" width="16" height="16" rx="5" fill="${SKIN2}"/>` +
    `<circle cx="50" cy="116" r="19" fill="#9A6332"/><circle cx="150" cy="116" r="19" fill="#9A6332"/>` +
    `<circle cx="64" cy="104" r="6" fill="#F472B6"/><circle cx="136" cy="104" r="6" fill="#F472B6"/>` +
    `<circle cx="100" cy="116" r="44" fill="${SKIN}"/>` +
    `<path d="M56 118 Q52 70 100 70 Q148 70 144 118 Q140 94 120 90 Q102 100 80 90 Q60 96 56 118Z" fill="#9A6332"/>` +
    `<g class="hair-bow" transform="translate(100 74) scale(.5) translate(-50 -36)">${art.bow()}</g>` +
    eyes(85, 115, 121, 6.5) +
    `<path d="M79 116 l-4 -4 M79 120 l-5 -1 M121 116 l4 -4 M121 120 l5 -1" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M77 106 q8 -6 16 -1 M107 105 q8 -5 16 1" stroke="#7A4A22" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    cheeks(73, 127, 136, 7) +
    `<path class="mouth" d="M89 138 q11 11 22 0" stroke="#7A2E2E" stroke-width="4" fill="none" stroke-linecap="round"/>`;

  /* iepurașul de pluș al Elenei (viewBox 0 0 200 240) */
  art.bunny = () =>
    `<g class="bunny-ears"><g class="ear-l"><ellipse cx="70" cy="58" rx="20" ry="52" fill="#fff" stroke="#E2DCEF" stroke-width="3" transform="rotate(-14 70 100)"/>` +
    `<ellipse cx="70" cy="62" rx="10" ry="38" fill="#F9A8D4" transform="rotate(-14 70 100)"/></g>` +
    `<g class="ear-r"><ellipse cx="130" cy="58" rx="20" ry="52" fill="#fff" stroke="#E2DCEF" stroke-width="3" transform="rotate(14 130 100)"/>` +
    `<ellipse cx="130" cy="62" rx="10" ry="38" fill="#F9A8D4" transform="rotate(14 130 100)"/></g></g>` +
    `<ellipse cx="100" cy="186" rx="52" ry="46" fill="#fff" stroke="#E2DCEF" stroke-width="3"/>` +
    `<ellipse cx="100" cy="194" rx="30" ry="28" fill="#FDE7F1"/>` +
    `<ellipse cx="70" cy="226" rx="22" ry="12" fill="#fff" stroke="#E2DCEF" stroke-width="3"/><ellipse cx="130" cy="226" rx="22" ry="12" fill="#fff" stroke="#E2DCEF" stroke-width="3"/>` +
    `<circle cx="100" cy="120" r="50" fill="#fff" stroke="#E2DCEF" stroke-width="3"/>` +
    eyes(82, 118, 114, 7) +
    cheeks(70, 130, 132, 9) +
    `<path d="M93 126 q7 -5 14 0 q-7 9 -14 0z" fill="#F472B6"/>` +
    `<path d="M100 132 v5 M92 140 q8 6 8 -3 q0 9 8 3" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<path d="M60 126 h-22 M60 134 l-20 6 M140 126 h22 M140 134 l20 6" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>` +
    `<path d="M100 166 l-20 -10 v20z M100 166 l20 -10 v20z" fill="#60A5FA"/><circle cx="100" cy="166" r="6" fill="#3B82F6"/>`;

  art.elena = () =>
    shadow(48) +
    `<g class="legs"><rect x="78" y="252" width="20" height="40" rx="10" fill="#FCD34D"/><rect x="102" y="252" width="20" height="40" rx="10" fill="#FCD34D"/>` +
    `<ellipse cx="87" cy="295" rx="15" ry="9" fill="#fff" stroke="#F3E8C8" stroke-width="2"/><ellipse cx="113" cy="295" rx="15" ry="9" fill="#fff" stroke="#F3E8C8" stroke-width="2"/></g>` +
    `<ellipse cx="100" cy="236" rx="42" ry="38" fill="#FCD34D"/>` +
    `<path d="M76 214 q24 14 48 0" stroke="#FBBF24" stroke-width="5" fill="none"/>` +
    `<g class="held-bunny" transform="translate(70 186) scale(.3)">${art.bunny()}</g>` +
    `<path d="M66 220 q2 22 24 30" stroke="${SKIN2}" stroke-width="15" stroke-linecap="round" fill="none"/>` +
    `<path d="M134 220 q-2 22 -24 30" stroke="${SKIN2}" stroke-width="15" stroke-linecap="round" fill="none"/>` +
    `<rect x="92" y="200" width="16" height="10" rx="4" fill="${SKIN2}"/>` +
    `<circle cx="100" cy="166" r="42" fill="${SKIN}"/>` +
    `<path d="M66 150 Q78 122 100 124 Q124 122 134 150 Q120 134 100 136 Q80 134 66 150Z" fill="#EAB54E"/>` +
    `<path d="M98 126 q-6 -20 10 -22 q12 0 8 12 q-3 6 -9 2" stroke="#EAB54E" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    eyes(86, 114, 170, 6.5) +
    cheeks(72, 128, 184, 9) +
    `<path class="mouth" d="M93 186 q7 7 14 0" stroke="#7A2E2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
    `<circle cx="58" cy="168" r="8" fill="${SKIN2}"/><circle cx="142" cy="168" r="8" fill="${SKIN2}"/>`;

  art.bunica = () =>
    shadow(56) +
    `<g class="legs"><rect x="82" y="258" width="16" height="36" rx="6" fill="#E9C7A6"/><rect x="102" y="258" width="16" height="36" rx="6" fill="#E9C7A6"/>` +
    `<ellipse cx="88" cy="296" rx="16" ry="8" fill="#4C1D95"/><ellipse cx="112" cy="296" rx="16" ry="8" fill="#4C1D95"/></g>` +
    `<path d="M62 206 l-10 58 q48 12 96 0 l-10 -58z" fill="#6D28D9"/>` +
    `<path d="M62 138 q38 -18 76 0 l8 76 q-46 10 -92 0z" fill="#C084FC"/>` +
    `<path d="M100 134 v76" stroke="#A855F7" stroke-width="3"/><g fill="#FDE68A"><circle cx="100" cy="158" r="4"/><circle cx="100" cy="178" r="4"/><circle cx="100" cy="198" r="4"/></g>` +
    `<g class="arm-l"><path d="M66 146 q-18 30 -2 60" stroke="#C084FC" stroke-width="18" stroke-linecap="round" fill="none"/><circle cx="66" cy="208" r="9" fill="${SKIN2}"/></g>` +
    `<g class="arm-r"><path d="M134 146 q18 30 2 60" stroke="#C084FC" stroke-width="18" stroke-linecap="round" fill="none"/><circle cx="134" cy="208" r="9" fill="${SKIN2}"/></g>` +
    `<rect x="91" y="120" width="18" height="18" rx="6" fill="${SKIN2}"/>` +
    `<circle cx="100" cy="44" r="20" fill="#C9CED6"/>` +
    `<circle cx="100" cy="88" r="44" fill="${SKIN}"/>` +
    `<path d="M56 92 Q52 46 100 46 Q148 46 144 92 Q140 66 118 62 Q100 70 82 62 Q60 66 56 92Z" fill="#D7DBE2"/>` +
    eyes(84, 116, 94, 4.5) +
    `<g fill="none" stroke="#7C6F9C" stroke-width="3.5"><circle cx="84" cy="94" r="12"/><circle cx="116" cy="94" r="12"/><path d="M96 93 h8"/></g>` +
    cheeks(70, 130, 110, 8) +
    `<path class="mouth" d="M86 112 q14 13 28 0" stroke="#7A2E2E" stroke-width="4" fill="none" stroke-linecap="round"/>`;

  /* cățelul (viewBox 0 0 240 220) — coada are clasa .dog-tail */
  art.dog = () =>
    `<ellipse cx="120" cy="210" rx="74" ry="9" fill="#000" opacity=".12"/>` +
    `<g class="dog-tail"><path d="M166 176 q40 -6 46 -50" stroke="#C47F3B" stroke-width="16" stroke-linecap="round" fill="none"/></g>` +
    `<ellipse cx="120" cy="160" rx="56" ry="50" fill="#C47F3B"/>` +
    `<ellipse cx="120" cy="170" rx="30" ry="36" fill="#FFF4E0"/>` +
    `<rect x="90" y="168" width="22" height="42" rx="10" fill="#C47F3B"/><rect x="128" y="168" width="22" height="42" rx="10" fill="#C47F3B"/>` +
    `<ellipse cx="101" cy="208" rx="14" ry="7" fill="#FFF4E0"/><ellipse cx="139" cy="208" rx="14" ry="7" fill="#FFF4E0"/>` +
    `<rect x="86" y="124" width="68" height="12" rx="6" fill="#E53E3E"/><circle cx="120" cy="140" r="7" fill="#FCD34D" stroke="#CA8A04" stroke-width="2"/>` +
    `<ellipse cx="120" cy="86" rx="52" ry="46" fill="#D99A55"/>` +
    `<ellipse cx="140" cy="78" rx="16" ry="14" fill="#A86A30" opacity=".6"/>` +
    `<path class="ear-l" d="M76 56 q-30 8 -22 60 q16 6 28 -12z" fill="#7A4A22"/>` +
    `<path class="ear-r" d="M164 56 q30 8 22 60 q-16 6 -28 -12z" fill="#7A4A22"/>` +
    `<ellipse cx="120" cy="106" rx="27" ry="19" fill="#FFF4E0"/>` +
    `<g class="eyes"><circle cx="100" cy="80" r="7" fill="${INK}"/><circle cx="140" cy="80" r="7" fill="${INK}"/><circle cx="102" cy="77" r="2.5" fill="#fff"/><circle cx="142" cy="77" r="2.5" fill="#fff"/></g>` +
    `<ellipse cx="120" cy="96" rx="11" ry="8" fill="${INK}"/>` +
    `<path class="dog-tongue" d="M113 114 q7 18 14 0z" fill="#F472B6"/>` +
    `<path d="M120 104 v8 M108 112 q12 8 24 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;

  /* pisica (viewBox 0 0 200 200) — coada .cat-tail, ochii .cat-eyes */
  art.cat = () =>
    `<ellipse cx="100" cy="194" rx="60" ry="7" fill="#000" opacity=".12"/>` +
    `<g class="cat-tail"><path d="M138 182 q52 -4 42 -60 q-4 -16 -16 -10" stroke="#F59E0B" stroke-width="15" fill="none" stroke-linecap="round"/></g>` +
    `<path d="M58 192 q-6 -74 42 -82 q48 8 42 82z" fill="#F59E0B"/>` +
    `<ellipse cx="100" cy="160" rx="22" ry="26" fill="#FDE68A"/>` +
    `<ellipse cx="84" cy="190" rx="14" ry="8" fill="#FDE68A"/><ellipse cx="116" cy="190" rx="14" ry="8" fill="#FDE68A"/>` +
    `<path d="M64 62 l4 -40 l30 22z M136 62 l-4 -40 l-30 22z" fill="#F59E0B"/><path d="M70 54 l2 -22 l16 12z M130 54 l-2 -22 l-16 12z" fill="#F9A8D4"/>` +
    `<circle cx="100" cy="82" r="40" fill="#F59E0B"/>` +
    `<path d="M92 46 l3 14 M100 44 v15 M108 46 l-3 14 M62 84 h10 M128 84 h10" stroke="#D97706" stroke-width="4" stroke-linecap="round"/>` +
    `<g class="cat-eyes"><ellipse cx="85" cy="80" rx="8" ry="9" fill="#86EFAC"/><ellipse cx="115" cy="80" rx="8" ry="9" fill="#86EFAC"/><ellipse cx="85" cy="80" rx="3" ry="7" fill="${INK}"/><ellipse cx="115" cy="80" rx="3" ry="7" fill="${INK}"/></g>` +
    `<path class="cat-closed" d="M77 82 q8 6 16 0 M107 82 q8 6 16 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0"/>` +
    `<path d="M95 94 h10 l-5 6z" fill="#F472B6"/><path d="M100 100 q-6 7 -12 2 M100 100 q6 7 12 2" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<path d="M74 96 h-24 M74 102 l-22 6 M126 96 h24 M126 102 l22 6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;

  /* ---------- fețe de animăluțe pentru Joaca Elenei (viewBox 0 0 100 100) ---------- */
  const fface = (y, dx, smile) =>
    `<circle cx="${50 - dx}" cy="${y}" r="5.5" fill="${INK}"/><circle cx="${50 + dx}" cy="${y}" r="5.5" fill="${INK}"/>` +
    `<circle cx="${52 - dx}" cy="${y - 2}" r="2" fill="#fff"/><circle cx="${52 + dx}" cy="${y - 2}" r="2" fill="#fff"/>` +
    `<circle cx="${50 - dx - 8}" cy="${y + 12}" r="6" fill="#F87171" opacity=".4"/><circle cx="${50 + dx + 8}" cy="${y + 12}" r="6" fill="#F87171" opacity=".4"/>` +
    (smile === false ? '' : `<path d="M42 ${y + 16} q8 8 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  art.animals = {
    bunny: () =>
      `<ellipse cx="34" cy="22" rx="10" ry="24" fill="#fff" stroke="#E2DCEF" stroke-width="2"/><ellipse cx="66" cy="22" rx="10" ry="24" fill="#fff" stroke="#E2DCEF" stroke-width="2"/>` +
      `<ellipse cx="34" cy="24" rx="5" ry="16" fill="#F9A8D4"/><ellipse cx="66" cy="24" rx="5" ry="16" fill="#F9A8D4"/>` +
      `<circle cx="50" cy="60" r="34" fill="#fff" stroke="#E2DCEF" stroke-width="2"/>` + fface(56, 13) + `<path d="M46 64 h8 l-4 4z" fill="#F472B6"/>`,
    cat: () =>
      `<path d="M20 40 l4 -30 l24 18z M80 40 l-4 -30 l-24 18z" fill="#FB923C"/><circle cx="50" cy="58" r="34" fill="#FB923C"/>` +
      fface(54, 13) + `<path d="M46 63 h8 l-4 4z" fill="#F472B6"/><path d="M28 66 h-16 M72 66 h16" stroke="#fff" stroke-width="2"/>`,
    dog: () =>
      `<circle cx="50" cy="56" r="34" fill="#E0A96D"/><path d="M20 30 q-14 6 -8 40 q12 4 18 -10z M80 30 q14 6 8 40 q-12 4 -18 -10z" fill="#8B5A2B"/>` +
      `<ellipse cx="50" cy="70" rx="16" ry="12" fill="#FFF4E0"/>` + fface(52, 13, false) + `<ellipse cx="50" cy="64" rx="6" ry="4.5" fill="${INK}"/><path d="M44 74 q6 5 12 0" stroke="${INK}" stroke-width="3" fill="none"/>`,
    bear: () =>
      `<circle cx="24" cy="28" r="13" fill="#A16207"/><circle cx="76" cy="28" r="13" fill="#A16207"/><circle cx="24" cy="28" r="6" fill="#FDE68A"/><circle cx="76" cy="28" r="6" fill="#FDE68A"/>` +
      `<circle cx="50" cy="56" r="35" fill="#A16207"/><ellipse cx="50" cy="68" rx="15" ry="12" fill="#FDE68A"/>` + fface(50, 13, false) + `<ellipse cx="50" cy="63" rx="6" ry="4.5" fill="${INK}"/>`,
    chick: () =>
      `<path d="M46 20 q4 -14 10 -2 q4 -10 8 0" stroke="#FACC15" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="50" cy="56" r="36" fill="#FDE047"/>` +
      fface(50, 13, false) + `<path d="M40 62 h20 l-10 10z" fill="#FB923C"/>`,
    frog: () =>
      `<circle cx="30" cy="30" r="15" fill="#4ADE80"/><circle cx="70" cy="30" r="15" fill="#4ADE80"/><ellipse cx="50" cy="62" rx="40" ry="30" fill="#4ADE80"/>` +
      `<circle cx="30" cy="30" r="8" fill="#fff"/><circle cx="70" cy="30" r="8" fill="#fff"/><circle cx="31" cy="31" r="4.5" fill="${INK}"/><circle cx="71" cy="31" r="4.5" fill="${INK}"/>` +
      `<path d="M30 66 q20 16 40 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="26" cy="60" r="6" fill="#F87171" opacity=".4"/><circle cx="74" cy="60" r="6" fill="#F87171" opacity=".4"/>`,
    pig: () =>
      `<path d="M20 34 l6 -24 l18 16z M80 34 l-6 -24 l-18 16z" fill="#F9A8D4"/><circle cx="50" cy="56" r="35" fill="#FBCFE8"/>` +
      fface(48, 14, false) + `<ellipse cx="50" cy="66" rx="14" ry="10" fill="#F9A8D4"/><circle cx="45" cy="66" r="3" fill="#BE185D"/><circle cx="55" cy="66" r="3" fill="#BE185D"/>`,
    lion: () => {
      let m = '';
      for (let i = 0; i < 12; i++) m += `<circle cx="${50 + 36 * Math.cos((i * Math.PI) / 6)}" cy="${55 + 36 * Math.sin((i * Math.PI) / 6)}" r="14" fill="#F97316"/>`;
      return m + `<circle cx="50" cy="55" r="32" fill="#FCD34D"/>` + fface(50, 12, false) + `<path d="M45 61 h10 l-5 5z" fill="#92400E"/><path d="M42 70 q8 6 16 0" stroke="${INK}" stroke-width="3" fill="none"/>`;
    },
    panda: () =>
      `<circle cx="24" cy="26" r="13" fill="${INK}"/><circle cx="76" cy="26" r="13" fill="${INK}"/><circle cx="50" cy="56" r="35" fill="#fff" stroke="#E5E7EB" stroke-width="2"/>` +
      `<ellipse cx="36" cy="52" rx="10" ry="12" fill="${INK}" transform="rotate(20 36 52)"/><ellipse cx="64" cy="52" rx="10" ry="12" fill="${INK}" transform="rotate(-20 64 52)"/>` +
      `<circle cx="37" cy="51" r="4" fill="#fff"/><circle cx="63" cy="51" r="4" fill="#fff"/><ellipse cx="50" cy="66" rx="6" ry="4" fill="${INK}"/><path d="M44 74 q6 5 12 0" stroke="${INK}" stroke-width="3" fill="none"/>`,
    mouse: () =>
      `<circle cx="22" cy="30" r="18" fill="#CBD5E1"/><circle cx="78" cy="30" r="18" fill="#CBD5E1"/><circle cx="22" cy="30" r="10" fill="#FBCFE8"/><circle cx="78" cy="30" r="10" fill="#FBCFE8"/>` +
      `<circle cx="50" cy="60" r="32" fill="#CBD5E1"/>` + fface(56, 12, false) + `<circle cx="50" cy="68" r="5" fill="#F472B6"/><path d="M30 70 h-16 M70 70 h16" stroke="#64748B" stroke-width="2"/>`,
  };

  /* ---------- clădirile orașului (viewBox 0 0 260 240, pământul la y=232) ---------- */
  const W = (x, y, w, h, rx) => `<rect class="win" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx == null ? 5 : rx}"/>`;
  art.buildings = {
    studio: () =>
      `<rect x="40" y="108" width="180" height="124" rx="10" fill="#5CC8C4"/><rect x="30" y="100" width="200" height="16" rx="6" fill="#2F9E9A"/>` +
      `<rect x="70" y="36" width="120" height="70" rx="14" fill="#374151"/><rect x="88" y="26" width="38" height="16" rx="4" fill="#4B5563"/>` +
      `<circle cx="130" cy="71" r="27" fill="#1F2937"/><circle class="lens" cx="130" cy="71" r="19" fill="#60A5FA"/><circle cx="123" cy="64" r="6" fill="#fff" opacity=".7"/>` +
      `<rect class="flash" x="160" y="46" width="18" height="11" rx="3" fill="#FDE68A"/>` +
      `<rect x="94" y="122" width="72" height="22" rx="6" fill="#fff"/><text x="130" y="139" font-size="16" font-weight="900" text-anchor="middle" fill="#0F766E">FOTO</text>` +
      W(56, 154, 38, 32) + W(166, 154, 38, 32) + `<rect x="110" y="168" width="40" height="64" rx="8" fill="#F59E0B"/><circle cx="142" cy="202" r="3" fill="#92400E"/>`,
    fabrica: () =>
      `<rect x="56" y="34" width="24" height="90" fill="#B45309"/><rect x="56" y="48" width="24" height="8" fill="#FDE68A"/>` +
      `<rect x="188" y="52" width="22" height="72" fill="#B45309"/><rect x="188" y="64" width="22" height="8" fill="#FDE68A"/>` +
      `<g class="smoke" font-weight="900" fill="#94A3B8" font-size="22"><text x="62" y="26">1</text><text x="76" y="8">0</text><text x="194" y="42">7</text><text x="208" y="22">3</text></g>` +
      `<path d="M28 232 V122 l42 -26 v26 l42 -26 v26 l42 -26 v26 l42 -26 v26 h24 V232Z" fill="#F59E0B"/>` +
      `<rect x="28" y="122" width="212" height="10" fill="#D97706"/>` +
      art.gear(130, 176, 26, '#B45309', 9) + W(46, 146, 36, 30) + W(186, 146, 36, 30) +
      `<rect x="46" y="194" width="36" height="38" rx="5" fill="#92400E"/><rect x="186" y="194" width="36" height="38" rx="5" fill="#92400E"/>`,
    dulap: () =>
      `<path d="M38 66 h184 l-12 -22 h-160z" fill="#7C3AED"/><rect x="50" y="64" width="160" height="168" rx="10" fill="#A78BFA"/>` +
      `<rect x="62" y="76" width="66" height="116" rx="8" fill="#C4B5FD"/><rect x="132" y="76" width="66" height="116" rx="8" fill="#C4B5FD"/>` +
      W(74, 90, 42, 36) + W(144, 90, 42, 36) + `<circle cx="120" cy="150" r="5" fill="#6D28D9"/><circle cx="140" cy="150" r="5" fill="#6D28D9"/>` +
      `<rect x="62" y="200" width="136" height="24" rx="6" fill="#8B5CF6"/><rect x="116" y="208" width="28" height="8" rx="4" fill="#DDD6FE"/>` +
      `<rect x="2" y="178" width="66" height="10" rx="4" fill="#B45309"/><rect x="8" y="188" width="8" height="44" fill="#92400E"/><rect x="54" y="188" width="8" height="44" fill="#92400E"/>` +
      `<rect x="14" y="164" width="22" height="16" rx="2" fill="#fff" stroke="#CBD5E1" stroke-width="2"/><circle cx="48" cy="171" r="7" fill="#F87171"/>`,
    centrala: () =>
      `<path d="M10 120 L60 120 M10 120 l-4 0" stroke="#64748B" stroke-width="3"/>` +
      `<rect x="26" y="118" width="120" height="114" rx="10" fill="#34D399"/><path d="M20 122 h132 l-14 -20 h-104z" fill="#059669"/>` +
      W(40, 140, 30, 28) + W(100, 140, 30, 28) + `<rect x="70" y="184" width="32" height="48" rx="6" fill="#065F46"/>` +
      `<rect x="150" y="40" width="74" height="192" rx="16" fill="#374151"/><rect x="171" y="26" width="32" height="18" rx="5" fill="#9CA3AF"/>` +
      `<g class="batt">` + [0, 1, 2, 3].map((i) => `<rect class="batt-seg" x="160" y="${190 - i * 42}" width="54" height="34" rx="6" fill="#4ADE80"/>`).join('') + `</g>` +
      `<path d="M196 70 L170 126 h18 l-8 42 l30 -60 h-18z" fill="#FDE047" stroke="#CA8A04" stroke-width="3" stroke-linejoin="round"/>`,
    posta: () =>
      `<path d="M28 106 L130 46 L232 106Z" fill="#B91C1C"/><rect x="40" y="102" width="180" height="130" rx="8" fill="#EF4444"/>` +
      `<rect x="40" y="140" width="180" height="12" fill="#FBBF24"/>` +
      art.envelope(102, 64, 56) +
      W(56, 162, 38, 32) + W(166, 162, 38, 32) + W(56, 110, 38, 24) + W(166, 110, 38, 24) +
      `<rect x="110" y="168" width="40" height="64" rx="8" fill="#7F1D1D"/>` +
      `<rect x="226" y="198" width="8" height="34" fill="#64748B"/><rect x="214" y="168" width="34" height="34" rx="10" fill="#FBBF24" stroke="#CA8A04" stroke-width="3"/><rect x="222" y="180" width="18" height="5" rx="2" fill="#92400E"/>`,
    aeroport: () =>
      `<rect x="10" y="166" width="156" height="66" rx="10" fill="#93C5FD"/><rect x="10" y="160" width="156" height="12" rx="5" fill="#3B82F6"/>` +
      W(22, 182, 22, 22, 4) + W(52, 182, 22, 22, 4) + W(82, 182, 22, 22, 4) + W(112, 182, 22, 22, 4) + W(142, 182, 16, 22, 4) +
      `<rect x="174" y="84" width="34" height="148" fill="#60A5FA"/><path d="M152 86 h78 l-8 -32 h-62z" fill="#1D4ED8"/>` +
      W(164, 60, 22, 18, 3) + W(196, 60, 22, 18, 3) +
      `<line x1="191" y1="54" x2="191" y2="14" stroke="#374151" stroke-width="5"/><circle cx="191" cy="12" r="6" fill="#EF4444"/>` +
      `<g class="waves" fill="none" stroke="#F43F5E" stroke-width="4" stroke-linecap="round"><path d="M176 4 q-8 8 0 16"/><path d="M206 4 q8 8 0 16"/><path d="M166 -2 q-14 14 0 28"/><path d="M216 -2 q14 14 0 28"/></g>` +
      art.plane(80, 126, 0.7),
    primaria: () =>
      `<rect x="108" y="30" width="44" height="62" fill="#FDE68A" stroke="#D97706" stroke-width="3"/><path d="M102 32 L130 6 L158 32Z" fill="#B45309"/>` +
      `<circle cx="130" cy="60" r="15" fill="#fff" stroke="#D97706" stroke-width="3"/><path d="M130 60 v-9 M130 60 h7" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
      `<line x1="130" y1="6" x2="130" y2="-22" stroke="#64748B" stroke-width="3"/><rect x="131" y="-22" width="10" height="16" fill="#2563EB"/><rect x="141" y="-22" width="10" height="16" fill="#FACC15"/><rect x="151" y="-22" width="10" height="16" fill="#DC2626"/>` +
      `<rect x="30" y="128" width="200" height="104" fill="#FEF3C7"/><path d="M20 132 L130 86 L240 132Z" fill="#FCD34D" stroke="#D97706" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M130 98 l14 5 v10 q0 10 -14 16 q-14 -6 -14 -16 v-10z" fill="#3B82F6"/><rect x="124" y="108" width="12" height="9" rx="2" fill="#FDE68A"/><path d="M126 108 v-3 a4 4 0 0 1 8 0 v3" stroke="#FDE68A" stroke-width="2" fill="none"/>` +
      [44, 84, 164, 204].map((x) => `<rect x="${x}" y="138" width="14" height="86" rx="3" fill="#fff"/>`).join('') +
      W(62, 150, 18, 40) + W(182, 150, 18, 40) +
      `<path d="M108 232 v-60 a22 22 0 0 1 44 0 v60z" fill="#92400E"/><rect x="20" y="224" width="220" height="10" rx="3" fill="#E5E7EB"/>`,
    concert: () =>
      `<path d="M28 118 Q130 8 232 118Z" fill="#6D28D9"/><rect x="30" y="112" width="200" height="120" rx="10" fill="#8B5CF6"/>` +
      `<rect x="40" y="124" width="180" height="36" rx="5" fill="#fff"/>` +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${40 + i * 20}" y="124" width="20" height="36" fill="none" stroke="#CBD5E1" stroke-width="1.5"/>`).join('') +
      [1, 2, 4, 5, 6, 8].map((i) => `<rect x="${40 + i * 20 - 6}" y="124" width="12" height="22" rx="2" fill="${INK}"/>`).join('') +
      `<path class="win" d="M50 226 v-34 a14 14 0 0 1 28 0 v34z"/><path class="win" d="M182 226 v-34 a14 14 0 0 1 28 0 v34z"/>` +
      `<path d="M106 232 v-46 a24 24 0 0 1 48 0 v46z" fill="#4C1D95"/>` +
      `<g class="notes"><g transform="translate(58 26) scale(.4)">${art.note('#FDE047')}</g><g transform="translate(170 18) scale(.45)">${art.note('#F9A8D4')}</g><g transform="translate(118 2) scale(.35)">${art.note('#86EFAC')}</g></g>`,
    bunica: () =>
      `<rect x="160" y="64" width="20" height="44" fill="#7F1D1D"/><g class="smoke" fill="#E5E7EB"><circle cx="172" cy="52" r="8"/><circle cx="182" cy="36" r="10"/><circle cx="176" cy="16" r="7"/></g>` +
      `<rect x="60" y="120" width="140" height="112" rx="6" fill="#FECDD3"/><path d="M42 126 L130 52 L218 126Z" fill="#E11D48"/>` +
      `<g transform="translate(108 64) scale(.44)"><path class="win" d="${art.heartPath}"/></g>` +
      W(76, 146, 34, 32) + W(150, 146, 34, 32) + `<rect x="114" y="170" width="32" height="62" rx="6" fill="#16A34A"/><circle cx="138" cy="202" r="3" fill="#FDE68A"/>` +
      [70, 88, 172, 190].map((x, i) => `<line x1="${x}" y1="232" x2="${x}" y2="214" stroke="#16A34A" stroke-width="3"/><circle cx="${x}" cy="212" r="7" fill="${['#F472B6', '#FACC15', '#A78BFA', '#F87171'][i]}"/>`).join(''),
  };

  /* ---------- iconițe pentru insigne (viewBox 0 0 100 100) ---------- */
  art.icons = {
    studio: () =>
      `<rect x="12" y="30" width="76" height="52" rx="12" fill="#374151"/><rect x="24" y="22" width="22" height="12" rx="3" fill="#4B5563"/>` +
      `<circle cx="52" cy="56" r="20" fill="#1F2937"/><circle cx="52" cy="56" r="13" fill="#60A5FA"/><circle cx="47" cy="51" r="4" fill="#fff" opacity=".7"/><rect x="68" y="36" width="12" height="7" rx="2" fill="#FDE68A"/>`,
    fabrica: () => art.gear(50, 50, 26, '#B45309', 9).replace('class="gear-spin"', '') + `<text x="50" y="58" font-size="22" font-weight="900" text-anchor="middle" fill="#B45309">7</text>`,
    dulap: () =>
      `<rect x="20" y="14" width="60" height="76" rx="6" fill="#A78BFA"/><rect x="25" y="20" width="23" height="56" rx="4" fill="#DDD6FE"/><rect x="52" y="20" width="23" height="56" rx="4" fill="#DDD6FE"/>` +
      `<circle cx="45" cy="50" r="3" fill="#6D28D9"/><circle cx="55" cy="50" r="3" fill="#6D28D9"/><rect x="25" y="80" width="50" height="6" rx="3" fill="#7C3AED"/>`,
    centrala: () => `<g transform="translate(0 2)">${art.battery(0.8)}</g>`,
    posta: () => art.envelope(12, 26, 76),
    aeroport: () =>
      `<g transform="translate(50 60) scale(.62)">${art.plane(0, 0, 1)}</g><g fill="none" stroke="#F43F5E" stroke-width="5" stroke-linecap="round"><path d="M38 24 q12 -12 24 0"/><path d="M30 16 q20 -18 40 0"/></g>`,
    primaria: () =>
      `<path d="M50 8 l34 12 v24 q0 26 -34 46 q-34 -20 -34 -46 v-24z" fill="#3B82F6"/><path d="M50 16 l26 9 v19 q0 20 -26 36z" fill="#60A5FA"/>` +
      `<g transform="translate(25 22) scale(.5)">${art.lock('#FDE68A')}</g>`,
    concert: () =>
      `<rect x="10" y="44" width="80" height="40" rx="6" fill="#fff" stroke="#6D28D9" stroke-width="4"/>` +
      [1, 2, 4, 5, 6].map((i) => `<rect x="${10 + i * 13.3 - 4}" y="44" width="8" height="24" fill="${INK}"/>`).join('') +
      `<g transform="translate(48 -2) scale(.46)">${art.note('#8B5CF6')}</g>`,
    bunica: () => `<g transform="translate(4 6) scale(.92)">${art.heart('#F43F5E')}</g>`,
  };
  /** insignă (viewBox 0 0 120 150) */
  art.badge = (key, color) =>
    `<path d="M34 92 L18 146 L40 134 L52 150 L60 100z" fill="#EF4444"/><path d="M86 92 L102 146 L80 134 L68 150 L60 100z" fill="#3B82F6"/>` +
    `<circle cx="60" cy="62" r="56" fill="#FBBF24"/><circle cx="60" cy="62" r="48" fill="#FDE68A"/>` +
    `<circle cx="60" cy="62" r="42" fill="${color || '#fff'}"/>` +
    `<g transform="translate(26 28) scale(.68)">${(art.icons[key] || art.icons.bunica)()}</g>` +
    `<path d="M24 40 q10 -18 28 -22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;

  /* ---------- POZA cățelului: mozaic 16×16 ---------- */
  art.photo = {
    rows: [
      '................',
      '................',
      '..dd........dd..',
      '.dddbbbbbbbbddd.',
      '.ddbbbbbbbbbbdd.',
      '.ddbkbbbbbbkbdd.',
      '.ddbbbbbbbbbbdd.',
      '..dbbbwwwwbbbd..',
      '...bbwwkkwwbb...',
      '...bbwwwwwwbb...',
      '....bwwppwwb....',
      '.....rrrrrr.....',
      '....bbbbbbbb....',
      'ggggbbwwwwbbgggg',
      'ggggbbwwwwbbgggg',
      'gggggggggggggggg',
    ],
    palette: { '.': '#9ED8F5', b: '#C47F3B', d: '#7A4A22', w: '#FFF4E0', k: '#2B2D42', p: '#F472B6', r: '#E53E3E', g: '#6CBF5E' },
    numbers: { '.': 1, b: 2, d: 3, w: 4, k: 5, p: 6, r: 7, g: 8 },
    names: { '.': 'albastru', b: 'maro', d: 'maro închis', w: 'crem', k: 'negru', p: 'roz', r: 'roșu', g: 'verde' },
  };
  /** desenează poza ca mozaic: {x,y,size,gap,numbers,cls} -> markup */
  art.photoSVG = function (o) {
    o = o || {};
    const n = 16;
    const size = o.size || 160;
    const c = size / n;
    const g = o.gap || 0;
    const x0 = o.x || 0;
    const y0 = o.y || 0;
    let m = `<g class="${o.cls || 'photo'}">`;
    const P = art.photo;
    for (let r = 0; r < n; r++)
      for (let k = 0; k < n; k++) {
        const ch = P.rows[r][k];
        m += `<rect x="${(x0 + k * c + g / 2).toFixed(2)}" y="${(y0 + r * c + g / 2).toFixed(2)}" width="${(c - g + 0.15).toFixed(2)}" height="${(c - g + 0.15).toFixed(2)}" fill="${P.palette[ch]}" data-r="${r}" data-c="${k}"/>`;
        if (o.numbers)
          m += `<text x="${(x0 + k * c + c / 2).toFixed(1)}" y="${(y0 + r * c + c * 0.72).toFixed(1)}" font-size="${(c * 0.62).toFixed(1)}" font-weight="800" text-anchor="middle" fill="${ch === 'k' || ch === 'd' ? '#fff' : INK}">${P.numbers[ch]}</text>`;
      }
    return m + '</g>';
  };

  /* ---------- elemente gata făcute ---------- */
  const VB = {
    andrei: '0 0 200 320',
    maria: '0 0 200 320',
    elena: '0 0 200 320',
    bunica: '0 0 200 320',
    bunny: '0 0 200 240',
    dog: '0 0 240 220',
    cat: '0 0 200 200',
    bow: '0 0 100 72',
    star: '0 0 100 100',
    heart: '0 0 100 100',
    balloon: '0 0 100 140',
    candy: '0 0 100 100',
    note: '0 0 100 100',
    sparkle: '0 0 100 100',
  };
  const HEAD = { andrei: '42 24 116 116', maria: '26 62 148 112', elena: '50 108 100 100', bunica: '46 20 108 120', bunny: '28 0 144 176' };
  art.make = function (name, attrs, ...args) {
    const fn = art[name];
    const vb = VB[name] || '0 0 100 100';
    const el = OT.svg(vb, fn ? fn(...args) : '', attrs);
    el.classList.add('art-' + name);
    return el;
  };
  art.head = function (name, attrs) {
    const el = OT.svg(HEAD[name] || VB[name], art[name](), attrs);
    el.classList.add('head-' + name);
    return el;
  };
  art.animal = function (kind, attrs) {
    const el = OT.svg('0 0 100 100', art.animals[kind](), attrs);
    el.classList.add('animal');
    return el;
  };
  art.buildingSVG = function (key, attrs) {
    const el = OT.svg('0 -30 260 270', art.buildings[key](), attrs);
    el.classList.add('bld', 'bld-' + key);
    return el;
  };
  art.badgeSVG = function (key, color, attrs) {
    return OT.svg('0 0 120 150', art.badge(key, color), attrs);
  };
})();
