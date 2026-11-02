/* Ediția Beatrice — sunet de chitară (coardă ciupită, metoda Karplus-Strong)
   OT.audio.guitar(midi, {vel, at})  → cântă o coardă; întoarce {stop()}
   OT.audio.strum(midis, {down, vel}) → „strum”: corzile una după alta, foarte repede */
(function () {
  'use strict';
  const OT = window.OT;
  const A = OT.audio;
  const cache = {};

  function makeBuffer(c, midi) {
    const sr = c.sampleRate;
    const f = A.freq(midi);
    const dur = OT.clamp(3.2 - (midi - 40) * 0.035, 1.4, 3.4);
    const len = Math.floor(sr * dur);
    const buf = c.createBuffer(1, len, sr);
    const out = buf.getChannelData(0);
    const N = sr / f;
    // lungimea buclei: L eșantioane + 0,5 (media) + o întârziere fracționară (all-pass), ca nota să fie exactă
    let L = Math.floor(N - 0.5);
    let frac = N - 0.5 - L;
    if (frac < 0.1) {
      L -= 1;
      frac += 1;
    }
    const C = (1 - frac) / (1 + frac);
    const ring = new Float32Array(L);
    // atacul: zgomot ușor filtrat (degetul care ciupește coarda)
    let last = 0;
    for (let i = 0; i < L; i++) {
      last = last * 0.5 + (Math.random() * 2 - 1) * 0.5;
      ring[i] = last;
    }
    const decay = 0.9965 - Math.max(0, midi - 55) * 0.00035;
    let idx = 0;
    let x1 = 0;
    let y1 = 0;
    for (let i = 0; i < len; i++) {
      const v = ring[idx];
      const lp = decay * 0.5 * (v + ring[(idx + 1) % L]);
      const ap = C * lp + x1 - C * y1;
      x1 = lp;
      y1 = ap;
      ring[idx] = ap;
      out[i] = v;
      idx = (idx + 1) % L;
    }
    // stingere ușoară la final
    const fade = Math.floor(sr * 0.05);
    for (let i = 0; i < fade; i++) out[len - 1 - i] *= i / fade;
    return buf;
  }

  A.guitar = function (midi, o) {
    const c = A.unlock();
    if (!c) return { stop() {} };
    o = o || {};
    const key = Math.round(midi);
    if (!cache[key]) cache[key] = makeBuffer(c, key);
    const t = c.currentTime + (o.at || 0);
    const src = c.createBufferSource();
    src.buffer = cache[key];
    // „cutia” chitarei: întărește notele joase și calde
    const body = c.createBiquadFilter();
    body.type = 'peaking';
    body.frequency.value = 110;
    body.Q.value = 1.2;
    body.gain.value = 6;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4200;
    const g = c.createGain();
    g.gain.value = (o.vel == null ? 0.8 : o.vel) * 0.9;
    src.connect(body);
    body.connect(lp);
    lp.connect(g);
    g.connect(o.dest || A.master);
    src.start(t);
    let stopped = false;
    return {
      stop() {
        if (stopped) return;
        stopped = true;
        const n = c.currentTime;
        try {
          g.gain.cancelScheduledValues(n);
          g.gain.setValueAtTime(g.gain.value, n);
          g.gain.setTargetAtTime(0.0001, n, 0.06);
          src.stop(n + 0.4);
        } catch (e) {}
      },
    };
  };
  /** strum: midis de la coarda groasă la cea subțire; down=false = invers */
  A.strum = function (midis, o) {
    o = o || {};
    const list = o.down === false ? midis.slice().reverse() : midis;
    return list.map((m, i) => (m == null ? null : A.guitar(m, { at: (o.at || 0) + i * (o.spread || 0.028), vel: o.vel || 0.7 })));
  };
})();
