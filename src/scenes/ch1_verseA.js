// ch1_verseA.js: 3.36–12.25 s. S3 up into the stars, S4 through the telescope, S5 the capsule, the crash.
(() => {
  const U = 24, KU = 19, [CX, CY] = SPOT.clawd, [KX, KY] = SPOT.kit, [QX, QY] = SPOT.crash;
  const pals = (t, o = {}) => {   // Clawd and the kitten on the roof, from behind or facing us
    clawd(CX, CY, U, { ...feel('hopeful', t), view: 'back', boilKey: 'clawd', ...o.clawd });
    kitten(KX, KY, KU, { sit: 1, boilKey: 'kit', ...o.kit });
  };
  // the telescope's round view: everything outside a circle of radius r goes dark, with a brass rim
  const scopeView = r => {
    irisShape(ellPts(960, 540, r, r, 48), '#05060F');
    boilSeed('rim'); const P = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU; P.push([960 + Math.cos(a) * r, 540 + Math.sin(a) * r]); }
    paint(strip(P, 22, 22), { wash: '#C9A45C', ink: PAL.ink, sw: 1 });
  };

  // S3 · 3.36–5.58 · 漫漫星空宇宙 一望无际 · the camera tilts up off the roof into the sky; a new batch of stars
  // pops in on every beat and the milky way is brushed across. It ends on the moon, dead centre.
  function s3(t, lt) {
    const up = ease(seg(t, bt(6), bt(10) - .12));
    camBegin(960, lerp(470, -500, up), 1 + .02 * lt);
    rooftop(t, { stars: 150, popAt: i => i < 40 ? -9 : bt(6 + (i % 4)) + hash(i * 1.9) * .1, milky: seg(t, bt(7), bt(9.4)) });
    pals(t);
    camEnd();
  }

  // S4a · 5.58–6.69 · 美丽而神秘 · match cut: the moon's circle becomes the telescope's view and opens up on a ringed
  // planet; a shooting star crosses it.
  function s4a(t, lt) {
    space(t);
    const q = seg(t, 5.95, 6.45);
    if (q > 0 && q < 1) {
      const x = lerp(260, 1500, easeOut(q)), y = lerp(260, 420, q);
      glow(x, y, 90, '#FFF1C2', 1 - q * .6);
      boilSeed('shoot'); paint(strip([[x - 260, y - 50], [x, y]], 2, 18), { wash: '#FFF6C8', ink: null });
    }
    scopeView(lerp(76, 470, easeOut(seg(lt, 0, .35))));
  }
  // S4b · 6.69–7.80 · close on Clawd at the eyepiece; just after the cut its eyes turn to stars.
  function s4b(t, lt) {
    camBegin(CX + 70, CY - 150, 2.3 + .05 * lt);
    rooftop(t, { stars: 150, moon: false });
    clawd(CX, CY, U, { ...emotions(t, [[0, 'neutral', { lookX: .6 }], [bt(12) + .2, 'starstruck']]), view: 'q', boilKey: 'clawd' });
    camEnd();
  }

  // S5a · 7.80–8.92 · 高深莫测 · back in the scope: a glowing capsule darts across the stars in a zigzag, a leg per half beat.
  const ZZ = [[520, 360], [1360, 470], [640, 620], [1300, 760], [980, 520]];
  function zigzag(t) {
    const p = clamp((t - bt(14)) / (BEAT / 2), 0, ZZ.length - 1.001), i = Math.floor(p), k = easeOut(frac(p));
    const [a, b] = [ZZ[i], ZZ[i + 1]];
    return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), dir: Math.atan2(a[1] - b[1], a[0] - b[0]) };
  }
  function s5a(t) {
    space(t, { px: 1240, py: 300, pr: 70 });
    const c = zigzag(t);
    capsule(c.x, c.y, .55, { rot: Math.sin(t * 9) * .3, trail: 1, dir: c.dir, glowK: .8 });
    scopeView(470);
  }
  // S5b · 8.92–10.58 · 多么叫人好奇 · Clawd steps back from the scope, a "?" pops; it tilts its head left on beat 16
  // and right on beat 18, and the kitten copies it half a beat later.
  function s5b(t, lt) {
    camBegin(800, 560, 1.55 + .03 * lt);
    rooftop(t, { stars: 150, moon: false });
    const tilt = k => .16 * (ease(seg(t, bt(16) + k, bt(16) + k + .18)) - 2 * ease(seg(t, bt(18) + k, bt(18) + k + .18)));
    clawd(CX, CY, U, { ...emotions(t, [[0, 'neutral'], [bt(16) - .1, 'confused']]), view: 'front', rot: tilt(0), boilKey: 'clawd' });
    kitten(KX, KY, KU, { sit: 1, rot: tilt(BEAT / 2) * 1.4, boilKey: 'kit' });
    camEnd();
  }
  // S5c · 10.58–11.69 · from behind them: the capsule turns and dives straight at the roof, growing; speed lines
  // gather toward it; Clawd jolts (a take and a "!") as it comes.
  function s5c(t, lt, dur) {
    const k = easeIn(seg(lt, .1, dur)), cx = lerp(1180, QX, k), cy = lerp(130, QY - 60, k), s = lerp(.32, 1.7, k);
    camBegin(900, 520, 1.05 + .08 * k);
    rooftop(t, { stars: 150, moon: false });
    glow(cx, cy, 150, EL.cyan, .9);   // a bright point first, so the eye finds it before it's big
    capsule(cx, cy, s, { rot: -.6 + Math.sin(t * 13) * .1, trail: .9, dir: -1.9, glowK: .9 });
    pals(t, { clawd: { view: 'qback', ...take(t, 11.15, 1.2), emote: '!', emoteK: backOut(seg(t, 11.15, 11.35)) }, kit: { eyes: 'wide' } });
    camEnd();
    speedLines(...scr(cx, cy), seg(lt, .45, dur) * .9, { col: PAL.cream, r: 260 * s + 120 });
  }
  // S5d · 11.69–12.25 · CRASH: the capsule slams into the roof. Impact frames, a hard shake, Clawd and the kitten
  // bounce up in fright; the dust bursts out and swallows the frame (the next shot opens as it clears).
  function s5d(t, lt) {
    const [sx, sy] = shakes(t, [[HIT.crash, 46, 6]]);
    camBegin(900 + sx, 540 + sy, 1.15 * punch(t, [[HIT.crash, .12, 7]]));
    rooftop(t, { stars: 150, moon: false });
    capsule(QX, QY - 40, 1.6, { rot: -.35, glowK: .6 * kick(t, HIT.crash, 3) });
    clawd(CX, CY, U, { ...feel('scared', t), ...jump(t, HIT.crash + .02, HIT.crash + .4, 3), boilKey: 'clawd' });
    kitten(KX, KY, KU, { eyes: 'wide', dy: jump(t, HIT.crash + .06, HIT.crash + .42, 2.6).dy, boilKey: 'kit' });
    dust(QX, QY - 20, seg(lt, 0, .56), { n: 18 });
    camEnd();
    if (t >= HIT.crash + .07) flash(1 - seg(t, HIT.crash + .07, HIT.crash + .2), '#FFFDF6');   // after the impact frames, or the white inverts to black
    impactFrame(t >= HIT.crash && t < HIT.crash + .07);
  }

  shots([[bt(6), s3], [bt(10), s4a], [bt(12), s4b], [bt(14), s5a], [bt(16), s5b], [bt(19), s5c], [HIT.crash, s5d]]);
})();
