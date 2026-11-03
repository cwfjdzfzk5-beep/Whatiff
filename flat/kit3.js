// Shared helpers for the November batch (mature cinematic flat style).
import * as L from './lib.js';
import { adult, vgrad, grade, t2 } from './lib2.js';
const { g, rect, circ, glow, vignette, easeOut, clamp, rng, seg } = L;

export const pop = (k) => easeOut(clamp(k));
export const finish = (s, v = 0.7, top = '#0b1a2e', bot = '#2e1a0b') => s + grade(top, bot, 0.16) + vignette(v);
export const YOU = { skin: '#e0b494', hair: '#3a2c22', hairStyle: 'short', top: '#3c4350', pants: '#24262b' };
export const CROWD = [
  { skin: '#f6d3b6', hair: '#b5823a', hairStyle: 'long', top: '#7a3a4a', pants: '#2a2a30' },
  { skin: '#e8b894', hair: '#3a2a20', hairStyle: 'short', top: '#2f5a7a', pants: '#24262b' },
  { skin: '#c98e62', hair: '#2a1d17', hairStyle: 'bun', top: '#8a6a3a', pants: '#2c2f36' },
  { skin: '#8d5a3c', hair: '#1f1a17', hairStyle: 'short', top: '#4a3a6a', pants: '#24262b' },
  { skin: '#efc29d', hair: '#6a4a2a', hairStyle: 'long', top: '#3a5a4a', pants: '#2a2a30' },
  { skin: '#d9a582', hair: '#a9a9b3', hairStyle: 'short', top: '#5a4a3a', pants: '#2c2f36' },
];
/** dark rounded chip with text */
export const chip = (x, y, text, k, { col = '#e8ecf2', bg = '#141a22', size = 36, border = '', w = 0 } = {}) => {
  if (k <= 0) return ''; const ww = w || 80 + text.length * size * 0.62;
  return g(rect(-ww / 2, -size * 1.1, ww, size * 2.2, bg, size * 1.1, border ? `stroke="${border}" stroke-width="3"` : '') + t2(0, size * 0.36, text, size, col, { weight: 900, ls: 2 }), `translate(${x} ${y}) scale(${k})`);
};
/** white notification card */
export function note(x, y, who, text, k, col = '#2f6fd6', w = 700) {
  return k > 0 ? g(rect(-w / 2, -60, w, 120, '#f2f4f7', 26) + circ(-w / 2 + 64, 0, 30, col) + t2(-w / 2 + 114, -10, who, 26, '#1d1f24', { weight: 800, anchor: 'start' }) + t2(-w / 2 + 114, 30, text, 26, '#3a3f4a', { weight: 600, anchor: 'start' }), `translate(${x} ${y})`, `opacity="${k}"`) : '';
}
/** strike-through tag */
export const strikeTag = (x, y, label, k, ks) => k > 0 ? g(rect(-190, -40, 380, 80, '#141a22', 40, 'stroke="#3a4250" stroke-width="3"') + t2(0, 13, label, 34, '#9aa3b2', { weight: 800, ls: 3 }) + `<path d="M-160,0 L${-160 + 320 * ks},0" stroke="#ff4a3a" stroke-width="7" stroke-linecap="round"/>`, `translate(${x} ${y}) scale(${k})`) : '';
/** big digital clock */
export const clock = (x, y, text, { col = '#ff4a3a', size = 92, w = 320 } = {}) => glow(x, y - 30, w * 0.75, col, 0.2) + rect(x - w / 2, y - 105, w, 150, '#0d0f14', 18, 'stroke="#2a2e36" stroke-width="4"') + t2(x, y, text, size, col, { weight: 800 });
/** phone frame with header, content drawn in absolute coords */
export function phoneUI(x, y, w, h, title, sub, inner, { accent = '#2fae6a' } = {}) {
  return rect(x - w / 2 - 20, y - 20, w + 40, h + 40, '#05060a', 70) + rect(x - w / 2, y, w, h, '#121722', 56) + rect(x - w / 2, y, w, 110, '#1b2230', 56) + rect(x - w / 2, y + 60, w, 50, '#1b2230') + circ(x - w / 2 + 70, y + 55, 32, accent) + t2(x - w / 2 + 120, y + 48, title, 32, '#e8ecf2', { weight: 800, anchor: 'start' }) + t2(x - w / 2 + 120, y + 84, sub, 22, accent, { weight: 600, anchor: 'start' }) + inner;
}
/** chat bubbles stacked from bottom; msgs: {t0,text,side,w} */
export function bubbles(msgs, t, x0, x1, yBottom, yTop) {
  let s = '', y = yBottom; const vis = msgs.filter((m) => t >= m.t0);
  for (let i = vis.length - 1; i >= 0; i--) { const m = vis[i], k = pop(seg(t, m.t0, m.t0 + 0.15)), h = 76 * k; y -= h + 14; if (y < yTop) break; const x = m.side < 0 ? x0 : x1 - m.w; s += g(rect(0, 0, m.w, 76, m.side < 0 ? '#2a3242' : '#2f6fd6', 30) + t2(28, 48, m.text, 28, '#e8ecf2', { weight: 600, anchor: 'start' }), `translate(${x} ${y}) scale(1 ${k})`); }
  return s;
}
/** street lamp */
export const lamp = (x, y, h = 520, col = '#ffcf8a', a = 0.35) => rect(x - 7, y - h, 14, h, '#1a1c20') + rect(x - 7, y - h, 90, 12, '#1a1c20', 6) + glow(x + 80, y - h + 30, 200, col, a) + circ(x + 80, y - h + 18, 14, col);
/** generic crowd row */
export function crowd(x0, x1, y, s, n, seed, opt = {}) { const r = rng(seed); let out = ''; for (let i = 0; i < n; i++) { const c = CROWD[Math.floor(r() * CROWD.length)]; out += adult({ ...c, x: x0 + (x1 - x0) * (n === 1 ? 0.5 : i / (n - 1)) + (r() - 0.5) * 20, y: y + (r() - 0.5) * 16, s: s * (0.93 + r() * 0.12), face: opt.face || 'neutral', pose: typeof opt.pose === 'function' ? opt.pose(i) : opt.pose || 'stand', look: (r() - 0.5) * 0.8 }); } return out; }
export { vgrad, t2, adult };
