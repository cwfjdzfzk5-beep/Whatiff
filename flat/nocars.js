// "What if every car on Earth disappeared overnight?" — mature cinematic flat style.
import * as L from './lib.js';
import { adult, silhouette, fog, vgrad, grade, t2, treeLine, runShots } from './lib2.js';
import { pop, finish, YOU, CROWD, chip, crowd, lamp } from './kit3.js';
const { g, rect, circ, glow, cam, pill, seg, lerp, clamp, rng } = L;

const DAD = { skin: '#e0b494', hair: '#6a6a72', hairStyle: 'short', top: '#4a5a6a', pants: '#2a2a30' };
const car = (x, y, col, s = 1, a = 1) => a > 0 ? g(rect(-210, -90, 420, 90, col, 26) + `<path d="M-130,-90 L-80,-160 L90,-160 L140,-90Z" fill="${col}"/>` + `<path d="M-112,-94 L-72,-148 L0,-148 L0,-94Z M12,-94 L12,-148 L82,-148 L122,-94Z" fill="#1a2230" opacity="0.85"/>` + circ(-120, 0, 40, '#141618') + circ(120, 0, 40, '#141618') + circ(-120, 0, 16, '#5a5e64') + circ(120, 0, 16, '#5a5e64') + rect(190, -70, 20, 16, '#ffe9a8', 4), `translate(${x} ${y}) scale(${s})`, `opacity="${a}"`) : '';
const bike = (x, y, s = 1, col = '#c8312b') => g(circ(-70, 0, 46, 'none', 'stroke="#1a1c20" stroke-width="10"') + circ(70, 0, 46, 'none', 'stroke="#1a1c20" stroke-width="10"') + `<path d="M-70,0 L-10,-80 L50,-80 L70,0 M-10,-80 L0,0 L50,-80 M40,-100 L60,-100" stroke="${col}" stroke-width="10" fill="none" stroke-linejoin="round"/>`, `translate(${x} ${y}) scale(${s})`);
const horse = (x, y, s = 1, col = '#6a4a2a') => g(`<ellipse cx="0" cy="-170" rx="130" ry="60" fill="${col}"/>` + `<path d="M80,-200 L140,-330 L196,-322 L150,-180Z" fill="${col}"/>` + `<ellipse cx="214" cy="-300" rx="62" ry="26" fill="${col}" transform="rotate(38 214 -300)"/>` + `<path d="M150,-336 L160,-372 L176,-334Z" fill="${col}"/>` + `<path d="M140,-330 Q110,-260 96,-200" stroke="#3a2a1a" stroke-width="12" fill="none"/>` + [-90, -50, 60, 100].map((dx) => rect(dx - 9, -130, 18, 130, col, 6)).join('') + `<path d="M-130,-180 q-40,30 -30,90" stroke="#3a2a1a" stroke-width="16" fill="none"/>`, `translate(${x} ${y}) scale(${s})`);
const skater = (x, y, s, c) => adult({ ...c, x, y: y - 20 * s, s, face: 'smile', pose: 'up' }) + rect(x - 60 * s, y - 20 * s, 120 * s, 12 * s, '#2a2a30', 6) + circ(x - 40 * s, y - 4 * s, 8 * s, '#e8e8e2') + circ(x + 40 * s, y - 4 * s, 8 * s, '#e8e8e2');
function house(s, warm = 0.6) { return s + rect(160, 640, 520, 460, '#4a4038') + `<path d="M120,660 L420,470 L720,660Z" fill="#2a221c"/>` + rect(230, 720, 110, 100, '#f2c98a', 4, `opacity="${warm}"`) + rect(500, 720, 110, 100, '#f2c98a', 4, `opacity="${warm}"`) + rect(370, 860, 100, 240, '#2a201a', 6); }

export async function init() {
  const W = await (await fetch('/work/nocars/vo/words.json')).json();
  const wt = (w, s, n = 0) => { const xs = W.filter((x) => x.seg === s && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); if (!xs[n]) throw new Error(`word ${w}/${s}`); return xs[n].start; };
  const D = (s) => W.find((x) => x.seg === s).start - 0.25;
  const fps = 30, total = 58.1;
  const T = {
    disappeared: wt('disappeared', 0), buses: wt('buses', 0), stay: wt('stay', 0),
    dad: wt('dad', 2), stares: wt('stares', 2), back: wt('back', 2), out: wt('out', 2),
    bus: wt('bus', 4), bike: wt('bike', 4), sold: wt('sold', 4), horse: wt('horse', 4), viral: wt('viral', 4),
    silent: wt('silent', 6), six: wt('six', 6), kids: wt('kids', 6), autobahn: wt('autobahn', 6),
    pizza: wt('pizza', 8), cold: wt('cold', 8), nobody: wt('nobody', 8), birds: wt('birds', 8),
    parking: wt('parking', 10), parks: wt('parks', 10), football: wt('football', 10), markets: wt('markets', 10), basketball: wt('basketball', 10),
    first: wt('first', 12), waiting: wt('waiting', 12), eleven: wt('eleven', 12), dad2: wt('dad', 12),
  };

  const shots = [
    // 0 — a street of parked cars, dissolving one by one
    [0, (t) => {
      let s = vgrad('#1a2236', '#d0905a', 0, 1150) + glow(540, 1050, 520, '#ffb27a', 0.3);
      const r = rng(6); let x = -40; while (x < 1120) { const w = 160 + r() * 120, h = 300 + r() * 360; s += rect(x, 1150 - h, w, h, '#1e2230'); for (let j = 0; j < Math.floor(h / 70); j++) for (let i = 0; i < Math.floor(w / 50); i++) s += rect(x + 14 + i * 50, 1150 - h + 20 + j * 70, 28, 36, r() < 0.3 ? '#f2c98a' : '#0d1018', 2, 'opacity="0.8"'); x += w + 10; }
      s += rect(0, 1150, 1080, 770, '#2a2a2e') + rect(0, 1150, 1080, 30, '#4a4a4e');
      const cols = ['#c8312b', '#2f5a7a', '#e8e8e2', '#3a3a40', '#d9a23a'];
      for (let i = 0; i < 5; i++) { const k = seg(t, T.disappeared - 0.3 + i * 0.2, T.disappeared + i * 0.2 + 0.2); s += car(110 + i * 220, 1420, cols[i], 0.5, 1 - k); if (k > 0 && k < 1) for (let p = 0; p < 10; p++) s += circ(110 + i * 220 + (p - 5) * 18, 1380 - k * 120 - p * 6, 4, '#ffe9a8', `opacity="${1 - k}"`); }
      s += g(rect(-300, -110, 600, 160, '#2f6fd6', 20) + rect(-300, -130, 600, 30, '#1f4a9a', 10) + [0, 1, 2, 3].map((i) => rect(-270 + i * 140, -90, 110, 70, '#1a2230', 6, 'opacity="0.8"')).join('') + circ(-200, 50, 34, '#141618') + circ(200, 50, 34, '#141618'), `translate(${lerp(1500, 540, seg(t, T.buses - 0.5, T.stay))} 1700) scale(0.9)`);
      s += chip(540, 560, 'CARS: 0', pop(seg(t, T.disappeared + 0.6, T.disappeared + 0.9)), { size: 44, col: '#ffcf6a', border: '#ffcf6a' });
      s += chip(540, 700, 'BUSES & TRAINS: STAY', pop(seg(t, T.buses - 0.1, T.buses + 0.2)), { size: 30, col: '#9fc4ff' });
      return cam(finish(s, 0.6, '#1a2a3a', '#3a2a1a'), seg(t, 0, D(1)), { z0: 1.0, z1: 1.06, oy: 1200 }) + pill('OVERNIGHT');
    }],
    // 1 — 6 AM: dad and the empty driveway
    [D(1), (t) => {
      let s = vgrad('#5a6a8a', '#e0a87a', 0, 1100) + glow(860, 800, 300, '#ffd59a', 0.4); s = house(s, 0.7);
      s += rect(0, 1100, 1080, 820, '#3a3a36') + `<path d="M700,1100 L1080,1100 L1080,1920 L560,1920Z" fill="#5a5a58"/>` + `<ellipse cx="860" cy="1500" rx="120" ry="34" fill="#1a1a1a" opacity="0.5"/>`;
      // dad: out, stare, back in, out again
      let x = 420, show = true, face = 'neutral';
      if (t < T.dad + 0.2) x = 420; else if (t < T.stares) x = lerp(420, 700, seg(t, T.dad + 0.2, T.stares)); else if (t < T.back) { x = 700; face = 'tense'; } else if (t < T.out - 0.3) { x = lerp(700, 420, seg(t, T.back, T.back + 0.8)); show = x > 430; } else { x = lerp(420, 700, seg(t, T.out - 0.3, T.out + 0.6)); face = 'tense'; }
      if (show && t > T.dad - 0.2) s += adult({ ...DAD, x, y: 1480, s: 1.0, face, pose: face === 'tense' ? 'cross' : 'stand', look: 0.6 });
      s += chip(860, 1680, 'EMPTY', pop(seg(t, T.stares - 0.1, T.stares + 0.2)), { size: 30, col: '#9aa3b2' });
      return cam(finish(s, 0.55, '#1a2a3a', '#3a2a1a'), seg(t, D(1), D(3)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('6 AM');
    }],
    // 2 — 8 AM: full buses, sold-out bikes, a horse
    [D(3), (t) => {
      let s = vgrad('#9fb3c8', '#d8dee6', 0, 1100) + rect(0, 1100, 1080, 820, '#6a6e74') + rect(0, 1100, 1080, 24, '#8a8e94');
      s += rect(560, 560, 460, 540, '#e8e4dc', 6) + rect(560, 520, 460, 70, '#2a2e36', 6) + t2(790, 568, 'BIKE SHOP', 34, '#fff', { weight: 900, ls: 4 }) + rect(600, 640, 380, 300, '#9fb3c8', 4, 'opacity="0.6"');
      const kSO = pop(seg(t, T.sold - 0.2, T.sold + 0.2));
      s += g(rect(-170, -50, 340, 100, '#c8312b', 10) + t2(0, 18, 'SOLD OUT', 50, '#fff', { weight: 900 }), `translate(790 790) rotate(-8) scale(${kSO})`);
      const kB = seg(t, T.bus - 0.4, T.bike);
      let bus = rect(-300, -260, 600, 260, '#2f6fd6', 24) + rect(-300, -280, 600, 30, '#1f4a9a', 10) + circ(-200, 0, 40, '#141618') + circ(200, 0, 40, '#141618');
      for (let i = 0; i < 4; i++) { bus += rect(-270 + i * 140, -230, 110, 110, '#1a2230', 6, 'opacity="0.85"'); for (let k = 0; k < 3; k++) bus += circ(-250 + i * 140 + k * 35, -150, 16, ['#e0b494', '#c98e62', '#f6d3b6'][k]); }
      s += g(bus, `translate(${lerp(-400, 290, kB)} 1150)`) + chip(290, 760, 'FULL', pop(seg(t, T.bus, T.bus + 0.2)), { size: 30, col: '#ff8a7a' });
      const kH = seg(t, T.horse - 0.5, T.viral + 1.4);
      if (kH > 0) { s += horse(lerp(-300, 560, kH), 1990, 1.2) + adult({ ...CROWD[1], x: lerp(-300, 560, kH) - 10, y: 1800, s: 0.9, face: 'smile', pose: 'sit' }); }
      const views = Math.round(2.4e6 * pop(seg(t, T.viral - 0.1, T.viral + 1)));
      s += chip(540, 1500, `${(views / 1e6).toFixed(1)}M VIEWS`, pop(seg(t, T.viral - 0.2, T.viral + 0.1)), { size: 32, col: '#ff8fd0', border: '#ff8fd0' });
      return cam(finish(s, 0.5, '#1a2a3a', '#2a2a2a'), seg(t, D(3), D(5)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('8 AM');
    }],
    // 3 — noon: the empty highway
    [D(5), (t) => {
      let s = vgrad('#7a9ac0', '#e8eef4', 0, 860) + treeLine(860, '#4a6a4a', 3, 80, 160, 18) + rect(0, 860, 1080, 1060, '#6a8a5a');
      s += `<path d="M470,860 L610,860 L1180,1920 L-100,1920Z" fill="#4a4e54"/>`;
      for (let i = 1; i < 6; i++) { const xt = 470 + i * (140 / 6), xb = -100 + i * (1280 / 6); for (let k = 0; k < 8; k++) { const a = k / 8, b = a + 0.05; s += `<path d="M${lerp(xt, xb, a)},${lerp(860, 1920, a)} L${lerp(xt, xb, b)},${lerp(860, 1920, b)}" stroke="#e8e8e2" stroke-width="${2 + a * 8}"/>`; } }
      s += g(rect(-150, -60, 300, 120, '#1f4a9a', 10, 'stroke="#fff" stroke-width="4"') + t2(0, 16, 'AUTOBAHN', 40, '#fff', { weight: 900 }), 'translate(820 600)') + rect(812, 660, 16, 200, '#5a5e64');
      const kK = seg(t, T.kids - 0.3, D(7));
      s += skater(lerp(300, 380, kK), lerp(1300, 1500, kK), 0.6, CROWD[2]) + skater(lerp(640, 600, kK), lerp(1500, 1820, kK), 0.8, CROWD[3]);
      s += chip(540, 470, '6 LANES · 0 CARS', pop(seg(t, T.six - 0.2, T.six + 0.2)), { size: 34, col: '#ffcf6a', border: '#ffcf6a' });
      return cam(finish(s, 0.45, '#1a2a3a', '#2a2a1a'), seg(t, D(5), D(7)), { z0: 1.0, z1: 1.07, oy: 900 }) + pill('NOON');
    }],
    // 4 — week one: cold pizza by bike, birds on the main road
    [D(7), (t) => {
      let s = vgrad('#c8d4e0', '#e8ecf0', 0, 1100) + rect(0, 1100, 1080, 820, '#7a7e84');
      const r = rng(2); let x = -40; while (x < 1120) { const w = 180 + r() * 100, h = 380 + r() * 260; s += rect(x, 1100 - h, w, h, ['#c8b8a0', '#b8a890', '#a8a8a0'][Math.floor(r() * 3)]); for (let j = 0; j < Math.floor(h / 80); j++) for (let i = 0; i < Math.floor(w / 60); i++) s += rect(x + 16 + i * 60, 1100 - h + 24 + j * 80, 34, 44, '#6a7a8a', 2, 'opacity="0.7"'); x += w + 8; }
      const kP = seg(t, T.pizza - 0.5, T.nobody);
      s += bike(lerp(-200, 560, kP), 1960, 1.1, '#2fae6a') + adult({ ...CROWD[3], x: lerp(-200, 560, kP), y: 1880, s: 1.1, face: t > T.cold ? 'tense' : 'neutral', pose: 'hold', hold: rect(-80, -330, 160, 30, '#d9a23a', 4) });
      s += chip(540, 640, 'PIZZA: COLD', pop(seg(t, T.cold - 0.1, T.cold + 0.2)), { size: 34, col: '#9fc4ff' });
      s += chip(540, 780, 'NOBODY COMPLAINS', pop(seg(t, T.nobody - 0.1, T.nobody + 0.2)), { size: 28 });
      const kBi = seg(t, T.birds - 0.5, D(9));
      for (let i = 0; i < 7; i++) { const bx = lerp(-100 - i * 80, 1200 - i * 60, kBi), by = 470 + Math.sin(i * 2) * 60 + Math.sin(t * 3 + i) * 10, w = Math.sin(t * 14 + i) * 14; s += `<path d="M${bx - 22},${by + w} Q${bx - 10},${by - 6} ${bx},${by} Q${bx + 10},${by - 6} ${bx + 22},${by + w}" stroke="#2a2e36" stroke-width="5" fill="none"/>`; }
      return cam(finish(s, 0.45, '#1a2a3a', '#2a2a2a'), seg(t, D(7), D(9)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('WEEK 1');
    }],
    // 5 — month one: parking lots become parks, pitches, markets
    [D(9), (t) => {
      let s = vgrad('#1a2236', '#d0905a', 0, 900) + glow(540, 860, 520, '#ffb27a', 0.3) + rect(0, 900, 1080, 1020, '#3a3a3e');
      const kG = seg(t, T.parks - 0.3, T.parks + 0.6);
      s += rect(0, 900, 1080, 1020, '#4a7a3a', 0, `opacity="${kG}"`);
      for (let i = 0; i < 6; i++) s += rect(80 + i * 170, 1000, 8, 300, '#e8e8e2', 2, `opacity="${1 - kG}"`);
      const kF = pop(seg(t, T.football - 0.2, T.football + 0.3));
      s += g(rect(-120, -140, 240, 12, '#f2f2f2') + rect(-120, -140, 12, 140, '#f2f2f2') + rect(108, -140, 12, 140, '#f2f2f2'), `translate(260 1250) scale(${kF})`);
      const kM = pop(seg(t, T.markets - 0.2, T.markets + 0.4));
      for (let i = 0; i < 3; i++) s += g(`<path d="M-90,-150 L0,-200 L90,-150Z" fill="${['#c8312b', '#d9a23a', '#2f6fd6'][i]}"/>` + rect(-80, -150, 160, 140, '#5a3a24'), `translate(${560 + i * 190} 1180) scale(${kM})`);
      for (let i = 0; i < 12; i++) s += circ(500 + i * 50, 960 + Math.sin(i) * 14, 7, '#ffe9a8', `opacity="${kM * (0.6 + 0.4 * Math.sin(t * 5 + i))}"`);
      const kH = pop(seg(t, T.basketball - 0.2, T.basketball + 0.3));
      s += g(rect(-8, -360, 16, 360, '#2a2e36') + rect(-90, -400, 180, 110, '#f2f2f2', 6) + circ(0, -280, 34, 'none', 'stroke="#ff6a2a" stroke-width="6"'), `translate(880 1900) scale(${kH})`);
      s += crowd(120, 640, 1990, 1.2, 4, 41, { face: 'smile', pose: (i) => ((Math.floor(t * 2) + i) % 2 ? 'up' : 'stand') });
      s += chip(540, 520, 'PARKING → PARK', pop(seg(t, T.parks - 0.2, T.parks + 0.2)), { size: 36, col: '#2fae6a', border: '#2fae6a' });
      return cam(finish(s, 0.55, '#1a2a3a', '#3a2a1a'), seg(t, D(9), D(11)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('MONTH 1');
    }],
    // 6 — month six: the first new car, an 11-year waiting list, dad
    [D(11), (t) => {
      const kDad = seg(t, T.dad2 - 0.4, T.dad2);
      let s = vgrad('#0b0d14', '#05060a');
      if (kDad < 1) {
        s += glow(540, 1450, 560, '#fff3d9', 0.35 * (1 - kDad)) + `<ellipse cx="540" cy="1560" rx="400" ry="64" fill="#1d222c"/>` + car(540, 1540, '#c8312b', 1.05, 1 - kDad);
        s += chip(540, 560, 'THE FIRST NEW CAR', pop(seg(t, T.first - 0.1, T.first + 0.2)) * (1 - kDad), { size: 34, col: '#ffcf6a', border: '#ffcf6a' });
        s += chip(540, 720, `WAITING LIST: ${Math.round(11 * pop(seg(t, T.waiting, T.eleven + 0.3)))} YEARS`, pop(seg(t, T.waiting - 0.1, T.waiting + 0.2)) * (1 - kDad), { size: 32 });
      }
      if (kDad > 0) { let h = vgrad('#5a6a8a', '#e0a87a', 0, 1100) + glow(860, 800, 300, '#ffd59a', 0.4); h = house(h, 0.7); h += rect(0, 1100, 1080, 820, '#3a3a36') + `<path d="M700,1100 L1080,1100 L1080,1920 L560,1920Z" fill="#5a5a58"/>` + adult({ ...DAD, x: 700, y: 1480, s: 1.0, face: 'neutral', pose: 'cross', look: 0.6 }); s += g(h, '', `opacity="${kDad}"`); }
      return cam(finish(s, 0.65, '#1a2a3a', '#3a2a1a'), seg(t, D(11), D(13)), { z0: 1.0, z1: 1.05, oy: 1100 }) + pill('MONTH 6');
    }],
    // 7 — outro
    [D(13), (t) => {
      let s = vgrad('#1a2236', '#d0905a', 0, 1150) + glow(540, 1050, 520, '#ffb27a', 0.3) + rect(0, 1150, 1080, 770, '#2a2a2e');
      s += t2(540, 520, 'WOULD YOU', 100, '#ffffff', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13), D(13) + 0.3)}"` }) + t2(540, 640, 'MISS IT?', 100, '#ffcf6a', { weight: 900, ls: 4, extra: `opacity="${seg(t, D(13) + 0.2, D(13) + 0.5)}"` });
      s += `<ellipse cx="540" cy="1500" rx="240" ry="50" fill="#1a1a1a" opacity="0.5"/>` + adult({ ...YOU, x: 540, y: 2040, s: 1.4, face: 'neutral', pose: 'cross' });
      return cam(finish(s, 0.6, '#1a2a3a', '#3a2a1a'), seg(t, D(13), total), { z0: 1.0, z1: 1.05, oy: 1000 }) + pill('YOUR TURN');
    }],
  ];
  return { fps, totalFrames: Math.round(total * fps), frame(f) { L.resetUid(); return runShots(shots, f / fps); } };
}
