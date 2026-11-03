// "What if every salary became public overnight?" — mature cinematic flat style.
import * as L from './lib.js';
import { adult, silhouette, fog, vgrad, grade, t2, runShots } from './lib2.js';
import { pop, finish, YOU, CROWD, chip, clock, note, crowd } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const MOM = { skin: '#efc6a6', hair: '#8a5a3a', hairStyle: 'bun', top: '#6b3a4a', pants: '#2a2a30' };
const GUY = { skin: '#e8b894', hair: '#c8a060', hairStyle: 'short', top: '#2f5a7a', pants: '#24262b' };
function office(s, bright = 1) {
  s += vgrad('#d8dee6', '#aab4c0', 0, 1150) + rect(0, 380, 1080, 520, '#9fb3c8', 0, `opacity="${0.35 * bright}"`);
  for (let i = 0; i < 6; i++) s += rect(i * 190 - 10, 380, 14, 520, '#7a8a9a');
  s += rect(0, 900, 1080, 16, '#7a8a9a') + rect(0, 1150, 1080, 770, '#5a6068');
  return s;
}
const desk = (x, y, w = 360) => rect(x - w / 2, y, w, 26, '#e8e4dc', 6) + rect(x - w / 2 + 20, y + 26, 16, 200, '#9a9a94') + rect(x + w / 2 - 36, y + 26, 16, 200, '#9a9a94') + rect(x - 70, y - 150, 140, 100, '#1d222c', 8) + rect(x - 62, y - 142, 124, 84, '#3a5a8a', 4) + rect(x - 10, y - 50, 20, 50, '#1d222c');
function appCard(x, y, k, name, amount, col = '#2fae6a') {
  return k > 0 ? g(rect(-300, -90, 600, 180, '#f2f4f7', 30) + circ(-220, 0, 46, '#c8ccd6') + circ(-220, -12, 18, '#8a909a') + `<path d="M-250,30 Q-220,0 -190,30Z" fill="#8a909a"/>` + t2(-150, -16, name, 32, '#1d1f24', { weight: 800, anchor: 'start' }) + t2(-150, 36, amount, 40, col, { weight: 900, anchor: 'start' }), `translate(${x} ${y}) scale(${k})`, `opacity="${k}"`) : '';
}

export async function init() {
  const W = await (await fetch('/work/salary/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const D = (s) => W.find((x) => x.seg === s).start - 0.25;
  const fps = 30, total = 60.5;
  const T = {
    public: wt('public', 0),
    app: wt('app', 2), type: wt('type', 2), earn: wt('earn', 2), office: wt('office', 2),
    guy: wt('guy', 4), four: wt('four', 4), same: wt('same', 4), started: wt('started', 4),
    inbox: wt('inbox', 6), three: wt('three', 6), coffee: wt('coffee', 6), negotiation: wt('negotiation', 6),
    boss: wt('boss', 8), quiet: wt('quiet', 8),
    raises: wt('raises', 10), money: wt('money', 10),
    mom: wt('mom', 12), make: wt('make', 12), change: wt('change', 12),
    part: wt('part', 13), eu: wt('eu', 13), range: wt('range', 13), interview: wt('interview', 13), germany: wt('germany', 13), late: wt('late', 13), expected: wt('expected', 13),
    want: wt('want', 14),
  };

  const shots = [
    // 0 — hook: every salary public
    [0, (t) => {
      let s = vgrad('#0b0f18', '#05070b') + glow(540, 760, 520, '#2fae6a', 0.18);
      const r = rng(5);
      for (let i = 0; i < 12; i++) { const x = 120 + (i % 3) * 360, y = 480 + Math.floor(i / 3) * 170, k = pop(seg(t, 0.3 + i * 0.12, 0.5 + i * 0.12)); if (x < 1000) s += g(rect(-120, -50, 240, 100, '#141a22', 20, 'stroke="#2a3242" stroke-width="2"') + t2(0, 14, `€${(1800 + Math.floor(r() * 60) * 100).toLocaleString('en-US')}`, 36, '#2fae6a', { weight: 900 }), `translate(${x + 60} ${y}) scale(${k})`, `opacity="${0.4 + 0.6 * k}"`); }
      s += chip(540, 1500, 'EVERY SALARY: PUBLIC', pop(seg(t, T.public - 0.2, T.public + 0.2)), { size: 40, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.75), seg(t, 0, D(1)), { z0: 1.0, z1: 1.07, oy: 900 }) + pill('OVERNIGHT');
    }],
    // 1 — 7 AM: the app, everyone is on it
    [D(1), (t) => {
      let s = office('');
      s += crowd(80, 1000, 1480, 0.95, 6, 3, { face: 'tense', pose: 'phone' });
      const typed = 'Lukas M.'.slice(0, Math.max(0, Math.floor((t - T.type) * 10)));
      let ph = rect(-260, -360, 520, 720, '#121722', 50) + rect(-260, -360, 520, 110, '#1b2230', 50) + rect(-260, -300, 520, 50, '#1b2230') + t2(-200, -284, 'SALARY SEARCH', 30, '#2fae6a', { weight: 900, anchor: 'start', ls: 3 });
      ph += rect(-220, -200, 440, 80, '#f2f4f7', 40) + t2(-180, -148, typed || 'Type any name…', 30, typed ? '#1d1f24' : '#8a909a', { weight: 600, anchor: 'start' });
      ph += appCard(0, 0, pop(seg(t, T.earn - 0.2, T.earn + 0.2)), 'Lukas M. · Sales', '€3,250 / month');
      s += g(glow(0, 0, 500, '#2fae6a', 0.15) + ph, 'translate(540 760) scale(0.95)', `opacity="${pop(seg(t, T.app - 0.3, T.app))}"`);
      return cam(finish(s, 0.55, '#1a2a3a', '#2a2a2a'), seg(t, D(1), D(3)), { z0: 1.0, z1: 1.05, oy: 900 }) + pill('7 AM');
    }],
    // 2 — 9 AM: the guy next to you earns 400 more
    [D(3), (t) => {
      let s = office('');
      s += desk(280, 1260) + desk(800, 1260);
      s += adult({ ...YOU, x: 280, y: 1990, s: 1.35, face: t > T.four ? 'tense' : 'neutral', pose: 'phone', look: 0.6 });
      s += adult({ ...GUY, x: 800, y: 1990, s: 1.35, face: 'smile', pose: 'stand', look: -0.2 });
      s += g(rect(-150, -60, 300, 120, '#2fae6a', 30) + t2(0, 22, '+€400', 64, '#fff', { weight: 900 }), `translate(800 520) scale(${pop(seg(t, T.four - 0.1, T.four + 0.2))})`);
      s += chip(280, 640, 'SAME JOB', pop(seg(t, T.same - 0.1, T.same + 0.2)), { size: 32 });
      s += chip(800, 700, 'STARTED AFTER YOU', pop(seg(t, T.started - 0.1, T.started + 0.2)), { size: 28, col: '#ff8a7a' });
      return cam(finish(s, 0.55, '#1a2a3a', '#2a2a2a'), seg(t, D(3), D(5)), { z0: 1.0, z1: 1.06, oy: 1000 }) + pill('9 AM');
    }],
    // 3 — 10 AM: HR inbox explodes, coffee machine negotiations
    [D(5), (t) => {
      let s = vgrad('#2a3038', '#1a1e24') + glow(540, 400, 500, '#e8f0ff', 0.12) + rect(0, 1250, 1080, 670, '#1c2026');
      const n = Math.round(300 * pop(seg(t, T.inbox, T.three + 0.8)));
      s += rect(140, 400, 800, 360, '#1d222c', 22) + rect(160, 420, 760, 320, '#eef0f3', 12) + rect(160, 420, 760, 70, '#8a3a4a', 12) + rect(160, 470, 760, 20, '#8a3a4a') + t2(190, 468, 'HR · Inbox', 30, '#fff', { weight: 800, anchor: 'start' }) + t2(890, 468, `${n} unread`, 28, '#ffd0c8', { weight: 800, anchor: 'end' });
      for (let i = 0; i < 4; i++) s += rect(190, 520 + i * 52, 700, 38, i % 2 ? '#e2e6ec' : '#d6dbe2', 6) + t2(210, 546 + i * 52, ['RE: my salary??', 'Quick question about pay', 'URGENT: raise', 'Why does he earn more'][i], 22, '#3a3f4a', { weight: 700, anchor: 'start', extra: `opacity="${seg(t, T.inbox + i * 0.2, T.inbox + i * 0.2 + 0.2)}"` });
      const kC = seg(t, T.coffee - 0.3, T.coffee);
      s += g(rect(-80, -260, 160, 260, '#3a3e44', 14) + rect(-60, -230, 120, 70, '#141a22', 8) + circ(0, -120, 18, '#c8312b') + rect(-30, -60, 60, 50, '#e8e4dc', 6), `translate(540 1500)`, `opacity="${kC}"`);
      s += adult({ ...CROWD[0], x: 300, y: 1990, s: 1.3, face: 'tense', pose: t > T.negotiation ? 'point' : 'cross', look: 0.6 }) + adult({ ...CROWD[3], x: 790, y: 1990, s: 1.3, face: 'tense', pose: t > T.negotiation + 0.4 ? 'point' : 'cross', look: -0.6 });
      s += chip(540, 900, 'NEGOTIATION TABLE', pop(seg(t, T.negotiation - 0.2, T.negotiation + 0.2)), { size: 30, col: '#ffcf6a' });
      return cam(finish(s, 0.6), seg(t, D(5), D(7)), { z0: 1.0, z1: 1.05, oy: 900 }) + pill('10 AM');
    }],
    // 4 — 2 PM: someone looks up the boss
    [D(7), (t) => {
      let s = office('', 0.6);
      s += rect(560, 420, 460, 480, '#1a2a3a', 6, 'opacity="0.75"') + t2(790, 470, 'MANAGEMENT', 26, '#cfd6e2', { weight: 800, ls: 4 });
      s += silhouette({ x: 790, y: 900, s: 0.75, col: '#0d1116', rimCol: '#9fc4ff', side: -1, pose: 'cross', hairStyle: 'short' });
      const kQ = seg(t, T.quiet - 0.3, T.quiet + 0.3);
      s += crowd(60, 520, 1480, 0.95, 3, 9, { face: kQ > 0 ? 'tense' : 'neutral', pose: 'phone' });
      const kB = pop(seg(t, T.boss - 0.2, T.boss + 0.2));
      s += g(rect(-300, -90, 600, 180, '#f2f4f7', 30) + circ(-220, 0, 46, '#1d222c') + t2(-150, -16, 'The Boss', 32, '#1d1f24', { weight: 800, anchor: 'start' }) + rect(-150, 8, 300, 46, '#1d1f24', 8) + t2(-140, 44, '€', 38, '#fff', { weight: 900, anchor: 'start' }), `translate(540 1500) scale(${kB})`, `opacity="${kB}"`);
      s += rect(0, 0, 1080, 1920, '#000', 0, `opacity="${0.25 * kQ}"`);
      return cam(finish(s, 0.65, '#1a2a3a', '#1a1a2a'), seg(t, D(7), D(9)), { z0: 1.0, z1: 1.1, oy: 1000 }) + pill('2 PM');
    }],
    // 5 — day 3: raises everywhere
    [D(9), (t) => {
      let s = vgrad('#0e1a14', '#08100c') + glow(540, 760, 600, '#2fae6a', 0.2);
      for (let i = 0; i < 5; i++) s += note(540, 470 + i * 130, ['Payroll', 'HR', 'Payroll', 'Management', 'HR'][i], ['Your new salary: +€320', 'Adjustment approved: +€410', 'Your new salary: +€275', 'We found some budget.', 'Retroactive since May'][i], pop(seg(t, T.raises + i * 0.35, T.raises + i * 0.35 + 0.25)), '#2fae6a', 760);
      s += chip(540, 1400, 'MONEY THEY "DIDN\'T HAVE"', pop(seg(t, T.money - 0.2, T.money + 0.2)), { size: 30, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.7), seg(t, D(9), D(11)), { z0: 1.0, z1: 1.05, oy: 900 }) + pill('DAY 3');
    }],
    // 6 — day 7: mom asks
    [D(11), (t) => {
      let s = vgrad('#3a3028', '#241e18') + glow(540, 620, 520, '#ffd59a', 0.42) + rect(0, 1150, 1080, 770, '#1c1814');
      s += adult({ ...MOM, x: 300, y: 1480, s: 1.15, face: 'smile', pose: t > T.mom ? 'point' : 'stand', look: 0.5 }) + adult({ ...YOU, x: 760, y: 1480, s: 1.2, face: t > T.change - 0.3 ? 'tense' : 'neutral', pose: 'stand', look: -0.3 });
      s += rect(30, 1140, 1020, 60, '#3a2e24', 10) + rect(70, 1200, 940, 320, '#2a2018');
      for (const x of [300, 760]) s += `<ellipse cx="${x}" cy="1150" rx="70" ry="14" fill="#e8e0d0"/>` + circ(x - 16, 1140, 16, '#8a5a3a');
      s += note(540, 560, 'Mom', 'So… how much do you make?', pop(seg(t, T.make - 0.4, T.make)), '#c76b8a');
      s += chip(540, 720, 'NO WAY OUT', pop(seg(t, T.change - 0.1, T.change + 0.2)), { size: 30, col: '#ff8a7a' });
      return cam(finish(s, 0.6, '#2a1a0b', '#2a1a0b'), seg(t, D(11), D(13)), { z0: 1.02, z1: 1.08, oy: 900 }) + pill('DAY 7');
    }],
    // 7 — the real part: EU pay transparency
    [D(13), (t) => {
      let s = vgrad('#141a2a', '#0a0e18') + glow(540, 700, 500, '#2f6fd6', 0.2);
      const kD = pop(seg(t, T.eu - 0.3, T.eu + 0.2));
      let doc = rect(-380, -330, 760, 660, '#f2f0ea', 18) + rect(-380, -330, 760, 110, '#1f3a8a', 18) + rect(-380, -260, 760, 40, '#1f3a8a');
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; doc += circ(-300 + Math.cos(a) * 36, -275 + Math.sin(a) * 36, 5, '#ffcf3a'); }
      doc += t2(-230, -284, 'EU PAY TRANSPARENCY', 34, '#fff', { weight: 900, anchor: 'start', ls: 2 }) + t2(-230, -244, 'Directive (EU) 2023/970', 22, '#cfd6e2', { weight: 600, anchor: 'start' });
      const kR = pop(seg(t, T.range - 0.3, T.range + 0.1));
      doc += g(rect(-330, -50, 660, 100, '#fff3c8', 14) + t2(-300, 14, 'Salary range before the interview', 32, '#1d1f24', { weight: 800, anchor: 'start' }), `translate(0 -110) scale(${kR})`);
      doc += g(rect(-330, -50, 660, 100, '#eef0f3', 14) + t2(-300, 14, 'Ask what your role pays on average', 30, '#3a3f4a', { weight: 700, anchor: 'start' }), `translate(0 20) scale(${pop(seg(t, T.range + 0.4, T.range + 0.7))})`);
      doc += rect(-330, 120, 660, 14, '#d6dbe2', 6) + rect(-330, 160, 520, 14, '#d6dbe2', 6) + rect(-330, 200, 600, 14, '#d6dbe2', 6);
      s += g(doc, `translate(540 780) scale(${kD})`, `opacity="${kD}"`);
      const kG = pop(seg(t, T.germany - 0.2, T.germany + 0.2));
      s += g(rect(-330, -60, 660, 120, '#141a22', 30, 'stroke="#3a4250" stroke-width="3"') + rect(-300, -30, 80, 20, '#1a1a1a') + rect(-300, -10, 80, 20, '#d22') + rect(-300, 10, 80, 20, '#f2c200') + t2(-190, 16, t > T.expected - 0.1 ? 'GERMANY: EXPECTED 2027' : 'GERMANY: LATE', 34, '#ffcf6a', { weight: 900, anchor: 'start' }), `translate(540 1480) scale(${kG})`);
      return cam(finish(s, 0.7), seg(t, D(13), D(14)), { z0: 1.0, z1: 1.04, oy: 900 }) + pill('THE REAL PART');
    }],
    // 8 — outro
    [D(14), (t) => {
      let s = vgrad('#0b0f18', '#05070b') + glow(540, 760, 520, '#2fae6a', 0.15);
      s += t2(540, 560, 'WOULD YOU?', 110, '#ffffff', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(14), D(14) + 0.3)}"` });
      const on = Math.floor((t - D(14)) * 1.5) % 2 === 0;
      s += g(rect(-240, -70, 480, 140, '#141a22', 70, 'stroke="#3a4250" stroke-width="3"') + rect(on ? -230 : 10, -60, 220, 120, on ? '#2fae6a' : '#c8312b', 60) + t2(-120, 14, 'PUBLIC', 34, on ? '#fff' : '#8a909a', { weight: 900 }) + t2(120, 14, 'PRIVATE', 34, on ? '#8a909a' : '#fff', { weight: 900 }), 'translate(540 760)');
      s += adult({ ...YOU, x: 540, y: 2040, s: 1.4, face: 'neutral', pose: 'cross' });
      return cam(finish(s, 0.7), seg(t, D(14), total), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('YOUR TURN');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps); } };
}
