import sys, json, re; sys.path.insert(0,'/home/claude/render')
import kokoro_tts as K, numpy as np
from scipy import signal
CH = [("Bad news. The ground just turned into quicksand. All of it. For five seconds.", 1.14, 0.2),
 ('Second one.', 1.1, 0.1),
 ("You're on the sidewalk. Now you're in the sidewalk. Knee deep. And sinking.", 1.13, 0.2),
 ('Second two.', 1.1, 0.1),
 ("Every car on the street drops to its doors. The bus? Down to the windows.", 1.13, 0.2),
 ('Second three.', 1.1, 0.1),
 ("Buildings tip over like drunk dominoes. That's real. Japan, nineteen sixty four.", 1.12, 0.2),
 ('Second four.', 1.1, 0.1),
 ("A soccer game. Twenty two players, waist deep. The ref still gives a yellow card.", 1.13, 0.2),
 ('Second five.', 1.1, 0.1),
 ("Good news. You can't fully sink. You float. Science. Bad news?", 1.1, 0.2),
 ("The ground is back. Solid. And you're still in it.", 1.07, 0.2),
 ("Pulling one foot out takes the force to lift a car. So yeah. You live here now.", 1.1, 0.22),
 ('What should turn to quicksand next? Comment it, or I pick something worse.', 1.14, 0.2)]
HE = 1.45
missing=[]
for txt,*_ in CH:
    _,m=K.phonemize(txt); missing+=m
if missing: sys.exit(f'missing {missing}')
out=[np.zeros(int(0.25*K.SR),np.float32)]; t=0.25; segs=[]; words=[]
sid=K.NAMES.index('am_fenrir')
for i,(txt,sp,gap,*fx) in enumerate(CH):
    he = HE if fx and fx[0]=='he' else 1.0
    ids=[]; spans=[]
    for tok in re.findall(r"[A-Za-z0-9']+|[.,!?;:—-]", txt):
        if tok in '.,!?;:':
            if ids and ids[-1]==K.TOK[' ']: ids.pop()
            ids+=[K.TOK[tok],K.TOK[' ']]; continue
        if tok in '—-':
            if ids and ids[-1]!=K.TOK[' ']: ids.append(K.TOK[' '])
            continue
        ph=K.lookup(tok.lower()); a0=len(ids); ids+=[K.TOK[p] for p in ph if p in K.TOK]; spans.append((tok,a0,len(ids))); ids.append(K.TOK[' '])
    while ids and ids[-1]==K.TOK[' ']: ids.pop()
    st=K.VOICES[sid,min(len(ids),509),0][None]
    a,d=K.SESS.run(None,{'tokens':np.array([[0]+ids+[0]],np.int64),'style':st,'speed':np.array([sp],np.float32)})
    a=a.astype(np.float32); nz=np.where(np.abs(a)>0.003)[0]; trim=max(0,nz[0]-int(0.05*K.SR)); endc=min(len(a),nz[-1]+int(0.15*K.SR))
    cum=np.concatenate([[0],np.cumsum(d)])*600
    for w,t0,t1 in spans: words.append({'w':w,'start':round(t+(cum[t0+1]-trim)/K.SR/he,3),'end':round(t+(cum[t1+1]-trim)/K.SR/he,3),'seg':i})
    a=a[trim:endc]
    if he!=1.0: a=signal.resample_poly(a,20,int(round(20*he))).astype(np.float32)
    f=int(0.01*K.SR); a[:f]*=np.linspace(0,1,f); a[-f:]*=np.linspace(1,0,f)
    K.save(f'c/c{i:02d}.wav',a); segs.append({'i':i,'text':txt,'start':round(t,3),'end':round(t+len(a)/K.SR,3)})
    out+=[a,np.zeros(int(gap*K.SR),np.float32)]; t+=len(a)/K.SR+gap
x=np.concatenate(out)
r=np.random.RandomState(4); n=int(0.35*K.SR); tt=np.arange(n)/K.SR
ir=r.randn(n)*np.exp(-tt*6.91/0.22); ir[:int(0.008*K.SR)]=0
b,a_=signal.butter(2,5000/(K.SR/2)); ir=signal.lfilter(b,a_,ir)
wet=signal.fftconvolve(x,ir)[:len(x)]; wet*=np.sqrt(np.mean(x**2))/(np.sqrt(np.mean(wet**2))+1e-9)*0.06
x=x+wet; x=x/np.max(np.abs(x))*0.9
K.save('narration_raw.wav',x); json.dump(segs,open('segs.json','w'),indent=1); json.dump(words,open('words.json','w'),indent=0)
print('total %.1f s, %d words'%(len(x)/K.SR, len(words)))
