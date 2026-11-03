// Mature 2D kit: grounded proportions, cel shading, cinematic light. Shares helpers with lib.js.
import * as L from './lib.js';
const { g, rect, circ, lg, rg, uid } = L;
export const F = 'Inter';
export let NOW = 0;
export const setNow = (t) => { NOW = t; };
export const t2 = (x, y, s, size, fill, { weight = 600, anchor = 'middle', ls = 0, extra = '' } = {}) => `<text x="${x}" y="${y}" font-family="Inter" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" ${extra}>${s}</text>`;
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255; r = Math.round(r * k); gg = Math.round(gg * k); b = Math.round(b * k); return '#' + [r, gg, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join(''); };
export { shade };

/** grounded character, origin at feet centre. Height ≈ 560·s. */
export function adult({ x = 0, y = 0, s = 1, skin = '#d9a582', hair = '#2b211b', hairStyle = 'short', top = '#4b5a3a', pants = '#2c2f36', face = 'neutral', look = 0, pose = 'stand', tilt = 0, hold = '', light = 1, rim = '' } = {}) {
  const sk2 = shade(skin, 0.82), tp2 = shade(top, 0.78), pt2 = shade(pants, 0.8);
  let legs = '', arms = '';
  if (pose === 'sit') legs = `<path d="M-46,-250 L-46,-130 L-120,-120 L-120,0 L-84,0 L-84,-90 L-10,-100 Z" fill="${pants}"/><path d="M46,-250 L46,-130 L120,-120 L120,0 L84,0 L84,-90 L10,-100 Z" fill="${pt2}"/>`;
  else legs = `<path d="M-50,-260 L-8,-260 L-14,-14 L-46,-14 Z" fill="${pants}"/><path d="M8,-260 L50,-260 L46,-14 L14,-14 Z" fill="${pt2}"/>${rect(-56, -18, 46, 18, '#1b1c20', 6)}${rect(10, -18, 46, 18, '#1b1c20', 6)}`;
  const armL = { stand: 'M-58,-430 Q-80,-350 -74,-262', hold: 'M-58,-430 Q-82,-360 -30,-330', phone: 'M-58,-430 Q-86,-360 -26,-360', cross: 'M-58,-430 Q-70,-370 30,-360', up: 'M-58,-430 Q-90,-500 -86,-560', point: 'M-58,-430 Q-80,-350 -74,-262' }[pose] || 'M-58,-430 Q-80,-350 -74,-262';
  const armR = { call: 'M58,-430 Q112,-468 46,-500', stand: 'M58,-430 Q80,-350 74,-262', hold: 'M58,-430 Q82,-360 30,-330', phone: 'M58,-430 Q86,-360 26,-360', cross: 'M58,-430 Q70,-370 -30,-350', up: 'M58,-430 Q90,-500 86,-560', point: 'M58,-430 Q130,-420 190,-430' }[pose] || 'M58,-430 Q80,-350 74,-262';
  const end = (d) => d.split(' ').pop().split(',').map(Number);
  const [lx, ly] = end(armL), [rx, ry] = end(armR);
  arms = `<path d="${armL}" stroke="${tp2}" stroke-width="30" fill="none" stroke-linecap="round"/>${circ(lx, ly, 13, sk2)}<path d="${armR}" stroke="${top}" stroke-width="30" fill="none" stroke-linecap="round"/>${circ(rx, ry, 13, skin)}`;
  const torso = `<path d="M-62,-446 Q-70,-440 -66,-400 L-54,-254 L54,-254 L66,-400 Q70,-440 62,-446 Q0,-458 -62,-446Z" fill="${top}"/><path d="M0,-452 Q62,-450 62,-446 Q70,-440 66,-400 L54,-254 L0,-254Z" fill="${tp2}"/>`;
  const neck = rect(-11, -470, 22, 28, sk2, 4);
  let hairS = '';
  if (hairStyle === 'short') hairS = `<path d="M-35,-500 Q-38,-548 0,-550 Q38,-548 35,-500 Q30,-528 0,-528 Q-22,-526 -35,-500Z" fill="${hair}"/>`;
  else if (hairStyle === 'buzz') hairS = `<path d="M-34,-504 Q-36,-546 0,-548 Q36,-546 34,-504 Q26,-530 0,-532 Q-26,-530 -34,-504Z" fill="${hair}" opacity="0.85"/>`;
  else if (hairStyle === 'long') hairS = `<path d="M-38,-460 Q-44,-552 0,-552 Q44,-552 38,-460 L30,-470 Q34,-520 0,-526 Q-34,-520 -30,-470Z" fill="${hair}"/>`;
  else if (hairStyle === 'bun') hairS = `<path d="M-35,-500 Q-38,-548 0,-550 Q38,-548 35,-500 Q30,-530 0,-530 Q-30,-530 -35,-500Z" fill="${hair}"/>${circ(0, -556, 14, hair)}`;
  else if (hairStyle === 'cap') hairS = `<path d="M-37,-506 Q-36,-552 0,-552 Q36,-552 37,-506Z" fill="${hair}"/><path d="M0,-512 Q36,-516 58,-506 Q30,-500 0,-504Z" fill="${shade(hair, 0.8)}"/>`;
  const ph = (x * 0.0131 + y * 0.0071 + s * 3.1) % 7;
  const blink = ((NOW + ph) % 4.3) < 0.13;
  const ey = -506, dx = look * 6;
  const eyes = (face === 'closed' || blink) ? `<path d="M${-15 + dx},${ey} l10,0 M${5 + dx},${ey} l10,0" stroke="#1d1a18" stroke-width="3" stroke-linecap="round"/>` : `<ellipse cx="${-10 + dx}" cy="${ey}" rx="3.2" ry="4" fill="#1d1a18"/><ellipse cx="${12 + dx}" cy="${ey}" rx="3.2" ry="4" fill="#1d1a18"/>`;
  const brows = face === 'worried' ? `<path d="M${-17 + dx},${ey - 9} l12,-4 M${19 + dx},${ey - 9} l-12,-4" stroke="${shade(hair, 0.9)}" stroke-width="3.5" stroke-linecap="round"/>` : face === 'tense' ? `<path d="M${-17 + dx},${ey - 12} l12,4 M${19 + dx},${ey - 12} l-12,4" stroke="${shade(hair, 0.9)}" stroke-width="3.5" stroke-linecap="round"/>` : `<path d="M${-17 + dx},${ey - 10} l12,-1 M${19 + dx},${ey - 10} l-12,-1" stroke="${shade(hair, 0.9)}" stroke-width="3.5" stroke-linecap="round"/>`;
  const mouth = face === 'smile' ? `<path d="M${-7 + dx},-483 q7,5 14,0" stroke="#7a3f36" stroke-width="3" fill="none" stroke-linecap="round"/>` : face === 'open' ? `<ellipse cx="${dx}" cy="-482" rx="5" ry="5" fill="#5a2d2a"/>` : `<path d="M${-6 + dx},-482 l12,0" stroke="#7a3f36" stroke-width="3" stroke-linecap="round"/>`;
  const head = `${circ(0, -503, 33, skin)}<path d="M0,-536 A33,33 0 0 1 0,-470 A26,33 0 0 0 0,-536Z" fill="${sk2}" opacity="0.7"/><path d="M${2 + dx},-500 l-3,9 l4,1" stroke="${sk2}" stroke-width="2.5" fill="none"/>${hairS}${eyes}${brows}${mouth}`;
  const br = 1 + 0.007 * Math.sin(NOW * 2.1 + ph * 3), sway = Math.sin(NOW * 0.9 + ph) * 1.2;
  const body = `${legs}${g(`${torso}${neck}${arms}${g(head, `rotate(${tilt + sway} 0 -470)`)}${hold}`, `translate(0 -254) scale(1 ${br}) translate(0 254)`)}`;
  return g(body, `translate(${x} ${y}) scale(${s})`);
}
/** silhouette with a thin rim light on one side */
export function silhouette({ x = 0, y = 0, s = 1, col = '#0d1116', rimCol = '#9fc4ff', side = 1, pose = 'stand', hairStyle = 'cap', hold = '', rimW = 5 } = {}) {
  const body = adult({ x: 0, y: 0, s: 1, skin: col, hair: col, top: col, pants: col, hairStyle, pose, hold });
  const rim = body.replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${rimCol}"`).replace(/stroke="#[0-9a-fA-F]{6}"/g, `stroke="${rimCol}"`);
  const dark = body.replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${col}"`).replace(/stroke="#[0-9a-fA-F]{6}"/g, `stroke="${col}"`);
  return g(g(rim, `translate(${rimW * side} ${-rimW * 0.6})`) + dark, `translate(${x} ${y}) scale(${s})`);
}
export function fog(y, h, col, a) { const id = uid('fg'); return `<defs>${lg(id, [[0, col, 0], [0.5, col, a], [1, col, 0]])}</defs>${rect(-100, y, 1280, h, `url(#${id})`)}`; }
export function vgrad(c1, c2, y0 = 0, y1 = 1920) { const id = uid('vg2'); return `<defs>${lg(id, [[0, c1], [1, c2]])}</defs>${rect(0, y0, 1080, y1 - y0, `url(#${id})`)}`; }
export function treeLine(baseY, col, seed, hMin, hMax, n = 14) { const r = L.rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = -60 + i * (1200 / n) + r() * 40, h = hMin + r() * (hMax - hMin), w = h * 0.36; s += `<path d="M${x},${baseY} L${x + w / 2},${baseY - h} L${x + w},${baseY}Z" fill="${col}"/>`; } return s + rect(-20, baseY - 2, 1120, 1920 - baseY, col); }
export function grade(top = '#1a2a3a', bottom = '#3a2a1a', a = 0.18) { const id = uid('gr'); return `<defs>${lg(id, [[0, top, a], [1, bottom, a]])}</defs>${rect(0, 0, 1080, 1920, `url(#${id})`)}`; }

/** shared frame runner: idle clock, soft crossfades between shots, floating dust, handheld micro-drift */
export function runShots(shots, t, { fade = 0.3, dustA = 0.5 } = {}) {
  setNow(t);
  let i = 0; while (i < shots.length - 1 && t >= shots[i + 1][0]) i++;
  let s = shots[i][1](t);
  const into = t - shots[i][0];
  if (i > 0 && into < fade) { const k = into / fade; s = shots[i - 1][1](t) + `<g opacity="${(k * k * (3 - 2 * k)).toFixed(3)}">${s}</g>`; }
  const r = L.rng(77); let d = '';
  for (let j = 0; j < 26; j++) { const x0 = r() * 1080, y0 = r() * 1920, sp = 8 + r() * 18, ph = r() * 6.28, sz = 1.5 + r() * 2.5; const x = (x0 + Math.sin(t * 0.4 + ph) * 30 + 1080) % 1080, y = ((y0 - t * sp) % 1920 + 1920) % 1920; d += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="#fff4dd" opacity="${(dustA * (0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.3 + ph)))).toFixed(3)}"/>`; }
  const dx = Math.sin(t * 0.63) * 3.5 + Math.sin(t * 1.7) * 1.2, dy = Math.cos(t * 0.51) * 3 + Math.sin(t * 1.3) * 1, rot = Math.sin(t * 0.37) * 0.18;
  return `<g transform="translate(540 960) rotate(${rot.toFixed(3)}) scale(1.012) translate(${(-540 + dx).toFixed(2)} ${(-960 + dy).toFixed(2)})">${s}</g><g style="mix-blend-mode:screen">${d}</g>`;
}
