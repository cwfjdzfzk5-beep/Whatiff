#!/usr/bin/env python3
"""Whisper (sherpa-onnx export) greedy transcription with onnxruntime + numpy, to check TTS intelligibility.
  python3 -I asr_check.py file.wav [file2.wav ...]
"""
import sys, base64, wave
import numpy as np
import onnxruntime as ort
from scipy import signal

D = '/home/claude/dl/whisper/sherpa-onnx-whisper-base.en'
enc = ort.InferenceSession(f'{D}/base.en-encoder.onnx', providers=['CPUExecutionProvider'])
dec = ort.InferenceSession(f'{D}/base.en-decoder.onnx', providers=['CPUExecutionProvider'])
meta = enc.get_modelmeta().custom_metadata_map
NL, CTX, ST = int(meta['n_text_layer']), int(meta['n_text_ctx']), int(meta['n_text_state'])
SOT, EOT, NOTS = int(meta['sot']), int(meta['eot']), int(meta['no_timestamps'])
SOT_SEQ = list(map(int, meta['sot_sequence'].split(','))) + [NOTS]
TOK = {}
for line in open(f'{D}/base.en-tokens.txt'):
    t, i = line.split(); TOK[int(i)] = t

def mel_filters(sr=16000, n_fft=400, n_mels=80):
    def hz2mel(f):
        f = np.asarray(f, float); m = f / (200.0 / 3)
        return np.where(f >= 1000, 15 + np.log(np.maximum(f, 1e-9) / 1000) / (np.log(6.4) / 27), m)
    def mel2hz(m):
        m = np.asarray(m, float); f = m * 200.0 / 3
        return np.where(m >= 15, 1000 * np.exp((np.log(6.4) / 27) * (m - 15)), f)
    fft_f = np.linspace(0, sr / 2, n_fft // 2 + 1)
    mpts = mel2hz(np.linspace(hz2mel(0), hz2mel(sr / 2), n_mels + 2))
    fd = np.diff(mpts); ramps = mpts[:, None] - fft_f[None, :]
    W = np.maximum(0, np.minimum(-ramps[:-2] / fd[:-1, None], ramps[2:] / fd[1:, None]))
    W *= (2.0 / (mpts[2:n_mels + 2] - mpts[:n_mels]))[:, None]
    return W

MEL = mel_filters()

def features(x):
    x = np.pad(x, (200, 200), mode='reflect')
    win = np.hanning(401)[:-1]
    n = 1 + (len(x) - 400) // 160
    frames = np.stack([x[i * 160:i * 160 + 400] * win for i in range(n)])
    pw = np.abs(np.fft.rfft(frames, axis=1)) ** 2
    ls = np.log10(np.maximum(pw @ MEL.T, 1e-10))
    ls = np.maximum(ls, ls.max() - 8.0); m = (ls + 4.0) / 4.0
    m = np.pad(m, ((0, 1500), (0, 0)))
    if m.shape[0] > 3000: m = np.pad(m[:2950], ((0, 50), (0, 0)))
    return m.T[None].astype(np.float32)

def load(path):
    w = wave.open(path); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    if sr != 16000: x = signal.resample_poly(x, 16000, sr).astype(np.float32)
    return x

def transcribe(x):
    ck, cv = enc.run(None, {enc.get_inputs()[0].name: features(x)})
    sk = np.zeros((NL, 1, CTX, ST), np.float32); sv = np.zeros_like(sk)
    names = [i.name for i in dec.get_inputs()]
    toks = np.array([SOT_SEQ], np.int64); off = np.zeros(1, np.int64); out = []
    for step in range(200):
        lg, sk, sv = dec.run(None, {names[0]: toks, names[1]: sk, names[2]: sv, names[3]: ck, names[4]: cv, names[5]: off})[:3]
        off = off + toks.shape[1]
        l = lg[0, -1].copy(); l[[NOTS, SOT]] = -np.inf
        t = int(l.argmax())
        if t == EOT: break
        out.append(t); toks = np.array([[t]], np.int64)
    return b''.join(base64.b64decode(TOK[t]) for t in out if t in TOK).decode('utf-8', 'replace').strip()

if __name__ == '__main__':
    for p in sys.argv[1:]:
        print(p.split('/')[-1], '->', transcribe(load(p)))
