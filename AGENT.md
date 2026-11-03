# What-if Video Agent – Playbook

Channel: TikTok **@whatif..3d**. These are faceless "What if…" story videos in English, 9:16 format, 55–80 s long, with a voiceover, karaoke captions and a flat cinematic 2D look.
One run = **one new, finished video**, scheduled in FavStash.

## 1. Rules (always apply)
- **Style:** mature and cinematic, not childish, not like a school presentation. Keep it youthful and positive, and don't make it demotivating. Realistic everyday details, a little dry humour, and a twist or emotional beat at the end.
- **TikTok-safe:** no violence or injury shown, nothing sexual, no drugs, no hate, no real private people. Don't mention living politicians by name. History and laws are fine when stated factually.
- **Originality (strict):** FavStash saves are **only trend signals**. You may take a *format* from them (e.g. "Day 1 … Day 7", "rules", "one modern object in the past") or a *topic category*. You may **never** take another creator's story, characters, rules, plot twist, wording or scene sequence. Every script is written from scratch. If an idea is too close to a saved video, drop it.
- **Facts:** everything presented as real (laws, dates, numbers) is checked by web search before writing. If it can't be verified, leave it out.
- **No repeats:** read `agent_log.md` (pipeline branch) and the FavStash queue. Don't reuse a topic that was already made.

## 2. Setup (fresh session)
```bash
# Pipeline (this branch) must live at /home/claude/render
git clone -b pipeline https://github.com/cwfjdzfzk5-beep/Whatiff.git /home/claude/render
cd /home/claude/render && bash setup.sh
```
For pushing, attach the repo `cwfjdzfzk5-beep/Whatiff` with push access (add_repo).

## 3. Workflow
1. **Find trends:** FavStash `list_recently_saved_content` (last 7 days) → note format, hook type and topic category. If there are no new saves, use your own idea that fits the channel.
2. **Find the next free slot:** `list_social_posts` (state QUEUE, next 14 days). The first day without a post, publishAt **16:00 UTC** (= 18:00 Sofia).
3. **Script:** 14–17 segments (`CH` in `work/<id>/vo/make_vo.py`, copied from `work/_template/vo/make_vo.py`). Structure: hook question → time markers ("Seven a m.", "Day two.", "Month one.") each followed by 1–3 short sentences → ending beat → CTA "… Tell me in the comments." Write numbers as words (the TTS reads them; the captions convert them via `DISPLAY` in `post_flat.py`).
4. **Voice:** `cd work/<id>/vo && mkdir -p c && python3 make_vo.py`. If words are missing, add a `CUSTOM` entry in `kokoro_tts.py`. Then:
   `ffmpeg -y -i narration_raw.wav -af "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,equalizer=f=3000:t=q:w=1:g=2,loudnorm=I=-16:TP=-1.5:LRA=7" -ar 48000 -ac 1 -c:a aac -b:a 192k narration.m4a`
   Check: `python3 asr_check.py c/c02.wav` (word accuracy).
5. **Captions:** add new number phrases to `DISPLAY` (at the front of the list, with `\b…\b`). Test with `python3 -c "import post_flat as P; print(P._display('...'))"`.
6. **Scene:** `flat/<id>.js`, modelled on `flat/berlin89.js`, `salary.js`, `nocars.js`. Use `kit3.js` helpers (chip, note, clock, crowd, bubbles…) and `runShots` (crossfades, blinking, dust, camera drift). One shot per time marker, pills at the top (`pill('DAY 2')`), and animations keyed to word times (`wt('word', seg)`).
   **Important:** no face in the caption band. Head centre ≈ `y − 500·s` must be ≤ 1020 or ≥ 1310 (e.g. `s 1.0 / y 1480` or `s 1.35 / y 1990`). Avoid emoji and special glyphs in SVG text.
7. **Stills check:** `node render2d.js flat/<id>.js --stills 90,300,… --outdir /tmp/st --w 540 --h 960`, put them on a contact sheet and **look at it**: faces, overlaps, empty shots, things cut off. Fix and check again.
8. **Sound:** `work/<id>/sfx.json` = list `[name, start, end_or_duration]`. Ambiences (span: start→end): room, wind, roar, underwater. Effects (duration): pop 0.08, ping 0.6, zap 0.3, whoosh 0.6, shimmer 1.2, sting 1.0, splash 1.0, powerdown 1.2. One ambience per shot, effects on the important words.
9. **Render:** `node render2d.js flat/<id>.js --video work/<id>/raw.mp4 --w 1080 --h 1920 && python3 post_flat.py <id> --out out/<id>.mp4` (≈ 10 min). Check: `bash check_video.sh out/<id>.mp4 <8–10 times>` → look at `out/<id>_sheet.jpg`, loudness ≈ −14 LUFS.
10. **Hosting:** commit the video to branch **videos** under `videos/<id>_v1.mp4` (`git fetch origin videos && git worktree add /tmp/vid videos`), then push. Then FavStash `import_post_media` with `https://raw.githubusercontent.com/cwfjdzfzk5-beep/Whatiff/videos/videos/<id>_v1.mp4`.
11. **Schedule:** `create_social_post`, TikTok connection `a45a4f9f-de84-4377-b9b0-a5fdda7c649a`, publishAt from step 2, media with `durationSeconds` and a strong `thumbnailTimestampMs`, settings:
    `{"postingMethod":"DIRECT_POST","privacy":"PUBLIC_TO_EVERYONE","aiGenerated":true,"commercialContent":false,"allowComments":true,"allowDuets":true,"allowStitches":true,"acceptTerms":true}`
    Caption: hook question + 1 emoji + 1 sentence of teaser + question to the viewer + 👇, then `#whatif #<topic> #story #animation #fyp`.
12. **Log:** add a line to `agent_log.md` (date, id, title, slot, inspiration format), commit and push to the **pipeline** branch, including new DISPLAY/CUSTOM rules and the scene file.
13. **Report:** send a short message (`SendUserMessage`) in German: which video, which day, what it's about, and the file to preview.

## 4. Stop instead of guessing
- No free slot in the next 14 days → build nothing, report it.
- FavStash not connected / errors → report it, don't post anything another way.
- If a check fails twice (e.g. a face is still under the captions), fix it before scheduling, never post it unchecked.
