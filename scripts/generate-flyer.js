// scripts/generate-flyer.js
// Generates public/volante.pdf — run with: npm run generate-flyer
import puppeteer from 'puppeteer-core';
import QRCode from 'qrcode';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUTPUT_PATH = join(__dirname, '../public/volante.pdf');

const qrSvg = await QRCode.toString('https://nomaspaciente.com.mx', {
  type: 'svg',
  width: 120,
  margin: 0,
  color: { dark: '#2C1810', light: '#FFFFFF' },
});

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 210mm;
    min-height: 297mm;
    background: #FFFFFF;
    color: #2C1810;
    font-family: system-ui, -apple-system, Arial, sans-serif;
  }

  .hero {
    background: linear-gradient(135deg, #3D3066 0%, #2A2050 100%);
    padding: 28px 32px 24px;
    position: relative;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #B85A18 0%, #C47F0A 50%, #B85A18 100%);
  }

  .hero-title {
    font-size: 36pt;
    font-weight: 900;
    color: #FFFFFF;
    line-height: 1.0;
    letter-spacing: -1px;
  }

  .hero-title .accent { color: #C47F0A; }

  .hero-tagline {
    font-size: 11pt;
    color: rgba(255,255,255,0.7);
    margin-top: 6px;
  }

  .hook {
    background: #B85A18;
    padding: 14px 32px;
    text-align: center;
  }

  .hook-text {
    font-size: 14pt;
    font-weight: 700;
    color: #FFFFFF;
  }

  .content { padding: 20px 28px 16px; }

  .section-label {
    font-size: 8pt;
    font-weight: 700;
    color: #3D3066;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 14px;
  }

  .violations-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 16px;
    margin-bottom: 20px;
  }

  .violation {
    background: #FAF6F0;
    border-radius: 8px;
    padding: 12px 14px;
    border-left: 4px solid #B85A18;
    position: relative;
  }

  .violation-num {
    position: absolute;
    top: 8px;
    right: 10px;
    font-size: 20pt;
    font-weight: 900;
    color: rgba(61,48,102,0.08);
    line-height: 1;
  }

  .violation-q {
    font-size: 10pt;
    font-weight: 700;
    color: #2C1810;
    line-height: 1.35;
    margin-bottom: 4px;
  }

  .violation-a {
    font-size: 8.5pt;
    color: #6B5E54;
    line-height: 1.4;
  }

  .violation-ref {
    display: inline-block;
    background: #3D3066;
    color: #FFFFFF;
    font-size: 7pt;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    margin-top: 4px;
    letter-spacing: 0.3px;
  }

  .emergency {
    background: #8B202010;
    border: 2px solid #8B2020;
    border-radius: 8px;
    padding: 12px 18px;
    margin-bottom: 18px;
    text-align: center;
  }

  .emergency-title {
    font-size: 12pt;
    font-weight: 700;
    color: #8B2020;
  }

  .emergency-text {
    font-size: 9pt;
    color: #2C1810;
    margin-top: 4px;
  }

  .emergency-phone {
    font-size: 14pt;
    font-weight: 900;
    color: #8B2020;
    font-family: monospace;
    margin-top: 4px;
  }

  .cta-strip {
    background: #FDF5EE;
    border: 2px solid #C47F0A;
    border-radius: 8px;
    padding: 12px 18px;
    margin-bottom: 18px;
    text-align: center;
  }

  .cta-text {
    font-size: 11pt;
    font-weight: 700;
    color: #B85A18;
  }

  .cta-sub {
    font-size: 8.5pt;
    color: #6B5E54;
    margin-top: 2px;
  }

  .bottom {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    padding: 0 4px;
  }

  .phones { flex: 1; }

  .phones-title {
    font-size: 8pt;
    font-weight: 700;
    color: #3D3066;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  .phone-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    background: #FAF6F0;
    border-radius: 6px;
    padding: 8px 12px;
  }

  .phone-badge {
    background: #3D3066;
    color: #FFFFFF;
    font-size: 7pt;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    min-width: 72px;
    text-align: center;
  }

  .phone-info { flex: 1; }

  .phone-number {
    font-size: 11pt;
    font-weight: 800;
    color: #2C1810;
    font-family: monospace;
  }

  .phone-desc {
    font-size: 7.5pt;
    color: #6B5E54;
  }

  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    background: #FAF6F0;
    border-radius: 10px;
    padding: 14px 18px;
    border: 2px dashed #E0D5C8;
  }

  .qr-section svg {
    width: 100px;
    height: 100px;
    display: block;
  }

  .qr-label {
    font-size: 7.5pt;
    color: #6B5E54;
    text-align: center;
    font-weight: 500;
  }

  .qr-url {
    font-size: 10pt;
    font-weight: 800;
    color: #3D3066;
    text-align: center;
    font-family: monospace;
  }

  .footer {
    margin-top: 14px;
    padding: 10px 28px;
    background: #FAF6F0;
    font-size: 7pt;
    color: #6B5E54;
    text-align: center;
    line-height: 1.5;
  }
</style>
</head>
<body>

  <div class="hero">
    <div class="hero-title"><span class="accent">No Mas </span>Paciente</div>
    <div class="hero-tagline">Conoce tus derechos de salud. No te dejes.</div>
  </div>

  <div class="hook">
    <div class="hook-text">\u00bfTe ha pasado alguna de estas situaciones?</div>
  </div>

  <div class="content">

    <div class="section-label">7 derechos que el hospital no quiere que conozcas</div>

    <div class="violations-grid">
      <div class="violation">
        <div class="violation-num">1</div>
        <div class="violation-q">\u00bfTe rechazaron en urgencias?</div>
        <div class="violation-a">Ning\u00fan hospital puede negarte atenci\u00f3n de urgencias. No importa si tienes seguro o dinero.</div>
        <div class="violation-ref">NOM-027-SSA3-2013</div>
      </div>
      <div class="violation">
        <div class="violation-num">2</div>
        <div class="violation-q">\u00bfLa farmacia te dijo "no hay"?</div>
        <div class="violation-a">La instituci\u00f3n est\u00e1 obligada a surtir tu medicamento del Cuadro B\u00e1sico. Rep\u00f3rtalo en recetacompleta.gob.mx o marca 079.</div>
        <div class="violation-ref">LSS Art. 91</div>
      </div>
      <div class="violation">
        <div class="violation-num">3</div>
        <div class="violation-q">\u00bfTe operaron sin explicarte los riesgos?</div>
        <div class="violation-a">El consentimiento informado es obligatorio. Puedes negarte a cualquier procedimiento.</div>
        <div class="violation-ref">NOM-004-SSA3-2012</div>
      </div>
      <div class="violation">
        <div class="violation-num">4</div>
        <div class="violation-q">\u00bfEmbarazada y rechazada en el hospital?</div>
        <div class="violation-a">Cualquier hospital p\u00fablico DEBE atender urgencias obst\u00e9tricas sin importar derechohabiencia.</div>
        <div class="violation-ref">LSS Art. 89 Fr. V</div>
      </div>
      <div class="violation">
        <div class="violation-num">5</div>
        <div class="violation-q">\u00bfEl m\u00e9dico te trat\u00f3 mal o te ignor\u00f3?</div>
        <div class="violation-a">Tienes derecho a trato digno y respetuoso. La queja es gratuita.</div>
        <div class="violation-ref">LGS Art. 51</div>
      </div>
      <div class="violation">
        <div class="violation-num">6</div>
        <div class="violation-q">\u00bfTe cobraron por atenci\u00f3n que deber\u00eda ser gratis?</div>
        <div class="violation-a">IMSS-Bienestar es gratuito para personas sin seguridad social. No pueden cobrarte.</div>
        <div class="violation-ref">LGS Art. 77 Bis 1</div>
      </div>
      <div class="violation">
        <div class="violation-num">7</div>
        <div class="violation-q">\u00bfNo te dan copia de tu expediente?</div>
        <div class="violation-a">T\u00fa eres el titular de tu informaci\u00f3n m\u00e9dica. Puedes pedir copia en cualquier momento.</div>
        <div class="violation-ref">NOM-004-SSA3-2012</div>
      </div>
    </div>

    <div class="emergency">
      <div class="emergency-title">\u00bfTE EST\u00c1N RECHAZANDO AHORA MISMO?</div>
      <div class="emergency-text">Llama a la CNDH \u2014 tienen guardia 24 horas con facultad de intervenci\u00f3n inmediata</div>
      <div class="emergency-phone">800 715 2000</div>
    </div>

    <div class="cta-strip">
      <div class="cta-text">La ley te protege m\u00e1s de lo que crees. Escanea el c\u00f3digo para saber exactamente qu\u00e9 hacer.</div>
      <div class="cta-sub">Gu\u00eda completa con los art\u00edculos exactos y los tel\u00e9fonos de queja \u2014 gratis, sin registro.</div>
    </div>

    <div class="bottom">
      <div class="phones">
        <div class="phones-title">Ayuda gratuita</div>
        <div class="phone-item">
          <div class="phone-badge">CONAMED</div>
          <div class="phone-info">
            <div class="phone-number">800 711 0658</div>
            <div class="phone-desc">Quejas m\u00e9dicas \u2014 conciliaci\u00f3n gratuita</div>
          </div>
        </div>
        <div class="phone-item">
          <div class="phone-badge">CNDH</div>
          <div class="phone-info">
            <div class="phone-number">800 715 2000</div>
            <div class="phone-desc">Derechos humanos \u2014 24 horas</div>
          </div>
        </div>
        <div class="phone-item">
          <div class="phone-badge">IMSS</div>
          <div class="phone-info">
            <div class="phone-number">800 623 2323</div>
            <div class="phone-desc">Atenci\u00f3n al derechohabiente</div>
          </div>
        </div>
        <div class="phone-item">
          <div class="phone-badge">RECETA</div>
          <div class="phone-info">
            <div class="phone-number">079</div>
            <div class="phone-desc">Reportar medicamento no surtido</div>
          </div>
        </div>
      </div>
      <div class="qr-section">
        ${qrSvg}
        <div class="qr-label">Escanea con tu celular</div>
        <div class="qr-url">nomaspaciente.com.mx</div>
      </div>
    </div>

  </div>

  <div class="footer">
    Constituci\u00f3n Art. 4 (reforma marzo 2025) \u00b7 Ley General de Salud \u00b7 NOM-027-SSA3-2013 \u00b7 NOM-004-SSA3-2012
    \u00b7 Este volante es informativo, no es asesor\u00eda legal ni m\u00e9dica. \u00b7 Comp\u00e1rtelo con quien lo necesite.
  </div>

</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });

const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

await browser.close();

mkdirSync(join(__dirname, '../public'), { recursive: true });
writeFileSync(OUTPUT_PATH, pdfBuffer);

const sizeKB = (pdfBuffer.length / 1024).toFixed(1);
console.log(`Generated volante.pdf — ${pdfBuffer.length} bytes (${sizeKB} KB)`);

if (pdfBuffer.length > 500 * 1024) {
  console.error('WARNING: PDF exceeds 500KB limit for WhatsApp sharing!');
  process.exit(1);
}
