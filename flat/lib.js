// Flat 2D illustration kit (SVG strings) in the style of the "timer app" reference: muted palettes,
// soft gradients, round-headed characters with dot eyes, UI cards, time pills.
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
export const easeOut = (k) => 1 - Math.pow(1 - k, 3);
export const lerp = (a, b, k) => a + (b - a) * k;
export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let _uid = 0; export const uid = (p = 'u') => p + (_uid++); export const resetUid = () => { _uid = 0; };

export const C = {
  skin: ['#f3cba8', '#e2a77f', '#b77a52', '#7f5136'], hair: ['#2d2420', '#4a3426', '#1d1d22', '#7a4b2a', '#c9a15a'],
  shirt: ['#7b62a8', '#c35a58', '#d1ad55', '#5674a8', '#5b8f7a', '#8a5a9a', '#d07a4a'], pants: '#3a3f55', ink: '#262630',
};

export const lg = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
export const rg = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
export const rect = (x, y, w, h, fill, rx = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
export const circ = (x, y, r, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
export const g = (inner, tr = '', extra = '') => `<g ${tr ? `transform="${tr}"` : ''} ${extra}>${inner}</g>`;
export const txt = (x, y, s, size, fill, { weight = 600, anchor = 'middle', family = 'Fredoka', ls = 0, extra = '' } = {}) => `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" ${extra}>${s}</text>`;

export function bg(c1, c2, c3 = null) { const id = uid('bg'); return `<defs>${lg(id, c3 ? [[0, c1], [0.55, c2], [1, c3]] : [[0, c1], [1, c2]])}</defs>${rect(0, 0, 1080, 1920, `url(#${id})`)}`; }
export function glow(x, y, r, color, a = 0.6) { const id = uid('gl'); return `<defs>${rg(id, [[0, color, a], [1, color, 0]])}</defs>${circ(x, y, r, `url(#${id})`)}`; }
export function vignette(a = 0.55) { const id = uid('vg'); return `<defs>${rg(id, [[0.55, '#000', 0], [1, '#000', a]], 0.5, 0.5, 0.75)}</defs>${rect(0, 0, 1080, 1920, `url(#${id})`)}`; }
export function shadowEllipse(x, y, rx, ry, a = 0.25) { return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#000" opacity="${a}"/>`; }

/** camera: slow push/pan around a point. k in 0..1 */
export function cam(inner, k, { z0 = 1, z1 = 1.06, x0 = 0, x1 = 0, y0 = 0, y1 = 0, ox = 540, oy = 960 } = {}) {
  const e = ease(clamp(k)); const z = lerp(z0, z1, e), x = lerp(x0, x1, e), y = lerp(y0, y1, e);
  return g(inner, `translate(${ox + x} ${oy + y}) scale(${z}) translate(${-ox} ${-oy})`);
}

// ---------------------------------------------------------------- characters
function hairShape(style, col) {
  switch (style) {
    case 'short': return `<path d="M-63,-262 Q-70,-334 0,-336 Q70,-334 63,-262 Q55,-300 18,-300 Q-12,-292 -30,-306 Q-48,-288 -63,-262Z" fill="${col}"/>`;
    case 'side': return `<path d="M-64,-258 Q-72,-336 4,-338 Q72,-332 64,-262 Q40,-306 -20,-296 Q-50,-292 -64,-258Z" fill="${col}"/>`;
    case 'long': return `<path d="M-64,-255 Q-70,-336 0,-338 Q70,-336 64,-255 Q60,-300 0,-302 Q-60,-300 -64,-255Z" fill="${col}"/>`;
    case 'bun': return `<path d="M-63,-262 Q-68,-334 0,-336 Q68,-334 63,-262 Q55,-302 0,-304 Q-55,-302 -63,-262Z" fill="${col}"/>${circ(0, -340, 26, col)}`;
    case 'curly': { let s = ''; for (let i = 0; i < 9; i++) { const a = Math.PI * (0.05 + 0.9 * i / 8); s += circ(-Math.cos(a) * 58, -268 - Math.sin(a) * 58, 22, col); } return s; }
    case 'cap': return `<path d="M-64,-268 Q-62,-338 0,-338 Q62,-338 64,-268Z" fill="${col}"/><path d="M10,-276 Q60,-282 96,-268 Q60,-262 10,-266Z" fill="${col}"/>`;
    default: return '';
  }
}
function face(eyes, mouth, brows) {
  let s = '';
  const ey = -262;
  if (eyes === 'closed') s += `<path d="M-32,${ey} Q-22,${ey + 6} -12,${ey}" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M12,${ey} Q22,${ey + 6} 32,${ey}" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  else if (eyes === 'wide') s += `${circ(-22, ey, 10, '#fff')}${circ(22, ey, 10, '#fff')}${circ(-22, ey + 1, 6, '#2b2b2b')}${circ(22, ey + 1, 6, '#2b2b2b')}`;
  else if (eyes === 'side') s += `<ellipse cx="-16" cy="${ey}" rx="6" ry="8" fill="#2b2b2b"/><ellipse cx="28" cy="${ey}" rx="6" ry="8" fill="#2b2b2b"/>`;
  else if (eyes === 'down') s += `<ellipse cx="-22" cy="${ey + 4}" rx="6" ry="5" fill="#2b2b2b"/><ellipse cx="22" cy="${ey + 4}" rx="6" ry="5" fill="#2b2b2b"/>`;
  else s += `<ellipse cx="-22" cy="${ey}" rx="6.5" ry="8.5" fill="#2b2b2b"/><ellipse cx="22" cy="${ey}" rx="6.5" ry="8.5" fill="#2b2b2b"/>${circ(-20, ey - 3, 2, '#fff')}${circ(24, ey - 3, 2, '#fff')}`;
  if (brows === 'worried') s += `<path d="M-34,${ey - 22} L-12,${ey - 28}" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/><path d="M34,${ey - 22} L12,${ey - 28}" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/>`;
  if (brows === 'up') s += `<path d="M-34,${ey - 26} Q-22,${ey - 34} -10,${ey - 27}" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M10,${ey - 27} Q22,${ey - 34} 34,${ey - 26}" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (brows === 'angry') s += `<path d="M-34,${ey - 30} L-12,${ey - 22}" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/><path d="M34,${ey - 30} L12,${ey - 22}" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/>`;
  const my = -232;
  if (mouth === 'smile') s += `<path d="M-14,${my - 2} Q0,${my + 10} 14,${my - 2}" stroke="#5a2d2a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  else if (mouth === 'grin') s += `<path d="M-18,${my - 4} Q0,${my + 18} 18,${my - 4}Z" fill="#5a2d2a"/>`;
  else if (mouth === 'o') s += `<ellipse cx="0" cy="${my}" rx="8" ry="10" fill="#5a2d2a"/>`;
  else if (mouth === 'sad') s += `<path d="M-12,${my + 4} Q0,${my - 6} 12,${my + 4}" stroke="#5a2d2a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M-10,${my} L10,${my}" stroke="#5a2d2a" stroke-width="4" stroke-linecap="round"/>`;
  s += `${circ(-36, -238, 9, '#ff8f8f', 'opacity="0.25"')}${circ(36, -238, 9, '#ff8f8f', 'opacity="0.25"')}`;
  return s;
}
/** Front-facing character. origin = middle of the waist line (y=0). */
export function person({ x = 0, y = 0, s = 1, skin = C.skin[0], hair = C.hair[0], hairStyle = 'short', shirt = C.shirt[0], eyes = 'dot', mouth = 'flat', brows = 'none', arms = 'down', legs = true, tilt = 0, hold = '' } = {}) {
  let back = '', front = '';
  if (hairStyle === 'long') back += `<path d="M-70,-280 Q-74,-160 -60,-150 L60,-150 Q74,-160 70,-280 Z" fill="${hair}"/>`;
  const sleeve = shirt, hand = skin;
  const arm = (a, b, c) => `<path d="M${a[0]},${a[1]} Q${b[0]},${b[1]} ${c[0]},${c[1]}" stroke="${sleeve}" stroke-width="36" fill="none" stroke-linecap="round"/>${circ(c[0], c[1], 19, hand)}`;
  const shL = [-70, -165], shR = [70, -165];
  let armsSvg = '';
  if (arms === 'down') armsSvg = arm(shL, [-100, -90], [-92, -20]) + arm(shR, [100, -90], [92, -20]);
  else if (arms === 'phone') armsSvg = arm(shL, [-110, -70], [-30, -105]) + arm(shR, [110, -70], [30, -105]);
  else if (arms === 'up') armsSvg = arm(shL, [-140, -230], [-120, -330]) + arm(shR, [140, -230], [120, -330]);
  else if (arms === 'facepalm') armsSvg = arm(shL, [-100, -90], [-92, -20]) + arm(shR, [120, -150], [30, -262]);
  else if (arms === 'point') armsSvg = arm(shL, [-100, -90], [-92, -20]) + arm(shR, [160, -170], [250, -190]);
  else if (arms === 'ear') armsSvg = arm(shL, [-100, -90], [-92, -20]) + arm(shR, [125, -140], [70, -250]);
  else if (arms === 'book') armsSvg = arm(shL, [-120, -60], [-45, -95]) + arm(shR, [120, -60], [45, -95]);
  else if (arms === 'wave') armsSvg = arm(shL, [-100, -90], [-92, -20]) + arm(shR, [150, -220], [130, -320]);
  else if (arms === 'run') armsSvg = arm(shL, [-120, -120], [-60, -60]) + arm(shR, [120, -200], [110, -110]);
  const legsSvg = legs ? `${rect(-62, -6, 50, 150, C.pants, 22)}${rect(12, -6, 50, 150, C.pants, 22)}<ellipse cx="-40" cy="146" rx="38" ry="16" fill="#23232b"/><ellipse cx="40" cy="146" rx="38" ry="16" fill="#23232b"/>` : '';
  const torso = `<path d="M-62,-192 Q-88,-190 -90,-160 L-98,-12 Q-98,4 -82,4 L82,4 Q98,4 98,-12 L90,-160 Q88,-190 62,-192Z" fill="${shirt}"/><path d="M-30,-192 Q0,-168 30,-192Z" fill="#000" opacity="0.12"/>`;
  const head = `${rect(-16, -212, 32, 26, skin, 6)}${rect(-16, -212, 32, 26, '#000', 6, 'opacity="0.1"')}${circ(-60, -262, 11, skin)}${circ(60, -262, 11, skin)}${circ(0, -265, 63, skin)}${hairShape(hairStyle, hair)}${face(eyes, mouth, brows)}`;
  front = (arms === 'facepalm' || arms === 'ear') ? `${torso}${g(head, `rotate(${tilt} 0 -265)`)}${armsSvg}${hold}` : `${torso}${armsSvg}${g(head, `rotate(${tilt} 0 -265)`)}${hold}`;
  return g(`${legsSvg}${back}${front}`, `translate(${x} ${y}) scale(${s})`);
}

// ---------------------------------------------------------------- UI pieces
export function pill(text, { x = 540, y = 320, a = 1 } = {}) {
  const w = 120 + text.length * 25;
  return g(`${rect(-w / 2 - 4, -46, w + 8, 92, '#ffffff', 46, 'opacity="0.18"')}${rect(-w / 2, -42, w, 84, '#1c1f2e', 42)}${glow(-w / 2 + 52, 0, 34, '#ff3b3b', 0.55)}${circ(-w / 2 + 52, 0, 15, '#ff3b3b')}${txt(-w / 2 + 84, 17, text, 48, '#ffffff', { weight: 700, anchor: 'start' })}`, `translate(${x} ${y})`, `opacity="${a}"`);
}
export function notif({ x = 540, y = 330, w = 780, title = 'Update complete.', app = 'SYSTEM · NOW', icon = 'timer', a = 1, accent = '#ff3b3b' } = {}) {
  const ic = icon === 'msg' ? `${rect(-34, -34, 68, 68, '#3ec46d', 16)}<path d="M-18,-12 h36 a6,6 0 0 1 6,6 v18 a6,6 0 0 1 -6,6 h-20 l-12,10 v-10 h-4 a6,6 0 0 1 -6,-6 v-18 a6,6 0 0 1 6,-6z" fill="#fff"/>`
    : icon === 'heart' ? `${rect(-34, -34, 68, 68, '#ff5a7a', 16)}<path d="M0,16 C-26,0 -20,-20 -8,-20 C-2,-20 0,-14 0,-12 C0,-14 2,-20 8,-20 C20,-20 26,0 0,16Z" fill="#fff"/>`
    : icon === 'bank' ? `${rect(-34, -34, 68, 68, '#2f6fd6', 16)}<path d="M-20,-6 L0,-20 L20,-6Z M-16,-2 h6 v16 h-6z M-3,-2 h6 v16 h-6z M10,-2 h6 v16 h-6z M-20,16 h40 v4 h-40z" fill="#fff"/>`
    : `${rect(-34, -34, 68, 68, '#111', 16)}<circle r="14" fill="none" stroke="${accent}" stroke-width="5"/>${circ(0, 0, 4, accent)}`;
  return g(`${rect(-w / 2 + 6, -64, w, 136, '#000', 30, 'opacity="0.18"')}${rect(-w / 2, -70, w, 136, '#f4f4f6', 30)}${g(ic, `translate(${-w / 2 + 70} -2)`)}${txt(-w / 2 + 128, -16, app, 26, '#666a74', { weight: 600, anchor: 'start', ls: 1 })}${txt(-w / 2 + 128, 26, title, 38, '#15161a', { weight: 700, anchor: 'start' })}`, `translate(${x} ${y})`, `opacity="${a}"`);
}
/** phone body; content = svg in screen coordinates (0..sw, 0..sh) */
export function phone({ x = 540, y = 960, w = 420, h = 860, rot = 0, content = '', screen = '#101018', glowA = 0 } = {}) {
  const sw = w - 36, sh = h - 36; const clip = uid('pc');
  return g(`${glowA ? glow(0, 0, w * 1.2, '#9fc4ff', glowA) : ''}${rect(-w / 2, -h / 2, w, h, '#16161c', 64)}${rect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, '#2a2a33', 60)}<clipPath id="${clip}"><rect x="${-sw / 2}" y="${-sh / 2}" width="${sw}" height="${sh}" rx="50"/></clipPath>${rect(-sw / 2, -sh / 2, sw, sh, screen, 50)}<g clip-path="url(#${clip})">${g(content, `translate(${-sw / 2} ${-sh / 2})`)}</g>${rect(-50, -h / 2 + 30, 100, 26, '#000', 13)}`, `translate(${x} ${y}) rotate(${rot})`);
}
export function hands(x, y, s = 1, skin = C.skin[0]) {
  return g(`${circ(-210, 120, 70, skin)}${circ(205, 140, 80, skin)}<ellipse cx="225" cy="-60" rx="38" ry="28" fill="${skin}"/><ellipse cx="232" cy="0" rx="40" ry="28" fill="${skin}"/><ellipse cx="230" cy="58" rx="38" ry="26" fill="${skin}"/><ellipse cx="-222" cy="40" rx="34" ry="62" fill="${skin}" transform="rotate(-25 -222 40)"/>`, `translate(${x} ${y}) scale(${s})`);
}

// ---------------------------------------------------------------- rooms / props
export function bedroom({ night = true, clock = '3:07', phoneGlow = 1, phoneA = 1, lampOn = false, morning = false } = {}) {
  let s = night ? bg('#3d4a78', '#5d6a9c', '#4b5687') : bg('#d9c3a0', '#e8d6b6', '#cdb48e');
  // window
  s += rect(70, 260, 360, 470, night ? '#26305a' : '#bfe0f5', 12) + rect(70, 260, 360, 470, 'none', 12, 'stroke="#e8e8f0" stroke-width="16"') + rect(244, 260, 12, 470, '#e8e8f0') + rect(70, 488, 360, 12, '#e8e8f0');
  if (night) { s += circ(340, 350, 46, '#f3efd2') + circ(322, 340, 46, '#26305a'); for (const [a, b] of [[130, 320], [200, 410], [380, 440], [150, 600], [330, 640]]) s += circ(a, b, 4, '#fff', 'opacity="0.8"'); }
  else s += circ(330, 380, 70, '#fff3c4', 'opacity="0.9"');
  // floor
  s += rect(0, 1480, 1080, 440, night ? '#2e3557' : '#b39572');
  // bed (left)
  s += rect(-60, 1010, 640, 70, night ? '#5a4a64' : '#9a7a64', 20) + rect(-60, 1070, 640, 330, night ? '#6f78a8' : '#e9e1d4', 30) + rect(-60, 1140, 640, 260, night ? '#7b6fa6' : '#c76b5e', 30) + rect(-60, 1390, 640, 40, '#000', 10, 'opacity="0.15"');
  s += rect(30, 1035, 240, 110, night ? '#c9c9e0' : '#ffffff', 40);
  // nightstand + lamp + clock
  s += rect(640, 1180, 330, 290, night ? '#5c4a52' : '#a2805f', 16) + rect(640, 1180, 330, 40, '#000', 16, 'opacity="0.12"') + rect(690, 1290, 230, 12, '#000', 6, 'opacity="0.2"');
  s += rect(880, 900, 14, 280, '#8d8fa6') + `<path d="M800,780 L970,780 L1010,910 L760,910Z" fill="${lampOn || !night ? '#f6e7c4' : '#9aa0c2'}"/>` + (lampOn ? glow(885, 900, 330, '#ffd98a', 0.45) : '');
  s += rect(660, 1060, 190, 120, '#202230', 18) + (night ? glow(755, 1120, 150, '#ff3b3b', 0.35) : '') + txt(755, 1150, clock, 84, '#ff4b4b', { weight: 700, extra: 'opacity="0.95"' });
  // phone on nightstand
  if (phoneA > 0) s += g(`${glow(0, 0, 210, '#bcd2ff', 0.55 * phoneGlow)}<path d="M-120,26 L60,-30 L130,-6 L-50,50Z" fill="#1a1a22"/><path d="M-104,22 L58,-24 L114,-6 L-46,40Z" fill="${night ? '#e9efff' : '#2a2a33'}" opacity="${0.4 + 0.6 * phoneGlow}"/>`, `translate(800 1205)`, `opacity="${phoneA}"`);
  return s;
}
export function dissolve(cx, cy, k, seed = 1, color = '#e9efff', n = 46, spread = 260) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = (0.2 + r()) * spread * easeOut(k), sz = 10 * (1 - k) * (0.5 + r());
    const x = cx + Math.cos(a) * d * 0.8 + (r() - 0.5) * 120 * (1 - k), y = cy + Math.sin(a) * d * 0.4 - k * 160 * r();
    if (sz > 0.5) s += rect(x, y, sz, sz, color, 1, `opacity="${(1 - k) * 0.9}"`);
  }
  return s;
}
export function building(x, y, w, h, col, win = '#f4d58a', seed = 1, litFrac = 0.4) {
  const r = rng(seed); let s = rect(x, y - h, w, h, col);
  const cols = Math.max(2, Math.floor(w / 46)), rows = Math.floor(h / 70); const ww = (w - 20) / cols;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) s += rect(x + 10 + i * ww + 6, y - h + 16 + j * 70, ww - 12, 40, r() < litFrac ? win : '#000', 3, `opacity="${r() < litFrac ? 0.85 : 0.18}"`);
  return s;
}
export function skyline(baseY, palette = ['#56627f', '#4a5470', '#3e4760'], seed = 3, h0 = 500) {
  const r = rng(seed); let s = '', x = -40;
  while (x < 1120) { const w = 120 + r() * 160, h = h0 * (0.5 + r() * 0.8); s += building(x, baseY, w, h, palette[Math.floor(r() * palette.length)], '#f4d58a', Math.floor(r() * 1000), 0.25); x += w + 10; }
  return s;
}
export function tvNews({ headline = 'EVERY PHONE ON EARTH', anchorMouth = 'flat', paper = true, k = 0 } = {}) {
  let s = bg('#454b66', '#585d7a', '#3a3f58');
  s += rect(40, 520, 1000, 640, '#15161d', 26) + rect(70, 548, 940, 584, '#2f5bb0', 8);
  for (let i = 0; i < 9; i++) s += `<line x1="${120 + i * 110}" y1="548" x2="${80 + i * 110}" y2="1132" stroke="#ffffff" stroke-opacity="0.06" stroke-width="3"/>`;
  s += `<g transform="translate(800 720)" opacity="0.65"><circle r="95" fill="none" stroke="#a9c4ff" stroke-width="5"/><ellipse rx="45" ry="95" fill="none" stroke="#a9c4ff" stroke-width="5"/><line x1="-95" y1="0" x2="95" y2="0" stroke="#a9c4ff" stroke-width="5"/></g>`;
  s += rect(830, 580, 140, 54, '#e03b3b', 6) + txt(900, 620, 'LIVE', 38, '#fff', { weight: 700 });
  s += g(person({ x: 0, y: 0, s: 0.95, skin: C.skin[0], hair: '#3a2c25', hairStyle: 'long', shirt: '#2b3550', mouth: anchorMouth, brows: 'worried', arms: paper ? 'book' : 'down', legs: false, hold: paper ? rect(-70, -140, 140, 100, '#f4f4f0', 6) : '' }), `translate(440 1135)`);
  s += rect(70, 960, 940, 172, '#1d2440', 0, 'opacity="0.92"') + rect(70, 950, 290, 64, '#e8504e') + txt(215, 995, 'BREAKING NEWS', 40, '#fff', { weight: 700 }) + txt(110, 1085, headline, 58, '#fff', { weight: 700, anchor: 'start' });
  s += rect(470, 1160, 140, 70, '#15161d') + rect(330, 1222, 420, 24, '#15161d', 12);
  return s;
}
export function desk(x, y, w, col = '#a77d58') { return rect(x, y, w, 40, col, 8) + rect(x, y + 34, w, 14, '#000', 6, 'opacity="0.18"') + rect(x + 30, y + 40, 26, 360, col) + rect(x + w - 56, y + 40, 26, 360, col); }
