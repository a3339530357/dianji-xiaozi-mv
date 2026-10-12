// music.js: the song's map. Times in seconds; beats counted from the song's beat 0, the same numbers as STORYBOARD.md.
// bt(n): time of beat n (fractions allowed: bt(42.5) is the off-beat after beat 42). Bars start on beats 2, 6, 10, ...

const bt = n => 0.024 + n * 0.5557;
const sbeat = t => (t - 0.024) / 0.5557;           // song beat position at time t
const isBar = n => ((n - 2) % 4 + 4) % 4 === 0;

// The accents everything big lands on (shakes, flashes, impact frames). Measured in work/analysis.
const HIT = {
  open: 0.024,            // the first hit: lightning splits the black
  gap: 1.82,              // the music drops out for a moment: black
  eyes: 2.44,             // eyes light up in the dark
  kick: 2.80,             // camera pulls back
  crash: 11.69,           // the capsule lands
  zap: 20.58,             // Clawd zaps itself
  hush: 22.42,            // the fill's quietest moment before the chorus
  press: 22.81,           // the button
  drop: bt(42),           // 23.36: the chorus, the thunderbolt
  stomp: 31.70,           // the villain lands
  come: bt(58),           // 32.26: "来吧", the band stops
  punch: bt(61),          // 33.92: the punch
  back: bt(62),           // 34.48: the band slams back in
  heart: bt(94),          // 52.26: the big bass note, the heart lights up
  fade: 57.3,             // the song fades out
};

// Lyrics for the karaoke band: [start, end, line]. Start and end come from the subtitles burned into the source video
// (work/analysis/subs.py). The line lights up character by character across the first part of the window.
const LY = [
  [3.55, 5.37, '漫漫星空宇宙 一望无际'], [5.85, 7.07, '美丽而神秘'], [7.95, 11.47, '高深莫测 多么叫人好奇'],
  [12.25, 14.80, '未来科幻世界 各样机械'], [14.90, 16.17, '我眼界打开'], [16.95, 21.10, '神奇的力量很精彩'],
  [23.36, 27.23, '电击火光 闪闪闪闪 真厉害'], [27.70, 31.50, '摇身一变 变变变变 Electro boy'],
  [32.10, 32.95, '来吧 看看'],                       // "火星大力拳" is painted big in the shot instead (S13)
  [34.48, 35.50, '呼啦呼啦'], [35.60, 38.10, '小子变身 对付大坏蛋'], [39.00, 42.93, '除暴安良 维持治安'],
  [43.60, 45.50, '呼啦呼啦 小子身手非凡'], [45.70, 46.97, '头脑不简单'], [47.95, 50.43, '勇敢又善良'],
  [52.50, 54.67, '心发热发亮'],
];
// Doubled words that get one visual hit per character: [first character's time, step between characters].
// Placed on the eighth-note grid nearest the measured vocal onsets; check them against the audio in a preview clip.
const SYL = {
  shan: [bt(46), BEAT / 2],    // 闪闪闪闪 25.59 …
  bian: [bt(50.5) + BEAT * 2, BEAT / 2],   // 变变变变 ~28.9 …
  hula1: [bt(62), BEAT / 2],   // 呼啦呼啦 34.48 …
  quan: [33.10, (bt(61) - 33.10) / 4],   // 火 星 大 力 拳: five slams from 33.10, the last (拳) on the punch, 33.92
};
