import { useState, useEffect } from "react";

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return mobile;
}

const C = {
  primary: "#3D3066",
  primaryDark: "#2A2050",
  secondary: "#B85A18",
  accent: "#C47F0A",
  bg: "#FAF6F0",
  surface: "#FFFFFF",
  text: "#2C1810",
  textSec: "#6B5E54",
  border: "#E0D5C8",
  info: "#2E6B8A",
  success: "#B85A18",
  error: "#8B2020",
  successLight: "#FDF5EE",
  legalBg: "#F5F0E8",
  heroBg: "#F3ECE1",
};

// ============================================================
// LEGAL VERIFICATION LOG — Phase 1 — 2026-04-06
// Citation verification outcomes. Updated by each plan execution.
// Source methodology: Official PDFs fetched from imss.gob.mx and
// diputados.gob.mx; SCJN verified via sjf2.scjn.gob.mx (JS-rendered,
// text search not possible via curl — marked MEDIUM pending manual check).
// ============================================================
const LEGAL_VERIFICATION_LOG = {
  lss_urgencia_obstetrica: {
    article: "LSS Art. 89, Fracción V",
    source: "IMSS LSS PDF official — imss.gob.mx/sites/all/statics/pdf/leyes/LSS.pdf (Últimas Reformas DOF 07-06-2024)",
    confidence: "HIGH",
    note: "Art. 89 Fr. V adicionada DOF 12-11-2015: 'Para el Instituto, será obligatoria la atención de las mujeres embarazadas que presenten una urgencia obstétrica, solicitada de manera directa o a través de la referencia de otra unidad médica, en términos de las disposiciones aplicables para tal efecto, en las unidades con capacidad para la atención de urgencias obstétricas, independientemente de su derechohabiencia o afiliación a cualquier esquema de aseguramiento.' — VERIFIED in official PDF, exact text extracted."
  },
  lgs_art_77_bis_7a: {
    text: "NOT VERIFIED — Art. 77 Bis 7 A does NOT exist in current LGS (última reforma DOF 15-01-2026). Art. 77 Bis 7 covers access requirements (CURP, territory, no social security). The medication unavailability remedy is NOT codified as a standalone article 77 Bis 7 A in the current official text. The Receta Completa platform (recetacompleta.gob.mx) is an administrative mechanism, not an LGS article. For medication abasto claims, cite: LSS Art. 90 (cuadro básico obligation) + LSS Art. 91 (comprehensive pharmacy benefit) + SCJN Tesis P. XIX/2000.",
    source: "diputados.gob.mx/LeyesBiblio/pdf/LGS.pdf (Últimas Reformas DOF 15-01-2026) — full PDF extracted and searched",
    confidence: "HIGH",
    correction: "CLAUDE.md reference to 'Art. 77 Bis 7 A' as medication unavailability remedy is inaccurate in current law. Remove from content. Use LSS Arts. 90 + 91 instead."
  },
  scjn_p_xix_2000: {
    verified: false,
    confidence: "MEDIUM",
    citationToUse: "SCJN, Pleno, Tesis P. XIX/2000 (medicamentos como derecho constitucional) — use as 'Tesis SCJN P. XIX/2000' with MEDIUM confidence label; sjf2.scjn.gob.mx is JavaScript-rendered, text verification requires manual browser access. Multiple CONAMED and CNDH official documents cite this tesis as authoritative.",
    note: "Directional correctness HIGH (medication access = constitutional right confirmed by Pleno); exact Semanario entry unverified programmatically."
  },
  scjn_2a_j_40_2020: {
    verified: false,
    confidence: "MEDIUM",
    citationToUse: "SCJN, Segunda Sala, Jurisprudencia 2a./J. 40/2020 (mejor medicamento, no el más barato) — use as 'Tesis SCJN 2a./J. 40/2020' with MEDIUM confidence label; same verification limitation as P. XIX/2000.",
    note: "Directional correctness HIGH (best medication standard confirmed in multiple official documents); exact Semanario entry unverified programmatically."
  }
};

const TONE_STRINGS = {
  directo: {
    siteTitle: "No Mas Paciente",
    checaIntro: "Lo que te dicen en ventanilla y lo que la ley dice que puedes contestar.",
    quejaIntro: "Dinos qué pasó. En menos de 2 minutos sabes a dónde ir.",
    toneToggleLabel: "Modo tranquilo",
    footer: "No Mas Paciente · Distribución libre · No se recopilan datos",
  },
  tranquilo: {
    siteTitle: "No Mas Paciente",
    checaIntro: "Aquí encuentras respuestas a lo que el sistema te dice — y lo que puedes decir tú.",
    quejaIntro: "Cuéntanos tu situación para orientarte al lugar correcto.",
    toneToggleLabel: "Modo directo",
    footer: "No Mas Paciente · Distribución libre · No se recopilan datos",
  }
};

const PRINCIPLES = [
  { num: "01", title: "Tu salud es un derecho, no un favor", body: "El artículo 4 de la Constitución dice que toda persona tiene derecho a la protección de la salud. No dice \"todo asegurado\". Dice toda persona. Si estás en México, este derecho es tuyo. La reforma de marzo 2025 incorporó la cláusula de progresividad: lo que el Estado ya garantiza, no lo puede quitar.", ley: "Art. 4 CPEUM | LGS Art. 77 Bis 1" },
  { num: "02", title: "Urgencias no te pueden cerrar la puerta", body: "Ningún hospital — público o privado — puede negarte atención de urgencias. No importa si tienes seguro, si traes dinero, si llegas de madrugada. Si tu vida está en riesgo, deben atenderte.", ley: "NOM-027-SSA3-2013 | Reglamento LGS Art. 73" },
  { num: "03", title: "Los medicamentos que te recetan son tu derecho", body: "La Suprema Corte ya lo resolvió: si tu médico te receta un medicamento del Cuadro Básico, la institución está obligada a surtírtelo. \"No hay\" no es respuesta aceptable.", ley: "LSS Art. 91 | Tesis SCJN P. XIX/2000" },
  { num: "04", title: "Sin seguro social también tienes derechos", body: "¿Trabajas por tu cuenta, en la informalidad, o no tienes empleo? El Estado debe garantizarte atención médica gratuita a través de IMSS-Bienestar. Eso no es caridad, es obligación constitucional.", ley: "Art. 4 CPEUM | LGS Art. 77 Bis 1" },
  { num: "05", title: "Puedes quejarte, y hay quien te escuche", body: "Si te negaron atención, te trataron mal, o no te surtieron tu medicamento, hay instancias gratuitas que te ayudan: CONAMED, CNDH, y hasta el amparo constitucional con abogado gratis.", ley: "LGS Art. 54 | CONAMED | Defensoría Pública" },
  { num: "06", title: "Embarazadas: protección reforzada", body: "Cualquier mujer con urgencia obstétrica debe ser atendida en cualquier hospital público, sea o no derechohabiente. Sin excepciones. Todos los días del año. Es ley desde 2015 (LSS Art. 89 Fr. V).", ley: "NOM-007-SSA2-2016 | LSS Art. 89 Fr. V (reforma 2015)" },
];

const FRASES = [
  { frase: "No hay sistema", resp: "Ningún problema administrativo elimina mi derecho constitucional a la salud.", respTranquilo: "Ningún problema técnico elimina mi derecho a la atención. El sistema falla, mi derecho no.", ley: "Art. 4 CPEUM | LGS Art. 35", sit: "Te dicen que el sistema está caído y no pueden registrarte.", quejaRef: "urgencias", guiaRef: "derecho-constitucional" },
  { frase: "Venga mañana", resp: "Si mi condición requiere atención hoy, el hospital no puede diferirla.", respTranquilo: "Si mi condición necesita atención hoy, el hospital no tiene derecho a aplazarla sin valoración médica.", ley: "NOM-027-SSA3-2013 | LGS Art. 51", sit: "Te mandan de regreso sin valoración médica.", quejaRef: "urgencias", guiaRef: "urgencias" },
  { frase: "No hay medicamento, cómprelo afuera", resp: "Registren el desabasto en mi expediente. La Suprema Corte dice que surtir medicamentos es obligación constitucional.", respTranquilo: "Por favor registren el desabasto en mi expediente. La Suprema Corte establece que surtir medicamentos es una obligación de la institución.", ley: "Tesis SCJN P. XIX/2000 | LSS Art. 91", sit: "La farmacia del hospital no tiene tu medicamento.", quejaRef: "medicamentos", guiaRef: "medicamentos" },
  { frase: "Su cita es en 4 meses", resp: "Si mi condición lo requiere, necesito una referencia a segundo nivel o atención más pronta. Tiene que estar documentado.", respTranquilo: "Si mi condición lo amerita, me gustaría una referencia a segundo nivel o una cita más próxima. Necesito que quede documentado.", ley: "LGS Art. 51", sit: "La cita más próxima con especialista es en meses.", quejaRef: "espera_especialista", guiaRef: "derechos-paciente" },
  { frase: "Urgencias es solo para urgencias de verdad", resp: "La NOM-027 dice que un médico debe valorarme para determinar si es urgencia, no usted.", respTranquilo: "La NOM-027-SSA3-2013 establece que solo un médico puede determinar si un caso es urgencia, previo a cualquier decisión.", ley: "NOM-027-SSA3-2013, 5.4 | Reglamento LGS Art. 73", sit: "Recepción decide que tu caso no es urgencia sin que te valore un médico.", quejaRef: "urgencias", guiaRef: "urgencias" },
  { frase: "No le toca aquí, vaya a su clínica", resp: "En urgencias, la ley obliga a cualquier hospital a atenderme independientemente de mi adscripción.", respTranquilo: "En urgencias, la ley establece que cualquier hospital público debe atenderme sin importar en qué clínica estoy inscrito/a.", ley: "Reglamento LGS Art. 73 | NOM-027 | LGS Art. 55", sit: "Llegas a un hospital que no es de tu adscripción y te rechazan.", quejaRef: "urgencias", guiaRef: "urgencias" },
  { frase: "El doctor no vino hoy", resp: "El hospital está obligado a tener médico disponible 24/7. La ausencia del doctor no elimina mi derecho.", respTranquilo: "El hospital tiene la obligación de contar con médico disponible las 24 horas. La ausencia no cancela mi derecho a atención.", ley: "NOM-027-SSA3-2013, 5.2-5.3 | LGS Art. 51", sit: "El médico no se presentó y no hay quien te atienda.", quejaRef: "urgencias", guiaRef: "urgencias" },
  { frase: "Ya no hay fichas", resp: "Voy a presentar queja formal. Si es urgencia, deben valorarme con o sin ficha.", respTranquilo: "Si es urgencia, la NOM-027-SSA3-2013 establece que deben valorarme independientemente del sistema de fichas.", ley: "NOM-027-SSA3-2013 | LGS Art. 54", sit: "Llegas temprano y te dicen que se acabaron las fichas.", quejaRef: "urgencias", guiaRef: "urgencias" },
  { frase: "Eso no lo cubre el seguro", resp: "Si mi médico lo recetó o está en el Cuadro Básico, deben proporcionarlo. Es su obligación (LSS Art. 91).", respTranquilo: "Si mi médico tratante lo indicó o está en el Cuadro Básico, la institución tiene la obligación de proporcionarlo según el Art. 91 de la Ley del Seguro Social.", ley: "LSS Art. 91 | Tesis SCJN P. XIX/2000", sit: "Te niegan tratamiento, estudio o medicamento.", quejaRef: "medicamentos", guiaRef: "medicamentos" },
  { frase: "Tiene que traer sus propios materiales", resp: "La institución debe proveer los insumos. Si hay desabasto, regístrenlo en mi expediente.", respTranquilo: "La institución tiene la responsabilidad de proveer los insumos necesarios. Si hay escasez, solicito que quede registrado en mi expediente.", ley: "LGS Arts. 27, 35", sit: "Te piden comprar gasas, guantes, jeringas para tu atención.", quejaRef: "cobro_indebido", guiaRef: "derechos-paciente" },
  { frase: "Firme aquí su alta voluntaria", resp: "No voy a firmar bajo presión. Quiero que documenten mi estado actual y el motivo.", respTranquilo: "Prefiero no firmar sin conocer bien mis opciones. Me gustaría que documentaran mi estado actual y la razón del alta.", ley: "NOM-004-SSA3-2012, 10.2 | Reglamento LGS Art. 79", sit: "Te presionan para firmar alta antes de que estés estable.", quejaRef: "alta_prematura", guiaRef: "derechos-paciente" },
  { frase: "Ese medicamento es muy caro, le damos otro", resp: "La SCJN dice que deben garantizar el MEJOR medicamento para mi padecimiento, no el más barato.", respTranquilo: "La Suprema Corte establece que la institución debe garantizar el medicamento más adecuado para mi padecimiento, no simplemente el más económico.", ley: "Tesis SCJN 2a./J. 40/2020", sit: "Cambian tu medicamento por uno más barato sin justificación.", quejaRef: "medicamentos", guiaRef: "medicamentos" },
  { frase: "No hay camas disponibles", resp: "Si mi condición lo requiere, deben estabilizarme y transferirme a donde haya capacidad. No pueden simplemente negarme la atención.", respTranquilo: "Si mi condición lo amerita, la ley obliga al hospital a estabilizarme y transferirme al centro más cercano con disponibilidad.", ley: "Reglamento LGS Art. 73 | NOM-027-SSA3-2013", sit: "Necesitas hospitalización pero dicen que no hay espacio.", quejaRef: "urgencias", guiaRef: "urgencias" },
  { frase: "No tenemos especialista", resp: "Si necesito un especialista hoy, deben referirme a donde lo haya.", respTranquilo: "Si mi estado requiere un especialista de forma urgente, la institución tiene la obligación de referirme al centro que cuente con ese servicio.", ley: "Reglamento LGS Art. 73 | LGS Art. 51", sit: "Necesitas un especialista pero no hay ninguno disponible.", quejaRef: "espera_especialista", guiaRef: "urgencias" },
];

/* CHAPTERS — flat-string chapters used by old renderer. Kept as reference for Phase 3.
const CHAPTERS = [
  { title: "Tu derecho a la salud", ley: "Art. 4 CPEUM | LGS Arts. 2, 27, 35, 51", content: "El artículo 4 de la Constitución dice que toda persona tiene derecho a la protección de la salud. No dice \"todo mexicano\" ni \"todo asegurado\". Dice toda persona.\n\nLa reforma de marzo 2025 a la Constitución establece la progresividad: el Estado no puede recortar el derecho a la salud una vez garantizado. La gratuidad para quienes no tienen seguridad social está en LGS Art. 2. Esto incluye prevención, diagnóstico, tratamiento, rehabilitación, medicamentos básicos (Tesis SCJN P. XIX/2000), atención de urgencias, atención materno-infantil, y salud mental.\n\nLa Ley General de Salud (Art. 77 Bis 1) establece que todas las personas sin seguridad social tienen derecho a recibir de forma gratuita servicios de salud, medicamentos y demás insumos al momento de requerirlos." },
  { title: "Urgencias", ley: "NOM-027-SSA3-2013 | Reglamento LGS Arts. 71, 73, 85", content: "Regla de oro: ningún hospital, público o privado, puede negarte atención de urgencias. No importa si tienes seguro, si traes dinero, si eres extranjero.\n\nLa NOM-027-SSA3-2013 es obligatoria para TODOS los establecimientos. Deben tener médico + enfermera 24/7/365. El responsable de urgencias está obligado a valorarte y darte tratamiento completo o estabilizarte.\n\nSi no pueden resolver tu caso, deben transferirte (Reglamento LGS Art. 73: estabilizar y transferir, no simplemente rechazar). Retener pacientes o cadáveres para garantizar pago es ilegal (Art. 85)." },
  { title: "Embarazada en urgencias", ley: "NOM-007-SSA2-2016 | LSS reforma 2015 | LGS Art. 55", content: "La Ley del Seguro Social (Art. 89, Fracción V, reforma 2015) y la Ley del ISSSTE obligan al IMSS e ISSSTE a atender cualquier urgencia obstétrica sin importar derechohabiencia. Esto no es un convenio que se pueda cancelar — es ley.\n\nLa NOM-007-SSA2-2016 refuerza esto: la atención de urgencias obstétricas es prioridad todos los días del año. En 2009, SSA, IMSS e ISSSTE firmaron además un convenio de coordinación — pero la obligación legal viene de la LSS, no del convenio.\n\nSi una mujer embarazada llega con sangrado, presión alta, contracciones, o cualquier complicación, el hospital NO PUEDE negarle atención." },
  { title: "IMSS: lo que SÍ te toca", ley: "LSS Arts. 89, 91, 95", content: "Si tu patrón te da de alta en el IMSS, tienes derecho al Seguro de Enfermedades y Maternidad: consultas, hospitalización, cirugía, medicamentos del Cuadro Básico, maternidad, laboratorio, rehabilitación (LSS Art. 91).\n\nDato clave: el IMSS puede prestar servicios directamente o por convenio con terceros — pero siempre bajo responsabilidad del IMSS (LSS Art. 89). No puede escapar de su obligación culpando a una clínica subrogada.\n\nLa SCJN ha obligado al IMSS a surtir medicamentos de alto costo (AR 82/2022)." },
  { title: "ISSSTE", ley: "Ley del ISSSTE Arts. 28, 30", content: "Si trabajas para el gobierno, tu seguridad social es el ISSSTE. Los derechos son los mismos: consultas, hospitalización, cirugía, medicamentos, maternidad, rehabilitación (LISSSTE Art. 28).\n\nLa atención de urgencias está incluida expresamente en los servicios médicos del ISSSTE (LISSSTE Art. 30). No pueden negarte atención en emergencia ni condicionarla a pago." },
  { title: "Sin seguro: IMSS-Bienestar", ley: "Art. 4 CPEUM | LGS Arts. 77 Bis 1, 77 Bis 35", content: "¿No tienes patrón? ¿Trabajas por tu cuenta o en la informalidad? Sigues teniendo derecho a atención médica gratuita.\n\nIMSS-Bienestar (que reemplazó al Seguro Popular e INSABI) garantiza servicios gratuitos: consultas, hospitalización, cirugía y medicamentos (LGS Art. 77 Bis 1).\n\nNo te pueden cobrar cuotas de recuperación si no tienes seguridad social." },
  { title: "No hay medicamento", ley: "LSS Arts. 90, 91 | Tesis SCJN P. XIX/2000 | Tesis 2a./J. 40/2020", content: "La Suprema Corte lo resolvió: el derecho a la salud incluye recibir medicamentos básicos. El IMSS está obligado a tener y surtir los medicamentos del Cuadro Básico (LSS Art. 90-91).\n\n¿Qué hacer?\n1. Exige que registren el desabasto en tu expediente.\n2. Pide receta completa con nombre genérico.\n3. Guarda recetas no surtidas, tickets de farmacia.\n4. Queja inmediata al módulo de atención o en recetacompleta.gob.mx.\n5. Si es urgente: amparo indirecto.\n\nLa Tesis 2a./J. 40/2020 dice que deben garantizar el MEJOR medicamento, no el más barato." },
  { title: "Derechos del paciente", ley: "LGS Arts. 51, 51 Bis, 51 Bis 1, 51 Bis 2, 51 Bis 3 | NOM-004-SSA3-2012", content: "Tus derechos como paciente están en la Ley General de Salud, no en un documento administrativo:\n\n1. Atención oportuna y de calidad (LGS Art. 51)\n2. Trato digno y respetuoso (LGS Art. 51)\n3. Información clara sobre tu diagnóstico y tratamiento (LGS Art. 51 Bis 1)\n4. Decidir libremente sobre procedimientos — puedes negarte (LGS Art. 51 Bis 2)\n5. Confidencialidad de tu información médica (LGS Art. 51 Bis 3)\n6. Elegir médico en unidades de primer nivel (LGS Art. 51 Bis)\n7. Acceso a tu expediente clínico — eres el titular (NOM-004-SSA3-2012)\n8. Consentimiento informado antes de cualquier procedimiento (NOM-004)\n\nTú eres titular de tus datos. Tienes derecho a copia de tu expediente por escrito." },
  { title: "La queja: cómo actuar", ley: "LGS Art. 54 | CONAMED | LGS Art. 60 Bis", content: "NIVEL 1 — Queja interna: Todo hospital público debe tener mecanismo de quejas (LGS Art. 54). Presenta por escrito. Guarda copia con sello.\n\nNIVEL 2 — CONAMED: Gratuita. Conciliación y arbitraje — NO sanciona ni mete preso a nadie. Llevar: INE, carnet, recetas, evidencia. CDMX: Marina Nacional 60. Tel: 800-711-0658.\n\nNIVEL 3 — CNDH: Violación a derechos humanos. Tel: 800-008-6900.\n\nNIVEL 4 — Amparo (requiere abogado)." },
  { title: "El amparo", ley: "Art. 4 CPEUM | Ley de Amparo", content: "El amparo protege tus derechos constitucionales contra actos de autoridad.\n\n1. Demanda de amparo indirecto ante Juzgado de Distrito.\n2. Suspensión: el juez ordena que te atiendan MIENTRAS se resuelve.\n3. Si ganas, la institución queda obligada.\n4. Abogado gratis: Defensoría Pública Federal, 800 22 42 426 (Defensatel 24 h).\n\nCasos clave donde el amparo ha funcionado:\n- Tesis P. XIX/2000: medicamentos son derecho constitucional\n- AR 251/2016: SCJN ordenó dar medicamentos psiquiátricos\n- AR 82/2022: SCJN ordenó surtir medicamento oncológico" },
  { title: "Poblaciones protegidas", ley: "Arts. 2, 4 CPEUM | NOM-007-SSA2-2016 | NOM-015-SSA-2023 | LGS Art. 51 Bis 1", content: "Embarazadas: Urgencia obstétrica = prioridad absoluta en cualquier hospital público. 24/7/365. LSS Art. 89 Fr. V lo convierte en obligación legal.\n\nNiños: Interés superior del niño. Atención y medicamentos gratuitos para menores sin seguridad social.\n\nAdultos mayores: Pensión no contributiva desde 68 años (65 para indígenas). Trato preferencial en atención médica.\n\nPersonas con discapacidad: Ajustes razonables en atención médica (NOM-015-SSA-2023).\n\nPueblos indígenas: Servicios con pertinencia cultural (Convenio 169 OIT | LGS Art. 6)." },
  { title: "Negligencia médica", ley: "LFRPE Arts. 1-2 | CPF Arts. 228-230 | LGS Art. 469", content: "Tres vías (no excluyentes):\n\nVÍA 1 — CONAMED: Gratuita. Conciliación y arbitraje. No sanciona penalmente.\n\nVÍA 2 — Demanda civil: Probar negligencia + daño + nexo causal. Plazo: 2 años desde que conociste el daño.\n\nVÍA 3 — Responsabilidad patrimonial del Estado (LFRPE): Para falla institucional. No necesitas probar culpa individual. Plazo: 1 año. La SCJN (1a./J. 27/2025) confirmó que CONAMED y la vía civil coexisten — ir a CONAMED no te quita el derecho de demandar después.\n\nCONSEJO: Conserva TODA la evidencia. Pide copia de expediente. Guarda recetas, estudios, notas de alta." },
];
*/

// ============================================================
// CHAPTERS_V2 — Verified two-layer chapter structure
// Produced by Phase 1. Consumed by Phase 2 UI renderer.
//
// Decisions: D-01 (action-first), D-03 (collapsible legal layer),
//            D-04 (hybrid citation format), D-05 (jurisprudencia callout)
//
// Schema:
// {
//   id: string                          kebab-case identifier
//   title: string                       display title in Spanish, with accents
//   ley: string                         canonical citations shown in chapter tab
//   action: {
//     headline: string                  1 sentence, plain language, no legalese
//     steps: string[]                   2-3 numbered immediate actions, imperative form
//     phone: string | null              key phone number, e.g. "800 008 6900"
//     crossRef: string | null           "queja" links to Queja wizard; null if N/A
//   }
//   legal: {
//     body: string                      full narrative, inline citations "Art. XX LGS"
//     jurisprudencias: Array<{
//       type: "scjn"
//       id: string                      formal tesis ID, e.g. "1a./J. 27/2025"
//       text: string                    plain-language summary, 1-2 sentences
//       source: string                  formal citation string for display
//       confidence: "HIGH" | "MEDIUM"  only HIGH rendered in UI
//     }>
//     noms: Array<{
//       id: string                      e.g. "NOM-027-SSA3-2013"
//       text: string                    what this NOM requires, 1 sentence
//       dof: string                     DOF código, e.g. "5312893"
//     }>
//   }
//   populations: {                      null for universal chapters (e.g. glosario)
//     imss: string | null               1-2 sentences for IMSS derechohabientes
//     issste: string | null             1-2 sentences for ISSSTE derechohabientes
//     sinSeguro: string | null          1-2 sentences for uninsured / IMSS-Bienestar
//   } | null
// }
//
// CONTENT RULES (LEGAL requirements):
// - Every claim in legal.body must cite a specific article inline: "Art. XX LGS"
// - action.steps must be imperative: "Di en voz alta...", "Pide por escrito..."
// - populations must NOT conflate IMSS con ISSSTE
// - "Carta de Derechos" must NOT appear as a ley field (cite LGS Arts. 51-51 Bis 3)
// - noms[] only for NOMs listed as vigente in CLAUDE.md confidence table
// - Tone: empowering toward system failures, calm toward reader (D-08, D-11)
// ============================================================
const CHAPTERS_V2 = [
  // ============================================================
  // GUIA-01: Glosario médico-legal
  // ============================================================
  {
    id: "glosario",
    title: "Glosario médico-legal",
    ley: "LGS Art. 51 Bis 1 | NOM-004-SSA3-2012",
    action: {
      headline: "Las palabras que el sistema usa — y lo que realmente significan.",
      steps: [
        "Antes de quejarte, identifica qué institución es responsable: IMSS (trabajadores con patrón), ISSSTE (empleados del gobierno), o IMSS-Bienestar (sin seguridad social).",
        "Si te usan términos legales que no entiendes, pide explicación por escrito — tienes derecho a información clara y oportuna (LGS Art. 51 Bis 1).",
        "Guarda este glosario: los términos aquí definidos son los que usarás al presentar una queja formal."
      ],
      phone: null,
      crossRef: null
    },
    legal: {
      entries: [
        {
          term: "CONAMED",
          def: "Comisión Nacional de Arbitraje Médico. Busca acuerdo entre tú y el hospital mediante conciliación o arbitraje. NO puede sancionar penalmente al médico, NO puede revocar licencias, y NO puede obligar a nadie si ambas partes no aceptan el arbitraje. El servicio es completamente gratuito."
        },
        {
          term: "Cuadro Básico",
          def: "Lista oficial de medicamentos que el IMSS y el ISSSTE están obligados a tener disponibles para sus derechohabientes. Si tu médico del IMSS o ISSSTE te lo recetó y está en el Cuadro Básico, deben surtírtelo. 'No hay' no es respuesta legal."
        },
        {
          term: "Expediente clínico",
          def: "Tu historial médico completo: diagnósticos, notas de evolución, recetas, estudios, notas de alta. Es tuyo — puedes pedir copia completa en cualquier momento (NOM-004-SSA3-2012). La institución debe conservarlo mínimo 5 años."
        },
        {
          term: "IMSS",
          def: "Instituto Mexicano del Seguro Social. Para trabajadores con patrón que los cotiza al seguro social. Cubre al trabajador, cónyuge o concubino/a, hijos hasta 16 años (25 si estudian en escuela registrada)."
        },
        {
          term: "ISSSTE",
          def: "Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado. Para empleados del gobierno federal y organismos públicos. Derechos similares al IMSS pero bajo diferente reglamento — los procedimientos de queja y los plazos no son iguales."
        },
        {
          term: "IMSS-Bienestar",
          def: "Servicio de salud gratuito para quienes no tienen seguridad social: trabajadores informales, independientes, desempleados. Reemplazó al INSABI y al Seguro Popular. Su base legal es LGS Art. 77 Bis 1."
        },
        {
          term: "NOM",
          def: "Norma Oficial Mexicana. No es sugerencia — es ley técnica de cumplimiento obligatorio para todas las instituciones. Violar una NOM es una infracción administrativa sancionable. Las más relevantes aquí: NOM-027 (urgencias), NOM-007 (embarazo y parto), NOM-004 (expediente clínico)."
        },
        {
          term: "Amparo",
          def: "Juicio constitucional ante un juzgado federal para proteger tus derechos cuando el gobierno los viola. Requiere abogado, pero puedes obtener uno gratis en la Defensoría Pública Federal (800 22 42 426). Ha funcionado para obligar al IMSS a entregar medicamentos oncológicos."
        },
        {
          term: "Urgencia obstétrica",
          def: "Cualquier complicación durante el embarazo que pone en riesgo la vida de la madre o el bebé: hemorragia, presión alta severa, contracciones prematuras, dolor abdominal intenso. Cualquier hospital público DEBE atenderla, tengas o no seguro (LSS Art. 89 Fr. V, reforma 2015; NOM-007-SSA2-2016)."
        },
        {
          term: "Derechohabiente",
          def: "Persona inscrita en el IMSS o ISSSTE, o su familiar directo con cobertura reconocida. Si trabajas y tu patrón te cotiza al IMSS, eres derechohabiente. El status se mantiene mientras conserves los requisitos (LSS Art. 95)."
        },
        {
          term: "Talón de surtimiento parcial",
          def: "El talón de surtimiento parcial es el comprobante que la farmacia del hospital te entrega cuando no tiene todo el medicamento de tu receta. Guárdalo siempre: es evidencia oficial de desabasto y te permite solicitar reembolso o abrir un reporte en recetacompleta.gob.mx."
        }
      ],
      body: "Los términos de este glosario están definidos o respaldados por: LGS Art. 51 Bis 1 (derecho a información suficiente, clara, oportuna y veraz), NOM-004-SSA3-2012 (expediente clínico: titularidad del paciente, derecho a copia), LGS Art. 77 Bis 1-30 (base legal de IMSS-Bienestar), LGS Arts. 416-427 (sanciones administrativas por incumplimiento de NOMs). La Carta de Derechos de los Pacientes (CONAMED, 2001) es una guía de referencia útil pero no tiene fuerza legal propia — los derechos reales están en la LGS y las NOMs.",
      jurisprudencias: [],
      noms: [
        {
          id: "NOM-004-SSA3-2012",
          text: "Define el expediente clínico como documento de titularidad del paciente, con derecho a solicitar copia en cualquier momento.",
          dof: "5272787"
        }
      ]
    },
    populations: null
  },

  // ============================================================
  // GUIA-02: Tu derecho constitucional a la salud
  // ============================================================
  {
    id: "derecho-constitucional",
    title: "Tu derecho constitucional a la salud",
    ley: "Art. 4 CPEUM (reforma marzo 2025) | LGS Arts. 2, 27",
    action: {
      headline: "El Estado mexicano está obligado constitucionalmente a garantizarte salud — no es un favor, es una obligación.",
      steps: [
        "Si en un hospital público te niegan atención por no tener dinero o seguro, cita el Art. 4 Constitucional: 'Toda persona tiene derecho a la protección de la salud' — no dice 'todo asegurado'.",
        "Si el problema es sistémico (desabasto de medicamentos, cierre de servicio, recortes), puedes presentar queja ante la CNDH — 800 008 6900. Investigan en 90 días.",
        "La reforma de marzo 2025 prohíbe al Estado reducir los servicios de salud ya garantizados. Si detectas recortes, eso es violación constitucional — queja ante CNDH."
      ],
      phone: "800 008 6900",
      crossRef: "queja"
    },
    legal: {
      body: "El Art. 4 de la Constitución establece que toda persona tiene derecho a la protección de la salud. La reforma de marzo 2025 incorporó la cláusula de progresividad: el Estado no puede reducir los niveles de protección a la salud una vez que los ha garantizado. La LGS Art. 2 define los objetivos del sistema: bienestar físico y mental de toda la población, y prestación gratuita de servicios a personas sin seguridad social. La LGS Art. 27 obliga al Sistema Nacional de Salud a incluir atención médica de urgencias (Fr. I), atención materno-infantil (Fr. II), y salud mental (Fr. III) como servicios básicos universales — en todo el territorio, sin excepción. Ningún hospital público puede argumentar que 'eso no aplica aquí'.",
      jurisprudencias: [],
      noms: []
    },
    populations: {
      imss: "Si tienes IMSS, tu derecho constitucional se complementa con la Ley del Seguro Social (LSS). La LSS Art. 84 define exactamente quiénes tienen cobertura (trabajador, cónyuge, hijos). El IMSS no puede darte menos de lo que la LSS obliga — el Art. 4 Constitucional funciona como piso mínimo.",
      issste: "Si tienes ISSSTE, el marco específico es la Ley del ISSSTE. El Art. 28 de la LISSSTE lista los servicios que el ISSSTE debe garantizarte. El Art. 4 Constitucional aplica como piso mínimo — ninguna restricción interna del ISSSTE puede estar por debajo de él.",
      sinSeguro: "Sin seguridad social, el Art. 4 CPEUM y la LGS Art. 2 te garantizan acceso a IMSS-Bienestar. No te pueden cobrar cuotas de recuperación si no tienes seguro social (LGS Art. 77 Bis 1). El servicio es gratuito por mandato constitucional."
    }
  },

  // ============================================================
  // GUIA-06: Urgencias — no te pueden cerrar la puerta
  // ============================================================
  {
    id: "urgencias",
    title: "Urgencias: no te pueden cerrar la puerta",
    ley: "NOM-027-SSA3-2013 | LGS Art. 55 | Reglamento LGS Arts. 7, 71, 73",
    emergencyBanner: {
      visible: true,
      headline: "¿Te están rechazando AHORA MISMO?",
      steps: [
        "Di en voz alta: 'Exijo atención de urgencias conforme a la NOM-027-SSA3-2013 y el Art. 55 de la Ley General de Salud.'",
        "Si no te atienden, llama al 800 008 6900 (CNDH, 24 horas — tienen facultad de intervención inmediata en violaciones a derechos humanos).",
        "Pide por escrito la razón del rechazo. Cualquier papel con sello del hospital es evidencia para la queja formal."
      ],
      phone: "800 008 6900"
    },
    action: {
      headline: "Ningún hospital público puede negarte urgencias — ni por dinero, ni por seguro, ni por ser de noche, ni por ser de otro estado.",
      steps: [
        "Si llegas a urgencias y te rechazan sin valoración médica: Di 'Exijo ser valorado/a por un médico conforme a NOM-027-SSA3-2013, apartado 5.4. Nadie en recepción puede determinar si mi caso es urgencia sin evaluación médica.'",
        "Si te dicen 'no hay médico': 'El Art. 7 del Reglamento de la LGS obliga a este hospital a tener médico disponible las 24 horas los 365 días del año. Exijo que se documente la ausencia por escrito.'",
        "Si el hospital no puede atenderte: deben estabilizarte y transferirte — no simplemente mandarte a la calle (Reglamento LGS Art. 73). Si el hospital receptor se niega, llama al 800 008 6900."
      ],
      phone: "800 008 6900",
      crossRef: "queja"
    },
    legal: {
      body: "La NOM-027-SSA3-2013 es obligatoria para TODOS los hospitales — públicos y privados. Establece que los servicios de urgencias deben operar 24 horas, 365 días al año, con médico permanente (apartados 5.2-5.3). El triage es obligatorio: un médico debe valorar a todo paciente que llega a urgencias — nadie en la recepción puede decidir si es 'urgencia de verdad' sin evaluación médica previa (apartado 5.4). Si el hospital no puede resolver tu caso, debe estabilizarte y transferirte al centro más cercano con capacidad (Reglamento LGS Art. 73). 'Estabilizar' tiene un significado legal preciso: controlar las funciones vitales, manejar el dolor agudo, y asegurar que el paciente pueda trasladarse sin riesgo inmediato de muerte. El hospital receptor está obligado a recibir al paciente transferido. El Art. 55 de la LGS va más lejos aún: impone la obligación incluso a personas que presencian una urgencia — 'toda persona con conocimiento de alguien que necesite atención de urgencia debe proporcionarla por los medios disponibles.' El Reglamento LGS Art. 71 prohíbe explícitamente condicionar la atención de urgencias al pago o a la derechohabiencia — el dinero y el seguro no son argumentos válidos. Retener pacientes o cadáveres para garantizar pago es ilegal (Reglamento LGS Art. 85).",
      jurisprudencias: [],
      noms: [
        {
          id: "NOM-027-SSA3-2013",
          text: "Establece requisitos obligatorios para todos los servicios de urgencias: personal médico y de enfermería 24/7, triage médico obligatorio para todo paciente, y protocolo de estabilización y transferencia cuando el hospital no tiene capacidad de resolución.",
          dof: "5312893"
        },
        {
          id: "NOM-007-SSA2-2016",
          text: "La atención de urgencias obstétricas es prioridad en todos los hospitales públicos, sin importar derechohabiencia, los 365 días del año.",
          dof: "5432289"
        }
      ]
    },
    populations: {
      imss: "Si eres derechohabiente del IMSS y llegas a un hospital IMSS que no es tu adscripción: igual deben atenderte en urgencias — no pueden remitirte a 'tu clínica' si hay riesgo vital. En urgencias obstétricas, la LSS Art. 89 Fr. V (reforma DOF 12-11-2015) hace la atención universal, independientemente de derechohabiencia o afiliación.",
      issste: "Si eres trabajador/a del gobierno con ISSSTE: el Art. 30 de la Ley del ISSSTE incluye explícitamente urgencias en los servicios médicos obligatorios. Las mismas reglas de la NOM-027-SSA3-2013 aplican en hospitales ISSSTE — no hay excepción.",
      sinSeguro: "Sin seguro social: el Reglamento LGS Art. 71 dice explícitamente que la atención de urgencias se otorga independientemente de la capacidad de pago o cobertura de seguro. Cualquier hospital público debe atenderte — no te pueden pedir comprobante de seguro o depósito previo."
    }
  },

  // ============================================================
  // GUIA-07: Medicamentos — "no hay" no es respuesta legal
  // NOTE: LGS Art. 77 Bis 7A does NOT exist in current LGS (DOF 15-01-2026).
  // Medication obligation for IMSS cites LSS Arts. 90+91 per LEGAL_VERIFICATION_LOG.
  // SCJN P. XIX/2000 and 2a./J. 40/2020 are MEDIUM confidence — body mention only.
  // ============================================================
  {
    id: "medicamentos",
    title: "Medicamentos: 'no hay' no es respuesta legal",
    ley: "LSS Arts. 90, 91 | LGS Art. 77 Bis 1 | Tesis SCJN P. XIX/2000",
    action: {
      headline: "Si el hospital no tiene tu medicamento, tienes derecho a que lo consigan o te reembolsen.",
      steps: [
        "Pide el talón de surtimiento parcial — el comprobante que dice exactamente qué no te surtieron. Guárdalo: es tu evidencia oficial de desabasto.",
        "Ve a recetacompleta.gob.mx con tu CURP, el folio de tu receta, y el nombre del medicamento. Registra el reporte de desabasto ahí.",
        "Si es medicamento crónico o de alto costo: presenta queja escrita en el módulo de atención del hospital y guarda el número de folio de tu queja."
      ],
      phone: "800 623 2323",
      crossRef: "queja"
    },
    legal: {
      body: "El IMSS está obligado a mantener y actualizar un cuadro básico de medicamentos (LSS Art. 90) y a proporcionar asistencia farmacéutica completa como parte del seguro de enfermedades y maternidad (LSS Art. 91). 'No hay' no es respuesta legal — si el medicamento está en el Cuadro Básico y tu médico lo recetó, la institución debe surtírtelo. La SCJN ha establecido en tesis de jurisprudencia (P. XIX/2000) que el derecho a la salud incluye recibir los medicamentos básicos necesarios — este criterio es citado como autoridad en documentos oficiales de CONAMED y CNDH. Asimismo, la jurisprudencia SCJN (2a./J. 40/2020) establece que la institución debe garantizar el mejor medicamento para el padecimiento, no simplemente el más barato o el más fácil de conseguir. Para personas sin seguridad social en IMSS-Bienestar, el derecho a medicamentos gratuitos deriva de LGS Art. 77 Bis 1. El talón de surtimiento parcial es el documento oficial que acredita el desabasto: consérvalo para tramitar reembolso, continuar el reporte en recetacompleta.gob.mx, o como evidencia en un amparo por desabasto.",
      jurisprudencias: [],
      noms: []
    },
    populations: {
      imss: "En el IMSS: el Cuadro Básico Institucional define los medicamentos obligatorios (LSS Art. 90). Si la farmacia no tiene un medicamento del Cuadro Básico que tu médico recetó, registra el desabasto en recetacompleta.gob.mx y presenta queja en el módulo IMSS — 800 623 2323 opción 6.",
      issste: "En el ISSSTE: los medicamentos de tu receta del médico tratante deben surtirse en farmacia ISSSTE. Si no hay stock, el procedimiento es similar: queja interna ante el módulo de atención y reporte de desabasto. Teléfono ISSSTE: 800 012 7835.",
      sinSeguro: "En IMSS-Bienestar o SSA: tienes derecho a medicamentos gratuitos (LGS Art. 77 Bis 1). Si no los tienen, pide que te documenten la falta en el expediente y reporta en recetacompleta.gob.mx."
    }
  },

  // ============================================================
  // GUIA-08: Negligencia médica — cómo documentar y a dónde ir
  // ============================================================
  {
    id: "negligencia",
    title: "Negligencia médica: cómo documentar tu caso",
    ley: "LFRPE Arts. 1-2 | NOM-004-SSA3-2012 | SCJN 1a./J. 27/2025",
    action: {
      headline: "Antes de quejarte por negligencia, reúne la evidencia — sin expediente, es muy difícil avanzar.",
      steps: [
        "Pide copia de tu expediente clínico completo — es tuyo y deben dártelo por ley (NOM-004-SSA3-2012). Hazlo por escrito y guarda el acuse de recibo.",
        "Documenta todo antes de que el tiempo borre detalles: fechas, nombres de médicos, qué pasó exactamente, qué te dijeron. Fotos y mensajes de WhatsApp con sello de hora son válidos como respaldo.",
        "Para ir a CONAMED: primero debes haber presentado queja interna en el hospital (para casos IMSS/ISSSTE). CONAMED es gratuito y tiene conciliadores especializados — 800 711 0658."
      ],
      phone: "800 711 0658",
      crossRef: "queja"
    },
    legal: {
      body: "La negligencia médica en instituciones públicas tiene tres vías de reclamo, y no son excluyentes entre sí. VÍA 1 — CONAMED (conciliación y arbitraje): gratuita, busca acuerdo entre tú y la institución. IMPORTANTE: CONAMED NO puede sancionar penalmente al médico, NO puede revocar licencias médicas, y NO puede obligar a ninguna de las partes si no hay acuerdo previo para el arbitraje. La SCJN (1a./J. 27/2025) aclaró expresamente que usar CONAMED no extingue tu derecho de demandar civilmente después — ambas vías coexisten. VÍA 2 — Responsabilidad Patrimonial del Estado (LFRPE Arts. 1-2): cuando la falla es de la institución (no solo de un médico individual), no necesitas probar la culpa de un médico específico. El plazo es de 1 año desde que conociste el daño. Se tramita ante el Tribunal Federal de Justicia Administrativa. VÍA 3 — Demanda civil: Arts. 228-230 del Código Penal Federal para mala praxis con dolo; Art. 1916 del Código Civil Federal para daño moral. Requiere probar negligencia, daño, y nexo causal. La NOM-004-SSA3-2012 convierte al expediente clínico en la evidencia principal: documenta diagnósticos, procedimientos, notas de alta. Pídelo antes de que pueda ser modificado. Según estadísticas de CONAMED, los tres tipos de queja más frecuentes son: (1) diagnóstico tardío o incorrecto, (2) complicaciones quirúrgicas, (3) negativa de atención.",
      jurisprudencias: [
        {
          type: "scjn",
          id: "1a./J. 27/2025",
          text: "La vía CONAMED y la vía civil son independientes: acudir a CONAMED no extingue el derecho de demandar civilmente al médico o a la institución con posterioridad.",
          source: "SCJN, Primera Sala, Jurisprudencia 1a./J. 27/2025",
          confidence: "HIGH"
        }
      ],
      noms: [
        {
          id: "NOM-004-SSA3-2012",
          text: "El expediente clínico es de titularidad del paciente. Puedes solicitar copia completa en cualquier momento. Es la principal fuente de evidencia en casos de negligencia médica.",
          dof: "5272787"
        }
      ]
    },
    populations: {
      imss: "En el IMSS: primero presenta queja interna ante la Unidad Médica o ante el Órgano Interno de Control del IMSS (imss.gob.mx/oic/quejasydenuncias). Después, si no hay resolución satisfactoria, ve a CONAMED. El OIC puede investigar al personal del IMSS — CONAMED solo concilia.",
      issste: "En el ISSSTE: el procedimiento interno está en el Reglamento de Quejas Médicas del ISSSTE (actualizado septiembre 2024). Presenta queja interna primero. Si no hay resolución, continúa a CONAMED. Teléfono ISSSTE: 800 012 7835.",
      sinSeguro: "En IMSS-Bienestar o SSA: presenta queja directamente a la Secretaría de Salud estatal o a la CNDH (800 008 6900). CONAMED también atiende casos de hospitales públicos que no son IMSS ni ISSSTE."
    }
  },

  // ============================================================
  // GUIA-09: Tus derechos como paciente
  // CRITICAL: Primary source is LGS Arts. 51-51 Bis 3 — NOT Carta de Derechos
  // ============================================================
  {
    id: "derechos-paciente",
    title: "Tus derechos como paciente",
    ley: "LGS Arts. 51-51 Bis 3 | NOM-004-SSA3-2012",
    action: {
      headline: "Tienes derechos como paciente respaldados por la Ley General de Salud — no solo por una carta de buenas intenciones.",
      steps: [
        "Derecho a información: 'Necesito que me expliquen mi diagnóstico en términos que entienda, por escrito si es posible. Es mi derecho según el Art. 51 Bis 1 de la Ley General de Salud.'",
        "Derecho a decidir: 'No firmaré nada sin entender exactamente qué autorizo. Es mi derecho según el Art. 51 Bis 2 de la LGS — puedo rechazar procedimientos.'",
        "Derecho a tu expediente: 'Solicito copia de mi expediente clínico completo conforme a la NOM-004-SSA3-2012. Es información que me pertenece.'"
      ],
      phone: null,
      crossRef: "queja"
    },
    legal: {
      body: "La LGS Art. 51 garantiza a todo usuario del sistema de salud 'prestaciones oportunas y de calidad idónea' y 'trato respetuoso y digno' de los profesionales de salud. El Art. 51 Bis añade el derecho a elegir médico en unidades de primer nivel de atención (poco aplicado, pero legalmente exigible). El Art. 51 Bis 1 garantiza el derecho a recibir información suficiente, clara, oportuna y veraz sobre tu estado de salud y los procedimientos diagnósticos o terapéuticos que te proponen — en términos que puedas entender. El Art. 51 Bis 2 reconoce tu derecho a decidir libremente sobre procedimientos diagnósticos y terapéuticos, incluyendo el derecho a rechazar tratamiento una vez informado de las consecuencias. El Art. 51 Bis 3 garantiza la confidencialidad de la información que proporcionas a tu médico. El consentimiento informado está regulado por la NOM-004-SSA3-2012 y el Reglamento LGS Art. 80: antes de cualquier procedimiento quirúrgico o invasivo, deben explicártelo y tienes derecho a decir que no. La Carta de Derechos de los Pacientes (CONAMED, 2001) es una guía de referencia útil, pero es una declaración administrativa sin fuerza legal propia — lo que te protege son estos artículos de la LGS y la NOM-004.",
      jurisprudencias: [],
      noms: [
        {
          id: "NOM-004-SSA3-2012",
          text: "Regula el expediente clínico y el consentimiento informado. El consentimiento debe ser libre, informado y documentado. El paciente puede solicitar copia de su expediente en cualquier momento.",
          dof: "5272787"
        }
      ]
    },
    populations: {
      imss: "En el IMSS: estos derechos aplican en todas las unidades médicas del primer y segundo nivel. Si el médico no te informa correctamente o te presionan para firmar, presenta queja en el módulo de atención al derechohabiente o al OIC IMSS.",
      issste: "En el ISSSTE: los mismos derechos aplican. El Art. 31 de la LISSSTE remite al Reglamento de Servicios Médicos del ISSSTE para los procedimientos internos de queja.",
      sinSeguro: "En IMSS-Bienestar o cualquier hospital público: el Art. 51 de la LGS aplica a TODOS los servicios de salud del sistema nacional, no solo a derechohabientes de IMSS o ISSSTE."
    }
  },

  // ============================================================
  // GUIA-03: IMSS — Lo que SÍ te toca
  // ============================================================
  {
    id: "imss-obligaciones",
    title: "IMSS: lo que sí te toca (y lo que no pueden negarte)",
    ley: "LSS Arts. 84, 89 Fr. V, 91, 95",
    action: {
      headline: "Si tienes IMSS, la Ley del Seguro Social define exactamente qué servicios debes recibir — y el IMSS no puede darte menos.",
      steps: [
        "Consultas, hospitalización, cirugía, medicamentos del Cuadro Básico, maternidad, laboratorio y rehabilitación son tus derechos por ley (LSS Art. 91). Si te niegan cualquiera de estos servicios, exige que documenten el rechazo por escrito.",
        "Si el IMSS te remite a una clínica subrogada (contratada) y hay problemas: la responsabilidad sigue siendo del IMSS. No puede culpar a la clínica para evadir su obligación (LSS Art. 89).",
        "Si tu situación no se resuelve en ventanilla: llama al 800 623 2323 opción 6 (OIC del IMSS) o presenta queja en imss.gob.mx/oic/quejasydenuncias."
      ],
      phone: "800 623 2323",
      crossRef: "queja"
    },
    legal: {
      body: "El Seguro de Enfermedades y Maternidad del IMSS cubre: medicina preventiva, atención obstétrica, atención médica general y especializada, cirugía, hospitalización, farmacia (Cuadro Básico), y rehabilitación física y mental (LSS Art. 91). Tienen derecho a esta cobertura el trabajador inscrito, su cónyuge o concubino/a, hijos hasta los 16 años (25 si estudian en institución del sistema educativo nacional), y ascendientes en situación de dependencia económica (LSS Art. 84). El derecho persiste mientras se mantenga el estatus de derechohabiencia — el IMSS no puede negarte servicios mientras estás dado/a de alta (LSS Art. 95). La obligación del IMSS incluye los servicios prestados por terceros mediante convenio: si el IMSS contrató a una clínica privada para atenderte, y esa clínica falla, la responsabilidad recae sobre el IMSS (LSS Art. 89 general). La urgencia obstétrica es universal: cualquier mujer embarazada con complicación debe ser atendida en CUALQUIER unidad IMSS con capacidad para urgencias obstétricas, independientemente de si es derechohabiente o no (LSS Art. 89 Fr. V, adicionada DOF 12-11-2015). Para reclamaciones por desabasto de medicamentos, los artículos clave son LSS Art. 90 (obligación de mantener Cuadro Básico actualizado) y LSS Art. 91 (farmacia como parte integral del seguro). La SCJN ha ordenado al IMSS surtir medicamentos oncológicos en casos individuales (criterio citado en documentos CONAMED como AR 82/2022 — no verificado directamente en SJF).",
      jurisprudencias: [],
      noms: [
        {
          id: "NOM-027-SSA3-2013",
          text: "Aplica a todos los servicios de urgencias del IMSS: médico disponible 24/7, triage obligatorio, estabilización y transferencia si no hay capacidad.",
          dof: "5312893"
        }
      ]
    },
    populations: {
      imss: "Tus derechos como derechohabiente del IMSS están en LSS Arts. 84-95. Si tu patrón no te ha dado de alta o hay discrepancia en tu registro, primero verifica en imss.gob.mx con tu NSS. Un trabajador dado de alta tiene todos los derechos del Art. 91, incluyendo medicamentos del Cuadro Básico.",
      issste: null,
      sinSeguro: "Sin seguridad social, el IMSS no es tu institución — tu derecho a atención gratuita está en IMSS-Bienestar (ver capítulo siguiente). Excepción: urgencia obstétrica, donde cualquier mujer embarazada debe ser atendida en cualquier hospital IMSS (LSS Art. 89 Fr. V)."
    }
  },

  // ============================================================
  // GUIA-04: ISSSTE — Derechos para empleados del gobierno
  // ============================================================
  {
    id: "issste-obligaciones",
    title: "ISSSTE: derechos para empleados del gobierno",
    ley: "LISSSTE Arts. 28, 30, 31",
    action: {
      headline: "Si trabajas para el gobierno, el ISSSTE te debe los mismos servicios que el IMSS — con sus propios plazos y procedimientos de queja.",
      steps: [
        "Consultas, hospitalización, cirugía, medicamentos, maternidad y rehabilitación están en tu derecho como trabajador del gobierno (LISSSTE Art. 28). Si te los niegan, pide por escrito la razón.",
        "Si presentas queja interna: la Comisión de Quejas Médicas del ISSSTE tiene 115 días hábiles para resolver desde tu declaración inicial (Reglamento DOF 27-09-2024). Plazo para presentar queja: 2 años desde los hechos.",
        "Escala a CONAMED si la queja interna no da resultado. Primero: 800 012 7835 (ISSSTE). Después: 800 711 0658 (CONAMED)."
      ],
      phone: "800 012 7835",
      crossRef: "queja"
    },
    legal: {
      body: "Los servicios médicos del ISSSTE incluyen: medicina preventiva, atención de maternidad, atención médica general y especializada, hospitalización, farmacia y rehabilitación (LISSSTE Art. 28). La atención de urgencias está incluida expresamente en estos servicios (LISSSTE Art. 30) — no pueden condicionarte la atención de emergencia a ningún trámite administrativo. El procedimiento interno de quejas médicas del ISSSTE está regulado por el Reglamento para la Dictaminación de Quejas Médicas y Solicitudes de Reembolso del ISSSTE, publicado en el DOF el 27 de septiembre de 2024 (código DOF 5739840). Este reglamento establece un plazo de resolución de 115 días hábiles, documentación requerida (identificación oficial, credencial ISSSTE o número de trabajador, narración de hechos, documentación médica, declaración de que la queja no está en otro procedimiento), y un plazo para presentar la queja de 2 años desde los hechos. La queja interna del ISSSTE es distinta del OIC del ISSSTE: el ISSSTE tiene su propia Comisión y Comités de Quejas Médicas bajo su Reglamento 2024, mientras el OIC maneja asuntos de responsabilidad administrativa de servidores públicos. Para efectos de escalar a CONAMED, primero debe existir el registro de queja interna ante el ISSSTE. El LISSSTE Art. 31 remite al Reglamento de Servicios Médicos del ISSSTE para los procedimientos operativos — este Reglamento complementa los Arts. 28 y 30.",
      jurisprudencias: [],
      noms: [
        {
          id: "NOM-027-SSA3-2013",
          text: "Aplica igualmente a los servicios de urgencias del ISSSTE: médico disponible 24/7, triage obligatorio, protocolo de estabilización y transferencia.",
          dof: "5312893"
        }
      ]
    },
    populations: {
      imss: null,
      issste: "Eres derechohabiente del ISSSTE si eres trabajador del gobierno federal o de un organismo público inscrito. Cubre al trabajador, cónyuge o concubino/a, hijos hasta 18 años (25 si estudian). La queja interna sigue el Reglamento 2024 — plazo 115 días hábiles, con derecho a complementar documentación en 5 días si hay faltantes.",
      sinSeguro: null
    }
  },

  // ============================================================
  // GUIA-05: IMSS-Bienestar y SSA — Si no tienes seguro
  // NOTE: LGS Art. 77 Bis 7A does NOT exist in current LGS — do not cite it.
  // Medication rights for uninsured cite LGS Art. 77 Bis 1 + cross-ref GUIA-07.
  // Complaint path: CNDH first (OPD structure has no IMSS OIC equivalent).
  // ============================================================
  {
    id: "imss-bienestar",
    title: "IMSS-Bienestar y SSA: si no tienes seguro, igual tienes derechos",
    ley: "Art. 4 CPEUM (reforma marzo 2025) | LGS Arts. 2, 77 Bis 1",
    action: {
      headline: "Sin seguro social, el Estado está constitucionalmente obligado a darte atención médica gratuita — eso no es caridad, es ley.",
      steps: [
        "Tienes derecho a consultas, hospitalización, cirugía y medicamentos gratuitos en unidades de IMSS-Bienestar y Secretaría de Salud (LGS Art. 77 Bis 1). No te pueden cobrar cuotas de recuperación si no tienes seguridad social.",
        "Si te cobran o te niegan atención: llama al CAT de IMSS-Bienestar — 800 298 1150 (lunes a viernes, 9:00-15:00 y 17:00-19:00) — o escribe a siemprecontigo@imssbienestar.gob.mx.",
        "Si el problema no se resuelve, escala a la CNDH (800 008 6900, 24 horas). Para hospitales IMSS-Bienestar OPD (hospitales estatales absorbidos), la CNDH es la vía de escalamiento principal — no el OIC del IMSS."
      ],
      phone: "800 298 1150",
      crossRef: "queja"
    },
    legal: {
      body: "La LGS Art. 77 Bis 1 establece el 'Sistema de Salud para el Bienestar' — toda persona sin seguridad social tiene derecho a recibir, de forma gratuita, servicios de salud, medicamentos y demás insumos necesarios al momento de requerirlos. Este derecho no depende de registro previo, credencial, ni domicilio: si estás en México sin seguridad social, el sistema está obligado a atenderte. El Art. 4 CPEUM con la reforma de marzo 2025 refuerza esto: el Estado no puede reducir los niveles de protección ya garantizados. IMSS-Bienestar fue creado como Organismo Público Descentralizado (OPD) en agosto 2022, absorbiendo los hospitales estatales que antes operaba la SSA y el INSABI. Esta estructura OPD significa que la queja escalada para hospitales IMSS-Bienestar no va al OIC del IMSS (que cubre únicamente el IMSS derechohabiente) — va a la CNDH o directamente al CAT de IMSS-Bienestar. No cites al INSABI ni al Seguro Popular como instituciones vigentes: ambos fueron reemplazados por IMSS-Bienestar. Para medicamentos, el derecho a medicamentos gratuitos también deriva de LGS Art. 77 Bis 1 — si no hay medicamentos en la unidad, cruza referencia con el capítulo de Medicamentos (GUIA-07) para el proceso Receta Completa. La LGS Art. 2 establece que entre los objetivos del sistema de salud está la prestación gratuita de servicios a personas sin seguridad social.",
      jurisprudencias: [],
      noms: []
    },
    populations: {
      imss: null,
      issste: null,
      sinSeguro: "Sin seguridad social, IMSS-Bienestar es tu institución. Si no sabes a qué hospital IMSS-Bienestar correspondes, busca en imssbienestar.gob.mx. Las unidades de primer nivel (UMF rurales y centros de salud) son el punto de entrada; los hospitales generales son segundo nivel. No necesitas credencial especial para urgencias — la atención debe darse por el solo hecho de llegar al hospital."
    }
  },

  // ============================================================
  // GUIA-10: Cómo quejarte — el camino completo
  // ============================================================
  {
    id: "como-quejarte",
    title: "Cómo quejarte: el camino completo",
    ley: "LGS Art. 54 | Ley de Amparo | CONAMED Decreto 1996",
    action: {
      headline: "Hay cinco niveles de queja, de más fácil a más fuerte — empieza desde el primero y documenta todo.",
      steps: [
        "NIVEL 1 (hoy): Presenta queja escrita en el Módulo de Atención del mismo hospital. Exige copia con sello de recibido. Este paso es obligatorio para IMSS e ISSSTE antes de ir a CONAMED.",
        "NIVEL 2 (si no resuelven en 15 días): OIC del IMSS (800 623 2323 op.6) o Comisión de Quejas ISSSTE (800 012 7835). Para IMSS-Bienestar: CAT 800 298 1150 o CNDH directamente.",
        "NIVEL 3 en adelante: CONAMED para conciliar (800 711 0658), CNDH para derechos humanos (800 008 6900), amparo con abogado para orden judicial (Defensoría Pública Federal 800 22 42 426)."
      ],
      phone: "800 711 0658",
      crossRef: "queja"
    },
    legal: {
      body: "La LGS Art. 54 obliga a todas las instituciones de salud a tener mecanismos internos para recibir quejas y orientación — el módulo interno no es optativo. NIVEL 1 — Módulo interno del hospital: siempre es el primer paso. Para IMSS e ISSSTE, este paso es prerequisito para acceder a CONAMED. Guarda siempre el acuse de recibo con sello y folio. NIVEL 2 — OIC del IMSS (800 623 2323 opción 6; imss.gob.mx/oic/quejasydenuncias) o Comisión de Quejas ISSSTE (800 012 7835; Reglamento DOF 27-09-2024): puede investigar al personal de la institución, imponer sanciones administrativas, y tomar medidas correctivas. Plazo de resolución: 60 días en IMSS, 115 días hábiles en ISSSTE. NIVEL 3 — CONAMED (800 711 0658; primera_atencion@conamed.gob.mx; Av. Marina Nacional 60, CDMX): busca acuerdo entre tú y la institución mediante conciliación o arbitraje. IMPORTANTE: CONAMED NO puede sancionar penalmente al médico, NO puede revocar licencias médicas, y NO puede obligar a ninguna de las partes sin acuerdo previo para el arbitraje. Haber ido a CONAMED no te quita el derecho de demandar civilmente después (SCJN 1a./J. 27/2025 — HIGH confidence). Plazo típico: 3-4 meses para conciliación. NIVEL 4 — CNDH (800 008 6900, 24 horas para urgencias; Periférico Sur 3469, CDMX): investiga violaciones a derechos humanos. Plazo: 90 días (extensible). Sus recomendaciones no son vinculantes, pero generan presión institucional. Ideal para casos de discriminación, violaciones sistemáticas, y cuando el OIC no respondió. Plazo para presentar: 1 año desde la violación. NIVEL 5 — Amparo: requiere abogado pero la Defensoría Pública Federal es gratuita (800 22 42 426). El juez puede emitir una suspensión provisional que obliga a la institución a actuar mientras se resuelve el juicio. Ha funcionado para obligar al IMSS a entregar medicamentos oncológicos. Situaciones donde el amparo tiene precedentes de éxito: desabasto de medicamentos crónicos o de cáncer, negativa de urgencias con daño resultante, violación sistemática de derecho fundamental sin remedio administrativo efectivo.",
      jurisprudencias: [
        {
          type: "scjn",
          id: "1a./J. 27/2025",
          text: "Ir a CONAMED no extingue el derecho de demandar civilmente al médico o a la institución — ambas vías son independientes y pueden usarse de forma complementaria.",
          source: "SCJN, Primera Sala, Jurisprudencia 1a./J. 27/2025",
          confidence: "HIGH"
        }
      ],
      noms: []
    },
    populations: {
      imss: "En el IMSS: el orden obligatorio es módulo interno → OIC IMSS → CONAMED → CNDH → amparo. Si vas a CONAMED sin haber pasado por el módulo interno, tu queja puede ser rechazada por falta de agotamiento de instancias previas. OIC IMSS: 800 623 2323 opción 6.",
      issste: "En el ISSSTE: módulo del hospital → Comisión de Quejas ISSSTE (Reglamento 2024, plazo 115 días) → CONAMED → CNDH → amparo. El Reglamento ISSSTE 2024 da 5 días para complementar documentos si hay faltantes, y el plazo para presentar la queja es de 2 años desde los hechos. Teléfono: 800 012 7835.",
      sinSeguro: "En IMSS-Bienestar o SSA: no hay OIC equivalente al IMSS. El camino es: CAT IMSS-Bienestar (800 298 1150) → CNDH (800 008 6900) → CONAMED (800 711 0658) → amparo. La CNDH es el escalamiento principal para violaciones en hospitales del sistema público no IMSS/ISSSTE."
    }
  },

  // ============================================================
  // GUIA-11: Poblaciones especiales — protecciones específicas
  // NOTE: LGDNNA Arts. 50-52 are MEDIUM confidence — cited in body only.
  // NOTE: Convenio 169 OIT Art. 25 principle is HIGH; exact text MEDIUM.
  // NOTE: NOM-015-SSA-2023 is HIGH confidence — goes in noms[].
  // ============================================================
  {
    id: "poblaciones-especiales",
    title: "Poblaciones especiales: protecciones reforzadas",
    ley: "LSS Art. 89 Fr. V | NOM-007-SSA2-2016 | NOM-015-SSA-2023 | Convenio 169 OIT",
    action: {
      headline: "Algunos grupos tienen protecciones legales adicionales — aquí están las que aplican en atención médica.",
      steps: [
        "Embarazadas: cualquier hospital público DEBE atender urgencias obstétricas sin importar si tienes IMSS, ISSSTE, o ningún seguro (LSS Art. 89 Fr. V, reforma 2015; NOM-007-SSA2-2016). No hay excepciones.",
        "Niños, adultos mayores, indígenas y personas con discapacidad: tienes protecciones legales específicas. Si detectas trato discriminatorio, llama al 800 008 6900 (CNDH, 24 horas).",
        "Personas con discapacidad: los ajustes razonables en atención médica son obligatorios — no son un favor (NOM-015-SSA-2023). Si no los reciben, la queja va a CONAMED o CNDH."
      ],
      phone: "800 008 6900",
      crossRef: "queja"
    },
    legal: {
      body: "EMBARAZADAS — Urgencia obstétrica universal: la LSS Art. 89 Fr. V (adicionada DOF 12-11-2015) obliga al IMSS a atender urgencias obstétricas independientemente de la derechohabiencia de la mujer. Esta misma obligación aplica al ISSSTE por la LISSSTE Art. 30 (urgencias como parte del servicio médico obligatorio) y a todos los hospitales públicos por LGS Art. 55 (atención de urgencias). La NOM-007-SSA2-2016 establece que la atención obstétrica de urgencias es prioridad absoluta, 365 días al año, en todos los establecimientos que cuenten con el servicio. Ningún hospital público puede rechazar a una mujer embarazada con urgencia — ni por falta de carnet, ni por ser de otra clínica, ni por ser de otro estado. NIÑOS Y ADOLESCENTES — La Ley General de Derechos de Niñas, Niños y Adolescentes (LGDNNA) garantiza el derecho al más alto nivel de salud y el acceso a servicios médicos gratuitos y de calidad (Arts. 50-52 — citados con MEDIUM confidence; LGDNNA PDF no re-verificado en esta sesión). El 'interés superior del niño' es un principio constitucional (Art. 4 CPEUM) que prevalece en toda decisión médica que afecte a menores. En el IMSS, los hijos tienen cobertura hasta los 16 años (25 si estudian — LSS Art. 84). Los menores sin seguridad social tienen derecho a atención gratuita por IMSS-Bienestar y SSA. ADULTOS MAYORES — No existe artículo específico de la LGS para protecciones reforzadas en atención médica para adultos mayores, pero el derecho a trato digno y respetuoso (LGS Art. 51) aplica plenamente. La Pensión Bienestar (no contributiva) se otorga desde los 68 años (65 para personas en zonas indígenas). Esta pensión es compatible con pensiones del IMSS/ISSSTE. PUEBLOS INDÍGENAS — El Convenio 169 de la OIT (ratificado por México en 1990) establece en su Art. 25 que los servicios de salud para pueblos indígenas deben organizarse a nivel comunitario, incluir métodos de prevención y prácticas de medicina tradicional, y prestarse con participación de la comunidad (principio HIGH confidence; texto exacto MEDIUM — OIT PDF no re-verificado). La LGS Art. 6 establece que los objetivos del Sistema Nacional de Salud incluyen servicios con pertinencia cultural. Los proveedores de salud no pueden negarte atención por motivos lingüísticos o culturales — tienes derecho a intérprete. PERSONAS CON DISCAPACIDAD — La NOM-015-SSA-2023 (publicada DOF 22-05-2023, supersede NOM-015-SSA3-2012) establece que todos los establecimientos de salud deben proveer ajustes razonables en todos los formatos accesibles: apoyo de lenguaje para discapacidad auditiva, documentos en Braille y lectores para discapacidad visual, evaluación de movilidad para discapacidad física, evaluación psicológica para discapacidad intelectual. La discriminación en la prestación de servicios de salud por razón de discapacidad es violación a la NOM-015-SSA-2023 y a la LGS Art. 51. Las quejas por discriminación o falta de ajustes razonables se dirigen a CONAMED (conciliación), CNDH (derechos humanos), y CONADIS (Consejo Nacional para el Desarrollo y la Inclusión de las Personas con Discapacidad) para violaciones sistémicas.",
      jurisprudencias: [],
      noms: [
        {
          id: "NOM-007-SSA2-2016",
          text: "La atención de urgencias obstétricas es prioridad absoluta en todos los hospitales públicos, sin importar derechohabiencia, los 365 días del año.",
          dof: "5432289"
        },
        {
          id: "NOM-015-SSA-2023",
          text: "Los establecimientos de salud deben proveer ajustes razonables en formatos accesibles para personas con discapacidad auditiva, visual, física e intelectual — sin excepción.",
          dof: "5689454"
        }
      ]
    },
    populations: {
      imss: "En el IMSS: urgencia obstétrica universal (LSS Art. 89 Fr. V); menores hasta 16 años cubiertos (25 si estudian — LSS Art. 84); ajustes razonables para discapacidad obligatorios en todas las unidades (NOM-015-SSA-2023). Queja por discriminación: módulo interno → OIC IMSS (800 623 2323 op.6).",
      issste: "En el ISSSTE: urgencias obstétricas incluidas en los servicios médicos obligatorios (LISSSTE Art. 30). Los mismos derechos por discapacidad aplican (NOM-015-SSA-2023 aplica a todo el sistema nacional). Queja por discriminación: Comisión de Quejas ISSSTE (800 012 7835).",
      sinSeguro: "Sin seguridad social: urgencia obstétrica universal en cualquier hospital público. Para menores sin seguro, la atención es gratuita en IMSS-Bienestar y SSA. Para personas indígenas sin seguro, el IMSS-Bienestar tiene obligación de pertinencia cultural (LGS Art. 6 + Convenio 169 OIT). Quejas por discriminación: CNDH (800 008 6900)."
    }
  },

  // ============================================================
  // GUIA-12: Incapacidad médica — tus derechos económicos
  // Bridge chapter: healthcare rights → labor rights (NoMeChinguen)
  // ============================================================
  {
    id: "incapacidad-medica",
    title: "Tu incapacidad médica: derechos económicos",
    ley: "LSS Arts. 96, 97, 98 | LFT Art. 42, Fr. II",
    action: {
      headline: "Si el IMSS te da incapacidad, tienes derecho a subsidio económico a partir del cuarto día — pero hay una trampa en los primeros tres días que debes saber.",
      steps: [
        "El IMSS paga el 60% de tu salario de cotización a partir del 4to día de incapacidad (LSS Art. 98). Los primeros 3 días generalmente no los paga nadie — ni el IMSS ni el patrón, salvo que este último lo haga voluntariamente.",
        "No te pueden despedir mientras tienes incapacidad IMSS certificada. La incapacidad suspende la relación laboral sin consecuencias para ti (LFT Art. 42 Fr. II). Si te despiden en ese periodo, hay violación a la LFT.",
        "Si tienes también problema laboral por la incapacidad — hostigamiento, despido, descuento de salario — eso ya es materia de otra herramienta: NoMeChinguen (derechos laborales)."
      ],
      phone: null,
      crossRef: null
    },
    legal: {
      body: "El Seguro de Enfermedades y Maternidad del IMSS incluye un subsidio por incapacidad para el trabajo por enfermedad general. LSS Art. 96 — el subsidio se paga a partir del cuarto día de incapacidad, con duración máxima de 52 semanas, extensible hasta 26 semanas adicionales con dictamen médico del IMSS. Condición de elegibilidad: el trabajador debe tener al menos 4 cotizaciones semanales inmediatamente anteriores al inicio de la incapacidad. LSS Art. 97 — para trabajadores eventuales el requisito es 6 cotizaciones semanales en los 4 meses anteriores. LSS Art. 98 — el subsidio equivale al 60% del último salario diario de cotización registrado ante el IMSS. Se paga semanalmente de forma directa al trabajador. EL GAP DE 3 DÍAS: los primeros 3 días de incapacidad no generan obligación de pago ni para el IMSS ni para el patrón por ley (LFT Art. 42 Fr. II — la incapacidad suspende la obligación de trabajar y, simultáneamente, la obligación del patrón de pagar salario). Muchos patrones cubren voluntariamente estos 3 días, pero no están legalmente obligados. CÓMO FUNCIONA: el médico del IMSS emite un Certificado de Incapacidad en papel. El trabajador lo entrega al patrón. El IMSS paga el 60% directamente al trabajador a partir del día 4. PROTECCIÓN LABORAL: mientras dure la incapacidad certificada por el IMSS, el trabajador no puede ser despedido — la relación laboral está suspendida pero no termina (LFT Art. 42 Fr. II). Si el patrón intenta despedir al trabajador durante este periodo, incurre en violación al LFT; el trabajador tiene derecho a la reinstalación o a indemnización constitucional. Después de 52 + 26 semanas de incapacidad continua, si la condición es permanente, el trabajador transiciona al régimen de Invalidez del IMSS (LSS Capítulo V — fuera del alcance de este capítulo, pero relevante como siguiente paso).",
      jurisprudencias: [],
      noms: []
    },
    populations: {
      imss: "Este capítulo aplica exclusivamente a derechohabientes del IMSS. Los requisitos de cotización (LSS Arts. 96-97) son la condición principal para acceder al subsidio. Si tu patrón no te ha cotizado correctamente, el subsidio puede ser menor o no proceder — revisa tu Número de Seguridad Social (NSS) en imss.gob.mx.",
      issste: "El ISSSTE tiene un sistema de incapacidades distinto regulado por su propia ley. Los plazos y montos no son los mismos que en el IMSS — consulta con tu área de Recursos Humanos o con el Departamento de Prestaciones ISSSTE de tu institución. Teléfono general ISSSTE: 800 012 7835.",
      sinSeguro: "Sin seguridad social, no existe el subsidio IMSS por incapacidad — este beneficio es exclusivo de derechohabientes IMSS. Si tienes accidente de trabajo siendo trabajador informal, hay vías de responsabilidad civil o laboral, pero son distintas a la incapacidad IMSS."
    }
  },

  // ============================================================
  // GUIA-13: Derechos sexuales y reproductivos
  // ILE at IMSS: MEDIUM confidence (AR 267/2023) — body prose only
  // ILE at ISSSTE: HIGH confidence (Acuerdo DOF 23-01-2025, código 5747609)
  // CRITICAL: ILE availability follows STATE law — NEVER present as universal
  // NOM-005-SSA2-1993 (family planning): LOW confidence — DO NOT cite
  // ============================================================
  {
    id: "derechos-reproductivos",
    title: "Derechos sexuales y reproductivos",
    ley: "LGS Art. 67 | SCJN AR 267/2023 | Acuerdo ISSSTE DOF 23-01-2025",
    action: {
      headline: "Tienes derecho a anticoncepción gratuita y, en la mayoría del país, a la interrupción legal del embarazo en instituciones públicas — pero la disponibilidad del ILE depende de si tu estado ha despenalizado el aborto.",
      steps: [
        "Anticoncepción gratuita: puedes pedir métodos anticonceptivos en tu Unidad de Medicina Familiar (UMF) del IMSS o ISSSTE sin necesidad de hacer trámites especiales. LGS Art. 67 garantiza el derecho a decidir libremente sobre el número de hijos.",
        "ILE (Interrupción Legal del Embarazo): disponible en IMSS e ISSSTE en el Distrito Federal (CDMX) y estados que han despenalizado el aborto (aproximadamente 25 de 32 entidades en 2026). Para saber si aplica en tu estado: WhatsApp IMSS 55 4595 0448.",
        "Si estás en un estado donde el aborto no está despenalizado localmente, el IMSS o ISSSTE puede no garantizar el servicio. Consulta a una organización de derechos reproductivos para opciones legales en tu situación."
      ],
      phone: null,
      crossRef: null
    },
    legal: {
      body: "ANTICONCEPCIÓN — La LGS Art. 67 establece que los servicios de planificación familiar tienen carácter prioritario y reconoce el derecho de toda persona a decidir libremente sobre el número y espaciamiento de sus hijos. El IMSS y el ISSSTE están obligados a proporcionar métodos anticonceptivos gratuitos en sus unidades de medicina familiar. La LGS Art. 68 (citada con MEDIUM confidence — texto confirmado en fuentes secundarias pero no verificado directamente del PDF oficial actualizado) lista los servicios de planificación familiar: programas de educación, atención y seguimiento de usuarios, y consejería. Los adolescentes tienen derecho a acceder a consejería en anticoncepción en centros de salud públicos, aunque la implementación varía por unidad. ILE EN EL IMSS — La SCJN, en el Amparo en Revisión 267/2023 (Primera Sala, resolución 6 de septiembre de 2023, Ministra Ana Margarita Ríos Farjat — criterio no verificado directamente en el Semanario Judicial de la Federación), declaró inconstitucionales los Arts. 331 y 332 del Código Penal Federal que criminalizaban el aborto, y estableció que las instituciones federales de salud deben proporcionar servicios de ILE voluntaria. IMSS publicó guía técnica institucional y comenzó a ofrecer el servicio. ESTADO-DEPENDENCIA OBLIGATORIA: la disponibilidad del servicio en el IMSS sigue la legislación estatal — en estados donde el código penal local aún criminaliza el aborto, el IMSS no puede garantizar el acceso. El IMSS mismo ha declarado que la disponibilidad sigue la ley local. Para verificar si aplica en tu estado, usa el WhatsApp informativo del IMSS: 55 4595 0448 (número citado en fuentes de noticias — MEDIUM confidence para vigencia actual). ILE EN EL ISSSTE — El Director General del ISSSTE publicó un Acuerdo en el DOF el 23 de enero de 2025 (código DOF 5747609) que entró en vigor el 24 de enero de 2025 — fuente HIGH confidence verificada en DOF. Este Acuerdo establece: consentimiento informado obligatorio, registro de objetores de conciencia (para garantizar que la objeción de un médico no bloquee el acceso), y disponibilidad del servicio en unidades ISSSTE participantes. La lista de unidades participantes se actualiza en gob.mx/issste/articulos/interrupcion-legal-del-embarazo-ile. Contacto para información: cat.issste@issste.gob.mx. La misma limitación de estado-dependencia aplica al ISSSTE: donde la ley local criminaliza el aborto, la implementación puede estar restringida.",
      jurisprudencias: [],
      noms: []
    },
    populations: {
      imss: "En el IMSS: anticoncepción gratuita en tu UMF (solicítala directamente al médico familiar). ILE disponible en CDMX y estados con despenalización — llama al 55 4595 0448 para verificar disponibilidad en tu estado antes de ir. El IMSS tiene guía técnica institucional de ILE; la disponibilidad varía por unidad.",
      issste: "En el ISSSTE: anticoncepción gratuita en unidades de medicina familiar. ILE regulada por el Acuerdo del Director General DOF 23-01-2025 — disponible en unidades participantes. Lista de unidades: gob.mx/issste/articulos/interrupcion-legal-del-embarazo-ile. Contacto: cat.issste@issste.gob.mx.",
      sinSeguro: "Sin seguridad social: anticoncepción gratuita disponible en centros de salud de la SSA e IMSS-Bienestar (LGS Art. 67). Para ILE sin seguro, las opciones dependen de tu estado — las organizaciones de la sociedad civil que brindan acompañamiento gratuito incluyen IPAS México (ipas.org) y las Redes de acompañantes por estado."
    }
  },
];

// ============================================================
// QUEJA_SCENARIOS — 10 situations for the Queja wizard step 1
// IDs must match quejaRef values in FRASES and QUEJA_PATHS keys
// ============================================================
const QUEJA_SCENARIOS = [
  { id: "urgencias", label: "Me negaron urgencias", desc: "Te rechazaron en urgencias, no te valoró un médico, o te mandaron a otra clínica sin estabilizarte.", icon: "🚨" },
  { id: "urgencia_obstetrica", label: "Urgencia obstétrica", desc: "Mujer embarazada con complicación a quien negaron atención o fue rechazada por no ser derechohabiente.", icon: "🤰" },
  { id: "medicamentos", label: "No me surtieron el medicamento", desc: "La farmacia no tenía tu medicamento, te mandaron a comprarlo afuera, o te dieron uno diferente sin justificación.", icon: "💊" },
  { id: "negligencia", label: "Negligencia médica", desc: "Daño o complicación por error de diagnóstico, procedimiento mal ejecutado, o atención incorrecta.", icon: "⚕️" },
  { id: "maltrato", label: "Maltrato o discriminación", desc: "Trato irrespetuoso, discriminación por género, edad, origen o apariencia, o violación a tu dignidad como paciente.", icon: "✋" },
  { id: "cobro_indebido", label: "Me cobraron algo que no deben", desc: "Te pidieron dinero, materiales o pago por un servicio que debe ser gratuito en institución pública.", icon: "💰" },
  { id: "consentimiento", label: "Procedimiento sin mi consentimiento", desc: "Te realizaron una cirugía, procedimiento o tratamiento sin explicarte y pedirte autorización.", icon: "📋" },
  { id: "espera_especialista", label: "Espera excesiva para especialista", desc: "La cita con especialista está en meses, o te negaron la referencia a segundo nivel siendo necesaria.", icon: "🕐" },
  { id: "alta_prematura", label: "Alta antes de tiempo", desc: "Te dieron de alta o te presionaron para firmar alta voluntaria antes de estar estable.", icon: "🏥" },
  { id: "expediente", label: "No me dan mi expediente clínico", desc: "Negaron o retrasaron la entrega de copia de tu expediente clínico o estudios.", icon: "📂" },
];

// ============================================================
// QUEJA_PATHS — keyed output cards for each scenario + institution combo
// Key format: "situationId_institution"
// Institutions: imss | issste | imss_bienestar
// "no_se" is remapped to "imss_bienestar" in the renderer before lookup
//
// ROUTING RULES (LEGAL constraints):
// - IMSS + ISSSTE paths: Step 1 = internal complaint (D-09)
// - CONAMED outcome note: always state it cannot sanction/imprison (PITFALLS.md #6)
// - Amparo: only in escalationTrain last position, never in steps[]
// ============================================================
const QUEJA_PATHS = {

  // ── URGENCIAS ──────────────────────────────────────────────
  "urgencias_imss": {
    institution: "IMSS — Módulo de Atención al Derechohabiente",
    situationIntro: "Te negaron urgencias — esto es lo que haces.",
    situationIntroTranquilo: "Te negaron atención de urgencias — aquí está tu camino.",
    steps: [
      "Presenta queja por escrito en el Módulo de Atención al Derechohabiente del mismo hospital. Exige copia con sello.",
      "Si no resuelven en 15 días hábiles, presenta queja ante el OIC del IMSS en imss.gob.mx/oic/quejasydenuncias o llama al 800 623 2323 opción 6.",
      "Si el OIC no da respuesta satisfactoria en 60 días, escala a CONAMED. Tel: 800 711 0658. CONAMED busca un acuerdo — no sanciona ni mete preso a nadie.",
    ],
    stepsTranquilo: [
      "Presenta una queja por escrito en el Módulo de Atención al Derechohabiente del mismo hospital. Solicita una copia con sello como comprobante.",
      "Si no recibes respuesta en 15 días hábiles, presenta la misma queja ante el Órgano Interno de Control del IMSS (imss.gob.mx/oic/quejasydenuncias o 800 623 2323 opción 6).",
      "Si el OIC no resuelve en 60 días, puedes solicitar la intervención de CONAMED (800 711 0658). CONAMED facilita acuerdos, no impone sanciones penales.",
    ],
    phone: "800 623 2323",
    url: "imss.gob.mx/oic/quejasydenuncias",
    docs: ["INE o identificación oficial", "Número de Seguridad Social (NSS)", "Carnet de derechohabiente o CURP", "Escrito con fecha, hora, nombre del médico o área, y lo que ocurrió", "Cualquier documento que te hayan dado en el hospital (recetas, notas, negativa escrita)"],
    outcome: "Módulo interno: respuesta en 15 días hábiles. OIC: investigación en 60 días. CONAMED: conciliación en 3-4 meses.",
    escalationTrain: ["Módulo interno IMSS", "OIC IMSS", "CONAMED", "CNDH", "Amparo"],
    evidencia: ["Escrito del rechazo con sello del hospital si es posible", "Fotos del paciente en el hospital con fecha y hora activada", "Capturas de WhatsApp con testigos (tienen sello de tiempo)", "Recetas, solicitudes o estudios no atendidos"],
  },

  "urgencias_issste": {
    institution: "ISSSTE — Módulo de Atención al Derechohabiente",
    situationIntro: "Te negaron urgencias — esto es lo que haces.",
    situationIntroTranquilo: "Te negaron atención de urgencias — aquí está tu camino.",
    steps: [
      "Presenta queja escrita en el Módulo de Atención al Derechohabiente del hospital ISSSTE. Pide copia con sello.",
      "Si no hay respuesta en 15 días hábiles, escala al OIC del ISSSTE o llama al 800 012 7835.",
      "Si el OIC no resuelve en 60 días, presenta caso ante CONAMED (800 711 0658). CONAMED busca un acuerdo — no sanciona ni mete preso a nadie.",
    ],
    stepsTranquilo: [
      "Presenta una queja escrita en el Módulo de Atención al Derechohabiente del hospital ISSSTE. Solicita copia con sello.",
      "Si no recibes respuesta en 15 días hábiles, escala al Órgano Interno de Control del ISSSTE o comunícate al 800 012 7835.",
      "Si el OIC no resuelve en 60 días, puedes acudir a CONAMED (800 711 0658). CONAMED facilita acuerdos, no impone sanciones penales.",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["INE o identificación oficial", "Número de trabajador o credencial ISSSTE", "Escrito detallado de los hechos con fecha y hora", "Cualquier papel del hospital con sello"],
    outcome: "Módulo interno: respuesta en 15 días hábiles. OIC: investigación en 60 días. CONAMED: conciliación en 3-4 meses.",
    escalationTrain: ["Módulo interno ISSSTE", "OIC ISSSTE", "CONAMED", "CNDH", "Amparo"],
    evidencia: ["Escrito del rechazo firmado o sellado", "Fotos con fecha y hora activada", "Mensajes de WhatsApp con testigos", "Cualquier receta o solicitud rechazada"],
  },

  "urgencias_imss_bienestar": {
    institution: "CNDH — Comisión Nacional de Derechos Humanos (para hospitales SSA, IMSS-Bienestar o cuando no estás seguro/a de tu institución)",
    situationIntro: "Te negaron urgencias — esto es lo que haces.",
    situationIntroTranquilo: "Te negaron atención de urgencias — aquí está tu camino.",
    steps: [
      "Presenta queja ante la CNDH: 800 008 6900 (24 horas). También puedes ir en persona a Periférico Sur 3469, Col. San Jerónimo Lídice, CDMX. O en línea: cndh.org.mx.",
      "Alternativamente, presenta queja ante CONAMED si el hospital es público de cualquier tipo: 800 711 0658. Llevar INE, narración de hechos, y cualquier documento del hospital.",
      "Si ya hubo daño y quieres responsabilizar a la institución: LFRPE ante el Tribunal Federal de Justicia Administrativa — plazo de 1 año desde que conociste el daño.",
    ],
    stepsTranquilo: [
      "Comunícate con la CNDH: 800 008 6900 (disponible las 24 horas). También puedes acudir en persona a Periférico Sur 3469, Col. San Jerónimo Lídice, CDMX, o presentar tu queja en línea en cndh.org.mx.",
      "Como alternativa, puedes presentar tu queja ante CONAMED si el hospital es público: 800 711 0658. Lleva tu INE, una narración de los hechos y cualquier documento del hospital.",
      "Si hubo daño y deseas que la institución responda legalmente: existe la vía de Responsabilidad Patrimonial del Estado (LFRPE) ante el Tribunal Federal de Justicia Administrativa — el plazo es de 1 año desde que conociste el daño.",
    ],
    phone: "800 008 6900",
    url: "cndh.org.mx",
    docs: ["INE o identificación oficial", "CURP si la tienes", "Narración escrita de los hechos con fecha y hora", "Nombre del hospital y municipio", "Cualquier papel que te hayan dado"],
    outcome: "CNDH: investigación en 90 días (extendable). CONAMED: conciliación en 3-4 meses. LFRPE: resolución en 6-12 meses.",
    escalationTrain: ["CNDH", "CONAMED", "LFRPE", "Amparo"],
    evidencia: ["Escrito de rechazo si existe", "Fotos con fecha y hora", "Testimonios de acompañantes", "Cualquier receta, nota o estudio"],
  },

  // ── URGENCIA OBSTÉTRICA ────────────────────────────────────
  "urgencia_obstetrica_imss": {
    institution: "IMSS — Urgencias obstétricas son UNIVERSALES (LSS Art. 89 Fr. V)",
    situationIntro: "Urgencia obstétrica — la ley te protege sin importar tu derechohabiencia.",
    situationIntroTranquilo: "Urgencia obstétrica — tienes derecho a atención en cualquier hospital público.",
    steps: [
      "Di en voz alta: 'Tengo una urgencia obstétrica. LSS Art. 89 Fracción V obliga a este hospital a atenderme independientemente de mi derechohabiencia. No me pueden negar atención.' Si hay riesgo inmediato, llama al 911.",
      "Si te rechazan, llama a CNDH al 800 008 6900 — tienen guardia 24 horas y facultad de intervención inmediata.",
      "Después, presenta queja interna en el Módulo de Atención al Derechohabiente y escala a OIC IMSS (800 623 2323 opción 6) si no hay respuesta en 15 días.",
    ],
    stepsTranquilo: [
      "Solicita atención indicando: 'Presento una urgencia obstétrica. El Art. 89 Fracción V de la Ley del Seguro Social establece que este hospital tiene la obligación de atenderme sin importar mi derechohabiencia.' Si hay riesgo inmediato, llama al 911.",
      "Si no reciben atención, comunícate con la CNDH al 800 008 6900, disponible las 24 horas con capacidad de intervención inmediata.",
      "Después, presenta una queja escrita en el Módulo de Atención al Derechohabiente y, si no hay respuesta en 15 días, escala al OIC del IMSS (800 623 2323 opción 6).",
    ],
    phone: "800 008 6900",
    url: "cndh.org.mx",
    docs: ["INE", "Cualquier papel de consultas previas o control prenatal", "Escrito del rechazo si lo dieron"],
    outcome: "Urgencias: intervención CNDH en horas. Queja formal IMSS: respuesta en 15-60 días.",
    escalationTrain: ["Urgencias → 911", "CNDH 24h", "Módulo interno IMSS", "OIC IMSS", "Amparo"],
    evidencia: ["Escrito o constancia del rechazo", "Fotos con fecha y hora", "Nombre del médico o enfermero/a que rechazó", "Testigos presentes"],
  },

  "urgencia_obstetrica_issste": {
    institution: "ISSSTE — Urgencias obstétricas incluidas en servicios (LISSSTE Art. 30)",
    situationIntro: "Urgencia obstétrica — la ley te protege sin importar tu derechohabiencia.",
    situationIntroTranquilo: "Urgencia obstétrica — tienes derecho a atención en cualquier hospital público.",
    steps: [
      "Di en voz alta: 'Tengo una urgencia obstétrica. El Art. 30 de la Ley del ISSSTE incluye urgencias en los servicios médicos obligatorios. No pueden negármela.' Si hay riesgo inmediato, llama al 911.",
      "Si te rechazan, llama a CNDH: 800 008 6900 (24 horas, intervención inmediata).",
      "Después, presenta queja interna en el módulo ISSSTE y escala al OIC ISSSTE (800 012 7835) si no hay respuesta en 15 días.",
    ],
    stepsTranquilo: [
      "Solicita atención indicando: 'Presento una urgencia obstétrica. El Art. 30 de la Ley del ISSSTE establece que las urgencias están incluidas en los servicios médicos.' Si hay riesgo inmediato, llama al 911.",
      "Si te rechazan, comunícate con la CNDH al 800 008 6900, disponible las 24 horas.",
      "Después, presenta una queja escrita en el módulo ISSSTE. Si no hay respuesta en 15 días, escala al OIC del ISSSTE (800 012 7835).",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["INE", "Credencial ISSSTE o número de trabajador", "Documentos de control prenatal si los tienes"],
    outcome: "Urgencias: intervención CNDH en horas. Queja formal ISSSTE: respuesta en 15-60 días.",
    escalationTrain: ["Urgencias → 911", "CNDH 24h", "Módulo interno ISSSTE", "OIC ISSSTE", "Amparo"],
    evidencia: ["Escrito o constancia del rechazo", "Fotos con fecha y hora", "Nombre del personal que rechazó atención", "Testigos"],
  },

  "urgencia_obstetrica_imss_bienestar": {
    institution: "CNDH — Urgencia obstétrica es derecho universal (NOM-007-SSA2-2016)",
    situationIntro: "Urgencia obstétrica — la ley te protege sin importar tu derechohabiencia.",
    situationIntroTranquilo: "Urgencia obstétrica — tienes derecho a atención en cualquier hospital público.",
    steps: [
      "Cualquier hospital público DEBE atender la urgencia obstétrica sin importar derechohabiencia (NOM-007-SSA2-2016 + LGS Art. 55). Si hay riesgo inmediato: 911.",
      "Si te rechazan, llama de inmediato a CNDH: 800 008 6900 (24 horas, intervención inmediata en violaciones graves).",
      "Después, presenta queja ante la Secretaría de Salud estatal o ante CONAMED (800 711 0658) para el registro formal.",
    ],
    stepsTranquilo: [
      "Cualquier hospital público tiene la obligación de atender una urgencia obstétrica sin considerar la derechohabiencia (NOM-007-SSA2-2016). Si hay riesgo inmediato, llama al 911.",
      "Si la atención es rechazada, contacta de inmediato a la CNDH: 800 008 6900 (disponible las 24 horas).",
      "Después, presenta una queja ante la Secretaría de Salud del estado o ante CONAMED (800 711 0658) para el registro formal del caso.",
    ],
    phone: "800 008 6900",
    url: "cndh.org.mx",
    docs: ["INE o cualquier identificación", "Nombre del hospital", "Narración de hechos con fecha y hora"],
    outcome: "CNDH: intervención en horas para urgencias activas. Queja formal: resolución en 90 días.",
    escalationTrain: ["Urgencias → 911", "CNDH 24h", "Sec. Salud estatal", "CONAMED", "Amparo"],
    evidencia: ["Constancia de rechazo si la tienen", "Fotos", "Testimonios de acompañantes"],
  },

  // ── MEDICAMENTOS ───────────────────────────────────────────
  "medicamentos_imss": {
    institution: "IMSS — Módulo de Atención al Derechohabiente + recetacompleta.gob.mx",
    situationIntro: "No te surtieron tu medicamento — aquí está tu camino.",
    situationIntroTranquilo: "No te surtieron el medicamento — esto es lo que puedes hacer.",
    steps: [
      "Pide el talón de surtimiento parcial — el comprobante oficial de que la farmacia no tiene tu medicamento. Guárdalo.",
      "Registra el reporte en recetacompleta.gob.mx con tu CURP, folio de receta y nombre del medicamento. También puedes llamar al 800 623 2323 opción 6.",
      "Si el medicamento es crónico o de alto costo y no hay solución: queja formal ante OIC IMSS y, si persiste, CONAMED. CONAMED busca un acuerdo — no sanciona ni mete preso a nadie.",
    ],
    stepsTranquilo: [
      "Solicita el talón de surtimiento parcial — es el comprobante oficial de que la farmacia no tiene el medicamento. Consérvalo.",
      "Registra el reporte en recetacompleta.gob.mx con tu CURP, el folio de tu receta y el nombre del medicamento. También puedes llamar al 800 623 2323 opción 6.",
      "Si el medicamento es para condición crónica o de alto costo y no se resuelve: presenta una queja formal ante el OIC del IMSS. Si no hay respuesta satisfactoria, puedes acudir a CONAMED (800 711 0658).",
    ],
    phone: "800 623 2323",
    url: "recetacompleta.gob.mx",
    docs: ["Receta médica con nombre del medicamento y folio", "Talón de surtimiento parcial", "CURP", "NSS o carnet IMSS"],
    outcome: "recetacompleta.gob.mx: resolución en 5 días hábiles. OIC: en 60 días. CONAMED: en 3-4 meses.",
    escalationTrain: ["recetacompleta.gob.mx", "OIC IMSS", "CONAMED", "CNDH", "Amparo"],
    evidencia: ["Talón de surtimiento parcial", "Receta completa con folio", "Historial de recetas no surtidas", "Ticket de farmacia si compraste el medicamento"],
  },

  "medicamentos_issste": {
    institution: "ISSSTE — Farmacia y módulo de quejas",
    situationIntro: "No te surtieron tu medicamento — aquí está tu camino.",
    situationIntroTranquilo: "No te surtieron el medicamento — esto es lo que puedes hacer.",
    steps: [
      "Pide constancia escrita de que no tienen el medicamento. Guarda tu receta con folio.",
      "Presenta queja en el módulo de atención del ISSSTE o llama al 800 012 7835. Menciona el medicamento, la fecha y tu número de trabajador.",
      "Si no hay solución en 15 días: escala a CONAMED (800 711 0658). CONAMED busca un acuerdo — no sanciona ni mete preso a nadie.",
    ],
    stepsTranquilo: [
      "Solicita constancia escrita de que la farmacia ISSSTE no tiene el medicamento. Conserva tu receta con folio.",
      "Presenta una queja en el módulo de atención del ISSSTE o llama al 800 012 7835, indicando el medicamento, la fecha y tu número de trabajador.",
      "Si no hay solución en 15 días, puedes acudir a CONAMED (800 711 0658). CONAMED facilita acuerdos entre paciente e institución.",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["Receta médica con folio", "Credencial ISSSTE o número de trabajador", "Constancia de desabasto si te la dieron"],
    outcome: "Módulo interno: respuesta en 15 días. CONAMED: conciliación en 3-4 meses.",
    escalationTrain: ["Módulo interno ISSSTE", "OIC ISSSTE", "CONAMED", "CNDH", "Amparo"],
    evidencia: ["Receta no surtida con folio", "Constancia de desabasto firmada o sellada", "Ticket de compra si tuviste que comprarlo afuera"],
  },

  "medicamentos_imss_bienestar": {
    institution: "CNDH / CONAMED — hospitales SSA o IMSS-Bienestar",
    situationIntro: "No te surtieron tu medicamento — aquí está tu camino.",
    situationIntroTranquilo: "No te surtieron el medicamento — esto es lo que puedes hacer.",
    steps: [
      "Pide que documenten en tu expediente que no tienen el medicamento. Solicita una constancia escrita.",
      "Reporta en recetacompleta.gob.mx con tu CURP y el nombre del medicamento. O llama a la Secretaría de Salud estatal.",
      "Si no hay solución: queja ante CONAMED (800 711 0658) o CNDH (800 008 6900). CONAMED busca un acuerdo — no sanciona ni mete preso a nadie.",
    ],
    stepsTranquilo: [
      "Solicita que quede documentado en tu expediente que el medicamento no está disponible. Pide una constancia escrita.",
      "Reporta en recetacompleta.gob.mx con tu CURP y el nombre del medicamento, o comunícate con la Secretaría de Salud de tu estado.",
      "Si no hay solución, puedes presentar una queja ante CONAMED (800 711 0658) o la CNDH (800 008 6900).",
    ],
    phone: "800 008 6900",
    url: "recetacompleta.gob.mx",
    docs: ["CURP", "Receta médica con nombre del medicamento", "Constancia de desabasto si la tienen"],
    outcome: "CONAMED: conciliación en 3-4 meses. CNDH: investigación en 90 días.",
    escalationTrain: ["Sec. Salud estatal", "CONAMED", "CNDH", "Amparo"],
    evidencia: ["Receta con nombre del medicamento", "Constancia de desabasto firmada o sellada si es posible", "Ticket de farmacia si compraste afuera"],
  },

  // ── NEGLIGENCIA ────────────────────────────────────────────
  "negligencia_imss": {
    institution: "IMSS — OIC y CONAMED",
    situationIntro: "Sufriste negligencia médica — estos son tus pasos.",
    situationIntroTranquilo: "Viviste una situación de negligencia médica — aquí te orientamos.",
    steps: [
      "Solicita copia de tu expediente clínico AHORA — antes de que pueda ser modificado. Es tuyo por ley (NOM-004-SSA3-2012). Hazlo por escrito y guarda el acuse.",
      "Presenta queja interna ante el OIC del IMSS: imss.gob.mx/oic/quejasydenuncias o 800 623 2323 opción 6.",
      "Paralelamente, puedes ir a CONAMED (800 711 0658) — gratuito, especializado en negligencia. CONAMED busca un acuerdo — no sanciona ni mete preso. Para responsabilidad institucional: LFRPE ante Tribunal Federal de Justicia Administrativa (plazo 1 año).",
    ],
    stepsTranquilo: [
      "Solicita una copia de tu expediente clínico de forma urgente — es información que te pertenece (NOM-004-SSA3-2012). Hazlo por escrito y conserva el acuse de recibo.",
      "Presenta una queja ante el OIC del IMSS: imss.gob.mx/oic/quejasydenuncias o 800 623 2323 opción 6.",
      "Puedes acudir también a CONAMED (800 711 0658) — es gratuito y especializado en casos de negligencia médica. Para responsabilidad institucional, existe la vía LFRPE ante el Tribunal Federal de Justicia Administrativa (plazo 1 año desde que conociste el daño).",
    ],
    phone: "800 711 0658",
    url: "imss.gob.mx/oic/quejasydenuncias",
    docs: ["Expediente clínico completo (solicitarlo por escrito)", "INE y NSS", "Cronología escrita de lo que ocurrió", "Recetas, estudios, notas de alta", "Fotos y mensajes de WhatsApp con sello de tiempo"],
    outcome: "OIC: investigación en 60 días. CONAMED: conciliación en 3-4 meses. LFRPE: resolución en 6-12 meses.",
    escalationTrain: ["OIC IMSS", "CONAMED", "LFRPE", "CNDH", "Amparo"],
    evidencia: ["Expediente clínico completo", "Notas de evolución y alta", "Recetas y estudios", "Fotos con fecha y hora", "Testigos o acompañantes"],
  },

  "negligencia_issste": {
    institution: "ISSSTE — OIC y CONAMED",
    situationIntro: "Sufriste negligencia médica — estos son tus pasos.",
    situationIntroTranquilo: "Viviste una situación de negligencia médica — aquí te orientamos.",
    steps: [
      "Solicita copia de tu expediente clínico por escrito — NOM-004-SSA3-2012 lo garantiza. Guarda el acuse de recibo.",
      "Presenta queja ante el OIC del ISSSTE o llama al 800 012 7835.",
      "Paralelamente, ve a CONAMED (800 711 0658) — especializado en negligencia. CONAMED busca un acuerdo — no sanciona ni mete preso. Para responsabilidad institucional: LFRPE (plazo 1 año desde que conociste el daño).",
    ],
    stepsTranquilo: [
      "Solicita una copia de tu expediente clínico por escrito — la NOM-004-SSA3-2012 garantiza tu acceso. Conserva el acuse de recibo.",
      "Presenta una queja ante el OIC del ISSSTE o comunícate al 800 012 7835.",
      "Puedes acudir también a CONAMED (800 711 0658). Para responsabilidad institucional, existe la vía LFRPE (plazo de 1 año desde que conociste el daño).",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["Expediente clínico completo (solicitarlo por escrito)", "INE y número de trabajador ISSSTE", "Cronología de lo ocurrido", "Recetas, estudios, notas de alta"],
    outcome: "OIC: investigación en 60 días. CONAMED: conciliación en 3-4 meses. LFRPE: resolución en 6-12 meses.",
    escalationTrain: ["OIC ISSSTE", "CONAMED", "LFRPE", "CNDH", "Amparo"],
    evidencia: ["Expediente clínico", "Notas de evolución y alta", "Recetas y estudios", "Fotos con fecha y hora"],
  },

  "negligencia_imss_bienestar": {
    institution: "CONAMED / CNDH — hospitales SSA o IMSS-Bienestar",
    situationIntro: "Sufriste negligencia médica — estos son tus pasos.",
    situationIntroTranquilo: "Viviste una situación de negligencia médica — aquí te orientamos.",
    steps: [
      "Solicita copia de tu expediente clínico por escrito — NOM-004-SSA3-2012 te lo garantiza.",
      "Presenta queja ante CONAMED: 800 711 0658. Av. Marina Nacional 60, Piso 14, Col. Tacuba, CDMX. Llevar INE, narración de hechos, expediente si ya lo tienes. CONAMED busca un acuerdo — no sanciona ni mete preso.",
      "Para responsabilidad institucional (falla del hospital, no de un médico individual): LFRPE ante Tribunal Federal de Justicia Administrativa — plazo 1 año desde que conociste el daño.",
    ],
    stepsTranquilo: [
      "Solicita una copia de tu expediente clínico por escrito — es tu derecho según la NOM-004-SSA3-2012.",
      "Presenta una queja ante CONAMED (800 711 0658) en Av. Marina Nacional 60, Piso 14, Col. Tacuba, CDMX. Lleva tu INE, una narración de los hechos y el expediente si ya lo tienes.",
      "Para responsabilidad de la institución como tal, existe la vía LFRPE ante el Tribunal Federal de Justicia Administrativa, con un plazo de 1 año desde que conociste el daño.",
    ],
    phone: "800 711 0658",
    url: "gob.mx/conamed",
    docs: ["Expediente clínico (solicitarlo por escrito)", "INE", "CURP", "Narración detallada de lo ocurrido", "Estudios, recetas, notas de alta"],
    outcome: "CONAMED: conciliación en 3-4 meses. LFRPE: resolución en 6-12 meses. CNDH: investigación en 90 días.",
    escalationTrain: ["CONAMED", "LFRPE", "CNDH", "Vía civil", "Amparo"],
    evidencia: ["Expediente clínico", "Notas de evolución y alta", "Recetas y estudios", "Fotos y mensajes con fecha y hora"],
  },

  // ── MALTRATO / DISCRIMINACIÓN ──────────────────────────────
  "maltrato_imss": {
    institution: "IMSS — Módulo de Atención al Derechohabiente",
    situationIntro: "Te maltrataron o discriminaron — no tienes que aceptarlo.",
    situationIntroTranquilo: "Recibiste maltrato o discriminación — tienes derecho a quejarte.",
    steps: [
      "Presenta queja escrita en el Módulo de Atención al Derechohabiente. Describe exactamente lo que ocurrió: palabras, actitudes, nombre del personal si lo sabes.",
      "Si fue discriminación por género, embarazo, discapacidad o etnia: presenta también queja ante CONAPRED (conapred.org.mx) o CNDH (800 008 6900).",
      "Si no hay respuesta en 15 días: escala a OIC IMSS y, si persiste, a CONAMED.",
    ],
    stepsTranquilo: [
      "Presenta una queja escrita en el Módulo de Atención al Derechohabiente, describiendo con detalle lo que ocurrió: palabras utilizadas, actitud del personal, nombre si lo conoces.",
      "Si hubo discriminación por género, embarazo, discapacidad o etnia, presenta también una queja ante CONAPRED (conapred.org.mx) o la CNDH (800 008 6900).",
      "Si no hay respuesta en 15 días, escala al OIC del IMSS y, de no haber solución, a CONAMED.",
    ],
    phone: "800 623 2323",
    url: "conapred.org.mx",
    docs: ["INE y NSS", "Narración escrita con fecha, hora, nombre del personal", "Testigos si los hay"],
    outcome: "Módulo interno: respuesta en 15 días. CONAPRED: investigación en 60 días. CNDH: en 90 días.",
    escalationTrain: ["Módulo interno IMSS", "OIC IMSS", "CONAPRED", "CNDH", "Amparo"],
    evidencia: ["Narración escrita con detalles exactos", "Testigos presentes", "Grabaciones si las tienes (legal en México capturar lo que ocurre en tu presencia)", "Nombre del área o consultorio"],
  },

  "maltrato_issste": {
    institution: "ISSSTE — Módulo de Atención al Derechohabiente",
    situationIntro: "Te maltrataron o discriminaron — no tienes que aceptarlo.",
    situationIntroTranquilo: "Recibiste maltrato o discriminación — tienes derecho a quejarte.",
    steps: [
      "Presenta queja escrita en el módulo ISSSTE describiendo el maltrato o discriminación con fecha, hora y nombre del personal.",
      "Si fue discriminación por género, embarazo, discapacidad o etnia: presenta también queja ante CONAPRED (conapred.org.mx) o CNDH (800 008 6900).",
      "Si no hay respuesta en 15 días: escala a OIC ISSSTE (800 012 7835) y después a CONAMED.",
    ],
    stepsTranquilo: [
      "Presenta una queja escrita en el módulo ISSSTE describiendo lo ocurrido con fecha, hora y nombre del personal si lo conoces.",
      "Si hubo discriminación, presenta también queja ante CONAPRED (conapred.org.mx) o la CNDH (800 008 6900).",
      "Sin respuesta en 15 días, escala al OIC del ISSSTE (800 012 7835) y después, si es necesario, a CONAMED.",
    ],
    phone: "800 012 7835",
    url: "conapred.org.mx",
    docs: ["INE y número de trabajador ISSSTE", "Narración escrita con fecha, hora, nombre del personal"],
    outcome: "Módulo interno: respuesta en 15 días. CONAPRED: 60 días. CNDH: 90 días.",
    escalationTrain: ["Módulo interno ISSSTE", "OIC ISSSTE", "CONAPRED", "CNDH", "Amparo"],
    evidencia: ["Narración con detalles exactos", "Testigos", "Grabaciones si las tienes", "Nombre del área"],
  },

  "maltrato_imss_bienestar": {
    institution: "CNDH / CONAPRED — hospitales SSA o IMSS-Bienestar",
    situationIntro: "Te maltrataron o discriminaron — no tienes que aceptarlo.",
    situationIntroTranquilo: "Recibiste maltrato o discriminación — tienes derecho a quejarte.",
    steps: [
      "Presenta queja ante la CNDH: 800 008 6900. Para discriminación específicamente: CONAPRED en conapred.org.mx.",
      "También puedes presentar queja ante CONAMED (800 711 0658) si fue en hospital público.",
      "Documenta todo antes de que el tiempo borre detalles: nombres, palabras exactas, fecha, testigos.",
    ],
    stepsTranquilo: [
      "Presenta una queja ante la CNDH (800 008 6900). Para casos de discriminación, también puedes acudir a CONAPRED (conapred.org.mx).",
      "Si el incidente fue en un hospital público, puedes presentar tu queja también ante CONAMED (800 711 0658).",
      "Documenta todo mientras los detalles estén frescos: nombres, palabras exactas, fecha, hora y testigos.",
    ],
    phone: "800 008 6900",
    url: "conapred.org.mx",
    docs: ["INE", "CURP", "Narración detallada del incidente"],
    outcome: "CNDH: investigación en 90 días. CONAPRED: en 60 días.",
    escalationTrain: ["CNDH", "CONAPRED", "CONAMED", "Amparo"],
    evidencia: ["Narración escrita con detalles exactos", "Testigos", "Grabaciones si las tienes"],
  },

  // ── COBRO INDEBIDO ─────────────────────────────────────────
  "cobro_indebido_imss": {
    institution: "IMSS — Módulo de Atención al Derechohabiente",
    situationIntro: "Te cobraron algo que no deben — la atención pública es gratuita.",
    situationIntroTranquilo: "Te cobraron por algo que debería ser gratuito — aquí está tu camino.",
    steps: [
      "Guarda cualquier recibo, nota o comprobante de pago. Nunca tires la evidencia del cobro.",
      "Presenta queja escrita en el Módulo de Atención al Derechohabiente indicando monto, fecha, concepto cobrado y nombre del área.",
      "Si no hay respuesta en 15 días: escala a OIC IMSS (800 623 2323 opción 6). Pueden reembolsarte o sancionar al responsable.",
    ],
    stepsTranquilo: [
      "Conserva cualquier recibo, nota o comprobante de pago — es tu evidencia principal.",
      "Presenta una queja escrita en el Módulo de Atención al Derechohabiente indicando el monto, la fecha, el concepto y el nombre del área.",
      "Sin respuesta en 15 días, escala al OIC del IMSS (800 623 2323 opción 6). El cobro indebido puede derivar en sanción al responsable o reembolso.",
    ],
    phone: "800 623 2323",
    url: "imss.gob.mx/oic/quejasydenuncias",
    docs: ["Recibo o comprobante de pago", "INE y NSS", "Narración escrita del cobro con fecha y monto"],
    outcome: "Módulo: respuesta en 15 días. OIC: investigación en 60 días con posibilidad de reembolso.",
    escalationTrain: ["Módulo interno IMSS", "OIC IMSS", "CONAMED", "CNDH"],
    evidencia: ["Recibo o comprobante de pago", "Fotos de lo pagado", "Nombre del área o persona que cobró"],
  },

  "cobro_indebido_issste": {
    institution: "ISSSTE — Módulo de Atención al Derechohabiente",
    situationIntro: "Te cobraron algo que no deben — la atención pública es gratuita.",
    situationIntroTranquilo: "Te cobraron por algo que debería ser gratuito — aquí está tu camino.",
    steps: [
      "Guarda el recibo o comprobante de pago.",
      "Presenta queja escrita en el módulo ISSSTE indicando monto, fecha, concepto y área.",
      "Sin respuesta en 15 días: escala a OIC ISSSTE (800 012 7835).",
    ],
    stepsTranquilo: [
      "Conserva el recibo o comprobante de pago.",
      "Presenta una queja escrita en el módulo de atención ISSSTE con monto, fecha, concepto y área.",
      "Sin respuesta en 15 días, escala al OIC del ISSSTE (800 012 7835).",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["Recibo o comprobante de pago", "INE y número de trabajador ISSSTE"],
    outcome: "Módulo: respuesta en 15 días. OIC: investigación en 60 días.",
    escalationTrain: ["Módulo interno ISSSTE", "OIC ISSSTE", "CONAMED", "CNDH"],
    evidencia: ["Recibo de pago", "Fotos de lo pagado", "Nombre del área que cobró"],
  },

  "cobro_indebido_imss_bienestar": {
    institution: "CNDH / CONAMED — hospitales SSA o IMSS-Bienestar",
    situationIntro: "Te cobraron algo que no deben — la atención pública es gratuita.",
    situationIntroTranquilo: "Te cobraron por algo que debería ser gratuito — aquí está tu camino.",
    steps: [
      "Guarda el recibo de pago. Los servicios en hospital público SSA o IMSS-Bienestar son gratuitos (LGS Art. 35).",
      "Presenta queja ante la dirección del hospital o ante la Secretaría de Salud estatal.",
      "Si no hay respuesta: CONAMED (800 711 0658) o CNDH (800 008 6900).",
    ],
    stepsTranquilo: [
      "Conserva el recibo de pago. En hospitales públicos SSA o IMSS-Bienestar, los servicios son gratuitos según el Art. 35 de la Ley General de Salud.",
      "Presenta una queja ante la dirección del hospital o la Secretaría de Salud de tu estado.",
      "Sin respuesta, acude a CONAMED (800 711 0658) o la CNDH (800 008 6900).",
    ],
    phone: "800 008 6900",
    url: "cndh.org.mx",
    docs: ["Recibo de pago", "INE", "CURP", "Narración del cobro"],
    outcome: "CONAMED: conciliación en 3-4 meses. CNDH: investigación en 90 días.",
    escalationTrain: ["Dirección del hospital", "Sec. Salud estatal", "CONAMED", "CNDH"],
    evidencia: ["Recibo de pago", "Fotos", "Testigos"],
  },

  // ── CONSENTIMIENTO ─────────────────────────────────────────
  "consentimiento_imss": {
    institution: "IMSS — OIC y CONAMED",
    situationIntro: "Te hicieron un procedimiento sin tu consentimiento — eso es ilegal.",
    situationIntroTranquilo: "Te realizaron un procedimiento sin tu autorización — tienes derecho a actuar.",
    steps: [
      "Solicita copia de tu expediente clínico y del formulario de consentimiento que firmaste — o constancia de que no existe (NOM-004-SSA3-2012).",
      "Presenta queja ante OIC IMSS (800 623 2323 opción 6). El procedimiento sin consentimiento viola la LGS Art. 51 Bis 2 y la NOM-004.",
      "Para responsabilidad institucional: LFRPE ante Tribunal Federal de Justicia Administrativa (plazo 1 año). CONAMED (800 711 0658) para conciliación.",
    ],
    stepsTranquilo: [
      "Solicita copia de tu expediente clínico y del formulario de consentimiento, o una constancia de que no existe (NOM-004-SSA3-2012).",
      "Presenta una queja ante el OIC del IMSS (800 623 2323 opción 6). Realizar un procedimiento sin consentimiento viola la LGS Art. 51 Bis 2.",
      "Para responsabilidad institucional, existe la vía LFRPE ante el Tribunal Federal de Justicia Administrativa (plazo 1 año). Para conciliación: CONAMED (800 711 0658).",
    ],
    phone: "800 711 0658",
    url: "imss.gob.mx/oic/quejasydenuncias",
    docs: ["Expediente clínico completo", "Formulario de consentimiento o constancia de inexistencia", "INE y NSS", "Narración de lo ocurrido"],
    outcome: "OIC: investigación en 60 días. CONAMED: conciliación en 3-4 meses. LFRPE: resolución en 6-12 meses.",
    escalationTrain: ["OIC IMSS", "CONAMED", "LFRPE", "CNDH", "Amparo"],
    evidencia: ["Expediente clínico", "Formulario de consentimiento (o su ausencia)", "Notas de enfermería y evolución", "Testigos"],
  },

  "consentimiento_issste": {
    institution: "ISSSTE — OIC y CONAMED",
    situationIntro: "Te hicieron un procedimiento sin tu consentimiento — eso es ilegal.",
    situationIntroTranquilo: "Te realizaron un procedimiento sin tu autorización — tienes derecho a actuar.",
    steps: [
      "Solicita copia de tu expediente y del formulario de consentimiento.",
      "Presenta queja ante OIC ISSSTE (800 012 7835).",
      "Para conciliación o responsabilidad institucional: CONAMED (800 711 0658) o LFRPE (1 año de plazo).",
    ],
    stepsTranquilo: [
      "Solicita copia de tu expediente clínico y del formulario de consentimiento.",
      "Presenta una queja ante el OIC del ISSSTE (800 012 7835).",
      "Para conciliación: CONAMED (800 711 0658). Para responsabilidad institucional: LFRPE (plazo de 1 año).",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["Expediente clínico", "Formulario de consentimiento", "INE y número de trabajador ISSSTE"],
    outcome: "OIC: investigación en 60 días. CONAMED: conciliación en 3-4 meses.",
    escalationTrain: ["OIC ISSSTE", "CONAMED", "LFRPE", "CNDH", "Amparo"],
    evidencia: ["Expediente clínico", "Formulario de consentimiento o ausencia del mismo", "Notas médicas"],
  },

  "consentimiento_imss_bienestar": {
    institution: "CONAMED / CNDH",
    situationIntro: "Te hicieron un procedimiento sin tu consentimiento — eso es ilegal.",
    situationIntroTranquilo: "Te realizaron un procedimiento sin tu autorización — tienes derecho a actuar.",
    steps: [
      "Solicita copia de tu expediente clínico por escrito (NOM-004-SSA3-2012).",
      "Presenta queja ante CONAMED (800 711 0658): especializado en este tipo de violaciones.",
      "Para responsabilidad institucional: LFRPE ante Tribunal Federal de Justicia Administrativa (plazo 1 año).",
    ],
    stepsTranquilo: [
      "Solicita una copia de tu expediente clínico por escrito (NOM-004-SSA3-2012).",
      "Presenta una queja ante CONAMED (800 711 0658), que está especializado en violaciones al consentimiento informado.",
      "Para responsabilidad de la institución: LFRPE ante el Tribunal Federal de Justicia Administrativa (plazo 1 año).",
    ],
    phone: "800 711 0658",
    url: "gob.mx/conamed",
    docs: ["Expediente clínico", "Formulario de consentimiento", "INE", "CURP"],
    outcome: "CONAMED: conciliación en 3-4 meses. LFRPE: resolución en 6-12 meses.",
    escalationTrain: ["CONAMED", "LFRPE", "CNDH", "Vía civil", "Amparo"],
    evidencia: ["Expediente clínico", "Formulario de consentimiento (o su ausencia)", "Notas médicas"],
  },

  // ── ESPERA ESPECIALISTA ────────────────────────────────────
  "espera_especialista_imss": {
    institution: "IMSS — Módulo de Atención al Derechohabiente",
    situationIntro: "Te dan cita con especialista en meses — esto puedes hacer hoy.",
    situationIntroTranquilo: "La espera para el especialista es demasiado larga — aquí te orientamos.",
    steps: [
      "Pide a tu médico familiar que documente en tu expediente la necesidad de la referencia y el tiempo médicamente aceptable de espera.",
      "Presenta queja escrita en el Módulo de Atención al Derechohabiente indicando el diagnóstico, el especialista requerido y la fecha de la cita ofrecida.",
      "Si tu condición es urgente o se deteriora mientras esperas: ve a urgencias y solicita atención ahora.",
    ],
    stepsTranquilo: [
      "Pide a tu médico familiar que documente en tu expediente la necesidad de la referencia y el tiempo de espera médicamente razonable.",
      "Presenta una queja escrita en el Módulo de Atención al Derechohabiente indicando tu diagnóstico, el especialista que necesitas y la fecha de cita que te ofrecieron.",
      "Si tu condición es urgente o empeora mientras esperas, acude a urgencias para atención inmediata.",
    ],
    phone: "800 623 2323",
    url: "imss.gob.mx/oic/quejasydenuncias",
    docs: ["INE y NSS", "Orden de referencia del médico familiar", "Documentación de diagnóstico"],
    outcome: "Módulo: respuesta en 15 días. En casos urgentes: ir a urgencias directamente.",
    escalationTrain: ["Módulo interno IMSS", "OIC IMSS", "CONAMED", "CNDH"],
    evidencia: ["Orden de referencia", "Notas del médico familiar", "Comprobante de la cita asignada"],
  },

  "espera_especialista_issste": {
    institution: "ISSSTE — Módulo de Atención al Derechohabiente",
    situationIntro: "Te dan cita con especialista en meses — esto puedes hacer hoy.",
    situationIntroTranquilo: "La espera para el especialista es demasiado larga — aquí te orientamos.",
    steps: [
      "Pide que tu médico tratante documente la necesidad y urgencia de la referencia.",
      "Presenta queja en el módulo ISSSTE indicando el especialista requerido y la fecha de cita.",
      "Si el caso es urgente y se deteriora: ve a urgencias.",
    ],
    stepsTranquilo: [
      "Solicita a tu médico que documente la necesidad y urgencia de la referencia al especialista.",
      "Presenta una queja en el módulo ISSSTE indicando el especialista que necesitas y la fecha de cita que te dieron.",
      "Si el caso es urgente, acude a urgencias para atención inmediata.",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["Credencial ISSSTE", "Orden de referencia", "Notas del médico tratante"],
    outcome: "Módulo: respuesta en 15 días. Urgencias: atención inmediata.",
    escalationTrain: ["Módulo interno ISSSTE", "OIC ISSSTE", "CONAMED", "CNDH"],
    evidencia: ["Orden de referencia", "Notas del médico", "Comprobante de cita asignada"],
  },

  "espera_especialista_imss_bienestar": {
    institution: "CONAMED / Secretaría de Salud estatal",
    situationIntro: "Te dan cita con especialista en meses — esto puedes hacer hoy.",
    situationIntroTranquilo: "La espera para el especialista es demasiado larga — aquí te orientamos.",
    steps: [
      "Presenta queja ante la dirección del hospital o la Secretaría de Salud estatal indicando la necesidad de referencia y el tiempo de espera.",
      "Si hay urgencia médica: ve directamente a urgencias.",
      "Si no hay respuesta: CONAMED (800 711 0658) o CNDH (800 008 6900).",
    ],
    stepsTranquilo: [
      "Presenta una queja ante la dirección del hospital o la Secretaría de Salud de tu estado, indicando la necesidad de la referencia y el tiempo de espera.",
      "Si hay urgencia, acude directamente a urgencias.",
      "Sin respuesta, acude a CONAMED (800 711 0658) o la CNDH (800 008 6900).",
    ],
    phone: "800 711 0658",
    url: "gob.mx/conamed",
    docs: ["CURP", "Documentación del diagnóstico", "Narración de la situación"],
    outcome: "CONAMED: conciliación en 3-4 meses.",
    escalationTrain: ["Dirección del hospital", "Sec. Salud estatal", "CONAMED", "CNDH"],
    evidencia: ["Notas del médico que diagnosticó", "Comprobante de cita", "Narración escrita"],
  },

  // ── ALTA PREMATURA ─────────────────────────────────────────
  "alta_prematura_imss": {
    institution: "IMSS — Médico tratante y Módulo de Atención al Derechohabiente",
    situationIntro: "Te dieron el alta antes de tiempo — no firmes bajo presión.",
    situationIntroTranquilo: "Te dieron de alta prematuramente — tienes derecho a cuestionar esa decisión.",
    steps: [
      "No firmes el alta voluntaria bajo presión. Di: 'No firmaré sin entender mi estado actual. Por favor documenten en mi expediente que no estoy de acuerdo con el alta.'",
      "Pide al médico que registre en el expediente tu condición actual y el motivo del alta.",
      "Si el alta es forzada sin causa médica justificada: presenta queja inmediata en el Módulo de Atención al Derechohabiente y escala a OIC IMSS (800 623 2323 opción 6).",
    ],
    stepsTranquilo: [
      "No firmes el alta voluntaria bajo presión. Puedes decir: 'Prefiero no firmar hasta entender mi estado actual. Por favor documenten en el expediente que no estoy de acuerdo con el alta.'",
      "Solicita al médico que registre en tu expediente tu condición actual y el motivo del alta.",
      "Si el alta es forzada sin causa médica justificada, presenta una queja en el Módulo de Atención al Derechohabiente y escala al OIC del IMSS (800 623 2323 opción 6).",
    ],
    phone: "800 623 2323",
    url: "imss.gob.mx/oic/quejasydenuncias",
    docs: ["INE y NSS", "Nota de alta o constancia de lo ocurrido", "Narración de lo que te dijeron"],
    outcome: "Módulo: respuesta en 15 días. OIC: investigación en 60 días.",
    escalationTrain: ["Médico tratante (solicitar documentación)", "Módulo interno IMSS", "OIC IMSS", "CONAMED", "CNDH"],
    evidencia: ["Nota de alta médica", "Expediente clínico", "Narración del contexto", "Testigos"],
  },

  "alta_prematura_issste": {
    institution: "ISSSTE — Médico tratante y Módulo de Atención al Derechohabiente",
    situationIntro: "Te dieron el alta antes de tiempo — no firmes bajo presión.",
    situationIntroTranquilo: "Te dieron de alta prematuramente — tienes derecho a cuestionar esa decisión.",
    steps: [
      "No firmes el alta voluntaria bajo presión. Pide que documenten tu estado y el motivo del alta.",
      "Presenta queja en el módulo ISSSTE si el alta es injustificada.",
      "Sin respuesta: OIC ISSSTE (800 012 7835) y CONAMED.",
    ],
    stepsTranquilo: [
      "No firmes el alta voluntaria sin entender tu estado. Solicita que quede documentado el motivo del alta y tu condición actual.",
      "Presenta una queja en el módulo ISSSTE si el alta no tiene justificación médica.",
      "Sin respuesta, escala al OIC del ISSSTE (800 012 7835) y, si es necesario, a CONAMED.",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["Credencial ISSSTE", "Nota de alta", "Narración de lo ocurrido"],
    outcome: "Módulo: respuesta en 15 días. OIC: en 60 días.",
    escalationTrain: ["Módulo interno ISSSTE", "OIC ISSSTE", "CONAMED", "CNDH"],
    evidencia: ["Nota de alta", "Expediente clínico", "Testigos"],
  },

  "alta_prematura_imss_bienestar": {
    institution: "CONAMED / Secretaría de Salud estatal",
    situationIntro: "Te dieron el alta antes de tiempo — no firmes bajo presión.",
    situationIntroTranquilo: "Te dieron de alta prematuramente — tienes derecho a cuestionar esa decisión.",
    steps: [
      "No firmes bajo presión. Pide que documenten en tu expediente tu estado actual y el motivo del alta.",
      "Presenta queja ante la dirección del hospital o Secretaría de Salud estatal.",
      "Si hay daño por el alta prematura: CONAMED (800 711 0658) o CNDH (800 008 6900).",
    ],
    stepsTranquilo: [
      "No firmes bajo presión. Solicita que documenten en tu expediente tu estado actual y el motivo del alta.",
      "Presenta una queja ante la dirección del hospital o la Secretaría de Salud de tu estado.",
      "Si hubo daño por el alta anticipada: CONAMED (800 711 0658) o CNDH (800 008 6900).",
    ],
    phone: "800 711 0658",
    url: "gob.mx/conamed",
    docs: ["Nota de alta", "Expediente clínico", "CURP", "Narración del contexto"],
    outcome: "CONAMED: conciliación en 3-4 meses. CNDH: investigación en 90 días.",
    escalationTrain: ["Dirección del hospital", "Sec. Salud estatal", "CONAMED", "CNDH"],
    evidencia: ["Nota de alta", "Expediente clínico", "Testigos"],
  },

  // ── EXPEDIENTE CLÍNICO ─────────────────────────────────────
  "expediente_imss": {
    institution: "IMSS — Módulo de Atención al Derechohabiente",
    situationIntro: "No te dan tu expediente clínico — es tuyo y tienes derecho a él.",
    situationIntroTranquilo: "No te han entregado tu expediente clínico — la ley te garantiza acceso.",
    steps: [
      "Presenta solicitud escrita de copia de expediente clínico completo en el IMSS. La ley establece que deben entregarlo en plazo razonable (NOM-004-SSA3-2012).",
      "Si no lo entregan en 5 días hábiles: queja ante el Módulo de Atención al Derechohabiente indicando la fecha de la solicitud.",
      "Sin respuesta en 15 días: escala a OIC IMSS (800 623 2323 opción 6).",
    ],
    stepsTranquilo: [
      "Presenta una solicitud escrita de copia del expediente clínico completo en el IMSS. Según la NOM-004-SSA3-2012, tienen la obligación de entregarlo.",
      "Si no te lo entregan en 5 días hábiles, presenta una queja en el Módulo de Atención al Derechohabiente indicando la fecha de tu solicitud.",
      "Sin respuesta en 15 días, escala al OIC del IMSS (800 623 2323 opción 6).",
    ],
    phone: "800 623 2323",
    url: "imss.gob.mx/oic/quejasydenuncias",
    docs: ["INE y NSS", "Solicitud escrita con acuse de recibo"],
    outcome: "5 días hábiles para entrega. OIC: investigación en 60 días si no cumplen.",
    escalationTrain: ["Unidad médica IMSS", "Módulo interno IMSS", "OIC IMSS", "CONAMED"],
    evidencia: ["Copia de la solicitud escrita con sello o acuse", "Fecha de entrega prometida si te la dieron"],
  },

  "expediente_issste": {
    institution: "ISSSTE — Área de Expediente Clínico",
    situationIntro: "No te dan tu expediente clínico — es tuyo y tienes derecho a él.",
    situationIntroTranquilo: "No te han entregado tu expediente clínico — la ley te garantiza acceso.",
    steps: [
      "Presenta solicitud escrita en el área de expediente clínico del hospital ISSSTE.",
      "Si no entregan en 5 días hábiles: queja ante el módulo de atención.",
      "Sin respuesta: OIC ISSSTE (800 012 7835).",
    ],
    stepsTranquilo: [
      "Presenta una solicitud escrita en el área de expediente clínico del hospital ISSSTE.",
      "Sin respuesta en 5 días hábiles, presenta una queja en el módulo de atención.",
      "Sin respuesta, escala al OIC del ISSSTE (800 012 7835).",
    ],
    phone: "800 012 7835",
    url: "issste.gob.mx",
    docs: ["Credencial ISSSTE", "Solicitud escrita con acuse de recibo"],
    outcome: "5 días hábiles para entrega. OIC: investigación si no cumplen.",
    escalationTrain: ["Unidad médica ISSSTE", "Módulo interno ISSSTE", "OIC ISSSTE", "CONAMED"],
    evidencia: ["Copia de solicitud escrita con sello", "Fecha prometida si te la dieron"],
  },

  "expediente_imss_bienestar": {
    institution: "CONAMED / CNDH — hospitales SSA o IMSS-Bienestar",
    situationIntro: "No te dan tu expediente clínico — es tuyo y tienes derecho a él.",
    situationIntroTranquilo: "No te han entregado tu expediente clínico — la ley te garantiza acceso.",
    steps: [
      "Presenta solicitud escrita en el hospital indicando que solicitas copia de tu expediente clínico (NOM-004-SSA3-2012 lo garantiza).",
      "Si no lo entregan en 5 días hábiles: queja ante la dirección del hospital o Secretaría de Salud estatal.",
      "Sin solución: CONAMED (800 711 0658) o CNDH (800 008 6900).",
    ],
    stepsTranquilo: [
      "Presenta una solicitud escrita en el hospital, indicando que estás solicitando copia de tu expediente clínico. La NOM-004-SSA3-2012 garantiza tu acceso.",
      "Si no te lo entregan en 5 días hábiles, presenta una queja ante la dirección del hospital o la Secretaría de Salud de tu estado.",
      "Sin solución, acude a CONAMED (800 711 0658) o la CNDH (800 008 6900).",
    ],
    phone: "800 711 0658",
    url: "gob.mx/conamed",
    docs: ["INE o identificación", "CURP", "Solicitud escrita con acuse de recibo"],
    outcome: "5 días hábiles para entrega. CONAMED: conciliación en 3-4 meses.",
    escalationTrain: ["Dirección del hospital", "Sec. Salud estatal", "CONAMED", "CNDH"],
    evidencia: ["Copia de solicitud escrita con sello o acuse", "Fecha prometida si te la dieron"],
  },
};

const FAQ = [
  {
    q: "¿Puedo ir a urgencias de un hospital que no es el mío?",
    a: "Sí. La NOM-027-SSA3-2013 obliga a TODOS los hospitales con servicio de urgencias a atender sin importar tu adscripción, seguro o capacidad de pago. Si te niegan, es una violación de NOM y puedes quejarte en CONAMED o CNDH.",
  },
  {
    q: "¿Pueden retener el cuerpo de mi familiar si no pago?",
    a: "No. El Art. 85 del Reglamento de la LGS prohíbe retener pacientes o cadáveres como garantía de pago. Es ilegal y sancionable administrativamente. Si ocurre, llama a CONAMED: 800 711 0658.",
  },
  {
    q: "¿CONAMED cobra?",
    a: "No. El servicio de conciliación y arbitraje de CONAMED es completamente gratuito para el paciente. Tel: 800 711 0658.",
  },
  {
    q: "¿Necesito abogado para el amparo?",
    a: "Sí, pero no pagas. La Defensoría Pública Federal (IFDP) te asigna un defensor de oficio sin costo. Llama a Defensatel: 800 22 42 426, disponible las 24 horas. Web: ifdp.cjf.gob.mx",
  },
  {
    q: "¿Cuánto tiempo tengo para demandar por negligencia?",
    a: "2 años desde que conociste el daño y al responsable (Art. 1916 del Código Civil Federal). La vía patrimonial del Estado (LFRPE) tiene un plazo más corto: 1 año. No esperes.",
  },
  {
    q: "¿Sin seguro social me pueden cobrar en hospital público?",
    a: "No. El Art. 35 de la LGS establece que los servicios de salud son gratuitos para personas sin seguridad social en establecimientos de la SSA e IMSS-Bienestar. Si te cobran, es ilegal.",
  },
  {
    q: "¿Pueden obligarme a firmar alta voluntaria?",
    a: "No. El alta voluntaria debe ser una decisión libre tuya, sin presión (LGS Art. 51 Bis 2). Si te presionan, niégate, pide que el médico documente tu estado en el expediente, y llama a CONAMED.",
  },
  {
    q: "¿Tengo derecho a ver mi expediente clínico?",
    a: "Sí. Eres el titular de tus datos de salud. Puedes solicitar un resumen clínico o copia del expediente por escrito al director de la unidad. El hospital tiene 5 días hábiles para entregarlo (NOM-004-SSA3-2012).",
  },
  {
    q: "¿CONAMED puede sancionar o meter preso al médico?",
    a: "No. CONAMED solo puede conciliar o arbitrar — buscar un acuerdo entre tú y el médico o institución. No puede revocar cédulas profesionales, imponer multas penales, ni obligar a nadie sin acuerdo previo de arbitraje. Para sanciones penales existe la vía penal (CPF Arts. 228–230). Para responsabilidad institucional, la LFRPE ante el Tribunal Federal de Justicia Administrativa.",
  },
  {
    q: "¿La Carta de Derechos del Paciente es una ley?",
    a: "No. Es una declaración administrativa de la Secretaría de Salud — no una ley ni una NOM. No tiene peso legal en una queja formal. Lo que sí puedes citar: LGS Arts. 51, 51 Bis, 51 Bis 1, 51 Bis 2 y 51 Bis 3, que son los artículos que respaldan esos mismos derechos y sí son exigibles.",
  },
  {
    q: "¿Qué hago si en la farmacia del ISSSTE o IMSS no hay mi medicamento?",
    a: "Pide el talón de surtimiento parcial o la constancia de no surtido. Con ese papel y tu receta, llama al 079 (Receta Completa) o entra a recetacompleta.gob.mx — ten a la mano tu CURP, folio de receta y nombre del medicamento. Si el desabasto persiste, CONAMED puede intervenir y el amparo ha funcionado para medicamentos oncológicos.",
  },
  {
    q: "¿Puedo exigir atención preferente por ser adulto mayor?",
    a: "Sí. La Ley de los Derechos de las Personas Adultas Mayores (LDPAM, Art. 5) establece el derecho de las personas de 60 años o más a atención preferente en establecimientos que prestan servicios públicos, incluyendo clínicas y hospitales del IMSS, ISSSTE e IMSS-Bienestar. Si no te la dan, pídelo al módulo de atención o reporta al OIC de la institución.",
  },
];

const RECURSOS = [
  // Source: CONAMED official X/Twitter July 2025 — address, phones, email verified
  {
    n: "CONAMED",
    d: "Quejas médicas — gratuito",
    t: "800 711 0658 / 55 5420 7000",
    dir: "Av. Marina Nacional 60, Piso 14, Col. Tacuba, CDMX 11410",
    e: "orientacion@conamed.gob.mx",
    w: "gob.mx/conamed",
  },
  // Source: cndh.org.mx — verified 2025
  {
    n: "CNDH",
    d: "Derechos humanos — atención 24 h",
    t: "800 715 2000 / 800 008 6900",
    dir: "Periférico Sur 3469, Col. San Jerónimo Lídice, Alc. La Magdalena Contreras, C.P. 10200, CDMX",
    w: "cndh.org.mx",
  },
  // Source: Defensatel ifdp.cjf.gob.mx — verified 2025; old number 800-009-1700 not confirmed by any source
  {
    n: "Defensoría Pública Federal",
    d: "Abogado gratis para amparo (Defensatel 24 h)",
    t: "800 22 42 426",
    w: "ifdp.cjf.gob.mx",
  },
  // Source: imss.gob.mx/oic — verified 2025
  {
    n: "IMSS — Atención al Derechohabiente",
    d: "Quejas: opción 6",
    t: "800 623 2323",
    w: "imss.gob.mx/oic/quejasydenuncias",
  },
  // Source: institutional sources 2025; include both numbers per research assumption A3
  {
    n: "ISSSTE — Quejas y Orientación",
    d: "Issstetel",
    t: "55 4000 1000 / 800 012 7835",
    e: "quejas@issste.gob.mx",
    w: "issste.gob.mx",
  },
  // Source: IMSS-Bienestar official X/Twitter April 2026 — 800 298 1150, WhatsApp, email verified
  {
    n: "IMSS-Bienestar",
    d: "Sin seguridad social — Siempre Contigo",
    t: "800 298 1150",
    e: "siemprecontigo@imssbienestar.gob.mx",
    w: "imssbienestar.gob.mx",
  },
  // Source: recetacompleta.gob.mx + government news 2025 — verified
  {
    n: "Receta Completa",
    d: "Medicamento no surtido — IMSS, ISSSTE, IMSS-Bienestar",
    t: "079",
    w: "recetacompleta.gob.mx",
  },
  // Source: conapred.org.mx — verified 2025
  {
    n: "CONAPRED",
    d: "Discriminación — quejas gratuitas",
    t: "55 5262 1490 / 800 543 0033",
    e: "quejas@conapred.org.mx",
    w: "conapred.org.mx",
  },
  // Source: gob.mx/conadis — no toll-free phone confirmed; URL only
  {
    n: "CONADIS",
    d: "Discriminación por discapacidad",
    t: "—",
    w: "gob.mx/conadis",
  },
  // Source: SSA internal OIC — email only, no toll-free phone
  {
    n: "Secretaría de Salud — OIC",
    d: "Quejas sobre hospitales y centros de salud SSA",
    t: "—",
    e: "atencionciudadanaoic@salud.gob.mx",
    w: "gob.mx/salud",
  },
  // Source: gob.mx/conasama — verified 2025
  {
    n: "Línea de la Vida",
    d: "Crisis emocional — 24 h",
    t: "800 911 2000",
  },
  // Always correct
  {
    n: "Emergencias",
    d: "Policía, bomberos, ambulancia",
    t: "911",
  },
];

const TABS = [
  ["inicio", "Inicio"],
  ["respuestas", "Respuestas que salvan"],
  ["guia", "Guía"],
  ["queja", "Queja"],
  ["faq", "FAQ"],
  ["recursos", "Recursos"],
];

export default function NoMasPaciente() {
  const [tab, setTab] = useState("inicio");
  const [openFrase, setOpenFrase] = useState(-1);
  const [chapter, setChapter] = useState(0);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [tone, setTone] = useState("directo");
  const [quejaStep, setQuejaStep] = useState(0);
  const [quejaAnswers, setQuejaAnswers] = useState({});
  const isMobile = useIsMobile();

  const onNav = (targetTab, state = {}) => {
    setTab(targetTab);
    if (targetTab === "queja" && state.situation) {
      setQuejaAnswers({ urgency: "pasada", situation: state.situation });
      setQuejaStep(2);
    }
    if (targetTab === "guia" && state.chapterId) {
      const idx = CHAPTERS_V2.findIndex(ch => ch.id === state.chapterId);
      if (idx !== -1) setChapter(idx);
    }
  };

  const [expandedSections, setExpandedSections] = useState({});
  const toggleSection = (chapterId, sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [chapterId + "_" + sectionKey]: !prev[chapterId + "_" + sectionKey]
    }));
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#FFF8F0", letterSpacing: "-0.02em" }}>NO MAS PACIENTE</h1>
          <div style={{ width: 36, height: 2.5, background: C.accent, margin: "6px 0 0", borderRadius: 2 }} />
          <button
            onClick={() => setTone(t => t === "directo" ? "tranquilo" : "directo")}
            style={{
              marginTop: 10, padding: "4px 12px", borderRadius: 4,
              background: "transparent", border: `1px solid ${C.accent}60`,
              color: C.accent, fontSize: 11, cursor: "pointer",
              fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em",
            }}
          >
            {TONE_STRINGS[tone].toneToggleLabel}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", overflowX: "auto", padding: "0 24px" }}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "11px 16px", border: "none", whiteSpace: "nowrap",
              borderBottom: tab === key ? `3px solid ${C.secondary}` : "3px solid transparent",
              background: "none", color: tab === key ? C.primary : C.textSec,
              fontWeight: tab === key ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>

        {/* ── INICIO ── */}
        {tab === "inicio" && (
          <div style={{ padding: "20px 0 32px" }}>
            {/* Hero */}
            <div style={{ background: C.heroBg, borderRadius: 10, padding: "26px 26px 22px", margin: "0 0 28px", border: `1px solid ${C.border}` }}>
              <p style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: C.primary, lineHeight: 1.45 }}>
                Si alguna vez te han negado atencion, te han hecho esperar cuando mas lo necesitabas, o te han dicho que compres tu propio medicamento — esta guia es para ti y tu familia.
              </p>
              <p style={{ margin: 0, fontSize: 13.5, color: C.textSec, lineHeight: 1.6 }}>
                La ley mexicana te protege mas de lo que crees. Aqui te explicamos tus derechos en lenguaje claro, con las leyes exactas que los respaldan.
              </p>
            </div>

            {/* Principles */}
            <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: C.primary }}>Lo que necesitas saber</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {PRINCIPLES.map((p, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 18px 14px", position: "relative" }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 26, fontWeight: 700, color: C.border, position: "absolute", top: 10, right: 14, lineHeight: 1 }}>{p.num}</div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: C.primary, lineHeight: 1.35, paddingRight: 36 }}>{p.title}</h3>
                  <p style={{ margin: "0 0 8px", fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{p.body}</p>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.secondary, background: C.successLight, padding: "2px 6px", borderRadius: 3 }}>{p.ley}</span>
                </div>
              ))}
            </div>

            {/* Emergency */}
            <div style={{ background: `${C.error}08`, border: `1px solid ${C.error}20`, borderRadius: 8, padding: "14px 18px", marginTop: 24, display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: C.error, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: `${C.error}10`, borderRadius: "50%", flexShrink: 0 }}>!</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.error, marginBottom: 2 }}>Si es una emergencia ahora mismo</div>
                <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>Llama al <b>911</b>. Ningun hospital puede negarte atencion de urgencias. Si lo hacen, llama a la CNDH: <b>800-008-6900</b>.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── RESPUESTAS ── */}
        {tab === "respuestas" && (
          <div style={{ padding: "22px 0 32px" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, color: C.primary, fontWeight: 700 }}>Respuestas que salvan</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: C.textSec, lineHeight: 1.5, maxWidth: 560 }}>
              {TONE_STRINGS[tone].checaIntro}
            </p>
            {FRASES.map((f, i) => {
              const isOpen = openFrase === i;
              return (
                <div key={i} style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderLeft: `4px solid ${C.primary}`, borderRadius: 6,
                  padding: "12px 16px", marginBottom: 8,
                  boxShadow: isOpen ? "0 2px 8px rgba(44,24,16,0.06)" : "none",
                }}>
                  <button onClick={() => setOpenFrase(isOpen ? -1 : i)} style={{
                    background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%",
                    textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontFamily: "'Space Mono', monospace", fontSize: 13, color: C.primary, fontWeight: 700,
                  }}>
                    <span>&ldquo;{f.frase}&rdquo;</span>
                    <span style={{ fontSize: 11, color: C.textSec, marginLeft: 8, flexShrink: 0 }}>{isOpen ? "[-]" : "[+]"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ marginTop: 10 }}>
                      <p style={{ fontSize: 12, color: C.textSec, margin: "0 0 8px", lineHeight: 1.5, fontStyle: "italic" }}>{f.sit}</p>
                      <div style={{ background: C.successLight, border: `1px solid ${C.secondary}22`, borderRadius: 5, padding: "10px 14px", marginBottom: 8 }}>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.secondary, fontWeight: 700, marginBottom: 4, letterSpacing: "0.06em" }}>LO QUE PUEDES CONTESTAR:</div>
                        <div style={{ fontSize: 13, lineHeight: 1.55, color: C.text }}>&ldquo;{tone === "directo" ? f.resp : f.respTranquilo}&rdquo;</div>
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.primary, background: C.legalBg, padding: "3px 8px", borderRadius: 3, display: "inline-block" }}>{f.ley}</span>
                      {/* Cross-reference links — per D-03 */}
                      {(f.quejaRef || f.guiaRef) && (
                        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                          {f.quejaRef && (
                            <button
                              onClick={() => onNav("queja", { situation: f.quejaRef })}
                              style={{
                                background: C.secondary, color: "#FFF", border: "none", borderRadius: 4,
                                padding: "5px 12px", fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                              }}
                            >
                              Quéjate aquí →
                            </button>
                          )}
                          {f.guiaRef && (
                            <button
                              onClick={() => onNav("guia", { chapterId: f.guiaRef })}
                              style={{
                                background: "transparent", color: C.primary, border: `1px solid ${C.border}`, borderRadius: 4,
                                padding: "5px 12px", fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                              }}
                            >
                              Saber más →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── GUIA ── */}
        {tab === "guia" && (
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20, padding: "22px 0 32px" }}>
            {/* Chapter sidebar */}
            <div style={{
              width: isMobile ? "100%" : 210, flexShrink: 0,
              borderRight: isMobile ? "none" : `1px solid ${C.border}`,
              borderBottom: isMobile ? `1px solid ${C.border}` : "none",
              paddingRight: isMobile ? 0 : 12,
              paddingBottom: isMobile ? 12 : 0,
              marginBottom: isMobile ? 12 : 0,
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.textSec, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>TEMAS</div>
              {isMobile ? (
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                  {CHAPTERS_V2.map((ch, i) => (
                    <button key={i} onClick={() => setChapter(i)} style={{
                      whiteSpace: "nowrap", padding: "5px 12px", borderRadius: 20,
                      background: i === chapter ? C.primary : C.surface,
                      color: i === chapter ? "#FFF" : C.text,
                      fontSize: 11.5, fontWeight: i === chapter ? 700 : 400,
                      cursor: "pointer", fontFamily: "inherit",
                      border: `1px solid ${i === chapter ? C.primary : C.border}`,
                    }}>{ch.title}</button>
                  ))}
                </div>
              ) : (
                CHAPTERS_V2.map((ch, i) => (
                  <button key={i} onClick={() => setChapter(i)} style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "7px 10px", cursor: "pointer", marginBottom: 1, borderRadius: 4,
                    background: i === chapter ? C.surface : "transparent", border: "none",
                    borderLeft: i === chapter ? `3px solid ${C.secondary}` : "3px solid transparent",
                    fontSize: 12, fontWeight: i === chapter ? 700 : 400,
                    color: i === chapter ? C.primary : C.text, fontFamily: "inherit",
                  }}>{ch.title}</button>
                ))
              )}
            </div>

            {/* Chapter content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {(() => {
                const ch = CHAPTERS_V2[chapter];
                if (!ch) return null;
                const legalOpen = expandedSections[ch.id + "_legal"];
                const popOpen = expandedSections[ch.id + "_populations"];

                return (
                  <div>
                    {/* Emergency banner */}
                    {ch.emergencyBanner && ch.emergencyBanner.visible && (
                      <div style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, borderRadius: 8, padding: "14px 18px", marginBottom: 18 }}>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.error, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>
                          {ch.emergencyBanner.headline}
                        </div>
                        {ch.emergencyBanner.steps.map((step, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, fontSize: 13, lineHeight: 1.55, color: C.text }}>
                            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: C.error, flexShrink: 0 }}>{i + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                        {ch.emergencyBanner.phone && (
                          <div style={{ marginTop: 8, fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: C.error }}>
                            {ch.emergencyBanner.phone}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chapter header */}
                    <h2 style={{ margin: "0 0 6px", fontSize: 20, color: C.primary, fontWeight: 700 }}>{ch.title}</h2>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.secondary, background: C.successLight, padding: "3px 8px", borderRadius: 3, display: "inline-block", marginBottom: 18 }}>{ch.ley}</span>

                    {/* Action layer — always visible */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", marginBottom: 12 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.secondary, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8 }}>QUÉ HACER</div>
                      <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: C.primary, lineHeight: 1.45 }}>{ch.action.headline}</p>
                      {ch.action.steps.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13.5, lineHeight: 1.6, color: C.text }}>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: C.secondary, flexShrink: 0, width: 18 }}>{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                      {ch.action.phone && (
                        <div style={{ marginTop: 10, padding: "8px 12px", background: C.legalBg, borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: C.primary, display: "inline-block" }}>
                          {ch.action.phone}
                        </div>
                      )}
                      {ch.action.crossRef && (
                        <div style={{ marginTop: 10 }}>
                          <button onClick={() => onNav("queja", { situation: ch.id })} style={{
                            background: C.secondary, color: "#FFF", border: "none", borderRadius: 4,
                            padding: "7px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                          }}>
                            Quéjate aquí →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Legal layer — collapsible */}
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
                      <button onClick={() => toggleSection(ch.id, "legal")} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        width: "100%", padding: "11px 16px", cursor: "pointer",
                        background: legalOpen ? C.surface : C.legalBg, border: "none", textAlign: "left", fontFamily: "inherit",
                      }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: "0.06em" }}>BASE LEGAL</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: C.textSec }}>{legalOpen ? "−" : "+"}</span>
                      </button>
                      {legalOpen && (
                        <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}`, background: C.surface }}>
                          {ch.legal.entries ? (
                            ch.legal.entries.map((entry, i) => (
                              <div key={i} style={{ marginBottom: 14 }}>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 3 }}>{entry.term}</div>
                                <div style={{ fontSize: 13, lineHeight: 1.65, color: C.text }}>{entry.def}</div>
                              </div>
                            ))
                          ) : (
                            <p style={{ fontSize: 13.5, lineHeight: 1.75, color: C.text, margin: "0 0 12px" }}>{ch.legal.body}</p>
                          )}
                          {ch.legal.noms && ch.legal.noms.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              {ch.legal.noms.map((nom, i) => (
                                <div key={i} style={{ background: C.legalBg, borderLeft: `3px solid ${C.accent}`, padding: "10px 14px", borderRadius: "0 6px 6px 0", marginBottom: 8 }}>
                                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 3 }}>{nom.id}</div>
                                  <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{nom.text}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {ch.legal.jurisprudencias && ch.legal.jurisprudencias.filter(j => j.confidence === "HIGH").map((j, i) => (
                            <div key={i} style={{ background: `${C.info}08`, borderLeft: `3px solid ${C.info}`, padding: "10px 14px", borderRadius: "0 6px 6px 0", marginBottom: 8, marginTop: 8 }}>
                              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: C.info, marginBottom: 3 }}>SCJN {j.id}</div>
                              <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{j.text}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Populations layer — collapsible, only if not null */}
                    {ch.populations && (
                      <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
                        <button onClick={() => toggleSection(ch.id, "populations")} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          width: "100%", padding: "11px 16px", cursor: "pointer",
                          background: popOpen ? C.surface : C.legalBg, border: "none", textAlign: "left", fontFamily: "inherit",
                        }}>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.info, fontWeight: 700, letterSpacing: "0.06em" }}>SEGÚN TU SITUACIÓN</span>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: C.textSec }}>{popOpen ? "−" : "+"}</span>
                        </button>
                        {popOpen && (
                          <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}`, background: C.surface }}>
                            {[["IMSS", ch.populations.imss], ["ISSSTE", ch.populations.issste], ["Sin seguro / IMSS-Bienestar", ch.populations.sinSeguro]].filter(([, text]) => text).map(([label, text]) => (
                              <div key={label} style={{ marginBottom: 14 }}>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: C.primary, marginBottom: 4, letterSpacing: "0.04em" }}>{label}</div>
                                <div style={{ fontSize: 13, lineHeight: 1.65, color: C.text }}>{text}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── QUEJA ── */}
        {tab === "queja" && (
          <div style={{ padding: "22px 0 32px" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, color: C.primary, fontWeight: 700 }}>Queja</h2>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: C.textSec, lineHeight: 1.5, maxWidth: 560 }}>
              {TONE_STRINGS[tone].quejaIntro}
            </p>

            {/* Reset button (show after step 0) */}
            {quejaStep > 0 && (
              <button
                onClick={() => { setQuejaStep(0); setQuejaAnswers({}); }}
                style={{
                  background: "none", border: `1px solid ${C.border}`, borderRadius: 4,
                  padding: "5px 12px", fontSize: 11.5, color: C.textSec, cursor: "pointer",
                  fontFamily: "'Space Mono', monospace", marginBottom: 20,
                }}
              >
                ← Volver a empezar
              </button>
            )}

            {/* ── STEP 0: Urgency gate ── */}
            {quejaStep === 0 && (
              <div>
                <div style={{ background: C.surface, border: `2px solid ${C.primary}`, borderRadius: 10, padding: "24px 26px", maxWidth: 520 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12 }}>PRIMER PREGUNTA</div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 20px", lineHeight: 1.4 }}>
                    ¿Está pasando AHORA MISMO?
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                      onClick={() => { setQuejaAnswers({ urgency: "ahora" }); setQuejaStep(3); }}
                      style={{
                        flex: 1, minWidth: 120, padding: "12px 18px", borderRadius: 6,
                        background: C.error, color: "#FFF", border: "none",
                        fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      Sí, ahora mismo
                    </button>
                    <button
                      onClick={() => { setQuejaAnswers({ urgency: "pasada" }); setQuejaStep(1); }}
                      style={{
                        flex: 1, minWidth: 120, padding: "12px 18px", borderRadius: 6,
                        background: C.secondary, color: "#FFF", border: "none",
                        fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      No, ya pasó
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 1: Situation grid ── */}
            {quejaStep === 1 && (
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.textSec, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 14 }}>¿QUÉ PASÓ?</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                  {QUEJA_SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => { setQuejaAnswers(prev => ({ ...prev, situation: sc.id })); setQuejaStep(2); }}
                      style={{
                        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
                        padding: "14px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                        borderLeft: `4px solid ${C.primary}`,
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 5 }}>{sc.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 3 }}>{sc.label}</div>
                      <div style={{ fontSize: 11.5, color: C.textSec, lineHeight: 1.5 }}>{sc.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2: Institution picker ── */}
            {quejaStep === 2 && (
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.textSec, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }}>¿CUÁL ES TU INSTITUCIÓN?</div>
                {quejaAnswers.situation && (
                  <div style={{ background: C.legalBg, borderLeft: `4px solid ${C.secondary}`, borderRadius: "0 6px 6px 0", padding: "10px 16px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.secondary, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 2 }}>LO QUE NOS DIJISTE</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.primary, lineHeight: 1.35 }}>{QUEJA_SCENARIOS.find(s => s.id === quejaAnswers.situation)?.label}</div>
                    </div>
                    <button onClick={() => setQuejaStep(1)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px 10px", fontSize: 11, color: C.textSec, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Cambiar</button>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { id: "imss", label: "IMSS", sub: "Trabajador con patrón" },
                    { id: "issste", label: "ISSSTE", sub: "Trabajador del gobierno" },
                    { id: "imss_bienestar", label: "IMSS-Bienestar / SSA", sub: "Sin seguridad social" },
                    { id: "no_se", label: "No sé", sub: "No estoy seguro/a" },
                  ].map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => {
                        const instKey = inst.id === "no_se" ? "imss_bienestar" : inst.id;
                        setQuejaAnswers(prev => ({ ...prev, institution: instKey }));
                        setQuejaStep(3);
                      }}
                      style={{
                        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
                        padding: "14px 12px", textAlign: "center", cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 3 }}>{inst.label}</div>
                      <div style={{ fontSize: 10.5, color: C.textSec, lineHeight: 1.4 }}>{inst.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: Output card ── */}
            {quejaStep === 3 && (() => {
              // Emergency path (urgency = "ahora")
              if (quejaAnswers.urgency === "ahora") {
                return (
                  <div style={{ background: `${C.error}08`, border: `2px solid ${C.error}40`, borderRadius: 10, padding: "22px 24px", maxWidth: 540 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.error, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12 }}>ESTO ES UNA EMERGENCIA — ACTÚA AHORA</div>
                    <div style={{ marginBottom: 16 }}>
                      {[
                        { n: "1", text: "Di en voz alta: 'Exijo atención de urgencias conforme a la NOM-027-SSA3-2013 y el Artículo 55 de la Ley General de Salud. Ningún hospital público puede negarme atención.'" },
                        { n: "2", text: "Llama a la CNDH: 800 008 6900 — disponible 24 horas. Tienen facultad de intervención inmediata." },
                        { n: "3", text: "Pide todo por escrito. Cualquier papel con sello del hospital es evidencia para la queja formal." },
                      ].map(item => (
                        <div key={item.n} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                          <div style={{
                            fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: "#FFF",
                            background: C.error, borderRadius: "50%", width: 26, height: 26,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>{item.n}</div>
                          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.text }}>{item.text}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: C.error, marginBottom: 4 }}>
                      800 008 6900
                    </div>
                    <div style={{ fontSize: 11.5, color: C.textSec }}>CNDH — 24 horas — intervención inmediata</div>
                  </div>
                );
              }

              // Standard path — look up QUEJA_PATHS
              const pathKey = quejaAnswers.situation + "_" + (quejaAnswers.institution || "imss_bienestar");
              const path = QUEJA_PATHS[pathKey];

              if (!path) {
                return (
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "24px", color: C.textSec }}>
                    <p>No encontramos un camino específico para esta combinación. Llama a CONAMED: <strong>800 711 0658</strong> o a la CNDH: <strong>800 008 6900</strong>.</p>
                  </div>
                );
              }

              const currentSteps = tone === "directo" ? path.steps : path.stepsTranquilo;
              const currentSituationIntro = tone === "directo" ? path.situationIntro : path.situationIntroTranquilo;
              const situationLabel = QUEJA_SCENARIOS.find(s => s.id === quejaAnswers.situation)?.label;

              return (
                <div style={{ maxWidth: 620 }}>
                  {/* Situation banner — dominant visual element */}
                  {currentSituationIntro && (
                    <div style={{ background: C.primary, borderRadius: "8px 8px 0 0", padding: "18px 20px 14px" }}>
                      {situationLabel && (
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 6 }}>TU SITUACIÓN</div>
                      )}
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#FFF8F0", lineHeight: 1.35 }}>{currentSituationIntro}</div>
                    </div>
                  )}
                  {/* Institution header — secondary */}
                  <div style={{
                    background: C.secondary,
                    borderRadius: currentSituationIntro ? "0" : "8px 8px 0 0",
                    padding: "10px 20px",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#FFF8F0AA", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 2 }}>DÓNDE IR</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#FFF", lineHeight: 1.3 }}>{path.institution}</div>
                    </div>
                    {path.phone && (
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: "#FFF8F0" }}>{path.phone}</div>
                    )}
                  </div>

                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "0 0 8px 8px", padding: "18px" }}>
                    {/* Steps */}
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.secondary, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12 }}>PASOS</div>
                    {currentSteps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                        <div style={{
                          fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: C.secondary,
                          background: C.successLight, borderRadius: "50%", width: 26, height: 26,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${C.secondary}30`,
                        }}>{i + 1}</div>
                        <div style={{ fontSize: 13.5, lineHeight: 1.65, color: C.text }}>{step}</div>
                      </div>
                    ))}

                    {/* Phone + URL */}
                    {(path.phone || path.url) && (
                      <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                        {path.phone && (
                          <div style={{ padding: "8px 14px", background: C.legalBg, borderRadius: 6, fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: C.primary }}>
                            {path.phone}
                          </div>
                        )}
                        {path.url && (
                          <div style={{ padding: "8px 14px", background: `${C.info}10`, borderRadius: 6, fontSize: 12.5, color: C.info }}>
                            {path.url}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Evidencia checklist */}
                    <div style={{ marginTop: 18, padding: "14px 16px", background: C.legalBg, borderRadius: 6 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.accent, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 10 }}>REÚNE ESTO ANTES</div>
                      {path.evidencia.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>
                          <span style={{ color: C.accent, fontWeight: 700, flexShrink: 0 }}>◆</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Qué llevar (docs) */}
                    <div style={{ marginTop: 14, padding: "14px 16px", background: `${C.info}08`, borderRadius: 6 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.info, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 10 }}>QUÉ LLEVAR</div>
                      {path.docs.map((doc, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: C.text, lineHeight: 1.4 }}>
                          <span style={{ color: C.info, fontWeight: 700, flexShrink: 0 }}>·</span>
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Outcome */}
                    <div style={{ marginTop: 14, fontSize: 12.5, color: C.textSec, lineHeight: 1.5, fontStyle: "italic" }}>
                      {path.outcome}
                    </div>

                    {/* Tren de quejas — escalation ladder */}
                    <div style={{ marginTop: 18 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: C.primary, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 10 }}>TREN DE QUEJAS — ESCALACIÓN</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                        {path.escalationTrain.map((stop, i) => (
                          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{
                              fontSize: 11, fontWeight: i === 0 ? 700 : 500,
                              color: i === 0 ? C.primary : C.textSec,
                              background: i === 0 ? C.legalBg : "transparent",
                              padding: i === 0 ? "3px 8px" : "3px 4px",
                              borderRadius: 4, border: i === 0 ? `1px solid ${C.border}` : "none",
                            }}>{stop}</span>
                            {i < path.escalationTrain.length - 1 && (
                              <span style={{ color: C.textSec, fontSize: 12 }}>→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── FAQ ── */}
        {tab === "faq" && (
          <div style={{ maxWidth: 660, padding: "22px 0 32px" }}>
            <h2 style={{ margin: "0 0 14px", fontSize: 20, color: C.primary, fontWeight: 700 }}>Preguntas frecuentes</h2>
            {FAQ.map((item, i) => {
              const isOpen = faqOpen === i;
              return (
                <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 6, overflow: "hidden" }}>
                  <button onClick={() => setFaqOpen(isOpen ? -1 : i)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    width: "100%", padding: "12px 14px", cursor: "pointer",
                    background: isOpen ? C.surface : "#FAF8F5",
                    border: "none", textAlign: "left", fontFamily: "inherit",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.q}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: C.textSec, flexShrink: 0, marginLeft: 8 }}>{isOpen ? "\u2212" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "12px 14px", fontSize: 13, lineHeight: 1.65, borderTop: `1px solid ${C.border}`, background: C.surface }}>{item.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── RECURSOS ── */}
        {tab === "recursos" && (
          <div style={{ padding: "22px 0 32px" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, color: C.primary, fontWeight: 700 }}>Directorio de ayuda</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: C.textSec }}>Todos estos servicios son gratuitos.</p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {RECURSOS.map((r, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", borderTop: `3px solid ${C.secondary}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 1 }}>{r.n}</div>
                  {r.d && <div style={{ fontSize: 11, color: C.textSec, marginBottom: 6 }}>{r.d}</div>}
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700 }}><a href={`tel:${r.t.split("/")[0].replace(/\s/g, "")}`} style={{ color: C.secondary, textDecoration: "none" }}>{r.t}</a></div>
                  {r.dir && <div style={{ fontSize: 11, color: C.textSec, marginTop: 3 }}>{r.dir}</div>}
                  {r.w && <div style={{ fontSize: 11, marginTop: 2 }}><a href={r.w.startsWith("http") ? r.w : `https://${r.w}`} target="_blank" rel="noopener noreferrer" style={{ color: C.info, textDecoration: "none" }}>{r.w}</a></div>}
                  {r.e && <div style={{ fontSize: 11, marginTop: 2 }}><a href={`mailto:${r.e}`} style={{ color: C.info, textDecoration: "none" }}>{r.e}</a></div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 8, margin: "0 0 8px" }}>
                Leyes completas (PDF oficial)
              </h3>
              <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 12, lineHeight: 2, color: C.info }}>
                <li>
                  <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LGS.pdf" target="_blank" rel="noopener noreferrer" style={{ color: C.info }}>
                    Ley General de Salud (LGS)
                  </a>
                </li>
                <li>
                  <a href="https://www.imss.gob.mx/sites/all/statics/pdf/leyes/LSS.pdf" target="_blank" rel="noopener noreferrer" style={{ color: C.info }}>
                    Ley del Seguro Social (LSS)
                  </a>
                </li>
                <li>
                  <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LISSSTE.pdf" target="_blank" rel="noopener noreferrer" style={{ color: C.info }}>
                    Ley del ISSSTE (LISSSTE)
                  </a>
                </li>
                <li>
                  <a href="http://www.ordenjuridico.gob.mx/Constitucion/4.pdf" target="_blank" rel="noopener noreferrer" style={{ color: C.info }}>
                    Constitución — Art. 4 (derecho a la salud)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 24px", textAlign: "center", marginTop: 8 }}>
        <p style={{ margin: 0, fontSize: 10, color: C.textSec }}>
          {TONE_STRINGS[tone].footer} · Esta es una guía informativa de educación ciudadana. No sustituye asesoría legal profesional.
        </p>
      </div>
    </div>
  );
}
