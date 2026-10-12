// ch4_chorus1.js: 23.36–32.25 s. S10 the thunderbolt and the four flashes, S11 the hero, S12 the costume gag + the villain lands.
(() => {
  const U = 24, KU = 19, [CX, CY] = SPOT.clawd, [KX, KY] = SPOT.kit, [QX, QY] = SPOT.crash;
  const VX = 1290;   // where the villain lands

  // S10 · 23.36–25.59 · 电击火光 闪闪闪闪 · a thunderbolt hits Clawd on the downbeat: impact frames, white, rings, a big
  // shake. Then one bolt per 闪, from the left, the right, above and behind, each with a hard cut to a new angle.
  const ANG = [[860, 560, 1.5, .08], [1000, 600, 1.7, -.07], [880, 520, 2.1, 0], [900, 640, 1.3, .05]];
  function s10(t, lt) {
    const i = stepAt(t, SYL.shan[0], SYL.shan[1], 4), [ax, ay, az, ar] = i < 0 ? [960, 560, 1.15, 0] : ANG[i];
    const [sx, sy] = shakes(t, [[HIT.drop, 40, 5], ...[0, 1, 2, 3].map(k => [SYL.shan[0] + k * SYL.shan[1], 18, 9])]);
    camBegin(ax + sx, ay + sy, az * punch(t, [[HIT.drop, .14, 5]]), ar);
    rooftop(t, { stars: 150, moon: false, scope: false, vortex: 1 - seg(t, HIT.drop, 25.5) });
    kaka(QX - 30, QY - 230, 16, { eyes: 'wide', mouth: 'o', look: -.7, arms: [1.3, 1.3], boilKey: 'kaka' });
    kitten(KX, KY, KU, { sit: 1, eyes: 'wide', boilKey: 'kit' });
    const glowK = kick(t, HIT.drop, 1.2);
    electro(CX, CY, U, { ...feel('determined', t), suit: t > 25.2, tint: '#FFF6C8', tintK: .8 * glowK + .3, aR: 1.5, aL: .9, sq: -.15 * kick(t, HIT.drop, 6), boilKey: 'clawd' });
    glow(CX, CY - 4 * U, 260 + 300 * glowK, '#FFF6C8', .5 + .5 * glowK);
    for (let r = 0; r < 3; r++) { const age = t - HIT.drop - r * .12; if (age > 0 && age < .8) shockRing(CX, CY - 10, 60 + age * 1500, 34, { ry: .3, fade: age / .8, col: '#FFF3B0', key: r }); }
    bolt(CX + 30, -900, CX + 4.9 * U, CY - 7 * U, { k: seg(t, HIT.drop - .04, HIT.drop + .02), fade: seg(t, HIT.drop + .25, 24.3), seed: 11, w: 60, branches: 4, flicker: true, glows: 6 });
    if (i >= 0) {   // the four flashes: each bolt strikes from its own side and fades within the half beat
      const from = [[CX - 1300, CY - 900], [CX + 1300, CY - 900], [CX - 40, CY - 1300], [CX + 400, CY - 1100]][i], t0 = SYL.shan[0] + i * SYL.shan[1];
      bolt(from[0], from[1], CX, CY - 5 * U, { k: seg(t, t0, t0 + .05), fade: seg(t, t0 + .12, t0 + .27), seed: 20 + i, w: 40, branches: 3, flicker: true, glows: 4 });
    }
    speedLines(...scr(CX, CY - 4 * U), .9 * kick(t, HIT.drop, 1.5) + (i >= 0 ? .5 : 0), { col: '#FFF6C8', r: 330 });
    camEnd();
    const hitFlash = [HIT.drop, ...[0, 1, 2, 3].map(k => SYL.shan[0] + k * SYL.shan[1])];
    impactFrame(t >= HIT.drop && t < HIT.drop + .1 || hitFlash.slice(1).some(h => t >= h && t < h + .034));
    if (t >= HIT.drop + .1) flash(.85 * kick(t, HIT.drop + .1, 5), '#FFFDF6');
  }

  // S11 · 25.59–27.81 · 真厉害 · whip pan to the reveal: 电击小子 in full costume, a low-angle hero pose, sparks crackling on
  // the outline, a ting of starlight on beat 48; 小卡 cheers.
  function s11(t, lt) {
    const whip = 1 - easeOut(seg(lt, 0, .22));
    camBegin(CX + 60 + whip * 900, CY - 260 + whip * 40, 1.75 - .05 * lt, -.04 * (1 - whip));
    rooftop(t, { stars: 150, moon: false, scope: false });
    speedLines(...scr(CX, CY - 4 * U), .35, { col: '#3A4A9A', r: 420 });
    kaka(QX - 30, QY - 230, 16, { eyes: 'happy', mouth: 'laugh', arms: [1.4 + .3 * Math.sin(t * 14), 1.4 + .3 * Math.sin(t * 14 + 2)], boilKey: 'kaka' });
    kitten(KX, KY, KU, { sit: 1, eyes: 'open', boilKey: 'kit' });
    electro(CX, CY, U, { ...feel('proud', t), aR: 1.45, aL: -.5, watchGlow: .7, emote: t > bt(48) ? 'spark' : null, emoteK: backOut(seg(t, bt(48), bt(48) + .2)), boilKey: 'clawd' });
    for (let k = 0; k < 3; k++) { const a = (Math.floor(t * 12) * 2.1 + k * 2.2) % TAU; const x0 = CX + Math.cos(a) * 5.4 * U, y0 = CY - 5 * U + Math.sin(a) * 3.4 * U;
      bolt(x0, y0, x0 + Math.cos(a) * 1.6 * U, y0 + Math.sin(a) * 1.6 * U, { seed: k + Math.floor(t * 12) * 3, w: 5, branches: 0, glows: 1, depth: 3, rough: .45 }); }
    if (t > bt(48)) glow(CX + 5.2 * U, CY - 9 * U, 140 * kick(t, bt(48), 4), '#FFFFFF', 1);
    camEnd();
    if (whip > .02) speedLines(960, 540, whip, { col: PAL.cream, r: 200, n: 30 });
  }

  // S12 · 27.81–32.25 · 摇身一变 变变变变 Electro boy · a spin through the drawn views; then one puff of smoke per 变, each
  // swapping in a wrong hat (chef, wizard, party, cat ears) with Clawd more fed up each time; 小卡 smacks the watch,
  // the right suit comes back and the shades drop for "Electro boy". 31.70: a huge shadow falls: the villain lands.
  const WRONG = ['chef', 'wizard', 'party', 'cat'], FED = ['surprised', 'confused', 'bored', 'disgusted'];
  function s12(t, lt) {
    const [sx, sy] = shakes(t, [[HIT.stomp, 44, 5], [bt(54), 8, 10]]);
    camBegin(1000 + sx, 560 + sy, 1.45 * punch(t, [[HIT.stomp, .06]]));
    rooftop(t, { stars: 150, moon: false, scope: false });
    const k = stepAt(t, SYL.bian[0], SYL.bian[1], 4), fixed = t >= bt(54);
    // the villain drops in behind on the kick, with its shadow sweeping over everyone first
    const fall = seg(t, 31.35, HIT.stomp);
    if (t > 31.35) villain(VX, ROOF.y + 10 - (1 - easeIn(fall)) * 900, 26, { mood: 'angry', arms: [.4, .4], claws: .8, sq: .15 * kick(t, HIT.stomp, 8), boilKey: 'vil' });
    const smack = seg(t, bt(54) - .2, bt(54));
    kaka(lerp(QX - 30, CX + 230, ease(smack) * (1 - seg(t, bt(54) + .3, bt(55)))), QY - 230 + 60 * ease(smack) * (1 - seg(t, bt(54) + .3, bt(55))), 16,
      { eyes: fixed ? 'happy' : 'open', mouth: fixed ? 'smile' : 'flat', arms: [-.3, smack > .5 ? 1.4 : -.3], look: -.6, boilKey: 'kaka' });
    kitten(KX, KY, KU, { sit: 1, eyes: t > HIT.stomp ? 'wide' : 'open', boilKey: 'kit' });
    let o;
    if (t < SYL.bian[0]) o = { ...feel('playful', t), ...turn(t, 27.85, 28.75, 0, 1) };   // 摇身一变: the spin
    else if (!fixed) o = { ...feel(FED[k], t), suit: false, hat: WRONG[k] };
    else o = { ...feel('cool', t), eyes: t > bt(54) + .25 ? 'shades' : 'normal' };
    if (t > HIT.stomp) o = { ...o, ...feel('surprised', t, { eyes: 'wide' }), suit: true, hat: undefined };
    electro(CX, CY, U, { ...o, watchGlow: fixed ? .6 : .2, aR: fixed && t < HIT.stomp ? 1.2 : .3, boilKey: 'clawd' });
    if (k >= 0 && !fixed) { const t0 = SYL.bian[0] + k * SYL.bian[1]; dust(CX + 3 * U, CY - 9 * U, .6 * (1 - seg(t, t0, t0 + .22)), { n: 8, reach: 160, size: .22, key: k }); }   // a little puff by the hat
    if (fixed && t < bt(54) + .4) { const [gx, gy] = [CX + 3 * U, CY - 9 * U]; glow(gx, gy, 200 * kick(t, bt(54), 5), '#FFFFFF', 1); }
    if (t > HIT.stomp) dust(VX, ROOF.y, .4 * seg(t, HIT.stomp, HIT.stomp + .5), { n: 12, reach: 700, key: 9 });
    camEnd();
    const shadow = seg(t, 30.9, HIT.stomp);   // the shadow comes down from the top before the villain does
    if (shadow > 0) { boilSeed('shade'); paint([[-60, -60], [W + 60, -60], [W + 60, H * shadow * .9], [-60, H * shadow * 1.05]], { wash: '#0A0C22', washOp: 150 * (1 - seg(t, HIT.stomp, HIT.stomp + .3)), ink: null }); }
  }

  shots([[bt(42), s10], [bt(46), s11], [bt(50), s12]]);
})();
