/* Clădirea 4 — Centrala electrică (bateria) */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.art;
  const h = OT.h;

  document.head.appendChild(
    h('style', {
      text:
        '.b4-tg{display:flex;align-items:center;gap:8px;border:none;border-radius:999px;padding:6px 14px 6px 10px;font-weight:900;font-size:clamp(15px,1.7vw,21px);background:#fff;box-shadow:0 4px 0 rgba(0,0,0,.12);min-height:52px}' +
        '.b4-tg:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.12)}' +
        '.b4-tg .sw{width:46px;height:26px;border-radius:13px;background:#CBD5E1;position:relative;transition:background .3s;flex:none}' +
        '.b4-tg .sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .3s;box-shadow:0 1px 3px rgba(0,0,0,.3)}' +
        '.b4-tg.on .sw{background:#22C55E}.b4-tg.on .sw::after{left:23px}' +
        '.b4-tg.locked .sw{background:#F472B6}.b4-tg.locked{background:#FDF2F8}' +
        '.b4-tg:disabled{opacity:.65}' +
        '.b4-zzz{animation:b4zzz 2.4s ease-in-out infinite}' +
        '@keyframes b4zzz{0%{opacity:0;transform:translate(0,0)}30%{opacity:1}100%{opacity:0;transform:translate(26px,-40px)}}' +
        '.b4-plug{cursor:grab}' +
        '.b4-glow{animation:glow 1.6s ease-in-out infinite}' +
        // ca iepurașul Elenei să nu acopere butoanele pe ecrane mici
        '@media (max-width:700px) and (orientation:portrait){.stage.st-col.b45-safe{padding-bottom:64px}}' +
        '@media (orientation:landscape) and (max-height:540px){.stage.st-col.b45-safe.bl .st-controls{padding-left:84px}.stage.st-col.b45-safe.br .st-controls{padding-right:84px}' +
        '.b4-tg{min-height:40px;font-size:14px;padding:3px 10px 3px 6px;gap:6px}.b4-tg .sw{width:36px;height:20px}.b4-tg .sw::after{width:14px;height:14px}.b4-tg.on .sw::after{left:19px}' +
        '.b45-safe .st-controls{gap:6px}.b45-safe .st-controls .big-btn{min-height:42px;font-size:16px}}',
    })
  );

  /** baterie verticală: (x,y) colț, lățime w, înălțime hh, nivel 0..1 */
  function batt(x, y, w, hh, level) {
    const lv = OT.clamp(level, 0, 1);
    const col = lv > 0.5 ? '#4ADE80' : lv > 0.2 ? '#FACC15' : '#F87171';
    const capW = w * 0.4;
    const pad = w * 0.1;
    const innerH = hh - 12 - pad * 2;
    const fh = innerH * lv;
    return (
      `<rect x="${x + (w - capW) / 2}" y="${y}" width="${capW}" height="16" rx="4" fill="#64748B"/>` +
      `<rect x="${x}" y="${y + 12}" width="${w}" height="${hh - 12}" rx="${w * 0.16}" fill="#fff" stroke="#64748B" stroke-width="7"/>` +
      `<rect x="${x + pad}" y="${(y + 12 + pad + innerH - fh).toFixed(1)}" width="${w - 2 * pad}" height="${fh.toFixed(1)}" rx="${w * 0.08}" fill="${col}"/>` +
      `<text x="${x + w / 2}" y="${y + hh / 2 + 16}" font-size="${w * 0.27}" font-weight="900" text-anchor="middle" fill="#1F2937">${Math.round(lv * 100)}%</text>`
    );
  }
  /** baterie culcată (pentru provocare) */
  function hbatt(x, y, w, hh, level) {
    const lv = OT.clamp(level, 0, 1);
    const col = lv > 0.5 ? '#4ADE80' : lv > 0.2 ? '#FACC15' : '#F87171';
    const pad = 8;
    return (
      `<rect x="${x + w - 2}" y="${y + hh * 0.28}" width="16" height="${hh * 0.44}" rx="4" fill="#64748B"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="14" fill="#fff" stroke="#64748B" stroke-width="6"/>` +
      `<rect x="${x + pad}" y="${y + pad}" width="${((w - 2 * pad) * lv).toFixed(1)}" height="${hh - 2 * pad}" rx="8" fill="${col}"/>` +
      `<text x="${x + w / 2}" y="${y + hh / 2 + 11}" font-size="30" font-weight="900" text-anchor="middle" fill="#1F2937">${Math.round(lv * 100)}%</text>`
    );
  }
  function toggle(label, on, locked) {
    const b = h('button', { class: 'b4-tg' + (on ? ' on' : '') + (locked ? ' locked' : '') }, h('span', { class: 'sw' }), h('span', {}, label));
    return b;
  }

  OT.registerBuilding({
    id: 4,
    key: 'centrala',
    name: 'Centrala electrică',
    color: '#34D399',
    dark: '#064E3B',
    learned: 'Bateria e ca un rezervor de energie: ecranul aprins o golește, încărcătorul o umple.',
    bow: { top: '3%', right: '2%' },
    bunny: 'left',
    mission: {
      type: 'match',
      say: 'Maria, pune fiecare baterie la încărcătorul de aceeași culoare! Trage bateria sau atinge-o.',
      colors: ['#EF4444', '#3B82F6', '#FACC15'],
      item: (c) =>
        `<rect x="38" y="4" width="24" height="12" rx="4" fill="#475569"/><rect x="22" y="14" width="56" height="82" rx="12" fill="${c}" stroke="#334155" stroke-width="5"/>` +
        `<path d="M56 30 L38 58 h14 l-6 24 l20 -32 h-14z" fill="#fff" stroke="#334155" stroke-width="2.5" stroke-linejoin="round"/>` +
        `<rect x="30" y="22" width="8" height="40" rx="4" fill="#fff" opacity=".4"/>`,
      target: (c) =>
        `<rect x="6" y="56" width="88" height="40" rx="12" fill="${c}" opacity=".28"/><rect x="6" y="56" width="88" height="40" rx="12" fill="none" stroke="${c}" stroke-width="6"/>` +
        `<path d="M50 56 V32" stroke="${c}" stroke-width="7"/><rect x="36" y="12" width="28" height="22" rx="6" fill="${c}"/><path d="M43 12 V2 M57 12 V2" stroke="#475569" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M55 62 l-12 16 h9 l-5 13 l14 -18 h-9z" fill="${c}"/>`,
      answer: 'Toate bateriile s-au pus la încărcat!',
    },
    steps: [
      {
        text: 'Toate clădirile din oraș au nevoie de <b>energie</b>, ca să lucreze. Energia vine de aici, de la Centrala electrică.',
        adult: 'bateria (acumulatorul)',
        render(ctx) {
          const houses = [
            [440, 250, '#F87171', '#B91C1C'],
            [580, 210, '#60A5FA', '#1D4ED8'],
            [715, 255, '#A78BFA', '#6D28D9'],
          ];
          let m = '<rect width="800" height="450" fill="#E0F2FE"/><rect y="360" width="800" height="90" fill="#BBF7D0"/>' + A.cloud(330, 30, 0.6) + A.cloud(620, 50, 0.5);
          // firele cu energie
          houses.forEach(([x, y]) => {
            m += `<path d="M217 152 Q ${(217 + x) / 2} ${Math.min(y, 152) - 110} ${x} ${y - 48}" stroke="#475569" stroke-width="10" fill="none" stroke-linecap="round"/>`;
            m += `<path class="dash-move" d="M217 152 Q ${(217 + x) / 2} ${Math.min(y, 152) - 110} ${x} ${y - 48}" stroke="#FDE047" stroke-width="5" fill="none" stroke-linecap="round"/>`;
          });
          m += `<g transform="translate(30 130)">${A.buildings.centrala()}</g>`;
          houses.forEach(([x, y, c, d], i) => {
            const hh = 360 - y;
            m += `<g transform="translate(${x} ${y})"><rect x="-48" y="0" width="96" height="${hh}" rx="6" fill="${c}"/><path d="M-60 6 L0 -48 L60 6Z" fill="${d}"/>` +
              `<rect class="b4-w" data-h="${i}" x="-34" y="20" width="26" height="24" rx="4" fill="#334155"/><rect class="b4-w" data-h="${i}" x="8" y="20" width="26" height="24" rx="4" fill="#334155"/>` +
              `<rect x="-12" y="${hh - 46}" width="24" height="46" rx="5" fill="#78350F"/></g>`;
          });
          const svg = ctx.scene('0 0 800 450', m);
          let k = 0;
          ctx.interval(() => {
            if (k >= houses.length) return;
            svg.querySelectorAll(`.b4-w[data-h="${k}"]`).forEach((w) => w.setAttribute('fill', '#FDE68A'));
            ctx.sfx('zap');
            k++;
            if (k === houses.length) ctx.setText('Toate clădirile din oraș au nevoie de <b>energie</b>, ca să lucreze. Energia vine de aici, de la Centrala electrică. Vezi cum se aprind luminile?', 'bateria (acumulatorul)');
          }, 1300);
        },
      },
      {
        text: 'Bateria e ca un <b>pahar cu suc</b>. Tot ce face telefonul bea câte puțin: ecranul, sunetul, camera.',
        adult: 'consum de energie',
        render(ctx) {
          const juice = (lv) => {
            const top = 375 - lv * 240;
            const t = (top - 125) / 250;
            const lx = 105 + 20 * t;
            const rx = 255 - 20 * t;
            return `M${lx.toFixed(1)} ${top.toFixed(1)} L${rx.toFixed(1)} ${top.toFixed(1)} L235 375 L125 375Z`;
          };
          const icons = [
            [430, 110, '📱'],
            [430, 228, '🔊'],
            [430, 346, '📷'],
          ];
          let m = '<rect width="800" height="450" fill="#FFF7ED"/><rect y="395" width="800" height="55" fill="#FED7AA"/>';
          icons.forEach(([x, y]) => {
            m += `<path class="b4-straw" d="M200 70 Q 290 ${y - 40} ${x - 46} ${y}" stroke="#F472B6" stroke-width="9" fill="none" stroke-linecap="round"/>`;
          });
          m += '<path class="b4-juice" d="" fill="#FB923C"/>';
          m += '<path d="M105 125 L125 375 H235 L255 125" fill="#fff" fill-opacity=".25" stroke="#94A3B8" stroke-width="7" stroke-linejoin="round"/><path d="M118 150 l12 190" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>';
          icons.forEach(([x, y, e]) => {
            m += `<circle cx="${x}" cy="${y}" r="44" fill="#fff" stroke="#FDBA74" stroke-width="5"/><text x="${x}" y="${y + 16}" font-size="44" text-anchor="middle">${e}</text>`;
          });
          m += '<text x="550" y="250" font-size="70" font-weight="900" text-anchor="middle" fill="#9A3412">=</text>';
          m += '<g class="b4-bat"></g>';
          const svg = ctx.scene('0 0 800 450', m);
          const jp = svg.querySelector('.b4-juice');
          const bat = svg.querySelector('.b4-bat');
          const straws = svg.querySelectorAll('.b4-straw');
          let t0 = performance.now();
          let lastShown = -1;
          ctx.raf((t) => {
            const el = ((t - t0) / 1000) % 10; // 7 s se bea, 1 s pauză, 2 s se umple
            let lv;
            const drinking = el < 7;
            if (drinking) lv = 1 - (el / 7) * 0.85;
            else if (el < 8) lv = 0.15;
            else lv = 0.15 + ((el - 8) / 2) * 0.85;
            jp.setAttribute('d', juice(lv));
            const shown = Math.round(lv * 100);
            if (shown !== lastShown) {
              lastShown = shown;
              bat.innerHTML = batt(620, 100, 120, 280, lv);
            }
            straws.forEach((s) => s.setAttribute('class', drinking ? 'b4-straw dash-move' : 'b4-straw'));
          });
        },
      },
      {
        text: 'Hai să vedem cine bea cel mai mult! Aprinde ecranul și uită-te la baterie. Apoi stinge-l.',
        adult: 'consumul ecranului',
        wait: true,
        hint: 'Aprinde ecranul, apoi stinge-l, și uită-te la baterie!',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b45-safe', 'bl');
          const PW = 190;
          const PH = 350;
          const sw = PW * 0.86;
          const sh = PH * 0.86;
          const screen =
            `<rect width="${sw}" height="${sh}" rx="19" fill="#BAE6FD"/>` +
            `<text x="${sw / 2}" y="44" font-size="30" font-weight="900" text-anchor="middle" fill="#0F172A">12:00</text>` +
            A.photoSVG({ size: 130, x: (sw - 130) / 2, y: 80 }) +
            `<rect class="b4-off" width="${sw}" height="${sh}" rx="19" fill="#0F172A"/>`;
          const m =
            '<rect width="800" height="450" fill="#ECFDF5"/>' +
            '<path class="b4-beam" d="M255 110 L20 30 L20 260 Z" fill="#FEF08A" opacity="0"/>' +
            A.phone(240, 50, PW, PH, screen) +
            '<circle class="b4-led" cx="247" cy="110" r="7" fill="#94A3B8"/>' +
            '<g class="b4-bat"></g>' +
            '<text class="b4-rate" x="620" y="425" font-size="26" font-weight="900" text-anchor="middle" fill="#065F46"></text>';
          const svg = ctx.scene('0 0 800 450', m);
          const off = svg.querySelector('.b4-off');
          const beam = svg.querySelector('.b4-beam');
          const led = svg.querySelector('.b4-led');
          const bat = svg.querySelector('.b4-bat');
          const rateEl = svg.querySelector('.b4-rate');
          const tScreen = toggle('💡 Ecranul', false);
          const tLamp = toggle('🔦 Lanterna', false);
          const refill = h('button', { class: 'big-btn', style: { display: 'none' } }, '🔌 Umple bateria');
          ctx.stage.appendChild(h('div', { class: 'st-controls' }, tScreen, tLamp, refill));
          let level = 1;
          let scr = false;
          let lamp = false;
          let onT = 0;
          let offT = 0;
          let wasOn = false;
          let finished = false;
          let last = performance.now();
          let shown = -1;
          let lowSaid = false;
          tScreen.addEventListener('click', () => {
            scr = !scr;
            tScreen.classList.toggle('on', scr);
            off.style.transition = 'opacity .8s';
            off.style.opacity = scr ? '0' : '1';
            ctx.sfx(scr ? 'powerOn' : 'powerOff');
          });
          tLamp.addEventListener('click', () => {
            lamp = !lamp;
            tLamp.classList.toggle('on', lamp);
            beam.style.transition = 'opacity .6s';
            beam.style.opacity = lamp ? '.7' : '0';
            led.setAttribute('fill', lamp ? '#FDE047' : '#94A3B8');
            ctx.sfx('click');
          });
          refill.addEventListener('click', () => {
            level = 1;
            lowSaid = false;
            refill.style.display = 'none';
            ctx.sfx('powerOn');
          });
          ctx.raf((t) => {
            const dt = Math.min(0.1, (t - last) / 1000);
            last = t;
            const rate = (scr ? 0.045 : 0) + (lamp ? 0.03 : 0) + 0.0015;
            level = Math.max(0.05, level - rate * dt);
            if (scr) {
              onT += dt;
              if (onT > 1.5) wasOn = true;
              offT = 0;
            } else if (!lamp && wasOn) offT += dt;
            const s = Math.round(level * 100);
            if (s !== shown) {
              shown = s;
              bat.innerHTML = batt(560, 70, 120, 300, level);
            }
            rateEl.textContent = rate > 0.04 ? '🥤 bea repede!' : rate > 0.02 ? '🥤 bea destul de repede' : '😴 bea foarte puțin';
            if (level <= 0.06 && !lowSaid) {
              lowSaid = true;
              refill.style.display = '';
              ctx.toast('🪫 Aproape goală! Stinge ecranul și lanterna.');
            }
            if (!finished && wasOn && offT > 1.6) {
              finished = true;
              ctx.sfx('success');
              ctx.setText('Ai văzut? Cu ecranul aprins, bateria se golește <b>repede</b>. Stins, aproape deloc! Și lanterna bea mult.', 'consumul ecranului');
              ctx.done();
            }
          });
        },
      },
      {
        text: 'Ups! Bateria s-a golit și telefonul a adormit. Trage încărcătorul până la telefon (sau apasă pe el)!',
        adult: 'încărcătorul',
        wait: true,
        hint: 'Trage ștecherul alb până jos, la telefon!',
        render(ctx) {
          const PX = 190;
          const PY = 40;
          const PW = 170;
          const PH = 310;
          const sw = PW * 0.86;
          const sh = PH * 0.86;
          const port = { x: PX + PW / 2, y: PY + PH };
          const screen = `<rect width="${sw}" height="${sh}" rx="17" fill="#DCFCE7"/><g class="b4-sbat"></g>` +
            `<path class="b4-sbolt" d="M${sw / 2 + 10} 18 L${sw / 2 - 12} 52 h14 l-6 26 l22 -36 h-14z" fill="#FACC15" stroke="#CA8A04" stroke-width="2" opacity="0"/>` +
            `<rect class="b4-off" width="${sw}" height="${sh}" rx="17" fill="#0F172A" opacity=".88"/>`;
          const m =
            '<rect width="800" height="450" fill="#F0FDF4"/><rect y="390" width="800" height="60" fill="#D9F99D"/>' +
            A.phone(PX, PY, PW, PH, screen) +
            `<rect x="${port.x - 14}" y="${port.y - 6}" width="28" height="8" rx="3" fill="#0F172A"/>` +
            '<g class="b4-zz" font-size="34" font-weight="900" fill="#6366F1"><text class="b4-zzz" x="370" y="80">z</text><text class="b4-zzz" x="390" y="60" style="animation-delay:.8s">Z</text><text class="b4-zzz" x="410" y="40" style="animation-delay:1.6s">Z</text></g>' +
            '<rect x="660" y="140" width="100" height="120" rx="20" fill="#fff" stroke="#94A3B8" stroke-width="6"/><circle cx="695" cy="200" r="9" fill="#475569"/><circle cx="725" cy="200" r="9" fill="#475569"/>' +
            '<path class="b4-cable" d="" stroke="#F1F5F9" stroke-width="12" fill="none" stroke-linecap="round"/><path class="b4-cable2" d="" stroke="#CBD5E1" stroke-width="4" fill="none" stroke-linecap="round"/>' +
            '<g class="b4-plug"><circle r="62" fill="#fff" opacity="0"/><rect x="-11" y="-38" width="6" height="18" rx="2" fill="#94A3B8"/><rect x="5" y="-38" width="6" height="18" rx="2" fill="#94A3B8"/>' +
            '<rect x="-24" y="-22" width="48" height="52" rx="12" fill="#fff" stroke="#64748B" stroke-width="5"/><path d="M4 -10 L-8 6 h8 l-4 14 l12 -18 h-8z" fill="#FACC15"/></g>';
          const svg = ctx.scene('0 0 800 450', m);
          svg.style.touchAction = 'none';
          const plug = svg.querySelector('.b4-plug');
          const cable = svg.querySelector('.b4-cable');
          const cable2 = svg.querySelector('.b4-cable2');
          const sbat = svg.querySelector('.b4-sbat');
          const off = svg.querySelector('.b4-off');
          const zz = svg.querySelector('.b4-zz');
          const sbolt = svg.querySelector('.b4-sbolt');
          plug.classList.add('b4-glow');
          const home = { x: 560, y: 330 };
          const tip = { x: port.x, y: port.y + 38 };
          let p = { x: home.x, y: home.y };
          let connected = false;
          function place() {
            plug.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
            const d = `M710 260 C 710 430, ${p.x} ${p.y + 160}, ${p.x} ${p.y + 30}`;
            cable.setAttribute('d', d);
            cable2.setAttribute('d', d);
          }
          sbat.innerHTML = batt(sw / 2 - 40, 60, 80, 170, 0);
          place();
          function animateTo(to, ms) {
            const from = { x: p.x, y: p.y };
            return ctx.tween(ms, (k) => {
              p.x = OT.lerp(from.x, to.x, k);
              p.y = OT.lerp(from.y, to.y, k);
              place();
            });
          }
          async function connect() {
            connected = true;
            plug.classList.remove('b4-glow');
            await animateTo(tip, 600);
            ctx.sfx('powerOn');
            zz.style.transition = 'opacity .8s';
            zz.style.opacity = '0';
            off.style.transition = 'opacity 1.2s';
            off.style.opacity = '0';
            sbolt.setAttribute('opacity', '1');
            sbolt.classList.add('hl-pulse');
            await ctx.tween(4500, (k) => {
              sbat.innerHTML = batt(sw / 2 - 40, 60, 80, 170, k);
            }, (x) => x);
            ctx.sfx('success');
            ctx.praise('Plin! 🔋');
            ctx.setText('Gata! Încărcătorul a umplut bateria la loc — ca atunci când umpli iar paharul cu suc.', 'încărcătorul');
            ctx.done();
          }
          let drag = false;
          let moved = false;
          let off0 = { x: 0, y: 0 };
          let start = { x: 0, y: 0 };
          ctx.on(plug, 'pointerdown', (e) => {
            if (connected) return;
            drag = true;
            moved = false;
            const q = OT.svgPoint(svg, e);
            off0 = { x: q.x - p.x, y: q.y - p.y };
            start = { x: q.x, y: q.y };
            try {
              plug.setPointerCapture(e.pointerId);
            } catch (er) {}
            ctx.sfx('tap');
          });
          ctx.on(plug, 'pointermove', (e) => {
            if (!drag) return;
            const q = OT.svgPoint(svg, e);
            if (Math.abs(q.x - start.x) + Math.abs(q.y - start.y) > 6) moved = true;
            p.x = OT.clamp(q.x - off0.x, 30, 770);
            p.y = OT.clamp(q.y - off0.y, 40, 420);
            place();
          });
          const end = () => {
            if (!drag) return;
            drag = false;
            if (connected) return;
            if (!moved || Math.hypot(p.x - tip.x, p.y - tip.y) < 90) connect();
            else animateTo(home, 500);
          };
          ctx.on(plug, 'pointerup', end);
          ctx.on(plug, 'pointercancel', end);
        },
      },
      {
        text: 'Provocare: azi bateria are puțină energie. Stinge ce nu trebuie, ca telefonul să țină <b>până seara</b>! Apoi apasă „Pornește ziua”.',
        adult: 'economisirea bateriei',
        wait: true,
        hint: 'Stinge lucrurile care nu trebuie, apoi apasă „Pornește ziua”!',
        render(ctx) {
          ctx.stage.classList.add('st-col', 'b45-safe', 'bl');
          const things = [
            { k: 'lamp', label: '🔦 Lanterna', rate: 4.2, on: true },
            { k: 'game', label: '🎮 Jocul', rate: 4.6, on: true },
            { k: 'bright', label: '☀️ Lumină tare', rate: 3.9, on: true },
            { k: 'music', label: '🔊 Muzica', rate: 2.4, on: true },
          ];
          const NEED = 4.5; // poza pentru bunica — rămâne pornită
          const START = 0.7;
          const DAY = 8;
          const m =
            '<rect class="b4-sky" width="800" height="360" fill="#BAE6FD"/>' +
            '<g class="b4-stars" opacity="0">' +
            [[120, 60], [260, 120], [470, 50], [560, 140], [700, 200], [80, 180], [380, 160]].map(([x, y]) => `<path d="${A.starPath(x, y, 9, 4)}" fill="#FEF9C3"/>`).join('') +
            '</g>' +
            '<g class="b4-moon" opacity="0"><circle cx="640" cy="100" r="34" fill="#FEF9C3"/><circle cx="656" cy="88" r="30" class="b4-moon-cut" fill="#1E3A8A"/></g>' +
            '<g class="b4-sun"><circle r="34" fill="#FDE047" stroke="#FACC15" stroke-width="8"/></g>' +
            '<rect y="290" width="800" height="70" fill="#86EFAC"/>' +
            '<text x="70" y="335" font-size="22" font-weight="900" fill="#166534">🌅 dimineața</text><text x="640" y="335" font-size="22" font-weight="900" fill="#166534">seara 🌙</text>' +
            '<g class="b4-hb"></g>' +
            A.phone(345, 105, 110, 200, '<rect width="94.6" height="172" rx="11" fill="#E0F2FE"/><text class="b4-icons" x="47" y="40" font-size="22" text-anchor="middle"></text><text class="b4-icons2" x="47" y="72" font-size="22" text-anchor="middle"></text><text x="47" y="150" font-size="30" text-anchor="middle">💌</text><rect class="b4-sleep" width="94.6" height="172" rx="11" fill="#0F172A" opacity="0"/>') +
            '<text class="b4-z" x="470" y="130" font-size="36" font-weight="900" fill="#6366F1" opacity="0">Zzz</text>';
          const svg = ctx.scene('0 0 800 360', m);
          const sky = svg.querySelector('.b4-sky');
          const sun = svg.querySelector('.b4-sun');
          const hb = svg.querySelector('.b4-hb');
          const icons = svg.querySelector('.b4-icons');
          const icons2 = svg.querySelector('.b4-icons2');
          const sleep = svg.querySelector('.b4-sleep');
          const zText = svg.querySelector('.b4-z');
          const stars = svg.querySelector('.b4-stars');
          const moon = svg.querySelector('.b4-moon');
          const moonCut = svg.querySelector('.b4-moon-cut');
          const row = h('div', { class: 'st-controls' });
          const btns = things.map((th) => {
            const b = toggle(th.label, th.on);
            b.addEventListener('click', () => {
              if (running) return;
              th.on = !th.on;
              b.classList.toggle('on', th.on);
              ctx.sfx('click');
              drawIcons();
            });
            row.appendChild(b);
            return b;
          });
          const need = toggle('💌 Poza (trebuie!)', true, true);
          need.addEventListener('click', () => {
            ctx.sfx('hmm');
            ctx.toast('💌 Pe asta nu o stingem: e poza pentru bunica!');
          });
          row.appendChild(need);
          const go = h('button', { class: 'big-btn primary' }, '▶ Pornește ziua');
          row.appendChild(go);
          ctx.stage.appendChild(row);
          let running = false;
          let level = START;
          const SKY_DAY = [186, 230, 253];
          const SKY_EVE = [253, 186, 116];
          const SKY_NIGHT = [30, 58, 138];
          const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
          function drawIcons() {
            const on = things.filter((t) => t.on).map((t) => t.label.split(' ')[0]);
            icons.textContent = on.slice(0, 2).join(' ');
            icons2.textContent = on.slice(2).join(' ');
          }
          function sunAt(k) {
            const x = 70 + k * 660;
            const y = 260 - Math.sin(Math.PI * k) * 190;
            sun.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
          }
          function reset() {
            level = START;
            hb.innerHTML = hbatt(270, 22, 260, 56, level);
            sunAt(0);
            sun.setAttribute('opacity', '1');
            sky.setAttribute('fill', mix(SKY_DAY, SKY_DAY, 0));
            sleep.setAttribute('opacity', '0');
            zText.setAttribute('opacity', '0');
            stars.setAttribute('opacity', '0');
            moon.setAttribute('opacity', '0');
          }
          reset();
          drawIcons();
          go.addEventListener('click', () => {
            if (running) return;
            reset();
            running = true;
            go.disabled = true;
            btns.forEach((b) => (b.disabled = true));
            const rate = (NEED + things.filter((t) => t.on).reduce((s, t) => s + t.rate, 0)) / 100; // pe secundă
            const t0 = performance.now();
            let last = t0;
            ctx.sfx('sun');
            ctx.raf((t) => {
              const dt = Math.min(0.1, (t - last) / 1000);
              last = t;
              const k = Math.min(1, (t - t0) / 1000 / DAY);
              level -= rate * dt;
              sunAt(k);
              sky.setAttribute('fill', mix(SKY_DAY, SKY_EVE, Math.max(0, (k - 0.55) / 0.45)));
              hb.innerHTML = hbatt(270, 22, 260, 56, Math.max(0, level));
              if (level <= 0) {
                running = false;
                sleep.setAttribute('opacity', '.92');
                zText.setAttribute('opacity', '1');
                ctx.sfx('powerOff');
                ctx.setText('Telefonul a adormit înainte de seară. 😴 Mai stinge ceva și încearcă din nou!', 'economisirea bateriei');
                go.textContent = '↻ Încearcă din nou';
                go.disabled = false;
                btns.forEach((b) => (b.disabled = false));
                return false;
              }
              if (k >= 1) {
                running = false;
                ctx.tween(1600, (q) => {
                  sky.setAttribute('fill', mix(SKY_EVE, SKY_NIGHT, q));
                  moonCut.setAttribute('fill', mix(SKY_EVE, SKY_NIGHT, q));
                  stars.setAttribute('opacity', q.toFixed(2));
                  moon.setAttribute('opacity', q.toFixed(2));
                  sun.setAttribute('opacity', (1 - q).toFixed(2));
                }).then(() => {
                  go.textContent = '↻ Încă o zi';
                  go.disabled = false;
                  btns.forEach((b) => (b.disabled = false));
                });
                ctx.praise('Bravo, Andrei! 🌙');
                ctx.setText('Bravo! Ai stins ce nu trebuia, iar bateria a ținut <b>până seara</b>. Poza pentru bunica e în siguranță!', 'economisirea bateriei');
                ctx.done();
                return false;
              }
            });
          });
        },
      },
    ],
  });
})();
