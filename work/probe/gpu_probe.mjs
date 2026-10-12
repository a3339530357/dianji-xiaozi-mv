// Chrome 的 WebGL 落到哪块显卡上：逐个参数组合打印渲染器名
import { chromium } from '/home/a33511/project/testt/china-5000-anim/node_modules/playwright-core/index.mjs';
const exes = { shell: process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1237/chrome-headless-shell-linux64/chrome-headless-shell', chrome: '/usr/bin/google-chrome' };
const base = ['--no-sandbox', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--enable-unsafe-webgpu'];
const flags = { 'angle-gl': ['--use-angle=gl'], 'angle-gl-egl': ['--use-angle=gl-egl'], 'angle-vulkan': ['--use-angle=vulkan', '--enable-features=Vulkan'] };
for (const [en, exe] of Object.entries(exes)) for (const [fn, f] of Object.entries(flags)) {
  let b;
  try {
    b = await chromium.launch({ executablePath: exe, headless: true, args: [...base, ...f], env: { ...process.env } });
    const p = await b.newPage();
    const info = await p.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return 'no WebGL';
      const e = gl.getExtension('WEBGL_debug_renderer_info');
      return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    });
    console.log(`${en.padEnd(7)} ${fn.padEnd(13)} ${info}`);
  } catch (e) { console.log(`${en.padEnd(7)} ${fn.padEnd(13)} FAILED ${e.message.split('\n')[0]}`); }
  finally { await b?.close(); }
}
