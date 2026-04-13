// scripts/generate-pwa-icons.js
// Generates PWA icons from an HTML template — run with: node scripts/generate-pwa-icons.js
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PUBLIC = join(__dirname, '../public');

const iconHtml = (size, maskable = false) => `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${size}px;
    height: ${size}px;
    background: ${maskable ? '#3D3066' : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: system-ui, sans-serif;
  }
  .icon {
    width: ${maskable ? size * 0.6 : size * 0.8}px;
    height: ${maskable ? size * 0.6 : size * 0.8}px;
    background: linear-gradient(135deg, #3D3066 0%, #2A2050 100%);
    border-radius: ${maskable ? '0' : Math.round(size * 0.18) + 'px'};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${Math.round(size * 0.08)}px;
  }
  .bar {
    width: ${Math.round(size * 0.15)}px;
    height: ${Math.round(size * 0.015)}px;
    background: #B85A18;
    border-radius: 2px;
    margin-bottom: ${Math.round(size * 0.03)}px;
  }
  .text {
    font-size: ${Math.round(size * 0.12)}px;
    font-weight: 800;
    color: #FFF;
    line-height: 1;
    text-align: center;
    letter-spacing: -0.02em;
  }
  .accent { color: #C47F0A; }
  .sub {
    font-size: ${Math.round(size * 0.04)}px;
    color: #C4B8D8;
    margin-top: ${Math.round(size * 0.02)}px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-weight: 700;
  }
</style>
</head>
<body>
  <div class="icon">
    <div class="bar"></div>
    <div class="text"><span class="accent">NM</span>P</div>
    <div class="sub">Salud</div>
  </div>
</body>
</html>`;

const sizes = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'maskable-icon-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon-180x180.png', size: 180, maskable: false },
];

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

mkdirSync(PUBLIC, { recursive: true });

for (const { name, size, maskable } of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size });
  await page.setContent(iconHtml(size, maskable), { waitUntil: 'networkidle0' });
  const buffer = await page.screenshot({ type: 'png', omitBackground: !maskable });
  writeFileSync(join(PUBLIC, name), buffer);
  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`${name} — ${kb} KB`);
  await page.close();
}

await browser.close();
console.log('All PWA icons generated.');
