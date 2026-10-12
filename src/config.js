// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the song's tempo, measured (work/analysis/analyze.py): 107.97 BPM, one beat = 0.5557 s, very steady.
//   offset:   the time of a downbeat, so beatN(t) % 4 === 0 on every bar line. The song's beat 0 is at 0.024 s and its
//             bars start on beats 2, 6, 10, ... (the storyboard counts beats from the song's beat 0: see bt() in music.js).
const PROJECT = { duration: 58.35, bpm: 60 / 0.5557, offset: 0.024 + 2 * 0.5557, audio: 'assets/music.m4a' };
