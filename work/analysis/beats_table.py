# 逐拍特征表：每拍的低/中/高频能量、正拍与反拍（半拍）起音强度、和声变化，用于判断强拍和段落
# 用法：work/.venv/bin/python -I work/analysis/beats_table.py work/analysis/music_mono.wav
import sys
import numpy as np
import librosa

y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
d = np.load('work/analysis/beats.npz')
T, b0 = float(d['T']), float(d['b0'])
hop = 256
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))
f = librosa.fft_frequencies(sr=sr, n_fft=2048)
ft = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)
band = lambda lo, hi: S[(f >= lo) & (f < hi)].sum(axis=0)
low, mid, high = band(30, 120), band(150, 2500), band(5000, 11000)
oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
y_h = librosa.effects.harmonic(y)
chroma = librosa.feature.chroma_cqt(y=y_h, sr=sr, hop_length=hop)

def win(sig, t, a=-.03, b=.08):
    m = (ft >= t + a) & (ft < t + b)
    return sig[..., m]

nb = int((len(y) / sr - b0) / T)
rows, prev = [], None
for n in range(nb):
    t = b0 + n * T
    L, M, Hh = win(low, t).max(), win(mid, t).max(), win(high, t).max()
    on, off = win(oenv, t).max(), win(oenv, t + T / 2).max()
    c = win(chroma, t, 0, T).mean(axis=1)
    nov = 0 if prev is None else 1 - np.dot(c, prev) / (np.linalg.norm(c) * np.linalg.norm(prev) + 1e-9)
    prev = c
    rows.append((n, t, L, M, Hh, on, off, nov))
R = np.array(rows)
for k in (2, 3, 4, 5, 6, 7):
    R[:, k] /= np.percentile(R[:, k], 90)
bar = lambda v, w=6: '#' * int(round(min(v, 1.5) * w))
print(' 拍   时间   低频      中频      高频      正拍起音  反拍起音  和声变化')
for n, t, L, M, Hh, on, off, nov in R:
    mark = ' <' if int(n) % 4 == 2 else ''
    print(f'{int(n):3d} {t:6.2f}  {bar(L):9s} {bar(M):9s} {bar(Hh):9s} {bar(on):9s} {bar(off):9s} {bar(nov):9s}{mark}')
print('\n和声变化按 mod4 平均：', [round(float(R[int(k)::4, 7].mean()), 3) for k in range(4)])
print('低频按 mod4 平均：', [round(float(R[int(k)::4, 2].mean()), 3) for k in range(4)])
