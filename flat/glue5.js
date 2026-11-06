// "What if all glue on Earth vanished for five seconds?" — HYPE format (built on friction5.js).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, crowd, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const fin = (s, v = 0.45) => s + grade('#0b1a2e', '#2e1a0b', 0.1) + vignette(v);
const lying = (o) => g(adult({ ...o, x: 0, y: 0, s: 1 }), `translate(${o.x} ${o.y}) rotate(${o.rot || -90}) scale(${o.s})`);
// sneaker: upper + sole; dy/rot move the sole away
const sneaker = (x, y, s, col, dy = 0, srot = 0, flip = 1) => g(
  `<path d="M-150,-10 L-150,-120 Q-140,-170 -90,-170 L-20,-170 Q20,-120 90,-100 Q160,-85 165,-40 L165,-10Z" fill="${col}"/>` +
  `<path d="M-60,-160 L-20,-120 M-40,-165 L0,-125 M-20,-165 L20,-115" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>` +
  rect(-150, -40, 315, 14, '#ffffff', 6, 'opacity="0.55"') +
  g(rect(-160, -12, 335, 40, '#f2f2ea', 16) + rect(-160, 14, 335, 14, '#c8c8c0', 7), `translate(0 ${dy}) rotate(${srot} 0 10)`),
  `translate(${x} ${y}) scale(${s * flip} ${s})`);
const car = (x, y, col, s = 1, rot = 0, shield = 1, shieldDx = 0, shieldDy = 0, shieldRot = 0) => g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` +
  `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z" fill="#1a2230" opacity="0.85"/>` + (shield > 0 ? g(`<path d="M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#9ad0f0" opacity="0.9"/>`, `translate(${shieldDx} ${shieldDy}) rotate(${shieldRot} 60 -120)`) : `<path d="M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#0d1018" opacity="0.9"/>`) +
  circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#8a8e94') + circ(120, 0, 16, '#8a8e94') + rect(190, -70, 20, 16, '#ffe9a8', 4), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const street = (s, sky = ['#7ab0e8', '#cfe2f4']) => {
  s += vgrad(sky[0], sky[1], 0, 1000); const r = rng(4); let x = -40;
  while (x < 1120) { const w = 150 + r() * 130, h = 380 + r() * 380, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8', '#9ac0a0'][Math.floor(r() * 5)]; s += rect(x, 1000 - h, w, h, c); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, 1000 - h + 22 + j * 80, 30, 44, '#2a3a52', 3, 'opacity="0.75"'); x += w + 8; }
  return s + rect(0, 1000, 1080, 920, '#8a8e96') + rect(0, 1000, 1080, 40, '#b0b4bc');
};
const LABC = ['#ffcf3a', '#ff5a7a', '#3ab0ff', '#7ae05a', '#ffffff', '#ff8a2a'];
// stuff raining down (labels/stamps/stickers) from t0
function rain(t, t0, { n = 40, seed = 3, floor = 1880 } = {}) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const x = r() * 1080, y0 = 300 + r() * 900, del = r() * 0.5, w = 40 + r() * 70, h = 26 + r() * 40, c = LABC[Math.floor(r() * LABC.length)], sp = (r() - 0.5) * 700; const d = Math.max(0, t - t0 - del); const y = Math.min(floor - h / 2, y0 + 1400 * d * d); const rot = y >= floor - h / 2 ? sp * 0.2 : sp * d;
    s += rect(x - w / 2, y - h / 2, w, h, c, 6, `transform="rotate(${rot.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" stroke="#0b0d12" stroke-width="3"`); }
  return s;
}
const page = (x, y, rot, s = 1) => g(rect(-55, -75, 110, 150, '#fbf8ee', 4, 'stroke="#c8c2b0" stroke-width="2"') + [0, 1, 2, 3, 4].map((i) => rect(-38, -50 + i * 22, 76, 6, '#9a9488', 3)).join(''), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const tv = (x, y, rot = 0, s = 1) => g(rect(-230, -150, 460, 280, '#0d0f14', 14) + rect(-214, -134, 428, 248, '#3a6ad6', 8) + glow(0, -10, 200, '#9ad0ff', 0.4), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);

export async function init() {
  const W = await (await fetch('/work/glue5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = 43.6;
  const T = {
    glue: wt('glue', 0), vanished: wt('vanished', 0), news: wt('news', 0), shoes: wt('shoes', 0), quit: wt('quit', 0),
    soles: wt('soles', 2), peel: wt('peel', 2), step: wt('step', 2), labels: wt('labels', 2), stamps: wt('stamps', 2), stickers: wt('stickers', 2), floor: wt('floor', 2),
    shelf: wt('shelf', 4), chips: wt('chips', 4), was: wt('was', 4), sawdust: wt('sawdust', 4),
    paperback: wt('paperback', 6), explodes: wt('explodes', 6), pages: wt('pages', 6), box: wt('box', 6), unfolds: wt('unfolds', 6), delivery: wt('delivery', 6),
    screens: wt('screens', 8), pop: wt('pop', 8), windshield: wt('windshield', 8), was2: wt('was', 8), damn: wt('damn', 8),
    back: wt('back', 10), exactly: wt('exactly', 10), floor2: wt('floor', 10),
    highway: wt('highway', 11), socks: wt('socks', 11), holding: wt('holding', 11), alive: wt('alive', 11), sticky: wt('sticky', 11),
    next: wt('next', 12), comments: wt('comments', 12), worse: wt('worse', 12),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[4];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 — hook: busy street, GLUE: OFF, then a giant sneaker loses its sole
    [0, (t) => {
      let s;
      if (t < T.news - 0.05) {
        s = street('') + crowd(80, 1000, 1900, 0.85, 5, 31, { face: t > T.vanished ? 'tense' : 'neutral', pose: t > T.vanished ? 'up' : 'stand' });
        s += rain(t, T.vanished + 0.1, { n: 26, seed: 5 });
        s += (t > T.glue - 0.05 ? rect(170, 540, 740, 160, '#ffffff', 20, 'opacity="0.85" transform="rotate(-7 540 620)"') : '') + stamp(540, 620, 'GLUE: OFF', seg(t, T.glue - 0.05, T.glue + 0.25), '#ff2a3a', -7, 80);
        s += flash(t, T.vanished, 0.5);
        return g(cam(fin(s), 0, { z0: punch(t, [T.glue, T.vanished]), z1: 1, oy: 1300 }), shake(t, [T.glue, T.vanished])) + pill('5 SECONDS');
      }
      const kS = seg(t, T.quit - 0.15, T.quit + 0.5), d = Math.max(0, t - T.quit + 0.15);
      s = vgrad('#ffcf3a', '#ff8a2a') + speedLines(t, { a: 0.25, seed: 6 }) + rect(0, 1560, 1080, 360, '#5a5e66');
      s += sneaker(330, 1460 - kS * 140, 1.5, '#c8102e', Math.min(100, 140 * kS + 600 * d * d), -kS * 18) + sneaker(780, 1470 - kS * 160, 1.4, '#2f6fd6', Math.min(90, 140 * kS + 600 * d * d), kS * 14, -1);
      s += debris(t, T.quit, 540, 1520, { n: 24, col: '#f2f2ea', seed: 3, size: 22 });
      s += stamp(540, 640, 'SHOES: QUIT', seg(t, T.shoes - 0.05, T.shoes + 0.2), '#0b0d12', 6, 76);
      s += flash(t, T.news - 0.05, 0.7) + flash(t, T.quit, 0.5);
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.news, T.quit], 0.12), z1: 1, oy: 1400 }), shake(t, [T.news, T.quit], 30)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — soles peel off mid step, labels/stamps/stickers rain onto the floor
    [C[0], (t) => {
      let s = street('') + speedLines(t, { a: 0.2, seed: 5 });
      const kP = seg(t, T.peel - 0.1, T.step + 0.2);
      CROWD.slice(0, 5).forEach((c, i) => { const x = 110 + i * 215, tw = kP > 0.6 ? Math.sin(t * 10 + i) * 8 : 0; s += adult({ ...c, x, y: 1800, s: 0.95, face: kP > 0.3 ? 'tense' : 'neutral', pose: kP > 0.5 ? 'up' : 'stand', tilt: tw }); });
      const r = rng(17);
      for (let i = 0; i < 10; i++) { const x0 = 80 + i * 100 + (i % 2) * 20, d = Math.max(0, t - T.peel - r() * 0.3); const x = x0 + (r() - 0.5) * 400 * d, y = Math.min(1880, 1800 + 900 * d * d + 200 * d); s += rect(x - 30, y - 8, 60, 16, '#f2f2ea', 7, `transform="rotate(${(d * 300 * (r() - 0.5)).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" stroke="#0b0d12" stroke-width="2"`); }
      s += rain(t, T.labels - 0.2, { n: 30, seed: 8 }) + rain(t, T.stamps - 0.2, { n: 25, seed: 9 }) + rain(t, T.stickers - 0.2, { n: 30, seed: 10 });
      s += chip(260, 560, 'LABELS', pop(seg(t, T.labels - 0.1, T.labels + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(540, 700, 'STAMPS', pop(seg(t, T.stamps - 0.1, T.stamps + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(820, 560, 'STICKERS', pop(seg(t, T.stickers - 0.1, T.stickers + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 1720, 'ON THE FLOOR', seg(t, T.floor - 0.1, T.floor + 0.2), '#ffcf3a', -5, 70) + flash(t, T.floor - 0.05, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.peel, T.labels, T.stamps, T.stickers, T.floor]), z1: 1, oy: 1300 }), shake(t, [T.peel, T.floor], 26)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — particle-board shelf crumbles into sawdust, TV drops
    [C[1], (t) => {
      let s = vgrad('#f2e2c8', '#d8c0a0') + rect(0, 1640, 1080, 280, '#8a6a4a') + rect(80, 420, 300, 420, '#7ab0e8', 6, 'stroke="#ffffff" stroke-width="14"');
      const kC = seg(t, T.was - 0.05, T.was + 0.35), d = Math.max(0, t - T.was + 0.05);
      if (kC < 1) { const sx = 1, sy = lerp(1, 0.15, kC); s += g(rect(-300, -560, 600, 40, '#c89a62', 4) + rect(-300, -300, 600, 36, '#c89a62', 4) + rect(-300, -40, 600, 40, '#c89a62', 4) + rect(-300, -560, 36, 560, '#b8884e') + rect(264, -560, 36, 560, '#b8884e') + [...Array(40)].map((_, i) => circ(-280 + (i * 53) % 560, -540 + ((i * 37) % 520), 4, '#8a6236')).join(''), `translate(560 1640) scale(${sx} ${sy})`); }
      s += `<path d="M${560 - 380 * kC},1640 Q560,${1640 - 170 * kC} ${560 + 380 * kC},1640Z" fill="#c89a62"/>`;
      const tvY = Math.min(1560, 930 + 2400 * Math.max(0, t - T.was - 0.05) ** 2);
      s += tv(560, tvY, kC * 9, 0.95);
      if (t > T.was + 0.25) s += crack(t, T.was + 0.3, 560, tvY - 10, 7);
      s += debris(t, T.was, 560, 1600, { n: 40, col: '#c89a62', seed: 4, size: 14, spread: 1100 });
      s += chip(540, 560, 'WOOD CHIPS + GLUE', pop(seg(t, T.chips - 0.1, T.chips + 0.15)) * (1 - seg(t, T.was, T.was + 0.1)), { size: 40, col: '#ffcf6a', bg: '#1d222c', border: '#ffcf6a' });
      s += stamp(540, 560, 'SAWDUST', seg(t, T.sawdust - 0.1, T.sawdust + 0.2), '#c8102e', -6, 90) + flash(t, T.was, 0.7);
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.shelf, T.was, T.sawdust], 0.1), z1: 1, oy: 1300 }), shake(t, [T.was, T.was + 0.3], 38)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — paperbacks explode into pages, boxes unfold mid delivery
    [C[2], (t) => {
      let s = vgrad('#3ab0ff', '#1a5a9a') + speedLines(t, { a: 0.18, seed: 14 });
      const r = rng(21);
      if (t < T.explodes - 0.05) { for (let i = 0; i < 3; i++) s += g(rect(-90, -130, 180, 260, ['#c8102e', '#ffcf3a', '#2fae6a'][i], 8) + rect(-90, -130, 26, 260, '#0b0d12', 4, 'opacity="0.3"') + t2(10, -40, 'NOVEL', 34, '#fff', { weight: 900 }), `translate(${240 + i * 300} 800) rotate(${(i - 1) * 8})`); }
      else { const d = t - T.explodes + 0.05; for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, v = 300 + r() * 600, ox = 240 + (i % 3) * 300; s += page(ox + Math.cos(a) * v * d, 800 + Math.sin(a) * v * d * 0.6 + 260 * d * d, (r() - 0.5) * 600 * d, 0.8 + r() * 0.5); } }
      if (t > T.explodes + 0.6) { const r2 = rng(33); for (let i = 0; i < 26; i++) { const ph = r2() * 1500, sp = 220 + r2() * 260; const y = 160 + ((ph + (t - T.explodes) * sp) % 1500); s += page(r2() * 1080 + Math.sin(t * 2 + i) * 50, y, Math.sin(t * 3 + i) * 50, 0.9 + r2() * 0.4); } }
      // boxes
      const kU = seg(t, T.unfolds - 0.1, T.unfolds + 0.35);
      for (let i = 0; i < 3; i++) { const x = 220 + i * 320, y = 1640; if (kU < 0.5) s += g(rect(-120, -200, 240, 200, '#c89a62', 6) + rect(-120, -200, 240, 30, '#a8783e') + rect(-20, -200, 40, 200, '#e8d8b0', 0, 'opacity="0.7"'), `translate(${x} ${y}) scale(${1.25 * (1 + kU * 0.6)} ${1.25 * (1 - kU * 1.4)})`); else s += g(`<path d="M-120,-40 L120,-40 L120,0 L-120,0Z M-120,-40 L-200,-10 L-200,0 L-120,0Z M120,-40 L200,-10 L200,0 L120,0Z" fill="#c89a62"/>`, `translate(${x} ${y + 10}) scale(${1.25 * lerp(0.8, 1, kU)})`); }
      if (t > T.unfolds) for (let i = 0; i < 3; i++) { const d = t - T.unfolds, x = 220 + i * 320; s += circ(x + (i - 1) * 300 * d, Math.min(1600, 1500 - 900 * d + 1200 * d * d), 60, ['#ff5a7a', '#7ae05a', '#ffcf3a'][i], 'stroke="#0b0d12" stroke-width="4"'); }
      s += chip(540, 540, 'BOOK: EXPLODED', pop(seg(t, T.explodes - 0.1, T.explodes + 0.1)) * (1 - seg(t, T.box - 0.1, T.box)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(540, 700, 'BOX: UNFOLDED', pop(seg(t, T.unfolds - 0.1, T.unfolds + 0.1)), { size: 44, col: '#fff', bg: '#1d222c' });
      s += (t > T.delivery - 0.1 ? rect(150, 470, 780, 140, '#1a5a9a', 20, 'opacity="0.9" transform="rotate(5 540 540)"') : '') + stamp(540, 540, 'MID DELIVERY', seg(t, T.delivery - 0.1, T.delivery + 0.2), '#ffcf3a', 5, 72);
      s += flash(t, T.explodes - 0.05, 0.6) + flash(t, T.unfolds, 0.4);
      return g(cam(fin(s, 0.35), 0, { z0: punch(t, [T.explodes, T.unfolds, T.delivery], 0.1), z1: 1, oy: 1100 }), shake(t, [T.explodes, T.unfolds], 32)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 — phone screens pop off, then a windshield peels off a car on the highway
    [C[3], (t) => {
      let s;
      if (t < T.windshield - 0.1) {
        s = vgrad('#2f1a4a', '#120a20') + glow(540, 960, 600, '#7a5aff', 0.35);
        const d = Math.max(0, t - T.pop + 0.05);
        s += g(rect(-200, -400, 400, 800, '#0d0f14', 50) + rect(-180, -380, 360, 760, '#1a1c22', 36), 'translate(540 1040)');
        s += g(rect(-180, -380, 360, 760, '#3a6ad6', 36) + rect(-180, -380, 360, 760, '#ffffff', 36, 'opacity="0.18"') + rect(-140, -330, 280, 60, '#ffffff', 14, 'opacity="0.3"'), `translate(${540 + 300 * d} ${1040 - 1500 * d + 1500 * d * d}) rotate(${d * 160})`);
        s += debris(t, T.pop, 540, 700, { n: 18, col: '#9ad0ff', seed: 6 });
        s += chip(540, 1700, 'SCREEN: GONE', pop(seg(t, T.pop - 0.1, T.pop + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' }) + flash(t, T.pop - 0.05, 0.6);
        return g(cam(fin(s, 0.45), 0, { z0: punch(t, [T.pop], 0.12), z1: 1, oy: 1000 }), shake(t, [T.pop], 30)) + bar(t) + pill('SECOND 4');
      }
      s = vgrad('#7ab0e8', '#e8eef4', 0, 900) + rect(0, 900, 1080, 1020, '#6a8a5a') + `<path d="M470,900 L610,900 L1180,1920 L-100,1920Z" fill="#4a4e54"/>` + speedLines(t, { a: 0.4, seed: 22, dir: -1 });
      const d = Math.max(0, t - T.was2 + 0.1);
      s += car(560, 1560, '#d9a23a', 2.4, 0, 1, -120 * d - 30 * seg(t, T.windshield, T.was2), -260 * d - 60 * seg(t, T.windshield, T.was2) * Math.sin(t * 40), -d * 260);
      s += debris(t, T.was2, 600, 1250, { n: 26, col: '#9ad0f0', seed: 12, size: 20 });
      s += chip(540, 800, 'GLUED IN', pop(seg(t, T.windshield + 0.4, T.windshield + 0.6)) * (1 - seg(t, T.was2 - 0.05, T.was2)), { size: 48, col: '#fff', bg: '#1d222c' });
      s += stamp(540, 600, 'DAMN.', seg(t, T.damn - 0.1, T.damn + 0.2), '#c8102e', -8, 110) + flash(t, T.was2 - 0.05, 0.7) + flash(t, T.windshield - 0.1, 0.5);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.windshield, T.was2, T.damn], 0.12), z1: 1, oy: 1400 }), shake(t, [T.windshield, T.was2, T.damn], 34)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 — glue is back: everything sticks wherever it landed (the floor)
    [C[4], (t) => {
      let s = vgrad('#e8f4ec', '#c8e0d0', 0, 1100) + rect(0, 1100, 1080, 820, '#9aa0a8');
      const r = rng(41);
      for (let i = 0; i < 50; i++) { const x = r() * 1080, y = 1150 + r() * 720, w = 40 + r() * 80, h = 26 + r() * 40; s += rect(x, y, w, h, LABC[i % 6], 6, `transform="rotate(${((r() - 0.5) * 80).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" stroke="#0b0d12" stroke-width="3"`); }
      for (let i = 0; i < 8; i++) s += page(80 + r() * 920, 1200 + r() * 600, (r() - 0.5) * 120, 0.9);
      for (let i = 0; i < 6; i++) s += rect(80 + i * 160, 1500 + (i % 2) * 220, 70, 18, '#f2f2ea', 8, 'stroke="#0b0d12" stroke-width="2"');
      s += crowd(120, 960, 1230, 0.55, 5, 9, { face: 'tense', pose: 'up' });
      s += stamp(540, 600, 'GLUE: ON', seg(t, C[4], C[4] + 0.25), '#2fae6a', 6, 90);
      s += chip(540, 790, 'STUCK WHERE IT LANDED', pop(seg(t, T.exactly - 0.1, T.exactly + 0.1)), { size: 40, col: '#fff', bg: '#1d222c' });
      s += flash(t, C[4], 0.95) + flash(t, T.floor2, 0.4, '#000000', 0.3);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[4], T.floor2], 0.12), z1: 1, oy: 1300 }), shake(t, [C[4], T.floor2], 40, 9)) + pill('GLUE: BACK');
    }],
    // 11 — the highway guy in socks with his windshield
    [C[5], (t) => {
      let s = vgrad('#7a9ac0', '#e8eef4', 0, 860) + rect(0, 860, 1080, 1060, '#6a8a5a') + `<path d="M470,860 L610,860 L1180,1920 L-100,1920Z" fill="#4a4e54"/>`;
      s += car(330, 1420, '#d9a23a', 1.1, -4, 0);
      s += adult({ ...YOU, x: 740, y: 1920, s: 1.05, face: t > T.alive - 0.1 ? 'tense' : 'neutral', pose: 'hold' });
      s += rect(706, 1902, 30, 18, '#f2f2ea', 6) + rect(746, 1902, 30, 18, '#f2f2ea', 6);
      s += g(`<path d="M-200,0 L-140,-150 L140,-150 L200,0Z" fill="#9ad0f0" opacity="0.75" stroke="#e8f4ff" stroke-width="6"/>`, 'translate(740 1660)');
      s += rect(560, 1750, 70, 16, '#f2f2ea', 7) + rect(880, 1790, 70, 16, '#f2f2ea', 7);
      s += chip(740, 1960 - 120, 'SOCKS ONLY', pop(seg(t, T.socks - 0.1, T.socks + 0.15)), { size: 34, col: '#ffcf6a', bg: '#1d222c', border: '#ffcf6a' });
      s += chip(300, 640, 'ALIVE.', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 48, col: '#fff', bg: '#2fae6a' });
      s += chip(760, 640, 'VERY STICKY.', pop(seg(t, T.sticky - 0.1, T.sticky + 0.1)), { size: 48, col: '#fff', bg: '#c8102e' });
      return g(cam(fin(s, 0.4), seg(t, C[5], C[6]), { z0: 1.0, z1: 1.1, ox: 740, oy: 1500 }), shake(t, [T.alive, T.sticky], 18)) + pill('A9 · SOMEWHERE');
    }],
    // 12 — CTA
    [C[6], (t) => {
      const opts = ['SOUND?', 'WOOD?', 'METAL?', 'COLOR?', 'WATER?', 'WI-FI?'];
      const i = Math.floor((t - C[6]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, 'VANISHES', 1, { size: 170, col: '#ffcf6a' }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 130, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[6], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[6], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
