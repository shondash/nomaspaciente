# No Mas Paciente

**Conoce tus derechos de salud. No te dejes.**

Una aplicacion web gratuita y de codigo abierto que ayuda a cualquier persona en Mexico a conocer y ejercer sus derechos en el sistema publico de salud (IMSS, ISSSTE, IMSS-Bienestar). Sin registro, sin recoleccion de datos, sin costo — solo la ley, explicada sin rodeos.

---

## Por que existe esto

Millones de personas en Mexico son rechazadas en urgencias, les niegan medicamentos, o sufren negligencia medica — y no saben que la ley las protege. Los hospitales cuentan con esa ignorancia. Esta app pone la ley en el bolsillo de cada paciente, en un lenguaje que de verdad se entiende.

Cada referencia legal esta verificada contra textos vigentes: Constitucion Art. 4 (reforma marzo 2025), Ley General de Salud, Ley del Seguro Social, NOM-027-SSA3-2013, NOM-007-SSA2-2016, NOM-004-SSA3-2012, y jurisprudencia de la SCJN.

## Funcionalidades

### Respuestas que salvan
14 frases que el sistema de salud te dice — y lo que la ley dice que puedes contestar. Cada respuesta cita el articulo exacto que te protege, en dos tonos:
- **Directo** — sin filtros, empoderando
- **Tranquilo** — lenguaje mas suave para contextos formales

### Guia legal completa
13 capitulos que cubren:
- Derecho constitucional a la salud (Art. 4, reforma 2025)
- Urgencias — no te pueden cerrar la puerta (NOM-027, Reglamento LGS Art. 73)
- Medicamentos — "no hay" no es respuesta legal (Cuadro Basico, recetacompleta.gob.mx)
- Negligencia medica — como documentar y quejarte (CONAMED, CNDH, amparo)
- Derechos del paciente (LGS Arts. 51-51 Bis 3)
- Obligaciones del IMSS, ISSSTE, IMSS-Bienestar
- Como quejarte — escalacion en 5 niveles con tiempos reales
- Poblaciones especiales (embarazadas, ninos, adultos mayores, indigenas, discapacidad)
- Incapacidad medica (LSS Arts. 96-98)
- Derechos sexuales y reproductivos (ILE, anticoncepcion)

Cada capitulo tiene dos capas: lo que debes hacer (visible de inmediato) y la base legal completa (expandible).

### Asistente de quejas
Wizard paso a paso que te lleva de "que me paso" a "donde me quejo":
1. **¿Es emergencia?** — Si es ahora mismo, 3 pasos + telefono CNDH (800 008 6900) en 10 segundos
2. **¿Que paso?** — 10 situaciones comunes (urgencias, medicamentos, negligencia, maltrato, cobro indebido, etc.)
3. **¿Cual es tu institucion?** — IMSS, ISSSTE, IMSS-Bienestar, o "no se"
4. **Tu camino** — Pasos numerados, telefono, que llevar, que esperar, tren de escalacion completo

### Glosario medico-legal
11 terminos que el sistema usa — y lo que realmente significan. CONAMED, Cuadro Basico, expediente clinico, amparo, urgencia obstetrica, talon de surtimiento parcial, y mas.

### Preguntas frecuentes
8 preguntas comunes con respuestas verificadas contra la ley vigente.

### Directorio de ayuda
Informacion de contacto directa — todos los servicios son gratuitos:
- **CONAMED** — Quejas medicas (800 711 0658)
- **CNDH** — Derechos humanos (800 008 6900)
- **Defensoria Publica Federal** — Abogado gratis para amparo (800 009 1700)
- **IMSS** — Atencion al derechohabiente (800 623 2323)
- **ISSSTE** — Quejas y orientacion (800 012 7835)
- **IMSS-Bienestar** — Sin seguridad social (800 640 0300)
- **Receta Completa** — Reporte desabasto de medicamentos (079)

## Stack tecnologico

| Capa | Tecnologia | Por que |
|------|-----------|---------|
| Framework | React 19 | Rapido, arquitectura de componente unico |
| Build | Vite 6 | HMR en menos de un segundo, builds optimizados |
| Estilos | CSS-in-JS inline | Cero overhead de CSS, tokens de diseno en codigo |

**Sin backend. Sin base de datos. Sin analytics. Sin cookies.** Todo corre del lado del cliente.

## Como empezar

### Requisitos previos

- Node.js 18+
- npm

### Instalar y ejecutar

```bash
git clone https://github.com/shondash/nomaspaciente.git
cd nomaspaciente
npm install
npm run dev
```

Abre `http://localhost:5173`

### Build de produccion

```bash
npm run build
npm run preview  # vista previa del build de produccion
```

La salida va a `dist/`.

## Estructura del proyecto

```
nomaspaciente/
├── src/
│   └── main.jsx              # Punto de entrada React
├── no_mas_paciente.jsx        # Componente principal (toda la UI + datos + logica)
├── index.html                 # HTML de entrada
├── vite.config.js             # Configuracion de build
└── package.json
```

## Fuentes legales

Todo el contenido legal esta verificado contra:

- **Constitucion Politica** — Art. 4, reforma marzo 2025 ([texto](http://www.ordenjuridico.gob.mx/Constitucion/4.pdf))
- **Ley General de Salud** — Arts. 51-55, 77 Bis 1 ([texto completo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LGS.pdf))
- **Ley del Seguro Social** — Arts. 84, 89, 91, 95, 96-98 ([texto completo](https://www.imss.gob.mx/sites/all/statics/pdf/leyes/LSS.pdf))
- **Ley del ISSSTE** — Arts. 28, 30, 31 ([texto completo](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISSSTE.pdf))
- **NOM-027-SSA3-2013** — Regulacion de urgencias ([DOF](https://dof.gob.mx/nota_detalle_popup.php?codigo=5312893))
- **NOM-007-SSA2-2016** — Embarazo, parto, puerperio ([DOF](https://www.dof.gob.mx/nota_detalle.php?codigo=5432289))
- **NOM-004-SSA3-2012** — Expediente clinico ([DOF](https://dof.gob.mx/nota_detalle.php?codigo=5272787))
- **CONAMED** — Procedimientos de queja ([gob.mx](https://www.gob.mx/conamed))
- **CNDH** — Presentar queja ([cndh.org.mx](https://www.cndh.org.mx/cndh/como-presentar-una-queja))
- **SCJN** — Jurisprudencia 1a./J. 27/2025 (coexistencia CONAMED y via civil)

## Contribuir

Este proyecto existe para ayudar a los pacientes. Las contribuciones que mejoren la precision legal, la accesibilidad o el alcance son especialmente bienvenidas.

### Antes de contribuir

1. **La precision legal es la prioridad #1.** Cada cita de articulo, cada referencia a NOM o jurisprudencia debe ser verificable contra el texto vigente. Si cambias contenido legal, cita tu fuente.
2. **Cero recoleccion de datos.** No agregues analytics, trackers, formularios ni nada que recolecte datos personales. El compromiso de privacidad es innegociable.
3. **Todo del lado del cliente.** Sin backends, sin APIs, sin dependencias de servidor. Pacientes con conexiones lentas necesitan que esto funcione.
4. **Tres poblaciones, tres caminos.** IMSS, ISSSTE e IMSS-Bienestar tienen leyes y quejas diferentes. Nunca mezcles los caminos institucionales.

### Como contribuir

1. Haz fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feat/mi-funcionalidad`)
3. Haz tus cambios
4. Ejecuta build (`npm run build`)
5. Envia un pull request con una descripcion clara de que cambio y por que

### Reportar errores

Encontraste un error legal? **Ese es el reporte de bug mas valioso posible.** Abre un issue con:
- Lo que dice la app
- Lo que realmente dice la ley
- La referencia al articulo especifico

## Parte de la serie People Rights

No Mas Paciente es la segunda herramienta en la serie [people-rights](https://github.com/shondash):

| Herramienta | Tema | Estado |
|-------------|------|--------|
| [No Me Chinguen](https://github.com/shondash/nomechinguen) | Derechos laborales (LFT) | En vivo |
| **No Mas Paciente** | Derechos de salud publica | En desarrollo |

## Licencia

Este proyecto usa licencia dual:

- **Contenido** (texto, informacion legal): [CC BY-NC-SA 4.0](LICENSE-CONTENT)
- **Codigo** (fuente, componentes, scripts): [MIT](LICENSE-CODE)

Usalo, hazle fork, mejoralo. Ayuda a los pacientes.

## Creditos

Hecho para los millones de personas en Mexico que usan el sistema publico de salud — y que merecen saber que la ley esta de su lado.

**Aviso legal:** Esta app proporciona educacion legal general basada en la legislacion mexicana vigente. No es asesoria legal ni medica. Para casos especificos, contacta a CONAMED (800 711 0658) o a la Defensoria Publica Federal (800 009 1700) — ambos servicios son gratuitos.
