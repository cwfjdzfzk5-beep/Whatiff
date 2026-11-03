#!/usr/bin/env python3
"""Story-style post-production (no voice, no header/badge layout).
Big word-pop captions, punch-in zooms, flashes, shake, RGB split + slice glitches, whip blur on cuts,
colour grade + grain, a synthesized upbeat beat with drops/tape-stop/record-scratch, and SFX.

Usage:
  python3 post_story.py <id>                    -> out/<id>.mp4
  python3 post_story.py <id> --stills 1,6.2     -> preview frames (with effects) in work/<id>/post_stills
  python3 post_story.py <id> --audio-only       -> work/<id>/mix.wav
"""
import json, os, sys, subprocess, re, math
import numpy as np
from PIL import Image, ImageChops, ImageFont
from scipy import signal
import post as P

ROOT = P.ROOT
W, H, SR = 1080, 1920, 48000
FPS = 30

# ------------------------------------------------------------------ per-video config (video times in seconds)
def cfg_glas3(tl):
    s = lambda i: P.L(tl, i)['start']
    tV, tWS, tDrV, tSpl, tPh, tOff, tR = 6.2, 13.8, 17.8, 18.62, 20.89, 24.1, 26.8
    tDead = s('r3')
    cuts_whip = [s('l1'), s('s2a'), s('s3a'), s('s4a'), s('s5a'), s('r1'), s('cta')]
    cuts_hard = [s('s1a'), s('s3b'), s('ph'), s('r2')]
    fx = {
        'push': [(0.0, s('l1'), 0.0, 0.06)],                        # slow push-in during the hook
        'punch': [(s('s1a'), 0.07), (tV, 0.11), (s('s2a'), 0.06), (s('s2b'), 0.04), (s('s3a'), 0.06), (tWS, 0.08),
                  (s('s3b'), 0.10), (s('s4a'), 0.06), (tDrV, 0.05), (tSpl, 0.06), (s('ph'), 0.05), (tPh, 0.05),
                  (s('s5a'), 0.06), (tOff, 0.05), (tR, 0.09), (s('r2'), 0.05), (s('cta'), 0.04)],
        'hold': [(tDead, s('cta') - 0.03, 0.13)],                     # meme zoom on the punchline
        'flash': [(tV, 0.85), (tWS, 0.5), (tDrV, 0.35), (tR, 0.8), (s('l1'), 0.18), (s('s1a'), 0.25)],
        'dip': [(tOff + 0.05, 0.45, 0.5)],                            # (t, amount, dur) darken
        'shake': [(tV, 0.9, 1.6), (tWS, 0.7, 1.0), (tSpl, 0.6, 0.5), (tR, 0.5, 0.7), (tDead, 0.25, 0.25), (s('s3b'), 0.35, 1.8)],
        'rgb': [(tV, 0.35, 14), (tWS, 0.25, 10), (tR, 0.3, 12), (s('s5a'), 0.15, 8)],
        'glitch': [(tPh, 0.55), (tOff, 0.4)],
        'whip': cuts_whip, 'hard': cuts_hard,
    }
    sfx = [('boom', 0.0, 1.4), ('wind', 0.0, s('l1')), ('whoosh', 0.0, 1.2), ('room', s('l1'), s('s1a') + 1.4),
           ('riser', s('s1a'), tV - s('s1a')), ('boom', tV, 1.6), ('glassbreak', tV + 0.02, 1.2), ('shimmer', tV - 0.05, 1.1), ('whoosh', tV + 0.05, 1.2),
           ('wind', tV + 0.1, s('s3a')), ('paper', tV + 0.4, s('s3a') - 0.1),
           ('roar', s('s3a'), s('s4a')), ('shimmer', tWS - 0.05, 0.8), ('boom', tWS, 1.0), ('flap', tWS + 0.05, s('s4a') - 0.05), ('wind', s('s3b'), s('s4a')),
           ('room', s('s4a'), s('s5a')), ('shimmer', tDrV - 0.05, 0.9), ('splash', tSpl, 1.0), ('splash', tSpl + 0.12, 0.9),
           ('ping', s('ph') + 0.05, 0.7), ('zap', tPh, 0.6), ('powerdown', tPh + 0.1, 0.8),
           ('underwater', s('s5a'), s('r1')), ('powerdown', tOff, 1.4), ('glitch', tOff, 0.45),
           ('rewind', s('r1'), tR - s('r1')), ('boom', tR, 1.4), ('shimmer', tR, 1.0),
           ('room', s('r2'), s('cta') + 0.5), ('scratch', tDead - 0.02, 0.5), ('drip', tDead + 0.5, 0.5), ('drip', tDead + 0.95, 0.5),
           ('whoosh', s('cta') - 0.2, 0.9)]
    for c in cuts_whip:
        if c > 0.5: sfx.append(('cut', c - 0.12, 0.45))
    for l in tl['lines']:
        if l['cap'] and l['id'] not in ('hook', 'cta'): sfx.append(('pop', l['start'] + 0.02, 0.08))
    music = {'drop1': tV, 'stop': tOff, 'drop2': tR, 'scratch': tDead, 'outro': s('cta')}
    title = 'What if *ALL GLASS* disappeared for *5 seconds?*'
    return dict(fx=fx, sfx=sfx, music=music, title=title, title_until=s('l1') - 0.05)

CFG = {'glas3': cfg_glas3}

# ------------------------------------------------------------------ captions
def ease_out_back(k, s=1.9):
    k = min(1.0, max(0.0, k)) - 1
    return 1 + k * k * ((s + 1) * k + s)

def draw_pop(tb, cv, t, alpha=1.0, pop=0.35, dur=0.16):
    for it in tb.items:
        ta = it.get('t', -1e9)
        if t < ta:
            continue
        k = (t - ta) / dur
        sc = (1 + pop) - pop * ease_out_back(k) if k < 1 else 1.0   # big -> settle with a little overshoot
        a = alpha * min(1.0, (t - ta) / 0.05)
        spr = it['spr']
        if abs(sc - 1) > 0.01:
            spr = spr.resize((max(1, int(spr.width * sc)), max(1, int(spr.height * sc))), Image.BILINEAR)
        px = it['pos'][0] - (spr.width - it['spr'].width) // 2
        py = it['pos'][1] - (spr.height - it['spr'].height) // 2
        if a < 0.999:
            arr = np.array(spr); arr[..., 3] = (arr[..., 3].astype(np.float32) * a).astype(np.uint8); spr = Image.fromarray(arr)
        cv.alpha_composite(spr, (max(0, px), max(0, py)))

class Captions:
    def __init__(self, tl, c):
        self.tl = tl
        self.title = P.TextBlock(c['title'], 96, 540, 640, 920, stroke=8)
        self.title.schedule(0.0, 0.0)
        self.title_until = c['title_until']
        self.caps = []
        L = tl['lines']
        for i, l in enumerate(L):
            if not l['cap'] or l['id'] == 'hook':
                continue
            nxt = L[i + 1]['start'] if i + 1 < len(L) else tl['total'] + 5
            if l['id'] == 'cta':
                tb = P.TextBlock(l['cap'], 96, 520, 900, 840, stroke=8)
            else:
                tb = P.TextBlock(l['cap'], 78, 520, 1190, 820, stroke=7)
            n = len(tb.items)
            tb.schedule(l['start'] + 0.03, l['start'] + 0.03 + min(1.5, 0.13 * n))
            self.caps.append((l, tb, l['start'], nxt))

    def render(self, t):
        cv = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        if t < self.title_until:
            a = 1.0 - max(0.0, (t - (self.title_until - 0.15)) / 0.15)
            draw_pop(self.title, cv, t + 10, alpha=a)  # fully visible from frame 0 (thumbnail)
        for l, tb, t0, t1 in self.caps:
            if t0 <= t < t1:
                a = 1.0 - max(0.0, (t - (t1 - 0.06)) / 0.06)
                draw_pop(tb, cv, t, alpha=a)
        return cv

# ------------------------------------------------------------------ video effects
WHITE_IM = Image.new('RGB', (W, H), (255, 255, 255))
BLACK_IM = Image.new('RGB', (W, H), (0, 0, 0))

def smooth_noise(t, seed, hz=9.0):
    # sum of sines with incommensurate frequencies -> smooth pseudo-random in [-1, 1]
    r = np.random.RandomState(seed)
    f = r.uniform(0.6, 1.4, 3) * hz; ph = r.uniform(0, 6.28, 3)
    return float(np.sum(np.sin(2 * np.pi * f * t + ph)) / 2.2)

class FX:
    def __init__(self, fx):
        self.fx = fx

    def zoom(self, t):
        z = 1.0
        for a, b, z0, z1 in self.fx.get('push', []):
            if a <= t < b: z += z0 + (z1 - z0) * (t - a) / (b - a)
        for tc, amp in self.fx.get('punch', []):
            d = t - tc
            if 0 <= d < 0.6: z += amp * min(1.0, d / 0.04) * math.exp(-d / 0.16)
        for a, b, amp in self.fx.get('hold', []):
            if a <= t < b: z += amp * (1 - math.exp(-(t - a) / 0.06))
        return z

    def shake(self, t):
        sx = sy = 0.0
        for tc, amp, dur in self.fx.get('shake', []):
            d = t - tc
            if 0 <= d < dur:
                k = amp * (1 - d / dur) ** 1.5 * 28
                sx += k * smooth_noise(t, int(tc * 100), 11); sy += k * smooth_noise(t, int(tc * 100) + 1, 13)
        return sx, sy

    def whip(self, t):
        # horizontal blur in px, peaks at the cut
        L = 0.0
        for c in self.fx.get('whip', []):
            d = t - c
            if -0.12 < d < 0.14: L = max(L, 150 * math.exp(-(d / 0.06) ** 2))
        return L

    def apply(self, im, t, fidx):
        # 1) zoom + shake via a sub-pixel crop
        z = self.zoom(t); sx, sy = self.shake(t)
        need = max(z, 1.0 + 2.2 * abs(sx) / W + 0.002 if sx else 1.0, 1.0 + 2.2 * abs(sy) / H + 0.002 if sy else 1.0)
        if need > 1.0005:
            cw, ch = W / need, H / need
            cx, cy = W / 2 + sx, H / 2 + sy
            im = im.resize((W, H), Image.BILINEAR, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))
        # 2) whip blur
        L = self.whip(t)
        if L > 6:
            k = int(L)
            im = im.resize((max(8, W // max(1, k // 6)), H), Image.BOX).resize((W, H), Image.BILINEAR)
        # 3) RGB split / glitch slices
        rgb = 0.0
        for tc, dur, px in self.fx.get('rgb', []):
            d = t - tc
            if 0 <= d < dur: rgb = max(rgb, px * (1 - d / dur))
        gl = 0.0
        for tc, dur in self.fx.get('glitch', []):
            d = t - tc
            if 0 <= d < dur: gl = max(gl, 1 - d / dur)
        if gl > 0:
            rgb = max(rgb, 6 + 14 * gl)
        if rgb >= 1:
            r, g, b = im.split()
            o = int(round(rgb))
            im = Image.merge('RGB', (ImageChops.offset(r, o, 0), g, ImageChops.offset(b, -o, int(o * 0.3))))
        if gl > 0:
            rs = np.random.RandomState(fidx * 7 + 1)
            if rs.rand() < 0.85:
                for _ in range(int(3 + 6 * gl)):
                    y0 = int(rs.rand() * (H - 40)); hh = int(12 + rs.rand() * 110 * gl)
                    band = im.crop((0, y0, W, min(H, y0 + hh)))
                    band = ImageChops.offset(band, int((rs.rand() - 0.5) * 220 * gl), 0)
                    if rs.rand() < 0.25:
                        band = ImageChops.invert(band) if rs.rand() < 0.4 else Image.eval(band, lambda v: min(255, v + 60))
                    im.paste(band, (0, y0))
        # 4) flash / dip
        fl = 0.0
        for tc, amp in self.fx.get('flash', []):
            d = t - tc
            if -0.035 <= d < 0.5: fl = max(fl, amp * (min(1.0, (d + 0.035) / 0.035)) * math.exp(-max(0, d) / 0.11))
        if fl > 0.01:
            im = Image.blend(im, WHITE_IM, min(0.95, fl))
        dp = 0.0
        for tc, amp, dur in self.fx.get('dip', []):
            d = t - tc
            if 0 <= d < dur: dp = max(dp, amp * math.sin(math.pi * d / dur))
        if dp > 0.01:
            im = Image.blend(im, BLACK_IM, dp)
        return im

# ------------------------------------------------------------------ audio: extra SFX
tsec, bandnoise, lowpass, highpass, norm = P.tsec, P.bandnoise, P.lowpass, P.highpass, P.norm
rs = np.random.RandomState(11)

def s_flap(d):
    n = int(d * SR); t = tsec(d)[:n]
    x = bandnoise(n, 200, 2500) * (0.45 + 0.55 * np.abs(np.sin(2 * np.pi * 14 * t + np.sin(2 * np.pi * 3 * t)))) ** 2
    return norm(x * P.env_ad(n, 0.05, 0.4)) * 0.5
def s_zap(d):
    n = int(d * SR); t = tsec(d)[:n]
    f = 1800 * np.exp(-t * 7) + 120
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + bandnoise(n, 2000, 9000) * 0.6
    gate = (np.sin(2 * np.pi * 37 * t) > -0.2).astype(float)
    return norm(x * gate * np.exp(-t * 5)) * 0.45
def s_glitch(d):
    n = int(d * SR); out = np.zeros(n); i = 0
    while i < n:
        ln = int((0.01 + rs.rand() * 0.05) * SR)
        f = 200 + rs.rand() * 3000
        tt = np.arange(ln) / SR
        seg = np.sign(np.sin(2 * np.pi * f * tt)) * (0.3 + rs.rand() * 0.7) if rs.rand() < 0.6 else rs.randn(ln) * 0.5
        out[i:i + ln] = seg[: len(out[i:i + ln])]
        i += ln + int(rs.rand() * 0.02 * SR)
    return norm(highpass(out, 150)) * 0.4
def s_scratch(d):
    n = int(d * SR); t = tsec(d)[:n]
    # record scratch: noise through a band whose centre wobbles fast, pitch slide down
    x = np.zeros(n); blk = 256
    src = rs.randn(n)
    for i in range(0, n, blk):
        k = i / n; fc = 2600 * (1 - 0.7 * k) * (1 + 0.5 * np.sin(2 * np.pi * 9 * i / SR))
        sos = signal.butter(2, [max(80, fc * 0.6) / (SR / 2), min(0.95, fc * 1.4 / (SR / 2))], btype='band', output='sos')
        x[i:i + blk] = signal.sosfilt(sos, src[i:i + blk])
    return norm(x * P.env_ad(n, 0.01, 0.25)) * 0.6
def s_drip(d):
    t = tsec(d); f = 900 + 1400 * (1 - np.exp(-t * 30))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28) * np.minimum(1, t / 0.002)
    return norm(x) * 0.5
def s_pop(d):
    t = tsec(d); f = 700 * np.exp(-t * 25) + 250
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45) * np.minimum(1, t / 0.002)) * 0.5
def s_rewind(d):
    n = int(d * SR); t = tsec(d)[:n]
    x = P.sweep_filter_noise(d, 300, 6000, 2.5) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * (6 + 18 * t / d) * t)))
    return norm(x * np.linspace(0.2, 1, n) ** 2) * 0.55
def s_boom(d):
    return P.s_boom(d)

SFX = dict(P.SFX); SFX.update({'zap': s_zap, 'glitch': s_glitch, 'scratch': s_scratch, 'drip': s_drip, 'pop': s_pop, 'rewind': s_rewind, 'boom': s_boom})
SPANS = dict(P.SPANS); SPANS.update({'flap': s_flap})
GAIN = dict(P.GAIN); GAIN.update({'zap': 0.45, 'glitch': 0.4, 'scratch': 0.65, 'drip': 0.5, 'pop': 0.16, 'rewind': 0.5, 'boom': 0.75, 'flap': 0.55,
                                  'wind': 0.6, 'paper': 0.55, 'roar': 0.3, 'room': 0.45, 'underwater': 0.6, 'shimmer': 0.5, 'glassbreak': 0.55,
                                  'splash': 0.9, 'riser': 0.5, 'cut': 0.36, 'whoosh': 0.55})

# ------------------------------------------------------------------ audio: music
nf = lambda m: 440.0 * 2 ** ((m - 69) / 12)
def saw(f, d, detune=(0.0,)):
    t = tsec(d); out = np.zeros(len(t))
    for c in detune:
        ff = f * 2 ** (c / 1200); K = int(min(40, 9000 / ff))
        for k in range(1, K + 1):
            out += np.sin(2 * np.pi * k * ff * t + k * 0.7) / k
    return out / len(detune)
def kick(d=0.34):
    t = tsec(d); f = 46 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) + bandnoise(len(t), 1500, 7000) * np.exp(-t * 320) * 0.35
def clap(d=0.28):
    t = tsec(d); n = len(t); out = np.zeros(n); src = bandnoise(n, 900, 4500)
    for o in (0.0, 0.011, 0.023):
        st = int(o * SR); e = np.exp(-(t[: n - st]) * 70); out[st:] += src[: n - st] * e * 0.6
    out += src * np.exp(-t * 16) * 0.35
    return out
def hat(d=0.05, op=False):
    t = tsec(d); return highpass(rs.randn(len(t)), 7000) * np.exp(-t * (18 if op else 95))
_cache = {}
def cached(fn):
    def w(*a):
        k = (fn.__name__,) + tuple(tuple(x) if isinstance(x, list) else round(x, 4) if isinstance(x, float) else x for x in a)
        if k not in _cache: _cache[k] = fn(*a)
        return _cache[k]
    return w
@cached
def stab(midis, d=0.24):
    t = tsec(d); x = sum(saw(nf(m), d, (-9, 9)) for m in midis) / len(midis)
    x = lowpass(x, 3200); return x * np.exp(-t * 9) * np.minimum(1, t / 0.004)
@cached
def pad(midis, d):
    t = tsec(d); x = sum(saw(nf(m), d, (-7, 0, 7)) for m in midis) / len(midis)
    x = lowpass(x, 850); return x * np.minimum(1, t / 0.12) * np.minimum(1, (d - t) / 0.35 + 1e-3)
@cached
def bassnote(m, d):
    t = tsec(d); f = nf(m)
    x = lowpass(saw(f, d), 380) * 0.7 + np.sin(2 * np.pi * f * t) * 0.6
    return x * np.minimum(1, t / 0.006) * np.minimum(1, (d - t) / 0.02 + 1e-3)
def crash(d=1.6):
    t = tsec(d); return highpass(rs.randn(len(t)), 4000) * np.exp(-t * 2.6) * 0.8

PROG = [(45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]  # Am F C G

def music(total, m, cuts):
    n = int(total * SR)
    drums, synth, sc = np.zeros(n), np.zeros(n), np.ones(n)
    def put(buf, x, t0, g):
        st = int(t0 * SR)
        if st >= n or st + len(x) <= 0: return
        if st < 0: x = x[-st:]; st = 0
        seg = x[: n - st]; buf[st:st + len(seg)] += seg * g
    def duck(t0):
        st = int(t0 * SR); ln = int(0.22 * SR)
        if st >= n: return
        e = 1 - 0.65 * np.exp(-np.arange(ln) / SR / 0.07)
        sc[st:st + ln] = np.minimum(sc[st:st + ln], e[: len(sc[st:st + ln])])
    B = m['drop1'] / 12.0
    K, CL, HT, HO = kick(), clap(), hat(), hat(0.2, True)
    # --- intro (0 .. drop1): filtered chords, then kick + hats, then build
    for i in range(12):
        tb = i * B; root, ch = PROG[(i // 4) % 4]
        if i % 4 == 0: put(synth, pad(ch, B * 4.1), tb, 0.8)
        if i < 11 and not (i == 10): put(drums, K, tb, 0.75); duck(tb)
        if i < 10: put(synth, bassnote(root, B * 0.45), tb + B / 2, 0.4)
        if i >= 2: put(drums, hat(), tb + B / 2, 0.18)
        if i >= 6 and i % 2 == 1: put(drums, CL, tb, 0.3)
    for j in range(12):                                                # snare roll into the drop
        tb = 9 * B + j * (3 * B / 12)
        if tb < m['drop1'] - 0.05: put(drums, CL, tb, 0.12 + 0.3 * j / 12)
    # --- grooves
    def groove(t0, t1, gain=1.0, arp=True):
        i = 0
        while True:
            tb = t0 + i * B
            if tb >= t1 - 0.01: break
            root, ch = PROG[(i // 4) % 4]
            put(drums, K, tb, 0.9 * gain); duck(tb)
            if i % 2 == 1: put(drums, CL, tb, 0.42 * gain)
            put(drums, HO if i % 4 == 3 else HT, tb + B / 2, 0.2 * gain)
            put(drums, HT, tb + B / 4, 0.07 * gain); put(drums, HT, tb + 3 * B / 4, 0.09 * gain)
            put(synth, bassnote(root, B * 0.45), tb + B / 2, 0.55 * gain)
            put(synth, bassnote(root, B * 0.3), tb, 0.3 * gain)
            put(synth, stab(ch), tb + B / 2, 0.42 * gain)
            if arp:
                for k in range(2):
                    put(synth, P.pluck(nf(ch[[3, 1, 2, 1][(i * 2 + k) % 4]] + 12), 0.35, 10), tb + k * B / 2, 0.1 * gain)
            i += 1
    groove(m['drop1'], m['stop'] + 0.6)
    put(drums, crash(), m['drop1'], 0.35)
    for c in cuts:
        if m['drop1'] < c < m['stop']: put(drums, crash(1.0), c, 0.18)
    groove(m['drop2'], m['scratch'])
    put(drums, crash(), m['drop2'], 0.35)
    groove(m['outro'], total, gain=0.75, arp=False)
    mix = drums + synth * sc
    # tape-stop at "offline": the next 0.6 s slow down to a halt, then silence until drop2
    a, b = int(m['stop'] * SR), int((m['stop'] + 0.6) * SR)
    seg = mix[a:b + int(0.6 * SR)].copy(); ln = b - a
    speed = np.linspace(1, 0, ln) ** 1.3
    pos = np.cumsum(speed); idx = np.clip(pos.astype(int), 0, len(seg) - 1)
    mix[a:b] = seg[idx] * np.linspace(1, 0.2, ln); mix[b:int(m['drop2'] * SR)] = 0
    # hard stop at the punchline; outro fades in
    s0 = int(m['scratch'] * SR); s1 = int(m['outro'] * SR)
    mix[s0:s1] = 0
    tt = np.arange(n) / SR
    mix *= np.clip(np.minimum(1, (total - tt) / 1.4), 0, 1)
    return mix

# ------------------------------------------------------------------ build
def build_audio(vid, tl, c):
    total = tl['total'] + 0.2; n = int(total * SR)
    cuts = c['fx']['whip'] + c['fx']['hard']
    mus = music(total, c['music'], cuts)
    fx = np.zeros(n)
    for name, a, b in c['sfx']:
        x = SPANS[name](max(0.2, b - a)) if name in SPANS else SFX[name](b)
        st = int(max(0, a) * SR); seg = x[: len(fx[st:st + len(x)])]
        fx[st:st + len(seg)] += seg * GAIN[name]
    mus = mus / (np.max(np.abs(mus)) + 1e-9)
    mix_l = mus * 0.5 + fx * 0.95
    dly = int(0.011 * SR)
    mix_r = mus * 0.5 + np.concatenate([np.zeros(dly), fx[:-dly]]) * 0.95
    mix_l, mix_r = highpass(mix_l, 28), highpass(mix_r, 28)   # no sub-sonic rumble eating headroom
    st = np.stack([mix_l, mix_r], 1)
    st = np.tanh(st * 1.5) / np.tanh(1.5)
    return st / (np.max(np.abs(st)) + 1e-9) * 0.89

def main():
    args = sys.argv[1:]; vid = args[0]
    opt = lambda k, d=None: args[args.index(k) + 1] if k in args else d
    tl = json.load(open(os.path.join(ROOT, 'work', vid, 'timeline.json')))
    global FPS; FPS = tl.get('fps', 30)
    c = CFG[vid](tl)
    raw = opt('--raw', os.path.join(ROOT, 'work', vid, 'raw720.mp4'))
    out = opt('--out', os.path.join(ROOT, 'out', f'{vid}.mp4'))
    grade = ('scale=1080:1920:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,'
             'eq=contrast=1.07:saturation=1.16:gamma=0.98,'
             'colorbalance=rs=-0.02:bs=0.035:rh=0.035:bh=-0.03,'
             'vignette=angle=0.62,noise=c0s=6:c0f=t+u')
    caps = Captions(tl, c); fxr = FX(c['fx'])
    if '--stills' in args:
        d = os.path.join(ROOT, 'work', vid, 'post_stills'); os.makedirs(d, exist_ok=True)
        for s_ in opt('--stills').split(','):
            t = float(s_); fidx = int(round(t * FPS))
            src = raw
            if opt('--bgdir'):
                import glob
                cands = sorted(glob.glob(os.path.join(opt('--bgdir'), '*.jpg')), key=lambda q: abs(int(re.findall(r'(\d+)\.jpg', q)[0]) - fidx))
                src = cands[0]
            fr = subprocess.run(['ffmpeg', '-v', 'error'] + ([] if src != raw else ['-ss', f'{t:.3f}']) + ['-i', src, '-frames:v', '1', '-vf', grade, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
            im = Image.frombytes('RGB', (W, H), fr) if len(fr) == W * H * 3 else Image.new('RGB', (W, H), (90, 100, 110))
            im = fxr.apply(im, t, fidx).convert('RGBA')
            im = Image.alpha_composite(im, caps.render(t)).convert('RGB')
            p = os.path.join(d, f'{vid}_{t:06.2f}.jpg'); im.save(p, quality=88); print(p)
        return
    wavp = os.path.join(ROOT, 'work', vid, 'mix.wav')
    mix = build_audio(vid, tl, c); P.write_wav(wavp, mix)
    meas = subprocess.run(['ffmpeg', '-nostats', '-i', wavp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    mm = re.findall(r'I:\s+(-?[0-9.]+) LUFS', meas)
    if mm:
        gain = 10 ** ((-14.0 - float(mm[-1])) / 20); mix = mix * gain
        pk = np.max(np.abs(mix))
        if pk > 0.89: mix = np.tanh(mix / pk * 1.2) / np.tanh(1.2) * 0.89
        P.write_wav(wavp, mix); print('loudness', mm[-1], 'LUFS -> gain', round(20 * np.log10(gain), 2), 'dB')
    if '--audio-only' in args:
        return
    os.makedirs(os.path.dirname(out), exist_ok=True)
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', raw, '-vf', grade, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', wavp,
                            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                            '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    fsz = W * H * 3; f = 0
    while True:
        buf = dec.stdout.read(fsz)
        if len(buf) < fsz: break
        t = f / FPS
        im = fxr.apply(Image.frombytes('RGB', (W, H), buf), t, f).convert('RGBA')
        im = Image.alpha_composite(im, caps.render(t)).convert('RGB')
        enc.stdin.write(im.tobytes()); f += 1
        if f % 150 == 0: print('post frame', f, flush=True)
    enc.stdin.close(); enc.wait(); dec.wait()
    print('done', out, f, 'frames')

if __name__ == '__main__':
    main()
