# 从原视频烧录字幕里切出每句歌词的起止时间：黄色字幕像素 → 变化点 → 每段一张截图拼成长图（人工读字）
# 用法：work/.venv/bin/python -I work/analysis/subs.py ../27e6953594f9f92b48b56d76cf48dd2d.mp4 work/analysis/subs.png
import sys, subprocess
import numpy as np
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
FPS, X, Y, CW, CH = 30, 30, 618, 760, 60
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'crop={CW}:{CH}:{X}:{Y},fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                     capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, CH, CW, 3).astype(np.int16)
r, g, b = fr[..., 0], fr[..., 1], fr[..., 2]
mask = (r > 200) & (g > 150) & (b < 140) & (r - b > 90)          # 黄字
cnt = mask.reshape(len(fr), -1).sum(1)
segs, cur = [], None
for i in range(len(fr)):
    on = cnt[i] > 150
    if on and cur is not None:
        a = mask[cur[0]:i].mean(0) > .5
        inter, uni = (a & mask[i]).sum(), (a | mask[i]).sum()
        if uni and inter / uni < .55:                                # 字变了
            segs.append((cur[0], i)); cur = (i,)
    elif on:
        cur = (i,)
    elif cur is not None:
        segs.append((cur[0], i)); cur = None
if cur is not None: segs.append((cur[0], len(fr)))
segs = [s for s in segs if s[1] - s[0] >= 6]                         # 去掉 <0.2s 的闪烁

canvas = Image.new('RGB', (CW + 260, CH * len(segs)), (20, 20, 20))
d = ImageDraw.Draw(canvas)
for k, (a, e) in enumerate(segs):
    m = (a + e) // 2
    canvas.paste(Image.fromarray(fr[m].astype(np.uint8)), (260, k * CH))
    d.text((8, k * CH + 20), f'{k:2d}  {a / FPS:6.2f} - {e / FPS:6.2f}', fill=(255, 255, 255))
    print(f'{k:2d}  {a / FPS:6.2f} - {e / FPS:6.2f}')
canvas.save(out)
