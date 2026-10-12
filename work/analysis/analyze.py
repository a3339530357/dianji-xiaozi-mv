# 音乐分析：BPM、节拍、强拍（小节第一拍）、重音、能量段落、静音/断点
# 用法：work/.venv/bin/python -I work/analysis/analyze.py work/analysis/music_mono.wav
import sys
import numpy as np
import librosa

path = sys.argv[1]
y, sr = librosa.load(path, sr=22050, mono=True)
dur = len(y) / sr
hop = 256
print(f'时长 {dur:.3f}s  sr {sr}')

# ---- 节拍 ----
y_h, y_p = librosa.effects.hpss(y)
oenv = librosa.onset.onset_strength(y=y_p, sr=sr, hop_length=hop, aggregate=np.median)
tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=sr, hop_length=hop, tightness=400)
bt = librosa.frames_to_time(beats, sr=sr, hop_length=hop)
tempo = float(np.atleast_1d(tempo)[0])
print(f'\nlibrosa BPM {tempo:.2f}  节拍数 {len(bt)}')
# 用等间隔网格拟合：bt ≈ b0 + n*T
n = np.arange(len(bt))
T, b0 = np.polyfit(n, bt, 1)
res = bt - (b0 + n * T)
print(f'线性拟合：拍长 {T:.4f}s = {60 / T:.2f} BPM，第 0 拍 {b0:.3f}s，残差 max {np.abs(res).max() * 1000:.0f}ms / std {res.std() * 1000:.0f}ms')

# 自相关再确认 BPM
ac_t = librosa.feature.tempo(onset_envelope=oenv, sr=sr, hop_length=hop, aggregate=None)
print('分段 BPM 中位数', np.round(np.median(ac_t), 2))

# ---- 频带能量（低频=底鼓，中频=军鼓/人声，高频=镲） ----
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))
f = librosa.fft_frequencies(sr=sr, n_fft=2048)
def band(lo, hi):
    return S[(f >= lo) & (f < hi)].sum(axis=0)
low, mid, high = band(30, 150), band(150, 2500), band(5000, 11000)
ft = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)

def at(sig, t, w=0.06):
    m = (ft >= t - 0.01) & (ft < t + w)
    return sig[m].max() if m.any() else 0

# 强拍相位：每拍低频能量按 mod 4 累加
lowb = np.array([at(low, t) for t in bt])
midb = np.array([at(mid, t) for t in bt])
for name, v in (('低频(底鼓)', lowb), ('中频(军鼓)', midb)):
    ph = [v[k::4].mean() for k in range(4)]
    print(f'{name} 按拍号 mod4 平均：' + '  '.join(f'{k}:{p / max(ph):.2f}' for k, p in enumerate(ph)))

# ---- 重音（大鼓点 / 重击）：onset 强度峰值，取全局前若干 ----
oenv_full = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
peaks = librosa.util.peak_pick(oenv_full, pre_max=8, post_max=8, pre_avg=20, post_avg=20, delta=0.5, wait=10)
pt = librosa.frames_to_time(peaks, sr=sr, hop_length=hop)
pv = oenv_full[peaks]
top = np.argsort(-pv)[:40]
print('\n最强的 40 个重音（时间s / 强度 / 最近拍号 / 偏差ms）：')
for i in sorted(top):
    k = int(round((pt[i] - b0) / T))
    print(f'  {pt[i]:6.2f}  {pv[i]:5.1f}  拍{k:3d}  {(pt[i] - (b0 + k * T)) * 1000:+4.0f}')

# ---- 能量曲线：每半秒 RMS（dB） ----
rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=hop)[0]
rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
print('\n每 1 秒 RMS(dB) / 低频 / 高频（相对值）：')
row = []
for s in range(int(np.ceil(dur))):
    m = (rt >= s) & (rt < s + 1)
    db = 20 * np.log10(rms[m].mean() + 1e-9)
    lo = low[(ft >= s) & (ft < s + 1)].mean() / low.mean()
    hi = high[(ft >= s) & (ft < s + 1)].mean() / high.mean()
    row.append(f'{s:2d}s {db:5.1f} {lo:4.2f} {hi:4.2f}')
for i in range(0, len(row), 4):
    print('   '.join(row[i:i + 4]))

# ---- 断点：短时 RMS 骤降（<0.15s 窗口） ----
print('\n能量骤降点（可能是停顿 / 断拍）：')
r_db = 20 * np.log10(rms + 1e-9)
smooth = np.convolve(r_db, np.ones(9) / 9, mode='same')
base = np.convolve(r_db, np.ones(200) / 200, mode='same')
dip = smooth - base
cand = librosa.util.peak_pick(-dip, pre_max=40, post_max=40, pre_avg=40, post_avg=40, delta=3, wait=40)
for c in cand:
    if dip[c] < -6:
        print(f'  {rt[c]:6.2f}s  低于周围 {-dip[c]:.1f} dB')

# ---- 段落：基于色度+MFCC 的自相似分段 ----
chroma = librosa.feature.chroma_cqt(y=y_h, sr=sr, hop_length=512)
mfcc = librosa.feature.mfcc(y=y, sr=sr, hop_length=512, n_mfcc=13)
feat = np.vstack([librosa.util.normalize(chroma, axis=1), librosa.util.normalize(mfcc, axis=1)])
beat512 = librosa.time_to_frames(bt, sr=sr, hop_length=512)
fs = librosa.util.sync(feat, beat512)
for k in (6, 8):
    bounds = librosa.segment.agglomerative(fs, k)
    bt_ext = np.concatenate([[0], bt])
    bts = [bt_ext[min(b, len(bt_ext) - 1)] for b in bounds]
    print(f'\n自相似分 {k} 段，边界：' + ' '.join(f'{b:.2f}' for b in bts))

np.savez('work/analysis/beats.npz', bt=bt, T=T, b0=b0, pt=pt, pv=pv)
