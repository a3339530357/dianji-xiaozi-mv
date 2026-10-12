// common.js: the rooftop set that the opening and the ending share, and small helpers the chapters use.

// The roof and who stands where on it (world px; the default camera frames 0..1920 × -70..1010).
const ROOF = { x0: 520, x1: 1400, y: 780 };
const SPOT = { clawd: [860, 780], kit: [610, 780], scope: [1090, 780], crash: [1270, 780] };   // the eyepiece is at the scope's lower-left end, by Clawd

// Sky, stars, moon, milky way, the town behind, the roof, the telescope. o: stars (how many are lit, or popAt),
// milky (0..1), dawn (0..1), vortex (0..1), lit (town windows 0..1), scope (false = no telescope), scopeAng.
function rooftop(t, o = {}) {
  sky(t, { dawn: o.dawn, vortex: o.vortex });
  stars(t, { count: o.stars, popAt: o.popAt, fade: o.dawn });
  if (o.milky) milkyWay(o.milky);
  if (o.moon !== false) moon(960, -500, 74, { a: 1 - (o.dawn || 0) });
  town(t, { y: 1090, lit: o.lit ?? .3, glowWin: o.glowWin });
  roof(ROOF.x0, ROOF.x1, ROOF.y);
  if (o.scope !== false) telescope(SPOT.scope[0], SPOT.scope[1], 1, o.scopeAng ?? -.55);
}

// Full-frame screen-space wash (darkness, tints), drawn after camEnd().
function cover(col, a) { if (a > .005) paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, washOp: 255 * clamp(a), ink: null }); }

// Screen position of a world point under the camera that was just used (LAST_CAM survives camEnd()).
const scr = (x, y) => toScreen(x, y, LAST_CAM);
