// "What if every cable and rope on Earth vanished for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { vgrad, grade, t2, runShots } from './lib2.js';
import { pop, chip, shake, flash, punch, bigText, stamp, speedLines, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const FANC = ['#c8102e', '#2f6fd6', '#ffcf3a', '#2fae6a', '#ff7a1a', '#a64ad6'];
const ROPE = '#d8b26a';
// small faceless figure (origin ~ hips)
const fig = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : `<path d="M-18,0 L-30,40 M18,0 L30,40" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
// figure leaning back pulling (arms forward)
const puller = (x, y, s, col, lean, dir) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + `<path d="M0,-6 L${dir * 60},-4" stroke="${col}" stroke-width="12" stroke-linecap="round"/><path d="M-12,36 L-26,90 M12,36 L22,90" stroke="#2a2e36" stroke-width="13" stroke-linecap="round"/>`, `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${lean.toFixed(0)} 0 90) scale(${s})`);
const line = (x1, y1, x2, y2, col = ROPE, w = 8, extra = '') => `<path d="M${x1.toFixed(0)},${y1.toFixed(0)} L${x2.toFixed(0)},${y2.toFixed(0)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const sag = (x1, y1, x2, y2, s, col = '#2a2e36', w = 6) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + s} ${x2},${y2}" stroke="${col}" stroke-width="${w}" fill="none"/>`;
const car = (x, y, col, rot = 0, s = 1, shine = 0) => g(rect(-230, -110, 460, 110, col, 34) + `<path d="M-150,-110 L-90,-200 L110,-200 L170,-110Z" fill="${col}"/>` + `<path d="M-130,-116 L-82,-186 L0,-186 L0,-116Z M14,-116 L14,-186 L100,-186 L150,-116Z" fill="#1a2230"/>` + rect(205, -90, 26, 22, '#ffe9a8', 6) + rect(-228, -88, 22, 20, '#ff3b3b', 6) + [-140, 140].map((dx) => circ(dx, 0, 52, '#141618') + circ(dx, 0, 26, '#b8c0cc')).join('') + (shine > 0 ? rect(-200, -100, 380, 22, '#ffffff', 10, `opacity="${(0.5 * shine).toFixed(2)}"`) : ''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const towTruck = (x, y, rot = 0, s = 1) => g(rect(-260, -120, 300, 120, '#ffb81a', 20) + rect(40, -230, 200, 230, '#ffb81a', 26) + rect(80, -210, 130, 90, '#1a2230', 10) + rect(40, -250, 200, 26, '#c8102e', 10) + `<path d="M-240,-120 L-330,-260" stroke="#3a3f4a" stroke-width="22" stroke-linecap="round"/>` + t2(-110, -45, 'TOW', 52, '#1a2230', { weight: 900 }) + [-170, 150].map((dx) => circ(dx, 0, 56, '#141618') + circ(dx, 0, 26, '#b8c0cc')).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const piano = (x, y, rot = 0, s = 1) => g(`<path d="M-200,-60 L200,-60 Q240,-60 230,-10 Q200,60 60,70 Q-40,80 -120,40 L-200,30Z" fill="#111317"/>` + `<path d="M-200,-60 L190,-200 L210,-180 L200,-60Z" fill="#1d2027"/>` + rect(-200, -20, 140, 36, '#f4f4f0', 4) + [...Array(9)].map((_, i) => rect(-192 + i * 15, -20, 8, 20, '#111317')).join('') + rect(-180, 40, 20, 120, '#111317', 6) + rect(150, 40, 20, 110, '#111317', 6) + rect(0, 60, 20, 110, '#111317', 6) + rect(-120, -40, 300, 10, '#ffffff', 5, 'opacity="0.25"'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`);
const chair = (x, y, rot, col, rider) => g(rect(-60, -10, 120, 22, '#2a2e36', 8) + rect(-60, -70, 16, 70, '#2a2e36', 6) + (rider ? fig(-5, -40, 1.2, col, 0, true) : ''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})`);
const splashDrops = (t, t0, x, y, { n = 30, col = '#8ad0ff', seed = 41, v0 = 1200, floor = 2400 } = {}) => { const d = t - t0; if (d < 0 || d > 1.6) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const a = -Math.PI * (0.12 + 0.76 * r()), v = v0 * (0.4 + 0.6 * r()); const px = x + Math.cos(a) * v * d, py = y + Math.sin(a) * v * d + 1800 * d * d; if (py < floor) s += circ(px, py, 10 + r() * 18, col, `opacity="${Math.max(0, 0.95 - d * 0.5).toFixed(2)}"`); } return s; };
const rings = (t, t0, x, y, col = '#ffffff') => { const d = t - t0; if (d < 0 || d > 0.5) return ''; return [0, 0.1].map((o) => { const k = clamp((d - o) / 0.4); return k > 0 ? `<ellipse cx="${x}" cy="${y}" rx="${(60 + 300 * k).toFixed(0)}" ry="${(14 + 60 * k).toFixed(0)}" fill="none" stroke="${col}" stroke-width="${(12 * (1 - k)).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>` : ''; }).join(''); };
// rope dissolving into sparks (vanish effect) along a segment
const vanish = (t, t0, x1, y1, x2, y2, col = '#ffe08a', seed = 3) => { const d = t - t0; if (d < 0 || d > 0.7) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < 26; i++) { const k = r(), px = lerp(x1, x2, k) + (r() - 0.5) * 300 * d, py = lerp(y1, y2, k) + (r() - 0.5) * 300 * d + 300 * d * d; s += rect(px - 6, py - 3, 16, 6, col, 3, `opacity="${(1 - d / 0.7).toFixed(2)}" transform="rotate(${(r() * 180).toFixed(0)} ${px.toFixed(0)} ${py.toFixed(0)})"`); } return s; };
const mountains = (top = '#4aa0f0', bot = '#cfe8fc', H = 1300) => vgrad(top, bot, 0, H) + `<path d="M-100,${H} L200,520 L420,900 L640,380 L900,860 L1180,560 L1180,${H}Z" fill="#7a8aa8"/><path d="M200,520 L260,620 L170,640Z M640,380 L720,520 L580,540Z M1180,560 L1100,680 L1180,700Z" fill="#ffffff"/>`;

export async function init() {
  const W = await (await fetch('/work/cables5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), zip: wt('zip', 0), vanished: wt('vanished', 0), every: wt('every', 0), cable: wt('cable', 0), rope: wt('rope', 0), gone: wt('gone', 0), five: wt('five', 0),
    splash: wt('splash', 2), lake: wt('lake', 2), every2: wt('every', 2), drops: wt('drops', 2), chairs: wt('chairs', 2), face: wt('face', 2), snow: wt('snow', 2),
    tow: wt('tow', 4), hill: wt('hill', 4), was: wt('was', 4), rolls: wt('rolls', 4), straight: wt('straight', 4), wash: wt('wash', 4),
    tug: wt('tug', 6), rope6: wt('rope', 6), vanishes: wt('vanishes', 6), slam: wt('slam', 6), mud: wt('mud', 6), nobody: wt('nobody', 6), wins: wt('wins', 6),
    crane: wt('crane', 8), piano: wt('piano', 8), half: wt('half', 8), twenty: wt('twenty', 8), street: wt('streets', 8), empty: wt('empty', 8), boom: wt('boom', 8),
    stadium: wt('stadium', 10), steel: wt('steel', 10), cables10: wt('cables', 10), jumps: wt('jumps', 10), crash: wt('crash', 10),
    back: wt('back', 11), alive: wt('alive', 11), wet: wt('wet', 11), muddy: wt('muddy', 11), furious: wt('furious', 11), piano11: wt('piano', 11), not: wt('not', 11), much: wt('much', 11),
    next: wt('next', 12), worse: wt('worse', 12),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  // countdown card: a thick rope snapping across the card
  const card = (n) => (t) => {
    const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n });
    const d = t - t0, gap = Math.min(260, d * 1400);
    s += line(-40, 1560, 540 - gap, 1560 + d * 400, ROPE, 34) + line(540 + gap, 1560 + d * 400, 1120, 1560, ROPE, 34) + vanish(t, t0, 380, 1560, 700, 1560, '#ffe08a', n);
    s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320 - 0, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 });
    s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t);
  };

  const shots = [
    // 0 hook: you on a zip line over a lake; the line vanishes
    [0, (t) => {
      const LK = 1500; let s = mountains('#3a90ec', '#cfe6fb', LK) + rect(0, LK, 1080, 420, '#2f7fd0') + [...Array(6)].map((_, i) => rect(((i * 230 + t * 60) % 1300) - 150, LK + 60 + i * 55, 160, 8, '#8ad0ff', 4, 'opacity="0.6"')).join('');
      // anchor towers
      s += rect(30, 300, 30, 900, '#5a4028') + rect(1010, 900, 30, 700, '#5a4028');
      const tv = T.vanished - 0.05, on = t < tv;
      const P = (k) => [lerp(45, 1025, k), lerp(320, 920, k)];
      const [hx, hy] = P(clamp(0.22 + Math.min(t, tv) * 0.1));
      if (on) s += line(45, 320, 1025, 920, '#2a2e36', 10);
      s += vanish(t, tv, 45, 320, 1025, 920, '#ffe08a', 7) + vanish(t, tv + 0.05, 45, 320, 1025, 920, '#ffffff', 8);
      // other ropes in the scene: a flag line and a boat mooring
      if (on) s += line(1025, 920, 1025, 640, '#2a2e36', 6) + `<path d="M1025,650 L900,690 L1025,730Z" fill="#c8102e"/>`;
      else { const d = t - tv; s += `<path d="M${1025 - d * 600},${650 - d * 200} l-125,40 l125,40Z" fill="#c8102e" transform="rotate(${(d * 300).toFixed(0)} ${1025 - d * 600} ${690 - d * 200})"/>`; }
      // you hanging (arms up on trolley), then falling
      let yy = hy + 90, rot = Math.sin(t * 9) * 6;
      if (!on) { const d = t - tv; yy = hy + 90 + (d < 0.35 ? -20 * Math.sin(d * 9) : 900 * (d - 0.35) * (d - 0.35) + 120 * (d - 0.35)); rot = d * 60; yy = Math.min(yy, 980) + (yy > 980 ? Math.sin(t * 30) * 8 : 0); }
      if (on) s += rect(hx - 30, hy - 14, 60, 28, '#3a3f4a', 8) + line(hx - 18, hy, hx - 30, hy + 40, '#3a3f4a', 6) + line(hx + 18, hy, hx + 30, hy + 40, '#3a3f4a', 6);
      s += fig(hx, yy, 2.6, '#3c4350', rot, true);
      if (on) s += speedLines(t, { a: 0.3, seed: 2 }); else s += speedLines(t, { a: 0.3, vertical: true, dir: -1, seed: 5 });
      s += hit(540, 1560, 'BAD NEWS.', pop(seg(t, T.news - 0.25, T.news)) * (1 - seg(t, T.zip - 0.05, T.zip + 0.05)), '#ff2a3a', -6, 150);
      s += chip(540, 1560, 'YOUR ZIP LINE', pop(seg(t, T.zip - 0.05, T.zip + 0.1)) * (1 - seg(t, tv - 0.1, tv)), { size: 54, col: '#fff', bg: '#141a22' });
      s += stamp(540, 620, 'GONE.', seg(t, tv, tv + 0.12) * (1 - seg(t, T.every - 0.1, T.every)), '#ff2a3a', -6, 130);
      s += stamp(540, 560, 'EVERY CABLE', seg(t, T.cable - 0.15, T.cable + 0.05), '#ffffff', -4, 80) + stamp(540, 720, '+ EVERY ROPE', seg(t, T.rope - 0.15, T.rope + 0.05), '#ffcf3a', 4, 70);
      s += hit(540, 900, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), '#ff2a3a', -4, 130);
      s += flash(t, tv, 0.9) + flash(t, T.cable - 0.1, 0.4) + flash(t, T.five - 0.1, 0.5, '#ff2a3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [0.05, T.news, tv, T.cable, T.rope, T.five], 0.1), z1: 1, oy: 900 }), shake(t, [0.05, tv, T.gone, T.five], 30)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 splash into the lake, then ski lift chairs drop into the snow
    [C[0], (t) => {
      const sw = t >= T.every2 - 0.1; let s = '';
      if (!sw) {
        const LK = 1350; s += mountains('#3a90ec', '#cfe6fb', LK) + rect(0, LK, 1080, 570, '#2f7fd0');
        const ts = T.splash - 0.02, d = t - C[0];
        if (t < ts) s += fig(540, lerp(500, LK, seg(t, C[0], ts)), 2.6, '#3c4350', 160, true) + speedLines(t, { a: 0.3, vertical: true, dir: -1, seed: 3 });
        else { s += `<path d="M300,${LK} Q540,${LK - 1100 * Math.exp(-(t - ts) * 1.5)} 780,${LK}Z" fill="#cdeeff" opacity="0.9"/>` + splashDrops(t, ts, 540, LK, { n: 60, v0: 2000 }) + splashDrops(t, ts + 0.3, 540, LK, { n: 30, v0: 1400, seed: 7 }) + rings(t, ts, 540, LK + 20, '#ffffff') + rings(t, ts + 0.25, 540, LK + 20, '#ffffff'); }
        s += hit(540, 600, 'SPLASH.', pop(seg(t, ts - 0.05, ts + 0.08)), '#2f6fd6', -6, 200);
        s += flash(t, C[0] + 0.02, 0.5) + flash(t, ts, 0.8, '#cdeeff');
        void d;
        return g(cam(fin(s), 0, { z0: punch(t, [ts, T.lake], 0.12), z1: 1, oy: 1300 }), shake(t, [ts, T.lake], 36)) + bar(t) + pill('SECOND 1');
      }
      // snowy slope with lift towers; chairs drop
      s += vgrad('#5aa8f0', '#e6f2fc', 0, 1920) + `<path d="M-50,1920 L-50,1560 L1130,1000 L1130,1920Z" fill="#f4f8fc"/><path d="M-50,1600 L1130,1040" stroke="#dfe8f2" stroke-width="30" fill="none"/>`;
      const G = (x) => 1580 - 0.475 * (x + 50);
      for (let i = 0; i < 2; i++) { const x = 300 + i * 560, y = G(x); s += rect(x - 14, y - 760, 28, 760, '#3a3f4a') + rect(x - 70, y - 770, 140, 22, '#3a3f4a', 6); }
      const td = T.every2 - 0.1, CY = (x) => G(x) - 700;
      if (t < td) s += line(-50, CY(-50), 1130, CY(1130), '#2a2e36', 8);
      for (let i = 0; i < 4; i++) {
        const x = 160 + i * 250, y0 = CY(x) + 150, ground = G(x) - 10;
        const t0 = td + [0, 0.35, 0.8, 1.3][i], dd = Math.max(0, t - t0), y = Math.min(ground, y0 + 1500 * dd * dd + 150 * dd);
        if (t < td) s += line(x, CY(x), x, y0 - 10, '#2a2e36', 6);
        if (y < ground) s += g(chair(0, 0, dd * 90 * (i % 2 ? 1 : -1), FANC[i % 6], true), `translate(${x} ${y.toFixed(0)}) scale(1.6)`);
        else {
          s += g(`<path d="M-30,0 L-20,-90 M10,0 L24,-86" stroke="#2a2e36" stroke-width="16" stroke-linecap="round"/>` + rect(-36, -104, 30, 16, FANC[i % 6], 6) + rect(10, -100, 30, 16, FANC[i % 6], 6), `translate(${x} ${ground + 20}) scale(1.6) rotate(${(Math.sin((t - t0) * 12 + i) * 8).toFixed(0)})`);
          const tl = t0 + (Math.sqrt(150 * 150 + 4 * 1500 * (ground - y0)) - 150) / 3000;
          s += debris(t, tl, x, ground, { n: 16, col: '#ffffff', seed: 20 + i, size: 26, spread: 600 }) + rings(t, tl, x, ground, '#b8d8f0');
        }
      }
      s += vanish(t, td, -50, CY(-50), 1130, CY(1130), '#ffe08a', 11);
      s += chip(540, 560, 'SKI LIFT', pop(seg(t, td, td + 0.1)) * (1 - seg(t, T.face - 0.15, T.face - 0.05)), { size: 56, col: '#fff', bg: '#141a22' });
      s += stamp(540, 580, 'FACE FIRST', seg(t, T.face - 0.05, T.face + 0.12), '#ff2a3a', -6, 96);
      s += flash(t, td, 0.6) + flash(t, T.face - 0.05, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [td, T.drops, T.chairs, T.face, T.snow], 0.1), z1: 1.03, oy: 1100 }), shake(t, [T.chairs, T.face, T.snow], 30)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 tow truck on a hill; rope gone; car rolls back through a car wash
    [C[1], (t) => {
      const slope = -0.42, Y = (x) => 1560 + (x - 0) * slope; // road rises to the right
      let s = vgrad('#3a90ec', '#cfe6fb', 0, 1920) + `<path d="M-50,${Y(-50) + 40} L1130,${Y(1130) + 40} L1130,1920 L-50,1920Z" fill="#6a9a5a"/>` + `<path d="M-50,${Y(-50)} L1130,${Y(1130)} L1130,${Y(1130) + 60} L-50,${Y(-50) + 60}Z" fill="#4a4e54"/>`;
      const ang = Math.atan(slope) * 180 / Math.PI;
      // car wash at bottom left
      const cw = (front) => front ? rect(-40, Y(150) - 330, 300, 60, '#2f6fd6', 10) + t2(110, Y(150) - 290, 'CAR WASH', 40, '#ffffff', { weight: 900 }) : rect(-40, Y(150) - 280, 300, 300, '#cfe2f4') + [0, 1, 2].map((i) => rect(-20 + i * 95, Y(150) - 270, 40, 260, ['#ff6aa0', '#2fd6c8', '#ffcf3a'][i], 20, 'opacity="0.8"')).join('');
      s += cw(false);
      const tv = T.was - 0.05;
      const ux = 640 + Math.min(t - C[1], tv - C[1]) * 40; // pulling uphill slowly
      let cx = ux - 520;
      if (t > tv) { const d = t - tv; cx = ux - 520 - (300 * d * d + 120 * d); }
      const truckX = ux + (t > tv ? (t - tv) * 260 : 0);
      s += towTruck(truckX, Y(truckX) - 4, ang, 0.9);
      if (t <= tv) s += line(truckX - 300, Y(truckX) - 230, cx + 200, Y(cx) - 60, ROPE, 8);
      s += vanish(t, tv, truckX - 300, Y(truckX) - 230, cx + 200, Y(cx) - 60, '#ffe08a', 4);
      const inWash = cx < 260 && cx > -300;
      const kOut = seg(t, T.wash, T.wash + 0.6);
      cx = Math.max(cx, 110); s += car(cx, Y(cx) - 4, '#c8102e', ang, 0.85, kOut);
      if (t > tv) s += speedLines(t, { a: 0.3, dir: -1, seed: 6 });
      s += cw(true);
      if (inWash || t > T.straight) { const r = rng(5); for (let i = 0; i < 30; i++) { const d = t - T.straight + 0.2; if (d < 0) break; const px = 110 + (r() - 0.5) * 500 * Math.min(1, d * 2), py = Y(150) - 150 + (r() - 0.5) * 400 * Math.min(1, d * 2) - d * 80; s += circ(px, py, 14 + r() * 26, '#ffffff', `opacity="${Math.max(0, 0.9 - d * 0.3).toFixed(2)}" stroke="#bfe6ff" stroke-width="3"`); } }
      s += chip(540, 580, 'TOW ROPE', pop(seg(t, T.tow - 0.05, T.tow + 0.1)) * (1 - seg(t, tv - 0.1, tv)), { size: 56, col: '#fff', bg: '#141a22' });
      s += stamp(540, 580, 'WAS PULLING.', seg(t, tv, tv + 0.12) * (1 - seg(t, T.straight - 0.1, T.straight)), '#ff2a3a', -6, 84);
      s += hit(540, 600, 'FREE WASH.', pop(seg(t, T.wash - 0.05, T.wash + 0.1)), '#2f6fd6', -6, 140);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, tv, 0.8) + flash(t, T.straight, 0.4, '#cdeeff');
      return g(cam(fin(s), 0, { z0: punch(t, [tv, T.rolls, T.straight, T.wash], 0.1), z1: 1.04, oy: 1300 }), shake(t, [tv, T.rolls, T.straight + 0.15], 30)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 tug of war final: rope vanishes, both teams slam into the mud
    [C[2], (t) => {
      const FL = 1640; let s = vgrad('#3a90ec', '#d8ecfc', 0, 1100) + rect(0, 1100, 1080, 820, '#6aa04a') + [...Array(8)].map((_, i) => rect(i * 140, 980 - (i % 2) * 40, 120, 140, FANC[i % 6], 8, 'opacity="0.55"')).join('');
      s += `<ellipse cx="540" cy="${FL + 30}" rx="230" ry="60" fill="#6a4a2a"/>` + t2(540, 1060, 'FINAL', 64, '#ffffff', { weight: 900, ls: 12 });
      const tv = T.rope6 - 0.05, off = t >= tv, ts = T.slam - 0.05;
      const k = seg(t, tv, ts);
      for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
        const x0 = 540 + side * (160 + i * 110);
        if (!off) s += puller(x0 + Math.sin(t * 7 + i) * 6 * side, FL - 90, 1.7, side < 0 ? '#c8102e' : '#2f6fd6', side * 22, -side);
        else { const x = x0 + side * k * 110, y = FL - 90 - Math.sin(k * Math.PI) * 140 + (t > ts ? 50 : 0); s += puller(x, y, 1.7, side < 0 ? '#c8102e' : '#2f6fd6', side * lerp(22, 85, k), -side); }
      }
      if (!off) s += line(230, FL - 100, 850, FL - 100, ROPE, 14) + rect(530, FL - 120, 20, 40, '#c8102e', 4);
      s += vanish(t, tv, 230, FL - 100, 850, FL - 100, '#ffe08a', 9);
      if (t > ts) { s += debris(t, ts, 160, FL - 40, { n: 22, col: '#6a4a2a', seed: 4, size: 26, spread: 700 }) + debris(t, ts, 920, FL - 40, { n: 22, col: '#6a4a2a', seed: 5, size: 26, spread: 700 }); s += `<ellipse cx="160" cy="${FL + 10}" rx="200" ry="40" fill="#6a4a2a"/><ellipse cx="920" cy="${FL + 10}" rx="200" ry="40" fill="#6a4a2a"/>`; }
      s += chip(540, 580, 'TUG OF WAR', pop(seg(t, T.tug - 0.05, T.tug + 0.1)) * (1 - seg(t, tv - 0.1, tv)), { size: 56, col: '#fff', bg: '#141a22' });
      s += hit(540, 600, 'SPLAT.', pop(seg(t, ts, ts + 0.1)) * (1 - seg(t, T.nobody - 0.1, T.nobody)), '#6a4a2a', -6, 200);
      s += stamp(540, 600, 'NOBODY WINS', seg(t, T.nobody - 0.05, T.nobody + 0.12), '#ff2a3a', -6, 90);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, tv, 0.7) + flash(t, ts, 0.6, '#c8a070');
      return g(cam(fin(s), 0, { z0: punch(t, [tv, ts, T.mud, T.nobody], 0.1), z1: 1.03, oy: 1300 }), shake(t, [tv, ts, T.mud], 34)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 crane + grand piano, 20 floors up, empty street, BOOM
    [C[3], (t) => {
      const FL = 1760; let s = vgrad('#3a90ec', '#d8ecfc', 0, FL) + rect(0, FL, 1080, 160, '#7a7e86') + rect(0, FL, 1080, 14, '#c4c8ce');
      // building under construction on the right + crane
      s += rect(640, 520, 420, FL - 520, '#c9b8a0') + [...Array(9)].map((_, i) => rect(640, 520 + i * 140, 420, 10, '#8a7a60')).join('');
      s += rect(980, 200, 28, 330, '#ffb81a') + rect(240, 200, 820, 30, '#ffb81a') + `<path d="M980,200 L1000,140 L1020,200" fill="#ffb81a"/>`;
      const tf = T.street - 0.1, tb = T.boom - 0.06; const hx = 380;
      let py = 560, pr = Math.sin(t * 2) * 3;
      if (t > tf) { const k = seg(t, tf, tb); py = lerp(560, FL - 100, k * k); pr = k * 25; }
      if (t <= tf) s += line(hx, 230, hx, py - 200, '#2a2e36', 6) + line(hx, py - 200, hx - 180, py - 60, '#2a2e36', 4) + line(hx, py - 200, hx + 180, py - 60, '#2a2e36', 4);
      s += vanish(t, tf, hx, 230, hx, py - 200, '#ffe08a', 12);
      if (t < tb) s += piano(hx, py, pr, 1.05);
      if (t > tf && t < tb) s += speedLines(t, { a: 0.3, vertical: true, dir: -1, seed: 9 });
      if (t >= tb) { // wreck
        const d = t - tb; s += g(`<path d="M-220,0 L-160,-70 L-40,-40 L20,-110 L120,-50 L230,-80 L240,0Z" fill="#111317"/>` + rect(-120, -40, 120, 26, '#f4f4f0', 3, 'transform="rotate(-14)"'), `translate(${hx} ${FL + 6})`);
        const r = rng(8); for (let i = 0; i < 18; i++) { const a = -Math.PI * (0.1 + 0.8 * r()), v = 500 + r() * 900; const px = hx + Math.cos(a) * v * d, py2 = FL - 40 + Math.sin(a) * v * d + 1600 * d * d; if (py2 < FL + 10) s += rect(px, py2, i % 3 ? 14 : 30, i % 3 ? 50 : 30, i % 2 ? '#f4f4f0' : '#111317', 3, `transform="rotate(${(d * 700 * (r() - 0.5)).toFixed(0)} ${px.toFixed(0)} ${py2.toFixed(0)})"`); }
        s += debris(t, tb, hx, FL - 20, { n: 26, col: '#9a9ea6', seed: 3, size: 22 }) + rings(t, tb, hx, FL, '#ffffff');
      }
      s += chip(380, 860, 'HALF A TON', pop(seg(t, T.half - 0.05, T.half + 0.1)) * (1 - seg(t, tf - 0.1, tf)), { size: 50, col: '#fff', bg: '#141a22' });
      s += chip(380, 960 - 0, '20 FLOORS UP', pop(seg(t, T.twenty - 0.05, T.twenty + 0.1)) * (1 - seg(t, tf - 0.1, tf)), { size: 50, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 700, 'EMPTY STREET', seg(t, T.empty - 0.1, T.empty + 0.1) * (1 - seg(t, tb - 0.1, tb)), '#2fae6a', -5, 80);
      s += hit(540, 700, 'BOOM.', pop(seg(t, tb, tb + 0.1)), '#ff2a3a', -6, 260);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, tf, 0.5) + flash(t, tb, 0.95);
      return g(cam(fin(s), 0, { z0: punch(t, [T.half, T.twenty, tf, tb], 0.12), z1: 1.03, oy: 1100 }), shake(t, [tf, tb, tb + 0.2], 44, 6)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 stadium concert: light rig on steel cables; band jumps; crash
    [C[4], (t) => {
      const ST = 1480; let s = vgrad('#140a2a', '#3a1a5a', 0, 1920);
      // big lights beams
      for (let i = 0; i < 5; i++) { const x = 140 + i * 200, a = Math.sin(t * 2 + i) * 0.25; s += `<path d="M${x},560 L${x - 160 + a * 400},${ST} L${x + 160 + a * 400},${ST}Z" fill="${FANC[i]}" opacity="0.18"/>`; }
      s += rect(0, ST, 1080, 60, '#2a2e36') + rect(0, ST + 60, 1080, 380, '#1a1c22');
      // crowd silhouettes with raised arms
      for (let i = 0; i < 12; i++) s += fig(40 + i * 92, 1820 + (i % 2) * 30 + Math.sin(t * 8 + i) * 8, 1.6, '#0d0f14', 0, true);
      const tj = T.jumps - 0.08, tc = T.crash - 0.06, tf = tj - 0.1;
      // truss + rig
      let ry = 560; if (t > tf) { const k = seg(t, tf, tc); ry = lerp(560, ST - 70, k * k); }
      if (t <= tf) for (const x of [180, 540, 900]) s += line(x, 0, x, ry, '#c4c8ce', 5);
      s += vanish(t, tf, 540, 0, 540, 560, '#ffffff', 21);
      const rig = rect(60, -20, 960, 40, '#9aa0aa', 6) + [...Array(8)].map((_, i) => rect(90 + i * 120, 20, 50, 60, '#2a2e36', 8) + circ(115 + i * 120, 80, 18, '#fff7d0')).join('') + rect(40, 20, 120, 220, '#1a1c22', 10) + rect(920, 20, 120, 220, '#1a1c22', 10) + circ(100, 90, 34, '#3a3f4a') + circ(980, 90, 34, '#3a3f4a') + circ(100, 180, 24, '#3a3f4a') + circ(980, 180, 24, '#3a3f4a');
      if (t < tc + 0.05) s += g(rig, `translate(0 ${ry.toFixed(0)}) rotate(${(t > tf ? seg(t, tf, tc) * 4 : 0).toFixed(1)} 540 0)`);
      else { s += g(rig, `translate(0 ${ST - 60}) rotate(3 540 0)`); s += debris(t, tc, 540, ST - 40, { n: 30, col: '#fff7d0', seed: 6, size: 14, spread: 1100 }) + debris(t, tc, 300, ST - 40, { n: 18, col: '#9aa0aa', seed: 7, size: 24 }); }
      // band: drum kit + 3 figs; jump off at tj
      s += circ(540, ST - 60, 60, '#c8102e') + rect(470, ST - 110, 140, 16, '#c4c8ce', 6);
      for (let i = 0; i < 3; i++) { const x0 = [260, 540, 820][i], dir = [-1, 0, 1][i]; let x = x0, y = ST - 70, rot = 0; if (t > tj) { const d = t - tj; x = x0 + (dir || (i === 1 ? 0.6 : 0)) * 700 * d; y = ST - 70 - 600 * d + 1400 * d * d; rot = (dir || 1) * d * 300; } if (y < 2000) s += fig(x, y, 2, ['#ff7a1a', '#2fd6c8', '#ffcf3a'][i], rot, true); }
      if (t > tj) s += speedLines(t, { a: 0.25, seed: 4 });
      s += chip(540, 1060 - 460, 'STEEL CABLES', pop(seg(t, T.steel - 0.05, T.steel + 0.1)) * (1 - seg(t, tf - 0.1, tf)), { size: 54, col: '#fff', bg: '#141a22' });
      s += stamp(540, 600, 'BAND: JUMP!', seg(t, tj, tj + 0.12) * (1 - seg(t, tc - 0.1, tc)), '#ffcf3a', -6, 84);
      s += hit(540, 640, 'CRASH.', pop(seg(t, tc, tc + 0.1)), '#ff2a3a', -6, 230);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, tf, 0.5) + flash(t, tc, 0.95);
      return g(cam(fin(s, 0.3), 0, { z0: punch(t, [T.stadium, T.steel, tj, tc], 0.12), z1: 1.03, oy: 1100 }), shake(t, [tj, tc, tc + 0.2], 44, 6)) + bar(t) + pill('SECOND 5');
    }],
    // 11 cables are back: alive (lake + mud) ... the piano isn't
    [C[5], (t) => {
      const sw = t >= T.piano11 - 0.12; let s = '';
      if (!sw) {
        s += vgrad('#2fae6a', '#0c5a30') + speedLines(t, { a: 0.18, seed: 15 });
        // ropes snapping back in across the screen
        for (let i = 0; i < 4; i++) { const k = pop(seg(t, C[5] + i * 0.08, C[5] + i * 0.08 + 0.2)); s += line(-40, 420 + i * 110, -40 + 1160 * k, 420 + i * 110 + 40, ROPE, 18); }
        // you in the lake (left), tug teams in mud (right)
        s += rect(0, 1400, 540, 520, '#2f7fd0') + rect(540, 1400, 540, 520, '#6a4a2a') + rect(530, 1400, 20, 520, '#ffffff');
        s += fig(270, 1500 + Math.sin(t * 5) * 10, 2.4, '#3c4350', Math.sin(t * 4) * 10, true) + splashDrops(t, T.wet - 0.1, 270, 1420, { n: 14, v0: 700 });
        for (let i = 0; i < 4; i++) s += fig(640 + i * 110, 1520 + (i % 2) * 40, 1.6, i < 2 ? '#c8102e' : '#2f6fd6', 90 + i * 20, false);
        s += debris(t, T.muddy - 0.1, 810, 1480, { n: 16, col: '#4a3218', seed: 3, size: 20, spread: 600 });
        s += stamp(540, 820, 'CABLES: BACK', seg(t, C[5], C[5] + 0.15) * (1 - seg(t, T.alive - 0.15, T.alive - 0.05)), '#ffffff', -6, 90);
        s += stamp(540, 820, 'ALIVE.', seg(t, T.alive - 0.05, T.alive + 0.1), '#ffffff', 5, 150);
        s += t2(540, 980, t > T.furious ? 'WET. MUDDY. FURIOUS.' : t > T.muddy ? 'WET. MUDDY.' : t > T.wet ? 'WET.' : '', 64, '#ffcf3a', { weight: 900, extra: 'stroke="#0b0d12" stroke-width="5" paint-order="stroke"' });
        s += flash(t, C[5], 0.9, '#c8ffd8') + flash(t, T.alive - 0.05, 0.5);
        return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.alive, T.wet, T.muddy, T.furious], 0.1), z1: 1.02, oy: 1100 }), shake(t, [C[5], T.alive], 30)) + pill('CABLES: BACK');
      }
      // the piano wreck
      const FL = 1640; s += vgrad('#3a90ec', '#d8ecfc', 0, FL) + rect(0, FL, 1080, 280, '#7a7e86');
      s += g(`<path d="M-320,0 L-240,-110 L-60,-60 L30,-170 L180,-80 L330,-120 L350,0Z" fill="#111317"/>` + rect(-180, -70, 180, 36, '#f4f4f0', 4, 'transform="rotate(-14)"') + [...Array(6)].map((_, i) => rect(-170 + i * 24, -70, 10, 24, '#111317', 2, 'transform="rotate(-14)"')).join('') + `<path d="M120,-80 Q200,-260 300,-200" stroke="#c4a060" stroke-width="5" fill="none"/>`, `translate(540 ${FL + 10}) scale(1.4)`);
      for (let i = 0; i < 8; i++) s += rect(120 + i * 110, FL + 40 + (i % 3) * 30, i % 2 ? 18 : 36, i % 2 ? 60 : 30, i % 2 ? '#f4f4f0' : '#111317', 3, `transform="rotate(${i * 37} ${120 + i * 110} ${FL + 40})"`);
      s += chip(540, 640, 'THE PIANO?', pop(seg(t, T.piano11 - 0.1, T.piano11 + 0.05)) * (1 - seg(t, T.not - 0.1, T.not)), { size: 60, col: '#fff', bg: '#141a22' });
      s += stamp(540, 660, 'NOT SO MUCH.', seg(t, T.not - 0.05, T.not + 0.12), '#ff2a3a', -6, 96);
      s += flash(t, T.piano11 - 0.12, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.piano11, T.not, T.much], 0.12), z1: 1.04, oy: 1400 }), shake(t, [T.not], 30)) + pill('THE PIANO');
    }],
    // 12 CTA
    [C[6], (t) => {
      const opts = ['ZIPPERS?', 'STAIRS?', 'MIRRORS?', 'DOORS?', 'SALT?', 'THE SUN?'];
      const i = Math.floor((t - C[6]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      const d = t - C[6], gap = Math.min(300, d * 900);
      s += line(-40, 1720, 540 - gap, 1740, ROPE, 30) + line(540 + gap, 1740, 1120, 1720, ROPE, 30);
      s += bigText(540, 520, 'WHAT', 1, { size: 150 }) + bigText(540, 700, 'VANISHES', 1, { size: 160, col: '#ffcf6a' }) + bigText(540, 880, 'NEXT?', 1, { size: 170 });
      s += bigText(540, 1500, opts[i], 1, { size: 110, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[6], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[6], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
