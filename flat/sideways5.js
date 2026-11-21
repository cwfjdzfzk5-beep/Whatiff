// "What if gravity turned sideways for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { vgrad, grade, t2, runShots } from './lib2.js';
import { pop, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
// small faceless figure (origin ~ hips, head centre at y - 40*s)
const fig = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : `<path d="M-18,0 L-30,40 M18,0 L30,40" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
// fat arrow pointing along +x, rotated by rot degrees
const arrow = (x, y, len, rot = 0, col = '#ffffff', w = 70, a = 1) => g(`<path d="M${-len / 2},${-w / 2} L${len / 2 - w},${-w / 2} L${len / 2 - w},${-w} L${len / 2 + w * 0.4},0 L${len / 2 - w},${w} L${len / 2 - w},${w / 2} L${-len / 2},${w / 2}Z" fill="${col}" stroke="#0b0d12" stroke-width="8" stroke-linejoin="round"/>`, `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)})`, `opacity="${a}"`);
const carBody = (x, by, col, s = 1, rot = 0) => g(rect(-230, -110, 460, 110, col, 34) + `<path d="M-150,-110 L-90,-200 L110,-200 L170,-110Z" fill="${col}"/>` + `<path d="M-130,-116 L-82,-186 L0,-186 L0,-116Z M14,-116 L14,-186 L100,-186 L150,-116Z" fill="#1a2230"/>` + rect(205, -90, 26, 22, '#ffe9a8', 6) + rect(-228, -88, 22, 20, '#ff3b3b', 6) + circ(-140, 0, 52, '#141618') + circ(-140, 0, 26, '#b8c0cc') + circ(140, 0, 52, '#141618') + circ(140, 0, 26, '#b8c0cc'), `translate(${x.toFixed(0)} ${by.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const TET = ['#c8102e', '#ffcf3a', '#2f6fd6', '#2fae6a', '#a64ad6', '#ff7a1a', '#20c0d0'];
// street backdrop scrolling left by off px
const street = (off, skyTop = '#3a90ec') => {
  let s = vgrad(skyTop, '#d8ecfc', 0, 1300);
  const r = rng(11); const BW = 260; const n = 8;
  for (let i = 0; i < n; i++) { const h = 500 + r() * 500, col = ['#e8d8b8', '#c8a07a', '#a8b8c8', '#e0b0a0', '#b8c8a8'][i % 5]; const x = ((i * BW - off) % (n * BW) + n * BW) % (n * BW) - BW;
    s += rect(x, 1400 - h, BW - 20, h, col, 6); for (let wy = 1400 - h + 50; wy < 1340; wy += 110) for (let wx = 30; wx < BW - 60; wx += 70) s += rect(x + wx, wy, 40, 60, '#5a7a9a', 4); }
  s += rect(0, 1400, 1080, 520, '#9a9ea6') + rect(0, 1400, 1080, 30, '#c8ccd4');
  for (let i = 0; i < 6; i++) { const x = ((i * 240 - off * 1.3) % 1440 + 1440) % 1440 - 200; s += rect(x, 1700, 140, 16, '#f4f4f4', 6); }
  return s;
};

export async function init() {
  const W = await (await fetch('/work/sideways5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), gravity0: wt('gravity', 0), sideways0: wt('sideways', 0), five0: wt('five', 0), falling: wt('falling', 0), street: wt('street', 0),
    slides: wt('slides', 2), road: wt('road', 2), wall2: wt('wall', 2), stacked: wt('stacked', 2), tetris: wt('tetris', 2),
    office: wt('office', 4), desks: wt('desks', 4), chairs: wt('chairs', 4), printers: wt('printers', 4), boss: wt('boss', 4), giant: wt('giant', 4), pile: wt('pile', 4), corner: wt('corner', 4),
    pool6: wt('pool', 6), pours: wt('pours', 6), sideways6: wt('sideways', 6), wall6: wt('wall', 6), water6: wt('water', 6), right: wt('right', 6), neighborhood: wt('neighborhood', 6),
    sky: wt('skyscrapers', 8), diving: wt('diving', 8), boards: wt('boards', 8), creaking: wt('creaking', 8),
    you10: wt('you', 10), four: wt('four', 10), feet: wt('feet', 10), far: wt('far', 10), fall10: wt('fall', 10), seconds10: wt('seconds', 10), hell: wt('hell', 10), commute: wt('commute', 10),
    back: wt('back', 11), drops: wt('drops', 11), cars11: wt('cars', 11), land11: wt('land', 11), cars11b: wt('cars', 11, 1), pool11: wt('pool', 11), lands: wt('lands', 11), everyone: wt('everyone', 11),
    land12: wt('land', 12), dumpster: wt('dumpster', 12), mattress: wt('mattress', 12), store: wt('store', 12), alive: wt('alive', 12), smelling: wt('smelling', 12), cardboard: wt('cardboard', 12),
    next: wt('next', 13), comments: wt('comments', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  // countdown card: arrows streaming right + giant number
  const card = (n) => (t) => {
    const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.25, seed: n, n: 30 });
    for (let i = 0; i < 4; i++) { const x = ((t - t0) * 2600 + i * 360) % 1440 - 180; s += arrow(x, 1560 + (i % 2) * 180, 260, 0, '#ffd0d6', 60, 0.85); }
    s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208', rot: -8 }) + t2(540, 1360, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 });
    s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 34)) + bar(t);
  };
  // "you" falling sideways (body horizontal, head leading right)
  const youFall = (x, y, s, t) => fig(x, y, s, '#3c4350', 90 + Math.sin(t * 13) * 14, true);

  const shots = [
    // 0 hook: gravity flips sideways, you fall down the street
    [0, (t) => {
      const tv = T.sideways0 - 0.05, d = Math.max(0, t - tv);
      const off = d < 1 ? 1300 * d * d : 1300 + 2600 * (d - 1); // camera follows you
      let s = street(off);
      // loose stuff on the street flying right
      if (t > tv) { s += debris(t, tv, 300, 1500, { n: 18, col: '#ffcf3a', spread: 300, seed: 4, size: 26 }); s += speedLines(t, { a: 0.45, seed: 2, n: 34, dir: -1 }); }
      const yx = t < tv ? 540 : 540 + Math.sin(t * 9) * 20;
      s += t < tv ? fig(540, 1560, 3.6, '#3c4350', 0, false) : youFall(yx, 1560, 3.6, t);
      s += arrow(540, 820, 520, lerp(90, 0, pop(seg(t, T.gravity0, tv + 0.1))), '#ffcf3a', 90, pop(seg(t, T.gravity0 - 0.1, T.gravity0)) * (1 - seg(t, T.five0 - 0.15, T.five0)));
      s += hit(540, 560, 'BAD NEWS.', pop(seg(t, T.news - 0.25, T.news)) * (1 - seg(t, T.gravity0 - 0.1, T.gravity0)), '#ff2a3a', -6, 150);
      s += stamp(540, 560, 'GRAVITY', seg(t, T.gravity0, T.gravity0 + 0.12) * (1 - seg(t, tv - 0.1, tv)), '#ffffff', -4, 100);
      s += stamp(540, 560, 'SIDEWAYS.', seg(t, tv, tv + 0.1) * (1 - seg(t, T.five0 - 0.1, T.five0)), '#ff2a3a', -6, 130);
      s += hit(540, 600, '5 SECONDS', pop(seg(t, T.five0 - 0.1, T.five0 + 0.1)) * (1 - seg(t, T.falling - 0.15, T.falling)), '#ff2a3a', -4, 140);
      s += hit(540, 600, 'YOU: FALLING', pop(seg(t, T.falling - 0.1, T.falling + 0.05)), '#ffcf3a', 4, 120);
      s += flash(t, 0, 0.6) + flash(t, tv, 0.95) + flash(t, T.five0 - 0.1, 0.5, '#ff2a3a', 0.2) + flash(t, T.falling, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [0.05, T.news, T.gravity0, tv, T.five0, T.falling], 0.12), z1: 1, oy: 1100 }), shake(t, [0.05, T.news, tv, tv + 0.2, T.five0, T.falling], 34)) + pill('GRAVITY: SIDEWAYS');
    }],
    [N[0], card(1)],
    // 2 highway: every car slides off the road into the same wall, stacked like tetris
    [C[0], (t) => {
      const ts = T.slides - 0.05; let s = vgrad('#3a90ec', '#d8ecfc', 0, 1250) + rect(0, 1100, 1080, 820, '#4a4e56');
      for (let i = 0; i < 3; i++) s += rect(0, 1440 + i * 200, 1080, 12, '#f4f4f4', 0, 'opacity="0.7"');
      s += rect(930, 820, 150, 1100, '#b8b0a0') + [...Array(10)].map((_, i) => rect(930, 830 + i * 110, 150, 6, '#8a8478')).join('');
      const lanes = [1360, 1560, 1760, 1160];
      let imp = [];
      for (let l = 0; l < 4; l++) for (let j = 0; j < 3; j++) {
        const s0 = 0.55, wC = 460 * s0, xf = 930 - wC / 2 - 6 - j * (wC - 10), x0 = 150 + j * 330 - l * 60 - 200;
        const tI = ts + 0.32 + j * 0.16 + l * 0.12; imp.push(tI);
        const k = clamp((t - ts) / (tI - ts)), x = t < ts ? x0 + Math.sin(t * 20 + l) * 2 : lerp(x0, xf, k * k);
        const rot = t > tI ? -6 * Math.exp(-(t - tI) * 5) * Math.sin((t - tI) * 30) + (j % 2 ? -3 : 3) : 0;
        s += carBody(x, lanes[l], TET[(l * 3 + j) % 7], s0, rot);
        if (t > tI) s += debris(t, tI, xf + wC / 2, lanes[l] - 60, { n: 8, col: '#d8dce4', spread: 500, seed: l * 10 + j, size: 14 });
      }
      if (t > ts) s += speedLines(t, { a: 0.3, seed: 4, dir: 1 });
      s += chip(540, 600, 'EVERY CAR', pop(seg(t, C[0], C[0] + 0.12)) * (1 - seg(t, ts - 0.1, ts)), { size: 60, col: '#fff', bg: '#141a22' });
      s += hit(540, 620, 'SLIDE!', pop(seg(t, ts, ts + 0.1)) * (1 - seg(t, T.wall2 - 0.1, T.wall2)), '#ffcf3a', -6, 230);
      s += stamp(540, 620, 'SAME WALL.', seg(t, T.wall2 - 0.05, T.wall2 + 0.08) * (1 - seg(t, T.stacked - 0.1, T.stacked)), '#ff2a3a', -6, 110);
      s += hit(540, 620, 'TETRIS.', pop(seg(t, T.stacked - 0.05, T.stacked + 0.1)), '#2fae6a', 5, 200);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, imp[0], 0.7, '#fff4c0') + flash(t, T.stacked, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [ts, imp[0], imp[5], T.wall2, T.stacked], 0.1), z1: 1.03, oy: 1300 }), shake(t, [imp[0], imp[3], imp[6], imp[9], T.wall2, T.stacked], 30)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 office: desks, chairs, printers, boss -> one giant pile in the corner
    [C[1], (t) => {
      const FL = 1800, WX = 1010; let s = vgrad('#f4f6fa', '#dfe6f0', 0, FL) + rect(0, FL, 1080, 120, '#8a94a4') + rect(WX, 0, 70, 1920, '#c8ccd4');
      s += rect(80, 480, 380, 280, '#9ac0d8', 8) + rect(96, 496, 348, 248, '#cfe6fb', 4) + rect(540, 480, 380, 280, '#9ac0d8', 8) + rect(556, 496, 348, 248, '#cfe6fb', 4);
      const items = [ // [x0, y, kind, startWord, xf, rotEnd]
        [180, 1660, 'desk', T.desks, WX - 170, -12], [520, 1680, 'desk', T.desks + 0.1, WX - 330, 8], [300, 1440, 'chair', T.chairs, WX - 90, 20], [120, 1500, 'chair', T.chairs + 0.08, WX - 220, -25],
        [620, 1460, 'printer', T.printers, WX - 110, 14], [250, 1360, 'printer', T.printers + 0.1, WX - 260, -10], [420, 1560, 'boss', T.boss - 0.05, WX - 380, 80],
      ];
      const imps = [];
      for (const [x0, y, kind, tw, xf, re] of items) {
        const t0 = tw - 0.05, tI = t0 + 0.35; imps.push(tI); const k = clamp((t - t0) / (tI - t0)), x = lerp(x0, xf, k * k), rot = k * re + (t > tI ? Math.sin((t - tI) * 28) * 6 * Math.exp(-(t - tI) * 4) : 0);
        let o = '';
        if (kind === 'desk') o = rect(-150, -40, 300, 30, '#c8a070', 6) + rect(-140, -10, 20, 140, '#8a6a4a') + rect(120, -10, 20, 140, '#8a6a4a') + rect(-60, -140, 90, 90, '#1a1c22', 8) + rect(-20, -50, 12, 14, '#1a1c22');
        if (kind === 'chair') o = rect(-60, -10, 120, 24, '#1a1c22', 10) + rect(-50, -130, 100, 120, '#2a2e36', 16) + rect(-6, 14, 12, 80, '#2a2e36') + rect(-60, 90, 120, 14, '#2a2e36', 6);
        if (kind === 'printer') o = rect(-90, -70, 180, 120, '#e8eaee', 14, 'stroke="#9aa0aa" stroke-width="5"') + rect(-60, -90, 120, 26, '#f8f8f8', 4) + rect(-70, 0, 140, 16, '#3a3f4a', 4) + circ(60, -40, 9, '#2fae6a');
        if (kind === 'boss') o = fig(0, 0, 3, '#2a2e36', 0, k > 0.1) + `<path d="M0,-90 l-10,90 l10,20 l10,-20Z" fill="#c8102e"/>`;
        s += g(o, `translate(${x.toFixed(0)} ${y}) rotate(${rot.toFixed(1)})`);
        if (t > tI) s += debris(t, tI, WX - 10, y - 40, { n: 8, col: kind === 'printer' ? '#ffffff' : '#c8a070', spread: 500, seed: Math.round(x0), size: 18 });
      }
      // paper storm flying right
      if (t > T.desks - 0.1) { const r = rng(7); for (let i = 0; i < 24; i++) { const x = ((t - T.desks) * (900 + r() * 900) + r() * 1000) % 1100, y = 600 + r() * 1100; s += rect(x, y, 60, 44, '#ffffff', 2, `transform="rotate(${(t * 300 * (r() - 0.5)).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" opacity="0.9"`); } }
      s += chip(540, 640, 'OFFICE. 9 AM.', pop(seg(t, T.office - 0.05, T.office + 0.1)) * (1 - seg(t, T.desks - 0.1, T.desks)), { size: 52, col: '#fff', bg: '#141a22' });
      s += hit(540, 640, 'DESKS!', pop(seg(t, T.desks, T.desks + 0.08)) * (1 - seg(t, T.chairs - 0.05, T.chairs)), '#ffcf3a', -6, 170);
      s += hit(540, 640, 'CHAIRS!', pop(seg(t, T.chairs, T.chairs + 0.08)) * (1 - seg(t, T.printers - 0.05, T.printers)), '#ff7a1a', 5, 170);
      s += hit(540, 640, 'PRINTERS!', pop(seg(t, T.printers, T.printers + 0.08)) * (1 - seg(t, T.boss - 0.1, T.boss)), '#2f6fd6', -5, 150);
      s += stamp(540, 640, 'THE BOSS', seg(t, T.boss - 0.05, T.boss + 0.08) * (1 - seg(t, T.giant - 0.1, T.giant)), '#ff2a3a', 5, 110);
      s += hit(540, 640, 'ONE BIG PILE', pop(seg(t, T.giant - 0.05, T.giant + 0.1)), '#ff2a3a', -4, 120);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, imps[0], 0.6) + flash(t, imps[6], 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [T.desks, T.chairs, T.printers, T.boss, T.pile], 0.1), z1: 1.03, oy: 1300 }), shake(t, imps.concat([T.pile]), 26)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 pool pours out sideways: wall of water through the neighborhood
    [C[2], (t) => {
      const tp = T.pours - 0.05, GY = 1450; let s = vgrad('#3a90ec', '#cfe6fb', 0, GY) + rect(0, GY, 1080, 470, '#5a4a3a') + rect(0, GY, 1080, 40, '#4caf50');
      // houses to the right
      const wf = t < tp ? 0 : 520 + 1500 * (t - tp) * (t - tp) + 600 * (t - tp); // wave front x
      const H = [[620, '#e0b0a0'], [900, '#e8d8b8']];
      for (const [hx, col] of H) { const smash = wf > hx - 40; const kk = smash ? clamp((wf - hx + 40) / 300) : 0;
        if (!smash || kk < 1) s += g(rect(-120, -260, 240, 260, col, 6) + `<path d="M-150,-260 L0,-400 L150,-260Z" fill="#a64a3a"/>` + rect(-80, -200, 60, 70, '#5a7a9a', 4) + rect(20, -200, 60, 70, '#5a7a9a', 4) + rect(-30, -110, 60, 110, '#6a4a2a', 4), `translate(${(hx + kk * 200).toFixed(0)} ${GY}) rotate(${(kk * 40).toFixed(0)} 0 0)`, `opacity="${(1 - kk).toFixed(2)}"`);
        if (smash) s += debris(t, tp + 0.15 + (hx - 620) / 1600, hx, GY - 200, { n: 20, col, spread: 900, seed: hx, size: 30 }); }
      // pool basin (left)
      s += rect(60, GY, 440, 300, '#d8e4ec', 8) + rect(80, GY, 400, 280, '#2fa8e0');
      const k = pop(seg(t, tp, tp + 0.35));
      if (t < tp) s += rect(80, GY + 10, 400, 270, '#2fa8e0') + rect(80, GY + 10, 400, 14, '#bfe8ff');
      else {
        s += rect(80, GY, 400 * (1 - k * 0.9), 280, '#d8e4ec');
        // the wall of water
        const top = lerp(GY, 520, k);
        s += `<path d="M${lerp(80, 300, k)},${GY + 280} L${lerp(80, 300, k)},${top + 120} Q${(wf - 60).toFixed(0)},${(top - 40).toFixed(0)} ${wf.toFixed(0)},${(top + 140).toFixed(0)} L${(wf + 40).toFixed(0)},${GY + 40} L${wf.toFixed(0)},1920 L80,1920Z" fill="#2fa8e0" opacity="0.92"/>`;
        for (let i = 0; i < 10; i++) s += circ(wf - 20 + Math.sin(t * 20 + i) * 20, top + 120 + i * 90, 40 + (i % 3) * 14, '#e8f8ff', 'opacity="0.9"');
        s += speedLines(t, { a: 0.3, seed: 6, dir: 1, col: '#e8f8ff' });
      }
      s += chip(540, 600, 'EVERY POOL', pop(seg(t, T.pool6 - 0.15, T.pool6)) * (1 - seg(t, tp - 0.1, tp)), { size: 60, col: '#fff', bg: '#2f6fd6' });
      s += hit(540, 600, 'SPLOOSH!', pop(seg(t, tp, tp + 0.1)) * (1 - seg(t, T.wall6 - 0.15, T.wall6)), '#2f6fd6', -6, 200);
      s += stamp(540, 600, 'WALL OF WATER', seg(t, T.wall6 - 0.05, T.wall6 + 0.1) * (1 - seg(t, T.right - 0.1, T.right)), '#ffffff', -5, 90);
      s += hit(540, 600, 'NEIGHBORHOOD: GONE', pop(seg(t, T.right - 0.05, T.right + 0.1)), '#ff2a3a', 4, 80);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, tp, 0.7, '#d8f4ff') + flash(t, T.wall6, 0.4, '#d8f4ff');
      const hits = [tp, T.wall6, tp + 0.15 + 0, tp + 0.35, T.right];
      return g(cam(fin(s), 0, { z0: punch(t, hits, 0.1), z1: 1.03, oy: 1300 }), shake(t, hits, 34)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 skyscrapers bend into diving boards, creaking
    [C[3], (t) => {
      const GY = 1800, tb = T.sky - 0.05; let s = vgrad('#ff9a5a', '#ffe0b0', 0, GY) + rect(0, GY, 1080, 120, '#4a4e56');
      const B = [[60, 200, 1150, '#4a6a8a'], [300, 220, 1350, '#3a5070'], [560, 200, 1050, '#5a7a9a'], [800, 220, 1250, '#3a4a60']];
      const kb = pop(seg(t, tb, T.diving + 0.2));
      for (const [i, [x, w, h, col]] of B.entries()) {
        const dx = (h * 0.55 + i * 40) * kb + Math.sin(t * 11 + i) * 26 * kb, dy = h * 0.25 * kb, top = GY - h + dy;
        s += `<path d="M${x},${GY} Q${x},${GY - h * 0.6} ${(x + dx).toFixed(0)},${top.toFixed(0)} L${(x + w + dx).toFixed(0)},${(top + 40 * kb).toFixed(0)} Q${x + w},${GY - h * 0.55} ${x + w},${GY}Z" fill="${col}" stroke="#1a2230" stroke-width="6"/>`;
        for (let f = 1; f < 9; f++) { const u = f / 9, px = x + dx * u * u, py = lerp(GY, top, u); s += rect(px + 30, py - 14, w - 60, 18, '#ffe9a8', 4, 'opacity="0.7"'); }
      }
      if (t > T.creaking - 0.1) { for (const [x, , h] of B) s += crack(t, T.creaking - 0.05, x + 40, GY - h * 0.35, Math.round(x), '#ffffff'); }
      s += hit(540, 560, 'SKYSCRAPERS', pop(seg(t, T.sky - 0.1, T.sky + 0.08)) * (1 - seg(t, T.diving - 0.15, T.diving)), '#ffffff', -4, 110);
      s += stamp(540, 560, 'DIVING BOARDS', seg(t, T.diving - 0.05, T.diving + 0.1) * (1 - seg(t, T.creaking - 0.1, T.creaking)), '#2f6fd6', -6, 90);
      s += hit(540, 580, 'CREEEAK', pop(seg(t, T.creaking - 0.05, T.creaking + 0.1)), '#ff2a3a', 5, 190);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, tb, 0.6) + flash(t, T.creaking, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [tb, T.diving, T.boards, T.creaking], 0.1), z1: 1.03, oy: 1300 }), shake(t, [tb, T.diving, T.creaking, T.creaking + 0.25], 32)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 you: 400 ft in five seconds
    [C[4], (t) => {
      const off = 2600 * (t - C[4]) + 900; let s = street(off, '#2f80dc');
      s += speedLines(t, { a: 0.55, seed: 9, n: 40, dir: -1 });
      s += youFall(540 + Math.sin(t * 7) * 30, 1560, 3.8, t);
      const ft = Math.round(lerp(0, 400, pop(seg(t, T.four - 0.1, T.feet + 0.2))));
      s += g(rect(-300, -110, 600, 200, '#141a22', 30) + t2(0, 50, `${ft} FT`, 150, '#ffcf3a', { weight: 900 }), 'translate(540 640)', `opacity="${pop(seg(t, T.four - 0.15, T.four)) * (1 - seg(t, T.hell - 0.1, T.hell))}"`);
      s += chip(540, 830, '5 SECONDS OF FREE FALL', pop(seg(t, T.far - 0.1, T.far + 0.05)) * (1 - seg(t, T.hell - 0.1, T.hell)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(540, 640, 'AND YOU?', pop(seg(t, C[4], C[4] + 0.12)) * (1 - seg(t, T.four - 0.15, T.four)), { size: 64, col: '#fff', bg: '#141a22' });
      s += stamp(540, 640, 'HELL OF A COMMUTE', seg(t, T.hell - 0.05, T.hell + 0.1), '#ff2a3a', -5, 76);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, T.feet, 0.6) + flash(t, T.hell, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.you10, T.four, T.feet, T.fall10, T.hell], 0.12), z1: 1.03, oy: 1300 }), shake(t, [T.feet, T.hell, T.commute], 30)) + bar(t) + pill('SECOND 5');
    }],
    // 11a gravity is back: arrow swings down, everything drops
    [C[5], (t) => {
      let s = vgrad('#2fae6a', '#0c5a30') + speedLines(t, { a: 0.25, seed: 15, vertical: true, dir: 1 });
      const ka = pop(seg(t, C[5] + 0.1, T.back + 0.1));
      s += arrow(540, 1450, 560, lerp(0, 90, ka), '#e8fff0', 100);
      if (t > T.drops - 0.1) { s += debris(t, T.drops - 0.1, 300, 700, { n: 24, col: '#ffcf3a', spread: 300, seed: 3, size: 40 }) + debris(t, T.drops - 0.05, 780, 650, { n: 24, col: '#ffffff', spread: 300, seed: 5, size: 34 }); }
      s += stamp(540, 640, 'GRAVITY: BACK', seg(t, C[5], C[5] + 0.15) * (1 - seg(t, T.drops - 0.15, T.drops)), '#ffffff', -6, 92);
      s += hit(540, 660, 'DROP!', pop(seg(t, T.drops - 0.05, T.drops + 0.1)), '#ffcf3a', -4, 260);
      s += flash(t, C[5], 0.9, '#c8ffd8') + flash(t, T.drops, 0.5);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.back, T.drops], 0.1), z1: 1.03, oy: 1300 }), shake(t, [C[5], T.back + 0.1, T.drops], 30)) + pill('GRAVITY: BACK');
    }],
    // 11b cars land on cars
    [T.cars11 - 0.08, (t) => {
      const t0 = T.cars11 - 0.1; let s = vgrad('#3a90ec', '#d8ecfc', 0, 1300) + rect(0, 1300, 1080, 500, '#9a9ea6') + rect(0, 1300, 1080, 24, '#c8ccd4') + rect(0, 1800, 1080, 120, '#4a4e56');
      const cs = [[300, 1800, 0], [780, 1800, 0], [540, 1640, 1], [320, 1480, 2], [760, 1470, 2.6]];
      const imp = [];
      for (const [i, [x, yf, o]] of cs.entries()) { const td = t0 + o * 0.22, tI = td + 0.22; imp.push(tI);
        const y = o === 0 ? yf : (t < td ? -300 : Math.min(yf, lerp(-300, yf, ((t - td) / 0.22) ** 2)));
        const sq = t > tI && o > 0 ? 1 - 0.12 * Math.exp(-(t - tI) * 8) : 1;
        s += g(carBody(0, 0, TET[i + 1], 0.95, o > 0 ? (i % 2 ? 4 : -4) : 0), `translate(${x} ${y.toFixed(0)}) scale(1 ${sq.toFixed(3)})`);
        if (o > 0 && t > tI) s += debris(t, tI, x, yf - 40, { n: 14, col: '#d8f0ff', spread: 700, seed: 20 + i, size: 16 }); }
      s += hit(540, 620, 'CRUNCH!', pop(seg(t, imp[2], imp[2] + 0.1)), '#ff2a3a', -6, 210);
      s += flash(t, T.cars11 - 0.06, 0.5) + flash(t, imp[2], 0.8) + flash(t, imp[4], 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [imp[2], imp[3], imp[4]], 0.12), z1: 1.03, oy: 1300 }), shake(t, [imp[2], imp[3], imp[4]], 40)) + pill('CARS ON CARS');
    }],
    // 11c pool water lands on everyone
    [T.pool11 - 0.08, (t) => {
      const tl = T.lands - 0.1; let s = street(0) ;
      const people = [[200, '#c8102e'], [420, '#2f6fd6'], [640, '#ffcf3a'], [860, '#2fae6a']];
      const kw = clamp((t - (T.pool11 - 0.05)) / (tl - T.pool11 + 0.05)), wy = lerp(-600, 1300, kw * kw);
      if (t < tl + 0.05) s += rect(0, wy - 500, 1080, 520, '#2fa8e0', 40, 'opacity="0.95"') + [...Array(8)].map((_, i) => circ(70 + i * 135, wy + 10, 60, '#e8f8ff')).join('');
      for (const [x, col] of people) s += fig(x, 1640, 2.8, col, 0, true);
      if (t > tl) { s += rect(0, 1560, 1080, 360, '#2fa8e0', 0, `opacity="${(0.8 - 0.4 * seg(t, tl, tl + 1)).toFixed(2)}"`); s += debris(t, tl, 540, 1500, { n: 40, col: '#bfe8ff', spread: 1400, seed: 33, size: 26 });
        for (const [x] of people) for (let j = 0; j < 3; j++) s += circ(x - 30 + j * 30, 1560 + ((t * 300 + j * 40) % 140), 9, '#bfe8ff'); }
      s += chip(540, 600, 'POOL WATER', pop(seg(t, T.pool11 - 0.08, T.pool11 + 0.05)) * (1 - seg(t, tl - 0.1, tl)), { size: 60, col: '#fff', bg: '#2f6fd6' });
      s += hit(540, 620, 'SPLASH!', pop(seg(t, tl, tl + 0.1)) * (1 - seg(t, T.everyone - 0.1, T.everyone)), '#2f6fd6', 6, 220);
      s += stamp(540, 620, 'EVERYONE: SOAKED', seg(t, T.everyone - 0.05, T.everyone + 0.1), '#ffffff', -5, 76);
      s += flash(t, T.pool11 - 0.06, 0.5) + flash(t, tl, 0.9, '#d8f4ff');
      return g(cam(fin(s), 0, { z0: punch(t, [tl, T.everyone], 0.12), z1: 1.03, oy: 1300 }), shake(t, [tl, tl + 0.15, T.everyone], 36)) + pill('SPLASH');
    }],
    // 12 you land in a dumpster behind a mattress store. alive.
    [C[6], (t) => {
      const tl = T.dumpster - 0.15; let s = vgrad('#3a90ec', '#cfe6fb', 0, 1500) + rect(0, 300, 1080, 1400, '#c8a07a') + rect(0, 1700, 1080, 220, '#7a7e86');
      s += rect(140, 380, 800, 150, '#2f6fd6', 16) + t2(540, 485, 'MATTRESS STORE', 70, '#ffffff', { weight: 900, ls: 4 });
      s += rect(620, 1300, 220, 400, '#6a4a2a', 6) + rect(160, 1250, 300, 180, '#5a7a9a', 6);
      // dumpster with mattresses
      const sq = t > tl ? 1 - 0.15 * Math.exp(-(t - tl) * 6) * Math.abs(Math.sin((t - tl) * 18)) : 1;
      s += g(rect(-270, -330, 540, 70, '#f4f4fa', 20) + rect(-250, -390, 500, 70, '#e8e0f4', 20), `translate(540 1720) scale(1 ${sq.toFixed(3)})`);
      const kf = clamp((t - C[6]) / (tl - C[6])), y = t < tl ? lerp(-200, 1450, kf * kf) : 1455 + Math.sin(t * 6) * 6;
      if (t < tl) s += speedLines(t, { a: 0.4, vertical: true, dir: 1, seed: 8 }) + fig(540, y, 3.2, '#3c4350', Math.sin(t * 15) * 20, true);
      else s += fig(540, y, 3.2, '#3c4350', 0, true);
      s += g(rect(-300, -260, 600, 260, '#2fae6a', 12) + rect(-320, -280, 640, 40, '#1f7a4a', 8) + t2(0, -110, 'DUMPSTER', 52, '#0c3a20', { weight: 900, ls: 4 }), `translate(540 1720) scale(1 ${sq.toFixed(3)})`);
      if (t > tl) s += debris(t, tl, 540, 1330, { n: 26, col: '#c8a070', spread: 900, seed: 41, size: 26 });
      s += hit(540, 760, 'FLUMP.', pop(seg(t, tl, tl + 0.1)) * (1 - seg(t, T.alive - 0.1, T.alive)), '#ffcf3a', -6, 200);
      s += stamp(540, 760, 'ALIVE.', seg(t, T.alive - 0.05, T.alive + 0.1) * (1 - seg(t, T.smelling - 0.1, T.smelling)), '#2fae6a', -6, 170);
      s += chip(540, 760, 'SMELLS LIKE CARDBOARD', pop(seg(t, T.smelling - 0.05, T.smelling + 0.1)), { size: 48, col: '#fff', bg: '#141a22' });
      s += flash(t, C[6], 0.6) + flash(t, tl, 0.8) + flash(t, T.alive, 0.5, '#c8ffd8');
      return g(cam(fin(s), 0, { z0: punch(t, [tl, T.alive, T.cardboard], 0.12), z1: 1.03, oy: 1300 }), shake(t, [tl, tl + 0.12, T.alive], 36)) + pill('ALIVE');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['UP?', 'LEFT?', 'BACKWARDS?', 'TO THE MOON?', 'INTO YOUR FRIDGE?', 'NOWHERE?'];
      const i = Math.floor((t - C[7]) * 4) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += arrow(540, 1480, 340, (t - C[7]) * 220, '#ffd0d6', 80, 0.9);
      s += bigText(540, 500, 'WHICH WAY', 1, { size: 140 }) + bigText(540, 690, 'NEXT?', 1, { size: 200, col: '#ffcf6a' });
      s += bigText(540, 1720, opts[i], 1, { size: 90, col: '#ffffff', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.comments, T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
