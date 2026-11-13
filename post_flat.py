#!/usr/bin/env python3
"""Post for the flat-2D story videos (timer-app reference style): phrase captions in Anton (uppercase, white,
black outline) at ~60% height, narration, a quiet bed and light SFX.
  python3 post_flat.py <id> [--stills 3,10] [--out out/x.mp4]
"""
import json, os, sys, re, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import post as P, post_story as PS, post_bmw as PB

ROOT = P.ROOT; W, H, SR = 1080, 1920, 48000
F_ANTON = os.path.join(ROOT, 'flat', 'fonts', 'Anton-Regular.ttf')
DISPLAY = [(r"\bnineteen sixty four\b", "1964"), (r"\btwenty two players\b", "22 players"), (r"\bthree hundred tons\b", "300 tons"), (r"\bone inch\b", "1 inch"), (r"\bthirty five thousand feet\b", "35,000 feet"), (r"\bat sixty\b", "at 60"), (r"\btwenty two miles an hour\b", "22 mph"), (r"\btwo hundred thirty miles an hour\b", "230 mph"), (r"\bseven times lighter\b", "7x lighter"), (r"\bone and a half billion\b", "1.5 billion"), (r"\bdoing seventy\b", "doing 70"), (r"\bnineteen hundred years\b", "1900 years"), (r"\bnine percent\b", "9%"), (r"\bthree trillion\b", "3 trillion"), (r"\btwenty tons\b", "20 tons"), (r"\bfifty percent\b", "50%"), (r"\ba hundred meters\b", "100 meters"), (r"\bwifi\b", "Wi-Fi"), (r"\bnineteen eighty nine\b", "1989"), (r"\bnovember eighth\b", "November 8"), (r"\bnovember ninth\b", "November 9"), (r"\bthirty one percent\b", "31%"), (r"\bsix fifty seven p m\b", "6:57 PM"), (r"\beleven p m\b", "11 PM"), (r"\btwo percent\b", "2%"), (r"\bfour k\b", "4K"), (r"\btwenty five years\b", "25 years"),
           (r"\btwo a m\b", "2 AM"), (r"\bthree a m\b", "3 AM"), (r"\bsix a m\b", "6 AM"), (r"\beight a m\b", "8 AM"), (r"\bnine a m\b", "9 AM"), (r"\btwo p m\b", "2 PM"), (r"\bsixteen hour\b", "16-hour"), (r"\bfour kilometers\b", "4 km"), (r"\beight extra hours\b", "8 extra hours"), (r"\beight hours\b", "8 hours"),
           (r"\bfour hundred\b", "400"), (r"\bthree hundred emails\b", "300 emails"), (r"\btwenty twenty seven\b", "2027"), (r"\bten seconds\b", "10 seconds"), (r"\beleven years\b", "11 years"), (r"\bthree hours\b", "3 hours"), (r"\bsix lanes\b", "6 lanes"),
           (r"\bnight one\b", "Night 1"), (r"\bnight three\b", "Night 3"), (r"\bweek one\b", "Week 1"), (r"\bweek two\b", "Week 2"), (r"\bmonth one\b", "Month 1"), (r"\bmonth three\b", "Month 3"), (r"\bmonth six\b", "Month 6"),
           (r"\bday one\b", "Day 1"), (r"\bday two\b", "Day 2"), (r"\bday three\b", "Day 3"), (r"\bday four\b", "Day 4"), (r"\bday five\b", "Day 5"), (r"\bday nine\b", "Day 9"), (r"\bday twenty\b", "Day 20"), (r"\bday thirty\b", "Day 30"),
           (r"three oh seven a m", "3:07 AM"), (r"\bis nineteen\b", "is 19"), (r"\bsixty seconds\b", "60 seconds"), (r"\bsix hours\b", "6 hours"),
           (r"\bis eighteen\b", "is 18"), (r"\bunder twenty six\b", "under 26"), (r"\bunder twenty five\b", "under 25"), (r"\btwenty viewings\b", "20 viewings"), (r"\btwo hundred applicants\b", "200 applicants"), (r"\bline thirteen\b", "Line 13"), (r"\beight a m\b", "8 AM"), (r"\be u\b", "EU"),
           (r"\bis seventeen\b", "is 17"), (r"\bstarts at ten\b", "starts at 10"), (r"\bthirty minutes\b", "30 minutes"), (r"\btwo million\b", "2 million"), (r"\bthirty years\b", "30 years"), (r"\bnine hours\b", "9 hours"),
           (r"\bmonth seven\b", "Month 7"), (r"\bmonth eight\b", "Month 8"), (r"\bmonth nine\b", "Month 9"), (r"\bmonth ten\b", "Month 10"), (r"\bmonth eleven\b", "Month 11"), (r"\bmonth twelve\b", "Month 12"), (r"\btwenty people\b", "20 people"),
           (r"\bseven a m\b", "7 AM"), (r"\beight fifteen\b", "8:15"), (r"\bten a m\b", "10 AM"), (r"\bone p m\b", "1 PM"), (r"\bsix p m\b", "6 PM"), (r"\bforty people\b", "40 people"), (r"\bfour minutes\b", "4 minutes"), (r"\bpart two\b", "Part 2"),
           (r"\bday one\b", "Day 1"), (r"\bday two\b", "Day 2"), (r"\bday three\b", "Day 3"), (r"\bday four\b", "Day 4"), (r"\bday five\b", "Day 5"), (r"part one", "Part 1"), (r"part two", "Part 2"), (r"part three", "Part 3"), (r"eighteen year old", "18-year-old"), (r"day fourteen", "Day 14"), (r"day thirty", "Day 30"), (r"month three", "Month 3"), (r"month six", "Month 6"), (r"three kilometers", "3 km"), (r"at five", "at 5"), (r"for eighteen years", "for 18 years"), (r"turns eighteen", "turns 18"), (r"eleven years old", "11 years old"), (r"three hundred sixty five", "365"), (r"four days", "4 days"), (r"nine years old", "9 years old"), (r"four hours", "4 hours"), (r"three forms", "3 forms"), (r"two stamps", "2 stamps"), (r"ten years old", "10 years old"), (r"ten year old", "10-year-old"), (r"ninety percent", "90%"), (r"ten percent", "10%"), (r"one euro", "€1"),
           (r"three oh seven a m", "3:07 AM"), (r"seven fifty eight", "7:58"), (r"nine fifteen", "9:15"), (r"eleven forty", "11:40"),
           (r"two thirty", "2:30"), (r"on t v", "on TV"), (r"three thousand nine hundred and ninety eight", "3,998"),
           (r"four thousand", "4,000"), (r"\bday six\b", "Day 6"), (r"\bday seven\b", "Day 7"), (r"a hundred and forty meter", "140-meter"),
           (r"thirty-eighth", "38th"), (r"eighty miles per hour", "80 mph"), (r"five seconds", "5 seconds"), (r"second one", "Second 1"), (r"second two", "Second 2"), (r"second three", "Second 3"), (r"second four", "Second 4"), (r"second five", "Second 5"), (r"at six a m", "At 6 AM"), (r"seven twelve", "7:12"), (r"eight thirty", "8:30"), (r"ten o'clock", "10:00"), (r"one fifteen", "1:15"), (r"four o'clock", "4:00"), (r"nine p m", "9 PM"), (r"twenty four hundred", "2,400"), (r"forty one", "41"), (r"\ba i\b", "AI"), (r"\ban AI\b", "an AI")]

STOP = {'a', 'an', 'the', 'to', 'of', 'on', 'at', 'for', 'and', 'your', 'is', 'in', 'from', 'with', 'are', 'was', 'it'}
def _display(text):
    """Apply DISPLAY rules; returns [(word, n_source_tokens)] so captions stay in sync with the voice."""
    for a, b in DISPLAY:
        def rep(m, b=b):
            n = len(re.findall(r"[A-Za-z0-9']+", re.sub(r'\x01[^\x02]*\x02', '', m.group(0))))
            return f"{b.replace(' ', chr(160))}\x01{n:.4f}\x02"
        text = re.sub(a, rep, text, flags=re.I)
    out = []
    for w in text.split(' '):
        if not w: continue
        m = re.search(r'\x01([^\x02]*)\x02', w)
        out.append((re.sub(r'\x01[^\x02]*\x02', '', w), float(m.group(1)) if m else 1.0))
    return out

_CAPF = None
def _best_cuts(D, max_words, max_px):
    """Split display words into one-line chunks: fewest chunks, balanced widths, no chunk ending on a filler word."""
    m = len(D); INF = float('inf'); best = [(INF, None)] * (m + 1); best[0] = (0.0, None)
    for j in range(1, m + 1):
        for i in range(max(0, j - max_words), j):
            if best[i][0] == INF: continue
            w = _CAPF.getlength(' '.join(D[i:j]).upper().replace(chr(160), ' '))
            if w > max_px and j - i > 1: continue
            c = 1000 + ((max_px - w) / 100) ** 2 + (60 if j < m and D[j - 1].lower().strip(",.") in STOP else 0)
            if best[i][0] + c < best[j][0]: best[j] = (best[i][0] + c, i)
    cuts = [m]
    while cuts[-1] > 0: cuts.append(best[cuts[-1]][1])
    return cuts[::-1]
def chunks(segs, words, max_words=5, max_px=980):
    global _CAPF
    if _CAPF is None: _CAPF = ImageFont.truetype(F_ANTON, 112)
    out = []
    for s in segs:
        sw = [w for w in words if w['seg'] == s['i']]
        k = 0
        for ph in re.findall(r"[^.,?!:]+[.,?!:]?", s['text']):
            toks = re.findall(r"[A-Za-z0-9']+", ph)
            if not toks: continue
            n = len(toks); pw = sw[k:k + n]; k += n
            DW = _display(ph.strip()); D = [d for d, _ in DW]; m = len(D)
            cum = [0.0]
            for _, wgt in DW: cum.append(cum[-1] + wgt)
            cuts = _best_cuts(D, max_words, max_px)
            for j in range(len(cuts) - 1):
                a0, a1 = cuts[j], cuts[j + 1]
                if a1 <= a0: continue
                i0 = min(n - 1, int(cum[a0] + 1e-6)); i1 = min(n - 1, max(i0, -(-int(round(cum[a1] * 1000)) // 1000) - 1))
                wts = [pw[min(n - 1, int(cum[j] + 1e-6))]['start'] for j in range(a0, a1)]
                out.append({'text': ' '.join(D[a0:a1]).upper(), 'start': pw[i0]['start'], 'end': pw[i1]['end'], 'wt': wts})
    for i, c in enumerate(out):
        nxt = out[i + 1]['start'] if i + 1 < len(out) else c['end'] + 1.2
        c['until'] = min(nxt, c['end'] + 0.6)
    return out

def cap_sprite(text, font, max_w=990):
    text = text.replace(chr(160), ' ')
    words = text.split(); lines = []; cur = ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if font.getlength(t) > max_w and cur: lines.append(cur); cur = w
        else: cur = t
    lines.append(cur)
    lh = int(font.size * 1.08); stroke = 10
    wmax = int(max(font.getlength(l) for l in lines)) + 2 * stroke + 40
    img = Image.new('RGBA', (wmax, lh * len(lines) + 2 * stroke + 40), (0, 0, 0, 0))
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0)); d1 = ImageDraw.Draw(sh); d2 = ImageDraw.Draw(img)
    for i, l in enumerate(lines):
        x = (wmax - font.getlength(l)) / 2; y = 20 + i * lh
        d1.text((x + 4, y + 8), l, font=font, fill=(0, 0, 0, 160), stroke_width=stroke + 2, stroke_fill=(0, 0, 0, 160))
        d2.text((x, y), l, font=font, fill=(255, 255, 255, 255), stroke_width=stroke, stroke_fill=(12, 12, 14, 255))
    return Image.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)), img)

HL = (255, 214, 64, 255)
def cap_sprite_hl(text, font, hl, max_w=990):
    words = text.replace(chr(160), ' ').split(' ')
    full = ' '.join(words)
    if font.getlength(full) > max_w or hl is None: return cap_sprite(text, font, max_w)
    lh = int(font.size * 1.08); stroke = 10
    wmax = int(font.getlength(full)) + 2 * stroke + 40
    img = Image.new('RGBA', (wmax, lh + 2 * stroke + 40), (0, 0, 0, 0))
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0)); d1 = ImageDraw.Draw(sh); d2 = ImageDraw.Draw(img)
    x0 = 20 + stroke; y = 20
    d1.text((x0 + 4, y + 8), full, font=font, fill=(0, 0, 0, 160), stroke_width=stroke + 2, stroke_fill=(0, 0, 0, 160))
    d2.text((x0, y), full, font=font, fill=(255, 255, 255, 255), stroke_width=stroke, stroke_fill=(12, 12, 14, 255))
    xs = x0
    for i, w in enumerate(words):
        if i == hl: d2.text((xs, y), w, font=font, fill=HL, stroke_width=stroke, stroke_fill=(12, 12, 14, 255))
        xs += font.getlength(w + ' ')
    return Image.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)), img)

class Captions:
    def __init__(self, ch):
        f = ImageFont.truetype(F_ANTON, 112)
        self.items = []
        for c in ch:
            wts = c.get('wt') or [c['start']]
            n = len(c['text'].replace(chr(160), ' ').split(' '))
            if len(wts) != n: wts = [c['start']] * n
            sprites = [cap_sprite_hl(c['text'], f, k) for k in range(n)]
            self.items.append((c['start'] - 0.04, c['until'], wts, sprites))
    def render(self, t):
        cv = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        for t0, t1, wts, sprites in self.items:
            if t0 <= t < t1:
                k = 0
                for j, wt in enumerate(wts):
                    if t >= wt - 0.03: k = j
                spr = sprites[k]
                kk = min(1.0, (t - t0) / 0.1); s = 1.08 - 0.08 * kk
                sp = spr.resize((int(spr.width * s), int(spr.height * s)), Image.BILINEAR) if s > 1.001 else spr
                cv.alpha_composite(sp, (int(540 - sp.width / 2), int(1165 - sp.height / 2)))
                break
        return cv


SPAN_NAMES = set(PS.SPANS.keys())
def build_audio_quiet(total, voice_path, sfx, music_db=-26.0, span_db=-35.0, point_db=-21.0):
    """Background well under the narration: music ~23 dB, continuous ambiences ~31 dB, short effects ~17 dB below the voice."""
    n = int(total * SR)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', voice_path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    v = np.frombuffer(raw, np.float32).astype(np.float64); voice = np.zeros(n); voice[:min(n, len(v))] = v[:n]
    vr = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)) + 1e-9
    rms = lambda x: np.sqrt(np.mean(x[np.abs(x) > 1e-5] ** 2)) + 1e-12
    env = P.lowpass(np.abs(voice), 4); duck = 1 - 0.5 * np.clip(env / (vr * 0.7), 0, 1)   # -6 dB while speaking
    mus = PB.music_bed(total); mus *= vr * 10 ** (music_db / 20) / rms(mus)
    bgd = np.zeros(n)
    for name, a, b in sfx:
        x = PS.SPANS[name](max(0.2, b - a)) if name in PS.SPANS else PS.SFX[name](b)
        x = x * vr * 10 ** ((span_db if name in SPAN_NAMES else point_db) / 20) / rms(x)
        st = int(max(0, a) * SR); seg = x[: len(bgd[st:st + len(x)])]; bgd[st:st + len(seg)] += seg
    back = (mus + bgd) * duck
    d = int(0.012 * SR)
    st = np.stack([P.highpass(voice + back, 30), P.highpass(voice + np.concatenate([np.zeros(d), back[:-d]]), 30)], 1)
    st = np.tanh(st * 1.2) / np.tanh(1.2)
    return st / (np.max(np.abs(st)) + 1e-9) * 0.89

def cfg_handys(W_):
    wt = lambda w, s: next(x for x in W_ if x['w'] == w and x['seg'] == s)['start']
    tDis, tBack, tN, tMom = wt('disappears', 0), wt('back', 18), wt('notifications', 18), wt('mom', 20)
    sfx = [('room', 0, 6.6), ('shimmer', tDis, 1.2), ('whoosh', tDis + 0.05, 1.0), ('wind', 12.65, 15.0), ('sting', 15.15, 1.6), ('room', 15.0, 23.1),
           ('wind', 23.1, 34.4), ('room', 34.4, 42.2), ('wind', 42.2, 48.4), ('room', 48.4, 66.7), ('paper', 55.3, 56.3),
           ('reverse', tBack - 0.8, 0.8), ('shimmer', tBack, 1.0), ('room', 66.7, 76.0)]
    for i in range(6): sfx.append(('ping', tN + i * 0.27, 0.7))
    sfx += [('ping', tMom - 0.05, 0.7)]
    return sfx

def cfg_glas5(W_):
    wt = lambda w, s: next(x for x in W_ if x['w'] == w and x['seg'] == s)['start']
    tV = wt('gone', 2) - 0.4; tR = wt('comes', 15)
    return [('wind', 0.0, 4.3), ('room', 4.3, tV), ('shimmer', tV, 1.1), ('whoosh', tV + 0.1, 1.2), ('wind', tV + 0.3, 18.7), ('paper', tV + 0.5, 18.7),
            ('wind', 18.7, 29.6), ('paper', 18.7, 29.6), ('roar', 29.6, 41.6), ('shimmer', wt('windshields', 7) + 0.15, 0.8), ('flap', wt('windshields', 7) + 0.3, 41.6),
            ('room', 41.6, 50.2), ('shimmer', wt('vanishes', 10) - 0.05, 0.9), ('splash', wt('vanishes', 10) + 0.6, 1.0),
            ('room', 50.2, 55.0), ('zap', wt('Black', 12) - 0.05, 0.6), ('powerdown', wt('Black', 12), 0.8),
            ('underwater', 55.0, 66.0), ('powerdown', wt('dark', 14), 1.4), ('reverse', tR - 0.9, 0.9), ('shimmer', tR + 0.1, 1.0),
            ('room', 66.0, 82.2), ('drip', wt('coffee', 16) + 0.4, 0.5)]

def cfg_ki(W_):
    wt = lambda w, s: next(x for x in W_ if x['w'] == w and x['seg'] == s)['start']
    sfx = [('room', 0, 6.2), ('powerdown', wt('off', 0), 1.2), ('room', 6.2, 14.1), ('roar', 14.1, 23.8), ('room', 23.8, 43.6),
           ('room', 43.6, 52.0), ('zap', wt('stops', 11) + 0.4, 0.5), ('room', 52.0, 70.6), ('pop', wt('walk', 13) + 1.9, 0.08),
           ('glitch', wt('now', 16) - 0.1, 0.9)]
    for i in range(4): sfx.append(('pop', 8.6 + i * 1.1, 0.08))
    for i in range(3): sfx.append(('ping', wt('inbox', 7) + 0.2 + i * 0.3, 0.7))
    for i in range(3): sfx.append(('whoosh', 35.3 + 2.6 * (i + 1) - 0.25, 0.5))
    return sfx

def cfg_kids_de(W_):
    def wt(w, s):
        return next(x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w)['start']
    tG2, tH2 = wt('kids', 13) - 0.12, wt('every', 16) - 0.15
    sfx = [('wind', 0, 3.45), ('room', 3.45, 12.6), ('pop', wt('illegal', 3), 0.08), ('ping', wt('illegal', 3) + 0.05, 0.7), ('shimmer', wt('votes', 3) + 0.1, 1.2),
           ('roar', 12.6, 19.6), ('ping', wt('rule', 5), 0.7), ('room', 19.6, 29.0), ('ping', wt('fixed', 7), 0.7), ('whoosh', wt('playground', 7) - 0.1, 0.5),
           ('ping', wt('delays', 7), 0.7), ('room', 29.0, 36.75), ('pop', wt('abolished', 9), 0.08), ('powerdown', wt('midnight', 9) - 0.1, 1.0),
           ('room', 36.75, 44.4), ('whoosh', wt('ninety', 11) - 0.1, 0.5), ('pop', wt('ten', 11), 0.08), ('room', 44.4, tG2), ('ping', wt('now', 13), 0.7),
           ('wind', tG2, 52.2), ('room', 52.2, tH2), ('wind', tH2, 60.4), ('room', 60.4, 70.6), ('shimmer', wt('map', 18) - 0.2, 1.2), ('sting', 68.75, 1.2)]
    for i in range(4): sfx.append(('pop', wt('dog', 5) + i * 0.12, 0.08))
    for i in range(5): sfx.append(('ping', wt('emails', 15) + i * 0.28, 0.6))
    for i in range(6): sfx.append(('pop', tH2 + i * 0.22, 0.08))
    return sfx

def cfg_kids_fr(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]['start']
    tB2 = wt('croissants', 3) - 0.15
    sfx = [('wind', 0, 3.4), ('room', 3.4, tB2), ('pop', wt('law', 3), 0.08), ('shimmer', wt('dessert', 3), 1.2), ('wind', tB2, 12.95), ('pop', wt('croissants', 3) + 0.05, 0.08),
           ('wind', 12.95, 20.48), ('whoosh', wt('slide', 5) - 0.2, 0.6), ('pop', wt('four', 5), 0.08), ('room', 20.48, 28.65), ('whoosh', wt('hangs', 7) - 0.1, 0.5),
           ('whoosh', wt('gets', 7) - 0.2, 0.6), ('roar', 28.65, 37.6), ('zap', wt('replaced', 9), 0.5), ('sting', wt('race', 9), 1.0), ('wind', 37.6, 44.58), ('splash', 38.0, 1.0),
           ('pop', wt('top', 11) - 0.15, 0.08), ('room', 44.58, 54.38), ('powerdown', wt('nobody', 14), 1.0), ('room', 54.38, 62.85), ('shimmer', wt('paris', 16) - 0.1, 1.2),
           ('wind', 62.85, 70.5), ('shimmer', wt('plans', 17), 1.2), ('whoosh', 68.9, 0.5), ('sting', 69.1, 1.2)]
    for t0 in (wt('cookie', 13) + 0.3, wt('three', 13), wt('forms', 13)): sfx.append(('pop', t0, 0.08))
    for t0 in (wt('two', 13), wt('stamps', 13)): sfx.append(('zap', t0, 0.3))
    return sfx

def cfg_kids_rs(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]['start']
    sfx = [('wind', 0, 3.55), ('room', 3.55, 13.3), ('pop', wt('law', 3), 0.08), ('ping', wt('teachers', 3), 0.7), ('room', 13.3, 21.8), ('pop', wt('burek', 5), 0.08),
           ('zap', wt('sold', 5) - 0.1, 0.4), ('shimmer', wt('sunrise', 5), 1.2), ('room', 21.8, 30.2), ('pop', wt('food', 7), 0.08), ('pop', wt('nobody', 8) + 0.6, 0.08),
           ('wind', 30.2, 38.5), ('splash', wt('slide', 10), 1.0), ('whoosh', wt('slide', 10) - 0.3, 0.6), ('wind', 38.5, 46.3), ('whoosh', wt('hide', 12) - 0.2, 0.5),
           ('room', 46.3, 55.8), ('shimmer', wt('three', 14) - 0.2, 1.2), ('zap', wt('school', 14), 0.4), ('wind', 55.8, 64.85), ('whoosh', wt('arrive', 16) - 1.0, 0.6),
           ('shimmer', wt('together', 16), 1.2), ('sting', wt('take', 16), 1.0), ('wind', 64.85, 67.9), ('pop', wt('grandma', 18) + 0.3, 0.08), ('room', 67.9, 72.6)]
    for i in range(9): sfx.append(('pop', 67.9 + i * 0.08, 0.08))
    for i in range(8): sfx.append(('pop', 68.2 + i / 2.2, 0.08))
    for i in range(3): sfx.append(('pop', wt('basketball', 3) - 1.5 + i * 0.52, 0.08))
    return sfx

def cfg_draft(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]['start']
    tB2, tE2, tE3, tG2 = wt('report', 2) - 0.15, wt('germany', 9) - 0.25, wt('many', 9) - 0.2, wt('others', 13) - 0.15
    sfx = [('room', 0, 2.75), ('whoosh', wt('draft', 0) - 0.1, 0.5), ('pop', wt('draft', 0) + 0.7, 0.08), ('room', 2.75, 10.7), ('ping', wt('report', 2), 0.7),
           ('room', 10.7, 19.2), ('room', 19.2, 28.45), ('pop', wt('run', 6), 0.08), ('wind', 28.45, tE2), ('room', tE2, 42.3), ('shimmer', wt('right', 9), 1.2),
           ('room', 42.3, 52.9), ('zap', wt('five', 11), 0.8), ('ping', wt('flat', 11), 0.7), ('pop', wt('mom', 11), 0.08), ('wind', 52.9, 60.8), ('whoosh', tG2, 0.5),
           ('room', 60.8, 78.8), ('sting', wt('follow', 18), 1.0), ('pop', wt('voluntary', 15), 0.08), ('pop', wt('already', 15), 0.08), ('ping', wt('first', 16), 0.7), ('pop', wt('go', 17), 0.08)]
    for i in range(12): sfx.append(('pop', wt('same', 2) + i * 0.07, 0.08))
    for t0 in (wt('chats', 4), wt('explode', 4), wt('explode', 4) + 0.4, wt('panicking', 4), wt('panicking', 4) + 0.5, wt('which', 4), wt('food', 4) + 0.2): sfx.append(('ping', t0, 0.5))
    for t0 in (wt('hospitals', 9), wt('care', 9), wt('fire', 9)): sfx.append(('pop', t0, 0.08))
    for i in range(3): sfx.append(('pop', wt('rest', 16) + i * 0.18, 0.08))
    return sfx

def cfg_thoughts(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]['start']
    sfx = [('wind', 0, 3.3), ('shimmer', wt('hear', 0), 1.2), ('room', 3.3, 11.95), ('pop', wt('yes', 2), 0.08), ('shimmer', wt('hears', 2), 1.0), ('pop', wt('helmet', 2) + 0.2, 0.08),
           ('roar', 11.95, 19.0), ('shimmer', wt('please', 4) - 0.1, 1.0), ('pop', wt('please', 4) + 0.3, 0.08), ('room', 19.0, 26.85), ('pop', wt('say', 6), 0.08), ('shimmer', wt('head', 6), 1.0),
           ('pop', wt('coffee', 6) + 0.4, 0.08), ('room', 26.85, 33.9), ('zap', wt('headache', 8) - 0.1, 0.5), ('room', 33.9, 39.5), ('whoosh', wt('over', 10) - 0.2, 0.6), ('sting', wt('over', 10) + 0.1, 1.0),
           ('room', 39.5, 48.2), ('shimmer', wt('cute', 12) - 0.2, 1.2), ('ping', wt('fastest', 12), 0.7), ('room', 48.2, 59.7), ('reverse', wt('wears', 14), 0.8), ('pop', wt('helmet', 15) - 0.3, 0.08), ('pop', wt('comments', 16), 0.08)]
    for i in range(5): sfx.append(('pop', wt('hear', 0) + i * 0.12, 0.08))
    for i in range(4): sfx.append(('pop', wt('cheat', 8) - 0.2 + i * 0.1, 0.08))
    for i in range(3): sfx.append(('pop', wt('poker', 10) + 0.3 + i * 0.15, 0.08))
    return sfx

def cfg_draft2(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]['start']
    tB2, tD2, tP = wt('brother', 2) - 0.4, wt('two', 6) - 0.15, wt('paramedics', 7) - 0.3
    sfx = [('wind', 0, 2.9), ('room', 2.9, tB2), ('whoosh', wt('halfway', 2) - 0.1, 0.6), ('pop', wt('washes', 2), 0.08), ('pop', wt('three', 2), 0.08), ('pop', wt('times', 2), 0.08),
           ('room', tB2, 13.3), ('pop', wt('salutes', 2) - 0.1, 0.08), ('wind', 13.3, 21.25), ('underwater', wt('rain', 4) - 0.6, 21.25), ('pop', wt('three', 4) - 0.1, 0.08),
           ('room', 21.25, tD2), ('roar', tD2, 33.0), ('ping', wt('need', 6) - 0.1, 0.7), ('whoosh', tP, 0.8), ('shimmer', wt('right', 7), 1.2), ('room', 33.0, 42.75),
           ('pop', wt('parties', 9) - 0.4, 0.08), ('pop', wt('other', 9), 0.08), ('zap', wt('pack', 9) - 0.3, 0.4), ('room', 42.75, 51.6), ('pop', wt('mom', 11), 0.08),
           ('wind', 51.6, 59.0), ('pop', wt('sign', 13) - 0.2, 0.08), ('ping', wt('everyone', 13), 0.7), ('wind', 59.0, 64.3), ('pop', wt('part', 14), 0.08), ('sting', wt('follow', 14), 1.0)]
    for i in range(10): sfx.append(('pop', wt('cook', 11) + i * 0.06, 0.08))
    return sfx

def cfg_teen_de(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r"[^a-z0-9']", '', x['w'].lower()) == w][n]['start']
    sfx = [('wind', 0, 3.7), ('room', 3.7, 15.1), ('pop', wt('law', 3), 0.08), ('pop', wt('studies', 3), 0.08), ('ping', wt('votes', 3) + 1.0, 0.7),
           ('room', 15.1, 23.7), ('pop', wt('livestreamed', 5), 0.08), ('room', 23.7, 33.1), ('ping', wt('free', 7), 0.7), ('shimmer', wt('suddenly', 7), 1.0),
           ('room', 33.1, 44.0), ('whoosh', wt('fax', 9) - 0.3, 0.6), ('splash', wt('fax', 9) + 0.6, 0.6), ('room', 44.0, 53.5), ('zap', wt('jump', 11), 0.5), ('pop', wt('bill', 11) - 0.3, 0.08),
           ('room', 53.5, 59.3), ('room', 59.3, 68.2), ('wind', 68.2, 75.6), ('sting', wt('follow', 17), 1.0)]
    for t0 in (wt('id', 9), wt('taxes', 9), wt('note', 9)): sfx.append(('pop', t0, 0.08))
    for i in range(4): sfx.append(('ping', wt('comments', 5) + i * 0.4, 0.5))
    for i in range(6): sfx.append(('pop', wt('call', 13) - 0.3 + i * 0.12, 0.08))
    for i in range(6): sfx.append(('pop', wt('angry', 15) - 0.6 + i * 0.12, 0.08))
    return sfx

def cfg_teen_fr(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r"[^a-z0-9']", '', x['w'].lower()) == w][n]['start']
    sfx = [('wind', 0, 3.6), ('room', 3.6, 16.9), ('pop', wt('decree', 3), 0.08), ('ping', wt('checks', 4), 0.7), ('zap', wt('law', 4), 0.4), ('room', 16.9, 26.9),
           ('zap', wt('give', 6) - 0.1, 0.5), ('roar', 26.9, 36.1), ('ping', wt('resign', 8) - 0.3, 0.6), ('ping', wt('resign', 8) + 0.1, 0.6), ('wind', 36.1, 44.9),
           ('shimmer', wt('lights', 10), 1.0), ('pop', wt('votes', 10), 0.08), ('shimmer', wt('locals', 10), 1.0), ('wind', 44.9, 53.0), ('pop', wt('banner', 12) - 0.2, 0.08),
           ('room', 53.0, 66.6), ('pop', wt('calls', 14), 0.08), ('ping', wt('free', 14) - 0.2, 0.7), ('room', 66.6, 72.5), ('sting', wt('follow', 16), 1.0)]
    return sfx

def cfg_teen_rs(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r"[^a-z0-9']", '', x['w'].lower()) == w][n]['start']
    sfx = [('wind', 0, 3.75), ('wind', 3.75, 14.4), ('pop', wt('law', 3), 0.08), ('ping', wt('national', 3), 0.7), ('room', 14.4, 25.4), ('pop', wt('offer', 5), 0.08),
           ('shimmer', wt('covered', 5), 1.0), ('zap', wt('sell', 5), 0.4), ('room', 25.4, 34.0), ('ping', wt('label', 7), 0.7), ('sting', wt('war', 7), 0.8),
           ('roar', 34.0, 41.95), ('glitch', wt('crashes', 9) - 0.1, 0.8), ('room', 41.95, 54.0), ('pop', wt('dessert', 11) - 0.3, 0.08), ('room', 54.0, 62.4),
           ('whoosh', wt('hires', 13) - 0.3, 0.6), ('room', 62.4, 72.85), ('pop', wt('sign', 15), 0.08), ('ping', wt('sixty', 15), 0.7), ('whoosh', wt('like', 16) - 0.2, 0.5),
           ('room', 72.85, 77.9), ('pop', wt('comments', 17), 0.08)]
    for i in range(9): sfx.append(('pop', 72.9 + i * 0.07, 0.08))
    return sfx

def cfg_draft3(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]['start']
    D = [wt('day', s) - 0.25 for s in (1, 3, 5, 7, 9, 11, 13)]
    tThen, tOut, end = wt('then', 15) - 0.2, wt('which', 16) - 0.25, W_[-1]['end'] + 0.6
    sfx = [('wind', 0, D[0]), ('pop', wt('part', 0), 0.08), ('room', D[0], D[1]), ('pop', wt('whistle', 2), 0.08), ('zap', wt('whistle', 2) + 0.2, 0.3),
           ('pop', wt('shouting', 2), 0.08), ('zap', wt('shouting', 2) + 0.2, 0.3), ('shimmer', wt('order', 2) - 0.2, 1.2),
           ('roar', D[1], D[2]), ('ping', wt('long', 4), 0.6), ('pop', wt('nobody', 4), 0.08), ('zap', wt('eat', 4) - 0.3, 0.3),
           ('underwater', D[2], D[3]), ('pop', wt('four', 6), 0.08), ('ping', wt('midnight', 6), 0.7), ('room', D[3], D[4]), ('whoosh', wt('smaller', 8) - 0.3, 0.6),
           ('zap', wt('photo', 8), 0.3), ('ping', wt('family', 8) + 0.1, 0.7), ('room', D[4], D[5]), ('pop', wt('first', 10) + 0.4, 0.08), ('pop', wt('leading', 10) + 0.6, 0.08),
           ('pop', wt('cooking', 10) + 0.9, 0.08), ('shimmer', wt('easy', 10), 1.2), ('room', D[5], D[6]), ('pop', wt('picture', 12) + 0.1, 0.08),
           ('room', D[6], tThen), ('pop', wt('cold', 14), 0.08), ('pop', wt('noise', 14), 0.08), ('pop', wt('people', 14), 0.08), ('wind', tThen, end),
           ('shimmer', wt('years', 15) - 0.2, 1.2), ('whoosh', tOut, 0.5), ('sting', wt('comments', 16), 1.0)]
    for i in range(40): sfx.append(('pop', wt('forty', 4) - 0.3 + i * 0.035, 0.08)) if i % 5 == 0 else None
    for i in range(6): sfx.append(('pop', wt('fold', 8) + i * 0.32, 0.08))
    for i in range(12): sfx.append(('ping', wt('explodes', 12) + i * 0.45, 0.5))
    return sfx

def _wtf(W_):
    def wt(w, s, n=0):
        return [x for x in W_ if x['seg'] == s and re.sub(r'[^a-z0-9]', '', x['w'].lower()) == w][n]['start']
    def D(s):
        return [x for x in W_ if x['seg'] == s][0]['start'] - 0.25
    return wt, D

def cfg_berlin89(W_):
    wt, D = _wtf(W_); end = W_[-1]['end'] + 0.6
    S6, S8, S9 = wt('you', 11) - 0.2, wt('your', 14) - 0.2, wt('what', 15) - 0.25
    return [('wind', 0, D(1)), ('pop', wt('nineteen', 0), 0.08), ('room', D(1), D(3)), ('ping', wt('signal', 2), 0.6), ('ping', wt('wifi', 2), 0.6), ('pop', wt('percent', 2) - 0.2, 0.08),
            ('shimmer', wt('advanced', 2) - 0.1, 1.2), ('roar', D(3), D(5)), ('pop', wt('west', 4) - 0.3, 0.08), ('pop', wt('kind', 4), 0.08), ('room', D(5), D(7)), ('whoosh', wt('closes', 6), 0.5),
            ('room', D(7), D(9)), ('pop', D(7) + 0.4, 0.08), ('zap', wt('immediately', 8), 0.4), ('sting', wt('immediately', 8) + 0.1, 1.2), ('wind', D(9), S6), ('whoosh', wt('goes', 10) - 0.3, 0.8),
            ('shimmer', wt('goes', 10) + 0.2, 1.2), ('roar', wt('goes', 10), S8), ('pop', wt('hugs', 11), 0.08), ('pop', wt('tears', 11), 0.08), ('splash', wt('champagne', 11), 1.0),
            ('ping', D(12) + 0.3, 0.7), ('pop', wt('four', 13), 0.08), ('whoosh', wt('charger', 13) - 0.2, 0.6), ('room', S8, S9), ('powerdown', wt('black', 14) - 0.3, 1.2), ('wind', S9, end), ('sting', wt('comments', 15), 1.0)]

def cfg_nosleep(W_):
    wt, D = _wtf(W_); end = W_[-1]['end'] + 0.6
    sfx = [('wind', 0, D(1)), ('shimmer', wt('sleep', 0), 1.2), ('room', D(1), D(3)), ('pop', wt('two', 2), 0.08), ('shimmer', wt('sunrise', 2), 1.2), ('roar', D(3), D(5)),
           ('pop', wt('supermarkets', 4), 0.08), ('ping', wt('lights', 4), 0.6), ('room', D(5), D(7)), ('ping', wt('boss', 6), 0.7), ('zap', wt('sixteen', 6), 0.4), ('whoosh', wt('half', 6), 0.8),
           ('room', D(7), D(9)), ('pop', wt('guitar', 8), 0.08), ('pop', wt('language', 8), 0.08), ('pop', wt('cook', 8), 0.08), ('wind', D(9), D(11)), ('powerdown', wt('dreams', 10), 1.2),
           ('roar', D(11), D(13)), ('pop', wt('pill', 12), 0.08), ('ping', wt('eight', 12), 0.6), ('whoosh', wt('line', 12) - 0.2, 0.6), ('wind', D(13), end), ('sting', wt('comments', 13), 1.0)]
    for i in range(10): sfx.append(('ping', wt('group', 8) + i * 0.3, 0.5))
    return sfx

def cfg_salary(W_):
    wt, D = _wtf(W_); end = W_[-1]['end'] + 0.6
    sfx = [('room', 0, D(1)), ('shimmer', wt('public', 0), 1.2), ('room', D(1), D(3)), ('pop', wt('app', 2), 0.08), ('ping', wt('earn', 2), 0.6), ('room', D(3), D(5)), ('zap', wt('four', 4), 0.4),
           ('pop', wt('same', 4), 0.08), ('pop', wt('started', 4), 0.08), ('room', D(5), D(7)), ('pop', wt('coffee', 6), 0.08), ('room', D(7), D(9)), ('ping', wt('boss', 8), 0.7), ('powerdown', wt('quiet', 8) - 0.2, 1.2),
           ('room', D(9), D(11)), ('room', D(11), D(13)), ('ping', wt('make', 12) - 0.3, 0.7), ('pop', wt('change', 12), 0.08), ('wind', D(13), D(14)), ('whoosh', wt('eu', 13) - 0.3, 0.6),
           ('pop', wt('range', 13), 0.08), ('pop', wt('germany', 13), 0.08), ('wind', D(14), end), ('sting', wt('comments', 14), 1.0)]
    for i in range(8): sfx.append(('ping', wt('inbox', 6) + i * 0.22, 0.5))
    for i in range(5): sfx.append(('ping', wt('raises', 10) + i * 0.35, 0.6))
    return sfx

def cfg_rewind(W_):
    wt, D = _wtf(W_); end = W_[-1]['end'] + 0.6
    sfx = [('wind', 0, D(1)), ('whoosh', wt('rewind', 0) - 0.2, 0.8), ('pop', wt('once', 0), 0.08), ('room', D(1), D(3)), ('splash', wt('coffee', 2), 0.6), ('ping', wt('clean', 2), 0.6),
           ('roar', D(3), D(5)), ('pop', wt('comeback', 4), 0.08), ('shimmer', wt('comeback', 4) + 0.2, 1.0), ('roar', D(5), D(7)), ('sting', wt('bus', 6), 1.0), ('room', D(7), D(9)),
           ('ping', wt('laughs', 8), 0.6), ('room', D(9), D(11)), ('pop', wt('awkward', 10), 0.08), ('pop', wt('pause', 10), 0.08), ('pop', wt('mistake', 10), 0.08), ('powerdown', wt('quieter', 10) - 0.3, 1.2),
           ('wind', D(11), D(13)), ('pop', wt('decide', 12), 0.08), ('shimmer', wt('best', 12), 1.2), ('wind', D(13), end), ('sting', wt('comments', 13), 1.0)]
    for s_ in (2, 4, 6, 8):
        r = wt('rewind', s_); sfx += [('underwater', r - 0.1, r + 0.7), ('whoosh', r - 0.15, 0.8), ('zap', r + 0.55, 0.3)]
    return sfx

def cfg_nocars(W_):
    wt, D = _wtf(W_); end = W_[-1]['end'] + 0.6
    sfx = [('wind', 0, D(1)), ('shimmer', wt('disappeared', 0) - 0.2, 1.4), ('roar', wt('buses', 0) - 0.3, D(1)), ('wind', D(1), D(3)), ('pop', wt('stares', 2), 0.08), ('pop', wt('out', 2), 0.08),
           ('roar', D(3), D(5)), ('zap', wt('sold', 4), 0.3), ('ping', wt('viral', 4), 0.7), ('wind', D(5), D(7)), ('pop', wt('six', 6), 0.08), ('whoosh', wt('kids', 6), 0.8),
           ('room', D(7), D(9)), ('pop', wt('cold', 8), 0.08), ('shimmer', wt('birds', 8), 1.2), ('wind', D(9), D(11)), ('pop', wt('parks', 10), 0.08), ('pop', wt('football', 10), 0.08),
           ('pop', wt('markets', 10), 0.08), ('pop', wt('basketball', 10), 0.08), ('room', D(11), D(13)), ('sting', wt('first', 12), 1.0), ('ping', wt('eleven', 12), 0.6), ('whoosh', wt('dad', 12) - 0.4, 0.6),
           ('wind', D(13), end), ('sting', wt('comments', 13), 1.0)]
    return sfx

def cfg_onelang(W_):
    wt, D = _wtf(W_); end = W_[-1]['end'] + 0.6
    sfx = [('wind', 0, D(1)), ('shimmer', wt('language', 0), 1.2), ('room', D(1), D(3)), ('zap', wt('nobody', 2), 0.3), ('ping', wt('day', 2), 0.6), ('roar', D(3), D(5)), ('pop', wt('menus', 4), 0.08),
           ('sting', wt('waiter', 4), 1.0), ('room', D(5), D(7)), ('room', D(7), D(9)), ('shimmer', wt('finally', 8), 1.2), ('zap', wt('terrible', 8), 0.3), ('room', D(9), D(11)), ('ping', wt('brazil', 10), 0.7),
           ('pop', wt('recipes', 10), 0.08), ('room', D(11), D(13)), ('ping', wt('perfectly', 12), 0.6), ('pop', wt('still', 12), 0.08), ('pop', wt('still', 12) + 0.3, 0.08), ('wind', D(13), end), ('sting', wt('comments', 13), 1.0)]
    for i in range(14): sfx.append(('ping', wt('comment', 6) + i * 0.28, 0.4))
    for i in range(10): sfx.append(('pop', 0.3 + i * 0.1, 0.08))
    return sfx

CFG = {'onelang': cfg_onelang, 'nocars': cfg_nocars, 'rewind': cfg_rewind, 'salary': cfg_salary, 'nosleep': cfg_nosleep, 'berlin89': cfg_berlin89, 'draft3': cfg_draft3, 'draft2_v2': cfg_draft2, 'thoughts_v2': cfg_thoughts, 'draft_v2': cfg_draft, 'teen_rs': cfg_teen_rs, 'teen_fr': cfg_teen_fr, 'teen_de': cfg_teen_de, 'ki2': cfg_ki, 'handys2': cfg_handys, 'handys': cfg_handys, 'glas5': cfg_glas5, 'ki': cfg_ki, 'kids_de': cfg_kids_de, 'kids_fr': cfg_kids_fr, 'kids_rs': cfg_kids_rs, 'draft': cfg_draft, 'thoughts': cfg_thoughts, 'draft2': cfg_draft2}

def main():
    a = sys.argv[1:]; vid = a[0]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    vo = os.path.join(ROOT, 'work', vid, 'vo')
    segs = json.load(open(os.path.join(vo, 'segs.json'))); words = json.load(open(os.path.join(vo, 'words.json')))
    ch = chunks(segs, words); caps = Captions(ch)
    raw = opt('--raw', os.path.join(ROOT, 'work', vid, 'raw.mp4')); out = opt('--out', os.path.join(ROOT, 'out', f'{vid}.mp4'))
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', raw], capture_output=True, text=True).stdout)
    fps = 30
    grade = 'gblur=sigma=0.7,eq=saturation=1.05:contrast=1.03,noise=c0s=4:c0f=t+u'
    if '--stills' in a:
        d = os.path.join(ROOT, 'work', vid, 'post_stills'); os.makedirs(d, exist_ok=True)
        for s in opt('--stills').split(','):
            t = float(s)
            fr = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', raw, '-frames:v', '1', '-vf', grade, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
            im = Image.frombytes('RGB', (W, H), fr).convert('RGBA')
            Image.alpha_composite(im, caps.render(t)).convert('RGB').save(os.path.join(d, f'{t:06.2f}.jpg'), quality=88)
        print('\n'.join(f"{c['start']:6.2f} {c['text']}" for c in ch[:12])); return
    wavp = os.path.join(ROOT, 'work', vid, 'mix.wav')
    if vid in CFG: sfx = CFG[vid](words)
    elif os.path.exists(os.path.join(ROOT, 'work', vid, 'sfx.json')): sfx = [tuple(x) for x in json.load(open(os.path.join(ROOT, 'work', vid, 'sfx.json')))]
    else: sfx = [('room', 0, dur)]
    lv = dict(music_db=-20.0, span_db=-29.0, point_db=-11.0) if opt('--mix') == 'hype' else {}
    mix = build_audio_quiet(dur, os.path.join(vo, 'narration.m4a'), sfx, **lv)
    P.write_wav(wavp, mix)
    meas = subprocess.run(['ffmpeg', '-nostats', '-i', wavp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[0-9.]+) LUFS', meas)
    if m:
        g = 10 ** ((-14.0 - float(m[-1])) / 20); mix = mix * g; pk = np.max(np.abs(mix))
        if pk > 0.89: mix = np.tanh(mix / pk * 1.2) / np.tanh(1.2) * 0.89
        P.write_wav(wavp, mix)
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', raw, '-vf', grade, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-', '-i', wavp,
                            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                            '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    fsz = W * H * 3; f = 0
    while True:
        buf = dec.stdout.read(fsz)
        if len(buf) < fsz: break
        im = Image.alpha_composite(Image.frombytes('RGB', (W, H), buf).convert('RGBA'), caps.render(f / fps)).convert('RGB')
        enc.stdin.write(im.tobytes()); f += 1
    enc.stdin.close(); enc.wait(); dec.wait(); print('done', out, f)

if __name__ == '__main__':
    main()
