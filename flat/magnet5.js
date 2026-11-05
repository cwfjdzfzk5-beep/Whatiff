// "What if all steel turned magnetic for five seconds?" — HYPE format (countdown cards, hard cuts, shake/flash/punch).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const fin = (s, v = 0.45) => s + grade('#0b1a2e', '#2e1a0b', 0.1) + vignette(v);
const BLUE = '#4ad8ff';
const car = (x, y, col, s = 1, rot = 0) => g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` + `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#1a2230" opacity="0.85"/>` + circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#8a8e94') + circ(120, 0, 16, '#8a8e94') + rect(190, -70, 20, 16, '#ffe9a8', 4), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const post = (x, y, h, bend = 0, col = '#5a6270') => `<path d="M${x},${y} Q${x},${y - h * 0.6} ${x + bend},${y - h}" stroke="${col}" stroke-width="16" fill="none" stroke-linecap="round"/>` + circ(x + bend, y - h, 22, '#ffe9a8');
// animated magnetic field rings around (cx,cy)
const field = (t, cx, cy, k, { n = 4, r0 = 120, col = BLUE } = {}) => { if (k <= 0) return ''; let s = ''; for (let i = 0; i < n; i++) { const r = r0 + i * 70 + ((t * 160) % 70); s += `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.5}" ry="${r}" fill="none" stroke="${col}" stroke-width="6" stroke-dasharray="26 18" stroke-dashoffset="${-t * 300}" opacity="${(0.75 * k * (1 - i / n)).toFixed(3)}"/>`; } return s; };
const sparks = (t, t0, x, y, seed = 1, col = '#ffe27a') => { const d = t - t0; if (d < 0 || d > 0.5) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < 16; i++) { const a = r() * 6.283, v = 300 + r() * 600; s += `<line x1="${x + Math.cos(a) * v * d * 0.6}" y1="${y + Math.sin(a) * v * d * 0.6}" x2="${x + Math.cos(a) * v * d}" y2="${y + Math.sin(a) * v * d}" stroke="${col}" stroke-width="6" stroke-linecap="round" opacity="${1 - d / 0.5}"/>`; } return s; };
const street = (sky = ['#7ab0e8', '#cfe2f4']) => {
  let s = vgrad(sky[0], sky[1], 0, 1000); const r = rng(4); let x = -40;
  while (x < 1120) { const w = 150 + r() * 130, h = 380 + r() * 380, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8', '#9ac0a0'][Math.floor(r() * 5)]; s += rect(x, 1000 - h, w, h, c); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, 1000 - h + 22 + j * 80, 30, 44, '#2a3a52', 3, 'opacity="0.75"'); x += w + 8; }
  return s + rect(0, 1000, 1080, 920, '#5a5e66') + rect(0, 1000, 1080, 40, '#9a9ea6') + [...Array(7)].map((_, i) => rect(i * 170 + 20, 1460, 110, 16, '#f2f2ea', 4)).join('');
};
const kitchen = () => vgrad('#fff3df', '#ffd9a8', 0, 1500) + rect(0, 1500, 1080, 420, '#d9b88a') + [...Array(6)].map((_, i) => rect(i * 190 - 20, 1500, 4, 420, '#c09a6a')).join('') + rect(60, 520, 300, 240, '#9ad0ff', 10, 'stroke="#ffffff" stroke-width="12"');
const fridge = (x, y) => rect(x - 170, y - 900, 340, 900, '#e8ecf2', 24, 'stroke="#b8c0cc" stroke-width="6"') + rect(x - 170, y - 600, 340, 8, '#b8c0cc') + rect(x - 140, y - 840, 14, 160, '#9aa3b2', 6) + rect(x - 140, y - 540, 14, 220, '#9aa3b2', 6);
const coin = (x, y, rot = 0, s = 1) => g(`<ellipse cx="0" cy="0" rx="${26 * Math.abs(Math.cos(rot)) + 6}" ry="26" fill="#d98a3a" stroke="#8a4a1a" stroke-width="4"/>`, `translate(${x} ${y}) scale(${s})`);
const keyring = (x, y, rot = 0, s = 1) => g(circ(0, 0, 34, 'none', 'stroke="#c8ccd4" stroke-width="10"') + g(circ(0, 60, 22, '#d9b84a') + rect(-8, 70, 16, 90, '#d9b84a', 4) + rect(8, 120, 18, 12, '#d9b84a') + rect(8, 140, 14, 12, '#d9b84a'), 'rotate(-25)') + g(rect(-40, 40, 70, 110, '#1d222c', 14) + circ(-5, 80, 10, '#c8102e'), 'rotate(30)'), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const cart = (x, y, s = 1, rot = 0, col = '#c8ccd4') => g(`<path d="M-110,-150 L110,-150 L85,-30 L-85,-30Z" fill="none" stroke="${col}" stroke-width="9" stroke-linejoin="round"/>` + [...Array(5)].map((_, i) => `<line x1="${-80 + i * 40}" y1="-145" x2="${-62 + i * 31}" y2="-34" stroke="${col}" stroke-width="5"/>`).join('') + `<line x1="-96" y1="-90" x2="96" y2="-90" stroke="${col}" stroke-width="5"/>` + `<path d="M110,-150 L150,-200" stroke="#c8102e" stroke-width="14" stroke-linecap="round"/>` + rect(-85, -30, 170, 8, col) + circ(-70, 0, 14, '#1d222c') + circ(70, 0, 14, '#1d222c'), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const train = (x, y, label = '') => rect(x, y - 520, 1400, 470, '#e8ecf2', 40) + rect(x, y - 300, 1400, 40, '#c8102e') + [...Array(8)].map((_, i) => rect(x + 60 + i * 170, y - 470, 120, 140, '#2a3a52', 12)).join('') + rect(x, y - 60, 1400, 30, '#3c4350') + (label ? rect(x + 60, y - 560, 300, 60, '#1d222c', 8) + t2(x + 210, y - 516, label, 38, '#ffcf6a', { weight: 900 }) : '');
const platform = () => vgrad('#a8c4e8', '#e2eef8', 0, 900) + rect(0, 900, 1080, 120, '#8a9098') + rect(0, 1020, 1080, 900, '#b8b2a6') + rect(0, 1020, 1080, 30, '#f2d23a') + [...Array(12)].map((_, i) => rect(i * 100, 1050, 4, 870, '#a8a296')).join('');
const crane = (bx, by, ang, col = '#f2b81a') => g(rect(-18, -720, 36, 720, col) + [...Array(7)].map((_, i) => `<line x1="-18" y1="${-i * 100}" x2="18" y2="${-i * 100 - 100}" stroke="#8a6a1a" stroke-width="5"/>`).join('') + g(rect(-140, -20, 620, 34, col) + rect(-160, -10, 60, 70, '#5a5e66') + `<line x1="440" y1="14" x2="440" y2="200" stroke="#3c4350" stroke-width="4"/>` + rect(420, 200, 40, 30, '#3c4350'), `translate(0 -720) rotate(${ang})`), `translate(${bx} ${by})`);

export async function init() {
  const W = await (await fetch('/work/magnet5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 1.0;
  const T = {
    steel: wt('steel', 0), magnetic: wt('magnetic', 0), news: wt('news', 0), car: wt('car', 0), fight: wt('fight', 0),
    slams: wt('slams', 2), bang1: wt('bang', 2, 0), bang2: wt('bang', 2, 1), ball: wt('ball', 2),
    rips: wt('rips', 4), coins: wt('coins', 4), clang: wt('clang', 4), fridge: wt('fridge', 4),
    cart: wt('cart', 6), snaps: wt('snaps', 6), snake: wt('snake', 6), rolling: wt('rolling', 6), cars: wt('cars', 6),
    buckle: wt('buckle', 8), drags: wt('drags', 8), train: wt('train', 8), railing: wt('railing', 8), genius: wt('genius', 8),
    collide: wt('collide', 10), bridge: wt('bridge', 10), groans: wt('groans', 10),
    off: wt('off', 11), drops: wt('drops', 11), once: wt('once', 11),
    pants: wt('pants', 12), belt: wt('belt', 12), munich: wt('munich', 12), alive: wt('alive', 12), humiliated: wt('humiliated', 12),
    worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 — hook: steel goes magnetic, two cars on the street smash together
    [0, (t) => {
      const kM = seg(t, 0.0, 0.4), kC = 0.55 * seg(t, 0.05, 0.45) ** 2 + 0.45 * seg(t, 3.8, T.fight) ** 2, hit = t > T.fight;
      let s = street();
      s += post(140, 1380, 520, lerp(0, 220, kM)) + post(940, 1380, 520, lerp(0, -220, kM));
      s += field(t, 540, 1560, kM, { r0: 140 });
      { const r = rng(31); for (let i = 0; i < 40; i++) { const t0 = (i < 18 ? r() * 0.9 : 0.9 + r() * 3.9), k = seg(t, t0, t0 + 0.55) ** 2, a = r() * 6.283, sx = 540 + Math.cos(a) * 700, sy = 1560 + Math.sin(a) * 900; if (t > t0 && k < 1) s += i % 3 ? coin(lerp(sx, 540, k), lerp(sy, 1560, k), k * 12 + i, 2.2) : cart(lerp(sx, 540, k), lerp(sy, 1560, k), 0.8, k * 300); } }
      const jit = t > 0.45 && !hit ? Math.sin(t * 60) * 6 : 0;
      s += car(lerp(120, 360, kC) + jit, 1640, '#d9a23a', 1.0, hit ? -8 : -3 * kC) + car(lerp(960, 720, kC) - jit, 1640, '#2f6fd6', 1.0, hit ? 8 : 3 * kC);
      if (hit) s += sparks(t, T.fight, 540, 1580, 3) + debris(t, T.fight, 540, 1600, { n: 18, col: '#9aa3b2', seed: 2 });
      if (t < T.fight) s += speedLines(t, { a: 0.28, seed: 2 });
      s += stamp(540, 620, 'STEEL: MAGNETIC', seg(t, T.steel - 0.05, T.steel + 0.25), '#ff2a3a', -7, 66);
      s += chip(540, 800, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)), { size: 46, col: '#fff', bg: '#c8102e' });
      s += flash(t, 0.0, 0.6, BLUE) + flash(t, T.magnetic - 0.05, 0.4, BLUE) + flash(t, T.fight, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [0.05, T.steel, T.magnetic, T.fight], 0.1), z1: 1, oy: 1500 }), shake(t, [0.05, T.steel, T.magnetic, T.fight], 30)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — every car slams into the next one, one giant metal ball
    [C[0], (t) => {
      let s = street() + speedLines(t, { a: 0.3, seed: 5 });
      const kB = seg(t, T.ball - 0.2, T.ball + 0.3);
      s += post(120, 1400, 520, lerp(40, 260, seg(t, C[0], T.ball))) + post(960, 1400, 520, lerp(-40, -260, seg(t, C[0], T.ball)));
      s += field(t, 540, 1500, 1, { r0: 160 });
      const cars = [['#d9a23a', -1, 1300], ['#2f6fd6', 1, 1300], ['#c8312b', -1, 1700], ['#2fae6a', 1, 1700]];
      cars.forEach(([col, side, y], i) => { const t0 = [T.slams, T.slams, T.bang1, T.bang2][i]; const k = seg(t, t0 - 0.35, t0) ** 2; const x = lerp(540 + side * 900, 540 + side * 190, k); const yy = lerp(y, 1500, kB); s += car(lerp(x, 540 + side * 70, kB), yy, col, lerp(0.95, 0.55, kB), side * (k >= 1 ? 12 : 0) + kB * side * 40); });
      if (kB > 0) s += circ(540, 1500, 290 * kB, '#5a6270') + circ(470, 1420, 110 * kB, '#9aa3b2', `opacity="${0.8 * kB}"`) + [...Array(7)].map((_, j) => rect(540 + Math.cos(j) * 180 * kB - 50, 1500 + Math.sin(j * 1.7) * 160 * kB - 30, 100 * kB, 60 * kB, ['#d9a23a', '#2f6fd6', '#c8312b', '#2fae6a'][j % 4], 14, `transform="rotate(${j * 40} 540 1500)"`)).join('') + debris(t, T.ball, 540, 1500, { n: 24, col: '#9aa3b2', seed: 17 });
      [T.slams, T.bang1, T.bang2].forEach((tb, i) => { s += sparks(t, tb, 540, [1250, 1640, 1640][i], 10 + i); });
      s += chip(300, 640, 'BANG', pop(seg(t, T.bang1 - 0.05, T.bang1 + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' }) + chip(780, 760, 'BANG', pop(seg(t, T.bang2 - 0.05, T.bang2 + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 900, 'ONE METAL BALL', seg(t, T.ball - 0.05, T.ball + 0.2), '#ff2a3a', 6, 64);
      s += flash(t, T.slams, 0.5) + flash(t, T.bang1, 0.5) + flash(t, T.bang2, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.slams, T.bang1, T.bang2, T.ball]), z1: 1, oy: 1400 }), shake(t, [T.slams, T.bang1, T.bang2, T.ball], 30)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — key ring rips out of your pocket, coins fly, everything slams onto the fridge
    [C[1], (t) => {
      let s = kitchen() + fridge(860, 1600);
      s += field(t, 860, 1150, 1, { r0: 120 });
      s += adult({ ...YOU, x: 330, y: 1960, s: 2.0, face: t > T.rips ? 'open' : 'tense', pose: t > T.clang ? 'up' : 'stand', tilt: lerp(0, 10, seg(t, T.rips, T.rips + 0.3)) });
      const kK = seg(t, T.rips - 0.1, T.rips + 0.35) ** 2;
      s += keyring(lerp(380, 820, kK), lerp(1500, 1050, kK) - Math.sin(kK * Math.PI) * 200, kK * 540, 1.3);
      const r = rng(6);
      for (let i = 0; i < 12; i++) { const t0 = T.coins - 0.1 + r() * 0.3, k = seg(t, t0, t0 + 0.4) ** 2, ty = 900 + r() * 500, tx = 730 + r() * 230; if (t > t0) s += coin(lerp(360, tx, k), lerp(1520, ty, k) - Math.sin(k * Math.PI) * (150 + r() * 200), k * 9 + i, 1.2); }
      s += sparks(t, T.clang, 820, 1050, 4, '#ffffff');
      s += chip(540, 620, 'KEYS: GONE', pop(seg(t, T.rips - 0.05, T.rips + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 800, 'CLANG', seg(t, T.clang - 0.05, T.clang + 0.15), '#1d222c', -6, 90);
      s += flash(t, T.clang, 0.6);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.rips, T.clang, T.fridge]), z1: 1, oy: 1200 }), shake(t, [T.rips, T.clang, T.fridge], 30)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — every shopping cart snaps together into a metal snake rolling at the cars
    [C[2], (t) => {
      let s = vgrad('#8ac0f0', '#dcecf8', 0, 900) + rect(0, 760, 1080, 140, '#e8d8b8') + rect(80, 600, 500, 160, '#d0785a') + t2(330, 700, 'MARKET', 70, '#fff', { weight: 900 }) + rect(0, 900, 1080, 1020, '#6a6e76') + [...Array(6)].map((_, i) => rect(i * 190 + 30, 900, 10, 1020, '#f2f2ea', 0, 'opacity="0.7"')).join('');
      const kS = seg(t, T.snaps - 0.2, T.snaps + 0.3), kR = seg(t, T.rolling - 0.1, N[3]);
      s += car(860, 1840, '#c8312b', 0.9, 0) + car(240, 1840, '#d9a23a', 0.9, 0);
      const r = rng(11);
      for (let i = 0; i < 9; i++) { const sx = 100 + r() * 880, sy = 1000 + r() * 600, cx = lerp(160, 920, i / 8), cy = 1250 + Math.sin(i * 0.9 + t * 6) * 70 * kS + kR * 380; s += cart(lerp(sx, cx, kS) + kR * 0, lerp(sy, cy, kS), 0.85, lerp(r() * 40 - 20, -8, kS)); }
      s += field(t, 540, 1300, kS, { r0: 200 });
      if (kR > 0) s += speedLines(t, { a: 0.35 * kR, vertical: true, seed: 8 });
      s += sparks(t, T.snaps, 540, 1260, 7);
      s += stamp(540, 520, 'METAL SNAKE', seg(t, T.snake - 0.05, T.snake + 0.2), '#ff2a3a', -6, 70);
      s += chip(540, 380 + 300, 'INCOMING', pop(seg(t, T.cars - 0.1, T.cars + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += flash(t, T.snaps, 0.6);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.snaps, T.cars]), z1: 1, oy: 1400 }), shake(t, [T.snaps, T.rolling, T.cars], 28)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — your belt buckle drags you toward the train; the railing is steel too
    [C[3], (t) => {
      let s = platform() + train(560, 1020, 'S-BAHN');
      const kD = 0.6 * seg(t, T.drags - 0.1, T.drags + 0.4) + 0.4 * seg(t, T.railing, T.genius + 0.2);
      s += field(t, 760, 1450, 1, { r0: 120 });
      s += rect(60, 1300, 16, 600, '#8a9098') + rect(60, 1300, 340, 16, '#8a9098', 8) + rect(384, 1300, 16, 600, '#8a9098');
      const x = lerp(170, 560, kD);
      s += adult({ ...YOU, x, y: 1960, s: 2.0, face: 'tense', pose: t > T.railing - 0.1 ? 'up' : 'hold', tilt: lerp(0, 24, kD) + Math.sin(t * 25) * 2 * (kD > 0 && kD < 1 ? 1 : 0) });
      s += glow(x + 30, 1500, 70, '#ffe27a', 0.8) + rect(x - 10, 1480, 60, 40, '#c8ccd4', 6, 'stroke="#ffe27a" stroke-width="4"');
      s += speedLines(t, { a: 0.4 * Math.min(1, kD * 3), seed: 4, dir: -1 }) + debris(t, T.drags, x - 60, 1940, { n: 14, col: '#f2d23a', seed: 5 });
      s += chip(540, 560, 'BELT BUCKLE: STEEL', pop(seg(t, T.buckle - 0.1, T.buckle + 0.1)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
      s += chip(540, 720, "IT'S STEEL, GENIUS", pop(seg(t, T.genius - 0.25, T.genius)), { size: 46, col: '#fff', bg: '#c8102e' });
      s += sparks(t, T.railing, 380, 1310, 9);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.drags, T.genius], 0.1), z1: 1, oy: 1300 }), shake(t, [T.drags, T.railing, T.genius], 24)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 — two cranes collide, steel bridges groan
    [C[4], (t) => {
      let s = vgrad('#ff9a4a', '#ffd8a0', 0, 1300) + rect(0, 1300, 1080, 620, '#4a7ab0');
      const kC = seg(t, C[4], T.collide) ** 2, hit = t > T.collide;
      s += rect(0, 1180, 1080, 40, '#c8312b') + [...Array(8)].map((_, i) => `<path d="M${i * 140},1180 L${i * 140 + 70},${1060 + Math.sin(t * 30 + i) * (t > T.bridge ? 10 : 0)} L${i * 140 + 140},1180" stroke="#c8312b" stroke-width="12" fill="none"/>`).join('') + rect(200, 1220, 40, 120, '#8a3a2a') + rect(840, 1220, 40, 120, '#8a3a2a');
      s += crane(220, 1180, hit ? -6 + Math.sin(t * 20) * 3 : lerp(-30, -6, kC), '#f2b81a') + crane(860, 1180, hit ? 186 + Math.sin(t * 20) * 3 : lerp(210, 186, kC), '#f2d23a');
      s += field(t, 540, 560, 1, { r0: 100 });
      if (hit) s += sparks(t, T.collide, 540, 470, 12, '#ffffff') + debris(t, T.collide, 540, 480, { n: 20, col: '#3c4350', seed: 13 }) + crack(t, T.collide, 540, 520, 8);
      s += stamp(540, 880, 'COLLISION', seg(t, T.collide - 0.05, T.collide + 0.2), '#ff2a3a', -6, 76);
      s += chip(540, 1480, 'BRIDGES: GROANING', pop(seg(t, T.groans - 0.15, T.groans + 0.05)), { size: 44, col: '#fff', bg: '#1d222c' });
      s += flash(t, T.collide, 0.8);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.collide, T.groans], 0.12), z1: 1, oy: 700 }), shake(t, [T.collide, T.bridge, T.groans], 36)) + bar(t) + pill('SECOND 5');
    }],
    // 11 — magnets off: everything drops
    [C[5], (t) => {
      let s = street(['#9ac4ee', '#e2eef8']);
      const kD = Math.max(0, t - T.drops);
      s += post(140, 1380, 520, 160) + post(940, 1380, 520, -160);
      s += car(380, 1560, '#d9a23a', 0.95, -14) + car(720, 1580, '#2f6fd6', 0.95, 12) + car(540, 1800, '#c8312b', 1.0, 4);
      const r = rng(21);
      for (let i = 0; i < 10; i++) { const x = 120 + r() * 840, y0 = 700 + r() * 300; s += r() > 0.5 ? cart(x, Math.min(1880, y0 + 2400 * kD * kD), 0.6, kD * 200) : coin(x, Math.min(1880, y0 + 2600 * kD * kD), kD * 10 + i, 1.4); }
      s += stamp(540, 620, 'MAGNETS: OFF', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 74);
      s += chip(540, 800, 'EVERYTHING DROPS', pop(seg(t, T.drops - 0.1, T.drops + 0.1)), { size: 44, col: '#fff', bg: '#1d222c' });
      s += flash(t, C[5], 0.95) + flash(t, T.once, 0.4, '#000000', 0.3);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.drops, T.once], 0.12), z1: 1, oy: 1300 }), shake(t, [C[5], T.drops, T.once], 36, 9)) + pill('STEEL: NORMAL');
    }],
    // 12 — the guy on the platform holding up his pants, his belt leaving for Munich
    [C[6], (t) => {
      let s = platform();
      const kT = seg(t, T.belt - 0.3, C[7]);
      const tx = lerp(520, 1300, kT ** 2);
      s += train(tx, 1020, 'MUNICH');
      s += rect(tx + 60, 800, 260, 34, '#8a4a2a', 10) + rect(tx + 280, 788, 56, 58, '#e8ecf2', 8, 'stroke="#ffe27a" stroke-width="5"') + glow(tx + 308, 817, 60, '#ffe27a', 0.6);
      if (kT > 0) s += speedLines(t, { a: 0.3 * Math.min(1, kT * 4), seed: 6 });
      s += adult({ ...YOU, x: 360, y: 1960, s: 2.0, face: t > T.humiliated - 0.2 ? 'worried' : 'tense', pose: 'hold', tilt: Math.sin(t * 2) * 2 });
      s += chip(540, 700, 'NO BELT', pop(seg(t, T.pants - 0.1, T.pants + 0.1)) * (1 - seg(t, T.alive - 0.15, T.alive - 0.05)), { size: 48, col: '#fff', bg: '#c8102e' });
      s += chip(540, 540, 'BELT: LEFT FOR MUNICH', pop(seg(t, T.munich - 0.2, T.munich + 0.05)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
      s += chip(330, 700, 'ALIVE.', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 44, col: '#fff', bg: '#2fae6a' });
      s += chip(740, 700, 'HUMILIATED.', pop(seg(t, T.humiliated - 0.1, T.humiliated + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      return g(cam(fin(s, 0.4), seg(t, C[6], C[7]), { z0: 1.0, z1: 1.1, ox: 400, oy: 1400 }), shake(t, [T.humiliated], 16)) + pill('GERMANY · PLATFORM 4');
    }],
    // 13 — CTA
    [C[7], (t) => {
      const opts = ['WATER?', 'SOUND?', 'WI-FI?', 'GLUE?', 'TIME?', 'COLOR?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'GOES CRAZY', 1, { size: 140, col: '#ffcf6a' }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 130, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
