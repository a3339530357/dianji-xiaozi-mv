// ch3_fill.js: 21.14–23.36 s. S9 the charge-up before the chorus: the vortex, the red eyes, the button.
(() => {
  const U = 24, KU = 19, [CX, CY] = SPOT.clawd, [KX, KY] = SPOT.kit, [QX, QY] = SPOT.crash;

  // S9 · 21.14–23.36 · (no words) · Clawd shakes off the daze, gets determined, crouches and thrusts the watch arm up;
  // the camera circles in; the clouds wind into a vortex overhead and two red eyes flash inside it (the villain,
  // foreshadowed). The watch brightens a notch on every beat. 22.42: everything nearly stops, the frame darkens to
  // one point of light. 22.81: the other arm slams the button.
  function s9(t, lt) {
    const still = seg(t, HIT.hush - .08, HIT.hush), go = seg(t, HIT.press, HIT.press + .1);
    const tt = lerp(t, HIT.hush, still * (1 - go));   // time almost stops at the hush, until the press
    const circle = ease(seg(t, bt(38), HIT.hush));
    camBegin(lerp(1000, CX + 30, circle), lerp(560, CY - 220, circle), lerp(1.35, 1.9, circle) * punch(t, [[HIT.press, .06]]), lerp(0, -.06, circle));
    sky(tt, {});
    stars(tt, { count: 150 });
    vortex(tt, ease(seg(t, bt(38), bt(40.5))), 1000, CY - 520);
    const eyes = seg(t, 22.0, 22.1) * (1 - seg(t, 22.3, 22.42));   // the red eyes in the storm
    if (eyes > .01) for (const s of [-1, 1]) {
      const ex = 1000 + s * 70, ey = CY - 500;
      glow(ex, ey, 110, RB.visor, eyes); boilSeed('reye' + s);
      paint([[ex - 46 * s, ey - 10], [ex + 40 * s, ey - 24], [ex + 34 * s, ey + 12], [ex - 40 * s, ey + 10]], { wash: '#FF6A4D', washOp: 255 * eyes, ink: null });
    }
    town(tt, { y: 1090, lit: .3 });
    roof(ROOF.x0, ROOF.x1, ROOF.y);
    capsule(QX + 20, QY - 30, 1.25, { open: 1, glowK: .2 });
    const notch = clamp(Math.floor(sbeat(t)) - 37, 0, 4) / 4;   // 1 notch per beat from beat 38
    const crouch = ease(seg(t, 21.5, 21.9));
    const mood = emotions(t, [[0, 'dizzy'], [21.45, 'determined']]);
    electro(CX, CY, U, { ...mood, suit: false, watch: true, watchGlow: .3 + .7 * notch, aR: lerp(.2, 1.5, crouch), aL: t > HIT.press ? 1.15 : lerp(.2, .5, crouch),
      rot: t < 21.45 ? .12 * Math.sin((t - bt(38)) * 30) * (1 - seg(t, 21.14, 21.45)) : 0, sq: (mood.sq || 0) + .14 * crouch - .2 * kick(t, HIT.press, 9), boilKey: 'clawd' });
    kaka(QX - 30, QY - 230, 16, { eyes: 'wide', mouth: 'o', look: -.6, boilKey: 'kaka' });
    kitten(KX, KY, KU, { sit: 1, eyes: 'wide', boilKey: 'kit' });
    const [wx, wy] = [CX + 4.9 * U + 2.2 * U * Math.cos(lerp(.2, 1.5, crouch)), CY - 4.5 * U - 2.2 * U * Math.sin(lerp(.2, 1.5, crouch))];
    glow(wx, wy, 90 + 160 * notch, EL.cyan, .6 + .4 * notch);
    camEnd();
    cover('#05060F', .55 * still * (1 - go));                // the hush: the world drops away around the watch
    if (still > .02 && t < HIT.press + .1) { const [sx, sy] = scr(wx, wy); glow(sx, sy, 120, '#E9FCFF', 1); }
    if (t >= HIT.press) {   // a snap of light on the press, then the watch's light swells into the thunderbolt
      flash(.6 * kick(t, HIT.press, 12), '#E9FCFF');
      const [sx, sy] = scr(wx, wy), b = easeIn(seg(t, HIT.press, bt(42)));
      glow(sx, sy, 200 + 900 * b, '#E9FCFF', .5 + .5 * b);
    }
  }

  shots([[bt(38), s9]]);
})();
