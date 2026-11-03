// "What if everyone on Earth woke up speaking the same language?" — mature cinematic flat style.
import * as L from './lib.js';
import { adult, silhouette, fog, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, finish, YOU, CROWD, chip, crowd, note } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const TEACH = { skin: '#f0c8a8', hair: '#6a4a2a', hairStyle: 'bun', top: '#2f5a7a', pants: '#2a2a30' };
const GRAN = { skin: '#efc6a6', hair: '#c8c8d0', hairStyle: 'bun', top: '#6b3a4a', pants: '#2a2a30' };
const WAITER = { skin: '#d9a582', hair: '#1f1a17', hairStyle: 'short', top: '#f2f0ea', pants: '#1a1a1e' };
const bubble = (x, y, text, k, col = '#f2f4f7', tc = '#1d1f24', size = 30) => k > 0 ? g(rect(-(40 + text.length * size * 0.33), -40, 2 * (40 + text.length * size * 0.33), 80, col, 40) + `<path d="M-20,38 L-36,70 L6,38Z" fill="${col}"/>` + t2(0, 11, text, size, tc, { weight: 800 }), `translate(${x} ${y}) scale(${k})`) : '';

export async function init() {
  const W = await (await fetch('/work/onelang/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const D = (s) => W.find((x) => x.seg === s).start - 0.25;
  const fps = 30, total = 52.1;
  const T = {
    same: wt('same', 0), language0: wt('language', 0),
    teacher: wt('teacher', 2), nobody: wt('nobody', 2), day: wt('day', 2),
    airports: wt('airports', 4), menus: wt('menus', 4), tourists: wt('tourists', 4), including: wt('including', 4), waiter: wt('waiter', 4),
    comment: wt('comment', 6), planet: wt('planet', 6), internet: wt('internet', 6), louder: wt('louder', 6),
    finally: wt('finally', 8), song: wt('song', 8), terrible: wt('terrible', 8),
    grandma: wt('grandma', 10), brazil: wt('brazil', 10), three: wt('three', 10), recipes: wt('recipes', 10),
    perfectly: wt('perfectly', 12), still: wt('still', 12), agree: wt('agree', 12),
  };
  const HELLOS = ['HALLO', 'HOLA', 'CIAO', 'OLÁ', 'MERHABA', 'ZDRAVO', 'HEJ', 'SALUT', 'CZEŚĆ', 'JAMBO'];

  const shots = [
    // 0 — greetings of the world collapse into one
    [0, (t) => {
      let s = vgrad('#05070c', '#0c1222') + glow(540, 860, 520, '#2f6fd6', 0.25);
      s += g(circ(0, 0, 260, '#0f2a4a') + `<path d="M-180,-120 q60,-40 120,0 t80,60 q-40,60 -120,40Z M40,40 q60,-20 120,20 q-20,80 -100,80Z M-60,120 q40,10 60,60 q-60,20 -90,-20Z" fill="#2f5a3a"/>` + circ(0, 0, 260, 'none', 'stroke="#9fc4ff" stroke-width="4" opacity="0.5"'), 'translate(540 860)');
      const kM = seg(t, T.same - 0.3, T.language0 + 0.3);
      HELLOS.forEach((h, i) => { const a = i / HELLOS.length * Math.PI * 2 + t * 0.2, r = 380 * (1 - kM); const k = pop(seg(t, 0.2 + i * 0.1, 0.4 + i * 0.1)) * (1 - kM * 0.9); s += bubble(540 + Math.cos(a) * r, 860 + Math.sin(a) * r * 0.9, h, k, '#f2f4f7', '#1d1f24', 28); });
      s += bubble(540, 860, 'UNDERSTOOD.', pop(seg(t, T.language0, T.language0 + 0.3)), '#2fae6a', '#fff', 40);
      s += chip(540, 1500, '1 LANGUAGE · 8 BILLION PEOPLE', pop(seg(t, T.language0 - 0.1, T.language0 + 0.2)), { size: 30, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.75), seg(t, 0, D(1)), { z0: 1.0, z1: 1.06, oy: 900 }) + pill('OVERNIGHT');
    }],
    // 1 — 7 AM: the language teacher takes the day off
    [D(1), (t) => {
      let s = vgrad('#e8dcc8', '#c8b8a0', 0, 1150) + rect(0, 1150, 1080, 770, '#8a7a64');
      s += rect(140, 400, 800, 420, '#2a3a2e', 10, 'stroke="#6a5a44" stroke-width="16"') + t2(540, 500, 'VOCAB TEST', 64, '#e8ecf2', { weight: 800, ls: 4, extra: 'opacity="0.9"' }) + t2(540, 600, 'Unit 7: irregular verbs', 34, '#c8d4c8', { weight: 600 });
      const kX = seg(t, T.nobody - 0.1, T.nobody + 0.4);
      s += `<path d="M200,450 L${200 + 680 * kX},${450 + 300 * kX}" stroke="#ff6a5a" stroke-width="10" stroke-linecap="round"/>`;
      const kO = seg(t, T.day - 0.4, D(3));
      s += adult({ ...TEACH, x: lerp(540, 1200, kO), y: 1480, s: 1.05, face: t > T.day - 0.3 ? 'smile' : 'neutral', pose: kO > 0 ? 'hold' : 'stand', hold: kO > 0 ? rect(30, -300, 70, 90, '#5a3a24', 10) : '', look: 0.5 });
      s += crowd(60, 1020, 1990, 1.3, 4, 51, { face: t > T.nobody ? 'smile' : 'neutral', pose: (i) => (t > T.nobody + 0.3 && i % 2 ? 'up' : 'stand') });
      s += chip(540, 920, 'DAY OFF', pop(seg(t, T.day - 0.1, T.day + 0.2)), { size: 36, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.5, '#2a2a1a', '#2a1a0b'), seg(t, D(1), D(3)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('7 AM');
    }],
    // 2 — 9 AM: tourists understand everything, including the waiter
    [D(3), (t) => {
      let s = vgrad('#9fc4e8', '#f2e2c8', 0, 1000) + glow(860, 420, 300, '#fff3d9', 0.6) + rect(0, 1000, 1080, 920, '#c8a880');
      s += rect(0, 560, 1080, 70, '#c8312b') + [...Array(9)].map((_, i) => `<path d="M${i * 120},630 q60,50 120,0" fill="#c8312b"/>`).join('') + rect(0, 630, 1080, 370, '#e8dccb') + rect(100, 680, 220, 320, '#9fb3c8', 4, 'opacity="0.5"') + rect(760, 680, 220, 320, '#9fb3c8', 4, 'opacity="0.5"');
      const kMenu = pop(seg(t, T.menus - 0.2, T.menus + 0.2));
      s += g(rect(-120, -160, 240, 320, '#f2ece0', 8) + t2(0, -110, 'MENU', 36, '#3a2a1a', { weight: 900, ls: 4 }) + [0, 1, 2, 3].map((i) => rect(-90, -60 + i * 50, 180 - i * 20, 12, '#8a7a64', 4)).join(''), `translate(540 800) scale(${kMenu})`);
      const kW = t > T.waiter - 0.1;
      s += adult({ ...CROWD[0], x: 230, y: 1480, s: 1.05, face: kW ? 'tense' : 'smile', pose: 'stand', look: 0.5 }) + adult({ ...CROWD[2], x: 430, y: 1480, s: 1.05, face: kW ? 'tense' : 'smile', pose: 'stand', look: 0.6 });
      s += rect(130, 1140, 420, 40, '#5a3a24', 8) + rect(160, 1180, 360, 300, '#4a3020');
      s += adult({ ...WAITER, x: 820, y: 1990, s: 1.35, face: 'smile', pose: 'cross', look: -0.6 });
      s += bubble(780, 900, '"they always order the same"', pop(seg(t, T.waiter - 0.3, T.waiter)), '#f2f4f7', '#1d1f24', 26);
      s += chip(330, 560 + 380, 'UNDERSTOOD', pop(seg(t, T.waiter + 0.4, T.waiter + 0.7)), { size: 28, col: '#ff8a7a' });
      return cam(finish(s, 0.45, '#2a2a1a', '#2a1a0b'), seg(t, D(3), D(5)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('9 AM');
    }],
    // 3 — noon: every comment section understands each other
    [D(5), (t) => {
      let s = vgrad('#0b0f18', '#05070b') + glow(540, 800, 520, '#ff5a7a', 0.15);
      s += rect(150, 380, 780, 1700, '#05060a', 80) + rect(170, 400, 740, 1660, '#121722', 64) + t2(220, 470, 'Comments', 34, '#e8ecf2', { weight: 800, anchor: 'start' });
      const cnt = Math.round(98000 * pop(seg(t, T.comment, T.louder + 0.5)));
      s += t2(860, 470, cnt.toLocaleString('en-US'), 28, '#ff8fb1', { weight: 800, anchor: 'end' });
      const CC = ['DE', 'BR', 'JP', 'US', 'FR', 'NG', 'IN', 'TR', 'PL', 'KR'], TXT = ['wait you speak?', 'finally lol', 'no YOU are wrong', 'hello from Tokyo', 'this is insane', 'who is awake', 'we can talk now', 'bro what', 'hahaha', 'same here'];
      const r = rng(9); const n = Math.floor(40 * seg(t, T.comment - 0.2, D(7)));
      for (let i = 0; i < 6; i++) { const j = n - i; if (j < 0) continue; const y = 1000 - i * 92; s += g(circ(0, 0, 30, ['#2f6fd6', '#2fae6a', '#c8312b', '#d9a23a', '#8a4a6a'][j % 5]) + t2(0, 9, CC[j % 10], 22, '#fff', { weight: 900 }) + rect(50, -32, 520, 64, '#1b2230', 20) + t2(74, 10, TXT[(j * 7) % 10], 28, '#e8ecf2', { weight: 600, anchor: 'start' }), `translate(250 ${y})`); }
      const kV = seg(t, T.internet - 0.2, T.louder + 0.3);
      for (let i = 0; i < 14; i++) { const h = 30 + 220 * kV * Math.abs(Math.sin(t * 9 + i * 1.3)); s += rect(220 + i * 46, 1700 - h, 30, h, '#ff5a7a', 8, `opacity="${0.4 + 0.6 * kV}"`); }
      s += chip(540, 1420, 'LOUDEST DAY EVER', pop(seg(t, T.louder - 0.2, T.louder + 0.2)), { size: 32, col: '#ff8fb1', border: '#ff8fb1' });
      return cam(finish(s, 0.6), seg(t, D(5), D(7)), { z0: 1.0, z1: 1.04, oy: 900 }) + pill('NOON');
    }],
    // 4 — day two: you finally understand the songs
    [D(7), (t) => {
      let s = vgrad('#1a1024', '#0c0814') + glow(540, 760, 520, '#a05aff', 0.25);
      for (let i = 0; i < 9; i++) { const ph = (t * 0.4 + i / 9) % 1; s += g(`<path d="M0,0 L0,-60 L30,-70 L30,-10" stroke="#d0a8ff" stroke-width="6" fill="none"/>` + circ(-8, 0, 12, '#d0a8ff') + circ(22, -10, 12, '#d0a8ff'), `translate(${120 + i * 105} ${1000 - ph * 520})`, `opacity="${0.6 * Math.sin(ph * Math.PI)}"`); }
      const headphones = `<path d="M-70,-500 Q0,-610 70,-500" stroke="#1a1a1e" stroke-width="16" fill="none"/>` + rect(-86, -520, 30, 60, '#c8312b', 12) + rect(56, -520, 30, 60, '#c8312b', 12);
      s += adult({ ...YOU, x: 540, y: 1990, s: 1.35, face: t > T.terrible - 0.2 ? 'tense' : t > T.finally ? 'smile' : 'neutral', pose: 'stand', hold: headphones });
      s += chip(540, 560, 'WAIT… THAT\'S WHAT IT MEANS?', pop(seg(t, T.song - 0.1, T.song + 0.2)), { size: 30, col: '#d0a8ff', border: '#d0a8ff' });
      s += chip(540, 700, 'SOME OF THEM: TERRIBLE', pop(seg(t, T.terrible - 0.2, T.terrible + 0.1)), { size: 28, col: '#ff8a7a' });
      return cam(finish(s, 0.65, '#1a0b2e', '#1a0b1a'), seg(t, D(7), D(9)), { z0: 1.0, z1: 1.06, oy: 1100 }) + pill('DAY 2');
    }],
    // 5 — day four: grandma calls Brazil
    [D(9), (t) => {
      let s = vgrad('#3a3028', '#241e18') + glow(540, 760, 520, '#ffd59a', 0.35) + rect(0, 1250, 1080, 670, '#1c1814');
      s += rect(120, 420, 840, 560, '#1d222c', 26) + rect(140, 440, 800, 520, '#121722', 16);
      s += rect(150, 450, 390, 500, '#3a2e24', 10) + rect(550, 450, 380, 500, '#1f5a3a', 10, `opacity="${pop(seg(t, T.brazil - 0.3, T.brazil))}"`);
      s += `<clipPath id="cpA"><rect x="150" y="450" width="390" height="500" rx="10"/></clipPath><clipPath id="cpB"><rect x="550" y="450" width="380" height="500" rx="10"/></clipPath>` + g(g(adult({ ...GRAN, x: 0, y: 0, s: 1, face: 'smile', pose: 'stand' }), 'translate(345 1240) scale(1.1)'), '', 'clip-path="url(#cpA)"');
      const kB = pop(seg(t, T.brazil - 0.3, T.brazil));
      s += g(g(adult({ ...CROWD[2], x: -80, y: 0, s: 1, face: 'smile', pose: 'up' }) + adult({ ...CROWD[3], x: 100, y: 30, s: 0.9, face: 'smile', pose: 'stand' }), 'translate(740 1240) scale(1.05)', `opacity="${kB}"`), '', 'clip-path="url(#cpB)"');
      s += rect(140, 440, 800, 520, '#000', 16, 'opacity="0"') + t2(740, 500, 'Brazil', 26, '#e8ecf2', { weight: 800, extra: `opacity="${kB}"` }) + t2(345, 500, 'Grandma', 26, '#e8ecf2', { weight: 800 });
      const hrs = seg(t, T.three - 0.3, T.recipes + 0.6) * 3;
      s += chip(540, 1440, `CALL: ${Math.floor(hrs)}:${String(Math.floor((hrs % 1) * 60)).padStart(2, '0')}:00`, pop(seg(t, T.three - 0.2, T.three + 0.1)), { size: 32, col: '#2fae6a' });
      s += note(540, 1640, 'Recipe swap', 'Feijoada ↔ Grandma\'s apple cake', pop(seg(t, T.recipes - 0.1, T.recipes + 0.3)), '#d9a23a', 700);
      return cam(finish(s, 0.6, '#2a1a0b', '#2a1a0b'), seg(t, D(9), D(11)), { z0: 1.0, z1: 1.05, oy: 900 }) + pill('DAY 4');
    }],
    // 6 — day seven: everyone understands, nobody agrees
    [D(11), (t) => {
      let s = vgrad('#2a2420', '#14100e') + glow(540, 500, 520, '#e8f0ff', 0.12) + rect(0, 1250, 1080, 670, '#181412');
      const kA = t > T.still - 0.1;
      s += adult({ ...CROWD[1], x: 220, y: 1480, s: 1.05, face: kA ? 'tense' : 'smile', pose: kA ? 'point' : 'stand', look: 0.6 }) + adult({ ...CROWD[0], x: 860, y: 1480, s: 1.05, face: kA ? 'tense' : 'smile', pose: kA ? 'point' : 'stand', look: -0.6 });
      s += rect(140, 1140, 800, 40, '#3a2e24', 8) + rect(180, 1180, 720, 320, '#2a2018');
      s += chip(540, 600, '100% UNDERSTOOD', pop(seg(t, T.perfectly - 0.2, T.perfectly + 0.2)), { size: 32, col: '#2fae6a' });
      s += chip(540, 760, '0% AGREED', pop(seg(t, T.agree - 0.2, T.agree + 0.2)), { size: 40, col: '#ff6a5a', border: '#ff6a5a' });
      if (kA) s += bubble(260, 880, 'NO.', pop(seg(t, T.still, T.still + 0.2)), '#f2f4f7', '#1d1f24', 34) + bubble(820, 880, 'NO.', pop(seg(t, T.still + 0.3, T.still + 0.5)), '#f2f4f7', '#1d1f24', 34);
      return cam(finish(s, 0.65, '#2a1a0b', '#1a0b0b'), seg(t, D(11), D(13)), { z0: 1.0, z1: 1.06, oy: 1000 }) + pill('DAY 7');
    }],
    // 7 — outro
    [D(13), (t) => {
      let s = vgrad('#05070c', '#0c1222') + glow(540, 760, 520, '#2f6fd6', 0.2);
      s += t2(540, 520, 'WHO WOULD', 100, '#ffffff', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13), D(13) + 0.3)}"` }) + t2(540, 640, 'YOU CALL?', 100, '#9fc4ff', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13) + 0.2, D(13) + 0.5)}"` });
      s += adult({ ...YOU, x: 540, y: 2040, s: 1.4, face: 'smile', pose: 'phone' });
      return cam(finish(s, 0.7), seg(t, D(13), total), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('YOUR TURN');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps); } };
}
