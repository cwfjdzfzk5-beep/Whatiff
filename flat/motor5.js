// "What if every motor on Earth went full power for five seconds?" — HYPE format (Mode B, owner 18:00).
import * as L from './lib.js';
import { adult, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, YOU, CROWD, chip, shake, flash, punch, bigText, stamp, speedLines, debris, timerBar } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const hit = (x, y, text, k, col = '#ff2a3a', rot = -6, size = 120) => bigText(x, y, text, k, { size, col, stroke: '#ffffff', rot });
const fin = (s, v = 0.4) => s + grade('#0b1a2e', '#2e1a0b', 0.08) + L.vignette(v);
const FANC = ['#c8102e', '#2f6fd6', '#ffcf3a', '#2fae6a', '#ff7a1a', '#ffffff'];
const PINK = '#ff5a9a';
// gear icon centred at x,y
const gear = (x, y, s = 1, rot = 0, col = '#ffcf3a', a = 1) => { let p = ''; for (let i = 0; i < 8; i++) p += rect(-14, -78, 28, 30, col, 4, `transform="rotate(${i * 45})"`); return g(p + circ(0, 0, 58, col) + circ(0, 0, 22, '#141a22'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s.toFixed(3)})`, `opacity="${a.toFixed(2)}"`); };
// gears burst out from points
function gearBurst(t, t0, pts, { seed = 1, s = 0.6, col = '#ffcf3a' } = {}) {
  const d = t - t0; if (d < 0 || d > 1.1) return ''; const r = rng(seed); let out = '';
  for (const [x, y] of pts) { const a = r() * Math.PI * 2, v = 300 + r() * 500; out += gear(x + Math.cos(a) * v * d, y + Math.sin(a) * v * d * 0.6 + 700 * d * d, s * (1 - d * 0.4), d * 900 * (r() - 0.5), col, Math.max(0, 1 - d / 1.1)); }
  return out;
}
// small faceless figure (body + head disk), like the crowd figures of the bolts video
const fig = (x, y, s, col, rot = 0, armsUp = false) => g(rect(-22, -20, 44, 60, col, 14) + circ(0, -40, 22, '#e8b894') + (armsUp ? `<path d="M-18,-10 L-36,-56 M18,-10 L36,-56" stroke="${col}" stroke-width="12" stroke-linecap="round"/>` : ''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s})`);
// smoke puffs behind a point
function smoke(t, x, y, { n = 10, seed = 3, a = 0.8, dir = -1, col = '#e8e8ee' } = {}) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const ph = (t * (1.2 + r()) + r()) % 1; const px = x + dir * ph * (200 + r() * 260), py = y - ph * (60 + r() * 120) + (r() - 0.5) * 40, rr = 30 + ph * 90; s += circ(px, py, rr, col, `opacity="${(a * (1 - ph)).toFixed(2)}"`); }
  return s;
}
const splat = (x, y, r0, k, seed, col = PINK) => { if (k <= 0) return ''; const r = rng(seed); let s = circ(x, y, r0 * k, col); for (let i = 0; i < 7; i++) { const a = r() * 6.28, d = r0 * (0.8 + r() * 0.8) * k; s += circ(x + Math.cos(a) * d, y + Math.sin(a) * d, r0 * (0.2 + r() * 0.3) * k, col); } return s; };
// side-view car
const car = (x, y, col, wrot = 0, s = 1) => g(rect(-230, -110, 460, 110, col, 34) + `<path d="M-150,-110 L-90,-200 L110,-200 L170,-110Z" fill="${col}"/>` + `<path d="M-130,-116 L-82,-186 L0,-186 L0,-116Z M14,-116 L14,-186 L100,-186 L150,-116Z" fill="#1a2230"/>` + rect(205, -90, 26, 22, '#ffe9a8', 6) + [-140, 140].map((dx) => g(circ(0, 0, 52, '#141618') + circ(0, 0, 26, '#b8c0cc') + rect(-4, -24, 8, 48, '#6a7382'), `translate(${dx} 0) rotate(${wrot.toFixed(0)})`)).join(''), `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s})`);
// washing machine (front), centred bottom at x,y
const washer = (x, y, rot = 0, drum = 0, s = 1, open = 0) => { let d = ''; for (let i = 0; i < 5; i++) { const a = drum + i * 1.256; d += circ(Math.cos(a) * 70, -200 + Math.sin(a) * 70, 34, FANC[i]); }
  return g(rect(-170, -400, 340, 400, '#f2f4f7', 26, 'stroke="#b8c0cc" stroke-width="8"') + rect(-150, -380, 300, 60, '#d8dee8', 12) + circ(90, -350, 16, '#2f6fd6') + circ(40, -350, 12, '#c8102e') + circ(0, -200, 120, '#6a7382') + circ(0, -200, 105, '#1a2a3a') + d + circ(0, -200, 105, '#8ac8ff', 'opacity="0.25"'), `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(1)}) scale(${s})`); };

export async function init() {
  const W = await (await fetch('/work/motor5/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const S0 = (s) => W.find((x) => x.seg === s).start;
  const fps = 30, total = W[W.length - 1].end + 0.6;
  const T = {
    news: wt('news', 0), motor: wt('motor', 0), earth: wt('earth', 0), full: wt('full', 0), power: wt('power', 0), five: wt('five', 0),
    blender: wt('blender', 2), thirty: wt('thirty', 2), rpm: wt('rpm', 2), lid: wt('lid', 2), gone: wt('gone', 2), ceiling: wt('ceiling', 2),
    car: wt('car', 4), floors: wt('floors', 4), parked: wt('parked', 4), driver: wt('driver', 4), coffee: wt('coffee', 4),
    washing: wt('washing', 6), spin: wt('spin', 6), walks: wt('walks', 6), door: wt('door', 6), laundry: wt('laundry', 6), left: wt('left', 6),
    mall: wt('mall', 8), escalator: wt('escalator', 8), launch: wt('launch', 8), ramp: wt('ramp', 8), everyone: wt('everyone', 8), lands: wt('lands', 8), court: wt('court', 8),
    office: wt('office', 10), fan: wt('fan', 10), rips: wt('rips', 10), chases: wt('chases', 10), boss: wt('boss', 10), hell: wt('hell', 10),
    back: wt('back', 11), stops: wt('stops', 11), alive: wt('alive', 11), sticky: wt('sticky', 11), alive2: wt('alive', 11, 1),
    laundry2: wt('laundry', 12), blocks: wt('blocks', 12), and: wt('and', 12), boss2: wt('boss', 12), cardio: wt('cardio', 12),
    next: wt('next', 13), worse: wt('worse', 13),
  };
  const N = [1, 3, 5, 7, 9].map((s) => S0(s) - 0.08);
  const C = [2, 4, 6, 8, 10, 11, 12, 13].map((s) => S0(s) - 0.06);
  const tStart = N[0], tEnd = C[5];
  const bar = (t) => (t >= tStart && t < tEnd ? timerBar(t, tStart, tEnd) : '');
  const card = (n) => (t) => { const t0 = N[n - 1]; let s = vgrad('#c8102e', '#5a0612') + speedLines(t, { a: 0.22, vertical: true, dir: -1, seed: n }); s += gear(540, 860, 4.2, (t - t0) * 720, '#ffffff', 0.08); s += bigText(540, 860, String(n), pop(seg(t, t0, t0 + 0.15)), { size: 560, col: '#ffffff', stroke: '#2a0208' }) + t2(540, 1320, 'SECOND', 64, '#ffd0d6', { weight: 900, ls: 18 }); s += gearBurst(t, t0 + 0.05, [[200, 500], [880, 560], [160, 1500], [900, 1450], [540, 1650]], { seed: 60 + n, s: 0.8 }); s += flash(t, t0, 0.8); return g(fin(s, 0.5), shake(t, [t0], 30)) + bar(t); };

  const shots = [
    // 0 hook: street + giant rev gauge slamming into the red, cars burn out
    [0, (t) => {
      const FL = 1450, v = T.full - 0.05, on = t >= v, d = Math.max(0, t - v);
      let s = vgrad('#5aa8f0', '#d8eefc', 0, FL);
      const r = rng(5); for (let i = 0; i < 7; i++) { const w = 130 + r() * 90, h = 300 + r() * 300, x = i * 160 - 30, c = ['#e85a4a', '#f2b33a', '#4a8ae0', '#7ac06a', '#e07ab0'][i % 5]; s += rect(x, FL - h, w, h, c) + [...Array(Math.floor(h / 90))].map((_, j) => rect(x + 20, FL - h + 30 + j * 90, w - 40, 40, '#ffffff', 4, 'opacity="0.55"')).join(''); }
      s += rect(-40, FL, 1160, 700, '#4a4e56') + rect(-40, FL, 1160, 12, '#e8e8e0');
      // gauge
      const GX = 540, GY = 900, GR = 250;
      s += circ(GX, GY, GR + 24, '#141a22') + circ(GX, GY, GR, '#1f2633');
      s += `<path d="M${GX + Math.cos(Math.PI * 1.9) * (GR - 20)},${GY + Math.sin(Math.PI * 1.9) * (GR - 20)} A${GR - 20},${GR - 20} 0 0 1 ${GX + Math.cos(Math.PI * 2.25) * (GR - 20)},${GY + Math.sin(Math.PI * 2.25) * (GR - 20)}" stroke="#ff2a3a" stroke-width="34" fill="none"/>`;
      for (let i = 0; i <= 8; i++) { const a = Math.PI * (0.75 + i * 0.1875); s += `<path d="M${(GX + Math.cos(a) * (GR - 40)).toFixed(0)},${(GY + Math.sin(a) * (GR - 40)).toFixed(0)} L${(GX + Math.cos(a) * (GR - 80)).toFixed(0)},${(GY + Math.sin(a) * (GR - 80)).toFixed(0)}" stroke="#e8ecf2" stroke-width="10"/>`; s += t2(GX + Math.cos(a) * (GR - 115), GY + Math.sin(a) * (GR - 115) + 14, String(i), 40, i >= 7 ? '#ff2a3a' : '#e8ecf2', { weight: 900 }); }
      const kN = on ? Math.min(1, L.easeOut(clamp(d / 0.25))) : 0.1 + 0.05 * Math.sin(t * 6);
      const na = Math.PI * (0.75 + kN * 1.5 * 0.98) + (on ? Math.sin(t * 60) * 0.04 : 0);
      s += `<path d="M${GX},${GY} L${(GX + Math.cos(na) * (GR - 30)).toFixed(0)},${(GY + Math.sin(na) * (GR - 30)).toFixed(0)}" stroke="#ff2a3a" stroke-width="16" stroke-linecap="round"/>` + circ(GX, GY, 30, '#e8ecf2');
      if (on) s += glow(GX, GY, 400, '#ff2a3a', 0.35 * (0.6 + 0.4 * Math.sin(t * 30)));
      // cars on the road: idle, then burn out to the right
      [[230, '#c8102e', 0], [820, '#2f6fd6', 1]].forEach(([x0, col, i]) => { const x = x0 + (on ? 1600 * d * d * (1 + i * 0.3) : 0); s += car(x, FL + 170 + i * 30, col, t * (on ? 3000 : 100), 0.8); if (on) s += smoke(t, x - 180, FL + 200 + i * 30, { seed: 7 + i, a: Math.max(0, 0.9 - d * 0.3) }); });
      if (on) s += speedLines(t, { a: 0.3, dir: 1, seed: 6 });
      // you, foreground
      s += adult({ ...YOU, x: 540, y: 1900, s: 0.85, face: on ? 'open' : 'neutral', pose: on ? 'up' : 'stand' });
      s += gearBurst(t, v, [[GX, GY], [200, 1500], [880, 1500]], { seed: 3, s: 0.9 });
      s += hit(540, 470, 'BAD NEWS', pop(seg(t, T.news - 0.15, T.news + 0.05)) * (1 - seg(t, T.motor - 0.25, T.motor - 0.15)), '#ff2a3a', -5, 150);
      s += chip(540, 470, 'EVERY MOTOR ON EARTH', pop(seg(t, T.motor - 0.15, T.motor)) * (1 - seg(t, v - 0.12, v - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 470, 'FULL POWER', seg(t, v - 0.05, v + 0.2) * (1 - seg(t, T.five - 0.15, T.five - 0.05)), '#ff2a3a', -6, 110);
      s += chip(540, 470, '5 SECONDS', pop(seg(t, T.five - 0.1, T.five + 0.1)), { size: 60, col: '#fff', bg: '#c8102e' });
      s += flash(t, 0, 0.6) + flash(t, v - 0.03, 0.9);
      return g(cam(fin(s), 0, { z0: punch(t, [0.03, T.news, T.motor, v, T.power, T.five], 0.1), z1: 1, oy: 1000 }), shake(t, [0.03, T.news, v, v + 0.3, v + 0.6, T.five], 34)) + pill('FULL POWER');
    }],
    [N[0], card(1)],
    // 2 blender: 30,000 RPM, lid launches, smoothie hits the ceiling
    [C[0], (t) => {
      const vL = T.lid - 0.1, d = Math.max(0, t - vL);
      let s = vgrad('#fff1d8', '#ffd9a8') + rect(0, 0, 1080, 150, '#f6efe4') + rect(0, 150, 1080, 12, '#d8c8b0');
      // tiles
      for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) s += rect(i * 124 + 4, 1060 + j * 110, 116, 102, '#ffffff', 6, 'opacity="0.35"');
      s += rect(0, 1500, 1080, 420, '#8a5a3a') + rect(0, 1500, 1080, 30, '#a8744a');
      // blender: base + jar
      const sh = (t > T.blender ? Math.sin(t * 70) * (t > T.rpm ? 10 : 4) : 0);
      let b = rect(-150, -170, 300, 170, '#2a2e36', 24) + circ(0, -85, 34, '#c8102e') + rect(-120, -560, 240, 390, '#cfe8ff', 18, 'opacity="0.55" stroke="#9ab8d8" stroke-width="8"');
      // smoothie level dropping once the lid is gone
      const lvl = 330 - Math.min(200, d * 220);
      b += rect(-112, -170 - lvl, 224, lvl, PINK, 10, 'opacity="0.95"');
      // swirl
      for (let i = 0; i < 6; i++) { const a = t * 40 + i; b += `<ellipse cx="${(Math.cos(a) * 60).toFixed(0)}" cy="${(-200 - i * 40).toFixed(0)}" rx="70" ry="14" fill="#ffffff" opacity="0.35"/>`; }
      // lid
      const lidY = -580 - (t >= vL ? 3000 * d : 0);
      b += rect(-130, lidY - 20, 260, 40, '#2a2e36', 12);
      s += g(b, `translate(${(470 + sh).toFixed(1)} 1500)`);
      // smoothie jet to the ceiling
      if (t >= vL && d < 1.6) s += `<path d="M${470 - 80},1000 Q470,560 ${470 - 120},150 L${470 + 120},150 Q470,560 ${470 + 80},1000Z" fill="${PINK}" opacity="${Math.max(0, 0.95 - d * 0.5).toFixed(2)}"/>`;
      // splats on ceiling
      [[200, 140, 70, 0.0, 1], [470, 160, 110, 0.05, 2], [760, 140, 80, 0.15, 3], [960, 170, 60, 0.25, 4], [60, 180, 50, 0.3, 5]].forEach(([x, y, r0, dl, sd]) => { s += splat(x, y, r0, pop(seg(t, vL + 0.2 + dl, vL + 0.4 + dl)), sd); });
      // drips
      if (t > vL + 0.5) for (let i = 0; i < 8; i++) { const x = 120 + i * 120, dd = (t - vL - 0.5 + i * 0.13) % 1.2; s += circ(x, 180 + dd * 1300, 16, PINK); }
      s += adult({ ...YOU, x: 870, y: 1900, s: 0.85, face: t > vL ? 'open' : 'neutral', pose: t > vL ? 'up' : 'hold' });
      s += chip(540, 470, 'YOUR BLENDER', pop(seg(t, T.blender - 0.1, T.blender + 0.1)) * (1 - seg(t, T.thirty - 0.12, T.thirty - 0.02)), { size: 52, col: '#fff', bg: '#141a22' });
      s += hit(540, 480, '30,000 RPM', pop(seg(t, T.thirty - 0.1, T.thirty + 0.1)) * (1 - seg(t, vL - 0.12, vL - 0.02)), '#ff2a3a', -5, 140);
      s += stamp(540, 480, 'LID: GONE', seg(t, vL - 0.05, vL + 0.2) * (1 - seg(t, T.ceiling - 0.4, T.ceiling - 0.3)), '#141a22', 5, 100);
      s += stamp(540, 480, 'CEILING: PINK', seg(t, T.ceiling - 0.2, T.ceiling + 0.05), '#c8102e', -5, 96);
      s += flash(t, C[0] + 0.02, 0.5) + flash(t, vL, 0.8) + flash(t, T.ceiling - 0.05, 0.5, PINK, 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.blender, T.thirty, T.rpm, vL, T.ceiling], 0.1), z1: 1.03, oy: 1100 }), shake(t, [T.rpm, vL, vL + 0.3, T.ceiling], 34, 5)) + bar(t) + pill('SECOND 1');
    }],
    [N[1], card(2)],
    // 4 parking lot: every car floors it, even the parked ones; driver still in the coffee shop
    [C[1], (t) => {
      let s = vgrad('#7ab8f0', '#e8f4fc', 0, 1300);
      // coffee shop facade
      s += rect(60, 560, 960, 760, '#7a4a2a') + rect(60, 560, 960, 110, '#3a2216') + t2(540, 640, 'COFFEE', 70, '#ffe9c8', { weight: 900, ls: 10 });
      s += rect(140, 720, 800, 560, '#bfe0f4', 10, 'stroke="#3a2216" stroke-width="16"');
      // driver inside (head ~ y 880), holding cups, then staring
      const kD = t > T.driver - 0.2;
      s += adult({ ...CROWD[1], x: 380, y: 1270, s: 0.75, face: kD ? 'open' : 'smile', pose: 'hold' }) + rect(340, 1000, 40, 54, '#ffffff', 6) + rect(340, 1000, 40, 14, '#7a4a2a', 4);
      s += adult({ ...CROWD[4], x: 720, y: 1270, s: 0.72, face: 'neutral', pose: 'stand' });
      s += rect(140, 1180, 800, 100, '#5a3a24');
      s += rect(0, 1320, 1080, 600, '#4a4e56') + rect(0, 1320, 1080, 12, '#e8e8e0');
      for (let i = 0; i < 4; i++) s += rect(40 + i * 340, 1420, 12, 380, '#f2f2ea');
      // three parked cars launching one after another
      const go = [T.floors - 0.1, T.parked - 0.1, T.coffee - 0.25];
      [[210, '#c8102e'], [550, '#2fae6a'], [890, '#ffcf3a']].forEach(([x0, col], i) => { const d = Math.max(0, t - go[i]); const x = x0 + 260 * d + 700 * d * d; const y = 1700 + (d > 0 ? Math.sin(t * 50) * 4 : 0); s += car(x, y, col, t * (d > 0 ? 3200 : 0), 0.62); if (d > 0) s += smoke(t, x - 150, y + 20, { seed: 11 + i, a: Math.max(0, 0.9 - d * 0.35), n: 12 }); });
      if (t > T.floors) s += speedLines(t, { a: 0.25, dir: 1, seed: 9 });
      s += chip(540, 470, 'EVERY CAR', pop(seg(t, T.car - 0.1, T.car + 0.1)) * (1 - seg(t, T.floors - 0.12, T.floors - 0.02)), { size: 52, col: '#fff', bg: '#141a22' });
      s += hit(540, 480, 'FLOORS IT', pop(seg(t, T.floors - 0.1, T.floors + 0.1)) * (1 - seg(t, T.parked - 0.25, T.parked - 0.15)), '#ff2a3a', -5, 150);
      s += stamp(540, 480, 'EVEN PARKED ONES', seg(t, T.parked - 0.15, T.parked + 0.1) * (1 - seg(t, T.driver - 0.12, T.driver - 0.02)), '#ff2a3a', 5, 72);
      s += stamp(540, 480, 'DRIVER: BUYING COFFEE', seg(t, T.driver - 0.05, T.driver + 0.2), '#141a22', -4, 58);
      s += flash(t, C[1] + 0.02, 0.5) + flash(t, go[0], 0.7) + flash(t, go[1], 0.5) + flash(t, go[2], 0.5);
      return g(cam(fin(s), 0, { z0: punch(t, [T.car, go[0], go[1], go[2], T.coffee], 0.1), z1: 1.03, oy: 1300 }), shake(t, [go[0], go[1], go[2], T.coffee], 34, 5)) + bar(t) + pill('SECOND 2');
    }],
    [N[2], card(3)],
    // 6 laundry room: washer on full spin walks out of the door, laundry flies
    [C[2], (t) => {
      const vW = T.walks - 0.1, d = Math.max(0, t - vW);
      let s = vgrad('#cfe4f2', '#9ec4de') + rect(0, 1560, 1080, 360, '#d8dee8');
      for (let i = 0; i < 9; i++) s += rect(i * 124, 1560, 4, 360, '#b8c0cc');
      // door on the right: opens when the washer hits it
      const kDoor = clamp((t - T.door + 0.25) / 0.2);
      s += rect(800, 820, 240, 740, '#fff8e8') + g(rect(0, 0, 240, 740, '#c89a6a', 6, 'stroke="#8a5a3a" stroke-width="8"') + circ(30, 380, 14, '#3a2216'), `translate(800 820) scale(${(1 - 0.85 * kDoor).toFixed(3)} 1)`);
      // shelf with detergent
      s += rect(80, 700, 420, 20, '#8a5a3a') + rect(110, 590, 80, 110, '#2f6fd6', 10) + rect(220, 610, 70, 90, '#ff7a1a', 10) + rect(320, 620, 120, 80, '#ffffff', 10);
      // washer: shake during spin, hop toward the door, exit
      const hop = Math.abs(Math.sin(d * 14)) * 60 * (d > 0 ? 1 : 0);
      const x = 420 + Math.min(900, d * 250 + d * d * 60), sh = t > T.washing ? Math.sin(t * 80) * (t > T.spin ? 12 : 4) : 0;
      s += washer(x + sh, 1650 - hop, Math.sin(t * 40) * (t > T.spin ? 5 : 1), t * (t > T.spin ? 40 : 6), 1.05);
      // laundry flying
      if (t > T.laundry - 0.4) { const r = rng(17); for (let i = 0; i < 14; i++) { const dd = t - (T.laundry - 0.4) - r() * 0.3; if (dd < 0) continue; const a = -Math.PI / 2 + (r() - 0.5) * 2.2, v = 700 + r() * 600; const px = x + Math.cos(a) * v * dd, py = 1450 + Math.sin(a) * v * dd + 900 * dd * dd; s += g(rect(-50, -30, 100, 60, FANC[i % 6], 14) + rect(-50, 20, 30, 40, FANC[i % 6], 8) + rect(20, 20, 30, 40, FANC[i % 6], 8), `translate(${px.toFixed(0)} ${py.toFixed(0)}) rotate(${(dd * 500 * (r() - 0.5)).toFixed(0)})`); } }
      if (t > T.spin) s += speedLines(t, { a: 0.18, dir: 1, seed: 21 });
      s += hit(540, 470, 'FULL SPIN', pop(seg(t, T.spin - 0.15, T.spin + 0.05)) * (1 - seg(t, vW - 0.12, vW - 0.02)), '#ff2a3a', -5, 150);
      s += chip(540, 470, 'WASHING MACHINE', pop(seg(t, T.washing - 0.1, T.washing + 0.1)) * (1 - seg(t, T.spin - 0.25, T.spin - 0.15)), { size: 52, col: '#fff', bg: '#141a22' });
      s += stamp(540, 480, 'IT WALKS', seg(t, vW - 0.05, vW + 0.2) * (1 - seg(t, T.laundry - 0.12, T.laundry - 0.02)), '#ff2a3a', 5, 110);
      s += stamp(540, 480, 'LAUNDRY LEFT YOU', seg(t, T.laundry - 0.05, T.laundry + 0.2), '#141a22', -5, 74);
      s += flash(t, C[2] + 0.02, 0.5) + flash(t, vW, 0.6) + flash(t, T.door, 0.6);
      return g(cam(fin(s), 0, { z0: punch(t, [T.washing, T.spin, vW, T.door, T.laundry], 0.1), z1: 1.03, oy: 1500 }), shake(t, [T.spin, vW, vW + 0.35, T.door, T.laundry], 34, 5)) + bar(t) + pill('SECOND 3');
    }],
    [N[3], card(4)],
    // 8 mall: escalator = launch ramp, everyone lands in the food court
    [C[3], (t) => {
      let s = vgrad('#f6efe4', '#e8d8c0') + rect(0, 790, 1080, 24, '#c8b89a');
      for (let i = 0; i < 4; i++) s += rect(40 + i * 270, 640, 200, 130, ['#c8102e', '#2f6fd6', '#2fae6a', '#ff7a1a'][i], 10) + t2(140 + i * 270, 722, ['SALE', 'SHOES', 'PIZZA', 'TOYS'][i], 44, '#ffffff', { weight: 900 });
      s += rect(0, 1700, 1080, 220, '#c8b89a');
      // escalator: from bottom-left up to the right-middle (top end at 640,1120)
      const EX0 = -40, EY0 = 1720, EX1 = 600, EY1 = 1140;
      s += `<path d="M${EX0},${EY0} L${EX1},${EY1} L${EX1 + 40},${EY1 + 60} L${EX0 + 40},${EY0 + 60}Z" fill="#6a7382"/>` + `<path d="M${EX0},${EY0 - 110} L${EX1},${EY1 - 110}" stroke="#2a2e36" stroke-width="22" stroke-linecap="round"/>`;
      const sp = t > T.escalator ? 6 : 1; for (let i = 0; i < 12; i++) { const k = ((i / 12) + t * 0.15 * sp) % 1; s += rect(lerp(EX0, EX1, k) - 20, lerp(EY0, EY1, k) - 6, 40, 10, '#b8c0cc', 3); }
      // food court tables (right, bottom)
      [[800, 1640], [990, 1560], [700, 1820], [960, 1800]].forEach(([x, y]) => { s += rect(x - 90, y - 16, 180, 22, '#ffffff', 8) + rect(x - 8, y, 16, 70, '#6a7382'); });
      // riders: ride up, then launched in arcs into the food court
      const r = rng(31); const L0 = T.ramp - 0.35;
      for (let i = 0; i < 7; i++) { const ph = r(), tx = 680 + r() * 340, ty = 1500 + r() * 300, col = FANC[i % 6];
        const dl = L0 + i * 0.1, dd = t - dl;
        if (dd < 0) { const k = Math.min(0.97, 0.2 + i * 0.11 + (t - C[3]) * 0.05 * sp); s += fig(lerp(EX0, EX1, k) + 10, lerp(EY0, EY1, k) - 60, 1.7, col); }
        else { const ft = 0.9, k = clamp(dd / ft), px = lerp(EX1, tx, k), py = lerp(EY1 - 50, ty, k) - Math.sin(k * Math.PI) * (500 + i * 40); s += fig(px, py, 1.7, col, k < 1 ? dd * 540 : (i % 2 ? 80 : -80), k < 1); }
      }
      // trays/food splash at landing
      s += debris(t, T.lands - 0.05, 860, 1640, { n: 30, col: '#ffcf3a', spread: 900, seed: 33, size: 26 }) + debris(t, T.lands + 0.1, 960, 1760, { n: 24, col: '#c8102e', spread: 800, seed: 34, size: 22 });
      if (t > L0) s += speedLines(t, { a: 0.2, dir: 1, seed: 35 });
      s += chip(540, 470, 'MALL ESCALATOR', pop(seg(t, T.mall - 0.1, T.mall + 0.1)) * (1 - seg(t, T.launch - 0.12, T.launch - 0.02)), { size: 52, col: '#fff', bg: '#141a22' });
      s += hit(540, 480, 'LAUNCH RAMP', pop(seg(t, T.launch - 0.1, T.launch + 0.1)) * (1 - seg(t, T.everyone - 0.12, T.everyone - 0.02)), '#ff2a3a', -5, 130);
      s += stamp(540, 480, 'FOOD COURT', seg(t, T.lands - 0.1, T.lands + 0.15), '#ff7a1a', 5, 100);
      s += flash(t, C[3] + 0.02, 0.5) + flash(t, L0, 0.6) + flash(t, T.lands, 0.7);
      return g(cam(fin(s), 0, { z0: punch(t, [T.escalator, T.launch, L0, T.lands, T.court], 0.1), z1: 1.03, oy: 1300 }), shake(t, [L0, T.lands, T.lands + 0.3, T.court], 34, 5)) + bar(t) + pill('SECOND 4');
    }],
    [N[4], card(5)],
    // 10 office: ceiling fan rips loose and chases the boss
    [C[4], (t) => {
      const vR = T.rips - 0.05, d = Math.max(0, t - vR);
      let s = vgrad('#e8eef4', '#c8d4e0') + rect(0, 0, 1080, 170, '#f6f8fa') + rect(0, 170, 1080, 10, '#b8c0cc');
      s += rect(0, 1600, 1080, 320, '#6a7a8a'); for (let i = 0; i < 6; i++) s += rect(60 + i * 180, 1450, 140, 150, '#8a5a3a', 6) + rect(80 + i * 180, 1350, 100, 80, '#1a2230', 6);
      // window
      s += rect(620, 560, 380, 380, '#9ad0f4', 10, 'stroke="#ffffff" stroke-width="14"') + t2(810, 760, 'Q4', 90, '#ffffff', { weight: 900, extra: 'opacity="0.5"' });
      // boss: runs left across when chased (head ~ y 1405)
      const bx = 820 - (t > T.chases - 0.15 ? Math.min(980, (t - T.chases + 0.15) * 650) : 0);
      s += adult({ skin: '#efc29d', hair: '#a9a9b3', hairStyle: 'short', top: '#1d1f24', pants: '#1d1f24', x: bx, y: 1900, s: 0.85, face: t > T.chases - 0.3 ? 'open' : 'neutral', pose: t > T.chases - 0.3 ? 'up' : 'cross' }) + (t < T.chases ? `<path d="M${bx},${1900 - 380} l-10,60 l10,22 l10,-22z" fill="#c8102e"/>` : '');
      // fan: spinning on the ceiling, then detaches and follows the boss
      let fx = 480, fy = 640, frot = t * (t > T.fan - 0.3 ? 2400 : 600);
      if (t > vR) { const k = clamp(d / 0.5); fx = lerp(480, bx + 120, Math.min(1, d * 1.2)); fy = lerp(640, 1150, L.easeOut(k)) + Math.sin(t * 20) * 20; }
      if (t < vR) s += rect(472, 170, 16, 470, '#2a2e36');
      s += g(circ(0, 0, 40, '#2a2e36') + [0, 90, 180, 270].map((a) => `<ellipse cx="160" cy="0" rx="150" ry="26" fill="#8a5a3a" transform="rotate(${a})"/>`).join(''), `translate(${fx.toFixed(0)} ${fy.toFixed(0)}) rotate(${frot.toFixed(0)}) scale(1 ${t > vR ? 0.55 : 0.35})`);
      if (t > vR && d < 0.6) s += debris(t, vR, 480, 640, { n: 26, col: '#ffffff', spread: 700, seed: 41, size: 22 });
      if (t > vR) s += speedLines(t, { a: 0.22, dir: -1, seed: 42 });
      s += chip(540, 470, 'OFFICE CEILING FAN', pop(seg(t, T.office - 0.1, T.office + 0.1)) * (1 - seg(t, vR - 0.12, vR - 0.02)), { size: 50, col: '#fff', bg: '#141a22' });
      s += stamp(540, 480, 'RIPS LOOSE', seg(t, vR - 0.05, vR + 0.2) * (1 - seg(t, T.chases - 0.12, T.chases - 0.02)), '#ff2a3a', -5, 100);
      s += hit(540, 480, 'CHASES YOUR BOSS', pop(seg(t, T.chases - 0.1, T.chases + 0.1)) * (1 - seg(t, T.hell - 0.12, T.hell - 0.02)), '#ff2a3a', 4, 100);
      s += stamp(540, 480, 'HELL YEAH', seg(t, T.hell - 0.08, T.hell + 0.15), '#2fae6a', -6, 120);
      s += flash(t, C[4] + 0.02, 0.5) + flash(t, vR, 0.8) + flash(t, T.hell, 0.5, '#2fae6a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.office, T.fan, vR, T.chases, T.hell], 0.1), z1: 1.03, oy: 1100 }), shake(t, [vR, vR + 0.3, T.chases, T.hell], 36, 5)) + bar(t) + pill('SECOND 5');
    }],
    // 11 motors back: everything stops — food court, everyone alive, sticky
    [C[5], (t) => {
      let s = vgrad('#f6efe4', '#e8d8c0') + rect(0, 1600, 1080, 320, '#c8b89a');
      for (let i = 0; i < 4; i++) s += rect(40 + i * 270, 640, 200, 130, ['#c8102e', '#2f6fd6', '#2fae6a', '#ff7a1a'][i], 10) + t2(140 + i * 270, 722, ['SALE', 'SHOES', 'PIZZA', 'TOYS'][i], 44, '#ffffff', { weight: 900 });
      // tables with people sprawled on them, smoothie splats
      [[200, 1560], [540, 1480], [880, 1580], [360, 1800], [760, 1820]].forEach(([x, y], i) => { s += rect(x - 110, y - 16, 220, 24, '#ffffff', 8) + rect(x - 8, y, 16, 90, '#6a7382'); s += fig(x + (i % 2 ? 30 : -30), y - 50, 1.4, FANC[i % 6], i % 2 ? 70 : -70, t > T.alive - 0.2); s += splat(x + 40, y - 70, 34, pop(seg(t, T.sticky - 0.2 + i * 0.04, T.sticky + i * 0.04)), 50 + i); });
      // stopped washer + car in the background
      s += washer(980, 1450, -8, 0, 0.45);
      s += stamp(540, 480, 'MOTORS: BACK', seg(t, C[5], C[5] + 0.25) * (1 - seg(t, T.stops - 0.3, T.stops - 0.2)), '#2fae6a', 6, 96);
      s += hit(540, 540, 'STOP.', pop(seg(t, T.stops - 0.15, T.stops + 0.05)) * (1 - seg(t, T.alive - 0.3, T.alive - 0.2)), '#ff2a3a', -6, 220);
      s += chip(540, 480, 'EVERYONE ALIVE', pop(seg(t, T.alive - 0.2, T.alive)) * (1 - seg(t, T.sticky - 0.12, T.sticky - 0.02)), { size: 64, col: '#fff', bg: '#2fae6a' });
      s += hit(540, 480, 'STICKY', pop(seg(t, T.sticky - 0.1, T.sticky + 0.08)) * (1 - seg(t, T.alive2 - 0.25, T.alive2 - 0.15)), PINK, 4, 170);
      s += stamp(540, 480, 'BUT ALIVE', seg(t, T.alive2 - 0.15, T.alive2 + 0.1), '#2fae6a', -6, 110);
      s += flash(t, C[5], 0.95, '#2fae6a', 0.3) + flash(t, T.stops - 0.05, 0.8) + flash(t, T.sticky - 0.05, 0.5, PINK, 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [C[5], T.stops, T.alive, T.sticky, T.alive2], 0.13), z1: 1, oy: 1200 }), shake(t, [C[5] + 0.1, T.stops, T.sticky], 40, 6)) + pill('MOTORS: BACK');
    }],
    // 12 laundry 3 blocks away (washer on a sidewalk) -> boss finally did cardio
    [C[6], (t) => {
      const sw = t >= T.and - 0.1; let s = '';
      if (!sw) {
        s += vgrad('#5aa8f0', '#d8eefc', 0, 1450);
        const r = rng(9); for (let i = 0; i < 7; i++) { const w = 130 + r() * 90, h = 300 + r() * 400, x = i * 160 - 30, c = ['#e85a4a', '#f2b33a', '#4a8ae0', '#7ac06a', '#e07ab0'][i % 5]; s += rect(x, 1450 - h, w, h, c); }
        s += rect(0, 1450, 1080, 470, '#9a9ea6') + rect(0, 1450, 1080, 14, '#c4c8ce');
        // street sign + lamp with a sock on it
        s += rect(150, 700, 14, 750, '#2a2e36') + rect(60, 700, 300, 80, '#2fae6a', 8) + t2(210, 755, 'ELM ST', 44, '#ffffff', { weight: 900 });
        s += rect(900, 640, 14, 810, '#2a2e36') + rect(820, 640, 94, 14, '#2a2e36') + g(rect(-20, 0, 40, 90, '#ff7a1a', 10) + rect(-20, 70, 60, 30, '#ff7a1a', 10), `translate(830 660) rotate(${Math.sin(t * 5) * 8})`);
        s += washer(540, 1750, -6, 0, 1) + smoke(t, 540, 1350, { seed: 61, a: 0.5, dir: 0.3, col: '#ffffff', n: 6 });
        s += g(rect(-60, -24, 120, 48, FANC[1], 12), 'translate(300 1720) rotate(-12)') + g(rect(-60, -24, 120, 48, FANC[2], 12), 'translate(800 1800) rotate(20)');
        s += chip(540, 470, 'YOUR LAUNDRY', pop(seg(t, T.laundry2 - 0.1, T.laundry2 + 0.1)) * (1 - seg(t, T.blocks - 0.35, T.blocks - 0.25)), { size: 56, col: '#fff', bg: '#141a22' });
        s += stamp(540, 480, '3 BLOCKS AWAY', seg(t, T.blocks - 0.2, T.blocks + 0.05), '#ff2a3a', -5, 96);
        s += flash(t, C[6], 0.6) + flash(t, T.blocks - 0.15, 0.5);
        return g(cam(fin(s), 0, { z0: punch(t, [C[6], T.laundry2, T.blocks], 0.1), z1: 1.03, oy: 1300 }), shake(t, [T.blocks - 0.1], 30)) + pill('ALIVE. STICKY.');
      }
      // boss panting, sweat drops
      s += vgrad('#e8eef4', '#c8d4e0') + rect(0, 0, 1080, 170, '#f6f8fa') + rect(0, 1600, 1080, 320, '#6a7a8a');
      for (let i = 0; i < 6; i++) s += rect(60 + i * 180, 1450, 140, 150, '#8a5a3a', 6) + rect(80 + i * 180, 1350, 100, 80, '#1a2230', 6);
      s += rect(620, 640, 380, 380, '#9ad0f4', 10, 'stroke="#ffffff" stroke-width="14"') + t2(810, 840, 'Q4', 90, '#ffffff', { weight: 900, extra: 'opacity="0.5"' }) + rect(472, 170, 16, 300, '#2a2e36') + debris(t, T.and - 0.1, 480, 470, { n: 20, col: '#ffffff', spread: 500, seed: 71, size: 20 });
      s += hit(280, 700, 'HUFF', pop(seg(t, T.boss2, T.boss2 + 0.1)), '#2f6fd6', -10, 90) + hit(330, 930, 'PUFF', pop(seg(t, T.boss2 + 0.25, T.boss2 + 0.35)), '#2f6fd6', 8, 90);
      s += adult({ skin: '#efc29d', hair: '#a9a9b3', hairStyle: 'short', top: '#1d1f24', pants: '#1d1f24', x: 540, y: 1920, s: 1.1, face: 'open', pose: 'stand', tilt: 8 });
      for (let i = 0; i < 6; i++) { const ph = (t * 1.5 + i / 6) % 1; s += `<path d="M${(480 + i * 24 + (i % 2 ? 60 : -60) * ph).toFixed(0)},${(1440 - 40 + ph * 140).toFixed(0)} q-12,22 0,30 q12,-8 0,-30z" fill="#4aa8f0" opacity="${(1 - ph).toFixed(2)}"/>`; }
      s += g(circ(0, 0, 70, '#2a2e36') + [0, 90, 180, 270].map((a) => `<ellipse cx="110" cy="0" rx="100" ry="20" fill="#8a5a3a" transform="rotate(${a})"/>`).join(''), 'translate(860 1760) rotate(30) scale(1 0.5)');
      s += chip(540, 470, 'YOUR BOSS', pop(seg(t, T.boss2 - 0.15, T.boss2)) * (1 - seg(t, T.cardio - 0.12, T.cardio - 0.02)), { size: 56, col: '#fff', bg: '#141a22' });
      s += stamp(540, 480, 'FINALLY: CARDIO', seg(t, T.cardio - 0.1, T.cardio + 0.15), '#2fae6a', -5, 84);
      s += flash(t, T.and - 0.1, 0.6) + flash(t, T.cardio - 0.05, 0.6, '#2fae6a', 0.2);
      return g(cam(fin(s), 0, { z0: punch(t, [T.and - 0.1, T.boss2, T.cardio], 0.12), z1: 1.03, oy: 1300 }), shake(t, [T.cardio], 30)) + pill('ALIVE. STICKY.');
    }],
    // 13 CTA
    [C[7], (t) => {
      const opts = ['TOASTERS?', 'DRILLS?', 'DRONES?', 'HAIR DRYERS?', 'LAWNMOWERS?', 'FRIDGES?'];
      const i = Math.floor((t - C[7]) * 6) % opts.length;
      let s = vgrad('#c8102e', '#3a0410') + speedLines(t, { a: 0.2, seed: 12 }) + gear(540, 1100, 5, t * 300, '#ffffff', 0.07) + gearBurst(t, C[7] + 0.1, [[200, 1500], [880, 1450], [540, 1750], [150, 400], [930, 380]], { seed: 81, s: 0.9 });
      s += bigText(540, 520, 'WHAT GOES', 1, { size: 150 }) + bigText(540, 700, 'FULL POWER', 1, { size: 140, col: '#ffcf6a' }) + bigText(540, 880, 'NEXT?', 1, { size: 170 });
      s += bigText(540, 1520, opts[i], 1, { size: 110, col: '#ffd0d6', rot: (i % 2 ? 4 : -4) });
      s += flash(t, C[7], 0.6) + flash(t, T.worse, 0.5, '#000000', 0.25);
      return g(fin(s, 0.5), shake(t, [C[7], T.worse], 24)) + pill('YOUR CALL');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps, { fade: 0.05, dustA: 0.25 }); } };
}
