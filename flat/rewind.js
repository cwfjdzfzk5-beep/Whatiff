// "What if you could rewind ten seconds, once a day?" — mature cinematic flat style.
import * as L from './lib.js';
import { adult, silhouette, fog, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, finish, YOU, CROWD, chip, crowd, lamp } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const ME = { ...YOU, top: '#e8e8e4', pants: '#2a3442' };
const HER = { skin: '#f0c8a8', hair: '#3a2418', hairStyle: 'long', top: '#7a3a4a', pants: '#2a2a30' };
const KID = { skin: '#e8b894', hair: '#5a3a20', hairStyle: 'short', top: '#d9a23a', pants: '#2f4a6a' };
const rwIcon = (s = 1, col = '#fff') => g(`<path d="M0,-30 L-40,0 L0,30Z M44,-30 L4,0 L44,30Z" fill="${col}"/>`, `scale(${s})`);
/** VHS-style rewind overlay around time t0 */
function rewindFx(t, t0) {
  const k = clamp(1 - Math.abs(t - (t0 + 0.25)) / 0.55); if (k <= 0) return '';
  let s = rect(0, 0, 1080, 1920, '#2f6fd6', 0, `opacity="${0.28 * k}"`);
  const r = rng(Math.floor(t * 30));
  for (let i = 0; i < 9; i++) s += rect(0, r() * 1920, 1080, 4 + r() * 18, '#e8f0ff', 0, `opacity="${0.25 * k * r()}"`);
  s += g(rect(-170, -60, 340, 120, '#0d1220', 60, 'stroke="#9fc4ff" stroke-width="4"') + g(rwIcon(0.9, '#9fc4ff'), 'translate(-80 0)') + t2(50, 18, '10s', 52, '#e8f0ff', { weight: 900 }), `translate(540 560) scale(${0.8 + 0.2 * k})`, `opacity="${k}"`);
  return s;
}
const stain = (k) => k > 0 ? `<path d="M-30,-330 q20,-20 40,0 q30,10 10,40 q-10,30 -40,10 q-30,-10 -10,-50Z" fill="#7a4a24" opacity="${0.85 * k}"/>` + circ(30, -270, 9, '#7a4a24', `opacity="${0.8 * k}"`) : '';

export async function init() {
  const W = await (await fetch('/work/rewind/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const D = (s) => W.find((x) => x.seg === s).start - 0.25;
  const fps = 30, total = 53.1;
  const T = {
    rewind0: wt('rewind', 0), ten: wt('ten', 0), once: wt('once', 0),
    coffee: wt('coffee', 2), rw1: wt('rewind', 2), clean: wt('clean', 2), smiling: wt('smiling', 2),
    roasts: wt('roasts', 4), rw2: wt('rewind', 4), perfect: wt('perfect', 4), comeback: wt('comeback', 4),
    kid: wt('kid', 6), bus: wt('bus', 6), rw3: wt('rewind', 6), grab: wt('grab', 6), moves: wt('moves', 6),
    date: wt('date', 8), stupid: wt('stupid', 8), rw4: wt('rewind', 8), smarter: wt('smarter', 8), laughs: wt('laughs', 8),
    awkward: wt('awkward', 10), pause: wt('pause', 10), mistake: wt('mistake', 10), smoother: wt('smoother', 10), quieter: wt('quieter', 10),
    decide: wt('decide', 12), trip: wt('trip', 12), wrong: wt('wrong', 12), laugh: wt('laugh', 12), best: wt('best', 12),
  };

  const shots = [
    // 0 — hook: a clock spinning backwards
    [0, (t) => {
      let s = vgrad('#05070c', '#0c1222') + glow(540, 820, 520, '#2f6fd6', 0.25);
      const a = -((t * 220) % 360);
      s += g(circ(0, 0, 300, '#0d1220') + circ(0, 0, 300, 'none', 'stroke="#9fc4ff" stroke-width="8"') + [...Array(12)].map((_, i) => rect(-4, -290, 8, 34, '#9fc4ff', 3, `transform="rotate(${i * 30})"`)).join('') + rect(-6, -230, 12, 230, '#e8f0ff', 6, `transform="rotate(${a})"`) + rect(-8, -150, 16, 150, '#e8f0ff', 8, `transform="rotate(${a / 12})"`) + circ(0, 0, 16, '#e8f0ff'), 'translate(540 820)');
      s += g(`<path d="M-200,-340 A390,390 0 0 0 -380,40" stroke="#9fc4ff" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.6"/><path d="M-380,40 l-30,-50 l60,0Z" fill="#9fc4ff" opacity="0.6"/>`, 'translate(540 820)');
      s += chip(540, 1500, '−10 SECONDS', pop(seg(t, T.ten - 0.2, T.ten + 0.2)), { size: 40, col: '#9fc4ff', border: '#9fc4ff' });
      s += chip(540, 1640, 'ONCE A DAY', pop(seg(t, T.once - 0.2, T.once + 0.2)), { size: 32, col: '#ffcf6a' });
      return cam(finish(s, 0.75), seg(t, 0, D(1)), { z0: 1.0, z1: 1.06, oy: 900 }) + pill('NEW POWER');
    }],
    // 1 — day 1: coffee on your white shirt
    [D(1), (t) => {
      let s = vgrad('#e8dccb', '#c8b8a0', 0, 1150) + glow(800, 500, 400, '#fff3d9', 0.5) + rect(640, 400, 340, 420, '#f6efe2', 6) + rect(640, 400, 340, 420, 'none', 6, 'stroke="#8a7a64" stroke-width="12"') + rect(0, 1150, 1080, 770, '#8a7a64');
      s += rect(60, 1100, 960, 50, '#5a4a3a', 10);
      const before = t < T.rw1 + 0.25, kS = before ? seg(t, T.coffee, T.coffee + 0.3) : 0;
      const cup = g(rect(-34, -40, 68, 70, '#f2f0ea', 10) + `<path d="M34,-24 q30,0 30,22 t-30,22" stroke="#f2f0ea" stroke-width="10" fill="none"/>`, 'translate(70 -300)');
      s += adult({ ...ME, x: 540, y: 1990, s: 1.4, face: t > T.smiling - 0.2 ? 'smile' : before && kS > 0 ? 'tense' : 'neutral', pose: 'hold', hold: cup + g(stain(kS), 'translate(0 40)') });
      s += chip(540, 900, 'CLEAN SHIRT', pop(seg(t, T.clean - 0.1, T.clean + 0.2)), { size: 32, col: '#2fae6a' });
      s += rewindFx(t, T.rw1);
      return cam(finish(s, 0.5, '#2a2a1a', '#2a1a0b'), seg(t, D(1), D(3)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('DAY 1');
    }],
    // 2 — day 2: the roast, then the perfect comeback
    [D(3), (t) => {
      let s = vgrad('#2a3038', '#1a1e24') + glow(540, 500, 520, '#ffd59a', 0.22) + rect(0, 1250, 1080, 670, '#1c2026');
      const after = t >= T.rw2 + 0.25, kC = after ? seg(t, T.comeback - 0.2, T.comeback + 0.2) : 0;
      CROWD.slice(0, 4).forEach((c, i) => { s += adult({ ...c, x: 150 + i * 260, y: 1480, s: 1.0, face: (!after && t > T.roasts) || kC > 0.5 ? 'smile' : 'neutral', pose: kC > 0.5 && i % 2 ? 'up' : 'stand', look: 0.2 }); });
      s += adult({ ...CROWD[4], top: '#8a3a2a', x: 820, y: 1990, s: 1.35, face: !after && t > T.roasts ? 'smile' : kC > 0.5 ? 'tense' : 'neutral', pose: !after && t > T.roasts ? 'point' : 'stand', look: -0.5 });
      s += adult({ ...ME, top: '#3c4350', x: 270, y: 1990, s: 1.35, face: !after && t > T.roasts ? 'tense' : kC > 0 ? 'smile' : 'neutral', pose: kC > 0 ? 'point' : 'stand', look: 0.5 });
      s += chip(540, 700, 'PERFECT COMEBACK', pop(kC), { size: 34, col: '#ffcf6a', border: '#ffcf6a' });
      if (!after && t > T.roasts) s += chip(820, 700, 'HAHAHA', pop(seg(t, T.roasts, T.roasts + 0.2)), { size: 30 });
      s += rewindFx(t, T.rw2);
      return cam(finish(s, 0.6), seg(t, D(3), D(5)), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('DAY 2');
    }],
    // 3 — day 5: the kid, the bus
    [D(5), (t) => {
      let s = vgrad('#9fb3c8', '#d8dee6', 0, 900) + rect(0, 700, 1080, 200, '#5a6470') + rect(0, 900, 1080, 260, '#3a3e44');
      for (let i = 0; i < 6; i++) s += rect(i * 200 + 40, 1020, 110, 14, '#e8e8e2', 4);
      s += rect(0, 1160, 1080, 760, '#8a8e94') + rect(0, 1160, 1080, 20, '#6a6e74');
      const after = t >= T.rw3 + 0.25;
      const kBus = !after ? seg(t, T.bus - 0.3, T.rw3 + 0.2) : seg(t, T.moves - 0.2, T.moves + 1.4);
      s += g(rect(0, -230, 700, 230, '#d9a23a', 26) + rect(30, -200, 640, 90, '#2a3a4a', 10) + circ(120, 0, 44, '#141618') + circ(560, 0, 44, '#141618') + rect(0, -40, 700, 20, '#8a6a2a'), `translate(${lerp(1200, -900, kBus)} 1150)`);
      const kRun = !after ? seg(t, T.kid - 0.2, T.rw3) : 0;
      s += adult({ ...KID, x: after ? 600 : lerp(600, 760, kRun), y: 1720, s: 0.75, face: 'neutral', pose: 'stand', look: 0.6 });
      const kG = after ? seg(t, T.grab - 0.3, T.grab + 0.1) : 0;
      s += adult({ ...ME, top: '#3c4350', x: lerp(380, 480, kG), y: 1990, s: 1.35, face: after ? 'tense' : 'neutral', pose: kG > 0.5 ? 'point' : 'stand', look: 0.6 });
      s += chip(540, 560, 'CAUGHT IN TIME', pop(seg(t, T.moves - 0.2, T.moves + 0.2)) * (after ? 1 : 0), { size: 32, col: '#2fae6a' });
      s += rewindFx(t, T.rw3);
      return cam(finish(s, 0.5, '#1a2a3a', '#2a2a2a'), seg(t, D(5), D(7)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('DAY 5');
    }],
    // 4 — day 9: first date
    [D(7), (t) => {
      let s = vgrad('#1e1418', '#0e0a0c') + glow(540, 1060, 460, '#ffb06a', 0.35);
      for (let i = 0; i < 10; i++) s += circ(100 + i * 100, 420 + Math.sin(i * 1.7) * 30, 6, '#ffcf8a', `opacity="${0.5 + 0.4 * Math.sin(t * 3 + i)}"`);
      const after = t >= T.rw4 + 0.25, oops = !after && t > T.stupid - 0.2;
      s += adult({ ...HER, x: 790, y: 1480, s: 1.15, face: after && t > T.laughs - 0.2 ? 'smile' : oops ? 'tense' : 'neutral', pose: 'stand', look: -0.5 });
      s += adult({ ...ME, top: '#2a2f3a', x: 290, y: 1480, s: 1.2, face: oops ? 'tense' : 'smile', pose: 'stand', look: 0.5 });
      s += rect(60, 1140, 960, 50, '#3a2a24', 10) + rect(120, 1190, 840, 340, '#2a1e1a') + rect(530, 1060, 20, 80, '#f2e8d8', 4) + glow(540, 1050, 80, '#ffcf6a', 0.6) + circ(540, 1052, 8, '#ffcf6a');
      if (oops) s += chip(290, 640, '"…so, do you like… soup?"', pop(seg(t, T.stupid - 0.2, T.stupid + 0.1)), { size: 26, col: '#9aa3b2' });
      if (after && t > T.smarter - 0.2) s += chip(290, 640, 'TAKE TWO', pop(seg(t, T.smarter - 0.2, T.smarter + 0.1)), { size: 30, col: '#ffcf6a' });
      if (after && t > T.laughs - 0.2) s += chip(790, 640, 'HAHA', pop(seg(t, T.laughs - 0.2, T.laughs + 0.1)), { size: 30, col: '#ff8fb1' });
      s += rewindFx(t, T.rw4);
      return cam(finish(s, 0.6, '#2a0b1a', '#2a1a0b'), seg(t, D(7), D(9)), { z0: 1.02, z1: 1.08, oy: 1000 }) + pill('DAY 9');
    }],
    // 5 — day 20: rewinding everything, life gets quieter
    [D(9), (t) => {
      const kQ = seg(t, T.smoother, T.quieter + 0.6);
      let s = vgrad('#1a1e26', '#0e1016') + glow(540, 760, 520, '#2f6fd6', 0.2 * (1 - kQ));
      const used = Math.min(20, Math.floor(20 * seg(t, D(9), T.smoother)) + 1);
      for (let i = 0; i < 20; i++) { const x = 170 + (i % 5) * 185, y = 480 + Math.floor(i / 5) * 150; s += g(circ(0, 0, 54, i < used ? '#1b2a4a' : '#141820', 'stroke="#3a4a6a" stroke-width="3"') + g(rwIcon(0.5, i < used ? '#9fc4ff' : '#3a4250'), 'translate(-4 0)'), `translate(${x} ${y})`, `opacity="${i < used ? 1 : 0.4}"`); }
      s += chip(540, 1000, `REWINDS USED: ${used}`, 1, { size: 28 });
      ['AWKWARD', 'PAUSE', 'MISTAKE'].forEach((w, i) => { const t0 = [T.awkward, T.pause, T.mistake][i]; s += strikeChip(270 + i * 270, 1500, w, pop(seg(t, t0 - 0.1, t0 + 0.2))); });
      s += adult({ ...ME, top: '#3c4350', x: 540, y: 2060, s: 1.4, face: 'neutral', pose: 'stand' });
      s += rect(0, 0, 1080, 1920, '#5a5e66', 0, `opacity="${0.35 * kQ}" style="mix-blend-mode:saturation"`);
      return cam(finish(s, 0.7), seg(t, D(9), D(11)), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('DAY 20');
    }],
    // 6 — day 30: not using it. best day in weeks
    [D(11), (t) => {
      let s = vgrad('#3a5a80', '#f0b070', 0, 1150) + glow(540, 1000, 560, '#ffcf8a', 0.45) + rect(0, 1150, 1080, 770, '#4a6a3a') + `<path d="M0,1150 Q540,1080 1080,1150Z" fill="#5a7a46"/>`;
      for (let i = 0; i < 4; i++) s += g(`<ellipse cx="0" cy="-200" rx="${110 + (i % 2) * 30}" ry="140" fill="#2f4a2a"/>` + rect(-14, -80, 28, 120, '#3a2a1a'), `translate(${80 + i * 300} 1180) scale(${0.8 + (i % 2) * 0.2})`);
      const kT = seg(t, T.trip - 0.1, T.trip + 0.4);
      s += adult({ ...CROWD[1], x: 160, y: 1990, s: 1.3, face: t > T.laugh - 0.2 ? 'smile' : 'neutral', pose: t > T.laugh ? 'up' : 'stand', look: 0.4 }) + adult({ ...CROWD[0], x: 900, y: 1990, s: 1.3, face: t > T.laugh - 0.2 ? 'smile' : 'neutral', pose: t > T.laugh + 0.2 ? 'up' : 'stand', look: -0.4 });
      s += adult({ ...ME, top: '#3c4350', x: 540, y: 2010, s: 1.38, face: t > T.laugh - 0.3 ? 'smile' : kT > 0 ? 'tense' : 'neutral', pose: t > T.laugh ? 'up' : 'stand', tilt: kT > 0 && kT < 1 ? Math.sin(kT * Math.PI) * 16 : 0 });
      s += chip(540, 560, 'REWIND: NOT USED', pop(seg(t, T.decide - 0.1, T.decide + 0.2)), { size: 34, col: '#9fc4ff', border: '#9fc4ff' });
      s += chip(540, 700, 'BEST DAY IN WEEKS', pop(seg(t, T.best - 0.1, T.best + 0.2)), { size: 34, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.5, '#1a2a3a', '#3a2a1a'), seg(t, D(11), D(13)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('DAY 30');
    }],
    // 7 — outro
    [D(13), (t) => {
      let s = vgrad('#05070c', '#0c1222') + glow(540, 760, 520, '#2f6fd6', 0.2);
      s += g(rwIcon(2.2, '#9fc4ff'), 'translate(560 820)', `opacity="${0.25 + 0.15 * Math.sin(t * 4)}"`);
      s += t2(540, 520, 'WHICH', 110, '#ffffff', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13), D(13) + 0.3)}"` }) + t2(540, 650, 'MOMENT?', 110, '#9fc4ff', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13) + 0.2, D(13) + 0.5)}"` });
      s += adult({ ...ME, top: '#3c4350', x: 540, y: 2040, s: 1.4, face: 'smile', pose: 'cross' });
      return cam(finish(s, 0.7), seg(t, D(13), total), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('YOUR TURN');
    }],
  ];
  function strikeChip(x, y, w, k) { return k > 0 ? g(rect(-120, -40, 240, 80, '#141a22', 40) + t2(0, 12, w, 28, '#9aa3b2', { weight: 800, ls: 2 }) + rect(-100, -2, 200 * k, 5, '#9fc4ff', 2), `translate(${x} ${y}) scale(${k})`) : ''; }
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps); } };
}
