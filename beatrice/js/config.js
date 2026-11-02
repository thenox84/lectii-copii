/* Ediția Beatrice — setările jocului (se încarcă înaintea motorului comun) */
window.OT_CONFIG = {
  hero: 'Beatrice',
  guide: 'beatrice',
  jar: false,
  storageKey: 'orasul-din-telefon-beatrice-v1',
  dbName: 'orasul-din-telefon-beatrice',
  sub: 'Ajută desenul Beatricei să ajungă la bunica!',
  subDone: 'Desenul a ajuns la bunica! 💌',
  room8: 'guitar',
  parentsNote: '🎨 Atelierul de desen păstrează desenele doar pe acest dispozitiv; butonul „Salvează imaginea” le descarcă.',
  // pe hartă: șevaletul cu desenul Beatricei (în locul borcanului)
  mapExtra(x, y) {
    const A = window.OT.art;
    return `<g class="easel-g tap-react" data-kind="easel" transform="translate(${x} ${y})"><g class="jar-in"><ellipse cx="0" cy="4" rx="60" ry="12" fill="#000" opacity=".12"/>` +
      `<g transform="translate(-62 -150) scale(.62)">${A.easel()}</g></g></g>`;
  },
  // Beatrice și chitara ei
  mapKids() {
    const A = window.OT.art;
    return `<g transform="translate(-60 -112) scale(.35)"><g class="kid">${A.beatrice()}</g></g>` +
      `<g class="guitar-g tap-react" data-kind="guitar" transform="translate(12 -104) rotate(12) scale(.32)">${A.guitar()}</g>`;
  },
  mapButton() {
    const OT = window.OT;
    const b = OT.h('button', { class: 'elena-btn atelier-btn', 'aria-label': 'Atelierul de desen' });
    b.appendChild(OT.svg('0 0 100 100', '<path d="M50 8 C20 8 6 30 8 52 C10 80 34 92 52 90 C62 89 62 80 56 74 C50 68 54 60 64 60 L78 60 C90 60 94 50 92 40 C88 20 70 8 50 8Z" fill="#FDE68A" stroke="#B45309" stroke-width="4"/><circle cx="30" cy="34" r="7" fill="#EF4444"/><circle cx="50" cy="24" r="7" fill="#3B82F6"/><circle cx="72" cy="32" r="7" fill="#22C55E"/><circle cx="28" cy="58" r="7" fill="#A855F7"/>'));
    b.appendChild(OT.h('span', {}, 'Atelierul de desen'));
    b.addEventListener('click', () => {
      OT.sfx('pop');
      OT.go('atelier');
    });
    return b;
  },
  mapTap(kind, g, c) {
    const OT = window.OT;
    if (kind === 'easel') {
      OT.sfx('pop');
      OT.go('atelier');
      return true;
    }
    if (kind === 'guitar') {
      [52, 57, 62, 67, 71, 76].forEach((m, i) => OT.audio.guitar ? OT.audio.guitar(m, { at: i * 0.04 }) : OT.audio.piano(m, { at: i * 0.04, vel: 0.5 }));
      OT.fx.burst('notes', c.x, c.y, 6, { size: 30, spread: 100 });
      return true;
    }
    return false;
  },
};
