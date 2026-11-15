// "What if every screw, bolt and rivet vanished for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, crack, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const STEEL = '#9aa3b2', STEEL2 = '#6a7382';
// a bolt icon (hex head + threaded shaft), centre of head at 0,0
const bolt = (x, y, s = 1, rot = 0, a = 1) => g(`<path d="M-30,-17 L0,-34 L30,-17 L30,17 L0,34 L-30,17Z" fill="#c8ced8" stroke="${STEEL2}" stroke-width="4"/>` + rect(-12, 30, 24, 90, '#b8c0cc', 3) + [...Array(6)].map((_, i) => rect(-14, 40 + i * 13, 28, 4, STEEL2, 2)).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`, `opacity="${a.toFixed(2)}"`);
// bolts that pop out of joints at t0 and fly off + fade (visible ~0.9 s)
function boltBurst(t, t0, pts, { seed = 1, s = 0.6 } = {}) {
  const d = t - t0; if (d < -0.35 || d > 0.9) return ''; const r = rng(seed); let out = '';
  for (const [x, y] of pts) { const a = r() * Math.PI * 2, v = 300 + r() * 500, sp = (r() - 0.5) * 900;
    if (d < 0) { out += bolt(x, y, s * pop((d + 0.35) / 0.2), 0); continue; }
    out += bolt(x + Math.cos(a) * v * d, y + Math.sin(a) * v * d * 0.6 + 900 * d * d, s * (1 - d * 0.5), sp * d, Math.max(0, 1 - d / 0.9)); }
  return out;
}
const poof = (t, t0, x, y, w = 200) => { const d = (t - t0) / 0.35; if (d < 0 || d > 1) return ''; return circ(x, y, w * (0.3 + d), 'none', `stroke="#ffffff" stroke-width="${(16 * (1 - d)).toFixed(1)}" opacity="${(0.9 * (1 - d)).toFixed(2)}"`); };
const fall = (t, t0, y0, floor, gpx = 3600) => { const d = Math.max(0, t - t0); return Math.min(floor, y0 + 0.5 * gpx * d * d); };
function sparks(t, x, y, { n = 30, seed = 5, a = 1, dir = -1 } = {}) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const ph = (t * (2 + r() * 2) + r()) % 1, ang = Math.PI + dir * (0.1 + r() * 0.7), v = 300 + r() * 600; const px = x + (r() - 0.5) * 300 + Math.cos(ang) * v * ph * -dir, py = y - Math.sin(0.2 + r() * 0.8) * v * ph * 0.7 + 600 * ph * ph; const len = 30 + r() * 50;
    s += `<path d="M${px.toFixed(0)},${py.toFixed(0)} l${(-dir * len).toFixed(0)},${(-len * 0.3).toFixed(0)}" stroke="${r() < 0.5 ? '#ffe04a' : '#ff9a1a'}" stroke-width="${(4 + r() * 4).toFixed(1)}" stroke-linecap="round" opacity="${(a * (1 - ph)).toFixed(2)}"/>`; }
  return s + glow(x, y, 220, '#ffb31a', 0.5 * a);
}
const wheel = (x, y, r, rot = 0) => g(circ(0, 0, r, '#141618') + circ(0, 0, r * 0.55, '#b8c0cc') + [...Array(5)].map((_, i) => `<path d="M0,0 L${(Math.cos(i * 1.256) * r * 0.5).toFixed(0)},${(Math.sin(i * 1.256) * r * 0.5).toFixed(0)}" stroke="${STEEL2}" stroke-width="${r * 0.12}"/>`).join('') + circ(0, 0, r * 0.15, '#3a3f4a'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})`);
const fan = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : ''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
const FANC = ['#c8102e', '#2f6fd6', '#ffcf3a', '#2fae6a', '#ff7a1a', '#ffffff'];

export async function init() {
  const W = await (await fetch('/work/bolts5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), screw: wt('screw', 0), bolt: wt('bolt', 0), rivet: wt('rivet', 0), vanished: wt('vanished', 0), five: wt('five', 0),
    wheels: wt('wheels', 2), bolts2: wt('bolts', 2), bye: wt('bye', 2), wheels2: wt('wheels', 2, 1), hello: wt('hello', 2), sparks: wt('sparks', 2),
    stadium: wt('stadium', 4), bolted4: wt('bolted', 4), concrete: wt('concrete', 4), crowd: wt('crowd', 4), slides: wt('slides', 4), field: wt('field', 4),
    eiffel: wt('eiffel', 6), million: wt('million', 6), rivets: wt('rivets', 6), lean: wt('lean', 6), pisa: wt('pisa', 6), jealous: wt('jealous', 6),
    laptop: wt('laptop', 8), screws8: wt('screws', 8), opens: wt('opens', 8), sandwich: wt('sandwich', 8),
    roller: wt('roller', 10), bolted10: wt('bolted', 10), upside: wt('upside', 10), down: wt('down', 10), leaving: wt('leaving', 10),
    back: wt('back', 11), slams: wt('slams', 11), catches: wt('catches', 11), screaming: wt('screaming', 11), alive: wt('alive', 11),
    good: wt('good', 12), furniture: wt('furniture', 12), rebuilt: wt('rebuilt', 12), leftover: wt('leftover', 12), first: wt('first', 12), history: wt('history', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n }); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += boltBurst(t, t0 + 0.05, [[200, 500], [880, 560], [160, 1500], [900, 1450], [540, 1650]], { seed: 60 + n, s: 0.9 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };
  const FL = 1560; // feet line, head at FL-550*1.1 ≈ 955 (above caption band)

  const shots = [
    // 0 hook: city street — street lamps, traffic light, billboard, scaffolding: all bolted, all drop
    [0, (t) => {
      const FL = 1430, v = T.vanished, gone = t >= v, d = Math.max(0, t - v);
      let s = vgrad('#5aa8f0', '#d8eefc', 0, FL);
      const r = rng(5); for (let i = 0; i < 7; i++) { const w = 130 + r() * 90, h = 380 + r() * 420, x = i * 160 - 30, c = ['#e85a4a', '#f2b33a', '#4a8ae0', '#7ac06a', '#e07ab0'][i % 5]; s += rect(x, FL - h, w, h, c) + [...Array(Math.floor(h / 90))].map((_, j) => rect(x + 20, FL - h + 30 + j * 90, w - 40, 40, '#ffffff', 4, 'opacity="0.55"')).join(''); }
      s += rect(-40, FL, 1160, 700, '#9a9ea6') + rect(-40, FL, 1160, 14, '#c4c8ce');
      // billboard on two posts (top) — drops
      const bbY = gone ? fall(t, v, 900, 1300) : 900, bbR = gone ? Math.min(14, d * 40) : 0;
      s += rect(150, 900, 20, 540, STEEL2) + rect(910, 900, 20, 540, STEEL2);
      s += g(rect(-400, -130, 800, 260, '#ffcf3a', 10, 'stroke="#1d1f24" stroke-width="10"') + t2(0, 30, 'BUILT TO LAST', 72, '#1d1f24', { weight: 900 }), `translate(540 ${bbY.toFixed(0)}) rotate(${bbR.toFixed(1)})`);
      // street lamps topple
      [[70, -1], [1010, 1]].forEach(([x, dir]) => { const rot = gone ? dir * Math.min(80, 300 * d * d) : 0; s += g(rect(-9, -700, 18, 700, '#2a2e36') + rect(dir < 0 ? -110 : 0, -700, 110, 14, '#2a2e36') + circ(dir * 105, -680, 20, '#ffe9a8'), `translate(${x} ${FL}) rotate(${rot.toFixed(1)})`); });
      // you (centre), arms up when it goes
      s += adult({ ...YOU, x: 540, y: 1890, s: 0.85, face: gone ? 'open' : 'neutral', pose: gone ? 'up' : 'stand' });
      s += adult({ ...CROWD[0], x: 820, y: 1880, s: 0.82, face: gone ? 'open' : 'smile', pose: gone ? 'up' : 'phone' });
      s += adult({ ...CROWD[3], x: 260, y: 1880, s: 0.82, face: gone ? 'open' : 'neutral', pose: gone ? 'up' : 'hold', top: '#2fae6a' });
      s += boltBurst(t, v, [[160, 900], [920, 900], [540, 900], [70, 900], [1010, 900], [420, 1450], [660, 1450]], { seed: 3, s: 0.8 });
      s += debris(t, bbY >= 1300 ? v + Math.sqrt(2 * 740 / 3600) : 99, 540, 1430, { n: 40, col: '#ffcf3a', spread: 1100, seed: 4, size: 34 });
      s += hit(540, 560, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)) * (1 - seg(t, T.screw - 0.15, T.screw - 0.05)), '#ff2a3a', -5, 150);
      s += chip(540, 450, 'SCREWS', pop(seg(t, T.screw - 0.1, T.screw + 0.05)) * (1 - seg(t, v - 0.12, v - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += chip(540, 570, 'BOLTS', pop(seg(t, T.bolt - 0.1, T.bolt + 0.05)) * (1 - seg(t, v - 0.12, v - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += chip(540, 690, 'RIVETS', pop(seg(t, T.rivet - 0.1, T.rivet + 0.05)) * (1 - seg(t, v - 0.12, v - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 500, 'ALL GONE', seg(t, v - 0.08, v + 0.2), '#ff2a3a', -6, 110);
      s += chip(540, 700, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += flash(t, 0, 0.6) + flash(t, v - 0.04, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.news, T.screw, T.bolt, T.rivet, v, T.five], 0.1), z1: 1, oy: 1200 }), shake(t, [0.03, T.news, v, v + 0.45, T.five], 34)) + pill('5 SECONDS');
    }],
    [N[0], card(1)],
    // 2 highway: wheels leave, car scrapes on its belly, sparks
    [C[0], (t) => {
      const v = T.bye - 0.05, gone = t >= v, d = Math.max(0, t - v);
      let s = vgrad('#7ab8f0', '#e8f4fc', 0, 1300) + rect(0, 1100, 1080, 200, '#7ac06a');
      for (let i = 0; i < 6; i++) { const x = ((i * 260 - t * 900) % 1560 + 1560) % 1560 - 240; s += circ(x, 1080, 90, '#4a9a4a') + rect(x - 12, 1080, 24, 120, '#6a4a2a'); }
      s += rect(0, 1300, 1080, 620, '#4a4e56') + rect(0, 1300, 1080, 16, '#e8e8e0');
      for (let i = 0; i < 6; i++) { const x = ((i * 240 - t * 2400) % 1440 + 1440) % 1440 - 240; s += rect(x, 1790, 140, 18, '#f2f2ea', 4); }
      s += speedLines(t, { a: 0.25, dir: -1, seed: 6 });
      // car (big, side view), tinted windows
      const CY = gone ? Math.min(1740, 1700 + d * 400) : 1700 + Math.sin(t * 30) * 3, CX = 470 - (gone ? Math.min(120, d * 120) : 0);
      s += g(rect(-330, -150, 660, 150, '#c8102e', 40) + `<path d="M-210,-150 L-130,-270 L150,-270 L230,-150Z" fill="#c8102e"/>` + `<path d="M-185,-156 L-118,-250 L0,-250 L0,-156Z M18,-156 L18,-250 L138,-250 L205,-156Z" fill="#1a2230"/>` + rect(300, -120, 30, 26, '#ffe9a8', 6) + rect(-330, -60, 660, 14, '#8a0a1e'), `translate(${CX.toFixed(0)} ${CY.toFixed(0)}) rotate(${gone ? Math.min(3, d * 8).toFixed(1) : 0} ${CX} ${CY})`);
      // wheels: attached, then roll ahead and away
      const wy = 1700 + 10, rot = t * 1400;
      [[-190, 0], [190, 1]].forEach(([dx, i]) => { const wx = CX + dx + (gone ? d * (380 + i * 160) : 0), yy = gone ? 1760 - Math.abs(Math.sin(d * 7 + i)) * 60 * Math.max(0, 1 - d) : wy; s += wheel(wx, yy, 70, rot); if (!gone) s += boltBurst(t, v, [[wx - 18, yy - 18], [wx + 18, yy + 18]], { seed: 10 + i, s: 0.35 }); });
      if (gone) s += boltBurst(t, v, [[CX - 190, 1700], [CX + 190, 1700], [CX - 170, 1690], [CX + 210, 1690]], { seed: 12, s: 0.5 });
      if (t > T.hello - 0.3) s += sparks(t, CX - 250, 1745, { n: 40, seed: 7, a: pop(seg(t, T.hello - 0.3, T.hello)) }) + sparks(t, CX + 150, 1745, { n: 30, seed: 8, a: pop(seg(t, T.hello - 0.3, T.hello)) });
      s += chip(540, 500, 'WHEELS: BOLTED ON', pop(seg(t, T.wheels - 0.1, T.wheels + 0.1)) * (1 - seg(t, v - 0.12, v - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += hit(540, 520, 'BYE, WHEELS', pop(seg(t, v - 0.05, v + 0.1)) * (1 - seg(t, T.hello - 0.15, T.hello - 0.05)), '#ff2a3a', -5, 130);
      s += stamp(540, 520, 'HELLO, SPARKS', seg(t, T.hello - 0.08, T.hello + 0.2), '#ff7a1a', 5, 84);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, v, 0.8) + flash(t, T.sparks - 0.05, 0.5, '#ffb31a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.wheels, T.bolts2, v, T.hello, T.sparks], 0.1), z1: 1.04, oy: 1500 }), shake(t, [v, v + 0.3, T.hello, T.sparks], 34, 5)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 stadium: seats bolted to concrete -> whole crowd slides onto the field
    [C[1], (t) => {
      const v = T.crowd - 0.15, d = Math.max(0, t - v); let s = vgrad('#3a8ae0', '#bfe0fc', 0, 700);
      for (let i = 0; i < 4; i++) s += rect(80 + i * 290, 300, 14, 300, '#3a3f4a') + glow(87 + i * 290, 300, 120, '#ffffff', 0.6) + rect(40 + i * 290, 270, 94, 40, '#f2f4f7', 6);
      // grass field bottom
      s += rect(0, 1380, 1080, 540, '#3aa04a'); for (let i = 0; i < 6; i++) s += rect(i * 180, 1380, 90, 540, '#46b056');
      s += rect(0, 1380, 1080, 14, '#ffffff') + `<ellipse cx="540" cy="1700" rx="260" ry="90" fill="none" stroke="#ffffff" stroke-width="10"/>`;
      // concrete stands (sloped band from y 600 to 1380)
      s += `<path d="M0,600 L1080,600 L1080,1380 L0,1380Z" fill="#b8bcc4"/>`; for (let r = 0; r < 8; r++) s += rect(0, 640 + r * 92, 1080, 12, '#9a9ea6');
      // rows of seats+fans; they slide down onto the grass
      const r = rng(21);
      for (let row = 0; row < 7; row++) for (let c = 0; c < 11; c++) {
        const x0 = 50 + c * 98 + (row % 2) * 40, y0 = 690 + row * 92, col = FANC[Math.floor(r() * 6)], j = r();
        const kk = L.ease(clamp((t - v - row * 0.04 - j * 0.1) / 0.9));
        const x = x0 + (j - 0.5) * 160 * kk, y = lerp(y0, 1480 + row * 50 + j * 40, kk), rot = Math.sin(j * 9) * 40 * kk;
        s += g(rect(-34, -10, 68, 30, '#2f6fd6', 6), `translate(${x.toFixed(0)} ${(y + 40).toFixed(0)}) rotate(${rot.toFixed(0)})`) + fan(x, y, 1, col, rot, kk > 0.1 && kk < 0.95);
      }
      s += boltBurst(t, T.bolted4 + 0.25, [[150, 730], [400, 820], [700, 760], [930, 900], [260, 1010], [800, 1100]], { seed: 22, s: 0.6 });
      if (d > 0.4) s += debris(t, v + 0.6, 540, 1450, { n: 40, col: '#2f6fd6', spread: 1000, seed: 23, size: 28 });
      s += chip(540, 500, 'STADIUM SEATS', pop(seg(t, T.stadium - 0.1, T.stadium + 0.1)) * (1 - seg(t, T.bolted4 - 0.12, T.bolted4 - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 500, 'BOLTED TO CONCRETE', seg(t, T.bolted4 - 0.08, T.bolted4 + 0.2) * (1 - seg(t, v - 0.12, v - 0.02)), '#141a22', -5, 58);
      s += hit(540, 500, 'SLIDE!', pop(seg(t, T.slides - 0.1, T.slides + 0.1)) * (1 - seg(t, T.field - 0.12, T.field - 0.02)), '#ff2a3a', -6, 180);
      s += stamp(540, 500, 'ONTO THE FIELD', seg(t, T.field - 0.08, T.field + 0.2), '#ff2a3a', 5, 80);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, v, 0.7) + flash(t, T.field - 0.05, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.stadium, T.bolted4, v, T.slides, T.field], 0.1), z1: 1, oy: 1100 }), shake(t, [T.bolted4 + 0.25, v, v + 0.5, T.slides, T.field], 34, 5)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 Eiffel Tower: 2.5 million rivets pop -> tower leans, sections separate; Pisa is jealous
    [C[2], (t) => {
      const kL = L.ease(clamp((t - T.lean + 0.15) / 1.0)); let s = vgrad('#ffb07a', '#ffe8c8', 0, 1700);
      s += glow(800, 700, 300, '#fff4c8', 0.7);
      for (let i = 0; i < 9; i++) { const h = 120 + (i * 37 % 90); s += rect(i * 125 - 10, 1700 - h, 115, h, ['#c89a8a', '#b88a8a', '#d8aa9a'][i % 3]) + rect(i * 125 + 10, 1700 - h - 30, 75, 30, '#6a7a9a'); }
      s += rect(0, 1700, 1080, 220, '#6a9a5a');
      // tower = 3 sections; rotate around base, gaps open up
      const BX = 540, BY = 1700, ang = 14 * kL, gap = 30 * kL;
      const IRON = '#6a4a3a';
      const lat = (y0, y1, w0, w1, n) => { let p = `<path d="M${-w0},${y0} L${-w1},${y1} L${w1},${y1} L${w0},${y0}" fill="none" stroke="${IRON}" stroke-width="16"/>`; for (let i = 0; i < n; i++) { const a = i / n, b = (i + 1) / n, ya = lerp(y0, y1, a), yb = lerp(y0, y1, b), wa = lerp(w0, w1, a), wb = lerp(w0, w1, b); p += `<path d="M${-wa},${ya} L${wb},${yb} M${wa},${ya} L${-wb},${yb}" stroke="${IRON}" stroke-width="7"/>`; } return p; };
      const sec1 = `<path d="M-330,0 Q-200,-170 -190,-330 L190,-330 Q200,-170 330,0 L250,0 Q140,-150 0,-170 Q-140,-150 -250,0Z" fill="${IRON}"/>` + rect(-230, -360, 460, 40, IRON, 4);
      const sec2 = lat(-360, -680, 180, 95, 4) + rect(-130, -710, 260, 30, IRON, 4);
      const sec3 = lat(-710, -1180, 90, 18, 6) + rect(-10, -1260, 20, 90, IRON);
      // tourists on the 2nd platform (tiny, no faces)
      const tour = [...Array(6)].map((_, i) => fan(-110 + i * 44, -735, 0.6, FANC[i % 6], kL * -10, kL > 0.2)).join('');
      s += g(g(sec1) + g(sec2 + tour, `translate(${(gap * 0.4).toFixed(1)} ${(-gap * 0.3).toFixed(1)}) rotate(${(ang * 0.25).toFixed(2)} 0 -360)`) + g(sec3, `translate(${(gap * 1.3).toFixed(1)} ${(-gap).toFixed(1)}) rotate(${(ang * 0.5).toFixed(2)} 0 -710)`), `translate(${BX} ${BY}) rotate(${ang.toFixed(2)} 0 0)`);
      // rivets: hundreds of glinting dots pop off at "rivets"
      const kR = t - T.rivets + 0.1; if (kR > -0.3 && kR < 1.2) { const r = rng(31); for (let i = 0; i < 160; i++) { const hy = r(), y = BY - hy * 1150, w = lerp(330, 20, Math.pow(hy, 0.6)), x = BX + (r() - 0.5) * 2 * w; const dd = Math.max(0, kR); const px = x + (r() - 0.5) * 600 * dd, py = y + 700 * dd * dd - 150 * dd; s += circ(px, py, 7 + r() * 5, '#ffe9a8', `opacity="${(kR < 0 ? pop((kR + 0.3) / 0.3) : Math.max(0, 1 - dd / 1.2)).toFixed(2)}"`); } }
      // Pisa inset (bottom-right), leaning the other way, jealous
      const kP = pop(seg(t, T.pisa - 0.15, T.pisa + 0.1));
      if (kP > 0) s += g(rect(-60, -330, 120, 330, '#f6eee0', 8, 'stroke="#c8bca8" stroke-width="6"') + [...Array(6)].map((_, i) => rect(-64, -320 + i * 55, 128, 10, '#c8bca8')).join('') + rect(-50, -380, 100, 50, '#f6eee0', 8, 'stroke="#c8bca8" stroke-width="6"') + `<path d="M-35,-240 l25,12 M35,-240 l-25,12" stroke="#1d1f24" stroke-width="9" stroke-linecap="round"/>` + circ(-18, -215, 8, '#1d1f24') + circ(18, -215, 8, '#1d1f24') + `<path d="M-20,-170 q20,-16 40,0" stroke="#1d1f24" stroke-width="7" fill="none"/>`, `translate(890 1720) rotate(-6) scale(${kP})`);
      s += chip(540, 470, 'EIFFEL TOWER', pop(seg(t, T.eiffel - 0.1, T.eiffel + 0.1)) * (1 - seg(t, T.million - 0.2, T.million - 0.1)), { size: 52, col: '#fff', bg: '#141a22' });
      s += hit(540, 490, '2,500,000 RIVETS', pop(seg(t, T.million - 0.15, T.million + 0.05)) * (1 - seg(t, T.lean - 0.12, T.lean - 0.02)), '#ff2a3a', -4, 100);
      s += stamp(540, 480, 'IT LEANS', seg(t, T.lean - 0.08, T.lean + 0.2) * (1 - seg(t, T.pisa - 0.15, T.pisa - 0.05)), '#ff2a3a', 6, 110);
      s += hit(540, 490, 'PISA: JEALOUS', pop(seg(t, T.pisa - 0.08, T.pisa + 0.1)), '#141a22', -5, 110);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, T.rivets - 0.05, 0.7) + flash(t, T.lean - 0.05, 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.eiffel, T.million, T.rivets, T.lean, T.pisa], 0.1), z1: 1, oy: 1300 }), shake(t, [T.rivets, T.lean, T.lean + 0.5, T.pisa], 34, 5)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 laptop: tiny screws pop, it opens like a sandwich (layers fly apart)
    [C[3], (t) => {
      const v = T.opens - 0.08, k = L.easeOut(clamp((t - v) / 0.5)); let s = vgrad('#2a3242', '#141a22');
      s += glow(540, 1200, 700, '#4a8ae0', 0.35) + rect(-40, 1600, 1160, 400, '#8a5a3a') + rect(-40, 1600, 1160, 20, '#a8744a');
      // layers (from top): screen, keyboard deck, logic board, battery, bottom plate
      const L5 = [
        ['screen', 900, (y) => rect(160, y - 280, 760, 280, '#1a1d24', 18) + rect(185, y - 260, 710, 240, '#3a6ad6', 8) + t2(540, y - 120, 'DEADLINE.DOCX', 44, '#ffffff', { weight: 800 })],
        ['keys', 1240, (y) => rect(140, y - 50, 800, 50, '#c8ced8', 10) + [...Array(3)].map((_, rr) => [...Array(12)].map((_, c) => rect(170 + c * 63, y - 44 + rr * 14, 54, 10, '#2a2e36', 2)).join('')).join('')],
        ['board', 1400, (y) => rect(160, y - 30, 760, 30, '#2fae6a', 4) + [...Array(8)].map((_, i) => rect(200 + i * 90, y - 50, 50, 22, '#1d1f24', 3)).join('')],
        ['batt', 1510, (y) => rect(200, y - 34, 680, 34, '#ffcf3a', 6) + t2(540, y - 6, 'BATTERY', 26, '#1d1f24', { weight: 900 })],
        ['plate', 1590, (y) => rect(140, y - 18, 800, 18, STEEL, 8)],
      ];
      const closedY = [1560, 1570, 1576, 1582, 1590];
      L5.forEach(([nm, openY, draw], i) => { const y = lerp(closedY[i], openY, k) + (k > 0 ? Math.sin(t * 9 + i) * 10 * k : 0); const rot = k * (i - 2) * 3; s += g(draw(y), `rotate(${rot.toFixed(1)} 540 ${y.toFixed(0)})`); });
      if (k === 0) s += rect(160, 1280, 760, 280, '#1a1d24', 18) + rect(185, 1300, 710, 240, '#3a6ad6', 8) + t2(540, 1440, 'DEADLINE.DOCX', 44, '#ffffff', { weight: 800 }) + rect(140, 1560, 800, 40, '#c8ced8', 10);
      // tiny screws shooting out at "screws"
      s += boltBurst(t, T.screws8 + 0.15, [[170, 1590], [370, 1590], [540, 1590], [710, 1590], [910, 1590], [270, 1580], [810, 1580]], { seed: 41, s: 0.45 });
      s += debris(t, v, 540, 1450, { n: 30, col: '#2a2e36', spread: 900, seed: 42, size: 26 });
      s += chip(540, 470, 'YOUR LAPTOP', pop(seg(t, T.laptop - 0.1, T.laptop + 0.1)) * (1 - seg(t, T.screws8 - 0.2, T.screws8 - 0.1)), { size: 52, col: '#fff', bg: '#c8102e' });
      s += stamp(540, 480, 'TINY SCREWS', seg(t, T.screws8 - 0.1, T.screws8 + 0.15) * (1 - seg(t, v - 0.1, v)), '#ffffff', -5, 84);
      s += hit(540, 480, 'SANDWICH', pop(seg(t, T.sandwich - 0.12, T.sandwich + 0.05)), '#ffcf3a', -5, 160);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, T.screws8, 0.5) + flash(t, v, 0.8);
      return g(cam(fin(s, 0.3), 0, { z0: punch(t, [T.laptop, T.screws8, v, T.sandwich], 0.12), z1: 1.03, oy: 1300 }), shake(t, [T.screws8 + 0.15, v, T.sandwich], 34)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 roller coaster loop: upside down at the top, track sections drift apart
    [C[4], (t) => {
      const v = T.leaving - 0.25, k = L.ease(clamp((t - v) / 0.8)); let s = vgrad('#4aa8f0', '#d8f0ff');
      for (let i = 0; i < 4; i++) s += `<ellipse cx="${(150 + i * 300 + t * 30) % 1200 - 60}" cy="${300 + (i % 2) * 120}" rx="140" ry="50" fill="#ffffff" opacity="0.8"/>`;
      s += rect(0, 1650, 1080, 270, '#7ac06a');
      // loop centre, radius
      const OX = 540, OY = 1000, R = 330, NSEG = 10;
      // support towers
      s += rect(OX - 360, 1000, 24, 650, '#c8102e') + rect(OX + 336, 1000, 24, 650, '#c8102e') + rect(OX - 12, 1330, 24, 320, '#c8102e');
      for (let i = 0; i < NSEG; i++) { const a0 = (i / NSEG) * Math.PI * 2, a1 = ((i + 1) / NSEG) * Math.PI * 2, am = (a0 + a1) / 2; const off = k * (60 + (i * 37) % 80), ox = Math.cos(am) * off, oy = Math.sin(am) * off + k * k * 120; const rot = k * ((i * 53) % 30 - 15);
        const p = (a, rr) => `${(OX + Math.cos(a) * rr).toFixed(0)},${(OY + Math.sin(a) * rr).toFixed(0)}`;
        s += g(`<path d="M${p(a0, R)} A${R},${R} 0 0 1 ${p(a1, R)}" stroke="#2f6fd6" stroke-width="34" fill="none"/><path d="M${p(a0, R - 34)} A${R - 34},${R - 34} 0 0 1 ${p(a1, R - 34)}" stroke="#1a4aa8" stroke-width="12" fill="none"/>`, `translate(${ox.toFixed(1)} ${oy.toFixed(1)}) rotate(${rot.toFixed(1)} ${OX + Math.cos(am) * R} ${OY + Math.sin(am) * R})`);
      }
      // train at the top of the loop, upside down (riders hang below the track = inside the loop)
      const ta = -Math.PI / 2 + Math.sin(t * 2) * 0.05; const tx = OX + Math.cos(ta) * (R - 60), ty = OY + Math.sin(ta) * (R - 60) + k * 40;
      let train = ''; for (let i = 0; i < 3; i++) { train += rect(-90 + i * 66 - 30, -28, 60, 56, '#ffcf3a', 12) + fan(-90 + i * 66, 60, 0.9, FANC[i + 1], 180, true); }
      s += g(train, `translate(${tx.toFixed(0)} ${ty.toFixed(0)}) rotate(${(k * 8).toFixed(1)})`);
      s += boltBurst(t, T.bolted10 + 0.2, [...Array(NSEG)].map((_, i) => [OX + Math.cos((i / NSEG) * Math.PI * 2) * R, OY + Math.sin((i / NSEG) * Math.PI * 2) * R]), { seed: 51, s: 0.55 });
      s += chip(540, 470, 'ROLLER COASTER', pop(seg(t, T.roller - 0.1, T.roller + 0.1)) * (1 - seg(t, T.bolted10 - 0.12, T.bolted10 - 0.02)), { size: 52, col: '#fff', bg: '#141a22' });
      s += stamp(540, 480, 'BOLTED TRACK', seg(t, T.bolted10 - 0.08, T.bolted10 + 0.2) * (1 - seg(t, T.upside - 0.12, T.upside - 0.02)), '#141a22', -5, 80);
      s += hit(540, 480, 'UPSIDE DOWN', pop(seg(t, T.upside - 0.1, T.upside + 0.1)) * (1 - seg(t, v - 0.12, v - 0.02)), '#ff2a3a', 180 + 4, 120);
      s += stamp(540, 480, 'TRACK: LEAVING', seg(t, v - 0.05, v + 0.2), '#ff2a3a', 5, 84);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, T.bolted10 + 0.2, 0.6) + flash(t, v, 0.8);
      return g(cam(fin(s), 0, { z0: punch(t, [T.roller, T.bolted10, T.upside, v, T.leaving], 0.1), z1: 1, oy: 1000 }), shake(t, [T.bolted10 + 0.2, T.upside, v, v + 0.4], 34, 5)) + bar(t) + pill('SECOND 5');
    }],
    // 11 bolts back: track slams together, train caught, alive
    [C[5], (t) => {
      const k = 1 - L.easeOut(clamp((t - C[5]) / 0.25)); let s = vgrad('#4aa8f0', '#d8f0ff') + rect(0, 1650, 1080, 270, '#7ac06a');
      const OX = 540, OY = 1000, R = 330, NSEG = 10;
      s += rect(OX - 360, 1000, 24, 650, '#c8102e') + rect(OX + 336, 1000, 24, 650, '#c8102e') + rect(OX - 12, 1330, 24, 320, '#c8102e');
      for (let i = 0; i < NSEG; i++) { const a0 = (i / NSEG) * Math.PI * 2, a1 = ((i + 1) / NSEG) * Math.PI * 2, am = (a0 + a1) / 2; const off = k * (60 + (i * 37) % 80); const p = (a, rr) => `${(OX + Math.cos(a) * rr).toFixed(0)},${(OY + Math.sin(a) * rr).toFixed(0)}`;
        s += g(`<path d="M${p(a0, R)} A${R},${R} 0 0 1 ${p(a1, R)}" stroke="#2f6fd6" stroke-width="34" fill="none"/><path d="M${p(a0, R - 34)} A${R - 34},${R - 34} 0 0 1 ${p(a1, R - 34)}" stroke="#1a4aa8" stroke-width="12" fill="none"/>`, `translate(${(Math.cos(am) * off).toFixed(1)} ${(Math.sin(am) * off).toFixed(1)})`); }
      // bolts slam back in at every joint (scale-in)
      const kb = pop(seg(t, C[5] + 0.15, C[5] + 0.35)); if (kb > 0 && t < T.screaming) for (let i = 0; i < NSEG; i++) { const a = (i / NSEG) * Math.PI * 2; s += bolt(OX + Math.cos(a) * R, OY + Math.sin(a) * R, 0.5 * kb * (1 + 0.3 * (1 - kb)), 0); }
      // train moving around the loop once caught
      const tm = Math.max(0, t - T.catches + 0.2), ta = -Math.PI / 2 + tm * 2.6; const tx = OX + Math.cos(ta) * (R - 60), ty = OY + Math.sin(ta) * (R - 60);
      let train = ''; for (let i = 0; i < 3; i++) train += rect(-90 + i * 66 - 30, -28, 60, 56, '#ffcf3a', 12) + fan(-90 + i * 66, 60, 0.9, FANC[i + 1], 180, true);
      s += g(train, `translate(${tx.toFixed(0)} ${ty.toFixed(0)}) rotate(${((ta + Math.PI / 2) * 180 / Math.PI).toFixed(1)})`);
      if (t > T.catches) s += speedLines(t, { a: 0.2, seed: 13 });
      s += stamp(540, 480, 'BOLTS: BACK', seg(t, C[5], C[5] + 0.25) * (1 - seg(t, T.slams - 0.12, T.slams - 0.02)), '#2fae6a', 6, 96);
      s += hit(540, 490, 'SLAM!', pop(seg(t, T.slams - 0.1, T.slams + 0.08)) * (1 - seg(t, T.catches - 0.12, T.catches - 0.02)), '#ff2a3a', -6, 200);
      s += chip(540, 480, 'CAUGHT', pop(seg(t, T.catches - 0.1, T.catches + 0.1)) * (1 - seg(t, T.screaming - 0.12, T.screaming - 0.02)), { size: 70, col: '#fff', bg: '#2fae6a' });
      s += hit(540, 480, 'SCREAMING', pop(seg(t, T.screaming - 0.1, T.screaming + 0.08)) * (1 - seg(t, T.alive - 0.12, T.alive - 0.02)), '#ffcf3a', 4, 140);
      s += stamp(540, 480, 'BUT ALIVE', seg(t, T.alive - 0.08, T.alive + 0.2), '#2fae6a', -6, 110);
      s += flash(t, C[5], 0.95, '#2fae6a', 0.3) + flash(t, T.slams - 0.03, 0.8) + flash(t, T.alive - 0.05, 0.5, '#2fae6a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.slams, T.catches, T.screaming, T.alive], 0.13), z1: 1, oy: 1000 }), shake(t, [C[5] + 0.2, T.slams, T.catches, T.alive], 40, 6)) + pill('BOLTS: BACK');
    }],
    // 12 furniture rebuilt itself, no leftover screws, first time in human history
    [C[6], (t) => {
      const kA = L.easeOut(clamp((t - T.furniture + 0.1) / 0.8)); let s = vgrad('#ffe8c8', '#ffcf9a') + rect(0, 1500, 1080, 420, '#c89a6a');
      for (let i = 0; i < 9; i++) s += rect(i * 130, 1500, 6, 420, '#b8885a');
      // wardrobe parts flying into place
      const r = rng(71); const P = [[300, 640, 30, 860], [750, 640, 30, 860], [300, 640, 480, 30], [300, 1470, 480, 30], [330, 900, 420, 22], [330, 1180, 420, 22], [330, 670, 210, 800], [540, 670, 210, 800]];
      P.forEach(([x, y, w, h], i) => { const sx = (r() - 0.5) * 1800, sy = (r() - 0.5) * 1400, sr = (r() - 0.5) * 360; const kk = L.easeOut(clamp((t - T.furniture + 0.15 - i * 0.05) / 0.6)); const tr = `translate(${(sx * (1 - kk)).toFixed(0)} ${(sy * (1 - kk)).toFixed(0)}) rotate(${(sr * (1 - kk)).toFixed(0)} ${x + w / 2} ${y + h / 2})`;
        s += g(rect(x, y, w, h, i >= 6 ? '#f2e2c8' : '#d8b080', 4, `stroke="#a8744a" stroke-width="4"`) + (i >= 6 ? circ(i === 6 ? x + w - 30 : x + 30, y + 400, 12, '#8a5a3a') : ''), tr); });
      // bolts screw themselves in with a ping
      if (kA > 0.9) [[315, 655], [765, 655], [315, 1485], [765, 1485], [345, 911], [735, 911], [345, 1191], [735, 1191]].forEach(([x, y], i) => { s += bolt(x, y, 0.35 * pop(seg(t, T.rebuilt + i * 0.05, T.rebuilt + i * 0.05 + 0.12)), (t - T.rebuilt) * 400); });
      // empty screw bag
      const kE = pop(seg(t, T.leftover - 0.15, T.leftover + 0.1));
      if (kE > 0) s += g(rect(-120, -150, 240, 300, '#e8f4ff', 20, 'opacity="0.85" stroke="#9aa3b2" stroke-width="6"') + rect(-120, -150, 240, 30, '#c8102e', 10) + t2(0, 40, '0', 140, '#c8102e', { weight: 900 }), `translate(880 1680) rotate(8) scale(${kE})`);
      s += hit(540, 470, 'GOOD NEWS', pop(seg(t, T.good - 0.1, T.good + 0.1)) * (1 - seg(t, T.furniture - 0.12, T.furniture - 0.02)), '#2fae6a', -5, 140);
      s += stamp(540, 470, 'REBUILT ITSELF', seg(t, T.rebuilt - 0.08, T.rebuilt + 0.2) * (1 - seg(t, T.leftover - 0.2, T.leftover - 0.1)), '#2fae6a', 5, 84);
      s += chip(540, 470, 'NO LEFTOVER SCREWS', pop(seg(t, T.leftover - 0.1, T.leftover + 0.1)) * (1 - seg(t, T.first - 0.12, T.first - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 450, 'FIRST TIME', seg(t, T.first - 0.08, T.first + 0.15), '#c8102e', -6, 110);
      s += t2(540, 640, 'IN HUMAN HISTORY', 64, '#141a22', { weight: 900, ls: 4, extra: `opacity="${pop(seg(t, T.history - 0.4, T.history - 0.2)).toFixed(2)}"` });
      s += flash(t, C[6], 0.6) + flash(t, T.rebuilt, 0.5) + flash(t, T.first - 0.05, 0.7, '#c8102e', 0.25);
      return g(cam(fin(s), 0, { z0: punch(t, [T.good, T.rebuilt, T.leftover, T.first], 0.1), z1: 1, oy: 1200 }), shake(t, [T.rebuilt, T.leftover, T.first], 30)) + pill('ALIVE. ASSEMBLED.');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['STEEL?', 'SALT?', 'SAND?', 'IRON?', 'ZIPPERS?', 'SUGAR?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 }) + boltBurst(t, C[7] + 0.1, [[200, 1500], [880, 1450], [540, 1750], [150, 400], [930, 380]], { seed: 81, s: 0.9 });
      s += bigText(540, 520, 'WHAT', 1, { size: 170 }) + bigText(540, 700, 'VANISHES', 1, { size: 150, col: '#ffcf6a' }) + bigText(540, 880, 'NEXT?', 1, { size: 170 });
      s += bigText(540, 1520, opts[i], 1, { size: 120, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
