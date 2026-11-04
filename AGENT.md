# What-if Video Agent – Playbook v2 "HYPE"

Channels: TikTok **@whatif..3d** + Instagram **@whati_f3d**. Faceless "What if…" videos in English, 9:16, voiceover, karaoke captions.
One run = **one new, finished video**, scheduled in FavStash on both platforms.

## 0. Why v2 (data from 3 Nov 2026)
| Video | Format | Views | Shares |
|---|---|---|---|
| Glass disappears for 5 seconds | fast, physical chaos, short | **7,504** | **26** |
| Phones disappear (Day 1–8) | slow, calm, day-by-day | 534 | 4 |
| AI switches off (clock times) | slow, calm, social | 217 | 0 |
→ Slow, calm, "slideshow" videos flop. **Hectic, physical, instantly gripping** videos work. The owner explicitly wants: hectic, gripping from the first second, no kids-channel language.

## 1. The HYPE format (default for every video)
- **Length 30–45 s.** Never over 50 s.
- **Hook in the first 1.5 s:** open with the most dramatic consequence or a direct threat to the viewer ("Bad news. You're already falling."). The question "What if X…?" is spoken fast, over chaos, never over a calm establishing shot.
- **Structure (best performer):** "X disappears / turns off / goes wrong for 5 seconds" → full-screen **countdown cards** (red, giant number, "SECOND") → after each card 1 content shot with 2–3 hard beats → "X is back. Everything stops." → a dry, funny punchline → CTA "What should disappear next? Say it in the comments, or I pick something worse."
  Variations that keep the same energy: "You have 10 seconds to…", "Every X on Earth breaks at the same time", "For 5 seconds, physics law Y switches off", suspense "rules" stories with a cliffhanger + "Part 2?".
- **Pace:** a new visual event every 1.5–3 s. Hard cuts (`runShots(..., { fade: 0.05 })`), **shake + flash + punch zoom on every impact word**, speed lines, debris, stamps, a red timer bar during the 5 seconds.
- **Look:** bright, saturated, high contrast (no dark, moody scenes). Red `#c8102e` for countdown/warnings, green `#2fae6a` for "back/safe".
- **Language:** punchy, adult, direct, a bit cocky: "Bad news.", "You're screwed.", "Yeah, that's a problem.", "Oh wait. You can't." Mild swearing (damn, hell) is fine but sparse. **Never:** slurs, insults aimed at groups, anything sexual or nudity, drugs, visible injuries/blood/gore. People can fall, crash and slide, but they end up **alive** (that's part of the punchline).
- **Voice:** speed **1.10–1.13**, gaps 0.15–0.35 s (`CH` entries), the "Second N." cards at 1.1 with 0.15 gap.
- **Audio:** loud, impactful: `boom` on each countdown card, `crash/thud/screech/glassbreak/clatter/crumble` on impacts, `riser` before big moments, `glitch/whoosh` on cuts. Render the post step with **`--mix hype`**.
- **Reference implementation:** `flat/friction5.js` + `work/friction5/sfx.json` + `work/friction5/vo/make_vo.py`. Copy its structure (countdown `card()`, `N[]`/`C[]` shot times, `bar()`, `shake()`, `punch()`, `flash()`, `stamp()`, `bigText()`, `speedLines()`, `crack()`, `debris()` from `kit3.js`).
- **Topic choice:** physical, visible chaos beats abstract/social topics. Good: materials, forces, senses, everyday objects, infrastructure (friction, gravity sideways, sound, metal, plastic, color, electricity, water surface tension…). Physics must be **plausible** (do a quick web check; don't claim things that are clearly wrong).

## 2. Rules (always apply)
- **Originality (strict):** FavStash saves are **only trend signals** (format, hook type, topic category). **Never** reuse another creator's story, characters, rules, twist, wording or shot sequence. Every script is written from scratch. If an idea is too close to a saved video, drop it. Generic formats ("X disappears for 5 seconds") are fine; their specific topic + jokes are not.
- **Facts:** everything presented as real (laws, dates, numbers, physics) is checked by web search. If unverifiable → leave it out.
- **No repeats:** read `agent_log.md` and the FavStash queue; never repeat a topic.
- TikTok/Instagram-safe as described above. No real private people; no living politicians by name.

## 3. Setup (fresh session)
```bash
git clone -b pipeline https://github.com/cwfjdzfzk5-beep/Whatiff.git /home/claude/render
cd /home/claude/render && bash setup.sh
```
For pushing, attach the repo `cwfjdzfzk5-beep/Whatiff` with push access (add_repo).

## 4. Workflow
1. **Own data first:** `analyze_social_content_performance` for TikTok (`a45a4f9f-de84-4377-b9b0-a5fdda7c649a`, days 14, sortBy views, then shares) and Instagram (`a6a01022-ebea-4118-8334-00ba37c06ccf`). Note the top 3 and the bottom 3 in `agent_log.md` (section "Performance"). Make more of what wins, less of what flops.
2. **Trends:** FavStash `list_recently_saved_content` (last 7 days) → format, hook type, topic category only.
3. **Next free slot:** `list_social_posts` (QUEUE, next 14 days, TikTok connection). First night without a post → publishAt **01:00 UTC** (= **03:00 Sofia**). The 18:00 slot belongs to the owner (he uploads manually) – **never schedule anything at 18:00**.
4. **Script** (HYPE format, 30–45 s): `work/<id>/vo/make_vo.py` from `work/friction5/vo/make_vo.py`. Numbers as words in the script; add caption rules to `DISPLAY` in `post_flat.py` (front of the list, with `\b…\b`).
5. **Voice:** `cd work/<id>/vo && mkdir -p c && python3 make_vo.py` (missing words → `CUSTOM` in `kokoro_tts.py`), then
   `ffmpeg -y -i narration_raw.wav -af "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,equalizer=f=3000:t=q:w=1:g=2,loudnorm=I=-16:TP=-1.5:LRA=7" -ar 48000 -ac 1 -c:a aac -b:a 192k narration.m4a`
   Check with `python3 asr_check.py c/cNN.wav`. If the ASR garbles a fast line, slow that line to ~1.03 or rephrase.
6. **Scene:** `flat/<id>.js` modelled on `flat/friction5.js`. **No face in the caption band:** head centre ≈ `y − 500·s` must be ≤ 1020 or ≥ 1310. No emoji/special glyphs in SVG text.
7. **Stills check:** `node render2d.js flat/<id>.js --stills <12–16 frames> --outdir /tmp/st --w 540 --h 960`, contact sheet, **look at it**: is something big happening in every frame? Faces clear of captions? Nothing cut off, nothing invisible (objects that fly off-screen too fast)? Fix and re-check.
8. **Sound:** `work/<id>/sfx.json` (list of `[name, start, end_or_duration]`). Ambiences (span): room, wind, roar, underwater, paper, flap. Effects: boom, crash, thud, screech, glassbreak, clatter, crumble, tiles, riser, glitch, cut, whoosh, zap, pop, ping, sting, shimmer, splash, powerdown, scratch, reverse, rewind, drip, peel.
9. **Render:** `node render2d.js flat/<id>.js --video work/<id>/raw.mp4 --w 1080 --h 1920 && python3 post_flat.py <id> --out out/<id>.mp4 --mix hype`. Check: `bash check_video.sh out/<id>.mp4 <10 times>` → look at the sheet; loudness ≈ −14 LUFS.
10. **Hosting:** commit to branch **videos** as `videos/<id>_v1.mp4` (`git fetch origin videos && git worktree add /tmp/vid videos`), push, then `import_post_media` with `https://raw.githubusercontent.com/cwfjdzfzk5-beep/Whatiff/videos/videos/<id>_v1.mp4`.
11. **Schedule – TikTok:** `create_social_post`, connection `a45a4f9f-de84-4377-b9b0-a5fdda7c649a`, media with `durationSeconds` and a strong `thumbnailTimestampMs` (a frame with a stamp or a big impact), settings
    `{"postingMethod":"DIRECT_POST","privacy":"PUBLIC_TO_EVERYONE","aiGenerated":true,"commercialContent":false,"allowComments":true,"allowDuets":true,"allowStitches":true,"acceptTerms":true}`
    Caption: punchy hook + emoji + 1 teaser line + question + 👇, then `#whatif #<topic> #chaos #animation #fyp`.
    **Schedule – Instagram:** second `create_social_post`, connection `a6a01022-ebea-4118-8334-00ba37c06ccf` (platform `instagram`), same media URL + publishAt, settings `{"contentType":"reel","shareToFeed":true,"isAiGenerated":true}`, same caption with `#reels` instead of `#fyp` (max 5 hashtags).
12. **Log:** `agent_log.md` (date, id, title, slot, format, performance notes) + push the pipeline branch (scene, sfx.json, make_vo.py, new DISPLAY/CUSTOM rules).
13. **Report** (`SendUserMessage`, German, short): title, day/time, 1-line summary, both platforms confirmed, what the data said; attach the mp4 (`SendUserFile`).

## 5. Stop instead of guessing
- No free slot in the next 14 days → build nothing, report.
- FavStash/GitHub errors → report, never post another way.
- A quality check fails twice → don't post; report what's wrong.
