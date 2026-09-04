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

/**
 * Mapeia os tipos do simulador para as colunas da Tabela VAU oficial (e-CAC/Receita Federal).
 * Tipos sem coluna oficial (mista e não-prediais) continuam no VAU_BASE hardcoded.
 */
export const TIPO_OBRA_VAU: Partial<Record<TipoObraKey, string>> = {
  residencial: "RESIDENCIAL_UNIFAMILIAR",
  multifamiliar: "RESIDENCIAL_MULTIFAMILIAR",
  comercial: "COMERCIAL_SALAS_LOJAS",
  industrial: "GALPAO_INDUSTRIAL",
};

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

/**
 * Tabela VAU de referência (obsoleta — a fonte de verdade é a tabela `vau_mensal` do Banco de Dados).
 */
export const VAU_BASE: Record<string, number> = {};

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
  const base = VAU_BASE[uf] || VAU_BASE.SP || 2600;
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
  return (d2.getUTCFullYear() - d1.getUTCFullYear()) * 12 + (d2.getUTCMonth() - d1.getUTCMonth());
}

export function mesesEntreDatas(dataInicio: string | Date, dataFim: string | Date): number {
  return Math.max(1, mesesEntreDatasRaw(dataInicio, dataFim));
}
