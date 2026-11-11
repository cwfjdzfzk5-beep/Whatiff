// "What if all aluminum vanished for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, crack, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const ALU = '#c9ced6';
const clouds = (t, v, seed = 1, a = 0.75) => { const r = rng(seed); let s = ''; for (let i = 0; i < 9; i++) { const x = r() * 1180 - 50, y0 = r() * 2400, w = 160 + r() * 220; const y = ((y0 - t * v * (0.6 + r())) % 2400 + 2400) % 2400 - 240; s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${w.toFixed(0)}" ry="${(w * 0.32).toFixed(0)}" fill="#ffffff" opacity="${a}"/>`; } return s; };
// seated passenger on a lone cushion (front view); feet at (x,y)
const cushion = (x, y, s, col = '#2f5ad6') => rect(x - 120 * s, y - 520 * s, 240 * s, 380 * s, col, 30 * s, 'opacity="0.9"');
const seated = (x, y, s, c, face, tilt = 0) => g(cushion(0, 0, 1, c.seat || '#2f5ad6') + adult({ ...c, x: 0, y: 0, s: 1, face, pose: 'sit' }) + rect(-160, -140, 320, 46, c.seat || '#2f5ad6', 16), `translate(${x} ${y}) rotate(${tilt}) scale(${s})`);
// side-view airliner fuselage, centre (x,y), length w
const plane = (x, y, w, a = 1) => a <= 0 ? '' : g(
  `<path d="M${-w / 2},${-120} L${w / 2 - 160},-120 Q${w / 2},-110 ${w / 2 + 30},20 Q${w / 2},120 ${w / 2 - 160},120 L${-w / 2},120 Q${-w / 2 - 120},60 ${-w / 2 - 140},-120Z" fill="${ALU}"/>` +
  `<path d="M${-w / 2 - 60},-120 L${-w / 2 - 160},-380 L${-w / 2 + 60},-380 L${-w / 2 + 120},-120Z" fill="#c8102e"/>` +
  `<path d="M${-w * 0.1},60 L${w * 0.12},60 L${-w * 0.2},330 L${-w * 0.32},330Z" fill="#aab0ba"/>` +
  rect(-w / 2, 30, w - 100, 22, '#c8102e') + [...Array(14)].map((_, i) => rect(-w / 2 + 40 + i * ((w - 200) / 14), -60, 34, 48, '#1d2a4a', 14)).join(''),
  `translate(${x} ${y})`, `opacity="${a.toFixed(3)}"`);
const glitchA = (t, t0) => { const d = t - t0; if (d < 0) return 1; if (d > 0.35) return 0; return (Math.floor(d * 40) % 2) ? 0.15 : 0.8 - d * 2; };
const can = (x, y, s, col) => rect(x - 22 * s, y - 70 * s, 44 * s, 90 * s, col, 8 * s) + rect(x - 22 * s, y - 70 * s, 44 * s, 12 * s, ALU, 4 * s);
const P = [
  { ...CROWD[0], seat: '#2f5ad6' }, { ...YOU, top: '#c8102e', seat: '#2f5ad6' }, { ...CROWD[3], seat: '#2f5ad6' }, { ...CROWD[2], seat: '#2f5ad6' },
];

export async function init() {
  const W = await (await fetch('/work/alu5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), plane0: wt('plane', 0), alu0: wt('aluminum', 0), vanished: wt('vanished', 0), five: wt('five', 0),
    mostly: wt('mostly', 2), alu2: wt('aluminum', 2), cushion: wt('cushion', 2), thirty: wt('thirty', 2), nothing: wt('nothing', 2),
    soda: wt('soda', 4), drink: wt('drink', 4), gone4: wt('gone', 4), laptop: wt('laptop', 4), keyboard: wt('keyboard', 4), lap: wt('lap', 4),
    frames: wt('frames', 6), gone6: wt('gone', 6), pane: wt('pane', 6), slides: wt('slides', 6), raining: wt('raining', 6), glass: wt('glass', 6),
    ladder: wt('ladder', 8), alu8: wt('aluminum', 8), grab: wt('grab', 8), gutter: wt('gutter', 8), also: wt('also', 8), alu8b: wt('aluminum', 8, 1), hell: wt('hell', 8),
    pickup: wt('pickup', 10), sixty: wt('sixty', 10), body: wt('body', 10), gone10: wt('gone', 10), steel: wt('steel', 10), screaming: wt('screaming', 10),
    back: wt('back', 11), snaps: wt('snaps', 11),
    plane12: wt('plane', 12), around: wt('around', 12), alive: wt('alive', 12), chicken: wt('chicken', 12), pasta: wt('pasta', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  // passengers row in the sky (used in hook + return)
  const row = (t, fall, wob) => P.map((c, i) => seated(170 + i * 250, 1680 + fall + Math.sin(t * 7 + i) * 6 * wob, 0.62, c, wob > 0 ? 'open' : 'neutral', Math.sin(t * 11 + i * 2) * 5 * wob)).join('');

  const shots = [
    // 0 hook: you're on a plane; aluminum vanishes; the plane is gone around you
    [0, (t) => {
      const kV = seg(t, T.vanished - 0.05, T.vanished + 0.3);
      let s = vgrad('#2f7ad6', '#bfe0fa') + clouds(t, 200 + 1400 * kV, 3) + speedLines(t, { a: 0.15 + 0.3 * kV, vertical: true, dir: -1, seed: 2 });
      s += row(t, 80 * kV, kV);
      s += g(plane(0, 0, 1000, glitchA(t, T.vanished - 0.05)), 'translate(600 1500) scale(1.6)');
      s += hit(540, 520, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)) * (1 - seg(t, T.plane0 - 0.1, T.plane0)), '#ff2a3a', -5, 150);
      s += hit(540, 520, 'ON A PLANE', pop(seg(t, T.plane0 - 0.08, T.plane0 + 0.1)) * (1 - seg(t, T.alu0 - 0.1, T.alu0)), '#2f6fd6', -5, 130);
      s += stamp(540, 560, 'ALUMINUM: GONE', seg(t, T.vanished - 0.08, T.vanished + 0.2), '#ff2a3a', -7, 70);
      s += chip(540, 760, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += debris(t, T.vanished, 560, 1500, { n: 40, col: ALU, spread: 1200, seed: 4, size: 22 });
      s += flash(t, 0, 0.6) + flash(t, T.vanished - 0.05, 0.85);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.news, T.plane0, T.vanished], 0.11), z1: 1, oy: 1300 }), shake(t, [0.03, T.news, T.vanished], 34)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 falling on seat cushions, 35,000 ft of nothing
    [C[0], (t) => {
      const acc = 1 + (t - C[0]) * 0.6;
      let s = vgrad('#2a6ad0', '#a8d4f8') + clouds(t * 2.4 * acc, 900, 5) + speedLines(t, { a: 0.5, vertical: true, dir: -1, seed: 6 });
      s += seated(250, 1900 + Math.sin(t * 9) * 14, 1.0, P[0], 'open', Math.sin(t * 13) * 6);
      s += seated(800, 1880 + Math.sin(t * 8 + 1) * 14, 1.05, P[1], 'tense', Math.sin(t * 12 + 2) * 6);
      s += chip(540, 560, 'MOSTLY ALUMINUM', pop(seg(t, T.mostly - 0.1, T.mostly + 0.1)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 760, 'SEAT CUSHION', seg(t, T.cushion - 0.08, T.cushion + 0.2) * (1 - seg(t, T.thirty - 0.12, T.thirty - 0.02)), '#ffcf6a', 5, 70);
      const alt = Math.round(35000 - Math.max(0, t - T.thirty) * 1200);
      s += hit(540, 760, `${alt.toLocaleString('en-US')} FT`, pop(seg(t, T.thirty - 0.08, T.thirty + 0.12)), '#ff2a3a', -4, 150);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, T.thirty - 0.05, 0.6) + flash(t, T.nothing - 0.05, 0.5, '#ff2a3a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.mostly, T.cushion, T.thirty, T.nothing], 0.1), z1: 1, oy: 1200 }), shake(t, [T.cushion, T.thirty, T.nothing], 28)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 soda cans gone mid-drink, laptop drops its keyboard
    [C[1], (t) => {
      let s;
      if (t < T.laptop - 0.1) {
        const kG = seg(t, T.gone4 - 0.1, T.gone4 + 0.05);
        s = vgrad('#ffcf6a', '#ff8a3a', 0, 1300) + rect(0, 1300, 1080, 620, '#6a4a3a');
        const cols = ['#c8102e', '#2fae6a', '#2f6fd6'];
        for (let i = 0; i < 3; i++) {
          const px = 200 + i * 340, sc = 1.1, hx = px + 30 * sc, hy = 1960 - 330 * sc;
          s += adult({ ...CROWD[i + 1], x: px, y: 1960, s: sc, face: t > T.gone4 ? 'open' : 'neutral', pose: 'hold', tilt: 3 * kG * (i - 1) });
          if (kG < 1) s += g(can(hx, hy, 1.6, cols[i]), '', `opacity="${(1 - kG).toFixed(2)}"`);
          const d = Math.max(0, t - T.gone4); if (d > 0) { const y = hy + 1800 * d * d; s += `<ellipse cx="${hx}" cy="${Math.min(1900, y).toFixed(0)}" rx="${30 + d * 60}" ry="${50 - Math.min(30, d * 40)}" fill="#5a2a0a" opacity="0.9"/>`; }
          s += debris(t, T.gone4 + 0.25, hx, 1700, { n: 24, col: '#7a3a12', spread: 700, seed: 3 + i, size: 22 });
        }
        s += hit(540, 560, 'MID DRINK', pop(seg(t, T.soda - 0.1, T.soda + 0.1)) * (1 - kG), '#c8102e', -5, 140);
        s += stamp(540, 600, 'SPLASH', seg(t, T.gone4 - 0.05, T.gone4 + 0.2), '#c8102e', -6, 110);
        s += flash(t, C[1] + 0.02, 0.5) + flash(t, T.gone4 - 0.05, 0.7);
        return g(cam(fin(s), 0, { z0: punch(t, [T.soda, T.drink, T.gone4], 0.1), z1: 1, oy: 1300 }), shake(t, [T.drink, T.gone4], 30)) + bar(t) + pill('SECOND 2');
      }
      const kL = seg(t, T.keyboard - 0.15, T.keyboard + 0.1), d = Math.max(0, t - T.keyboard + 0.1);
      s = vgrad('#e8eef4', '#b8c4d2') + rect(0, 1500, 1080, 420, '#8a7a6a');
      s += rect(330, 1360, 420, 400, '#3a4250', 30) + rect(300, 1760, 480, 50, '#3a4250', 20) + adult({ ...YOU, x: 540, y: 1960, s: 1.1, face: t > T.keyboard ? 'open' : 'neutral', pose: 'sit' }) + rect(330, 1800, 420, 40, '#3a4250', 16);
      const ky = Math.min(1700, 1560 + 1600 * d * d);
      s += g(rect(-260, -120, 520, 300, ALU, 16) + rect(-240, -100, 480, 260, '#2f6fd6', 10), `translate(540 1490)`, `opacity="${(1 - kL).toFixed(2)}"`);
      s += rect(330, ky - 20, 420, 50, '#1d222c', 10) + [...Array(10)].map((_, i) => rect(345 + i * 40, ky - 12, 32, 30, '#3a4250', 4)).join('');
      s += debris(t, T.keyboard + 0.05, 540, ky, { n: 24, col: '#2a2e36', spread: 700, seed: 8, size: 16 });
      s += hit(540, 600, 'LAPTOP', pop(seg(t, T.laptop - 0.1, T.laptop + 0.1)) * (1 - kL), '#2f6fd6', -5, 150);
      s += stamp(540, 640, 'IN YOUR LAP', seg(t, T.lap - 0.15, T.lap + 0.1), '#c8102e', 6, 76);
      s += flash(t, T.laptop - 0.1, 0.5) + flash(t, T.keyboard - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.laptop, T.keyboard, T.lap], 0.1), z1: 1, oy: 1300 }), shake(t, [T.keyboard, T.lap], 32)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 window frames gone, panes slide out, raining glass
    [C[2], (t) => {
      const kF = seg(t, T.gone6 - 0.1, T.gone6 + 0.05);
      let s = vgrad('#3a8ae0', '#cfe6fa') + rect(0, 1760, 1080, 160, '#7a7e86');
      s += rect(140, 120, 800, 1700, '#5a6478');
      for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) {
        const x = 170 + c * 190, y0 = 160 + r * 175, i = r * 4 + c, rr = rng(i + 3)();
        const t0 = T.slides - 0.15 + rr * 0.6, d = Math.max(0, t - t0), y = y0 + 1600 * d * d + 40 * d, gone = y > 1700;
        if (!gone) s += rect(x, y, 160, 140, '#9fd0ff', 4, `opacity="0.85" transform="rotate(${(d * 60 * (rr - 0.5)).toFixed(1)} ${x + 80} ${y + 70})"`) + rect(x + 14, y + 10, 26, 110, '#ffffff', 6, 'opacity="0.45"');
        if (kF < 1) s += rect(x - 8, y0 - 8, 176, 156, 'none', 6, `stroke="${ALU}" stroke-width="14" opacity="${(1 - kF).toFixed(2)}"`);
      }
      s += crack(t, T.raining, 540, 1770, 4) + crack(t, T.glass, 300, 1780, 7) + crack(t, T.glass + 0.1, 820, 1780, 9);
      s += debris(t, T.raining - 0.05, 540, 1760, { n: 40, col: '#cfe8ff', spread: 1200, seed: 2, size: 16 }) + debris(t, T.glass - 0.05, 300, 1770, { n: 30, col: '#e8f6ff', spread: 900, seed: 5, size: 12 });
      s += hit(540, 560, 'FRAMES: GONE', pop(seg(t, T.gone6 - 0.08, T.gone6 + 0.1)) * (1 - seg(t, T.raining - 0.15, T.raining - 0.05)), '#ff2a3a', -5, 120);
      s += hit(540, 600, 'RAINING GLASS', pop(seg(t, T.raining - 0.08, T.raining + 0.1)), '#2f6fd6', 4, 130);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, T.gone6 - 0.05, 0.6) + flash(t, T.raining - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.frames, T.gone6, T.slides, T.raining, T.glass], 0.1), z1: 1, oy: 1300 }), shake(t, [T.gone6, T.raining, T.glass], 34)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 ladder gone, gutter gone, into the hedge
    [C[3], (t) => {
      const kL = seg(t, T.alu8 - 0.1, T.alu8 + 0.05), kG = seg(t, T.alu8b - 0.1, T.alu8b + 0.05);
      let s = vgrad('#5aa8f0', '#d8eefc', 0, 700) + rect(0, 700, 1080, 1220, '#e8d0a8');
      s += `<path d="M-40,700 L540,380 L1120,700Z" fill="#c8312b"/>` + rect(160, 900, 200, 200, '#9fc4ff', 6) + rect(720, 900, 200, 200, '#9fc4ff', 6);
      s += rect(0, 1780, 1080, 140, '#5a8a3a');
      if (kG < 1) s += rect(0, 690, 1080, 34, ALU, 6, `opacity="${(1 - kG).toFixed(2)}"`);
      if (kL < 1) s += g(`<path d="M520,1800 L680,720 M640,1800 L800,720" stroke="${ALU}" stroke-width="18"/>` + [...Array(9)].map((_, i) => { const y = 1700 - i * 110, o = (1800 - y) * 0.148; return `<path d="M${520 + o},${y} L${640 + o},${y}" stroke="${ALU}" stroke-width="14"/>`; }).join(''), '', `opacity="${(1 - kL).toFixed(2)}"`);
      // person: climbing -> hanging from gutter -> falling into hedge
      const sc = 0.95; let py, pose = 'up', face = 'tense', tilt = 0;
      if (t < T.alu8) { py = 1340; pose = 'up'; face = 'neutral'; }
      else if (t < T.alu8b) { const d = t - T.alu8; py = lerp(1340, 724 + 560 * sc, clamp(d / 0.25)); face = 'open'; tilt = Math.sin(t * 20) * 4; }
      else { const d = t - T.alu8b; py = Math.min(2060, 724 + 560 * sc + 2400 * d * d); face = 'open'; tilt = Math.sin(t * 25) * 10; }
      s += adult({ ...YOU, x: 680, y: py, s: sc, face, pose, tilt });
      // hedge in front
      const hr = rng(4); for (let i = 0; i < 12; i++) s += circ(420 + i * 45 + hr() * 20, 1820 + hr() * 50, 90 + hr() * 30, ['#2f8a4a', '#3aa058', '#24703a'][i % 3]);
      s += debris(t, T.alu8b + 0.38, 680, 1760, { n: 30, col: '#3aa058', spread: 900, seed: 6, size: 18 });
      s += chip(540, 530, 'LADDER: ALUMINUM', pop(seg(t, T.alu8 - 0.1, T.alu8 + 0.1)), { size: 44, col: '#fff', bg: '#141a22' });
      s += chip(540, 660, 'GUTTER: ALSO', pop(seg(t, T.also - 0.1, T.also + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 1600, 'HELL.', seg(t, T.hell - 0.05, T.hell + 0.2), '#c8102e', -7, 130);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, T.alu8 - 0.05, 0.6) + flash(t, T.alu8b - 0.05, 0.6) + flash(t, T.hell - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.alu8, T.grab, T.alu8b, T.hell], 0.1), z1: 1, oy: 1200 }), shake(t, [T.alu8, T.alu8b, T.hell], 34)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 pickup at 60, aluminum body gone, guy on a steel frame
    [C[4], (t) => {
      const kB = seg(t, T.gone10 - 0.1, T.gone10 + 0.05);
      let s = vgrad('#6ab0f0', '#e2f0fa', 0, 1100) + rect(0, 1100, 1080, 820, '#5a5e66') + rect(0, 1100, 1080, 30, '#8a8e94');
      for (let i = 0; i < 6; i++) { const x = ((i * 300 - t * 2400) % 1800 + 1800) % 1800 - 300; s += rect(x, 1880, 160, 18, '#ffffff', 4); }
      s += speedLines(t, { a: 0.4, dir: -1, seed: 10 });
      const bob = Math.sin(t * 30) * 5, by = 1700 + bob;
      // driver (behind body)
      s += adult({ ...YOU, x: 380, y: by + 160, s: 1.0, face: t > T.screaming - 0.1 ? 'open' : (t > T.gone10 ? 'tense' : 'neutral'), pose: 'hold', tilt: Math.sin(t * 22) * 4 * kB });
      if (kB < 1) s += g(`<path d="M60,${by} L60,${by - 280} L240,${by - 280} L330,${by - 520} L620,${by - 520} L700,${by - 280} L1040,${by - 280} L1040,${by}Z" fill="#2f6fd6"/>` + rect(350, by - 490, 250, 190, '#9fd0ff', 10) + rect(80, by - 160, 960, 20, '#1d4aa0'), '', `opacity="${(1 - kB).toFixed(2)}"`);
      s += rect(40, by, 1020, 44, '#2a2c30', 6) + [...Array(8)].map((_, i) => rect(80 + i * 130, by + 6, 20, 32, '#4a4e56')).join('');
      s += circ(380, by - 10, 70, 'none', `stroke="#1d1f24" stroke-width="16" opacity="${kB.toFixed(2)}"`);
      for (const wx of [230, 860]) s += g(circ(0, 0, 120, '#1d1f24') + circ(0, 0, 55, '#8a8e94') + rect(-8, -50, 16, 100, '#5a5e66'), `translate(${wx} ${by + 70}) rotate(${(t * 1400) % 360})`);
      s += debris(t, T.gone10, 540, by - 300, { n: 40, col: '#2f6fd6', spread: 1300, seed: 11, size: 24 });
      s += chip(540, 530, '60 MPH', pop(seg(t, T.sixty - 0.1, T.sixty + 0.1)), { size: 56, col: '#fff', bg: '#c8102e' });
      s += hit(540, 700, 'BODY: GONE', pop(seg(t, T.gone10 - 0.08, T.gone10 + 0.1)) * (1 - seg(t, T.steel - 0.1, T.steel)), '#ff2a3a', -5, 130);
      s += stamp(540, 720, 'STEEL FRAME', seg(t, T.steel - 0.08, T.steel + 0.2), '#2a2c30', 5, 80);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, T.gone10 - 0.05, 0.7) + flash(t, T.screaming - 0.05, 0.4, '#ff2a3a', 0.25);
      return g(cam(fin(s), 0, { z0: punch(t, [T.pickup, T.sixty, T.gone10, T.screaming], 0.1), z1: 1, oy: 1300 }), shake(t, [T.gone10, T.steel, T.screaming], 32, 5)) + bar(t) + pill('SECOND 5');
    }],
    // 11 aluminum back: the plane snaps back around everyone
    [C[5], (t) => {
      const kP = pop(seg(t, T.snaps - 0.1, T.snaps + 0.1));
      let s = vgrad('#2f7ad6', '#cfe6fa') + clouds(t, lerp(1400, 200, kP), 12) + speedLines(t, { a: 0.4 * (1 - kP), vertical: true, dir: -1, seed: 13 });
      s += row(t, 120 * (1 - kP), 1 - kP);
      if (kP > 0) s += g(plane(0, 0, 1000, 1), `translate(600 1500) scale(${(2.4 - 0.8 * kP).toFixed(3)})`, `opacity="${Math.min(1, kP * 2).toFixed(2)}"`);
      s += stamp(540, 560, 'ALUMINUM: ON', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 80);
      s += hit(540, 800, 'SNAP', pop(seg(t, T.snaps - 0.08, T.snaps + 0.1)), '#2fae6a', -4, 200);
      s += flash(t, C[5], 0.95) + flash(t, T.snaps - 0.05, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.back, T.snaps], 0.13), z1: 1, oy: 1300 }), shake(t, [C[5], T.back, T.snaps], 44, 6)) + pill('ALUMINUM: BACK');
    }],
    // 12 cabin: everyone alive, chicken or pasta
    [C[6], (t) => {
      let s = vgrad('#e8ecf2', '#c8d0dc', 0, 1300) + rect(0, 1300, 1080, 620, '#4a5068');
      for (let i = 0; i < 5; i++) s += rect(60 + i * 210, 760, 110, 150, '#7ab8f0', 50, 'stroke="#aab0ba" stroke-width="10"');
      const sh = Math.sin(t * 30) * 4 * (1 - seg(t, C[6], C[6] + 0.8));
      s += seated(210, 1900, 0.98, { ...P[0], seat: '#2f5ad6' }, t > T.alive ? 'smile' : 'open', sh);
      s += seated(560, 1900, 0.98, { ...P[1], seat: '#2f5ad6' }, 'open', -sh);
      // flight attendant + cart
      s += adult({ ...CROWD[4], top: '#1d2a4a', pants: '#1d2a4a', x: 900, y: 1960, s: 1.15, face: 'smile', pose: 'hold' });
      s += rect(700, 1560, 160, 260, '#aab0ba', 12) + rect(712, 1600, 136, 16, '#7a808a');
      s += chip(540, 470, 'EVERYONE ALIVE.', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 54, col: '#fff', bg: '#2fae6a' });
      const kQ = pop(seg(t, T.chicken - 0.15, T.chicken + 0.05));
      if (kQ > 0) s += g(rect(-380, -90, 760, 180, '#ffffff', 50, 'stroke="#1d2a4a" stroke-width="6"') + `<path d="M200,88 L260,170 L120,88Z" fill="#ffffff" stroke="#1d2a4a" stroke-width="6"/>` + t2(0, 24, 'CHICKEN OR PASTA?', 64, '#1d2a4a', { weight: 900 }), `translate(560 650) scale(${kQ.toFixed(3)})`);
      s += flash(t, C[6], 0.6) + flash(t, T.pasta - 0.05, 0.4, '#ffcf6a');
      return g(cam(fin(s), 0, { z0: punch(t, [T.plane12, T.alive, T.chicken, T.pasta], 0.1), z1: 1, oy: 1100 }), shake(t, [C[6], T.pasta], 22)) + pill('ALIVE');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['GOLD?', 'SILICON?', 'SALT?', 'PAPER?', 'COTTON?', 'LEATHER?'];
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
