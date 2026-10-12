// ch6_chorus2.js: 34.48–43.37 s. S14 the shockwave and the spin, S15 the remote and the VS face-off, S16 one zap per beat.
(() => {
  const U = 24, KU = 19, [CX, CY] = SPOT.clawd, [KX, KY] = SPOT.kit, VX = 1290;
  const KINDS = ['gear', 'drone', 'dog', 'can'];

  // S14 · 34.48–35.59 · 呼啦呼啦 · the band slams back: a shockwave sweeps the frame and the colour floods back; the
  // villain spins off into the sky like a top and twinkles out; Clawd, delighted, whirls round twice (one per 呼啦).
  function s14(t, lt) {
    const [sx, sy] = shakes(t, [[HIT.back, 50, 4]]);
    camBegin(1000 + sx, 560 + sy, 1.3 * punch(t, [[HIT.back, .1, 5]]));
    rooftop(t, { stars: 150, moon: false, scope: false });
    const fly = easeOut(seg(t, HIT.back, HIT.back + .9));
    if (fly < .98) villain(lerp(VX, 1900, fly), lerp(ROOF.y, -600, fly), 26 * (1 - .8 * fly), { mood: 'dizzy', rot: t * 14, arms: [1.4, 1.4], boilKey: 'vil' });
    if (fly >= .98 && t < HIT.back + 1.1) { glow(1900, -600 + 40, 120, '#FFFFFF', 1); }
    const spin = turn(t, HIT.back + .05, HIT.back + .5, 0, 1), spin2 = turn(t, HIT.back + .55, HIT.back + 1.0, 0, 1);
    electro(CX, CY, U, { ...feel('laugh', t), ...(t < HIT.back + .52 ? spin : spin2), aR: 1.2, aL: 1.2, wind: 2, boilKey: 'clawd' });
    boilSeed('wind');   // whirl lines around the spin
    for (let i = 0; i < 4; i++) { const a = t * 18 + i * 1.6, P = []; for (let k = 0; k < 8; k++) { const q = k / 7; P.push([CX + Math.cos(a + q * 2) * (6 + i) * U, CY - 4 * U + Math.sin(a + q * 2) * 2.2 * U]); } inkLine(P, 1.1, PAL.cream, 'inkfine', .6); }
    kaka(VX - 80, ROOF.y - 200, 16, { eyes: 'happy', mouth: 'laugh', arms: [1.4, 1.4], boilKey: 'kaka' });
    kitten(KX, KY, KU, { sit: 1, eyes: 'open', boilKey: 'kit' });
    for (let r = 0; r < 2; r++) { const age = t - HIT.back - r * .1; if (age > 0 && age < .7) shockRing(CX + 6 * U, CY - 4 * U, 80 + age * 2400, 60, { ry: .55, fade: age / .7, col: '#FFE2C2', key: r }); }
    camEnd();
    cover('#14141C', .72 * (1 - seg(t, HIT.back, HIT.back + .2)));   // the ink wash of the stop-time washes off
  }

  // S15 · 35.59–38.92 · 小子变身 对付大坏蛋 · the villain crashes back down and clicks a remote: the little machines' eyes go
  // red and they line up behind it. 36.70: a diagonal VS split, Clawd left, the villain right, a bolt for the border;
  // both faces lunge at us on beats 67 and 68.
  function s15(t, lt) {
    if (t < bt(66)) {
      const land = seg(t, 35.59, 35.95), [sx, sy] = shakes(t, [[35.95, 36, 6]]);
      camBegin(1060 + sx, 560 + sy, 1.3);
      rooftop(t, { stars: 150, moon: false, scope: false });
      KINDS.forEach((k, i) => minion(k, 1080 + i * 120, 915, 22, { evil: t > 36.25, hop: t > 36.25 ? .3 * kick(t, 36.25 + i * .06, 6) : 0, flip: true, boilKey: k }));
      villain(VX, ROOF.y + 10 - (1 - easeIn(land)) * 1000, 26, { mood: 'angry', arms: [.3, 1.1], claws: .2, sq: .2 * kick(t, 35.95, 8), boilKey: 'vil',
        draw: (u, sw) => { if (t > 36) { push(); translate(-11 * u, -13 * u); boilSeed('remote'); paint(rrPts(-1.2 * u, -2 * u, 2.4 * u, 4 * u, .4 * u), { wash: '#3B3550', ink: PAL.ink, sw }); paint(ellPts(0, -.8 * u, .6 * u, .6 * u, 10), { wash: t > 36.2 ? RB.visor : '#7A7090', ink: null }); pop(); } } });
      electro(CX, CY, U, { ...emotions(t, [[0, 'surprised'], [36.1, 'determined']]), aR: .4, boilKey: 'clawd' });
      kitten(KX, KY, KU, { sit: 1, eyes: 'wide', boilKey: 'kit' });
      camEnd();
      return;
    }
    // the VS split: Clawd's close-up on the left, a diagonal dark panel over the right with the villain's close-up in it
    const lunge = k => punch(t, [[bt(67), k, 7], [bt(68), k, 7]]), slide = easeOut(seg(t, bt(66), bt(66) + .2));
    const zl = 2.6 * lunge(.12);
    camBegin(CX + 170 + (1 - slide) * 400, CY - 5 * U - 8, zl);   // Clawd lands at about x 520 on screen
    sky(t, {}); stars(t, { count: 150 }); speedLines(CX, CY - 5 * U, .5, { col: '#3A4A9A', r: 300 });
    electro(CX, CY, U, { ...feel('determined', t), view: 'q', aR: 1.2, watchGlow: .8, boilKey: 'clawd' });
    camEnd();
    boilSeed('vsmask');
    paint([[1180, -60], [W + 60, -60], [W + 60, H + 60], [760, H + 60]], { wash: '#2A0E1E', ink: null });
    speedLines(1500, 450, .45, { col: '#5A1E2E', r: 260, n: 24 });
    const zr = 1.25 * lunge(.12);
    camBegin(VX - 540 / zr - (1 - slide) * 400, ROOF.y + 10 - 17.2 * 26 + 110 / zr, zr);   // the villain's head at about (1500, 430)
    villain(VX, ROOF.y + 10, 26, { mood: 'angry', arms: [-.7, -.7], claws: .3, steam: 1, boilKey: 'vil' });
    camEnd();
    bolt(1220, -40, 800, H + 40, { seed: 31, w: 22, branches: 2, flicker: true, glows: 4, rough: .12 });
    flushBrush();
    letter('VS', 990, 540, 190, EL.yellow, { rot: -.15, stroke: PAL.ink, pop: (t - bt(66)) * 5, screen: true });
  }

  // S16 · 38.92–43.37 · 除暴安良 维持治安 · one zap per beat, beats 70-77: Clawd hops from robot to robot along two roofs
  // and each red-eyed machine pops in a burst of confetti and comes back to normal; whip pans on the bar lines; the
  // town's windows light up as it goes.
  const ROW = [700, 900, 1100, 1300, 1700, 1900, 2100, 2300];
  function s16(t, lt) {
    const b = clamp(Math.floor(sbeat(t)) - 70, 0, 7), half = t >= bt(74) ? 1 : 0;
    const pan = half ? lerp(1000, 2000, easeOut(seg(t, bt(74), bt(74) + .22))) : lerp(700, 1000, ease(seg(t, bt(70), bt(74))));
    camBegin(pan, 600, 1.2);
    sky(t, {}); stars(t, { count: 150 });
    town(t, { y: 1090, lit: .3 + .7 * seg(t, bt(70), bt(78)), glowWin: true });
    roof(ROOF.x0, ROOF.x1, ROOF.y); roof(1500, 2420, ROOF.y, { key: 'b' });
    ROW.forEach((x, i) => {
      const hit = bt(70 + i), freed = t >= hit;
      minion(KINDS[i % 4], x, 915, 22, { evil: !freed, hop: freed ? .4 * kick(t, hit + .1, 4) : 0, dy: freed ? -Math.abs(Math.sin((t - hit) * 6)) * .8 * kick(t, hit, 2) : 0, flip: true, boilKey: 'r' + i });
      if (freed && t < hit + .5) {   // confetti
        boilSeed('conf' + i);
        for (let c = 0; c < 10; c++) { const a = c / 10 * TAU, age = t - hit, r = age * 500; paint(rectPts(x + Math.cos(a) * r, 840 + Math.sin(a) * r * .7 + age * age * 900, 14, 9), { wash: [EL.yellow, EL.cyan, PAL.rose, EL.red][c % 4], ink: null }); }
      }
    });
    const from = ROW[Math.max(0, b - 1)] - 230, to = ROW[b] - 230, hopK = seg(t, bt(70 + b) - BEAT * .45, bt(70 + b) - .02);
    const [hx, hy] = arcPt([b ? from : 520, ROOF.y], [to, ROOF.y], 130, ease(hopK));
    electro(hx, hy, U, { ...feel('determined', t), view: 'q', aR: .1, watchGlow: .9, wind: 2, boilKey: 'clawd' });
    const zapK = seg(t, bt(70 + b), bt(70 + b) + .22);
    if (zapK > 0 && zapK < 1) bolt(hx + 7 * U, hy - 4.5 * U, ROW[b], 880, { seed: 40 + b, w: 18, branches: 1, flicker: true, glows: 3, fade: seg(zapK, .5, 1) });
    kaka(lerp(500, 2300, seg(t, bt(70), bt(78))) - 120, ROOF.y - 260, 14, { eyes: 'happy', mouth: 'laugh', arms: [1.2, 1.2], boilKey: 'kaka' });
    camEnd();
    if (half && t < bt(74) + .22) speedLines(960, 540, 1 - seg(t, bt(74), bt(74) + .22), { col: PAL.cream, r: 500, n: 30 });
  }

  shots([[bt(62), s14], [bt(64), s15], [bt(70), s16]]);
})();
