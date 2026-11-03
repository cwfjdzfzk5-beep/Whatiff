// "What if friction disappeared for five seconds?" — HYPE format reference (hard cuts, shake, flashes, countdown).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, crowd, shake, flash, punch, bigText, stamp, speedLines, crack, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, lerp, clamp, rng } = L;

const fin = (s, v = 0.45) => s + grade('#0b1a2e', '#2e1a0b', 0.1) + vignette(v);
const lying = (o) => g(adult({ ...o, x: 0, y: 0, s: 1 }), `translate(${o.x} ${o.y}) rotate(${o.rot || -90}) scale(${o.s})`);
const car = (x, y, col, s = 1, rot = 0) => g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` + `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#1a2230" opacity="0.85"/>` + circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#8a8e94') + circ(120, 0, 16, '#8a8e94') + rect(190, -70, 20, 16, '#ffe9a8', 4), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const phoneObj = (x, y, rot, s = 1) => g(rect(-40, -80, 80, 160, '#0d0f14', 14) + rect(-34, -72, 68, 144, '#3a6ad6', 10) + rect(-34, -72, 68, 144, '#ffffff', 10, 'opacity="0.15"'), `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
const street = (s, sky = ['#7ab0e8', '#cfe2f4']) => {
  s += vgrad(sky[0], sky[1], 0, 1000); const r = rng(4); let x = -40;
  while (x < 1120) { const w = 150 + r() * 130, h = 380 + r() * 380, c = ['#e8b070', '#d0785a', '#8aa0c0', '#e8d8b8', '#9ac0a0'][Math.floor(r() * 5)]; s += rect(x, 1000 - h, w, h, c); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 56); i++) s += rect(x + 14 + i * 56, 1000 - h + 22 + j * 80, 30, 44, '#2a3a52', 3, 'opacity="0.75"'); x += w + 8; }
  return s + rect(0, 1000, 1080, 920, '#5a5e66') + rect(0, 1000, 1080, 40, '#9a9ea6') + [...Array(7)].map((_, i) => rect(i * 170 + 20, 1460, 110, 16, '#f2f2ea', 4)).join('');
};

export async function init() {
  const W = await (await fetch('/work/friction5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = 46.3;
  const T = {
    friction: wt('friction', 0), news: wt('news', 0), falling: wt('falling', 0),
    hits: wt('hits', 2), brake: wt('brake', 2), steer: wt('steer', 2), slide: wt('slide', 2), straight: wt('straight', 2),
    knot: wt('knot', 4), phone: wt('phone', 4), shoots: wt('shoots', 4), eight: wt('eight', 4), sound: wt('sound', 4),
    screws: wt('screws', 6), shelves: wt('shelves', 6), drop: wt('drop', 6), wardrobe: wt('wardrobe', 6), flat: wt('flat', 6),
    clothes: wt('clothes', 8), apart: wt('apart', 8), thread: wt('thread', 8), hold: wt('hold', 8), wait: wt('wait', 8), cant: wt('cant', 8),
    back: wt('back', 10), stops: wt('stops', 10), instantly: wt('instantly', 10),
    highway: wt('highway', 11), hoodie: wt('hoodie', 11), lying: wt('lying', 11), alive: wt('alive', 11), furious: wt('furious', 11),
    next: wt('next', 12), comments: wt('comments', 12), worse: wt('worse', 12),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);           // countdown cards
  const C = [2, 4, 6, 8, 10, 11, 12].map((s) => S0(s) - 0.06);   // content shots
  const tStart = N[0], tEnd = C[4];                              // the 5 seconds (story time)
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.18, vertical: true, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 — hook: a normal street, then friction is gone and everyone goes down
    [0, (t) => {
      const kF = seg(t, T.falling - 0.15, T.falling + 0.5);
      let s = street('');
      CROWD.forEach((c, i) => { const x = 110 + i * 175, fall = kF * (i % 2 ? 1 : -1); s += kF > 0 ? lying({ ...c, x: x + fall * 40, y: 1790 - (1 - kF) * 160, s: 0.9, face: 'tense', rot: lerp(0, i % 2 ? -80 : 80, kF) }) : adult({ ...c, x, y: 1790, s: 0.9, face: 'neutral', pose: 'stand', tilt: Math.sin(t * 4 + i) * 2 }); });
      if (kF > 0) s += speedLines(t, { a: 0.3 * kF, seed: 2 });
      s += stamp(540, 620, 'FRICTION: OFF', seg(t, T.friction - 0.05, T.friction + 0.25), '#ff2a3a', -7, 70);
      s += flash(t, T.falling - 0.1, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.falling]), z1: 1, oy: 1300 }), shake(t, [T.falling, T.friction])) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 — everyone walking hits the ground, cars slide
    [C[0], (t) => {
      let s = street('') + speedLines(t, { a: 0.35, seed: 5 });
      const kH = seg(t, T.hits - 0.1, T.hits + 0.3);
      s += crowd(60, 1020, 1240, 0.62, 6, 13, { face: 'tense', pose: kH > 0 ? 'up' : 'stand' }).replace(/<g /, '<g ');
      const kC = seg(t, C[0], N[1]);
      s += car(lerp(-300, 1500, kC), 1440, '#d9a23a', 0.9, -4) + car(lerp(1400, -500, seg(t, T.brake - 0.3, N[1] + 0.3)), 1700, '#2f6fd6', 1.05, 3);
      for (let i = 0; i < 3; i++) s += lying({ ...CROWD[i + 2], x: 300 + i * 260, y: 1870, s: 1.15, face: 'tense', rot: i % 2 ? -90 : 90 });
      s += chip(300, 620, 'NO BRAKES', pop(seg(t, T.brake - 0.1, T.brake + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      s += chip(780, 760, 'NO STEERING', pop(seg(t, T.steer - 0.1, T.steer + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      return g(cam(fin(s), 0, { z0: punch(t, [T.hits, T.brake, T.steer]), z1: 1, oy: 1200 }), shake(t, [T.hits, T.brake, T.slide], 26)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 — knots untie, phones shoot out of every hand, one sound
    [C[1], (t) => {
      let s = vgrad('#1a2a4a', '#0a1020') + glow(540, 900, 600, '#3a6ad6', 0.35);
      s += crowd(40, 1040, 1990, 1.3, 4, 21, { face: 'tense', pose: t > T.phone - 0.1 ? 'up' : 'hold' });
      const r = rng(7);
      for (let i = 0; i < 9; i++) { const t0 = T.shoots - 0.2 + r() * 0.3, d = Math.max(0, t - t0), x0 = 120 + i * 105, vx = (r() - 0.5) * 700, vy = -950 - r() * 450; if (t > T.phone - 0.3) s += phoneObj(x0 + vx * d, 1200 + vy * d + 520 * d * d, d * (200 + r() * 400), 1.4); }
      const kK = seg(t, T.knot - 0.1, T.knot + 0.6);
      for (let i = 0; i < 6; i++) { const x = 140 + i * 160; s += `<path d="M${x},560 q${40 * Math.sin(t * 9 + i)},${120 * kK} ${80 * kK},${260 * kK} t${-60 * kK},${200 * kK}" stroke="#ffcf6a" stroke-width="10" fill="none" stroke-linecap="round" opacity="${0.9 * kK}"/>`; }
      s += chip(540, 470, 'EVERY KNOT: UNTIED', pop(seg(t, T.knot - 0.1, T.knot + 0.15)) * (1 - seg(t, T.phone, T.phone + 0.2)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
      s += chip(540, 470, '8,000,000,000 SCREENS', pop(seg(t, T.eight - 0.1, T.eight + 0.15)), { size: 40, col: '#fff', bg: '#c8102e' });
      s += crack(t, T.sound - 0.05, 540, 820, 11) + flash(t, T.sound - 0.05, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [T.shoots, T.sound], 0.1), z1: 1, oy: 1000 }), shake(t, [T.shoots, T.sound], 32)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 — screws spin loose, shelves drop, wardrobe is flat pack again
    [C[2], (t) => {
      let s = vgrad('#e8d8c0', '#c8b08a') + rect(0, 1500, 1080, 420, '#8a6a4a');
      const kD = Math.max(0, t - T.drop);
      for (let i = 0; i < 3; i++) { const y = 520 + i * 230 + (kD > 0 ? Math.min(1500 - (520 + i * 230), 1600 * kD * kD) : 0); s += rect(120, y, 520, 26, '#6a4a2a', 4, `transform="rotate(${kD > 0 ? Math.min(14, kD * 40) * (i % 2 ? 1 : -1) : 0} 380 ${y})"`); for (let j = 0; j < 4; j++) s += rect(150 + j * 120, y - 70, 60, 70, ['#c8312b', '#2f6fd6', '#d9a23a', '#2fae6a'][(i + j) % 4], 6, `transform="rotate(${kD * 200 * (j % 2 ? 1 : -1)} ${180 + j * 120} ${y - 35})"`); }
      for (let i = 0; i < 6; i++) { const sp = t > T.screws ? (t - T.screws) * 1400 : 0, x = 160 + i * 90, y = 470 + (i % 3) * 230; s += g(circ(0, 0, 14, '#b8bcc4') + rect(-12, -3, 24, 6, '#5a5e66'), `translate(${x} ${y - Math.min(200, sp * 0.15)}) rotate(${sp})`); }
      const kW = seg(t, T.wardrobe - 0.2, T.wardrobe + 0.4);
      s += g(rect(-170, -620, 340, 620, '#a8743a', 6) + rect(-160, -600, 155, 580, '#b88448', 4) + rect(5, -600, 155, 580, '#b88448', 4), `translate(860 1500) scale(1 ${lerp(1, 0.08, kW)})`);
      s += debris(t, T.drop, 380, 1480, { n: 26, col: '#6a4a2a', seed: 4 }) + debris(t, T.wardrobe, 860, 1480, { n: 22, col: '#a8743a', seed: 8 });
      s += stamp(540, 1720, 'FLAT PACK', seg(t, T.flat - 0.1, T.flat + 0.2), '#c8102e', -6, 74);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [T.drop, T.wardrobe]), z1: 1, oy: 1100 }), shake(t, [T.drop, T.wardrobe], 34)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 7 — clothes coming apart, nothing to hold on to
    [C[3], (t) => {
      let s = vgrad('#2a1a3a', '#120a1a') + glow(540, 1200, 600, '#ff3b8a', 0.22) + speedLines(t, { a: 0.12, vertical: true, dir: -1, seed: 9 });
      const kA = seg(t, T.apart - 0.2, T.wait);
      const r = rng(3);
      for (let i = 0; i < 40; i++) { const x0 = 400 + r() * 280, y0 = 1350 + r() * 420, d = kA * (1 + r()); s += `<path d="M${x0},${y0} q${(r() - 0.5) * 200 * d},${-120 * d} ${(r() - 0.5) * 420 * d},${-300 * d}" stroke="#7a8aa8" stroke-width="3" fill="none" opacity="${0.8 * Math.min(1, kA * 3)}"/>`; }
      for (let i = 0; i < 10; i++) { const d = kA * (0.5 + r()); s += rect(420 + r() * 240 + (r() - 0.5) * 500 * d, 1400 + r() * 300 - 500 * d, 26, 16, '#3c4350', 3, `opacity="${Math.min(1, kA * 2)}"`); }
      const frozen = t > T.wait - 0.1 && t < T.cant;
      s += adult({ ...YOU, x: 540, y: 2120, s: 1.6, face: 'tense', pose: t > T.hold - 0.1 ? 'up' : 'hold', tilt: frozen ? 0 : Math.sin(t * 7) * 4 });
      s += chip(540, 560, 'THREAD = FRICTION', pop(seg(t, T.thread - 0.1, T.thread + 0.15)), { size: 40, col: '#ff8fb1', border: '#ff8fb1' });
      s += chip(540, 720, 'GRIP: 0%', pop(seg(t, T.cant - 0.1, T.cant + 0.1)), { size: 48, col: '#fff', bg: '#c8102e' });
      return g(cam(fin(s, 0.5), 0, { z0: punch(t, [T.cant], 0.1), z1: 1, oy: 1300 }), shake(t, [T.apart, T.cant], 22)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 8 — friction is back: everything stops dead
    [C[4], (t) => {
      let s = street('', ['#9ac4ee', '#e2eef8']);
      s += car(700, 1460, '#d9a23a', 0.9, -16) + car(330, 1720, '#2f6fd6', 1.05, 9);
      for (let i = 0; i < 4; i++) s += lying({ ...CROWD[i], x: 180 + i * 250, y: 1870, s: 1.1, face: 'tense', rot: i % 2 ? -90 : 90 });
      s += stamp(540, 620, 'FRICTION: ON', seg(t, C[4], C[4] + 0.25), '#2fae6a', 6, 74);
      s += chip(540, 800, 'EVERYTHING STOPS', pop(seg(t, T.stops - 0.1, T.stops + 0.1)), { size: 44, col: '#fff', bg: '#1d222c' });
      s += flash(t, C[4], 0.95) + flash(t, T.instantly, 0.4, '#000000', 0.3);
      return g(cam(fin(s, 0.4), 0, { z0: punch(t, [C[4], T.stops], 0.12), z1: 1, oy: 1200 }), shake(t, [C[4], T.stops], 40, 9)) + pill('FRICTION: BACK');
    }],
    // 9 — the highway guy
    [C[5], (t) => {
      let s = vgrad('#7a9ac0', '#e8eef4', 0, 860) + rect(0, 860, 1080, 1060, '#6a8a5a') + `<path d="M470,860 L610,860 L1180,1920 L-100,1920Z" fill="#4a4e54"/>`;
      s += car(760, 1380, '#c8312b', 1.0, 12);
      s += lying({ ...YOU, top: '#3c4350', x: 860, y: 1760, s: 1.05, face: t > T.furious - 0.2 ? 'tense' : 'neutral', rot: -90 });
      s += rect(420, 1700, 120, 50, '#3c4350', 6, 'transform="rotate(-20 480 1725)"') + rect(250, 1660, 90, 40, '#3c4350', 6, 'transform="rotate(30 295 1680)"');
      s += chip(540, 560, 'HALF A HOODIE', pop(seg(t, T.hoodie - 0.1, T.hoodie + 0.15)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
      s += chip(330, 740, 'ALIVE.', pop(seg(t, T.alive - 0.1, T.alive + 0.1)), { size: 44, col: '#fff', bg: '#2fae6a' });
      s += chip(760, 740, 'FURIOUS.', pop(seg(t, T.furious - 0.1, T.furious + 0.1)), { size: 44, col: '#fff', bg: '#c8102e' });
      return g(cam(fin(s, 0.4), seg(t, C[5], C[6]), { z0: 1.0, z1: 1.12, ox: 760, oy: 1500 }), shake(t, [T.furious], 18)) + pill('A9 · SOMEWHERE');
    }],
    // 10 — CTA: what disappears next?
    [C[6], (t) => {
      const opts = ['GRAVITY?', 'OXYGEN?', 'WI-FI?', 'SOUND?', 'MONEY?', 'COLOR?'];
      const i = Math.floor((t - C[6]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 });
      s += bigText(540, 640, 'WHAT', 1, { size: 200 }) + bigText(540, 830, "VANISHES", 1, { size: 170, col: '#ffcf6a' }) + bigText(540, 1000, 'NEXT?', 1, { size: 200 });
      s += bigText(540, 1520, opts[i], 1, { size: 130, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[6], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[6], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
