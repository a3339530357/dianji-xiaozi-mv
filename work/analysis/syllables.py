# 逐字时间：在每句歌词的字幕时间窗里找人声起音点（和声部分 200–4000Hz 的起音），和字数对照，
# 再吸附到 1/8 拍（半拍的一半，约 0.139 秒）网格上。输出给 src/lyrics.js 用。
# 用法：work/.venv/bin/python -I work/analysis/syllables.py work/analysis/music_mono.wav
import sys
import numpy as np
import librosa

LINES = [  # 字幕窗口（秒），字（空格不唱）
    (3.63, 5.37, '漫漫星空宇宙 一望无际'), (5.90, 7.07, '美丽而神秘'), (8.07, 11.47, '高深莫测 多么叫人好奇'),
    (12.53, 14.80, '未来科幻世界 各样机械'), (14.97, 16.17, '我眼界打开'), (17.00, 21.40, '神奇的力量很精彩'),
    (23.47, 27.23, '电击火光 闪闪闪闪 真厉害'), (27.80, 31.50, '摇身一变 变变变变 Electro boy'),
    (32.13, 34.30, '来吧 看看 火星大力拳'), (34.80, 35.20, '呼啦呼啦'), (35.70, 38.00, '小子变身 对付大坏蛋'),
    (39.33, 42.93, '除暴安良 维持治安'), (43.77, 45.50, '呼啦呼啦 小子身手非凡'), (46.03, 46.97, '头脑不简单'),
    (48.20, 50.43, '勇敢又善良'), (52.57, 54.67, '心发热发亮'),
]
T, B0 = 0.5557, 0.024
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
yh = librosa.effects.harmonic(y, margin=2)
hop = 128
S = np.abs(librosa.stft(yh, n_fft=1024, hop_length=hop))
f = librosa.fft_frequencies(sr=sr, n_fft=1024)
band = S[(f >= 200) & (f < 4000)]
o = librosa.onset.onset_strength(S=librosa.amplitude_to_db(band, ref=np.max), sr=sr, hop_length=hop)
ot = librosa.frames_to_time(np.arange(len(o)), sr=sr, hop_length=hop)
pk = librosa.util.peak_pick(o, pre_max=3, post_max=3, pre_avg=8, post_avg=8, delta=0.3, wait=6)
snap = lambda t: B0 + round((t - B0) / (T / 4)) * (T / 4)
for a, b, txt in LINES:
    syl = [c for c in txt.replace('Electro boy', 'EL').split() for c in c] if 'Electro' in txt else [c for c in txt if c != ' ']
    if 'Electro' in txt:
        syl = [c for c in txt.split('Electro')[0] if c != ' '] + ['E', 'lec', 'tro', 'boy']
    lo, hi = a - 0.35, b + 0.1
    cand = [(ot[p], o[p]) for p in pk if lo <= ot[p] < hi]
    # 取最强的 len(syl) 个，再按时间排
    best = sorted(sorted(cand, key=lambda x: -x[1])[:len(syl)])
    times = [round(snap(t), 3) for t, _ in best]
    print(f'{a:6.2f}-{b:5.2f} {len(syl):2d}字 找到{len(cand):2d}个 | ' + ' '.join(f'{s}{t:.2f}' for s, t in zip(syl, times)))
