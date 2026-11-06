// "What if all wood on Earth vanished for five seconds?" — HYPE format (built on friction5.js).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, crowd, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const fin = (s, v = 0.45) => s + grade('#0b1a2e', '#2e1a0b', 0.1) + vignette(v);
const lying = (o) => g(adult({ ...o, x: 0, y: 0, s: 1 }), `translate(${o.x} ${o.y}) rotate(${o.rot || -90}) scale(${o.s})`);
const WOOD = '#a8743a', WOOD2 = '#7a4e22';
const room = (wall = ['#f4e6c8', '#e8d2a8'], floor = '#c86a4a') => vgrad(wall[0], wall[1]) + rect(0, 1560, 1080, 360, floor) + rect(0, 1560, 1080, 18, '#00000022');
// wooden chair, origin = floor centre, seat at y-250*s
const chair = (x, y, s = 1, a = 1) => a <= 0 ? '' : g(rect(-90, -262, 180, 26, WOOD, 6) + rect(-84, -236, 18, 236, WOOD2, 4) + rect(66, -236, 18, 236, WOOD2, 4) + rect(-90, -520, 20, 270, WOOD2, 5) + rect(-90, -520, 30, 30, WOOD, 6) + rect(-86, -460, 14, 180, WOOD, 3), `translate(${x} ${y}) scale(${s})`, `opacity="${a}"`);
const table = (x, y, w, s = 1) => g(rect(-w / 2, -300, w, 34, WOOD, 8) + rect(-w / 2 + 20, -266, 24, 266, WOOD2, 4) + rect(w / 2 - 44, -266, 24, 266, WOOD2, 4), `translate(${x} ${y}) scale(${s})`);
const plate = (x, y, rot = 0, s = 1, spill = 0) => g(`<ellipse cx="0" cy="0" rx="${90 + spill * 60}" ry="${22 + spill * 10}" fill="${spill ? '#e8a23a' : '#ffffff'}" opacity="${spill ? 0.9 : 1}"/>` + (spill ? '' : `<ellipse cx="0" cy="-14" rx="60" ry="18" fill="#e8a23a"/>` + circ(-14, -22, 9, '#c8312b') + circ(18, -18, 8, '#c8312b')), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
// tree: trunk (wood) + canopy (leaves). trunk=0 → only leaves hanging; fall>0 → leaves scatter down
function tree(t, x, y, s, { trunk = 1, fall = -1, seed = 1, leaves = 1 } = {}) {
  let o = '';
  if (trunk) o += g(`<path d="M-26,0 L-18,-300 L-70,-420 L-56,-430 L-8,-340 L-4,-470 L10,-470 L12,-340 L64,-430 L78,-420 L22,-300 L28,0Z" fill="${WOOD2}"/>`, `translate(${x} ${y}) scale(${s})`);
  if (!leaves) return o;
  const r = rng(seed), cols = ['#3aa04a', '#56c25a', '#2f8a3e', '#7ad05a'];
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 190, lx = x + Math.cos(a) * rr * s, ly = y + (-500 + Math.sin(a) * rr * 0.75) * s, c = cols[Math.floor(r() * 4)], del = r() * 0.25, vx = (r() - 0.5) * 380;
    const d = fall >= 0 ? Math.max(0, t - fall - del) : 0;
    const yy = Math.min(1880, ly + 900 * d * d), xx = lx + vx * d + Math.sin(t * 6 + i) * 30 * Math.min(1, d * 3);
    o += `<ellipse cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" rx="${(26 * s).toFixed(1)}" ry="${(14 * s).toFixed(1)}" fill="${c}" transform="rotate(${((r() - 0.5) * 120 + d * 400).toFixed(0)} ${xx.toFixed(1)} ${yy.toFixed(1)})"/>`;
  }
  if (fall < 0 || t < fall) o += circ(x, y - 500 * s, 0, 'none');
  return o;
}
function blizzard(t, t0, { n = 120, seed = 5 } = {}) {
  const r = rng(seed), cols = ['#3aa04a', '#56c25a', '#2f8a3e', '#9ae06a']; let o = '';
  for (let i = 0; i < n; i++) { const x0 = r() * 1180 - 50, y0 = -100 - r() * 1600, sp = 900 + r() * 700, d = t - t0; if (d < 0) continue; const y = y0 + sp * d, x = x0 + Math.sin(d * 4 + i) * 60 + d * 200; if (y < -40 || y > 1960) continue; o += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="22" ry="11" fill="${cols[i % 4]}" transform="rotate(${(d * 300 + i * 37) % 360} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }
  return o;
}
const leafPile = (seed = 2, y0 = 1700, h = 120) => { const r = rng(seed), cols = ['#3aa04a', '#56c25a', '#2f8a3e', '#9ae06a', '#c8c23a']; let o = ''; for (let i = 0; i < 260; i++) { const x = r() * 1100 - 10, y = y0 + r() * (1920 - y0) - r() * h * 0.4; o += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${18 + r() * 10}" ry="${9 + r() * 5}" fill="${cols[Math.floor(r() * 5)]}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; } return o; };
// grand piano (side-ish view): wooden body + golden iron plate with strings
function piano(t, x, y, s, { body = 1, drop = -1, snap = -1 } = {}) {
  let o = '';
  if (body) o += `<path d="M-330,-60 L330,-60 Q380,-60 380,-120 Q380,-260 200,-300 Q60,-330 -40,-330 L-330,-330Z" fill="#141418"/>` + rect(-330, -60, 710, 50, '#1e1e24', 6) + rect(-300, -10, 30, 230, '#141418', 6) + rect(320, -10, 30, 230, '#141418', 6) + rect(-330, -40, 240, 26, '#f4f4f0', 3) + [...Array(12)].map((_, i) => rect(-326 + i * 20, -40, 10, 16, '#141418', 2)).join('');
  const d = drop >= 0 ? Math.max(0, t - drop) : 0, py = Math.min(330, 1500 * d * d);
  let pl = `<path d="M-310,-80 L310,-80 Q350,-90 350,-130 Q340,-240 190,-280 Q60,-305 -30,-305 L-310,-305Z" fill="#d9a23a" stroke="#a87a1a" stroke-width="8"/>`;
  const k = snap >= 0 ? clamp((t - snap) / 0.5) : 0;
  for (let i = 0; i < 22; i++) { const sx = -290 + i * 28, top = -290 + Math.max(0, i - 11) * 6; if (k <= 0) pl += `<path d="M${sx},-90 L${sx},${top}" stroke="#f2f2ea" stroke-width="3"/>`; else { const w = 120 * k * (i % 2 ? 1 : -1), h = 300 * k; pl += `<path d="M${sx},-90 q${w},${-h * 0.5} ${-w * 0.6},${-h - 140 * k} t${w * 1.4},${-h * 0.8}" stroke="#f2f2ea" stroke-width="4" fill="none" opacity="${1 - 0.5 * k}"/>`; } }
  o += g(pl, `translate(0 ${py}) rotate(${d * 6})`);
  return g(o, `translate(${x} ${y}) scale(${s})`);
}
const pencil = (x, y, rot, s, body = 1) => g((body ? rect(-200, -18, 340, 36, '#ffcf3a', 6) + rect(-200, -18, 340, 12, '#ffe07a', 6) + rect(-240, -18, 44, 36, '#ff8aa0', 8) + rect(-200, -18, 18, 36, '#b8bcc4') + `<path d="M140,-18 L210,0 L140,18Z" fill="#e8c08a"/>` : '') + rect(-190, -5, 400, 10, '#2a2c30', 4), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

export async function init() {
  const W = await (await fetch('/work/wood5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = 46.3;
  const T = {
    wood: wt('wood', 0), news: wt('news', 0), some: wt('some', 0),
    chair: wt('chair', 2), gone: wt('gone', 2), hits: wt('hits', 2), floor: wt('floor', 2), pasta: wt('pasta', 2), carpet: wt('carpet', 2),
    vanishes: wt('vanishes', 4), trillion: wt('trillion', 4), hang: wt('hang', 4), green: wt('green', 4), blizzard: wt('blizzard', 4),
    piano: wt('piano', 6), pwood: wt('wood', 6), twenty: wt('twenty', 6), let: wt('let', 6), once: wt('once', 6), loudest: wt('loudest', 6),
    stair: wt('staircase', 8), sgone: wt('gone', 8), halfway: wt('halfway', 8), anymore: wt('anymore', 8), door: wt('door', 8), boss: wt('boss', 8), napping: wt('napping', 8),
    pencil: wt('pencil', 10), chop: wt('chopstick', 10), baseball: wt('baseball', 10), bat: wt('bat', 10), swing: wt('swing', 10),
    back: wt('back', 11),
    trees: wt('trees', 12), leaves: wt('leaves', 12), not: wt('not', 12), dad: wt('dad', 12), blower: wt('blower', 12), best: wt('best', 12), life: wt('life', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 — hook: you on a wooden chair at a wooden desk; wood goes, you drop
    [0, (t) => {
      const off = t > T.wood - 0.05, kD = seg(t, T.some - 0.1, T.some + 0.3);
      let s = room() + rect(120, 380, 300, 380, '#9ac4ee', 6, 'stroke="#ffffff" stroke-width="14"') + rect(640, 420, 300, 300, '#ffffff', 8, 'opacity="0.6"');
      // bookshelf on the wall (wood) with books
      if (!off) s += rect(600, 760, 380, 24, WOOD, 4);
      for (let j = 0; j < 6; j++) { const dB = off ? Math.max(0, t - T.wood - j * 0.03) : 0; s += rect(620 + j * 58, 640 + Math.min(900, 1600 * dB * dB), 44, 120, ['#c8312b', '#2f6fd6', '#d9a23a', '#2fae6a', '#7a4ac8', '#ff8a2a'][j], 4, `transform="rotate(${dB * 300 * (j % 2 ? 1 : -1)} ${642 + j * 58} ${700 + Math.min(900, 1600 * dB * dB)})"`); }
      if (kD <= 0) {
        s += table(700, 1920, 560, 1.2) + rect(560, 1480, 260, 90, '#2a2c30', 8) + rect(570, 1395, 240, 100, '#3a6ad6', 6);
        s += chair(320, 1920, 1.2) + adult({ ...YOU, x: 320, y: 1920, s: 1.2, pose: 'sit', face: t > T.news ? 'worried' : 'neutral' });
      } else {
        const ly = lerp(1600, 1860, kD);
        s += rect(520, 1500 + kD * 300, 220, 80, '#2a2c30', 8, `transform="rotate(${kD * 20} 630 1440)"`);
        s += lying({ ...YOU, x: 380, y: ly, s: 1.2, rot: -90 * kD, face: 'tense' });
        s += debris(t, T.some, 400, 1780, { n: 24, col: '#e8d2a8', seed: 3 });
      }
      s += stamp(540, 600, 'WOOD: OFF', seg(t, T.wood - 0.05, T.wood + 0.25), '#ff2a3a', -7, 80);
      s += flash(t, T.some - 0.05, 0.6) + flash(t, T.wood - 0.05, 0.35);
      return g(cam(fin(s), 0, { z0: punch(t, [T.some, T.wood]), z1: 1, oy: 1500 }), shake(t, [T.wood, T.some], 30)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — lecture hall: every chair gone, everyone hits the floor; pasta on the carpet
    [C[0], (t) => {
      const kH = seg(t, T.chair - 0.05, T.chair + 0.25);
      let s = vgrad('#e8d8b8', '#d0b890') + rect(0, 300, 1080, 120, '#2a4a3a') + t2(540, 380, 'LECTURE HALL 1', 50, '#e8f0e8', { weight: 800, ls: 6 });
      const rows = [[820, 0.62, 8], [1010, 0.72, 7]];
      rows.forEach(([y, sc, n], ri) => {
        s += rect(0, y + 4, 1080, 18, '#8a6a4a');
        for (let i = 0; i < n; i++) { const c = CROWD[(i + ri * 3) % CROWD.length], x = 80 + i * (920 / (n - 1)); if (kH <= 0) s += rect(x - 50, y - 160 * sc, 100, 20, WOOD, 4) + adult({ ...c, x, y, s: sc, pose: 'sit', face: 'neutral' }); else s += lying({ ...c, x: x + (i % 2 ? 30 : -30) * kH, y: y + 40 * kH, s: sc, rot: (i % 2 ? -1 : 1) * 78 * kH, face: 'tense', pose: 'up' }); }
      });
      s += debris(t, T.hits, 540, 1000, { n: 30, col: '#8a6a4a', seed: 6 });
      // pasta: a table drops, plate flips onto the carpet
      s += rect(0, 1450, 1080, 470, '#c84a4a');
      if (t < T.chair) s += table(560, 1800, 420, 0.95);
      else s += debris(t, T.chair, 560, 1520, { n: 18, col: WOOD, seed: 13 });
      const kP = seg(t, T.pasta - 0.25, T.carpet);
      if (kP < 1) s += plate(lerp(540, 600, kP), lerp(1500, 1720, kP * kP), kP * 200, 1.6);
      else s += plate(600, 1740, 0, 1.6, 1);
      s += chip(540, 1400, 'CHAIRS: 0', pop(seg(t, T.gone - 0.1, T.gone + 0.1)), { size: 48, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 1560, 'PASTA: CARPET', seg(t, T.carpet - 0.05, T.carpet + 0.2), '#c8102e', -6, 60);
      s += flash(t, T.hits - 0.05, 0.5);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.chair, T.hits, T.carpet]), z1: 1, oy: 900 }), shake(t, [T.chair, T.hits, T.carpet], 28)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — every tree vanishes: leaves hang, then green blizzard
    [C[1], (t) => {
      const gone = t > T.vanishes - 0.05;
      let s = vgrad('#6ab0f0', '#d8ecfa', 0, 1300) + rect(0, 1300, 1080, 620, '#7ac05a') + rect(0, 1300, 1080, 30, '#5aa04a');
      [[180, 1500, 1.1, 1], [520, 1420, 0.9, 2], [860, 1520, 1.15, 3], [350, 1820, 1.3, 4], [760, 1880, 1.25, 5]].forEach(([x, y, sc, sd]) => { s += tree(t, x, y, sc, { trunk: !gone, fall: T.green - 0.1, seed: sd }); });
      s += blizzard(t, T.green - 0.05);
      if (gone) s += debris(t, T.vanishes, 540, 1500, { n: 16, col: WOOD2, seed: 2 });
      s += chip(540, 560, '3,000,000,000,000 TREES', pop(seg(t, T.trillion - 0.15, T.trillion + 0.1)), { size: 42, col: '#fff', bg: '#c8102e' });
      s += chip(540, 720, 'LEAVES: STILL HERE', pop(seg(t, T.hang - 0.1, T.hang + 0.1)) * (1 - seg(t, T.green, T.green + 0.2)), { size: 40, col: '#2a5a2a', bg: '#d8f0c8' });
      s += stamp(540, 700, 'GREEN BLIZZARD', seg(t, T.blizzard - 0.05, T.blizzard + 0.2), '#ffffff', 6, 66);
      if (t > T.green) s += speedLines(t, { a: 0.3, vertical: true, dir: 1, seed: 8 });
      s += flash(t, T.vanishes - 0.05, 0.6);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.vanishes, T.green]), z1: 1, oy: 1100 }), shake(t, [T.vanishes, T.green], 26)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — piano: wooden body gone, 20 tons of string tension let go
    [C[2], (t) => {
      const gone = t > T.pwood - 0.05;
      let s = vgrad('#2a1a3a', '#120a1a') + glow(540, 1300, 650, '#ff3b8a', 0.25) + glow(540, 300, 400, '#ffcf6a', 0.3) + rect(0, 1720, 1080, 200, '#3a2a2a');
      s += piano(t, 540, 1560, 1.3, { body: !gone, drop: T.let - 0.1, snap: T.let - 0.05 });
      if (gone) s += debris(t, T.pwood, 540, 1400, { n: 28, col: '#141418', seed: 4, size: 22 });
      s += crack(t, T.let - 0.05, 540, 800, 7) + crack(t, T.loudest - 0.05, 300, 1100, 9);
      s += chip(540, 560, '20 TONS OF TENSION', pop(seg(t, T.twenty - 0.1, T.twenty + 0.15)), { size: 44, col: '#ffcf6a', border: '#ffcf6a' });
      s += stamp(540, 760, 'SPROING', seg(t, T.let - 0.05, T.let + 0.2), '#ff3b8a', -8, 90);
      s += chip(540, 920, 'LOUDEST CHORD IN HISTORY', pop(seg(t, T.loudest - 0.1, T.loudest + 0.1)), { size: 40, col: '#fff', bg: '#c8102e' });
      if (t > T.let) s += speedLines(t, { a: 0.25, seed: 11 });
      s += flash(t, T.let - 0.05, 0.85) + flash(t, T.pwood - 0.05, 0.4);
      return g(cam(fin(s, 0.5), 0, { z0: punch(t, [T.pwood, T.let, T.loudest], 0.12), z1: 1, oy: 1400 }), shake(t, [T.pwood, T.let, T.loudest], 40)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — staircase gone (halfway up → downstairs), door gone (boss sees the nap)
    [C[3], (t) => {
      const sg = t > T.sgone - 0.05, dg = t > T.door - 0.05;
      let s = room(['#e8eef8', '#c8d4e8'], '#9a7a5a');
      if (t < T.door - 0.2) {
        if (!sg) for (let i = 0; i < 9; i++) s += rect(80 + i * 90, 1560 - (i + 1) * 90, 120, 90 * (i + 1), WOOD, 0, 'stroke="#7a4e22" stroke-width="4"');
        const kF = seg(t, T.sgone, T.sgone + 0.35);
        if (!sg) s += adult({ ...YOU, x: 480, y: 1110, s: 1.0, face: 'neutral', pose: 'stand' });
        else if (kF < 1) s += adult({ ...YOU, x: 480, y: lerp(1110, 1520, kF * kF), s: 1.0, face: 'tense', pose: 'up' });
        else s += lying({ ...YOU, x: 520, y: 1700, s: 1.0, face: 'tense', rot: -90 });
        if (sg) s += debris(t, T.sgone, 480, 1500, { n: 30, col: WOOD, seed: 5 });
        s += chip(540, 560, 'STAIRS: GONE', pop(seg(t, T.sgone - 0.1, T.sgone + 0.1)), { size: 46, col: '#fff', bg: '#c8102e' });
        s += stamp(540, 760, 'NOT ANYMORE', seg(t, T.anymore - 0.05, T.anymore + 0.2), '#c8102e', 6, 66);
        s += flash(t, T.sgone - 0.05, 0.5);
      } else {
        s = room(['#dfe8f0', '#c0ccd8'], '#7a8a9a');
        s += rect(560, 640, 440, 920, '#cfd8e2') + rect(560, 640, 440, 920, 'none', 0, 'stroke="#ffffff" stroke-width="22"');
        if (!dg) s += rect(571, 651, 418, 909, WOOD, 4) + circ(950, 1120, 14, '#d9a23a');
        else {
          // supply closet: shelves of paper + napping guy on the floor
          s += rect(600, 720, 360, 16, '#8a8e96') + rect(600, 900, 360, 16, '#8a8e96') + [...Array(5)].map((_, i) => rect(620 + i * 66, 660, 50, 60, '#ffffff', 3) + rect(620 + i * 66, 840, 50, 60, '#e8e2d0', 3)).join('');
          s += lying({ ...CROWD[1], x: 780, y: 1530, s: 0.85, face: 'closed', rot: -90 });
          s += t2(860, 1440 - ((t * 60) % 60), 'Z z z', 64, '#2f6fd6', { weight: 900 });
          s += debris(t, T.door, 780, 1300, { n: 26, col: WOOD, seed: 7 });
        }
        s += adult({ ...CROWD[4], top: '#1d222c', x: 300, y: 1920, s: 1.2, face: t > T.boss - 0.1 ? 'tense' : 'neutral', pose: 'cross' });
        s += chip(300, 560, 'BOSS', pop(seg(t, T.boss - 0.1, T.boss + 0.1)), { size: 46, col: '#fff', bg: '#1d222c' });
        s += stamp(780, 1720, 'BUSTED', seg(t, T.napping - 0.05, T.napping + 0.2), '#c8102e', -6, 70);
        s += flash(t, T.door - 0.05, 0.6);
      }
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.sgone, T.door, T.napping]), z1: 1, oy: 1300 }), shake(t, [T.sgone, T.anymore, T.door, T.napping], 28)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 — pencil / chopsticks / bat, rapid fire
    [C[4], (t) => {
      let s;
      if (t < T.chop - 0.08) {
        s = vgrad('#f4f0e2', '#e2dac2') + rect(140, 700, 800, 1000, '#ffffff', 10, 'stroke="#c8c2b0" stroke-width="4"') + [...Array(12)].map((_, i) => rect(180, 780 + i * 76, 720, 4, '#9ac0e8')).join('');
        const d = Math.max(0, t - T.pencil);
        s += `<path d="M220,1000 q60,-40 120,0 t120,0 t120,0" stroke="#2a2c30" stroke-width="7" fill="none"/>`;
        s += pencil(560, 1500 + 1500 * d * d, -30 + d * 200, 1.6, t < T.pencil - 0.03);
        s += stamp(540, 560, 'PENCIL: GRAPHITE ONLY', seg(t, T.pencil - 0.05, T.pencil + 0.2), '#c8102e', -5, 48);
        s += flash(t, T.pencil - 0.05, 0.5);
      } else if (t < T.baseball - 0.08) {
        s = vgrad('#c8312b', '#7a1a1a') + glow(540, 1400, 500, '#ffcf6a', 0.3);
        const d = Math.max(0, t - T.chop);
        s += `<path d="M260,1450 Q540,1800 820,1450Z" fill="#ffffff"/>` + `<ellipse cx="540" cy="1450" rx="280" ry="50" fill="#e8c890"/>`;
        for (let i = 0; i < 7; i++) { const x = 470 + i * 22, y0 = 900 + 300 * Math.min(1, 3 * d * d * 9); s += `<path d="M${x},${y0} q${20 * Math.sin(i)},180 0,${Math.max(40, 520 - (y0 - 900))}" stroke="#ffe08a" stroke-width="12" fill="none" stroke-linecap="round"/>`; }
        if (t < T.chop) s += rect(420, 520, 18, 420, WOOD, 6, 'transform="rotate(12 430 730)"') + rect(640, 520, 18, 420, WOOD, 6, 'transform="rotate(-12 650 730)"');
        else s += debris(t, T.chop, 540, 1450, { n: 26, col: '#e8c890', seed: 9 }) + debris(t, T.chop, 540, 1450, { n: 16, col: '#ffe08a', seed: 3 });
        s += stamp(540, 560, 'CHOPSTICKS: GONE', seg(t, T.chop - 0.05, T.chop + 0.2), '#ffffff', 6, 58);
        s += flash(t, T.chop - 0.05, 0.5);
      } else {
        s = vgrad('#5aa0e8', '#cfe6fa', 0, 1100) + rect(0, 1100, 1080, 820, '#5aa04a') + `<path d="M540,1500 L780,1620 L540,1740 L300,1620Z" fill="#d8b888"/>`;
        const kS = seg(t, T.bat - 0.3, T.swing + 0.1), ang = lerp(-150, 40, kS), batOn = t < T.bat - 0.02;
        s += adult({ ...CROWD[2], top: '#2f6fd6', hairStyle: 'cap', hair: '#1d222c', x: 380, y: 1920, s: 1.1, pose: 'point', face: t > T.swing ? 'open' : 'tense' });
        if (batOn) s += g(rect(0, -14, 360, 28, WOOD, 14) + rect(0, -10, 80, 20, '#2a2c30', 8), `translate(560 1440) rotate(${ang})`);
        else s += debris(t, T.bat, 600, 1440, { n: 24, col: WOOD, seed: 12 });
        const bx = lerp(1150, -100, seg(t, T.baseball, T.swing + 0.4));
        s += circ(bx, 1440 + Math.sin(bx / 200) * 20, 26, '#ffffff', 'stroke="#c8312b" stroke-width="4"') + speedLines(t, { a: 0.3, seed: 14 });
        s += stamp(540, 560, 'STRIKE ONE', seg(t, T.swing, T.swing + 0.2), '#c8102e', -6, 74);
        s += chip(540, 760, 'BAT: GONE', pop(seg(t, T.bat - 0.1, T.bat + 0.1)), { size: 44, col: '#fff', bg: '#1d222c' });
        s += flash(t, T.bat - 0.05, 0.6);
      }
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.pencil, T.chop, T.bat, T.swing], 0.1), z1: 1, oy: 1300 }), shake(t, [T.pencil, T.chop, T.bat, T.swing], 28)) + bar(t) + pill('SECOND 5');
    }],
    // 11 — wood is back
    [C[5], (t) => {
      let s = vgrad('#7ab8f0', '#e2f0fa', 0, 1300) + rect(0, 1300, 1080, 620, '#7ac05a');
      [[180, 1500, 1.1], [520, 1420, 0.9], [860, 1520, 1.15], [350, 1820, 1.3], [760, 1880, 1.25]].forEach(([x, y, sc], i) => { s += tree(t, x, y, sc, { leaves: 0, seed: i }); });
      s += leafPile(3, 1640, 120);
      s += stamp(540, 640, 'WOOD: ON', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 90);
      s += flash(t, C[5], 0.95);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.back], 0.12), z1: 1, oy: 1300 }), shake(t, [C[5], T.back], 40, 9)) + pill('WOOD: BACK');
    }],
    // 12 — trees back, leaves not: ankle deep; dad with leaf blower, happiest man alive
    [C[6], (t) => {
      let s = vgrad('#9ac4ee', '#e2eef8', 0, 1000);
      const r = rng(4); let x = -40;
      while (x < 1120) { const w = 170 + r() * 120, h = 300 + r() * 300, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8'][Math.floor(r() * 4)]; s += rect(x, 1000 - h, w, h, c) + rect(x + w / 2 - 30, 1000 - 110, 60, 110, '#7a4e22'); x += w + 10; }
      s += rect(0, 1000, 1080, 920, '#8a8e96');
      [[120, 1150, 0.8], [950, 1180, 0.85]].forEach(([x, y, sc], i) => { s += tree(t, x, y, sc, { leaves: 0, seed: i }); });
      s += leafPile(5, 1350, 200);
      const showDad = t > T.dad - 0.1;
      if (showDad) {
        s += adult({ ...CROWD[3], top: '#c8312b', hairStyle: 'cap', hair: '#2f6fd6', x: 330, y: 1920, s: 1.15, pose: 'hold', face: 'smile' });
        s += g(rect(0, -30, 120, 60, '#ff8a2a', 14) + rect(110, -14, 260, 28, '#3a3e46', 10), `translate(300 1540) rotate(8)`);
        const rr = rng(9); for (let i = 0; i < 40; i++) { const d = ((t * 1.6 + rr()) % 1), xx = 680 + d * 520, yy = 1580 + (rr() - 0.5) * 300 * d - 200 * d; s += `<ellipse cx="${xx.toFixed(0)}" cy="${yy.toFixed(0)}" rx="20" ry="10" fill="${['#3aa04a', '#9ae06a', '#c8c23a'][i % 3]}" transform="rotate(${(t * 500 + i * 40) % 360} ${xx.toFixed(0)} ${yy.toFixed(0)})"/>`; }
        s += speedLines(t, { a: 0.18, seed: 16 });
      } else s += blizzard(t, C[6] - 0.5, { n: 60, seed: 7 });
      s += chip(540, 560, 'LEAVES: NOT BACK', pop(seg(t, T.not - 0.1, T.not + 0.1)), { size: 46, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 760, 'BEST DAY EVER', seg(t, T.best - 0.05, T.best + 0.2), '#2fae6a', -6, 74);
      s += flash(t, T.dad - 0.1, 0.4);
      return g(cam(fin(s, 0.4), seg(t, C[6], C[7]), { z0: punch(t, [T.not, T.dad, T.best], 0.1), z1: 1.08, oy: 1500 }), shake(t, [T.dad, T.best], 22)) + pill('SUBURBS · EVERYWHERE');
    }],
    // 13 — CTA
    [C[7], (t) => {
      const opts = ['PAPER?', 'WATER?', 'GOLD?', 'CONCRETE?', 'OXYGEN?', 'COLOR?'];
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
