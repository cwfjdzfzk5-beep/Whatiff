// "What if all plastic disappeared for five seconds?" — HYPE format (countdown cards, hard cuts, shake/flash/punch).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const fin = (s, v = 0.45) => s + grade('#0b1a2e', '#2e1a0b', 0.1) + vignette(v);
const bottle = (x, y, k = 1, fill = 1, rot = 0, s = 1) => k <= 0 ? '' : g(rect(-34, -70, 68, 170, '#9fd4ff', 22, 'opacity="0.55" stroke="#e8f6ff" stroke-width="4"') + (fill > 0 ? rect(-28, 100 - 160 * fill, 56, 160 * fill - 6, '#3a9ae8', 16, 'opacity="0.8"') : '') + rect(-18, -100, 36, 34, '#2f6fd6', 6) + rect(-30, -10, 60, 40, '#ffffff', 4, 'opacity="0.85"'), `translate(${x} ${y}) rotate(${rot}) scale(${s * (0.4 + 0.6 * k)})`, `opacity="${k}"`);
// liquid stream falling from (x,y0) to floor yF, starting t0
const pour = (t, t0, x, y0, yF, col = '#3a9ae8', w = 46, seed = 1, dur = 0.25) => {
  const d = t - t0; if (d < 0) return ''; const r = rng(seed); let s = '';
  const head = Math.min(yF, y0 + 2600 * d * d + 300 * d), tail = Math.min(yF, y0 + Math.max(0, d - dur) * 2400);
  if (tail < yF) s += rect(x - w / 2, tail, w, Math.max(0, head - tail), col, w / 2, 'opacity="0.9"');
  if (head >= yF) { const k = clamp((d - 0.25) / 0.8); for (let i = 0; i < 14; i++) { const a = Math.PI + r() * Math.PI, v = 180 + r() * 380, dd = ((d - 0.25) % 0.7); if (dd > 0) s += circ(x + Math.cos(a) * v * dd, yF + Math.sin(a) * v * dd + 900 * dd * dd, 8 + r() * 10, col, `opacity="${Math.max(0, 1 - dd / 0.7)}"`); }
    s += `<ellipse cx="${x}" cy="${yF + 10}" rx="${60 + 260 * k}" ry="${14 + 30 * k}" fill="${col}" opacity="0.85"/>`; }
  return s;
};
const kitchen = () => vgrad('#fff3df', '#ffd9a8', 0, 1500) + rect(0, 1500, 1080, 420, '#d9b88a') + [...Array(6)].map((_, i) => rect(i * 190 - 20, 1500, 4, 420, '#c09a6a')).join('') + rect(60, 520, 380, 260, '#9ad0ff', 10, 'stroke="#ffffff" stroke-width="12"');
const desk = (x, y) => rect(x - 150, y, 300, 22, '#e8eaee', 6) + rect(x - 130, y + 22, 16, 230, '#8a8e96') + rect(x + 114, y + 22, 16, 230, '#8a8e96') + rect(x - 70, y - 150, 140, 100, '#1d222c', 8) + rect(x - 60, y - 140, 120, 80, '#3a8ae8', 4) + rect(x - 8, y - 50, 16, 50, '#1d222c');
const chairP = (x, y, k) => k <= 0 ? '' : g(rect(-60, -140, 120, 22, '#ff7a1a', 10) + rect(-60, -300, 22, 170, '#ff7a1a', 8) + rect(-54, -120, 12, 120, '#e8641a') + rect(42, -120, 12, 120, '#e8641a'), `translate(${x} ${y})`, `opacity="${k}"`);

export async function init() {
  const W = await (await fetch('/work/plastic5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 1.0;
  const T = {
    plastic: wt('plastic', 0), disappeared: wt('disappeared', 0), news: wt('news', 0), drink: wt('drink', 0), hit: wt('hit', 0), floor: wt('floor', 0),
    every: wt('every', 2), tub: wt('tub', 2), milk: wt('milk', 2), ketchup: wt('ketchup', 2), shampoo: wt('shampoo', 2), splat: wt('splat', 2), swamp: wt('swamp', 2),
    half: wt('half', 4), dashboard: wt('dashboard', 4), steering: wt('steering', 4), gone: wt('gone', 4), traffic: wt('traffic', 4),
    cable: wt('cable', 6), insulation: wt('insulation', 6), copper: wt('copper', 6), hits: wt('hits', 6), sparks: wt('sparks', 6), blackout: wt('blackout', 6),
    chair: wt('chair', 8), vanishes: wt('vanishes', 8), office: wt('office', 8), hits2: wt('hits', 8), floor2: wt('floor', 8),
    pipes: wt('pipes', 10), gone2: wt('gone', 10), water: wt('water', 10), ceiling: wt('ceiling', 10), ask: wt('ask', 10), toilet: wt('toilet', 10),
    back: wt('back', 11), bottle: wt('bottle', 11), empty: wt('empty', 11),
    somewhere: wt('somewhere', 12), puddle: wt('puddle', 12), dark: wt('dark', 12), alive: wt('alive', 12), mondays: wt('mondays', 12),
    next: wt('next', 13), comments: wt('comments', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  // hand position of YOU at x=540,y=1750,s=1.5, pose hold → right hand ≈ (585, 1255)
  const HX = 600, HY = 1360, FLOOR = 1960, PS = 2.0;

  const shots = [
    // 0 — hook: you hold a bottle, plastic switches off, the drink drops
    [0, (t) => {
      const kV = 1 - seg(t, T.drink - 0.15, T.drink + 0.05);
      let s = kitchen();
      s += adult({ ...YOU, x: 540, y: FLOOR, s: PS, face: t > T.drink ? 'open' : 'neutral', pose: 'hold', tilt: Math.sin(t * 3) * 2 });
      s += bottle(HX, HY - 60, kV, 0.85, 0, 1.4);
      s += pour(t, T.drink - 0.05, HX, HY - 80, 1880, '#3a9ae8', 80, 2, 0.9);
      s += stamp(540, 620, 'PLASTIC: OFF', seg(t, T.plastic - 0.05, T.plastic + 0.25), '#ff2a3a', -7, 74);
      s += chip(540, 800, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)), { size: 46, col: '#fff', bg: '#c8102e' });
      if (t > T.drink) s += speedLines(t, { a: 0.3, vertical: true, seed: 2 });
      s += flash(t, T.drink - 0.1, 0.6) + flash(t, T.floor, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [T.drink, T.floor], 0.1), z1: 1, oy: 1300 }), shake(t, [T.plastic, T.floor], 28)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — fridge: every container vanishes, everything splats
    [C[0], (t) => {
      let s = kitchen() + rect(240, 440, 600, 1080, '#f2f4f7', 30, 'stroke="#c9ced8" stroke-width="8"') + rect(270, 470, 540, 1020, '#dfe9f2', 16);
      const items = [['#3a9ae8', 340, 720, T.every], ['#d62a1a', 480, 720, T.ketchup], ['#2fae9a', 640, 720, T.shampoo], ['#f2c84a', 360, 1020, T.tub], ['#ffffff', 540, 1020, T.milk], ['#9a5ad6', 720, 1020, T.shampoo + 0.1], ['#ff8a1a', 460, 1320, T.tub + 0.1], ['#ffffff', 660, 1320, T.milk + 0.1]];
      [700, 1000, 1300].forEach((y) => { s += rect(270, y + 80, 540, 10, '#b8c4d0'); });
      items.forEach(([c, x, y, t0], i) => { const kV = 1 - seg(t, t0 - 0.08, t0 + 0.08); if (kV > 0) s += g(rect(-50, -80, 100, 160, c, 14, 'stroke="#1d222c" stroke-width="4"') + rect(-50, -30, 100, 40, '#1d222c', 0, 'opacity="0.2"'), `translate(${x} ${y}) scale(${kV})`); s += pour(t, t0, x, y - 40, 1560, c, 70, i + 3, 0.7); });
      s += stamp(540, 600, 'SPLAT', seg(t, T.splat - 0.1, T.splat + 0.2), '#c8102e', -8, 110);
      s += chip(540, 1640, 'FRIDGE = SWAMP', pop(seg(t, T.swamp - 0.15, T.swamp + 0.05)), { size: 50, col: '#fff', bg: '#2f7a3a' });
      s += flash(t, T.splat, 0.5);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.every, T.ketchup, T.splat], 0.1), z1: 1, oy: 1200 }), shake(t, [T.every, T.milk, T.ketchup, T.shampoo, T.splat], 26)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — driver POV: dashboard and steering wheel vanish in a traffic jam
    [C[1], (t) => {
      let s = vgrad('#8ac0f0', '#d8e8f4', 0, 1000) + rect(0, 760, 1080, 400, '#7a7e86');
      for (let i = 0; i < 3; i++) { const x = 160 + i * 380; s += rect(x - 150, 640, 300, 180, ['#d9a23a', '#2f6fd6', '#2fae6a'][i], 30) + rect(x - 130, 760, 60, 26, '#ff2a2a', 6) + rect(x + 70, 760, 60, 26, '#ff2a2a', 6) + glow(x - 100, 773, 70, '#ff2a2a', 0.6) + glow(x + 100, 773, 70, '#ff2a2a', 0.6); }
      s += rect(0, 0, 1080, 90, '#3a3e46') + rect(0, 0, 70, 1920, '#3a3e46') + rect(1010, 0, 70, 1920, '#3a3e46');
      const kG = 1 - seg(t, T.gone - 0.15, T.gone + 0.1), kD = 1 - seg(t, T.dashboard - 0.1, T.dashboard + 0.1);
      s += rect(70, 1150, 940, 770, '#5a5e66') + `<path d="M120,1200 L960,1200 M200,1300 L880,1300" stroke="#8a8e96" stroke-width="18"/>`; // bare metal frame
      if (kD > 0) s += g(rect(70, 1080, 940, 360, '#24262b', 40) + rect(380, 1140, 320, 120, '#0d0f14', 16) + t2(540, 1220, '0 KM/H', 54, '#4ae0ff', { weight: 800 }), '', `opacity="${kD}"`);
      if (kG > 0) s += g(circ(0, 0, 250, 'none', 'stroke="#1b1c20" stroke-width="56"') + rect(-250, -20, 500, 46, '#1b1c20', 20) + circ(0, 0, 70, '#2a2c32'), `translate(540 1560) scale(${0.5 + 0.5 * kG})`, `opacity="${kG}"`);
      const sq = t > T.gone ? 0.75 : 1;
      s += g(circ(0, 0, 54, YOU.skin) + rect(-30, 30, 60, 300, YOU.top, 24), `translate(300 ${1560 + (t > T.gone ? 30 : 0)}) scale(${sq} 1)`) + g(circ(0, 0, 54, YOU.skin) + rect(-30, 30, 60, 300, YOU.top, 24), `translate(780 ${1560 + (t > T.gone ? 30 : 0)}) scale(${sq} 1)`);
      s += debris(t, T.dashboard, 540, 1200, { n: 26, col: '#24262b', seed: 5 }) + debris(t, T.gone, 540, 1560, { n: 22, col: '#1b1c20', seed: 7 });
      s += bigText(540, 460, '50% PLASTIC', pop(seg(t, T.half - 0.1, T.half + 0.15)) * (1 - seg(t, T.gone, T.gone + 0.1)), { size: 110, col: '#ffcf6a' });
      s += stamp(540, 460, 'STEERING: GONE', seg(t, T.gone - 0.05, T.gone + 0.2), '#ff2a3a', -6, 66);
      s += chip(540, 1000, 'GRIPPING AIR', pop(seg(t, T.gone + 0.1, T.gone + 0.3)), { size: 50, col: '#fff', bg: '#c8102e' });
      s += chip(540, 1820, 'SPEED: 0. PHEW.', pop(seg(t, T.traffic - 0.15, T.traffic + 0.05)), { size: 46, col: '#fff', bg: '#2fae6a' });
      s += flash(t, T.gone - 0.05, 0.6);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.dashboard, T.gone], 0.1), z1: 1, oy: 1300 }), shake(t, [T.dashboard, T.gone], 30)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — cables lose insulation, copper touches, sparks, blackout
    [C[2], (t) => {
      const kI = seg(t, T.insulation - 0.1, T.insulation + 0.25), kH = seg(t, T.hits - 0.2, T.hits + 0.1);
      let s = vgrad('#f4e8d0', '#d8c8a8') + glow(540, 300, 400, '#fff4c0', 0.5) + circ(540, 260, 50, '#fff8d8');
      const cols = ['#c8312b', '#2f6fd6', '#f2c84a', '#2fae6a', '#1d222c'];
      for (let i = 0; i < 5; i++) { const y0 = 620 + i * 230, yy = lerp(y0, 1060, kH * 0.85); const d = `M-20,${y0} C300,${y0} 400,${yy} 540,${yy} S800,${y0} 1100,${y0}`;
        if (kI < 1) s += `<path d="${d}" stroke="${cols[i]}" stroke-width="44" fill="none" opacity="${1 - kI}"/>`;
        s += `<path d="${d}" stroke="#d9823a" stroke-width="${lerp(10, 16, kI)}" fill="none"/>`; }
      const tS = T.sparks - 0.1;
      if (t > T.hits) { const r = rng(Math.floor(t * 20)); for (let i = 0; i < 30; i++) { const a = r() * Math.PI * 2, v = 80 + r() * 420; s += `<path d="M540,1060 l${Math.cos(a) * v},${Math.sin(a) * v}" stroke="${r() > 0.5 ? '#fff6a0' : '#ffb020'}" stroke-width="${3 + r() * 5}" opacity="0.9"/>`; } s += glow(540, 1060, 380, '#ffd040', 0.7); }
      s += crack(t, tS, 540, 1060, 13, '#fff6a0');
      s += stamp(540, 1560, 'INSULATION: GONE', seg(t, T.insulation, T.insulation + 0.2) * (1 - seg(t, T.hits, T.hits + 0.05)), '#c8102e', -6, 62);
      s += chip(540, 600, 'COPPER + COPPER', pop(seg(t, T.copper - 0.1, T.copper + 0.1)), { size: 46, col: '#fff', bg: '#d9823a' });
      const kB = seg(t, T.blackout - 0.05, T.blackout + 0.1);
      if (kB > 0) s += rect(-50, -50, 1180, 2020, '#05060a', 0, `opacity="${0.92 * kB}"`) + stamp(540, 1500, 'BLACKOUT', kB, '#ff2a3a', -6, 100);
      s += flash(t, T.hits, 0.8, '#fff6c0') + flash(t, T.sparks, 0.7, '#fff6c0');
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.hits, T.sparks, T.blackout], 0.12), z1: 1, oy: 1060 }), shake(t, [T.hits, T.sparks, T.blackout], 34)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — office: every plastic chair vanishes, everyone drops
    [C[3], (t) => {
      let s = vgrad('#e8f0f8', '#c8d4e0', 0, 1700) + rect(0, 1700, 1080, 220, '#8a9aaa') + rect(80, 420, 920, 260, '#bfe0ff', 8, 'stroke="#ffffff" stroke-width="10"');
      const kC = 1 - seg(t, T.vanishes - 0.1, T.vanishes + 0.1), drop = t > T.hits2 - 0.25 ? Math.min(140, 2400 * (t - T.hits2 + 0.25) ** 2) : 0;
      const xs = [190, 540, 890];
      xs.forEach((x, i) => { s += desk(x, 1580); });
      xs.forEach((x, i) => { s += chairP(x - 40, 1830, kC); s += g(adult({ ...CROWD[i * 2], x: 0, y: 0, s: 1.0, face: drop > 0 ? 'open' : 'neutral', pose: drop > 0 ? 'up' : 'sit', tilt: drop > 0 ? (i % 2 ? 10 : -10) : 0 }), `translate(${x - 40} ${1830 + drop}) rotate(${drop > 0 ? (i % 2 ? 8 : -8) * drop / 140 : 0})`); });
      s += debris(t, T.hits2, 300, 1880, { n: 20, col: '#ffffff', seed: 11 }) + debris(t, T.hits2 + 0.05, 800, 1880, { n: 20, col: '#ffffff', seed: 12 });
      s += stamp(540, 820, 'CHAIRS: GONE', seg(t, T.vanishes - 0.05, T.vanishes + 0.2), '#ff2a3a', -6, 74);
      s += chip(540, 1000, 'EVERYONE. AT ONCE.', pop(seg(t, T.floor2 - 0.15, T.floor2 + 0.05)), { size: 46, col: '#fff', bg: '#c8102e' });
      s += flash(t, T.hits2, 0.6);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.vanishes, T.hits2], 0.12), z1: 1, oy: 1500 }), shake(t, [T.hits2, T.floor2], 36)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 — pipes vanish: water from the ceiling, the toilet erupts
    [C[4], (t) => {
      let s = vgrad('#dfeef8', '#b8d4e8', 0, 1700) + rect(0, 1700, 1080, 220, '#6a8aa0') + rect(0, 380, 1080, 40, '#9ab0c0');
      const kP = 1 - seg(t, T.gone2 - 0.15, T.gone2 + 0.05);
      if (kP > 0) s += g(rect(160, 420, 36, 1280, '#f4f6f8', 8, 'stroke="#c9ced8" stroke-width="4"') + rect(160, 600, 760, 36, '#f4f6f8', 8, 'stroke="#c9ced8" stroke-width="4"') + rect(884, 420, 36, 900, '#f4f6f8', 8, 'stroke="#c9ced8" stroke-width="4"'), '', `opacity="${kP}"`);
      if (t > T.gone2) { const r = rng(21); for (let i = 0; i < 9; i++) { const x = 80 + i * 115 + r() * 30; s += pour(t, T.gone2 + 0.1 + r() * 0.5, x, 420, 1700, '#3a9ae8', 26 + r() * 20, 30 + i, 9); } }
      // toilet
      const tx = 820, ty = 1700;
      s += rect(tx - 90, ty - 330, 180, 160, '#ffffff', 16, 'stroke="#c9ced8" stroke-width="5"') + `<path d="M${tx - 120},${ty - 170} L${tx + 120},${ty - 170} Q${tx + 110},${ty - 60} ${tx + 40},${ty - 50} L${tx + 50},${ty} L${tx - 50},${ty} L${tx - 40},${ty - 50} Q${tx - 110},${ty - 60} ${tx - 120},${ty - 170}Z" fill="#ffffff" stroke="#c9ced8" stroke-width="5"/>`;
      const kT = seg(t, T.toilet - 0.2, T.toilet + 0.4);
      if (kT > 0) s += rect(tx - 40, ty - 170 - 900 * kT, 80, 900 * kT, '#5ab0f0', 40, 'opacity="0.9"') + circ(tx, ty - 170 - 900 * kT, 90, '#5ab0f0', 'opacity="0.85"');
      s += stamp(540, 820, 'PIPES: GONE', seg(t, T.gone2 - 0.05, T.gone2 + 0.2), '#ff2a3a', -6, 80);
      s += chip(380, 1520, "DON'T ASK.", pop(seg(t, T.ask - 0.15, T.ask + 0.05)), { size: 54, col: '#fff', bg: '#1d222c' });
      s += speedLines(t, { a: 0.25 * (1 - kP), vertical: true, seed: 6 }) + flash(t, T.gone2, 0.5) + flash(t, T.toilet, 0.5);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.gone2, T.toilet], 0.12), z1: 1, oy: 1200 }), shake(t, [T.gone2, T.water, T.toilet], 32)) + bar(t) + pill('SECOND 5');
    }],
    // 11 — plastic is back: bottle back in hand, empty
    [C[5], (t) => {
      let s = kitchen() + `<ellipse cx="560" cy="1880" rx="420" ry="60" fill="#3a9ae8" opacity="0.8"/>`;
      s += adult({ ...YOU, x: 540, y: FLOOR, s: PS, face: 'tense', pose: 'hold' });
      s += bottle(HX, HY - 60, pop(seg(t, T.back - 0.1, T.back + 0.1)), 0, 0, 1.4);
      s += stamp(540, 620, 'PLASTIC: ON', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 74);
      s += chip(540, 820, 'EMPTY.', pop(seg(t, T.empty - 0.15, T.empty + 0.05)), { size: 58, col: '#fff', bg: '#1d222c' });
      s += flash(t, C[5], 0.95);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.empty], 0.12), z1: 1, oy: 1300 }), shake(t, [C[5]], 40, 9)) + pill('PLASTIC: BACK');
    }],
    // 12 — the guy in the puddle in the dark office
    [C[6], (t) => {
      let s = vgrad('#4a6a9a', '#24344e') + rect(0, 1650, 1080, 270, '#3a4a5e') + rect(80, 420, 920, 300, '#2a4a7a', 8, 'stroke="#3a4a5a" stroke-width="10"') + glow(540, 560, 400, '#6a9ad8', 0.25);
      s += desk(820, 1500);
      s += `<ellipse cx="540" cy="1740" rx="480" ry="80" fill="#3a7ac8" opacity="0.7"/>`;
      for (let i = 0; i < 6; i++) { const y = ((t * 900 + i * 270) % 1300) + 420; s += circ(200 + i * 140, y, 10, '#6ab0f0', 'opacity="0.8"'); }
      s += g(adult({ ...CROWD[1], x: 0, y: 0, s: 1, face: t > T.mondays - 0.2 ? 'tense' : 'neutral', pose: 'up', tilt: 0 }), `translate(900 1720) rotate(-90) scale(1.45)`);
      s += chip(300, 760, 'ALIVE.', pop(seg(t, T.alive - 0.15, T.alive + 0.05)), { size: 52, col: '#fff', bg: '#2fae6a' });
      s += chip(620, 930, 'DONE WITH MONDAYS.', pop(seg(t, T.mondays - 0.15, T.mondays + 0.05)), { size: 46, col: '#fff', bg: '#c8102e' });
      return g(cam(fin(s, 0.4), seg(t, C[6], C[7]), { z0: 1.0, z1: 1.1, ox: 460, oy: 1500 }), shake(t, [T.mondays], 18)) + pill('MONDAY · 9:01');
    }],
    // 13 — CTA
    [C[7], (t) => {
      const opts = ['METAL?', 'WATER?', 'WI-FI?', 'SOUND?', 'PAPER?', 'COLOR?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'VANISHES', 1, { size: 170, col: '#ffcf6a' }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 130, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
