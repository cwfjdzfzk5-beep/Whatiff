// "What if every spring on Earth vanished for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { vgrad, grade, t2, runShots } from './lib2.js';
import { pop, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const FANC = ['#c8102e', '#2f6fd6', '#ffcf3a', '#2fae6a', '#ff7a1a', '#a64ad6'];
// small faceless figure (origin ~ hips, head centre at y - 40*s)
const fig = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : `<path d="M-18,0 L-30,40 M18,0 L30,40" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
// zig-zag coil spring standing on (x, yb), height h, width w
const coil = (x, yb, h, w = 60, n = 7, col = '#c8ccd4', sw = 10) => { let d = `M${x},${yb}`; for (let i = 0; i < n; i++) { const y1 = yb - h * (i + 0.5) / n, y2 = yb - h * (i + 1) / n; d += ` L${(x + (i % 2 ? -w / 2 : w / 2)).toFixed(1)},${y1.toFixed(1)} L${x},${y2.toFixed(1)}`; } return `<path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`; };
// horizontal coil from (x0,y) to (x1,y)
const hcoil = (x0, x1, y, w = 22, n = 6, col = '#c8ccd4', sw = 6) => { let d = `M${x0},${y}`; for (let i = 0; i < n; i++) { const xa = lerp(x0, x1, (i + 0.5) / n), xb = lerp(x0, x1, (i + 1) / n); d += ` L${xa.toFixed(1)},${y + (i % 2 ? -w / 2 : w / 2)} L${xb.toFixed(1)},${y}`; } return `<path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linejoin="round"/>`; };
// flying spring bits
const springBits = (t, t0, x, y, seed, n = 12, spread = 800) => { const d = t - t0; if (d < 0 || d > 2) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, v = spread * (0.4 + 0.6 * r()); const px = x + Math.cos(a) * v * d, py = y + Math.sin(a) * v * d * 0.8 + 700 * d * d; s += g(coil(0, 20, 40, 18, 4, '#d8dce4', 5), `translate(${px.toFixed(0)} ${py.toFixed(0)}) rotate(${(d * 600 * (r() - 0.5)).toFixed(0)})`, `opacity="${Math.max(0, 1 - d / 2).toFixed(2)}"`); } return s; };
const sparks = (t, t0, x, y, seed, dir = -1) => { let s = ''; for (let k = 0; k < 4; k++) { const tk = t0 + Math.floor((t - t0) / 0.12) * 0.12 - k * 0.12; if (tk >= t0) s += debris(t, tk, x, y, { n: 10, col: k % 2 ? '#ffcf3a' : '#ff7a1a', spread: 700, seed: seed + Math.round(tk * 100), size: 10 }); } return t > t0 ? s + glow(x, y, 120, '#ffb000', 0.55) : s; };
// car side view, body bottom at by, wheels drawn separately
const carBody = (x, by, col, s = 1, rot = 0) => g(rect(-230, -110, 460, 110, col, 34) + `<path d="M-150,-110 L-90,-200 L110,-200 L170,-110Z" fill="${col}"/>` + `<path d="M-130,-116 L-82,-186 L0,-186 L0,-116Z M14,-116 L14,-186 L100,-186 L150,-116Z" fill="#1a2230"/>` + rect(205, -90, 26, 22, '#ffe9a8', 6) + rect(-228, -88, 22, 20, '#ff3b3b', 6), `translate(${x.toFixed(0)} ${by.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const wheels = (x, cy, s = 1, spin = 0) => [-140, 140].map((dx) => g(circ(0, 0, 52, '#141618') + circ(0, 0, 26, '#b8c0cc') + rect(-4, -24, 8, 48, '#6a707a', 3, `transform="rotate(${spin.toFixed(0)})"`), `translate(${(x + dx * s).toFixed(0)} ${cy.toFixed(0)}) scale(${s})`)).join('');
const toast = (x, y, rot) => g(rect(-55, -60, 110, 120, '#d8903a', 26) + rect(-42, -46, 84, 92, '#f2c27a', 18), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})`);
const fence = (y) => { let s = ''; for (let x = -20; x < 1100; x += 70) s += `<path d="M${x},${y} L${x},${y - 240} L${x + 25},${y - 270} L${x + 50},${y - 240} L${x + 50},${y}Z" fill="#f4ead8" stroke="#c8b898" stroke-width="4"/>`; return s + rect(0, y - 190, 1080, 18, '#e0d4bc') + rect(0, y - 70, 1080, 18, '#e0d4bc'); };

export async function init() {
  const W = await (await fetch('/work/springs5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), mid: wt('mid', 0), trampoline: wt('trampoline', 0), every0: wt('every', 0), spring: wt('spring', 0), vanished: wt('vanished', 0), five: wt('five', 0),
    highway: wt('highway', 2), slams2: wt('slams', 2), belly: wt('belly', 2), sparks: wt('sparks', 2), everywhere: wt('everywhere', 2),
    office: wt('office', 4), chair: wt('chair', 4), drops: wt('drops', 4), boss4: wt('boss', 4), vanishes: wt('vanishes', 4), desk: wt('desk', 4),
    garage: wt('garage', 6), held: wt('held', 6), springs6: wt('springs', 6), slams6: wt('slams', 6), dads: wt('dads', 6), crunch: wt('crunch', 6),
    mattress: wt('mattress', 8), folds: wt('folds', 8), nap: wt('nap', 8), floor: wt('floor', 8), thud: wt('thud', 8),
    you10: wt('you', 10), mats: wt('mats', 10), hit: wt('hit', 10), dirt: wt('dirt', 10), butt: wt('butt', 10),
    back: wt('back', 11), fully: wt('fully', 11), squished: wt('squished', 11), cars: wt('cars', 11), jump: wt('jump', 11), toasters: wt('toasters', 11), fire: wt('fire', 11), ceiling11: wt('ceiling', 11), you11: wt('you', 11), launched: wt('launched', 11), pool: wt('pool', 11), alive: wt('alive', 11),
    boss12: wt('boss', 12), shot: wt('shot', 12), ceiling12: wt('ceiling', 12), best: wt('best', 12), friday: wt('friday', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  // countdown card: row of springs slamming up and down + giant number
  const card = (n) => (t) => {
    const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.2, vertical: true, dir: -1, seed: n });
    const r = rng(n * 7);
    for (let i = 0; i < 9; i++) { const h = 140 + 360 * Math.abs(Math.sin(t * (9 + r() * 6) + i)) * clamp((t - t0) * 6); s += coil(70 + i * 117, 1900, h, 70, 7, '#ffd0d6', 12); s += rect(30 + i * 117, 1880 - h, 80, 16, '#ffd0d6', 6); }
    s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1360, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 });
    s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 34)) + bar(t);
  };
  // backyard trampoline (ring at y=1600). springs: 1 = present, 0 = gone. matDrop 0..1
  const yard = () => vgrad('#3a90ec', '#cfe6fb', 0, 1250) + fence(1300) + rect(0, 1300, 1080, 620, '#4caf50') + [...Array(6)].map((_, i) => rect(0, 1340 + i * 100, 1080, 40, '#56bd5a')).join('');
  const tramp = (t, springsOn, matDrop, bob = 0, tv = 0) => {
    let s = `<ellipse cx="540" cy="1780" rx="470" ry="70" fill="#000" opacity="0.18"/>`;
    for (const x of [120, 330, 750, 960]) s += rect(x - 12, 1600, 24, 190, '#2a2e36', 6);
    s += `<ellipse cx="540" cy="1600" rx="460" ry="90" fill="none" stroke="#2f6fd6" stroke-width="30"/>`;
    const my = 1600 + bob + matDrop * 190;
    if (matDrop < 1) s += `<ellipse cx="540" cy="${my.toFixed(0)}" rx="${(380 - matDrop * 40).toFixed(0)}" ry="${(66 - matDrop * 20).toFixed(0)}" fill="#141618"/>`;
    else s += `<ellipse cx="540" cy="1790" rx="340" ry="40" fill="#141618"/>`;
    if (springsOn) for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, x0 = 540 + Math.cos(a) * 380, y0 = my + Math.sin(a) * 66, x1 = 540 + Math.cos(a) * 456, y1 = 1600 + Math.sin(a) * 88; s += `<path d="M${x0.toFixed(0)},${y0.toFixed(0)} L${x1.toFixed(0)},${y1.toFixed(0)}" stroke="#c8ccd4" stroke-width="8" stroke-dasharray="6 5"/>`; }
    else s += springBits(t, tv, 540, 1600, 77, 22, 1100);
    return s;
  };
  const roadScene = (t, off = 0) => { let s = vgrad('#3a90ec', '#d8ecfc', 0, 1150) + rect(0, 950, 1080, 200, '#7aa86a') + rect(0, 1150, 1080, 770, '#4a4e56') + rect(0, 1150, 1080, 24, '#9a9ea6'); for (let i = 0; i < 8; i++) { const x = ((i * 300 - t * 2200 * off) % 2400 + 2400) % 2400 - 300; s += rect(x, 1645, 160, 18, '#f4f4f4', 6); } return s; };

  const shots = [
    // 0 hook: you mid-jump, every spring vanishes
    [0, (t) => {
      const tv = T.vanished - 0.05;
      let s = yard();
      const ph = (t % 0.9) / 0.9, bounceY = t < tv ? 1440 - 520 * Math.sin(Math.PI * ph) : lerp(1440 - 520 * Math.sin(Math.PI * ((tv % 0.9) / 0.9)), 940, seg(t, tv, tv + 0.3));
      const dip = t < tv && bounceY > 1380 ? 40 : 0;
      s += tramp(t, t < tv, t < tv ? 0 : pop(seg(t, tv, tv + 0.35)), dip, tv);
      s += fig(540, Math.min(bounceY, 1440), 3.4, '#3c4350', t > tv ? Math.sin(t * 14) * 12 : 0, true);
      if (t > tv) s += speedLines(t, { a: 0.25, seed: 2 });
      s += hit(540, 500, 'BAD NEWS.', pop(seg(t, T.news - 0.2, T.news)) * (1 - seg(t, T.mid - 0.1, T.mid)), '#ff2a3a', -6, 150);
      s += chip(540, 500, 'YOU. MID-JUMP.', pop(seg(t, T.mid - 0.1, T.mid + 0.05)) * (1 - seg(t, T.every0 - 0.1, T.every0)), { size: 54, col: '#fff', bg: '#141a22' });
      s += stamp(540, 500, 'EVERY SPRING', seg(t, T.every0, T.every0 + 0.12) * (1 - seg(t, tv - 0.1, tv)), '#ffffff', -4, 84);
      s += stamp(540, 500, 'GONE.', seg(t, tv, tv + 0.1) * (1 - seg(t, T.five - 0.1, T.five)), '#ff2a3a', -6, 150);
      s += hit(540, 500, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), '#ff2a3a', -4, 130);
      s += flash(t, 0, 0.6) + flash(t, tv, 0.95) + flash(t, T.five - 0.1, 0.5, '#ff2a3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [0.05, T.news, T.mid, T.spring, tv, T.five], 0.12), z1: 1, oy: 1100 }), shake(t, [0.05, T.news, tv, tv + 0.2, T.five], 34)) + pill('EVERY SPRING: GONE');
    }],
    [N[0], card(1)],
    // 2 highway: every car slams onto its belly, sparks everywhere
    [C[0], (t) => {
      const ts = T.slams2 - 0.04; let s = roadScene(t, t < ts ? 1 : 0.4);
      s += speedLines(t, { a: t < ts ? 0.3 : 0.15, seed: 4, dir: -1 });
      const cars = [[300, 1500, '#c8102e', 0.95, 0], [780, 1500, '#ffcf3a', 0.95, 0.05], [520, 1880, '#2f6fd6', 1.1, 0.1]];
      for (const [cx, ry, col, cs, dl] of cars) {
        const k = pop(seg(t, ts + dl, ts + dl + 0.1)), jig = t < ts ? Math.sin(t * 30 + cx) * 3 : 0;
        s += wheels(cx, ry - 52 * cs, cs, -t * 1200);
        s += carBody(cx, ry - 52 * cs + 52 * cs * k + jig - (t > ts ? 0 : 0), col, cs, k ? -1.5 * k : 0);
        if (t > ts + dl) s += sparks(t, ts + dl, cx - 200 * cs, ry - 6, Math.round(cx)) + sparks(t, ts + dl, cx + 150 * cs, ry - 6, Math.round(cx) + 5);
      }
      s += chip(540, 600, 'HIGHWAY. 70 MPH.', pop(seg(t, T.highway - 0.05, T.highway + 0.1)) * (1 - seg(t, ts - 0.1, ts)), { size: 54, col: '#fff', bg: '#141a22' });
      s += hit(540, 620, 'SLAM!', pop(seg(t, ts, ts + 0.1)) * (1 - seg(t, T.sparks - 0.1, T.sparks)), '#ffcf3a', -6, 240);
      s += stamp(540, 620, 'SPARKS.', seg(t, T.sparks - 0.05, T.sparks + 0.08) * (1 - seg(t, T.everywhere - 0.1, T.everywhere)), '#ff7a1a', -6, 120);
      s += stamp(540, 620, 'EVERYWHERE.', seg(t, T.everywhere - 0.05, T.everywhere + 0.08), '#ff2a3a', 5, 110);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, ts, 0.85, '#fff4c0') + flash(t, T.sparks, 0.4, '#ffb000');
      return g(cam(fin(s), 0, { z0: punch(t, [T.highway, ts, ts + 0.1, T.sparks, T.everywhere], 0.1), z1: 1.03, oy: 1300 }), shake(t, [ts, ts + 0.1, T.sparks], 36)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 office: every chair drops, boss vanishes behind his desk
    [C[1], (t) => {
      const FL = 1800, td = T.drops - 0.05; let s = vgrad('#f4f6fa', '#dfe6f0', 0, FL) + rect(0, FL, 1080, 120, '#8a94a4');
      s += rect(80, 480, 400, 300, '#9ac0d8', 8) + rect(600, 480, 400, 300, '#9ac0d8', 8) + rect(96, 496, 368, 268, '#cfe6fb', 4) + rect(616, 496, 368, 268, '#cfe6fb', 4);
      const P = [[200, '#2f6fd6', 0], [540, '#2a2e36', 0.04], [880, '#2fae6a', 0.08]];
      for (const [x, col, dl] of P) {
        const k = pop(seg(t, td + dl, td + dl + 0.12)), drop = 300 * k;
        const hy = 1530 + drop; // hips
        s += rect(x - 10, hy + 40, 20, Math.max(10, FL - hy - 80), '#2a2e36') + rect(x - 90, FL - 30, 180, 20, '#2a2e36', 8);
        if (k < 1) s += coil(x, FL - 30, Math.max(0, FL - 70 - hy - 30) * (1 - k), 30, 6, '#c8ccd4', 6);
        s += rect(x - 80, hy + 30, 160, 26, '#1a1c22', 10);
        s += fig(x, hy, 3, col, 0, false);
        if (x === 540) s += `<path d="M540,${hy - 30} l-10,90 l10,20 l10,-20Z" fill="#c8102e"/>`;
        if (k > 0 && k < 1) s += springBits(t, td + dl, x, hy + 200, Math.round(x), 6, 500);
      }
      // desks in front (top at 1340)
      for (let i = 0; i < 3; i++) { const x = 40 + i * 340; s += rect(x, 1560, 320, 30, '#c8a070', 6) + rect(x + 10, 1590, 300, FL - 1590, '#b08a5a', 4) + rect(x + 10, 1440, 70, 110, '#1a1c22', 8) + rect(x + 35, 1550, 20, 12, '#1a1c22') + rect(x + 230, 1520, 70, 40, '#f4f4f0', 4); }
      if (t > td) s += debris(t, td + 0.12, 540, 1600, { n: 18, col: '#ffffff', spread: 700, seed: 3, size: 20 });
      s += chip(540, 640, 'OFFICE. 9 AM.', pop(seg(t, T.office - 0.05, T.office + 0.1)) * (1 - seg(t, td - 0.1, td)), { size: 48, col: '#fff', bg: '#141a22' });
      s += hit(540, 660, 'THUNK!', pop(seg(t, td, td + 0.1)) * (1 - seg(t, T.boss4 - 0.1, T.boss4)), '#ffcf3a', -6, 230);
      s += stamp(540, 660, 'BOSS: GONE', seg(t, T.vanishes - 0.05, T.vanishes + 0.1), '#ff2a3a', -6, 100);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, td, 0.85);
      return g(cam(fin(s), 0, { z0: punch(t, [T.office, td, td + 0.08, T.vanishes, T.desk], 0.1), z1: 1.03, oy: 1300 }), shake(t, [td, td + 0.08, T.vanishes], 34)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 garage: door held by springs slams down on dad's new car
    [C[2], (t) => {
      const tsp = T.springs6 - 0.05, tsl = T.slams6 - 0.1, tc = T.crunch - 0.05;
      let s = vgrad('#3a90ec', '#cfe6fb', 0, 900) + rect(0, 560, 1080, 1360, '#e8d8b8') + `<path d="M-40,600 L540,300 L1120,600Z" fill="#a64a3a"/>` + rect(0, 1620, 1080, 300, '#9a9ea6');
      s += rect(110, 720, 860, 900, '#2a2e36', 6);
      // car (front view) inside, roof at 1060
      const crush = 90 * pop(seg(t, tc - 0.15, tc));
      s += g(rect(-330, -260, 660, 260, '#c8102e', 50) + `<path d="M-250,-260 L-200,${-480 + crush} L200,${-480 + crush} L250,-260Z" fill="#c8102e"/>` + `<path d="M-215,-270 L-175,${-455 + crush} L175,${-455 + crush} L215,-270Z" fill="#9fd0ff"/>` + circ(-230, -150, 50, '#fff4c0') + circ(230, -150, 50, '#fff4c0') + rect(-150, -120, 300, 60, '#1a1c22', 10) + rect(-320, -10, 120, 80, '#141618', 14) + rect(200, -10, 120, 80, '#141618', 14), 'translate(540 1560)');
      if (t > tc) s += `<g>${crack(t, tc, 540, 1180, 7, '#ffffff')}</g>`;
      // door: raised (bottom at 860) -> slams onto roof (bottom at 1080+crush)
      const kd = seg(t, tsl, tsl + 0.22), db = lerp(860, 1080, kd * kd) + (t > tc ? crush : 0);
      s += g([...Array(6)].map((_, i) => rect(0, i * 60, 860, 56, '#f4f4f0', 4)).join('') + [...Array(6)].map((_, i) => rect(30, 16 + i * 60, 800, 6, '#c8c8c0', 2)).join(''), `translate(110 ${(db - 360).toFixed(0)})`);
      s += rect(80, 640, 920, 100, '#e8d8b8');
      // torsion spring above door
      if (t < tsp) s += rect(140, 676, 800, 12, '#6a707a', 4) + hcoil(200, 480, 682, 40, 14, '#c8ccd4', 9) + hcoil(600, 880, 682, 40, 14, '#c8ccd4', 9);
      else s += springBits(t, tsp, 540, 690, 21, 14, 900);
      if (t > tc) s += debris(t, tc, 540, 1100, { n: 18, col: '#c8102e', spread: 800, seed: 8, size: 22 }) + debris(t, tc, 540, 1150, { n: 14, col: '#d8f0ff', spread: 700, seed: 9, size: 14 });
      s += chip(540, 470, 'HELD UP BY SPRINGS', pop(seg(t, T.held - 0.05, T.held + 0.1)) * (1 - seg(t, tsl - 0.1, tsl)), { size: 52, col: '#fff', bg: '#141a22' });
      s += chip(540, 470, "DAD'S NEW CAR", pop(seg(t, T.dads - 0.1, T.dads + 0.05)) * (1 - seg(t, tc - 0.1, tc)), { size: 56, col: '#fff', bg: '#c8102e' });
      s += hit(540, 480, 'CRUNCH.', pop(seg(t, tc, tc + 0.1)), '#ffcf3a', -6, 230);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, tsp, 0.5) + flash(t, tsl + 0.22, 0.6) + flash(t, tc, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [T.garage, tsp, tsl + 0.22, tc], 0.1), z1: 1.03, oy: 1200 }), shake(t, [tsp, tsl + 0.22, tc, tc + 0.1], 40, 6)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 bedroom: every mattress folds, every nap hits the floor
    [C[3], (t) => {
      const FL = 1760, tf = T.folds - 0.08, th = T.thud - 0.05;
      let s = vgrad('#c8b4e8', '#f0e4f8', 0, FL) + rect(0, FL, 1080, 160, '#8a5a3a') + rect(720, 420, 260, 300, '#3a5a8a', 10) + rect(736, 436, 228, 268, '#1a2a4a', 6) + circ(900, 500, 34, '#f4f0d8');
      // bed frame
      s += rect(60, 700, 50, FL - 700, '#7a4a2a', 10) + rect(970, 860, 50, FL - 860, '#7a4a2a', 10) + rect(110, 1100, 860, 30, '#7a4a2a', 6);
      const kf = pop(seg(t, tf, tf + 0.22)), kd = seg(t, T.nap - 0.1, T.nap + 0.15), drop = 560 * kd * kd;
      const top = 860 + drop, th2 = 240 - 160 * kf;
      // mattress (folds into V while falling)
      const sag = 220 * kf;
      s += `<path d="M110,${top} Q540,${top + sag * 2} 970,${top} L970,${top + th2} Q540,${top + th2 + sag * 2} 110,${top + th2}Z" fill="#f4f4fa" stroke="#c8c8d8" stroke-width="6"/>`;
      if (kf < 0.05) for (let i = 0; i < 9; i++) s += coil(170 + i * 92, top + th2 - 30, th2 - 70, 40, 6, '#9aa0b0', 6);
      else s += springBits(t, tf, 540, top + 120, 31, 16, 900);
      // sleeper lying on top (head at x~230)
      const sy = top - 40 + sag * 0.9;
      s += g(rect(-300, -50, 600, 100, '#ffcf3a', 40) + circ(-360, -10, 56, '#e8b894') + circ(-376, -36, 52, '#3a2a20'), `translate(560 ${sy.toFixed(0)}) rotate(${(kf * 4).toFixed(1)})`);
      s += rect(140, top - 60 + sag * 0.3, 200, 60, '#ffffff', 26);
      if (t < tf) s += t2(420 + Math.sin(t * 3) * 10, 760 - ((t * 60) % 60), 'Z z z', 64, '#5a4a8a', { weight: 900 });
      if (t > th) s += debris(t, th, 540, FL - 20, { n: 24, col: '#e8e0f0', spread: 900, seed: 6, size: 26 });
      s += stamp(540, 600, 'EVERY MATTRESS', seg(t, T.mattress - 0.05, T.mattress + 0.1) * (1 - seg(t, T.nap - 0.15, T.nap - 0.05)), '#ff2a3a', -5, 80);
      s += stamp(540, 600, 'EVERY NAP', seg(t, T.nap - 0.05, T.nap + 0.1) * (1 - seg(t, th - 0.1, th)), '#ffffff', 5, 100);
      s += hit(540, 620, 'THUD.', pop(seg(t, th, th + 0.1)), '#ffcf3a', -6, 260);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, tf, 0.6) + flash(t, T.floor, 0.8) + flash(t, th, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.mattress, tf, T.floor, th], 0.1), z1: 1.03, oy: 1300 }), shake(t, [tf, T.floor, th], 36)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 you: still falling, mat's gone, you hit the dirt, butt first
    [C[4], (t) => {
      const th = T.hit - 0.05; let s = yard();
      s += tramp(t, false, 1, 0, -10);
      const kf = seg(t, C[4], th), y = lerp(560, 1700, kf * kf);
      if (t < th) s += speedLines(t, { a: 0.35, vertical: true, dir: -1, seed: 9 });
      s += fig(540, y, 3.6, '#3c4350', t < th ? Math.sin(t * 16) * 15 : 0, true);
      if (t > th) s += debris(t, th, 540, 1760, { n: 30, col: '#8a5a3a', spread: 1100, seed: 12, size: 28 }) + `<ellipse cx="540" cy="1790" rx="${(260 * pop(seg(t, th, th + 0.2))).toFixed(0)}" ry="40" fill="#5a3a20" opacity="0.6"/>`;
      s += chip(540, 600, 'AND YOU?', pop(seg(t, T.you10 - 0.15, T.you10)) * (1 - seg(t, T.mats - 0.1, T.mats)), { size: 60, col: '#fff', bg: '#141a22' });
      s += stamp(540, 600, "MAT'S GONE", seg(t, T.mats - 0.05, T.mats + 0.1) * (1 - seg(t, th - 0.1, th)), '#ff2a3a', -5, 100);
      s += hit(540, 620, 'THUMP!', pop(seg(t, th, th + 0.1)) * (1 - seg(t, T.butt - 0.1, T.butt)), '#ffcf3a', -6, 240);
      s += stamp(540, 620, 'BUTT FIRST.', seg(t, T.butt - 0.05, T.butt + 0.1), '#ff2a3a', 5, 120);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, th, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [T.you10, T.mats, th, T.butt], 0.12), z1: 1.03, oy: 1300 }), shake(t, [th, th + 0.15, T.butt], 44, 6)) + bar(t) + pill('SECOND 5');
    }],
    // 11a springs are back, fully squished
    [C[5], (t) => {
      let s = vgrad('#2fae6a', '#0c5a30') + speedLines(t, { a: 0.18, seed: 15, vertical: true, dir: -1 });
      const kq = seg(t, T.fully, T.squished + 0.2), r = rng(5);
      for (let i = 0; i < 7; i++) { const h = lerp(700 + r() * 200, 90, pop(kq)) + Math.sin(t * 20 + i) * 20 * (1 - kq); s += coil(110 + i * 143, 1880, h, 100, 9, '#e8fff0', 16) + rect(40 + i * 143, 1860 - h, 140, 24, '#e8fff0', 8); }
      s += stamp(540, 640, 'SPRINGS: BACK', seg(t, C[5], C[5] + 0.15) * (1 - seg(t, T.fully - 0.1, T.fully)), '#ffffff', -6, 100);
      s += hit(540, 660, 'FULLY SQUISHED', pop(seg(t, T.fully - 0.05, T.fully + 0.1)), '#ffcf3a', -4, 110);
      s += flash(t, C[5], 0.9, '#c8ffd8') + flash(t, T.squished, 0.4);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.fully, T.squished], 0.1), z1: 1.03, oy: 1300 }), shake(t, [C[5], T.squished + 0.15], 30)) + pill('SPRINGS: BACK');
    }],
    // 11b cars jump
    [T.cars - 0.08, (t) => {
      const tj = T.jump - 0.1; let s = roadScene(t, 0.3);
      const cars = [[300, 1500, '#c8102e', 0.95, 0], [780, 1500, '#ffcf3a', 0.95, 0.06], [520, 1880, '#2f6fd6', 1.1, 0.03]];
      for (const [cx, ry, col, cs, dl] of cars) {
        const d = Math.max(0, t - tj - dl), up = Math.max(0, 2600 * d - 3000 * d * d) * cs; // ballistic hop
        const by = ry - 52 * cs - (t > tj + dl ? up : -52 * cs);
        s += wheels(cx, by + (t > tj + dl ? 0 : -52 * cs), cs, 0);
        if (t > tj + dl) s += coil(cx - 140 * cs, by, Math.min(up, 260), 50, 6, '#c8ccd4', 10) + coil(cx + 140 * cs, by, Math.min(up, 260), 50, 6, '#c8ccd4', 10);
        s += carBody(cx, by - (t > tj + dl ? Math.min(up, 260) : 0), col, cs, t > tj + dl ? Math.sin(d * 8) * 6 : 0);
      }
      if (t > tj) s += speedLines(t, { a: 0.3, vertical: true, dir: -1, seed: 5 });
      s += hit(540, 620, 'BOING!', pop(seg(t, tj, tj + 0.1)), '#ffcf3a', -6, 260);
      s += flash(t, T.cars - 0.06, 0.5) + flash(t, tj, 0.8);
      return g(cam(fin(s), 0, { z0: punch(t, [T.cars, tj], 0.12), z1: 1.03, oy: 1300 }), shake(t, [tj, tj + 0.06], 40)) + pill('CARS: JUMP');
    }],
    // 11c toasters fire toast at the ceiling
    [T.toasters - 0.08, (t) => {
      const tf = T.fire - 0.05; let s = vgrad('#fff4dc', '#f4e0c0', 0, 1920) + rect(0, 0, 1080, 380, '#f8f4ec') + rect(0, 370, 1080, 16, '#d8ccb8') + rect(0, 1400, 1080, 520, '#7a4a2a') + rect(0, 1380, 1080, 40, '#c8a070', 6);
      for (let i = 0; i < 6; i++) s += rect(60 + i * 170, 1460, 140, 120, '#f4f4fa', 6, 'stroke="#c8c8d8" stroke-width="4"');
      const X = [200, 540, 880];
      for (const [i, x] of X.entries()) {
        const d = Math.max(0, t - tf - i * 0.05), y = Math.max(400, 1180 - 5200 * d);
        s += rect(x - 130, 1180, 260, 200, '#c8ccd4', 40) + rect(x - 100, 1170, 80, 26, '#2a2e36', 8) + rect(x + 20, 1170, 80, 26, '#2a2e36', 8) + rect(x + 120, 1240, 30, 80, '#2a2e36', 8);
        if (t < tf) s += toast(x - 60, 1150, 0) + toast(x + 60, 1150, 0);
        else { s += toast(x - 60 - d * 30, y + (y <= 400 ? 0 : 0), y <= 400 ? 8 : d * 300) + toast(x + 60 + d * 30, y, y <= 400 ? -10 : -d * 300); if (y <= 400) s += debris(t, tf + i * 0.05 + 0.15, x, 400, { n: 10, col: '#f8f4ec', spread: 500, seed: 40 + i, size: 18 }); }
      }
      if (t > tf) s += speedLines(t, { a: 0.3, vertical: true, dir: -1, seed: 7 });
      s += hit(540, 820, 'TOAST: FIRED', pop(seg(t, tf, tf + 0.1)) * (1 - seg(t, T.ceiling11 - 0.1, T.ceiling11)), '#ff7a1a', -6, 120);
      s += stamp(540, 820, 'CEILING TOAST.', seg(t, T.ceiling11 - 0.05, T.ceiling11 + 0.1), '#ff2a3a', 5, 90);
      s += flash(t, T.toasters - 0.06, 0.5) + flash(t, tf, 0.7) + flash(t, tf + 0.15, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.toasters, tf, tf + 0.15, T.ceiling11], 0.1), z1: 1.03, oy: 900 }), shake(t, [tf, tf + 0.15, tf + 0.25], 32)) + pill('TOASTERS');
    }],
    // 11d you get launched into the neighbor's pool. alive.
    [T.you11 - 0.06, (t) => {
      const tl = T.launched - 0.05, tp = T.pool - 0.05;
      let s = yard() + rect(640, 1500, 440, 420, '#2fa8e0') + rect(640, 1500, 440, 30, '#f4f4f4');
      s += g(tramp(t, true, 0, t > tl ? -30 : 0, 0), 'translate(-125 400) scale(0.75)');
      const k = Math.pow(seg(t, tl, tp), 0.45), x = lerp(280, 860, k), y = t < tl ? 1700 : t < tp ? lerp(1700, 1640, k) - 1050 * Math.sin(Math.PI * k) : 1660;
      if (t < tp) s += fig(t < tl ? 280 : x, y, 3.4, '#3c4350', t > tl ? k * 360 : 0, true);
      else { s += g(circ(0, -40, 22, '#e8b894') + `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="#3c4350" stroke-width="12" stroke-linecap="round"/>`, `translate(860 ${1680 + Math.sin(t * 6) * 8}) scale(3.4)`); s += rect(640, 1660, 440, 260, '#2fa8e0', 0, 'opacity="0.85"'); s += debris(t, tp, 860, 1600, { n: 30, col: '#bfe8ff', spread: 1000, seed: 14, size: 22 }); }
      if (t > tl && t < tp) s += speedLines(t, { a: 0.3, seed: 3 });
      s += hit(540, 400, 'LAUNCHED.', pop(seg(t, tl, tl + 0.1)) * (1 - seg(t, tp - 0.1, tp)), '#ffcf3a', -6, 170);
      s += hit(540, 400, 'SPLASH!', pop(seg(t, tp, tp + 0.1)) * (1 - seg(t, T.alive - 0.1, T.alive)), '#2f6fd6', 6, 220);
      s += stamp(540, 400, 'ALIVE.', seg(t, T.alive - 0.05, T.alive + 0.1), '#2fae6a', -6, 160);
      s += flash(t, T.you11 - 0.04, 0.5) + flash(t, tl, 0.6) + flash(t, tp, 0.9, '#d8f4ff') + flash(t, T.alive, 0.5, '#c8ffd8');
      return g(cam(fin(s), 0, { z0: punch(t, [tl, tp, T.alive], 0.12), z1: 1.03, oy: 1300 }), shake(t, [tl, tp, tp + 0.15], 36)) + pill('ALIVE');
    }],
    // 12 boss in the ceiling
    [C[6], (t) => {
      const FL = 1800; let s = vgrad('#f4f6fa', '#dfe6f0', 0, FL) + rect(0, FL, 1080, 120, '#8a94a4');
      for (let i = 0; i < 7; i++) s += rect(i * 160, 0, 156, 440, '#f8f8f4', 0, 'stroke="#d0d0c8" stroke-width="6"');
      s += rect(0, 440, 1080, 16, '#c8c8c0');
      // hole + dangling legs + tie tip
      const sw = Math.sin(t * 5) * 10;
      s += `<path d="M380,456 L420,420 L470,456 L520,410 L590,456 L650,416 L700,456Z" fill="#2a2e36"/>`;
      s += g(rect(-60, 0, 120, 120, '#2a2e36', 10) + `<path d="M-30,110 L-50,420 M30,110 L50,420" stroke="#2a2e36" stroke-width="36" stroke-linecap="round"/>` + rect(-80, 400, 60, 30, '#141618', 10) + rect(20, 400, 60, 30, '#141618', 10), `translate(540 440) rotate(${sw.toFixed(1)} 0 0)`);
      // empty chair below with long extended spring
      s += coil(540, FL - 30, FL - 30 - 1150, 40, 14, '#c8ccd4', 8) + rect(460, 1130, 160, 30, '#1a1c22', 10) + rect(450, FL - 30, 180, 20, '#2a2e36', 8);
      s += rect(60, 1340, 320, 30, '#c8a070', 6) + rect(70, 1370, 300, FL - 1370, '#b08a5a', 4) + rect(700, 1340, 320, 30, '#c8a070', 6) + rect(710, 1370, 300, FL - 1370, '#b08a5a', 4);
      s += debris(t, C[6] + Math.floor((t - C[6]) / 0.7) * 0.7, 540, 460, { n: 16, col: '#f8f8f4', spread: 500, seed: 18, size: 22 });
      s += chip(540, 1480, 'YOUR BOSS?', pop(seg(t, T.boss12 - 0.1, T.boss12 + 0.05)) * (1 - seg(t, T.shot - 0.1, T.shot)), { size: 60, col: '#fff', bg: '#141a22' });
      s += chip(540, 1480, 'IN THE CEILING.', pop(seg(t, T.shot - 0.05, T.shot + 0.1)) * (1 - seg(t, T.best - 0.1, T.best)), { size: 60, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 1480, 'BEST FRIDAY EVER', seg(t, T.best - 0.05, T.best + 0.1), '#2fae6a', -6, 80);
      s += flash(t, C[6], 0.7) + flash(t, T.best - 0.05, 0.4, '#c8ffd8');
      return g(cam(fin(s), 0, { z0: punch(t, [C[6], T.shot, T.ceiling12, T.best], 0.1), z1: 1.04, oy: 900 }), shake(t, [C[6], T.ceiling12], 30)) + pill('THE BOSS');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['MIRRORS?', 'STAIRS?', 'DOORS?', 'SALT?', 'ZIPPERS?', 'THE MOON?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      for (let j = 0; j < 9; j++) { const h = 120 + 300 * Math.abs(Math.sin(t * (8 + j % 5) + j)); s += coil(70 + j * 117, 1900, h, 70, 7, '#ffd0d6', 10); }
      s += bigText(540, 520, 'WHAT', 1, { size: 150 }) + bigText(540, 700, 'VANISHES', 1, { size: 150, col: '#ffcf6a' }) + bigText(540, 880, 'NEXT?', 1, { size: 170 });
      s += bigText(540, 1500, opts[i], 1, { size: 110, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
