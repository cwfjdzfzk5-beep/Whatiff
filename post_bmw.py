#!/usr/bin/env python3
"""BMW-style post: one word on screen at a time (lowercase, lower third), chapter label ("SECOND 1") at the top
for ~2.6 s, warm grade, the Kokoro narration, a quiet low music bed (~20 dB under the voice) and subtle SFX.

  python3 post_bmw.py glas4 [--stills 5,10.5] [--out out/x.mp4]
"""
import json, os, sys, re, subprocess, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import signal
import post as P
import post_story as PS

ROOT = P.ROOT; W, H, SR = 1080, 1920, 48000
F_XB = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'
F_BLACK = '/usr/share/fonts/opentype/inter/Inter-Black.otf'

def sprite(text, font, stroke=5, shadow=True):
    l, t, r, b = font.getbbox(text, stroke_width=stroke)
    pad = stroke + 22
    w, h = r - l + 2 * pad, b - t + 2 * pad
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    if shadow:
        sh = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((pad - l, pad - t + 6), text, font=font, fill=(0, 0, 0, 200), stroke_width=stroke + 3, stroke_fill=(0, 0, 0, 200))
        img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(9)))
    ImageDraw.Draw(img).text((pad - l, pad - t), text, font=font, fill=(255, 255, 255, 255), stroke_width=stroke, stroke_fill=(20, 20, 20, 255))
    return img

class Overlay:
    def __init__(self, words, chapters):
        self.fw = ImageFont.truetype(F_XB, 96)
        self.fc = ImageFont.truetype(F_BLACK, 84)
        self.words = []
        for i, w in enumerate(words):
            txt = re.sub(r"[^a-z0-9']", '', w['w'].lower())
            nxt = words[i + 1]['start'] if i + 1 < len(words) else w['end'] + 1.0
            end = min(nxt, w['end'] + 0.45)          # hold a word through short pauses, clear on long ones
            self.words.append((w['start'] - 0.03, end, sprite(txt, self.fw)))
        self.chapters = [(t0, sprite(lbl, self.fc, stroke=4)) for t0, lbl in chapters]

    def render(self, t):
        cv = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        for t0, spr in self.chapters:
            d = t - t0
            if 0 <= d < 2.6:
                a = min(1.0, d / 0.15) * min(1.0, (2.6 - d) / 0.25)
                self._put(cv, spr, 540, 450, a, 1.0)
        for t0, t1, spr in self.words:
            if t0 <= t < t1:
                k = min(1.0, (t - t0) / 0.07)
                self._put(cv, spr, 540, 1420, 1.0, 1.06 - 0.06 * k)
                break
        return cv

    def _put(self, cv, spr, cx, cy, a, s):
        if abs(s - 1) > 0.005:
            spr = spr.resize((int(spr.width * s), int(spr.height * s)), Image.BILINEAR)
        if a < 0.999:
            arr = np.array(spr); arr[..., 3] = (arr[..., 3] * a).astype(np.uint8); spr = Image.fromarray(arr)
        cv.alpha_composite(spr, (int(cx - spr.width / 2), int(cy - spr.height / 2)))

# ------------------------------------------------------------------ audio
nf = lambda m: 440.0 * 2 ** ((m - 69) / 12)
def pad_chord(midis, d, cutoff=750):
    t = P.tsec(d); x = np.zeros(len(t))
    for m in midis:
        for c in (-6, 0, 6):
            f = nf(m) * 2 ** (c / 1200)
            for k in range(1, 9): x += np.sin(2 * np.pi * k * f * t + k * 1.3 + c) / k
    x = P.lowpass(x / (len(midis) * 3), cutoff)
    return x * np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.2 + 1e-3)

def music_bed(total):
    """Calm cinematic bed: slow Am-F-C-G pads (4.8 s each), sub drone, sparse soft piano-like notes."""
    n = int(total * SR); out = np.zeros(n)
    prog = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]
    L = 4.8; t = 0.0; i = 0
    while t < total:
        root, ch = prog[i % 4]
        x = pad_chord(ch, L + 1.2) * 0.5 + pad_chord([root], L + 1.2, 300) * 0.8
        st = int(t * SR); seg = x[: n - st]; out[st:st + len(seg)] += seg
        # two soft high notes per chord
        for k, off in enumerate((0.6, 2.8)):
            p = P.pluck(nf(ch[(i + k) % 3] + 12), 2.2, 2.2) * 0.12
            s2 = int((t + off) * SR)
            if s2 < n: out[s2:s2 + len(p)] += p[: n - s2]
        t += L; i += 1
    tt = np.arange(n) / SR
    return out * np.clip(np.minimum(tt / 2.0, (total - tt) / 2.5), 0, 1)

def build_audio(total, voice_path, sfx):
    n = int(total * SR)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', voice_path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    v = np.frombuffer(raw, np.float32).astype(np.float64)
    voice = np.zeros(n); voice[:min(n, len(v))] = v[:n]
    mus = music_bed(total); mus = mus / (np.max(np.abs(mus)) + 1e-9)
    fx = np.zeros(n)
    for name, a, b in sfx:
        x = PS.SPANS[name](max(0.2, b - a)) if name in PS.SPANS else PS.SFX[name](b)
        st = int(max(0, a) * SR); seg = x[: len(fx[st:st + len(x)])]
        fx[st:st + len(seg)] += seg * PS.GAIN[name]
    v_rms = np.sqrt(np.mean(voice[np.abs(voice) > 0.01] ** 2)) + 1e-9
    env = P.lowpass(np.abs(voice), 5); duck = 1 - 0.35 * np.clip(env / (v_rms * 0.8), 0, 1)
    mus = mus * v_rms * 10 ** (-17 / 20) / (np.sqrt(np.mean(mus ** 2)) + 1e-9)      # bed ~17 dB under the voice (before ducking)
    fx = fx * v_rms * 10 ** (-9 / 20) / (np.sqrt(np.mean(fx[np.abs(fx) > 1e-4] ** 2)) + 1e-9)
    mixL = voice + mus * duck + fx * (0.6 + 0.4 * duck)
    d = int(0.012 * SR)
    mixR = voice + np.concatenate([np.zeros(d), (mus * duck + fx * (0.6 + 0.4 * duck))[:-d]])
    st = np.stack([P.highpass(mixL, 30), P.highpass(mixR, 30)], 1)
    st = np.tanh(st * 1.3) / np.tanh(1.3)
    return st / (np.max(np.abs(st)) + 1e-9) * 0.89

def glas4_cfg(W_):
    wt = lambda w, s: next(x for x in W_ if x['w'] == w and x['seg'] == s)['start']
    tV = wt('gone', 2) - 0.377; tR = wt('comes', 15)
    chapters = [(wt('Second', s), f'SECOND {k}') for k, s in zip(range(1, 6), (1, 4, 6, 9, 13))]
    sfx = [('wind', 0.0, 4.3), ('room', 4.3, tV + 0.4), ('shimmer', tV + 0.25, 1.0), ('whoosh', tV + 0.3, 1.2),
           ('wind', tV + 0.4, 18.7), ('paper', 15.2, 18.7), ('wind', 18.7, 29.6), ('paper', 18.7, 29.6),
           ('roar', 29.6, 41.6), ('shimmer', wt('windshields', 7) + 0.2, 0.8), ('flap', wt('windshields', 7) + 0.3, 41.6),
           ('room', 41.6, 50.2), ('shimmer', wt('vanishes', 10) - 0.05, 0.9), ('splash', wt('vanishes', 10) + 0.6, 1.0),
           ('room', 50.2, 55.0), ('zap', wt('Black', 12) - 0.05, 0.6), ('powerdown', wt('Black', 12), 0.8),
           ('underwater', 55.0, 66.0), ('powerdown', wt('dark', 14), 1.4),
           ('reverse', tR - 0.9, 0.9), ('shimmer', tR + 0.1, 1.0), ('room', 66.0, 82.2), ('drip', wt('coffee', 16) + 0.5, 0.5)]
    return chapters, sfx

def main():
    a = sys.argv[1:]; vid = a[0]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    tl = json.load(open(os.path.join(ROOT, 'work', vid, 'timeline.json')))
    fps = tl['fps']; total = tl['total']
    words = json.load(open(os.path.join(ROOT, 'work', vid, 'vo', 'words.json')))
    chapters, sfx = glas4_cfg(words)
    ov = Overlay(words, chapters)
    raw = opt('--raw', os.path.join(ROOT, 'work', vid, 'raw720.mp4'))
    out = opt('--out', os.path.join(ROOT, 'out', f'{vid}.mp4'))
    grade = ('scale=1080:1920:flags=lanczos,unsharp=5:5:0.5:5:5:0.0,'
             'eq=contrast=1.06:saturation=1.1:gamma=0.98,colorbalance=rs=0.02:bs=-0.02:rm=0.03:bm=-0.03:rh=0.04:bh=-0.04,'
             'vignette=angle=0.5,noise=c0s=5:c0f=t+u')
    if '--stills' in a:
        d = os.path.join(ROOT, 'work', vid, 'post_stills'); os.makedirs(d, exist_ok=True)
        for s in opt('--stills').split(','):
            t = float(s)
            fr = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', raw, '-frames:v', '1', '-vf', grade, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
            im = Image.frombytes('RGB', (W, H), fr).convert('RGBA') if len(fr) == W * H * 3 else Image.new('RGBA', (W, H), (90, 90, 90, 255))
            Image.alpha_composite(im, ov.render(t)).convert('RGB').save(os.path.join(d, f'{t:06.2f}.jpg'), quality=88)
        return
    wavp = os.path.join(ROOT, 'work', vid, 'mix.wav')
    mix = build_audio(total, os.path.join(ROOT, 'out', 'Stimme_Glas_v2.m4a'), sfx)
    P.write_wav(wavp, mix)
    meas = subprocess.run(['ffmpeg', '-nostats', '-i', wavp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[0-9.]+) LUFS', meas)
    if m:
        g = 10 ** ((-14.0 - float(m[-1])) / 20); mix = mix * g
        pk = np.max(np.abs(mix))
        if pk > 0.89: mix = np.tanh(mix / pk * 1.2) / np.tanh(1.2) * 0.89
        P.write_wav(wavp, mix); print('loudness', m[-1], '-> -14 LUFS')
    if '--audio-only' in a: return
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', raw, '-vf', grade, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-', '-i', wavp,
                            '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                            '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    fsz = W * H * 3; f = 0
    while True:
        buf = dec.stdout.read(fsz)
        if len(buf) < fsz: break
        t = f / fps
        im = Image.alpha_composite(Image.frombytes('RGB', (W, H), buf).convert('RGBA'), ov.render(t)).convert('RGB')
        enc.stdin.write(im.tobytes()); f += 1
    enc.stdin.close(); enc.wait(); dec.wait(); print('done', out, f)

if __name__ == '__main__':
    main()
