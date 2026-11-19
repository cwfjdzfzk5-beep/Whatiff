// "What if every sound on Earth got 100 times louder for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { vgrad, grade, t2, runShots } from './lib2.js';
import { pop, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const FANC = ['#c8102e', '#2f6fd6', '#ffcf3a', '#2fae6a', '#ff7a1a', '#a64ad6'];
// small faceless figure (origin ~ hips, head centre at y - 40*s)
const fig = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : `<path d="M-18,0 L-30,40 M18,0 L30,40" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
// expanding sound-wave rings
const waves = (t, t0, x, y, { col = '#ffffff', n = 4, sp = 0.1, R = 1100, life = 0.6, w = 18, a = 0.95 } = {}) => {
  let s = ''; for (let i = 0; i < n; i++) { const d = t - t0 - i * sp; if (d < 0 || d > life) continue; const k = d / life; s += circ(x, y, 40 + R * k, 'none', `stroke="${col}" stroke-width="${(w * (1 - k) + 2).toFixed(1)}" opacity="${(a * (1 - k)).toFixed(2)}"`); }
  return s;
};
// sound arcs on one side (for a mouth / speaker)
const arcs = (t, t0, x, y, dir = 1, col = '#ffffff', n = 3, R = 380) => { let s = ''; for (let i = 0; i < n; i++) { const d = ((t - t0) * 2.2 + i / n) % 1; if (t < t0) break; const r = 30 + R * d; s += `<path d="M${x + dir * r * 0.5},${y - r * 0.86} A${r},${r} 0 0 ${dir > 0 ? 1 : 0} ${x + dir * r * 0.5},${y + r * 0.86}" stroke="${col}" stroke-width="${(14 * (1 - d) + 2).toFixed(1)}" fill="none" opacity="${(1 - d).toFixed(2)}"/>`; } return s; };
const shards = (t, t0, x, y, seed) => debris(t, t0, x, y, { n: 10, col: '#d8f0ff', spread: 520, seed, size: 16 });
const car = (x, y, col, s = 1, alarm = 0, t = 0, cracked = '') => g(rect(-230, -110, 460, 110, col, 34) + `<path d="M-150,-110 L-90,-200 L110,-200 L170,-110Z" fill="${col}"/>` + `<path d="M-130,-116 L-82,-186 L0,-186 L0,-116Z M14,-116 L14,-186 L100,-186 L150,-116Z" fill="#1a2230"/>` + cracked + rect(205, -90, 26, 22, alarm && Math.sin(t * 30) > 0 ? '#ffb000' : '#ffe9a8', 6) + rect(-228, -88, 22, 20, alarm && Math.sin(t * 30) > 0 ? '#ff2a00' : '#ff3b3b', 6) + (alarm && Math.sin(t * 30) > 0 ? glow(218, -80, 120, '#ffb000', 0.6) + glow(-218, -80, 120, '#ff2a00', 0.6) : '') + [-140, 140].map((dx) => circ(dx, 0, 52, '#141618') + circ(dx, 0, 26, '#b8c0cc')).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s})`);
const dog = (x, y, s, open = 0) => g(rect(-90, -70, 180, 70, '#b5763a', 34) + circ(100, -100, 50, '#b5763a') + `<path d="M${100 + 30},${-100 + 10} L${100 + 80 + open * 10},${-100 + 10 + open * 30}" stroke="#2a1a10" stroke-width="10" stroke-linecap="round"/>` + `<path d="M70,-140 L60,-90 L90,-120Z" fill="#7a4a20"/>` + circ(118, -112, 7, '#1a1010') + circ(146, -96, 9, '#1a1010') + [-60, -20, 40, 70].map((dx) => rect(dx, -10, 20, 60, '#b5763a', 8)).join('') + `<path d="M-90,-50 Q-140,-90 -130,-130" stroke="#b5763a" stroke-width="16" fill="none" stroke-linecap="round"/>`, `translate(${x} ${y}) scale(${s})`);
const suitcase = (x, y, rot, col) => g(rect(-60, -45, 120, 90, col, 12) + rect(-20, -60, 40, 18, '#2a2e36', 6) + rect(-60, -6, 120, 8, '#000000', 2, 'opacity="0.2"'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})`);

export async function init() {
  const W = await (await fetch('/work/loud5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), sneezed: wt('sneezed', 0), window: wt('window', 0), gone: wt('gone', 0), sound: wt('sound', 0), hundred: wt('hundred', 0), louder: wt('louder', 0), five: wt('five', 0),
    dog: wt('dog', 2), barks: wt('barks', 2), alarm: wt('alarm', 2), off: wt('off', 2), windshield: wt('windshield', 2), cracks: wt('cracks', 2),
    stadium: wt('stadium', 4), sixty: wt('sixty', 4), scream: wt('scream', 4), goal: wt('goal', 4), goalie: wt('goalie', 4), blasted: wt('blasted', 4), net: wt('net', 4),
    library: wt('library', 6), opens: wt('opens', 6), chips: wt('chips', 6), shelf: wt('shelf', 6), down: wt('down', 6), dominoes: wt('dominoes', 6),
    baby: wt('baby', 8), cries: wt('cries', 8), plane: wt('plane', 8), overhead: wt('overhead', 8), bursts: wt('bursts', 8), suitcases: wt('suitcases', 8), everywhere: wt('everywhere', 8),
    metal: wt('metal', 10), chord: wt('chord', 10), speakers: wt('speakers', 10), cannons: wt('cannons', 10), front: wt('front', 10), now: wt('now', 10), back10: wt('back', 10),
    back: wt('back', 11), alive: wt('alive', 11), ears: wt('ears', 11), ringing: wt('ringing', 11), boss: wt('boss', 11), yelling: wt('yelling', 11), good: wt('good', 11), hear: wt('hear', 11),
    next: wt('next', 12), worse: wt('worse', 12),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  // countdown card: equalizer bars slamming + shock rings
  const card = (n) => (t) => {
    const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.2, vertical: true, dir: -1, seed: n });
    const r = rng(n * 7);
    for (let i = 0; i < 14; i++) { const h = 120 + 520 * Math.abs(Math.sin(t * (9 + r() * 8) + i)) * clamp((t - t0) * 6); s += rect(30 + i * 74, 1880 - h, 56, h, '#ffd0d6', 10, 'opacity="0.55"'); }
    s += waves(t, t0, 540, 860, { col: '#ffd0d6', n: 3, R: 900, life: 0.5 });
    s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1360, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 });
    s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 34)) + bar(t);
  };

  // street with buildings whose windows shatter from the centre outward
  const street = (t, ts) => {
    let s = vgrad('#3a90ec', '#cfe6fb', 0, 1200); const B = [[-20, 300, 380, '#e8b070'], [360, 200, 360, '#d0785a'], [720, 340, 380, '#8aa0c0']];
    let sh = '';
    for (const [bx, by, bw, bc] of B) {
      s += rect(bx, by, bw, 1300 - by, bc);
      for (let yy = by + 60; yy < 1180; yy += 150) for (let xx = bx + 40; xx < bx + bw - 80; xx += 110) {
        const dist = Math.hypot(xx - 540, yy - 1250) / 1400, tb = ts + dist * 1.6;
        if (t < tb) s += rect(xx, yy, 70, 100, '#bfe2ff', 6) + rect(xx + 8, yy + 8, 18, 84, '#ffffff', 4, 'opacity="0.5"');
        else { s += rect(xx, yy, 70, 100, '#1a2230', 6); sh += shards(t, tb, xx + 35, yy + 50, Math.round(xx + yy)); }
      }
    }
    return s + rect(0, 1300, 1080, 620, '#5a5e66') + rect(0, 1300, 1080, 40, '#9a9ea6') + sh;
  };

  const shots = [
    // 0 hook: you sneeze, every window on the street explodes
    [0, (t) => {
      const ts = 0.06;
      let s = street(t, ts);
      s += fig(540, 1700 - (t > ts && t < ts + 0.3 ? 20 : 0), 3, '#3c4350', t > ts - 0.25 && t < ts ? -12 : t > ts && t < ts + 0.3 ? 14 : 0, false);
      s += waves(t, ts, 540, 1580, { n: 8, sp: 0.22, R: 1500, life: 0.7, col: '#ffffff' });
      if (t > ts) s += speedLines(t, { a: 0.25, seed: 2 });
      s += hit(540, 620, 'BAD NEWS.', pop(seg(t, T.news - 0.2, T.news)) * (1 - seg(t, T.window - 0.1, T.window)), '#ff2a3a', -6, 150);
      s += hit(540, 640, 'ACHOO!', pop(seg(t, 0, 0.1)) * (1 - seg(t, T.news - 0.25, T.news - 0.2)), '#ffcf3a', -8, 230);
      s += chip(540, 860, 'YOU. SNEEZING.', pop(seg(t, T.sneezed - 0.1, T.sneezed + 0.05)) * (1 - seg(t, T.window - 0.1, T.window)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 640, 'EVERY WINDOW: GONE', seg(t, T.window - 0.05, T.window + 0.1) * (1 - seg(t, T.sound - 0.1, T.sound)), '#ff2a3a', -5, 64);
      s += stamp(540, 560, 'EVERY SOUND', seg(t, T.sound - 0.1, T.sound + 0.05), '#ffffff', -4, 84);
      s += hit(540, 760, 'x100 LOUDER', pop(seg(t, T.hundred - 0.1, T.hundred + 0.1)), '#ffcf3a', 4, 130);
      s += hit(540, 940, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), '#ff2a3a', -4, 120);
      s += flash(t, ts, 0.9) + flash(t, T.sneezed, 0.5) + flash(t, T.hundred - 0.1, 0.4) + flash(t, T.five - 0.1, 0.5, '#ff2a3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [0.05, T.news, T.sneezed, T.gone, T.hundred, T.five], 0.12), z1: 1, oy: 1100 }), shake(t, [0.05, 0.3, T.sneezed, T.gone, T.five], 34)) + pill('x100 LOUDER');
    }],
    [N[0], card(1)],
    // 2 dog barks; every car alarm; every windshield cracks
    [C[0], (t) => {
      const FL = 1640; let s = vgrad('#3a90ec', '#d8ecfc', 0, FL) + rect(0, 760, 1080, FL - 760, '#e8d8b8') + [...Array(5)].map((_, i) => rect(40 + i * 210, 860, 150, 200, '#9ac0d8', 8)).join('') + rect(0, FL, 1080, 280, '#5a5e66') + rect(0, FL - 30, 1080, 30, '#9a9ea6');
      const tb = T.barks - 0.04, ta = T.alarm, tc = T.cracks - 0.05;
      const bark = (Math.floor((t - tb) * 5) % 2 === 0) && t > tb ? 1 : 0;
      s += dog(170, FL - 60, 1.6, bark);
      s += arcs(t, tb, 340, FL - 220, 1, '#ffffff', 3, 420);
      const cars = [[640, 1500, '#c8102e', 0.9], [470, 1780, '#2f6fd6', 1.05], [900, 1820, '#ffcf3a', 1.0]];
      for (const [cx, cy, col, cs] of cars) {
        const cr = t > tc ? `<g>${crack(t, tc, -40, -150, Math.round(cx), '#ffffff')}</g>` : '';
        s += car(cx, cy, col, cs, t > ta ? 1 : 0, t, cr);
        if (t > ta) s += waves(t, ta + (cx % 3) * 0.05, cx, cy - 120, { n: 3, R: 500, life: 0.45, col: '#ffb000', w: 10 }) + waves(t, ta + 0.6, cx, cy - 120, { n: 3, R: 500, life: 0.45, col: '#ffb000', w: 10 });
      }
      if (t > tc) s += shards(t, tc, 640, 1360, 3) + shards(t, tc + 0.05, 470, 1600, 4) + shards(t, tc + 0.1, 900, 1640, 5);
      s += hit(540, 600, 'WOOF.', pop(seg(t, tb - 0.05, tb + 0.08)) * (1 - seg(t, ta - 0.1, ta)), '#ffcf3a', -6, 220);
      s += stamp(540, 600, 'EVERY CAR ALARM', seg(t, ta - 0.05, ta + 0.1) * (1 - seg(t, tc - 0.1, tc)), '#ff2a3a', -5, 72);
      s += hit(540, 620, 'CRACK.', pop(seg(t, tc, tc + 0.1)), '#ffffff', -6, 220);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, tb, 0.5) + flash(t, ta, 0.4, '#ffb000') + flash(t, tc, 0.85);
      return g(cam(fin(s), 0, { z0: punch(t, [tb, ta, T.off, tc], 0.1), z1: 1.03, oy: 1300 }), shake(t, [tb, ta, tc], 32)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 stadium: 60,000 fans scream GOAL, goalie blasted into his own net
    [C[1], (t) => {
      let s = vgrad('#3a90ec', '#d8ecfc', 0, 420) + rect(0, 380, 1080, 640, '#3a3f4a');
      const r = rng(11); const tg = T.goal - 0.04;
      for (let row = 0; row < 8; row++) for (let i = 0; i < 18; i++) { const x = i * 62 + (row % 2) * 31, y = 430 + row * 72 + (t > T.scream ? -Math.abs(Math.sin(t * 14 + i + row)) * 16 : 0); s += circ(x, y, 22, FANC[Math.floor(r() * 6)]) + circ(x, y - 30, 14, '#e8b894'); }
      s += rect(0, 1010, 1080, 910, '#2fae6a') + [...Array(5)].map((_, i) => rect(0, 1080 + i * 170, 1080, 80, '#36c078')).join('') + rect(0, 1020, 1080, 10, '#ffffff');
      // goal on the right
      const tb = T.blasted - 0.06, kb = pop(seg(t, tg + 0.05, tb + 0.15));
      const bulge = 60 * kb;
      s += rect(780, 1320, 20, 400, '#ffffff', 4) + rect(780, 1320, 300, 18, '#ffffff', 4);
      for (let i = 0; i < 8; i++) s += `<path d="M${800 + i * 40},1338 Q${800 + i * 40 + bulge},1520 ${800 + i * 40},1720" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.7"/>`;
      for (let j = 0; j < 9; j++) s += `<path d="M800,${1338 + j * 45} L1080,${1338 + j * 45 + bulge * 0.2}" stroke="#ffffff" stroke-width="3" opacity="0.7"/>`;
      const gx = lerp(640, 880, kb), gy = 1690 - Math.sin(kb * Math.PI) * 160 - kb * 60, grot = kb * 70;
      s += fig(gx, gy, 2.4, '#ffcf3a', grot, kb > 0.05);
      // ball
      const bx = lerp(500, 980, kb), by = 1650 - Math.sin(kb * Math.PI) * 220; s += circ(bx, by, 26, '#ffffff', 'stroke="#1a1c20" stroke-width="5"');
      s += waves(t, tg, 540, 650, { n: 5, R: 1600, life: 0.8, col: '#ffffff', w: 22 });
      if (t > tg) s += speedLines(t, { a: 0.3, seed: 8 });
      s += chip(540, 1820, 'LOUDEST CROWD EVER: 142 DB', pop(seg(t, T.sixty - 0.05, T.sixty + 0.1)) * (1 - seg(t, tg - 0.1, tg)), { size: 44, col: '#fff', bg: '#141a22' });
      s += hit(540, 760, 'GOAL!', pop(seg(t, tg - 0.05, tg + 0.1)) * (1 - seg(t, tb - 0.1, tb)), '#ffcf3a', -6, 260);
      s += stamp(540, 760, 'x100', seg(t, tg + 0.15, tg + 0.3) * (1 - seg(t, tb - 0.1, tb)), '#ff2a3a', 8, 90);
      s += stamp(540, 760, 'OWN NET.', seg(t, T.net - 0.1, T.net + 0.08), '#ff2a3a', -6, 110);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, tg, 0.9) + flash(t, tb, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.stadium, T.sixty, tg, tb, T.net], 0.1), z1: 1.03, oy: 1200 }), shake(t, [tg, tg + 0.2, tb], 40, 6)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 library: a bag of chips, every shelf goes down like dominoes
    [C[2], (t) => {
      const FL = 1720; let s = vgrad('#f4e6c8', '#e0c89a', 0, FL) + rect(0, FL, 1080, 200, '#8a5a3a') + rect(0, 380, 1080, 30, '#c8a070');
      const tc = T.chips - 0.02, td = T.shelf - 0.05;
      const SH = 6, w = 150, h = 880;
      let sh = '';
      for (let i = 0; i < SH; i++) {
        const x0 = 40 + i * 180, t0 = td + i * 0.16, k = clamp((t - t0) / 0.32), ang = (i === SH - 1 ? 88 : 62) * k * k;
        let books = ''; const r = rng(i + 3);
        for (let row = 0; row < 5; row++) { let bx = 8; while (bx < w - 20) { const bw = 14 + r() * 14; books += rect(bx, 20 + row * 172 + (30 - r() * 20), bw, 140 - r() * 20, FANC[Math.floor(r() * 6)], 3); bx += bw + 3; } books += rect(0, 20 + row * 172 + 150, w, 14, '#6a4026'); }
        sh += g(rect(0, 0, w, h, '#7a4a2a', 6) + books, `translate(${x0} ${FL - h}) rotate(${ang.toFixed(1)} ${w} ${h})`);
        if (k >= 1) sh += debris(t, t0 + 0.32, x0 + w + 200, FL - 60, { n: 14, col: FANC[i % 6], seed: 30 + i, size: 26, spread: 600 });
      }
      s += sh;
      // you in front, opening the bag
      const kk = seg(t, T.opens - 0.1, tc);
      s += fig(220, 1820, 2.6, '#3c4350', 0, false) + g(rect(-50, -70, 100, 140, '#ffcf3a', 14) + rect(-50, -70, 100, 26, '#c8102e', 6) + t2(0, 20, 'CHIPS', 26, '#c8102e', { weight: 900 }), `translate(${300 + kk * 10} ${1700}) rotate(${(kk * 10).toFixed(0)})`);
      s += waves(t, tc, 300, 1640, { n: 4, R: 1400, life: 0.6, col: '#ffffff' });
      if (t > tc && t < tc + 0.3) s += debris(t, tc, 300, 1640, { n: 12, col: '#ffe08a', seed: 4, size: 16, spread: 500 });
      s += chip(540, 600, 'LIBRARY. SHHH.', pop(seg(t, T.library - 0.05, T.library + 0.1)) * (1 - seg(t, tc - 0.1, tc)), { size: 54, col: '#fff', bg: '#141a22' });
      s += hit(540, 620, 'CRINKLE.', pop(seg(t, tc, tc + 0.1)) * (1 - seg(t, td - 0.1, td)), '#ffcf3a', -6, 200);
      s += stamp(540, 620, 'DOMINOES.', seg(t, T.dominoes - 0.1, T.dominoes + 0.08), '#ff2a3a', -6, 120);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, tc, 0.85) + flash(t, td + 0.8, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [tc, td, td + 0.32, td + 0.8, T.dominoes], 0.1), z1: 1.03, oy: 1300 }), shake(t, [tc, td + 0.32, td + 0.64, td + 0.96, td + 1.12], 30)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 plane cabin: baby cries, every bin bursts open, suitcases everywhere
    [C[3], (t) => {
      let s = vgrad('#9fd0ff', '#d8ecfc', 0, 1920) + rect(0, 420, 1080, 1500, '#efe6d8') + rect(0, 1720, 1080, 200, '#4a5a7a');
      for (let i = 0; i < 4; i++) s += `<ellipse cx="${140 + i * 270}" cy="900" rx="56" ry="80" fill="#5aa8f0" stroke="#c8beb0" stroke-width="12"/>`;
      const tc = T.cries - 0.04, tb = T.bursts - 0.06, tsu = T.suitcases - 0.1;
      // bins
      let bins = '', bags = '';
      for (let i = 0; i < 4; i++) {
        const x0 = 10 + i * 270, t0 = tb + i * 0.07, k = pop(seg(t, t0, t0 + 0.15));
        bins += rect(x0, 470, 250, 230, '#d8d0c4', 10);
        bins += g(rect(0, 0, 250, 230, '#f4f0ea', 10, 'stroke="#b8b0a4" stroke-width="5"') + rect(100, 190, 50, 14, '#8a8478', 5), `translate(${x0} ${470}) rotate(${(-110 * k).toFixed(0)} 0 0)`);
        for (let j = 0; j < 2; j++) { const tj = t0 + 0.08 + j * 0.25, d = Math.max(0, t - tj); const y = Math.min(1640 - j * 90, 600 + 1500 * d * d + 200 * d); if (t > tj) bags += suitcase(x0 + 80 + j * 90 + d * 120 * (j ? 1 : -1), y, d * 200 * (j ? 1 : -1) * (y < 1600 - j * 90 ? 1 : 0.3), FANC[(i * 2 + j) % 6]); }
      }
      s += bins;
      // seats and passengers (heads ~1380, clear of captions)
      for (let i = 0; i < 4; i++) { const x = 140 + i * 270; s += rect(x - 80, 1360, 160, 340, '#2f5aa8', 30) + rect(x - 70, 1330, 140, 70, '#3a6ad6', 24); if (i !== 1) s += circ(x, 1380, 34, '#e8b894') + circ(x, 1356, 34, ['#3a2a20', '#b5823a', '#1f1a17', '#6a4a2a'][i], 'opacity="0.9"'); }
      // parent + baby (seat 2)
      s += circ(410, 1380, 34, '#e8b894') + circ(410, 1352, 30, '#6a4a2a') + circ(470, 1450, 26, '#f6d3b6') + rect(440, 1460, 70, 60, '#ffd0e0', 20);
      s += arcs(t, tc, 500, 1430, 1, '#ffffff', 3, 360) + arcs(t, tc, 440, 1430, -1, '#ffffff', 3, 360);
      s += waves(t, tc, 470, 1440, { n: 4, R: 1300, life: 0.6 });
      s += bags;
      s += hit(540, 1000 - 0, 'WAAAH!', pop(seg(t, tc - 0.05, tc + 0.1)) * (1 - seg(t, tb - 0.1, tb)), '#ffcf3a', -6, 210);
      s += stamp(540, 980, 'EVERY BIN', seg(t, tb, tb + 0.12) * (1 - seg(t, tsu - 0.1, tsu)), '#ff2a3a', -6, 90);
      s += stamp(540, 960, 'SUITCASES EVERYWHERE', seg(t, tsu, tsu + 0.12), '#c8102e', -5, 58);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, tc, 0.6) + flash(t, tb, 0.8);
      return g(cam(fin(s), 0, { z0: punch(t, [tc, tb, tb + 0.21, tsu, T.everywhere], 0.1), z1: 1.03, oy: 1100 }), shake(t, [tc, tb, tb + 0.3, tsu + 0.3], 32)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 metal concert: first chord, speakers fire like cannons, front row -> back row
    [C[4], (t) => {
      let s = vgrad('#3a1a6a', '#c8306a', 0, 1920);
      const tch = T.chord - 0.04, tf = T.cannons - 0.15;
      for (let i = 0; i < 5; i++) { const x = 140 + i * 200, a = Math.sin(t * 3 + i) * 0.3; s += `<path d="M${x},380 L${x - 180 + a * 400},1000 L${x + 180 + a * 400},1000Z" fill="${['#ffcf3a', '#2fd6c8', '#ff7a1a', '#ffffff', '#2fd6c8'][i]}" opacity="0.22"/>`; }
      s += rect(0, 960, 1080, 70, '#1a1c22');
      const spk = (x) => rect(x, 520, 220, 440, '#141618', 10) + [600, 760, 890].map((y, j) => circ(x + 110, y, j === 2 ? 40 : 66, '#3a3f4a') + circ(x + 110, y, j === 2 ? 16 : 26, '#0a0b0e')).join('');
      const sk = t > tf ? 1 + 0.06 * Math.abs(Math.sin(t * 40)) : 1;
      s += g(spk(30) + spk(830), `translate(540 740) scale(${sk.toFixed(3)}) translate(-540 -740)`);
      if (t > tf) for (const x of [140, 940]) { s += waves(t, tf, x, 700, { n: 6, sp: 0.08, R: 1300, life: 0.6, col: '#ffcf3a', w: 26 }); s += glow(x, 700, 300, '#ffcf3a', 0.6 * Math.max(0, 1 - (t - tf) * 2)); }
      // guitarist
      s += fig(540, 900, 2.3, '#1a1c22', t > tch ? -8 : 0, false) + `<path d="M500,880 L640,820" stroke="#c8102e" stroke-width="22" stroke-linecap="round"/>`;
      // crowd: pushed from the front to the back
      const kb = pop(seg(t, tf + 0.05, tf + 0.55));
      for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) {
        const x = 70 + i * 118 + (row % 2) * 50, y0 = 1460 + row * 140, y = y0 + kb * (250 - row * 90), rot = kb * (i % 2 ? 30 : -30) * (1 + row * 0.3);
        if (y < 2100) s += fig(x + kb * (i - 4) * 14, y + Math.sin(t * 10 + i) * 8 * (1 - kb), (1.7 - row * 0.05) * (1 - kb * 0.15), FANC[(i + row) % 6], rot, true);
      }
      if (t > tf) s += speedLines(t, { a: 0.3, vertical: true, dir: 1, seed: 6 });
      s += stamp(540, 640 - 40, 'FIRST CHORD.', seg(t, tch - 0.05, tch + 0.1) * (1 - seg(t, tf - 0.1, tf)), '#ffffff', -5, 84);
      s += hit(540, 620, 'BOOM.', pop(seg(t, tf, tf + 0.1)) * (1 - seg(t, T.front - 0.1, T.front)), '#ffcf3a', -6, 240);
      s += chip(540, 600, 'FRONT ROW?', pop(seg(t, T.front - 0.05, T.front + 0.1)) * (1 - seg(t, T.now - 0.1, T.now)), { size: 60, col: '#fff', bg: '#141a22' });
      s += stamp(540, 620, 'NOW: BACK ROW', seg(t, T.now - 0.05, T.now + 0.1), '#ff2a3a', -6, 84);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, tch, 0.6) + flash(t, tf, 0.95, '#fff4c0');
      return g(cam(fin(s, 0.3), 0, { z0: punch(t, [T.metal, tch, tf, tf + 0.2, T.back10], 0.12), z1: 1.03, oy: 1100 }), shake(t, [tch, tf, tf + 0.15, tf + 0.3], 46, 6)) + bar(t) + pill('SECOND 5');
    }],
    // 11 sound is back: alive, ears ringing ... boss yelling, you can't hear him
    [C[5], (t) => {
      const sw = t >= T.boss - 0.12; let s = '';
      if (!sw) {
        s += vgrad('#2fae6a', '#0c5a30') + speedLines(t, { a: 0.16, seed: 15 });
        s += fig(540, 1720, 4.2, '#3c4350', Math.sin(t * 3) * 4, false);
        // ringing squiggles around the head (head centre ~1552)
        if (t > T.ears - 0.1) for (const dir of [-1, 1]) for (let i = 0; i < 3; i++) { const r = 130 + i * 70 + ((t * 120) % 70); s += `<path d="M${540 + dir * r},${1480 - i * 10} l${dir * 20},-24 l${dir * 20},24 l${dir * 20},-24 l${dir * 20},24" stroke="#ffcf3a" stroke-width="10" fill="none" stroke-linecap="round" opacity="${(1 - i * 0.25).toFixed(2)}"/>`; }
        s += stamp(540, 600, 'SOUND: BACK', seg(t, C[5], C[5] + 0.15) * (1 - seg(t, T.alive - 0.15, T.alive - 0.05)), '#ffffff', -6, 96);
        s += stamp(540, 600, 'ALIVE.', seg(t, T.alive - 0.05, T.alive + 0.1) * (1 - seg(t, T.ears - 0.15, T.ears - 0.05)), '#ffffff', 5, 150);
        s += hit(540, 640, 'EEEEEEEEE', pop(seg(t, T.ears - 0.05, T.ears + 0.1)), '#ffcf3a', -4, 150);
        s += flash(t, C[5], 0.9, '#c8ffd8') + flash(t, T.alive - 0.05, 0.5);
        return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.alive, T.ears, T.ringing], 0.1), z1: 1.02, oy: 1300 }), shake(t, [C[5], T.alive], 30)) + pill('SOUND: BACK');
      }
      // office: boss yelling, you hear nothing
      const FL = 1760; s += vgrad('#f4f6fa', '#dfe6f0', 0, FL) + rect(0, FL, 1080, 160, '#8a94a4') + rect(60, 520, 420, 300, '#9ac0d8', 8) + rect(80, 540, 380, 260, '#cfe6fb', 4);
      s += rect(120, 1500, 420, 30, '#c8a070', 6) + rect(150, 1530, 20, 230, '#8a6a4a') + rect(490, 1530, 20, 230, '#8a6a4a') + rect(240, 1380, 180, 120, '#1a1c22', 8);
      s += fig(330, 1700, 2.6, '#3c4350', 0, false);
      const by = 1700 + Math.sin(t * 22) * 6;
      s += fig(820, by, 3, '#2a2e36', Math.sin(t * 18) * 5, true) + `<path d="M820,${by - 30} l-10,90 l10,20 l10,-20Z" fill="#c8102e"/>`;
      s += arcs(t, T.boss, 740, by - 120, -1, '#ff2a3a', 4, 420);
      // muted icon
      const mk = pop(seg(t, T.good - 0.05, T.good + 0.1));
      if (mk > 0) s += g(rect(-60, -40, 50, 80, '#141a22', 6) + `<path d="M-10,-40 L50,-90 L50,90 L-10,40Z" fill="#141a22"/>` + `<path d="M80,-50 L170,50 M170,-50 L80,50" stroke="#ff2a3a" stroke-width="22" stroke-linecap="round"/>`, `translate(300 940) scale(${mk.toFixed(3)})`);
      s += chip(540, 620, 'YOUR BOSS. YELLING.', pop(seg(t, T.boss - 0.1, T.boss + 0.05)) * (1 - seg(t, T.good - 0.1, T.good)), { size: 52, col: '#fff', bg: '#141a22' });
      s += chip(620, 620, 'GOOD NEWS:', pop(seg(t, T.good - 0.05, T.good + 0.1)) * (1 - seg(t, T.hear - 0.2, T.hear - 0.1)), { size: 56, col: '#fff', bg: '#2fae6a' });
      s += stamp(540, 640, "CAN'T HEAR HIM.", seg(t, T.hear - 0.15, T.hear), '#2fae6a', -6, 90);
      s += flash(t, T.boss - 0.12, 0.6) + flash(t, T.hear - 0.15, 0.4, '#c8ffd8');
      return g(cam(fin(s), 0, { z0: punch(t, [T.boss, T.yelling, T.good, T.hear], 0.1), z1: 1.04, oy: 1300 }), shake(t, [T.yelling, T.hear], 24)) + pill('THE BOSS');
    }],
    // 12 CTA
    [C[6], (t) => {
      const opts = ['MIRRORS?', 'STAIRS?', 'DOORS?', 'SALT?', 'THE SUN?', 'TIME?'];
      const i = Math.floor((t - C[6]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      for (let j = 0; j < 14; j++) { const h = 100 + 300 * Math.abs(Math.sin(t * (8 + j % 5) + j)); s += rect(30 + j * 74, 1900 - h, 56, h, '#ffd0d6', 10, 'opacity="0.45"'); }
      s += bigText(540, 520, 'WHAT', 1, { size: 150 }) + bigText(540, 700, 'BREAKS', 1, { size: 170, col: '#ffcf6a' }) + bigText(540, 880, 'NEXT?', 1, { size: 170 });
      s += bigText(540, 1500, opts[i], 1, { size: 110, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[6], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[6], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
