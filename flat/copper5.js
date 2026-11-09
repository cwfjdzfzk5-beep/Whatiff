// "What if all copper vanished for five seconds?" — HYPE format.
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, speedLines, debris, timerBar } from './kit3.js';
const { g, rect, circ, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + vignette2(v);
const vignette2 = (v) => L.vignette(v);
const CU = '#d9772e';
const GREG = { skin: '#efc29d', hair: '#4a3426', hairStyle: 'short', top: '#d9a23a', pants: '#3a3f55' };
const car = (x, y, col, s = 1, rot = 0) => g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` + `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#1a2230" opacity="0.85"/>` + circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#8a8e94') + circ(120, 0, 16, '#8a8e94'), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const house = (seed, top = 1000) => { const r = rng(seed); let s = '', x = -30; while (x < 1120) { const w = 190 + r() * 120, h = 280 + r() * 220, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8', '#9ac0a0'][Math.floor(r() * 5)]; s += rect(x, top - h, w, h, c); for (let j = 0; j < Math.floor(h / 100); j++) for (let i = 0; i < Math.floor(w / 72); i++) s += rect(x + 18 + i * 70, top - h + 26 + j * 96, 40, 56, '#2a3a52', 3, 'opacity="0.75"'); x += w + 8; } return s; };
// utility pole + its wires; k=1 → wires gone. xs = pole positions
const poles = (t, k, y0, y1, xs) => {
  let s = ''; xs.forEach((x) => { s += rect(x - 14, y0, 28, y1 - y0, '#7a5230', 6) + rect(x - 130, y0 + 40, 260, 22, '#6a4628', 6) + rect(x - 100, y0 + 120, 200, 18, '#6a4628', 6); for (const dx of [-110, -40, 40, 110]) s += circ(x + dx, y0 + 32, 12, '#e8e4dc'); });
  if (k < 1) for (let w = 0; w < 4; w++) { const yy = y0 + 32; let d = ''; for (let i = 0; i < xs.length - 1; i++) { const a = xs[i] + [-110, -40, 40, 110][w], b = xs[i + 1] + [-110, -40, 40, 110][w]; d += `M${a},${yy} Q${(a + b) / 2},${yy + 80} ${b},${yy} `; } s += `<path d="${d}" fill="none" stroke="${CU}" stroke-width="12" opacity="${1 - k}"/>`; }
  return s;
};
const sparks = (t, t0, x, y, seed = 2, n = 26) => debris(t, t0, x, y, { n, col: '#ffe08a', seed, size: 14, spread: 1000 });
const eleBG = (lit = 1, flr = '7') => {
  let s = rect(0, 0, 1080, 1920, lit ? '#b8c4ce' : '#8f99a4') + rect(0, 0, 1080, 170, lit ? '#fff4d0' : '#3a424c') + rect(60, 280, 960, 1280, lit ? '#d0d8e0' : '#a4aeb8', 10) + rect(0, 1560, 1080, 400, '#5a616c') + rect(528, 280, 24, 1280, '#7a8490');
  for (let i = 0; i < 6; i++) s += rect(0, 1600 + i * 60, 1080, 4, '#474e58');
  s += rect(400, 120, 280, 84, '#14161c', 12) + t2(540, 182, flr, 64, '#ff4a3a', { weight: 900 });
  return s;
};
const statuePath = 'M452,1500 L470,1100 Q460,960 490,860 L492,560 Q452,532 452,482 L440,470 L368,420 L428,448 L420,366 L462,430 L494,350 L516,426 L566,360 L560,438 L628,404 L574,470 L566,488 Q566,540 528,566 L536,704 L610,620 L640,300 L610,300 L610,250 L692,250 L692,300 L664,300 L654,660 L560,790 Q590,880 586,1040 L620,1500 Z';
const statue = (kGone, t) => {
  let s = '';
  // iron frame always underneath, shown as the skin disappears
  const id = `st${L.uid('c')}`;
  let lat = ''; for (let y = 280; y < 1520; y += 58) lat += `<path d="M300,${y} L760,${y + 18}" stroke="#4a5058" stroke-width="10"/>`; for (let x = 340; x < 740; x += 46) lat += `<path d="M${x},240 L${x + 60},1520" stroke="#5a616c" stroke-width="8"/><path d="M${x + 60},240 L${x},1520" stroke="#3a4048" stroke-width="6"/>`;
  s += `<defs><clipPath id="${id}"><path d="${statuePath}"/></clipPath></defs>`;
  if (kGone > 0) s += `<g clip-path="url(#${id})">${lat}</g><path d="${statuePath}" fill="none" stroke="#3a4048" stroke-width="10"/>`;
  if (kGone < 1) s += `<path d="${statuePath}" fill="#55b49a" opacity="${1 - kGone}"/><path d="M520,720 Q500,1000 516,1500 M548,740 Q560,1100 572,1500 M488,900 Q470,1200 480,1500" stroke="#3f9682" stroke-width="10" fill="none" opacity="${1 - kGone}"/><circle cx="508" cy="500" r="5" fill="#2a6a5a" opacity="${1 - kGone}"/><circle cx="540" cy="500" r="5" fill="#2a6a5a" opacity="${1 - kGone}"/>`;
  s += `<path d="M618,250 Q650,${190 + 12 * Math.sin(t * 17)} 684,250 Z" fill="#ffb02e"/>`;
  return s;
};

export async function init() {
  const W = await (await fetch('/work/copper5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.4;
  const T = {
    copper: wt('copper', 0), news: wt('news', 0), died: wt('died', 0),
    wire: wt('wire', 2), gone2: wt('gone', 2), poles: wt('poles', 2), internet: wt('internet', 2), over: wt('over', 2),
    mile: wt('mile', 4), engine: wt('engine', 4), dead: wt('dead', 4), coasts: wt('coasts', 4),
    stops: wt('stops', 6), floors: wt('floors', 6), stuck: wt('stuck', 6), greg: wt('greg', 6), acc: wt('accounting', 6), greg2: wt('greg', 6, 1), pod: wt('podcast', 6),
    pipes: wt('pipes', 8), gone8: wt('gone', 8), fountain: wt('fountain', 8), run: wt('run', 8), keys: wt('keys', 8), brass: wt('brass', 8), copper8: wt('copper', 8), locked: wt('locked', 8), flood: wt('flood', 8),
    lady: wt('lady', 10), pen: wt('pennies', 10), gone10: wt('gone', 10), york: wt('york', 10), skel: wt('skeleton', 10),
    back: wt('back', 11), alarm: wt('alarm', 11), off: wt('off', 11),
    alive: wt('alive', 12), soaked: wt('soaked', 12), elev: wt('elevator', 12), up: wt('up', 12), greg12: wt('greg', 12), ep: wt('episode', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  const person = (o, y, x, s, face, pose, tilt = 0) => adult({ ...o, x, y, s, face, pose, tilt });
  const water = (t, x, y, w, seed = 3, h = 1400) => { const r = rng(seed); let s = ''; for (let i = 0; i < 26; i++) { const px = x + (r() - 0.5) * w, sp = 900 + r() * 700, p = ((r() * 1400 + t * sp) % h); s += rect(px, y + p - 40, 12 + r() * 16, 70 + r() * 70, '#7fc6ff', 8, 'opacity="0.85"'); } return s; };
  const elevator = (t, lit, flr, podK, tEp = 0) => {
    let s = eleBG(lit, flr);
    if (podK > 0) {
      s += g(rect(-170, -58, 340, 116, '#c8102e', 16, 'stroke="#fff" stroke-width="8"') + t2(0, 26, 'ON AIR', 72, '#fff', { weight: 900, ls: 6 }), `translate(540 790) rotate(-4) scale(${podK})`);
      for (let i = 0; i < 4; i++) { const r = 150 + ((t * 420 + i * 90) % 360); s += circ(420, 1030, r, 'none', `stroke="#ffcf6a" stroke-width="10" opacity="${Math.max(0, 0.8 - r / 620)}"`); }
      s += person(GREG, 1960, 560, 1.92, 'happy', 'stand', 3);
      s += `<path d="M-40,780 L250,960" stroke="#1b1c20" stroke-width="22" stroke-linecap="round"/>` + g(rect(-58, -110, 116, 220, '#1b1c20', 54) + rect(-44, -96, 88, 130, '#b8bec6', 40) + [0, 1, 2, 3].map((i) => rect(-44, -76 + i * 26, 88, 6, '#6a7078')).join('') + rect(-52, 34, 104, 14, '#c8312b', 7), 'translate(330 1030) rotate(-52)');
      return s;
    }
    s += person(YOU, 1560, 300, 1.1, 'tense', 'stand', -7 + Math.sin(t * 6) * 2);
    s += person(GREG, 1560, 780, 1.1, 'happy', 'stand', 3);
    return s;
  };
  const street = (t, wiresK, seed = 4) => { let s = vgrad('#7ab0e8', '#cfe2f4', 0, 1000) + house(seed) + rect(0, 1000, 1080, 920, '#a2a6ac') + rect(0, 1000, 1080, 34, '#c8ccd2'); for (let i = 0; i < 6; i++) s += rect(0, 1120 + i * 150, 1080, 8, '#8a8e94'); s += poles(t, wiresK, 360, 1040, [150, 540, 930]); return s; };

  const shots = [
    // 0 hook
    [0, (t) => {
      const kW = seg(t, T.copper, T.copper + 0.25), dead = t >= T.died - 0.05;
      let s = street(t, kW);
      if (dead) s = s + rect(0, 0, 1080, 1920, '#10141e', 0, 'opacity="0.45"');
      CROWD.slice(0, 5).forEach((c, i) => { s += person(c, 1800, 130 + i * 205, 0.9, 'tense', 'up', Math.sin(t * 5 + i) * 3); });
      s += sparks(t, T.copper, 150, 400, 2) + sparks(t, T.copper + 0.05, 540, 400, 3) + sparks(t, T.copper + 0.1, 930, 400, 4);
      s += hit(540, 620, 'COPPER', pop(seg(t, 0, 0.12)), CU, -5, 170) + hit(540, 800, 'OFF', pop(seg(t, T.copper, T.copper + 0.15)), '#ff2a3a', -5, 190);
      s += hit(540, 960, 'EVERYTHING DIED', pop(seg(t, T.died - 0.08, T.died + 0.1)), '#ffffff', 4, 100);
      s += flash(t, 0, 0.7) + flash(t, T.copper, 0.7) + flash(t, T.died - 0.05, 0.75, '#000000');
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.copper, T.died], 0.11), z1: 1, oy: 1300 }), shake(t, [0.03, T.copper, T.news, T.died], 32)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 poles / internet
    [C[0], (t) => {
      const k = seg(t, T.gone2 - 0.08, T.gone2 + 0.1);
      let s = street(t, k, 9);
      s += sparks(t, T.gone2, 540, 430, 5, 40) + sparks(t, T.gone2 + 0.05, 150, 430, 6) + sparks(t, T.gone2 + 0.08, 930, 430, 7);
      s += chip(540, 240 + 330, 'EVERY WIRE: GONE', pop(seg(t, T.gone2 - 0.1, T.gone2 + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += hit(540, 840, 'JUST POLES', pop(seg(t, T.poles - 0.1, T.poles + 0.1)), '#ffcf6a', -5, 130);
      if (t >= T.internet - 0.05) { const kI = pop(seg(t, T.internet - 0.05, T.internet + 0.12)); s += g(rect(-300, -130, 600, 280, '#141a22', 28, 'stroke="#ff4a3a" stroke-width="8"') + t2(0, -38, 'NO INTERNET', 62, '#ffffff', { weight: 900, ls: 3 }) + t2(0, 62, 'EVER', 96, '#ff4a3a', { weight: 900, ls: 6 }), `translate(540 1560) rotate(-3) scale(${kI})`); }
      CROWD.slice(1, 4).forEach((c, i) => { if (t < T.internet - 0.05) s += person(c, 1880, 260 + i * 280, 0.8, 'tense', 'up', Math.sin(t * 6 + i) * 3); });
      s += flash(t, T.gone2 - 0.05, 0.75) + flash(t, T.over - 0.03, 0.5, '#ff2a3a');
      return g(cam(fin(s), 0, { z0: punch(t, [T.gone2, T.poles, T.internet, T.over], 0.11), z1: 1, oy: 900 }), shake(t, [T.gone2, T.poles, T.over], 34)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 car
    [C[1], (t) => {
      const kEng = seg(t, T.engine, T.dead + 0.12), kCoast = seg(t, T.coasts - 0.2, N[2]);
      const d = (t - C[1]) * (900 - 500 * kEng);
      let s = vgrad('#7ab0e8', '#e2eef8', 0, 900) + rect(0, 900, 1080, 1060, '#4a4e56');
      for (let i = 0; i < 9; i++) s += rect(((-d * 2 + i * 240) % 1320 + 1320) % 1320 - 200, 1380, 130, 16, '#e8e4dc', 6);
      s += rect(0, 900, 1080, 26, '#c8ccd2') + speedLines(t, { a: 0.3 - 0.2 * kEng, seed: 4 });
      s += car(330, 1320, '#c8312b', 1.0, -1 + Math.sin(t * 14) * 0.6) + car(770, 1620, '#2f6fd6', 1.15, 1);
      s += car(280, 1880, '#d9a23a', 1.2, -2);
      // copper loom leaving the car
      if (t < T.engine + 0.3) { const r = rng(5); for (let i = 0; i < 14; i++) { const u = (t - T.mile + 0.25 + i * 0.05); if (u > 0) s += `<path d="M${330 + (r() - 0.5) * 300},${1280 + r() * 40} q ${(r() - 0.5) * 200},${-200 * u} ${(r() - 0.5) * 300},${-420 * u}" stroke="${CU}" stroke-width="8" fill="none" opacity="${Math.max(0, 1 - u / 1.4)}"/>`; } }
      s += hit(540, 590, 'YOUR CAR', t < T.mile - 0.08 ? 1 : 0, '#ffffff', -4, 140);
      s += hit(540, 590, 'A MILE OF WIRE', pop(seg(t, T.mile - 0.08, T.mile + 0.1)), CU, -4, 108);
      s += chip(540, 770, 'ENGINE: DEAD', pop(seg(t, T.dead - 0.08, T.dead + 0.1)), { size: 60, col: '#fff', bg: '#c8102e' });
      s += hit(540, 980, 'COASTING', pop(seg(t, T.coasts - 0.06, T.coasts + 0.1)), '#ffffff', 5, 130);
      s += flash(t, T.engine, 0.5) + flash(t, T.dead - 0.04, 0.6, '#000000');
      return g(cam(fin(s), kCoast, { z0: punch(t, [T.mile, T.dead, T.coasts], 0.1), z1: 1.05, oy: 1300 }), shake(t, [T.mile, T.engine, T.dead], 30)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 elevator
    [C[2], (t) => {
      const stop = t >= T.stops - 0.03, podK = pop(seg(t, T.pod - 0.1, T.pod + 0.1));
      let s = elevator(t, !stop, stop ? '??' : '7', podK);
      if (podK <= 0) { s += hit(540, 560, 'STUCK', pop(seg(t, T.floors - 0.1, T.floors + 0.08)), '#ff2a3a', -6, 180);
      s += chip(540, 760, 'GREG. ACCOUNTING.', pop(seg(t, T.greg - 0.1, T.greg + 0.1)), { size: 50, col: '#fff', bg: '#1d222c' }); }
      else s += hit(540, 600, 'HAS A PODCAST', 1, '#ffcf6a', 4, 112);
      s += flash(t, T.stops - 0.03, 0.8, '#000000') + flash(t, T.pod - 0.03, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.stops, T.stuck, T.pod], 0.11), z1: 1, oy: 1200 }), shake(t, [T.stops, T.floors, T.pod], 42)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 pipes → locked out
    [C[3], (t) => {
      if (t < T.run - 0.05) {
        const kG = seg(t, T.gone8 - 0.08, T.gone8 + 0.1);
        let s = vgrad('#e8f0f4', '#c8d8e0') + rect(0, 1560, 1080, 400, '#9ab4c4');
        for (let i = 0; i < 9; i++) for (let j = 0; j < 14; j++) s += rect(i * 120 + 2, j * 112 + 2, 116, 108, '#ffffff', 2, 'opacity="0.35"');
        // sink + toilet + pipe on the wall
        s += rect(130, 960, 400, 80, '#f8fafc', 20) + rect(290, 1040, 80, 520, '#f0f4f6') + rect(610, 1120, 280, 240, '#f8fafc', 30) + rect(590, 1360, 320, 60, '#eef2f4', 18) + rect(650, 1420, 200, 140, '#f0f4f6', 10);
        if (kG < 1) s += rect(0, 700, 1080, 34, CU, 8, `opacity="${1 - kG}"`) + rect(420, 734, 34, 320, CU, 8, `opacity="${1 - kG}"`) + rect(760, 734, 34, 380, CU, 8, `opacity="${1 - kG}"`);
        if (kG > 0) { s += water(t, 437, 740, 200, 3, 900) + water(t, 777, 740, 200, 4, 900) + water(t, 540, 700, 1080, 5, 1300); const rise = lerp(1800, 1460, seg(t, T.gone8, T.run)); s += rect(0, rise, 1080, 700, '#58aef0', 0, 'opacity="0.75"') + debris(t, T.gone8, 540, 760, { n: 30, col: '#bfe4ff', seed: 22, size: 26 }); }
        s += hit(540, 500, 'PIPES: GONE', pop(seg(t, T.gone8 - 0.05, T.gone8 + 0.1)), '#ff2a3a', -5, 118);
        s += hit(540, 660, 'FOUNTAIN', pop(seg(t, T.fountain - 0.08, T.fountain + 0.08)), '#2a76d0', 5, 140);
        s += flash(t, T.gone8 - 0.05, 0.75);
        return g(cam(fin(s), 0, { z0: punch(t, [T.pipes, T.gone8, T.fountain], 0.11), z1: 1, oy: 1100 }), shake(t, [T.gone8, T.fountain], 38)) + bar(t) + pill('SECOND 4');
      }
      const kK = seg(t, T.copper8 - 0.08, T.copper8 + 0.25);
      let s = vgrad('#7ab0e8', '#d8ecf8', 0, 900) + rect(0, 300, 1080, 1360, '#d0785a') + rect(0, 1660, 1080, 300, '#a2a6ac') + rect(310, 620, 460, 1040, '#2a5a7a', 6, 'stroke="#f4efe6" stroke-width="20"') + circ(710, 1160, 26, '#e8c23a');
      s += rect(310, 1590, 460, 70, '#58aef0') + water(t, 540, 1560, 460, 7, 120);
      for (const x of [120, 900]) s += rect(x - 80, 620, 170, 240, '#58aef0', 6, 'stroke="#f4efe6" stroke-width="14"');
      s += person(YOU, 1900, 540, 1.0, 'tense', 'up', Math.sin(t * 8) * 3);
      // key: drawn in the top half, turns to zinc dust
      const kAp = pop(seg(t, T.keys - 0.08, T.keys + 0.1));
      if (kK < 1 && kAp > 0) s += g(`<circle cx="-120" cy="0" r="62" fill="none" stroke="#e8c23a" stroke-width="30"/>` + rect(-62, -14, 240, 28, '#e8c23a', 6) + rect(130, 14, 22, 44, '#e8c23a') + rect(166, 14, 18, 30, '#e8c23a'), `translate(540 680) scale(${kAp}) rotate(-6)`, `opacity="${1 - kK}"`);
      if (t >= T.copper8) s += debris(t, T.copper8, 540, 680, { n: 40, col: '#e8c23a', seed: 30, size: 18 });
      s += chip(540, 500, 'KEY = BRASS = COPPER', pop(seg(t, T.brass - 0.08, T.brass + 0.1)), { size: 44, col: '#fff', bg: '#1d222c' });
      s += hit(540, 600, 'RUN', t < T.keys - 0.08 ? pop(seg(t, T.run - 0.08, T.run + 0.1)) : 0, '#ffffff', -6, 220);
      s += hit(540, 900, 'LOCKED OUT', pop(seg(t, T.locked - 0.08, T.locked + 0.08)), '#ff2a3a', -6, 130);
      s += flash(t, T.run - 0.05, 0.5) + flash(t, T.copper8 - 0.03, 0.55);
      return g(cam(fin(s), 0, { z0: punch(t, [T.run, T.copper8, T.locked], 0.11), z1: 1, oy: 1000 }), shake(t, [T.copper8, T.locked], 38)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 statue
    [C[4], (t) => {
      const kG = seg(t, T.gone10 - 0.08, T.gone10 + 0.14);
      let s = vgrad('#6aa8e8', '#e2eef8', 0, 1620) + rect(0, 1600, 1080, 360, '#2a76d0');
      for (let i = 0; i < 10; i++) s += rect(((t * 160 + i * 140) % 1240) - 120, 1640 + (i % 4) * 70, 110, 10, '#bfe0ff', 5);
      s += `<path d="M340,1660 L360,1500 L720,1500 L740,1660Z" fill="#c8bda8"/>`;
      s += g(statue(kG, t), 'translate(-4 0)');
      s += debris(t, T.gone10, 540, 900, { n: 60, col: '#55b49a', seed: 33, size: 30, spread: 1200 });
      s += chip(540, 1000, '2 PENNIES THICK', pop(seg(t, T.pen - 0.08, T.pen + 0.1)), { size: 56, col: '#fff', bg: CU });
      s += hit(280, 170, 'GONE', pop(seg(t, T.gone10 - 0.06, T.gone10 + 0.1)), '#ff2a3a', -6, 130);
      s += hit(540, 1800, 'LADY LIBERTY', t < T.skel - 0.08 ? 1 : 0, '#ffcf6a', -4, 96);
      s += hit(540, 1800, 'IRON SKELETON', pop(seg(t, T.skel - 0.08, T.skel + 0.1)), '#ffffff', -4, 100);
      s += flash(t, T.gone10 - 0.05, 0.8);
      return g(cam(fin(s, 0.3), seg(t, C[4], C[5]), { z0: punch(t, [T.gone10, T.skel], 0.1), z1: 1.03, ox: 540, oy: 960 }), shake(t, [T.gone10, T.skel], 32)) + bar(t) + pill('SECOND 5');
    }],
    // 11 back + alarms
    [C[5], (t) => {
      let s = street(t, 0, 4);
      const on = t >= T.alarm - 0.05;
      if (on) { const f = Math.floor(t * 8) % 2; s += rect(0, 0, 1080, 1920, f ? '#ff2a3a' : '#ffcf2a', 0, 'opacity="0.42"'); }
      const r = rng(9); for (let i = 0; i < 14 && on; i++) { const x = 90 + r() * 900, y = 180 + r() * 1500; s += g(circ(0, 0, 54, '#c8102e', 'stroke="#fff" stroke-width="10"') + t2(0, 18, '!', 60, '#fff', { weight: 900 }), `translate(${x} ${y}) scale(${0.8 + 0.3 * Math.sin(t * 20 + i)})`); }
      s += hit(540, 620, 'COPPER', pop(seg(t, C[5], C[5] + 0.12)), CU, 5, 170) + hit(540, 790, 'ON', pop(seg(t, C[5], C[5] + 0.12)), '#2fae6a', 5, 190);
      s += hit(540, 980, 'EVERY ALARM', pop(seg(t, T.alarm - 0.08, T.alarm + 0.1)), '#ffffff', -5, 120);
      s += flash(t, C[5], 0.9);
      return g(cam(fin(s, 0.3), 0, { z0: punch(t, [C[5], T.alarm, T.off], 0.13), z1: 1, oy: 1100 }), shake(t, [C[5], T.alarm, T.off], 44, 8)) + pill('COPPER: BACK');
    }],
    // 12 soaked → Greg
    [C[6], (t) => {
      if (t < T.elev - 0.05) {
        let s = vgrad('#9ac4ee', '#e2eef8', 0, 1000) + house(6, 1000) + rect(0, 1000, 1080, 920, '#a2a6ac');
        s += `<ellipse cx="540" cy="1850" rx="430" ry="90" fill="#58aef0" opacity="0.8"/>` + person({ ...YOU, top: '#2a3a52' }, 1850, 540, 1.0, 'tense', 'stand', Math.sin(t * 9) * 2) + water(t, 540, 1000, 300, 12, 760);
        s += chip(290, 560, 'ALIVE', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 58, col: '#fff', bg: '#2fae6a' });
        s += hit(690, 620, 'SOAKED', pop(seg(t, T.soaked - 0.1, T.soaked + 0.1)), '#2a76d0', 5, 130);
        s += flash(t, T.alive - 0.05, 0.3);
        return g(cam(fin(s), 0, { z0: punch(t, [T.alive, T.soaked], 0.1), z1: 1, oy: 1200 }), shake(t, [T.soaked], 24)) + pill('MAIN STREET');
      }
      let s = elevator(t, true, '7', 1);
      s += '';
      s += hit(540, 600, 'EPISODE 2', pop(seg(t, T.ep - 0.08, T.ep + 0.1)), '#ff2a3a', -5, 150);
      s += flash(t, T.elev - 0.05, 0.75) + flash(t, T.ep - 0.03, 0.4, '#ffcf6a');
      return g(cam(fin(s), seg(t, T.elev, C[7]), { z0: punch(t, [T.elev, T.ep], 0.11), z1: 1.06, ox: 780, oy: 1200 }), shake(t, [T.ep], 24)) + pill('ELEVATOR 4');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['ZINC?', 'PAPER?', 'SAND?', 'SALT?', 'LIGHT?', 'SILVER?'];
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
