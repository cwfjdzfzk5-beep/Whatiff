#!/usr/bin/env python3
"""Post-production for the 'Was wäre, wenn ...' videos.
Adds title, persistent header, countdown badge, word-by-word captions, a synthesized
music bed + sound effects + voiceover, upscales the 3D render to 1080x1920 and encodes.

Usage:
  python3 post.py <id>                      full encode -> out/<id>.mp4
  python3 post.py <id> --novo               same without voiceover -> out/<id>_ohne_stimme.mp4
  python3 post.py <id> --stills 1,5,9.5     caption preview on frames of the raw render (or grey)
  python3 post.py <id> --audio-only         only write work/<id>/mix.wav
"""
import json, os, sys, subprocess, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import signal

ROOT = os.path.dirname(os.path.abspath(__file__))
VO_PREFIX = None
CLEAN_VOICE = False
W, H, FPS, SR = 1080, 1920, 30, 48000
F_BLACK = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
F_XB = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'
YELLOW = (255, 212, 59)
WHITE = (255, 255, 255)
GREEN = (98, 230, 128)

# ------------------------------------------------------------------ per-video config
def L(tl, i):
    return next(l for l in tl['lines'] if l['id'] == i)

def sfx_glas(tl):
    s = lambda i: L(tl, i)['start']
    tV, tR = s('c5') + 0.72, s('c0') + 0.78
    ev = [('riser', tV - 1.3, 1.3), ('whoosh', tV, 1.1), ('shimmer', tV, 1.0), ('glassbreak', tV + 0.05, 1.2),
          ('wind', tV + 0.2, s('c3') - 0.05), ('paper', s('c4'), s('c3') - 0.05),
          ('roar', s('c3') - 0.05, s('c2') - 0.05), ('whoosh', s('c3') + 1.0, 0.9), ('shimmer', s('c3') + 1.0, 0.7),
          ('shimmer', s('c2') + 1.15, 0.8), ('splash', s('c2') + 1.85, 1.0),
          ('underwater', s('c1') - 0.05, s('c0') - 0.05), ('powerdown', s('c1') + 1.55, 1.4),
          ('reverse', tR - 1.1, 1.1), ('shimmer', tR, 0.9), ('paper', tR + 0.3, tR + 2.0)]
    for c in ['c5', 'c4', 'c3', 'c2', 'c1', 'c0']:
        ev.append(('cut', s(c) - 0.05, 0.5))
    return ev

def sfx_schrauben(tl):
    s = lambda i: L(tl, i)['start']
    tV, tRel, tC, tR = s('c5') + 2.95, s('c3') + 4.6, s('c2') + 3.0, s('c0') + 0.7
    ev = [('roar', 0.0, tV + 0.3), ('riser', tV - 1.2, 1.2), ('shimmer', tV, 0.8), ('thud', tV + 0.16, 0.6), ('screech', tV + 0.15, s('c3') - 0.1 - tV),
          ('wind', s('c3') - 0.05, s('c2') - 0.05), ('shimmer', tRel, 0.7), ('whoosh', tRel + 0.05, 1.6),
          ('room', s('c2') - 0.05, s('c1') - 0.05), ('shimmer', tC, 0.7), ('clatter', tC + 0.02, 1.2), ('crash', tC + 0.1, 1.5), ('thud', tC + 0.5, 0.6), ('thud', tC + 0.8, 0.5),
          ('wind', s('c1') - 0.05, s('c0') - 0.05),
          ('reverse', tR - 1.0, 1.0), ('shimmer', tR, 0.8), ('wind', s('c0') - 0.05, tl['total'] + 1)]
    for c in ['c5', 'c4', 'c3', 'c2', 'c1', 'c0']:
        ev.append(('cut', s(c) - 0.05, 0.5))
    return ev

def sfx_kleber(tl):
    s = lambda i: L(tl, i)['start']
    tPeel, tCr, tP, tS, tT, tG = s('c5') + 0.6, s('c4') + 3.85, s('c3') + 2.0, s('c2') + 3.2, s('c1') + 0.9, s('c0') + 0.7
    ev = [('room', 0.0, tl['total'] + 1), ('riser', tPeel - 1.0, 1.0), ('shimmer', tPeel, 0.8), ('peel', tPeel + 0.1, 1.5), ('paper', tPeel + 0.7, tPeel + 2.0),
          ('shimmer', tCr, 0.7), ('crumble', tCr + 0.05, 2.4), ('thud', tCr + 0.45, 0.5), ('thud', tCr + 0.7, 0.5),
          ('shimmer', tP, 0.6), ('paper', tP + 0.05, tP + 2.0),
          ('shimmer', tS, 0.6), ('thud', tS + 0.28, 0.4), ('thud', tS + 0.34, 0.4),
          ('shimmer', tT, 0.6), ('tiles', tT + 0.1, 2.6),
          ('reverse', tG - 1.0, 1.0), ('shimmer', tG, 0.9)]
    for c in ['c5', 'c4', 'c3', 'c2', 'c1', 'c0']:
        ev.append(('cut', s(c) - 0.05, 0.5))
    return ev

def sfx_glas2(tl):
    s = lambda i: L(tl, i)['start']
    tV, tR, tPh = s('c5') + 0.65, s('c0') + 0.75, s('r2') + 6.6
    ev = [('room', 0.0, s('c5')), ('ping', tPh, 0.7), ('wind', s('r3') - 0.05, s('c5') - 0.05),
          ('riser', tV - 1.2, 1.2), ('shimmer', tV + 0.3, 1.0), ('whoosh', tV + 0.35, 1.2), ('wind', tV + 0.4, s('c4') - 0.05), ('paper', tV + 0.45, tV + 3.5),
          ('wind', s('c4') - 0.05, s('c3') - 0.05), ('paper', s('c4'), s('c3') - 0.05),
          ('roar', s('c3') - 0.05, s('c2') - 0.05), ('whoosh', s('c3') + 1.1, 0.9), ('shimmer', s('c3') + 1.1, 0.7),
          ('shimmer', s('c2') + 1.0, 0.8), ('splash', s('c2') + 1.6, 1.0),
          ('underwater', s('c1') - 0.05, s('c0') - 0.05), ('powerdown', s('c1') + 1.7, 1.4),
          ('reverse', tR - 1.1, 1.1), ('shimmer', tR, 0.9), ('room', s('c0') + 4.2, tl['total'] + 1), ('sting', s('twist') + 3.3, 1.6)]
    for c in ['hook2', 'lena', 'r1', 'r2', 'r3', 'c5', 'c4', 'c3', 'c2', 'c1', 'c0', 'twist']:
        ev.append(('cut', s(c) - 0.05, 0.5))
    ev.append(('cut', s('c0') + 4.25, 0.5))
    return ev

CFG = {
    'glas': {'title': 'Was wäre, wenn alles *Glas* für 5 Sekunden verschwindet?',
             'header': 'Was wäre, wenn *Glas* 5 Sekunden verschwindet?', 'sfx': sfx_glas},
    'schrauben': {'title': 'Was wäre, wenn alle *Schrauben* für 5 Sekunden verschwinden?',
                  'header': 'Was wäre, wenn *Schrauben* 5 Sekunden verschwinden?', 'sfx': sfx_schrauben},
    'glas2': {'title': 'Stell dir vor, alles *Glas* der Welt verschwindet. Für *5 Sekunden.*',
              'header': 'Alles *Glas* der Welt: 5 Sekunden weg', 'sfx': sfx_glas2, 'title_until': 2.6, 'title_y': 560, 'title_size': 82},
    'kleber': {'title': 'Was wäre, wenn aller *Kleber* für 5 Sekunden verschwindet?',
               'header': 'Was wäre, wenn *Kleber* 5 Sekunden verschwindet?', 'sfx': sfx_kleber},
}

# ------------------------------------------------------------------ text helpers
def parse_marked(text):
    """'Jedes *Fenster* ist weg.' -> [('Jedes', False), ('Fenster', True), ('ist', False), ('weg.', False)]"""
    out, emph = [], False
    for tok in re.split(r'(\s+)', text):
        if not tok or tok.isspace():
            continue
        # a token may contain '*' at start/end (or both)
        word = ''
        flags = []
        for ch in tok:
            if ch == '*':
                emph = not emph
                continue
            word += ch
            flags.append(emph)
        if word:
            out.append((word, any(flags)))
    return out

def layout(words, font, max_w, space):
    lines, cur, cur_w = [], [], 0
    for w, e in words:
        ww = font.getlength(w)
        add = ww if not cur else cur_w + space + ww
        if cur and add > max_w:
            lines.append((cur, cur_w)); cur, cur_w = [(w, e, ww)], ww
        else:
            cur.append((w, e, ww)); cur_w = add
    if cur:
        lines.append((cur, cur_w))
    return lines

def word_sprite(word, font, color, stroke, shadow=True):
    l, t, r, b = font.getbbox(word, stroke_width=stroke)
    pad = stroke + 14
    w, h = int(r - l + pad * 2), int(b - t + pad * 2)
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    if shadow:
        sh = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((pad - l, pad - t + 5), word, font=font, fill=(0, 0, 0, 170), stroke_width=stroke + 2, stroke_fill=(0, 0, 0, 170))
        img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(7)))
    ImageDraw.Draw(img).text((pad - l, pad - t), word, font=font, fill=color + (255,), stroke_width=stroke, stroke_fill=(0, 0, 0, 255))
    return img, (l - pad, t - pad)

class TextBlock:
    """Pre-laid-out block of words; each word is a sprite with its own appear time."""
    def __init__(self, text, size, center_x, center_y, max_w, font_path=F_BLACK, stroke=7, line_gap=1.13, emph_color=YELLOW):
        self.font = ImageFont.truetype(font_path, size)
        words = parse_marked(text)
        space = self.font.getlength(' ')
        lines = layout(words, self.font, max_w, space)
        asc, desc = self.font.getmetrics()
        lh = int(size * line_gap)
        total_h = lh * len(lines)
        y0 = center_y - total_h / 2
        self.items = []
        for li, (ws, lw) in enumerate(lines):
            x = center_x - lw / 2
            y = y0 + li * lh
            for (w, e, ww) in ws:
                spr, (ox, oy) = word_sprite(w, self.font, emph_color if e else WHITE, stroke)
                self.items.append({'w': w, 'e': e, 'spr': spr, 'pos': (int(x + ox), int(y + oy)), 'len': len(w)})
                x += ww + space
        self.bbox = (min(i['pos'][0] for i in self.items), int(y0), max(i['pos'][0] + i['spr'].width for i in self.items), int(y0 + total_h))

    def schedule(self, t0, t1):
        wts = [i['len'] + 3 for i in self.items]
        tot = sum(wts); acc = 0
        for it, wt in zip(self.items, wts):
            it['t'] = t0 + (acc / tot) * (t1 - t0)
            acc += wt

    def draw(self, canvas, t, alpha=1.0, anim=True):
        for it in self.items:
            ta = it.get('t', -1e9)
            if t < ta:
                continue
            k = min(1.0, (t - ta) / 0.09) if anim else 1.0
            a = alpha * k
            spr = it['spr']
            dy = int((1 - k) * 14) if anim else 0
            if it['e'] and anim and k < 1.0:  # emphasized words pop
                s = 1.0 + 0.25 * (1 - k)
                spr = spr.resize((max(1, int(spr.width * s)), max(1, int(spr.height * s))), Image.BILINEAR)
                px = it['pos'][0] - (spr.width - it['spr'].width) // 2
                py = it['pos'][1] - (spr.height - it['spr'].height) // 2
            else:
                px, py = it['pos'][0], it['pos'][1] + dy
            if a < 0.999:
                arr = np.array(spr); arr[..., 3] = (arr[..., 3].astype(np.float32) * a).astype(np.uint8); spr = Image.fromarray(arr)
            canvas.alpha_composite(spr, (max(0, px), max(0, py)))

def pill(canvas, box, radius=26, fill=(0, 0, 0, 105)):
    layer = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=radius, fill=fill)
    canvas.alpha_composite(layer)

_badge_font = None
def badge(canvas, cx, cy, num, prog, pop):
    global _badge_font
    if _badge_font is None:
        _badge_font = ImageFont.truetype(F_BLACK, 112)
    R = 86
    s = 1.0 + 0.35 * (1 - pop)
    size = int((R + 30) * 2 * s)
    lay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    c = size / 2; r = R * s
    d.ellipse((c - r, c - r, c + r, c + r), fill=(0, 0, 0, 125))
    d.ellipse((c - r, c - r, c + r, c + r), outline=(255, 255, 255, 70), width=int(11 * s))
    col = GREEN if num == 0 else YELLOW
    if num != 0 and prog < 1:
        d.arc((c - r, c - r, c + r, c + r), start=-90, end=-90 + 360 * (1 - prog), fill=col + (255,), width=int(11 * s))
    elif num == 0:
        d.ellipse((c - r, c - r, c + r, c + r), outline=col + (255,), width=int(11 * s))
    f = _badge_font if s == 1.0 else ImageFont.truetype(F_BLACK, int(112 * s))
    txt = str(num)
    l, t, rr, b = d.textbbox((0, 0), txt, font=f, stroke_width=5)
    d.text((c - (rr - l) / 2 - l, c - (b - t) / 2 - t), txt, font=f, fill=WHITE + (255,), stroke_width=5, stroke_fill=(0, 0, 0, 255))
    canvas.alpha_composite(lay, (int(cx - size / 2), int(cy - size / 2)))

# ------------------------------------------------------------------ overlay builder
class Overlay:
    def __init__(self, vid, tl):
        cfg = CFG[vid]
        self.tl = tl
        lines = tl['lines']
        self.hook = next((l for l in tl['lines'] if l['id'].startswith('hook')), None)
        self.title = TextBlock(cfg['title'], cfg.get('title_size', 94), 540, cfg.get('title_y', 800), 900, stroke=8)
        self.hook_end = cfg.get('title_until') or (L(tl, 'pov')['start'] - 0.05)
        self.title.schedule(0.0, 0.0)  # whole title visible from frame 0 (thumbnail)
        self.header = TextBlock(cfg['header'], 46, 540, 248, 880, font_path=F_XB, stroke=5)
        self.header.schedule(-1, -1)
        hb = self.header.bbox
        self.header_box = (hb[0] - 6, hb[1] - 22, hb[2] + 6, hb[3] + 14)
        self.caps = []
        for i, l in enumerate(lines):
            if not l['cap']:
                continue
            nxt = lines[i + 1]['start'] if i + 1 < len(lines) else tl['total'] + 5
            tb = TextBlock(l['cap'], 72, 520, 1235, 840)
            spoken0 = l['start'] + (0.62 if l.get('count') is not None else 0.0)
            tb.schedule(spoken0, max(spoken0 + 0.3, l['end'] - 0.35))
            self.caps.append((l, tb, l['start'], nxt))
        self.counts = [(l['count'], l['start'], (lines[i + 1]['start'] if i + 1 < len(lines) else tl['total'])) for i, l in enumerate(lines) if l.get('count') is not None]

    def render(self, t):
        cv = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        hook_end = self.hook_end
        if t < hook_end:
            a = 1.0 - max(0.0, (t - (hook_end - 0.25)) / 0.25)
            bb = self.title.bbox
            pill(cv, (bb[0] - 30, bb[1] - 34, bb[2] + 30, bb[3] + 30), radius=34, fill=(0, 0, 0, int(95 * a)))
            self.title.draw(cv, t, alpha=a, anim=False)
        else:
            a = min(1.0, (t - hook_end) / 0.3)
            pill(cv, self.header_box, fill=(0, 0, 0, int(105 * a)))
            self.header.draw(cv, t, alpha=a, anim=False)
        for num, t0, t1 in self.counts:
            if t0 <= t < t1:
                pop = min(1.0, (t - t0) / 0.22)
                prog = (t - t0) / max(0.1, t1 - t0)
                badge(cv, 540, 455, num, prog, pop)
        for l, tb, t0, t1 in self.caps:
            if t0 <= t < t1:
                fade = 1.0 - max(0.0, (t - (t1 - 0.12)) / 0.12)
                tb.draw(cv, t, alpha=fade)
        return cv

# ------------------------------------------------------------------ audio synthesis
rs = np.random.RandomState(7)
def tsec(d): return np.arange(int(d * SR)) / SR
def env_ad(n, a, d):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    nd = max(1, int(d * SR)); e[-nd:] *= np.linspace(1, 0, nd) ** 1.5; return e
def bandnoise(n, lo, hi, order=2):
    x = rs.randn(n)
    sos = signal.butter(order, [lo / (SR / 2), min(hi / (SR / 2), 0.99)], btype='band', output='sos')
    return signal.sosfilt(sos, x)
def lowpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f / (SR / 2), btype='low', output='sos'), x)
def highpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f / (SR / 2), btype='high', output='sos'), x)
def norm(x, peak=1.0):
    m = np.max(np.abs(x)) + 1e-9; return x / m * peak
def sweep_filter_noise(d, f0, f1, q=2.0):
    n = int(d * SR); x = rs.randn(n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        k = i / max(1, n - 1); f = f0 * (f1 / f0) ** k
        bw = f / q; lo, hi = max(30, f - bw / 2), min(SR / 2 * 0.95, f + bw / 2)
        sos = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], btype='band', output='sos')
        out[i:i + blk] = signal.sosfilt(sos, x[i:i + blk])
    return out

def s_whoosh(d):
    n = int(d * SR); x = sweep_filter_noise(d, 2500, 300, 1.4)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2.2
    return norm(x * e) * 0.8
def s_reverse(d):
    return s_whoosh(d)[::-1] * 0.9
def s_riser(d):
    n = int(d * SR); x = sweep_filter_noise(d, 300, 5000, 2.0); t = tsec(d)[:n]
    tone = np.sin(2 * np.pi * (110 * t + 300 * t ** 2 / d)) * 0.25
    e = np.linspace(0, 1, n) ** 2.5
    return norm((x + tone) * e) * 0.6
def s_shimmer(d):
    n = int(d * SR); out = np.zeros(n); t = tsec(d)[:n]
    for k in range(34):
        f = 2200 * 2 ** (rs.rand() * 2.2); st = int(rs.rand() * 0.35 * n)
        e = np.exp(-(t[: n - st]) * (5 + rs.rand() * 6))
        out[st:] += np.sin(2 * np.pi * f * t[: n - st] + rs.rand() * 6) * e * (0.3 + rs.rand() * 0.7)
    return norm(out) * 0.45
def s_glassbreak(d):
    n = int(d * SR); t = tsec(d)[:n]; out = bandnoise(n, 2500, 12000) * np.exp(-t * 9) * 0.6
    for k in range(60):
        st = int((rs.rand() ** 1.6) * 0.8 * n); f = 3000 + rs.rand() * 6000; ln = int(0.05 * SR)
        seg = np.sin(2 * np.pi * f * t[:ln]) * np.exp(-t[:ln] * 70)
        out[st:st + ln] += seg[: len(out[st:st + ln])] * (0.2 + rs.rand() * 0.5)
    return norm(out) * 0.55
def s_wind(d):
    n = int(d * SR); t = tsec(d)[:n]; x = lowpass(rs.randn(n), 900) + 0.4 * bandnoise(n, 900, 3000)
    mod = 0.55 + 0.45 * np.sin(2 * np.pi * 0.35 * t + 1) * np.sin(2 * np.pi * 0.13 * t + 2)
    return norm(x * mod * env_ad(n, 0.6, 0.8)) * 0.55
def s_paper(d):
    n = int(d * SR); out = np.zeros(n)
    for k in range(int(d * 45)):
        st = int(rs.rand() * n); ln = int((0.015 + rs.rand() * 0.06) * SR)
        b = bandnoise(ln, 1800, 7000) * np.hanning(ln)
        out[st:st + ln] += b[: len(out[st:st + ln])] * (0.3 + rs.rand())
    return norm(out * env_ad(n, 0.3, 0.6)) * 0.35
def s_roar(d):
    n = int(d * SR); t = tsec(d)[:n]; x = lowpass(np.cumsum(rs.randn(n)) * 0.02, 400) + 0.25 * bandnoise(n, 400, 1800)
    x = highpass(x, 35)
    return norm(x * (0.85 + 0.15 * np.sin(2 * np.pi * 0.5 * t)) * env_ad(n, 0.4, 0.6)) * 0.5
def s_splash(d):
    n = int(d * SR); t = tsec(d)[:n]
    out = bandnoise(n, 300, 5000) * np.exp(-t * 5) * 0.8 + lowpass(rs.randn(n), 250) * np.exp(-t * 12) * 0.8
    for k in range(40):
        st = int((0.05 + rs.rand() * 0.7) * SR); f = 900 + rs.rand() * 2500; ln = int(0.04 * SR)
        if st + ln < n:
            out[st:st + ln] += np.sin(2 * np.pi * (f + 4000 * t[:ln]) * t[:ln]) * np.exp(-t[:ln] * 90) * 0.25
    return norm(out) * 0.7
def s_underwater(d):
    n = int(d * SR); t = tsec(d)[:n]; x = lowpass(rs.randn(n), 220) * 2.5
    hum = np.sin(2 * np.pi * 48 * t) * 0.25
    out = x + hum
    for k in range(int(d * 4)):
        st = int(rs.rand() * n); ln = int(0.08 * SR); f = 300 + rs.rand() * 500
        if st + ln < n:
            out[st:st + ln] += np.sin(2 * np.pi * (f + 2500 * t[:ln]) * t[:ln]) * np.exp(-t[:ln] * 40) * 0.25
    return norm(out * env_ad(n, 0.4, 0.5)) * 0.55
def s_powerdown(d):
    n = int(d * SR); t = tsec(d)[:n]; f = 520 * (40 / 520) ** (t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    x = lowpass(saw, 1500) * np.exp(-t * 1.2)
    return norm(x) * 0.5
def s_boom(d=1.6):
    n = int(d * SR); t = tsec(d)[:n]; f = 62 * (34 / 62) ** (t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 2.4) + bandnoise(n, 60, 900) * np.exp(-t * 30) * 0.5
    return norm(x) * 0.9
def s_tick(d=0.05):
    n = int(d * SR); t = tsec(d)[:n]
    return norm(bandnoise(n, 2500, 9000) * np.exp(-t * 180)) * 0.35
def s_cut(d):
    return s_whoosh(min(d, 0.45)) * 0.45
def s_thud(d):
    n = int(d * SR); t = tsec(d)[:n]
    x = np.sin(2 * np.pi * 70 * t * np.exp(-t * 3)) * np.exp(-t * 9) + lowpass(rs.randn(n), 500) * np.exp(-t * 25) * 0.6
    return norm(x) * 0.7
def s_clatter(d):
    n = int(d * SR); out = np.zeros(n); t = tsec(d)[:n]
    for k in range(int(28 * d)):
        st = int((rs.rand() ** 1.3) * n * 0.85); f = 1800 + rs.rand() * 4500; ln = int(0.06 * SR)
        seg = (np.sin(2 * np.pi * f * t[:ln]) + 0.6 * np.sin(2 * np.pi * f * 1.51 * t[:ln])) * np.exp(-t[:ln] * (60 + rs.rand() * 60))
        out[st:st + ln] += seg[: len(out[st:st + ln])] * (0.3 + rs.rand() * 0.7)
    return norm(out) * 0.5
def s_screech(d):
    n = int(d * SR); t = tsec(d)[:n]
    x = bandnoise(n, 2200, 4200, 4) * (0.6 + 0.4 * np.sin(2 * np.pi * 13 * t)) + bandnoise(n, 300, 1200) * 0.5
    sparks = np.zeros(n)
    for k in range(int(d * 30)):
        st = int(rs.rand() * n); ln = int(0.01 * SR)
        sparks[st:st + ln] += rs.randn(len(sparks[st:st + ln])) * 0.5
    return norm((x + highpass(sparks, 3000)) * env_ad(n, 0.05, 1.2)) * 0.45
def s_crash(d):
    n = int(d * SR); t = tsec(d)[:n]
    x = lowpass(rs.randn(n), 1800) * np.exp(-t * 4) + bandnoise(n, 1500, 6000) * np.exp(-t * 7) * 0.4
    for k in range(10):
        st = int(rs.rand() * 0.6 * n); x[st:] += s_thud(d)[: n - st] * 0.4 * rs.rand()
    return norm(x) * 0.75
def s_crumble(d):
    n = int(d * SR); out = np.zeros(n); t = tsec(d)[:n]
    for k in range(int(d * 220)):
        st = int((rs.rand() ** 1.2) * n * 0.9); ln = int((0.004 + rs.rand() * 0.02) * SR)
        b = bandnoise(ln + 64, 500, 5000)[:ln] * np.hanning(ln)
        out[st:st + ln] += b[: len(out[st:st + ln])] * (0.3 + rs.rand())
    out += lowpass(rs.randn(n), 300) * np.exp(-t * 2) * 0.4
    return norm(out * env_ad(n, 0.05, 1.0)) * 0.55
def s_peel(d):
    n = int(d * SR); t = tsec(d)[:n]
    x = bandnoise(n, 900, 5000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * t))) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return norm(x) * 0.4
def s_tiles(d):
    n = int(d * SR); out = np.zeros(n); t = tsec(d)[:n]
    for k in range(int(d * 14)):
        st = int((0.1 + rs.rand() * 0.8) * n * 0.9); ln = int(0.25 * SR)
        f = 1300 + rs.rand() * 2500
        seg = (np.sin(2 * np.pi * f * t[:ln]) * 0.5 + bandnoise(ln, 1500, 8000)) * np.exp(-t[:ln] * 22)
        out[st:st + ln] += seg[: len(out[st:st + ln])] * (0.3 + rs.rand() * 0.7)
    return norm(out) * 0.6
def s_room(d):
    n = int(d * SR); t = tsec(d)[:n]
    return norm(lowpass(rs.randn(n), 180) * 0.6 + np.sin(2 * np.pi * 50 * t) * 0.02) * 0.12

def s_ping(d=0.7):
    t = tsec(d); out = np.zeros(len(t))
    for i, (f, t0) in enumerate([(1318.5, 0.0), (1760.0, 0.11)]):
        st = int(t0 * SR); tt = t[: len(t) - st]
        out[st:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) * np.minimum(1, tt / 0.003)
    return norm(out) * 0.5
def s_sting(d=1.6):
    t = tsec(d)
    x = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(523.25, 0.5), (659.25, 0.4), (783.99, 0.35), (1046.5, 0.3), (1568.0, 0.15)])
    return norm(x * np.minimum(1, t / 0.02) * np.exp(-t * 1.8) + s_shimmer(d) * 0.5) * 0.6
SFX = {'ping': s_ping, 'sting': s_sting, 'whoosh': s_whoosh, 'reverse': s_reverse, 'riser': s_riser, 'shimmer': s_shimmer, 'glassbreak': s_glassbreak,
       'splash': s_splash, 'powerdown': s_powerdown, 'cut': s_cut, 'thud': s_thud, 'clatter': s_clatter, 'screech': s_screech,
       'crash': s_crash, 'crumble': s_crumble, 'peel': s_peel, 'tiles': s_tiles}
SPANS = {'wind': s_wind, 'paper': s_paper, 'roar': s_roar, 'underwater': s_underwater, 'room': s_room}
GAIN = {'ping': 0.45, 'sting': 0.45, 'whoosh': 0.5, 'reverse': 0.5, 'riser': 0.22, 'shimmer': 0.35, 'glassbreak': 0.45, 'splash': 0.6, 'powerdown': 0.45, 'cut': 0.3,
        'thud': 0.6, 'clatter': 0.5, 'screech': 0.35, 'crash': 0.6, 'crumble': 0.5, 'peel': 0.4, 'tiles': 0.5,
        'wind': 0.35, 'paper': 0.3, 'roar': 0.28, 'underwater': 0.4, 'room': 0.5}

def pluck(f, d=0.5, dec=9.0):
    t = tsec(d); e = np.exp(-t * dec) * np.minimum(1, t / 0.003)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + 0.1 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 12)) * e

def chime(d=1.4):
    t = tsec(d)
    return (np.sin(2 * np.pi * 1046.5 * t) * 0.6 + np.sin(2 * np.pi * 1568.0 * t) * 0.35 + np.sin(2 * np.pi * 2093.0 * t) * 0.15) * np.exp(-t * 3.2) * np.minimum(1, t / 0.004)

def soft_kick(d=0.3):
    t = tsec(d); f = 110 * (45 / 110) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)

def music_bed(total, counts):
    """Friendly explainer bed: major key (C G Am F), plucked arpeggio, soft bass; light kick + hats during the countdown."""
    n = int(total * SR); out = np.zeros(n); beat = 0.6
    nf = lambda m: 440.0 * 2 ** ((m - 69) / 12)
    chords = [(48, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [60, 64, 69, 72]), (41, [60, 65, 69, 72])]
    def add(x, t0, g):
        st = int(t0 * SR)
        if st >= n: return
        seg = x[: n - st]; out[st:st + len(seg)] += seg * g
    k = 0; t = 0.0
    while t < total:
        root, tones = chords[(k // 8) % 4]
        add(pluck(nf(tones[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]]), 0.55, 8.0), t, 0.16)
        if k % 4 == 0: add(pluck(nf(root), 1.2, 3.2), t, 0.22)
        k += 1; t += beat / 2
    pad = np.zeros(n); tt = np.arange(n) / SR
    for i in range(int(total / (beat * 4)) + 1):
        root, tones = chords[i % 4]; st, en = int(i * beat * 4 * SR), min(n, int((i + 1) * beat * 4 * SR))
        if st >= n: break
        seg_t = tt[: en - st]
        pad[st:en] += sum(np.sin(2 * np.pi * nf(m) * seg_t) for m in tones[:3]) * np.minimum(1, seg_t / 0.4) * np.minimum(1, (seg_t[-1] - seg_t) / 0.3 + 0.01)
    out += lowpass(pad, 2500) * 0.035
    for num, t0, t1 in counts:
        add(chime(), t0, 0.22 if num > 0 else 0.3)
        add(soft_kick(), t0, 0.35)
        if num > 0:
            b = t0
            while b < t1 - 0.05:
                add(soft_kick(), b, 0.22); add(s_tick(0.04), b + beat / 2, 0.25); b += beat
    fade = np.minimum(1, tt / 0.4) * np.minimum(1, (total - tt) / 1.2)
    return out * np.clip(fade, 0, 1)

def process_voice(voice):
    """Warm narrator chain: EQ + de-ess + gentle compression (ffmpeg), then a subtle small-room reverb."""
    import tempfile
    d = tempfile.mkdtemp()
    pin, pout = os.path.join(d, 'v_in.wav'), os.path.join(d, 'v_out.wav')
    import wave
    with wave.open(pin, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(voice, -1, 1) * 32767).astype(np.int16).tobytes())
    chain = ('highpass=f=90,equalizer=f=260:t=q:w=1.0:g=-2.5,'
             'equalizer=f=3500:t=q:w=1.0:g=3,highshelf=f=8000:g=2.5,deesser=i=0.3,'
             'acompressor=threshold=0.1:ratio=2.5:attack=6:release=110:makeup=1.3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pin, '-af', chain, '-ar', str(SR), '-ac', '1', pout], check=True)
    sr, v = read_wav(pout)
    v = np.concatenate([v, np.zeros(max(0, len(voice) - len(v)))])[:len(voice)]
    # small-room reverb: pre-delay 15 ms, RT60 ~0.45 s, darker tail
    r = np.random.RandomState(3); n = int(0.6 * SR); t = np.arange(n) / SR
    ir = r.randn(n) * np.exp(-t * 6.91 / 0.28); ir = lowpass(ir, 6000); ir[: int(0.012 * SR)] = 0
    wet = signal.fftconvolve(v, ir)[:len(v)]
    wet *= (np.sqrt(np.mean(v ** 2)) + 1e-9) / (np.sqrt(np.mean(wet ** 2)) + 1e-9) * 0.07
    return v + wet

def build_audio(vid, tl, novo=False):
    total = tl['total'] + 0.2
    n = int(total * SR)
    voice = np.zeros(n)
    if not novo:
        for l in tl['lines']:
            wpath = os.path.join(ROOT, 'work', vid, f"{VO_PREFIX}_{l['id']}.wav") if VO_PREFIX else l['wav']
            sr, x = read_wav(wpath)
            x = signal.resample_poly(x, SR // 1000, sr // 1000) if sr != SR else x
            x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * 0.12
            st = int(l['start'] * SR); voice[st:st + len(x)] += x[: len(voice[st:st + len(x)])]
        if CLEAN_VOICE:
            voice = highpass(voice, 70)
        else:
            voice = process_voice(voice)
    counts = [(l['count'], l['start'], (tl['lines'][i + 1]['start'] if i + 1 < len(tl['lines']) else tl['total'])) for i, l in enumerate(tl['lines']) if l.get('count') is not None]
    music = music_bed(total, counts)
    fx = np.zeros(n)
    for ev in CFG[vid]['sfx'](tl):
        name, a, b = ev
        if name in SPANS:
            d = max(0.2, b - a); x = SPANS[name](d)
        else:
            x = SFX[name](b)
        st = int(max(0, a) * SR); seg = x[: len(fx[st:st + len(x)])]
        fx[st:st + len(seg)] += seg * GAIN[name]
    # duck music + fx under voice
    venv = np.abs(signal.hilbert(voice)) if not novo else np.zeros(n)
    venv = lowpass(venv, 6)
    duck = 1.0 - 0.55 * np.clip(venv / 0.08, 0, 1)
    mix_m = music * duck * 0.55 + fx * (0.75 + 0.25 * duck)
    L_ = voice + mix_m
    # gentle stereo: delay fx/music a little on the right
    dly = int(0.012 * SR)
    R_ = voice + np.concatenate([np.zeros(dly), mix_m[:-dly]])
    st = np.stack([L_, R_], 1)
    st = np.tanh(st * 1.6) / np.tanh(1.6)  # soft limiter
    st = st / (np.max(np.abs(st)) + 1e-9) * 0.89
    return st

def read_wav(p):
    import wave
    with wave.open(p) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0
        if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    return sr, x

def write_wav(p, st):
    import wave
    d = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(p, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())

# ------------------------------------------------------------------ main
def main():
    args = sys.argv[1:]
    vid = args[0]
    opt = lambda k, d=None: args[args.index(k) + 1] if k in args else d
    tl = json.load(open(os.path.join(ROOT, 'work', vid, 'timeline.json')))
    global FPS
    FPS = tl.get('fps', 30)
    global VO_PREFIX, CLEAN_VOICE
    VO_PREFIX = opt('--vo', None)
    CLEAN_VOICE = '--clean' in args
    raw = opt('--raw', os.path.join(ROOT, 'work', vid, 'raw720.mp4'))
    novo = '--novo' in args
    out = opt('--out', os.path.join(ROOT, 'out', f"{vid}{'_ohne_stimme' if novo else ''}.mp4"))
    if '--stills' in args:
        ov = Overlay(vid, tl)
        os.makedirs(os.path.join(ROOT, 'work', vid, 'post_stills'), exist_ok=True)
        for s in opt('--stills').split(','):
            t = float(s)
            if os.path.exists(raw):
                fr = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', raw, '-frames:v', '1', '-vf', f'scale={W}:{H}:flags=lanczos', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
                bg = Image.frombytes('RGB', (W, H), fr).convert('RGBA') if len(fr) == W * H * 3 else Image.new('RGBA', (W, H), (90, 100, 110, 255))
            else:
                bg = Image.new('RGBA', (W, H), (90, 100, 110, 255))
            img = Image.alpha_composite(bg, ov.render(t)).convert('RGB')
            p = os.path.join(ROOT, 'work', vid, 'post_stills', f'{vid}_{t:06.2f}.jpg'); img.save(p, quality=88); print(p)
        return
    wavp = os.path.join(ROOT, 'work', vid, 'mix_novo.wav' if novo else 'mix.wav')
    mix = build_audio(vid, tl, novo)
    write_wav(wavp, mix)
    # loudness normalize to about -14 LUFS (platform target), keep peaks under -1 dBFS
    meas = subprocess.run(['ffmpeg', '-nostats', '-i', wavp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[0-9.]+) LUFS', meas)
    if m:
        gain = 10 ** ((-14.0 - float(m[-1])) / 20)
        mix = mix * gain
        pk = np.max(np.abs(mix))
        if pk > 0.89: mix = np.tanh(mix / pk * 1.2) / np.tanh(1.2) * 0.89
        write_wav(wavp, mix)
        print('loudness', m[-1], 'LUFS -> gain', round(20 * np.log10(gain), 2), 'dB')
    print('audio', wavp)
    if '--audio-only' in args:
        return
    ov = Overlay(vid, tl)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', raw, '-vf', f'scale={W}:{H}:flags=lanczos,unsharp=5:5:0.55:5:5:0.0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', wavp,
                            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                            '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    fsz = W * H * 3; f = 0
    while True:
        buf = dec.stdout.read(fsz)
        if len(buf) < fsz: break
        t = f / FPS
        img = Image.frombytes('RGB', (W, H), buf).convert('RGBA')
        img = Image.alpha_composite(img, ov.render(t)).convert('RGB')
        enc.stdin.write(img.tobytes()); f += 1
        if f % 150 == 0: print('post frame', f, flush=True)
    enc.stdin.close(); enc.wait(); dec.wait()
    print('done', out, f, 'frames')

if __name__ == '__main__':
    main()
