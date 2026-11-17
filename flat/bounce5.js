// "What if everything on Earth turned into a super ball for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, chip, shake, flash, punch, bigText, stamp, speedLines, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const FANC = ['#c8102e', '#2f6fd6', '#ffcf3a', '#2fae6a', '#ff7a1a', '#a64ad6'];
const BALL = ['#ff2a6a', '#ffcf3a', '#2fd6c8', '#7a5aff', '#ff7a1a'];
// bounce height profile: |parabola| repeating with period p, peak h (0 at contact)
const hop = (t, t0, p, h) => { if (t < t0) return 0; const q = ((t - t0) / p) % 1; return 4 * h * q * (1 - q); };
// small faceless figure
const fig = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : `<path d="M-18,0 L-30,40 M18,0 L30,40" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
const ball = (x, y, r, col, sq = 0) => g(circ(0, 0, r, col) + circ(-r * 0.35, -r * 0.35, r * 0.28, '#ffffff', 'opacity="0.45"') + `<path d="M${-r},0 Q0,${r * 0.5} ${r},0" stroke="#ffffff" stroke-width="${r * 0.12}" fill="none" opacity="0.5"/>`, `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(1 + sq).toFixed(3)} ${(1 - sq).toFixed(3)})`);
const car = (x, y, col, rot = 0, s = 1) => g(rect(-230, -110, 460, 110, col, 34) + `<path d="M-150,-110 L-90,-200 L110,-200 L170,-110Z" fill="${col}"/>` + `<path d="M-130,-116 L-82,-186 L0,-186 L0,-116Z M14,-116 L14,-186 L100,-186 L150,-116Z" fill="#1a2230"/>` + rect(205, -90, 26, 22, '#ffe9a8', 6) + [-140, 140].map((dx) => circ(dx, 0, 52, '#141618') + circ(dx, 0, 26, '#b8c0cc')).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const bus = (x, y, rot = 0, s = 1) => g(rect(-340, -300, 680, 260, '#ffb81a', 30) + [...Array(5)].map((_, i) => rect(-310 + i * 120, -270, 96, 90, '#1a2230', 10)).join('') + rect(-340, -130, 680, 20, '#c8102e') + t2(0, -150, 'CITY BUS', 36, '#1a2230', { weight: 900 }) + [-220, 220].map((dx) => circ(dx, -40, 58, '#141618') + circ(dx, -40, 28, '#b8c0cc')).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const phoneObj = (x, y, rot, s = 1) => g(rect(-40, -80, 80, 160, '#0d0f14', 14) + rect(-34, -72, 68, 144, '#3a6ad6', 10) + rect(-34, -72, 68, 144, '#ffffff', 10, 'opacity="0.15"'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
const stars = (x, y, t, k) => { if (k <= 0) return ''; let s = ''; for (let i = 0; i < 5; i++) { const a = t * 6 + i * 1.256; const px = x + Math.cos(a) * 170, py = y + Math.sin(a) * 50; s += `<path d="M0,-26 L7,-8 L26,-8 L11,4 L16,24 L0,12 L-16,24 L-11,4 L-26,-8 L-7,-8Z" fill="#ffcf3a" stroke="#ffffff" stroke-width="3" transform="translate(${px.toFixed(0)} ${py.toFixed(0)}) scale(${(1.4 * k).toFixed(2)})"/>`; } return s; };
const rings = (t, t0, x, y, col = '#ffffff') => { const d = t - t0; if (d < 0 || d > 0.5) return ''; return [0, 0.1].map((o) => { const k = clamp((d - o) / 0.4); return k > 0 ? `<ellipse cx="${x}" cy="${y}" rx="${(60 + 300 * k).toFixed(0)}" ry="${(14 + 60 * k).toFixed(0)}" fill="none" stroke="${col}" stroke-width="${(12 * (1 - k)).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>` : ''; }).join(''); };
const town = (FL, seed = 4) => { let s = vgrad('#4aa0f0', '#cfe8fc', 0, FL); const r = rng(seed); let x = -40; while (x < 1120) { const w = 150 + r() * 130, h = 420 + r() * 420, c = ['#ff8a5a', '#ffcf5a', '#5ab0ff', '#ff6aa0', '#7ad08a'][Math.floor(r() * 5)]; s += rect(x, FL - h, w, h, c); for (let j = 0; j < Math.floor(h / 90); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, FL - h + 24 + j * 90, 30, 46, '#2a3a52', 3, 'opacity="0.7"'); x += w + 8; } return s; };

export async function init() {
  const W = await (await fetch('/work/bounce5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), tripped: wt('tripped', 0), sidewalk: wt('sidewalk', 0), threw: wt('threw', 0), back: wt('back', 0), everything: wt('everything', 0), ball: wt('ball', 0), five: wt('five', 0),
    slips: wt('slips', 2), hits: wt('hits', 2), floor: wt('floor', 2), rockets: wt('rockets', 2), forehead: wt('forehead', 2), bonk: wt('bonk', 2),
    tap: wt('tap', 4), launch: wt('launch', 4), pinballs: wt('pinballs', 4), bus: wt('bus', 4), bounces: wt('bounces', 4), both: wt('both', 4),
    step: wt('step', 6), shoots: wt('shoots', 6), floor6: wt('floor', 6), city: wt('city', 6), trampoline: wt('trampoline', 6), hell: wt('hell', 6),
    office: wt('office', 8), drops: wt('drops', 8), stapler: wt('stapler', 8), ricochets: wt('ricochets', 8), floor8: wt('floor', 8), ceiling: wt('ceiling', 8), boss: wt('boss', 8), now: wt('now', 8), bouncing: wt('bouncing', 8),
    two: wt('two', 10), up: wt('up', 10), bounce: wt('bounce', 10), off: wt('off', 10),
    drops11: wt('drops', 11), splat: wt('splat', 11), hedge: wt('hedge', 11), alive: wt('alive', 11), bus11: wt('bus', 11), fountain: wt('fountain', 11), alive2: wt('alive', 11, 1),
    phone12: wt('phone', 12), still: wt('still', 12), somehow: wt('somehow', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => {
    const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n });
    for (let i = 0; i < 4; i++) { const x = 150 + i * 260, y = 1720 - hop(t, t0 - i * 0.12, 0.42, 420); s += ball(x, y, 48, BALL[(i + n) % 5], y > 1700 ? 0.18 : 0); }
    const kb = 1 - hop(t, t0, 0.5, 0.0); // number pops in, then bobs
    s += g(bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }), `translate(0 ${(-hop(t, t0 + 0.15, 0.45, 60)).toFixed(0)})`) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }) + (kb ? '' : '');
    s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t);
  };

  const shots = [
    // 0 hook: you trip, the sidewalk throws you back up, the whole street starts bouncing
    [0, (t) => {
      const FL = 1500; let s = town(FL) + rect(0, FL, 1080, 420, '#9a9ea6') + rect(0, FL, 1080, 20, '#c4c8ce');
      const on = t >= T.everything - 0.1;
      // everyone bouncing in the background once "everything" lands
      const r = rng(5);
      for (let i = 0; i < 7; i++) { const x = 80 + i * 150, ph = r() * 0.4; const y = FL - 20 - (on ? hop(t, T.everything - 0.1 + ph, 0.55 + r() * 0.2, 260 + r() * 200) : 0); s += fig(x, y, 1.3, FANC[i % 6], on ? Math.sin(t * 9 + i) * 20 : 0, on); }
      // cars bouncing on the road
      s += car(260, 1790 - (on ? hop(t, T.everything, 0.7, 380) : 0), '#2f6fd6', on ? Math.sin(t * 6) * 10 : 0, 0.8) + car(820, 1840 - (on ? hop(t, T.everything + 0.25, 0.6, 320) : 0), '#ffcf3a', on ? -Math.sin(t * 7) * 12 : 0, 0.8);
      // a giant super ball smashing through the street from frame 0
      { const bx = lerp(-120, 1200, seg(t, 0, 2.6)), by = FL + 120 - hop(t, 0.03, 0.62, 700); s += ball(bx, by, 90, '#ff2a6a', by > FL + 90 ? 0.2 : 0); const q = ((t - 0.03) / 0.62) % 1; if (q < 0.1) s += rings(t, t - q * 0.62, bx, FL + 200, '#ffffff'); }
      // you: walking -> trip (fall forward) -> launched up
      const kT = seg(t, T.tripped - 0.1, T.sidewalk), launched = t >= T.threw - 0.1;
      let yy = FL + 280, rot = lerp(0, 80, kT), sc = 0.85;
      if (launched) { const d = t - (T.threw - 0.1); yy = FL + 280 - hop(t, T.threw - 0.1, 1.6, 900); rot = 80 + d * 520; }
      s += rings(t, T.threw - 0.1, 540, FL + 270, '#ffffff');
      s += g(adult({ ...YOU, x: 0, y: 0, s: sc, face: launched ? 'open' : 'tense', pose: launched ? 'up' : 'stand', tilt: launched ? 0 : Math.sin(t * 14) * 8 }), `translate(540 ${yy.toFixed(0)}) rotate(${rot.toFixed(0)} 0 -220)`);
      if (launched) s += speedLines(t, { a: 0.35, vertical: true, dir: -1, seed: 2 });
      s += chip(540, 560, 'TRIPPED', pop(seg(t, T.tripped - 0.1, T.tripped + 0.1)) * (1 - seg(t, T.threw - 0.25, T.threw - 0.15)), { size: 54, col: '#fff', bg: '#141a22' });
      s += hit(540, 600, 'BOING!', pop(seg(t, T.threw - 0.1, T.threw + 0.08)) * (1 - seg(t, T.ball - 0.3, T.ball - 0.2)), '#ff2a6a', -8, 190);
      s += stamp(540, 600, 'SUPER BALL MODE', seg(t, T.ball - 0.15, T.ball + 0.1), '#ff2a3a', -6, 76);
      s += flash(t, T.threw - 0.1, 0.8) + flash(t, T.ball - 0.1, 0.5, '#ff2a6a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.tripped, T.threw - 0.1, T.everything, T.ball, T.five], 0.1), z1: 1, oy: 1100 }), shake(t, [0.03, T.tripped + 0.2, T.threw - 0.1, T.everything, T.ball], 30)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 phone slips, hits the floor, rockets back into your forehead
    [C[0], (t) => {
      const FL = 1760; let s = vgrad('#ffe0c0', '#f0b890', 0, FL) + rect(0, FL, 1080, 160, '#8a5a3a') + rect(0, FL, 1080, 14, '#6a4028');
      for (let i = 0; i < 6; i++) s += rect(i * 190 - 20, FL + 40, 170, 10, '#6a4028', 4);
      // giant head at the top (face well above the caption band)
      const kB = seg(t, T.bonk - 0.25, T.bonk - 0.05), hx = 540, hy = 560;
      s += g(circ(0, 0, 250, '#e0b494') + `<path d="M-250,-30 Q-260,-280 0,-290 Q260,-280 250,-30 Q220,-200 0,-210 Q-220,-200 -250,-30Z" fill="#3a2c22"/>` +
        (t > T.bonk - 0.08 ? `<path d="M-110,40 l50,0 M60,40 l50,0" stroke="#1d1a18" stroke-width="14" stroke-linecap="round"/>` + `<ellipse cx="0" cy="150" rx="46" ry="40" fill="#5a2d2a"/>` : circ(-85, 40, 20, '#1d1a18') + circ(85, 40, 20, '#1d1a18') + `<path d="M-40,150 q40,${t > T.hits ? 30 : -10} 80,0" stroke="#7a3f36" stroke-width="12" fill="none" stroke-linecap="round"/>`) +
        (t > T.bonk - 0.05 ? `<ellipse cx="0" cy="-130" rx="70" ry="44" fill="#ff8a8a" opacity="0.7"/>` : ''), `translate(${hx} ${hy}) rotate(${(t > T.bonk - 0.05 ? -8 * Math.exp(-(t - T.bonk) * 4) * Math.sin((t - T.bonk) * 30) : 0).toFixed(1)})`);
      // phone path: falls from hand (y 980) -> floor -> rockets up to forehead -> pings away
      const tH = T.hits + 0.1, tF = T.bonk - 0.08; let px = 600, py = 980, pr = 0;
      if (t < T.slips) { py = 980 + Math.sin(t * 8) * 6; }
      else if (t < tH) { const k = seg(t, T.slips, tH); py = lerp(980, FL - 80, k * k); pr = k * 260; px = 600 + k * 40; }
      else if (t < tF) { const k = seg(t, tH, tF); py = lerp(FL - 80, hy - 140, 1 - (1 - k) * (1 - k)); pr = 260 + k * 900; px = 640 - k * 100; }
      else { const d = t - tF; px = 540 + d * 700; py = hy - 140 - d * 1200 + d * d * 2000; pr = 1160 + d * 1400; }
      if (t > T.slips) s += speedLines(t, { a: 0.25, vertical: true, dir: t < tH ? 1 : -1, seed: 4 });
      s += phoneObj(px, py, pr, 1.6) + rings(t, tH, 640, FL, '#ffffff');
      s += stars(hx, hy - 260, t, pop(seg(t, T.bonk, T.bonk + 0.15)));
      s += chip(540, 1500, 'SUPER BALL: BOUNCES BACK ~90%', pop(seg(t, T.floor - 0.1, T.floor + 0.1)) * (1 - seg(t, T.bonk - 0.15, T.bonk - 0.05)), { size: 38, col: '#fff', bg: '#141a22' });
      s += hit(540, 1500, 'BONK.', pop(seg(t, T.bonk - 0.05, T.bonk + 0.1)), '#ff2a3a', -8, 230);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, tH, 0.6) + flash(t, tF, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [T.slips, tH, T.rockets, tF, T.bonk], 0.1), z1: 1.03, oy: 1100 }), shake(t, [tH, tF, T.bonk], 36)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 highway: two cars tap bumpers and launch like pinballs, the bus bounces over both
    [C[1], (t) => {
      const RD = 1700; let s = vgrad('#3a90ec', '#cfe6fb', 0, 1250) + rect(0, 1250, 1080, 670, '#6a9a5a') + rect(0, 1450, 1080, 470, '#4a4e54') + [...Array(7)].map((_, i) => rect(i * 170 + ((t * 900) % 170) - 170, 1690, 100, 14, '#f2f2ea', 4)).join('');
      const tT = T.tap - 0.05;
      // car A from left, car B from right
      let ax, ay, ar, bx, by, br;
      if (t < tT) { const k = seg(t, C[1], tT); ax = lerp(-200, 330, k); bx = lerp(1280, 750, k); ay = by = RD; ar = br = 0; }
      else { const d = t - tT; ax = 330 - 250 * Math.sin(d * 1.9); ay = RD - hop(t, tT, 0.9, 900); ar = -d * 400; bx = 750 + 230 * Math.sin(d * 2.2); by = RD - hop(t, tT + 0.05, 0.8, 800); br = d * 450; }
      s += rings(t, tT, 540, RD, '#ffcf3a');
      // bus arcs over both
      const tb0 = T.bus - 0.1, kb = seg(t, tb0, tb0 + 1.3);
      if (t > tb0 - 0.6) { const bxx = lerp(-400, 1500, seg(t, tb0 - 0.6, tb0 + 1.6)); s += bus(bxx, RD + 40 - (t > tb0 ? hop(t, tb0, 0.75, 700) : 0), Math.sin(kb * 12) * 8, 0.9); }
      s += car(ax, ay, '#c8102e', ar, 0.9) + car(bx, by, '#2fd6c8', br, 0.9);
      if (t > tT) s += speedLines(t, { a: 0.3, seed: 6 }) + debris(t, tT, 540, RD - 60, { n: 18, col: '#ffcf3a', seed: 3, size: 16 });
      s += hit(540, 980 - 300, 'TAP.', pop(seg(t, tT - 0.05, tT + 0.08)) * (1 - seg(t, T.launch + 0.1, T.launch + 0.2)), '#ffffff', -6, 160);
      s += stamp(540, 640, 'PINBALL MODE', seg(t, T.pinballs - 0.1, T.pinballs + 0.15) * (1 - seg(t, T.bus - 0.2, T.bus - 0.1)), '#ff2a3a', -6, 84);
      s += hit(540, 640, 'BOING!', pop(seg(t, tb0, tb0 + 0.12)), '#ffb81a', 6, 170);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, tT, 0.8) + flash(t, tb0, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [tT, T.launch, T.pinballs, tb0, T.both], 0.1), z1: 1.03, oy: 1300 }), shake(t, [tT, tT + 0.25, tb0, tb0 + 0.75], 36)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 city = trampoline park from hell
    [C[2], (t) => {
      const FL = 1780; let s = town(FL, 11) + rect(0, FL, 1080, 140, '#9a9ea6');
      // floor markers on the tall building
      s += rect(780, 380, 260, FL - 380, '#5a6a8a') + [...Array(9)].map((_, i) => rect(780, FL - 155 * (i + 1), 260, 6, '#ffffff', 0, 'opacity="0.6"') + t2(1010, FL - 155 * (i + 1) + 50, `${i + 1}F`, 34, '#ffffff', { weight: 900, anchor: 'end' })).join('');
      const r = rng(21);
      for (let i = 0; i < 12; i++) { const x = 60 + r() * 680, ph = r(), p = 0.5 + r() * 0.35, h = 300 + r() * 900; const y = FL - 30 - hop(t, C[2] - ph, p, h); const q = ((t - C[2] + ph) / p) % 1; s += fig(x, y, 1.1 + r() * 0.4, FANC[i % 6], Math.sin(t * 8 + i) * 25, q > 0.15 && q < 0.85); if (q < 0.06 || q > 0.94) s += rings(t, t - 0.01, x, FL - 10); }
      // you: one step = one floor, right by the floor markers
      const st = T.step - 0.1, yy = FL - (t > st ? hop(t, st, 0.9, 155 * 4) : 0);
      s += fig(910, yy - 20, 2.2, '#3c4350', Math.sin(t * 5) * 15, t > st);
      s += chip(300, 560, '1 STEP = 1 FLOOR', pop(seg(t, T.floor6 - 0.15, T.floor6 + 0.05)) * (1 - seg(t, T.city - 0.1, T.city)), { size: 48, col: '#fff', bg: '#141a22' });
      s += stamp(480, 560, 'TRAMPOLINE PARK', seg(t, T.trampoline - 0.1, T.trampoline + 0.15), '#ff2a3a', -6, 70);
      s += hit(480, 780, 'FROM HELL', pop(seg(t, T.hell - 0.15, T.hell + 0.05)), '#ff2a3a', 5, 120);
      s += speedLines(t, { a: 0.2, vertical: true, dir: -1, seed: 8 });
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, st, 0.5) + flash(t, T.hell - 0.1, 0.6, '#ff2a3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [st, T.shoots, T.trampoline, T.hell], 0.1), z1: 1.04, oy: 1200 }), shake(t, [st, T.shoots, T.hell], 28)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 office: stapler ricochets floor -> ceiling -> boss, boss bounces
    [C[3], (t) => {
      const FL = 1640, CE = 470; let s = vgrad('#eef2f6', '#c8d4e0') + rect(0, 0, 1080, CE, '#f8fafc') + rect(0, CE - 14, 1080, 14, '#b8c0cc') + rect(0, FL, 1080, 280, '#6a7a8a');
      for (let i = 0; i < 3; i++) s += rect(80 + i * 340, CE, 200, 18, '#ffffff', 4) + glow(180 + i * 340, CE + 40, 160, '#fff7d0', 0.4);
      s += rect(60, 1300, 420, 30, '#8a5a3a', 6) + rect(80, 1330, 24, 310, '#6a4028') + rect(436, 1330, 24, 310, '#6a4028') + rect(120, 1170, 200, 130, '#1a2230', 8) + rect(132, 1182, 176, 106, '#4a8ae0', 4);
      // stapler waypoints
      const td = T.drops, t1 = T.floor8 - 0.05, t2_ = T.ceiling - 0.05, t3 = T.boss - 0.05;
      const P = [[300, 1270, td], [480, FL - 20, t1], [700, CE + 30, t2_], [860, 1060, t3], [1300, 300, t3 + 0.6]];
      let sx = 300, sy = 1270, sr = 0;
      if (t >= td) { let i = 0; while (i < P.length - 2 && t >= P[i + 1][2]) i++; const k = seg(t, P[i][2], P[i + 1][2]); sx = lerp(P[i][0], P[i + 1][0], k); sy = lerp(P[i][1], P[i + 1][1], k); sr = (t - td) * 1500; }
      s += g(rect(-70, -22, 140, 30, '#c8102e', 10) + rect(-70, 4, 140, 20, '#2a2e36', 6), `translate(${sx.toFixed(0)} ${sy.toFixed(0)}) rotate(${sr.toFixed(0)}) scale(1.4)`);
      if (t >= td && t < t3 + 0.6) { let d = `M${P[0][0]},${P[0][1]}`; for (let i = 1; i < P.length - 1; i++) if (t >= P[i][2]) d += ` L${P[i][0]},${P[i][1]}`; d += ` L${sx.toFixed(0)},${sy.toFixed(0)}`; s += `<path d="${d}" stroke="#ff2a3a" stroke-width="8" stroke-dasharray="24 16" fill="none" opacity="0.7"/>`; }
      [t1, t2_, t3].forEach((tt, i) => { s += rings(t, tt, P[i + 1][0], P[i + 1][1], '#ff2a3a'); });
      // boss: hit, then bounces too
      const bb = t > T.now - 0.1, by = 1920 - (bb ? hop(t, T.now - 0.1, 0.7, 520) : 0);
      s += adult({ skin: '#efc29d', hair: '#a9a9b3', hairStyle: 'short', top: '#1d1f24', pants: '#1d1f24', x: 860, y: by, s: 1.15, face: t > t3 ? 'open' : 'neutral', pose: bb ? 'up' : 'stand', tilt: t > t3 ? 14 : 0 });
      s += stars(860, by - 640, t, pop(seg(t, t3, t3 + 0.15)));
      s += chip(300, 640, 'FLOOR', pop(seg(t, t1, t1 + 0.1)), { size: 44, col: '#fff', bg: '#141a22' }) + chip(540, 640, 'CEILING', pop(seg(t, t2_, t2_ + 0.1)), { size: 44, col: '#fff', bg: '#141a22' }) + chip(800, 640, 'BOSS', pop(seg(t, t3, t3 + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += hit(400, 850, 'BOING!', pop(seg(t, T.bouncing - 0.15, T.bouncing + 0.05)), '#ff2a6a', -8, 150);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, t1, 0.4) + flash(t, t2_, 0.4) + flash(t, t3, 0.8);
      return g(cam(fin(s), 0, { z0: punch(t, [t1, t2_, t3, T.now, T.bouncing], 0.1), z1: 1.03, oy: 1100 }), shake(t, [t1, t2_, t3, T.now], 30)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 two floors up... bounce switches off (hang moment)
    [C[4], (t) => {
      const FL = 1840; let s = town(FL, 17) + rect(0, FL, 1080, 80, '#9a9ea6');
      s += rect(40, 700, 300, FL - 700, '#5a6a8a') + [1, 2].map((i) => rect(40, FL - 230 * i, 300, 8, '#ffffff', 0, 'opacity="0.7"') + t2(320, FL - 230 * i + 60, `${i}F`, 54, '#ffffff', { weight: 900, anchor: 'end' })).join('');
      const kU = seg(t, C[4], T.up), off = t >= T.off - 0.05;
      const yy = lerp(FL + 200, FL - 460, 1 - (1 - kU) * (1 - kU)) + (off ? 0 : Math.sin(t * 3) * 6);
      s += adult({ ...YOU, x: 640, y: yy, s: 0.95, face: off ? 'open' : 'smile', pose: 'up', tilt: off ? -10 : 0 });
      if (!off) s += speedLines(t, { a: 0.25, vertical: true, dir: -1, seed: 3 });
      s += chip(640, 520, '2 FLOORS UP', pop(seg(t, T.two - 0.1, T.two + 0.1)) * (1 - seg(t, T.off - 0.15, T.off - 0.05)), { size: 54, col: '#fff', bg: '#141a22' });
      s += stamp(540, 560, 'BOUNCE: OFF', seg(t, T.off - 0.05, T.off + 0.2), '#ff2a3a', -6, 96);
      if (off) s += rect(0, 0, 1080, 1920, '#000000', 0, `opacity="${(0.15 * seg(t, T.off, T.off + 0.3)).toFixed(2)}"`);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, T.off - 0.05, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [T.two, T.up, T.off - 0.05], 0.1), z1: 1.05, oy: 900 }), shake(t, [T.off - 0.05], 40)) + bar(t) + pill('SECOND 5');
    }],
    // 11 everything drops: splat in a hedge (alive), bus in a fountain (also alive)
    [C[5], (t) => {
      const sw = t >= T.bus11 - 0.12; let s = '';
      if (!sw) {
        const FL = 1700; s += town(FL, 23) + rect(0, FL, 1080, 220, '#9a9ea6');
        // falling stuff
        const r = rng(31); for (let i = 0; i < 9; i++) { const x = 80 + r() * 920, y0 = -200 - r() * 600, d = Math.max(0, t - C[5]); const y = Math.min(FL - 40, y0 + 2600 * d * d + 600 * d); s += i % 3 ? fig(x, y, 1.3, FANC[i % 6], 160 + i * 20) : car(x, y, FANC[i % 6], 180, 0.5); }
        // hedge with you head-first inside (legs sticking out, no face)
        const kS = seg(t, T.splat - 0.25, T.splat - 0.05);
        s += `<ellipse cx="540" cy="${FL - 60}" rx="330" ry="170" fill="#2f8a3a"/>` + [...Array(9)].map((_, i) => circ(260 + i * 70, FL - 150 - (i % 2) * 40, 70, '#3aa84a')).join('');
        if (kS < 1) s += g(adult({ ...YOU, x: 0, y: 0, s: 0.8, face: 'open', pose: 'up' }), `translate(540 ${lerp(-300, FL - 120, kS * kS).toFixed(0)}) rotate(180 0 -280)`);
        else s += g(`<path d="M-50,0 L-8,0 L-14,-220 L-46,-220Z" fill="#24262b"/><path d="M8,0 L50,0 L46,-220 L14,-220Z" fill="#1d1f24"/>` + rect(-56, -238, 46, 18, '#1b1c20', 6) + rect(10, -238, 46, 18, '#1b1c20', 6), `translate(540 ${FL - 180}) rotate(${(Math.sin((t - T.splat) * 14) * 6 * Math.exp(-(t - T.splat) * 2)).toFixed(1)})`);
        s += debris(t, T.splat - 0.05, 540, FL - 200, { n: 26, col: '#3aa84a', seed: 9, size: 22 });
        s += stamp(540, 520, 'BOUNCE: OFF', seg(t, C[5], C[5] + 0.2) * (1 - seg(t, T.splat - 0.2, T.splat - 0.1)), '#ff2a3a', -6, 90);
        s += hit(540, 560, 'SPLAT.', pop(seg(t, T.splat - 0.08, T.splat + 0.08)) * (1 - seg(t, T.alive - 0.2, T.alive - 0.1)), '#3aa84a', -6, 200);
        s += stamp(540, 560, 'ALIVE.', seg(t, T.alive - 0.1, T.alive + 0.1), '#2fae6a', 5, 120);
        s += flash(t, C[5], 0.9) + flash(t, T.splat - 0.05, 0.7);
        return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.splat - 0.05, T.alive], 0.12), z1: 1, oy: 1400 }), shake(t, [C[5] + 0.05, T.splat - 0.05, T.alive], 40, 6)) + pill('BOUNCE: OFF');
      }
      // fountain + bus
      s += vgrad('#5aa8f0', '#e0f0fc', 0, 1400) + rect(0, 1400, 1080, 520, '#d8cbb0');
      for (let i = 0; i < 6; i++) s += rect(i * 190 - 20, 820 - (i % 3) * 120, 170, 600 + (i % 3) * 120, ['#e8b070', '#d0785a', '#8aa0c0'][i % 3]);
      const kF = seg(t, T.bus11 - 0.12, T.fountain - 0.05);
      s += `<ellipse cx="540" cy="1640" rx="500" ry="120" fill="#b8b0a0"/><ellipse cx="540" cy="1620" rx="460" ry="100" fill="#4ab0f0"/>`;
      s += bus(540, lerp(200, 1660, kF * kF), lerp(-30, -6, kF), 0.95);
      const d = t - T.fountain + 0.05; if (d > 0) { const r = rng(41); for (let i = 0; i < 30; i++) { const a = -Math.PI * (0.1 + 0.8 * r()), v = 600 + r() * 900; const px = 540 + Math.cos(a) * v * d * 0.9, py = 1560 + Math.sin(a) * v * d + 1600 * d * d; if (py < 1700) s += circ(px, py, 10 + r() * 16, '#8ad0ff', 'opacity="0.85"'); } }
      s += `<ellipse cx="540" cy="1700" rx="500" ry="60" fill="#b8b0a0"/>` + rect(40, 1690, 1000, 80, '#b8b0a0');
      s += chip(540, 520, 'THE BUS?', pop(seg(t, T.bus11 - 0.1, T.bus11 + 0.05)) * (1 - seg(t, T.fountain - 0.1, T.fountain)), { size: 56, col: '#fff', bg: '#141a22' });
      s += hit(540, 560, 'FOUNTAIN.', pop(seg(t, T.fountain - 0.05, T.fountain + 0.1)) * (1 - seg(t, T.alive2 - 0.35, T.alive2 - 0.25)), '#2f6fd6', -5, 150);
      s += stamp(540, 560, 'ALSO ALIVE.', seg(t, T.alive2 - 0.2, T.alive2 + 0.05), '#2fae6a', 5, 96);
      s += flash(t, T.bus11 - 0.12, 0.6) + flash(t, T.fountain - 0.05, 0.6, '#8ad0ff', 0.25);
      return g(cam(fin(s), 0, { z0: punch(t, [T.bus11, T.fountain, T.alive2], 0.12), z1: 1.02, oy: 1400 }), shake(t, [T.fountain - 0.05, T.alive2], 36)) + pill('BOUNCE: OFF');
    }],
    // 12 your phone: still bouncing, somehow
    [C[6], (t) => {
      const FL = 1700; let s = town(FL, 29) + rect(0, FL, 1080, 220, '#9a9ea6') + rect(0, FL, 1080, 16, '#c4c8ce');
      const d = t - C[6], x = 200 + d * 280, y = FL - 90 - hop(t, C[6], 0.55, 700);
      s += phoneObj(x, y, d * 500, 1.8);
      const q = ((t - C[6]) / 0.55) % 1; if (q < 0.08) s += rings(t, t - q * 0.55, x, FL);
      s += t2(x, y - 220, 'BOING', 56, '#ffffff', { weight: 900, extra: `opacity="${(1 - q).toFixed(2)}"` });
      s += chip(540, 520, 'STILL BOUNCING', pop(seg(t, T.still - 0.1, T.still + 0.1)) * (1 - seg(t, T.somehow - 0.15, T.somehow - 0.05)), { size: 54, col: '#fff', bg: '#141a22' });
      s += stamp(540, 540, 'SOMEHOW.', seg(t, T.somehow - 0.05, T.somehow + 0.15), '#ff2a6a', -6, 110);
      s += flash(t, C[6], 0.6) + flash(t, T.somehow - 0.05, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [C[6], T.still, T.somehow], 0.1), z1: 1.04, oy: 1300 }), shake(t, [T.somehow], 26)) + pill('YOUR PHONE');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['WATER?', 'YOUR BED?', 'THE MOON?', 'FOOD?', 'CONCRETE?', 'MONEY?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      for (let j = 0; j < 5; j++) { const x = 120 + j * 210, y = 1880 - hop(t, C[7] - j * 0.1, 0.5, 520); s += ball(x, y, 50, BALL[j], 0); }
      s += bigText(540, 520, 'WHAT TURNS', 1, { size: 150 }) + bigText(540, 700, 'BOUNCY', 1, { size: 170, col: '#ffcf6a' }) + bigText(540, 880, 'NEXT?', 1, { size: 170 });
      s += bigText(540, 1500, opts[i], 1, { size: 110, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
