// "What if all paper vanished for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, crack, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const KRAFT = '#c9955a', KRAFT2 = '#a8743c', COFFEE = '#5a3218';
// paper shreds flying (white/cream confetti)
function shreds(t, t0, x, y, { n = 40, spread = 1000, seed = 3, col = '#fff8ea' } = {}) {
  const d = t - t0; if (d < 0 || d > 2.2) return ''; const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, v = spread * (0.3 + 0.7 * r()); const px = x + Math.cos(a) * v * d, py = y + Math.sin(a) * v * d * 0.8 + 260 * d * d; const w = 20 + r() * 34; s += rect(px - w / 2, py - w * 0.35, w, w * 0.7, i % 3 ? col : '#e8dcc4', 2, `transform="rotate(${(d * 600 * (r() - 0.5) + r() * 90).toFixed(0)} ${px.toFixed(0)} ${py.toFixed(0)})" opacity="${Math.max(0, 1 - d / 2.2).toFixed(2)}"`); }
  return s;
}
// "poof" ring where paper disappears
const poof = (t, t0, x, y, w = 200) => { const d = (t - t0) / 0.35; if (d < 0 || d > 1) return ''; return circ(x, y, w * (0.3 + d), 'none', `stroke="#ffffff" stroke-width="${(16 * (1 - d)).toFixed(1)}" opacity="${(0.9 * (1 - d)).toFixed(2)}"`); };
// falling object helper: y after t0 under gravity, clamped to floor
const fall = (t, t0, y0, floor, gpx = 3600) => { const d = Math.max(0, t - t0); return Math.min(floor, y0 + 0.5 * gpx * d * d); };
// paper cup (centre-bottom at 0,0, height ~200)
const cup = (x, y, s, mode = 'paper', fill = 1) => {
  let c = '';
  if (mode === 'paper') c = `<path d="M-62,-200 L62,-200 L48,0 L-48,0Z" fill="#fbf7f0"/>` + `<path d="M-58,-150 L58,-150 L52,-70 L-52,-70Z" fill="${KRAFT}"/>` + rect(-70, -222, 140, 26, '#2a2622', 8) + t2(0, -100, 'JOE', 34, '#fbf7f0', { weight: 900 });
  else if (mode === 'film') c = `<path d="M-62,-200 L62,-200 L48,0 L-48,0Z" fill="${COFFEE}" opacity="0.85"/>` + `<path d="M-62,-200 L62,-200 L48,0 L-48,0Z" fill="#e8f4ff" opacity="0.25" stroke="#ffffff" stroke-width="4"/>` + rect(-70, -222, 140, 26, '#2a2622', 8);
  else if (mode === 'empty') c = `<path d="M-62,-200 L62,-200 L48,0 L-48,0Z" fill="#fbf7f0"/>` + `<path d="M-58,-150 L58,-150 L52,-70 L-52,-70Z" fill="${KRAFT}"/>` + t2(0, -100, 'JOE', 34, '#fbf7f0', { weight: 900 });
  return g(c, `translate(${x} ${y}) scale(${s})`);
};
const cbox = (x, y, w, h, col = KRAFT) => rect(x, y, w, h, col, 6) + rect(x, y + h * 0.42, w, h * 0.16, '#e2c08a', 0, 'opacity="0.8"') + rect(x, y, w, 6, KRAFT2);
const duck = (x, y, r, rot = 0) => g(`<ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.78}" fill="#ffd21a"/>` + circ(r * 0.55, -r * 0.7, r * 0.52, '#ffd21a') + `<path d="M${r * 1.0},${-r * 0.72} l${r * 0.45},${r * 0.12} l${-r * 0.45},${r * 0.16}Z" fill="#ff7a1a"/>` + circ(r * 0.7, -r * 0.82, r * 0.08, '#1d1f24'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})`);
const pizza = (x, y, r, rot = 0) => g(circ(0, 0, r, '#e8a24a') + circ(0, 0, r * 0.84, '#e0442a') + [...Array(6)].map((_, i) => circ(Math.cos(i) * r * 0.5, Math.sin(i * 1.7) * r * 0.45, r * 0.12, '#f6e6b0')).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(1 0.45)`);
const splat = (x, y, w, col, k) => k > 0 ? `<ellipse cx="${x}" cy="${y}" rx="${(w * k).toFixed(0)}" ry="${(w * 0.22 * k).toFixed(0)}" fill="${col}"/>` + [...Array(6)].map((_, i) => circ(x + Math.cos(i * 1.05) * w * 1.1 * k, y - Math.abs(Math.sin(i * 1.05)) * w * 0.5 * k, w * 0.09, col)).join('') : '';
const city = (h0) => { const r = rng(5); let s = ''; for (let i = 0; i < 7; i++) { const w = 130 + r() * 90, h = 380 + r() * 420, x = i * 160 - 30, c = ['#e85a4a', '#f2b33a', '#4a8ae0', '#7ac06a', '#e07ab0'][i % 5]; s += rect(x, h0 - h, w, h, c) + [...Array(Math.floor(h / 90))].map((_, j) => rect(x + 20, h0 - h + 30 + j * 90, w - 40, 40, '#ffffff', 4, 'opacity="0.55"')).join(''); } return s; };

export async function init() {
  const W = await (await fetch('/work/paper5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), paper: wt('paper', 0), vanished: wt('vanished', 0), five: wt('five', 0),
    cup: wt('cup', 2), paper2: wt('paper', 2), lining: wt('lining', 2), hot: wt('hot', 2), shoes: wt('shoes', 2),
    box: wt('box', 4), gone4: wt('gone', 4), forklift: wt('forklift', 4), buried: wt('buried', 4), ducks: wt('ducks', 4),
    drywall: wt('drywall', 6), gypsum: wt('gypsum', 6), walls: wt('walls', 6), crumble: wt('crumble', 6), hi: wt('hi', 6), karaoke: wt('karaoke', 6),
    eggs: wt('eggs', 8), milk: wt('milk', 8), flour: wt('flour', 8), aisle: wt('aisle', 8), pancake: wt('pancake', 8),
    toilet: wt('toilet', 10), gone10: wt('gone', 10), million: wt('million', 10), wipe: wt('wipe', 10), pray: wt('pray', 10),
    back: wt('back', 11), cup11: wt('cup', 11), empty: wt('empty', 11), socks: wt('socks', 11),
    good: wt('good', 12), cash: wt('cash', 12), survived: wt('survived', 12), cotton: wt('cotton', 12), broke: wt('broke', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += shreds(t, t0, 540, 900, { n: 30, spread: 1300, seed: 40 + n }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  const FL = 1560; // feet line for full-body people: head at FL-553 = 1007 (above caption band)

  const shots = [
    // 0 hook: street, coffee + pizza boxes + posters, all paper poofs
    [0, (t) => {
      const v = T.vanished, gone = t >= v;
      let s = vgrad('#5aa8f0', '#d8eefc', 0, FL) + city(FL) + rect(-40, FL, 1160, 400, '#9a9ea6') + rect(-40, FL, 1160, 14, '#c4c8ce');
      // posters on the wall
      if (!gone) for (let i = 0; i < 4; i++) s += rect(60 + i * 250, 820, 190, 260, ['#ffcf3a', '#ffffff', '#ff6a8a', '#7ad0ff'][i], 4) + t2(155 + i * 250, 960, 'SALE', 44, '#1d1f24', { weight: 900 });
      s += adult({ ...YOU, x: 300, y: FL, s: 1.1, face: gone ? 'open' : 'neutral', pose: gone ? 'up' : 'hold' });
      if (!gone) s += cup(336, 1222, 0.9);
      else { const cy = fall(t, v, 1190, FL - 10); s += cy < FL - 12 ? `<ellipse cx="336" cy="${cy.toFixed(0)}" rx="44" ry="70" fill="${COFFEE}"/>` : splat(336, FL - 6, 150, COFFEE, pop(seg(t, v + 0.25, v + 0.45))); }
      s += adult({ ...CROWD[3], x: 790, y: FL, s: 1.1, face: gone ? 'open' : 'smile', pose: gone ? 'up' : 'hold', top: '#c8102e' });
      if (!gone) for (let i = 0; i < 3; i++) s += cbox(690, 1150 - i * 44, 200, 40, i % 2 ? KRAFT : '#e2b070');
      else for (let i = 0; i < 3; i++) { const py = fall(t, v + i * 0.05, 1170 - i * 44, FL - 20 - i * 6); s += pizza(790 + (i - 1) * 70 * Math.min(1, (t - v) * 3), py, 95, (t - v) * 200 * (i - 1)); }
      s += poof(t, v, 336, 1130, 140) + poof(t, v, 790, 1120, 200) + [0, 1, 2, 3].map((i) => poof(t, v + i * 0.04, 155 + i * 250, 950, 160)).join('');
      s += shreds(t, v, 540, 950, { n: 70, spread: 1300, seed: 4 });
      s += hit(540, 520, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)) * (1 - seg(t, T.paper - 0.15, T.paper - 0.05)), '#ff2a3a', -5, 150);
      s += stamp(540, 510, 'ALL PAPER: GONE', seg(t, T.paper - 0.08, T.paper + 0.2), '#ff2a3a', -6, 66);
      s += chip(540, 690, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += flash(t, 0, 0.6) + flash(t, v - 0.04, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.news, T.paper, v, T.five], 0.11), z1: 1, oy: 1200 }), shake(t, [0.03, T.news, v, v + 0.4, T.five], 34)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 coffee cup close-up: only the plastic film is left, then it tears
    [C[0], (t) => {
      const kT = t >= T.hot - 0.05; let s = vgrad('#ffcf8a', '#ffeccc');
      s += rect(-40, 1500, 1160, 500, '#8a5a3a');
      // shoes
      s += `<ellipse cx="380" cy="1730" rx="150" ry="60" fill="#f2f4f7"/><ellipse cx="700" cy="1730" rx="150" ry="60" fill="#f2f4f7"/>` + rect(250, 1730, 600, 26, '#1d1f24', 10);
      // hand
      s += rect(-60, 900, 420, 150, '#e0b494', 70);
      const mode = t < T.paper2 - 0.04 ? 'paper' : 'film';
      if (!kT) s += cup(560 + Math.sin(t * 30) * (mode === 'film' ? 8 : 0), 1250, 2.4, mode);
      else { const d = t - (T.hot - 0.05); const yy = Math.min(1660, 900 + 3000 * d * d); for (let i = 0; i < 7; i++) s += `<ellipse cx="${(560 + (i - 3) * 40 * (1 + d * 2)).toFixed(0)}" cy="${(yy - i * 40).toFixed(0)}" rx="${70 - i * 6}" ry="${110 - i * 8}" fill="${COFFEE}" opacity="${(0.9 - i * 0.08).toFixed(2)}"/>`;
        s += rect(380, 760, 360, 40, '#e8f4ff', 6, `opacity="${Math.max(0, 0.6 - d).toFixed(2)}" transform="rotate(${(d * 90).toFixed(0)} 560 780)"`); }
      s += splat(540, 1700, 330, COFFEE, pop(seg(t, T.shoes - 0.2, T.shoes)));
      for (let i = 0; i < 5; i++) { const d = t - T.shoes; if (d > 0) s += `<path d="M${380 + i * 80},1640 q-30,${-80 - d * 100} 0,${-160 - d * 200}" stroke="#ffffff" stroke-width="10" fill="none" opacity="${Math.max(0, 0.6 - d * 0.3).toFixed(2)}"/>`; }
      s += poof(t, T.paper2 - 0.04, 560, 1000, 360) + shreds(t, T.paper2 - 0.04, 560, 1000, { n: 40, spread: 1100, seed: 7 });
      s += chip(540, 500, 'YOUR CUP: PAPER', pop(seg(t, T.cup - 0.1, T.cup + 0.1)) * (1 - seg(t, T.lining - 0.15, T.lining - 0.05)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 520, 'PLASTIC LINING ONLY', seg(t, T.lining - 0.08, T.lining + 0.2) * (1 - seg(t, T.hot - 0.15, T.hot - 0.05)), '#141a22', -5, 58);
      s += hit(540, 520, 'HOT COFFEE', pop(seg(t, T.hot - 0.1, T.hot + 0.1)) * (1 - seg(t, T.shoes - 0.12, T.shoes - 0.02)), '#ff2a3a', -5, 130);
      s += stamp(540, 540, 'YOUR SHOES', seg(t, T.shoes - 0.08, T.shoes + 0.2), '#ff2a3a', 6, 100);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, T.paper2 - 0.05, 0.6) + flash(t, T.hot - 0.05, 0.6) + flash(t, T.shoes, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [T.cup, T.paper2, T.lining, T.hot, T.shoes], 0.1), z1: 1.04, oy: 1100 }), shake(t, [T.paper2, T.hot, T.shoes], 30)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 warehouse: boxes vanish, contents rain, forklift buried in rubber ducks
    [C[1], (t) => {
      const v = T.gone4 - 0.05, gone = t >= v; let s = vgrad('#e8e2d4', '#c8c0ae');
      for (let r = 0; r < 3; r++) { const y = 700 + r * 330; s += rect(30, y + 250, 1020, 18, '#ff7a1a'); s += rect(30, 600, 18, 1250, '#2f6fd6') + rect(1032, 600, 18, 1250, '#2f6fd6');
        for (let c = 0; c < 5; c++) { const bx = 60 + c * 196, by = y + 90;
          if (!gone) s += cbox(bx, by, 180, 160);
          else { const r2 = rng(r * 9 + c); for (let k = 0; k < 4; k++) { const py = fall(t, v + r2() * 0.1, by + 40 + k * 30, 1850 - k * 30); const px = bx + 30 + r2() * 120; s += (r + c) % 2 ? duck(px, py, 34, (t - v) * 300 * (r2() - 0.5)) : rect(px - 30, py - 30, 60, 60, ['#2f6fd6', '#e0442a', '#2fae6a'][k % 3], 10, `transform="rotate(${((t - v) * 300).toFixed(0)} ${px.toFixed(0)} ${py.toFixed(0)})"`); } } } }
      // forklift + driver (sitting low so head stays below the caption band)
      const FX = 760, FY = 1870;
      s += rect(FX - 40, FY - 520, 22, 520, '#3a3f4a') + rect(FX - 160, FY - 120, 140, 18, '#3a3f4a');
      s += adult({ ...CROWD[1], x: FX + 110, y: FY - 30, s: 0.8, face: t > T.buried ? 'open' : 'tense', pose: t > T.buried ? 'up' : 'hold', top: '#ff7a1a' });
      s += rect(FX, FY - 240, 260, 200, '#ffb31a', 20) + circ(FX + 50, FY - 30, 50, '#141618') + circ(FX + 210, FY - 30, 50, '#141618');
      // duck pile rising over the forklift
      const kP = L.easeOut(clamp((t - T.forklift) / 1.1));
      if (kP > 0) { const r3 = rng(77); for (let i = 0; i < 60; i++) { const px = FX - 140 + r3() * 560, top = FY - 40 - kP * (60 + r3() * 260); s += duck(px, top + r3() * 40, 30 + r3() * 10, r3() * 60 - 30); } }
      s += poof(t, v, 540, 1000, 500) + shreds(t, v, 540, 1100, { n: 60, spread: 1300, seed: 9, col: KRAFT });
      s += chip(540, 500, 'EVERY CARDBOARD BOX', pop(seg(t, T.box - 0.2, T.box)) * (1 - seg(t, T.gone4 - 0.12, T.gone4 - 0.02)), { size: 46, col: '#fff', bg: '#141a22' });
      s += hit(540, 520, 'GONE', pop(seg(t, T.gone4 - 0.1, T.gone4 + 0.1)) * (1 - seg(t, T.buried - 0.15, T.buried - 0.05)), '#ff2a3a', -5, 200);
      s += stamp(540, 520, 'BURIED IN DUCKS', seg(t, T.buried - 0.08, T.buried + 0.2), '#ff2a3a', 5, 72);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, v, 0.8) + flash(t, T.buried - 0.05, 0.5, '#ffd21a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.box, v, T.forklift, T.buried, T.ducks], 0.1), z1: 1, oy: 1300 }), shake(t, [v, v + 0.35, T.buried, T.ducks], 34, 5)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 drywall: paper gone, wall crumbles, neighbour mid-karaoke
    [C[2], (t) => {
      const kC = clamp((t - T.crumble + 0.1) / 0.6); let s = rect(0, 0, 1080, 1920, '#6a3aa8');
      // neighbour's room behind (disco lights)
      for (let i = 0; i < 6; i++) s += glow(150 + i * 170, 700 + Math.sin(t * 5 + i) * 120, 180, ['#ff4ad0', '#4ae0ff', '#ffe04a'][i % 3], 0.35);
      s += rect(0, FL, 1080, 400, '#4a2a7a');
      const kS = t > T.hi - 0.1;
      s += adult({ ...CROWD[0], x: 720, y: FL, s: 1.1, face: kS ? 'open' : 'smile', pose: 'up', top: '#ff4ad0', tilt: Math.sin(t * 8) * 10 });
      s += rect(800, 950, 18, 70, '#1d1f24', 6) + circ(809, 945, 18, '#3a3f4a');
      for (let i = 0; i < 4; i++) { const d = ((t * 0.8 + i * 0.25) % 1); s += g(circ(0, 0, 18, '#ffe04a') + rect(12, -70, 8, 70, '#ffe04a'), `translate(${860 + i * 50} ${(900 - d * 300).toFixed(0)})`, `opacity="${(1 - d).toFixed(2)}"`); }
      // your wall: studs + drywall panels that crumble
      for (let i = 0; i < 6; i++) s += rect(60 + i * 190, 560, 34, 1000, '#d8a868');
      if (kC < 1) { const r = rng(11); for (let i = 0; i < 24; i++) { const cx = (i % 4) * 270, cy = 560 + Math.floor(i / 4) * 167, d = Math.max(0, t - (T.crumble - 0.1 + r() * 0.3)); s += rect(cx + (d > 0 ? (r() - 0.5) * 200 * d : 0), cy + 1800 * d * d, 270, 167, '#f2ece0', 0, `stroke="#d8d0c0" stroke-width="3" opacity="${Math.max(0, 1 - d * 1.5).toFixed(2)}"`); } }
      if (t < T.crumble + 0.1) s += crack(t, T.drywall, 380, 900, 21, '#8a7a60') + crack(t, T.gypsum, 760, 1250, 22, '#8a7a60') + crack(t, T.walls, 300, 1400, 23, '#8a7a60');
      s += debris(t, T.crumble, 540, 1000, { n: 50, col: '#f2ece0', spread: 1100, seed: 13, size: 40 });
      for (let i = 0; i < 5; i++) { const d = Math.max(0, t - T.crumble); s += circ(100 + i * 220, 1520 - d * 60, 80 + d * 120, '#ffffff', `opacity="${(t > T.crumble ? Math.max(0, 0.5 - d * 0.2) : 0).toFixed(2)}"`); }
      s += rect(0, FL, 1080, 20, '#8a6a4a');
      s += adult({ ...YOU, x: 230, y: FL, s: 1.1, face: 'open', pose: t > T.crumble ? 'up' : 'stand' });
      s += chip(540, 500, 'DRYWALL = GYPSUM + PAPER', pop(seg(t, T.drywall - 0.1, T.drywall + 0.1)) * (1 - seg(t, T.crumble - 0.15, T.crumble - 0.05)), { size: 42, col: '#fff', bg: '#141a22' });
      s += hit(540, 520, 'CRUMBLE', pop(seg(t, T.crumble - 0.1, T.crumble + 0.1)) * (1 - seg(t, T.hi - 0.12, T.hi - 0.02)), '#ff2a3a', -5, 150);
      s += stamp(540, 520, 'HI, NEIGHBOR', seg(t, T.hi - 0.08, T.hi + 0.2) * (1 - seg(t, T.karaoke - 0.4, T.karaoke - 0.3)), '#ff2a3a', 5, 90);
      s += chip(540, 520, 'NICE KARAOKE', pop(seg(t, T.karaoke - 0.3, T.karaoke - 0.1)), { size: 56, col: '#141a22', bg: '#ffe04a' });
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, T.crumble - 0.05, 0.8) + flash(t, T.hi - 0.05, 0.4, '#ff4ad0', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.drywall, T.crumble, T.crumble + 0.3, T.hi, T.karaoke], 0.1), z1: 1, oy: 1200 }), shake(t, [T.drywall, T.gypsum, T.walls, T.crumble, T.crumble + 0.3, T.hi], 36, 5)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 supermarket: eggs, milk, flour drop -> pancake batter
    [C[3], (t) => {
      const FLR = 1800; let s = vgrad('#f6f8fa', '#dfe6ee', 0, FLR) + rect(0, 560, 1080, 80, '#2fae6a') + t2(540, 620, 'AISLE 5', 56, '#ffffff', { weight: 900, ls: 6 });
      const rows = [[T.eggs, 820], [T.milk, 1130], [T.flour, 1440]];
      rows.forEach(([tv, y], r) => { s += rect(40, y + 160, 1000, 22, '#9aa3b2');
        for (let c = 0; c < 5; c++) { const x = 70 + c * 196; const gone = t >= tv - 0.04, d = t - tv;
          if (r === 0) { if (!gone) s += rect(x, y + 70, 170, 90, '#b8b0a0', 8) + [0, 1, 2].map((k) => circ(x + 32 + k * 53, y + 70, 24, '#fff8ea')).join(''); else for (let k = 0; k < 3; k++) { const py = fall(t, tv, y + 100, FLR - 20); s += py < FLR - 22 ? `<ellipse cx="${x + 32 + k * 53}" cy="${py.toFixed(0)}" rx="22" ry="28" fill="#fff8ea"/>` : splat(x + 32 + k * 53, FLR - 10, 60, '#ffc21a', 1); } }
          if (r === 1) { if (!gone) s += rect(x + 30, y - 20, 110, 180, '#ffffff', 6, 'stroke="#2f6fd6" stroke-width="6"') + `<path d="M${x + 30},${y - 20} L${x + 85},${y - 70} L${x + 140},${y - 20}Z" fill="#2f6fd6"/>`; else if (d < 1.2) s += `<ellipse cx="${x + 85}" cy="${(y + 70 + 900 * d * d).toFixed(0)}" rx="${60 + d * 60}" ry="${90 - d * 40}" fill="#ffffff" opacity="${Math.max(0, 0.95 - d * 0.6).toFixed(2)}"/>`; }
          if (r === 2) { if (!gone) s += rect(x + 15, y - 10, 140, 170, '#e8d8b8', 14) + t2(x + 85, y + 90, 'FLOUR', 30, '#8a5a3a', { weight: 900 }); else s += circ(x + 85, y + 60 - d * 120, 90 + d * 300, '#ffffff', `opacity="${Math.max(0.25, 0.85 - d * 0.25).toFixed(2)}"`); } } });
      s += rect(0, FLR, 1080, 200, '#c8ccd4') + splat(540, FLR + 30, 380, '#ffffff', pop(seg(t, T.milk + 0.2, T.milk + 0.5))) + [0, 1, 2, 3, 4].map((c) => splat(102 + c * 196, FLR + 10, 60, '#ffc21a', pop(seg(t, T.eggs + 0.3, T.eggs + 0.5)))).join('');
      const kB = L.easeOut(clamp((t - T.flour + 0.3) / 2.2)), BY = FLR + 40 - 440 * kB + Math.sin(t * 5) * 12; s += `<path d="M-40,${BY.toFixed(0)} ${[...Array(12)].map((_, i) => `Q${i * 100 + 50},${(BY + (i % 2 ? 30 : -30) * Math.sin(t * 6 + i)).toFixed(0)} ${(i + 1) * 100},${BY.toFixed(0)}`).join(' ')} L1120,2000 L-40,2000Z" fill="#f0d8a0"/>`;
      if (kB > 0.25) { const r4 = rng(61); for (let i = 0; i < 16; i++) s += circ(r4() * 1080, BY + 60 + r4() * 300, 10 + r4() * 18, '#fff4d0', 'opacity="0.8"'); s += splat(300, BY + 20, 90, '#ffc21a', 1) + splat(760, BY + 40, 70, '#ffc21a', 1);
        s += g(rect(-150, -120, 300, 150, 'none', 10, 'stroke="#9aa3b2" stroke-width="12"') + [0, 1, 2, 3].map((k) => rect(-150 + k * 75, -120, 8, 150, '#9aa3b2')).join('') + rect(150, -170, 12, 60, '#9aa3b2'), `translate(${(700 + Math.sin(t * 2) * 40).toFixed(0)} ${(BY + 40).toFixed(0)}) rotate(${(Math.sin(t * 3) * 10).toFixed(1)})`); }
      s += shreds(t, T.eggs - 0.04, 540, 900, { n: 30, spread: 1000, seed: 21, col: '#b8b0a0' }) + shreds(t, T.flour - 0.04, 540, 1440, { n: 30, spread: 1000, seed: 22, col: '#e8d8b8' });
      s += chip(540, 470, 'EGG CARTONS', pop(seg(t, T.eggs - 0.1, T.eggs + 0.1)) * (1 - seg(t, T.milk - 0.12, T.milk - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += chip(540, 470, 'MILK CARTONS', pop(seg(t, T.milk - 0.1, T.milk + 0.1)) * (1 - seg(t, T.flour - 0.12, T.flour - 0.02)), { size: 50, col: '#fff', bg: '#2f6fd6' });
      s += chip(540, 470, 'FLOUR BAGS', pop(seg(t, T.flour - 0.1, T.flour + 0.1)) * (1 - seg(t, T.pancake - 0.15, T.pancake - 0.05)), { size: 50, col: '#fff', bg: '#8a5a3a' });
      s += stamp(540, 470, 'PANCAKE BATTER', seg(t, T.pancake - 0.08, T.pancake + 0.2), '#ff2a3a', -6, 76);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, T.eggs - 0.04, 0.6) + flash(t, T.milk - 0.04, 0.6) + flash(t, T.flour - 0.04, 0.9) + flash(t, T.pancake - 0.05, 0.4, '#ffc21a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.eggs, T.milk, T.flour, T.aisle, T.pancake], 0.1), z1: 1, oy: 1300 }), shake(t, [T.eggs + 0.25, T.milk + 0.25, T.flour, T.pancake], 30, 5)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 toilet paper: gone, a million people mid-wipe
    [C[4], (t) => {
      const v = T.gone10 - 0.05; let s = rect(0, 0, 1080, 1920, '#bfe6ee');
      for (let i = 0; i < 12; i++) for (let j = 0; j < 22; j++) s += rect(i * 90 + 4, j * 90 + 4, 82, 82, (i + j) % 2 ? '#d6f0f4' : '#c8eaf0', 6);
      // holder + giant roll
      s += rect(240, 1180, 600, 26, '#9aa3b2', 13) + rect(220, 1150, 40, 90, '#9aa3b2', 10);
      if (t < v) s += circ(540, 1193, 230, '#ffffff', 'stroke="#e2e8ee" stroke-width="8"') + circ(540, 1193, 70, '#d8b88a') + rect(310, 1193, 460, 500, '#ffffff', 0) + rect(310, 1680, 460, 30, '#f0f4f8');
      s += rect(620, 1450, 380, 90, '#ffffff', 30, 'stroke="#d8e2ea" stroke-width="6"') + `<path d="M640,1540 L980,1540 L900,1760 L720,1760Z" fill="#ffffff" stroke="#d8e2ea" stroke-width="6"/>` + rect(870, 1080, 130, 380, '#ffffff', 20, 'stroke="#d8e2ea" stroke-width="6"');
      s += poof(t, v, 540, 1300, 400) + shreds(t, v, 540, 1300, { n: 90, spread: 1400, seed: 31 });
      s += hit(540, 1600, 'EVEN THE TUBE', pop(seg(t, v + 0.25, v + 0.4)) * (1 - seg(t, T.million - 0.15, T.million - 0.05)), '#141a22', 4, 90);
      s += chip(540, 500, 'TOILET PAPER', pop(seg(t, T.toilet - 0.1, T.toilet + 0.1)) * (1 - seg(t, T.gone10 - 0.12, T.gone10 - 0.02)), { size: 54, col: '#fff', bg: '#141a22' });
      s += hit(540, 520, 'GONE', pop(seg(t, T.gone10 - 0.1, T.gone10 + 0.1)) * (1 - seg(t, T.million - 0.12, T.million - 0.02)), '#ff2a3a', -5, 200);
      s += chip(540, 500, '1,000,000 PEOPLE', pop(seg(t, T.million - 0.1, T.million + 0.1)) * (1 - seg(t, T.wipe - 0.12, T.wipe - 0.02)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 520, 'MID-WIPE', seg(t, T.wipe - 0.08, T.wipe + 0.2) * (1 - seg(t, T.pray - 0.12, T.pray - 0.02)), '#ff2a3a', 6, 110);
      s += hit(540, 780, 'PRAY FOR THEM', pop(seg(t, T.pray - 0.08, T.pray + 0.1)), '#141a22', -4, 110);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, v, 0.9) + flash(t, T.wipe - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.toilet, v, T.million, T.wipe, T.pray], 0.12), z1: 1, oy: 1200 }), shake(t, [v, T.wipe, T.pray], 34)) + bar(t) + pill('SECOND 5');
    }],
    // 11 paper back: cup back, empty, coffee in your socks
    [C[5], (t) => {
      let s = vgrad('#5aa8f0', '#d8eefc', 0, FL) + city(FL) + rect(-40, FL, 1160, 400, '#9a9ea6') + rect(-40, FL, 1160, 14, '#c4c8ce');
      for (let i = 0; i < 4; i++) s += rect(60 + i * 250, 820, 190, 260, ['#ffcf3a', '#ffffff', '#ff6a8a', '#7ad0ff'][i], 4) + t2(155 + i * 250, 960, 'SALE', 44, '#1d1f24', { weight: 900 });
      s += splat(300, FL + 10, 220, COFFEE, 1);
      s += adult({ ...YOU, x: 300, y: FL, s: 1.1, face: t > T.empty ? 'tense' : 'open', pose: 'hold', pants: '#24262b' });
      s += cup(336 + Math.sin(t * 40) * 4, 1222, 0.9, 'empty');
      for (let i = 0; i < 4; i++) { const d = (t * 0.7 + i * 0.25) % 1; s += `<path d="M${260 + i * 30},${FL - 20} q-20,-40 0,-${(60 + d * 80).toFixed(0)}" stroke="#ffffff" stroke-width="8" fill="none" opacity="${(0.6 * (1 - d)).toFixed(2)}"/>`; }
      s += pizza(790, FL - 20, 95, 0) + pizza(860, FL - 26, 95, 0) + cbox(690, FL - 70, 200, 40);
      s += shreds(t, C[5], 540, 950, { n: 50, spread: -900, seed: 5 });
      s += stamp(540, 520, "PAPER'S BACK", seg(t, C[5], C[5] + 0.25) * (1 - seg(t, T.cup11 - 0.12, T.cup11 - 0.02)), '#2fae6a', 6, 90);
      s += chip(540, 500, 'CUP: BACK', pop(seg(t, T.cup11 - 0.1, T.cup11 + 0.1)) * (1 - seg(t, T.empty - 0.12, T.empty - 0.02)), { size: 56, col: '#fff', bg: '#2fae6a' });
      s += hit(540, 530, 'EMPTY', pop(seg(t, T.empty - 0.08, T.empty + 0.1)) * (1 - seg(t, T.socks - 0.5, T.socks - 0.4)), '#ff2a3a', -4, 200);
      s += stamp(540, 520, 'COFFEE: IN YOUR SOCKS', seg(t, T.socks - 0.4, T.socks), '#c8102e', -5, 56);
      s += flash(t, C[5], 0.95, '#2fae6a', 0.3) + flash(t, T.empty - 0.05, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.back, T.cup11, T.empty, T.socks], 0.13), z1: 1, oy: 1200 }), shake(t, [C[5], T.empty, T.socks], 40, 6)) + pill('PAPER: BACK');
    }],
    // 12 cash survived: it's cotton. still broke.
    [C[6], (t) => {
      let s = vgrad('#2fae6a', '#0f5a34') + speedLines(t, { a: 0.15, seed: 8 });
      const kB = pop(seg(t, T.cash - 0.15, T.cash + 0.1));
      for (let i = 0; i < 3; i++) { const bob = Math.sin(t * 6 + i) * 20; if (kB > 0) s += g(rect(-300, -140, 600, 280, '#d8f0c8', 20, 'stroke="#2a6a3a" stroke-width="10"') + circ(0, 0, 90, 'none', 'stroke="#2a6a3a" stroke-width="8"') + t2(0, 28, '$', 110, '#2a6a3a', { weight: 900 }) + t2(-220, -70, '1', 60, '#2a6a3a', { weight: 900 }) + t2(220, 110, '1', 60, '#2a6a3a', { weight: 900 }), `translate(${300 + i * 240} ${(1500 - i * 70 + bob).toFixed(0)}) rotate(${-14 + i * 14}) scale(${(0.7 * kB).toFixed(3)})`); }
      s += hit(540, 520, 'GOOD NEWS', pop(seg(t, T.good - 0.1, T.good + 0.1)) * (1 - seg(t, T.survived - 0.12, T.survived - 0.02)), '#ffffff', -5, 140);
      s += stamp(540, 520, 'CASH SURVIVED', seg(t, T.survived - 0.08, T.survived + 0.2) * (1 - seg(t, T.cotton - 0.15, T.cotton - 0.05)), '#ffffff', 5, 76);
      s += hit(540, 540, "IT'S COTTON", pop(seg(t, T.cotton - 0.1, T.cotton + 0.1)) * (1 - seg(t, T.broke - 0.25, T.broke - 0.15)), '#ffe04a', -4, 120);
      s += stamp(540, 820, 'STILL BROKE', seg(t, T.broke - 0.1, T.broke + 0.15), '#ff2a3a', -6, 100);
      s += flash(t, C[6], 0.6) + flash(t, T.cash - 0.05, 0.5) + flash(t, T.broke - 0.05, 0.7, '#c8102e', 0.25);
      return g(cam(fin(s), 0, { z0: punch(t, [T.good, T.cash, T.cotton, T.broke], 0.1), z1: 1, oy: 1200 }), shake(t, [T.cash, T.cotton, T.broke], 30)) + pill('ALIVE. BROKE.');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['STEEL?', 'SALT?', 'SAND?', 'SILICON?', 'IRON?', 'COTTON?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 }) + shreds(t, C[7], 540, 960, { n: 50, spread: 1300, seed: 50 });
      s += bigText(540, 520, 'WHAT', 1, { size: 170 }) + bigText(540, 700, 'VANISHES', 1, { size: 150, col: '#ffcf6a' }) + bigText(540, 880, 'NEXT?', 1, { size: 170 });
      s += bigText(540, 1520, opts[i], 1, { size: 120, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
