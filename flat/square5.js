// "What if every wheel on Earth turned square for five seconds?" — HYPE countdown.
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + vignette(v);
const lying = (o) => g(adult({ ...o, x: 0, y: 0, s: 1 }), `translate(${o.x} ${o.y}) rotate(${o.rot || -90}) scale(${o.s})`);
/** wheel: sq 0 = round, 1 = square */
const whl = (x, y, r, rot, sq = 1, tire = '#15171a', hub = '#c0c4cc') => g(rect(-r, -r, 2 * r, 2 * r, tire, lerp(r, r * 0.1, sq)) + rect(-r * 0.45, -r * 0.45, r * 0.9, r * 0.9, hub, lerp(r * 0.45, 3, sq)) + rect(-r * 0.08, -r * 0.7, r * 0.16, r * 1.4, tire), `translate(${x} ${y}) rotate(${rot})`);
const bounce = (p) => Math.abs(Math.sin(p * Math.PI));
const car = (x, y, col, s, rot, sq, ph, flip = 1) => { const b = sq * bounce(ph) * 26; const rk = ph * 90 * flip; return g(whl(-120, 0, 44, rk, sq) + whl(120, 0, 44, rk, sq) + g(rect(-210, -100, 420, 90, col, 26) + `<path d="M-130,-100 L-80,-170 L90,-170 L140,-100Z" fill="${col}"/>` + `<path d="M-112,-104 L-72,-158 L0,-158 L0,-104Z M12,-104 L12,-158 L82,-158 L122,-104Z" fill="#1a2230" opacity="0.85"/>` + rect(190, -80, 20, 16, '#ffe9a8', 4), `translate(0 ${-b})`), `translate(${x} ${y}) rotate(${rot}) scale(${s * flip} ${s})`); };
const road = (t, sp, y0 = 1120, col = '#4a4e54') => { let s = rect(0, y0, 1080, 1920 - y0, col); const off = (t * sp) % 340; for (let i = -1; i < 5; i++) s += rect(i * 340 - off + 60, y0 + 400, 190, 18, '#f2f2ea', 4); return s; };
const sky = () => { let s = vgrad('#6fb2ea', '#dcedf8', 0, 1120); const r = rng(6); let x = -30; while (x < 1100) { const w = 160 + r() * 140, h = 240 + r() * 300; s += rect(x, 1120 - h, w, h, ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8'][Math.floor(r() * 4)]); x += w + 6; } return s; };
const gearShape = (r, teeth, sq) => { let s = ''; for (let i = 0; i < teeth; i++) s += rect(-r * 0.14, -r * 1.18, r * 0.28, r * 0.3, '#2a3040', 3, `transform="rotate(${(360 * i) / teeth})"`); return s + rect(-r, -r, 2 * r, 2 * r, '#3a4252', lerp(r, r * 0.08, sq)) + rect(-r * 0.3, -r * 0.3, r * 0.6, r * 0.6, '#ffd24a', lerp(r * 0.3, 2, sq)); };
const planeG = (sq, rk) => `<path d="M-430,-30 Q-470,-90 -400,-110 L340,-110 Q470,-100 480,-40 Q470,0 340,10 L-340,10 Q-400,5 -430,-30Z" fill="#f2f4f8"/>` + `<path d="M-390,-110 L-470,-280 L-380,-280 L-280,-110Z" fill="#c8102e"/>` + `<path d="M-60,-40 L-260,120 L-160,120 L120,-40Z" fill="#b8bcc6"/>` + [...Array(16)].map((_, i) => rect(-340 + i * 44, -86, 24, 28, '#2a3a52', 8)).join('') + `<path d="M380,-96 L450,-60 L380,-60Z" fill="#2a3a52"/>` + rect(-110, 0, 22, 90, '#5a5e66') + rect(290, 0, 22, 70, '#5a5e66') + whl(-140, 118, 48, rk, sq) + whl(-60, 118, 48, rk, sq) + whl(300, 98, 38, rk, sq);

export async function init() {
  const W = await (await fetch('/work/square5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 1.1;
  const T = {
    wheel: wt('wheel', 0), square: wt('square', 0), news: wt('news', 0), seventy: wt('seventy', 0),
    billion: wt('billion', 2), b1: wt('bang', 2, 0), b2: wt('bang', 2, 1), b3: wt('bang', 2, 2), spine: wt('spine', 2), solo: wt('solo', 2),
    chair: wt('chair', 4), dead: wt('dead', 4), dont: wt('dont', 4), shop: wt('shopping', 4), nobody: wt('nobody', 4), notices: wt('notices', 4),
    train: wt('train', 6), hammers: wt('hammers', 6), sparks: wt('sparks', 6), miles: wt('miles', 6), still: wt('still', 6), delayed: wt('delayed', 6),
    jumbo: wt('jumbo', 8), lands: wt('lands', 8), hops: wt('hops', 8), kangaroo: wt('kangaroo', 8),
    gear: wt('gear', 10), jams: wt('jams', 10), ferris: wt('ferris', 10), frame: wt('frame', 10), you: wt('you', 10),
    back: wt('back', 11), rolls: wt('rolls', 11), alive: wt('alive', 11), sit: wt('sit', 11), week: wt('week', 11),
    worst: wt('worst', 12), work: wt('work', 12), bumps: wt('bumps', 12), professor: wt('professor', 12), built: wt('built', 12),
    next: wt('next', 13), comments: wt('comments', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[4];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1370, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  const beats = (a, b, step = 0.2) => { const o = []; for (let x = a; x < b; x += step) o.push(x); return o; };

  const shots = [
    // 0 — highway, wheels snap square
    [0, (t) => {
      const kS = pop(seg(t, T.wheel - 0.12, T.wheel + 0.08));
      let s = sky() + road(t, 2200) + speedLines(t, { a: 0.4, seed: 3 });
      s += car(540, 1640, '#d9312b', 2.0, kS * Math.sin(t * 19) * 3, kS, t * 6);
      s += stamp(540, 640, 'WHEELS: SQUARE', seg(t, T.square - 0.05, T.square + 0.2), '#ff2a3a', -6, 66);
      s += chip(540, 840, '70 MPH', pop(seg(t, T.seventy - 0.1, T.seventy + 0.1)), { size: 62, col: '#fff', bg: '#c8102e' });
      if (kS > 0) s += debris(t, T.wheel, 300, 1680, { n: 22, col: '#3a3e44', seed: 3 }) + debris(t, T.wheel, 780, 1680, { n: 22, col: '#3a3e44', seed: 7 });
      s += flash(t, T.wheel - 0.05, 0.85);
      return g(cam(fin(s), 0, { z0: punch(t, [T.wheel, T.square, T.seventy], 0.12), z1: 1, oy: 1500 }), shake(t, [0.02, ...beats(T.wheel, N[0], 0.17)], 18, 9)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — every car bangs along, spine = drum solo
    [C[0], (t) => {
      let s = sky() + road(t, 900, 700) + speedLines(t, { a: 0.25, seed: 5 });
      const lanes = [[840, 0.8, '#2f6fd6'], [1120, 1.0, '#d9a23a'], [1450, 1.3, '#2fae6a'], [1830, 1.7, '#c8312b']];
      lanes.forEach(([y, sc, c], l) => { for (let i = -1; i < 3; i++) { const x = ((i * 620 + t * (420 + 90 * l) + l * 220) % 1500 + 1500) % 1500 - 200; s += car(x, y, c, sc, Math.sin(t * 20 + i) * 2, 1, t * 7 + i * 0.4 + l); } });
      s += chip(540, 560, '1,500,000,000 CARS', pop(seg(t, T.billion - 0.1, T.billion + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      [[T.b1, 280, 760], [T.b2, 760, 1480], [T.b3, 340, 1480]].forEach(([b, x, y], i) => { s += bigText(x, y, 'BANG', pop(seg(t, b - 0.02, b + 0.08)) * (1 - seg(t, b + 0.5, b + 0.65)), { size: 150, col: '#ffd24a', rot: i % 2 ? 7 : -7 }); });
      s += stamp(540, 760, 'DRUM SOLO', seg(t, T.solo - 0.1, T.solo + 0.15), '#ffffff', -5, 78);
      s += flash(t, T.spine, 0.35);
      return g(cam(fin(s), 0, { z0: punch(t, [T.b1, T.b2, T.b3, T.spine], 0.1), z1: 1, oy: 1200 }), shake(t, [T.b1, T.b2, T.b3, T.spine], 40)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — office chair stops, you don't; then the shopping carts
    [C[1], (t) => {
      let s;
      if (t < T.shop - 0.04) {
        s = vgrad('#f0e4cc', '#d8c6a4', 0, 1500) + rect(0, 1340, 1080, 580, '#8fa0b0') + rect(60, 560, 330, 420, '#9ad0ee', 6, 'stroke="#fff" stroke-width="14"') + speedLines(t, { a: t < T.dead ? 0.4 : 0.12, seed: 8 });
        s += rect(720, 1200, 340, 30, '#6a4a2a', 4) + rect(760, 1230, 26, 300, '#5a3a22') + rect(1000, 1230, 26, 300, '#5a3a22') + rect(800, 1090, 170, 110, '#1a2230', 6);
        const kx = seg(t, C[1], T.dead), cx = lerp(-120, 410, kx), bump = t < T.dead ? bounce(t * 7) * 12 : 0;
        s += g(whl(-70, 0, 34, t * 700) + whl(70, 0, 34, t * 700) + rect(-12, -150, 24, 120, '#2a2e36') + rect(-100, -176, 200, 34, '#2f3a4a', 12), `translate(${cx} ${1420 - bump})`);
        const d = Math.max(0, t - T.dead);
        if (d === 0) s += adult({ ...YOU, x: cx, y: 1420 - 176 - bump + 225, s: 0.9, pose: 'sit', face: 'neutral' });
        else { const land = Math.min(1, d / 0.5); s += lying({ ...YOU, x: lerp(410, 560, land), y: lerp(1469, 1600, land) - Math.sin(land * Math.PI) * 240, s: 0.9, face: 'tense', rot: lerp(0, 88, land) }); }
        s += debris(t, T.dead + 0.4, 900, 1520, { n: 28, col: '#f2f2ea', seed: 5, size: 34 });
        s += chip(540, 620, 'CHAIR: STOPPED', pop(seg(t, T.dead - 0.08, T.dead + 0.1)), { size: 46, col: '#fff', bg: '#c8102e' });
        s += chip(540, 770, 'YOU: NOT STOPPED', pop(seg(t, T.dont - 0.08, T.dont + 0.1)), { size: 46, col: '#ffcf6a', bg: '#141a22', border: '#ffcf6a' });
        s += flash(t, T.dead, 0.5);
        return g(cam(fin(s), 0, { z0: punch(t, [T.dead, T.dont], 0.12), z1: 1, oy: 1300 }), shake(t, [T.dead, T.dont], 36)) + bar(t) + pill('SECOND 2');
      }
      s = vgrad('#f4f6ea', '#dfe6cc', 0, 1300) + rect(0, 1300, 1080, 620, '#c8ccc0');
      for (let c = 0; c < 2; c++) { s += rect(c * 560 + 40, 560, 460, 700, '#b8c0c8', 8); for (let j = 0; j < 4; j++) { s += rect(c * 560 + 60, 640 + j * 160, 420, 16, '#6a7078'); for (let i = 0; i < 7; i++) s += rect(c * 560 + 70 + i * 58, 568 + j * 160, 46, 72, ['#c8312b', '#2f6fd6', '#d9a23a', '#2fae6a'][(i + j) % 4], 4); } }
      const wob = Math.sin(t * 15) * 5;
      s += g(whl(-210, 170, 54, t * 300 % 90) + whl(190, 170, 54, t * 340 % 90) + `<path d="M-300,-210 L260,-210 L210,90 L-250,90Z" fill="none" stroke="#7a8088" stroke-width="16"/><path d="M-200,-210 L-190,90 M-90,-210 L-85,90 M30,-210 L25,90 M150,-210 L140,90 M-290,-120 L255,-120 M-270,-20 L240,-20" stroke="#9aa0a8" stroke-width="7"/><path d="M260,-210 L350,-300 L430,-300" fill="none" stroke="#5a6068" stroke-width="20" stroke-linecap="round"/>`, `translate(500 1640) rotate(${wob}) scale(1.2)`);
      s += chip(540, 620, 'NO CHANGE', pop(seg(t, T.nobody - 0.08, T.nobody + 0.1)), { size: 76, col: '#fff', bg: '#c8102e' });
      s += flash(t, T.shop - 0.04, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.shop, T.nobody], 0.1), z1: 1, oy: 1400 }), shake(t, [T.shop, T.nobody], 22)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — trains hammer the tracks
    [C[2], (t) => {
      let s = vgrad('#ffb26a', '#ffe2b8', 0, 1400) + rect(0, 1400, 1080, 520, '#7a5a42') + rect(0, 1600, 1080, 22, '#d2d6dc') + speedLines(t, { a: 0.28, seed: 6 });
      const r = rng(4), xoff = (t * 500) % 620;
      for (let c = -1; c < 3; c++) { const x = c * 620 - xoff + 500, b = bounce(t * 8 + c) * 34; s += g(rect(-280, -540, 560, 460, '#2f6fd6', 22) + rect(-280, -210, 560, 30, '#f2f2ea') + [...Array(4)].map((_, i) => rect(-250 + i * 130, -490, 100, 170, '#1a2a44', 10)).join(''), `translate(${x} ${1560 - b})`) + whl(x - 180, 1540, 60, t * 420, 1, '#3a3e44', '#d8dce2') + whl(x + 180, 1540, 60, t * 420, 1, '#3a3e44', '#d8dce2'); }
      for (let i = 0; i < 90; i++) { const x = r() * 1080, sp = (t * (2 + r() * 3) + r()) % 1, y = 1600 - Math.sin(sp * 3) * 240 * r(), w = 3 + r() * 5; s += rect(x + sp * 300 * (r() - 0.5), y, w * 4, w, '#ffcf3a', 2, `opacity="${t > T.hammers - 0.1 ? 0.95 * (1 - sp) : 0}"`); }
      s += chip(540, 560, 'SPARKS FOR MILES', pop(seg(t, T.sparks - 0.08, T.sparks + 0.1)), { size: 48, col: '#fff', bg: '#c8102e' });
      const kD = pop(seg(t, T.still - 0.08, T.still + 0.05));
      if (kD > 0) s += g(rect(-320, -80, 640, 160, '#0a0d12', 14, 'stroke="#ffb020" stroke-width="6"') + t2(0, 34, 'DELAYED', 96, '#ffb020', { weight: 900, ls: 8 }), `translate(540 760) scale(${kD})`);
      s += flash(t, T.delayed, 0.4);
      return g(cam(fin(s), 0, { z0: punch(t, [T.sparks, T.still, T.delayed], 0.1), z1: 1, oy: 1400 }), shake(t, [...beats(C[2], N[3], 0.26), T.delayed], 24, 9)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — jumbo jet hops down the runway
    [C[3], (t) => {
      let s = vgrad('#58a6ee', '#c8e4f6', 0, 1500) + rect(0, 1500, 1080, 420, '#4a4e54') + speedLines(t, { a: 0.3, seed: 11 }); const off = (t * 1400) % 400;
      for (let i = -1; i < 4; i++) s += rect(i * 400 - off + 100, 1680, 240, 26, '#f2f2ea', 4);
      const ph = Math.max(0, t - T.jumbo) * 2.6, h = bounce(ph) * lerp(120, 520, seg(t, T.lands, T.hops + 0.4));
      s += g(planeG(1, t * 500), `translate(540 ${1370 - h}) rotate(${-bounce(ph) * 9 + Math.sin(t * 13) * 2}) scale(1.05)`);
      const imp = beats(T.jumbo + 1 / 2.6, C[3] + 8, 1 / 2.6);
      imp.forEach((i0) => { s += debris(t, i0, 400, 1500, { n: 16, col: '#3a3e44', seed: 2 + Math.round(i0 * 7), spread: 500 }); });
      s += stamp(540, 640, 'SQUARE GEAR', seg(t, T.lands - 0.08, T.lands + 0.15), '#c8102e', -5, 70);
      s += bigText(540, 830, 'BOING', pop(seg(t, T.hops - 0.05, T.hops + 0.08)) * (1 - seg(t, T.kangaroo, T.kangaroo + 0.1)), { size: 160, col: '#ffd24a', rot: 6 });
      s += chip(540, 800, 'FURIOUS KANGAROO', pop(seg(t, T.kangaroo - 0.08, T.kangaroo + 0.1)), { size: 48, col: '#fff', bg: '#c8102e' });
      return g(cam(fin(s), 0, { z0: punch(t, [T.lands, T.hops, T.kangaroo], 0.1), z1: 1, oy: 1400 }), shake(t, [T.jumbo, ...imp], 30)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 — gears jam; Ferris wheel is a window frame
    [C[4], (t) => {
      if (t < T.ferris - 0.04) {
        const kJ = pop(seg(t, T.jams - 0.1, T.jams + 0.05)), rot = Math.min(t, T.jams) * 240;
        let s = vgrad('#ffb347', '#e8642a') + glow(540, 1000, 700, '#fff0a0', 0.4 * kJ);
        s += g(gearShape(250, 14, kJ), `translate(330 1050) rotate(${rot})`) + g(gearShape(190, 12, kJ), `translate(800 1480) rotate(${-rot * 1.3})`) + g(gearShape(170, 10, kJ), `translate(800 740) rotate(${-rot * 1.3})`);
        s += debris(t, T.jams, 620, 1130, { n: 34, col: '#ffcf3a', seed: 6, size: 16 });
        s += stamp(540, 560, 'JAMMED', seg(t, T.jams - 0.08, T.jams + 0.1), '#ffffff', -6, 96) + flash(t, T.jams - 0.02, 0.6);
        return g(cam(fin(s), 0, { z0: punch(t, [T.jams], 0.14), z1: 1, oy: 1100 }), shake(t, [T.gear, T.jams], 40)) + bar(t) + pill('SECOND 5');
      }
      let s = vgrad('#6fb2ea', '#ffe6c4', 0, 1720) + rect(0, 1720, 1080, 200, '#6a8a5a');
      const sw = Math.sin(t * 2.4) * 2, hub = '#e24a3a';
      s += `<path d="M540,1020 L260,1720 M540,1020 L820,1720" stroke="#7a828c" stroke-width="34"/>`;
      s += rect(150, 610, 780, 780, 'none', 8, `stroke="${hub}" stroke-width="44"`) + `<path d="M150,610 L930,1390 M930,610 L150,1390" stroke="#c8ccd2" stroke-width="12"/>` + circ(540, 1000, 48, '#3a3e44');
      [[150, 610], [540, 610], [930, 610], [150, 1000], [930, 1000]].forEach(([x, y], i) => { s += g(rect(-5, 0, 10, 60, '#3a3e44') + rect(-62, 60, 124, 100, ['#2f6fd6', '#d9a23a', '#2fae6a', '#c8312b', '#8a5ad6'][i], 14), `translate(${x} ${y}) rotate(${sw})`); });
      s += g(rect(-7, 0, 14, 130, '#3a3e44') + rect(-150, 120, 300, 230, '#ffcf3a', 20) + rect(-120, 150, 240, 110, '#2a3a52', 8), `translate(540 1390) rotate(${sw})`);
      s += adult({ ...YOU, x: 540, y: 1760, s: 0.5, face: 'tense', pose: 'up' });
      s += stamp(540, 800, 'WINDOW FRAME', seg(t, T.frame - 0.1, T.frame + 0.1), '#c8102e', -6, 62);
      s += chip(540, 960, 'WITH YOU IN IT', pop(seg(t, T.you - 0.08, T.you + 0.1)), { size: 44, col: '#fff', bg: '#141a22' });
      s += flash(t, T.ferris - 0.04, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.ferris, T.frame, T.you], 0.08), z1: 1, oy: 1500 }), shake(t, [T.ferris, T.frame], 20)) + bar(t) + pill('SECOND 5');
    }],
    // 11 — wheels back, everything rolls; everyone alive
    [C[5], (t) => {
      let s = vgrad('#7ab8ee', '#e8f2f8', 0, 1920);
      if (t < T.alive - 0.05) {
        s += `<path d="M0,620 L1080,1500 L1080,1920 L0,1920Z" fill="#6a8a5a"/>` + speedLines(t, { a: 0.3, seed: 17 });
        for (let i = 0; i < 6; i++) { const k = ((t - C[5]) * 0.9 + i / 6) % 1, x = lerp(-300, 1380, k), y = lerp(720, 1900, k) - 40; s += car(x, y, ['#d9312b', '#2f6fd6', '#d9a23a', '#2fae6a', '#8a5ad6', '#3a3e44'][i], 1.1, 39, 0, t * 9); }
        s += stamp(540, 620, 'WHEELS: BACK', seg(t, C[5], C[5] + 0.22), '#2fae6a', 6, 66);
        s += chip(540, 800, 'EVERYTHING ROLLS', pop(seg(t, T.rolls - 0.1, T.rolls + 0.08)), { size: 46, col: '#fff', bg: '#c8102e' });
        s += flash(t, C[5], 0.95);
        return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.rolls], 0.12), z1: 1, oy: 1200 }), shake(t, [C[5], T.rolls], 40, 9)) + pill('WHEELS: BACK');
      }
      s += rect(0, 900, 1080, 1020, '#6a8a5a') + rect(0, 1360, 1080, 560, '#4a4e54');
      s += car(180, 1320, '#2f6fd6', 1, 8, 0, 0) + car(880, 1310, '#d9a23a', 1, -7, 0, 0);
      s += rect(200, 1780, 680, 36, '#7a5a3a', 6) + rect(240, 1816, 24, 110, '#5a4028') + rect(816, 1816, 24, 110, '#5a4028');
      [0, 1, 2, 3].forEach((i) => { s += adult({ ...CROWD[i], x: 170 + i * 248, y: 1905, s: 1.0, face: t > T.sit - 0.1 ? 'tense' : 'open', pose: i % 2 ? 'stand' : 'up', tilt: Math.sin(t * 3 + i) * 5 }); });
      s += chip(540, 610, "ALIVE.", pop(seg(t, T.alive - 0.08, T.alive + 0.1)), { size: 76, col: '#fff', bg: '#2fae6a' });
      s += stamp(540, 800, 'NOBODY CAN SIT', seg(t, T.sit - 0.2, T.sit + 0.05), '#c8102e', -5, 60);
      s += flash(t, T.alive - 0.05, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.alive, T.sit], 0.08), z1: 1, oy: 1500 }), shake(t, [T.alive, T.sit], 16)) + pill('EVERYONE');
    }],
    // 12 — real math: square wheels on a catenary road
    [C[6], (t) => {
      const a = 130, Lp = 2 * a * Math.asinh(1), yh = 1640;
      const wx = (t - C[6]) * 520, p = wx / Lp, idx = Math.round(p), u = (p - idx) * Lp, th = (Math.atan(Math.sinh(u / a)) * 180) / Math.PI, rot = idx * 90 + th;
      let s = vgrad('#58a6ee', '#e8f2f8', 0, 1920);
      let d = `M-20,1920`;
      for (let x = -20; x <= 1100; x += 6) { const w = x - (540 - Lp) + wx, n = Math.round(w / Lp), uu = w - n * Lp; d += ` L${x},${(yh + a * Math.cosh(uu / a)).toFixed(1)}`; }
      s += `<path d="${d} L1100,1920Z" fill="#2a3d5e"/>`;
      const xL = 540 - Lp, xR = 540 + Lp;
      s += `<path d="M${xL},${yh} L${xR},${yh} M540,${yh} L540,${yh - 60}" stroke="#3a4252" stroke-width="16"/>` + whl(xL, yh, a, rot, 1, '#c8102e', '#ffe9a8') + whl(xR, yh, a, rot, 1, '#c8102e', '#ffe9a8');
      s += adult({ ...YOU, x: 540, y: yh - 60, s: 0.5, face: 'smile', pose: 'stand' });
      s += stamp(540, 620, 'THEY ROLL', seg(t, T.work - 0.1, T.work + 0.12), '#2fae6a', -5, 84);
      s += chip(540, 790, 'CURVED BUMPS: REAL MATH', pop(seg(t, T.bumps - 0.1, T.bumps + 0.1)), { size: 40, col: '#fff', bg: '#2a3d5e' });
      s += chip(540, 950, 'A PROFESSOR BUILT ONE', pop(seg(t, T.professor - 0.1, T.professor + 0.1)), { size: 40, col: '#fff', bg: '#2fae6a' });
      s += flash(t, C[6], 0.5);
      return g(cam(fin(s, 0.3), 0, { z0: punch(t, [T.worst, T.work, T.built], 0.08), z1: 1, oy: 1400 }), shake(t, [T.worst, T.built], 14)) + pill('NOT A JOKE');
    }],
    // 13 — CTA
    [C[7], (t) => {
      const opts = ['EGGS?', 'THE MOON?', 'ORANGES?', 'DONUTS?', 'COINS?', 'PIZZA?'], i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'GOES', 1, { size: 180, col: '#ffcf6a' }) + bigText(540, 1000, 'SQUARE?', 1, { size: 180 });
      s += bigText(540, 1540, opts[i], 1, { size: 130, col: '#ffd0d6', rot: i % 2 ? 4 : -4 });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
