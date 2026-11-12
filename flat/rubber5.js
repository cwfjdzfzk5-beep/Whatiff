// "What if all rubber vanished for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, crack, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const glitchA = (t, t0) => { const d = t - t0; if (d < 0) return 1; if (d > 0.35) return 0; return (Math.floor(d * 40) % 2) ? 0.15 : 0.8 - d * 2; };
const JUMPER = { ...YOU, top: '#ff7a1a', pants: '#1d2a4a' };
// upside-down person, feet (ankles) at (x,y), head below
const hang = (x, y, s, face, sway = 0) => g(adult({ ...JUMPER, x: 0, y: 0, s: 1, face, pose: 'up' }), `translate(${x} ${y}) rotate(${180 + sway}) scale(${s})`);
// sparks shower (bright streaks flying back & up, then falling)
function sparks(t, t0, x, y, { n = 30, dir = -1, spread = 900, seed = 3, len = 40 } = {}) {
  if (t < t0) return ''; const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const ph = r(), life = 0.35 + r() * 0.3, d = ((t - t0) + ph * life) % life;
    const vx = dir * spread * (0.4 + r() * 0.8), vy = -spread * (0.15 + r() * 0.5);
    const px = x + vx * d, py = y + vy * d + 1800 * d * d, ex = vx * 0.02 * len / 40, ey = (vy + 3600 * d) * 0.02 * len / 40;
    const c = ['#fff3a0', '#ffcf3a', '#ff8a1a'][i % 3];
    s += `<path d="M${px.toFixed(0)},${py.toFixed(0)} l${(-ex).toFixed(0)},${(-ey).toFixed(0)}" stroke="${c}" stroke-width="${(3 + r() * 4).toFixed(1)}" stroke-linecap="round" opacity="${(1 - d / life).toFixed(2)}"/>`;
  }
  return glow(x, y, 120, '#ffb03a', 0.55) + s;
}
const river = (y, t) => rect(0, y, 1080, 1920 - y + 40, '#1f7ab0') + [...Array(8)].map((_, i) => { const x = ((i * 170 + t * 120) % 1260) - 120; return rect(x, y + 30 + (i % 3) * 70, 120, 10, '#bfe6ff', 5, 'opacity="0.6"'); }).join('');
const bridge = (y) => rect(-20, y, 1120, 70, '#3a3f4a') + rect(-20, y + 70, 1120, 18, '#c8102e') + [...Array(12)].map((_, i) => `<path d="M${i * 100},${y} L${i * 100 + 50},${y - 110} L${i * 100 + 100},${y}" stroke="#c8102e" stroke-width="12" fill="none"/>`).join('') + rect(-20, y - 120, 1120, 14, '#c8102e');
const cord = (x0, y0, x1, y1, a = 1, wob = 0, t = 0) => a <= 0 ? '' : `<path d="M${x0},${y0} Q${x0 + Math.sin(t * 9) * wob},${(y0 + y1) / 2} ${x1},${y1}" stroke="#ffcf3a" stroke-width="14" fill="none" opacity="${a.toFixed(2)}"/><path d="M${x0},${y0} Q${x0 + Math.sin(t * 9) * wob},${(y0 + y1) / 2} ${x1},${y1}" stroke="#1d1f24" stroke-width="4" stroke-dasharray="18 14" fill="none" opacity="${(a * 0.6).toFixed(2)}"/>`;
// side-view car; tires (k=1 present) ; y = ground
const car = (x, y, col, s, kT, t) => {
  const drop = 22 * (1 - kT);
  const wheel = (wx) => g((kT > 0 ? circ(0, 0, 62, '#141618', `opacity="${kT.toFixed(2)}"`) : '') + circ(0, 0, 40, '#b8bec8') + circ(0, 0, 14, '#5a5e66') + rect(-4, -36, 8, 72, '#7a808a'), `translate(${wx} ${-62 + drop}) rotate(${(t * 1500) % 360})`);
  return g(g(rect(-230, -200, 460, 120, col, 30) + `<path d="M-140,-198 L-90,-280 L100,-280 L150,-198Z" fill="${col}"/>` + `<path d="M-122,-202 L-82,-268 L0,-268 L0,-202Z M12,-202 L12,-268 L92,-268 L132,-202Z" fill="#1a2230" opacity="0.85"/>` + rect(210, -180, 22, 18, '#ffe9a8', 4), `translate(0 ${drop})`) + wheel(-130) + wheel(130), `translate(${x} ${y}) scale(${s})`);
};
// airliner (side view), centre (x,y); gear wheels at y+260
const jet = (x, y, s, kT, tilt = 0) => g(
  `<path d="M-520,-110 L340,-110 Q520,-100 560,20 Q520,110 340,110 L-520,110 Q-640,60 -660,-110Z" fill="#f2f4f7"/>` +
  `<path d="M-580,-110 L-680,-380 L-470,-380 L-410,-110Z" fill="#2f6fd6"/>` + rect(-560, 20, 1060, 22, '#2f6fd6') +
  `<path d="M-120,50 L120,50 L-200,240 L-320,240Z" fill="#c8ccd4"/>` +
  [...Array(16)].map((_, i) => rect(-470 + i * 52, -50, 28, 40, '#1d2a4a', 12)).join('') + `<path d="M420,-70 L500,-70 Q530,-50 535,-10 L420,-10Z" fill="#1d2a4a"/>` +
  [[-40, 0], [380, 1]].map(([gx]) => rect(gx - 8, 100, 16, 150 - 26 * (1 - kT), '#7a808a') + g((kT > 0 ? circ(-34, 0, 44, '#141618', `opacity="${kT.toFixed(2)}"`) + circ(34, 0, 44, '#141618', `opacity="${kT.toFixed(2)}"`) : '') + circ(-34, 0, 24, '#b8bec8') + circ(34, 0, 24, '#b8bec8'), `translate(${gx} ${250 - 26 * (1 - kT) - 20 * (1 - kT)})`)).join(''),
  `translate(${x} ${y}) rotate(${tilt}) scale(${s})`);
const washer = (x, y, kS, t) => rect(x - 110, y - 290, 220, 290, '#f2f4f7', 16) + rect(x - 110, y - 290, 220, 50, '#d8dde4', 16) + circ(x + 70, y - 265, 10, '#2f6fd6') + circ(x, y - 130, 82, kS > 0 ? '#1d2a4a' : '#2a3a52', kS > 0 ? `stroke="#1d1f24" stroke-width="${(12 * kS).toFixed(1)}"` : '') + circ(x, y - 130, 62, '#5aa8f0', 'opacity="0.8"') + `<path d="M${x - 50},${y - 120} q25,${-20 + Math.sin(t * 12) * 10} 50,0 t50,0" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.6"/>`;
const balloon = (x, y, col, k = 1) => `<path d="M${x},${y + 92} q-12,90 10,180" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>` + (k > 0 ? g(`<ellipse cx="0" cy="0" rx="70" ry="86" fill="${col}"/><ellipse cx="-24" cy="-30" rx="14" ry="24" fill="#ffffff" opacity="0.45"/><path d="M-10,84 L10,84 L0,98Z" fill="${col}"/>`, `translate(${x} ${y}) scale(${k})`) : '');
const burst = (x, y, t, t0, col) => { const d = t - t0; if (d < 0 || d > 0.3) return ''; const k = d / 0.3; let s = ''; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; s += `<path d="M${(x + Math.cos(a) * 60 * k).toFixed(0)},${(y + Math.sin(a) * 60 * k).toFixed(0)} l${(Math.cos(a) * 70).toFixed(0)},${(Math.sin(a) * 70).toFixed(0)}" stroke="${col}" stroke-width="10" stroke-linecap="round" opacity="${(1 - k).toFixed(2)}"/>`; } return s; };

export async function init() {
  const W = await (await fetch('/work/rubber5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), jumped: wt('jumped', 0), bridge: wt('bridge', 0), rubber0: wt('rubber', 0), vanished: wt('vanished', 0), five: wt('five', 0),
    bungee: wt('bungee', 2), rubber2: wt('rubber', 2), scream: wt('scream', 2), long: wt('long', 2),
    car: wt('car', 4), drops: wt('drops', 4), rims: wt('rims', 4), sparks: wt('sparks', 4), stop: wt('stop', 4),
    jumbo: wt('jumbo', 6), lands: wt('lands', 6), tires: wt('tires', 6), gone6: wt('gone', 6), three: wt('three', 6), tons: wt('tons', 6), metal: wt('metal', 6),
    washing: wt('washing', 8), seal: wt('seal', 8), gone8: wt('gone', 8), basement: wt('basement', 8), pool: wt('pool', 8), great: wt('great', 8),
    balloon: wt('balloon', 10), pops: wt('pops', 10), once: wt('once', 10), birthday: wt('birthday', 10), war: wt('war', 10), movie: wt('movie', 10),
    back: wt('back', 11), snaps: wt('snaps', 11), tight: wt('tight', 11),
    inch: wt('inch', 12), river: wt('river', 12), alive: wt('alive', 12), pilot: wt('pilot', 12), pants: wt('pants', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 hook: bungee jump, cord vanishes
    [0, (t) => {
      const kV = seg(t, T.vanished - 0.05, T.vanished + 0.3), fall = Math.max(0, t - T.vanished);
      const by = 330 - Math.min(700, 900 * fall * fall) - 120 * seg(t, 0, T.vanished) ;
      let s = vgrad('#3a8ae0', '#cfe8fa') + speedLines(t, { a: 0.2 + 0.4 * kV, vertical: true, dir: -1, seed: 2 });
      s += rect(0, 1500, 1080, 420, '#2f8a4a') + river(1640 - 120 * kV * Math.min(1, fall), t);
      s += bridge(by);
      const fy = 980 + Math.sin(t * 5) * 30 * (1 - kV);
      s += cord(540, by + 70, 540, fy, glitchA(t, T.vanished - 0.05), 40, t);
      s += hang(540, fy, 0.95, t > T.vanished ? 'open' : 'neutral', Math.sin(t * 6) * 6);
      s += hit(540, 560, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)) * (1 - seg(t, T.jumped - 0.1, T.jumped)), '#ff2a3a', -5, 150);
      s += hit(540, 560, 'BUNGEE JUMP', pop(seg(t, T.jumped - 0.08, T.jumped + 0.1)) * (1 - seg(t, T.rubber0 - 0.1, T.rubber0)), '#2f6fd6', -5, 120);
      s += stamp(540, 600, 'RUBBER: GONE', seg(t, T.vanished - 0.08, T.vanished + 0.2), '#ff2a3a', -7, 76);
      s += chip(540, 790, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += debris(t, T.vanished, 540, 700, { n: 30, col: '#ffcf3a', spread: 900, seed: 4, size: 18 });
      s += flash(t, 0, 0.6) + flash(t, T.vanished - 0.05, 0.85);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.news, T.jumped, T.vanished], 0.11), z1: 1, oy: 1200 }), shake(t, [0.03, T.news, T.vanished], 34)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 free fall, cord gone, river rushing up
    [C[0], (t) => {
      const d = t - C[0];
      let s = vgrad('#5aa8f0', '#d8eefc') + speedLines(t, { a: 0.55, vertical: true, dir: -1, seed: 6, n: 34 });
      s += rect(0, 1560 - d * 60, 1080, 600, '#2f8a4a') + river(1680 - d * 50, t);
      s += `<path d="M540,${200} L540,${700}" stroke="#ffcf3a" stroke-width="14" opacity="0"/>`;
      s += hang(540, 960 + Math.sin(t * 14) * 10, 1.0, 'open', Math.sin(t * 17) * 10);
      s += chip(540, 540, 'BUNGEE CORD = RUBBER', pop(seg(t, T.rubber2 - 0.1, T.rubber2 + 0.1)), { size: 46, col: '#fff', bg: '#141a22' });
      s += hit(540, 760, 'AAAAAAH', pop(seg(t, T.scream - 0.25, T.scream - 0.05)), '#ff2a3a', -4, 150 + 20 * Math.sin(t * 30));
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, T.rubber2 - 0.05, 0.5) + flash(t, T.scream - 0.2, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.bungee, T.rubber2, T.scream - 0.2], 0.1), z1: 1, oy: 1100 }), shake(t, [T.rubber2, T.scream - 0.2], 28, 4)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 highway: cars drop onto rims, sparks
    [C[1], (t) => {
      const kT = 1 - seg(t, T.drops - 0.08, T.drops + 0.05);
      let s = vgrad('#6ab0f0', '#e2f0fa', 0, 1000) + rect(0, 1000, 1080, 920, '#5a5e66') + rect(0, 1000, 1080, 26, '#9a9ea6');
      for (let i = 0; i < 6; i++) { const x = ((i * 300 - t * 2600) % 1800 + 1800) % 1800 - 300; s += rect(x, 1430, 160, 16, '#ffffff', 4); }
      s += speedLines(t, { a: 0.35, dir: -1, seed: 10 });
      const cars = [[260, 1290, '#2f6fd6', 0.75], [800, 1290, '#ffcf3a', 0.75], [300, 1800, '#c8102e', 1.0], [860, 1800, '#2fae6a', 1.0]];
      for (const [x, y, c, sc] of cars) {
        const jx = x + Math.sin(t * 40 + x) * 6 * (1 - kT);
        s += car(jx, y, c, sc, kT, t);
        if (kT < 1) { s += sparks(t, T.drops, jx - 130 * sc, y - 5 * sc, { n: 22, seed: x, spread: 1000 * sc }) + sparks(t, T.drops + 0.03, jx + 130 * sc, y - 5 * sc, { n: 22, seed: x + 7, spread: 1000 * sc }); }
      }
      s += debris(t, T.drops, 540, 1700, { n: 40, col: '#141618', spread: 1300, seed: 11, size: 26 });
      s += hit(540, 560, 'ON THE RIMS', pop(seg(t, T.rims - 0.1, T.rims + 0.1)) * (1 - seg(t, T.sparks - 0.12, T.sparks - 0.02)), '#ff2a3a', -5, 120);
      s += stamp(540, 600, 'SPARKS', seg(t, T.sparks - 0.08, T.sparks + 0.2), '#ff8a1a', 5, 110);
      s += chip(540, 800, 'NOBODY CAN STOP', pop(seg(t, T.stop - 0.25, T.stop - 0.05)), { size: 50, col: '#fff', bg: '#c8102e' });
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, T.drops - 0.05, 0.7) + flash(t, T.sparks - 0.05, 0.5, '#ffcf3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.car, T.drops, T.rims, T.sparks, T.stop], 0.1), z1: 1, oy: 1400 }), shake(t, [T.drops, T.sparks, T.stop], 32, 5)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 jumbo jet lands on bare metal
    [C[2], (t) => {
      const kT = 1 - seg(t, T.gone6 - 0.1, T.gone6 + 0.05), land = seg(t, C[2], T.lands + 0.1);
      let s = vgrad('#ff9a4a', '#ffe0a8', 0, 1250) + rect(0, 1250, 1080, 670, '#4a4e56') + rect(0, 1250, 1080, 20, '#e8e8e0');
      for (let i = 0; i < 5; i++) { const x = ((i * 380 - t * 2200) % 1900 + 1900) % 1900 - 300; s += rect(x, 1720, 220, 24, '#f2f2ea', 4); }
      s += speedLines(t, { a: 0.3, dir: -1, seed: 14 });
      const jy = lerp(1100, 1430, L.easeOut(land)) + 24 * (1 - kT) + Math.sin(t * 50) * 6 * (1 - kT);
      s += jet(560, jy - 300, 0.95, kT, -4 * (1 - land) + 1.5 * (1 - kT));
      if (kT < 1) { s += sparks(t, T.gone6, 560 - 40 * 0.95, jy - 50, { n: 46, seed: 21, spread: 1500, len: 60 }) + sparks(t, T.gone6 + 0.04, 560 + 380 * 0.95, jy - 50, { n: 40, seed: 22, spread: 1500, len: 60 }); s += glow(400, jy - 80, 260, '#ffffff', 0.3 * (1 - kT)); }
      s += hit(540, 540, 'TIRES?', pop(seg(t, T.tires - 0.1, T.tires + 0.1)) * (1 - seg(t, T.gone6 - 0.12, T.gone6 - 0.02)), '#2f6fd6', -5, 140);
      s += stamp(540, 560, 'GONE', seg(t, T.gone6 - 0.08, T.gone6 + 0.2) * (1 - seg(t, T.three - 0.12, T.three - 0.02)), '#ff2a3a', -7, 130);
      s += hit(540, 560, '~300 TONS', pop(seg(t, T.three - 0.08, T.three + 0.12)), '#ff2a3a', -4, 140);
      s += chip(540, 780, 'BARE METAL', pop(seg(t, T.metal - 0.15, T.metal + 0.05)), { size: 54, col: '#fff', bg: '#141a22' });
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, T.gone6 - 0.05, 0.75) + flash(t, T.tons - 0.05, 0.5, '#ffcf3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.jumbo, T.lands, T.gone6, T.tons, T.metal], 0.1), z1: 1, oy: 1300 }), shake(t, [T.lands, T.gone6, T.tons, T.metal], 34, 5)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 washing machine seals gone, basement floods
    [C[3], (t) => {
      const kS = 1 - seg(t, T.gone8 - 0.1, T.gone8 + 0.05), d = Math.max(0, t - T.gone8);
      let s = vgrad('#cfd6de', '#9aa6b4', 0, 1500) + rect(0, 1500, 1080, 420, '#7a808a');
      s += rect(80, 520, 300, 120, '#6a7280', 10, 'opacity="0.5"');
      const wl = Math.max(1600, 1920 - d * 300);
      for (let i = 0; i < 3; i++) {
        const x = 170 + i * 250, y = 1640;
        s += washer(x + Math.sin(t * 60 + i) * 6, y, kS, t);
        if (kS < 1) { const len = Math.min(1, d * 4); s += `<path d="M${x},${y - 130} q${120 * len},${-40} ${220 * len},${200 * len}" stroke="#4aa0e8" stroke-width="${46 - i * 4}" fill="none" stroke-linecap="round" opacity="0.9"/>` + `<path d="M${x},${y - 130} q${120 * len},${-40} ${220 * len},${200 * len}" stroke="#bfe6ff" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.8"/>`; }
      }
      s += adult({ ...YOU, x: 920, y: 1960, s: 1.1, face: t > T.gone8 ? (t > T.great - 0.1 ? 'tense' : 'open') : 'neutral', pose: t > T.pool ? 'cross' : 'stand', tilt: t > T.gone8 && t < T.pool ? Math.sin(t * 20) * 5 : 0 });
      s += rect(0, wl, 1080, 1960 - wl, '#3a8ad0', 0, 'opacity="0.78"') + [...Array(6)].map((_, i) => rect(((i * 210 + t * 160) % 1200) - 100, wl + 8, 120, 10, '#d8f0ff', 5, 'opacity="0.8"')).join('');
      s += debris(t, T.gone8, 420, 1500, { n: 36, col: '#bfe6ff', spread: 1100, seed: 31, size: 18 });
      s += chip(540, 530, 'DOOR SEAL = RUBBER', pop(seg(t, T.seal - 0.1, T.seal + 0.1)), { size: 46, col: '#fff', bg: '#141a22' });
      s += stamp(540, 720, 'POOL', seg(t, T.pool - 0.1, T.pool + 0.15) * (1 - seg(t, T.great - 0.12, T.great - 0.02)), '#2f6fd6', -6, 130);
      s += hit(540, 720, 'GREAT.', pop(seg(t, T.great - 0.08, T.great + 0.1)), '#ff2a3a', 4, 150);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, T.gone8 - 0.05, 0.7) + flash(t, T.pool - 0.05, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.washing, T.gone8, T.pool, T.great], 0.1), z1: 1, oy: 1300 }), shake(t, [T.gone8, T.pool, T.great], 30)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 every latex balloon pops
    [C[4], (t) => {
      let s = vgrad('#ffd0e0', '#ffe8b8', 0, 1500) + rect(0, 1500, 1080, 420, '#c89a6a');
      s += `<path d="M60,470 Q540,560 1020,470" stroke="#c8102e" stroke-width="6" fill="none"/>` + [...Array(9)].map((_, i) => `<path d="M${110 + i * 105},${490 + Math.sin(i / 8 * Math.PI) * 60} l40,0 l-20,50Z" fill="${['#c8102e', '#ffcf3a', '#2f6fd6', '#2fae6a'][i % 4]}"/>`).join('');
      s += rect(240, 1420, 600, 30, '#8a5a3a', 8) + rect(270, 1450, 26, 420, '#8a5a3a') + rect(784, 1450, 26, 420, '#8a5a3a');
      s += rect(420, 1300, 240, 120, '#ffffff', 20) + rect(420, 1350, 240, 20, '#ff7aa8') + [...Array(5)].map((_, i) => rect(450 + i * 45, 1250, 10, 50, '#2f6fd6') + circ(455 + i * 45, 1242, 9, '#ffcf3a')).join('');
      const r = rng(41), cols = ['#c8102e', '#ffcf3a', '#2f6fd6', '#2fae6a', '#ff7aa8', '#9a4ae0'];
      for (let i = 0; i < 16; i++) {
        const x = 90 + (i % 6) * 180 + r() * 40, y = 720 + Math.floor(i / 6) * 230 + r() * 60 + Math.sin(t * 2 + i) * 10, c = cols[i % 6], tp = T.pops - 0.05 + r() * 0.35;
        s += balloon(x, y, c, t < tp ? 1 : 0) + burst(x, y, t, tp, c) + debris(t, tp, x, y, { n: 10, col: c, spread: 600, seed: 50 + i, size: 22 });
      }
      for (let i = 0; i < 4; i++) { const tp = T.pops + i * 0.12; s += hit([300, 780, 420, 700][i], [700, 900, 1100, 640][i], 'POP', pop(seg(t, tp, tp + 0.08)) * (1 - seg(t, tp + 0.35, tp + 0.5)), ['#c8102e', '#2f6fd6', '#ff8a1a', '#2fae6a'][i], (i % 2 ? 8 : -8), 150); }
      if (t > T.pops) { const d = t - T.pops, rr = rng(77); for (let i = 0; i < 40; i++) { const x = rr() * 1080, y = 600 + rr() * 500 + d * (120 + rr() * 200), c = cols[i % 6]; s += rect(x, y, 26, 14, c, 4, `transform="rotate(${((t * 200 + i * 40) % 360).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"`); } for (let i = 0; i < 7; i++) s += circ(120 + i * 140, 800 + (i % 3) * 160 - d * 30, 80 + d * 40, '#ffffff', `opacity="${Math.max(0, 0.45 - d * 0.12).toFixed(2)}"`); }
      s += bigText(540, 960, 'BANG', pop(seg(t, T.once - 0.08, T.once + 0.1)) * (1 - seg(t, T.war - 0.15, T.war - 0.05)), { size: 220, col: '#ff2a3a', stroke: '#ffffff', rot: 6 });
      s += t2(540, 1220, 'HAPPY BIRTHDAY', 64, '#c8102e', { weight: 900, ls: 6 });
      s += stamp(540, 600, 'WAR MOVIE', seg(t, T.war - 0.08, T.war + 0.2), '#141a22', -6, 100);
      s += chip(540, 530, 'EVERY LATEX BALLOON', pop(seg(t, T.balloon - 0.12, T.balloon + 0.08)) * (1 - seg(t, T.pops - 0.1, T.pops)), { size: 46, col: '#fff', bg: '#141a22' });
      for (let i = 0; i < 4; i++) s += flash(t, T.pops + i * 0.12, 0.5);
      s += flash(t, T.war - 0.05, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [T.pops, T.pops + 0.24, T.once, T.war], 0.1), z1: 1, oy: 1100 }), shake(t, [T.pops, T.pops + 0.12, T.pops + 0.24, T.once, T.war], 30)) + bar(t) + pill('SECOND 5');
    }],
    // 11 rubber back: cord snaps tight
    [C[5], (t) => {
      const kC = pop(seg(t, T.snaps - 0.15, T.snaps + 0.05)), d = Math.max(0, t - T.snaps);
      let s = vgrad('#3a8ae0', '#cfe8fa') + speedLines(t, { a: 0.5 * (1 - kC), vertical: true, dir: -1, seed: 13 });
      s += rect(0, 1520, 1080, 400, '#2f8a4a') + river(1600, t);
      const fy = 1000 - 140 * kC * Math.exp(-d * 3) * Math.abs(Math.cos(d * 9));
      s += cord(540, -40, 540, fy, seg(t, C[5], C[5] + 0.12), 0, t);
      s += hang(540, fy, 0.95, 'open', Math.sin(t * 9) * 8 * (1 - kC));
      s += stamp(540, 560, 'RUBBER: ON', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 80);
      s += hit(540, 790, 'SNAP', pop(seg(t, T.snaps - 0.08, T.snaps + 0.1)), '#2fae6a', -4, 200);
      s += flash(t, C[5], 0.95) + flash(t, T.snaps - 0.05, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.back, T.snaps, T.tight], 0.13), z1: 1, oy: 1200 }), shake(t, [C[5], T.snaps, T.tight], 44, 6)) + pill('RUBBER: BACK');
    }],
    // 12 one inch above the river; pilot alive
    [C[6], (t) => {
      if (t < T.pilot - 0.1) {
        let s = vgrad('#5aa8f0', '#d8eefc', 0, 1300) + rect(0, 1300, 1080, 300, '#2f8a4a') + river(1545, t);
        s += cord(540, -40, 540, 1000, 1, 6, t) + hang(540, 1000 + Math.sin(t * 3) * 6, 0.95, t > T.alive ? 'smile' : 'open', Math.sin(t * 2) * 4);
        s += chip(540, 540, '1 INCH', pop(seg(t, T.inch - 0.1, T.inch + 0.1)), { size: 60, col: '#fff', bg: '#c8102e' });
        s += chip(540, 740, 'ALIVE.', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 60, col: '#fff', bg: '#2fae6a' });
        s += flash(t, C[6], 0.6) + flash(t, T.alive - 0.05, 0.4, '#2fae6a', 0.2);
        return g(cam(fin(s), 0, { z0: punch(t, [T.inch, T.river, T.alive], 0.1), z1: 1, oy: 1400 }), shake(t, [C[6], T.alive], 18)) + pill('ALIVE');
      }
      let s = vgrad('#ff9a4a', '#ffe0a8', 0, 1250) + rect(0, 1250, 1080, 670, '#4a4e56') + rect(0, 1250, 1080, 20, '#e8e8e0');
      s += g(jet(0, 0, 1, 0, 0), 'translate(820 1060) scale(0.8)');
      for (let i = 0; i < 6; i++) s += circ(500 + i * 90 + Math.sin(t * 2 + i) * 20, 1300 - i * 50 - (t - T.pilot) * 40, 70 + i * 10, '#6a6e76', 'opacity="0.35"');
      s += adult({ ...CROWD[1], top: '#1d2a4a', pants: '#1d2a4a', hair: '#1d2a4a', hairStyle: 'cap', x: 330, y: 1960, s: 1.15, face: 'open', pose: 'stand', tilt: Math.sin(t * 25) * 3 });
      s += chip(540, 520, 'PILOT: ALIVE', pop(seg(t, T.pilot - 0.1, T.pilot + 0.1)), { size: 56, col: '#fff', bg: '#2fae6a' });
      s += stamp(540, 740, 'NEEDS NEW PANTS', seg(t, T.pants - 0.25, T.pants), '#c8102e', -5, 64);
      s += flash(t, T.pilot - 0.1, 0.6) + flash(t, T.pants - 0.2, 0.4, '#ffcf3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.pilot, T.pants - 0.2], 0.1), z1: 1, oy: 1300 }), shake(t, [T.pilot, T.pants - 0.2], 22)) + pill('ALIVE');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['COTTON?', 'SALT?', 'PAPER?', 'GOLD?', 'SILICON?', 'LEATHER?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'VANISHES', 1, { size: 150, col: '#ffcf6a' }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 130, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
