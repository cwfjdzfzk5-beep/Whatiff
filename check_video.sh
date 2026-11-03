#!/bin/bash
# usage: check_video.sh <mp4> <times...>  -> contact sheet next to the video + loudness
v=$1; shift; d=$(mktemp -d); i=0
for t in "$@"; do ffmpeg -v error -ss $t -i "$v" -frames:v 1 -vf scale=270:480 "$d/$(printf %02d $i).jpg"; i=$((i+1)); done
python3 -c "
from PIL import Image; import glob,sys
fs=sorted(glob.glob('$d/*.jpg')); n=len(fs); cols=min(8,n); rows=(n+cols-1)//cols
sh=Image.new('RGB',(270*cols,480*rows))
for k,f in enumerate(fs): sh.paste(Image.open(f),((k%cols)*270,(k//cols)*480))
sh.save('${v%.mp4}_sheet.jpg',quality=88)"
ffmpeg -nostats -i "$v" -af ebur128 -f null - 2>&1 | grep -E "I:|LRA:|Peak" | tail -3
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate,codec_name -of compact "$v"
