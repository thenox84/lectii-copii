/* Ediția Beatrice — Atelierul de desen 🎨
   Desen liber cu degetul sau mouse-ul: culori, pensule, gumă, „înapoi”, salvare ca imagine.
   Butonul „🔲 Ochii camerei” arată desenul așa cum îl vede telefonul: din pătrățele (pixeli). */
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;
  const KEY = OT.cfg.storageKey + '-atelier';
  const COLORS = ['#2B2D42', '#EF4444', '#F97316', '#FACC15', '#22C55E', '#14B8A6', '#3B82F6', '#A855F7', '#EC4899', '#8B5A2B', '#94A3B8', '#FFFFFF'];
  const SIZES = [6, 14, 28];

  document.head.appendChild(
    h('style', {
      text:
        '.atelier{position:absolute;inset:0;display:flex;flex-direction:column;background:linear-gradient(#fdf2f8,#ede9fe)}' +
        '.at-top{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 10px 6px;flex-wrap:wrap}' +
        '.at-top h1{margin:0;font-size:clamp(20px,3vw,32px);flex:1;white-space:nowrap}' +
        '.at-main{flex:1;min-height:0;display:flex;gap:10px;padding:0 10px calc(10px + env(safe-area-inset-bottom))}' +
        '.at-paper{position:relative;flex:1;min-width:0;min-height:0;background:#fff;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,.12);overflow:hidden;touch-action:none}' +
        '.at-paper canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}' +
        '.at-paper canvas.pix{pointer-events:none;image-rendering:pixelated}' +
        '.at-side{display:flex;flex-direction:column;gap:8px;align-items:center;overflow:auto;flex:none;width:150px}' +
        '.at-colors{display:grid;grid-template-columns:repeat(2,46px);gap:8px}' +
        '.at-c{width:46px;height:46px;border-radius:50%;border:4px solid #fff;box-shadow:0 0 0 2px #CBD5E1;padding:0}' +
        '.at-c.on{box-shadow:0 0 0 4px #2B2D42;transform:scale(1.1)}' +
        '.at-sizes{display:flex;gap:6px}.at-s{width:34px;height:34px;border-radius:50%;border:3px solid #CBD5E1;background:#fff;display:flex;align-items:center;justify-content:center;padding:0}' +
        '.at-s i{display:block;border-radius:50%;background:#2B2D42}.at-s.on{border-color:#2B2D42}' +
        '.at-side .big-btn{min-height:46px;font-size:15px;padding:6px 10px;width:100%;white-space:normal;line-height:1.1}' +
        '.at-side .big-btn.on{background:#14B8A6;color:#fff}' +
        '.at-note{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);background:rgba(43,45,66,.85);color:#fff;padding:8px 14px;border-radius:14px;font-weight:800;font-size:15px;pointer-events:none;text-align:center;max-width:90%}' +
        '@media (max-width:640px) and (orientation:portrait){.at-main{flex-direction:column}.at-side{width:auto;flex-direction:row;flex-wrap:wrap;justify-content:center;overflow:visible}.at-colors{grid-template-columns:repeat(6,34px);gap:6px}.at-c{width:34px;height:34px}.at-side .big-btn{width:auto;min-height:42px}}' +
        '@media (orientation:landscape) and (max-height:540px){.at-colors{grid-template-columns:repeat(3,30px);gap:5px}.at-c{width:30px;height:30px}.at-side{width:132px}.at-side .big-btn{min-height:38px;font-size:13px}.at-top{padding-top:4px;padding-bottom:4px}}',
    })
  );

  OT.screens.atelier = function (app, params, scope) {
    const root = h('div', { class: 'atelier' });
    const mapBtn = h('button', { class: 'icon-btn', 'aria-label': 'Harta' }, '🗺️');
    mapBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('map');
    });
    const top = h('div', { class: 'at-top' }, mapBtn, h('h1', {}, '🎨 Atelierul Beatricei'));
    const paper = h('div', { class: 'at-paper' });
    const cv = h('canvas');
    const pix = h('canvas', { class: 'pix', style: { display: 'none' } });
    const note = h('div', { class: 'at-note', style: { display: 'none' } });
    paper.append(cv, pix, note);
    const side = h('div', { class: 'at-side' });
    const colorsEl = h('div', { class: 'at-colors' });
    const sizesEl = h('div', { class: 'at-sizes' });
    const undoBtn = h('button', { class: 'big-btn' }, '↩️ Înapoi');
    const pixBtn = h('button', { class: 'big-btn' }, '🔲 Ochii camerei');
    const clearBtn = h('button', { class: 'big-btn' }, '🧹 Foaie nouă');
    const saveBtn = h('button', { class: 'big-btn primary' }, '💾 Salvează imaginea');
    side.append(colorsEl, sizesEl, undoBtn, pixBtn, clearBtn, saveBtn);
    root.append(top, h('div', { class: 'at-main' }, paper, side));
    app.appendChild(root);

    let color = COLORS[1];
    let size = SIZES[1];
    COLORS.forEach((c) => {
      const b = h('button', { class: 'at-c' + (c === color ? ' on' : ''), style: { background: c }, 'aria-label': 'culoare' });
      b.addEventListener('click', () => {
        color = c;
        OT.sfx('tap');
        colorsEl.querySelectorAll('.at-c').forEach((x) => x.classList.toggle('on', x === b));
      });
      colorsEl.appendChild(b);
    });
    SIZES.forEach((s) => {
      const b = h('button', { class: 'at-s' + (s === size ? ' on' : ''), 'aria-label': 'pensulă' }, h('i', { style: { width: Math.max(4, s * 0.7) + 'px', height: Math.max(4, s * 0.7) + 'px' } }));
      b.addEventListener('click', () => {
        size = s;
        OT.sfx('tap');
        sizesEl.querySelectorAll('.at-s').forEach((x) => x.classList.toggle('on', x === b));
      });
      sizesEl.appendChild(b);
    });

    // desenul se păstrează pe o „foaie” de mărime fixă, ca să nu se strice la rotirea ecranului
    const W = 1200;
    const H = 900;
    cv.width = W;
    cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, W, H);
    const undo = [];
    function snapshot() {
      try {
        undo.push(g.getImageData(0, 0, W, H));
        if (undo.length > 15) undo.shift();
      } catch (e) {}
    }
    function persist() {
      try {
        localStorage.setItem(KEY, cv.toDataURL('image/png'));
      } catch (e) {}
    }
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const img = new Image();
        img.onload = () => g.drawImage(img, 0, 0, W, H);
        img.src = saved;
      }
    } catch (e) {}
    // foaia păstrează proporția 4:3 în spațiul disponibil
    function fit() {
      const r = paper.getBoundingClientRect();
      let w = r.width;
      let hh = (w * H) / W;
      if (hh > r.height) {
        hh = r.height;
        w = (hh * W) / H;
      }
      [cv, pix].forEach((c) => {
        c.style.width = w + 'px';
        c.style.height = hh + 'px';
        c.style.left = (r.width - w) / 2 + 'px';
        c.style.top = (r.height - hh) / 2 + 'px';
      });
    }
    scope.on(window, 'resize', fit);
    scope.timeout(fit, 20);
    function pos(e) {
      const r = cv.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    }
    const strokes = {};
    scope.on(cv, 'pointerdown', (e) => {
      e.preventDefault();
      if (pixOn) togglePix();
      try {
        cv.setPointerCapture(e.pointerId);
      } catch (err) {}
      snapshot();
      const p = pos(e);
      strokes[e.pointerId] = p;
      g.fillStyle = color;
      g.beginPath();
      g.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
      g.fill();
    });
    scope.on(cv, 'pointermove', (e) => {
      const last = strokes[e.pointerId];
      if (!last) return;
      const p = pos(e);
      g.strokeStyle = color;
      g.lineWidth = size;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.beginPath();
      g.moveTo(last.x, last.y);
      g.lineTo(p.x, p.y);
      g.stroke();
      strokes[e.pointerId] = p;
    });
    const end = (e) => {
      if (strokes[e.pointerId]) {
        delete strokes[e.pointerId];
        persist();
      }
    };
    scope.on(cv, 'pointerup', end);
    scope.on(cv, 'pointercancel', end);

    undoBtn.addEventListener('click', () => {
      const d = undo.pop();
      if (!d) return OT.sfx('hmm');
      g.putImageData(d, 0, 0);
      OT.sfx('tap');
      persist();
    });
    clearBtn.addEventListener('click', () => {
      snapshot();
      g.fillStyle = '#fff';
      g.fillRect(0, 0, W, H);
      OT.sfx('whoosh');
      persist();
    });
    // „ochii camerei”: desenul văzut din pătrățele (pixeli mari)
    let pixOn = false;
    function togglePix() {
      pixOn = !pixOn;
      pixBtn.classList.toggle('on', pixOn);
      pix.style.display = pixOn ? '' : 'none';
      note.style.display = pixOn ? '' : 'none';
      if (pixOn) {
        const cols = 40;
        const rows = 30;
        const small = h('canvas');
        small.width = cols;
        small.height = rows;
        const sg = small.getContext('2d');
        sg.drawImage(cv, 0, 0, cols, rows);
        pix.width = W;
        pix.height = H;
        const pg = pix.getContext('2d');
        pg.imageSmoothingEnabled = false;
        pg.drawImage(small, 0, 0, W, H);
        pg.strokeStyle = 'rgba(148,163,184,.5)';
        pg.lineWidth = 1;
        for (let i = 1; i < cols; i++) {
          pg.beginPath();
          pg.moveTo((i * W) / cols, 0);
          pg.lineTo((i * W) / cols, H);
          pg.stroke();
        }
        for (let i = 1; i < rows; i++) {
          pg.beginPath();
          pg.moveTo(0, (i * H) / rows);
          pg.lineTo(W, (i * H) / rows);
          pg.stroke();
        }
        note.textContent = 'Așa „vede” camera desenul tău: 40 × 30 de pătrățele. Un telefon adevărat folosește milioane!';
        OT.sfx('pop');
      }
    }
    pixBtn.addEventListener('click', togglePix);
    saveBtn.addEventListener('click', () => {
      try {
        const a = h('a', { href: cv.toDataURL('image/png'), download: 'desenul-Beatricei.png' });
        document.body.appendChild(a);
        a.click();
        a.remove();
        OT.sfx('success');
        OT.toast('💾 Desenul a fost salvat ca imagine (în „Descărcări”).');
      } catch (e) {
        OT.toast('Nu am putut salva imaginea pe acest dispozitiv.');
      }
    });
  };
})();
