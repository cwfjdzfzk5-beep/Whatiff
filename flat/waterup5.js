// "What if water fell UP for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { vgrad, grade, t2, runShots } from './lib2.js';
import { pop, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
// small faceless figure (origin ~ hips, head centre at y - 40*s)
const fig = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : `<path d="M-18,0 L-30,40 M18,0 L30,40" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
const arrow = (x, y, len, rot = 0, col = '#ffffff', w = 70, a = 1) => g(`<path d="M${-len / 2},${-w / 2} L${len / 2 - w},${-w / 2} L${len / 2 - w},${-w} L${len / 2 + w * 0.4},0 L${len / 2 - w},${w} L${len / 2 - w},${w / 2} L${-len / 2},${w / 2}Z" fill="${col}" stroke="#0b0d12" stroke-width="8" stroke-linejoin="round"/>`, `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)})`, `opacity="${a}"`);
const WATER = '#2fa8e0', FOAM = '#e8f8ff';
// wobbly water blob (rounded rect with highlights + rising bubbles)
const blob = (x, y, w, h, t, seed = 1) => {
  const r = rng(seed); let s = rect(x - w / 2, y - h / 2, w, h, WATER, Math.min(w, h) * 0.42, 'opacity="0.93"');
  s += rect(x - w / 2 + 30, y - h / 2 + 24, w * 0.5, 22, FOAM, 11, 'opacity="0.7"');
  for (let i = 0; i < 9; i++) { const bx = x - w / 2 + 40 + r() * (w - 80), by = y + h / 2 - 30 - (((t * 260 + r() * 400) % Math.max(60, h - 60))); s += circ(bx, by, 6 + r() * 8, FOAM, 'opacity="0.75"'); }
  return s;
};
// rising droplets (water falling UP) in a box
const upDrops = (t, x0, x1, y0, y1, { n = 40, seed = 3, col = FOAM, sp = 1600, a = 0.85 } = {}) => {
  const r = rng(seed); let s = ''; const H = y1 - y0;
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y1 - ((r() * H + t * sp * (0.6 + 0.6 * r())) % H), len = 30 + r() * 50; s += rect(x, y - len, 8, len, col, 4, `opacity="${a}"`); }
  return s;
};
const ship = (x, y, s, rot = 0, col = '#c8102e') => g(`<path d="M-260,-60 L260,-60 L200,40 L-210,40Z" fill="${col}" stroke="#1a1c22" stroke-width="8"/>` + rect(-260, -66, 520, 18, '#f4f4f4') + rect(-150, -190, 220, 130, '#f4f4f4', 10, 'stroke="#1a1c22" stroke-width="6"') + [...Array(4)].map((_, i) => rect(-130 + i * 50, -160, 30, 30, '#2a3a50', 4)).join('') + rect(100, -230, 50, 170, '#ffcf3a', 6, 'stroke="#1a1c22" stroke-width="6"') + [...Array(5)].map((_, i) => rect(-40 + i * 50 - 200 + 260, -120, 44, 56, ['#2f6fd6', '#2fae6a', '#ff7a1a', '#ffcf3a', '#a64ad6'][i], 4)).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const cloud = (x, y, s, a = 1) => g(circ(-80, 10, 70, '#ffffff') + circ(0, -20, 95, '#ffffff') + circ(90, 10, 72, '#ffffff') + rect(-150, 10, 300, 70, '#ffffff', 35), `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s})`, `opacity="${a}"`);
const goldfish = (x, y, s, rot = 0) => g(`<path d="M60,0 L130,-60 L120,0 L130,60Z" fill="#ff7a1a" stroke="#8a3a0a" stroke-width="5"/>` + `<ellipse cx="0" cy="0" rx="90" ry="58" fill="#ff8a2a" stroke="#8a3a0a" stroke-width="5"/>` + `<path d="M-10,-55 Q10,-95 40,-50Z" fill="#ff7a1a"/>` + circ(-45, -12, 18, '#ffffff') + circ(-49, -12, 9, '#141618'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const phone = (x, y, s, wet = 0) => g(rect(-60, -110, 120, 220, '#141618', 18) + rect(-50, -96, 100, 184, wet > 0.5 ? '#2a2e36' : '#3a6ad6', 10) + (wet > 0.5 ? t2(0, 10, 'X', 80, '#ff3b3b', { weight: 900 }) : ''), `translate(${x} ${y}) scale(${s})`);
// backyard with pool basin; basin top at GY
const yard = (GY = 1480) => vgrad('#3a90ec', '#d8ecfc', 0, GY) + rect(80, GY - 520, 360, 300, '#e8d8b8', 6) + `<path d="M50,${GY - 520} L260,${GY - 680} L470,${GY - 520}Z" fill="#a64a3a"/>` + rect(140, GY - 460, 80, 90, '#5a7a9a', 4) + rect(300, GY - 460, 80, 90, '#5a7a9a', 4) + rect(0, GY - 220, 1080, 220, '#4caf50') + rect(0, GY, 1080, 440, '#d8d0c0') + rect(120, GY + 20, 840, 300, '#9ac8e0', 20) + rect(140, GY + 40, 800, 260, '#7ab0d0', 14);

export async function init() {
  const W = await (await fetch('/work/waterup5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), water0: wt('water', 0), falling: wt('falling', 0), up0: wt('up', 0), five0: wt('five', 0), swimming: wt('swimming', 0), pool0: wt('pool', 0),
    lifts2: wt('lifts', 2), with2: wt('with', 2), hold: wt('hold', 2), champ: wt('champ', 2),
    coffee: wt('coffee', 4), office: wt('office', 4), shoots: wt('shoots', 4), cup: wt('cup', 4), straight: wt('straight', 4), ceiling: wt('ceiling', 4),
    rain: wt('rain', 6), up6: wt('up', 6), puddle: wt('puddle', 6), goes: wt('goes', 6), umbrellas: wt('umbrellas', 6), useless: wt('useless', 6),
    ocean8: wt('ocean', 8), lifts8: wt('lifts', 8), two: wt('two', 8), miles: wt('miles', 8), ship8: wt('ship', 8), drops: wt('drops', 8), floor: wt('floor', 8),
    tank: wt('tank', 10), empties: wt('empties', 10), sky: wt('sky', 10), goldfish: wt('goldfish', 10), clouds: wt('clouds', 10), questions: wt('questions', 10),
    back11: wt('back', 11), once: wt('once', 11), ocean11: wt('ocean', 11), slams: wt('slams', 11), ships: wt('ships', 11), pop: wt('pop', 11),
    lands: wt('lands', 12), pool12b: wt('pool', 12, 1), with12: wt('with', 12), alive: wt('alive', 12), perfect: wt('perfect', 12), ten: wt('ten', 12), phone: wt('phone', 12), lucky: wt('lucky', 12), not: wt('not', 12),
    next: wt('next', 13), comments: wt('comments', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  // countdown card: water drops racing UP + giant number
  const card = (n) => (t) => {
    const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.25, seed: n, n: 30, vertical: true, dir: -1 });
    for (let i = 0; i < 4; i++) { const y = 1920 - (((t - t0) * 2600 + i * 520) % 2400) + 200; s += arrow(160 + (i % 2) * 760, y, 260, -90, '#ffd0d6', 60, 0.85); }
    s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208', rot: -8 }) + t2(540, 1360, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 });
    s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 34)) + bar(t);
  };

  const shots = [
    // 0 hook: backyard pool, water starts falling up
    [0, (t) => {
      const GY = 1480, tu = T.up0 - 0.05, d = Math.max(0, t - tu); let s = yard(GY);
      const lift = Math.min(160, d * d * 260);
      s += rect(140, GY + 40 - lift, 800, 260, WATER, 14, 'opacity="0.95"') + rect(140, GY + 40 - lift, 800, 16, FOAM, 8);
      s += fig(540 + Math.sin(t * 3) * 10, GY + 100 - lift, 3, '#c8102e', Math.sin(t * 4) * 6, t > tu);
      if (t > tu) s += upDrops(t, 120, 960, 300, GY + 40, { n: 46, seed: 2 }) + upDrops(t, 0, 1080, 200, 1900, { n: 22, seed: 5, col: '#9ad8ff', sp: 2200, a: 0.6 });
      s += arrow(540, 820, 420, -90, '#ffcf3a', 90, pop(seg(t, T.falling - 0.1, T.up0)) * (1 - seg(t, T.five0 - 0.15, T.five0)));
      s += hit(540, 560, 'BAD NEWS.', pop(seg(t, 0, 0.12)) * (1 - seg(t, T.water0 - 0.1, T.water0)), '#ff2a3a', -6, 150);
      s += stamp(540, 560, 'WATER', seg(t, T.water0, T.water0 + 0.12) * (1 - seg(t, tu - 0.1, tu)), '#2f6fd6', -4, 120);
      s += stamp(540, 560, 'FALLS UP.', seg(t, tu, tu + 0.1) * (1 - seg(t, T.five0 - 0.1, T.five0)), '#ff2a3a', -6, 130);
      s += hit(540, 600, '5 SECONDS', pop(seg(t, T.five0 - 0.1, T.five0 + 0.1)) * (1 - seg(t, T.swimming - 0.15, T.swimming)), '#ff2a3a', -4, 140);
      s += hit(540, 600, 'YOU: IN A POOL', pop(seg(t, T.swimming - 0.1, T.swimming + 0.05)), '#ffcf3a', 4, 105);
      s += flash(t, 0, 0.6) + flash(t, tu, 0.95, '#d8f4ff') + flash(t, T.five0 - 0.1, 0.5, '#ff2a3a', 0.2) + flash(t, T.pool0, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [0.05, T.news, T.water0, tu, T.five0, T.pool0], 0.12), z1: 1, oy: 1100 }), shake(t, [0.05, T.news, tu, tu + 0.2, T.five0, T.pool0], 34)) + pill('WATER: FALLS UP');
    }],
    [N[0], card(1)],
    // 2 pool lifts off with you inside; camera follows the blob up
    [C[0], (t) => {
      const tl = T.lifts2 - 0.05, d = Math.max(0, t - tl), rise = d < 0.6 ? 1500 * d * d : 540 + 1800 * (d - 0.6);
      const GY = 1480 + rise; let s = vgrad(lerp(0, 1, clamp(d / 3)) > 0.5 ? '#2f70d0' : '#3a90ec', '#d8ecfc', 0, 1920);
      if (GY < 2400) s += g(yard(1480), `translate(0 ${rise.toFixed(0)})`);
      if (d > 0.3) { s += cloud(220, ((d * 700) % 2400) - 300, 1.1) + cloud(820, ((d * 700 + 1200) % 2400) - 300, 0.9); s += speedLines(t, { a: 0.45, seed: 4, vertical: true, dir: 1, col: '#ffffff' }); }
      const by = t < tl ? 1620 : 1560 + Math.sin(t * 6) * 10, bh = t < tl ? 260 : lerp(260, 420, pop(seg(t, tl, tl + 0.3)));
      s += blob(540, by, 820, bh, t, 7);
      s += fig(540 + Math.sin(t * 5) * 20, by + 60, 3, '#c8102e', Math.sin(t * 7) * 12, true); // head ~ by-60 > 1440
      s += upDrops(t, 120, 960, 400, by - bh / 2, { n: 24, seed: 8 });
      s += hit(540, 600, 'LIFT OFF!', pop(seg(t, tl, tl + 0.1)) * (1 - seg(t, T.with2 - 0.1, T.with2)), '#2f6fd6', -6, 190);
      s += stamp(540, 600, 'WITH YOU IN IT', seg(t, T.with2 - 0.05, T.with2 + 0.1) * (1 - seg(t, T.hold - 0.1, T.hold)), '#ff2a3a', -5, 84);
      s += hit(540, 620, 'HOLD YOUR BREATH', pop(seg(t, T.hold - 0.05, T.hold + 0.1)), '#ffcf3a', 4, 92);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, tl, 0.8, '#d8f4ff') + flash(t, T.hold, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [tl, T.with2, T.hold, T.champ], 0.1), z1: 1.03, oy: 1300 }), shake(t, [tl, tl + 0.2, T.with2, T.hold], 32)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 office: every coffee shoots out of the cup into the ceiling
    [C[1], (t) => {
      const CE = 220, DY = 1640, ts = T.shoots - 0.05; let s = vgrad('#f4f6fa', '#dfe6f0', 0, 1920) + rect(0, 0, 1080, CE, '#c8ccd4') + rect(0, CE - 14, 1080, 14, '#9aa0aa');
      s += rect(60, 420, 420, 300, '#9ac0d8', 8) + rect(76, 436, 388, 268, '#cfe6fb', 4) + rect(600, 420, 420, 300, '#9ac0d8', 8) + rect(616, 436, 388, 268, '#cfe6fb', 4);
      const X = [170, 420, 670, 920];
      for (const [i, x] of X.entries()) s += fig(x, DY - 60, 2.6, ['#2f6fd6', '#3c4350', '#2fae6a', '#a64ad6'][i], 0, t > ts + 0.1); // head ~1476
      s += rect(30, DY, 1020, 34, '#c8a070', 6) + rect(50, DY + 34, 24, 250, '#8a6a4a') + rect(1006, DY + 34, 24, 250, '#8a6a4a');
      const imps = [];
      for (const [i, x] of X.entries()) {
        const mx = x + 70, t0 = ts + i * 0.07, tI = t0 + 0.25; imps.push(tI);
        s += rect(mx - 34, DY - 80, 68, 80, '#ffffff', 10, 'stroke="#3a3f4a" stroke-width="5"') + `<path d="M${mx + 34},${DY - 64} q30,6 0,40" stroke="#3a3f4a" stroke-width="8" fill="none"/>`;
        if (t > t0) { const top = Math.max(CE, lerp(DY - 80, CE, clamp((t - t0) / 0.25)));
          s += rect(mx - 22, top, 44, DY - 80 - top, '#6a3a1a', 18, `opacity="${(1 - 0.7 * seg(t, tI + 0.4, tI + 1.4)).toFixed(2)}"`);
          if (t > tI) { const k = pop(seg(t, tI, tI + 0.3)); s += `<ellipse cx="${mx}" cy="${CE}" rx="${(40 + 90 * k).toFixed(0)}" ry="${(18 + 30 * k).toFixed(0)}" fill="#6a3a1a"/>` + debris(t, tI, mx, CE + 10, { n: 10, col: '#7a4a2a', spread: 400, seed: i + 3, size: 14 }); } }
        else s += rect(mx - 28, DY - 74, 56, 12, '#6a3a1a', 4);
      }
      if (t > ts) s += upDrops(t, 60, 1020, CE, DY - 80, { n: 20, seed: 9, col: '#8a5a3a', sp: 1400 });
      s += chip(540, 840, 'EVERY COFFEE', pop(seg(t, T.coffee - 0.1, T.coffee + 0.05)) * (1 - seg(t, ts - 0.1, ts)), { size: 60, col: '#fff', bg: '#6a3a1a' });
      s += hit(540, 840, 'WHOOSH!', pop(seg(t, ts, ts + 0.1)) * (1 - seg(t, T.straight - 0.1, T.straight)), '#ff7a1a', -6, 200);
      s += stamp(540, 840, 'CEILING.', seg(t, T.ceiling - 0.05, T.ceiling + 0.1), '#ff2a3a', -6, 130);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, imps[0], 0.6, '#fff0d8') + flash(t, T.ceiling, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [ts, imps[0], imps[3], T.ceiling], 0.1), z1: 1.03, oy: 1300 }), shake(t, imps.concat([T.ceiling]), 28)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 street: rain falls up, puddles follow, umbrellas useless
    [C[2], (t) => {
      const GY = 1720; let s = vgrad('#5a6a80', '#a8b8c8', 0, GY);
      const r = rng(11); for (let i = 0; i < 6; i++) { const h = 600 + r() * 500, x = i * 190 - 20; s += rect(x, GY - h, 170, h, ['#c8a07a', '#a8b8c8', '#e0b0a0', '#b8c8a8'][i % 4], 6); for (let wy = GY - h + 50; wy < GY - 120; wy += 120) s += rect(x + 30, wy, 40, 60, '#4a6a8a', 4) + rect(x + 100, wy, 40, 60, '#4a6a8a', 4); }
      s += rect(0, GY, 1080, 200, '#6a6e76') + rect(0, GY, 1080, 20, '#9a9ea6');
      s += upDrops(t, 0, 1080, 0, GY, { n: 70, seed: 6, col: '#cfe8ff', sp: 2600, a: 0.8 });
      const tp = T.puddle - 0.05, imps = [];
      for (const [i, x] of [180, 540, 900].entries()) { const t0 = tp + i * 0.12; imps.push(t0); const k = clamp((t - t0) / 1.2);
        if (t < t0) s += `<ellipse cx="${x}" cy="${GY + 60}" rx="140" ry="26" fill="#4a8ac0"/>`;
        else s += blob(x, lerp(GY + 40, 200, k * k), 200 - 60 * k, 70 + 40 * k, t, i + 20); }
      const tu = T.umbrellas - 0.05;
      for (const [i, x] of [300, 780].entries()) { const flip = pop(seg(t, tu + i * 0.1, tu + i * 0.1 + 0.2));
        s += fig(x, GY - 70, 2.6, ['#c8102e', '#2f6fd6'][i], 0, false); // head ~1546
        s += g(`<path d="M-150,0 Q0,${(-130 + 260 * flip).toFixed(0)} 150,0Z" fill="${['#ffcf3a', '#2fae6a'][i]}" stroke="#1a1c22" stroke-width="6"/>` + rect(-4, 0, 8, 150, '#1a1c22'), `translate(${x} ${GY - 360})`);
        if (t > tu) s += upDrops(t, x - 140, x + 140, GY - 560, GY - 340, { n: 10, seed: 30 + i, col: '#ffffff', sp: 1200 }); }
      s += hit(540, 600, 'RAIN: UP', pop(seg(t, T.rain - 0.1, T.rain + 0.05)) * (1 - seg(t, tp - 0.1, tp)), '#2f6fd6', -6, 170);
      s += stamp(540, 600, 'PUDDLES TOO', seg(t, tp, tp + 0.1) * (1 - seg(t, tu - 0.1, tu)), '#ffffff', -5, 100);
      s += hit(540, 600, 'UMBRELLAS?', pop(seg(t, tu, tu + 0.1)) * (1 - seg(t, T.useless - 0.1, T.useless)), '#ffcf3a', 4, 140);
      s += stamp(540, 600, 'USELESS.', seg(t, T.useless - 0.05, T.useless + 0.1), '#ff2a3a', -6, 140);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, tp, 0.5, '#d8f4ff') + flash(t, T.useless, 0.5);
      const hits = [T.rain, ...imps, tu, T.useless];
      return g(cam(fin(s), 0, { z0: punch(t, hits, 0.1), z1: 1.03, oy: 1300 }), shake(t, hits, 30)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 the ocean lifts off, every ship drops onto the sea floor
    [C[3], (t) => {
      const SL = 1050, SF = 1780, tl = T.lifts8 - 0.05, td = T.drops - 0.25; let s = vgrad('#3a90ec', '#d8ecfc', 0, SL) + rect(0, SL, 1080, 870, '#d8c08a');
      for (let i = 0; i < 10; i++) s += `<ellipse cx="${60 + i * 110}" cy="${SF + 20 + (i % 3) * 30}" rx="60" ry="14" fill="#b8a070"/>`;
      s += `<path d="M120,${SF} q30,-90 0,-160 M150,${SF} q-30,-80 10,-130 M900,${SF} q30,-90 0,-160" stroke="#2fae6a" stroke-width="14" fill="none"/>`;
      const d = Math.max(0, t - tl), up = d < 0.5 ? 1800 * d * d : 450 + 1600 * (d - 0.5); // ocean slab rising
      const top = SL - up; s += rect(0, top, 1080, 870, WATER, 0, 'opacity="0.95"') + rect(0, top + 850, 1080, 30, FOAM, 0, 'opacity="0.8"');
      const r = rng(5); for (let i = 0; i < 6; i++) s += goldfish(100 + r() * 880, top + 200 + r() * 600, 0.45, r() * 20 - 10);
      // ships: on the surface, then hang, then drop to the floor
      const imps = [];
      for (const [i, [x, col, sc]] of [[300, '#c8102e', 0.8], [780, '#2a3a50', 0.7]].entries()) {
        const t0 = td + i * 0.15, tI = t0 + 0.28; imps.push(tI);
        let y; if (t < tl) y = SL + 10 + Math.sin(t * 3 + i) * 8; else if (t < t0) y = SL + 10 - Math.min(80, (t - tl) * 160); else y = Math.min(SF - 20, lerp(SL - 70, SF - 20, ((t - t0) / 0.28) ** 2));
        const rot = t > tI ? (i ? 9 : -8) + Math.sin((t - tI) * 30) * 4 * Math.exp(-(t - tI) * 5) : 0;
        s += ship(x, y, sc, rot, col);
        if (t > tI) s += debris(t, tI, x, SF - 10, { n: 22, col: '#d8c08a', spread: 900, seed: 40 + i, size: 26 });
      }
      if (t > tl) s += upDrops(t, 0, 1080, 0, SL, { n: 30, seed: 12 });
      s += hit(540, 560, 'OCEAN: LIFT OFF', pop(seg(t, T.ocean8 - 0.1, T.ocean8 + 0.05)) * (1 - seg(t, T.two - 0.1, T.two)), '#ff2a3a', -5, 100);
      s += chip(540, 560, '2 MILES OF WATER', pop(seg(t, T.two - 0.05, T.two + 0.1)) * (1 - seg(t, T.ship8 - 0.1, T.ship8)), { size: 56, col: '#fff', bg: '#2f6fd6' });
      s += chip(540, 690, 'AVG OCEAN DEPTH: 2.3 MI', pop(seg(t, T.miles, T.miles + 0.1)) * (1 - seg(t, T.ship8 - 0.1, T.ship8)), { size: 34, col: '#fff', bg: '#141a22' });
      s += hit(540, 560, 'EVERY SHIP', pop(seg(t, T.ship8 - 0.05, T.ship8 + 0.08)) * (1 - seg(t, imps[0] - 0.05, imps[0])), '#ffcf3a', 4, 140);
      s += stamp(540, 560, 'SEA FLOOR.', seg(t, imps[0], imps[0] + 0.1), '#ff2a3a', -6, 120);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, tl, 0.7, '#d8f4ff') + flash(t, imps[0], 0.8, '#fff4c0') + flash(t, imps[1], 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [tl, T.two, imps[0], imps[1]], 0.12), z1: 1.03, oy: 1300 }), shake(t, [tl, tl + 0.2, imps[0], imps[1], T.floor], 40)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10a fish tank empties into the sky
    [C[4], (t) => {
      const te = T.empties - 0.05, d = Math.max(0, t - te); let s = vgrad('#3a90ec', '#d8ecfc', 0, 1500) + rect(0, 1500, 1080, 420, '#c8b8a0') + rect(0, 1500, 1080, 24, '#a89880');
      s += rect(60, 1100, 960, 30, '#e8e8ec') + [...Array(8)].map((_, i) => rect(90 + i * 125, 1130, 16, 370, '#e8e8ec')).join(''); // balcony rail
      s += rect(300, 1620, 480, 260, '#6a4a2a', 8); // stand
      s += rect(280, 1340, 520, 280, '#d8f0ff', 10, 'stroke="#3a3f4a" stroke-width="8" opacity="0.6"');
      const by = 1480 - (d < 0.5 ? 1400 * d * d : 350 + 1500 * (d - 0.5));
      if (t < te) s += rect(290, 1370, 500, 240, WATER, 6, 'opacity="0.9"') + goldfish(540, 1480, 0.8, Math.sin(t * 4) * 8);
      else s += blob(540, by, 500 - 80 * clamp(d), 240, t, 4) + goldfish(540, by, 0.8, Math.sin(t * 9) * 14);
      if (t > te) s += upDrops(t, 280, 800, 0, 1620, { n: 26, seed: 14 }) + speedLines(t, { a: 0.3, seed: 2, vertical: true, dir: -1 });
      s += chip(540, 560, 'EVERY FISH TANK', pop(seg(t, C[4], C[4] + 0.12)) * (1 - seg(t, te - 0.1, te)), { size: 60, col: '#fff', bg: '#ff7a1a' });
      s += hit(540, 560, 'YEET!', pop(seg(t, te, te + 0.1)) * (1 - seg(t, T.sky - 0.1, T.sky)), '#ff7a1a', -6, 230);
      s += stamp(540, 560, 'INTO THE SKY', seg(t, T.sky - 0.05, T.sky + 0.1), '#2f6fd6', -5, 100);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, te, 0.7, '#d8f4ff') + flash(t, T.sky, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [te, T.sky], 0.12), z1: 1.03, oy: 1300 }), shake(t, [te, te + 0.2, T.sky], 32)) + bar(t) + pill('SECOND 5');
    }],
    // 10b goldfish among the clouds, has questions
    [T.goldfish - 0.1, (t) => {
      const t0 = T.goldfish - 0.1; let s = vgrad('#2f70d0', '#bfe0ff', 0, 1920);
      for (const [i, [x, y, sc]] of [[200, 1500, 1.4], [850, 1700, 1.2], [700, 1350, 0.9], [150, 1800, 1]].entries()) s += cloud(x, y + ((t - t0) * 260) % 300 - i * 4, sc);
      s += speedLines(t, { a: 0.3, seed: 7, vertical: true, dir: 1 });
      s += blob(540, 820, 520, 380, t, 9) + goldfish(540, 820, 1.5, Math.sin(t * 6) * 6);
      const q = pop(seg(t, T.questions - 0.1, T.questions + 0.1));
      for (let i = 0; i < 3; i++) s += bigText(330 + i * 210, 560 - (i % 2) * 40, '?', pop(seg(t, T.questions - 0.1 + i * 0.12, T.questions + 0.05 + i * 0.12)), { size: 190, col: ['#ffcf3a', '#ffffff', '#ff7a1a'][i], rot: (i - 1) * 12 });
      s += chip(540, 1560, 'FIRST CLOUD EVER', pop(seg(t, T.clouds - 0.05, T.clouds + 0.1)) * (1 - q), { size: 52, col: '#fff', bg: '#141a22' });
      s += chip(540, 1560, 'IT HAS QUESTIONS', q, { size: 56, col: '#fff', bg: '#ff7a1a' });
      s += flash(t, t0, 0.5) + flash(t, T.questions, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [t0, T.clouds, T.questions], 0.12), z1: 1.05, oy: 900 }), shake(t, [t0, T.questions], 24)) + bar(t) + pill('SECOND 5');
    }],
    // 11a water is back: green card, arrow DOWN
    [C[5], (t) => {
      let s = vgrad('#2fae6a', '#0c5a30') + speedLines(t, { a: 0.3, seed: 15, vertical: true, dir: 1 });
      s += arrow(540, 1450, 560, 90, '#e8fff0', 100);
      if (t > T.once - 0.1) s += upDrops(t, 0, 1080, 0, 1920, { n: 40, seed: 3, sp: -2400 });
      s += stamp(540, 640, 'WATER: BACK', seg(t, C[5], C[5] + 0.15) * (1 - seg(t, T.once - 0.15, T.once)), '#ffffff', -6, 100);
      s += hit(540, 660, 'ALL AT ONCE', pop(seg(t, T.once - 0.1, T.once + 0.05)), '#ffcf3a', -4, 130);
      s += flash(t, C[5], 0.9, '#c8ffd8') + flash(t, T.once, 0.5);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.back11, T.once], 0.1), z1: 1.03, oy: 1300 }), shake(t, [C[5], T.back11 + 0.1, T.once], 30)) + pill('WATER: BACK');
    }],
    // 11b ocean slams down, ships pop back up
    [T.ocean11 - 0.08, (t) => {
      const SL = 1050, SF = 1780, ts = T.slams - 0.05; let s = vgrad('#3a90ec', '#d8ecfc', 0, SL) + rect(0, SL, 1080, 870, '#d8c08a');
      const k = clamp((t - (T.ocean11 - 0.08)) / (ts - T.ocean11 + 0.08)), top = t < ts ? lerp(-900, SL, k * k) : SL + Math.sin((t - ts) * 14) * 30 * Math.exp(-(t - ts) * 3);
      const tp = T.pop - 0.1;
      for (const [i, [x, col, sc]] of [[300, '#c8102e', 0.8], [780, '#2a3a50', 0.7]].entries()) {
        let y = SF - 20, rot = i ? 9 : -8;
        if (t > tp) { const kk = (t - tp - i * 0.08); y = kk < 0 ? SF - 20 : Math.max(SL + 10, SF - 20 - 2600 * kk + 1400 * kk * kk); rot = rot * Math.exp(-Math.max(0, kk) * 4); if (kk > 0.6) y = SL + 10 + Math.sin(t * 8 + i) * 12; }
        s += ship(x, y, sc, rot, col);
      }
      s += rect(0, top, 1080, 1920, WATER, 0, 'opacity="0.85"') + rect(0, top, 1080, 24, FOAM);
      if (t > ts) s += debris(t, ts, 540, SL, { n: 50, col: FOAM, spread: 1600, seed: 33, size: 34 }) + debris(t, ts + 0.05, 200, SL, { n: 24, col: '#bfe8ff', spread: 1200, seed: 34, size: 26 });
      s += hit(540, 560, 'SLAM!', pop(seg(t, ts, ts + 0.1)) * (1 - seg(t, T.ships - 0.1, T.ships)), '#2f6fd6', -6, 260);
      s += stamp(540, 560, 'SHIPS: POP!', seg(t, T.ships - 0.05, T.ships + 0.1), '#2fae6a', -5, 120);
      s += flash(t, T.ocean11 - 0.06, 0.5) + flash(t, ts, 0.9, '#d8f4ff') + flash(t, tp, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [ts, tp, tp + 0.1], 0.12), z1: 1.03, oy: 1300 }), shake(t, [ts, ts + 0.15, T.ships, tp + 0.3], 44)) + pill('SPLASH');
    }],
    // 12 your pool lands back in the pool; alive; perfect ten; phone not so lucky
    [C[6], (t) => {
      const GY = 1480, tl = T.lands - 0.02; let s = yard(GY);
      const kf = clamp((t - C[6]) / (tl - C[6])), by = t < tl ? lerp(-400, 1620, kf * kf) : 1620;
      s += t < tl ? blob(540, by, 800, 300, t, 3) : rect(140, GY + 40, 800, 260, WATER, 14, 'opacity="0.95"') + rect(140, GY + 40, 800, 16, FOAM, 8);
      if (t < tl) s += speedLines(t, { a: 0.4, vertical: true, dir: 1, seed: 8 });
      s += fig(540, t < tl ? by + 40 : 1580 + Math.sin(t * 5) * 6, 3, '#c8102e', t < tl ? Math.sin(t * 15) * 20 : 0, true);
      if (t > tl) s += debris(t, tl, 540, GY + 20, { n: 50, col: FOAM, spread: 1500, seed: 41, size: 30 }) + debris(t, tl + 0.05, 300, GY, { n: 20, col: '#9ad8ff', spread: 1000, seed: 42, size: 22 });
      // phone on the deck
      const tph = T.phone - 0.05; s += phone(850, 1700, 0.9, t > tl + 0.1 ? 1 : 0);
      if (t > tph) s += crack(t, tph, 850, 1700, 7, '#ffffff') + circ(850, 1700, 140, 'none', `stroke="#ff2a3a" stroke-width="10" opacity="${pop(seg(t, tph, tph + 0.1))}"`);
      // scorecards for perfect ten
      const kp = pop(seg(t, T.perfect - 0.05, T.perfect + 0.1)) * (1 - seg(t, tph - 0.1, tph));
      if (kp > 0) for (let i = 0; i < 3; i++) s += g(rect(-90, -80, 180, 160, '#ffffff', 10, 'stroke="#141618" stroke-width="6"') + t2(0, 45, '10', 120, '#141618', { weight: 900 }), `translate(${250 + i * 290} 840) rotate(${(i - 1) * 6}) scale(${kp})`);
      s += hit(540, 600, 'SPLASH!', pop(seg(t, tl, tl + 0.1)) * (1 - seg(t, T.alive - 0.1, T.alive)), '#2f6fd6', -6, 220);
      s += stamp(540, 600, 'ALIVE.', seg(t, T.alive - 0.05, T.alive + 0.1) * (1 - seg(t, T.perfect - 0.1, T.perfect)), '#2fae6a', -6, 170);
      s += hit(540, 600, 'PERFECT 10', kp, '#ffcf3a', 4, 140);
      s += stamp(540, 600, 'PHONE: DEAD', seg(t, tph, tph + 0.1), '#ff2a3a', -6, 110);
      s += flash(t, C[6], 0.6) + flash(t, tl, 0.9, '#d8f4ff') + flash(t, T.alive, 0.5, '#c8ffd8') + flash(t, tph, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [tl, T.alive, T.perfect, tph], 0.12), z1: 1.03, oy: 1300 }), shake(t, [tl, tl + 0.12, T.alive, T.ten, tph], 38)) + pill('ALIVE');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['FIRE?', 'SAND?', 'CARS?', 'MONEY?', 'YOUR BOSS?', 'THE MOON?'];
      const i = Math.floor((t - C[7]) * 4) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12, vertical: true, dir: -1 });
      s += arrow(540, 1480, 340, -90 + Math.sin((t - C[7]) * 8) * 10, '#ffd0d6', 80, 0.9);
      s += bigText(540, 500, 'WHAT FALLS', 1, { size: 140 }) + bigText(540, 690, 'UP NEXT?', 1, { size: 180, col: '#ffcf6a' });
      s += bigText(540, 1720, opts[i], 1, { size: 90, col: '#ffffff', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.comments, T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
