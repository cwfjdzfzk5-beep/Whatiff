// "What if all the water on Earth froze for five seconds?" — HYPE format.
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const ICE = '#bfeaff', ICE2 = '#e8f8ff', ICED = '#6fc0e8', WATER = '#1f8fe0';
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#102a3e', 0.06) + vignette(v);
const shards = (t, t0, x, y, o = {}) => debris(t, t0, x, y, { n: 26, col: ICE2, spread: 1100, size: 22, ...o });
// frost creeping in from the frame edges
const frost = (k, seed = 3) => { if (k <= 0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < 46; i++) { const side = i % 4, a = r() * 1080, b = r() * 1920, L0 = (120 + r() * 380) * k; const [x, y] = side === 0 ? [a, 0] : side === 1 ? [a, 1920] : side === 2 ? [0, b] : [1080, b]; const dx = side === 2 ? L0 : side === 3 ? -L0 : (r() - 0.5) * 220, dy = side === 0 ? L0 : side === 1 ? -L0 : (r() - 0.5) * 220; s += `<path d="M${x},${y} L${x + dx * 0.55 + (r() - 0.5) * 70},${y + dy * 0.55 + (r() - 0.5) * 70} L${x + dx},${y + dy}" stroke="${ICE2}" stroke-width="${5 + r() * 9}" fill="none" stroke-linecap="round" opacity="0.95"/>`; } return s + rect(-50, -50, 1180, 2020, ICE, 0, `opacity="${0.22 * k}"`); };
const iceBlock = (x, y, w, h, rot = 0) => g(rect(-w / 2, -h / 2, w, h, ICE, 18, `stroke="#ffffff" stroke-width="8"`) + rect(-w / 2 + 14, -h / 2 + 14, w * 0.3, h - 28, '#ffffff', 10, 'opacity="0.55"') + `<path d="M${-w * 0.15},${-h * 0.4} L${w * 0.05},${-h * 0.05} L${-w * 0.08},${h * 0.1} L${w * 0.12},${h * 0.42}" stroke="${ICED}" stroke-width="5" fill="none"/>`, `translate(${x} ${y}) rotate(${rot})`);
const can = (x, y, col, rot = 0, s = 1) => g(rect(-34, -70, 68, 140, col, 14) + rect(-28, -70, 14, 140, '#ffffff', 6, 'opacity="0.3"') + rect(-26, -80, 52, 12, '#c8ccd2', 4), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const car = (x, y, col, s = 1, rot = 0) => g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` + `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#1a2230" opacity="0.85"/>` + circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#8a8e94') + circ(120, 0, 16, '#8a8e94'), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const ship = (x, y, s = 1, rot = 0) => g(`<path d="M-330,0 L330,0 L270,120 L-270,120Z" fill="#c8312b"/>` + rect(-330, -14, 660, 22, '#1d222c', 4) + rect(-230, -130, 180, 116, '#2f6fd6', 8) + rect(-40, -130, 180, 116, '#d9a23a', 8) + rect(160, -210, 120, 196, '#f2f2ea', 8) + rect(180, -190, 80, 34, '#2a3a52', 4) + rect(200, -290, 44, 80, '#1d222c', 6), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const wave = (t, y, col, amp = 26) => { let d = `M-20,1960 L-20,${y}`; for (let x = -20; x <= 1100; x += 40) d += ` L${x},${y + Math.sin(x * 0.018 + t * 7) * amp + Math.sin(x * 0.043 - t * 5) * amp * 0.45}`; return `<path d="${d} L1100,1960Z" fill="${col}"/>`; };
const kitchen = (s, fl = '#f2d7a8') => { s += vgrad('#fff2d0', '#ffd98e', 0, 1500) + rect(0, 1500, 1080, 420, '#c98a4a'); for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) s += rect(i * 160 - 20 + (j % 2) * 40, 1000 + j * 100, 150, 90, fl, 6, 'opacity="0.55"'); return s + rect(60, 480, 960, 240, '#d0654a', 14) + rect(90, 510, 280, 180, '#ec8a6a', 10) + rect(400, 510, 280, 180, '#ec8a6a', 10) + rect(710, 510, 280, 180, '#ec8a6a', 10); };
const fridge = (x, y, s, open) => g(rect(-170, -520, 340, 520, '#eef3f8', 20, 'stroke="#aeb8c4" stroke-width="8"') + (open ? rect(-150, -500, 300, 480, '#fff8d8', 10) + rect(-150, -350, 300, 12, '#aeb8c4') + rect(-150, -190, 300, 12, '#aeb8c4') : rect(120, -420, 16, 180, '#8a94a0', 8)), `translate(${x} ${y}) scale(${s})`);

// stamp with an opaque paper backing so it reads on busy/blue backgrounds
const sb = (x, y, text, k, col, rot = -8, size = 64) => k > 0 ? g(rect(-(text.length * size * 0.36 + 40), -size * 0.75, 2 * (text.length * size * 0.36 + 40), size * 1.5, '#fff8ec', 10), `translate(${x} ${y}) rotate(${rot}) scale(${1 + (1 - clamp(k)) * 0.8})`) + stamp(x, y, text, k, col, rot, size) : '';

export async function init() {
  const W = await (await fetch('/work/ice5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = 47.8;
  const T = {
    water: wt('water', 0), froze: wt('froze', 0), news: wt('news', 0), house: wt('house', 0), explode: wt('explode', 0),
    bursts: wt('bursts', 2), ice: wt('ice', 2), nine: wt('nine', 2), walls: wt('walls', 2), have: wt('have', 2),
    soda: wt('soda', 4), off: wt('off', 4), b1: wt('bang', 4, 0), b2: wt('bang', 4, 1), door: wt('door', 4), quit: wt('quit', 4),
    niagara: wt('niagara', 6), dead: wt('dead', 6), ocean: wt('ocean', 6), locks: wt('locks', 6), ship: wt('ship', 6), parked: wt('parked', 6),
    road: wt('road', 8), rink: wt('rink', 8), luck: wt('luck', 8), braking: wt('braking', 8),
    coffee: wt('coffee', 10), brick: wt('brick', 10), inside: wt('inside', 10), relax: wt('relax', 10), alone: wt('alone', 10),
    back: wt('back', 11), pipe: wt('pipe', 11), once: wt('once', 11),
    texas: wt('texas', 12), fridge: wt('fridge', 12), alive: wt('alive', 12), soaked: wt('soaked', 12), insurance: wt('insurance', 12), god: wt('god', 12), me: wt('me', 12),
    next: wt('next', 13), comments: wt('comments', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 — hook: a sunny street with a fountain, it freezes solid, house next
    [0, (t) => {
      const kF = seg(t, T.froze - 0.1, T.froze + 0.35), kH = seg(t, T.news - 0.05, T.news + 0.2);
      let s = vgrad('#58b4f0', '#d8f0ff', 0, 1100) + rect(0, 1100, 1080, 820, '#8ac070');
      // house
      s += rect(240, 720, 600, 480, '#e8a860', 10) + `<path d="M190,730 L540,430 L890,730Z" fill="#c8312b"/>` + rect(470, 950, 140, 250, '#7a4a2a', 8) + rect(290, 800, 130, 120, '#bfe4ff', 8) + rect(660, 800, 130, 120, '#bfe4ff', 8);
      // pipes glowing red when the house is about to go
      if (kH > 0) { const p = 0.45 + 0.45 * Math.sin(t * 24); s += `<path d="M300,1180 L300,760 L780,760 L780,1180" stroke="#ff2a3a" stroke-width="26" fill="none" opacity="${p}"/>`; }
      // lawn sprinkler jets: moving water, then frozen spikes
      const r = rng(5);
      for (let i = 0; i < 16; i++) { const a = -160 + i * 9.5, l = 280 + r() * 240, x0 = 540, y0 = 1560, wob = kF < 1 ? Math.sin(t * 14 + i) * 26 * (1 - kF) : 0; const x1 = x0 + Math.cos(a * Math.PI / 180) * l * 1.5 + wob, y1 = y0 + Math.sin(a * Math.PI / 180) * l; s += `<path d="M${x0},${y0} Q${(x0 + x1) / 2},${y0 - 300 - l * 0.25} ${x1},${y1 + 120}" stroke="${kF > 0.5 ? ICE2 : WATER}" stroke-width="${kF > 0.5 ? 24 : 16}" fill="none" stroke-linecap="round"/>`; }
      s += rect(480, 1540, 120, 60, '#2a3a52', 12);
      s += frost(kF);
      s += sb(540, 640, 'WATER: FROZEN', seg(t, T.froze - 0.05, T.froze + 0.2), '#2f6fd6', -7, 70);
      s += chip(540, 480, '5 SECONDS', pop(seg(t, 0, 0.12)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += crack(t, T.explode - 0.05, 540, 900, 11, '#ffffff') + flash(t, 0, 0.9) + flash(t, T.froze - 0.05, 0.9, ICE2) + flash(t, T.explode, 0.7) + speedLines(t, { a: 0.22, seed: 2 });
      return g(cam(fin(s), 0, { z0: punch(t, [T.froze, T.explode], 0.1) * lerp(1, 1.1, kH), z1: 1, oy: 900 }), shake(t, [0.02, T.froze, T.house, T.explode], 28)) + pill('ALL OF IT');
    }],
    [N[0], card(1)],
    // 2 — pipes inside the wall burst
    [C[0], (t) => {
      const kI = seg(t, C[0], T.bursts + 0.05), kB = seg(t, T.bursts - 0.05, T.bursts + 0.1);
      let s = vgrad('#ffe6b8', '#f0c078');
      for (let i = 0; i < 9; i++) for (let j = 0; j < 13; j++) s += rect((j % 2) * 60 + i * 130 - 40, j * 140 + 30, 120, 130, '#e8b070', 8, 'opacity="0.5"');
      const ys = [640, 900, 1500, 1760];
      ys.forEach((y, i) => { const w = lerp(60, 86, kB); s += rect(-20, y - w / 2, 1120, w, '#b87a4a', 10); s += rect(-20, y - w / 2 + 8, 1120 * kI, w - 16, ICE, 6); if (kB > 0) { for (let j = 0; j < 5; j++) { const x = 90 + j * 220 + i * 44; s += `<path d="M${x - 44},${y - 80} L${x + 8},${y - 12} L${x - 16},${y + 8} L${x + 40},${y + 84}" stroke="#2a1a10" stroke-width="10" fill="none"/>` + iceBlock(x, y, 72, 72, (t - T.bursts) * 240 + j * 30); } } });
      s += crack(t, T.bursts - 0.03, 540, 780, 21, '#3a2412') + crack(t, T.walls - 0.03, 420, 1620, 6, '#3a2412');
      s += shards(t, T.bursts, 300, 640, { seed: 4 }) + shards(t, T.bursts + 0.08, 800, 900, { seed: 8 }) + debris(t, T.walls, 540, 1200, { n: 40, col: '#8a5a32', seed: 3, size: 30 });
      s += sb(540, 600, 'BURST', seg(t, T.bursts - 0.05, T.bursts + 0.15), '#c8102e', -6, 110);
      s += chip(540, 770, 'ICE = +9% VOLUME', pop(seg(t, T.nine - 0.1, T.nine + 0.12)), { size: 50, col: '#0b2a44', bg: ICE });
      s += flash(t, T.bursts - 0.04, 0.85);
      return g(cam(fin(s), 0, { z0: punch(t, [T.bursts, T.walls], 0.11), z1: 1, oy: 1100 }), shake(t, [T.bursts, T.walls, T.have], 36)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — fridge full of soda blows up
    [C[1], (t) => {
      const fx = 540, fy = 1680, fs = 2.0;
      let s = vgrad('#fff2d0', '#ffd98e', 0, 1500) + rect(0, 1520, 1080, 400, '#c98a4a');
      const kD = seg(t, T.door - 0.05, T.door + 0.35);
      s += g(rect(-170, -520, 340, 520, '#fff8d8', 20, 'stroke="#aeb8c4" stroke-width="8"') + rect(-150, -350, 300, 12, '#aeb8c4') + rect(-150, -190, 300, 12, '#aeb8c4'), `translate(${fx} ${fy}) scale(${fs})`);
      const cols = ['#c8312b', '#2f6fd6', '#2fae6a', '#d9a23a']; const r = rng(4);
      for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) {
        const cx = 300 + i * 160, cy = 760 + row * 330, tb = [T.off, T.b1, T.b2][row] + i * 0.04;
        if (t < tb) s += can(cx, cy, cols[(i + row) % 4], Math.sin(t * 30 + i) * 3, 1.15);
        else { const d = t - tb; s += g(`<path d="M0,-60 C${r() * 8},-40 -40,-20 -26,50 L26,50 C40,-20 ${-r() * 8},-40 0,-60Z" fill="${cols[(i + row) % 4]}"/>`, `translate(${cx + (i - 1.5) * 300 * d} ${cy + 400 * d * d - 200 * d}) rotate(${d * 700 * (i % 2 ? 1 : -1)})`) + circ(cx, cy, Math.max(0, 110 - d * 130), '#ffffff', `opacity="${Math.max(0, 0.9 - d * 1.2)}"`); }
      }
      // door flies off toward camera
      s += g(rect(-180, -530, 360, 540, '#dfe7ef', 18, 'stroke="#aeb8c4" stroke-width="8"') + rect(120, -430, 16, 180, '#8a94a0', 8), `translate(${lerp(1130, 1760, kD)} ${lerp(1680, 1000, kD)}) rotate(${kD * 80}) scale(${lerp(1.9, 3, kD)})`);
      s += shards(t, T.off, 540, 900, { seed: 5 }) + shards(t, T.b1, 400, 1200, { seed: 6 }) + shards(t, T.b2, 700, 1400, { seed: 7 });
      s += bigText(330, 640, 'BANG', pop(seg(t, T.b1 - 0.05, T.b1 + 0.1)) * (t < T.b2 ? 1 : 0), { size: 190, col: '#ffcf30', rot: -8 });
      s += bigText(750, 820, 'BANG', pop(seg(t, T.b2 - 0.05, T.b2 + 0.1)) * (t < T.door - 0.1 ? 1 : 0), { size: 190, col: '#ff5a3a', rot: 7 });
      s += sb(540, 620, 'DOOR: QUIT', seg(t, T.quit - 0.12, T.quit + 0.1), '#c8102e', -6, 88);
      s += flash(t, T.b1, 0.55) + flash(t, T.b2, 0.55) + flash(t, T.off, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.off, T.b1, T.b2, T.door], 0.11), z1: 1, oy: 1100 }), shake(t, [T.off, T.b1, T.b2, T.door], 34)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — Niagara freezes, ocean locks, ships parked
    [C[2], (t) => {
      const kF = seg(t, T.dead - 0.2, T.dead + 0.05), kO = t >= T.ocean - 0.06;
      let s;
      if (!kO) {
        s = vgrad('#58b4f0', '#cfeeff', 0, 620) + rect(0, 480, 1080, 170, '#4a9a48');
        s += rect(0, 620, 1080, 180, kF > 0.6 ? ICE : '#2d8fe0');
        const r = rng(8);
        s += rect(0, 780, 1080, 1140, '#7a7468');
        s += rect(60, 780, 960, 1000, kF > 0.6 ? ICE : '#3fa6ee', 16);
        for (let i = 0; i < 34; i++) { const x = 80 + r() * 920, l = 140 + r() * 360, y = 760 + ((r() * 1000 + (kF > 0.6 ? 0 : t * 1400)) % 1000); s += rect(x, y, 14, l, kF > 0.6 ? ICED : '#ffffff', 7, `opacity="${kF > 0.6 ? 0.55 : 0.75}"`); }
        s += rect(0, 1760, 1080, 200, kF > 0.6 ? ICE2 : '#2d8fe0');
        if (kF <= 0.6) for (let i = 0; i < 26; i++) s += circ(40 + i * 40, 1770 + Math.sin(t * 12 + i) * 18, 44 + (i % 4) * 12, '#ffffff', 'opacity="0.9"');
        s += sb(540, 570, 'NIAGARA: STOPPED', seg(t, T.dead - 0.05, T.dead + 0.15), '#2f6fd6', -5, 64);
        s += frost(kF * 0.6, 7) + flash(t, T.dead - 0.05, 0.9, ICE2);
      } else {
        const kL = seg(t, T.locks - 0.15, T.locks + 0.2);
        s = vgrad('#58b4f0', '#d8f2ff', 0, 880) + (kL > 0 ? rect(0, 860, 1080, 1060, ICE) + rect(0, 860, 1080, 26, '#ffffff') : wave(t, 860, '#1f8fe0'));
        const r = rng(2);
        if (kL > 0) for (let i = 0; i < 18; i++) { const x = r() * 1080, y = 900 + r() * 980; s += `<path d="M${x},${y} l${60 + r() * 150},${30 - r() * 70} l${40 + r() * 80},${r() * 60}" stroke="${ICED}" stroke-width="7" fill="none" opacity="${kL}"/>`; }
        const rock = kL > 0 ? 0 : Math.sin(t * 5) * 4;
        s += ship(540, 900 + (kL > 0 ? -40 * kL : Math.sin(t * 5) * 18), 1.15, rock - 6 * kL);
        s += ship(150, 1560, 0.72, 5 * kL) + ship(900, 1460, 0.6, -4 * kL);
        s += sb(540, 600, 'PARKED', seg(t, T.parked - 0.1, T.parked + 0.1), '#c8102e', -7, 120);
        s += chip(540, 770, 'OCEAN: LOCKED', pop(seg(t, T.locks - 0.1, T.locks + 0.12)), { size: 48, col: '#0b2a44', bg: ICE });
        s += debris(t, T.locks, 540, 980, { n: 30, col: ICE2, seed: 12, size: 26 }) + flash(t, T.ocean - 0.06, 0.6, ICE2) + flash(t, T.locks - 0.04, 0.8, ICE2);
      }
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.dead, T.locks, T.parked], 0.12), z1: 1, oy: 1000 }), shake(t, [T.dead, T.locks, T.parked], 40, 8)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — skating rink: cars pirouette
    [C[3], (t) => {
      let s = vgrad('#7ac4f4', '#dff4ff', 0, 880) + rect(0, 840, 1080, 1080, '#d8f2ff');
      const rr = rng(4); let x = -40; while (x < 1120) { const w = 150 + rr() * 130, h = 260 + rr() * 330, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8'][Math.floor(rr() * 4)]; s += rect(x, 840 - h, w, h, c); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, 840 - h + 22 + j * 80, 30, 44, '#2a3a52', 3, 'opacity="0.7"'); x += w + 8; }
      for (let i = 0; i < 14; i++) s += `<path d="M${rr() * 1080},${900 + rr() * 980} l${80 + rr() * 200},${60 - rr() * 120}" stroke="#ffffff" stroke-width="10" opacity="0.8"/>`;
      s += rect(0, 1120, 1080, 200, ICED, 0, 'opacity="0.35"') + speedLines(t, { a: 0.3, seed: 5 });
      const k = seg(t, C[3], N[4]);
      s += car(lerp(-260, 1320, k), 1120, '#d9a23a', 0.95, k * 720);
      s += car(lerp(1380, -260, seg(t, T.road - 0.1, N[4] + 0.2)), 1420, '#2f6fd6', 1.1, -k * 900);
      s += car(lerp(260, 820, k), 1740, '#c8312b', 1.1, k * 400 + 30);
      s += sb(540, 610, 'SKATING RINK', seg(t, T.rink - 0.1, T.rink + 0.1), '#2f6fd6', -5, 74);
      s += chip(540, 780, 'GOOD LUCK', pop(seg(t, T.luck - 0.1, T.luck + 0.1)), { size: 56, col: '#fff', bg: '#c8102e' });
      s += debris(t, T.braking, 600, 1500, { n: 30, col: '#ffffff', seed: 8, size: 24 }) + flash(t, T.braking, 0.45);
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.rink, T.braking], 0.1), z1: 1, oy: 1200 }), shake(t, [T.rink, T.braking], 30)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 — coffee brick, then the water inside you is fine
    [C[4], (t) => {
      const kC = t < T.inside - 0.08; let s;
      if (kC) {
        s = kitchen('');
        const kB = seg(t, T.brick - 0.1, T.brick + 0.1);
        s += rect(0, 1560, 1080, 360, '#a87a4a') + rect(0, 1560, 1080, 30, '#7a5230');
        const y = 1500, x = 540;
        s += g(rect(-200, -220, 400, 300, '#ffffff', 40, 'stroke="#2a3a52" stroke-width="10"') + `<path d="M200,-160 C350,-160 350,20 200,20" stroke="#2a3a52" stroke-width="44" fill="none"/>`, `translate(${x} ${y}) scale(1.35)`);
        if (kB > 0) s += iceBlock(x, y - 200, 460, 280, -3); else s += rect(x - 240, y - 310, 480, 130, '#5a3216', 20);
        s += sb(540, 620, 'BRICK', seg(t, T.brick - 0.05, T.brick + 0.12), '#c8102e', -7, 140);
        s += debris(t, T.brick, x, y - 200, { n: 20, col: ICE2, seed: 3 }) + flash(t, T.brick, 0.7, ICE2);
      } else {
        const kR = seg(t, T.relax - 0.1, T.relax + 0.1);
        s = vgrad(kR > 0 ? '#2fae6a' : '#c8102e', kR > 0 ? '#0a6a3a' : '#5a0612') + speedLines(t, { a: 0.14, vertical: true, seed: 3 });
        s += adult({ ...YOU, x: 540, y: 2160, s: 1.66, face: kR > 0 ? 'neutral' : 'tense', pose: kR > 0 ? 'stand' : 'up', tilt: kR > 0 ? 0 : Math.sin(t * 22) * 5 });
        const scanY = 520 + ((t * 900) % 1100);
        if (kR <= 0) s += rect(90, scanY, 900, 18, ICE2, 8, 'opacity="0.95"') + glow(540, scanY, 460, ICE, 0.5);
        s += chip(540, 570, kR > 0 ? 'BODY WATER: NOT FROZEN' : 'WATER IN YOU?', 1, { size: 50, col: kR > 0 ? '#0a3a20' : '#fff', bg: kR > 0 ? '#c8f5d8' : '#1d222c' });
        s += stamp(540, 780, 'RELAX', seg(t, T.relax - 0.05, T.relax + 0.12), '#fff', -6, 120);
        s += flash(t, T.inside - 0.08, 0.7, '#000000', 0.25) + flash(t, T.relax - 0.05, 0.7);
      }
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.brick, T.inside, T.relax], 0.1), z1: 1, oy: 1200 }), shake(t, [T.brick, T.inside, T.relax], 26)) + bar(t) + pill('SECOND 5');
    }],
    // 11 — water is back: ceiling bursts, room floods
    [C[5], (t) => {
      let s = kitchen('');
      const kF = seg(t, C[5], C[6]);
      for (let i = 0; i < 5; i++) { const x = 110 + i * 215, wob = Math.sin(t * 20 + i * 2) * 18; s += `<path d="M${x},-20 C${x + wob},600 ${x - wob},1200 ${x + wob * 0.5},1900" stroke="${WATER}" stroke-width="${70 + (i % 2) * 26}" fill="none"/>` + `<path d="M${x},-20 C${x + wob},600 ${x - wob},1200 ${x + wob * 0.5},1900" stroke="#ffffff" stroke-width="12" fill="none" opacity="0.6"/>`; }
      s += wave(t, lerp(1720, 880, kF), WATER, 36) + wave(t + 2, lerp(1760, 960, kF), '#4fb0f0', 28);
      const r = rng(6);
      for (let i = 0; i < 22; i++) s += circ(r() * 1080, lerp(1800, 840, kF) + r() * 140 + Math.sin(t * 9 + i) * 40, 16 + r() * 34, '#ffffff', 'opacity="0.7"');
      s += sb(540, 600, 'WATER: BACK', seg(t, C[5], C[5] + 0.2), '#2fae6a', 6, 84);
      s += chip(540, 780, 'EVERY BROKEN PIPE', pop(seg(t, T.pipe - 0.1, T.pipe + 0.1)), { size: 48, col: '#fff', bg: '#c8102e' });
      s += sb(540, 930, 'AT ONCE', seg(t, T.once - 0.1, T.once + 0.1), '#c8102e', -5, 92);
      s += flash(t, C[5], 0.95) + flash(t, T.once, 0.5, ICE2);
      return g(cam(fin(s, 0.3), 0, { z0: punch(t, [C[5], T.once], 0.12), z1: 1, oy: 1100 }), shake(t, [C[5], T.pipe, T.once], 40, 8)) + pill('WATER: BACK');
    }],
    // 12 — guy in the flooded kitchen, fridge door in hand
    [C[6], (t) => {
      let s = kitchen('');
      const yW = 1560 + Math.sin(t * 2) * 8, kG = seg(t, T.insurance - 0.1, T.insurance + 0.1);
      s += fridge(190, 1530, 1.2, true);
      s += adult({ ...YOU, x: 560, y: 2090, s: 1.5, face: t > T.soaked - 0.2 ? 'tense' : 'neutral', pose: 'hold', tilt: Math.sin(t * 2.4) * 2 });
      // fridge door held at his side
      s += g(rect(-120, -360, 240, 380, '#dfe7ef', 14, 'stroke="#aeb8c4" stroke-width="7"') + rect(80, -280, 12, 130, '#8a94a0', 6), `translate(860 1560) rotate(6) scale(1.15)`);
      s += wave(t * 0.4, yW, WATER, 18) + wave(t * 0.4 + 1, yW + 30, '#4fb0f0', 14);
      const r = rng(3); for (let i = 0; i < 10; i++) s += can(120 + i * 95, yW + 40 + Math.sin(t * 2 + i) * 14, ['#c8312b', '#2f6fd6', '#d9a23a'][i % 3], 60 + i * 30 + r() * 30, 0.6);
      for (let i = 0; i < 16; i++) { const x = 90 + (i * 67) % 900, y = 760 + ((t * 700 + i * 90) % 800); s += rect(x, y, 10, 44, WATER, 5, 'opacity="0.8"'); }
      s += chip(540, 500, 'TEXAS', pop(seg(t, C[6], C[6] + 0.15)), { size: 44, col: '#fff', bg: '#1d222c' });
      s += chip(330, 650, 'ALIVE.', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 56, col: '#fff', bg: '#2fae6a' });
      s += chip(740, 650, 'SOAKED.', pop(seg(t, T.soaked - 0.1, T.soaked + 0.1)), { size: 56, col: '#fff', bg: '#2f6fd6' });
      s += sb(540, 830, 'ACT OF GOD', kG * (t < T.me - 0.1 ? 1 : 0), '#c8102e', -6, 80);
      s += sb(540, 830, 'IT WAS ME', seg(t, T.me - 0.05, T.me + 0.1), '#c8102e', 6, 100);
      s += flash(t, T.me - 0.04, 0.6) + speedLines(t, { a: 0.1, seed: 4 });
      return g(cam(fin(s, 0.32), seg(t, C[6], C[7]), { z0: 1.0, z1: 1.1, ox: 560, oy: 1300 }), shake(t, [T.alive, T.soaked, T.me], 22)) + pill('AFTER');
    }],
    // 13 — CTA
    [C[7], (t) => {
      const opts = ['FIRE?', 'AIR?', 'THE INTERNET?', 'SOUND?', 'TIME?', 'COLOR?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'FREEZES', 1, { size: 180, col: ICE }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 120, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.2 }); } };
}
