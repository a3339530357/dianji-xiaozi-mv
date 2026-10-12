// ch2_verseB.js: 12.25–21.14 s. S6 the capsule opens (小卡 and the machines), S7 the hologram, S8 the watch and the zap.
(() => {
  const U = 24, KU = 19, [CX, CY] = SPOT.clawd, [KX, KY] = SPOT.kit, [QX, QY] = SPOT.crash;
  const MINI = [['gear', 1010, 915, bt(23)], ['drone', 1125, 905, bt(24)], ['dog', 1245, 925, bt(25)], ['can', 1365, 915, bt(25.5)]];   // on the slope in front of the capsule
  // a machine leaps out of the capsule on an arc at t0, lands and then hops in place on every beat
  const machine = (t, [kind, x, y, t0], o = {}) => {
    if (t < t0) return;
    const k = seg(t, t0, t0 + .32), [px, py] = arcPt([QX, QY - 50], [x, y], 160, easeOut(k)), hop = t > t0 + .32 ? Math.abs(Math.sin(sbeat(t) * Math.PI)) : 0;
    minion(kind, px, py - hop * 18, 22, { hop: k < 1 ? .5 * (1 - k) : .25 * (1 - hop), flip: true, boilKey: kind, ...o });
  };
  const kakaAt = t => [QX - 40, QY - 120 - 70 * backOut(seg(t, 12.62, 13.0))];   // pops up out of the open capsule
  // the tip of Clawd's right arm (front view) for a raise angle a, where the watch sits
  const armTip = a => [CX + 4.9 * U + 2.2 * U * Math.cos(a), CY - 4.5 * U - 2.2 * U * Math.sin(a)];

  // S6 · 12.25–14.47 · 未来科幻世界 各样机械 · the dust clears; the capsule pops open like a lunchbox and 小卡 floats up
  // (Clawd jumps back in surprise); then a machine leaps out on each beat and they hop in step.
  function s6(t, lt) {
    camBegin(1080, 600, 1.22 + .02 * lt);
    rooftop(t, { stars: 150, moon: false, scope: false });
    capsule(QX, QY - 40, 1.6, { rot: -.35 * (1 - ease(seg(t, 12.3, 12.6))), open: backOut(seg(t, 12.45, 12.7)), glowK: .5 });
    if (t > 12.62) kaka(...kakaAt(t), 16, { eyes: t < 13.1 ? 'closed' : 'happy', mouth: 'smile', arms: [1.2 * kick(t, 13, 3), 1.2 * kick(t, 13, 3)], boilKey: 'kaka' });
    MINI.forEach(m => machine(t, m));
    clawd(CX, CY, U, { ...emotions(t, [[0, 'scared'], [12.8, 'surprised', { lookX: .8 }], [13.9, 'excited', { lookX: .6 }]]), boilKey: 'clawd' });
    kitten(KX, KY, KU, { sit: 1, eyes: t > 12.8 ? 'wide' : 'open', boilKey: 'kit' });
    dust(QX, QY - 20, 1 - seg(lt, 0, .5), { n: 18 });
    camEnd();
  }

  // S7 · 14.47–16.70 · 我眼界打开 · 小卡 beams up a hologram of the future city (it switches on on beat 28); Clawd's eyes
  // go wide and the city shows in them; the camera pushes in toward its eyes.
  function s7(t, lt, dur) {
    const push_ = ease(seg(lt, .9, dur));
    const [hx, hy] = [880, 330], ex = CX + 2.5 * U, ey = CY - 6 * U;
    camBegin(lerp(1020, ex - 20, push_), lerp(560, ey, push_), lerp(1.3, 3.6, push_));
    rooftop(t, { stars: 150, moon: false, scope: false });
    capsule(QX + 20, QY - 30, 1.25, { open: 1, glowK: .3 });
    MINI.forEach(m => machine(t, m));
    const [kx, ky] = [QX - 30, QY - 230], hk = backOut(seg(t, bt(28), bt(28) + .3));
    kaka(kx, ky, 16, { eyes: 'happy', mouth: 'o', look: -.4, boilKey: 'kaka' });
    if (hk > .02) { boilSeed('beam'); paint([[kx + 14, ky - 5.3 * 16 * 1], [hx - 240 * hk, hy + 150 * hk], [hx + 240 * hk, hy + 150 * hk]], { wash: EL.cyan, washOp: 60, ink: null }); }
    hologram(hx, hy, 500, 290, hk, t);
    clawd(CX, CY, U, { ...emotions(t, [[0, 'excited', { lookX: .6, lookY: -.5 }], [bt(28) + .1, 'surprised', { lookX: .5, lookY: -.6 }]]), boilKey: 'clawd' });
    if (hk > .5) for (const s of [-1, 1]) {   // the city, tiny, reflected in each eye
      boilSeed('refl' + s); const x = CX + s * 2.5 * U - .2 * U, y = CY - 6.6 * U;
      paint(rectPts(x - .25 * U, y, .5 * U, .5 * U), { wash: EL.cyan, washOp: 170, ink: null });
    }
    kitten(KX, KY, KU, { sit: 1, eyes: 'wide', boilKey: 'kit' });
    camEnd();
  }

  // S8 · 16.70–21.14 · 神奇的力量很精彩 · the hologram folds into a glowing watch that floats down to Clawd; Clawd puts it
  // on (it lights on beat 33); little arcs crawl over Clawd on every beat while it tries a cool pose; on 20.58 it zaps
  // itself: frizzed, smoking, dizzy, while 小卡 giggles behind its hands.
  function s8(t, lt) {
    const [sx, sy] = shakes(t, [[HIT.zap, 16, 8]]);
    camBegin(1000 + sx, 600 + sy, 1.45 * punch(t, [[HIT.zap, .07]]));
    rooftop(t, { stars: 150, moon: false, scope: false });
    capsule(QX + 20, QY - 30, 1.25, { open: 1, glowK: .2 });
    MINI.forEach(m => machine(t, m));
    const zapped = t >= HIT.zap, aR = kf(t, [[16.7, .2], [17.9, 1.0], [18.6, .4], [19.4, 1.4], [HIT.zap, 1.4], [HIT.zap + .15, -.6], [21.1, -.2]]);
    kaka(QX - 30, QY - 230, 16, { eyes: zapped ? 'happy' : 'open', mouth: zapped ? 'laugh' : 'smile', arms: zapped ? [1.4, 1.4] : [-.2, -.2], sq: zapped ? .08 * Math.sin(t * 30) : 0, look: -.5, boilKey: 'kaka' });
    // the watch: falls from where the hologram was, then sits on the arm
    const wTip = armTip(aR), from = [880, 330];
    const watchLit = backOut(seg(t, bt(33), bt(33) + .2));
    if (t < 18.36) {
      const [wx, wy] = arcPt(from, wTip, -40, ease(seg(t, 16.7, 18.36)));
      glow(wx, wy, 120, EL.cyan, .9); boilSeed('watchF');
      paint(rrPts(wx - 14, wy - 19, 28, 38, 7), { wash: '#3B3550', ink: PAL.ink, sw: .8 }); paint(ellPts(wx, wy, 12, 12, 12), { wash: '#E9FCFF', ink: PAL.ink, sw: .6 });
      if (t < 17.4) hologram(880, 330, 500 * (1 - seg(t, 16.7, 17.4)), 290 * (1 - seg(t, 16.7, 17.4)), 1, t);
    }
    const mood = zapped ? feel('dizzy', t, { blush: 0 }) : emotions(t, [[0, 'surprised', { lookX: .7, lookY: -.6 }], [17.5, 'excited', { lookX: .8, lookY: .2 }], [19.4, 'cool']]);
    const frizz = zapped ? kick(t, HIT.zap, 2.5) : 0;
    electro(CX, CY, U, { ...mood, suit: false, watch: t >= 18.36, watchGlow: watchLit * (zapped ? .4 : 1), aR, aL: zapped ? 1.2 * frizz : .2,
      sq: (mood.sq || 0) + .1 * frizz * Math.sin(t * 50), boilKey: 'clawd' });
    // arcs crawling over the body on beats 34-37, and the big crackle on the zap
    const nArc = zapped ? 7 : t > bt(34) ? 1 + Math.min(3, Math.floor(sbeat(t)) - 34) : 0;
    for (let i = 0; i < nArc; i++) {
      const a = i / Math.max(1, nArc) * TAU + Math.floor(sbeat(t)) * 1.7, r = 6.5 * U;
      const x0 = CX + Math.cos(a) * r, y0 = CY - 5 * U + Math.sin(a) * r * .6;
      bolt(x0, y0, x0 + Math.cos(a + 1.6) * 2.2 * U, y0 + Math.sin(a + 1.6) * 2.2 * U, { seed: i + Math.floor(t * 12), w: zapped ? 9 * frizz + 3 : 5, branches: 0, glows: 1, depth: 3, rough: .4, fade: zapped ? 1 - frizz : 0 });
    }
    if (zapped) { boilSeed('smoke'); const age = t - HIT.zap; paint(ellPts(CX, CY - 10 * U - age * 90, (.8 + age) * U, (.7 + age * .8) * U, 14), { wash: '#8E8579', washOp: 220 * (1 - seg(age, .2, .56)), ink: PAL.ink, sw: .6 }); }
    kitten(KX, KY, KU, { sit: 1, eyes: zapped ? 'wide' : 'open', boilKey: 'kit' });
    camEnd();
    if (zapped) flash(.55 * (1 - seg(t, HIT.zap, HIT.zap + .12)), '#E9FCFF');
  }

  shots([[bt(22), s6], [bt(26), s7], [bt(30), s8]]);
})();
