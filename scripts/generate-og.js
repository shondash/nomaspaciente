// scripts/generate-og.js
// One-time OG image generator — run with: npm run generate-og
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUTPUT_PATH = join(__dirname, '../public/og-image.webp');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: linear-gradient(135deg, #3D3066 0%, #2A2050 100%);
    font-family: system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 80px;
  }
  .bar {
    width: 80px;
    height: 6px;
    background: #B85A18;
    margin-bottom: 40px;
    border-radius: 3px;
  }
  .title {
    font-size: 88px;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 1.0;
    letter-spacing: -0.02em;
  }
  .accent { color: #C47F0A; }
  .tagline {
    font-size: 32px;
    font-weight: 400;
    color: #C4B8D8;
    margin-top: 24px;
    line-height: 1.4;
  }
  .badge {
    margin-top: 40px;
    display: inline-block;
    padding: 8px 20px;
    border: 2px solid #B85A18;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 700;
    color: #B85A18;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="bar"></div>
  <div class="title"><span class="accent">No Mas</span> Paciente</div>
  <div class="tagline">Conoce tus derechos de salud. No te dejes.</div>
  <div class="badge">Guia gratuita &middot; IMSS &middot; ISSSTE &middot; IMSS-Bienestar</div>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  defaultViewport: { width: 1200, height: 630 },
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });

let buffer;
try {
  buffer = await page.screenshot({ type: 'webp', quality: 85 });
} catch {
  const pngBuffer = await page.screenshot({ type: 'png' });
  const { default: sharp } = await import('sharp');
  buffer = await sharp(pngBuffer).webp({ quality: 85 }).toBuffer();
}

await browser.close();

mkdirSync(join(__dirname, '../public'), { recursive: true });
writeFileSync(OUTPUT_PATH, buffer);

const sizeKB = (buffer.length / 1024).toFixed(1);
console.log(`Generated og-image.webp — ${buffer.length} bytes (${sizeKB} KB)`);

if (buffer.length > 300 * 1024) {
  console.error('WARNING: Image exceeds 300KB WhatsApp limit!');
  process.exit(1);
}
