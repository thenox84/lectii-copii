/* Orașul din Telefon — sunete (Web Audio API) și voce (Web Speech API)
   - OT.sfx('nume')                : efecte sonore scurte
   - OT.audio.piano(midi, opt)     : o notă de pian; întoarce {stop()}
   - OT.audio.analyser             : „urechea” care vede unda sunetului din joc
   - OT.speak(text) / OT.speakStop : citește cu voce (română, dacă există)
*/
(function () {
  'use strict';
  const OT = window.OT;

  const A = (OT.audio = {
    ctx: null,
    master: null,
    analyser: null,
    pedal: false,
    _noise: null,
    _wave: null,
    init() {
      if (A.ctx) return A.ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        A.ctx = new AC();
      } catch (e) {
        return null;
      }
      const c = A.ctx;
      A.master = c.createGain();
      A.master.gain.value = OT.state.settings.sound ? 0.9 : 0;
      const comp = c.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      A.master.connect(comp);
      comp.connect(c.destination);
      A.analyser = c.createAnalyser();
      A.analyser.fftSize = 2048;
      A.analyser.smoothingTimeConstant = 0.6;
      comp.connect(A.analyser);
      return c;
    },
    /** trezește sunetul (trebuie apelat după o atingere) */
    unlock() {
      const c = A.init();
      if (c && c.state === 'suspended') c.resume().catch(() => {});
      return c;
    },
    setSound(on) {
      OT.state.settings.sound = on;
      OT.save();
      if (A.master) A.master.gain.value = on ? 0.9 : 0;
    },
    now() {
      return A.ctx ? A.ctx.currentTime : 0;
    },
    noise() {
      if (A._noise) return A._noise;
      const c = A.ctx;
      const len = c.sampleRate * 2;
      const b = c.createBuffer(1, len, c.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      A._noise = b;
      return b;
    },
    pianoWave() {
      if (A._wave) return A._wave;
      const real = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const imag = new Float32Array([0, 1, 0.42, 0.26, 0.14, 0.09, 0.05, 0.035, 0.02, 0.012]);
      A._wave = A.ctx.createPeriodicWave(real, imag);
      return A._wave;
    },
    freq(midi) {
      return 440 * Math.pow(2, (midi - 69) / 12);
    },
    /** tonuri simple: tone(frecvență, durată, {type, vol, at, slideTo, dest}) */
    tone(f, dur, o) {
      const c = A.ctx;
      if (!c) return;
      o = o || {};
      const t = (o.at || 0) + c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(f, t);
      if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + (o.slideTime || dur));
      const v = o.vol == null ? 0.25 : o.vol;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.01));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(o.dest || A.master);
      osc.start(t);
      osc.stop(t + dur + 0.05);
      return { osc, g };
    },
    /** zgomot filtrat: hiss(durată, {type, f, f2, q, vol, at}) */
    hiss(dur, o) {
      const c = A.ctx;
      if (!c) return;
      o = o || {};
      const t = (o.at || 0) + c.currentTime;
      const src = c.createBufferSource();
      src.buffer = A.noise();
      const fl = c.createBiquadFilter();
      fl.type = o.type || 'bandpass';
      fl.frequency.setValueAtTime(o.f || 1000, t);
      if (o.f2) fl.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
      fl.Q.value = o.q || 1;
      const g = c.createGain();
      const v = o.vol == null ? 0.3 : o.vol;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.02));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(fl);
      fl.connect(g);
      g.connect(A.master);
      src.start(t, Math.random());
      src.stop(t + dur + 0.05);
      return { src, g, fl };
    },
    /** o notă de pian sintetizată; întoarce {stop()} pentru ridicarea degetului de pe clapă */
    piano(midi, o) {
      const c = A.unlock();
      if (!c) return { stop() {} };
      o = o || {};
      const t = c.currentTime + (o.at || 0);
      const f = A.freq(midi);
      const vel = o.vel == null ? 0.8 : o.vel;
      const out = c.createGain();
      const fl = c.createBiquadFilter();
      fl.type = 'lowpass';
      fl.frequency.setValueAtTime(Math.min(16000, f * 9), t);
      fl.frequency.exponentialRampToValueAtTime(Math.min(12000, f * 2.2), t + 1.2);
      const o1 = c.createOscillator();
      o1.setPeriodicWave(A.pianoWave());
      o1.frequency.value = f;
      const o2 = c.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = f * 2.003;
      const g2 = c.createGain();
      g2.gain.value = 0.18;
      o1.connect(fl);
      o2.connect(g2);
      g2.connect(fl);
      fl.connect(out);
      out.connect(o.dest || A.master);
      // anvelopă: atac rapid, stingere lentă (notele joase sună mai mult)
      const peak = 0.32 * vel;
      const decay = OT.clamp(4.2 - (midi - 48) * 0.07, 1.2, 4.5);
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(peak, t + 0.006);
      out.gain.setTargetAtTime(peak * 0.35, t + 0.01, 0.18);
      out.gain.setTargetAtTime(0.0001, t + 0.4, decay / 3);
      o1.start(t);
      o2.start(t);
      const end = t + decay + 1.2;
      o1.stop(end);
      o2.stop(end);
      let stopped = false;
      return {
        stop(force) {
          if (stopped) return;
          if (A.pedal && !force) return; // cu pedala, nota mai sună
          stopped = true;
          const n = c.currentTime;
          try {
            out.gain.cancelScheduledValues(n);
            out.gain.setValueAtTime(Math.max(0.0001, out.gain.value), n);
            out.gain.setTargetAtTime(0.0001, n, 0.07);
            o1.stop(n + 0.5);
            o2.stop(n + 0.5);
          } catch (e) {}
        },
      };
    },
  });

  /* ---------- efecte sonore ---------- */
  const N = (m) => A.freq(m);
  const SFX = {
    tap() {
      A.tone(660, 0.08, { type: 'sine', vol: 0.15, slideTo: 880 });
    },
    pop() {
      A.tone(900, 0.12, { type: 'sine', vol: 0.28, slideTo: 180 });
      A.hiss(0.05, { f: 3000, vol: 0.08 });
    },
    bubble() {
      A.tone(320, 0.09, { type: 'sine', vol: 0.22, slideTo: 1300 });
    },
    success() {
      [72, 76, 79, 84].forEach((m, i) => A.tone(N(m), 0.5, { type: 'triangle', vol: 0.2, at: i * 0.11 }));
    },
    star() {
      [88, 91, 95, 100].forEach((m, i) => A.tone(N(m), 0.35, { type: 'sine', vol: 0.14, at: i * 0.07 }));
      A.tone(N(96), 0.9, { type: 'triangle', vol: 0.08, at: 0.3 });
    },
    ding() {
      A.tone(N(84), 1.3, { type: 'sine', vol: 0.3 });
      A.tone(N(96), 0.9, { type: 'sine', vol: 0.08 });
      A.tone(N(88), 1.4, { type: 'sine', vol: 0.22, at: 0.16 });
    },
    whoosh() {
      A.hiss(0.9, { type: 'bandpass', f: 300, f2: 2400, q: 1.5, vol: 0.35, attack: 0.25 });
    },
    shutter() {
      A.hiss(0.05, { type: 'highpass', f: 2000, vol: 0.4 });
      A.hiss(0.07, { type: 'bandpass', f: 1500, vol: 0.35, at: 0.09 });
      A.tone(1800, 0.04, { type: 'square', vol: 0.05, at: 0.09 });
    },
    boing() {
      const r = A.tone(180, 0.5, { type: 'sine', vol: 0.3, slideTo: 520, slideTime: 0.18 });
      if (r) r.osc.frequency.exponentialRampToValueAtTime(260, A.now() + 0.5);
    },
    giggle() {
      [0, 1, 2, 3].forEach((i) => A.tone(900 + (i % 2) * 180, 0.09, { type: 'triangle', vol: 0.12, at: i * 0.11, slideTo: 1200 + i * 40 }));
    },
    woof() {
      [0, 0.28].forEach((at) => {
        A.tone(320, 0.17, { type: 'sawtooth', vol: 0.12, at, slideTo: 140 });
        A.hiss(0.15, { type: 'bandpass', f: 700, q: 2, vol: 0.18, at });
      });
    },
    meow() {
      const c = A.ctx;
      if (!c) return;
      const t = c.currentTime;
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(520, t);
      o.frequency.linearRampToValueAtTime(820, t + 0.25);
      o.frequency.linearRampToValueAtTime(480, t + 0.7);
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.setValueAtTime(900, t);
      f.frequency.linearRampToValueAtTime(1800, t + 0.3);
      f.frequency.linearRampToValueAtTime(700, t + 0.7);
      f.Q.value = 3;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
      o.connect(f);
      f.connect(g);
      g.connect(A.master);
      o.start(t);
      o.stop(t + 0.8);
    },
    purr() {
      const c = A.ctx;
      if (!c) return;
      const t = c.currentTime;
      const src = c.createBufferSource();
      src.buffer = A.noise();
      const f = c.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 260;
      const g = c.createGain();
      g.gain.value = 0;
      const lfo = c.createOscillator();
      lfo.frequency.value = 24;
      const lg = c.createGain();
      lg.gain.value = 0.35;
      lfo.connect(lg);
      lg.connect(g.gain);
      const env = c.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(1, t + 0.2);
      env.gain.setValueAtTime(1, t + 1.3);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      src.connect(f);
      f.connect(g);
      g.connect(env);
      env.connect(A.master);
      src.start(t);
      lfo.start(t);
      src.stop(t + 1.9);
      lfo.stop(t + 1.9);
    },
    fanfare() {
      const seq = [[67, 0, 0.18], [72, 0.18, 0.18], [76, 0.36, 0.18], [79, 0.54, 0.5], [76, 0.95, 0.16], [79, 1.12, 0.9]];
      seq.forEach(([m, at, d]) => {
        A.tone(N(m), d + 0.15, { type: 'sawtooth', vol: 0.07, at });
        A.tone(N(m), d + 0.2, { type: 'triangle', vol: 0.16, at });
      });
    },
    unlock() {
      A.tone(400, 0.4, { type: 'triangle', vol: 0.15, slideTo: 1200 });
      [84, 88, 91].forEach((m, i) => A.tone(N(m), 0.4, { type: 'sine', vol: 0.15, at: 0.3 + i * 0.09 }));
    },
    powerOff() {
      A.tone(900, 0.9, { type: 'sine', vol: 0.25, slideTo: 50 });
    },
    powerOn() {
      A.tone(80, 0.7, { type: 'sine', vol: 0.22, slideTo: 900 });
      A.tone(N(84), 0.5, { type: 'triangle', vol: 0.12, at: 0.6 });
    },
    zap() {
      for (let i = 0; i < 4; i++) A.tone(OT.rand(200, 1400), 0.05, { type: 'square', vol: 0.06, at: i * 0.05 });
    },
    paper() {
      A.hiss(0.18, { type: 'highpass', f: 2500, vol: 0.2 });
      A.hiss(0.12, { type: 'highpass', f: 3500, vol: 0.15, at: 0.15 });
    },
    // „mai încearcă” — un sunet blând, nu de greșeală
    hmm() {
      A.tone(N(76), 0.22, { type: 'triangle', vol: 0.14 });
      A.tone(N(79), 0.3, { type: 'triangle', vol: 0.14, at: 0.16 });
    },
    candy() {
      for (let i = 0; i < 5; i++) A.tone(N(OT.pick([84, 86, 88, 91, 93])), 0.2, { type: 'sine', vol: 0.1, at: i * 0.08 });
    },
    click() {
      A.tone(1200, 0.03, { type: 'square', vol: 0.06 });
    },
    sun() {
      [72, 79, 84].forEach((m, i) => A.tone(N(m), 0.7, { type: 'sine', vol: 0.14, at: i * 0.12 }));
    },
    rustle() {
      A.hiss(0.5, { type: 'highpass', f: 1800, vol: 0.18, attack: 0.1 });
    },
  };
  OT.sfx = function (name) {
    if (!OT.state.settings.sound) return;
    const c = A.unlock();
    if (!c || !SFX[name]) return;
    try {
      SFX[name]();
    } catch (e) {
      console.warn(e);
    }
  };

  // sunetul se „trezește” la prima atingere (cerință a browserelor)
  const wake = () => {
    A.unlock();
    if (navigator.audioSession && !A._recording) {
      try {
        navigator.audioSession.type = 'playback';
      } catch (e) {}
    }
  };
  document.addEventListener('pointerdown', wake, true);
  document.addEventListener('keydown', wake, true);

  /* ---------- vocea (citește cerințele) ---------- */
  const S = (OT.speech = {
    voice: null,
    ok: 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    pick() {
      if (!S.ok) return;
      const vs = speechSynthesis.getVoices() || [];
      S.voice =
        vs.find((v) => /^ro[-_]RO/i.test(v.lang)) ||
        vs.find((v) => /^ro\b/i.test(v.lang)) ||
        vs.find((v) => /român|romanian/i.test(v.name)) ||
        null;
    },
    hasRomanian() {
      return !!S.voice;
    },
  });
  if (S.ok) {
    S.pick();
    try {
      speechSynthesis.addEventListener('voiceschanged', S.pick);
    } catch (e) {
      speechSynthesis.onvoiceschanged = S.pick;
    }
  }
  function clean(t) {
    return String(t || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}✓✔]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  let speakToken = 0;
  /** citește textul; întoarce o promisiune care se rezolvă când s-a terminat */
  OT.speak = function (text, opts) {
    opts = opts || {};
    if (!S.ok || !OT.state.settings.voice) return Promise.resolve();
    const t = clean(text);
    if (!t) return Promise.resolve();
    const my = ++speakToken;
    try {
      speechSynthesis.cancel();
    } catch (e) {}
    // propoziții separate (Chrome oprește uneori textele lungi)
    const parts = t.match(/[^.!?…]+[.!?…]*/g) || [t];
    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (my !== speakToken) return resolve();
        if (i >= parts.length) return resolve();
        const u = new SpeechSynthesisUtterance(parts[i++].trim());
        u.lang = 'ro-RO';
        if (S.voice) u.voice = S.voice;
        u.rate = opts.rate || 0.92;
        u.pitch = opts.pitch || 1.08;
        let done = false;
        const fin = () => {
          if (done) return;
          done = true;
          next();
        };
        u.onend = fin;
        u.onerror = fin;
        // siguranță: dacă browserul nu anunță finalul
        setTimeout(fin, 900 + u.text.length * 110);
        try {
          speechSynthesis.speak(u);
        } catch (e) {
          fin();
        }
      };
      next();
    });
  };
  OT.speakStop = function () {
    speakToken++;
    if (S.ok) {
      try {
        speechSynthesis.cancel();
      } catch (e) {}
    }
  };
})();
