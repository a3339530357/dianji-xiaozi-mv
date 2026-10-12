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
    b_clawd: () => grid(6, (x, y) => clawd(x, y + 100, 22, feel('happy', T))),
  };
  for (const [k, f] of Object.entries(B)) { LOOPS[k] = t => { f(t); }; LOOPS[k].len = 2; }
})();
