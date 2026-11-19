// 声音全部由 WebAudio 现场合成：五声音阶拨弦、战鼓、江潮与短音效。
// 不依赖外部音频文件，首次输入后解锁；浏览器不允许播放时安静失败，不影响游玩。
import { settings } from './store.js';

let ctx = null;
let unlocked = false;
let wanted = null;
let currentName = null;
let source = null;
let bus = null;
const tracks = new Map();

const BGM = new Set(['title', 'overworld', 'battle', 'boss', 'ending']);
const SCALE = [0, 2, 4, 7, 9, 12, 14];
const MOODS = {
  title: { root: 50, bpm: 66, bars: 12, drums: 0, wind: 0.22, color: [0, 5, 7, 4, 2, 7, 9, 7] },
  overworld: { root: 48, bpm: 78, bars: 12, drums: 1, wind: 0.12, color: [0, 4, 7, 9, 7, 4, 2, 0] },
  battle: { root: 45, bpm: 112, bars: 16, drums: 2, wind: 0.08, color: [0, 2, 4, 2, 7, 4, 2, 0] },
  boss: { root: 43, bpm: 132, bars: 16, drums: 3, wind: 0.1, color: [0, 4, 7, 11, 7, 4, 0, 2] },
  ending: { root: 48, bpm: 58, bars: 10, drums: 0, wind: 0.18, color: [0, 7, 4, 2, 0, 4, 7, 9] },
};

const musicVolume = () => (settings.mute ? 0 : settings.music * 0.34);
const sfxVolume = () => (settings.mute ? 0 : settings.sound);
const midi = (n) => 440 * (2 ** ((n - 69) / 12));

function makeBuffer(seconds = 1) {
  return ctx.createBuffer(2, Math.max(1, Math.floor(ctx.sampleRate * seconds)), ctx.sampleRate);
}

function addPluck(ch, time, freq, dur, amp, pan = 0, bright = 1) {
  const sr = ctx.sampleRate;
  const start = Math.max(0, Math.floor(time * sr));
  const n = Math.max(1, Math.floor(dur * sr));
  const l = ch[0], r = ch[1];
  const gl = amp * (1 - Math.max(0, pan)), gr = amp * (1 + Math.min(0, pan));
  for (let i = 0; i < n && start + i < l.length; i += 1) {
    const t = i / sr;
    const env = Math.exp(-5.6 * t / dur) * Math.min(1, t * 180);
    const x = (Math.sin(6.283185 * freq * t)
      + 0.42 * bright * Math.sin(6.283185 * freq * 2.004 * t) * Math.exp(-2.4 * t)
      + 0.18 * bright * Math.sin(6.283185 * freq * 3.01 * t) * Math.exp(-3.2 * t)) * env;
    l[start + i] += x * gl;
    r[start + i] += x * gr;
  }
}

function addBell(ch, time, freq, dur, amp, pan = 0) {
  const sr = ctx.sampleRate;
  const start = Math.max(0, Math.floor(time * sr));
  const n = Math.max(1, Math.floor(dur * sr));
  for (let i = 0; i < n && start + i < ch[0].length; i += 1) {
    const t = i / sr;
    const env = Math.exp(-3.6 * t / dur) * Math.min(1, t * 90);
    const x = (Math.sin(6.283185 * freq * t) + 0.35 * Math.sin(6.283185 * freq * 2.71 * t)
      + 0.14 * Math.sin(6.283185 * freq * 5.08 * t)) * env * amp;
    ch[0][start + i] += x * (1 - pan);
    ch[1][start + i] += x * (1 + pan);
  }
}

function addDrum(ch, time, strength = 1) {
  const sr = ctx.sampleRate;
  const start = Math.max(0, Math.floor(time * sr));
  const n = Math.floor(0.34 * sr);
  let seed = 17 + Math.floor(time * 1000);
  for (let i = 0; i < n && start + i < ch[0].length; i += 1) {
    const t = i / sr;
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = (seed / 4294967296) * 2 - 1;
    const env = Math.exp(-13 * t) * Math.min(1, t * 240);
    const body = Math.sin(6.283185 * (72 - t * 86) * t) * Math.exp(-8 * t);
    const x = (body * 0.8 + noise * 0.16 * Math.exp(-24 * t)) * env * strength * 0.36;
    ch[0][start + i] += x;
    ch[1][start + i] += x;
  }
}

function addWind(ch, seconds, level) {
  const sr = ctx.sampleRate;
  const n = Math.min(ch[0].length, Math.floor(seconds * sr));
  let seed = 91;
  let lp = 0;
  for (let i = 0; i < n; i += 1) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const white = (seed / 4294967296) * 2 - 1;
    lp += (white - lp) * 0.012;
    const t = i / sr;
    const env = (0.55 + 0.45 * Math.sin(6.283185 * 0.08 * t)) * level;
    ch[0][i] += lp * env;
    ch[1][i] += lp * env * 0.93;
  }
}

function makeTrack(name) {
  const mood = MOODS[name] ?? MOODS.overworld;
  const beat = 60 / mood.bpm;
  const duration = beat * 4 * mood.bars;
  const buffer = makeBuffer(duration);
  const ch = [buffer.getChannelData(0), buffer.getChannelData(1)];
  addWind(ch, duration, mood.wind);
  for (let bar = 0; bar < mood.bars; bar += 1) {
    const at = bar * beat * 4;
    if (mood.drums > 0) {
      addDrum(ch, at, mood.drums >= 2 ? 0.8 : 0.45);
      addDrum(ch, at + beat * 2, mood.drums >= 3 ? 0.95 : 0.55);
      if (mood.drums >= 3) addDrum(ch, at + beat * 3.25, 0.42);
    }
    const color = mood.color;
    const base = mood.root + SCALE[color[bar % color.length] % SCALE.length];
    addPluck(ch, at, midi(base - 12), beat * 2.8, 0.12, -0.22, 0.7);
    if (bar % 3 === 0) addBell(ch, at + beat * 0.15, midi(base + 12), beat * 3.1, 0.06, 0.28);
    for (let step = 0; step < 8; step += 1) {
      const tone = mood.root + 12 + SCALE[color[(bar + step) % color.length] % SCALE.length];
      const delay = (step * beat) / 2 + (step % 2 ? beat * 0.06 : 0);
      const amp = step === 0 ? 0.12 : step % 2 ? 0.045 : 0.075;
      addPluck(ch, at + delay, midi(tone + (step === 7 ? 12 : 0)), beat * (step % 3 === 0 ? 2.4 : 1.2), amp, step % 2 ? 0.25 : -0.25, 0.9);
    }
    if (mood.drums >= 2 && bar % 2 === 1) addPluck(ch, at + beat * 3.5, midi(mood.root - 5), beat * 0.9, 0.13, 0, 1.2);
  }
  const fade = Math.floor(ctx.sampleRate * 0.08);
  for (let c = 0; c < 2; c += 1) {
    const d = ch[c];
    for (let i = 0; i < fade; i += 1) {
      const k = i / fade;
      d[i] *= k;
      d[d.length - 1 - i] *= k;
    }
  }
  return buffer;
}

function fadeBus(to, time = 0.9) {
  if (!ctx || !bus) return;
  const t = ctx.currentTime;
  bus.gain.cancelScheduledValues(t);
  bus.gain.setValueAtTime(bus.gain.value, t);
  bus.gain.linearRampToValueAtTime(to, t + time);
}

function startWanted() {
  if (!unlocked || !ctx || !wanted || currentName === wanted) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const oldBus = bus;
  const oldSource = source;
  if (oldBus) fadeBus(0, 0.85);
  if (oldSource) {
    setTimeout(() => {
      try { oldSource.stop(); } catch {}
      try { oldBus?.disconnect(); } catch {}
    }, 950);
  }
  if (!tracks.has(wanted)) tracks.set(wanted, makeTrack(wanted));
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = tracks.get(wanted);
  src.loop = true;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(musicVolume(), ctx.currentTime + 1.1);
  src.connect(gain).connect(ctx.destination);
  src.start();
  source = src;
  bus = gain;
  currentName = wanted;
}

function tone(freq, dur, { type = 'sine', gain = 0.18, slide = 1, delay = 0 } = {}) {
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain * sfxVolume(), t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + dur + 0.03);
}

function noiseBurst(dur, { gain = 0.2, freq = 1200, q = 0.8, delay = 0 } = {}) {
  const t = ctx.currentTime + delay;
  const n = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let seed = 1337 + Math.floor(t * 1000);
  for (let i = 0; i < n; i += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    data[i] = ((seed / 4294967296) * 2 - 1) * Math.exp(-4.8 * (i / n));
  }
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();
  src.buffer = buffer;
  filter.type = 'bandpass'; filter.frequency.value = freq; filter.Q.value = q;
  g.gain.value = gain * sfxVolume();
  src.connect(filter).connect(g).connect(ctx.destination);
  src.start(t);
}

function sfx(name, { volume = 1, rate = 1 } = {}) {
  if (!ctx || !unlocked || settings.mute || !sfxVolume()) return;
  const v = Math.max(0, volume);
  switch (name) {
    case 'click': tone(720 * rate, 0.07, { type: 'triangle', gain: 0.08 * v }); break;
    case 'coin': tone(1250 * rate, 0.09, { type: 'triangle', gain: 0.12 * v }); tone(1740 * rate, 0.14, { type: 'sine', gain: 0.08 * v, delay: 0.045 }); break;
    case 'hit': noiseBurst(0.14, { gain: 0.2 * v, freq: 900 * rate }); tone(150 * rate, 0.1, { gain: 0.13 * v, slide: 0.65 }); break;
    case 'crit': noiseBurst(0.22, { gain: 0.28 * v, freq: 1600 * rate }); tone(120 * rate, 0.18, { type: 'sawtooth', gain: 0.16 * v, slide: 0.45 }); break;
    case 'heavy': noiseBurst(0.35, { gain: 0.32 * v, freq: 380 * rate, q: 0.5 }); tone(68 * rate, 0.34, { gain: 0.22 * v, slide: 0.6 }); break;
    case 'thud': tone(92 * rate, 0.12, { gain: 0.1 * v, slide: 0.72 }); break;
    case 'ke': tone(880 * rate, 0.18, { type: 'triangle', gain: 0.13 * v }); tone(1320 * rate, 0.24, { type: 'sine', gain: 0.1 * v, delay: 0.05 }); break;
    case 'heal': tone(660 * rate, 0.3, { type: 'sine', gain: 0.11 * v }); tone(990 * rate, 0.38, { type: 'sine', gain: 0.08 * v, delay: 0.09 }); break;
    case 'skill': tone(420 * rate, 0.22, { type: 'triangle', gain: 0.1 * v, slide: 1.5 }); noiseBurst(0.18, { gain: 0.1 * v, freq: 2200 }); break;
    case 'step': noiseBurst(0.055, { gain: 0.04 * v, freq: 260 * rate, q: 0.5 }); break;
    case 'quest': tone(528 * rate, 0.45, { type: 'triangle', gain: 0.12 * v }); tone(792 * rate, 0.55, { type: 'sine', gain: 0.09 * v, delay: 0.1 }); break;
    case 'levelup': [0, 0.12, 0.24, 0.4].forEach((d, i) => tone((523 + [0, 131, 196, 262][i]) * rate, 0.42, { type: 'triangle', gain: 0.1 * v, delay: d })); break;
    case 'victory': [0, 0.13, 0.26, 0.42].forEach((d, i) => tone((392 + [0, 98, 196, 294][i]) * rate, 0.55, { type: 'triangle', gain: 0.11 * v, delay: d })); break;
    case 'defeat': tone(196 * rate, 0.6, { type: 'sawtooth', gain: 0.13 * v, slide: 0.5 }); break;
    case 'encounter': noiseBurst(0.42, { gain: 0.22 * v, freq: 260, q: 0.4 }); tone(74 * rate, 0.5, { gain: 0.18 * v, slide: 0.8 }); break;
    case 'portal': tone(340 * rate, 0.8, { type: 'sine', gain: 0.1 * v, slide: 1.8 }); noiseBurst(0.7, { gain: 0.1 * v, freq: 1500 }); break;
    case 'telegraph': tone(220 * rate, 0.28, { type: 'square', gain: 0.09 * v, delay: 0.02 }); tone(330 * rate, 0.35, { type: 'triangle', gain: 0.1 * v, delay: 0.26 }); break;
    case 'transform': tone(260 * rate, 0.5, { type: 'sawtooth', gain: 0.1 * v, slide: 2 }); noiseBurst(0.45, { gain: 0.14 * v, freq: 1800 }); break;
    case 'firefx': noiseBurst(0.55, { gain: 0.2 * v, freq: 700 * rate, q: 0.35 }); tone(110 * rate, 0.4, { gain: 0.1 * v, slide: 0.6 }); break;
    case 'waterfx': noiseBurst(0.5, { gain: 0.15 * v, freq: 1100 * rate, q: 0.25 }); break;
    case 'fan1': tone(240 * rate, 0.55, { gain: 0.08 * v, slide: 1.8 }); noiseBurst(0.55, { gain: 0.15 * v, freq: 1700 }); break;
    case 'fan2': tone(300 * rate, 0.7, { gain: 0.08 * v, slide: 2.2 }); noiseBurst(0.7, { gain: 0.17 * v, freq: 1300 }); break;
    case 'fan3': tone(360 * rate, 0.85, { gain: 0.08 * v, slide: 2.5 }); noiseBurst(0.8, { gain: 0.18 * v, freq: 900 }); break;
    case 'combo': tone(990 * rate, 0.09, { type: 'square', gain: 0.07 * v }); tone(1320 * rate, 0.12, { type: 'triangle', gain: 0.08 * v, delay: 0.06 }); break;
    default: tone(440 * rate, 0.1, { gain: 0.05 * v });
  }
}

export const audio = {
  unlock() {
    if (unlocked) return;
    unlocked = true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume().catch(() => {});
    } catch { ctx = null; }
    startWanted();
  },
  music(name) {
    if (!BGM.has(name)) return;
    wanted = name;
    startWanted();
  },
  sfx,
  refresh() {
    if (settings.mute) fadeBus(0, 0.15);
    else if (bus) fadeBus(musicVolume(), 0.2);
  },
};

for (const type of ['pointerdown', 'keydown']) {
  window.addEventListener(type, () => audio.unlock(), { once: true, capture: true });
}
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend().catch(() => {});
  else if (unlocked) ctx.resume().catch(() => {});
});
