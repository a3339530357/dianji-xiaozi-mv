// ch5_stop.js: 32.25–34.48 s. S13 来吧 看看 火星大力拳: the band stops, the world drains to ink, the punch.
(() => {
  const U = 24, [CX, CY] = SPOT.clawd, VX = 1290;
  const QUAN = '火星大力拳', SLOT = [[330, 300, -.12], [640, 230, .08], [960, 300, -.05], [1270, 220, .1], [1590, 320, -.08]];

  // The world stays as it was when the band stopped, under a heavy ink wash; only Clawd is painted in colour.
  // 来吧 (32.26): Clawd turns to us and beckons. 看看 (~32.8): slow motion, the fist pulls back and burns Mars red, sparks
  // spiral in, the camera pushes on the fist. 火星大力拳: five brush characters slam down one per hit (33.10 → 33.92).
  // 33.92: the punch: a giant fist rushes at the camera, impact frames. The next shot (34.48) is the shockwave.
  function s13(t, lt) {
    const tt = lerp(32.25, t, .25);                                   // the world's clock nearly stops
    const pushIn = ease(seg(t, 32.8, 33.6)), fist = [CX + 4.9 * U + 2.2 * U * Math.cos(-.2), CY - 4.5 * U];
    const slam = i => SYL.quan[0] + i * SYL.quan[1], n = stepAt(t, SYL.quan[0], SYL.quan[1], 5);
    const [sx, sy] = shakes(t, [0, 1, 2, 3, 4].map(i => [slam(i), i === 4 ? 30 : 12, 9]));
    camBegin(lerp(1020, fist[0] - 40, pushIn) + sx, lerp(560, fist[1] - 20, pushIn) + sy, lerp(1.4, 2.3, pushIn));
    rooftop(tt, { stars: 150, moon: false, scope: false });
    villain(VX, ROOF.y + 10, 26, { mood: 'angry', arms: [.6, .9], claws: 1, boilKey: 'vil' });
    camEnd();
    cover('#14141C', .72);                                             // drained to ink
    speedLines(960, 540, .6, { col: '#2A2A34', r: 360, n: 40 });
    camBegin(lerp(1020, fist[0] - 40, pushIn) + sx, lerp(560, fist[1] - 20, pushIn) + sy, lerp(1.4, 2.3, pushIn));
    const wind = seg(t, 32.75, 33.05), burn = seg(t, 32.8, 33.6);
    const beckon = t < 32.75 ? Math.sin((t - 32.26) * 22) * .5 + .4 : 0;
    const aR = t < 32.75 ? .5 + beckon * .4 : lerp(.5, -.25, ease(wind));
    electro(CX, CY, U, { ...feel(t < 32.75 ? 'smug' : 'furious', t), view: t < 32.75 ? 'front' : 'q', aR, aL: t < 32.75 ? .2 : .9,
      sq: .12 * wind - .25 * kick(t, HIT.punch, 7), dx: t > HIT.punch ? .6 : -.4 * wind, watchGlow: .5, boilKey: 'clawd' });
    if (burn > 0) {   // the fist burning Mars red, sparks spiralling into it
      const [fx, fy] = [CX + 4.9 * U + 2.2 * U * Math.cos(aR), CY - 4.5 * U - 2.2 * U * Math.sin(aR)];
      glow(fx, fy, 70 + 160 * burn, EL.mars, .6 + .4 * burn);
      boilSeed('sparks');
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * TAU + t * 5, r = (1 - frac(t * 1.8 + i / 12)) * 220 * burn;
        paint(starPts(fx + Math.cos(a) * r, fy + Math.sin(a) * r * .7, 9, .35, 4), { wash: '#FFB36A', ink: null });
      }
    }
    camEnd();
    flushBrush();
    for (let i = 0; i <= n; i++) {   // 火 星 大 力 拳: each slams in big, settles, and stays
      const [x, y, r] = SLOT[i], age = t - slam(i), s = 1 + 1.4 * Math.exp(-age * 14);
      letter(QUAN[i], x, y, 210 * s, EL.mars, { font: `${Math.round(210 * s)}px "Ma Shan Zheng"`, rot: r, stroke: '#14141C', screen: true });
    }
    flushLetters();
    if (t >= HIT.punch) {   // the fist rushes the camera
      const k = easeOut(seg(t, HIT.punch, HIT.punch + .16)), sc = lerp(.3, 3.4, k);
      speedLines(960, 560, 1, { col: '#FFE2C2', r: 140 + 260 * sc });
      boilSeed('bigfist');
      paint(rrPts(960 - 170 * sc, 560 - 130 * sc, 340 * sc, 260 * sc, 80 * sc), { wash: mixCol(PAL.clay, EL.mars, .45), ink: PAL.ink, sw: 2 });
      for (let j = 0; j < 3; j++) inkLine([[960 - 90 * sc + j * 80 * sc, 560 - 120 * sc], [960 - 90 * sc + j * 80 * sc, 560 - 40 * sc]], 1.6, PAL.ink, 'ink', 0);
      glow(960, 560, 400 * sc, EL.mars, .9);
    }
    impactFrame(t >= HIT.punch && t < HIT.punch + .1);
  }

  shots([[bt(58), s13]]);
})();
