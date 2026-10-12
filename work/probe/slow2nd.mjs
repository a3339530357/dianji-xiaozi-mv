// 为什么第二帧起变慢：同一帧反复重画，分别测"不合成"和"每帧都合成到 2D 画布"两种情况（llvmpipe，本地复现云端）
// 用法：node work/probe/slow2nd.mjs [loopName]
import puppeteer from 'puppeteer-core';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const loop = process.argv[2] || 'b_fsBleed';
const dir = `${homedir()}/.cache/ms-playwright`, shell = readdirSync(dir).filter(d => /^chromium_headless_shell-\d+$/.test(d)).sort().pop();
const browser = await puppeteer.launch({
  executablePath: `${dir}/${shell}/chrome-headless-shell-linux64/chrome-headless-shell`, headless: 'shell', protocolTimeout: 0,
  userDataDir: fileURLToPath(new URL('../../out/.profiles/diag-slow2nd', import.meta.url)),
  args: ['--no-sandbox', '--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=gl-egl', '--window-size=1920,1080', ...(process.env.EXTRA ? process.env.EXTRA.split(' ') : [])]
});
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'load', timeout: 300000 });
await page.waitForFunction('window.ready === true', { timeout: 300000 });
console.log(await page.evaluate(() => window.gpuInfo()));
const r = await page.evaluate(async name => {
  window.LOOP = LOOPS[name];
  const gl = drawingContext, px = new Uint8Array(4), out = [];
  const one = async (comp, label) => {
    const a = performance.now(); T = .1; await redraw(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const b = performance.now(); if (comp) composite(.1); const c = performance.now();
    out.push(`${label} draw ${Math.round(b - a)} comp ${Math.round(c - b)}`);
  };
  for (let i = 0; i < 3; i++) await one(false, 'no-composite');
  for (let i = 0; i < 3; i++) await one(true, 'composite');
  return out;
}, loop);
console.log(r.join('\n'));
await browser.close();
