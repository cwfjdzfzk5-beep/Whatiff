// "What if the air turned into helium for five seconds?" — HYPE format.
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const HE = '#b45cff';
const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const BOSS = { skin: '#efc29d', hair: '#8a8a92', hairStyle: 'short', top: '#2a3550', pants: '#22252c' };
const car = (x, y, col, s = 1, rot = 0, lights = 1) => g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` + `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#1a2230" opacity="0.85"/>` + circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#8a8e94') + circ(120, 0, 16, '#8a8e94') + rect(190, -70, 20, 16, lights ? '#ffe9a8' : '#5a5a50', 4), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const puff = (t, x, y, on, seed = 1) => { if (!on) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < 5; i++) { const p = ((t * 1.6 + i / 5) % 1); s += circ(x - p * 160 + r() * 10, y - p * 40, 14 + p * 40, '#d8dce2', `opacity="${(0.7 * (1 - p)).toFixed(2)}"`); } return s; };
const town = (seed, top = 1000) => { const r = rng(seed); let s = '', x = -30; while (x < 1120) { const w = 170 + r() * 120, h = 300 + r() * 360, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8', '#9ac0a0'][Math.floor(r() * 5)]; s += rect(x, top - h, w, h, c); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, top - h + 22 + j * 80, 30, 44, '#2a3a52', 3, 'opacity="0.7"'); x += w + 8; } return s; };
const plane = (x, y, s = 1, rot = 0, col = '#f4f6fa') => g(
  `<path d="M-60,-10 L-160,-150 L-110,-150 L40,-10Z" fill="#c8ccd6"/>` + rect(-300, -40, 600, 80, col, 40) + `<path d="M-300,-30 L-360,-140 L-300,-140 L-230,-30Z" fill="#c8102e"/>` + `<path d="M-60,10 L-180,170 L-120,170 L40,10Z" fill="#dfe3ea"/>` +
  [...Array(9)].map((_, i) => circ(-180 + i * 48, -8, 9, '#2a3a52')).join('') + `<path d="M260,-30 Q300,-30 300,0 L240,0Z" fill="#2a3a52"/>`,
  `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const bird = (x, y, s, rot, flap) => g(`<ellipse cx="0" cy="0" rx="34" ry="20" fill="#3a3f4a"/>` + circ(30, -12, 14, '#3a3f4a') + `<path d="M40,-12 l18,4 l-18,5Z" fill="#e8a23a"/>` + `<path d="M-10,-6 Q-30,${-40 * flap} -60,${-30 * flap}" stroke="#3a3f4a" stroke-width="12" fill="none" stroke-linecap="round"/>`, `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const balloon = (x, y, col, s = 1, rot = 0) => g(`<path d="M0,70 Q-14,120 6,170 Q20,210 0,250" stroke="#e8ecf2" stroke-width="3" fill="none"/>` + `<ellipse cx="0" cy="0" rx="58" ry="70" fill="${col}"/>` + `<ellipse cx="-20" cy="-26" rx="12" ry="20" fill="#ffffff" opacity="0.45"/>` + `<path d="M-8,70 L8,70 L0,82Z" fill="${col}"/>`, `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const blimp = (x, y, s = 1, rot = 0) => g(`<ellipse cx="0" cy="0" rx="380" ry="130" fill="#c4cad4"/>` + `<ellipse cx="0" cy="-40" rx="340" ry="70" fill="#dde2ea"/>` + `<path d="M-330,-40 L-440,-150 L-380,-150 L-300,-60Z M-330,40 L-440,150 L-380,150 L-300,60Z" fill="#c8102e"/>` + rect(-90, 120, 180, 60, '#3a4250', 18) + [...Array(4)].map((_, i) => rect(-70 + i * 40, 134, 26, 22, '#9fc4ff', 4)).join(''), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const flame = (x, y, k, s = 1, t = 0) => k <= 0.01 ? '' : g(`<path d="M0,0 Q-40,-40 -10,-${110 + 10 * Math.sin(t * 20)} Q0,-60 20,-${90 + 8 * Math.cos(t * 17)} Q40,-40 0,0Z" fill="#ff8a1a"/>` + `<path d="M0,0 Q-18,-30 -4,-62 Q10,-30 0,0Z" fill="#ffe08a"/>`, `translate(${x} ${y}) scale(${(s * k).toFixed(3)})`);
const smoke = (t, t0, x, y, seed = 3) => { const d = t - t0; if (d < 0) return ''; const r = rng(seed); let s = ''; for (let i = 0; i < 4; i++) { const p = (d * 0.8 + i * 0.22) % 1.2; s += circ(x + Math.sin(p * 6 + i) * 20 + (r() - 0.5) * 10, y - p * 260, 12 + p * 40, '#9aa0aa', `opacity="${Math.max(0, 0.6 - p * 0.5).toFixed(2)}"`); } return s; };
const wave = (t, x, y, w, amp, freq, col, sw = 10) => { let d = `M${x - w / 2},${y}`; for (let i = 0; i <= 60; i++) { const px = x - w / 2 + (w * i) / 60; d += ` L${px.toFixed(0)},${(y + Math.sin(i * freq + t * 30) * amp * Math.sin((i / 60) * Math.PI)).toFixed(0)}`; } return `<path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; };

export async function init() {
  const W = await (await fetch('/work/helium5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.5;
  const T = {
    air: wt('air', 0), helium: wt('helium', 0), news: wt('news', 0), engine: wt('engine', 0), died: wt('died', 0),
    oxygen: wt('oxygen', 2), out: wt('out', 2), stoves: wt('stoves', 2), grills: wt('grills', 2), candles: wt('candles', 2), highway: wt('highway', 2), coasts: wt('coasts', 2), silence: wt('silence', 2),
    seven: wt('seven', 4), lighter: wt('lighter', 4), wings: wt('wings', 4), grip: wt('grip', 4), plane: wt('plane', 4), drops: wt('drops', 4), brick: wt('brick', 4),
    birds: wt('birds', 6), drop6: wt('drop', 6), balloon: wt('balloon', 6), hits: wt('hits', 6), floor: wt('floor', 6),
    scream: wt('scream', 8), help: wt('help', 8), this8: wt('this', 8), out8: wt('out', 8), oh: wt('oh', 9), why: wt('why', 9), sound9: wt('sound', 9),
    blimp: wt('blimp', 11), drops11: wt('drops', 11), helium11: wt('helium', 11), sky11: wt('sky', 11), dead: wt('dead', 11), weight: wt('weight', 11),
    back: wt('back', 12), engines: wt('engines', 12), cough: wt('cough', 12), planes: wt('planes', 12), catch: wt('catch', 12),
    alive: wt('alive', 13), boss: wt('boss', 13), alive2: wt('alive', 13, 1), breath: wt('breath', 13), this13: wt('this', 13), great: wt('great', 14), team: wt('team', 14),
    next: wt('next', 15), comment: wt('comment', 15), worse: wt('worse', 15),
  };
  const N = [1, 3, 5, 7, 10].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 11, 12, 13, 15].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd, HE) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  const person = (o, y, x, s, face, pose, tilt = 0) => adult({ ...o, x, y, s, face, pose, tilt });
  const heTint = (k) => (k > 0 ? rect(0, 0, 1080, 1920, HE, 0, `opacity="${(0.16 * k).toFixed(3)}"`) : '');
  const street = (seed = 4) => vgrad('#7ab0e8', '#cfe2f4', 0, 1000) + town(seed) + rect(0, 1000, 1080, 920, '#5a5e66') + rect(0, 1000, 1080, 40, '#9a9ea6') + [...Array(7)].map((_, i) => rect(i * 170 + 20, 1460, 110, 16, '#f2f2ea', 4)).join('');

  const shots = [
    // 0 hook: busy street, air → helium, every engine dies
    [0, (t) => {
      const kH = seg(t, T.helium, T.helium + 0.3), dead = t >= T.died - 0.05;
      const v = dead ? Math.max(0, 1 - (t - T.died) * 0.6) : 1;
      let s = street(4);
      const ox = (t * 520 * (dead ? 0.6 : 1)) % 1400;
      s += car(-200 + ox, 1400, '#d9a23a', 0.95, 0, !dead) + puff(t, -420 + ox, 1360, !dead, 1);
      s += car(1300 - ((t * 470) % 1500), 1720, '#2f6fd6', 1.05, 0, !dead) + puff(t, 1550 - ((t * 470) % 1500), 1680, !dead, 2);
      s += heTint(kH) + speedLines(t, { a: 0.18 * v, seed: 2 });
      s += hit(540, 560, 'AIR', pop(seg(t, 0.05, 0.2)) * (1 - kH), '#2f6fd6', -5, 200);
      s += hit(540, 560, 'HELIUM', pop(seg(t, T.helium - 0.05, T.helium + 0.12)), HE, -5, 190);

      s += hit(540, 930, 'ENGINES: DEAD', pop(seg(t, T.died - 0.08, T.died + 0.1)), '#ff2a3a', 4, 104);
      s += flash(t, 0, 0.6) + flash(t, T.helium - 0.03, 0.75, '#e8d0ff') + flash(t, T.died - 0.05, 0.7, '#000000');
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.helium, T.news, T.died], 0.11), z1: 1, oy: 1300 }), shake(t, [0.03, T.helium, T.news, T.died], 32)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 every fire goes out, the highway coasts in silence
    [C[0], (t) => {
      let s;
      if (t < T.highway - 0.1) {
        const kOut = seg(t, T.out - 0.1, T.out + 0.1);
        s = vgrad('#f2e2c8', '#d8c0a0') + rect(0, 1380, 1080, 540, '#8a6a4a') + heTint(1);
        // stove
        s += rect(60, 1180, 300, 200, '#3a3f4a', 12) + rect(60, 1160, 300, 30, '#5a616c', 8);
        for (const x of [130, 290]) s += flame(x, 1160, (1 - kOut) * pop(seg(t, C[0], C[0] + 0.15)), 0.8, t + x) + smoke(t, T.out, x, 1120, x);
        // grill
        s += rect(400, 1200, 280, 26, '#2a2c30', 8) + `<path d="M410,1226 Q540,1360 670,1226Z" fill="#1d1f24"/>` + rect(520, 1300, 40, 120, '#2a2c30');
        for (const x of [440, 500, 560, 620]) s += flame(x, 1200, 1 - kOut, 0.7, t + x) + smoke(t, T.out + 0.05, x, 1150, x + 1);
        // birthday cake
        s += rect(740, 1250, 280, 130, '#f2a0c0', 18) + rect(740, 1250, 280, 30, '#ffffff', 14);
        for (const x of [790, 850, 910, 970]) s += rect(x - 6, 1190, 12, 60, '#6ab0ff', 4) + flame(x, 1190, 1 - kOut, 0.35, t + x) + smoke(t, T.out + 0.1, x, 1170, x + 2);
        s += hit(540, 560, 'NO OXYGEN', pop(seg(t, T.oxygen - 0.08, T.oxygen + 0.1)), '#ff2a3a', -5, 140);
        s += chip(540, 800, 'EVERY FIRE: OUT', pop(seg(t, T.out - 0.1, T.out + 0.1)), { size: 52, col: '#fff', bg: '#141a22' });
        s += chip(200, 1560, 'STOVES', pop(seg(t, T.stoves - 0.1, T.stoves + 0.08)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' }) + chip(540, 1660, 'GRILLS', pop(seg(t, T.grills - 0.1, T.grills + 0.08)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' }) + chip(880, 1560, 'CANDLES', pop(seg(t, T.candles - 0.1, T.candles + 0.08)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
        s += flash(t, T.out - 0.05, 0.6, '#000000');
        return g(cam(fin(s), 0, { z0: punch(t, [T.oxygen, T.out, T.stoves, T.grills, T.candles], 0.1), z1: 1, oy: 1250 }), shake(t, [T.oxygen, T.out], 28)) + bar(t) + pill('SECOND 1');
      }
      const d = t - T.highway;
      s = vgrad('#9ac4ee', '#e2eef8', 0, 860) + rect(0, 860, 1080, 1060, '#6a8a5a') + `<path d="M470,860 L610,860 L1180,1920 L-100,1920Z" fill="#4a4e54"/>` + heTint(1);
      for (let i = 0; i < 6; i++) { const y = 900 + ((i * 180 + d * 260) % 1100); s += rect(530 + (y - 860) * 0.02, y, 18, 50 + (y - 860) * 0.12, '#f2f2ea', 4); }
      s += car(330, 1500, '#d9a23a', 0.85, -3, 0) + car(780, 1780, '#c8312b', 1.15, 3, 0) + car(560, 1150, '#2f6fd6', 0.5, 0, 0);
      s += hit(540, 560, 'COASTING', pop(seg(t, T.coasts - 0.08, T.coasts + 0.1)), '#ffcf6a', -5, 150);
      s += chip(540, 790, 'IN SILENCE', pop(seg(t, T.silence - 0.1, T.silence + 0.1)), { size: 52, col: '#fff', bg: '#141a22' });
      s += flash(t, T.highway - 0.1, 0.6);
      return g(cam(fin(s), seg(t, T.highway, N[1]), { z0: 1.08, z1: 1.0, oy: 1500 }), shake(t, [T.highway - 0.1], 22)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 air is 7x lighter, planes drop
    [C[1], (t) => {
      const kD = Math.max(0, t - T.drops + 0.2);
      let s = vgrad('#5a9ae0', '#cfe6fa') + heTint(1);
      for (let i = 0; i < 5; i++) s += `<ellipse cx="${(i * 260 + t * 60) % 1300 - 100}" cy="${1500 + i * 70 - kD * 900}" rx="200" ry="60" fill="#ffffff" opacity="0.7"/>`;
      s += speedLines(t, { a: 0.15 + Math.min(0.35, kD * 0.4), vertical: true, dir: -1, seed: 7 });
      const y0 = 880 + Math.min(500, 650 * kD * kD) + (t > T.wings ? Math.sin(t * 25) * 8 : 0);
      s += plane(540, y0, 1.25, lerp(0, 16, clamp(kD * 2)));
      s += plane(860, 1500 + 500 * kD * kD, 0.55, 20) + plane(200, 1600 + 480 * kD * kD, 0.45, 14);
      s += hit(540, 520, '7x LIGHTER', pop(seg(t, T.seven - 0.08, T.seven + 0.1)), HE, -5, 150);
      s += chip(540, 690, 'WINGS: NO GRIP', pop(seg(t, T.grip - 0.1, T.grip + 0.1)), { size: 50, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 1640, 'LIKE A BRICK', seg(t, T.brick - 0.1, T.brick + 0.2), '#ff2a3a', -6, 76);
      s += flash(t, T.drops - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.seven, T.grip, T.drops, T.brick], 0.1), z1: 1, oy: 1000 }), shake(t, [T.seven, T.drops, T.brick], 30)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 birds drop, every party balloon hits the floor
    [C[2], (t) => {
      let s;
      if (t < T.balloon - 0.35) {
        s = vgrad('#7ab0e8', '#e2eef8') + town(11, 1500) + rect(0, 1500, 1080, 420, '#7a9a6a') + heTint(1);
        const r = rng(5);
        for (let i = 0; i < 12; i++) { const t0 = T.drop6 - 0.3 + r() * 0.3, d = Math.max(0, t - t0), x = 80 + r() * 920, y0 = 260 + r() * 500; s += bird(x + Math.sin(t * 3 + i) * 10, Math.min(1480, y0 + 1600 * d * d), 1.3, d > 0 ? 160 + i * 10 : 0, d > 0 ? -0.5 : Math.sin(t * 22 + i)); }
        s += hit(540, 520, 'BIRDS: DOWN', pop(seg(t, T.birds - 0.08, T.birds + 0.1)), '#ff2a3a', -5, 130);
        s += flash(t, T.drop6 - 0.05, 0.5);
        return g(cam(fin(s), 0, { z0: punch(t, [T.birds, T.drop6], 0.1), z1: 1, oy: 1000 }), shake(t, [T.drop6], 26)) + bar(t) + pill('SECOND 3');
      }
      s = vgrad('#f7d8e8', '#e8b8d0') + rect(0, 1620, 1080, 300, '#b88a6a') + heTint(0.6);
      s += rect(140, 500, 800, 70, '#ffffff', 10, 'opacity="0.8"') + t2(540, 554, 'HAPPY BIRTHDAY', 52, '#c8102e', { weight: 900, ls: 6 });
      const r = rng(9), cols = ['#ff4a6a', '#ffcf3a', '#3a8aff', '#2fae6a', '#b45cff', '#ff8a1a'];
      for (let i = 0; i < 16; i++) { const x = 70 + (i % 8) * 135 + r() * 30, y0 = 420 + Math.floor(i / 8) * 170 + r() * 60, d = Math.max(0, t - (T.balloon - 0.15 + r() * 0.2)); const y = Math.min(1580 - (r() * 30), y0 + 2400 * d * d); const bounce = y >= 1540 ? Math.abs(Math.sin(d * 14)) * 40 * Math.exp(-d * 3) : 0; s += balloon(x, y - bounce, cols[i % 6], 0.9, Math.sin(t * 2 + i) * 6 + d * 40 * (i % 2 ? 1 : -1)); }
      s += person(CROWD[0], 1900, 230, 0.95, 'open', 'up', -4) + person(CROWD[3], 1900, 850, 0.95, 'tense', 'up', 4);
      s += stamp(540, 900, 'FLOOR', seg(t, T.floor - 0.1, T.floor + 0.2), '#c8102e', -6, 90);
      s += flash(t, T.hits - 0.05, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.balloon, T.hits, T.floor], 0.1), z1: 1, oy: 1300 }), shake(t, [T.hits, T.floor], 30)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 you scream... cartoon voice
    [C[3], (t) => {
      const heV = t >= T.oh - 0.08;
      let s = vgrad(heV ? '#5a1a8a' : '#1a2a4a', heV ? '#1a0a2a' : '#0a1020') + glow(540, 760, 600, heV ? HE : '#3a6ad6', 0.4);
      s += speedLines(t, { a: 0.2, seed: 9, dir: heV ? -1 : 1 });
      s += person(YOU, 2030, 540, 2.2, heV ? 'tense' : 'open', t > T.scream - 0.05 ? 'up' : 'hold', heV ? Math.sin(t * 30) * 6 : 0);
      s += circ(540, 2030 - 2.2 * 482, 10 + (t > T.scream ? 6 : 0) + (heV ? 6 * Math.abs(Math.sin(t * 40)) : 0), '#5a2d2a');
      if (t > T.scream - 0.05 && !heV) s += wave(t * 0.3, 540, 1460, 760, 70, 0.35, '#ffffff', 12);
      if (heV) { s += wave(t, 540, 1460, 840, 90, 1.6, '#ffcf6a', 10); s += hit(540, 470, 'SQUEAK', pop(seg(t, T.oh - 0.08, T.oh + 0.08)), '#ffcf6a', -8, 170); s += chip(540, 1700, 'VOICE: CARTOON', pop(seg(t, T.sound9 - 0.1, T.sound9 + 0.1)), { size: 50, col: '#fff', bg: HE }); }
      else s += hit(540, 470, 'HELP!', pop(seg(t, T.help - 0.08, T.help + 0.1)), '#ff2a3a', -6, 190);
      s += flash(t, T.oh - 0.08, 0.8, '#ffe0ff');
      return g(cam(fin(s, 0.5), 0, { z0: punch(t, [T.scream, T.help, T.oh, T.why], 0.12), z1: 1, oy: 900 }), shake(t, [T.scream, T.oh, T.why, T.sound9], 30)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 11 every blimp drops — dead weight
    [C[4], (t) => {
      const d = Math.max(0, t - T.drops11 + 0.1);
      let s = vgrad('#5a9ae0', '#cfe6fa', 0, 1500) + town(17, 1600) + rect(0, 1600, 1080, 320, '#5a5e66') + heTint(1);
      s += speedLines(t, { a: Math.min(0.4, d * 0.5), vertical: true, dir: -1, seed: 4 });
      const y = Math.min(1380, 640 + 320 * d * d);
      s += blimp(540, y, 1.05, lerp(0, -9, clamp(d)));
      if (y >= 1380) s += debris(t, T.drops11 + 1.5, 540, 1560, { n: 30, col: '#c4cad4', seed: 6, size: 26 });
      s += chip(540, 470, 'HELIUM IN HELIUM?', pop(seg(t, T.helium11 - 0.1, T.helium11 + 0.1)), { size: 48, col: '#fff', bg: HE });
      s += stamp(540, 1780, 'DEAD WEIGHT', seg(t, T.dead - 0.1, T.dead + 0.2), '#ff2a3a', -6, 80);
      s += flash(t, T.drops11 - 0.05, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.blimp, T.drops11, T.dead], 0.1), z1: 1, oy: 1100 }), shake(t, [T.drops11, T.dead], 30)) + bar(t) + pill('SECOND 5');
    }],
    // 12 air is back — engines cough, planes catch the sky
    [C[5], (t) => {
      let s;
      if (t < T.planes - 0.12) {
        s = street(4);
        s += car(320, 1400, '#d9a23a', 0.95, 0) + puff(t, 100, 1360, t > T.cough - 0.1, 1) + car(760, 1720, '#2f6fd6', 1.05, 0) + puff(t, 540, 1680, t > T.cough, 2);
        if (t > T.cough - 0.1) s += debris(t, T.cough - 0.05, 100, 1360, { n: 14, col: '#3a3f4a', seed: 3, size: 20, spread: 500 });
        s += stamp(540, 600, 'AIR: BACK', seg(t, C[5], C[5] + 0.25), '#2fae6a', 6, 92);
        s += hit(540, 860, 'COUGH', pop(seg(t, T.cough - 0.08, T.cough + 0.1)), '#ffcf6a', -5, 150);
        s += flash(t, C[5], 0.95);
        return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[5], T.engines, T.cough], 0.12), z1: 1, oy: 1300 }), shake(t, [C[5], T.cough], 40, 9)) + pill('AIR: BACK');
      }
      const k = seg(t, T.planes, T.catch + 0.4);
      s = vgrad('#5a9ae0', '#cfe6fa') + speedLines(t, { a: 0.25, seed: 6 });
      s += plane(540, lerp(1400, 820, pop(k)), 1.25, lerp(18, -10, k));
      s += chip(540, 520, 'PLANES: CAUGHT IT', pop(seg(t, T.catch - 0.1, T.catch + 0.1)), { size: 48, col: '#fff', bg: '#2fae6a' });
      s += flash(t, T.planes - 0.12, 0.5);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.planes, T.catch], 0.1), z1: 1, oy: 1000 }), shake(t, [T.planes - 0.1], 24)) + pill('AIR: BACK');
    }],
    // 13 you're alive, boss is alive — and he still squeaks
    [C[6], (t) => {
      const heV = t >= T.great - 0.08;
      let s = vgrad(heV ? '#e8d8ff' : '#e8eef4', heV ? '#c8b0f0' : '#c8d2dc') + rect(0, 1560, 1080, 360, '#8a8e94') + rect(0, 380, 1080, 30, '#c8ccd2');
      s += rect(80, 520, 300, 220, '#ffffff', 8, 'stroke="#9aa0aa" stroke-width="6"') + `<path d="M110,700 L180,640 L240,670 L330,560" stroke="#2fae6a" stroke-width="10" fill="none"/>`;
      // balloons from the party lying around the office floor
      const cols = ['#ff4a6a', '#ffcf3a', '#3a8aff', '#2fae6a', '#b45cff'];
      for (let i = 0; i < 9; i++) s += balloon(70 + i * 120, 1640 + (i % 2) * 40, cols[i % 5], 0.7, 90 + i * 20);
      s += person(YOU, 2110, 280, 1.5, 'tense', 'stand', -3);
      s += person(BOSS, 2160, 770, 1.55, heV ? 'smile' : 'neutral', t > T.great - 0.1 ? 'up' : 'cross', heV ? Math.sin(t * 28) * 5 : 0);
      s += chip(280, 520 + 300, 'ALIVE', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 48, col: '#fff', bg: '#2fae6a' });
      s += chip(760, 820, 'ALSO ALIVE', pop(seg(t, T.alive2 - 0.1, T.alive2 + 0.1)), { size: 44, col: '#fff', bg: '#2fae6a' });
      if (heV) { const kB = pop(seg(t, T.great - 0.08, T.great + 0.1)); s += g(rect(-330, -110, 660, 200, '#ffffff', 40, `stroke="${HE}" stroke-width="10"`) + `<path d="M120,88 L200,170 L40,88Z" fill="#ffffff"/>` + t2(0, 24, 'GREAT JOB, TEAM.', 64, HE, { weight: 900 }), `translate(560 520) rotate(${Math.sin(t * 30) * 3}) scale(${kB})`); }
      else s += stamp(540, 540, 'ONE MORE BREATH', seg(t, T.breath - 0.1, T.breath + 0.2), HE, -5, 56);
      s += flash(t, T.great - 0.08, 0.6, '#ffe0ff');
      return g(cam(fin(s, 0.35), seg(t, C[6], C[7]), { z0: 1.0, z1: 1.08, oy: 1200 }), shake(t, [T.alive, T.alive2, T.great, T.team], 22)) + pill('MONDAY');
    }],
    // 15 CTA
    [C[7], (t) => {
      const opts = ['WATER?', 'SAND?', 'SMOKE?', 'GLITTER?', 'SOUP?', 'NOTHING?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#6a1aa8', '#1a0430') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 560, 'AIR TURNS', 1, { size: 150 }) + bigText(540, 760, 'INTO WHAT', 1, { size: 150, col: '#ffcf6a' }) + bigText(540, 960, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 130, col: '#e8d0ff', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.comment, T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
