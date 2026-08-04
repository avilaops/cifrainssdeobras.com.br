/**
 * dados.js — Tabela VAU por UF/Tipo e constantes do sistema
 * Base: IN RFB nº 2.021/2021 | Valores de referência (atualizar mensalmente)
 */

// ─────────────────────────────────────────────────────────
// TIPOS DE OBRA
// ─────────────────────────────────────────────────────────
const TIPOS_OBRA = {
  residencial:   { label: 'Residencial Unifamiliar',   percMO: 0.40 },
  multifamiliar: { label: 'Residencial Multifamiliar', percMO: 0.38 },
  comercial:     { label: 'Comercial / Escritório',    percMO: 0.38 },
  industrial:    { label: 'Industrial / Galpão',       percMO: 0.28 },
  reforma:       { label: 'Reforma',                   percMO: 0.50 },
  demolicao:     { label: 'Demolição',                 percMO: 0.60 },
  piscina:       { label: 'Piscina',                   percMO: 0.45 },
  mista:         { label: 'Mista (Comercial + Res.)',  percMO: 0.39 },
};

// ─────────────────────────────────────────────────────────
// VAU BASE POR UF — Residencial Unifamiliar (R$/m²)
// Referência: valores aproximados jul/2026. Atualizar mensalmente.
// ─────────────────────────────────────────────────────────
const VAU_BASE = {
  SP: 2180, RJ: 2050, MG: 1890, RS: 1950, PR: 1920,
  SC: 1960, DF: 2100, ES: 1850, GO: 1720, MT: 1750,
  MS: 1700, AM: 1780, PA: 1620, BA: 1650, PE: 1680,
  CE: 1620, MA: 1530, PI: 1540, RN: 1600, PB: 1580,
  AL: 1560, SE: 1570, TO: 1650, AP: 1580, RR: 1620,
  RO: 1680, AC: 1640,
};

// Multiplicadores por tipo (relativo ao residencial da mesma UF)
const MULT_TIPO = {
  residencial:   1.00,
  multifamiliar: 0.95,
  comercial:     1.08,
  industrial:    0.63,
  reforma:       0.55,
  demolicao:     0.30,
  piscina:       0.90,
  mista:         1.03,
};

/**
 * Retorna o VAU estimado (R$/m²) para a UF e tipo informados
 */
function getVAU(uf, tipo) {
  const base = VAU_BASE[uf] || VAU_BASE['SP'];
  const mult = MULT_TIPO[tipo] || 1;
  return Math.round(base * mult);
}

// ─────────────────────────────────────────────────────────
// FATOR SOCIAL — apenas Pessoa Física (IN 2.021/2021)
// ─────────────────────────────────────────────────────────
const FATOR_SOCIAL = [
  { ate: 100,   fator: 0.20 },
  { ate: 200,   fator: 0.40 },
  { ate: 300,   fator: 0.55 },
  { ate: 400,   fator: 0.70 },
  { ate: Infinity, fator: 0.90 },
];

function getFatorSocial(areaTotalM2) {
  for (const f of FATOR_SOCIAL) {
    if (areaTotalM2 <= f.ate) return f.fator;
  }
  return 0.90;
}

// ─────────────────────────────────────────────────────────
// ALÍQUOTA INSS
// ─────────────────────────────────────────────────────────
const ALIQUOTA_INSS = 0.20; // 20% sobre RMT

// ─────────────────────────────────────────────────────────
// FATOR DE AJUSTE (art. 33, IN 2.021/2021)
// Redução estimada quando a DCTFWeb é transmitida corretamente.
// Obras ≤350m²: mínimo 50% da RMT declarado → ~68% redução no INSS
// Obras >350m²: mínimo 70% da RMT declarado → ~55% redução no INSS
// ─────────────────────────────────────────────────────────
function getReducaoFatorAjuste(areaTotalM2) {
  return areaTotalM2 <= 350 ? 0.68 : 0.55;
}

// ─────────────────────────────────────────────────────────
// MESES entre duas datas (para parcelamento)
// ─────────────────────────────────────────────────────────
function mesesEntreDatas(dataInicio, dataFim) {
  const d1 = new Date(dataInicio);
  const d2 = new Date(dataFim);
  return Math.max(1, (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()));
}
