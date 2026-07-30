/**
 * Motor de cálculo INSS de Obra (Aferição Indireta - SERO / Receita Federal).
 * Base Legal: IN RFB nº 2.021/2021.
 * 
 * Regra Oficial:
 * 1. Área de Equivalência = Área Total × % Equivalência por Tipo (arredondado em 2 casas decimais)
 * 2. COD = Área de Equivalência × VAU (-5% se Concreto Usinado)
 * 3. COD com Fator Social = COD × Fator Social (tabela progressiva PF)
 * 4. RMT = COD com Fator Social × 20% (alíquota de mão de obra)
 * 5. INSS Devido (Sem Planejamento) = RMT × 36.80% (alíquota total de aferição indireta)
 * 6. Fator de Ajuste (Com Planejamento / DCTFWeb):
 *    - RMT Mínima exigida em DCTFWeb = RMT × 50% (obras ≤ 350m²) ou 70% (obras > 350m²)
 *    - INSS com Fator de Ajuste = RMT Mínima × 20% (alíquota patronal)
 */
import {
  type TipoObraKey,
  PERCENTUAL_EQUIVALENCIA,
  PERCENTUAL_RMT_NAO_PREDIAL,
  getFatorSocial,
  getReducaoFatorAjuste,
  getVAU,
  isObraNaoPredial,
  mesesEntreDatas,
} from "./dados";

/** Alíquota total INSS obras na Aferição Indireta (Patronal 20% + Empregado ~9% + Terceiros ~7,8%). */
export const ALIQUOTA_INSS = 0.368;

/** Alíquota Patronal devida no Fator de Ajuste via DCTFWeb. */
export const ALIQUOTA_PATRONAL = 0.20;

export interface SimulacaoInput {
  responsavel: "pf" | "pj";
  uf: string;
  tipo: TipoObraKey;
  areaConstrucao: number;
  areaReforma: number;
  areaDemolicao: number;
  areaPiscina: number;
  concretoUsinado: boolean;
  dataInicio: string;
  dataFim: string;
  vauManual?: number;
  percHonorarios: number;
}

export interface SimulacaoResultado {
  vauUsado: number;
  areaTotal: number;
  areaEquivalente: number;
  fatorSocial: number;
  codTotal: number;
  codComFatorSocial: number;
  rmtTotal: number;
  inssBruto: number;
  inssDevido: number;
  podeAjuste: boolean;
  minPercentDctfweb: number;
  rmtMinimaDctfweb: number;
  inssMinimoDctfweb: number;
  reducaoPercent: number;
  inssComReducao: number;
  economiaImposto: number;
  honorarios: number;
  economiaLiq: number;
  retroativo: number;
  futuro: number;
  mesesFuturos: number;
  parcelaMensal: number;
}

function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calcularINSS(p: SimulacaoInput): SimulacaoResultado {
  const hoje = new Date();

  const vauManual = p.vauManual ?? 0;
  const vau = vauManual > 0 ? vauManual : getVAU(p.uf, p.tipo);
  const vauReforma = vauManual > 0 ? vauManual * 0.55 : getVAU(p.uf, "reforma");
  const vauDemolicao = vauManual > 0 ? vauManual * 0.3 : getVAU(p.uf, "demolicao");
  const vauPiscina = vauManual > 0 ? vauManual * 0.9 : getVAU(p.uf, "piscina");

  const areaConstrucao = p.areaConstrucao || 0;
  const areaReforma = p.areaReforma || 0;
  const areaDemolicao = p.areaDemolicao || 0;
  const areaPiscina = p.areaPiscina || 0;
  const areaTotal = round2(areaConstrucao + areaReforma + areaDemolicao + areaPiscina);

  // 1. Percentual de Equivalência e Área Equivalente por Destinação (SERO arredonda a área equivalente em 2 casas)
  const percEquivConstrucao = PERCENTUAL_EQUIVALENCIA[p.tipo] ?? 0.89;
  const percEquivReforma = PERCENTUAL_EQUIVALENCIA.reforma ?? 1.0;
  const percEquivDemolicao = PERCENTUAL_EQUIVALENCIA.demolicao ?? 1.0;
  const percEquivPiscina = PERCENTUAL_EQUIVALENCIA.piscina ?? 1.0;

  const areaEquivConstrucao = round2(areaConstrucao * percEquivConstrucao);
  const areaEquivReforma = round2(areaReforma * percEquivReforma);
  const areaEquivDemolicao = round2(areaDemolicao * percEquivDemolicao);
  const areaEquivPiscina = round2(areaPiscina * percEquivPiscina);

  const areaEquivalente = round2(areaEquivConstrucao + areaEquivReforma + areaEquivDemolicao + areaEquivPiscina);

  // 2. COD (Custo da Obra por Destinação) = Área Equivalente x VAU
  let codConstrucao = areaEquivConstrucao * vau;
  const codReforma = areaEquivReforma * vauReforma;
  const codDemolicao = areaEquivDemolicao * vauDemolicao;
  const codPiscina = areaEquivPiscina * vauPiscina;

  // Dedução concreto usinado (-5% sobre COD de construção)
  if (p.concretoUsinado) codConstrucao *= 0.95;

  const codTotal = round2(codConstrucao + codReforma + codDemolicao + codPiscina);

  // 3. Fator Social (apenas Pessoa Física em Obras Prediais)
  const fatorSocial = p.responsavel === "pf" && !isObraNaoPredial(p.tipo) ? getFatorSocial(areaTotal) : 1.0;
  const codComFatorSocial = round2(codTotal * fatorSocial);

  // 4. RMT (Remuneração da Mão de Obra Total)
  const percMO = PERCENTUAL_RMT_NAO_PREDIAL[p.tipo] ?? 0.20; // 20% para obras prediais (IN 2.021/2021)
  const rmtTotal = round2(codComFatorSocial * percMO);

  // 5. INSS Devido Sem Planejamento (Aferição Indireta = RMT x 36.80%)
  const inssBruto = round2(rmtTotal * ALIQUOTA_INSS);
  const inssDevido = inssBruto;

  // 6. Fator de Ajuste (Art. 33 IN 2.021/2021)
  const podeAjuste = p.responsavel === "pf" && !isObraNaoPredial(p.tipo);
  const minPercentDctfweb = podeAjuste ? getReducaoFatorAjuste(areaTotal) : 0;
  const rmtMinimaDctfweb = round2(rmtTotal * minPercentDctfweb);
  
  // INSS no Fator de Ajuste = RMT Mínima x 20% (alíquota patronal)
  const inssMinimoDctfweb = podeAjuste ? round2(rmtMinimaDctfweb * ALIQUOTA_PATRONAL) : inssDevido;
  const inssComReducao = inssMinimoDctfweb;

  // 7. Economia Gerada
  const economiaImposto = round2(inssDevido - inssComReducao);
  const reducaoPercent = inssDevido > 0 ? (economiaImposto / inssDevido) * 100 : 0;
  const honorarios = round2(economiaImposto * (p.percHonorarios || 0.30));
  const economiaLiq = round2(economiaImposto - honorarios);

  // 8. Parcelamento
  const dataInicio = p.dataInicio;
  const dataFim = p.dataFim;
  const hojeStr = hoje.toISOString().slice(0, 10);

  const mesesRetro = Math.max(0, mesesEntreDatas(dataInicio, hojeStr));
  const mesesFuturos = Math.max(0, mesesEntreDatas(hojeStr, dataFim));
  const mesesTotal = Math.max(1, mesesEntreDatas(dataInicio, dataFim));

  const proporcaoRetro = Math.min(1, mesesRetro / mesesTotal);
  const proporcaoFuturo = 1 - proporcaoRetro;

  const retroativo = round2(inssComReducao * proporcaoRetro);
  const futuro = round2(inssComReducao * proporcaoFuturo);
  const parcelaMensal = mesesFuturos > 0 ? round2(futuro / mesesFuturos) : 0;

  return {
    vauUsado: vau,
    areaTotal,
    areaEquivalente,
    fatorSocial,
    codTotal,
    codComFatorSocial,
    rmtTotal,
    inssBruto,
    inssDevido,
    podeAjuste,
    minPercentDctfweb,
    rmtMinimaDctfweb,
    inssMinimoDctfweb,
    reducaoPercent,
    inssComReducao,
    economiaImposto,
    honorarios,
    economiaLiq,
    retroativo,
    futuro,
    mesesFuturos,
    parcelaMensal,
  };
}

export function brl(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function num(v: number, c = 2): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: c, maximumFractionDigits: c });
}
