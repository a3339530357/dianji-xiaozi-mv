// 一帧的时间花在哪：算笔画（JS + 提交给显卡）/ 等显卡画完 / 合成 / PNG 编码 / JPEG 编码
// 用法（在要测的页面所在目录运行，studio.html 取当前目录）：
//   node <本文件> [--t=62] [--n=6]
import puppeteer from 'puppeteer-core';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const t = +(args.t || 62), n = +(args.n || 6);
const win = process.platform === 'win32';
let exe, flags, env = { ...process.env };
if (win) { exe = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; flags = ['--use-angle=d3d11']; }
else {
  const dir = `${homedir()}/.cache/ms-playwright`;
  const shell = readdirSync(dir).filter(d => /^chromium_headless_shell-\d+$/.test(d)).sort().pop();
  exe = `${dir}/${shell}/chrome-headless-shell-linux64/chrome-headless-shell`; flags = ['--use-angle=gl', '--no-sandbox'];
  Object.assign(env, { GALLIUM_DRIVER: 'd3d12', LD_LIBRARY_PATH: '/usr/lib/wsl/lib', MESA_D3D12_DEFAULT_ADAPTER_NAME: 'NVIDIA' });
}
const browser = await puppeteer.launch({
  executablePath: exe, headless: exe.includes('headless-shell') ? 'shell' : true, protocolTimeout: 0, env,
  userDataDir: fileURLToPath(new URL(`../../out/.profiles/diag-${process.platform}`, import.meta.url)),
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', ...flags, '--window-size=1920,1080']
});
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction('window.ready === true', { timeout: 300000 });
console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
console.log('  帧   算笔画   等显卡    合成   PNG编码  JPEG编码   合计(ms)');
for (let i = 0; i < n; i++) {
  const r = await page.evaluate(async tt => {
    const gl = drawingContext, px = new Uint8Array(4), now = () => performance.now();
    const a = now(); T = tt; await redraw(); const b = now();
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); const c = now();
    composite(tt); const d = now();
    outC.toDataURL('image/png'); const e = now();
    outC.toDataURL('image/jpeg', .94); const f = now();
    return [b - a, c - b, d - c, e - d, f - e, e - a];
  }, t + i / 30);
  console.log(`${String(i).padStart(4)} ` + r.map(v => v.toFixed(0).padStart(8)).join(' '));
}
await browser.close();
