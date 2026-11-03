// "What if nobody needed sleep anymore?" — mature cinematic flat style.
import * as L from './lib.js';
import { adult, silhouette, fog, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, finish, YOU, CROWD, chip, clock, note, bubbles, crowd, lamp } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

function city(baseY, seed, litK, col = '#141a26', h0 = 520) {
  const r = rng(seed); let s = '', x = -40, n = 0;
  while (x < 1120) { const w = 130 + r() * 150, h = h0 * (0.5 + r() * 0.8); s += rect(x, baseY - h, w, h, col); for (let j = 0; j < Math.floor(h / 60); j++) for (let i = 0; i < Math.floor(w / 44); i++) { const th = r(); const on = th < litK; s += rect(x + 12 + i * 44, baseY - h + 16 + j * 60, 24, 32, on ? '#f2c98a' : '#0a0d12', 2, `opacity="${on ? 0.85 : 0.5}"`); n++; } x += w + 12; }
  return s;
}
const lying = (o) => g(adult({ ...o, x: 0, y: 0, s: 1 }), `translate(${o.x} ${o.y}) rotate(-90) scale(${o.s})`);

export async function init() {
  const W = await (await fetch('/work/nosleep/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const D = (s) => W.find((x) => x.seg === s).start - 0.25;
  const fps = 30, total = 58.7;
  const T = {
    sleep: wt('sleep', 0), tonight: wt('tonight', 0),
    eleven: wt('eleven', 2), two: wt('two', 2), still: wt('still', 2), series: wt('series', 2), sunrise: wt('sunrise', 2),
    gym: wt('gym', 4), four: wt('four', 4), supermarkets: wt('supermarkets', 4), city: wt('city', 4), lights: wt('lights', 4),
    boss: wt('boss', 6), sixteen: wt('sixteen', 6), why: wt('why', 6), half: wt('half', 6), quits: wt('quits', 6),
    guitar: wt('guitar', 8), language: wt('language', 8), cook: wt('cook', 8), three: wt('three', 8), group: wt('group', 8),
    dreams: wt('dreams', 10), miss: wt('miss', 10, 1),
    pill: wt('pill', 12), eight: wt('eight', 12), once: wt('once', 12), line: wt('line', 12), kilometers: wt('kilometers', 12),
    extra: wt('extra', 13),
  };
  const msgs = []; { const r = rng(4); const M = ['anyone up?', 'everyone is up lol', 'gym?', 'its 3am', 'pizza?', 'brb learning japanese', 'lets go']; let k = 0; for (let t0 = T.group; t0 < D(9); t0 += 0.3) msgs.push({ t0, text: M[k++ % M.length], side: r() < 0.5 ? -1 : 1, w: 210 + r() * 170 }); }

  const shots = [
    // 0 — city at night, nobody goes to bed
    [0, (t) => {
      let s = vgrad('#03050a', '#0c1222') + glow(800, 300, 200, '#dfe8ff', 0.25) + circ(800, 300, 46, '#e8ecf2', 'opacity="0.85"');
      s += city(1250, 3, 0.15 + 0.7 * seg(t, T.sleep, T.tonight + 0.8), '#121826');
      s += rect(0, 1250, 1080, 670, '#07090e') + rect(0, 1250, 1080, 24, '#1a1e28');
      s += silhouette({ x: 300, y: 1960, s: 1.4, col: '#06080c', rimCol: '#f2c98a', side: 1, pose: 'stand', hairStyle: 'short' });
      s += chip(540, 520, 'SLEEP: NOT NEEDED', pop(seg(t, T.sleep - 0.2, T.sleep + 0.2)), { size: 36, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.75), seg(t, 0, D(1)), { z0: 1.0, z1: 1.07, oy: 1100 }) + pill('TONIGHT');
    }],
    // 1 — night one: series marathon until sunrise
    [D(1), (t) => {
      const kS = seg(t, T.sunrise - 0.5, T.sunrise + 1.2);
      let s = vgrad(L.lerp ? '#0b0f18' : '#0b0f18', '#05070b') + rect(620, 380, 360, 440, kS > 0 ? '#2a3a5a' : '#0f1a2e', 6) + glow(800, 700, 300, '#ffb27a', 0.5 * kS) + rect(620, 380, 360, 440, 'none', 6, 'stroke="#1a1f28" stroke-width="16"') + rect(792, 380, 16, 440, '#1a1f28');
      s += rect(0, 1300, 1080, 620, '#0a0c12');
      const ep = Math.min(10, 1 + Math.floor(9 * seg(t, T.eleven, T.sunrise)));
      s += rect(90, 460, 440, 280, '#05070b', 12) + rect(104, 474, 412, 252, '#2a3a66', 8) + glow(310, 600, 300, '#6a8acc', 0.3) + t2(310, 620, `EPISODE ${ep} / 10`, 34, '#e8ecf2', { weight: 800 });
      const time = t < T.two - 0.1 ? '23:00' : t < T.sunrise - 0.2 ? '02:00' : '06:40';
      s += clock(310, 960, time, { size: 70, w: 260 });
      s += rect(140, 1500, 800, 120, '#2a2a34', 26) + rect(140, 1440, 160, 120, '#3a3a46', 26);
      s += adult({ ...YOU, x: 540, y: 1960, s: 1.3, face: t > T.still ? 'smile' : 'neutral', pose: 'sit', look: -0.4 });
      s += chip(800, 1000, 'NOT TIRED', pop(seg(t, T.eleven + 0.6, T.eleven + 0.9)) * (1 - seg(t, T.series, T.series + 0.3)), { size: 30, col: '#2fae6a' });
      return cam(finish(s, 0.7), seg(t, D(1), D(3)), { z0: 1.0, z1: 1.06, oy: 1100 }) + pill('NIGHT 1');
    }],
    // 2 — night three: gym packed at 4 AM, supermarkets open
    [D(3), (t) => {
      let s = vgrad('#e8ecf0', '#b8c0c8', 0, 1150) + rect(0, 1150, 1080, 770, '#5a5e64');
      s += rect(60, 380, 960, 300, '#0a0f1a', 8) + city(680, 8, 0.8, '#121826', 260) + rect(60, 380, 960, 300, 'none', 8, 'stroke="#8a9098" stroke-width="12"');
      for (let i = 0; i < 4; i++) s += rect(80 + i * 250, 1180, 200, 50, '#2a2e36', 10) + rect(250 + i * 250, 1040, 14, 160, '#2a2e36');
      s += crowd(130, 950, 1180, 0.9, 4, 12, { face: 'neutral', pose: (i) => ((Math.floor(t * 3) + i) % 2 ? 'hold' : 'stand') });
      s += crowd(40, 1040, 1960, 1.3, 4, 15, { face: 'tense', pose: (i) => ((Math.floor(t * 2.5) + i) % 2 ? 'up' : 'hold') });
      s += clock(830, 600, '04:00', { size: 60, w: 230 });
      s += chip(270, 480, 'OPEN 24/7', pop(seg(t, T.supermarkets - 0.2, T.supermarkets + 0.2)), { size: 34, col: '#ff8fd0', border: '#ff8fd0' });
      s += chip(380, 620, 'LIGHTS: ALWAYS ON', pop(seg(t, T.lights - 0.3, T.lights)), { size: 28, col: '#ffcf6a' });
      return cam(finish(s, 0.55, '#1a2a3a', '#1a2a2a'), seg(t, D(3), D(5)), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('NIGHT 3');
    }],
    // 3 — week one: 16-hour shifts, half the office quits
    [D(5), (t) => {
      let s = vgrad('#2a3038', '#1a1e24') + glow(540, 400, 600, '#e8f0ff', 0.12) + rect(0, 1250, 1080, 670, '#1c2026');
      s += rect(140, 400, 800, 460, '#1d222c', 22) + rect(160, 420, 760, 420, '#eef0f3', 12) + rect(160, 420, 760, 70, '#2f4a6a', 12) + rect(160, 470, 760, 20, '#2f4a6a') + t2(190, 468, 'From: Boss', 28, '#fff', { weight: 800, anchor: 'start' });
      s += t2(200, 560, 'Subject: New schedule', 30, '#1d1f24', { weight: 800, anchor: 'start' });
      const k16 = pop(seg(t, T.sixteen - 0.1, T.sixteen + 0.2));
      s += g(rect(-300, -60, 600, 120, '#c8312b', 20) + t2(0, 20, '16-HOUR SHIFTS', 54, '#fff', { weight: 900 }), `translate(540 700) scale(${k16})`);
      s += t2(540, 800, t > T.why - 0.1 ? '"because why not"' : '', 28, '#6a7280', { weight: 600 });
      const kQ = seg(t, T.half - 0.2, T.quits + 0.8);
      CROWD.slice(0, 6).forEach((c, i) => { const leaving = i % 2 === 0; const x = 120 + i * 168 + (leaving ? kQ * (i < 3 ? -700 : 700) : 0); s += adult({ ...c, x, y: 1500, s: 0.95, face: leaving && kQ > 0 ? 'smile' : 'tense', pose: leaving && kQ > 0 ? 'hold' : 'cross', hold: leaving && kQ > 0 ? rect(-60, -330, 120, 80, '#a8885a', 6) : '' }); });
      s += chip(540, 1700, 'HALF THE OFFICE: GONE', pop(seg(t, T.quits, T.quits + 0.3)), { size: 32, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.6), seg(t, D(5), D(7)), { z0: 1.0, z1: 1.05, oy: 900 }) + pill('WEEK 1');
    }],
    // 4 — week two: guitar, a language, cooking; group chat at 3 AM
    [D(7), (t) => {
      let s = vgrad('#14121a', '#0b0a10') + rect(640, 380, 340, 400, '#0a0f1a', 6) + city(780, 6, 0.6, '#141a26', 300).replace(/<rect x="(-?\d+(\.\d+)?)"/g, (m, x) => (+x < 640 || +x > 960 ? '<rect opacity="0" x="' + x + '"' : m)) + rect(640, 380, 340, 400, 'none', 6, 'stroke="#1e1c26" stroke-width="16"') + glow(200, 900, 420, '#ffcf8a', 0.3) + rect(150, 1040, 100, 16, '#2a2630', 4) + rect(190, 900, 12, 140, '#2a2630') + `<path d="M150,900 L250,900 L225,850 L175,850Z" fill="#3a3440"/>` + rect(0, 1300, 1080, 620, '#100e14') + rect(80, 1060, 920, 30, '#2a2630', 8);
      const guitar = g(`<ellipse cx="0" cy="40" rx="70" ry="80" fill="#a8743a"/><ellipse cx="0" cy="-40" rx="52" ry="58" fill="#a8743a"/>` + circ(0, 20, 20, '#2a1a10') + rect(-8, -260, 16, 200, '#5a3a20') + rect(-14, -290, 28, 40, '#3a2414', 6), 'translate(60 -300) rotate(-35)');
      const step = t < T.language - 0.1 ? 0 : t < T.cook - 0.1 ? 1 : t < T.three - 0.2 ? 2 : 3;
      s += adult({ ...YOU, x: 540, y: 1980, s: 1.35, face: 'smile', pose: step === 0 ? 'hold' : step === 3 ? 'phone' : 'hold', hold: step === 0 ? guitar : '' });
      if (step === 1) s += ['HOLA', 'BONJOUR', 'CIAO', 'KONNICHIWA'].map((w, i) => chip(220 + (i % 2) * 640, 520 + Math.floor(i / 2) * 200, w, pop(seg(t, T.language + i * 0.15, T.language + i * 0.15 + 0.2)), { size: 32 })).join('');
      if (step === 2) { s += rect(330, 900, 420, 40, '#4a4e54', 10) + `<ellipse cx="540" cy="880" rx="190" ry="36" fill="#3a3e44"/>`; for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; s += `<path d="M${470 + i * 70},${850 - ph * 140} q-16,-26 0,-52" stroke="#e8ecf2" stroke-width="6" fill="none" opacity="${0.6 * (1 - ph)}"/>`; } s += chip(540, 560, 'LEVEL UP: COOKING', pop(seg(t, T.cook - 0.1, T.cook + 0.2)), { size: 30, col: '#2fae6a' }); }
      if (step === 3) { s += rect(200, 380, 680, 760, '#121722', 40) + rect(200, 380, 680, 100, '#1b2230', 40) + t2(250, 444, 'The group', 32, '#e8ecf2', { weight: 800, anchor: 'start' }) + t2(830, 444, '03:00', 28, '#ff8fd0', { weight: 800, anchor: 'end' }); s += bubbles(msgs, t, 230, 850, 1120, 500); }
      return cam(finish(s, 0.65), seg(t, D(7), D(9)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill(step === 3 ? 'WEEK 2 · 3 AM' : 'WEEK 2');
    }],
    // 5 — month one: nobody dreams anymore
    [D(9), (t) => {
      let s = vgrad('#05070c', '#0b1020') + rect(0, 1300, 1080, 620, '#06080c');
      const kD = 1 - seg(t, T.dreams, T.miss + 0.6);
      let dream = circ(0, 0, 260, '#141c30') + circ(0, 0, 260, 'none', 'stroke="#3a4a6a" stroke-width="4"');
      const r = rng(8); for (let i = 0; i < 26; i++) dream += circ((r() - 0.5) * 380, (r() - 0.5) * 380, 2 + r() * 5, '#dfe8ff', `opacity="${(0.4 + 0.6 * r()) * kD}"`);
      dream += `<path d="M-120,60 Q-60,-40 0,40 T120,20" stroke="#8aa0d0" stroke-width="6" fill="none" opacity="${0.7 * kD}"/>` + circ(90, -80, 40, '#e8ecf2', `opacity="${0.6 * kD}"`);
      s += g(dream, 'translate(540 720)') + circ(300, 1080, 18, '#141c30') + circ(250, 1180, 12, '#141c30');
      s += rect(110, 1500, 880, 70, '#1a1c24', 14) + rect(130, 1440, 840, 80, '#2a3346', 20) + rect(150, 1400, 200, 70, '#5a6070', 30);
      s += lying({ ...YOU, x: 840, y: 1470, s: 1.05, face: 'neutral' }) + rect(400, 1400, 600, 130, '#22293a', 30);
      return cam(finish(s, 0.8), seg(t, D(9), D(11)), { z0: 1.0, z1: 1.07, oy: 1200 }) + pill('MONTH 1');
    }],
    // 6 — month three: the sleep pill, a 4 km line
    [D(11), (t) => {
      let s = vgrad('#2a3450', '#c98a5a', 0, 1100) + glow(540, 1000, 500, '#ffb27a', 0.3) + rect(0, 1100, 1080, 820, '#2a2a28');
      s += rect(620, 640, 380, 460, '#e8ecf0', 6) + rect(620, 600, 380, 60, '#2fae6a', 6) + t2(810, 644, 'PHARMACY', 34, '#fff', { weight: 900, ls: 4 }) + rect(740, 840, 140, 260, '#9fb3c8', 4);
      for (let i = 0; i < 9; i++) { const x = 680 - i * 90, sc = 0.95 - i * 0.07; s += adult({ ...CROWD[i % 6], x, y: 1180 + i * 2, s: Math.max(0.35, sc * 0.7), face: 'neutral', pose: i % 3 === 0 ? 'phone' : 'stand' }); }
      s += crowd(60, 900, 1990, 1.35, 3, 31, { face: 'tense', pose: 'cross' });
      s += g(rect(-170, -70, 340, 140, '#f2f4f7', 30) + `<rect x="-120" y="-30" width="240" height="60" rx="30" fill="#ffffff" stroke="#2f6fd6" stroke-width="4"/><rect x="-120" y="-30" width="120" height="60" rx="30" fill="#2f6fd6"/>`, `translate(540 520) scale(${pop(seg(t, T.pill - 0.2, T.pill + 0.2))})`);
      s += chip(540, 690, '8 HOURS · ONCE A WEEK', pop(seg(t, T.eight - 0.1, T.eight + 0.2)), { size: 32, col: '#ffcf6a', border: '#ffcf6a' });
      s += chip(300, 900, `LINE: ${(4 * seg(t, T.line - 0.2, T.kilometers + 0.4)).toFixed(1)} KM`, pop(seg(t, T.line - 0.2, T.line + 0.1)), { size: 30 });
      return cam(finish(s, 0.6, '#1a2a3a', '#3a2a1a'), seg(t, D(11), D(13)), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('MONTH 3');
    }],
    // 7 — outro
    [D(13), (t) => {
      let s = vgrad('#03050a', '#0c1222') + city(1250, 3, 0.85, '#121826') + rect(0, 1250, 1080, 670, '#07090e');
      s += t2(540, 520, '8 EXTRA', 110, '#ffffff', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13), D(13) + 0.3)}"` }) + t2(540, 650, 'HOURS?', 110, '#ffcf6a', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13) + 0.2, D(13) + 0.5)}"` });
      s += adult({ ...YOU, x: 540, y: 2040, s: 1.4, face: 'smile', pose: 'cross' });
      return cam(finish(s, 0.7), seg(t, D(13), total), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('YOUR TURN');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps); } };
}
