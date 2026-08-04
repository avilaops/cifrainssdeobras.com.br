/**
 * Tabela VAU por UF/Tipo e constantes do sistema.
 * Base: IN RFB nº 2.021/2021 | Aferição Indireta de Obras (SERO).
 */

export const TIPOS_OBRA = {
  residencial: { label: "Residencial Unifamiliar", percMO: 0.20, equivalencia: 0.89 },
  multifamiliar: { label: "Residencial Multifamiliar", percMO: 0.20, equivalencia: 0.85 },
  comercial: { label: "Comercial / Escritório", percMO: 0.20, equivalencia: 0.90 },
  industrial: { label: "Industrial / Galpão", percMO: 0.20, equivalencia: 0.70 },
  reforma: { label: "Reforma", percMO: 0.20, equivalencia: 1.00 },
  demolicao: { label: "Demolição", percMO: 0.20, equivalencia: 1.00 },
  piscina: { label: "Piscina", percMO: 0.20, equivalencia: 1.00 },
  mista: { label: "Mista (Comercial + Res.)", percMO: 0.20, equivalencia: 0.87 },
  pavimentacao: { label: "Pavimentação Asfáltica", percMO: 0.04, equivalencia: 1.00 },
  terraplenagem: { label: "Terraplenagem / Dragagem", percMO: 0.06, equivalencia: 1.00 },
  obraArte: { label: "Obra de Arte Especial", percMO: 0.18, equivalencia: 1.00 },
  drenagem: { label: "Drenagem", percMO: 0.20, equivalencia: 1.00 },
  naoPredial: { label: "Não Predial - Demais Serviços", percMO: 0.14, equivalencia: 1.00 },
} as const;

export type TipoObraKey = keyof typeof TIPOS_OBRA;

/** Percentuais de equivalência de área por destinação (IN 2.021/2021). */
export const PERCENTUAL_EQUIVALENCIA: Record<TipoObraKey, number> = {
  residencial: 0.89,
  multifamiliar: 0.85,
  comercial: 0.90,
  industrial: 0.70,
  reforma: 1.00,
  demolicao: 1.00,
  piscina: 1.00,
  mista: 0.87,
  pavimentacao: 1.00,
  terraplenagem: 1.00,
  obraArte: 1.00,
  drenagem: 1.00,
  naoPredial: 1.00,
};

export const VAU_BASE: Record<string, number> = {
  SP: 2661, RJ: 2450, MG: 2190, RS: 2250, PR: 2220,
  SC: 2260, DF: 2400, ES: 2150, GO: 2020, MT: 2050,
  MS: 2000, AM: 2080, PA: 1920, BA: 1950, PE: 1980,
  CE: 1920, MA: 1830, PI: 1840, RN: 1900, PB: 1880,
  AL: 1860, SE: 1870, TO: 1950, AP: 1880, RR: 1920,
  RO: 1980, AC: 1940,
};

export const MULT_TIPO: Record<TipoObraKey, number> = {
  residencial: 1.0,
  multifamiliar: 0.95,
  comercial: 1.08,
  industrial: 0.63,
  reforma: 0.55,
  demolicao: 0.3,
  piscina: 0.9,
  mista: 1.03,
  pavimentacao: 1,
  terraplenagem: 1,
  obraArte: 1,
  drenagem: 1,
  naoPredial: 1,
};

export const TIPOS_NAO_PREDIAIS: TipoObraKey[] = [
  "pavimentacao",
  "terraplenagem",
  "obraArte",
  "drenagem",
  "naoPredial",
];

export const PERCENTUAL_RMT_NAO_PREDIAL: Partial<Record<TipoObraKey, number>> = {
  pavimentacao: 0.04,
  terraplenagem: 0.06,
  obraArte: 0.18,
  drenagem: 0.20,
  naoPredial: 0.14,
};

export function isObraNaoPredial(tipo: TipoObraKey): boolean {
  return TIPOS_NAO_PREDIAIS.includes(tipo);
}

const MULT_MATERIAL: Record<string, number> = {
  ALVENARIA: 1.0,
  MADEIRA: 0.85,
  MISTA: 0.92,
};

export function getVAU(uf: string, tipo: TipoObraKey, material = "ALVENARIA"): number {
  const base = VAU_BASE[uf] || VAU_BASE.SP;
  const mult = MULT_TIPO[tipo] || 1;
  const multMat = MULT_MATERIAL[material] || 1;
  return Math.round(base * mult * multMat);
}

/** Fator Social — apenas Pessoa Física em Obras Prediais (IN 2.021/2021). */
const FATOR_SOCIAL = [
  { ate: 100, fator: 0.20 },
  { ate: 200, fator: 0.40 },
  { ate: 300, fator: 0.55 },
  { ate: 400, fator: 0.70 },
  { ate: Infinity, fator: 0.90 },
];

export function getFatorSocial(areaTotalM2: number): number {
  for (const f of FATOR_SOCIAL) {
    if (areaTotalM2 <= f.ate) return f.fator;
  }
  return 0.90;
}

/** Percentual mínimo da RMT a comprovar em DCTFWeb para uso do Fator de Ajuste (Art. 33 IN 2.021/2021). */
export function getReducaoFatorAjuste(areaTotalM2: number): number {
  return areaTotalM2 <= 350 ? 0.50 : 0.70;
}

export function mesesEntreDatasRaw(dataInicio: string | Date, dataFim: string | Date): number {
  const d1 = new Date(dataInicio);
  const d2 = new Date(dataFim);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

export function mesesEntreDatas(dataInicio: string | Date, dataFim: string | Date): number {
  return Math.max(1, mesesEntreDatasRaw(dataInicio, dataFim));
}
