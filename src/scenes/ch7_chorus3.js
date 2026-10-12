// ch7_chorus3.js: 43.37–52.26 s. S17 the rooftop chase, S18 the idea, S19 the kitten and the kindness.
(() => {
  const U = 24, KU = 19, [KX, KY] = SPOT.kit;
  const roofs = () => { roof(ROOF.x0, ROOF.x1, ROOF.y); roof(1500, 2420, ROOF.y, { key: 'b' }); roof(2520, 3400, ROOF.y, { key: 'c' }); };

  // S17 · 43.37–46.15 · 呼啦呼啦 小子身手非凡 · second round: the villain chases Clawd across the roofs, claws snapping;
  // Clawd hops on beats 78, 79 and flips on 80, then a slow-motion lean-back dodge with a trail of afterimages as a
  // claw sweeps over it.
  const HOPS = [[1000, bt(78)], [1550, bt(79)], [2050, bt(80)], [2500, bt(81)]];
  function s17(t, lt) {
    const slow = seg(t, 45.0, 45.15) * (1 - seg(t, 45.9, 46.1)), tt = t < 45 ? t : 45 + (t - 45) * lerp(1, .3, slow);
    let x = 800, y = ROOF.y, rot = 0;
    for (let i = 0; i < HOPS.length; i++) {
      const [x1, t1] = HOPS[i], x0 = i ? HOPS[i - 1][0] : 800, k = seg(tt, t1 - BEAT * .5, t1);
      if (tt >= t1 - BEAT * .5) { [x, y] = arcPt([x0, ROOF.y], [x1, ROOF.y], 180, ease(k)); if (i === 2) rot = -TAU * ease(k); }
    }
    camBegin(x + 120, 560, 1.25);
    sky(tt, {}); stars(tt, { count: 150 }); town(tt, { y: 1090, lit: 1, glowWin: true }); roofs();
    const vx = x - 520 + Math.sin(tt * 3) * 30, swing = Math.sin(tt * 7);
    villain(vx, ROOF.y + 10, 24, { mood: 'angry', arms: [.2 + .6 * swing, .6 - .6 * swing], claws: .5 + .5 * Math.sin(tt * 14), lean: .08, boilKey: 'vil' });
    const lean = slow * -.55;
    for (let g = 3; g >= 1; g--) if (slow > .05) electro(x - g * 40 * slow, y, U, { ...feel('cool', tt), rot: lean * (1 - g * .2), tint: '#8EC3E6', tintK: .9, noShadow: true, scarf: 0, boilKey: 'ghost' + g });
    electro(x, y, U, { ...feel(slow > .1 ? 'cool' : 'excited', tt), view: 'side', walk: tt * 3, rot: rot + lean, wind: 2.5, boilKey: 'clawd' });
    camEnd();
  }

  // S18 · 46.15–47.81 · 头脑不简单 · Clawd stops dead and thinks; two gears whirr over its head, a bulb pops on beat 84; it points at the villain's power cord running to a plug on the chimney.
  function s18(t, lt) {
    camBegin(2380, 600, 1.55);
    sky(t, {}); stars(t, { count: 150 }); town(t, { y: 1090, lit: 1 }); roofs();
    boilSeed('chimney');
    paint(rectPts(2760, 560, 120, 230), { wash: '#5A2A2E', ink: PAL.ink, sw: 1 });
    paint(rectPts(2790, 640, 60, 60), { wash: '#E8ECF2', ink: PAL.ink, sw: .8 });                       // the socket
    inkLine([[2160, 640], [2400, 760], [2620, 700], [2805, 668]], 3.4, PAL.ink, 'ink', .5);               // the cord
    paint(rrPts(2790, 650, 36, 40, 6), { wash: '#3B3550', ink: PAL.ink, sw: .8 });                         // the plug
    villain(2050, ROOF.y + 10, 24, { mood: 'angry', arms: [.9, .4], claws: .7, flip: true, boilKey: 'vil' });
    const idea = t >= bt(84);
    electro(2380, ROOF.y, U, { ...emotions(t, [[0, 'thinking'], [bt(84), 'idea']]), aR: idea ? .9 : .2,
      draw: (u, sw) => { if (!idea && t > 46.25) { boilSeed('gears'); for (const [gx, sp] of [[-1.5, 1], [1.5, -1]]) { const G = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * 9 * sp, r = (i % 2 ? 1.1 : .8) * u; G.push([gx * u + Math.cos(a) * r, -11.2 * u + Math.sin(a) * r]); } paint(G, { wash: '#D9A21F', ink: PAL.ink, sw: sw * .5 }); } } },
      boilKey: 'clawd' });
    camEnd();
  }

  // S19 · 47.81–52.26 · 勇敢又善良 · the kitten slips off the eave; Clawd drops everything and dives, catching it in slow
  // motion on beat 88. Then: the villain, unplugged and powerless, sits and cries; Clawd offers a hand and pats its head;
  // on beat 92 the villain's eyes turn to hearts.
  function s19(t, lt) {
    const catchT = bt(88), slow = seg(t, catchT - .35, catchT - .2) * (1 - seg(t, catchT + .2, catchT + .4));
    const tt = t < catchT - .35 ? t : catchT - .35 + (t - (catchT - .35)) * lerp(1, .35, slow);
    camBegin(1060, 640, 1.2);
    rooftop(tt, { stars: 150, moon: false, scope: false, lit: 1 });
    // the villain sits slumped at the left, unplugged
    const loveK = t >= bt(92);
    villain(640, ROOF.y + 30, 18, { mood: loveK ? 'love' : t > 49.6 ? 'cry' : 'off', arms: [-.9, -.9], claws: .1, sq: .12, steam: 0, boilKey: 'vil' });
    // the kitten slides down the slope and drops off the front edge; Clawd dives and catches it
    const slide = seg(tt, 47.85, 48.45), fall = seg(tt, 48.45, catchT);
    let kx = lerp(1330, 1420, slide), ky = lerp(ROOF.y, ROOF.y + 250, slide) + 300 * fall * fall, krot = .5 * slide;
    const dive = seg(tt, 48.2, catchT), [dx, dy] = arcPt([1100, ROOF.y], [1440, ROOF.y + 330], 160, ease(dive));
    const back = seg(t, catchT + .35, 49.6), [bx, by] = arcPt([1440, ROOF.y + 330], [1150, ROOF.y], 150, ease(back));
    const caught = tt >= catchT;
    let cxp = t < 47.9 ? 1100 : dive < 1 ? dx : back > 0 ? bx : 1440, cyp = t < 47.9 ? ROOF.y : dive < 1 ? dy : back > 0 ? by : ROOF.y + 330;
    const walk = seg(t, 50.0, 50.6);
    if (t > 50.0) { cxp = lerp(1150, 900, ease(walk)); cyp = ROOF.y; }
    if (caught) { kx = cxp + 20; ky = cyp - 9 * U; krot = 0; }
    electro(cxp, cyp, U, { ...feel(t < 50 ? 'determined' : 'love', tt), view: dive > 0 && dive < 1 ? 'side' : 'front', rot: dive > 0 && dive < 1 ? .5 : 0,
      aR: caught ? 1.4 : .3, aL: caught && t < 50 ? 1.4 : t > 50.4 ? .9 + .3 * Math.sin(t * 9) : .2, flip: t > 50.0, boilKey: 'clawd' });
    kitten(kx, ky, KU, { sit: caught ? 1 : 0, rot: krot, eyes: caught ? 'closed' : 'wide', boilKey: 'kit' });
    kaka(1300, ROOF.y - 240, 15, { eyes: loveK ? 'happy' : 'wide', mouth: loveK ? 'laugh' : 'o', arms: loveK ? [1.3, 1.3] : [-.2, -.2], boilKey: 'kaka' });
    if (loveK) for (let i = 0; i < 4; i++) emote('heart', 640 + (i - 1.5) * 90, ROOF.y - 18 * 18 - frac(t * .8 + i / 4) * 160, 14, 1, t);
    camEnd();
  }

  shots([[bt(78), s17], [46.15, s18], [bt(86), s19]]);
})();
