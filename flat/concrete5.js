// "What if all concrete vanished for five seconds?" — HYPE format.
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, crowd, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + vignette(v);
const car = (x, y, col, s = 1, rot = 0) => g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` + `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#1a2230" opacity="0.85"/>` + circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#8a8e94') + circ(120, 0, 16, '#8a8e94'), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const BAR = '#b0603a';
const bars = (x0, x1, y0, y1, dx, dy, w = 12, col = BAR) => { let s = ''; for (let y = y0; y <= y1; y += dy) s += rect(x0, y - w / 2, x1 - x0, w, col, 3); for (let x = x0; x <= x1; x += dx) s += rect(x - w / 2, y0, w, y1 - y0, shadeBar(col), 3); return s; };
const shadeBar = (c) => (c === BAR ? '#8a4628' : c);
const buildings = (seed, top = 1000) => { const r = rng(seed); let s = '', x = -40; while (x < 1120) { const w = 150 + r() * 130, h = 380 + r() * 380, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8', '#9ac0a0'][Math.floor(r() * 5)]; s += rect(x, top - h, w, h, c); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, top - h + 22 + j * 80, 30, 44, '#2a3a52', 3, 'opacity="0.75"'); x += w + 8; } return s; };
const dirt = (y, seed = 3) => { const r = rng(seed); let s = rect(0, y, 1080, 1960 - y, '#7a5230'); for (let i = 0; i < 60; i++) s += circ(r() * 1080, y + r() * (1920 - y), 4 + r() * 16, ['#5e3e22', '#92683e', '#6a4628'][i % 3], 'opacity="0.8"'); return s; };
const pipes = (y) => rect(0, y, 1080, 34, '#2f6fd6', 8) + rect(0, y + 70, 1080, 18, '#e8c23a', 6) + rect(0, y + 120, 1080, 26, '#c8312b', 6);

export async function init() {
  const W = await (await fetch('/work/concrete5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.4;
  const T = {
    concrete: wt('concrete', 0), news: wt('news', 0), standing: wt('standing', 0),
    sidewalk: wt('sidewalk', 2), road: wt('road', 2), gone2: wt('gone', 2), drop: wt('drop', 2), car: wt('car', 2), lands: wt('lands', 2),
    floor: wt('floor', 4), gone4: wt('gone', 4), steel: wt('steel', 4), congrats: wt('congratulations', 4), bird: wt('birdcage', 4),
    sky: wt('skyscrapers', 6), skel: wt('skeletons', 6), nobody: wt('nobody', 6), work: wt('work', 6),
    dam: wt('hoover', 8), gone8: wt('gone', 8), step: wt('step', 8), pan: wt('pantheon', 8), years: wt('years', 8), hell: wt('hell', 8),
    bus: wt('bus', 10), bars: wt('steel', 10), doors: wt('doors', 10),
    back: wt('back', 11), exactly: wt('exactly', 11),
    alive: wt('alive', 12), shoe: wt('shoe', 12), forever: wt('forever', 12),
    next: wt('next', 13), comment: wt('comment', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  const person = (o, y, x, s, face, pose, tilt = 0) => adult({ ...o, x, y, s, face, pose, tilt });

  const shots = [
    // 0 hook: street, cracks at once, ground gone on "standing"
    [0, (t) => {
      const kG = seg(t, T.standing - 0.1, T.standing + 0.25);
      let s = vgrad('#7ab0e8', '#cfe2f4', 0, 1000) + buildings(4);
      s += kG < 1 ? rect(0, 1000, 1080, 920, '#a2a6ac') + rect(0, 1000, 1080, 34, '#c8ccd2') : '';
      for (let i = 0; i < 6 && kG < 1; i++) s += rect(0, 1120 + i * 150, 1080, 8, '#8a8e94');
      if (kG > 0) s += g(dirt(1000), `translate(0 ${lerp(600, 0, kG)})`) + pipes(1120);
      CROWD.slice(0, 6).forEach((c, i) => { const x = 110 + i * 172, dy = kG * (260 + i * 20); s += person(c, 1790 + dy, x, 0.9, 'tense', 'up', Math.sin(t * 5 + i) * 3); });
      s += crack(t, 0.02, 540, 1500, 4, '#3a3e44') + crack(t, 0.5, 260, 1400, 8, '#3a3e44') + crack(t, T.concrete, 830, 1600, 11, '#3a3e44') + debris(t, 0.02, 540, 1500, { n: 22, col: '#a2a6ac', seed: 2 });
      s += hit(540, 620, 'CONCRETE', pop(seg(t, 0, 0.12)), '#ffffff', -5, 150) + hit(540, 790, 'OFF', pop(seg(t, T.concrete - 0.05, T.concrete + 0.15)), '#ff2a3a', -5, 190);
      s += debris(t, T.standing, 540, 1100, { n: 34, col: '#a2a6ac', seed: 3 }) + flash(t, T.standing - 0.05, 0.6) + flash(t, T.concrete - 0.05, 0.4) + flash(t, 0, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.concrete, T.standing]), z1: 1, oy: 1300 }), shake(t, [0.03, 0.5, T.concrete, T.news, T.standing], 30)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — no sidewalk, no road; you land in dirt, car lands next to you
    [C[0], (t) => {
      const kD = seg(t, T.drop - 0.1, T.drop + 0.3), kC = seg(t, T.car, T.lands + 0.12);
      let s = vgrad('#7ab0e8', '#cfe2f4', 0, 700) + buildings(9, 700) + dirt(700, 5) + pipes(860) + speedLines(t, { a: 0.18, vertical: true, seed: 5 });
      s += rect(0, 700, 1080, 16, '#6a4628');
      s += chip(290, 520, 'SIDEWALK: GONE', pop(seg(t, T.sidewalk - 0.1, T.sidewalk + 0.12)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(790, 660, 'ROAD: GONE', pop(seg(t, T.road - 0.1, T.road + 0.12)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += person(YOU, lerp(1300, 1800, kD), 300, 0.9, 'tense', 'up', kD * 8);
      s += car(760, lerp(-250, 1820, kC * kC), '#d9a23a', 1.1, lerp(-22, 4, kC));
      if (t >= T.drop) s += debris(t, T.drop + 0.2, 300, 1760, { n: 20, col: '#92683e', seed: 6 });
      if (t >= T.lands) s += debris(t, T.lands + 0.1, 760, 1800, { n: 34, col: '#92683e', seed: 7 });
      s += hit(540, 1720, 'THUD', pop(seg(t, T.lands + 0.08, T.lands + 0.2)), '#ffcf6a', -6, 170) + flash(t, T.lands + 0.08, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.sidewalk, T.road, T.drop, T.lands], 0.1), z1: 1, oy: 1300 }), shake(t, [T.sidewalk, T.road, T.drop, T.lands + 0.08], 34)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — apartment: floor gone, only rebar
    [C[1], (t) => {
      const kF = seg(t, T.gone4 - 0.1, T.gone4 + 0.2);
      let s = vgrad('#f0d8a8', '#e0b878', 0, 1920) + rect(120, 620, 290, 380, '#a8c8e8', 6, 'stroke="#fff" stroke-width="14"') + rect(640, 700, 270, 170, '#3a2c22', 8) + rect(660, 720, 230, 130, '#2fae6a', 4);
      s += rect(100, 1500, 500, 170, '#c8312b', 30) + rect(100, 1410, 90, 260, '#a8281f', 26) + rect(510, 1410, 90, 260, '#a8281f', 26);
      if (kF < 1) s += rect(0, 1670, 1080, 300, '#b8bcc2');
      if (kF > 0) { s += rect(0, 1670, 1080, 300, '#3a4250'); s += bars(0, 1080, 1670, 1920, 110, 84, 16); s += person(CROWD[2], 2200 + 40 * Math.sin(t * 5), 720, 0.66, 'tense', 'up'); }
      s += person(YOU, 1670 - 14 * (kF > 0 ? Math.abs(Math.sin(t * 9)) : 0), 780, 0.7, 'tense', kF > 0 ? 'up' : 'stand', Math.sin(t * 7) * 3);
      s += chip(540, 500, 'FLOOR: GONE', pop(seg(t, T.gone4 - 0.05, T.gone4 + 0.12)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(540, 630, 'ONLY STEEL LEFT', pop(seg(t, T.steel - 0.1, T.steel + 0.12)), { size: 44, col: '#ffcf6a', border: '#ffcf6a' });
      s += hit(540, 880, 'BIRDCAGE', pop(seg(t, T.bird - 0.1, T.bird + 0.1)), '#c8102e', -6, 160);
      s += flash(t, T.gone4 - 0.05, 0.7) + debris(t, T.gone4, 540, 1660, { n: 42, col: '#b8bcc2', seed: 12, size: 24 });
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.floor, T.gone4, T.bird], 0.11), z1: 1, oy: 1500 }), shake(t, [T.gone4, T.bird], 34)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — skyline of rebar skeletons
    [C[2], (t) => {
      let s = vgrad('#6aa8e8', '#d8ecf8') + speedLines(t, { a: 0.1, vertical: true, seed: 6 });
      const towers = [[20, 300, 260], [320, 80, 300], [640, 180, 260], [890, 340, 220]];
      towers.forEach(([x, y, w], i) => { s += bars(x, x + w, y, 1920, 52, 90, 10, ['#b0603a', '#9a5230', '#b0603a', '#8a4628'][i]); });
      const r = rng(8);
      const rows = [340, 520, 700, 880, 1400, 1580, 1760];
      for (let i = 0; i < 26; i++) { const [tx, ty, tw] = towers[i % 4]; const yy = rows[Math.floor(r() * rows.length)]; if (yy < ty) continue; const x = tx + 26 + Math.floor(r() * (tw / 52 - 1)) * 52; const sw = Math.sin(t * 6 + i) * 6; s += g(adult({ ...CROWD[i % CROWD.length], x: 0, y: 0, s: 0.3, face: 'tense', pose: 'up', tilt: sw }), `translate(${x} ${yy + 150})`); }
      for (let i = 0; i < 18; i++) { const x0 = r() * 1080, t0 = T.sky + r() * 1.5, d = t - t0; if (d > 0) s += rect(x0 + Math.sin(d * 4 + i) * 60, -40 + 780 * d + 80 * d * d, 36, 44, '#ffffff', 2, `transform="rotate(${d * 180 + i * 20} ${x0} ${400})"`); }
      s += hit(540, 620, 'SKELETONS', pop(seg(t, T.skel - 0.1, T.skel + 0.1)), '#c8102e', -5, 130);
      s += chip(540, 800, 'WORK: CANCELLED', pop(seg(t, T.work - 0.1, T.work + 0.1)), { size: 48, col: '#fff', bg: '#1d222c' });
      s += flash(t, T.sky, 0.5);
      return g(cam(fin(s, 0.35), seg(t, C[2], N[3]), { z0: 1.0, z1: 1.14, ox: 540, oy: 1000 }), shake(t, [T.sky, T.skel, T.work], 28)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — Hoover Dam -> Pantheon
    [C[3], (t) => {
      const panOn = t >= T.pan - 0.06;
      if (!panOn) {
        const kD = seg(t, T.gone8 - 0.08, T.gone8 + 0.18), kW = seg(t, T.step - 0.1, T.step + 0.5);
        let s = vgrad('#7ab8ee', '#d8ecf8', 0, 900) + `<path d="M0,500 L320,760 L320,1920 L0,1920Z M1080,500 L760,760 L760,1920 L1080,1920Z" fill="#b86a3e"/>` + `<path d="M0,620 L260,820 L260,1920 L0,1920Z M1080,620 L820,820 L820,1920 L1080,1920Z" fill="#9a5230"/>`;
        s += rect(320, 900, 440, 1100, '#7a5a3a') + rect(320, 1600, 440, 400, '#3a7a5a');
                const front = lerp(960, 1720, kW * kW);
        s += rect(320, 760, 440, front - 760, '#2a76d0') + rect(320, front - 24, 440, 34, '#e8f4ff', 6, 'opacity="0.9"');
        if (kD < 1) s += g(rect(0, 0, 440, 300, '#c8c4bc') + [...Array(4)].map((_, i) => rect(0, 60 + i * 60, 440, 6, '#a8a4a0')).join(''), `translate(320 ${820 + kD * 40}) scale(1 ${1 - kD})`);
        s += hit(540, 660, 'DAM: GONE', pop(seg(t, T.gone8 - 0.05, T.gone8 + 0.12)), '#ff2a3a', -6, 130);
        s += chip(540, 500, 'LAKE MEAD', pop(seg(t, T.step - 0.15, T.step + 0.1)), { size: 56, col: '#fff', bg: '#2a76d0' });
        s += flash(t, T.gone8 - 0.05, 0.75) + debris(t, T.gone8, 540, 900, { n: 40, col: '#c8c4bc', seed: 14, size: 26 });
        return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.dam, T.gone8, T.step], 0.12), z1: 1, oy: 1000 }), shake(t, [T.gone8, T.step], 36)) + bar(t) + pill('SECOND 4');
      }
      const kP = seg(t, T.pan - 0.06, T.pan + 0.3);
      let s = vgrad('#ffd9a0', '#f4a868') + rect(0, 1560, 1080, 400, '#d8c8a8') + speedLines(t, { a: 0.1, seed: 10 });
      s += `<path d="M140,1020 A400,400 0 0 1 940,1020 Z" fill="#cfc6b2" opacity="${1 - kP}"/>`;
      s += `<path d="M140,1020 A400,400 0 0 1 940,1020" fill="none" stroke="#7a5a3a" stroke-width="10" stroke-dasharray="26 22" opacity="${kP}"/>`;
      s += rect(140, 1020, 800, 100, '#b8ad96') + `<path d="M160,1020 L540,860 L920,1020Z" fill="#a89c84" opacity="${1 - kP * 0.4}"/>`;
      for (let i = 0; i < 8; i++) s += rect(170 + i * 102, 1120, 58, 440, '#d8cdb6', 4);
      s += debris(t, T.pan, 540, 900, { n: 46, col: '#cfc6b2', seed: 21, size: 26 });
      s += bigText(540, 500, '1900 YEARS', pop(seg(t, T.years - 0.1, T.years + 0.1)), { size: 150, col: '#fff', stroke: '#5a1a08' });
      s += hit(540, 720, 'HELL OF A RUN', pop(seg(t, T.hell - 0.08, T.hell + 0.12)), '#c8102e', -5, 96);
      s += flash(t, T.pan - 0.05, 0.8);
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.pan, T.hell], 0.12), z1: 1, oy: 1100 }), shake(t, [T.pan, T.hell], 34)) + bar(t) + pill('ROME');
    }],
    [N[4], card(5)],
    // 10 — bus on a bridge of bars
    [C[4], (t) => {
      let s = vgrad('#7ab0e8', '#d8ecf8', 0, 1400) + rect(0, 1420, 1080, 540, '#3a8fd0') + [...Array(10)].map((_, i) => rect(((t * 140 + i * 130) % 1200) - 100, 1460 + (i % 4) * 90, 90, 10, '#bfe0ff', 5)).join('');
      s += `<path d="M-40,1120 Q540,1290 1120,1120" fill="none" stroke="${BAR}" stroke-width="18"/><path d="M-40,1200 Q540,1370 1120,1200" fill="none" stroke="#8a4628" stroke-width="18"/>`;
      for (let i = 0; i < 16; i++) { const x = i * 76; const u = x / 1080; const y = 1120 + 170 * 4 * u * (1 - u) * 0.5; s += rect(x - 6, y, 12, 82, '#8a4628'); }
      const tilt = -9 + Math.sin(t * 4.5) * 7;
      s += g(rect(-300, -300, 600, 300, '#d9a23a', 32) + rect(-300, -190, 600, 40, '#c8312b') + [...Array(5)].map((_, i) => rect(-260 + i * 104, -274, 82, 76, '#1a2a44', 8)).join('') + rect(190, -274, 80, 240, '#3a5a7a', 6, 'stroke="#1a2230" stroke-width="8"') + circ(-180, 6, 56, '#141618') + circ(180, 6, 56, '#141618') + circ(-180, 6, 24, '#8a8e94') + circ(180, 6, 24, '#8a8e94'), `translate(540 1205) rotate(${tilt})`);
      s += chip(540, 540, 'BRIDGE: STEEL ONLY', pop(seg(t, T.bars - 0.15, T.bars + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += hit(540, 760, 'DOORS: CLOSED', pop(seg(t, T.doors - 0.1, T.doors + 0.12)), '#1d222c', 5, 100);
      s += flash(t, T.bus, 0.35);
      return g(cam(fin(s, 0.35), seg(t, C[4], C[5]), { z0: 1.0, z1: 1.1, ox: 540, oy: 1150 }), shake(t, [T.bars, T.doors], 28)) + bar(t) + pill('SECOND 5');
    }],
    // 11 — concrete is back
    [C[5], (t) => {
      let s = vgrad('#9ac4ee', '#e2eef8', 0, 1000) + buildings(4) + rect(0, 1000, 1080, 920, '#a2a6ac') + rect(0, 1000, 1080, 34, '#c8ccd2');
      for (let i = 0; i < 6; i++) s += rect(0, 1120 + i * 150, 1080, 8, '#8a8e94');
            CROWD.slice(0, 5).forEach((c, i) => { s += person(c, 1820, 130 + i * 205, 0.9, 'tense', 'up', Math.sin(t * 5 + i) * 3); });
      s += hit(540, 620, 'CONCRETE', pop(seg(t, C[5], C[5] + 0.12)), '#ffffff', 5, 150) + hit(540, 780, 'ON', pop(seg(t, C[5], C[5] + 0.12)), '#2fae6a', 5, 190);
      s += chip(540, 950, 'EXACTLY WHERE IT WAS', pop(seg(t, T.exactly - 0.1, T.exactly + 0.12)), { size: 42, col: '#fff', bg: '#1d222c' });
      s += flash(t, C[5], 0.95) + debris(t, C[5], 540, 1100, { n: 44, col: '#c8ccd2', seed: 18, size: 22 });
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [C[5], T.exactly], 0.13), z1: 1, oy: 1300 }), shake(t, [C[5], T.exactly], 42, 8)) + pill('CONCRETE: BACK');
    }],
    // 12 — shoe stuck in the sidewalk
    [C[6], (t) => {
      let s = vgrad('#9ac4ee', '#e2eef8', 0, 1380) + buildings(6, 1380) + rect(0, 1380, 1080, 600, '#a2a6ac') + rect(0, 1380, 1080, 30, '#c8ccd2');
      s += person(YOU, 1380, 280, 0.75, 'tense', 'stand', -6);
      const k = pop(seg(t, T.shoe - 0.1, T.shoe + 0.15));
      s += g(`<path d="M-200,70 C-200,-30 -130,-50 -60,-50 L60,-50 C110,-20 200,0 230,50 L230,80 L-200,80 Z" fill="#c8312b"/>` + rect(-200, 60, 430, 28, '#f4f0e8', 8) + [...Array(4)].map((_, i) => rect(-70 + i * 52, -36, 40, 10, '#f4f0e8', 4)).join(''), `translate(680 ${lerp(1380, 1390, k)}) scale(${lerp(0.8, 1.3, k)}) rotate(-4)`);
      s += rect(0, 1470, 1080, 90, '#a2a6ac');
      s += crack(t, T.shoe, 680, 1500, 23, '#6a6e74');
      s += chip(280, 560, 'ALIVE', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 56, col: '#fff', bg: '#2fae6a' });
      s += hit(640, 720, 'FOREVER', pop(seg(t, T.forever - 0.1, T.forever + 0.12)), '#c8102e', -6, 130);
      s += flash(t, T.shoe, 0.3);
      return g(cam(fin(s, 0.35), seg(t, C[6], C[7]), { z0: 1.0, z1: 1.12, ox: 680, oy: 1400 }), shake(t, [T.shoe, T.forever], 26)) + pill('MAIN STREET');
    }],
    // 13 — CTA
    [C[7], (t) => {
      const opts = ['COPPER?', 'PAPER?', 'SAND?', 'WIRES?', 'SALT?', 'LIGHT?'];
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
