#!/usr/bin/env python3
"""Kokoro v1.0 TTS with the installed onnxruntime (no external binaries).
Phonemes come from the model's own US-English lexicon; unknown words are reported.

  python3 -I kokoro_tts.py <voice_name> <speed> <out.wav> "<text>"
"""
import sys, re, wave
import numpy as np
import onnxruntime as ort

M = '/home/claude/dl/kokoro/kokoro-multi-lang-v1_0'
NAMES = ('af_alloy,af_aoede,af_bella,af_heart,af_jessica,af_kore,af_nicole,af_nova,af_river,af_sarah,af_sky,am_adam,am_echo,am_eric,'
         'am_fenrir,am_liam,am_michael,am_onyx,am_puck,am_santa,bf_alice,bf_emma,bf_isabella,bf_lily,bm_daniel,bm_fable,bm_george,bm_lewis').split(',')
SR = 24000

def load_tokens():
    tok = {}
    for line in open(f'{M}/tokens.txt', encoding='utf-8'):
        line = line.rstrip('\n')
        if not line: continue
        sym, idx = line.rsplit(' ', 1)
        tok[sym if sym else ' '] = int(idx)
    return tok

def load_lexicon():
    lex = {}
    for line in open(f'{M}/lexicon-us-en.txt', encoding='utf-8'):
        parts = line.rstrip('\n').split(' ')
        if len(parts) > 1 and parts[0] not in lex:
            lex[parts[0]] = parts[1:]
    return lex

TOK, LEX = load_tokens(), load_lexicon()
SESS = ort.InferenceSession(f'{M}/model.onnx', providers=['CPUExecutionProvider'])
VOICES = np.fromfile(f'{M}/voices.bin', dtype=np.float32).reshape(-1, 510, 1, 256)

VOICELESS = set('ptkfθ')
CUSTOM = {'livestream': ['l', 'ˈ', 'I', 'v', 's', 't', 'ɹ', 'ˌ', 'i', 'm'], 'livestreamed': ['l', 'ˈ', 'I', 'v', 's', 't', 'ɹ', 'ˌ', 'i', 'm', 'd'], 'eiffel': ['ˈ', 'I', 'f', 'ə', 'l'], 'burek': ['b', 'ˈ', 'u', 'ɹ', 'ɛ', 'k'], 'autobahn': ['ˈ', 'W', 't', 'O', 'b', 'ˌ', 'ɑ', 'n'], 'tiktok': ['t', 'ˈ', 'ɪ', 'k', 't', 'ˌ', 'ɑ', 'k'], 'tock': ['t', 'ˈ', 'ɑ', 'k'], 'declined': ['d', 'ə', 'k', 'l', 'ˈ', 'I', 'n', 'd'], 'wifi': ['w', 'ˈ', 'I', 'f', 'ˌ', 'I'], 'tv': ['t', 'ˌ', 'i', 'v', 'ˈ', 'i'], 'hr': ['ˌ', 'A', 'ʧ', 'ˈ', 'ɑ', 'ɹ'], 'eu': ['ˌ', 'i', 'j', 'ˈ', 'u']}
def lookup(w):
    """Lexicon lookup with simple fallbacks for plurals and 's contractions."""
    if w in CUSTOM: return CUSTOM[w]
    if w in LEX: return LEX[w]
    for suf in ("'s", 's'):
        if w.endswith(suf) and w[:-len(suf)] in LEX:
            base = LEX[w[:-len(suf)]]
            last = base[-1] if base else ''
            if last in ('s', 'z', 'ʃ', 'ʒ', 'ʧ', 'ʤ'): return base + ['ᵻ', 'z']
            return base + (['s'] if last in VOICELESS else ['z'])
    if w.endswith('es') and w[:-2] in LEX: return LEX[w[:-2]] + ['ᵻ', 'z']
    if w.endswith('est') and w[:-3] in LEX: return LEX[w[:-3]] + ['ᵻ', 's', 't']
    if w.endswith('ies') and w[:-3] + 'y' in LEX: return LEX[w[:-3] + 'y'] + ['z']
    for suf in ('d', 'ed'):
        if w.endswith(suf) and w[:-len(suf)] in LEX:
            base = LEX[w[:-len(suf)]]; last = base[-1] if base else ''
            if last in ('t', 'd'): return base + ['ᵻ', 'd']
            return base + (['t'] if last in VOICELESS | {'s', 'ʃ', 'ʧ'} else ['d'])
    return None

def phonemize(text):
    ids, missing = [], []
    for tok in re.findall(r"[A-Za-z0-9']+|[.,!?;:—-]", text):
        if tok in '.,!?;:':
            if ids and ids[-1] == TOK[' ']: ids.pop()
            ids += [TOK[tok], TOK[' ']]
            continue
        if tok in '—-':
            if ids and ids[-1] != TOK[' ']: ids.append(TOK[' '])
            continue
        ph = lookup(tok.lower())
        if ph is None:
            missing.append(tok); continue
        ids += [TOK[p] for p in ph if p in TOK] + [TOK[' ']]
    while ids and ids[-1] == TOK[' ']: ids.pop()
    return ids, missing

def synth(voice, speed, text):
    ids, missing = phonemize(text)
    if missing: raise SystemExit(f'not in lexicon: {missing}')
    sid = NAMES.index(voice)
    style = VOICES[sid, min(len(ids), 509), 0][None, :]
    out = SESS.run(None, {'tokens': np.array([[0] + ids + [0]], dtype=np.int64), 'style': style, 'speed': np.array([speed], dtype=np.float32)})[0]
    return out.astype(np.float32)

def save(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

if __name__ == '__main__':
    voice, speed, out, text = sys.argv[1], float(sys.argv[2]), sys.argv[3], sys.argv[4]
    save(out, synth(voice, speed, text)); print(out)
