/* Orașul din Telefon — motorul lecțiilor (o clădire = câțiva pași + insignă)

   FORMATUL UNEI CLĂDIRI (vezi js/buildings/*.js):
   OT.registerBuilding({
     id: 1, key: 'studio', name: 'Studioul foto',
     color: '#5CC8C4', dark: '#0F766E',
     learned: 'O poză e făcută din pătrățele colorate.',   // scris pe insignă
     bow:   { top: '4%', right: '3%' },     // unde stă fundița roz (misiunea Mariei)
     bunny: 'left' | 'right',               // colțul de jos unde se ascunde iepurașul Elenei
     mission: { ... },                      // vezi js/mission.js
     steps: [{
       text: 'Text scurt. Poate avea <b>bold</b>.',
       adult: 'senzor foto',                // apare mic: „Adulții îi spun: senzor foto”
       wait: true,                          // „Mai departe” merge abia după ctx.done()
       hint: 'Apasă pe aparat!',            // spus dacă apasă „Mai departe” prea devreme
       render(ctx) { ... }                  // desenează în ctx.stage
     }]
   });

   ctx (în render):
     ctx.stage            elementul scenei (gol la început)
     ctx.scene(vb, svg)   creează un <svg> care umple scena; îl întoarce
     ctx.done()           deblochează „Mai departe”
     ctx.setText(t, adult)schimbă textul din bulă
     ctx.praise(t)        laudă scurtă + sunet + confetti
     ctx.speak(t), ctx.sfx(n), ctx.fx, ctx.toast(t)
     ctx.timeout/interval/raf/tween/wait/on   (curățate automat la schimbarea pasului)
     ctx.mem              obiect păstrat între pașii aceleiași vizite
     ctx.next()           trece la pasul următor
     ctx.revisit          true dacă clădirea a fost deja terminată
*/
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;

  function jarMini() {
    const n = OT.starCount();
    const b = h('button', { class: 'jar-mini', 'aria-label': 'Borcanul cu steluțe al Mariei' });
    b.appendChild(OT.svg('0 0 120 140', OT.art.jar(n)));
    b.appendChild(h('span', { class: 'jar-n' }, String(n)));
    b.addEventListener('click', () => {
      OT.sfx('star');
      const k = OT.starCount();
      OT.speak(k === 1 ? 'Maria are o steluță în borcan!' : k === 0 ? 'Borcanul Mariei așteaptă steluțe! Caută fundița roz.' : `Maria are ${k} steluțe în borcan!`);
    });
    return b;
  }

  OT.screens.lesson = function (app, params, scope) {
    const b = OT.buildings[params.id];
    if (!b) return OT.go('map');
    const isStory = !!b.story;
    const revisit = OT.isDone(b.id);
    const steps = b.steps.slice();
    if (!isStory && !b.noBadge) steps.push(badgeStep(b));
    const mem = {};
    let idx = OT.clamp(params.step || 0, 0, steps.length - 1);
    let stepScope = null;
    let stepDone = false;

    /* --- schelet --- */
    const root = h('div', { class: 'lesson' + (isStory ? ' story' : '') });
    root.style.setProperty('--bcolor', b.color || '#7CC6F2');
    root.style.setProperty('--bdark', b.dark || '#1E3A5F');

    const homeBtn = h('button', { class: 'icon-btn home-btn', 'aria-label': 'Înapoi la hartă', title: 'Harta orașului' }, '🗺️');
    const title = h('div', { class: 'l-title' });
    if (b.key && OT.art.icons[b.key]) title.appendChild(OT.svg('0 0 100 100', OT.art.icons[b.key](), { class: 'l-icon' }));
    title.appendChild(h('span', {}, b.name));
    const dots = h('div', { class: 'dots' });
    steps.forEach(() => dots.appendChild(h('i')));
    const jar = OT.cfg.jar === false ? null : jarMini();
    const top = h('header', { class: 'topbar' }, homeBtn, title, dots, jar);

    const stageWrap = h('div', { class: 'stage-wrap' });
    const stage = h('div', { class: 'stage' });
    stageWrap.appendChild(stage);

    // fundița Mariei
    let bowBtn = null;
    if (b.mission) {
      bowBtn = h('button', { class: 'bow-spot', 'aria-label': 'Misiunea Mariei' });
      Object.assign(bowBtn.style, b.bow || { top: '3%', right: '2%' });
      const paintBow = () => {
        bowBtn.innerHTML = '';
        bowBtn.appendChild(OT.svg('0 0 100 72', OT.art.bow()));
        if (OT.state.stars[b.id]) bowBtn.appendChild(h('span', { class: 'bow-star' }, '⭐'));
      };
      paintBow();
      bowBtn.addEventListener('click', () => {
        OT.sfx('pop');
        OT.mission.open(b, () => {
          paintBow();
          if (!jar) return;
          jar.querySelector('.jar-n').textContent = OT.starCount();
          jar.querySelector('svg').innerHTML = OT.art.jar(OT.starCount());
        }, jar);
      });
      stageWrap.appendChild(bowBtn);
    }

    // iepurașul Elenei
    if (b.bunny) {
      const side = b.bunny === 'right' ? 'right' : 'left';
      const bun = h('button', { class: 'bunny-spot ' + side, 'aria-label': 'Iepurașul Elenei' });
      stageWrap.classList.add('bunny-' + side);
      const bunnySvg = OT.art.make('bunny', { class: 'bs-bunny' });
      const bush = OT.svg(
        '0 0 200 100',
        '<circle cx="40" cy="70" r="40" fill="#4ADE80"/><circle cx="100" cy="56" r="50" fill="#22C55E"/><circle cx="162" cy="70" r="40" fill="#4ADE80"/><rect x="0" y="70" width="200" height="30" fill="#22C55E"/>' +
          '<circle cx="80" cy="40" r="8" fill="#fff" opacity=".3"/><circle cx="60" cy="74" r="6" fill="#F472B6"/><circle cx="140" cy="64" r="6" fill="#FDE047"/><circle cx="120" cy="86" r="6" fill="#F472B6"/>',
        { class: 'bs-bush' }
      );
      bun.appendChild(bunnySvg);
      bun.appendChild(bush);
      let fxi = OT.randInt(0, 2);
      bun.addEventListener('click', () => {
        if (bun.classList.contains('jump')) return;
        bun.classList.add('jump');
        OT.sfx('boing');
        setTimeout(() => OT.sfx('giggle'), 250);
        const types = ['hearts', 'balloons', 'bubbles'];
        const t = types[fxi++ % 3];
        const c = OT.center(bunnySvg);
        OT.fx.burst(t, c.x, c.y - 30, t === 'hearts' ? 14 : 9);
        if (!OT.state.bunny[b.id]) {
          OT.state.bunny[b.id] = true;
          OT.save();
        }
        setTimeout(() => bun.classList.remove('jump'), 1300);
      });
      stageWrap.appendChild(bun);
    }

    const avatar = h('div', { class: 'avatar' });
    avatar.appendChild(OT.art.head(b.guide || OT.cfg.guide));
    const textEl = h('div', { class: 'l-text' });
    const adultEl = h('div', { class: 'l-adult' });
    const bubble = h('div', { class: 'bubble' }, textEl, adultEl);
    const sayBtn = h('button', { class: 'icon-btn say-btn', 'aria-label': 'Citește cu voce' }, '🔊');
    const talk = h('div', { class: 'talk' }, avatar, bubble, sayBtn);

    const backBtn = h('button', { class: 'big-btn back-btn' }, h('span', { class: 'arr' }, '⬅'), h('span', { class: 'lbl' }, ' Înapoi'));
    const nextBtn = h('button', { class: 'big-btn next-btn' }, h('span', { class: 'lbl' }, 'Mai departe '), h('span', { class: 'arr' }, '➡'));
    const nav = h('nav', { class: 'l-nav' }, backBtn, nextBtn);

    root.append(top, stageWrap, talk, nav);
    app.appendChild(root);

    /* --- logică --- */
    function setText(t, adult) {
      textEl.innerHTML = t || '';
      adultEl.innerHTML = adult ? 'Adulții îi spun: <b>' + adult + '</b>' : '';
      textEl.classList.remove('pop');
      void textEl.offsetWidth;
      textEl.classList.add('pop');
    }
    function updateNav() {
      const s = steps[idx];
      const locked = s.wait && !stepDone && !revisit;
      nextBtn.classList.toggle('locked', !!locked);
      nextBtn.classList.toggle('ready', !locked && !!s.wait);
      const last = idx === steps.length - 1;
      nextBtn.querySelector('.lbl').textContent = last ? (isStory ? 'Hai la drum! ' : 'La hartă ') : 'Mai departe ';
      nextBtn.querySelector('.arr').textContent = last ? (isStory ? '🚀' : '🗺️') : '➡';
      Array.from(dots.children).forEach((d, i) => {
        d.className = i < idx ? 'past' : i === idx ? 'now' : '';
      });
    }
    function show(i) {
      if (stepScope) stepScope.dispose();
      OT.speakStop();
      idx = i;
      stepDone = false;
      stage.innerHTML = '';
      stage.className = 'stage';
      stepScope = OT.scope();
      const s = steps[idx];
      setText(s.text, s.adult);
      const ctx = Object.assign(Object.create(stepScope), {
        stage,
        b,
        mem,
        fx: OT.fx,
        revisit,
        done() {
          if (stepDone) return;
          stepDone = true;
          updateNav();
          if (s.wait) {
            nextBtn.classList.remove('nudge');
            void nextBtn.offsetWidth;
            nextBtn.classList.add('nudge');
          }
        },
        setText,
        speak: (t) => OT.speak(t),
        sfx: (n) => OT.sfx(n),
        toast: (t, o) => OT.toast(t, o),
        next: () => goNext(true),
        scene(vb, markup, attrs) {
          const svg = OT.svg(vb, markup, attrs);
          svg.classList.add('scene');
          stage.appendChild(svg);
          return svg;
        },
        praise(t) {
          OT.sfx('success');
          const msg = t || OT.pick(['Bravo, ' + OT.cfg.hero + '!', 'Super, ' + OT.cfg.hero + '!', 'Excelent!', 'Ai reușit!']);
          const p = h('div', { class: 'praise' }, msg);
          stageWrap.appendChild(p);
          const c = OT.center(stageWrap);
          OT.fx.burst('stars', c.x, c.y, 12);
          setTimeout(() => p.remove(), 2200);
        },
      });
      // pentru ca ctx.timeout etc. să funcționeze cu `this` corect
      ['timeout', 'clearTimeout', 'interval', 'clearInterval', 'raf', 'tween', 'on', 'wait', 'add'].forEach((k) => (ctx[k] = stepScope[k].bind(stepScope)));
      ctx.signal = stepScope.signal;
      const myScope = stepScope;
      Object.defineProperty(ctx, 'alive', { get: () => myScope.alive });
      Object.defineProperty(ctx, 'isDone', { get: () => stepDone });
      updateNav();
      try {
        if (s.render) s.render(ctx);
      } catch (e) {
        console.error('Eroare la pasul', idx, e);
        stepDone = true;
        updateNav();
      }
      if (!s.wait) stepDone = true;
      if (b.autoSpeak) stepScope.timeout(() => OT.speak(textEl.textContent), 450);
    }
    function goNext(force) {
      const s = steps[idx];
      if (!force && s.wait && !stepDone && !revisit) {
        OT.sfx('hmm');
        nextBtn.classList.remove('shake');
        void nextBtn.offsetWidth;
        nextBtn.classList.add('shake');
        const hint = s.hint || 'Mai întâi încearcă ce e pe ecran!';
        OT.toast('👆 ' + hint);
        return;
      }
      OT.sfx('tap');
      if (idx < steps.length - 1) show(idx + 1);
      else finish();
    }
    function finish() {
      if (isStory) {
        OT.state.introSeen = true;
        OT.save();
        OT.go('map');
      } else {
        OT.go('map', { justDone: revisit ? null : b.id });
      }
    }
    backBtn.addEventListener('click', () => {
      OT.sfx('tap');
      if (idx > 0) show(idx - 1);
      else OT.go('map');
    });
    nextBtn.addEventListener('click', () => goNext(false));
    homeBtn.addEventListener('click', () => {
      OT.sfx('tap');
      OT.go('map');
    });
    sayBtn.addEventListener('click', () => {
      OT.speak(textEl.textContent);
    });
    scope.on(document, 'keydown', (e) => {
      if (document.querySelector('.mission')) return;
      if (steps[idx].keys) return; // pasul folosește tastatura (ex. pianul)
      if (e.key === 'ArrowRight') goNext(false);
      else if (e.key === 'ArrowLeft') backBtn.click();
    });
    scope.add(() => {
      if (stepScope) stepScope.dispose();
      OT.mission.close();
    });
    show(idx);
  };

  /* --- pasul final: insigna --- */
  function badgeStep(b) {
    return {
      text: 'Bravo, ' + OT.cfg.hero + '! Ai câștigat insigna <b>' + b.name + '</b>!',
      render(ctx) {
        const first = !OT.state.done[b.id];
        OT.state.done[b.id] = true;
        OT.save();
        ctx.stage.classList.add('st-col');
        const wrap = h('div', { class: 'badge-show' });
        const medal = OT.art.badgeSVG(b.key, b.color, { class: 'badge-big' });
        wrap.appendChild(medal);
        wrap.appendChild(h('div', { class: 'badge-learned' }, '💡 ' + (b.learned || '')));
        ctx.stage.appendChild(wrap);
        ctx.sfx('fanfare');
        ctx.timeout(() => {
          OT.fx.confetti(90);
          const c = OT.center(medal);
          OT.fx.burst('stars', c.x, c.y, 14);
        }, 400);
        if (first && b.id < OT.TOTAL) {
          const nb = OT.buildings[b.id + 1];
          if (nb) ctx.setText('Bravo, ' + OT.cfg.hero + '! Ai câștigat insigna <b>' + b.name + '</b>! Se deschide o clădire nouă: <b>' + nb.name + '</b>.');
        }
      },
    };
  }
})();

/* ---------- unelte comune pentru lecții ---------- */
(function () {
  'use strict';
  const OT = window.OT;
  const h = OT.h;
  OT.kit = OT.kit || {};
  /** Întrebări cu variante (o întrebare pe rând).
      OT.kit.quiz(ctx, [{ q:'Întrebare?', pic:'🔋', options:[{t:'Text', ico:'✅', ok:true, why:'Explicație'}] }], () => ctx.done())
      Răspunsul greșit nu „pedepsește”: arată explicația și lasă copilul să mai încerce. */
  OT.kit.quiz = function (ctx, questions, onDone, opts) {
    opts = opts || {};
    const box = h('div', { class: 'quiz' });
    ctx.stage.appendChild(box);
    let qi = 0;
    function render() {
      box.innerHTML = '';
      const q = questions[qi];
      const prog = h('div', { class: 'quiz-progress' });
      questions.forEach((_, i) => prog.appendChild(h('i', { class: i < qi ? 'ok' : i === qi ? 'now' : '' })));
      const fb = h('div', { class: 'quiz-fb' });
      const row = h('div', { class: 'choice-row' });
      let solved = false;
      (opts.shuffle === false ? q.options : OT.shuffle(q.options)).forEach((o) => {
        const b = h('button', { class: 'choice' }, o.ico ? h('span', { class: 'ico' }, o.ico) : null, h('span', {}, o.t));
        b.addEventListener('click', () => {
          if (solved) return;
          if (o.ok) {
            solved = true;
            b.classList.add('right');
            OT.sfx('success');
            fb.style.color = '#15803d';
            fb.innerHTML = '✅ ' + (o.why || 'Corect!');
            ctx.timeout(() => {
              qi++;
              if (qi < questions.length) render();
              else {
                box.innerHTML = '';
                box.appendChild(h('div', { class: 'quiz-pic' }, opts.endPic || '🏆'));
                box.appendChild(h('div', { class: 'quiz-q' }, opts.endText || 'Bravo! Ai răspuns la toate întrebările!'));
                ctx.praise();
                if (onDone) onDone();
              }
            }, opts.delay || 2600);
          } else {
            b.classList.remove('nope');
            void b.offsetWidth;
            b.classList.add('nope');
            OT.sfx('hmm');
            fb.style.color = '#be185d';
            fb.innerHTML = '🤔 ' + (o.why || 'Mai gândește-te puțin!');
          }
        });
        row.appendChild(b);
      });
      if (q.pic) box.appendChild(h('div', { class: 'quiz-pic' }, q.pic));
      box.append(h('div', { class: 'quiz-q' }, q.q), row, fb, prog);
    }
    render();
  };
})();
