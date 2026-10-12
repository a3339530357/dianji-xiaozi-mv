// test_fx.js: a throwaway shot to check the effects and the karaoke band. Replaced by the real chapters.
(() => {
  function test(t, lt) {
    camBegin(960, 540, punch(t, [[24, .08]]));
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: PAL.night, ink: null });
    boilSeed('hills'); paint(ellPts(960, 1180, 1300, 420, 40, 10), { wash: '#2C3466', ink: PAL.ink, sw: 1 });
    speedLines(960, 600, .8, { col: PAL.cream, r: 380 });
    shockRing(960, 820, 120 + 900 * seg(t, 24, 24.8), 40, { ry: .35, fade: seg(t, 24.2, 24.8), col: '#FFF3B0' });
    bolt(900, -40, 960, 720, { k: seg(t, 23.95, 24.05) * 1.0 + (t > 24.05 ? 1 : 0), seed: 3, w: 30, branches: 3, flicker: true });
    clawd(960, 840, 24, feel('excited', t));
    camEnd();
    impactFrame(t >= 24.0 && t < 24.07);
  }
  shots([[0, test]]);
})();
