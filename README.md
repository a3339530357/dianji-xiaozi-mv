# 《电击小子》卡点动画 MV

用 Claude Code 制作的《电击小子》主题曲卡点动画。主角是 Clawd，装扮成电击小子。分镜见 [STORYBOARD.md](STORYBOARD.md)。

- 引擎基于 [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)（MIT，见 `LICENSE-ClaudeAnimationBase`）：p5.js + p5.brush 手绘笔刷，用无界面 Chrome 逐帧渲染，再用 ffmpeg 合成。
- 渲染在 GitHub Actions 上进行（`.github/workflows/`）。
- 配乐有版权，仓库里只放加密版 `assets/music.m4a.gpg`，只有 Actions 用仓库 Secret 解密后用来配音。

## 本地预览

```bash
npm install
node render.mjs --sheet=1,3,5 --out=out/check/a.jpg                    # 有显卡（WSL 自动走 d3d12）
node render.mjs --soft-gl --sheet=1,3,5 --out=out/check/a.jpg          # 没有显卡
```
