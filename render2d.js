// 2D (SVG) renderer: node render2d.js <scene.js> --video out.mp4 | --stills 0,30 --outdir dir [--w 1080 --h 1920]
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path'); const { spawn } = require('child_process');
const ROOT = __dirname; const args = process.argv.slice(2); const scene = args[0];
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const W = parseInt(opt('w', '1080')), H = parseInt(opt('h', '1920'));
const MIME = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg' };
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  page.on('console', m => { if (m.type() === 'error') console.log('[page]', m.text()); });
  await page.route('http://render.local/**', async (route) => {
    const p = path.join(ROOT, decodeURIComponent(new URL(route.request().url()).pathname));
    try { await route.fulfill({ status: 200, body: fs.readFileSync(p), headers: { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' } }); }
    catch (e) { await route.fulfill({ status: 404, body: 'nf' }); }
  });
  await page.goto(`http://render.local/flat/stage.html?scene=/${scene}`);
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__error); if (err) { console.error('SCENE ERROR', err); process.exit(1); }
  const meta = await page.evaluate(() => window.__meta); console.log('meta', JSON.stringify(meta));
  const shot = async (f) => { await page.evaluate((f) => window.__render(f), f); return await page.screenshot({ type: 'jpeg', quality: 92 }); };
  if (opt('stills')) {
    const out = opt('outdir', 'work/stills2d'); fs.mkdirSync(out, { recursive: true });
    for (const s of opt('stills').split(',')) { const f = parseInt(s); fs.writeFileSync(path.join(out, `f_${String(f).padStart(5, '0')}.jpg`), await shot(f)); }
  }
  if (opt('video')) {
    const from = parseInt(opt('from', '0')), to = parseInt(opt('to', String(meta.totalFrames - 1)));
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(meta.fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', opt('video')], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = from; f <= to; f++) {
      const buf = await shot(f);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 150 === 0) console.log(`frame ${f}/${to} ${((Date.now() - t0) / 1000 / (f - from + 1)).toFixed(3)}s/frame`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('video done', ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
