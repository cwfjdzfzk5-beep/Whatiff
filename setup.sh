#!/bin/bash
# One-time setup for a fresh session: models + python deps. Run from the repo root (the clone must live at /home/claude/render).
set -e
mkdir -p /home/claude/dl/kokoro /home/claude/dl/whisper
if [ ! -f /home/claude/dl/kokoro/kokoro-multi-lang-v1_0/model.onnx ]; then
  curl -sSL -o /home/claude/dl/kokoro/k.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2
  tar -xjf /home/claude/dl/kokoro/k.tar.bz2 -C /home/claude/dl/kokoro && rm /home/claude/dl/kokoro/k.tar.bz2
fi
if [ ! -d /home/claude/dl/whisper/sherpa-onnx-whisper-base.en ]; then
  curl -sSL -o /home/claude/dl/whisper/w.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-base.en.tar.bz2
  tar -xjf /home/claude/dl/whisper/w.tar.bz2 -C /home/claude/dl/whisper && rm /home/claude/dl/whisper/w.tar.bz2
fi
python3 -c "import onnxruntime, scipy, PIL, numpy" 2>/dev/null || pip install --break-system-packages -q onnxruntime scipy pillow numpy
node -e "require('playwright')" 2>/dev/null || echo "WARN: playwright not found (it should be pre-installed)"
mkdir -p out work
echo "setup ok"
