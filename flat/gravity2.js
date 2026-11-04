// "What if gravity doubled for five seconds?" — HYPE format (countdown cards, hard cuts, shake/flash/punch).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const fin = (s, v = 0.45) => s + grade('#0b1a2e', '#2e1a0b', 0.1) + vignette(v);
const lying = (o) => g(adult({ ...o, x: 0, y: 0, s: 1 }), `translate(${o.x} ${o.y}) rotate(${o.rot || -90}) scale(${o.s})`);
const street = (s, sky = ['#7ab0e8', '#cfe2f4']) => {
  s += vgrad(sky[0], sky[1], 0, 1000); const r = rng(6); let x = -40;
  while (x < 1120) { const w = 150 + r() * 130, h = 380 + r() * 380, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8', '#9ac0a0'][Math.floor(r() * 5)]; s += rect(x, 1000 - h, w, h, c); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, 1000 - h + 22 + j * 80, 30, 44, '#2a3a52', 3, 'opacity="0.75"'); x += w + 8; }
  return s + rect(0, 1000, 1080, 920, '#8a8e96') + rect(0, 1000, 1080, 40, '#b4b8c0');
};
const chair = (x, y, k, col = '#c8312b') => { // k = 0 intact … 1 snapped
  const l = (dx, dir) => rect(dx - 8, 0, 16, 150, '#3a3e46', 4, `transform="rotate(${dir * 70 * k} ${dx} 0)"`);
  return g(l(-70, -1) + l(70, 1) + rect(-90, -20 - 0, 180, 26, col, 8) + rect(60, -190, 24, 180, col, 8, `transform="rotate(${30 * k} 72 -10)"`), `translate(${x} ${y + 120 * k}) rotate(${-8 * k})`);
};
const plane = (x, y, rot = 0, s = 1) => g(`<path d="M-300,0 Q-300,-40 -240,-44 L230,-44 Q300,-40 320,0 Q300,40 230,44 L-240,44 Q-300,40 -300,0Z" fill="#f2f4f7"/>` + `<path d="M-40,10 L-160,190 L-90,190 L80,10Z" fill="#c9d0da"/>` + `<path d="M-40,-10 L-120,-150 L-70,-150 L60,-10Z" fill="#dfe4ea"/>` + `<path d="M-250,-40 L-300,-150 L-250,-150 L-190,-40Z" fill="#c8102e"/>` + [...Array(9)].map((_, i) => rect(-180 + i * 42, -18, 22, 18, '#2a3a52', 6)).join('') + rect(-300, 8, 620, 8, '#c8102e'), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const cloud = (x, y, s = 1, a = 0.9) => g(circ(0, 0, 70, '#ffffff') + circ(70, 10, 55, '#ffffff') + circ(-70, 15, 50, '#ffffff') + rect(-110, 10, 230, 55, '#ffffff', 27), `translate(${x} ${y}) scale(${s})`, `opacity="${a}"`);
const plate = (x, y, rot = 0, col = '#f4f1ea') => g(`<ellipse cx="0" cy="0" rx="46" ry="12" fill="${col}" stroke="#c9c2b4" stroke-width="3"/>`, `translate(${x} ${y}) rotate(${rot})`);

export async function init() {
  const W = await (await fetch('/work/gravity2/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 1.2;
  const T = {
    gravity: wt('gravity', 0), doubled: wt('doubled', 0), news: wt('news', 0), twice: wt('twice', 0), heavy: wt('heavy', 0),
    knees: wt('knees', 2), hits: wt('hits', 2), floor: wt('floor', 2), chairs: wt('chairs', 2), snapped: wt('snapped', 2),
    shelf: wt('shelf', 4), double: wt('double', 4), kitchen: wt('kitchen', 4), gone: wt('gone', 4),
    drops: wt('drops', 6), hundred: wt('hundred', 6), inside: wt('inside', 6), coffee: wt('coffee', 6), spill: wt('spill', 6),
    bungee: wt('bungee', 8), lower: wt('lower', 8), hair: wt('hair', 8), river: wt('river', 8), lower2: wt('lower', 8, 1),
    benching: wt('benching', 10), max: wt('max', 10), doubled2: wt('doubled', 10), safety: wt('safety', 10), pins: wt('pins', 10), thank: wt('thank', 10),
    back: wt('back', 11), pushing: wt('pushing', 11), jumps: wt('jumps', 11), accident: wt('accident', 11),
    scale: wt('scale', 12), three: wt('three', 12), diet: wt('diet', 12), five: wt('five', 12), man: wt('man', 12),
    next: wt('next', 13), comments: wt('comments', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);             // countdown cards
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);  // content shots
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 — hook: gravity doubles, the whole street gets slammed down
    [0, (t) => {
      const kD = seg(t, T.doubled - 0.1, T.doubled + 0.25), kH = seg(t, T.heavy - 0.2, T.heavy + 0.15);
      let s = street('');
      if (kD > 0) s += speedLines(t, { a: 0.35 * kD, vertical: true, seed: 2 });
      s += crack(t, T.doubled, 540, 1600, 3, '#3a3e46') + crack(t, T.heavy, 260, 1760, 8, '#3a3e46') + crack(t, T.heavy + 0.05, 840, 1740, 12, '#3a3e46');
      CROWD.forEach((c, i) => { const x = 110 + i * 172;
        if (kH > 0) s += g(adult({ ...c, x: 0, y: 0, s: 0.9, face: 'open', pose: 'up', tilt: (i % 2 ? 8 : -8) }), `translate(${x} 1850) scale(${lerp(1.06, 1.3, kH)} ${lerp(0.9, 0.5, kH)})`);
        else s += g(adult({ ...c, x: 0, y: 0, s: 0.9, face: kD > 0 ? 'tense' : 'neutral', pose: kD > 0 ? 'hold' : 'stand', tilt: Math.sin(t * 4 + i) * 2 }), `translate(${x} 1850) scale(${1 + 0.06 * kD} ${1 - 0.1 * kD})`); });
      s += debris(t, T.heavy, 540, 1800, { n: 30, col: '#6a6e76', seed: 3 });
      s += stamp(540, 600, 'GRAVITY: x2', seg(t, T.gravity - 0.05, T.gravity + 0.25), '#ff2a3a', -7, 78);
      s += bigText(540, 860, 'x2', pop(seg(t, T.twice - 0.05, T.twice + 0.2)), { size: 260, col: '#ffcf6a', rot: 6 });
      s += flash(t, T.doubled - 0.05, 0.6) + flash(t, T.heavy, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.doubled, T.heavy], 0.1), z1: 1, oy: 1400 }), shake(t, [T.doubled, T.heavy], 30)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — knees fold, everyone hits the floor, cheap chairs snap
    [C[0], (t) => {
      let s = vgrad('#f2d8b0', '#e0b884') + rect(0, 1560, 1080, 360, '#9a6a44') + rect(0, 1560, 1080, 18, '#7a5234');
      s += rect(80, 520, 300, 260, '#ffffff', 10, 'opacity="0.35"') + rect(700, 480, 280, 340, '#ffffff', 10, 'opacity="0.35"');
      s += speedLines(t, { a: 0.18, vertical: true, seed: 6 });
      const kF = seg(t, T.hits - 0.1, T.hits + 0.2), kS = seg(t, T.snapped - 0.1, T.snapped + 0.15);
      // standing people collapse
      [[CROWD[0], 170], [CROWD[3], 400]].forEach(([c, x], i) => { s += kF > 0 ? lying({ ...c, x: lerp(x, i ? 380 : 40, kF), y: i ? 1880 : 1790, s: 0.92, face: 'tense', rot: lerp(0, 85, kF) }) : adult({ ...c, x, y: 1830, s: 0.92, face: 'tense', pose: t > T.knees ? 'hold' : 'stand' }); });
      // two people on cheap chairs
      [[CROWD[1], 680, '#2f6fd6'], [CROWD[4], 900, '#d9a23a']].forEach(([c, x, col], i) => { s += chair(x, 1560 - 150, kS, col) + adult({ ...c, x, y: 1700 + 170 * kS, s: 0.82, face: kS > 0 ? 'open' : 'tense', pose: 'sit', tilt: kS * (i ? 10 : -10) }); });
      s += debris(t, T.snapped, 790, 1560, { n: 28, col: '#3a3e46', seed: 5, size: 22 }) + debris(t, T.hits, 280, 1600, { n: 16, col: '#7a5234', seed: 2 });
      s += chip(540, 560, 'KNEES: FOLDED', pop(seg(t, T.knees - 0.1, T.knees + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(540, 720, 'YOU WEIGH 200%', pop(seg(t, T.floor - 0.1, T.floor + 0.1)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
      s += stamp(540, 940, 'SNAPPED', seg(t, T.snapped - 0.05, T.snapped + 0.2), '#c8102e', -8, 84);
      s += flash(t, T.hits - 0.05, 0.4) + flash(t, T.snapped, 0.6);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.hits, T.snapped], 0.1), z1: 1, oy: 1400 }), shake(t, [T.knees, T.hits, T.snapped], 30)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — shelves holding double: the whole kitchen comes down
    [C[1], (t) => {
      let s = vgrad('#dff0f0', '#a8d0d4') + rect(0, 1560, 1080, 360, '#e8e2d4') + [...Array(10)].map((_, i) => rect(i * 110, 1560, 4, 360, '#cfc8b8')).join('');
      s += rect(60, 1180, 960, 380, '#f2f4f7', 8) + rect(60, 1160, 960, 30, '#9aa3b2', 6) + rect(160, 1260, 300, 260, '#e2e6ec', 6) + rect(620, 1260, 300, 260, '#e2e6ec', 6);
      const kB = seg(t, T.double - 0.1, T.double + 0.3), dG = Math.max(0, t - T.gone + 0.1);
      const r = rng(9);
      for (let i = 0; i < 3; i++) {
        const y0 = 520 + i * 200, sag = 40 * kB, fall = dG > 0 ? Math.min(1500 - y0, 2600 * dG * dG) : 0, rot = dG > 0 ? Math.min(25, dG * 60) * (i % 2 ? 1 : -1) : sag * 0.15 * (i % 2 ? 1 : -1);
        let row = rect(-400, 0, 800, 24, '#6a4a2a', 4);
        for (let j = 0; j < 7; j++) { const jx = -340 + j * 112; row += i === 1 ? rect(jx - 22, -110, 44 + (j % 3) * 6, 110, ['#c8312b', '#2f6fd6', '#d9a23a', '#2fae6a'][j % 4], 4) : [0, 1, 2].map((k) => plate(jx, -14 - k * 14)).join(''); }
        s += g(row, `translate(540 ${y0 + sag + fall}) rotate(${rot})`);
        if (dG <= 0) s += rect(130, y0 + 24, 22, 60, '#5a5e66', 4, `transform="rotate(${kB * 30} 141 ${y0 + 24})"`) + rect(928, y0 + 24, 22, 60, '#5a5e66', 4, `transform="rotate(${-kB * 30} 939 ${y0 + 24})"`);
      }
      s += debris(t, T.gone + 0.15, 540, 1540, { n: 40, col: '#f4f1ea', seed: 7, size: 24, spread: 1100 }) + debris(t, T.gone + 0.2, 400, 1540, { n: 18, col: '#c8312b', seed: 3, size: 20 });
      s += chip(540, 600, 'LOAD: 200%', pop(seg(t, T.double - 0.1, T.double + 0.1)), { size: 46, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 1000, 'GONE', seg(t, T.gone - 0.05, T.gone + 0.2), '#c8102e', 7, 110);
      s += crack(t, T.gone + 0.15, 540, 1640, 4, '#7a7468') + flash(t, T.gone + 0.15, 0.7);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.double, T.gone + 0.15], 0.1), z1: 1, oy: 1100 }), shake(t, [T.double, T.gone + 0.15], 36)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — planes drop a hundred meters; inside the coffee is fine
    [C[2], (t) => {
      let s;
      if (t < T.inside - 0.05) {
        const kP = seg(t, T.drops - 0.25, T.hundred + 0.6);
        s = vgrad('#4a90d8', '#bfe0fa');
        const r = rng(3); for (let i = 0; i < 7; i++) s += cloud(r() * 1080, ((r() * 2200 - t * 900 * (0.3 + kP)) % 2200 + 2200) % 2200 - 150, 0.8 + r() * 0.8, 0.85);
        s += speedLines(t, { a: 0.45 * kP, vertical: true, dir: -1, seed: 4 });
        s += plane(540, lerp(760, 1060, kP) + Math.sin(t * 30) * 8 * kP, -8 * kP, 1.25);
        s += chip(540, 520, '-100 M', pop(seg(t, T.hundred - 0.15, T.hundred + 0.05)), { size: 60, col: '#fff', bg: '#c8102e' });
        s += bigText(860, 1560, 'DROP', pop(seg(t, T.drops - 0.05, T.drops + 0.15)), { size: 150, col: '#ffcf6a', rot: -8 });
        s += flash(t, T.drops - 0.05, 0.45);
      } else {
        s = vgrad('#e8e2d8', '#c8bfae') + rect(140, 420, 360, 520, '#5a6270', 120) + rect(170, 450, 300, 460, '#7ab0e8', 100);
        const r = rng(8); let cl = ''; for (let i = 0; i < 5; i++) cl += cloud(320 + (r() - 0.5) * 200, ((r() * 700 - t * 1400) % 700 + 700) % 700 + 380, 0.5, 0.95);
        s += `<defs><clipPath id="winclip"><rect x="170" y="450" width="300" height="460" rx="100"/></clipPath></defs><g clip-path="url(#winclip)">${cl}</g>`;
        s += rect(170, 450, 300, 460, 'none', 100, 'stroke="#5a6270" stroke-width="30"') + speedLines(t, { a: 0.25, vertical: true, dir: -1, seed: 5 });
        s += rect(60, 1460, 960, 40, '#8a8e96', 10) + rect(80, 1500, 920, 300, '#6a6e76', 10);
        s += g(rect(-110, -200, 220, 230, '#ffffff', 26) + rect(-100, -190, 200, 30, '#6a3a1a', 12) + `<path d="M110,-150 q90,10 70,90 q-10,40 -70,40" stroke="#ffffff" stroke-width="26" fill="none"/>`, 'translate(620 1460)');
        s += chip(760, 1000, 'COFFEE: FINE', pop(seg(t, T.coffee - 0.1, T.coffee + 0.1)), { size: 44, col: '#fff', bg: '#2fae6a' });
        s = g(s, `rotate(${(Math.sin(t * 13) * 2.5).toFixed(2)} 540 960) translate(540 960) scale(1.08) translate(-540 -960)`);
        s += stamp(780, 620, 'ZERO SPILL', seg(t, T.spill - 0.05, T.spill + 0.2), '#2fae6a', 8, 64);
        s += flash(t, T.inside - 0.05, 0.7);
      }
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.drops, T.inside], 0.1), z1: 1, oy: 1000 }), shake(t, [T.drops, T.hundred, T.inside], 28)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — bungee jumpers go way lower: hair in the river
    [C[3], (t) => {
      let s = vgrad('#7ac0f0', '#d8eefa', 0, 1700) + rect(0, 1700, 1080, 220, '#2f7aa8') + rect(0, 1700, 1080, 14, '#9ad0ec');
      s += `<path d="M0,1500 L260,1180 L420,1700 L0,1700Z" fill="#6a8a5a"/><path d="M1080,1450 L820,1150 L640,1700 L1080,1700Z" fill="#5a7a4a"/>`;
      s += rect(0, 470, 1080, 70, '#5a5e66') + rect(0, 540, 1080, 20, '#3a3e46') + [...Array(6)].map((_, i) => rect(40 + i * 200, 380, 14, 90, '#3a3e46')).join('') + rect(0, 380, 1080, 12, '#3a3e46');
      // promised line
      s += `<line x1="80" y1="980" x2="1000" y2="980" stroke="#ffffff" stroke-width="5" stroke-dasharray="24 18" opacity="0.8"/>` + t2(980, 960, 'PROMISED', 34, '#ffffff', { weight: 900, anchor: 'end', ls: 3 });
      const fall = seg(t, C[3], T.lower - 0.1), deep = seg(t, T.lower - 0.1, T.hair + 0.1);
      const sc = 0.8, headOff = 500 * sc; // inverted: head below feet
      const feetY = lerp(560, 980 - headOff, Math.min(1, fall * 1.4)) + deep * (1700 - 980) + Math.sin(t * 9) * 6 * deep;
      s += `<path d="M540,560 L540,${feetY.toFixed(0)}" stroke="#ff4a3a" stroke-width="${lerp(14, 6, deep)}" stroke-dasharray="${deep > 0 ? '30 6' : ''}"/>`;
      s += g(adult({ ...YOU, x: 0, y: 0, s: sc, face: deep > 0.5 ? 'open' : 'tense', pose: 'up' }), `translate(540 ${feetY.toFixed(0)}) rotate(180)`);
      const dS = t - T.hair; if (dS > 0 && dS < 1.6) { const r = rng(4); for (let i = 0; i < 18; i++) { const a = -Math.PI * (0.1 + 0.8 * r()), v = 500 + r() * 500; s += circ(540 + Math.cos(a) * v * dS, 1700 + Math.sin(a) * v * dS + 900 * dS * dS, 10 + r() * 10, '#bfe6ff', `opacity="${Math.max(0, 1 - dS / 1.6)}"`); } }
      s += chip(540, 680, 'CORD STRETCH: x2', pop(seg(t, T.bungee - 0.1, T.bungee + 0.1)), { size: 42, col: '#fff', bg: '#c8102e' });
      s += stamp(300, 900, 'WET HAIR', seg(t, T.river - 0.05, T.river + 0.2), '#2f6fd6', -8, 70);
      s += flash(t, T.hair, 0.5);
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.lower, T.hair], 0.1), z1: 1, oy: 1500 }), shake(t, [T.lower, T.hair], 26)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 — gym guy, max doubled, bar on the safety pins
    [C[4], (t) => {
      let s = vgrad('#3a4a5e', '#1e2836') + rect(0, 1640, 1080, 280, '#2a2e36') + glow(540, 700, 600, '#ffcf8a', 0.25);
      s += [...Array(5)].map((_, i) => rect(i * 230 + 30, 500, 150, 300, '#4a5a6e', 8)).join('');
      s += rect(170, 960, 26, 680, '#9aa3b2') + rect(884, 960, 26, 680, '#9aa3b2') + rect(140, 1440, 86, 22, '#ffcf6a', 4) + rect(854, 1440, 86, 22, '#ffcf6a', 4);
      s += rect(300, 1520, 480, 40, '#1b1c20', 12) + rect(520, 1560, 30, 80, '#3a3e46');
      s += lying({ ...CROWD[1], x: 820, y: 1505, s: 0.95, face: t > T.doubled2 ? 'tense' : 'neutral', pose: 'up', rot: -90 });
      const kDrop = seg(t, T.doubled2 - 0.05, T.safety - 0.1), shakeBar = t < T.doubled2 ? Math.sin(t * 40) * 6 : 0;
      const by = lerp(1110, 1418, kDrop * kDrop) + shakeBar;
      s += rect(80, by - 8, 920, 16, '#c9d0da', 8) + [130, 215, 865, 950].map((x, i) => rect(x - 18, by - (i % 3 ? 100 : 130), 36, i % 3 ? 200 : 260, '#c8102e', 8)).join('');
      s += debris(t, T.safety - 0.1, 540, by, { n: 18, col: '#c9d0da', seed: 6, size: 14 });
      s += chip(540, 560, 'HIS MAX: x2', pop(seg(t, T.max - 0.1, T.max + 0.1)), { size: 46, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 820, 'SAFETY PINS', seg(t, T.pins - 0.1, T.pins + 0.2), '#2fae6a', -6, 72);
      s += flash(t, T.safety - 0.1, 0.6);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.doubled2, T.safety], 0.1), z1: 1, oy: 1300 }), shake(t, [T.doubled2, T.safety - 0.1], 34)) + bar(t) + pill('SECOND 5');
    }],
    // 11 — gravity is back: everyone pushing off the floor launches
    [C[5], (t) => {
      let s = street('', ['#9ac4ee', '#e2eef8']);
      s += chair(230, 1830, 1, '#2f6fd6') + chair(880, 1840, 1, '#d9a23a');
      CROWD.forEach((c, i) => { const x = 110 + i * 172, d = t - (T.jumps - 0.15 + i * 0.05), h = d > 0 && d < 0.8 ? 300 * Math.sin(Math.PI * d / 0.8) : 0; s += adult({ ...c, x, y: 1880 - h, s: 0.7, face: h > 0 ? 'open' : 'tense', pose: h > 0 ? 'up' : 'sit', tilt: h > 0 ? (i % 2 ? 10 : -10) : 0 }); });
      if (t > T.jumps - 0.15 && t < T.jumps + 0.8) s += speedLines(t, { a: 0.3, vertical: true, dir: -1, seed: 8 });
      s += stamp(540, 620, 'GRAVITY: NORMAL', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 70);
      s += chip(540, 820, 'BY ACCIDENT', pop(seg(t, T.accident - 0.1, T.accident + 0.1)), { size: 44, col: '#fff', bg: '#1d222c' });
      s += flash(t, C[5], 0.9, '#d8ffe6');
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.jumps], 0.12), z1: 1, oy: 1500 }), shake(t, [C[5], T.jumps], 34, 9)) + pill('GRAVITY: BACK');
    }],
    // 12 — the guy on the scale
    [C[6], (t) => {
      let s = vgrad('#e8f2f6', '#c4dce6') + [...Array(10)].map((_, i) => rect(i * 110, 0, 4, 1920, '#b4ccd6')).join('') + [...Array(18)].map((_, i) => rect(0, i * 110, 1080, 4, '#b4ccd6')).join('');
      const kN = seg(t, T.three - 0.05, T.three + 0.1);
      s += rect(240, 440, 600, 300, '#141a22', 30) + t2(540, 650, kN > 0 ? '164 KG' : '82 KG', 150, kN > 0 ? '#ff3b3b' : '#7aff9a', { weight: 900 });
      s += t2(540, 500, 'SECOND 3', 30, '#9aa3b2', { weight: 800, ls: 6 });
      s += rect(330, 1830, 420, 60, '#f2f4f7', 18, 'stroke="#9aa3b2" stroke-width="6"');
      s += adult({ ...YOU, x: 540, y: 1830, s: 1.65, face: t > T.three ? 'open' : 'neutral', pose: t > T.diet - 0.1 ? 'cross' : 'stand' });
      s += chip(540, 1500, 'DIET: STARTED', pop(seg(t, T.diet - 0.1, T.diet + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 850, 'IT WAS 5 SECONDS', seg(t, T.five - 0.05, T.five + 0.2), '#2f6fd6', -5, 56);
      s += flash(t, T.three - 0.05, 0.5);
      return g(cam(fin(s, 0.35), seg(t, C[6], C[7]), { z0: punch(t, [T.three], 0.1), z1: 1.06, oy: 900 }), shake(t, [T.three, T.man], 22)) + pill('BATHROOM · SOMEWHERE');
    }],
    // 13 — CTA
    [C[7], (t) => {
      const opts = ['SPEED?', 'TIME?', 'HEAT?', 'SOUND?', 'SIZE?', 'RENT?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'DOUBLES', 1, { size: 170, col: '#ffcf6a' }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1560, opts[i], 1, { size: 130, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
