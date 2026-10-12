// ch8_end.js: 52.26–58.35 s. S20 the heart lights up the town into dawn, S21 everyone on the roof at sunrise, the iris out.
(() => {
  const U = 24, KU = 19, [CX, CY] = SPOT.clawd, [KX, KY] = SPOT.kit;
  const dawnAt = t => ease(seg(t, HIT.heart + .3, bt(98)));
  // everyone on the roof: Clawd, 小卡, the kitten, the villain (in love now), the four machines (good again)
  function gang(t, o = {}) {
    const j = o.jump ? jump(t, o.jump, o.jump + .5, 2.2) : { dy: 0, sq: 0 }, j2 = o.jump ? jump(t, o.jump + .08, o.jump + .56, 2) : j;
    villain(1290, ROOF.y + 10, 20, { mood: 'love', arms: [1.2, 1.2], claws: .6, steam: .4, dy: j2.dy * .6, sq: j2.sq, boilKey: 'vil' });
    ['gear', 'drone', 'dog', 'can'].forEach((k, i) => minion(k, 1000 + i * 120, 915, 20, { dy: (i % 2 ? j2 : j).dy * 1.4, flip: true, boilKey: k }));
    kaka(1080, ROOF.y - 250, 15, { eyes: 'happy', mouth: 'laugh', arms: [1.4, 1.4], dy: j2.dy, boilKey: 'kaka' });
    kitten(KX, KY, KU, { sit: 1, eyes: 'closed', dy: j2.dy, boilKey: 'kit' });
    electro(CX, CY, U, { ...(o.mood || feel('happy', t)), dy: j.dy, sq: j.sq, aR: 1.3, aL: 1.3, ...(o.clawd || {}), boilKey: 'clawd' });
  }

  // S20 · 52.26–54.48 · 心发热发亮 · on the bass note a heart lights in Clawd's chest, swells, and its warm light rolls out in
  // a ring per beat, sweeping the night away into sunrise.
  function s20(t, lt) {
    const d = dawnAt(t), hk = backOut(seg(t, HIT.heart, HIT.heart + .3));
    camBegin(960, 560, lerp(1.6, 1.15, ease(seg(t, HIT.heart, bt(98)))));
    rooftop(t, { stars: 150, dawn: d, scope: false, lit: 1, glowWin: d < .5 });
    gang(t, { mood: feel('love', t), clawd: { aR: .3, aL: .3, draw: (u, sw) => { boilSeed('heart'); glow(0, -5 * u, (3 + 6 * hk) * u, '#FFB36A', hk); paint(heartPts(0, -4.6 * u, u * 1.4 * hk * (1 + .1 * pulse(t, 5))), { wash: '#E2476E', ink: PAL.ink, sw: sw * .7 }); } } });
    for (let r = 0; r < 4; r++) { const t0 = bt(94 + r), age = t - t0; if (age > 0 && age < 1.4) shockRing(CX, CY - 4.6 * U, 60 + age * 1300, 70, { ry: .6, fade: age / 1.4, col: '#FFD9A0', ink: null, key: r }); }
    camEnd();
  }

  // S21 · 54.48–58.35 · (outro) · the same roof as the opening, at sunrise: everyone jumps together on beat 98; the camera
  // drifts in on Clawd, who winks at us on beat 102; a four-pointed star iris closes on it as the song fades out.
  function s21(t, lt) {
    const push_ = ease(seg(t, 55.4, 57.6));
    camBegin(lerp(960, CX, push_), lerp(560, CY - 5 * U, push_), lerp(1.15, 2.2, push_));
    rooftop(t, { stars: 150, dawn: 1, scope: false, lit: 1 });
    const wink = t > bt(102) && t < bt(102) + .6;
    gang(t, { jump: bt(98), mood: feel('happy', t, wink ? { eyes: ['wink', 'happy'] } : {}) });
    const [ex, ey] = [CX, CY - 5 * U];
    camEnd();
    const [sx, sy] = scr(ex, ey), r = lerp(1600, 0, easeIn(seg(t, 57.0, 58.15)));
    if (t > 57.0) { if (r < 4) cover('#05060F', 1); else irisShape(starPts(sx, sy, r, .45, 4, -Math.PI / 2), '#05060F'); }
  }

  shots([[HIT.heart, s20], [bt(98), s21]]);
})();
