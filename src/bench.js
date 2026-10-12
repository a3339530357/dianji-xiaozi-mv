// bench.js: one painting primitive per loop, to time what each costs on the renderer (node render.mjs --loop=b_fill --sheet=...).
// Not part of the video. Each loop paints the same amount of one kind of mark over the paper.
(() => {
  const grid = (n, f) => { for (let i = 0; i < n; i++) { boilSeed('b' + i); f(160 + (i % 6) * 320, 140 + Math.floor(i / 6) * 270, i); } };
  const B = {
    b_empty: () => {},
    b_wash: () => grid(24, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { wash: PAL.clay, ink: null })),
    b_washInk: () => grid(24, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { wash: PAL.clay, ink: PAL.ink, sw: 1.2 })),
    b_fillSmall: () => grid(24, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: .2, ink: null })),
    b_fillBig: () => { for (let i = 0; i < 4; i++) { boilSeed('f' + i); paint(ellPts(960, 540 + i * 60, 1100, 420, 40, 20), { fill: [PAL.sky, PAL.indigo, PAL.sap, PAL.rose][i], fillOp: 90, bleed: .25, tex: .6, ink: null }); } },
    b_hatch: () => grid(12, (x, y) => paint(rectPts(x - 140, y - 110, 280, 220, 4), { hatch: { d: 10, a: .6, b: 'HB', c: PAL.ink, w: 1 }, ink: null })),
    b_lines: () => grid(24, (x, y, i) => inkLine([[x - 130, y], [x - 40, y - 60 + i % 5 * 10], [x + 50, y + 50], [x + 130, y - 20]], 1.4)),
    b_glow: () => grid(24, (x, y) => glow(x, y, 160, '#FFD84A', 1)),
    b_letters: () => { grid(24, (x, y) => letter('火', x, y, 120, '#E2492F')); },
    b_fsSame: () => { for (let i = 0; i < 24; i++) { boilSeed('s' + i); paint(ellPts(960, 540, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: .2, ink: null }); } },
    b_fs4: () => grid(4, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: .2, ink: null })),
    b_fsFlat: () => grid(24, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: 0, tex: 0, border: 0, ink: null })),
    b_fb24: () => { for (let i = 0; i < 24; i++) { boilSeed('F' + i); paint(ellPts(960, 540, 1000, 400, 40, 20), { fill: PAL.sky, fillOp: 30, bleed: .25, tex: .6, ink: null }); } },
    b_fsBleed: () => grid(24, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: .2, tex: 0, border: 0, ink: null })),
    b_fsTex: () => grid(24, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: 0, tex: .4, border: 0, ink: null })),
    b_fsBorder: () => grid(24, (x, y) => paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: 0, tex: 0, border: .35, ink: null })),
    b_fsFlush: () => grid(24, (x, y) => { paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: .2, ink: null }); flushBrush(); }),
    b_fsFlush4: () => grid(24, (x, y, i) => { paint(ellPts(x, y, 130, 100, 24, 6), { fill: PAL.sky, fillOp: 120, bleed: .2, ink: null }); if (i % 4 === 3) flushBrush(); }),
    b_clawd: () => grid(6, (x, y) => clawd(x, y + 100, 22, feel('happy', T))),
  };
  for (const [k, f] of Object.entries(B)) { LOOPS[k] = t => { f(t); }; LOOPS[k].len = 2; }
})();

// Model sheet for the new cast (node render.mjs --loop=castSheet --sheet=0.3,1.1 ...): not part of the video.
LOOPS.castSheet = t => {
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#DCE6F0', ink: null });
  electro(260, 520, 18, { ...feel('proud', t), aR: 1.1, watchGlow: .8, boilKey: 'e1' });
  electro(260, 1000, 18, { ...feel('determined', t), view: 'side', boilKey: 'e2', wind: 1.5 });
  clawd(620, 520, 18, { ...feel('surprised', t), hat: 'chef', boilKey: 'c1' });
  kaka(560, 1000, 22, { eyes: 'happy', mouth: 'laugh', arms: [1.2, .2], blush: .8, boilKey: 'k1' }); kaka(700, 760, 14, { eyes: 'open', look: .6, boilKey: 'k2' });
  kitten(900, 520, 26, { eyes: 'open' }); kitten(900, 1000, 26, { sit: 1, eyes: 'closed' });
  villain(1300, 1000, 22, { mood: 'angry', arms: [.3, 1.4], claws: .8 });
  villain(1750, 1000, 14, { mood: 'cry', arms: [-.6, -.6] });
  minion('gear', 1580, 380, 22); minion('drone', 1760, 380, 22, { evil: true }); minion('dog', 1580, 560, 22, { evil: true }); minion('can', 1780, 560, 22);
};
LOOPS.castSheet.len = 2;
