// ch0_intro.js: 0–3.36 s. S1 the lightning, S2 the eyes in the dark and the pull back to reveal the town.
(() => {
  const U = 24, KU = 19, [CX, CY] = SPOT.clawd, [KX, KY] = SPOT.kit;

  // S1 · 0.00–1.82 · a bolt splits the black on the first hit; in its light, Clawd and the kitten on the roof, from
  // behind, under the stars. The light dies away and a few stars stay, popping in on beats 1 and 2.
  function s1(t, lt) {
    const light = t < HIT.open ? 0 : .9 * Math.exp(-1.6 * (t - HIT.open)) + .15 * seg(t, HIT.open, .6);
    camBegin(960, 470, 1.05 - .025 * lt);
    rooftop(t, { stars: 0, scope: true });
    clawd(CX, CY, U, { ...feel('neutral', t), view: 'back', boilKey: 'clawd' });
    kitten(KX, KY, KU, { sit: 1, boilKey: 'kit' });
    camEnd();
    cover('#05060F', 1 - light);
    camBegin(960, 470, 1.05 - .025 * lt);
    stars(t, { n: 40, popAt: i => i < 14 ? HIT.open + .05 : i < 28 ? bt(1) : bt(2) });
    camEnd();
    bolt(1420, -80, 1500, 880, { k: seg(t, HIT.open, HIT.open + .09), fade: seg(t, .3, 1.1), seed: 7, w: 34, branches: 3, flicker: true, glows: 5 });
    impactFrame(t >= HIT.open && t < HIT.open + .07);
  }

  // S2 · 1.82–3.36 · black on the music's gap. 2.44: two eyes snap open in the dark (we're very close on Clawd).
  // 2.80: on the kick the camera pulls all the way back and the lights come up on the night town.
  function s2(t, lt) {
    const pull = easeOut(seg(t, HIT.kick, bt(6) + .1)), ex = CX, ey = CY - 6 * U;
    const zoom = lerp(5.2, 1, pull) * punch(t, [[HIT.kick, .05]]);
    camBegin(lerp(ex, 960, pull), lerp(ey, 470, pull), zoom);
    rooftop(t, { stars: 40 });
    const mood = emotions(t, [[0, 'neutral'], [HIT.kick + .25, 'hopeful', { lookY: -.6 }]]);
    clawd(CX, CY, U, { ...mood, view: 'front', boilKey: 'clawd' });
    kitten(KX, KY, KU, { sit: 1, boilKey: 'kit' });
    camEnd();
    const dark = 1 - ease(seg(t, HIT.kick, HIT.kick + .4));
    cover('#05060F', dark);
    if (dark > .02 && t >= HIT.eyes) {   // the eyes, drawn over the dark: they open with a snap and overshoot
      const k = backOut(seg(t, HIT.eyes, HIT.eyes + .12)), z = LAST_CAM.zoom;
      for (const s of [-1, 1]) {
        const [sx, sy] = scr(CX + s * 2.5 * U, CY - 6 * U), w = U * z * .55, h = U * z * k * 1.05;
        glow(sx, sy, w * 3.2, EL.cyan, .8 * dark);
        boilSeed('eye' + s);
        paint(rrPts(sx - w / 2, sy - h, w, 2 * h, w / 2), { wash: '#F4FBFF', washOp: 255 * dark, ink: null });
      }
    }
  }

  shots([[0, s1], [HIT.gap, s2]]);
})();
