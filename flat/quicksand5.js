// "What if the ground turned into quicksand for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, crack, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const SAND = '#d4a35a', SAND2 = '#b9853f';
// quicksand surface from y=S down, with wobbling ripples
function sand(S, t, { seed = 1, a = 1 } = {}) {
  const r = rng(seed); let s = rect(-40, S, 1160, 1960 - S, SAND, 0, `opacity="${a}"`);
  for (let i = 0; i < 14; i++) { const x = r() * 1080, y = S + 30 + r() * (1920 - S), w = 120 + r() * 220, ph = r() * 6; s += `<ellipse cx="${(x + Math.sin(t * 2 + ph) * 20).toFixed(0)}" cy="${y.toFixed(0)}" rx="${(w * (0.8 + 0.2 * Math.sin(t * 3 + ph))).toFixed(0)}" ry="${(w * 0.12).toFixed(0)}" fill="none" stroke="${SAND2}" stroke-width="6" opacity="${(0.6 * a).toFixed(2)}"/>`; }
  return s;
}
// expanding rings where something sinks
function rings(x, y, t, t0, { w = 260, n = 3 } = {}) {
  if (t < t0) return ''; let s = '';
  for (let i = 0; i < n; i++) { const d = ((t - t0) * 0.9 + i / n) % 1; s += `<ellipse cx="${x}" cy="${y}" rx="${(w * (0.4 + d)).toFixed(0)}" ry="${(w * 0.13 * (0.4 + d)).toFixed(0)}" fill="none" stroke="#8a5a22" stroke-width="7" opacity="${(0.8 * (1 - d)).toFixed(2)}"/>`; }
  return s;
}
const concrete = (S, kCr = 0, t = 0) => rect(-40, S, 1160, 1960 - S, '#9a9ea6') + rect(-40, S, 1160, 16, '#c4c8ce') + [...Array(8)].map((_, i) => rect(i * 150 - 20, S, 6, 1960 - S, '#7a7e86')).join('');
const city = (h0 = 1250) => {
  const r = rng(5); let s = '';
  for (let i = 0; i < 7; i++) { const w = 130 + r() * 90, h = 380 + r() * 420, x = i * 160 - 30, c = ['#e85a4a', '#f2b33a', '#4a8ae0', '#7ac06a', '#e07ab0'][i % 5]; s += rect(x, h0 - h, w, h, c) + [...Array(Math.floor(h / 90))].map((_, j) => rect(x + 20, h0 - h + 30 + j * 90, w - 40, 40, '#ffffff', 4, 'opacity="0.55"')).join(''); }
  return s;
};
// side-view car; y = ground
const car = (x, y, col, s, t, tilt = 0) => g(rect(-230, -200, 460, 120, col, 30) + `<path d="M-140,-198 L-90,-280 L100,-280 L150,-198Z" fill="${col}"/>` + `<path d="M-122,-202 L-82,-268 L0,-268 L0,-202Z M12,-202 L12,-268 L92,-268 L132,-202Z" fill="#1a2230" opacity="0.85"/>` + rect(210, -180, 22, 18, '#ffe9a8', 4) + circ(-130, -62, 62, '#141618') + circ(130, -62, 62, '#141618') + circ(-130, -62, 30, '#b8bec8') + circ(130, -62, 30, '#b8bec8'), `translate(${x} ${y}) rotate(${tilt}) scale(${s})`);
const bus = (x, y, s, tilt = 0) => g(rect(-460, -420, 920, 360, '#f2b33a', 30) + rect(-460, -140, 920, 30, '#c8102e') + [...Array(6)].map((_, i) => rect(-420 + i * 140, -380, 110, 120, '#1a2a40', 10)).join('') + rect(-430, -400, 140, 22, '#1d1f24', 6) + t2(0, -170, 'CITY 12', 44, '#1d1f24', { weight: 900 }) + circ(-300, -62, 62, '#141618') + circ(300, -62, 62, '#141618'), `translate(${x} ${y}) rotate(${tilt}) scale(${s})`);
const tower = (x, base, w, h, col, ang) => g(rect(-w / 2, -h, w, h, col) + rect(-w / 2, -h, w, 24, '#1d1f24', 0, 'opacity="0.25"') + [...Array(Math.floor(h / 80))].map((_, j) => [0, 1, 2].map((k) => rect(-w / 2 + 18 + k * (w - 36) / 3, -h + 40 + j * 80, (w - 36) / 3 - 14, 44, '#dff0ff', 4, 'opacity="0.8"')).join('')).join(''), `translate(${x} ${base}) rotate(${ang})`);
const player = (x, S, s, depth, top, face, pose = 'up', extra = {}) => adult({ ...CROWD[(x | 0) % 6], top, pants: '#f2f4f7', x, y: S + depth, s, face, pose, ...extra });

export async function init() {
  const W = await (await fetch('/work/quicksand5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), ground: wt('ground', 0), quicksand: wt('quicksand', 0), all: wt('all', 0), five: wt('five', 0),
    sidewalk: wt('sidewalk', 2), now: wt('now', 2), sidewalk2: wt('sidewalk', 2, 1), knee: wt('knee', 2), sinking: wt('sinking', 2),
    car: wt('car', 4), drops: wt('drops', 4), doors: wt('doors', 4), bus: wt('bus', 4), windows: wt('windows', 4),
    buildings: wt('buildings', 6), tip: wt('tip', 6), dominoes: wt('dominoes', 6), real: wt('real', 6), japan: wt('japan', 6), nineteen: wt('nineteen', 6),
    soccer: wt('soccer', 8), twenty: wt('twenty', 8), waist: wt('waist', 8), ref: wt('ref', 8), yellow: wt('yellow', 8), card: wt('card', 8),
    good: wt('good', 10), sink: wt('sink', 10), float: wt('float', 10), science: wt('science', 10), bad: wt('bad', 10),
    back: wt('back', 11), solid: wt('solid', 11), still: wt('still', 11),
    pulling: wt('pulling', 12), foot: wt('foot', 12), force: wt('force', 12), lift: wt('lift', 12), car12: wt('car', 12), yeah: wt('yeah', 12), live: wt('live', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  const SY = 1250; // surface line for "you" shots: head (y-503*1.1) stays <= 1020 down to waist depth

  const shots = [
    // 0 hook: street turns to quicksand, you + car start sinking
    [0, (t) => {
      const kQ = seg(t, T.quicksand - 0.1, T.quicksand + 0.15), dep = 150 * clamp((t - T.quicksand) / 3);
      let s = vgrad('#5aa8f0', '#d8eefc', 0, SY) + city(SY);
      s += concrete(SY) + crack(t, 0.05, 540, 1560, 3, '#3a3f4a') + crack(t, T.news, 260, 1700, 8, '#3a3f4a');
      s += car(880, SY + 60 + dep * 1.2, '#c8102e', 0.75, t, 6 * kQ);
      s += adult({ ...YOU, x: 400, y: SY + 40 + dep, s: 1.1, face: t > T.quicksand ? 'open' : 'neutral', pose: t > T.quicksand ? 'up' : 'stand' });
      s += g(sand(SY + 40, t, { seed: 2 }), '', `opacity="${kQ.toFixed(2)}"`) + rings(400, SY + 60, t, T.quicksand, { w: 240 }) + rings(880, SY + 70, t, T.quicksand + 0.1, { w: 300 });
      s += debris(t, T.quicksand, 540, SY + 40, { n: 34, col: '#9a9ea6', spread: 1100, seed: 4, size: 26 });
      s += hit(540, 520, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)) * (1 - seg(t, T.quicksand - 0.15, T.quicksand - 0.05)), '#ff2a3a', -5, 150);
      s += stamp(540, 510, 'GROUND = QUICKSAND', seg(t, T.quicksand - 0.08, T.quicksand + 0.2), '#ff2a3a', -6, 62);
      s += chip(540, 680, 'ALL OF IT', pop(seg(t, T.all - 0.1, T.all + 0.1)) * (1 - seg(t, T.five - 0.12, T.five - 0.02)), { size: 52, col: '#fff', bg: '#141a22' });
      s += chip(540, 680, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += flash(t, 0, 0.6) + flash(t, T.quicksand - 0.05, 0.85);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.news, T.quicksand, T.all, T.five], 0.11), z1: 1, oy: 1200 }), shake(t, [0.03, T.news, T.quicksand, T.five], 34)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 you, knee deep and sinking
    [C[0], (t) => {
      const dep = lerp(70, 220, clamp((t - C[0]) / (C[1] - C[0])));
      let s = vgrad('#5aa8f0', '#d8eefc', 0, SY) + city(SY) + rect(-40, SY - 30, 1160, 40, '#9a9ea6');
      s += adult({ ...YOU, x: 540 + Math.sin(t * 18) * 8, y: SY + dep, s: 1.1, face: 'open', pose: 'up', tilt: Math.sin(t * 12) * 6 });
      s += sand(SY, t, { seed: 3 }) + rings(540, SY + 20, t, C[0], { w: 280 });
      s += debris(t, T.now, 540, SY, { n: 26, col: SAND2, spread: 900, seed: 7, size: 22 });
      s += chip(540, 520, 'IN THE SIDEWALK', pop(seg(t, T.sidewalk2 - 0.2, T.sidewalk2)) * (1 - seg(t, T.knee - 0.12, T.knee - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += hit(540, 530, 'KNEE DEEP', pop(seg(t, T.knee - 0.1, T.knee + 0.1)) * (1 - seg(t, T.sinking - 0.12, T.sinking - 0.02)), '#ff2a3a', -5, 140);
      s += stamp(540, 540, 'SINKING', seg(t, T.sinking - 0.08, T.sinking + 0.2), '#ff2a3a', 6, 110);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, T.now - 0.05, 0.5) + flash(t, T.knee - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.now, T.knee, T.sinking], 0.1), z1: 1.04, oy: 1100 }), shake(t, [T.now, T.knee, T.sinking], 28)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 street: cars to the doors, bus to the windows
    [C[1], (t) => {
      const S = 1180, kC = clamp((t - C[1]) / 0.8), kB = clamp((t - T.bus) / 0.6);
      let s = vgrad('#6ab0f0', '#e2f0fa', 0, S) + city(S);
      s += bus(600, S + 40 + 230 * kB, 0.95, -3 * kB);
      s += car(220, S + 400 + 150 * kC, '#2f6fd6', 0.9, t, -5 * kC) + car(860, S + 420 + 150 * kC, '#2fae6a', 0.9, t, 4 * kC);
      s += sand(S + 40, t, { seed: 5 }) + rings(600, S + 60, t, T.bus, { w: 420 }) + rings(220, S + 440, t, C[1], { w: 260 }) + rings(860, S + 460, t, C[1] + 0.2, { w: 260 });
      s += car(260, 1960 + 160 * kC, '#ffcf3a', 1.2, t, 3 * kC) + sand(1840, t, { seed: 6 });
      s += debris(t, T.drops, 540, S + 400, { n: 36, col: SAND2, spread: 1200, seed: 12, size: 26 }) + debris(t, T.bus + 0.1, 600, S + 60, { n: 30, col: SAND2, spread: 1000, seed: 13, size: 24 });
      s += hit(540, 520, 'TO THE DOORS', pop(seg(t, T.doors - 0.1, T.doors + 0.1)) * (1 - seg(t, T.bus - 0.12, T.bus - 0.02)), '#ff2a3a', -5, 120);
      s += stamp(540, 540, 'BUS: WINDOWS', seg(t, T.windows - 0.1, T.windows + 0.15), '#ff2a3a', 6, 80);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, T.drops - 0.05, 0.7) + flash(t, T.windows - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.car, T.drops, T.doors, T.bus, T.windows], 0.1), z1: 1, oy: 1300 }), shake(t, [T.drops, T.doors, T.bus, T.windows], 32, 5)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 buildings tip like dominoes
    [C[2], (t) => {
      const S = 1450; let s = vgrad('#ff9a4a', '#ffe0a8', 0, S);
      const cols = ['#4a8ae0', '#e85a4a', '#f2b33a', '#7ac06a'];
      for (let i = 0; i < 4; i++) {
        const t0 = T.tip + i * 0.28, k = L.easeOut(clamp((t - t0) / 1.4)), ang = (i % 2 ? 1 : 1) * 24 * k, sinkD = 140 * k;
        s += tower(150 + i * 250, S + 40 + sinkD, 190, 820 - i * 60, cols[i], ang);
        s += debris(t, t0 + 0.4, 150 + i * 250, S, { n: 18, col: '#dff0ff', spread: 800, seed: 20 + i, size: 20 });
      }
      for (let i = 0; i < 6; i++) { const d = Math.max(0, t - T.tip); s += circ(80 + i * 190, S - 20 - d * 30, 60 + d * 70, '#e8d0a8', `opacity="${Math.max(0, 0.6 - d * 0.15).toFixed(2)}"`); }
      s += sand(S, t, { seed: 8 }) + rings(540, S + 40, t, T.tip, { w: 520 });
      s += hit(540, 520, 'TIP OVER', pop(seg(t, T.tip - 0.1, T.tip + 0.1)) * (1 - seg(t, T.dominoes - 0.12, T.dominoes - 0.02)), '#ff2a3a', -5, 140);
      s += stamp(540, 540, 'DOMINOES', seg(t, T.dominoes - 0.1, T.dominoes + 0.15) * (1 - seg(t, T.real - 0.1, T.real)), '#141a22', 6, 100);
      s += stamp(540, 540, "THAT'S REAL", seg(t, T.real - 0.08, T.real + 0.15), '#c8102e', -6, 90);
      s += chip(540, 750, 'NIIGATA, JAPAN 1964', pop(seg(t, T.japan - 0.1, T.japan + 0.1)), { size: 46, col: '#fff', bg: '#141a22' });
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, T.tip - 0.05, 0.7) + flash(t, T.dominoes - 0.05, 0.5) + flash(t, T.real - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.buildings, T.tip, T.dominoes, T.real, T.japan], 0.1), z1: 1, oy: 1300 }), shake(t, [T.tip, T.tip + 0.28, T.tip + 0.56, T.dominoes, T.real], 34, 5)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 soccer: players waist deep, ref gives yellow card
    [C[3], (t) => {
      const k = L.easeOut(clamp((t - C[3]) / 1.2));
      let s = vgrad('#5aa8f0', '#d8eefc', 0, 700) + rect(0, 560, 1080, 140, '#3a4250') + [...Array(30)].map((_, i) => circ(20 + i * 36, 600 + (i % 3) * 30, 14, ['#c8102e', '#ffffff', '#2f6fd6'][i % 3])).join('');
      s += rect(0, 700, 1080, 1220, '#3aa04a') + rect(0, 700, 1080, 1220, SAND, 0, `opacity="${(0.75 * k).toFixed(2)}"`);
      s += rect(380, 760, 320, 120, 'none', 0, 'stroke="#ffffff" stroke-width="8" opacity="0.7"');
      const back = 960, front = 1620;
      for (let i = 0; i < 5; i++) s += player(140 + i * 200, back, 0.55, 150 * k, i % 2 ? '#c8102e' : '#2f6fd6', 'open', 'up', { tilt: Math.sin(t * 10 + i) * 8 });
      s += sand(back, t, { seed: 9, a: 1 });
      for (let i = 0; i < 2; i++) s += player(180 + i * 300, front, 0.8, 210 * k, i ? '#2f6fd6' : '#c8102e', 'open', 'up', { tilt: Math.sin(t * 9 + i) * 8 });
      const kR = pop(seg(t, T.yellow - 0.25, T.yellow)), rx = 840, ry = front + 210 * k;
      s += adult({ ...CROWD[1], top: '#1d1f24', pants: '#1d1f24', x: rx, y: ry, s: 0.8, face: 'tense', pose: kR > 0 ? 'point' : 'stand' });
      if (kR > 0) s += g(rect(-40, -60, 80, 110, '#ffd21a', 8, 'stroke="#1d1f24" stroke-width="4"'), `translate(${rx + 190 * 0.8} ${ry - 470 * 0.8}) rotate(8) scale(${kR})`);
      s += sand(front, t, { seed: 10 }) + rings(540, front + 30, t, C[3], { w: 420 });
      s += chip(540, 470, '22 PLAYERS', pop(seg(t, T.twenty - 0.1, T.twenty + 0.1)) * (1 - seg(t, T.waist - 0.12, T.waist - 0.02)), { size: 46, col: '#fff', bg: '#141a22' });
      s += hit(540, 470, 'WAIST DEEP', pop(seg(t, T.waist - 0.1, T.waist + 0.1)) * (1 - seg(t, T.card - 0.12, T.card - 0.02)), '#ff2a3a', -5, 130);
      s += stamp(540, 470, 'YELLOW CARD', seg(t, T.card - 0.1, T.card + 0.15), '#c8102e', -6, 80);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, T.waist - 0.05, 0.6) + flash(t, T.yellow - 0.05, 0.6, '#ffd21a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.soccer, T.waist, T.ref, T.yellow, T.card], 0.1), z1: 1, oy: 1200 }), shake(t, [T.waist, T.yellow, T.card], 28)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 you stop at the waist: you float
    [C[4], (t) => {
      const dep = lerp(200, 286, L.easeOut(clamp((t - C[4]) / 0.6))) + Math.sin(t * 4) * 6;
      let s = vgrad('#5aa8f0', '#d8eefc', 0, SY) + city(SY) + rect(-40, SY - 30, 1160, 40, '#9a9ea6');
      s += adult({ ...YOU, x: 540, y: SY + dep, s: 1.1, face: t > T.float ? 'smile' : 'open', pose: 'stand', tilt: Math.sin(t * 2) * 4 });
      s += sand(SY, t, { seed: 3 }) + rings(540, SY + 20, t, C[4], { w: 280, n: 2 });
      s += hit(540, 500, 'GOOD NEWS', pop(seg(t, T.good - 0.1, T.good + 0.1)) * (1 - seg(t, T.float - 0.12, T.float - 0.02)), '#2fae6a', -5, 140);
      s += stamp(540, 520, 'YOU FLOAT', seg(t, T.float - 0.1, T.float + 0.15) * (1 - seg(t, T.bad - 0.12, T.bad - 0.02)), '#2fae6a', 5, 110);
      s += chip(540, 720, 'SCIENCE', pop(seg(t, T.science - 0.1, T.science + 0.1)) * (1 - seg(t, T.bad - 0.12, T.bad - 0.02)), { size: 54, col: '#fff', bg: '#2fae6a' });
      s += hit(540, 560, 'BAD NEWS?', pop(seg(t, T.bad - 0.08, T.bad + 0.1)), '#ff2a3a', 4, 150);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, T.float - 0.05, 0.5, '#2fae6a', 0.2) + flash(t, T.bad - 0.05, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [T.good, T.float, T.science, T.bad], 0.1), z1: 1, oy: 1100 }), shake(t, [T.float, T.bad], 26)) + bar(t) + pill('SECOND 5');
    }],
    // 11 ground back: solid, you stuck at the waist
    [C[5], (t) => {
      const dep = 286;
      let s = vgrad('#5aa8f0', '#d8eefc', 0, SY) + city(SY);
      s += adult({ ...YOU, x: 540 + Math.sin(t * 30) * 4 * (1 - seg(t, T.solid, T.solid + 0.6)), y: SY + dep, s: 1.1, face: 'tense', pose: 'up' });
      s += concrete(SY) + crack(t, T.solid - 0.05, 540, SY + 20, 11, '#3a3f4a') + crack(t, T.solid + 0.1, 220, SY + 260, 12, '#3a3f4a');
      s += debris(t, C[5], 540, SY, { n: 40, col: '#c4c8ce', spread: 1200, seed: 15, size: 26 });
      s += stamp(540, 520, 'GROUND: BACK', seg(t, C[5], C[5] + 0.25) * (1 - seg(t, T.solid - 0.1, T.solid)), '#2fae6a', 6, 90);
      s += hit(540, 540, 'SOLID', pop(seg(t, T.solid - 0.08, T.solid + 0.1)), '#141a22', -4, 200);
      s += chip(540, 760, 'STILL IN IT', pop(seg(t, T.still - 0.1, T.still + 0.1)), { size: 56, col: '#fff', bg: '#c8102e' });
      s += flash(t, C[5], 0.95) + flash(t, T.solid - 0.05, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.back, T.solid, T.still], 0.13), z1: 1, oy: 1200 }), shake(t, [C[5], T.solid, T.still], 44, 6)) + pill('GROUND: BACK');
    }],
    // 12 pulling one foot out = lifting a car; you live here now
    [C[6], (t) => {
      let s = vgrad('#5aa8f0', '#d8eefc', 0, SY) + city(SY);
      const strain = t > T.pulling && t < T.yeah ? Math.sin(t * 40) * 6 : 0;
      s += adult({ ...YOU, x: 540 + strain, y: SY + 286 - (t > T.pulling && t < T.yeah ? 6 : 0), s: 1.1, face: t > T.live ? 'neutral' : 'tense', pose: t > T.live ? 'cross' : 'up', tilt: strain });
      s += concrete(SY) + crack(t, C[6] - 0.5, 540, SY + 20, 11, '#3a3f4a');
      const kC = pop(seg(t, T.lift - 0.15, T.lift + 0.1));
      if (kC > 0) s += g(car(0, 0, '#c8102e', 0.6, t, 0), `translate(820 ${(860 - 60 * Math.abs(Math.sin(t * 3))).toFixed(0)}) scale(${kC})`);
      s += chip(330, 500, '1 FOOT', pop(seg(t, T.foot - 0.1, T.foot + 0.1)) * (1 - seg(t, T.yeah - 0.1, T.yeah)), { size: 54, col: '#fff', bg: '#141a22' });
      s += hit(560, 520, '=', pop(seg(t, T.force - 0.1, T.force + 0.1)) * (1 - seg(t, T.yeah - 0.1, T.yeah)), '#ff2a3a', 0, 160);
      s += chip(820, 500, 'A CAR', pop(seg(t, T.car12 - 0.1, T.car12 + 0.1)) * (1 - seg(t, T.yeah - 0.1, T.yeah)), { size: 54, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 520, 'YOU LIVE HERE NOW', seg(t, T.live - 0.1, T.live + 0.15), '#c8102e', -5, 66);
      s += chip(540, 800, 'ALIVE. STUCK.', pop(seg(t, T.live + 0.3, T.live + 0.5)), { size: 50, col: '#fff', bg: '#2fae6a' });
      s += flash(t, C[6], 0.6) + flash(t, T.lift - 0.05, 0.5) + flash(t, T.live - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.pulling, T.foot, T.lift, T.car12, T.live], 0.1), z1: 1, oy: 1200 }), shake(t, [T.lift, T.car12, T.live], 26)) + pill('ALIVE');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['THE OCEAN?', 'YOUR BED?', 'THE OFFICE?', 'THE MALL?', 'THE SKY?', 'YOUR CAR?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 470, 'WHAT', 1, { size: 170 }) + bigText(540, 620, 'TURNS INTO', 1, { size: 110, col: '#ffcf6a' }) + bigText(540, 780, 'QUICKSAND', 1, { size: 150, col: '#ffcf6a' }) + bigText(540, 940, 'NEXT?', 1, { size: 160 });
      s += bigText(540, 1520, opts[i], 1, { size: 120, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
