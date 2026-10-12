// world.js: the town at night and its props. The sky, the stars, the moon, the milky way, the town's roofs and
// windows, the roof Clawd sits on, the telescope, the capsule, the hologram. Flat washes and ink; the milky way and
// the dawn are the only watercolor fills (a couple of big fills per frame are cheap everywhere).

const SKY = { night: '#1B2150', deep: '#121640', violet: '#3B2E6E', dawn1: '#F4A86B', dawn2: '#F7D79A', rose: '#E9878F' };

// The sky over the town. o.dawn 0..1 warms it from night to sunrise (S20-S21).
function sky(t, o = {}) {
  const d = clamp(o.dawn || 0);
  boilSeed('sky');
  paint(rectPts(-600, -1400, 4400, H + 1800), { wash: mixCol(SKY.night, SKY.dawn2, d * .85), ink: null });   // wide: the chase pans out to x ~3400
  if (d > .02) paint(ellPts(960, 1100, 1900, 700, 30, 20), { fill: SKY.rose, fillOp: 140 * d, bleed: .25, tex: .5, ink: null });
  if (o.vortex) vortex(t, o.vortex);
}

// Stars at fixed spots (hash), twinkling; o.count limits how many are lit (S3 lights them in batches on the beat).
// The field covers x 0..W, y -1200..700 so the camera can tilt up into it.
function stars(t, o = {}) {
  const n = o.n ?? 140, lit = o.count ?? n, a = 1 - clamp(o.fade || 0);
  boilSeed('stars');
  for (let i = 0; i < Math.min(n, lit); i++) {
    const x = hash(i * 1.37) * (W + 400) - 200, y = -1250 + hash(i * 2.71 + 5) * 1950, s = 3 + hash(i * 4.1) * 7;
    const tw = .65 + .35 * Math.sin(t * (2 + hash(i) * 3) + i), pop = o.popAt ? backOut(seg(t, o.popAt(i), o.popAt(i) + .25)) : 1;
    if (pop <= 0) continue;
    paint(starPts(x, y, s * tw * pop, .35, 4), { wash: PAL.cream, washOp: 255 * a, ink: null });
  }
}
function moon(x, y, r, o = {}) {
  glow(x, y, r * 3.2, '#FFF1C2', .55 * (o.a ?? 1));
  boilSeed('moon');
  paint(ellPts(x, y, r, r, 28), { wash: '#FFF4D6', ink: PAL.ink, sw: .8 });
  for (const [dx, dy, cr] of [[-.3, -.2, .18], [.25, .25, .12], [.1, -.4, .08]]) paint(ellPts(x + dx * r, y + dy * r, cr * r, cr * r, 10), { wash: '#EFDFB4', ink: null });
}
// A soft watercolor band across the sky, painted on from left to right as k goes 0 → 1.
function milkyWay(k, o = {}) {
  if (k <= .01) return;
  // a band that swells in the middle and tapers to nothing at both ends, so it reads as a glow, not a road
  const band = (w, kk) => {
    const n = 16, L = [], R = [], m = Math.max(2, Math.round(n * clamp(kk)));
    for (let i = 0; i <= m; i++) {
      const q = i / n, x = -200 + q * (W + 400), y = (o.y ?? -380) + Math.sin(q * 3 + .5) * 140 - q * 160, h = w * Math.pow(Math.sin(Math.PI * q), .7) + 6;
      L.push([x, y - h * (.8 + .2 * hash(i * 3.3))]); R.push([x, y + h * (.8 + .2 * hash(i * 5.7))]);
    }
    return L.concat(R.reverse());
  };
  boilSeed('milky');
  paint(band(230, k), { fill: '#7E6CB8', fillOp: 90, bleed: .4, tex: .7, border: .2, ink: null });
  paint(band(90, k), { fill: '#C9BCEB', fillOp: 70, bleed: .35, tex: .6, border: .1, ink: null });
}
// Swirling storm clouds (S9): k 0..1. Rings of cloud puffs turning around (cx, cy).
function vortex(t, k, cx = 960, cy = -60) {
  boilSeed('vortex');
  for (let ring = 0; ring < 4; ring++) for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + t * (.8 - ring * .15) + ring, r = (180 + ring * 210) * (.6 + .4 * k), s = (70 + ring * 30) * k;
    paint(ellPts(cx + Math.cos(a) * r * 1.5, cy + Math.sin(a) * r * .45, s * 1.6, s * .7, 14, 6), { wash: mixCol('#2A2F5E', '#4A4D86', ring / 4), washOp: 230, ink: PAL.ink, sw: .6 });
  }
}

// The town below the roof: rows of house silhouettes with windows. o.lit 0..1 lights the windows one by one (S16).
// y = where the houses stand (screen bottom area); far rows are smaller, bluer and paler.
function town(t, o = {}) {
  const lit = o.lit ?? .25, y0 = o.y ?? 1000;
  for (const [row, sc, col] of [[0, .7, '#2A3168'], [1, 1, '#222859']]) {
    boilSeed('town' + row);
    let x = -260 + row * 90, i = 0;
    while (x < W + 300) {
      const w = (150 + hash(i * 3.3 + row) * 140) * sc, h = (170 + hash(i * 5.1 + row) * 190) * sc, by = y0 - row * 10 + (1 - sc) * -90;
      paint([[x, by], [x, by - h], [x + w / 2, by - h - w * .35], [x + w, by - h], [x + w, by]], { wash: col, ink: PAL.ink, sw: .8 });
      for (let wy = 0; wy < 2; wy++) for (let wx = 0; wx < 2; wx++) {
        const id = i * 4 + wy * 2 + wx + row * 100, on = hash(id * 7.7) < lit;
        const px = x + w * (.22 + wx * .4), py = by - h * (.75 - wy * .4);
        paint(rectPts(px, py, w * .18, h * .16), { wash: on ? '#FFD67A' : '#161B45', ink: null });
        if (on && o.glowWin) glow(px + w * .09, py + h * .08, 50, '#FFD67A', .5);
      }
      x += w + 18 * sc; i++;
    }
  }
}

// The tiled roof Clawd sits on: ridge from x0 to x1 at height y, sloping down to the front.
function roof(x0, x1, y, o = {}) {
  boilSeed('roof' + (o.key || ''));
  paint([[x0 - 60, y + 260], [x0, y], [x1, y], [x1 + 60, y + 260]], { wash: o.col || '#7A3B3B', ink: PAL.ink, sw: 1.2 });
  for (let i = 1; i < 4; i++) inkLine([[x0 - 15 * i, y + 65 * i], [x1 + 15 * i, y + 65 * i]], .7, PAL.ink, 'inkfine', 0);
  paint(rectPts(x0 - 10, y - 14, x1 - x0 + 20, 24, 2), { wash: '#5A2A2E', ink: PAL.ink, sw: 1 });
}

// The telescope on its tripod. (x, y) = where the tripod stands; s = scale; ang = tube angle (radians, 0 = right).
function telescope(x, y, s, ang, o = {}) {
  boilSeed('telescope');
  for (const dx of [-55, 0, 55]) inkLine([[x, y - 120 * s], [x + dx * s, y]], 2.2 * s, PAL.ink, 'ink', 0);
  push(); translate(x, y - 125 * s); rotate(ang);
  paint(rrPts(-70 * s, -16 * s, 200 * s, 32 * s, 8 * s), { wash: '#C9A45C', ink: PAL.ink, sw: 1.1 });
  paint(rrPts(120 * s, -22 * s, 36 * s, 44 * s, 6 * s), { wash: '#8C6A2E', ink: PAL.ink, sw: 1 });
  pop();
}

// The capsule from the future: a pill with a lightning stripe. o: rot, open (0..1, the halves part like a lunchbox),
// glowK (its light), trail (0..1, a light streak behind it when flying), dir (trail direction, radians).
function capsule(x, y, s, o = {}) {
  boilSeed('capsule');
  if (o.trail > .02) {
    const a = o.dir ?? Math.PI, P = [[x, y], [x + Math.cos(a) * 260 * s * o.trail, y + Math.sin(a) * 260 * s * o.trail]];
    paint(strip(P, 60 * s, 4 * s), { wash: EL.cyan, washOp: 180, ink: null });
  }
  if (o.glowK > .02) glow(x, y, 160 * s, EL.cyan, o.glowK);
  push(); translate(x, y); rotate(o.rot || 0);
  const op = clamp(o.open || 0), lift = op * 70 * s, tilt = -op * .9;
  paint(rrPts(-80 * s, -2 * s, 160 * s, 50 * s, 24 * s), { wash: '#E8ECF2', ink: PAL.ink, sw: 1.2 });   // bottom half
  push(); translate(-80 * s, 0); rotate(tilt); translate(80 * s, -lift * .2);
  paint(rrPts(-80 * s, -50 * s, 160 * s, 52 * s, 24 * s), { wash: mixCol('#E8ECF2', '#9AA3B5', op * .7), ink: PAL.ink, sw: 1.2 });   // the lid (greyer once open, so it recedes)
  paint([[-20 * s, -46 * s], [6 * s, -46 * s], [-4 * s, -26 * s], [14 * s, -26 * s], [-18 * s, 0], [-8 * s, -20 * s], [-26 * s, -20 * s]], { wash: EL.yellow, ink: PAL.ink, sw: .8 });
  pop();
  paint(rectPts(-80 * s, -6 * s, 160 * s, 10 * s), { wash: EL.cyan, ink: null });
  pop();
}

// The hologram 小卡 projects (S7): a cyan panel with a future city. k 0..1 opens it from its centre line.
function hologram(cx, cy, w, h, k, t) {
  if (k <= .01) return;
  const hh = h * easeOut(k);
  glow(cx, cy, w * .6, EL.cyan, .5 * k);
  boilSeed('holo');
  paint(rectPts(cx - w / 2, cy - hh / 2, w, hh, 3), { wash: EL.cyan, washOp: 70, ink: EL.cyan, sw: 1 });
  if (k < .6) return;
  for (let i = 0; i < 9; i++) {   // towers
    const bw = w / 11, bx = cx - w / 2 + bw * (i + 1), bh = hh * (.25 + hash(i * 9.1) * .5);
    paint(rectPts(bx, cy + hh / 2 - bh, bw * .7, bh), { wash: '#BFF6FA', washOp: 120, ink: EL.cyan, sw: .6 });
  }
  for (let i = 0; i < 3; i++) {   // flying cars crossing
    const q = frac(t * .4 + i / 3), px = cx - w / 2 + q * w, py = cy - hh * (.15 + i * .1);
    paint(rrPts(px - 16, py - 6, 32, 12, 5), { wash: '#E9FCFF', ink: EL.cyan, sw: .5 });
  }
  for (let i = 0; i < 6; i++) inkLine([[cx - w / 2, cy - hh / 2 + (i + frac(t * 2)) * hh / 6], [cx + w / 2, cy - hh / 2 + (i + frac(t * 2)) * hh / 6]], .4, '#E9FCFF', 'inkfine', 0);
}

// Deep space as seen through the telescope: a dark field, big stars, a ringed planet (S4, S5).
function space(t, o = {}) {
  boilSeed('space');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#0D1030', ink: null });
  for (let i = 0; i < 70; i++) {
    const x = hash(i * 9.7) * W, y = hash(i * 3.9 + 2) * H, s = 4 + hash(i * 6.1) * 10, tw = .6 + .4 * Math.sin(t * 3 + i);
    paint(starPts(x, y, s * tw, .3, 4), { wash: i % 7 ? PAL.cream : '#BFE8FF', ink: null });
  }
  if (o.planet === false) return;
  const px = o.px ?? 1000, py = o.py ?? 560, r = o.pr ?? 150, ring = q => { const P = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * (q + i / 24); P.push([px + Math.cos(a) * r * 2, py + Math.sin(a) * r * .5]); } return P; };
  paint(strip(ring(1), 34, 34), { wash: '#F7D79A', ink: PAL.ink, sw: .8 });   // the back half of the ring
  paint(ellPts(px, py, r, r, 36), { wash: '#E9878F', ink: PAL.ink, sw: 1.1 });
  for (const [dy, w, c] of [[-.45, .82, '#F4A86B'], [.1, .98, '#D9677A'], [.55, .78, '#F4A86B']]) paint(ellPts(px, py + dy * r, r * w, r * .13, 20), { wash: c, ink: null });
  paint(strip(ring(0), 34, 34), { wash: '#F7D79A', ink: PAL.ink, sw: .8 });   // the front half
}
