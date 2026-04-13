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
    height: 297mm;
    overflow: hidden;
    background: #FFFFFF;
    color: #2C1810;
    font-family: system-ui, -apple-system, Arial, sans-serif;
  }

  .hero {
    background: linear-gradient(135deg, #3D3066 0%, #2A2050 100%);
    padding: 16px 28px 12px;
    position: relative;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #B85A18 0%, #C47F0A 50%, #B85A18 100%);
  }

  .hero-title {
    font-size: 30pt;
    font-weight: 900;
    color: #FFFFFF;
    line-height: 1.0;
    letter-spacing: -1px;
  }

  .hero-title .accent { color: #C47F0A; }

  .hero-tagline {
    font-size: 9pt;
    color: rgba(255,255,255,0.7);
    margin-top: 3px;
  }

  .hook {
    background: #B85A18;
    padding: 8px 28px;
    text-align: center;
  }

  .hook-text {
    font-size: 11pt;
    font-weight: 700;
    color: #FFFFFF;
  }

  .content { padding: 12px 24px 8px; }

  .section-label {
    font-size: 7pt;
    font-weight: 700;
    color: #3D3066;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }

  .violations-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 12px;
    margin-bottom: 10px;
  }

  .violation {
    background: #FAF6F0;
    border-radius: 6px;
    padding: 7px 10px;
    border-left: 3px solid #B85A18;
  }

  .violation-q {
    font-size: 8.5pt;
    font-weight: 700;
    color: #2C1810;
    line-height: 1.25;
    margin-bottom: 2px;
  }

  .violation-a {
    font-size: 7pt;
    color: #6B5E54;
    line-height: 1.3;
  }

  .violation-ref {
    display: inline-block;
    background: #3D3066;
    color: #FFFFFF;
    font-size: 6pt;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 2px;
    margin-top: 2px;
    letter-spacing: 0.3px;
  }

  .mid-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .emergency {
    flex: 1;
    background: #8B202010;
    border: 2px solid #8B2020;
    border-radius: 6px;
    padding: 8px 12px;
    text-align: center;
  }

  .emergency-title {
    font-size: 9pt;
    font-weight: 700;
    color: #8B2020;
  }

  .emergency-text {
    font-size: 7pt;
    color: #2C1810;
    margin-top: 2px;
  }

  .emergency-phone {
    font-size: 13pt;
    font-weight: 900;
    color: #8B2020;
    font-family: monospace;
    margin-top: 2px;
  }

  .cta-strip {
    flex: 1;
    background: #FDF5EE;
    border: 2px solid #C47F0A;
    border-radius: 6px;
    padding: 8px 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cta-text {
    font-size: 8.5pt;
    font-weight: 700;
    color: #B85A18;
    line-height: 1.3;
  }

  .cta-sub {
    font-size: 7pt;
    color: #6B5E54;
    margin-top: 2px;
  }

  .bottom {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .phones { flex: 1; }

  .phones-title {
    font-size: 7pt;
    font-weight: 700;
    color: #3D3066;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 6px;
  }

  .phone-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    background: #FAF6F0;
    border-radius: 4px;
    padding: 4px 8px;
  }

  .phone-badge {
    background: #3D3066;
    color: #FFFFFF;
    font-size: 6pt;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 3px;
    white-space: nowrap;
    min-width: 56px;
    text-align: center;
  }

  .phone-info { flex: 1; }

  .phone-number {
    font-size: 9pt;
    font-weight: 800;
    color: #2C1810;
    font-family: monospace;
  }

  .phone-desc {
    font-size: 6.5pt;
    color: #6B5E54;
  }

  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: #FAF6F0;
    border-radius: 8px;
    padding: 10px 14px;
    border: 2px dashed #E0D5C8;
  }

  .qr-section svg {
    width: 80px;
    height: 80px;
    display: block;
  }

  .qr-label {
    font-size: 6.5pt;
    color: #6B5E54;
    text-align: center;
  }

  .qr-url {
    font-size: 8pt;
    font-weight: 800;
    color: #3D3066;
    text-align: center;
    font-family: monospace;
  }

  .footer {
    margin-top: 8px;
    padding: 6px 24px;
    background: #FAF6F0;
    font-size: 6pt;
    color: #6B5E54;
    text-align: center;
    line-height: 1.4;
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
        <div class="violation-q">\u00bfTe rechazaron en urgencias?</div>
        <div class="violation-a">Ning\u00fan hospital puede negarte atenci\u00f3n de urgencias. No importa si tienes seguro o dinero.</div>
        <div class="violation-ref">NOM-027-SSA3-2013</div>
      </div>
      <div class="violation">
        <div class="violation-q">\u00bfLa farmacia te dijo "no hay"?</div>
        <div class="violation-a">Deben surtir tu medicamento del Cuadro B\u00e1sico. Rep\u00f3rtalo: recetacompleta.gob.mx o 079.</div>
        <div class="violation-ref">LSS Art. 91</div>
      </div>
      <div class="violation">
        <div class="violation-q">\u00bfTe operaron sin explicarte?</div>
        <div class="violation-a">El consentimiento informado es obligatorio. Puedes negarte a cualquier procedimiento.</div>
        <div class="violation-ref">NOM-004-SSA3-2012</div>
      </div>
      <div class="violation">
        <div class="violation-q">\u00bfEmbarazada y rechazada?</div>
        <div class="violation-a">Cualquier hospital p\u00fablico DEBE atender urgencias obst\u00e9tricas sin importar derechohabiencia.</div>
        <div class="violation-ref">LSS Art. 89 Fr. V</div>
      </div>
      <div class="violation">
        <div class="violation-q">\u00bfMaltrato o discriminaci\u00f3n?</div>
        <div class="violation-a">Tienes derecho a trato digno y respetuoso. La queja es gratuita ante CONAMED.</div>
        <div class="violation-ref">LGS Art. 51</div>
      </div>
      <div class="violation">
        <div class="violation-q">\u00bfTe cobraron algo que es gratis?</div>
        <div class="violation-a">IMSS-Bienestar es gratuito para personas sin seguridad social.</div>
        <div class="violation-ref">LGS Art. 77 Bis 1</div>
      </div>
      <div class="violation">
        <div class="violation-q">\u00bfNo te dan tu expediente?</div>
        <div class="violation-a">T\u00fa eres el titular. Puedes pedir copia completa en cualquier momento.</div>
        <div class="violation-ref">NOM-004-SSA3-2012</div>
      </div>
      <div class="violation">
        <div class="violation-q">\u00bfCita con especialista en meses?</div>
        <div class="violation-a">Si tu condici\u00f3n lo requiere, deben referirte a segundo nivel. Pide que lo documenten.</div>
        <div class="violation-ref">LGS Art. 51</div>
      </div>
    </div>

    <div class="mid-row">
      <div class="emergency">
        <div class="emergency-title">\u00bfTE EST\u00c1N RECHAZANDO AHORA?</div>
        <div class="emergency-text">CNDH \u2014 guardia 24 horas, intervenci\u00f3n inmediata</div>
        <div class="emergency-phone">800 715 2000</div>
      </div>
      <div class="cta-strip">
        <div class="cta-text">La ley te protege. Escanea el c\u00f3digo para la gu\u00eda completa.</div>
        <div class="cta-sub">Art\u00edculos exactos + tel\u00e9fonos de queja \u2014 gratis, sin registro.</div>
      </div>
    </div>

    <div class="bottom">
      <div class="phones">
        <div class="phones-title">Ayuda gratuita</div>
        <div class="phone-item">
          <div class="phone-badge">CONAMED</div>
          <div class="phone-info">
            <div class="phone-number">800 711 0658</div>
            <div class="phone-desc">Quejas m\u00e9dicas \u2014 gratuito</div>
          </div>
        </div>
        <div class="phone-item">
          <div class="phone-badge">CNDH</div>
          <div class="phone-info">
            <div class="phone-number">800 715 2000</div>
            <div class="phone-desc">Derechos humanos \u2014 24 h</div>
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
            <div class="phone-desc">Medicamento no surtido</div>
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
    \u00b7 Informativo, no sustituye asesor\u00eda legal. \u00b7 Comp\u00e1rtelo.
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
