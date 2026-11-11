// "What if air resistance switched off for five seconds?" — HYPE format.
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const DIVER = { ...YOU, top: '#ff7a1a', pants: '#ff7a1a', hair: '#1d222c', hairStyle: 'cap' };
// horizontal skydiver: feet at (x,y), head at (x - 500*s, y)
const diver = (x, y, s, face = 'tense', wob = 0) => g(adult({ ...DIVER, x: 0, y: 0, s: 1, face, pose: 'up' }), `translate(${x} ${y}) rotate(${-90 + wob}) scale(${s})`);
const clouds = (t, v, seed = 1, a = 0.75) => { const r = rng(seed); let s = ''; for (let i = 0; i < 9; i++) { const x = r() * 1180 - 50, y0 = r() * 2400, w = 160 + r() * 220; const y = ((y0 - t * v * (0.6 + r())) % 2400 + 2400) % 2400 - 240; s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${w.toFixed(0)}" ry="${(w * 0.32).toFixed(0)}" fill="#ffffff" opacity="${a}"/>`; } return s; };
const limpChute = (t, x, y, s = 1) => { const L1 = [], R1 = []; for (let i = 0; i <= 12; i++) { const yy = (y - i * 34 * s).toFixed(0), w = 60 * s + i * 4 * s; L1.push(`${(x - w + Math.sin(t * 22 + i * 0.9) * 26 * s).toFixed(0)},${yy}`); R1.push(`${(x + w + Math.sin(t * 24 + i * 0.8 + 1) * 26 * s).toFixed(0)},${yy}`); } return `<path d="M${L1.join(' L')} L${R1.reverse().join(' L')}Z" fill="#2fae6a" opacity="0.92"/>`; };
const canopy = (x, y, w, k) => k <= 0 ? '' : g(`<path d="M${-w / 2},0 Q0,${-w * 0.42} ${w / 2},0 Q${w * 0.25},${-w * 0.06} 0,${-w * 0.02} Q${-w * 0.25},${-w * 0.06} ${-w / 2},0Z" fill="#2fae6a"/>` + [...Array(5)].map((_, i) => `<path d="M${-w / 2 + (i * w) / 4},${-w * 0.02} L0,${w * 0.75}" stroke="#e8ecf2" stroke-width="4"/>`).join('') + `<path d="M${-w * 0.3},${-w * 0.2} Q0,${-w * 0.36} ${w * 0.3},${-w * 0.2}" stroke="#ffffff" stroke-width="10" fill="none" opacity="0.35"/>`, `translate(${x} ${y}) scale(${(0.3 + 0.7 * pop(k)).toFixed(3)})`);
const umbrella = (x, y, k, col, t) => { const inv = k; const dy = lerp(-90, 70, inv) + Math.sin(t * 40 + x) * 8 * (inv > 0 && inv < 1 ? 1 : 0.3); return g(`<path d="M-150,0 Q0,${dy * 2.2} 150,0 Z" fill="${col}"/><path d="M0,0 L0,190" stroke="#2a2c30" stroke-width="8"/><path d="M0,190 q0,22 -20,22" stroke="#2a2c30" stroke-width="8" fill="none"/>`, `translate(${x} ${y})`); };
const hammer = (x, y, rot) => g(rect(-10, -10, 20, 150, '#a8743a', 6) + rect(-55, -40, 110, 46, '#5a616c', 8), `translate(${x} ${y}) rotate(${rot})`);
const feather = (x, y, rot) => g(`<path d="M0,-90 Q46,-20 8,90 L-4,90 Q-46,-20 0,-90Z" fill="#f4f0e6"/><path d="M0,-80 L2,110" stroke="#c8b89a" stroke-width="4"/>` + [...Array(6)].map((_, i) => `<path d="M2,${-50 + i * 24} l26,-14 M0,${-50 + i * 24} l-26,-14" stroke="#d8ccb4" stroke-width="2"/>`).join(''), `translate(${x} ${y}) rotate(${rot})`);
const palm = (x, y, bend, s = 1) => { const tx = x + bend * 260 * s, ty = y - 520 * s; let fr = ''; for (let i = 0; i < 7; i++) { const a = -160 + i * 25 + bend * 70; const r = 190 * s; const ex = tx + Math.cos((a * Math.PI) / 180) * r + bend * 120 * s, ey = ty + Math.sin((a * Math.PI) / 180) * r * 0.6 + 40 * s; fr += `<path d="M${tx},${ty} Q${(tx + ex) / 2},${Math.min(ty, ey) - 60 * s} ${ex.toFixed(0)},${ey.toFixed(0)}" stroke="#2f8a4a" stroke-width="${26 * s}" fill="none" stroke-linecap="round"/>`; } return `<path d="M${x},${y} Q${x + bend * 40 * s},${y - 280 * s} ${tx},${ty}" stroke="#8a6a3a" stroke-width="${30 * s}" fill="none" stroke-linecap="round"/>` + fr; };
const fields = (k) => { const sc = lerp(1, 3.2, k); let s = rect(0, 0, 1080, 1920, '#6a9a4a'); const r = rng(21); for (let i = 0; i < 26; i++) { const x = r() * 1080, y = r() * 1920, w = 120 + r() * 220, h = 80 + r() * 160; s += rect(x - w / 2, y - h / 2, w, h, ['#8ab85a', '#5a8a3a', '#c8b86a', '#7aa84a', '#a8c870'][i % 5], 6); } s += `<path d="M-100,1300 Q540,900 1200,1100" stroke="#8a8e94" stroke-width="22" fill="none"/>`; return g(s, `translate(540 1100) scale(${sc.toFixed(3)}) translate(-540 -1100)`); };
const hairUp = (x, y, s, t) => { let p = ''; for (let i = 0; i < 7; i++) { const a = -30 + i * 10, bx = x + (-30 + i * 10) * s, by = y - 540 * s; p += `<path d="M${bx},${by} l${(a * 0.5 + Math.sin(t * 30 + i) * 3) * s},${-90 * s}" stroke="#3a2c22" stroke-width="${14 * s}" stroke-linecap="round"/>`; } return p; };

export async function init() {
  const W = await (await fetch('/work/drag5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), sky: wt('skydiving', 0), air: wt('air', 0), off: wt('off', 0), five: wt('five', 0),
    parachute: wt('parachute', 2), useless: wt('useless', 2), gravity: wt('gravity', 2), twenty: wt('twenty', 2), every2: wt('every', 2), single: wt('single', 2), second2: wt('second', 2),
    raindrop: wt('raindrop', 4), speeds: wt('speeds', 4), umbrellas: wt('umbrellas', 4), hammered: wt('hammered', 4), rain: wt('rain', 4), gravel: wt('gravel', 4),
    feather: wt('feather', 6), hammer: wt('hammer', 6), every6: wt('every', 6), paper: wt('paper', 6), slams: wt('slams', 6), floor: wt('floor', 6),
    storm: wt('storm', 8), roofs: wt('roofs', 8), wind: wt('wind', 8), nothing: wt('nothing', 8), push: wt('push', 8), palm: wt('palm', 8), snap: wt('snap', 8),
    curveball: wt('curveball', 10), dead: wt('dead', 10), straight: wt('straight', 10), you10: wt('you', 10), two: wt('two', 10), hour10: wt('hour', 10),
    back: wt('back', 11), hits: wt('hits', 11), wall: wt('wall', 11), parachute11: wt('parachute', 11), pops: wt('pops', 11),
    land: wt('land', 12), alive: wt('alive', 12), jelly: wt('jelly', 12), hair: wt('hair', 12), up: wt('up', 12), forever: wt('forever', 12),
    next: wt('next', 13), comment: wt('comment', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const mph = (t) => { const b = [...N, tEnd]; let n = 0; while (n < 4 && t >= b[n + 1]) n++; const f = clamp((t - b[n]) / (b[n + 1] - b[n])); return Math.round(120 + 22 * (n + f)); };
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) + chip(540, 490, `YOU: ${mph(t)} MPH`, 1, { size: 38, col: '#fff', bg: '#c8102e' }) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 hook: you are skydiving, air resistance switches off
    [0, (t) => {
      const kOff = seg(t, T.off - 0.05, T.off + 0.3), fast = 1 + 2.5 * kOff;
      let s = vgrad('#3a8ae0', '#bfe0fa') + clouds(t * fast, 900, 3) + speedLines(t, { a: 0.25 + 0.3 * kOff, vertical: true, dir: -1, seed: 2 });
      s += diver(880 + Math.sin(t * 9) * 10, 800 + kOff * 40, 1.3, t > T.air ? 'open' : 'neutral', Math.sin(t * 13) * 3 * (1 + kOff * 2));
      s += hit(540, 470, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)) * (1 - seg(t, T.sky - 0.1, T.sky)), '#ff2a3a', -5, 150);
      s += hit(540, 470, 'SKYDIVING', pop(seg(t, T.sky - 0.08, T.sky + 0.1)) * (1 - seg(t, T.air - 0.05, T.air + 0.05)), '#ff7a1a', -5, 140);
      s += stamp(540, 1500, 'AIR RESISTANCE: OFF', seg(t, T.off - 0.08, T.off + 0.2), '#ff2a3a', -7, 60);
      s += chip(540, 1700, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += flash(t, 0, 0.6) + flash(t, T.off - 0.05, 0.8);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.news, T.sky, T.off], 0.11), z1: 1, oy: 900 }), shake(t, [0.03, T.news, T.off], 32)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 parachute is useless, +22 mph every second
    [C[0], (t) => {
      const acc = 1 + (t - C[0]) * 0.8;
      let s = vgrad('#2a7ad6', '#a8d4f8') + clouds(t * 2.6 * acc, 900, 5) + speedLines(t, { a: 0.45, vertical: true, dir: -1, seed: 6 });
      const x = 900, y = 1560 + Math.sin(t * 11) * 12;
      s += limpChute(t, x - 260, y - 70, 1.5);
      s += diver(x, y, 1.2, 'tense', Math.sin(t * 17) * 5);
      s += stamp(540, 700, 'USELESS', seg(t, T.useless - 0.08, T.useless + 0.2), '#ff2a3a', -6, 90) ;
      const kG = pop(seg(t, T.twenty - 0.08, T.twenty + 0.12));
      s += hit(540, 900, '+22 MPH', kG, '#ffcf6a', 4, 170);
      s += chip(200, 1780, 'EVERY', pop(seg(t, T.every2 - 0.1, T.every2 + 0.08)), { size: 50, col: '#fff', bg: '#141a22' }) + chip(540, 1780, 'SINGLE', pop(seg(t, T.single - 0.1, T.single + 0.08)), { size: 50, col: '#fff', bg: '#141a22' }) + chip(870, 1780, 'SECOND', pop(seg(t, T.second2 - 0.1, T.second2 + 0.08)), { size: 50, col: '#fff', bg: '#c8102e' });
      s += flash(t, T.useless - 0.05, 0.6) + flash(t, T.twenty - 0.05, 0.5, '#ffcf6a');
      return g(cam(fin(s), 0, { z0: punch(t, [T.useless, T.twenty, T.every2, T.single, T.second2], 0.1), z1: 1, oy: 1200 }), shake(t, [T.useless, T.twenty, T.every2, T.single, T.second2], 26)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 rain speeds up, umbrellas hammered
    [C[1], (t) => {
      const k = seg(t, C[1], N[2]), kU = seg(t, T.hammered - 0.15, T.hammered + 0.15);
      let s = vgrad('#6a7a9a', '#b8c4d8', 0, 1150) + rect(0, 1150, 1080, 770, '#4a4e58');
      const r = rng(9); for (let i = 0; i < 9; i++) { const x = i * 125 - 20, h = 260 + r() * 300; s += rect(x, 1150 - h, 118, h, ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8'][i % 4]); }
      const cols = ['#c8102e', '#2f6fd6', '#ffcf6a', '#2fae6a'];
      for (let i = 0; i < 4; i++) { const px = 150 + i * 260; s += adult({ ...CROWD[i], x: px, y: 1960, s: 1.05, face: 'tense', pose: 'hold', tilt: Math.sin(t * 30 + i) * 4 * kU }); s += umbrella(px - 20, 1300 - 30 * kU, kU, cols[i], t); }
      const len = 60 + 260 * k + 200 * seg(t, T.rain - 0.1, T.rain + 0.3), rr = rng(4);
      for (let i = 0; i < 70; i++) { const x = rr() * 1100, sp = 2200 + 2600 * k; const y = ((rr() * 2200 + t * sp) % 2200) - 200; s += `<path d="M${x.toFixed(0)},${y.toFixed(0)} l${-len * 0.08},${len.toFixed(0)}" stroke="#e8f2ff" stroke-width="${(4 + 3 * k).toFixed(1)}" opacity="0.8" stroke-linecap="round"/>`; }
      s += debris(t, T.hammered - 0.05, 540, 1330, { n: 30, col: '#e8f2ff', spread: 1100, seed: 4, size: 10 }) + debris(t, T.gravel - 0.05, 540, 1700, { n: 30, col: '#c8d4e8', spread: 1100, seed: 7, size: 12 });
      s += hit(540, 720, 'RAIN: FASTER', pop(seg(t, T.speeds - 0.08, T.speeds + 0.1)) * (1 - seg(t, T.hammered - 0.1, T.hammered)), '#2f6fd6', -5, 120);
      s += hit(540, 720, 'HAMMERED', pop(seg(t, T.hammered - 0.08, T.hammered + 0.1)) * (1 - seg(t, T.gravel - 0.15, T.gravel - 0.05)), '#ff2a3a', -5, 130);
      s += stamp(540, 760, 'LIKE GRAVEL', seg(t, T.gravel - 0.08, T.gravel + 0.2), '#ffcf6a', 6, 76);
      s += flash(t, T.hammered - 0.05, 0.6) + flash(t, T.gravel - 0.05, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.speeds, T.hammered, T.rain, T.gravel], 0.1), z1: 1, oy: 1250 }), shake(t, [T.hammered, T.rain, T.gravel], 30)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 a feather falls like a hammer, paper slams the floor
    [C[2], (t) => {
      let s;
      if (t < T.every6 - 0.1) {
        const d = Math.max(0, t - T.feather + 0.15), y = Math.min(1520, 650 + 1400 * d * d);
        s = vgrad('#1d2a4a', '#3a4a7a') + glow(540, 1000, 600, '#6ab0ff', 0.25) + rect(0, 1600, 1080, 320, '#8a8e9a');
        s += speedLines(t, { a: 0.2, vertical: true, dir: -1, seed: 8 });
        s += g(feather(0, 0, Math.sin(t * 3) * 4), `translate(300 ${y - 100}) scale(2.2)`) + g(hammer(0, 0, 0), `translate(780 ${y - 260}) scale(2.2)`);
        if (y >= 1520) s += debris(t, T.hammer - 0.02, 540, 1600, { n: 26, col: '#c8ccd6', seed: 3 });
        s += chip(540, 700, 'SAME SPEED', pop(seg(t, T.feather + 0.15, T.feather + 0.35)), { size: 56, col: '#fff', bg: '#c8102e' });
        s += chip(540, 860, 'APOLLO 15 DID THIS ON THE MOON', pop(seg(t, T.hammer - 0.3, T.hammer)), { size: 32, col: '#ffcf6a', border: '#ffcf6a' });
        s += flash(t, T.hammer - 0.02, 0.7);
        return g(cam(fin(s), 0, { z0: punch(t, [T.feather, T.hammer], 0.12), z1: 1, oy: 1300 }), shake(t, [T.hammer], 36)) + bar(t) + pill('SECOND 3');
      }
      s = vgrad('#e8eef4', '#c8d4e2') + rect(0, 1560, 1080, 360, '#8a7a6a');
      s += rect(0, 300, 1080, 30, '#b8c4d2') + [...Array(3)].map((_, i) => rect(140 + i * 300, 330, 200, 40, '#ffffff', 6, 'opacity="0.8"')).join('');
      s += adult({ ...CROWD[1], x: 820, y: 1940, s: 1.05, face: 'open', pose: 'up' });
      s += rect(80, 1320, 560, 30, '#6a4a2a', 6) + rect(110, 1350, 26, 220, '#5a3a1a') + rect(584, 1350, 26, 220, '#5a3a1a') + rect(200, 1180, 240, 140, '#1d222c', 10) + rect(212, 1192, 216, 116, '#3a6ad6', 6);
      const r = rng(13);
      for (let i = 0; i < 18; i++) { const t0 = T.paper - 0.25 + r() * 0.5, d = Math.max(0, t - t0), x = 60 + r() * 960, y = Math.min(1580 - r() * 30, 520 + 2600 * d * d); s += rect(x - 50, y - 64, 100, 128, '#ffffff', 3, `stroke="#c8ccd6" stroke-width="2" transform="rotate(${(r() - 0.5) * 20} ${x} ${y})"`); }
      s += debris(t, T.slams - 0.05, 540, 1580, { n: 34, col: '#ffffff', spread: 1100, seed: 5 });
      s += hit(540, 700, 'PAPER = BRICKS', pop(seg(t, T.paper - 0.08, T.paper + 0.1)), '#ff2a3a', -5, 110);
      s += stamp(540, 1720, 'SLAM', seg(t, T.slams - 0.05, T.slams + 0.2), '#c8102e', -6, 96);
      s += flash(t, T.every6 - 0.1, 0.6) + flash(t, T.slams - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.every6, T.slams, T.floor], 0.1), z1: 1, oy: 1300 }), shake(t, [T.slams, T.floor], 38)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 storm: wind can't push, palm trees snap upright
    [C[3], (t) => {
      const kN = seg(t, T.nothing - 0.1, T.nothing + 0.15), kS = seg(t, T.snap - 0.05, T.snap + 0.25);
      const gust = (1 - kN);
      let s = vgrad('#4a5a8a', '#9aa8c8', 0, 1300) + rect(0, 1300, 1080, 620, '#c8b88a');
      s += `<path d="M0,1300 Q540,1260 1080,1300 L1080,1360 L0,1360Z" fill="#3a8ab8"/>`;
      s += rect(520, 940, 420, 360, '#e8d8b8') + rect(680, 1150, 100, 150, '#8a5a3a', 6) + rect(570, 1020, 80, 70, '#9fc4ff', 4) + rect(820, 1020, 80, 70, '#9fc4ff', 4);
      s += `<path d="M490,950 L730,780 L970,950Z" fill="#c8312b"/>`;
      const r = rng(17);
      for (let i = 0; i < 14; i++) { const t0 = T.storm - 0.4 + r() * 1.0, d = Math.max(0, Math.min(t, T.nothing) - t0), fall = Math.max(0, t - T.nothing); const x = 600 + r() * 320 + d * (-900 - r() * 400), y = 860 + r() * 80 - d * 200 + 1400 * fall * fall; if (y < 1300) s += rect(x - 30, y - 12, 60, 24, '#a82018', 3, `transform="rotate(${(d * 600 + i * 40) * gust} ${x} ${y})"`); }
      const bend = lerp(-0.9 + Math.sin(t * 9) * 0.08, 0, kS);
      s += palm(220, 1330, bend, 1.15) + palm(420, 1360, bend * 0.9, 0.85);
      const rr = rng(2); for (let i = 0; i < 50; i++) { const x = ((rr() * 1400 - t * 1800 * gust) % 1400 + 1400) % 1400 - 160, y = ((rr() * 2000 + t * 1600) % 2000); s += `<path d="M${x.toFixed(0)},${y.toFixed(0)} l${(-120 * gust).toFixed(0)},${(30 + 70 * kN).toFixed(0)}" stroke="#e8f2ff" stroke-width="4" opacity="0.6"/>`; }
      s += hit(540, 680, 'STORM', pop(seg(t, T.storm - 0.08, T.storm + 0.1)) * (1 - kN), '#ff2a3a', -5, 160);
      s += hit(540, 680, 'WIND: USELESS', pop(seg(t, T.nothing - 0.08, T.nothing + 0.1)), '#2f6fd6', -5, 110);
      s += stamp(540, 1620, 'SNAP', seg(t, T.snap - 0.05, T.snap + 0.2), '#2fae6a', 6, 110);
      s += flash(t, T.nothing - 0.08, 0.6) + flash(t, T.snap - 0.05, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [T.storm, T.roofs, T.nothing, T.push, T.snap], 0.1), z1: 1, oy: 1200 }), shake(t, [T.roofs, T.nothing, T.snap], 32)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 curveballs fly straight — then you, 230 mph, ground rushing up
    [C[4], (t) => {
      let s;
      if (t < T.you10 - 0.2) {
        const k = seg(t, C[4] + 0.1, T.straight + 0.2);
        s = vgrad('#2a8a4a', '#6ac06a') + rect(0, 0, 1080, 700, '#1d2a4a') + glow(540, 300, 600, '#ffffff', 0.25);
        s += `<path d="M540,1700 Q980,1150 540,640" stroke="#ffffff" stroke-width="10" fill="none" stroke-dasharray="26 22" opacity="0.5"/>` + t2(870, 1180, 'USUAL CURVE', 34, '#ffffff', { weight: 800, extra: 'opacity="0.6"' });
        const y = lerp(1700, 640, k), sc = lerp(1.6, 0.6, k);
        s += `<path d="M540,1700 L540,${y.toFixed(0)}" stroke="#ff2a3a" stroke-width="14" stroke-linecap="round"/>`;
        s += g(circ(0, 0, 50, '#f4f2ea') + `<path d="M-30,-36 Q-10,0 -30,36 M30,-36 Q10,0 30,36" stroke="#c8102e" stroke-width="5" fill="none"/>`, `translate(540 ${y.toFixed(0)}) rotate(${t * 900}) scale(${sc.toFixed(3)})`);
        s += speedLines(t, { a: 0.3, vertical: true, seed: 10 });
        s += stamp(540, 1500, 'DEAD STRAIGHT', seg(t, T.dead - 0.08, T.dead + 0.2), '#ff2a3a', -6, 76);
        s += chip(540, 800, 'NO AIR = NO CURVE', pop(seg(t, T.curveball - 0.1, T.curveball + 0.1)), { size: 44, col: '#fff', bg: '#141a22' });
        s += flash(t, C[4] + 0.05, 0.5) + flash(t, T.dead - 0.05, 0.6);
        return g(cam(fin(s), 0, { z0: punch(t, [T.curveball, T.dead, T.straight], 0.1), z1: 1, oy: 1200 }), shake(t, [T.dead, T.straight], 28)) + bar(t) + pill('SECOND 5');
      }
      const k = seg(t, T.you10 - 0.2, C[5]);
      s = fields(k) + speedLines(t, { a: 0.55, vertical: true, dir: -1, seed: 11 }) + clouds(t * 4, 900, 9, 0.5);
      s += diver(760 + Math.sin(t * 30) * 8, 820, 1.0, 'open', Math.sin(t * 25) * 6);
      s += hit(540, 1550, '230 MPH', pop(seg(t, T.two - 0.08, T.two + 0.12)), '#ff2a3a', -6, 200);
      s += flash(t, T.you10 - 0.2, 0.6) + flash(t, T.two - 0.05, 0.6, '#ff2a3a', 0.25);
      return g(cam(fin(s), 0, { z0: punch(t, [T.you10, T.two, T.hour10], 0.12), z1: 1, oy: 1000 }), shake(t, [T.you10, T.two, T.hour10], 40, 5)) + bar(t) + pill('SECOND 5');
    }],
    // 11 air is back: wall, parachute pops
    [C[5], (t) => {
      const kP = seg(t, T.pops - 0.1, T.pops + 0.2), kW = seg(t, T.wall - 0.1, T.wall + 0.2);
      let s = vgrad('#3a8ae0', '#cfe6fa') + clouds(t, lerp(1600, 300, kP), 12) + speedLines(t, { a: 0.4 * (1 - kP), vertical: true, dir: -1, seed: 13 });
      for (let i = 0; i < 3; i++) { const d = t - T.wall - i * 0.1; if (d > 0 && d < 0.6) s += `<ellipse cx="540" cy="1050" rx="${(200 + d * 1400).toFixed(0)}" ry="${(60 + d * 400).toFixed(0)}" fill="none" stroke="#ffffff" stroke-width="${(18 * (1 - d / 0.6)).toFixed(1)}" opacity="0.8"/>`; }
      if (kP > 0) { s += canopy(540, 820, 760, kP) + adult({ ...DIVER, x: 540, y: 1900, s: 0.85, face: 'open', pose: 'up', tilt: Math.sin(t * 20) * 3 * (1 - kP) }); }
      else s += diver(780, 1050, 1.0, 'tense', Math.sin(t * 30) * 8 * (1 + kW));
      s += stamp(540, 1720, 'AIR: ON', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 80);
      s += hit(540, 520, 'WALL', pop(seg(t, T.wall - 0.08, T.wall + 0.1)) * (1 - kP), '#ffffff', -4, 220);
      s += chip(540, 330, 'POP', pop(seg(t, T.pops - 0.1, T.pops + 0.1)), { size: 60, col: '#fff', bg: '#2fae6a' });
      s += flash(t, C[5], 0.95) + flash(t, T.wall - 0.05, 0.9) + flash(t, T.pops - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.hits, T.wall, T.pops], 0.13), z1: 1, oy: 1000 }), shake(t, [C[5], T.hits, T.wall, T.pops], 44, 6)) + pill('AIR: BACK');
    }],
    // 12 landed, alive, hair straight up forever
    [C[6], (t) => {
      let s = vgrad('#7ab8f0', '#e2f0fa', 0, 1100) + rect(0, 1100, 1080, 820, '#7aa84a') + `<path d="M0,1100 Q540,1060 1080,1100 L1080,1140 L0,1140Z" fill="#5a8a3a"/>`;
      s += `<path d="M60,1700 Q200,1560 380,1650 Q300,1760 120,1780Z" fill="#2fae6a" opacity="0.9"/>`;
      const wob = Math.sin(t * 34) * 5 * seg(t, T.jelly - 0.2, T.jelly + 0.1);
      const px = 620, py = 1880, ps = 1.8;
      s += adult({ ...YOU, top: '#ff7a1a', pants: '#ff7a1a', x: px, y: py, s: ps, face: t > T.hair - 0.1 ? 'open' : 'tense', pose: 'stand', tilt: wob });
      if (t > T.hair - 0.2) s += hairUp(px, py, ps, t);
      s += chip(300, 560, 'ALIVE.', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 56, col: '#fff', bg: '#2fae6a' });
      s += chip(760, 560, 'LEGS: JELLY', pop(seg(t, T.jelly - 0.1, T.jelly + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 1560, 'FOREVER', seg(t, T.forever - 0.08, T.forever + 0.2), '#c8102e', -6, 90);
      s += flash(t, C[6], 0.6) + flash(t, T.up - 0.1, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.land, T.alive, T.hair, T.forever], 0.1), z1: 1, oy: 1100 }), shake(t, [T.land, T.forever], 24)) + pill('ALIVE');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['SOUND?', 'COLOR?', 'LIGHT?', 'WI-FI?', 'TIME?', 'OXYGEN?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'SWITCHES OFF', 1, { size: 130, col: '#ffcf6a' }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 130, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
