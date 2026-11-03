// "What if the draft came back? — Part 3" (first week back in normal life) — mature cinematic flat style.
import * as L from './lib.js';
import { adult, silhouette, fog, vgrad, grade, t2, shade, treeLine, runShots } from './lib2.js';
const { g, rect, circ, glow, vignette, cam, pill, seg, easeOut, lerp, clamp, rng } = L;

const OLIVE = '#46523a';
const YOU = { skin: '#e0b494', hair: '#3a2c22', hairStyle: 'buzz', top: '#3c4350', pants: '#24262b' };
const MOM = { skin: '#efc6a6', hair: '#8a5a3a', hairStyle: 'bun', top: '#6b3a4a', pants: '#2a2a30' };
const BRO = { skin: '#e0b494', hair: '#3a2c22', hairStyle: 'short', top: '#2a4f9a', pants: '#24262b' };
const CIV = [{ skin: '#f6d3b6', hair: '#b5823a', hairStyle: 'long', top: '#7a3a4a' }, { skin: '#e8b894', hair: '#3a2a20', hairStyle: 'short', top: '#2f5a7a' }, { skin: '#c98e62', hair: '#2a1d17', hairStyle: 'bun', top: '#8a6a3a' }, { skin: '#8d5a3c', hair: '#1f1a17', hairStyle: 'short', top: '#4a3a6a' }];
const pop = (k) => easeOut(clamp(k));
const finish = (s, v = 0.7, top = '#0b1a2e', bot = '#2e1a0b') => s + grade(top, bot, 0.16) + vignette(v);
const backpack = (x, y, s = 1) => g(rect(-60, -80, 120, 160, '#3a4428', 26) + rect(-44, -20, 88, 60, OLIVE, 14) + rect(-50, -96, 100, 30, '#2e3620', 12), `translate(${x} ${y}) scale(${s})`);
const lying = (o) => g(adult({ ...o, x: 0, y: 0, s: 1 }), `translate(${o.x} ${o.y}) rotate(-90) scale(${o.s})`);
function note(x, y, who, text, k, col = '#2f6fd6') { return k > 0 ? g(rect(-320, -60, 640, 120, '#f2f4f7', 26) + circ(-256, 0, 30, col) + t2(-206, -10, who, 26, '#1d1f24', { weight: 800, anchor: 'start' }) + t2(-206, 30, text, 26, '#3a3f4a', { weight: 600, anchor: 'start' }), `translate(${x} ${y})`, `opacity="${k}"`) : ''; }
const strikeTag = (x, y, label, k, ks) => k > 0 ? g(rect(-170, -40, 340, 80, '#141a22', 40, 'stroke="#3a4250" stroke-width="3"') + t2(0, 13, label, 34, '#9aa3b2', { weight: 800, ls: 3 }) + `<path d="M-140,0 L${-140 + 280 * ks},0" stroke="#ff4a3a" stroke-width="7" stroke-linecap="round"/>`, `translate(${x} ${y}) scale(${k})`) : '';
const shirt = (x, y, col) => g(rect(-70, -20, 140, 40, col, 5) + rect(-70, 12, 140, 8, '#000', 3, 'opacity="0.18"') + `<path d="M-16,-20 L0,-6 L16,-20" stroke="#000" stroke-opacity="0.25" fill="none" stroke-width="3"/>`, `translate(${x} ${y})`);
function house(s) {
  s += rect(200, 560, 680, 520, '#3a332c') + `<path d="M160,580 L540,400 L920,580Z" fill="#2a221c"/>` + rect(470, 820, 140, 260, '#1a1612', 6) + rect(260, 660, 120, 110, '#f2c98a', 4, 'opacity="0.85"') + rect(700, 660, 120, 110, '#f2c98a', 4, 'opacity="0.85"');
  return s + rect(0, 1080, 1080, 840, '#24221c') + `<path d="M470,1080 L610,1080 L700,1920 L380,1920Z" fill="#3a3630"/>`;
}

export async function init() {
  const W = await (await fetch('/work/draft3/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const fps = 30, total = 71.8;
  const D = [1, 3, 5, 7, 9, 11, 13].map((s) => wt('day', s) - 0.25);
  const tThen = wt('then', 15) - 0.2, tOut = wt('which', 16) - 0.25;
  const T = {
    part: wt('part', 0), week: wt('week', 0),
    five: wt('five', 2), whistle: wt('whistle', 2), shouting: wt('shouting', 2), lie: wt('lie', 2), hour: wt('hour', 2), order: wt('order', 2), never: wt('never', 2),
    forty: wt('forty', 4), cereal: wt('cereal', 4), aisle: wt('aisle', 4), long: wt('long', 4), nobody: wt('nobody', 4), eat: wt('eat', 4),
    party: wt('party', 6), four: wt('four', 6), midnight: wt('midnight', 6), tired: wt('tired', 6), different: wt('different', 6),
    smaller: wt('smaller', 8), fold: wt('fold', 8), square: wt('square', 8), mom: wt('mom', 8), photo: wt('photo', 8), family: wt('family', 8),
    skills: wt('skills', 10), first: wt('first', 10), leading: wt('leading', 10), cooking: wt('cooking', 10), once: wt('once', 10), easy: wt('easy', 10),
    explodes: wt('explodes', 12), picture: wt('picture', 12), three: wt('three', 12), minutes: wt('minutes', 12),
    asks: wt('asks', 14), cold: wt('cold', 14), noise: wt('noise', 14), people: wt('people', 14), years: wt('years', 15), which: wt('which', 16),
  };
  // group-chat messages (deterministic)
  const MSG = ['NO WAY', 'haha', 'miss u guys', 'month 8!!', 'who took this', 'never again', 'same time next year?', 'that tent', 'lol', 'rain. so much rain', 'squad 3 forever', '3 people. 1 tent.', 'i can still hear it', 'hahaha', 'facts'];
  const msgs = []; { const r = rng(31); let k = 0; for (let t0 = T.explodes; t0 < T.picture - 0.15; t0 += 0.28) msgs.push({ t0, text: MSG[k++ % MSG.length], side: r() < 0.5 ? -1 : 1, w: 200 + r() * 220, h: 76 }); msgs.push({ t0: T.picture + 0.1, img: true, side: -1, w: 420, h: 280 }); for (let t0 = T.picture + 0.9; t0 < D[6]; t0 += 0.22) msgs.push({ t0, text: MSG[k++ % MSG.length], side: r() < 0.5 ? -1 : 1, w: 200 + r() * 220, h: 76 }); }

  const shots = [
    // intro: coming home at dusk
    [0, (t) => {
      let s = vgrad('#2a3450', '#d9905a', 0, 1150) + glow(540, 1000, 500, '#ffb27a', 0.35); s = house(s);
      const kW = pop(seg(t, T.part - 0.1, T.part + 0.3));
      s += g(rect(-200, -74, 400, 148, '#141a22', 18, 'stroke="#ffcf6a" stroke-width="4"') + t2(0, -6, 'WEEK 1', 58, '#ffcf6a', { weight: 900, ls: 5 }) + t2(0, 46, 'normal life', 32, '#cfd6e2', { weight: 600 }), `translate(540 500) scale(${kW})`, `opacity="${kW}"`);
      const kWalk = seg(t, 0, D[0]);
      s += adult({ ...YOU, x: lerp(300, 470, kWalk), y: lerp(2080, 1980, kWalk), s: lerp(1.45, 1.3, kWalk), face: 'neutral', pose: 'stand', look: 0.5, hold: backpack(80, -380, 1.0) });
      return cam(finish(s, 0.6, '#1a2a3a', '#3a2a1a'), seg(t, 0, D[0]), { z0: 1.0, z1: 1.06, oy: 1100 }) + pill('PART 3');
    }],
    // day 1: awake at five, nothing happens
    [D[0], (t) => {
      let s = vgrad('#070b14', '#121a28') + rect(660, 420, 300, 380, '#1c2a44', 6) + glow(810, 610, 260, '#4a6a9a', 0.25) + rect(660, 600, 300, 10, '#0a0e16') + rect(805, 420, 10, 380, '#0a0e16');
      s += rect(0, 1300, 1080, 620, '#0b0f18');
      const mins = Math.round(60 * clamp(seg(t, T.lie, T.hour + 0.6)));
      const clock = `${mins >= 60 ? '06' : '05'}:${String(mins % 60).padStart(2, '0')}`;
      s += glow(300, 700, 220, '#ff4a3a', 0.22) + rect(150, 620, 300, 150, '#0d0f14', 18, 'stroke="#2a2e36" stroke-width="4"') + t2(300, 728, clock, 92, '#ff4a3a', { weight: 800 });
      s += strikeTag(300, 470, 'WHISTLE', pop(seg(t, T.whistle - 0.1, T.whistle + 0.2)), seg(t, T.whistle + 0.2, T.whistle + 0.5));
      s += strikeTag(300, 900, 'SHOUTING', pop(seg(t, T.shouting - 0.1, T.shouting + 0.2)), seg(t, T.shouting + 0.2, T.shouting + 0.5));
      // ghost of an order that never comes
      const kO = seg(t, T.order - 0.2, T.order + 0.3) * (1 - seg(t, T.never + 0.3, T.never + 1.2));
      if (kO > 0) s += t2(810, 960, 'GET UP!', 70, '#e8ecf2', { weight: 900, ls: 6, extra: `opacity="${0.22 * kO}"` });
      // bed
      s += rect(110, 1500, 880, 70, '#2a2420', 14) + rect(110, 1560, 30, 160, '#2a2420') + rect(960, 1560, 30, 160, '#2a2420') + rect(130, 1440, 840, 80, '#3a4256', 20) + rect(150, 1400, 200, 70, '#c8ccd6', 30);
      s += lying({ ...YOU, top: '#4a5262', x: 840, y: 1470, s: 1.05, face: 'neutral' });
      s += rect(400, 1400, 600, 130, '#2a3346', 30) + rect(400, 1400, 600, 18, '#3a4560', 9);
      return cam(finish(s, 0.75), seg(t, D[0], D[1]), { z0: 1.0, z1: 1.07, oy: 1350 }) + pill('DAY 1');
    }],
    // day 2: forty kinds of cereal
    [D[1], (t) => {
      let s = vgrad('#d8dcd6', '#9ea4a0', 0, 1100) + rect(0, 1080, 1080, 840, '#7a7e7a');
      for (let i = 0; i < 4; i++) s += rect(140 + i * 230, 360, 150, 14, '#ffffff', 7, `opacity="${0.75 + 0.2 * Math.sin(t * 37 + i * 9)}"`);
      const PAL = ['#b5533a', '#d9a23a', '#3a6a9a', '#5a8a4a', '#8a4a6a', '#c8c2b0', '#2f4a6a', '#a8743a', '#6a2f3a', '#d0b070'];
      const r = rng(17);
      for (let row = 0; row < 4; row++) {
        s += rect(60, 560 + row * 160, 960, 16, '#4a4e52');
        for (let i = 0; i < 10; i++) {
          const n = row * 10 + i, k = pop(seg(t, T.forty - 0.3 + n * 0.035, T.forty - 0.1 + n * 0.035));
          const col = PAL[Math.floor(r() * PAL.length)], hh = 110 + r() * 30;
          if (k > 0) s += g(rect(-40, -hh, 80, hh, col, 4) + circ(0, -hh * 0.6, 18, '#f2f0ea', 'opacity="0.8"') + rect(-28, -24, 56, 10, '#000', 3, 'opacity="0.2"'), `translate(${105 + i * 97} ${560 + row * 160}) scale(1 ${k})`);
        }
      }
      const kF = pop(seg(t, T.forty - 0.1, T.forty + 0.3));
      s += g(rect(-120, -60, 240, 120, '#141a22', 60) + t2(0, 22, '40', 72, '#ffcf6a', { weight: 900 }), `translate(860 420) scale(${kF})`);
      const kL = pop(seg(t, T.long - 0.1, T.long + 0.3));
      if (kL > 0) s += g(rect(-130, -40, 260, 80, '#141a22', 40) + t2(0, 13, `+${Math.min(14, Math.floor((t - T.long) * 6 + 2))} min`, 36, '#e8ecf2', { weight: 800 }), `translate(220 420) scale(${kL})`);
      s += strikeTag(540, 1360, 'MEAL PLAN', pop(seg(t, T.nobody - 0.1, T.nobody + 0.2)), seg(t, T.eat - 0.3, T.eat + 0.1));
      const basket = g(rect(-70, -10, 140, 80, '#c8312b', 10, 'opacity="0.9"') + `<path d="M-50,-10 Q0,-70 50,-10" stroke="#c8312b" stroke-width="8" fill="none"/>`, 'translate(70 -300)');
      s += adult({ ...YOU, x: 540, y: 1990, s: 1.35, face: 'tense', pose: 'hold', look: 0.2, hold: basket });
      return cam(finish(s, 0.55, '#1a2a2a', '#2a2a1a'), seg(t, D[1], D[2]), { z0: 1.0, z1: 1.06, oy: 900 }) + pill('DAY 2');
    }],
    // day 3: party until four, out at midnight
    [D[2], (t) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 13);
      let s = vgrad('#07060c', '#120c1a') + rect(300, 560, 480, 560, '#1a1420') + rect(400, 700, 280, 420, '#ff4fb0', 4, `opacity="${0.55 + 0.25 * pulse}"`) + glow(540, 900, 500, '#c03aff', 0.25 + 0.15 * pulse);
      s += rect(0, 1120, 1080, 800, '#0c0a10') + `<path d="M400,1120 L680,1120 L860,1920 L220,1920Z" fill="#ff4fb0" opacity="${0.06 + 0.05 * pulse}"/>`;
      CIV.forEach((c, i) => { s += adult({ ...c, x: 440 + i * 65, y: 1110, s: 0.55, face: 'smile', pose: (Math.floor(t * 2.2) + i) % 2 ? 'up' : 'stand' }); });
      const k4 = pop(seg(t, T.four - 0.1, T.four + 0.2));
      s += g(rect(-150, -44, 300, 88, '#141a22', 44, 'stroke="#ff4fb0" stroke-width="3"') + t2(0, 15, 'UNTIL 04:00', 36, '#ff8fd0', { weight: 900, ls: 2 }), `translate(540 470) scale(${k4})`);
      const kM = pop(seg(t, T.midnight - 0.15, T.midnight + 0.2));
      if (kM > 0) s += g(rect(-120, -50, 240, 100, '#0d0f14', 18, 'stroke="#2a2e36" stroke-width="4"') + t2(0, 22, '00:04', 60, '#ff4a3a', { weight: 800 }), `translate(860 620) scale(${kM})`);
      const kWalk = seg(t, T.midnight - 0.3, D[3]);
      s += adult({ ...YOU, x: lerp(560, 760, kWalk), y: lerp(1810, 2040, kWalk), s: lerp(0.95, 1.4, kWalk), face: 'neutral', pose: 'stand', look: -0.3, rim: '#ff4fb0' });
      return cam(finish(s, 0.75, '#1a0b2e', '#0b0b1a'), seg(t, D[2], D[3]), { z0: 1.0, z1: 1.08, ox: 640, oy: 1300 }) + pill('DAY 3');
    }],
    // day 4: the room got smaller, perfect squares, mom's photo
    [D[3], (t) => {
      let s = vgrad('#5a4a3a', '#3a3028') + glow(820, 520, 420, '#ffe2b0', 0.3) + rect(680, 380, 260, 300, '#bcd2e6', 6, 'opacity="0.7"') + rect(680, 520, 260, 10, '#3a3028') + rect(805, 380, 10, 300, '#3a3028');
      s += rect(120, 420, 160, 220, '#7a3a4a', 4, 'opacity="0.7"') + rect(320, 460, 140, 180, '#2f5a7a', 4, 'opacity="0.7"') + t2(200, 540, 'GAME', 30, '#f2e0c8', { weight: 900, extra: 'opacity="0.6"' });
      s += rect(0, 1300, 1080, 620, '#2a221c') + rect(480, 1480, 560, 60, '#4a3a30', 12) + rect(480, 1440, 560, 60, '#8a6a5a', 16);
      const cols = ['#3c4350', '#e8e4dc', '#2a2e36', '#6a7a5a', '#e8e4dc', '#4a5a7a'];
      for (let i = 0; i < 6; i++) { const k = seg(t, T.fold + i * 0.32, T.fold + i * 0.32 + 0.2); if (k > 0) s += g(shirt(0, 0, cols[i]), `translate(760 ${1420 - i * 36 - (1 - pop(k)) * 60})`, `opacity="${k}"`); }
      s += adult({ ...YOU, x: 330, y: 1980, s: 1.35, face: 'neutral', pose: t > T.fold - 0.2 && t < T.mom ? 'hold' : 'stand', look: 0.5 });
      const kMom = pop(seg(t, T.mom - 0.4, T.mom));
      if (kMom > 0) s += adult({ ...MOM, x: lerp(1200, 900, kMom), y: 1470, s: 1.0, face: 'smile', pose: t > T.photo - 0.3 ? 'phone' : 'stand', look: -0.6 });
      const flash = Math.max(0, 1 - Math.abs(t - T.photo) * 6);
      if (flash > 0) s += rect(0, 0, 1080, 1920, '#ffffff', 0, `opacity="${0.55 * flash}"`);
      s += note(540, 560, 'Family chat', 'Mom sent a photo: "who folded these??"', pop(seg(t, T.family - 0.1, T.family + 0.3)), '#c76b8a');
      const z = 1.0 + 0.1 * easeOut(seg(t, T.smaller - 0.3, T.smaller + 0.8));
      return cam(finish(s, 0.6, '#2a1a0b', '#2a1a0b'), 1, { z0: z, z1: z, oy: 1100 }) + pill('DAY 4');
    }],
    // day 5: the application form
    [D[4], (t) => {
      let s = vgrad('#141820', '#0b0d12') + glow(820, 300, 300, '#ffcf8a', 0.25);
      s += rect(110, 380, 860, 700, '#1d222c', 28) + rect(130, 400, 820, 660, '#eef0f3', 16);
      s += rect(130, 400, 820, 80, '#2f4a6a', 16) + rect(130, 450, 820, 30, '#2f4a6a') + t2(170, 452, 'UNIVERSITY APPLICATION', 32, '#ffffff', { weight: 800, anchor: 'start', ls: 2 });
      s += t2(170, 540, 'Name', 24, '#6a7280', { weight: 700, anchor: 'start' }) + rect(170, 552, 740, 52, '#ffffff', 8, 'stroke="#cdd2da" stroke-width="2"') + t2(190, 588, 'Lukas M.', 26, '#1d1f24', { weight: 600, anchor: 'start' });
      s += t2(170, 650, 'Skills', 24, '#6a7280', { weight: 700, anchor: 'start', extra: `opacity="${0.5 + 0.5 * seg(t, T.skills - 0.2, T.skills)}"` }) + rect(170, 662, 740, 300, '#ffffff', 8, `stroke="${t > T.skills - 0.2 && t < T.easy ? '#2f6fd6' : '#cdd2da'}" stroke-width="3"`);
      const lines = [['First aid', T.first], ['Leading a team', T.leading], ['Cooking for 20 people', T.cooking]];
      lines.forEach(([txt, t0], i) => { const n = Math.floor(clamp((t - t0 + 0.1) * 22, 0, txt.length)); if (n > 0) { s += t2(200, 720 + i * 80, txt.slice(0, n), 34, '#1d1f24', { weight: 600, anchor: 'start' }); if (n === txt.length) s += g(circ(0, 0, 20, '#2fae6a') + `<path d="M-9,1 L-2,8 L10,-7" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`, `translate(870 ${710 + i * 80}) scale(${pop(seg(t, t0 + txt.length / 22, t0 + txt.length / 22 + 0.2))})`); } });
      const kE = pop(seg(t, T.easy - 0.2, T.easy + 0.2));
      s += g(rect(-150, -40, 300, 80, kE > 0.5 ? '#2fae6a' : '#2f6fd6', 40) + t2(0, 13, kE > 0.5 ? 'SENT' : 'SUBMIT', 34, '#fff', { weight: 900, ls: 3 }), `translate(780 1010) scale(${0.85 + 0.15 * kE})`, `opacity="${0.4 + 0.6 * seg(t, T.cooking, T.once)}"`);
      s += rect(0, 1300, 1080, 620, '#1a1d24') + rect(60, 1290, 960, 40, '#2a2e36', 12) + g(rect(-50, -70, 100, 120, '#e8e4dc', 14) + `<ellipse cx="0" cy="-70" rx="50" ry="14" fill="#5a3a24"/>` + `<path d="M50,-40 q40,0 40,30 t-40,30" stroke="#e8e4dc" stroke-width="12" fill="none"/>`, 'translate(220 1520)') + backpack(820, 1560, 1.2);
      return cam(finish(s, 0.65), seg(t, D[4], D[5]), { z0: 1.0, z1: 1.05, oy: 800 }) + pill('DAY 5');
    }],
    // day 6: the group chat explodes
    [D[5], (t) => {
      let s = vgrad('#0e1018', '#07080c') + glow(540, 800, 600, '#2f6fd6', 0.18);
      s += rect(150, 380, 780, 1700, '#05060a', 80) + rect(170, 400, 740, 1660, '#121722', 64);
      s += rect(170, 400, 740, 110, '#1b2230', 64) + rect(170, 470, 740, 40, '#1b2230') + circ(250, 455, 34, OLIVE) + t2(300, 448, 'Squad 3', 34, '#e8ecf2', { weight: 800, anchor: 'start' }) + t2(300, 486, '24 members', 24, '#2fae6a', { weight: 600, anchor: 'start' });
      const vis = msgs.filter((m) => t >= m.t0);
      let y = 1070;
      for (let i = vis.length - 1; i >= 0 && y > 540; i--) {
        const m = vis[i], k = pop(seg(t, m.t0, m.t0 + 0.15)), h = m.h * k;
        const x = m.side < 0 ? 200 : 880 - m.w; y -= h + 14;
        if (y < 520) break;
        if (m.img) s += g(rect(0, 0, m.w, m.h, '#e8ecf2', 22) + rect(10, 10, m.w - 20, m.h - 20, '#0f1c2e', 16) + `<path d="M${m.w / 2 - 110},${m.h - 30} L${m.w / 2},${60} L${m.w / 2 + 110},${m.h - 30}Z" fill="#3b3f2a"/><path d="M${m.w / 2 - 30},${m.h - 30} L${m.w / 2},${m.h - 90} L${m.w / 2 + 30},${m.h - 30}Z" fill="#ffb067"/>`, `translate(${x} ${y}) scale(1 ${k})`);
        else s += g(rect(0, 0, m.w, m.h, m.side < 0 ? '#2a3242' : '#2f6fd6', 30) + t2(28, m.h / 2 + 10, m.text, 28, '#e8ecf2', { weight: 600, anchor: 'start' }), `translate(${x} ${y}) scale(1 ${k})`);
      }
      const unread = Math.round(300 * easeOut(seg(t, T.explodes, T.minutes + 0.3)));
      s += g(rect(-200, -54, 400, 108, '#c8312b', 54) + t2(0, 18, `${unread} new`, 50, '#ffffff', { weight: 900 }), `translate(540 1420) scale(${pop(seg(t, T.explodes - 0.1, T.explodes + 0.2))})`);
      s += t2(540, 1530, `${Math.max(1, Math.round(10 * seg(t, T.explodes, T.minutes)))} min`, 34, '#9aa3b2', { weight: 700 });
      s += rect(200, 1640, 680, 90, '#1b2230', 45) + t2(250, 1697, 'Message', 30, '#5a6272', { weight: 600, anchor: 'start' });
      return cam(finish(s, 0.6), seg(t, D[5], D[6]), { z0: 1.0, z1: 1.05, oy: 900 }) + pill('DAY 6');
    }],
    // day 7: sunday dinner
    [D[6], (t) => {
      let s = vgrad('#3a3028', '#241e18') + glow(540, 640, 520, '#ffd59a', 0.42) + rect(0, 1150, 1080, 770, '#1c1814');
      const kA = t >= T.asks - 0.1;
      s += adult({ ...MOM, x: 200, y: 1480, s: 1.15, face: 'smile', pose: 'stand', look: 0.5 }) + adult({ ...YOU, x: 540, y: 1480, s: 1.2, face: t > T.cold - 0.2 ? 'neutral' : 'smile', pose: 'stand', look: kA ? 0.4 : 0 }) + adult({ ...BRO, x: 870, y: 1480, s: 0.9, face: 'neutral', pose: kA && t < T.cold ? 'point' : 'stand', look: -0.6 });
      s += rect(30, 1140, 1020, 60, '#3a2e24', 10) + rect(70, 1200, 940, 320, '#2a2018');
      for (const x of [200, 540, 870]) s += `<ellipse cx="${x}" cy="1150" rx="70" ry="14" fill="#e8e0d0"/>` + circ(x - 16, 1140, 16, '#8a5a3a') + circ(x + 18, 1142, 12, '#5a7a3a');
      const mem = [[250, 600, T.cold, 'COLD', '#13243a'], [540, 560, T.noise, 'NOISE', '#2a1a14'], [830, 600, T.people, 'PEOPLE', '#1f2a1a']];
      mem.forEach(([x, y, t0, lab, bgc], i) => {
        const k = pop(seg(t, t0 - 0.1, t0 + 0.25)); if (k <= 0) return;
        let c = circ(0, 0, 110, bgc) + circ(0, 0, 110, 'none', 'stroke="#ffcf8a" stroke-width="4" opacity="0.6"');
        if (i === 0) { c += `<path d="M-60,50 L0,-40 L60,50Z" fill="#3b3f2a"/>`; for (let j = 0; j < 9; j++) { const xx = -70 + ((j * 37 + t * 50) % 140), yy = -70 + ((j * 53 + t * 300) % 120); c += `<path d="M${xx},${yy} l-5,20" stroke="#a9c1e0" stroke-width="3" opacity="0.6"/>`; } }
        if (i === 1) { let p = 'M-80,0'; for (let j = 1; j <= 16; j++) p += ` L${-80 + j * 10},${(j % 2 ? -1 : 1) * (15 + 40 * Math.abs(Math.sin(t * 9 + j)))}`; c += `<path d="${p}" stroke="#ff9d4a" stroke-width="6" fill="none" stroke-linejoin="round"/>`; }
        if (i === 2) for (const dx of [-50, 0, 50]) c += circ(dx, -16, 20, '#9ab06a') + `<path d="M${dx - 32},48 Q${dx},${-2} ${dx + 32},48Z" fill="#9ab06a"/>`;
        s += g(c + t2(0, 160, lab, 28, '#ffcf8a', { weight: 900, ls: 4 }), `translate(${x} ${y}) scale(${k})`);
      });
      return cam(finish(s, 0.6, '#2a1a0b', '#2a1a0b'), seg(t, D[6], tThen), { z0: 1.02, z1: 1.1, ox: 540, oy: 900 }) + pill('DAY 7');
    }],
    // "ask me again in ten years"
    [tThen, (t) => {
      let s = vgrad('#2a1e18', '#120d0a');
      const r = rng(5); for (let i = 0; i < 16; i++) s += circ(r() * 1080, 300 + r() * 900, 30 + r() * 70, ['#ffcf8a', '#ff9d6a', '#ffe2b0'][i % 3], `opacity="${0.06 + 0.08 * r()}"`);
      s += glow(540, 1300, 520, '#ffd59a', 0.3);
      const kY = pop(seg(t, T.years - 0.2, T.years + 0.4));
      s += t2(540, 720, '2036', 220, '#ffcf8a', { weight: 900, ls: 10, extra: `opacity="${0.18 * kY}"` });
      s += adult({ ...YOU, x: 540, y: 2310, s: 1.9, face: t > T.years - 0.4 ? 'smile' : 'neutral', pose: 'stand' });
      return cam(finish(s, 0.7, '#2a1a0b', '#2a1a0b'), seg(t, tThen, tOut), { z0: 1.0, z1: 1.05, oy: 1400 }) + pill('DAY 7');
    }],
    // outro: which day?
    [tOut, (t) => {
      let s = vgrad('#2a3450', '#d9905a', 0, 1150) + glow(540, 1000, 500, '#ffb27a', 0.35); s = house(s);
      s += rect(0, 380, 1080, 520, '#000', 0, 'opacity="0.35"');
      s += t2(540, 560, 'WHICH DAY?', 96, '#ffffff', { weight: 900, ls: 4, extra: `opacity="${seg(t, tOut, tOut + 0.3)}"` });
      for (let i = 0; i < 7; i++) { const k = pop(seg(t, tOut + 0.2 + i * 0.12, tOut + 0.4 + i * 0.12)); const on = Math.floor((t - tOut) * 3) % 7 === i; s += g(circ(0, 0, 46, on ? '#ffcf6a' : '#141a22', 'stroke="#ffcf6a" stroke-width="4"') + t2(0, 16, `${i + 1}`, 44, on ? '#141a22' : '#ffcf6a', { weight: 900 }), `translate(${180 + i * 120} 720) scale(${k})`); }
      s += adult({ ...YOU, x: 260, y: 2050, s: 1.4, face: 'neutral', pose: 'stand', look: 0.6, hold: backpack(80, -380, 1.0) });
      return cam(finish(s, 0.6, '#1a2a3a', '#3a2a1a'), seg(t, tOut, total), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('YOUR TURN');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps); } };
}
