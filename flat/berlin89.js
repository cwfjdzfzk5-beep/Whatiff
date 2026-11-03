// "What if you woke up in East Berlin, November 1989, with your phone?" — mature cinematic flat style.
import * as L from './lib.js';
import { adult, silhouette, fog, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, finish, YOU, CROWD, chip, clock, lamp, crowd } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const ME = { ...YOU, top: '#2a2f3a', hairStyle: 'short' };
const tower = (x, y, s = 1, col = '#0d121c') => g(rect(-10, -900, 20, 900, col) + circ(0, -640, 62, col) + rect(-4, -1020, 8, 130, col) + rect(-26, -600, 52, 24, col, 6) + `<path d="M-60,0 L-10,-260 L10,-260 L60,0Z" fill="${col}"/>` + circ(0, -640, 62, 'none', 'stroke="#ff5a5a" stroke-width="2" opacity="0.15"'), `translate(${x} ${y}) scale(${s})`);
function plattenbau(baseY, seed, col = '#1e2430', lit = 0.25, warm = '#f2c98a') {
  const r = rng(seed); let s = '', x = -40;
  while (x < 1120) { const w = 160 + r() * 120, h = 260 + r() * 260; s += rect(x, baseY - h, w, h, col); for (let j = 0; j < Math.floor(h / 46); j++) for (let i = 0; i < Math.floor(w / 40); i++) { const on = r() < lit; s += rect(x + 10 + i * 40, baseY - h + 14 + j * 46, 24, 26, on ? warm : '#0a0d12', 2, `opacity="${on ? 0.8 : 0.5}"`); } x += w + 14; }
  return s;
}
function phoneBig(x, y, s, inner, glowA = 0.3) {
  return g(glow(0, 0, 700, '#9fc4ff', glowA) + rect(-250, -500, 500, 1000, '#0b0b10', 70) + rect(-234, -484, 468, 968, '#121620', 58) + rect(-60, -470, 120, 26, '#0b0b10', 13) + inner, `translate(${x} ${y}) scale(${s})`);
}
const statusBar = (txt, batt, battCol = '#e8ecf2') => t2(-190, -420, txt, 26, '#e8ecf2', { weight: 700, anchor: 'start' }) + rect(120, -444, 70, 32, 'none', 7, `stroke="${battCol}" stroke-width="3"`) + rect(125, -439, Math.max(3, 60 * batt / 100), 22, battCol, 4) + rect(192, -434, 6, 12, battCol, 2) + t2(110, -420, `${batt}%`, 24, battCol, { weight: 700, anchor: 'end' });
const wallSeg = (x, y, w = 120, h = 360, col = '#8a8a84') => rect(x, y - h, w - 6, h, col, 4) + circ(x + (w - 6) / 2, y - h, (w - 6) / 2 * 0.36, col) + rect(x + 6, y - h + 20, w - 18, 10, '#000', 3, 'opacity="0.12"');

export async function init() {
  const W = await (await fetch('/work/berlin89/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const fps = 30, total = 72.1;
  const D = (s) => wt(W.find((x) => x.seg === s).w.toLowerCase().replace(/[^a-z0-9]/g, ''), s) - 0.25;
  const T = {
    east: wt('east', 0), nineteen: wt('nineteen', 0), phone: wt('phone', 0),
    signal: wt('signal', 2), wifi: wt('wifi', 2), percent: wt('percent', 2), advanced: wt('advanced', 2),
    stare: wt('stare', 4), asks: wt('asks', 4), west: wt('west', 4), kind: wt('kind', 4),
    history: wt('history', 6), neighbor: wt('neighbor', 6), laughs: wt('laughs', 6), closes: wt('closes', 6),
    press: wt('press', 8), note: wt('note', 8), when: wt('when', 8), immediately: wt('immediately', 8),
    thousands: wt('thousands', 10), barrier: wt('barrier', 10), goes: wt('goes', 10),
    film: wt('film', 11), hugs: wt('hugs', 11), tears: wt('tears', 11), champagne: wt('champagne', 11),
    four: wt('four', 13), wall: wt('wall', 13), charger: wt('charger', 13), twenty: wt('twenty', 13),
    black: wt('black', 14), believe: wt('believe', 14), film2: wt('film', 15),
  };
  const S1 = D(1), S2 = D(3), S3 = D(5), S4 = D(7), S5 = D(9), S6 = wt('you', 11) - 0.2, S7 = D(12), S8 = wt('your', 14) - 0.2, S9 = wt('what', 15) - 0.25;

  const shots = [
    // 0 — wake up in a dark East Berlin flat, TV tower in the window
    [0, (t) => {
      let s = vgrad('#05070c', '#0e1420') + rect(560, 360, 420, 640, '#0f1a2e', 6) + glow(770, 640, 360, '#2a3e66', 0.4);
      s += `<clipPath id="win0"><rect x="560" y="360" width="420" height="640"/></clipPath><g clip-path="url(#win0)">` + glow(840, 520, 200, '#3a5a8a', 0.3) + tower(850, 1000, 0.6, '#05070c') + plattenbau(1000, 4, '#0b1018', 0.18).replace(/height="(\d+(\.\d+)?)"/g, (m, h) => `height="${Math.min(+h, 200)}"`) + `</g>` + rect(560, 360, 420, 640, 'none', 6, 'stroke="#1a1f28" stroke-width="18"') + rect(762, 360, 16, 640, '#1a1f28');
      s += rect(0, 1300, 1080, 620, '#090b10') + rect(60, 1420, 720, 120, '#2a2a30', 20) + rect(60, 1380, 220, 80, '#4a4a52', 30);
      const kP = seg(t, T.phone - 0.4, T.phone + 0.2);
      s += adult({ ...ME, x: 420, y: 2010, s: 1.35, face: t > T.east ? 'tense' : 'closed', pose: t > T.phone - 0.3 ? 'phone' : 'stand', look: 0.4 }) + glow(470, 1290, 260, '#9fc4ff', 0.35 * kP);
      s += chip(540, 520, 'EAST BERLIN · 1989', pop(seg(t, T.nineteen - 0.2, T.nineteen + 0.2)), { col: '#ffcf6a', border: '#ffcf6a', size: 40 });
      return cam(finish(s, 0.75), seg(t, 0, S1), { z0: 1.0, z1: 1.07, oy: 1300 }) + pill('NOV 8 · 1989');
    }],
    // 1 — no signal, no wifi, 31%
    [S1, (t) => {
      let s = vgrad('#0b0e16', '#05070b');
      const kS = pop(seg(t, T.signal - 0.1, T.signal + 0.2)), kW = pop(seg(t, T.wifi - 0.1, T.wifi + 0.2));
      let inner = statusBar(t > T.signal - 0.1 ? 'No Service' : '', 31);
      inner += g(rect(-170, -50, 340, 100, '#1b2230', 26) + t2(-130, 14, 'SIGNAL', 32, '#9aa3b2', { weight: 800, anchor: 'start', ls: 3 }) + t2(130, 14, 'OFF', 30, '#ff4a3a', { weight: 900, anchor: 'end' }), `translate(0 -220) scale(${kS})`);
      inner += g(rect(-170, -50, 340, 100, '#1b2230', 26) + t2(-130, 14, 'WI-FI', 32, '#9aa3b2', { weight: 800, anchor: 'start', ls: 3 }) + t2(130, 14, 'OFF', 30, '#ff4a3a', { weight: 900, anchor: 'end' }), `translate(0 -90) scale(${kW})`);
      const kB = pop(seg(t, T.percent - 0.3, T.percent + 0.1));
      inner += g(t2(0, 30, '31%', 110, '#ffcf6a', { weight: 900 }), `translate(0 160) scale(${kB})`);
      s += phoneBig(540, 820, 0.9, inner, 0.25);
      s += chip(540, 1480, 'MOST ADVANCED OBJECT IN THE COUNTRY', pop(seg(t, T.advanced - 0.2, T.advanced + 0.2)), { size: 30, col: '#ffcf6a', border: '#ffcf6a' });
      s += chip(540, 1600, 'NEXT MOBILE NETWORK: 1992', pop(seg(t, T.advanced + 0.6, T.advanced + 0.9)), { size: 26, col: '#9aa3b2' });
      return cam(finish(s, 0.7), seg(t, S1, S2), { z0: 1.0, z1: 1.06, oy: 900 }) + pill('NOV 8 · 1989');
    }],
    // 2 — tram, everyone stares
    [S2, (t) => {
      let s = vgrad('#c9c2a8', '#8a8470', 0, 1100) + rect(0, 1100, 1080, 820, '#4a4636');
      for (let i = 0; i < 3; i++) s += rect(60 + i * 340, 420, 300, 380, '#d8dcc8', 10, 'opacity="0.55"') + rect(60 + i * 340, 420, 300, 380, 'none', 10, 'stroke="#6a6250" stroke-width="14"');
      s += plattenbau(800, 9, '#9a9a90', 0.05).replace(/<rect/g, '<rect opacity="0.35"');
      s += rect(0, 380, 1080, 30, '#6a6250') + rect(0, 820, 1080, 40, '#6a6250');
      for (let i = 0; i < 6; i++) s += rect(70 + i * 170, 380, 10, 120, '#5a5444');
      const stare = t > T.stare - 0.2;
      const P = [CROWD[5], CROWD[1], CROWD[4], CROWD[2]];
      [[150, 0.6], [330, 0.5], [760, -0.6], [930, -0.7]].forEach(([x, lk], i) => { s += adult({ ...P[i], top: ['#6a5a3a', '#3a4a5a', '#5a3a3a', '#4a5a3a'][i], x, y: 1480, s: 1.0, face: stare ? 'tense' : 'neutral', pose: i === 3 && t > T.asks - 0.2 && t < T.kind ? 'point' : 'stand', look: stare ? lk : 0 }); });
      s += adult({ ...ME, x: 545, y: 2010, s: 1.35, face: t > T.kind - 0.1 ? 'smile' : 'neutral', pose: 'phone', look: 0.2 }) + glow(600, 1290, 220, '#9fc4ff', 0.4);
      s += chip(820, 560, '"FROM THE WEST?"', pop(seg(t, T.west - 0.4, T.west)), { size: 32 });
      s += chip(300, 640, '"KIND OF."', pop(seg(t, T.kind - 0.1, T.kind + 0.2)), { size: 32, col: '#ffcf6a' });
      return cam(finish(s, 0.6, '#2a2a1a', '#2a1a0b'), seg(t, S2, S3), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('NOV 8 · MORNING');
    }],
    // 3 — the neighbor laughs and closes the door
    [S3, (t) => {
      let s = vgrad('#3a3a34', '#22221e') + glow(540, 380, 400, '#ffe2b0', 0.25) + rect(0, 1300, 1080, 620, '#1e1d1a');
      s += rect(560, 520, 380, 800, '#3a2a20', 6) + rect(560, 520, 380, 800, 'none', 6, 'stroke="#2a201a" stroke-width="16"');
      const kC = seg(t, T.closes - 0.1, T.closes + 0.5);
      s += rect(580, 540, 340, 760, '#ffe2b0', 0, `opacity="${0.55 * (1 - kC)}"`);
      s += adult({ skin: '#e8c4a0', hair: '#9a9aa2', hairStyle: 'short', top: '#4a4a3a', pants: '#2a2a30', x: 750, y: 1300, s: 1.05, face: t > T.laughs - 0.1 ? 'smile' : 'neutral', pose: 'cross', look: -0.5, light: 1 - 0.5 * kC });
      s += rect(560, 520, 380 * kC, 800, '#4a3426', 4) + (kC > 0.9 ? circ(560 + 380 * kC - 40, 940, 12, '#c8a050') : '');
      s += t2(750, 480, '4B', 40, '#c8c2b0', { weight: 800 });
      s += adult({ ...ME, x: 270, y: 1990, s: 1.35, face: 'neutral', pose: t < T.laughs ? 'point' : 'stand', look: 0.6 });
      s += chip(330, 560, 'TONIGHT. THE WALL.', pop(seg(t, T.neighbor, T.neighbor + 0.3)) * (1 - seg(t, T.closes, T.closes + 0.3)), { size: 30, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.65, '#2a2a1a', '#2a1a0b'), seg(t, S3, S4), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('NOV 9');
    }],
    // 4 — 6:57 PM press conference on TV
    [S4, (t) => {
      let s = vgrad('#1e1a16', '#100e0c') + rect(0, 1300, 1080, 620, '#14110e');
      s += rect(150, 420, 780, 620, '#2a2620', 40) + rect(190, 460, 700, 520, '#1a2a3a', 26);
      const kI = seg(t, T.immediately - 0.1, T.immediately + 0.1);
      let tv = rect(190, 460, 700, 520, '#3a4a5e', 26) + rect(190, 800, 700, 180, '#5a4a3a') + rect(260, 820, 560, 40, '#7a6a5a', 6);
      tv += adult({ skin: '#d8b090', hair: '#7a7a82', hairStyle: 'short', top: '#2a2a32', pants: '#2a2a32', x: 540, y: 1100, s: 0.85, face: t > T.immediately - 0.2 ? 'tense' : 'neutral', pose: t > T.note - 0.2 && t < T.when ? 'hold' : 'stand', look: 0 });
      tv += rect(220, 800, 640, 60, '#5a4a3a') + circ(420, 790, 14, '#222') + circ(520, 786, 14, '#222') + circ(640, 790, 14, '#222') + rect(418, 790, 4, 30, '#222') + rect(518, 786, 4, 34, '#222') + rect(638, 790, 4, 30, '#222');
      if (t > T.note - 0.2 && t < T.when) tv += rect(470, 760, 120, 30, '#f2f0e6', 3, 'transform="rotate(-6 530 775)"');
      tv += rect(190, 460, 700, 520, '#9fc4ff', 26, `opacity="${0.06 + 0.04 * Math.sin(t * 40)}"`);
      s += tv + t2(230, 510, 'LIVE · PRESS CONFERENCE', 26, '#ff5a5a', { weight: 800, anchor: 'start', ls: 2 });
      for (let i = 0; i < 8; i++) s += rect(190, 480 + i * 64, 700, 3, '#000', 0, 'opacity="0.18"');
      s += rect(400, 1040, 280, 40, '#2a2620', 8) + rect(500, 1080, 80, 220, '#2a2620');
      s += clock(540, 1640, '18:57', { size: 72, w: 260 });
      s += chip(540, 380, '"IMMEDIATELY."', pop(kI), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
      s += rect(0, 0, 1080, 1920, '#fff', 0, `opacity="${0.35 * Math.max(0, 1 - Math.abs(t - T.immediately) * 5)}"`);
      return cam(finish(s, 0.7, '#2a1a0b', '#1a0b0b'), seg(t, S4, S5), { z0: 1.0, z1: 1.1, oy: 760 }) + pill('6:57 PM');
    }],
    // 5 — border crossing at night, the barrier goes up
    [S5, (t) => {
      let s = vgrad('#04060a', '#0c1018') + fog(700, 400, '#2a3550', 0.5);
      for (let i = 0; i < 3; i++) s += lamp(140 + i * 400, 1180, 620, '#e8f0ff', 0.4);
      s += rect(0, 1100, 1080, 820, '#0a0c10');
      for (let i = -1; i < 10; i++) s += wallSeg(i * 120, 1100, 120, 330, '#4a4a46');
      s += rect(380, 760, 330, 340, '#0a0c10');
      const kB = pop(seg(t, T.goes - 0.4, T.goes + 0.6));
      s += glow(545, 950, 420 * (0.4 + kB), '#fff3d9', 0.25 + 0.35 * kB);
      s += g(rect(0, -16, 360, 32, '#e8e8e2', 6) + [0, 1, 2, 3, 4].map((i) => rect(20 + i * 72, -16, 36, 32, '#c8312b')).join(''), `translate(370 1000) rotate(${-82 * kB})`) + rect(350, 960, 40, 140, '#2a2a2e', 6);
      s += crowd(-20, 1100, 1500, 0.95, 9, 7, { face: t > T.goes ? 'smile' : 'tense', pose: (i) => (t > T.goes + 0.3 && i % 2 ? 'up' : 'stand') });
      s += crowd(60, 1020, 2080, 1.4, 5, 11, { face: t > T.goes ? 'smile' : 'neutral', pose: (i) => (t > T.goes + 0.5 && i % 2 === 0 ? 'up' : 'stand') });
      s += chip(540, 520, `${(Math.round(lerp(800, 20000, seg(t, T.thousands - 0.4, T.barrier)) / 100) * 100).toLocaleString('en-US')}+ PEOPLE`, pop(seg(t, T.thousands - 0.3, T.thousands)), { size: 34 });
      return cam(finish(s, 0.75), seg(t, S5, S6), { z0: 1.0, z1: 1.06, oy: 1000 }) + pill('11 PM');
    }],
    // 6 — you film everything
    [S6, (t) => {
      let s = vgrad('#0a0c14', '#151a28') + glow(540, 760, 600, '#fff3d9', 0.25);
      for (let i = -1; i < 10; i++) s += wallSeg(i * 120, 1060, 120, 300, '#5a5a56');
      s += rect(0, 1060, 1080, 860, '#0c0e14');
      const r = rng(3); const kC = seg(t, T.champagne - 0.2, T.champagne + 1.2);
      s += crowd(-40, 1120, 1500, 0.95, 9, 21, { face: 'smile', pose: (i) => ((Math.floor(t * 2) + i) % 3 ? 'up' : 'stand') });
      if (kC > 0) for (let i = 0; i < 40; i++) { const ph = (r() + t * 0.9) % 1; s += circ(700 + Math.cos(i) * ph * 260, 900 - ph * 300 + ph * ph * 400, 5 + r() * 5, '#ffe9a8', `opacity="${0.7 * (1 - ph) * Math.min(1, kC * 3)}"`); }
      let scr = rect(-110, -200, 220, 400, '#0c1018', 22) + rect(-100, -190, 200, 380, '#3a4a66', 18) + circ(-70, -160, 9, '#ff3b3b', `opacity="${Math.sin(t * 6) > 0 ? 1 : 0.3}"`) + t2(-52, -152, `REC ${String(Math.floor((t - S6) / 60)).padStart(2, '0')}:${String(Math.floor(t - S6) % 60).padStart(2, '0')}`, 22, '#fff', { weight: 800, anchor: 'start' }) + t2(0, 170, '4K', 26, '#ffcf6a', { weight: 900 });
      for (let i = 0; i < 4; i++) scr += circ(-60 + i * 40, 60, 14, '#1a1a20') + rect(-74 + i * 40, 74, 28, 60, '#1a1a20', 8);
      s += adult({ ...ME, x: 380, y: 2030, s: 1.4, face: 'smile', pose: 'up', look: 0.3 }) + g(scr, 'translate(780 760) rotate(4) scale(1.25)');
      s += chip(540, 470, ['THE HUGS', 'THE TEARS', 'CHAMPAGNE'][t < T.tears - 0.1 ? 0 : t < T.champagne - 0.1 ? 1 : 2], pop(seg(t, T.hugs - 0.1, T.hugs + 0.1)), { size: 34, col: '#ffcf6a' });
      return cam(finish(s, 0.65), seg(t, S6, S7), { z0: 1.0, z1: 1.06, oy: 1200 }) + pill('NOV 9 · NIGHT');
    }],
    // 7 — 2% battery, the only 4K video
    [S7, (t) => {
      let s = vgrad('#0a0c12', '#05060a');
      let inner = statusBar('No Service', 2, '#ff4a3a') + rect(-234, -380, 468, 560, '#3a4a66') + circ(-180, -340, 10, '#ff3b3b') + t2(-160, -332, 'REC 47:12', 24, '#fff', { weight: 800, anchor: 'start' });
      for (let i = 0; i < 6; i++) inner += circ(-170 + i * 68, -60, 24, '#1a1a20') + rect(-194 + i * 68, -36, 48, 120, '#1a1a20', 12);
      inner += g(rect(-200, -52, 400, 104, '#ff4a3a', 26) + t2(0, 18, '2% BATTERY', 46, '#fff', { weight: 900 }), `translate(0 300) scale(${pop(seg(t, S7 + 0.1, S7 + 0.4))})`);
      s += phoneBig(540, 820, 0.9, inner, 0.2);
      s += chip(540, 1440, 'ONLY 4K VIDEO OF THAT NIGHT', pop(seg(t, T.four - 0.2, T.four + 0.2)), { size: 30, col: '#ffcf6a', border: '#ffcf6a' });
      const kT = seg(t, T.charger - 0.2, T.twenty + 1.2);
      if (kT > 0) { s += rect(140, 1600, 800, 8, '#3a4250', 4) + rect(140, 1600, 800 * kT, 8, '#ffcf6a', 4) + t2(140, 1670, '1989', 34, '#e8ecf2', { weight: 800, anchor: 'start' }) + t2(940, 1670, '2014', 34, '#ffcf6a', { weight: 800, anchor: 'end', extra: `opacity="${seg(t, T.twenty, T.twenty + 0.4)}"` }) + t2(940, 1710, 'USB-C', 24, '#9aa3b2', { weight: 700, anchor: 'end', extra: `opacity="${seg(t, T.twenty, T.twenty + 0.4)}"` }); }
      return cam(finish(s, 0.7), seg(t, S7, S8), { z0: 1.0, z1: 1.05, oy: 900 }) + pill('NOV 10 · 1:20 AM');
    }],
    // 8 — screen goes black
    [S8, (t) => {
      let s = vgrad('#05060a', '#020305');
      const kO = seg(t, T.black - 0.2, T.black + 0.3);
      let inner = rect(-234, -484, 468, 968, '#3a4a66', 58, `opacity="${1 - kO}"`) + rect(-234, -484, 468, 968, '#000', 58, `opacity="${kO}"`);
      inner += g(adult({ ...ME, x: 0, y: 0, s: 1, face: 'neutral', pose: 'stand' }), 'translate(0 560) scale(0.9)', `opacity="${0.12 * kO}"`);
      s += phoneBig(540, 820, 0.9, inner, 0.15 * (1 - kO));
      s += t2(540, 1520, 'Nobody will ever believe you.', 34, '#9aa3b2', { weight: 600, extra: `opacity="${seg(t, T.believe, T.believe + 0.5)}"` });
      return cam(finish(s, 0.8), seg(t, S8, S9), { z0: 1.0, z1: 1.08, oy: 900 }) + pill('NOV 10');
    }],
    // 9 — outro at the wall
    [S9, (t) => {
      let s = vgrad('#2a3450', '#d9905a', 0, 1150) + glow(540, 1000, 500, '#ffb27a', 0.35) + tower(930, 1100, 0.6, '#1a1e2a');
      s += rect(0, 1100, 1080, 820, '#24221c');
      const r = rng(5);
      for (let i = -1; i < 10; i++) { s += wallSeg(i * 120, 1100, 120, 360, '#9a9a94'); for (let k = 0; k < 2; k++) s += rect(i * 120 + 10 + r() * 60, 820 + r() * 200, 30 + r() * 60, 14 + r() * 20, ['#c8312b', '#2f6fd6', '#ffcf6a', '#2fae6a'][Math.floor(r() * 4)], 6, 'opacity="0.75"'); }
      s += t2(540, 560, 'WHAT WOULD', 84, '#ffffff', { weight: 900, ls: 3, extra: `opacity="${seg(t, S9, S9 + 0.3)}"` }) + t2(540, 660, 'YOU FILM?', 84, '#ffcf6a', { weight: 900, ls: 3, extra: `opacity="${seg(t, S9 + 0.2, S9 + 0.5)}"` });
      s += adult({ ...ME, x: 300, y: 2050, s: 1.4, face: 'smile', pose: 'phone', look: 0.5 });
      return cam(finish(s, 0.6, '#1a2a3a', '#3a2a1a'), seg(t, S9, total), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('YOUR TURN');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps); } };
}
